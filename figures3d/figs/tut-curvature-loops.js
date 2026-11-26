// The tutorial, section 7.2 (tutorial/geometry/curvature-and-tides.md), its first diagram: an arrow carried without
// turning round a loop, on a sphere and on a flat sheet labelled in polar coordinates. Two panels, one above the other.
// Above, "sphere": a sphere of radius a seen obliquely, the North Pole tilted toward the reader by 28 degrees and
// longitude 45 degrees east facing the reader; its thin ink outline, the equator and the meridians of 0 and 90 degrees
// east (their visible parts); the octant loop, pole -> equator along 0 degrees -> along the equator to 90 degrees east
// -> back to the pole, in the curvature's colour, heavier. Short arrows in the observer's colour, tangent to the
// sphere and pointing due south, at five places: the start at the pole (dashed), the middle of the first meridian, the
// corner on the equator at 0 degrees, the middle of the equator's arc and the middle of the second meridian; at the
// pole, the returning arrow (solid) from the same point as the starting one, and a small arc between them, "90°".
// "area pi a^2/2" inside the loop. Below, "flat sheet, polar labels": thin grey circles r = 1, 2, 3 and rays every
// 30 degrees; the loop r from 1 to 3 along theta = 0, the arc r = 3 to 90 degrees, back to r = 1 along theta = 90
// degrees and the arc r = 1 home, in the curvature's colour; arrows at the same five kinds of place, all parallel to one
// direction on the page; at the start the dashed and the solid arrow coincide, "0°". Under it, "Gamma^r_theta theta =
// -r != 0".
// Departures from the diagram's comment: the panels are stacked at every width, not side by side at 1440 px (as the
// section 6.6 and 7.1 diagrams), so that their text stays readable on a phone. The pole is tilted toward the reader by
// 28 degrees, not 25, so that the arc of 90 degrees at the pole opens wide enough to carry its label. An arrow drawn
// at a place on a leg of the loop would lie on the leg itself, since it points along it (south on a meridian; along
// the first leg on the sheet): each such arrow, and the pair at the start, is drawn a hair (OFF) inside the loop,
// parallel to the leg, so that the loop stays visible beside it; the arrow at the corner on the equator is moved the
// same hair east of the meridian below it. On the sheet the fixed direction is that of the first leg, as on the
// sphere the arrow starts pointing ahead.
// Exact: the sphere's outline, equator and meridians (each point projected, the hidden parts left out where they turn
// away), the octant, the arrows' directions (due south, the direction that carrying without turning gives, asserted in
// tut-curvature-lib.js by integrating the transport equation round the octant: 90.0 degrees at home, the area pi a^2/2
// over a^2), the sheet's grid and loop, and on it the arrow's unchanging direction (asserted the same by integrating the
// transport with Gamma^r_thth = -r and Gamma^th_rth = 1/r). Schematic: the arrows' length and the hair OFF.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, VEC, VEC_HEAD, HAIR } from './tut-pot-lib.js';
import { INK, RULE } from '../lib.js';
import { chapter, palette, OBS, CURV, south, onSphere } from './tut-curvature-lib.js';

const name = 'tut-curvature-loops';
const check = checker(name);

