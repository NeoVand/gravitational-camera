/** The best guess of one number, against the numbers chapter 3.5 prints, and the simulated pairs against the formulas. */
import { describe, expect, it } from 'vitest';
import {
	LEAST,
	MOST,
	PAIRS,
	RUNGS,
	balanced,
	bestWeight,
	draw,
	example,
	meanSquaredError,
	naiveError,
	pairs,
	predict,
	ratio,
	readingSpread,
	simulate,
	slopes,
	snap,
	stepRung,
	tickStep,
	weight,
	wienerError
} from './one-mode-wiener';

describe('the chapter’s numbers', () => {
	it('keeps H = 0.5, 0.9 and 0.1 at s = 1, 3 and 1/3', () => {
		expect(weight(1)).toBe(0.5);
		expect(weight(3)).toBeCloseTo(0.9, 12);
		expect(weight(1 / 3)).toBeCloseTo(0.1, 12);
	});

	it('leaves 0.5 and 0.0099 of the prior’s variance at s = 1 and 10, against 1 and 0.01 for the naive guess', () => {
		expect(wienerError(1)).toBe(0.5);
		expect(wienerError(10).toFixed(4)).toBe('0.0099');
		expect(wienerError(10)).toBeCloseTo(1 / 101, 15);
		expect(naiveError(1)).toBe(1);
		expect(naiveError(10)).toBeCloseTo(0.01, 15);
		// at s = 3, the check's answer: 0.1 of the prior's variance
		expect(wienerError(3)).toBeCloseTo(0.1, 12);
	});

	it('keeps the 17th pattern, s = 1.14, with H = 0.57 and an error of 0.43; the 25th, s = 0.083, with 0.0068', () => {
		expect(weight(1.14).toFixed(2)).toBe('0.57');
		expect(wienerError(1.14).toFixed(2)).toBe('0.43');
		expect(weight(0.083).toPrecision(2)).toBe('0.0068');
	});

	it('makes the naive guess worse than the prior exactly when s < 1', () => {
		expect(naiveError(0.9)).toBeGreaterThan(1);
		expect(naiveError(1.1)).toBeLessThan(1);
		for (const s of [0.01, 0.3, 1, 3, 100])
			expect(wienerError(s)).toBeLessThan(Math.min(1, naiveError(s)));
	});

	it('opens at T = 1, σ_x = σ_n = 1, where s = 1', () => {
		expect(ratio(1, 1, 1)).toBe(1);
		expect(balanced(ratio(1, 1, 1))).toBe(true);
		expect(balanced(ratio(2, 1, 2))).toBe(true);
		expect(balanced(ratio(1.5, 2, 3))).toBe(true);
		expect(balanced(ratio(1.1, 1, 1))).toBe(false);
		expect(balanced(ratio(1, 0.99, 1))).toBe(false);
	});
});

describe('the derivation', () => {
	it('finds the best weight w = Tσ_x²/(T²σ_x² + σ_n²), with H = wT and the error σ_x²/(1 + s²)', () => {
		for (const [t, px, pn] of [
			[1, 1, 1],
			[2.5, 0.4, 1.7],
			[0.1, 10, 3],
			[7, 0.2, 0.15]
		]) {
			const w = bestWeight(t, px, pn);
			const s = ratio(t, px, pn);
			expect(w * t).toBeCloseTo(weight(s), 12);
			const best = meanSquaredError(w, t, px, pn);
			expect(best).toBeCloseTo(px ** 2 * wienerError(s), 12);
			// a minimum: any other weight does worse
			for (const d of [-0.1, -1e-3, 1e-3, 0.1]) {
				expect(meanSquaredError(w + d * w, t, px, pn)).toBeGreaterThan(best);
			}
			// the naive weight 1/T leaves σ_n²/T² = σ_x²/s²
			expect(meanSquaredError(1 / t, t, px, pn)).toBeCloseTo(px ** 2 * naiveError(s), 10);
		}
	});

	it('predicts the prior’s variance, and the two errors, in the unit of x squared', () => {
		const p = predict(2, 3, 1.5);
		expect(p.prior).toBe(9);
		expect(p.naive).toBeCloseTo(1.5 ** 2 / 4, 12);
		expect(p.wiener).toBeCloseTo(9 / (1 + 16), 12);
	});
});

describe('the sliders', () => {
	it('stop at the 181 values of two significant figures from 0.10 to 10, among them 1/3’s 0.33 and 3', () => {
		expect(RUNGS.length).toBe(181);
		expect(RUNGS[0]).toBe(LEAST);
		expect(RUNGS.at(-1)).toBe(MOST);
		for (let i = 1; i < RUNGS.length; i++) expect(RUNGS[i]).toBeGreaterThan(RUNGS[i - 1]);
		for (const v of [0.1, 0.5, 1, 2, 3, 10]) expect(RUNGS).toContain(v);
	});

	it('snap to two figures and step one rung at a time', () => {
		expect(snap(10 ** 0.4771)).toBe(3);
		expect(snap(0.05)).toBe(0.1);
		expect(snap(20)).toBe(10);
		expect(snap(0.996)).toBe(1);
		expect(stepRung(1, 1)).toBe(1.1);
		expect(stepRung(1, -1)).toBe(0.99);
		expect(stepRung(0.99, 1)).toBe(1);
		expect(stepRung(0.1, -1)).toBe(0.1);
		expect(stepRung(10, 3)).toBe(10);
	});

	it('reach s = 1/3 with σ_n = 3, s = 3 with T = 3, and s = 10 with T = 10', () => {
		expect(weight(ratio(1, 1, 3))).toBeCloseTo(0.1, 12);
		expect(weight(ratio(3, 1, 1))).toBeCloseTo(0.9, 12);
		expect(wienerError(ratio(10, 1, 1)).toFixed(4)).toBe('0.0099');
	});
});

