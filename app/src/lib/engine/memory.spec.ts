/**
 * The memory of a burst (memory.ts): the quadrature of eq:memory-axes against every closed form of chapter 7.8, the
 * cross part zero for patterns the same all round their axis, the sphere and the dipole exactly zero, the reduced
 * integrand against the paper's eq:memory as it stands, and the share of a pattern in degrees two and higher.
 */
import { describe, expect, it } from 'vitest';
import {
	GRID,
	P2,
	P3,
	closed,
	cosFromAxis,
	dipole,
	epsteinTT,
	gaussLegendre,
	highShare,
	memory,
	merger,
	octupole,
	oneJet,
	quadrupole,
	sphere,
	total,
	twoJets,
	type Pattern
} from './memory';

const deg = (d: number) => (d * Math.PI) / 180;
/** Camera angles across the sky, avoiding none: 0° and 180° are checked on their own. */
const ANGLES = [0, 1, 7.5, 23, 30, 45, 60, 89, 90, 91, 120, 135, 150, 173, 179, 180].map(deg);

describe('Gauss–Legendre', () => {
	it('integrates polynomials of degree 2n − 1 exactly', () => {
		for (const n of [1, 2, 3, 5, 8, 24, 64]) {
			const { x, w } = gaussLegendre(n);
			for (let k = 0; k <= 2 * n - 1; k++) {
				let s = 0;
				for (let i = 0; i < n; i++) s += w[i] * x[i] ** k;
				const exact = k % 2 ? 0 : 2 / (k + 1);
				expect(s).toBeCloseTo(exact, 13);
			}
		}
	});

	it('has nodes in order, symmetric, inside (−1, 1)', () => {
		const { x, w } = gaussLegendre(9);
		for (let i = 0; i < 9; i++) {
			expect(x[i] + x[8 - i]).toBeCloseTo(0, 15);
			expect(w[i]).toBeCloseTo(w[8 - i], 15);
			expect(Math.abs(x[i])).toBeLessThan(1);
			if (i) expect(x[i]).toBeLessThan(x[i - 1]);
		}
		expect(x[4]).toBeCloseTo(0, 15);
	});
});

describe('the patterns', () => {
	it('each carries the whole energy', () => {
		const all: Pattern[] = [
			oneJet(),
			twoJets(),
			sphere(),
			dipole(0.7),
			dipole(-1),
			quadrupole(-1),
			quadrupole(2),
			octupole(0.8),
			merger()
		];
		for (const p of all) expect(total(p)).toBeCloseTo(1, 13);
	});

	it('is never negative over the sliders’ ranges', () => {
		for (let i = 0; i <= 200; i++) {
			const x = -1 + i / 100;
			for (const a of [-1, -0.5, 0.5, 1]) expect(dipole(a).smooth!(x)).toBeGreaterThanOrEqual(0);
			for (const q of [-1, 0.5, 2]) expect(quadrupole(q).smooth!(x)).toBeGreaterThanOrEqual(-1e-17);
		}
	});

	it('the merger is (1 + 6cos²θ′ + cos⁴θ′)/8 of the power along the axis, two fifths on average', () => {
		const f = merger().smooth!;
		expect(f(0) / f(1)).toBeCloseTo(1 / 8, 14);
		expect(f(Math.cos(deg(60))) / f(1)).toBeCloseTo((1 + 6 / 4 + 1 / 16) / 8, 14);
		expect(1 / (4 * Math.PI) / f(1)).toBeCloseTo(2 / 5, 14);
	});
});

describe('the reduced integrand', () => {
	it('is the paper’s eq:memory: 2·[n̂′n̂′/(1 − n̂′·N̂)]^TT = (1 + cos β)(cos 2ψ, sin 2ψ)', () => {
		const N = [0, 0, 1] as const;
		const e1 = [1, 0, 0] as const;
		const e2 = [0, 1, 0] as const;
		for (const beta of [0.05, 0.3, 1, 1.7, 2.9, Math.PI]) {
			for (const psi of [0, 0.4, 1.3, 2.2, 3.7, 5.9]) {
				const n = [
					Math.sin(beta) * Math.cos(psi),
					Math.sin(beta) * Math.sin(psi),
					Math.cos(beta)
				] as const;
				const [plus, cross] = epsteinTT(n, N, e1, e2);
				expect(2 * plus).toBeCloseTo((1 + Math.cos(beta)) * Math.cos(2 * psi), 12);
				expect(2 * cross).toBeCloseTo((1 + Math.cos(beta)) * Math.sin(2 * psi), 12);
			}
		}
	});

	it('places ẑ on the side of e₁: cos θ′ = cos θ cos β + sin θ sin β cos ψ', () => {
		const theta = deg(35);
		const z = [Math.sin(theta), 0, Math.cos(theta)];
		for (const [beta, psi] of [
			[0.4, 0.2],
			[1.2, 2.5],
			[2.6, 4.4]
		]) {
			const n = [Math.sin(beta) * Math.cos(psi), Math.sin(beta) * Math.sin(psi), Math.cos(beta)];
			const dot = n[0] * z[0] + n[1] * z[1] + n[2] * z[2];
			expect(cosFromAxis(theta, Math.cos(beta), psi)).toBeCloseTo(dot, 14);
		}
	});
});

