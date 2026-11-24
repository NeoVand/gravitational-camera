// Shared numbers and colours for the three diagrams of the tutorial's chapter 7.7
// (tutorial/geometry/quadrupole-formula.md): tut-rotor-stress, tut-present-delay and tut-crossover. Not a figure itself.
// The colour roles are chapter 7.4's (figs/tut-linear-lib.js: the observer's, the curvature's, matter's and the
// field's, read from app.css by `palette(check)`), orange for a stretch and blue for a squeeze only (tut-gw-lib.js);
// the sheet, strokes, labels and cropping are those of chapters 6.1 to 7.6, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - the rotor and its rod: two masses m at +-(d/2) u, u = (-sin Omega t, cos Omega t, 0), moving at Omega d / 2 along
//    +-w, w = (-cos Omega t, -sin Omega t, 0); the masses' momentum flux 2 m (Omega d / 2)^2 w w, the rod's tension
//    F = m Omega^2 d / 2 carried over its length d, -F d u u; their sum (1/2) m Omega^2 d^2 (w w - u u) equal to half
//    the second derivative of I = (1/2) m d^2 u u (by finite differences of I(t)) at every instant tried; without the
//    rod the trace (1/2) m Omega^2 d^2, twice the kinetic energy, against I-double-dot's zero; du/dt = Omega w;
//  - the power: 4 pi (1 - 2/3 + 1/15) = 8 pi / 5, its bracket 2/5; (c^3 / 32 pi G)(2G/c^4)^2 (8 pi / 5) = G / 5 c^5;
//    the turning table's square (1/2 Delta I)^2 (2 Omega)^6 x 2 = 32 Delta I^2 Omega^6; at sixteen turns a second
//    Omega = 100.5 s^-1, P = 4.55 x 10^-41 W, 2 hbar Omega = 2.12 x 10^-32 J, one graviton every 4.66 x 10^8 s,
//    14.8 years; A r = 4 G Delta I Omega^2 / c^4 = 1.67 x 10^-40 m, A = 1.7 x 10^-47 at 10,000 km;
//  - compactness: lambda / d = (pi/2)(c/v); a pair 1 m across turning once a second, v = 3.1 m s^-1 and
//    lambda = 1.50 x 10^8 m; k d = 4 v / c;
//  - the present positions: k = 2 Omega / c, so the retarded positions are turned back by Omega r / c = k r / 2; at
//    k r = 0.1 that is 0.05 rad, which changes the two-armed pattern (cos 2 phi) by about k r, 10 per cent;
//  - the tide in the plane (eq:plane-tide): rebuilt from the all-zone solution (the paper's eq:multipole, M = L = 0),
//    lowered, its trace reversal undone, through 7.2's linearized R_0z0z by finite differences, at four distances and
//    two times; the bracket's squared size 225 + 135 x^2 + 39 x^4 + 10 x^6 + x^8 (x = k r); the near law
//    (15/4) G Delta I / r^5 and the far law 4 G Delta I Omega^4 / c^4 r, both its limits; in units of
//    G Delta I Omega^4 / c^4, r |E_zz| = 4 sqrt(...) / x^4, the near law 60 / x^4 and the far law 4; they cross at
//    x^4 = 15, r = (15/16)^(1/4) c / Omega = 0.313 lambda = 1.97 lambda / 2 pi; lambda / 2 pi = 0.159 lambda; at the
//    crossing the exact field is three times either law; its local law is r^-3 at 0.310 lambda;
//  - the paper's pair: 30 solar masses each, 2200 km apart: Omega = sqrt(2 G m / d^3) = 27.3 s^-1, v = 0.100 c,
//    8.7 Hz, lambda = 34,400 km, lambda / 2 pi = 5500 km, the crossover at 10,800 km, five times their separation.
import { OBS, CURV, MATTER, FIELD, ACCENT, ACCENT2, stack, palette, G, C } from './tut-linear-lib.js';
import { riemann } from './tut-linear-lib.js';
import { HBAR } from './tut-einstein-lib.js';

