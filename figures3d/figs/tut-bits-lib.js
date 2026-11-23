// Shared mathematics for the three diagrams of the tutorial's chapter 3.8 (tutorial/noise/bits.md): tut-bits-questions,
// tut-bits-integrand and tut-bits-growth. Not a figure itself. The charts take chapter 3.1's sheet, axes and labels
// (figs/tut-pot-lib.js, figs/tut-prob-lib.js) and chapter 2.6's curve sampling (figs/tut-fourier-lib.js), imported, not
// copied.
//
// The near field, in the chapter's letters: q = kz; a ripple stands above its noise by s = pi SNR q e^{-q}; the cut-off
// q_c is the larger root of q e^{-q} = 1/(pi SNR); the bits per area z^2 are
//   C = (1/4 pi) int_0^inf q log2(1 + s^2) dq                       (the paper's eq:capacity-integral),
// and their closed form (q_c^3/3 - q_c^2/2) / (4 pi ln 2)            (the paper's eq:capacity).
// Everything takes the number of digits d = log10 SNR, so that SNR = 10^70 never overflows.

/** q_c for SNR = 10^d: the larger root of q - ln q = ln(pi SNR), by Newton's method (app/src/lib/engine/resolution.ts,
 * cutoff, ported line by line). */
export function cutoff(d) {
	const target = Math.log(Math.PI) + d * Math.LN10;
	if (!(target > 1)) throw new RangeError('SNR too small for any detail to survive');
	let q = target + Math.log(target);
	for (let i = 0; i < 50; i++) {
		const step = (q - Math.log(q) - target) / (1 - 1 / q);
		q -= step;
		if (Math.abs(step) < 1e-14 * q) break;
	}
	return q;
}

/** ln s at q, for SNR = 10^d. */
export const lnS = (q, d) => Math.log(Math.PI) + d * Math.LN10 + Math.log(q) - q;

/** log2(1 + s^2), formed from ln s^2 so that neither a huge nor a tiny s loses digits. */
export function bits2(q, d) {
	if (q <= 0) return 0;
	const u = 2 * lnS(q, d);
	return (u > 0 ? u + Math.log1p(Math.exp(-u)) : Math.log1p(Math.exp(u))) / Math.LN2;
}

/** The integrand of eq:capacity-integral, q log2(1 + s^2), in bits. */
export const integrand = (q, d) => q * bits2(q, d);

/** Its approximation where s >> 1, 2 q log2 s, kept up to q_c (where s = 1 and it is zero). */
export const approx = (q, d) => (2 * q * lnS(q, d)) / Math.LN2;

// ---- integration ----------------------------------------------------------------------------------------------------

/** Adaptive Simpson's rule on [a, b] to the absolute tolerance eps. */
export function simpson(f, a, b, eps) {
	const c = (a + b) / 2, fa = f(a), fb = f(b), fc = f(c);
	return step(f, a, b, fa, fb, fc, ((b - a) / 6) * (fa + 4 * fc + fb), eps, 60);
}
function step(f, a, b, fa, fb, fc, whole, eps, depth) {
	const c = (a + b) / 2, d1 = (a + c) / 2, d2 = (c + b) / 2, f1 = f(d1), f2 = f(d2);
	const left = ((c - a) / 6) * (fa + 4 * f1 + fc), right = ((b - c) / 6) * (fc + 4 * f2 + fb);
	if (depth <= 0 || Math.abs(left + right - whole) <= 15 * eps) return left + right + (left + right - whole) / 15;
	return step(f, a, c, fa, fc, f1, left, eps / 2, depth - 1) + step(f, c, b, fc, fb, f2, right, eps / 2, depth - 1);
}