describe('the simulated pairs', () => {
	it('are the same for the same seed, and 500 of them', () => {
		const a = draw(7);
		const b = draw(7);
		expect(a.zx.length).toBe(PAIRS);
		expect(a.zn.length).toBe(PAIRS);
		expect(Array.from(a.zx)).toEqual(Array.from(b.zx));
		expect(Array.from(a.zn)).toEqual(Array.from(b.zn));
	});

	it('obey y = Tx + n with the chosen spreads', () => {
		const from = draw(3, 100_000);
		const { x, y } = pairs(from, 2, 0.5, 1.5);
		let xx = 0;
		let nn = 0;
		let xn = 0;
		for (let i = 0; i < x.length; i++) {
			const n = y[i] - 2 * x[i];
			xx += x[i] ** 2;
			nn += n ** 2;
			xn += x[i] * n;
		}
		const m = x.length;
		expect(Math.sqrt(xx / m)).toBeCloseTo(0.5, 2);
		expect(Math.sqrt(nn / m)).toBeCloseTo(1.5, 1);
		expect(Math.abs(xn / m)).toBeLessThan((4 * (0.5 * 1.5)) / Math.sqrt(m));
		expect(Math.sqrt((xx * 4 + nn) / m)).toBeCloseTo(readingSpread(2, 0.5, 1.5), 1);
	});

	it('converge on the predicted errors over many pairs, at s = 1/3, 1, 3 and 10', () => {
		for (const [t, px, pn] of [
			[1, 1, 3],
			[1, 1, 1],
			[3, 1, 1],
			[10, 1, 1],
			[0.4, 2.5, 0.7]
		]) {
			const got = simulate(draw(11, 200_000), t, px, pn);
			const want = predict(t, px, pn);
			// the mean of 200,000 squares of a Gaussian lies within 4 √(2/200,000) of its own mean, relatively
			const tolerance = 4 * Math.sqrt(2 / 200_000);
			expect(Math.abs(got.prior / want.prior - 1)).toBeLessThan(tolerance);
			expect(Math.abs(got.naive / want.naive - 1)).toBeLessThan(tolerance);
			expect(Math.abs(got.wiener / want.wiener - 1)).toBeLessThan(tolerance);
		}
	});

	it('scatter about the predictions by about 6% with 500 pairs, as the figure says', () => {
		const tolerance = 4 * Math.sqrt(2 / PAIRS);
		expect(Math.sqrt(2 / PAIRS)).toBeCloseTo(0.063, 3);
		for (const seed of [1, 2, 3, 4, 5]) {
			const got = simulate(draw(seed), 1, 1, 1);
			expect(Math.abs(got.prior - 1)).toBeLessThan(tolerance);
			expect(Math.abs(got.naive - 1)).toBeLessThan(tolerance);
			expect(Math.abs(got.wiener / 0.5 - 1)).toBeLessThan(tolerance);
			expect(got.wiener).toBeLessThan(got.naive);
		}
	});

	it('put the Wiener line through the middle of the cloud: the regression of x on y has the slope H/T', () => {
		const from = draw(5, 200_000);
		for (const [t, px, pn] of [
			[1, 1, 1],
			[2, 1, 3]
		]) {
			const { x, y } = pairs(from, t, px, pn);
			let xy = 0;
			let yy = 0;
			for (let i = 0; i < x.length; i++) {
				xy += x[i] * y[i];
				yy += y[i] ** 2;
			}
			expect(xy / yy / (weight(ratio(t, px, pn)) / t)).toBeCloseTo(1, 1);
		}
	});

	it('follow one pair whose truth, Wiener guess and naive guess lie apart at the opening', () => {
		for (const seed of [1, 2, 3, 9, 12345]) {
			const from = draw(seed);
			const i = example(from);
			expect(i).toBeGreaterThan(0);
			const { x, y } = pairs(from, 1, 1, 1);
			const wiener = weight(1) * y[i];
			expect(wiener - x[i]).toBeGreaterThan(0.2);
			expect(y[i] - wiener).toBeGreaterThan(0.7);
		}
	});
});

describe('the drawing', () => {
	it('mirrors the two lines about the diagonal, and they meet it as s grows', () => {
		for (const s of [0.1, 1, 3, 10]) {
			const { naive, wiener } = slopes(s);
			expect(naive * wiener).toBeCloseTo(1, 12);
			expect(naive).toBeLessThan(1);
		}
		expect(slopes(1).naive).toBeCloseTo(Math.SQRT1_2, 12);
		expect(slopes(1000).wiener).toBeCloseTo(1, 5);
	});

	it('spaces the ticks 1, 2 or 5 times a power of ten, at most three to a side', () => {
		expect(tickStep(3.6)).toBe(1);
		expect(tickStep(3.6 * Math.SQRT2)).toBe(2);
		expect(tickStep(0.36)).toBe(0.1);
		expect(tickStep(36)).toBe(10);
		expect(tickStep(7.2)).toBe(2);
		expect(tickStep(12)).toBe(5);
		for (const h of [0.37, 0.8, 1.9, 4.4, 9.99, 15, 72, 360]) {
			const n = Math.floor(h / tickStep(h) + 1e-9);
			expect(n).toBeLessThanOrEqual(3);
			expect(n).toBeGreaterThanOrEqual(1);
		}
	});
});
