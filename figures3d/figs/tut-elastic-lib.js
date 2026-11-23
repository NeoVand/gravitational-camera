// Shared numbers for the three diagrams of the tutorial's chapter 4.3 (tutorial/response/elastic-bodies.md):
// tut-elastic-strain, tut-elastic-stress and tut-elastic-trial. Not a figure itself. The strokes, heads, labels and
// the cropping are those of chapter 1.1's diagrams (figs/tut-vec-lib.js), the dashed outline at rest and the orange
// stretch and blue squeeze arrows those of chapter 1.5's rings (figs/tut-five-lib.js), the tinted faces of a box those
// of chapter 1.3 (figs/tut-gauss-lib.js), all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: Appendix A's trial
// shape u = (q/R)(-x/2, -y/2, z), its strain diag(-1/2, -1/2, 1) q/R with no trace, its surface r = R + q P2(cos theta);
// steel's shear modulus mu = rho c_T^2; Rayleigh's bound sqrt(10) c_T / R; Lamb's exact quadrupole note
// omega R / c_T = 2.645 and the twist's 2.50 for c_L / c_T = 1.84, found here as the roots of the free sphere's
// frequency equations; and the three notes 15.1, 12.6 and 11.9 kHz for c_T = 3000 m/s and R = 10 cm.

export const C_T = 3000;                  // m/s, the tutorial's shear sound in steel
export const RATIO = 1.84;                // c_L / c_T, measured
export const R_BALL = 0.1;                // m
export const RHO = 7850;                  // kg m^-3
export const MU = RHO * C_T ** 2;         // Pa

/** Appendix A's trial shape at (x, y, z) for the pole's displacement q (z the axis). */
export const trial = ([x, y, z], q, R = R_BALL) => [(-q / R) * x / 2, (-q / R) * y / 2, (q / R) * z];
export const P2 = (c) => (3 * c * c - 1) / 2;

// ---- the free elastic sphere, degree 2 ------------------------------------------------------------------------
/** Spherical Bessel functions j_0 ... j_l at x, by upward recurrence (exact enough for l <= 3 and x near 1 to 6). */
function jl(l, x) {
	let a = Math.sin(x) / x, b = Math.sin(x) / (x * x) - Math.cos(x) / x;
	if (l === 0) return a;
	for (let n = 1; n < l; n++) { const c = ((2 * n + 1) / x) * b - a; a = b; b = c; }
	return b;
}
const deriv = (f, r, e = 1e-5) => (f(r + e) - f(r - e)) / (2 * e);

/** The traction-free condition of the spheroidal modes of degree l, as a determinant, at eta = omega R / c_T: the
 * compressional part u = grad(j_l(hr) Y) and the shear part with radial j_l(kr) l(l+1)/r, h = k c_T / c_L. */
function spheroidal(eta, l = 2, ratio = RATIO) {
	const k = eta, h = eta / ratio, R = 1;
	const UP = (r) => h * deriv((s) => jl(l, s), h * r), VP = (r) => jl(l, h * r) / r;
	const US = (r) => (l * (l + 1) * jl(l, k * r)) / r, VS = (r) => deriv((s) => s * jl(l, k * s), r) / r;
	const rrP = -(k * k - 2 * h * h) * jl(l, h * R) + 2 * deriv(UP, R), rrS = 2 * deriv(US, R);
	const tP = deriv(VP, R) - VP(R) / R + UP(R) / R, tS = deriv(VS, R) - VS(R) / R + US(R) / R;
	return rrP * tS - rrS * tP;
}
/** The torsional modes of degree l: (l - 1) j_l(eta) = eta j_{l+1}(eta). */
const torsional = (eta, l = 2) => (l - 1) * jl(l, eta) - eta * jl(l + 1, eta);

/** The first root of f above a, by a fine scan and bisection. */
function firstRoot(f, a, b, step = 1e-3) {
	let x = a, fx = f(x);
	while (x < b) {
		const y = x + step, fy = f(y);
		if (Math.sign(fy) !== Math.sign(fx)) {
			let lo = x, hi = y, flo = fx;
			for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2, fm = f(m); if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m; }
			return (lo + hi) / 2;
		}
		x = y; fx = fy;
	}
	throw new Error('no root');
}

