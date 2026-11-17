<script lang="ts">
	/**
	 * One reading of a wave of the metric, and what it says (lib/pixel/beyond.ts): E (six numbers, with its trace)
	 * and B (eight, with its antisymmetric part) as grids; the six polarizations as set and as read back, the phase
	 * speed, and whether the reading is one metric wave at all.
	 */
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

	function cell(v: number) {
		const t = Math.min(1, Math.abs(v) / gridTop);
		return v >= 0
			? `rgba(232, 164, 90, ${0.12 + 0.88 * t})`
			: `rgba(127, 180, 255, ${0.12 + 0.88 * t})`;
	}
</script>

<div class="frame">
	<svg viewBox="0 0 640 410" role="img" aria-label="One reading of a metric wave, and what it says">
		{#each [['E', E, 'the tide: six numbers, with its trace'], ['B', B, 'its magnetic part: eight, with a twist']] as [name, M, sub], g (name)}
			<g transform="translate({90 + g * 300} 20)">
				<text x="75" y="0" class="head">{name === 'E' ? 'ℰ' : 'ℬ'}</text>
				<text x="75" y="16" class="sub">{sub}</text>
				{#each M as number[][] as row, i (i)}
					{#each row as v, j (j)}
						<rect x={j * 52} y={28 + i * 40} width="48" height="36" rx="4" fill={cell(v)} />
					{/each}
				{/each}
			</g>
		{/each}
		<!-- the six polarizations, as set (outline) and as read (filled) -->
		<g transform="translate(40 200)">
			<text x="0" y="0" class="head start">the six polarizations</text>
			<text x="0" y="16" class="sub start"
				>outline: as set · filled: read from the one reading above</text
			>
			<line x1="0" x2="560" y1="110" y2="110" class="zero" />
			{#each KEYS as k, i (k)}
				{@const x = 20 + i * 92}
				{@const hs = (set[k] / top) * 70}
				{@const hr = ((read.pol[k] * scale) / top) * 70}
				<rect
					x={x + 8}
					y={110 - Math.max(hr, 0)}
					width="40"
					height={Math.abs(hr)}
					class={['read', { gr: i < 2 }]}
				/>
				<rect x={x + 4} y={110 - Math.max(hs, 0)} width="48" height={Math.abs(hs)} class="set" />
				<text x={x + 28} y="200" class={['name', { gr: i < 2 }]}>{NAMES[i]}</text>
			{/each}
		</g>
	</svg>
	<div class="reads">
		<p>
			<span class="dim">phase speed read</span>
			{(1 / read.n).toFixed(4)} c
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
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 4.5rem 1rem 6rem;
		background: radial-gradient(circle at 50% 45%, #10141b 0%, #07090d 70%);
	}
	svg {
		width: min(54vw, 100vh);
		height: auto;
	}
	text {
		font-family: var(--font-sans);
		text-anchor: middle;
	}
	.start {
		text-anchor: start;
	}
	.head {
		fill: #e9e6df;
		font-size: 15px;
		font-weight: 600;
	}
	.sub {
		fill: #a09d96;
		font-size: 11.5px;
	}
	.zero {
		stroke: rgb(255 255 255 / 0.3);
	}
	.set {
		fill: none;
		stroke: #e9e6df;
		stroke-width: 1.2;
		stroke-dasharray: 3 2;
	}
	.read {
		fill: #a09d96;
	}
	.read.gr {
		fill: #e8a45a;
	}
	.name {
		fill: #a09d96;
		font-size: 12px;
	}
	.name.gr {
		fill: #e8a45a;
	}
	.reads {
		display: flex;
		gap: 1.6rem;
		color: #e9e6df;
		font: 500 0.85rem/1.2 var(--font-mono);
	}
	.reads p {
		margin: 0;
	}
	.dim {
		color: #a09d96;
		font-family: var(--font-sans);
	}
	.pass {
		color: #7bd88f;
		font-family: var(--font-sans);
	}
	.fail {
		color: #ff9c8a;
		font-family: var(--font-sans);
	}
</style>
