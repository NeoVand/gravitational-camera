/**
 * Chapter 10.2's slab, against the rate equation integrated numerically, Planck's law written out afresh, and the
 * numbers the chapter prints.
 */
import { describe, expect, it } from 'vitest';
import {
	BLOCK_T,
	D_AXIS,
	D_MAX,
	ENTER,
	F,
	MIN_SPAN,
	OMEGA,
	OPENING,
	PU_MAX,
	QUANTUM_RADIANCE,
	ROOM_T,
	STOP_SLAB,
	TEMP,
	T_MAX,
	T_MIN,
	enteringAt,
	enteringPosition,
	inverted,
	occupationAt,
	ownOccupation,
	pageEntering,
	pageTemp,
	powers,
	profile,
	reading,
	relax,
	slabAt,
	slabWords,
	snapTemp,
	tempPosition,
	tempText,
	thermal,
	windowFor,
	xAt,
	type Slab
} from './detailed-balance';

const H = 6.62607015e-34;
const KB = 1.380649e-23;
const C = 299792458;

/** Planck's B_ω with h, per unit of angular frequency: (h f³·2/c²)/(e^{hf/kT} − 1)/2π. */
const Bomega = (T: number) =>
	(2 * H * F ** 3) / C ** 2 / Math.expm1((H * F) / (KB * T)) / (2 * Math.PI);

/** dn/dd = P_u(n + 1) − P_l n, integrated from d = 0 by fourth-order Runge–Kutta. */
function integrate(n0: number, slab: Slab, d: number, steps = 20000): number {
	const f = (n: number) => slab.Pu * (n + 1) - slab.Pl * n;
	const h = d / steps;
	let n = n0;
	for (let i = 0; i < steps; i++) {
		const k1 = f(n);
		const k2 = f(n + (h / 2) * k1);
		const k3 = f(n + (h / 2) * k2);
		const k4 = f(n + h * k3);
		n += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
	}
	return n;
}

const SLABS: Slab[] = [
	thermal(10),
	thermal(ROOM_T),
	thermal(BLOCK_T),
	thermal(1e5),
	STOP_SLAB,
	inverted(0.6),
	inverted(PU_MAX)
];

describe('the populations', () => {
	it('add to one and stand in Boltzmann’s ratio', () => {
		for (const T of [10, 77, 293, 1500, 1e4, 1e5]) {
			const s = thermal(T);
			expect(s.Pl + s.Pu).toBeCloseTo(1, 14);
			expect(s.Pu / s.Pl).toBeCloseTo(Math.exp(-xAt(T)), 12);
			expect(s.diff).toBeCloseTo(s.Pl - s.Pu, 14);
		}
	});

	it('make P_u/(P_l − P_u) the thermal occupation 1/(e^x − 1)', () => {
		for (const x of [0.1, 1, 2.821, 10]) {
			const T = (H * F) / (KB * x);
			const s = thermal(T);
			expect(s.Pu / s.diff / (1 / Math.expm1(x))).toBeCloseTo(1, 12);
		}
		// the chapter's numbers: 9.508 at x = 0.1, 0.063 at the energy peak
		expect(1 / Math.expm1(0.1)).toBeCloseTo(9.508, 3);
		expect(ownOccupation(thermal((H * F) / (KB * 2.821)))!).toBeCloseTo(0.06332, 5);
	});

	it('invert past the stop', () => {
		const s = inverted(0.7);
		expect(s.Pl).toBeCloseTo(0.3, 14);
		expect(s.diff).toBeCloseTo(-0.4, 14);
		expect(ownOccupation(s)).toBeUndefined();
		expect(ownOccupation(STOP_SLAB)).toBeUndefined();
	});
});

