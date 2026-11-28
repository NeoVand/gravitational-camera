// The tutorial, section 13.7 (tutorial/what-a-field-keeps/thermometer.md), its third diagram: the positivity test. One
// panel: across, a from 0 to 9 r_s^2 (ticks every 1); up, the test m_3 - 2a m_2 + a^2 m_1 in r_s^6 from -3 to 14 (ticks
// -2, 0, 2, ..., 14). The region below zero a pale tint of matter's colour, named "no positive mass" at its lower left,
// its edge a thin line at zero. Three exact parabolas: the hole's, from its sums (m_1, m_2, m_3 = R_2^2, R_3^4, R_4^6
// from the unrounded radii), solid ink, its least value, -2.04 at a = 4.335, a dot; the uniform ball with the hole's mass
// and m_1, radius 1.3135 r_s, solid grey, least +0.1398 at a = 1.2324, nowhere below zero; the step absorber with
// b = b_c (its unrounded radii 0.66826, 1.22608, 1.45907 r_s), ink dashed, least -1.787 at a = 5.060, a dot. Each curve
// stops where it leaves the top; the ball is named beside its right branch, low enough to stand apart from the axis's
// name, the hole beside its right branch and the step absorber at its right end.
// Departures from the diagram's comment: the region below zero is a pale tint of matter's colour, not the paper's pale
// blue, since it is where the mass would have to be negative and blue means a squeeze in the tutorial's figures; the
// hole's parabola is ink, not orange, told from the step absorber's by its weight and stroke; the axis up starts at
// -3.4, so that the least values' labels fit under their dots; the step absorber's dip carries a dot as the hole's
// does, so that its label has a mark to name; the least values are printed to three figures, as the chapter prints the
// hole's; the axis up is drawn at 13 points a unit, so that the ball's least, 0.14, stands clear of the zero line.
// Exact: the three parabolas, their least values and where they are (tut-thermo-lib.js asserts them against the
// chapter's m_1, m_2, m_3, -2.04 and 4.335, its 45/49 and 1.185, and the comment's -1.787 at 5.060 and +0.1398 at
// 1.2324).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, AXIS, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, MATTER, HOLE_M, STEP_M, BALL_M, BALL_R, test, least, roots } from './tut-thermo-lib.js';

