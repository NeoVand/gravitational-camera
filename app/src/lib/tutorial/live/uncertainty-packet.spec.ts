/**
 * The uncertainty packet's arithmetic (uncertainty-packet.ts): the transform's σ_p against the chapter's closed form
 * σ_p = (ħ/2σ_x)√(1 + 16a²σ_x⁴), the two copies' σ_x² against σ_x0² + (d²/4)/(1 + e^{−d²/8σ_x0²}), the
 * normalization on both sides, the grid's reach, the curves, the keys, the words and the three predictions.
 */
import { describe, expect, it } from 'vitest';
import {
	CHIRP,
	DIST,
	MANY,
	N,
	OPENING,
	P_SPAN,
	SIGMA,
	X_SPAN,
	fixed,
	landed,
	momentumCurve,
	noteFirst,
	noteSecond,
	noteThird,
	normOf,
	positionCurve,
	ratioOne,
	reading,
	sigmaPOne,
	spanOf,
	stepped,
	texFixed,
	transform,
	varPTwo,
	varXTwo,
	type Settings
} from './uncertainty-packet';

const one = (sigma: number, a = 0): Settings => ({ sigma, a, split: false, d: 3 });
const two = (sigma: number, d: number, a = 0): Settings => ({ sigma, a, split: true, d });
const WIDTHS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];
const CHIRPS = [0, 0.05, 0.3, 0.6, 1];

describe('the closed forms', () => {
	it('one packet without a chirp reaches the bound', () => {
		for (const s of WIDTHS) {
			expect(sigmaPOne(s, 0)).toBeCloseTo(1 / (2 * s), 15);
			expect(ratioOne(s, 0)).toBe(1);
		}
	});

	it('at σ_x = 1, a = 0.3 the ratio is √2.44 = 1.562', () => {
		expect(fixed(ratioOne(1, 0.3))).toBe('1.562');
		expect(2 * sigmaPOne(1, 0.3)).toBeCloseTo(Math.sqrt(2.44), 15);
	});

	it('the two copies’ σ_x² grows by 62% of d²/4 at d = 2σ_x0, by nothing at d = 0, by all of it far apart', () => {
		for (const s of [0.5, 1, 2]) {
			expect(varXTwo(s, 0)).toBeCloseTo(s * s, 14);
			expect((varXTwo(s, 2 * s) - s * s) / (s * s)).toBeCloseTo(1 / (1 + Math.exp(-0.5)), 14);
			expect(Math.round(((varXTwo(s, 2 * s) - s * s) / (s * s)) * 100)).toBe(62);
			expect((varXTwo(s, 20 * s) - s * s) / (100 * s * s)).toBeCloseTo(1, 12);
		}
	});

	it('the two copies’ σ_p is one packet’s at d = 0 and far apart, and less between', () => {
		for (const s of [0.5, 1, 2]) {
			const alone = 1 / (4 * s * s);
			expect(varPTwo(s, 0)).toBeCloseTo(alone, 14);
			expect(varPTwo(s, 12 * s) / alone).toBeCloseTo(1, 5);
			expect(varPTwo(s, 4 * s) / alone).toBeLessThan(0.6);
		}
	});
});

describe('the grid', () => {
	it('has 2048 points', () => {
		expect(N).toBe(2048);
		expect(transform(OPENING).x.length).toBe(2048);
		expect(transform(OPENING).k.length).toBe(2048);
	});

	it('reaches eight of one packet’s σ_p and resolves it twelve times over, in every state the sliders allow', () => {
		for (const s of [0.25, 0.5, 1, 2, 3, 4])
			for (const a of [0, 0.01, 0.05, 0.3, 1])
				for (const split of [false, true])
					for (const d of split ? [0, 1, 3, 6, 10] : [3]) {
						const st = { sigma: s, a, split, d };
						const L = spanOf(st);
						const sp = sigmaPOne(s, a);
						expect((Math.PI * N) / L / sp).toBeGreaterThan(8);
						expect(sp / ((2 * Math.PI) / L)).toBeGreaterThanOrEqual(12 - 1e-9);
						// the outer edge of ψ is inside the grid
						expect(L / 2).toBeGreaterThanOrEqual((split ? d / 2 : 0) + 9 * s - 1e-9);
					}
	});
});

describe('normalization', () => {
	it('the grid’s ∫|ψ|² agrees with the formula, chirped or not, one packet or two', () => {
		for (const s of [0.25, 1, 4])
			for (const a of [0, 0.3, 1])
				for (const st of [one(s, a), two(s, 0, a), two(s, 1.5, a), two(s, 10, a)])
					expect(transform(st).norm / normOf(st)).toBeCloseTo(1, 9);
	});

	it('the momentum density has unit area, by Parseval’s theorem before it is normalized', () => {
		for (const s of [0.25, 1, 4])
			for (const a of [0, 0.3, 1])
				for (const st of [one(s, a), two(s, 3, a), two(s, 10, a)]) {
					const t = transform(st);
					expect(t.parseval).toBeCloseTo(1, 9);
					let area = 0;
					for (const v of t.momentum) area += v * t.dk;
					expect(area).toBeCloseTo(1, 12);
					let where = 0;
					for (const v of t.density) where += v * t.dx;
					expect(where).toBeCloseTo(1, 12);
				}
	});

	it('the position curve has unit area', () => {
		for (const st of [one(1), one(0.25, 1), two(1, 6), two(0.5, 3, 0.5)]) {
			const c = positionCurve(st, 4800);
			const h = (2 * X_SPAN) / 4800;
			const area = c.reduce((s, q) => s + q.rho * h, 0);
			expect(area).toBeCloseTo(1, 6);
		}
	});
});

