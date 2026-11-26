// Shared numbers for the four diagrams of the tutorial's section 4.4 (tutorial/response/viscosity.md):
// tut-visc-plates, tut-visc-maxwell, tut-visc-tails and tut-visc-ceiling. Not a figure itself. The charts take
// section 3.1's sheet, axes and labels (figs/tut-pot-lib.js, figs/tut-prob-lib.js) and section 2.6's sampling of
// curves (figs/tut-fourier-lib.js), imported, not copied; the wall and the spring are drawn as section 1.7's
// (figs/tut-ham-phase.js). The colours follow the paper's Figure fig:materials: water in the first accent (orange),
// copper in the second (blue); honey, which the paper does not draw, takes the second accent beside water.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or that its caption prints: the plates'
// stresses, Maxwell's relaxation times, the band of the glow at 293 K (where the Planck radiance x^3/(e^x - 1),
// x = hbar omega / k_B T, exceeds a tenth of its peak), its peak, the two liquids' friction there and where their
// curves cross, and copper's free electrons, their weight 2 n E_F / 5, the ceiling mu/2omega and copper's place
// under it.

export const HBAR = 1.054571817e-34;      // J s
export const KB = 1.380649e-23;           // J/K
export const EV = 1.602176634e-19;        // J
export const M_E = 9.1093837015e-31;      // kg
export const ROOM = 293;                  // K

// ---- Maxwell's liquids at the illustrative stiffness ------------------------------------------------------------
export const MU_LIQUID = 1e9;             // Pa, assumed
export const HONEY = 10;                  // Pa s
export const WATER = 1e-3;                // Pa s, a Maxwell liquid with water's everyday viscosity
export const PLACEHOLDER = 1e-3;          // Pa s, the paper's constant reference friction

/** Re eta = eta0 / (1 + omega^2 tau^2) with tau = eta0 / mu (eq:dynamic), Pa s. */
export const reEta = (w, eta0, mu = MU_LIQUID) => { const t = eta0 / mu; return eta0 / (1 + w * w * t * t); };
/** Its tail, mu^2 / eta0 omega^2. */
export const tail = (w, eta0, mu = MU_LIQUID) => (mu * mu) / (eta0 * w * w);
/** The friction at the frequency w against the collision (relaxation) time tau at fixed mu: mu tau / (1 + w^2 tau^2). */
export const byTau = (tau, w, mu) => (mu * tau) / (1 + w * w * tau * tau);

// ---- the glow at 293 K -----------------------------------------------------------------------------------------
const planck = (x) => (x ** 3) / Math.expm1(x);
function bisect(f, a, b) {
	let fa = f(a);
	for (let i = 0; i < 200 && b - a > 1e-15 * Math.max(1, Math.abs(a)); i++) {
		const m = (a + b) / 2, fm = f(m);
		if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m;
	}
	return (a + b) / 2;
}
/** The peak of x^3/(e^x - 1): 3(1 - e^-x) = x. */
export const X_PEAK = bisect((x) => 3 * (1 - Math.exp(-x)) - x, 1, 5);
export const X_BAND = [bisect((x) => planck(x) - 0.1 * planck(X_PEAK), 0.05, X_PEAK), bisect((x) => planck(x) - 0.1 * planck(X_PEAK), X_PEAK, 30)];
export const W_PER_X = (KB * ROOM) / HBAR;   // s^-1
export const W_PEAK = X_PEAK * W_PER_X;
export const W_BAND = X_BAND.map((x) => x * W_PER_X);

