/**
 * Chapter 13.6's Marolf top: the try spec's checks, each against values written here independently of the module
 * (the chapter's printed numbers, the turn worked by hand, the top's angular velocity taken from its orientation by
 * finite differences, and the swirl's integrals summed over the ball by Simpson's rule), and the module against them.
 */
import { describe, expect, it } from 'vitest';
import { share } from '../../hair/flow';
import {
	DRAWN_TURN,
	EPSILONS,
	INERTIA,
	INNER,
	LZ,
	OPENING_EPSILON,
	TILT,
	WATCH,
	aboutX,
	apply,
	axisOf,
	freeTop,
	momentum,
	opening,
	product,
	response,
	signed,
	swirl,
	topFacets,
	type Mat,
	type Vec
} from './marolf-top';

const TOPS = [0.5, -3];

/** Simpson's rule on [a, b] with n (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, n = 400): number {
	const h = (b - a) / n;
	let s = f(a) + f(b);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
}

/**
 * The swirl's integral of ρ ω(r) ϖ^(2k) over the uniform ball of mass 1 and radius 1, the inner ball out to `a` turning
 * at +1 and the rest at −1, by Simpson's rule in r (split at a) and in θ.
 */
function swirlIntegral(k: number, a: number): number {
	const rho = 3 / (4 * Math.PI);
	const shell = (r: number) =>
		2 *
		Math.PI *
		r *
		r *
		simpson((t) => (r * Math.sin(t)) ** (2 * k) * Math.sin(t), 0, Math.PI, 200);
	return rho * (simpson(shell, 0, a) - simpson(shell, a, 1));
}

describe('the turn about x', () => {
	it('opens on the chapter’s turn of 0.01 rad, from a ladder of 0.001 to 0.1 rad', () => {
		expect(EPSILONS[OPENING_EPSILON]).toBe(0.01);
		expect(EPSILONS[0]).toBe(0.001);
		expect(EPSILONS[EPSILONS.length - 1]).toBe(0.1);
		expect(LZ.opening).toBe(0.5);
		expect([LZ.min, LZ.max]).toEqual([-4, 4]);
		// the slider's grid holds both tops
		for (const lz of TOPS)
			expect(Math.abs(lz / LZ.step - Math.round(lz / LZ.step))).toBeLessThan(1e-9);
	});

	it('gives δL_y/ε = −0.5000 and +3.0000 to first order', () => {
		expect(response(0.5, 0.01).firstOrder).toBeCloseTo(-0.5, 10);
		expect(response(-3, 0.01).firstOrder).toBeCloseTo(3, 10);
		// and the exact turn tends to them as ε shrinks
		expect(response(0.5, 1e-7).exact).toBeCloseTo(-0.5, 5);
		expect(response(-3, 1e-7).exact).toBeCloseTo(3, 5);
	});

	it('gives −0.510 and +2.990 for the exact turn of 0.01 rad', () => {
		expect(signed(response(0.5, 0.01).exact, 3, true)).toBe('−0.510');
		expect(signed(response(-3, 0.01).exact, 3, true)).toBe('+2.990');
		// by hand: δL_y = L_y (cos ε − 1) − L_z sin ε, with L_y = 2
		for (const lz of TOPS) {
			const e = 0.01;
			expect(response(lz, e).exact).toBeCloseTo((2 * (Math.cos(e) - 1) - lz * Math.sin(e)) / e, 12);
		}
	});

	it('moves L as the chapter’s first-order turn does: L_y becomes 1.995 and 2.030 J s', () => {
		expect(response(0.5, 0.01).after[1]).toBeCloseTo(1.995, 3);
		expect(response(-3, 0.01).after[1]).toBeCloseTo(2.03, 3);
		// and leaves L_x and the length of L alone
		for (const lz of TOPS) {
			const { after } = response(lz, 0.05);
			expect(after[0]).toBe(1);
			expect(Math.hypot(...after)).toBeCloseTo(Math.hypot(1, 2, lz), 12);
		}
	});

	it('converges on −L_z as ε shrinks down the ladder', () => {
		for (const lz of TOPS) {
			const gaps = EPSILONS.map((e) => Math.abs(response(lz, e).exact + lz));
			for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThan(gaps[i - 1]);
			// the gap is −ε L_y/2 to leading order
			expect(response(lz, 0.001).exact + lz).toBeCloseTo(-0.001, 5);
		}
	});

	it('turns about x as (y, z) → (y − εz, z + εy) to first order', () => {
		const e = 1e-6;
		const v: Vec = [0.3, -1.2, 2.5];
		const t = apply(aboutX(e), v);
		expect(t[0]).toBe(0.3);
		expect(t[1]).toBeCloseTo(v[1] - e * v[2], 11);
		expect(t[2]).toBeCloseTo(v[2] + e * v[1], 11);
	});

	it('is drawn at 12°, larger than any ε on the ladder', () => {
		expect(DRAWN_TURN).toBeGreaterThan(EPSILONS[EPSILONS.length - 1]);
	});
});

