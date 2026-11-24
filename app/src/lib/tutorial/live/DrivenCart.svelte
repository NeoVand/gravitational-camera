<script lang="ts">
	/**
	 * Chapter 4.1's driven cart: 1.7's cart (2 kg on a spring of 50 N/m, ω₀ = 5 s⁻¹) with the friction −mΓq̇, pushed
	 * by a hand with F = F₀ cos ωt, F₀ = 0.1 N. Left, the cart on its track, moving as the exact steady state plus the
	 * exact ring-down from where it started, and under it the complex plane with the phasors of the push and of the
	 * swing, turning together as e^{−iωt}; the plane shares the track's q, so the real part of the swing's phasor
	 * stands under the steady state. Right, k|χ| on a scale of powers of ten and the line ω Im χ against ω from 0 to
	 * 15 s⁻¹, with the drive marked. A strike takes the hand away, and the cart rings down. The numbers come from
	 * ./driven-cart.ts. Three predictions at the top are answered once the reader has done what they ask. The motion
	 * is shown at half speed; under reduced motion it waits for the play button.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DashboardSpeed01Icon,
		HandGrabIcon,
		Hammer01Icon,
		PauseIcon,
		PlayIcon,
		Undo02Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import { tickStep, viewSpan } from './phase-space';
	import {
		DRIVE_MOST,
		DRIVE_STEP,
		FORCE,
		OMEGA,
		OPENING,
		QUALITIES,
		STATIC,
		carryOn,
		chi,
		damping,
		dampedFrequency,
		fallTime,
		force,
		freeReach,
		fromRest,
		gain,
		halfPower,
		handAngle,
		line,
		lineArea,
		lineAxis,
		lineHeight,
		meanPower,
		modulusPeak,
		motion,
		perSwing,
		reach,
		ringPhasor,
		samples,
		steady,
		type Segment
	} from './driven-cart';

	const uid = $props.id();

	/** The motion is shown this many times slower than it is. */
	const SLOW = 2;
	/** The share of the swing the third prediction asks about. */
	const SHARE = 0.6;

	// --- the settings ---------------------------------------------------------------------------------------------
	let qIndex = $state(QUALITIES.indexOf(OPENING.Q));
	let omega = $state(OPENING.omega);
	const Q = $derived(QUALITIES[qIndex]);
	const Gamma = $derived(damping(Q));

	// --- the motion: one segment of fixed settings at a time, each a closed form -----------------------------------
	/** The cart's own time, s. */
	let time = $state(0);
	const opening = fromRest(damping(OPENING.Q), OPENING.omega);
	let seg = $state.raw<Segment>(opening);
	const pushing = $derived(seg.push);

	/** The last strike, while the settings stay as they were: when, the swing it left, and at what Q and ω. */
	type Strike = { t: number; swing: number; Q: number; Gamma: number; omega: number };
	let strike = $state.raw<Strike | undefined>();

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let found = $state(false);
	let halved = $state(false);
	let counted = $state<Strike | undefined>();
	const revealed = $derived(step === 1 ? found : step === 2 ? halved : counted !== undefined);
	/** A strike counts for the third prediction at Q = 50 and at resonance, within 0.2 s⁻¹. */
	const COUNT_Q = 50;
	const countable = (s: Strike) => Math.abs(s.omega - OMEGA) <= 0.2 + 1e-9 && s.Q === COUNT_Q;

	function noteSettings() {
		if (step === 1 && Q === 10 && Math.abs(omega - OMEGA) < 1e-9) found = true;
		if (step === 2 && Q === 5) halved = true;
	}

	// --- the actions ------------------------------------------------------------------------------------------------
	function setQ(i: number) {
		const next = Math.max(0, Math.min(QUALITIES.length - 1, Math.round(i)));
		if (next === qIndex) return;
		seg = carryOn(seg, time, { Gamma: damping(QUALITIES[next]) });
		qIndex = next;
		lineTop.set(lineAxis(damping(QUALITIES[next])).top, {
			duration: prefersReducedMotion.current ? 0 : 450
		});
		strike = undefined;
		noteSettings();
		refit();
	}

	function setOmega(v: number) {
		const next = Number(
			(Math.round(Math.max(0, Math.min(DRIVE_MOST, v)) / DRIVE_STEP) * DRIVE_STEP).toFixed(1)
		);
		if (next === omega) return;
		seg = carryOn(seg, time, { omega: next });
		omega = next;
		noteSettings();
		refit();
	}

	function doStrike() {
		if (!seg.push) {
			seg = carryOn(seg, time, { push: true });
			strike = undefined;
			refit();
			return;
		}
		seg = carryOn(seg, time, { push: false });
		strike = { t: time, swing: freeReach(Gamma, seg.q0, seg.v0), Q, Gamma, omega };
		refit(true);
	}

	function startAgain() {
		seg = fromRest(Gamma, omega, time);
		strike = undefined;
		refit();
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);

	function togglePlay() {
		playing = !playing;
	}

	/** Whether the swing has fallen to the share asked about since the strike. */
	const fallen = (s: Strike, t: number) => t - s.t >= fallTime(s.Gamma, SHARE);

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
		let frame = 0;
		let lastFrame: number | undefined;
		const tick = (t: number) => {
			const dt = lastFrame === undefined ? 0 : Math.min(0.1, (t - lastFrame) / 1000);
			lastFrame = t;
			time += dt / SLOW;
			if (step === 3 && !counted && strike && countable(strike) && fallen(strike, time))
				counted = strike;
			refit();
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	};

	// --- the view: the track's half-width in metres, fitted to how far the cart can still go -------------------------
	const fit = (g: Segment, t: number) => viewSpan(Math.max(1e-6, 1.15 * reach(g, t)));
	let target = fit(opening, 0);
	const view = new Tween(target, { duration: 450, easing: cubicOut });
	/**
	 * Refits the view: while the hand pushes, both ways; at a strike, to the swing it leaves; and after it only wider,
	 * so that the marks of the swing struck and of 60% of it stay put.
	 */
	function refit(struck = false) {
		const next = fit(seg, time);
		if (next === target || (!seg.push && !struck && next < target)) return;
		target = next;
		view.set(next, { duration: prefersReducedMotion.current ? 0 : 450 });
	}

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };
	const WALL = 12;
	const CART_W = 40;
	const ROD = 9;
	const HAND = 20;
	/** Room the spring keeps at its shortest, drawing units. */
	const COILED = 26;

	const layout = $derived.by(() => {
		const narrow = phone.current;
		const W = narrow ? 360 : 640;
		const LW = narrow ? W : 296;
		// the cart's centre where the spring is relaxed: as far from the wall's side as from the hand's
		const leftRoom = WALL + COILED + CART_W / 2;
		const rightRoom = CART_W / 2 + ROD + HAND + 4;
		const cx = (LW + leftRoom - rightRoom) / 2;
		const reachPx = cx - leftRoom;
		const track: Box = { x: 0, y: 22, w: LW, h: 96 };
		const planeHalf = Math.round(reachPx / 1.15 + 14);
		const plane: Box = { x: 0, y: track.y + track.h + 2, w: LW, h: 2 * planeHalf };
		// the plane's name goes under it, where the guide up from the swing's phasor never runs
		const leftBottom = plane.y + plane.h + 22;
		const RX = narrow ? 0 : LW + 32;
		const RW = W - RX;
		const top = narrow ? leftBottom + 34 : 22;
		const total = narrow ? 300 : leftBottom - top;
		const h1 = Math.round((total - 24 - 20) * 0.48);
		const p1: Box = { x: RX, y: top, w: RW, h: h1 };
		const p2: Box = { x: RX, y: top + h1 + 24, w: RW, h: total - h1 - 24 };
		const H = (narrow ? p2.y + p2.h : Math.max(leftBottom, p2.y + p2.h)) + 2;
		return { W, H, LW, cx, reachPx, track, plane, p1, p2 };
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	// --- the track ----------------------------------------------------------------------------------------------------
	/** Drawing units per metre along q, on the track and in the plane alike. */
	const perMetre = $derived(layout.reachPx / view.current);
	/** Drawing units per newton: the push F₀ is drawn 0.6 times as long as the track's reach. */
	const perNewton = $derived((0.6 * layout.reachPx) / FORCE);

	const now = $derived(motion(seg, time));
	const push = $derived(force(seg, time));
	const theta = $derived(handAngle(seg, time));
	const rail = $derived(layout.track.y + 66);
	const cartX = $derived(layout.cx + now.q * perMetre);

	/** The shaft and head of an arrow from `from` to `to`, if it is long enough to draw. */
	function arrow(from: { x: number; y: number }, to: { x: number; y: number }, head = 6) {
		const len = Math.hypot(to.x - from.x, to.y - from.y);
		if (len < 3 * u) return undefined;
		const ux = (to.x - from.x) / len;
		const uy = (to.y - from.y) / len;
		const h = Math.min(head * u, 0.45 * len);
		const base = { x: to.x - ux * h, y: to.y - uy * h };
		const w = h / 2.2;
		return {
			shaft: `M${f2(from.x)},${f2(from.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(to.x)},${f2(to.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	const spring = $derived.by(() => {
		const y = rail - 15.5;
		const end = cartX - CART_W / 2;
		const coils = 11;
		const lead = 5;
		const run = Math.max(4, end - WALL - 2 * lead);
		let d = `M${WALL},${f2(y)}h${lead}`;
		for (let i = 0; i < coils; i++) {
			const a = WALL + lead + (run * (i + 0.5)) / coils;
			d += `L${f2(a)},${f2(y + (i % 2 ? 4.5 : -4.5))}`;
		}
		return d + `L${f2(end - lead)},${f2(y)}L${f2(end)},${f2(y)}`;
	});

	/** The hand's push, drawn over the cart from its centre, as long as the force's phasor's real part in the plane. */
	const pushArrow = $derived(
		pushing
			? arrow({ x: cartX, y: rail - 34 }, { x: cartX + push * perNewton, y: rail - 34 })
			: undefined
	);

	const HAND_PATHS = HandGrabIcon.map(([, attrs]) => (attrs as { d: string }).d);

	/** The track's ticks in millimetres, a step apart that leaves room for the labels. */
	const qTicks = $derived.by(() => {
		let s = tickStep(view.current, 2);
		while (s * perMetre < 34 * u) s = tickStep(2.2 * s, 1);
		const most = Math.floor(view.current / s + 1e-9);
		const values: number[] = [];
		for (let i = -most; i <= most; i++) values.push(Number((i * s).toFixed(12)));
		return { step: s, values };
	});
	const mm = (v: number, s: number) => {
		const digits = Math.max(0, -Math.floor(Math.log10(s * 1000) + 1e-9));
		const t = Math.abs(v * 1000).toFixed(digits);
		return `${v < 0 ? '−' : ''}${Number(t)}`;
	};

	/** After a strike: where the cart's swing started, and the share asked about, on the track. */
	const strikeMarks = $derived(
		strike && dampedFrequency(strike.Gamma) > 0
			? { full: strike.swing * perMetre, share: SHARE * strike.swing * perMetre }
			: undefined
	);

	// --- the plane ----------------------------------------------------------------------------------------------------
	const pcy = $derived(layout.plane.y + layout.plane.h / 2);
	/** A point of the plane, from a complex number in metres or newtons and its scale. */
	const at = (re: number, im: number, per: number) => ({
		x: layout.cx + re * per,
		y: pcy - im * per
	});
	const response = $derived(chi(omega, Gamma));

	/** The phasors as they turn: the push F̃ e^{−iθ} and the swing q̃ e^{−iθ}, or the ring-down's after a strike. */
	const phasors = $derived.by(() => {
		if (pushing) {
			const A = FORCE * response.abs;
			const qa = response.lag - theta;
			return {
				force: { re: FORCE * Math.cos(-theta), im: FORCE * Math.sin(-theta) },
				swing: { re: A * Math.cos(qa), im: A * Math.sin(qa) },
				forceAngle: -theta,
				swingAngle: qa
			};
		}
		const r = ringPhasor(seg.Gamma, seg.q0, seg.v0, time - seg.t0);
		if (!r) return undefined;
		const a = Math.atan2(r.im, r.re) - r.angle;
		const len = Math.hypot(r.re, r.im);
		return { swing: { re: len * Math.cos(a), im: len * Math.sin(a) }, swingAngle: a };
	});

	const origin = $derived({ x: layout.cx, y: pcy });
	const forceTip = $derived(
		phasors?.force ? at(phasors.force.re, phasors.force.im, perNewton) : undefined
	);
	const swingTip = $derived(phasors ? at(phasors.swing.re, phasors.swing.im, perMetre) : undefined);
	const forceArrow = $derived(forceTip ? arrow(origin, forceTip, 7) : undefined);
	const swingArrow = $derived(swingTip ? arrow(origin, swingTip, 7) : undefined);

	/** A label just past an arrow's tip, pushed to one side of it: the force's to its right, the swing's to its left. */
	function tipLabel(tip: { x: number; y: number }, angle: number, side: 1 | -1) {
		const ux = Math.cos(angle);
		const uy = -Math.sin(angle);
		const along = 8 * u;
		const across = 8 * u * side;
		return { x: tip.x + ux * along - uy * across, y: tip.y + uy * along + ux * across };
	}
	const forceLabel = $derived(
		forceTip && phasors?.forceAngle !== undefined
			? tipLabel(forceTip, phasors.forceAngle, 1)
			: undefined
	);
	const swingLabel = $derived(
		swingTip && phasors && Math.hypot(swingTip.x - origin.x, swingTip.y - origin.y) > 10 * u
			? tipLabel(swingTip, phasors.swingAngle, -1)
			: undefined
	);

	/** A tilde over a letter, centred at (x, y). */
	const tilde = (x: number, y: number) => {
		const w = 2.6 * u;
		const h = 1.1 * u;
		return `M${f2(x - w)},${f2(y + h * 0.6)}C${f2(x - w / 2)},${f2(y - h)} ${f2(x - w / 6)},${f2(y - h)} ${f2(x)},${f2(y)}S${f2(x + w / 2)},${f2(y + h)} ${f2(x + w)},${f2(y - h * 0.6)}`;
	};

	/** The lag: an arc from the push's phasor, anticlockwise, to the swing's. */
	const lagArc = $derived.by(() => {
		if (!pushing || response.lag < (3 * Math.PI) / 180) return undefined;
		const r = 17 * u;
		const a0 = -theta;
		const a1 = response.lag - theta;
		const p0 = { x: origin.x + r * Math.cos(a0), y: origin.y - r * Math.sin(a0) };
		const p1 = { x: origin.x + r * Math.cos(a1), y: origin.y - r * Math.sin(a1) };
		const mid = (a0 + a1) / 2;
		const lr = r + 9 * u;
		return {
			d: `M${f2(p0.x)},${f2(p0.y)}A${f2(r)},${f2(r)} 0 0 0 ${f2(p1.x)},${f2(p1.y)}`,
			label:
				response.lag > (14 * Math.PI) / 180
					? { x: origin.x + lr * Math.cos(mid), y: origin.y - lr * Math.sin(mid) }
					: undefined
		};
	});

	/** The steady state's place on the track, under which the swing's phasor stands. */
	const steadyX = $derived(pushing ? layout.cx + steady(seg, time).q * perMetre : undefined);

	/** The guide from the rail down to the swing's phasor, broken where it would cross a tick's number. */
	const guide = $derived.by(() => {
		if (steadyX === undefined) return [];
		const end = swingTip?.y ?? pcy;
		const crosses = qTicks.values.some(
			(v) => Math.abs(layout.cx + v * perMetre - steadyX) < 15 * u
		);
		if (!crosses) return [[rail + 1, end]];
		return [
			[rail + 1, rail + 5 * u],
			[rail + 22 * u, end]
		];
	});

	// --- the two graphs -------------------------------------------------------------------------------------------
	const LEFT_ROOM = 30;
	const STRIP = 18;
	const inner = (b: Box, strip: number) => ({
		x: b.x + LEFT_ROOM,
		y: b.y + 8,
		w: b.w - LEFT_ROOM - 10,
		h: b.h - 8 - strip
	});
	const i1 = $derived(inner(layout.p1, 6));
	const i2 = $derived(inner(layout.p2, STRIP));
	const Xw = (b: { x: number; w: number }, w: number) => b.x + (w / DRIVE_MOST) * b.w;

	/** k|χ| from 0.07 to 160: a slow push, 1, and Q = 100's peak, 100, both well inside. */
	const LOG_LOW = Math.log10(0.07);
	const LOG_HIGH = Math.log10(160);
	const Y1 = (v: number) => i1.y + i1.h - ((Math.log10(v) - LOG_LOW) / (LOG_HIGH - LOG_LOW)) * i1.h;

	const axis2 = $derived(lineAxis(Gamma));
	const lineTop = new Tween(lineAxis(damping(OPENING.Q)).top, { duration: 450, easing: cubicOut });
	const Y2 = (v: number) => i2.y + i2.h - (v / lineTop.current) * i2.h;

	const grid = $derived(samples(Gamma));
	const gainPath = $derived(
		grid.map((w, i) => `${i ? 'L' : 'M'}${f2(Xw(i1, w))},${f2(Y1(gain(w, Gamma)))}`).join('')
	);
	const linePath = $derived(
		grid.map((w, i) => `${i ? 'L' : 'M'}${f2(Xw(i2, w))},${f2(Y2(line(w, Gamma)))}`).join('')
	);
	const lineFill = $derived(
		`${linePath}L${f2(Xw(i2, DRIVE_MOST))},${f2(Y2(0))}L${f2(Xw(i2, 0))},${f2(Y2(0))}Z`
	);

	const halves = $derived(halfPower(Gamma));
	const widthBar = $derived.by(() => {
		const y = Y2(lineHeight(Gamma) / 2);
		const x0 = Xw(i2, halves.low);
		const x1 = Math.min(Xw(i2, halves.high), i2.x + i2.w);
		const words = 74 * u;
		const below = x1 - x0 > words + 14 * u;
		return {
			y,
			x0,
			x1,
			label: below
				? { x: (x0 + x1) / 2, y: y + 13 * u, anchor: 'middle' }
				: { x: x1 + 6 * u, y: y + 4 * u, anchor: 'start' }
		};
	});

	const decades = [0.1, 1, 10, 100];
	const omegaTicks = [0, 5, 10, 15];
	const yTicks2 = $derived.by(() => {
		const out: number[] = [];
		for (let v = 0; v <= axis2.top + 1e-9; v += axis2.step) out.push(Number(v.toFixed(6)));
		return out;
	});
	const driveX1 = $derived(Xw(i1, omega));
	const driveX2 = $derived(Xw(i2, omega));
	const gainNow = $derived(gain(omega, Gamma));
	const lineNow = $derived(line(omega, Gamma));

	// --- the numbers ----------------------------------------------------------------------------------------------
	const M_T = '\\htmlClass{q-matter}{m}';
	const n3 = (x: number) => texNumber(Math.abs(x) < 1e-15 ? 0 : x, 3);
	const degrees = (r: number) => (r * 180) / Math.PI;
	const lagDeg = $derived(degrees(response.lag));
	const swingMm = $derived(1000 * FORCE * response.abs);
	const power = $derived(meanPower(omega, Gamma));
	const S_KG = '\\,\\mathrm{s\\,kg^{-1}}';
	const PER_S = '\\,\\mathrm{s^{-1}}';

	const cartTex = `${M_T} = 2\\,\\mathrm{kg},\\ k = 50\\,\\mathrm{N\\,m^{-1}},\\ \\omega_0 = \\sqrt{k/${M_T}} = 5${PER_S}`;
	const pushTex = `F = F_0\\cos\\omega t,\\ F_0 = 0.1\\,\\mathrm{N}`;
	const frictionTex = $derived(
		`Q = ${texNumber(Q, 3)},\\ \\Gamma = \\omega_0/Q = ${texNumber(Gamma, 3)}${PER_S}`
	);
	const energyTimeTex = $derived(`1/\\Gamma = ${texNumber(1 / Gamma, 3)}\\,\\mathrm{s}`);
	const gainTex = $derived(`k|\\chi| = ${texNumber(gainNow, 3)}`);
	const swingTex = $derived(`|\\tilde q| = |\\chi|F_0 = ${texNumber(swingMm, 3)}\\,\\mathrm{mm}`);
	const lagTex = $derived(`\\varphi = \\arg\\chi = ${lagDeg.toFixed(1)}^\\circ`);
	const lagWords = $derived(
		lagDeg < 1e-9
			? 'the cart is in step with the hand'
			: lagDeg < 20
				? 'the cart is nearly in step with the hand, a little behind it'
				: Math.abs(lagDeg - 90) < 1
					? 'the cart is a quarter of a swing behind the hand'
					: lagDeg > 160
						? 'the cart is nearly opposite to the hand, almost half a swing behind it'
						: `the cart is ${(lagDeg / 360).toFixed(2)} of a swing behind the hand`
	);
	const powerTex = $derived(
		`\\bar P = \\tfrac12\\,\\omega\\,\\mathrm{Im}\\,\\chi\\,F_0^2 = ${n3(1000 * power)}\\,\\mathrm{mW}`
	);
	const heightTex = $derived(`1/${M_T}\\Gamma = ${texNumber(lineHeight(Gamma), 3)}${S_KG}`);
	const widthTex = $derived(`\\Gamma = ${texNumber(Gamma, 3)}${PER_S}`);
	const areaTex = `\\pi/2${M_T} = ${lineArea().toFixed(3)}\\,\\mathrm{kg^{-1}}`;
	const ringTex = $derived(
		dampedFrequency(Gamma) > 0
			? `\\omega_d = ${dampedFrequency(Gamma).toFixed(3)}${PER_S}`
			: undefined
	);

	// the answers' numbers, from the same model
	const atResonance = gain(OMEGA, damping(10));
	const resonantSwing = 100 * FORCE * chi(OMEGA, damping(10)).abs;
	const peakAt = modulusPeak(10);
	const peakMore = 100 * (chi(peakAt, damping(10)).abs / chi(OMEGA, damping(10)).abs - 1);
	const counts = $derived.by(() => {
		if (!counted) return undefined;
		const G = counted.Gamma;
		return {
			Q: counted.Q,
			time: 1 / G,
			swings: counted.Q / (2 * Math.PI),
			period: (2 * Math.PI) / dampedFrequency(G),
			each: 100 * perSwing(G)
		};
	});

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`Left, the cart on its track, ${pushing ? `pushed back and forth by a hand at ${omega.toFixed(1)} per second` : 'ringing down after the strike'}. ` +
			`Under it, the complex plane: ${pushing ? `the push's phasor and the swing's, ${lagDeg.toFixed(1)} degrees behind it, turning together clockwise` : "the swing's phasor shrinking as it turns"}. ` +
			`Right, k times the modulus of chi against the frequency from 0 to 15 per second, on a scale of powers of ten, ${gainNow.toFixed(2)} at the drive; and the line omega Im chi, ${lineHeight(Gamma).toFixed(2)} seconds per kilogram high at omega zero and ${Gamma.toPrecision(2)} per second wide.`
	);
</script>

<div class="driven-cart">
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
				At <Tex math="Q = 10" />, how many times the static stretch is the swing when you push at
				<Tex math={`5${PER_S}`} />, and is the cart then ahead of the hand, with it, or behind it?
			{:else if step === 2}
				Then halve <Tex math="Q" />. What happens to the height and to the width of the power peak?
			{:else}
				Set <Tex math="Q" /> to 50, push at resonance, press strike and count the swings until the swing
				has fallen to about 60%.
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Ten times, and a quarter of a swing behind.</strong> At
				<Tex math="\omega_0" /> the response function is <Tex math="\chi = iQ/k" />, so
				<Tex math={`k|\\chi| = ${atResonance.toFixed(1)}`} />: the push of 0.1 N swings the cart
				{resonantSwing.toFixed(1)} cm each way. The factor <Tex math={'i = e^{i\\pi/2}'} /> puts the swing
				90° behind the push, so the hand pushes in step with the cart’s velocity and does work all through
				the swing. The largest swing lies a little lower, at <Tex
					math={`${peakAt.toFixed(2)}${PER_S}`}
				/>, and is larger by only {peakMore.toFixed(1)}%.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>The height halves and the width doubles.</strong> The line
				<Tex math={'\\omega\\,\\mathrm{Im}\\,\\chi'} /> is <Tex math={`1/${M_T}\\Gamma`} trust /> high
				at
				<Tex math="\omega_0" /> and exactly <Tex math="\Gamma" /> wide at half its height. Halving
				<Tex math="Q" /> from 10 to 5 doubles <Tex math="\Gamma" /> from 0.5 to <Tex
					math={`1${PER_S}`}
				/>, so the height falls from <Tex math={`1.0${S_KG}`} /> to <Tex math={`0.50${S_KG}`} />.
				Their product stays <Tex math={`1/${M_T}`} trust />, and the area under the line stays
				<Tex math={areaTex} trust /> at every <Tex math="Q" />: a first glimpse of chapter 4.5.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && counts}
				<strong
					>About {counts.swings.toFixed(0)} swings: <Tex
						math={`Q/2\\pi = ${counts.swings.toFixed(2)}`}
					/>.</strong
				>
				The swing falls as <Tex math={'e^{-\\Gamma t/2}'} />, so it reaches <Tex
					math={'e^{-1/2} = 61\\%'}
				/> in the time <Tex math={`1/\\Gamma = ${texNumber(counts.time, 3)}\\,\\mathrm{s}`} />,
				while the energy falls by <Tex math="e" />. In that time the phase advances by
				<Tex math={`Q = ${counts.Q}`} /> radians, which is <Tex math="Q/2\pi" /> swings, as in the chapter’s
				practice problem. Each swing takes <Tex
					math={`2\\pi/\\omega_d = ${counts.period.toFixed(2)}\\,\\mathrm{s}`}
				/> and ends with {counts.each.toFixed(0)}% of the swing it started with.
			{:else if step === 1}
				The answer appears when you have set <Tex math="Q = 10" /> and the push to <Tex
					math={`5${PER_S}`}
				/>.
			{:else if step === 2}
				The answer appears when you have set <Tex math="Q = 5" />, half the chapter’s 10.
			{:else}
				The answer appears when you have struck the cart at <Tex math="Q = 50" /> while pushing within
				<Tex math={`0.2${PER_S}`} /> of <Tex math="\omega_0" />, and its swing has fallen below 60%.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-plane">
					<rect
						x={layout.plane.x + 1}
						y={layout.plane.y + 1}
						width={layout.plane.w - 2}
						height={layout.plane.h - 2}
						rx="7"
					/>
				</clipPath>
				<clipPath id="{uid}-p1">
					<rect x={i1.x - 6} y={layout.p1.y + 1} width={i1.w + 12} height={layout.p1.h - 2} />
				</clipPath>
				<clipPath id="{uid}-p2">
					<rect x={i2.x - 6} y={layout.p2.y + 1} width={i2.w + 12} height={i2.h + 7} />
				</clipPath>
			</defs>

			<!-- the track: the wall, the spring, the cart and the hand -->
			<text class="title" x="4" y={layout.track.y - 8 * u}>The cart on its track</text>
			<text class="title end" x={layout.LW - 4} y={layout.track.y - 8 * u}
				>{#if pushing}<tspan class="it">ω</tspan> = {omega.toFixed(1)} s⁻¹{:else}struck: ringing
					down{/if}</text
			>
			<line class="relaxed" x1={layout.cx} x2={layout.cx} y1={layout.track.y + 4} y2={rail} />
			{#if strikeMarks}
				{#each [-1, 1] as side (side)}
					<line
						class="strike-full"
						x1={layout.cx + side * strikeMarks.full}
						x2={layout.cx + side * strikeMarks.full}
						y1={rail - 2}
						y2={rail + 6}
					/>
					<line
						class="strike-share"
						x1={layout.cx + side * strikeMarks.share}
						x2={layout.cx + side * strikeMarks.share}
						y1={rail - 2}
						y2={rail + 6}
					/>
				{/each}
			{/if}
			<line class="rail" x1={WALL} x2={layout.LW - 2} y1={rail} y2={rail} />
			<line class="wall" x1={WALL} x2={WALL} y1={rail - 30} y2={rail} />
			{#each [0, 1, 2, 3] as i (i)}
				<line
					class="wall-hatch"
					x1={WALL}
					x2={WALL - 5}
					y1={rail - 28 + i * 8}
					y2={rail - 23 + i * 8}
				/>
			{/each}
			<path class="spring" d={spring} />
			<g class="cart" transform="translate({f2(cartX)} {f2(rail)})">
				<rect x={-CART_W / 2} y="-24" width={CART_W} height="17" rx="3" />
				<circle class="wheel" cx="-11" cy="-3.5" r="3.5" />
				<circle class="wheel" cx="11" cy="-3.5" r="3.5" />
				<line class="pointer" x1="0" x2="0" y1="-7" y2="3" />
				{#if pushing}
					<line class="rod" x1={CART_W / 2} x2={CART_W / 2 + ROD + 4} y1="-15.5" y2="-15.5" />
					<g
						class="hand"
						transform="translate({CART_W / 2 + ROD + HAND / 2} -15.5) rotate(-90) scale({HAND /
							24}) translate(-12 -12)"
					>
						{#each HAND_PATHS as d, i (i)}
							<path {d} />
						{/each}
					</g>
				{/if}
			</g>
			{#if pushArrow}
				<path class="shaft push" d={pushArrow.shaft} />
				<path class="head push" d={pushArrow.head} />
			{/if}
			{#if steadyX !== undefined}
				{#each guide as [y1, y2], i (i)}
					<line class="guide" x1={steadyX} x2={steadyX} {y1} {y2} />
				{/each}
			{/if}
			{#each qTicks.values as v (v)}
				<text class="small tick" x={layout.cx + v * perMetre} y={rail + 17 * u}
					>{mm(v, qTicks.step)}</text
				>
			{/each}
			<text class="small dim end" x={layout.LW - 2} y={rail + 17 * u}
				><tspan class="it">q</tspan>, mm</text
			>
			{#if strikeMarks}
				<text
					class="small strike-words"
					x={layout.cx + strikeMarks.share}
					y={layout.track.y + 8 * u}>60%</text
				>
			{/if}

			<!-- the complex plane, sharing the track's q -->
			<text class="title" x="4" y={layout.plane.y + layout.plane.h + 16 * u}
				>The phasors, turning as <tspan class="it">e</tspan><tspan class="sup" dy={-5 * u}
					>−<tspan class="it">iωt</tspan></tspan
				></text
			>
			<rect
				class="panel"
				x={layout.plane.x + 0.5}
				y={layout.plane.y + 0.5}
				width={layout.plane.w - 1}
				height={layout.plane.h - 1}
				rx="8"
			/>
			<g clip-path="url(#{uid}-plane)">
				<line
					class="grid axis"
					x1={layout.plane.x + 6}
					x2={layout.plane.x + layout.plane.w - 6}
					y1={pcy}
					y2={pcy}
				/>
				<line
					class="grid axis"
					x1={layout.cx}
					x2={layout.cx}
					y1={layout.plane.y + 6}
					y2={layout.plane.y + layout.plane.h - 6}
				/>
				{#if strikeMarks}
					<circle class="strike-ring" cx={origin.x} cy={origin.y} r={strikeMarks.full} />
					<circle class="strike-ring share" cx={origin.x} cy={origin.y} r={strikeMarks.share} />
					<text
						class="small strike-words halo"
						x={origin.x - strikeMarks.share * Math.SQRT1_2 - 3 * u}
						y={origin.y + strikeMarks.share * Math.SQRT1_2 + 12 * u}
						text-anchor="end">60%</text
					>
				{/if}
				{#if lagArc}
					<path class="lag" d={lagArc.d} />
				{/if}
				{#if forceArrow}
					<path class="shaft push" d={forceArrow.shaft} />
					<path class="head push" d={forceArrow.head} />
				{/if}
				{#if swingArrow}
					<path class="shaft swing" d={swingArrow.shaft} />
					<path class="head swing" d={swingArrow.head} />
				{/if}
				{#if forceTip}
					<circle class="foot push-foot" cx={forceTip.x} cy={pcy} r={1.8 * u} />
				{/if}
				{#if swingTip}
					<circle class="foot swing-foot" cx={swingTip.x} cy={pcy} r={1.8 * u} />
				{/if}
				{#if lagArc?.label}
					<text class="sym halo" x={lagArc.label.x} y={lagArc.label.y}>φ</text>
				{/if}
				{#if forceLabel}
					<text class="sym halo push-words" x={forceLabel.x} y={forceLabel.y}>F</text>
					<path
						class="tilde push-tilde"
						d={tilde(forceLabel.x + 1.2 * u, forceLabel.y - 8.4 * u)}
					/>
				{/if}
				{#if swingLabel}
					<text class="sym halo swing-words" x={swingLabel.x} y={swingLabel.y}>q</text>
					<path
						class="tilde swing-tilde"
						d={tilde(swingLabel.x + 0.6 * u, swingLabel.y - 5.6 * u)}
					/>
				{/if}
				<text class="small dim end" x={layout.plane.x + layout.plane.w - 8 * u} y={pcy + 13 * u}
					>Re</text
				>
				<text class="small dim start" x={layout.cx + 6 * u} y={layout.plane.y + 13 * u}>Im</text>
				{#if !pushing && !phasors}
					<text
						class="small dim start"
						x={layout.plane.x + 8 * u}
						y={layout.plane.y + layout.plane.h - 9 * u}
						>At critical damping the cart does not swing; it creeps back.</text
					>
				{/if}
			</g>

			<!-- k|χ|, on a scale of powers of ten -->
			<text class="title" x={layout.p1.x + 4} y={layout.p1.y - 8 * u}
				><tspan class="it">k</tspan>|<tspan class="it">χ</tspan>|, on a scale of powers of ten</text
			>
			<text class="title end" x={layout.p1.x + layout.p1.w - 4} y={layout.p1.y - 8 * u}
				>{gainNow.toPrecision(3)} at the drive</text
			>
			<rect
				class="panel"
				x={layout.p1.x + 0.5}
				y={layout.p1.y + 0.5}
				width={layout.p1.w - 1}
				height={layout.p1.h - 1}
				rx="8"
			/>
			{#each decades as v (v)}
				<line
					class={['grid', { axis: v === 1 }]}
					x1={i1.x}
					x2={i1.x + i1.w}
					y1={Y1(v)}
					y2={Y1(v)}
				/>
				<text class="small y-tick" x={i1.x - 5 * u} y={Y1(v)}>{v}</text>
			{/each}
			{#each omegaTicks as w (w)}
				<line
					class={['grid', { axis: w === OMEGA }]}
					x1={Xw(i1, w)}
					x2={Xw(i1, w)}
					y1={i1.y}
					y2={i1.y + i1.h}
				/>
			{/each}
			<g clip-path="url(#{uid}-p1)">
				<path class="curve" d={gainPath} />
				<line class="drive" x1={driveX1} x2={driveX1} y1={i1.y} y2={i1.y + i1.h} />
				<circle class="dot" cx={driveX1} cy={Y1(gainNow)} r={3.6 * u} />
			</g>

			<!-- the line ω Im χ, its half-height width and its area -->
			<text class="title" x={layout.p2.x + 4} y={layout.p2.y - 8 * u}
				><tspan class="it">ω</tspan> Im <tspan class="it">χ</tspan>, in s/kg</text
			>
			<text class="title end" x={layout.p2.x + layout.p2.w - 4} y={layout.p2.y - 8 * u}
				>{lineNow < 1e-4 ? '0' : lineNow.toPrecision(2)} at the drive</text
			>
			<rect
				class="panel"
				x={layout.p2.x + 0.5}
				y={layout.p2.y + 0.5}
				width={layout.p2.w - 1}
				height={layout.p2.h - 1}
				rx="8"
			/>
			{#each yTicks2 as v (v)}
				<line
					class={['grid', { axis: v === 0 }]}
					x1={i2.x}
					x2={i2.x + i2.w}
					y1={Y2(v)}
					y2={Y2(v)}
				/>
				<text class="small y-tick" x={i2.x - 5 * u} y={Y2(v)}>{v}</text>
			{/each}
			{#each omegaTicks as w (w)}
				<line
					class={['grid', { axis: w === OMEGA }]}
					x1={Xw(i2, w)}
					x2={Xw(i2, w)}
					y1={i2.y}
					y2={i2.y + i2.h}
				/>
				<text
					class={['small', w === DRIVE_MOST ? 'end' : 'tick']}
					x={Xw(i2, w) + (w === DRIVE_MOST ? 4 * u : 0)}
					y={i2.y + i2.h + 14 * u}
					>{#if w === OMEGA}<tspan class="it">ω</tspan><tspan class="sub" dy={2.5 * u}>0</tspan
						><tspan dy={-2.5 * u}>&nbsp;= 5</tspan>{:else if w === DRIVE_MOST}{w} s⁻¹{:else}{w}{/if}</text
				>
			{/each}
			<g clip-path="url(#{uid}-p2)">
				<path class="area" d={lineFill} />
				<path class="curve" d={linePath} />
				<line class="width" x1={widthBar.x0} x2={widthBar.x1} y1={widthBar.y} y2={widthBar.y} />
				<line
					class="width"
					x1={widthBar.x0}
					x2={widthBar.x0}
					y1={widthBar.y - 3 * u}
					y2={widthBar.y + 3 * u}
				/>
				<line
					class="width"
					x1={widthBar.x1}
					x2={widthBar.x1}
					y1={widthBar.y - 3 * u}
					y2={widthBar.y + 3 * u}
				/>
				<text
					class="small width-words halo"
					x={widthBar.label.x}
					y={widthBar.label.y}
					text-anchor={widthBar.label.anchor}
					>width <tspan class="it">Γ</tspan> = {Number(Gamma.toPrecision(3))} s⁻¹</text
				>
				<line class="drive" x1={driveX2} x2={driveX2} y1={i2.y} y2={i2.y + i2.h} />
				<circle class="dot" cx={driveX2} cy={Y2(lineNow)} r={3.6 * u} />
			</g>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch swing-key"></span>the swing, its phasor and the response</li>
			<li><span class="swatch push-key"></span>the hand’s push and its phasor</li>
			<li><span class="swatch guide-key"></span>the steady state</li>
			<li><span class="swatch drive-key"></span>the hand’s frequency</li>
		</ul>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause' : 'Play'}
				aria-pressed={playing}
				onclick={togglePlay}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<button type="button" class="action strike-button" onclick={doStrike}>
				{#if pushing}
					<HugeiconsIcon icon={Hammer01Icon} size={16} strokeWidth={1.7} />
					Strike
				{:else}
					<HugeiconsIcon icon={HandGrabIcon} size={16} strokeWidth={1.7} />
					Push again
				{/if}
			</button>
			<button type="button" class="action" onclick={startAgain}>
				<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
				Start from rest
			</button>
			<p class="hint">
				Strike takes the hand away, and the cart rings down from the swing it had. The sliders take
				the arrow keys after Tab.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-quality"
				label="Quality factor"
				icon={DashboardSpeed01Icon}
				min={0}
				max={QUALITIES.length - 1}
				step={1}
				bind:value={() => qIndex, setQ}
				readout="Q = {Q}"
				ends={['0.5', '100']}
				mark={{ at: QUALITIES.indexOf(10), label: 'the chapter’s example' }}
			/>
			<Slider
				id="{uid}-drive"
				label="The hand’s frequency"
				icon={WaveIcon}
				min={0}
				max={DRIVE_MOST}
				step={DRIVE_STEP}
				bind:value={() => omega, setOmega}
				readout="ω = {omega.toFixed(1)} s⁻¹"
				mark={{ at: OMEGA, label: 'ω₀, the natural frequency' }}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The cart</dt>
				<dd>
					<Tex math={cartTex} trust /><span class="also"
						>pushed by the hand with <Tex math={pushTex} />, which stretches the spring by
						<Tex math={`F_0/k = ${1000 * STATIC}\\,\\mathrm{mm}`} /> when it is held still</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The friction</dt>
				<dd>
					<Tex math={frictionTex} /><span class="also"
						>the energy of a free swing falls by <Tex math="e" /> in <Tex
							math={energyTimeTex}
						/>{#if ringTex}, and it swings at <Tex math={ringTex} />{:else}, and the cart does not
							swing at all on its own{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The swing</dt>
				<dd>
					<Tex math={gainTex} /><span class="also"
						>the steady swing is {texNumber(gainNow, 3).replace('\\times', '×')} times the static stretch:
						<Tex math={swingTex} /> each way</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The lag</dt>
				<dd>
					<Tex math={lagTex} /><span class="also">{lagWords}</span>
				</dd>
			</div>
			<div class="row">
				<dt>The mean power</dt>
				<dd>
					<Tex math={powerTex} /><span class="also"
						>the line is <Tex math={heightTex} trust /> high at <Tex math="\omega_0" /> and
						<Tex math={widthTex} /> wide at half its height; its area is <Tex
							math={areaTex}
							trust
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The motion</dt>
				<dd>
					<span class="also"
						>{#if pushing}The hand pushes. The cart moves as the steady swing plus a ring-down from
							where it was when the push or the settings last changed, which dies away in a few
							times <Tex math="1/\Gamma" />.{:else}The hand has let go. The cart rings down, its
							swing falling as <Tex math={'e^{-\\Gamma t/2}'} />; the rings in the plane and the
							ticks on the track mark the swing it had when struck and 60% of it.{/if}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The two curves and the readouts are for the hand’s frequency <Tex math="\omega" />, marked by
			the dashed lines. The plane shares the track’s <Tex math="q" />: the real part of the swing’s
			phasor <Tex math={'\\tilde q\\,e^{-i\\omega t}'} /> stands under the steady state, and the cart
			differs from it by the ring-down that is still dying away. Both phasors turn clockwise, so the swing’s,
			drawn the angle <Tex math="\varphi" /> anticlockwise from the push’s, trails it. The push’s phasor
			is drawn to its own scale, in newtons, and the arrow over the cart to the same scale. The motion
			is shown at half speed.
		</p>
	</div>
</div>

<style>
	.driven-cart {
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
	.next:focus-visible,
	.play:focus-visible,
	.action:focus-visible {
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.start {
		text-anchor: start;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.dim {
		fill: var(--text-faint);
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub,
	.sup {
		font-size: 0.75em;
	}

	.sym {
		font:
			italic 400 calc(14px * var(--u, 1)) / 1 KaTeX_Math,
			var(--font-serif);
		text-anchor: middle;
		dominant-baseline: middle;
		fill: var(--text);
	}

	.tilde {
		fill: none;
		stroke-width: calc(1px * var(--u, 1));
		stroke-linecap: round;
	}

	.push-tilde {
		stroke: var(--q-field);
	}

	.swing-tilde {
		stroke: var(--accent);
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	/* the track */
	.relaxed {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.rail,
	.wall {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.wall-hatch {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.spring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.cart rect {
		fill: color-mix(in srgb, var(--accent) 22%, var(--bg));
		stroke: var(--accent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.wheel {
		fill: var(--bg);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pointer {
		stroke: var(--accent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.rod {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.hand path {
		fill: var(--bg);
		stroke: color-mix(in srgb, var(--q-field) 80%, var(--text));
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.guide {
		stroke: color-mix(in srgb, var(--accent) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.strike-full,
	.strike-share {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.strike-share {
		stroke: var(--text);
	}

	.strike-words {
		text-anchor: middle;
		fill: var(--text);
	}

	/* the plane */
	.shaft {
		fill: none;
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft.push {
		stroke: var(--q-field);
	}

	.head.push {
		fill: var(--q-field);
	}

	.shaft.swing {
		stroke: var(--accent);
	}

	.head.swing {
		fill: var(--accent);
	}

	.foot {
		stroke: none;
	}

	.push-foot {
		fill: var(--q-field);
	}

	.swing-foot {
		fill: var(--accent);
	}

	.push-words {
		fill: var(--q-field);
	}

	.swing-words {
		fill: var(--accent);
	}

	.lag {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.strike-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.strike-ring.share {
		stroke: color-mix(in srgb, var(--text) 65%, transparent);
		stroke-dasharray: none;
	}

	/* the graphs */
	.curve {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.area {
		fill: color-mix(in srgb, var(--accent) 12%, transparent);
		stroke: none;
	}

	.width {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.width-words {
		fill: var(--text);
	}

	.drive {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.dot {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.45rem 0.2rem 0;
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
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.swing-key {
		border-color: var(--accent);
	}

	.push-key {
		border-color: var(--q-field);
		border-top-width: 2px;
	}

	.guide-key {
		border-top-style: dotted;
		border-color: color-mix(in srgb, var(--accent) 70%, transparent);
	}

	.drive-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--text) 60%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.play,
	.action {
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
		font: 500 0.74rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play {
		width: 2.2rem;
		padding: 0;
	}

	.action {
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.strike-button {
		min-width: 7.4rem;
		border-color: color-mix(in srgb, var(--q-field) 60%, transparent);
		background: color-mix(in srgb, var(--q-field) 10%, var(--bg));
	}

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	.strike-button :global(svg) {
		color: var(--q-field);
	}

	@media (hover: hover) {
		.play:hover,
		.action:hover {
			border-color: var(--accent);
		}

		.strike-button:hover {
			border-color: var(--q-field);
		}
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: stretch;
	}

	.readouts {
		padding: 0.75rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	.row {
		display: grid;
		grid-template-columns: 8.5rem minmax(0, 1fr);
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

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.time {
			flex-wrap: wrap;
		}

		.hint {
			flex: 1 1 100%;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.action {
			transition: none;
		}
	}
</style>
