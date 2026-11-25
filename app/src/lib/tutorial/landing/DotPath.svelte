<script lang="ts">
	/**
	 * A route drawn as a path of dots, one per chapter, toned by part; a reading chapter is an open ring. Pointing
	 * at a dot, or reaching it with the keyboard, names its chapter; each dot links to its chapter. The dots are
	 * evenly spaced, with a little more room where a part ends.
	 */
	import { resolve } from '$app/paths';
	import type { LandingChapter } from '../landing';
	import { rove } from './rove';

	interface Props {
		chapters: LandingChapter[];
		/** what the path is, for a screen reader: "The route to Section IV" */
		label: string;
	}

	let { chapters, label }: Props = $props();

	const STEP = 10;
	const GAP = 12;
	const PAD = 6;
	const H = 30;
	const Y = H / 2;
	/** a dot's radius */
	const R = 3.6;

	const xs = $derived.by(() => {
		let gaps = 0;
		return chapters.map((c, i) => {
			if (i > 0 && c.part !== chapters[i - 1].part) gaps += 1;
			return PAD + 3 + i * STEP + gaps * (GAP - STEP / 2);
		});
	});

	const width = $derived((xs.at(-1) ?? 0) + PAD + 3);

	let active = $state<number | undefined>(undefined);

	const tone = (part: string) => Number(part) / 13;
	const name = (c: LandingChapter) => `${c.id} ${c.title}${c.reading ? ' (reading)' : ''}`;
</script>

<div class="path" style:--w={width}>
	<svg
		viewBox="0 0 {width} {H}"
		role="group"
		aria-label={label}
		onpointerleave={() => (active = undefined)}
		{@attach rove()}
	>
		<polyline class="line" points={xs.map((x) => `${x},${Y}`).join(' ')} />
		{#each chapters as c, i (c.id)}
			{#if c.href}
				<a
					href={resolve(c.href as '/')}
					data-rove
					aria-label={name(c)}
					onpointerenter={() => (active = i)}
					onfocus={() => (active = i)}
					onblur={() => (active = undefined)}
				>
					<rect class="hit" x={xs[i] - 5} y="0" width="10" height={H} />
					<circle
						class={['dot', { reading: c.reading, on: active === i }]}
						style:--k={tone(c.part)}
						cx={xs[i]}
						cy={Y}
						r={R}
					/>
				</a>
			{:else}
				<circle
					class={['dot', 'planned', { reading: c.reading }]}
					style:--k={tone(c.part)}
					cx={xs[i]}
					cy={Y}
					r={R}
				/>
			{/if}
		{/each}
	</svg>
	{#if active !== undefined}
		{@const c = chapters[active]}
		{@const at = xs[active] / width}
		<span
			class={['tip', { left: at < 0.25, right: at > 0.75 }]}
			style:left="{at * 100}%"
			aria-hidden="true"
		>
			<span class="id">{c.id}</span>
			{c.title}
		</span>
	{/if}
</div>

<style>
	/* evenly spaced dots keep their size: a short route is a short path */
	.path {
		position: relative;
		width: min(100%, calc(var(--w) * 1.3px));
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.line {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: 1.2;
		vector-effect: non-scaling-stroke;
	}

	.hit {
		fill: transparent;
	}

	.dot {
		--tone: color-mix(in oklab, var(--accent) calc(var(--k) * 100%), var(--accent-2));
		fill: var(--tone);
		stroke: var(--tone);
		stroke-width: 1.4;
		vector-effect: non-scaling-stroke;
		transition: r 0.12s;
	}

	.dot.reading {
		fill: var(--bg);
	}

	.dot.planned {
		opacity: 0.4;
	}

	.dot.on {
		r: 5.2;
	}

	a {
		cursor: pointer;
		outline: none;
	}

	a:focus-visible .dot {
		stroke: var(--text);
		stroke-width: 2;
	}

	.tip {
		position: absolute;
		bottom: calc(100% + 0.2rem);
		z-index: 2;
		width: max-content;
		max-width: min(24rem, 80vw);
		padding: 0.15rem 0.4rem;
		translate: -50% 0;
		background: var(--bg);
		color: var(--text);
		font: 400 0.9rem/1.3 var(--font-serif);
		pointer-events: none;
	}

	.tip.left {
		translate: -0.6rem 0;
	}

	.tip.right {
		translate: calc(-100% + 0.6rem) 0;
	}

	.tip .id {
		margin-right: 0.3em;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	@media (prefers-reduced-motion: reduce) {
		.dot {
			transition: none;
		}
	}
</style>
