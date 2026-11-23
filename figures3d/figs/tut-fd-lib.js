// Shared numbers for the five figures of the tutorial's chapter 4.6 (tutorial/response/fluctuation-dissipation.md):
// tut-fd-hero, tut-fd-grain, tut-fd-lines, tut-fd-meeting and tut-fd-thermometer. Not a figure itself. The sheet,
// strokes and labels are chapter 1.2's (figs/tut-pot-lib.js), the axes and the seeded random numbers chapter 3.1's
// (figs/tut-prob-lib.js), the sampling of curves chapter 2.6's (figs/tut-fourier-lib.js), all imported, not copied; the
// ball, its trial shape and its thermal swing are 4.1's (figs/tut-osc-lib.js).
//
// `chapter(check)` asserts every number that a figure draws or that the chapter prints beside it: the bead's friction,
// diffusion constant, step and wandering; the spectrum of the cart and its identity with 2 k_B T Im chi / omega at
// every frequency, with the area k_B T / k for any Q; and the shell's pattern delta sigma, -n.D.n for D = diag(-1/2,
// -1/2, 1), its values, its zeros at 54.7 degrees, its degree two and the drive energy -f D:E.
import { normals } from './tut-prob-lib.js';

// ---- the bead in water (chapter 4.6, "A number") -----------------------------------------------------------------
export const KB = 1.380649e-23;           // J/K
export const T_WATER = 293;               // K
export const ETA = 1.0e-3;                // Pa s, water
export const R_BEAD = 0.5e-6;             // m
export const RHO_BEAD = 1050;             // kg m^-3
export const M_BEAD = RHO_BEAD * (4 / 3) * Math.PI * R_BEAD ** 3;
export const FRICTION = 6 * Math.PI * ETA * R_BEAD;          // m Gamma, Stokes's law, kg/s
export const DIFFUSION = (KB * T_WATER) / FRICTION;          // m^2/s
export const DT = 2.5e-3;                 // s, the path's step
export const STEPS = 400;                 // over 1 s
export const STEP_SD = Math.sqrt(2 * DIFFUSION * DT);        // m, along each axis
export const SEED = 15;

/** The bead's path over one second, in metres: STEPS + 1 points in the x-y plane from the origin, each step two
 * independent Gaussian displacements of standard deviation STEP_SD (seeded). */
export function beadPath(seed = SEED) {
	const z = normals(seed);
	const pts = [[0, 0]];
	const steps = [];
	for (let i = 0; i < STEPS; i++) {
		const d = [STEP_SD * z(), STEP_SD * z()];
		steps.push(d);
		const [x, y] = pts[pts.length - 1];
		pts.push([x + d[0], y + d[1]]);
	}
	return { pts, steps };
}

// ---- the cart's line, in units of 2 k_B T / k omega_0, against x = omega / omega_0 -----------------------------
/** S_q = 2 k_B T m Gamma |chi|^2 with Gamma = omega_0 / Q: (1/Q) / ((1 - x^2)^2 + x^2/Q^2). */
export const spectrum = (x, Q) => { const g = 1 / Q, re = 1 - x * x, im = g * x; return g * (1 / (re * re + im * im)); };
/** 2 k_B T Im chi / omega, from the complex chi = 1 / m (omega_0^2 - omega^2 - i Gamma omega): Im(k chi) / x. */
export function dissipation(x, Q) {
	// k chi = 1 / (1 - x^2 - i x / Q) = (1 - x^2 + i x / Q) / |.|^2
	const re = 1 - x * x, im = x / Q, d = re * re + im * im;
	const kchi = [re / d, im / d];
	return kchi[1] / x;
}
export const QS = [3, 30];
export const DOTS = Array.from({ length: 50 }, (_, i) => +(0.05 * (i + 1)).toFixed(2));

