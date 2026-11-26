// The tutorial, section 1.5 (tutorial/newton/five-numbers.md), its third diagram: a pattern of stretch and squeeze
// across a wave is a point (E+, Ex) of a plane, and turning the axes by theta moves the point by 2 theta the other
// way. Left, a ring of twelve free steel beads under the plus table diag(E+, -E+), E+ > 0 (a squeeze along x, blue,
// and a stretch along y, orange), with its axes x and y drawn small at its lower left and the same axes turned
// anticlockwise by theta = 30 degrees (x', y'). Right, the plane of the two numbers, with the circle on which the
// point moves: the point for the axes x and y, (E+, 0), and for the turned axes, at the angle 2 theta = 60 degrees
// clockwise from it (the chapter's equation eq:twice); the turns of 45, 90 and 135 degrees, and 180, where the point
// is back where it began. Exact: the ring, the image of the circle under 1 - eps T (tut-five-lib.js); the turn of
// the axes (asserted 30 degrees on the page, anticlockwise); every point of the plane, computed from eq:twice
// (asserted on the circle, at the angle -2 theta, and on the page); the arcs. Exaggerated: eps.
import { Panel, v3, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR } from './tut-vec-lib.js';
import { ring, gnomon, arc, point, planeAxes } from './tut-five-lib.js';

export const EP = 1;                      // E+, in some unit of tide; Ex = 0
export const THETA = 30;                  // degrees: the turn of the axes drawn
export const MARKS = [45, 90, 135, 180];  // degrees: the turns marked on the circle
export const EPS = 0.2;                   // the ring's eps (exaggerated)
const R = 34;                             // points: the undisturbed ring's radius
const BEAD = 2.55;                        // points: a bead's radius (0.075 R)
const REACH = 12;                         // points per unit of |T xi|
const GN = [-70, -46], GN_LEN = 28;       // the ring's small axes: their corner, from the ring's centre, and length
const RHO = 16;                           // points: the radius of the arc of theta at the small axes
const S = 50;                             // points per unit of the plane: the circle's radius
const GAP = 84;                           // points from the ring's centre to the plane's left end
const RHO2 = 0.42;                        // the arc of 2 theta at the plane's origin, units of the plane
const name = 'tut-five-turn';
const check = checker(name);

const rad = (d) => (d * Math.PI) / 180;
/** eq:twice: the two numbers in axes turned by theta. */
export const turned = ([p, x], th) => [p * Math.cos(2 * th) + x * Math.sin(2 * th), -p * Math.sin(2 * th) + x * Math.cos(2 * th)];

