// Shared numbers for the four diagrams of the tutorial's section 10.1 (tutorial/glow/black-body.md): tut-planck-shell,
// tut-planck-curves, tut-planck-integrals and tut-planck-moving. Not a figure itself. hbar is section 8.1's
// (figs/tut-quantum-lib.js), k_B section 4.1's (figs/tut-osc-lib.js), c section 7.1's (figs/tut-metric-lib.js), the
// observer's colour and the role check section 6.1's (figs/tut-lorentz-lib.js), Simpson's rule section 8.2's
// (figs/tut-operators-lib.js), and the sheet, strokes, labels and cropping those of sections 6.1 to 9.7
// (figs/tut-pot-lib.js), all imported, not copied. Temperatures and radiances are neutral (ink and the page's greys);
// orange and blue, which mean a stretch and a squeeze, are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the count of modes: the grid k = (2 pi / D)(n_1, n_2, n_3), one point per cell (2 pi / D)^3, the shell
//    4 pi k^2 dk D^3 / (2 pi)^3 = D^3 k^2 dk / 2 pi^2 (and in the plane 2 pi k dk D^2 / (2 pi)^2), and the count of
//    the grid's points in a ring and a shell against those areas;
//  - Planck's law: B_omega proportional to x^3 / (e^x - 1) at fixed T, x = hbar omega / k_B T, and the Rayleigh-Jeans
//    law to x^2, which it approaches as x -> 0 and exceeds by e - 1 = 72% at x = 1;
//  - the Bose integrals: int_0^inf x^n dx / (e^x - 1) = n! zeta(n + 1), by Simpson's rule against the sums, pi^2/6 =
//    1.645, 2 zeta(3) = 2.404 and pi^4/15 = 6.494, and the mean energy 2.701 k_B T;
//  - the peaks: the roots of x = n (1 - e^{-x}), 2.821 (n = 3), 1.594 (n = 2) and 4.965 (n = 5), each a maximum of
//    x^n / (e^x - 1), whose heights are 1.4214 and 0.6476; in hertz at 293, 700 and 1500 K, 17.2, 41.2 and 88.2 THz
//    for the energy and 9.73, 23.2 and 49.8 THz for the count; the peaks' heights grow as T^3;
//  - the moving observer: T(alpha') = T / gamma (1 - beta cos alpha'), at beta = 0.6 (gamma = 1.25) 2T ahead, 0.8T at
//    right angles and T/2 behind.
import { HBAR } from './tut-quantum-lib.js';
import { KB } from './tut-osc-lib.js';
import { C } from './tut-metric-lib.js';
import { OBS, palette } from './tut-lorentz-lib.js';
import { simpson } from './tut-operators-lib.js';

export { HBAR, KB, C, OBS, palette, simpson };

export const H = 2 * Math.PI * HBAR;
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the curves, in the variable x = hbar omega / k_B T ------------------------------------------------------------
/** x^n / (e^x - 1), its limit at x = 0 included (1 for n = 1, 0 above). */
export const bose = (n, x) => (x === 0 ? (n === 1 ? 1 : 0) : x ** n / Math.expm1(x));
/** The root of x = n (1 - e^{-x}) other than 0: where x^n / (e^x - 1) peaks, by section 3.7's fixed-point iteration. */
export function peakX(n) {
	let x = n;
	for (let i = 0; i < 500; i++) x = -n * Math.expm1(-x);
	return x;
}
export const ENERGY = peakX(3), COUNT = peakX(2), WAVELENGTH = peakX(5);
/** zeta(s), s > 1: the sum to N and the Euler-Maclaurin tail. */
export function zeta(s, N = 1000) {
	let z = 0;
	for (let j = 1; j < N; j++) z += j ** -s;
	return z + N ** (1 - s) / (s - 1) + N ** -s / 2 + (s * N ** (-s - 1)) / 12;
}
export const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
/** The Bose integral int_0^inf x^n dx / (e^x - 1), by Simpson's rule. */
export const boseIntegral = (n) => simpson((x) => bose(n, x), 0, 80, 400000);