/** The n nodes and weights of Gauss-Legendre on [-1, 1] (Newton's method on P_n). */
export function legendre(n) {
	const x = [], w = [];
	for (let i = 1; i <= n; i++) {
		let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5)), dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1, p1 = z;
			for (let k = 2; k <= n; k++) [p0, p1] = [p1, ((2 * k - 1) * z * p1 - (k - 1) * p0) / k];
			dp = (n * (z * p1 - p0)) / (z * z - 1);
			const dz = p1 / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-16) break;
		}
		x.push(z);
		w.push(2 / ((1 - z * z) * dp * dp));
	}
	return { x, w };
}
const GL = legendre(20);
/** Composite 20-point Gauss-Legendre on [a, b] in m panels. */
export function gaussLegendre(f, a, b, m) {
	let s = 0;
	const h = (b - a) / m;
	for (let j = 0; j < m; j++) {
		const c = a + (j + 0.5) * h;
		for (let i = 0; i < GL.x.length; i++) s += GL.w[i] * f(c + (h / 2) * GL.x[i]);
	}
	return (s * h) / 2;
}

/** The area under q log2(1 + s^2) from 0 to `top` (bits times 4 pi), split at q_c; the tolerance is relative. */
export function area(d, top = Infinity, rel = 1e-11) {
	const qc = cutoff(d);
	const end = Math.min(top, qc + 60);                      // beyond q_c + 60 the integrand is below 10^-48
	const scale = qc ** 3;
	const f = (q) => integrand(q, d);
	return simpson(f, 0, Math.min(qc, end), rel * scale) + (end > qc ? simpson(f, qc, end, rel * scale) : 0);
}

/** The bits per area z^2, eq:capacity-integral. */
export const capacity = (d) => area(d) / (4 * Math.PI);

/** The closed form, eq:capacity. */
export const closed = (d) => { const qc = cutoff(d); return (qc ** 3 / 3 - qc ** 2 / 2) / (4 * Math.PI * Math.LN2); };

/** The limiting form (ln SNR)^3 / (12 pi ln 2). */
export const limit = (d) => (d * Math.LN10) ** 3 / (12 * Math.PI * Math.LN2);

/** The checks every diagram of the chapter shares: its numbers, from the text, to the digits it prints. */
export function chapterNumbers(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	check(cutoff(3).toFixed(2) === '10.39' && cutoff(6).toFixed(2) === '17.84', `q_c = ${cutoff(3)}, ${cutoff(6)}`);
	check(cutoff(70).toFixed(0) === '167', `q_c at 10^70 = ${cutoff(70)}`);
	// the integral, by two methods that must agree to 10^-6 of its value
	for (const d of [1, 3, 6, 10, 35, 70]) {
		const qc = cutoff(d), f = (q) => integrand(q, d);
		const gl = gaussLegendre(f, 0, qc, 4000) + gaussLegendre(f, qc, qc + 60, 4000);
		check(near(gl, area(d), 1e-6 * area(d)), `the two integrals at 10^${d}: ${gl} and ${area(d)}`);
	}
	const C3 = capacity(3), C6 = capacity(6);
	check(C3.toFixed(1) === '37.9' && C6.toFixed(1) === '200.9' && Math.round(C6) === 201, `C = ${C3}, ${C6}`);
	check(capacity(10).toFixed(0) === '754' && (capacity(30) / 1e4).toFixed(2) === '1.55' && (capacity(70) / 1e5).toFixed(2) === '1.78', 'C at 10^10, 10^30, 10^70');
	check(closed(3).toFixed(1) === '36.8' && closed(6).toFixed(1) === '199.1' && closed(10).toFixed(0) === '751', `the closed form ${closed(3)}, ${closed(6)}`);
	check((cutoff(3) ** 2 / (4 * Math.PI)).toFixed(1) === '8.6', 'the patterns at 10^3');
	check(limit(3).toFixed(1) === '12.6' && (limit(70) / 1e5).toFixed(2) === '1.60', `the limit form ${limit(3)}, ${limit(70)}`);
	// doubling the digits: q_c by 1.72 and the bits by 5.3 from 10^3 to 10^6; by 1.94 and 7.4 from 10^35 to 10^70
	check((cutoff(6) / cutoff(3)).toFixed(2) === '1.72' && (C6 / C3).toFixed(1) === '5.3', 'the factors from 10^3 to 10^6');
	check((cutoff(70) / cutoff(35)).toFixed(2) === '1.94' && (capacity(70) / capacity(35)).toFixed(1) === '7.4', 'the factors from 10^35 to 10^70');
	return { C3, C6 };
}