describe('Kirchhoff’s law', () => {
	it('gives j_ω/α = B_ω(T) whatever enters', () => {
		for (const T of [10, 293, 1500, 1e5]) {
			const B = Bomega(T);
			for (const n0 of [0, 1e-3, 1, 1e3]) {
				const r = reading(n0, thermal(T));
				expect(r.ratio! / B).toBeCloseTo(1, 10);
				expect(r.planck! / B).toBeCloseTo(1, 10);
			}
		}
	});

	it('takes ħω³/4π³c² at 17 THz', () => {
		const HBAR = H / (2 * Math.PI);
		expect(QUANTUM_RADIANCE).toBeCloseTo((HBAR * OMEGA ** 3) / (4 * Math.PI ** 3 * C ** 2), 20);
		expect(QUANTUM_RADIANCE).toBeGreaterThan(1.15e-11);
		expect(QUANTUM_RADIANCE).toBeLessThan(1.16e-11);
	});

	it('keeps the spontaneous emission and the coefficients apart from the radiation', () => {
		const a = reading(0, thermal(ROOM_T));
		const b = reading(500, thermal(ROOM_T));
		expect(b.spontaneous).toBe(a.spontaneous);
		expect(b.j).toBe(a.j);
		expect(b.alpha).toBe(a.alpha);
		expect(b.absorption / b.stimulated).toBeCloseTo(Math.exp(xAt(ROOM_T)), 10);
	});

	it('balances in detail when the radiation is the slab’s own', () => {
		for (const T of [10, 293, 1500, 1e5]) {
			const s = thermal(T);
			const r = reading(ownOccupation(s)!, s);
			expect((r.stimulated + r.spontaneous) / r.absorption).toBeCloseTo(1, 10);
		}
	});

	it('has α = 0 at the stop and α < 0 when inverted', () => {
		expect(reading(1, STOP_SLAB).alpha).toBe(0);
		expect(reading(1, STOP_SLAB).ratio).toBeUndefined();
		expect(reading(1, inverted(0.8)).alpha).toBeCloseTo(-0.6, 14);
	});
});

describe('the occupation along the ray', () => {
	it('solves the rate equation', () => {
		for (const s of SLABS) {
			for (const n0 of [0, 0.05, 3, 1e3]) {
				for (const d of [1e-3, 0.1, 1, D_MAX]) {
					const exact = occupationAt(n0, s, d);
					const numeric = integrate(n0, s, d);
					if (exact === 0) expect(numeric).toBe(0);
					else expect(numeric / exact).toBeCloseTo(1, 9);
				}
			}
		}
	});

	it('starts at what enters and relaxes to n̄(T) in a thick thermal slab', () => {
		const s = thermal(ROOM_T);
		expect(occupationAt(7, s, 0)).toBe(7);
		const nbar = ownOccupation(s)!;
		for (const n0 of [0, nbar, 10]) expect(occupationAt(n0, s, 60) / nbar).toBeCloseTo(1, 10);
	});

	it('grows by P_u per unit of κs at the stop', () => {
		expect(occupationAt(2, STOP_SLAB, 4)).toBeCloseTo(4, 14);
	});

	it('keeps (1 − e^{−a})/a smooth through zero', () => {
		expect(relax(0)).toBe(1);
		expect(relax(1e-12)).toBeCloseTo(1, 11);
		expect(relax(1e-6)).toBeCloseTo(-Math.expm1(-1e-6) / 1e-6, 12);
		expect(relax(-2)).toBeCloseTo(Math.expm1(2) / 2, 12);
	});

	it('samples every hundredth of a power of ten, leaving out zeros', () => {
		const p = profile(1, thermal(ROOM_T));
		expect(p.length).toBe(401);
		expect(p[0][0]).toBe(D_AXIS.low);
		expect(p[400][0]).toBeCloseTo(D_AXIS.high, 12);
		expect(profile(0, thermal(ROOM_T)).length).toBe(401);
	});
});

describe('the strip’s range', () => {
	it('holds the curve and, when near, n̄(T), in whole powers of ten', () => {
		for (const s of SLABS) {
			for (const n0 of [0, 1e-4, 1, 1e3]) {
				const w = windowFor(n0, s);
				expect(Number.isInteger(w.low) && Number.isInteger(w.high)).toBe(true);
				expect(w.high - w.low).toBeGreaterThanOrEqual(MIN_SPAN);
				for (const [, y] of profile(n0, s)) {
					expect(y).toBeGreaterThanOrEqual(w.low);
					expect(y).toBeLessThanOrEqual(w.high);
				}
				const nbar = ownOccupation(s);
				if (nbar !== undefined && w.nbarOff === undefined) {
					expect(Math.log10(nbar)).toBeGreaterThanOrEqual(w.low);
					expect(Math.log10(nbar)).toBeLessThanOrEqual(w.high);
				}
			}
		}
	});

	it('says where n̄(T) lies when it is far off', () => {
		expect(windowFor(1e3, thermal(10)).nbarOff).toBe('below');
		expect(windowFor(0, thermal(ROOM_T)).nbarOff).toBeUndefined();
	});

	it('labels its powers of ten', () => {
		expect(powers({ low: -4, high: 0, every: 1 })).toEqual([-4, -3, -2, -1, 0]);
		expect(powers({ low: -7, high: 3, every: 2 })).toEqual([-6, -4, -2, 0, 2]);
	});
});

