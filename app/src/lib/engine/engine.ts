/**
 * The WebGPU renderer. Framework-free: give it a canvas, packed primitives and
 * per-frame parameters. It also exposes a probe that evaluates the shaders'
 * line integrals for arbitrary rays, which the self-test compares with the
 * reference implementation.
 */
import { cameraBasis, type View } from './camera';
import { MAX_PRIMS, PRIM_STRIDE, type PackedPrims } from './scene';
import type { Vec3 } from './types';
import blurWgsl from './wgsl/blur.wgsl?raw';
import fieldWgsl from './wgsl/field.wgsl?raw';
import frameWgsl from './wgsl/frame.wgsl?raw';
import kernelsWgsl from './wgsl/kernels.wgsl?raw';
import lightWgsl from './wgsl/light.wgsl?raw';
import nearWgsl from './wgsl/near.wgsl?raw';
import nearPassWgsl from './wgsl/nearpass.wgsl?raw';
import probeWgsl from './wgsl/probe.wgsl?raw';
import thermalWgsl from './wgsl/thermal.wgsl?raw';
import wavesWgsl from './wgsl/waves.wgsl?raw';
import { MAX_WAVE_SOURCES, WAVE_STRIDE, type PackedWaves } from './waves';

export const MODE_LIGHT = 0;
export const MODE_THERMAL = 1;
export const MODE_NEAR = 2;
export const MODE_WAVES = 3;
export const MODE_FIELD = 4;
export type Mode =
	| typeof MODE_LIGHT
	| typeof MODE_THERMAL
	| typeof MODE_NEAR
	| typeof MODE_WAVES
	| typeof MODE_FIELD;

export interface FrameParams {
	view: View;
	/** Divider position as a fraction of the width; left of it shows `left`. */
	divider: number;
	left: Mode;
	right: Mode;
	/** Brightness multiplier for the thermal view. */
	exposure: number;
	/** Radius, in pixels, of the display glare drawn for point-like sources. */
	glarePixels: number;
	/** Unit vector toward the Sun, for the light view. */
	sunDirection: Vec3;
	timeSeconds: number;
	/** Brightness multiplier for the near-field view. */
	nearExposure?: number;
	/** Brightness multiplier for the light view (a long exposure at night). */
	lightExposure?: number;
	/** Standard deviation of the near-field blur, radians. */
	nearBlur?: number;
	/** Radius around the observer left out of the near-field view, metres. */
	exclusion?: number;
	/** Light the ordinary view as a room instead of a night sky. */
	room?: boolean;
	/** Add a faint copy of the ordinary picture to the near-field view. */
	nearOutline?: boolean;
	/** Brightness multiplier for the wave view. */
	waveExposure?: number;
	/**
	 * The field view's slice: its distance from the camera (m), the typical
	 * size of the tidal tensor there (in packed units), and the opacity of the
	 * colours over the near-field image.
	 */
	field?: { depth: number; reference: number; opacity: number };
}

export class EngineUnavailable extends Error {}

const FRAME_BYTES = 144;
const NEAR_FORMAT: GPUTextureFormat = 'rgba16float';

async function compile(device: GPUDevice, label: string, parts: string[]) {
	const module = device.createShaderModule({ label, code: parts.join('\n') });
	const info = await module.getCompilationInfo();
	const errors = info.messages.filter((m) => m.type === 'error');
	if (errors.length) {
		throw new Error(
			`Shader "${label}" failed to compile: ` +
				errors.map((m) => `${m.lineNum}:${m.linePos} ${m.message}`).join('; ')
		);
	}
	return module;
}

export class Engine {
	private primCount = 0;
	private waveCount = 0;
	private probePipeline: GPUComputePipeline | undefined;
	// near-field targets, at reduced resolution; `a` holds the finished map
	private near: { width: number; height: number; a: GPUTexture; b: GPUTexture } | undefined;
	private frameGroup: GPUBindGroup | undefined;
	private blurGroups: [GPUBindGroup, GPUBindGroup] | undefined;

	private constructor(
		private readonly device: GPUDevice,
		private readonly context: GPUCanvasContext,
		private readonly canvas: HTMLCanvasElement,
		private readonly format: GPUTextureFormat,
		private readonly framePipeline: GPURenderPipeline,
		private readonly columnPipeline: GPURenderPipeline,
		private readonly blurPipeline: GPURenderPipeline,
		private readonly frameBuffer: GPUBuffer,
		private readonly columnFrameBuffer: GPUBuffer,
		private readonly blurBuffers: [GPUBuffer, GPUBuffer],
		private readonly primBuffer: GPUBuffer,
		private readonly waveBuffer: GPUBuffer,
		private readonly columnGroup: GPUBindGroup,
		private readonly sampler: GPUSampler
	) {}

