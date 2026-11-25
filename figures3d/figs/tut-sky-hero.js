// The tutorial's Part 12, "The sky", its hero (chapter 12.1, tutorial/sky/stars.md, and the head of 12.2 to R12b):
// the Galaxy edge-on, in front of the uniform graviton glow. Across the middle, the paper's model Galaxy
// (reference/gravcam/galaxy.py, reproduced in tut-stars-lib.js) seen exactly edge-on from far outside, to one scale in
// both directions: a thin bright disc with its bulge, split along its mid-plane by the dark lane of the model's dust.
// Left of the bulge, 8.2 kpc from the centre, the Sun, marked by the small source circle of an inset; from it the
// chapter's line of sight toward the centre (galaxy.py's, latitude zero: level, 20 pc above the mid-plane, 8.2 kpc
// long), a pale hairline that runs inside the dust lane all the way. The Sun's 20 pc above the mid-plane is 0.16 pt
// at this scale, so a circular inset above it, magnified MAG_INSET = 40 times and joined to the source circle by the
// two hairlines tangent to both, shows the Sun (a small stone ball) at its height above the mid-plane (a dashed
// hairline), inside the dust layer, with the paper's camera beside it, its lens on the line of sight. In the disc,
// five pairs of white dwarfs: two stone beads at opposite ends of a faint ring, their orbit. Behind everything, the
// uniform 0.905 K glow of chapter 12.2, a flat neutral field with rounded corners, and in it one black disc, a hole's
// shadow. No text. No orange or blue: neutrals, the stone, and matter's colour (its dark theme's pale gold, asserted
// against tut-stars-lib's MATTER) for the stars' light. The picture's colours are fixed (a picture, like the stone):
// the same in both themes.
// Exact: the brightness map, the model's light seen edge-on: at each point of the picture, I(x, z) = int rho(x, y, z)
// exp(-tau) dy along the line of sight y toward a viewer far away, rho the model's stellar density (its light in
// proportion to its mass, as galaxy.py and the chapter take it) and tau the model's dust optical depth (tut-stars-lib's
// `dust`: 1 magnitude per kpc in the mid-plane at the Sun, scale length 3.2 kpc, scale height 0.1 kpc) between that
// point and the viewer, each cell's emission absorbed by its own dust exactly (rho (1 - e^{-k dy}) / k); computed on a
// grid and shown on a scale that grows as the light's POW = 0.38 power, from the glow (no light) through matter's gold
// (at GOLD_AT) to a warm white at the brightest point (asserted: the grid reproduces direct integrals to 0.01 decade;
// halving the step changes them by under 0.3%; without dust the picture's integral over x and z is the model's whole
// stellar mass, 5.6 x 10^10 Msun, to 0.3%; the lane's faintest line lies on the mid-plane wherever the disc shows; the
// Galaxy has faded into the glow, below EDGE on that scale, at the field's top and bottom); the Sun's place,
// (-8.2, +0.02) kpc, and the centre, to scale (K points per kpc); the line of sight, along which the model's dust adds
// up to 31 magnitudes (asserted against the chapter's number, tut-stars-lib `chapter`, to 10^-4); in the inset the same
// map at 40 times the scale, the mid-plane, the Sun's centre 20 pc above it (6.24 pt) and the line of sight, level at
// the Sun's height; the inset's source circle, 1/40 of its radius, and the hairlines tangent to both (asserted).
// Departure from the map: over the last WIN points of the field's two ends the light is faded to the glow by a smooth
// window (a window, not the model, as tut-stars-columns does), where the disc's light is below WINDOWED on the scale
// (asserted), so that the faint far disc does not meet the field's edge. Schematic: the pairs (their size, their
// rings' tilt, their places, drawn from the model's density by a seeded sampler, kept on the disc's light and off its
// white core, and clear of the other marks), the sizes of the Sun's ball and the camera, the camera's place beside the
// Sun, the black disc's size and place, and the glow's texture (a seeded grain of a few per cent). Pictorial: the
// colour ramp of the light and the glow's grey; the stone, the picture of the paper's figures
// (design/prompts/hair-sprites.json, cut out by design/hair_sprites.py, ball-face.png), lit by the studio of lib.js as
// in tut-one-point-hero; the camera, the paper's (figures3d/sprites/camera.png), its tripod left off and its colour
// taken to grey here. Style references, not marks: design/candidates/tut-sky-hero/ (two runs).
import { Sheet, ORIGIN, finish, checker, n2, near } from './tut-pot-lib.js';
import { sprite } from '../lib.js';
import { MARGIN } from '../stone.js';
import { uniforms } from './tut-prob-lib.js';
import { chapter, stellar, dust, R_SUN, Z_SUN, MAG, MATTER, STONE_INK, rel } from './tut-stars-lib.js';