// ---- the temperatures --------------------------------------------------------------------------------------------
/** The frequency f = omega / 2 pi, in THz, of x at the temperature T. */
export const thz = (x, T) => (x * KB * T) / H / 1e12;
/** B_omega at the frequency f (THz) and the temperature T, in W m^-2 sr^-1 s. */
export const planck = (f, T) => { const w = 2 * Math.PI * f * 1e12; return (HBAR * w ** 3) / (4 * Math.PI ** 3 * C * C * Math.expm1((HBAR * w) / (KB * T))); };
/** The Rayleigh-Jeans law omega^2 k_B T / 4 pi^3 c^2 at the frequency f (THz). */
export const rayleighJeans = (f, T) => { const w = 2 * Math.PI * f * 1e12; return (w * w * KB * T) / (4 * Math.PI ** 3 * C * C); };
export const TEMPS = [293, 700, 1500];

// ---- the moving observer -----------------------------------------------------------------------------------------
export const BETA = 0.6;
export const GAMMA = 1 / Math.sqrt(1 - BETA * BETA);
/** T(alpha') / T, alpha' the angle from the motion in the observer's frame. */
export const seen = (alpha, beta = BETA) => Math.sqrt(1 - beta * beta) / (1 - beta * Math.cos(alpha));

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/glow/black-body.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- the count of modes
	has('$$\\vect k = \\frac{2\\pi}{D}\\,(n_1, n_2, n_3) , \\qquad n_1, n_2, n_3 = 0, \\pm1, \\pm2, \\ldots$$', 'the grid');
	has('The grid has one point in each small cube of volume $(2\\pi/D)^3$ in the space of wavevectors', 'one point per cell');
	has('fill a spherical shell of radius $k$ and thickness $\\dd k$', 'the shell');
	has('of volume $4\\pi k^2\\,\\dd k$, so the shell holds', 'the shell\'s volume');
	has('$$\\sym{mode-number}{\\dd N_{\\rm modes}} = \\frac{D^3}{(2\\pi)^3}\\,4\\pi k^2\\,\\dd k = \\frac{D^3k^2\\,\\dd k}{2\\pi^2}$$', 'the count in the shell');
	has('$$\\boxed{\\frac{\\dd N_{\\rm modes}}{D^3\\,\\dd\\omega} = \\frac{\\omega^2}{2\\pi^2c^3}}\\quad\\text{for each polarization.}', 'the mode density');
	{
		// the grid's points in a shell of radius k and thickness dk, against 4 pi k^2 dk (grid units), and in a ring
		// against 2 pi k dk: within a few per cent for a shell many cells across
		const k = 30, dk = 3;
		let n3 = 0, n2 = 0;
		for (let a = -34; a <= 34; a++) for (let b = -34; b <= 34; b++) {
			const r2 = Math.hypot(a, b);
			if (r2 >= k && r2 < k + dk) n2++;
			for (let c = -34; c <= 34; c++) { const r = Math.hypot(a, b, c); if (r >= k && r < k + dk) n3++; }
		}
		const v3 = (4 / 3) * Math.PI * ((k + dk) ** 3 - k ** 3), v2 = Math.PI * ((k + dk) ** 2 - k ** 2);
		check(Math.abs(n3 / v3 - 1) < 0.01 && Math.abs(n2 / v2 - 1) < 0.03, `the grid's points: ${n3} in the shell against ${v3}, ${n2} in the ring against ${v2}`);
		check(near((4 * Math.PI * k * k) / (2 * Math.PI) ** 3, (k * k) / (2 * Math.PI * Math.PI), 1e-15), 'D^3 4 pi k^2 / (2 pi)^3 is not D^3 k^2 / 2 pi^2');
	}

	// ---- Planck's law and the classical law
	has('$$\\boxed{B_\\omega(T) = \\frac{\\hbar\\omega^3}{4\\pi^3c^2}\\,\\frac{1}{e^{\\hbar\\omega/\\kB T} - 1}} ,$$', 'Planck\'s law');
	has('$$B_\\omega \\approx \\frac{\\omega^2\\kB T}{4\\pi^3c^2} ,$$', 'the Rayleigh-Jeans law');
	has('the Rayleigh–Jeans law overstates the radiance by $e - 1$, or 72%', 'the 72%');
	for (const T of TEMPS) for (const x of [0.01, 0.5, 1, 2.821, 7]) {
		const f = thz(x, T);
		const scale = (HBAR / (4 * Math.PI ** 3 * C * C)) * ((KB * T) / HBAR) ** 3;
		check(near(planck(f, T) / scale, bose(3, x), 1e-12 * bose(3, x)), `B_omega is not proportional to x^3/(e^x - 1) at ${T} K, x = ${x}`);
		check(near(rayleighJeans(f, T) / scale, x * x, 1e-12 * x * x), `the Rayleigh-Jeans law is not x^2 at ${T} K, x = ${x}`);
	}
	check(near(rayleighJeans(thz(1, 1500), 1500) / planck(thz(1, 1500), 1500), Math.E - 1, 1e-12) && (100 * (Math.E - 2)).toFixed(0) === '72', 'Rayleigh-Jeans over Planck at x = 1');
	check(Math.abs(rayleighJeans(thz(1e-4, 1500), 1500) / planck(thz(1e-4, 1500), 1500) - 1) < 1e-4, 'the classical law does not meet Planck\'s at low frequencies');

	// ---- the Bose integrals
	has('$$\\boxed{\\int_0^\\infty\\frac{x^n\\,\\dd x}{e^x - 1} = n!\\,\\zeta(n + 1)} ,', 'the Bose integral');
	has('\\int_0^\\infty\\frac{x\\,\\dd x}{e^x - 1} &= \\frac{\\pi^2}{6} = 1.645 ,\\\\', 'the integral n = 1');
	has('\\int_0^\\infty\\frac{x^2\\,\\dd x}{e^x - 1} &= 2\\zeta(3) = 2.404 ,\\\\', 'the integral n = 2');
	has('\\int_0^\\infty\\frac{x^3\\,\\dd x}{e^x - 1} &= \\frac{\\pi^4}{15} = 6.494 .', 'the integral n = 3');
	has('$\\zeta(3) = 1.2021$', 'zeta(3)');
	has('$$\\boxed{\\sym{mean-quantum-energy}{\\bar E} = \\frac{\\pi^4/15}{2\\zeta(3)}\\,\\kB T = 2.701\\,\\kB T} ,$$', 'the mean energy');
	const AREA = { 1: Math.PI ** 2 / 6, 2: 2 * zeta(3), 3: Math.PI ** 4 / 15 };
	for (const n of [1, 2, 3]) {
		const s = boseIntegral(n);
		check(near(s, factorial(n) * zeta(n + 1), 1e-9) && near(s, AREA[n], 1e-9), `the Bose integral n = ${n} is ${s}`);
	}
	check(near(zeta(2), Math.PI ** 2 / 6, 1e-12) && near(zeta(4), Math.PI ** 4 / 90, 1e-12), 'zeta(2) and zeta(4)');
	check(AREA[1].toFixed(3) === '1.645' && AREA[2].toFixed(3) === '2.404' && AREA[3].toFixed(3) === '6.494' && zeta(3).toFixed(4) === '1.2021', `the areas ${Object.values(AREA)}`);
	check((AREA[3] / AREA[2]).toFixed(3) === '2.701', `the mean energy ${AREA[3] / AREA[2]}`);

	// ---- the peaks
	has('$$\\boxed{\\hbar\\omega_{\\rm peak} = 2.821\\,\\kB T} .$$', 'the energy peak');
	has('The same steps give $x = 2(1 - e^{-x})$, whose root is $x = 1.594$', 'the count\'s peak');
	has('Its peak is at $x = 5(1 - e^{-x})$, or $x = 4.965$', 'the peak per wavelength');
	has('The largest values of the two curves are $x^3/(e^x - 1) = 1.4214$ at $x = 2.821$ and $x^2/(e^x - 1) = 0.6476$ at $x = 1.594$', 'the heights');
	has('In hertz, $f = \\omega/2\\pi$, the energy peak is at $f = 2.821\\,\\kB T/2\\pi\\hbar$', 'the peak in hertz');
	has('at 293 K, 17.2 THz, of wavelength $c/f = 17.4$ µm, and the count peaks at 9.7 THz (31 µm)', 'the 293 K peaks');
	check(ENERGY.toFixed(3) === '2.821' && COUNT.toFixed(3) === '1.594' && WAVELENGTH.toFixed(3) === '4.965', `the peaks ${ENERGY}, ${COUNT}, ${WAVELENGTH}`);
	for (const [n, x] of [[3, ENERGY], [2, COUNT], [5, WAVELENGTH]]) {
		const d = 1e-4;
		check(bose(n, x) > bose(n, x - d) && bose(n, x) > bose(n, x + d), `x^${n}/(e^x - 1) has no maximum at ${x}`);
		for (let i = 1; i < 2000; i++) { const y = (i / 2000) * 20; check(bose(n, y) <= bose(n, x) + 1e-15, `x^${n}/(e^x - 1) is higher at ${y} than at its peak`); }
	}
	check(bose(3, ENERGY).toFixed(4) === '1.4214' && bose(2, COUNT).toFixed(4) === '0.6476', `the heights ${bose(3, ENERGY)}, ${bose(2, COUNT)}`);
	check(bose(3, ENERGY).toFixed(3) === '1.421' && bose(2, COUNT).toFixed(3) === '0.648', 'the heights to three places');
	for (let i = 1; i < 400; i++) { const x = (i / 400) * 12; check(bose(1, x) < 1 && bose(1, x) < bose(1, x - 0.03), `x/(e^x - 1) does not fall at ${x}`); }
	const peaks = TEMPS.map((T) => [thz(ENERGY, T), thz(COUNT, T)]);
	check(peaks.map(([e]) => e.toFixed(1)).join() === '17.2,41.2,88.2' && peaks.map(([, n]) => n.toPrecision(3)).join() === '9.73,23.2,49.8', `the peaks in THz ${peaks}`);
	check(peaks[0][1].toFixed(1) === '9.7', 'the 293 K count peak');
	// the energy peak is the maximum of B_omega in f, and the count peak the maximum of B_omega / hbar omega
	for (const [i, T] of TEMPS.entries()) {
		const [fe, fn] = peaks[i], d = 1e-3;
		check(planck(fe, T) > planck(fe - d, T) && planck(fe, T) > planck(fe + d, T), `B_omega does not peak at ${fe} THz at ${T} K`);
		const count = (f) => planck(f, T) / f;
		check(count(fn) > count(fn - d) && count(fn) > count(fn + d), `the count does not peak at ${fn} THz at ${T} K`);
		check(near(planck(fe, T) / planck(peaks[2][0], 1500), (T / 1500) ** 3, 1e-12), 'the heights do not grow as T^3');
	}

	// ---- the moving observer
	has('$$\\boxed{T(\\alpha\') = \\frac{T}{\\obs\\gamma\\,(1 - \\obs\\beta\\cos\\alpha\')}} ,$$', 'the temperature in each direction');
	has('At $0.6c$, $\\obs\\gamma = 1.25$: straight ahead ($\\alpha\' = 0$) the factor is $1/(1.25\\times0.4) = 2$, twice $T$; straight behind it is $1/(1.25\\times1.6) = 0.5$; and at $\\alpha\' = 90°$ it is $1/\\obs\\gamma = 0.8$', 'the three temperatures');
	check(near(GAMMA, 1.25, 1e-15) && near(seen(0), 2, 1e-14) && near(seen(Math.PI), 0.5, 1e-14) && near(seen(Math.PI / 2), 0.8, 1e-14), 'the factors 2, 0.8, 0.5');
	for (let i = 0; i <= 360; i++) {
		const a = (i * Math.PI) / 180;
		check(near(seen(a), 1 / (GAMMA * (1 - BETA * Math.cos(a))), 1e-14) && seen(a) >= 0.5 - 1e-15 && seen(a) <= 2 + 1e-15, `T(alpha') at ${i} degrees`);
	}

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
		return drawn;
	};
	return { md, flat, state, peaks, AREA };
}
