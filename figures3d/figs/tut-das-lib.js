// Shared numbers and marks for the four diagrams of the tutorial's chapter 5.3 (tutorial/waves/diffraction.md):
// tut-das-delays, tut-das-lobes, tut-das-fresnel and tut-das-pair. Not a figure itself. The sheet, the strokes, the
// labels and the cropping are chapter 1.2's (figs/tut-pot-lib.js), the axes chapter 3.1's (figs/tut-prob-lib.js), the
// sampling of curves chapter 2.6's (figs/tut-fourier-lib.js), the dashes chapter 3.6's (figs/tut-bessel-lib.js, DASH)
// and the slit's sin x / x chapter 3.6's (figs/tut-bessel-lib.js, sinc), all imported, not copied. The colours keep
// chapter 5.2's meanings (figs/tut-ret-lib.js): the wave and a difference of path, there n.y, here n.x_p and the gap
// between a curved front and a flat one, in the first accent (orange); pixels, records and images in neutral ink; a
// second curve or a reference in the dim grey; crests of a plane wave in the faint rule.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the delays
// n.x_p = p b sin 30 degrees for b = lambda/3, a sixth of a wavelength per pixel; the beam pattern of a row of eight
// pixels, sin^2(N psi/2) / N^2 sin^2(psi/2), against the direct sum, its first zeros at sin theta = +-lambda/Nb, +-0.25
// for b = lambda/2 and +-0.0625 for b = 2 lambda, its largest side lobe 0.0525 at sin theta = +-0.36 (the text's 5.3%),
// and for b = 2 lambda the grating lobes of full height at +-0.5 and +-1; the Fresnel gaps, sqrt(4.5^2 + 0.75^2) - 4.5
// = 0.06207 m = 0.62 lambda (0.0621 to four places, not the comment's 0.0620) and 1.25 mm = 0.0125 lambda at 225 m,
// the text's D^2/8r = 0.0625 m = 0.63 lambda and the far field's D^2/lambda = 22.5 m; and the pair at +-0.6 lambda/D,
// whose incoherent image dips to 0.50 of its peaks midway and whose coherent image has its one peak there.
import { sinc } from './tut-bessel-lib.js';

// ---- the delays ------------------------------------------------------------------------------------------------
export const PIXELS = 6;                 // tut-das-delays: six pixels
export const SPACING = 1 / 3;            // b / lambda
export const THETA = Math.PI / 6;        // 30 degrees from the normal
/** n.x_p / lambda for the pixel p at p b x-hat and a source at THETA from the normal, toward +x. */
export const delay = (p) => p * SPACING * Math.sin(THETA);

// ---- the beam pattern of a row ---------------------------------------------------------------------------------
export const ROW = 8;                    // tut-das-lobes: eight pixels
/** |A|^2 / N^2 for N pixels b/lambda = q apart, steered straight ahead, at sin theta = s: the closed form. */
export function pattern(s, q, N = ROW) {
	const psi = 2 * Math.PI * q * s;
	const d = Math.sin(psi / 2);
	if (Math.abs(d) < 1e-9) return 1;
	return (Math.sin((N * psi) / 2) / (N * d)) ** 2;
}
/** The same, as the sum of N unit phasors e^{-i p psi}, squared and divided by N^2: the definition. */
export function direct(s, q, N = ROW) {
	const psi = 2 * Math.PI * q * s;
	let re = 0, im = 0;
	for (let p = 0; p < N; p++) { re += Math.cos(p * psi); im -= Math.sin(p * psi); }
	return (re * re + im * im) / (N * N);
}

// ---- the Fresnel zone ------------------------------------------------------------------------------------------
export const LAMBDA = 0.1;               // m
export const WIDTH = 1.5;                // m, the array
export const NEAR = 4.5, FAR = 225;      // m, the two sources
/** The gap at the distance a from the centre between the front of radius r through the centre and its tangent. */
export const gap = (r, a) => Math.hypot(r, a) - r;

// ---- the pair --------------------------------------------------------------------------------------------------
export const HALF_SEP = 0.6;             // the sources at +-0.6 lambda/D
/** The amplitude pattern of one source at c across the image, theta in units of lambda/D: sin x / x, x = pi (theta - c). */
export const amp = (t, c) => sinc(Math.PI * (t - c));
export const incoherent = (t) => amp(t, HALF_SEP) ** 2 + amp(t, -HALF_SEP) ** 2;
export const coherent = (t) => (amp(t, HALF_SEP) + amp(t, -HALF_SEP)) ** 2;

