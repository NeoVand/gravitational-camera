/**
 * Chapter 8.5's click trains: one mode per window, counted by ideal detectors. Each window is drawn afresh from one of
 * three sources with the same mean count n̄:
 *
 * - coherent (steady): a Poisson count of mean n̄;
 * - thermal: a window intensity λ drawn from the exponential law of mean n̄, then a Poisson count of mean λ, which is
 *   the geometric law n̄ⁿ/(1 + n̄)^{n+1};
 * - two-mode squeezed (the pair source): one count n drawn from the geometric law and given to both detectors.
 *
 * From the windows counted it measures the chapter's numbers, g⁽²⁾ = ⟨n(n − 1)⟩/n̄² for each detector and the cross
 * coherence g⁽²⁾₁₂ = ⟨n₁n₂⟩/n̄₁n̄₂ (no −1), each with its standard error, and judges the two classical bounds,
 * g⁽²⁾ ≥ 1 and g⁽²⁾₁₂ ≤ √(g⁽²⁾₁₁g⁽²⁾₂₂): a bound is broken when the measurement passes it by more than three standard
 * errors.
 *
 * The standard errors are the delta method's. Every number measured is a smooth function f of the means of the five
 * window quantities v = (n₁, n₂, n₁(n₁ − 1), n₂(n₂ − 1), n₁n₂); with c the gradient of f there and Σ the covariance
 * of v over the windows, the variance of f is cᵀΣc/N after N windows. Σ needs the means of n₁ⁱn₂ʲ up to i + j = 4,
 * which the tally keeps as power sums.
 *
 * Samplers, tally, readings, bounds, words and the two predictions are pure functions here; the component only
 * draws them.
 */
import { generator, logFactorial, poisson } from './graviton-count';
import { stepped, type Range } from './near-to-far';

export { generator, stepped, type Range };

// --- the settings ----------------------------------------------------------------------------------------------------

export type Mode = 'coherent' | 'thermal' | 'pair';
export const MODES: readonly Mode[] = ['coherent', 'thermal', 'pair'];

/** The source and log₁₀ n̄, the mean count per window. */
export interface Settings {
	mode: Mode;
	lt: number;
}

/**
 * n̄ as log₁₀ n̄, from 0.01 to 10: a hundredth of a decade dragged, a twentieth pressed, a quarter with Shift. Both
 * key grids land on n̄ = 0.1 and 1 exactly.
 */
export const NBAR: Range = { min: -2, max: 1, step: 0.01, key: 0.05, large: 0.25 };

/** The figure opens on the steady source at one quantum per window. */
export const OPENING: Settings = { mode: 'coherent', lt: 0 };

/** n̄ for a slider's log₁₀ n̄. */
export const nbarOf = (lt: number) => 10 ** lt;

/** A log₁₀ n̄ held to its range and landed on its grid of hundredths of a decade, the two ends kept exact. */
export function snapLt(v: number): number {
	if (!(v > NBAR.min + NBAR.step / 2)) return NBAR.min;
	if (v >= NBAR.max - NBAR.step / 2) return NBAR.max;
	return Math.round(Math.round(v / NBAR.step) * NBAR.step * 1e9) / 1e9 || 0;
}

/** Whether a source has two detectors. */
export const twoDetectors = (mode: Mode) => mode === 'pair';

// --- the samplers --------------------------------------------------------------------------------------------------

/** A number from the exponential law of mean `mean`. 1 − u is in (0, 1], so the logarithm is finite. */
export const exponential = (mean: number, random: () => number) => -mean * Math.log(1 - random());

/** A steady source's count: Poisson with the mean n̄. */
export const coherentCount = (nbar: number, random: () => number) => poisson(nbar, random);

/** A thermal source's count: an intensity λ from the exponential law of mean n̄, then a Poisson count of mean λ. */
export const thermalCount = (nbar: number, random: () => number) =>
	poisson(exponential(nbar, random), random);

/** A count from the geometric law n̄ⁿ/(1 + n̄)^{n+1}, by inversion: P(n ≥ k) = yᵏ with y = n̄/(1 + n̄). */
export function geometricCount(nbar: number, random: () => number): number {
	if (!(nbar > 0)) return 0;
	const u = 1 - random();
	return Math.floor(Math.log(u) / Math.log(nbar / (1 + nbar)));
}

/** One window's counts at the two detectors; a source with one detector gives b = 0. */
export interface Counts {
	a: number;
	b: number;
}

