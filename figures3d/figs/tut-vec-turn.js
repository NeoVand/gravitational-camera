// The tutorial, chapter 1.1 (tutorial/newton/vectors-and-indices.md), its second diagram: turning the axes changes
// the components, not the arrow. A step of one unit due east, drawn once, seen from straight above, under two sets
// of axes in the horizontal plane: east and north (blue), and the same axes turned by 45 degrees to north-east and
// north-west (orange). On the first set the arrow lies along the east axis, so its shadows are 1 and 0; on the
// turned set a dotted line falls from its tip at right angles onto each axis, and its shadows, the orange arrows,
// are 0.707 along north-east and 0.707 the negative way along north-west. Exact: the turn (45 degrees, asserted
// on the page), the arrow's length (one unit, S points), the feet of the perpendiculars (asserted at right angles,
// and at 0.707 S points from the origin on the page), the signs, and the length of the arrow, the same in both
// sets: 1^2 + 0^2 = 0.707^2 + 0.707^2. Nothing is schematic.
import { Panel, v3, ACCENT, ACCENT2, INK, FAINT, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR } from './tut-vec-lib.js';

export const TURN_BY = 45;                // degrees, the turn of the second set of axes
const S = 118;                            // points per unit: the arrow's length
const SHADOW = 0.85;                      // a shadow's stroke
const ARC = 0.3;                          // the radius of the angle's arc, units
const name = 'tut-vec-turn';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
// the axes: direction, how far each runs the positive and the negative way (units), colour and word
const t = (TURN_BY * Math.PI) / 180;
const AXES = [
	{ d: v3(1, 0, 0), pos: 1.32, neg: 0.3, color: ACCENT2, word: 'east', side: unit(1, 0) },
	{ d: v3(0, 1, 0), pos: 0.92, neg: 0.3, color: ACCENT2, word: 'north', side: unit(0, -1) },
	{ d: v3(Math.cos(t), Math.sin(t), 0), pos: 1.02, neg: 0.3, color: ACCENT, word: 'north-east', side: unit(0.45, -1) },
	{ d: v3(-Math.sin(t), Math.cos(t), 0), pos: 0.8, neg: 0.9, color: ACCENT, word: 'north-west', side: unit(-0.45, -1) }
];

