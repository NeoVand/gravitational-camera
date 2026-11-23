<script module lang="ts">
	/** An angle in degrees to four places, with a true minus sign and no negative zero. */
	export function degrees(radians: number): string {
		const text = ((radians * 180) / Math.PI).toFixed(4);
		return (Number(text) === 0 ? '0.0000' : text.replace('-', '−')) + '°';
	}
</script>

<script lang="ts">
	/**
	 * A ring of free particles as an exact gravitational plane wave passes (lib/ring/ring.ts). The ring, with one
	 * particle marked and the rest shaded in order, round a gyroscope whose axes are fixed in the coordinates used;
	 * the angle by which the marks have turned against it. Under the ring, the wave against time, with the present
	 * moment, which can be dragged. Beside it, the wave's strain in its own plane, and the ring's shape as a point of
	 * the hyperbolic plane (the Poincaré disc) with the area swept from the centre, half of which is the turn.
	 *
	 * If the ring comes to its focus in view, the drawing is held there: the particles in a row, the turn and the area
	 * as they are at the focus, the shape at the edge of the disc.
	 */
	import {
		STEPS,
		atFocus,
		indexAt,
		integrate,
		polarAlong,
		profile,
		type Mat2,
		type Wave
	} from '../ring/ring';

	interface Props {
		wave: Wave;
		/** the present moment, in units of the wave's duration: 0 as it arrives, 1 when it has passed */
		u: number;
		/** how far the view runs, in the same units */
		end?: number;
		/** the turning is drawn this many times its size; the numbers are not changed */
		magnify?: number;
		/** a moment chosen on the strip under the ring */
		onscrub?: (u: number) => void;
	}

	let { wave, u, end = 1.6, magnify = 1, onscrub }: Props = $props();

	const TAU = 2 * Math.PI;
	const N = 16; // particles
	const TOP = Math.PI / 2; // where the marked particle begins, and the gyroscope's marked arm points
	const R = 134; // the ring's first radius, in drawing units; a strong wave draws it out to 1.26 of that
	const ARC = 190; // the radius at which the angle is drawn, clear of the ring at its longest; its arm runs 10 further
	const PLOT = 80; // the radius of each small panel
	const STRIDE = 4; // every fourth sample of the run is drawn in the panels
	const ROOM = 1.18; // the disc panel shows this much further out than the shape has been
	const STRIP = { left: -195, right: 195, base: 31, height: 17 };
	/** The word "gyroscope" as a box in drawing units, with room round it for a particle to pass. */
	const WORD = { left: 2, right: 82, top: 4, bottom: 36 };

	const T = $derived(wave.T ?? 1);
	const run = $derived(integrate(wave, end * T, STEPS));
	const parts = $derived(polarAlong(run));
	/** The ring at its focus, if it comes to one in view after the wave. */
	const focus = $derived(atFocus(run, parts));
	/** The present moment, kept within the view. */
	const now = $derived(Math.max(0, Math.min(end, u)));
	const i = $derived(indexAt(run, now * T));
	/** The present sample or, past a focus, the last at which the ring still has a radius, a turn and a shape. */
	const shaped = $derived(Math.min(i, parts.count - 1));
	/** Whether the ring has come to its focus: from then on the drawing is held as it is there. */
	const ended = $derived(focus ? now * T >= focus.u : i >= parts.count);
	const theta = $derived(ended && focus ? focus.theta : parts.theta[shaped]);
	const swept = $derived(ended && focus ? focus.swept : parts.swept[shaped]);
	/** The way the marks turn in the end, which decides the side the angle is written on. */
	const sense = $derived(parts.theta[Math.min(run.end, parts.count - 1)] < 0 ? -1 : 1);

	// --- the ring ---------------------------------------------------------------------------------------------------

	/** The turn as it is drawn: magnified if that is asked, and kept short of a whole turn. */
	const turn = $derived(Math.max(0.05 - TAU, Math.min(TAU - 0.05, magnify * theta)));
	/** The direction R(theta) of the turned marks, as drawn. */
	const turned = $derived(TOP + turn);
	/** The matrix that takes each particle's first place to where it is drawn: X, turned by the rest of a magnified turn. */
	const drawn = $derived.by((): Mat2 => {
		const [x11, x12, x21, x22] = ended && focus ? focus.X : run.X[shaped];
		const c = Math.cos(turn - theta);
		const s = Math.sin(turn - theta);
		return [c * x11 - s * x21, c * x12 - s * x22, s * x11 + c * x21, s * x12 + c * x22];
	});

	/** Where the particle that began at the angle phi is drawn now. */
	function place(phi: number): [number, number] {
		const [m11, m12, m21, m22] = drawn;
		const c = Math.cos(phi);
		const s = Math.sin(phi);
		return [R * (m11 * c + m12 * s), -R * (m21 * c + m22 * s)];
	}

	const dots = $derived(
		Array.from({ length: N }, (_, k) => {
			const [x, y] = place(TOP + (TAU * k) / N);
			// shaded in order round the ring, so that a turn shows
			return { k, x, y, shade: 0.95 - (0.6 * (k - 1)) / (N - 2) };
		})
	);
	const outline = $derived(
		Array.from({ length: 72 }, (_, k) => {
			const [x, y] = place((TAU * k) / 72);
			return `${k ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`;
		}).join('') + 'Z'
	);
	const arc = $derived.by(() => {
		const x = ARC * Math.cos(turned);
		const y = -ARC * Math.sin(turned);
		return `M0,${-ARC}A${ARC},${ARC} 0 ${Math.abs(turn) > Math.PI ? 1 : 0} ${turn > 0 ? 0 : 1} ${x.toFixed(2)},${y.toFixed(2)}`;
	});

	/**
	 * Whether the word "gyroscope" is clear of the ring: each corner of its box, carried back by the drawn matrix to
	 * where it lay at first, is inside the first circle. As the ring closes on the word, the word is put away.
	 */
	const worded = $derived.by(() => {
		const [m11, m12, m21, m22] = drawn;
		const d = m11 * m22 - m12 * m21;
		if (ended || !(d > 1e-9)) return false;
		return [WORD.left, WORD.right].every((x) =>
			[WORD.top, WORD.bottom].every((y) => {
				const qx = (m22 * x + m12 * y) / (d * R);
				const qy = (-m21 * x - m11 * y) / (d * R);
				return qx * qx + qy * qy < 1;
			})
		);
	});

	// --- the wave against time ---------------------------------------------------------------------------------------

	const stripX = (v: number) => STRIP.left + ((STRIP.right - STRIP.left) * v) / end;
	const traces = $derived.by(() => {
		const plus: string[] = [];
		const cross: string[] = [];
		for (let j = 0; j <= 240; j++) {
			const v = j / 240;
			const { a, b } = profile(v * T, wave);
			const x = stripX(v).toFixed(2);
			plus.push(`${x},${(STRIP.base - STRIP.height * a).toFixed(2)}`);
			cross.push(`${x},${(STRIP.base - STRIP.height * b).toFixed(2)}`);
		}
		return { plus: 'M' + plus.join('L'), cross: 'M' + cross.join('L') };
	});
	/** Where the run ends on the strip: at the focus, if the ring comes to one in view. */
	const finish = $derived(focus ? stripX(focus.u / T) : STRIP.right);

	let dragging = false;
	function scrub(e: PointerEvent) {
		const m = (e.currentTarget as SVGSVGElement).getScreenCTM();
		if (!m || !onscrub) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const v = ((p.x - STRIP.left) / (STRIP.right - STRIP.left)) * end;
		onscrub(Math.max(0, Math.min(end, v)));
	}
	function down(e: PointerEvent) {
		if (!onscrub) return;
		// a drag is not a click: nothing under it takes the focus, and no text is selected
		e.preventDefault();
		dragging = true;
		scrub(e);
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (dragging) scrub(e);
	}

	// --- the strain in its plane -------------------------------------------------------------------------------------

	const point = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
	/** The path of (a, b) through the wave, at every STRIDE-th sample: the strain is 2 epsilon times it. */
	const strain = $derived.by(() => {
		const points: string[] = [];
		for (let j = 0; j <= STEPS; j += STRIDE) {
			const { a, b } = profile(j * run.h, wave);
			points.push(point(PLOT * a, -PLOT * b));
		}
		return points;
	});
	const strainNow = $derived.by(() => {
		const { a, b } = profile(run.u[i], wave);
		return { x: PLOT * a, y: -PLOT * b };
	});
	const strainSoFar = $derived(
		'M' +
			strain.slice(0, Math.min(strain.length, Math.floor(i / STRIDE) + 1)).join('L') +
			'L' +
			point(strainNow.x, strainNow.y)
	);

	// --- the shape in the hyperbolic plane ---------------------------------------------------------------------------

	/**
	 * The shape's path in the Poincaré disc, radius tanh(r/2) and angle psi, at every STRIDE-th sample, drawn to the
	 * scale that fits what the shape reaches while the wave passes (`fit`, as a fraction of the disc's radius).
	 * `reach` is how far out the shape has been up to each sample. `turns` are the places where psi has gone once more
	 * round, so that ground swept twice can be shaded twice.
	 */
	const disc = $derived.by(() => {
		const reach = new Float64Array(parts.count);
		let far = 0;
		for (let j = 0; j < parts.count; j++) {
			far = Math.max(far, Math.tanh(parts.r[j] / 2));
			reach[j] = far;
		}
		const waveEnd = Math.min(parts.count - 1, run.end < 0 ? parts.count - 1 : run.end);
		const fit = Math.min(1, Math.max(1e-9, ROOM * reach[waveEnd]));
		const scale = PLOT / fit;
		const points: string[] = [];
		const turns = [0];
		let from = parts.psi[0];
		for (let j = 0; j < parts.count; j += STRIDE) {
			const t = scale * Math.tanh(parts.r[j] / 2);
			points.push(point(t * Math.cos(parts.psi[j]), -t * Math.sin(parts.psi[j])));
			if (Math.abs(parts.psi[j] - from) >= TAU) {
				turns.push(points.length - 1);
				from = parts.psi[j];
			}
		}
		return { reach, fit, scale, points, turns };
	});
	/**
	 * How much of the disc the panel shows now, as a fraction of its radius. While the wave passes, what fits the
	 * wave's own path. After it the shape runs on, towards the edge if the ring is coming to a focus, and the panel
	 * draws back to keep it in sight, as far as the whole disc.
	 */
	const span = $derived(
		ended && focus ? 1 : Math.min(1, Math.max(disc.fit, ROOM * disc.reach[shaped]))
	);
	/** The path is drawn at the scale of `fit` and shrunk by this to the present span. */
	const zoom = $derived(disc.fit / span);
	/** The shape's place now, at the scale of `fit`: at the edge of the disc once the ring is at its focus. */
	const shapeNow = $derived.by(() => {
		const atEdge = ended && focus;
		const t = disc.scale * (atEdge ? 1 : Math.tanh(parts.r[shaped] / 2));
		const psi = atEdge ? focus.psi : parts.psi[shaped];
		return { x: t * Math.cos(psi), y: -t * Math.sin(psi) };
	});
	/** How many of the disc's points are behind the present moment. */
	const passed = $derived(Math.min(disc.points.length, Math.floor(shaped / STRIDE) + 1));
	const shapeSoFar = $derived(
		'M' + disc.points.slice(0, passed).join('L') + 'L' + point(shapeNow.x, shapeNow.y)
	);
	/** The ground swept by the line from the centre to the shape, one piece for each turn of psi. */
	const sweeps = $derived(
		disc.turns
			.filter((start) => start < passed)
			.map((start, turn) => {
				const stop = disc.turns[turn + 1] ?? Infinity;
				const d =
					'M0,0L' +
					disc.points.slice(start, Math.min(stop + 1, passed)).join('L') +
					(stop >= passed ? 'L' + point(shapeNow.x, shapeNow.y) : '') +
					'Z';
				return { turn, d };
			})
	);
	/** How far out the panel shows, as a distance r in the hyperbolic plane. */
	const shown = $derived(span < 1 ? 2 * Math.atanh(span) : Infinity);

	const moment = $derived(
		ended
			? 'the ring has come to its focus'
			: now <= 0
				? 'the wave arrives'
				: now < 1
					? 'the wave is passing'
					: 'the wave has passed'
	);
	/** What is said beside the angle: that it is drawn larger than it is or, at the focus, that it is held there. */
	const aside = $derived(ended ? 'at the focus' : magnify === 1 ? '' : `drawn ×${magnify}`);
