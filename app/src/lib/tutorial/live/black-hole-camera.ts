/**
 * Reading chapter R11's camera with a black hole in it, the paper's Figure fig:black-hole-camera made live. A hole of
 * M = μ M_eq, with M_eq = 1.356 × 10²³ kg the equilibrium mass whose Hawking temperature ħc³/8πGMk_B is the graviton
 * sky's 0.905 K, and a camera at the distance r from it, in SI throughout:
 *
 *   the tide (chapter 11.1's exact stretch along the line to the hole)   2GM/r³,
 *   the Einstein ring and the impact parameter of its rays               θ_E = √(2r_s/r),  b_E = √(2r_s r) = θ_E r,
 *   the circular orbit there (chapter 1.8)                               T = 2π√(r³/GM),   v = √(GM/r),
 *   the time a patch of sky stays in focus in a turn                     2θ_E/(2π/T) = θ_E T/π,
 *   the area that a detector of radius a gathers                         πa√(a² + 4b_E²), against πa²,
 *
 * the last from the lens equation: a ray passing at b lands b − b_E²/b from the axis, so it meets the detector
 * between b± = ½[√(a² + 4b_E²) ± a]. The person is 70 kg a metre from the camera, whose tide 2Gm/d³ is 9.34 × 10⁻⁹
 * s⁻²; the bearable tide is 1 s⁻². The camera opens where the tide of one M_eq is bearable, 26.3 km.
 */
import { C, G, HBAR, K_B } from '../../engine/physics/constants';

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// --- the hole, the camera and the person -----------------------------------------------------------------------------

/** The chapter's equilibrium mass, kg: the hole as warm as the graviton sky. */
export const M_EQ = 1.356e23;

/** The bearable tide, s⁻². */
export const BEARABLE = 1;

/** The detector's radius a, m: 5 cm. */
export const DETECTOR = 0.05;

/** The person: 70 kg a metre from the camera. */
export const PERSON = { m: 70, d: 1 };

/** A body's stretch along the line to it, 2Gm/d³, s⁻². */
export const tideOf = (m: number, d: number) => (2 * G * m) / d ** 3;

/** The person's tide on the camera, s⁻². */
export const PERSON_TIDE = tideOf(PERSON.m, PERSON.d);

/** Hawking's temperature ħc³/8πGMk_B of a hole of M kilograms, K. */
export const hawkingTemperature = (M: number) => (HBAR * C ** 3) / (8 * Math.PI * G * M * K_B);

/** The Schwarzschild radius 2GM/c², m. */
export const schwarzschildRadius = (M: number) => (2 * G * M) / C ** 2;

/** Where the hole's tide is `tide`: r³ = 2GM/tide. */
export const distanceForTide = (M: number, tide: number) => Math.cbrt((2 * G * M) / tide);

/** The bearable distance, where the tide is 1 s⁻². */
export const bearableDistance = (M: number) => distanceForTide(M, BEARABLE);

/** Where the hole's tide falls to the person's: r³ = (M/70 kg)(1 m)³. */
export const equalDistance = (M: number) => distanceForTide(M, PERSON_TIDE);

export interface Camera {
	/** The hole's mass, kg. */
	M: number;
	/** Its Schwarzschild radius, m, and Hawking temperature, K. */
	rs: number;
	T_H: number;
	/** The camera's distance, m. */
	r: number;
	/** The hole's tide there, s⁻². */
	tide: number;
	/** The ring's angular radius √(2r_s/r), rad, and the impact parameter of its rays √(2r_s r), m. */
	theta: number;
	bE: number;
	/** The circular orbit's period, s, and speed, m s⁻¹. */
	period: number;
	speed: number;
	/** The time a patch of sky is in focus in one turn, θ_E T/π, s. */
	focus: number;
	/** The annulus a detector of radius a gathers through, b₋ to b₊, m, and its area, m². */
	bMinus: number;
	bPlus: number;
	area: number;
	/** The area over the detector's own πa², and the diameter of a dish of the same area, m. */
	gain: number;
	dish: number;
	/** The hole's tide over the person's. */
	overPerson: number;
}

/** Everything the figure shows, for a hole of μ equilibrium masses and a camera r metres from it. */
export function camera(mu: number, r: number, a = DETECTOR): Camera {
	const M = mu * M_EQ;
	const rs = schwarzschildRadius(M);
	const tide = tideOf(M, r);
	const theta = Math.sqrt((2 * rs) / r);
	const bE = Math.sqrt(2 * rs * r);
	const period = 2 * Math.PI * Math.sqrt(r ** 3 / (G * M));
	const speed = Math.sqrt((G * M) / r);
	const root = Math.sqrt(a * a + 4 * bE * bE);
	const area = Math.PI * a * root;
	return {
		M,
		rs,
		T_H: hawkingTemperature(M),
		r,
		tide,
		theta,
		bE,
		period,
		speed,
		focus: (theta * period) / Math.PI,
		bMinus: (root - a) / 2,
		bPlus: (root + a) / 2,
		area,
		gain: area / (Math.PI * a * a),
		dish: 2 * Math.sqrt(area / Math.PI),
		overPerson: tide / PERSON_TIDE
	};
}

/** Where a ray passing the hole at b lands, at the camera's distance: b − b_E²/b. */
export const landing = (b: number, bE: number) => b - (bE * bE) / b;

// --- the sliders -----------------------------------------------------------------------------------------------------

/** The distance on a scale of powers of ten, 1 m to 10⁵ km; the steps are in log₁₀ r. */
export const DISTANCE = { min: 1, max: 1e8, step: 0.001, key: 0.01, page: 0.1 };
export const LOG_DISTANCE = { low: Math.log10(DISTANCE.min), high: Math.log10(DISTANCE.max) };