export default async function () {
	// eq:twice against the rotation of the table itself, R T R^T, with R's rows the new axes
	for (const d of [THETA, ...MARKS, 17]) {
		const t = rad(d), c = Math.cos(t), s = Math.sin(t);
		const Rm = [[c, s], [-s, c]], T = [[EP, 0], [0, -EP]];
		const RT = Rm.map((row) => [0, 1].map((j) => row[0] * T[0][j] + row[1] * T[1][j]));
		const RTRt = RT.map((row) => [0, 1].map((j) => row[0] * Rm[j][0] + row[1] * Rm[j][1]));
		const [p, x] = turned([EP, 0], t);
		check(near(RTRt[0][0], p, 1e-12) && near(RTRt[0][1], x, 1e-12) && near(RTRt[1][1], -p, 1e-12), `eq:twice disagrees with R T R^T at ${d} degrees`);
	}
	const at = (d) => turned([EP, 0], rad(d));
	check(near(at(45)[0], 0, 1e-12) && near(at(45)[1], -EP, 1e-12), 'at 45 degrees the plus table is not minus the cross table');
	check(near(at(90)[0], -EP, 1e-12) && near(at(90)[1], 0, 1e-12), 'at 90 degrees the point does not change sign');
	check(near(at(180)[0], EP, 1e-12) && near(at(180)[1], 0, 1e-12), 'at 180 degrees the point is not back');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const E = [v3(1, 0, 0), v3(0, 1, 0)];

	// ---- the ring, under diag(E+, -E+)
	const C = v3(-GAP / 2 - S * 0.6, 0, 0);
	const T = [[EP, 0], [0, -EP]];
	const r = ring(ink, { c: C, eh: E[0], ev: E[1], R, T, eps: EPS, phase: 0, bead: BEAD, reach: REACH, what: 'the ring' });
	check(r.arrows.filter((a) => a.stretch).every((a) => near(a.from.x, C.x, 1e-9)), 'the stretch is not along y');
	check(r.arrows.filter((a) => !a.stretch).every((a) => near(a.from.y, C.y, 1e-9)), 'the squeeze is not along x');

	// ---- its axes, and the axes turned anticlockwise by theta
	const O = C.clone().add(v3(...GN, 0));
	const t = rad(THETA);
	const turnedAxes = [v3(Math.cos(t), Math.sin(t), 0), v3(-Math.sin(t), Math.cos(t), 0)];
	const tipsA = gnomon(ink, O, [{ d: E[0], tex: 'x' }, { d: E[1], tex: 'y' }], GN_LEN, { what: 'the axes' });
	const tipsB = gnomon(ink, O, [{ d: turnedAxes[0], tex: "x'", color: DIM }, { d: turnedAxes[1], tex: "y'", color: DIM }], GN_LEN, { what: 'the turned axes' });
	const [o, xa, xb] = [ink.at(O), ink.at(tipsA[0]), ink.at(tipsB[0])];
	const drawnTurn = Math.atan2(-(xb[1] - o[1]), xb[0] - o[0]) - Math.atan2(-(xa[1] - o[1]), xa[0] - o[0]);
	check(near(drawnTurn, t, 1e-9), 'the drawn turn is not theta, anticlockwise');
	const thArc = arc(ink, O, RHO, 0, t, { color: DIM, what: 'the arc of theta' });

	// ---- the plane of (E+, Ex)
	const Z = v3(C.x + GAP + 1.3 * S, 0, 0);                // the plane's origin
	const ax = planeAxes(ink, Z, S, { h: { lo: -1.22, hi: 1.38 }, v: { lo: -1.22, hi: 1.3 } });
	const circle = Array.from({ length: 721 }, (_, k) => Z.clone().add(v3(S * EP * Math.cos((2 * Math.PI * k) / 720), S * EP * Math.sin((2 * Math.PI * k) / 720), 0)));
	ink.curve(circle, { color: DIM, width: HAIR, layer: 0, what: 'the circle' });
	const where = (d) => { const [p, x] = at(d); return Z.clone().add(v3(S * p, S * x, 0)); };
	// every point on the circle, at the angle -2 theta from (E+, 0)
	for (const d of [0, THETA, ...MARKS]) {
		const q = where(d).sub(Z);
		check(near(q.length(), S * EP, 1e-9), `the point for ${d} degrees is off the circle`);
		const ang = Math.atan2(q.y, q.x), want = -2 * rad(d);
		check(near(Math.cos(ang - want), 1, 1e-12), `the point for ${d} degrees is not at -2 theta`);
	}
	// the radius to the point for theta, and the arc of 2 theta from (E+, 0), clockwise, with its head
	ink.line(Z, where(THETA), { color: DIM, width: HAIR, layer: 1, what: 'the radius to the turned point' });
	const twoArc = arc(ink, Z, RHO2 * S, 0, -2 * t, { color: DIM, head: 3, what: 'the arc of 2 theta' });
	for (const d of [0, THETA, 45, 90, 135]) point(ink, where(d), { what: `the point for ${d} degrees` });

	// ---- labels
	const L = [];
	const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
	L.push(await ink.label('x', ink.at(tipsA[0]), [1, 0]));
	L.push(await ink.label('y', ink.at(tipsA[1]), [0, -1]));
	L.push(await ink.label("x'", ink.at(tipsB[0]), unit(Math.cos(t), -Math.sin(t)), 2.2, DIM));
	L.push(await ink.label("y'", ink.at(tipsB[1]), unit(-Math.sin(t), -Math.cos(t)), 2.2, DIM));
	L.push(await ink.label('\\theta', ink.at(thArc.mid), unit(Math.cos(t / 2), -Math.sin(t / 2)), 2.2, DIM));
	L.push(await ink.label('\\mathcal{E}_+', ink.at(ax.h.tip), [1, 0]));
	L.push(await ink.label('\\mathcal{E}_\\times', ink.at(ax.v.tip), [-1, 0]));
	L.push(await ink.label('2\\theta', ink.at(twoArc.mid), unit(Math.cos(-t), -Math.sin(-t)), 2.2, DIM));
	const mark = async (d, src, u) => L.push(await ink.label(src, ink.at(where(d)), unit(...u)));
	await mark(0, '\\theta = 0^\\circ,\\ 180^\\circ', [0.55, -1]);
	await mark(THETA, `\\theta = ${THETA}^\\circ`, [1, 0.35]);
	await mark(45, '\\theta = 45^\\circ', [-1, 0.6]);
	await mark(90, '\\theta = 90^\\circ', [-0.6, -1]);
	await mark(135, '\\theta = 135^\\circ', [1, -0.5]);

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