	/** Whether this browser exposes WebGPU at all. */
	static supported(): boolean {
		return typeof navigator !== 'undefined' && 'gpu' in navigator;
	}

	static async create(canvas: HTMLCanvasElement): Promise<Engine> {
		if (!Engine.supported()) {
			throw new EngineUnavailable('This browser does not support WebGPU.');
		}
		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) throw new EngineUnavailable('No WebGPU adapter is available on this device.');
		const device = await adapter.requestDevice();
		device.addEventListener('uncapturederror', (event) => {
			console.error('WebGPU error:', event.error.message);
		});
		const context = canvas.getContext('webgpu');
		if (!context) throw new EngineUnavailable('Could not create a WebGPU canvas context.');
		const format = navigator.gpu.getPreferredCanvasFormat();
		context.configure({ device, format, alphaMode: 'opaque' });

		const frameModule = await compile(device, 'frame', [
			kernelsWgsl,
			thermalWgsl,
			lightWgsl,
			nearWgsl,
			fieldWgsl,
			wavesWgsl,
			frameWgsl
		]);
		const columnModule = await compile(device, 'near column', [
			kernelsWgsl,
			nearWgsl,
			nearPassWgsl
		]);
		const blurModule = await compile(device, 'blur', [blurWgsl]);

		const primitive: GPUPrimitiveState = { topology: 'triangle-list' };
		const framePipeline = device.createRenderPipeline({
			label: 'frame',
			layout: 'auto',
			vertex: { module: frameModule, entryPoint: 'vs' },
			fragment: { module: frameModule, entryPoint: 'fs', targets: [{ format }] },
			primitive
		});
		const columnPipeline = device.createRenderPipeline({
			label: 'near column',
			layout: 'auto',
			vertex: { module: columnModule, entryPoint: 'vs' },
			fragment: {
				module: columnModule,
				entryPoint: 'fs_column',
				targets: [{ format: NEAR_FORMAT }]
			},
			primitive
		});
		const blurPipeline = device.createRenderPipeline({
			label: 'blur',
			layout: 'auto',
			vertex: { module: blurModule, entryPoint: 'vs' },
			fragment: { module: blurModule, entryPoint: 'fs', targets: [{ format: NEAR_FORMAT }] },
			primitive
		});