/** One window from a source: the pair source gives its one geometric count to both detectors. */
export function drawWindow(mode: Mode, nbar: number, random: () => number): Counts {
	if (mode === 'coherent') return { a: coherentCount(nbar, random), b: 0 };
	if (mode === 'thermal') return { a: thermalCount(nbar, random), b: 0 };
	const n = geometricCount(nbar, random);
	return { a: n, b: n };
}

/** The Poisson law e^{−n̄}n̄ⁿ/n!. */
export function poissonLaw(n: number, nbar: number): number {
	if (nbar === 0) return n === 0 ? 1 : 0;
	return Math.exp(n * Math.log(nbar) - nbar - logFactorial(n));
}

/** The geometric (thermal) law n̄ⁿ/(1 + n̄)^{n+1}. */
export function geometricLaw(n: number, nbar: number): number {
	if (nbar === 0) return n === 0 ? 1 : 0;
	return Math.exp(n * Math.log(nbar) - (n + 1) * Math.log1p(nbar));
}

// --- the tally -----------------------------------------------------------------------------------------------------

/** The highest power kept: the sums of n₁ⁱn₂ʲ for i + j ≤ 4. */
const DEGREE = 4;
const SIDE = DEGREE + 1;
const at = (i: number, j: number) => i * SIDE + j;

/** The windows counted since the last clearing: their number, power sums, and the histogram of detector 1's counts. */
export interface Tally {
	windows: number;
	/** sums[i·5 + j] = Σ n₁ⁱn₂ʲ over the windows, for i + j ≤ 4. */
	sums: Float64Array;
	/** hist[n] = the number of windows in which detector 1 counted n. */
	hist: number[];
}

export const emptyTally = (): Tally => ({
	windows: 0,
	sums: new Float64Array(SIDE * SIDE),
	hist: []
});

/** Adds one window to a tally, in place. */
export function record(t: Tally, w: Counts): void {
	t.windows++;
	let ai = 1;
	for (let i = 0; i <= DEGREE; i++) {
		let bj = 1;
		for (let j = 0; i + j <= DEGREE; j++) {
			t.sums[at(i, j)] += ai * bj;
			bj *= w.b;
		}
		ai *= w.a;
	}
	while (t.hist.length <= w.a) t.hist.push(0);
	t.hist[w.a]++;
}

/** Draws `count` windows from a source into a tally, in place. */
export function runWindows(
	t: Tally,
	mode: Mode,
	nbar: number,
	count: number,
	random: () => number
): void {
	for (let k = 0; k < count; k++) record(t, drawWindow(mode, nbar, random));
}

/** A tally of `count` windows from a seeded stream, for the tests and the server. */
export function sampleTally(mode: Mode, nbar: number, count: number, seed: number): Tally {
	const t = emptyTally();
	runWindows(t, mode, nbar, count, generator(seed));
	return t;
}

/** Clicks counted by detector 1: Σn₁. */
export const clicksOf = (t: Tally) => t.sums[at(1, 0)];
/** Ordered pairs of different clicks in one window of detector 1: Σn₁(n₁ − 1). */
export const pairsOf = (t: Tally) => t.sums[at(2, 0)] - t.sums[at(1, 0)];
/** Coincidences between the two detectors: Σn₁n₂. */
export const coincidencesOf = (t: Tally) => t.sums[at(1, 1)];

// --- the readings and their errors ---------------------------------------------------------------------------------

/** A measured number with its standard error. */
export interface Estimate {
	value: number;
	se: number;
}

/** The window quantities v as polynomials in n₁ and n₂: lists of [coefficient, i, j]. */
const V: [number, number, number][][] = [
	[[1, 1, 0]],
	[[1, 0, 1]],
	[
		[1, 2, 0],
		[-1, 1, 0]
	],
	[
		[1, 0, 2],
		[-1, 0, 1]
	],
	[[1, 1, 1]]
];

/** The means of v and their covariance matrix over the windows of a tally. */
export function moments(t: Tally): { mean: number[]; cov: number[][] } {
	const N = t.windows;
	const m = (i: number, j: number) => t.sums[at(i, j)] / N;
	const mean = V.map((p) => p.reduce((s, [c, i, j]) => s + c * m(i, j), 0));
	const cov = V.map((p, k) =>
		V.map((q, l) => {
			let e = 0;
			for (const [c, i, j] of p) for (const [d, i2, j2] of q) e += c * d * m(i + i2, j + j2);
			return e - mean[k] * mean[l];
		})
	);
	return { mean, cov };
}