const DEG = Math.PI / 180;
const A = 82;                              // the sphere's radius, points
const ELEV = 28;                           // the pole's tilt toward the reader, degrees
const FACE = 45;                           // the longitude that faces the reader, degrees
const LINE = 0.45;                         // the sphere's outline, equator and meridians; the sheet's grid
const LOOP = 0.95;                         // the loops
const ARROW = 0.3;                         // an arrow's length on the sphere, units of a
const OFF = 5.0;                           // an arrow on a leg is drawn this far inside the loop, points
const ARC = 0.13;                          // the arc at the pole, its radius in units of a
const DASH = [1.6, 1.1];                   // the starting arrow's dashes
const U = 26;                              // the sheet's points per unit of r
const SHEET_ARROW = 0.66;                  // an arrow's length on the sheet, units of r
const PANEL_GAP = 16;                      // between the sphere's panel and the sheet's

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the view: the camera's direction toward the reader, its right and its up, in the sphere's frame
	const e = ELEV * DEG, f = FACE * DEG;
	const toward = [Math.cos(e) * Math.cos(f), Math.cos(e) * Math.sin(f), Math.sin(e)];
	const right = [-Math.sin(f), Math.cos(f), 0];
	const up = [-Math.sin(e) * Math.cos(f), -Math.sin(e) * Math.sin(f), Math.cos(e)];
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	check(near(dot(toward, right), 0, 1e-15) && near(dot(toward, up), 0, 1e-15) && near(dot(right, up), 0, 1e-15), 'the camera\'s frame');
	const cx = ORIGIN, cy = ORIGIN - 90;
	const P = (p) => [cx + A * dot(p, right), cy - A * dot(p, up)];
	const seen = (p) => dot(p, toward) > 0;
	const sph = (th, ph) => onSphere(th, ph);

	// ---- the outline, the equator and the two meridians, their visible parts
	S.path(Array.from({ length: 361 }, (_, i) => [cx + A * Math.cos(i * DEG), cy + A * Math.sin(i * DEG)]), { color: INK, width: LINE, layer: 1, what: 'the outline' });
	const visible = (pts3, what, color = INK, width = LINE, layer = 1) => {
		let run = [];
		const runs = [];
		for (const p of pts3) { if (seen(p)) run.push(P(p)); else if (run.length) { runs.push(run); run = []; } }
		if (run.length) runs.push(run);
		for (const [k, r] of runs.entries()) if (r.length > 1) S.path(r, { color, width, layer, what: `${what} ${k}` });
	};
	visible(Array.from({ length: 721 }, (_, i) => sph(90 * DEG, i * 0.5 * DEG)), 'the equator');
	for (const ph of [0, 90]) visible(Array.from({ length: 361 }, (_, i) => sph(i * 0.5 * DEG, ph * DEG)), `the meridian ${ph}`);

	// ---- the octant, all of it in view
	const loop3 = [
		...Array.from({ length: 181 }, (_, i) => sph(i * 0.5 * DEG, 0)),
		...Array.from({ length: 181 }, (_, i) => sph(90 * DEG, i * 0.5 * DEG)).slice(1),
		...Array.from({ length: 181 }, (_, i) => sph((90 - i * 0.5) * DEG, 90 * DEG)).slice(1)
	];
	check(loop3.every(seen), 'part of the octant is out of view');
	S.path(loop3.map(P), { color: CURV, width: LOOP, layer: 2, cap: 'butt', what: 'the octant' });

	// ---- the arrows: due south at each place (tut-curvature-lib.js asserts that carrying without turning keeps it so)
	const arrow3 = (p, dir, opts) => {
		const q = p.map((v, i) => v + ARROW * dir[i]);
		return S.arrow(P(p), P(q), { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, ...opts });
	};
	const off = OFF / A;                                   // the hair, as an angle on the unit sphere
	// the middle of each meridian, moved into the loop by the hair: east of 0 degrees, west of 90
	const lonHair = Math.asin(off / Math.sin(45 * DEG));   // at colatitude 45 degrees a step d(ph) is sin(45) d(ph) long
	const places = [
		{ th: 45 * DEG, ph: lonHair, what: 'the middle of the first meridian' },
		{ th: 90 * DEG, ph: off, what: 'the corner at 0 degrees' },
		{ th: 90 * DEG, ph: 45 * DEG, what: 'the middle of the equator' },
		{ th: 45 * DEG, ph: 90 * DEG - lonHair, what: 'the middle of the second meridian' }
	];
	const drawn = [];
	for (const pl of places) {
		const p = sph(pl.th, pl.ph), s = south(pl.th, pl.ph);
		check(near(dot(p, s), 0, 1e-15) && near(dot(s, s), 1, 1e-15) && s[2] < 0, `${pl.what}: the arrow is not tangent and southward`);
		drawn.push({ ...arrow3(p, s, { what: pl.what }), what: pl.what });
	}
	// the pole: both arrows from one point a hair inside the corner (colatitude d along 45 degrees, chosen so that on
	// the page it lies the hair from each leg's direction at the pole: the corner is seen foreshortened), the starting
	// one toward longitude 0 (dashed), the returning one toward 90 (solid)
	const page = (v) => [dot(v, right), -dot(v, up)];
	const fromLeg = (d) => {
		const o = P(sph(d, 45 * DEG)), c = P(sph(0, 0)), g = page([1, 0, 0]);
		return Math.abs((o[0] - c[0]) * g[1] - (o[1] - c[1]) * g[0]) / Math.hypot(...g);
	};
	let lo = 0, hi = 0.5;
	for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (fromLeg(m) < OFF) lo = m; else hi = m; }
	const d = hi;
	check(near(fromLeg(d), OFF, 1e-9), 'the pole\'s point is not a hair from the legs');
	const pole = sph(d, 45 * DEG);
	// at the pole, the start points toward longitude 0 and comes home toward 90 (the lib's octant(): home = (0, 1, 0))
	const startDir = [1, 0, 0], homeDir = nums.turn && [0, 1, 0];
	check(near(Math.acos(dot(startDir, homeDir)) / DEG, nums.turn, 1e-6), 'the two arrows at the pole are not the turn apart');
	// each tangent to the sphere at the point: the pole's directions, laid in its tangent plane
	const tangent = (v) => { const n = pole, k = dot(v, n), w = v.map((x, i) => x - k * n[i]), l = Math.hypot(...w); return w.map((x) => x / l); };
	const t0 = tangent(startDir), t1 = tangent(homeDir);
	{
		// the dashed one: a run of dashes along it, and its head
		const a = P(pole), b = P(pole.map((v, i) => v + ARROW * t0[i]));
		const Lp = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / Lp, (b[1] - a[1]) / Lp];
		const hd = Math.min(VEC_HEAD, 0.4 * Lp), shaft = Lp - 0.8 * hd;
		const k = Math.max(1, Math.round((shaft + DASH[1]) / (DASH[0] + DASH[1]))), g = shaft / (k * DASH[0] + (k - 1) * DASH[1]);
		const dash = DASH.map((x) => +(x * g).toFixed(4));
		S.path([a, [a[0] + u[0] * shaft, a[1] + u[1] * shaft]], { color: OBS, width: VEC, layer: 3, cap: 'butt', dash, what: 'the starting arrow' });
		const base = [b[0] - u[0] * hd, b[1] - u[1] * hd], w = [-u[1], u[0]], hw = 0.36 * hd;
		S.raw(`<path d="M${b[0].toFixed(2)},${b[1].toFixed(2)}L${(base[0] + w[0] * hw).toFixed(2)},${(base[1] + w[1] * hw).toFixed(2)}L${(base[0] - w[0] * hw).toFixed(2)},${(base[1] - w[1] * hw).toFixed(2)}Z" fill="${OBS}"/>`, 3);
		S.mark([b, base], hw, 'the starting arrow\'s head');
		drawn.push({ A: a, B: b, L: Lp, what: 'the starting arrow' });
	}
	drawn.push({ ...arrow3(pole, t1, { what: 'the returning arrow' }), what: 'the returning arrow' });
	// the arc between them, in the pole's tangent plane
	const arcPts = Array.from({ length: 91 }, (_, i) => { const c = Math.cos(i * DEG), s = Math.sin(i * DEG); return P(pole.map((v, j) => v + ARC * (c * t0[j] + s * t1[j]))); });
	S.path(arcPts, { color: INK, width: HAIR, layer: 3, what: 'the arc of 90 degrees' });
	// the arrows clear the loop by air: none lies on it
	for (const ar of drawn) {
		const n = 40;
		for (let i = 1; i <= n; i++) {
			const q = [ar.A[0] + ((ar.B[0] - ar.A[0]) * i) / n, ar.A[1] + ((ar.B[1] - ar.A[1]) * i) / n];
			// an arrow that leaves the loop across it (on the equator) may touch it at its tail only
			if (Math.hypot(q[0] - ar.A[0], q[1] - ar.A[1]) < 4.5) continue;
			const least = Math.min(...loop3.map((p) => { const [X, Y] = P(p); return Math.hypot(X - q[0], Y - q[1]); }));
			check(least > 0.36 * VEC_HEAD + LOOP / 2 + 0.6, `${ar.what} touches the loop, ${least.toFixed(2)} pt`);
		}
	}

	// ---- the labels of the sphere
	const top = cy - A;
	L.push(await placed('\\text{sphere}', cx - A, top - 6, 0, 1, INK));
	{
		const mid = arcPts[45], c = P(pole), u = [mid[0] - c[0], mid[1] - c[1]], l = Math.hypot(...u);
		L.push(await S.clear(`${nums.turn.toFixed(0)}^\\circ`, mid[0] + (u[0] / l) * 2, mid[1] + (u[1] / l) * 2, 0.5, 0, [u[0] / l, u[1] / l]));
	}
	L.push(await S.clear('\\text{area } \\pi a^2/2', ...P(sph(58 * DEG, 45 * DEG)), 0.5, 0.5, [0, 1]));

	// ---- the sheet
	const sx = ORIGIN, sy = cy + A + PANEL_GAP + 3 * U + 14;
	const Q = (r, th) => [sx + U * r * Math.cos(th), sy - U * r * Math.sin(th)];
	for (const r of [1, 2, 3]) S.path(Array.from({ length: 361 }, (_, i) => Q(r, i * DEG)), { color: RULE, width: HAIR, layer: 1, what: `the circle ${r}` });
	for (let k = 0; k < 12; k++) S.path([Q(0, 0), Q(3, k * 30 * DEG)], { color: RULE, width: HAIR, layer: 1, cap: 'butt', what: `the ray ${k * 30}` });
	const sheet = [
		...Array.from({ length: 41 }, (_, i) => Q(1 + (2 * i) / 40, 0)),
		...Array.from({ length: 181 }, (_, i) => Q(3, i * 0.5 * DEG)).slice(1),
		...Array.from({ length: 41 }, (_, i) => Q(3 - (2 * i) / 40, 90 * DEG)).slice(1),
		...Array.from({ length: 181 }, (_, i) => Q(1, (90 - i * 0.5) * DEG)).slice(1)
	];
	S.path(sheet, { color: CURV, width: LOOP, layer: 2, cap: 'butt', closed: true, what: 'the sheet\'s loop' });
	// the arrows, all along +x: carrying without turning keeps them so (asserted in tut-curvature-lib.js, carrySheet)
	const len = SHEET_ARROW * U;
	const sheetPlaces = [
		{ p: Q(2, 0), lift: OFF, what: 'the middle of the first leg' },
		{ p: Q(3, 0), lift: 0, what: 'the corner at r = 3' },
		{ p: Q(3, 45 * DEG), lift: 0, what: 'the middle of the outer arc' },
		{ p: Q(2, 90 * DEG), lift: 0, what: 'the middle of the second leg' }
	];
	const sheetArrows = [];
	for (const pl of sheetPlaces) {
		const a = [pl.p[0], pl.p[1] - pl.lift];
		sheetArrows.push(S.arrow(a, [a[0] + len, a[1]], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: pl.what }));
	}
	// the start, a hair inside the loop: the dashed arrow under the solid one, the two the same
	const st = Q(1, 0), a0 = [st[0], st[1] - OFF];
	S.path([a0, [a0[0] + len - 0.8 * Math.min(VEC_HEAD, 0.4 * len), a0[1]]], { color: OBS, width: VEC, layer: 2.5, cap: 'butt', dash: [1.6, 1.1], what: 'the sheet\'s starting arrow' });
	const home = S.arrow(a0, [a0[0] + len, a0[1]], { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the sheet\'s returning arrow' });
	for (const ar of [...sheetArrows, home]) {
		check(near(ar.u[0], 1, 1e-15) && near(ar.u[1], 0, 1e-15), `${ar.what ?? 'an arrow'} is not along +x`);
		for (let i = 0; i <= 40; i++) {
			const q = [ar.A[0] + ((ar.B[0] - ar.A[0]) * i) / 40, ar.A[1]];
			const least = Math.min(...sheet.map(([X, Y]) => Math.hypot(X - q[0], Y - q[1])));
			if (Math.abs(q[0] - ar.A[0]) >= 4.5) check(least > 0.36 * VEC_HEAD + LOOP / 2 + 0.6, `a sheet arrow touches the loop, ${least.toFixed(2)} pt`);
		}
	}
	L.push(await placed('\\text{flat sheet, polar labels}', cx - A, sy - 3 * U - 6, 0, 1, INK));
	// the start's angle, inside the loop just above its arrows, between them and the ray of 30 degrees
	L.push(await placed('0^\\circ', Q(1.45, 0)[0], a0[1] - 0.36 * VEC_HEAD - LABEL_GAP - 0.4, 0.5, 1, INK));
	L.push(await placed('\\Gamma^r{}_{\\theta\\theta} = -r \\neq 0', sx, sy + 3 * U + LABEL_GAP + 4, 0.5, 0, INK));

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [150, 260]);
}
