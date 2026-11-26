// Shared tools for the five diagrams of the tutorial's section 3.4 (tutorial/noise/symmetric-matrices.md):
// tut-svd-hero, tut-sym-ellipse, tut-sym-rayleigh, tut-svd-spaces and tut-svd-tsvd. Not a figure itself. The charts
// take section 3.1's sheet, axes and colours (figs/tut-prob-lib.js) and section 2.6's curve sampler
// (figs/tut-fourier-lib.js), both imported, not copied. The colours keep one meaning in all five: what the camera
// sees, a gain above the noise and the patterns it keeps, in the first accent (orange); the noise, in the second
// (blue); a stretch in orange and a squeeze in blue where a matrix acts on directions, as the paper colours a tide.
// What this file adds:
//  - the ripple's gain q e^{1 - q} and the cut-off q_c of the flat camera, where pi SNR q e^{-q} = 1;
//  - the locked safe's whitened design matrix, from the repository's own model: a port of design, grid and footprint
//    of reference/gravcam/inversion.py and of point_mass_tidal_tensor of reference/gravcam/tidal.py, on the pixels and
//    the noise of figs/tut-measure-lib.js (its port of array_pixels and noise_for_snr);
//  - its singular values and right singular vectors, by one-sided Jacobi rotations (Hestenes), and the noise in the
//    right-hand safe's mass when the first k patterns are kept, sqrt(sum_{i <= k} (v_i . w)^2 / s_i^2) in units of
//    324 kg, w the safe's twelve cells; checked against the reference's numpy run (the numbers below).
import { arrayPixels, noiseForSnr, G, GOLD_MASS, RIGHT, DEPTH, SPACING } from './tut-measure-lib.js';

// ---- the flat camera's ripples ---------------------------------------------------------------------------------
export const SNR = 1e3;
/** The gain of the ripple q = kz against the best ripple, q = 1. */
export const gain = (q) => q * Math.exp(1 - q);
/** The cut-off q_c > 1 where the whitened gain pi SNR q e^{-q} is one, by bisection. */
export function cutoff(snr = SNR) {
	let lo = 1, hi = 60;
	for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Math.PI * snr * m * Math.exp(-m) > 1) lo = m; else hi = m; }
	return (lo + hi) / 2;
}

// ---- the locked safe -------------------------------------------------------------------------------------------
// the reference's numbers: reference/gravcam/inversion.py at SNR = 10^3, A = design(array_pixels(), grid()) / sigma
// times GOLD_MASS, numpy.linalg.svd; noise(k) as above, in kg
export const REF = {
	top: [2080.5658835417994, 1481.090152095465, 957.5857805198377, 443.96484559153777, 326.6457761208608],
	s17: 1.1442990334388417, s18: 0.6852201254238665, s25: 0.08268887766496572, s40: 0.0008841933795457959,
	s111: 3.319354539416092e-10, s112: 2.67702511e-10,
	noise: { 1: 0.11322090221687499, 5: 1.0922672855226503, 17: 243.06713681919766, 25: 2935.857889622338, 40: 140943.35346504173, 111: 112057672696.465 },
	above1: 17, above10: 12, rank: 111, smallest: 4.203831273376656e-14, uniform: 1953.4682456362352
};

/** The cells of the grid in the plane of the safes, 25 cm apart, x outer and y inner, as grid() with indexing "ij". */
export function grid(step = 0.25) {
	const out = [];
	for (let i = 0; i * step <= 5 + 1e-9; i++) for (let j = 0; j * step <= 2.5 + 1e-9; j++) out.push([-2.5 + i * step, j * step, -DEPTH]);
	return out;
}

/** The right-hand safe's footprint: the cells within 0.45 m of its centre across and below 0.6 m over it. */
export const footprint = (cells, c = RIGHT) => cells.map((p) => (Math.abs(p[0] - c[0]) <= 0.45 && p[1] <= c[1] + 0.6 ? 1 : 0));

