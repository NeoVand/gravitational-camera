/** Chapter 1.7's cart in phase space, against Hamilton's equations, eq:kick-energy and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	CHAPTER_ENERGY,
	MASS,
	OMEGA,
	PERIOD,
	STIFFNESS,
	STRENGTH,
	angleOf,
	area,
	copies,
	energy,
	evolve,
	gain,
	halfAxes,
	impulse,
	kick,
	profile,
	rates,
	slope,
	stateAt,
	tickStep,
	viewSpan,
	type State,
	type Tide
} from './phase-space';

const close = (a: number, b: number, tolerance = 1e-12) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.max(1, Math.abs(b)));

const TIDES: Tide[] = ['uniform', 'tidal'];
const STATES: State[] = [
	{ q: 0.1, p: 0 },
	{ q: 0, p: 1 },
	{ q: -0.07, p: 0.4 },
	{ q: 0.13, p: -0.9 },
	{ q: -0.02, p: -1.6 }
];

/** One step of the classical fourth-order Runge–Kutta method on Hamilton's equations. */
function rk4(s: State, h: number): State {
	const add = (a: State, d: { q: number; p: number }, f: number) => ({
		q: a.q + f * d.q,
		p: a.p + f * d.p
	});
	const k1 = rates(s);
	const k2 = rates(add(s, k1, h / 2));
	const k3 = rates(add(s, k2, h / 2));
	const k4 = rates(add(s, k3, h));
	return {
		q: s.q + (h / 6) * (k1.q + 2 * k2.q + 2 * k3.q + k4.q),
		p: s.p + (h / 6) * (k1.p + 2 * k2.p + 2 * k3.p + k4.p)
	};
}

describe("the chapter's cart", () => {
	it('has ω = 5 s⁻¹ and swings there and back in 1.26 s', () => {
		close(OMEGA, 5);
		close(OMEGA, Math.sqrt(STIFFNESS / MASS));
		expect(PERIOD.toFixed(2)).toBe('1.26');
	});

	it('at 0.25 J swings 0.1 m to each side, has 1 kg m/s at the centre and the area 0.314 J s', () => {
		const h = halfAxes(CHAPTER_ENERGY);
		close(h.q, 0.1);
		close(h.p, 1);
		close(energy({ q: 0.1, p: 0 }), 0.25);
		close(energy({ q: 0, p: 1 }), 0.25);
		close(area(CHAPTER_ENERGY), (2 * Math.PI * CHAPTER_ENERGY) / OMEGA);
		close(area(CHAPTER_ENERGY), Math.PI * 0.1 * 1);
		expect(area(CHAPTER_ENERGY).toFixed(3)).toBe('0.314');
	});

	it("has the half-axes of the chapter's three nested ellipses", () => {
		for (const [E, q, p] of [
			[0.0625, 0.05, 0.5],
			[0.25, 0.1, 1],
			[0.5625, 0.15, 1.5]
		]) {
			close(halfAxes(E).q, q);
			close(halfAxes(E).p, p);
		}
	});

	it('has an ellipse of area 2πE/ω at every energy', () => {
		for (const E of [0.02, 0.1, 0.25, 0.6, 3]) close(area(E), (2 * Math.PI * E) / OMEGA);
	});
});

describe('the motion', () => {
	it('is the closed form q = A cos ωt, p = −mωA sin ωt', () => {
		const A = 0.1;
		for (const t of [0, 0.1, 0.37, 1, 2.9]) {
			const s = evolve({ q: A, p: 0 }, t);
			close(s.q, A * Math.cos(OMEGA * t));
			close(s.p, -MASS * OMEGA * A * Math.sin(OMEGA * t));
		}
	});

	it("agrees with Hamilton's equations integrated step by step", () => {
		for (const s0 of STATES) {
			let s = s0;
			const h = 1e-3;
			for (let i = 1; i <= 3000; i++) {
				s = rk4(s, h);
				if (i % 500 === 0) {
					const exact = evolve(s0, i * h);
					expect(Math.abs(s.q - exact.q)).toBeLessThan(1e-10);
					expect(Math.abs(s.p - exact.p)).toBeLessThan(1e-9);
				}
			}
		}
	});

	it("has the rates of Hamilton's equations, keeps the energy and returns after one period", () => {
		for (const s0 of STATES) {
			for (const t of [0, 0.2, 0.9]) {
				const d = 1e-6;
				const a = evolve(s0, t - d);
				const b = evolve(s0, t + d);
				const r = rates(evolve(s0, t));
				close((b.q - a.q) / (2 * d), r.q, 1e-8);
				close((b.p - a.p) / (2 * d), r.p, 1e-8);
				close(energy(evolve(s0, t)), energy(s0));
			}
			const back = evolve(s0, PERIOD);
			close(back.q, s0.q);
			close(back.p, s0.p);
		}
	});

	it('goes round clockwise with q to the right and p up: down at the right-hand end', () => {
		expect(rates({ q: 0.1, p: 0 }).p).toBeLessThan(0);
		for (const s of STATES) {
			const r = rates(s);
			// the turn of the velocity about the origin: negative is clockwise
			expect(s.q * r.p - s.p * r.q).toBeLessThan(0);
		}
	});

	it('is the angle θ = ωt + φ round the ellipse', () => {
		for (const s0 of STATES) {
			const E = energy(s0);
			const phi = angleOf(s0);
			const back = stateAt(E, phi);
			close(back.q, s0.q);
			close(back.p, s0.p);
			for (const t of [0.05, 0.3, 1.1]) {
				const a = stateAt(E, phi + OMEGA * t);
				const b = evolve(s0, t);
				close(a.q, b.q);
				close(a.p, b.p);
			}
		}
		const centre = stateAt(CHAPTER_ENERGY, Math.PI / 2);
		close(centre.q, 0);
		close(centre.p, -1);
	});

	it('encloses, round one period, the area 2πE/ω', () => {
		for (const s0 of STATES) {
			// the shoelace formula over the orbit, traced clockwise
			const n = 4000;
			let sum = 0;
			for (let i = 0; i < n; i++) {
				const a = evolve(s0, (i * PERIOD) / n);
				const b = evolve(s0, ((i + 1) * PERIOD) / n);
				sum += a.q * b.p - b.q * a.p;
			}
			close(-sum / 2, area(energy(s0)), 1e-6);
		}
	});
});