describe('the free top over the watch', () => {
	const transpose = (m: Mat): Mat => [0, 1, 2].map((i) => [m[0][i], m[1][i], m[2][i]]) as Mat;

	/** The angular velocity from the orientation itself: (dO/dt) Oᵀ is the cross product with ω. */
	function omegaFromMotion(L: Vec, start: Mat, t: number): Vec {
		const h = 1e-5;
		const a = freeTop(L, start, t + h).orientation;
		const b = freeTop(L, start, t - h).orientation;
		const o = freeTop(L, start, t).orientation;
		const d = a.map((row, i) => row.map((x, j) => (x - b[i][j]) / (2 * h))) as Mat;
		const w = product(d, transpose(o));
		return [w[2][1], w[0][2], w[1][0]];
	}

	for (const lz of [...TOPS, 4, -4, 0]) {
		const L = momentum(lz);
		const start = opening(L);

		it(`keeps L_x and L_y unchanged for L_z = ${lz}`, () => {
			for (let t = 0; t <= WATCH; t += 0.25) {
				const { momentum: m } = freeTop(L, start, t);
				expect(m[0]).toBeCloseTo(1, 12);
				expect(m[1]).toBeCloseTo(2, 12);
				expect(m[2]).toBeCloseTo(lz, 12);
			}
		});

		it(`moves as a free symmetric top for L_z = ${lz}: its angular momentum, from its motion, is L`, () => {
			const { across, along } = INERTIA;
			for (const t of [0.7, 3.1, 6.4, 9.9]) {
				const w = omegaFromMotion(L, start, t);
				const n = axisOf(freeTop(L, start, t).orientation);
				const wn = w[0] * n[0] + w[1] * n[1] + w[2] * n[2];
				for (let i = 0; i < 3; i++)
					expect(across * w[i] + (along - across) * wn * n[i]).toBeCloseTo(L[i], 6);
			}
		});

		it(`keeps its axis 20° from L, circling it, for L_z = ${lz}`, () => {
			const size = Math.hypot(...L);
			const angles = [0, 2.5, 5, 7.5, 10].map((t) => {
				const n = freeTop(L, start, t).axis;
				return Math.acos((n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / size);
			});
			for (const a of angles) expect(a).toBeCloseTo(TILT, 10);
			// it moves: the axis after ten seconds is not where it began
			const [n0, n1] = [freeTop(L, start, 0).axis, freeTop(L, start, 1).axis];
			expect(Math.hypot(n0[0] - n1[0], n0[1] - n1[1], n0[2] - n1[2])).toBeGreaterThan(0.1);
		});
	}

	it('keeps the turned L over the watch after a turn', () => {
		const { after } = response(0.5, 0.01);
		const start = product(aboutX(0.01), opening(momentum(0.5)));
		for (let t = 0; t <= WATCH; t += 0.5) {
			const m = freeTop(after, start, t).momentum;
			for (let i = 0; i < 3; i++) expect(m[i]).toBeCloseTo(after[i], 12);
		}
	});

	it('draws a closed top whose facets face outward', () => {
		const facets = topFacets();
		expect(facets.length).toBeGreaterThan(200);
		const centre = (f: (typeof facets)[number]) =>
			f.corners.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4, s[2] + p[2] / 4], [0, 0, 0]);
		for (const f of facets) {
			const c = centre(f);
			// away from the axis, never toward it
			expect(f.normal[0] * c[0] + f.normal[1] * c[1]).toBeGreaterThan(-1e-9);
			expect(Math.hypot(...f.normal)).toBeCloseTo(1, 12);
		}
		// the point faces down and the end of the stem up
		const lowest = facets.reduce((a, b) => (centre(b)[2] < centre(a)[2] ? b : a));
		const highest = facets.reduce((a, b) => (centre(b)[2] > centre(a)[2] ? b : a));
		expect(lowest.normal[2]).toBeLessThan(0);
		expect(highest.normal[2]).toBeCloseTo(1, 12);
	});
});

describe('the hidden swirl', () => {
	it('has no angular momentum at 2^(−1/5) R', () => {
		expect(INNER.balanced).toBeCloseTo(0.8706, 4);
		expect(swirl(INNER.balanced).momentum).toBeCloseTo(0, 12);
		expect(swirlIntegral(1, INNER.balanced)).toBeCloseTo(0, 6);
	});

	it('gives the bracket 0.111 M Ω R⁴ at 2^(−1/5) R, as the chapter prints', () => {
		expect(swirl(INNER.balanced).bracket).toBeCloseTo(0.111, 3);
		expect(swirl(INNER.balanced).bracket).toBeCloseTo((16 / 35) * (1 - 2 ** (-2 / 5)), 12);
	});

	it('gives zero bracket at 2^(−1/7) R', () => {
		expect(INNER.zero).toBeCloseTo(0.9057, 4);
		expect(swirl(INNER.zero).bracket).toBeCloseTo(0, 12);
	});

	it('equals −2∫(x² + y²)ℓ_z dV and half the octupolar sum of hidden-flow at every radius', () => {
		for (let a = INNER.min; a <= INNER.max + 1e-9; a += 0.02) {
			const { bracket, momentum: Lz } = swirl(a);
			// the sum of hidden-flow's octupolar plot: the integral of the share of each radius, each part
			// taken up to its own side of the inner radius
			const inside = (r: number) => share(3, Math.min(r, a - 1e-12), a);
			const octupolarSum = simpson(inside, 0, a) + simpson((r) => share(3, r, a), a, 1);
			expect(bracket).toBeCloseTo(octupolarSum / 2, 6);
			expect(bracket).toBeCloseTo(-2 * swirlIntegral(2, a), 6);
			expect(Lz).toBeCloseTo(swirlIntegral(1, a), 6);
		}
	});

	it('takes a negative angular momentum and a positive bracket at 0.5 R', () => {
		expect(swirl(0.5).momentum).toBeCloseTo((2 / 5) * (2 / 32 - 1), 12);
		expect(swirl(0.5).bracket).toBeCloseTo((16 / 35) * (1 - 2 / 128), 12);
	});
});

describe('the numbers as shown', () => {
	it('uses a true minus sign, a plus sign where asked, and no negative zero', () => {
		expect(signed(-0.5)).toBe('−0.500');
		expect(signed(3, 3, true)).toBe('+3.000');
		expect(signed(-1e-9)).toBe('0.000');
		expect(signed(1e-9, 3, true)).toBe('0.000');
	});
});