</script>

<div class="frame" data-u={now.toFixed(3)}>
	<div class="figure">
		<div class="main">
			<svg
				class="ring"
				viewBox="-215 -212 430 412"
				role="img"
				aria-label="A ring of sixteen particles round a gyroscope. The marks have turned by {degrees(
					theta
				)} against it."
			>
				<!-- the ring as it began, with a tick where the marked particle was -->
				<circle r={R} class="first" />
				<line x1="0" x2="0" y1={-R + 9} y2={-R - 9} class="first-tick" />
				<!-- the gyroscope's marked arm, carried out to where the angle is drawn (it stands clear of the tick) -->
				<line x1="0" x2="0" y1="-62" y2={-R + 16} class="reference" />
				<line x1="0" x2="0" y1={-R - 16} y2={-ARC + 10} class="reference" />
				<line x1="0" x2="0" y1={-ARC + 10} y2={-ARC - 12} class="zero" />
				<g class="gyroscope">
					<line x1="-44" x2="44" y1="0" y2="0" />
					<line x1="0" x2="0" y1="44" y2="-46" />
					<path d="M0,-58L-5,-45L5,-45Z" />
					<circle r="4" />
				</g>
				<text x="11" y="23" class={['note', { away: !worded }]}>gyroscope</text>

				<path d={outline} class="outline" />
				{#each dots as dot (dot.k)}
					{#if dot.k}
						<circle cx={dot.x} cy={dot.y} r="5" class="dot" fill-opacity={dot.shade} />
					{/if}
				{/each}

				<!-- the turn of the marks: from the gyroscope's marked arm to the direction of the turned marks -->
				<line
					x1={62 * Math.cos(turned)}
					y1={-62 * Math.sin(turned)}
					x2={(ARC + 10) * Math.cos(turned)}
					y2={-(ARC + 10) * Math.sin(turned)}
					class="turned"
				/>
				<path d={arc} class="arc" />
				<circle cx={dots[0].x} cy={dots[0].y} r="9.5" class="mark-ring" />
				<circle cx={dots[0].x} cy={dots[0].y} r="5" class="mark" />
				<text x={12 * sense} y={-ARC - 6} class="angle" text-anchor={sense > 0 ? 'start' : 'end'}>
					<tspan class="symbol">θ</tspan> = {degrees(theta)}{#if aside}<tspan class="aside" dx="7"
							>{aside}</tspan
						>{/if}
				</text>
			</svg>

			<svg
				class={['strip', { live: onscrub }]}
				viewBox="-215 0 430 72"
				role="img"
				aria-label="The wave’s strain against time, with the present moment"
				onpointerdown={down}
				onpointermove={move}
				onpointerup={() => (dragging = false)}
				onpointercancel={() => (dragging = false)}
			>
				<!-- time runs on to the end of the view, but the run ends at the focus if the ring comes to one -->
				<line x1={STRIP.left} x2={finish} y1={STRIP.base} y2={STRIP.base} class="axis" />
				<line x1={finish} x2={STRIP.right} y1={STRIP.base} y2={STRIP.base} class="axis beyond" />
				{#if wave.hand !== 0}<path d={traces.cross} class="trace cross" />{/if}
				<path d={traces.plus} class="trace" />
				<line x1={stripX(1)} x2={stripX(1)} y1={STRIP.base - 5} y2={STRIP.base + 5} class="axis" />
				<!-- which trace is which, in the quiet part after the wave -->
				<g transform="translate({STRIP.right - (wave.hand === 0 ? 34 : 78)} 9)">
					<line x1="0" x2="14" y1="-3.5" y2="-3.5" class="trace" />
					<text x="18" class="legend"
						><tspan class="symbol">h</tspan><tspan dy="3" font-size="8">+</tspan></text
					>
					{#if wave.hand !== 0}
						<line x1="44" x2="58" y1="-3.5" y2="-3.5" class="trace cross" />
						<text x="62" class="legend"
							><tspan class="symbol">h</tspan><tspan dy="3" font-size="8">×</tspan></text
						>
					{/if}
				</g>
				<text x={STRIP.left} y="68.5" class="tick">0</text>
				<text x={stripX(1)} y="68.5" class="tick"><tspan class="symbol">T</tspan></text>
				<text x={STRIP.right} y="68.5" class="tick">{end} <tspan class="symbol">T</tspan></text>
				{#if focus}
					<line x1={finish} x2={finish} y1={STRIP.base - 9} y2={STRIP.base + 9} class="focus" />
					<text x={finish} y="58" class="tick">focus</text>
				{/if}
				<!-- the present moment: as tall as the traces, and so clear of the words above and below them -->
				<line
					x1={stripX(now)}
					x2={stripX(now)}
					y1={STRIP.base - STRIP.height}
					y2={STRIP.base + STRIP.height}
					class="now"
				/>
				<circle cx={stripX(now)} cy={STRIP.base} r="4.5" class="handle" />
			</svg>
		</div>

		<div class="side">
			<svg
				class="panel"
				viewBox="-120 -122 230 224"
				role="img"
				aria-label="The wave’s strain: the path of its two parts in their plane, up to the present moment"
			>
				<text x="-100" y="-106" class="title">The wave’s strain</text>
				<line x1={-PLOT - 10} x2={PLOT + 12} y1="0" y2="0" class="axis" />
				<line x1="0" x2="0" y1={-PLOT - 10} y2={PLOT + 10} class="axis" />
				<text x={PLOT + 26} y="-6" class="label end"
					><tspan class="symbol">h</tspan><tspan dy="3" font-size="8.5">+</tspan></text
				>
				<text x="7" y={-PLOT - 3} class="label"
					><tspan class="symbol">h</tspan><tspan dy="3" font-size="8.5">×</tspan></text
				>
				<path d={'M' + strain.join('L')} class="whole-path" />
				<path d={strainSoFar} class="path" />
				<circle cx={strainNow.x} cy={strainNow.y} r="4" class="here" />
				<text x="-100" y="96" class="scale">largest strain {(2 * wave.epsilon).toFixed(2)}</text>
			</svg>

			<svg
				class="panel"
				viewBox="-120 -122 230 260"
				role="img"
				aria-label="The ring’s shape as a point of the hyperbolic plane, with the area swept from the centre. Half that area is {degrees(
					swept
				)}."
			>
				<text x="-100" y="-106" class="title">The ring’s shape</text>
				<circle r={PLOT} class={['rim', { edge: span === 1 }]} />
				<!-- which way the ring is stretched at each side of the disc: psi is twice the angle of its long axis -->
				<ellipse cx={PLOT + 11} rx="6.5" ry="3.6" class="key" />
				<ellipse
					cy={-PLOT - 11}
					rx="6.5"
					ry="3.6"
					class="key"
					transform="rotate(-45 0 {-PLOT - 11})"
				/>
				<ellipse cx={-PLOT - 11} rx="3.6" ry="6.5" class="key" />
				<ellipse
					cy={PLOT + 11}
					rx="6.5"
					ry="3.6"
					class="key"
					transform="rotate(45 0 {PLOT + 11})"
				/>
				<g transform="scale({zoom})">
					{#each sweeps as sweep (sweep.turn)}
						<path d={sweep.d} class="swept" />
					{/each}
					<path d={shapeSoFar} class="path shape" />
					<line x1="0" y1="0" x2={shapeNow.x} y2={shapeNow.y} class="radius" />
				</g>
				<circle r="3" class="key" />
				<circle cx={zoom * shapeNow.x} cy={zoom * shapeNow.y} r="4" class="here shape" />
				<text x="-100" y="96" class="scale">
					{#if Number.isFinite(shown)}
						out to <tspan class="symbol">r</tspan> = {shown.toPrecision(2)}
					{:else}
						the whole disc
					{/if}
				</text>
				<text x="-100" y="114" class="label">turn of the marks</text>
				<text x="100" y="114" class="number end" data-testid="disc-turn">{degrees(theta)}</text>
				<text x="-100" y="130" class="label">half the area swept</text>
				<text x="100" y="130" class="number end" data-testid="disc-area">{degrees(swept)}</text>
			</svg>
		</div>
	</div>

	<p class="tag" data-testid="moment">
		<span>{moment}</span>
		<span>{now.toFixed(2)} <i>T</i></span>
		{#if magnify !== 1}<span>the turning is drawn at {magnify} times its size</span>{/if}
	</p>
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
		gap: 0.7rem;
		padding: var(--stage-pad, 2.5rem 1.25rem 3.4rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		color: var(--text);
		font-family: var(--font-sans);
	}

	/* the ring with its strip, and beside them the two panels: 660 drawing units by 484, with room kept for the line under them */
	.figure {
		display: flex;
		flex: none;
		width: var(--figure-width, min(100cqw, 136cqh - 3.4rem));
	}
	.main {
		flex: 430 1 0;
		min-width: 0;
	}
	.side {
		flex: 230 1 0;
		min-width: 0;
	}

	/* a tall frame: the panels go under the ring, side by side, which lets the ring be larger from here on */
	@container (aspect-ratio < 0.86) {
		.figure {
			display: block;
			width: var(--figure-width, min(100cqw, 59cqh - 1.5rem));
		}
		.side {
			display: flex;
			align-items: flex-start;
		}
		.panel {
			flex: 1 1 0;
			min-width: 0;
		}
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
	}
	.strip.live {
		cursor: ew-resize;
		touch-action: none;
	}

	/* the ring */
	.first {
		fill: none;
		stroke: var(--text-faint);
		stroke-dasharray: 2 5;
	}
	.first-tick {
		stroke: var(--text-faint);
		stroke-width: 1.5;
	}
	.reference {
		stroke: var(--text-faint);
		stroke-dasharray: 3 4;
	}
	.zero {
		stroke: var(--text-dim);
		stroke-width: 1.5;
	}
	.gyroscope line {
		stroke: var(--text-dim);
		stroke-width: 1.5;
	}
	.gyroscope path,
	.gyroscope circle {
		fill: var(--text-dim);
	}
	.outline {
		fill: none;
		stroke: var(--accent-2);
		stroke-width: 1.2;
		stroke-opacity: 0.5;
	}
	.dot {
		fill: var(--accent-2);
	}
	.mark {
		fill: var(--accent);
	}
	.mark-ring {
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.5;
	}
	.turned {
		stroke: var(--accent);
		stroke-width: 1.4;
	}
	.arc {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	/* the strip */
	.axis {
		stroke: var(--line-strong);
	}
	.axis.beyond {
		stroke-dasharray: 2 4;
	}
	.trace {
		fill: none;
		stroke: var(--text);
		stroke-width: 1.2;
	}
	.trace.cross {
		stroke: var(--text-dim);
		stroke-dasharray: 3 2.5;
	}
	.focus {
		stroke: var(--text-dim);
		stroke-width: 1.2;
	}
	.now {
		stroke: var(--text);
		stroke-width: 1.2;
	}
	.handle {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 1.5;
	}

	/* the panels */
	.rim {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--line-strong);
	}
	.rim.edge {
		stroke: var(--text-dim);
	}
	.key {
		fill: none;
		stroke: var(--text-faint);
	}
	.whole-path {
		fill: none;
		stroke: var(--line-strong);
	}
	.path {
		fill: none;
		stroke: var(--text);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.path.shape {
		stroke: var(--accent-2);
	}
	/* drawn inside a group that is scaled to the panel's present span: the lines keep their width */
	.path.shape,
	.radius {
		vector-effect: non-scaling-stroke;
	}
	.swept {
		fill: var(--accent);
		fill-opacity: 0.24;
	}
	.radius {
		stroke: var(--accent);
		stroke-width: 1.2;
	}
	.here {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 1.2;
	}
	.here.shape {
		fill: var(--accent-2);
	}

	/* the words */
	text {
		font-family: var(--font-sans);
		font-size: 11.5px;
		fill: var(--text-dim);
	}
	.symbol {
		font-style: italic;
	}
	.end {
		text-anchor: end;
	}
	.note {
		font-size: 12.5px;
		transition: opacity 0.25s;
	}
	.note.away {
		opacity: 0;
	}
	.angle {
		font-size: 14.5px;
		font-weight: 500;
		fill: var(--accent);
	}
	.aside {
		font-size: 11.5px;
		font-weight: 400;
		fill: var(--text-dim);
	}
	.tick {
		font-size: 10.5px;
		fill: var(--text-faint);
		text-anchor: middle;
	}
	.legend {
		font-size: 10.5px;
	}
	.title {
		font-size: 13px;
		font-weight: 600;
		fill: var(--text);
	}
	.label {
		font-size: 11.5px;
	}
	.scale {
		font-size: 10.5px;
		fill: var(--text-faint);
	}
	.number {
		font-family: var(--font-mono);
		font-size: 11.5px;
		fill: var(--accent);
	}

	/* the line under the drawing: the moment, and whether the turning is drawn larger than it is */
	.tag {
		flex: none;
		max-width: 100%;
		margin: 0;
		padding: 0.4em 0.75em;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-sunken) 60%, transparent);
		border: 1px solid var(--line-strong);
		color: var(--text-dim);
		font: 500 0.7rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-align: center;
	}
	.tag span + span::before {
		content: '·';
		margin-right: 0.3em;
	}
</style>