/** The largest value of f on [a, b]: a fine grid, then golden sections round the best. */
export function top(f, a, b, n = 50000) {
	let best = a;
	for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; if (f(x) > f(best)) best = x; }
	let lo = Math.max(a, best - (b - a) / n), hi = Math.min(b, best + (b - a) / n);
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 200; i++) {
		const c = hi - g * (hi - lo), d = lo + g * (hi - lo);
		if (f(c) > f(d)) hi = d; else lo = c;
	}
	const x = (lo + hi) / 2;
	return { x, y: f(x) };
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the delays: p b sin 30 = p lambda / 6, exact for b = lambda/3
	for (let p = 0; p < PIXELS; p++) check(near(delay(p), p / 6, 1e-15), `the delay of pixel ${p}`);
	check(near(Math.sin(THETA), 0.5, 1e-15), 'sin 30 degrees');

	// ---- the beam pattern: the closed form against the sum, everywhere on a grid, for both spacings
	for (const q of [0.5, 2]) for (let s = -1; s <= 1 + 1e-12; s += 1 / 4096) check(near(pattern(s, q), direct(s, q), 1e-12), `the pattern at ${s}, b = ${q} lambda`);
	// the first zeros at lambda/Nb: 0.25 and 0.0625, with nothing lower before them
	for (const [q, z] of [[0.5, 0.25], [2, 0.0625]]) {
		check(near(1 / (ROW * q), z, 1e-15) && pattern(z, q) < 1e-28 && pattern(-z, q) < 1e-28, `the first zero for b = ${q} lambda`);
		for (let s = 1e-4; s < z - 1e-4; s += 1e-4) check(pattern(s, q) > pattern(s + 1e-4, q), `the main lobe of b = ${q} lambda is not falling at ${s}`);
	}
	// b = lambda/2: the largest side lobe, 0.0525 at +-0.36, the text's 5.3%; no other lobe of full height
	const side = top((s) => pattern(s, 0.5), 0.25, 1);
	check(side.y.toFixed(4) === '0.0525' && side.x.toFixed(2) === '0.36' && (100 * side.y).toFixed(1) === '5.3', `the largest side lobe ${side.y} at ${side.x}`);
	check(near(top((s) => pattern(s, 0.5), -1, -0.25).y, side.y, 1e-12), 'the side lobes are not symmetric');
	// b = 2 lambda: the grating lobes of full height at lambda/b = 0.5 and 1, and every other value below the main lobe's
	for (const s of [-1, -0.5, 0.5, 1]) check(near(pattern(s, 2), 1, 1e-12) && near(direct(s, 2), 1, 1e-12), `the grating lobe at ${s}`);
	for (let s = -1; s <= 1; s += 1e-4) {
		const off = Math.min(...[-1, -0.5, 0, 0.5, 1].map((c) => Math.abs(s - c)));
		if (off > 0.0625) check(pattern(s, 2) < 0.06, `a lobe of b = 2 lambda at ${s}`);
		if (Math.abs(s) > 0.25) check(pattern(s, 0.5) <= side.y + 1e-12, `a lobe of b = lambda/2 at ${s}`);
	}

	// ---- the Fresnel zone: the exact gaps and the text's estimate
	const g1 = gap(NEAR, WIDTH / 2), g2 = gap(FAR, WIDTH / 2);
	check(g1.toFixed(3) === '0.062' && g1.toFixed(5) === '0.06207' && (g1 / LAMBDA).toFixed(2) === '0.62', `the near gap ${g1}`);
	check((g2 * 1e3).toFixed(2) === '1.25' && (g2 / LAMBDA).toFixed(4) === '0.0125', `the far gap ${g2}`);
	check((WIDTH ** 2 / (8 * NEAR)).toFixed(4) === '0.0625' && (WIDTH ** 2 / (8 * NEAR) / LAMBDA).toFixed(2) === '0.63', 'the text\'s D^2/8r');
	check(near(WIDTH ** 2 / LAMBDA, 22.5, 1e-12) && near(FAR / (WIDTH ** 2 / LAMBDA), 10, 1e-12), 'D^2/lambda and the far source ten times beyond it');

	// ---- the pair: the incoherent dip to 0.50 of the peaks, the coherent pair's one peak in the middle
	const pi = top(incoherent, 0, 2.5), pc = top(coherent, -2.5, 2.5);
	const dip = incoherent(0) / pi.y;
	check(dip.toFixed(2) === '0.50' && dip < 0.5, `the incoherent dip ${dip}`);
	check(near(pc.x, 0, 1e-6) && near(top(coherent, -2.5, 0).y, coherent(0), 1e-12), `the coherent peak at ${pc.x}`);
	// the coherent image falls from the middle to the sources: no dip
	for (let t = 1e-3; t <= HALF_SEP; t += 1e-3) check(coherent(t) < coherent(t - 1e-3), `the coherent image rises at ${t}`);
	check(near(top(incoherent, -2.5, 0).y, pi.y, 1e-12), 'the incoherent peaks are not equal');
	return { side, g1, g2, peakInc: pi, peakCoh: pc, dip };
}
