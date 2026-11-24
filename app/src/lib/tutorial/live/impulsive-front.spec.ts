/**
 * Chapter 13.5's impulsive front: the try spec's checks, each against values written here independently of the
 * module. The energies are recomputed by brute force, from each particle's four-momentum before and after the front
 * (q kept, p_z solved from the mass shell, E = c√(m²c² + p²)); the sum against ¼Σ c q|∇H|² summed here; the kicks of
 * Aichelburg and Sexl's profile against (4Gp/c²)(b − s)/|b − s|² written out; and the rest mass against
 * (ΣE/c)² − |Σp|² and against Q²Var(∇H)/2c² computed here.
 */
import { describe, expect, it } from 'vitest';
import { uniform } from '../../array/random';
import {
	BODY,
	COUNT,
	OPENING,
	QUADRUPOLE,
	RAPIDITY,
	STRENGTH,
	XI,
	arrowScale,
	contours,
	keepOut,
	logarithm,
	pair,
	readGradients,
	reading,
	testParticles,
	unitShape,
	wave,
	type Profile,
	type Settings,
	type Vec
} from './impulsive-front';

const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

/** Random settings over every control's range, from a seed of their own. */
function settings(count: number, seed = 7): Settings[] {
	const next = uniform(seed);
	const profiles: Profile[] = ['as', 'quad', 'pair'];
	return Array.from({ length: count }, (_, i) => {
		const t = 2 * Math.PI * next();
		const r = 1.15 + 1.6 * next();
		return {
			profile: profiles[i % 3],
			b: keepOut([r * Math.cos(t), r * Math.sin(t)]),
			strength: STRENGTH.min + (STRENGTH.max - STRENGTH.min) * next(),
			sign: next() < 0.5 ? 1 : -1,
			rapidity: RAPIDITY.min + (RAPIDITY.max - RAPIDITY.min) * next(),
			xi: XI.min + (XI.max - XI.min) * next(),
			turn: 360 * next()
		};
	});
}
const RANDOM = settings(90);

/** A particle's energy by brute force (c = 1): p_z from the mass shell with q kept, then E = √(m² + p⊥² + p_z²). */
function energy(m: number, q: number, px: number, py: number) {
	const pz = (m * m + px * px + py * py - q * q) / (2 * q);
	const E = Math.sqrt(m * m + px * px + py * py + pz * pz);
	return { E, pz };
}

/** The body's energy before and after a wave of gradient g at each particle, by brute force, as long sums. */
function bruteEnergies(s: Settings) {
	const { shape } = wave(s);
	const ratio = Math.exp(s.rapidity);
	let [plus, minus] = [0, 0];
	for (const p of BODY) {
		const q = p.m * ratio;
		const [gx, gy] = shape.grad(p.x, p.y);
		const before = energy(p.m, q, p.px, p.py).E;
		plus += energy(p.m, q, p.px + 0.5 * q * gx, p.py + 0.5 * q * gy).E - before;
		minus += energy(p.m, q, p.px - 0.5 * q * gx, p.py - 0.5 * q * gy).E - before;
	}
	return { plus, minus };
}

describe('the body', () => {
	it('has 200 particles in the disc, a total mass of one and no sideways momentum', () => {
		expect(BODY).toHaveLength(COUNT);
		expect(COUNT).toBe(200);
		for (const p of BODY) expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1);
		relative(
			BODY.reduce((s, p) => s + p.m, 0),
			1,
			1e-14
		);
		expect(Math.abs(BODY.reduce((s, p) => s + p.px, 0))).toBeLessThan(1e-18);
		expect(Math.abs(BODY.reduce((s, p) => s + p.py, 0))).toBeLessThan(1e-18);
	});

	it('keeps q = mc e^r for every particle: its q is E/c − p_z of its own four-momentum', () => {
		for (const rapidity of [-3, -1.2, 0, 2.5]) {
			const r = readGradients(
				BODY.map((): Vec => [0, 0]),
				rapidity
			);
			BODY.forEach((p, a) => {
				relative(r.q[a], p.m * Math.exp(rapidity), 1e-15);
				const { E, pz } = energy(p.m, r.q[a], p.px, p.py);
				relative(E - pz, r.q[a], 1e-9);
			});
		}
	});
});

