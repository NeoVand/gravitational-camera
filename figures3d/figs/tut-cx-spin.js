// The tutorial, section 1.5b (tutorial/newton/complex-numbers.md), its third diagram: when the axes turn by theta,
// an arrow's number turns back by theta and the shear by 2 theta. Left, a ring of twelve free steel beads under the
// shear s = 2 (in some unit of tide): the trace-free table diag(1, -1), a squeeze along x (blue) and a stretch along
// y (orange), with its axes x and y drawn small at its lower left. Middle, the same ring, unchanged, with the axes
// turned anticlockwise by theta = 45 degrees (x', y'; the old axes faint). Right, the complex plane: the shear s = 2
// and, in the turned axes, s' = e^{-2 i theta} s = -2i, joined by an arc of -90 degrees round 0; and the number of
// an arrow along x, v = 1, which the same turn moves only to v' = e^{-i theta} v = e^{-i pi/4}, by -45 degrees.
// Exact: the ring (the image of the circle under 1 - eps T, tut-five-lib.js); s and s' computed from the table in
// the old and the turned axes (R T R^T, with R's rows the new axes) by the chapter's eq:shear, and asserted equal to
// e^{-2 i theta} s; v' computed as the shadows of v on the new axes and asserted equal to e^{-i theta} v; every
// point at its true value on the plane's scale; the arcs. Exaggerated: eps.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near } from './tut-vec-lib.js';
import { ring, gnomon, arc, point, planeAxes, PT } from './tut-five-lib.js';
import { times } from './tut-cx-product.js';

export const T = [[1, 0], [0, -1]];       // the table in the plane, in some unit of tide: s = 2
export const THETA = 45;                  // degrees
export const EPS = 0.2;                   // the ring's eps (exaggerated)
const R = 24;                             // points: the undisturbed ring's radius
const BEAD = 1.8;                        // points: a bead's radius (0.075 R)
const REACH = 10;                         // points per unit of |T xi|
const STEP = 92;                          // points between the two rings' centres
const GN = [-31, -52], GN_LEN = 19;       // the small axes: their corner, from the ring's centre, and their length
const RHO = 11;                           // points: the arc of theta at the small axes
const S = 34;                             // points per unit of the complex plane
const name = 'tut-cx-spin';
const check = checker(name);

const shear = (M) => [M[0][0] - M[1][1], 2 * M[0][1]];   // eq:shear, as (Re, Im)

