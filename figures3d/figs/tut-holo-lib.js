// Shared numbers for the four diagrams of the tutorial's chapter 13.8 (tutorial/what-a-field-keeps/holography.md):
// tut-breathing-stone, tut-holo-table, tut-cells-vs-snr and tut-dp-fields. Not a figure itself. The sheet, strokes,
// labels and cropping are chapters 1.2 to 13.7's (figs/tut-pot-lib.js), the plots and axes chapter 3.1's
// (figs/tut-prob-lib.js), matter's and the field's colours chapter 7.4's (figs/tut-linear-lib.js, asserted against
// app.css by `palette(check)`), all imported, not copied.
//
// The colours: orange and blue mean a stretch and a squeeze in the tutorial's figures and none of these needs them.
// Matter's colour marks the stone's density, the pushing count (cells of the interior) and the two bodies' fields of
// the Diosi-Penrose plot, as the diagram comments ask; the field's colour the monopole outside and the looking count
// (numbers of the field); everything else is ink and the page's greys.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the breathing stone: I_r(t) = M a^2 (0.8 - 0.2 cos wt), 0.6 M a^2 for the uniform ball at t = 0 and M a^2 for the
//    thin shell at t = T/2, the text's "0.6 against 1"; the thick shell drawn at T/4, I_r = 0.8 M a^2, has the outer
//    radius a and the inner radius x a with (3/5)(1 - x^5)/(1 - x^3) = 0.8, x = 0.7625, and the density 1/(1 - x^3) =
//    1.80 times the ball's; Iddot_r = 0.2 M a^2 w^2 cos wt, so the boxed monopole is -(GM/r)[1 + (wa/c)^2 cos(wt_r)/30];
//    for the drawn stone, a = 10 cm swinging at 1 kHz, (wa/c)^2/30 = 1.46 x 10^-13, drawn magnified 10^12 times (0.146);
//    Blanchet and Damour's three terms of order 1/c^2 in units of int T^ii dV / c^2: 1 (the stress), (1/6)(2) = 1/3 (the
//    r^2 term, from the virial identity) and -(4/3)(1) (the current), whose sum is 0;
//  - the counts: N_1 = (floor(L/Lambda) + 1)^2, L = ln SNR, Lambda = ln 3; N_2 from the singular values of the
//    paired-tides model (tut-holo-spectrum.js, below), asserted against the text's table (271, 1682, 2.17 x 10^4,
//    2.52 x 10^5, d/a = 0.25, 0.14, 0.058, 0.026) and the comment's 46 at 10^3 and 1,227,687 at 10^120; the ceilings
//    S_BH / 2 pi = l_r^2 / 2 l_P^2 for one metre and for the Hubble radius, 1.37 x 10^26 m: 1.9 x 10^69 and
//    3.6 x 10^121, ln SNR 160 and 280, and the counts there, 2.4 x 10^5 and 1.28 x 10^6 (the text's sparseness table);
//    kappa = Lambda^3 int_0^1/2 (2/3)(1 - 2p) dp / [Lambda + h(p)]^3 = 0.0733, the text's 0.073; d/a = (4 pi / 3 N_2)^(1/3);
//  - the Diosi-Penrose fields: the ball's G M r / R^3 inside, the shell's zero, both G M / r^2 outside; the integral of
//    (r/R)^4 from 0 to R, R/5, gives E_G = (1/8 pi G)(GM/R^3)^2 4 pi R^5 / 5 = G M^2 / 10 R, the text's boxed result.
//
// tut-holo-spectrum.js holds, for each sector l = 0 to 278, the thresholds t = ln(sigma_top / sigma) of every singular
// value sigma of the model with t < 300.5, to three places: the multiple-precision singular values of exact.py's model
// (design/research/holography/scripts/paired-tides, core.py's weights for point masses on the sphere R_c = 3a, every
// ordered pair of directions one datum), computed once for every sector down to e^-335 of the top one with twenty rungs
// past the pivot count, and found unchanged below 300 (to 10^-6) when the rungs past it were halved. A singular value
// counts 2l + 1 times once ln SNR passes its threshold, so N_2(L) = sum over sectors of (2l + 1) #{t < L}, exact at
// every L, the counts.out table's values included.
import { palette, MATTER, FIELD } from './tut-linear-lib.js';
import { SPECTRUM } from './tut-holo-spectrum.js';

