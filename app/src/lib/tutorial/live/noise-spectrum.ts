/**
 * The numbers of chapter 3.2's noise and its spectrum, for its live figure. A record is a reading every sample, and
 * time is counted in samples, so that the chapter's integrals over time become sums over samples: the
 * autocorrelation C(t) = ⟨n(t) n(0)⟩ at whole lags t, the two-sided spectrum S(ω) = Σ_t C(t) e^{iωt} for ω between
 * −π and π radians per sample, and back, C(t) = ∫ S(ω) e^{−iωt} dω/2π over that range (Wiener–Khinchin). The noise
 * is in units of its own standard deviation, σ_n = 1, so C(0) = 1 for every kind.
 *
 * Three kinds, each a white part plus a part that remembers itself over a correlation time τ_c:
 * - white: C(t) = δ(t), the same S = 1 at every frequency;
 * - red: a slow wander, C(t) = 0.8 e^{−|t|/τ_c} + 0.2 δ(t) with τ_c = 500 samples, the chapter's sluggish noise
 *   (eq:exp-corr) with a white floor; over times shorter than τ_c the wander is a random walk, and its spectrum rises
 *   as 1/ω² toward zero frequency, to S(0) = 2(0.8)τ_c + 0.2 = 800.2;
 * - narrow-band: a noisy oscillation, C(t) = e^{−|t|/τ_c} cos ω₀t with τ_c = 40 samples and a period of 20, whose
 *   spectrum is a peak at ±ω₀.
 * The correlated part is drawn as the real part of a phasor (chapter 1.5b) that turns by ω₀ and shrinks by e^{−1/τ_c}
 * each sample, kicked each sample by a random complex number; for red noise ω₀ = 0.
 *
 * The figure averages the noise over τ samples; the variance of the average is the double sum of C, and for τ ≫ τ_c
 * it is S(0)/τ, the chapter's eq:var-time.
 */

import { generator } from './averaging-noise';

export { generator };

export type Kind = 'white' | 'red' | 'narrow';
export const KINDS: readonly Kind[] = ['white', 'red', 'narrow'];

export interface Model {
	/** The spectrum of the white part, S_white, in σ_n² per sample: its C is S_white δ(t). */
	white: number;
	/** The variance of the part that remembers itself. */
	part: number;
	/** Its correlation time τ_c, in samples (0 for none). */
	tc: number;
	/** The angular frequency ω₀ of its oscillation, in radians per sample (0 for a wander). */
	w0: number;
}

export const RED_TC = 500;
export const NARROW_TC = 40;
/** The period of the narrow-band oscillation, in samples. */
export const NARROW_PERIOD = 20;

export const MODELS: Record<Kind, Model> = {
	white: { white: 1, part: 0, tc: 0, w0: 0 },
	red: { white: 0.2, part: 0.8, tc: RED_TC, w0: 0 },
	narrow: { white: 0, part: 1, tc: NARROW_TC, w0: (2 * Math.PI) / NARROW_PERIOD }
};

/** The samples in one record: about 2000, a power of two for the transform. */
export const SAMPLES = 2048;
/** The records drawn at once; the autocorrelation and the spectrum are means over all of them. */
export const RECORDS = 50;
/** The longest lag at which the autocorrelation is drawn, in samples. */
export const LAGS = 200;

/** The averaging times the slider stops at, in samples, about even in their logarithm. */
export const LADDER: readonly number[] = [
	1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100
];

/** The rung of the ladder nearest to `tau`, in its logarithm. */
export function nearestRung(tau: number): number {
	const l = Math.log(Math.max(LADDER[0], Math.min(LADDER.at(-1)!, tau)));
	let best = 0;
	for (let i = 1; i < LADDER.length; i++)
		if (Math.abs(Math.log(LADDER[i]) - l) < Math.abs(Math.log(LADDER[best]) - l)) best = i;
	return best;
}

// --- the exact curves ------------------------------------------------------------------------------------------------

/** The decay of the correlated part in one sample, e^{−1/τ_c}. */
const shrink = (m: Model) => (m.tc > 0 ? Math.exp(-1 / m.tc) : 0);

/** The exact autocorrelation at the whole lag `t`, in σ_n². */
export function correlation(m: Model, t: number): number {
	const k = Math.abs(Math.round(t));
	const white = k === 0 ? m.white : 0;
	if (m.part === 0) return white;
	return white + m.part * Math.exp(-k / m.tc) * Math.cos(m.w0 * k);
}

/** The spectrum of the sampled e^{−|t|/τ_c}, at the angle θ: (1 − r²)/(1 − 2r cos θ + r²). */
function lorentz(r: number, theta: number): number {
	return (1 - r * r) / (1 - 2 * r * Math.cos(theta) + r * r);
}

/** The exact two-sided spectrum at `w`, in radians per sample: the sum Σ_t C(t) e^{iωt} over all lags. */
export function spectrum(m: Model, w: number): number {
	if (m.part === 0) return m.white;
	const r = shrink(m);
	return m.white + (m.part / 2) * (lorentz(r, w - m.w0) + lorentz(r, w + m.w0));
}

