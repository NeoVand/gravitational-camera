// Shared numbers and colours for the three diagrams of the tutorial's chapter 7.4 (tutorial/geometry/linearized-gravity.md):
// tut-gauge-or-wave, tut-linear-steps and tut-linear-hierarchy. Not a figure itself. The colour roles are chapter 7.3's
// (figs/tut-einstein-lib.js: the observer's, the curvature's and matter's, read from app.css) and the field's, app.css's
// --q-field, which chapter 1.8 first drew (figs/tut-orb-lib.js, FIELD) and which `palette(check)` here asserts with the
// others; the sheet, strokes, labels and cropping are those of chapters 6.1 to 7.3, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - the wave that is not there: zeta_x = eps cos(kx - wt) gives, by eq:gauge with partial_0 = c^-1 partial_t,
//    h'_xx = 2 eps k sin(kx - wt) and h'_0x = -(eps w / c) sin(kx - wt) (both by finite differences of zeta); with
//    eps = 1 mm and k = 1 m^-1, h'_xx reaches 2 x 10^-3, 2 x 10^18 times LIGO's 10^-21; its linearized curvature,
//    every component of 7.2's formula by finite differences, is zero, for any speed w / k; a plus wave
//    h_xx = -h_yy = h+ cos(kz - wt) travelling along z has R_0x0x = -(1/2) d_0^2 h_xx, not zero;
//  - the four steps (tut-linear-steps), on a test field: for a sum of plane waves of arbitrary amplitudes and
//    wavevectors, 7.2's curvature contracted is eq:ricci, term by term; for the same field made harmonic
//    (d^mu hbar_mu nu = 0, each amplitude projected), R_mu nu = -(1/2) box h_mu nu and G_mu nu = -(1/2) box hbar_mu nu;
//    so G = (8 pi G / c^4) T gives box hbar = -(16 pi G / c^4) T; trace reversal twice returns h;
//  - the person (tut-linear-hierarchy): 70 kg walking at 1.4 m s^-1, seen at 1 m: h_00 = 2 G M / c^2 r = 1.0 x 10^-25,
//    hbar_00 = 4 G M / c^2 r; |hbar_0i| = 4 G M v / c^3 r = 9.7 x 10^-34, smaller by 2 v / c = 9.3 x 10^-9; the motion
//    part of hbar_ij, (4 G / c^4 r) M v^2 = (v/c)^2 hbar_00 = 4.5 x 10^-42, smaller again by v / c = 4.7 x 10^-9; the
//    stress of standing, int T_zz dV ~ M g z_cm = 690 J (g = 9.8 m s^-2, z_cm = 1 m) against int rho v^2 dV = 137 J,
//    five times, so hbar_zz ~ 2 x 10^-41; water's pressure at one atmosphere, 10^-15 of its energy density and fifty
//    times rho v^2 at walking speed.
import { OBS, CURV, MATTER, ACCENT, ACCENT2, stack, palette as einsteinPalette, G, C, ATM } from './tut-einstein-lib.js';
import { FIELD } from './tut-orb-lib.js';

export { OBS, CURV, MATTER, FIELD, ACCENT, ACCENT2, stack, G, C };

// ---- the field's colour role (app.css, --q-field), light and dark -------------------------------------------------
const FIELD_ROLE = ['#0b5a59', '#04becd'];

