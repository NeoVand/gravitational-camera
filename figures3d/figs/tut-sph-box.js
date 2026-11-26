// The tutorial, section 2.2 (tutorial/outside/spherical-harmonics.md), its first diagram: the small spherical box
// between r and r + dr, theta and theta + d theta, phi and phi + d phi. A sphere of radius r about the origin O (its
// rim; on its near side its equator, the circle of latitude at theta, and the line of longitude at phi below the box,
// each stopped short of the rim), the z axis and the x axis (dotted inside the sphere), the radius r to the box's
// corner (r, theta, phi) with the angle theta from the z axis, the angle phi in the xy plane from the x axis, and the
// box standing on the sphere. Three of its edges are labelled with their lengths: r d theta along the line of
// longitude and r sin theta d phi round the circle of latitude (the two edges on the sphere that meet at the corner),
// and dr on a radial edge of its outline (every radial edge has that length); the radius r sin theta of the circle of
// latitude is drawn from the z axis to the far end of the edge round it. Of the box's six faces, those at r and
// r + dr are tinted orange, those at theta and theta + d theta blue, and those at phi and phi + d phi grey; three are
// seen, one of each pair, and the edges that only the other three share are dashed. In true 3D (an orthographic view
// from ELEV degrees above the xy plane, turned and tilted as lib.js's Panel does).
// Exact: every edge and face is a coordinate line or surface of the spherical coordinates (the radial edges straight,
// the others arcs of circles of latitude and longitude, sampled every quarter of a point), so that the edge from the
// corner along the line of longitude has the length r d theta, the edge round the circle of latitude the length
// r sin theta d phi, and the radial edge dr (asserted, from the drawn 3D points); the radius of the circle of latitude
// runs from the z axis at right angles to it (asserted) and has the length r sin theta; the arcs at O are theta and
// phi (asserted); the faces seen are those whose outward normals point toward the viewer, and those not seen point
// away (asserted, one of each pair); the corner not seen stands clear of the front corner on the page (asserted), so
// that the box reads one way. Schematic: the size of the box (d theta = 17 degrees, d phi = 26 degrees, dr = 0.3 r,
// far from small), its place and the view.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, beside, AXIS, AXIS_HEAD, HAIR, DASH } from './tut-vec-lib.js';
import { TINT, TINT_ACCENT, TINT_ACCENT2, EDGE, face, arc, cameraAxes, unitv } from './tut-gauss-lib.js';

const name = 'tut-sph-box';
const check = checker(name);
const deg = Math.PI / 180;

export const TH = 58 * deg, DTH = 17 * deg;     // theta and d theta
export const PH = 44 * deg, DPH = 26 * deg;     // phi and d phi
export const DR = 0.3;                           // dr, in units of r
const ELEV = 34, AZ = -17;                        // the viewer: its elevation above the xy plane and its azimuth, degrees
const S = 112;                                   // points per unit: the sphere's radius r
const AXIS_OUT = [1.42, 1.5];                    // how far the z and x axes reach, in units of r
const RHO_T = 0.3, RHO_P = 0.25; 
const HORIZON = 1.2;                             // lines on the sphere stop this far (points) from its rim
                // the arcs of theta and phi, units

