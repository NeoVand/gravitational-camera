// Shared numbers and marks for the four diagrams of the tutorial's chapter 5.5 (tutorial/waves/radiance.md):
// tut-rad-patches, tut-rad-slab, tut-rad-columns and tut-rad-lenses. Not a figure itself. The sheet, the strokes, the
// labels and the cropping are chapter 1.2's (figs/tut-pot-lib.js), the axes and the dimension lines chapter 3.1's
// (figs/tut-prob-lib.js), the sampling of curves chapter 2.6's (figs/tut-fourier-lib.js), the dashes chapter 3.6's
// (figs/tut-bessel-lib.js, DASH), the tints chapter 1.3's (figs/tut-gauss-lib.js) and matter's colour chapter 2.4's
// (figs/tut-null-lib.js, MATTER), all imported, not copied. A pixel is chapter 5.3's small ink square. The colours
// follow the paper's Figure fig:line-integral (figs/line-integral.js): what light shows, here the background that a
// slab lets through, in the second accent (blue); the glow, and the hot block that glows most, in the first (orange).
// Everything else is neutral, as the comments ask.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the slab's shares
// at its front face, 0.3 e^{-5} = 0.002 and the sum 0.995 for tau = 5, 0.3 e^{-0.1} = 0.271 and 1 - e^{-0.1} = 0.095
// for tau = 0.1, whose sum is 0.3666, 0.367 to three places (the comment's 0.366 adds the rounded shares), both
// against a numerical solution of the equation of transfer; the thick glow's shares (1 - e^{-3}) e^{-3k}, 0.950,
// 0.047, 0.0024, 0.0001 and 0.000006; the gravitational glow's illustrative j l, which add to 3.8; the thin lens's
// exit points 84, 78 and 65.6, its focus F at 284 (f = R^2/2(n - 1)h = 200 for n = 5/3, the paraxial focus of the
// drawn face by Snell's law), and the gap between the drawn crests and the lens's lag, below a fifth of a point; the
// mass's crossings 40 + b^2/15 = 100, 175 and 280; and the chapter's numbers that the captions print, the magnifying
// glass's 10 cm and the Earth's bending of a grazing ray, 2.8 x 10^-9 radians.
import { DASH } from './tut-bessel-lib.js';
import { TINT, TINT_ACCENT, TINT_ACCENT2 } from './tut-gauss-lib.js';
import { MATTER } from './tut-null-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { HAIR, TICK } from './tut-pot-lib.js';
import { INK } from '../lib.js';

export { DASH, TINT, TINT_ACCENT, TINT_ACCENT2, MATTER };

export const SQ = 2.8;                     // a pixel's side, as chapter 5.3's

/** A pixel: a small filled square (ink) centred at q. */
export function pixel(S, q, what = 'the pixel') {
	const box = { l: q[0] - SQ / 2, r: q[0] + SQ / 2, t: q[1] - SQ / 2, b: q[1] + SQ / 2 };
	S.fill(pathOf([[box.l, box.t], [box.r, box.t], [box.r, box.b], [box.l, box.b]]), box, { color: INK, layer: 4, what });
	return box;
}

/** A dimension line from a to b (page points) with a short stroke across each end, in the colour `color`. */
export function measure(S, a, b, { color, width = HAIR + 0.1, layer = 1, what = 'a dimension line' }) {
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
	const w = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
	S.path([a, b], { color, width, layer, cap: 'butt', what });
	for (const e of [a, b]) S.path([[e[0] - w[0] * TICK, e[1] - w[1] * TICK], [e[0] + w[0] * TICK, e[1] + w[1] * TICK]], { color, width, layer, cap: 'butt', what: `${what}'s end` });
}

// ---- the slab (tut-rad-slab): radiance in units of j/alpha, depth u = s/L ---------------------------------------
export const I_BG = 0.3;
export const TAUS = { thick: 5, thin: 0.1 };
/** The background's share of the radiance at the depth u, I_bg e^{-tau u}. */
export const background = (tau, u) => I_BG * Math.exp(-tau * Math.min(Math.max(u, 0), 1));
/** The slab's own glow at the depth u, (j/alpha)(1 - e^{-tau u}). */
export const glow = (tau, u) => 1 - Math.exp(-tau * Math.min(Math.max(u, 0), 1));
/** The radiance, their sum, which solves dI/ds = j - alpha I with I = I_bg at u = 0. */
export const radiance = (tau, u) => background(tau, u) + glow(tau, u);

