// The tutorial, chapter 13.5 (tutorial/what-a-field-keeps/impulsive-waves.md), its second diagram: the light-ray
// transform. Both panels in one orthographic view (turned and tilted alike), the axis nu across the page in both.
// Left: a lumpy body at rest, three Gaussian lumps of density, drawn as the stone (lit by the studio over the sawn
// stone's colours, tut-pass-lib.js) out to one surface of equal density; a bundle of parallel null rays along one
// direction n_1 (down the page), thin lines in the light role's colour, hidden where the body is in front of them;
// below the body, the plane of the wave's front, a pale tint, and on it the energy that crosses the front, N = c^2
// Sigma, as a height map of ridge lines in matter's colour, each ray ending on it. A short arrow beside the bundle
// names n_1; a short arrow nu, the axis of the great circle of directions on which n_1 lies.
// Right: wavevector space, the same axis nu through its origin: for each of three directions n_1, n_2, n_3 of the great
// circle (0, 60 and 120 degrees about nu), the slice xi.n_i = 0, a translucent rectangle through the origin containing
// nu, in the light role's colour; a fourth, dashed (150 degrees), for the slices that turning n round the circle sweeps
// through every wavevector.
// Departures from the diagram's comment: the slices are labelled with the chapter's xi, the wavevector in the plane of a
// front (the text names no other wavevector, and k^mu is the wave's direction there), so that a slice is the set of the
// xi of one front; the three slices are all in the light role's colour, since only one bundle is drawn.
// Exact: the density, a sum of three Gaussian lumps, and N on the plane, the sum of their projections along n_1,
// m sqrt(2 pi) s exp(-r^2/2s^2) each (asserted against a quadrature of the density along the rays); the rays parallel
// to n_1 and ending on the height map above their feet; every n_i at right angles to nu and each slice the plane through
// the origin at right angles to its n_i, so containing nu (asserted); what the body hides of each ray, found along each
// line of sight. Schematic, as the caption says: the number and spacing of the rays, the height map's scale, the slices'
// size. Pictorial: the stone's grain, and the surface of equal density chosen to show the body.
import { INK, DIM, FAINT, THREE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, VEC, VEC_HEAD, n2, near } from './tut-pot-lib.js';
import { fitDash } from './tut-stars-lib.js';
import { View, sight, insidePolygon, stonePicture, stoneColours } from './tut-pass-lib.js';
import { chapter, MATTER, LIGHT } from './tut-impulsive-lib.js';

const name = 'tut-light-ray-transform';
const check = checker(name);

// ---- the scene (world units; y up, nu along x) ----------------------------------------------------------------------
const TURN = -32, TILT = 26;                   // the view, degrees
const LUMPS = [                                 // mass, centre, width (standard deviation)
	{ m: 1, c: [0.45, 0.3, -0.22], s: 0.35 },
	{ m: 0.8, c: [-0.5, 0.18, -0.02], s: 0.32 },
	{ m: 0.7, c: [0.02, -0.12, 0.46], s: 0.3 }
];
const LEVEL = 0.4;                             // the stone's surface: rho = LEVEL times rho at the heaviest centre
const FLOOR = -1.7;                             // the plane of the front, y
const PLANE = 1.45;                             // its half-side in x and z
const RIDGE = 0.62;                             // the height map: the largest N as this height
const ROWS = 19, SAMPLES = 160;                 // ridge lines, each across x at one z
const RAYS_X = [-0.9, -0.3, 0.3, 0.9], RAYS_Z = [-0.75, 0, 0.75];
const RAY_TOP = 1.65;                           // where each ray starts, y
const THETA = [0, 60, 120], SWEEP = 150;        // the directions about nu, degrees from -y toward +z
const KW = 1.35, KH = 0.95;                     // a slice's half-width along nu and half-height across it
const SL = 46, SK = 44;                         // points per unit, left and right
const APART = 176;                              // between the panels' origins
const RAY_W = 0.4, RIDGE_W = 0.42, SLICE_LINE = 0.45, SLICE_FILL = 0.1;
const caption = 'Look first at the slices on the right: each direction of waves gives the transform of the energy that crosses its front on one slice, and the directions of one great circle fill every wavevector. The body and its projection are computed; the rays are drawn sparse for clarity.';