/** The spectrum at zero frequency, S(0) = Σ_t C(t). */
export const zeroFrequency = (m: Model) => spectrum(m, 0);

/** The variance of one reading, C(0) = σ_n². */
export const variance = (m: Model) => correlation(m, 0);

/**
 * The exact variance of the average over `tau` successive samples: the chapter's double integral of C, as a double
 * sum, (1/τ²) Σ_{|t|<τ} (τ − |t|) C(t).
 */
export function varianceOfAverage(m: Model, tau: number): number {
	let s = tau * correlation(m, 0);
	for (let t = 1; t < tau; t++) s += 2 * (tau - t) * correlation(m, t);
	return s / (tau * tau);
}

/** The law of white noise, applied with the spectrum at zero frequency: Var = S(0)/τ. */
export const law = (m: Model, tau: number) => zeroFrequency(m) / tau;

/** The chapter's S(0) = 2σ²τ_c for the sluggish noise C(t) = σ² e^{−|t|/τ_c}, in continuous time. */
export const sluggishZero = (sigma2: number, tc: number) => 2 * sigma2 * tc;

// --- the draw --------------------------------------------------------------------------------------------------------

/** Two independent standard normal numbers, by Box and Muller, from two uniforms. */
function normals(random: () => number): [number, number] {
	const u = 1 - random();
	const radius = Math.sqrt(-2 * Math.log(u));
	const angle = 2 * Math.PI * random();
	return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

/**
 * `count` records of `length` samples of the noise `m`, drawn from `seed`: the same seed gives the same records.
 * The correlated part is the real part of a phasor z that turns by ω₀ and shrinks by r = e^{−1/τ_c} each sample,
 * z ← r e^{iω₀} z + kick, started from its own steady spread so that the record is stationary from its first sample.
 */
export function draw(m: Model, seed: number, count = RECORDS, length = SAMPLES): Float64Array[] {
	const random = generator(seed);
	const r = shrink(m);
	const cos = Math.cos(m.w0);
	const sin = Math.sin(m.w0);
	const whiteSd = Math.sqrt(m.white);
	// the phasor's real and imaginary parts each have the variance `part`; a kick keeps that steady
	const steadySd = Math.sqrt(m.part);
	const kickSd = Math.sqrt(m.part * (1 - r * r));
	const records: Float64Array[] = [];
	for (let c = 0; c < count; c++) {
		const n = new Float64Array(length);
		let [x, y] = normals(random);
		x *= steadySd;
		y *= steadySd;
		for (let i = 0; i < length; i++) {
			if (i > 0 && m.part > 0) {
				const [a, b] = normals(random);
				const xr = r * (cos * x - sin * y) + kickSd * a;
				const yr = r * (sin * x + cos * y) + kickSd * b;
				x = xr;
				y = yr;
			}
			n[i] = (m.part > 0 ? x : 0) + (whiteSd > 0 ? whiteSd * normals(random)[0] : 0);
		}
		records.push(n);
	}
	return records;
}

// --- the transform -------------------------------------------------------------------------------------------------

/** The discrete Fourier transform in place, of a length that is a power of two: Σ_t x_t e^{sign·2πi jt/N}. */
export function fft(re: Float64Array, im: Float64Array, sign = 1): void {
	const n = re.length;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			[re[i], re[j]] = [re[j], re[i]];
			[im[i], im[j]] = [im[j], im[i]];
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const half = len >> 1;
		const step = (sign * 2 * Math.PI) / len;
		for (let k = 0; k < half; k++) {
			const wr = Math.cos(step * k);
			const wi = Math.sin(step * k);
			for (let i = k; i < n; i += len) {
				const b = i + half;
				const tr = re[b] * wr - im[b] * wi;
				const ti = re[b] * wi + im[b] * wr;
				re[b] = re[i] - tr;
				im[b] = im[i] - ti;
				re[i] += tr;
				im[i] += ti;
			}
		}
	}
}

/**
 * The autocorrelation of records measured as the chapter says: each record multiplied by a copy of itself shifted by
 * t, the product averaged along the record and then over the records, for t = 0 … `lags`. The products are summed
 * through the transform of the record padded with zeros (the Wiener–Khinchin relation for a finite record), which
 * gives the same numbers as the direct sum, faster.
 */
export function measuredCorrelation(records: Float64Array[], lags = LAGS): Float64Array {
	const length = records[0].length;
	let size = 1;
	while (size < 2 * length) size <<= 1;
	const out = new Float64Array(lags + 1);
	const re = new Float64Array(size);
	const im = new Float64Array(size);
	for (const n of records) {
		re.fill(0);
		im.fill(0);
		re.set(n);
		fft(re, im, 1);
		for (let j = 0; j < size; j++) {
			re[j] = re[j] * re[j] + im[j] * im[j];
			im[j] = 0;
		}
		fft(re, im, -1);
		for (let t = 0; t <= lags; t++) out[t] += re[t] / size / (length - t);
	}
	for (let t = 0; t <= lags; t++) out[t] /= records.length;
	return out;
}

