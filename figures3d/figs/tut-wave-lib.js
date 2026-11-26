// Shared numbers for the four diagrams of the tutorial's section 5.1 (tutorial/waves/wave-equation.md):
// tut-wave-slab, tut-wave-pulses, tut-wave-evanescent and tut-wave-damped. Not a figure itself. The sheet, the strokes,
// the labels and the cropping are section 1.2's (figs/tut-pot-lib.js), the axes section 3.1's (figs/tut-prob-lib.js),
// the sampling of curves section 2.6's (figs/tut-fourier-lib.js), the dashed outline at rest section 4.3's
// (figs/tut-vec-lib.js, DASH), and matter's colour section 2.4's (figs/tut-null-lib.js, MATTER), all imported, not
// copied.
//
// `chapter(check)` asserts every number of the chapter that a diagram draws or its caption prints: the two ratios
// kc/omega = 0.6 and 2 of the fading section, their angle sin(theta) = 0.6 and vertical wavenumber k_z = (4/3) k, and
// the fade kappa = sqrt(3) omega / c; and the damped wave's Gamma/omega = 0.05, for which c/Gamma is 3.2 wavelengths,
// the energy falls by e and the amplitude by sqrt(e) over c/Gamma, and the exact complex wavenumber
// k = (omega/c) sqrt(1 + i Gamma/omega) differs from the chapter's omega/c + i Gamma/2c by the footnote's fraction.

export { MATTER } from './tut-null-lib.js';
export { DASH } from './tut-vec-lib.js';

// ---- the fading section: lengths in units of c/omega (so that omega/c = 1 and a wavelength is 2 pi) ---------------
export const RATIOS = { wave: 0.6, fade: 2 };          // kc / omega in the two panels of tut-wave-evanescent
export const kz = (r) => Math.sqrt(1 - r * r);         // the vertical wavenumber, units of omega/c, for r = kc/omega < 1
export const kappa = (r) => Math.sqrt(r * r - 1);      // the rate of fading, units of omega/c, for r > 1

// ---- the damped wave --------------------------------------------------------------------------------------------
export const GAMMA = 0.05;                              // Gamma / omega
/** The exact complex wavenumber of the damped wave equation driven at a real omega, in units of omega/c:
 * sqrt(1 + i Gamma/omega), the root with positive real part. */
export function wavenumber(g = GAMMA) {
	const r = Math.hypot(1, g), re = Math.sqrt((r + 1) / 2), im = Math.sqrt((r - 1) / 2);
	return [re, im];
}

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// the wave that leaves: sin(theta) = kc/omega = 0.6, its wavevector (k, k_z) of length omega/c
	const r = RATIOS.wave, theta = Math.asin(r);
	check(near(kz(r), 0.8, 1e-15) && near(kz(r) / r, 4 / 3, 1e-15), `k_z = ${kz(r)}`);
	check(near(Math.hypot(r, kz(r)), 1, 1e-15), 'the wavevector (k, k_z) is not omega/c long');
	check(((theta * 180) / Math.PI).toFixed(2) === '36.87', `theta = ${(theta * 180) / Math.PI}`);
	// the crests on the plane are 1/0.6 wavelengths apart, and a wavelength is the crests' spacing along (k, k_z)
	check(near((2 * Math.PI) / r / (2 * Math.PI), 1 / 0.6, 1e-15), 'the crests on the plane');
	// the fade: kappa = sqrt(k^2 - omega^2/c^2) = sqrt(3) omega/c for kc/omega = 2, and kappa < k
	const f = RATIOS.fade;
	check(near(kappa(f), Math.sqrt(3), 1e-15) && kappa(f) < f, `kappa = ${kappa(f)}`);
	// the damped wave: c/Gamma in wavelengths, 20 / 2 pi = 3.18, which the chapter rounds to 3.2
	const lengths = 1 / GAMMA / (2 * Math.PI);
	check(lengths.toFixed(2) === '3.18' && lengths.toFixed(1) === '3.2', `c/Gamma = ${lengths} wavelengths`);
	// the amplitude falls as e^{-Gamma x / 2c}: by sqrt(e) and the energy by e over c/Gamma
	check(near(Math.exp(-GAMMA * (1 / GAMMA) / 2), Math.exp(-0.5), 1e-15), 'the amplitude over c/Gamma');
	// the exact wavenumber, and the footnote's fraction Gamma^2/8 omega^2 by which its imaginary part is below Gamma/2c
	const [re, im] = wavenumber();
	check(near(re * re - im * im, 1, 1e-14) && near(2 * re * im, GAMMA, 1e-15), 'k^2 is not (omega/c)^2 (1 + i Gamma/omega)');
	check(near(1 - im / (GAMMA / 2), GAMMA ** 2 / 8, 2e-6), `the exact Im k is below Gamma/2c by ${1 - im / (GAMMA / 2)}`);
	const [, im1] = wavenumber(0.01);
	check((((1 - im1 / 0.005) * 1e5)).toFixed(2) === '1.25', 'the footnote\'s 1.25 x 10^-5 at Gamma/omega = 0.01');
	return { theta, kz: kz(r), kappa: kappa(f), lengths, k: [re, im] };
}