describe('the profiles', () => {
	/** The Laplacian by central differences of step h. */
	const laplacian = (H: (x: number, y: number) => number, x: number, y: number, h = 1e-3) =>
		(H(x + h, y) + H(x - h, y) + H(x, y + h) + H(x, y - h) - 4 * H(x, y)) / (h * h);
	const places: Vec[] = [
		[0.3, -0.2],
		[-0.7, 0.5],
		[0.1, 0.9],
		[-2.2, -1.4]
	];

	it('are harmonic across the front, and their gradients are those of H', () => {
		for (const shape of [logarithm([1.5, 0]), QUADRUPOLE, pair(2, 30), pair(5.5, 200)])
			for (const [x, y] of places) {
				const scale = Math.abs(shape.H(x, y)) + 1;
				expect(Math.abs(laplacian(shape.H, x, y))).toBeLessThan(2e-4 * scale * 30);
				const h = 1e-6;
				const [gx, gy] = shape.grad(x, y);
				relative(gx, (shape.H(x + h, y) - shape.H(x - h, y)) / (2 * h), 1e-6);
				relative(gy, (shape.H(x, y + h) - shape.H(x, y - h)) / (2 * h), 1e-6);
			}
	});

	it('take 13.2’s pair as Re e^{ζ₊·x⊥} with ζ₊ = ½(iξ + η), η ⟂ ξ and as long', () => {
		for (const [size, turn] of [
			[0.5, 0],
			[2, 30],
			[6, 135]
		]) {
			const t = (turn * Math.PI) / 180;
			const xi = [size * Math.cos(t), size * Math.sin(t)];
			const eta = [-xi[1], xi[0]];
			// ζ₊ = (½η, ½ξ) as (real, imaginary) parts; e^{ζ·x} = e^{Re ζ·x}(cos Im ζ·x + i sin Im ζ·x)
			for (const [x, y] of places) {
				const re = 0.5 * (eta[0] * x + eta[1] * y);
				const im = 0.5 * (xi[0] * x + xi[1] * y);
				const h = Math.exp(re) * Math.cos(im);
				relative(pair(size, turn).H(x, y), h, 1e-14);
			}
			// ζ₊·ζ₊ = ¼(η·η − ξ·ξ) + ½i ξ·η = 0
			expect(Math.abs(eta[0] ** 2 + eta[1] ** 2 - xi[0] ** 2 - xi[1] ** 2)).toBeLessThan(1e-12);
			expect(Math.abs(xi[0] * eta[0] + xi[1] * eta[1])).toBeLessThan(1e-12);
		}
	});

	it('are scaled so that the largest |∇H| on the body is the strength', () => {
		for (const s of RANDOM) {
			const { shape } = wave(s);
			const most = Math.max(...BODY.map((p) => Math.hypot(...shape.grad(p.x, p.y))));
			relative(most, 10 ** s.strength, 1e-12);
		}
	});
});

describe('the energies', () => {
	it('E₊ − E₀ and E₋ − E₀ are those of each particle’s four-momentum before and after', () => {
		for (const s of RANDOM.slice(0, 30)) {
			const r = reading(s);
			const brute = bruteEnergies(s);
			// the brute force loses digits to the difference of two energies of order Mc²
			const size = Math.abs(r.plus) + Math.abs(r.minus);
			expect(Math.abs(r.plus - brute.plus)).toBeLessThan(1e-5 * size + 1e-13);
			expect(Math.abs(r.minus - brute.minus)).toBeLessThan(1e-5 * size + 1e-13);
		}
	});

	it('the sum E₊ + E₋ − 2E₀ is ¼Σ c q_a |∇H(x_a)|² to 10⁻¹² relative, for every setting', () => {
		for (const s of [...RANDOM, OPENING]) {
			const r = reading(s);
			const { shape } = wave(s);
			const expected = BODY.reduce((sum, p) => {
				const [gx, gy] = shape.grad(p.x, p.y);
				return sum + 0.25 * p.m * Math.exp(s.rapidity) * (gx * gx + gy * gy);
			}, 0);
			relative(r.sum, r.plus + r.minus, 1e-15);
			relative(r.sum, expected, 1e-12);
			relative(r.crossing, expected, 1e-12);
		}
	});

	it('the sign swaps the first two bars and leaves the third', () => {
		for (const s of RANDOM) {
			const a = reading(s);
			const b = reading({ ...s, sign: s.sign === 1 ? -1 : 1 });
			relative(b.plus, a.minus, 1e-13);
			relative(b.minus, a.plus, 1e-13);
			relative(b.sum, a.sum, 1e-13);
			relative(b.crossing, a.crossing, 1e-15);
		}
	});

	it('the third bar is never negative', () => {
		for (const s of settings(300, 11)) {
			const r = reading(s);
			expect(r.sum).toBeGreaterThan(0);
			expect(r.crossing).toBeGreaterThan(0);
		}
	});

	it('one wave can take energy from the body', () => {
		const taken = settings(300, 13).some((s) => {
			const r = reading(s);
			return r.plus < 0 || r.minus < 0;
		});
		expect(taken).toBe(true);
	});
});