/** The same, by the direct sum of products: slower, and kept to check the fast one. */
export function directCorrelation(records: Float64Array[], lags = LAGS): Float64Array {
	const out = new Float64Array(lags + 1);
	for (const n of records)
		for (let t = 0; t <= lags; t++) {
			let s = 0;
			for (let i = 0; i + t < n.length; i++) s += n[i + t] * n[i];
			out[t] += s / (n.length - t);
		}
	for (let t = 0; t <= lags; t++) out[t] /= records.length;
	return out;
}

/** The weights that fade a record in and out at its ends (a Hann taper), 0 at the ends and 1 in the middle. */
export function taper(length: number): Float64Array {
	const w = new Float64Array(length);
	for (let i = 0; i < length; i++) w[i] = Math.sin((Math.PI * i) / length) ** 2;
	return w;
}

/**
 * The spectrum of records measured as the chapter says, ⟨|ñ(ω)|²⟩ = T S(ω): the mean over the records of |ñ(ω)|²
 * divided by the record's length, at the frequencies 2πj/N, j = 0 … N/2. Each record is first faded in and out at
 * its ends (`tapered`), so that the slow wander of red noise does not spill into the other frequencies; the length
 * is then the sum of the squared weights.
 */
export function periodogram(records: Float64Array[], tapered = true): Float64Array {
	const length = records[0].length;
	const w = tapered ? taper(length) : new Float64Array(length).fill(1);
	let weight = 0;
	for (const v of w) weight += v * v;
	const out = new Float64Array(length / 2 + 1);
	const re = new Float64Array(length);
	const im = new Float64Array(length);
	for (const n of records) {
		for (let i = 0; i < length; i++) re[i] = n[i] * w[i];
		im.fill(0);
		fft(re, im, 1);
		for (let j = 0; j <= length / 2; j++) out[j] += (re[j] * re[j] + im[j] * im[j]) / weight;
	}
	for (let j = 0; j <= length / 2; j++) out[j] /= records.length;
	return out;
}

/** The angular frequency of the j-th entry of a periodogram of records of `length` samples. */
export const frequencyOf = (j: number, length = SAMPLES) => (2 * Math.PI * j) / length;

export interface Bin {
	/** The geometric mean of the frequencies in the bin, in radians per sample. */
	w: number;
	/** The mean of the periodogram over them. */
	s: number;
	/** How many frequencies it holds. */
	count: number;
}

/**
 * The lowest frequency of a tapered periodogram that is kept, in units of 2π/N: the taper blurs the spectrum over
 * about two of the record's frequencies, so below the fourth the steep rise of red noise would be smeared.
 */
export const LOWEST = 4;

/**
 * A periodogram gathered into `bins` bins even in the logarithm of the frequency, from 2π·LOWEST/N to π: each bin is
 * the mean over the frequencies in it, so the high frequencies, of which there are many, are measured more finely.
 * Empty bins are left out.
 */
export function logBins(p: Float64Array, bins = 80, length = SAMPLES, from = LOWEST): Bin[] {
	const low = Math.log(frequencyOf(from, length));
	const high = Math.log(Math.PI);
	const sums = new Float64Array(bins);
	const logs = new Float64Array(bins);
	const counts = new Uint32Array(bins);
	for (let j = from; j < p.length; j++) {
		const lw = Math.log(frequencyOf(j, length));
		const b = Math.min(bins - 1, Math.floor(((lw - low) / (high - low)) * bins));
		sums[b] += p[j];
		logs[b] += lw;
		counts[b]++;
	}
	const out: Bin[] = [];
	for (let b = 0; b < bins; b++)
		if (counts[b] > 0)
			out.push({ w: Math.exp(logs[b] / counts[b]), s: sums[b] / counts[b], count: counts[b] });
	return out;
}

// --- the averages ----------------------------------------------------------------------------------------------------

/** The averages of successive blocks of `tau` samples: the first τ, the next τ, and so on, whole blocks only. */
export function blockAverages(values: Float64Array, tau: number): Float64Array {
	const out = new Float64Array(Math.floor(values.length / tau));
	for (let j = 0; j < out.length; j++) {
		let s = 0;
		for (let k = j * tau; k < (j + 1) * tau; k++) s += values[k];
		out[j] = s / tau;
	}
	return out;
}

/**
 * The standard deviation of the averages over `tau` samples, measured: the root mean square of every block average
 * of every record, about the known mean of zero.
 */
export function measuredSpread(records: Float64Array[], tau: number): number {
	let s = 0;
	let count = 0;
	for (const n of records)
		for (const v of blockAverages(n, tau)) {
			s += v * v;
			count++;
		}
	return Math.sqrt(s / count);
}
