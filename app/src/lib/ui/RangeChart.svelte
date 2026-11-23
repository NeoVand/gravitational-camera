<script lang="ts">
	/**
	 * How far is a binary, from one pixel (lib/pixel/ranging.ts): for each way of ranging, its signal over its noise
	 * against the reduced distance kr. Where a line falls below one, that way can no longer range the source. The
	 * source is marked at its distance, with what each way reads.
	 */
	import { fitText } from './figure-text';
	import { fromRank, fromSplit, reach } from '../pixel/ranging';

	interface Props {
		kr: number;
		rho: number;
		iota: number;
	}

	let { kr, rho, iota }: Props = $props();

	const W = 640,
		H = 360,
		R = 16,
		T = 14;
	const X0 = 0,
		X1 = 6,
		Y0 = -3,
		Y1 = 6; // decades
	/** The size of the drawing's words, in its own units, as measured on the screen: they are placed by it. */
	let em = $state(12);
	/** The margins at the left and the foot, for the numbers on the axes and the axes' names, as large as the words. */
	const L = $derived(8 + 3.7 * em);
	const B = $derived(8 + 3.1 * em);
	const x = (k: number) => L + ((Math.log10(k) - X0) / (X1 - X0)) * (W - L - R);
	const y = (v: number) => T + (1 - (Math.log10(Math.max(v, 1e-9)) - Y0) / (Y1 - Y0)) * (H - T - B);

	function curve(f: (k: number) => number): string {
		let d = '';
		for (let i = 0; i <= 160; i++) {
			const k = 10 ** (X0 + ((X1 - X0) * i) / 160);
			const v = f(k);
			if (v < 10 ** Y0 || v > 10 ** Y1) continue;
			d += `${d ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`;
		}
		return d;
	}

	const split = $derived(
		curve((k) => fromSplit(iota, k, rho).value / fromSplit(iota, k, rho).sigma)
	);
	const rank = $derived(curve((k) => fromRank(iota, k, rho).value / fromRank(iota, k, rho).sigma));
	const far = $derived(reach(iota, rho));
	const s = $derived(fromSplit(iota, kr, rho));
	const r = $derived(fromRank(iota, kr, rho));

	/** Where each way's line crosses the noise. */
	const rankAt = $derived(x(far.rank));
	const splitAt = $derived(x(Math.min(far.split, 10 ** X1)));
	/**
	 * The rank's name goes under the noise, left of where its line crosses it, where the line is above the noise and
	 * nothing else is drawn: on one line, or on two if the axis is near; if there is no room even for that, right of
	 * the crossing, far enough out that the falling line has passed under.
	 */
	const rankRoom = $derived(rankAt - L > 10 * em ? 'one' : rankAt - L > 5.8 * em ? 'two' : 'right');
	/** The split's name goes over the noise, right of its crossing, or left of it near the right edge. */
	const splitRight = $derived(W - R - splitAt > 11 * em);
	/** The source's name beside the top of its line, on whichever side has room. */
	const sourceRight = $derived(W - R - x(kr) > 6.5 * em);
	/** A distance with its error, or the words for none. */
	const range = (sigma: number) =>
		Number.isFinite(sigma)
			? `${Math.round(kr)} ± ${Math.max(1, Math.round(sigma))}`
			: 'lost in the noise';
</script>

