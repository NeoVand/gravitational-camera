/**
 * A small WebGPU renderer for the vista demos: the whole sky through a pinhole
 * camera, in light on one side of a divider and in gravitational waves on the
 * other, optionally bent by a black hole (see sky.wgsl). Directions are in the
 * galactic frame; the camera looks toward longitude `yaw` and latitude `pitch`.
 */
import { EngineUnavailable } from '../engine';
import skyWgsl from './sky.wgsl?raw';

export type Vec3 = [number, number, number];

export interface SkyView {
	/** Galactic longitude and latitude of the centre of view, and the vertical field of view, radians. */
	yaw: number;
	pitch: number;
	fov: number;
}

export interface SkyParams {
	view: SkyView;
	/** Fraction of the width shown in light, from the left. */
	divider: number;
	/** The right-hand picture: the Galaxy's millihertz waves, or the primordial background. */
	right: 'waves' | 'primordial';
	/** A black hole in front of the camera: its direction and the angular radius of its shadow. */
	hole?: { direction: Vec3; shadow: number };
	/** The background's mean temperature as seen (K), our motion through it, and the colour range (K). */
	temperature: number;
	dipole: Vec3;
	beta: number;
	range: number;
}

const FRAME_BYTES = 112;
const LENS_ENTRIES = 2048;

/** The camera's axes: forward, right (toward lower longitude) and up. */
export function skyBasis(view: SkyView): { forward: Vec3; right: Vec3; up: Vec3 } {
	const { yaw: l, pitch: b } = view;
	const forward: Vec3 = [Math.cos(b) * Math.cos(l), Math.cos(b) * Math.sin(l), Math.sin(b)];
	const right: Vec3 = [Math.sin(l), -Math.cos(l), 0];
	const up: Vec3 = [
		right[1] * forward[2] - right[2] * forward[1],
		right[2] * forward[0] - right[0] * forward[2],
		right[0] * forward[1] - right[1] * forward[0]
	];
	return { forward, right, up };
}

async function bitmap(url: string): Promise<ImageBitmap> {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Could not load ${url}`);
	return createImageBitmap(await response.blob(), { colorSpaceConversion: 'none' });
}

export class SkyRenderer {
	private group: GPUBindGroup | undefined;

	private constructor(
		private readonly device: GPUDevice,
		private readonly context: GPUCanvasContext,
		private readonly canvas: HTMLCanvasElement,
		private readonly format: GPUTextureFormat,
		private readonly pipeline: GPURenderPipeline,
		private readonly frameBuffer: GPUBuffer,
		private readonly lensBuffer: GPUBuffer,
		private readonly sampler: GPUSampler
	) {}

	static async create(canvas: HTMLCanvasElement, lightUrl: string, wavesUrl: string) {
		if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
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

		const module = device.createShaderModule({ label: 'sky', code: skyWgsl });
		const info = await module.getCompilationInfo();
		const errors = info.messages.filter((m) => m.type === 'error');
		if (errors.length) {
			throw new Error('Sky shader failed to compile: ' + errors.map((m) => m.message).join('; '));
		}
		const pipeline = device.createRenderPipeline({
			label: 'sky',
			layout: 'auto',
			vertex: { module, entryPoint: 'vs' },
			fragment: { module, entryPoint: 'fs', targets: [{ format }] },
			primitive: { topology: 'triangle-list' }
		});
		const frameBuffer = device.createBuffer({
			size: FRAME_BYTES,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
		});
		const lensBuffer = device.createBuffer({
			size: LENS_ENTRIES * 4,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
		});
		const sampler = device.createSampler({
			magFilter: 'linear',
			minFilter: 'linear',
			addressModeU: 'repeat',
			addressModeV: 'clamp-to-edge'
		});
		const sky = new SkyRenderer(
			device,
			context,
			canvas,
			format,
			pipeline,
			frameBuffer,
			lensBuffer,
			sampler
		);
		const [light, waves] = await Promise.all([bitmap(lightUrl), bitmap(wavesUrl)]);
		sky.group = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: frameBuffer } },
				{ binding: 1, resource: sky.texture(light).createView() },
				{ binding: 2, resource: sky.texture(waves).createView() },
				{ binding: 3, resource: sampler },
				{ binding: 4, resource: { buffer: lensBuffer } }
			]
		});
		return sky;
	}

	/** The pictures are stored as they look (sRGB values), and shown as such. */
	private texture(image: ImageBitmap): GPUTexture {
		const texture = this.device.createTexture({
			size: [image.width, image.height],
			format: 'rgba8unorm',
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT
		});
		this.device.queue.copyExternalImageToTexture({ source: image }, { texture }, [
			image.width,
			image.height
		]);
		return texture;
	}

	/** The sweep of the rays around the hole, from sweepTable() in lens.ts. */
	setLens(table: Float32Array): void {
		const padded = new Float32Array(LENS_ENTRIES);
		padded.set(table.subarray(0, LENS_ENTRIES));
		this.device.queue.writeBuffer(this.lensBuffer, 0, padded);
	}

	private frameData(p: SkyParams, width: number, height: number): Float32Array {
		const f = new Float32Array(FRAME_BYTES / 4);
		const { forward, right, up } = skyBasis(p.view);
		const ty = Math.tan(p.view.fov / 2);
		f.set([...forward, p.divider], 0);
		f.set([...right, ty * (width / height)], 4);
		f.set([...up, ty], 8);
		f.set([...(p.hole?.direction ?? [1, 0, 0]), p.hole ? 1 : 0], 12);
		f.set([...p.dipole, p.beta], 16);
		f.set([p.hole?.shadow ?? 0, p.temperature, p.range, p.right === 'primordial' ? 1 : 0], 20);
		f.set([width, height, LENS_ENTRIES, 0], 24);
		return f;
	}

	private draw(target: GPUTextureView, p: SkyParams, width: number, height: number) {
		if (!this.group) return;
		this.device.queue.writeBuffer(this.frameBuffer, 0, this.frameData(p, width, height));
		const encoder = this.device.createCommandEncoder();
		const pass = encoder.beginRenderPass({
			colorAttachments: [
				{ view: target, loadOp: 'clear', storeOp: 'store', clearValue: [0, 0, 0, 1] }
			]
		});
		pass.setPipeline(this.pipeline);
		pass.setBindGroup(0, this.group);
		pass.draw(3);
		pass.end();
		this.device.queue.submit([encoder.finish()]);
	}

	render(p: SkyParams): void {
		this.draw(
			this.context.getCurrentTexture().createView(),
			p,
			this.canvas.width,
			this.canvas.height
		);
	}

	/** Draw off screen and read back `width * height * 4` RGBA bytes, rows from the top. */
	async readFrame(p: SkyParams, width: number, height: number): Promise<Uint8Array> {
		const texture = this.device.createTexture({
			size: [width, height],
			format: this.format,
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
		});
		const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
		const buffer = this.device.createBuffer({
			size: bytesPerRow * height,
			usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
		});
		this.draw(texture.createView(), p, width, height);
		const encoder = this.device.createCommandEncoder();
		encoder.copyTextureToBuffer({ texture }, { buffer, bytesPerRow }, [width, height]);
		this.device.queue.submit([encoder.finish()]);
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
				out[d + 3] = 255;
			}
		}
		buffer.unmap();
		buffer.destroy();
		texture.destroy();
		return out;
	}

	destroy(): void {
		this.device.destroy();
	}
}
