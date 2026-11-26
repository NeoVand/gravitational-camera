// The tutorial, section 1.2 (tutorial/newton/field-and-potential.md), its third diagram: the potential of the person
// of 70 kg at the origin along the x axis, Phi(x) = -GM/|x|, a well that rises toward zero on both sides. Exact: the
// curve (sampled every quarter of a point along its length), on a labelled axis in 10^-9 J/kg; the point x = 1 m,
// where Phi = -GM = -4.67 x 10^-9 J/kg; the tangent there, of slope d Phi/dx = GM/x^2 = +4.67 x 10^-9 per metre,
// which therefore meets Phi = 0 exactly at x = 2 m. Under the axis at x = 1 m, the field g_x = -d Phi/dx, an arrow
// pointing back toward the person; its length is schematic (it is an acceleration, and the axes measure distance and
// potential). The person is drawn as a small stone ball at the origin.
import { INK, DIM, FAINT, ACCENT } from '../lib.js';
import { IRON } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, HAIR, TICK, LABEL_GAP, DOT, n2 } from './tut-pot-lib.js';

// ---- the physics ------------------------------------------------------------------------------------------------
export const G = 6.674e-11;                     // m^3 kg^-1 s^-2
export const MASS = 70;                         // kg, the person
export const GM = G * MASS;                     // m^3 s^-2
export const UNIT = 1e-9;                       // the potential axis, J/kg
export const phi = (x) => -GM / Math.abs(x);
export const slope = (x) => (GM * Math.sign(x)) / (x * x);          // d Phi/dx
export const AT = 1;                            // m, the marked point

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const SX = 33;                                  // points per metre
const SY = 10;                                  // points per 10^-9 J/kg
const XMAX = 4;                                 // m, either side
const LOW = -14;                                // the axis's lowest value, 10^-9 J/kg
const CURVE = 0.75;                             // the potential's stroke
const TANGENT = 0.6;
const ARROW = 0.75, ARROW_HEAD = 4.4;
const ARROW_DEPTH = 8;                          // the field arrow, this far under the axis
const ARROW_TO = 0.38;                          // m, where the field arrow ends (schematic)
const TANGENT_FROM = 0.42;                      // m, where the drawn tangent starts
const BALL = 3.3;                               // the person, a stone ball at the origin
const name = 'tut-pot-well';
const check = checker(name);

