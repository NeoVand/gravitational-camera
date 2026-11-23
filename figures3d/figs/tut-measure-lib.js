// Shared tools for the four diagrams of the tutorial's chapter 3.3 (tutorial/noise/measuring-a-number.md):
// tut-measure-safe, tut-measure-peak, tut-measure-ellipse and tut-measure-pair. Not a figure itself. The charts take
// chapter 3.1's sheet, axes and colours (figs/tut-prob-lib.js) and the array's plates from chapter 3.2
// (figs/tut-noise-lib.js), both imported, not copied. What this file adds:
//  - the locked safe's predicted readings, from the repository's own model: a port of reference/gravcam/inversion.py
//    (array_pixels, read_box, noise_for_snr) and of the prism formulas of reference/gravcam/tidal.py
//    (uniform_box_tidal_tensor), as app/src/lib/pixel/tide.ts ports them; the figure asserts the separation it
//    gives against the reference's D = 1.8111554511736525;
//  - a curve sampler that keeps every step on the page under a quarter of a point, so that no curve shows a polygon;
//  - the point mass's datum d(a) = G m (2 z^2 - a^2) / (z^2 + a^2)^(5/2) of the chapter's model camera.
import { Plot } from './tut-prob-lib.js';

// ---- the locked safe -------------------------------------------------------------------------------------------
// The reference's frame: y up, the camera at (0, 1.5, 0) looking along -z, the safes at z = -3.5. The chapter's frame
// has x to the right, y up and z forward (toward the scene), so its z is the reference's -z, and a component with one
// index z changes sign: E_xz(chapter) = -E_xz(reference).
export const G = 6.6743e-11;
export const CAMERA = [0, 1.5, 0];
export const GOLD_SIZE = [0.3, 0.14, 0.4];
export const GOLD_DENSITY = 19300;
export const GOLD_MASS = GOLD_DENSITY * GOLD_SIZE[0] * GOLD_SIZE[1] * GOLD_SIZE[2];
export const LEFT = [-1.1, 0.13, -3.5];
export const RIGHT = [1.1, 0.13, -3.5];
export const DEPTH = 3.5;
export const PIX = 11, SIDE = 1, SPACING = SIDE / (PIX - 1);
export const COMPONENTS = ['xx', 'yy', 'xy', 'xz', 'yz'];
// the reference's numbers (reference/gravcam/inversion.py, run on the same inputs), asserted by the figures
export const REF_D = 1.8111554511736525;           // distance(read_box(LEFT), read_box(RIGHT), noise_for_snr(10, 0.1))
export const REF_MAX_DIFF = 0.1863502546941707;    // the largest |f_A - f_B| of one reading, in sigma_n at SNR = 10
export const REF_XZ_00 = -0.0593285257526091;      // E_xz of the left safe at the pixel (0, 0), reference frame, sigma_n

/** Pixel places, i across (x) and j up (y), as array_pixels with indexing "ij": pixel (i, j) is index i * PIX + j. */
export function arrayPixels() {
	const out = [];
	for (let i = 0; i < PIX; i++) for (let j = 0; j < PIX; j++)
		out.push([CAMERA[0] + (i - (PIX - 1) / 2) * SPACING, CAMERA[1] + (j - (PIX - 1) / 2) * SPACING, CAMERA[2]]);
	return out;
}

function atanRatio(a, b) {
	if (b === 0) return a === 0 ? 0 : (Math.sign(a) * Math.PI) / 2;
	return Math.atan(a / b);
}
function logRatioAlong(u2, zLow, zHigh) {
	const rLow = Math.sqrt(u2 + zLow * zLow), rHigh = Math.sqrt(u2 + zHigh * zHigh);
	if (zLow >= 0) return Math.log((zHigh + rHigh) / (zLow + rLow));
	if (zHigh < 0) return Math.log((rLow - zLow) / (rHigh - zHigh));
	return Math.log(((zHigh + rHigh) * (rLow - zLow)) / u2);
}

