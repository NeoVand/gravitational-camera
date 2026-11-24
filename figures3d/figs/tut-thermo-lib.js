// Shared numbers for the three diagrams of the tutorial's chapter 13.7 (tutorial/what-a-field-keeps/thermometer.md):
// tut-sum-cutoff, tut-hole-shells and tut-hankel-test. Not a figure itself. The sheet, strokes, labels and cropping are
// chapters 1.2 to 13.4's (figs/tut-pot-lib.js), the plots and axes chapter 3.1's (figs/tut-prob-lib.js), matter's
// colour chapter 7.4's (figs/tut-linear-lib.js, asserted against app.css by `palette(check)`), the hole's fill chapter
// 11.1's (figs/tut-schw-lib.js), all imported, not copied.
//
// The colours: the hole's would-be shells and the region where no positive mass can go in matter's colour, since
// they stand for mass; the horizon a disc of the fixed near-black of chapter 11.1; everything else in ink and the
// page's greys, told apart by stroke (solid, dashed, dotted) and named beside the lines. The diagram comments' orange
// and blue (the band of the sum, the rings and the hole's parabola, the region below zero) are not used: in the
// tutorial's figures orange and blue mean a stretch and a squeeze.
//
// Gamma_2: the share of a quadrupole wave that a hole that does not turn absorbs, x = GM omega / c^3, on 241 values of x
// equally spaced in ln x from 0.01 to 3 (x_i = 0.01 * 300^(i/240)), six figures, from the paper's Regge-Wheeler solver
// (reference/gravcam/bhmodes.py, transmission(2, x), flux conserved to 10^-9), the solver behind the paper's
// fig:hole-response and reference/gravcam/holeresponse.py; values that exceed 1 by rounding are held at 1. Between its
// points ln Gamma_2 is a natural cubic spline in ln x. `chapter(check)` asserts it against chapter 11.3's table
// (app/src/lib/tutorial/live/hole-against-sky-data.ts, the row l = 2, x = 0.01 to 0.78) to a part in 10^3, the integral int Gamma_2 x^-4 dx (Page's law below 0.01, 1 above 3) against the chapter's 6.938, the shares
// below 0.2 and between 0.3 and 0.6 against its 0.3% and three quarters, and the peak against its 0.40.
//
// The radii: R_l / r_s for l = 2 to 8, holeresponse.degree_shell_radius, read from the site's
// app/src/lib/hair/hole.ts (HOLE_RADII) and asserted against the chapter's four places; the step absorber's,
// from the closed form (R_l c^2 / GM)^(2l-2) = [(2l+1)!!]^2 (l-1) / [2 pi (2l+1)(l+1)(l+2)] x_l^(1-2l) / (2l-1),
// x_l = (l + 1/2) / 3 sqrt 3, asserted against the chapter's three places and the limit (3 sqrt 3 / e) r_s.
// The test: m_k = R_(k+1)^(2k) from the unrounded radii, as the chapter says, and the least value of
// m_3 - 2a m_2 + a^2 m_1 at a = m_2 / m_1, asserted against the chapter's.
import { palette, MATTER } from './tut-linear-lib.js';
import { HOLE } from './tut-schw-lib.js';