describe('the transform', () => {
	it('gives σ_xσ_p/(ħ/2) = 1.000 at a = 0 for every width', () => {
		for (let k = 0; k <= 75; k++) {
			const s = landed(0.25 + 0.05 * k, SIGMA);
			const t = transform(one(s));
			expect(fixed(t.ratio)).toBe('1.000');
			expect(t.ratio).toBeCloseTo(1, 9);
			expect(t.sigmaX).toBeCloseTo(s, 9);
			expect(t.sigmaP).toBeCloseTo(1 / (2 * s), 9);
		}
	});

	it('gives 1.562 at σ_x = 1, a = 0.3', () => {
		const t = transform(one(1, 0.3));
		expect(fixed(t.ratio)).toBe('1.562');
		expect(fixed(t.sigmaP)).toBe(fixed(sigmaPOne(1, 0.3)));
	});

	it('agrees with the closed form σ_p = (ħ/2σ_x)√(1 + 16a²σ_x⁴) to three figures and better', () => {
		for (const s of WIDTHS)
			for (const a of CHIRPS) {
				const t = transform(one(s, a));
				expect(t.sigmaP / sigmaPOne(s, a)).toBeCloseTo(1, 8);
				expect(t.sigmaX / s).toBeCloseTo(1, 9);
				expect(fixed(t.ratio)).toBe(fixed(ratioOne(s, a)));
			}
	});

	it('the chirp leaves σ_x alone and never brings the ratio below 1', () => {
		for (const s of WIDTHS)
			for (const a of CHIRPS) {
				const t = transform(one(s, a));
				expect(t.sigmaX).toBeCloseTo(s, 9);
				expect(t.ratio).toBeGreaterThanOrEqual(1 - 1e-9);
			}
		for (const s of [0.5, 1])
			for (const d of [1, 3, 6, 10])
				for (const a of CHIRPS) expect(transform(two(s, d, a)).ratio).toBeGreaterThan(1 - 1e-9);
	});

	it('two unchirped copies: σ_x² and σ_p² as the closed forms say', () => {
		for (const s of [0.25, 0.5, 1, 1.5])
			for (const d of [0, 0.5, 1, 2 * s, 3, 6, 10]) {
				const t = transform(two(s, d));
				expect(t.sigmaX ** 2 / varXTwo(s, d)).toBeCloseTo(1, 9);
				expect(t.sigmaP ** 2 / varPTwo(s, d)).toBeCloseTo(1, 8);
			}
	});

	it('means are zero: ψ is even', () => {
		for (const st of [one(1, 0.5), two(1, 6, 0.3)]) {
			const t = transform(st);
			expect(Math.abs(t.meanX)).toBeLessThan(1e-9);
			expect(Math.abs(t.meanP)).toBeLessThan(1e-9);
		}
	});

	it('the copies interfere: fringes 2π/d apart in the momenta', () => {
		const d = 8;
		const t = transform(two(1, d));
		// |ψ̃|² = |φ̃|² 4cos²(kd/2): zero at k = π/d, high again at 2π/d
		const index = (k: number) => Math.round(k / t.dk) + N / 2;
		const shape = (k: number) => Math.exp(-2 * k * k) * Math.cos((k * d) / 2) ** 2;
		expect(t.momentum[index(Math.PI / d)] / t.momentum[N / 2]).toBeLessThan(0.01);
		for (const k of [Math.PI / d, (2 * Math.PI) / d, (3 * Math.PI) / d, 1]) {
			const i = index(k);
			expect(t.momentum[i] / t.momentum[N / 2]).toBeCloseTo(shape(t.k[i]), 9);
		}
	});
});

