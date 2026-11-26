// Shared numbers for the three diagrams of the tutorial's section 8.7 (tutorial/quantum/quantum-fluctuation.md):
// tut-qfd-factor, tut-qfd-two-orders and tut-qfd-bounds. Not a figure itself. The palette is section 8.1's (read from
// app.css by `palette(check)`), hbar, k_B, the steel ball's note and silicon's Raman line section 8.3's
// (figs/tut-quanta-lib.js), the cart's complex response k chi(omega) section 4.1's (figs/tut-osc-lib.js, `kChi`), the
// relative `near` section 8.2's, and the sheet, strokes, labels and cropping those of sections 6.1
// to 8.6 (figs/tut-pot-lib.js), all imported, not copied. Ink and the page's greys only: orange and blue, which mean a
// stretch and a squeeze, are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the factor: quantum over classical, hbar coth(hbar omega / 2 k_B T) / (2 k_B T / omega) = u coth u with
//    u = hbar omega / 2 k_B T, at least 1 (tanh u <= u), near 1 + u^2/3 when u is small and above u, its zero point,
//    by less than 1 and, far out, by 2 u e^{-2u}; 1.000008, 1.0008, 1.082, 5.0 and 50 at hbar omega / k_B T = 10^-2, 0.1, 1, 10 and 100;
//    the line 1 and the zero point u cross at hbar omega / k_B T = 2; the steel ball's 15.1 kHz at 300 K has
//    hbar omega / k_B T = 2.4 x 10^-9 (u = 1.2 x 10^-9, a correction u^2/3 of 4.9 x 10^-19), silicon's 15.6 THz
//    Raman line 2.50 (u = 1.25) and the ratio 1.47;
//  - the two orders: the cart chi = c^2 / (omega_0^2 - omega^2 - i Gamma omega) with Gamma = 0.08 omega_0 (Q = 12.5),
//    its Im chi odd, in units of hbar Im chi(omega_0); S(omega) = 2 hbar Im chi / (1 - e^{-hbar omega / k_B T}),
//    S(-omega) = e^{-hbar omega / k_B T} S(omega), S(omega) - S(-omega) = 2 hbar Im chi, the average S-bar =
//    hbar coth(hbar omega / 2 k_B T) Im chi, and 2 k_B T Im chi / omega below it, at many frequencies; at
//    k_B T = hbar omega_0 the heights at +-omega_0 are 2(nbar + 1) = 3.164, 2 nbar = 1.164, 2 nbar + 1 = coth 1/2 =
//    2.164 and 2.0, in the ratio e = 2.72 (the curves' maxima, a hair inside +-omega_0, are within 0.3 per cent of
//    these); at k_B T = 0.1 hbar omega_0 the emission's height is 9 x 10^-5, the dashed ones 1.0001 and S-bar half the
//    absorption;
//  - the bounds: five undamped modes at omega_1, 2, 4, 8 and 16 omega_1, c_n^2 = 0.2 chi_0 omega_n^2, so that each
//    holds a fifth of chi_0 and the weight mu has 0.2 at each; A = sum c_n^2 = 68.2 chi_0 omega_1^2, sqrt(A / chi_0) =
//    8.26 omega_1; in units of hbar omega_1 chi_0 at t = k_B T / hbar omega_1, the jitter (1/2) sum (c_n^2 / omega_n)
//    coth(omega_n / 2t), equal to the average of (1/2) chi_0 omega coth over mu, the lower bound t and the upper
//    (1/2) sqrt(A chi_0) coth(sqrt(A / chi_0) / 2t); the jitter between them at every t from 10^-3 to 10^3; 3.10 at
//    zero against 4.13 (0.75 of it), 3.29, 4.45, 10.55 and 100.06 at t = 1, 3, 10 and 100.
import { HBAR, KB, TEMP, W_BALL, RAMAN, palette, near } from './tut-quanta-lib.js';
import { kChi } from './tut-osc-lib.js';

export { HBAR, KB, TEMP, palette, near };

const coth = (u) => 1 / Math.tanh(u);

// ---- the factor ----------------------------------------------------------------------------------------------------
/** Quantum over classical, u coth u, at x = hbar omega / k_B T (u = x / 2); 1 + u^2/3 below u = 10^-4. */
export const factor = (x) => { const u = x / 2; return u < 1e-4 ? 1 + (u * u) / 3 : u * coth(u); };
/** The zero point's share, hbar omega / 2 k_B T. */
export const zeroPoint = (x) => x / 2;
export const FACTOR_AT = [[1e-2, '1.000008', 6], [0.1, '1.0008', 4], [1, '1.082', 3], [10, '5.0', 1], [100, '50', 0]];
export const ballX = () => (HBAR * W_BALL) / (KB * TEMP);
export const siliconX = () => (2 * Math.PI * HBAR * RAMAN) / (KB * TEMP);

