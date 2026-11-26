// Shared numbers and colours for the five figures of the tutorial's section 6.1 (tutorial/relativity/lorentz.md):
// the hero tut-lorentz-hero and the diagrams tut-lorentz-axes, tut-lorentz-light-clock, tut-lorentz-rstar and
// tut-lorentz-hyperbola. Not a figure itself. The sheet, the strokes, the labels and the cropping are section 1.2's
// (figs/tut-pot-lib.js), the axes section 3.1's (figs/tut-prob-lib.js), the sampling of curves section 2.6's
// (figs/tut-fourier-lib.js), the fitted dashed line section 1.8's (figs/tut-orb-lib.js), the dimension line chapter
// 5.5's (figs/tut-rad-lib.js) and matter's colour section 2.4's (figs/tut-null-lib.js), all imported, not copied.
//
// The colours are the chapter's own colour roles (app.css, --q-obs and --q-light; app/src/lib/tutorial/colour.ts,
// palette A), light and dark: the moving observer, the pixel, its axes, its velocity and its rapidity in the
// observer's colour, as the chapter colours v, beta, gamma, tau and eta; the paths of light in the light role's
// colour; a body that gravitates in matter's. `palette(check)` reads app.css and asserts that the three are its
// values. Everything else is neutral, as the comments ask.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints: beta = 0.6,
// gamma = 1.25, gamma beta = 0.75 and the tilt arctan 0.6 = 31.0 degrees; the boost (eq:lorentz) as a table, its
// inverse, and that it keeps -c^2 t^2 + x^2; the pixel's unit ticks at (x, ct) = (0.75, 1.25) on ct' and (1.25, 0.75)
// on x', each one unit of interval from the origin and at ct' = 1, x' = 0 and ct' = 0, x' = 1; the two flashes A at
// (0, 0) and B at (1, 0) light-second, and B's slice ct = 0.6 x - 0.6, on every point of which t' = -0.75 s; the light
// clock's 3 : 4 : 5 triangle, v dt/2 : L : c dt/2 = gamma beta : 1 : gamma = 0.75 : 1 : 1.25, and the 8 seconds
// against 10; R* = sqrt(gamma^2 r_par^2 + r_perp^2) = sqrt(1.5^2 + 1.6^2) = 2.19 m for r = (1.2, 1.6) m, r = 2.0 m,
// also from the cross product, gamma^2 (r^2 - |v x r|^2 / c^2); the rapidity ln 2 of 0.6c, e^{2 eta} = 4, two boosts
// ln 4, tanh(ln 4) = 15/17 = 0.882 = (0.6 + 0.6)/(1 + 0.36), and the hyperbola's points (sinh eta, cosh eta) for
// eta = 0, ln 2 and ln 4: (0, 1), (0.75, 1.25) and (1.875, 2.125), each at -c^2 t^2 + x^2 = -1.
import { MATTER } from './tut-null-lib.js';

export { MATTER };

// ---- the colour roles (app.css), light and dark -----------------------------------------------------------------
export const ROLE = {
	obs: ['#9b2d7f', '#e26c8c'],
	light: ['#256b00', '#86bd54'],
	matter: ['#533f03', '#f1dc86']
};
const both = ([day, night]) => `light-dark(${day}, ${night})`;
export const OBS = both(ROLE.obs);         // the observer's colour: the pixel, its axes, its speed and rapidity
export const LIGHT = both(ROLE.light);     // the light role's colour: the paths of light

/** The three role colours against app.css, both themes. */
export async function palette(check) {
	// app.css sets each role three times: the dark theme (:root), the light theme chosen, the light theme preferred
	const css = await (await fetch('/app/src/app.css')).text();
	for (const [key, [d, n]] of Object.entries(ROLE)) {
		const all = [...css.matchAll(new RegExp(`--q-${key}:\\s*(#[0-9a-f]{6})`, 'g'))].map((m) => m[1]);
		check(all.join() === [n, d, d].join(), `the ${key} role's colours are not app.css's: ${all}`);
	}
	check(MATTER === both(ROLE.matter), 'matter\'s colour is not tut-null-lib\'s');
}

// ---- the pixel's motion ----------------------------------------------------------------------------------------
export const BETA = 0.6;
export const GAMMA = 1 / Math.sqrt(1 - BETA * BETA);
export const ETA = Math.atanh(BETA);
/** The tilt of a moving worldline from the vertical, and of its slice from the horizontal, degrees. */
export const TILT = (Math.atan(BETA) * 180) / Math.PI;

