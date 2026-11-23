/**
 * The numbers of chapter 2.7's fading ripple, for its live figure. A thin slab at the height h = 0 carries a ripple
 * of surface density σ₁ cos(k a₁), crests 2π/k apart, and the sensors sit at the height z above it. Above the slab,
 * Laplace's equation lets the ripple of the potential only fade (eq:fade):
 *
 *   Φ = −(2πGσ₁/k) cos(k a₁) e^{−kh},
 *
 * so at the sensors it is weaker than at the slab by the factor e^{kz}, and doubling the height squares that
 * factor, e^{2kz} = (e^{kz})². Each reading of the field shares the fade and differs only by a power of k
 * (the chapter's section on other sensors): with σ̃ the transform of the surface density,
 *
 *   potential  Φ̃   = −(2πG/k) e^{−kz} σ̃      (a clock),
 *   pull       g̃_h = −2πG e^{−kz} σ̃          (an accelerometer, g_h = −∂_h Φ),
 *   tide       d̃   = 2πG k e^{−kz} σ̃          (a tidal pixel, d = −ℰ_zz, eq:data),
 *
 * the factors k⁻¹, 1 and k. At a fixed height these are, with q = kz and up to constant factors, q⁻¹e^{−q}, e^{−q}
 * and q e^{−q}. The fade over the figure's ranges runs to e^{1257}, far beyond what a double can hold, so every
 * large or small number is carried by its base-10 logarithm and printed as a mantissa and an exponent.
 */

/** Newton's constant, m³ kg⁻¹ s⁻². */
export const G = 6.6743e-11;

/**
 * The chapter's ripple of a concrete floor whose thickness rises and falls by 1 cm, at 2400 kg m⁻³: σ₁ = 24 kg m⁻².
 */
export const SIGMA1 = 24;

/** The stops of both sliders, the crest spacing and the height of the sensors, in metres: 1 cm to 2 m. */
export const LADDER: readonly number[] = [
	0.01, 0.012, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3,
	0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2
];

export type Reading = 'potential' | 'pull' | 'tide';
export const READINGS: readonly Reading[] = ['potential', 'pull', 'tide'];

/** The opening state: crests 10 cm apart, seen from 10 cm, the potential. */
export const OPENING = { spacing: 0.1, height: 0.1, reading: 'potential' as Reading } as const;

/** The power of k in each reading's factor: k⁻¹, 1 and k. */
export const POWER: Record<Reading, -1 | 0 | 1> = { potential: -1, pull: 0, tide: 1 };

/** The sign of each reading over a crest of the density: the potential dips, the pull points down, d rises. */
export const SIGN: Record<Reading, -1 | 1> = { potential: -1, pull: -1, tide: 1 };

/** The unit of each reading, in TeX. */
export const UNIT: Record<Reading, string> = {
	potential: '\\text{J\\,kg}^{-1}',
	pull: '\\text{m\\,s}^{-2}',
	tide: '\\text{s}^{-2}'
};

const LOG10E = Math.LOG10E;

/** The wavenumber of a ripple whose crests are `spacing` metres apart, k = 2π/spacing, in m⁻¹. */
export const wavenumber = (spacing: number) => (2 * Math.PI) / spacing;

/** The fraction e^{−kh} of its size at the slab that a ripple keeps at the height h. */
export const fade = (k: number, h: number) => Math.exp(-k * h);

/** The base-10 logarithm of the fade factor e^{kh}, the number of times weaker: kh log₁₀e. */
export const fadeDecades = (k: number, h: number) => k * h * LOG10E;

/**
 * The base-10 logarithm of a reading's factor at the sensors, 2πG k^p e^{−kz}, with p = −1, 0 or 1 for the
 * potential, the pull and the tide.
 */
export const factorLog10 = (reading: Reading, k: number, z: number) =>
	Math.log10(2 * Math.PI * G) + POWER[reading] * Math.log10(k) - fadeDecades(k, z);

/** The base-10 logarithm of the size of a reading at the sensors over a ripple of σ₁ kg m⁻²: the factor times σ₁. */
export const amplitudeLog10 = (reading: Reading, k: number, z: number, sigma1 = SIGMA1) =>
	factorLog10(reading, k, z) + Math.log10(sigma1);

/**
 * A reading's factor at a fixed height against q = kz, in units of its value at q = 1: q^p e^{1−q}. The tide's,
 * q e^{1−q}, peaks at q = 1, where the crests are 2πz apart.
 */