		const uniform = (label: string, size: number) =>
			device.createBuffer({
				label,
				size,
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
			});
		const frameBuffer = uniform('frame uniforms', FRAME_BYTES);
		const columnFrameBuffer = uniform('near column uniforms', FRAME_BYTES);
		const blurBuffers: [GPUBuffer, GPUBuffer] = [uniform('blur x', 16), uniform('blur y', 16)];
		const primBuffer = device.createBuffer({
			label: 'primitives',
			size: PRIM_STRIDE * MAX_PRIMS,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		const waveBuffer = device.createBuffer({
			label: 'wave sources',
			size: WAVE_STRIDE * MAX_WAVE_SOURCES,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		const columnGroup = device.createBindGroup({
			layout: columnPipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: columnFrameBuffer } },
				{ binding: 1, resource: { buffer: primBuffer } }
			]
		});
		const sampler = device.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge'
		});
		return new Engine(
			device,
			context,
			canvas,
			format,
			framePipeline,
			columnPipeline,
			blurPipeline,
			frameBuffer,
			columnFrameBuffer,
			blurBuffers,
			primBuffer,
			waveBuffer,
			columnGroup,
			sampler
		);
	}

	setPrims(prims: PackedPrims): void {
		this.device.queue.writeBuffer(this.primBuffer, 0, prims.buffer);
		this.primCount = prims.count;
	}

	/** The sources the wave view draws (see `packWaves`). */
	setWaves(waves: PackedWaves): void {
		this.device.queue.writeBuffer(this.waveBuffer, 0, waves.buffer);
		this.waveCount = waves.count;
	}

	private frameData(p: FrameParams, width: number, height: number): ArrayBuffer {
		const data = new ArrayBuffer(FRAME_BYTES);
		const f = new Float32Array(data);
		const u = new Uint32Array(data);
		const { right, up, forward } = cameraBasis(p.view);
		const t = Math.tan(p.view.fov / 2);
		f.set([...right, t * (width / height)], 0);
		f.set([...up, t], 4);
		f.set([...forward, (2 * t) / height], 8);
		f.set([width, height, p.divider * width, p.timeSeconds], 12);
		f.set([p.exposure, p.glarePixels, p.lightExposure ?? 1, p.nearExposure ?? 1], 16);
		f.set([...p.sunDirection, 0], 20);
		f.set([p.exclusion ?? 0.25, this.waveCount, p.waveExposure ?? 1, 0], 24);
		u.set([this.primCount, p.left, p.right, (p.room ? 1 : 0) | (p.nearOutline ? 2 : 0)], 28);
		f.set([p.field?.depth ?? 0, p.field?.reference ?? 1, p.field?.opacity ?? 0, 0], 32);
		return data;
	}

	/** Make sure the reduced-resolution targets exist at this size. */
	private ensureNear(width: number, height: number): void {
		if (this.near?.width === width && this.near.height === height) return;
		this.near?.a.destroy();
		this.near?.b.destroy();
		const make = (label: string) =>
			this.device.createTexture({
				label,
				size: [width, height],
				format: NEAR_FORMAT,
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
			});
		const a = make('near a');
		const b = make('near b');
		this.near = { width, height, a, b };
		const blurGroup = (buffer: GPUBuffer, source: GPUTexture) =>
			this.device.createBindGroup({
				layout: this.blurPipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: { buffer } },
					{ binding: 1, resource: source.createView() },
					{ binding: 2, resource: this.sampler }
				]
			});
		// blur along x reads a and writes b; along y reads b and writes a
		this.blurGroups = [blurGroup(this.blurBuffers[0], a), blurGroup(this.blurBuffers[1], b)];
		this.frameGroup = this.device.createBindGroup({
			layout: this.framePipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: this.frameBuffer } },
				{ binding: 1, resource: { buffer: this.primBuffer } },
				{ binding: 2, resource: a.createView() },
				{ binding: 3, resource: this.sampler },
				{ binding: 4, resource: { buffer: this.waveBuffer } }
			]
		});
	}

	private fullScreenPass(
		encoder: GPUCommandEncoder,
		target: GPUTextureView,
		pipeline: GPURenderPipeline,
		group: GPUBindGroup
	): void {
		const pass = encoder.beginRenderPass({
			colorAttachments: [
				{ view: target, loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }
			]
		});
		pass.setPipeline(pipeline);
		pass.setBindGroup(0, group);
		pass.draw(3);
		pass.end();
	}

	private draw(target: GPUTextureView, p: FrameParams, width: number, height: number): void {
		const { device } = this;
		const encoder = device.createCommandEncoder();
		const usesNear = (m: Mode) => m === MODE_NEAR || m === MODE_FIELD;
		const wantsNear = usesNear(p.left) || usesNear(p.right);

		if (wantsNear) {
			// The blur can span much of the picture, so it is done at reduced
			// resolution: the wider the blur, the coarser the grid may be.
			const pixelAngle = (2 * Math.tan(p.view.fov / 2)) / height;
			const sigmaPixels = (p.nearBlur ?? 0) / pixelAngle;
			const scale = Math.min(32, Math.max(2, Math.ceil(sigmaPixels / 8)));
			const w = Math.max(1, Math.ceil(width / scale));
			const h = Math.max(1, Math.ceil(height / scale));
			this.ensureNear(w, h);
			device.queue.writeBuffer(this.columnFrameBuffer, 0, this.frameData(p, w, h));
			const sigma = sigmaPixels / scale;
			device.queue.writeBuffer(this.blurBuffers[0], 0, new Float32Array([1, 0, sigma, 0]));
			device.queue.writeBuffer(this.blurBuffers[1], 0, new Float32Array([0, 1, sigma, 0]));
			const near = this.near!;
			this.fullScreenPass(encoder, near.a.createView(), this.columnPipeline, this.columnGroup);
			this.fullScreenPass(encoder, near.b.createView(), this.blurPipeline, this.blurGroups![0]);
			this.fullScreenPass(encoder, near.a.createView(), this.blurPipeline, this.blurGroups![1]);
		} else {
			this.ensureNear(this.near?.width ?? 1, this.near?.height ?? 1);
		}

		device.queue.writeBuffer(this.frameBuffer, 0, this.frameData(p, width, height));
		this.fullScreenPass(encoder, target, this.framePipeline, this.frameGroup!);
		device.queue.submit([encoder.finish()]);
	}

	render(p: FrameParams): void {
		this.draw(
			this.context.getCurrentTexture().createView(),
			p,
			this.canvas.width,
			this.canvas.height
		);
	}

	/**
	 * Draw a frame off screen and read it back: `width * height * 4` bytes, rows
	 * from the top, in RGBA order whatever the canvas format is. For tests and
	 * for capturing stills.
	 */
	async readFrame(p: FrameParams, width: number, height: number): Promise<Uint8Array> {
		const device = this.device;
		const texture = device.createTexture({
			size: [width, height],
			format: this.format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
		});
		const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
		const buffer = device.createBuffer({
			size: bytesPerRow * height,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
		});
		this.draw(texture.createView(), p, width, height);
		const encoder = device.createCommandEncoder();
		encoder.copyTextureToBuffer({ texture }, { buffer, bytesPerRow }, [width, height]);
		device.queue.submit([encoder.finish()]);
		await buffer.mapAsync(GPUMapMode.READ);
		const raw = new Uint8Array(buffer.getMappedRange());
		const out = new Uint8Array(width * height * 4);
		const swap = this.format.startsWith('bgra');
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const s = y * bytesPerRow + x * 4;
				const d = (y * width + x) * 4;
				out[d] = raw[s + (swap ? 2 : 0)];
				out[d + 1] = raw[s + 1];
				out[d + 2] = raw[s + (swap ? 0 : 2)];
				out[d + 3] = raw[s + 3];
			}
		}
		buffer.unmap();
		buffer.destroy();
		texture.destroy();
		return out;
	}

	/**
	 * Evaluate the shaders' line integrals for the given unit directions.
	 * Returns four floats per ray: the thermal column in units of the reference
	 * radiance, the tidal column in units of the reference tidal column, and two
	 * zeros.
	 */
	async probe(directions: Float32Array, exclusion = 0.25): Promise<Float32Array> {
		const n = directions.length / 3;
		const device = this.device;
		if (!this.probePipeline) {
			const module = await compile(device, 'probe', [
				kernelsWgsl,
				thermalWgsl,
				nearWgsl,
				probeWgsl
			]);
			this.probePipeline = await device.createComputePipelineAsync({
				label: 'probe',
				layout: 'auto',
				compute: { module, entryPoint: 'main' }
			});
		}
		const rays = new Float32Array(n * 4);
		for (let i = 0; i < n; i++) rays.set(directions.subarray(i * 3, i * 3 + 3), i * 4);
		const rayBuffer = device.createBuffer({
			size: rays.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		device.queue.writeBuffer(rayBuffer, 0, rays);
		const outBuffer = device.createBuffer({
			size: rays.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
		});
		const readBuffer = device.createBuffer({
			size: rays.byteLength,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
		});
		// the probe needs the primitive count and the exclusion radius from the frame block
		const frame = new ArrayBuffer(FRAME_BYTES);
		new Float32Array(frame).set([exclusion, 0, 0, 0], 24);
		new Uint32Array(frame).set([this.primCount, 0, 0, 0], 28);
		const frameBuffer = device.createBuffer({
			size: FRAME_BYTES,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		device.queue.writeBuffer(frameBuffer, 0, frame);

		const bindGroup = device.createBindGroup({
			layout: this.probePipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: frameBuffer } },
				{ binding: 1, resource: { buffer: this.primBuffer } },
				{ binding: 2, resource: { buffer: rayBuffer } },
				{ binding: 3, resource: { buffer: outBuffer } }
			]
		});
		const encoder = device.createCommandEncoder();
		const pass = encoder.beginComputePass();
		pass.setPipeline(this.probePipeline);
		pass.setBindGroup(0, bindGroup);
		pass.dispatchWorkgroups(Math.ceil(n / 64));
		pass.end();
		encoder.copyBufferToBuffer(outBuffer, 0, readBuffer, 0, rays.byteLength);
		device.queue.submit([encoder.finish()]);
		await readBuffer.mapAsync(GPUMapMode.READ);
		const result = new Float32Array(readBuffer.getMappedRange().slice(0));
		readBuffer.unmap();
		for (const b of [rayBuffer, outBuffer, readBuffer, frameBuffer]) b.destroy();
		return result;
	}

	destroy(): void {
		this.near?.a.destroy();
		this.near?.b.destroy();
		this.device.destroy();
	}
}
