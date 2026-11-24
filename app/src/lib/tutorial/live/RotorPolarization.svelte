<script lang="ts">
	/**
	 * Chapter 5.4's rotor and its polarization, in two linked panels. (a) A rotor, two masses on a rod, turning about
	 * its spin, drawn in light perspective with the camera to its right; the reader tilts it by the inclination ι,
	 * with the knob at the tip of the spin or with a slider. (b) The ring of twelve free balls as the camera sees it,
	 * moved by the rotor's wave at the phase 2Ωu, with the camera's axes, which a knob turns by θ; beside it the
	 * ellipse traced by the point (h′₊(t), h′×(t)) in the turned axes and the spot of the paper's fig:which-way,
	 * magenta for V > 0 and green for V < 0, as deep as |V/I|. The readouts are split into those that change with θ
	 * and those that do not. Everything is exact, from ./rotor-polarization.ts. Three predictions at the top are
	 * answered once the reader has done what each asks. The wave plays, unless the reader prefers less motion; it
	 * then opens paused.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { PauseIcon, PlayIcon, Undo02Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { ring } from './ring-matrix';
	import { modulus } from './spin-two-dial';
	import {
		IOTA,
		IOTA_MARKS,
		NAMES,
		PHASE,
		THETA,
		THETA_MARKS,
		ballMove,
		direction,
		ellipseAxes,
		fixed,
		halfAnswer,
		halfDone,
		helicities,
		inPlane,
		keyed,
		masses,
		onGrid,
		pastAnswer,
		pastDone,
		phaseDifference,
		power,
		project,
		spot,
		stokes,
		strains,
		turnAnswer,
		turnDone,
		turnedAmplitudes,
		valueText,
		type Vec
	} from './rotor-polarization';

	const uid = $props.id();
	const DEG = Math.PI / 180;

	// --- the settings: the inclination ι, the turn θ of the camera's axes and the phase 2Ωu, all degrees -----------
	let iota = $state<number>(IOTA.opening);
	let theta = $state<number>(THETA.opening);
	let phase = $state<number>(PHASE.opening);

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let sawHalf = $state(false);
	let sawPast = $state(false);
	/** The inclination at which the axes were first turned to 45°, for the third answer's numbers. */
	let turnedAt = $state<number | undefined>();
	const revealed = $derived(step === 1 ? sawHalf : step === 2 ? sawPast : turnedAt !== undefined);

	function note() {
		if (halfDone(iota)) sawHalf = true;
		if (pastDone(iota)) sawPast = true;
		if (turnedAt === undefined && turnDone(iota, theta)) turnedAt = iota;
	}

	function setIota(v: number) {
		iota = Math.max(IOTA.min, Math.min(IOTA.max, v));
		note();
	}

	function setTheta(v: number) {
		theta = Math.max(THETA.min, Math.min(THETA.max, v));
		note();
	}

	function setPhase(v: number) {
		playing = false;
		phase = ((v % 360) + 360) % 360;
	}

	function reset() {
		iota = IOTA.opening;
		theta = THETA.opening;
		phase = PHASE.opening;
	}

	// --- the time -------------------------------------------------------------------------------------------------
	/** The phase 2Ωu advances by a whole turn in four seconds while the wave plays. */
	const RATE = 90;
	let playing = $state(true);

	let checked = false;
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			phase = (phase + RATE * dt) % 360;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the drawing, shared ---------------------------------------------------------------------------------------
	const W = 300;
	const H = 212;
	const viewBox = `0 0 ${W} ${H}`;
	/** Panel (a) is cropped to the rotor, the arc of its knob and the camera, with their names. */
	const viewBoxA = `0 30 ${W} 162`;
	const f2 = (n: number) => n.toFixed(2);
	const pathOf = (pts: { x: number; y: number }[], closed = false) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`).join('') + (closed ? 'Z' : '');

	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let w = $state(1);

	/** The shaft and head of an arrow `v` from `from`, starting `gap` beyond it; none if too short to read. */
	function arrow(
		from: { x: number; y: number },
		v: { x: number; y: number },
		gap: number,
		k: number,
		size = 1
	) {
		const len = Math.hypot(v.x, v.y);
		if (len < 1.5 * k) return undefined;
		const head = Math.min(5.4 * k * size, 0.4 * len);
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * gap, y: from.y + uy * gap };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const half = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * k)},${f2(base.y + uy * 0.5 * k)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * half)},${f2(base.y + ux * half)}L${f2(base.x + uy * half)},${f2(base.y - ux * half)}Z`
		};
	}

	/** A head alone, centred on `at`, pointing along `d`. */
	function chevron(at: { x: number; y: number }, d: { x: number; y: number }, size: number) {
		const len = Math.hypot(d.x, d.y);
		if (len < 1e-12) return undefined;
		const ux = d.x / len;
		const uy = d.y / len;
		const tip = { x: at.x + ux * size * 0.5, y: at.y + uy * size * 0.5 };
		const base = { x: at.x - ux * size * 0.5, y: at.y - uy * size * 0.5 };
		const half = size * 0.45;
		return `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * half)},${f2(base.y + ux * half)}L${f2(base.x + uy * half)},${f2(base.y - ux * half)}Z`;
	}

	// --- panel (a): the rotor and the camera, in light perspective ---------------------------------------------------
	/** The rotor's centre on the screen, and drawing units per unit of its world. */
	const CX = 92;
	const CY = 124;
	const S = 58;
	/** The rotor's length, the spin's arrow, the knob's arc and the arc of ι, in units of the world. */
	const ROD = 1.4;
	const SPIN = 1.08;
	const KNOB = 1.3;
	const ANGLE = 0.42;
	const CAMERA: Vec = [2.85, 0, 0];

	const screenA = (p: Vec) => {
		const q = project(p);
		return { x: CX + S * q.x, y: CY + S * q.y, depth: q.depth, scale: q.scale };
	};

	/** The knob's arc, at every tenth of a degree, for the drag. */
	const knobArc = Array.from({ length: 1801 }, (_, i) => screenA(inPlane(i / 10, KNOB)));
	const knobPath = pathOf(knobArc.filter((_, i) => i % 20 === 0));
	const cameraAt = screenA(CAMERA);
	const origin = screenA([0, 0, 0]);
	const sightName = screenA([1.95, 0, 0]);

	const rotor = $derived.by(() => {
		const [p, q] = masses(iota, phase, ROD);
		const spinTip = screenA(inPlane(iota, SPIN));
		const spinMid = screenA(inPlane(iota, SPIN / 2));
		const items = [
			{ kind: 'mass' as const, at: screenA(p), depth: screenA(p).depth },
			{ kind: 'mass' as const, at: screenA(q), depth: screenA(q).depth },
			{ kind: 'spin' as const, at: spinTip, depth: spinMid.depth }
		].sort((a, b) => a.depth - b.depth);
		return { items, spinTip };
	});

	/** The masses' orbit, a circle across the spin, and an arrowhead on its nearest point for the sense of turning. */
	const orbit = $derived.by(() => {
		const pts = Array.from({ length: 97 }, (_, i) => {
			const [p] = masses(iota, (720 * i) / 96, ROD);
			return screenA(p);
		});
		let best = 0;
		for (let i = 1; i < 96; i++) if (pts[i].depth > pts[best].depth) best = i;
		const ahead = pts[best + 1] ?? pts[1];
		const behind = pts[best === 0 ? 95 : best - 1];
		const head = chevron(pts[best], { x: ahead.x - behind.x, y: ahead.y - behind.y }, 7 * u);
		return { d: pathOf(pts, true), head };
	});

	const spinArrow = $derived(
		arrow(origin, { x: rotor.spinTip.x - origin.x, y: rotor.spinTip.y - origin.y }, 0, u, 1.2)
	);
	const knobAt = $derived(screenA(inPlane(iota, KNOB)));
	const spinName = $derived(screenA(inPlane(iota + (iota <= 90 ? 22 : -22), 0.95)));

	/** The arc of ι, from the line to the camera to the spin, and its name. */
	const iotaArc = $derived.by(() => {
		if (iota < 0.5) return undefined;
		const n = Math.max(2, Math.ceil(iota / 3));
		const pts = Array.from({ length: n + 1 }, (_, i) => screenA(inPlane((iota * i) / n, ANGLE)));
		const name = screenA(inPlane(iota / 2, ANGLE + 0.2));
		return { d: pathOf(pts), name, named: iota >= 12 };
	});

	/** A mass's half of the rod, from the centre. */
	const rodFrom = origin;

	// --- panel (b): the ring, its axes, the ellipse and the spot -----------------------------------------------------
	const RX = 98;
	const RY = 110;
	const R = 56;
	const LONG = 1.6;
	const AXIS = 1.5 * R;
	const BALL = $derived(4.2 * w);
	const rest = ring(12);
	const polar = (r: number, deg: number) => ({
		x: RX + r * Math.cos(deg * DEG),
		y: RY - r * Math.sin(deg * DEG)
	});
	const onRing = (p: { x: number; y: number }) => ({ x: RX + R * p.x, y: RY - R * p.y });

	/** The strains in the first axes now, in units of A: the ring itself does not change when the axes turn. */
	const now = $derived(strains(iota, 0, phase));

	const balls = $derived(
		rest.map((p) => {
			const m = ballMove(now.plus, now.cross, p.x, p.y);
			const at = onRing({ x: p.x + m.x, y: p.y + m.y });
			const v = { x: LONG * R * m.x, y: -LONG * R * m.y };
			return {
				at,
				kind: direction(now.plus, now.cross, p.x, p.y),
				arrow: arrow(at, v, BALL + 1.2 * w, w)
			};
		})
	);

	const outline = $derived(
		pathOf(
			ring(96).map((p) => {
				const m = ballMove(now.plus, now.cross, p.x, p.y);
				return onRing({ x: p.x + m.x, y: p.y + m.y });
			}),
			true
		)
	);

	const xEnd = $derived(polar(AXIS, theta));
	const xStart = $derived(polar(-AXIS, theta));
	const yEnd = $derived(polar(AXIS, theta + 90));
	const yStart = $derived(polar(-AXIS, theta + 90));
	const yHead = $derived(
		arrow(
			polar(AXIS - 12 * w, theta + 90),
			{
				x: 12 * w * Math.cos((theta + 90) * DEG),
				y: -12 * w * Math.sin((theta + 90) * DEG)
			},
			0,
			w
		)
	);
	const xName = $derived(polar(AXIS + 13 * w, theta));
	const yName = $derived(polar(AXIS + 10 * w, theta + 90));
	const near = (a: number, b: number) => Math.abs(((((a - b) % 360) + 540) % 360) - 180) < 14;
	const firstAxes = $derived(
		[0, 90].map((d) => ({
			from: polar(-(AXIS - 6), d),
			to: polar(AXIS - 6, d),
			name: polar(AXIS + 2, d),
			label: d === 0 ? '1' : '2',
			named: !near(d, theta) && !near(d, theta + 90) && !near(d, theta + 180)
		}))
	);

	/** The angle θ, an arc from e₁ to e′₁. */
	const thetaArc = $derived.by(() => {
		if (theta < 0.5) return undefined;
		const r = 0.32 * R;
		const a = polar(r, 0);
		const b = polar(r, theta);
		const name = polar(r + 8 * w, theta / 2);
		return {
			d: `M${f2(a.x)},${f2(a.y)}A${r},${r} 0 0 0 ${f2(b.x)},${f2(b.y)}`,
			name,
			named: theta >= 12
		};
	});

	// the inset: the point (h′₊(t), h′×(t)) in the turned axes
	const IX = 253;
	const IY = 55;
	const IBOX = 41;
	const G = 31;
	const inset = (s: { plus: number; cross: number }) => ({
		x: IX + G * s.plus,
		y: IY - G * s.cross
	});
	const ellipse = $derived(
		pathOf(
			Array.from({ length: 97 }, (_, i) => inset(strains(iota, theta, (360 * i) / 96))),
			true
		)
	);
	const point = $derived(inset(strains(iota, theta, phase)));
	const spotNow = $derived(spot(iota));
	/** The sense of the point's turning, an arrowhead at the end of the major axis, x = 0. */
	const senseHead = $derived.by(() => {
		if (spotNow.sense === 'none') return undefined;
		const a = inset(strains(iota, theta, -1));
		const b = inset(strains(iota, theta, 1));
		return chevron(inset(strains(iota, theta, 0)), { x: b.x - a.x, y: b.y - a.y }, 7 * w);
	});

	// the spot
	const SX = 253;
	const SY = 158;
	const SR = 20;
	const spotFill = $derived(
		spotNow.sense === 'none'
			? 'var(--spot-grey)'
			: `color-mix(in srgb, var(--${spotNow.sense}) ${(100 * spotNow.depth).toFixed(1)}%, var(--spot-grey))`
	);

	// --- dragging the two knobs ----------------------------------------------------------------------------------------
	let svgA: SVGSVGElement | undefined;
	let svgB: SVGSVGElement | undefined;
	const holdA = (node: SVGSVGElement) => {
		svgA = node;
		return () => (svgA = undefined);
	};
	const holdB = (node: SVGSVGElement) => {
		svgB = node;
		return () => (svgB = undefined);
	};
	let dragging = $state<'iota' | 'theta' | undefined>();

	function local(svg: SVGSVGElement | undefined, e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	/** A drag lands on a mark within this many CSS pixels of it. */
	const SNAP = 5;

	function dragIota(e: PointerEvent) {
		const p = local(svgA, e);
		if (!p) return;
		let best = 0;
		let d = Infinity;
		for (let i = 0; i < knobArc.length; i++) {
			const q = knobArc[i];
			const dd = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
			if (dd < d) {
				d = dd;
				best = i;
			}
		}
		const deg = best / 10;
		const perDegree = (S * KNOB * DEG) / u;
		const mark = IOTA_MARKS.find((m) => Math.abs(m.at - deg) * perDegree < SNAP);
		setIota(mark ? mark.at : onGrid(deg, IOTA));
	}

	function dragTheta(e: PointerEvent) {
		const p = local(svgB, e);
		if (!p) return;
		let b = Math.atan2(RY - p.y, p.x - RX) / DEG;
		if (b < 0) b = b < -90 ? 180 : 0;
		const perDegree = (AXIS * DEG) / w;
		const mark = THETA_MARKS.find((m) => Math.abs(m.at - b) * perDegree < SNAP);
		setTheta(mark ? mark.at : onGrid(b, THETA));
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (pending && dragging === 'iota') dragIota(pending);
			else if (pending && dragging === 'theta') dragTheta(pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, which: 'iota' | 'theta') {
		if (e.button !== 0) return;
		// a drag is not a click: the knob does not take the focus, so no ring is drawn round it
		e.preventDefault();
		(which === 'iota' ? svgA : svgB)?.setPointerCapture(e.pointerId);
		dragging = which;
		if (which === 'iota') dragIota(e);
		else dragTheta(e);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	/** No frame is left asked for once the figure is gone. */
	const stopping = () => () => {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	};

	// --- the keys, on the knobs and on the sliders ---------------------------------------------------------------------
	function keyIota(e: KeyboardEvent) {
		const v = keyed(iota, e.key, IOTA);
		if (v === undefined) return;
		e.preventDefault();
		setIota(v);
	}

	function keyTheta(e: KeyboardEvent) {
		const v = keyed(theta, e.key, THETA);
		if (v === undefined) return;
		e.preventDefault();
		setTheta(v);
	}

	function keyPhase(e: KeyboardEvent) {
		const v = keyed(phase, e.key, PHASE);
		if (v === undefined) return;
		e.preventDefault();
		setPhase(v);
	}

	/** On a slider, the figure's own steps rather than the browser's. */
	const onRange = (handle: (e: KeyboardEvent) => void) => (e: KeyboardEvent) => {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		handle(e);
	};

	/** A slider's accessible name and its value with its unit, for screen readers. */
	const speak =
		(name: string, text: () => string): Attachment<HTMLElement> =>
		(node) => {
			const input = node.querySelector('input[type="range"]');
			if (!input) return;
			input.setAttribute('aria-label', name);
			input.setAttribute('aria-valuetext', text());
		};

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const HH = '\\htmlClass{q-field}{h}';
	const AA = '\\htmlClass{q-field}{A}';
	const turned = $derived(turnedAmplitudes(iota, theta));
	const sk = $derived(stokes(iota, theta));
	const diff = $derived(phaseDifference(iota, theta));
	const hel = $derived(helicities(iota));
	const axes = $derived(ellipseAxes(iota));

	const iotaText = $derived(`${fixed(iota, 1)}°`);
	const thetaText = $derived(`${fixed(theta, 1)}°`);
	const phaseText = $derived(`${Math.round(phase) % 360}°`);

	const amplitudeTex = $derived(
		`|\\tilde{${HH}}'_+| = ${fixed(modulus(turned.plus))}\\,${AA},\\ |\\tilde{${HH}}'_\\times| = ${fixed(modulus(turned.cross))}\\,${AA}`
	);
	const diffTex = $derived(
		diff === undefined
			? `\\arg(\\tilde{${HH}}'_\\times/\\tilde{${HH}}'_+)\\ \\text{undefined}`
			: `\\arg(\\tilde{${HH}}'_\\times/\\tilde{${HH}}'_+) = ${fixed(diff, 1).replace('−', '-')}^\\circ`
	);
	const quTex = $derived(
		`Q/${AA}^2 = ${fixed(sk.Q).replace('−', '-')},\\ U/${AA}^2 = ${fixed(sk.U).replace('−', '-')}`
	);
	const ivTex = $derived(
		`I/${AA}^2 = ${fixed(sk.I)},\\ V/${AA}^2 = ${fixed(sk.V).replace('−', '-')}`
	);
	const ratioTex = $derived(`V/I = ${fixed(sk.V / sk.I, 3).replace('−', '-')}`);
	const powerTex = $derived(`F(\\iota)/F(0) = ${fixed(power(iota), 3)}`);
	const helTex = $derived(
		`|\\tilde{${HH}}'_{\\rm a}| = ${fixed(hel.a)}\\,${AA},\\ |\\tilde{${HH}}'_{\\rm c}| = ${fixed(Math.abs(hel.c))}\\,${AA}`
	);

	const senseWords = $derived(
		spotNow.sense === 'anticlockwise'
			? 'turns anticlockwise'
			: spotNow.sense === 'clockwise'
				? 'turns clockwise'
				: 'pulses: linear'
	);

	// the answers' numbers, from the same model
	const half = halfAnswer();
	const past = pastAnswer();
	const turnFacts = $derived(turnedAt === undefined ? undefined : turnAnswer(turnedAt));
	const t2 = (v: number) => fixed(v).replace('−', '-');

	// --- the words for screen readers ------------------------------------------------------------------------------------
	const descriptionA = $derived(
		`A rotor, two masses on a rod, turning about its spin, with the camera to its right. The spin makes ${fixed(iota, 1)} degrees with the line to the camera` +
			(iota < 0.05
				? ': face on, the spin points at the camera.'
				: Math.abs(iota - 90) < 0.05
					? ': edge on.'
					: iota > 179.95
						? ': the spin points away from the camera.'
						: '.')
	);
	const descriptionB = $derived(
		`The ring of twelve free balls as the camera sees it, under the rotor's wave at the phase ${Math.round(phase)} degrees, with the camera's axes turned by ${fixed(theta, 1)} degrees. ` +
			`Beside it, the point (h plus, h cross) in the turned axes goes round an ellipse of semi-axes ${fixed(axes.major)} A and ${fixed(axes.minor)} A` +
			(spotNow.sense === 'none' ? ', a line' : `, ${spotNow.sense}`) +
			`. The spot is ${spotNow.sense === 'anticlockwise' ? 'magenta' : spotNow.sense === 'clockwise' ? 'green' : 'grey'}, V over I = ${fixed(sk.V / sk.I, 3).replace('−', 'minus ')}.`
	);
</script>

<div class="rotor-polarization" {@attach stopping}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Tilt the rotor. At what angle has <Tex math="V/I" /> fallen to one half?
			{:else if step === 2}
				Tilt it past edge on, to 120°. What happens to <Tex math="V" />?
			{:else}
				Turn the camera’s axes by 45°. Which readouts change?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>At {fixed(half.tilt, 1)}°: it stays near 1 until the rotor is nearly edge on.</strong
				>
				<Tex math="V/I" /> is {fixed(half.at60, 3)} at 60° and {fixed(half.at75, 3)} at 75°, and at 30°
				it differs from 1 by only <Tex math={'5 \\times 10^{-5}'} />. The clockwise helicity,
				<Tex math={`${AA}\\sin^4(\\iota/2)`} trust />, stays small until the tilt is large; at
				{fixed(half.tilt, 1)}° its power is a third of the anticlockwise one’s, which makes
				<Tex math="V/I = (1 - \tfrac13)/(1 + \tfrac13) = \tfrac12" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong
					>It turns negative, <Tex math={`V/${AA}^2 = ${t2(past.V)}`} trust /> and <Tex
						math={`V/I = ${fixed(past.ratio, 3).replace('−', '-')}`}
					/>: the pattern turns clockwise, as the rotor now appears to.</strong
				>
				The spin points away from the camera, so <Tex
					math={`${HH}_\\times = ${AA}\\cos 120^\\circ = ${t2(past.cross)}\\,${AA}`}
					trust
				/> and the point in the inset goes round the other way; the spot turns green. Its size is as at
				60°, and so is the power, {fixed(past.power, 3)} of face on: the wave is the same toward
				<Tex math="\iota" /> and <Tex math="180^\circ - \iota" /> but for its sense.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && turnFacts}
				<strong
					>The amplitudes in the turned axes mix, and <Tex math="Q" /> changes sign; <Tex
						math="I"
					/>,
					<Tex math="V" />, <Tex math="V/I" /> and the power stay.</strong
				>
				At <Tex math={`\\iota = ${fixed(turnFacts.iota, 1)}^\\circ`} /> a turn of 45° swaps the two amplitudes,
				<Tex math={`|\\tilde{${HH}}'_+|`} trust /> from {fixed(turnFacts.plus[0])} to {fixed(
					turnFacts.plus[1]
				)} and <Tex math={`|\\tilde{${HH}}'_\\times|`} trust /> from {fixed(turnFacts.cross[0])} to {fixed(
					turnFacts.cross[1]
				)}, and <Tex math={`Q/${AA}^2`} trust /> goes from {fixed(turnFacts.Q[0])} to {fixed(
					turnFacts.Q[1]
				)}, by <Tex math={'e^{-4i\\theta} = e^{-i\\pi} = -1'} />. The helicities only change their
				phases, so <Tex math={`I/${AA}^2 = ${fixed(turnFacts.I)}`} trust />, <Tex
					math={`V/${AA}^2 = ${t2(turnFacts.V)}`}
					trust
				/>, <Tex math={`V/I = ${fixed(turnFacts.ratio, 3).replace('−', '-')}`} /> and the power, {fixed(
					turnFacts.power,
					3
				)}, do not move. At 90° everything is as at 0°.
			{:else if step === 1}
				The answer appears when the rotor is tilted to where <Tex math="V/I" /> reads one half.
			{:else if step === 2}
				The answer appears when the rotor stands at 120°.
			{:else}
				The answer appears when the axes stand at 45°, with the rotor neither face on nor spin away.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel rotor-panel">
			<p class="title"><span class="letter">(a)</span> The rotor and the camera</p>
			<svg
				viewBox={viewBoxA}
				role="group"
				aria-label={descriptionA}
				class={{ dragging: dragging === 'iota' }}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdA}
				{@attach fitText((value) => (u = value))}
				{@attach clock}
			>
				<defs>
					<radialGradient id="{uid}-mass" cx="0.36" cy="0.32" r="0.75">
						<stop offset="0" class="mass-light" />
						<stop offset="1" class="mass-dark" />
					</radialGradient>
				</defs>

				<!-- the line from the rotor to the camera, and the camera -->
				<line class="sight" x1={origin.x} y1={origin.y} x2={cameraAt.x} y2={cameraAt.y} />
				<text class="sym faint" x={sightName.x} y={sightName.y - 7 * u}>n̂</text>
				<rect
					class="camera"
					x={cameraAt.x - 8 * u}
					y={cameraAt.y - 8 * u}
					width={16 * u}
					height={16 * u}
					rx={1.5 * u}
				/>
				<text class="words" x={cameraAt.x} y={cameraAt.y + 21 * u}>camera</text>

				<!-- the arc the spin's knob moves on, from face on to spin away -->
				<path class="track" d={knobPath} />

				<!-- the angle ι between the line to the camera and the spin -->
				{#if iotaArc}
					<path class="arc" d={iotaArc.d} />
					{#if iotaArc.named}
						<text class="sym small" x={iotaArc.name.x} y={iotaArc.name.y} dy="0.35em">ι</text>
					{/if}
				{/if}

				<!-- the masses' orbit, then the masses, the rod and the spin from the farthest to the nearest -->
				<path class="orbit" d={orbit.d} />
				{#if orbit.head}<path class="orbit-head" d={orbit.head} />{/if}
				{#each rotor.items as item, i (i)}
					{#if item.kind === 'mass'}
						<line class="rod" x1={rodFrom.x} y1={rodFrom.y} x2={item.at.x} y2={item.at.y} />
						<circle
							class="mass"
							cx={item.at.x}
							cy={item.at.y}
							r={0.12 * S * item.at.scale}
							fill="url(#{uid}-mass)"
						/>
					{:else if spinArrow}
						<path class="spin-shaft" d={spinArrow.shaft} />
						<path class="spin-head" d={spinArrow.head} />
					{/if}
				{/each}
				<circle class="centre" cx={origin.x} cy={origin.y} r={1.6 * u} />
				<text class="sym small" x={spinName.x} y={spinName.y} dy="0.35em">spin</text>

				<!-- the knob that tilts the rotor -->
				<path
					class="grip track-hit"
					d={knobPath}
					role="presentation"
					onpointerdown={(e) => grab(e, 'iota')}
				/>
				<g
					class="grip knob"
					transform="translate({f2(knobAt.x)} {f2(knobAt.y)})"
					role="slider"
					tabindex="0"
					aria-label={NAMES.iota}
					aria-valuemin={IOTA.min}
					aria-valuemax={IOTA.max}
					aria-valuenow={Number(iota.toFixed(1))}
					aria-valuetext={valueText(iota, 1)}
					onpointerdown={(e) => grab(e, 'iota')}
					onkeydown={keyIota}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={9.5 * u} />
					<circle class="disc" r={5.6 * u} />
				</g>
			</svg>
		</div>

		<div class="panel">
			<p class="title"><span class="letter">(b)</span> The ring, as the camera sees it</p>
			<svg
				{viewBox}
				role="group"
				aria-label={descriptionB}
				class={{ dragging: dragging === 'theta' }}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdB}
				{@attach fitText((value) => (w = value))}
			>
				<defs>
					<radialGradient id="{uid}-ball" cx="0.36" cy="0.32" r="0.75">
						<stop offset="0" class="ball-light" />
						<stop offset="1" class="ball-dark" />
					</radialGradient>
				</defs>

				<!-- the first axes, e₁ and e₂ -->
				{#each firstAxes as a (a.label)}
					<line class="first" x1={a.from.x} y1={a.from.y} x2={a.to.x} y2={a.to.y} />
					{#if a.named}
						<text class="sym faint" x={a.name.x} y={a.name.y} dy="0.35em"
							>e<tspan class="sub" dy="0.25em">{a.label}</tspan></text
						>
					{/if}
				{/each}

				<!-- the ring at rest, as the wave moves it, and the balls with their arrows -->
				<circle class="rest" cx={RX} cy={RY} r={R} />
				<path class="bent" d={outline} />
				{#each balls as b, i (i)}
					{#if b.arrow && b.kind !== 'still'}
						<path class={['shaft', b.kind]} d={b.arrow.shaft} />
						<path class={['head', b.kind]} d={b.arrow.head} />
					{/if}
					<circle class="ball" cx={b.at.x} cy={b.at.y} r={BALL} fill="url(#{uid}-ball)" />
				{/each}
				<circle class="centre" cx={RX} cy={RY} r={1.6 * w} />

				<!-- the angle θ from e₁ to e′₁ -->
				{#if thetaArc}
					<path class="arc" d={thetaArc.d} />
					{#if thetaArc.named}
						<text class="sym small" x={thetaArc.name.x} y={thetaArc.name.y} dy="0.35em">θ</text>
					{/if}
				{/if}

				<!-- the camera's axes, turned by θ, with the knob that turns them -->
				<g class="grip axes" role="presentation" onpointerdown={(e) => grab(e, 'theta')}>
					<line class="hit" x1={xStart.x} y1={xStart.y} x2={xEnd.x} y2={xEnd.y} />
					<line class="hit" x1={yStart.x} y1={yStart.y} x2={yEnd.x} y2={yEnd.y} />
					<line class="turned" x1={xStart.x} y1={xStart.y} x2={xEnd.x} y2={xEnd.y} />
					<line class="turned" x1={yStart.x} y1={yStart.y} x2={yEnd.x} y2={yEnd.y} />
					{#if yHead}<path class="turned-head" d={yHead.head} />{/if}
				</g>
				<text class="sym" x={xName.x} y={xName.y} dy="0.35em"
					>e′<tspan class="sub" dy="0.25em">1</tspan></text
				>
				<text class="sym" x={yName.x} y={yName.y} dy="0.35em"
					>e′<tspan class="sub" dy="0.25em">2</tspan></text
				>
				<g
					class="grip knob"
					transform="translate({f2(xEnd.x)} {f2(xEnd.y)})"
					role="slider"
					tabindex="0"
					aria-label={NAMES.theta}
					aria-valuemin={THETA.min}
					aria-valuemax={THETA.max}
					aria-valuenow={Number(theta.toFixed(1))}
					aria-valuetext={valueText(theta, 1)}
					onpointerdown={(e) => grab(e, 'theta')}
					onkeydown={keyTheta}
				>
					<circle class="hit" r={14 * w} />
					<circle class="focus" r={9.5 * w} />
					<circle class="disc" r={5.6 * w} />
				</g>

				<!-- the inset: the point (h′₊(t), h′×(t)) in the turned axes -->
				<rect class="inset" x={IX - IBOX} y={IY - IBOX} width={2 * IBOX} height={2 * IBOX} rx={5} />
				<line class="plane-axis" x1={IX - IBOX + 4} y1={IY} x2={IX + IBOX - 4} y2={IY} />
				<line class="plane-axis" x1={IX} y1={IY + IBOX - 4} x2={IX} y2={IY - IBOX + 4} />
				{#each [-1, 1] as t (t)}
					<line class="tick" x1={IX + G * t} y1={IY - 2 * w} x2={IX + G * t} y2={IY + 2 * w} />
					<line class="tick" x1={IX - 2 * w} y1={IY - G * t} x2={IX + 2 * w} y2={IY - G * t} />
				{/each}
				<path class={['ellipse', spotNow.sense]} d={ellipse} />
				{#if senseHead}<path class={['sense-head', spotNow.sense]} d={senseHead} />{/if}
				<circle class="point" cx={point.x} cy={point.y} r={3.2 * w} />
				<text class="words" x={IX} y={IY + IBOX + 13 * w}
					>(<tspan class="it">h</tspan>′<tspan class="sub" dy="0.25em">+</tspan><tspan dy="-0.25em"
						>,
					</tspan><tspan class="it">h</tspan>′<tspan class="sub" dy="0.25em">×</tspan><tspan
						dy="-0.25em">)</tspan
					></text
				>

				<!-- the spot, coloured as in the paper's fig:which-way -->
				<circle class={['spot', spotNow.sense]} cx={SX} cy={SY} r={SR} style:fill={spotFill} />
				<text class="words" x={SX} y={SY + SR + 13 * w}
					><tspan class="it">V</tspan>/<tspan class="it">I</tspan> = {fixed(sk.V / sk.I, 3)}</text
				>
				<text class="words dim" x={SX} y={SY + SR + 26 * w}>{senseWords}</text>
			</svg>
		</div>
	</div>

	<div class="bar">
		<div class="row-controls">
			<div
				onkeydowncapture={onRange(keyIota)}
				role="presentation"
				{@attach speak(NAMES.iota, () => valueText(iota, 1))}
			>
				<Slider
					id="{uid}-iota"
					label="Inclination ι"
					min={IOTA.min}
					max={IOTA.max}
					step={IOTA.step}
					bind:value={() => iota, setIota}
					readout={iotaText}
					marks={IOTA_MARKS}
					marksHint="the ticks mark face on, 60°, V/I = ½, edge on, 120° and spin away"
				/>
			</div>
			<div
				onkeydowncapture={onRange(keyTheta)}
				role="presentation"
				{@attach speak(NAMES.theta, () => valueText(theta, 1))}
			>
				<Slider
					id="{uid}-theta"
					label="Turn of the camera’s axes θ"
					min={THETA.min}
					max={THETA.max}
					step={THETA.step}
					bind:value={() => theta, setTheta}
					readout={thetaText}
					marks={THETA_MARKS}
					marksHint="the ticks mark 22.5°, 45° and 90°"
				/>
			</div>
		</div>
		<div class="phase">
			<button
				type="button"
				class="play"
				aria-label={playing ? NAMES.pause : NAMES.play}
				aria-pressed={playing}
				onclick={() => (playing = !playing)}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<div
				class="phase-slider"
				onkeydowncapture={onRange(keyPhase)}
				role="presentation"
				{@attach speak(NAMES.phase, () => valueText(Math.round(phase) % 360, 0))}
			>
				<Slider
					id="{uid}-phase"
					label="Wave phase 2Ωu"
					min={PHASE.min}
					max={PHASE.max}
					step={PHASE.step}
					bind:value={() => Math.round(phase) % 360, setPhase}
					readout={phaseText}
				/>
			</div>
		</div>
		<div class="actions">
			<button type="button" class="reset" onclick={reset}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Reset
			</button>
			<p class="hint">
				Drag the knob at the tip of the spin to tilt the rotor, and the knob at the end of <Tex
					math="e'_1"
				/> to turn the camera’s axes, or use the sliders. On a knob or a slider the arrow keys move 1°;
				Page Up and Page Down move <Tex math="\iota" /> by 10° and <Tex math="\theta" /> by 5°.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="group">Change with <Tex math="\theta" /></p>
		<dl>
			<div class="row">
				<dt>In the turned axes</dt>
				<dd>
					<Tex math={amplitudeTex} trust /><span class="also"><Tex math={diffTex} trust /></span>
				</dd>
			</div>
			<div class="row">
				<dt>The linear part</dt>
				<dd>
					<Tex math={quTex} trust /><span class="also"
						><Tex math={'Q + iU = e^{-4i\\theta}(h_+^2 - h_\\times^2)'} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="group">Do not change with <Tex math="\theta" /></p>
		<dl>
			<div class="row">
				<dt>Strength and turning</dt>
				<dd>
					<Tex math={ivTex} trust /><Tex math={ratioTex} /><span
						class={['swatch', spotNow.sense]}
						style:background={spotFill}
					></span>
				</dd>
			</div>
			<div class="row">
				<dt>Power</dt>
				<dd>
					<Tex math={powerTex} /><span class="also">relative to face on, at the same distance</span>
				</dd>
			</div>
			<div class="row">
				<dt>Helicities</dt>
				<dd>
					<Tex math={helTex} trust /><span class="also"
						><Tex math={`${AA}\\cos^4\\tfrac\\iota2,\\ ${AA}\\sin^4\\tfrac\\iota2`} trust /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The rotor turns about its spin, which makes the angle <Tex math="\iota" /> with the line
			<Tex math="\hat n" /> to the camera; it is schematic, its masses in the colour of matter. The ring
			is drawn in the camera’s first axes, <Tex math="\mathbf e_1" /> along the spin’s shadow and <Tex
				math="\mathbf e_2"
			/> a quarter turn anticlockwise, under <Tex
				math={`${HH}_+(t) = ${HH}_+\\cos 2\\Omega u`}
				trust
			/> and <Tex math={`${HH}_\\times(t) = ${HH}_\\times\\sin 2\\Omega u`} trust />, with the
			strain exaggerated to 0.3 face on. Turning the axes does not move a ball: it changes only the
			numbers read in them, and turns the inset’s ellipse, of semi-axes {fixed(axes.major)} and {fixed(
				axes.minor
			)} in units of <Tex math={AA} trust />, by <Tex math="-2\theta" />.
			<span class="stretch">Orange</span>: a ball has moved outward.
			<span class="squeeze">Blue</span>: it has moved inward. The spot is magenta when
			<Tex math="V > 0" />, green when <Tex math="V < 0" />, and grey when <Tex math="V = 0" />,
			coloured as deep as <Tex math="|V/I|" />. The phase runs a whole cycle in four seconds; the
			figure opens paused if you prefer less motion.
		</p>
	</div>
</div>

<style>
	.rotor-polarization {
		/* the sense of turning in the colours of the paper's fig:which-way and fig:quadrupole */
		--anticlockwise: #ef6ac4;
		--clockwise: #5fcf75;
		--spot-grey: color-mix(in srgb, var(--text) 30%, var(--bg));
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	:global(:root[data-theme='light']) .rotor-polarization {
		--anticlockwise: #c2255c;
		--clockwise: #2f9e44;
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .rotor-polarization {
			--anticlockwise: #c2255c;
			--clockwise: #2f9e44;
		}
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
	.next:focus-visible,
	.play:focus-visible,
	.reset:focus-visible {
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
		display: flex;
		flex-direction: column;
	}

	/* the rotor's drawing is the shorter: beside the ring it stands in the middle of the height they share */
	.rotor-panel svg {
		margin-block: auto;
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
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open picture lets a finger scroll the page; only the knobs, the arc and the axes take a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .grip {
		cursor: grabbing;
	}

	.grip {
		cursor: grab;
		touch-action: none;
	}

	/* only the hit areas take a press: a finger on a ball, an arrow or a name falls through to the page */
	svg
		:is(
			.sight,
			.camera,
			.track,
			.arc,
			.orbit,
			.orbit-head,
			.rod,
			.mass,
			.spin-shaft,
			.spin-head,
			.centre,
			.rest,
			.bent,
			.ball,
			.shaft,
			.head,
			.first,
			.turned,
			.turned-head,
			.inset,
			.plane-axis,
			.tick,
			.ellipse,
			.sense-head,
			.point,
			.spot
		) {
		pointer-events: none;
	}

	.hit {
		fill: transparent;
		stroke: transparent;
		stroke-width: calc(18px * var(--u, 1));
	}

	.track-hit {
		fill: none;
		stroke: transparent;
		stroke-width: calc(22px * var(--u, 1));
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
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

	.sub {
		font-size: 0.72em;
		font-style: normal;
	}

	.words {
		fill: var(--text-dim);
		font: 500 calc(11px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-anchor: middle;
		pointer-events: none;
	}

	.words.dim {
		fill: var(--text-faint);
		font-weight: 400;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	/* panel (a) */
	.sight {
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.camera {
		fill: var(--bg-raised);
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.track {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.arc {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.orbit {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.orbit-head {
		fill: color-mix(in srgb, var(--q-matter) 80%, transparent);
	}

	.rod {
		stroke: color-mix(in srgb, var(--text) 75%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.mass {
		stroke: color-mix(in srgb, var(--bg-sunken) 70%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
	}

	.mass-light {
		stop-color: color-mix(in srgb, var(--q-matter) 70%, white);
	}

	.mass-dark {
		stop-color: color-mix(in srgb, var(--q-matter) 78%, black);
	}

	.spin-shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.spin-head {
		fill: var(--text);
	}

	.centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
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

	/* panel (b) */
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

	.inset {
		fill: color-mix(in srgb, var(--bg) 55%, transparent);
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.plane-axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-faint);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		text-anchor: middle;
		pointer-events: none;
	}

	.num.name {
		fill: var(--text-dim);
		font-style: italic;
		font-family: var(--font-serif);
		font-size: calc(11.5px * var(--u, 1));
	}

	.ellipse {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ellipse.anticlockwise {
		stroke: var(--anticlockwise);
	}

	.ellipse.clockwise {
		stroke: var(--clockwise);
	}

	.sense-head.anticlockwise {
		fill: var(--anticlockwise);
	}

	.sense-head.clockwise {
		fill: var(--clockwise);
	}

	.point {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.spot {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
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

	.phase {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.7rem;
		align-items: center;
	}

	.phase-slider {
		min-width: 0;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
	}

	.play,
	.reset {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.78rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play {
		width: 2.2rem;
		padding: 0;
	}

	.reset {
		min-height: 2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
	}

	.play :global(svg),
	.reset :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover,
		.reset:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.readouts {
		padding: 0.75rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.group {
		margin: 0 0 0.3rem;
		font: italic 500 0.85rem/1.3 var(--font-serif);
		color: var(--text);
	}

	.group:not(:first-child) {
		margin-top: 0.7rem;
	}

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	/* words keep their own spacing: the tabular figures would widen a hyphen */
	.also {
		color: var(--text-dim);
		font-variant-numeric: normal;
	}

	.swatch {
		flex: none;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 35%, transparent);
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

		.stage {
			padding: 0.6rem 0.6rem 0.7rem;
		}

		.hint {
			flex: 1 1 100%;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.reset {
			transition: none;
		}
	}
</style>