describe('the closed forms, against the quadrature', () => {
	const TOL = 1e-12;

	it('one narrow jet: 2(1 + cos θ) off its line', () => {
		for (const t of ANGLES.filter((t) => t > 0)) {
			const m = memory(oneJet(), t);
			expect(Math.abs(m.plus - closed.oneJet(t))).toBeLessThan(TOL);
			expect(m.inside).toBe(false);
		}
		// from behind it leaves nothing, and the camera is not inside the jet
		expect(memory(oneJet(), Math.PI).plus).toBeCloseTo(0, 14);
	});

	it('one narrow jet, exactly on its line: zero by symmetry, and the camera inside it', () => {
		const m = memory(oneJet(), 0);
		expect(m).toEqual({ plus: 0, cross: 0, inside: true });
		// the limit is 4GE/c⁴r, never reached
		expect(memory(oneJet(), 1e-6).plus).toBeCloseTo(4, 10);
		expect(Number.isFinite(m.plus)).toBe(true);
	});

	it('two opposite jets sharing E: 2 in every direction off their axis, zero on it', () => {
		for (const t of ANGLES.filter((t) => t > 0 && t < Math.PI)) {
			expect(Math.abs(memory(twoJets(), t).plus - closed.twoJets())).toBeLessThan(TOL);
		}
		for (const t of [0, Math.PI]) {
			const m = memory(twoJets(), t);
			expect(m.inside).toBe(true);
			expect(m.plus).toBeCloseTo(0, 14);
		}
	});

	it('a sphere: exactly zero, from every direction', () => {
		for (const t of ANGLES) {
			const m = memory(sphere(), t);
			expect(Math.abs(m.plus)).toBeLessThan(1e-15);
			expect(Math.abs(m.cross)).toBeLessThan(1e-15);
			expect(closed.sphere()).toBe(0);
		}
	});

	it('a dipole: exactly zero, for every a and every direction', () => {
		for (const a of [-1, -0.5, 0.25, 1]) {
			for (const t of ANGLES) {
				const m = memory(dipole(a), t);
				expect(Math.abs(m.plus)).toBeLessThan(1e-15);
				expect(Math.abs(m.cross)).toBeLessThan(1e-15);
			}
		}
		expect(closed.dipole()).toBe(0);
	});

	it('1 + qP₂: (q/2) sin²θ, the paper’s eq:burst-memory', () => {
		for (const q of [-1, -0.3, 0.01, 1, 2]) {
			for (const t of ANGLES) {
				expect(Math.abs(memory(quadrupole(q), t).plus - closed.quadrupole(t, q))).toBeLessThan(TOL);
			}
		}
	});

	it('1 + q₃P₃: (q₃/2) sin²θ cos θ, changing sign between the halves of the sky', () => {
		for (const q3 of [-0.6, 0.5, 1]) {
			for (const t of ANGLES) {
				expect(Math.abs(memory(octupole(q3), t).plus - closed.octupole(t, q3))).toBeLessThan(TOL);
			}
		}
		expect(memory(octupole(1), deg(60)).plus).toBeCloseTo(-memory(octupole(1), deg(120)).plus, 14);
	});

	it('the merger: sin²ι (17 + cos²ι)/24, the paper’s eq:merger-memory', () => {
		for (const t of ANGLES) {
			expect(Math.abs(memory(merger(), t).plus - closed.merger(t))).toBeLessThan(TOL);
		}
		// largest edge-on, 17/24, and nothing face-on
		expect(memory(merger(), deg(90)).plus).toBeCloseTo(17 / 24, 14);
		expect(Math.abs(memory(merger(), 0).plus)).toBeLessThan(1e-15);
	});

	it('the parts of the merger: cos²θ′ gives (2π/3) sin²ι and cos⁴θ′ (4π/15) sin²ι (2 + cos²ι)', () => {
		// in the reduced integral ∫ f (1 + cos β) cos 2ψ d²n̂′, without the factor 2
		for (const t of ANGLES) {
			const s = Math.sin(t) ** 2;
			const c = Math.cos(t) ** 2;
			expect(memory({ smooth: (x) => x * x }, t).plus / 2).toBeCloseTo(((2 * Math.PI) / 3) * s, 12);
			expect(memory({ smooth: (x) => x ** 4 }, t).plus / 2).toBeCloseTo(
				((4 * Math.PI) / 15) * s * (2 + c),
				12
			);
			expect(Math.abs(memory({ smooth: () => 1 }, t).plus)).toBeLessThan(1e-14);
		}
	});

	it('is exact on a small grid, as the degree count says, and unchanged on a fine one', () => {
		const t = deg(57);
		const small = memory(merger(), t, { v: 3, psi: 8 }).plus;
		const fine = memory(merger(), t, { v: 64, psi: 128 }).plus;
		expect(Math.abs(small - closed.merger(t))).toBeLessThan(1e-13);
		expect(Math.abs(fine - small)).toBeLessThan(1e-13);
		expect(GRID.v).toBeGreaterThanOrEqual(3);
		expect(GRID.psi).toBeGreaterThanOrEqual(8);
	});

	it('a narrow but smooth jet tends to the point jet as it narrows', () => {
		// a cap e^{−θ′²/2w²}: the memory falls short of 2(1 + cos θ) by an amount of order w², here about 9w²
		const cap = (w: number): Pattern => {
			const raw = (x: number) =>
				Math.exp(-(Math.acos(Math.max(-1, Math.min(1, x))) ** 2) / (2 * w * w));
			const norm = total({ smooth: raw }, 400);
			return { smooth: (x) => raw(x) / norm };
		};
		const t = deg(60);
		const exact = closed.oneJet(t);
		const err = (w: number) => Math.abs(memory(cap(w), t, { v: 400, psi: 400 }).plus - exact);
		expect(err(0.1)).toBeLessThan(0.1);
		expect(err(0.05) / err(0.1)).toBeCloseTo(0.25, 1);
		expect(err(0.02)).toBeLessThan(0.004);
	});
});

