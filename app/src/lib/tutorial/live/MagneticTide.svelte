<script lang="ts">
	/**
	 * Chapter 7.5's magnetic tide, in three scenes chosen by tabs (./magnetic-tide.ts). A passing mass: a pixel, a
	 * ring of twelve free balls in the observer's colour drawn as chapter 7.2's ellipse for 𝓔, between two
	 * gyroscopes on the line of sight; a 70 kg mass 1 m to its right with a velocity arrow dragged or turned with the
	 * keys. Its magnetic part, eq:magnetic-point, turns the gyroscopes relative to one another, drawn sped up; it
	 * vanishes when the mass moves along the line of sight, and |𝓑|/|𝓔| = √3 v⊥/c. A spinning body: a ball, a thin
	 * shell, or a ball inside a counter-turning shell, 1000 kg and 0.5 m, 1.5 m away, spun about an axis out of the
	 * screen; the spin dipole at the pixel depends on the body only through L = CΩ. The equator: a slider for C/MR²,
	 * to the shell's ⅔, and the Earth's reading 𝓑_xz = −7.15 × 10⁻¹² (1 − C/MR²) s⁻² as the sum of two bars. The
	 * figure opens on the passing mass at 1.4 m s⁻¹ across the line, playing. Three predictions at the top, one for
	 * each scene, are answered once the reader has done what each asks. Under reduced motion it opens paused, the
	 * senses of the turning drawn as arrows.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowUpRight01Icon,
		DashboardSpeed01Icon,
		EarthIcon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		Rotate01Icon,
		CircleIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BALANCE,
		BODY,
		EARTH,
		GYRO_FAST,
		INNER,
		OPENING,
		PERSON,
		RATE,
		RATIO,
		RATIO_MARKS,
		SHELL_RATIO,
		SPIN_SLOW,
		STRETCH,
		dragged,
		equator,
		equatorFactor,
		inUnits,
		landed,
		noteFirst,
		noteSecond,
		noteThird,
		passing,
		ratioWords,
		ringStretch,
		spinning,
		spun,
		stepped,
		straightAt,
		texThree,
		three,
		velocityKey,
		velocityVector,
		type Body,
		type Mode,
		type Range,
		type Spun,
		type Velocity
	} from './magnetic-tide';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let mode = $state<Mode>(OPENING.mode);
	let velocity = $state<Velocity>(OPENING.velocity);
	let body = $state<Body>(OPENING.body);
	let rate = $state(OPENING.rate);
	let inner = $state(OPENING.inner);
	let ratio = $state(OPENING.ratio);

	const MODES: Mode[] = ['passing', 'spinning', 'equator'];

	function setMode(m: Mode) {
		mode = m;
		step = (MODES.indexOf(m) + 1) as 1 | 2 | 3;
		note();
	}
	function setVelocity(v: Velocity) {
		if (v.speed === velocity.speed && v.angle === velocity.angle) return;
		velocity = v;
		note();
	}
	function setBody(b: Body) {
		body = b;
		note();
	}
	function setRate(v: number) {
		rate = landed(v, RATE);
		note();
	}
	function setInner(v: number) {
		inner = landed(v, INNER);
		note();
	}
	function setRatio(v: number) {
		ratio = landed(v, RATIO);
		note();
	}

	function reset() {
		velocity = OPENING.velocity;
		body = OPENING.body;
		rate = OPENING.rate;
		inner = OPENING.inner;
		ratio = OPENING.ratio;
		turns = { passing: 0, spinning: 0 };
		spin = 0;
		note();
	}

	/** Arrow keys step a slider onto its grid, stopping at its marks, with Shift by a larger step. */
	function sliderKeys(get: () => number, set: (v: number) => void, range: Range) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const next = stepped(get(), e.key, e.shiftKey, range);
			if (next === undefined) return;
			e.preventDefault();
			set(next);
			note();
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	/** The rates at which a ball and a shell have been shown spinning. */
	let seen: Spun = {};
	/** The rate at which the ball and the shell were first compared, for the second answer's numbers. */
	let secondRate = $state(OPENING.rate);
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		first = noteFirst(first, velocity);
		if (mode === 'spinning') seen = spun(seen, body, rate);
		if (!second && noteSecond(false, seen)) secondRate = rate;
		second = noteSecond(second, seen);
		third = noteThird(third, ratio);
	}

	function pick(n: 1 | 2 | 3) {
		setMode(MODES[n - 1]);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const pass = $derived(passing(velocity));
	const spinNow = $derived(spinning(body, rate, inner));
	const eq = $derived(equator(ratio));
	const secondBall = $derived(spinning('ball', secondRate));
	const secondShell = $derived(spinning('shell', secondRate));
	const shellReading = equator(SHELL_RATIO).reading;
	const vVec = $derived(velocityVector(velocity));

	// --- the time ---------------------------------------------------------------------------------------------------
	let playing = $state(true);
	/** The gyroscopes' relative turning as drawn, radians, in each scene; the body's spin as drawn. */
	let turns = $state({ passing: 0, spinning: 0 });
	let spin = $state(0);

	function advance(dt: number) {
		if (mode === 'passing') {
			turns.passing = (turns.passing + pass.gyro * GYRO_FAST.passing * dt) % (4 * Math.PI);
		} else if (mode === 'spinning') {
			turns.spinning = (turns.spinning + spinNow.gyro * GYRO_FAST.spinning * dt) % (4 * Math.PI);
			spin = (spin + (rate / SPIN_SLOW) * dt) % (2 * Math.PI);
		}
	}

	let checked = false;
	/** Turns the gyroscopes and the body while playing; under reduced motion it opens paused. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		const still = mode === 'equator';
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on || still) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			advance(dt);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const WIDE = {
		W: 640,
		H: { passing: 326, spinning: 346, equator: 370 },
		passing: { turn: false, px: 165, py: 114, S: 300, A: 36, mass: 30, ring: 64, gyro: 123, h: 28 },
		spinning: { px: 120, py: 142, S: 180, ring: 44, gyro: 85, h: 20 },
		equator: {
			ex: 140,
			ey: 165,
			er: 100,
			arrow: 56,
			x0: 340,
			x1: 624,
			rows: [72, 138, 212],
			axis: 282
		},
		words: {
			passing: { status: { x: 24, y: 268 }, scale: { x: 400, y: 268 } },
			spinning: { status: { x: 24, y: 286 }, scale: { x: 400, y: 286 } }
		},
		line: 15
	};
	const PHONE = {
		W: 360,
		H: { passing: 532, spinning: 362, equator: 402 },
		// on a phone the line of sight runs down the page, the mass below the pixel
		passing: { turn: true, px: 180, py: 128, S: 186, A: 26, mass: 22, ring: 48, gyro: 93, h: 20 },
		spinning: { px: 82, py: 100, S: 130, ring: 30, gyro: 60, h: 14 },
		equator: {
			ex: 95,
			ey: 100,
			er: 62,
			arrow: 44,
			x0: 16,
			x1: 344,
			rows: [222, 268, 314],
			axis: 368
		},
		words: {
			passing: { status: { x: 10, y: 416 }, scale: { x: 10, y: 474 } },
			spinning: { status: { x: 10, y: 224 }, scale: { x: 10, y: 288 } }
		},
		line: 16
	};
	const box = $derived(phone.current ? PHONE : WIDE);

	type Pt = { x: number; y: number };

	/**
	 * A step on the page for a step in the plane of the motion, x along n̂ and y across it, y up: across the page, or,
	 * turned a quarter clockwise for a phone, n̂ down the page. Both keep the sense of a turn.
	 */
	const onPage = (turn: boolean, dx: number, dy: number): Pt =>
		turn ? { x: dy, y: dx } : { x: dx, y: -dy };
	const add = (c: Pt, d: Pt): Pt => ({ x: c.x + d.x, y: c.y + d.y });

	/** A straight arrow from a to b: its shaft and its head. */
	function arrow(a: Pt, b: Pt, head = 7 * u, wide = 3.2 * u) {
		const l = Math.hypot(b.x - a.x, b.y - a.y);
		if (l < 1e-6) return undefined;
		const t = { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
		const hd = Math.min(head, 0.6 * l);
		const base = { x: b.x - t.x * hd, y: b.y - t.y * hd };
		return {
			shaft: `M${f2(a.x)},${f2(a.y)}L${f2(base.x + t.x * 0.5)},${f2(base.y + t.y * 0.5)}`,
			head: `${f2(b.x)},${f2(b.y)} ${f2(base.x - t.y * wide)},${f2(base.y + t.x * wide)} ${f2(base.x + t.y * wide)},${f2(base.y - t.x * wide)}`
		};
	}

	/** A curved arrow round c from the angle a0 to a1, degrees anticlockwise from the right, its head at a1. */
	function arc(c: Pt, rho: number, a0: number, a1: number, head = 6 * u) {
		const at = (a: number) => ({
			x: c.x + rho * Math.cos((a * Math.PI) / 180),
			y: c.y - rho * Math.sin((a * Math.PI) / 180)
		});
		const p0 = at(a0);
		const p1 = at(a1);
		const s = a1 > a0 ? 1 : -1;
		const r1 = (a1 * Math.PI) / 180;
		// the tangent at the head, on the page (y down), in the sense of travel
		const t = { x: -s * Math.sin(r1), y: -s * Math.cos(r1) };
		const n = { x: Math.cos(r1), y: -Math.sin(r1) };
		const base = { x: p1.x - t.x * head, y: p1.y - t.y * head };
		const w = 0.5 * head;
		const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
		const sweep = s > 0 ? 0 : 1;
		const end = at(a1 - s * ((head * 0.8) / rho) * (180 / Math.PI));
		return {
			d: `M${f2(p0.x)},${f2(p0.y)}A${f2(rho)},${f2(rho)} 0 ${large} ${sweep} ${f2(end.x)},${f2(end.y)}`,
			head: `${f2(p1.x)},${f2(p1.y)} ${f2(base.x + n.x * w)},${f2(base.y + n.y * w)} ${f2(base.x - n.x * w)},${f2(base.y - n.y * w)}`
		};
	}

	/** The ring of twelve free balls round c, stretched by 2a along the line and squeezed by a across it. */
	function ring(c: Pt, rho: number, a: number, turn = false) {
		const at = (phi: number) =>
			add(c, onPage(turn, rho * (1 + 2 * a) * Math.cos(phi), rho * (1 - a) * Math.sin(phi)));
		const balls = Array.from({ length: 12 }, (_, k) => at((2 * Math.PI * k) / 12));
		const piece = (from: number, to: number) => {
			const n = 12;
			let d = '';
			for (let i = 0; i <= n; i++) {
				const p = at(((from + ((to - from) * i) / n) * Math.PI) / 180);
				d += `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`;
			}
			return d;
		};
		return {
			balls,
			rx: rho * (turn ? 1 - a : 1 + 2 * a),
			ry: rho * (turn ? 1 + 2 * a : 1 - a),
			stretch: [piece(-28, 28), piece(152, 208)],
			squeeze: [piece(62, 118), piece(242, 298)]
		};
	}

	/** A gyroscope at c, its axle turned by the angle θ, radians anticlockwise, from straight up. */
	const gyroTransform = (c: Pt, theta: number) =>
		`translate(${f2(c.x)} ${f2(c.y)}) rotate(${f2((-theta * 180) / Math.PI)})`;

	/**
	 * The two gyroscopes, on the line of sight either side of the pixel, and their curved arrows, drawn on the side of
	 * each gyroscope away from the ring.
	 */
	function gyros(c: Pt, off: number, h: number, rel: number, turn: number, turned = false) {
		const left = add(c, onPage(turned, -off, 0));
		const right = add(c, onPage(turned, off, 0));
		const s = Math.sign(rel);
		const rho = h + 6 * u;
		const [cl, cr] = turned ? [90, 270] : [90, 90];
		// δΩ is the right one's turning less the left one's: each is drawn turning by half, in opposite senses
		const arrows =
			s === 0
				? []
				: [
						s > 0 ? arc(right, rho, cr - 45, cr + 45) : arc(right, rho, cr + 45, cr - 45),
						s > 0 ? arc(left, rho, cl + 45, cl - 45) : arc(left, rho, cl - 45, cl + 45)
					];
		return {
			items: [
				{ key: 'left', at: left, transform: gyroTransform(left, -turn / 2) },
				{ key: 'right', at: right, transform: gyroTransform(right, turn / 2) }
			],
			arrows
		};
	}

	// the passing mass
	const P = $derived(box.passing);
	const pixelAt = $derived({ x: P.px, y: P.py });
	const massAt = $derived(add(pixelAt, onPage(P.turn, P.S * PERSON.r, 0)));
	const tip = $derived(add(massAt, onPage(P.turn, P.A * vVec[0], P.A * vVec[1])));
	const vArrow = $derived(arrow(massAt, tip, 10 * u, 4.5 * u));
	/** The letter v: past the tip and to the arrow's upper side, clear of the mass and its words. */
	const vLabel = $derived.by(() => {
		const l = Math.hypot(tip.x - massAt.x, tip.y - massAt.y) || 1;
		const t = { x: (tip.x - massAt.x) / l, y: (tip.y - massAt.y) / l };
		const n = t.x >= 0 ? { x: t.y, y: -t.x } : { x: -t.y, y: t.x };
		return { x: tip.x + 8 * u * t.x + 20 * u * n.x, y: tip.y + 8 * u * t.y + 20 * u * n.y };
	});
	const passRing = $derived(
		ring(pixelAt, P.ring, ringStretch(PERSON.M, PERSON.r, STRETCH.passing), P.turn)
	);
	const passGyros = $derived(gyros(pixelAt, P.gyro, P.h, pass.gyro, turns.passing, P.turn));

	/** The line of sight from the gyroscope nearer the mass to the mass, and where n̂ and the names go. */
	const passWords = $derived.by(() => {
		const from = add(pixelAt, onPage(P.turn, P.gyro + P.h + 6 * u, 0));
		const to = add(massAt, onPage(P.turn, -P.mass, 0));
		const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
		return P.turn
			? {
					sight: [from, to],
					n: { x: from.x + 20 * u, y: from.y + 20 * u },
					pixel: { x: P.px + P.ring + 6 * u, y: P.py + 4 * u, anchor: 'start-anchor' },
					mass:
						tip.x < massAt.x - 1
							? { x: massAt.x + P.mass + 10 * u, y: massAt.y + 4 * u, anchor: 'start-anchor' }
							: { x: massAt.x - P.mass - 10 * u, y: massAt.y + 4 * u, anchor: 'end-anchor' }
				}
			: {
					sight: [from, to],
					n: { x: mid.x, y: mid.y - 8 * u },
					pixel: { x: P.px, y: P.py + P.ring + 22 * u, anchor: 'mid' },
					mass:
						tip.y > massAt.y + 1
							? { x: massAt.x, y: massAt.y - P.mass - 10 * u, anchor: 'mid' }
							: { x: massAt.x, y: massAt.y + P.mass + 18 * u, anchor: 'mid' }
				};
	});
	const spinWords = $derived.by(() => {
		const from = { x: Q.px + Q.gyro + Q.h, y: Q.py };
		const to = { x: bodyAt.x - bodyR, y: Q.py };
		return {
			sight: [from, to],
			n: { x: (from.x + to.x) / 2, y: Q.py - 8 * u },
			pixel: { x: Q.px, y: Q.py + Q.ring + 22 * u, anchor: 'mid' }
		};
	});

	// the spinning body
	const Q = $derived(box.spinning);
	const bodyAt = $derived({ x: Q.px + Q.S * BODY.r, y: Q.py });
	const bodyR = $derived(Q.S * BODY.R);
	const spinRing = $derived(
		ring({ x: Q.px, y: Q.py }, Q.ring, ringStretch(BODY.M, BODY.r, STRETCH.spinning))
	);
	const spinGyros = $derived(
		gyros({ x: Q.px, y: Q.py }, Q.gyro, Q.h, spinNow.gyro, turns.spinning)
	);
	/** Marks on the body that turn with it: on a ball's inside, on a shell, or on both parts against each other. */
	const marks = $derived.by(() => {
		const out: { x: number; y: number; key: string }[] = [];
		const put = (n: number, rho: number, phase: number, key: string) => {
			for (let k = 0; k < n; k++) {
				const a = phase + (2 * Math.PI * k) / n;
				out.push({
					x: bodyAt.x + rho * Math.cos(a),
					y: bodyAt.y - rho * Math.sin(a),
					key: `${key}${k}`
				});
			}
		};
		if (body === 'ball') {
			put(6, 0.62 * bodyR, spin, 'b');
			put(3, 0.28 * bodyR, spin, 'c');
		} else if (body === 'shell') put(10, 0.95 * bodyR, spin, 's');
		else {
			put(5, 0.6 * inner * bodyR, spin, 'i');
			put(10, ((1 + inner) / 2) * bodyR, -spin, 'o');
		}
		return out;
	});
	const spinArrow = $derived.by(() => {
		if (rate === 0) return [];
		const rho = bodyR + 10 * u;
		if (body !== 'counter') return [arc(bodyAt, rho, 95, 165)];
		return [arc(bodyAt, rho, 165, 95), arc(bodyAt, 0.45 * inner * bodyR, 95, 185, 5 * u)];
	});

	// the equator
	const Z = $derived(box.equator);
	const pixelOnEarth = $derived({ x: Z.ex + Z.er + 10 * u, y: Z.ey });
	const uArrow = $derived(
		arrow(
			{ x: pixelOnEarth.x, y: pixelOnEarth.y - 9 * u },
			{ x: pixelOnEarth.x, y: pixelOnEarth.y - Z.arrow }
		)
	);
	const earthSpin = $derived(arc({ x: Z.ex, y: Z.ey }, Z.er + 10 * u, 110, 200));
	/** Bars on one axis from −8 to 5, in units of 10⁻¹² s⁻². */
	const axis = $derived.by(() => {
		const lo = -8;
		const hi = 5;
		const k = (Z.x1 - Z.x0) / (hi - lo);
		const X = (v: number) => Z.x0 + (v - lo) * k;
		return { X, zero: X(0), ticks: [-8, -6, -4, -2, 0, 2, 4] };
	});
	const bars = $derived.by(() => {
		const X = axis.X;
		const unit = 1e-12;
		const row = (key: string, v: number, y: number, words: string, heavy = false) => ({
			key,
			y,
			x: Math.min(X(0), X(v / unit)),
			w: Math.abs(X(v / unit) - X(0)),
			cls: heavy ? 'bar heavy' : 'bar',
			words,
			heavy
		});
		const signed = (v: number) => (v > 0 ? '+' : '') + three(v / unit);
		return [
			row('motion', eq.motion, Z.rows[0], `the pixel’s motion, the 1: ${signed(eq.motion)}`),
			row(
				'spin',
				eq.spin,
				Z.rows[1],
				`the planet’s spin, C/MR² = ${ratioWords(ratio)}: ${signed(eq.spin)}`
			),
			row('reading', eq.reading, Z.rows[2], `the reading, their sum: ${signed(eq.reading)}`, true)
		];
	});
	const planetTicks = $derived(
		[
			{ key: 'uniform', v: equator(RATIO_MARKS.uniform).reading, words: 'uniform' },
			{ key: 'shell', v: shellReading, words: 'shell' }
		].map((t) => ({ ...t, x: axis.X(t.v / 1e-12) }))
	);

	// --- dragging the velocity ---------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	let pending: PointerEvent | undefined;
	let frame = 0;

	function toVelocity(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const sx = (q.x - massAt.x) / P.A;
		const sy = (q.y - massAt.y) / P.A;
		setVelocity(P.turn ? dragged(sy, sx, velocity) : dragged(sx, -sy, velocity));
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		// a drag is not a click: the arrow does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
	}

	function move(e: PointerEvent) {
		if (!dragging) return;
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) toVelocity(pending);
			pending = undefined;
		});
	}

	function release() {
		dragging = false;
	}

	function tipKey(e: KeyboardEvent) {
		const next = velocityKey(velocity, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		setVelocity(next);
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const speedWords = (v: number) => v.toFixed(2);
	const motionKind = $derived.by(() => {
		if (velocity.speed === 0) return 'at rest';
		if (straightAt(velocity)) return 'straight at the pixel';
		if (velocity.angle === 0) return 'straight away from the pixel';
		if (velocity.angle === 90 || velocity.angle === 270) return 'across the line of sight';
		return 'at an angle to the line of sight';
	});
	const directionWords = $derived(
		`${velocity.angle}° anticlockwise from the line of sight, measured from the direction away from the pixel`
	);
	const bodyName = $derived(
		body === 'ball'
			? 'a uniform ball'
			: body === 'shell'
				? 'a thin shell'
				: `a ball of radius ${inner === BALANCE ? '0.871' : inner.toFixed(2)} R inside a counter-turning shell`
	);

	const tipLabel = $derived(
		`The mass's velocity arrow: ${speedWords(velocity.speed)} metres per second, ${directionWords}; the mass moves ${motionKind}. Drag its tip, or turn it with the left and right arrow keys, 5 degrees a press (with Shift, 15), and change its speed with the up and down arrow keys, 0.1 metres per second a press (with Shift, 0.5).`
	);

	/** The words in the drawing, by scene: what it shows on the left, the scales on the right (under it on a phone). */
	const words = $derived.by(() => {
		const out: { text: string; cls: string; x: number; y: number }[] = [];
		const col = (lines: { text: string; cls: string }[], x: number, y: number) =>
			lines.forEach((l, i) => out.push({ ...l, x, y: y + box.line * i }));
		if (mode === 'passing') {
			const status =
				pass.B === 0
					? [
							{ text: `moving ${motionKind}:`, cls: 'label' },
							{ text: '𝓑 = 0, no relative turning;', cls: 'small' },
							{ text: 'the stretch is the same', cls: 'small' }
						]
					: [
							{ text: `moving ${motionKind}:`, cls: 'label' },
							{ text: '𝓑 ≠ 0: the gyroscopes turn', cls: 'small' },
							{ text: 'relative to one another', cls: 'small' }
						];
			const scale = [
				{ text: 'the stretch after 1 s, × 5 × 10⁷;', cls: 'small dim' },
				{ text: 'the gyroscopes 1 m apart on the', cls: 'small dim' },
				{ text: 'line, drawn closer, their turning', cls: 'small dim' },
				{ text: 'sped up 10²⁵ times', cls: 'small dim' }
			];
			col(status, box.words.passing.status.x, box.words.passing.status.y);
			col(scale, box.words.passing.scale.x, box.words.passing.scale.y);
		} else if (mode === 'spinning') {
			const status = [
				{
					text: bodyName.startsWith('a ball of')
						? 'a ball in a counter-turning shell:'
						: `${bodyName}:`,
					cls: 'label'
				},
				{
					text:
						spinNow.L === 0
							? rate === 0
								? 'not spinning, 𝓑 = 0'
								: 'L = 0, so 𝓑 = 0 outside,'
							: `L = ${three(spinNow.L)} kg m² s⁻¹`,
					cls: 'small'
				},
				{
					text:
						spinNow.L === 0
							? rate === 0
								? ''
								: 'though all of it moves'
							: spinNow.overBall !== undefined && body !== 'ball'
								? `𝓑 is ${spinNow.overBall.toFixed(2)} times a ball’s`
								: 'the same pull outside as a shell’s',
					cls: 'small'
				}
			].filter((l) => l.text);
			const scale = [
				{ text: 'the stretch after 1 s, × 10⁷;', cls: 'small dim' },
				{ text: 'the spin drawn 25 times slower,', cls: 'small dim' },
				{ text: 'the gyroscopes’ turning sped up', cls: 'small dim' },
				{ text: '10²⁴ times; ⊙ L out of the screen', cls: 'small dim' }
			];
			col(status, box.words.spinning.status.x, box.words.spinning.status.y);
			col(scale, box.words.spinning.scale.x, box.words.spinning.scale.y);
		}
		return out;
	});

	const description = $derived.by(() => {
		if (mode === 'passing')
			return (
				`A pixel, drawn as a ring of twelve free balls stretched along the line to a 70 kg mass 1 metre to its right and squeezed across it, between two gyroscopes on that line. ` +
				`The mass moves at ${speedWords(velocity.speed)} metres per second, ${motionKind}, its sideways speed ${speedWords(pass.vPerp)} metres per second. ` +
				(pass.B === 0
					? 'Its magnetic part is zero and the gyroscopes do not turn relative to one another; the stretch is unchanged. '
					: `Its magnetic part, of size ${three(pass.B)} per second squared, turns the gyroscopes relative to one another, drawn sped up 10 to the 25 times. `) +
				`The electric part is ${three(pass.E)} per second squared; their ratio, ${three(pass.ratio)}, equals root 3 times the sideways speed over c.`
			);
		if (mode === 'spinning')
			return (
				`A pixel, a ring of twelve free balls between two gyroscopes, and 1.5 metres to its right ${bodyName} of 1000 kg and radius 0.5 metres, spun at ${rate} per second about an axis out of the screen. ` +
				`Its angular momentum is ${three(spinNow.L)} kilogram metres squared per second, and the magnetic part at the pixel ${three(spinNow.B)} per second squared` +
				(spinNow.overBall !== undefined && body !== 'ball'
					? `, ${spinNow.overBall.toFixed(2)} times a ball's at the same rate. `
					: '. ') +
				`The electric part, ${three(spinNow.E)} per second squared, is the same for every body.`
			);
		return (
			`The Earth seen from above the north pole, turning anticlockwise, with a pixel on the equator carried by the ground at 465 metres per second. ` +
			`Three bars on one axis, in units of 10 to the minus 12 per second squared: the pixel's motion, ${three(eq.motion / 1e-12)}; the planet's spin for C over M R squared = ${ratioWords(ratio)}, ${three(eq.spin / 1e-12)}; and their sum, the reading, ${three(eq.reading / 1e-12)}. ` +
			`Ticks mark a uniform Earth, minus 4.29, and a hollow shell, minus 2.38.`
		);
	});

	const summary = $derived(
		mode === 'passing'
			? `Magnetic part ${three(pass.B)} s⁻²; electric part ${three(pass.E)} s⁻²; ratio ${three(pass.ratio)}, and √3 v⊥/c = ${three(pass.rule)}.`
			: mode === 'spinning'
				? `L = ${three(spinNow.L)} kg m² s⁻¹; magnetic part ${three(spinNow.B)} s⁻².`
				: `C/MR² = ${ratioWords(ratio)}; reading 𝓑xz = ${three(eq.reading)} s⁻².`
	);

	// --- the formulas -----------------------------------------------------------------------------------------------
	const B = '\\htmlClass{q-curv}{\\mathcal B}';
	const E = '\\htmlClass{q-curv}{\\mathcal E}';
	const M = '\\htmlClass{q-matter}{M}';
	const U = '\\htmlClass{q-obs}{u}';
	const FACTOR = texThree(equatorFactor());
</script>

<div class="magnetic-tide">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => pick(n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Turn the velocity until the mass comes straight at the pixel. What does the magnetic part
				do?
			{:else if step === 2}
				Spin a shell and a ball of the same mass and size at the same rate. Which shows the larger
				magnetic part, and by how much?
			{:else}
				Can the equator’s reading reach zero for a round planet?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>It falls to zero; the stretch is unchanged.</strong> Coming straight at the pixel,
				the mass has <Tex math="\hat n\times\mathbf v = 0" />, so <Tex math={`|${B}| = 0`} trust /> and
				the gyroscopes stop turning relative to one another, while <Tex
					math={`|${E}| = ${texThree(pass.E)}\\,\\mathrm{s^{-2}}`}
					trust
				/> as before: to this order the tide does not depend on the motion. Only the sideways speed <Tex
					math="v_\perp"
				/> counts, so the magnetic part is the opposite of a Doppler radar, which sees only motion along
				the line.
				<button type="button" class="next" onclick={() => pick(2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>The shell, by 5/3.</strong> At <Tex
					math={`\\Omega = ${secondRate}\\,\\mathrm{s^{-1}}`}
				/>
				the ball has <Tex math={`L = \\tfrac25${M}R^2\\Omega = ${texThree(secondBall.L)}`} trust /> and
				the shell <Tex
					math={`\\tfrac23${M}R^2\\Omega = ${texThree(secondShell.L)}\\,\\mathrm{kg\\,m^2\\,s^{-1}}`}
					trust
				/>. Outside, the spin dipole depends on the body only through <Tex math="L" />, so <Tex
					math={`|${B}|`}
					trust
				/> is <Tex math={`${texThree(secondShell.B)}`} /> against <Tex
					math={`${texThree(secondBall.B)}\\,\\mathrm{s^{-2}}`}
				/>, a ratio of <Tex math="\tfrac23 / \tfrac25 = 5/3" />, while their pulls outside are the
				same, <Tex math={`|${E}| = ${texThree(secondBall.E)}\\,\\mathrm{s^{-2}}`} trust />.
				<button type="button" class="next" onclick={() => pick(3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>No.</strong> The reading <Tex
					math={`${B}_{xz} = -${FACTOR}\\,(1 - C/${M}R^2)\\,\\mathrm{s^{-2}}`}
					trust
				/> would vanish only at <Tex math={`C/${M}R^2 = 1`} trust />. No round body has <Tex
					math={`C/${M}R^2`}
					trust
				/> above a thin shell’s <Tex math="\tfrac23" />, with all its mass at the surface, so the
				slider stops there, where the reading is <Tex
					math={`${texThree(shellReading)}\\,\\mathrm{s^{-2}}`}
				/>, a third of <Tex math={FACTOR} />: the planet’s spin never cancels the pixel’s motion.
			{:else if step === 1}
				The answer appears once the mass moves straight at the pixel: turn its arrow onto the line
				of sight, pointing at the pixel.
			{:else if step === 2}
				The answer appears once you have spun a ball and a thin shell at the same rate.
			{:else}
				The answer appears once you have taken the slider for <Tex math={`C/${M}R^2`} trust /> as far
				as it goes.
			{/if}
		</p>
	</section>

	<div class="tabs">
		<Segmented
			label="Scene"
			bind:value={() => mode, setMode}
			options={[
				{ value: 'passing', label: 'A passing mass', icon: ArrowUpRight01Icon },
				{ value: 'spinning', label: 'A spinning body', icon: Rotate01Icon },
				{ value: 'equator', label: 'The equator', icon: EarthIcon }
			]}
		/>
	</div>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H[mode]}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<radialGradient id="{uid}-stone" cx="0.38" cy="0.34" r="0.75">
					<stop offset="0" class="stone-0" />
					<stop offset="0.65" class="stone-1" />
					<stop offset="1" class="stone-2" />
				</radialGradient>
			</defs>

			{#if mode === 'passing' || mode === 'spinning'}
				{@const S = mode === 'passing' ? P : Q}
				{@const R = mode === 'passing' ? passRing : spinRing}
				{@const gy = mode === 'passing' ? passGyros : spinGyros}
				{@const sw = mode === 'passing' ? passWords : spinWords}

				<!-- the line of sight -->
				<line
					class="sight"
					x1={f2(sw.sight[0].x)}
					y1={f2(sw.sight[0].y)}
					x2={f2(sw.sight[1].x)}
					y2={f2(sw.sight[1].y)}
				/>
				<text class="label it mid" x={f2(sw.n.x)} y={f2(sw.n.y)}>n</text>
				<text class="label mid" x={f2(sw.n.x + 0.8 * u)} y={f2(sw.n.y - 5.5 * u)}>ˆ</text>

				<!-- the pixel: the ring as it was, and as the tide leaves it -->
				<circle class="start" cx={S.px} cy={S.py} r={S.ring} />
				<ellipse class="shape" cx={S.px} cy={S.py} rx={f2(R.rx)} ry={f2(R.ry)} />
				{#each R.stretch as d, i (i)}
					<path class="tint stretch" {d} />
				{/each}
				{#each R.squeeze as d, i (i)}
					<path class="tint squeeze" {d} />
				{/each}
				{#each R.balls as b, i (i)}
					<circle class="ball" cx={f2(b.x)} cy={f2(b.y)} r={(S.ring > 40 ? 3.6 : 2.6) * u} />
				{/each}
				<text class="small {sw.pixel.anchor}" x={f2(sw.pixel.x)} y={f2(sw.pixel.y)}>the pixel</text>

				<!-- the gyroscopes, and the senses of their relative turning -->
				{#each gy.items as g (g.key)}
					<g class="gyro" transform={g.transform}>
						<line x1="0" y1={-S.h} x2="0" y2={S.h} />
						<ellipse class="rotor" cx="0" cy="0" rx={f2(0.78 * S.h)} ry={f2(0.24 * S.h)} />
						<circle class="nose" cx="0" cy={-S.h} r={2 * u} />
					</g>
				{/each}
				{#each gy.arrows as a, i (i)}
					<g class="turning">
						<path d={a.d} />
						<polygon points={a.head} />
					</g>
				{/each}
			{/if}

			{#if mode === 'passing'}
				<!-- the mass and its velocity -->
				<circle class="stone" cx={massAt.x} cy={massAt.y} r={P.mass} fill="url(#{uid}-stone)" />
				<text
					class="small {passWords.mass.anchor}"
					x={f2(passWords.mass.x)}
					y={f2(passWords.mass.y)}>70 kg, 1 m away</text
				>
				{#if vArrow}
					<g class="velocity">
						<path d={vArrow.shaft} />
						<polygon points={vArrow.head} />
					</g>
					<text class="label it mid" x={f2(vLabel.x)} y={f2(vLabel.y + 4 * u)}>v</text>
				{/if}
				<g
					class="handle"
					role="button"
					tabindex="0"
					aria-roledescription="movable arrow tip"
					aria-label={tipLabel}
					onpointerdown={grab}
					onkeydown={tipKey}
				>
					<circle class="hit" cx={f2(tip.x)} cy={f2(tip.y)} r={22 * u} />
					<circle class="focus" cx={f2(tip.x)} cy={f2(tip.y)} r={13 * u} />
					{#if !vArrow}
						<circle class="knob" cx={f2(tip.x)} cy={f2(tip.y)} r={4 * u} />
					{/if}
				</g>
			{:else if mode === 'spinning'}
				<!-- the body, its parts turning -->
				{#if body === 'shell'}
					<circle class="hollow" cx={bodyAt.x} cy={bodyAt.y} r={f2(bodyR * 0.9)} />
					<circle
						class="shell"
						cx={bodyAt.x}
						cy={bodyAt.y}
						r={f2(bodyR * 0.95)}
						stroke="url(#{uid}-stone)"
						stroke-width={f2(bodyR * 0.1)}
					/>
				{:else}
					<circle
						class="stone"
						cx={bodyAt.x}
						cy={bodyAt.y}
						r={f2(bodyR)}
						fill="url(#{uid}-stone)"
					/>
					{#if body === 'counter'}
						<circle class="seam" cx={bodyAt.x} cy={bodyAt.y} r={f2(inner * bodyR)} />
					{/if}
				{/if}
				{#each marks as m (m.key)}
					<circle class="mark" cx={f2(m.x)} cy={f2(m.y)} r={2.4 * u} />
				{/each}
				{#each spinArrow as a, i (i)}
					<g class="spin-arrow">
						<path d={a.d} />
						<polygon points={a.head} />
					</g>
				{/each}
				{#if spinNow.L !== 0}
					<!-- L out of the screen, or into it -->
					<g class="axis-mark">
						<circle cx={bodyAt.x} cy={bodyAt.y} r={6 * u} />
						{#if spinNow.L > 0}
							<circle class="dot" cx={bodyAt.x} cy={bodyAt.y} r={1.8 * u} />
						{:else}
							<path
								d="M{f2(bodyAt.x - 4 * u)},{f2(bodyAt.y - 4 * u)}L{f2(bodyAt.x + 4 * u)},{f2(
									bodyAt.y + 4 * u
								)}M{f2(bodyAt.x - 4 * u)},{f2(bodyAt.y + 4 * u)}L{f2(bodyAt.x + 4 * u)},{f2(
									bodyAt.y - 4 * u
								)}"
							/>
						{/if}
					</g>
					<text class="label it halo" x={f2(bodyAt.x + 10 * u)} y={f2(bodyAt.y - 6 * u)}>L</text>
				{/if}
				<text
					class={['small', phone.current ? 'end-anchor' : 'mid']}
					x={phone.current ? f2(box.W - 6 * u) : bodyAt.x}
					y={f2(bodyAt.y + bodyR + 26 * u)}>1000 kg, radius 0.5 m, 1.5 m away</text
				>
			{:else}
				<!-- the Earth from above the north pole, and the pixel carried round on its equator -->
				<circle class="stone" cx={Z.ex} cy={Z.ey} r={Z.er} fill="url(#{uid}-stone)" />
				<g class="spin-arrow">
					<path d={earthSpin.d} />
					<polygon points={earthSpin.head} />
				</g>
				<text class="small mid" x={Z.ex} y={f2(Z.ey + 4 * u)}>north pole</text>
				<circle class="pixel-dot" cx={f2(pixelOnEarth.x)} cy={f2(pixelOnEarth.y)} r={7 * u} />
				{#if uArrow}
					<g class="velocity obs">
						<path d={uArrow.shaft} />
						<polygon points={uArrow.head} />
					</g>
				{/if}
				<text
					class="small obs-words start-anchor"
					x={f2(pixelOnEarth.x + 8 * u)}
					y={f2(pixelOnEarth.y - Z.arrow + 4 * u)}>u = 465 m s⁻¹</text
				>
				<text
					class="small start-anchor"
					x={f2(pixelOnEarth.x + 12 * u)}
					y={f2(pixelOnEarth.y + 4 * u)}>the pixel</text
				>
				<text class="small dim mid" x={Z.ex} y={f2(Z.ey + Z.er + 24 * u)}
					>seen from above the north pole</text
				>

				<!-- the two parts and their sum -->
				{#each bars as b (b.key)}
					<line
						class="zero"
						x1={axis.zero}
						y1={f2(b.y - 5 * u)}
						x2={axis.zero}
						y2={f2(b.key === 'reading' ? Z.axis : b.y + 16 * u)}
					/>
				{/each}
				{#each bars as b (b.key)}
					<text class={['small start-anchor', { strong: b.heavy }]} x={Z.x0} y={f2(b.y - 10 * u)}
						>{b.words}</text
					>
					<rect
						class={b.cls}
						x={f2(b.x)}
						y={f2(b.y - (b.heavy ? 1 : 0) * u)}
						width={f2(b.w)}
						height={f2((b.heavy ? 16 : 11) * u)}
					/>
				{/each}
				{#each planetTicks as t (t.key)}
					<line
						class="planet-tick"
						x1={f2(t.x)}
						y1={f2(Z.rows[2] + 18 * u)}
						x2={f2(t.x)}
						y2={f2(Z.rows[2] + 26 * u)}
					/>
					<text class="tick mid" x={f2(t.x)} y={f2(Z.rows[2] + 37 * u)}>{t.words}</text>
				{/each}
				<line class="axis-line" x1={Z.x0} y1={Z.axis} x2={Z.x1} y2={Z.axis} />
				{#each axis.ticks as t (t)}
					<line
						class="axis-line"
						x1={axis.X(t)}
						y1={Z.axis}
						x2={axis.X(t)}
						y2={f2(Z.axis + 4 * u)}
					/>
					<text class="tick mid" x={axis.X(t)} y={f2(Z.axis + 15 * u)}>{t < 0 ? `−${-t}` : t}</text>
				{/each}
				<text class="tick end-anchor" x={Z.x1} y={f2(Z.axis + 28 * u)}>in 10⁻¹² s⁻²</text>
			{/if}

			{#each words as w, i (i)}
				<text class="{w.cls} start-anchor" x={w.x} y={w.y}>{w.text}</text>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			{#if mode !== 'equator'}
				<li><span class="dot-key"></span><span>a free ball of the pixel</span></li>
				<li><span class="swatch start-key"></span><span>its ring as it was</span></li>
				<li>
					<span class="swatch tint-key"></span><span
						>the tide 𝓔: <span class="stretch">stretched</span>,
						<span class="squeeze">squeezed</span></span
					>
				</li>
				<li><span class="swatch curv-key"></span><span>relative turning, from 𝓑</span></li>
				<li>
					<span class="swatch sight-key"></span><span><Tex math="\hat n" />, the line of sight</span
					>
				</li>
			{:else}
				<li><span class="swatch obs-key"></span><span>the pixel’s velocity</span></li>
				<li><span class="bar-key"></span><span>magnetic parts, in the curvature colour</span></li>
			{/if}
		</ul>
	</div>

	<div class="bar-controls">
		{#if mode === 'passing'}
			<p class="hint">
				Drag the tip of the arrow <span class="it">v</span>, or reach it with Tab: the left and
				right arrow keys turn it, 5° a press, and the up and down keys change its speed, 0.1 m s⁻¹ a
				press; Shift for larger steps. Within 4° of the line of sight it lands on it.
			</p>
		{:else if mode === 'spinning'}
			<div class="body-pick">
				<Segmented
					label="The body"
					bind:value={() => body, setBody}
					options={[
						{ value: 'ball', label: 'A ball', icon: CircleIcon },
						{ value: 'shell', label: 'A thin shell', icon: CircleIcon },
						{ value: 'counter', label: 'Counter-turning', icon: Rotate01Icon }
					]}
				/>
			</div>
			<div class="groups">
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => rate, setRate, RATE)}
					role="presentation"
				>
					<Slider
						id="{uid}-rate"
						label="Spin rate Ω"
						icon={DashboardSpeed01Icon}
						min={RATE.min}
						max={RATE.max}
						step={RATE.step}
						bind:value={() => rate, setRate}
						readout="Ω = {rate} s⁻¹"
						marks={[
							{ at: 0, label: 'not spinning' },
							{ at: OPENING.rate, label: '50 s⁻¹, as the figure opens' },
							{ at: 100, label: '100 s⁻¹' }
						]}
						marksHint="the ticks mark 0, the opening’s 50 and 100 s⁻¹"
					/>
				</div>
				{#if body === 'counter'}
					<div
						class="slot"
						onkeydowncapture={sliderKeys(() => inner, setInner, INNER)}
						role="presentation"
					>
						<Slider
							id="{uid}-inner"
							label="Inner ball’s radius a/R"
							icon={CircleIcon}
							min={INNER.min}
							max={INNER.max}
							step={INNER.step}
							bind:value={() => inner, setInner}
							readout="a/R = {inner === BALANCE ? '0.871' : inner.toFixed(2)}"
							marks={[
								{ at: BALANCE, label: '0.871 = 2^(−1/5): L = 0' },
								{ at: 1, label: '1: the whole ball turns one way' }
							]}
							marksHint="the ticks mark 0.871, where L = 0, and the whole ball"
						/>
					</div>
				{/if}
			</div>
		{:else}
			<div class="groups">
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => ratio, setRatio, RATIO)}
					role="presentation"
				>
					<Slider
						id="{uid}-ratio"
						label="Moment of inertia C/MR²"
						icon={EarthIcon}
						min={RATIO.min}
						max={RATIO.max}
						step={RATIO.step}
						bind:value={() => ratio, setRatio}
						readout="C/MR² = {ratioWords(ratio)}"
						marks={[
							{ at: RATIO_MARKS.earth, label: 'Earth, 0.3307' },
							{ at: RATIO_MARKS.uniform, label: 'uniform, 0.4' },
							{ at: RATIO_MARKS.shell, label: 'shell, ⅔: no round body goes further' }
						]}
						marksHint="the ticks mark the Earth, a uniform planet and a hollow shell"
					/>
				</div>
			</div>
		{/if}

		<div class="controls">
			{#if mode !== 'equator'}
				<button
					type="button"
					class="action"
					aria-pressed={playing}
					onclick={() => (playing = !playing)}
				>
					<!-- one icon each: the icon component draws the icon it is first given -->
					{#if playing}
						<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.7} />
						Pause
					{:else}
						<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
						Play
					{/if}
				</button>
			{/if}
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
		</div>
		<p class="hint">
			Reach the predictions, the scenes, {mode === 'passing' ? 'the arrow' : 'the sliders'} and the buttons
			with Tab; the arrow keys step them, Shift by larger steps. Press a tick under a slider to go to
			its value.
		</p>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			{#if mode === 'passing'}
				<div class="row">
					<dt>The mass</dt>
					<dd>
						<span class="also"
							>70 kg, 1 m away, moving at <span class="value">{speedWords(velocity.speed)}</span> m
							s⁻¹,
							{velocity.angle}° from the line of sight; sideways <Tex math="v_\perp" /> =
							<span class="value">{speedWords(pass.vPerp)}</span> m s⁻¹</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Magnetic part</dt>
					<dd>
						<Tex math={`|${B}|`} trust /> = <span class="value curv">{inUnits(pass.B, -17)}</span>
						<span class="also">× 10⁻¹⁷ s⁻²</span>
					</dd>
				</div>
				<div class="row">
					<dt>Electric part</dt>
					<dd>
						<Tex math={`|${E}|`} trust /> = <span class="value curv">{inUnits(pass.E, -8)}</span>
						<span class="also">× 10⁻⁸ s⁻², whatever the motion</span>
					</dd>
				</div>
				<div class="row">
					<dt>The ratio</dt>
					<dd>
						<Tex math={`|${B}|/|${E}|`} trust /> = <span class="value">{three(pass.ratio)}</span>
						<span class="also">and</span>
						<Tex math="\sqrt3\,v_\perp/c" /> = <span class="value">{three(pass.rule)}</span>
					</dd>
				</div>
				<div class="row">
					<dt>Gyroscopes</dt>
					<dd>
						<span class="also"
							>1 m apart along the line, they turn relative to one another at <Tex
								math={`\\delta\\Omega = ${B}\\xi/c`}
								trust
							/> = <span class="value">{three(Math.abs(pass.gyro))}</span> rad s⁻¹</span
						>
					</dd>
				</div>
			{:else if mode === 'spinning'}
				<div class="row">
					<dt>The body</dt>
					<dd>
						<span class="also"
							>{bodyName}, 1000 kg, radius 0.5 m, centre 1.5 m away, spun at
							<span class="value">{rate}</span>
							s⁻¹ about an axis across the line; <Tex math="C" /> =
							<span class="value">{three(spinNow.C)}</span>
							kg m²{body === 'counter' ? ' for the whole ball' : ''}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Angular momentum</dt>
					<dd>
						<Tex
							math={body === 'counter'
								? 'L = \\tfrac25MR^2\\Omega\\,(2a^5/R^5 - 1)'
								: 'L = C\\Omega'}
						/> =
						<span class="value">{three(spinNow.L)}</span> <span class="also">kg m² s⁻¹</span>
					</dd>
				</div>
				<div class="row">
					<dt>Magnetic part</dt>
					<dd>
						<Tex math={`|${B}| = 3\\sqrt2\\,G|L|/cr^4 =`} trust />
						<span class="value curv">{three(spinNow.B)}</span>
						<span class="also"
							>s⁻²{#if spinNow.overBall !== undefined && body !== 'ball'}, {spinNow.overBall.toFixed(
									3
								)} times a ball’s at the same rate{/if}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Electric part</dt>
					<dd>
						<Tex math={`|${E}|`} trust /> = <span class="value curv">{three(spinNow.E)}</span>
						<span class="also">s⁻², the same for every body</span>
					</dd>
				</div>
				<div class="row">
					<dt>Gyroscopes</dt>
					<dd>
						<span class="also"
							>1 m apart along the line: <span class="value">{three(Math.abs(spinNow.gyro))}</span> rad
							s⁻¹</span
						>
					</dd>
				</div>
			{:else}
				<div class="row">
					<dt>The reading</dt>
					<dd>
						<Tex math={`${B}_{xz} = -${FACTOR}\\,(1 - C/${M}R^2) =`} trust />
						<span class="value curv">{three(eq.reading)}</span> <span class="also">s⁻²</span>
					</dd>
				</div>
				<div class="row">
					<dt>Its two parts</dt>
					<dd>
						<span class="also"
							>the pixel’s motion <Tex math={`${U} = \\Omega R`} trust />:
							<span class="value">{three(eq.motion)}</span>; the planet’s spin:
							<span class="value">+{three(eq.spin)}</span> s⁻²</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Gyroscopes</dt>
					<dd>
						<span class="also"
							>1 m apart, one above the other: <Tex math={`|${B}_{xz}|/c`} trust /> =
							<span class="value">{three(eq.gyro)}</span> rad s⁻¹</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			{#if mode === 'passing'}
				The magnetic part is the paper’s <Tex
					math={`${B}_{ij} = (3G${M}/cr^3)[\\hat n_i(\\hat n\\times\\mathbf v)_j + \\hat n_j(\\hat n\\times\\mathbf v)_i]`}
					trust
				/>, with <Tex math="\hat n" /> from the pixel toward the mass, and the tide <Tex
					math={`${E}_{ij} = (G${M}/r^3)(\\delta_{ij} - 3\\hat n_i\\hat n_j)`}
					trust
				/>; the sizes are Frobenius norms. The gyroscopes, held at rest, turn about the axis out of
				the screen at <Tex math={`\\delta\\Omega_i = ${B}_{ij}\\xi_j/c`} trust />.
			{:else if mode === 'spinning'}
				The spin dipole is <Tex
					math={`${B}_{ij} = -(3G/cr^4)[L_i\\hat n_j + \\hat n_iL_j + (\\mathbf L\\cdot\\hat n)(\\delta_{ij} - 5\\hat n_i\\hat n_j)]`}
					trust
				/>; with the axis across the line, <Tex math="\mathbf L\cdot\hat n = 0" /> and only <Tex
					math={`${B}_{xz} = -3GL/cr^4`}
					trust
				/> is left. A ball has <Tex math={`C = \\tfrac25${M}R^2`} trust />, a thin shell <Tex
					math={`\\tfrac23${M}R^2`}
					trust
				/>. In the counter-turning body the inner ball and the shell outside it have the same
				density and turn at the same rate in opposite senses.
			{:else}
				With <Tex math={`G${M} = 3.986\\times10^{14}\\,\\mathrm{m^3\\,s^{-2}}`} trust />, <Tex
					math={'\\Omega = 7.292\\times10^{-5}\\,\\mathrm{s^{-1}}'}
				/> and <Tex math={'R = 6.378\\times10^6\\,\\mathrm{m}'} />. The 1 is the pixel’s motion
				through the planet’s field, <Tex math={`C/${M}R^2`} trust /> the planet’s spin; the Earth’s is
				{EARTH.ratio}. The slider stops at a thin shell’s <Tex math="\tfrac23" />, the largest any
				round body has.
			{/if}
		</p>
	</div>
</div>

<style>
	.magnetic-tide {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
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

	.tabs {
		padding: 0.6rem 0.9rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 40% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.stage svg {
		display: block;
		width: 100%;
		max-width: 640px;
		height: auto;
		margin: 0 auto;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the arrow's tip takes a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .handle {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
	}

	.strong {
		font-weight: 600;
		fill: var(--text);
	}

	.it {
		font-style: italic;
	}

	.tick {
		font-size: calc(10px * var(--u, 1));
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.mid {
		text-anchor: middle;
	}

	.start-anchor {
		text-anchor: start;
	}

	.end-anchor {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-faint);
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.obs-words {
		fill: var(--q-obs);
	}

	.sight {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.start {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.shape {
		fill: color-mix(in srgb, var(--q-obs) 7%, transparent);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tint {
		fill: none;
		stroke-width: calc(4px * var(--u, 1));
		stroke-linecap: round;
		opacity: 0.75;
	}

	.tint.stretch {
		stroke: var(--accent);
	}

	.tint.squeeze {
		stroke: var(--accent-2);
	}

	.ball {
		fill: var(--q-obs);
	}

	.gyro line {
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.gyro .rotor {
		fill: color-mix(in srgb, var(--text) 22%, var(--bg));
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.gyro .nose {
		fill: var(--text);
	}

	.turning path,
	.spin-arrow path {
		fill: none;
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.turning path {
		stroke: var(--q-curv);
	}

	.turning polygon {
		fill: var(--q-curv);
	}

	.spin-arrow path {
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.spin-arrow polygon {
		fill: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.stone {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.shell {
		fill: none;
	}

	.hollow {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: color-mix(in srgb, var(--text) 25%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.seam {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.mark {
		fill: color-mix(in srgb, var(--text) 75%, var(--bg));
	}

	.stone-0 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 22%,
			color-mix(in srgb, var(--text) 62%, var(--bg))
		);
	}

	.stone-1 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 14%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
	}

	.stone-2 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 8%,
			color-mix(in srgb, var(--text) 24%, var(--bg))
		);
	}

	.axis-mark circle {
		fill: var(--bg-sunken);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.axis-mark circle.dot {
		fill: var(--text);
		stroke: none;
	}

	.axis-mark path {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.velocity path {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2.2px * var(--u, 1));
	}

	.velocity polygon {
		fill: var(--text);
	}

	.velocity.obs path {
		stroke: var(--q-obs);
	}

	.velocity.obs polygon {
		fill: var(--q-obs);
	}

	.pixel-dot {
		fill: none;
		stroke: var(--q-obs);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.handle {
		cursor: grab;
		touch-action: none;
	}

	.handle:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.knob {
		fill: var(--text);
	}

	.bar {
		fill: color-mix(in srgb, var(--q-curv) 55%, transparent);
	}

	.bar.heavy {
		fill: var(--q-curv);
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis-line {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.planet-tick {
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
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
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.dot-key {
		flex: none;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--q-obs);
	}

	.swatch {
		display: inline-block;
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 2px solid;
	}

	.start-key {
		border-top-style: dashed;
		border-top-width: 1.5px;
		border-color: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.tint-key {
		border-top-width: 3px;
		border-image: linear-gradient(90deg, var(--accent) 50%, var(--accent-2) 50%) 1;
	}

	.sight-key {
		border-top-style: dotted;
		border-color: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.curv-key {
		border-color: var(--q-curv);
	}

	.obs-key {
		border-color: var(--q-obs);
	}

	.bar-key {
		flex: none;
		width: 1.1rem;
		height: 0.55rem;
		background: var(--q-curv);
	}

	.legend .stretch {
		color: var(--accent);
	}

	.legend .squeeze {
		color: var(--accent-2);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.body-pick {
		max-width: 30rem;
	}

	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14.5rem, 1fr));
		gap: 0.8rem 1.1rem;
	}

	.slot {
		min-width: 0;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.6rem;
		align-items: center;
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
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

	.hint {
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

	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.5rem;
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
		align-items: baseline;
		gap: 0.15rem 0.4rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.value {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.value.curv {
		color: var(--q-curv);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		/* on a phone every word in the drawing and the legend reads at least 12 px high */
		.small,
		.tick {
			font-size: calc(12px * var(--u, 1));
		}

		.legend {
			font-size: 0.75rem;
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
