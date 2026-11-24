<script lang="ts">
	/**
	 * Chapter 1.7's cart in phase space: 2 kg on a spring of 50 N/m, its state (q, p) a point going clockwise round
	 * the ellipse H = E, with q to the right and p up, and the cart drawn below on its track at the same q. A kick by
	 * a sudden tide, uniform (g = x) or tidal (g = ½x²), moves the point straight up or down onto a new ellipse; the
	 * readouts split the energy it leaves into ε p g′(q) and ½ ε² m g′(q)². With two copies, a second cart prepared
	 * alike is kicked by −ε at the same instant, and the average of the two gains is ½ ε² m g′(q)². The motion is the
	 * closed form (./phase-space.ts), shown four times slower than it is.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowHorizontalIcon,
		Copy01Icon,
		EnergyIcon,
		FlashIcon,
		GravityIcon,
		MoveRightIcon,
		PauseIcon,
		PlayIcon,
		Undo02Icon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		CHAPTER_ENERGY,
		ENERGY_STEP,
		LEAST_ENERGY,
		MASS,
		MOST_ENERGY,
		OMEGA,
		PERIOD,
		STRENGTH,
		angleOf,
		area,
		copies,
		energy,
		gain,
		halfAxes,
		impulse,
		kick,
		stateAt,
		tickStep,
		viewSpan,
		type State,
		type Tide
	} from './phase-space';

	const uid = $props.id();

	/** The motion is shown this many times slower than it is. */
	const SLOW = 4;
	/** How long the push on the cart is drawn after a kick, s of the cart's own time. */
	const FLASH = 0.15;
	/** A turn of the arrow keys round the ellipse: a twenty-fourth of a turn. */
	const STEP = Math.PI / 12;

	// --- the settings ---------------------------------------------------------------------------------------------
	let prepared = $state(CHAPTER_ENERGY);
	let tide = $state<Tide>('uniform');
	let strength = $state<Record<Tide, number>>({
		uniform: STRENGTH.uniform.start,
		tidal: STRENGTH.tidal.start
	});
	let twoCopies = $state(false);
	const eps = $derived(strength[tide]);

	// --- the carts: each an energy and a phase, the angle round its ellipse being ω t + φ --------------------------
	type Cart = { E: number; phi: number };
	/** The cart's own time, s. */
	let time = $state(0);
	let cart = $state<Cart>({ E: CHAPTER_ENERGY, phi: -0.8 });
	/** The copy, once a kick has parted it from the cart; until then it moves in step with it. */
	let copy = $state<Cart | undefined>();

	/** A value within a millionth of a millionth of the scale set to zero, so that a kick at the centre is exactly there. */
	const clean = (x: number, scale: number) => (Math.abs(x) < 1e-12 * Math.max(scale, 1e-9) ? 0 : x);
	function stateOf(c: Cart): State {
		const s = stateAt(c.E, OMEGA * time + c.phi);
		const h = halfAxes(c.E);
		return { q: clean(s.q, h.q), p: clean(s.p, h.p) };
	}
	const fromState = (s: State): Cart => ({ E: energy(s), phi: angleOf(s) - OMEGA * time });

	const now = $derived(stateOf(cart));
	const copyNow = $derived(copy ? stateOf(copy) : now);

	/** The last kick: where it found the cart, where it left it, and the copy, if two were kicked. */
	type Kick = {
		tide: Tide;
		eps: number;
		time: number;
		before: State;
		after: State;
		gain: ReturnType<typeof gain>;
		copyAfter?: State;
		copies?: ReturnType<typeof copies>;
	};
	let last = $state<Kick | undefined>();

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	type Record1 = { tide: Tide; eps: number; total: number };
	let atCentre = $state<Record1 | undefined>();
	let atEnd = $state<Record1 | undefined>();
	let answered = $state<{ tide: Tide; centre: number; end: number } | undefined>();
	let copiesKicked = $state(false);
	const revealed = $derived(step === 1 ? answered !== undefined : copiesKicked);

	function note(s: State, total: number) {
		const h = halfAxes(energy(s));
		if (h.q === 0) return;
		const record = { tide, eps, total };
		if (Math.abs(s.q) <= 0.15 * h.q) atCentre = record;
		if (Math.abs(s.p) <= 0.15 * h.p) atEnd = record;
		if (
			!answered &&
			atCentre &&
			atEnd &&
			atCentre.tide === atEnd.tide &&
			atCentre.eps === atEnd.eps
		)
			answered = { tide: atCentre.tide, centre: atCentre.total, end: atEnd.total };
	}

	// --- the actions ------------------------------------------------------------------------------------------------
	function doKick() {
		const s = now;
		const after = kick(s, tide, eps);
		const g = gain(s, tide, eps);
		cart = fromState(after);
		let copyAfter: State | undefined;
		if (twoCopies) {
			copyAfter = kick(s, tide, -eps);
			copy = fromState(copyAfter);
			if (eps !== 0) copiesKicked = true;
		} else copy = undefined;
		last = {
			tide,
			eps,
			time,
			before: s,
			after,
			gain: g,
			copyAfter,
			copies: twoCopies ? copies(s, tide, eps) : undefined
		};
		note(s, g.total);
		refit();
	}

	function startAgain() {
		cart = { E: prepared, phi: cart.phi };
		copy = undefined;
		last = undefined;
		refit();
	}

	function setPrepared(v: number) {
		prepared =
			Math.round(Math.max(LEAST_ENERGY, Math.min(MOST_ENERGY, v)) / ENERGY_STEP) * ENERGY_STEP;
		prepared = Number(prepared.toFixed(2));
		startAgain();
	}

	function setStrength(v: number) {
		const r = STRENGTH[tide];
		const snapped = Math.round(Math.max(-r.most, Math.min(r.most, v)) / r.step) * r.step;
		strength[tide] = Number(snapped.toFixed(2));
	}

	function setCopies(on: boolean) {
		twoCopies = on;
		copy = undefined;
		refit();
	}

	/** Puts the cart at the angle θ round its ellipse, the time standing still. */
	function setAngle(theta: number) {
		playing = false;
		cart = { E: cart.E, phi: theta - OMEGA * time };
	}
	const angleNow = $derived(OMEGA * time + cart.phi);

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);

	function togglePlay() {
		playing = !playing;
	}

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
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	};

	// --- the layout: the phase plane, and under it the track, and the copy's track when there are two ---------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };
	const TOP = 22;
	/** Room inside the plane's edges for the tick labels: below, and on the left. */
	const STRIP = 20;
	const layout = $derived.by(() => {
		const W = phone.current ? 360 : 600;
		const plane: Box = { x: 0, y: TOP, w: W, h: phone.current ? 270 : 300 };
		const track: Box = { x: 0, y: plane.y + plane.h + 12, w: W, h: 62 };
		const copyTrack: Box = { x: 0, y: track.y + track.h + 6, w: W, h: 62 };
		const H = (twoCopies ? copyTrack.y + copyTrack.h : track.y + track.h) + 2;
		/** The ellipse's width over its height as drawn: any will do, as the two axes are in different units. */
		const aspect = phone.current ? 1.25 : 1.6;
		return { W, H, plane, track, copyTrack, aspect };
	});

	/** The view's half-width along q, m, fitted to the ellipses drawn. */
	const need = () => {
		const energies = [cart.E, prepared];
		if (last) energies.push(energy(last.before));
		if (copy) energies.push(copy.E);
		return Math.max(0.04, 1.3 * halfAxes(Math.max(...energies)).q);
	};
	const view = new Tween(viewSpan(1.3 * halfAxes(CHAPTER_ENERGY).q), {
		duration: 450,
		easing: cubicOut
	});
	function refit() {
		view.set(viewSpan(need()), { duration: prefersReducedMotion.current ? 0 : 450 });
	}

	const cx = $derived(layout.plane.x + layout.plane.w / 2);
	const cy = $derived(layout.plane.y + (layout.plane.h - STRIP) / 2);
	/**
	 * Drawing units per kg m s⁻¹ along p, and per metre along q: an ellipse whose half-axis along q is the view's
	 * half-width reaches 14 units short of the plane's top, and is `aspect` times as wide as it is high.
	 */
	const scale = $derived.by(() => {
		const p = ((layout.plane.h - STRIP) / 2 - 14) / (view.current * MASS * OMEGA);
		return { p, q: layout.aspect * p * MASS * OMEGA };
	});
	const X = (q: number) => cx + q * scale.q;
	const Y = (p: number) => cy - p * scale.p;

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const DOT = $derived(4.6 * u);
	const f2 = (n: number) => n.toFixed(2);

	// --- the plane's grid --------------------------------------------------------------------------------------------
	const reach = $derived({
		q: (layout.plane.w / 2 - 6) / scale.q,
		p: ((layout.plane.h - STRIP) / 2 - 4) / scale.p
	});
	/** Ticks a step apart, the step widened until the labels are at least `room` drawing units apart. */
	function ticks(span: number, per: number, room: number) {
		let s = tickStep(span, 3);
		while (s * per < room) s = tickStep(2.2 * s, 1);
		const out: number[] = [];
		const most = Math.floor(span / s + 1e-9);
		for (let i = -most; i <= most; i++) out.push(Number((i * s).toFixed(10)));
		return { step: s, values: out };
	}
	const qTicks = $derived(ticks(reach.q - 18 / scale.q, scale.q, 46 * u));
	const pTicks = $derived(ticks(reach.p - 6 / scale.p, scale.p, 22 * u));
	const label = (v: number, s: number) => {
		const digits = Math.max(0, -Math.floor(Math.log10(s) + 1e-9));
		const t = Math.abs(v).toFixed(digits);
		return `${v < 0 ? '−' : ''}${Number(t)}`;
	};
	const gridLeft = $derived(layout.plane.x + 36 * u);
	const gridBottom = $derived(layout.plane.y + layout.plane.h - STRIP);

	// --- the ellipses, the point and the kick ---------------------------------------------------------------------
	function ellipse(E: number) {
		const h = halfAxes(E);
		return { rx: h.q * scale.q, ry: h.p * scale.p };
	}
	const nowEllipse = $derived(ellipse(cart.E));
	const beforeEllipse = $derived(last ? ellipse(energy(last.before)) : undefined);
	const copyEllipse = $derived(copy ? ellipse(copy.E) : undefined);
	const point = $derived({ x: X(now.q), y: Y(now.p) });
	const copyPoint = $derived({ x: X(copyNow.q), y: Y(copyNow.p) });

	/** An arrowhead on the cart's ellipse, upper left, pointing the way the point goes: clockwise. */
	const sense = $derived.by(() => {
		const { rx, ry } = nowEllipse;
		if (rx < 12 * u) return undefined;
		const th = (-3 * Math.PI) / 4;
		const at = { x: cx + rx * Math.cos(th), y: cy + ry * Math.sin(th) };
		const d = { x: -rx * Math.sin(th), y: ry * Math.cos(th) };
		const len = Math.hypot(d.x, d.y);
		const ux = d.x / len;
		const uy = d.y / len;
		const L = 7 * u;
		const W = 3.2 * u;
		const tip = { x: at.x + ux * L * 0.5, y: at.y + uy * L * 0.5 };
		const base = { x: at.x - ux * L * 0.5, y: at.y - uy * L * 0.5 };
		return `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * W)},${f2(base.y + ux * W)}L${f2(base.x + uy * W)},${f2(base.y - ux * W)}Z`;
	});

	/** The shaft and head of an arrow from `from` to `to`, if it is long enough to draw. */
	function arrow(from: { x: number; y: number }, to: { x: number; y: number }, gap = 0) {
		const len = Math.hypot(to.x - from.x, to.y - from.y) - gap;
		if (len < 3 * u) return undefined;
		const ux = (to.x - from.x) / (len + gap);
		const uy = (to.y - from.y) / (len + gap);
		const start = { x: from.x + ux * gap, y: from.y + uy * gap };
		const head = Math.min(6 * u, 0.45 * len);
		const base = { x: to.x - ux * head, y: to.y - uy * head };
		const w = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(to.x)},${f2(to.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	const kickArrows = $derived.by(() => {
		if (!last) return undefined;
		const from = { x: X(last.before.q), y: Y(last.before.p) };
		return {
			from,
			cart: arrow(from, { x: X(last.after.q), y: Y(last.after.p) }, 2.6 * u),
			copy: last.copyAfter
				? arrow(from, { x: X(last.copyAfter.q), y: Y(last.copyAfter.p) }, 2.6 * u)
				: undefined
		};
	});

	// --- the tracks -------------------------------------------------------------------------------------------------
	const WALL = 12;
	const CART_W = 40;
	function track(box: Box, s: State, sign: 1 | -1, kicked: boolean) {
		const rail = box.y + 40;
		const x = X(s.q);
		const springY = rail - 15;
		const end = x - CART_W / 2;
		const coils = 10;
		const lead = 6;
		const run = Math.max(4, end - WALL - 2 * lead);
		let d = `M${f2(WALL)},${f2(springY)}h${lead}`;
		for (let i = 0; i < coils; i++) {
			const a = WALL + lead + (run * (i + 0.5)) / coils;
			d += `L${f2(a)},${f2(springY + (i % 2 ? 4.5 : -4.5))}`;
		}
		d += `L${f2(end - lead)},${f2(springY)}L${f2(end)},${f2(springY)}`;
		// the tide's kick at a few places along the track, far enough apart that the arrows never meet
		const e = sign * eps;
		const most = Math.max(Math.abs(impulse(tide, e, view.current)), Math.abs(impulse(tide, e, 0)));
		const room = Math.max(1, (most * scale.p + 10 * u) / (qTicks.step * scale.q));
		const spacing = qTicks.step * Math.ceil(room - 1e-9);
		const n = Math.floor(view.current / spacing + 1e-9);
		const places = Array.from({ length: 2 * n + 1 }, (_, i) => (i - n) * spacing);
		const kicks = places
			.map((q) => {
				const from = { x: X(q), y: box.y + 9 };
				const len = impulse(tide, e, q) * scale.p;
				return {
					at: from,
					tip: from.x + len,
					arrow: arrow(from, { x: from.x + len, y: from.y }, 2.2 * u)
				};
			})
			// only places whose arrow, either way, stays clear of the wall and of the track's end: the same on both tracks
			.filter((k) => {
				const len = Math.abs(k.tip - k.at.x);
				return k.at.x - len > WALL + 10 && k.at.x + len < box.x + box.w - 6;
			});
		const flash =
			kicked && last && time - last.time >= 0 && time - last.time < FLASH
				? push(x, rail - 4.5, impulse(last.tide, sign * last.eps, last.before.q) * scale.p)
				: undefined;
		return { rail, x, spring: d, kicks, flash };
	}
	/**
	 * The push on a cart, drawn low, from its end in the direction of the kick, clear of the spring and the wheels, as
	 * long as the kick's jump in the plane.
	 */
	function push(x: number, y: number, len: number) {
		const from = x + Math.sign(len) * (CART_W / 2 + 2);
		return arrow({ x: from, y }, { x: from + len, y }, 0);
	}
	const mainTrack = $derived(track(layout.track, now, 1, true));
	const copyTrack = $derived(
		twoCopies ? track(layout.copyTrack, copyNow, -1, last?.copies !== undefined) : undefined
	);

	// --- dragging the point round its ellipse ---------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);

	function follow(e: PointerEvent) {
		if (!dragging) return;
		const m = svg?.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		// the angle round the ellipse, measured with each axis in units of its half-axis
		let theta = Math.atan2((p.y - cy) / nowEllipse.ry || 0, (p.x - cx) / nowEllipse.rx || 1);
		const quarter = Math.round(theta / (Math.PI / 2)) * (Math.PI / 2);
		if (Math.abs(theta - quarter) < (4 * Math.PI) / 180) theta = quarter;
		setAngle(theta);
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function release() {
		dragging = false;
	}

	function pointKey(e: KeyboardEvent) {
		const snapped = Math.round(angleNow / STEP) * STEP;
		const to =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? snapped + STEP
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? snapped - STEP
					: e.key === 'PageDown'
						? Math.round(angleNow / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 2
						: e.key === 'PageUp'
							? Math.round(angleNow / (Math.PI / 2)) * (Math.PI / 2) - Math.PI / 2
							: e.key === 'Home'
								? 0
								: undefined;
		if (to !== undefined) {
			e.preventDefault();
			setAngle(to);
			return;
		}
		if (e.key === 'Enter' || e.key === 'k' || e.key === 'K') {
			e.preventDefault();
			doKick();
		}
	}

	// --- the numbers ----------------------------------------------------------------------------------------------
	const M_T = '\\htmlClass{q-matter}{m}';
	/** A number of the readouts, three figures; anything below a millionth of a millionth is zero. */
	const n3 = (x: number) => texNumber(Math.abs(x) < 1e-12 ? 0 : x, 3);
	const n2 = (x: number) => texNumber(Math.abs(x) < 1e-12 ? 0 : x, 2);
	const MOMENTUM = '\\,\\mathrm{kg\\,m\\,s^{-1}}';
	const epsUnit = (t: Tide) =>
		t === 'uniform' ? '\\,\\mathrm{m\\,s^{-1}}' : '\\,\\mathrm{s^{-1}}';
	const epsDigits = (t: Tide) => (t === 'uniform' ? 2 : 1);
	const epsTex = (t: Tide, e: number) => `\\epsilon = ${e.toFixed(epsDigits(t))}${epsUnit(t)}`;
	const epsWords = $derived(
		`ε = ${eps < 0 ? '−' : ''}${Math.abs(eps).toFixed(epsDigits(tide))} ${STRENGTH[tide].unit}`
	);
	const slopeTex = (t: Tide) =>
		t === 'uniform' ? "g = x,\\ g'(q) = 1" : "g = \\tfrac12 x^2,\\ g'(q) = q";
	const SPLIT = `\\epsilon p\\,g'(q) + \\tfrac12\\epsilon^2 ${M_T}\\,g'(q)^2`;

	const cartTex = `${M_T} = 2\\,\\mathrm{kg},\\ k = 50\\,\\mathrm{N\\,m^{-1}}`;
	const omegaTex = `\\omega = \\sqrt{k/${M_T}} = ${texNumber(OMEGA, 2)}\\,\\mathrm{s^{-1}}`;
	const periodTex = `2\\pi/\\omega = ${PERIOD.toFixed(2)}\\,\\mathrm{s}`;

	const halves = $derived(halfAxes(cart.E));
	const energyTex = $derived(
		`H = \\dfrac{p^2}{2${M_T}} + \\tfrac12 kq^2 = ${n3(cart.E)}\\,\\mathrm{J}`
	);
	const axesTex = $derived(
		`\\sqrt{2E/k} = ${n3(halves.q)}\\,\\mathrm{m},\\ \\sqrt{2${M_T}E} = ${n3(halves.p)}${MOMENTUM}`
	);
	const areaTex = $derived(`2\\pi E/\\omega = ${n3(area(cart.E))}\\,\\mathrm{J\\,s}`);

	const tideTex = $derived(`${slopeTex(tide)},\\ ${epsTex(tide, eps)}`);
	const pushTex = $derived(
		tide === 'uniform'
			? `\\Delta p = \\epsilon ${M_T} = ${n3(impulse(tide, eps, 0))}${MOMENTUM}`
			: `\\Delta p = \\epsilon ${M_T} q = ${n3(eps * MASS)}\\,\\mathrm{kg\\,s^{-1}} \\times q`
	);

	const kickTex = $derived.by(() => {
		if (!last) return undefined;
		const g = last.gain;
		const before = energy(last.before);
		const after = energy(last.after);
		return {
			at: `q = ${n2(last.before.q)}\\,\\mathrm{m},\\ p = ${n2(last.before.p)}${MOMENTUM}`,
			by: `${epsTex(last.tide, last.eps)},\\ \\Delta p = \\epsilon ${M_T}\\,g'(q) = ${n3(last.after.p - last.before.p)}${MOMENTUM}`,
			split: `\\Delta E = ${SPLIT}`,
			sum: `= ${n3(g.motion)} + ${n3(g.alone)} = ${n3(g.total)}\\,\\mathrm{J}`,
			energy: `E\\colon ${n3(before)} \\to ${n3(after)}\\,\\mathrm{J}`,
			area: `2\\pi E/\\omega\\colon ${n3(area(before))} \\to ${n3(area(after))}\\,\\mathrm{J\\,s}`
		};
	});
	const shares = $derived.by(() => {
		if (!last) return undefined;
		const { motion, alone } = last.gain;
		const whole = Math.abs(motion) + alone;
		if (whole < 1e-15) return { motion: 0, alone: 0 };
		return { motion: Math.abs(motion) / whole, alone: alone / whole };
	});

	const copiesTex = $derived.by(() => {
		if (!last?.copies || !twoCopies) return undefined;
		const c = last.copies;
		return {
			gains: `\\Delta E_+ = ${n3(c.plus)}\\,\\mathrm{J},\\ \\Delta E_- = ${n3(c.minus)}\\,\\mathrm{J}`,
			average: `\\tfrac12(\\Delta E_+ + \\Delta E_-) = ${n3(c.average)}\\,\\mathrm{J} = \\tfrac12\\epsilon^2 ${M_T}\\,g'(q)^2`,
			difference: `\\tfrac12(\\Delta E_+ - \\Delta E_-) = ${n3(c.halfDifference)}\\,\\mathrm{J} = \\epsilon p\\,g'(q)`
		};
	});

	const joules = (x: number) => `${n3(x)}\\,\\mathrm{J}`;

	const description = $derived(
		`The cart's phase space, q to the right and p up. Its state goes clockwise round an ellipse of energy ${cart.E.toFixed(3)} joules. ` +
			(last
				? `The last kick moved it ${last.after.p >= last.before.p ? 'up' : 'down'} by ${Math.abs(last.after.p - last.before.p).toFixed(2)} kilogram metres per second, from the dashed ellipse. `
				: '') +
			'Below, the cart on its track at the same q' +
			(twoCopies ? ', and its copy, kicked the other way.' : '.')
	);
	const pointText = $derived(
		`q = ${now.q.toFixed(3)} m, p = ${now.p.toFixed(2)} kg m/s, ${now.p > 0 ? 'moving right' : now.p < 0 ? 'moving left' : 'at rest'}`
	);
	const degrees = $derived(Math.round(((((angleNow * 180) / Math.PI) % 360) + 360) % 360));
</script>

<div class="phase-space">
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
				Kick the cart as it passes the centre of its swing, moving. Does it gain the same energy as
				from a kick at the end of its swing, at rest?
			{:else}
				Switch on two copies and kick them as they move, one by <Tex math="\epsilon" /> and the other
				by <Tex math="-\epsilon" />. What is the average of their two gains?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && answered}
				<strong>No.</strong> The kick leaves <Tex math={`\\Delta E = ${SPLIT}`} trust />. For the
				uniform tide <Tex math="g'(q) = 1" />, and the first part is <Tex math="\epsilon p" />:
				largest at the centre, where the cart moves fastest, a gain or a loss as the kick goes with
				the motion or against it, and zero at the end, where <Tex math="p = 0" />. For the tidal one
				<Tex math="g'(q) = q" />, and a kick at the centre gives nothing at all, since
				<Tex math="g'(0) = 0" />. Your kicks with the {answered.tide} tide left
				<Tex math={joules(answered.centre)} /> near the centre and <Tex
					math={joules(answered.end)}
				/>
				near the end.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong
					><Tex math={`\\tfrac12\\epsilon^2 ${M_T}\\,g'(q)^2`} trust />, what a cart at rest at the
					same place would gain.</strong
				>
				The first part, <Tex math="\epsilon p\,g'(q)" />, has opposite signs in the two copies and
				cancels in their average, and half the difference of the two gains gives it back. Kicking
				one cart twice, by <Tex math="\epsilon" /> and then by <Tex math="-\epsilon" />, would not
				do: the second kick acts on the state the first left, and undoes it.
			{:else if step === 1}
				The answer appears when you have kicked the cart near the centre of its swing and near one
				end, with the same tide and strength.
			{:else}
				The answer appears when you have kicked two copies with a strength other than zero.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointermove={follow}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-plane">
					<rect
						x={layout.plane.x}
						y={layout.plane.y}
						width={layout.plane.w}
						height={layout.plane.h - STRIP}
					/>
				</clipPath>
			</defs>

			<text class="title" x={layout.plane.x + 4} y={layout.plane.y - 8 * u}>Phase space</text>
			<text class="title end" x={layout.plane.x + layout.plane.w - 4} y={layout.plane.y - 8 * u}
				>E = {Number(cart.E.toPrecision(3))} J</text
			>

			<!-- the plane: a light grid, the axes, their names and ticks -->
			<rect
				class="panel"
				x={layout.plane.x + 0.5}
				y={layout.plane.y + 0.5}
				width={layout.plane.w - 1}
				height={layout.plane.h - 1}
				rx="8"
			/>
			{#each qTicks.values as v (v)}
				<line
					class={['grid', { axis: v === 0 }]}
					x1={X(v)}
					x2={X(v)}
					y1={layout.plane.y + 6}
					y2={gridBottom}
				/>
				<text class="small tick" x={X(v)} y={gridBottom + 14 * u}>{label(v, qTicks.step)}</text>
			{/each}
			{#each pTicks.values as v (v)}
				<line
					class={['grid', { axis: v === 0 }]}
					x1={gridLeft}
					x2={layout.plane.x + layout.plane.w - 6}
					y1={Y(v)}
					y2={Y(v)}
				/>
				<text class="small p-tick" x={gridLeft - 5 * u} y={Y(v)}>{label(v, pTicks.step)}</text>
			{/each}
			<text class="axis-name" x={layout.plane.x + layout.plane.w - 10 * u} y={cy - 7 * u}
				><tspan class="it">q</tspan>, m</text
			>
			<text class="axis-name start" x={cx + 7 * u} y={layout.plane.y + 14 * u}
				><tspan class="it">p</tspan>, kg m/s</text
			>

			<g clip-path="url(#{uid}-plane)">
				<!-- the ellipses: before the last kick, the copy's, and the cart's now with its area -->
				{#if beforeEllipse}
					<ellipse class="before" {cx} {cy} rx={beforeEllipse.rx} ry={beforeEllipse.ry} />
				{/if}
				{#if copyEllipse}
					<ellipse class="copy-orbit" {cx} {cy} rx={copyEllipse.rx} ry={copyEllipse.ry} />
				{/if}
				<ellipse class="orbit" {cx} {cy} rx={nowEllipse.rx} ry={nowEllipse.ry} />
				<ellipse
					class="orbit-hit"
					{cx}
					{cy}
					rx={nowEllipse.rx}
					ry={nowEllipse.ry}
					role="presentation"
					onpointerdown={grab}
				/>
				{#if sense}
					<path class="sense" d={sense} />
				{/if}

				<!-- the last kick: straight up or down, from where it found the cart -->
				{#if kickArrows}
					{#if kickArrows.copy}
						<path class="shaft kick copy-kick" d={kickArrows.copy.shaft} />
						<path class="head kick copy-kick" d={kickArrows.copy.head} />
					{/if}
					{#if kickArrows.cart}
						<path class="shaft kick" d={kickArrows.cart.shaft} />
						<path class="head kick" d={kickArrows.cart.head} />
					{/if}
					<circle class="kicked-at" cx={kickArrows.from.x} cy={kickArrows.from.y} r={2.4 * u} />
				{/if}

				<!-- the guide down to the cart -->
				<line class="guide" x1={point.x} x2={point.x} y1={point.y} y2={gridBottom} />

				<!-- the copy, in step or parted -->
				{#if twoCopies}
					{#if copy}
						<circle class="copy-point" cx={copyPoint.x} cy={copyPoint.y} r={DOT - 0.6 * u} />
					{:else}
						<circle class="copy-ring" cx={point.x} cy={point.y} r={DOT + 3 * u} />
					{/if}
				{/if}
			</g>

			<!-- the cart's state: dragged round its ellipse, or moved with the arrow keys -->
			<g
				class="point"
				transform="translate({f2(point.x)} {f2(point.y)})"
				role="slider"
				tabindex="0"
				aria-label="The cart’s state. Arrow keys move it round its ellipse, Page Up and Page Down by a quarter turn; Enter kicks."
				aria-valuemin={0}
				aria-valuemax={359}
				aria-valuenow={degrees}
				aria-valuetext={pointText}
				onpointerdown={grab}
				onkeydown={pointKey}
			>
				<circle class="hit" r={15 * u} />
				<circle class="focus" r={10 * u} />
				<circle class="dot" r={DOT} />
			</g>

			<!-- the tracks -->
			{#each twoCopies && copyTrack ? [{ box: layout.track, t: mainTrack, copy: false }, { box: layout.copyTrack, t: copyTrack, copy: true }] : [{ box: layout.track, t: mainTrack, copy: false }] as row (row.copy)}
				{@const t = row.t}
				<line class="relaxed" x1={cx} x2={cx} y1={row.box.y + 2} y2={t.rail} />
				<line
					class="guide"
					x1={t.x}
					x2={t.x}
					y1={row.box.y}
					y2={t.rail - 23}
					opacity={row.copy && copy ? 0 : 1}
				/>
				{#each t.kicks as k, i (i)}
					<circle class="place" cx={k.at.x} cy={k.at.y} r={1.6 * u} />
					{#if k.arrow}
						<path class="shaft tide-kick" d={k.arrow.shaft} />
						<path class="head tide-kick" d={k.arrow.head} />
					{/if}
				{/each}
				<line class="rail" x1={WALL} x2={row.box.x + row.box.w - 4} y1={t.rail} y2={t.rail} />
				<line class="wall" x1={WALL} x2={WALL} y1={t.rail - 30} y2={t.rail} />
				{#each [0, 1, 2, 3] as i (i)}
					<line
						class="wall-hatch"
						x1={WALL}
						x2={WALL - 5}
						y1={t.rail - 28 + i * 8}
						y2={t.rail - 23 + i * 8}
					/>
				{/each}
				<path class="spring" d={t.spring} />
				<g class={['cart', { 'is-copy': row.copy }]} transform="translate({f2(t.x)} {f2(t.rail)})">
					<rect x={-CART_W / 2} y="-24" width={CART_W} height="17" rx="3" />
					<circle class="wheel" cx="-11" cy="-3.5" r="3.5" />
					<circle class="wheel" cx="11" cy="-3.5" r="3.5" />
				</g>
				{#if t.flash}
					<path class="shaft push" d={t.flash.shaft} />
					<path class="head push" d={t.flash.head} />
				{/if}
				<text class="small track-name" x={WALL} y={t.rail + 15 * u}
					>{row.copy
						? 'The copy, kicked by −ε'
						: twoCopies
							? 'The cart, kicked by ε'
							: 'The cart on its track'}</text
				>
				{#if !row.copy}
					<text class="small dim tick" x={cx} y={t.rail + 15 * u}>q = 0</text>
				{/if}
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch orbit-key"></span>the cart’s ellipse now</li>
			{#if last}
				<li><span class="swatch before-key"></span>before the last kick</li>
				<li><span class="swatch kick-key"></span>the kick</li>
			{/if}
			{#if twoCopies}
				<li><span class="swatch copy-key"></span>the copy</li>
			{/if}
			<li><span class="swatch tide-key"></span>the tide’s kick at each place</li>
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
			<button type="button" class="action kick-button" onclick={doKick}>
				<HugeiconsIcon icon={FlashIcon} size={16} strokeWidth={1.7} />
				{twoCopies ? 'Kick both' : 'Kick'}
			</button>
			<button type="button" class="action" onclick={startAgain}>
				<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
				Start again
			</button>
			<p class="hint">
				Pause and drag the point round its ellipse to choose where to kick, or reach it with Tab:
				the arrow keys step it round, Page Up and Page Down by a quarter turn, and Enter kicks.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-energy"
				label="Energy as prepared"
				icon={EnergyIcon}
				min={LEAST_ENERGY}
				max={MOST_ENERGY}
				step={ENERGY_STEP}
				bind:value={() => prepared, setPrepared}
				readout="E = {prepared.toFixed(2)} J"
				mark={{ at: CHAPTER_ENERGY, label: 'the chapter’s' }}
			/>
			<Slider
				id="{uid}-strength"
				label="Strength of the tide"
				icon={GravityIcon}
				min={-STRENGTH[tide].most}
				max={STRENGTH[tide].most}
				step={STRENGTH[tide].step}
				bind:value={() => eps, setStrength}
				readout={epsWords}
				mark={{ at: 0, label: 'no kick' }}
			/>
		</div>
		<div class="choices">
			<Segmented
				label="The tide"
				options={[
					{ value: 'uniform', label: 'Uniform, g = x', icon: MoveRightIcon },
					{ value: 'tidal', label: 'Tidal, g = ½x²', icon: ArrowHorizontalIcon }
				]}
				bind:value={tide}
			/>
			<Toggle
				icon={Copy01Icon}
				label="Two copies, kicked both ways"
				bind:checked={() => twoCopies, setCopies}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The cart</dt>
				<dd>
					<Tex math={cartTex} trust /><Tex math={omegaTex} trust /><span class="also"
						>one swing there and back takes <Tex math={periodTex} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Its ellipse now</dt>
				<dd>
					<Tex math={energyTex} trust /><span class="also"
						>half-axes <Tex math={axesTex} trust /></span
					><span class="also">area <Tex math={areaTex} /></span>
				</dd>
			</div>
			<div class="row">
				<dt>The tide</dt>
				<dd>
					<Tex math={tideTex} /><span class="also">each kick adds <Tex math={pushTex} trust /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The last kick</dt>
				{#if kickTex && shares && last}
					<dd class="energy">
						<span class="also"
							>at <Tex math={kickTex.at} />, by <Tex math={kickTex.by} trust /></span
						>
						<span><Tex math={kickTex.split} trust /> <Tex math={kickTex.sum} /></span>
						<span class="split" aria-hidden="true"
							><span class="motion" style:width="{100 * shares.motion}%"></span><span
								class="alone"
								style:width="{100 * shares.alone}%"
							></span></span
						>
						<span class="also"
							><span class="key motion-key"></span>from the motion, <Tex
								math="\epsilon p\,g'(q)"
							/>,
							<Tex math={joules(last.gain.motion)} /></span
						>
						<span class="also"
							><span class="key alone-key"></span>from the kick alone, <Tex
								math={`\\tfrac12\\epsilon^2 ${M_T}\\,g'(q)^2`}
								trust
							/>, <Tex math={joules(last.gain.alone)} /></span
						>
						<span class="also"><Tex math={kickTex.energy} />, <Tex math={kickTex.area} /></span>
					</dd>
				{:else}
					<dd><span class="also">Kick the cart to see what it gains.</span></dd>
				{/if}
			</div>
			{#if copiesTex}
				<div class="row">
					<dt>The two copies</dt>
					<dd class="checks">
						<span><Tex math={copiesTex.gains} /></span>
						<span>their average, <Tex math={copiesTex.average} trust /></span>
						<span>half their difference, <Tex math={copiesTex.difference} /></span>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			The point is the cart’s state <Tex math="(q, p)" />, with <Tex math="q" /> to the right and
			<Tex math="p" /> up, and the cart below is drawn at the same <Tex math="q" />. The point goes
			round its ellipse clockwise. A kick changes <Tex math="p" /> and not <Tex math="q" />, so it
			moves the point straight up or down, onto a new ellipse.
			{#if twoCopies}
				The copy is prepared alike and moves in step with the cart until a kick gives it
				<Tex math="-\epsilon" /> where the cart gets <Tex math="\epsilon" />; each kick prepares it
				alike again.
			{/if}
		</p>
		<p class="note">
			The short arrows over the track are the kick <Tex math={`\\epsilon ${M_T}\\,g'(q)`} trust /> the
			tide gives a cart at each place, to the same scale as the jump of <Tex math="p" /> in the plane.
			The two axes are in different units, so the ellipse may be drawn of any width; its area is
			<Tex math="2\pi E/\omega" /> whatever the drawing. The motion is shown four times slower than it
			is.
		</p>
	</div>
</div>

<style>
	.phase-space {
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
		padding: 0.5rem 0.6rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging * {
		cursor: grabbing;
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

	.p-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		font-size: calc(11px * var(--u, 1));
		fill: var(--text-dim);
		text-anchor: end;
	}

	.axis-name.start {
		text-anchor: start;
	}

	.it {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.2em;
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
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.orbit {
		fill: color-mix(in srgb, var(--accent) 9%, transparent);
		stroke: var(--accent);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.orbit-hit {
		fill: none;
		stroke: transparent;
		stroke-width: calc(16px * var(--u, 1));
		cursor: grab;
		touch-action: none;
	}

	.sense {
		fill: var(--accent);
		pointer-events: none;
	}

	.before {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3.5px * var(--u, 1));
		pointer-events: none;
	}

	.copy-orbit {
		fill: none;
		stroke: color-mix(in srgb, var(--accent-2) 75%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		pointer-events: none;
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
		pointer-events: none;
	}

	.head {
		pointer-events: none;
	}

	.shaft.kick,
	.shaft.push {
		stroke: var(--q-field);
	}

	.head.kick,
	.head.push {
		fill: var(--q-field);
	}

	.shaft.push {
		stroke-width: calc(2px * var(--u, 1));
	}

	.copy-kick {
		opacity: 0.6;
	}

	.shaft.tide-kick {
		stroke: color-mix(in srgb, var(--q-field) 70%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.head.tide-kick {
		fill: color-mix(in srgb, var(--q-field) 70%, transparent);
	}

	.place {
		fill: color-mix(in srgb, var(--q-field) 70%, transparent);
	}

	.kicked-at {
		fill: var(--bg-sunken);
		stroke: var(--q-field);
		stroke-width: calc(1.2px * var(--u, 1));
		pointer-events: none;
	}

	.guide {
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
		pointer-events: none;
	}

	.copy-point {
		fill: color-mix(in srgb, var(--accent-2) 70%, var(--bg));
		stroke: var(--bg-sunken);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.copy-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--accent-2) 75%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.point {
		cursor: grab;
		touch-action: none;
	}

	.point:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.point:focus-visible .focus {
		opacity: 1;
	}

	.dot {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the tracks ------------------------------------------------------------------------- */

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

	.cart.is-copy rect {
		fill: color-mix(in srgb, var(--accent-2) 14%, var(--bg));
		stroke: color-mix(in srgb, var(--accent-2) 75%, transparent);
	}

	.wheel {
		fill: var(--bg);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.track-name {
		fill: var(--text-dim);
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

	.orbit-key {
		border-color: var(--accent);
	}

	.before-key {
		border-top-style: dashed;
		border-color: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.kick-key {
		border-color: var(--q-field);
		border-top-width: 2px;
	}

	.copy-key {
		border-color: color-mix(in srgb, var(--accent-2) 75%, transparent);
	}

	.tide-key {
		border-color: color-mix(in srgb, var(--q-field) 70%, transparent);
		border-top-width: 1px;
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

	.kick-button {
		border-color: color-mix(in srgb, var(--q-field) 60%, transparent);
		background: color-mix(in srgb, var(--q-field) 10%, var(--bg));
	}

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	.kick-button :global(svg) {
		color: var(--q-field);
	}

	@media (hover: hover) {
		.play:hover,
		.action:hover {
			border-color: var(--accent);
		}

		.kick-button:hover {
			border-color: var(--q-field);
		}
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders,
	.choices {
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

	.energy {
		flex-direction: column;
		align-items: flex-start !important;
		gap: 0.25rem !important;
	}

	.energy .split {
		display: flex;
		width: 100%;
		height: 0.45rem;
		border-radius: 3px;
		overflow: hidden;
		background: color-mix(in srgb, var(--text) 8%, transparent);
	}

	.split .motion,
	.motion-key {
		background: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.split .alone,
	.alone-key {
		background: var(--q-field);
	}

	.key {
		display: inline-block;
		width: 0.7rem;
		height: 0.45rem;
		margin-right: 0.35rem;
		border-radius: 2px;
	}

	.checks {
		flex-direction: column;
		align-items: flex-start !important;
		gap: 0.2rem !important;
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

		.sliders,
		.choices {
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
