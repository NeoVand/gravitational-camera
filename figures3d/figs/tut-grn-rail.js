// The tutorial, chapter 2.4 (tutorial/outside/greens-functions.md), its second diagram: the potential of a long rail,
// in a plane across it. The rail seen end-on at the centre, and its equipotentials, circles about it at the radii 0.25,
// 0.5, 1, 2 and 4 m: equal steps in ln r, so equal steps of the potential Phi = 2 G lambda ln r + a constant. Each
// circle is labelled, just above its top, by its potential less that of the 1 m circle, in units of 2 G lambda:
// ln(r / 1 m) = -1.39, -0.69, 0, 0.69 and 1.39. The pull, 2 G lambda / r toward the rail, drawn as arrows in the
// field's colour, on the ring at 3 m along the four diagonals. The middle of the view, inside a square window, is
// enlarged in an inset to the right, where the rail's profile can be seen and the two inner circles are labelled.
// Exact: the circles' radii, to one scale (asserted in points), and their labels (asserted from ln r); the arrows
// point at the rail's centre of mass (asserted); the inset is the window enlarged (asserted at its corners); the rail's profile,
// drawn to the same scale, is that of a standard flat-bottomed rail of about 60 kg per metre (UIC 60: 172 mm tall,
// its foot 150 mm wide, its head 72 mm, its web 16.5 mm), simplified to straight edges joined by round fillets (the
// crown of its head flat), whose area times the density of steel, 7850 kg m^-3, is 60.6 kg per metre (asserted within
// a kilogram of the chapter's 60), with its centre of mass at the circles' centre (asserted); the chapter's pull at 1 m,
// 2 G lambda / r = 8.0 x 10^-9 m s^-2 (asserted). Schematic: the arrows' common scale.
// Pictorial: the rail's sawn face, the metal of the paper's figure on gravitational hair (figs/hair.js, the core's
// patch, sprites/hair/core-metal.png, from an image model, cut out by design/hair_sprites.py), clipped to the exact
// profile and edged in a fixed dark ink (the site does not swap it).
import { INK, FAINT, sprite } from '../lib.js';
import { picture } from '../stone.js';
import { Sheet, ORIGIN, placed, finish, checker, near, LINE, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { FIELD, STONE_INK } from './tut-orb-lib.js';

const name = 'tut-grn-rail';
const check = checker(name);

// ---- the physics (SI) -------------------------------------------------------------------------------------------
export const G = 6.674e-11;
export const LAMBDA = 60;                    // kg per metre
export const STEEL_DENSITY = 7850;           // kg per cubic metre
export const RADII = [0.25, 0.5, 1, 2, 4];   // m
export const PRINTED = ['-1.39', '-0.69', '0', '0.69', '1.39'];
/** Half the rail's profile, in mm, as the corners of a polygon from the edge of its foot round to the top of its head
 * (x >= 0, y up from the foot), each rounded with its radius: the foot's edges, the fillets where the foot and the
 * head meet the web, the head's lower edge and its upper corners. */
const HALF = [[75, 0, 1.5], [75, 11.5, 2], [8.25, 27, 15], [8.25, 124, 15], [36, 137, 3], [36, 172, 13]];

/** A closed polygon of [x, y] corners with each corner rounded by its radius (0: left sharp): the arc tangent to
 * both edges, sampled in n steps. */
function rounded(pts, radii, n = 24) {
	const out = [];
	for (let i = 0; i < pts.length; i++) {
		const B = pts[i], r = radii[i];
		if (!r) { out.push(B); continue; }
		const A = pts[(i + pts.length - 1) % pts.length], C = pts[(i + 1) % pts.length];
		const l1 = Math.hypot(A[0] - B[0], A[1] - B[1]), l2 = Math.hypot(C[0] - B[0], C[1] - B[1]);
		const u1 = [(A[0] - B[0]) / l1, (A[1] - B[1]) / l1], u2 = [(C[0] - B[0]) / l2, (C[1] - B[1]) / l2];
		const th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2, t = r / Math.tan(th);
		check(t < l1 / 2 && t < l2 / 2, `the rail's corner ${i} is rounded past its edges`);
		const bl = Math.hypot(u1[0] + u2[0], u1[1] + u2[1]), bis = [(u1[0] + u2[0]) / bl, (u1[1] + u2[1]) / bl];
		const c = [B[0] + (bis[0] * r) / Math.sin(th), B[1] + (bis[1] * r) / Math.sin(th)];
		const a1 = Math.atan2(B[1] + u1[1] * t - c[1], B[0] + u1[0] * t - c[0]), a2 = Math.atan2(B[1] + u2[1] * t - c[1], B[0] + u2[0] * t - c[0]);
		let d = a2 - a1;
		while (d > Math.PI) d -= 2 * Math.PI;
		while (d < -Math.PI) d += 2 * Math.PI;
		for (let k = 0; k <= n; k++) out.push([c[0] + r * Math.cos(a1 + (d * k) / n), c[1] + r * Math.sin(a1 + (d * k) / n)]);
	}
	return out;
}

// ---- the drawing (points) ---------------------------------------------------------------------------------------
const S_M = 21;                      // points per metre, the whole view
const WIN = 0.6;                     // the window at the middle: a square 2 WIN metres wide, inside the 1 m circle
const INSET = 151.2;                 // the inset, the window enlarged six times: a square INSET points wide, to the right
const GAP = 16;                      // from the 4 m circle to the inset
const RING = 3;                      // where the arrows are centred, m: midway, in ln r, between the 2 m and 4 m circles
const ARROW = 16;                    // an arrow's length, points (schematic)
const DIRS = [45, 135, 225, 315];    // the arrows' directions from the rail, degrees
const ARROW_W = 0.65, ARROW_HEAD = 4;    // as tut-pot-contours's gradient arrows
const FRAME = 0.4;                   // the window and the inset's frame (as tut-sph-goce)
const RIM = 0.3;                     // the rail's edge
const STEP = 0.25;                   // the circles' sampling, points along the curve

/** The polygon's area (shoelace) and centroid. */
function areaOf(pts) {
	let a = 0, cx = 0, cy = 0;
	for (let i = 0; i < pts.length; i++) {
		const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
		const c = x0 * y1 - x1 * y0;
		a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c;
	}
	return { area: Math.abs(a) / 2, cx: cx / (3 * a), cy: cy / (3 * a) };
}

export default async function () {
	// ---- the numbers the chapter prints
	RADII.forEach((r, i) => {
		const v = Math.log(r);
		check((Math.abs(v) < 0.005 ? '0' : v.toFixed(2)) === PRINTED[i], `ln ${r} is ${v}, not ${PRINTED[i]}`);
	});
	for (let i = 1; i < RADII.length; i++) check(near(Math.log(RADII[i]) - Math.log(RADII[i - 1]), Math.log(2), 1e-12), 'the steps of the potential are not equal');
	check((2 * G * LAMBDA / 1).toExponential(1) === '8.0e-9', 'the pull at 1 m is not 8.0 x 10^-9 m s^-2');

	// ---- the rail's profile: the whole polygon (mm, y up), its mass per metre and its centre of mass
	const corners = [...HALF.slice().reverse().map(([x, y, r]) => [-x, y, r]), ...HALF];
	const profile = rounded(corners.map(([x, y]) => [x, y]), corners.map((c) => c[2]));
	const { area, cx: gx, cy: gy } = areaOf(profile);
	const perMetre = area * 1e-6 * STEEL_DENSITY;
	check(Math.abs(perMetre - LAMBDA) < 1, `the rail weighs ${perMetre} kg per metre`);
	check(near(gx, 0, 1e-9), 'the rail is not symmetric');

	const S = new Sheet(name);
	const C = [ORIGIN - 80, ORIGIN];                                   // the rail, in the whole view
	const MAG = INSET / (2 * WIN * S_M);                               // the inset's enlargement
	const CI = [C[0] + 4 * S_M + GAP + INSET / 2, C[1]];               // the rail, in the inset
	/** A point r metres from the rail at deg degrees (anticlockwise from the right), in a view centred on c at k points per metre. */
	const view = (c, k) => (r, deg) => [c[0] + k * r * Math.cos((deg * Math.PI) / 180), c[1] - k * r * Math.sin((deg * Math.PI) / 180)];
	const at = view(C, S_M), atI = view(CI, S_M * MAG);
	const d = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const box = (c, h) => [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]];
	check(WIN > RADII[1] && WIN * Math.SQRT2 < RADII[2], 'the window does not lie between the 0.5 m and the 1 m circles');

	// ---- the circles, each one path; in the inset, those inside the window
	const circle = (f, r, k, what) => {
		const n = Math.ceil((2 * Math.PI * r * k) / STEP);
		const pts = Array.from({ length: n }, (_, i) => f(r, (360 * i) / n));
		S.path(pts, { color: INK, width: LINE, layer: 1, closed: true, what });
		return pts;
	};
	for (const r of RADII) {
		const pts = circle(at, r, S_M, `the circle at ${r} m`);
		check(near(Math.hypot(pts[0][0] - C[0], pts[0][1] - C[1]), r * S_M, 1e-9), `the circle at ${r} m is not to scale`);
		if (r < WIN) {
			const q = circle(atI, r, S_M * MAG, `the circle at ${r} m, enlarged`);
			check(near(Math.hypot(q[0][0] - CI[0], q[0][1] - CI[1]), r * S_M * MAG, 1e-9), `the enlarged circle at ${r} m is not to scale`);
		}
	}

	// ---- the window and the inset's frame
	S.path(box(C, WIN * S_M), { color: FAINT, width: FRAME, layer: 3, closed: true, cap: 'butt', what: 'the window' });
	S.path(box(CI, INSET / 2), { color: FAINT, width: FRAME, layer: 3, closed: true, cap: 'butt', what: 'the inset\'s frame' });
	check(near(MAG * WIN * S_M, INSET / 2, 1e-9), 'the inset is not the window enlarged');

	// ---- the rail, its centre of mass on the circles' centre, in both views (mm to points, y down)
	const metal = await sprite('/figures3d/sprites/hair/core-metal.png');
	for (const [c, k, tag] of [[C, S_M, 'whole'], [CI, S_M * MAG, 'inset']]) {
		const page = profile.map(([x, y]) => [c[0] + ((x - gx) / 1000) * k, c[1] - ((y - gy) / 1000) * k]);
		check(near(areaOf(page).cx, c[0], 1e-6) && near(areaOf(page).cy, c[1], 1e-6), 'the rail\'s centre of mass is not at the centre');
		const reach = Math.max(...page.map(([x, y]) => Math.hypot(x - c[0], y - c[1])));
		check(reach < RADII[0] * k - 1.5, 'the rail reaches the first circle');
		// the patch's clean metal reaches 0.4 / 0.46 of its half-width (stone.js, CORE_RADIUS and METAL): it covers the rail
		const half = (reach + 0.6) / (0.4 / 0.46);
		S.raw(picture(`${name}-rail-${tag}`, metal, c[0], c[1], half, d(page), 1), 2);
		S.raw(`<path d="${d(page)}" fill="none" stroke="${STONE_INK}" stroke-width="${RIM}" stroke-linejoin="round"/>`, 2);
		const xs = page.map((p) => p[0]), ys = page.map((p) => p[1]);
		S.boxes.push({ box: { l: Math.min(...xs), r: Math.max(...xs), t: Math.min(...ys), b: Math.max(...ys) }, what: `the rail (${tag})` });
	}

	// ---- the pull: arrows toward the rail, on one ring, so all of one length
	for (const deg of DIRS) {
		const a = at(RING + ARROW / (2 * S_M), deg), b = at(RING - ARROW / (2 * S_M), deg);
		const u = [(b[0] - a[0]) / ARROW, (b[1] - a[1]) / ARROW], toC = [C[0] - a[0], C[1] - a[1]], l = Math.hypot(...toC);
		check(near(u[0], toC[0] / l, 1e-9) && near(u[1], toC[1] / l, 1e-9), 'an arrow does not point at the rail');
		const lo = RING - ARROW / (2 * S_M), hi = RING + ARROW / (2 * S_M);
		check(RADII.every((c) => (c - hi) * S_M > 6 || (lo - c) * S_M > 6), 'an arrow runs into a circle');
		S.arrow(a, b, { color: FIELD, width: ARROW_W, head: ARROW_HEAD, layer: 2, what: `the pull at ${deg}` });
	}

	// ---- the potentials, each just above the top of its circle: in the inset for the two inside the window
	const L = [];
	for (const [i, r] of RADII.entries()) {
		const top = r < WIN ? atI(r, 90) : at(r, 90);
		L.push(await placed(PRINTED[i], top[0], top[1] - LINE / 2 - LABEL_GAP - 0.15, 0.5, 1, INK));
	}

	S.checkAll(L);
	return finish(S, L, [240, 340]);
}
