// Shared numbers for the three diagrams of the tutorial's section 11.2 (tutorial/black-holes/spin.md): tut-kerr-horizons,
// tut-kerr-far-field and tut-kerr-superradiance. Not a figure itself. The sheet, strokes, labels and cropping are those of
// sections 1.2 to 11.1 (figs/tut-pot-lib.js), the plots and axes section 3.1's (figs/tut-prob-lib.js), 7.5's spin dipole
// and its colour check (figs/tut-gravitomag-lib.js), all imported, not copied. Lengths are in GM/c^2 and rates in
// c^3/GM, so that the spin is chi = a and r_s = 2.
//
// The colours: the far field's sign in the figures' orange (negative, a stretch) and blue (positive), as in 7.5's
// tut-spin-dipole-sky; everything else in ink and the page's greys. The hole is a disc of a fixed near-black, which the
// site does not swap, edged in ink, as in section 11.1's diagrams, so that it is dark in both themes. Superradiance's
// bars are ink (the hole gives energy) and the page's faint grey (the hole absorbs): orange and blue mean a stretch
// and a squeeze, and are not used for the sign of an energy.
//
// `chapter(check)` asserts against the chapter's own text (outside its comments) every statement that a figure draws or
// its caption prints, and computes the numbers behind them:
//  - Kerr's metric, built from its entries (g_00, g_0phi, g_rr, g_thth, g_phiphi in Boyer and Lindquist's coordinates):
//    Delta = r^2 - 2r + chi^2 vanishes at r_+ = 1 + sqrt(1 - chi^2), the outer horizon (2 at chi = 0, 1 at chi = 1);
//    a body with no angular momentum turns at -c g_0phi / g_phiphi, which tends to Omega_H = chi / (r_+^2 + chi^2) on
//    the horizon at every latitude, equal to c r_s a r_+ / (r_+^2 + a^2)^2; the table's r_+ and Omega_H at
//    chi = 0, 0.5, 0.7, 0.9, 0.99, 0.998 and 1; and twice Omega_H at the paper's five spins, 0.41, 0.63, 0.87, 0.94, 1;
//  - the ergosphere, where g_00 = -(1 - 2r / Sigma) changes sign: r = 1 + sqrt(1 - chi^2 cos^2 theta), on the horizon at
//    the poles and at r_s = 2 on the equator for every spin;
//  - the far field: Im (r - i chi cos theta)^-3 = 3.323 x 10^-6 at chi = 0.9 and r = 30 on the axis, against
//    3 chi / r^4 = 3.333 x 10^-6, 0.3% apart, about (10/3)(a/r)^2; the boxed diagonal (3 G J cos theta / c r^4)(1, 1, -2)
//    equal, entry for entry in the tide's axes, to 7.5's spin dipole with L = J z and n from the pixel toward the body,
//    so B_nn = -6 G J cos theta / c r^4: negative (orange) over the northern hemisphere;
//  - superradiance: (kappa c^2 / 8 pi G) delta A = delta E (1 - m Omega_H / omega), so at a fixed growth of the area
//    delta E is proportional to 1 / (1 - m Omega_H / omega) = x / (x - 1), x = omega / m Omega_H: negative for
//    0 < x < 1, positive for x > 1; and kappa > 0 for chi < 1.
import { G, C, dot, apply, spinDipole, palette } from './tut-gravitomag-lib.js';

export { palette };
export const HOLE = '#0d0c0b';                   // the hole's fill: fixed, not a palette colour, so the site keeps it dark
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
export const DEG = Math.PI / 180;

// ---- the hole, lengths in GM/c^2 ---------------------------------------------------------------------------------
/** The outer horizon r_+ at the spin chi. */
export const horizon = (chi) => 1 + Math.sqrt(Math.max(0, 1 - chi * chi));
/** The horizon's angular velocity, c^3/GM. */
export const omegaH = (chi) => chi / (horizon(chi) ** 2 + chi * chi);
/** The ergosphere's outer surface at the angle theta from the axis. */
export const ergosphere = (chi, theta) => 1 + Math.sqrt(1 - (chi * Math.cos(theta)) ** 2);
/** The paper's five spins. */
export const SPINS = [0.7, 0.9, 0.99, 0.998, 1];
/** The spins of the chapter's table. */
export const TABLE = [0, 0.5, 0.7, 0.9, 0.99, 0.998, 1];

/** Kerr's metric's entries at (r, theta), lengths in GM/c^2 (r_s = 2), x^0 = ct. */
export function kerr(chi, r, th) {
	const s2 = Math.sin(th) ** 2, Sigma = r * r + (chi * Math.cos(th)) ** 2, Delta = r * r - 2 * r + chi * chi;
	return {
		Sigma, Delta,
		g00: -(1 - (2 * r) / Sigma),
		g0p: (-2 * chi * r * s2) / Sigma,
		grr: Sigma / Delta,
		gtt: Sigma,
		gpp: (((r * r + chi * chi) ** 2 - chi * chi * Delta * s2) / Sigma) * s2
	};
}

