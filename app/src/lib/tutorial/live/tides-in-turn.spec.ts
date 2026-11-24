/**
 * Chapter 13.4's tides in turn: the try spec's checks, each against values written here independently of the module
 * (the chapter's printed numbers, closed forms worked by hand, and brackets summed over the body with profiles and
 * their derivatives taken here by finite differences), and the module's responses against them.
 */
import { describe, expect, it } from 'vitest';
import {
	COUNT,
	PERIOD,
	ROLLS_K,
	SAMPLES,
	SCALE,
	body,
	exactBracket,
	measured,
	responses,
	rollsAcceleration,
	rollsPaths,
	rollsVelocity,
	shown,
	tauAt,
	velocity,
	type Flow,
	type Pair,
	type Particle,
	type Vec
} from './tides-in-turn';

const PAIRS: Pair[] = ['quad', 'oct', 'four', 'mixed'];
const TURNING: Flow[] = ['rest', 'rigid', 'swirl'];
const ZERO_L = 2 ** (-1 / 5);
const ZERO_OCT = 2 ** (-1 / 7);

/** The profiles, written again as plain polynomials. */
const PROFILES: Record<Pair, { h: (x: Vec) => number; g: (x: Vec) => number; degree: number }> = {
	quad: { h: ([x, y]) => (x * x - y * y) / 2, g: ([x, y]) => x * y, degree: 2 },
	oct: {
		h: ([x, y]) => (x ** 3 - 3 * x * y * y) / 3,
		g: ([x, y]) => (3 * x * x * y - y ** 3) / 3,
		degree: 3
	},
	four: {
		h: ([x, y]) => (x ** 4 - 6 * x * x * y * y + y ** 4) / 4,
		g: ([x, y]) => x ** 3 * y - x * y ** 3,
		degree: 4
	},
	mixed: {
		h: ([x, y, z]) => z * z - (x * x + y * y) / 2,
		g: ([x, y, z]) => z ** 3 - 1.5 * z * (x * x + y * y),
		degree: 0
	}
};

const D = 1e-3;
const shift = (x: Vec, j: number, by: number): Vec => {
	const y: Vec = [...x];
	y[j] += by;
	return y;
};
const grad = (f: (x: Vec) => number, x: Vec): Vec =>
	[0, 1, 2].map((j) => (f(shift(x, j, D)) - f(shift(x, j, -D))) / (2 * D)) as Vec;
const hess = (f: (x: Vec) => number, x: Vec) =>
	[0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) =>
				(f(shift(shift(x, i, D), j, D)) -
					f(shift(shift(x, i, D), j, -D)) -
					f(shift(shift(x, i, -D), j, D)) +
					f(shift(shift(x, i, -D), j, -D))) /
				(4 * D * D)
		)
	);
