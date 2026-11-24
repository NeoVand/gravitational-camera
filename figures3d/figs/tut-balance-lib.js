// Shared numbers for the four diagrams of the tutorial's chapter 10.2 (tutorial/glow/kirchhoff.md): tut-balance-rates,
// tut-balance-ray, tut-balance-orders and tut-heat-capacity. Not a figure itself. hbar is chapter 8.1's
// (figs/tut-quantum-lib.js), k_B and G chapter 4.1's (figs/tut-osc-lib.js), c chapter 7.1's (figs/tut-metric-lib.js),
// the role check chapter 6.1's (figs/tut-lorentz-lib.js), Simpson's rule chapter 8.2's (figs/tut-operators-lib.js), and
// the sheet, strokes, labels and cropping those of chapters 6.1 to 10.1 (figs/tut-pot-lib.js), all imported, not
// copied. The levels, the occupations, the spectra and the heat capacities are neutral (ink and the page's greys), as
// the chapter writes P_l, P_u, n_omega and C without a colour role; orange and blue, which mean a stretch and a
// squeeze, are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the rates: dn/ds = kappa P_u (n + 1) - kappa P_l n, alpha = kappa (P_l - P_u), j = kappa P_u hbar omega^3 / 4 pi^3
//    c^2, and with Boltzmann's P_u / P_l = e^{-x} the ratio P_u / (P_l - P_u) = nbar; at x = 2.821, e^{-x} = 6.0% and
//    nbar = 0.063;
//  - the ray: dn/ds = alpha (nbar - n), solved by n = nbar + (n_0 - nbar) e^{-tau} (asserted against a Runge-Kutta
//    integration of the equation), within 2% of nbar by tau = 4, and n = tau nbar to within tau^2 / 2 for n_0 = 0;
//  - the two orders: the emission order 2 x nbar and the symmetrized x (2 nbar + 1) = x coth(x / 2), both 2 at x = 0,
//    0.357 and 3.18 at x = 2.821, their ratio (nbar + 1/2) / nbar = 8.9, and 1.15 at 10^13 s^-1 and 293 K;
//  - the heat capacities: C_mode / k_B = x^2 e^x / (e^x - 1)^2, 0.999, 0.921, 0.724 and 0.171 at x = 0.1, 1, 2 and 5,
//    asserted against the derivative of x nbar's energy; Debye's 3 / x_D^3 int_0^x_D x^4 e^x dx / (e^x - 1)^2 by
//    Simpson's rule, 0.16 for diamond (2200 K) and 0.93 for copper (343 K) at 293 K, tending to 1 when hot and to
//    (4 pi^4 / 5) (T / Theta_D)^3 when cold;
//  - the hole: T_H = hbar c^3 / 8 pi G M k_B, 0.902 K for 1.36 x 10^23 kg and 0.905 K for 1.356 x 10^23 kg, and
//    C = -M c^2 / T_H = -hbar c^5 / 8 pi G k_B T_H^2, -1.35 x 10^40 J/K at both (the chapter's -1.4 x 10^40).
import { HBAR } from './tut-quantum-lib.js';
import { KB, G } from './tut-osc-lib.js';
import { C } from './tut-metric-lib.js';
import { palette } from './tut-lorentz-lib.js';
import { simpson } from './tut-operators-lib.js';

export { HBAR, KB, G, C, palette, simpson };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- one mode --------------------------------------------------------------------------------------------------
/** Planck's occupation 1 / (e^x - 1). */
export const nbar = (x) => 1 / Math.expm1(x);
/** The energy peak of chapter 10.1: the root of x = 3 (1 - e^{-x}). */
export const PEAK = (() => { let x = 3; for (let i = 0; i < 500; i++) x = -3 * Math.expm1(-x); return x; })();
/** The text's rounded x of the energy peak, at which every number of the chapter is quoted. */
export const X_PEAK = 2.821;

// ---- the ray ---------------------------------------------------------------------------------------------------
/** n_omega / nbar(T) at the optical depth tau, for the occupation n_0 / nbar entering. */
export const relax = (n0, tau) => 1 + (n0 - 1) * Math.exp(-tau);
export const ENTERING = [2, 1, 0];

