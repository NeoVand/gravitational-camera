// The tutorial, section 3.3 (tutorial/noise/measuring-a-number.md), its second diagram: the likelihood peaks with a
// width 1/sqrt F. The log-likelihood of one mass's depth, averaged over the noise and with its mass known,
// <ln L> = -F (theta - theta_0)^2 / 2 up to a constant, with F = F_zz = 5 R^2 / z^2 (the chapter's Fisher matrix of one
// mass), drawn against (theta - theta_0) / z for the strengths of the whole pattern R = 3, 10 and 30. A dotted line at
// -1/2 marks where each curve has fallen by one half, with a blue dot on each side at theta - theta_0 = +-1/sqrt F
// = +-z / (sqrt 5 R); each curve is named by its R under its right-hand end (the narrowest under its left-hand end). Under the axis, a dimension line for each
// R spans from -1/sqrt F to +1/sqrt F, named with its R and its half-width, +-0.149 z, +-0.045 z and +-0.015 z, each R
// times narrower.
// Exact: the three parabolas (sampled every quarter of a point), the level -1/2 and the widths, asserted against
// z / (sqrt 5 R), against the curves' own crossings of the level and against the half-widths printed. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, INK, DIM, NOISE, CURVE, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-measure-lib.js';

const name = 'tut-measure-peak';
const check = checker(name);

export const STRENGTHS = [30, 10, 3];
const W = 320, H = 124;
const XMAX = 0.4, YMIN = -3.55, YTOP = 0.18, FLOOR = -3;   // the curves stop at <ln L> = -3
const FIRST = 9, ROW = 10.5;                                // the rows under the axis
const DOT_R = 1.05;                                         // the dots where the curves cross the level
const NAME = 7.5;                                           // the curves' names

export default async function () {
	const F = (R) => 5 * R * R;                              // in units of 1/z^2
	const width = (R) => 1 / Math.sqrt(F(R));
	check(STRENGTHS.every((R) => near(width(R), 1 / (Math.sqrt(5) * R), 1e-15)), 'the width is not z / (sqrt 5 R)');
	check(width(3).toFixed(3) === '0.149' && width(10).toFixed(4) === '0.0447' && width(30).toFixed(4) === '0.0149', 'the widths are not as the caption says');
	const printed = { 3: '0.149', 10: '0.045', 30: '0.015' };
	check(STRENGTHS.every((R) => width(R).toFixed(3) === printed[R]), 'the half-widths printed are not the widths');

	const S = new Sheet(name);
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: -XMAX, x1: XMAX, y0: YMIN, y1: YTOP });
	const L = [];

	// ---- the level -1/2, dotted, under the curves
	S.dots([P.X(-XMAX), P.Y(-0.5)], [P.X(XMAX), P.Y(-0.5)], { clear0: 1.2, layer: 1, what: 'the level -1/2' });
	// ---- the curves
	for (const R of STRENGTHS) {
		const f = (t) => -0.5 * F(R) * t * t;
		const reach = Math.sqrt(-2 * FLOOR / F(R));
		check(reach < XMAX, `the curve for R = ${R} leaves the plot`);
		const pts = graph(P, f, -reach, reach);
		check(longest(pts) <= 0.25 + 1e-9, `the curve for R = ${R} is drawn in steps longer than a quarter of a point`);
		// where it crosses the level, from the curve itself
		check(near(f(width(R)), -0.5, 1e-12), `the curve for R = ${R} does not cross -1/2 at its width`);
		S.path(pts, { color: INK, width: CURVE, layer: 2, what: `the curve for R = ${R}` });
		// its name, under one of its ends: the right-hand one, but the left-hand one for the narrowest, whose right-hand
		// end lies too near the next curve's for both names to stand under them
		const end = R === 30 ? -reach : reach;
		L.push(await placed(`\\mathcal R = ${R}`, P.X(end), P.Y(FLOOR) + LABEL_GAP + 0.4, 0.5, 0, INK, NAME));
		// a dot where it crosses the level, in the colour of its width below
		for (const s of [-1, 1]) S.raw(`<circle cx="${P.X(s * width(R)).toFixed(2)}" cy="${P.Y(-0.5).toFixed(2)}" r="${DOT_R}" fill="${NOISE}"/>`, 2.5);
	}
	check(P.Y(FLOOR) - P.bottom < -(CURVE + 0.45) / 2 - 4, 'the curves end on the axis');

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [-0.4, -0.2, 0, 0.2, 0.4], fmt: (t) => (t === 0 ? '0' : (t < 0 ? '-' : '') + Math.abs(t).toFixed(1)), what: 'the depth axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('(\\theta - \\theta_0)/z', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, -0.5, -1, -2, -3], fmt: (t) => (t === 0 ? '0' : t === -0.5 ? '-\\tfrac12' : `-${-t}`), what: 'the log-likelihood axis' })));
	L.push(await placed('\\langle\\ln L\\rangle', P.left + 4.5, P.Y(YTOP), 0, 0.5, DIM));

	// ---- the widths, one row each under the axis
	const base = Math.max(...xl.map((l) => l.box.b));
	for (const [k, R] of STRENGTHS.entries()) {
		const y = base + FIRST + k * ROW;
		const w = width(R);
		dimension(S, P.X(-w), P.X(w), y, { what: `the width for R = ${R}` });
		L.push(await placed(`\\mathcal R = ${R}{:}\\ {\\pm}${printed[R]}z`, P.X(w) + LABEL_GAP + 2.4, y, 0, 0.5, NOISE));
	}

	S.checkAll(L);
	window.tutMeasurePeak = { widths: STRENGTHS.map(width) };
	return finish(S, L, [240, 400]);
}
