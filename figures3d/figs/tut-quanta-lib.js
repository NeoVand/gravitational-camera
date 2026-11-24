// Shared numbers for the three diagrams of the tutorial's chapter 8.3 (tutorial/quantum/quanta.md):
// tut-oscillator-levels, tut-phase-rings and tut-occupation. Not a figure itself. The palette is chapter 8.1's
// (figs/tut-quantum-lib.js, read from app.css by `palette(check)`), the Gaussian, Simpson's rule and the relative
// `near` chapter 8.2's (figs/tut-operators-lib.js), the double arrow chapter 6.6's (figs/tut-maxwell-lib.js), and the
// sheet, strokes, labels and cropping those of chapters 6.1 to 8.2 (figs/tut-pot-lib.js), all imported, not copied.
// Ink and the page's neutral tints only; orange and blue, which mean a stretch and a squeeze, are not used.
//
// The oscillator is drawn in its natural units: x in x_zp = sqrt(hbar / 2 m omega), p in m omega x_zp, energy in
// hbar omega. Then H / hbar omega = (u^2 + w^2) / 4 for u = x / x_zp and w = p / m omega x_zp, and an area du dw of
// the scaled plane is hbar / 2 of phase space.
//
// `chapter(check)` asserts the chapter's statements that a figure draws or its caption prints, against the chapter's
// own text (fetched), and computes the numbers behind them:
//  - the levels: V = (1/2) m omega^2 x^2 is u^2 / 4 in units of hbar omega (at several masses and frequencies); the
//    level E_n = (n + 1/2) hbar omega meets it at u = +-sqrt(4n + 2); the ground state psi_0 = (2 pi x_zp^2)^(-1/4)
//    e^{-x^2/4 x_zp^2} solves m omega x psi + hbar psi' = 0 and a psi_0 = 0, has length one, and |psi_0|^2, which is
//    e^{-u^2/2} up to a constant, has the standard deviation x_zp and falls to e^{-1/2} of its top at +-x_zp;
//  - the ball: chapter 4.3's effective mass 3M/10 = 9.86 kg and stiffness 3 mu V / R^2 = 8.9 x 10^10 N/m give
//    omega = 9.49 x 10^4 s^-1 (15.1 kHz), hbar omega = 1.0 x 10^-29 J, x_zp = 7.5 x 10^-21 m, k_B T / hbar omega =
//    4.1 x 10^8 and nbar = 4.1 x 10^8 at 300 K, hbar omega / k_B T = 2.4 x 10^-9, sqrt(2 nbar + 1) = 2.9 x 10^4;
//  - the bands: the ellipse of energy E encloses 2 pi E / omega (by quadrature, in SI); in the scaled plane the orbit
//    of the level n is the circle of radius sqrt(2(2n + 1)), the band of the level n lies between the circles of
//    radius 2 sqrt n and 2 sqrt(n + 1) and has the area 2 pi hbar, each orbit splits its band's area in half, and the
//    ground orbit (radius sqrt 2) encloses pi hbar;
//  - the occupation: P(n) = (1 - y) y^n with y = e^{-hbar omega / k_B T}, summed, gives 1 / (e^{hbar omega / k_B T}
//    - 1), and nbar + 1/2 = (1/2) coth(hbar omega / 2 k_B T) = <E> / hbar omega; at small k_B T / hbar omega, nbar
//    falls as e^{-hbar omega / k_B T} and nbar + 1/2 levels off at 1/2; at large, both approach k_B T / hbar omega;
//    silicon's Raman line, 15.6 THz at 300 K: hbar omega = hf = 1.03 x 10^-20 J, hbar omega / k_B T = 2.5,
//    k_B T / hbar omega = 0.40, nbar = 0.090; at k_B T = hbar omega the ground state holds 1 - 1/e = 63%; at
//    k_B T / hbar omega = 0.1, nbar = 4.5 x 10^-5, above the vertical axis's 10^-5.
import { HBAR, palette } from './tut-quantum-lib.js';
import { KB, TEMP } from './tut-osc-lib.js';
import { MU, R_BALL, RHO } from './tut-elastic-lib.js';
import { simpson, near } from './tut-operators-lib.js';
import { doubleArrow } from './tut-maxwell-lib.js';

export { HBAR, KB, TEMP, palette, simpson, near, doubleArrow };

// ---- the oscillator in its own units -----------------------------------------------------------------------------
export const LEVELS = [0, 1, 2, 3, 4];
/** E_n / hbar omega. */
export const level = (n) => n + 0.5;
/** V / hbar omega at u = x / x_zp. */
export const well = (u) => (u * u) / 4;
/** Where the level n meets the well: u = sqrt(4n + 2). */
export const turning = (n) => Math.sqrt(4 * n + 2);
/** |psi_0|^2 over its top, at u = x / x_zp. */
export const bell = (u) => Math.exp(-(u * u) / 2);

