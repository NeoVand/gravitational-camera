import { describe, expect, it } from 'vitest';
import {
	PRESETS,
	aboveNoise,
	centreOfMass,
	exactPotential,
	freePlace,
	moments,
	patternsUpTo,
	peak,
	quadrupole,
	ringTerms,
	ruleReach,
	ruleTop,
	runs,
	degreesInWords,
	oddZero,
	settle,
	strengths,
	termAt,
	termDirect,
	type Mass
} from './multipoles';

/** A few bodies inside the circle R, with no symmetry to hide an error behind. */
const BODIES: Mass[][] = [
	PRESETS.ell,
	PRESETS.pair,
	PRESETS.rod,
	[
		{ x: 0.31, y: -0.72 },
		{ x: -0.55, y: 0.12 },
		{ x: 0.83, y: 0.49 },
		{ x: -0.08, y: -0.2 },
		{ x: 0.6, y: -0.1 }
	],
	[{ x: 0.97, y: 0.05 }]
];

const PHIS = [0, 0.4, 1.3, 2.2, 3.1, 4.05, 5.5];

describe('the moments', () => {
	it('the monopole is the mass: Q_00 = M/√4π', () => {
		for (const body of BODIES) {
			const Q = moments(body, 0);
			expect(Q[0][0].re).toBeCloseTo(body.length / Math.sqrt(4 * Math.PI), 13);
			expect(Q[0][0].im).toBeCloseTo(0, 13);
		}
	});

	it('the dipole is the mass times the centre of mass, and zero for the L, whose centre of mass is the origin', () => {
		for (const body of BODIES) {
			const Q = moments(body, 1);
			const cm = centreOfMass(body);
			const M = body.length;
			// Y_11 = −√(3/8π) sin ϑ e^{iφ}, so Q_11 = −√(3/8π) M (x_cm − i y_cm)
			const k = -Math.sqrt(3 / (8 * Math.PI)) * M;
			expect(Q[1][2].re).toBeCloseTo(k * cm.x, 13);
			expect(Q[1][2].im).toBeCloseTo(-k * cm.y, 13);
		}
		const Q = moments(PRESETS.ell, 1);
		for (const q of Q[1]) expect(Math.hypot(q.re, q.im)).toBeLessThan(1e-15);
	});

	it('in the plane, the moments with ℓ − m odd vanish', () => {
		const Q = moments(BODIES[3], 12);
		for (let l = 0; l <= 12; l++)
			for (let m = -l; m <= l; m++)
				if ((l - m) % 2) expect(Math.hypot(Q[l][m + l].re, Q[l][m + l].im)).toBeLessThan(1e-14);
	});

	it('the quadrupole tensor holds the five numbers of degree two: Σ|Q_2m|² = (5/24π) Q_ij Q_ij', () => {
		for (const body of BODIES) {
			const Q = moments(body, 2);
			const sum = Q[2].reduce((s, q) => s + q.re * q.re + q.im * q.im, 0);
			const T = quadrupole(body);
			const square = T.xx ** 2 + T.yy ** 2 + T.zz ** 2 + 2 * T.xy ** 2;
			expect(sum).toBeCloseTo((5 / (24 * Math.PI)) * square, 12);
			expect(T.xx + T.yy + T.zz).toBeCloseTo(0, 14);
		}
	});

	it('chapter 2.3’s pair: Q_xx = m d², Q_yy = Q_zz = −m d²/2, with d = 2R', () => {
		const T = quadrupole(PRESETS.pair);
		expect(T.xx).toBeCloseTo(4, 14);
		expect(T.yy).toBeCloseTo(-2, 14);
		expect(T.zz).toBeCloseTo(-2, 14);
		expect(T.xy).toBeCloseTo(0, 14);
	});

	it('for a body symmetric about z, Q_20 = √(5/16π) Q_zz: three masses round the z axis', () => {
		const a = 0.7;
		const body = [0, 1, 2].map((k) => ({
			x: a * Math.cos((2 * Math.PI * k) / 3),
			y: a * Math.sin((2 * Math.PI * k) / 3)
		}));
		const Q = moments(body, 2);
		const T = quadrupole(body);
		expect(T.xx).toBeCloseTo(T.yy, 13);
		expect(Q[2][2].re).toBeCloseTo(Math.sqrt(5 / (16 * Math.PI)) * T.zz, 13);
		expect(Math.hypot(Q[2][0].re, Q[2][0].im)).toBeLessThan(1e-14);
		expect(Math.hypot(Q[2][4].re, Q[2][4].im)).toBeLessThan(1e-14);
	});
});

