/**
 * The numbers of chapter 3.3's locked safe, read as a test between two scenes, for its live figure. Hypothesis A puts
 * the gold (a bar of 324 kg, 0.3 × 0.14 × 0.4 m) in the left safe and hypothesis B in the right, 3.5 m in front of an
 * array of 11 × 11 pixels 10 cm apart, each reading the five independent components of the tide: N = 605 readings.
 * The two predictions f_A and f_B come from the repository's own model of the scene (lib/array/inversion.ts, the port
 * of reference/gravcam/inversion.py), and their separation in units of the noise of one reading is
 *
 *     D = |f_A − f_B| / σ_n,    σ_n = 2 G m / (z² b SNR),
 *
 * 1.811 at SNR = 10, in proportion to SNR. The best rule picks the hypothesis whose predictions lie closer to the
 * readings, and is wrong with probability P_err = P(Z > D/2), 0.183 at SNR = 10.
 *
 * A trial puts the gold in a safe at random, adds Gaussian noise to the predicted readings and applies the rule. Only
 * one number decides it: the readings projected on the unit vector u along f_A − f_B, measured from the midpoint of
 * the two predictions, t = u·(y − ½(f_A + f_B)). In units of σ_n it is D/2 + Z when A is true and −D/2 + Z when B is,
 * with Z a standard Gaussian, and the rule picks A when t > 0. So a trial draws t/σ_n directly, which is exactly what
 * drawing all 605 noises and comparing the two distances gives (fullTrial, below, does that, and the tests check that
 * the two agree), and ten thousand trials take a few milliseconds.
 */

import {
	GOLD_MASS,
	LEFT,
	RIGHT,
	arrayPixels,
	decisionError,
	distance,
	noiseForSnr,
	readBox
} from '../../array/inversion';
import { uniform } from '../../array/random';

// --- the scene -------------------------------------------------------------------------------------------------------

/** The array: a square a metre across of 11 × 11 pixels, 10 cm apart. */
export const SIDE = 1;
export const PIXELS_ACROSS = 11;
export const SPACING = SIDE / (PIXELS_ACROSS - 1);
const PIXELS = arrayPixels(SIDE, PIXELS_ACROSS);
/** Five components at each of the 121 pixels. */
export const READINGS = 5 * PIXELS.length;

/** The predicted readings, in s⁻², with the gold in the left safe (hypothesis A) and in the right (B). */
export const PREDICTED_A = readBox(PIXELS, LEFT);
export const PREDICTED_B = readBox(PIXELS, RIGHT);

export { GOLD_MASS };

/** The noise of one reading at a signal-to-noise ratio `snr`, in s⁻²: σ_n = 2 G m / (z² b SNR). */
export const noise = (snr: number) => noiseForSnr(snr, SPACING);

/** The separation of the two predictions at SNR = 1, in units of the noise: 0.181. D is this times SNR. */
export const SEPARATION_PER_SNR = distance(PREDICTED_A, PREDICTED_B, noise(1));

/** D = |f_A − f_B| / σ_n at the signal-to-noise ratio `snr`. */
export const separation = (snr: number) => SEPARATION_PER_SNR * snr;

/** The probability that the best rule picks the wrong safe: P_err = P(Z > D/2). */
export const errorProbability = (d: number) => decisionError(d);

/** The largest difference of the two predictions in a single reading, in units of σ_n at `snr`: 0.19 at SNR = 10. */
export function largestDifference(snr: number): number {
	let most = 0;
	for (let a = 0; a < READINGS; a++)
		most = Math.max(most, Math.abs(PREDICTED_A[a] - PREDICTED_B[a]));
	return most / noise(snr);
}

/** Each safe alone against an empty room, in units of σ_n at `snr`: 1.77 at SNR = 10. */
export const aloneSeparation = (snr: number) =>
	distance(PREDICTED_A, new Float64Array(READINGS), noise(snr));

/** The separation D at which the error probability is `p`, by bisection: 6.18 for one in a thousand. */
export function separationForError(p: number): number {
	let low = 0;
	let high = 80;
	for (let k = 0; k < 200; k++) {
		const mid = (low + high) / 2;
		if (errorProbability(mid) > p) low = mid;
		else high = mid;
	}
	return (low + high) / 2;
}

/** The signal-to-noise ratio at which the error probability is `p`: 34.1 for one in a thousand. */
export const snrForError = (p: number) => separationForError(p) / SEPARATION_PER_SNR;

// --- the slider: signal-to-noise ratios from 1 to 100, on a logarithmic track ----------------------------------------

export const LEAST = 1;
export const MOST = 100;

/** A ratio to two significant figures, within the slider's range: 1.0, 1.1, …, 9.9, 10, 11, …, 99, 100. */
export function snap(snr: number): number {
	const s = Math.max(LEAST, Math.min(MOST, snr));
	return Math.max(LEAST, Math.min(MOST, Number(s.toPrecision(2))));
}

/** Every ratio the slider stops at, rising: the 181 numbers of two significant figures from 1 to 100. */
export const RUNGS: readonly number[] = (() => {
	const out: number[] = [];
	for (let k = 10; k < 100; k++) out.push(k / 10);
	for (let k = 10; k < 100; k++) out.push(k);
	out.push(100);
	return out;
})();

/** The ratio `steps` rungs above `snr` (below, if negative), held within the range. */
export function stepRung(snr: number, steps: number): number {
	const i = RUNGS.indexOf(snap(snr));
	return RUNGS[Math.max(0, Math.min(RUNGS.length - 1, i + steps))];
}