export { OBS, CURV, MATTER, FIELD, ACCENT, ACCENT2, stack, palette, G, C };

// ---- the rotor ---------------------------------------------------------------------------------------------------
/** The unit vector along the rod and the one along the + mass's motion, at the phase Omega t. */
export const uHat = (ph) => [-Math.sin(ph), Math.cos(ph), 0];
export const wHat = (ph) => [-Math.cos(ph), -Math.sin(ph), 0];
const outer = (a, b, s = 1) => a.map((x) => b.map((y) => s * x * y));
const add = (...T) => T[0].map((row, i) => row.map((_, j) => T.reduce((s, t) => s + t[i][j], 0)));
/** The masses' momentum flux, integrated: sum of m v v over both, kg m^2 s^-2 (J). */
export function massFlux(m, W, d, ph) {
	const v = (W * d) / 2, w = wHat(ph);
	return add(outer(w, w, m * v * v), outer(w.map((x) => -x), w.map((x) => -x), m * v * v));
}
/** The rod's tension F = m Omega^2 d / 2 over its length d, a negative flux along u: -F d u u. */
export function rodFlux(m, W, d, ph) {
	const F = (m * W * W * d) / 2, u = uHat(ph);
	return outer(u, u, -F * d);
}
/** The second moment, (1/2) m d^2 u u, at the time t. */
export const secondMoment = (m, W, d, t) => { const u = uHat(W * t); return outer(u, u, (m * d * d) / 2); };

// ---- the tide in the plane -----------------------------------------------------------------------------------------
/** The bracket of eq:plane-tide, x^4 + 2i x^3 + 3x^2 + 15i x - 15, as [re, im]. */
export const bracket = (x) => [x ** 4 + 3 * x * x - 15, 2 * x ** 3 + 15 * x];
/** Its squared size as the chapter writes it. */
export const poly = (x) => 225 + 135 * x ** 2 + 39 * x ** 4 + 10 * x ** 6 + x ** 8;
/** r |E_zz| in units of G Delta I Omega^4 / c^4, at x = k r: 4 sqrt(poly) / x^4; the near law 60 / x^4; the far law 4. */
export const exact = (x) => (4 * Math.sqrt(poly(x))) / x ** 4;
export const nearLaw = (x) => 60 / x ** 4;
export const farLaw = () => 4;
/** k r at the crossing: (k r)^4 = 15. */
export const X_CROSS = 15 ** 0.25;
/** The local law of |E_zz|, d ln |E_zz| / d ln r, at x. */
export const localLaw = (x) => -5 + (x * (270 * x + 156 * x ** 3 + 60 * x ** 5 + 8 * x ** 7)) / (2 * poly(x));

/** E_zz at the pixel (r, 0, 0), from the all-zone solution (M = L = 0), with G = c = Omega = Delta I = 1 (k = 2), by
 * 7.2's linearized curvature and finite differences: R_0z0z with x^0 = c t. */
