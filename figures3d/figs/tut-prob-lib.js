// Shared tools for the four diagrams of the tutorial's chapter 3.1 (tutorial/noise/probability.md):
// tut-prob-average, tut-prob-tails, tut-prob-shared and tut-prob-poisson. Not a figure itself. These are data
// figures, so this file adds to chapter 1.2's sheet (figs/tut-pot-lib.js, imported, not copied) what a chart needs: a
// seeded source of random numbers, the sample statistics, a plot that maps data to the page, thin axes with few
// ticks, and a dimension line. The colours are fixed for all four: the signal in the first accent (orange), the noise
// in the second (blue), the readings themselves in neutral ink and its pale tint.
import { INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { placed, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';

export const SIGNAL = ACCENT;               // the signal: a true value, a mean
export const NOISE = ACCENT2;               // the noise: a standard deviation, a band of the noise
export const TINT = '#eeebe5';              // the readings' pale fill (drawing.ts, THEME: a neutral tint of the page)
export const DATA = 0.5;                    // the readings' outline, a trace
export const CURVE = 0.6;                   // a density drawn over the data
export const MARK = 0.6;                    // the signal's line
export const DIM_LINE = 0.55;               // a dimension line (a standard deviation, a band)
export const END = 2.2;                     // half the height of a dimension line's end
export const NUM = 2.4;                     // from a tick's end to its number

// ---- random numbers: seeded, so that every render draws the same ---------------------------------------------

/** A uniform deviate on [0, 1) from the seed (mulberry32, as figs/tut-blur.js). */
export function uniforms(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Standard normal deviates from the seed (Box-Muller, both members of each pair). */
export function normals(seed) {
	const u = uniforms(seed);
	let spare = null;
	return () => {
		if (spare !== null) { const s = spare; spare = null; return s; }
		const r = Math.sqrt(-2 * Math.log(1 - u())), t = 2 * Math.PI * u();
		spare = r * Math.sin(t);
		return r * Math.cos(t);
	};
}

export const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
/** The standard deviation of a sample, about its own mean (divided by N - 1). */
export const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1)); };
export const cov = (xs, ys) => { const a = mean(xs), b = mean(ys); return xs.reduce((s, x, i) => s + (x - a) * (ys[i] - b), 0) / (xs.length - 1); };
export const corr = (xs, ys) => cov(xs, ys) / (sd(xs) * sd(ys));

/** The standard Gaussian density, and its upper tail P(Z > z) from a continued fraction for erfc (exact to 1e-12). */
export const gauss = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
export function upper(z) {
	// P(Z > z) = 1/2 erfc(z / sqrt 2)
	if (z < 0) return 1 - upper(-z);
	if (z < 1.5) {
		// near zero, the series of erf: erf(x) = 2/sqrt(pi) sum (-1)^n x^(2n+1) / (n! (2n + 1))
		const x = z / Math.SQRT2;
		let term = x, sum = x;
		for (let n = 1; n < 80; n++) { term *= -x * x / n; sum += term / (2 * n + 1); }
		return 0.5 - sum / Math.sqrt(Math.PI);
	}
	// farther out, the Mills ratio's continued fraction, P(Z > z) / p(z) = 1/(z + 1/(z + 2/(z + 3/(z + ...)))),
	// evaluated from the bottom up
	let g = z;
	for (let k = 300; k >= 1; k--) g = z + k / g;
	return gauss(z) / g;
}

// ---- the plot: data to the page ----------------------------------------------------------------------------

/** A plot whose data rectangle [x0, x1] by [y0, y1] fills the page box left, top, width w, height h (y down). */
export class Plot {
	constructor({ left, top, w, h, x0, x1, y0, y1 }) {
		Object.assign(this, { left, top, w, h, x0, x1, y0, y1 });
	}
	X(x) { return this.left + ((x - this.x0) / (this.x1 - this.x0)) * this.w; }
	Y(y) { return this.top + this.h - ((y - this.y0) / (this.y1 - this.y0)) * this.h; }
	at(x, y) { return [this.X(x), this.Y(y)]; }
	get bottom() { return this.top + this.h; }
	get right() { return this.left + this.w; }
}

/** The horizontal axis at the plot's bottom (or at `y`, page), from `from` to `to` (data), with ticks downward at
 * `ticks` and their numbers `fmt(t)` under them; returns the numbers' labels. */
export async function xAxis(S, P, { ticks, fmt = String, from = P.x0, to = P.x1, y = P.bottom, color = DIM, what = 'the x axis' }) {
	S.path([[P.X(from), y], [P.X(to), y]], { color, width: AXIS, layer: 1, cap: 'butt', what });
	const L = [];
	for (const t of ticks) {
		const x = P.X(t);
		S.path([[x, y], [x, y + TICK]], { color, width: HAIR, layer: 1, cap: 'butt', what: `${what}'s tick at ${t}` });
		const f = fmt(t);
		if (f !== null) L.push(await placed(f, x, y + TICK + NUM, 0.5, 0, color));
	}
	return L;
}

/** The vertical axis at the plot's left (or at `x`, page), with ticks leftward and their numbers beside them. */
export async function yAxis(S, P, { ticks, fmt = String, from = P.y0, to = P.y1, x = P.left, color = DIM, what = 'the y axis' }) {
	S.path([[x, P.Y(from)], [x, P.Y(to)]], { color, width: AXIS, layer: 1, cap: 'butt', what });
	const L = [];
	for (const t of ticks) {
		const y = P.Y(t);
		S.path([[x, y], [x - TICK, y]], { color, width: HAIR, layer: 1, cap: 'butt', what: `${what}'s tick at ${t}` });
		const f = fmt(t);
		if (f !== null) L.push(await placed(f, x - TICK - NUM, y, 1, 0.5, color));
	}
	return L;
}

/** A horizontal dimension line from xa to xb (page) at the height y: a line with a short upright stroke at each end
 * (or at the ends that `ends` names). */
export function dimension(S, xa, xb, y, { color = NOISE, width = DIM_LINE, layer = 3, ends = [true, true], what = 'a dimension line' } = {}) {
	S.path([[xa, y], [xb, y]], { color, width, layer, cap: 'butt', what });
	for (const x of [xa, xb].filter((_, i) => ends[i])) S.path([[x, y - END], [x, y + END]], { color, width, layer, cap: 'butt', what: `${what}'s end` });
}

/** A step outline of a histogram: counts c[i] over the bins [edges[i], edges[i + 1]], on the plot P, closed down to
 * zero at both ends. */
export function steps(P, edges, c) {
	// from the first bin that holds anything to the last, so that the outline does not run along the axis
	const a = c.findIndex((n) => n > 0), b = c.length - 1 - [...c].reverse().findIndex((n) => n > 0);
	const pts = [P.at(edges[a], 0)];
	for (let i = a; i <= b; i++) pts.push(P.at(edges[i], c[i]), P.at(edges[i + 1], c[i]));
	pts.push(P.at(edges[b + 1], 0));
	return pts;
}

/** Where a density drawn on the plot P (stroke `width`) stops being distinguishable from the horizontal axis (stroke
 * AXIS) beneath it: the value whose height on the page is the two half-widths. A curve is drawn only above it, so
 * that it never runs along the axis as a second line. */
export const merge = (P, width) => ((width + AXIS) / 2 / P.h) * (P.y1 - P.y0);

/** Path data of a polygon of page points. */
export const pathOf = (pts, close = true) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + (close ? 'Z' : '');

export { INK, DIM, ACCENT, ACCENT2, LABEL_GAP };
