/**
 * Chapter 6.1's boost: the figure's model against the chapter's equations and against every number the chapter's
 * specification of the figure asks for: B first by 0.75 s at η = ln 2; a reversal of order only when
 * |Δx| > c|Δt|; events that light can connect keeping their order for every η in (−2, 2); two boosts of 0.6c
 * giving 15/17 = 0.882 at η = ln 4; and the interval the same for the pixel as for the room.
 */
import { describe, expect, it } from 'vitest';
import {
	FLASH_A,
	FLASH_B,
	GRID,
	LN2,
	NAMED,
	OPENING,
	RAPIDITY,
	REACH,
	SECOND_START,
	addSpeeds,
	atFlashes,
	betaFraction,
	boost,
	connectable,
	etaTex,
	fractionTex,
	fromOrigin,
	gammaFraction,
	gap,
	grid,
	hyper,
	hyperbola,
	interval,
	keyed,
	kind,
	landed,
	leastGap,
	lnTwos,
	moved,
	noteFirst,
	noteSecond,
	order,
	pixel,
	pixelInterval,
	place,
	rapidity,
	reversingSpeed,
	roomOrder,
	secondAnswer,
	seen,
	snapped,
	spread,
	three,
	twice,
	unitHyperbola,
	CONE_SNAP,
	KIND_NAMES,
	NULL_START,
	SIMULTANEOUS,
	TIP,
	TIP_REACH,
	VECTOR_OPENING,
	coned,
	fourVelocity,
	hyperbolaThrough,
	lowered,
	noteNull,
	noteSimultaneous,
	nullAnswer,
	nullFactor,
	pixelSquare,
	simultaneousAnswer,
	simultaneousBeta,
	square,
	tipAt,
	tipMoved,
	uDot,
	vec,
	vectorKind,
	type Event,
	type FirstSeen,
	type NullSeen,
	type Tip
} from './lorentz-diagram';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

/** Rapidities across the slider, on its own steps. */
const RAPIDITIES = Array.from({ length: 401 }, (_, j) => Math.round((-2 + j * 0.01) * 100) / 100);

/** A spread of events over the grid, including the flashes and events on light's paths. */
function events(): Event[] {
	const out: Event[] = [];
	for (let n = -REACH; n <= REACH; n += 8)
		for (let m = -REACH; m <= REACH; m += 8) out.push({ n, m });
	out.push(FLASH_A, FLASH_B, { n: 20, m: 20 }, { n: -13, m: 13 }, { n: 7, m: 3 });
	return out;
}

describe('the rapidity', () => {
	it('gives β = tanh η, γ = cosh η and γβ = sinh η, with γ = 1/√(1 − β²)', () => {
		for (const eta of RAPIDITIES) {
			const { beta, gamma, gammaBeta } = pixel(eta);
			close(beta, Math.tanh(eta));
			close(gamma, 1 / Math.sqrt(1 - beta * beta), 11);
			close(gammaBeta, gamma * beta, 12);
			close(rapidity(beta), eta, 9);
		}
	});

	it('is ln 2 at 0.6c, where γ = 5/4 and γβ = 3/4 exactly', () => {
		close(rapidity(0.6), LN2, 14);
		const { beta, gamma, gammaBeta } = pixel(LN2);
		expect(gamma).toBe(1.25);
		expect(gammaBeta).toBe(0.75);
		expect(beta).toBe(0.6);
		expect(betaFraction(LN2)).toEqual([3, 5]);
		expect(gammaFraction(LN2)).toEqual([5, 4]);
	});

	it('is read as a whole number of ln 2 only when it is one', () => {
		expect(lnTwos(0)).toBe(0);
		expect(lnTwos(LN2)).toBe(1);
		expect(lnTwos(LN2 + LN2)).toBe(2);
		expect(lnTwos(-LN2)).toBe(-1);
		expect(lnTwos(0.69)).toBeUndefined();
		expect(lnTwos(0.7)).toBeUndefined();
		// powers of two agree with the library's functions
		for (const k of [-3, -2, -1, 1, 2, 3]) {
			const h = hyper(k * LN2);
			close(h.cosh, Math.cosh(k * LN2), 14);
			close(h.sinh, Math.sinh(k * LN2), 14);
			close(h.tanh, Math.tanh(k * LN2), 14);
		}
	});

	it('names itself in the readouts', () => {
		expect(etaTex(LN2)).toBe('\\ln 2 = 0.693');
		expect(etaTex(2 * LN2)).toBe('\\ln 4 = 1.39');
		expect(etaTex(-LN2)).toBe('-\\ln 2 = -0.693');
		expect(etaTex(0)).toBe('0');
		expect(etaTex(0.5)).toBe('0.500');
		expect(fractionTex(15 / 17, [15, 17])).toBe('15/17 = 0.882');
	});
});