// ---- the two orders, per Re eta Delta_ijkl, in units of k_B T ----------------------------------------------------
/** The emission order S(-omega): 2 hbar omega nbar = 2 x nbar k_B T, its limit 2 at x = 0. */
export const emission = (x) => (x < 1e-8 ? 2 : (2 * x) / Math.expm1(x));
/** The symmetrized order: hbar omega (2 nbar + 1) = x coth(x / 2) k_B T, its limit 2 at x = 0. */
export const symmetrized = (x) => (x < 1e-8 ? 2 : x / Math.tanh(x / 2));
export const CLASSICAL = 2;

// ---- heat capacities ----------------------------------------------------------------------------------------------
/** C_mode / k_B at x = hbar omega / k_B T, its limit 1 at x = 0. */
export const cMode = (x) => (x < 1e-6 ? 1 : x > 600 ? 0 : (x * x * Math.exp(x)) / Math.expm1(x) ** 2);
/** Debye's C / 3 N k_B at t = T / Theta_D, by Simpson's rule (x_D = 1 / t). */
export function debye(t) {
	if (t <= 0) return 0;
	const xd = 1 / t;
	const f = (x) => (x === 0 ? 0 : x ** 4 * cMode(x) / (x * x));     // x^4 e^x / (e^x - 1)^2
	return (3 / xd ** 3) * simpson(f, 0, xd, 4000);
}
export const DIAMOND = { T: 293, theta: 2200 }, COPPER = { T: 293, theta: 343 };