// ---- the two orders ------------------------------------------------------------------------------------------------
export const Q_LINE = 12.5;
/** Im chi(omega) / Im chi(omega_0) at x = omega / omega_0 (section 4.1's k chi, whose Im is Q at omega_0). */
export const line = (x) => kChi(x, Q_LINE)[1] / Q_LINE;
/** In units of hbar Im chi(omega_0), at x = omega / omega_0 and t = k_B T / hbar omega_0: S(omega), S-bar, classical. */
export const spec = (x, t) => (x === 0 ? 2 * t * (line(1e-9) / 1e-9) : (2 * line(x)) / -Math.expm1(-x / t));
export const specBar = (x, t) => (x === 0 ? 2 * t * (line(1e-9) / 1e-9) : line(x) * coth(x / (2 * t)));
export const classical = (x, t) => (x === 0 ? 2 * t * (line(1e-9) / 1e-9) : (2 * t * line(x)) / x);
export const nbarOf = (t) => 1 / Math.expm1(1 / t);
export const WARM = 1, COLD = 0.1;       // k_B T / hbar omega_0 of the panel and of the inset

// ---- the bounds ----------------------------------------------------------------------------------------------------
export const MODES = [1, 2, 4, 8, 16];   // omega_n / omega_1
export const SHARE = 0.2;                // each mode's share of chi_0
/** c_n^2 in units of chi_0 omega_1^2. */
export const weight = (w) => SHARE * w * w;
export const A_SUM = MODES.reduce((s, w) => s + weight(w), 0);   // A / chi_0 omega_1^2
export const RMS = Math.sqrt(A_SUM);     // sqrt(A / chi_0) / omega_1
/** (1/2) w coth(w / 2t), in units of hbar omega_1, at t = k_B T / hbar omega_1 (its limit w / 2 at t = 0). */
const half = (w, t) => (t === 0 ? w / 2 : (w / 2) * coth(w / (2 * t)));
/** The jitter, the lower bound and the upper, in units of hbar omega_1 chi_0. */
export const jitter = (t) => MODES.reduce((s, w) => s + (weight(w) / (w * w)) * half(w, t), 0);
export const lower = (t) => t;
export const upper = (t) => half(RMS, t);
export const JITTER_AT = [[0, '3.10'], [1, '3.29'], [3, '4.45'], [10, '10.55'], [100, '100.06']];

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/quantum-fluctuation.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const sig = (v, d) => Number(v).toPrecision(d);

	// ---- the factor
	has('$$\\boxed{\\bar S_{yy}(\\omega) = \\hbar\\coth\\frac{\\hbar\\omega}{2\\kB T}\\,\\mathrm{Im}\\,\\chi_{yy}(\\omega)} . \\label{eq:qfdt}$$', 'the theorem');
	has('When $\\hbar\\omega \\ll \\kB T$, $\\hbar\\coth(\\hbar\\omega/2\\kB T) \\to 2\\kB T/\\omega$', 'the classical limit');
	has('The quantum factor is the classical one times $u\\coth u \\approx 1 + u^2/3$, with $u = \\hbar\\omega/2\\kB T$', 'the factor');
	has('For the steel ball\'s trial mode at 15.1 kHz and 300 K, $u = 1.2\\times10^{-9}$ and the correction is $4.9\\times10^{-19}$', 'the ball\'s u');
	has('For silicon\'s 15.6 THz Raman line (8.3) at 300 K, $u = 1.25$ and the quantum tremor is 1.47 times the classical one', 'silicon\'s ratio');
	has('As $T \\to 0$, $\\coth \\to 1$ at positive frequencies, and there a body keeps the tremor $\\hbar\\,\\mathrm{Im}\\,\\chi_{yy}$', 'the cold limit');
	has('Since $\\tanh u \\le u$, $u\\coth u \\ge 1$', 'the lower bound of the factor');
	for (let i = 0; i <= 400; i++) {
		const x = 1e-3 * 10 ** (i / 80);
		const u = x / 2, f = factor(x);
		// the definition: hbar coth over 2 k_B T / omega, in SI at 300 K
		const w = (x * KB * TEMP) / HBAR, ratio = (HBAR / Math.tanh((HBAR * w) / (2 * KB * TEMP))) / ((2 * KB * TEMP) / w);
		check(near(f, ratio, 1e-9), `the factor at ${x} is not hbar coth over 2 k_B T / omega`);
		check(f >= 1 && f >= u && f - u <= 1 && (u < 3 || f - u <= 2.01 * u * Math.exp(-2 * u) + 1e-14 * u), `the factor at ${x} is outside its bounds`);
		if (u < 0.05) check(Math.abs(f - 1 - (u * u) / 3) <= (u ** 4) / 40, `the factor at ${x} is not 1 + u^2/3`);
	}
	for (const [x, s, d] of FACTOR_AT) check(factor(x).toFixed(d) === s, `the factor at ${x} is ${factor(x)}, not ${s}`);
	check(near(zeroPoint(2), 1, 1e-15), 'the zero point does not cross 1 at 2');
	const bx = ballX(), sx = siliconX();
	check(sig(bx, 2) === '2.4e-9' && sig(bx / 2, 2) === '1.2e-9' && sig((bx / 2) ** 2 / 3, 2) === '4.9e-19', `the ball's hbar omega / k_B T ${bx}`);
	check((W_BALL / (2 * Math.PI) / 1e3).toFixed(1) === '15.1', `the ball's note ${W_BALL / (2 * Math.PI)}`);
	check(sx.toFixed(2) === '2.50' && (sx / 2).toFixed(2) === '1.25' && factor(sx).toFixed(2) === '1.47', `silicon at ${sx}, ratio ${factor(sx)}`);

	// ---- the two orders
	has('its line at $-\\omega_0$ is weaker than the one at $+\\omega_0$ by $\\bar n/(\\bar n + 1) = e^{-\\hbar\\omega_0/\\kB T}$', 'the ratio of the lines');
	has('$$S_{yy}(-\\omega) = e^{-\\hbar\\omega/\\kB T}\\,S_{yy}(\\omega) ,$$', 'detailed balance');
	has('&= 2\\hbar\\,(\\bar n + 1)\\,\\mathrm{Im}\\,\\chi_{yy}(\\omega) ,\\\\ S_{yy}(-\\omega) &= 2\\hbar\\,\\bar n\\,\\mathrm{Im}\\,\\chi_{yy}(\\omega) ,', 'the two spectra');
	has('&= 2\\hbar\\,\\mathrm{Im}\\,\\chi_{yy}(\\omega) .\\end{aligned}$$', 'their difference');
	has('positive frequencies are **absorption**, negative ones **emission**', 'absorption and emission');
	has('At absolute zero only the ground state has weight, so $S_{yy}(-\\omega) = 0$', 'the cold emission');
	has('$\\chi = c^2/(\\omega_0^2 - \\omega^2 - i\\Gamma\\omega)$', 'the damped mode');
	has('By [](#eq:x2) it is $\\coth\\tfrac12 = 2.16$ times $x_{\\rm zp}^2$, against the classical 2.', 'coth 1/2');
	check(near(Q_LINE * 0.08, 1, 1e-15), 'Q = 12.5 is not Gamma = 0.08 omega_0');
	for (let i = -300; i <= 300; i++) {
		const x = i / 75;
		const g = 0.08, c = x / ((1 - x * x) ** 2 + g * g * x * x);
		check(near(line(x), c * g * g, 1e-12) && near(line(1), 1, 1e-15) && near(line(-x), -line(x), 1e-15), `Im chi at ${x} is not the damped mode's, or not odd`);
		if (i === 0) continue;
		for (const t of [WARM, COLD]) {
			check(near(spec(-x, t), Math.exp(-x / t) * spec(x, t), 1e-9), `detailed balance at ${x}, ${t}`);
			check(near(spec(x, t) - spec(-x, t), 2 * line(x), 1e-9), `the difference at ${x}, ${t}`);
			check(near((spec(x, t) + spec(-x, t)) / 2, specBar(x, t), 1e-9), `the average at ${x}, ${t}`);
			if (x > 0) check(near(spec(x, t), 2 * (nbarOf(t / x) + 1) * line(x), 1e-9) && near(spec(-x, t), 2 * nbarOf(t / x) * line(x), 1e-9), `S is not 2 (nbar + 1) and 2 nbar times Im chi at ${x}, ${t}`);
			check(specBar(x, t) >= classical(x, t) * (1 - 1e-12), `S-bar is below the classical at ${x}, ${t}`);
		}
	}
	const n1 = nbarOf(WARM), n0 = nbarOf(COLD);
	check(spec(1, WARM).toFixed(3) === '3.164' && spec(-1, WARM).toFixed(3) === '1.164' && specBar(1, WARM).toFixed(3) === '2.164' &&
		near(specBar(-1, WARM), specBar(1, WARM), 1e-12) && near(classical(1, WARM), 2, 1e-12) && near(classical(-1, WARM), 2, 1e-12), 'the warm heights');
	check(near(spec(1, WARM), 2 * (n1 + 1), 1e-12) && near(spec(-1, WARM), 2 * n1, 1e-12) && near(specBar(1, WARM), coth(0.5), 1e-12), 'the heights are not 2(nbar + 1), 2 nbar and coth 1/2');
	check(near(spec(1, WARM) / spec(-1, WARM), Math.E, 1e-12) && Math.E.toFixed(2) === '2.72', 'the ratio is not e');
	{
		const top = (f, a, b) => { let y = -Infinity; for (let i = 0; i <= 40000; i++) y = Math.max(y, f(a + ((b - a) * i) / 40000)); return y; };
		for (const [f, a, h] of [[(x) => spec(x, WARM), 0.9, 3.164], [(x) => spec(x, WARM), -1.1, 1.164], [(x) => specBar(x, WARM), 0.9, 2.164], [(x) => classical(x, WARM), 0.9, 2]]) {
			const m = top(f, a, a + 0.2);
			check(m >= h && m <= h * 1.003, `a maximum ${m} is not within 0.3 per cent of ${h}`);
		}
	}
	check(spec(-1, COLD).toExponential(0) === '9e-5' && specBar(1, COLD).toFixed(4) === '1.0001' && near(specBar(1, COLD) / spec(1, COLD), 0.5, 1e-4) && near(2 * n0, spec(-1, COLD), 1e-15), `the cold heights ${spec(-1, COLD)}, ${specBar(1, COLD)}`);

	// ---- the bounds
	has('$$\\langle\\delta y^2\\rangle = \\int\\tfrac12\\hbar\\chi_0\\,\\omega\\coth\\frac{\\hbar\\omega}{2\\kB T}\\,\\mu(\\dd\\omega) .$$', 'the jitter');
	has('$$\\boxed{\\begin{aligned}\\kB T\\chi_0 &\\le \\langle\\delta\\matter Q_h^2\\rangle\\\\ &\\le \\frac\\hbar2\\sqrt{A\\chi_0}\\, \\coth\\Bigl(\\frac{\\hbar}{2\\kB T}\\sqrt{\\frac{A}{\\chi_0}}\\Bigr) ,\\end{aligned}}$$', 'the bounds');
	has('Far from equality, five modes an octave apart, each holding a fifth of $\\chi_0$, reach at absolute zero 0.75 of the upper bound', 'the five modes');
	has('When $\\hbar\\omega \\ll \\kB T$ wherever the friction lies, both bounds meet at $\\kB T\\chi_0$', 'the warm end');
	has('At absolute zero the lower bound vanishes but the jitter does not: it is the zero point of every mode, at most $\\tfrac12\\hbar\\sqrt{A\\chi_0}$', 'the cold end');
	// each mode a fifth of chi_0, the weight mu of total one, its mean of omega^2 A / chi_0
	check(MODES.every((w) => near(weight(w) / (w * w), SHARE, 1e-15)) && near(MODES.length * SHARE, 1, 1e-15), 'the modes do not each hold a fifth');
	check(near(A_SUM, 68.2, 1e-12) && RMS.toFixed(2) === '8.26' && upper(0).toFixed(2) === '4.13', `sqrt(A / chi_0) = ${RMS}, the bound at zero ${upper(0)}`);
	check(near(MODES.reduce((s, w) => s + SHARE * w * w, 0), A_SUM, 1e-12), 'the mean of omega^2 over mu is not A / chi_0');
	for (let i = 0; i <= 600; i++) {
		const t = 1e-3 * 10 ** (i / 100);
		const viaMu = MODES.reduce((s, w) => s + SHARE * half(w, t), 0);
		check(near(jitter(t), viaMu, 1e-12), `the jitter at ${t} is not the average over mu`);
		check(jitter(t) >= lower(t) * (1 - 1e-12) && jitter(t) <= upper(t) * (1 + 1e-12), `the jitter at ${t} is outside its bounds`);
		check(upper(t) >= lower(t), `the bounds cross at ${t}`);
	}
	for (const [t, s] of JITTER_AT) check(jitter(t).toFixed(2) === s, `the jitter at ${t} is ${jitter(t)}, not ${s}`);
	check((jitter(0) / upper(0)).toFixed(2) === '0.75' && (jitter(0) / upper(0)).toFixed(3) === '0.751', `the share at zero ${jitter(0) / upper(0)}`);
	check(near(jitter(1e-3), jitter(0), 1e-12) && near(upper(1e-3), upper(0), 1e-12), 'the curves are not flat at the left');
	check(Math.abs(upper(100) / lower(100) - 1) < 1e-3 && Math.abs(jitter(100) / lower(100) - 1) < 1e-3, 'the three do not meet on the right');
	return { md, bx, sx };
}
