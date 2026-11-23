// Shared numbers for the three diagrams of the tutorial's chapter 6.2 (tutorial/relativity/spacetime-vectors.md):
// tut-vectors-kinds, tut-vectors-hyperbola and tut-vectors-gradient. Not a figure itself. The colours, the pixel's
// speed and the boost are chapter 6.1's (figs/tut-lorentz-lib.js: the observer's colour and the light role's, read from
// app.css's --q-obs and --q-light), and the sheet, strokes, labels and cropping are those of 6.1's diagrams, all
// imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, from the dot
// product eta_{mu nu} a^mu b^nu = -a^0 b^0 + a^1 b^1 (the time and x components; y and z are zero throughout):
//  - the three kinds: (x, ct) = (0.75, 1.25) has a.a = -1, (1.25, 1.25) has a.a = 0 and (1, 0) has a.a = +1, in
//    light-seconds squared; the two flashes' step is one light-second squared, 8.99 x 10^16 m^2, and for the pixel at
//    0.6c it is (-0.75, 1.25), with -0.5625 + 1.5625 = 1 again;
//  - the four-velocities: (u^1, u^0)/c = (0, 1) at rest and (0.75, 1.25) at 0.6c, each with u.u = -c^2; the pixel's
//    now along (1.25, 0.75), with u.a = 0, the line ct = 0.6 x, the mirror image of u across the light line, the
//    segment between the two at right angles to that line with its middle (1, 1) on it; u_mu = (-1.25c, 0.75c), and
//    in the pixel's own frame u'_mu = (-c, 0);
//  - the gradient: f = 2x - ct, d_mu f = (-1, 2), a^mu = (0, 1.5), d_mu f a^mu = 3; for the pixel, the inverse
//    table's entries 1.25 and 0.75, d'_mu f = (0.25, 1.75), a'^mu = (-1.125, 1.875) and the pairing 3 again, and
//    f = 1.75 x' + 0.25 ct' at every event.
import { OBS, LIGHT, palette, BETA, GAMMA, boost } from './tut-lorentz-lib.js';

export { OBS, LIGHT, palette, BETA, GAMMA, boost };

/** The dot product of eq:metric for (time, x) components: -a0 b0 + a1 b1. */
export const dot = ([a0, a1], [b0, b1]) => -a0 * b0 + a1 * b1;

// ---- the three kinds, (x, ct) in light-seconds, as the figure draws them -----------------------------------------
export const KINDS = {
	time: [GAMMA * BETA, GAMMA],          // a step along the worldline of a clock at 0.6c, one second of its time
	null: [GAMMA, GAMMA],                 // on the cone
	space: [1, 0]                          // chapter 6.1's flash B, from A at the origin
};
/** a.a of a step drawn at (x, ct). */
export const square = ([x, ct]) => dot([ct, x], [ct, x]);

// ---- the four-velocities, (u^1, u^0) in units of c --------------------------------------------------------------
export const U_REST = [0, 1];
export const U_PIXEL = [GAMMA * BETA, GAMMA];
/** The pixel's now: the direction of the steps a with u.a = 0, (u^1, u^0) = (gamma, gamma beta). */
export const NOW_PIXEL = [GAMMA, GAMMA * BETA];

