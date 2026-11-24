// The tutorial, chapter 6.6 (tutorial/relativity/maxwell-complex.md), its second diagram: a turn of the axes and a
// boost, side by side as one rule. Two panels, one above the other, at one scale and in one layout. Above, "a turn of
// the axes by theta": the plane across u-hat, seen with u-hat pointing at the reader (a dot in a small circle at the
// origin, named "u-hat"); the axes x and y, thin ink arrows, named; the unit circle x^2 + y^2 = 1, thin ink; the new
// axes turned anticlockwise by theta = 35 degrees, arrows in the observer's colour, named x' and y'; the point
// (cos theta, sin theta) on the circle, a dot in the observer's colour, with the arc of the circle from (1, 0) to it
// heavier; its dashed shadows on the two axes, named "cos theta" and "sin theta". Below, "a boost by eta": the same axes;
// the right-hand branch of the hyperbola x^2 - y^2 = 1 for y from -1.6 to 1.6, thin ink; the point (cosh eta, sinh eta)
// for eta = ln 2, (1.25, 0.75), a dot in the observer's colour, with the arc of the hyperbola from (1, 0) to it heavier;
// its dashed shadows, named "cosh eta = 1.25" and "sinh eta = 0.75". Under each panel the rule in the light role's
// colour, "F'_perp = cos theta F_perp - sin theta u x F" and "F'_perp = cosh eta F_perp - i sinh eta u x F".
// Departures from the diagram's comment: the panels are stacked at every width, not side by side at 1440 px (the site
// shows one drawing at every width, as 6.2's tut-vectors-gradient), so that the two rules stand one above the other
// and can be read term by term. The axes are named x and y, and the turned axes x' and y'; the dot on the circle is in
// the observer's colour, as the turned axis through it is.
// Exact: the circle and the hyperbola (sampled finely, every point asserted on its curve), the angle of 35 degrees,
// the point (1.25, 0.75) for eta = ln 2 (asserted in tut-maxwell-lib.js with cos(i eta) = cosh eta and
// sin(i eta) = i sinh eta), the shadows, the two panels at one scale. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC } from './tut-pot-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { THIN } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, LIGHT, ETA, THETA, Y_MAX } from './tut-maxwell-lib.js';

const name = 'tut-maxwell-turn';
const check = checker(name);

const U = 50;                              // points per unit, both panels
const XL = -1.25, XL_BOOST = -0.5, XR_TURN = 1.45, XR_BOOST = 2.45;   // the x axes
const YR = 1.25, YR_BOOST = 1.75;          // the y axes run from -YR to YR
const NEW = 1.3;                           // the turned axes' length
const POINT = DOT + 0.55;                  // the dot, radius
const HEAVY = 1.3;                         // the heavier arc
const U_RING = 3.2;                        // u-hat: the small circle's radius, points
const SHADOW = 0.45;                       // the dashed shadows
const ROW = 6, APART = 16;

const rad = Math.PI / 180;
const fmt = (v) => String(+v.toFixed(2));

