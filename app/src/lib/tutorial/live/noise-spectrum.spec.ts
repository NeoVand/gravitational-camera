/** Chapter 3.2's three noises: their exact autocorrelations and spectra, Wiener–Khinchin on a draw, and Var = S(0)/τ. */
import { describe, expect, it } from 'vitest';
import {
	KINDS,
	LADDER,
	LAGS,
	LOWEST,
	MODELS,
	NARROW_PERIOD,
	NARROW_TC,
	RECORDS,
	RED_TC,
	SAMPLES,
	blockAverages,
	correlation,
	directCorrelation,
	draw,
	fft,
	frequencyOf,
	generator,
	law,
	logBins,
	measuredCorrelation,
	measuredSpread,
	nearestRung,
	periodogram,
	sluggishZero,
	spectrum,
	variance,
	varianceOfAverage,
	zeroFrequency
} from './noise-spectrum';

const { white, red, narrow } = MODELS;

/** ∫ f(ω) dω/2π over one period, −π to π, by the midpoint rule on `n` points (spectral accuracy for smooth f). */
function overBand(f: (w: number) => number, n = 1 << 16): number {
	let s = 0;
	for (let j = 0; j < n; j++) s += f(-Math.PI + ((j + 0.5) * 2 * Math.PI) / n);
	return s / n;
}

describe('the exact curves', () => {
	it('gives every kind the variance one, and the chapter’s correlation times and period', () => {
		for (const k of KINDS) expect(variance(MODELS[k])).toBeCloseTo(1, 14);
		expect(RED_TC).toBe(500);
		expect(NARROW_TC).toBe(40);
		expect(NARROW_PERIOD).toBe(20);
		expect(narrow.w0).toBeCloseTo((2 * Math.PI) / 20, 14);
	});

	it('makes white noise one spike, C(t) = S δ(t), and its spectrum flat at S = 1', () => {
		expect(correlation(white, 0)).toBe(1);
		for (const t of [1, 2, 10, 200]) expect(correlation(white, t)).toBe(0);
		for (const w of [0, 0.01, 1, Math.PI]) expect(spectrum(white, w)).toBe(1);
	});

	it('gives red noise the chapter’s sluggish autocorrelation and S(0) = 2σ²τ_c, plus its white floor', () => {
		for (const t of [1, 50, 500, 2000])
			expect(correlation(red, t)).toBeCloseTo(0.8 * Math.exp(-t / 500), 14);
		expect(correlation(red, -50)).toBe(correlation(red, 50));
		// 2(0.8)(500) + 0.2 = 800.2, to a part in a million
		expect(zeroFrequency(red) / (sluggishZero(0.8, 500) + 0.2) - 1).toBeLessThan(1e-6);
		expect(zeroFrequency(red)).toBeCloseTo(800.2, 3);
		// the chapter's 2σ²τ_c/(1 + ω²τ_c²) well below a radian per sample, and 1/ω² down to the floor of 0.2
		for (const w of [0.001, 0.003, 0.01, 0.03]) {
			const continuous = (2 * 0.8 * 500) / (1 + (w * 500) ** 2) + 0.2;
			expect(Math.abs(spectrum(red, w) / continuous - 1)).toBeLessThan(1e-3);
		}
		expect(spectrum(red, 0.01) / (spectrum(red, 0.02) - 0.2)).toBeGreaterThan(3.9);
		expect(spectrum(red, Math.PI)).toBeCloseTo(0.2, 2);
	});

	it('gives narrow-band noise a ringing autocorrelation and a peak at ω₀', () => {
		expect(correlation(narrow, 10)).toBeCloseTo(-Math.exp(-10 / 40), 12);
		expect(correlation(narrow, 20)).toBeCloseTo(Math.exp(-20 / 40), 12);
		const peak = spectrum(narrow, narrow.w0);
		expect(peak).toBeGreaterThan(39);
		expect(peak).toBeLessThan(41);
		for (const w of [0.01, 0.2, 0.4, 1, Math.PI]) expect(spectrum(narrow, w)).toBeLessThan(peak);
		// S(0) = Σ C(t) = 0.51, close to the continuous 2τ_c/(1 + ω₀²τ_c²) = 0.50
		expect(zeroFrequency(narrow)).toBeCloseTo(0.5076, 4);
		expect((2 * 40) / (1 + (narrow.w0 * 40) ** 2)).toBeCloseTo(0.503, 3);
	});

	it('makes C and S a Fourier pair for every kind (Wiener–Khinchin)', () => {
		for (const k of KINDS) {
			const m = MODELS[k];
			// S(ω) = Σ_t C(t) e^{iωt}: C is even, so the sum is C(0) + 2 Σ C(t) cos ωt
			for (const w of [0, 0.004, 0.05, m.w0, 0.9, 3]) {
				let s = correlation(m, 0);
				for (let t = 1; t < 40 * Math.max(1, m.tc); t++)
					s += 2 * correlation(m, t) * Math.cos(w * t);
				expect(Math.abs(s / spectrum(m, w) - 1)).toBeLessThan(1e-6);
			}
			// C(t) = ∫ S(ω) e^{−iωt} dω/2π: the variance shared among the frequencies, and the other lags
			expect(overBand((w) => spectrum(m, w))).toBeCloseTo(variance(m), 6);
			for (const t of [1, 5, 13, 30, 120])
				expect(overBand((w) => spectrum(m, w) * Math.cos(w * t))).toBeCloseTo(correlation(m, t), 6);
			// two-sided: S(−ω) = S(ω)
			expect(spectrum(m, -0.7)).toBeCloseTo(spectrum(m, 0.7), 12);
		}
	});
});

