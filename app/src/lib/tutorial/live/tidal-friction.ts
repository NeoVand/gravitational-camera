/**
 * Chapter 11.4's friction of a horizon. A moon of mass m circles a hole of mass M, not turning, at a distance d, with
 * Ω² = GM/d³ (a light moon). Its tide on the hole, 𝓔_ij = (Gm/d³)(δ_ij − 3n̂_in̂_j), turns with the orbit, so that
 * 𝓔̇:𝓔̇ = 18Ω²(Gm/d³)², and the horizon takes the power
 *
 *   P = ν 𝓔̇:𝓔̇,   ν = (16/45) G⁵M⁶/c¹³ = M r_s⁵/90c³   (the paper's eq:horizon-friction, its electric half),
 *
 * while the pair radiates (32/5)G⁴M³m²/c⁵d⁵ in waves (chapter 7.7's, for a light moon); the ratio is (GM/c²d)⁴. The
 * tide turns at twice the orbit's rate, at x = GM·2Ω/c³ = 2(GM/c²d)^{3/2}, which depends on d/r_s alone.
 *
 * The friction is the slow end of the greybody factor: Page's Γ₂ = (256/225)x⁶ and, at every frequency,
 * Im χ = 5c⁵Γ₂/16Gω⁵, which in units of M r_s²(GM/c³)² is (5/64)Γ₂/x⁵, with the friction law νω as (4/45)x. The
 * exact Γ₂ is chapter 11.3's Regge–Wheeler table (./hole-against-sky-data.ts) on x = 0.01 to 6, read between its
 * points as a power of x (a straight line on log–log axes). Below the table, where the waves are longer still, Γ₂ is
 * Page's form times 1 + ax + bx², with a and b fixed by the table's first two points (a comes out near 2π, the
 * Coulomb-like correction; the solver's own ratios at x = 0.002 and 0.005 are met to three figures).
 */
import { C, G } from '../../engine/physics/constants';
import { M_SUN } from '../../engine/multipole';
import { X, greybodyAt } from './hole-against-sky';

export { M_SUN };

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// --- the greybody factor and the friction -------------------------------------------------------------------------

/** Page's coefficient, (16/5)(16/45) = 256/225. */
export const PAGE = 256 / 225;

/** Page's limit (256/225)x⁶: the friction law, as a greybody factor. */
export const page = (x: number) => PAGE * x ** 6;

/** The table's x and its Γ₂, while Γ₂ is under 1 − 10⁻⁷, and the first x where the table holds Γ₂ at 1. */
const NODES: { x: number; g: number }[] = [];
for (let i = 0; i < X.length; i++) {
	const g = greybodyAt(2, i);
	NODES.push({ x: X[i], g });
	if (g >= 1) break;
}

/** Γ₂ over Page's form at the table's first two x, and the 1 + ax + bx² through them. */
const R1 = NODES[0].g / page(NODES[0].x) - 1;
const R2 = NODES[1].g / page(NODES[1].x) - 1;
const X1 = NODES[0].x;
const X2 = NODES[1].x;
export const LOW = (() => {
	// a x₁ + b x₁² = R₁, a x₂ + b x₂² = R₂
	const det = X1 * X2 ** 2 - X2 * X1 ** 2;
	return { a: (R1 * X2 ** 2 - R2 * X1 ** 2) / det, b: (X1 * R2 - X2 * R1) / det };
})();

/** The least x of the table. */
export const TABLE_START = X1;

/**
 * Γ₂ at x = GMω/c³: the Regge–Wheeler table, a power of x between its points, 1 above it; below it Page's form times
 * 1 + ax + bx².
 */
export function gamma2(x: number): number {
	if (x <= 0) return 0;
	if (x < X1) return page(x) * (1 + LOW.a * x + LOW.b * x * x);
	const last = NODES[NODES.length - 1];
	if (x >= last.x) return 1;
	let lo = 0;
	let hi = NODES.length - 1;
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (NODES[mid].x <= x) lo = mid;
		else hi = mid;
	}
	const a = NODES[lo];
	const b = NODES[hi];
	const t = Math.log(x / a.x) / Math.log(b.x / a.x);
	return Math.exp(Math.log(a.g) + t * Math.log(b.g / a.g));
}

/** Γ₂ over Page's form: the same as Im χ over the friction law νω. */
export const overPage = (x: number) => gamma2(x) / page(x);

/** Im χ in units of M r_s²(GM/c³)²: (5/64)Γ₂/x⁵. */
export const imChi = (x: number) => ((5 / 64) * gamma2(x)) / x ** 5;

/** The friction law νω in the same units: (4/45)x. */
export const law = (x: number) => (4 / 45) * x;

/** The table's x up to `top`, where the computed curves are drawn. */
export const tableX = (top: number) => NODES.map((n) => n.x).filter((x) => x <= top + 1e-12);

/** The peak of Im χ on the table, where it is greatest, and how many times the friction law it is there. */
export const PEAK = (() => {
	let best = { x: NODES[0].x, value: imChi(NODES[0].x) };
	// between its points Im χ is a power of x, so the peak is at one of them
	for (const { x } of NODES) {
		const v = imChi(x);
		if (v > best.value) best = { x, value: v };
	}
	return { ...best, times: best.value / law(best.x) };
})();

// --- the hole and its moon ----------------------------------------------------------------------------------------

/** The moon: the Moon's mass, 7.342 × 10²² kg. */
export const MOON_MASS = 7.342e22;

/** The horizon friction ν = (16/45)G⁵M⁶/c¹³ of a hole of M kilograms, in J s⁵. */
export const friction = (M: number) => ((16 / 45) * G ** 5 * M ** 6) / C ** 13;

