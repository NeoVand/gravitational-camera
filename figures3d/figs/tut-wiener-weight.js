// The tutorial, section 3.5 (tutorial/noise/wiener-filter.md), its first diagram: the best guess's weight and its
// error. Against the ratio s on a logarithmic axis from 0.01 to 100: the weight H = s^2 / (1 + s^2) with which the best
// linear guess keeps the reading (neutral ink); the error it leaves, 1/(1 + s^2) (first accent, orange); and the error
// of the naive guess y/T, 1/s^2 (second accent, blue, dashed), both in units of the prior's variance and on the same
// vertical axis, which stops at 3. Dots at s = 1/3 (H = 0.1), s = 1 (H = 1/2, where the weight and the best guess's
// error cross, and the naive guess's error equals the prior's variance) and s = 3 (H = 0.9).
// Exact: the three curves (sampled every quarter of a point along their length, and drawn only where they stand clear
// of the horizontal axis; the naive guess's error enters at the top of the axis, at 3) and the dots, asserted against
// the chapter's numbers (0.1, 1/2, 0.9; the errors 1/2 and 1 at s = 1; 0.57 and 0.43 for the 17th pattern, s = 1.14).
// Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, INK, DIM, ACCENT, ACCENT2, CURVE } from './tut-fourier-lib.js';

const name = 'tut-wiener-weight';
const check = checker(name);

// ---- the mathematics: l = log10 s ---------------------------------------------------------------------------------
export const weight = (s) => (s * s) / (1 + s * s);
export const best = (s) => 1 / (1 + s * s);
export const naive = (s) => 1 / (s * s);
export const MARKS = [1 / 3, 1, 3];
export const TOP = 3;                                       // the vertical axis stops here, and the naive error with it

function mathematics() {
	check(near(weight(1 / 3), 0.1, 1e-15) && near(weight(1), 0.5, 1e-15) && near(weight(3), 0.9, 1e-15), 'the weights at 1/3, 1 and 3');
	check(near(best(1), 0.5, 1e-15) && near(naive(1), 1, 1e-15), 'the errors at s = 1');
	check(near(best(3), 0.1, 1e-15), 'the error at s = 3');
	// the 17th pattern: s = 1.14 is kept with 0.57 and leaves 0.43 of the prior's variance
	check(weight(1.14).toFixed(2) === '0.57' && best(1.14).toFixed(2) === '0.43', 'the 17th pattern');
	// the weight and the best guess's error always add to one, so they cross at s = 1
	for (const s of [0.01, 0.3, 1, 7, 100]) check(near(weight(s) + best(s), 1, 1e-15), 'H + error is not 1');
	// the naive guess's error is above the prior's variance exactly when s < 1
	check(naive(0.99) > 1 && naive(1.01) < 1, 'the naive error crosses 1 at s = 1');
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const PW = 262, PH = 120;                                   // s from 10^-2.15 to 100; 0 to 3
const L0 = -2.15;                                           // the axis starts a little left of 0.01, clear of the vertical axis's numbers
const DASH = [2.2, 1.4];
const DOT = 1.05;

export default async function () {
	mathematics();
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: L0, x1: 2, y0: 0, y1: TOP });
	const of = (f) => (l) => f(10 ** l);
	const clear = merge(P, CURVE);
	// where a falling (or rising) function of l crosses the value v, by bisection
	const cross = (f, v, a, b) => {
		const up = f(b) > f(a);
		for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if ((f(m) < v) === up) a = m; else b = m; }
		return (a + b) / 2;
	};

	// ---- the curves, each stopped where it would merge with the horizontal axis; the best guess's error starts at
	// s = 0.01, clear of the vertical axis and its tick at 1
	const lH = cross(of(weight), clear, L0, 0);
	const lB = cross(of(best), clear, 0, 2);
	const lN = cross(of(naive), clear, 0, 2);
	const lTop = cross(of(naive), TOP, L0, 0);
	check(near(naive(10 ** lTop), TOP, 1e-9), 'the naive error does not enter at the top');
	const curves = [
		[of(weight), lH, 2, { color: INK }, 'the weight H'],
		[of(best), -2, lB, { color: ACCENT }, 'the best guess\'s error'],
		[of(naive), lTop, lN, { color: ACCENT2, dash: DASH, cap: 'butt' }, 'the naive guess\'s error']
	];
	for (const [f, a, b, o, what] of curves) {
		const pts = graph(P, f, a, b);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y <= P.bottom - (CURVE + 0.45) / 2 + 1e-6 && y >= P.top - 1e-6), `${what} leaves the chart or meets its axis`);
		S.path(pts, { width: CURVE, layer: o.color === ACCENT2 ? 2.2 : 2, what, ...o });
	}

	// ---- the dots: on the weight at 1/3, 1 and 3; on the naive guess's error at 1, where it equals the prior's variance
	const dot = (l, v, color, what) => {
		const [x, y] = P.at(l, v);
		S.raw(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${DOT}" fill="${color}"/>`, 3);
		S.mark([[x, y]], DOT, what);
		return [x, y];
	};
	const [d0, d1, d2] = MARKS.map((s) => dot(Math.log10(s), weight(s), INK, `the dot at s = ${s}`));
	dot(0, naive(1), ACCENT2, 'the naive guess\'s error at s = 1');

	// ---- the axes
	const ticks = [-2, -1, Math.log10(1 / 3), 0, Math.log10(3), 1, 2];
	const nums = ['0.01', '0.1', '\\tfrac13', '1', '3', '10', '100'];
	const xl = await xAxis(S, P, { ticks, fmt: (t) => nums[ticks.indexOf(t)], what: 'the s axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('s', last.box.r + 4, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2, 3], what: 'the vertical axis' })));

	// ---- the dots' values
	L.push(await S.clear('0.1', d0[0] - LABEL_GAP - 1, d0[1], 1, 1, [0, -1], { color: INK }));
	// in the wedge under the crossing, between the weight and the best guess's error
	L.push(await S.clear('\\tfrac12', d1[0], d1[1] + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: INK }));
	L.push(await S.clear('0.9', d2[0], d2[1] + LABEL_GAP + 1, 0.5, 0, [0, 1], { color: INK }));

	// ---- the curves' names
	L.push(await S.clear('H', P.X(1.5), P.Y(weight(10 ** 1.5)) - LABEL_GAP, 0.5, 1, [0, -1], { color: INK }));
	L.push(await S.clear('1/(1 + s^2)', P.X(-1.6), P.Y(best(10 ** -1.6)) - LABEL_GAP, 0, 1, [0, -1], { color: ACCENT }));
	const lTwo = cross(of(naive), 2, -1, 0);
	L.push(await S.clear('1/s^2', P.X(lTwo) + LABEL_GAP + 1, P.Y(2), 0, 0.5, [1, 0], { color: ACCENT2 }));

	S.checkAll(L);
	window.tutWienerWeight = { weights: MARKS.map(weight), ends: [lH, lB, lN, lTop].map((l) => 10 ** l) };
	return finish(S, L, [240, 340]);
}
