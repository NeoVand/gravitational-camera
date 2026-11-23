/**
 * The numbers of chapter 3.5's best guess of one number, for its live figure. One pattern of the scene, of amount x,
 * reaches its reading multiplied by the gain T, with noise added:
 *
 *     y = T x + n,
 *
 * with x and n independent, of mean zero, and of the standard deviations σ_x (the prior) and σ_n. The naive guess
 * divides the reading by the gain, y/T, and leaves the error n/T, of mean square σ_n²/T² = σ_x²/s². The best linear
 * guess keeps the share H of it, x̂ = H y/T, with
 *
 *     s = T σ_x/σ_n,    H = s²/(1 + s²),    ⟨(x̂ − x)²⟩ = σ_x²/(1 + s²),
 *
 * the chapter's eq:one-number. So H = 0.5, 0.9 and 0.1 at s = 1, 3 and 1/3, and the remaining error is 0.5 and
 * 0.0099 of the prior's variance at s = 1 and 10.
 *
 * Besides those numbers this draws, from a seeded stream, 500 pairs of independent standard Gaussian numbers (z_x,
 * z_n), and turns them into pairs x = σ_x z_x, y = T x + σ_n z_n at the gains and spreads the sliders choose. The
 * same standard numbers serve every setting, so that the cloud changes smoothly as a slider moves.
 */

import { normals } from '../../array/random';

// --- the formulas ----------------------------------------------------------------------------------------------------

/** s = T σ_x/σ_n: the noise standard deviations by which a scene of the expected size moves the reading. */
export const ratio = (gain: number, prior: number, noise: number) => (gain * prior) / noise;

/** The Wiener weight H = s²/(1 + s²), the share of the naive guess y/T that the best guess keeps. */
export const weight = (s: number) => (s * s) / (1 + s * s);

/** The best linear weight w on the reading itself, x̂ = w y: w = T σ_x²/(T² σ_x² + σ_n²), so that H = w T. */
export const bestWeight = (gain: number, prior: number, noise: number) =>
	(gain * prior ** 2) / (gain ** 2 * prior ** 2 + noise ** 2);

/** The mean squared error of the linear guess x̂ = w y: (wT − 1)² σ_x² + w² σ_n². */
export const meanSquaredError = (w: number, gain: number, prior: number, noise: number) =>
	(w * gain - 1) ** 2 * prior ** 2 + w ** 2 * noise ** 2;

/** The best guess's remaining error, as a fraction of the prior's variance: 1/(1 + s²). */
export const wienerError = (s: number) => 1 / (1 + s * s);

/** The naive guess's error, as a fraction of the prior's variance: 1/s². */
export const naiveError = (s: number) => 1 / (s * s);

/** Whether the scene's part of the reading equals the noise, s = 1, to the three figures the figure shows. */
export const balanced = (s: number) => Math.abs(s - 1) < 0.005;

// --- the sliders: the gain and the two spreads, each from 0.1 to 10 on a logarithmic track ---------------------------

export const LEAST = 0.1;
export const MOST = 10;

/** Every value a slider stops at, rising: the 181 numbers of two significant figures from 0.10 to 10. */
export const RUNGS: readonly number[] = (() => {
	const out: number[] = [];
	for (let k = 10; k < 100; k++) out.push(k / 100);
	for (let k = 10; k < 100; k++) out.push(k / 10);
	out.push(10);
	return out;
})();

/** A value to two significant figures, within the sliders' range: 0.10, 0.11, …, 0.99, 1.0, 1.1, …, 9.9, 10. */
export function snap(v: number): number {
	const held = Math.max(LEAST, Math.min(MOST, v));
	return Math.max(LEAST, Math.min(MOST, Number(held.toPrecision(2))));
}

/** The value `steps` rungs above `v` (below, if negative), held within the range. */
export function stepRung(v: number, steps: number): number {
	const i = RUNGS.indexOf(snap(v));
	return RUNGS[Math.max(0, Math.min(RUNGS.length - 1, i + steps))];
}

