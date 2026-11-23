<script lang="ts">
	/**
	 * How far is a binary, from one pixel (lib/pixel/ranging.ts): for each way of ranging, its signal over its noise
	 * against the reduced distance kr. Where a line falls below one, that way can no longer range the source. The
	 * source is marked at its distance, with what each way reads.
	 */
	import { fromRank, fromSplit, reach } from '../pixel/ranging';

	interface Props {
		kr: number;
		rho: number;
		iota: number;
	}

	let { kr, rho, iota }: Props = $props();

	const W = 640,
		H = 360,
		L = 70,
		R = 24,
		T = 26,
		B = 52;
	const X0 = 0,
		X1 = 6,
		Y0 = -3,
		Y1 = 6; // decades
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
</script>

<div class="frame">
	<svg
		viewBox="0 0 {W} {H}"
		role="img"
		aria-label="Signal over noise of each way of ranging, against distance"
	>
		<!-- the noise -->
		<line x1={L} x2={W - R} y1={y(1)} y2={y(1)} class="noise" />
		<text x={W - R} y={y(1) + 15} class="note end">noise</text>
		<!-- axes -->
		{#each [0, 1, 2, 3, 4, 5, 6] as d (d)}
			<line x1={x(10 ** d)} x2={x(10 ** d)} y1={H - B} y2={H - B + 5} class="axis" />
			<text x={x(10 ** d)} y={H - B + 19} class="tick"
				>10<tspan dy="-5" font-size="9">{d}</tspan></text
			>
		{/each}
		{#each [-3, 0, 3, 6] as d (d)}
			<line x1={L - 5} x2={L} y1={y(10 ** d)} y2={y(10 ** d)} class="axis" />
			<text x={L - 9} y={y(10 ** d) + 4} class="tick end"
				>10<tspan dy="-5" font-size="9">{d}</tspan></text
			>
		{/each}
		<line x1={L} x2={L} y1={T} y2={H - B} class="axis" />
		<line x1={L} x2={W - R} y1={H - B} y2={H - B} class="axis" />
		<text x={(L + W - R) / 2} y={H - 10} class="label"
			>distance, in reduced wavelengths <tspan font-style="italic">kr</tspan></text
		>
		<text x="16" y={(T + H - B) / 2} class="label" transform="rotate(-90 16 {(T + H - B) / 2})"
			>signal over noise</text
		>
		<!-- the two ways -->
		<path d={rank} class="rank" />
		<path d={split} class="split" />
		<text x={x(far.rank) - 6} y={y(1) - 8} class="note end rank-note"
			>rank: reaches {Math.round(far.rank)}</text
		>
		<text
			x={Math.min(x(far.split) + 6, W - R - 2)}
			y={y(1) - 8}
			class="note split-note"
			text-anchor={x(far.split) > W - 150 ? 'end' : 'start'}
			>split: reaches {far.split >= 1e6 ? '> 10⁶' : Math.round(far.split)}</text
		>
		<!-- the source -->
		<line x1={x(kr)} x2={x(kr)} y1={T} y2={H - B} class="source" />
		<text x={x(kr) + 5} y={T + 10} class="note">the source</text>
	</svg>
	<div class="reads">
		<p>
			<span class="split-key">from the split</span>
			{Number.isFinite(s.krSigma)
				? `${Math.round(kr)} ± ${Math.max(1, Math.round(s.krSigma))}`
				: 'lost in the noise'}
		</p>
		<p>
			<span class="rank-key">from the rank</span>
			{Number.isFinite(r.krSigma)
				? `${Math.round(kr)} ± ${Math.max(1, Math.round(r.krSigma))}`
				: 'lost in the noise'}
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
		gap: 0.6rem;
		padding: var(--stage-pad, 4.5rem 1rem 6rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
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
	svg {
		width: var(--figure-width, min(56cqw, 110cqh));
		height: auto;
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
	.source {
		stroke: var(--text);
		stroke-width: 1.2;
	}
	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}
	.tick {
		font-size: 11px;
		text-anchor: middle;
	}
	.end {
		text-anchor: end;
	}
	.label {
		font-size: 12px;
		text-anchor: middle;
		fill: var(--text);
	}
	.note {
		font-size: 12px;
	}
	.split-note {
		fill: var(--accent);
	}
	.rank-note {
		fill: var(--c-light);
	}
	.reads {
		display: flex;
		gap: 1.6rem;
		color: var(--text);
		font: 500 0.85rem/1.2 var(--font-mono);
	}
	.reads p {
		margin: 0;
	}
	.split-key,
	.rank-key {
		font-family: var(--font-sans);
		margin-right: 0.4em;
	}
	.split-key {
		color: var(--accent);
	}
	.rank-key {
		color: var(--c-light);
	}
</style>