describe('the Lorentz transformation', () => {
	it('is the chapter’s eq:lorentz: ct′ = γ(ct − βx), x′ = γ(x − βct)', () => {
		for (const eta of [-1.7, -0.4, 0.25, LN2, 1.9]) {
			const { beta, gamma } = pixel(eta);
			for (const e of events()) {
				const { ct, x } = place(e);
				const p = boost(eta, { ct, x });
				close(p.ct, gamma * (ct - beta * x), 12);
				close(p.x, gamma * (x - beta * ct), 12);
			}
		}
	});

	it('at 0.6c is ct′ = 1.25 ct − 0.75 x and x′ = 1.25 x − 0.75 ct, and back with −β', () => {
		for (const e of events()) {
			const { ct, x } = place(e);
			const p = boost(LN2, { ct, x });
			expect(p.ct).toBe(1.25 * ct - 0.75 * x);
			expect(p.x).toBe(-0.75 * ct + 1.25 * x);
			const back = boost(-LN2, p);
			close(back.ct, ct, 14);
			close(back.x, x, 14);
		}
	});

	it('puts the pixel’s axes where the chapter draws them: ticks 1 at (sinh η, cosh η) and (cosh η, sinh η)', () => {
		for (const eta of [-1.2, LN2, 1.5]) {
			const { cosh, sinh } = hyper(eta);
			const t = boost(eta, { ct: cosh, x: sinh });
			close(t.ct, 1, 13);
			close(t.x, 0, 13);
			const s = boost(eta, { ct: sinh, x: cosh });
			close(s.ct, 0, 13);
			close(s.x, 1, 13);
		}
	});
});

describe('the interval', () => {
	it('is the same for the pixel as for the room, at every rapidity on the slider', () => {
		const list = events();
		for (const eta of RAPIDITIES)
			for (let i = 0; i < list.length; i += 3) {
				const a = list[i];
				const b = list[(i * 7 + 5) % list.length];
				const s = interval(a, b);
				// the pixel's coordinates reach cosh 2 × 4 = 15 light-seconds: a few parts in 10¹⁵ of their square
				expect(Math.abs(pixelInterval(eta, a, b) - s)).toBeLessThan(1e-12);
			}
	});

	it('reads the same to three figures as η changes, which is what the readout shows', () => {
		const a: Event = { n: -7, m: 11 };
		const b: Event = { n: 25, m: -3 };
		const shown = new Set(RAPIDITIES.map((eta) => three(pixelInterval(eta, a, b))));
		expect([...shown]).toEqual([three(interval(a, b))]);
		expect(new Set(RAPIDITIES.map((eta) => three(pixelInterval(eta, FLASH_A, FLASH_B))))).toEqual(
			new Set(['1.00'])
		);
	});

	it('is exact on the grid, and its sign says whether light can connect the events', () => {
		expect(interval(FLASH_A, FLASH_B)).toBe(1);
		expect(interval({ n: 0, m: 0 }, { n: 20, m: 20 })).toBe(0);
		expect(interval({ n: 0, m: 0 }, { n: 20, m: 10 })).toBe(-0.75);
		for (const a of events())
			for (const b of events()) {
				const s = interval(a, b);
				const k = kind(a, b);
				if (k === 'space') expect(s).toBeGreaterThan(0);
				if (k === 'light' || k === 'same') expect(s).toBe(0);
				if (k === 'time') expect(s).toBeLessThan(0);
			}
	});
});

