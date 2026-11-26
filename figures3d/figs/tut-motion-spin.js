// The tutorial, section 1.6 (tutorial/newton/motion.md), its second diagram: a rigid body turning about a fixed
// axis. A round slab (a short upright cylinder, drawn in true 3D, an orthographic view tilted as lib.js's Panel
// does) turns about the vertical axis through its centre with the angular velocity Omega, drawn as an arrow along
// the axis (plain ink: the spin of a body, not of a frame). Four points of the slab lie on its top face along the
// radius that points toward the viewer, at the distances s = 0, R/3, 2R/3 and R from the axis; each moves on the
// circle of radius s about the axis (thin grey), and its velocity v = Omega x x is drawn as an arrow from it. Exact:
// every velocity is computed as the cross product Omega x x of the point's position (from the axis's foot on the
// top face), the arrows are asserted to be tangent to their circles, at right angles to the axis, and in length in
// proportion to s, in 3D and as drawn (they are all parallel to the page, so the view shortens none of them); the
// point on the axis has none. The circles are circles in 3D, sampled every half point (their chords stray from them
// by less than a thousandth of a point). Schematic: the slab's proportions and the scale of the arrows.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, HAIR, AXIS, VEC, VEC_HEAD } from './tut-vec-lib.js';
import { TINT, EDGE, face, cameraAxes } from './tut-gauss-lib.js';

export const R = 1;                        // the slab's radius, units
const H = 0.26;                            // its thickness
export const OMEGA = 0.62;                 // the arrows' length per unit of distance from the axis (Omega times the
                                           // time the arrows stand for), units per unit
const AT = [0, 1 / 3, 2 / 3, 1];           // the points, as fractions of R
const AXIS_UP = 0.62, AXIS_DOWN = 0.24;    // the axis, past the top and bottom faces
const TILT = 24;                           // the view, degrees
const S = 122;                             // points per unit
const name = 'tut-motion-spin';
const check = checker(name);

const unit = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: TILT, turn: 0 });
	const ink = new Sheet(P, name);
	const [right, , toward] = cameraAxes(P);
	const up = v3(0, 1, 0);
	const top = H / 2, bottom = -H / 2;

	// ---- the slab: its outline filled with the tint, its edges in ink
	const circle = (r, y, from = 0, to = 2 * Math.PI) => {
		const n = Math.max(8, 2 * Math.ceil((Math.abs(to - from) * r * S) / 0.5));
		return Array.from({ length: n + 1 }, (_, k) => v3(r * Math.cos(from + ((to - from) * k) / n), y, r * Math.sin(from + ((to - from) * k) / n)));
	};
	// the near half of a circle is where z >= 0 (toward the viewer): angles 0 to pi
	check(near(v3(1, 0, 0).dot(toward), 0, 1e-12), 'the side\'s outlines are not where it turns away from the viewer');
	const silhouette = [...circle(R, bottom, 0, Math.PI), ...circle(R, top, Math.PI, 2 * Math.PI)];
	face(ink, silhouette, TINT, -6);
	ink.curve(circle(R, top), { color: INK, width: EDGE, layer: 1, what: 'the top face\'s edge' });
	ink.curve(circle(R, bottom, 0, Math.PI), { color: INK, width: EDGE, layer: 1, what: 'the bottom face\'s near edge' });
	for (const s of [-1, 1]) ink.line(v3(s * R, bottom, 0), v3(s * R, top, 0), { color: INK, width: EDGE, layer: 1, what: `the side ${s}` });

	// ---- the axis: above the top face, with Omega's arrow, and below the bottom face; hidden inside the slab
	const Omega = up.clone().multiplyScalar(OMEGA);
	// below, the axis shows from where the near bottom edge stops hiding it: the point of the axis seen 1.2 points
	// below that edge's lowest point
	const edgeY = ink.at(v3(0, bottom, R))[1] + 1.2;
	let lo = bottom - 1, hi = bottom;
	for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (ink.at(v3(0, m, 0))[1] > edgeY) lo = m; else hi = m; }
	const emerge = v3(0, lo, 0);
	check(near(ink.at(emerge)[1], edgeY, 1e-6), 'the axis below does not start at the slab\'s edge');
	ink.line(v3(0, lo - AXIS_DOWN, 0), emerge, { color: INK, width: AXIS, layer: 1, what: 'the axis below' });
	const omegaArrow = ink.arrow(v3(0, top, 0), v3(0, top + AXIS_UP, 0), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: 'Omega' });

	// ---- the circles of the points, on the top face, thin and grey (the rim is the face's edge)
	for (const f of AT.slice(1, -1)) ink.curve(circle(f * R, top), { color: FAINT, width: HAIR, layer: 0, what: `the circle at ${f}` });

	// ---- the points and their velocities: v = Omega x x, x from the axis's foot on the top face
	const foot = v3(0, top, 0);
	const drawn = [];
	for (const f of AT) {
		const p = v3(0, top, f * R);
		const x = p.clone().sub(foot);
		const v = Omega.clone().cross(x);
		check(near(v.length(), OMEGA * f * R, 1e-12), `the velocity at ${f} is not Omega s`);
		check(near(v.dot(up), 0, 1e-12) && near(v.dot(x), 0, 1e-12), `the velocity at ${f} is not tangent to its circle`);
		check(f === 0 ? v.length() === 0 : v.clone().normalize().dot(right) > 1 - 1e-12, `the velocity at ${f} does not point to the right`);
		if (f > 0) drawn.push({ f, ...ink.arrow(p, p.clone().add(v), { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `the velocity at ${f}` }) });
		ink.dot(p, { what: `the point at ${f}` });
	}
	// as drawn: lengths in proportion to s, every head at most two fifths of its arrow
	for (const d of drawn) check(near(d.L / drawn[drawn.length - 1].L, d.f, 1e-9), `the arrow at ${d.f} is not in proportion to s as drawn`);

	// ---- the radius toward the viewer: a hairline from the axis to the rim, beneath the points
	ink.line(foot, v3(0, top, R), { color: DIM, width: HAIR, layer: 0.5, what: 'the radius' });

	// ---- labels
	const sc = (p) => ink.at(p);
	const L = [];
	L.push(await ink.label('\\boldsymbol\\Omega', [omegaArrow.B[0], omegaArrow.B[1] + 4], unit(1, 0), 2.6, INK));
	const last = drawn[drawn.length - 1];
	L.push(await ink.label('\\boldsymbol v', [(last.A[0] + last.B[0]) / 2, last.A[1]], unit(0, 1), 2.4, INK));
	void omegaArrow; void AXIS;

	ink.checkAll(L);
	return finish(name, P, L, [240, 320]);
}