<div class="frame">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Signal over noise of each way of ranging, against distance"
		{@attach fitText((_, size) => (em = size))}
	>
		<!-- axes -->
		{#each [0, 1, 2, 3, 4, 5, 6] as d (d)}
			<line x1={x(10 ** d)} x2={x(10 ** d)} y1={H - B} y2={H - B + 5} class="axis" />
			<text x={x(10 ** d)} y={H - B + 6} dy="1.1em" class="tick"
				>10<tspan class="sup" dy="-0.5em">{d}</tspan></text
			>
		{/each}
		{#each [-3, 0, 3, 6] as d (d)}
			<line x1={L - 5} x2={L} y1={y(10 ** d)} y2={y(10 ** d)} class="axis" />
			<text x={L - 8} y={y(10 ** d)} dy="0.35em" class="tick end"
				>10<tspan class="sup" dy="-0.5em">{d}</tspan></text
			>
		{/each}
		<line x1={L} x2={L} y1={T} y2={H - B} class="axis" />
		<line x1={L} x2={W - R} y1={H - B} y2={H - B} class="axis" />
		<text x={(L + W - R) / 2} y={H - B + 6} dy="2.65em" class="label"
			>distance, in reduced wavelengths <tspan font-style="italic">kr</tspan></text
		>
		<text
			x="0"
			y={(T + H - B) / 2}
			dy="0.8em"
			class="label"
			transform="rotate(-90 0 {(T + H - B) / 2})">signal over noise</text
		>
		<!-- the noise -->
		<line x1={L} x2={W - R} y1={y(1)} y2={y(1)} class="noise" />
		<text x={W - R} y={y(1)} dy="1.3em" class="note end">noise</text>
		<!-- the source -->
		<line x1={x(kr)} x2={x(kr)} y1={T} y2={H - B} class="source" />
		<text
			x={x(kr)}
			dx={sourceRight ? '0.45em' : '-0.45em'}
			y={T}
			dy="0.8em"
			class={['note', 'ink', { end: !sourceRight }]}>the source</text
		>
		<!-- the two ways, and where each is lost in the noise -->
		<path d={rank} class="rank" />
		<path d={split} class="split" />
		<circle cx={rankAt} cy={y(1)} r="3.5" class="rank-dot" />
		{#if far.split < 10 ** X1}<circle cx={splitAt} cy={y(1)} r="3.5" class="split-dot" />{/if}
		{#if rankRoom === 'two'}
			<text x={rankAt - 0.4 * em} y={y(1)} class="note rank-note end"
				><tspan x={rankAt - 0.4 * em} dy="1.3em">rank:</tspan><tspan
					x={rankAt - 0.4 * em}
					dy="1.15em">reaches {Math.round(far.rank)}</tspan
				></text
			>
		{:else}
			<text
				x={rankRoom === 'one' ? rankAt - 0.4 * em : rankAt + 2.4 * em}
				y={y(1)}
				dy="1.3em"
				class={['note', 'rank-note', { end: rankRoom === 'one' }]}
				>rank: reaches {Math.round(far.rank)}</text
			>
		{/if}
		<text
			x={splitRight ? splitAt + 0.5 * em : splitAt - 0.5 * em}
			y={y(1)}
			dy="-0.6em"
			class={['note', 'split-note', { end: !splitRight }]}
			>split: reaches {#if far.split >= 1e6}more than 10<tspan class="sup" dy="-0.5em">6</tspan
				>{:else}{Math.round(far.split)}{/if}</text
		>
	</svg>
	<div class="reads">
		<p>
			<span class="split-key">from the split</span> <span class="value">{range(s.krSigma)}</span>
		</p>
		<p>
			<span class="rank-key">from the rank</span> <span class="value">{range(r.krSigma)}</span>
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
		/* the rank's colour, light's, beside the split's (the accent), in either theme */
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
	/* the chart as wide as the picture allows, with room for the two readings under it */
	svg {
		display: block;
		flex: none;
		width: var(--figure-width, min(100%, 60rem, calc((100cqh - 4rem) * 640 / 360)));
		height: auto;
		overflow: visible;
	}
	@container (max-width: 34rem) {
		svg {
			--t: 11px;
		}
	}
	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}
	.noise {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-dasharray: 4 4;
	}
	.split {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
	}
	.rank {
		fill: none;
		stroke: var(--c-light);
		stroke-width: 2;
	}
	.split-dot {
		fill: var(--accent);
	}
	.rank-dot {
		fill: var(--c-light);
	}
	.source {
		stroke: var(--text);
		stroke-width: 1.2;
	}
	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		fill: var(--text-dim);
	}
	.sup {
		font-size: 0.85em;
	}
	.tick {
		text-anchor: middle;
	}
	.end {
		text-anchor: end;
	}
	.label {
		text-anchor: middle;
		fill: var(--text);
	}
	.ink {
		fill: var(--text);
	}
	/* the notes keep a rim of the ground round them, so that a line passing under leaves them clear */
	.note {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
	}
	.split-note {
		fill: var(--accent);
		font-weight: 500;
	}
	.rank-note {
		fill: var(--c-light);
		font-weight: 500;
	}
	/* the two readings: each stays whole, and the second goes under the first when the picture is narrow */
	.reads {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3rem 1.6rem;
		color: var(--text);
		font: 400 0.875rem/1.3 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.reads p {
		margin: 0;
		white-space: nowrap;
	}
	.value {
		font-weight: 500;
	}
	.split-key,
	.rank-key {
		margin-right: 0.35em;
	}
	.split-key {
		color: var(--accent);
	}
	.rank-key {
		color: var(--c-light);
	}
</style>
