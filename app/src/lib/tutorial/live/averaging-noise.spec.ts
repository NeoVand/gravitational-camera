/** The numbers of chapter 3.1's square-root law, against the numbers the chapter prints, and the law itself tested. */
import { describe, expect, it } from 'vitest';
import {
	BEST_NOISE,
	BEST_RATIO,
	LADDER,
	MEASURED,
	MOST,
	NOISE,
	RECORD,
	STAY,
	TIDE,
	averaged,
	blockAverages,
	draw,
	generator,
	measuredNoise,
	nearestRung,
	noiseOfAverage,
	ratio,
	readings,
	readingsFor,
	stepAppears,
	tideAt,
	timeForRatio
} from './averaging-noise';

describe('the chapter’s numbers', () => {
	it('gives the best gradiometer a ratio of 467 on the person in one second', () => {
		expect(TIDE).toBe(9.34);
		expect(BEST_NOISE).toBe(0.02);
		expect(Math.round(BEST_RATIO)).toBe(467);
	});

	it('takes 4.6 seconds to a ratio of a thousand and 53 days to a million', () => {
		expect(timeForRatio(1000)).toBeCloseTo(4.6, 1);
		expect(timeForRatio(1e6) / 1e6).toBeCloseTo(4.6, 1);
		expect(Math.round(timeForRatio(1e6) / 86400)).toBe(53);
	});

	it('gives 4670 after 100 seconds, with a noise of 0.002 E', () => {
		expect(ratio(100, BEST_NOISE)).toBeCloseTo(4670, 0);
		expect(noiseOfAverage(100, BEST_NOISE)).toBeCloseTo(0.002, 12);
	});

	it('halves the noise with four readings, not two', () => {
		expect(readingsFor(2)).toBe(4);
		expect(noiseOfAverage(4)).toBe(NOISE / 2);
		expect(noiseOfAverage(1)).toBe(NOISE);
	});

	it('lets the step of 9.34 E come through at about ten readings of 30 E', () => {
		expect(NOISE / BEST_NOISE).toBeCloseTo(1500, 9);
		expect(stepAppears()).toBeCloseTo(10.3, 1);
		expect(Math.round(stepAppears())).toBe(10);
		// below 9 E from ten readings on, as the chapter's comment says
		expect(noiseOfAverage(10)).toBeCloseTo(9.49, 2);
		expect(noiseOfAverage(12)).toBeLessThan(9);
		expect(ratio(10)).toBeCloseTo(0.98, 2);
		expect(ratio(100)).toBeCloseTo(3.11, 2);
		expect(ratio(1000)).toBeCloseTo(9.85, 2);
	});

	it('matches the atom gradiometer of the practice problem: 20 E in ten minutes to 9.34 E in 46 minutes', () => {
		const tau = 600 * readingsFor(20 / TIDE);
		expect(Math.round(tau / 60)).toBe(46);
	});
});

describe('the slider’s ladder', () => {
	it('runs from one to a thousand, rising, through 4, 10, 100 and 1000, each dividing a stay', () => {
		expect(LADDER[0]).toBe(1);
		expect(LADDER.at(-1)).toBe(MOST);
		for (let i = 1; i < LADDER.length; i++) expect(LADDER[i]).toBeGreaterThan(LADDER[i - 1]);
		for (const n of [4, 10, 100, 1000]) expect(LADDER).toContain(n);
		expect(LADDER.every(Number.isInteger)).toBe(true);
		expect(LADDER.every((m) => STAY % m === 0)).toBe(true);
		expect(MEASURED.every((m) => RECORD % m === 0)).toBe(true);
		expect(LADDER.length).toBe(28);
	});

	it('finds the nearest rung in the logarithm', () => {
		expect(LADDER[nearestRung(1)]).toBe(1);
		expect(LADDER[nearestRung(9.3)]).toBe(10);
		expect(LADDER[nearestRung(4000)]).toBe(1000);
		expect(LADDER[nearestRung(0.1)]).toBe(1);
	});
});

