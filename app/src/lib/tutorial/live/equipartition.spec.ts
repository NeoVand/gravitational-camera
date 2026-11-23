/**
 * Chapter 4.2's warm molecule: its geometry, its modes, the identities of the moments about the centre of mass, and
 * long seeded runs of BAOAB against the Boltzmann distribution and the chapter's numbers.
 */
import { describe, expect, it } from 'vitest';
import {
	ACROSS,
	CORNERS,
	DAMPING_SHARE,
	HEAVY,
	MOST_STEPS,
	Molecule,
	OPENING,
	Q,
	SEED,
	SHRINK,
	SIDE,
	SPREADS,
	SPRINGS,
	Tally,
	centre,
	damping,
	hexagon,
	highest,
	masses,
	modes,
	rates,
	speedRatio,
	spread,
	timeStep,
	totalMass,
	type Estimate,
	type Settings
} from './equipartition';

const at = (s: Partial<Settings>): Settings => ({ ...OPENING, ...s });

/** Runs a seeded molecule for `steps` steps and returns its tally. */
function run(s: Settings, steps: number, seed = SEED) {
	const molecule = new Molecule(s, seed);
	const tally = new Tally();
	molecule.run(steps, tally);
	return tally;
}

/** The estimate lies within `k` standard errors of `value`, and its error is a real, positive number. */
function within(e: Estimate, value: number, k = 4) {
	expect(e.error).toBeGreaterThan(0);
	expect(Math.abs(e.mean - value)).toBeLessThanOrEqual(k * e.error);
}

describe('the molecule', () => {
	it('has twelve springs, six sides of length 1 and six next neighbours of length √3', () => {
		expect(SPRINGS).toHaveLength(12);
		const x = hexagon();
		for (const [a, b, rest] of SPRINGS) {
			const d = Math.hypot(x[2 * b] - x[2 * a], x[2 * b + 1] - x[2 * a + 1]);
			expect(d).toBeCloseTo(rest, 12);
			expect([SIDE, ACROSS]).toContain(rest);
		}
		expect(SPRINGS.filter(([, , r]) => r === SIDE)).toHaveLength(6);
		const pairs = new Set(SPRINGS.map(([a, b]) => [a, b].sort().join('-')));
		expect(pairs.size).toBe(12);
	});

	it('makes the two opposite masses heavier, and counts the whole mass', () => {
		expect(HEAVY).toEqual([0, 3]);
		const m = masses(16);
		expect(Array.from(m)).toEqual([16, 1, 1, 16, 1, 1]);
		expect(totalMass(16)).toBe(36);
		expect(totalMass(1)).toBe(CORNERS);
	});

	it('gives the rigid hexagon Σ m r² = 6 about its centre, and M for any masses', () => {
		const x = hexagon();
		expect(spread(x, masses(1))).toBeCloseTo(6, 12);
		for (const heavy of [2, 16]) expect(spread(x, masses(heavy))).toBeCloseTo(totalMass(heavy), 12);
	});
});

describe('the modes', () => {
	it('has three zero modes and nine of changing shape, the highest at 20 with equal masses at ×1', () => {
		const w = modes(OPENING);
		expect(w).toHaveLength(2 * CORNERS);
		for (const z of w.slice(0, 3)) expect(z).toBeLessThan(1e-6);
		for (const z of w.slice(3)) expect(z).toBeGreaterThan(1);
		expect(highest(OPENING)).toBeCloseTo(20, 9);
	});

	it('scales as the square root of the stiffness, and falls when masses grow', () => {
		expect(highest(at({ stiffness: 10 })) / highest(OPENING)).toBeCloseTo(Math.sqrt(10), 9);
		expect(highest(at({ heavy: 16 }))).toBeLessThan(highest(OPENING));
	});

	it('takes Γ between a tenth and a fifth of the highest angular frequency, and a step well inside BAOAB’s range', () => {
		for (const s of [OPENING, at({ heavy: 16 }), at({ stiffness: 0.1 }), at({ stiffness: 10 })]) {
			const ratio = damping(s) / highest(s);
			expect(ratio).toBeGreaterThanOrEqual(0.1);
			expect(ratio).toBeLessThanOrEqual(0.2 + 1e-12);
			expect(ratio).toBeCloseTo(DAMPING_SHARE, 12);
			expect(timeStep(s) * highest(s)).toBeLessThan(0.5);
		}
	});
});