// --- the trials ------------------------------------------------------------------------------------------------------

export type Hypothesis = 'A' | 'B';

export interface Trial {
	/** Where the gold was put. */
	truth: Hypothesis;
	/** The statistic t = u·(y − ½(f_A + f_B)), in units of σ_n. */
	t: number;
	/** The safe the rule picks: A when t > 0. */
	pick: Hypothesis;
}

/** The source of a session's randomness: fair coins and standard Gaussian numbers from one seeded stream. */
export interface Source {
	coin(): Hypothesis;
	gaussian(): number;
}

/** A seeded source: the same seed gives the same trials. Gaussians by Box and Muller, both of each pair used. */
export function source(seed: number): Source {
	const next = uniform(seed);
	let spare: number | undefined;
	return {
		coin: () => (next() < 0.5 ? 'A' : 'B'),
		gaussian() {
			if (spare !== undefined) {
				const z = spare;
				spare = undefined;
				return z;
			}
			// 1 − u is in (0, 1], so the logarithm is finite
			const r = Math.sqrt(-2 * Math.log(1 - next()));
			const angle = 2 * Math.PI * next();
			spare = r * Math.sin(angle);
			return r * Math.cos(angle);
		}
	};
}

/** The rule: the safe whose predictions lie closer to the readings, decided by the sign of t. */
export const pickOf = (t: number): Hypothesis => (t > 0 ? 'A' : 'B');

/** One trial by the sufficient statistic: t/σ_n = ±D/2 + Z. */
export function trial(d: number, from: Source): Trial {
	const truth = from.coin();
	const t = (truth === 'A' ? d / 2 : -d / 2) + from.gaussian();
	return { truth, t, pick: pickOf(t) };
}

/**
 * One trial done in full, for the tests: all 605 readings y = f + σ_n n, the two squared distances |y − f_A|² and
 * |y − f_B|², and the statistic t/σ_n computed from the readings themselves.
 */
export function fullTrial(snr: number, from: Source, truth: Hypothesis = from.coin()) {
	const sigma = noise(snr);
	const f = truth === 'A' ? PREDICTED_A : PREDICTED_B;
	let toA = 0;
	let toB = 0;
	let along = 0;
	let length = 0;
	for (let a = 0; a < READINGS; a++) {
		const y = f[a] + sigma * from.gaussian();
		toA += (y - PREDICTED_A[a]) ** 2;
		toB += (y - PREDICTED_B[a]) ** 2;
		const difference = PREDICTED_A[a] - PREDICTED_B[a];
		along += difference * (y - (PREDICTED_A[a] + PREDICTED_B[a]) / 2);
		length += difference ** 2;
	}
	const t = along / Math.sqrt(length) / sigma;
	const pick: Hypothesis = toA < toB ? 'A' : 'B';
	return { truth, t, pick, toA: toA / sigma ** 2, toB: toB / sigma ** 2 };
}

// --- the tally, and the histogram of t under each hypothesis ----------------------------------------------------------

/** The width of a bin of the histogram, in units of σ_n. */
export const BIN = 0.25;

/** How far the drawing of t reaches on each side of the decision line, in units of σ_n: both bells and their tails. */
export function reach(d: number): number {
	return Math.ceil(Math.max(4, d / 2 + 3.6) / BIN) * BIN;
}

export interface Tally {
	/** The separation the trials were run at. */
	d: number;
	trials: number;
	wrong: number;
	/** The trials with the gold in the left safe, and in the right. */
	trialsA: number;
	trialsB: number;
	/** Counts of t in bins of width BIN from −reach(d) to reach(d), for each hypothesis; values beyond go to the ends. */
	binsA: Uint32Array;
	binsB: Uint32Array;
	last?: Trial;
}

export function emptyTally(d: number): Tally {
	const bins = Math.round((2 * reach(d)) / BIN);
	return {
		d,
		trials: 0,
		wrong: 0,
		trialsA: 0,
		trialsB: 0,
		binsA: new Uint32Array(bins),
		binsB: new Uint32Array(bins)
	};
}

/** The bin of t in a tally at separation `d`. */
export function binOf(t: number, d: number): number {
	const half = reach(d);
	const bins = Math.round((2 * half) / BIN);
	return Math.max(0, Math.min(bins - 1, Math.floor((t + half) / BIN)));
}

/** The tally after `count` more trials: a new tally, the old one untouched. */
export function run(tally: Tally, count: number, from: Source): Tally {
	const next: Tally = {
		...tally,
		binsA: tally.binsA.slice(),
		binsB: tally.binsB.slice()
	};
	for (let k = 0; k < count; k++) {
		const one = trial(tally.d, from);
		next.trials += 1;
		if (one.pick !== one.truth) next.wrong += 1;
		if (one.truth === 'A') {
			next.trialsA += 1;
			next.binsA[binOf(one.t, tally.d)] += 1;
		} else {
			next.trialsB += 1;
			next.binsB[binOf(one.t, tally.d)] += 1;
		}
		next.last = one;
	}
	return next;
}

/** The number of wrong answers expected in `trials` trials, and its standard deviation: n p and √(n p (1 − p)). */
export function expectedWrong(trials: number, p: number) {
	return { mean: trials * p, spread: Math.sqrt(trials * p * (1 - p)) };
}

/** The standard Gaussian density, the bell of unit width. */
export const bell = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
