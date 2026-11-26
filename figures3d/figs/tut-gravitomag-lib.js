// Shared numbers and colours for the three diagrams of the tutorial's section 7.5 (tutorial/geometry/gravitomagnetism.md):
// tut-magnetic-crossing, tut-spin-dipole-sky and tut-earth-two-bars. Not a figure itself. The colour roles are chapter
// 7.4's (figs/tut-linear-lib.js: the observer's, the curvature's, matter's and the field's, read from app.css by
// `palette(check)`); the sheet, strokes, labels and cropping are those of sections 6.1 to 7.4, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - one moving mass (eq:magnetic-point): B_ij = (3 G M / c r^3)[n_i (n x v)_j + n_j (n x v)_i], n from the pixel toward
//    the mass, rebuilt from the flow rule (eq:flow-rule), B_ij = (G/c)[2 d_j b_i + eps_ijk d_k (div A)] with A = M v / r
//    and b = curl A, both by finite differences, at three places and three velocities; it is symmetric and trace-free;
//    |B| / |E| = sqrt 3 v_perp / c (Frobenius norms, E = (G M / r^3)(delta - 3 n n)) for every direction of v, and
//    B = 0 for v along n; the person (70 kg, 1.4 m s^-1 across the line, 1 m): |B| = 3 sqrt 2 G M v / c r^3 =
//    9.3 x 10^-17 s^-2, |E| = sqrt 6 G M / r^3 = 1.14 x 10^-8 s^-2, the ratio 8.1 x 10^-9; the entry 3 G M v / c r^3 =
//    6.54 x 10^-17 s^-2;
//  - neighbouring gyroscopes (eq:gyro-pair): delta Omega = B xi / c; for the mass moving across (n = x, v = y), a
//    separation along the line to the mass turns them relative to one another about the third axis z (the one at
//    +x anticlockwise about z, seen with z toward the viewer), and a separation along v gives no relative turn;
//  - the spin dipole (eq:spin-dipole), rebuilt from A = L x x / 2 r^3 by finite differences of b = curl A and
//    B_ij = (2 G / c) d_i b_j, at three places; its trace zero; along the line to the body B_nn = 6 G (L . n) / c r^4,
//    and E_nn = -2 G M / r^3 for a point mass; on the equator B_nn = 0 and B_xz = 3 G L / c r^4;
//  - the Earth (eq:earth): G M = 3.986 x 10^14 m^3 s^-2, Omega = 7.292 x 10^-5 s^-1, R = 6.378 x 10^6 m; Omega R =
//    465 m s^-1; the factor 3 G M Omega / c R^2 = 7.15 x 10^-12 s^-2; the motion (a pixel moving with u past the mass
//    at rest, first order) -7.15 and the spin (eq:spin-dipole with L = I Omega z) +2.36 for I / M R^2 = 0.3307, each
//    from the vectors, their sum -4.79 x 10^-12 s^-2 = -(factor)(1 - I / M R^2); a uniform Earth (0.4) -4.29, a hollow
//    shell (2/3) -2.38; the core raises the reading by 12 per cent; L = 0.3307 M R^2 Omega = 5.86 x 10^33 kg m^2 s^-1;
//    the person's 6.54 x 10^-17 is 73,100 times less; 1 m apart, delta Omega = 1.6 x 10^-20 rad s^-1, a full turn in
//    about 900 ages of the universe (13.8 x 10^9 years); a Omega xi / c^2 = 8 x 10^-21 rad s^-1, half of it;
//  - matter at the pixel: 4 pi G rho v / c = 2.8 x 10^-15 s^-2 for water at 1 m s^-1, water's trace 8.4 x 10^-7 times
//    v / c = 3.3 x 10^-9;
//  - the near zone: a person swaying by 5 cm once a second, 1 m away: omega r / c = 2.1 x 10^-8, twenty times v / c;
//  - the checks: a thin shell's I = (2/3) M R^2 against a ball's (2/5): 5/3; the ball inside a counter-turning shell of
//    the same density with L = 0 has radius 2^(-1/5) R = 0.871 R.
import { OBS, CURV, MATTER, FIELD, ACCENT, ACCENT2, stack, palette, G, C } from './tut-linear-lib.js';

export { OBS, CURV, MATTER, FIELD, ACCENT, ACCENT2, stack, palette, G, C };

// ---- vectors and tables ------------------------------------------------------------------------------------------
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => Math.hypot(...a);
const I3 = [0, 1, 2];
const table = (f) => I3.map((i) => I3.map((j) => f(i, j)));
/** The Frobenius norm of a 3 x 3 table. */
export const frob = (T) => Math.sqrt(T.flat().reduce((s, v) => s + v * v, 0));
/** T xi. */
export const apply = (T, xi) => I3.map((i) => dot(T[i], xi));
const eps = (i, j, k) => ((i - j) * (j - k) * (k - i)) / 2;