describe('the first prediction: the two flashes', () => {
	it('opens on the flashes at η = ln 2', () => {
		expect(OPENING.eta).toBe(LN2);
		expect(atFlashes(OPENING.a, OPENING.b)).toBe(true);
		expect(place(FLASH_B)).toEqual({ ct: 0, x: 1 });
	});

	it('finds B first by 0.75 s: t′_A = 0 and t′_B = −0.75 s, and simultaneous in the room', () => {
		expect(seen(LN2, FLASH_A).ct).toBe(0);
		expect(seen(LN2, FLASH_B).ct).toBe(-0.75);
		expect(gap(LN2, FLASH_A, FLASH_B)).toBe(-0.75);
		expect(order(LN2, FLASH_A, FLASH_B)).toBe('B first');
		expect(roomOrder(FLASH_A, FLASH_B)).toBe('together');
		// the chapter's Δt′ = −γβΔx/c, with Δx = 1 light-second
		const { gamma, beta } = pixel(LN2);
		close(gap(LN2, FLASH_A, FLASH_B), -gamma * beta * 1, 15);
	});

	it('finds them together at rest, and A first for a pixel moving the other way', () => {
		expect(order(0, FLASH_A, FLASH_B)).toBe('together');
		expect(order(-LN2, FLASH_A, FLASH_B)).toBe('A first');
		expect(gap(-LN2, FLASH_A, FLASH_B)).toBe(0.75);
	});

	it('is answered at ln 2 after rest, with the flashes in place, and not otherwise', () => {
		let s: FirstSeen = { rest: false, done: false };
		s = noteFirst(s, LN2, FLASH_A, FLASH_B);
		expect(s.done).toBe(false);
		s = noteFirst(s, 0.3, FLASH_A, FLASH_B);
		s = noteFirst(s, 0, FLASH_A, FLASH_B);
		expect(s).toEqual({ rest: true, done: false });
		s = noteFirst(s, 0.69, FLASH_A, FLASH_B);
		expect(s.done).toBe(false);
		s = noteFirst(s, landed(0.69), FLASH_A, FLASH_B);
		expect(s.done).toBe(true);
		// moving an event forgets the rest
		let t: FirstSeen = noteFirst({ rest: false, done: false }, 0, FLASH_A, FLASH_B);
		t = noteFirst(t, 0, FLASH_A, { n: 0, m: 21 });
		t = noteFirst(t, LN2, FLASH_A, FLASH_B);
		expect(t.done).toBe(false);
	});
});