const name = 'tut-hankel-test';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const A0 = 0, A1 = 9, Y0 = -3.4, Y1 = 14;
const DX = 25, DY = 13;                         // points per unit
const HEAVY = 0.75, CURVE = 0.55, DASH = [3, 2], DOT_R = 1.45;
const VEIL = 0.16;                              // the region's opacity
const caption = 'Look first at the two dips into the shaded region: the hole\'s sums and the step absorber\'s fall below zero, which no positive mass can do; the ball\'s curve stays above. Curves exact, from the unrounded radii.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'hankel-test', caption);
	const S = new Sheet(name);
	const L = [];
	const W = (A1 - A0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: A0, x1: A1, y0: Y0, y1: Y1 });

	// ---- the region below zero, and its edge
	{
		const t = P.Y(0), b = P.bottom, l = P.X(A0), r = P.X(A1);
		S.raw(`<rect x="${n2(l)}" y="${n2(t)}" width="${n2(r - l)}" height="${n2(b - t)}" fill="${MATTER}" fill-opacity="${VEIL}"/>`, 0.2);
		S.path([[l, t], [r, t]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the zero line' });
	}

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-2, 0, 2, 4, 6, 8, 10, 12, 14], fmt: (t) => (t < 0 ? `−${-t}` : String(t)), what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('a\\ \\ \\text{(units of }r_s^2\\text{)}', P.X(4.5), below + 4, 0.5, 0, DIM));
	L.push(await placed('m_3 - 2am_2 + a^2m_1\\ \\ \\text{(units of }r_s^6\\text{)}', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the parabolas, each drawn where it lies in the panel
	const curve = (m) => {
		const pts = [];
		for (let k = 0; k <= 900; k++) {
			const a = A0 + ((A1 - A0) * k) / 900, v = test(m, a);
			if (v <= Y1) pts.push(P.at(a, v));
		}
		return pts;
	};
	// where a parabola meets the top, in [A0, A1]
	const tops = (m) => {
		const d = Math.sqrt(m[1] * m[1] - m[0] * (m[2] - Y1));
		return [(m[1] - d) / m[0], (m[1] + d) / m[0]].filter((a) => a > A0 && a < A1);
	};
	const pieces = (m) => {
		// split where the curve leaves the panel, so that no stroke runs along the top
		const ts = tops(m), out = [];
		let cur = [];
		for (let k = 0; k <= 900; k++) {
			const a = A0 + ((A1 - A0) * k) / 900, v = test(m, a);
			if (v <= Y1) cur.push(P.at(a, v));
			else if (cur.length) { out.push(cur); cur = []; }
		}
		if (cur.length) out.push(cur);
		return { ts, out };
	};
	const hole = pieces(HOLE_M), ball = pieces(BALL_M), step = pieces(STEP_M);
	for (const [k, pts] of hole.out.entries()) S.path(pts, { color: INK, width: HEAVY, layer: 2.2, what: `the hole's parabola ${k}` });
	for (const [k, pts] of ball.out.entries()) S.path(pts, { color: DIM, width: CURVE, layer: 2, what: `the ball's parabola ${k}` });
	for (const [k, pts] of step.out.entries()) S.path(pts, { color: INK, width: CURVE, dash: DASH, cap: 'butt', layer: 2.1, what: `the step's parabola ${k}` });
	check(curve(STEP_M).length === 901, 'the step absorber\'s parabola leaves the panel');
	check(hole.ts.length === 2 && ball.ts.length === 1, 'where the parabolas leave the top');

	// ---- the least values
	const h = least(HOLE_M), s = least(STEP_M), b = least(BALL_M);
	check(h.value < 0 && s.value < 0 && b.value > 0 && h.value > Y0 && s.value > Y0, 'the least values');
	check(Math.min(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((a) => test(BALL_M, a))) >= b.value - 1e-12, 'the ball\'s least');
	check((P.Y(0) - P.Y(b.value)) - (CURVE + AXIS) / 2 > 1.2, 'the ball\'s curve touches the zero line');
	const fmt = (v) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(2);
	for (const [m, side, what] of [[h, 1, 'the hole'], [s, 0, 'the step absorber']]) {
		const q = P.at(m.a, m.value);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT_R}" fill="${INK}"/>`, 3);
		S.mark([q], DOT_R, `${what}'s least`);
		const lab = await placed(fmt(m.value), q[0] + (side ? 1 : -1) * 1.2, q[1] + DOT_R + LABEL_GAP + 0.3, side, 0, INK);
		check(lab.box.b < P.bottom - 1, `${what}'s least value's label leaves the panel`);
		L.push(lab);
	}
	check(fmt(h.value) === '−2.04' && fmt(s.value) === '−1.79', 'the printed least values');
	check(roots(HOLE_M)[0] > 2.9 && roots(STEP_M)[0] > 3, 'the dips start right of the region\'s name');

	// ---- the region's name, at its lower left
	L.push(await placed('\\text{no positive mass}', P.X(0.3), P.Y(-1.7), 0, 0.5, INK));

	// ---- the curves' names, at their ends: above the top where they leave it, the step absorber's at its right end
	{
		// the ball's, beside its right branch, well under the axis's name
		const y = 8.5, a = (BALL_M[1] + Math.sqrt(BALL_M[1] ** 2 - BALL_M[0] * (BALL_M[2] - y))) / BALL_M[0];
		check(Math.abs(test(BALL_M, a) - y) < 1e-9, 'the ball\'s name is not at its curve');
		L.push(await S.clear(`\\begin{array}{l}\\text{uniform ball,}\\\\ R = ${BALL_R.toFixed(2)}\\,r_s\\end{array}`, P.X(a), P.Y(y), 0, 0.5, [1, 0], { color: DIM }));
	}
	{
		const y = 11, a = (HOLE_M[1] + Math.sqrt(HOLE_M[1] ** 2 - HOLE_M[0] * (HOLE_M[2] - y))) / HOLE_M[0];
		L.push(await S.clear('\\text{hole}', P.X(a), P.Y(y), 0, 0.5, [1, 0]));
	}
	{
		const q = P.at(A1, test(STEP_M, A1));
		L.push(await placed('\\begin{array}{l}\\text{step absorber,}\\\\ b = b_c\\end{array}', q[0] + 4, q[1], 0, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { hole: h, step: s, ball: b, ballR: BALL_R, m: { hole: HOLE_M, step: STEP_M, ball: BALL_M } };
	return finish(S, L, [260, 340]);
}
