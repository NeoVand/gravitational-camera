/**
 * Chapter 5.5's slab in front of a background. Radiation of radiance I_bg enters a uniform slab of optical depth τ
 * at the temperature T_slab, and the pixel on the far side receives the chapter's eq:slab with Kirchhoff's law,
 *
 *   I = I_bg e^{−τ} + B(1 − e^{−τ}),
 *
 * so that the slab changes what the pixel receives by I − I_bg = (B − I_bg)(1 − e^{−τ}). The radiances are taken at
 * one angular frequency, ħω = 2.82 k_B × 300 K, near the peak of the glow at 300 K, and both are Planck radiances,
 * the background's at T_bg and the slab's at T_slab:
 *
 *   B_ω(T) = ħω³/(4π³c²) · 1/(e^{ħω/k_BT} − 1),
 *
 * the chapter's law for gravitational waves summed over the two polarizations (the same as for light). At τ = 10⁻³⁷
 * the change is far below the rounding of a double, so it is never found by subtracting I_bg from I: 1 − e^{−τ} is
 * computed with expm1, and the relative change as (B/I_bg − 1)(1 − e^{−τ}), with B/I_bg − 1 itself from expm1 of the
 * difference of the two exponents.
 */

/** The reduced Planck constant, J s, Boltzmann's constant, J K⁻¹, and the speed of light, m s⁻¹ (exact in the SI). */
export const HBAR = 1.054571817e-34;
export const KB = 1.380649e-23;
export const C = 299792458;

/** The frequency of the figure: ħω = 2.82 k_B × 300 K. */
export const X_REF = 2.82;
export const T_REF = 300;
/** Its angular frequency, s⁻¹: 1.11 × 10¹⁴, or 17.6 THz. */
export const OMEGA = (X_REF * KB * T_REF) / HBAR;

/** The factor ħω³/4π³c², W m⁻² sr⁻¹ per s⁻¹: the Planck radiance at this ω times e^{ħω/k_BT} − 1. */
export const PREFACTOR = (HBAR * OMEGA ** 3) / (4 * Math.PI ** 3 * C * C);

/** ħω/k_BT at this frequency, written so that it is exact in the ratio of temperatures. */
export const xOf = (T: number) => (X_REF * T_REF) / T;

/** The Planck radiance B_ω(T), W m⁻² sr⁻¹ per s⁻¹. */
export const planck = (T: number) => PREFACTOR / Math.expm1(xOf(T));

/**
 * B(T_slab)/B(T_bg) − 1 without cancellation: with x = ħω/k_BT, it is (e^{x_bg} − e^{x_slab})/(e^{x_slab} − 1)
 * = expm1(x_bg − x_slab)/(1 − e^{−x_slab}). Exactly zero when the two temperatures are equal.
 */
export function contrast(slab: number, bg: number): number {
	if (slab === bg) return 0;
	const dx = X_REF * T_REF * ((slab - bg) / (slab * bg));
	return Math.expm1(dx) / -Math.expm1(-xOf(slab));
}

/** The share of the background the slab takes away, 1 − e^{−τ}, kept exact when τ is tiny. */
export const absorbed = (tau: number) => -Math.expm1(-tau);

/** The share it lets through, e^{−τ}. */
export const transmitted = (tau: number) => Math.exp(-tau);

/** What the pixel receives, its parts, and the change it sees, for a slab and a background. */
export type Reading = {
	/** The background's radiance I_bg = B(T_bg). */
	bg: number;
	/** The slab's own radiance B = B(T_slab). */
	B: number;
	/** 1 − e^{−τ} and e^{−τ}. */
	q: number;
	t: number;
	/** The background's share I_bg e^{−τ} and the slab's glow B(1 − e^{−τ}). */
	bgShare: number;
	glowShare: number;
	/** The radiance the pixel receives, I = I_bg e^{−τ} + B(1 − e^{−τ}). */
	I: number;
	/** B/I_bg − 1. */
	contrast: number;
	/** The relative change (I − I_bg)/I_bg = (B/I_bg − 1)(1 − e^{−τ}), computed without subtracting. */
	change: number;
};

export function reading(tau: number, slab: number, bg: number): Reading {
	const Ibg = planck(bg);
	const B = planck(slab);
	const q = absorbed(tau);
	const t = transmitted(tau);
	const k = contrast(slab, bg);
	const bgShare = Ibg * t;
	const glowShare = B * q;
	return {
		bg: Ibg,
		B,
		q,
		t,
		bgShare,
		glowShare,
		// a sum of two positive parts, exact to rounding at every depth (and exactly I_bg when B = I_bg); the change
		// below is kept apart, since at τ = 10⁻³⁷ this sum is I_bg to the last digit
		I: k === 0 ? Ibg : bgShare + glowShare,
		contrast: k,
		change: k * q
	};
}

// --- the controls ---------------------------------------------------------------------------------------------------

/** τ on a scale of powers of ten from 10⁻³⁷ to 10²: the arrows step a tenth of a decade, the page keys a decade. */
export const TAU = { low: -37, high: 2, step: 0.1, page: 1 };
/** Each temperature from 50 to 3000 K: the arrows step 1 K, the page keys 100 K. */
export const TEMPERATURE = { low: 50, high: 3000, step: 1, page: 100 };

