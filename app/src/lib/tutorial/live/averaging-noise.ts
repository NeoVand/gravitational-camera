/**
 * The numbers of chapter 3.1's square-root law, for its live figure. A reading of a gradiometer is a signal plus a
 * noise, x = s + n. The signal is the person's tide one metre away, s = 9.34 E (chapter 1.4), while the person stands
 * there and zero while away; the noise has mean zero and the standard deviation σ_n. The average of N independent
 * readings keeps the whole signal, and its noise is σ_x̄ = σ_n/√N.
 *
 * The best laboratory gradiometer has σ_n = 0.02 E in one second, a signal-to-noise ratio of 467 on the person (the
 * paper's "five hundred"). The figure takes an instrument 1500 times noisier, σ_n = 30 E, so that the step is hidden
 * in a single reading and comes through once σ_n/√N has fallen to the size of the step, at N = (30/9.34)² = 10.3.
 *
 * Besides those numbers this draws, from a seeded generator, one record of one-second readings while the person
 * steps in and out, and the averages of its successive blocks of N readings.
 */

import { generator } from './graviton-count';

export { generator };

/** The person's tide one metre away, in eötvös (1 E = 10⁻⁹ s⁻²), chapter 1.4. */
export const TIDE = 9.34;
/** The best laboratory gradiometer's noise in one second, in eötvös (paper, §II). */
export const BEST_NOISE = 0.02;
/** The signal-to-noise ratio of that gradiometer on the person in one second: 467. */
export const BEST_RATIO = TIDE / BEST_NOISE;
/** The noise of one reading of the figure's gradiometer, in eötvös. */
export const NOISE = 30;

/** The number of readings averaged: from one to a thousand. */
export const LEAST = 1;
export const MOST = 1000;
/**
 * The numbers of readings the slider stops at, about even in their logarithm: 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25,
 * 30, 40, 50, 60, 75, 100, …, 1000. Each divides a stay of the person, so no average straddles a step.
 */
export const LADDER: readonly number[] = [
	1,
	2,
	3,
	4,
	5,
	6,
	8,
	10,
	12,
	15,
	20,
	25,
	30,
	40,
	50,
	60,
	75,
	100,
	120,
	150,
	200,
	250,
	300,
	375,
	500,
	600,
	750,
	MOST
];

/** The rung of the ladder nearest to `n`, in its logarithm. */
export function nearestRung(n: number): number {
	const l = Math.log(Math.max(LEAST, Math.min(MOST, n)));
	let best = 0;
	for (let i = 1; i < LADDER.length; i++)
		if (Math.abs(Math.log(LADDER[i]) - l) < Math.abs(Math.log(LADDER[best]) - l)) best = i;
	return best;
}

// --- the square-root law -------------------------------------------------------------------------------------------

/** The noise of the average of `n` independent readings of noise `sigma`: σ_x̄ = σ_n/√N. */
export const noiseOfAverage = (n: number, sigma = NOISE) => sigma / Math.sqrt(n);

/** The signal-to-noise ratio of the average of `n` readings: s√N/σ_n. */
export const ratio = (n: number, sigma = NOISE, signal = TIDE) => signal / noiseOfAverage(n, sigma);

/** How many more readings make the noise of the average smaller by `factor`: the factor squared. */
export const readingsFor = (factor: number) => factor ** 2;

/** The number of readings at which the noise of the average falls to the size of the signal: (σ_n/s)². */
export const stepAppears = (sigma = NOISE, signal = TIDE) => (sigma / signal) ** 2;

/** The time, in seconds, the best gradiometer needs for a signal-to-noise ratio `r`: (r/467)² s. */
export const timeForRatio = (r: number) => (r / BEST_RATIO) ** 2;

// --- the record ----------------------------------------------------------------------------------------------------

/** The person stays this many seconds at a time, longer than the longest average. */
export const STAY = 3000;
/** Away, one metre away, away. */
export const STAYS = 3;
/** The readings, one a second. */
export const RECORD = STAY * STAYS;

/** The person's tide at the reading taken in second `i` of the record. */
export function tideAt(i: number): number {
	return Math.floor(i / STAY) === 1 ? TIDE : 0;
}

/** A standard normal number, by Box and Muller, from two uniforms. */
function normal(random: () => number): number {
	const u = 1 - random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

export interface Draw {
	/** The noise of each reading, n. */
	noise: Float64Array;
	/** The person's tide in each second, s. */
	signal: Float64Array;
}

/** One record of readings, drawn from `seed`: the same seed gives the same record. */
export function draw(seed: number, sigma = NOISE): Draw {
	const random = generator(seed);
	const noise = new Float64Array(RECORD);
	const signal = new Float64Array(RECORD);
	for (let i = 0; i < RECORD; i++) {
		noise[i] = sigma * normal(random);
		signal[i] = tideAt(i);
	}
	return { noise, signal };
}

/** The averages of successive blocks of `n` values: the first n, the next n, and so on, whole blocks only. */
export function blockAverages(values: Float64Array, n: number): Float64Array {
	const out = new Float64Array(Math.floor(values.length / n));
	for (let j = 0; j < out.length; j++) {
		let s = 0;
		for (let k = j * n; k < (j + 1) * n; k++) s += values[k];
		out[j] = s / n;
	}
	return out;
}

/** The readings x = s + n of a draw, averaged `n` at a time: the averages, the tide in each block, and the noise. */
export function averaged(d: Draw, n: number) {
	const noise = blockAverages(d.noise, n);
	const tide = blockAverages(d.signal, n);
	const reading = new Float64Array(noise.length);
	for (let j = 0; j < noise.length; j++) reading[j] = tide[j] + noise[j];
	return { reading, tide, noise };
}

/** The readings of a draw one at a time. */
export function readings(d: Draw): Float64Array {
	return d.signal.map((s, i) => s + d.noise[i]);
}

/**
 * The noise of this draw's average of `n` readings, measured: the root mean square of the averaged noise over the
 * RECORD/n blocks. It strays from σ_n/√N by about 1/√(2 RECORD/n) of itself.
 */
export function measuredNoise(d: Draw, n: number): number {
	const noise = blockAverages(d.noise, n);
	let s = 0;
	for (const v of noise) s += v * v;
	return Math.sqrt(s / noise.length);
}

/** The numbers of readings at which the figure measures the noise of the average of a draw. */
export const MEASURED = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000] as const;
