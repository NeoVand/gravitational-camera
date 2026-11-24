// Shared numbers for the four diagrams of the tutorial's chapter 6.6 (tutorial/relativity/maxwell-complex.md):
// tut-maxwell-wave, tut-maxwell-turn, tut-maxwell-parallel and tut-maxwell-sky. Not a figure itself. The colours (the
// observer's and the light role's, read from app.css's --q-obs and --q-light), the pixel's speed and its rapidity are
// chapter 6.1's (figs/tut-lorentz-lib.js), and the sheet, strokes, labels and cropping those of 6.1's and 6.2's
// diagrams, all imported, not copied. This file adds complex arithmetic on three-component vectors, the boost of the
// complex field (eq:boost-F), a dashed arrow, and the paper's view of the sky (figs/stars.js: an orthographic view
// turned about the vertical and tilted, as lib.js's Panel turns it).
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints:
//  - the wave: F = a m with a = sqrt2 (E1 - i E2), whose real part is E and imaginary part k x E (cB, the same length,
//    a quarter turn anticlockwise seen with k toward us); the circular wave E1 + i E2 = E0 e^{-i wt} has
//    a = sqrt2 E0 e^{i wt}, on a circle of radius sqrt2 E0 that it runs round anticlockwise; the linear wave along e1
//    has a = sqrt2 E0 cos wt, real, between -sqrt2 E0 and sqrt2 E0;
//  - the boost: eq:boost-EB and eq:boost-F agree; cosh ln2 = 1.25, sinh ln2 = 0.75; cos(i eta) = cosh eta and
//    sin(i eta) = i sinh eta; the turn's rule with theta = i eta is the boost's; the point (cos 35, sin 35) on
//    x^2 + y^2 = 1 and (1.25, 0.75) on x^2 - y^2 = 1;
//  - the parallel frame: F = w n, a boost along n and a turn about n leave it as it is, a boost across n does not,
//    and F.F = w^2 for every observer;
//  - the sky: m(z) is null, |m(z)|^2 = 2 (1 + |z|^2)^2, and a wave along n(z); for the charge at rest along +x the
//    roots z = +-1 and the directions +-x; for the charge at 0.9c along y, F = E (-1, 0, 0.9i), the roots
//    z = 0.9i +- 0.436, |z| = 1, the directions (+-0.436, 0.9, 0), their half sum (0, 0.9, 0) and half difference
//    (0.436, 0, 0) of length sqrt(1 - 0.9^2); and the paths of the two directions as the speed grows from 0 to 0.9c,
//    on the great circle z = 0.
import { OBS, LIGHT, palette, BETA, GAMMA, ETA } from './tut-lorentz-lib.js';
import { LINE } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { INK } from '../lib.js';

export { OBS, LIGHT, palette, BETA, GAMMA, ETA };

// ---- complex numbers as [re, im], and vectors of three of them ------------------------------------------------------
export const C = (re, im = 0) => [re, im];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const scale = (s, a) => [s * a[0], s * a[1]];
export const conj = (a) => [a[0], -a[1]];
export const abs = (a) => Math.hypot(a[0], a[1]);
export const div = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
export const csqrt = (a) => { const r = abs(a), re = Math.sqrt((r + a[0]) / 2), im = Math.sqrt(Math.max(0, (r - a[0]) / 2)); return [re, a[1] < 0 ? -im : im]; };
export const I = [0, 1];
const vadd = (u, v) => u.map((x, k) => add(x, v[k]));
const vscale = (s, u) => u.map((x) => mul(s, x));
/** The dot product without conjugates, a.b = a_l b_l. */
export const vdot = (u, v) => u.reduce((s, x, k) => add(s, mul(x, v[k])), C(0));
/** The cross product of a real unit vector u with a complex vector F. */
const rcross = (u, F) => [sub(scale(u[1], F[2]), scale(u[2], F[1])), sub(scale(u[2], F[0]), scale(u[0], F[2])), sub(scale(u[0], F[1]), scale(u[1], F[0]))];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** F = E + i cB from two real vectors. */
export const field = (E, cB) => E.map((e, k) => C(e, cB[k]));

/** eq:boost-F: a sensor moving with rapidity eta along the real unit vector u reads F' = F_par u + cosh eta F_perp
 * - i sinh eta u x F. */