// ---- the columns (tut-rad-columns) -------------------------------------------------------------------------------
export const TAU_BODY = 3;                 // each body's optical depth in the thick glow
/** The k-th body's share of the pixel's reading when every body has the same j/alpha and the optical depth 3. */
export const share = (k) => (1 - Math.exp(-TAU_BODY)) * Math.exp(-TAU_BODY * k);
/** The gravitational glow's illustrative j l, in the order the line meets them. */
export const GLOWS = { door: 0.1, near: 0.15, block: 3.0, far: 0.15, person: 0.4 };

// ---- the lenses (tut-rad-lenses): the comment's site pixels, x right and y up from the axis -----------------------
export const LENS = { flat: 60, R: 80, h: 24, F: 284 };
/** The thickness of the lens at the height a, h (1 - a^2/R^2), and its curved face. */
export const thick = (a) => LENS.h * (1 - (a * a) / (LENS.R * LENS.R));
export const face = (a) => LENS.flat + thick(a);
export const RAYS = [0, 40, 70];
/** f = R^2 / 2 (n - 1) h, from the vertex to F, and the index the drawing implies. */
export const FOCAL = LENS.F - face(0);
export const INDEX = 1 + (LENS.R * LENS.R) / (2 * LENS.h * FOCAL);
export const MASS = { x: 40, two_rs: 15 };   // f = b^2 / 2 r_s, so 2 r_s = 15 site pixels
export const IMPACTS = [30, 45, 60];
export const crossing = (b) => MASS.x + (b * b) / MASS.two_rs;

/** Where a ray that runs along +x inside glass of index n at the height a leaves the face x = face(y) and crosses the
 * axis, by Snell's law in vector form. */