/** r_s = 2GM/c², in metres. */
export const schwarzschild = (M: number) => (2 * G * M) / C ** 2;

export type Orbit = {
	/** The hole's mass, kg, and its r_s, m. */
	M: number;
	rs: number;
	/** The moon's distance, m, and its orbital rate Ω, s⁻¹. */
	d: number;
	omega: number;
	/** The tide's frequency x = GM·2Ω/c³. */
	x: number;
	/** ν, J s⁵, and 𝓔̇:𝓔̇ = 18Ω²(Gm/d³)², s⁻⁶. */
	nu: number;
	rate: number;
	/** The power the horizon takes, P = ν 𝓔̇:𝓔̇, and the pair's waves, (32/5)G⁴M³m²/c⁵d⁵, both in W, and their ratio. */
	power: number;
	waves: number;
	ratio: number;
};

/** A moon of mass m (the Moon's) at n = d/r_s round a hole of M kilograms. */
export function orbit(M: number, n: number, m = MOON_MASS): Orbit {
	const rs = schwarzschild(M);
	const d = n * rs;
	const omega = Math.sqrt((G * M) / d ** 3);
	const x = (G * M * 2 * omega) / C ** 3;
	const nu = friction(M);
	const rate = 18 * omega ** 2 * ((G * m) / d ** 3) ** 2;
	const power = nu * rate;
	const waves = ((32 / 5) * G ** 4 * M ** 3 * m ** 2) / (C ** 5 * d ** 5);
	return { M, rs, d, omega, x, nu, rate, power, waves, ratio: power / waves };
}

/** x = 2(GM/c²d)^{3/2} = 2(2n)^{−3/2} for a moon at n = d/r_s, whatever the mass. */
export const tideX = (n: number) => 2 * (2 * n) ** -1.5;

// --- the sliders --------------------------------------------------------------------------------------------------

/** The hole's mass as log₁₀(M/M_⊙): 1 to 10⁹ solar masses, a twentieth of a power of ten a step, opening at 10. */
export const MASS = { min: 0, max: 9, step: 0.05, page: 1, opening: 1 };

/** The moon's distance as log₁₀(d/r_s): 3 to 10⁴, a hundredth of a power of ten a step, opening at 30. */
export const DISTANCE = {
	min: Math.log10(3),
	max: 4,
	step: 0.01,
	page: 0.1,
	opening: Math.log10(30)
};

// --- the drawing --------------------------------------------------------------------------------------------------

/** The Earth's Love number, 4.6's. */
export const K2_EARTH = 0.3;
/** The drawn bulge: the long semi-axis is 1 + BULGE·k₂ of the radius (exaggerated beyond measure). */
export const BULGE = 0.5;
/** The drawn friction angle by which the Earth's bulge lags the moon, radians (drawn larger than the Earth's). */
export const LAG = 0.17;
/** The drawn orbit's period, seconds: far slower than any real orbit here. */
export const DRAWN_PERIOD = 12;

/** The body's outline, a bulge of k₂ along the angle θ: semi-axes 1 + BULGE k₂ and its reciprocal's root. */
export function bulgeAxes(k2: number) {
	const a = 1 + BULGE * k2;
	return { a, b: 1 / Math.sqrt(a) };
}

/** Where the moon is drawn, 0 at 3 r_s to 1 at 10⁴ r_s, on log₁₀(d/r_s). */
export const moonPlace = (logN: number) =>
	clamp((logN - DISTANCE.min) / (DISTANCE.max - DISTANCE.min), 0, 1);

/** The plots' spans: x from 10⁻⁷ to 1, Γ₂ from 10⁻⁴² to 1, Im χ from 10⁻⁹ to 1000. */
export const SPAN = {
	x: [-7, 0] as const,
	gamma: [-42, 0] as const,
	chi: [-9, 3] as const
};

/** The x where Page's line reaches Γ₂ = 1: (225/256)^{1/6}. */
export const PAGE_TOP = (1 / PAGE) ** (1 / 6);

// --- the words ----------------------------------------------------------------------------------------------------

function split(a: number, figures: number) {
	let e = Math.floor(Math.log10(a));
	let m = Number((a / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return { m: m.toFixed(figures - 1), e };
}

function digits(a: number, figures: number) {
	const e = Math.floor(Math.log10(a));
	return a.toFixed(Math.max(0, figures - 1 - e));
}

/** A positive number as LaTeX to `figures` figures: "29.5", "0.00680", "1.80 \times 10^{26}". */
export function numTex(a: number, figures = 3): string {
	if (a >= 0.001 && a < 1e4) return digits(a, figures);
	const { m, e } = split(a, figures);
	return `${m} \\times 10^{${e}}`;
}

const SUP: Record<string, string> = {
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
/** An exponent as superscript figures: "⁻⁴²". */
export const sup = (e: number) =>
	String(e)
		.split('')
		.map((c) => SUP[c])
		.join('');

/** A positive number as text: "29.5", "1.80 × 10²⁶". */
export function numText(a: number, figures = 3): string {
	if (a >= 0.001 && a < 1e4) return digits(a, figures);
	const { m, e } = split(a, figures);
	return `${m} × 10${sup(e)}`;
}

/** A length in metres as km or m, to three figures. */
export function lengthTex(L: number): string {
	if (L >= 1e3) return `${numTex(L / 1e3)}\\,\\mathrm{km}`;
	return `${numTex(L)}\\,\\mathrm{m}`;
}

/** A solar-mass count from log₁₀: "1", "10", "3.16 × 10⁴", to three figures past 10. */
export const solarText = (logM: number) => numText(10 ** logM, 3);
export const solarTex = (logM: number) => numTex(10 ** logM, 3);