/** The delta method: the standard error of a function of the means, from its gradient there. */
export function deltaError(gradient: number[], cov: number[][], windows: number): number {
	let s = 0;
	for (let k = 0; k < gradient.length; k++)
		for (let l = 0; l < gradient.length; l++) s += gradient[k] * cov[k][l] * gradient[l];
	return Math.sqrt(Math.max(0, s) / windows);
}

/** Clicks needed before a mean or a variance is shown. */
export const MIN_CLICKS = 20;
/** Pairs of clicks (within a window, or across the detectors) needed before a coherence is shown. */
export const MIN_PAIRS = 20;

/** What a tally measures; a number is left out until enough clicks or pairs are in for its error to mean anything. */
export interface Readings {
	windows: number;
	clicks: number;
	pairs: number;
	coincidences: number;
	two: boolean;
	mean?: Estimate;
	variance?: Estimate;
	g?: Estimate;
	mean2?: Estimate;
	variance2?: Estimate;
	g22?: Estimate;
	g12?: Estimate;
	/** g⁽²⁾₁₂ − √(g⁽²⁾₁₁g⁽²⁾₂₂): positive when the classical bound is passed. */
	excess?: Estimate;
}

/** The readings of a tally, for one detector or for two. */
export function readings(t: Tally, two: boolean): Readings {
	const N = t.windows;
	const clicks = clicksOf(t);
	const pairs = pairsOf(t);
	const coincidences = coincidencesOf(t);
	const r: Readings = { windows: N, clicks, pairs, coincidences, two };
	if (N < 2 || clicks < MIN_CLICKS) return r;
	const { mean: mu, cov } = moments(t);
	const est = (value: number, gradient: number[]): Estimate => ({
		value,
		se: deltaError(gradient, cov, N)
	});

	// detector k's mean is μ_k, its variance μ_{x_k} + μ_k − μ_k², its coherence μ_{x_k}/μ_k²
	const one = (k: 0 | 1) => {
		const n = mu[k];
		const x = mu[k + 2];
		const e = (dn: number, dx: number) => {
			const g = [0, 0, 0, 0, 0];
			g[k] = dn;
			g[k + 2] = dx;
			return g;
		};
		const gGrad = e((-2 * x) / n ** 3, 1 / n ** 2);
		return {
			mean: est(n, e(1, 0)),
			variance: est(x + n - n * n, e(1 - 2 * n, 1)),
			g: x > 0 ? est(x / (n * n), gGrad) : undefined,
			gGrad
		};
	};

	const d1 = one(0);
	r.mean = d1.mean;
	r.variance = d1.variance;
	if (pairs >= MIN_PAIRS) r.g = d1.g;
	if (!two || t.sums[at(0, 1)] < MIN_CLICKS) return r;

	const d2 = one(1);
	r.mean2 = d2.mean;
	r.variance2 = d2.variance;
	const pairs2 = t.sums[at(0, 2)] - t.sums[at(0, 1)];
	if (pairs2 >= MIN_PAIRS) r.g22 = d2.g;
	if (coincidences < MIN_PAIRS) return r;

	const [n1, n2, , , y] = mu;
	const g12 = y / (n1 * n2);
	const g12Grad = [-y / (n1 * n1 * n2), -y / (n1 * n2 * n2), 0, 0, 1 / (n1 * n2)];
	r.g12 = est(g12, g12Grad);
	if (r.g && r.g22) {
		const root = Math.sqrt(r.g.value * r.g22.value);
		const g11 = r.g.value;
		const g22 = r.g22.value;
		const grad = g12Grad.map((c, k) => c - (g22 * d1.gGrad[k] + g11 * d2.gGrad[k]) / (2 * root));
		r.excess = est(g12 - root, grad);
	}
	return r;
}

// --- the bounds ----------------------------------------------------------------------------------------------------

/** A bound is broken once a measurement passes it by more than this many standard errors. */
export const BREAK = 3;

export type Verdict =
	| { status: 'waiting' }
	| { status: 'holds'; errors: number }
	| { status: 'broken'; errors: number };

/**
 * The verdict on a bound from the amount by which the measurement passes it (positive on the forbidden side) and that
 * amount's standard error: broken when it is more than BREAK errors. `errors` is the amount in standard errors.
 */
export function judge(passed: Estimate | undefined): Verdict {
	if (!passed) return { status: 'waiting' };
	const errors = passed.se > 0 ? passed.value / passed.se : passed.value > 0 ? Infinity : -Infinity;
	return { status: errors > BREAK ? 'broken' : 'holds', errors };
}

