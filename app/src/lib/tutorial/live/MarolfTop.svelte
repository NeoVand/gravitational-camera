<script lang="ts">
	/**
	 * Chapter 13.6's Marolf top: watching gives values, pushing gives brackets. Two modes.
	 *
	 * "A top": a free symmetric top in the paper's stone, drawn in three dimensions in an oblique view that turns by
	 * dragging (or the arrow keys), with its angular momentum L = (1, 2, L_z) J s as an arrow in the ink and its shadow
	 * on the plane z = 0, which is what the field reads. A slider sets L_z, from −4 to 4 J s; the readout of L_x and L_y
	 * does not move with it. "Turn by ε about x" turns the top (drawn at 12°, whatever ε) and shows δL_y/ε from the
	 * exact turn beside −L_z, the bracket {L_y, L_x} to first order; ε, on a ladder from 0.001 to 0.1 rad, may be
	 * changed after the turn, so that the two values are seen to meet as ε shrinks. "Watch for ten seconds" runs the
	 * free top, whose axis circles L, and reads L_x and L_y from its motion as it goes.
	 *
	 * "The hidden swirl": chapter 13.4's sphere in section, its inner ball turning one way and the rest the other, with
	 * the radius of the inner ball on a slider, and the readouts L_z and c²{Q_{x²−y²}, Q_{2xy}} from lib/hair/flow.ts.
	 *
	 * The arithmetic is in ./marolf-top.ts. The chapter's try box asks the prediction, so the figure answers it in no
	 * words: it shows live values only. Orange and blue are the tutorial's stretch and squeeze, so everything here is in
	 * the ink and the stone. The turn takes 0.9 s and the watch ten; under reduced motion each jumps to its end, and
	 * the swirl does not turn.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Angle01Icon,
		AxisThreeDIcon,
		RotateThreeDIcon,
		RulerIcon,
		Timer01Icon,
		Tornado02Icon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { basis, turned, viewStep, type View } from './majorana-stars';
	import {
		DRAWN_TURN,
		EPSILONS,
		INNER,
		LZ,
		OPENING_EPSILON,
		WATCH,
		aboutX,
		apply,
		clamp,
		dot,
		freeTop,
		momentum,
		opening,
		product,
		response,
		signed,
		swirl,
		topFacets,
		unit,
		type Vec
	} from './marolf-top';

	const uid = $props.id();

	type Mode = 'top' | 'swirl';
	let mode = $state<Mode>('top');

	// --- the top's settings and state ---------------------------------------------------------------------------------
	let lz = $state(LZ.opening);
	let rung = $state(OPENING_EPSILON);
	/** 'set': as the slider set it; 'turning': the turn being drawn; 'turned': turned by ε about x. */
	let phase = $state<'set' | 'turning' | 'turned'>('set');
	/** How far the drawn turn has gone, 0 to 1. */
	let turnFraction = $state(0);
	/** How long the top has been watched, in seconds. */
	let time = $state(0);
	let watching = $state(false);

	const epsilon = $derived(EPSILONS[rung]);

	/** A new L_z is a new top: it is put back as set. */
	function setLz(v: number) {
		const next = clamp(Math.round(v / LZ.step) * LZ.step, LZ.min, LZ.max);
		if (next === lz) return;
		lz = Number(next.toFixed(1));
		stop();
		phase = 'set';
		time = 0;
	}
	/** A new ε keeps the turn, now by the new angle, so that the readouts follow it. */
	const setRung = (v: number) => (rung = clamp(Math.round(v), 0, EPSILONS.length - 1));

	// --- the runs -------------------------------------------------------------------------------------------------------
	const TURN_MS = 900;
	let frame = 0;

	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		watching = false;
		if (phase === 'turning') phase = 'turned';
	}

	const still = () => prefersReducedMotion.current || typeof requestAnimationFrame === 'undefined';

	/** Runs `tick` with the fraction of `ms` gone, 0 to 1, and `done` at the end. */
	function animate(ms: number, tick: (f: number) => void, done: () => void) {
		const start = performance.now();
		const step = (now: number) => {
			const f = Math.min(1, (now - start) / ms);
			tick(f);
			if (f < 1) frame = requestAnimationFrame(step);
			else {
				frame = 0;
				done();
			}
		};
		frame = requestAnimationFrame(step);
	}

	/** Each turn starts from the top as set. */
	function turn() {
		stop();
		time = 0;
		if (still()) {
			phase = 'turned';
			return;
		}
		phase = 'turning';
		turnFraction = 0;
		animate(
			TURN_MS,
			// eased, so that the turn starts and ends gently
			(f) => (turnFraction = 0.5 - 0.5 * Math.cos(Math.PI * f)),
			() => (phase = 'turned')
		);
	}

	/** The top, turned or not, watched from the start for ten seconds. */
	function watch() {
		stop();
		time = 0;
		if (still()) {
			time = WATCH;
			return;
		}
		watching = true;
		animate(
			WATCH * 1000,
			(f) => (time = f * WATCH),
			() => (watching = false)
		);
	}

	$effect(() => stop);

	// --- the top's motion -----------------------------------------------------------------------------------------------
	const L = $derived(momentum(lz));
	const start = $derived(opening(L));
	const fraction = $derived(phase === 'set' ? 0 : phase === 'turning' ? turnFraction : 1);
	/** The drawing turns by DRAWN_TURN; the readings by ε. */
	const drawnTurn = $derived(aboutX(fraction * DRAWN_TURN));
	const trueTurn = $derived(aboutX(fraction * epsilon));
	const drawnL = $derived(apply(drawnTurn, L));
	const drawn = $derived(freeTop(drawnL, product(drawnTurn, start), time));
	const truth = $derived(freeTop(apply(trueTurn, L), product(trueTurn, start), time));
	/** What the field reads, from the top's motion. */
	const reading = $derived(truth.momentum);
	const result = $derived(phase === 'turned' ? response(lz, epsilon) : undefined);

	// --- the view -----------------------------------------------------------------------------------------------------
	const W = 360;
	const H = 380;
	const C = { x: W / 2, y: H / 2 + 4 };
	/** Drawing units to one J s. */
	const UNIT = 40;
	/** The top's size, in J s of the drawing. */
	const SIZE = 0.85;
	const OPENING_VIEW: View = { az: 28, el: 18 };
	let view = $state<View>({ ...OPENING_VIEW });
	const frameOf = $derived(basis(view));
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f1 = (x: number) => x.toFixed(1);

	const screen = (p: Vec) => ({
		x: C.x + UNIT * dot(p, frameOf.right),
		y: C.y - UNIT * dot(p, frameOf.up)
	});

	/** A segment from p to q in space as a path. */
	function segment(p: Vec, q: Vec): string {
		const [a, b] = [screen(p), screen(q)];
		return `M${f1(a.x)},${f1(a.y)}L${f1(b.x)},${f1(b.y)}`;
	}

	/** An arrow from p to q in space: a shaft and a head, drawn on the page. */
	function arrow(p: Vec, q: Vec, head = 9) {
		const [a, b] = [screen(p), screen(q)];
		const [dx, dy] = [b.x - a.x, b.y - a.y];
		const length = Math.hypot(dx, dy);
		if (length < 1e-6) return { shaft: '', head: '' };
		const [ux, uy] = [dx / length, dy / length];
		const h = Math.min(head * u, 0.45 * length);
		const half = 0.42 * h;
		const [xb, yb] = [b.x - ux * h, b.y - uy * h];
		return {
			shaft: `M${f1(a.x)},${f1(a.y)}L${f1(xb + ux * 0.5)},${f1(yb + uy * 0.5)}`,
			head: `M${f1(b.x)},${f1(b.y)}L${f1(xb - uy * half)},${f1(yb + ux * half)}L${f1(xb + uy * half)},${f1(yb - ux * half)}Z`
		};
	}

	const ORIGIN: Vec = [0, 0, 0];
	const PLANE = 2.5;
	const GRID = $derived.by(() => {
		let d = '';
		for (let k = -PLANE; k <= PLANE; k++) {
			d += segment([k, -PLANE, 0], [k, PLANE, 0]);
			d += segment([-PLANE, k, 0], [PLANE, k, 0]);
		}
		return d;
	});
	const AXES = $derived([
		{ name: 'x', from: [-PLANE - 0.4, 0, 0] as Vec, to: [PLANE + 0.7, 0, 0] as Vec },
		{ name: 'y', from: [0, -PLANE - 0.4, 0] as Vec, to: [0, PLANE + 0.7, 0] as Vec },
		{ name: 'z', from: [0, 0, -4.3] as Vec, to: [0, 0, 4.4] as Vec }
	]);
	const axisLabels = $derived(
		AXES.map((a) => {
			const end = a.to.map((x) => x * 1.07) as Vec;
			return { name: a.name, ...screen(end) };
		})
	);

	/** The turn about x, as a small arc round the x axis near its end, in the right-handed sense. */
	const turnArc = $derived.by(() => {
		const r = 0.42;
		const x = 0.75 * PLANE;
		let d = '';
		const STEPS = 28;
		const from = 0.35 * Math.PI;
		const to = from + 1.5 * Math.PI;
		for (let i = 0; i <= STEPS; i++) {
			const a = from + ((to - from) * i) / STEPS;
			const p = screen([x, r * Math.cos(a), r * Math.sin(a)]);
			d += `${i ? 'L' : 'M'}${f1(p.x)},${f1(p.y)}`;
		}
		const before = to - 0.25;
		const tip = arrow(
			[x, r * Math.cos(before), r * Math.sin(before)],
			[x, r * Math.cos(to + 0.08), r * Math.sin(to + 0.08)],
			6
		);
		return { d, head: tip.head };
	});

	/** The top's surface, culled and sorted far to near, each facet shaded by a light over the viewer's left shoulder. */
	const FACETS = topFacets();
	const facets = $derived.by(() => {
		const o = drawn.orientation;
		const { right, up, toward } = frameOf;
		const light = unit(
			[0, 1, 2].map((i) => -0.45 * right[i] + 0.7 * up[i] + 0.55 * toward[i]) as Vec
		);
		const list: { d: string; depth: number; shade: number }[] = [];
		for (const f of FACETS) {
			const n = apply(o, f.normal);
			if (dot(n, toward) <= 0) continue;
			let d = '';
			let depth = 0;
			for (let k = 0; k < 4; k++) {
				const p = apply(o, f.corners[k].map((x) => x * SIZE) as Vec);
				depth += dot(p, toward);
				const s = screen(p);
				d += `${k ? 'L' : 'M'}${f1(s.x)},${f1(s.y)}`;
			}
			const lit = 0.22 + 0.78 * Math.max(0, dot(n, light));
			list.push({ d: d + 'Z', depth, shade: Math.round(100 * lit * (f.band ? 0.72 : 1)) });
		}
		return list.sort((a, b) => a.depth - b.depth);
	});

	const LArrow = $derived(arrow(ORIGIN, drawnL));
	const before = $derived(arrow(ORIGIN, L));
	const shadow = $derived(arrow(ORIGIN, [drawnL[0], drawnL[1], 0], 7));
	const drop = $derived(segment(drawnL, [drawnL[0], drawnL[1], 0]));
	/** L's name just beyond its head, along it. */
	const LLabel = $derived.by(() => {
		const tip = screen(drawnL);
		const base = screen(ORIGIN);
		const [dx, dy] = [tip.x - base.x, tip.y - base.y];
		const n = Math.hypot(dx, dy) || 1;
		return { x: tip.x + (dx / n) * 11 * u, y: tip.y + (dy / n) * 11 * u };
	});

	// --- dragging and the keys ----------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined = $state();
	let drag: { x: number; y: number; view: View } | undefined;
	let dragging = $state(false);

	function point(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function press(e: PointerEvent) {
		const p = point(e);
		if (!p) return;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		drag = { x: p.x, y: p.y, view: { ...view } };
		dragging = true;
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		const p = point(e);
		if (!p) return;
		view = turned(drag.view, p.x - drag.x, p.y - drag.y, 150);
	}

	function release() {
		drag = undefined;
		dragging = false;
	}

	function handleKeys(e: KeyboardEvent) {
		const next = viewStep(view, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		view = next;
	}

	// --- the swirl ------------------------------------------------------------------------------------------------------
	let inner = $state(INNER.balanced);
	/** On the step's grid; the slider's two ticks set the marked radii exactly. */
	function setInner(v: number) {
		const marked = [INNER.balanced, INNER.zero].includes(v);
		inner = marked ? v : clamp(Math.round(v / INNER.step) * INNER.step, INNER.min, INNER.max);
	}
	const swirled = $derived(swirl(inner));

	const SW = 360;
	const SC = SW / 2;
	const SR = 150;
	/** The spacing of the rings of parts, in units of R, and the angle each arrow spans. */
	const SPACING = 0.105;
	const SPAN = 0.42;

	/**
	 * One arrow along the circle of radius r, from the angle a backwards by SPAN, pointing anticlockwise as seen if
	 * `sense` is 1 and clockwise if −1.
	 */
	function arc(r: number, a: number, sense: number) {
		const P = (t: number, rr = r) =>
			`${f1(SC + rr * Math.cos(t))},${f1(SC - sense * rr * Math.sin(t))}`;
		const head = Math.min(7, 0.5 * r * SPAN);
		const back = a - head / r;
		const spread = 0.5 * head;
		return {
			d: `M${P(a - SPAN)}A${f1(r)},${f1(r)} 0 0 ${sense > 0 ? 0 : 1} ${P(back)}`,
			head: `M${P(a)}L${P(back, r + spread)}L${P(back, r - spread)}Z`
		};
	}

	/** The rings of parts, the inner ball's and the rest's, each a path of shafts and one of heads. */
	const rings = $derived.by(() => {
		const x = Math.min(1, inner);
		const within = Math.max(2, Math.round(x / SPACING));
		const beyond = x < 1 ? Math.max(1, Math.round((1 - x) / SPACING)) : 0;
		const radii = [
			...Array.from({ length: within }, (_, i) => (x * (i + 1.5)) / (within + 1)),
			...Array.from({ length: beyond }, (_, i) => x + ((1 - x) * (i + 0.5)) / beyond)
		];
		const out = { inside: { d: '', head: '' }, outside: { d: '', head: '' } };
		radii.forEach((r, i) => {
			const count = Math.max(3, Math.round(3 + 13 * r));
			for (let j = 0; j < count; j++) {
				const a = (2 * Math.PI * (j + 0.37 * i)) / count;
				const one = arc(r * SR, a, r < x ? 1 : -1);
				const part = r < x ? out.inside : out.outside;
				part.d += one.d;
				part.head += one.head;
			}
		});
		return out;
	});

	/** How far the parts have turned, in degrees: the inner ball anticlockwise, the rest clockwise. */
	let spun = $state(0);
	const SPIN_RATE = 14;
	/** The parts turning, frame by frame, while the swirl is shown, unless the reader asks for less motion. */
	function spin() {
		if (prefersReducedMotion.current) return;
		let f = 0;
		let last = performance.now();
		const tick = (now: number) => {
			spun = (spun + (SPIN_RATE * (now - last)) / 1000) % 360;
			last = now;
			f = requestAnimationFrame(tick);
		};
		f = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(f);
	}

	// --- the words ------------------------------------------------------------------------------------------------------
	const MODES = [
		{ value: 'top' as const, label: 'A top', icon: AxisThreeDIcon },
		{ value: 'swirl' as const, label: 'The hidden swirl', icon: Tornado02Icon }
	];

	const QQ = '\\{\\htmlClass{q-matter}{Q_{x^2-y^2}}, \\htmlClass{q-matter}{Q_{2xy}}\\}';
	const MOR2 = '\\htmlClass{q-matter}{M}\\Omega R^2';
	const MOR4 = '\\htmlClass{q-matter}{M}\\Omega R^4';
	const FIRST_ORDER = '-L_z = \\{L_y, L_x\\}';

	const viewWords = $derived(
		`seen from the azimuth ${Math.round(view.az)}° and the elevation ${Math.round(view.el)}°`
	);
	const topLabel = $derived(
		`A free top, ${viewWords}, with its angular momentum L = (${signed(drawnL[0], 2)}, ${signed(drawnL[1], 2)}, ${signed(drawnL[2], 2)}) J s as drawn, ` +
			`and its shadow on the plane z = 0. ` +
			(phase === 'set' ? '' : 'The top has been turned about x, drawn at 12°. ') +
			(time > 0 ? `It has been watched for ${time.toFixed(1)} s, its axis circling L.` : '') +
			` Drag to turn the view; the arrow keys turn it by 5°, with Shift by 15°.`
	);
	const swirlLabel = $derived(
		`A uniform sphere in section through its equator, seen along its axis. The inner ball, out to ${inner.toFixed(3)} R, turns anticlockwise and the rest clockwise, at the same rate.`
	);
</script>

<div class="marolf-top">
	<div class="panels">
		{#if mode === 'top'}
			<section class="panel" aria-label="The top">
				<div class="stage">
					<p class="heading">A free top and its angular momentum, in J s</p>
					<svg
						class={{ dragging }}
						viewBox="0 0 {W} {H}"
						role="group"
						aria-label={topLabel}
						{@attach (node: SVGSVGElement) => {
							svg = node;
							return fitText((value) => (u = value))(node);
						}}
					>
						<!-- the plane z = 0, where the field's two readings lie, and the axes -->
						<path class="grid" d={GRID} />
						{#each AXES as a (a.name)}
							<path class="axis" d={segment(a.from, a.to)} />
						{/each}
						{#each axisLabels as a (a.name)}
							<text class="axis-name" x={f1(a.x)} y={f1(a.y)}>{a.name}</text>
						{/each}
						<path class="turn-arc" class:active={phase !== 'set'} d={turnArc.d} />
						<path class="turn-head" class:active={phase !== 'set'} d={turnArc.head} />

						<!-- L's shadow on the plane: what the field reads -->
						<path class="drop" d={drop} />
						<path class="shadow" d={shadow.shaft} />
						<path class="shadow-head" d={shadow.head} />

						{#if phase !== 'set'}
							<path class="before" d={before.shaft} />
							<path class="before-head" d={before.head} />
						{/if}

						<!-- the top -->
						{#each facets as f, i (i)}
							<path
								class="facet"
								d={f.d}
								style:fill="color-mix(in srgb, var(--stone-lit) {f.shade}%, var(--stone-shade))"
							/>
						{/each}

						<!-- its angular momentum -->
						<path class="L" d={LArrow.shaft} />
						<path class="L-head" d={LArrow.head} />
						<text class="L-name" x={f1(LLabel.x)} y={f1(LLabel.y)}>L</text>

						<g
							class="handle"
							role="slider"
							tabindex="0"
							aria-roledescription="view"
							aria-label="The view of the top. The arrow keys turn it by 5°, with Shift by 15°."
							aria-valuemin={-180}
							aria-valuemax={180}
							aria-valuenow={Math.round(view.az)}
							aria-valuetext={viewWords}
							onkeydown={handleKeys}
						>
							<rect
								class="hit"
								width={W}
								height={H}
								onpointerdown={press}
								onpointermove={move}
								onpointerup={release}
								onpointercancel={release}
								role="presentation"
							/>
							<rect class="focus" x="2" y="2" width={W - 4} height={H - 4} rx={8 * u} />
						</g>
					</svg>
					<ul class="legend" aria-hidden="true">
						<li><span class="swatch L-key"></span>the top’s angular momentum <i>L</i></li>
						<li>
							<span class="swatch shadow-key"></span>its shadow on the plane, what the field reads
						</li>
						{#if phase !== 'set'}
							<li><span class="swatch before-key"></span><i>L</i> before the turn</li>
						{/if}
					</ul>
				</div>
			</section>

			<section class="panel readings" aria-label="The readings">
				<div class="box">
					<p class="heading">What the field reads: <Tex math="L_x" />, <Tex math="L_y" /></p>
					<dl class="pairs">
						<div>
							<dt><Tex math="L_x" /></dt>
							<dd><span class="number">{signed(reading[0], 4)}</span> J s</dd>
						</div>
						<div>
							<dt><Tex math="L_y" /></dt>
							<dd><span class="number">{signed(reading[1], 4)}</span> J s</dd>
						</div>
					</dl>
					<p class="clock">
						watched for <span class="number small">{time.toFixed(1)}</span> s{#if watching}, as it
							goes{/if}
					</p>
				</div>

				<div class="turned">
					<p class="heading">
						The turn by <Tex math="\epsilon = {epsilon.toFixed(3)}" /> rad about <Tex math="x" />
					</p>
					<dl class="readouts">
						<div>
							<dt>
								<Tex math="\delta L_y/\epsilon" />, from the exact turn
							</dt>
							<dd>
								{#if result}
									<span class="number strong">{signed(result.exact, 3, true)}</span> J s
								{:else}
									<span class="wanting">turn the top to read it</span>
								{/if}
							</dd>
						</div>
						<div>
							<dt>
								<Tex math={FIRST_ORDER} />, to first order
							</dt>
							<dd><span class="number">{signed(-lz, 3, true)}</span> J s</dd>
						</div>
					</dl>
				</div>
			</section>
		{:else}
			<section class="panel" aria-label="The hidden swirl">
				<div class="stage">
					<p class="heading">The sphere in section through its equator, seen along its axis</p>
					<svg
						viewBox="0 0 {SW} {SW}"
						role="img"
						aria-label={swirlLabel}
						{@attach fitText((value) => (u = value))}
						{@attach spin}
					>
						<circle class="rest-fill" cx={SC} cy={SC} r={SR} />
						<circle class="inner-fill" cx={SC} cy={SC} r={Math.min(1, inner) * SR} />
						<g transform="rotate({-spun} {SC} {SC})">
							<path class="flow" d={rings.inside.d} />
							<path class="flow-head" d={rings.inside.head} />
						</g>
						<g transform="rotate({spun} {SC} {SC})">
							<path class="flow rest" d={rings.outside.d} />
							<path class="flow-head rest" d={rings.outside.head} />
						</g>
						<circle class="edge" cx={SC} cy={SC} r={Math.min(1, inner) * SR} />
						<circle class="rim" cx={SC} cy={SC} r={SR} />
						<circle class="axis-dot" cx={SC} cy={SC} r={2.4 * u} />
					</svg>
					<ul class="legend" aria-hidden="true">
						<li><span class="swatch flow-key"></span>the inner ball, turning anticlockwise</li>
						<li><span class="swatch rest-key"></span>the rest, clockwise, at the same rate</li>
						<li><span class="swatch edge-key"></span>where the inner ball ends</li>
					</ul>
				</div>
			</section>

			<section class="panel readings" aria-label="The readings">
				<dl class="readouts">
					<div>
						<dt>The angular momentum, <Tex math="L_z" /></dt>
						<dd>
							<span class="number">{signed(swirled.momentum)}</span>
							<Tex math={MOR2} trust />
						</dd>
					</div>
					<div>
						<dt>
							The bracket of the two quadrupoles, <Tex math={`c^2${QQ}`} trust />
							<span class="also"><Tex math="= -2\int(x^2 + y^2)\,\ell_z\,\mathrm dV" /></span>
						</dt>
						<dd>
							<span class="number strong">{signed(swirled.bracket)}</span>
							<Tex math={MOR4} trust />
						</dd>
					</div>
				</dl>
			</section>
		{/if}
	</div>

	<div class="bar">
		<Segmented label="What to look at" options={MODES} bind:value={mode} />
		{#if mode === 'top'}
			<div class="sliders">
				<Slider
					id="{uid}-lz"
					label="L_z"
					icon={AxisThreeDIcon}
					min={LZ.min}
					max={LZ.max}
					step={LZ.step}
					bind:value={() => lz, setLz}
					readout="{signed(lz, 1)} J s"
					ends={['−4', '4']}
				/>
				<Slider
					id="{uid}-epsilon"
					label="The angle of the turn, ε"
					icon={Angle01Icon}
					min={0}
					max={EPSILONS.length - 1}
					step={1}
					bind:value={() => rung, setRung}
					readout="{epsilon.toFixed(3)} rad"
					ends={['0.001', '0.1']}
				/>
			</div>
			<div class="actions">
				<button type="button" class="action" onclick={turn}>
					<HugeiconsIcon icon={RotateThreeDIcon} size={16} strokeWidth={1.7} />
					Turn by ε about x
				</button>
				<button type="button" class="action" onclick={watch}>
					<HugeiconsIcon icon={Timer01Icon} size={16} strokeWidth={1.7} />
					Watch for ten seconds
				</button>
			</div>
			<p class="hint">
				Drag the drawing to turn the view, or Tab to it and use the arrow keys. Each turn starts
				from the top as set; ε may be changed after it, and a new <i>L<sub>z</sub></i> puts the top back.
			</p>
		{:else}
			<div class="sliders">
				<Slider
					id="{uid}-inner"
					label="Radius of the inner ball"
					icon={RulerIcon}
					min={INNER.min}
					max={INNER.max}
					step={INNER.step}
					bind:value={() => inner, setInner}
					readout="{inner.toFixed(3)} R"
					marks={[
						{ at: INNER.balanced, label: 'no angular momentum' },
						{ at: INNER.zero, label: 'zero bracket' }
					]}
					marksHint="the ticks mark two radii worth trying"
				/>
			</div>
		{/if}
	</div>

	<p class="note">
		Exact: the turn of <i>L</i> by <Tex math="\epsilon" /> about <Tex math="x" />, from which <Tex
			math="\delta L_y/\epsilon"
		/> is taken, and its first-order value <Tex math="-L_z" />; the free top’s motion, Euler’s for a
		symmetric top in closed form, from which <Tex math="L_x" /> and <Tex math="L_y" /> are read as it
		goes; and the swirl’s <Tex math="L_z" /> and bracket, from lib/hair/flow.ts, the bracket half 13.4’s
		octupolar bracket of two rates. Schematic: the top’s shape and its moments of inertia, 2 and 3 kg
		m² across and along its axis, chosen so that its axis visibly circles <i>L</i> at 20°; the turn,
		drawn at 12° whatever <Tex math="\epsilon" />; the view; and the swirl’s arrows, the path of a
		part in one interval of time.
	</p>
</div>

<style>
	.marolf-top {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		/* the paper's stone: the colour of matter in the grey of the ink, lit and shaded */
		--stone: color-mix(
			in srgb,
			var(--q-matter) 38%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
		--stone-lit: color-mix(in srgb, var(--stone) 64%, white);
		--stone-shade: color-mix(in srgb, var(--stone) 52%, black);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panels {
		display: grid;
		grid-template-columns: minmax(0, 11fr) minmax(0, 9fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.7rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.45rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	/* the top's view turns under the finger, so the drawing does not scroll the page */
	.stage svg[role='group'] {
		touch-action: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	/* --- the top ------------------------------------------------------------------------------ */

	.grid {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.axis {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis-name,
	.L-name {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: calc(14px * var(--u, 1));
		text-anchor: middle;
		dominant-baseline: middle;
		fill: var(--text-dim);
	}

	.L-name {
		font-size: calc(16px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.turn-arc {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.turn-head {
		fill: color-mix(in srgb, var(--text) 35%, transparent);
	}

	.turn-arc.active {
		stroke: var(--text);
	}

	.turn-head.active {
		fill: var(--text);
	}

	.facet {
		stroke: color-mix(in srgb, var(--stone-shade) 60%, transparent);
		stroke-width: calc(0.35px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the angular momentum is neither a mass nor a tide: the ink */
	.L {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.L-head {
		fill: var(--text);
	}

	.before {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.before-head {
		fill: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.shadow {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.shadow-head {
		fill: var(--text-dim);
	}

	.drop {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.hit {
		fill: transparent;
		cursor: grab;
	}

	svg.dragging .hit {
		cursor: grabbing;
	}

	.handle:focus {
		outline: none;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
		pointer-events: none;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	/* --- the swirl ---------------------------------------------------------------------------- */

	.rest-fill {
		fill: color-mix(in srgb, var(--stone) 22%, transparent);
	}

	.inner-fill {
		fill: color-mix(in srgb, var(--stone) 50%, transparent);
	}

	.flow {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.flow-head {
		fill: var(--text);
	}

	.flow.rest {
		stroke: var(--text-dim);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.flow-head.rest {
		fill: var(--text-dim);
	}

	.edge {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.rim {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.axis-dot {
		fill: var(--text);
	}

	/* --- the legends ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.4rem 0.2rem 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		flex: none;
		display: inline-block;
		width: 1.2rem;
		height: 0;
		border-top: 1.4px solid var(--text);
	}

	.L-key {
		border-top-width: 2.2px;
	}

	.shadow-key {
		border-top: 1.5px dashed var(--text-dim);
	}

	.before-key {
		border-top: 1.6px solid color-mix(in srgb, var(--text) 38%, transparent);
	}

	.flow-key {
		border-top: 1.6px solid var(--text);
	}

	.rest-key {
		border-top: 1.3px solid var(--text-dim);
	}

	.edge-key {
		border-top: 1.2px dashed var(--text);
	}

	/* --- the readings -------------------------------------------------------------------------- */

	.readings {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		padding: 0.7rem 0.9rem 0.8rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.box {
		padding: 0.55rem 0.7rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: color-mix(in srgb, var(--text) 3%, transparent);
	}

	.box .heading {
		margin-bottom: 0.35rem;
	}

	.pairs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.3rem 0.8rem;
		margin: 0;
	}

	.pairs div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.clock {
		margin: 0.35rem 0 0;
		font-size: 0.74rem;
		color: var(--text-dim);
	}

	.turned .heading {
		margin-bottom: 0.4rem;
	}

	.readouts {
		display: grid;
		gap: 0.55rem;
		margin: 0;
	}

	.turned .readouts {
		padding-top: 0.5rem;
		border-top: 1px solid var(--line);
	}

	.readouts div {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	dt {
		margin: 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	dd {
		margin: 0;
		text-align: right;
		white-space: nowrap;
		color: var(--text-dim);
	}

	.also {
		display: block;
		margin-top: 0.15rem;
	}

	.number {
		font-size: 1.05rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.number.small {
		font-size: 0.8rem;
	}

	.number.strong {
		font-weight: 650;
	}

	.wanting {
		font-size: 0.74rem;
		color: var(--text-faint);
		white-space: normal;
	}

	/* --- the controls and the note ----------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.action {
		flex: 1 1 auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.3rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.76rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		touch-action: manipulation;
		transition: border-color 0.15s;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover {
			border-color: var(--accent);
		}
	}

	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.note {
		margin: 0;
		padding: 0.7rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}

	@media (max-width: 680px) {
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.stage svg {
			max-width: 24rem;
			margin: 0 auto;
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.readings {
			padding: 0.6rem 0.6rem 0.75rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