// ---- the shell ------------------------------------------------------------------------------------------------
export const D = [[-0.5, 0, 0], [0, -0.5, 0], [0, 0, 1]];
const nDn = (n) => { let s = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += n[i] * D[i][j] * n[j]; return s; };
/** delta sigma in units of 15 f / 4 pi a^4, at the angle theta from z in the x-z section: -(cos^2 - sin^2 / 2). */
export const pattern = (theta) => -nDn([Math.sin(theta), 0, Math.cos(theta)]);
export const ZERO = Math.acos(1 / Math.sqrt(3));             // radians, 54.7 degrees

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
	// ---- the bead: m Gamma 9.4e-9 kg/s, D 4.29e-13 (4.3e-13) m^2/s, 0.93 um in a second, 3 mm/s, 1/Gamma 6e-8 s
	check(FRICTION.toPrecision(2) === '9.4e-9', `m Gamma = ${FRICTION}`);
	check(DIFFUSION.toPrecision(3) === '4.29e-13' && DIFFUSION.toPrecision(2) === '4.3e-13', `D = ${DIFFUSION}`);
	check((Math.sqrt(2 * DIFFUSION * 1) * 1e6).toFixed(2) === '0.93', 'the wandering in one second');
	check((Math.sqrt((KB * T_WATER) / M_BEAD) * 1e3).toFixed(0) === '3', 'the speed along one axis');
	check((M_BEAD / FRICTION).toPrecision(1) === '6e-8', `1/Gamma = ${M_BEAD / FRICTION}`);
	// the path's step: sqrt(2 D dt) = 46 nm along each axis; 400 steps of 2.5 ms make a second
	check((STEP_SD * 1e9).toFixed(0) === '46', `the step ${STEP_SD}`);
	check(near(STEPS * DT, 1, 1e-15), 'the path does not last one second');
	// the drawn path: its steps have the standard deviation of the model (800 draws: within 8%, three standard errors)
	// and mean zero (within three standard errors), and the sum of the squared steps is 2 D t per axis within 8%
	const { pts, steps } = beadPath();
	const all = steps.flat();
	const m = all.reduce((s, v) => s + v, 0) / all.length;
	const sd = Math.sqrt(all.reduce((s, v) => s + (v - m) ** 2, 0) / (all.length - 1));
	check(Math.abs(sd / STEP_SD - 1) < 0.08, `the path's steps have the deviation ${sd}`);
	check(Math.abs(m) < (3 * STEP_SD) / Math.sqrt(all.length), `the path's steps have the mean ${m}`);
	check(pts.length === STEPS + 1, 'the path has not 401 points');
	// ---- the line: S_q and 2 k_B T Im chi / omega agree at every dot and between them; peak Q at x = 1; area
	for (const Q of QS) {
		for (const x of DOTS) check(near(dissipation(x, Q), spectrum(x, Q), 1e-12), `Q = ${Q}: the dot at ${x} is off the line`);
		for (let x = 0.001; x <= 2.5; x += 0.001) check(near(dissipation(x, Q), spectrum(x, Q), 1e-12), `Q = ${Q}: the identity fails at ${x}`);
		check(near(spectrum(1, Q), Q, 1e-15), `Q = ${Q}: the line at omega_0 is not Q`);
		// the area: int_0^inf S dx = pi/2 for every Q, so int S d omega / 2 pi over both signs is k_B T / k
		// (by the substitution x = tan-like: integrate on [0, 50] by Simpson, the tail beyond 50 analytically ~ 1/(3 Q 50^3))
		const n = 2000000, b = 50, h = b / n;
		let s = spectrum(0, Q) + spectrum(b, Q);
		for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * spectrum(i * h, Q);
		const area = (s * h) / 3 + 1 / (3 * Q * b ** 3);
		check(near(area, Math.PI / 2, 1e-7), `Q = ${Q}: the area is ${area}, not pi/2`);
	}
	// the range of the chart: every value of both lines from x = 0 to 2.5 lies within 10^-3 to 40
	for (const Q of QS) for (let x = 0; x <= 2.5; x += 1e-3) { const v = spectrum(x, Q); check(v > 1e-3 && v < 40, `Q = ${Q}: ${v} at ${x} leaves the chart`); }
	// ---- the shell: D trace-free; the pattern +1/2 at the equator, -1 at the poles, zero at 54.7 degrees
	check(D[0][0] + D[1][1] + D[2][2] === 0, 'D is not trace-free');
	check(near(pattern(Math.PI / 2), 0.5, 1e-15) && near(pattern(0), -1, 1e-15) && near(pattern(Math.PI), -1, 1e-15), 'the pattern\'s values');
	check((ZERO * 180 / Math.PI).toFixed(1) === '54.7', `the zero at ${ZERO}`);
	for (const z of [ZERO, Math.PI - ZERO, -ZERO, ZERO - Math.PI]) check(Math.abs(pattern(z)) < 1e-15, `the pattern is not zero at ${z}`);
	for (let t = 0; t < ZERO - 1e-9; t += 1e-3) check(pattern(t) < 0, `the pattern is not negative near the pole at ${t}`);
	for (let t = ZERO + 1e-9; t < Math.PI / 2; t += 1e-3) check(pattern(t) > 0, `the pattern is not positive near the equator at ${t}`);
	// over the sphere: no degree zero or one, and with delta sigma = -(15 f / 4 pi a^4) n.D.n the energy
	// int delta sigma Phi dA = -f D:E for the tide Phi = E_ij x_i x_j / 2 of a trace-free E (here f = a = 1)
	const E = [[0.3, -0.7, 0.2], [-0.7, -1.1, 0.45], [0.2, 0.45, 0.8]];
	let s0 = 0, s1 = [0, 0, 0], energy = 0;
	const NT = 400, NP = 800;
	for (let i = 0; i < NT; i++) {
		const t = (Math.PI * (i + 0.5)) / NT;
		for (let j = 0; j < NP; j++) {
			const p = (2 * Math.PI * (j + 0.5)) / NP;
			const n = [Math.sin(t) * Math.cos(p), Math.sin(t) * Math.sin(p), Math.cos(t)];
			const dO = Math.sin(t) * (Math.PI / NT) * ((2 * Math.PI) / NP);
			const sigma = (-15 / (4 * Math.PI)) * nDn(n);
			let phi = 0;
			for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) phi += 0.5 * E[a][b] * n[a] * n[b];
			s0 += sigma * dO;
			for (let k = 0; k < 3; k++) s1[k] += sigma * n[k] * dO;
			energy += sigma * phi * dO;
		}
	}
	let DE = 0;
	for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) DE += D[a][b] * E[a][b];
	// (the midpoint rule's error is of order (pi / NT)^2, a part in 10^5 of the pattern's scale, 15)
	check(Math.abs(s0) < 1e-4 && s1.every((v) => Math.abs(v) < 1e-9), `the pattern has a degree zero or one: ${s0}, ${s1}`);
	check(near(energy, -DE, 1e-4), `the drive's energy ${energy} is not -f D:E = ${-DE}`);
	return { sd, mean: m, end: pts[pts.length - 1] };
}
