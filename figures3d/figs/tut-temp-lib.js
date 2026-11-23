// Shared numbers for the three diagrams of the tutorial's chapter 4.2 (tutorial/response/temperature.md):
// tut-temp-bath, tut-temp-phase and tut-temp-moment. Not a figure itself. The charts take chapter 3.1's sheet, axes
// and labels (figs/tut-pot-lib.js, figs/tut-prob-lib.js) and chapter 2.6's sampling of curves
// (figs/tut-fourier-lib.js), imported, not copied. `chapter(check)` asserts every number of the chapter that a diagram
// draws or that its caption prints: k_B T at 300 K, the factors e and e^10, and the thermal spreads of chapter 1.7's
// cart, sigma_q = sqrt(k_B T / k) and sigma_p = sqrt(m k_B T).

export const KB = 1.380649e-23;           // J/K, exact since 2019
export const TEMP = 300;                  // K
export const KT = KB * TEMP;              // J
export const EV = 1.602176634e-19;        // J
export const MASS = 2;                    // kg, the cart of chapter 1.7
export const STIFF = 50;                  // N/m
export const SIGMA_Q = Math.sqrt(KT / STIFF);   // m
export const SIGMA_P = Math.sqrt(MASS * KT);    // kg m/s

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	check((KT / 1e-21).toFixed(2) === '4.14' && (KT / EV).toFixed(4) === '0.0259', `k_B T = ${KT} J`);
	check(Math.E.toFixed(1) === '2.7' && Math.exp(10).toPrecision(2) === '2.2e+4', 'e and e^10');
	check((SIGMA_Q / 1e-12).toFixed(1) === '9.1', `sigma_q = ${SIGMA_Q} m`);
	// the chapter's diagram comment printed sigma_p = 9.1 x 10^-11 kg m/s: it is
	check((SIGMA_P / 1e-11).toFixed(1) === '9.1', `sigma_p = ${SIGMA_P} kg m/s`);
	// and the two agree in their digits because m k = 100 kg N/m, so sigma_p / sigma_q = sqrt(m k) = 10 kg/s
	check(Math.abs(SIGMA_P / SIGMA_Q - 10) < 1e-12, 'sigma_p / sigma_q is not 10 kg/s');
	// equipartition for the cart: each half of H holds k_B T / 2 when q and p have these spreads
	check(Math.abs((0.5 * STIFF * SIGMA_Q ** 2) / KT - 0.5) < 1e-12 && Math.abs(SIGMA_P ** 2 / (2 * MASS) / KT - 0.5) < 1e-12, 'equipartition');
	return { KT, SIGMA_Q, SIGMA_P };
}
