/**
 * Chapter 11.2's spinning hole and the waves it amplifies. Lengths are in GM/c², times in GM/c³, and the spin is the
 * dimensionless χ = ac²/GM, so that Kerr's horizon, where Δ = r² − 2r + χ² vanishes, is at
 *
 *   r₊ = 1 + √(1 − χ²),
 *
 * it turns at Ω_H = χ/(r₊² + χ²) = χ/2r₊ (in c³/GM; r₊² + χ² = 2r₊ because Δ(r₊) = 0), and the ergosphere's surface,
 * where g_tt vanishes, is at r = 1 + √(1 − χ² cos²ϑ) through the axis, r₊ at the poles and 2 on the equator. The
 * horizon's area 4π(r₊² + a²) is 16π(GM_irr/c²)², so M_irr/M = √((1 + √(1 − χ²))/2) = √(r₊/2), and the share of the
 * mass held in spin, 1 − M_irr/M, runs from 0 to 1 − 1/√2 = 29.3% at χ = 1.
 *
 * A wave turning about the axis as e^{imφ}, with m > 0 turning with the hole, brings energy and angular momentum in
 * the ratio ω/m; the first law and the area theorem give the energy the hole takes δE(1 − mΩ_H/ω) ≥ 0 in units of a
 * positive growth of the area, so the wave leaves stronger exactly when 0 < ω < mΩ_H. Only that sign is computed
 * here. The sizes of the gain need Teukolsky's equation: the five below are the paper's, stated, not computed.
 */
import { C, G } from '../../engine/physics/constants';
import { M_SUN } from '../../engine/multipole';
import { HORIZON, clamp } from './shadow-and-ring';

export { clamp } from './shadow-and-ring';

// --- the hole --------------------------------------------------------------------------------------------------------

/** The outer horizon r₊ = 1 + √(1 − χ²), in GM/c²: chapter 11.1's r_s = 2 at χ = 0, half of it at χ = 1. */
export const horizon = (chi: number) => 1 + Math.sqrt(Math.max(0, 1 - chi * chi));

/** The horizon's angular velocity GMΩ_H/c³ = χ/(r₊² + χ²): 0 at χ = 0, 1/2 at χ = 1. */
export function horizonRate(chi: number): number {
	const r = horizon(chi);
	return chi / (r * r + chi * chi);
}

/** The threshold GM(mΩ_H)/c³ that a wave of azimuthal number m must stay below to be amplified. */
export const threshold = (chi: number, m: number) => m * horizonRate(chi);

/** The ergosphere's surface at the angle ϑ from the axis, 1 + √(1 − χ² cos²ϑ), in GM/c². */
export function ergosphere(chi: number, theta: number): number {
	const c = Math.cos(theta);
	return 1 + Math.sqrt(Math.max(0, 1 - chi * chi * c * c));
}

/** The irreducible mass over the mass, √((1 + √(1 − χ²))/2). */
export const irreducible = (chi: number) => Math.sqrt(horizon(chi) / 2);

/** The share of the mass held in spin, 1 − M_irr/M: at most 1 − 1/√2. */
export const spinShare = (chi: number) => 1 - irreducible(chi);

/** The least M_irr/M, at χ = 1: 1/√2. */
export const LEAST_IRREDUCIBLE = Math.SQRT1_2;

// --- the wave --------------------------------------------------------------------------------------------------------

export type Verdict = 'amplified' | 'absorbed' | 'threshold' | 'none';

/**
 * What the hole does to a wave of frequency GMω/c³ and azimuthal number m > 0: amplifies it if 0 < ω < mΩ_H, absorbs
 * it if ω > mΩ_H, neither at ω = mΩ_H; at ω = 0 there is no wave. Read from the sign of 1 − mΩ_H/ω alone.
 */
export function verdict(chi: number, omega: number, m: number): Verdict {
	if (!(omega > 0)) return 'none';
	const t = threshold(chi, m);
	if (Math.abs(omega - t) <= 1e-9) return 'threshold';
	return omega < t ? 'amplified' : 'absorbed';
}

/** The sign of 1 − mΩ_H/ω: −1, 0 or +1 (0 also with no wave). */
export function bracketSign(chi: number, omega: number, m: number): -1 | 0 | 1 {
	const v = verdict(chi, omega, m);
	return v === 'amplified' ? -1 : v === 'absorbed' ? 1 : 0;
}

/**
 * The widths of the arrows, in drawing units: the outgoing one wider when the wave is amplified and narrower when
 * absorbed, by fixed amounts, since only the sign is computed.
 */
export const ARROW = { in: 9, wider: 15, narrower: 4 };
export function arrowWidths(chi: number, omega: number, m: number) {
	const v = verdict(chi, omega, m);
	const out = v === 'amplified' ? ARROW.wider : v === 'absorbed' ? ARROW.narrower : ARROW.in;
	return { in: ARROW.in, out };
}

// --- the paper's numbers ---------------------------------------------------------------------------------------------

/**
 * The greatest amplification of the mode ℓ = m = 2, as paper/sections/11-vistas.tex states it from Teukolsky and Press
 * (1974): stated, not computed. The text is the paper's, verbatim.
 */
export const PAPER_GAINS: readonly { chi: number; gain: string }[] = [
	{ chi: 0.7, gain: '0.27%' },
	{ chi: 0.9, gain: '6.4%' },
	{ chi: 0.99, gain: '56%' },
	{ chi: 0.998, gain: '91%' },
	{ chi: 1, gain: '138%' }
];