const name = 'tut-sky-hero';
const check = checker(name);

// ---- the picture (points; the provisional page's y down) --------------------------------------------------------
const K = 7.8;                             // points per kpc
const FW = 334, FH = 140;                  // the glow's field
const CORNER = 3;                          // its corners' radius
const DROP = 90;                           // the mid-plane, below the field's top
const POW = 0.38;                          // the ramp's position: the light, over the brightest point's, to this power
const EDGE = 0.04;                         // the most light allowed at the field's top and bottom, on that scale
const WIN = 22, WINDOWED = 0.15;           // the window over the field's ends (points), and the most light it may touch
const FLOOR = -3.0;                        // decades below the brightest point: the faintest light the checks look at
const PX = 4;                              // the field's pixels per point
// ---- the inset ---------------------------------------------------------------------------------------------------
const MAG_INSET = 40;                      // its magnification
const RI = 27;                             // its radius
const INSET = [-2, 35];                    // its centre: from the Sun's place across, and from the field's top down
const PXI = 6;                             // its pixels per point
const SUN_R = 3.6;                         // the Sun's ball
const CAM_H = 7.4;                         // the camera's height (its body, without the tripod)
const CAM_GAP = 1.8;                       // from the ball to the camera's back
const CROP = 184 / 400;                    // the camera's picture down to its base board
// ---- the marks ---------------------------------------------------------------------------------------------------
const PALE = '#f2eee4';                    // the hairlines on the picture: fixed, not swapped
const SIGHT_W = 0.45;
const RIM_W = 0.4, LEAD_W = 0.32, LEAD_A = 0.8;
const PLANE_W = 0.3, PLANE_DASH = [1.6, 1.4];
const HOLE = { at: [118, 34], r: 6.2, fill: '#050505' };   // the black disc: from the galaxy's centre across, from the top down
const PAIRS = 5, PAIR_R = 2.8, BEAD = 0.72, RING_W = 0.28, RING_A = 0.7, PAIR_GAP = 34;
// ---- the light ---------------------------------------------------------------------------------------------------
const GLOW = '#5e5b55';                    // the uniform glow
const GOLD = '#f1dc86';                    // matter's colour, its dark theme's (app.css --q-matter)
const WHITE = '#fffaec';
const GOLD_AT = 0.55;                      // where the ramp reaches the gold
const GRAIN = 0.08, GRAIN_CELL = 2.6;      // the glow's texture: relative amplitude, cell in pixels
// ---- the integrals -----------------------------------------------------------------------------------------------
const Y_FAR = 32;                          // kpc each way along the line of sight
const DY = [0.02, 0.1], Y_FINE = 12;       // the step within Y_FINE of the plane of the sky and beyond it
const GRID = { dx: 0.125, dz: 0.0125, x: 24, z: 14.5 };   // the field's table, kpc
const IGRID = { nx: 9, dz: 0.002 };        // the inset's

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgbLin = (hex) => [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
const KEY = unit([-0.55, 0.72, 0.62]), FILL = unit([0.85, -0.15, 0.5]), HALF = unit([KEY[0], KEY[1], KEY[2] + 1]);
function unit(v) { const l = Math.hypot(...v); return v.map((x) => x / l); }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The samples of the line of sight: y from Y_FAR toward -Y_FAR (the viewer at +y), and each step. */
function path(scale = 1) {
	const ys = [], ds = [];
	let y = Y_FAR;
	while (y > -Y_FAR - 1e-9) {
		const d = (Math.abs(y) <= Y_FINE + 1e-9 ? DY[0] : DY[1]) * scale;
		ys.push(y - d / 2); ds.push(d); y -= d;
	}
	return { ys, ds };
}
/** The edge-on light at (x, z), kpc: each cell emits rho dy and absorbs its own light and all the light behind it. */
function light(x, z, P, withDust = true) {
	let tau = 0, sum = 0;
	for (let i = 0; i < P.ys.length; i++) {
		const y = P.ys[i], d = P.ds[i], r = stellar(x, y, z);
		const k = withDust ? dust(x, y, z) : 0;
		if (k * d > 1e-9) { sum += r * Math.exp(-tau) * (-Math.expm1(-k * d)) / k; tau += k * d; } else sum += r * Math.exp(-tau) * d;
		if (tau > 60) break;
	}
	return sum;
}

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	let defs = '';
	const P0 = path();
	const report = {};

	// ---- the frame of the picture
	const L0 = ORIGIN - FW / 2, T0 = ORIGIN - FH / 2;
	// the galaxy's centre on a pixel corner, so that the table's mirror images fall on whole pixels
	const GX = L0 + Math.round((FW / 2) * PX) / PX, GY = T0 + Math.round(DROP * PX) / PX;
	const P = (x, z) => [GX + K * x, GY - K * z];
	const sun = P(-R_SUN, Z_SUN), centre = P(0, 0), end = P(0, Z_SUN);
	check(near(centre[0] - sun[0], K * R_SUN, 1e-9) && near(centre[1] - sun[1], K * Z_SUN, 1e-9), 'the Sun is not 8.2 kpc and 20 pc from the centre');
	check(K * Z_SUN < 0.25, 'the Sun\'s 20 pc would show without the inset');

	// ---- the map: a table of log10 I over |x| and |z| (the model and its dust are even in both), bilinear between
	const nx = Math.round(GRID.x / GRID.dx) + 1, nz = Math.round(GRID.z / GRID.dz) + 1;
	const table = new Float64Array(nx * nz);
	for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) table[i * nz + j] = Math.log10(light(i * GRID.dx, j * GRID.dz, P0));
	const top = table.reduce((a, b) => Math.max(a, b), -Infinity);
	const logAt = (x, z) => {
		const u = Math.min(nx - 1.000001, Math.abs(x) / GRID.dx), w = Math.abs(z) / GRID.dz;
		if (w >= nz - 1) return -Infinity;
		const i = Math.floor(u), j = Math.floor(w), a = u - i, b = w - j, q = (ii, jj) => table[ii * nz + jj];
		return (1 - a) * ((1 - b) * q(i, j) + b * q(i, j + 1)) + a * ((1 - b) * q(i + 1, j) + b * q(i + 1, j + 1)) - top;
	};
	// the table against direct integrals, and the integrals against a step half as long
	{
		const u = uniforms(1201), Ph = path(0.5);
		for (let n = 0; n < 40; n++) {
			const x = (u() * 2 - 1) * 20, z = (u() * 2 - 1) * (u() < 0.5 ? 0.6 : 4);
			const direct = Math.log10(light(x, z, P0)) - top;
			if (direct < FLOOR - 0.5) continue;
			report.grid = Math.max(report.grid ?? 0, Math.abs(logAt(x, z) - direct));
			report.step = Math.max(report.step ?? 0, Math.abs(light(x, z, P0) / light(x, z, Ph) - 1));
			check(Math.abs(logAt(x, z) - direct) < 0.01, `the table is ${(logAt(x, z) - direct).toFixed(4)} decades off at (${x.toFixed(2)}, ${z.toFixed(3)})`);
			check(rel(light(x, z, P0), light(x, z, Ph), 3e-3), `the integral is not converged at (${x.toFixed(2)}, ${z.toFixed(3)})`);
		}
	}
	// without dust the picture's integral over x and z is the whole stellar mass (the discs and the bulge, 5.6e10)
	{
		let m = 0;
		const Pm = path(2);
		// midpoints: x in steps of 0.05 kpc to 40, z in steps of 0.01 to 1.5 and 0.05 to 15
		for (let i = 0; i < 800; i++) {
			const x = 0.025 + 0.05 * i;
			for (let j = 0; j < 150; j++) m += light(x, 0.005 + 0.01 * j, Pm, false) * 0.05 * 0.01;
			for (let j = 0; j < 270; j++) m += light(x, 1.525 + 0.05 * j, Pm, false) * 0.05 * 0.05;
		}
		m *= 4;
		check(rel(m, 5.6e10, 3e-3), `the picture holds ${m.toExponential(4)} Msun, not 5.6e10`);
		report.mass = m;
	}
	// the lane: at every distance along the disc where it shows, the light is faintest on the mid-plane
	for (const x of [0, 2, 4, 6, 8.2]) {
		let best = Infinity, at = null;
		for (let z = 0; z <= 0.6; z += 0.0125) { const l = logAt(x, z); if (l < best) { best = l; at = z; } }
		check(at === 0 && logAt(x, 0.5) - logAt(x, 0) > 0.3, `the lane is not on the mid-plane at x = ${x}`);
	}
	// the line of sight, the chapter's (galaxy.py's direction toward the centre, latitude zero, so level at the Sun's
	// 20 pc, 8.2 kpc long): it crosses the chapter's 31 magnitudes of dust
	{
		let t = 0;
		const n = 82000;
		for (let i = 0; i < n; i++) t += dust(-R_SUN + ((i + 0.5) * R_SUN) / n, 0, Z_SUN) * (R_SUN / n);
		check(Math.round(MAG * t) === 31 && rel(MAG * t, nums.centre, 1e-4), `the line of sight crosses ${MAG * t} magnitudes, the chapter ${nums.centre}`);
		report.magnitudes = MAG * t;
	}

	// ---- the ramp: the glow's grey, then matter's gold, then a warm white, in linear light
	check(MATTER === `light-dark(#533f03, ${GOLD})`, 'the gold is not matter\'s colour of the dark theme');
	const G = rgbLin(GLOW), Au = rgbLin(GOLD), Wh = rgbLin(WHITE);
	// below the gold the light first lifts the glow's grey toward a grey as bright as the gold, and takes on the gold's
	// colour as it rises, so that faint light reads as light, not as a dull olive
	const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
	const Gn = G.map((g) => (g * lum(Au)) / lum(G));
	const ramp = (v) => {
		if (v <= GOLD_AT) {
			const s = v / GOLD_AT, hue = s ** 0.9;
			return G.map((g, k) => g + ((1 - hue) * Gn[k] + hue * Au[k] - g) * s);
		}
		const s = (v - GOLD_AT) / (1 - GOLD_AT);
		return Au.map((g, k) => g + (Wh[k] - g) * s);
	};
	const level = (l) => Math.min(1, 10 ** (POW * l));
	// the grain: value noise, seeded, on the glow alone
	const noise = (seed) => {
		const u = uniforms(seed), cells = new Map();
		const at = (i, j) => { const k = i * 100003 + j; if (!cells.has(k)) cells.set(k, u() * 2 - 1); return cells.get(k); };
		return (x, y) => {
			const fx = x / GRAIN_CELL, fy = y / GRAIN_CELL, i = Math.floor(fx), j = Math.floor(fy), a = fx - i, b = fy - j;
			const s = (t) => t * t * (3 - 2 * t);
			return (1 - s(b)) * ((1 - s(a)) * at(i, j) + s(a) * at(i + 1, j)) + s(b) * ((1 - s(a)) * at(i, j + 1) + s(a) * at(i + 1, j + 1));
		};
	};
	// two octaves: a fine grain, and a soft mottle on a lattice turned 30 degrees, so that no row or column shows
	const fine = noise(1202), soft = noise(1204), cs = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
	const grain = (x, y) => 0.6 * fine(x * 0.71 + y * 0.7, y * 0.71 - x * 0.7) + 0.6 * soft((x * cs - y * sn) / 3.1, (x * sn + y * cs) / 3.1);
	const paint = (W, H, at) => {
		const c = document.createElement('canvas');
		c.width = W; c.height = H;
		const ctx = c.getContext('2d'), img = ctx.createImageData(W, H);
		for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
			const col = at(i, j), q = (j * W + i) * 4;
			for (let k = 0; k < 3; k++) img.data[q + k] = Math.round(255 * srgb(Math.max(0, Math.min(1, col[k]))));
			img.data[q + 3] = 255;
		}
		ctx.putImageData(img, 0, 0);
		return c.toDataURL('image/jpeg', 0.92);
	};
	const shade = (l, gx, gy, win = 1) => {
		const v = win * level(l), g = 1 + GRAIN * grain(gx, gy);
		// the grain is the glow's: it fades as the light rises above the glow
		return ramp(v).map((c, k) => c + (g - 1) * G[k] * (1 - v));
	};

	// ---- the field: the glow and the Galaxy, one picture clipped to the rounded field
	{
		const W = FW * PX, H = FH * PX;
		const href = paint(W, H, (i, j) => {
			const X = L0 + (i + 0.5) / PX, x = (X - GX) / K, z = (GY - (T0 + (j + 0.5) / PX)) / K;
			// the window: over the last WIN points of each end the light fades to the glow
			const e = Math.min(1, Math.min(X - L0, L0 + FW - X) / WIN), win = e * e * (3 - 2 * e);
			return shade(logAt(x, z), i, j, win);
		});
		defs += `<clipPath id="${name}-field"><rect x="${n2(L0)}" y="${n2(T0)}" width="${FW}" height="${FH}" rx="${CORNER}"/></clipPath>`;
		S.raw(`<image class="art" href="${href}" x="${n2(L0)}" y="${n2(T0)}" width="${FW}" height="${FH}" preserveAspectRatio="none" clip-path="url(#${name}-field)"/>`, 0);
		S.boxes.push({ box: { l: L0, r: L0 + FW, t: T0, b: T0 + FH }, what: 'the field' });
		// the window touches only the disc's faint ends, and above and below the Galaxy fades into the glow by itself
		for (const z of [0, 0.3, 1]) check(level(logAt((FW / 2 - WIN) / K, z)) < WINDOWED, `the window reaches the disc's light at z = ${z}: ${level(logAt((FW / 2 - WIN) / K, z)).toFixed(3)}`);
		check(level(logAt(0, (FH - DROP - 2) / K)) < EDGE && level(logAt(0, (DROP - 2) / K)) < EDGE, 'the Galaxy reaches the field\'s top or bottom');
	}

	// ---- the black disc
	const hole = [GX + HOLE.at[0], T0 + HOLE.at[1]];
	S.raw(`<circle cx="${n2(hole[0])}" cy="${n2(hole[1])}" r="${HOLE.r}" fill="${HOLE.fill}"/>`, 2);
	S.mark([hole], HOLE.r, 'the black disc');
	check(level(logAt((hole[0] - GX) / K, (GY - hole[1]) / K - HOLE.r / K)) < 0.02, 'the black disc lies on the Galaxy\'s light');

	// ---- the line of sight: from the Sun's place toward the centre, level, starting at the source circle's rim
	const rs = RI / MAG_INSET;
	{
		const a = [sun[0] + rs + 0.25, sun[1]];
		S.path([a, end], { color: PALE, width: SIGHT_W, cap: 'butt', layer: 2, what: 'the line of sight' });
	}

	// ---- the inset: the source circle at the Sun, the tangent hairlines, the magnified picture
	const C = [sun[0] + INSET[0], T0 + INSET[1]];
	check(level(logAt((C[0] - GX) / K, (GY - C[1] - RI) / K)) < 0.12 && C[1] - RI > T0 + 5, 'the inset does not sit in the glow above the disc');
	S.raw(`<circle cx="${n2(sun[0])}" cy="${n2(sun[1])}" r="${n2(rs)}" fill="none" stroke="${PALE}" stroke-width="${LEAD_W}"/>`, 4);
	S.mark([sun], rs + LEAD_W / 2, 'the source circle');
	{
		// the outer tangents of the source circle and the inset's rim
		const d = Math.hypot(C[0] - sun[0], C[1] - sun[1]), e = [(C[0] - sun[0]) / d, (C[1] - sun[1]) / d];
		const c = (rs - RI) / d, h = Math.sqrt(1 - c * c);
		for (const sgn of [1, -1]) {
			const n = [c * e[0] - sgn * h * e[1], c * e[1] + sgn * h * e[0]];
			const a = [sun[0] + rs * n[0], sun[1] + rs * n[1]], b = [C[0] + RI * n[0], C[1] + RI * n[1]];
			// tangent to both: the line's distance from each centre is its radius
			const t = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...t);
			const dist = (p) => Math.abs((p[0] - a[0]) * t[1] - (p[1] - a[1]) * t[0]) / L;
			check(near(dist(sun), rs, 1e-9) && near(dist(C), RI, 1e-9), 'a hairline is not tangent to both circles');
			S.raw(`<path d="M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}" stroke="${PALE}" stroke-width="${LEAD_W}" stroke-opacity="${LEAD_A}" fill="none"/>`, 4);
			S.mark([a, b], LEAD_W / 2, `the hairline ${sgn}`);
		}
	}
	// the magnified picture: the same map, centred on the Sun, 40 times the scale
	const KI = K * MAG_INSET;
	const Q = (x, z) => [C[0] + KI * (x + R_SUN), C[1] - KI * (z - Z_SUN)];
	{
		const reach = RI / KI;
		const xs = Array.from({ length: IGRID.nx }, (_, i) => -R_SUN - reach + (2 * reach * i) / (IGRID.nx - 1));
		// the mid-plane, where the light has its kink, on a node of the grid
		const z0 = -IGRID.dz * Math.ceil((reach - Z_SUN) / IGRID.dz), nzI = Math.ceil((Z_SUN + reach - z0) / IGRID.dz) + 1;
		const T = xs.map((x) => Array.from({ length: nzI }, (_, j) => Math.log10(light(x, z0 + j * IGRID.dz, P0)) - top));
		const at = (x, z) => {
			const u = Math.max(0, Math.min(IGRID.nx - 1.000001, ((x - xs[0]) / (2 * reach)) * (IGRID.nx - 1)));
			const w = Math.max(0, Math.min(nzI - 1.000001, (z - z0) / IGRID.dz));
			const i = Math.floor(u), j = Math.floor(w), a = u - i, b = w - j;
			return (1 - a) * ((1 - b) * T[i][j] + b * T[i][j + 1]) + a * ((1 - b) * T[i + 1][j] + b * T[i + 1][j + 1]);
		};
		check(Math.abs(at(-R_SUN, 0) - (Math.log10(light(-R_SUN, 0, P0)) - top)) < 1e-3, 'the inset\'s table is off at the mid-plane');
		check(Math.abs(at(-R_SUN, 0) - logAt(-R_SUN, 0)) < 0.01, 'the inset\'s map is not the field\'s');
		const W = Math.ceil(2 * RI * PXI);
		const href = paint(W, W, (i, j) => {
			const px = C[0] - RI + (i + 0.5) / PXI, py = C[1] - RI + (j + 0.5) / PXI;
			return shade(at(-R_SUN + (px - C[0]) / KI, Z_SUN - (py - C[1]) / KI), i * 0.9, j * 0.9 + 9000);
		});
		defs += `<clipPath id="${name}-inset"><circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${RI}"/></clipPath>`;
		S.raw(`<image class="art" href="${href}" x="${n2(C[0] - RI)}" y="${n2(C[1] - RI)}" width="${n2(W / PXI)}" height="${n2(W / PXI)}" preserveAspectRatio="none" clip-path="url(#${name}-inset)"/>`, 5);
	}
	// the mid-plane, dashed, across the inset
	{
		const y = Q(0, 0)[1];
		check(near(y - C[1], KI * Z_SUN, 1e-9), 'the mid-plane is not 20 pc below the Sun in the inset');
		const half = Math.sqrt(RI * RI - (y - C[1]) ** 2) - 1.2;
		const L = 2 * half, k = Math.max(1, Math.round((L + PLANE_DASH[1]) / (PLANE_DASH[0] + PLANE_DASH[1])));
		const f = L / (k * PLANE_DASH[0] + (k - 1) * PLANE_DASH[1]);
		S.raw(`<path d="M${n2(C[0] - half)},${n2(y)}H${n2(C[0] + half)}" stroke="${PALE}" stroke-width="${PLANE_W}" stroke-opacity="0.8" stroke-dasharray="${n2(PLANE_DASH[0] * f)} ${n2(PLANE_DASH[1] * f)}" fill="none"/>`, 5.2);
		S.mark([[C[0] - half, y], [C[0] + half, y]], PLANE_W / 2, 'the mid-plane');
	}
	// the Sun: a stone ball, its centre at the Sun's place (the inset's centre)
	const face = await sprite('/figures3d/sprites/hair/ball-face.png');
	defs += `<image id="${name}-ball" class="art" href="${await litBall(face, 360)}" x="-1" y="-1" width="2" height="2" preserveAspectRatio="none"/>`;
	let clips = 0;
	const stone = (c, r, rim, layer, what) => {
		const id = `${name}-s${clips++}`;
		defs += `<clipPath id="${id}"><circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(r)}"/></clipPath>`;
		S.raw(`<g clip-path="url(#${id})"><use href="#${name}-ball" transform="translate(${n2(c[0])},${n2(c[1])}) scale(${n2(r)})"/></g>` +
			`<circle cx="${n2(c[0])}" cy="${n2(c[1])}" r="${n2(r)}" fill="none" stroke="${STONE_INK}" stroke-width="${rim}"/>`, layer);
		S.mark([c], r + rim / 2, what);
	};
	const sunIn = Q(-R_SUN, Z_SUN);
	check(near(sunIn[0], C[0], 1e-9) && near(sunIn[1], C[1], 1e-9), 'the inset is not centred on the Sun');
	check(C[1] + SUN_R < Q(0, 0)[1] - 0.8, 'the Sun\'s ball reaches the mid-plane');
	stone(sunIn, SUN_R, 0.3, 6, 'the Sun');

	// the camera: the paper's, its tripod left off, in greys; its lens on the line of sight, beside the Sun
	{
		const cam = await sprite('/figures3d/sprites/camera.png');
		const rows = Math.round(CROP * cam.h);
		const grey = await greyCamera(cam, rows);
		const s = CAM_H / rows, w = cam.w * s;
		const lens = cam.lensRow() * cam.h;
		check(lens < rows, 'the lens is cut off');
		const span = cam.span(cam.lensRow());
		const back = Math.min(...Array.from({ length: rows }, (_, r) => cam.span(r / (cam.h - 1))?.[0] ?? 1));
		const x0 = sunIn[0] + SUN_R + CAM_GAP - back * w;    // the picture's left edge, so that its back is CAM_GAP from the ball
		// the line of sight in the inset, at 40 times the scale: level at the Sun's height
		const sightAt = () => Q(0, Z_SUN)[1];
		const y0 = sightAt(x0 + span[1] * w) - lens * s;
		S.raw(`<image class="art" href="${grey}" x="${n2(x0)}" y="${n2(y0)}" width="${n2(w)}" height="${n2(CAM_H)}" preserveAspectRatio="none"/>`, 6);
		S.boxes.push({ box: { l: x0, r: x0 + w, t: y0, b: y0 + CAM_H }, what: 'the camera' });
		check(y0 + CAM_H < Q(0, 0)[1] - 0.6, 'the camera reaches the mid-plane');
		// from the lens's tip to the inset's rim
		const a = x0 + span[1] * w + 0.5;
		// to the rim's inner edge, so that the line meets the rim without a gap or an overlap
		const b = C[0] + Math.sqrt((RI - RIM_W / 2) ** 2 - (sightAt() - C[1]) ** 2);
		const pts = [[a, sightAt(a)], [b, sightAt(b)]];
		S.path(pts, { color: PALE, width: SIGHT_W, cap: 'butt', layer: 6.5, what: 'the line of sight in the inset' });
		check(near(pts[0][1], C[1], 1e-9) && near(pts[1][1], C[1], 1e-9), 'the line of sight does not leave the Sun level');
	}
	S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${RI}" fill="none" stroke="${PALE}" stroke-width="${RIM_W}"/>`, 7);
	S.mark(Array.from({ length: 361 }, (_, i) => [C[0] + RI * Math.cos((i * Math.PI) / 180), C[1] + RI * Math.sin((i * Math.PI) / 180)]), RIM_W / 2, 'the inset\'s rim');

	// ---- the pairs: places drawn from the model's density (seeded), kept clear of the other marks
	{
		const u = uniforms(1203);
		const peak = stellar(0, 0, 0);
		const placed = [];
		let tries = 0;
		while (placed.length < PAIRS && tries < 200000) {
			tries++;
			const x = (u() * 2 - 1) * 16, y = (u() * 2 - 1) * 16, z = (u() * 2 - 1) * 1.2;
			if (u() * peak > stellar(x, y, z)) continue;
			const p = P(x, z);
			const v = level(logAt(x, z));
			if (v < 0.16 || v > 0.5) continue;                       // on the disc's light, off its white core
			if (placed.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < PAIR_GAP)) continue;
			if (Math.hypot(p[0] - sun[0], p[1] - sun[1]) < 14) continue;
			const box = { l: p[0] - PAIR_R - 1.5, r: p[0] + PAIR_R + 1.5, t: p[1] - PAIR_R - 1.5, b: p[1] + PAIR_R + 1.5 };
			if (S.clearance(box, (w) => w === 'the field').d < 1.2) continue;
			placed.push(p);
			// the orbit: a circle seen tilted, its two stars at opposite ends
			const tilt = 0.32 + 0.3 * u(), turn = (u() - 0.5) * 0.5, phase = u() * Math.PI;
			const ring = Array.from({ length: 241 }, (_, i) => {
				const t = (i * 2 * Math.PI) / 240, a = PAIR_R * Math.cos(t), b = PAIR_R * tilt * Math.sin(t);
				return [p[0] + a * Math.cos(turn) - b * Math.sin(turn), p[1] + a * Math.sin(turn) + b * Math.cos(turn)];
			});
			S.raw(`<path d="M${ring.map(([X, Y]) => `${n2(X)},${n2(Y)}`).join('L')}Z" fill="none" stroke="${PALE}" stroke-width="${RING_W}" stroke-opacity="${RING_A}"/>`, 3);
			S.mark(ring, RING_W / 2, `pair ${placed.length}'s ring`);
			for (const s of [0, Math.PI]) {
				const a = PAIR_R * Math.cos(phase + s), b = PAIR_R * tilt * Math.sin(phase + s);
				stone([p[0] + a * Math.cos(turn) - b * Math.sin(turn), p[1] + a * Math.sin(turn) + b * Math.cos(turn)], BEAD, 0.14, 3.2, `pair ${placed.length}'s star`);
			}
		}
		check(placed.length === PAIRS, `only ${placed.length} pairs found room`);
	}

	// ---- colours: only neutrals, the stone's ink and matter's gold; never the accents
	const svgSoFar = S.P.items.map((it) => it.svg ?? '').join('') + defs;
	const used = new Set([...svgSoFar.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/g)].map((m) => m[1]));
	for (const c of used) check([PALE, HOLE.fill, STONE_INK].includes(c), `a colour outside the figure's: ${c}`);
	check(!/#b0560a|#2a67ad/.test(svgSoFar), 'orange or blue in the figure');

	window[name + '-numbers'] = { ...report, K, mag: MAG_INSET, sunHeight: K * Z_SUN, insetHeight: KI * Z_SUN };
	return finish(S, [], [300, 340], defs);
}