// ---- the gradient, light-seconds ----------------------------------------------------------------------------------
/** f = 2x - ct, x and ct in light-seconds. */
export const f = ([ct, x]) => 2 * x - ct;
export const GRAD = [-1, 2];            // d_mu f, (time, x)
export const STEP = [0, 1.5];           // a^mu, (time, x)
/** The inverse boost's table, Lambda^{-1} (the boost with -beta), as rows (time, x). */
export const INVERSE = [[GAMMA, GAMMA * BETA], [GAMMA * BETA, GAMMA]];
/** d'_mu f = (Lambda^{-1})^nu_mu d_nu f. */
export const GRAD_PIXEL = [0, 1].map((m) => INVERSE[0][m] * GRAD[0] + INVERSE[1][m] * GRAD[1]);
export const STEP_PIXEL = boost(STEP);
/** f in the pixel's coordinates: d'_mu f x'^mu. */
export const fPixel = ([ct, x]) => GRAD_PIXEL[0] * ct + GRAD_PIXEL[1] * x;
export const LEVELS = [-1, 0, 1, 2, 3, 4];

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	const C = 2.998e8;
	// ---- the three kinds
	check(near(square(KINDS.time), -1, 1e-14) && near(KINDS.time[0], 0.75, 1e-15) && near(KINDS.time[1], 1.25, 1e-15), `time-like ${square(KINDS.time)}`);
	check(square(KINDS.null) === 0 && near(KINDS.null[0], 1.25, 1e-15), `null ${square(KINDS.null)}`);
	check(square(KINDS.space) === 1, `space-like ${square(KINDS.space)}`);
	// the time-like step runs along the clock's worldline x = 0.6 ct, and is one second of the clock's own time
	check(near(KINDS.time[0] / KINDS.time[1], BETA, 1e-15) && near(Math.sqrt(-square(KINDS.time)), 1, 1e-14), 'the clock\'s step');
	// inside, on and outside the cone: |x| < |ct|, = and >
	check(Math.abs(KINDS.time[0]) < Math.abs(KINDS.time[1]) && KINDS.null[0] === KINDS.null[1] && KINDS.space[0] > Math.abs(KINDS.space[1]), 'the kinds against the cone');
	// the two flashes: one light-second squared, 8.99e16 m^2; for the pixel (-0.75, 1.25), -0.5625 + 1.5625 = 1
	check((C ** 2).toExponential(2) === '8.99e+16', 'one light-second squared');
	{
		const p = boost([0, 1]);
		check(near(p[0], -0.75, 1e-15) && near(p[1], 1.25, 1e-15) && near(dot(p, p), 1, 1e-14), `the flashes for the pixel ${p}`);
		check(near(-(p[0] ** 2), -0.5625, 1e-15) && near(p[1] ** 2, 1.5625, 1e-15), 'the squares 0.5625 and 1.5625');
	}
	// a clock at rest that ticks once a second: the same size, the opposite sign
	check(dot([1, 0], [1, 0]) === -1, 'the clock at rest');
	// ---- the four-velocities
	for (const [u, name] of [[U_REST, 'at rest'], [U_PIXEL, 'at 0.6c']]) check(near(dot([u[1], u[0]], [u[1], u[0]]), -1, 1e-14), `u.u ${name}`);
	check(near(U_PIXEL[0], 0.75, 1e-15) && near(U_PIXEL[1], 1.25, 1e-15), 'u at 0.6c is not (0.75c, 1.25c)');
	check(near(dot([U_PIXEL[1], U_PIXEL[0]], [NOW_PIXEL[1], NOW_PIXEL[0]]), 0, 1e-15) && near(NOW_PIXEL[0], 1.25, 1e-15) && near(NOW_PIXEL[1], 0.75, 1e-15), 'the pixel\'s now is not (1.25, 0.75)');
	check(near(NOW_PIXEL[1] / NOW_PIXEL[0], BETA, 1e-15), 'the pixel\'s now is not ct = 0.6 x');
	check(dot([U_REST[1], U_REST[0]], [0, 1]) === 0, 'the rest observer\'s now is not the x axis');
	// the mirror: (u^1, u^0) and (u^0, u^1) across u^0 = u^1; their segment at right angles to it, its middle on it
	check(NOW_PIXEL[0] === U_PIXEL[1] && NOW_PIXEL[1] === U_PIXEL[0], 'the now is not the mirror image of u');
	{
		const d = [NOW_PIXEL[0] - U_PIXEL[0], NOW_PIXEL[1] - U_PIXEL[1]], mid = [(NOW_PIXEL[0] + U_PIXEL[0]) / 2, (NOW_PIXEL[1] + U_PIXEL[1]) / 2];
		check(near(d[0] + d[1], 0, 1e-15) && near(mid[0], 1, 1e-15) && near(mid[1], 1, 1e-15), 'the mirror segment');
	}
	// lowering: u_mu = (-1.25c, 0.75c), u_mu u^mu = -1.5625 + 0.5625 = -1; in its own frame u'_mu = (-c, 0)
	{
		const low = [-U_PIXEL[1], U_PIXEL[0]];
		check(near(low[0], -1.25, 1e-15) && near(low[0] * U_PIXEL[1] + low[1] * U_PIXEL[0], -1, 1e-14), 'u lowered');
		const own = [0, 1].map((m) => INVERSE[0][m] * low[0] + INVERSE[1][m] * low[1]);
		check(near(own[0], -1, 1e-14) && near(own[1], 0, 1e-15), `u'_mu ${own}`);
	}
	// ---- the gradient
	check(GRAD[0] === -1 && GRAD[1] === 2 && f([1, 0]) === GRAD[0] && f([0, 1]) === GRAD[1], 'd_mu f is not (-1, 2)');
	check(GRAD[0] * STEP[0] + GRAD[1] * STEP[1] === 3 && f(STEP) === 3 && f([0, 0]) === 0, 'the room\'s pairing is not 3');
	check(INVERSE[0][0] === 1.25 && near(INVERSE[0][1], 0.75, 1e-15), 'the inverse table is not 1.25 and 0.75');
	// the inverse table undoes the boost
	for (const e of [[1, 0], [0, 1], [0.4, -1.3]]) {
		const p = boost(e), back = [INVERSE[0][0] * p[0] + INVERSE[0][1] * p[1], INVERSE[1][0] * p[0] + INVERSE[1][1] * p[1]];
		check(near(back[0], e[0], 1e-14) && near(back[1], e[1], 1e-14), `the inverse table at ${e}`);
	}
	check(near(GRAD_PIXEL[0], 0.25, 1e-15) && near(GRAD_PIXEL[1], 1.75, 1e-15), `d'_mu f ${GRAD_PIXEL}`);
	check(near(STEP_PIXEL[0], -1.125, 1e-15) && near(STEP_PIXEL[1], 1.875, 1e-15), `a'^mu ${STEP_PIXEL}`);
	{
		const pair = GRAD_PIXEL[0] * STEP_PIXEL[0] + GRAD_PIXEL[1] * STEP_PIXEL[1];
		check(near(pair, 3, 1e-14) && near(GRAD_PIXEL[0] * STEP_PIXEL[0], -0.28125, 1e-15), `the pixel's pairing ${pair}`);
	}
	// f is one function: 1.75 x' + 0.25 ct' at the boosted event equals 2x - ct at the event
	for (const e of [[0, 0], [1, 0], [0, 1], [-0.8, 2.3], [1.4, -0.6]]) check(near(fPixel(boost(e)), f(e), 1e-14), `f at ${e}`);
	return { grad: GRAD_PIXEL, step: STEP_PIXEL };
}