describe('the averages, exactly', () => {
	it('gives white noise Var = S/τ at every τ', () => {
		for (const tau of LADDER) expect(varianceOfAverage(white, tau)).toBeCloseTo(1 / tau, 14);
		expect(varianceOfAverage(white, 100)).toBeCloseTo(0.01, 14);
	});

	it('agrees with the chapter’s exact result for sluggish noise, and is one reading’s variance at τ = 1', () => {
		for (const k of KINDS) expect(varianceOfAverage(MODELS[k], 1)).toBeCloseTo(1, 14);
		// footnote: (2σ²τ_c/τ)[1 − (τ_c/τ)(1 − e^{−τ/τ_c})], plus the floor's 0.2/τ
		for (const tau of [100, 1000, 5000]) {
			const x = 500 / tau;
			const footnote = 2 * 0.8 * x * (1 - x * (1 - Math.exp(-1 / x))) + 0.2 / tau;
			expect(Math.abs(varianceOfAverage(red, tau) / footnote - 1)).toBeLessThan(2e-3);
		}
	});

	it('tends to S(0)/τ once τ ≫ τ_c, and not before', () => {
		expect(Math.abs(varianceOfAverage(narrow, 4000) / law(narrow, 4000) - 1)).toBeLessThan(0.02);
		expect(varianceOfAverage(red, 200_000) / law(red, 200_000)).toBeCloseTo(1, 2);
		// within the slider's reach, red noise is far from the law: τ ≤ 100 ≪ τ_c = 500
		expect(varianceOfAverage(red, 100) / law(red, 100)).toBeLessThan(0.1);
	});

	it('barely shrinks red noise when the average is ten times longer, and shrinks white by √10', () => {
		const sd = (m: typeof red, tau: number) => Math.sqrt(varianceOfAverage(m, tau));
		expect(sd(white, 10) / sd(white, 100)).toBeCloseTo(Math.sqrt(10), 12);
		expect(sd(red, 10)).toBeCloseTo(0.903, 3);
		expect(sd(red, 100)).toBeCloseTo(0.867, 3);
		expect(sd(red, 10) / sd(red, 100)).toBeLessThan(1.05);
		expect(sd(narrow, 100)).toBeCloseTo(0.083, 3);
		expect(Math.sqrt(law(narrow, 100))).toBeCloseTo(0.071, 3);
	});
});

