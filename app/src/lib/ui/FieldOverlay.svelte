<script lang="ts">
	/**
	 * The "Tidal field" view for the pictures the engine does not draw (the Galaxy, a black hole): over the gravity
	 * side, the tidal tensor at the points of a sphere about the camera, by the rules of the rooms' view
	 * (lib/pixel/field-view.ts, which follows engine/wgsl/field.wgsl). A wash over every pixel, coloured by the tensor
	 * at the pixel's own point, and one fine stroke to a cell along the stretch as it lies across the picture.
	 *
	 * The shader mixes in linear light over the picture beneath; a canvas laid over another can only mix as the
	 * screen shows them. The wash is given the colour and the cover that agree with the shader exactly over black
	 * and, on the average of the three colours, over white; between the two it is close.
	 */
	import type { Vec3 } from '../engine/types';
	import {
		coneOnPicture,
		fieldMark,
		rayThrough,
		strokeHalf,
		strokeUniforms,
		toDisplay,
		type Cone,
		type FieldCamera
	} from '../pixel/field-view';
	import type { Mat3 } from '../pixel/tide';
	import { fieldLook } from './field-look.svelte';

	interface Props {
		/** The tensor at the point seen along a unit direction, in the picture's axes; nothing where there is none. */
		tensorAt: (direction: Vec3) => Mat3 | undefined;
		/** The camera of the whole picture. */
		camera: Omit<FieldCamera, 'tanX'>;
		/** The strength the scale is set against, s⁻². */
		reference: number;
		/** Where the gravity side starts, as a fraction of the picture's width. */
		split: number;
		/** How bright the picture beneath is, roughly, 0 to 1 in linear light: it sets how the strokes are mixed in. */
		beneath?: number;
		/**
		 * The directions in which `tensorAt` gives nothing, where they are a cone (the inside of a horizon): the wash
		 * is then cut along the cone's own edge, pixel by pixel, and not along the lattice it is worked out on.
		 */
		hollow?: Cone;
	}

	let { tensorAt, camera, reference, split, beneath = 0.2, hollow }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let width = $state(0);
	let height = $state(0);

	/** The wash is worked out at no more than this many points and smoothed between them: the field is smooth. */
	const POINTS = 90_000;

	$effect(() => {
		if (!canvas || !width || !height || split >= 1) return;
		const look = $state.snapshot(fieldLook);
		const ratio = Math.min(window.devicePixelRatio || 1, 2);
		// the overlay covers the gravity side only; the camera is that of the whole picture
		const w = Math.max(1, Math.round(width * ratio));
		const h = Math.max(1, Math.round(height * ratio));
		const full = w / (1 - split);
		const offset = full - w;
		const cam: FieldCamera = { ...camera, tanX: camera.tanY * (full / h) };
		const at = (px: number, py: number) => {
			const E = tensorAt(rayThrough(cam, ((px + offset) / full) * 2 - 1, 1 - (py / h) * 2));
			return E && fieldMark(E, cam, reference, look);
		};
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d')!;

		// The wash. The shader gives beneath * 0.85 * (1 - cover) + tone * cover in linear light, then the screen's
		// curve. Over black that is tone * cover; over white, 0.85 * (1 - cover) + tone * cover.
		const block = Math.max(1, Math.ceil(Math.sqrt((w * h) / POINTS)));
		const cols = Math.ceil(w / block) + 1;
		const rows = Math.ceil(h / block) + 1;
		const small = new OffscreenCanvas(cols, rows);
		const image = new ImageData(cols, rows);
		// the hollow on the whole picture, and the lattice points that may lie within a block of it
		const cone = hollow && coneOnPicture(hollow, cam, full, h);
		const known = new Uint8Array(cols * rows);
		const about = { i0: cols, i1: -1, j0: rows, j1: -1 };
		for (let j = 0; j < rows; j++)
			for (let i = 0; i < cols; i++) {
				if (cone?.near(i * block + offset, j * block, block + 2)) {
					about.i0 = Math.min(about.i0, i);
					about.i1 = Math.max(about.i1, i);
					about.j0 = Math.min(about.j0, j);
					about.j1 = Math.max(about.j1, j);
				}
				const mark = at(i * block, j * block);
				if (!mark) continue;
				known[j * cols + i] = 1;
				const o = (j * cols + i) * 4;
				const black = mark.tone.map((t) => toDisplay(t * mark.cover));
				const white = mark.tone.map((t) => toDisplay(0.85 * (1 - mark.cover) + t * mark.cover));
				const over = 1 + (black[0] + black[1] + black[2] - white[0] - white[1] - white[2]) / 3;
				for (let k = 0; k < 3; k++) image.data[o + k] = (255 * black[k]) / over;
				image.data[o + 3] = 255 * over;
			}
		// Smoothing between a point with a colour and one with none would fade the wash out over a block, along the
		// lattice. With a hollow to cut, the wash is first carried a few points into it, each point without a colour
		// taking the mean of its neighbours that have one.
		for (let ring = 0; cone && ring < 3; ring++) {
			const before = known.slice();
			for (let j = about.j0; j <= about.j1; j++)
				for (let i = about.i0; i <= about.i1; i++) {
					if (before[j * cols + i]) continue;
					const sum = [0, 0, 0, 0];
					let count = 0;
					for (let q = Math.max(0, j - 1); q <= Math.min(rows - 1, j + 1); q++)
						for (let p = Math.max(0, i - 1); p <= Math.min(cols - 1, i + 1); p++) {
							if (!before[q * cols + p]) continue;
							for (let k = 0; k < 4; k++) sum[k] += image.data[(q * cols + p) * 4 + k];
							count++;
						}
					if (!count) continue;
					for (let k = 0; k < 4; k++) image.data[(j * cols + i) * 4 + k] = sum[k] / count;
					known[j * cols + i] = 1;
				}
		}
		small.getContext('2d')!.putImageData(image, 0, 0);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx.drawImage(small, 0, 0, cols, rows, -block / 2, -block / 2, cols * block, rows * block);

		// The hollow is then cut out of the wash at the canvas's own pixels, each by the share of it that lies within.
		const x0 = Math.max(0, (about.i0 - 1) * block);
		const y0 = Math.max(0, (about.j0 - 1) * block);
		const across = Math.min(w, (about.i1 + 1) * block + 1) - x0;
		const down = Math.min(h, (about.j1 + 1) * block + 1) - y0;
		if (cone && across > 0 && down > 0) {
			const cut = new ImageData(across, down);
			for (let y = 0; y < down; y++)
				for (let x = 0; x < across; x++)
					cut.data[(y * across + x) * 4 + 3] =
						255 * cone.cover(x0 + x + 0.5 + offset, y0 + y + 0.5);
			const stencil = new OffscreenCanvas(across, down);
			stencil.getContext('2d')!.putImageData(cut, 0, 0);
			ctx.globalCompositeOperation = 'destination-out';
			ctx.drawImage(stencil, x0, y0);
			ctx.globalCompositeOperation = 'source-over';
		}

		// One stroke to a cell of the whole picture's lattice, taken at the cell's centre: white mixed in at 0.38 in
		// linear light, with a hairline of shade about it where the look asks for one.
		const [cell, , weight] = strokeUniforms(look);
		let drawn = 0;
		if (cell >= 1) {
			ctx.lineCap = 'round';
			for (let cy = 0; cy * cell < h; cy++)
				for (let cx = Math.floor(offset / cell); cx * cell < full; cx++) {
					const x = (cx + 0.5) * cell - offset;
					const y = (cy + 0.5) * cell;
					const mark = at(x, y);
					if (!mark) continue;
					const half = strokeHalf(mark, look);
					if (half <= 1) continue;
					const line = (lineWidth: number, style: string) => {
						ctx.lineWidth = lineWidth;
						ctx.strokeStyle = style;
						ctx.beginPath();
						ctx.moveTo(x - half * mark.across[0], y - half * mark.across[1]);
						ctx.lineTo(x + half * mark.across[0], y + half * mark.across[1]);
						ctx.stroke();
					};
					if (look.edge > 0)
						line(2 * weight + 1.5, `rgb(0 0 0 / ${1 - toDisplay(1 - 0.55 * look.edge)})`);
					// what the wash shows there, and what it shows with the white mixed in
					const washed = mark.tone.map((t) => beneath * 0.85 * (1 - mark.cover) + t * mark.cover);
					const under = washed.reduce((s, c) => s + toDisplay(c), 0) / 3;
					const lit = washed.reduce((s, c) => s + toDisplay(0.62 * c + 0.38), 0) / 3;
					line(2 * weight, `rgb(255 255 255 / ${(lit - under) / (1 - under)})`);
					drawn++;
				}
		}
		canvas.dataset.strokes = String(drawn);
		canvas.dataset.frames = String(Number(canvas.dataset.frames ?? 0) + 1);
	});
</script>

<div class="field" bind:clientWidth={width} bind:clientHeight={height}>
	<canvas
		bind:this={canvas}
		aria-label="The tidal field at points of a sphere about the camera: a wash of colour and fine strokes along the stretch"
	></canvas>
</div>

<style>
	.field {
		position: absolute;
		inset: 0;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
