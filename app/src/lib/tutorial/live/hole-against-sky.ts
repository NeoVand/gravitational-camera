/**
 * Chapter 11.3's hole against a warm sky. A Schwarzschild hole of mass M glows at Hawking's temperature
 * k_BT_H = ħc³/8πGM, and in each mode of degree ℓ a camera receives n_out = n_bg + Γ_ℓ(n_H − n_bg) (the chapter's
 * bookkeeping), so that the hole removes Γ_ℓ(n_bg − n_H) from the sky's occupation. Weighed by energy, ħω times
 * ω² modes per unit of frequency, and added over ℓ into the absorption cross-section
 *
 *   σ_abs = (πc²/ω²) Σ (2ℓ + 1) Γ_ℓ,
 *
 * the shadow depth, against a black disc of the capture area 27πG²M²/c⁴, is
 *
 *   D = ∫ σ_abs (n_bg − n_H) x³ dx / 27π(GM/c²)² ∫ n_bg x³ dx,   x = GMω/c³,
 *
 * and counted in quanta, x² in the place of x³. The occupations are 1/(e^{8πx} − 1) for the hole and
 * 1/(e^{8πxτ} − 1) for the sky, with τ = T_H/T_bg. The Γ_ℓ are the chapter's own table from the Regge–Wheeler
 * equation (./hole-against-sky-data.ts), ℓ = 2 to 33 on x from 0.01 to 6; σ_abs is read between the table's points
 * as a straight line (from 0 at x = 0) and taken as the capture area beyond x = 6, as the chapter's sums were. A sky
 * of light is drawn in geometric optics only: σ_abs is the capture area at every frequency.
 */
import { C, G, HBAR, K_B } from '../../engine/physics/constants';
import { GREYBODY, X, type GreybodyRow } from './hole-against-sky-data';

export { GREYBODY, X } from './hole-against-sky-data';

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// --- the hole and the skies ------------------------------------------------------------------------------------------

/** ħc³/8πGk_B, in kg K: a hole of mass M is at this over M kelvin. */
export const HAWKING_MASS_KELVIN = (HBAR * C ** 3) / (8 * Math.PI * G * K_B);

/** Hawking's temperature of a hole of M kilograms, in kelvin. */
export const hawkingTemperature = (M: number) => HAWKING_MASS_KELVIN / M;

/** The mass whose Hawking temperature is T kelvin. */
export const massAt = (T: number) => HAWKING_MASS_KELVIN / T;

/** The graviton sky of Section XI, 0.905 K, and the microwave sky of light, 2.7255 K. */
export const GRAVITON_SKY = 0.905;
export const MICROWAVE_SKY = 2.7255;

/** The equilibrium mass, whose temperature is the graviton sky's: 1.356 × 10²³ kg. */
export const M_EQ = massAt(GRAVITON_SKY);

export type Sky = 'gravitons' | 'light';
export const SKY_ORDER: readonly Sky[] = ['gravitons', 'light'];
/** Each sky's temperature, and whether the hole is drawn against it in geometric optics. */
export const SKIES: Record<Sky, { T: number; geometric: boolean }> = {
	gravitons: { T: GRAVITON_SKY, geometric: false },
	light: { T: MICROWAVE_SKY, geometric: true }
};

/** T_H/T_bg for a hole of μ = M/M_eq equilibrium masses against a sky. */
export const tau = (mu: number, sky: Sky) => GRAVITON_SKY / mu / SKIES[sky].T;

/** The thermal occupation 1/(e^z − 1). */
export const occupation = (z: number) => 1 / Math.expm1(z);

/** GM/c² of a hole of μ equilibrium masses, in metres. */
export const lengthOf = (mu: number) => (G * mu * M_EQ) / C ** 2;

/** The capture disc's diameter 2b_c = 2√27 GM/c², in metres. */
export const captureDiameter = (mu: number) => 2 * Math.sqrt(27) * lengthOf(mu);

// --- the greybody table ----------------------------------------------------------------------------------------------