describe('the second prediction: which orders can change', () => {
	it('Δt′ = γ(Δt − βΔx/c) changes sign below light’s speed only when |Δx| > c|Δt|', () => {
		for (const a of events())
			for (const b of events()) {
				const v = reversingSpeed(a, b);
				const k = kind(a, b);
				if (k === 'space') {
					expect(v).toBeDefined();
					expect(Math.abs(v!)).toBeLessThan(1);
					// and past that speed the order is the other way: just either side of it
					const eta = Math.atanh(v!);
					const before = gap(eta - 0.01, a, b);
					const after = gap(eta + 0.01, a, b);
					expect(Math.sign(before)).toBe(-Math.sign(after));
				} else if (v !== undefined) expect(Math.abs(v)).toBeGreaterThanOrEqual(1);
			}
	});

	it('events that light can connect keep their order for every η in (−2, 2)', () => {
		const pairs: [Event, Event][] = [];
		for (let dn = -REACH; dn <= REACH; dn++)
			for (let dm = -Math.abs(dn); dm <= Math.abs(dn); dm++)
				if (dn !== 0)
					pairs.push([
						{ n: 0, m: 0 },
						{ n: dn, m: dm }
					]);
		pairs.push([
			{ n: -20, m: -20 },
			{ n: 20, m: 20 }
		]);
		for (const [a, b] of pairs) {
			expect(connectable(a, b)).toBe(true);
			const room = roomOrder(a, b);
			for (const eta of RAPIDITIES) expect(order(eta, a, b)).toBe(room);
		}
	});

	it('events light cannot connect, at the speeds the slider reaches, can be put in either order', () => {
		for (const [a, b] of [
			[FLASH_A, FLASH_B],
			[
				{ n: 0, m: 0 },
				{ n: 15, m: 20 }
			],
			[
				{ n: 10, m: -30 },
				{ n: -5, m: 10 }
			]
		] as [Event, Event][]) {
			expect(kind(a, b)).toBe('space');
			const orders = new Set(RAPIDITIES.map((eta) => order(eta, a, b)));
			expect(orders.has('A first') && orders.has('B first')).toBe(true);
		}
		// at 0.6c the pair 0.75 s and 1.25 light-seconds apart is exactly together
		expect(order(LN2, { n: 0, m: 0 }, { n: 15, m: 25 })).toBe('together');
	});

	it('finds the clock’s proper time as the least Δt′, which every observer computes alike', () => {
		const a: Event = { n: 0, m: 0 };
		const b: Event = { n: 20, m: 12 };
		const l = leastGap(a, b);
		expect(l.proper).toBe(true);
		close(l.least, 0.8, 14);
		close(l.at, LN2, 12);
		for (const eta of RAPIDITIES)
			expect(Math.abs(gap(eta, a, b))).toBeGreaterThanOrEqual(0.8 - 1e-12);
		// on light's path Δt′ = Δt e^{−η}: least at the end of the range
		const c = leastGap(a, { n: 20, m: 20 });
		expect(c.proper).toBe(false);
		close(c.least, Math.exp(-2), 12);
	});

	it('is answered after a reversal and both ends of the range with a pair light can connect', () => {
		let s = { ...SECOND_START, orders: [order(LN2, FLASH_A, FLASH_B)] };
		s = noteSecond(s, -0.3, FLASH_A, FLASH_B, false);
		expect(s.reversed).toBe(true);
		const b: Event = { n: 20, m: 10 };
		s = noteSecond(s, -0.3, FLASH_A, b, true);
		expect(s.reversed).toBe(true);
		s = noteSecond(s, -1.97, FLASH_A, b, false);
		expect(s.low).toBe(true);
		expect(s.done).toBeUndefined();
		s = noteSecond(s, 1.96, FLASH_A, b, false);
		expect(s.done).toEqual({ a: FLASH_A, b });
		const ans = secondAnswer(FLASH_A, b);
		expect(ans.kind).toBe('time');
		expect(ans.interval).toBe(-0.75);
		expect(ans.order).toBe('A first');
		close(ans.least, Math.sqrt(0.75), 14);
		expect(ans.ends[0]).toBeGreaterThan(0);
		expect(ans.ends[1]).toBeGreaterThan(0);
	});

	it('is not answered by a pair light cannot connect, nor without a reversal', () => {
		let s = { ...SECOND_START, orders: [order(LN2, FLASH_A, FLASH_B)] };
		s = noteSecond(s, -2, FLASH_A, FLASH_B, false);
		s = noteSecond(s, 2, FLASH_A, FLASH_B, false);
		expect(s.reversed).toBe(true);
		expect(s.done).toBeUndefined();
		let t = { ...SECOND_START };
		const b: Event = { n: 20, m: 0 };
		t = noteSecond(t, 0, FLASH_A, b, true);
		t = noteSecond(t, -2, FLASH_A, b, false);
		t = noteSecond(t, 2, FLASH_A, b, false);
		expect(t.low && t.high).toBe(true);
		expect(t.done).toBeUndefined();
		// moving an event forgets the ends reached
		t = noteSecond(t, 2, FLASH_A, FLASH_B, true);
		t = noteSecond(t, -2, FLASH_A, FLASH_B, false);
		expect(t.reversed).toBe(true);
		t = noteSecond(t, -2, FLASH_A, b, true);
		expect(t.high).toBe(false);
		t = noteSecond(t, 2, FLASH_A, b, false);
		expect(t.done).toEqual({ a: FLASH_A, b });
	});
});

describe('two boosts', () => {
	it('of 0.6c give 1.2/1.36 = 15/17 = 0.882 at η = ln 2 + ln 2 = ln 4, not 1.2', () => {
		const eta = LN2 + LN2;
		expect(lnTwos(eta)).toBe(2);
		expect(betaFraction(eta)).toEqual([15, 17]);
		close(pixel(eta).beta, 15 / 17, 15);
		close(addSpeeds(0.6, 0.6), 15 / 17, 15);
		close(addSpeeds(0.6, 0.6), 1.2 / 1.36, 15);
		expect(three(pixel(eta).beta)).toBe('0.882');
		expect(gammaFraction(eta)).toEqual([17, 8]);
	});

	it('compose to the boost of the sum of the rapidities, and the speeds by eq:addition', () => {
		for (const e1 of [-1.1, -0.3, LN2, 1.4])
			for (const e2 of [-1.9, -0.5, 0.2, LN2, 2]) {
				for (const e of events()) {
					const p = place(e);
					const two = twice(e1, e2, p);
					const one = boost(e1 + e2, p);
					expect(Math.abs(two.ct - one.ct)).toBeLessThan(1e-11);
					expect(Math.abs(two.x - one.x)).toBeLessThan(1e-11);
				}
				close(addSpeeds(Math.tanh(e1), Math.tanh(e2)), Math.tanh(e1 + e2), 13);
			}
	});

	it('never reach the speed of light, and a speed added to c gives c', () => {
		for (const e2 of RAPIDITIES) expect(Math.abs(pixel(LN2 + e2).beta)).toBeLessThan(1);
		close(addSpeeds(0.6, 1), 1, 15);
	});
});