// ---- the scaled phase plane --------------------------------------------------------------------------------------
export const BANDS = [0, 1, 2, 3];
/** The circles that bound the band of the level n, in the scaled plane: radius 2 sqrt n and 2 sqrt(n + 1). */
export const edges = (n) => [2 * Math.sqrt(n), 2 * Math.sqrt(n + 1)];
/** The orbit of the level n: the circle of radius sqrt(2(2n + 1)), where (u^2 + w^2) / 4 = n + 1/2. */
export const orbit = (n) => Math.sqrt(2 * (2 * n + 1));
/** An area of the scaled plane, in units of hbar (du dw = (hbar / 2) dx dp / (m omega x_zp^2) ... = hbar / 2). */
export const areaInHbar = (scaled) => scaled / 2;

// ---- the occupation ----------------------------------------------------------------------------------------------
/** nbar at t = k_B T / hbar omega. */
export const nbar = (t) => 1 / Math.expm1(1 / t);
/** <E> / hbar omega = nbar + 1/2. */
export const energy = (t) => nbar(t) + 0.5;

// ---- the ball (chapter 4.3) and silicon's Raman line (chapter 4.1) ------------------------------------------------
export const V_BALL = (4 / 3) * Math.PI * R_BALL ** 3;
export const M_BALL = RHO * V_BALL;
export const M_EFF = 0.3 * M_BALL;
export const K_BALL = (3 * MU * V_BALL) / R_BALL ** 2;
export const W_BALL = Math.sqrt(K_BALL / M_EFF);
export const RAMAN = 15.6e12;                  // Hz
export const ball = () => (KB * TEMP) / (HBAR * W_BALL);
export const silicon = () => (KB * TEMP) / (2 * Math.PI * HBAR * RAMAN);

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/quanta.md')).text();
	// the text of the chapter outside its comments, flattened
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sig = (v, d) => Number(v).toPrecision(d);

	// ---- the levels and the ground state
	has('$$\\boxed{\\sym{level-energy}{E_n} = \\bigl(n + \\tfrac12\\bigr)\\hbar\\omega , \\qquad n = 0, 1, 2, \\dots}$$', 'the levels');
	has('$$H = \\frac{p^2}{2\\matter m} + \\tfrac12\\matter m\\omega^2x^2 .$$', 'the energy');
	has('$\\psi_0(x) = (2\\pi x_{\\rm zp}^2)^{-1/4}\\,e^{-x^2/4x_{\\rm zp}^2}$', 'the ground state');
	has('$$\\boxed{\\sym{zero-point-width}{x_{\\rm zp}} = \\sqrt{\\frac{\\hbar}{2\\matter m\\omega}}} ,$$', 'x_zp');
	has('The bell curve $|\\psi_0|^2$, of standard deviation $x_{\\rm zp}$, is the **zero-point motion**', 'the bell\'s width');
	has('$E_0 = \\tfrac12\\hbar\\omega$ is the **zero-point energy**', 'the zero-point energy');
	has('One step, $\\hbar\\omega$, is a **quantum** of the oscillator', 'the step');
	for (const [m, w] of [[1, 1], [2.3, 0.7], [9.86, 9.49e4]]) {
		const xzp = Math.sqrt(HBAR / (2 * m * w));
		for (const u of [-4.3, -1, 0.2, 2.7]) {
			const V = 0.5 * m * w * w * (u * xzp) ** 2 / (HBAR * w);
			check(near(V, well(u), 1e-12), `V / hbar omega is not u^2/4 at m = ${m}, omega = ${w}, u = ${u}`);
		}
		// psi_0 solves m omega x psi + hbar psi' = 0, which is a psi_0 = 0, and has length one
		const psi = (x) => (2 * Math.PI * xzp * xzp) ** -0.25 * Math.exp(-(x * x) / (4 * xzp * xzp));
		for (const u of [-2.1, -0.4, 0.9, 3.3]) {
			const x = u * xzp, h = 1e-5 * xzp, d = (psi(x + h) - psi(x - h)) / (2 * h);
			check(Math.abs(m * w * x * psi(x) + HBAR * d) <= 1e-8 * m * w * xzp * psi(0), `a psi_0 is not zero at u = ${u}`);
		}
		const len = simpson((x) => psi(x) ** 2, -12 * xzp, 12 * xzp);
		const sd = Math.sqrt(simpson((x) => x * x * psi(x) ** 2, -12 * xzp, 12 * xzp));
		check(near(len, 1, 1e-10) && near(sd, xzp, 1e-10), `psi_0 has length ${len} and standard deviation ${sd / xzp} x_zp`);
		check(near(psi(1.7 * xzp) ** 2 / psi(0) ** 2, bell(1.7), 1e-12), '|psi_0|^2 is not e^{-u^2/2} over its top');
	}
	for (const n of LEVELS) check(near(well(turning(n)), level(n), 1e-14), `the level ${n} does not meet the well at sqrt(4n + 2)`);
	check(near(bell(1), Math.exp(-0.5), 1e-15), 'the bell is not at e^{-1/2} of its top at x_zp');

	// ---- the ball
	has('the effective mass $3\\matter M/10 = 9.86\\unit{kg}$ and the stiffness $8.9\\times10^{10}\\unit{N\\,m^{-1}}$', 'the ball\'s mass and stiffness');
	has('So $\\omega = 9.49\\times10^4\\unit{s^{-1}}$ (15.1 kHz), $\\hbar\\omega = 1.0\\times10^{-29}\\unit J$, and $x_{\\rm zp} = 7.5\\times10^{-21}$ m', 'the ball\'s note and x_zp');
	has('$\\hbar\\omega/\\kB T = 1.0\\times10^{-29}/4.14\\times10^{-21} = 2.4\\times10^{-9}$, and $\\bar n = 4.1\\times10^8$', 'the ball\'s nbar');
	has('with $\\kB T = 4.14\\times10^{-21}$ J at 300 K', 'k_B T');
	const xzpBall = Math.sqrt(HBAR / (2 * M_EFF * W_BALL)), tBall = ball(), nBall = nbar(tBall);
	check(M_EFF.toFixed(2) === '9.86' && sig(K_BALL, 2) === '8.9e+10', `the ball's ${M_EFF} kg and ${K_BALL} N/m`);
	check(sig(W_BALL, 3) === '9.49e+4' && (W_BALL / (2 * Math.PI) / 1000).toFixed(1) === '15.1', `the ball's omega ${W_BALL}`);
	check(sig(HBAR * W_BALL, 2) === '1.0e-29' && sig(xzpBall, 2) === '7.5e-21', `hbar omega ${HBAR * W_BALL}, x_zp ${xzpBall}`);
	check(sig(KB * TEMP, 3) === '4.14e-21', `k_B T ${KB * TEMP}`);
	check(sig(tBall, 2) === '4.1e+8' && sig(nBall, 2) === '4.1e+8' && sig(1 / tBall, 2) === '2.4e-9', `the ball's k_B T / hbar omega ${tBall}, nbar ${nBall}`);
	check(sig(Math.sqrt(2 * nBall + 1), 2) === '2.9e+4', 'the ratio of the thermal swing to the zero point');

	// ---- the bands
	has('the orbit of energy $E$ is an ellipse of area $2\\pi E/\\omega$, so the ellipse of level $n$ encloses $2\\pi E_n/\\omega = 2\\pi\\hbar(n + \\tfrac12)$', 'the orbits\' areas');
	has('Each level therefore owns a band of area $2\\pi\\hbar$, between the ellipses that enclose $2\\pi\\hbar n$ and $2\\pi\\hbar(n + 1)$, with its own ellipse down the middle', 'the bands');
	has('The ground state\'s band is the central disc', 'the central disc');
	{
		// the ellipse H = E encloses 2 pi E / omega: its area by quadrature, for chapter 1.7's cart and another
		for (const [m, k, E] of [[2, 50, 0.25], [9.86, 8.9e10, 3e-29]]) {
			const w = Math.sqrt(k / m), X = Math.sqrt((2 * E) / k);
			const area = 2 * simpson((x) => Math.sqrt(Math.max(0, 2 * m * (E - 0.5 * k * x * x))), -X, X, 200000);
			check(near(area, (2 * Math.PI * E) / w, 1e-6), `the ellipse of ${E} J encloses ${area}, not 2 pi E / omega`);
		}
		// the scaled plane: an area du dw is hbar / 2 of phase space, since x_zp m omega x_zp = hbar / 2
		const m = 2.3, w = 0.7, xzp = Math.sqrt(HBAR / (2 * m * w));
		check(near(xzp * m * w * xzp, HBAR / 2, 1e-12) && near(areaInHbar(1), 0.5, 0), 'du dw is not hbar / 2');
		// (u^2 + w^2) / 4 is H / hbar omega
		for (const [u, v] of [[1.2, -0.3], [-2.5, 3.1]]) {
			const H = (v * m * w * xzp) ** 2 / (2 * m) + 0.5 * m * w * w * (u * xzp) ** 2;
			check(near(H / (HBAR * w), (u * u + v * v) / 4, 1e-12), 'H / hbar omega is not (u^2 + w^2)/4');
		}
		for (const n of BANDS) {
			const [a, b] = edges(n), r = orbit(n);
			check(near(areaInHbar(Math.PI * a * a), 2 * Math.PI * n, 1e-14) && near(areaInHbar(Math.PI * b * b), 2 * Math.PI * (n + 1), 1e-14), `the band ${n}'s circles`);
			check(near(areaInHbar(Math.PI * (b * b - a * a)), 2 * Math.PI, 1e-14), `the band ${n} has not the area 2 pi hbar`);
			check(near((r * r) / 4, level(n), 1e-14), `the orbit ${n} is not at (n + 1/2) hbar omega`);
			check(near(Math.PI * (r * r - a * a), Math.PI * (b * b - r * r), 1e-13), `the orbit ${n} does not split its band's area in half`);
			check(a < r && r < b, `the orbit ${n} is not inside its band`);
		}
		check(near(areaInHbar(Math.PI * orbit(0) ** 2), Math.PI, 1e-14), 'the ground orbit does not enclose pi hbar');
		check(edges(0)[0] === 0 && edges(0)[1] === 2, 'the ground band is not the disc of radius 2');
	}

	// ---- the occupation
	has('$$\\boxed{\\sym{occupation}{\\bar n} = \\frac{1}{e^{\\hbar\\omega/\\kB T} - 1}} .$$', 'the occupation');
	has('$\\langle E\\rangle = \\hbar\\omega(\\bar n + \\tfrac12)$', 'the mean energy');
	has('When $\\hbar\\omega \\ll \\kB T$, $z$ is small, and $e^z - 1 \\approx z + \\tfrac12z^2$ gives $\\bar n \\approx 1/z - \\tfrac12 = \\kB T/\\hbar\\omega - \\tfrac12$', 'the classical limit');
	has('When $\\hbar\\omega \\gg \\kB T$, $\\bar n \\approx e^{-\\hbar\\omega/\\kB T}$ and $\\langle E\\rangle \\to \\tfrac12\\hbar\\omega$', 'the frozen limit');
	has('Silicon\'s Raman line (chapter 4.1) has the frequency $f = 15.6$ THz', 'the Raman line');
	has('its quantum is $\\hbar\\omega = hf = 1.03\\times10^{-20}$ J. Then $\\hbar\\omega/\\kB T = 2.5$ and $\\bar n = 0.090$', 'silicon\'s nbar');
	has('at $\\kB T = \\hbar\\omega$, the ground state holds $1 - 1/e = 63\\%$ of the probability', 'the ground state\'s share');
	for (const z of [0.01, 0.3, 1, 2.5, 7]) {
		const y = Math.exp(-z);
		let s = 0, e = 0;
		for (let n = 0; n < 6000; n++) { const P = (1 - y) * y ** n; s += P; e += n * P; }
		const t = 1 / z;
		check(near(s, 1, 1e-10) && near(e, nbar(t), 1e-9), `the sum of n P(n) at z = ${z} is ${e}, not ${nbar(t)}`);
		check(near(energy(t), 0.5 / Math.tanh(z / 2), 1e-12), `nbar + 1/2 is not (1/2) coth(z/2) at z = ${z}`);
	}
	check(near(1 - Math.exp(-1), 0.632, 1e-3) && (100 * (1 - Math.exp(-1))).toFixed(0) === '63', 'the ground state\'s share at k_B T = hbar omega');
	check(near(nbar(0.02), Math.exp(-50), 1e-12) && near(energy(0.02), 0.5, 1e-12), 'the frozen limit');
	check(Math.abs(nbar(1e6) - (1e6 - 0.5)) < 1e-6 && Math.abs(energy(1e6) - 1e6) < 1e-6, 'the classical limit');
	const hf = 2 * Math.PI * HBAR * RAMAN, tSi = silicon(), nSi = nbar(tSi);
	check(sig(hf, 3) === '1.03e-20' && (1 / tSi).toFixed(1) === '2.5' && tSi.toFixed(2) === '0.40' && nSi.toFixed(3) === '0.090', `silicon: hf ${hf}, k_B T / hbar omega ${tSi}, nbar ${nSi}`);
	check(nbar(0.1) > 1e-5 && nbar(0.1).toExponential(1) === '4.5e-5', `nbar at 0.1 is ${nbar(0.1)}, below the axis`);
	return { md, ball: { t: tBall, n: nBall, xzp: xzpBall }, silicon: { t: tSi, n: nSi } };
}
