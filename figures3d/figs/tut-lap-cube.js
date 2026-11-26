// The tutorial, section 2.1 (tutorial/outside/laplace.md), its first diagram: the rule of the six neighbours. A point
// and its six neighbours at the distance b along the axes, the centres of the faces of a cube of side 2b about it,
// drawn in true 3D (an orthographic view, turned and tilted as lib.js's Panel does; the three edges that meet at the
// corner farthest from the viewer dashed), with the value of f = x^2 - y^2 written beside each point, in square
// metres. The centre is at (0.3, 0.2, 0) m and b = 0.1 m, as in the chapter. Under the cube, one line: the average
// of the six is 0.05, the value at the centre. Exact: the seven values, computed here from f and asserted against
// the printed ones; their average, equal to the centre's value (f is harmonic and has no fourth derivatives); the
// points at the face centres, a distance b from the centre along x, y and z. Chosen for the drawing: the view.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, placed, finish, checker, near, AXIS, AXIS_HEAD, HAIR, DASH } from './tut-vec-lib.js';
import { cameraAxes } from './tut-gauss-lib.js';

const name = 'tut-lap-cube';
const check = checker(name);

// ---- the numbers of the chapter (metres) --------------------------------------------------------------------------
export const CENTRE = [0.3, 0.2, 0];
export const B = 0.1;
export const f = ([x, y]) => x * x - y * y;
/** The six neighbours: [axis, sign, place]. */
export const NEIGHBOURS = [0, 1, 2].flatMap((k) => [1, -1].map((s) => {
	const p = [...CENTRE];
	p[k] += s * B;
	return { k, s, p };
}));
// the values the chapter prints: centre 0.05; along x 0.12 and 0.00; along y 0.00 and 0.08; along z 0.05 and 0.05
const PRINTED = { centre: '0.05', '0+': '0.12', '0-': '0.00', '1+': '0.00', '1-': '0.08', '2+': '0.05', '2-': '0.05' };

// ---- the drawing --------------------------------------------------------------------------------------------------
const S = 87;                       // points per b
const TILT = 19, TURN = 33;         // the view, degrees
const EDGE = 0.45;                  // the cube's edges (a guide, so lighter than a body's)
const SPOKE = 0.5;                  // centre to neighbour
const PT = 1.45;                    // a point's dot, radius in points
const GNOMON = 0.5;                 // the axes' length, in b

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	// ---- the numbers
	const fc = f(CENTRE);
	check(PRINTED.centre === fc.toFixed(2), `the centre's value is ${fc}`);
	let sum = 0;
	for (const n of NEIGHBOURS) {
		const v = f(n.p);
		sum += v;
		check(PRINTED[`${n.k}${n.s > 0 ? '+' : '-'}`] === (Math.abs(v) < 1e-12 ? 0 : v).toFixed(2), `the value at ${n.p} is ${v}`);
	}
	check(near(sum / 6, fc, 1e-15), `the six average ${sum / 6}, not ${fc}`);
	// the rule of the chapter: the excess of the average is b^2/6 times the Laplacian, here 2 - 2 = 0
	const lap = 2 - 2;
	check(near(sum / 6 - fc, (B * B / 6) * lap, 1e-15), 'the excess is not b^2/6 times the Laplacian');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the chapter's axes in three.js's world (y up): x to the right, y away from the viewer, z up; in units of b
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const AX = [X, Y, Z];
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	const [, , toward] = cameraAxes(P);

	// ---- the cube of side 2b about the centre: twelve edges, those at the corner farthest from the viewer dashed
	const V = [];
	for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) V.push({ ijk: [i, j, k], p: pt(i, j, k) });
	const back = V.reduce((a, b) => (b.p.dot(toward) < a.p.dot(toward) ? b : a));
	for (const a of V) for (const b of V) {
		const diff = a.ijk.map((x, k) => b.ijk[k] - x);
		if (diff.filter((x) => x !== 0).length !== 1 || diff.some((x) => x < 0)) continue;
		const hidden = a === back || b === back;
		ink.line(a.p, b.p, { color: FAINT, width: hidden ? HAIR : EDGE, layer: 0, dash: hidden ? DASH : null, what: `the edge ${a.ijk.join('')}-${b.ijk.join('')}` });
	}

	// ---- the spokes and the seven points
	const O = pt(0, 0, 0);
	const pts = NEIGHBOURS.map((n) => ({ ...n, q: AX[n.k].clone().multiplyScalar(n.s) }));
	for (const n of pts) {
		check(near(n.q.length(), 1, 1e-12), 'a neighbour is not at the distance b');
		// on a face of the cube: one coordinate +-1, the others 0
		ink.line(O, n.q, { color: DIM, width: SPOKE, layer: 1, what: `the spoke ${n.k}${n.s}` });
	}
	for (const n of pts) ink.dot(n.q, { r: PT, color: INK, layer: 4, what: `the point ${n.k}${n.s}` });
	ink.dot(O, { r: PT, color: INK, layer: 4, what: 'the centre' });

	// ---- the axes, from a point below and to the left of the cube's nearest corner, clear of it
	const G0 = pt(-2.0, -1, -1.1);
	const tips = AX.map((d, k) => {
		const tip = G0.clone().addScaledVector(d, GNOMON);
		ink.arrow(G0, tip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the axis ${'xyz'[k]}` });
		return tip;
	});

	// ---- labels: each value beside its point, out along the spoke's direction on the page
	const L = [];
	const sc = (p) => ink.at(p);
	const C = sc(O);
	for (const n of pts) {
		const Q = sc(n.q);
		const u = unit(Q[0] - C[0], Q[1] - C[1]);
		L.push(await ink.label(PRINTED[`${n.k}${n.s > 0 ? '+' : '-'}`], Q, u, 2.2, INK));
	}
	// the centre's value, in the widest gap between the spokes on the page
	const dirs = pts.map((n) => { const Q = sc(n.q); return Math.atan2(Q[1] - C[1], Q[0] - C[0]); }).sort((a, b) => a - b);
	let gap = 0, mid = 0;
	dirs.forEach((a, i) => { const b = i + 1 < dirs.length ? dirs[i + 1] : dirs[0] + 2 * Math.PI; if (b - a > gap) { gap = b - a; mid = (a + b) / 2; } });
	L.push(await ink.label(PRINTED.centre, C, [Math.cos(mid), Math.sin(mid)], 2.4, INK));
	// b, along the spoke to x + b
	const half = sc(pt(0.5, 0, 0));
	L.push(await ink.label('b', half, unit(0.2, 1), 2.2, INK));
	for (const [k, tip] of tips.entries()) {
		const T = sc(tip), A = sc(G0);
		L.push(await ink.label('xyz'[k], T, unit(T[0] - A[0], T[1] - A[1]), 2.2, DIM));
	}

	// ---- the line under the cube
	let low = -Infinity;
	for (const m of ink.marks) for (const p of m.pts) low = Math.max(low, p[1] + m.r);
	for (const l of L) low = Math.max(low, l.box.b);
	const line = await placed('\\tfrac16\\,(0.12 + 0.00 + 0.00 + 0.08 + 0.05 + 0.05) = 0.05\\,\\mathrm{m^2}', C[0], low + 9, 0.5, 0, INK);
	L.push(line);

	ink.checkAll(L);
	return finish(name, P, L, [240, 300]);
}