export type Setting = { tau: number; slab: number; bg: number };
export type PresetName = 'fog' | 'steel';

/** The paper's placeholder friction gives α = 1.2 × 10⁻³⁷ m⁻¹ (chapter 5.1): a metre of it has this τ. */
export const STEEL_TAU = 1.2e-37;
/** A line of sight through the Earth's diameter of such matter, 1.27 × 10⁷ m. */
export const EARTH_TAU = 1.6e-30;

/**
 * "fog in light": a slab of τ = 3 as warm as its background, 300 K, for the reader then to warm; "steel in
 * gravity": a metre of the placeholder's matter, cold at 293 K, in front of a hot body at 1500 K.
 */
export const PRESETS: Record<PresetName, Setting> = {
	fog: { tau: 3, slab: 300, bg: 300 },
	steel: { tau: STEEL_TAU, slab: 293, bg: 1500 }
};
export const PRESET_ORDER: readonly PresetName[] = ['fog', 'steel'];

/** Where the figure opens. */
export const OPENING: Setting = { tau: 1, slab: 600, bg: 300 };

/** Which preset a setting is, if any. */
export function presetOf(s: Setting): PresetName | undefined {
	return PRESET_ORDER.find(
		(p) =>
			Math.abs(Math.log10(PRESETS[p].tau / s.tau)) < 0.005 &&
			PRESETS[p].slab === s.slab &&
			PRESETS[p].bg === s.bg
	);
}

// --- the predictions ------------------------------------------------------------------------------------------------

/**
 * The first is answered once, with the slab as warm as the background, the reader has had it both transparent,
 * τ ≤ 0.01 (it passes 99% of the background), and opaque, τ ≥ 10 (it passes 0.005%).
 */
export const THIN = 0.01;
export const THICK = 10;

/**
 * The second asks about τ = 10⁻³⁰: it is answered with a slab colder than the background and τ at most
 * 10^{−29.7} = 2.0 × 10⁻³⁰, so that the Earth's diameter, 1.6 × 10⁻³⁰, counts.
 */
export const GRAVITY_TAU = 10 ** -29.7;

/** Whether a setting answers the second prediction. */
export const hidesNothing = (s: Setting) => s.slab < s.bg && s.tau <= GRAVITY_TAU;

// --- the picture ----------------------------------------------------------------------------------------------------

/** The temperature whose Planck radiance at this frequency is I: ħω/k_B ln(1 + ħω³/4π³c²I), K. */
export const temperatureOf = (I: number) => (X_REF * T_REF) / Math.log1p(PREFACTOR / I);

/**
 * The lightness of a radiance in the picture, 0 to 1: the temperature whose Planck radiance it is, on a scale of
 * powers of ten from 50 K at 0 to 3000 K at 1. The radiances themselves span almost eight powers of ten between
 * those temperatures, most of them below 300 K, so a scale of radiance would leave everything warmer nearly white.
 */
export function level(I: number): number {
	const v =
		Math.log(temperatureOf(I) / TEMPERATURE.low) / Math.log(TEMPERATURE.high / TEMPERATURE.low);
	return Math.max(0, Math.min(1, v));
}

/** A warm grey for a radiance, the same in both themes, since it stands for a brightness. */
export const grey = (I: number) => `hsl(32 10% ${(7 + 86 * level(I)).toFixed(1)}%)`;

// --- words and numbers ----------------------------------------------------------------------------------------------

const SUPER: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
};
const sup = (e: number) => [...String(e)].map((c) => SUPER[c]).join('');

/** Mantissa and exponent, the mantissa rounded to `figures` and carried if it rounds to 10. */
function split(x: number, figures: number) {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return { m: m.toFixed(figures - 1), e };
}

/** A number as text to `figures` figures, with a true minus sign: "0.37", "−0.955", "1.2 × 10⁻³⁷", "10⁻³⁰", "0". */
export function numberText(x: number, figures = 2): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1e4) return sign + String(Number(a.toPrecision(figures)));
	const { m, e } = split(a, figures);
	return sign + (Number(m) === 1 ? `10${sup(e)}` : `${m} × 10${sup(e)}`);
}

/** The same as LaTeX: "1.2 \times 10^{-37}". */
export function numberTex(x: number, figures = 2): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '-' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1e4) return sign + String(Number(a.toPrecision(figures)));
	const { m, e } = split(a, figures);
	return sign + (Number(m) === 1 ? `10^{${e}}` : `${m} \\times 10^{${e}}`);
}

/** A share as a percentage, to as many places as it needs to show more than zero: "99.0%", "0.0045%". */
export function percent(share: number): string {
	const p = 100 * share;
	if (p === 0) return '0%';
	if (p >= 99.95 && p < 100) {
		// as close to all as the figures can tell: show how far short
		const places = Math.min(12, Math.max(1, 1 - Math.floor(Math.log10(100 - p))));
		return `${p.toFixed(places)}%`;
	}
	if (p >= 0.1) return `${p.toPrecision(3)}%`;
	return `${Number(p.toPrecision(2))}%`;
}