// ---- the black hole ---------------------------------------------------------------------------------------------
export const HOLE = 1.36e23, HOLE_EXACT = 1.356e23;          // kg: the paper's mass, and the mass it rounds
/** The Hawking temperature of the mass M, K. */
export const hawking = (M) => (HBAR * C ** 3) / (8 * Math.PI * G * M * KB);
/** The heat capacity -M c^2 / T_H at the Hawking temperature T, with M = hbar c^3 / 8 pi G k_B T, J/K. */
export const holeC = (T) => -(HBAR * C ** 5) / (8 * Math.PI * G * KB * T * T);

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/glow/kirchhoff.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- the rates and the two coefficients
	has('$$\\frac{\\dd n_\\omega}{\\dd s} = \\kappa P_u\\,(n_\\omega + 1) - \\kappa P_l\\,n_\\omega .$$', 'the rates');
	has('$$\\alpha = \\kappa\\,(P_l - P_u) , \\qquad j_\\omega = \\kappa P_u\\,\\frac{\\hbar\\omega^3}{4\\pi^3c^2} .$$', 'the coefficients');
	has('The part in proportion to $n_\\omega$ is **stimulated emission**', 'stimulated emission');
	has('the 1 of $n_\\omega + 1$, is **spontaneous emission**', 'spontaneous emission');
	has('So $\\alpha$ is the **net absorption coefficient**, absorption less stimulated emission', 'the net absorption');
	has('$P_u/(P_l - P_u) = e^{-x}/(1 - e^{-x}) = 1/(e^x - 1) = \\bar n$', 'the ratio of the populations');
	has('stimulated emission cancels $e^{-2.821} = 6.0\\%$ of the absorption, and $j_\\omega/\\alpha$ is $\\bar n = 0.063$', 'the numbers at the peak');
	check(near(PEAK, X_PEAK, 5e-4), `the energy peak ${PEAK}`);
	check((100 * Math.exp(-X_PEAK)).toFixed(1) === '6.0' && nbar(X_PEAK).toFixed(3) === '0.063', 'e^{-x} and nbar at the peak');
	for (const x of [0.1, 1, X_PEAK, 6]) {
		const pl = 1 / (1 + Math.exp(-x)), pu = 1 - pl;
		check(near(pu / pl, Math.exp(-x), 1e-14) && near(pu / (pl - pu), nbar(x), 1e-12 * nbar(x)), `P_u/(P_l - P_u) at x = ${x}`);
		// detailed balance: absorption kappa P_l nbar equals the whole emission kappa P_u (nbar + 1)
		check(near(pl * nbar(x), pu * (nbar(x) + 1), 1e-14), `detailed balance at x = ${x}`);
	}

	// ---- the ray
	has('$$\\frac{\\dd n_\\omega}{\\dd s} = \\alpha\\,\\bigl[\\bar n(T) - n_\\omega\\bigr] .$$', 'the relaxation');
	has('Over a few optical depths the occupation relaxes to the matter\'s own $\\bar n(T)$, from above or below', 'the relaxation from above or below');
	has('$$\\boxed{n_\\omega = \\sum_k\\tau_k(\\omega)\\,\\bar n(T_k)} ,$$', 'the thin sum');
	for (const n0 of ENTERING) {
		// dn/dtau = 1 - n (units of nbar), by fourth-order Runge-Kutta to tau = 5
		let n = n0;
		const h = 1e-3, f = (v) => 1 - v;
		for (let i = 0; i < 5000; i++) {
			const k1 = f(n), k2 = f(n + (h / 2) * k1), k3 = f(n + (h / 2) * k2), k4 = f(n + h * k3);
			n += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
			if (i % 500 === 499) check(near(n, relax(n0, (i + 1) * h), 1e-12), `the relaxation from ${n0} at tau = ${(i + 1) * h}`);
		}
		check(Math.abs(relax(n0, 4) - 1) <= 0.02 * Math.max(1, Math.abs(n0 - 1)) + 1e-15, `the curve from ${n0} has not met nbar by tau = 4`);
	}
	for (const tau of [1e-3, 5e-3, 1e-2]) check(Math.abs(relax(0, tau) - tau) <= tau * tau / 2 + 1e-18, `the thin ramp at ${tau}`);

	// ---- the two orders
	has('$$S_{ij,kl}(-\\omega) = 2\\hbar\\omega\\,\\bar n\\,\\mathrm{Re}\\,\\matter\\eta\\;\\Delta_{ijkl} ,$$', 'the emission order');
	has('which tends to 4.6\'s $2\\kB T\\,\\mathrm{Re}\\,\\matter\\eta\\,\\Delta_{ijkl}$ when $\\hbar\\omega \\ll \\kB T$', 'the classical limit');
	has('A classical record shows 8.7\'s symmetrized spectrum, $\\hbar\\omega(2\\bar n + 1)\\, \\mathrm{Re}\\,\\matter\\eta\\,\\Delta_{ijkl}$', 'the symmetrized order');
	has('the symmetrized order would overstate the glow by $(\\bar n + \\tfrac12)/\\bar n = 1.15$ at $\\omega = 10^{13}\\unit{s^{-1}}$ (1.6 THz), and 8.9 times at the energy peak', 'the ratios');
	has('the paper takes the stress in the "unsymmetrized (Wightman) order", the emission order', 'the emission order\'s name');
	for (const x of [1e-3, 0.5, 1, X_PEAK, 5]) {
		check(near(emission(x), 2 * x * nbar(x), 1e-12), `the emission order at ${x}`);
		check(near(symmetrized(x), x * (2 * nbar(x) + 1), 1e-12 * symmetrized(x)), `x coth(x/2) is not x (2 nbar + 1) at ${x}`);
		check(near(symmetrized(x) - emission(x), x, 1e-12 * symmetrized(x)), `the two orders do not differ by x at ${x}`);
	}
	check(near(emission(1e-6), 2, 1e-5) && near(symmetrized(1e-6), 2, 1e-5), 'the two orders do not start at 2');
	const at = { emission: emission(X_PEAK), symmetrized: symmetrized(X_PEAK), ratio: symmetrized(X_PEAK) / emission(X_PEAK) };
	check(at.emission.toFixed(3) === '0.357' && at.symmetrized.toFixed(2) === '3.18' && at.ratio.toFixed(1) === '8.9', `the orders at the peak ${Object.values(at)}`);
	check(near(at.ratio, (nbar(X_PEAK) + 0.5) / nbar(X_PEAK), 1e-12), 'the ratio is not (nbar + 1/2)/nbar');
	{
		const x = (HBAR * 1e13) / (KB * 293);
		check(((nbar(x) + 0.5) / nbar(x)).toFixed(2) === '1.15', 'the ratio at 10^13 s^-1');
	}
	for (let i = 1; i < 600; i++) {
		const x = (i / 600) * 6, d = 6 / 600;
		check(emission(x) < emission(x - d) && symmetrized(x) > symmetrized(x - d), `the orders do not fall and rise at ${x}`);
	}

	// ---- one mode's heat capacity
	has('$$\\boxed{C_{\\rm mode} = \\kB\\,\\frac{x^2e^x}{(e^x - 1)^2}} .$$', 'C_mode');
	has('At $x = 0.1$, 1, 2 and 5 it is 0.999, 0.921, 0.724 and 0.171 times $\\kB$.', 'the four values of C_mode');
	check([0.1, 1, 2, 5].map((x) => cMode(x).toFixed(3)).join() === '0.999,0.921,0.724,0.171', 'the four values');
	for (const x of [0.05, 0.4, 1, 3, 8]) {
		// d(x nbar)/dT in units of k_B: E / k_B T = x nbar at fixed omega, dE/dT = k_B x^2 e^x / (e^x - 1)^2
		const T = 1, h = 1e-5, E = (t) => x * nbar(x / t);      // E / k_B, with hbar omega = x k_B at T = 1 K
		check(near((E(T + h) - E(T - h)) / (2 * h), cMode(x), 1e-7), `C_mode is not dE/dT at x = ${x}`);
	}

	// ---- Debye's solid
	has('$$\\frac{C}{3N\\kB} = \\frac{3}{x_D^3}\\int_0^{x_D}\\frac{x^4e^x\\,\\dd x}{(e^x - 1)^2} .$$', 'Debye\'s formula');
	has('At 293 K diamond, with the paper\'s Debye temperature of 2200 K, holds only 0.16 of its classical heat capacity, while copper, whose Debye temperature is 343 K, holds 0.93', 'diamond and copper');
	const dots = {
		diamond: { t: DIAMOND.T / DIAMOND.theta, c: debye(DIAMOND.T / DIAMOND.theta) },
		copper: { t: COPPER.T / COPPER.theta, c: debye(COPPER.T / COPPER.theta) }
	};
	check(dots.diamond.t.toFixed(3) === '0.133' && dots.diamond.c.toFixed(2) === '0.16', `diamond ${dots.diamond.t}, ${dots.diamond.c}`);
	check(dots.copper.t.toFixed(3) === '0.854' && dots.copper.c.toFixed(2) === '0.93', `copper ${dots.copper.t}, ${dots.copper.c}`);
	check(near(debye(0.02), (4 * Math.PI ** 4 / 5) * 0.02 ** 3, 1e-6) && near(debye(20), 1, 2e-4), 'Debye\'s limits');
	check(near(debye(0.5), (3 / 8) * simpson((x) => x ** 4 * cMode(x) / (x * x), 1e-9, 2, 200000), 1e-9), 'Debye\'s quadrature');
	for (let i = 1; i <= 300; i++) {
		const t = (i / 300) * 3;
		check(debye(t) > debye(t - 0.01) && debye(t) < 1 && debye(t) > cMode(1 / t), `Debye's curve at ${t}`);
	}

	// ---- the hole
	has('$$\\boxed{C = \\frac{\\dd(\\matter Mc^2)}{\\dd T_H} = -\\frac{\\matter Mc^2}{T_H}} .$$', 'the hole\'s heat capacity');
	has('its Hawking temperature $T_H = \\hbar c^3/8\\pi G\\matter M\\kB$', 'the Hawking temperature');
	has('Section VII\'s hole of $1.36\\times10^{23}$ kg is at 0.902 K,[^hole] with $C = -1.4\\times10^{40}\\unit{J\\,K^{-1}}$', 'the hole\'s numbers');
	has('The heat capacity is $-1.35\\times10^{40}\\unit{J\\,K^{-1}}$ either way.', 'the margin note\'s heat capacity');
	const hole = { T: hawking(HOLE), C: (-HOLE * C * C) / hawking(HOLE) };
	check(hole.T.toFixed(3) === '0.902' && hawking(HOLE_EXACT).toFixed(3) === '0.905', `the hole's temperature ${hole.T}`);
	check(near(holeC(hole.T), hole.C, 1e-12 * Math.abs(hole.C)), 'C = -M c^2 / T_H is not -hbar c^5 / 8 pi G k_B T^2');
	check((hole.C / 1e40).toFixed(2) === '-1.35' && (hole.C / 1e40).toFixed(1) === '-1.4', `the hole's C ${hole.C}`);
	check(((-HOLE_EXACT * C * C) / hawking(HOLE_EXACT) / 1e40).toFixed(2) === '-1.35', 'the exact mass\'s C');

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
	return { md, flat, state, at, dots, hole };
}
