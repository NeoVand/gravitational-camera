<script lang="ts">
	/**
	 * What the pixels of a near-field camera record, before any image is
	 * computed: the tidal field at each pixel, drawn as the distortion it would
	 * give a small ring of free particles. The pixels form a square array in the
	 * plane facing the scene.
	 */
	import { cameraBasis, type AnalyzedObject, type Vec3, type View } from '../engine';
	import { contract, massPoints, tidalTensor } from '../engine/tidal';

	interface Props {
		objects: AnalyzedObject[];
		observer: Vec3;
		view: View;
		/** Width of the pixel array, metres. */
		span?: number;
		/** Remove what all pixels have in common, leaving the differences. */
		differences?: boolean;
		/** Leave the empty room (background objects) out. */
		subtractRoom?: boolean;
	}

	let {
		objects,
		observer,
		view,
		span = 1,
		differences = false,
		subtractRoom = false
	}: Props = $props();

	const COLS = 11;
	const ROWS = 7;
	const points = $derived(massPoints(objects, 0.25, subtractRoom));

	const glyphs = $derived.by(() => {
		const { right, up } = cameraBasis(view);
		const cells: { x: number; y: number; a: number; b: number }[] = [];
		for (let j = 0; j < ROWS; j++) {
			for (let i = 0; i < COLS; i++) {
				const u = (i / (COLS - 1) - 0.5) * span;
				const v = (0.5 - j / (ROWS - 1)) * span * (ROWS / COLS);
				const at: Vec3 = [
					observer[0] + u * right[0] + v * up[0],
					observer[1] + u * right[1] + v * up[1],
					observer[2] + u * right[2] + v * up[2]
				];
				const e = tidalTensor(points, at);
				// the part of the field lying in the plane of the array, without its trace
				const rr = contract(e, right, right);
				const uu = contract(e, up, up);
				cells.push({ x: i, y: j, a: (rr - uu) / 2, b: contract(e, right, up) });
			}
		}
		if (differences) {
			const ma = cells.reduce((s, c) => s + c.a, 0) / cells.length;
			const mb = cells.reduce((s, c) => s + c.b, 0) / cells.length;
			for (const c of cells) {
				c.a -= ma;
				c.b -= mb;
			}
		}
		const peak = Math.max(...cells.map((c) => Math.hypot(c.a, c.b)), 1e-300);
		return {
			peak,
			cells: cells.map((c) => {
				const size = Math.hypot(c.a, c.b);
				// free particles are stretched along the axis of the negative eigenvalue
				const angle = 0.5 * Math.atan2(c.b, c.a) + Math.PI / 2;
				return { x: c.x, y: c.y, stretch: 0.62 * Math.sqrt(size / peak), angle };
			})
		};
	});

	const sci = (v: number) => {
		const e = Math.floor(Math.log10(v));
		const sup = String(e).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
		return `${(v / 10 ** e).toFixed(1)} × 10${sup}`;
	};
</script>

<div class="field">
	<svg
		viewBox="-1 -1 {COLS + 1} {ROWS + 1}"
		role="img"
		aria-label="Tidal distortion recorded at each pixel of the array"
	>
		{#each glyphs.cells as g (`${g.x}-${g.y}`)}
			<!-- the screen's y axis points down, so the angle is negated -->
			<g transform="translate({g.x} {g.y}) rotate({(-g.angle * 180) / Math.PI})">
				<ellipse rx={0.3 * (1 + g.stretch)} ry={0.3 * (1 - g.stretch)} />
				<line x1={-0.3 * (1 + g.stretch)} x2={0.3 * (1 + g.stretch)} />
			</g>
		{/each}
	</svg>
	<p>
		Each mark is one pixel of a {span} m array: the way the tidal field there distorts a ring of free
		particles. Largest {differences ? 'difference' : 'distortion'} shown:
		{sci(glyphs.peak)} s⁻².
	</p>
</div>

<style>
	.field {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-rows: 1fr auto;
		padding: 3.2rem 1.2rem 0.8rem;
		pointer-events: none;
	}

	svg {
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	ellipse {
		fill: rgb(127 180 255 / 0.12);
		stroke: rgb(190 220 255 / 0.9);
		stroke-width: 0.03;
	}

	line {
		stroke: rgb(255 255 255 / 0.95);
		stroke-width: 0.035;
		stroke-linecap: round;
	}

	p {
		margin: 0.4rem 0 0;
		font-size: 0.74rem;
		line-height: 1.4;
		color: rgb(255 255 255 / 0.75);
		text-align: center;
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.9);
	}
</style>