describe('the draw', () => {
	it('is the same for the same seed and different for another', () => {
		for (const k of KINDS) {
			const a = draw(MODELS[k], 7, 3);
			const b = draw(MODELS[k], 7, 3);
			const c = draw(MODELS[k], 8, 3);
			expect(a).toEqual(b);
			expect(a[1][100]).not.toBe(c[1][100]);
			expect(a.length).toBe(3);
			expect(a[0].length).toBe(SAMPLES);
		}
		const g = generator(3);
		const h = generator(3);
		for (let k = 0; k < 10; k++) expect(g()).toBe(h());
		expect(RECORDS).toBe(50);
	});

	it('draws records of variance one from their first sample on', () => {
		for (const k of KINDS) {
			const records = draw(MODELS[k], 31, 4000, 4);
			for (const i of [0, 3]) {
				let s2 = 0;
				for (const r of records) s2 += r[i] ** 2;
				// 4000 values: a relative scatter of √(2/4000) = 2.2%; allow four of it
				expect(Math.abs(s2 / 4000 - 1)).toBeLessThan(0.09);
			}
		}
	});

	it('averages successive blocks of τ samples, whole blocks only', () => {
		const values = new Float64Array([1, 2, 3, 4, 5, 6, 7]);
		expect([...blockAverages(values, 1)]).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect([...blockAverages(values, 2)]).toEqual([1.5, 3.5, 5.5]);
		expect([...blockAverages(values, 3)]).toEqual([2, 5]);
	});
});

describe('Wiener–Khinchin, checked on a seeded record', () => {
	it('transforms as the direct sum does', () => {
		const re = new Float64Array([1, 2, 0, -1, 3, 0.5, 0, 2]);
		const im = new Float64Array(8);
		const want = [...re].map((_, j) => {
			let a = 0;
			let b = 0;
			re.forEach((x, t) => {
				a += x * Math.cos((2 * Math.PI * j * t) / 8);
				b += x * Math.sin((2 * Math.PI * j * t) / 8);
			});
			return [a, b];
		});
		fft(re, im, 1);
		want.forEach(([a, b], j) => {
			expect(re[j]).toBeCloseTo(a, 12);
			expect(im[j]).toBeCloseTo(b, 12);
		});
	});

	it('measures the autocorrelation through the transform exactly as by shifted products', () => {
		for (const k of KINDS) {
			const records = draw(MODELS[k], 5, 3);
			const fast = measuredCorrelation(records, 60);
			const slow = directCorrelation(records, 60);
			for (let t = 0; t <= 60; t++) expect(fast[t]).toBeCloseTo(slow[t], 10);
		}
	});

	it('finds the record’s own spectrum to be the transform of its own autocorrelation', () => {
		// on one record, read as repeating, |ñ(ω)|²/T is exactly Σ_t C_record(t) e^{iωt}
		const n = draw(red, 9, 1, 256)[0];
		const p = periodogram([n], false);
		const c = new Float64Array(256);
		for (let t = 0; t < 256; t++)
			for (let i = 0; i < 256; i++) c[t] += (n[(i + t) % 256] * n[i]) / 256;
		for (const j of [0, 1, 7, 64, 128]) {
			let s = 0;
			for (let t = 0; t < 256; t++) s += c[t] * Math.cos(frequencyOf(j, 256) * t);
			expect(p[j]).toBeCloseTo(s, 9);
		}
	});

	it('measures C(t) and S(ω) close to the exact curves', () => {
		for (const k of KINDS) {
			const m = MODELS[k];
			const records = draw(m, 1);
			const c = measuredCorrelation(records);
			expect(c.length).toBe(LAGS + 1);
			for (const t of [0, 1, 5, 10, 20, 50])
				expect(Math.abs(c[t] - correlation(m, t))).toBeLessThan(0.05);
			const bins = logBins(periodogram(records));
			expect(bins[0].w).toBeGreaterThanOrEqual(frequencyOf(LOWEST) * 0.999);
			expect(bins.at(-1)!.w).toBeLessThanOrEqual(Math.PI);
			for (const b of bins) {
				// the mean of 50 count periodograms has a relative scatter of 1/√(50 count); allow five of it, and
				// a tenth for the taper's blur of the steep and peaked spectra
				const tolerance = 5 / Math.sqrt(RECORDS * b.count) + 0.1;
				expect(Math.abs(Math.log(b.s / spectrum(m, b.w)))).toBeLessThan(tolerance);
			}
		}
	});

	it('shares the measured variance among the frequencies as the spectrum says', () => {
		const records = draw(narrow, 2);
		const p = periodogram(records);
		// ∫ S dω/2π over −π … π is the sum over the record's frequencies divided by N, both signs counted
		let s = p[0] + p[SAMPLES / 2];
		for (let j = 1; j < SAMPLES / 2; j++) s += 2 * p[j];
		expect(s / SAMPLES).toBeCloseTo(measuredCorrelation(records, 0)[0], 1);
	});
});

