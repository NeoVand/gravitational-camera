// The tutorial, section 2.2 (tutorial/outside/spherical-harmonics.md), its first diagram: the small spherical box
// between r and r + dr, theta and theta + d theta, phi and phi + d phi, drawn as the textbook draws it. The x, y and
// z axes run from the origin O, right-handed, each one unbroken solid line with a head (x toward the viewer at the
// lower left, y to the right, z up). The point P = (r, theta, phi) is joined to O by its radius r, and the angle theta
// is marked from the z axis to OP. Two lines on the sphere of radius r run through P: the whole circle of latitude at
// theta, and the line of longitude at phi from P down to the equator, which it meets at F; a quarter of the equator,
// from the x axis to the y axis, shows the xy plane, and the angle phi is marked in it from the x axis to the line
// from O to F (dotted), so that phi is P's azimuth. The radius r sin theta of the circle of latitude is drawn level on
// the page, from the z axis at right angles to it out to the circle's leftmost point, away from the box. The box stands
// on the sphere with its corner at P: its inner face lies on the sphere of radius r, its outer face on the sphere of
// radius r + dr, and the circle of latitude and the line of longitude run along its inner edges from P. Its edges
// from P along the line of longitude and round the circle of latitude are labelled r d theta and r sin theta d phi,
// and its radial edge at (theta, phi + d phi) dr (every radial edge has that length). Of its six faces, those at r and
// r + dr are tinted orange, those at theta and theta + d theta blue, and those at phi and phi + d phi grey; the three
// seen (r + dr, theta, phi; one of each pair) are drawn opaque, so the box hides what lies behind it, and the three
// edges that only the faces not seen share are not drawn. In true 3D: an orthographic view from ELEV degrees above
// the xy plane at the azimuth AZ from the x axis, turned and tilted as lib.js's Panel does.
// Exact: every edge and face of the box is a coordinate line or surface of the spherical coordinates (the radial
// edges straight, the others arcs of circles of latitude and longitude, sampled every quarter of a point), so that the
// edge from P along the line of longitude has the length r d theta, the edge round the circle of latitude the length
// r sin theta d phi, and the radial edge dr (asserted, from the drawn 3D points); P, the circle of latitude and the
// line of longitude lie on the sphere of radius r, and both lines pass through P (asserted); F lies on the equator at
// the azimuth phi (asserted); the radius of the circle of latitude runs from the z axis at right angles to it, has the
// length r sin theta, and lies level on the page (asserted); the arcs at O are theta and phi (asserted); the axes are
// right-handed (asserted); the faces seen are those whose outward normals point toward the viewer, and those not seen
// point away (asserted, one of each pair). Asserted for the page: no axis passes within AIR points of the box, no label
// lies on a face of it, the circle of latitude passes no nearer than AIR points to O, and near P it leaves the radius
// r at a slope of at least 0.2, so that the two never run together. Schematic: the size of the box, enlarged so that it
// can be read (d theta = 18 degrees, d phi = 17 degrees, dr = 0.3 r, far from small), and the view.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, beside, toBox, AXIS, AXIS_HEAD, HAIR } from './tut-vec-lib.js';
import { TINT, TINT_ACCENT, TINT_ACCENT2, EDGE, face, arc, cameraAxes, unitv } from './tut-gauss-lib.js';

const name = 'tut-sph-box';
const check = checker(name);
const deg = Math.PI / 180;

export const TH = 46 * deg, DTH = 18 * deg;     // theta and d theta
export const PH = 72 * deg, DPH = 17 * deg;     // phi and d phi
export const DR = 0.3;                           // dr, in units of r
const ELEV = 48, AZ = 12.5;                      // the viewer: its elevation above the xy plane and its azimuth, degrees
const S = 130;                                   // points per unit: the sphere's radius r
const AXIS_OUT = { x: 1.4, y: 1.4, z: 1.62 };   // how far the axes reach, in units of r
const RHO_T = 0.3, RHO_P = 0.3;                  // the arcs of theta and phi, units of r
const AIR = 6;                                   // the least air, points, between the box and an axis, and the circle and O

const unit2 = (x, y) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

