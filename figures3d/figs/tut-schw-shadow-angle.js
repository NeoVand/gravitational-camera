// The tutorial, section 11.1 (tutorial/black-holes/schwarzschild.md), its fourth diagram: the cone of the shadow at a
// camera at rest at r = 8 r_s. The plane of the orbit on one scale in r_s, the hole at the left (a dark disc of radius
// r_s, the photon sphere dashed), the camera at the right, a small ink square. From the camera, a dotted line through
// the hole's centre, the direction of the hole, on to the left; the cone of the shadow, bounded by its one edge, the
// ray with b = b_c: it leaves the camera at +-alpha_h from that line and, traced back, runs over (and under) the hole
// to the axis on the far side, which it reaches at 1.577 r_s, just outside the photon sphere, where its two halves
// meet; the cone is filled with the page's faint tint and its edge drawn whole from the camera (the upper half lies
// under the drawn ray, which leaves the camera beside it); arcs at the camera named "alpha_h" (below) and "psi"
// (above). One exact ray in the light role's colour, arriving at the camera from above just outside the cone: traced
// back, it winds once round the photon sphere and leaves to the left, where its straight asymptote is parallel to the
// line to the hole; there its impact parameter is marked by a perpendicular from that line to the asymptote, named "b".
// The ray: b = 1.00090 b_c, chosen so that, traced back from the camera, it sweeps exactly 540 degrees and its
// asymptote is parallel to the line to the hole (asserted); then psi = 17.70 degrees against alpha_h = 17.69 degrees:
// any ray bent round the photon sphere is seen within a degree or two of the cone's edge from 8 r_s.
// The angles: the drawing is the plane (r cos phi, r sin phi), in which a camera's radial ruler is stretched by
// 1/sqrt(1 - r_s/r), so a direction at psi on the camera's sky is drawn at arctan(tan psi / sqrt(1 - r_s/r)); the
// arcs are drawn so (18.82 degrees for alpha_h), which is the drawn direction of the b_c ray at the camera (asserted),
// so the arcs end on the cone's edge.
// Departures from the diagram's comment: the cone is drawn as the region its directions sweep, bounded by the b_c rays
// themselves rather than by their straight tangents, so that it has one edge from the camera to the far side of the
// hole (straight edges beside the curved ray read as a broken edge); the photon sphere's dashes are cut where the ray
// runs over them; the direction of the hole is drawn as a dotted line; the camera is not named.
// Exact: the ray and the cone's edge (the chapter's orbit equation, by the port in tut-schw-lib.js; the edge stays
// outside the photon sphere and crosses the far axis at 1.577 r_s, asserted), alpha_h (the chapter's arcsine, and
// the edge between rays that end on the horizon and rays that escape, asserted), b (the perpendicular from the hole's
// centre to the asymptote, the ray within 0.3 points of it at the mark), the hole, the photon sphere and the camera's
// distance. Schematic: the camera's size.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, LIGHT, HOLE, BC, RS, DEG, rayFrom, shadowRadius, firstIntegral, thin } from './tut-schw-lib.js';

const name = 'tut-schw-shadow-angle';
const check = checker(name);

