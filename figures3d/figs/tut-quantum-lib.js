// Shared numbers and colours for the four diagrams of the tutorial's section 8.1 (tutorial/quantum/states.md):
// tut-quantum-hero (the hero of Part 8), tut-mach-zehnder, tut-amplitude-arrows and tut-mass-two-places. Not a figure
// itself. The colour roles are section 7.8's (figs/tut-memory-lib.js: the observer's, the curvature's, matter's and the
// field's, read from app.css by `palette(check)`); orange and blue, which mean a stretch and a squeeze, are not used.
// The sheet, strokes, labels and cropping are those of sections 6.1 to 7.8 (figs/tut-pot-lib.js), all imported, not
// copied; the ball, its stiffness and its note are section 4.1's (figs/tut-osc-lib.js).
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints (pure numbers, and SI
// for the ball):
//  - the mirror U = (1, i; i, 1)/sqrt 2 is unitary (U^dagger U = 1); U|L> = (1, i)/sqrt 2, D U|L> = (e^{i phi}, i)/sqrt 2,
//    U D U|L> = (1/2)(e^{i phi} - 1, i(e^{i phi} + 1)), by multiplying the tables, at many phases; so a particle that
//    enters along L leaves along R with P_R = cos^2(phi/2) and along L with P_L = sin^2(phi/2), every time at phi = 0,
//    half the time at pi/2, never at pi; the delay and the second mirror at pi/2 turn (1, 1)/sqrt 2 into (i, 0) and
//    (1, -1)/sqrt 2 into (0, -1);
//  - the amplitude at exit R is the sum of i e^{i phi}/2 by way of L and i/2 by way of R (each found by blocking the
//    other path), each alone giving 1/4; at phi = 0 they sum to i (P_R = 1), at phi = pi to 0 (P_R = 0); P_R =
//    1/4 + 1/4 + (1/2) cos phi; with path R blocked, 1/4 at each exit at every phi;
//  - the record: with |e_L> = (1, 0), |e_R> = (cos theta, sin theta) and the pairs in the order (L0, L1, R0, R1), the
//    second mirror's row (i, 1)/sqrt 2 on the state (e^{i phi}, 0, i cos theta, i sin theta)/sqrt 2 gives the
//    amplitudes (1/2) i (e^{i phi} + cos theta) and (1/2) i sin theta, so P_R = (1/2)(1 + cos theta cos phi) =
//    (1/2)[1 + Re(<e_R|e_L> e^{i phi})]; overlap 1: from 0 to 1; overlap 0.5 (theta = 60 degrees): from 0.25 to 0.75;
//    overlap 0 (90 degrees): 1/2 at every phi;
//  - the ball of section 4.1 at 300 K: k_B T / hbar omega at 15 kHz = 4.14 x 10^-21 J / 9.94 x 10^-30 J = 4.2 x 10^8,
//    and the same, 4.2 x 10^8, at the note computed from the ball's stiffness and effective mass (tut-osc-lib.js); the
//    thermal mean occupation 1/(e^x - 1), x = hbar omega / k_B T, differs from k_B T / hbar omega by less than one
//    quantum; hbar omega / k_B = 0.72 microkelvin, so a ball at 0.1 microkelvin holds on average 7 x 10^-4 quanta: almost none.
import { OBS, CURV, MATTER, FIELD, palette } from './tut-memory-lib.js';
import { stack } from './tut-quadrupole-lib.js';
import { KB, TEMP, K_BALL, M_BALL } from './tut-osc-lib.js';

export { OBS, CURV, MATTER, FIELD, palette, stack };

// ---- complex numbers, as [re, im] --------------------------------------------------------------------------------
export const cx = (re, im = 0) => [re, im];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
export const conj = (a) => [a[0], -a[1]];
export const scale = (a, s) => [a[0] * s, a[1] * s];
export const abs2 = (a) => a[0] * a[0] + a[1] * a[1];
export const expi = (t) => [Math.cos(t), Math.sin(t)];
const I = [0, 1];
const S2 = 1 / Math.sqrt(2);

/** A table (rows of complex numbers) times a column. */
export const apply = (T, v) => T.map((row) => row.reduce((s, t, j) => add(s, mul(t, v[j])), [0, 0]));

// ---- the interferometer ------------------------------------------------------------------------------------------
/** The mirror: through 1/sqrt 2, reflected i/sqrt 2. */
export const U = [[cx(S2), cx(0, S2)], [cx(0, S2), cx(S2)]];
/** The delay on path L. */
export const Dl = (phi) => [[expi(phi), cx(0)], [cx(0), cx(1)]];
/** The state at the exits, (amplitude L, amplitude R), for a particle that enters along `start` (default |L>). */
export const exits = (phi, start = [cx(1), cx(0)]) => apply(U, apply(Dl(phi), apply(U, start)));
/** P_R = cos^2(phi/2) and P_L = sin^2(phi/2), the chapter's boxed result. */
export const PR = (phi) => Math.cos(phi / 2) ** 2;
export const PL = (phi) => Math.sin(phi / 2) ** 2;
/** The two terms of the amplitude at exit R: by way of L (path R blocked) and by way of R (path L blocked). */
export function terms(phi) {
	const after1 = apply(U, [cx(1), cx(0)]);
	const viaL = apply(U, apply(Dl(phi), [after1[0], cx(0)]))[1];
	const viaR = apply(U, apply(Dl(phi), [cx(0), after1[1]]))[1];
	return { viaL, viaR };
}

// ---- the record --------------------------------------------------------------------------------------------------
/** P_R with the records |e_L> = (1, 0), |e_R> = (cos theta, sin theta): the four-entry state through the second mirror. */
export function recordPR(phi, theta) {
	const state = [scale(expi(phi), S2), cx(0), scale(mul(I, cx(Math.cos(theta))), S2), scale(mul(I, cx(Math.sin(theta))), S2)];
	// the second mirror acts on the mass alone: for each outcome k of the record, (L k, R k) -> U (L k, R k)
	const out = [0, 1].map((k) => apply(U, [state[k], state[2 + k]]));
	return abs2(out[0][1]) + abs2(out[1][1]);
}
/** The chapter's general form, (1/2)[1 + Re(<e_R|e_L> e^{i phi})], for a real overlap. */
export const fringe = (phi, overlap) => 0.5 * (1 + overlap * Math.cos(phi));
export const OVERLAPS = [1, 0.5, 0];

// ---- the ball ----------------------------------------------------------------------------------------------------
export const HBAR = 1.054571817e-34;       // J s
export const NOTE = 15e3;                  // Hz, the ball's note as the paper and section 4.1 give it
export const omegaOf = (f) => 2 * Math.PI * f;
/** The mean number of quanta of a mode of angular frequency w at the temperature T: 1/(e^x - 1), x = hbar w / k_B T. */
export const occupation = (w, T) => 1 / Math.expm1((HBAR * w) / (KB * T));
export const COLD = 1e-7;                  // K, a cold ball for the hero (not printed)

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
	const nearC = (a, b, tol = 1e-12) => near(a[0], b[0], tol) && near(a[1], b[1], tol);
	// ---- U is unitary: U^dagger U = 1
	for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
		const s = [0, 1].reduce((acc, k) => add(acc, mul(conj(U[k][i]), U[k][j])), [0, 0]);
		check(nearC(s, cx(i === j ? 1 : 0)), `U^dagger U is not 1 at ${i}${j}`);
	}
	// ---- the three lines of the interferometer, and the boxed result, at many phases
	for (let k = 0; k <= 96; k++) {
		const phi = (2 * Math.PI * k) / 96, e = expi(phi);
		const a = apply(U, [cx(1), cx(0)]);
		check(nearC(a[0], cx(S2)) && nearC(a[1], cx(0, S2)), 'U|L> is not (1, i)/sqrt 2');
		const b = apply(Dl(phi), a);
		check(nearC(b[0], scale(e, S2)) && nearC(b[1], cx(0, S2)), `DU|L> at ${phi}`);
		const c = exits(phi);
		check(nearC(c[0], scale(add(e, cx(-1)), 0.5)) && nearC(c[1], scale(mul(I, add(e, cx(1))), 0.5)), `UDU|L> at ${phi}`);
		check(near(abs2(c[1]), PR(phi)) && near(abs2(c[0]), PL(phi)), `P_R, P_L at ${phi}`);
		check(near(PR(phi), 0.25 + 0.25 + 0.5 * Math.cos(phi)), `P_R = 1/4 + 1/4 + cos(phi)/2 at ${phi}`);
		// the two terms
		const { viaL, viaR } = terms(phi);
		check(nearC(viaL, scale(mul(I, e), 0.5)) && nearC(viaR, cx(0, 0.5)), `the terms i e^{i phi}/2 and i/2 at ${phi}`);
		check(nearC(add(viaL, viaR), c[1]), `the terms do not add to the amplitude at exit R at ${phi}`);
		check(near(abs2(viaL), 0.25) && near(abs2(viaR), 0.25), 'each term alone does not give 1/4');
		// path R blocked: 1/4 at each exit
		const blocked = apply(U, apply(Dl(phi), [a[0], cx(0)]));
		check(near(abs2(blocked[0]), 0.25) && near(abs2(blocked[1]), 0.25), `path R blocked at ${phi}`);
		// the record: the four-entry state against the closed form, for the three overlaps and others
		for (const th of [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, 1.1]) {
			check(near(recordPR(phi, th), 0.5 * (1 + Math.cos(th) * Math.cos(phi))), `the record's P_R at ${phi}, ${th}`);
			check(near(recordPR(phi, th), fringe(phi, Math.cos(th))), 'the general form');
		}
	}
	check(near(PR(0), 1) && near(PR(Math.PI / 2), 0.5) && near(PR(Math.PI), 0), 'P_R is not 1, 1/2, 0 at 0, pi/2, pi');
	// the delay and the second mirror at pi/2
	{
		const DU = (v) => apply(U, apply(Dl(Math.PI / 2), v));
		const p = DU([cx(S2), cx(S2)]), m = DU([cx(S2), cx(-S2)]);
		check(nearC(p[0], cx(0, 1)) && nearC(p[1], cx(0)) && nearC(m[0], cx(0)) && nearC(m[1], cx(-1)), 'the device at pi/2');
	}
	// the arrows: at phi = 0 they sum to i, at pi to 0
	{
		const t0 = terms(0), tp = terms(Math.PI);
		check(nearC(add(t0.viaL, t0.viaR), cx(0, 1)) && near(abs2(add(t0.viaL, t0.viaR)), 1), 'the sum at phi = 0');
		check(nearC(tp.viaL, cx(0, -0.5)) && nearC(add(tp.viaL, tp.viaR), cx(0)), 'the sum at phi = pi');
	}
	// the fringes for the three overlaps: their least and greatest values over a turn
	const swing = OVERLAPS.map((o) => {
		let lo = Infinity, hi = -Infinity;
		for (let k = 0; k <= 3600; k++) { const v = fringe((2 * Math.PI * k) / 3600, o); lo = Math.min(lo, v); hi = Math.max(hi, v); }
		return [lo, hi];
	});
	check(near(swing[0][0], 0) && near(swing[0][1], 1), 'overlap 1 does not swing from 0 to 1');
	check(near(swing[1][0], 0.25) && near(swing[1][1], 0.75), 'overlap 0.5 does not swing from 0.25 to 0.75');
	check(near(swing[2][0], 0.5) && near(swing[2][1], 0.5), 'overlap 0 is not flat at 1/2');
	check(near(Math.cos(Math.PI / 3), 0.5, 1e-15) && near(Math.cos(Math.PI / 2), 0, 1e-15), 'theta = 60 and 90 degrees');

	// ---- the ball at 300 K
	const w = omegaOf(NOTE), quantum = HBAR * w, heat = KB * TEMP, ratio = heat / quantum;
	check(heat.toPrecision(3) === '4.14e-21' && quantum.toPrecision(3) === '9.94e-30', `k_B T ${heat}, hbar omega ${quantum}`);
	check(ratio.toPrecision(2) === '4.2e+8', `k_B T / hbar omega = ${ratio}`);
	const wBall = Math.sqrt(K_BALL / (0.3 * M_BALL));
	check((wBall / (2 * Math.PI) / 1000).toFixed(0) === '15' && (heat / (HBAR * wBall)).toPrecision(2) === '4.2e+8', 'the ball\'s own note');
	const nbar = occupation(w, TEMP);
	check(Math.abs(nbar - ratio) < 1, `the mean occupation ${nbar} is not k_B T / hbar omega within a quantum`);
	check((quantum / KB * 1e6).toFixed(2) === '0.72', `hbar omega / k_B = ${quantum / KB}`);
	const cold = occupation(w, COLD);
	check(cold.toExponential(0) === '7e-4', `the cold ball's occupation ${cold}`);
	return { ratio, nbar, cold, swing };
}