describe('the terms on the ring', () => {
	it('the terms from the moments are the generating function’s, term by term (the addition theorem)', () => {
		for (const body of BODIES)
			for (const r of [1.1, 1.5, 3, 6]) {
				const terms = ringTerms(body, r, 30);
				for (const t of terms)
					for (const phi of PHIS) {
						const direct = termDirect(body, t.l, r, phi);
						expect(Math.abs(termAt(t, phi) - direct)).toBeLessThan(1e-12 * r ** -t.l + 1e-15);
					}
			}
	});

	it('the monopole’s term is −1: the potential −G M / r', () => {
		for (const body of BODIES)
			for (const phi of PHIS) expect(termAt(ringTerms(body, 2, 0)[0], phi)).toBeCloseTo(-1, 14);
	});

	it('the expansion adds up to the exact potential, −Σ G m / |x − y|', () => {
		for (const body of BODIES)
			for (const [r, L] of [
				[1.5, 120],
				[3, 40],
				[6, 25]
			]) {
				const terms = ringTerms(body, r, L);
				const M = body.length;
				for (const phi of PHIS) {
					const sum = terms.reduce((s, t) => s + termAt(t, phi), 0) * (M / r);
					const exact = exactPotential(body, r, phi);
					expect(Math.abs(sum - exact) / Math.abs(exact)).toBeLessThan(1e-12);
				}
			}
	});

	it('the peak is the largest size round the ring, to a part in 10¹⁰', () => {
		for (const body of BODIES) {
			const terms = ringTerms(body, 1.3, 40);
			for (const l of [1, 2, 5, 17, 40]) {
				const t = terms[l];
				let fine = 0;
				for (let i = 0; i < 200000; i++)
					fine = Math.max(fine, Math.abs(termAt(t, (2 * Math.PI * i) / 200000)));
				const p = peak(t);
				expect(p.value).toBeGreaterThanOrEqual(fine * (1 - 1e-10));
				expect(p.value).toBeLessThanOrEqual(fine * (1 + 1e-6));
				expect(Math.abs(termAt(t, p.at))).toBeCloseTo(p.value, 14);
			}
		}
	});
});

