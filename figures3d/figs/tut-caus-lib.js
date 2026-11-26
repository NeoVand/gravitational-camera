// Shared numbers and marks for the two diagrams of the tutorial's section 4.5 (tutorial/response/causality.md):
// tut-caus-kernels and tut-caus-contour. Not a figure itself. The sheet, the strokes and the labels are section 1.2's
// (figs/tut-pot-lib.js), the axes section 3.1's (figs/tut-prob-lib.js), the sampling of curves section 2.6's
// (figs/tut-fourier-lib.js), the dotted zero line section 3.6's (figs/tut-bessel-lib.js) and the push's arrow chapter
// 1.5's (figs/tut-five-lib.js), all imported, not copied. The cart's response keeps the colour of its swing in chapter
// 4.1 (figs/tut-osc-ringdown.js), the first accent (orange): its impulse response and its poles.
//
// Units: omega_0 = 1, so a time is in units of 1/omega_0 and a frequency in units of omega_0; m = 1, so chi(t) is in
// units of 1/m omega_0 and chi(omega) in units of 1/m omega_0^2. With Q the quality factor, Gamma = 1/Q and
// omega_d = sqrt(1 - Gamma^2/4).
//
// `chapter(check)` asserts every number that a diagram draws or its comment prints: the impulse response for Q = 5
// (that it solves the cart's law of motion after the blow, starts from rest with unit velocity, and that its
// transform eq:transform is 4.1's chi(omega)); the even kernel e^{-|t|} (that its transform is the real 2/(1 + omega^2));
// and the poles for Q = 3 (that they are the roots of omega_0^2 - omega^2 - i Gamma omega, at +-0.986 - 0.167i).
import { n2 } from './tut-pot-lib.js';

export const Q_KERNEL = 5;                // the impulse response of tut-caus-kernels
export const Q_POLES = 3;                 // the poles of tut-caus-contour

export const gammaOf = (Q) => 1 / Q;
export const omegaD = (Q) => Math.sqrt(1 - 1 / (4 * Q * Q));

/** 4.1's impulse response, eq:impulse: e^{-Gamma t/2} sin(omega_d t) / omega_d after the blow, zero before it. */
export const impulse = (t, Q = Q_KERNEL) => (t <= 0 ? 0 : (Math.exp((-t / Q) / 2) * Math.sin(omegaD(Q) * t)) / omegaD(Q));
/** The chapter's non-example, the even kernel e^{-|t|/tau} with tau = 1. */
export const even = (t) => Math.exp(-Math.abs(t));

/** 4.1's chi(omega) = 1 / (omega_0^2 - omega^2 - i Gamma omega), [Re, Im], for real omega. */
export function chi(w, Q = Q_KERNEL) {
	const re = 1 - w * w, im = w / Q, d = re * re + im * im;
	return [re / d, im / d];
}

/** The poles of chi for Q > 1/2: +-omega_d - i Gamma/2, as [re, im]. */
export const poles = (Q = Q_POLES) => [[-omegaD(Q), -gammaOf(Q) / 2], [omegaD(Q), -gammaOf(Q) / 2]];

