// The tutorial, section 8.7 (tutorial/quantum/quantum-fluctuation.md), its third diagram: the static jitter between
// its two bounds. A body of five undamped modes at omega_1, 2, 4, 8 and 16 omega_1, each holding a fifth of chi_0
// (c_n^2 = 0.2 chi_0 omega_n^2), so that sqrt(A / chi_0) = 8.26 omega_1. One panel on logarithmic axes: across,
// k_B T / hbar omega_1 from 0.1 to 100; up, the jitter in units of hbar omega_1 chi_0 from 0.1 to 200. The lower bound
// k_B T chi_0, a thin grey line of slope 1; the upper bound (1/2) hbar sqrt(A chi_0) coth(hbar sqrt(A / chi_0) / 2 k_B T),
// thin dashed ink, flat at 4.13 on the left and joining the grey line on the right; the true jitter
// (1/2) hbar sum c_n^2 / omega_n coth(hbar omega_n / 2 k_B T), thick ink, flat at 3.10 on the left (0.75 of the upper
// bound), 3.29 at k_B T = hbar omega_1, 4.45 at 3, 10.55 at 10 and 100.06 at 100 hbar omega_1, always between the two.
// Ink and greys only.
// Departures from the diagram's comment: the label beside the thick curve's flat part reads "five modes, zero point", so that it also names the curve; the axis up is numbered from 1, since its 0.1 would touch the 0.1 across at
// the corner.
// Exact: the three curves (tut-qfd-lib.js asserts that the jitter is the average of (1/2) chi_0 omega coth over the
// weight mu, that it lies between the bounds at 600 temperatures, and the values above).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, jitter, lower, upper, RMS, JITTER_AT } from './tut-qfd-lib.js';

const name = 'tut-qfd-bounds';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = -1, X1 = 2, Y0 = -1, Y1 = lg(200);
const DX = 86, DY = 52;                  // points per decade
const THICK = 1.1, THIN = 0.5, DASHED = 0.6, DASH = [3, 2];

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const J = (x) => lg(jitter(10 ** x)), U = (x) => lg(upper(10 ** x));
	check(J(X1) < Y1 && U(X1) < Y1 && lg(lower(10 ** X0)) >= Y0 - 1e-12, 'a curve leaves the panel');

	// ---- the axes
	const num = (k) => (k === -1 ? '0.1' : String(10 ** k));
	const xl = await xAxis(S, P, { ticks: [-1, 0, 1, 2], fmt: num, what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-1, 0, 1, 2], fmt: (k) => (k === -1 ? null : num(k)), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('k_BT/\\hbar\\omega_1', P.X((X0 + X1) / 2), below + 4, 0.5, 0, DIM));
	L.push(await placed('\\text{jitter}\\ \\ (\\hbar\\omega_1\\chi_0)', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the three curves: the lower bound, grey; the upper, dashed; the jitter, thick, on top
	S.path([P.at(X0, X0), P.at(X1, X1)], { color: FAINT, width: THIN, layer: 1.5, cap: 'butt', what: 'the lower bound' });
	const up = graph(P, U, X0, X1), jit = graph(P, J, X0, X1);
	for (const [pts, what] of [[up, 'the upper bound'], [jit, 'the jitter']]) check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
	S.path(up, { color: INK, width: DASHED, layer: 1.8, dash: DASH, cap: 'butt', what: 'the upper bound' });
	S.path(jit, { color: INK, width: THICK, layer: 2, what: 'the jitter' });
	// the shapes the caption names: flat at the left, meeting at the right
	check(Math.abs(P.Y(J(X0)) - P.Y(lg(jitter(0)))) < 0.01 && Math.abs(P.Y(U(X0)) - P.Y(lg(upper(0)))) < 0.01, 'the curves are not flat at the left');
	check(Math.abs(P.Y(J(X1)) - P.Y(X1)) < 0.05 && Math.abs(P.Y(U(X1)) - P.Y(X1)) < 0.05, 'the three do not meet at the right');
	check(P.Y(lg(jitter(0))) - P.Y(lg(upper(0))) > 5, 'the flat parts are not apart');
	check(upper(0).toFixed(2) === '4.13' && jitter(0).toFixed(2) === '3.10' && RMS.toFixed(2) === '8.26' && JITTER_AT.length === 5, 'the flat values');

	// ---- the names: the upper bound's over its flat part, the jitter's under its own, the lower bound's under it
	const x0 = P.X(X0) + 6;
	L.push(await S.clear('\\text{one mode at } \\sqrt{A/\\chi_0}', x0, P.Y(lg(upper(0))) - LABEL_GAP - 1, 0, 1, [0, -1]));
	L.push(await S.clear('\\text{five modes, zero point}', x0, P.Y(lg(jitter(0))) + LABEL_GAP + 1.5, 0, 0, [0, 1]));
	{
		const nrm = [DY, DX].map((v) => v / Math.hypot(DX, DY));   // away from the line, down and to the right
		const q = P.at(-0.45, -0.45);
		L.push(await S.clear('\\text{classical, } k_BT\\chi_0', q[0], q[1], 0, 0, nrm, { color: DIM }));
	}
	check(near(lower(7), 7, 1e-15), 'the lower bound is not k_B T chi_0');

	S.checkAll(L);
	window[name + '-numbers'] = { rms: RMS, zero: [jitter(0), upper(0)], at: JITTER_AT.map(([t]) => jitter(t)) };
	return finish(S, L, [260, 340]);
}
