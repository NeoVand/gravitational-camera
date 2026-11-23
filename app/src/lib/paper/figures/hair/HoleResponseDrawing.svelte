<script lang="ts">
	/**
	 * A black hole's response (lib/hair/hole.ts): the hole's horizon, and round it the thin shell of its own mass that
	 * has the same weight of response to the tide of each degree, the chosen one bold; beside it those radii against
	 * the degree, and the test that every positive mass passes, int rho r^2 (r^2 - a)^2 dV >= 0, with the hole's sums
	 * for the degrees 2, 3 and 4 put in: it falls below zero. The degree can be chosen on the shells or the chart,
	 * and a moved along its chart.
	 */
	import { fitText } from '../../../ui/figure-text';
	import { DEGREES, HOLE_RADII, SHARP_LIMIT, least, positivity } from '../../../hair/hole';

	interface Props {
		/** the degree of the tide */
		degree: number;
		/** the number a of the test, in units of r_s^2 */
		a: number;
	}

	let { degree = $bindable(), a = $bindable() }: Props = $props();

	// --- the two layouts ---------------------------------------------------------------------------------------------

	interface Layout {
		W: number;
		H: number;
		/** the hole: centre, and r_s as drawn */
		cx: number;
		cy: number;
		rs: number;
		/** the charts: left, right, top, bottom */
		radii: [number, number, number, number];
		test: [number, number, number, number];
	}

	const WIDE: Layout = {
		W: 800,
		H: 460,
		cx: 196,
		cy: 236,
		rs: 92,
		radii: [478, 770, 34, 168],
		test: [478, 770, 264, 404]
	};
	const TALL: Layout = {
		W: 360,
		H: 834,
		cx: 180,
		cy: 200,
		rs: 80,
		radii: [62, 340, 434, 554],
		test: [62, 340, 654, 784]
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

	const radius = $derived(HOLE_RADII[degree]);
	/**
	 * Where the chosen shell's name goes, out past the limit: up and to the right of the centre where the drawing is
	 * wide, straight up where it is tall and the side has no room.
	 */
	const LABEL_ANGLE = $derived(((L === TALL ? -90 : -38) * Math.PI) / 180);

	// --- the radii against the degree ----------------------------------------------------------------------------------

	const R_LOW = 0.85,
		R_HIGH = 2.2;
	const dx = (l: number) => L.radii[0] + ((L.radii[1] - L.radii[0]) * (l - 1.6)) / (8.4 - 1.6);
	const dy = (r: number) =>
		L.radii[3] - ((L.radii[3] - L.radii[2]) * (r - R_LOW)) / (R_HIGH - R_LOW);
	const line = $derived(
		'M' + DEGREES.map((l) => `${dx(l).toFixed(1)},${dy(HOLE_RADII[l]).toFixed(1)}`).join('L')
	);

	// --- the test ------------------------------------------------------------------------------------------------------

	const A_HIGH = 9;
	const P_LOW = -7.5,
		P_HIGH = 13;
	const lowest = least();
	const tx = (v: number) => L.test[0] + ((L.test[1] - L.test[0]) * v) / A_HIGH;
	const ty = (p: number) =>
		L.test[3] -
		((L.test[3] - L.test[2]) * (Math.min(P_HIGH, Math.max(P_LOW, p)) - P_LOW)) / (P_HIGH - P_LOW);
	/** The hole's quadratic, where it is on the chart: a new piece wherever it comes back from above the top. */
	const curve = $derived.by(() => {
		let d = '';
		let on = false;
		for (let i = 0; i <= 240; i++) {
			const v = (A_HIGH * i) / 240;
			const p = positivity(v);
			if (p > P_HIGH) {
				on = false;
				continue;
			}
			d += `${on ? 'L' : 'M'}${tx(v).toFixed(1)},${ty(p).toFixed(1)}`;
			on = true;
		}
		return d;
	});
	const value = $derived(positivity(a));
	/** At the least (to within less than one step of the keys), its own label says it: the value's would repeat it. */
	const atLeast = $derived(Math.abs(a - lowest.a) < 0.03);

	// --- choosing ----------------------------------------------------------------------------------------------------

	let svg: SVGSVGElement | undefined = $state();
	let dragging = $state(false);

	function local(e: PointerEvent): [number, number] {
		const m = svg?.getScreenCTM();
		if (!svg || !m) return [0, 0];
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return [p.x, p.y];
	}

	function follow(e: PointerEvent) {
		if (!dragging) return;
		const [x] = local(e);
		const v = (A_HIGH * (x - L.test[0])) / (L.test[1] - L.test[0]);
		a = Math.round(100 * Math.min(A_HIGH, Math.max(0, v))) / 100;
	}

	function start(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function key(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.5 : 0.05;
		const to =
			e.key === 'ArrowRight' || e.key === 'ArrowUp'
				? a + step
				: e.key === 'ArrowLeft' || e.key === 'ArrowDown'
					? a - step
					: undefined;
		if (to === undefined) return;
		e.preventDefault();
		a = Math.round(100 * Math.min(A_HIGH, Math.max(0, to))) / 100;
	}

	/** A number to so many places, with a true minus sign and no negative zero. */
	function fixed(x: number, places = 2): string {
		const digits = Math.abs(x).toFixed(places);
		return x < 0 && Number(digits) !== 0 ? `−${digits}` : digits;
	}
</script>

<div class="frame" {@attach measure} data-testid="hole-response">
	<svg
		viewBox="0 0 {L.W} {L.H}"
		role="group"
		aria-label="A black hole's horizon and the shell of its mass with the same response to the tide of degree {degree}, the radii for each degree, and a test of positive mass that the hole fails"
		{@attach (node: SVGSVGElement) => {
			// measured again whenever the layout, and so the drawing's box, changes
			void L;
			svg = node;
			return fitText()(node);
		}}
	>
		<!-- the hole and its shells -->
		<g transform="translate({L.cx} {L.cy})">
			<circle class="limit" r={SHARP_LIMIT * L.rs} />
			<circle class="horizon" r={L.rs} />
			{#each DEGREES as l (l)}
				<circle
					class={['ring', l === degree && 'chosen']}
					r={HOLE_RADII[l] * L.rs}
					role="button"
					tabindex="-1"
					aria-label="Degree {l}"
					onpointerdown={() => (degree = l)}
				/>
			{/each}
			<text class="hole-name" y="-0.2em">the horizon</text>
			<text class="hole-name small" dy="1.1em"
				><tspan class="it">r</tspan><tspan class="sub" dy="0.3em">s</tspan></text
			>
			<!-- the chosen shell's name, out along a radius past the limit -->
			<line
				class="leader"
				x1={radius * L.rs * Math.cos(LABEL_ANGLE)}
				y1={radius * L.rs * Math.sin(LABEL_ANGLE)}
				x2={(SHARP_LIMIT * L.rs + 16) * Math.cos(LABEL_ANGLE)}
				y2={(SHARP_LIMIT * L.rs + 16) * Math.sin(LABEL_ANGLE)}
			/>
			<circle
				class="dot"
				cx={radius * L.rs * Math.cos(LABEL_ANGLE)}
				cy={radius * L.rs * Math.sin(LABEL_ANGLE)}
				r="3.5"
			/>
			<text
				class="shell-name"
				data-anchor={L === TALL ? 'middle' : 'start'}
				x={(SHARP_LIMIT * L.rs + 20) * Math.cos(LABEL_ANGLE)}
				y={(SHARP_LIMIT * L.rs + 20) * Math.sin(LABEL_ANGLE)}
				dy={L === TALL ? '-0.2em' : '0.3em'}
				><tspan class="it">ℓ</tspan> = {degree}: {radius.toFixed(2)}
				<tspan class="it">r</tspan><tspan class="sub" dy="0.3em">s</tspan></text
			>
			<text class="limit-name" y={SHARP_LIMIT * L.rs + 8} dy="0.9em"
				>the limit, {SHARP_LIMIT.toFixed(2)} <tspan class="it">r</tspan><tspan
					class="sub"
					dy="0.3em">s</tspan
				></text
			>
		</g>

		<!-- the radii, degree by degree -->
		<g>
			<text class="chart-name" x={L.radii[0]} y={L.radii[2] - 12}
				>radius of the shell, in <tspan class="it">r</tspan><tspan class="sub" dy="0.3em">s</tspan
				></text
			>
			<path class="axis" d="M{L.radii[0]},{L.radii[2]}V{L.radii[3]}H{L.radii[1]}" fill="none" />
			{#each [1, 1.5] as r (r)}
				<line class="axis" x1={L.radii[0] - 5} x2={L.radii[0]} y1={dy(r)} y2={dy(r)} />
				<text class="tick" data-anchor="end" x={L.radii[0] - 8} y={dy(r)} dy="0.35em">{r}</text>
			{/each}
			<line class="level" x1={L.radii[0]} x2={L.radii[1]} y1={dy(1)} y2={dy(1)} />
			<text class="level-name" data-anchor="end" x={L.radii[1]} y={dy(1)} dy="-0.45em"
				>the horizon</text
			>
			<line
				class="level dashed"
				x1={L.radii[0]}
				x2={L.radii[1]}
				y1={dy(SHARP_LIMIT)}
				y2={dy(SHARP_LIMIT)}
			/>
			<text class="level-name" x={L.radii[0] + 6} y={dy(SHARP_LIMIT)} dy="-0.45em"
				>the limit, 3√3/<tspan class="it">e</tspan></text
			>
			<path class="radii" d={line} />
			{#each DEGREES as l (l)}
				<line class="axis" x1={dx(l)} x2={dx(l)} y1={L.radii[3]} y2={L.radii[3] + 5} />
				<text class="tick" x={dx(l)} y={L.radii[3] + 7} dy="0.85em">{l}</text>
				<circle
					class={['point', l === degree && 'chosen']}
					cx={dx(l)}
					cy={dy(HOLE_RADII[l])}
					r={l === degree ? 5.5 : 3.8}
				/>
				<!-- a wide target round each point -->
				<rect
					class="pick"
					x={dx(l) - 18}
					y={L.radii[2]}
					width="36"
					height={L.radii[3] - L.radii[2]}
					role="button"
					tabindex="-1"
					aria-label="Degree {l}"
					onpointerdown={() => (degree = l)}
				/>
			{/each}
			<text class="tick" x={(L.radii[0] + L.radii[1]) / 2} y={L.radii[3] + 7} dy="2.1em"
				>degree of the tide, <tspan class="it">ℓ</tspan></text
			>
		</g>

		<!-- the test of positive mass -->
		<g>
			<text class="chart-name" x={L.test[0]} y={L.test[2] - 12}
				>∫<tspan class="it">ρr</tspan>²(<tspan class="it">r</tspan>² − <tspan class="it">a</tspan>)²
				d<tspan class="it">V</tspan> from the hole’s sums, in <tspan class="it">Mr</tspan><tspan
					class="sub"
					dy="0.3em">s</tspan
				><tspan dy="-0.3em">⁶</tspan></text
			>
			<rect
				class="forbidden"
				x={L.test[0]}
				y={ty(0)}
				width={L.test[1] - L.test[0]}
				height={L.test[3] - ty(0)}
			/>
			<text class="forbidden-name" x={L.test[0] + 6} y={L.test[3] - 6}>no positive mass</text>
			<path class="axis" d="M{L.test[0]},{L.test[2]}V{L.test[3]}" fill="none" />
			<line class="level" x1={L.test[0]} x2={L.test[1]} y1={ty(0)} y2={ty(0)} />
			{#each [-5, 0, 5, 10] as p (p)}
				<line class="axis" x1={L.test[0] - 5} x2={L.test[0]} y1={ty(p)} y2={ty(p)} />
				<text class="tick" data-anchor="end" x={L.test[0] - 8} y={ty(p)} dy="0.35em">{p}</text>
			{/each}
			<line class="axis" x1={L.test[0]} x2={L.test[1]} y1={L.test[3]} y2={L.test[3]} />
			{#each [0, 2, 4, 6, 8] as v (v)}
				<line class="axis" x1={tx(v)} x2={tx(v)} y1={L.test[3]} y2={L.test[3] + 5} />
				<text class="tick" x={tx(v)} y={L.test[3] + 7} dy="0.85em">{v}</text>
			{/each}
			<text class="tick" x={(L.test[0] + L.test[1]) / 2} y={L.test[3] + 7} dy="2.1em"
				><tspan class="it">a</tspan>, in <tspan class="it">r</tspan><tspan class="sub" dy="0.3em"
					>s</tspan
				><tspan class="sup" dy="-0.75em">2</tspan></text
			>
			<path class="test" d={curve} />
			<!-- the least value -->
			<circle class="least" cx={tx(lowest.a)} cy={ty(lowest.value)} r="4" />
			<text class="least-name" x={tx(lowest.a) + 9} y={ty(lowest.value)} dy="1.25em"
				>least: {fixed(lowest.value)} at {lowest.a.toFixed(2)}</text
			>
			<!-- the a chosen: drag along the chart -->
			<rect
				class="track"
				role="presentation"
				x={L.test[0]}
				y={L.test[2]}
				width={L.test[1] - L.test[0]}
				height={L.test[3] - L.test[2]}
				onpointerdown={start}
				onpointermove={follow}
				onpointerup={() => (dragging = false)}
				onpointercancel={() => (dragging = false)}
			/>
			<line class="now" x1={tx(a)} x2={tx(a)} y1={L.test[2]} y2={L.test[3]} />
			<g
				class="handle"
				transform="translate({tx(a)} {ty(value)})"
				role="slider"
				tabindex="0"
				aria-label="The number a of the test"
				aria-valuemin={0}
				aria-valuemax={A_HIGH}
				aria-valuenow={a}
				aria-valuetext="a = {a.toFixed(2)}, value {fixed(value)}"
				onkeydown={key}
			>
				<circle class="halo" r="11" />
				<circle class="mark" r="5" />
			</g>
			{#if !atLeast}
				<text
					class={['now-name', value < 0 && 'below']}
					data-anchor={tx(a) > (L.test[0] + L.test[1]) / 2 ? 'end' : 'start'}
					x={tx(a) + (tx(a) > (L.test[0] + L.test[1]) / 2 ? -9 : 9)}
					y={L.test[2]}
					dy="0.9em">{fixed(value)} at {a.toFixed(2)}</text
				>
			{/if}
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
		--t: 12px;
		/* the horizon: the darkest of the theme, the ground's deepest on the dark side, the ink on the light */
		--hole: var(--bg-sunken);
		--hole-ink: var(--text-dim);
	}
	:global(:root[data-theme='light']) .frame {
		--hole: var(--text);
		--hole-ink: var(--bg);
	}
	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .frame {
			--hole: var(--text);
			--hole-ink: var(--bg);
		}
	}
	:global(:root .always-dark) .frame {
		--hole: var(--bg-sunken);
		--hole-ink: var(--text-dim);
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

	.sup,
	.sub {
		font-size: 0.72em;
	}

	.tick {
		text-anchor: middle;
	}

	[data-anchor='start'] {
		text-anchor: start;
	}

	[data-anchor='middle'] {
		text-anchor: middle;
	}

	[data-anchor='end'] {
		text-anchor: end;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the hole and its shells --- */

	.limit {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-dasharray: 3 5;
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 30%, transparent);
		stroke-width: 1.2;
		cursor: pointer;
		pointer-events: stroke;
	}

	.ring.chosen {
		stroke: var(--accent);
		stroke-width: 3.2;
	}

	.horizon {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: 1.2;
	}

	.hole-name {
		text-anchor: middle;
		fill: var(--hole-ink);
	}

	.leader {
		stroke: color-mix(in srgb, var(--accent) 70%, transparent);
		stroke-width: 1;
	}

	.dot {
		fill: var(--accent);
	}

	.shell-name {
		fill: var(--accent);
		font-weight: 600;
	}

	.limit-name {
		text-anchor: middle;
	}

	/* --- the charts --- */

	.chart-name {
		fill: var(--text-dim);
	}

	.level {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
	}

	.level.dashed {
		stroke-dasharray: 3 4;
	}

	.level-name {
		fill: var(--text-faint);
	}

	.radii {
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.8;
		stroke-linejoin: round;
	}

	.point {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
	}

	.point.chosen {
		fill: var(--text);
		stroke: var(--accent);
		stroke-width: 2.5;
	}

	.pick {
		fill: transparent;
		cursor: pointer;
	}

	.forbidden {
		fill: color-mix(in srgb, var(--bad) 12%, transparent);
	}

	.forbidden-name {
		fill: var(--bad);
	}

	.test {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.2;
	}

	.least {
		fill: var(--bad);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
		pointer-events: none;
	}

	.least-name {
		fill: var(--bad);
		font-weight: 600;
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.track {
		fill: transparent;
		cursor: ew-resize;
	}

	.now {
		stroke: var(--text-dim);
		stroke-dasharray: 3 3;
		pointer-events: none;
	}

	.handle {
		outline: none;
		pointer-events: none;
	}

	.halo {
		fill: transparent;
	}

	.handle:focus-visible .halo {
		stroke: var(--accent);
		stroke-width: 1.5;
	}

	.mark {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
	}

	.now-name {
		fill: var(--text);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.now-name.below {
		fill: var(--bad);
	}
</style>
