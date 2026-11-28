// The tutorial, section 1.1 (tutorial/newton/vectors-and-indices.md), its fourth diagram: the projector
// P_ij = delta_ij - n_i n_j flattens an arrow onto the plane at right angles to n. A plane drawn in true 3D (an
// orthographic view, turned and tilted as lib.js's Panel does), the unit vector n standing at right angles to it
// (blue), an arrow xi leaning out of the plane (ink), its part along n, n (n . xi), dashed (blue), and its
// flattened image P xi lying in the plane directly below it (orange), as a pencil's shadow lies under light from
// straight above. The triangle of xi, P xi and the dashed part stands upright on the plane, tinted pale blue, so
// that xi is seen to rise out of the plane. n is drawn at its true length, one unit of the drawing (the unit of xi's
// components), so that the dashed part, n . xi = 0.62 units, is drawn 0.62 of n. Exact: P xi is computed with the table P_ij (asserted equal to xi - n (n . xi), to lie in the
// plane, and to be left as it is by P); the dashed part runs from the tip of P xi to the tip of xi, parallel to
// n; the right-angle marks are squares in the drawing's 3D; n's length, a unit, on the drawing's scale. Schematic: the particular arrow, xi = (0.95, 0.62,
// 0.3) (east, up, south) in units of the drawing, and the extent of the plane.
import { Panel, v3, ACCENT, ACCENT2, INK } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, VEC, VEC_HEAD, DASH } from './tut-vec-lib.js';

export const XI = [0.95, 0.62, 0.3];      // the arrow, world coordinates (x, y up, z toward the viewer)
export const TILT = 20, TURN = -28;       // the view, degrees
const S = 124;                            // points per unit
const N_LEN = 1;                          // the length n is drawn, units: a unit vector, one unit of the drawing, so that the
                                          // dashed part, n . xi = 0.62 units, is drawn 0.62 of n's length
const PLANE = { x: [-0.42, 1.34], z: [-0.36, 0.62] };   // the plane's extent, world units
const PLANE_TINT = '#eeebe5';             // the site's neutral tint of the page (drawing.ts THEME)
const SAIL_TINT = '#dce7f3';              // the site's pale blue: the upright triangle O, P xi, xi standing on the plane
const SHADOW = 0.85;
const name = 'tut-vec-projector';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const n = v3(0, 1, 0);                                  // the unit vector, at right angles to the plane y = 0
	const xi = v3(...XI);

	// ---- the projector, as a table, applied to xi
	const nn = [n.x, n.y, n.z];
	const Pij = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) - nn[i] * nn[j]));
	const apply = (T, v) => v3(...[0, 1, 2].map((i) => T[i][0] * v.x + T[i][1] * v.y + T[i][2] * v.z));
	const Pxi = apply(Pij, xi);
	const along = n.clone().multiplyScalar(n.dot(xi));
	check(Pxi.distanceTo(xi.clone().sub(along)) < 1e-12, 'P xi is not xi - n (n . xi)');
	check(near(Pxi.dot(n), 0, 1e-12), 'P xi does not lie in the plane');
	check(apply(Pij, Pxi).distanceTo(Pxi) < 1e-12, 'P does not leave P xi as it is');
	check(apply(Pij, n).length() < 1e-12, 'P does not send n to zero');
	check(near(Pij[0][0] + Pij[1][1] + Pij[2][2], 2, 1e-12), 'the trace of P is not 2');
	check(n.dot(xi) > 0 && n.dot(xi) < N_LEN, 'xi does not lean out of the plane below the tip of n');
	check(near(N_LEN, n.length(), 1e-15), 'n is not drawn at unit length');

	// ---- the plane: a pale tint, no edge, beneath everything
	const corners = [[PLANE.x[0], PLANE.z[0]], [PLANE.x[1], PLANE.z[0]], [PLANE.x[1], PLANE.z[1]], [PLANE.x[0], PLANE.z[1]]].map(([x, z]) => v3(x, 0, z));
	P.polygon(corners, { fill: PLANE_TINT, layer: -2 });
	// its edge counts as a mark: no label may straddle it
	ink.mark([...corners, corners[0]].map((p) => ink.at(p)), 0, 'the plane\'s edge');
	for (const p of [O, Pxi]) check(p.x > PLANE.x[0] + 0.25 && p.x < PLANE.x[1] - 0.25 && p.z > PLANE.z[0] + 0.25 && p.z < PLANE.z[1] - 0.25, 'the plane does not hold the arrows with room');

	// ---- the upright triangle O, P xi, xi: a pale blue sail standing on the plane, so that xi plainly rises out of it
	P.polygon([O, Pxi, xi], { fill: SAIL_TINT, opacity: 0.85, layer: -1 });
	check(near(v3().subVectors(Pxi, O).cross(v3().subVectors(xi, O)).normalize().dot(n), 0, 1e-12), 'the sail does not stand upright on the plane');

	// ---- the arrows: n (blue), P xi (orange) in the plane, xi (ink) over both; the part along n dashed, blue
	ink.arrow(O, n.clone().multiplyScalar(N_LEN), { color: ACCENT2, width: VEC, head: VEC_HEAD, layer: 2, what: 'n' });
	ink.arrow(O, Pxi, { color: ACCENT, width: SHADOW, head: VEC_HEAD, layer: 2, what: 'P xi' });
	ink.line(Pxi, xi, { color: ACCENT2, width: VEC * 0.8, dash: DASH, layer: 1, what: 'the part of xi along n' });
	ink.arrow(O, xi, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'xi' });
	ink.dot(O);
	check(Pxi.clone().add(along).distanceTo(xi) < 1e-12, 'the dashed part does not join P xi to xi');
	// the right angle at the foot, between the dashed part and the line of P xi beyond it (clear of the head)
	ink.right(Pxi, n, Pxi.clone().normalize(), { what: 'the right angle at the foot' });

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('\\hat n', sc(n.clone().multiplyScalar(N_LEN * 0.72)), unit(-1, 0), 2.6, ACCENT2));
	L.push(await ink.label('\\boldsymbol\\xi', sc(xi.clone().multiplyScalar(0.55)), unit(-0.4, -1), 2.6, INK));
	L.push(await ink.label('\\hat n\\,(\\hat n\\cdot\\boldsymbol\\xi)', sc(Pxi.clone().add(along.clone().multiplyScalar(0.8))), unit(1, 0), 3, ACCENT2));
	L.push(await ink.label('P\\boldsymbol\\xi', sc(Pxi.clone().multiplyScalar(0.55)), unit(0.25, 1), 2.6, ACCENT));

	ink.checkAll(L);
	return finish(name, P, L);
}