describe('the record', () => {
	it('has the person away, one metre away and away again, fifty minutes at a time', () => {
		expect(STAY).toBe(3000);
		expect(RECORD).toBe(9000);
		expect(tideAt(0)).toBe(0);
		expect(tideAt(STAY - 1)).toBe(0);
		expect(tideAt(STAY)).toBe(TIDE);
		expect(tideAt(2 * STAY - 1)).toBe(TIDE);
		expect(tideAt(2 * STAY)).toBe(0);
		expect(tideAt(RECORD - 1)).toBe(0);
		// the longest average is shorter than a stay
		expect(MOST).toBeLessThan(STAY);
	});

	it('is the same for the same seed and different for another', () => {
		const a = draw(7);
		const b = draw(7);
		const c = draw(8);
		expect(a.noise).toEqual(b.noise);
		expect(a.noise[123]).not.toBe(c.noise[123]);
		expect(a.noise.length).toBe(RECORD);
		const g = generator(3);
		const h = generator(3);
		for (let k = 0; k < 10; k++) expect(g()).toBe(h());
	});

	it('draws a noise of mean zero and standard deviation 30 E', () => {
		const { noise } = draw(11);
		let s = 0;
		let s2 = 0;
		for (const v of noise) {
			s += v;
			s2 += v * v;
		}
		const mean = s / noise.length;
		const sd = Math.sqrt(s2 / noise.length - mean ** 2);
		// 9000 readings: the mean within four times 30/√9000, the spread within four times 30/√18000
		expect(Math.abs(mean)).toBeLessThan(4 * (NOISE / Math.sqrt(RECORD)));
		expect(Math.abs(sd - NOISE)).toBeLessThan(4 * (NOISE / Math.sqrt(2 * RECORD)));
	});

	it('averages successive blocks of N readings, whole blocks only', () => {
		const values = new Float64Array([1, 2, 3, 4, 5, 6, 7]);
		expect([...blockAverages(values, 1)]).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect([...blockAverages(values, 2)]).toEqual([1.5, 3.5, 5.5]);
		expect([...blockAverages(values, 3)]).toEqual([2, 5]);
	});

	it('keeps the whole signal in the average: the readings are the tide plus the noise, averaged alike', () => {
		const d = draw(5);
		const one = averaged(d, 1);
		const raw = readings(d);
		for (const i of [0, 4000, RECORD - 1]) expect(one.reading[i]).toBeCloseTo(raw[i], 12);
		for (const n of LADDER) {
			const many = averaged(d, n);
			expect(many.reading.length).toBe(RECORD / n);
			// no block straddles a step: each holds the tide of one stay
			for (const v of many.tide) expect(v === 0 || Math.abs(v - TIDE) < 1e-12).toBe(true);
			const j = Math.floor(many.reading.length / 2);
			expect(many.tide[j]).toBeCloseTo(TIDE, 12);
			expect(many.reading[j]).toBeCloseTo(many.tide[j] + many.noise[j], 12);
		}
	});
});

describe('the square-root law, checked on draws', () => {
	it('measures σ_n/√N on each draw to within its own scatter', () => {
		for (const seed of [1, 2, 3]) {
			const d = draw(seed);
			for (const n of MEASURED) {
				// about RECORD/n independent averages: a relative scatter of 1/√(2 RECORD/n); allow four of it
				const tolerance = 4 / Math.sqrt((2 * RECORD) / n);
				const m = measuredNoise(d, n);
				expect(Math.abs(m / noiseOfAverage(n) - 1)).toBeLessThan(tolerance);
			}
		}
	});

	it('falls as one over the square root, not as one over N, on the average of many draws', () => {
		const at = (n: number) => {
			let s = 0;
			for (let seed = 1; seed <= 12; seed++) s += measuredNoise(draw(seed), n) ** 2;
			return Math.sqrt(s / 12);
		};
		const s1 = at(1);
		const s4 = at(4);
		const s100 = at(100);
		expect(s4 / s1).toBeCloseTo(0.5, 1);
		expect(s100 / s1).toBeCloseTo(0.1, 1);
		// the slope of log σ against log N is −½
		const slope = Math.log(s100 / s1) / Math.log(100);
		expect(slope).toBeGreaterThan(-0.55);
		expect(slope).toBeLessThan(-0.45);
	});

	it('gives independent averages of N readings the variance σ_n²/N', () => {
		// non-overlapping blocks of ten: 1000 of them over the record and its ends
		const { noise } = draw(21);
		const n = 10;
		const blocks = Math.floor(noise.length / n);
		let s2 = 0;
		for (let b = 0; b < blocks; b++) {
			let s = 0;
			for (let k = 0; k < n; k++) s += noise[b * n + k];
			s2 += (s / n) ** 2;
		}
		const variance = s2 / blocks;
		const expected = NOISE ** 2 / n;
		// the variance of a variance estimate from 1000 values: √(2/1000) of it; allow four of that
		expect(Math.abs(variance / expected - 1)).toBeLessThan(4 * Math.sqrt(2 / blocks));
	});
});
