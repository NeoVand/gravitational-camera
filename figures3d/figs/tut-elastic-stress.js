// The tutorial, section 4.3 (tutorial/response/elastic-bodies.md), its second diagram: the stress on a small cube.
// A cube with its edges along the axes x (toward the viewer, to the left), y (to the right) and z (up), drawn in true
// 3D as section 1.3's box (figs/tut-gauss-box.js: an orthographic view, turned and tilted as lib.js's Panel does), but
// opaque: the three edges that meet at the corner farthest from the viewer are hidden. On its face normal to x, tinted, three arrows
// from the face's centre: T_xx along x, out of the face (orange, a tension), and T_yx along y and T_zx along z, lying
// in the face. On the face normal to y, the arrow T_xy along x, as long as T_yx; a small tick across each of the two
// marks their equal lengths, and the line "T_xy = T_yx" under the cube says it.
// Exact: the cube's edges lie along the axes and are equal; the visible faces are those whose outward normals +x, +y
// and +z point toward the viewer, and the hidden edges those at the far corner (asserted); each arrow starts at its
// face's centre and runs along its axis, the in-face arrows at right angles to the face's normal and ending inside the
// face, T_xx along the normal and outward (asserted); T_xy and T_yx equal in length in space (asserted), so that they
// differ on the page only by the view, and both point toward the edge their faces share, so that their torques about
// z cancel: (T_yx - T_xy) a^3 = 0 (the chapter's torque, asserted with the forces at the faces' centres). Schematic:
// the arrows' lengths.
import { Panel, v3, INK, DIM, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR } from './tut-vec-lib.js';
import { TINT, EDGE, face, cameraAxes } from './tut-gauss-lib.js';

const name = 'tut-elastic-stress';
const check = checker(name);

