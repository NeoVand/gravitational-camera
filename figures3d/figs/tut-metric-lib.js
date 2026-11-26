// Shared numbers and colours for the three diagrams of the tutorial's section 7.1 (tutorial/geometry/metric.md):
// tut-metric-tossed, tut-metric-clocks and tut-metric-count. Not a figure itself. The observer's colour and the light
// role's are section 6.1's (figs/tut-lorentz-lib.js, read from app.css's --q-obs and --q-light), and the sheet,
// strokes, labels and cropping are those of sections 6.1 to 6.4, all imported, not copied. This file adds the
// curvature's colour, app.css's --q-curv, which `palette(check)` asserts with the other roles.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints:
//  - the tossed clock: z(t) = (1/2) g t (T - t) with g = 9.81 m s^-2 and T = 2 s, peak g T^2 / 8 = 4.905 m (printed
//    4.91), v = g (T/2 - t); the gain (1/c^2) int_0^T (g z - v^2/2) dt, integrated numerically, equals
//    g^2 T^3 / 24 c^2 = 3.57 x 10^-16 s; the path a z(t) gains (2a - a^2) times as much, 2.68 x 10^-16 s for a = 1/2
//    and 3/2 (peaks 2.45 and 7.36 m), 0 for a = 0, and a = 1 gains most;
//  - the count: 10 values of a symmetric table of four rows, 10 x 4 = 40 first derivatives, 10 x 10 = 100 second;
//    A has 16 numbers, 10 conditions and 6 left (3 turns and 3 boosts), B 4 x 10 = 40, C 4 x 20 = 80; 100 - 80 = 20.
import { OBS, LIGHT, palette as roles } from './tut-lorentz-lib.js';

export { OBS, LIGHT };

// ---- the curvature's colour role (app.css, --q-curv), light and dark ---------------------------------------------------
const CURV_ROLE = ['#4d1c7b', '#968ff7'];
export const CURV = `light-dark(${CURV_ROLE[0]}, ${CURV_ROLE[1]})`;

