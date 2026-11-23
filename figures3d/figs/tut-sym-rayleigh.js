// The tutorial, chapter 3.4 (tutorial/noise/symmetric-matrices.md), its third diagram: the Rayleigh quotient of a
// symmetric matrix as a probe turns. Top, the unit circle and the matrix T = Q diag(-2, 1) Q^T, Q a turn by 30
// degrees: its eigen-axes, the line at 30 degrees with the eigenvalue -2 (orange, as the paper colours a stretch) and
// the line at 120 degrees with the eigenvalue 1 (blue, a squeeze), and a unit probe x at the angle theta = 100
// degrees from the horizontal, with T x and its shadow on the probe's line, x^T T x = R_T(x) = 0.65. Below, R_T
// against the probe's angle from 0 to 180 degrees, -1/2 - (3/2) cos 2(theta - 30 degrees), a cosine wave between -2
// and 1: its minimum at 30 degrees and its maximum at 120 degrees (the eigen-axes, dots in their colours), the dashed
// lines at the two eigenvalues, and the probe's own value (a dot in ink at 100 degrees).
// Exact: the matrix and its eigen-axes (asserted), T x and its shadow (asserted to be x^T T x), the curve (sampled
// every quarter of a point and asserted against x^T T x at every sample), its extremes (asserted at 30 and 120 degrees,
// -2 and 1). The chart's two axes have different scales, chosen for the drawing; nothing else is schematic.
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, HAIR, VEC, VEC_HEAD, RIGHT } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, INK, DIM, ACCENT, ACCENT2, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';

const name = 'tut-sym-rayleigh';
const check = checker(name);

export const TURN = 30;          // degrees: Q
export const EIG = [-2, 1];      // the eigenvalues along Q's first and second columns
export const PROBE = 100;        // degrees: the probe drawn
const R = 38;                    // the circle's radius, points
const REACH = 1.32;              // the eigen-axes' half-length, units of R
const ARC = 0.3;                 // the arc of theta, units of R
const W = 250, H = 84;           // the chart
const Y = [-2.35, 1.35];         // the chart's values
const GAP = 26;                  // from the circle's drawing to the chart's top
const DASH = [2.2, 1.6];
const DOTR = 1.25;

const rad = (d) => (d * Math.PI) / 180;
const unit = (d) => [Math.cos(rad(d)), Math.sin(rad(d))];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

