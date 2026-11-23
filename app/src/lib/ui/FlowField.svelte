<script lang="ts">
	/**
	 * The image that the gravitomagnetic half of the camera forms: the current
	 * column J = ∫ ρ v dr / r across the view, blurred by the camera's
	 * resolution for that (fainter) signal. Drawn as a picture over the gravity
	 * side, as flow is usually shown: hue for the direction in which mass moves
	 * across the view (the wheel in the corner), brightness for how much. A body
	 * turning shows as a ring in which the hues go round, in the order of its sense.
	 */
	import {
		cameraBasis,
		currentColumn,
		pixelDirection,
		type AnalyzedObject,
		type Vec3,
		type View
	} from '../engine';

	interface Props {
		objects: AnalyzedObject[];
		observer: Vec3;
		view: View;
		exclusion: number;
		/** Standard deviation of the blur of the flow image, radians. */
		blur: number;
		/** Where the gravity side starts, as a fraction of the full width. */
		split: number;
	}

	let { objects, observer, view, exclusion, blur, split }: Props = $props();

	let width = $state(0);
	let height = $state(0);

	const COLS = 160;

	/** The blurred flow across the view on a grid of directions: components along screen right and up. */
	const field = $derived.by(() => {
		if (!width || !height || split >= 1) return undefined;
		const full = width / (1 - split);
		const rows = Math.max(16, Math.round((COLS * height) / full));
		const cell = full / COLS;
		const { right, up } = cameraBasis(view);
		const fx = new Float64Array(COLS * rows);
		const fy = new Float64Array(COLS * rows);
		for (let j = 0; j < rows; j++)
			for (let i = 0; i < COLS; i++) {
				const d = pixelDirection(view, COLS, rows, i, j);
				const J = currentColumn(objects, observer, d, exclusion);
				fx[j * COLS + i] = J[0] * right[0] + J[1] * right[1] + J[2] * right[2];
				fy[j * COLS + i] = J[0] * up[0] + J[1] * up[1] + J[2] * up[2];
			}
		// the blur, as a Gaussian in grid cells, applied along rows then columns
		const pixelAngle = (2 * Math.tan(view.fov / 2)) / height;
		const sigma = Math.max(0.5, blur / pixelAngle / cell);
		const reach = Math.ceil(3 * sigma);
		const kernel = Array.from({ length: 2 * reach + 1 }, (_, k) =>
			Math.exp(-0.5 * ((k - reach) / sigma) ** 2)
		);
		const pass = (src: Float64Array, horizontal: boolean) => {
			const out = new Float64Array(src.length);
			for (let j = 0; j < rows; j++)
				for (let i = 0; i < COLS; i++) {
					let sum = 0;
					let weight = 0;
					for (let k = -reach; k <= reach; k++) {
						const ii = horizontal ? i + k : i;
						const jj = horizontal ? j : j + k;
						if (ii < 0 || jj < 0 || ii >= COLS || jj >= rows) continue;
						sum += kernel[k + reach] * src[jj * COLS + ii];
						weight += kernel[k + reach];
					}
					out[j * COLS + i] = sum / weight;
				}
			return out;
		};
		return { bx: pass(pass(fx, true), false), by: pass(pass(fy, true), false), rows, full };
	});

	/** Direction to colour: a hue wheel of even lightness. */
	function hue(angle: number): [number, number, number] {
		const h = (((angle / (2 * Math.PI)) % 1) + 1) % 1;
		const f = (n: number) => {
			const k = (n + h * 6) % 6;
			return 0.62 - 0.4 * Math.max(-1, Math.min(k - 3, 4 - k, 1));
		};
		return [f(5) * 255, f(3) * 255, f(1) * 255];
	}

	/** The picture: the blurred flow, coloured by direction and faded by strength, as an image. */
	const picture = $derived.by(() => {
		const f = field;
		if (!f || typeof document === 'undefined') return '';
		let peak = 0;
		for (let k = 0; k < f.bx.length; k++) peak = Math.max(peak, Math.hypot(f.bx[k], f.by[k]));
		if (!(peak > 0)) return '';
		const canvas = document.createElement('canvas');
		canvas.width = COLS;
		canvas.height = f.rows;
		const ctx = canvas.getContext('2d')!;
		const img = ctx.createImageData(COLS, f.rows);
		for (let k = 0; k < f.bx.length; k++) {
			const size = Math.hypot(f.bx[k], f.by[k]) / peak;
			// screen y runs down: the angle of the flow as the eye sees it
			const [r, g, b] = hue(Math.atan2(f.by[k], f.bx[k]));
			img.data[k * 4] = r;
			img.data[k * 4 + 1] = g;
			img.data[k * 4 + 2] = b;
			img.data[k * 4 + 3] = 255 * Math.min(0.9, 1.3 * Math.pow(size, 0.7));
		}
		ctx.putImageData(img, 0, 0);
		return canvas.toDataURL();
	});

	const wheel = Array.from({ length: 36 }, (_, i) => {
		const a0 = (i / 36) * 2 * Math.PI,
			a1 = ((i + 1) / 36) * 2 * Math.PI;
		const [r, g, b] = hue(a0 + Math.PI / 36);
		const p = (a: number, rad: number) =>
			`${(rad * Math.cos(a)).toFixed(2)},${(-rad * Math.sin(a)).toFixed(2)}`;
		return {
			d: `M${p(a0, 7)}L${p(a0, 16)}L${p(a1, 16)}L${p(a1, 7)}Z`,
			fill: `rgb(${r | 0},${g | 0},${b | 0})`
		};
	});
</script>

<div class="flow" bind:clientWidth={width} bind:clientHeight={height} aria-hidden="true">
	{#if field && picture}
		<img src={picture} alt="" style:left="{-(split * field.full)}px" style:width="{field.full}px" />
	{/if}
	<svg
		class="key"
		viewBox="-40 -24 80 52"
		role="img"
		aria-label="Direction of the flow across the view"
	>
		{#each wheel as w, i (i)}<path d={w.d} fill={w.fill} />{/each}
		<text x="0" y="27">flow</text>
	</svg>
</div>

<style>
	.flow {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	img {
		position: absolute;
		top: 0;
		height: 100%;
	}
	.key {
		position: absolute;
		left: 14px;
		top: 84px;
		width: 64px;
	}
	/* the picture under it may be pale or dark: a dark rim keeps the word legible on either */
	.key text {
		fill: rgb(255 255 255 / 0.92);
		stroke: rgb(20 16 12 / 0.75);
		stroke-width: 2.4px;
		stroke-linejoin: round;
		paint-order: stroke;
		font: 600 9px var(--font-sans);
		text-anchor: middle;
	}
</style>