export { MATTER, HOLE };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- Gamma_2 ---------------------------------------------------------------------------------------------------------
export const X0 = 0.01, X1 = 3, STEPS = 240;
export const X = Array.from({ length: STEPS + 1 }, (_, i) => X0 * (X1 / X0) ** (i / STEPS));
export const GAMMA2 = [
	1.2176e-12, 1.40663e-12, 1.6251e-12, 1.87758e-12, 2.16939e-12, 2.50669e-12, 2.89657e-12, 3.34728e-12, 3.86833e-12,
	4.47074e-12, 5.16727e-12, 5.97267e-12, 6.90404e-12, 7.98115e-12, 9.2269e-12, 1.06678e-11, 1.23346e-11, 1.42629e-11,
	1.64937e-11, 1.9075e-11, 2.2062e-11, 2.55188e-11, 2.95197e-11, 3.41507e-11, 3.95117e-11, 4.57185e-11, 5.29053e-11,
	6.12277e-11, 7.08663e-11, 8.20307e-11, 9.4964e-11, 1.09948e-10, 1.27312e-10, 1.47434e-10, 1.70757e-10, 1.97795e-10,
	2.29143e-10, 2.65493e-10, 3.07653e-10, 3.56557e-10, 4.13295e-10, 4.79132e-10, 5.55544e-10, 6.44244e-10, 7.47229e-10,
	8.66824e-10, 1.00574e-09, 1.16712e-09, 1.35466e-09, 1.57263e-09, 1.82605e-09, 2.12073e-09, 2.4635e-09, 2.8623e-09,
	3.32641e-09, 3.86669e-09, 4.49582e-09, 5.22862e-09, 6.08245e-09, 7.07761e-09, 8.23788e-09, 9.59111e-09, 1.117e-08,
	1.30127e-08, 1.51643e-08, 1.76775e-08, 2.06141e-08, 2.40471e-08, 2.8062e-08, 3.27596e-08, 3.82584e-08, 4.46983e-08,
	5.22439e-08, 6.10897e-08, 7.14652e-08, 8.36414e-08, 9.79392e-08, 1.14738e-07, 1.34486e-07, 1.57718e-07, 1.85064e-07,
	2.17275e-07, 2.55242e-07, 3.00025e-07, 3.52889e-07, 4.15336e-07, 4.89165e-07, 5.76518e-07, 6.79961e-07, 8.02564e-07,
	9.48005e-07, 1.1207e-06, 1.32594e-06, 1.57012e-06, 1.86091e-06, 2.20757e-06, 2.62129e-06, 3.11558e-06, 3.70683e-06,
	4.4149e-06, 5.26391e-06, 6.28319e-06, 7.5085e-06, 8.98347e-06, 1.07614e-05, 1.29077e-05, 1.55023e-05, 1.86438e-05,
	2.24533e-05, 2.70803e-05, 3.27095e-05, 3.95697e-05, 4.79446e-05, 5.81873e-05, 7.07374e-05, 8.61439e-05, 0.000105094,
	0.00012845, 0.000157295, 0.000192994, 0.000237274, 0.000292317, 0.000360899, 0.000446547, 0.000553766, 0.000688318,
	0.000857594, 0.0010711, 0.00134109, 0.00168342, 0.00211862, 0.0026734, 0.00338252, 0.00429139, 0.00545938,
	0.00696433, 0.00890829, 0.0114253, 0.014691, 0.0189358, 0.0244604, 0.031655, 0.0410223, 0.0532001, 0.0689832,
	0.0893322, 0.11536, 0.148269, 0.189225, 0.239131, 0.298318, 0.366202, 0.441023, 0.519839, 0.598883, 0.674223,
	0.742524, 0.801595, 0.850556, 0.889663, 0.919933, 0.942758, 0.9596, 0.971808, 0.980526, 0.986671, 0.990956,
	0.993913, 0.995936, 0.997308, 0.998231, 0.998846, 0.999254, 0.999521, 0.999695, 0.999808, 0.99988, 0.999926,
	0.999954, 0.999972, 0.999983, 0.99999, 0.999994, 0.999997, 0.999998, 0.999999, 0.999999, 1.0, 1.0, 1.0, 1.0, 1.0,
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	1.0, 1.0, 1.0
];
/** Page's coefficient: Gamma_2 -> (256/225) x^6 for long waves. */
export const PAGE = 256 / 225;
/** The factor of the sum, 5/32 pi: the sum in units of M r_s^2 is the integral of K Gamma_2 / x^4. */
export const K = 5 / (32 * Math.PI);

// ln Gamma_2 against ln x, a natural cubic spline through the grid's points (the grid is even in ln x)
const H = Math.log(X1 / X0) / STEPS;
const LN = GAMMA2.map(Math.log);
const CURV = (() => {
	// the second derivatives: M_(i-1) + 4 M_i + M_(i+1) = 6 (y_(i+1) - 2 y_i + y_(i-1)) / h^2, M_0 = M_n = 0
	const n = STEPS, M = new Array(n + 1).fill(0), c = new Array(n + 1).fill(0), d = new Array(n + 1).fill(0);
	for (let i = 1; i < n; i++) {
		const rhs = (6 * (LN[i + 1] - 2 * LN[i] + LN[i - 1])) / (H * H);
		const m = 4 - (i > 1 ? c[i - 1] : 0);
		c[i] = 1 / m;
		d[i] = (rhs - (i > 1 ? d[i - 1] : 0)) / m;
	}
	for (let i = n - 1; i >= 1; i--) M[i] = d[i] - c[i] * M[i + 1];
	return M;
})();