export const shape = (reading: Reading, q: number) => q ** POWER[reading] * Math.exp(1 - q);

/** The crest spacing a tidal camera at the height z sees most strongly, 2πz, where kz = 1. */
export const bestSpacing = (z: number) => 2 * Math.PI * z;

// --- printing numbers -------------------------------------------------------------------------------------------

/** A positive number given by its base-10 logarithm: printed plainly, or as a mantissa and a power of ten. */
export type Printed = { plain: string } | { mantissa: string; exponent: number };

/**
 * A positive number from its base-10 logarithm, as the chapter prints it: from 1 up to 10,000 with three figures
 * ("535", "62.8", "1.10", "1070"); otherwise as a mantissa of two figures and a power of ten ("2.9 × 10⁵", "8.1 × 10⁻⁵").
 */
export function printed(log10x: number): Printed {
	if (log10x >= 0 && log10x < 4) {
		const figures = (10 ** log10x).toPrecision(3);
		const v = Number(figures);
		// below 1000 the three figures keep a final zero ("1.10"); above, they are a whole number ("1070")
		if (v < 1000) return { plain: figures };
		if (v < 9995) return { plain: String(v) };
	}
	let exponent = Math.floor(log10x);
	let m = Number((10 ** (log10x - exponent)).toPrecision(2));
	if (m >= 10) {
		m = 1;
		exponent += 1;
	}
	return { mantissa: m.toFixed(1), exponent };
}

/** The printed number in TeX: "535" or "2.9 \times 10^{5}". */
export function tex(log10x: number): string {
	const p = printed(log10x);
	return 'plain' in p ? p.plain : `${p.mantissa} \\times 10^{${p.exponent}}`;
}

const SUPERSCRIPT: Record<string, string> = {
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹',
	'-': '⁻'
};

/** A power of ten as plain text with superscript figures: "10⁻⁵". */
export const powerOfTen = (exponent: number) =>
	`10${[...String(exponent)].map((c) => SUPERSCRIPT[c]).join('')}`;

/**
 * The printed number as plain text, for the drawing and for screen readers: "535" or "2.9 × 10⁵", or, `tight`,
 * "2.9×10⁵" for a narrow margin.
 */
export function text(log10x: number, tight = false): string {
	const p = printed(log10x);
	const times = tight ? '×' : ' × ';
	return 'plain' in p ? p.plain : `${p.mantissa}${times}${powerOfTen(p.exponent)}`;
}

/** A length in metres as the sliders print it, its unit kept on the same line: "1.2 cm", "10 cm", "1.5 m". */
export function length(m: number): string {
	if (m >= 1) return `${Number(m.toPrecision(3))}\u00a0m`;
	return `${Number((m * 100).toPrecision(3))}\u00a0cm`;
}

/** A length to two figures, for one computed rather than chosen: "63 cm", "6.3 m", "6.3 cm". */
export function lengthAbout(m: number): string {
	if (m >= 1) return `${Number(m.toPrecision(2))}\u00a0m`;
	return `${Number((m * 100).toPrecision(2))}\u00a0cm`;
}

/**
 * kz as a multiple of π when the height is a whole or half number of crest spacings (kz = 2π z/spacing), in TeX:
 * "2\pi", "4\pi", "\pi"; otherwise undefined.
 */
export function kzOfPi(spacing: number, z: number): string | undefined {
	const n = (2 * z) / spacing;
	const whole = Math.round(n);
	if (whole < 1 || whole > 40 || Math.abs(n - whole) > 1e-9) return undefined;
	return whole === 1 ? '\\pi' : `${whole}\\pi`;
}

/**
 * The decades of a logarithmic axis from 1 down to below 10^{−depth}: a step of 1, 2 or 5 times a power of ten
 * decades, so that at most four steps reach the bottom, and the bottom itself, a whole number of steps down.
 */
export function decadeAxis(depth: number): { step: number; bottom: number; ticks: number[] } {
	const need = Math.max(depth, 1e-9);
	let step = 1;
	for (let scale = 1; ; scale *= 10) {
		const found = [1, 2, 5].map((s) => s * scale).find((s) => Math.ceil(need / s) <= 4);
		if (found !== undefined) {
			step = found;
			break;
		}
	}
	const count = Math.max(1, Math.ceil(need / step - 1e-9));
	const ticks = Array.from({ length: count + 1 }, (_, i) => (i === 0 ? 0 : -i * step));
	return { step, bottom: -count * step, ticks };
}
