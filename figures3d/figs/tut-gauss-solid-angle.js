// The tutorial, section 1.3 (tutorial/newton/gauss-and-poisson.md), its first diagram: the solid angle of a small
// tilted patch is its shadow on the unit sphere. A point O, the sphere of radius 1 about it (a pale disc, its rim,
// and its equator), and a flat square patch dA at the distance r along the line of sight x-hat, its normal tilted
// by the angle alpha from x-hat. The patch's cross-section that faces O, cos(alpha) dA, is dashed (blue); the thin
// cone from O through the patch's corners is drawn, dotted inside the sphere, and the patch's shadow on the sphere,
// d Omega, is shaded (orange). All in true 3D (an orthographic view, turned and tilted as lib.js's Panel does).
// Exact: the shadow is the central projection of the patch onto the unit sphere, each point p of the patch's edge
// (sampled every quarter of a point) sent to p/|p| (asserted on the sphere and on the line through O and p); the
// cone's lines pass through the shadow's corners; the cross-section is the patch projected along x-hat onto the
// plane at right angles to x-hat through its centre, of area cos(alpha) dA (asserted); the shadow's area, summed
// from spherical triangles, is within 1 per cent of cos(alpha) dA / r^2 (the patch is small: its side is 0.36 r).
// Schematic: the particular r, alpha, the patch's size and the view.
import { Panel, v3, INK, DIM, FAINT, ACCENT, ACCENT2 } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR, DASH } from './tut-vec-lib.js';
import { TINT, TINT_ACCENT, EDGE, face, edges, arc, cameraAxes, fine, unitv } from './tut-gauss-lib.js';

export const R_PATCH = 3.1;               // r, the patch's distance, in units of the sphere's radius
export const ALPHA = 38;                  // alpha, degrees
export const SIDE = 1.0;                  // the patch's side, units
const TILT = 22, TURN = -24;              // the view, degrees
const S = 72;                             // points per unit: the sphere's radius
const ARROW = 0.95;                       // the normal and x-hat, units long
const RHO = 0.36;                         // the angle's arc, units
const name = 'tut-gauss-solid-angle';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

