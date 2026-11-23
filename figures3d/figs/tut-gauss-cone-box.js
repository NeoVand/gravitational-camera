// The tutorial, chapter 1.3 (tutorial/newton/gauss-and-poisson.md), its fourth diagram: arrows that converge can
// have no divergence. A point mass (a small stone ball) and, some way from it, a box cut from a cone of directions of
// solid angle Delta Omega: its inner face, of area r^2 Delta Omega, at the distance r, and its outer face, of area
// (r + Delta r)^2 Delta Omega, at r + Delta r, both at right angles to the cone's axis; its four side faces are
// planes through the mass, so that they lie along the field. Drawn in true 3D (an orthographic view, turned and
// tilted as lib.js's Panel does; the hidden edges dashed). On the axis the field, pointing at the mass, enters the
// outer face (blue, the shorter arrow) and leaves through the inner face (orange, the longer arrow). Exact: the
// arrows' lengths are in the ratio of 1/r^2 to 1/(r + Delta r)^2 and the faces' areas in the ratio of r^2 to
// (r + Delta r)^2, both in 3D and as drawn (asserted on the page: the arrows lie on one line, and the faces are
// parallel squares, so the drawing keeps both ratios), so that length times area is the same on the two faces; each
// face subtends the same solid angle from the mass (asserted, summed from spherical triangles); the side faces
// contain the mass. Schematic: the values of r, Delta r and Delta Omega, and the arrows' scale.
import { Panel, v3, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { TINT_ACCENT, TINT_ACCENT2, EDGE, face, ball, cameraAxes, unitv } from './tut-gauss-lib.js';

export const R_IN = 1.9, R_OUT = 3.0;      // r and r + Delta r, units
export const HALF = 0.16;                  // the half-side of a face over its distance (the cone's square opening)
export const K = 1.9 ** 2 * 0.95;          // the field's strength times the arrows' scale: an arrow is K / r^2 long
const TILT = 11, TURN = 0;                 // the view, degrees
const AXIS_TURN = (34 * Math.PI) / 180;    // the axis, turned toward the viewer from the page's plane
const S = 94;                              // points per unit
const name = 'tut-gauss-cone-box';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
const triangle = (a, b, c) => Math.abs(2 * Math.atan2(a.dot(b.clone().cross(c)), 1 + a.dot(b) + b.dot(c) + c.dot(a)));
/** The area of a planar polygon of figure points (shoelace). */
const area2 = (q) => Math.abs(q.reduce((s, p, i) => s + p[0] * q[(i + 1) % q.length][1] - q[(i + 1) % q.length][0] * p[1], 0)) / 2;

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const [, , toward] = cameraAxes(P);
	// the cone's axis, horizontal, turned toward the viewer by AXIS_TURN from the page's plane; the faces' sides b
	// (upright) and c (horizontal)
	const a = v3(Math.cos(AXIS_TURN), 0, Math.sin(AXIS_TURN)), b = v3(0, 1, 0), c = a.clone().cross(b);
	check(near(a.dot(b), 0, 1e-12) && near(c.length(), 1, 1e-12), 'the cone\'s frame is not at right angles');
	P.centre = a.clone().multiplyScalar(R_OUT * 0.52);

	// ---- the faces: squares at right angles to the axis, centred on it, their half-sides HALF times their distance
	const square = (r) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => a.clone().multiplyScalar(r).addScaledVector(b, i * HALF * r).addScaledVector(c, j * HALF * r));
	const inner = square(R_IN), outer = square(R_OUT);
	// each corner of the outer face lies on the line from the mass through the inner one: the side faces contain the mass
	inner.forEach((p, i) => check(p.clone().cross(outer[i]).length() < 1e-12, 'a side edge does not point at the mass'));
	// the solid angle of each face, seen from the mass, is the same
	const omega = (q) => {
		let s = 0;
		const N = 60, at = (i, j) => q[0].clone().add(q[1].clone().sub(q[0]).multiplyScalar(i / N)).add(q[3].clone().sub(q[0]).multiplyScalar(j / N)).normalize();
		for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) s += triangle(at(i, j), at(i + 1, j), at(i + 1, j + 1)) + triangle(at(i, j), at(i + 1, j + 1), at(i, j + 1));
		return s;
	};
	const wIn = omega(inner), wOut = omega(outer);
	check(near(wIn, wOut, 1e-9), `the faces do not subtend the same solid angle: ${wIn}, ${wOut}`);

	// ---- the arrows: on the axis, each centred on its face, K / r^2 long, pointing at the mass
	const Lin = K / R_IN ** 2, Lout = K / R_OUT ** 2;
	check(R_IN + Lin / 2 < R_OUT - Lout / 2 - 0.15, 'the two arrows overlap');
	const arrowAt = (r, L) => [a.clone().multiplyScalar(r + L / 2), a.clone().multiplyScalar(r - L / 2)];
	const [ai0, ai1] = arrowAt(R_IN, Lin), [ao0, ao1] = arrowAt(R_OUT, Lout);

	// ---- the ratios, in 3D and on the page
	const areaW = (q) => q[1].clone().sub(q[0]).cross(q[3].clone().sub(q[0])).length();
	const ratio = (R_OUT / R_IN) ** 2;
	check(near(areaW(outer) / areaW(inner), ratio, 1e-12), 'the faces\' areas are not in the ratio of the squares of their distances');
	check(near(Lin / Lout, ratio, 1e-12), 'the arrows\' lengths are not in the ratio of the inverse squares of their distances');
	check(near(Lin * areaW(inner), Lout * areaW(outer), 1e-12), 'length times area differs on the two faces');
	const len = (p, q) => Math.hypot(ink.at(q)[0] - ink.at(p)[0], ink.at(q)[1] - ink.at(p)[1]);
	const page = (q) => area2(q.map((p) => ink.at(p)));
	check(near(len(ai0, ai1) / len(ao0, ao1), ratio, 1e-9), 'the drawn arrows are not in the ratio');
	check(near(page(outer) / page(inner), ratio, 1e-9), 'the drawn faces are not in the ratio');
	check(near(len(ai0, ai1) * page(inner), len(ao0, ao1) * page(outer), 1e-6), 'drawn length times drawn area differs on the two faces');

	// ---- the box: its faces' outward normals decide which edges are hidden (both faces of a hidden edge face away)
	const faces = [
		{ pts: [0, 1, 2, 3].map((i) => inner[i]), n: a.clone().negate(), id: 'inner' },
		{ pts: [0, 1, 2, 3].map((i) => outer[i]), n: a.clone(), id: 'outer' }
	];
	for (let i = 0; i < 4; i++) {
		const j = (i + 1) % 4;
		const n = unitv(inner[i].clone().cross(inner[j]));
		faces.push({ pts: [inner[i], inner[j], outer[j], outer[i]], n: n.dot(inner[i].clone().add(inner[j]).sub(a.clone().multiplyScalar(2 * R_IN))) > 0 ? n : n.negate(), id: `side ${i}` });
	}
	const facing = (f) => f.n.dot(toward) > 0;
	const edgeList = [];
	for (let i = 0; i < 4; i++) {
		const j = (i + 1) % 4;
		edgeList.push([inner[i], inner[j]], [outer[i], outer[j]], [inner[i], outer[i]]);
	}
	const has = (f, p) => f.pts.some((q) => q.distanceTo(p) < 1e-12);
	let nHidden = 0;
	for (const [p, q] of edgeList) {
		const fs = faces.filter((f) => has(f, p) && has(f, q));
		check(fs.length === 2, 'an edge does not join two faces');
		const hidden = !facing(fs[0]) && !facing(fs[1]);
		nHidden += hidden;
		ink.line(p, q, { color: INK, width: hidden ? HAIR : EDGE, layer: hidden ? 0 : 1, dash: hidden ? [2.2, 1.8] : null, what: 'an edge of the box' });
	}
	check(nHidden === 3, `${nHidden} hidden edges, not 3`);
	face(ink, inner, TINT_ACCENT, -2);
	face(ink, outer, TINT_ACCENT2, -2);

	// ---- the cone, from the mass to the inner face's corners
	inner.forEach((p, i) => ink.line(O, p, { color: FAINT, width: HAIR, layer: -1, what: `the cone ${i}` }));

	// ---- the arrows, and the mass
	ink.arrow(ao0, ao1, { color: ACCENT2, width: VEC, head: VEC_HEAD, layer: 3, what: 'the field on the outer face' });
	ink.arrow(ai0, ai1, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 3, what: 'the field on the inner face' });
	ball(ink, O);

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('r^2\\,\\Delta\\Omega', sc(inner[3]), unit(-0.6, 1), 2.4, ACCENT));
	L.push(await ink.label('(r+\\Delta r)^2\\,\\Delta\\Omega', sc(outer[3]), unit(0.45, 1), 2.4, ACCENT2));
	L.push(await ink.label('\\Delta\\Omega', sc(inner[2].clone().multiplyScalar(0.5).lerp(inner[3].clone().multiplyScalar(0.5), 0.5)), unit(0, -1), 2.4, DIM));
	L.push(await ink.label('M', sc(O), unit(-1, 0), 2.2, INK));

	ink.checkAll(L);
	window[name + '-info'] = { wIn, wOut, ratio, Lin, Lout };
	return finish(name, P, L, [240, 320]);
}