/** The table's degrees, ℓ = 2 to 33, and its largest x. */
export const DEGREES = GREYBODY.map((r) => r.l);
export const X_TABLE = X[X.length - 1];

const ROWS = new Map<number, GreybodyRow>(GREYBODY.map((r) => [r.l, r]));

/** Γ_ℓ at the table's i-th x: 0 below the degree's stretch, 1 above it, and 0 for a degree beyond the table. */
export function greybodyAt(l: number, i: number): number {
	const row = ROWS.get(l);
	if (!row) return 0;
	if (i < row.from) return 0;
	const k = i - row.from;
	return k < row.values.length ? row.values[k] : 1;
}

/** σ_abs/27π(GM/c²)² at each of the table's x: Σ (2ℓ + 1) Γ_ℓ / 27x². */
export const SHARE: readonly number[] = X.map((x, i) => {
	let sum = 0;
	for (const row of GREYBODY) sum += (2 * row.l + 1) * greybodyAt(row.l, i);
	return sum / (27 * x * x);
});

/** The nodes of the straight-line reading: x = 0 (where σ_abs is 0) and the table's x. */
const NODES_X = [0, ...X];
const NODES_S = [0, ...SHARE];

/**
 * σ_abs over the capture area at x = GMω/c³, for a hole against a sky: from the table, a straight line between its
 * points, and 1 beyond it; 1 everywhere in geometric optics.
 */
export function share(x: number, sky: Sky = 'gravitons'): number {
	if (SKIES[sky].geometric) return 1;
	if (x <= 0) return 0;
	if (x > X_TABLE) return 1;
	// the nodes are evenly spaced in two runs: find the interval by bisection
	let lo = 0;
	let hi = NODES_X.length - 1;
	while (hi - lo > 1) {
		const mid = (lo + hi) >> 1;
		if (NODES_X[mid] <= x) lo = mid;
		else hi = mid;
	}
	const t = (x - NODES_X[lo]) / (NODES_X[hi] - NODES_X[lo]);
	return NODES_S[lo] + t * (NODES_S[hi] - NODES_S[lo]);
}

// --- the depth -------------------------------------------------------------------------------------------------------

export type Weight = 'energy' | 'count';
/** The power of x that weighs each frequency: x³ for energy, x² for a count of quanta. */
export const POWER: Record<Weight, 2 | 3> = { energy: 3, count: 2 };

const ZETA: Record<2 | 3, number> = { 2: 1.2020569031595942, 3: Math.PI ** 4 / 90 };
const FACTORIAL: Record<2 | 3, number> = { 2: 2, 3: 6 };

/** ∫₀^∞ x^p/(e^{ax} − 1) dx = p! ζ(p + 1)/a^{p+1}. */
export const thermalMoment = (a: number, p: 2 | 3) => (FACTORIAL[p] * ZETA[p]) / a ** (p + 1);

/**
 * ∫_c^∞ x^p/(e^{ax} − 1) dx, exactly: the sum over k of ∫_c^∞ x^p e^{−kax} dx, each a polynomial in c times e^{−kac}.
 */
export function thermalTail(a: number, c: number, p: 2 | 3): number {
	let sum = 0;
	for (let k = 1; k < 5000; k++) {
		const b = k * a;
		let poly = 0;
		// Σ_j p!/(p − j)! c^{p−j}/b^{j+1}
		let falling = 1;
		for (let j = 0; j <= p; j++) {
			poly += (falling * c ** (p - j)) / b ** (j + 1);
			falling *= p - j;
		}
		const term = Math.exp(-b * c) * poly;
		sum += term;
		if (term < 1e-15 * sum) break;
	}
	return sum;
}

/** Five-point Gauss–Legendre nodes and weights on [−1, 1]. */
const GL_T = [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664];
const GL_W = [
	0.5688888888888889, 0.47862867049936647, 0.47862867049936647, 0.23692688505618908,
	0.23692688505618908
];

/**
 * The shadow depth D of a hole of μ = M/M_eq equilibrium masses against a sky, weighed by energy or counted: positive
 * a shadow, 1 a black disc, 0 where the hole vanishes, negative a glow.
 */
