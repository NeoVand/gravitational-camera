// The tutorial, section 3.1 (tutorial/noise/probability.md), its first diagram: averaging four readings halves the
// spread. Histograms of 10,000 simulated readings of the person's tide by the superconducting gradiometer, on one
// axis in eotvos: one-second readings x = x0 + n with x0 = 9.34 E and the noise n Gaussian of standard deviation
// sigma_n = 0.02 E, and four-second averages, each the mean of four fresh one-second readings (40,000 draws in all).
// Exact: the draws (seed 31, Box-Muller); the bins, 0.005 E wide and centred on x0; the counts; the true value x0 (the
// signal, orange); and under the axis the standard deviations of the two samples, measured from the draws and
// asserted to be 0.020 E and 0.010 E to three decimals (the noise, blue), each drawn as a line from x0 - sigma to
// x0 + sigma. Also asserted: the four-second histogram's tallest bin is twice the one-second's, within the scatter of
// the counts, and the samples' means lie within their own standard errors of x0. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, near } from './tut-pot-lib.js';
import { placed } from './tut-pot-lib.js';
import { RULE } from '../lib.js';
import {
	normals, mean, sd, Plot, xAxis, yAxis, dimension, steps, pathOf, SIGNAL, NOISE, DATA, MARK, INK, DIM, LABEL_GAP
} from './tut-prob-lib.js';

const name = 'tut-prob-average';
const check = checker(name);

// ---- the simulation ------------------------------------------------------------------------------------------
export const X0 = 9.34;                 // E, the person's tide one metre away (section 1.4)
export const SIGMA = 0.02;              // E, the gradiometer's noise in one second
export const N = 10000;                 // readings in each histogram
export const FOUR = 4;                  // one-second readings in each average
export const BIN = 0.005;               // E, the width of a bin
export const SEED = 31;

export function simulate() {
	const z = normals(SEED);
	const one = Array.from({ length: N }, () => X0 + SIGMA * z());
	const avg = Array.from({ length: N }, () => { let s = 0; for (let k = 0; k < FOUR; k++) s += X0 + SIGMA * z(); return s / FOUR; });
	return { one, avg };
}

/** Counts in the bins centred on X0 + k BIN, for k = -K..K. */
function histogram(xs, K) {
	const c = new Array(2 * K + 1).fill(0);
	let out = 0;
	for (const x of xs) {
		const k = Math.round((x - X0) / BIN);
		if (Math.abs(k) <= K) c[k + K]++; else out++;
	}
	return { c, out };
}

// ---- the drawing (points) ------------------------------------------------------------------------------------
const K = 16;                           // bins on each side of the centre: 16.5 bins = 0.0825 E = 4.1 sigma_n
const W = 246, H = 112;                 // the data rectangle
const YMAX = 2150;                      // the vertical axis's reach, readings in a bin
const MARK_TOP = 2150;                  // the signal's line reaches this high
const GAP1 = 9.5, GAP2 = 11;             // the two dimension lines, this far under the axis's numbers' line, and apart