describe('the kicks', () => {
	it('at rapidity 0 in Aichelburg and Sexl’s profile are (4Gp/c²)(b − s)/|b − s|², twice Newton’s', () => {
		for (const s of RANDOM.filter((x) => x.profile === 'as')) {
			const at = { ...s, rapidity: 0 };
			const r = reading(at);
			// k = 8Gp/c³ is fixed by the largest |∇H| = k/|b − s| on the body, at the part nearest b
			const nearest = Math.min(...BODY.map((p) => Math.hypot(s.b[0] - p.x, s.b[1] - p.y)));
			const k = s.sign * 10 ** s.strength * nearest;
			// 4Gp/c² = kc/2 and Newton's 2Gp/c² = kc/4, with c = 1
			BODY.forEach((p, a) => {
				const [dx, dy] = [s.b[0] - p.x, s.b[1] - p.y];
				const d2 = dx * dx + dy * dy;
				relative(r.kick[a][0], ((k / 2) * dx) / d2, 1e-12);
				relative(r.kick[a][1], ((k / 2) * dy) / d2, 1e-12);
			});
			const n = r.newton!;
			relative(Math.hypot(s.b[0] - BODY[n.at].x, s.b[1] - BODY[n.at].y), nearest, 1e-14);
			relative(r.kick[n.at][0], 2 * n.kick[0], 1e-13);
			relative(r.kick[n.at][1], 2 * n.kick[1], 1e-13);
		}
	});

	it('at rapidity −3 shrink by e^{−3} ≈ 0.050', () => {
		for (const s of RANDOM) {
			const slow = reading({ ...s, rapidity: 0 });
			const fast = reading({ ...s, rapidity: -3 });
			slow.kick.forEach((k, a) => {
				relative(fast.kick[a][0], 0.049787068367863944 * k[0], 1e-13);
				relative(fast.kick[a][1], 0.049787068367863944 * k[1], 1e-13);
			});
		}
	});
});

describe('the rest mass', () => {
	/** (ΣE/c)² − |Σp|², by brute force from each particle's four-momentum. */
	function massSquared(ratio: number, grads: Vec[], sign: number) {
		let [E, px, py, pz] = [0, 0, 0, 0];
		BODY.forEach((p, a) => {
			const q = p.m * ratio;
			const kx = p.px + sign * 0.5 * q * grads[a][0];
			const ky = p.py + sign * 0.5 * q * grads[a][1];
			const four = energy(p.m, q, kx, ky);
			E += four.E;
			px += kx;
			py += ky;
			pz += four.pz;
		});
		return E * E - px * px - py * py - pz * pz;
	}

	/** Q² Var(∇H)/2c², written out with the weights q_a/Q. */
	function variance(ratio: number, grads: Vec[]) {
		const q = BODY.map((p) => p.m * ratio);
		const Q = q.reduce((s, x) => s + x, 0);
		const mx = grads.reduce((s, g, a) => s + q[a] * g[0], 0) / Q;
		const my = grads.reduce((s, g, a) => s + q[a] * g[1], 0) / Q;
		const v = grads.reduce((s, g, a) => s + q[a] * ((g[0] - mx) ** 2 + (g[1] - my) ** 2), 0) / Q;
		return (Q * Q * v) / 2;
	}

	it('M₊² + M₋² − 2M₀² is Q²Var(∇H)/2c², and agrees with the four-momenta', () => {
		for (const s of RANDOM) {
			const r = reading(s);
			const ratio = Math.exp(s.rapidity);
			relative(r.restMass, variance(ratio, r.grad), 1e-10);
			relative(r.variance, variance(ratio, r.grad), 1e-12);
			if (s.strength > -2.6) {
				// the brute force loses digits to the differences of squares of order M²
				const brute =
					massSquared(ratio, r.grad, 1) +
					massSquared(ratio, r.grad, -1) -
					2 * massSquared(ratio, r.grad, 0);
				relative(r.restMass, brute, 1e-3);
			}
		}
	});

	it('does not change for a uniform ∇H', () => {
		for (const rapidity of [-3, 0, 1.7]) {
			const uniformGrad = BODY.map((): Vec => [3e-3, -2e-3]);
			const r = readGradients(uniformGrad, rapidity);
			const scale = r.sum;
			expect(Math.abs(r.restMass)).toBeLessThan(1e-12 * scale);
			expect(Math.abs(r.variance)).toBeLessThan(1e-12 * scale);
			// the energy still rises, by ¼ c Q |∇H|²
			relative(r.sum, 0.25 * Math.exp(rapidity) * (9e-6 + 4e-6), 1e-12);
		}
	});
});