export default async function () {
	// ---- the numbers the chapter prints
	const v = phi(AT) / UNIT, s = slope(AT) / UNIT;
	check(near(v, -4.67, 0.005) && Math.abs(v).toFixed(1) === '4.7', `Phi at 1 m is ${v}, not -4.7`);
	check(near(s, 4.67, 0.005) && s > 0, `d Phi/dx at 1 m is ${s}, not +4.7`);
	check(-s < 0, 'g_x at 1 m is not negative');
	// the tangent at 1 m, Phi(1) + Phi'(1)(x - 1) = GM (x - 2), meets zero at x = 2 m
	const tangent = (x) => phi(AT) + slope(AT) * (x - AT);
	check(near(tangent(2), 0, 1e-20), 'the tangent does not meet zero at 2 m');
	// the tangent lies above the curve (the well is concave on each side), so it touches it only at the point
	for (let x = TANGENT_FROM; x <= 2; x += 0.001) check(tangent(x) >= phi(x) - 1e-22, `the tangent crosses the curve at ${x}`);

	const S = new Sheet(name);
	const X0 = ORIGIN, Y0 = ORIGIN - 60;            // the origin on the page
	const at = (x, p) => [X0 + SX * x, Y0 - SY * p];   // x in metres, p in 10^-9 J/kg
	const right = at(XMAX, 0)[0];

	// ---- the curve: two branches, each one path, points a quarter of a point apart along it, from the bottom of the axis
	const xLow = GM / UNIT / -LOW;                  // where Phi reaches the bottom of the axis
	check(near(phi(xLow) / UNIT, LOW, 1e-9), 'the curve does not start at the bottom of the axis');
	for (const sign of [1, -1]) {
		const pts = [];
		let x = xLow;
		while (x < XMAX) {
			pts.push(at(sign * x, phi(x) / UNIT));
			const d = Math.hypot(SX, (SY * slope(x)) / UNIT);   // points per metre along the curve
			x = Math.min(XMAX, x + 0.25 / d);
		}
		pts.push(at(sign * XMAX, phi(XMAX) / UNIT));
		for (let i = 1; i < pts.length; i++) check(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) <= 0.2501, 'the curve is sampled too coarsely');
		S.path(pts, { color: INK, width: CURVE, layer: 2, what: `the ${sign > 0 ? 'right' : 'left'} branch` });
	}

	// ---- the x axis, at Phi = 0: ticks every metre, upward, labelled above (0 is the person's place)
	S.path([at(-XMAX, 0), at(XMAX, 0)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the x axis' });
	const labels = [];
	for (let k = -XMAX; k <= XMAX; k++) {
		const [x, y] = at(k, 0);
		S.path([[x, y], [x, y - TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${k} m` });
		if (k !== 0) labels.push(await placed(`${k < 0 ? '-' : ''}${Math.abs(k)}`, x, y - TICK - 2.4, 0.5, 1, DIM));
	}
	// the axis's name at its left end, on the line of the numbers
	const minus4 = labels[0];
	labels.push(await placed('x\\ (\\mathrm{m})', minus4.box.l - 7, minus4.box.b, 1, 1, DIM));

	// ---- the potential's axis, at the right: ticks outward, the marked value among them
	S.path([at(XMAX, 0), at(XMAX, LOW)], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: 'the potential axis' });
	const ticks = [0, v, -10, LOW];
	for (const t of ticks) {
		const [x, y] = at(XMAX, t);
		const marked = t === v;
		S.path([[x, y], [x + TICK, y]], { color: marked ? INK : DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at ${t}` });
		const txt = t === 0 ? '0' : `-${Math.abs(t).toFixed(marked ? 1 : 0)}`;
		labels.push(await placed(txt, x + TICK + 2.4, y, 0, 0.5, marked ? INK : DIM));
	}
	// the axis's name beside its lower end, inside, where the well leaves the page empty
	labels.push(await placed('\\Phi\\ (10^{-9}\\,\\mathrm{J\\,kg^{-1}})', right - 7, at(0, LOW + 1.2)[1], 1, 0.5, DIM));

	// ---- the point at 1 m: a dot, dotted lines to both axes
	const P = at(AT, v);
	S.raw(`<circle cx="${n2(P[0])}" cy="${n2(P[1])}" r="1.2" fill="${INK}"/>`, 4);
	S.mark([P], 1.2, 'the point');
	S.dots(P, [right, P[1]], { color: FAINT, clear0: 2.6, clear1: 0.4, what: 'the line to the value' });
	S.dots(P, at(AT, 0), { color: FAINT, clear0: 2.6, clear1: 0.4, what: 'the line to 1 m' });

	// ---- the tangent, rising to the right, to where it meets the axis
	S.path([at(TANGENT_FROM, tangent(TANGENT_FROM) / UNIT), at(2, 0)], { color: ACCENT, width: TANGENT, layer: 3, what: 'the tangent' });
	labels.push(await placed('\\partial_x\\Phi > 0', ...at(2.14, -0.78), 0, 0.5, ACCENT));

	// ---- the person, and the field at 1 m: under the axis, pointing back toward the person
	S.sphere(at(0, 0), BALL, IRON, { spec: 0.45, shininess: 30, layer: 5 }, 'the person');
	const tail = [at(AT, 0)[0], at(0, 0)[1] + ARROW_DEPTH], head = [at(ARROW_TO, 0)[0], tail[1]];
	const g = S.arrow(tail, head, { color: ACCENT, width: ARROW, head: ARROW_HEAD, layer: 3, what: 'the field arrow' });
	check(g.u[0] < 0 && near(g.u[1], 0, 1e-12), 'the field arrow does not point back toward the person');
	check(head[0] - g.head * 0.36 > at(0, 0)[0] + BALL + 3, 'the field arrow reaches the person');
	labels.push(await placed('g_x < 0', tail[0] - 3.4, tail[1] + 4.2, 1, 0, ACCENT));

	// ---- the curve's name, under the left branch
	labels.push(await placed('\\Phi = -\\dfrac{GM}{|x|}', ...at(-2.55, -6.2), 0.5, 0.5, INK));

	// ---- checks: the dotted lines pass under the labels they meet only at their ends
	S.checkAll(labels);
	void LABEL_GAP; void DOT;
	return finish(S, labels, [240, 340]);
}