export default async function () {
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: S, tilt: ELEV, turn: -90 - AZ });
	const ink = new Sheet(P, name);
	// the chapter's axes in the world of three.js (y up): x, y and z
	const X = v3(1, 0, 0), Y = v3(0, 0, -1), Z = v3(0, 1, 0);
	check(X.clone().cross(Y).distanceTo(Z) < 1e-12, 'the axes are not right-handed');
	const pt = (x, y, z) => X.clone().multiplyScalar(x).addScaledVector(Y, y).addScaledVector(Z, z);
	const sph = (r, t, p) => pt(r * Math.sin(t) * Math.cos(p), r * Math.sin(t) * Math.sin(p), r * Math.cos(t));
	const [, , toward] = cameraAxes(P);
	const sc0 = (p) => P.at(p);
	check(near(toward.dot(Z), Math.sin(ELEV * deg), 1e-12) && near(Math.atan2(toward.dot(Y), toward.dot(X)), AZ * deg, 1e-12), 'the viewer is not at the chosen elevation and azimuth');
	P.centre = pt(0, 0, 0);

	// ---- the box's frame at its middle: r-hat, theta-hat, phi-hat, and the outward normals of its faces
	const rh = sph(1, TH + DTH / 2, PH + DPH / 2);
	const th = pt(Math.cos(TH + DTH / 2) * Math.cos(PH + DPH / 2), Math.cos(TH + DTH / 2) * Math.sin(PH + DPH / 2), -Math.sin(TH + DTH / 2));
	const ph = pt(-Math.sin(PH + DPH / 2), Math.cos(PH + DPH / 2), 0);
	for (const [n, what] of [[rh, 'the face at r + dr'], [th.clone().negate(), 'the face at theta'], [ph.clone().negate(), 'the face at phi']])
		check(n.dot(toward) > 0.2, `${what} is not seen`);
	for (const [n, what] of [[rh.clone().negate(), 'the face at r'], [th, 'the face at theta + d theta'], [ph, 'the face at phi + d phi']])
		check(n.dot(toward) < 0, `${what} is seen`);

	// ---- sampling: an arc of a coordinate line, no two points more than a quarter of a point apart on the page
	const fineArc = (f, a, b, r = 1 + DR) => {
		const n = Math.max(2, Math.ceil((Math.abs(b - a) * S * r) / 0.25));
		return Array.from({ length: n + 1 }, (_, i) => f(a + ((b - a) * i) / n));
	};
	const lat = (r, t, p0, p1) => fineArc((p) => sph(r, t, p), p0, p1);   // round a circle of latitude
	const lon = (r, p, t0, t1) => fineArc((t) => sph(r, t, p), t0, t1);   // along a line of longitude
	const rad = (t, p) => [sph(1, t, p), sph(1 + DR, t, p)];              // along the radius
	const R1 = 1 + DR, T1 = TH + DTH, P1 = PH + DPH;

	// ---- the points: O, P = (r, theta, phi), the foot F of P's line of longitude on the equator, and the centre Zc of
	// the circle of latitude on the z axis
	const O = pt(0, 0, 0), Pp = sph(1, TH, PH);
	const F = sph(1, Math.PI / 2, PH);
	const Zc = pt(0, 0, Math.cos(TH));
	check(near(Pp.length(), 1, 1e-12), 'P is not on the sphere of radius r');
	check(near(F.dot(Z), 0, 1e-12) && near(Math.atan2(F.dot(Y), F.dot(X)), PH, 1e-12), 'F is not on the equator at the azimuth phi');

	// ---- the sphere of radius r, for reference: the whole circle of latitude at theta, the line of longitude at phi
	// from P down to the equator, and a quarter of the equator; the box hides what passes behind it
	const wire = { color: FAINT, width: HAIR, layer: -2 };
	const equator = lat(1, Math.PI / 2, 0, Math.PI / 2);
	// the circle starts and ends at P, so that P is one of its points
	const circle = lat(1, TH, PH - 2 * Math.PI, PH);
	const meridian = lon(1, PH, TH, Math.PI / 2);
	ink.curve(equator, { ...wire, what: 'the equator' });
	ink.curve(circle, { ...wire, what: 'the circle of latitude' });
	ink.curve(meridian, { ...wire, what: 'the line of longitude' });
	const onCurve = (pts, q) => Math.min(...pts.map((p) => p.distanceTo(q)));
	check(onCurve(circle, Pp) < 1e-12 && onCurve(meridian, Pp) < 1e-12 && [...circle, ...meridian].every((q) => near(q.length(), 1, 1e-12)), 'the circle of latitude and the line of longitude do not pass through P');

	// ---- the axes: solid, unbroken, from O
	const ends = { x: pt(AXIS_OUT.x, 0, 0), y: pt(0, AXIS_OUT.y, 0), z: pt(0, 0, AXIS_OUT.z) };
	for (const k of ['x', 'y', 'z']) ink.arrow(O, ends[k], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: -1, what: `the ${k} axis` });

	// ---- the radius r, and the line from O to F in the xy plane, dotted, which carries the azimuth phi
	ink.line(O, Pp, { color: DIM, width: AXIS, layer: -1, what: 'the radius r' });
	ink.dots(O, F, { color: FAINT, clear0: 1.6, clear1: 0, layer: -1, what: 'the line from O to F' });
	const aT = arc(ink, O, Z, unitv(Pp), RHO_T, { what: 'the angle theta' });
	const aP = arc(ink, O, X, unitv(F), RHO_P, { what: 'the angle phi' });
	check(near(aT.ang, TH, 1e-12) && near(aP.ang, PH, 1e-12), 'the arcs are not theta and phi');

	// ---- the radius of the circle of latitude: from the z axis, at right angles to it, to the circle's leftmost point
	// on the page (at the azimuth AZ - 90 degrees), where it lies flat on the page and clear of the box
	const Q = sph(1, TH, AZ * deg - Math.PI / 2);
	check(near(Q.clone().sub(Zc).dot(Z), 0, 1e-12), 'the radius of the circle of latitude is not at right angles to the z axis');
	check(near(Q.distanceTo(Zc), Math.sin(TH), 1e-12), 'the radius of the circle of latitude is not r sin theta');
	check(near(sc0(Q)[1], sc0(Zc)[1], 1e-9) && circle.every((q) => sc0(q)[0] >= sc0(Q)[0] - 1e-9), 'the radius of the circle of latitude does not run level to the circle\'s leftmost point');
	ink.line(Zc, Q, { color: DIM, width: HAIR, layer: -1, what: 'the radius r sin theta' });
	ink.right(Zc, Z, unitv(Q.clone().sub(Zc)), { layer: -1, what: 'the right angle at the z axis' });

	// ---- the box's faces seen, tinted, drawn opaque over the lines behind them
	const loop = (...parts) => parts.flat();
	face(ink, loop(lat(R1, TH, PH, P1), lon(R1, P1, TH, T1), lat(R1, T1, P1, PH), lon(R1, PH, T1, TH)), TINT_ACCENT, 0);   // r + dr
	face(ink, loop(lat(1, TH, PH, P1), [sph(R1, TH, P1)], lat(R1, TH, P1, PH), [sph(1, TH, PH)]), TINT_ACCENT2, 0);        // theta
	face(ink, loop(lon(1, PH, TH, T1), [sph(R1, T1, PH)], lon(R1, PH, T1, TH), [sph(1, TH, PH)]), TINT, 0);                // phi

	// ---- the box's twelve edges: drawn where a face seen meets it; the box is opaque, so the others are not drawn
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
	});
	// P's three edges have the lengths the chapter gives them
	const length = (pts) => pts.slice(1).reduce((s, q, i) => s + q.distanceTo(pts[i]), 0);
	check(near(length(lon(1, PH, TH, T1)), DTH, 1e-6), 'the edge along the line of longitude is not r d theta');
	check(near(length(lat(1, TH, PH, P1)), Math.sin(TH) * DPH, 1e-6), 'the edge round the circle of latitude is not r sin theta d phi');
	check(near(length(rad(TH, PH)), DR, 1e-12), 'the radial edge is not dr');
	ink.dot(O, { what: 'O' });

	// ---- on the page: the box clear of the axes, and the circle of latitude clear of O and of the radius r near P
	const faces = [
		loop(lat(R1, TH, PH, P1), lon(R1, P1, TH, T1), lat(R1, T1, P1, PH), lon(R1, PH, T1, TH)),
		loop(lat(1, TH, PH, P1), lat(R1, TH, P1, PH)),
		loop(lon(1, PH, TH, T1), lon(R1, PH, T1, TH))
	].map((f) => f.map(sc0));
	const inside = (q, poly) => {
		let c = false;
		for (let i = 0, j = poly.length - 1; i < poly.length; j = i++)
			if ((poly[i][1] > q[1]) !== (poly[j][1] > q[1]) && q[0] < ((poly[j][0] - poly[i][0]) * (q[1] - poly[i][1])) / (poly[j][1] - poly[i][1]) + poly[i][0]) c = !c;
		return c;
	};
	const outline = faces.flat();
	for (const k of ['x', 'y', 'z']) {
		const A = sc0(O), B = sc0(ends[k]);
		for (let i = 0; i <= 400; i++) {
			const q = [A[0] + ((B[0] - A[0]) * i) / 400, A[1] + ((B[1] - A[1]) * i) / 400];
			check(!faces.some((f) => inside(q, f)) && outline.every((b) => Math.hypot(b[0] - q[0], b[1] - q[1]) >= AIR), `the ${k} axis passes within ${AIR} pt of the box`);
		}
	}
	const o0 = sc0(O), p0 = sc0(Pp);
	check(circle.every((q) => Math.hypot(sc0(q)[0] - o0[0], sc0(q)[1] - o0[1]) >= AIR), `the circle of latitude passes within ${AIR} pt of O`);
	const toRadius = (q) => {
		const d = [p0[0] - o0[0], p0[1] - o0[1]], l = Math.hypot(...d);
		return Math.abs((q[0] - o0[0]) * d[1] - (q[1] - o0[1]) * d[0]) / l;
	};
	for (const q of circle.map(sc0)) {
		const s = Math.hypot(q[0] - p0[0], q[1] - p0[1]);
		if (s >= 3 && s <= 60) check(toRadius(q) >= 0.2 * s, 'the circle of latitude runs along the radius r near P');
	}

	// ---- labels: each set its gap away from a point in a chosen direction (and checked below to clear every mark)
	const sc = (p) => ink.at(p);
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
	const along = (pts, t) => pts[Math.round(t * (pts.length - 1))];
	L.push(await label('x', sc(ends.x), unit2(-0.5, 1), DIM));
	L.push(await label('y', sc(ends.y), unit2(1, 0.3), DIM));
	L.push(await label('z', sc(ends.z), unit2(0, -1), DIM));
	L.push(await label('\\vartheta', sc(aT.mid), unit2(0.6, -1), DIM));
	L.push(await label('\\varphi', sc(aP.mid), unit2(0.15, 1), DIM));
	L.push(await label('r', sc(Pp.clone().multiplyScalar(0.62)), unit2(-0.85, -0.53), DIM));
	L.push(await label('r\\sin\\vartheta', sc(Zc.clone().lerp(Q, 0.5)), unit2(0, -1), DIM));
	L.push(await label('\\mathrm dr', sc(sph(1 + 0.5 * DR, TH, P1)), unit2(-0.45, -0.9), INK));
	L.push(await label('r\\,\\mathrm d\\vartheta', sc(along(lon(1, PH, TH, T1), 0.5)), unit2(-0.85, 0.5), INK));
	L.push(await label('r\\sin\\vartheta\\,\\mathrm d\\varphi', sc(along(lat(1, TH, PH, P1), 0.5)), unit2(-1, -0.25), INK));

	ink.checkAll(L);
	// no label lies on a face of the box
	for (const l of L) for (const f of faces) {
		const corners = [[l.box.l, l.box.t], [l.box.r, l.box.t], [l.box.l, l.box.b], [l.box.r, l.box.b]];
		check(!corners.some((c) => inside(c, f)) && !f.some((q) => toBox(l.box, q) === 0), `the label ${l.src} lies on a face of the box`);
	}
	return finish(name, P, L, [240, 340]);
}