export const ETA_RAYLEIGH = Math.sqrt(10);
export const ETA_LAMB = firstRoot((e) => spheroidal(e), 0.5, 6);
export const ETA_TWIST = firstRoot((e) => torsional(e), 0.5, 6);
/** A note in kHz from omega R / c_T. */
export const kHz = (eta) => (eta * C_T) / R_BALL / (2 * Math.PI) / 1000;

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// the trial shape: its table d_j u_i is (q/R) diag(-1/2, -1/2, 1), symmetric, with no trace
	const q = 1e-3, R = R_BALL, h = 1e-6, D = [];
	for (let i = 0; i < 3; i++) {
		D.push([]);
		for (let j = 0; j < 3; j++) {
			const p = [0.013, -0.021, 0.034], a = [...p], b = [...p];
			a[j] += h; b[j] -= h;
			D[i].push(((trial(a, q)[i] - trial(b, q)[i]) / (2 * h)) * (R / q));
		}
	}
	const want = [[-0.5, 0, 0], [0, -0.5, 0], [0, 0, 1]];
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) check(near(D[i][j], want[i][j], 1e-9), `the trial shape's table at ${i}${j}: ${D[i][j]}`);
	check(near(D[0][0] + D[1][1] + D[2][2], 0, 1e-9), 'the trial shape changes the volume');
	check(near(0.25 + 0.25 + 1, 1.5, 0), 'the trial shape\'s u_ij u_ij');
	// the poles out by q, the equator in by q/2, and the surface's outward part q P2(cos theta)
	check(near(trial([0, 0, R], q)[2], q, 1e-15) && near(trial([R, 0, 0], q)[0], -q / 2, 1e-15), 'the poles and the equator');
	for (let t = 0; t <= Math.PI; t += Math.PI / 36) {
		const p = [R * Math.sin(t), 0, R * Math.cos(t)], u = trial(p, q);
		check(near((u[0] * p[0] + u[2] * p[2]) / R, q * P2(Math.cos(t)), 1e-15), `the surface is not R + q P2 at ${t}`);
	}
	// steel
	check((MU / 1e10).toFixed(1) === '7.1', `mu = ${MU}`);
	// the three notes
	check((ETA_RAYLEIGH * C_T / R_BALL / 1e4).toFixed(2) === '9.49', 'Rayleigh\'s bound in s^-1');
	check(ETA_LAMB.toFixed(3) === '2.645', `Lamb's quadrupole note omega R / c_T = ${ETA_LAMB}`);
	check(ETA_TWIST.toFixed(2) === '2.50', `the twist omega R / c_T = ${ETA_TWIST}`);
	check(ETA_TWIST < ETA_LAMB && ETA_LAMB < ETA_RAYLEIGH, 'the notes are not in the order twist, Lamb, Rayleigh');
	check(kHz(ETA_RAYLEIGH).toFixed(1) === '15.1', `Rayleigh's bound ${kHz(ETA_RAYLEIGH)} kHz`);
	check(kHz(ETA_LAMB).toFixed(1) === '12.6', `Lamb's note ${kHz(ETA_LAMB)} kHz`);
	check(kHz(ETA_TWIST).toFixed(1) === '11.9', `the twist ${kHz(ETA_TWIST)} kHz`);
	check(((ETA_RAYLEIGH / ETA_LAMB - 1) * 100).toFixed(0) === '20', 'Rayleigh\'s bound is not 20% above Lamb\'s note');
	check((C_T / (kHz(ETA_RAYLEIGH) * 1000)).toFixed(2) === '0.20', 'shear sound at 15 kHz is not 0.20 m long');
	return { rayleigh: kHz(ETA_RAYLEIGH), lamb: kHz(ETA_LAMB), twist: kHz(ETA_TWIST) };
}