describe('the controls', () => {
	it('land exactly on rest, ln 2 and ln 4 from the slider’s nearby steps', () => {
		expect(landed(0.69)).toBe(LN2);
		expect(landed(0.7)).toBe(LN2);
		expect(landed(1.38)).toBe(2 * LN2);
		expect(landed(1.39)).toBe(2 * LN2);
		expect(landed(-0.69)).toBe(-LN2);
		expect(landed(0.004)).toBe(0);
		expect(landed(0.71)).toBe(0.71);
		expect(landed(2.5)).toBe(2);
		expect(NAMED).toContain(0);
	});

	it('step the rapidity by 0.05 with the arrow keys, through ln 2', () => {
		expect(keyed(0.65, 1)).toBe(LN2);
		expect(keyed(LN2, 1)).toBe(0.75);
		expect(keyed(LN2, -1)).toBe(0.65);
		expect(keyed(1.95, 1)).toBe(2);
		expect(keyed(2, 1)).toBe(2);
		expect(keyed(-1.98, -1)).toBe(-2);
		expect(RAPIDITY.key).toBe(0.05);
	});

	it('move events on the grid and keep them within ±2 light-seconds', () => {
		expect(moved(FLASH_B, 1, 0)).toEqual({ n: 1, m: 20 });
		expect(moved({ n: 39, m: -40 }, 5, -1)).toEqual({ n: 40, m: -40 });
		expect(snapped({ ct: 0.512, x: -0.974 })).toEqual({ n: 10, m: -19 });
		expect(snapped({ ct: 9, x: -9 })).toEqual({ n: 40, m: -40 });
		expect(GRID * REACH).toBe(2);
		expect(grid(-0)).toBe('0.00');
		expect(grid(-0.35)).toBe('−0.35');
	});

	it('show numbers to three figures', () => {
		expect(three(0.6)).toBe('0.600');
		expect(three(1.25)).toBe('1.25');
		expect(three(-0.75)).toBe('−0.750');
		expect(three(1e-17)).toBe('0');
	});
});

describe('the drawing', () => {
	it('draws each event’s hyperbola through it, and none on the light lines', () => {
		for (const e of [FLASH_B, { n: 30, m: 10 }, { n: -25, m: 5 }, { n: 8, m: -30 }]) {
			const s = fromOrigin(e);
			const pts = hyperbola(e);
			expect(pts.length).toBeGreaterThan(10);
			for (const p of pts) close(-p.ct * p.ct + p.x * p.x, s, 11);
			// on the branch the event is on
			const { ct, x } = place(e);
			if (s < 0) expect(pts.every((p) => Math.sign(p.ct) === Math.sign(ct))).toBe(true);
			else expect(pts.every((p) => Math.sign(p.x) === Math.sign(x))).toBe(true);
		}
		expect(hyperbola({ n: 12, m: -12 })).toEqual([]);
		expect(hyperbola(FLASH_A)).toEqual([]);
		for (const p of unitHyperbola('time')) close(-p.ct * p.ct + p.x * p.x, -1, 12);
		for (const p of unitHyperbola('space')) close(-p.ct * p.ct + p.x * p.x, 1, 12);
	});

	it('spreads labels apart, in order, within their edge', () => {
		const out = spread(
			[
				{ at: 100, size: 20 },
				{ at: 104, size: 20 },
				{ at: 190, size: 30 }
			],
			0,
			200,
			4
		);
		expect(out[1] - out[0]).toBeGreaterThanOrEqual(24 - 1e-9);
		expect(out[2]).toBeLessThanOrEqual(185 + 1e-9);
		expect(out[2] - out[1]).toBeGreaterThanOrEqual(29 - 1e-9);
		expect(spread([{ at: 50, size: 10 }], 0, 200, 4)).toEqual([50]);
	});
});

