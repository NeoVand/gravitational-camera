// The tutorial, section 1.5 (tutorial/newton/five-numbers.md), its first diagram: what each part of a symmetric
// table does to a small ball of free dust at rest. Left, the trace part alone, the table delta_ij (in some unit of
// tide), which squeezes every direction alike: the ball shrinks and stays a ball. Right, a trace-free part, the
// person's diag(-2, 1, 1) in the same unit, with x along the line to the person: the ball becomes a cigar along x,
// longer by 2 eps and thinner by eps, so that to first order in eps its volume does not change. Each ball is seen in
// true 3D from slightly above (an orthographic view, tilted as lib.js's Panel does): a pale body, its outline the
// ring of twelve free steel beads in the plane that faces us, the dashed outline of the undisturbed ball, and the
// ball's equator. Exact: each ball, the image of the unit sphere under 1 - eps T with one eps
// for both (the outline and the equator are the images of the undisturbed outline and equator, asserted on the
// page against the spheroid's own outline); the beads, the images of twelve equally spaced places; the arrows,
// -T xi at the beads on the axes, at one scale for both balls (each blue arrow of the left ball is as long as each
// blue arrow of the right one, and each orange arrow twice that); the tables, printed as they are used. Exaggerated:
// eps. Schematic: the view. Each ball has a title over it ("the trace part", "the person's table"), the two on one
// baseline, its table under it; between the tables, once for both, the axes x (to the right) and y (up), drawn in
// the balls' own view (z, toward us, would fall on y's line, and the balls are alike about x, so it is left out).
import { Panel, v3, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, HAIR, AXIS, AXIS_HEAD } from './tut-vec-lib.js';
import { TINT, cameraAxes } from './tut-gauss-lib.js';
import { ring, TAIL, UNDISTURBED_W } from './tut-five-lib.js';

/** The two tables, rows and columns x, y, z, in one unit of tide: the trace part, and a trace-free part. */
export const TABLES = [
	[[1, 0, 0], [0, 1, 0], [0, 0, 1]],
	[[-2, 0, 0], [0, 1, 0], [0, 0, 1]]
];
export const EPS = 0.15;                  // the one eps of the figure (exaggerated)
const TILT = 20;                          // degrees: the view, from slightly above
const S = 44;                             // points per unit: the undisturbed ball's radius
const BEAD = 0.075;                       // a bead's radius, units (tidal.js)
const REACH = 0.25;                       // units of arrow per unit of |T xi|
const GAP = 34;                           // points of air between the two drawings
const TABLE_DROP = 10;                    // points from the lower ball's ink down to the top of its table
const TITLE_GAP = 7;                      // points from the bottom of a title's ink down to the ball's highest ink
const TITLES = ['\\text{the trace part}', '\\text{the person\'s table}'];
const AXES = 0.42;                        // the axes' arrows, units long
const name = 'tut-five-split';
const check = checker(name);

const apply = (T, p) => v3(T[0][0] * p.x + T[0][1] * p.y + T[0][2] * p.z, T[1][0] * p.x + T[1][1] * p.y + T[1][2] * p.z, T[2][0] * p.x + T[2][1] * p.y + T[2][2] * p.z);