// ---- superradiance -------------------------------------------------------------------------------------------------
/** The energy the hole takes, per unit of (kappa c^2 / 8 pi G) delta A, at x = omega / m Omega_H. */
export const takes = (x) => 1 / (1 - 1 / x);
/** The bars' frequencies, x = omega / m Omega_H. */
export const BARS = [0.25, 0.5, 0.75, 0.9, 1.1, 1.25, 1.5, 2];

// ---- the far field ---------------------------------------------------------------------------------------------------
/** B_nn from the boxed diagonal: -2 times 3 G J cos theta / c r^4, SI (J in kg m^2 s^-1, r in m). */
export const kerrBnn = (J, theta, r) => (-2 * 3 * G * J * Math.cos(theta)) / (C * r ** 4);
/** B_nn from 7.5's spin dipole, for L = J z and the pixel at the angle theta from the axis, n from it toward the body. */
export function dipoleBnn(J, theta, phi, r) {
	const p = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
	const n = p.map((v) => -v);
	return dot(n, apply(spinDipole([0, 0, J], n, r), n));
}

// ---- the chapter ---------------------------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/black-holes/spin.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const f3 = (v) => v.toFixed(3);

	// ---- the metric, the horizon and its rate
	has(String.raw`$\Sigma = r^2 + a^2\cos^2\vartheta$ and $\Delta = r^2 - r_sr + a^2$`, 'Sigma and Delta');
	has(String.raw`$$\boxed{\;\sym{outer-horizon}{r_+} = \frac{G\matter M}{c^2} + \sqrt{\Bigl(\frac{G\matter M}{c^2}\Bigr)^2 - a^2}\;} .$$`, 'r_+');
	has(String.raw`$$\boxed{\;\sym{horizon-angular-velocity}{\Omega_H} = \frac{c\,r_sar_+}{(r_+^2 + a^2)^2} = \frac{ac}{r_+^2 + a^2}\;} ,$$`, 'Omega_H');
	has(String.raw`**dimensionless spin** $\sym{dimensionless-spin}{\chi} = ac^2/G\matter M = c\matter J/G\matter M^2$`, 'chi');
	has(String.raw`$a = G\matter M/c^2$, gives $r_+ = G\matter M/c^2$, half of it.`, 'r_+ at the greatest spin');
	has(String.raw`the greatest spin, $r_+ = a = G\matter M/c^2$, gives $c^3/2G\matter M$.`, 'Omega_H at the greatest spin');
	for (const chi of [0.3, 0.7, 0.9, 0.99, 0.998]) {
		const rp = horizon(chi);
		check(near(kerr(chi, rp, 1.1).Delta, 0, 1e-12), `Delta does not vanish at r_+ for chi = ${chi}`);
		check(near(rp, 1 + Math.sqrt(1 - chi * chi), 0) && rp > 1 - 1e-15, 'the larger root');
		for (const th of [0.3, 1.0, Math.PI / 2, 2.4]) {
			// a body with no angular momentum, just outside the horizon
			const k = kerr(chi, rp + 1e-7, th), rate = -k.g0p / k.gpp;
			check(near(rate, omegaH(chi), 1e-5), `-c g_0phi / g_phiphi at the horizon is ${rate}, not Omega_H, at chi = ${chi}, theta = ${th}`);
		}
		check(near(omegaH(chi), (2 * chi * rp) / (rp * rp + chi * chi) ** 2, 1e-14), 'the two forms of Omega_H');
	}
	check(horizon(0) === 2 && horizon(1) === 1 && omegaH(0) === 0 && omegaH(1) === 0.5, 'the limits of r_+ and Omega_H');
	// the table
	has('| $r_+$, in $G\\matter M/c^2$ | 2 | 1.866 | 1.714 | 1.436 | 1.141 | 1.063 | 1 |', 'the table\'s r_+');
	has('| $\\Omega_H$, in $c^3/G\\matter M$ | 0 | 0.134 | 0.204 | 0.313 | 0.434 | 0.469 | 0.5 |', 'the table\'s Omega_H');
	has('| $\\chi$ | 0 | 0.5 | 0.7 | 0.9 | 0.99 | 0.998 | 1 |', 'the table\'s spins');
	const trim = (v) => String(+f3(v));
	check(TABLE.map((c) => trim(horizon(c))).join() === '2,1.866,1.714,1.436,1.141,1.063,1', `the table's r_+: ${TABLE.map(horizon)}`);
	check(TABLE.map((c) => trim(omegaH(c))).join() === '0,0.134,0.204,0.313,0.434,0.469,0.5', `the table's Omega_H: ${TABLE.map(omegaH)}`);
	// the paper's five spins, and the m = 2 thresholds
	has('$0.41$ at $\\chi = 0.7$, $0.63$ at 0.9, $0.87$ at 0.99, $0.94$ at 0.998, and 1 at the greatest spin', 'the m = 2 thresholds');
	check(SPINS.map((c) => (2 * omegaH(c)).toFixed(2)).join() === '0.41,0.63,0.87,0.94,1.00', 'twice Omega_H at the five spins');
	has('$0.27\\%$ at $\\chi = 0.7$, $6.4\\%$ at 0.9, $56\\%$ at 0.99,\n$91\\%$ at 0.998 and $138\\%$ at the greatest spin'.replace(/\s+/g, ' '), 'the paper\'s five spins');
	for (let i = 1; i <= 1000; i++) {
		const c = i / 1000, d = 1e-3;
		check(horizon(c) < horizon(c - d) && omegaH(c) > omegaH(c - d), `r_+ does not fall, or Omega_H rise, at ${c}`);
	}

	// ---- the ergosphere
	has('It touches the horizon at the poles and reaches out to $r_s$ on the equator', 'the ergosphere\'s extent');
	has(String.raw`the surface $r = G\matter M/c^2 + \sqrt{(G\matter M/c^2)^2 - a^2\cos^2\vartheta}$, is the **ergosphere**`, 'the ergosphere\'s surface');
	for (const chi of [0.4, 0.9, 1]) {
		for (const th of [0.2, 0.9, 1.4]) check(near(kerr(chi, ergosphere(chi, th), th).g00, 0, 1e-12), `g_00 does not vanish on the ergosphere at ${chi}, ${th}`);
		check(near(ergosphere(chi, Math.PI / 2), 2, 1e-15) && near(ergosphere(chi, 0), horizon(chi), 1e-15), 'the ergosphere at the equator and poles');
		check(kerr(chi, 0.5 * (horizon(chi) + 2), Math.PI / 2).g00 > 0 && kerr(chi, 2.01, Math.PI / 2).g00 < 0, 'g_00 inside and outside');
	}

	// ---- the far field
	has(String.raw`$$\boxed{\;\curv\tB \to \frac{3G\matter J\cos\vartheta}{c\,r^4}\times(1, 1, -2)\;} .$$`, 'the boxed far field');
	has(String.raw`$\curv\tB_{nn} = -2 \times 3G\matter J\cos\vartheta/cr^4$`, 'B_nn');
	has(String.raw`$\curv\tB_{ij} = -(3G/cr^4)[L_i\hat n_j + \hat n_iL_j + (\vect L\cdot\hat n)(\delta_{ij} - 5\hat n_i\hat n_j)]$`, '7.5\'s spin dipole');
	has('the exact imaginary part of $(r - ia)^{-3}$ is $3.323\\times10^{-6}$, against the first-order $3a/r^4 = 3.333\\times10^{-6}$', 'the far-field number');
	{
		const chi = 0.9, r = 30;
		// Im (r - i chi)^-3 = Im (r + i chi)^3 / (r^2 + chi^2)^3
		const im = (3 * r * r * chi - chi ** 3) / (r * r + chi * chi) ** 3;
		check(im.toExponential(3) === '3.323e-6' && ((3 * chi) / r ** 4).toExponential(3) === '3.333e-6', `the far-field number ${im}`);
		check((100 * (1 - im / ((3 * chi) / r ** 4))).toFixed(1) === '0.3', 'they differ by 0.3%');
	}
	const J = 1e40, R = 1e9;
	for (const th of [0.1, 0.7, 1.2, Math.PI / 2, 2.0, 2.9]) for (const ph of [0, 1.3, 4]) {
		const a = kerrBnn(J, th, R), b = dipoleBnn(J, th, ph, R), s = Math.abs(kerrBnn(J, 0, R));
		check(near(a, b, 1e-12 * s), `B_nn of the hole ${a} and of 7.5's dipole ${b} differ at theta = ${th}`);
		if (Math.abs(th - Math.PI / 2) > 1e-9) check(Math.sign(a) === (th < Math.PI / 2 ? -1 : 1), 'B_nn is not negative in the north');
	}
	check(Math.abs(kerrBnn(J, Math.PI / 2, R)) < 1e-12 * Math.abs(kerrBnn(J, 0, R)), 'B_nn on the equator');

	// ---- superradiance
	has(String.raw`$$\frac{\kappa c^2}{8\pi G}\,\delta A = \delta E\,\Bigl(1 - \frac{m\Omega_H}{\omega}\Bigr) .$$`, 'the first law with the ratio');
	has(String.raw`$$\boxed{\;0 < \omega < m\Omega_H \quad\Longrightarrow\quad \delta E \le 0\;} .$$`, 'the boxed condition');
	has('with $\\delta E$ the energy the hole absorbs, in joules.', 'delta E');
	for (const x of BARS) {
		check(near(takes(x) * (1 - 1 / x), 1, 1e-12), `the bar at ${x}`);
		check(Math.sign(takes(x)) === (x < 1 ? -1 : 1), `the sign at ${x}`);
		check(near(Math.abs(takes(x)), x / Math.abs(x - 1), 1e-12), `the length at ${x}`);
	}
	// kappa = c^2 sqrt((GM/c^2)^2 - a^2) / (r_+^2 + a^2): positive below the greatest spin, zero at it
	const kappa = (chi) => Math.sqrt(Math.max(0, 1 - chi * chi)) / (horizon(chi) ** 2 + chi * chi);
	check(kappa(0.999) > 0 && kappa(1) === 0 && near(kappa(0), 0.25, 1e-15), 'kappa');

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
	return { md, flat, state };
}