/** The role colours against app.css, both themes: chapter 7.3's four and the field's. */
export async function palette(check) {
	await einsteinPalette(check);
	const css = await (await fetch('/app/src/app.css')).text();
	// app.css sets each role three times: the dark theme (:root), the light theme chosen, the light theme preferred
	const all = [...css.matchAll(/--q-field:\s*(#[0-9a-f]{6})/g)].map((m) => m[1]);
	check(all.join() === [FIELD_ROLE[1], FIELD_ROLE[0], FIELD_ROLE[0]].join(), `the field's colours are not app.css's: ${all}`);
	check(FIELD === `light-dark(${FIELD_ROLE[0]}, ${FIELD_ROLE[1]})`, 'the field\'s colour is not tut-orb-lib\'s');
}

// ---- linearized curvature by finite differences ------------------------------------------------------------------
/** The flat metric's diagonal, (-, +, +, +); it is its own inverse. */
export const ETA = [-1, 1, 1, 1];
const D = 1e-3;                            // the finite-difference step, in units of the test fields' lengths
const shift = (x, a, s) => x.map((v, i) => (i === a ? v + s : v));
/** d_a d_b f at x (x^0 = ct), by central differences. */
export function d2(f, x, a, b) {
	if (a === b) return (f(shift(x, a, D)) - 2 * f(x) + f(shift(x, a, -D))) / (D * D);
	const p = (s, t) => f(shift(shift(x, a, s), b, t));
	return (p(D, D) - p(D, -D) - p(-D, D) + p(-D, -D)) / (4 * D * D);
}
/** d_a f at x. */
export const d1 = (f, x, a) => (f(shift(x, a, D)) - f(shift(x, a, -D))) / (2 * D);

/** 7.2's linearized curvature of the table h(m, n, x): R_abcd = (1/2)(d_b d_c h_ad + d_a d_d h_bc - d_a d_c h_bd - d_b d_d h_ac). */
export function riemann(h, x, a, b, c, d) {
	const H = (m, n) => (y) => h(m, n, y);
	return 0.5 * (d2(H(a, d), x, b, c) + d2(H(b, c), x, a, d) - d2(H(b, d), x, a, c) - d2(H(a, c), x, b, d));
}
/** 7.3's Ricci tensor, R_mn = eta^ab R_bman. */
export const ricci = (h, x, m, n) => [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * riemann(h, x, a, m, a, n), 0);
/** The box, d^a d_a. */
export const box = (f, x) => [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * d2(f, x, a, a), 0);
/** The trace h^a_a and the trace reversal hbar_mn = h_mn - (1/2) eta_mn h^a_a, of a table h(m, n, x). */
export const traceOf = (h) => (x) => [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * h(a, a, x), 0);
export const reverse = (h) => (m, n, x) => h(m, n, x) - (m === n ? 0.5 * ETA[m] * traceOf(h)(x) : 0);

// ---- the wave that is not there ----------------------------------------------------------------------------------
export const EPS = 1e-3;                   // m
export const K = 1;                        // m^-1
export const LIGO = 1e-21;
/** The largest pure-gauge entry, 2 eps k. */
export const PURE_GAUGE = 2 * EPS * K;

// ---- the person --------------------------------------------------------------------------------------------------
export const PERSON = 70, R = 1, V = 1.4;  // kg, m, m s^-1
export const GRAV = 9.8, Z_CM = 1;         // m s^-2, m: the floor's g and the height of the centre of mass
export const BETA = V / C;
/** The person's entries a metre away, each from its own source. */
export function person() {
	const h00 = (2 * G * PERSON) / (C * C * R);
	const hbar00 = (4 * G * PERSON) / (C * C * R);
	const hbar0i = (4 * G * PERSON * V) / (C ** 3 * R);
	const motionSum = PERSON * V * V;                       // int rho v^2 dV, J
	const stressSum = PERSON * GRAV * Z_CM;                 // int T_zz dV ~ M g z_cm, J
	const motion = ((4 * G) / (C ** 4 * R)) * motionSum;    // hbar_ij from rho v_i v_j
	const stress = ((4 * G) / (C ** 4 * R)) * stressSum;    // hbar_zz from the stress of standing
	return { h00, hbar00, hbar0i, motion, stress, motionSum, stressSum };
}

/** A number to two figures, a x 10^b, as TeX with a thin multiplication sign. */
export function twoFigures(v) {
	const [m, e] = Math.abs(v).toExponential(1).split('e');
	return `${v < 0 ? '-' : ''}${m}\\times10^{${Number(e)}}`;
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const fig2 = (v) => Math.abs(v).toExponential(1);
	const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-300);

	// ---- the wave that is not there: eq:gauge on zeta_x = eps cos(kx - wt), for two speeds w / k
	for (const speed of [0.37 * C, 3.1 * C]) {
		const w = speed * K;
		// coordinates (ct, x, y, z) in metres; zeta with lower index (zeta_x = zeta^x)
		const zeta = (n) => (x) => (n === 1 ? EPS * Math.cos(K * x[1] - (w / C) * x[0]) : 0);
		const hp = (m, n, x) => -d1(zeta(n), x, m) - d1(zeta(m), x, n);
		const ph = (x) => K * x[1] - (w / C) * x[0];
		for (const x of [[0.3, 0.2, 0, 0], [1.1, -0.7, 0.4, 0.2], [0, 1.4, 0, 0]]) {
			check(near(hp(1, 1, x), 2 * EPS * K * Math.sin(ph(x)), 1e-5), `h'_xx at ${x}: ${hp(1, 1, x)}`);
			check(near(hp(0, 1, x), -((EPS * w) / C) * Math.sin(ph(x)), 1e-5), `h'_0x at ${x}: ${hp(0, 1, x)}`);
			check(Math.abs(hp(2, 2, x)) + Math.abs(hp(0, 0, x)) + Math.abs(hp(1, 2, x)) < 1e-15, 'a pure-gauge entry other than xx and 0x');
			// the curvature, every component, from the closed forms
			const h = (m, n, y) => (m === 1 && n === 1 ? 2 * EPS * K * Math.sin(ph(y)) : (m === 0 && n === 1) || (m === 1 && n === 0) ? -((EPS * w) / C) * Math.sin(ph(y)) : 0);
			const scale = EPS * K * Math.max(K, w / C) ** 2;
			let worst = 0;
			for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 4; c++) for (let d = 0; d < 4; d++) worst = Math.max(worst, Math.abs(riemann(h, x, a, b, c, d)));
			check(worst < 1e-5 * scale, `the pure gauge has curvature ${worst} at ${x}`);
		}
	}
	check(fig2(PURE_GAUGE) === '2.0e-3', `2 eps k = ${PURE_GAUGE}`);
	check(Math.round(PURE_GAUGE / LIGO / 1e18) === 2, `the pure gauge over LIGO's waves ${PURE_GAUGE / LIGO}`);
	// a plus wave along z: R_0x0x = -(1/2) d_0^2 h_xx, not zero
	{
		const hp = 1e-3, k = 2;
		const h = (m, n, y) => (m === 1 && n === 1 ? 1 : m === 2 && n === 2 ? -1 : 0) * hp * Math.cos(k * y[3] - k * y[0]);
		const x = [0.2, 0, 0, 0.5];
		const r = riemann(h, x, 0, 1, 0, 1);
		check(near(r, -0.5 * d2((y) => h(1, 1, y), x, 0, 0), 1e-6) && near(r, 0.5 * k * k * hp * Math.cos(k * 0.5 - k * 0.2), 1e-5), `the plus wave's R_0x0x ${r}`);
		check(Math.abs(r) > 0.1 * k * k * hp, 'the plus wave has no curvature');
	}

	// ---- the four steps, on test fields: a sum of plane waves, arbitrary amplitudes and wavevectors (not null)
	{
		const waves = [
			{ k: [0.7, 1.1, -0.4, 0.3], A: [[0.3, -0.2, 0.5, 0.1], [0, 0.4, -0.3, 0.2], [0, 0, -0.6, 0.25], [0, 0, 0, 0.15]] },
			{ k: [-0.5, 0.2, 0.9, -1.3], A: [[-0.4, 0.1, 0.2, -0.35], [0, 0.55, 0.05, -0.1], [0, 0, 0.2, 0.3], [0, 0, 0, -0.45]] }
		].map(({ k, A }) => ({ k, A: A.map((row, m) => row.map((_, n) => (n >= m ? A[m][n] : A[n][m]))) }));
		const kx = (k, x) => k.reduce((s, v, i) => s + v * x[i], 0);
		const tableOf = (ws) => (m, n, x) => ws.reduce((s, { k, A }) => s + A[m][n] * Math.cos(kx(k, x)), 0);
		const x0 = [0.3, -0.8, 0.45, 1.2];
		const general = tableOf(waves);
		const up = (h) => (a, n, x) => ETA[a] * h(a, n, x);              // h^a_n
		const eqRicci = (h, x, m, n) => {
			const t = traceOf(h);
			let s = -box((y) => h(m, n, y), x) - d2(t, x, m, n);
			for (let a = 0; a < 4; a++) s += d2((y) => up(h)(a, n, y), x, a, m) + d2((y) => up(h)(a, m, y), x, a, n);
			return 0.5 * s;
		};
		const big = Math.max(...[0, 1, 2, 3].flatMap((m) => [0, 1, 2, 3].map((n) => Math.abs(ricci(general, x0, m, n)))));
		for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++)
			check(Math.abs(ricci(general, x0, m, n) - eqRicci(general, x0, m, n)) < 1e-5 * big, `eq:ricci fails at ${m}${n}`);
		// harmonic: project each wave's trace-reversed amplitude, Abar_mn -> Abar_mn with k^m Abar_mn = 0, then reverse back
		const harmonicWaves = waves.map(({ k, A }) => {
			const kup = k.map((v, i) => ETA[i] * v), kk = k.reduce((s, v, i) => s + ETA[i] * v * v, 0);
			const tr = A.reduce((s, row, a) => s + ETA[a] * row[a], 0);
			const Abar = A.map((row, m) => row.map((v, n) => v - (m === n ? 0.5 * ETA[m] * tr : 0)));
			// P_m^a = delta - k_m k^a / kk; Abar' = P Abar P^T keeps it symmetric with k^m Abar'_mn = 0
			const P = [0, 1, 2, 3].map((m) => [0, 1, 2, 3].map((a) => (m === a ? 1 : 0) - (k[m] * kup[a]) / kk));
			const Ab = [0, 1, 2, 3].map((m) => [0, 1, 2, 3].map((n) => {
				let s = 0;
				for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) s += P[m][a] * P[n][b] * Abar[a][b];
				return s;
			}));
			const trb = Ab.reduce((s, row, a) => s + ETA[a] * row[a], 0);
			return { k, A: Ab.map((row, m) => row.map((v, n) => v - (m === n ? 0.5 * ETA[m] * trb : 0))) };
		});
		const h = tableOf(harmonicWaves), hbar = reverse(h);
		// the gauge holds: d^m hbar_mn = 0
		for (let n = 0; n < 4; n++) {
			const div = [0, 1, 2, 3].reduce((s, m) => s + ETA[m] * d1((y) => hbar(m, n, y), x0, m), 0);
			check(Math.abs(div) < 1e-6, `the test field is not harmonic: ${div}`);
		}
		// reversing twice returns h
		for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) check(Math.abs(reverse(hbar)(m, n, x0) - h(m, n, x0)) < 1e-12, 'reversing twice does not return h');
		const R = (m, n) => ricci(h, x0, m, n);
		const Rs = [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * R(a, a), 0);
		const scale = Math.max(...[0, 1, 2, 3].flatMap((m) => [0, 1, 2, 3].map((n) => Math.abs(R(m, n)))));
		check(scale > 0.1, 'the harmonic test field has no curvature');
		for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) {
			check(Math.abs(R(m, n) + 0.5 * box((y) => h(m, n, y), x0)) < 1e-5 * scale, `R_mn = -(1/2) box h_mn fails at ${m}${n}`);
			const Gmn = R(m, n) - (m === n ? 0.5 * ETA[m] * Rs : 0);
			check(Math.abs(Gmn + 0.5 * box((y) => hbar(m, n, y), x0)) < 1e-5 * scale, `G_mn = -(1/2) box hbar_mn fails at ${m}${n}`);
		}
		check(Math.abs(Rs + 0.5 * box(traceOf(h), x0)) < 1e-5 * scale, 'R = -(1/2) box h^a_a fails');
	}
	// the factor: 2 x 8 pi G / c^4 = 16 pi G / c^4, in N^-1
	check(Math.abs((2 * 8 * Math.PI * G) / C ** 4 - (16 * Math.PI * G) / C ** 4) < 1e-60, 'twice 8 pi G / c^4 is not 16 pi G / c^4');

	// ---- the person
	const p = person();
	check(fig2(p.h00) === '1.0e-25', `h_00 = ${p.h00}`);
	check(fig2(p.hbar0i) === '9.7e-34', `|hbar_0i| = ${p.hbar0i}`);
	check(fig2(p.hbar0i / p.h00) === '9.3e-9' && near(p.hbar0i / p.h00, 2 * BETA, 1e-12), `hbar_0i / h_00 = ${p.hbar0i / p.h00}`);
	check(fig2(BETA) === '4.7e-9', `v / c = ${BETA}`);
	check(fig2(p.motion) === '4.5e-42' && near(p.motion, BETA * BETA * p.hbar00, 1e-12), `the motion part ${p.motion}`);
	check(near(p.motion / p.hbar0i, BETA, 1e-12), 'the motion part is not v / c below hbar_0i');
	check(Math.round(p.stressSum / 10) * 10 === 690 && Math.round(p.motionSum) === 137, `the sums ${p.stressSum} J and ${p.motionSum} J`);
	check(Math.round(p.stress / p.motion) === 5, `the stress over the motion part ${p.stress / p.motion}`);
	check(p.stress.toExponential(0) === '2e-41', `the stress of standing ${p.stress}`);
	// "eight orders of magnitude": one factor of v / c
	check(Math.round(-Math.log10(BETA)) === 8, `v / c is ${Math.log10(BETA)} decades`);
	// water at one atmosphere: p / rho c^2 = 10^-15, and fifty times rho v^2 at walking speed
	check((ATM / (1000 * C * C)).toExponential(0) === '1e-15', `water's p / rho c^2 ${ATM / (1000 * C * C)}`);
	check(Math.round(ATM / (1000 * V * V) / 10) * 10 === 50, `water's p / rho v^2 ${ATM / (1000 * V * V)}`);

	return { pureGauge: PURE_GAUGE, person: p, beta: BETA };
}