/** The mass in equilibrium masses on a scale of powers of ten, 0.3 to 30; the steps are in log₁₀ μ. */
export const MASS = { min: 0.3, max: 30, step: 0.001, key: 0.01, page: 0.1 };
export const LOG_MASS = { low: Math.log10(MASS.min), high: Math.log10(MASS.max) };

/** The opening: one equilibrium mass, and the camera where its tide is bearable. */
export const OPENING = { mu: 1, r: bearableDistance(M_EQ) };

export const distanceFromLog = (v: number) => 10 ** clamp(v, LOG_DISTANCE.low, LOG_DISTANCE.high);
export const massFromLog = (v: number) => 10 ** clamp(v, LOG_MASS.low, LOG_MASS.high);

// --- the plot --------------------------------------------------------------------------------------------------------

/** The plot's spans, in powers of ten: r from 1 m to 10⁸ m, the tide from 10⁻¹² to 10¹⁵ s⁻². */
export const SPAN = { r: [0, 8] as const, tide: [-12, 15] as const };

/** The distances named under the plot, every other power of ten. */
export const R_LABELS: readonly { e: number; text: string }[] = [
	{ e: 0, text: '1 m' },
	{ e: 2, text: '100 m' },
	{ e: 4, text: '10 km' },
	{ e: 6, text: '1000 km' },
	{ e: 8, text: '10⁵ km' }
];

/** The tides named beside it, every fifth power of ten. */
export const TIDE_LABELS: readonly { e: number; text: string }[] = [
	{ e: -10, text: '10⁻¹⁰' },
	{ e: -5, text: '10⁻⁵' },
	{ e: 0, text: '1' },
	{ e: 5, text: '10⁵' },
	{ e: 10, text: '10¹⁰' },
	{ e: 15, text: '10¹⁵' }
];

// --- the words -------------------------------------------------------------------------------------------------------

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
const sup = (e: number) => [...String(e)].map((ch) => SUPER[ch]).join('');

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

/** A positive number rounded to `figures` figures, as digits, trailing zeros kept: "0.350", "26.3", "130". */
function digits(a: number, figures: number): string {
	const rounded = Number(a.toPrecision(figures));
	const e = Math.floor(Math.log10(rounded));
	return rounded.toFixed(Math.max(0, figures - 1 - e));
}

/** Digits in groups of three with commas, as the chapter writes 12,470: "12,500", "100,000". */
const grouped = (s: string) => {
	const [whole, part] = s.split('.');
	const out = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return part === undefined ? out : `${out}.${part}`;
};

/** The same as LaTeX, whose comma takes no space after it: "12{,}500". */
const groupedTex = (s: string) => grouped(s).replace(/,/g, '{,}');

/** A positive number as LaTeX to three figures: "0.350", "1.07 \times 10^{8}". */
export function numTex(a: number, figures = 3): string {
	if (a >= 0.001 && a < 1e4) return digits(a, figures);
	const { m, e } = split(a, figures);
	return `${m} \\times 10^{${e}}`;
}

/** The same as text: "1.07 × 10⁸". */
export function numText(a: number, figures = 3): string {
	if (a >= 0.001 && a < 1e4) return digits(a, figures);
	const { m, e } = split(a, figures);
	return `${m} × 10${sup(e)}`;
}

/** A length as text and LaTeX: mm under a centimetre, cm under a metre, m under a kilometre, then km. */
export function length(L: number): { text: string; tex: string } {
	const [value, unit] =
		L < 0.01 ? [L * 1e3, 'mm'] : L < 1 ? [L * 100, 'cm'] : L < 1e3 ? [L, 'm'] : [L / 1e3, 'km'];
	const s = digits(value, 3);
	return { text: `${grouped(s)} ${unit}`, tex: `${groupedTex(s)}\\,\\mathrm{${unit}}` };
}

/** An angle in radians as text and LaTeX: degrees from 1°, minutes of arc from 1′, else seconds of arc. */
export function angle(theta: number): { text: string; tex: string } {
	const deg = (theta * 180) / Math.PI;
	if (deg >= 1) return { text: `${digits(deg, 3)}°`, tex: `${digits(deg, 3)}^\\circ` };
	if (deg * 60 >= 1) {
		const s = digits(deg * 60, 3);
		return { text: `${s}′`, tex: `${s}'` };
	}
	const s = digits(deg * 3600, 3);
	return { text: `${s}″`, tex: `${s}''` };
}

/**
 * A time as LaTeX: ns under a tenth of a microsecond, µs under a tenth of a millisecond (so that 0.350 ms reads as the
 * chapter writes it), then ms, s, min, h or days.
 */
export function timeTex(t: number): string {
	const [value, unit] =
		t < 1e-7
			? [t * 1e9, '\\mathrm{ns}']
			: t < 1e-4
				? [t * 1e6, '\\mu\\mathrm{s}']
				: t < 1
					? [t * 1e3, '\\mathrm{ms}']
					: t < 60
						? [t, '\\mathrm{s}']
						: t < 3600
							? [t / 60, '\\mathrm{min}']
							: t < 86400
								? [t / 3600, '\\mathrm{h}']
								: [t / 86400, '\\mathrm{days}'];
	return `${groupedTex(digits(value, 3))}\\,${unit}`;
}

/** A speed as LaTeX: m s⁻¹ under a kilometre a second, km s⁻¹ beyond, in groups of three: "16{,}500". */
export function speedTex(v: number): string {
	const [value, unit] = v < 1e3 ? [v, 'm'] : [v / 1e3, 'km'];
	return `${groupedTex(digits(value, 3))}\\,\\mathrm{${unit}\\,s^{-1}}`;
}

/** The mass in equilibrium masses, to three figures: "1.00", "10.0". */
export const massText = (mu: number) => digits(mu, 3);