describe('the sliders', () => {
	it('open at a room’s slab with nothing entering, at 17 THz', () => {
		const s = slabAt(OPENING.p);
		expect(s.kind).toBe('thermal');
		expect(s.T).toBeCloseTo(ROOM_T, 9);
		expect(enteringAt(OPENING.v)).toBe(0);
		expect(F).toBe(17e12);
		// x = 2.785 at 293 K, P_u = 0.05817
		expect(s.x).toBeCloseTo(2.785, 3);
		expect(s.Pu).toBeCloseTo(0.05817, 5);
	});

	it('run from 10 K to 10⁵ K, stop where P_u = P_l, and invert to P_u = 0.9', () => {
		expect(slabAt(TEMP.low).T).toBeCloseTo(T_MIN, 9);
		expect(slabAt(TEMP.top).T).toBeCloseTo(T_MAX, 4);
		expect(T_MIN).toBe(10);
		expect(slabAt(TEMP.stop)).toBe(STOP_SLAB);
		expect(slabAt(TEMP.stop + 1).kind).toBe('inverted');
		expect(slabAt(TEMP.stop + 1).Pu).toBeCloseTo(0.504, 12);
		expect(slabAt(TEMP.high).Pu).toBeCloseTo(0.9, 12);
		expect(PU_MAX).toBeCloseTo(0.9, 12);
		expect(tempPosition(BLOCK_T)).toBeCloseTo((Math.log10(1500) - 1) * 100, 9);
	});

	it('keep off the detent', () => {
		expect(snapTemp(TEMP.top + 1, TEMP.top)).toBe(TEMP.stop);
		expect(snapTemp(TEMP.stop - 1, TEMP.stop)).toBe(TEMP.top);
		expect(snapTemp(TEMP.top + 5, 200)).toBe(TEMP.stop);
		expect(snapTemp(-4, 0)).toBe(TEMP.low);
		expect(snapTemp(999, 0)).toBe(TEMP.high);
		expect(pageTemp(TEMP.top - 5, true)).toBe(TEMP.stop);
		expect(pageTemp(TEMP.stop + 5, false)).toBe(TEMP.stop);
		expect(pageTemp(TEMP.stop, false)).toBe(TEMP.top);
		expect(pageTemp(TEMP.stop, true)).toBe(TEMP.stop + TEMP.page);
		expect(pageTemp(TEMP.top, true)).toBe(TEMP.stop);
		expect(pageTemp(TEMP.low + 3, false)).toBe(TEMP.low);
	});

	it('read the radiation entering on a scale of powers of ten from zero', () => {
		expect(enteringAt(ENTER.low)).toBe(0);
		expect(enteringAt(0)).toBe(1);
		expect(enteringAt(ENTER.high)).toBe(1e3);
		expect(enteringPosition(0)).toBe(ENTER.low);
		expect(enteringPosition(0.01)).toBeCloseTo(-2, 12);
		expect(pageEntering(ENTER.low, true)).toBe(ENTER.low + ENTER.page);
		expect(pageEntering(ENTER.high, true)).toBe(ENTER.high);
	});

	it('say the slab in words', () => {
		expect(slabWords(thermal(ROOM_T))).toBe('293 K');
		expect(slabWords(STOP_SLAB)).toBe('levels equal');
		expect(slabWords(inverted(0.7))).toBe('inverted, 70.0% upper');
		expect(tempText(1e5)).toBe('1.00 × 10⁵ K');
		expect(tempText(12.3)).toBe('12.3 K');
	});
});