/** Gamma_2: the spline on the grid; below it, Page's law scaled to the grid's first point; above it, 1. */
export function gamma2(x) {
	if (x <= X0) return PAGE * x ** 6 * (GAMMA2[0] / (PAGE * X0 ** 6));
	if (x >= X1) return 1;
	const t = Math.log(x / X0) / H, i = Math.min(STEPS - 1, Math.floor(t)), a = i + 1 - t, b = t - i;
	const y = a * LN[i] + b * LN[i + 1] + ((a ** 3 - a) * CURV[i] + (b ** 3 - b) * CURV[i + 1]) * (H * H) / 6;
	return Math.min(1, Math.exp(y));
}
/** The integrand of the sum, (5/32 pi) Gamma_2 / x^4, in units of M r_s^2; Page's line and the swallowing tail. */
export const integrand = (x) => (K * gamma2(x)) / x ** 4;
export const pageLine = (x) => K * PAGE * x * x;
export const tail = (x) => K / x ** 4;

/** int Gamma_2 x^-4 dx from a to b (0.01 <= a < b <= 3): Simpson's rule in ln x on the spline, 2000 steps a decade. */
export function moment(a, b) {
	const u0 = Math.log(a), u1 = Math.log(b), n = 2 * Math.ceil((1000 * (u1 - u0)) / Math.LN10), h = (u1 - u0) / n;
	let s = 0;
	for (let k = 0; k <= n; k++) {
		const x = Math.exp(u0 + k * h), w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2;
		s += w * gamma2(x) * x ** -3;
	}
	return (s * h) / 3;
}
/** The whole integral, 6.938: Page's law below the grid, 1 above it. */
export const I2 = (GAMMA2[0] / X0 ** 6) * X0 ** 3 / 3 + moment(X0, X1) + X1 ** -3 / 3;

/** The peak of the integrand, from the solver itself (bounded search on transmission(2, x), to 10^-7 in x). */
export const PEAK = { x: 0.403299, value: 1.3419 };

// ---- the radii -------------------------------------------------------------------------------------------------------
export const DEGREES = [2, 3, 4, 5, 6, 7, 8];
/** R_l / r_s, holeresponse.degree_shell_radius (app/src/lib/hair/hole.ts, asserted in `chapter`). */
export const RADII = {
	2: 1.0174643409453468, 3: 1.4555090113354818, 4: 1.6100253369693853, 5: 1.6867888617185482,
	6: 1.7324117426592052, 7: 1.7626025918635315, 8: 1.784053180213854
};
export const PHOTON = 1.5;                                  // the photon sphere, r_s
export const BC = (3 * Math.sqrt(3)) / 2;                   // the critical impact parameter, r_s
export const LIMIT = (3 * Math.sqrt(3)) / Math.E;           // R_l as l grows, r_s
const dfact = (l) => { let p = 1; for (let k = 1; k <= 2 * l + 1; k += 2) p *= k; return p; };
/** The shell prefactor [(2l+1)!!]^2 (l-1) / [2 pi (2l+1)(l+1)(l+2)], 15/8 pi at l = 2. */
export const prefactor = (l) => (dfact(l) ** 2 * (l - 1)) / (2 * Math.PI * (2 * l + 1) * (l + 1) * (l + 2));
/** The step absorber with the impact parameter beta GM/c^2 (b_c: beta = 3 sqrt 3): R_l / r_s. */
export function stepRadius(l, beta = 3 * Math.sqrt(3)) {
	// in logarithms, so that large l does not overflow (holeresponse.sharp_shell_radius)
	let lnDf = 0;
	for (let k = 3; k <= 2 * l + 1; k += 2) lnDf += Math.log(k);
	const lnPref = 2 * lnDf + Math.log((l - 1) / (2 * Math.PI * (2 * l + 1) * (l + 1) * (l + 2)));
	const lnMoment = (1 - 2 * l) * Math.log((l + 0.5) / beta) - Math.log(2 * l - 1);
	return Math.exp((lnPref + lnMoment) / (2 * l - 2)) / 2;
}
export const STEP = Object.fromEntries([2, 3, 4, 5, 6, 7, 8].map((l) => [l, stepRadius(l)]));