describe('four-vectors', () => {
	/** Tips across the grid, with nulls both ways, the two flashes' step and the chapter's (1, 0.5). */
	function tips(): Tip[] {
		const out: Tip[] = [];
		for (let n = -TIP_REACH; n <= TIP_REACH; n += 37)
			for (let m = -TIP_REACH; m <= TIP_REACH; m += 41) out.push({ n, m });
		out.push(
			{ n: 0, m: 100 },
			{ n: 50, m: 100 },
			{ n: 125, m: 75 },
			{ n: 80, m: 80 },
			{ n: 60, m: -60 }
		);
		return out;
	}

	it('opens at η = ln 2 with a at (x, ct) = (1, 0), a space-like step of one light-second squared', () => {
		expect(VECTOR_OPENING.eta).toBe(LN2);
		expect(vec(VECTOR_OPENING.a)).toEqual({ ct: 0, x: 1 });
		expect(square(VECTOR_OPENING.a)).toBe(1);
		expect(vectorKind(VECTOR_OPENING.a)).toBe('space');
		// the chapter's numbers: for the pixel at 0.6c the step is (−0.75, 1.25), and −0.5625 + 1.5625 = 1
		expect(boost(LN2, vec(VECTOR_OPENING.a))).toEqual({ ct: -0.75, x: 1.25 });
		expect(pixelSquare(LN2, VECTOR_OPENING.a)).toBe(1);
	});

	it('lowers an index by changing only the sign of time, so that a_μ a^μ = a·a', () => {
		expect(lowered({ ct: 1.25, x: 0.75 })).toEqual({ ct: -1.25, x: 0.75 });
		expect(lowered({ ct: -0.75, x: 1.25 })).toEqual({ ct: 0.75, x: 1.25 });
		for (const t of tips()) {
			const v = vec(t);
			const l = lowered(v);
			close(l.ct * v.ct + l.x * v.x, square(t), 12);
		}
		// the chapter's u at 0.6c: u_μ = (−1.25, 0.75) c and u_μ u^μ = −c²
		const u = fourVelocity(LN2);
		expect(u).toEqual({ ct: 1.25, x: 0.75 });
		const ul = lowered(u);
		expect(ul.ct * u.ct + ul.x * u.x).toBe(-1);
	});

	it('keeps a·a under every boost on the slider, to 1e-12', () => {
		for (const eta of RAPIDITIES)
			for (const t of tips()) {
				expect(Math.abs(pixelSquare(eta, t) - square(t))).toBeLessThan(1e-12);
				// and a boost's own components, formed the plain way, agree
				const p = boost(eta, vec(t));
				expect(Math.abs(-p.ct * p.ct + p.x * p.x - square(t))).toBeLessThan(1e-12 * 64);
			}
	});

	it('sorts vectors by the sign of a·a, decided on whole steps', () => {
		expect(vectorKind({ n: 125, m: 75 })).toBe('time');
		expect(vectorKind({ n: -125, m: 75 })).toBe('time');
		expect(vectorKind({ n: 125, m: 125 })).toBe('null');
		expect(vectorKind({ n: -40, m: 40 })).toBe('null');
		expect(vectorKind({ n: 0, m: 100 })).toBe('space');
		expect(vectorKind({ n: 50, m: -100 })).toBe('space');
		expect(vectorKind({ n: 0, m: 0 })).toBe('zero');
		for (const t of tips()) {
			const s = square(t);
			const k = vectorKind(t);
			if (k === 'zero') continue;
			expect(k).toBe(s < 0 ? 'time' : s === 0 ? 'null' : 'space');
		}
		expect(KIND_NAMES.time).toBe('time-like');
		expect(KIND_NAMES.null).toBe('null');
		expect(KIND_NAMES.space).toBe('space-like');
	});

	it('lands the tip on the light cone within 0.02 light-seconds of it, and not beyond', () => {
		expect(CONE_SNAP).toBe(0.02);
		expect(coned({ n: 100, m: 102 })).toEqual({ n: 101, m: 101 });
		expect(coned({ n: 100, m: 101 })).toEqual({ n: 101, m: 101 });
		expect(coned({ n: -100, m: 98 })).toEqual({ n: -99, m: 99 });
		expect(coned({ n: 100, m: 103 })).toEqual({ n: 100, m: 103 });
		expect(coned({ n: 0, m: 2 })).toEqual({ n: 1, m: 1 });
		expect(coned({ n: 0, m: 0 })).toEqual({ n: 0, m: 0 });
		// a drag a hundredth off the cone lands on it; a key press from the cone leaves it
		expect(vectorKind(tipAt({ ct: 1.0, x: 1.013 }))).toBe('null');
		expect(vectorKind(tipAt({ ct: 1.0, x: 1.03 }))).toBe('space');
		expect(vectorKind(tipAt({ ct: 1.03, x: -1.0 }))).toBe('time');
		expect(tipMoved({ n: 100, m: 100 }, 0, 5)).toEqual({ n: 100, m: 105 });
		expect(tipMoved({ n: 95, m: 100 }, 5, 0)).toEqual({ n: 100, m: 100 });
		// the tip stays within ±2 light-seconds, on its grid of hundredths
		expect(tipMoved({ n: 198, m: -198 }, 25, -25)).toEqual({ n: 200, m: -200 });
		expect(tipAt({ ct: 9, x: -9 })).toEqual({ n: 200, m: -200 });
		expect(vec(tipAt({ ct: 0.504, x: 1.0049 }))).toEqual({ ct: 0.5, x: 1 });
		expect(TIP).toBe(0.01);
	});

	it('boosts a null vector by e^{∓η}: along it a stretch or a shrink, never a time component of zero', () => {
		for (const eta of RAPIDITIES)
			for (const t of [
				{ n: 80, m: 80 },
				{ n: -80, m: -80 },
				{ n: 60, m: -60 },
				{ n: -150, m: 150 }
			]) {
				const v = vec(t);
				const p = boost(eta, v);
				const f = nullFactor(eta, t)!;
				close(f, Math.exp(Math.sign(t.n) === Math.sign(t.m) ? -eta : eta), 14);
				close(p.ct, f * v.ct, 12);
				close(p.x, f * v.x, 12);
				expect(p.ct).not.toBe(0);
				expect(Math.abs(pixelSquare(eta, t))).toBe(0);
			}
		// at 0.6c, along +x: e^{−ln 2} = 1/2
		expect(boost(LN2, vec({ n: 100, m: 100 }))).toEqual({ ct: 0.5, x: 0.5 });
		expect(nullFactor(LN2, { n: 0, m: 100 })).toBeUndefined();
	});

	it('finds the frame in which a space-like vector takes no time: β = cΔt/Δx, 0.5 for (1, 0.5)', () => {
		const t: Tip = { n: 50, m: 100 };
		expect(simultaneousBeta(t)).toBe(0.5);
		const p = boost(rapidity(0.5), vec(t));
		expect(Math.abs(p.ct)).toBeLessThan(1e-15);
		// there a lies on the pixel's "now", u·a = 0, and its length is √(a·a)
		expect(Math.abs(uDot(rapidity(0.5), t))).toBeLessThan(1e-15);
		close(p.x, Math.sqrt(square(t)), 14);
		expect(simultaneousBeta({ n: 100, m: 50 })).toBeUndefined();
		expect(simultaneousBeta({ n: 50, m: 50 })).toBeUndefined();
		expect(simultaneousBeta({ n: -30, m: 120 })).toBe(-0.25);
	});

	it('computes u·a = −c a′⁰, the chapter’s c(−1.25 a⁰ + 0.75 a¹) at 0.6c', () => {
		for (const eta of RAPIDITIES)
			for (const t of tips()) close(uDot(eta, t), -boost(eta, vec(t)).ct, 12);
		const t: Tip = { n: 40, m: 100 };
		close(uDot(LN2, t), -1.25 * 0.4 + 0.75 * 1, 14);
		// u lies on the unit hyperbola u·u = −c², its tip at (x, ct) = (sinh η, cosh η)
		for (const eta of RAPIDITIES) {
			const u = fourVelocity(eta);
			close(u.x, Math.sinh(eta), 12);
			close(-u.ct * u.ct + u.x * u.x, -1, 11);
		}
	});

	it('draws the hyperbola a·a = constant through the tip, and none for a null vector', () => {
		for (const t of [
			{ n: 125, m: 75 },
			{ n: -125, m: 75 },
			{ n: 50, m: 100 },
			{ n: 30, m: -150 }
		]) {
			const v = vec(t);
			const pts = hyperbolaThrough(v, square(t));
			expect(pts.length).toBeGreaterThan(10);
			for (const q of pts) {
				close(-q.ct * q.ct + q.x * q.x, square(t), 11);
				if (square(t) < 0) expect(Math.sign(q.ct)).toBe(Math.sign(v.ct));
				else expect(Math.sign(q.x)).toBe(Math.sign(v.x));
			}
		}
		expect(hyperbolaThrough(vec({ n: 80, m: 80 }), 0)).toEqual([]);
	});
});