describe('each degree is weaker by the size over the distance', () => {
	it('no bar passes (R/r)^ℓ, for bodies inside the circle R', () => {
		for (const body of BODIES)
			for (const r of [1.1, 1.5, 3, 6])
				for (const b of strengths(body, r))
					expect(b.value).toBeLessThanOrEqual(b.limit * (1 + 1e-12));
	});

	it('one mass on the circle R, on the line to the camera, reaches the limit: equality', () => {
		for (const r of [1.1, 3, 6])
			for (const b of strengths([{ x: 0, y: 1 }], r)) expect(b.value / b.limit).toBeCloseTo(1, 12);
	});

	it('a ball, all its mass at the centre as far as the outside can tell, has no degree after the monopole', () => {
		const bars = strengths(PRESETS.ball, 3);
		expect(bars[0].value).toBeCloseTo(1, 14);
		for (const b of bars.slice(1)) expect(b.zero).toBe(true);
	});

	it('the L has no dipole, and its other bars are there', () => {
		const bars = strengths(PRESETS.ell, 3);
		expect(bars[1].zero).toBe(true);
		for (const b of bars.filter((b) => b.l !== 1)) expect(b.zero).toBe(false);
	});

	it('moving one mass to the centre leaves the monopole as it was and changes the others', () => {
		const before = strengths(PRESETS.ell, 3);
		const after = strengths([{ x: 0, y: 0 }, ...PRESETS.ell.slice(1)], 3);
		expect(after[0].value).toBe(before[0].value);
		expect(after[1].zero).toBe(false);
		// the corner mass sat at 0.63 R, so it mattered less in each higher degree
		for (let l = 2; l <= 8; l++)
			expect(Math.abs(after[l].value / before[l].value - 1)).toBeGreaterThan(1e-3);
	});

	it('the rule at Section XII’s numbers: r = 3R, SNR = 10⁶ → ℓ < 12.6, degrees 0 to 12, 169 moments', () => {
		expect(ruleReach(3, 1e6)).toBeCloseTo(12.575, 3);
		expect(Math.log(1e6)).toBeCloseTo(13.8, 1);
		expect(Math.log(3)).toBeCloseTo(1.1, 2);
		expect(ruleTop(3, 1e6)).toBe(12);
		expect(patternsUpTo(ruleTop(3, 1e6))).toBe(169);
	});

	it('the prediction: from 1.5R the rule reaches ℓ < 34.1, degrees 0 to 34, about 22 more than from 3R', () => {
		expect(ruleReach(1.5, 1e6)).toBeCloseTo(34.07, 2);
		expect(ruleTop(1.5, 1e6)).toBe(34);
		expect(ruleTop(1.5, 1e6) - ruleTop(3, 1e6)).toBe(22);
		expect(patternsUpTo(34)).toBe(1225);
	});

	it('the chapter’s check: from four radii at 10⁶, ℓ < 9.97, up to degree 9', () => {
		expect(ruleReach(4, 1e6)).toBeCloseTo(9.966, 3);
		expect(ruleTop(4, 1e6)).toBe(9);
		// degree 10 falls below the noise, by 5 per cent
		expect(4 ** -10 * 1e6).toBeCloseTo(0.95, 2);
	});

	it('at the paper’s ceiling, 10⁷⁰, the rule reaches degree 146', () => {
		expect(ruleTop(3, 1e70)).toBe(146);
	});

	it('the person as a rod at 1 m, its ends at 0.85 m: each degree weaker by only 0.85', () => {
		const r = 1 / 0.85;
		expect(1 / r).toBeCloseTo(0.85, 12);
		// the rod's pieces stay under the limit, and its odd degrees vanish by its symmetry
		const bars = strengths(PRESETS.rod, r);
		for (const b of bars) expect(b.value).toBeLessThanOrEqual(b.limit);
		for (const b of bars.filter((b) => b.l % 2)) expect(b.zero).toBe(true);
		expect(oddZero(bars)).toBe(true);
		expect(oddZero(strengths(PRESETS.pair, 2))).toBe(true);
		expect(oddZero(strengths(PRESETS.ell, 2))).toBe(false);
	});

	it('the L’s bars cross the noise a little before the rule does', () => {
		const top = ruleTop(3, 1e6);
		const above = aboveNoise(strengths(PRESETS.ell, 3), 1e6);
		expect(Math.max(...above)).toBeLessThanOrEqual(top);
		expect(Math.max(...above)).toBeGreaterThanOrEqual(top - 2);
	});
});

describe('the helpers', () => {
	it('runs of degrees', () => {
		expect(runs([0, 2, 3, 4, 7])).toBe('0, 2 to 4, 7');
		expect(runs([0, 2, 3])).toBe('0, 2, 3');
		expect(runs([])).toBe('');
		expect(degreesInWords([0, 2, 4, 6, 8])).toBe('the even degrees 0 to 8');
		expect(degreesInWords([0, 2, 3, 4, 7])).toBe('degrees 0, 2 to 4, 7');
		expect(degreesInWords([0])).toBe('degree 0');
	});

	it('masses stay inside the circle and apart, and a new one goes where there is room', () => {
		const body = PRESETS.ell;
		const p = settle(body, 0, { x: 3, y: 0.1 });
		expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1 + 1e-12);
		const q = settle(body, 0, body[1]);
		expect(Math.hypot(q.x - body[1].x, q.y - body[1].y)).toBeGreaterThan(0.119);
		const f = freePlace(body);
		for (const o of body) expect(Math.hypot(f.x - o.x, f.y - o.y)).toBeGreaterThan(0.3);
	});
});