/** eq:magnetic-point: one mass M moving with v, n from the pixel toward it, r away; s^-2. */
export function magneticPoint(M, v, n, r) {
	const nv = cross(n, v), k = (3 * G * M) / (C * r ** 3);
	return table((i, j) => k * (n[i] * nv[j] + n[j] * nv[i]));
}
/** The tide of one mass at rest, (G M / r^3)(delta - 3 n n); s^-2. */
export function electricPoint(M, n, r) {
	const k = (G * M) / r ** 3;
	return table((i, j) => k * ((i === j ? 1 : 0) - 3 * n[i] * n[j]));
}
/** eq:spin-dipole: -(3 G / c r^4)[L_i n_j + n_i L_j + (L . n)(delta_ij - 5 n_i n_j)]; s^-2. */
export function spinDipole(L, n, r) {
	const k = (-3 * G) / (C * r ** 4), Ln = dot(L, n);
	return table((i, j) => k * (L[i] * n[j] + n[i] * L[j] + Ln * ((i === j ? 1 : 0) - 5 * n[i] * n[j])));
}

// ---- finite differences, for the flow rule ------------------------------------------------------------------------
const shift = (x, a, s) => x.map((v, i) => (i === a ? v + s : v));
const d1 = (f, x, a, h) => (f(shift(x, a, h)) - f(shift(x, a, -h))) / (2 * h);
/** curl F at x, F a vector field. */
const curl = (F, x, h) => I3.map((i) => I3.reduce((s, j) => s + I3.reduce((t, k) => t + eps(i, j, k) * d1((y) => F(y)[k], x, j, h), 0), 0));
/** div F at x. */
const div = (F, x, h) => I3.reduce((s, i) => s + d1((y) => F(y)[i], x, i, h), 0);
/** eq:flow-rule from the potential of the flow A (kg s^-1, a vector field of position in metres): (G/c)[2 d_j b_i +
 * eps_ijk d_k (div A)], b = curl A; nested central differences of step h (metres). */
export function flowRule(A, x, h) {
	const b = (y) => curl(A, y, h);
	const dA = (y) => div(A, y, h);
	return table((i, j) => (G / C) * (2 * d1((y) => b(y)[i], x, j, h) + I3.reduce((s, k) => s + eps(i, j, k) * d1(dA, x, k, h), 0)));
}

// ---- the paper's person and the Earth -----------------------------------------------------------------------------
export const PERSON = 70, PERSON_R = 1, WALK = 1.4;          // kg, m, m s^-1
export const GM_EARTH = 3.986e14;                           // m^3 s^-2
export const OMEGA = 7.292e-5;                              // s^-1
export const R_EARTH = 6.378e6;                             // m, equatorial
export const FACTORS = { earth: 0.3307, uniform: 0.4, shell: 2 / 3 };   // I / M R^2
export const YEAR = 3.156e7, AGE = 13.8e9;                  // s; years
export const GRAV = 9.8;                                     // m s^-2

/** The equator's reading for I / M R^2 = f, built from the vectors: the pixel at R x moving with u = Omega R y past
 * the mass at rest (eq:magnetic-point with v -> -u), and the spin dipole with L = f M R^2 Omega z. Returns the xz
 * entries of the motion, the spin and their sum, s^-2. */