describe('the cross part', () => {
	it('is zero for every pattern the same all round its axis', () => {
		const all: Pattern[] = [
			oneJet(),
			twoJets(),
			sphere(),
			dipole(0.8),
			quadrupole(1.5),
			octupole(-0.7),
			merger()
		];
		for (const p of all)
			for (const t of ANGLES) expect(Math.abs(memory(p, t).cross)).toBeLessThan(1e-15);
	});
});

describe('the share in degrees two and higher', () => {
	it('is zero for a sphere and a dipole', () => {
		expect(highShare(sphere())).toBeCloseTo(0, 14);
		expect(highShare(dipole(1))).toBeCloseTo(0, 14);
		expect(highShare(dipole(-0.4))).toBeCloseTo(0, 14);
	});

	it('is (q²/5)/(1 + q²/5) for 1 + qP₂', () => {
		for (const q of [-1, 0.5, 2]) {
			const s = (q * q) / 5;
			expect(highShare(quadrupole(q))).toBeCloseTo(s / (1 + s), 13);
		}
	});

	it('is 103/355 for the merger, whose 4πf = 1 + (10/7)P₂ + (1/14)P₄', () => {
		expect(highShare(merger())).toBeCloseTo(103 / 355, 13);
		// the expansion itself
		const P4 = (x: number) => (35 * x ** 4 - 30 * x * x + 3) / 8;
		for (const x of [-1, -0.3, 0, 0.6, 1]) {
			expect(4 * Math.PI * merger().smooth!(x)).toBeCloseTo(1 + (10 / 7) * P2(x) + P4(x) / 14, 13);
		}
	});

	it('is one for the jets, which hold every degree', () => {
		expect(highShare(oneJet())).toBe(1);
		expect(highShare(twoJets())).toBe(1);
	});

	it('counts an octupole wholly', () => {
		const s = 0.64 / 7;
		expect(highShare(octupole(0.8))).toBeCloseTo(s / (1 + s), 13);
		expect(P3(1)).toBe(1);
	});
});