// ---- the drawing (points); lengths in r_s ------------------------------------------------------------------------
const K = 20;                                   // points per r_s
const R_CAM = 8;                                // the camera, r_s
const X_LEFT = -6;                              // the ray and the line to the hole stop here
const MARK_X = -5.4;                            // where b is marked
const CAMERA = 4.2;                             // the camera's square, its side
const TINT = '#eeebe5';                         // the page's neutral tint (drawing.ts)
const ARC = { alpha: 44, psi: 56 };             // the arcs' radii at the camera
const RAY = 0.65, LINE = 0.45, EDGE = 0.45;
const DOT = 0.5, DOT_STEP = 1.6;
const caption = 'Look first at the cone: every direction inside it traces back to the horizon, so no light comes from it. A ray at the angle $\\psi$ has $\\sin\\psi = (b/r)\\sqrt{1 - r_s/r}$, and the cone\'s edge is the ray with $b = b_c$. The ray is exact; the camera\'s size is not to scale.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'schw-shadow-angle', caption);

	const r = R_CAM * RS;                         // GM/c^2
	const f = Math.sqrt(1 - RS / r);
	const alpha = shadowRadius(r);
	check((alpha / DEG).toFixed(2) === '17.69', `alpha_h at 8 r_s is ${alpha / DEG}`);
	check(rayFrom(r, alpha - 1e-4, { maxPhi: 40 * Math.PI }).fate === 'horizon' && rayFrom(r, alpha + 1e-4, { maxPhi: 40 * Math.PI }).fate === 'infinity', 'alpha_h is not the edge between capture and escape');
	const drawn = (psi) => Math.atan(Math.tan(psi) / f);     // a direction at psi, as drawn in the plane
	const theta = drawn(alpha);
	check((theta / DEG).toFixed(2) === '18.82', `the cone's edge is drawn at ${theta / DEG}`);

	// ---- the ray: b chosen so that it sweeps 540 degrees, its asymptote parallel to the line to the hole
	const sweep = (k) => rayFrom(r, Math.asin(Math.min(1, ((k * BC) / r) * f)), { step: 1e-3, maxPhi: 20 * Math.PI }).phi;
	let lo = 1.0005, hi = 1.002;
	for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (sweep(m) > 3 * Math.PI) lo = m; else hi = m; }
	const k = (lo + hi) / 2, b = k * BC, psi = Math.asin((b / r) * f);
	const ray = rayFrom(r, psi, { step: 1e-3, keep: true, maxPhi: 20 * Math.PI });
	check(ray.fate === 'infinity' && Math.abs(ray.phi - 3 * Math.PI) < 1e-9, `the ray sweeps ${ray.phi}`);
	check(k.toFixed(5) === '1.00090' && (psi / DEG).toFixed(2) === '17.70' && psi > alpha, `the ray: b = ${k} b_c, psi = ${psi / DEG}`);
	check(firstIntegral(ray.points, b) < 1e-5, 'the first integral along the ray');
	const pts = ray.points.map(([x, y]) => [x / RS, y / RS]);
	check(near(pts[0][0], R_CAM, 1e-12) && near(pts[0][1], 0, 1e-12), 'the ray does not start at the camera');
	{
		// it leaves the camera along its drawn direction: up and toward the hole at drawn(psi)
		const q = pts.find(([x, y]) => Math.hypot(x - R_CAM, y) > 0.02);
		const a = Math.atan2(q[1], R_CAM - q[0]);
		check(Math.abs(a - drawn(psi)) < 2e-3, `the ray leaves the camera at ${a / DEG}, not ${drawn(psi) / DEG}`);
		// and the b_c ray (alpha_h) leaves along the cone's edge
		const e = rayFrom(r, alpha, { step: 1e-4, keep: true, maxPhi: 0.01 }).points.map(([x, y]) => [x / RS, y / RS]);
		const q2 = e.find(([x, y]) => Math.hypot(x - R_CAM, y) > 0.02);
		check(Math.abs(Math.atan2(q2[1], R_CAM - q2[0]) - theta) < 2e-3, 'the cone\'s edge is not the b_c ray\'s tangent');
	}
	// the part drawn: from the camera to x = X_LEFT
	const iEnd = pts.findIndex(([x], i) => i > 10 && x < X_LEFT);
	const [pa, pb] = [pts[iEnd - 1], pts[iEnd]];
	const end = [X_LEFT, pa[1] + ((X_LEFT - pa[0]) / (pb[0] - pa[0])) * (pb[1] - pa[1])];
	const drawnRay = [...pts.slice(0, iEnd), end];
	const bRs = b / RS;
	{
		// far to the left the ray runs along its asymptote y = b
		const at = drawnRay.find(([x], i) => i > 10 && x < MARK_X);
		check(Math.abs(at[1] - bRs) * K < 0.3, `the ray is ${(bRs - at[1]) * K} pt from its asymptote at the mark`);
		check(drawnRay.every(([x, y]) => Math.abs(y) < 2.8), 'the ray leaves the panel');
	}

	// ---- the page
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN - 50, ORIGIN];             // the hole's centre
	const at = ([x, y]) => [O[0] + x * K, O[1] - y * K];
	const cam = at([R_CAM, 0]);
	const circle = (rr, n = 720) => Array.from({ length: n + 1 }, (_, i) => at([rr * Math.cos((2 * Math.PI * i) / n), rr * Math.sin((2 * Math.PI * i) / n)]));

	const page = thin(drawnRay.map(at));
	// the cone: the region between the two b_c rays, traced back from the camera to the far side of the hole, where
	// they meet on the axis just outside the photon sphere; shaded, its edge drawn whole (the upper half under the ray)
	{
		// traced past the far side of the axis, then cut where it crosses it
		const all = rayFrom(r, alpha, { step: 1e-4, keep: true, maxPhi: Math.PI + 0.01 }).points.map(([x, y]) => [x / RS, y / RS]);
		const iCut = all.findIndex(([x, y], i) => i > 10 && y < 0);
		const [pa, pb] = [all[iCut - 1], all[iCut]];
		const edge = [...all.slice(0, iCut), [pa[0] + (pa[1] / (pa[1] - pb[1])) * (pb[0] - pa[0]), 0]];
		const last = edge[edge.length - 1];
		check(edge.slice(1).every(([x, y]) => y >= 0 && Math.hypot(x, y) > 1.5 && Math.hypot(x, y) < R_CAM + 1e-9), 'the b_c ray crosses the photon sphere or the axis');
		check(last[0] < -1.5 && (-last[0]).toFixed(3) === '1.577', `the b_c ray reaches the far side of the axis at r = ${-last[0]} r_s`);
		const upper = edge.map(at), lower = edge.map(([x, y]) => at([x, -y]));
		S.raw(`<path d="${pathOf([...thin(upper), ...thin(lower).reverse()])}" fill="${TINT}"/>`, 0.5);
		for (const [s, e] of [[1, upper], [-1, lower]]) S.path(thin(e), { color: DIM, width: LINE, layer: 1, cap: 'butt', what: `the cone's edge ${s}` });
	}
	// the line to the hole, dotted, from the camera on through the hole to X_LEFT
	{
		const a = [cam[0] - CAMERA / 2 - 1, cam[1]], z = at([X_LEFT, 0]);
		const n = Math.round((a[0] - z[0]) / DOT_STEP), step = (a[0] - z[0]) / n;
		const dots = Array.from({ length: n + 1 }, (_, i) => [a[0] - i * step, a[1]]);
		S.raw(`<path d="${dots.map(([x, y]) => `M${n2(x)},${n2(y)}h0`).join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1.2);
		S.mark([a, z], DOT / 2, 'the line to the hole');
	}
	// the hole, over the line to it
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${K}" fill="${HOLE}" stroke="${INK}" stroke-width="${EDGE}"/>`, 3.8);
	S.mark(circle(1, 180), EDGE / 2, 'the hole');
	// the photon sphere's dashes where the ray does not run over them
	{
		const len = 2 * Math.PI * 1.5 * K, n = Math.round(len / 4.2), step = len / n;
		for (let i = 0; i < n; i++) {
			const a0 = (i * step) / (1.5 * K), a1 = a0 + (0.57 * step) / (1.5 * K);
			const seg = Array.from({ length: 9 }, (_, j) => at([1.5 * Math.cos(a0 + ((a1 - a0) * j) / 8), 1.5 * Math.sin(a0 + ((a1 - a0) * j) / 8)]));
			if (seg.some((q) => page.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < RAY / 2 + LINE / 2 + 0.9))) continue;
			S.path(seg, { color: DIM, width: LINE, layer: 2, cap: 'butt', what: `the photon sphere, dash ${i}` });
		}
	}
	S.path(page, { color: LIGHT, width: RAY, layer: 3.5, cap: 'butt', what: 'the ray' });
	// the camera, over the ray's end
	S.raw(`<rect x="${n2(cam[0] - CAMERA / 2)}" y="${n2(cam[1] - CAMERA / 2)}" width="${CAMERA}" height="${CAMERA}" fill="${INK}"/>`, 4);
	S.boxes.push({ box: { l: cam[0] - CAMERA / 2, r: cam[0] + CAMERA / 2, t: cam[1] - CAMERA / 2, b: cam[1] + CAMERA / 2 }, what: 'the camera' });

	// ---- the arcs at the camera: alpha_h below, psi above, drawn angles from the direction of the hole
	const arcAt = async (rad, from, to, src, side) => {
		const pts2 = Array.from({ length: 61 }, (_, i) => { const t = from + ((to - from) * i) / 60; return [cam[0] - rad * Math.cos(t), cam[1] - rad * Math.sin(t)]; });
		S.path(pts2, { color: INK, width: HAIR, layer: 4, cap: 'butt', what: `the arc ${src}` });
		const mid = (from + to) / 2, u = [-Math.cos(mid), -Math.sin(mid)];
		return S.clear(src, cam[0] + (rad + 1.5) * u[0], cam[1] + (rad + 1.5) * u[1], side[0], side[1], u);
	};
	L.push({ ...(await arcAt(ARC.alpha, 0, -theta, '\\alpha_h', [0.5, 0])), on: ['the cone\'s edge -1'] });
	L.push(await arcAt(ARC.psi, 0, drawn(psi), '\\psi', [0.5, 1]));

	// ---- b: a perpendicular from the line to the hole up to the asymptote, far to the left
	{
		const x = at([MARK_X, 0])[0], y0 = O[1], y1 = O[1] - bRs * K;
		S.path([[x, y0], [x, y1]], { color: INK, width: HAIR, layer: 4, cap: 'butt', what: 'b' });
		// no end strokes: it ends on the two lines it spans, which are its ends
		L.push(await placed('b', x + HAIR / 2 + LABEL_GAP, (y0 + y1) / 2, 0, 0.5, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { k, psi: psi / DEG, alpha: alpha / DEG, theta: theta / DEG, b: bRs };
	return finish(S, L, [285, 345]);
}