export function boostF(F, u, eta) {
	const par = F.reduce((s, x, k) => add(s, scale(u[k], x)), C(0));
	const perp = F.map((x, k) => sub(x, scale(u[k], par)));
	const ux = rcross(u, F);
	return F.map((_, k) => add(add(scale(u[k], par), scale(Math.cosh(eta), perp[k])), mul([0, -Math.sinh(eta)], ux[k])));
}
/** The turn of the axes by theta about u: F' = F_par u + cos theta F_perp - sin theta u x F, for a complex angle. */
export function turnF(F, u, theta) {
	const ccos = (t) => scale(0.5, add(cexp(mul(I, t)), cexp(mul([0, -1], t))));
	const csin = (t) => div(sub(cexp(mul(I, t)), cexp(mul([0, -1], t))), [0, 2]);
	const par = F.reduce((s, x, k) => add(s, scale(u[k], x)), C(0));
	const perp = F.map((x, k) => sub(x, scale(u[k], par)));
	const ux = rcross(u, F);
	return F.map((_, k) => sub(add(scale(u[k], par), mul(ccos(theta), perp[k])), mul(csin(theta), ux[k])));
}
export const cexp = (a) => scale(Math.exp(a[0]), [Math.cos(a[1]), Math.sin(a[1])]);

// ---- the wave ----------------------------------------------------------------------------------------------------------
export const E_ANGLE = 30;                 // degrees above e1: the instant drawn
export const E0 = 1;
/** a = sqrt2 (E1 - i E2). */
export const amplitude = ([E1, E2]) => [Math.SQRT2 * E1, -Math.SQRT2 * E2];
/** The circular wave's instants: E1 + i E2 = E0 e^{-i wt}; the instant drawn has wt = -30 degrees. */
export const WT0 = -E_ANGLE;
export const STEPS = Array.from({ length: 8 }, (_, k) => WT0 + 45 * k);

// ---- the turn and the boost --------------------------------------------------------------------------------------------
export const THETA = 35;                   // degrees
export const Y_MAX = 1.6;                  // the hyperbola, y from -1.6 to 1.6

// ---- the sky ------------------------------------------------------------------------------------------------------------
export const SPEED = 0.9;                  // the moving charge, along y
/** The direction of the stereographic coordinate z: (2 Re z, 2 Im z, 1 - |z|^2) / (1 + |z|^2). */
export const nOf = (z) => { const q = z[0] ** 2 + z[1] ** 2; return [2 * z[0] / (1 + q), 2 * z[1] / (1 + q), (1 - q) / (1 + q)]; };
/** The paper's null vector m(z) = (1 - z^2, i (1 + z^2), -2z). */
export const mOf = (z) => { const z2 = mul(z, z); return [sub(C(1), z2), mul(I, add(C(1), z2)), scale(-2, z)]; };
/** The field of the charge along +x from the sensor, moving at beta c along y, in units of E: F = (-1, 0, i beta). */
export const chargeF = (beta) => [C(-1), C(0), C(0, beta)];
/** The two roots of m(z).F = 0: (i F_y - F_x) z^2 - 2 F_z z + (F_x + i F_y) = 0, the one with Re z > 0 first. */
export function roots(F) {
	const a = sub(mul(I, F[1]), F[0]), b = scale(-2, F[2]), c = add(F[0], mul(I, F[1]));
	const d = csqrt(sub(mul(b, b), scale(4, mul(a, c))));
	const r = [div(add(scale(-1, b), d), scale(2, a)), div(sub(scale(-1, b), d), scale(2, a))];
	return r.sort((p, q) => q[0] - p[0]);
}
/** The two directions at the speed beta c: (+-sqrt(1 - beta^2), beta, 0), the +x one first. */
export const directions = (beta) => roots(chargeF(beta)).map(nOf);

/** The view of the sky, as lib.js's Panel: turn about the vertical (y) by `turn` degrees, then tilt about the
 * horizontal (x) by `tilt`; returns [x right, y up, z toward the reader]. */
export function viewer(turn, tilt) {
	const a = (turn * Math.PI) / 180, t = (tilt * Math.PI) / 180;
	return ([x, y, z]) => {
		const x1 = Math.cos(a) * x + Math.sin(a) * z, z1 = -Math.sin(a) * x + Math.cos(a) * z;
		return [x1, Math.cos(t) * y - Math.sin(t) * z1, Math.sin(t) * y + Math.cos(t) * z1];
	};
}

// ---- drawing ----------------------------------------------------------------------------------------------------------
/** A dashed arrow on a pot-lib Sheet: a dashed shaft (tut-orb-lib's dashed) ending in a solid head `head` points long
 * at b. */