const unit2 = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: ELEV, turn: -90 - AZ });
	const ink = new Sheet(P, name);
	// the chapter's axes in the world of three.js (y up): x, y and z
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	const sph = (r, t, p) => pt(r * Math.sin(t) * Math.cos(p), r * Math.sin(t) * Math.sin(p), r * Math.cos(t));
	const [right, up, toward] = cameraAxes(P);
	check(near(toward.dot(Z), Math.sin(ELEV * deg), 1e-12) && near(Math.atan2(-toward.z, toward.x), AZ * deg, 1e-12), 'the viewer is not at the chosen elevation and azimuth');
	P.centre = pt(0.12, 0.2, 0.28);

	// ---- the box's frame at its corner: r-hat, theta-hat, phi-hat, and the outward normals of the faces seen
	const rh = sph(1, TH + DTH / 2, PH + DPH / 2);
	const th = pt(Math.cos(TH + DTH / 2) * Math.cos(PH + DPH / 2), Math.cos(TH + DTH / 2) * Math.sin(PH + DPH / 2), -Math.sin(TH + DTH / 2));
	const ph = pt(-Math.sin(PH + DPH / 2), Math.cos(PH + DPH / 2), 0);
	for (const [n, what] of [[rh, 'the face at r + dr'], [th.clone().negate(), 'the face at theta'], [ph.clone().negate(), 'the face at phi']])
		check(n.dot(toward) > 0.25, `${what} is not seen`);
	for (const [n, what] of [[rh.clone().negate(), 'the face at r'], [th, 'the face at theta + d theta'], [ph, 'the face at phi + d phi']])
		check(n.dot(toward) < 0, `${what} is seen`);

	// ---- sampling: an arc of a coordinate line, no two points more than a quarter of a point apart on the page
	const fineArc = (f, a, b) => {
		const n = Math.max(2, Math.ceil(Math.abs(b - a) * S * 2 / 0.25));
		return Array.from({ length: n + 1 }, (_, i) => f(a + ((b - a) * i) / n));
	};
	const lat = (r, t, p0, p1) => fineArc((p) => sph(r, t, p), p0, p1);   // round a circle of latitude
	const lon = (r, p, t0, t1) => fineArc((t) => sph(r, t, p), t0, t1);   // along a line of longitude
	const rad = (t, p) => [sph(1, t, p), sph(1 + DR, t, p)];              // along the radius
	const R1 = 1 + DR, T1 = TH + DTH, P1 = PH + DPH;

	// ---- the sphere: its rim, and on its near side the equator, the circle of latitude at theta, and the line of
	// longitude at phi from the box down to the equator (the circle left out where the box's own edge runs along it)
	const ring = fineArc((a) => right.clone().multiplyScalar(Math.cos(a)).addScaledVector(up, Math.sin(a)), 0, 2 * Math.PI);
	ink.curve(ring, { color: DIM, width: AXIS, layer: -3, what: 'the sphere\'s rim' });
	const near_ = (pts) => {
		// the runs of a curve that lie on the near side of the sphere
		const runs = [];
		let run = [];
		for (const q of pts) {
			// near the horizon a line on the sphere runs into the rim at a grazing angle; it stops where it comes
			// within HORIZON points of the rim, so that the two never run together as a double line
			if (S * (1 - Math.sqrt(Math.max(0, 1 - q.dot(toward) ** 2))) >= HORIZON && q.dot(toward) > 0) run.push(q);
			else if (run.length) { runs.push(run); run = []; }
		}
		if (run.length) runs.push(run);
		return runs;
	};
	const front = (pts, what) => near_(pts).forEach((run, i) => run.length > 1 && ink.curve(run, { color: FAINT, width: HAIR, layer: -3, what: `${what} ${i}` }));
	// the equator, starting where it comes to the near side, so that its near half is one run
	const a0 = Math.atan2(-toward.z, toward.x) - Math.PI / 2;
	front(lat(1, Math.PI / 2, a0, a0 + Math.PI), 'the equator');
	front(lat(1, TH, P1, PH + 2 * Math.PI), 'the circle of latitude');
	front(lon(1, PH, T1, Math.PI / 2), 'the line of longitude');

	// ---- the axes: dotted inside the sphere, a hairline with a head outside it
	const pole = pt(0, 0, 1), xEnd = pt(1, 0, 0), O = pt(0, 0, 0);
	ink.dots(O, pole, { color: FAINT, clear0: 1.6, clear1: 0.5, layer: -2, what: 'the z axis inside' });
	ink.dots(O, xEnd, { color: FAINT, clear0: 1.6, clear1: 0.5, layer: -2, what: 'the x axis inside' });
	ink.arrow(pole, pt(0, 0, AXIS_OUT[0]), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the z axis' });
	ink.arrow(xEnd, pt(AXIS_OUT[1], 0, 0), { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 2, what: 'the x axis' });

	// ---- the corner's radius r, the angle theta from the z axis, and the angle phi in the xy plane from the x axis
	const C0 = sph(1, TH, PH);
	const foot = sph(1, Math.PI / 2, PH);
	ink.dots(O, C0, { color: FAINT, clear0: 1.6, clear1: 0.5, layer: -2, what: 'the radius r' });
	ink.dots(O, foot, { color: FAINT, clear0: 1.6, clear1: 0.5, layer: -2, what: 'the line to the foot of the meridian' });
	const aT = arc(ink, O, unitv(pole), unitv(C0), RHO_T, { what: 'the angle theta' });
	const aP = arc(ink, O, X, unitv(foot), RHO_P, { what: 'the angle phi' });
	check(near(aT.ang, TH, 1e-12) && near(aP.ang, PH, 1e-12), 'the arcs are not theta and phi');

	// ---- the radius of the circle of latitude: from the z axis to the far end of the box's edge round it, at right
	// angles to the axis
	const Zc = pt(0, 0, Math.cos(TH)), C1 = sph(1, TH, PH + DPH);
	check(near(C1.clone().sub(Zc).dot(Z), 0, 1e-12), 'the radius of the circle of latitude is not at right angles to the z axis');
	check(near(C1.distanceTo(Zc), Math.sin(TH), 1e-12), 'the radius of the circle of latitude is not r sin theta');
	ink.line(Zc, C1, { color: DIM, width: HAIR, layer: -1, what: 'the radius r sin theta' });
	ink.right(Zc, Z, unitv(C1.clone().sub(Zc)), { what: 'the right angle at the z axis' });

	// ---- the box's faces seen, tinted, drawn opaque over the sphere's lines
	const loop = (...parts) => parts.flat();
	face(ink, loop(lat(R1, TH, PH, P1), lon(R1, P1, TH, T1), lat(R1, T1, P1, PH), lon(R1, PH, T1, TH)), TINT_ACCENT, 0);   // r + dr
	face(ink, loop(lat(1, TH, PH, P1), [sph(R1, TH, P1)], lat(R1, TH, P1, PH), [sph(1, TH, PH)]), TINT_ACCENT2, 0);        // theta
	face(ink, loop(lon(1, PH, TH, T1), [sph(R1, T1, PH)], lon(R1, PH, T1, TH), [sph(1, TH, PH)]), TINT, 0);                // phi

	// ---- the box's twelve edges: solid where a face seen meets it, dashed where only faces not seen do
	const seen = { r1: true, t0: true, p0: true, r0: false, t1: false, p1: false };
	const edgesOf = [
		{ pts: lat(1, TH, PH, P1), faces: ['r0', 't0'], what: 'the edge r sin theta d phi' },
		{ pts: lat(1, T1, PH, P1), faces: ['r0', 't1'] },
		{ pts: lat(R1, TH, PH, P1), faces: ['r1', 't0'] },
		{ pts: lat(R1, T1, PH, P1), faces: ['r1', 't1'] },
		{ pts: lon(1, PH, TH, T1), faces: ['r0', 'p0'], what: 'the edge r d theta' },
		{ pts: lon(1, P1, TH, T1), faces: ['r0', 'p1'] },
		{ pts: lon(R1, PH, TH, T1), faces: ['r1', 'p0'] },
		{ pts: lon(R1, P1, TH, T1), faces: ['r1', 'p1'] },
		{ pts: rad(TH, PH), faces: ['t0', 'p0'], what: 'the edge dr' },
		{ pts: rad(TH, P1), faces: ['t0', 'p1'] },
		{ pts: rad(T1, PH), faces: ['t1', 'p0'] },
		{ pts: rad(T1, P1), faces: ['t1', 'p1'] }
	];
	edgesOf.forEach((e, i) => {
		const shown = e.faces.some((f) => seen[f]);
		const what = e.what ?? `the edge ${i}`;
		if (shown) ink.curve(e.pts, { color: INK, width: EDGE, layer: 1, what });
		else {
			// a hidden edge: dashed, the dashes running on along its curve
			ink.P.curve(e.pts, { color: INK, width: HAIR, layer: 0.5, dash: DASH, cap: 'butt' });
			ink.mark(e.pts.map((q) => ink.at(q)), HAIR / 2, what);
		}
	});
	// the corner not seen stands clear of the corner where the three faces seen meet, so that the box reads one way
	const apart = Math.hypot(...[0, 1].map((k) => ink.at(sph(1, T1, P1))[k] - ink.at(sph(R1, TH, PH))[k]));
	check(apart > 9, `the hidden corner is ${apart.toFixed(1)} pt from the front corner`);
	// the corner's three edges have the lengths the chapter gives them
	const length = (pts) => pts.slice(1).reduce((s, q, i) => s + q.distanceTo(pts[i]), 0);
	check(near(length(lon(1, PH, TH, T1)), DTH, 1e-6), 'the edge along the line of longitude is not r d theta');
	check(near(length(lat(1, TH, PH, P1)), Math.sin(TH) * DPH, 1e-6), 'the edge round the circle of latitude is not r sin theta d phi');
	check(near(length(rad(TH, PH)), DR, 1e-12), 'the radial edge is not dr');
	ink.dot(O, { what: 'O' });

	// ---- labels: each set its gap away from a point in a chosen direction (and checked below to clear every mark).
	// The three lengths go on edges of the box's outline: r d theta on the line of longitude at phi, r sin theta d phi
	// on the circle of latitude at theta (both at the radius r), and dr on the radial edge at (theta, phi + d phi);
	// every radial edge has the length dr.
	const sc = (p) => ink.at(p);
	const mid = (pts) => pts[Math.floor(pts.length / 2)];
	const L = [];
	// a label `gap` of air from every mark, moved out from q along u by no more than `reach` points beyond the least
	// distance that clears q itself, so that it stays beside what it names
	const label = async (src, q, u, color, gap = 2.3, reach = 10) => {
		const first = await beside(src, q, u, gap, color);
		const shift = (l, s) => ({ l: l.box.l + u[0] * s, r: l.box.r + u[0] * s, t: l.box.t + u[1] * s, b: l.box.b + u[1] * s });
		for (let s = 0; s <= reach; s += 0.05) {
			const box = shift(first, s);
			if (ink.clearance(box).d >= gap && L.every((o) => o.box.r + gap <= box.l || box.r + gap <= o.box.l || o.box.b + gap <= box.t || box.b + gap <= o.box.t))
				return beside(src, [q[0] + u[0] * s, q[1] + u[1] * s], u, gap, color);
		}
		const c = ink.clearance(first.box);
		check(false, `no room for the label ${src} beside its mark (${c.d.toFixed(2)} pt from ${c.what})`);
		return first;
	};
	L.push(await label('z', sc(pt(0, 0, AXIS_OUT[0])), unit2(0, -1), DIM));
	L.push(await label('x', sc(pt(AXIS_OUT[1], 0, 0)), unit2(-0.3, 1), DIM));
	L.push(await label('\\vartheta', sc(aT.mid), unit2(0.85, -0.5), DIM));
	L.push(await label('\\varphi', sc(aP.mid), unit2(0.1, 1), DIM));
	L.push(await label('r', sc(C0.clone().multiplyScalar(0.55)), unit2(-0.46, 0.89), DIM));
	L.push(await label('r\\sin\\vartheta', sc(Zc.clone().lerp(C1, 0.5)), unit2(0, -1), DIM));
	L.push(await label('\\mathrm dr', sc(sph(1 + 0.62 * DR, TH, P1)), unit2(-0.39, -0.92), INK));
	const along = (pts, t) => pts[Math.round(t * (pts.length - 1))];
	L.push(await label('r\\,\\mathrm d\\vartheta', sc(along(lon(1, PH, TH, T1), 0.68)), unit2(-1, 0.25), INK));
	L.push(await label('r\\sin\\vartheta\\,\\mathrm d\\varphi', sc(mid(lat(1, TH, PH, P1))), unit2(-1, 0.1), INK));

	ink.checkAll(L);
	return finish(name, P, L, [240, 340]);
}