export function snell(n, a) {
	const slope = (-2 * LENS.h * a) / (LENS.R * LENS.R);           // dx/dy of the face
	let nx = 1, ny = -slope;
	const L = Math.hypot(nx, ny);
	nx /= L; ny /= L;
	const cosi = nx, k = 1 - n * n * (1 - cosi * cosi);
	const dx = n + (Math.sqrt(k) - n * cosi) * nx, dy = (Math.sqrt(k) - n * cosi) * ny;
	return face(a) - (a / dy) * dx;
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the slab: the closed form against a numerical solution of dI/ds = j - alpha I (RK4, in u = s/L)
	for (const tau of [TAUS.thick, TAUS.thin]) {
		let I = I_BG;
		const n = 4000, du = 1 / n, f = (v) => tau * (1 - v);   // dI/du = tau (j/alpha - I), with j/alpha = 1
		for (let i = 0; i < n; i++) {
			const k1 = f(I), k2 = f(I + (du / 2) * k1), k3 = f(I + (du / 2) * k2), k4 = f(I + du * k3);
			I += (du / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
			if (i % 400 === 399) check(near(I, radiance(tau, (i + 1) * du), 1e-12), `the slab's radiance at u = ${(i + 1) * du}, tau = ${tau}`);
		}
	}
	const thickB = background(5, 1), thickSum = radiance(5, 1), thinB = background(0.1, 1), thinG = glow(0.1, 1), thinSum = radiance(0.1, 1);
	check(thickB.toFixed(3) === '0.002' && thickSum.toFixed(3) === '0.995', `the thick slab's shares ${thickB}, ${thickSum}`);
	check(thinB.toFixed(3) === '0.271' && thinG.toFixed(3) === '0.095' && thinSum.toFixed(4) === '0.3666', `the thin slab's shares ${thinB}, ${thinG}, ${thinSum}`);
	// the thin limit I_bg (1 - tau) + jL, 0.27 + 0.1, is within tau^2 of the exact value
	check(Math.abs(I_BG * (1 - 0.1) + 0.1 - thinSum) < 0.01, 'the thin limit');
	// the text's slab of optical depth one: 37% and 63%
	check((100 * Math.exp(-1)).toFixed(0) === '37' && (100 * (1 - Math.exp(-1))).toFixed(0) === '63', 'the slab of optical depth one');

	// ---- the columns: the thick glow's shares, and the gravitational glow's sum
	const shares = [0, 1, 2, 3, 4].map(share);
	check(shares[0].toFixed(3) === '0.950' && shares[1].toFixed(3) === '0.047' && shares[2].toFixed(4) === '0.0024' && shares[3].toFixed(4) === '0.0001' && shares[4].toFixed(6) === '0.000006', `the thick glow's shares ${shares}`);
	// the shares are what the equation of transfer gives for five bodies of tau = 3 crossed in turn, j/alpha = 1, seen
	// from the pixel: each layer's glow, dimmed by those in front of it; together 1 - e^{-15}
	check(near(shares.reduce((s, x) => s + x, 0), 1 - Math.exp(-5 * TAU_BODY), 1e-15), 'the shares do not add to 1 - e^{-15}');
	const total = Object.values(GLOWS).reduce((s, x) => s + x, 0);
	check(near(total, 3.8, 1e-12), `the sum of the glows ${total}`);

	// ---- the thin lens: exit points, the focal length, the index, and F the drawn face's focus
	const exits = RAYS.map(face);
	check(exits[0] === 84 && exits[1] === 78 && exits[2].toFixed(1) === '65.6' && near(exits[2], 65.625, 1e-12), `the exit points ${exits}`);
	check(near(FOCAL, 200, 1e-12) && near(INDEX, 5 / 3, 1e-12), `f = ${FOCAL}, n = ${INDEX}`);
	check(near((LENS.R ** 2) / (2 * (INDEX - 1) * LENS.h), FOCAL, 1e-12), 'f = R^2 / 2 (n - 1) h');
	// a ray close to the axis, traced by Snell's law through the drawn face, crosses the axis at F
	check(near(snell(INDEX, 0.01), LENS.F, 1e-3), `the paraxial focus ${snell(INDEX, 0.01)}`);
	// the outer rays, traced the same way through this thick parabola, cross short of F, at 268 and 230: the drawing is
	// the thin lens of the text, not a ray trace of the exaggerated one
	check(snell(INDEX, 40).toFixed(0) === '268' && snell(INDEX, 70).toFixed(0) === '230', `the traced outer rays ${snell(INDEX, 40)}, ${snell(INDEX, 70)}`);
	// the lag of the axis's wave behind the wave at a, (n - 1) h a^2 / R^2, is a^2/2f exactly; the path from the lens
	// to F at the height a is longer by sqrt(f^2 + a^2) - f, which the text's a^2/2f matches to within a^4/8f^3:
	// at the drawn rays, 0.04 and 0.35 site pixels
	const gaps = [];
	for (const a of RAYS) {
		check(near((INDEX - 1) * LENS.h * a * a / LENS.R ** 2, (a * a) / (2 * FOCAL), 1e-12), `the lag at a = ${a}`);
		gaps.push(Math.hypot(FOCAL, a) - FOCAL - (a * a) / (2 * FOCAL));
	}
	check(gaps[1].toFixed(2) === '-0.04' && gaps[2].toFixed(2) === '-0.35', `the gaps ${gaps}`);
	// the label f + a^2/2f: the path from the lens's vertex plane at a = 40 to F, 203.96, against 204
	check(near(Math.hypot(FOCAL, 40), FOCAL + 1600 / (2 * FOCAL), 0.05), 'f + a^2/2f at a = 40');
	// ---- the mass: the crossings, 40 + b^2/15
	const at = IMPACTS.map(crossing);
	check(at.join() === '100,175,280', `the crossings ${at}`);
	// ---- the chapter's numbers in the captions: a magnifying glass, the Earth's bending of a grazing ray
	check(near(0.02 ** 2 / (2 * 0.5 * 0.004), 0.1, 1e-12), 'the magnifying glass');
	check((2 * 8.9e-3 / 6.37e6).toExponential(1) === '2.8e-9', 'the Earth\'s bending');
	return { thickB, thickSum, thinB, thinG, thinSum, shares, total, exits, focal: FOCAL, index: INDEX, gaps, crossings: at };
}