// ---- the test --------------------------------------------------------------------------------------------------------
/** m_1, m_2, m_3 from the radii R_2, R_3, R_4. */
export const fromRadii = (R) => [R[2] ** 2, R[3] ** 4, R[4] ** 6];
export const HOLE_M = fromRadii(RADII);
export const STEP_M = fromRadii(STEP);
/** The uniform ball with the hole's mass and m_1: m_k = 3 R^(2k) / (2k + 3), R = sqrt(5 m_1 / 3). */
export const BALL_R = Math.sqrt((5 * HOLE_M[0]) / 3);
export const BALL_M = [1, 2, 3].map((k) => (3 * BALL_R ** (2 * k)) / (2 * k + 3));
export const test = (m, a) => m[2] - 2 * a * m[1] + a * a * m[0];
export const least = (m) => ({ a: m[1] / m[0], value: m[2] - (m[1] * m[1]) / m[0] });
/** Where the test is zero (the smaller and the larger root), if it dips below zero. */
export const roots = (m) => { const d = Math.sqrt(m[1] * m[1] - m[0] * m[2]); return [(m[1] - d) / m[0], (m[1] + d) / m[0]]; };

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/thermometer.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- Gamma_2 against chapter 11.3's table, and its integrals against the chapter
	{
		const ts = await (await fetch('/app/src/lib/tutorial/live/hole-against-sky-data.ts')).text();
		const xs = ts.match(/export const X[^=]*=\s*\[([\s\S]*?)\]/)[1].split(',').map(Number);
		const row = ts.match(/\{\s*l: 2,\s*from: (\d+),\s*values: \[([\s\S]*?)\]/);
		check(row && +row[1] === 0, 'the row l = 2 does not start at the table\'s first x');
		const vs = row[2].split(',').map(Number);
		let worst = 0;
		for (let i = 0; i < vs.length && xs[i] <= 0.78 + 1e-9; i++) worst = Math.max(worst, Math.abs(gamma2(xs[i]) / vs[i] - 1));
		check(worst < 1e-3, `Gamma_2 differs from chapter 11.3's table by ${worst}`);
	}
	check(X.length === GAMMA2.length && near(X.at(-1), X1, 1e-12), 'the grid');
	for (let i = 1; i <= STEPS; i++) check(GAMMA2[i] >= GAMMA2[i - 1] && GAMMA2[i] <= 1, `Gamma_2 does not rise to 1 at ${X[i]}`);
	check(near(GAMMA2[0] / (PAGE * X0 ** 6), 1.070, 1e-3), 'Gamma_2 at 0.01 is not 1.07 times Page\'s');
	has(r`Its integral is $\int_0^\infty\Gamma_2x^{-4}\, \dd x = 6.938$`, 'the integral');
	check(I2.toFixed(3) === '6.938', `the integral is ${I2}`);
	has(r`0.345\,\matter Mr_s^2`, 'the sum');
	check((K * I2).toFixed(3) === '0.345', 'the sum is not 0.345');
	has(r`Only 0.3% of the sum lies below $x = 0.2$, and three quarters between 0.3 and 0.6`, 'the shares');
	const low = (GAMMA2[0] / X0 ** 6) * X0 ** 3 / 3 + moment(X0, 0.2), band = moment(0.3, 0.6);
	check((100 * low / I2).toFixed(1) === '0.3', `the share below 0.2 is ${low / I2}`);
	check(Math.round((100 * band) / I2) === 74, `the share between 0.3 and 0.6 is ${band / I2}`);
	has(r`The integrand $(5/32\pi)\Gamma_2/x^4$ peaks at $x = 0.40$`, 'the peak');
	{
		// the spline's peak, by golden section, against the solver's
		let lo = 0.38, hi = 0.43;
		const g = (Math.sqrt(5) - 1) / 2;
		for (let k = 0; k < 80; k++) { const p = hi - g * (hi - lo), q = lo + g * (hi - lo); if (integrand(p) > integrand(q)) hi = q; else lo = p; }
		const at = (lo + hi) / 2;
		check(Math.abs(at - PEAK.x) < 2e-4 && Math.abs(integrand(at) / PEAK.value - 1) < 1e-4 && Math.abs(integrand(PEAK.x) / PEAK.value - 1) < 1e-4, `the spline's peak ${integrand(at)} at ${at}`);
		check(PEAK.x.toFixed(2) === '0.40' && PEAK.value.toFixed(2) === '1.34', 'the peak');
	}
	has(r`is far below $1/8\pi$ (11.4)`, 'the edge 1/8 pi');
	has(r`Page's limit $\Gamma_2 \approx \tfrac{256}{225}x^6$`, 'Page\'s limit');
	has(r`Above $x \approx 0.5$ the hole swallows nearly every quadrupole wave, $\Gamma_2 \approx 1$, and the integrand falls as $x^{-4}$`, 'the tail');

	// ---- the radii
	{
		const ts = await (await fetch('/app/src/lib/hair/hole.ts')).text();
		const body = ts.match(/export const HOLE_RADII[^{]*\{([\s\S]*?)\}/)[1];
		const site = Object.fromEntries([...body.matchAll(/(\d+):\s*([\d.]+)/g)].map((m) => [+m[1], +m[2]]));
		for (const l of DEGREES) check(site[l] === RADII[l], `R_${l} is not the site's: ${site[l]}`);
	}
	has(r`The radii are $R_\ell/r_s = 1.0175$, $1.4555$, $1.6100$, $1.6868$ and $1.7324$ for $\ell = 2$ to 6`, 'the radii');
	check([2, 3, 4, 5, 6].map((l) => RADII[l].toFixed(4)).join() === '1.0175,1.4555,1.6100,1.6868,1.7324', 'the radii');
	for (let l = 3; l <= 8; l++) check(RADII[l] > RADII[l - 1] && RADII[l] < LIMIT, `R_${l} does not climb below the limit`);
	check(near(Math.sqrt(prefactor(2) * I2) / 2, RADII[2], 1e-4) && near(prefactor(2), 15 / (8 * Math.PI), 1e-15), 'R_2 from the integral');
	has(r`R_\ell \to \frac{3\sqrt3}{e}\,r_s = 1.91\,r_s`, 'the limit');
	has(r`= 3\sqrt3\,G\matter M/c^2 = 2.60\,r_s`, 'b_c');
	has(r`between the photon sphere at $1.5\,r_s$ and $b_c$`, 'the photon sphere');
	has(r`its radii are $0.668$, $1.226$, $1.459$, $1.580$ and $1.652\,r_s$ for $\ell = 2$ to 6`, 'the step radii');
	check([2, 3, 4, 5, 6].map((l) => STEP[l].toFixed(3)).join() === '0.668,1.226,1.459,1.580,1.652', 'the step radii');
	for (const l of DEGREES) check(STEP[l] < RADII[l], `the step's R_${l} is not below the hole's`);
	check(Math.abs(stepRadius(4000) / LIMIT - 1) < 2e-3, 'the step radii do not tend to the limit');
	check(LIMIT.toFixed(2) === '1.91' && BC.toFixed(2) === '2.60', 'the limit and b_c');

	// ---- the test
	has(r`From the unrounded radii, $$m_1 = 1.0352\,r_s^2 , \qquad m_2 = 4.4881\,r_s^4 , \qquad m_3 = 17.418\,r_s^6 ,$$`, 'the moments');
	check(HOLE_M[0].toFixed(4) === '1.0352' && HOLE_M[1].toFixed(4) === '4.4881' && HOLE_M[2].toFixed(3) === '17.418', `the moments ${HOLE_M}`);
	has(r`m_3 - \frac{m_2^2}{m_1} = -2.04\,r_s^6\quad\text{at } a = 4.335\,r_s^2`, 'the least value');
	const h = least(HOLE_M), s = least(STEP_M), b = least(BALL_M);
	check(h.value.toFixed(3) === '-2.039' && h.a.toFixed(3) === '4.335', `the hole's least ${h.value} at ${h.a}`);
	check(s.value.toFixed(3) === '-1.787' && s.a.toFixed(3) === '5.060', `the step's least ${s.value} at ${s.a}`);
	check(b.value.toFixed(4) === '0.1398' && b.a.toFixed(4) === '1.2324' && BALL_R.toFixed(4) === '1.3135', `the ball's least ${b.value} at ${b.a}`);
	has(r`$m_2^2/m_1m_3 = 1.117$, above 1`, 'the hole\'s ratio');
	check((HOLE_M[1] ** 2 / (HOLE_M[0] * HOLE_M[2])).toFixed(3) === '1.117', 'the hole\'s ratio');
	has(r`the ratio $45/49 = 0.918$`, 'the ball\'s ratio');
	check(near(BALL_M[1] ** 2 / (BALL_M[0] * BALL_M[2]), 45 / 49, 1e-12), 'the ball\'s ratio');
	has(r`It is 1.185, worse than the hole's.`, 'the step\'s ratio');
	check((STEP_M[1] ** 2 / (STEP_M[0] * STEP_M[2])).toFixed(3) === '1.185', 'the step\'s ratio');
	check([1, 4, 9].every((bt) => { const m = fromRadii(Object.fromEntries([2, 3, 4].map((l) => [l, stepRadius(l, bt)]))); return near(m[1] ** 2 / (m[0] * m[2]), STEP_M[1] ** 2 / (STEP_M[0] * STEP_M[2]), 1e-9); }), 'the step\'s ratio depends on beta');

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, has, state };
}