export function depth(mu: number, sky: Sky, weight: Weight): number {
	const p = POWER[weight];
	const t = tau(mu, sky);
	// geometric optics: the capture disc is black, so D = 1 − τ^{p+1}
	if (SKIES[sky].geometric) return 1 - t ** (p + 1);
	const aSky = 8 * Math.PI * t;
	const aHole = 8 * Math.PI;
	let top = 0;
	for (let i = 0; i + 1 < NODES_X.length; i++) {
		const x0 = NODES_X[i];
		const x1 = NODES_X[i + 1];
		const half = (x1 - x0) / 2;
		const mid = (x0 + x1) / 2;
		for (let k = 0; k < GL_T.length; k++) {
			const x = mid + half * GL_T[k];
			const s = NODES_S[i] + ((x - x0) / (x1 - x0)) * (NODES_S[i + 1] - NODES_S[i]);
			top += GL_W[k] * half * s * (occupation(aSky * x) - occupation(aHole * x)) * x ** p;
		}
	}
	// beyond the table the hole takes the whole capture area
	top += thermalTail(aSky, X_TABLE, p) - thermalTail(aHole, X_TABLE, p);
	return top / thermalMoment(aSky, p);
}

// --- the spectrum drawn ----------------------------------------------------------------------------------------------

/** The peak of s³/(e^s − 1), at s = 2.8214: the sky's energy per unit of frequency is largest there. */
export const PEAK_S = 2.821439372122079;
export const PEAK_VALUE = PEAK_S ** 3 / Math.expm1(PEAK_S);

/**
 * The drawn span: ħω/k_BT_bg from 0 to 12, where the sky's energy ends, or x from 0 to 0.8, where the hole's own glow
 * through its greybody factors ends, whichever is wider; and the drawn height, 1.15 times the sky's peak or what the
 * hole adds to it, whichever is higher. The hole's own n_H x³, before its greybody factors, may leave the top.
 */
export const SPAN = 12;
export const HOLE_SPAN = 0.8;
export const HEIGHT = 1.15;

/** x at the sky's peak of energy. */
export const skyPeakX = (mu: number, sky: Sky) => PEAK_S / (8 * Math.PI * tau(mu, sky));

/** The drawing's extent: the span in ħω/k_BT_bg and the largest x drawn. */
export function extent(mu: number, sky: Sky) {
	const t = tau(mu, sky);
	const x = Math.max(SPAN / (8 * Math.PI * t), HOLE_SPAN);
	return { s: 8 * Math.PI * t * x, x };
}

/** The drawn height, in units of the sky's peak: room for the sky and for what the hole removes or adds. */
export const drawnHeight = (points: readonly SpectrumPoint[]) =>
	HEIGHT * Math.max(1, ...points.map((p) => Math.abs(p.removed)));

/** The largest x drawn. */
export const drawnX = (mu: number, sky: Sky) => extent(mu, sky).x;

/** The wavelength 2πc/ω at the sky's peak of energy, in metres: 5.6 mm for the graviton sky. */
export const skyPeakWavelength = (sky: Sky) =>
	(2 * Math.PI * C * HBAR) / (PEAK_S * K_B * SKIES[sky].T);

/** The hole's own peak over the sky's, on the same axis: τ³. */
export const holePeak = (mu: number, sky: Sky) => tau(mu, sky) ** 3;

export type SpectrumPoint = {
	/** x = GMω/c³. */
	x: number;
	/** The sky's n_bg x³, the hole's n_H x³ and the removed σ_abs(n_bg − n_H)x³/27π(GM/c²)², each over the sky's peak. */
	sky: number;
	hole: number;
	removed: number;
	/** σ_abs over the capture area. */
	share: number;
};

/**
 * The spectra on n + 1 evenly spaced x from 0 to the drawn x, in units of the sky's peak: the areas under `removed`
 * and `sky` are in the ratio D by energy.
 */
