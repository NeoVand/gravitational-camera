<script lang="ts">
	/**
	 * One reading of a wave of the metric, and what it says (lib/pixel/beyond.ts): E (six numbers, with its trace)
	 * and B (eight, with its antisymmetric part) as grids; the six polarizations as set and as read back, the phase
	 * speed, and whether the reading is one metric wave at all.
	 */
	import { fitText } from './figure-text';
	import type { Inversion } from '../pixel/beyond';

	interface Props {
		E: number[][];
		B: number[][];
		set: Inversion['pol'];
		read: Inversion;
		/** the phase speed as set, v_p / c */
		speed: number;
	}

	let { E, B, set, read, speed }: Props = $props();

	const KEYS = ['plus', 'cross', 'x', 'y', 'b', 'l'] as const;
	const NAMES = ['plus', 'cross', 'vector x', 'vector y', 'breathing', 'longitudinal'];
	const ok = $derived(read.residual < 1e-6);
	// the reading's scale is arbitrary: compare shapes, scaled to the largest set amplitude
	const scale = $derived.by(() => {
		const big = KEYS.reduce(
			(b, k) => (Math.abs(set[k]) > Math.abs(set[b]) ? k : b),
			'plus' as (typeof KEYS)[number]
		);
		return Math.abs(read.pol[big]) > 0 ? set[big] / read.pol[big] : 0;
	});
	const top = $derived(
		Math.max(
			1e-9,
			...KEYS.map((k) => Math.abs(set[k])),
			...KEYS.map((k) => Math.abs(read.pol[k] * scale))
		)
	);
	const gridTop = $derived(Math.max(1e-30, ...E.flat().map(Math.abs), ...B.flat().map(Math.abs)));

	/** A number of a grid as a colour of the theme: the accent where it is positive, light's colour where negative. */
	function cell(v: number) {
		const t = Math.min(1, Math.abs(v) / gridTop);
		const ink = v >= 0 ? 'var(--accent)' : 'var(--c-light)';
		return `color-mix(in srgb, ${ink} ${(100 * (0.12 + 0.88 * t)).toFixed(1)}%, transparent)`;
	}

	// --- the layout, in drawing units, set by the size of the words on the screen -----------------------------------
	const W = 640;
	/** the tallest a bar is drawn, up or down */
	const BAR = 70;
	/** the size of the drawing's words, in its units, as measured on the screen */
	let em = $state(12);
	const head = $derived(1.05 * em);
	const grid = $derived(head + 2.5 * em + 0.7 * em);
	const title = $derived(grid + 116 + 2.6 * em);
	const zero = $derived(title + 1.25 * em + 0.9 * em + BAR);
	/** Bar heights, set and read, in drawing units, upward positive. */
	const bars = $derived(
		KEYS.map((k) => ({ set: (set[k] / top) * BAR, read: ((read.pol[k] * scale) / top) * BAR }))
	);
	/** The names sit just under the lowest bar that reaches below the line, all on one row. */
	const below = $derived(Math.max(0, ...bars.map((b) => -Math.min(b.set, b.read, 0))));
	/** Too narrow for the names in a row: every other one a line lower. */
	const SLOT = (W - 80) / 6;
	const staggered = $derived(SLOT < 6.6 * em);
	/** The drawing ends under the names, wherever the bars put them. */
	const H = $derived(zero + below + 1.35 * em + (staggered ? 1.2 * em : 0) + 0.45 * em);
</script>

