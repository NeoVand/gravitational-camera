// The tutorial, section 1.3 (tutorial/newton/gauss-and-poisson.md), its third diagram: the flux out of a small box,
// one pair of faces at a time. A box with one corner at (x, y, z) and edges Delta x, Delta y, Delta z along the axes,
// drawn in true 3D (an orthographic view, turned and tilted as lib.js's Panel does; the hidden edges dashed). Its two
// faces at right angles to the x axis are shaded: the face at x (blue), where the field arrow g_x(x) enters, and the
// face at x + Delta x (orange), where the longer arrow g_x(x + Delta x) leaves. On each face its outward normal is
// drawn, -x on the face at x and +x on the face at x + Delta x. Exact: the box's edges lie along the axes, the
// field arrows run along x through the faces' centres, each normal is at right angles to its face and points out of
// the box (asserted), the hidden edges are those that meet at the corner farthest from the viewer. Schematic: the
// box's proportions and the arrows' lengths (only the order matters: g_x grows from x to x + Delta x).
import { Panel, v3, INK, DIM, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, AXIS, AXIS_HEAD, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { TINT_ACCENT, TINT_ACCENT2, EDGE, face, cameraAxes } from './tut-gauss-lib.js';

const DX = 1.35, DY = 1.0, DZ = 0.9;      // the box's edges, units
export const G_IN = 0.62, G_OUT = 0.95;    // the field arrows' lengths, units: g_x(x) and g_x(x + Delta x)
const NORMAL = 0.46;                      // the normals' length, units
const NORMAL_AT = [0.5, 0.86];            // where on its face a normal stands: fractions of Delta y and Delta z
const TILT = 20, TURN = 30;               // the view, degrees
const S = 100;                            // points per unit
const name = 'tut-gauss-box';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the chapter's axes in the world of three.js (y up): x to the right, y away from the viewer, z up
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	P.centre = pt(DX / 2 + (G_OUT - G_IN) / 2, DY / 2, DZ / 2);
	const [, , toward] = cameraAxes(P);

	// ---- the box: its eight corners, and its twelve edges, those at the corner farthest from the viewer dashed
	const corner = (i, j, k) => pt(i * DX, j * DY, k * DZ);
	const V = [];
	for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1]) V.push({ ijk: [i, j, k], p: corner(i, j, k) });
	const back = V.reduce((a, b) => (b.p.dot(toward) < a.p.dot(toward) ? b : a));
	check(back.ijk.join() === '1,1,0', 'the hidden corner is not the far, low corner at x + Delta x');
	for (const a of V) for (const b of V) {
		const diff = a.ijk.map((x, k) => b.ijk[k] - x);
		if (diff.filter((x) => x !== 0).length !== 1 || diff.some((x) => x < 0)) continue;
		const hidden = a === back || b === back;
		ink.line(a.p, b.p, { color: INK, width: hidden ? AXIS * 0.9 : EDGE, layer: hidden ? 0 : 1, dash: hidden ? [2.2, 1.8] : null, what: `the edge ${a.ijk.join('')}-${b.ijk.join('')}` });
	}

	// ---- the two faces at right angles to x, shaded
	const faceAt = (i) => [corner(i, 0, 0), corner(i, 1, 0), corner(i, 1, 1), corner(i, 0, 1)];
	face(ink, faceAt(0), TINT_ACCENT2, -2);
	face(ink, faceAt(1), TINT_ACCENT, -2);

	// ---- the field: along x through the faces' centres, entering at x and leaving, longer, at x + Delta x
	const c0 = pt(0, DY / 2, DZ / 2), c1 = pt(DX, DY / 2, DZ / 2);
	check(G_OUT > G_IN, 'the field does not grow from x to x + Delta x');
	const gin = ink.arrow(c0.clone().addScaledVector(X, -G_IN), c0, { color: ACCENT2, width: VEC, head: VEC_HEAD, layer: 3, what: 'g_x(x)' });
	const gout = ink.arrow(c1, c1.clone().addScaledVector(X, G_OUT), { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'g_x(x + Delta x)' });
	check(gout.L > gin.L, 'the arrow leaving is not drawn longer than the arrow entering');

	// ---- the outward normals, at right angles to their faces, out of the box
	const n0 = pt(0, NORMAL_AT[0] * DY, NORMAL_AT[1] * DZ), n1 = pt(DX, NORMAL_AT[0] * DY, NORMAL_AT[1] * DZ);
	const inside = pt(DX / 2, DY / 2, DZ / 2);
	for (const [p, s, f] of [[n0, -1, faceAt(0)], [n1, 1, faceAt(1)]]) {
		const n = X.clone().multiplyScalar(s);
		check(near(n.dot(f[1].clone().sub(f[0])), 0, 1e-12) && near(n.dot(f[3].clone().sub(f[0])), 0, 1e-12), 'a normal is not at right angles to its face');
		check(n.dot(p.clone().sub(inside)) > 0, 'a normal does not point out of the box');
	}
	ink.arrow(n0, n0.clone().addScaledVector(X, -NORMAL), { color: DIM, width: AXIS + 0.1, head: AXIS_HEAD + 0.6, layer: 3, what: 'the normal -x' });
	ink.arrow(n1, n1.clone().addScaledVector(X, NORMAL), { color: DIM, width: AXIS + 0.1, head: AXIS_HEAD + 0.6, layer: 3, what: 'the normal +x' });

	// ---- the corner (x, y, z)
	const O = corner(0, 0, 0);
	ink.dot(O, { what: 'the corner' });

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('(x, y, z)', sc(O), unit(0, 1), 2.2, INK));
	L.push(await ink.label('\\Delta x', sc(pt(DX * 0.5, 0, 0)), unit(0.15, 1), 2.2, INK));
	L.push(await ink.label('\\Delta y', sc(pt(0, DY * 0.5, 0)), unit(-0.6, 1), 2.2, INK));
	L.push(await ink.label('\\Delta z', sc(pt(DX, 0, DZ * 0.3)), unit(1, 0), 2.2, INK));
	L.push(await ink.label('g_x(x)', sc(c0.clone().addScaledVector(X, -G_IN * 0.78)), unit(0, -1), 2.4, ACCENT2));
	L.push(await ink.label('g_x(x+\\Delta x)', sc(c1.clone().addScaledVector(X, G_OUT * 0.7)), unit(0, 1), 2.4, ACCENT));
	L.push(await ink.label('-x', sc(n0.clone().addScaledVector(X, -NORMAL)), unit(-1, 0), 2.2, DIM));
	L.push(await ink.label('+x', sc(n1.clone().addScaledVector(X, NORMAL)), unit(1, 0), 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 320]);
}
