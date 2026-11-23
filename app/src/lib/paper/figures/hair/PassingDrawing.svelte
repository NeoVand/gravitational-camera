<script lang="ts">
	/**
	 * A mass that passes (lib/hair/passing.ts): two round bodies with the same field outside, seen along the straight
	 * path of a mass that flies past them, which crosses the page at the bead, a distance b from their centres. On
	 * each shell, arrows: the velocity that parts of it receive from the pass, less that of the body as a whole,
	 * orange where it points away from the centre and blue where toward it. Beside them the energy left inside each
	 * body, and that energy against b for both. The bead, or anywhere along its track or the chart, can be dragged.
	 */
	import { fitText } from '../../../ui/figure-text';
	import {
		FARTHEST,
		NEAREST,
		TWINS,
		internalF,
		relativeKick,
		type Point
	} from '../../../hair/passing';
	import type { Body } from '../../../hair/ladder';

	interface Props {
		/** the distance of the pass from the centres, in units of R */
		b: number;
	}

	let { b = $bindable() }: Props = $props();

	// --- the two layouts: side by side where the frame is wide, one above the other where it is tall ------------------

	interface Layout {
		W: number;
		H: number;
		/** the bodies' centre across, the centres of their rows, and R as drawn */
		cx: number;
		rows: [number, number];
		R: number;
		/** the axis of b under the bodies */
		axisY: number;
		/** the bars: left end, the rows of A and B, and their greatest length */
		barX: number;
		barY: [number, number];
		barW: number;
		/** the chart's plot: left, right, top, bottom */
		plot: [number, number, number, number];
	}

	const WIDE: Layout = {
		W: 800,
		H: 486,
		cx: 78,
		rows: [124, 318],
		R: 66,
		axisY: 420,
		barX: 466,
		barY: [70, 116],
		barW: 314,
		plot: [516, 780, 206, 418]
	};
	const TALL: Layout = {
		W: 360,
		H: 790,
		cx: 64,
		rows: [96, 268],
		R: 58,
		axisY: 362,
		barX: 18,
		barY: [470, 516],
		barW: 324,
		plot: [64, 344, 590, 742]
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

	// --- the bodies and their kicks ---------------------------------------------------------------------------------

	/** Places round each shell where an arrow is drawn. */
	const PLACES = 16;
	/** The length of an arrow for a kick of C / R, in units of R, before it is eased toward its greatest length. */
	const REACH = 1.1;
	const LONGEST = 1.05;

	interface Arrow {
		id: string;
		d: string;
		head: string;
		outward: boolean;
	}

	/** The arrows of one body, in the drawing's units about its centre (y down the page). */
	function arrows(body: Body, pass: number, R: number): Arrow[] {
		const at: Point = [pass, 0];
		return body.shells.flatMap((shell, k) => {
			if (shell.radius === 0) return [];
			return Array.from({ length: PLACES }, (_, j) => {
				const t = (2 * Math.PI * j) / PLACES;
				const s: Point = [shell.radius * Math.cos(t), shell.radius * Math.sin(t)];
				const [vx, vy] = relativeKick(s, at);
				const size = Math.hypot(vx, vy);
				// eased: in proportion for small kicks, never longer than LONGEST R
				const length = R * LONGEST * (1 - Math.exp((-REACH * size) / LONGEST));
				const [ux, uy] = [vx / size, vy / size];
				const [x0, y0] = [R * s[0] - (ux * length) / 2, -(R * s[1] - (uy * length) / 2)];
				const [x1, y1] = [R * s[0] + (ux * length) / 2, -(R * s[1] + (uy * length) / 2)];
				const head = Math.min(7.5, 0.5 * length);
				const spread = 0.5 * head;
				// the head: back from the tip along the arrow, and out to each side
				const bx = x1 - ux * head,
					by = y1 + uy * head;
				const px = -uy * spread,
					py = -ux * spread;
				return {
					id: `${k}-${j}`,
					d: `M${x0.toFixed(1)},${y0.toFixed(1)}L${bx.toFixed(1)},${by.toFixed(1)}`,
					head: `M${x1.toFixed(1)},${y1.toFixed(1)}L${(bx + px).toFixed(1)},${(by + py).toFixed(1)}L${(bx - px).toFixed(1)},${(by - py).toFixed(1)}Z`,
					outward: s[0] * vx + s[1] * vy > 0
				};
			});
		});
	}

	const bodies = $derived(
		[
			{ key: 'A', body: TWINS.a, name: 'a shell of radius R/√2' },
			{ key: 'B', body: TWINS.b, name: 'half at the centre, half on a shell of radius R' }
		].map((side, i) => ({
			...side,
			cy: L.rows[i],
			energy: internalF(side.body, b),
			rings: side.body.shells.filter((s) => s.radius > 0).map((s) => s.radius * L.R),
			point: side.body.shells.some((s) => s.radius === 0),
			arrows: arrows(side.body, b, L.R)
		}))
	);
	const [ea, eb] = $derived(bodies.map((side) => side.energy));
	const larger = $derived(Math.max(ea, eb));
	const beadX = $derived(L.cx + b * L.R);

	// --- the chart: the energy left against b, on logarithmic axes ---------------------------------------------------------

	const B_LOW = 1,
		B_HIGH = FARTHEST;
	const E_LOW = 1e-3,
		E_HIGH = 2;
	const px = (v: number) =>
		L.plot[0] + ((L.plot[1] - L.plot[0]) * Math.log(v / B_LOW)) / Math.log(B_HIGH / B_LOW);
	const py = (e: number) =>
		L.plot[3] -
		((L.plot[3] - L.plot[2]) * Math.log(Math.min(E_HIGH, Math.max(E_LOW, e)) / E_LOW)) /
			Math.log(E_HIGH / E_LOW);

	const curves = $derived(
		[TWINS.a, TWINS.b].map((body) => {
			let d = '';
			for (let i = 0; i <= 160; i++) {
				const v = NEAREST * (B_HIGH / NEAREST) ** (i / 160);
				const e = internalF(body, v);
				if (e > E_HIGH) continue;
				d += `${d ? 'L' : 'M'}${px(v).toFixed(1)},${py(e).toFixed(1)}`;
			}
			return d;
		})
	);

	// --- dragging -----------------------------------------------------------------------------------------------------

	let svg: SVGSVGElement | undefined = $state();
	let dragging: 'track' | 'chart' | undefined = $state();

	const clamp = (v: number) => Math.min(FARTHEST, Math.max(NEAREST, v));

	/** The point of the drawing under the pointer. */
	function local(e: PointerEvent): [number, number] {
		const m = svg?.getScreenCTM();
		if (!svg || !m) return [0, 0];
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return [p.x, p.y];
	}

	function follow(e: PointerEvent) {
		if (!dragging) return;
		const [x] = local(e);
		b = clamp(
			dragging === 'track'
				? (x - L.cx) / L.R
				: B_LOW * (B_HIGH / B_LOW) ** ((x - L.plot[0]) / (L.plot[1] - L.plot[0]))
		);
	}

	function start(where: 'track' | 'chart', e: PointerEvent) {
		dragging = where;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function key(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.25 : 0.05;
		const to =
			e.key === 'ArrowRight' || e.key === 'ArrowUp'
				? b + step
				: e.key === 'ArrowLeft' || e.key === 'ArrowDown'
					? b - step
					: e.key === 'Home'
						? NEAREST
						: e.key === 'End'
							? FARTHEST
							: undefined;
		if (to === undefined) return;
		e.preventDefault();
		b = clamp(Math.round(to * 100) / 100);
	}

	const fixed = (x: number, places = 3) => x.toFixed(places);
	const more = $derived(Math.round(100 * (eb / ea - 1)));
</script>

{#snippet bead()}
	<circle class="halo" r="15" />
	<circle class="ball" r="6.5" />
	<circle class="dot" r="1.6" />
	<text class="b-label" y="11" dy="0.9em"><tspan class="it">b</tspan></text>
{/snippet}

<div class="frame" {@attach measure} data-testid="passing">
	<svg
		viewBox="0 0 {L.W} {L.H}"
		role="group"
		aria-label="Two bodies with the same field outside, a mass passing them at {b.toFixed(
			2
		)} R, and the energy it leaves in each"
		{@attach (node: SVGSVGElement) => {
			// measured again whenever the layout, and so the drawing's box, changes
			void L;
			svg = node;
			return fitText()(node);
		}}
	>
		<!-- the track of the bead: press anywhere on it to move the pass -->
		<rect
			class="track"
			role="presentation"
			class:dragging={dragging === 'track'}
			x={L.cx + 0.5 * L.R}
			y={L.rows[0] - 1.25 * L.R}
			width={(FARTHEST - 0.5) * L.R + 14}
			height={L.axisY - L.rows[0] + 1.25 * L.R + 8}
			onpointerdown={(e) => start('track', e)}
			onpointermove={follow}
			onpointerup={() => (dragging = undefined)}
			onpointercancel={() => (dragging = undefined)}
		/>

		<!-- the line on which the bead lies in both views, and the axis of b under them -->
		<line class="guide" x1={beadX} x2={beadX} y1={L.rows[0] - L.R} y2={L.axisY} />
		<line class="axis" x1={L.cx} x2={L.cx + FARTHEST * L.R} y1={L.axisY} y2={L.axisY} />
		{#each [0, 1, 2, 3, 4] as t (t)}
			<line class="axis" x1={L.cx + t * L.R} x2={L.cx + t * L.R} y1={L.axisY} y2={L.axisY + 5} />
			<text class="tick" x={L.cx + t * L.R} y={L.axisY + 7} dy="0.85em">{t}</text>
		{/each}
		<text class="legend" x={L.cx - L.R} y={L.axisY + 7} dy="2.6em"
			>Arrows: the kicks, less the whole body’s: <tspan class="out-t">outward</tspan>,
			<tspan class="in-t">inward</tspan></text
		>
		<text
			class="tick dim"
			x={L.cx + FARTHEST * L.R + 10}
			y={L.axisY}
			dy="0.35em"
			data-anchor="start"><tspan class="it">b</tspan>/<tspan class="it">R</tspan></text
		>

		{#each bodies as side (side.key)}
			<g transform="translate({L.cx} {side.cy})">
				<text class="caption" x={-L.R} y={-L.R - 12}
					><tspan class="letter">{side.key}</tspan><tspan dx="0.5em">{side.name}</tspan></text
				>
				{#if side.key === 'A'}
					<circle class="outline" r={L.R} />
				{/if}
				{#each side.rings as r, i (i)}
					<circle class="shell" {r} />
				{/each}
				{#if side.point}
					<circle class="core" r={L.R * 0.11} />
				{/if}
				{#each side.arrows as arrow (arrow.id)}
					<g class={arrow.outward ? 'out' : 'in'}>
						<path class="shaft" d={arrow.d} />
						<path class="head" d={arrow.head} />
					</g>
				{/each}
			</g>
			<!-- where the path crosses the page: a bead coming toward the reader. The first is the slider for the
			     keyboard; presses on either fall through to the track. -->
			{#if side.key === 'A'}
				<g
					class="bead"
					transform="translate({beadX} {side.cy})"
					role="slider"
					tabindex="0"
					aria-label="Distance of the pass from the centres"
					aria-valuemin={NEAREST}
					aria-valuemax={FARTHEST}
					aria-valuenow={b}
					aria-valuetext="{b.toFixed(2)} R"
					onkeydown={key}
				>
					{@render bead()}
				</g>
			{:else}
				<g class="bead" transform="translate({beadX} {side.cy})" aria-hidden="true">
					{@render bead()}
				</g>
			{/if}
		{/each}

		<!-- the energy left in each: bars to the larger of the two -->
		<text class="title" x={L.barX} y={L.barY[0] - 26}
			>Energy left inside, in units of <tspan class="it">MC</tspan><tspan class="sup" dy="-0.45em"
				>2</tspan
			><tspan dy="0.45em">/2</tspan><tspan class="it">R</tspan><tspan class="sup" dy="-0.45em"
				>2</tspan
			></text
		>
		{#each bodies as side, i (side.key)}
			{@const y = L.barY[i]}
			<text class="bar-letter" x={L.barX} {y} dy="0.35em">{side.key}</text>
			<rect class="bar-ground" x={L.barX + 18} y={y - 8} width={L.barW - 80} height="16" rx="3" />
			<rect
				class={['bar', side.key === 'B' && 'second']}
				x={L.barX + 18}
				y={y - 8}
				width={Math.max(1, ((L.barW - 80) * side.energy) / larger)}
				height="16"
				rx="3"
			/>
			<text class="value" x={L.barX + L.barW} {y} dy="0.35em" data-anchor="end"
				>{fixed(side.energy, side.energy < 0.01 ? 5 : 3)}</text
			>
		{/each}
		<text class="note" x={L.barX + 18} y={L.barY[1] + 30}
			>{more >= 0
				? `B is left with ${more}% more than A`
				: `B is left with ${-more}% less than A`}</text
		>

		<!-- the chart -->
		<g class="chart">
			<rect
				class="track"
				role="presentation"
				class:dragging={dragging === 'chart'}
				x={L.plot[0]}
				y={L.plot[2]}
				width={L.plot[1] - L.plot[0]}
				height={L.plot[3] - L.plot[2]}
				onpointerdown={(e) => start('chart', e)}
				onpointermove={follow}
				onpointerup={() => (dragging = undefined)}
				onpointercancel={() => (dragging = undefined)}
			/>
			<path class="axis" d="M{L.plot[0]},{L.plot[2]}V{L.plot[3]}H{L.plot[1]}" fill="none" />
			{#each [1, 1.5, 2, 3, 4] as v (v)}
				<line class="axis" x1={px(v)} x2={px(v)} y1={L.plot[3]} y2={L.plot[3] + 5} />
				<text class="tick" x={px(v)} y={L.plot[3] + 7} dy="0.85em">{v}</text>
			{/each}
			<text class="tick dim" x={(L.plot[0] + L.plot[1]) / 2} y={L.plot[3] + 7} dy="2.1em"
				>distance of the pass, <tspan class="it">b</tspan>/<tspan class="it">R</tspan></text
			>
			{#each [0.001, 0.01, 0.1, 1] as e (e)}
				<line class="axis" x1={L.plot[0] - 5} x2={L.plot[0]} y1={py(e)} y2={py(e)} />
				<text class="tick" x={L.plot[0] - 8} y={py(e)} dy="0.35em" data-anchor="end">{e}</text>
			{/each}
			<text class="tick dim" x={L.plot[0]} y={L.plot[2] - 12} data-anchor="start"
				>energy left inside</text
			>
			<path class="curve a" d={curves[0]} />
			<path class="curve b" d={curves[1]} />
			<line class="now" x1={px(b)} x2={px(b)} y1={L.plot[2]} y2={L.plot[3]} />
			<circle class="mark" cx={px(b)} cy={py(ea)} r="3.8" />
			<circle class="mark" cx={px(b)} cy={py(eb)} r="3.8" />
			<text class="curve-label" x={px(1.2)} y={py(internalF(TWINS.b, 1.2))} dx="0.6em" dy="-0.2em"
				>B, half at the centre</text
			>
			<text
				class="curve-label"
				x={px(2.2)}
				y={py(internalF(TWINS.a, 2.2))}
				dx="-0.2em"
				dy="1.5em"
				data-anchor="end">A, shell at R/√2</text
			>
		</g>
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
		/* the size of the words on the screen, as on every figure */
		--t: 12px;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
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

	.track {
		fill: transparent;
		cursor: ew-resize;
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-dasharray: 2 4;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.tick {
		text-anchor: middle;
	}

	[data-anchor='start'] {
		text-anchor: start;
	}

	[data-anchor='end'] {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-dim);
	}

	.caption {
		fill: var(--text-dim);
	}

	.letter {
		fill: var(--text);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.45em;
	}

	/* the radius R, round the smaller shell: the two bodies drawn to one scale */
	.outline {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-dasharray: 2 4;
	}

	.shell {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: 2.2;
	}

	.core {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 1;
	}

	.shaft {
		fill: none;
		stroke-width: 1.7;
		stroke-linecap: round;
	}

	.out .shaft {
		stroke: var(--accent);
	}

	.in .shaft {
		stroke: var(--accent-2);
	}

	.out .head {
		fill: var(--accent);
	}

	.in .head {
		fill: var(--accent-2);
	}

	.bead {
		outline: none;
		pointer-events: none;
	}

	.halo {
		fill: transparent;
		stroke: transparent;
	}

	.bead:focus-visible .halo {
		stroke: var(--accent);
		stroke-width: 1.5;
	}

	.ball {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
	}

	.dot {
		fill: var(--bg-sunken);
	}

	.b-label {
		text-anchor: middle;
		fill: var(--text);
	}

	.legend {
		fill: var(--text-dim);
	}

	.out-t {
		fill: var(--accent);
	}

	.in-t {
		fill: var(--accent-2);
	}

	.title {
		fill: var(--text-dim);
	}

	.bar-letter {
		fill: var(--text);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(1.3 * var(--t) * var(--u, 1));
	}

	.bar-ground {
		fill: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.bar {
		fill: color-mix(in srgb, var(--accent) 55%, transparent);
		transition: width 0.12s;
	}

	.bar.second {
		fill: var(--accent);
	}

	.value {
		fill: var(--text);
		font-variant-numeric: tabular-nums;
		font-weight: 500;
	}

	.note {
		fill: var(--text-dim);
	}

	.curve {
		fill: none;
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.curve.a {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-dasharray: 6 4;
	}

	.curve.b {
		stroke: var(--text);
	}

	.curve-label {
		fill: var(--text-dim);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.now {
		stroke: var(--accent);
		stroke-width: 1.2;
		stroke-dasharray: 3 3;
		pointer-events: none;
	}

	.mark {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
		pointer-events: none;
	}
</style>
