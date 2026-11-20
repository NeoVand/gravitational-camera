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
	<svg
		viewBox="-140 -160 280 318"
		class="sky"
		role="img"
		aria-label={title}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={() => (drag = undefined)}
		onpointercancel={() => (drag = undefined)}
	>
		<text class="title" x="0" y="-138">{title}</text>
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
		<text class="sub" x="0" y="140">{sub}</text>
	</svg>
{/snippet}

<div class="row">
	{@render sphere('the sky', 'its sources, independent and alike', maps.sky, true)}
	{@render sphere(
		'one pixel, second moments',
		'harmonics of degree four and below',
		maps.second,
		false
	)}
	{@render sphere('fourth moments', 'up to degree eight, if not Gaussian', maps.fourth, false)}
</div>

<style>
	.row {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: var(--stage-pad, 5rem 1rem 6rem);
		background: radial-gradient(circle at 50% 45%, #2a2016 0%, #18120b 70%);
	}
	.sky {
		width: var(--figure-width, min(24cqw, 46cqh));
		height: auto;
		touch-action: none;
		user-select: none;
		cursor: grab;
	}
	/* a tall frame: one sphere above another (the row cannot query its own shape, so the page's is used) */
	@media (orientation: portrait) {
		.row {
			flex-direction: column;
		}
	}
	@container (aspect-ratio < 1) {
		.sky {
			width: min(60cqw, 26cqh);
		}
	}
	.disc {
		fill: #0e1016;
		stroke: rgb(255 255 255 / 0.3);
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
	text {
		font-family: var(--font-sans);
		text-anchor: middle;
		pointer-events: none;
	}
	.title {
		fill: #e9e6df;
		font-size: 14px;
		font-weight: 600;
	}
	.sub {
		fill: #a09d96;
		font-size: 11.5px;
	}
</style>
