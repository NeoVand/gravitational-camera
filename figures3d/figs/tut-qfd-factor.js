// The tutorial, chapter 8.7 (tutorial/quantum/quantum-fluctuation.md), its first diagram: the quantum factor of the
// fluctuation-dissipation theorem. One panel on logarithmic axes: across, hbar omega / k_B T from 10^-2 to 10^2; up,
// the quantum tremor over the classical, u coth u with u = hbar omega / 2 k_B T. One thick ink curve, flat at 1 on
// the left (1.000008 at 10^-2, 1.0008 at 0.1, 1.082 at 1), turning near 2, where the classical line 1 and the zero
// point u cross, and joining the zero point beyond (5.0 at 10, 50 at 100); the classical line, thin grey, and the zero
// point, thin dashed grey. Silicon's Raman line at 300 K is an ink dot on the curve at 2.50, ratio 1.47; the steel
// ball's ringing at 300 K, at 2.4 x 10^-9, far off the axis, is an arrow pointing left at the curve's height, its
// value in its label. Ink and greys only.
// Departures from the diagram's comment: the axis up runs from 0.4, not 0.8, so that the empty band under the
// classical line, which the factor never enters, holds the steel ball's arrow and label and the classical line's
// name; the ball has an arrow but no dot, since its point lies off the axis; the curves' names sit beside them.
// Exact: the curve, from u coth u (asserted against hbar coth(hbar omega / 2 k_B T) / (2 k_B T / omega) in SI, and at
// the five values the comment gives, in tut-qfd-lib.js), the two lines, silicon's point and the ball's value.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, factor, zeroPoint, ballX, siliconX } from './tut-qfd-lib.js';

const name = 'tut-qfd-factor';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = -2, X1 = 2, Y0 = lg(0.4), Y1 = lg(60);
const DX = 70, DY = 72;                  // points per decade
const CURVE_W = 1.1, THIN = 0.5, DOT = 1.7, DASH = [3, 2];
const ARROW_LEN = 24;                    // the ball's arrow

export default async function () {
	const { bx, sx } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const f = (x) => lg(factor(10 ** x));
	check(f(X1) < Y1 && f(X0) > Y0, 'the curve leaves the panel');

	// ---- the axes
	const pow = (k) => (k === 0 ? '1' : k === 1 ? '10' : `10^{${k}}`);
	const xl = await xAxis(S, P, { ticks: [-2, -1, 0, 1, 2], fmt: pow, what: 'the axis across' });
	L.push(...xl);
	const yt = [0.5, 1, 2, 5, 10, 20, 50];
	L.push(...(await yAxis(S, P, { ticks: yt.map(lg), fmt: (t) => String(yt.find((v) => near(lg(v), t, 1e-12))), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('\\hbar\\omega/k_BT', P.X(0), below + 4, 0.5, 0, DIM));
	L.push(await placed('\\text{quantum} \\div \\text{classical}', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the classical line and the zero point, thin grey, under the curve
	const one = P.Y(0);
	S.path([[P.left, one], [P.right, one]], { color: FAINT, width: THIN, layer: 1.5, cap: 'butt', what: 'the classical line' });
	const zp = [P.at(lg(2 * 10 ** Y0), Y0), P.at(X1, lg(zeroPoint(10 ** X1)))];
	check(near(zeroPoint(2 * 10 ** Y0), 10 ** Y0, 1e-12), 'the zero point does not start on the axis');
	S.path(zp, { color: FAINT, width: THIN, layer: 1.6, dash: DASH, cap: 'butt', what: 'the zero point' });

	// ---- the curve, thick ink
	const pts = graph(P, f, X0, X1);
	check(longest(pts) <= 0.2501, `the curve has a step of ${longest(pts)} pt`);
	S.path(pts, { color: INK, width: CURVE_W, layer: 2, what: 'u coth u' });
	// it lies on the classical line at the left and on the zero point at the right, within a fifth of its width
	check(Math.abs(P.Y(f(X0)) - one) < 0.001 && Math.abs(P.Y(f(-1)) - one) < 0.03, 'the curve is not flat at 1 on the left');
	check(Math.abs(P.Y(f(1)) - P.Y(lg(zeroPoint(10)))) < 0.02 && Math.abs(P.Y(f(X1)) - P.Y(lg(zeroPoint(100)))) < 1e-9, 'the curve does not join the zero point');

	// ---- silicon's Raman line: a dot on the curve, its name up and to the left, where the panel is empty
	const si = P.at(lg(sx), f(lg(sx)));
	check(near(factor(sx), 10 ** f(lg(sx)), 1e-12) && factor(sx).toFixed(2) === '1.47', 'silicon\'s dot is not at 1.47');
	S.raw(`<circle cx="${n2(si[0])}" cy="${n2(si[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([si], DOT, 'silicon\'s dot');
	L.push(await S.clear('\\text{silicon\'s Raman line at 300 K}', si[0] - DOT - LABEL_GAP, si[1] - DOT - LABEL_GAP, 1, 1, [-Math.SQRT1_2, -Math.SQRT1_2]));

	// ---- the steel ball: off the axis to the left, an arrow under the classical line, its label under the arrow
	check(lg(bx) < X0 - 6 && near(factor(bx), 1, 1e-15), `the ball at ${bx} is not far left of the axis at ratio 1`);
	const ball1 = await placed('\\text{steel ball, 15.1 kHz at 300 K}', P.left + LABEL_GAP + 1.2 + ARROW_LEN + LABEL_GAP + 0.8, one + LABEL_GAP + 1.2, 0, 0, INK);
	const ay = (ball1.box.t + ball1.box.b) / 2, ax = P.left + LABEL_GAP + 1.2;
	S.arrow([ax + ARROW_LEN, ay], [ax, ay], { color: INK, width: 0.6, head: 4.2, what: 'the ball\'s arrow' });
	L.push(ball1);
	L.push(await placed('\\hbar\\omega/k_BT = 2.4\\times10^{-9}', ax, ball1.box.b + 3.2, 0, 0, INK));

	// ---- the lines' names: the classical line's under it at the right, the zero point's under it at the right
	L.push(await placed('\\text{classical, } 2k_BT/\\omega', P.right, one + LABEL_GAP + 1.2, 1, 0, DIM));
	{
		const nrm = [DY, DX].map((v) => v / Math.hypot(DX, DY));   // away from the line, down and to the right
		const q = P.at(1.05, lg(zeroPoint(10 ** 1.05)));
		L.push(await S.clear('\\text{zero point, } \\hbar\\omega/2k_BT', q[0], q[1], 0, 0, nrm, { color: DIM }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ball: bx, silicon: sx, ratio: factor(sx) };
	return finish(S, L, [260, 340]);
}