/** eq:lorentz: the event (ct, x) of the room in the frame moving at beta c along x. */
export const boost = ([ct, x], b = BETA) => { const g = 1 / Math.sqrt(1 - b * b); return [g * (ct - b * x), g * (x - b * ct)]; };
/** The interval -c^2 t^2 + x^2 of the event (ct, x) from the origin. */
export const interval = ([ct, x]) => -ct * ct + x * x;

// ---- the diagram of the axes, light-seconds ------------------------------------------------------------------------
export const A = [0, 0];                   // the flashes, (x, ct)
export const B = [1, 0];
/** B's slice, the pixel's "now" through B: ct = beta x - beta (gamma beta = 0.75 s earlier than A's). */
export const slice = (x) => BETA * x - BETA;
export const UNIT_T = [GAMMA * BETA, GAMMA];        // the tick on ct', (x, ct)
export const UNIT_X = [GAMMA, GAMMA * BETA];        // the tick on x'

// ---- the light clock, the comment's site pixels -------------------------------------------------------------------
export const CLOCK = { L: 160, run: 120, path: 200 };

// ---- the distance in the body's frame, metres --------------------------------------------------------------------
export const R_BODY = [1.2, 1.6];          // r: the body from the pixel at the pixel's now, (r_par, r_perp)
export const rstar = ([par, perp], b = BETA) => Math.hypot(par / Math.sqrt(1 - b * b), perp);