describe('the kick', () => {
	it('changes the momentum by ε m g′(q) and not the place', () => {
		expect(slope('uniform', 0.3)).toBe(1);
		expect(slope('tidal', 0.3)).toBe(0.3);
		const d = 1e-6;
		for (const tide of TIDES)
			for (const x of [-0.2, 0, 0.07])
				close((profile(tide, x + d) - profile(tide, x - d)) / (2 * d), slope(tide, x), 1e-8);
		for (const tide of TIDES)
			for (const s of STATES) {
				const after = kick(s, tide, 0.3);
				expect(after.q).toBe(s.q);
				close(after.p - s.p, 0.3 * MASS * slope(tide, s.q));
				close(impulse(tide, 0.3, s.q), 0.3 * MASS * slope(tide, s.q));
			}
	});

	it('leaves the energy of eq:kick-energy, v·J + J²/2m, all of it kinetic', () => {
		for (const tide of TIDES)
			for (const eps of [-0.4, -0.05, 0.2, 3])
				for (const s of STATES) {
					const J = eps * MASS * slope(tide, s.q);
					const v = s.p / MASS;
					const g = gain(s, tide, eps);
					close(g.total, v * J + (J * J) / (2 * MASS));
					close(g.total, energy(kick(s, tide, eps)) - energy(s));
					close(g.motion, eps * s.p * slope(tide, s.q));
					close(g.alone, 0.5 * eps * eps * MASS * slope(tide, s.q) ** 2);
					expect(g.alone).toBeGreaterThanOrEqual(0);
				}
	});

	it("gives the chapter's answers: the motion's part is largest at the centre, and the tidal kick there is nothing", () => {
		const centre = { q: 0, p: 1 };
		const end = { q: 0.1, p: 0 };
		const u = STRENGTH.uniform.start;
		const t = STRENGTH.tidal.start;
		// uniform, ε = 0.2 m/s: 0.2 + 0.04 J at the centre, 0.04 J at the end, at rest
		close(gain(centre, 'uniform', u).motion, 0.2);
		close(gain(centre, 'uniform', u).alone, 0.04);
		close(gain(end, 'uniform', u).motion, 0);
		close(gain(end, 'uniform', u).total, 0.04);
		// tidal, ε = 2 s⁻¹: nothing at the centre, since g′(0) = 0, and 0.04 J at the end
		expect(gain(centre, 'tidal', t).total).toBe(0);
		close(gain(end, 'tidal', t).total, 0.04);
		// the two start with the same kick at the end of the chapter's swing
		close(impulse('uniform', u, 0.1), impulse('tidal', t, 0.1));
		close(impulse('uniform', u, 0.1), 0.4);
	});

	it('gives two copies, kicked both ways, the average ½ε²m g′² and half the difference ε p g′', () => {
		for (const tide of TIDES)
			for (const eps of [-0.3, 0.2, 4])
				for (const s of STATES) {
					const c = copies(s, tide, eps);
					const g = gain(s, tide, eps);
					close(c.average, 0.5 * eps * eps * MASS * slope(tide, s.q) ** 2);
					close(c.average, g.alone);
					close(c.halfDifference, g.motion);
					close(c.plus, g.total);
					close(c.minus, gain(s, tide, -eps).total);
					// the average is what a cart at rest at the same place gains
					close(c.average, gain({ q: s.q, p: 0 }, tide, eps).total);
				}
	});

	it('kicked twice, by ε and then by −ε, one cart only returns to where it was', () => {
		for (const tide of TIDES)
			for (const s of STATES) {
				const back = kick(kick(s, tide, 0.3), tide, -0.3);
				close(back.p, s.p);
				close(energy(back) - energy(s), 0);
			}
	});
});

describe('the drawing', () => {
	it('fits the view to 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6 or 8 times a power of ten', () => {
		expect(viewSpan(0.13)).toBeCloseTo(0.15, 12);
		expect(viewSpan(0.15)).toBeCloseTo(0.15, 12);
		expect(viewSpan(0.151)).toBeCloseTo(0.2, 12);
		expect(viewSpan(0.85)).toBeCloseTo(1, 12);
		expect(viewSpan(0.031)).toBeCloseTo(0.04, 12);
		expect(tickStep(0.3, 6)).toBeCloseTo(0.05, 12);
		expect(tickStep(3, 6)).toBeCloseTo(0.5, 12);
	});
});
