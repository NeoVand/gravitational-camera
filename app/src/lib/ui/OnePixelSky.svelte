<script lang="ts">
	/**
	 * A sky, and what one pixel can know of it (lib/pixel/sky.ts): from second moments its harmonics of degree four
	 * and below, from fourth moments up to degree eight. Three spheres turned together; drag to turn them.
	 */
	import type { Vec3 } from '../pixel/complex';
	import { lowPass, type Source } from '../pixel/sky';
	import { greatCircle, project, toWorld } from '../pixel/view';

	interface Props {
		sources: Source[] | 'uniform';
		yaw: number;
		pitch: number;
	}

	let { sources, yaw = $bindable(), pitch = $bindable() }: Props = $props();

	const R = 110;
	const SIZE = 120;
	const LEVEL = 12 / (4 * Math.PI); // a uniform sky's brightness
	const view = $derived({ yaw, pitch });
	const circles = $derived([greatCircle(view, [0, 1, 0], R), greatCircle(view, [0, 0, 1], R)]);

	/** Brightness to colour: dark, through the accent at a uniform sky's level, to cream. */
	function colour(v: number): [number, number, number] {
		const t = Math.max(0, Math.min(1, v / (2.6 * LEVEL)));
		const stops: [number, number, number][] = [
			[14, 16, 22],
			[150, 82, 26],
			[232, 164, 90],
			[250, 238, 220]
		];
		const x = t * (stops.length - 1);
		const i = Math.min(stops.length - 2, Math.floor(x));
		const f = x - i;
		return [0, 1, 2].map((k) => stops[i][k] + (stops[i + 1][k] - stops[i][k]) * f) as [
			number,
			number,
			number
		];
	}

	function render(f: (n: Vec3) => number): string {
		if (typeof document === 'undefined') return '';
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = SIZE;
		const ctx = canvas.getContext('2d')!;
		const img = ctx.createImageData(SIZE, SIZE);
		for (let j = 0; j < SIZE; j++)
			for (let i = 0; i < SIZE; i++) {
				const x = ((i + 0.5) / SIZE) * 2 - 1,
					y = 1 - ((j + 0.5) / SIZE) * 2;
				const rr = x * x + y * y;
				if (rr > 1) continue;
				const c = colour(f(toWorld(view, [x, y, Math.sqrt(1 - rr)])));
				const k = (j * SIZE + i) * 4;
				img.data[k] = c[0];
				img.data[k + 1] = c[1];
				img.data[k + 2] = c[2];
				img.data[k + 3] = 255 * Math.min(1, (1 - Math.sqrt(rr)) * SIZE * 0.5);
			}
		ctx.putImageData(img, 0, 0);
		return canvas.toDataURL();
	}

	const maps = $derived({
		sky: sources === 'uniform' ? render(() => LEVEL) : '',
		second: render((n) => lowPass(sources, 4, n)),
		fourth: render((n) => lowPass(sources, 8, n))
	});

	let drag: { x: number; y: number; yaw: number; pitch: number } | undefined;
	function down(e: PointerEvent) {
		// a drag is not a click: nothing under it takes the focus, and no text is selected
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		drag = { x: e.clientX, y: e.clientY, yaw, pitch };
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		yaw = drag.yaw + (e.clientX - drag.x) * 0.008;
		pitch = Math.max(-1.45, Math.min(1.45, drag.pitch + (e.clientY - drag.y) * 0.008));
	}
</script>

{#snippet sphere(title: string, sub: string, map: string, points: boolean)}
	<figure class="sphere">
		<p class="title">{title}</p>
		<svg
			viewBox="{-R - 3} {-R - 3} {2 * R + 6} {2 * R + 6}"
			class="sky"
			role="img"
			aria-label="{title}: {sub}"
			onpointerdown={down}
			onpointermove={move}
			onpointerup={() => (drag = undefined)}
			onpointercancel={() => (drag = undefined)}
		>
			<circle r={R} class="disc" />
			{#if map}<image href={map} x={-R} y={-R} width={2 * R} height={2 * R} />{/if}
			{#each circles as c, i (i)}
				<path d={c.back} class="back" />
				<path d={c.front} class="front" />
			{/each}
			{#if points && sources !== 'uniform'}
				{#each sources as s, i (i)}
					{@const p = project(view, s.direction, R)}
					<circle
						cx={p.x}
						cy={p.y}
						r={4 + Math.sqrt(s.weight) * 1.6}
						class={['source', { behind: p.z < 0 }]}
					/>
				{/each}
			{/if}
		</svg>
		<figcaption>{sub}</figcaption>
	</figure>
{/snippet}

<div class="row">
	<div class="spheres">
		{@render sphere('the sky', 'its sources, independent and alike', maps.sky, true)}
		{@render sphere(
			'one pixel, second moments',
			'harmonics of degree four and below',
			maps.second,
			false
		)}
		{@render sphere('fourth moments', 'up to degree eight, if not Gaussian', maps.fourth, false)}
	</div>
</div>

<style>
	.row {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--stage-pad, 2rem 1.5rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
	}
	/* the three side by side, their names on one line and their spheres on another, whatever the names' lengths */
	.spheres {
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-template-rows: repeat(3, auto);
		column-gap: 2.5cqw;
	}
	/* each sphere with its name above and what it shows under it, the words wrapping to the sphere's width */
	.sphere {
		grid-row: span 3;
		display: grid;
		grid-template-rows: subgrid;
		justify-items: center;
		row-gap: 0.55rem;
		width: var(--figure-width, min(30cqw, 20rem, calc(100cqh - 5.5rem)));
		margin: 0;
		font: 400 0.75rem/1.35 var(--font-sans);
		text-align: center;
	}
	.title {
		align-self: end;
		margin: 0;
		color: var(--text);
		font-size: 0.8125rem;
		font-weight: 600;
		text-wrap: balance;
	}
	figcaption {
		color: var(--text-dim);
		text-wrap: balance;
	}
	.sky {
		display: block;
		width: 100%;
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}
	/* a tall picture: one sphere above another */
	@container (aspect-ratio < 0.8) {
		.spheres {
			grid-template-columns: auto;
			grid-template-rows: repeat(9, auto);
			row-gap: 0.9rem;
		}
		.sphere {
			width: var(--figure-width, min(70cqw, calc((100cqh - 2rem) / 3 - 4.5rem)));
		}
	}
	@container (max-width: 34rem) {
		.sphere {
			font-size: 0.6875rem;
		}
		.title {
			font-size: 0.75rem;
		}
	}
	/* the spheres are pictures of a sky, dark in either theme; the lines and sources drawn on them keep to that dark */
	.disc {
		fill: #0e1016;
		stroke: var(--line-strong);
	}
	.front {
		fill: none;
		stroke: rgb(255 255 255 / 0.2);
	}
	.back {
		fill: none;
		stroke: rgb(255 255 255 / 0.08);
		stroke-dasharray: 3 4;
	}
	.source {
		fill: #f6e4c8;
		stroke: #e8a45a;
		stroke-width: 1.5;
	}
	.source.behind {
		opacity: 0.25;
	}
</style>