export function equator(f) {
	const M = GM_EARTH / G, R = R_EARTH;
	const n = [-1, 0, 0], u = [0, OMEGA * R, 0], L = [0, 0, f * M * R * R * OMEGA];
	const motion = magneticPoint(M, u.map((x) => -x), n, R), spin = spinDipole(L, n, R);
	return { motion: motion[0][2], spin: spin[0][2], sum: motion[0][2] + spin[0][2], tables: { motion, spin }, L };
}
/** The factor 3 G M Omega / c R^2, s^-2. */
export const EARTH_FACTOR = (3 * GM_EARTH * OMEGA) / (C * R_EARTH ** 2);

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
	const fig2 = (v) => Math.abs(v).toExponential(1);
	const fig3 = (v) => Math.abs(v).toExponential(2);
	const tiny = (T, scale, tol = 1e-12) => T.flat().every((v) => Math.abs(v) <= tol * scale);

	// ---- one moving mass: eq:magnetic-point from the flow rule, by finite differences
	{
		const M = 3.7, cases = [
			{ x: [-1.3, 0.4, 0.7], v: [0.3, -1.1, 0.6] },
			{ x: [0.8, -0.9, -0.5], v: [1.2, 0.2, -0.4] },
			{ x: [0.2, 1.5, -0.6], v: [-0.5, 0.7, 0.9] }
		];
		for (const { x, v } of cases) {
			const r = norm(x), n = x.map((a) => -a / r);
			const A = (y) => { const s = norm(y); return v.map((a) => (M * a) / s); };
			const fd = flowRule(A, x, 2e-3), B = magneticPoint(M, v, n, r);
			const scale = frob(B);
			check(I3.every((i) => I3.every((j) => Math.abs(fd[i][j] - B[i][j]) < 1e-5 * scale)), `eq:magnetic-point is not the flow rule at ${x}: ${fd} against ${B}`);
			check(tiny(table((i, j) => B[i][j] - B[j][i]), scale) && Math.abs(B[0][0] + B[1][1] + B[2][2]) < 1e-12 * scale, 'eq:magnetic-point is not symmetric and trace-free');
		}
	}
	// |B| / |E| = sqrt 3 v_perp / c for any direction; nothing along the line of sight
	{
		const M = 2.2, r = 1.7, n = [1, 0, 0];
		for (const v of [[0, 1.4, 0], [0.9, -0.6, 1.1], [-2, 0.3, 0.2], [0, 0, 3]]) {
			const vp = norm(cross(n, v));
			const ratio = frob(magneticPoint(M, v, n, r)) / frob(electricPoint(M, n, r));
			check(rel(ratio, (Math.sqrt(3) * vp) / C, 1e-12), `|B|/|E| = ${ratio}, not sqrt 3 v_perp / c for v = ${v}`);
		}
		check(tiny(magneticPoint(M, [-1.4, 0, 0], n, r), 1), 'a mass moving along the line of sight makes a magnetic part');
	}
	// the person
	const pn = [1, 0, 0], pv = [0, WALK, 0];
	const pB = magneticPoint(PERSON, pv, pn, PERSON_R), pE = electricPoint(PERSON, pn, PERSON_R);
	const entry = (3 * G * PERSON * WALK) / (C * PERSON_R ** 3);
	check(rel(frob(pB), Math.SQRT2 * entry, 1e-12) && fig2(frob(pB)) === '9.3e-17', `the person's |B| ${frob(pB)}`);
	check(rel(frob(pE), (Math.sqrt(6) * G * PERSON) / PERSON_R ** 3, 1e-12) && fig3(frob(pE)) === '1.14e-8', `the person's |E| ${frob(pE)}`);
	check(fig2(frob(pB) / frob(pE)) === '8.1e-9', `the person's ratio ${frob(pB) / frob(pE)}`);
	// the chapter prints 6.54 x 10^-17; the entry is 6.5450 x 10^-17 with the exact c, on the edge between 6.54 and 6.55
	// (6.5449 with c = 2.998 x 10^8, the value of the chapter's interactive figure)
	check(entry.toExponential(3) === '6.545e-17' && ((3 * G * PERSON * WALK) / (2.998e8 * PERSON_R ** 3)).toExponential(2) === '6.54e-17' && rel(pB[0][2], entry, 1e-12), `the person's entry ${entry}`);

	// ---- neighbouring gyroscopes: delta Omega = B xi / c, for the mass moving across (n = x, v = y)
	const gyro = (B, xi) => apply(B, xi).map((a) => a / C);
	{
		const along = gyro(pB, [1, 0, 0]), alongV = gyro(pB, [0, 1, 0]);
		check(Math.abs(along[0]) + Math.abs(along[1]) < 1e-15 * norm(along) && along[2] > 0, `a separation along the line turns them about ${along}`);
		check(norm(alongV) === 0, `a separation along v turns them by ${alongV}`);
	}

	// ---- the spin dipole from A = L x x / 2 r^3
	{
		const L = [0.3, -0.5, 1.2];
		const A = (y) => { const s = norm(y); return cross(L, y).map((a) => a / (2 * s ** 3)); };
		for (const x of [[1.1, 0.3, -0.4], [-0.2, 0.9, 0.8], [0.5, -1.3, 0.1]]) {
			const r = norm(x), n = x.map((a) => -a / r);
			const fd = flowRule(A, x, 2e-3), B = spinDipole(L, n, r), scale = frob(B);
			check(I3.every((i) => I3.every((j) => Math.abs(fd[i][j] - B[i][j]) < 1e-5 * scale)), `eq:spin-dipole is not the flow rule at ${x}`);
			check(Math.abs(B[0][0] + B[1][1] + B[2][2]) < 1e-12 * scale, 'the spin dipole is not trace-free');
			const nn = dot(n, apply(B, n));
			check(rel(nn, (6 * G * dot(L, n)) / (C * r ** 4), 1e-12), `B_nn = ${nn}, not 6 G (L.n) / c r^4`);
		}
		// a point mass: E_nn = -2 G M / r^3, the same in every direction
		for (const n of [[1, 0, 0], [0, 0.6, 0.8], [-0.48, 0.6, -0.64]]) {
			const E = electricPoint(5, n, 2);
			check(rel(dot(n, apply(E, n)), (-2 * G * 5) / 8, 1e-12), 'E_nn is not -2 G M / r^3');
		}
		// on the equator: B_nn = 0, and B_xz = 3 G L / c r^4 (pixel on x, L along z)
		const Lz = [0, 0, 2.5], B = spinDipole(Lz, [-1, 0, 0], 1.3);
		check(Math.abs(dot([-1, 0, 0], apply(B, [-1, 0, 0]))) < 1e-30 && rel(B[0][2], (3 * G * 2.5) / (C * 1.3 ** 4), 1e-12), 'the equator\'s spin dipole');
	}

	// ---- the Earth
	check(Math.round(OMEGA * R_EARTH) === 465, `Omega R = ${OMEGA * R_EARTH}`);
	check((EARTH_FACTOR / 1e-12).toFixed(2) === '7.15', `the factor ${EARTH_FACTOR}`);
	const at = Object.fromEntries(Object.entries(FACTORS).map(([k, f]) => [k, equator(f)]));
	for (const [k, f] of Object.entries(FACTORS)) {
		const e = at[k];
		check(rel(e.motion, -EARTH_FACTOR, 1e-12) && rel(e.spin, EARTH_FACTOR * f, 1e-12) && rel(e.sum, -EARTH_FACTOR * (1 - f), 1e-12), `the ${k} reading ${e.sum}`);
		// every other entry zero
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (!((i === 0 && j === 2) || (i === 2 && j === 0)))
			check(e.tables.motion[i][j] === 0 && Math.abs(e.tables.spin[i][j]) < 1e-30, `the ${k} reading has an entry ${i}${j}`);
	}
	const u12 = (v) => (v / 1e-12).toFixed(2);
	check(u12(at.earth.motion) === '-7.15' && u12(at.earth.spin) === '2.36' && u12(at.earth.sum) === '-4.79', `the Earth's bars ${u12(at.earth.motion)}, ${u12(at.earth.spin)}, ${u12(at.earth.sum)}`);
	check(u12(at.uniform.sum) === '-4.29' && u12(at.shell.sum) === '-2.38', `the ticks ${u12(at.uniform.sum)}, ${u12(at.shell.sum)}`);
	check(Math.round((at.earth.sum / at.uniform.sum - 1) * 100) === 12, `the core's rise ${at.earth.sum / at.uniform.sum}`);
	check(fig3(at.earth.L[2]) === '5.86e+33', `the Earth's L ${at.earth.L[2]}`);
	check(Math.round(Math.abs(at.earth.sum) / entry / 100) * 100 === 73100, `the Earth over the person ${Math.abs(at.earth.sum) / entry}`);
	const turn = Math.abs(at.earth.sum) / C;
	check(fig2(turn) === '1.6e-20', `the gyroscopes' turn 1 m apart ${turn}`);
	check(Math.round((2 * Math.PI) / turn / YEAR / AGE / 100) * 100 === 900, `a full turn in ${(2 * Math.PI) / turn / YEAR / AGE} ages`);
	const held = (GRAV * OMEGA) / (C * C);
	check(held.toExponential(0) === '8e-21' && Math.round(turn / held) === 2, `a Omega xi / c^2 = ${held}`);

	// ---- matter at the pixel, the near zone, the checks
	const water = (4 * Math.PI * G * 1000 * 1) / C;
	check(fig2(water) === '2.8e-15' && fig2(4 * Math.PI * G * 1000) === '8.4e-7' && fig2(1 / C) === '3.3e-9', `water's ${water}`);
	const sway = (2 * Math.PI * 1) / C;
	check(fig2(sway) === '2.1e-8' && Math.round(sway / ((2 * Math.PI * 0.05) / C)) === 20, `the sway ${sway}`);
	check(rel((2 / 3) / (2 / 5), 5 / 3, 1e-12), 'the shell over the ball');
	// a ball of radius a and a shell from a to R of one density, turning oppositely at one rate: L ~ a^5 - (R^5 - a^5)
	{
		const a = 2 ** -0.2;
		check(Math.abs(a ** 5 - (1 - a ** 5)) < 1e-15 && a.toFixed(3) === '0.871', `the counter-turning ball's radius ${a}`);
	}

	return { person: { B: pB, E: pE, entry }, equator: at, factor: EARTH_FACTOR, gyro };
}