export { MATTER, FIELD };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the breathing stone ---------------------------------------------------------------------------------------------
export const IR = (phase) => 0.8 - 0.2 * Math.cos(2 * Math.PI * phase);     // I_r / M a^2 at t = phase T
export const IR_DDOT = (phase) => 0.2 * Math.cos(2 * Math.PI * phase);      // Iddot_r / M a^2 w^2
export const STONE = { a: 0.1, f: 1e3 };                                    // m, Hz: the drawn stone
export const C = 2.99792458e8;
export const WAC2 = (2 * Math.PI * STONE.f * STONE.a / C) ** 2;            // (w a / c)^2
export const MAG = 1e12;                                                    // the ripple's magnification
/** The boxed monopole outside, at the retarded time phase T, in units of G M / r, the ripple magnified `mag` times. */
export const monopole = (phase, mag = 1) => -(1 + (mag * WAC2 * IR_DDOT(phase)) / 6);
/** A uniform shell of outer radius a and inner radius x a: I_r / M a^2. */
export const shellIR = (x) => (x < 1e-9 ? 0.6 : (0.6 * (1 - x ** 5)) / (1 - x ** 3));
/** The inner radius / a of the shell with I_r = v M a^2, 0.6 <= v < 1, by bisection. */
export function innerFor(v) {
	let lo = 0, hi = 1 - 1e-12;
	for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (shellIR(m) < v) lo = m; else hi = m; }
	return (lo + hi) / 2;
}
export const THICK = innerFor(IR(0.25));                                    // 0.7625
export const BARS = [1, (1 / 6) * 2, -(4 / 3) * 1];                         // stress, r^2 term, current

// ---- the counts ----------------------------------------------------------------------------------------------------
export const LAM = Math.log(3);
export const N1 = (L) => (Math.floor(L / LAM) + 1) ** 2;
/** Every jump of N_2: [threshold, 2l + 1], sorted. */
export const JUMPS = SPECTRUM.flatMap((ts, l) => ts.map((t) => [t, 2 * l + 1])).sort((p, q) => p[0] - q[0]);
export const N2 = (L) => { let n = 0; for (const [t, m] of JUMPS) { if (t >= L) break; n += m; } return n; };
export const dOverA = (N) => ((4 * Math.PI) / (3 * N)) ** (1 / 3);
const h = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log(p) - (1 - p) * Math.log(1 - p));
/** kappa, by Simpson's rule on 20000 intervals. */
export const KAPPA = (() => {
	const n = 20000, f = (p) => ((2 / 3) * (1 - 2 * p)) / (LAM + h(p)) ** 3;
	let s = f(0) + f(0.5);
	for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * f((0.5 * k) / n);
	return (LAM ** 3 * s * 0.5) / n / 3;
})();
export const G = 6.6743e-11, HBAR = 1.054571817e-34;
export const LP2 = (HBAR * G) / C ** 3;
/** The ceiling S_BH / 2 pi = l_r^2 / 2 l_P^2 of a region of radius l_r metres. */
export const ceiling = (l) => (l * l) / (2 * LP2);
export const REGIONS = { metre: 1, hubble: 1.37e26 };