describe('the curves and the readings', () => {
	it('the position curve runs over the plot, its Re ψ inside the envelope', () => {
		const c = positionCurve(one(1, 0.5), 600);
		expect(c.length).toBe(601);
		expect(c[0].x).toBe(-X_SPAN);
		expect(c[600].x).toBe(X_SPAN);
		for (const q of c) expect(q.re * q.re).toBeLessThanOrEqual(q.rho + 1e-15);
	});

	it('the momentum curve covers the plot and one point beyond each end', () => {
		const c = momentumCurve(transform(OPENING));
		expect(c[0].p).toBeLessThan(-P_SPAN);
		expect(c[1].p).toBeGreaterThanOrEqual(-P_SPAN);
		expect(c[c.length - 1].p).toBeGreaterThan(P_SPAN);
	});

	it('the readings carry a closed form for one packet and for unchirped copies only', () => {
		expect(reading(OPENING).closed?.sigmaP).toBeCloseTo(0.5, 15);
		expect(reading(two(1, 3)).closed?.sigmaX).toBeCloseTo(Math.sqrt(varXTwo(1, 3)), 15);
		expect(reading(two(1, 3, 0.2)).closed).toBeUndefined();
		expect(reading(two(1, 3, 0.2)).alone.sigmaP).toBeCloseTo(sigmaPOne(1, 0.2), 15);
	});
});

describe('the keys', () => {
	it('step the width by 0.05, 0.25 with Shift, within 0.25 to 4', () => {
		expect(stepped(1, 'ArrowLeft', false, SIGMA)).toBe(0.95);
		expect(stepped(1, 'ArrowLeft', true, SIGMA)).toBe(0.75);
		expect(stepped(0.75, 'ArrowLeft', true, SIGMA)).toBe(0.5);
		expect(stepped(0.25, 'ArrowLeft', false, SIGMA)).toBe(0.25);
		expect(stepped(1, 'End', false, SIGMA)).toBe(4);
		expect(stepped(1, 'Home', false, SIGMA)).toBe(0.25);
	});

	it('step the chirp by 0.05 and the distance by 0.5, 2 with Shift', () => {
		expect(stepped(0, 'ArrowRight', false, CHIRP)).toBe(0.05);
		expect(stepped(0.25, 'ArrowRight', false, CHIRP)).toBe(0.3);
		expect(stepped(3, 'ArrowRight', false, DIST)).toBe(3.5);
		expect(stepped(3, 'ArrowRight', true, DIST)).toBe(4);
		expect(stepped(10, 'ArrowUp', false, DIST)).toBe(10);
	});
});

describe('the predictions', () => {
	it('the first is answered by halving an unchirped packet’s width, from 1 to 0.5', () => {
		let p = noteFirst(false, [OPENING.sigma], OPENING);
		expect(p.done).toBe(false);
		for (const s of [0.95, 0.9, 0.75, 0.6]) {
			p = noteFirst(p.done, p.seen, one(s));
			expect(p.done).toBe(false);
		}
		p = noteFirst(p.done, p.seen, one(0.5));
		expect(p.done).toBe(true);
		// once answered it stays answered
		expect(noteFirst(p.done, p.seen, one(3, 0.4)).done).toBe(true);
	});

	it('from 2 to 1 as well, but not widening, nor with a chirp or two copies', () => {
		let p = noteFirst(false, [1], one(2));
		expect(p.done).toBe(false); // widening from 1 to 2 is not narrowing
		p = noteFirst(p.done, p.seen, one(1));
		expect(p.done).toBe(true);
		// widths with a chirp are not recorded, and halving to one with a chirp does not count
		let q = noteFirst(false, [1], one(3, 0.2));
		expect(q.seen).toEqual([1]);
		q = noteFirst(q.done, q.seen, one(0.5, 0.2));
		expect(q.done).toBe(false);
		q = noteFirst(q.done, q.seen, two(0.5, 3));
		expect(q.done).toBe(false);
	});

	it('the second once one packet has a chirp', () => {
		expect(noteSecond(false, OPENING)).toBe(false);
		expect(noteSecond(false, two(1, 3, 0.3))).toBe(false);
		expect(noteSecond(false, one(1, 0.05))).toBe(true);
		expect(noteSecond(true, OPENING)).toBe(true);
	});

	it('the third once the copies are at least six widths apart', () => {
		expect(MANY).toBe(6);
		expect(noteThird(false, two(1, 3))).toBe(false);
		expect(noteThird(false, two(1, 5.9))).toBe(false);
		expect(noteThird(false, two(1, 6))).toBe(true);
		expect(noteThird(false, two(0.5, 3))).toBe(true);
		expect(noteThird(false, { ...two(1, 8), split: false })).toBe(false);
		expect(noteThird(true, OPENING)).toBe(true);
	});

	it('at six widths σ_p is within 6% of one copy’s, and σ_x near d/2', () => {
		const r = reading(two(1, 6));
		expect(r.sigmaP / r.alone.sigmaP).toBeGreaterThan(0.94);
		expect(r.sigmaX / 3).toBeGreaterThan(1);
		expect(r.sigmaX / 3).toBeLessThan(1.06);
		expect(r.ratio).toBeGreaterThan(2.9);
	});
});

describe('the words', () => {
	it('three decimals, a true minus, no −0.000', () => {
		expect(fixed(1)).toBe('1.000');
		expect(fixed(-0.25)).toBe('−0.250');
		expect(fixed(-0.0001)).toBe('0.000');
		expect(fixed(1.5, 2)).toBe('1.50');
		expect(texFixed(-0.25)).toBe('-0.250');
	});
});
