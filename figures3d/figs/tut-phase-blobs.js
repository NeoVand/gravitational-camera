// The tutorial, chapter 8.5 (tutorial/quantum/counting-quanta.md), its third diagram: four states on chapter 8.3's
// phase plane, in the scaled axes x / x_zp across and p / m omega x_zp up (thin grey axes, a tick at each whole number),
// each drawn as its one-standard-deviation contour: the zero point, a circle of radius 1 at the origin, filled light
// grey, with a thin dashed edge, since the squeezed vacuum is drawn over it; a coherent state, the same filled circle
// centred at (3, 2), with a thin ink edge; the squeezed vacuum at r = 0.6, an ellipse at the origin with the semi-axes
// e^{-0.6} = 0.55 along x and e^{0.6} = 1.82 along p, filled light grey, with a thin ink edge; and a thermal state with
// nbar = 1.5, a circle of radius sqrt(2 nbar + 1) = 2 at the origin, unfilled, with a dotted edge. Labels beside the
// shapes, off them; "same area" once, by the ellipse. Ink and the page's greys only; no orange or blue (blue is the
// tidal squeeze).
// Departures from the diagram's comment: as in chapter 8.3's tut-phase-rings, the axes run along the drawing's left and
// bottom edges, not through its centre, so that their numbers stay off the shapes (the ticks at +-2 would fall on the
// thermal circle), and they span only the drawn shapes, -3 to 4.5 across and -2.5 to 3.5 up, with a tick at each whole
// number (not 8.3's -4.6 to 4.6 with ticks at +-2 and +-4), so that the shapes are drawn larger on a phone. The ellipse
// is labelled too ("squeezed vacuum", which the comment leaves unnamed), with "same area" under it. The zero point and
// the ellipse are labelled at the right and above, each on a thin leader from a small dot inside its shape, since the
// shapes at the centre leave no room for a label beside them; the fills are translucent, so that where the ellipse lies
// over the zero point's disc the grey is darker and both outlines stay whole.
// Exact: every contour (radius 1; semi-axes e^{-+0.6}, built in tut-counting-lib.js from S|0> in the levels and
// checked against e^{-+r}, with product 1, the zero point's area; radius 2 from the thermal law's <(a + a^dagger)^2> =
// 2 nbar + 1), on one scale in both directions. Chosen for clarity: the coherent state's centre (3, 2), as the caption
// says; the leaders.
import { Sheet, ORIGIN, finish, checker, placed, DOT, DOT_STEP, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, palette, near, R_SQ, N_THERMAL, COHERENT, thermalSpread } from './tut-counting-lib.js';

const name = 'tut-phase-blobs';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const U = 28;                            // points per scaled unit, on both axes
const U0 = -3, U1 = 4.5, W0 = -2.5, W1 = 3.5;   // the plane drawn: u across, w up
const EDGE = 0.55;                       // a contour's stroke
const FILL = 0.42;                       // the fills' opacity of the rule's grey
const DASH = [2.2, 1.4];
const ANCHOR = 0.8;                      // a leader's dot