export default async function () {
	// ---- the tables: symmetric and diagonal; the first is all trace, the second has none
	for (const T of TABLES) check(T.every((row, i) => row.every((x, j) => x === T[j][i] && (i === j || x === 0))), 'a table is not diagonal');
	const tr = TABLES.map((T) => T[0][0] + T[1][1] + T[2][2]);
	check(tr[0] === 3 && TABLES[0].every((row, i) => row[i] === tr[0] / 3), 'the first table is not its own trace part');
	check(tr[1] === 0, 'the second table is not trace-free');
	// volumes: det(1 - eps T); the first-order term is -eps tr T
	const vol = TABLES.map((T) => (1 - EPS * T[0][0]) * (1 - EPS * T[1][1]) * (1 - EPS * T[2][2]));
	check(near(vol[1], 1 - 3 * EPS ** 2 + 2 * EPS ** 3, 1e-12), 'the second volume is not 1 - 3 eps^2 + 2 eps^3');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: 0 });
	const ink = new Sheet(P, name);
	const [right, up, toward] = cameraAxes(P);
	check(near(right.x, 1, 1e-12), 'x is not to the right on the page');
	// the plane that faces us through x: x and the page's up, which lies in the plane of y and z
	check(near(up.x, 0, 1e-12), 'the page\'s up is not across x');

	// the two centres, far enough apart for GAP points of air between the drawings
	const halfL = 1 + UNDISTURBED_W / 2 / S;                       // the left ball's reach along x: its dashed outline
	const halfR = (1 - EPS * TABLES[1][0][0]) + BEAD + TAIL / S + Math.abs(TABLES[1][0][0]) * REACH;   // the right one's: its orange arrow
	const span = halfL + GAP / S + halfR;
	const cL = v3(-span / 2, 0, 0), cR = v3(span / 2, 0, 0);

	const drawn = [];
	for (const [k, T] of TABLES.entries()) {
		const c = k ? cR : cL;
		// the table carries the facing plane into itself, so its 2 x 2 block there is the whole push
		const Tu = apply(T, up);
		check(near(Tu.clone().sub(up.clone().multiplyScalar(Tu.dot(up))).length(), 0, 1e-12), 'the table does not keep the facing plane');
		const T2 = [[T[0][0], 0], [0, Tu.dot(up)]];
		const r = ring(ink, { c, eh: right, ev: up, R: 1, T: T2, eps: EPS, phase: 0, bead: BEAD, reach: REACH, layer: 0, what: `ball ${k + 1}` });
		// the body: the outline filled with a pale tint, under everything
		P.polygon(r.loop, { fill: TINT, layer: -2 });
		// the outline is the spheroid's own: a spheroid about x seen across x shows its long and short semi-axes
		const a = 1 - EPS * T[0][0], b = 1 - EPS * T[1][1];
		check(near(1 - EPS * T[2][2], b, 1e-15), 'the ball is not a spheroid about x');
		for (const q of r.loop) {
			const d = q.clone().sub(c);
			check(near((d.dot(right) / a) ** 2 + (d.dot(up) / b) ** 2, 1, 1e-9) && near(d.dot(toward), 0, 1e-12), 'the outline is not the spheroid\'s');
		}
		// the equator, the image of the undisturbed one, drawn whole as section 1.3's sphere draws its equator
		const eq = Array.from({ length: 481 }, (_, i) => { const t = (2 * Math.PI * i) / 480; return c.clone().add(v3(a * Math.cos(t), 0, b * Math.sin(t))); });
		for (const p of eq) check(near(((p.x - c.x) / a) ** 2 + ((p.z - c.z) / b) ** 2, 1, 1e-12) && near(p.y, c.y, 1e-15), 'the equator is not the image of the undisturbed one');
		ink.curve(eq, { color: DIM, width: HAIR, layer: 1, what: `ball ${k + 1}'s equator` });
		drawn.push(r);
	}
	// one scale: the blue arrows of both balls alike, each orange arrow twice a blue one
	const blue = drawn.flatMap((r) => r.arrows.filter((a) => !a.stretch)), orange = drawn.flatMap((r) => r.arrows.filter((a) => a.stretch));
	check(drawn[0].arrows.length === 4 && drawn[0].arrows.every((a) => !a.stretch), 'the trace part does not squeeze every way');
	check(blue.every((a) => near(a.L, blue[0].L, 1e-9)), 'the blue arrows differ');
	check(orange.length === 2 && orange.every((a) => near(a.L, 2 * blue[0].L, 1e-9)), 'an orange arrow is not twice a blue one');
	// the air between the two drawings
	const inkX = (r, c, side) => Math.max(...r.arrows.map((a) => side * ink.at(a.to)[0]), ...r.loop.map((q) => side * ink.at(q)[0] + BEAD * S), side * ink.at(c)[0] + S + UNDISTURBED_W / 2);
	const gapPts = -inkX(drawn[1], cR, -1) - inkX(drawn[0], cL, 1);
	check(near(gapPts, GAP, 1e-6), `the gap between the balls is ${gapPts.toFixed(2)} pt`);

	// ---- the tables, under the balls, their tops on one line
	const low = Math.max(...drawn.flatMap((r) => [...r.loop.map((q) => ink.at(q)[1] + BEAD * S), ...r.arrows.map((a) => ink.at(a.to)[1])]));
	const z = (v) => (v === 0 ? `\\color{${FAINT}}{0}` : `\\color{${v < 0 ? ACCENT : ACCENT2}}{${v}}`);
	const labels = [];
	for (const [k, T] of TABLES.entries()) {
		const x = ink.at(k ? cR : cL)[0];
		labels.push(await placed(`\\begin{pmatrix}${T.map((r) => r.map(z).join('&')).join('\\\\')}\\end{pmatrix}`, x, low + TABLE_DROP, 0.5, 0, INK));
	}
	// ---- a title over each ball, their baselines on one line
	const high = Math.min(...drawn.flatMap((r) => [...r.loop.map((q) => ink.at(q)[1] - BEAD * S), ...r.arrows.map((a) => ink.at(a.to)[1])]),
		...[cL, cR].map((c) => ink.at(c)[1] - S - UNDISTURBED_W / 2));
	// (both have a descender, the p, so the bottoms of their ink are on their common baseline's level)
	for (const [k, t] of TITLES.entries()) labels.push(await placed(t, ink.at(k ? cR : cL)[0], high - TITLE_GAP, 0.5, 1, INK));
	// ---- the axes, once for both, in the middle between the tables: x to the right, y up, from one origin, in the
	// same view as the balls (z, toward us, falls on y's line, so it is left out: the balls are alike about x)
	const tableTop = low + TABLE_DROP, tableMid = (tableTop + Math.max(...labels.slice(0, 2).map((l) => l.box.b))) / 2;
	const yw = -(tableMid + (AXES * S * Math.cos((TILT * Math.PI) / 180)) / 2 - ORIGIN) / (S * Math.cos((TILT * Math.PI) / 180));
	const O = v3(-AXES / 2, yw, 0);
	check(near(ink.at(O)[0], ORIGIN - (AXES * S) / 2, 1e-9), 'the axes are not centred between the balls');
	const ax = ink.arrow(O, O.clone().add(v3(AXES, 0, 0)), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the x axis' });
	const ay = ink.arrow(O, O.clone().add(v3(0, AXES, 0)), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the y axis' });
	check(near(ax.u[1], 0, 1e-12) && near(ay.u[0], 0, 1e-12), 'x is not across the page or y not up it');
	labels.push(await ink.label('x', ax.B, [1, 0], 2.2, DIM));
	labels.push(await ink.label('y', ay.B, [0, -1], 2.2, DIM));
	ink.checkAll(labels);
	window[name + '-volumes'] = vol;
	return finish(name, P, labels, [240, 340]);
}
