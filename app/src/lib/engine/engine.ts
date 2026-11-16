/**
 * The WebGPU renderer. Framework-free: give it a canvas, packed primitives and
 * per-frame parameters. It also exposes a probe that evaluates the shader's
 * line integral for arbitrary rays, which the self-test compares with the
 * reference implementation.
 */
import { cameraBasis, type View } from './camera';
import { MAX_PRIMS, PRIM_STRIDE, type PackedPrims } from './scene';
import type { Vec3 } from './types';
import frameWgsl from './wgsl/frame.wgsl?raw';
import kernelsWgsl from './wgsl/kernels.wgsl?raw';
import lightWgsl from './wgsl/light.wgsl?raw';
import probeWgsl from './wgsl/probe.wgsl?raw';
import thermalWgsl from './wgsl/thermal.wgsl?raw';

export const MODE_LIGHT = 0;
export const MODE_THERMAL = 1;
export type Mode = typeof MODE_LIGHT | typeof MODE_THERMAL;

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
}

export class EngineUnavailable extends Error {}

const FRAME_BYTES = 112;

export class Engine {
	private constructor(
		private readonly device: GPUDevice,
		private readonly context: GPUCanvasContext,
		private readonly canvas: HTMLCanvasElement,
		private readonly format: GPUTextureFormat,
		private readonly pipeline: GPURenderPipeline,
		private readonly frameBuffer: GPUBuffer,
		private readonly primBuffer: GPUBuffer,
		private readonly bindGroup: GPUBindGroup
	) {}

	private primCount = 0;
	private probePipeline: GPUComputePipeline | undefined;

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

		const module = device.createShaderModule({
			label: 'frame',
			code: [kernelsWgsl, thermalWgsl, lightWgsl, frameWgsl].join('\n')
		});
		const info = await module.getCompilationInfo();
		const errors = info.messages.filter((m) => m.type === 'error');
		if (errors.length) {
			throw new Error(
				'Shader failed to compile: ' +
					errors.map((m) => `${m.lineNum}:${m.linePos} ${m.message}`).join('; ')
			);
		}
		const pipeline = device.createRenderPipeline({
			label: 'frame',
			layout: 'auto',
			vertex: { module, entryPoint: 'vs' },
			fragment: { module, entryPoint: 'fs', targets: [{ format }] },
			primitive: { topology: 'triangle-list' }
		});
		const frameBuffer = device.createBuffer({
			label: 'frame uniforms',
			size: FRAME_BYTES,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		const primBuffer = device.createBuffer({
			label: 'primitives',
			size: PRIM_STRIDE * MAX_PRIMS,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		const bindGroup = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: frameBuffer } },
				{ binding: 1, resource: { buffer: primBuffer } }
			]
		});
		return new Engine(
			device,
			context,
			canvas,
			format,
			pipeline,
			frameBuffer,
			primBuffer,
			bindGroup
		);
	}

	setPrims(prims: PackedPrims): void {
		this.device.queue.writeBuffer(this.primBuffer, 0, prims.buffer);
		this.primCount = prims.count;
	}

	private writeFrame(p: FrameParams, width: number, height: number): void {
		const data = new ArrayBuffer(FRAME_BYTES);
		const f = new Float32Array(data);
		const u = new Uint32Array(data);
		const { right, up, forward } = cameraBasis(p.view);
		const t = Math.tan(p.view.fov / 2);
		f.set([...right, t * (width / height)], 0);
		f.set([...up, t], 4);
		f.set([...forward, (2 * t) / height], 8);
		f.set([width, height, p.divider * width, p.timeSeconds], 12);
		f.set([p.exposure, p.glarePixels, 1, 0], 16);
		f.set([...p.sunDirection, 0], 20);
		u.set([this.primCount, p.left, p.right, 0], 24);
		this.device.queue.writeBuffer(this.frameBuffer, 0, data);
	}

	private draw(encoder: GPUCommandEncoder, target: GPUTextureView): void {
		const pass = encoder.beginRenderPass({
			colorAttachments: [
				{
					view: target,
					loadOp: 'clear',
					storeOp: 'store',
					clearValue: { r: 0, g: 0, b: 0, a: 1 }
				}
			]
		});
		pass.setPipeline(this.pipeline);
		pass.setBindGroup(0, this.bindGroup);
		pass.draw(3);
		pass.end();
	}

	render(p: FrameParams): void {
		this.writeFrame(p, this.canvas.width, this.canvas.height);
		const encoder = this.device.createCommandEncoder();
		this.draw(encoder, this.context.getCurrentTexture().createView());
		this.device.queue.submit([encoder.finish()]);
	}

	/**
	 * Draw a frame off screen and read it back: `width * height * 4` bytes, rows
	 * from the top, in RGBA order whatever the canvas format is. For tests.
	 */
	async readFrame(p: FrameParams, width: number, height: number): Promise<Uint8Array> {
		const device = this.device;
		this.writeFrame(p, width, height);
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
		const encoder = device.createCommandEncoder();
		this.draw(encoder, texture.createView());
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
	 * Evaluate the shader's thermal line integral for the given unit directions.
	 * Returns four floats per ray: colour-weighted rgb and the plain column, all
	 * in units of the reference radiance the primitives were packed with.
	 */
	async probe(directions: Float32Array): Promise<Float32Array> {
		const n = directions.length / 3;
		const device = this.device;
		if (!this.probePipeline) {
			const module = device.createShaderModule({
				label: 'probe',
				code: [kernelsWgsl, thermalWgsl, probeWgsl].join('\n')
			});
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
		// the probe only needs the primitive count from the frame block
		const frame = new ArrayBuffer(FRAME_BYTES);
		new Float32Array(frame).set([1, 1, 1, 0], 16);
		new Uint32Array(frame).set([this.primCount, 0, 0, 0], 24);
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
		this.frameBuffer.destroy();
		this.primBuffer.destroy();
		this.device.destroy();
	}
}