describe('the test particles', () => {
	it('give the grain ½c|∇H|, the photon along +z nothing, the one along −z a turn of |∇H|', () => {
		const t = testParticles([3e-3, 4e-3]);
		relative(t.grain.velocity, 2.5e-3, 1e-15);
		relative(t.grain.gain, 25e-6 / 8, 1e-15);
		expect(t.along.velocity).toBe(0);
		expect(t.along.gain).toBe(0);
		relative(t.against.turn, 5e-3, 1e-15);
		relative(t.against.gain, 25e-6 / 4, 1e-15);
		// the turn is |Δp⊥|/(E/c), with q = 2E/c: |½ (2E/c) ∇H| / (E/c)
		const E = 1.7;
		relative(Math.hypot(0.5 * 2 * E * 3e-3, 0.5 * 2 * E * 4e-3) / E, t.against.turn, 1e-15);
		// and its gain is eq:proof-shock with p⊥ = 0, (c/2q)|½q∇H|², over E
		relative(((1 / (2 * 2 * E)) * (E * 5e-3) ** 2) / E, t.against.gain, 1e-14);
	});
});

describe('the drawing', () => {
	it('keeps the crossing point outside the body and inside the view', () => {
		for (const b of [
			[0, 0],
			[0.5, 0.2],
			[9, -9],
			[1.5, 0]
		] as Vec[]) {
			const k = keepOut(b);
			expect(Math.hypot(...k)).toBeGreaterThanOrEqual(1.1);
			expect(Math.max(Math.abs(k[0]), Math.abs(k[1]))).toBeLessThanOrEqual(2.85);
		}
		expect(keepOut([1.5, 0])).toEqual([1.5, 0]);
	});

	it('draws arrows to one scale, shortened by a power of ten only when they would grow too long', () => {
		expect(arrowScale(-3, 0).tenths).toBe(0);
		expect(arrowScale(-3, -3).tenths).toBe(0);
		expect(arrowScale(-3, 3).tenths).toBe(1);
		for (const r of [-3, 0, 0.5, 1, 3]) {
			const { perC } = arrowScale(-3, r);
			expect(perC * 0.5e-3 * Math.exp(r)).toBeLessThanOrEqual(0.75);
		}
	});

	it('draws contours that lie on their levels, at equal steps', () => {
		for (const s of [
			OPENING,
			{ ...OPENING, profile: 'quad' as const },
			{ ...OPENING, profile: 'pair' as const }
		]) {
			const shape = unitShape(s);
			const { step, levels } = contours(shape);
			expect(levels.length).toBeGreaterThan(5);
			for (const { level, segments } of levels)
				for (const [p, q] of segments)
					for (const [x, y] of [p, q]) {
						// a crossing found by linear interpolation along a cell's edge, 1/14 R long: close to its level
						// except in the cells next to the logarithm's point
						if (s.profile === 'as' && Math.hypot(x - s.b[0], y - s.b[1]) < 0.3) continue;
						expect(Math.abs(shape.H(x, y) - level * step)).toBeLessThan(0.12 * step);
					}
		}
	});
});