/** A stone ball lit by the studio (as tut-one-point-hero's litBall): the picture `face` as the albedo, seen face on. */
async function litBall(face, N) {
	const img = new Image(); img.src = face.href; await img.decode();
	const src = document.createElement('canvas');
	src.width = face.w; src.height = face.h;
	const sctx = src.getContext('2d'); sctx.drawImage(img, 0, 0);
	const tex = sctx.getImageData(0, 0, face.w, face.h).data;
	const c = document.createElement('canvas'); c.width = N; c.height = N;
	const ctx = c.getContext('2d'), out = ctx.createImageData(N, N);
	const r0 = (face.w - 2 * MARGIN) / 2, cx = face.w / 2, cy = face.h / 2;
	for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
		let x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2;
		const rr = x * x + y * y;
		if (rr > 1) { const l = Math.sqrt(rr); x /= l; y /= l; }
		const n = [x, y, Math.sqrt(Math.max(0, 1 - x * x - y * y))];
		const tx = Math.round(cx + 0.97 * r0 * x), ty = Math.round(cy - 0.97 * r0 * y), t = (ty * face.w + tx) * 4;
		const lit = 0.3 + 0.8 * Math.max(0, (dot(n, KEY) + 0.3) / 1.3) + 0.14 * Math.max(0, dot(n, FILL));
		const spec = 0.18 * Math.max(0, dot(n, HALF)) ** 30;
		const q = (j * N + i) * 4;
		for (let k = 0; k < 3; k++) out.data[q + k] = Math.round(255 * Math.min(1, (tex[t + k] / 255) * lit + spec));
		out.data[q + 3] = 255;
	}
	ctx.putImageData(out, 0, 0);
	return c.toDataURL('image/jpeg', 0.9);
}

/** The paper's camera down to the row `rows` (its tripod left off), its colour taken to grey, its alpha kept. */
async function greyCamera(cam, rows) {
	const img = new Image(); img.src = cam.href; await img.decode();
	const c = document.createElement('canvas'); c.width = cam.w; c.height = rows;
	const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
	const d = ctx.getImageData(0, 0, cam.w, rows);
	for (let k = 0; k < d.data.length; k += 4) {
		const y = 0.2126 * lin(d.data[k] / 255) + 0.7152 * lin(d.data[k + 1] / 255) + 0.0722 * lin(d.data[k + 2] / 255);
		// lifted a little, so that the dark wood reads against the dark lane
		const g = Math.round(255 * srgb(Math.min(1, 0.06 + 1.25 * y)));
		d.data[k] = d.data[k + 1] = d.data[k + 2] = g;
	}
	ctx.putImageData(d, 0, 0);
	return c.toDataURL('image/png');
}