describe('the predictions of the vectors', () => {
	const NULL: Tip = { n: 100, m: 100 };

	it('answers the first once a null vector has been held across a range of 1 in η', () => {
		let s: NullSeen = NULL_START;
		// the opening's space-like a does not count, however far the slider moves
		for (const eta of [LN2, -2, 2]) s = noteNull(s, eta, VECTOR_OPENING.a);
		expect(s.done).toBeUndefined();
		s = noteNull(s, LN2, NULL);
		s = noteNull(s, 1.2, NULL);
		expect(s.done).toBeUndefined();
		s = noteNull(s, 0.2, NULL);
		expect(s.done).toEqual({ a: NULL, lo: 0.2, hi: 1.2 });
		// and it stays answered
		expect(noteNull(s, 0, VECTOR_OPENING.a)).toBe(s);
	});

	it('forgets the range when the vector moves or stops being null', () => {
		let s: NullSeen = NULL_START;
		s = noteNull(s, -0.5, NULL);
		s = noteNull(s, 0.3, NULL);
		s = noteNull(s, 0.3, { n: 120, m: 120 });
		s = noteNull(s, 0.6, { n: 120, m: 120 });
		expect(s.done).toBeUndefined();
		s = noteNull(s, 0.6, { n: 120, m: 125 });
		expect(s).toEqual(NULL_START);
	});

	it('reports the null vector’s a′⁰ at the ends of the range: e^{∓η} a⁰, never zero', () => {
		const ans = nullAnswer({ a: NULL, lo: 0, hi: LN2 });
		expect(ans.along).toBe(true);
		expect(ans.lo.ct).toBe(1);
		expect(ans.hi.ct).toBe(0.5);
		const back = nullAnswer({ a: { n: 100, m: -100 }, lo: 0, hi: LN2 });
		expect(back.along).toBe(false);
		expect(back.hi.ct).toBe(2);
	});

	it('answers the second once a space-like a with a time component is boosted to |a′⁰| < 0.01', () => {
		const a: Tip = { n: 50, m: 100 };
		expect(SIMULTANEOUS).toBe(0.01);
		expect(noteSimultaneous(undefined, LN2, a, true)).toBeUndefined();
		// the slider's own step nearest β = 0.5, η = 0.549
		const found = noteSimultaneous(undefined, 0.55, a, true);
		expect(found).toEqual({ a, eta: 0.55 });
		const ans = simultaneousAnswer(found!);
		expect(ans.want).toBe(0.5);
		expect(Math.abs(ans.found - 0.5)).toBeLessThan(0.01);
		expect(Math.abs(ans.prime)).toBeLessThan(0.01);
		// and stays answered
		expect(noteSimultaneous(found, 0, VECTOR_OPENING.a, true)).toBe(found);
	});

	it('is not answered by dragging a onto the pixel’s “now” at a fixed rapidity', () => {
		// at η = ln 2 the "now" is ct = 0.6 x: the walk from (1, 0) to (1, 1) passes (1, 0.6)
		const on: Tip = { n: 60, m: 100 };
		expect(boost(LN2, vec(on)).ct).toBe(0);
		expect(noteSimultaneous(undefined, LN2, on, false)).toBeUndefined();
		expect(noteSimultaneous(undefined, LN2, on, true)).toEqual({ a: on, eta: LN2 });
	});

	it('is not answered by a vector simultaneous in the room, nor by a time-like or null one', () => {
		expect(noteSimultaneous(undefined, 0, VECTOR_OPENING.a, true)).toBeUndefined();
		for (const eta of RAPIDITIES) {
			expect(noteSimultaneous(undefined, eta, { n: 125, m: 75 }, true)).toBeUndefined();
			expect(noteSimultaneous(undefined, eta, NULL, true)).toBeUndefined();
		}
	});
});