export default async function () {
	// ---- the numbers
	const t = (THETA * Math.PI) / 180, c = Math.cos(t), sn = Math.sin(t);
	const Rm = [[c, sn], [-sn, c]];                           // rows: the new axes
	const turn = (M) => Rm.map((row, i) => [0, 1].map((j) => row[0] * (M[0][0] * Rm[j][0] + M[0][1] * Rm[j][1]) + row[1] * (M[1][0] * Rm[j][0] + M[1][1] * Rm[j][1])));
	const s = shear(T), s2 = shear(turn(T));
	check(near(s[0], 2, 1e-15) && near(s[1], 0, 1e-15), 'the shear is not 2');
	check(near(s2[0], 0, 1e-12) && near(s2[1], -2, 1e-12), `the turned shear is ${s2}, not -2i`);
	const e2 = [Math.cos(-2 * t), Math.sin(-2 * t)], e1 = [Math.cos(-t), Math.sin(-t)];
	const r2 = times(e2, s);
	check(near(r2[0], s2[0], 1e-12) && near(r2[1], s2[1], 1e-12), 'the turned shear is not e^{-2 i theta} s');
	const v = [1, 0], v2 = [Rm[0][0] * v[0] + Rm[0][1] * v[1], Rm[1][0] * v[0] + Rm[1][1] * v[1]];   // shadows on the new axes
	const r1 = times(e1, v);
	check(near(r1[0], v2[0], 1e-12) && near(r1[1], v2[1], 1e-12), 'the turned arrow is not e^{-i theta} v');
	check(near(v2[0], Math.SQRT1_2, 1e-12) && near(v2[1], -Math.SQRT1_2, 1e-12), 'v\' is not (0.707, -0.707)');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const E = [v3(1, 0, 0), v3(0, 1, 0)];
	const L = [];
	const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

	// ---- the two rings: one table, the same drawing; only the axes differ
	const C = [v3(-STEP - 30, 0, 0), v3(-30, 0, 0)];
	const turned = [v3(c, sn, 0), v3(-sn, c, 0)];
	for (const [k, Ck] of C.entries()) {
		const r = ring(ink, { c: Ck, eh: E[0], ev: E[1], R, T, eps: EPS, phase: 0, bead: BEAD, reach: REACH, what: `ring ${k + 1}` });
		check(r.arrows.filter((a) => !a.stretch).every((a) => near(a.from.y, Ck.y, 1e-9)) && r.arrows.filter((a) => a.stretch).every((a) => near(a.from.x, Ck.x, 1e-9)), 'the squeeze is not along x');
		const O = Ck.clone().add(v3(...GN, 0));
		if (k === 0) {
			const tips = gnomon(ink, O, [{ d: E[0], tex: 'x' }, { d: E[1], tex: 'y' }], GN_LEN, { what: 'the axes' });
			L.push(await ink.label('x', ink.at(tips[0]), [1, 0]), await ink.label('y', ink.at(tips[1]), [0, -1]));
		} else {
			const old = gnomon(ink, O, [{ d: E[0], tex: 'x', color: FAINT }, { d: E[1], tex: 'y', color: FAINT }], GN_LEN, { what: 'the old axes' });
			const tips = gnomon(ink, O, [{ d: turned[0], tex: "x'" }, { d: turned[1], tex: "y'" }], GN_LEN, { what: 'the turned axes' });
			const a = arc(ink, O, RHO, 0, t, { color: DIM, what: 'the arc of theta' });
			const o = ink.at(O), xb = ink.at(tips[0]);
			check(near(Math.atan2(-(xb[1] - o[1]), xb[0] - o[0]), t, 1e-9), 'the drawn turn is not theta, anticlockwise');
			L.push(await ink.label("x'", ink.at(tips[0]), unit(c, -sn)), await ink.label("y'", ink.at(tips[1]), unit(-sn, -c)));
			void old;
			L.push(await ink.label('45^\\circ', ink.at(a.mid), unit(Math.cos(t / 2), -Math.sin(t / 2)), 2.2, DIM));
		}
	}

	// ---- the complex plane
	const Z = v3(36, 0.4 * S, 0);
	const W = ([x, y]) => Z.clone().add(v3(S * x, S * y, 0));
	const ax = planeAxes(ink, Z, S, { h: { lo: -0.45, hi: 2.62, ticks: [1, 2] }, v: { lo: -2.55, hi: 0.65, ticks: [-1, -2] } });
	const sArc = arc(ink, Z, 2 * S, 0, -2 * t, { color: INK, head: 3.2, endGap: PT + 0.7, layer: 2, what: 'the arc from s to s\'' });
	const vArc = arc(ink, Z, 1 * S, 0, -t, { color: DIM, head: 3.2, endGap: PT + 0.7, layer: 2, what: 'the arc from v to v\'' });
	for (const [z, col, what] of [[s, INK, 's'], [s2, INK, "s'"], [v, DIM, 'v'], [v2, DIM, "v'"]]) point(ink, W(z), { color: col, what: `the point ${what}` });
	// the arcs end on their points
	check(near(sArc.pts[0].distanceTo(W(s)), 0, 1e-9) && near(vArc.pts[0].distanceTo(W(v)), 0, 1e-9), 'an arc does not start on its point');

	// the points' names below and to the right, outside the arcs that leave them; the ticks' values above the axis
	L.push(await ink.label('s', ink.at(W(s)), unit(1, 0.8)));
	L.push(await ink.label("s'", ink.at(W(s2)), unit(1, 0.6)));
	L.push(await ink.label('v', ink.at(W(v)), unit(1, 0.8), 2.2, DIM));
	L.push(await ink.label("v'", ink.at(W(v2)), unit(-1, 1), 2.2, DIM));
	L.push(await ink.label('e^{-2i\\theta}', ink.at(sArc.mid), unit(Math.cos(-t), -Math.sin(-t)), 2.2, INK));
	L.push(await ink.label('e^{-i\\theta}', ink.at(W([0.5, -0.32])), [-1, -0.0001], 0, DIM));
	for (const { t: x, q } of ax.h.ticks) L.push(await ink.label(`${x}`, ink.at(q), [0, -1], 2.4, DIM));
	for (const { t: y, q } of ax.v.ticks) L.push(await ink.label(y === -1 ? '-i' : '-2i', ink.at(q), [-1, 0], 2.4, DIM));
	L.push(await ink.label('\\mathrm{Re}', ink.at(ax.h.tip), [1, 0], 2.2, DIM));
	L.push(await ink.label('\\mathrm{Im}', ink.at(ax.v.tip), [0, -1], 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