/** The role colours against app.css, both themes: section 6.1's three and the curvature's. */
export async function palette(check) {
	await roles(check);
	const css = await (await fetch('/app/src/app.css')).text();
	// app.css sets each role three times: the dark theme (:root), the light theme chosen, the light theme preferred
	const all = [...css.matchAll(/--q-curv:\s*(#[0-9a-f]{6})/g)].map((m) => m[1]);
	check(all.join() === [CURV_ROLE[1], CURV_ROLE[0], CURV_ROLE[0]].join(), `the curvature's colours are not app.css's: ${all}`);
}

// ---- the tossed clock, SI ------------------------------------------------------------------------------------------
export const G = 9.81;                     // m s^-2
export const T = 2;                        // s
export const C = 299792458;                // m s^-1
export const SCALES = [0, 0.5, 1, 1.5];    // a: the paths a z(t); 0 stays on the ground, 1 falls freely
/** The height of the path a at the time t, metres. */
export const height = (a, t) => a * 0.5 * G * t * (T - t);
/** Its speed, m s^-1. */
export const speed = (a, t) => a * G * (T / 2 - t);
/** The gain (1/c^2) int (g z - v^2/2) dt of the path a over the ground clock, seconds, by Simpson's rule. */
export function gain(a, n = 4000) {
	const f = (t) => G * height(a, t) - 0.5 * speed(a, t) ** 2;
	const h = T / n;
	let s = f(0) + f(T);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(i * h);
	return (s * h) / 3 / (C * C);
}
/** eq:tossed: g^2 T^3 / 24 c^2. */
export const TOSSED = (G * G * T ** 3) / (24 * C * C);
/** The gain in units of 10^-16 s, as the figure prints it. */
export const printed = (a) => (Math.abs(gain(a)) < 1e-30 ? '0' : (gain(a) / 1e-16).toFixed(2));
/** A peak, metres, rounded half up to two places. */
export const peakPrinted = (a) => (Math.round(height(a, T / 2) * 100 + 1e-9) / 100).toFixed(2);

// ---- the count ---------------------------------------------------------------------------------------------------
/** The number of unordered k-tuples of n values (multisets): (n + k - 1 choose k). */
export function multisets(n, k) {
	let r = 1;
	for (let i = 1; i <= k; i++) r = (r * (n + i - 1)) / i;
	return r;
}
export const N = 4;                                   // coordinates
export const VALUES = multisets(N, 2);                // the metric's entries, symmetric: 10
export const FIRST = VALUES * N;                      // 40
export const SECOND = VALUES * multisets(N, 2);       // 100
export const A_NUMBERS = N * N;                       // 16
export const B_NUMBERS = N * multisets(N, 2);         // 40
export const C_NUMBERS = N * multisets(N, 3);         // 80
export const KEPT = A_NUMBERS - VALUES;               // 6: the changes that keep eta
export const LEFT = SECOND - C_NUMBERS;               // 20

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the tossed clock
	check(near(height(1, T / 2), 4.905, 1e-12) && near(height(1, T / 2), (G * T * T) / 8, 1e-12), 'the peak is not gT^2/8 = 4.905 m');
	check(peakPrinted(1) === '4.91' && peakPrinted(0.5) === '2.45' && peakPrinted(1.5) === '7.36', `the peaks ${SCALES.map(peakPrinted)}`);
	check(height(1, 0) === 0 && height(1, T) === 0, 'the path does not start and end on the ground');
	// the speed is the derivative of the height
	for (const t of [0.1, 0.7, 1.3, 1.9]) check(near(speed(1, t), (height(1, t + 1e-6) - height(1, t - 1e-6)) / 2e-6, 1e-6), `v at ${t}`);
	check(near(TOSSED, 3.5692e-16, 5e-21) && (TOSSED / 1e-16).toFixed(2) === '3.57', `the gain ${TOSSED}`);
	for (const a of SCALES) check(near(gain(a), (2 * a - a * a) * TOSSED, 1e-28), `the path ${a} does not gain (2a - a^2) g^2 T^3 / 24 c^2`);
	check(printed(1) === '3.57' && printed(0.5) === '2.68' && printed(1.5) === '2.68' && printed(0) === '0', `the gains ${SCALES.map(printed)}`);
	check(near(gain(0.5) / gain(1), 0.75, 1e-12) && near(gain(1.5) / gain(1), 0.75, 1e-12), 'the dashed paths do not gain three quarters');
	// the free path ages most: every other a gains less
	for (let a = 0; a <= 2.0001; a += 0.05) if (Math.abs(a - 1) > 1e-9) check(gain(a) < gain(1), `the path ${a} gains more than free fall`);
	// the two integrals: g^2 T^3 / 12 and g^2 T^3 / 24
	{
		const n = 4000, h = T / n;
		let z = 0, v = 0;
		for (let i = 0; i <= n; i++) { const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2; z += w * G * height(1, i * h); v += w * 0.5 * speed(1, i * h) ** 2; }
		check(near((z * h) / 3, (G * G * T ** 3) / 12, 1e-9) && near((v * h) / 3, (G * G * T ** 3) / 24, 1e-9), 'the two terms');
	}
	// ---- the count
	check(VALUES === 10 && FIRST === 40 && SECOND === 100, `the metric's numbers ${VALUES} ${FIRST} ${SECOND}`);
	check(A_NUMBERS === 16 && B_NUMBERS === 40 && C_NUMBERS === 80 && multisets(N, 3) === 20, `the change's numbers ${A_NUMBERS} ${B_NUMBERS} ${C_NUMBERS}`);
	check(KEPT === 6 && KEPT === 3 + 3 && VALUES + KEPT === 16, 'the 6 turns and boosts');
	check(B_NUMBERS === FIRST && C_NUMBERS < SECOND && LEFT === 20, 'the 20 that remain');
	return { tossed: TOSSED, gains: SCALES.map(gain), left: LEFT };
}
