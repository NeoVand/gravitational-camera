// The tutorial, section 1.5b (tutorial/newton/complex-numbers.md), its first diagram: multiplying two complex numbers
// multiplies their lengths and adds their angles. The complex plane, its axes Re and Im with ticks at whole numbers,
// and three arrows from 0: u1 = 2 e^{i 20 deg}, u2 = 1.5 e^{i 50 deg} and their product u1 u2 = 3 e^{i 70 deg}, each
// with its length printed beside it and its angle from the real axis marked by an arc. Exact: the three numbers (the
// product computed by the rule of the chapter, (x1 x2 - y1 y2) + i (x1 y2 + y1 x2), and asserted to be 3 e^{i 70 deg}),
// each arrow drawn at its true value on the plane's scale, the ticks, and the arcs (radius chosen for room; their
// angles exact). Nothing is schematic.
import { Panel, v3, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { arc, planeAxes } from './tut-five-lib.js';

export const U1 = { r: 2, deg: 20 }, U2 = { r: 1.5, deg: 50 };
const S = 72;                             // points per unit
const ARCS = { u1: 0.62, u2: 1.12, p: 1.78 };  // the angles' arcs, radius in units (u2's clear of the tick at 1)
const name = 'tut-cx-product';
const check = checker(name);

const rad = (d) => (d * Math.PI) / 180;
const polar = ({ r, deg }) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
/** The product by the chapter's rule. */
export const times = ([x1, y1], [x2, y2]) => [x1 * x2 - y1 * y2, x1 * y2 + y1 * x2];

export default async function () {
	const u1 = polar(U1), u2 = polar(U2), p = times(u1, u2);
	const mod = Math.hypot(...p), arg = (Math.atan2(p[1], p[0]) * 180) / Math.PI;
	check(near(mod, 3, 1e-12) && near(arg, 70, 1e-12), `the product is ${mod} at ${arg} degrees, not 3 at 70`);
	check(near(mod, U1.r * U2.r, 1e-12) && near(arg, U1.deg + U2.deg, 1e-12), 'the product does not multiply lengths and add angles');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const O = v3(-1.4 * S, -1.3 * S, 0);
	const W = ([x, y]) => O.clone().add(v3(S * x, S * y, 0));

	const ax = planeAxes(ink, O, S, { h: { lo: -0.22, hi: 3.3, ticks: [1, 2, 3] }, v: { lo: -0.22, hi: 3.05, ticks: [1, 2] } });
	// the arrows, at their true values
	const arrows = [
		{ z: u1, color: DIM, name: 'u_1', len: '2', deg: U1.deg, rho: ARCS.u1 },
		{ z: u2, color: DIM, name: 'u_2', len: '1.5', deg: U2.deg, rho: ARCS.u2 },
		{ z: p, color: INK, name: 'u_1u_2', len: '3', deg: 70, rho: ARCS.p }
	];
	for (const a of arrows) {
		const d = ink.arrow(O, W(a.z), { color: a.color, width: VEC, head: VEC_HEAD, layer: 3, what: `the arrow ${a.name}` });
		check(near(d.L, S * Math.hypot(...a.z), 1e-9), `the arrow ${a.name} is not at its true length`);
	}
	ink.dot(O);
	const arcs = arrows.map((a) => arc(ink, O, a.rho * S, 0, rad(a.deg), { color: a.color === INK ? INK : DIM, what: `the arc of ${a.name}` }));

	// ---- labels
	const L = [];
	const page = (ang) => [Math.cos(ang), -Math.sin(ang)];   // a world direction at the angle ang, on the page
	for (const [i, a] of arrows.entries()) {
		const t = rad(a.deg);
		// the name beyond the tip, the length beside the shaft, the angle beside its arc in the free sector
		L.push(await ink.label(a.name, ink.at(W(a.z)), page(t + [0.0, 0.25, 0][i]), 2.2, a.color));
		const mid = W(a.z.map((x) => x * [0.68, 0.5, 0.5][i]));     // u1's at two thirds, clear of u2's arc
		L.push(await ink.label(a.len, ink.at(mid), page(t + [-1, 1, 1][i] * Math.PI / 2), 2.2, a.color));
		const sector = rad([10, 35, 60][i]);                  // between this arrow and the one below it
		const q = O.clone().add(v3(a.rho * S * Math.cos(sector), a.rho * S * Math.sin(sector), 0));
		L.push(await ink.label(`${a.deg}^\\circ`, ink.at(q), page(sector), 2.2, a.color === INK ? INK : DIM));
		void arcs;
	}
	for (const { t, q } of ax.h.ticks) L.push(await ink.label(`${t}`, ink.at(q), [0, 1], 2.4, DIM));
	for (const { t, q } of ax.v.ticks) L.push(await ink.label(t === 1 ? 'i' : `${t}i`, ink.at(q), [-1, 0], 2.4, DIM));
	L.push(await ink.label('0', ink.at(O), [-0.7, 0.7], 2.4, DIM));
	L.push(await ink.label('\\mathrm{Re}', ink.at(ax.h.tip), [1, 0], 2.2, DIM));
	L.push(await ink.label('\\mathrm{Im}', ink.at(ax.v.tip), [0, -1], 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