describe('Var = S(0)/τ, statistically', () => {
	it('gives white noise of S = 1 averaged over 100 samples the variance 0.010 ± 0.001 over 10⁴ trials', () => {
		const trials = draw(white, 42, 10_000, 100);
		let s2 = 0;
		for (const r of trials) s2 += blockAverages(r, 100)[0] ** 2;
		expect(Math.abs(s2 / 10_000 - 0.01)).toBeLessThan(0.001);
	});

	it('gives narrow-band noise averaged over ten correlation times the variance S(0)/τ, to its scatter', () => {
		const tau = 400;
		const trials = draw(narrow, 43, 4000, tau);
		let s2 = 0;
		for (const r of trials) s2 += blockAverages(r, tau)[0] ** 2;
		const measured = s2 / 4000;
		expect(Math.abs(measured / varianceOfAverage(narrow, tau) - 1)).toBeLessThan(
			4 * Math.sqrt(2 / 4000)
		);
		expect(Math.abs(measured / law(narrow, tau) - 1)).toBeLessThan(0.15);
	});

	it('measures on the figure’s 50 records what the exact variance says, for every kind', () => {
		for (const k of KINDS) {
			const m = MODELS[k];
			const records = draw(m, 1);
			for (const tau of [1, 10, 100]) {
				const exact = Math.sqrt(varianceOfAverage(m, tau));
				// red noise holds only about 200 independent stretches of τ_c in the 50 records
				const tolerance =
					k === 'red' ? 0.12 : 4 / Math.sqrt((2 * RECORDS * SAMPLES) / Math.max(tau, m.tc));
				expect(Math.abs(measuredSpread(records, tau) / exact - 1)).toBeLessThan(tolerance);
			}
		}
	});
});

describe('the slider’s ladder', () => {
	it('runs from one sample to a hundred, rising, through 10', () => {
		expect(LADDER[0]).toBe(1);
		expect(LADDER.at(-1)).toBe(100);
		for (let i = 1; i < LADDER.length; i++) expect(LADDER[i]).toBeGreaterThan(LADDER[i - 1]);
		expect(LADDER).toContain(10);
		expect(LADDER.every(Number.isInteger)).toBe(true);
	});

	it('finds the nearest rung in the logarithm', () => {
		expect(LADDER[nearestRung(1)]).toBe(1);
		expect(LADDER[nearestRung(9.3)]).toBe(10);
		expect(LADDER[nearestRung(170)]).toBe(100);
		expect(LADDER[nearestRung(0.2)]).toBe(1);
	});
});
