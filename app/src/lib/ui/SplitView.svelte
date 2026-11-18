<script lang="ts">
	/**
	 * A canvas showing two views of the same scene side by side, with a divider
	 * the visitor can drag. Dragging the picture looks around; the wheel zooms.
	 */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		Camera01Icon,
		Layers01Icon,
		Orbit01Icon,
		Sun03Icon,
		TemperatureIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import { massPoints, sliceReference } from '../engine/tidal';
	import { lookUniforms } from '../pixel/field-view';
	import { fieldLook } from './field-look.svelte';
	import { G } from '../engine/physics/constants';
	import {
		Engine,
		EngineUnavailable,
		MODE_COUNTS,
		MODE_FIELD,
		MODE_LIGHT,
		MODE_NEAR,
		MODE_THERMAL,
		MODE_WAVES,
		packPrims,
		referenceRadiance,
		referenceTidal,
		type AnalyzedObject,
		type FrameParams,
		type ImageMap,
		type Mode,
		type PackedWaves,
		type Vec3,
		type View
	} from '../engine';

	interface Props {
		objects: AnalyzedObject[];
		observer: Vec3;
		sunDirection: Vec3;
		view: View;
		/** Divider position, 0 to 1. */
		divider?: number;
		showLight?: boolean;
		showGravity?: boolean;
		/** What each side of the divider shows. */
		leftMode?: Mode;
		rightMode?: Mode;
		/** Brightness multiplier relative to the scene's reference, for the gravity view. */
		exposure?: number;
		/** Brightness multiplier for the light view, as for a long exposure at night. */
		lightExposure?: number;
		/** Standard deviation of the near-field blur, radians. */
		nearBlur?: number;
		/** Radius around the observer left out of the near-field view, metres. */
		exclusion?: number;
		/** Light the ordinary view as a room instead of a night sky. */
		room?: boolean;
		/** Add a faint copy of the ordinary picture to the near-field view. */
		outline?: boolean;
		/** Leave the empty room (background objects) out of the gravity views. */
		subtractRoom?: boolean;
		/** Cut away objects marked `cutaway` in the light view. */
		cutaway?: boolean;
		/** Sources for the wave view (see `packWaves`), and its brightness. */
		waves?: PackedWaves;
		waveExposure?: number;
		/** Depth of the slice drawn by the field view, m. How it looks is the reader's to set (field-look). */
		fieldDepth?: number;
		/**
		 * The strength the field view's scale is set against, s⁻²: the median over the picture. Left out, it is
		 * worked out here with boxes and spheres as point masses, which serves outside matter only.
		 */
		fieldReference?: number;
		interactive?: boolean;
		/**
		 * Part of a scrolling page: dragging still looks around, but the wheel and
		 * vertical swipes scroll the page; Ctrl and the wheel (a trackpad pinch) zoom.
		 */
		embedded?: boolean;
		leftLabel?: string;
		rightLabel?: string;
		/** Still image shown until the engine draws, and if it cannot start. */
		poster?: string;
		/**
		 * A picture made on the page, for the gravity side: a thermal exposure's counts (with `rightMode` the counts
		 * mode), or the noise of a near-field exposure (with `noise`).
		 */
		image?: ImageMap;
		/**
		 * One near-field exposure: the noise in `image` (its red part) times `scale`, in kg m⁻³ of tidal column, is
		 * added to the blurred column; the picture spans `across` by `up` of the image's cells from its top left.
		 */
		noise?: { scale: number; across: number; up: number };
		/** Drawn over the right-hand (gravity) side. */
		overlay?: Snippet;
		/** Darken the right-hand picture so an overlay reads clearly. */
		dimRight?: boolean;
	}

	let {
		objects,
		observer,
		sunDirection,
		view = $bindable(),
		divider = $bindable(0.5),
		showLight = true,
		showGravity = true,
		leftMode = MODE_LIGHT,
		rightMode = MODE_THERMAL,
		exposure = 1.2,
		lightExposure = 1,
		nearBlur = 0,
		exclusion = 0.25,
		room = false,
		outline = false,
		subtractRoom = false,
		cutaway = false,
		waves,
		waveExposure = 2.2,
		fieldDepth = 3,
		fieldReference,
		interactive = true,
		embedded = false,
		leftLabel = 'Light',
		rightLabel = 'Gravity · thermal',
		poster,
		image,
		noise,
		overlay,
		dimRight = false
	}: Props = $props();

	const MIN_FOV = (0.4 * Math.PI) / 180;
	const MAX_FOV = (100 * Math.PI) / 180;
	const MAX_PITCH = Math.PI / 2 - 1e-3;

	/** An icon for each kind of picture, shown on its label. */
	const MODE_ICONS: Record<Mode, IconSvgElement> = {
		[MODE_LIGHT]: Sun03Icon,
		[MODE_THERMAL]: TemperatureIcon,
		[MODE_NEAR]: Orbit01Icon,
		[MODE_WAVES]: WavesIcon,
		[MODE_FIELD]: Layers01Icon,
		[MODE_COUNTS]: Camera01Icon
	};

	let status: 'starting' | 'running' | 'unavailable' | 'failed' = $state('starting');

	let capture: (() => Promise<Blob | null>) | undefined;

	/** The picture as it is now, drawn again off screen, as a PNG. */
	export function snapshot(): Promise<Blob | null> {
		return capture ? capture() : Promise.resolve(null);
	}
	let message = $state('');

	/** The picture's size on the page, CSS pixels. */
	let frameWidth = $state(0);
	let frameHeight = $state(0);

	/** Width over height of the picture, once it has been laid out. */
	export function aspect(): number | undefined {
		return frameWidth > 0 && frameHeight > 0 ? frameWidth / frameHeight : undefined;
	}

	const nRef = $derived(referenceRadiance(objects, observer, subtractRoom));
	const sRef = $derived(referenceTidal(objects, observer, exclusion, subtractRoom));
	// where the divider sits once the on/off switches are taken into account
	const split = $derived(showLight && showGravity ? divider : showLight ? 1 : 0);

	// point masses standing in for the scene, to set the field view's brightness scale where the page gives none
	const fieldPoints = $derived(
		rightMode === MODE_FIELD && fieldReference === undefined
			? massPoints(objects, 0.25, subtractRoom)
			: new Float64Array()
	);

	/**
	 * `?present=readback` draws each frame off screen and copies the pixels to a
	 * 2D canvas. Headless browsers do not composite WebGPU canvases, so this is
	 * how screenshots and tests see the real shader output.
	 */
	const readback =
		typeof location !== 'undefined' &&
		new URLSearchParams(location.search).get('present') === 'readback';

	function mount(canvas: HTMLCanvasElement) {
		let engine: Engine | undefined;
		let raf = 0;
		let disposed = false;
		let busy = false;
		let lastKey = '';
		// the page's picture last sent to the engine, and how many have been
		let uploaded: ImageMap | undefined;
		let uploads = 0;
		const started = performance.now();
		const target = readback ? document.createElement('canvas') : canvas;
		const ctx2d = readback ? canvas.getContext('2d') : null;
		let last: { params: FrameParams; width: number; height: number } | undefined;

		capture = async () => {
			if (!engine || !last) return null;
			const { params, width, height } = last;
			const pixels = await engine.readFrame(params, width, height);
			const still = document.createElement('canvas');
			still.width = width;
			still.height = height;
			still
				.getContext('2d')!
				.putImageData(new ImageData(new Uint8ClampedArray(pixels), width, height), 0, 0);
			return new Promise((done) => still.toBlob(done, 'image/png'));
		};

		const loop = async () => {
			if (disposed || !engine) return;
			raf = requestAnimationFrame(loop);
			if (busy) return;
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
			const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
			const pixelAngle = (2 * Math.tan(view.fov / 2)) / height;
			if (image && image !== uploaded) {
				engine.setImage(image);
				uploaded = image;
				uploads++;
			}
			const key = JSON.stringify([
				uploads,
				noise ? [noise.scale / sRef, noise.across, noise.up] : null,
				view,
				split,
				exposure,
				lightExposure,
				nearBlur,
				outline,
				subtractRoom,
				cutaway,
				waves ? Array.from(new Float32Array(waves.buffer, 0, waves.count * 12)) : null,
				waveExposure,
				rightMode === MODE_FIELD ? [fieldDepth, fieldReference, $state.snapshot(fieldLook)] : null,
				leftMode,
				rightMode,
				sunDirection,
				objects.map((o) => o.center),
				width,
				height
			]);
			if (key === lastKey) return;
			lastKey = key;
			const params: FrameParams = {
				view,
				divider: split,
				left: leftMode,
				right: rightMode,
				exposure,
				glarePixels: 2.2,
				sunDirection,
				timeSeconds: (performance.now() - started) / 1000,
				nearExposure: exposure,
				lightExposure,
				nearBlur,
				exclusion,
				room,
				nearOutline: outline,
				waveExposure,
				noise: noise && { amplitude: noise.scale / sRef, across: noise.across, up: noise.up },
				field:
					rightMode === MODE_FIELD
						? {
								depth: fieldDepth,
								// the shader leaves out G and divides densities by sRef
								reference:
									(fieldReference ??
										sliceReference(fieldPoints, observer, view, width / height, fieldDepth)) /
									(G * sRef),
								opacity: fieldLook.opacity,
								...lookUniforms(fieldLook)
							}
						: undefined
			};
			engine.setPrims(
				packPrims(objects, observer, {
					nRef,
					sRef,
					glareAngle: 2.5 * pixelAngle,
					subtractRoom,
					cutaway
				})
			);
			if (waves) engine.setWaves(waves);
			last = { params, width, height };
			if (ctx2d) {
				busy = true;
				const pixels = await engine.readFrame(params, width, height);
				busy = false;
				if (disposed) return;
				canvas.width = width;
				canvas.height = height;
				ctx2d.putImageData(new ImageData(new Uint8ClampedArray(pixels), width, height), 0, 0);
			} else {
				canvas.width = width;
				canvas.height = height;
				engine.render(params);
			}
			canvas.dataset.frames = String(Number(canvas.dataset.frames ?? 0) + 1);
			// lets tests wait for the frame drawn with a given setting, not an older one
			canvas.dataset.nearBlur = String(params.nearBlur);
			canvas.dataset.split = String(params.divider);
			canvas.dataset.right = String(params.right);
			canvas.dataset.waves = String(waves?.count ?? 0);
			canvas.dataset.exposure = String(params.exposure);
			canvas.dataset.image = String(uploads);
			canvas.dataset.noise = params.noise ? '1' : '0';
		};

		Engine.create(target)
			.then((e) => {
				if (disposed) return e.destroy();
				engine = e;
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
			engine?.destroy();
		};
	}

	// --- looking around -------------------------------------------------------
	let dragging = false;

	function onPointerDown(e: PointerEvent) {
		if (!interactive) return;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const el = e.currentTarget as HTMLElement;
		const perPixel = view.fov / el.clientHeight;
		view = {
			...view,
			yaw: view.yaw + e.movementX * perPixel,
			pitch: Math.max(-MAX_PITCH, Math.min(MAX_PITCH, view.pitch + e.movementY * perPixel))
		};
	}

	function onPointerUp() {
		dragging = false;
	}

	function onWheel(e: WheelEvent) {
		if (!interactive || (embedded && !e.ctrlKey)) return;
		e.preventDefault();
		const fov = Math.max(MIN_FOV, Math.min(MAX_FOV, view.fov * Math.exp(e.deltaY * 0.0015)));
		view = { ...view, fov };
	}

	// --- the divider ------------------------------------------------------------
	let sliding = false;

	function slideTo(handle: HTMLElement, clientX: number) {
		const r = handle.parentElement!.getBoundingClientRect();
		divider = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
	}

	function onDividerDown(e: PointerEvent) {
		sliding = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.stopPropagation();
	}

	function onDividerMove(e: PointerEvent) {
		if (sliding) slideTo(e.currentTarget as HTMLElement, e.clientX);
	}

	function onDividerKey(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.1 : 0.02;
		if (e.key === 'ArrowLeft') divider = Math.max(0, divider - step);
		else if (e.key === 'ArrowRight') divider = Math.min(1, divider + step);
		else return;
		e.preventDefault();
	}
</script>

<div
	class="frame"
	style:background-image={poster ? `url("${poster}")` : undefined}
	bind:clientWidth={frameWidth}
	bind:clientHeight={frameHeight}
>
	<canvas
		{@attach mount}
		class={{ interactive, embedded, ready: status === 'running' }}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
		onwheel={onWheel}
		aria-label="Split view of the scene: ordinary light on one side, the gravitational camera on the other"
	></canvas>

	{#if status === 'running'}
		{#if showGravity && (overlay || dimRight)}
			<div class={['right-side', { dim: dimRight }]} style:left="{split * 100}%">
				{@render overlay?.()}
			</div>
		{/if}
		{#if showLight && split > 0.12}
			<span
				class="tag left"
				style:right="calc({(1 - split) * 100}% + 14px)"
				style:max-width="calc({split * 100}% - 28px)"
			>
				<HugeiconsIcon icon={MODE_ICONS[leftMode]} size={13} strokeWidth={2} /><span class="text"
					>{leftLabel}</span
				>
			</span>
		{/if}
		{#if showGravity && split < 0.88}
			<span
				class="tag right"
				style:left="calc({split * 100}% + 14px)"
				style:max-width="calc({(1 - split) * 100}% - 28px)"
			>
				<HugeiconsIcon icon={MODE_ICONS[rightMode]} size={13} strokeWidth={2} /><span class="text"
					>{rightLabel}</span
				>
			</span>
		{/if}
		{#if showLight && showGravity}
			<div
				class="divider"
				style:left="{split * 100}%"
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
		{/if}
	{:else if status === 'starting'}
		{#if !poster}<p class="notice">Starting the engine…</p>{/if}
	{:else}
		<div class={['notice', { 'over-poster': !!poster }]}>
			<p><strong>The engine could not start.</strong></p>
			<p>{message}</p>
			{#if status === 'unavailable'}
				<p>It needs WebGPU: a recent Chrome, Edge, Safari or Firefox on a device with a GPU.</p>
			{/if}
		</div>
	{/if}
</div>

<style>
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
		touch-action: none;
		opacity: 0;
	}

	canvas.ready {
		opacity: 1;
	}

	canvas.interactive {
		cursor: grab;
	}

	/* on a page, a vertical swipe scrolls it; a sideways drag turns the view */
	canvas.embedded {
		touch-action: pan-y;
	}

	canvas.interactive:active {
		cursor: grabbing;
	}

	.right-side {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		transition: background-color 0.2s;
	}

	.right-side.dim {
		background: rgb(4 6 10 / 0.62);
	}

	/* The labels sit at the foot of the picture, clear of page headers; a page
	   with controls along the bottom raises them with --tag-inset. */
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
		inset: 0;
		display: grid;
		place-content: center;
		gap: 0.4rem;
		padding: 2rem;
		text-align: center;
		color: rgb(255 255 255 / 0.8);
		font: 400 0.95rem/1.5 var(--font-sans);
	}

	.notice p {
		margin: 0;
	}

	.notice.over-poster {
		inset: auto 0 0 0;
		padding: 0.8rem 1rem;
		font-size: 0.8rem;
		background: rgb(8 10 14 / 0.7);
	}
</style>
