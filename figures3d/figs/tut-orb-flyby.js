// The tutorial, chapter 1.8 (tutorial/newton/orbits-and-kicks.md), its third diagram: the geometry of a flyby, and
// the pull it gives one part of the body. Left, in true 3D (an orthographic view, turned and tilted as lib.js's Panel
// does): the passing mass, a small stone ball, on its straight path at the speed V; the plane at right angles to the
// path through the body's centre, tinted, with the body's outline and its section by the plane; the point b where the
// path crosses the plane; a part of the body over the point s of the plane (the dotted line through the part,
// parallel to the path, meets the plane at s); its distance B = |b - s| from the path, in the plane; and the part's
// kick, which points along b - s. The path's stretch behind the plane and the body's outline behind it are dashed.
// Right, the sideways pull on that part per unit mass against time, B G mu / (B^2 + V^2 t^2)^(3/2), a bell of height
// G mu / B^2 at the moment of closest approach, with its area shaded: 2 G mu / B V, the kick. The dashed rectangle has
// the same height and the same area, so its width is the duration 2B/V. Exact: the scene of the paper's tonne and
// steel ball, to one scale (the ball's radius 0.5 m, the path 1.5 m from its centre); the right angles (path and
// plane, B and the path, the dotted line and the plane), asserted in 3D; the bell, sampled every quarter of a point
// along its length, in units of B/V across and G mu / B^2 up; its area, which the plot shows out to 3.4 B/V on either
// side (95 per cent of the whole), and the whole area 2 (in those units), checked by quadrature with the chapter's
// numbers (the tonne at 44 km/s, a part 1 m from the path: a kick of 3.0 x 10^-12 m/s in a pass of 45 microseconds).
// Schematic: the place of the part, the length of the kick's arrow, and the sizes of the passing mass and of the part.
// Colours: b in the dim ink and B in the field's colour, as in the chapter's interactive figure flyby-kick; the kick
// and the area that is the kick in orange.
import { Panel, v3, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { IRON, STEEL } from '../stone.js';
import { Sheet, ORIGIN, finish, checker, near, n2, AXIS, AXIS_HEAD, VEC, VEC_HEAD, HAIR, TICK, LINE, DOT, DOT_STEP } from './tut-pot-lib.js';
import { RIGHT } from './tut-vec-lib.js';
import { TINT, TINT_ACCENT, cameraAxes } from './tut-gauss-lib.js';
import { dashed, FIELD } from './tut-orb-lib.js';

const name = 'tut-orb-flyby';
const check = checker(name);

// ---- the physics: the paper's scene --------------------------------------------------------------------------------
export const G = 6.674e-11;
export const MU = 1000;                   // kg, the tonne
export const SPEED = 44e3;                // m/s
export const RADIUS = 0.5;                // m, the steel ball
export const PASS = 1.5;                  // m, from the ball's centre to the path
/** The sideways pull per unit mass at the distance B from the path, at the time t from closest approach. */
export const pull = (B, t) => (B * G * MU) / (B * B + SPEED * SPEED * t * t) ** 1.5;
/** The same in units of G mu / B^2, against x = V t / B. */
export const bell = (x) => 1 / (1 + x * x) ** 1.5;

// ---- the drawing ----------------------------------------------------------------------------------------------
const S3 = 58;                            // points per metre in the 3D view
const TILT = 15, TURN = 42;               // the view, degrees
const PART = { s: [0.2, -0.17], along: -0.27 };    // the part: s in the plane (m, along y and z), and its place along the path
const KICK = 0.55;                        // the kick's arrow, m (schematic)
const PLANE = { y: [-0.78, 1.86], z: [-0.86, 0.86] };   // the plane's extent, m
const PATH = [-1.78, 1.45];               // the path's extent along it, m
const MASS_AT = -1.4;                     // the passing mass, along the path, m
const MASS_R = 3.6;                       // its radius, points (schematic)
const PART_R = 2.3;                       // the part, a small steel bead, points (schematic)
const PT = 1.15;                          // a marked point of the plane, radius in points
const XU = 20, YU = 76;                   // the plot: points per B/V across and per G mu / B^2 up
const XMAX = 3.4;                         // the bell is drawn out to this many B/V either side
const AXIS_OVER = [0, 0.75];              // the time axis runs this far past the bell's ends, units of B/V
const GAP = 16;                           // points between the 3D view's ink and the plot's
const DIM_DROP = 8;                       // the duration's dimension line, this far under the axis
const name3 = (s) => `the 3D view: ${s}`;

export default async function () {
	// ---- the numbers: the kick is the area of the pulse, the peak times the duration
	const B1 = 1;                                                    // m, the near edge of the ball
	const kick = (2 * G * MU) / (B1 * SPEED), duration = (2 * B1) / SPEED, peak = (G * MU) / B1 ** 2;
	let area = 0;
	{
		// the integral over all time, by the substitution V t = B tan(theta), summed by Simpson's rule
		const n = 2000, h = Math.PI / n;
		for (let i = 0; i <= n; i++) {
			const th = -Math.PI / 2 + i * h, t = (B1 / SPEED) * Math.tan(th), dt = (B1 / SPEED) / Math.cos(th) ** 2;
			const f = i === 0 || i === n ? 0 : pull(B1, t) * dt;
			area += f * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
		}
		area *= h / 3;
	}
	check(Math.abs(area / kick - 1) < 1e-9, `the pulse's area ${area} is not 2 G mu / B V = ${kick}`);
	check(near(peak * duration, kick, 1e-24), 'the peak times the duration is not the kick');
	check(kick.toExponential(1) === '3.0e-12' && Math.round(duration * 1e6) === 45, 'the tonne\'s kick is not 3.0 x 10^-12 m/s in 45 us');
	// in the plot's units: the whole area 2, and the share the drawn stretch holds
	const drawnShare = (2 * XMAX) / Math.sqrt(1 + XMAX * XMAX) / 2;
	check(drawnShare > 0.95 && drawnShare < 0.96, `the drawn bell holds ${drawnShare} of the area, not 95 per cent`);

	const S = new Sheet(name);
	const V = new Panel({ x: 0, y: 0, w: 0, h: 0, scale: S3, tilt: TILT, turn: TURN });   // the 3D projection
	const [right, up, toward] = cameraAxes(V);
	const O3 = [ORIGIN - 90, ORIGIN];                               // where the ball's centre falls on the page
	const pg = (p) => { const [x, y] = V.at(p); return [O3[0] + x, O3[1] + y]; };
	const depth = (p) => V.cam(p).z;                                 // toward the viewer

	// ---- the scene: the path along x through b = (0, PASS, 0); the plane x = 0 through the ball's centre
	const along = v3(1, 0, 0), normal = v3(1, 0, 0);
	const b = v3(0, PASS, 0);
	const viewer = Math.sign(normal.dot(toward));                    // the side of the plane the viewer is on
	check(Math.abs(normal.dot(toward)) > 0.4, 'the plane is seen too nearly edge on');
	const front = (p) => p.dot(normal) * viewer > 1e-12;
	const [ys, zs] = PART.s;
	const s = v3(0, ys, zs);
	const part = s.clone().addScaledVector(along, PART.along);
	check(front(part), 'the part is behind the plane');
	check(part.length() < RADIUS - 0.05, 'the part is not inside the ball');
	const Bvec = b.clone().sub(s), B = Bvec.length();
	check(near(Bvec.dot(along), 0, 1e-15) && near(s.dot(normal), 0, 1e-15) && near(b.dot(normal), 0, 1e-15), 'b, s and B are not in the plane');
	check(near(along.dot(normal), 1, 1e-15), 'the path is not at right angles to the plane');
	check(part.clone().sub(s).cross(along).length() < 1e-15, 'the part does not lie over s along the path');
	const kickDir = Bvec.clone().normalize();

	// the plane's corners, and a test for a page point inside its picture
	const corners = [[PLANE.y[0], PLANE.z[0]], [PLANE.y[1], PLANE.z[0]], [PLANE.y[1], PLANE.z[1]], [PLANE.y[0], PLANE.z[1]]].map(([y, z]) => v3(0, y, z));
	const quad = corners.map(pg);
	const insidePlane = (q) => {
		let sgn = 0;
		for (let i = 0; i < 4; i++) {
			const a = quad[i], c = quad[(i + 1) % 4];
			const cr = (c[0] - a[0]) * (q[1] - a[1]) - (c[1] - a[1]) * (q[0] - a[0]);
			if (Math.abs(cr) < 1e-12) continue;
			if (sgn && Math.sign(cr) !== sgn) return false;
			sgn = Math.sign(cr);
		}
		return true;
	};
	const hidden = (p) => !front(p) && Math.abs(p.dot(normal)) > 1e-12 && insidePlane(pg(p));

	// ---- the plane: tinted, its edges a hairline
	S.raw(`<path d="M${quad.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}Z" fill="${TINT}"/>`, -3);
	S.path(quad, { color: DIM, width: HAIR, layer: -2, closed: true, what: name3('the plane\'s edge') });

	// ---- the ball: its outline (the circle at right angles to the view), dashed where it lies behind the plane, and
	// its section by the plane
	const runs = (pts, test) => {
		// split a list of points into runs of equal test, each run sharing its end point with the next
		const out = [];
		let cur = [pts[0]], state = test(pts[0]);
		for (let i = 1; i < pts.length; i++) {
			const t = test(pts[i]);
			cur.push(pts[i]);
			if (t !== state) { out.push({ state, pts: cur }); cur = [pts[i]]; state = t; }
		}
		out.push({ state, pts: cur });
		return out;
	};
	const M = 1440;
	const rim = Array.from({ length: M + 1 }, (_, k) => right.clone().multiplyScalar(RADIUS * Math.cos((2 * Math.PI * k) / M)).addScaledVector(up, RADIUS * Math.sin((2 * Math.PI * k) / M)));
	for (const q of rim) check(near(q.dot(toward), 0, 1e-12), 'the outline is not at right angles to the view');
	for (const r of runs(rim, hidden)) {
		if (r.state) {
			// a dashed run, one dashed line per straight piece would break the pattern: draw it as one path
			const pts = r.pts.map(pg);
			S.raw(`<path d="M${pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}" fill="none" stroke="${DIM}" stroke-width="${HAIR}" stroke-dasharray="2 1.6"/>`, -1);
			S.mark(pts, HAIR / 2, name3('the ball\'s outline behind the plane'));
		} else S.path(r.pts.map(pg), { color: DIM, width: AXIS, layer: 1, what: name3('the ball\'s outline') });
	}
	const section = Array.from({ length: M + 1 }, (_, k) => v3(0, RADIUS * Math.cos((2 * Math.PI * k) / M), RADIUS * Math.sin((2 * Math.PI * k) / M)));
	S.path(section.map(pg), { color: DIM, width: HAIR, layer: -1, what: name3('the ball\'s section') });

	// ---- the path: solid where seen, dashed (a hairline) where the plane hides it; a head at its end, the way it goes
	const P0 = b.clone().addScaledVector(along, PATH[0]), P1 = b.clone().addScaledVector(along, PATH[1]);
	const NP = 1200;
	const pathPts = Array.from({ length: NP + 1 }, (_, i) => P0.clone().lerp(P1, i / NP));
	const pathRuns = runs(pathPts, hidden);
	check(pathRuns.length === 3 && pathRuns[1].state && !pathRuns[0].state && !pathRuns[2].state, 'the path is not seen, hidden, seen');
	const [r0, r1, r2] = pathRuns;
	S.path([pg(r0.pts[0]), pg(r0.pts[r0.pts.length - 1])], { color: INK, width: LINE, layer: 0, what: name3('the path, before the plane') });
	dashed(S, pg(r1.pts[0]), pg(r1.pts[r1.pts.length - 1]), { color: INK, width: HAIR, layer: -1, what: name3('the path, behind the plane') });
	const pathEnd = S.arrow(pg(r2.pts[0]), pg(P1), { color: INK, width: LINE, head: VEC_HEAD, layer: 0, what: name3('the path, after the plane') });
	check(r0.pts[r0.pts.length - 1].distanceTo(b) < 1e-9 || front(r0.pts[0]), 'the path does not reach the plane from the viewer\'s side');

	// ---- b, s, B and the right angle at b
	const pb = pg(b), ps = pg(s);
	S.path([ps, pb], { color: FIELD, width: VEC * 0.8, layer: 2, what: name3('B') });
	{
		// the right angle between the path, on the viewer's side of b, and B, toward s: a small square in their plane
		const d = along.clone().multiplyScalar(viewer * Math.sign(along.dot(normal))), t = s.clone().sub(b).normalize();
		const k = RIGHT / S3;
		const sq = [b.clone().addScaledVector(d, k), b.clone().addScaledVector(d, k).addScaledVector(t, k), b.clone().addScaledVector(t, k)];
		check(near(d.dot(t), 0, 1e-12), 'B is not at right angles to the path');
		// the square lies on the viewer's side of the plane where the path goes on: draw it only if it is seen
		check(sq.every((p) => !hidden(p)), 'the right-angle mark lies behind the plane');
		S.path(sq.map(pg), { color: DIM, width: HAIR, layer: 2, cap: 'butt', what: name3('the right angle at b') });
	}
	for (const [p, w, c] of [[pb, 'b', DIM], [ps, 's', INK]]) {
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${PT}" fill="${c}"/>`, 4);
		S.mark([p], PT, name3(`the point ${w}`));
	}

	// ---- the part, the dotted line from it to s along the path, and its kick
	const pp = pg(part);
	{
		const L = Math.hypot(ps[0] - pp[0], ps[1] - pp[1]);
		const u = [(ps[0] - pp[0]) / L, (ps[1] - pp[1]) / L];
		const s0 = PART_R + 0.9 + DOT / 2, s1 = L - PT - 0.9 - DOT / 2;
		const n = Math.max(1, Math.round((s1 - s0) / DOT_STEP)), step = (s1 - s0) / n;
		const dots = Array.from({ length: n + 1 }, (_, i) => [pp[0] + u[0] * (s0 + i * step), pp[1] + u[1] * (s0 + i * step)]);
		S.raw(`<path d="${dots.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${FAINT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
		for (const q of dots) S.mark([q], DOT / 2, name3('the line from the part to s'));
		check(n >= 3, 'the dotted line from the part to s is too short to read');
	}
	S.sphere(pp, PART_R, STEEL, { spec: 0.6, shininess: 36, layer: 5 }, name3('the part'));
	const kickTo = part.clone().addScaledVector(kickDir, KICK);
	const pk = pg(kickTo);
	const ku = [(pk[0] - pp[0]) / Math.hypot(pk[0] - pp[0], pk[1] - pp[1]), (pk[1] - pp[1]) / Math.hypot(pk[0] - pp[0], pk[1] - pp[1])];
	const kickArrow = S.arrow([pp[0] + ku[0] * (PART_R + 1.1), pp[1] + ku[1] * (PART_R + 1.1)], pk, { color: ACCENT, width: VEC, head: VEC_HEAD, layer: 4, what: name3('the kick') });
	check(near(kickDir.dot(along), 0, 1e-15), 'the kick is not at right angles to the path');
	check(front(kickTo), 'the kick reaches behind the plane');

	// ---- the passing mass
	const mass = b.clone().addScaledVector(along, MASS_AT);
	check(front(mass), 'the passing mass is not on the viewer\'s side of the plane');
	S.sphere(pg(mass), MASS_R, IRON, { spec: 0.45, shininess: 30, layer: 6 }, name3('the passing mass'));

	// ---- the plot, beside the view, its ink (from the top of the bell to the duration's label) centred on the plane's
	const inkRight = Math.max(...quad.map((q) => q[0]), pathEnd.B[0]);
	const midY = (Math.max(...quad.map((q) => q[1])) + Math.min(...quad.map((q) => q[1]))) / 2;
	const base = midY - (-YU + DIM_DROP + TICK + 2.4 + 6) / 2;
	const x0 = inkRight + GAP + (XMAX + AXIS_OVER[0]) * XU;          // the bell's centre
	const at = (x, y) => [x0 + x * XU, base - y * YU];
	// the bell, every quarter of a point along its length
	const curve = [];
	{
		let x = -XMAX;
		while (x < XMAX) {
			curve.push(at(x, bell(x)));
			const slope = (-3 * x) / (1 + x * x) ** 2.5;
			x = Math.min(XMAX, x + 0.22 / Math.hypot(XU, YU * slope));
		}
		curve.push(at(XMAX, bell(XMAX)));
	}
	for (let i = 1; i < curve.length; i++) check(Math.hypot(curve[i][0] - curve[i - 1][0], curve[i][1] - curve[i - 1][1]) <= 0.2501, 'the bell is sampled too coarsely');
	const area0 = curve.slice(1).reduce((A, q, i) => A + ((q[0] - curve[i][0]) * ((base - q[1]) + (base - curve[i][1]))) / 2, 0) / (XU * YU);
	check(near(area0, 2 * drawnShare, 1e-4), `the drawn bell's area ${area0} is not ${2 * drawnShare}`);
	S.fill(`M${curve.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L')}L${n2(at(XMAX, 0)[0])},${n2(base)}L${n2(at(-XMAX, 0)[0])},${n2(base)}Z`,
		{ l: at(-XMAX, 0)[0], r: at(XMAX, 0)[0], t: at(0, 1)[1], b: base }, { color: TINT_ACCENT, layer: -3, what: 'the area', solid: false });
	S.path(curve, { color: INK, width: LINE + 0.15, layer: 2, what: 'the bell' });
	// the rectangle of the same height and area: its width 2 (that is, 2B/V); no dash where it touches the bell's top
	const corner = [at(-1, 0), at(-1, 1), at(1, 1), at(1, 0)];
	check(near(2 * 1, 2, 0) && near((corner[3][0] - corner[0][0]) * (corner[0][1] - corner[1][1]) / (XU * YU), 2, 1e-12), 'the rectangle\'s area is not the bell\'s');
	const onBell = (q, gap) => {
		const x = (q[0] - x0) / XU;
		return Math.abs(x) <= XMAX && Math.abs(q[1] - at(x, bell(x))[1]) < (LINE + 0.15) / 2 + gap;
	};
	for (let i = 0; i < 3; i++) dashed(S, corner[i], corner[i + 1], { clash: onBell, color: DIM, width: HAIR + 0.05, layer: 1, what: `the rectangle's side ${i}` });
	// the time axis
	const ax0 = at(-XMAX - AXIS_OVER[0], 0), ax1 = at(XMAX + AXIS_OVER[1], 0);
	S.arrow(ax0, ax1, { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the time axis' });
	// the duration: a dimension line under the axis from -1 to 1
	const dy = base + DIM_DROP;
	S.path([[at(-1, 0)[0], dy], [at(1, 0)[0], dy]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the duration' });
	for (const x of [-1, 1]) S.path([[at(x, 0)[0], dy - TICK], [at(x, 0)[0], dy + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the duration's tick at ${x}` });

	// ---- labels
	const L = [];
	const lab = async (src, x, y, ax, ay, dir, color, on) => { const l = await S.clear(src, x, y, ax, ay, dir, { color }); if (on) l.on = on; return l; };
	// the 3D view
	const mp = pg(mass);
	L.push(await lab('\\mu', mp[0] - MASS_R * 0.7, mp[1] + MASS_R * 0.7 + 1.5, 1, 0, [-Math.SQRT1_2, Math.SQRT1_2], INK));
	L.push(await lab('V', pathEnd.B[0], pathEnd.B[1] - 2.6, 0.5, 1, [0, -1], INK));
	L.push(await lab('\\boldsymbol b', pb[0] - 2.6, pb[1] - 1, 1, 1, [-0.6, -0.8], DIM));
	L.push(await lab('\\boldsymbol s', ps[0] + 2.2, ps[1] + 1.5, 0, 0, [0.6, 0.8], INK));
	const mid = [(pb[0] + ps[0]) / 2, (pb[1] + ps[1]) / 2];
	const nB = [-(ps[1] - pb[1]), ps[0] - pb[0]], lB = Math.hypot(...nB);
	const outB = nB[0] / lB > 0 ? [nB[0] / lB, nB[1] / lB] : [-nB[0] / lB, -nB[1] / lB];      // to the right of B
	L.push(await lab('B', mid[0] + outB[0] * 2.4, mid[1] + outB[1] * 2.4, 0, 0.5, outB, FIELD));
	L.push(await lab('\\Delta\\boldsymbol v', pk[0], pk[1] - 2.4, 0.5, 1, [0, -1], ACCENT));
	// the plot
	L.push(await lab('G\\mu/B^2', corner[1][0] - 3, corner[1][1], 1, 0.5, [-1, 0], INK));
	L.push(await lab('2G\\mu/BV', x0, at(0, 0.3)[1], 0.5, 0.5, [0, 1], ACCENT, ['the area']));
	L.push(await lab('2B/V', x0, dy + TICK + 2.4, 0.5, 0, [0, 1], INK));
	L.push(await lab('t', ax1[0] - 1.5, base - 3, 1, 1, [0, -1], DIM));
	// the area's label lies inside the rectangle, clear of its sides
	const areaLabel = L[L.length - 3];
	check(areaLabel.box.l > corner[0][0] + 2.15 && areaLabel.box.r < corner[3][0] - 2.15 && areaLabel.box.t > corner[1][1] + 2.15, `the area's label does not fit inside the rectangle: ${(areaLabel.box.r - areaLabel.box.l).toFixed(2)} pt in ${(corner[3][0] - corner[0][0]).toFixed(2)}`);

	S.checkAll(L);
	window.tutOrbFlyby = { B, kick, duration, area, drawnShare, viewer };
	return finish(S, L, [240, 340]);
}
