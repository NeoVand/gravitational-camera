// The tutorial, chapter 2.5 (tutorial/outside/null-space.md), its second diagram: the split of a density drawn as
// geometry. A horizontal plane, the null space N (the confined Laplacians), and a vertical line through its origin,
// the harmonic densities H, at right angles to it, both drawn in true 3D (an orthographic view, turned and tilted as
// lib.js's Panel does, as chapter 1.1's figs/tut-vec-projector.js). An arrow rho from the origin, its shadow rho_h on
// the line, and the dashed segment from rho_h to rho, the part in N, parallel to the plane, with a right-angle mark at
// rho_h. Through rho_h a second, lighter plane parallel to N, the set rho_h + N of densities with the same outside;
// two more arrows from the origin to points of it, in grey, longer than rho_h, which is the shortest.
// Exact: rho_h is rho's projection onto the line (asserted: rho - rho_h is at right angles to it and lies in a plane
// parallel to N); every point of the upper plane differs from rho_h by a member of N (asserted for the drawn ones),
// and rho_h is the shortest arrow to it (asserted for the drawn arrows, and by Pythagoras for every point);
// the right-angle mark is a square in the drawing's 3D. Schematic: the particular arrows, in units of the drawing,
// and the planes' extent: the families are spaces of infinitely many dimensions, drawn as a plane and a line.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, VEC, VEC_HEAD, DASH } from './tut-vec-lib.js';
import { MATTER } from './tut-null-lib.js';

const name = 'tut-null-split';
const check = checker(name);

export const RHO = [0.95, 0.78, 0.42];        // the density, world units (x right, y up, z toward the viewer)
export const OTHERS = [[-1.0, 0.78, 0.62], [1.15, 0.78, -0.62]];   // two more points of rho_h + N
const TILT = 22, TURN = -30;                  // the view, degrees
const S = 94;                                // points per unit
const LOWER = { x: [-0.95, 1.4], z: [-0.95, 0.9] };   // the plane N
const UPPER = { x: [-1.3, 1.5], z: [-0.95, 0.85] };   // the plane rho_h + N
const H_SPAN = [-0.42, 1.5];                 // the line H, world y
const TINT = '#eeebe5';                       // the site's neutral tint of the page (drawing.ts THEME)
const UPPER_OPACITY = 0.55;                   // the second plane, lighter

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0), up = v3(0, 1, 0);
	const rho = v3(...RHO);
	const rhoH = up.clone().multiplyScalar(rho.dot(up));          // the projection onto the line H
	const n = rho.clone().sub(rhoH);                              // the part in N
	check(near(n.dot(up), 0, 1e-12), 'rho - rho_h is not at right angles to H');
	check(near(rhoH.length(), RHO[1], 1e-12), 'rho_h is not rho\'s height');
	const others = OTHERS.map((p) => v3(...p));
	for (const q of [rho, ...others]) {
		check(near(q.clone().sub(rhoH).dot(up), 0, 1e-12), 'a point of the upper plane is not rho_h plus a member of N');
		check(q.length() > rhoH.length() + 0.1, 'an arrow to the upper plane is not longer than rho_h');
		// Pythagoras: |q|^2 = |rho_h|^2 + |q - rho_h|^2
		check(near(q.lengthSq(), rhoH.lengthSq() + q.clone().sub(rhoH).lengthSq(), 1e-12), 'Pythagoras fails');
	}

	// ---- the planes: N a pale tint, rho_h + N the same tint, lighter; no edges
	const square = ({ x, z }, y) => [[x[0], z[0]], [x[1], z[0]], [x[1], z[1]], [x[0], z[1]]].map(([a, c]) => v3(a, y, c));
	const lower = square(LOWER, 0), upper = square(UPPER, rhoH.y);
	P.polygon(lower, { fill: TINT, layer: -3 });
	P.polygon(upper, { fill: TINT, opacity: UPPER_OPACITY, layer: -2 });
	ink.mark([...lower, lower[0]].map((p) => ink.at(p)), 0, 'the plane N\'s edge');
	ink.mark([...upper, upper[0]].map((p) => ink.at(p)), 0, 'the upper plane\'s edge');
	for (const q of [rho, ...others, rhoH]) check(q.x > UPPER.x[0] + 0.2 && q.x < UPPER.x[1] - 0.2 && q.z > UPPER.z[0] + 0.2 && q.z < UPPER.z[1] - 0.2, 'the upper plane does not hold the points with room');

	// ---- the line H: below the plane N dashed (seen through it), above it solid
	ink.line(v3(0, H_SPAN[0], 0), O, { color: FAINT, width: 0.5, dash: DASH, layer: 0, what: 'the line H below N' });
	ink.line(O, v3(0, H_SPAN[1], 0), { color: INK, width: 0.5, layer: 1, what: 'the line H' });

	// ---- the arrows: two more points of the upper plane in grey, rho_h and rho in matter's colour, the part in N dashed
	for (const [k, q] of others.entries()) ink.arrow(O, q, { color: FAINT, width: 0.5, head: VEC_HEAD * 0.85, layer: 2, what: `another arrow ${k}` });
	ink.line(rhoH, rho, { color: DIM, width: 0.55, dash: DASH, layer: 2, what: 'the part in N' });
	ink.arrow(O, rho, { color: MATTER, width: VEC, head: VEC_HEAD, layer: 3, what: 'rho' });
	ink.arrow(O, rhoH, { color: MATTER, width: VEC * 1.15, head: VEC_HEAD, layer: 3, what: 'rho_h' });
	ink.dot(O);
	ink.right(rhoH, v3(0, 1, 0), n.clone().normalize(), { what: 'the right angle at rho_h' });

	// ---- labels
	const at = (p) => ink.at(p);
	const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
	const L = [];
	L.push(await ink.label('\\mathcal{H}', at(v3(0, H_SPAN[1], 0)), unit(0, -1), 2.6, INK));
	L.push(await ink.label('\\rho_h', at(rhoH.clone().multiplyScalar(0.8)), unit(-1, 0), 2.6, MATTER));
	L.push(await ink.label('\\rho', at(rho.clone().multiplyScalar(0.55)), unit(-0.3, -1), 2.6, MATTER));
	L.push(await ink.label('\\mathcal{N}', at(v3(LOWER.x[1] - 0.2, 0, LOWER.z[1] - 0.12)), unit(0, -1), 2.6, INK));
	L.push(await ink.label('\\rho_h + \\mathcal{N}\\text{: same outside}', at(v3(UPPER.x[1] - 0.6, rhoH.y, UPPER.z[0])), unit(0, -1), 2.6, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
