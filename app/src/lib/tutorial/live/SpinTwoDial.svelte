<script lang="ts">
	/**
	 * Chapter 1.5b's dial, in two linked panels. (a) A ring of twelve free balls under a trace-free table with the
	 * shear s, an arrow v in the same plane, and a pair of axes x′, y′ that the reader turns by θ: by dragging them,
	 * with the slider, or with the arrow keys on the knob. The ring and the arrow do not move; a choice shows the
	 * same from the turned axes, with the picture turned by −θ instead. (b) The complex plane with the two numbers
	 * in the turned axes, v′ = e^(−iθ) v and s′ = e^(−2iθ) s (./spin-two-dial.ts): v′ goes round its circle once
	 * per turn, s′ twice. A toggle replaces the steady shear by a rotor's wave seen at the inclination ι, whose shear
	 * moves round an ellipse made of two circles turning opposite ways. Two predictions at the top are answered once
	 * the reader has done what they ask.
	 */
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		PauseIcon,
		PlayIcon,
		RotateLeft01Icon,
		RotateRight01Icon,
		Undo02Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { displaced, kind, move, ring } from './ring-matrix';
	import {
		ARROW,
		DEGREE,
		HALF,
		QUARTER,
		SHEAR,
		angleText,
		argument,
		at,
		bearing,
		circles,
		circular,
		cis,
		complexTex,
		dragged,
		modulus,
		parts,
		rotor,
		rotorShear,
		signed,
		tableOf,
		times,
		turnArrow,
		turnShear,
		wrap,
		type Complex
	} from './spin-two-dial';

	const uid = $props.id();

	// --- the turn of the axes: the dial's value, and the turn drawn, which eases back when the reader resets it -----
	let theta = $state(0);
	const drawn = new Tween(0, { duration: 0 });

	// --- the predictions ---------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let sawQuarter = $state(false);
	let sawHalf = $state(false);
	const revealed = $derived(step === 1 ? sawQuarter : sawHalf);

	function setTheta(deg: number) {
		theta = Math.max(0, Math.min(360, deg));
		drawn.set(theta, { duration: 0 });
		if (at(theta, QUARTER)) sawQuarter = true;
		if (at(theta, HALF)) sawHalf = true;
	}

	function reset() {
		theta = 0;
		drawn.set(0, { duration: prefersReducedMotion.current ? 0 : 700, easing: cubicOut });
	}

	type View = 'axes' | 'ring';
	/** Which the picture turns: the axes, over a ring held still, or the ring, under axes held still. */
	let view = $state<View>('axes');

	// --- a rotor's wave: its inclination, degrees, and its phase x = 2Ωu, degrees ------------------------------------
	let wave = $state(false);
	let iota = $state(60);
	let phase = $state(0);
	let playing = $state(false);

	/** The phase advances by a whole turn in four seconds while the wave plays. */
	const RATE = 90;
	let frame: number | undefined;

	function play() {
		if (frame !== undefined) return;
		playing = true;
		let last: number | undefined;
		const tick = (t: number) => {
			if (last !== undefined) phase = wrap(phase + (RATE * (t - last)) / 1000);
			last = t;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	function pause() {
		if (frame !== undefined) cancelAnimationFrame(frame);
		frame = undefined;
		playing = false;
	}

	/** The wave plays when it is switched on, unless the reader prefers less motion; it is still then. */
	function setWave(on: boolean) {
		wave = on;
		if (on && !prefersReducedMotion.current) play();
		else pause();
	}

	/** No frame is left asked for once the figure is gone. */
	const stopping = () => () => {
		if (frame !== undefined) cancelAnimationFrame(frame);
		frame = undefined;
	};

	// --- the physics -------------------------------------------------------------------------------------------------
	const th = $derived(drawn.current);
	/** The shear in the first axes, x and y: steady, or the rotor's at this phase. */
	const shear = $derived(wave ? rotorShear(iota * DEGREE, phase * DEGREE) : SHEAR);
	const table = $derived(tableOf(shear));
	const sTurned = $derived(turnShear(shear, th * DEGREE));
	const vTurned = $derived(turnArrow(ARROW, th * DEGREE));

	/** How the picture turns the ring and the arrow, and where it draws the axes x′: degrees, anticlockwise. */
	const spin = $derived(view === 'ring' ? -th : 0);
	const axesAt = $derived(view === 'ring' ? 0 : th);

	// --- the drawing ---------------------------------------------------------------------------------------------------
	/** Both panels are square, 200 units across. */
	const HALF_BOX = 100;
	const viewBox = `${-HALF_BOX} ${-HALF_BOX} ${2 * HALF_BOX} ${2 * HALF_BOX}`;

	/** Drawing units in one CSS pixel, in each panel, so that marks keep their size on the screen. */
	let u = $state(1);
	let w = $state(1);
	const BALL = $derived(4.2 * u);

	const f2 = (n: number) => n.toFixed(2);
	/** A point at `r` drawing units in the direction `deg`, anticlockwise from the right, screen y down. */
	const polar = (r: number, deg: number) => ({
		x: r * Math.cos(deg * DEGREE),
		y: -r * Math.sin(deg * DEGREE)
	});
	/** A point of the ring's plane, x right and y up, turned by the picture's spin and put on the screen. */
	function screen(p: { x: number; y: number }, r = R) {
		const c = Math.cos(spin * DEGREE);
		const s = Math.sin(spin * DEGREE);
		return { x: r * (c * p.x - s * p.y), y: -r * (s * p.x + c * p.y) };
	}

	// panel (a): the ring
	/** The ring's radius as drawn. */
	const R = 50;
	/** The drawing moves a ball by this times −T ξ: |s| = 2 moves it by a fifth of the radius. */
	const K = 0.2;
	/** An arrow is this many times as long as the move drawn. */
	const LONG = 1.6;
	/** The turned axes reach this far from the centre, the first axes a little less. */
	const AXIS = 1.64 * R;
	const WORLD = AXIS;
	const rest = ring(12);

	const balls = $derived(
		rest.map((p) => {
			const q = displaced(table, p.x, p.y, K);
			const m = move(table, p.x, p.y);
			const at = screen(q);
			const tip = screen({ x: LONG * K * m.x, y: LONG * K * m.y });
			return { at, kind: kind(table, p.x, p.y), arrow: arrow(at, tip, BALL + 1.2 * u) };
		})
	);

	const outline = $derived(
		ring(96)
			.map((p) => screen(displaced(table, p.x, p.y, K)))
			.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`)
			.join('') + 'Z'
	);

	/** The shaft and head of an arrow `v` from `from`, starting `gap` beyond it; none if too short to read. */
	function arrow(
		from: { x: number; y: number },
		v: { x: number; y: number },
		gap: number,
		size = 1
	) {
		const len = Math.hypot(v.x, v.y);
		if (len < 1.5 * u) return undefined;
		const head = Math.min(5.4 * u * size, 0.4 * len);
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * gap, y: from.y + uy * gap };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const half = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * half)},${f2(base.y + ux * half)}L${f2(base.x + uy * half)},${f2(base.y - ux * half)}Z`,
			tip
		};
	}

	/** The arrow v, from the centre. */
	const V_LONG = 0.66 * R;
	const vArrow = $derived(
		arrow({ x: 0, y: 0 }, screen({ x: ARROW.re, y: ARROW.im }, V_LONG), 0, 1.25)
	);
	const vLabel = $derived(polar(V_LONG + 9 * u, argument(ARROW) + spin));

	/** The turned axes: x′ ends in the knob, y′ in an arrowhead; each named beyond its end. */
	const xEnd = $derived(polar(AXIS, axesAt));
	const yEnd = $derived(polar(AXIS, axesAt + 90));
	const yHead = $derived(arrow(polar(AXIS - 12 * u, axesAt + 90), polar(12 * u, axesAt + 90), 0));
	const xName = $derived(polar(AXIS + 13 * u, axesAt));
	const yName = $derived(polar(AXIS + 9 * u, axesAt + 90));

	/** The first axes, x and y, turned with the ring; each named unless a turned axis stands near it. */
	const near = (a: number, b: number) => Math.abs(((((a - b) % 360) + 540) % 360) - 180) < 14;
	const firstAxes = $derived(
		[0, 90].map((d) => {
			const deg = d + spin;
			return {
				end: polar(WORLD, deg),
				name: polar(WORLD + 8 * u, deg),
				label: d === 0 ? 'x' : 'y',
				named: !near(deg, axesAt) && !near(deg, axesAt + 90)
			};
		})
	);

	/** The angle θ, an arc from the first x axis to x′. */
	const ARC = 0.3 * R;
	const arc = $derived.by(() => {
		const from = spin;
		const sweep = th;
		if (sweep < 0.5) return undefined;
		const a = polar(ARC, from);
		const b = polar(ARC, from + sweep);
		const d =
			sweep > 359.5
				? `M${f2(a.x)},${f2(a.y)}A${ARC},${ARC} 0 1 0 ${f2(-a.x)},${f2(-a.y)}A${ARC},${ARC} 0 1 0 ${f2(a.x)},${f2(a.y)}`
				: `M${f2(a.x)},${f2(a.y)}A${ARC},${ARC} 0 ${sweep > 180 ? 1 : 0} 0 ${f2(b.x)},${f2(b.y)}`;
		const name = polar(ARC + 7 * u, from + Math.min(sweep, 360) / 2);
		return { d, name, named: sweep >= 14 };
	});

	// panel (b): the complex plane
	/** Drawing units per unit of the plane: the shear's circle, radius 2, at 66. */
	const G = 33;
	const PLANE = 2.78 * G;
	const place = (z: Complex) => ({ x: G * z.re, y: -G * z.im });

	const vAt = $derived(place(vTurned));
	const sAt = $derived(place(sTurned));
	const vFirst = place(ARROW);
	const sFirst = place(SHEAR);

	/** A point's name, beyond it, away from the origin. */
	function nameBeside(p: { x: number; y: number }, gap: number) {
		const r = Math.hypot(p.x, p.y);
		const d = r < 1e-6 ? { x: 1, y: 0 } : { x: p.x / r, y: p.y / r };
		return { x: p.x + gap * d.x, y: p.y + gap * d.y };
	}

	/** The path a number has taken since θ = 0, clockwise round its circle; the shear's drawn inward on its second lap. */
	function trail(z: Complex, turns: number, inward: number) {
		const sweep = turns * th;
		if (sweep < 0.5) return undefined;
		const n = Math.max(2, Math.ceil(sweep / 3));
		const r0 = modulus(z);
		const a0 = argument(z);
		const pts = Array.from({ length: n + 1 }, (_, i) => {
			const t = (sweep * i) / n;
			return polar(G * r0 * (1 - (inward * t) / 360), a0 - t);
		});
		return pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`).join('');
	}
	const vTrail = $derived(trail(ARROW, 1, 0));
	const sTrail = $derived(wave ? undefined : trail(SHEAR, 2, 0.07));

	/** The rotor's ellipse and its two circles, in the turned axes. */
	const turnBy = $derived(cis(-2 * th * DEGREE));
	const ellipse = $derived.by(() => {
		if (!wave) return undefined;
		return (
			Array.from({ length: 97 }, (_, i) =>
				place(times(turnBy, rotorShear(iota * DEGREE, (2 * Math.PI * i) / 96)))
			)
				.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`)
				.join('') + 'Z'
		);
	});
	const radii = $derived(circles(iota * DEGREE));
	const phasors = $derived.by(() => {
		if (!wave) return undefined;
		const [p] = parts(iota * DEGREE, phase * DEGREE);
		const centre = place(times(turnBy, p));
		return { centre, tip: sAt };
	});

	const ticks = [-2, -1, 1, 2];
	const tickText = (n: number) => String(n).replace('-', '−');
	const imaginary = (n: number) => (n === 1 ? 'i' : n === -1 ? '−i' : `${tickText(n)}i`);
	/** A mark's number is left out while a point stands on it. */
	const covered = (p: { x: number; y: number }) =>
		[sAt, vAt].some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 11 * w);
	const sName = $derived(nameBeside(sAt, 12 * w));
	const vName = $derived(nameBeside(vAt, 12 * w));

	// --- moving the dial: by pointer, or by the arrow keys on the knob ------------------------------------------------
	let svgA: SVGSVGElement | undefined;
	const holdA = (node: SVGSVGElement) => {
		svgA = node;
		return () => (svgA = undefined);
	};
	let grip: { from: number; start: number } | undefined;
	let dragging = $state(false);

	function bearingOf(e: PointerEvent) {
		const m = svgA?.getScreenCTM();
		if (!m) return 0;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return bearing(p.x, p.y);
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		// a finger scrolls the page unless it takes the axes (or, with the axes held, the ring)
		if (e.pointerType === 'touch' && !(e.target as Element).closest('.grip')) return;
		// a drag is not a click: nothing takes the focus, so no ring is drawn
		e.preventDefault();
		svgA?.setPointerCapture(e.pointerId);
		dragging = true;
		grip = { from: bearingOf(e), start: theta >= 360 ? 0 : theta };
	}

	function moveTo(e: PointerEvent) {
		if (!dragging || !grip) return;
		setTheta(dragged(grip.start, grip.from, bearingOf(e), view === 'ring' ? -1 : 1));
	}

	function release() {
		dragging = false;
		grip = undefined;
	}

	function key(e: KeyboardEvent) {
		const by: Record<string, number> = {
			ArrowRight: 5,
			ArrowUp: 5,
			ArrowLeft: -5,
			ArrowDown: -5,
			PageUp: 45,
			PageDown: -45
		};
		if (e.key === 'Home') setTheta(0);
		else if (e.key === 'End') setTheta(360);
		else if (e.key in by) setTheta(wrap(theta + by[e.key]));
		else return;
		e.preventDefault();
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const degreesTex = (deg: number) => `${angleText(deg)}^\\circ`;
	const thetaText = $derived(`${Math.round(th)}°`);
	const vTex = $derived(`v' = e^{-i\\theta}\\,v = ${complexTex(vTurned)}`);
	const sTex = $derived(`s' = e^{-2i\\theta}\\,s = ${complexTex(sTurned)}`);
	const vPolarTex = $derived(
		`|v'| = ${modulus(vTurned).toFixed(2)},\\ \\arg v' = ${degreesTex(argument(vTurned))}`
	);
	const sPolarTex = $derived(
		`|s'| = ${modulus(sTurned).toFixed(2)},\\ \\arg s' = ${degreesTex(argument(sTurned))}`
	);
	const amplitudes = $derived(rotor(iota * DEGREE));
	const rotorTex = $derived(
		`h_+ = ${amplitudes.plus.toFixed(2)}A,\\ h_\\times = ${amplitudes.cross.toFixed(2)}A`
	);
	const circlesTex = $derived(
		`\\tfrac12(h_+ \\pm h_\\times) = ${(radii.with / 2).toFixed(2)}A,\\ ${(radii.against / 2).toFixed(2)}A`
	);
	const circularTex = $derived(`${circular(iota * DEGREE).toFixed(2)}`);

	/** What the dial stands at, if it is one of the turns worth marking. */
	const standing = $derived(
		at(th, QUARTER) || at(th, 270)
			? 'quarter'
			: at(th, HALF)
				? 'half'
				: at(th, 0)
					? 'none'
					: undefined
	);

	const description = $derived(
		`A ring of twelve free balls under a shear and an arrow, with axes turned by ${Math.round(th)} degrees` +
			(view === 'ring'
				? ', drawn from the turned axes, so that the ring and the arrow turn the other way.'
				: '.')
	);
	const spoken = (z: Complex) =>
		`${signed(z.re)} ${z.im < 0 ? 'minus' : 'plus'} ${signed(Math.abs(z.im))} i`;
	const planeDescription = $derived(
		`The complex plane. The arrow's number v prime is ${spoken(vTurned)}, at ${angleText(argument(vTurned))} degrees; ` +
			`the shear s prime is ${spoken(sTurned)}, at ${angleText(argument(sTurned))} degrees.`
	);
</script>

<div class="spin-two-dial" {@attach stopping}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Turn the axes by 90°. Where does <Tex math="s" /> go?
			{:else}
				Turn them by 180°. Does the ring’s pattern look the same from the new axes? Does the arrow?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>To <Tex math="-s" />, straight across the origin.</strong> A quarter turn multiplies
				the shear by <Tex math={'e^{-i\\pi} = -1'} />: in the new axes the stretch and the squeeze
				have changed places, though no ball has moved. The arrow’s number goes only a quarter of the
				way round, to <Tex math="-iv" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>The pattern does; the arrow does not.</strong> A half turn multiplies the shear by
				<Tex math={'e^{-2\\pi i} = 1'} /> and the arrow by <Tex math={'e^{-i\\pi} = -1'} />. Choose
				“Axes still” to see it from the turned axes: the ring turned by half a turn is the same
				ring, and the arrow points the other way. Only a whole turn brings the arrow back.
			{:else if step === 1}
				The answer appears when the axes stand at 90°.
			{:else}
				The answer appears when the axes stand at 180°.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title"><span class="letter">(a)</span> The ring, the arrow and the axes</p>
			<svg
				{viewBox}
				role="group"
				aria-label={description}
				class={['ring', { dragging, held: view === 'ring' }]}
				onpointerdown={press}
				onpointermove={moveTo}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdA}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<radialGradient id="{uid}-ball" cx="0.36" cy="0.32" r="0.75">
						<stop offset="0" class="ball-light" />
						<stop offset="1" class="ball-dark" />
					</radialGradient>
				</defs>

				<!-- the first axes, x and y, which turn with the ring -->
				{#each firstAxes as a (a.label)}
					<line class="first" x1={-a.end.x} y1={-a.end.y} x2={a.end.x} y2={a.end.y} />
					{#if a.named}
						<text class="sym faint" x={a.name.x} y={a.name.y} dy="0.35em">{a.label}</text>
					{/if}
				{/each}

				<!-- the ring at rest, the ring as the shear moves it, and the balls with their arrows -->
				<circle class="rest" r={R} />
				<path class="bent" d={outline} />
				{#if view === 'ring'}
					<circle class="grip ring-hit" r={R} />
				{/if}
				{#each balls as b, i (i)}
					{#if b.arrow}
						<path class={['shaft', b.kind]} d={b.arrow.shaft} />
						<path class={['head', b.kind]} d={b.arrow.head} />
					{/if}
					<circle class="ball" cx={b.at.x} cy={b.at.y} r={BALL} fill="url(#{uid}-ball)" />
				{/each}

				<!-- the angle θ from x to x′ -->
				{#if arc}
					<path class="arc" d={arc.d} />
					{#if arc.named}
						<text class="sym small" x={arc.name.x} y={arc.name.y} dy="0.35em">θ</text>
					{/if}
				{/if}

				<!-- the arrow v -->
				{#if vArrow}
					<path class="vee-shaft" d={vArrow.shaft} />
					<path class="vee-head" d={vArrow.head} />
				{/if}
				<text class="sym vee" x={vLabel.x} y={vLabel.y} dy="0.35em">v</text>
				<circle class="centre" r={1.6 * u} />

				<!-- the turned axes, with the knob that turns them -->
				<g class="grip axes">
					<line class="hit" x1={-xEnd.x} y1={-xEnd.y} x2={xEnd.x} y2={xEnd.y} />
					<line class="hit" x1={-yEnd.x} y1={-yEnd.y} x2={yEnd.x} y2={yEnd.y} />
					<line class="turned" x1={-xEnd.x} y1={-xEnd.y} x2={xEnd.x} y2={xEnd.y} />
					<line class="turned" x1={-yEnd.x} y1={-yEnd.y} x2={yEnd.x} y2={yEnd.y} />
					{#if yHead}<path class="turned-head" d={yHead.head} />{/if}
				</g>
				<text class="sym" x={yName.x} y={yName.y} dy="0.35em">y′</text>
				<text class="sym" x={xName.x} y={xName.y} dy="0.35em">x′</text>
				<g
					class="grip knob"
					transform="translate({f2(xEnd.x)} {f2(xEnd.y)})"
					role="slider"
					tabindex="0"
					aria-label="The turn of the axes, θ. Drag the axes, or use the arrow keys."
					aria-valuemin={0}
					aria-valuemax={360}
					aria-valuenow={Math.round(theta)}
					aria-valuetext="{Math.round(theta)} degrees"
					onkeydown={key}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={9.5 * u} />
					<circle class="disc" r={5.6 * u} />
				</g>
			</svg>
		</div>

		<div class="panel">
			<p class="title"><span class="letter">(b)</span> Their numbers in the turned axes</p>
			<svg
				{viewBox}
				role="img"
				aria-label={planeDescription}
				{@attach fitText((value) => (w = value))}
			>
				<!-- the axes of the plane, with marks at ±1 and ±2 -->
				<line class="plane-axis" x1={-PLANE} y1="0" x2={PLANE} y2="0" />
				<line class="plane-axis" x1="0" y1={PLANE} x2="0" y2={-PLANE} />
				{#each ticks as t (t)}
					<line class="tick" x1={G * t} y1={-2.5 * w} x2={G * t} y2={2.5 * w} />
					<line class="tick" x1={-2.5 * w} y1={-G * t} x2={2.5 * w} y2={-G * t} />
					{#if !covered({ x: G * t, y: 0 })}
						<text class="num" x={G * t} y={5 * w} dy="0.8em">{tickText(t)}</text>
					{/if}
					{#if !covered({ x: 0, y: -G * t })}
						<text class="num" x={-5 * w} y={-G * t} dy="0.35em" text-anchor="end"
							>{imaginary(t)}</text
						>
					{/if}
				{/each}
				<text class="num name" x={PLANE} y={5 * w} dy="0.8em" text-anchor="end">Re</text>
				<text class="num name" x={5 * w} y={-PLANE} dy="0.7em">Im</text>

				<!-- the circles the two numbers go round -->
				<circle class="path vee" r={G * modulus(ARROW)} />
				{#if !wave}
					<circle class="path ess" r={G * modulus(SHEAR)} />
				{:else if ellipse && phasors}
					<path class="ellipse" d={ellipse} />
					<circle class="path ess" r={G * radii.with} />
					<circle
						class="path ess"
						cx={phasors.centre.x}
						cy={phasors.centre.y}
						r={G * radii.against}
					/>
					<line class="phasor" x1="0" y1="0" x2={phasors.centre.x} y2={phasors.centre.y} />
					<line
						class="phasor"
						x1={phasors.centre.x}
						y1={phasors.centre.y}
						x2={phasors.tip.x}
						y2={phasors.tip.y}
					/>
				{/if}

				<!-- where each has gone since θ = 0 -->
				{#if vTrail}<path class="trail vee" d={vTrail} />{/if}
				{#if sTrail}<path class="trail ess" d={sTrail} />{/if}

				<!-- the numbers at θ = 0, and now -->
				<circle class="first-point vee" cx={vFirst.x} cy={vFirst.y} r={3.2 * w} />
				{#if !wave}
					<circle class="first-point ess" cx={sFirst.x} cy={sFirst.y} r={3.2 * w} />
				{/if}
				{#if Math.hypot(vAt.x - vFirst.x, vAt.y - vFirst.y) > 18 * w}
					{@const p = nameBeside(vFirst, 10 * w)}
					<text class="sym faint" x={p.x} y={p.y} dy="0.35em">v</text>
				{/if}
				{#if !wave && Math.hypot(sAt.x - sFirst.x, sAt.y - sFirst.y) > 18 * w}
					{@const p = nameBeside(sFirst, 10 * w)}
					<text class="sym faint" x={p.x} y={p.y} dy="0.35em">s</text>
				{/if}
				<circle class="point ess" cx={sAt.x} cy={sAt.y} r={4.6 * w} />
				<circle class="point vee" cx={vAt.x} cy={vAt.y} r={4.6 * w} />
				<text class="sym ess" x={sName.x} y={sName.y} dy="0.35em">s′</text>
				<text class="sym vee" x={vName.x} y={vName.y} dy="0.35em">v′</text>
			</svg>
		</div>
	</div>

	<div class="bar">
		<div class="row-controls">
			<Slider
				id="{uid}-theta"
				label="θ, the turn of the axes"
				min={0}
				max={360}
				step={1}
				bind:value={() => Math.round(theta), setTheta}
				readout={thetaText}
				marks={[
					{ at: QUARTER, label: 'a quarter turn: s′ = −s' },
					{ at: HALF, label: 'a half turn: s′ = s, v′ = −v' }
				]}
				marksHint="the ticks mark a quarter turn and a half turn"
			/>
			<div class="choices">
				<Segmented
					label="What the picture holds still"
					options={[
						{ value: 'axes', label: 'Ring still', icon: RotateLeft01Icon },
						{ value: 'ring', label: 'Axes still', icon: RotateRight01Icon }
					]}
					bind:value={view}
				/>
				<Toggle icon={WaveIcon} label="A rotor’s wave" bind:checked={() => wave, setWave} />
			</div>
		</div>
		{#if wave}
			<div class="row-controls">
				<Slider
					id="{uid}-iota"
					label="ι, the inclination"
					min={0}
					max={90}
					step={1}
					bind:value={iota}
					readout="{iota}°"
					marks={[
						{ at: 0, label: 'face on' },
						{ at: 90, label: 'edge on' }
					]}
					marksHint="the ticks mark face on and edge on"
				/>
				<div class="phase">
					<Slider
						id="{uid}-phase"
						label="2Ωu, the wave’s phase"
						min={0}
						max={360}
						step={1}
						bind:value={() => phase, (v) => (pause(), (phase = v))}
						readout="{Math.round(phase)}°"
					/>
					<button
						type="button"
						class="play"
						aria-pressed={playing}
						onclick={() => (playing ? pause() : play())}
					>
						<HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={15} strokeWidth={1.7} />
						{playing ? 'Pause' : 'Play'}
					</button>
				</div>
			</div>
		{/if}
		<div class="actions">
			<button type="button" class="reset" onclick={reset}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Reset
			</button>
			<p class="hint">
				Drag the axes round, or use the slider; on the knob at the end of <Tex math="x'" /> the arrow
				keys turn them by 5°. Reset returns to <Tex math="\theta = 0" />.
			</p>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Turn of the axes</dt>
				<dd><Tex math={`\\theta = ${Math.round(th)}^\\circ`} /></dd>
			</div>
			<div class="row">
				<dt><span class="swatch vee"></span>The arrow</dt>
				<dd>
					<Tex math={vTex} /><span class="also"><Tex math={vPolarTex} /></span>
				</dd>
			</div>
			<div class="row">
				<dt><span class="swatch ess"></span>The shear</dt>
				<dd>
					<Tex math={sTex} /><span class="also"><Tex math={sPolarTex} /></span>
				</dd>
			</div>
			{#if wave}
				<div class="row">
					<dt>The rotor’s wave</dt>
					<dd>
						<Tex math={rotorTex} /><span class="also"><Tex math={circlesTex} /></span><span
							class="also">circular fraction {circularTex}</span
						>
					</dd>
				</div>
			{/if}
			<div class="row">
				<dt>At this turn</dt>
				<dd aria-live="polite">
					{#if standing === 'quarter'}
						<span
							><Tex math="s' = -s" /> and <Tex math={at(th, QUARTER) ? "v' = -iv" : "v' = iv"} />:
							stretch and squeeze have changed places in the new axes.</span
						>
					{:else if standing === 'half'}
						<span
							><Tex math="s' = s" /> but <Tex math="v' = -v" />: the pattern is as it was; the arrow
							points the other way.</span
						>
					{:else if standing === 'none'}
						<span><Tex math="v' = v" /> and <Tex math="s' = s" />.</span>
					{:else}
						<span class="also"
							><Tex math="\arg v" /> has fallen by <Tex math="\theta" />, <Tex math="\arg s" /> by
							<Tex math="2\theta" />.</span
						>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			The ring and the arrow do not move when the axes turn: only their numbers change. With “Axes
			still” the picture is drawn from the turned axes instead, so the ring and the arrow turn by
			<Tex math="-\theta" />. The ring is under the trace-free table with
			<Tex math={'T_{xx} = -T_{yy} = \\tfrac12\\operatorname{Re} s'} /> and
			<Tex math={'T_{xy} = \\tfrac12\\operatorname{Im} s'} />{#if !wave}, here
				<Tex math={'T = \\operatorname{diag}(1, -1)'} /> for <Tex math="s = 2" />{/if}.
			<span class="stretch">Orange</span>: a ball moves outward, a stretch.
			<span class="squeeze">Blue</span>: it moves inward, a squeeze.
			{#if wave}
				In (b) the arrow’s path since <Tex math="\theta = 0" /> is traced.
			{:else}
				In (b) each number’s path since <Tex math="\theta = 0" /> is traced, the shear’s second lap drawn
				a little inside its first.
			{/if}
		</p>
		{#if wave}
			<p class="note">
				The rotor’s shear moves as <Tex math="h_+\cos 2\Omega u + i\,h_\times \sin 2\Omega u" />,
				drawn with the size 2 face on, where <Tex math="h_+ = h_\times = A" />. It is the sum of a
				circle turning anticlockwise, with the rotor, and a smaller one turning clockwise, drawn
				faintly with the line from the origin through the centre of the second. Face on the small
				circle vanishes and <Tex math="s" /> goes round at a steady size; edge on the two are equal and
				it swings along a line. Turning the axes turns the whole ellipse by <Tex math="-2\theta" />.
			</p>
		{/if}
	</div>
</div>

<style>
	.spin-two-dial {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the predictions ---------------------------------------------------------------- */

	.predict {
		padding: 0.75rem 0.9rem 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.steps {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.35rem;
	}

	.tag {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.pick {
		display: inline-flex;
		gap: 3px;
		padding: 2px;
		border-radius: 9px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.pick button {
		min-width: 1.9rem;
		min-height: 1.7rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.78rem/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.pick button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.pick button:focus-visible,
	.next:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.predict p {
		margin: 0;
		text-wrap: pretty;
	}

	.question {
		font: 500 0.9rem/1.45 var(--font-sans);
	}

	.answer {
		margin-top: 0.3rem !important;
		font: 400 0.8rem/1.5 var(--font-sans);
		color: var(--text-faint);
	}

	.answer.shown {
		color: var(--text-dim);
	}

	.answer strong {
		color: var(--text);
		font-weight: 600;
	}

	.next {
		margin-left: 0.3rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	/* --- the panels ------------------------------------------------------------------------ */

	.stage {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.panel {
		min-width: 0;
	}

	.panel p {
		margin: 0;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
	}

	.letter {
		font: italic 500 0.85rem/1 var(--font-serif);
		color: var(--text);
		margin-right: 0.2rem;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.ring {
		/* the open picture lets a finger scroll the page; only the axes, or the ring when the axes are held, take a drag */
		touch-action: pan-y;
		cursor: grab;
	}

	svg.dragging,
	svg.dragging .grip {
		cursor: grabbing;
	}

	.grip {
		cursor: grab;
		touch-action: none;
	}

	/* only the hit areas take a press: a finger on a ball, an arrow or a name falls through to them */
	svg.ring
		:is(.rest, .bent, .ball, .shaft, .head, .arc, .vee-shaft, .vee-head, .first, .turned, .centre) {
		pointer-events: none;
	}

	.hit {
		fill: transparent;
		stroke: transparent;
		stroke-width: calc(18px * var(--u, 1));
	}

	.ring-hit {
		fill: none;
		stroke: transparent;
		stroke-width: calc(26px * var(--u, 1));
	}

	.first {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.turned {
		stroke: color-mix(in srgb, var(--text) 72%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.turned-head {
		fill: color-mix(in srgb, var(--text) 72%, transparent);
	}

	.knob:focus {
		outline: none;
	}

	.disc {
		fill: var(--bg-raised);
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.knob:focus-visible .focus {
		opacity: 1;
	}

	.arc {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.sym {
		fill: var(--text);
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: middle;
		/* a halo of the ground, so that a name reads over a line, a ball or an arrow */
		stroke: color-mix(in srgb, var(--bg-raised) 50%, var(--bg-sunken));
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
		paint-order: stroke;
		pointer-events: none;
	}

	.sym.small {
		font-size: calc(12.5px * var(--u, 1));
		fill: var(--text-dim);
	}

	.sym.faint {
		fill: var(--text-faint);
		font-size: calc(12.5px * var(--u, 1));
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft.still {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.head.still {
		fill: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.shaft.stretch {
		stroke: var(--accent);
	}

	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.head.stretch {
		fill: var(--accent);
	}

	.head.squeeze {
		fill: var(--accent-2);
	}

	.ball {
		stroke: color-mix(in srgb, var(--bg-sunken) 80%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
	}

	.ball-light {
		stop-color: color-mix(in srgb, var(--text) 92%, var(--bg));
	}

	.ball-dark {
		stop-color: color-mix(in srgb, var(--text) 55%, var(--bg));
	}

	.centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* the arrow and its number in the text's colour; the shear's number in the colour of curvature */
	.vee-shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2.4px * var(--u, 1));
		stroke-linecap: round;
	}

	.vee-head {
		fill: var(--text);
	}

	.plane-axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-faint);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-anchor: middle;
	}

	.num.name {
		fill: var(--text-dim);
		font-style: italic;
		font-family: var(--font-serif);
		font-size: calc(11.5px * var(--u, 1));
	}

	.path {
		fill: none;
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.path.vee {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.path.ess {
		stroke: color-mix(in srgb, var(--q-curv) 60%, transparent);
	}

	.ellipse {
		fill: color-mix(in srgb, var(--q-curv) 8%, transparent);
		stroke: color-mix(in srgb, var(--q-curv) 75%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.phasor {
		stroke: color-mix(in srgb, var(--q-curv) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.trail {
		fill: none;
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.trail.vee {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.trail.ess {
		stroke: color-mix(in srgb, var(--q-curv) 50%, transparent);
	}

	.first-point {
		fill: none;
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.first-point.vee {
		stroke: var(--text-dim);
	}

	.first-point.ess {
		stroke: var(--q-curv);
	}

	.point {
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.point.vee {
		fill: var(--text);
	}

	.point.ess {
		fill: var(--q-curv);
	}

	.sym.ess {
		fill: var(--q-curv);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.8rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.row-controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
	}

	.choices {
		display: grid;
		gap: 0.5rem;
	}

	.phase {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.7rem;
		align-items: end;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
	}

	.reset,
	.play {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.78rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.reset :global(svg),
	.play :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.reset:hover,
		.play:hover {
			border-color: var(--accent);
		}
	}

	.reset:focus-visible,
	.play:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
	}

	.readouts {
		padding: 0.75rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem 1fr;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.also {
		color: var(--text-dim);
	}

	.swatch {
		flex: none;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
	}

	.swatch.vee {
		background: var(--text);
	}

	.swatch.ess {
		background: var(--q-curv);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.note .stretch {
		color: var(--accent);
	}

	.note .squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.stage,
		.row-controls {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