/** The tidal tensor of a uniform box (centre, full size) at a point: the prism formulas, as tidal.py. */
export function boxTide(density, center, size, at) {
	const lo = [0, 1, 2].map((k) => center[k] - size[k] / 2 - at[k]);
	const hi = [0, 1, 2].map((k) => center[k] + size[k] / 2 - at[k]);
	const X = [lo[0], hi[0]], Y = [lo[1], hi[1]], Z = [lo[2], hi[2]];
	let xx = 0, yy = 0, zz = 0;
	for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
		const sign = (i + j + k) % 2 === 1 ? 1 : -1;
		const r = Math.hypot(X[i], Y[j], Z[k]);
		xx += sign * atanRatio(Y[j] * Z[k], X[i] * r);
		yy += sign * atanRatio(Z[k] * X[i], Y[j] * r);
		zz += sign * atanRatio(X[i] * Y[j], Z[k] * r);
	}
	let xy = 0, yz = 0, zx = 0;
	for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
		const sign = i === j ? 1 : -1;
		xy -= sign * logRatioAlong(X[i] * X[i] + Y[j] * Y[j], Z[0], Z[1]);
		yz -= sign * logRatioAlong(Y[i] * Y[i] + Z[j] * Z[j], X[0], X[1]);
		zx -= sign * logRatioAlong(Z[i] * Z[i] + X[j] * X[j], Y[0], Y[1]);
	}
	const k = G * density;
	return [[k * xx, k * xy, k * zx], [k * xy, k * yy, k * yz], [k * zx, k * yz, k * zz]];
}

/** The five readings (xx, yy, xy, xz, yz) of every pixel, in the reference's frame, s^-2: read_box. */
export function readBox(pixels, position) {
	const out = new Float64Array(5 * pixels.length);
	pixels.forEach((p, a) => {
		const E = boxTide(GOLD_DENSITY, position, GOLD_SIZE, p);
		[E[0][0], E[1][1], E[0][1], E[0][2], E[1][2]].forEach((v, c) => { out[5 * a + c] = v; });
	});
	return out;
}

/** The noise of one reading at the signal-to-noise ratio snr, s^-2: sigma_n = 2 G m / (z^2 b SNR). */
export const noiseForSnr = (snr) => (2 * G * GOLD_MASS) / (DEPTH ** 2 * snr * SPACING);

/** The safe's two predictions, A (left) and B (right), in units of sigma_n at SNR = 10, with D and the largest
 * difference; `component(f, name)` returns that component as an 11 x 11 array [i][j] in the chapter's frame. */
export function safe() {
	const px = arrayPixels();
	const s = noiseForSnr(10);
	const A = readBox(px, LEFT).map((v) => v / s), B = readBox(px, RIGHT).map((v) => v / s);
	let d2 = 0, most = 0;
	for (let k = 0; k < A.length; k++) { d2 += (A[k] - B[k]) ** 2; most = Math.max(most, Math.abs(A[k] - B[k])); }
	const component = (f, name) => {
		const c = COMPONENTS.indexOf(name);
		const flip = (name.match(/z/g) ?? []).length % 2 ? -1 : 1;     // the chapter's z is the reference's -z
		return Array.from({ length: PIX }, (_, i) => Array.from({ length: PIX }, (_, j) => flip * f[5 * (i * PIX + j) + c]));
	};
	return { A, B, D: Math.sqrt(d2), most, N: A.length, component };
}

// ---- curves ----------------------------------------------------------------------------------------------------

/** Page points along the graph of f on [a, b] in the plot P, no two more than `step` points apart on the page. */
export function graph(P, f, a, b, step = 0.25) {
	const pts = [P.at(a, f(a))];
	let x = a;
	const dx0 = (step / P.w) * (P.x1 - P.x0);
	while (x < b) {
		let dx = dx0;
		for (let i = 0; i < 12; i++) {
			const [x0, y0] = P.at(x, f(x)), [x1, y1] = P.at(Math.min(b, x + dx), f(Math.min(b, x + dx)));
			if (Math.hypot(x1 - x0, y1 - y0) <= step) break;
			dx /= 2;
		}
		x = Math.min(b, x + dx);
		pts.push(P.at(x, f(x)));
	}
	return pts;
}

/** The longest step between neighbouring points of a polyline (page points). */
export const longest = (pts) => pts.slice(1).reduce((m, p, i) => Math.max(m, Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), 0);

/** The datum d = -E_zz of a point mass at depth 1, a distance a across the plane, in units of G m / z^3. */
export const datum = (a) => (2 - a * a) / (1 + a * a) ** 2.5;

export { Plot };