describe('the moments about the wandering centre', () => {
	// a jumbled molecule and random velocities, from a seeded run
	const molecule = new Molecule(at({ heavy: 4, temperature: 2 }), 7);
	molecule.run(5000);
	const x = Array.from(molecule.x);
	const v = Array.from(molecule.v);
	const m = molecule.mass;

	it('has Σ m (x − X) = 0 and Σ m (y − Y) = 0', () => {
		const { X, Y } = centre(x, m);
		let sx = 0;
		let sy = 0;
		for (let a = 0; a < CORNERS; a++) {
			sx += m[a] * (x[2 * a] - X);
			sy += m[a] * (x[2 * a + 1] - Y);
		}
		expect(Math.abs(sx)).toBeLessThan(1e-12);
		expect(Math.abs(sy)).toBeLessThan(1e-12);
	});

	it('gives Q̇_x as the total momentum, and Q̇_xy unchanged by the centre’s own velocity', () => {
		const { qx, qxy } = rates(x, v, m);
		let p = 0;
		for (let a = 0; a < CORNERS; a++) p += m[a] * v[2 * a];
		expect(qx).toBeCloseTo(p, 12);
		const moved = v.map((w, i) => w + (i % 2 ? -0.7 : 1.3));
		expect(rates(x, moved, m).qxy).toBeCloseTo(qxy, 12);
	});

	it('gives the same Q̇_xy as the rate of change of Σ m (x − X)(y − Y), by a finite difference', () => {
		const Qxy = (pos: number[]) => {
			const { X, Y } = centre(pos, m);
			let q = 0;
			for (let a = 0; a < CORNERS; a++) q += m[a] * (pos[2 * a] - X) * (pos[2 * a + 1] - Y);
			return q;
		};
		const h = 1e-6;
		const ahead = x.map((p, i) => p + h * v[i]);
		const behind = x.map((p, i) => p - h * v[i]);
		expect((Qxy(ahead) - Qxy(behind)) / (2 * h)).toBeCloseTo(rates(x, v, m).qxy, 6);
	});
});

describe('the running averages', () => {
	it('averages by blocks, and gives the ratio of two means', () => {
		const t = new Tally();
		const sample = new Float64Array(5);
		for (let i = 0; i < 2000 + 40 * 1000; i++) {
			sample.fill(i % 2 ? 3 : 1);
			sample[Q.Spread] = 2;
			t.add(sample);
		}
		expect(t.blocks).toBe(40);
		expect(t.ready).toBe(true);
		expect(t.mean(Q.LightEnergy)).toBeCloseTo(2, 12);
		expect(t.estimate(Q.LightEnergy).error).toBeLessThan(1e-9);
		expect(t.ratio(Q.ShapeRate, Q.Spread).mean).toBeCloseTo(1, 12);
	});

	it('stops after MOST_STEPS steps in the figure, where the error on ⟨Q̇_xy²⟩ is below 0.1%', () => {
		expect(MOST_STEPS).toBe(5e7);
	});
});

describe('BAOAB samples the Boltzmann distribution', () => {
	it(
		'gives every mass ½k_BT of energy of motion along each axis, and the centre ⟨Q̇_x²⟩ = k_BT M',
		{ timeout: 60_000 },
		() => {
			for (const s of [OPENING, at({ temperature: 0.25 }), at({ heavy: 16, stiffness: 10 })]) {
				const t = run(s, 2e6);
				within(t.estimate(Q.LightEnergy), 1);
				within(t.estimate(Q.HeavyEnergy), 1);
				within(t.estimate(Q.CentreRate), 1);
				expect(t.estimate(Q.LightEnergy).error).toBeLessThan(0.003);
			}
		}
	);

	it(
		'gives ⟨Q̇_xy²⟩ = k_BT ⟨Σ m (x² + y²)⟩, the chapter’s equation, at every stiffness',
		{ timeout: 60_000 },
		() => {
			for (const s of [OPENING, at({ stiffness: 0.1 }), at({ stiffness: 10, heavy: 4 })]) {
				const t = run(s, 2e6);
				within(t.ratio(Q.ShapeRate, Q.Spread), 1);
			}
		}
	);

	it('makes masses sixteen times heavier move four times slower', { timeout: 60_000 }, () => {
		const t = run(at({ heavy: 16 }), 3e6);
		const r = speedRatio(t, 16);
		within(r, 0.25);
		expect(r.error).toBeLessThan(0.001);
		// the figure answers after 3 × 10⁵ steps: by then the ratio is known to a few parts in a thousand
		expect(speedRatio(run(at({ heavy: 16 }), 3e5), 16).error).toBeLessThan(0.0015);
	});
});

describe('the chapter’s numbers', () => {
	it(
		'Σ m (x² + y²) = 6.13, 6.02 and 6.00 at stiffness ×0.1, ×1 and ×10, and ⟨Q̇_xy²⟩ 0.3% smaller at ×10',
		{ timeout: 60_000 },
		() => {
			const found = SPREADS.map(({ stiffness, value }) => {
				const t = run(at({ stiffness }), stiffness < 1 ? 6e6 : 2e6);
				const e = t.estimate(Q.Spread);
				expect(Math.abs(e.mean - value)).toBeLessThan(stiffness < 1 ? 0.01 : 0.005);
				return e.mean;
			});
			const shrink = 1 - found[2] / found[1];
			expect(shrink).toBeGreaterThan(0.0025);
			expect(shrink).toBeLessThan(0.0035);
			expect(Math.round(shrink * 1000) / 1000).toBe(SHRINK);
		}
	);

	it(
		'needs about 3 × 10⁷ steps for a standard error of 0.1% on ⟨Q̇_xy²⟩',
		{ timeout: 60_000 },
		() => {
			const t = run(at({ stiffness: 10 }), 1e6);
			const e = t.estimate(Q.ShapeRate);
			// the error falls as one over the square root of the steps
			const at3e7 = (e.error / e.mean) * Math.sqrt(1e6 / 3e7);
			expect(at3e7).toBeGreaterThan(0.0007);
			expect(at3e7).toBeLessThan(0.0014);
		}
	);
});