// ---- the Diosi-Penrose fields --------------------------------------------------------------------------------------
/** The fields in units of G M / R^2 at u = r / R. */
export const gBall = (u) => (u <= 1 ? u : 1 / (u * u));
export const gShell = (u) => (u < 1 ? 0 : 1 / (u * u));
/** int_0^1 u^4 du by Simpson's rule: 1/5. */
export const FIFTH = (() => { const n = 1000; let s = 1; for (let k = 1; k < n; k++) s += (k % 2 ? 4 : 2) * (k / n) ** 4; return s / n / 3; })();

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/holography.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the breathing stone
	has(r`\field\Phi_0 = -\frac{G}{r}\Bigl[\matter M + \frac{\ddot I_r(t - r/c)}{6c^2}\Bigr] + O(c^{-4})`, 'the boxed monopole');
	has(r`which tells a ball from a shell, 0.6 against 1 in units of $\matter Ma^2$`, 'the ball and the shell');
	check(near(IR(0), 0.6) && near(IR(0.5), 1) && near(shellIR(0), 0.6) && Math.abs(shellIR(1 - 1e-6) - 1) < 1e-5, 'I_r of the ball and the shell');
	check(THICK.toFixed(4) === '0.7625' && near(shellIR(THICK), 0.8, 1e-12), `the thick shell's inner radius ${THICK}`);
	{
		// Iddot_r by central differences of I_r, in units of M a^2 w^2 (w = 2 pi / T, phase = t / T)
		const d = 1e-4, w = 2 * Math.PI;
		for (const p of [0, 0.13, 0.25, 0.6, 1.7]) check(Math.abs((IR(p + d) - 2 * IR(p) + IR(p - d)) / (d * d) / (w * w) - IR_DDOT(p)) < 1e-6, `Iddot_r at ${p}`);
	}
	check((WAC2 / 30).toPrecision(3) === '1.46e-13' && (MAG * WAC2 / 30).toFixed(3) === '0.146', `the ripple ${WAC2 / 30}`);
	has(r`$\ddot I_r$ is at most $\tfrac65\matter Ma\delta\omega^2$, and the ripple is $\tfrac15(\omega a/c)^2(\delta/a) = 5\times10^{-13}$ of the static pull`, 'the breathing ball\'s ripple');
	check(((2 * Math.PI * 24e3 * 0.1 / C) ** 2 * 1e-3 / 5).toPrecision(1) === '5e-13', 'the breathing ball\'s 5 x 10^-13');
	has(r`$1 + \tfrac13 - \tfrac43 = 0$`, 'the three terms');
	has(r`&\quad + \frac{1}{6c^4}\frac{\dd^2}{\dd t^2}\int\matter T^{00}r^2\,\dd V\\ &\quad - \frac{4}{3c^3}\frac{\dd}{\dd t}\int x_i\matter T^{0i}\,\dd V ,`, 'Blanchet and Damour\'s terms');
	has(r`\frac{\dd}{\dd t}\int x_i\matter T^{0i}\,\dd V &= c\int\matter T^{ii}\,\dd V,\\ \frac{\dd^2}{\dd t^2}\int\matter T^{00}r^2\,\dd V &= 2c^2\int\matter T^{ii}\,\dd V ,`, 'the identities');
	check(near(BARS[0], 1) && near(BARS[1], 1 / 3) && near(BARS[2], -4 / 3) && Math.abs(BARS[0] + BARS[1] + BARS[2]) < 1e-15, 'the bars');

	// ---- the table's four entries and their sources
	has(r`The hologram loses exactly 2.5's null space.`, 'the null space');
	has(r`which differ by 2.5's confined Laplacian $\nabla^2\field\psi/4\pi G$`, 'the confined Laplacian');
	has(r`**light-cone transform**, its transform in space and time on the light cone $|\vect k| = \omega/c$ of wavevector and frequency (Devaney and Wolf, 1973)`, 'the light-cone transform');
	has(r`Bleistein and Cohen (1977) showed that these are the whole null space`, 'Bleistein and Cohen');
	has(r`by 11.1's Birkhoff theorem, so the two scenes give identical records forever`, 'Birkhoff');
	has(r`Watching leaves a null space either way. Pushing removes it with **logarithmic stability**, an error that falls only as one over the logarithm of the noise (13.2).`, 'the logarithm');
	has(r`Alessandrini proved logarithmic stability, and Mandache that no method beats a logarithm`, 'Alessandrini and Mandache');
	has(r`reads its transform at wavevectors $|\vect q| \le 2\omega/c$ with **Hölder stability**, an error that falls as a power of the noise, to about half a wavelength (Stefanov and Uhlmann, stated)`, 'the short wave');
	has(r`**What it means.** Acting, not time, removes the null space.`, 'acting');

	// ---- the counts
	has(r`From three radii it is $13^2 = 169$ at $10^6$`, 'N_1 at 10^6');
	has(r`and $147^2 = 21{,}609$ at $10^{70}$`, 'N_1 at 10^70');
	check(N1(6 * Math.log(10)) === 169 && N1(70 * Math.log(10)) === 21609, 'N_1');
	has(r`from three radii $\kappa = 0.073$`, 'kappa');
	check(KAPPA.toFixed(4) === '0.0733', `kappa is ${KAPPA}`);
	const rows = [[6, 169, 271, '1.6', '0.25'], [12, 676, 1682, '2.5', '0.14'], [30, 3969, 21675, '5.5', '0.058'], [70, 21609, 251536, '11.6', '0.026']];
	const sci = (n) => { const e = Math.floor(Math.log10(n)), m = (n / 10 ** e).toFixed(2); return `$${m}\\times10^${e}$`; };
	for (const [e, n1, n2, ratio, d] of rows) {
		const L = e * Math.log(10);
		check(N1(L) === n1 && N2(L) === n2, `the counts at 10^${e}: ${N1(L)}, ${N2(L)}`);
		const dd = dOverA(n2), shown = dd >= 0.1 ? dd.toFixed(2) : dd.toPrecision(2);
		check(shown === d && (n2 / n1).toFixed(1) === ratio, `the row at 10^${e}: ${shown}, ${(n2 / n1).toFixed(1)}`);
		const cell = (n) => (n < 1e4 ? String(n) : sci(n));
		has(`| $10^{${e}}$ | ${cell(n1)} | ${cell(n2)} | ${ratio} | ${d} |`.replace('$10^{6}$', '$10^6$'), `the table's row at 10^${e}`);
	}
	check(N2(3 * Math.log(10)) === 46 && N2(120 * Math.log(10)) === 1227687 && N2(10 * Math.log(10)) === 1035, 'the counts at 10^3, 10^10 and 10^120');
	has(r`At $10^{70}$ the stone is resolved into about forty cells along a radius.`, 'forty cells');
	check(Math.round(1 / dOverA(N2(70 * Math.log(10)))) === 39, 'forty cells');
	has(r`each 0.026 of the radius across`, 'the opening\'s 0.026');
	has(r`Pushing gains about twelve, not a hundred.`, 'twelve');
	check(Math.round(N2(70 * Math.log(10)) / N1(70 * Math.log(10))) === 12, 'twelve');
	// the ceilings
	has(r`The ceiling is $1.9\times10^{69}$ for a region of radius one metre`, 'the ceiling of a metre');
	has(r`| one metre | $1.2\times10^{70}$ | 160 | $2.4\times10^5$ |`, 'the metre\'s row');
	has(r`| the Hubble radius, $1.37\times10^{26}$ m | $2.3\times10^{122}$ | 280 | $1.28\times10^6$ |`, 'the Hubble row');
	const metre = ceiling(REGIONS.metre), hubble = ceiling(REGIONS.hubble);
	check(metre.toPrecision(2) === '1.9e+69' && hubble.toPrecision(2) === '3.6e+121', `the ceilings ${metre}, ${hubble}`);
	check((2 * Math.PI * metre).toPrecision(2) === '1.2e+70' && (2 * Math.PI * hubble).toPrecision(2) === '2.3e+122', 'S_BH');
	check(Math.round(Math.log(metre)) === 160 && Math.round(Math.log(hubble)) === 280, 'ln SNR at the ceilings');
	check(N2(Math.log(metre)) === 243093 && N2(Math.log(hubble)) === 1276249, 'N_2 at the ceilings is not counts.py\'s');
	check(N2(Math.log(metre)).toPrecision(2) === '2.4e+5' && N2(Math.log(hubble)).toPrecision(3) === '1.28e+6', `N_2 at the ceilings ${N2(Math.log(metre))}, ${N2(Math.log(hubble))}`);
	// pushing passes looking between 10^3 and 10^6, and the ratio at 10^70
	check(N2(3 * Math.log(10)) < N1(3 * Math.log(10)) && N2(6 * Math.log(10)) > N1(6 * Math.log(10)), 'the crossing');

	// ---- the Diosi-Penrose energy
	has(r`&= \frac{1}{8\pi G}\Bigl(\frac{G\matter M}{R^3}\Bigr)^2\frac{4\pi R^5}{5} = \frac{G\matter M^2}{10R}`, 'E_G');
	has(r`with $\int_0^Rr^4\,\dd r = R^5/5$`, 'the integral');
	has(r`the shell's is zero inside, and the ball's is $G\matter Mr/R^3$`, 'the fields');
	check(near(FIFTH, 0.2, 1e-12), `the integral is ${FIFTH}`);
	{
		// E_G in units of G M^2 / R: (1/8 pi) int_0^1 u^2 4 pi u^2 du
		const eg = (1 / (8 * Math.PI)) * 4 * Math.PI * FIFTH;
		check(near(eg, 0.1, 1e-12), 'E_G is not G M^2 / 10 R');
	}
	for (const u of [0.3, 0.999, 1.0001, 1.7]) check(u < 1 ? near(gBall(u), u) && gShell(u) === 0 : near(gBall(u), gShell(u)), 'the fields');

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