export default async function () {
	// seen from straight above: world x is east and world y north on the page
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: 0, turn: 0 });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const a = v3(1, 0, 0);                                   // the step: one unit due east
	const sc = (p) => ink.at(p);
	const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

	// the second set is the first turned by TURN_BY: unit vectors at right angles, the first at TURN_BY from east
	const [e1, e2, f1, f2] = AXES.map((x) => x.d);
	check(near(f1.dot(f2), 0, 1e-12) && near(f1.length(), 1, 1e-12) && near(f2.length(), 1, 1e-12), 'the turned axes are not unit vectors at right angles');
	check(near(f1.clone().cross(f2).z, 1, 1e-12) && near(e1.clone().cross(e2).z, 1, 1e-12), 'a set of axes is not right-handed');
	check(near((Math.acos(e1.dot(f1)) * 180) / Math.PI, TURN_BY, 1e-9), 'the turn is not 45 degrees');
	// on the page, too: the angle between the drawn east and north-east axes
	const pe = sc(e1), pf = sc(f1), po = sc(O);
	const angle = (Math.acos(((pe[0] - po[0]) * (pf[0] - po[0]) + (pe[1] - po[1]) * (pf[1] - po[1])) / (dist(pe, po) * dist(pf, po))) * 180) / Math.PI;
	check(near(angle, TURN_BY, 1e-9), 'the drawn turn is not 45 degrees');

	// ---- the axes: thin, through the origin, a head at the positive end
	for (const x of AXES) {
		ink.arrow(x.d.clone().multiplyScalar(-x.neg), x.d.clone().multiplyScalar(x.pos), { color: x.color, width: AXIS, head: AXIS_HEAD, layer: 0, what: `the ${x.word} axis` });
	}

	// ---- the components: on the first set, (1, 0); on the turned set, the feet of the perpendiculars from the tip
	const old = [a.dot(e1), a.dot(e2)], comps = [a.dot(f1), a.dot(f2)];
	check(near(old[0], 1, 1e-12) && near(old[1], 0, 1e-12), 'the components on the first axes are not (1, 0)');
	check(near(comps[0], Math.SQRT1_2, 1e-12) && near(comps[1], -Math.SQRT1_2, 1e-12), 'the components on the turned axes are not (0.707, -0.707)');
	check(+comps[0].toFixed(3) === 0.707 && +comps[1].toFixed(3) === -0.707, 'the printed components are not the components');
	check(near(old[0] ** 2 + old[1] ** 2, comps[0] ** 2 + comps[1] ** 2, 1e-12), 'the arrow\'s length changes with the axes');
	const feet = [f1.clone().multiplyScalar(comps[0]), f2.clone().multiplyScalar(comps[1])];
	for (let i = 0; i < 2; i++) {
		const drop = a.clone().sub(feet[i]);
		check(near(drop.dot([f1, f2][i]), 0, 1e-12), `the light onto turned axis ${i + 1} is not at right angles to it`);
		// on the page: the foot is 0.707 of the arrow's length from the origin
		check(near(dist(sc(feet[i]), po) / dist(sc(a), po), Math.SQRT1_2, 1e-9), `the shadow on turned axis ${i + 1} is not 0.707 on the page`);
		ink.arrow(O, feet[i], { color: ACCENT, width: SHADOW, head: VEC_HEAD, layer: 2, what: `the shadow on turned axis ${i + 1}` });
		ink.right(feet[i], drop.clone().normalize(), feet[i].clone().normalize(), { what: `the right angle on turned axis ${i + 1}` });
	}
	check(near(dist(sc(a), po), S, 1e-9), 'the arrow is not one unit long on the page');

	// ---- the arrow, over everything, and the light from its tip onto the turned axes, dotted
	ink.arrow(O, a, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow a' });
	ink.dot(O);
	for (let i = 0; i < 2; i++) ink.dots(a, feet[i], { color: FAINT, clear0: 0, clear1: 0.9, layer: 1, avoid: ['the arrow a', 'the east axis'], what: `the light onto turned axis ${i + 1}` });

	// ---- the turn: an arc from north to north-west, where the page is empty
	const arc = Array.from({ length: 61 }, (_, k) => {
		const s = Math.PI / 2 + (t * k) / 60;
		return v3(ARC * Math.cos(s), ARC * Math.sin(s), 0);
	});
	ink.curve(arc, { color: DIM, width: HAIR, layer: 1, what: 'the arc of the turn' });

	// ---- labels
	const L = [];
	const midAt = (p, f = 0.5) => sc(p.clone().multiplyScalar(f));
	L.push(await ink.label('\\boldsymbol a', midAt(a, 0.62), unit(0, -1), 2.6, INK));
	L.push(await ink.label('1', midAt(a, 0.62), unit(0, 1), 2.6, ACCENT2));
	L.push(await ink.label('0.707', midAt(feet[0]), unit(-1, -1), 2.4, ACCENT));
	L.push(await ink.label('-0.707', midAt(feet[1]), unit(-1, 1), 2.4, ACCENT));
	const mid = Math.PI / 2 + t / 2;
	L.push(await ink.label('45^\\circ', sc(v3(ARC * Math.cos(mid), ARC * Math.sin(mid), 0)), [Math.cos(mid), -Math.sin(mid)], 2.2, DIM));
	for (const x of AXES) L.push(await ink.label(`\\text{${x.word}}`, sc(x.d.clone().multiplyScalar(x.pos)), x.side, 2.2, x.color));

	ink.checkAll(L);
	return finish(name, P, L);
}