const A = 1;                              // the cube's side, units
const T_XX = 0.62, T_YX = 0.4, T_ZX = 0.3; // the arrows' lengths, units (schematic); T_xy = T_yx
const TILT = 20, TURN = -55;              // the view, degrees
const S = 110;                            // points per unit
const TICK = 2.2;                         // half an equal-length tick, points
const GNOMON = 0.3;                       // the axes' length, units

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	// the chapter's axes in the world of three.js (y up): x toward the viewer, y to the right, z up
	const X = v3(0, 0, 1), Y = v3(1, 0, 0), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	P.centre = pt(0, 0, 0);
	const [right, up, toward] = cameraAxes(P);
	for (const n of [X, Y, Z]) check(n.dot(toward) > 0.2, 'a face drawn as visible faces away from the viewer');
	check(X.dot(right) < 0 && Y.dot(right) > 0, 'x does not point to the left and y to the right');

	// ---- the cube, centred on the origin, opaque: its corners and the nine edges that the viewer sees (those not at
	// the far corner)
	const h = A / 2;
	const V = [];
	for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) V.push({ ijk: [i, j, k], p: pt(i * h, j * h, k * h) });
	const back = V.reduce((a, b) => (b.p.dot(toward) < a.p.dot(toward) ? b : a));
	check(back.ijk.join() === '-1,-1,-1', 'the hidden corner is not the corner at -x, -y, -z');
	let seen = 0;
	for (const a of V) for (const b of V) {
		const diff = a.ijk.map((x, k) => b.ijk[k] - x);
		if (diff.filter((x) => x !== 0).length !== 1 || diff.some((x) => x < 0)) continue;
		check(near(a.p.distanceTo(b.p), A, 1e-12), 'an edge is not the cube\'s side');
		if (a === back || b === back) continue;
		ink.line(a.p, b.p, { color: INK, width: EDGE, layer: 1, what: `the edge ${a.ijk.join('')}-${b.ijk.join('')}` });
		seen++;
	}
	check(seen === 9, 'the cube does not show nine edges');
	// the face normal to x, tinted
	face(ink, [pt(h, -h, -h), pt(h, h, -h), pt(h, h, h), pt(h, -h, h)], TINT, -2);

	// ---- the arrows: on the face normal to x, the column T_ix; on the face normal to y, T_xy
	const cx = pt(h, 0, 0), cy = pt(0, h, 0);
	const inFace = (c, n, d, len) => {
		const end = c.clone().addScaledVector(d, len);
		check(near(d.dot(n), 0, 1e-12), 'an arrow in a face is not at right angles to its normal');
		const rel = end.clone().sub(c);
		check([X, Y, Z].every((e) => Math.abs(rel.dot(e)) < h - 0.05), 'an arrow in a face leaves the face');
		return end;
	};
	const txx = ink.arrow(cx, cx.clone().addScaledVector(X, T_XX), { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'T_xx' });
	check(X.dot(cx.clone().sub(pt(0, 0, 0))) > 0, 'T_xx does not point out of the cube');
	const tyx = ink.arrow(cx, inFace(cx, X, Y, T_YX), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'T_yx' });
	const tzx = ink.arrow(cx, inFace(cx, X, Z, T_ZX), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'T_zx' });
	const T_XY = T_YX;
	const txy = ink.arrow(cy, inFace(cy, Y, X, T_XY), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'T_xy' });
	// the torque about z of the pair on the faces +x, -x (T_yx along +-y) and +y, -y (T_xy along +-x): zero
	const torque = [[cx, Y.clone().multiplyScalar(T_YX)], [cx.clone().negate(), Y.clone().multiplyScalar(-T_YX)],
		[cy, X.clone().multiplyScalar(T_XY)], [cy.clone().negate(), X.clone().multiplyScalar(-T_XY)]]
		.reduce((s, [r, f]) => s + r.clone().cross(f).dot(Z) * A * A, 0);
	check(near(torque, (T_YX - T_XY) * A ** 3, 1e-12) && near(torque, 0, 1e-12), 'the pair does not balance');

	// the equal-length ticks, across the middle of each shaft
	for (const [a, what] of [[tyx, 'T_yx'], [txy, 'T_xy']]) {
		const mid = [a.A[0] + (a.u[0] * (a.L - a.head)) / 2, a.A[1] + (a.u[1] * (a.L - a.head)) / 2], w = [-a.u[1], a.u[0]];
		const p0 = [mid[0] - w[0] * TICK, mid[1] - w[1] * TICK], p1 = [mid[0] + w[0] * TICK, mid[1] + w[1] * TICK];
		P.items.push({ kind: 'raw', layer: 3, depth: 0, svg: `<path d="M${p0[0].toFixed(2)},${p0[1].toFixed(2)}L${p1[0].toFixed(2)},${p1[1].toFixed(2)}" stroke="${INK}" stroke-width="${HAIR + 0.1}" fill="none"/>` });
		ink.mark([p0, p1], (HAIR + 0.1) / 2, `${what}'s tick`);
	}

	// ---- the axes, a small gnomon to the left of the cube, placed on the page beside the tinted face's upper corner
	const O = pt(h, -h, h).addScaledVector(right, -0.52).addScaledVector(up, -0.12);
	const tips = [[X, 'x'], [Y, 'y'], [Z, 'z']].map(([d, t]) => {
		const tip = O.clone().addScaledVector(d, GNOMON);
		ink.arrow(O, tip, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: `the axis ${t}` });
		return { tip, t, d };
	});

	// ---- labels
	const L = [];
	const lxx = await ink.label('T_{xx}', txx.B, unit(-1, 0), 2.2, ACCENT);
	L.push(lxx, await placed('\\text{tension}', (lxx.box.l + lxx.box.r) / 2, lxx.box.b + 2.6, 0.5, 0, ACCENT));
	L.push(await ink.label('T_{yx}', tyx.B, unit(-0.35, 1), 2.2, INK));
	L.push(await ink.label('T_{zx}', tzx.B, unit(0, -1), 2.2, INK));
	L.push(await ink.label('T_{xy}', txy.B, unit(0.35, 1), 2.2, INK));
	for (const { tip, t, d } of tips) {
		const s = ink.at(tip), o = ink.at(O);
		L.push(await ink.label(t, s, unit(s[0] - o[0], s[1] - o[1]), 2.2, DIM));
		void d;
	}
	const low = Math.max(...ink.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)), ...L.map((l) => l.box.b));
	L.push(await placed('T_{xy} = T_{yx}', ink.at(pt(0, 0, -h))[0], low + 7, 0.5, 0, INK));

	ink.checkAll(L);
	return finish(name, P, L, [240, 320]);
}