// --- the controls ----------------------------------------------------------------------------------------------------

/** The spin, opening at 0.5, where the opening wave is absorbed, so that no prediction is settled at a glance. */
export const SPIN = { min: 0, max: 0.998, opening: 0.5 };
/** The wave's GMω/c³, from 0 to 1.2 in hundredths, opening at 0.5. */
export const FREQUENCY = { min: 0, max: 1.2, step: 0.01, page: 0.1, opening: 0.5 };
/** The azimuthal numbers offered, opening at 2. */
export const ORDERS = [1, 2, 3] as const;
export type Order = (typeof ORDERS)[number];
export const OPENING = { chi: SPIN.opening, omega: FREQUENCY.opening, m: 2 as Order };

/**
 * The spin slider runs evenly in 2 − r₊ = 1 − √(1 − χ²), so that the horizon shrinks evenly as it is dragged and the
 * paper's fast spins, 0.99 and 0.998, lie apart on the track.
 */
export const placeOf = (chi: number) => HORIZON - horizon(clamp(chi, 0, 1));
export function spinAt(place: number): number {
	const s = 1 - clamp(place, 0, 1);
	return Math.sqrt(Math.max(0, 1 - s * s));
}
export const PLACE = { min: 0, max: placeOf(SPIN.max), step: 0.0005 };

/** A dragged place, as a spin to three decimals, held on one of the paper's spins it falls within a step of. */
export function spinFromPlace(place: number): number {
	const p = clamp(place, PLACE.min, PLACE.max);
	const near = PAPER_GAINS.find(
		(g) => g.chi <= SPIN.max && Math.abs(placeOf(g.chi) - p) < PLACE.step * 0.75
	);
	if (near) return near.chi;
	return clamp(Math.round(spinAt(p) * 1000) / 1000, SPIN.min, SPIN.max);
}

/** The spins the arrow keys stop on: hundredths to 0.99, then thousandths to 0.998. */
export const FINE_STOPS: readonly number[] = [
	...Array.from({ length: 100 }, (_, k) => k / 100),
	...Array.from({ length: 9 }, (_, k) => (990 + k) / 1000)
];
/** The spins Page Up and Page Down stop on: tenths, then 0.99 and 0.998. */
export const COARSE_STOPS: readonly number[] = [
	...Array.from({ length: 10 }, (_, k) => k / 10),
	0.99,
	0.998
];

/** The next stop above (by = 1) or below (by = −1) the spin. */
export function stepSpin(chi: number, by: 1 | -1, coarse = false): number {
	const stops = coarse ? COARSE_STOPS : FINE_STOPS;
	const eps = 1e-9;
	if (by > 0) return stops.find((s) => s > chi + eps) ?? SPIN.max;
	for (let i = stops.length - 1; i >= 0; i--) if (stops[i] < chi - eps) return stops[i];
	return SPIN.min;
}

// --- the drawing -----------------------------------------------------------------------------------------------------

/** The ergosphere's surface through the axis as points (x, z) = r(sin ϑ, cos ϑ), ϑ from 0 to 2π, in GM/c². */
export function ergosphereOutline(chi: number, n = 180): [number, number][] {
	const out: [number, number][] = [];
	for (let k = 0; k <= n; k++) {
		const th = (2 * Math.PI * k) / n;
		const r = ergosphere(chi, th);
		out.push([r * Math.sin(th), r * Math.cos(th)]);
	}
	return out;
}

/** The surface marks: meridians this far apart in longitude. */
export const MERIDIANS = 6;

/**
 * The meridians on the side facing the reader, at the hole's turned angle `phase`: each as the horizontal half-width
 * of its ellipse, a fraction −1 to 1 of r₊ (positive to the right), and how squarely it faces the reader, 0 to 1. The
 * hole turns so that its near side moves to the right.
 */
export function meridians(phase: number): { across: number; facing: number }[] {
	const out: { across: number; facing: number }[] = [];
	for (let k = 0; k < MERIDIANS; k++) {
		const phi = phase + (2 * Math.PI * k) / MERIDIANS;
		const facing = -Math.sin(phi);
		if (facing > 0) out.push({ across: Math.cos(phi), facing });
	}
	return out;
}

/** The drawn turning, in radians per second of the page for each c³/GM of Ω_H: far slower than the hole's own. */
export const DRAWN_RATE = 1.6;

// --- a hole of ten solar masses --------------------------------------------------------------------------------------

/** c³/GM for ten solar masses, s⁻¹: 2.03 × 10⁴. */
export const TEN_SUNS_RATE = C ** 3 / (G * 10 * M_SUN);

/** Turns a second of the horizon of ten solar masses, Ω_H/2π. */
export const tenSunsTurns = (chi: number) => (horizonRate(chi) * TEN_SUNS_RATE) / (2 * Math.PI);

// --- the words -------------------------------------------------------------------------------------------------------

/** A spin to three decimals: "0.900". */
export const spinText = (chi: number) => chi.toFixed(3);
/** A frequency GMω/c³ to two decimals: "0.50". */
export const frequencyText = (omega: number) => omega.toFixed(2);
/** A share as a percentage to one decimal: "15.3". */
export const percentText = (share: number) => (100 * share).toFixed(1);

/** The paper's stated gain at this spin, if it states one. */
export const paperGainAt = (chi: number) =>
	PAPER_GAINS.find((g) => Math.abs(g.chi - chi) < 1e-9)?.gain;