<div class="frame">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="One reading of a metric wave, and what it says"
		{@attach fitText((_, size) => (em = size))}
	>
		{#each [['E', E, 'the tide:', 'six numbers, with its trace'], ['B', B, 'its magnetic part:', 'eight, with a twist']] as [name, M, sub1, sub2], g (name)}
			{@const middle = W / 2 + (g ? 150 : -150)}
			<text x={middle} y={head} class="head"
				><tspan class="symbol">{name === 'E' ? 'ℰ' : 'ℬ'}</tspan></text
			>
			<text x={middle} y={head + 1.3 * em} class="sub">{sub1}</text>
			<text x={middle} y={head + 2.45 * em} class="sub">{sub2}</text>
			{#each M as number[][] as row, i (i)}
				{#each row as v, j (j)}
					<rect
						x={middle - 76 + j * 52}
						y={grid + i * 40}
						width="48"
						height="36"
						rx="4"
						style:fill={cell(v)}
					/>
				{/each}
			{/each}
		{/each}
		<!-- the six polarizations, as set (outline) and as read (filled) -->
		<text x={W / 2} y={title} class="head">the six polarizations</text>
		<text x={W / 2} y={title + 1.25 * em} class="sub">outline: as set · filled: as read</text>
		<line x1="40" x2={W - 40} y1={zero} y2={zero} class="zero" />
		{#each KEYS as k, i (k)}
			{@const middle = 40 + SLOT * (i + 0.5)}
			{@const b = bars[i]}
			<rect
				x={middle - 20}
				y={zero - Math.max(b.read, 0)}
				width="40"
				height={Math.abs(b.read)}
				class={['read', { gr: i < 2 }]}
			/>
			<rect
				x={middle - 24}
				y={zero - Math.max(b.set, 0)}
				width="48"
				height={Math.abs(b.set)}
				class="set"
			/>
			<text
				x={middle}
				y={zero + below + 1.3 * em + (staggered && i % 2 ? 1.2 * em : 0)}
				class={['name', { gr: i < 2 }]}>{NAMES[i]}</text
			>
		{/each}
	</svg>
	<div class="reads">
		<p>
			<span class="dim">phase speed read</span>
			<span class="value">{(1 / read.n).toFixed(4)} c</span>
			<span class="dim">(set {speed.toFixed(4)} c)</span>
		</p>
		<p class={ok ? 'pass' : 'fail'}>
			{ok
				? 'five checks pass: one metric wave'
				: `the checks fail: not one wave (residual ${(read.residual * 100).toFixed(0)} %)`}
		</p>
	</div>
</div>

<style>
	.frame {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		padding: var(--stage-pad, 2rem 1.5rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		/* the size of the words on the screen, as on every figure */
		--t: 12px;
		/* light's colour, for the negative numbers beside the positive (the accent), in either theme */
		--c-light: #7fb4ff;
	}
	:global(:root[data-theme='light']) .frame {
		--c-light: #2d5f8e;
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .frame {
			--c-light: #2d5f8e;
		}
	}
	:global(:root .always-dark) .frame {
		--c-light: #7fb4ff;
	}
	/* the drawing as large as the picture allows, with room for the readings under it */
	svg {
		display: block;
		flex: none;
		width: var(--figure-width, min(100%, 54rem, calc((100cqh - 4rem) * 640 / 400)));
		height: auto;
	}
	@container (max-width: 34rem) {
		svg {
			--t: 11px;
		}
	}
	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		text-anchor: middle;
	}
	.head {
		fill: var(--text);
		font-size: calc((var(--t) + 1px) * var(--u, 1));
		font-weight: 600;
	}
	.symbol {
		font-family: var(--font-serif);
		font-size: 1.45em;
		font-weight: 400;
	}
	.sub {
		fill: var(--text-dim);
	}
	.zero {
		stroke: color-mix(in srgb, var(--text) 36%, transparent);
	}
	.set {
		fill: none;
		stroke: var(--text);
		stroke-width: 1.2;
		stroke-dasharray: 3 2;
	}
	.read {
		fill: var(--text-dim);
	}
	.read.gr {
		fill: var(--accent);
	}
	.name {
		fill: var(--text-dim);
	}
	.name.gr {
		fill: var(--accent);
	}
	/* the readings: each part stays whole, and they go one under the other when the picture is narrow */
	.reads {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3rem 1.6rem;
		color: var(--text);
		font: 400 0.875rem/1.3 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-align: center;
	}
	.reads p {
		margin: 0;
		white-space: nowrap;
	}
	.value {
		font-weight: 500;
	}
	.dim {
		color: var(--text-dim);
	}
	/* the verdict: the accent when the checks pass, the theme's red when they fail */
	.pass {
		color: var(--accent);
		font-weight: 500;
	}
	.fail {
		color: var(--bad);
		font-weight: 500;
	}
</style>