export default async function () {
	const { squeezed } = await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - ((U1 - U0) * U) / 2, top: ORIGIN - ((W1 - W0) * U) / 2, w: (U1 - U0) * U, h: (W1 - W0) * U, x0: U0, x1: U1, y0: W0, y1: W1 });
	check(near(P.X(1) - P.X(0), P.Y(0) - P.Y(1), 1e-12), 'the two axes have different scales');
	const su = Math.sqrt(squeezed.uu), sw = Math.sqrt(squeezed.ww), rt = thermalSpread(N_THERMAL);
	check(near(su, Math.exp(-R_SQ), 1e-10) && near(sw, Math.exp(R_SQ), 1e-10) && near(su * sw, 1, 1e-10) && rt === 2, 'the contours\' sizes');
	// an ellipse's points, a quarter of a point apart, for the marks the labels are checked against
	const ring = (c, a, b) => {
		const n = Math.max(64, Math.ceil((2 * Math.PI * Math.max(a, b) * U) / 0.25));
		const pts = Array.from({ length: n + 1 }, (_, i) => P.at(c[0] + a * Math.cos((2 * Math.PI * i) / n), c[1] + b * Math.sin((2 * Math.PI * i) / n)));
		check(longest(pts) <= 0.2501, `a contour has a step of ${longest(pts)} pt`);
		return pts;
	};
	const ellipse = (c, a, b, attrs, layer, what) => {
		const q = P.at(...c);
		S.raw(`<ellipse cx="${n2(q[0])}" cy="${n2(q[1])}" rx="${n2(a * U)}" ry="${n2(b * U)}" ${attrs}/>`, layer);
		S.mark(ring(c, a, b), EDGE / 2, what);
	};
	const fill = `fill="${RULE}" fill-opacity="${FILL}"`;
	// ---- the zero point, under the ellipse: filled, dashed edge
	ellipse([0, 0], 1, 1, `${fill} stroke="${INK}" stroke-width="${EDGE}" stroke-dasharray="${DASH.join(' ')}"`, 1, 'the zero point');
	// ---- the squeezed vacuum over it
	ellipse([0, 0], su, sw, `${fill} stroke="${INK}" stroke-width="${EDGE}"`, 2, 'the squeezed vacuum');
	// ---- the coherent state
	ellipse(COHERENT, 1, 1, `${fill} stroke="${INK}" stroke-width="${EDGE}"`, 2, 'the coherent state');
	check(Math.hypot(...COHERENT) - 1 > rt + 0.5, 'the coherent state touches the thermal circle');
	// ---- the thermal state: no fill, a dotted edge (round dots, as tut-pot-lib's dotted lines)
	{
		const q = P.at(0, 0), r = rt * U, n = Math.round((2 * Math.PI * r) / DOT_STEP);
		const pts = Array.from({ length: n }, (_, i) => [q[0] + r * Math.cos((2 * Math.PI * i) / n), q[1] - r * Math.sin((2 * Math.PI * i) / n)]);
		S.raw(`<path d="${pts.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${INK}" stroke-width="${DOT + 0.15}" stroke-linecap="round" fill="none"/>`, 2);
		S.mark(ring([0, 0], rt, rt), (DOT + 0.15) / 2, 'the thermal state');
		check(rt - sw > 0.1, 'the ellipse touches the thermal circle');
	}

	// ---- the axes, along the left and bottom edges (chapter 8.3's)
	const whole = (a, b) => Array.from({ length: Math.floor(b) - Math.ceil(a) + 1 }, (_, i) => Math.ceil(a) + i), fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	// the shapes inside the plane drawn: the thermal circle and the coherent state, with a quarter unit to spare
	check(-rt - 0.25 >= U0 && -rt - 0.25 >= W0 && COHERENT[0] + 1 + 0.25 <= U1 && Math.max(COHERENT[1] + 1, sw) + 0.25 <= W1, 'a shape leaves the plane');
	L.push(...(await xAxis(S, P, { ticks: whole(U0, U1), fmt, y: P.Y(W0), what: 'the u axis' })));
	L.push(...(await yAxis(S, P, { ticks: whole(W0, W1), fmt, x: P.X(U0), what: 'the w axis' })));
	L.push(await placed('x/x_{\\rm zp}', P.right + LABEL_GAP + 0.6, P.bottom, 0, 0.5, DIM));
	L.push(await placed('p/(m\\omega x_{\\rm zp})', P.left, P.top - LABEL_GAP - 0.6, 0.5, 1, DIM));

	// ---- the labels
	const dot = (q, what) => {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${ANCHOR}" fill="${INK}"/>`, 3);
		S.mark([q], ANCHOR, what);
	};
	// the coherent state's, at its right
	L.push(await placed('\\text{coherent}', P.X(COHERENT[0] + 1) + LABEL_GAP + 0.8, P.Y(COHERENT[1]), 0, 0.5, INK));
	// the thermal state's, beside its lower right
	{
		const t = -Math.PI / 4, q = P.at(rt * Math.cos(t), rt * Math.sin(t));
		L.push(await S.clear('\\text{thermal}', q[0] + 2, q[1] + 2, 0, 0, [Math.SQRT1_2, Math.SQRT1_2]));
	}
	// the zero point's: from a dot in its disc outside the ellipse, rightward past the thermal circle
	{
		const u0 = (1 + su) / 2, w0 = 0.1, q = P.at(u0, w0), end = P.at(rt + 0.3, w0);
		check(Math.hypot(u0, w0) < 1 && (u0 / su) ** 2 + (w0 / sw) ** 2 > 1, 'the zero point\'s dot is not in its lune');
		S.path([q, end], { color: DIM, width: 0.4, layer: 2.5, cap: 'butt', what: 'the zero point\'s leader' });
		dot(q, 'the zero point\'s dot');
		L.push(await placed('\\text{zero point}', end[0] + LABEL_GAP + 0.3, end[1], 0, 0.5, INK));
	}
	// the squeezed vacuum's: from a dot in the ellipse above the disc, up past the thermal circle
	{
		const u0 = -0.15, w0 = (1 + Math.sqrt(sw * sw * (1 - (u0 / su) ** 2))) / 2, q = P.at(u0, w0), end = P.at(u0, rt + 0.5);
		check(Math.hypot(u0, w0) > 1 && (u0 / su) ** 2 + (w0 / sw) ** 2 < 1, 'the squeezed vacuum\'s dot is not in its cap');
		S.path([q, end], { color: DIM, width: 0.4, layer: 2.5, cap: 'butt', what: 'the squeezed vacuum\'s leader' });
		dot(q, 'the squeezed vacuum\'s dot');
		L.push(await placed('\\begin{array}{c}\\text{squeezed vacuum}\\\\ \\text{same area}\\end{array}', end[0], end[1] - LABEL_GAP - 0.3, 0.5, 1, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { su, sw, rt, coherent: COHERENT };
	return finish(S, L, [240, 320]);
}
