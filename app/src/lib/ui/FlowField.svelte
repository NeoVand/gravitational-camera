<script lang="ts">
	/**
	 * The flow that the gravitomagnetic half of the camera images: the current
	 * column J = ∫ ρ v dr / r across the view, blurred by the camera's
	 * resolution for that (fainter) signal, drawn as arrows whose dashes run
	 * along the flow. Colour gives the sense of turning as the camera sees it.
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

	const COLS = 48;

	const arrows = $derived.by(() => {
		if (!width || !height || split >= 1) return [];
		const full = width / (1 - split);
		const rows = Math.max(8, Math.round((COLS * height) / full));
		const cell = full / COLS;
		const { right, up } = cameraBasis(view);
		// the flow on a grid of directions, as components across the screen
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
		const sigma = Math.max(0.3, blur / pixelAngle / cell);
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
		const bx = pass(pass(fx, true), false);
		const by = pass(pass(fy, true), false);
		let peak = 0;
		for (let k = 0; k < bx.length; k++) peak = Math.max(peak, Math.hypot(bx[k], by[k]));
		if (peak === 0) return [];
		// the sense of turning of the spinning body nearest each arrow, as seen
		const spinning = objects.filter((o) => o.spin && o.spin.rate !== 0);
		const out: { x: number; y: number; dx: number; dy: number; size: number; sense: number }[] = [];
		for (let j = 1; j < rows; j += 2)
			for (let i = 1; i < COLS; i += 2) {
				const k = j * COLS + i;
				const size = Math.hypot(bx[k], by[k]) / peak;
				if (size < 0.06) continue;
				const x = (i + 0.5) * cell - split * full;
				if (x < -cell) continue;
				const d = pixelDirection(view, COLS, rows, i, j);
				let best = spinning[0];
				let bestDot = -2;
				for (const o of spinning) {
					const c = o.center.map((v, m) => v - observer[m]);
					const n = Math.hypot(...c);
					const dot = (c[0] * d[0] + c[1] * d[1] + c[2] * d[2]) / n;
					if (dot > bestDot) {
						bestDot = dot;
						best = o;
					}
				}
				const toward = best.center.map((v, m) => observer[m] - v);
				const omega = best.spin!.axis.map((a) => a * best.spin!.rate);
				const sense = Math.sign(omega[0] * toward[0] + omega[1] * toward[1] + omega[2] * toward[2]);
				const length = Math.hypot(bx[k], by[k]);
				out.push({
					x,
					y: (j + 0.5) * cell,
					dx: bx[k] / length,
					dy: -by[k] / length,
					size,
					sense
				});
			}
		return out.map((a) => ({ ...a, cell }));
	});
</script>

<div class="flow" bind:clientWidth={width} bind:clientHeight={height} aria-hidden="true">
	<svg width="100%" height="100%">
		{#each arrows as a (`${a.x},${a.y}`)}
			{@const half = a.cell * (0.35 + 0.55 * Math.sqrt(a.size))}
			<g
				class={a.sense > 0 ? 'anticlockwise' : 'clockwise'}
				opacity={0.25 + 0.7 * Math.sqrt(a.size)}
				transform="translate({a.x} {a.y}) rotate({(Math.atan2(a.dy, a.dx) * 180) / Math.PI})"
			>
				<line x1={-half} y1="0" x2={half} y2="0" />
				<path d="M {half} 0 l -5 -3.2 l 0 6.4 z" />
			</g>
		{/each}
	</svg>
</div>

<style>
	.flow {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	svg {
		display: block;
		overflow: visible;
	}

	line {
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-dasharray: 5 4;
		animation: run 0.9s linear infinite;
	}

	@keyframes run {
		to {
			stroke-dashoffset: -9;
		}
	}

	/* the colours of the wave view: magenta anticlockwise, green clockwise */
	.anticlockwise line {
		stroke: rgb(250 120 225);
	}

	.anticlockwise path {
		fill: rgb(250 120 225);
	}

	.clockwise line {
		stroke: rgb(120 240 140);
	}

	.clockwise path {
		fill: rgb(120 240 140);
	}

	@media (prefers-reduced-motion: reduce) {
		line {
			animation: none;
		}
	}
</style>