const LIGHT_ON_STONE = LIGHT.match(/light-dark\((#[0-9a-f]{6}),/)[1];
const nu = new THREE.Vector3(1, 0, 0);
const dir = (deg) => { const a = (deg * Math.PI) / 180; return new THREE.Vector3(0, -Math.cos(a), Math.sin(a)); };
const rho = (x, y, z) => LUMPS.reduce((s, l) => s + l.m * Math.exp(-((x - l.c[0]) ** 2 + (y - l.c[1]) ** 2 + (z - l.c[2]) ** 2) / (2 * l.s * l.s)), 0);
/** N along n_1 = -y: the projection of each lump, m sqrt(2 pi) s exp(-r^2 / 2 s^2). */
const sigma = (x, z) => LUMPS.reduce((s, l) => s + l.m * Math.sqrt(2 * Math.PI) * l.s * Math.exp(-((x - l.c[0]) ** 2 + (z - l.c[2]) ** 2) / (2 * l.s * l.s)), 0);

export default async function () {
	const { state } = await chapter(check);
	state(name, 'light-ray-transform', caption);
	const S = new Sheet(name);
	const L = [];
	const VL = new View({ turn: TURN, tilt: TILT, scale: SL, o: [ORIGIN - APART / 2, ORIGIN - 10] });
	const VK = new View({ turn: TURN, tilt: TILT, scale: SK, o: [ORIGIN + APART / 2, ORIGIN] });
	const ns = THETA.map(dir);
	for (const n of ns) check(near(n.dot(nu), 0, 1e-15) && near(n.length(), 1, 1e-15), 'a direction is not on the great circle');
	check(near(ns[0].y, -1, 1e-15), 'n_1 is not down');

	// ---- the projection, against a quadrature of the density along the rays
	for (const [x, z] of [[0, 0], [0.4, -0.3], [-0.7, 0.5], [1.1, 1.0]]) {
		let q = 0;
		const h = 0.002;
		for (let y = -6; y < 6; y += h) q += rho(x, y + h / 2, z) * h;
		check(near(q, sigma(x, z), 1e-9), `N at ${x}, ${z}: ${q} against ${sigma(x, z)}`);
	}
	let peak = 0;
	for (let i = 0; i <= 200; i++) for (let j = 0; j <= 200; j++) peak = Math.max(peak, sigma(-PLANE + (2 * PLANE * i) / 200, -PLANE + (2 * PLANE * j) / 200));
	const level = LEVEL * rho(...LUMPS[0].c);

	// ---- the body: the surface rho = level, as the stone
	const centre = [0, 0.14, 0];
	const B = { c: centre, f: (x, y, z) => level - rho(x, y, z) };
	// its silhouette is star-shaped about its centre's image, so that tut-pass-lib's outline holds: every ray from the
	// centre crosses the surface once (checked on many directions)
	for (let i = 0; i < 400; i++) {
		const u = new THREE.Vector3(Math.sin(i * 2.4) * Math.cos(i * 0.7), Math.cos(i * 1.3), Math.sin(i * 0.9)).normalize();
		let crossings = 0, prev = B.f(...centre) < 0;
		for (let t = 0.01; t < 2; t += 0.01) { const now = B.f(centre[0] + u.x * t, centre[1] + u.y * t, centre[2] + u.z * t) < 0; if (now !== prev) crossings++; prev = now; }
		check(crossings === 1, `the body is not star-shaped: ${crossings} crossings`);
	}
	const reach = 1.6;
	const colours = await stoneColours();
	const pic = await stonePicture(`${name}-body`, B, VL, { reach, size: 1.05, colours, px: 5 });
	S.raw(pic.svg, 6);
	S.raw(`<clipPath id="${name}-on"><path d="${pic.d}"/></clipPath>`, 0.1);
	S.mark(pic.outline, 0.2, 'the body');

	// ---- the plane and the height map, ridge lines from the back to the front, each hiding what lies behind it
	const TINT = '#eeebe5';
	{
		const c = [[-PLANE, -PLANE], [PLANE, -PLANE], [PLANE, PLANE], [-PLANE, PLANE]].map(([x, z]) => VL.at([x, FLOOR, z]));
		const d = 'M' + c.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${TINT}" stroke="${DIM}" stroke-width="${HAIR}" stroke-linejoin="round"/>`, 1);
		S.mark([...c, c[0]], HAIR / 2, 'the plane');
	}
	const zs = Array.from({ length: ROWS }, (_, k) => -PLANE + (2 * PLANE * k) / (ROWS - 1));
	// back to front: the row whose middle is farthest from the viewer first
	const order = zs.map((z, k) => ({ z, k, depth: VL.depth([0, FLOOR, z]) })).sort((a, b) => a.depth - b.depth);
	const rowLayer = new Map(order.map((r, i) => [r.k, 2 + i * 0.01]));
	for (const { z, k } of order) {
		const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => { const x = -PLANE + (2 * PLANE * i) / SAMPLES; return VL.at([x, FLOOR + (RIDGE * sigma(x, z)) / peak, z]); });
		const a = VL.at([PLANE, FLOOR, z]), b = VL.at([-PLANE, FLOOR, z]);
		const d = 'M' + [...pts, a, b].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${TINT}" stroke="none"/>`, rowLayer.get(k));
		const edge = k === 0 || k === ROWS - 1;
		S.path(pts, { color: MATTER, width: RIDGE_W, layer: rowLayer.get(k) + 0.001, what: `ridge ${k}` });
		if (edge) S.path([b, ...pts.slice(0, 1)], { color: MATTER, width: RIDGE_W, layer: rowLayer.get(k) + 0.001, what: `ridge ${k}'s end` });
	}

	// ---- the rays along n_1, from above the body to the height map, cut where the body hides them
	const AIR = 0.8 / SL;
	const hiddenByBody = (p) => {
		if (B.f(p.x, p.y, p.z) < 0) return true;
		const q = VL.at(p), d = VL.depth(p);
		for (const [dx, dy] of [[0, 0], [AIR * SL, 0], [-AIR * SL, 0], [0, AIR * SL], [0, -AIR * SL]]) {
			const s = sight(B, VL, [q[0] + dx, q[1] + dy], reach);
			if (s && s[0] > d) return true;
		}
		return false;
	};
	const surface = (x, z) => FLOOR + (RIDGE * sigma(x, z)) / peak;
	/** Whether the height map hides the world point p: on the line of sight from p toward the viewer, a point of the
	 * plane's square lies under the surface (marched in steps of 0.005, then the step's ends checked). */
	const hiddenBySurface = (p) => {
		for (let t = 0.004; t < 4; t += 0.005) {
			const x = p.x + VL.ez.x * t, y = p.y + VL.ez.y * t, z = p.z + VL.ez.z * t;
			if (y > FLOOR + RIDGE * 1.01) break;
			if (Math.abs(x) <= PLANE && Math.abs(z) <= PLANE && y < surface(x, z)) return true;
		}
		return false;
	};
	const onBody = (q) => insidePolygon(pic.outline, q);
	for (const x of RAYS_X) for (const z of RAYS_Z) {
		const foot = surface(x, z);
		const p0 = new THREE.Vector3(x, RAY_TOP, z), p1 = new THREE.Vector3(x, foot, z);
		check(near(p1.clone().sub(p0).normalize().dot(ns[0]), 1, 1e-12), 'a ray is not along n_1');
		const n = 400;
		let run = [];
		const flush = () => {
			if (run.length > 1) {
				const pts = run.map((p) => VL.at(p));
				// in front of the body where it crosses its outline, else among the ridges
				const front = pts.some((q) => onBody(q));
				S.path(pts, { color: LIGHT, width: RAY_W, layer: front ? 7 : 5, cap: 'butt', what: `the ray at ${x}, ${z}` });
				// where it crosses the stone, again in the light role's light-theme colour, fixed, so that it reads on the
				// stone in both themes
				if (front) S.raw(`<path d="M${pts.map(([px, py]) => `${n2(px)},${n2(py)}`).join('L')}" fill="none" stroke="${LIGHT_ON_STONE}" stroke-width="${RAY_W}" clip-path="url(#${name}-on)"/>`, 7.1);
			}
			run = [];
		};
		for (let k = 0; k <= n; k++) {
			const p = p0.clone().lerp(p1, k / n);
			if (hiddenByBody(p) || (k < n && hiddenBySurface(p))) { flush(); continue; }
			run.push(p);
		}
		flush();
	}

	// ---- n_1 beside the bundle, and nu
	{
		const a = VL.at([PLANE + 0.35, RAY_TOP, -PLANE * 0.1]), b = VL.at([PLANE + 0.35, RAY_TOP - 0.7, -PLANE * 0.1]);
		S.arrow(a, b, { color: LIGHT, width: VEC, head: VEC_HEAD, layer: 8, what: 'n_1' });
		L.push(await placed('\\hat n_1', b[0] + LABEL_GAP + 0.6, (a[1] + b[1]) / 2, 0, 0.5, LIGHT));
		const c0 = VL.at([-PLANE - 0.1, FLOOR, -PLANE - 0.6]), c1 = VL.at([-PLANE + 0.5, FLOOR, -PLANE - 0.6]);
		S.arrow(c0, c1, { color: INK, width: VEC, head: VEC_HEAD, layer: 8, what: 'nu left' });
		L.push(await placed('\\hat\\nu', c1[0] + LABEL_GAP + 0.6, c1[1], 0, 0.5, INK));
	}
	// N, beside the plane's right corner
	{
		const q = VL.at([PLANE, FLOOR, PLANE]);
		L.push(await S.clear('\\mathcal N = c^2\\Sigma', q[0] + LABEL_GAP + 1, q[1], 0, 0.5, [1, 0], { color: MATTER }));
	}

	// ---- wavevector space
	{
		const halves = [];
		for (const [i, deg] of [...THETA, SWEEP].entries()) {
			const n = dir(deg), t = n.clone().cross(nu).normalize();
			check(near(t.dot(n), 0, 1e-15) && near(nu.dot(n), 0, 1e-15), 'a slice does not hold nu');
			for (const s of [1, -1]) {
				const pts = [nu.clone().multiplyScalar(-KW), nu.clone().multiplyScalar(KW), nu.clone().multiplyScalar(KW).add(t.clone().multiplyScalar(s * KH)), nu.clone().multiplyScalar(-KW).add(t.clone().multiplyScalar(s * KH))];
				check(pts.every((p) => near(p.dot(n), 0, 1e-12)), 'a slice is not at right angles to its direction');
				const depth = pts.reduce((sum, p) => sum + VK.depth(p), 0) / pts.length;
				halves.push({ i, s, pts, depth, dashed: i === 3 });
			}
		}
		halves.sort((a, b) => a.depth - b.depth);
		halves.forEach((h, k) => {
			const pts = h.pts.map((p) => VK.at(p));
			const layer = 2 + k * 0.1;
			const edge = [pts[1], pts[2], pts[3], pts[0]];   // the three outer edges; the fourth is the axis
			const e = 'M' + edge.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L');
			if (h.dashed) {
				const style = fitDash(edge, [2.0, 1.6]).dash;
				S.raw(`<path d="${e}" fill="none" stroke="${LIGHT}" stroke-width="${SLICE_LINE}" stroke-dasharray="${style.join(' ')}" stroke-linejoin="round"/>`, layer);
			} else {
				const d = 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
				S.raw(`<path d="${d}" fill="${LIGHT}" fill-opacity="${SLICE_FILL}" stroke="none"/>`, layer);
				S.raw(`<path d="${e}" fill="none" stroke="${LIGHT}" stroke-width="${SLICE_LINE}" stroke-linejoin="round"/>`, layer + 0.05);
			}
			S.mark(edge, SLICE_LINE / 2, `slice ${h.i + 1}`);
		});
		// each slice's name beyond the outer edge of its upper half, at its far end
		for (let i = 0; i < 3; i++) {
			const h = halves.filter((x) => x.i === i).map((x) => [VK.at(x.pts[2]), VK.at(x.pts[3])]);
			const c = h.flat().reduce((a, b) => (b[0] > a[0] ? b : a));
			L.push(await S.clear(`\\boldsymbol\\xi\\cdot\\hat n_${i + 1} = 0`, c[0] + LABEL_GAP + 0.5, c[1], 0, 0.5, [1, 0], { color: INK, size: 7.5 }));
		}
		const a = VK.at(nu.clone().multiplyScalar(-KW - 0.25)), b = VK.at(nu.clone().multiplyScalar(KW + 0.45));
		S.arrow(a, b, { color: INK, width: VEC, head: VEC_HEAD, layer: 4, what: 'nu in xi' });
		L.push(await placed('\\hat\\nu', b[0] + LABEL_GAP + 0.5, b[1], 0, 0.5, INK));
		const o = VK.at(new THREE.Vector3(0, 0, 0));
		S.raw(`<circle cx="${n2(o[0])}" cy="${n2(o[1])}" r="1" fill="${INK}"/>`, 4.1);
		S.mark([o], 1, 'the origin');
	}
	void FAINT;

	S.checkAll(L);
	return finish(S, L, [300, 420]);
}