export function allZoneTide(t, r) {
	// the turning table, I = Re[-(1/2) (1, i; i, -1) e^{-2 i u}], and its derivatives
	const I = (u) => [[-0.5 * Math.cos(2 * u), -0.5 * Math.sin(2 * u), 0], [-0.5 * Math.sin(2 * u), 0.5 * Math.cos(2 * u), 0], [0, 0, 0]];
	const I1 = (u) => [[Math.sin(2 * u), -Math.cos(2 * u), 0], [-Math.cos(2 * u), -Math.sin(2 * u), 0], [0, 0, 0]];
	const I2 = (u) => [[2 * Math.cos(2 * u), 2 * Math.sin(2 * u), 0], [2 * Math.sin(2 * u), -2 * Math.cos(2 * u), 0], [0, 0, 0]];
	const ETA = [-1, 1, 1, 1];
	// the trace-reversed perturbation with lower indices at the event X = (t, x, y, z)
	const hbar = (X) => {
		const s = Math.hypot(X[1], X[2], X[3]), n = [X[1] / s, X[2] / s, X[3] / s], u = X[0] - s;
		const A = I(u), B = I1(u), D = I2(u);
		let h00 = 0;
		const h0 = [0, 0, 0];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
			// (1/2) d_i d_j (I_ij(u)/r) = (1/2)[(3 n_i n_j - delta_ij)(I/r^3 + I'/r^2) + n_i n_j I''/r]
			h00 += 4 * 0.5 * ((3 * n[i] * n[j] - (i === j ? 1 : 0)) * (A[i][j] / s ** 3 + B[i][j] / s ** 2) + (n[i] * n[j] * D[i][j]) / s);
			h0[i] += 2 * ((B[i][j] * n[j]) / s ** 2 + (D[i][j] * n[j]) / s);
		}
		const T = [[h00, -h0[0], -h0[1], -h0[2]], [-h0[0], 0, 0, 0], [-h0[1], 0, 0, 0], [-h0[2], 0, 0, 0]];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) T[i + 1][j + 1] = (2 * D[i][j]) / s;
		return T;
	};
	// undo the trace reversal: h = hbar - (1/2) eta hbar^a_a
	const h = (m, n, X) => {
		const T = hbar(X), tr = [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * T[a][a], 0);
		return T[m][n] - (m === n ? 0.5 * ETA[m] * tr : 0);
	};
	return riemann(h, [t, r, 0, 0], 0, 3, 0, 3);
}