export default async function () {
	const { one, avg } = simulate();
	const s1 = sd(one), s4 = sd(avg), m1 = mean(one), m4 = mean(avg);
	check(s1.toFixed(3) === '0.020', `the one-second readings' standard deviation is ${s1}, not 0.020 E`);
	check(s4.toFixed(3) === '0.010', `the four-second averages' standard deviation is ${s4}, not 0.010 E`);
	check(near(s4 / s1, 0.5, 0.02), `the ratio of the spreads is ${s4 / s1}, not 1/2`);
	check(Math.abs(m1 - X0) < s1 / Math.sqrt(N) * 3 && Math.abs(m4 - X0) < s4 / Math.sqrt(N) * 3, 'a sample mean is far from x0');
	const h1 = histogram(one, K), h4 = histogram(avg, K);
	check(h1.out / N < 1e-3 && h4.out === 0, `too many readings fall off the axis: ${h1.out} and ${h4.out}`);
	const top1 = Math.max(...h1.c), top4 = Math.max(...h4.c);
	check(near(top4 / top1, 2, 0.12), `the four-second histogram's tallest bin is ${top4 / top1} times the one-second's, not 2`);
	check(top4 < YMAX * 0.97, 'the tallest bin reaches the top of the axis');
	// the expected tallest bins, for the record: N BIN / (sqrt(2 pi) sigma) = 997 and 1995
	const e1 = (N * BIN) / (Math.sqrt(2 * Math.PI) * SIGMA), e4 = 2 * e1;
	check(Math.abs(top1 - e1) < 4 * Math.sqrt(e1) && Math.abs(top4 - e4) < 4 * Math.sqrt(e4), 'a tallest bin is far from its expected count');

	const S = new Sheet(name);
	const lo = X0 - (K + 0.5) * BIN, hi = X0 + (K + 0.5) * BIN;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: lo, x1: hi, y0: 0, y1: YMAX });
	const edges = Array.from({ length: 2 * K + 2 }, (_, i) => lo + i * BIN);
	const L = [];

	// ---- the two histograms: the one-second readings filled in grey, the averages an outline over them
	const p1 = steps(P, edges, h1.c), p4 = steps(P, edges, h4.c);
	S.raw(`<path d="${pathOf(p1)}" fill="${RULE}"/>`, 0.2);
	S.mark(p1, 0, 'the one-second histogram');
	S.path(p4, { color: INK, width: DATA, layer: 0.6, what: 'the four-second histogram' });

	// ---- the axes: eotvos every 0.02 E, readings every 1000
	const ticks = [-3, -2, -1, 0, 1, 2, 3].map((k) => +(X0 + 0.02 * k).toFixed(2));
	const xl = await xAxis(S, P, { ticks, fmt: (t) => t.toFixed(2), what: 'the axis of the readings' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [0, 1000, 2000], fmt: (t) => (t ? `${t / 1000}\\,000` : '0'), what: 'the axis of counts' })));
	// the axis's name past its right end, on the line of the numbers
	const last = xl[xl.length - 1];
	L.push(await placed('\\text{reading (E)}', P.right + 4, (last.box.t + last.box.b) / 2 + 0.6, 0, 0.5, DIM));
	L.push(await placed('\\text{readings in a bin}', P.left + 4.5, P.Y(YMAX), 0, 0.5, DIM));

	// ---- the signal: the true value, a line through both histograms, named above
	const xs = P.X(X0);
	S.path([[xs, P.bottom], [xs, P.Y(MARK_TOP)]], { color: SIGNAL, width: MARK, layer: 2, cap: 'butt', what: 'the true value' });
	L.push(await placed('x_0 = 9.34\\ \\mathrm{E}', xs, P.Y(MARK_TOP) - LABEL_GAP - 0.4, 0.5, 1, SIGNAL));

	// ---- the noise: each sample's standard deviation, a line from x0 - sigma to x0 + sigma under the axis
	const base = xl[0].box.b;
	const y1 = base + GAP1, y4 = y1 + GAP2;
	dimension(S, P.X(X0 - s1), P.X(X0 + s1), y1, { what: 'one second\'s spread' });
	dimension(S, P.X(X0 - s4), P.X(X0 + s4), y4, { what: 'four seconds\' spread' });
	L.push(await placed('\\sigma_n = 0.020\\ \\mathrm{E}', P.X(X0 + s1) + LABEL_GAP + 1.4, y1, 0, 0.5, NOISE));
	L.push(await placed('\\sigma_n(4\\,\\mathrm{s}) = 0.010\\ \\mathrm{E}', P.X(X0 + s4) + LABEL_GAP + 1.4, y4, 0, 0.5, NOISE));

	// ---- the histograms' names, beside their shoulders
	L.push(await S.clear('\\text{average of four}', P.X(X0 - 0.017), P.Y(top4 * 0.72), 1, 0.5, [-1, 0]));
	L.push(await S.clear('\\text{one second}', P.X(X0 + 0.034), P.Y(top1 * 0.5), 0, 0.5, [1, 0]));

	S.checkAll(L);
	window.tutProbAverage = { s1, s4, m1, m4, top1, top4, out: h1.out };
	return finish(S, L, [240, 340]);
}