// --- the simulated pairs ---------------------------------------------------------------------------------------------

/** The pairs drawn at once. */
export const PAIRS = 500;

/** One draw: `count` independent standard Gaussian numbers for the scene, and as many for the noise. */
export interface Draw {
	zx: Float64Array;
	zn: Float64Array;
}

/** A seeded draw: the same seed gives the same pairs. */
export function draw(seed: number, count = PAIRS): Draw {
	const z = normals(seed, 2 * count);
	return { zx: z.subarray(0, count), zn: z.subarray(count) };
}

/** The pairs (x, y) of a draw at the gain T and the spreads σ_x and σ_n. */
export function pairs(from: Draw, gain: number, prior: number, noise: number) {
	const n = from.zx.length;
	const x = new Float64Array(n);
	const y = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		x[i] = prior * from.zx[i];
		y[i] = gain * x[i] + noise * from.zn[i];
	}
	return { x, y };
}

export interface Errors {
	/** The mean of x², the error of guessing zero, the prior's mean: σ_x² on average. */
	prior: number;
	/** The mean of (y/T − x)²: σ_x²/s² on average. */
	naive: number;
	/** The mean of (H y/T − x)²: σ_x²/(1 + s²) on average. */
	wiener: number;
}

/** The mean squared errors of the draw's pairs, in the unit of x squared. */
export function simulate(from: Draw, gain: number, prior: number, noise: number): Errors {
	const h = weight(ratio(gain, prior, noise));
	const { x, y } = pairs(from, gain, prior, noise);
	let p = 0;
	let a = 0;
	let b = 0;
	for (let i = 0; i < x.length; i++) {
		p += x[i] ** 2;
		a += (y[i] / gain - x[i]) ** 2;
		b += ((h * y[i]) / gain - x[i]) ** 2;
	}
	const n = x.length;
	return { prior: p / n, naive: a / n, wiener: b / n };
}

/** The predicted mean squared errors, in the unit of x squared. */
export function predict(gain: number, prior: number, noise: number): Errors {
	const s = ratio(gain, prior, noise);
	return {
		prior: prior ** 2,
		naive: prior ** 2 * naiveError(s),
		wiener: prior ** 2 * wienerError(s)
	};
}

/**
 * One pair of the draw to follow as the sliders move: a scene about half a standard deviation above zero and a noise
 * about one and a half, so that at the opening, s = 1, its truth (about 0.5), its Wiener guess (about 1) and its naive
 * guess (about 2) lie well apart along its reading; the first pair if no pair is so placed.
 */
export function example(from: Draw): number {
	for (let i = 0; i < from.zx.length; i++)
		if (from.zx[i] > 0.3 && from.zx[i] < 0.8 && from.zn[i] > 1.2 && from.zn[i] < 1.8) return i;
	return 0;
}

// --- the drawing ------------------------------------------------------------------------------------------------------

/** How far the axes reach on each side of zero, in standard deviations of x and of y. */
export const REACH = 3.6;

/** The standard deviation of the reading: √(T² σ_x² + σ_n²). */
export const readingSpread = (gain: number, prior: number, noise: number) =>
	Math.hypot(gain * prior, noise);

/**
 * The slopes of the two guesses' lines, y = T x̂ and y = T x̂/H, on axes each scaled to its own standard deviation:
 * s/√(1 + s²) and √(1 + s²)/s, one the other's inverse, so that they lie mirrored about the diagonal.
 */
export function slopes(s: number) {
	const rho = s / Math.sqrt(1 + s * s);
	return { naive: rho, wiener: 1 / rho };
}

/** The spacing of ticks on an axis reaching `half` to each side: 1, 2 or 5 times a power of ten, at most three a side. */
export function tickStep(half: number): number {
	const e = Math.floor(Math.log10(half / 3));
	for (const m of [1, 2, 5, 10]) {
		const step = m * 10 ** e;
		if (Math.floor(half / step + 1e-9) <= 3) return Number(step.toPrecision(1));
	}
	return 10 ** (e + 1);
}