/** The five readings (xx, yy, xy, xz, yz) of a pixel at `at` from a kilogram at `c`: (G / r^3)(delta - 3 n n). */
function pointReadings(at, c) {
	const x = [at[0] - c[0], at[1] - c[1], at[2] - c[2]];
	const r = Math.hypot(...x), n = x.map((v) => v / r), k = G / r ** 3;
	return [k * (1 - 3 * n[0] * n[0]), k * (1 - 3 * n[1] * n[1]), -3 * k * n[0] * n[1], -3 * k * n[0] * n[2], -3 * k * n[1] * n[2]];
}

/** The whitened design matrix as its columns: column k is what 324 kg in cell k gives the readings, in noise
 * standard deviations at SNR = 10^3. */
export function design() {
	const px = arrayPixels(), cells = grid(), sigma = noiseForSnr(SNR);
	const cols = cells.map((c) => {
		const col = new Float64Array(5 * px.length);
		px.forEach((p, a) => pointReadings(p, c).forEach((v, m) => { col[5 * a + m] = (v / sigma) * GOLD_MASS; }));
		return col;
	});
	return { cols, cells, sigma, N: 5 * px.length, K: cells.length };
}

const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

/** The singular values (largest first) and right singular vectors of the matrix whose columns are `cols`, by
 * one-sided Jacobi rotations: pairs of columns are turned until every pair is perpendicular to working precision; the
 * column lengths are then the singular values and the accumulated turns the right singular vectors. */
export function jacobi(cols, { sweeps = 60, eps = 1e-15 } = {}) {
	const n = cols.length;
	const a = cols.map((c) => Float64Array.from(c));
	const v = Array.from({ length: n }, (_, i) => { const e = new Float64Array(n); e[i] = 1; return e; });
	const norm2 = a.map((c) => dot(c, c));
	let sweep = 0;
	for (; sweep < sweeps; sweep++) {
		let turned = 0;
		for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
			const g = dot(a[p], a[q]);
			if (Math.abs(g) <= eps * Math.sqrt(norm2[p] * norm2[q]) || g === 0) continue;
			turned++;
			const zeta = (norm2[q] - norm2[p]) / (2 * g);
			const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
			const c = 1 / Math.sqrt(1 + t * t), s = c * t;
			const ap = a[p], aq = a[q];
			for (let i = 0; i < ap.length; i++) { const x = ap[i], y = aq[i]; ap[i] = c * x - s * y; aq[i] = s * x + c * y; }
			const vp = v[p], vq = v[q];
			for (let i = 0; i < n; i++) { const x = vp[i], y = vq[i]; vp[i] = c * x - s * y; vq[i] = s * x + c * y; }
			norm2[p] = dot(ap, ap); norm2[q] = dot(aq, aq);
		}
		if (!turned) break;
	}
	const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => norm2[j] - norm2[i]);
	return { s: order.map((i) => Math.sqrt(norm2[i])), V: order.map((i) => v[i]), U: order.map((i) => a[i]), sweeps: sweep };
}

/** The safe's whitened gains, the noise in the right-hand safe's mass (kg) when the first k are kept (noise[k - 1]),
 * the rank tolerance of numpy (s_1 max(N, K) eps), and the whitened gain of the uniform layer. Computed once. */
export function safeGains() {
	if (typeof window !== 'undefined' && window.__tutSvdSafe) return window.__tutSvdSafe;
	const { cols, cells, N, K } = design();
	const { s, V, sweeps } = jacobi(cols);
	const w = footprint(cells);
	const noise = [];
	let sum = 0;
	for (let i = 0; i < s.length; i++) { const c = dot(V[i], w); sum += (c / s[i]) ** 2; noise.push(GOLD_MASS * Math.sqrt(sum)); }
	const tol = s[0] * Math.max(N, K) * Number.EPSILON;
	// the uniform layer: every cell 324 kg, the length of its readings over the length of the pattern
	const u = new Float64Array(N);
	for (const c of cols) for (let i = 0; i < N; i++) u[i] += c[i];
	const uniform = Math.sqrt(dot(u, u)) / Math.sqrt(K);
	const out = { s, noise, tol, uniform, N, K, cells: w.reduce((x, y) => x + y, 0), sweeps };
	if (typeof window !== 'undefined') window.__tutSvdSafe = out;
	return out;
}

export { SPACING };