/** The amount by which g⁽²⁾ falls below 1, as an estimate. */
const below1 = (g: Estimate | undefined): Estimate | undefined =>
	g && { value: 1 - g.value, se: g.se };

/** The bound g⁽²⁾ ≥ 1, on detector 1 and, with two detectors, on detector 2 as well: broken if either breaks it. */
export function lowerBound(r: Readings): Verdict {
	const first = judge(below1(r.g));
	if (!r.two) return first;
	const second = judge(below1(r.g22));
	if (first.status === 'waiting' || second.status === 'waiting') return { status: 'waiting' };
	return first.errors >= second.errors ? first : second;
}

/** The bound g⁽²⁾₁₂ ≤ √(g⁽²⁾₁₁g⁽²⁾₂₂), for two detectors. */
export const crossBound = (r: Readings): Verdict => judge(r.two ? r.excess : undefined);

// --- the exact values ----------------------------------------------------------------------------------------------

/** The source's own g⁽²⁾ for one detector: 1 for the steady source, 2 for thermal light and for each half of a pair. */
export const gOf = (mode: Mode) => (mode === 'coherent' ? 1 : 2);
/** The pair source's cross coherence, 2 + 1/n̄. */
export const g12Of = (nbar: number) => 2 + 1 / nbar;
/** The variance of a source's counts: n̄ for the steady source, n̄ + n̄² otherwise. */
export const varianceOf = (mode: Mode, nbar: number) =>
	mode === 'coherent' ? nbar : nbar + nbar * nbar;

// --- the trains ----------------------------------------------------------------------------------------------------

/** Windows counted each second while running; the trains show far fewer. */
export const COUNT_RATE = 4000;
/** Windows the trains scroll by each second. */
export const SHOW_RATE = 2.5;
/** Windows across a train on a wide screen, and on a phone (the same density of windows on a shorter axis). */
export const TRAIN_WINDOWS = 32;
export const PHONE_WINDOWS = 18;

/** A window drawn on the trains: its place in time, in windows, and its clicks' times within it, from 0 to 1. */
export interface Shown {
	id: number;
	times: number[];
}

/** n click times, independent and uniform within a window, in order. */
export function clickTimes(n: number, random: () => number): number[] {
	const times = Array.from({ length: n }, () => random());
	return times.sort((p, q) => p - q);
}

/** A window for the trains: one count from the source, its clicks spread at random; a pair shares its times. */
export function showWindow(id: number, mode: Mode, nbar: number, random: () => number): Shown {
	return { id, times: clickTimes(drawWindow(mode, nbar, random).a, random) };
}

/** The windows that fill a train whose right edge, "now", is at `head` windows: every window that reaches into view. */
export function fillTrain(head: number, mode: Mode, nbar: number, random: () => number): Shown[] {
	const last = Math.floor(head);
	const out: Shown[] = [];
	for (let id = last - TRAIN_WINDOWS; id <= last; id++)
		out.push(showWindow(id, mode, nbar, random));
	return out;
}

/**
 * The train after the clock moves from `head` to `next`: the windows that have begun since are added, and those
 * wholly out of view on the left dropped.
 */
export function scrollTrain(
	train: Shown[],
	next: number,
	mode: Mode,
	nbar: number,
	random: () => number
): Shown[] {
	let newest = train.length ? train[train.length - 1].id : Math.floor(next) - 1;
	const out = train.filter((w) => w.id + 1 > next - TRAIN_WINDOWS);
	while (newest < Math.floor(next)) out.push(showWindow(++newest, mode, nbar, random));
	return out;
}

/**
 * The windows to count in a frame of `dt` seconds, with the fraction of a window owed from the last: a whole number
 * of windows now and the fraction carried to the next frame.
 */
export function windowsDue(owed: number, dt: number): { count: number; owed: number } {
	const total = owed + COUNT_RATE * dt;
	const count = Math.floor(total);
	return { count, owed: total - count };
}

// --- the histogram -------------------------------------------------------------------------------------------------

/** The smallest fraction the histogram's logarithmic axis reaches. */
export const FLOOR = 1e-6;
/** The most counts the histogram shows, 0 to 40. */
export const MOST_COUNT = 40;

/** The largest count drawn: four standard deviations above the source's mean, from 4 to 40. */
export function countRange(mode: Mode, nbar: number): number {
	const sd = Math.sqrt(varianceOf(mode, nbar));
	return Math.max(4, Math.min(MOST_COUNT, Math.ceil(nbar + 4 * sd)));
}