// ---- the hyperbola, units of c tau ------------------------------------------------------------------------------------
export const RAPIDITIES = [0, Math.log(2), Math.log(4)];
export const onHyperbola = (eta) => [Math.sinh(eta), Math.cosh(eta)];    // (x, ct)

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- beta, gamma, the tilt
	check(near(GAMMA, 1.25, 1e-15) && near(GAMMA * BETA, 0.75, 1e-15) && near(1 - BETA * BETA, 0.64, 1e-15), `gamma ${GAMMA}`);
	check(TILT.toFixed(1) === '31.0' && near(Math.tan((TILT * Math.PI) / 180), BETA, 1e-15), `the tilt ${TILT}`);
	// the room's time of 10 years is the traveller's 8
	check(near(10 / GAMMA, 8, 1e-14), 'the 8 years against 10');
	// ---- the boost: its table, its inverse (beta -> -beta), and the interval it keeps
	for (const e of [[1, 0], [0, 1], [0.3, -1.7], [2.2, 0.4]]) {
		const p = boost(e), back = boost(p, -BETA);
		check(near(back[0], e[0], 1e-14) && near(back[1], e[1], 1e-14), `the inverse boost at ${e}`);
		check(near(interval(p), interval(e), 1e-13), `the interval is not kept at ${e}`);
	}
	{
		const [ct, x] = [1.3, -0.4], p = boost([ct, x]);
		check(near(p[0], 1.25 * ct - 0.75 * x, 1e-15) && near(p[1], 1.25 * x - 0.75 * ct, 1e-15), 'ct\' = 1.25 ct - 0.75 x, x\' = 1.25 x - 0.75 ct');
	}
	// ---- the pixel's axes: x' = 0 along x = beta ct, t' = 0 along ct = beta x; the unit ticks
	for (const s of [-1.2, 0.5, 1.8]) {
		check(near(boost([s, BETA * s])[1], 0, 1e-15), `x' = 0 is not x = 0.6 ct at ${s}`);
		check(near(boost([BETA * s, s])[0], 0, 1e-15), `t' = 0 is not ct = 0.6 x at ${s}`);
	}
	check(near(UNIT_T[0], 0.75, 1e-15) && near(UNIT_T[1], 1.25, 1e-15) && near(UNIT_X[0], 1.25, 1e-15) && near(UNIT_X[1], 0.75, 1e-15), 'the ticks are not at (0.75, 1.25) and (1.25, 0.75)');
	{
		const t = boost([UNIT_T[1], UNIT_T[0]]), x = boost([UNIT_X[1], UNIT_X[0]]);
		check(near(t[0], 1, 1e-15) && near(t[1], 0, 1e-15) && near(x[0], 0, 1e-15) && near(x[1], 1, 1e-15), 'the ticks are not at ct\' = 1 and x\' = 1');
		check(near(interval([UNIT_T[1], UNIT_T[0]]), -1, 1e-15) && near(interval([UNIT_X[1], UNIT_X[0]]), 1, 1e-15), 'the ticks are not one unit of interval out');
		// each tick is the tilt of its axis on the hyperbola: (sinh eta, cosh eta) and (cosh eta, sinh eta)
		check(near(UNIT_T[0], Math.sinh(ETA), 1e-15) && near(UNIT_T[1], Math.cosh(ETA), 1e-15), 'the tick on ct\' is not (sinh eta, cosh eta)');
	}
	// ---- the flashes: A at the origin, B a light-second along; B's slice and its t'
	check(near(boost([A[1], A[0]])[0], 0, 0), 'A is not at t\' = 0');
	check(near(boost([B[1], B[0]])[0], -0.75, 1e-15) && near(slice(B[0]), B[1], 1e-15), 'B is not at t\' = -0.75 s on its slice');
	for (const x of [-1, -0.3, 0, 0.7, 1, 1.5, 1.8]) check(near(boost([slice(x), x])[0], -0.75, 1e-15), `t' on B's slice at x = ${x}`);
	check(near(-GAMMA * BETA * 1, -0.75, 1e-15), 'dt\' = -gamma beta dx/c');
	// ---- the light clock: up the side of 160, along 120, the path 200; 3 : 4 : 5 and 0.75 : 1 : 1.25
	{
		const { L, run, path } = CLOCK;
		check(Math.hypot(run, L) === path && run / 40 === 3 && L / 40 === 4 && path / 40 === 5, 'the triangle is not 3 : 4 : 5');
		check(near(run / L, GAMMA * BETA, 1e-15) && near(path / L, GAMMA, 1e-15), 'the triangle is not gamma beta : 1 : gamma');
		// (c dt/2)^2 = L^2 + (v dt/2)^2 with dt = gamma 2L/c: c dt/2 = gamma L, v dt/2 = gamma beta L
		check(near((GAMMA * L) ** 2, L * L + (GAMMA * BETA * L) ** 2, 1e-9), 'Pythagoras of the light clock');
	}
	// ---- R*: 2.19 m in the body's frame against r = 2.0 m
	{
		const [par, perp] = R_BODY, r = Math.hypot(par, perp), R = rstar(R_BODY);
		check(near(r, 2, 1e-15) && near(GAMMA * par, 1.5, 1e-15) && R.toFixed(2) === '2.19' && near(R, Math.hypot(1.5, 1.6), 1e-15), `R* ${R}`);
		// gamma^2 (r^2 - |v x r|^2/c^2), |v x r|/c = beta r_perp
		check(near(GAMMA ** 2 * (r * r - (BETA * perp) ** 2), R * R, 1e-14), 'R* from the cross product');
		check(near(rstar([0, 1]), 1, 1e-15) && near(rstar([1, 0]), 1.25, 1e-15), 'R* across and along the motion');
	}
	// ---- the rapidity: ln 2 for 0.6c, ln 4 for two boosts, 0.882c
	check(near(ETA, Math.log(2), 1e-15) && near(Math.exp(2 * ETA), 4, 1e-14) && ETA.toFixed(3) === '0.693', `the rapidity ${ETA}`);
	{
		const twice = (BETA + BETA) / (1 + BETA * BETA);
		check(near(Math.tanh(Math.log(4)), 15 / 17, 1e-15) && near(twice, 15 / 17, 1e-15) && twice.toFixed(3) === '0.882', `two boosts ${twice}`);
		check(Math.atanh(0.9).toFixed(2) === '1.47' && Math.atanh(0.99).toFixed(2) === '2.65', 'the rapidities of 0.9c and 0.99c');
	}
	const points = RAPIDITIES.map(onHyperbola);
	const want = [[0, 1], [0.75, 1.25], [1.875, 2.125]];
	points.forEach((p, i) => {
		check(near(p[0], want[i][0], 1e-14) && near(p[1], want[i][1], 1e-14), `the hyperbola's point ${i}: ${p}`);
		check(near(interval([p[1], p[0]]), -1, 1e-14), `the point ${i} is off the hyperbola`);
		check(near(Math.tanh(RAPIDITIES[i]), p[0] / p[1], 1e-15), `the time axis through the point ${i} is not at tanh eta`);
	});
	check(near(RAPIDITIES[2] - RAPIDITIES[1], RAPIDITIES[1] - RAPIDITIES[0], 1e-15), 'the steps are not equal in rapidity');
	return { gamma: GAMMA, tilt: TILT, eta: ETA, rstar: rstar(R_BODY), points };
}