const apply = (m: number[][], v: Vec): Vec =>
	m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]) as Vec;
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The bracket summed over the body at t = 0: Σ m v·[(∇∇h)∇g − (∇∇g)∇h], derivatives by finite differences. */
function summedBracket(flow: Flow, pair: Pair, particles: Particle[]) {
	const { h, g } = PROFILES[pair];
	let sum = 0;
	for (const p of particles) {
		const x: Vec = [p.x, p.y, p.z];
		const a = apply(hess(h, x), grad(g, x));
		const b = apply(hess(g, x), grad(h, x));
		sum += p.m * dot(velocity(flow, p), [a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
	}
	return flow === 'rolls' ? sum / ROLLS_K : sum;
}

/** ∫ρ ϖ^(2k) dV over a uniform ball of mass 1 and radius 1: 3 · 2(2k)!!/(2k + 1)!! / (2(2k + 3)). */
const BALL = { 1: 2 / 5, 2: 8 / 35, 3: 16 / 105 } as Record<number, number>;

const largest = (a: ArrayLike<number>) => Math.max(...Array.from(a, Math.abs));
const gap = (r: { gh: Float64Array; hg: Float64Array }) =>
	largest(Array.from(r.gh, (v, k) => v - r.hg[k]));

describe('the body', () => {
	it('has 400 particles, of total mass 1, in antipodal pairs', () => {
		const particles = body(ZERO_L);
		expect(particles.length).toBe(COUNT);
		expect(particles.reduce((s, p) => s + p.m, 0)).toBeCloseTo(1, 13);
		for (let i = 0; i < COUNT; i += 2) {
			const [p, q] = [particles[i], particles[i + 1]];
			expect(p.x + q.x).toBeCloseTo(0, 14);
			expect(p.z + q.z).toBeCloseTo(0, 14);
			expect(p.m).toBe(q.m);
		}
	});

	it('gives the ball’s ∫ρϖ^(2k) dV inside a and outside it, exactly, for k = 1, 2, 3', () => {
		for (const a of [0.5, 0.7, ZERO_L, ZERO_OCT, 0.98])
			for (const k of [1, 2, 3]) {
				const particles = body(a);
				const inside = particles
					.filter((p) => p.inside)
					.reduce((s, p) => s + p.m * (p.x * p.x + p.y * p.y) ** k, 0);
				const all = particles.reduce((s, p) => s + p.m * (p.x * p.x + p.y * p.y) ** k, 0);
				// a uniform ball of radius a holds a³ of the mass, and its moment scales as a^(2k + 3)
				expect(inside).toBeCloseTo(BALL[k] * a ** (2 * k + 3), 13);
				expect(all).toBeCloseTo(BALL[k], 13);
			}
	});

	it('moves its particles smoothly as the inner radius changes', () => {
		const [p, q] = [body(0.8), body(0.801)];
		for (let i = 0; i < COUNT; i++)
			expect(Math.hypot(p[i].x - q[i].x, p[i].y - q[i].y, p[i].z - q[i].z)).toBeLessThan(0.002);
	});
});

describe('the rolls', () => {
	it('move as J/ρ, J = ∇×∇×V with V = K(1 − r²)² ẑ and K = 3MΩ/32π: speed ΩR at the centre', () => {
		const V = ([x, y, z]: Vec) => ROLLS_K * (1 - (x * x + y * y + z * z)) ** 2;
		const rho = 3 / (4 * Math.PI);
		for (const x of [
			[0.1, 0.2, 0.3],
			[-0.5, 0.1, 0.4],
			[0.3, -0.6, -0.2]
		] as Vec[]) {
			// ∇×∇×(V ẑ) = ∇(∂_z V) − ∇²V ẑ
			const H = hess(V, x);
			const J: Vec = [H[0][2], H[1][2], H[2][2] - (H[0][0] + H[1][1] + H[2][2])];
			const v = rollsVelocity(x);
			for (let j = 0; j < 3; j++) expect(J[j] / rho).toBeCloseTo(v[j], 5);
		}
		expect(rollsVelocity([0, 0, 0])).toEqual([0, 0, 1]);
	});

	it('are held steady by the force m(v·∇)v, so the particles stay on their streamlines and in the ball', () => {
		for (const x of [
			[0.1, 0.2, 0.3],
			[-0.5, 0.1, 0.4]
		] as Vec[]) {
			const v = rollsVelocity(x);
			const a = rollsAcceleration(x);
			for (let i = 0; i < 3; i++) {
				const component = (q: Vec) => rollsVelocity(q)[i];
				expect(dot(grad(component, x), v)).toBeCloseTo(a[i], 6);
			}
		}
		const particles = body(ZERO_L);
		const paths = rollsPaths(particles);
		const end = paths[SAMPLES];
		// the stream function ψ = ϖ²(1 − r²)/2, constant on each streamline of the rolls
		const psi = ([x, y, z]: Vec) => ((x * x + y * y) * (1 - (x * x + y * y + z * z))) / 2;
		particles.forEach((p, i) => {
			expect(Math.hypot(...end[i])).toBeLessThan(1 + 1e-9);
			expect(Math.abs(psi(end[i]) - psi([p.x, p.y, p.z]))).toBeLessThan(1e-7);
		});
	});
});

describe('the try spec’s checks', () => {
	it('at rest, the two curves coincide, for every pair', () => {
		for (const pair of PAIRS) {
			const r = responses('rest', pair, body(ZERO_L));
			expect(gap(r)).toBeLessThan(1e-15);
		}
	});

	it('turning rigidly, the pairs of equal degree read −c sin((n − 1)Ωτ) sin Ωτ / Ω, written by hand', () => {
		for (const pair of ['quad', 'oct', 'four'] as Pair[]) {
			const n = PROFILES[pair].degree;
			const r = responses('rigid', pair, body(ZERO_L));
			for (let k = 0; k <= SAMPLES; k++) {
				const tau = tauAt(k);
				const expected = -BALL[n - 1] * Math.sin((n - 1) * tau) * Math.sin(tau);
				expect(r.gh[k]).toBeCloseTo(expected, 13);
				expect(r.hg[k]).toBeCloseTo(-expected, 13);
			}
		}
	});

	it('turning rigidly, quadrupolar, the difference over τ² tends to −0.8 = −2 × 2/5', () => {
		const r = responses('rigid', 'quad', body(ZERO_L));
		const errors = [1, 10, 100].map((k) => Math.abs(measured('rigid', r, k) + 0.8));
		expect(errors[0]).toBeLessThan(1e-5);
		expect(errors[0]).toBeLessThan(errors[1]);
		expect(errors[1]).toBeLessThan(errors[2]);
		expect(exactBracket('rigid', 'quad', ZERO_L)).toBeCloseTo(-2 * (2 / 5), 14);
	});

	it('the hidden swirl at 0.871 R: quadrupolar curves coincide, octupolar ones part, and the readout is 0.221', () => {
		const particles = body(ZERO_L);
		expect(gap(responses('swirl', 'quad', particles))).toBeLessThan(1e-14);
		const oct = responses('swirl', 'oct', particles);
		// they part by a fifth of the plot's scale at the longest wait
		expect(gap(oct)).toBeGreaterThan(0.2 * SCALE.oct);
		const expected = (32 / 35) * (1 - 2 ** (-2 / 5));
		expect(shown(exactBracket('swirl', 'oct', ZERO_L))).toBe('0.221');
		expect(exactBracket('swirl', 'oct', ZERO_L)).toBeCloseTo(expected, 13);
		expect(shown(measured('swirl', oct, 1))).toBe('0.221');
	});

	it('at 0.906 R the octupolar curves coincide', () => {
		const r = responses('swirl', 'oct', body(ZERO_OCT));
		expect(gap(r)).toBeLessThan(1e-14);
		expect(Math.abs(exactBracket('swirl', 'oct', ZERO_OCT))).toBeLessThan(1e-14);
	});

	it('degree four at 0.871 R reads 0.389', () => {
		const expected = (32 / 35) * (1 - 2 ** (-4 / 5));
		const r = responses('swirl', 'four', body(ZERO_L));
		expect(shown(exactBracket('swirl', 'four', ZERO_L))).toBe('0.389');
		expect(exactBracket('swirl', 'four', ZERO_L)).toBeCloseTo(expected, 13);
		expect(shown(measured('swirl', r, 1))).toBe('0.389');
	});

	it('the quadrupole with the octupole gives coinciding curves on every turning flow', () => {
		for (const flow of TURNING)
			for (const a of [0.55, ZERO_L, ZERO_OCT, 0.97]) {
				const r = responses(flow, 'mixed', body(a));
				expect(gap(r)).toBeLessThan(1e-15);
				expect(exactBracket(flow, 'mixed', a)).toBe(0);
			}
	});

	it('the rolls give coinciding curves for the three pairs of equal degree, and part for the mixed pair', () => {
		const particles = body(ZERO_L);
		for (const pair of ['quad', 'oct', 'four'] as Pair[]) {
			expect(gap(responses('rolls', pair, particles))).toBeLessThan(1e-14);
			expect(exactBracket('rolls', pair, ZERO_L)).toBe(0);
		}
		const mixed = responses('rolls', 'mixed', particles);
		expect(gap(mixed)).toBeGreaterThan(0.5 * SCALE.mixed);
		expect(exactBracket('rolls', 'mixed', ZERO_L)).toBeCloseTo((384 * Math.PI) / 35, 13);
		expect(shown(exactBracket('rolls', 'mixed', ZERO_L))).toBe('34.5');
		expect(shown(measured('rolls', mixed, 1))).toBe('34.5');
	});
});

describe('the measured difference over τ² converges to the exact bracket as τ → 0', () => {
	const cases: [Flow, number][] = [
		['rest', ZERO_L],
		['rigid', ZERO_L],
		['swirl', 0.55],
		['swirl', ZERO_L],
		['swirl', ZERO_OCT],
		['swirl', 0.97],
		['rolls', ZERO_L]
	];

	it('the body’s own sum Σ m v·[(∇∇h)∇g − (∇∇g)∇h] at t = 0 is the exact bracket, to 10⁻⁵', () => {
		for (const [flow, a] of cases)
			for (const pair of PAIRS) {
				const exact = exactBracket(flow, pair, a);
				expect(Math.abs(summedBracket(flow, pair, body(a)) - exact)).toBeLessThan(
					1e-5 * Math.max(1, Math.abs(exact))
				);
			}
	});

	it('at τ = 0.0005 of a period, within 10⁻⁴ of the bracket’s size (or of 1, if it is smaller), and closer as τ shrinks', () => {
		for (const [flow, a] of cases)
			for (const pair of PAIRS) {
				const r = responses(flow, pair, body(a));
				const exact = exactBracket(flow, pair, a);
				const size = Math.max(1, Math.abs(exact));
				const error = (k: number) => Math.abs(measured(flow, r, k) - exact);
				expect(tauAt(1) / PERIOD).toBeCloseTo(0.0005, 12);
				expect(error(1)).toBeLessThan(1e-4 * size);
				// the error is O(τ²) on the turning flows and O(τ) for the rolls: it falls toward τ = 0
				if (error(SAMPLES) > 1e-9 * size) {
					expect(error(1)).toBeLessThan(error(10));
					expect(error(10)).toBeLessThan(error(SAMPLES));
				}
			}
	});

	it('keeps every response within the plot’s scale', () => {
		for (const [flow, a] of cases)
			for (const pair of PAIRS) {
				const r = responses(flow, pair, body(a));
				expect(Math.max(largest(r.gh), largest(r.hg))).toBeLessThan(SCALE[pair]);
			}
	});
});

describe('the readings', () => {
	it('are written with a true minus sign and no negative zero', () => {
		expect(shown(-0.8)).toBe('−0.800');
		expect(shown(-1e-9)).toBe('0.000');
		expect(shown(34.4678)).toBe('34.5');
	});
});
