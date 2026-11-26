// The tutorial, section 1.5b (tutorial/newton/complex-numbers.md), its second diagram: Euler's formula as motion
// round the unit circle. The complex plane, its axes Re and Im, the circle of radius 1 (its crossings 1, i, -1, -i labelled),
// the point e^{i theta} at theta = 40 degrees drawn as an arrow from 0, and from its tip its derivative i e^{i theta}
// (orange), the same length, at right angles to it and so tangent to the circle; the arc of the circle from 1 to
// e^{i theta}, of length theta, drawn heavier. Exact: the point (cos theta, sin theta), on the circle; the derivative
// (-sin theta, cos theta), asserted to be i times the point (by the chapter's product rule), of length 1 and at
// right angles to it on the page; the arc, the circle's own points from 0 to theta, of length theta on the plane's
// scale. Nothing is schematic.
import { Panel, v3, INK, DIM, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, VEC, VEC_HEAD, HAIR } from './tut-vec-lib.js';
import { arc, planeAxes } from './tut-five-lib.js';
import { times } from './tut-cx-product.js';

export const THETA = 40;                  // degrees
const S = 92;                             // points per unit: the circle's radius
const ARC = 0.75;                         // the arc from 1 to e^{i theta}: its stroke (VEC)
const name = 'tut-cx-euler';
const check = checker(name);

export default async function () {
	const t = (THETA * Math.PI) / 180;
	const f = [Math.cos(t), Math.sin(t)];
	const df = [-Math.sin(t), Math.cos(t)];                  // the derivative of (cos, sin)
	const iF = times([0, 1], f);
	check(near(iF[0], df[0], 1e-15) && near(iF[1], df[1], 1e-15), 'the derivative is not i times the point');
	check(near(Math.hypot(...f), 1, 1e-15) && near(Math.hypot(...df), 1, 1e-15), 'the point or its derivative is not of length 1');
	check(near(f[0] * df[0] + f[1] * df[1], 0, 1e-15), 'the derivative is not at right angles to the point');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const O = v3(0, -0.15 * S, 0);
	const W = ([x, y]) => O.clone().add(v3(S * x, S * y, 0));

	// no ticks: the circle crosses each axis at 1, i, -1 and -i, and its crossings are labelled
	const ax = planeAxes(ink, O, S, { h: { lo: -1.25, hi: 1.32 }, v: { lo: -1.25, hi: 1.55 } });
	ax.h.ticks = [-1, 1].map((t) => ({ t, q: W([t, 0]) }));
	ax.v.ticks = [-1, 1].map((t) => ({ t, q: W([0, t]) }));
	const circle = Array.from({ length: 1441 }, (_, k) => W([Math.cos((2 * Math.PI * k) / 1440), Math.sin((2 * Math.PI * k) / 1440)]));
	ink.curve(circle, { color: DIM, width: HAIR, layer: 1, what: 'the unit circle' });
	// the arc from 1 to e^{i theta}: the circle's own points, heavier
	const a = arc(ink, O, S, 0, t, { color: INK, width: ARC, layer: 2, what: 'the arc theta' });
	let len = 0;
	for (let i = 1; i < a.pts.length; i++) len += a.pts[i].distanceTo(a.pts[i - 1]);
	check(near(len / S, t, 1e-5), `the arc is ${len / S} long, not theta`);

	const tip = W(f), end = W([f[0] + df[0], f[1] + df[1]]);
	ink.arrow(O, tip, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the point' });
	const d = ink.arrow(tip, end, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the derivative' });
	check(near(d.L, S, 1e-9), 'the derivative is not drawn at length 1');
	// the right angle in the corner outside the circle, clear of the point's head
	ink.right(tip, v3(f[0], f[1], 0), v3(df[0], df[1], 0), { what: 'the right angle at the tip' });
	ink.dot(O);

	// ---- labels
	const L = [];
	const page = (ang) => [Math.cos(ang), -Math.sin(ang)];
	L.push(await ink.label('e^{i\\theta}', ink.at(W(f.map((x) => x * 0.55))), page(t - Math.PI / 2), 2.2, INK));
	L.push(await ink.label('ie^{i\\theta}', ink.at(W([f[0] + 0.55 * df[0], f[1] + 0.55 * df[1]])), page(t), 2.2, ACCENT));
	L.push(await ink.label('\\theta', ink.at(a.mid), page(t / 2), 2.2, INK));
	const tickName = { h: { '-1': '-1', '1': '1' }, v: { '-1': '-i', '1': 'i' } };
	for (const { t: v, q } of ax.h.ticks) L.push(await ink.label(tickName.h[v], ink.at(q), v > 0 ? [0.7, 0.7] : [-0.7, 0.7], 2.4, DIM));
	for (const { t: v, q } of ax.v.ticks) L.push(await ink.label(tickName.v[v], ink.at(q), v > 0 ? [-0.7, -0.7] : [-0.7, 0.7], 2.4, DIM));
	L.push(await ink.label('0', ink.at(O), [-0.7, 0.7], 2.4, DIM));
	L.push(await ink.label('\\mathrm{Re}', ink.at(ax.h.tip), [1, 0], 2.2, DIM));
	L.push(await ink.label('\\mathrm{Im}', ink.at(ax.v.tip), [0, -1], 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