// ---- copper's free electrons -----------------------------------------------------------------------------------
export const CU_N = 4 / (0.3615e-9) ** 3;                                       // m^-3, four per cube of 0.3615 nm
export const CU_EF = (HBAR ** 2 * (3 * Math.PI ** 2 * CU_N) ** (2 / 3)) / (2 * M_E);   // J, free electrons
export const CU_MU = 0.4 * CU_N * CU_EF;                                        // Pa, the weight 2 n E_F / 5
export const CU_TAU = 2.5e-14;                                                  // s

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
	const sci = (x, d = 2) => x.toExponential(d - 1);
	// the plates: water and honey between plates 1 mm apart, the upper at 1 cm/s
	check(near((WATER * 0.01) / 1e-3, 0.01, 1e-12) && near((HONEY * 0.01) / 1e-3, 100, 1e-12), 'the plates\' stresses');
	// Maxwell's times
	const tauH = HONEY / MU_LIQUID, tauW = WATER / MU_LIQUID;
	check(near(tauH, 1e-8, 1e-12) && near(tauW, 1e-12, 1e-12), `tau = ${tauH}, ${tauW}`);
	// the glow: x from 0.420 to 8.30, peak 2.821; omega 1.61e13 to 3.18e14, peak 1.08e14 s^-1; 2.6 to 51 THz, 17 THz
	check(X_PEAK.toFixed(3) === '2.821' && X_BAND[0].toFixed(3) === '0.420' && X_BAND[1].toFixed(2) === '8.30', `the band ${X_BAND}, peak ${X_PEAK}`);
	check(sci(W_BAND[0], 3) === '1.61e+13' && sci(W_BAND[1], 3) === '3.18e+14' && sci(W_PEAK, 3) === '1.08e+14', `the band ${W_BAND} s^-1`);
	check(sci(W_PEAK, 4) === '1.082e+14', `the peak ${W_PEAK}`);
	const thz = (w) => w / (2 * Math.PI) / 1e12;
	check(thz(W_BAND[0]).toFixed(1) === '2.6' && thz(W_BAND[1]).toFixed(0) === '51' && thz(W_PEAK).toFixed(0) === '17', 'the band in THz');
	// omega tau at the peak: honey 1.1e6, Maxwell water 108; their friction 8.5e-12 and 8.5e-8 Pa s, 10^4 apart
	check(sci(W_PEAK * tauH) === '1.1e+6' && (W_PEAK * tauW).toFixed(0) === '108', 'omega tau at the peak');
	const fH = reEta(W_PEAK, HONEY), fW = reEta(W_PEAK, WATER);
	check(sci(fH) === '8.5e-12' && sci(fW) === '8.5e-8' && near(fW / fH, 1e4, 1e-3), `at the peak: ${fH}, ${fW}`);
	check(near(fH, tail(W_PEAK, HONEY), 1e-11) && near(fW, tail(W_PEAK, WATER), 1e-4), 'the peak is not in the tails');
	check(near(fH / PLACEHOLDER, 1e-8, 0.2) && near(fW / PLACEHOLDER, 1e-4, 0.2), 'below the placeholder by 10^8 and 10^4');
	// the crossing: omega = mu / sqrt(eta_h eta_w) = 10^10 s^-1 exactly, at 1.0e-3 Pa s
	const wX = MU_LIQUID / Math.sqrt(HONEY * WATER);
	check(near(wX, 1e10, 1e-15) && near(reEta(wX, HONEY), reEta(wX, WATER), 1e-12), `the crossing ${wX}`);
	check(reEta(wX, HONEY).toFixed(4) === '0.0010' && near(reEta(wX, HONEY), PLACEHOLDER, 2e-4), `at the crossing ${reEta(wX, HONEY)}`);
	check(reEta(1e9, HONEY) > reEta(1e9, WATER) && reEta(1e11, HONEY) < reEta(1e11, WATER), 'honey does not have the more friction below the crossing');
	// the bends near 1/tau: 10^8 and 10^12 s^-1
	check(near(reEta(1 / tauH, HONEY), HONEY / 2, 1e-12) && near(reEta(1 / tauW, WATER), WATER / 2, 1e-12), 'the bends');
	// copper: n = 8.47e28 m^-3, E_F = 7.03 eV, mu = 38 GPa, eta0 = 9.5e-4 Pa s
	check(sci(CU_N, 3) === '8.47e+28' && (CU_EF / EV).toFixed(2) === '7.03', `copper: n ${CU_N}, E_F ${CU_EF / EV} eV`);
	// the diagram's comment printed 38.1 GPa; 2 n E_F / 5 from these is 38.15, 38.2 to three figures, 38 as the text has
	check((CU_MU / 1e9).toFixed(0) === '38' && (CU_MU / 1e9).toFixed(2) === '38.15', `copper's mu = ${CU_MU}`);
	check(sci(CU_MU * CU_TAU) === '9.5e-4', `copper's eta0 = ${CU_MU * CU_TAU}`);
	// the ceiling at the peak: mu/2omega = 1.76e-4 Pa s at tau = 1/omega = 9.24e-15 s; copper 1.15e-4, omega tau 2.71, 65%
	const ceiling = CU_MU / (2 * W_PEAK), cu = byTau(CU_TAU, W_PEAK, CU_MU);
	check(sci(ceiling, 3) === '1.76e-4' && sci(1 / W_PEAK, 3) === '9.24e-15', `the ceiling ${ceiling} at ${1 / W_PEAK}`);
	check(near(byTau(1 / W_PEAK, W_PEAK, CU_MU), ceiling, 1e-14), 'the curve does not reach the ceiling at omega tau = 1');
	for (let lt = -17; lt <= -11; lt += 0.01) check(byTau(10 ** lt, W_PEAK, CU_MU) <= ceiling * (1 + 1e-14), `the curve passes the ceiling at ${lt}`);
	check(sci(cu, 3) === '1.15e-4' && (W_PEAK * CU_TAU).toFixed(2) === '2.71' && (cu / ceiling * 100).toFixed(0) === '65', `copper ${cu}`);
	check(near(cu, (CU_MU * CU_TAU) / 8.32, 2e-3), 'copper is not eta0 / 8.3');
	// symmetric about the peak on the log axis: f(tau) = f(1/(omega^2 tau))
	for (const k of [0.1, 0.5, 1.3, 2]) check(near(byTau(10 ** k / W_PEAK, W_PEAK, CU_MU), byTau(10 ** -k / W_PEAK, W_PEAK, CU_MU), 1e-12), 'the curve is not symmetric');
	// copper across the band: 8.2e-4 to 1.5e-5 Pa s, 55-fold; honey's ceiling 4.6e-6 Pa s, of which it reaches two millionths
	const lo = byTau(CU_TAU, W_BAND[0], CU_MU), hi = byTau(CU_TAU, W_BAND[1], CU_MU);
	check(sci(lo) === '8.2e-4' && sci(hi) === '1.5e-5' && (lo / hi).toFixed(0) === '55', `copper across the band ${lo}, ${hi}`);
	check(sci(MU_LIQUID / (2 * W_PEAK)) === '4.6e-6' && (fH / (MU_LIQUID / (2 * W_PEAK)) * 1e6).toFixed(0) === '2', 'honey\'s ceiling');
	return { tauH, tauW, wX, fH, fW, ceiling, cu };
}
