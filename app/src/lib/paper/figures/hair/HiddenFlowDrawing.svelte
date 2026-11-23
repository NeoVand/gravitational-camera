<script lang="ts">
	/**
	 * A hidden flow (lib/hair/flow.ts): a uniform sphere in section through its equator, seen along the axis about
	 * which it turns. The inner ball turns one way (orange) and the rest the other (blue), at the same rate; each
	 * arrow is the path of a part in one interval of time, and the arrows turn with the parts unless motion is
	 * unwanted. Beside it, for the pairs of tides h + ig = (x + iy)^n / n with n = 2 and 3, the share of each radius
	 * in the bracket {dQ_h/dt, dQ_g/dt}, each drawn to its own greatest value, and the sum.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { fitText } from '../../../ui/figure-text';
	import { angularMomentum, bracket, greatestShare, share } from '../../../hair/flow';

	interface Props {
		/** the radius of the inner ball, in units of R */
		inner: number;
		/** +1 if the inner ball turns counter-clockwise as seen, -1 if clockwise */
		sense?: number;
		/** whether the parts are shown turning */
		playing?: boolean;
	}

	let { inner, sense = 1, playing = true }: Props = $props();

	// --- the two layouts ---------------------------------------------------------------------------------------------

	interface Layout {
		W: number;
		H: number;
		/** the disc: centre and radius */
		cx: number;
		cy: number;
		R: number;
		/** the plots: left, right, and the zero line of each */
		left: number;
		right: number;
		zeros: [number, number];
		/** half the height of a plot */
		amp: number;
		/** the line of the angular momentum */
		momentumY: number;
		momentumX: number;
	}

	const WIDE: Layout = {
		W: 780,
		H: 430,
		cx: 200,
		cy: 222,
		R: 172,
		left: 462,
		right: 700,
		zeros: [100, 262],
		amp: 50,
		momentumY: 404,
		momentumX: 462
	};
	const TALL: Layout = {
		W: 360,
		H: 760,
		cx: 180,
		cy: 206,
		R: 158,
		left: 40,
		right: 262,
		zeros: [470, 608],
		amp: 42,
		momentumY: 742,
		momentumX: 40
	};

	let width = $state(800);
	let height = $state(450);
	const L = $derived(
		Math.min(width / TALL.W, height / TALL.H) > 1.08 * Math.min(width / WIDE.W, height / WIDE.H)
			? TALL
			: WIDE
	);

	function measure(node: HTMLElement) {
		const observer = new ResizeObserver(([entry]) => {
			width = entry.contentRect.width;
			height = entry.contentRect.height;
		});
		observer.observe(node);
		return () => observer.disconnect();
	}

	// --- the parts, turning ------------------------------------------------------------------------------------------

	/** The spacing of the rings of parts, in units of R, and the angle each arrow spans: the turn in one interval. */
	const SPACING = 0.105;
	const SPAN = 0.42;

	interface Arc {
		id: string;
		d: string;
		head: string;
		inside: boolean;
	}

	/** One arrow along the circle of radius r, from the angle a backwards by SPAN, pointing counter-clockwise. */
	function arc(r: number, a: number): { d: string; head: string } {
		const P = (t: number, rr = r) =>
			`${(rr * Math.cos(t)).toFixed(1)},${(-rr * Math.sin(t)).toFixed(1)}`;
		const head = Math.min(7, 0.5 * r * SPAN);
		const back = a - head / r;
		const spread = 0.5 * head;
		return {
			d: `M${P(a - SPAN)}A${r.toFixed(1)},${r.toFixed(1)} 0 0 0 ${P(back)}`,
			head: `M${P(a)}L${P(back, r + spread)}L${P(back, r - spread)}Z`
		};
	}

	const arcs = $derived.by(() => {
		const list: Arc[] = [];
		const x = Math.min(1, inner);
		// the rings of each part spread evenly across it, the innermost kept clear of the axis
		const within = Math.max(2, Math.round(x / SPACING));
		const beyond = x < 1 ? Math.max(1, Math.round((1 - x) / SPACING)) : 0;
		const radii = [
			...Array.from({ length: within }, (_, i) => (x * (i + 1.5)) / (within + 1)),
			...Array.from({ length: beyond }, (_, i) => x + ((1 - x) * (i + 0.5)) / beyond)
		];
		radii.forEach((r, i) => {
			const count = Math.max(3, Math.round(3 + 13 * r));
			for (let j = 0; j < count; j++) {
				// each ring a little turned from the last, so that the arrows do not line up along radii
				const a = (2 * Math.PI * (j + 0.37 * i)) / count;
				list.push({ id: `${i}-${j}`, ...arc(r * L.R, a), inside: r < x });
			}
		});
		return list;
	});

	/** How far the parts have turned, in degrees: the inner ball by +turned, the rest by -turned. */
	let turned = $state(0);
	/** Degrees a second. */
	const RATE = 14;

	/** The parts turning, frame by frame, while `playing` and unless the reader asks for less motion. */
	function spin() {
		if (!playing || prefersReducedMotion.current) return;
		let frame = 0;
		let last = performance.now();
		const tick = (now: number) => {
			turned = (turned + (RATE * (now - last)) / 1000) % 360;
			last = now;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}

	// SVG turns clockwise for a positive angle, with y down the page: counter-clockwise as seen is negative
	const innerTurn = $derived(-sense * turned);
	const outerTurn = $derived(sense * turned);

	// --- the shares of the radii ---------------------------------------------------------------------------------------

	const rx = (r: number) => L.left + (L.right - L.left) * r;

	/** The share of each radius as an area: the inner part and the outer, each from the zero line. */
	function areas(n: number, zero: number) {
		const y = (r: number) => zero - (L.amp * share(n, r, inner, sense)) / greatestShare(n);
		const path = (from: number, to: number) => {
			let d = `M${rx(from).toFixed(1)},${zero}`;
			const STEPS = 60;
			for (let i = 0; i <= STEPS; i++) {
				const r = from + ((to - from) * i) / STEPS;
				// just inside each end, so that the jump at the inner radius is drawn as a vertical edge
				const at = Math.min(to - 1e-9, Math.max(from + 1e-9, r));
				d += `L${rx(r).toFixed(1)},${y(at).toFixed(1)}`;
			}
			return `${d}L${rx(to).toFixed(1)},${zero}Z`;
		};
		return { inside: path(0, Math.min(1, inner)), outside: inner < 1 ? path(inner, 1) : '' };
	}

	const plots = $derived(
		[2, 3].map((n, i) => ({
			n,
			name: n === 2 ? 'degree two' : 'degree three',
			zero: L.zeros[i],
			sum: bracket(n, inner, sense),
			...areas(n, L.zeros[i])
		}))
	);
	const momentum = $derived(angularMomentum(inner, sense));
	/** The axis of r, under the second plot. */
	const base = $derived(L.zeros[1] + L.amp + 6);

	/** A number to three places, with a true minus sign and no negative zero. */
	function fixed(x: number, places = 3): string {
		const digits = Math.abs(x).toFixed(places);
		return x < 0 && Number(digits) !== 0 ? `−${digits}` : digits;
	}
</script>

<div class="frame" {@attach measure} {@attach spin} data-testid="hidden-flow">
	<svg
		viewBox="0 0 {L.W} {L.H}"
		role="img"
		aria-label="A uniform sphere whose inner ball, out to {inner.toFixed(
			3
		)} of its radius, turns one way and the rest the other, and the share of each radius in the bracket of two tides"
		{@attach (node: SVGSVGElement) => {
			// measured again whenever the layout, and so the drawing's box, changes
			void L;
			return fitText()(node);
		}}
	>
		<!-- the sphere, in section through its equator -->
		<g transform="translate({L.cx} {L.cy})">
			<circle class="outer" r={L.R} />
			<circle class="inner" r={Math.min(1, inner) * L.R} />
			<g transform="rotate({innerTurn})">
				{#each arcs as a (a.id)}
					{#if a.inside}
						<path class="path in-ball" d={a.d} transform={sense < 0 ? 'scale(1 -1)' : undefined} />
						<path
							class="head in-ball"
							d={a.head}
							transform={sense < 0 ? 'scale(1 -1)' : undefined}
						/>
					{/if}
				{/each}
			</g>
			<g transform="rotate({outerTurn})">
				{#each arcs as a (a.id)}
					{#if !a.inside}
						<path class="path rest" d={a.d} transform={sense > 0 ? 'scale(1 -1)' : undefined} />
						<path class="head rest" d={a.head} transform={sense > 0 ? 'scale(1 -1)' : undefined} />
					{/if}
				{/each}
			</g>
			<circle class="boundary" r={Math.min(1, inner) * L.R} />
			<circle class="rim" r={L.R} />
			<!-- the axis, seen end on -->
			<circle class="axis-dot" r="3" />
		</g>
		<text class="note" x={L.cx} y={L.cy + L.R + 10} dy="1em"
			><tspan class="in-t">inner ball, to {inner.toFixed(2)} R</tspan> ·
			<tspan class="rest-t">the rest, the other way</tspan></text
		>

		<!-- the share of each radius in the bracket of the two tides of each degree -->
		{#each plots as plot (plot.n)}
			<text class="plot-name" x={L.left} y={plot.zero - L.amp - 8}>{plot.name}</text>
			<path class="area in-ball" d={plot.inside} />
			{#if plot.outside}<path class="area rest" d={plot.outside} />{/if}
			<line class="zero" x1={L.left} x2={L.right} y1={plot.zero} y2={plot.zero} />
			<line
				class="cut"
				x1={rx(Math.min(1, inner))}
				x2={rx(Math.min(1, inner))}
				y1={plot.zero - L.amp}
				y2={plot.zero + L.amp}
			/>
			<text class="sum-name" x={L.right + 14} y={plot.zero - 4}
				>sum, <tspan class="it">MΩR</tspan><tspan class="sup" dy="-0.45em">{2 * plot.n - 2}</tspan
				></text
			>
			<text class="sum" x={L.right + 14} y={plot.zero + 4} dy="0.95em">{fixed(plot.sum)}</text>
		{/each}
		<!-- the axis of r under the second plot -->
		<line class="axis" x1={L.left} x2={L.right} y1={base} y2={base} />
		{#each [0, 1] as r (r)}
			<line class="axis" x1={rx(r)} x2={rx(r)} y1={base} y2={base + 5} />
			<text class="tick" x={rx(r)} y={base + 7} dy="0.85em">{r}</text>
		{/each}
		<line
			class="axis"
			x1={rx(Math.min(1, inner))}
			x2={rx(Math.min(1, inner))}
			y1={base}
			y2={base + 5}
		/>
		<!-- the inner radius, where there is room for it between the ends -->
		{#if inner > 0.12 && inner < 0.9}
			<text class="tick" x={rx(inner)} y={base + 7} dy="0.85em">{inner.toFixed(2)}</text>
		{/if}
		<text class="tick" x={(L.left + L.right) / 2} y={base + 7} dy="2.1em"
			>radius, <tspan class="it">r</tspan>/<tspan class="it">R</tspan></text
		>

		<text class="momentum" x={L.momentumX} y={L.momentumY}
			>angular momentum <tspan class="value">{fixed(momentum)}</tspan>
			<tspan class="it">MΩR</tspan><tspan class="sup" dy="-0.45em">2</tspan></text
		>
	</svg>
</div>

<style>
	/* the stage: the theme's ground and ink, so that the figure is right on either theme */
	.frame {
		position: absolute;
		inset: 0;
		display: flex;
		padding: var(--stage-pad, 1.5rem 1.2rem 1.6rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		color: var(--text);
		--t: 12px;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	text {
		font-family: var(--font-sans);
		font-size: calc(var(--t) * var(--u, 1));
		fill: var(--text-dim);
	}

	.it {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.12em;
	}

	.sup {
		font-size: 0.75em;
	}

	.outer {
		fill: color-mix(in srgb, var(--accent-2) 10%, transparent);
	}

	.inner {
		fill: color-mix(in srgb, var(--accent) 11%, transparent);
	}

	.rim {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: 2;
	}

	.boundary {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-dasharray: 4 4;
	}

	.axis-dot {
		fill: var(--text);
	}

	.path {
		fill: none;
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	.path.in-ball {
		stroke: var(--accent);
	}

	.path.rest {
		stroke: var(--accent-2);
	}

	.head.in-ball {
		fill: var(--accent);
	}

	.head.rest {
		fill: var(--accent-2);
	}

	.note {
		text-anchor: middle;
	}

	.in-t {
		fill: var(--accent);
	}

	.rest-t {
		fill: var(--accent-2);
	}

	.plot-name {
		fill: var(--text);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(1.1 * var(--t) * var(--u, 1));
	}

	.area {
		stroke-width: 1.5;
		stroke-linejoin: round;
	}

	.area.in-ball {
		fill: color-mix(in srgb, var(--accent) 30%, transparent);
		stroke: var(--accent);
	}

	.area.rest {
		fill: color-mix(in srgb, var(--accent-2) 30%, transparent);
		stroke: var(--accent-2);
	}

	.zero,
	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.cut {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-dasharray: 3 3;
	}

	.tick {
		text-anchor: middle;
	}

	.sum-name {
		fill: var(--text-dim);
	}

	.sum {
		fill: var(--text);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		font-size: calc(1.15 * var(--t) * var(--u, 1));
	}

	.momentum {
		fill: var(--text-dim);
	}

	.value {
		fill: var(--text);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
</style>