export default async function () {
	// ---- the matrix: T = sum lambda_i u_i u_i^T
	const u = [unit(TURN), unit(TURN + 90)];
	const T = [[0, 0], [0, 0]];
	for (let i = 0; i < 2; i++) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) T[a][b] += EIG[i] * u[i][a] * u[i][b];
	check(near(T[0][1], T[1][0], 1e-15), 'T is not symmetric');
	const Tx = (x) => [T[0][0] * x[0] + T[0][1] * x[1], T[1][0] * x[0] + T[1][1] * x[1]];
	u.forEach((v, i) => { const w = Tx(v); check(near(w[0], EIG[i] * v[0], 1e-12) && near(w[1], EIG[i] * v[1], 1e-12), `u${i} is not an eigenvector`); });
	const RT = (deg) => { const x = unit(deg); return dot(x, Tx(x)); };
	const closed = (deg) => -0.5 - 1.5 * Math.cos(2 * rad(deg - TURN));
	for (let d = 0; d <= 180; d += 0.5) check(near(RT(d), closed(d), 1e-12), `R_T at ${d} is not the cosine wave`);
	// the extremes, on a fine grid
	let lo = 0, hi = 0;
	for (let d = 0; d <= 180; d += 0.01) { if (RT(d) < RT(lo)) lo = d; if (RT(d) > RT(hi)) hi = d; }
	check(near(lo, 30, 0.011) && near(hi, 120, 0.011) && near(RT(30), -2, 1e-12) && near(RT(120), 1, 1e-12), `the extremes: ${lo}, ${hi}`);
	const value = RT(PROBE);
	check(value.toFixed(2) === '0.65', `R_T at the probe is ${value}`);

	const S = new Sheet(name);
	const L = [];
	const C = [ORIGIN, ORIGIN - (R * REACH + GAP + H) / 2];
	const at = ([x, y], c = C) => [c[0] + R * x, c[1] - R * y];

	// ---- the circle, the eigen-axes and the horizontal from which theta is counted
	const circle = Array.from({ length: 1441 }, (_, k) => at(unit(k / 4)));
	S.path(circle, { color: DIM, width: AXIS, layer: 1, closed: true, what: 'the circle' });
	const colors = [ACCENT, ACCENT2];
	u.forEach((v, i) => S.path([at([-REACH * v[0], -REACH * v[1]]), at([REACH * v[0], REACH * v[1]])], { color: colors[i], width: 0.55, layer: 1.2, cap: 'butt', what: `the axis ${i}` }));
	S.path([at([0, 0]), at([REACH, 0])], { color: DIM, width: HAIR, layer: 1.1, cap: 'butt', what: 'the horizontal' });

	// ---- the probe, T x, and the shadow of T x on the probe's line
	const x = unit(PROBE), y = Tx(x);
	const foot = [value * x[0], value * x[1]];
	check(near(dot([y[0] - foot[0], y[1] - foot[1]], x), 0, 1e-12), 'the drop is not at right angles to the probe');
	S.arrow(at([0, 0]), at(y), { color: DIM, width: 0.55, head: 3.6, layer: 2, what: 'T x' });
	S.arrow(at([0, 0]), at(x), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the probe' });
	S.dots(at(y), at(foot), { color: DIM, clear0: 1.2, clear1: 1.0, layer: 1.5, what: 'the drop' });
	// the right angle at the foot, between the probe's line (back toward the centre) and the drop
	const back = [-x[0], -x[1]], side = [(y[0] - foot[0]), (y[1] - foot[1])];
	const sl = Math.hypot(...side), s1 = [side[0] / sl, side[1] / sl], k = RIGHT / R;
	S.path([at([foot[0] + k * s1[0], foot[1] + k * s1[1]]), at([foot[0] + k * (s1[0] + back[0]), foot[1] + k * (s1[1] + back[1])]), at([foot[0] + k * back[0], foot[1] + k * back[1]])], { color: DIM, width: HAIR, layer: 1.5, cap: 'butt', what: 'the right angle' });
	// the arc of theta
	const arc = Array.from({ length: 401 }, (_, j) => at([ARC * Math.cos(rad((PROBE * j) / 400)), ARC * Math.sin(rad((PROBE * j) / 400))]));
	S.path(arc, { color: DIM, width: HAIR, layer: 1.5, what: 'the arc' });
	S.raw(`<circle cx="${at([0, 0])[0]}" cy="${at([0, 0])[1]}" r="0.9" fill="${INK}"/>`, 4);

	// ---- labels on the circle
	L.push(await S.clear('\\vartheta', ...at([1.25 * ARC * Math.cos(rad(PROBE / 2)), 1.25 * ARC * Math.sin(rad(PROBE / 2))]), 0, 1, [0.7, -0.7], { color: DIM }));
	L.push(await S.clear('\\mathbf x', ...at([x[0] * 1.02, x[1] * 1.02]), 1, 1, [-1, 0], { color: INK }));
	L.push(await S.clear('T\\mathbf x', ...at(y), 1, 1, [0, -1], { color: DIM }));
	for (const [i, v] of u.entries()) {
		const end = at([REACH * v[0], REACH * v[1]]);
		L.push(await S.clear(`${EIG[i] < 0 ? '-' : ''}${Math.abs(EIG[i])}`, end[0] + 2.2 * v[0], end[1] - 2.2 * v[1], v[0] > 0 ? 0 : 1, v[1] > 0 ? 1 : 0, [v[0], -v[1]], { color: colors[i] }));
	}

	// ---- the chart
	const top = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b)) + GAP;
	const P = new Plot({ left: ORIGIN - W / 2, top, w: W, h: H, x0: 0, x1: 180, y0: Y[0], y1: Y[1] });
	// the dashed lines at the eigenvalues, broken where the curve comes within GAP_LINE points of them
	const near2 = 1.4;
	for (const [i, e] of EIG.entries()) {
		const runs = [];
		let run = null;
		for (let d = 0; d <= 180.0001; d += 0.05) {
			const ok = Math.abs(P.Y(RT(d)) - P.Y(e)) > near2;
			if (ok && !run) run = [d, d];
			if (ok) run[1] = d;
			if (!ok && run) { runs.push(run); run = null; }
		}
		if (run) runs.push(run);
		for (const [a, b] of runs) S.path([P.at(a, e), P.at(b, e)], { color: colors[i], width: 0.5, dash: DASH, layer: 1.2, cap: 'butt', what: `the line at ${e}` });
	}
	const pts = graph(P, RT, 0, 180);
	check(longest(pts) <= 0.2501, `the curve has a step of ${longest(pts)} pt`);
	S.path(pts, { color: INK, width: 0.6, layer: 2, what: 'the curve' });
	const mark = (d, color, what) => { const [px, py] = P.at(d, RT(d)); S.raw(`<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${DOTR}" fill="${color}"/>`, 3); S.mark([[px, py]], DOTR, what); };
	mark(30, ACCENT, 'the minimum');
	mark(120, ACCENT2, 'the maximum');
	mark(PROBE, INK, 'the probe\'s value');
	L.push(...await xAxis(S, P, { ticks: [0, 30, 60, 90, 120, 150, 180], fmt: (t) => `${t}^\\circ`, y: P.bottom + 3, what: 'the angle axis' }));
	L.push(...await yAxis(S, P, { ticks: [-2, -1, 0, 1], fmt: (t) => (t < 0 ? `-${-t}` : `${t}`), x: P.left - 3, what: 'the R axis' }));
	L.push(await placed('R_T', P.left - 3, P.top - LABEL_GAP - 1, 0.5, 1, DIM));
	const l180 = L.find((l) => l.src === '180^\\circ');
	L.push(await placed('\\vartheta', l180.box.r + 4, (l180.box.t + l180.box.b) / 2, 0, 0.5, DIM));

	S.checkAll(L);
	window.tutSymRayleigh = { T, value, lo, hi };
	return finish(S, L, [240, 340]);
}