/** One panel at the origin O: the axes, the curve, the heavier arc, the dot, its shadows and their names. */
async function panel(S, O, { xl = XL, xr, yr, curve, arc, point, names, newAxes, footAnchor = 0.5, footDir = [0, 1], yAbove = false }) {
	const L = [];
	const at = ([x, y]) => [O[0] + x * U, O[1] - y * U];
	const xA = S.arrow(at([xl, 0]), at([xr, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
	const yA = S.arrow(at([0, -yr]), at([0, yr]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the y axis' });
	L.push(await placed('x', xA.B[0] + LABEL_GAP + 1.2, xA.B[1], 0, 0.5, INK));
	L.push(await placed('y', yA.B[0], yA.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));
	S.path(curve.map(at), { color: INK, width: THIN, layer: 1.5, what: 'the curve' });
	S.path(arc.map(at), { color: INK, width: HEAVY, layer: 2, cap: 'butt', what: 'the arc' });
	if (newAxes) {
		for (const [deg, nm] of [[THETA, "x'"], [THETA + 90, "y'"]]) {
			const a = S.arrow(at([(U_RING + 0.6) / U * Math.cos(deg * rad), (U_RING + 0.6) / U * Math.sin(deg * rad)]), at([NEW * Math.cos(deg * rad), NEW * Math.sin(deg * rad)]), { color: OBS, width: AXIS + 0.15, head: AXIS_HEAD, layer: 2.5, what: `the axis ${nm}` });
			const u = [Math.cos(deg * rad), -Math.sin(deg * rad)];
			L.push(await S.clear(nm, a.B[0] + u[0] * 3, a.B[1] + u[1] * 3, u[0] > 0 ? 0 : 1, 0.5, u, { color: OBS }));
		}
	}
	const p = at(point);
	S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${POINT}" fill="${OBS}"/>`, 4);
	S.mark([p], POINT, 'the dot');
	// the shadows: down to the x axis, across to the y axis, stopping short of the dot
	const fx = at([point[0], 0]), fy = at([0, point[1]]);
	dashed(S, [p[0], p[1] + POINT + 0.8], fx, { color: DIM, width: SHADOW, dash: DASH, layer: 1.2, what: 'the shadow on x' });
	dashed(S, [p[0] - POINT - 0.8, p[1]], fy, { color: DIM, width: SHADOW, dash: DASH, layer: 1.2, what: 'the shadow on y' });
	L.push(await S.clear(names[0], fx[0] + (footAnchor === 0 ? 1.5 : 0), fx[1] + LABEL_GAP + 1.4, footAnchor, 0, footDir, { color: INK }));
	// beside the shadow's foot on the y axis: to its left, or (where the turned axis y' passes on the left) above the
	// shadow, against the axis
	if (yAbove) L.push(await S.clear(names[1], fy[0] + LABEL_GAP + 0.6, fy[1] - LABEL_GAP - 0.6, 0, 1, [0, -1], { color: INK }));
	else L.push(await S.clear(names[1], fy[0] - LABEL_GAP - 1.4, fy[1], 1, 0.5, [-1, 0], { color: INK }));
	return L;
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - 150;
	const x0 = left - XL * U;

	// ---- the turn
	const th = THETA * rad, cp = [Math.cos(th), Math.sin(th)];
	const circle = Array.from({ length: 721 }, (_, k) => [Math.cos(k * Math.PI / 360), Math.sin(k * Math.PI / 360)]);
	const arcC = Array.from({ length: 141 }, (_, k) => [Math.cos((th * k) / 140), Math.sin((th * k) / 140)]);
	for (const [x, y] of [...circle, ...arcC]) check(near(x * x + y * y, 1, 1e-12), 'a point is off the circle');
	check(near(Math.atan2(cp[1], cp[0]) / rad, 35, 1e-12), 'the angle is not 35 degrees');
	const t1 = await placed('\\text{a turn of the axes by } \\theta', left, ORIGIN - 300, 0, 0, INK);
	L.push(t1);
	const O1 = [x0, t1.box.b + ROW + 12 + YR * U];
	L.push(...await panel(S, O1, { xr: XR_TURN, yr: YR, curve: circle, arc: arcC, point: cp, names: ['\\cos\\theta', '\\sin\\theta'], newAxes: true, footDir: [-1, 0], yAbove: true }));
	// u-hat: a dot in a small circle at the origin, pointing at the reader, named in the open quarter below and left
	S.raw(`<circle cx="${O1[0]}" cy="${O1[1]}" r="${U_RING}" fill="none" stroke="${INK}" stroke-width="${AXIS}"/><circle cx="${O1[0]}" cy="${O1[1]}" r="0.9" fill="${INK}"/>`, 3);
	S.mark([O1], U_RING + AXIS / 2, 'u-hat');
	{
		const w = [-Math.SQRT1_2, Math.SQRT1_2];
		L.push(await S.clear('\\hat u', O1[0] + w[0] * (U_RING + 3), O1[1] + w[1] * (U_RING + 3), 1, 0, w, { color: INK }));
	}
	const ymax1 = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
	const rule1 = await placed("\\mathbf F'_\\perp = \\cos\\theta\\,\\mathbf F_\\perp - \\sin\\theta\\,\\hat u\\times\\mathbf F", left, ymax1 + ROW + 2, 0, 0, LIGHT);
	L.push(rule1);

	// ---- the boost
	const ch = Math.cosh(ETA), sh = Math.sinh(ETA);
	check(fmt(ch) === '1.25' && fmt(sh) === '0.75', `cosh and sinh of ln 2: ${ch}, ${sh}`);
	const branch = Array.from({ length: 641 }, (_, k) => { const y = -Y_MAX + (2 * Y_MAX * k) / 640; return [Math.sqrt(1 + y * y), y]; });
	const arcH = Array.from({ length: 141 }, (_, k) => { const e = (ETA * k) / 140; return [Math.cosh(e), Math.sinh(e)]; });
	for (const [x, y] of [...branch, ...arcH]) check(near(x * x - y * y, 1, 1e-12), 'a point is off the hyperbola');
	check(branch[0][0] < XR_BOOST - 0.15, 'the hyperbola reaches past the x axis');
	const t2 = await placed('\\text{a boost by } \\eta', left, rule1.box.b + APART, 0, 0, INK);
	L.push(t2);
	const O2 = [x0, t2.box.b + ROW + 12 + YR_BOOST * U];
	L.push(...await panel(S, O2, { xl: XL_BOOST, xr: XR_BOOST, yr: YR_BOOST, curve: branch, arc: arcH, point: [ch, sh], names: [`\\cosh\\eta = ${fmt(ch)}`, `\\sinh\\eta = ${fmt(sh)}`], newAxes: false, footAnchor: 0 }));
	{
		// the hyperbola's ends lie beyond the y axis's: name nothing there; the u-hat of the panel above stands for both
		const ymax2 = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
		L.push(await placed("\\mathbf F'_\\perp = \\cosh\\eta\\,\\mathbf F_\\perp - i\\sinh\\eta\\,\\hat u\\times\\mathbf F", left, ymax2 + ROW + 2, 0, 0, LIGHT));
	}
	check(near(O1[0], O2[0]), 'the two origins are not one above the other');

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, scale: U };
	return finish(S, L, [180, 340]);
}