/** The fraction of windows with each count from 0 to `top`, and the fraction above it. */
export function fractions(t: Tally, top: number): { p: number[]; above: number } {
	const N = t.windows;
	const p = Array.from({ length: top + 1 }, (_, n) => (N ? (t.hist[n] ?? 0) / N : 0));
	const shown = p.reduce((s, v) => s + v, 0);
	return { p, above: N ? Math.max(0, 1 - shown) : 0 };
}

/** A law's points from 0 to `top`, down to the floor of the axis: the curve stops at its first point below it. */
export function lawPoints(law: (n: number, nbar: number) => number, nbar: number, top: number) {
	const out: { n: number; p: number }[] = [];
	for (let n = 0; n <= top; n++) {
		const p = law(n, nbar);
		if (p < FLOOR) break;
		out.push({ n, p });
	}
	return out;
}

// --- the predictions -----------------------------------------------------------------------------------------------

/** Windows and clicks a run needs before it counts toward a prediction. */
export const READY_WINDOWS = 1000;
export const READY_CLICKS = 50;

/**
 * Whether a run has gone on long enough to count toward a prediction: a thousand windows and fifty clicks, and for
 * the pair source a measured g⁽²⁾₁₂ as well.
 */
export function ranEnough(mode: Mode, t: Tally): boolean {
	if (t.windows < READY_WINDOWS || clicksOf(t) < READY_CLICKS) return false;
	return mode !== 'pair' || coincidencesOf(t) >= MIN_PAIRS;
}

/** The settings each source has been run at long enough, as log₁₀ n̄ in hundredths of a decade. */
export type Ran = Record<Mode, number[]>;
export const NOTHING_RAN: Ran = { coherent: [], thermal: [], pair: [] };

const hundredths = (lt: number) => Math.round(lt * 100);

/** The record after a run at `s`, a new object only when the setting is new. */
export function noteRun(ran: Ran, s: Settings): Ran {
	const k = hundredths(s.lt);
	if (ran[s.mode].includes(k)) return ran;
	return { ...ran, [s.mode]: [...ran[s.mode], k] };
}

/** The first, once the steady and the thermal sources have both been run at the same n̄. */
export const noteFirst = (done: boolean, ran: Ran) =>
	done || ran.coherent.some((k) => ran.thermal.includes(k));

/** The second asks for the pair source at a low n̄, at most this, */
export const LOW = 0.3;
/** and at least this many times lower than another n̄ it has been run at. */
export const LOWER_BY = 3;

/** The second, once the pair source has been run at two n̄, the lower at most 0.3 and at most a third of the other. */
export function noteSecond(done: boolean, ran: Ran): boolean {
	if (done) return true;
	const ns = ran.pair.map((k) => nbarOf(k / 100));
	const low = Math.min(...ns);
	const high = Math.max(...ns);
	return ns.length >= 2 && low <= LOW + 1e-9 && high >= LOWER_BY * low - 1e-9;
}

// --- the words -----------------------------------------------------------------------------------------------------

/** A number with a true minus sign. */
export const minus = (s: string) => s.replace('-', '−');

/** n̄ to three figures: "0.0100", "0.269", "1.00", "10.0". */
export const nbarWords = (nbar: number) => nbar.toPrecision(3);

/** The decimals that give a standard error two significant figures, from 0 to 4. */
export function decimalsFor(se: number): number {
	if (!(se > 0) || !Number.isFinite(se)) return 4;
	return Math.max(0, Math.min(4, 1 - Math.floor(Math.log10(se))));
}

/** An estimate as "2.003 ± 0.012": the error to two figures, the value to the same place. */
export function withError(e: Estimate): string {
	const d = decimalsFor(e.se);
	return `${minus(e.value.toFixed(d))} ± ${e.se.toFixed(d)}`;
}

/** A count in grouped digits: "12,400". */
export const countWords = (n: number) => Math.round(n).toLocaleString('en-US');

/** How far a bound is passed, in words: "by 33 errors", "by more than 1,000 errors". */
export function errorsWords(errors: number): string {
	if (!Number.isFinite(errors) || errors > 1000) return 'by more than 1,000 errors';
	return `by ${Math.round(errors)} errors`;
}

/** The source's name as the trains label it. */
export const MODE_NAMES: Record<Mode, string> = {
	coherent: 'steady (coherent)',
	thermal: 'thermal',
	pair: 'pair source'
};