/** The transform int f(t) e^{i omega t} dt over [a, b] by Simpson's rule, [Re, Im]. */
function transform(f, w, a, b, n) {
	let re = 0, im = 0;
	const h = (b - a) / n;
	for (let i = 0; i <= n; i++) {
		const t = a + i * h, c = i === 0 || i === n ? 1 : i % 2 ? 4 : 2, v = f(t);
		re += c * v * Math.cos(w * t);
		im += c * v * Math.sin(w * t);
	}
	return [(re * h) / 3, (im * h) / 3];
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the impulse response for Q = 5: Gamma = 0.2, omega_d = 0.995
	const Q = Q_KERNEL, g = gammaOf(Q), wd = omegaD(Q);
	check(near(g, 0.2, 1e-15) && wd.toFixed(3) === '0.995', `Q = 5: Gamma ${g}, omega_d ${wd}`);
	// it solves chi'' + Gamma chi' + chi = 0 after the blow, from chi = 0 with chi' = 1 (the unit impulse over m)
	const h = 1e-4, d1 = (t) => (impulse(t + h) - impulse(t - h)) / (2 * h), d2 = (t) => (impulse(t + h) - 2 * impulse(t) + impulse(t - h)) / (h * h);
	for (const t of [0.4, 1.9, 3.7, 6.2, 7.8]) check(Math.abs(d2(t) + g * d1(t) + impulse(t)) < 1e-6, `the impulse response breaks the law of motion at ${t}`);
	check(impulse(0) === 0 && near((impulse(1e-7) - impulse(0)) / 1e-7, 1, 1e-6), 'the impulse response does not start from rest with unit velocity');
	for (let t = -3; t <= 0; t += 1e-3) check(impulse(t) === 0, `the impulse response is not zero before the blow at ${t}`);
	// its transform over the times after the blow is 4.1's chi(omega)
	for (const w of [0, 0.5, 0.995, 1.3, 2.4]) {
		const [re, im] = transform(impulse, w, 0, 400, 400000), [cr, ci] = chi(w);
		check(near(re, cr, 1e-8 * Math.hypot(cr, ci) + 1e-12) && near(im, ci, 1e-8 * Math.hypot(cr, ci) + 1e-12), `the transform at ${w}: ${re}, ${im} against ${cr}, ${ci}`);
	}
	// ---- the even kernel: its transform 2 tau / (1 + omega^2 tau^2) is real
	for (const w of [0, 0.7, 1.5, 3]) {
		const [re, im] = transform(even, w, -60, 60, 240000);
		check(near(re, 2 / (1 + w * w), 1e-9) && Math.abs(im) < 1e-12, `the even kernel's transform at ${w}: ${re}, ${im}`);
	}
	for (const t of [0.3, 1, 2.2]) check(even(t) === even(-t), 'the even kernel is not even');
	// ---- the poles for Q = 3: Gamma = 1/3, omega_d = 0.986, at +-0.986 - 0.167 i, roots of 1 - omega^2 - i Gamma omega
	const P = poles(Q_POLES), g3 = gammaOf(Q_POLES);
	for (const [a, b] of P) {
		// 1 - (a + ib)^2 - i g3 (a + ib) = (1 - a^2 + b^2 + g3 b) + i (-2ab - g3 a)
		check(Math.abs(1 - a * a + b * b + g3 * b) < 1e-15 && Math.abs(-2 * a * b - g3 * a) < 1e-15, `(${a}, ${b}) is not a pole`);
		check(b < 0, 'a pole is not below the real axis');
	}
	check(P[1][0].toFixed(3) === '0.986' && (-P[1][1]).toFixed(3) === '0.167', `the poles ${P}`);
	check(Q_POLES > 0.5, 'Q = 3 is not above a half');
	return { wd, poles: P, wd3: omegaD(Q_POLES) };
}

// ---- marks -------------------------------------------------------------------------------------------------------

/** A pole: an upright cross of two strokes at 45 degrees, half-size `r`, remembered as two marks. */
export function cross(S, [x, y], r, { color, width, layer = 3, what = 'a pole' }) {
	S.path([[x - r, y - r], [x + r, y + r]], { color, width, layer, cap: 'round', what });
	S.path([[x - r, y + r], [x + r, y - r]], { color, width, layer, cap: 'round', what });
}

/** An arrowhead alone, its tip at `tip` pointing along the unit vector u (page coordinates), as Sheet.arrow's head. */
export function head(S, tip, u, hd, { color, layer = 3, what = 'a head' }) {
	const w = [-u[1], u[0]], hw = 0.36 * hd, base = [tip[0] - u[0] * hd, tip[1] - u[1] * hd];
	const a = [base[0] + w[0] * hw, base[1] + w[1] * hw], b = [base[0] - w[0] * hw, base[1] - w[1] * hw];
	S.raw(`<path d="M${n2(tip[0])},${n2(tip[1])}L${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}Z" fill="${color}"/>`, layer);
	S.mark([tip, a, b, tip], 0, what);
	return { tip, base };
}
