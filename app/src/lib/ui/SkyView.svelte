<script lang="ts">
	/**
	 * The whole sky through a camera, in light on one side of a divider and in
	 * gravitational waves on the other, optionally bent by a black hole in front
	 * of the camera. Dragging looks around; the wheel zooms. The vista demos'
	 * counterpart of SplitView, drawn by lib/vistas/sky.ts.
	 */
	import type { Snippet } from 'svelte';
	import { asset } from '$app/paths';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import { Sun03Icon } from '@hugeicons/core-free-icons';
	import { EngineUnavailable } from '../engine';
	import { SkyRenderer, type SkyParams, type SkyView, type Vec3 } from '../vistas/sky';

	interface Props {
		view: SkyView;
		/** Fraction of the width shown in light. */
		divider?: number;
		right: SkyParams['right'];
		/** A black hole in front of the camera, with the sweep of its rays (lens.ts). */
		hole?: { direction: Vec3; shadow: number; table: Float32Array };
		temperature: number;
		dipole: Vec3;
		beta: number;
		range: number;
		rightLabel: string;
		rightIcon: IconSvgElement;
		/** Still image shown until the sky is drawn. */
		poster?: string;
		/** Drawn over the right-hand (gravity) side. */
		overlay?: Snippet;
	}

	let {
		view = $bindable(),
		divider = $bindable(0.5),
		right,
		hole,
		temperature,
		dipole,
		beta,
		range,
		rightLabel,
		rightIcon,
		poster,
		overlay
	}: Props = $props();

	const MIN_FOV = (2 * Math.PI) / 180;
	const MAX_FOV = (110 * Math.PI) / 180;
	const MAX_PITCH = Math.PI / 2 - 1e-3;

	let status: 'starting' | 'running' | 'unavailable' | 'failed' = $state('starting');
	let message = $state('');
	let capture: (() => Promise<Blob | null>) | undefined;

	/** The picture as it is now, drawn again off screen, as a PNG. */
	export function snapshot(): Promise<Blob | null> {
		return capture ? capture() : Promise.resolve(null);
	}

	const readback =
		typeof location !== 'undefined' &&
		new URLSearchParams(location.search).get('present') === 'readback';

	function mount(canvas: HTMLCanvasElement) {
		let sky: SkyRenderer | undefined;
		let raf = 0;
		let disposed = false;
		let busy = false;
		let lastKey = '';
		let lastTable: Float32Array | undefined;
		let last: { params: SkyParams; width: number; height: number } | undefined;
		const target = readback ? document.createElement('canvas') : canvas;
		const ctx2d = readback ? canvas.getContext('2d') : null;

		capture = async () => {
			if (!sky || !last) return null;
			const { params, width, height } = last;
			const pixels = await sky.readFrame(params, width, height);
			const still = document.createElement('canvas');
			still.width = width;
			still.height = height;
			still
				.getContext('2d')!
				.putImageData(new ImageData(new Uint8ClampedArray(pixels), width, height), 0, 0);
			return new Promise((done) => still.toBlob(done, 'image/png'));
		};

		const loop = async () => {
			if (disposed || !sky) return;
			raf = requestAnimationFrame(loop);
			if (busy) return;
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
			const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
			const params: SkyParams = {
				view,
				divider,
				right,
				hole: hole && { direction: hole.direction, shadow: hole.shadow },
				temperature,
				dipole,
				beta,
				range
			};
			const key = JSON.stringify([params, width, height]);
			if (key === lastKey && hole?.table === lastTable) return;
			lastKey = key;
			if (hole && hole.table !== lastTable) sky.setLens(hole.table);
			lastTable = hole?.table;
			last = { params, width, height };
			if (ctx2d) {
				busy = true;
				const pixels = await sky.readFrame(params, width, height);
				busy = false;
				if (disposed) return;
				canvas.width = width;
				canvas.height = height;
				ctx2d.putImageData(new ImageData(new Uint8ClampedArray(pixels), width, height), 0, 0);
			} else {
				canvas.width = width;
				canvas.height = height;
				sky.render(params);
			}
			canvas.dataset.frames = String(Number(canvas.dataset.frames ?? 0) + 1);
			canvas.dataset.right = right;
		};

		SkyRenderer.create(target, asset('sky/light.jpg'), asset('sky/waves.png'))
			.then((s) => {
				if (disposed) return s.destroy();
				sky = s;
				status = 'running';
				raf = requestAnimationFrame(loop);
			})
			.catch((err: unknown) => {
				status = err instanceof EngineUnavailable ? 'unavailable' : 'failed';
				message = err instanceof Error ? err.message : String(err);
			});

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			sky?.destroy();
		};
	}

	// --- looking around: the sky follows the pointer -----------------------------
	let dragging = false;

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const perPixel = view.fov / (e.currentTarget as HTMLElement).clientHeight;
		view = {
			...view,
			yaw: view.yaw + e.movementX * perPixel,
			pitch: Math.max(-MAX_PITCH, Math.min(MAX_PITCH, view.pitch + e.movementY * perPixel))
		};
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		view = {
			...view,
			fov: Math.max(MIN_FOV, Math.min(MAX_FOV, view.fov * Math.exp(e.deltaY * 0.0015)))
		};
	}

	// --- the divider ------------------------------------------------------------
	let sliding = false;

	function onDividerDown(e: PointerEvent) {
		sliding = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.stopPropagation();
	}

	function onDividerMove(e: PointerEvent) {
		if (!sliding) return;
		const r = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
		divider = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
	}

	function onDividerKey(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.1 : 0.02;
		if (e.key === 'ArrowLeft') divider = Math.max(0, divider - step);
		else if (e.key === 'ArrowRight') divider = Math.min(1, divider + step);
		else return;
		e.preventDefault();
	}
