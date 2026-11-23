// The tutorial, chapter 1.1 (tutorial/newton/vectors-and-indices.md), its first diagram: a vector's components are
// its shadows on three axes. One arrow a from the origin, with the axes east (1), north (2) and up (3) drawn in
// true 3D (an orthographic view, turned and tilted as lib.js's Panel does); from the arrow's tip a dotted line
// falls at right angles onto each axis, as light falling at right angles to that axis would, and marks the end of
// the arrow's shadow there, a_i e_i, drawn as an orange arrow from the origin. Exact: each shadow is the
// perpendicular projection of a onto its axis in the drawing's 3D (each dotted line is at right angles to its
// axis, asserted, and the right-angle marks are squares in that 3D, seen in the same projection); the shadows add
// up to a; one component, a_3, is negative, so its shadow points down, along the up axis's negative half.
// Schematic: the particular arrow, a = (0.55, 0.9, -0.75) in units of the drawing.
import { Panel, v3, ACCENT, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-vec-lib.js';

export const A = [0.55, 0.9, -0.75];      // the arrow's components: east, north, up
export const TILT = 20, TURN = -120;      // the view, degrees (lib.js: turn about the vertical, then tilt)
const S = 124;                            // points per unit
const POS = [1.2, 1.25, 0.4];            // each axis's positive part, units
const NEG_LEN = 1.02;                     // the negative half drawn of the axis whose component is negative, units
const SHADOW = 0.85;                      // a shadow's stroke
const name = 'tut-vec-shadows';
const check = checker(name);

// world coordinates are three.js's (y up): east is +x, north is -z, up is +y
const E = [v3(1, 0, 0), v3(0, 0, -1), v3(0, 1, 0)];
const WORDS = ['east', 'north', 'up'], OPPOSITE = ['west', 'south', 'down'];

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
// where each label stands, as a direction from what it names (figure coordinates, y down)
const SHADOW_SIDE = [unit(-0.45, -1), unit(0.15, -1), unit(-1, 0)];
const AT = [0.5, 0.5, 0.74];               // where along each shadow its label stands
const ARROW_SIDE = unit(1, -0.3);
const END_SIDE = [unit(-0.6, 1), unit(1, 0.2), unit(0, -1)];
const NEG_SIDE = unit(0, 1);

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const a = E[0].clone().multiplyScalar(A[0]).addScaledVector(E[1], A[1]).addScaledVector(E[2], A[2]);

	// the frame is right-handed (e1 x e2 = e3), and one component is negative
	check(E[0].clone().cross(E[1]).distanceTo(E[2]) < 1e-12, 'the axes are not right-handed');
	const NEG = A.findIndex((x) => x < 0);
	check(A.filter((x) => x < 0).length === 1, 'not exactly one negative component');

	// ---- the axes: thin, with heads; the axis of the negative component runs on the other way, without one
	for (let i = 0; i < 3; i++) {
		check(POS[i] > Math.max(A[i], 0) + 0.2, `the ${WORDS[i]} axis is too short for its shadow`);
		ink.arrow(O, E[i].clone().multiplyScalar(POS[i]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 0, what: `the ${WORDS[i]} axis` });
	}
	check(NEG_LEN > -A[NEG] + 0.2, 'the negative half of the axis is too short for the shadow');
	ink.line(O, E[NEG].clone().multiplyScalar(-NEG_LEN), { color: DIM, width: AXIS, layer: 0, what: `the ${OPPOSITE[NEG]} half of the axis` });

	// ---- the shadows: a_i e_i, at the feet of the perpendiculars from the tip
	const feet = A.map((ai, i) => E[i].clone().multiplyScalar(ai));
	for (let i = 0; i < 3; i++) {
		const drop = a.clone().sub(feet[i]);
		check(near(drop.dot(E[i]), 0, 1e-12), `the light onto axis ${i + 1} is not at right angles to it`);
		check(near(a.dot(E[i]), A[i], 1e-12), `the shadow on axis ${i + 1} is not a . e${i + 1}`);
		ink.arrow(O, feet[i], { color: ACCENT, width: SHADOW, head: VEC_HEAD, layer: 2, what: `the shadow a${i + 1}` });
		// the right-angle mark at the foot, between the light (toward the tip) and the axis beyond the foot (clear of the head)
		ink.right(feet[i], drop.clone().normalize(), feet[i].clone().normalize(), { what: `the right angle on axis ${i + 1}` });
	}
	check(feet.reduce((s, f) => s.add(f), v3(0, 0, 0)).distanceTo(a) < 1e-12, 'the shadows do not add up to the arrow');

	// ---- the arrow, and the light: dotted, from the arrow's tip to just clear of the axis
	ink.arrow(O, a, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow a' });
	ink.dot(O);
	// (each passes under the other shadows with air on either side, and starts clear of the arrow)
	for (let i = 0; i < 3; i++) {
		const avoid = ['the arrow a', ...[0, 1, 2].filter((j) => j !== i).map((j) => `the shadow a${j + 1}`)];
		ink.dots(a, feet[i], { color: FAINT, clear0: 0, clear1: 0.9, layer: 1, avoid, what: `the light onto axis ${i + 1}` });
	}

	// ---- labels: each shadow's beside its middle, the arrow's beside its own, the axes' words at their ends
	const sc = (p) => ink.at(p);
	const L = [];
	for (let i = 0; i < 3; i++) L.push(await ink.label(`a_${i + 1}`, sc(feet[i].clone().multiplyScalar(AT[i])), SHADOW_SIDE[i], 2.4, ACCENT));
	L.push(await ink.label('\\boldsymbol a', sc(a.clone().multiplyScalar(0.55)), ARROW_SIDE, 2.6, INK));
	for (let i = 0; i < 3; i++) L.push(await ink.label(`\\text{${WORDS[i]}}`, sc(E[i].clone().multiplyScalar(POS[i])), END_SIDE[i], 2.2, DIM));
	L.push(await ink.label(`\\text{${OPPOSITE[NEG]}}`, sc(E[NEG].clone().multiplyScalar(-NEG_LEN)), NEG_SIDE, 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L);
}