export function spectrum(mu: number, sky: Sky, n = 240): SpectrumPoint[] {
	const t = tau(mu, sky);
	const { s: sMax, x: xMax } = extent(mu, sky);
	const out: SpectrumPoint[] = [];
	for (let k = 0; k <= n; k++) {
		const s = (sMax * k) / n;
		const x = (xMax * k) / n;
		const skyV = s === 0 ? 0 : s ** 3 * occupation(s);
		const holeV = s === 0 ? 0 : s ** 3 * occupation(s / t);
		const sh = share(x, sky);
		out.push({
			x,
			sky: skyV / PEAK_VALUE,
			hole: holeV / PEAK_VALUE,
			removed: (sh * (skyV - holeV)) / PEAK_VALUE,
			share: sh
		});
	}
	return out;
}

/** Ticks from 0 to `top`: the finest of 1, 2 or 5 times a power of ten that makes at most `most` intervals. */
export function ticks(top: number, most = 6): number[] {
	const e = Math.floor(Math.log10(top / most));
	let step = 10 ** e;
	for (const m of [1, 2, 5, 10]) {
		step = m * 10 ** e;
		if (top / step <= most * (1 + 1e-9)) break;
	}
	const out: number[] = [];
	for (let k = 0; k * step <= top * (1 + 1e-9); k++) out.push(Number((k * step).toPrecision(6)));
	return out;
}

// --- the disc --------------------------------------------------------------------------------------------------------

/** The sky's luminance in the drawing, in linear light: a middle grey. */
export const SKY_LUMINANCE = 0.18;

/** A linear luminance as an sRGB grey, "#rrggbb". */
export function grey(Y: number): string {
	const y = clamp(Y, 0, 1);
	const v = y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055;
	const h = Math.round(v * 255)
		.toString(16)
		.padStart(2, '0');
	return `#${h}${h}${h}`;
}

/** The disc's grey: the sky's luminance times 1 − D, white at 1/0.18 = 5.6 times the sky or more. */
export const discGrey = (D: number) => grey(SKY_LUMINANCE * (1 - D));

// --- the slider ------------------------------------------------------------------------------------------------------

/** The masses offered, in equilibrium masses: 0.3 to 300, a hundredth of a power of ten apart to three figures. */
export const MASS = { min: 0.3, max: 300, opening: 2, page: 10 };

/** The stops: 10^(k/100) to three figures, with 0.3, 0.5, 2, 3, 5 and their tens among them. */
export const STOPS: readonly number[] = (() => {
	const set = new Set<number>();
	const lo = Math.ceil(100 * Math.log10(MASS.min));
	const hi = Math.floor(100 * Math.log10(MASS.max));
	for (let k = lo; k <= hi; k++) set.add(Number((10 ** (k / 100)).toPrecision(3)));
	for (const v of [0.3, 0.5, 2, 3, 5, 20, 30, 50, 200, 300]) set.add(v);
	return [...set].filter((v) => v >= MASS.min && v <= MASS.max).sort((a, b) => a - b);
})();

/** The stop nearest a mass. */
export function stopOf(mu: number): number {
	let best = 0;
	for (let i = 1; i < STOPS.length; i++)
		if (Math.abs(Math.log(STOPS[i] / mu)) < Math.abs(Math.log(STOPS[best] / mu))) best = i;
	return best;
}

export const OPENING: { stop: number; sky: Sky } = { stop: stopOf(MASS.opening), sky: 'gravitons' };

/** The masses of Section XI's three quoted depths, marked on the slider without their depths. */
export const PAPER_MASSES = [2, 3, 10] as const;

// --- the words -------------------------------------------------------------------------------------------------------

/** A mass in equilibrium masses to three figures: "2.00", "27.5", "300". */
export const massText = (mu: number) => mu.toPrecision(3);

/** A depth: three decimals while it is under 1 in size, three figures beyond, with a true minus. */
export function depthText(D: number): string {
	const a = Math.abs(D);
	const s = a < 1 ? a.toFixed(3) : a.toPrecision(3);
	return D < 0 && Number(s) !== 0 ? `−${s}` : s;
}