/** The solid angle of the spherical triangle with corners at the unit vectors a, b, c (Van Oosterom and Strackee). */
function triangle(a, b, c) {
	const num = a.dot(b.clone().cross(c));
	const den = 1 + a.dot(b) + b.dot(c) + c.dot(a);
	return Math.abs(2 * Math.atan2(num, den));
}

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: TURN });
	const ink = new Sheet(P, name);
	const O = v3(0, 0, 0);
	const [right, up, toward] = cameraAxes(P);

	// ---- the patch: centre C = r x-hat; normal n = cos(alpha) x-hat + sin(alpha) w; sides u (in the plane of x-hat
	// and n) and v (at right angles to both)
	const d = unitv(v3(1, 0.25, 0.42));                    // x-hat, the line of sight
	const w = unitv(v3(0, 1, 0).addScaledVector(d, -d.y)); // the direction the normal tilts toward: up, off the line
	const a = (ALPHA * Math.PI) / 180;
	const n = d.clone().multiplyScalar(Math.cos(a)).addScaledVector(w, Math.sin(a));
	const u = w.clone().multiplyScalar(Math.cos(a)).addScaledVector(d, -Math.sin(a));
	const v = n.clone().cross(u);
	const C = d.clone().multiplyScalar(R_PATCH);
	P.centre = d.clone().multiplyScalar(R_PATCH / 2);       // the drawing about the middle of the page
	check(near(n.length(), 1, 1e-12) && near(u.length(), 1, 1e-12) && near(v.length(), 1, 1e-12), 'the patch\'s frame is not of unit vectors');
	check(near(n.dot(u), 0, 1e-12) && near(n.dot(v), 0, 1e-12) && near(u.dot(v), 0, 1e-12), 'the patch\'s frame is not at right angles');
	check(near(Math.acos(n.dot(d)), a, 1e-12), 'the normal is not alpha from x-hat');
	check(n.dot(d) > 0, 'the normal does not point away from O (the solid angle is to be positive)');
	check(d.dot(toward) > 0.25, 'the shadow is not on the near side of the sphere');
	const h = SIDE / 2;
	const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => C.clone().addScaledVector(u, i * h).addScaledVector(v, j * h));

	// ---- the cross-section facing O: the patch projected along x-hat onto the plane through C at right angles to it
	const across = corners.map((p) => p.clone().addScaledVector(d, -p.clone().sub(C).dot(d)));
	for (const q of across) check(near(q.clone().sub(C).dot(d), 0, 1e-12), 'the cross-section is not at right angles to x-hat');
	const areaOf = (q) => q[1].clone().sub(q[0]).cross(q[3].clone().sub(q[0])).length();
	check(near(areaOf(across), Math.cos(a) * areaOf(corners), 1e-12), 'the cross-section\'s area is not cos(alpha) dA');
	check(near(areaOf(corners), SIDE * SIDE, 1e-12), 'the patch\'s area is not its side squared');

	// ---- the shadow: every point of the patch's edge sent along its line to O onto the unit sphere
	const rim = [];
	for (let i = 0; i < 4; i++) rim.push(...fine(ink, corners[i], corners[(i + 1) % 4], 0.25).slice(0, -1));
	const shadow = rim.map((p) => p.clone().normalize());
	shadow.forEach((q, i) => {
		check(near(q.length(), 1, 1e-12), 'a point of the shadow is not on the unit sphere');
		check(q.clone().cross(rim[i]).length() < 1e-12 && q.dot(rim[i]) > 0, 'a point of the shadow is not on its line to O');
	});
	// its area, from a fine grid on the patch, against the small-patch formula
	let omega = 0;
	const N = 80;
	const g = (i, j) => C.clone().addScaledVector(u, -h + (SIDE * i) / N).addScaledVector(v, -h + (SIDE * j) / N).normalize();
	for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) omega += triangle(g(i, j), g(i + 1, j), g(i + 1, j + 1)) + triangle(g(i, j), g(i + 1, j + 1), g(i, j + 1));
	const formula = (Math.cos(a) * SIDE * SIDE) / R_PATCH ** 2;
	check(Math.abs(omega / formula - 1) < 0.01, `the shadow's area ${omega} is not within 1 per cent of cos(alpha) dA / r^2 = ${formula}`);
	window[name + '-omega'] = { omega, formula };

	// ---- the unit sphere: a pale disc, its rim (the great circle at right angles to the view) and its equator, the
	// half behind the centre dotted
	const ring = (e1, e2, m = 4 * Math.ceil((2 * Math.PI * S) / 0.25 / 4)) => Array.from({ length: m + 1 }, (_, k) => e1.clone().multiplyScalar(Math.cos((2 * Math.PI * k) / m)).addScaledVector(e2, Math.sin((2 * Math.PI * k) / m)));
	const silhouette = ring(right, up);
	face(ink, silhouette, TINT, -4);
	ink.curve(silhouette, { color: DIM, width: AXIS, layer: -3, what: 'the sphere\'s rim' });
	const eq = ring(v3(1, 0, 0), v3(0, 0, 1));
	// the front half as one run: rotate the list so that it starts where the front begins
	const startF = eq.findIndex((p, i) => p.dot(toward) >= 0 && eq[(i + eq.length - 2) % (eq.length - 1)].dot(toward) < 0);
	const run = [];
	for (let k = 0; k < eq.length - 1; k++) { const p = eq[(startF + k) % (eq.length - 1)]; if (p.dot(toward) < 0) break; run.push(p); }
	ink.curve(run, { color: FAINT, width: HAIR, layer: -3, what: 'the equator' });
	check(run.length > 0.45 * (eq.length - 1), 'the equator\'s near half is not one run');
	for (const c of [silhouette, eq, shadow]) for (let i = 1; i < c.length; i++) check(Math.hypot(ink.at(c[i])[0] - ink.at(c[i - 1])[0], ink.at(c[i])[1] - ink.at(c[i - 1])[1]) <= 0.2501, 'a curve is sampled too coarsely');

	// ---- the shadow, shaded, its edge in the accent
	face(ink, shadow, TINT_ACCENT, -2);
	ink.curve([...shadow, shadow[0]], { color: ACCENT, width: EDGE, layer: 0, what: 'the shadow' });

	// ---- the cone: from O to each corner, dotted inside the sphere, a hairline outside it
	corners.forEach((p, i) => {
		const q = p.clone().normalize();
		ink.dots(O, q, { color: FAINT, clear0: 1.6, clear1: 0.6, layer: -1, what: `the cone inside ${i}` });
		ink.line(q, p, { color: FAINT, width: HAIR, layer: -1, what: `the cone ${i}` });
	});
	// the line of sight, likewise
	ink.dots(O, d, { color: FAINT, clear0: 1.6, clear1: 0.6, layer: -1, what: 'the line of sight inside' });
	ink.line(d, C, { color: DIM, width: HAIR, layer: -1, what: 'the line of sight' });

	// ---- the patch, its cross-section and its normal
	face(ink, corners, TINT, 0);
	edges(ink, corners, { color: INK, width: EDGE, layer: 1, what: 'the patch\'s edge' });
	for (let i = 0; i < 4; i++) ink.line(across[i], across[(i + 1) % 4], { color: ACCENT2, width: EDGE, layer: 2, dash: DASH, what: `the cross-section ${i}` });
	ink.arrow(C, C.clone().addScaledVector(n, ARROW), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'the normal' });
	ink.arrow(C, C.clone().addScaledVector(d, ARROW), { color: DIM, width: AXIS, head: AXIS_HEAD + 0.6, layer: 3, what: 'x-hat' });
	const ang = arc(ink, C, d, n, RHO, { what: 'the angle alpha' });
	check(near(ang.ang, a, 1e-12), 'the arc is not alpha');

	// ---- O, and the radius 1
	ink.dot(O, { what: 'O' });
	const radiusDir = unitv(up.clone().multiplyScalar(0.7).addScaledVector(right, -0.72));
	ink.line(O, radiusDir, { color: DIM, width: AXIS, layer: -1, what: 'the radius' });
	check(near(radiusDir.dot(toward), 0, 1e-12), 'the radius is not drawn in the plane of the page, at its true length');

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('O', sc(O), unit(-0.6, 0.8), 2.2, INK));
	L.push(await ink.label('1', sc(radiusDir.clone().multiplyScalar(0.55)), unit(0.7, -0.72), 2.2, DIM));
	L.push(await ink.label('r', sc(d.clone().multiplyScalar((1 + R_PATCH) / 2 - 0.1)), unit(0.1, -1), 2.2, INK));
	L.push(await ink.label('\\mathrm d\\Omega', sc(d.clone().add(v.clone().multiplyScalar(0.12))), unit(-0.3, -1), 2.4, ACCENT));
	L.push(await ink.label('\\mathrm dA', sc(corners[0].clone().lerp(corners[1], 0.5)), unit(0.2, 1), 2.4, INK));
	L.push(await ink.label('\\cos\\alpha\\,\\mathrm dA', sc(across[3].clone().lerp(across[0], 0.5)), unit(-1, 0.2), 2.4, ACCENT2));
	L.push(await ink.label('\\alpha', sc(ang.mid), unit(1, -0.15), 2.2, DIM));
	L.push(await ink.label('\\hat{\\boldsymbol x}', sc(C.clone().addScaledVector(d, ARROW)), unit(1, 0.2), 2.2, DIM));

	ink.checkAll(L);
	return finish(name, P, L, [240, 320]);
}