// ---- constants ---------------------------------------------------------------------------------------------------
export const YEAR = 3.156e7;               // s
export const M_SUN = 1.989e30;             // kg

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(b), 1e-300);
	const fig = (v, n) => Math.abs(v).toExponential(n);
	const same = (A, B, tol) => A.every((row, i) => row.every((v, j) => Math.abs(v - B[i][j]) <= tol));

	// ---- the rotor and its rod, at several instants
	{
		const m = 1.3, W = 2.1, d = 0.8;
		for (const t of [0, 0.37, -0.25, 1.9, 2.6]) {
			const ph = W * t, Tm = massFlux(m, W, d, ph), Tr = rodFlux(m, W, d, ph), sum = add(Tm, Tr);
			const u = uHat(ph), w = wHat(ph), k = 0.5 * m * W * W * d * d;
			check(same(Tm, outer(w, w, k), 1e-12) && same(Tr, outer(u, u, -k), 1e-12), `the rotor's two tables at t = ${t}`);
			// half the second derivative of I, by central differences of I(t)
			const e = 1e-4, Ip = secondMoment(m, W, d, t + e), I0 = secondMoment(m, W, d, t), Im = secondMoment(m, W, d, t - e);
			const half = Ip.map((row, i) => row.map((v, j) => (0.5 * (v - 2 * I0[i][j] + Im[i][j])) / (e * e)));
			check(same(sum, half, 1e-5 * k), `the masses and the rod are not half of I-double-dot at t = ${t}`);
			const trace = (T) => T[0][0] + T[1][1] + T[2][2];
			check(Math.abs(trace(half)) < 1e-5 * k && rel(trace(Tm), k, 1e-12) && rel(trace(Tm), 2 * (2 * 0.5 * m * ((W * d) / 2) ** 2), 1e-12), `the traces at t = ${t}`);
			// du/dt = Omega w, dw/dt = -Omega u
			const du = uHat(W * (t + e)).map((v, i) => (v - uHat(W * (t - e))[i]) / (2 * e)), dw = wHat(W * (t + e)).map((v, i) => (v - wHat(W * (t - e))[i]) / (2 * e));
			check(du.every((v, i) => Math.abs(v - W * w[i]) < 1e-6) && dw.every((v, i) => Math.abs(v + W * u[i]) < 1e-6), 'du/dt is not Omega w');
		}
	}

	// ---- the power
	check(rel(4 * Math.PI * (1 - 2 / 3 + 1 / 15), (8 * Math.PI) / 5, 1e-14) && rel(1 - 2 / 3 + 1 / 15, 0.4, 1e-14), 'the sky integral');
	check(rel((C ** 3 / (32 * Math.PI * G)) * ((2 * G) / C ** 4) ** 2 * ((8 * Math.PI) / 5), G / (5 * C ** 5), 1e-12), 'the prefactor G / 5 c^5');
	const OM = 2 * Math.PI * 16, MASS = 1, D = 1, DI = 0.5 * MASS * D * D;
	{
		const sq = (0.5 * DI) ** 2 * (2 * OM) ** 6 * 2;
		check(rel(sq, 32 * DI * DI * OM ** 6, 1e-12), 'the turning table\'s square');
		const P = (G / (5 * C ** 5)) * sq;
		check(OM.toFixed(1) === '100.5' && rel(P, (8 / 5) * G * MASS ** 2 * D ** 4 * OM ** 6 / C ** 5, 1e-12) && fig(P, 2) === '4.55e-41', `the dumbbell's power ${P}`);
		const E = 2 * HBAR * OM, every = E / P;
		check(fig(E, 2) === '2.12e-32' && fig(every, 2) === '4.66e+8' && (every / YEAR).toFixed(1) === '14.8', `the graviton ${E} J every ${every} s`);
		const Ar = (4 * G * DI * OM * OM) / C ** 4;
		check(fig(Ar, 2) === '1.67e-40' && fig(Ar / 1e7, 1) === '1.7e-47', `A r = ${Ar}`);
	}
	// ---- compactness
	{
		const W = 2 * Math.PI, v = (W * 1) / 2, lam = (Math.PI * C) / W;
		check(v.toFixed(1) === '3.1' && fig(lam, 2) === '1.50e+8' && rel(lam / 1, (Math.PI / 2) * (C / v), 1e-12), `once a second: v ${v}, lambda ${lam}`);
		check(rel(((2 * W) / C) * 1, (4 * v) / C, 1e-12), 'k d is not 4 v / c');
	}

	// ---- the present positions: Omega r / c = k r / 2
	{
		const W = 3.7, r = 2.2e6, k = (2 * W) / C;
		check(rel((W * r) / C, (k * r) / 2, 1e-14), 'Omega r / c is not k r / 2');
		const turn = 0.1 / 2;
		check(turn === 0.05 && Math.round(2 * turn * 100) === 10, `at k r = 0.1 the turn ${turn} changes the pattern by ${2 * turn}`);
		// the two-armed pattern cos 2 phi, turned by delta: its largest change is 2 sin delta, about k r
		const delta = 0.05;
		let worst = 0;
		for (let i = 0; i < 3600; i++) { const p = (2 * Math.PI * i) / 3600; worst = Math.max(worst, Math.abs(Math.cos(2 * p) - Math.cos(2 * (p - delta)))); }
		check(Math.abs(worst - 2 * Math.sin(delta)) < 1e-5 && Math.round(worst * 100) === 10, `the pattern changes by ${worst}`);
	}

	// ---- the tide in the plane
	for (let x = 0.01; x < 30; x *= 1.07) {
		const [a, b] = bracket(x);
		check(rel(a * a + b * b, poly(x), 1e-12), `the bracket's square at ${x}`);
	}
	// rebuilt from the all-zone solution: G = c = Omega = Delta I = 1, so k = 2 and r = x / 2
	for (const x of [0.3, 1, X_CROSS, 4]) {
		const r = x / 2;
		for (const t of [0.13, 0.9]) {
			const fd = allZoneTide(t, r);
			const [a, b] = bracket(x), ph = -2 * (t - r);          // Re[(1/4 r^5)(a + i b) e^{i ph}]
			const closed = (a * Math.cos(ph) - b * Math.sin(ph)) / (4 * r ** 5);
			const scale = Math.sqrt(poly(x)) / (4 * r ** 5);
			check(Math.abs(fd - closed) < 2e-4 * scale, `eq:plane-tide is not the all-zone solution at k r = ${x}, t = ${t}: ${fd} against ${closed}`);
		}
	}
	// the two laws, in SI, against the curve's units: r |E| / (G Delta I Omega^4 / c^4)
	{
		const W = 27.3, dI = 3.1e40, unit = (G * dI * W ** 4) / C ** 4;
		for (const x of [0.05, 0.7, 3, 40]) {
			const r = (x * C) / (2 * W);
			const E = ((G * dI) / (4 * r ** 5)) * Math.sqrt(poly(x));
			check(rel((r * E) / unit, exact(x), 1e-12), `the curve's units at ${x}`);
			check(rel((r * (15 / 4) * G * dI) / r ** 5 / unit, nearLaw(x), 1e-12) && rel((r * 4 * G * dI * W ** 4) / (C ** 4 * r) / unit, farLaw(x), 1e-12), `the laws' units at ${x}`);
		}
		check(rel(exact(1e-3), nearLaw(1e-3), 1e-5) && rel(exact(1e4), farLaw(1e4), 1e-6), 'the curve does not run from one law to the other');
	}
	// the crossing
	const rCross = X_CROSS / (2 * Math.PI);                     // in wavelengths
	{
		check(rel(nearLaw(X_CROSS), farLaw(X_CROSS), 1e-14), 'the laws do not cross at (k r)^4 = 15');
		// r = (15/16)^(1/4) c / Omega, with lambda = pi c / Omega
		check(rel(rCross * Math.PI, (15 / 16) ** 0.25, 1e-14), 'the crossing is not (15/16)^(1/4) c / Omega');
		check(rCross.toFixed(3) === '0.313' && X_CROSS.toFixed(2) === '1.97' && (1 / (2 * Math.PI)).toFixed(3) === '0.159', `the crossing ${rCross}, ${X_CROSS}`);
		check(Math.round(exact(X_CROSS) / farLaw()) === 3, `the exact field at the crossing is ${exact(X_CROSS) / farLaw()} times either law`);
		// the local law: -5 near, -1 far, -3 at 0.310 lambda
		const fdLaw = (x) => (Math.log(exact(x * 1.0001) / (x * 1.0001)) - Math.log(exact(x / 1.0001) / (x / 1.0001))) / (2 * Math.log(1.0001));
		for (const x of [0.2, 1.5, 6]) check(Math.abs(fdLaw(x) - localLaw(x)) < 1e-6, `the local law at ${x}`);
		let lo = 0.5, hi = 5;
		for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (localLaw(mid) < -3) lo = mid; else hi = mid; }
		check((lo / (2 * Math.PI)).toFixed(3) === '0.310' && Math.abs(localLaw(1e-3) + 5) < 1e-4 && Math.abs(localLaw(1e3) + 1) < 1e-4, `the local law is r^-3 at ${lo / (2 * Math.PI)}`);
	}
	// the paper's pair
	{
		const m = 30 * M_SUN, d = 2.2e6, W = Math.sqrt((2 * G * m) / d ** 3), v = (W * d) / 2, lam = (Math.PI * C) / W;
		check(W.toFixed(1) === '27.3' && (v / C).toFixed(3) === '0.100' && ((2 * W) / (2 * Math.PI)).toFixed(1) === '8.7', `the pair: ${W}, ${v / C}`);
		check(Math.round(lam / 1e5) * 100 === 34400 && Math.round(lam / (2 * Math.PI) / 1e5) * 100 === 5500, `the pair's wavelength ${lam}`);
		check(Math.round((rCross * lam) / 1e5) * 100 === 10800 && Math.round((rCross * lam) / d) === 5, `the pair's crossover ${rCross * lam}`);
	}
	return { rCross, xCross: X_CROSS, reduced: 1 / (2 * Math.PI) };
}