</script>

<div class="frame" style:background-image={poster ? `url("${poster}")` : undefined}>
	<canvas
		{@attach mount}
		class={{ ready: status === 'running' }}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={() => (dragging = false)}
		onpointercancel={() => (dragging = false)}
		onwheel={onWheel}
		aria-label="Split view of the sky: ordinary light on one side, the gravitational camera on the other"
	></canvas>

	{#if status === 'running'}
		{#if overlay && divider < 1}
			<div class="right-side" style:left="{divider * 100}%">{@render overlay()}</div>
		{/if}
		{#if divider > 0.12}
			<span
				class="tag"
				style:right="calc({(1 - divider) * 100}% + 14px)"
				style:max-width="calc({divider * 100}% - 28px)"
			>
				<HugeiconsIcon icon={Sun03Icon} size={13} strokeWidth={2} /><span class="text">Light</span>
			</span>
		{/if}
		{#if divider < 0.88}
			<span
				class="tag"
				style:left="calc({divider * 100}% + 14px)"
				style:max-width="calc({(1 - divider) * 100}% - 28px)"
			>
				<HugeiconsIcon icon={rightIcon} size={13} strokeWidth={2} /><span class="text"
					>{rightLabel}</span
				>
			</span>
		{/if}
		<div
			class="divider"
			style:left="{divider * 100}%"
			role="slider"
			tabindex="0"
			aria-label="Divider between the light view and the gravity view"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={Math.round(divider * 100)}
			onpointerdown={onDividerDown}
			onpointermove={onDividerMove}
			onpointerup={() => (sliding = false)}
			onpointercancel={() => (sliding = false)}
			onkeydown={onDividerKey}
		>
			<span class="grip" aria-hidden="true"></span>
		</div>
	{:else if status !== 'starting'}
		<div class="notice">
			<p><strong>The sky could not be drawn.</strong></p>
			<p>{message}</p>
			{#if status === 'unavailable'}
				<p>It needs WebGPU: a recent Chrome, Edge, Safari or Firefox on a device with a GPU.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.right-side {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	.frame {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #000 center / cover no-repeat;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		cursor: grab;
		touch-action: none;
		opacity: 0;
		transition: opacity 0.3s;
	}

	canvas.ready {
		opacity: 1;
	}

	canvas:active {
		cursor: grabbing;
	}

	.tag {
		position: absolute;
		bottom: var(--tag-inset, 14px);
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		font: 500 0.72rem/1 var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.82);
		background: rgb(8 10 14 / 0.55);
		border: 1px solid rgb(255 255 255 / 0.14);
		padding: 0.45em 0.7em;
		border-radius: 999px;
		backdrop-filter: blur(6px);
		pointer-events: none;
		white-space: nowrap;
	}

	.tag .text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tag :global(svg) {
		flex: none;
	}

	.divider {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 28px;
		margin-left: -14px;
		cursor: ew-resize;
		touch-action: none;
		display: grid;
		place-items: center;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		background: rgb(255 255 255 / 0.7);
	}

	.divider:focus-visible {
		outline: none;
	}

	.divider:focus-visible .grip {
		box-shadow: 0 0 0 3px var(--accent);
	}

	.grip {
		position: relative;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.92);
		box-shadow: 0 1px 8px rgb(0 0 0 / 0.5);
	}

	.grip::before,
	.grip::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 6px;
		height: 6px;
		border: solid #111;
		border-width: 0 0 1.5px 1.5px;
	}

	.grip::before {
		left: 7px;
		transform: translateY(-50%) rotate(45deg);
	}

	.grip::after {
		right: 7px;
		transform: translateY(-50%) rotate(-135deg);
	}

	.notice {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: min(26rem, 80%);
		padding: 1rem 1.2rem;
		border-radius: 12px;
		background: rgb(12 15 21 / 0.86);
		color: #e8e6e1;
		font-size: 0.85rem;
	}

	.notice p {
		margin: 0.3rem 0;
	}
</style>