export function dashedArrow(S, a, b, { color = INK, width = LINE, head = 4.4, dash, layer = 2, what = 'a dashed arrow' } = {}) {
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = [-u[1], u[0]];
	const hd = Math.min(head, 0.4 * L), hw = 0.36 * hd;
	const base = [b[0] - u[0] * hd, b[1] - u[1] * hd], s1 = [b[0] - u[0] * hd * 0.8, b[1] - u[1] * hd * 0.8];
	dashed(S, a, s1, { color, width, layer, dash, what });
	const p = [base[0] + w[0] * hw, base[1] + w[1] * hw], q = [base[0] - w[0] * hw, base[1] - w[1] * hw];
	S.raw(`<path d="M${b[0].toFixed(2)},${b[1].toFixed(2)}L${p[0].toFixed(2)},${p[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}Z" fill="${color}"/>`, layer);
	S.mark([b, p, q, b], 0, what + "'s head");
	S.arrows.push({ L, head: hd, what });
	return { A: a, B: b, L, head: hd, u };
}

/** A straight arrow with a head at each end, as one shaft (so that no seam shows at its middle). */
export function doubleArrow(S, a, b, { color = INK, width = LINE, head = 4.4, layer = 2, what = 'a double arrow' } = {}) {
	const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = [-u[1], u[0]];
	const hd = Math.min(head, 0.2 * L), hw = 0.36 * hd;
	const s0 = [a[0] + u[0] * hd * 0.8, a[1] + u[1] * hd * 0.8], s1 = [b[0] - u[0] * hd * 0.8, b[1] - u[1] * hd * 0.8];
	const tri = (t, d) => { const base = [t[0] + d[0] * hd, t[1] + d[1] * hd]; return [t, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]]; };
	const ends = [tri(b, [-u[0], -u[1]]), tri(a, u)];
	const d = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z';
	S.raw(`<path d="M${s0[0].toFixed(2)},${s0[1].toFixed(2)}L${s1[0].toFixed(2)},${s1[1].toFixed(2)}" stroke="${color}" stroke-width="${width}" fill="none"/>` +
		ends.map((e) => `<path d="${d(e)}" fill="${color}"/>`).join(''), layer);
	S.mark([s0, s1], width / 2, what);
	ends.forEach((e, i) => S.mark([...e, e[0]], 0, `${what}'s head ${i}`));
	S.arrows.push({ L: L / 2, head: hd, what });
	return { A: a, B: b, L, head: hd, u };
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
	const cnear = (a, b, tol = 1e-12) => abs(sub(a, b)) <= tol;
	const vnear = (u, v, tol = 1e-12) => u.every((x, k) => cnear(x, v[k], tol));
	const rad = Math.PI / 180;

	// ---- the wave: F = a m, m = (1, i, 0)/sqrt2; Re F = E, Im F = k x E
	const m = [C(Math.SQRT1_2), C(0, Math.SQRT1_2), C(0)];
	{
		const E = [Math.cos(E_ANGLE * rad), Math.sin(E_ANGLE * rad), 0];
		const a = amplitude(E), F = vscale(a, m);
		const kxE = cross([0, 0, 1], E);
		check(F.every((x, k) => near(x[0], E[k]) && near(x[1], kxE[k])), 'F = a m is not E + i k x E');
		check(near(Math.hypot(...kxE), 1) && near(Math.atan2(kxE[1], kxE[0]) / rad, E_ANGLE + 90), 'cB is not E turned a quarter anticlockwise');
		check(near(E[0] * kxE[0] + E[1] * kxE[1], 0), 'cB is not at right angles to E');
		// the instant drawn is the circular wave's at wt = -30 degrees, where a = sqrt2 E0 e^{-i 30}
		check(cnear(a, scale(Math.SQRT2 * E0, cexp([0, WT0 * rad]))), 'the instant drawn is not a = sqrt2 E0 e^{i wt} at wt = -30');
		// k x m = -i m, the null vector's property
		check(vnear(rcross([0, 0, 1], m), vscale([0, -1], m)) && cnear(vdot(m, m), C(0)), 'k x m is not -i m');
	}
	for (let k = 0; k < 24; k++) {
		const wt = (15 * k) * rad;
		const e = scale(E0, cexp([0, -wt]));             // E1 + i E2
		const a = amplitude(e);
		check(cnear(a, scale(Math.SQRT2 * E0, cexp([0, wt]))) && near(abs(a), Math.SQRT2 * E0), `the circular wave's a at wt = ${15 * k}`);
		const lin = amplitude([E0 * Math.cos(wt), 0]);
		check(near(lin[1], 0) && near(lin[0], Math.SQRT2 * E0 * Math.cos(wt)), `the linear wave's a at wt = ${15 * k}`);
	}
	{
		// a runs round anticlockwise: its argument grows with wt
		const a0 = amplitude([Math.cos(0), -Math.sin(0)]), a1 = amplitude([Math.cos(0.1), -Math.sin(0.1)]);
		check(a0[0] * a1[1] - a0[1] * a1[0] > 0, 'a does not run anticlockwise');
		check(STEPS.length === 8 && near((STEPS[7] - STEPS[0]) + 45, 360), 'the eight steps of wt');
	}

	// ---- the boost of the field: eq:boost-EB against eq:boost-F, along x
	{
		const E = [0.3, -1.1, 0.7], cB = [0.9, 0.2, -0.4], eta = 0.83, ch = Math.cosh(eta), sh = Math.sinh(eta);
		const Ep = [E[0], ch * E[1] - sh * cB[2], ch * E[2] + sh * cB[1]];
		const cBp = [cB[0], ch * cB[1] + sh * E[2], ch * cB[2] - sh * E[1]];
		check(vnear(boostF(field(E, cB), [1, 0, 0], eta), field(Ep, cBp), 1e-14), 'eq:boost-F is not eq:boost-EB');
		// the boost is the turn at the imaginary angle i eta, about any direction
		const u = [2 / 7, 3 / 7, 6 / 7], F = field(E, cB);
		check(vnear(turnF(F, u, [0, eta]), boostF(F, u, eta), 1e-13), 'the turn by i eta is not the boost');
		// and it keeps F.F
		check(cnear(vdot(boostF(F, u, eta), boostF(F, u, eta)), vdot(F, F), 1e-13), 'the boost does not keep F.F');
	}
	check(near(Math.cosh(ETA), 1.25, 1e-15) && near(Math.sinh(ETA), 0.75, 1e-15) && near(ETA, Math.log(2), 1e-15), 'cosh ln 2 and sinh ln 2');
	for (const eta of [0.2, ETA, 1.4]) {
		const ci = scale(0.5, add(cexp(mul(I, [0, eta])), cexp(mul([0, -1], [0, eta]))));
		const si = div(sub(cexp(mul(I, [0, eta])), cexp(mul([0, -1], [0, eta]))), [0, 2]);
		check(cnear(ci, C(Math.cosh(eta))) && cnear(si, C(0, Math.sinh(eta))), `cos(i eta) and sin(i eta) at ${eta}`);
	}
	{
		const th = THETA * rad;
		check(near(Math.cos(th) ** 2 + Math.sin(th) ** 2, 1), 'the point on the circle');
		check(near(Math.cosh(ETA) ** 2 - Math.sinh(ETA) ** 2, 1, 1e-14), 'the point on the hyperbola');
		check(Math.sqrt(1 + Y_MAX ** 2).toFixed(3) === '1.887', 'the hyperbola\'s end');
		// the pixel's speed: tanh ln 2 = 0.6
		check(near(Math.tanh(ETA), 0.6, 1e-15), 'tanh ln 2');
		// the pixel's example: E = (E, 0, 0) and a boost along z give F' = (1.25 E, -0.75i E, 0)
		check(vnear(boostF(field([1, 0, 0], [0, 0, 0]), [0, 0, 1], ETA), [C(1.25), C(0, -0.75), C(0)], 1e-15), 'the pixel\'s F\'');
	}

	// ---- the parallel frame: F = w n
	{
		const n = [1, 0, 0], w = C(1, 0.6), F = n.map((x) => scale(x, w));
		check(vnear(boostF(F, n, 1.1), F, 1e-15), 'a boost along n changes F');
		check(vnear(turnF(F, n, C(0.7)), F, 1e-15), 'a turn about n changes F');
		const across = boostF(F, [0, 1, 0], 0.5);
		check(!vnear(across, F, 1e-3), 'a boost across n does not change F');
		check(cnear(vdot(across, across), mul(w, w), 1e-14) && cnear(vdot(F, F), mul(w, w)), 'F.F is not w^2');
		// the chapter's example: E = (1, 0, 0), cB = (0, 1/2, 0); e^{2 eta} = 3, beta = 1/2, F' = (0.866, 0, 0)
		const G = field([1, 0, 0], [0, 0.5, 0]);
		const f = vdot(G, m.map(conj)), g = vdot(G, m);
		check(near(abs(f), 1.5 / Math.SQRT2) && near(abs(g), 0.5 / Math.SQRT2), 'f and g');
		const eta = Math.log(abs(f) / abs(g)) / 2;
		check(near(Math.exp(2 * eta), 3) && near(Math.tanh(eta), 0.5), 'e^{2 eta} = 3, beta = 1/2');
		const Gp = boostF(G, [0, 0, 1], eta);
		check(Gp[0][0].toFixed(3) === '0.866' && near(abs(Gp[1]), 0, 1e-14) && near(abs(Gp[2]), 0) && near(Gp[0][1], 0, 1e-14), 'F\' = (0.866, 0, 0)');
	}

	// ---- the sky
	for (const z of [C(0.3, -0.8), C(-1.2, 0.4), C(0.436, 0.9)]) {
		const mz = mOf(z), q = z[0] ** 2 + z[1] ** 2, n = nOf(z);
		check(cnear(vdot(mz, mz), C(0), 1e-13), 'm(z) is not null');
		check(near(mz.reduce((s, x) => s + x[0] ** 2 + x[1] ** 2, 0), 2 * (1 + q) ** 2, 1e-12), '|m(z)|^2');
		check(vnear(rcross(n, mz), vscale([0, -1], mz), 1e-12), 'm(z) is not a wave along n(z)');
		check(near(Math.hypot(...n), 1, 1e-15), 'n(z) is not a unit vector');
	}
	{
		// the charge at rest along +x: F = (-1, 0, 0), the roots +-1, the directions +-x
		const r = roots(chargeF(0)), d = directions(0);
		check(cnear(r[0], C(1)) && cnear(r[1], C(-1)), `the roots at rest ${r}`);
		check(d[0].every((x, k) => near(x, [1, 0, 0][k])) && d[1].every((x, k) => near(x, [-1, 0, 0][k])), 'the directions at rest');
		// the charge at 0.9c: F = (-1, 0, 0.9i), z^2 - 1.8 i z - 1 = 0
		const F = chargeF(SPEED);
		check(cnear(vdot(F, F), C(1 - SPEED ** 2)), 'F.F for the moving charge');
		const R = roots(F);
		for (const z of R) {
			check(cnear(vdot(mOf(z), F), C(0), 1e-14), 'a root does not solve m(z).F = 0');
			check(cnear(sub(sub(mul(z, z), mul(C(0, 1.8), z)), C(1)), C(0), 1e-14), 'a root does not solve z^2 - 1.8iz - 1 = 0');
			check(near(abs(z), 1, 1e-15), '|z| is not 1');
		}
		check(R[0][0].toFixed(3) === '0.436' && R[1][0].toFixed(3) === '-0.436' && near(R[0][1], 0.9, 1e-15) && near(R[1][1], 0.9, 1e-15), `the roots ${R}`);
		const D = R.map(nOf);
		check(D[0][0].toFixed(3) === '0.436' && D[1][0].toFixed(3) === '-0.436' && D.every((n) => near(n[1], 0.9, 1e-15) && near(n[2], 0, 1e-15)), `the directions ${D}`);
		const half = [0, 1, 2].map((k) => (D[0][k] + D[1][k]) / 2), diff = [0, 1, 2].map((k) => (D[0][k] - D[1][k]) / 2);
		check(near(half[0], 0) && near(half[1], SPEED, 1e-15) && near(half[2], 0), `the half sum ${half}`);
		check(diff[0].toFixed(3) === '0.436' && near(diff[0], Math.sqrt(1 - SPEED ** 2), 1e-15) && near(diff[1], 0) && near(diff[2], 0), `the half difference ${diff}`);
		// the paths: at every speed from 0 to 0.9c, (+-sqrt(1 - beta^2), beta, 0), on the great circle z = 0
		for (let k = 0; k <= 90; k++) {
			const b = (SPEED * k) / 90, d2 = directions(b);
			check(near(d2[0][0], Math.sqrt(1 - b * b), 1e-14) && near(d2[1][0], -Math.sqrt(1 - b * b), 1e-14) && d2.every((n) => near(n[1], b, 1e-14) && near(n[2], 0, 1e-14)), `the paths at ${b}`);
		}
	}
	return { a: amplitude([Math.cos(E_ANGLE * rad), Math.sin(E_ANGLE * rad)]), roots: roots(chargeF(SPEED)) };
}
