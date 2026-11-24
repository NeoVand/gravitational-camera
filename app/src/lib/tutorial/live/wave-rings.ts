/**
 * Chapter 7.6's wave rings. A ring of twelve free balls at z = 0, in a plane gravitational wave travelling along
 * k̂ = e₃, toward the reader, with e₁ to the right and e₂ up. Times are in 1/ω, so ω = 1, and strains in the unit h
 * the sliders set.
 *
 * The wave, in the chapter's transverse-traceless gauge, is
 *
 *   h_ij = h₊ (e₁e₁ − e₂e₂)_ij + h× (e₁e₂ + e₂e₁)_ij ,
 *
 * with h₊(t) = A₊ cos ωt and h×(t) = A× cos(ωt − φ), φ the phase of h× behind h₊ (chapter 5.4: h× = b sin ωt is
 * a quarter period behind). Each ball moves by δξ_i = ½ h_ij ξ_j. The tide is 𝓔_ij = −½ ∂²_t h_ij = ½ ω² h_ij
 * for a steady wave, and the magnetic part is the chapter's eq:b-wave, 𝓑_ij = ε_ipq k̂_p 𝓔_qj: the tide's pattern
 * turned anticlockwise by 45° about k̂, as seen by the reader the wave approaches, equal in size.
 *
 * Two arms of length L along e₁′ = (cos ψ, sin ψ) and e₂′ = (−sin ψ, cos ψ) change by ½ h′₁₁ L and ½ h′₂₂ L, h′
 * the strain in the arms' axes; the chapter's LIGO strain, the difference of the arms over the length of one, is
 * ½(h′₁₁ − h′₂₂) = h₊ cos 2ψ + h× sin 2ψ.
 */

import { clampTo, stepped, two, type Range } from './gauge-or-wave';

export { clampTo, stepped, two, type Range };

export type Vec3 = [number, number, number];
export type Mat3 = [Vec3, Vec3, Vec3];
export type Point = [number, number];

/** k̂, the direction of travel: e₃, out of the screen toward the reader. */
export const K_HAT: Vec3 = [0, 0, 1];

/** Balls on the ring. */
export const BALLS = 12;
/** One period of ωt on the screen, in seconds. */
export const PERIOD_S = 4;
/** The strain the sliders' unit h is drawn as: a ball on the ring moves by up to a quarter of its radius. */
export const DRAWN = 0.5;
/** The strain of the waves that LIGO detects, for the scale of the drawing. */
export const LIGO = 1e-21;
/** The drawing's exaggeration: the drawn strain over LIGO's, 5 × 10²⁰. */
export const EXAGGERATION = DRAWN / LIGO;

const DEG = Math.PI / 180;
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

// --- the sliders ---------------------------------------------------------------------------------------------------

/** The amplitudes A₊ and A×, in units of h. */
export const AMPLITUDE: Range = { min: 0, max: 1, step: 0.05, key: 0.05, large: 0.25 };
/** The phase of h× behind h₊, degrees. */
export const LAG: Range = { min: 0, max: 360, step: 5, key: 5, large: 45 };
/** The angle of the arms from e₁, degrees. */
export const ARMS: Range = { min: 0, max: 90, step: 1, key: 1, large: 15 };

export interface Knobs {
	/** A₊, units of h. */
	plus: number;
	/** A×, units of h. */
	cross: number;
	/** φ, degrees: h× = A× cos(ωt − φ). */
	lag: number;
	/** ψ, degrees. */
	arms: number;
}

export interface Settings extends Knobs {
	/** ωt, radians. */
	phase: number;
}

/** Opens with a plus wave of amplitude 1, the arms along e₁ and e₂, at the phase of the largest stretch, playing. */
export const OPENING: Settings = { plus: 1, cross: 0, lag: 90, arms: 0, phase: 0 };

// --- the wave ------------------------------------------------------------------------------------------------------

/** The two strains now, units of h: h₊ = A₊ cos ωt, h× = A× cos(ωt − φ). */
export const strains = (s: Settings) => ({
	plus: s.plus * Math.cos(s.phase),
	cross: s.cross * Math.cos(s.phase - s.lag * DEG)
});

/** The table h_ij = h₊ e⁺_ij + h× e×_ij, transverse to e₃. */
export function strainTable(plus: number, cross: number): Mat3 {
	return [
		[plus, cross, 0],
		[cross, -plus, 0],
		[0, 0, 0]
	];
}

/** The figure's h_ij now. */
export const strainNow = (s: Settings) => {
	const h = strains(s);
	return strainTable(h.plus, h.cross);
};

const apply = (m: Mat3, v: Vec3): Vec3 =>
	[0, 1, 2].map((i) => m[i][0] * v[0] + m[i][1] * v[1] + m[i][2] * v[2]) as Vec3;

/** δξ_i = ½ h_ij ξ_j, for a ball at ξ in the plane of the ring. */
export function displacement(h: Mat3, xi: Point): Point {
	const d = apply(h, [xi[0], xi[1], 0]);
	return [d[0] / 2, d[1] / 2];
}

/** The ring's balls at rest, on a unit circle: the first on e₁, anticlockwise. */
export const RING: Point[] = Array.from({ length: BALLS }, (_, m) => {
	const a = (2 * Math.PI * m) / BALLS;
	return [Math.cos(a), Math.sin(a)];
});

// --- the tide and its magnetic part --------------------------------------------------------------------------------

/**
 * The tide 𝓔_ij = −½ ∂²_t h_ij, units of ω²h. Each strain is a cosine of ωt, so its second derivative is minus
 * itself, and 𝓔 = ½ h: proportional to the strain, as chapters 1.5 and 1.5b said.
 */
export function tide(s: Settings): Mat3 {
	const ddot = strainTable(-s.plus * Math.cos(s.phase), -s.cross * Math.cos(s.phase - s.lag * DEG));
	return ddot.map((row) => row.map((v) => -0.5 * v)) as Mat3;
}

/** The Levi-Civita symbol ε_ipq. */
export function levi(i: number, p: number, q: number): number {
	if (i === p || p === q || i === q) return 0;
	return (i - p) * (p - q) * (q - i) > 0 ? 1 : -1;
}

/** The chapter's eq:b-wave, 𝓑_ij = ε_ipq k̂_p 𝓔_qj, for any k̂. */
export function magnetic(E: Mat3, k: Vec3 = K_HAT): Mat3 {
	const B: Mat3 = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			for (let p = 0; p < 3; p++)
				for (let q = 0; q < 3; q++) B[i][j] += levi(i, p, q) * k[p] * E[q][j];
	return B;
}

/** A table's size, |T|² = T_ij T_ij. */
export const size = (T: Mat3) => Math.sqrt(T.flat().reduce((a, v) => a + v * v, 0));

/** A transverse table's plus and cross numbers: T₊ = T₁₁ (= −T₂₂), T× = T₁₂. */
export const parts = (T: Mat3) => ({ plus: (T[0][0] - T[1][1]) / 2, cross: T[0][1] });

/** A transverse table turned anticlockwise by β about e₃, seen from +e₃: R T Rᵀ. */
export function turned(T: Mat3, beta: number): Mat3 {
	const c = Math.cos(beta);
	const s = Math.sin(beta);
	const R: Mat3 = [
		[c, -s, 0],
		[s, c, 0],
		[0, 0, 1]
	];
	const out: Mat3 = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			for (let a = 0; a < 3; a++)
				for (let b = 0; b < 3; b++) out[i][j] += R[i][a] * T[a][b] * R[j][b];
	return out;
}

/**
 * The angle of a transverse pattern's positive principal axis from e₁, radians, in [0, π): ½ atan2(T×, T₊).
 * Undefined when the pattern is zero.
 */
export function stretchAxis(T: Mat3): number | undefined {
	const { plus, cross } = parts(T);
	if (Math.hypot(plus, cross) < 1e-12) return undefined;
	const a = 0.5 * Math.atan2(cross, plus);
	return a < 0 ? a + Math.PI : a;
}

/**
 * The strain the magnetic ring is drawn with, in 𝓔's convention: the table h^B with 𝓑 = −½ ∂²_t h^B, which for a
 * steady wave is 2𝓑/ω². It is h turned by 45°.
 */
export const magneticStrain = (s: Settings): Mat3 =>
	magnetic(tide(s)).map((row) => row.map((v) => 2 * v)) as Mat3;

/**
 * The angular velocity of a gyroscope at ξ relative to one at the centre, chapter 7.5's δΩ_i = (1/c) 𝓑_ij ξ_j, in
 * units of ω²h |ξ|/c. For ξ across the wave it lies across the wave too.
 */
export function gyroTurn(B: Mat3, xi: Point): Point {
	const w = apply(B, [xi[0], xi[1], 0]);
	return [w[0], w[1]];
}

/** The six gyroscope pairs: each pair at ±ξ on the ring, ξ every 30° from e₁. */
export const GYRO_PAIRS: [Point, Point][] = Array.from({ length: 6 }, (_, m) => {
	const a = (Math.PI * m) / 6;
	return [
		[Math.cos(a), Math.sin(a)],
		[-Math.cos(a), -Math.sin(a)]
	];
});

// --- the arms ------------------------------------------------------------------------------------------------------

/** The arms' unit vectors e₁′ and e₂′ at the angle ψ, degrees. */
export const armAxes = (psi: number): [Point, Point] => {
	const a = psi * DEG;
	return [
		[Math.cos(a), Math.sin(a)],
		[-Math.sin(a), Math.cos(a)]
	];
};

/** h′_ab = e_a′ · h · e_b′ for the two arms. */
export function inArms(h: Mat3, psi: number): { h11: number; h22: number; h12: number } {
	const [a, b] = armAxes(psi);
	const q = (u: Point, v: Point) =>
		u[0] * (h[0][0] * v[0] + h[0][1] * v[1]) + u[1] * (h[1][0] * v[0] + h[1][1] * v[1]);
	return { h11: q(a, a), h22: q(b, b), h12: q(a, b) };
}

/** Each arm's change over its length: ½ h′₁₁ and ½ h′₂₂. */
export function armChanges(h: Mat3, psi: number): [number, number] {
	const t = inArms(h, psi);
	return [t.h11 / 2, t.h22 / 2];
}

/** The LIGO strain, (ΔL₁ − ΔL₂)/L = ½(h′₁₁ − h′₂₂), from the table in the arms' axes. */
export function armDifference(h: Mat3, psi: number): number {
	const [d1, d2] = armChanges(h, psi);
	return d1 - d2;
}

/** The same in closed form: h₊ cos 2ψ + h× sin 2ψ. */
export const armFormula = (plus: number, cross: number, psi: number) =>
	plus * Math.cos(2 * psi * DEG) + cross * Math.sin(2 * psi * DEG);

/**
 * The arm difference's largest size over a period, units of h: the reading is α cos ωt + β cos(ωt − φ), with
 * α = A₊ cos 2ψ and β = A× sin 2ψ, whose amplitude is √(α² + β² + 2αβ cos φ).
 */
export function armPeak(k: Knobs): number {
	const a = k.plus * Math.cos(2 * k.arms * DEG);
	const b = k.cross * Math.sin(2 * k.arms * DEG);
	return Math.sqrt(Math.max(0, a * a + b * b + 2 * a * b * Math.cos(k.lag * DEG)));
}

// --- the polarization ---------------------------------------------------------------------------------------------

export type Polarization =
	| 'none'
	| 'plus'
	| 'cross'
	| 'linear'
	| 'circular'
	| 'circular-back'
	| 'elliptical'
	| 'elliptical-back';

/**
 * What the pattern does over a period (chapter 5.4). h× = A× cos φ cos ωt + A× sin φ sin ωt: with sin φ = 0 the two
 * strains rise and fall together and the pattern pulses along fixed axes (linear); otherwise it turns, anticlockwise
 * as the reader sees it when sin φ > 0, at a steady size when the amplitudes are equal and a quarter period apart
 * (circular), and swelling and shrinking otherwise (elliptical). "-back" is the clockwise sense.
 */
export function polarization(k: Knobs): Polarization {
	if (k.plus === 0 && k.cross === 0) return 'none';
	if (k.cross === 0) return 'plus';
	if (k.plus === 0) return 'cross';
	const s = Math.sin(k.lag * DEG);
	if (Math.abs(s) < 1e-9) return 'linear';
	const back = s < 0 ? '-back' : '';
	return near(k.plus, k.cross) && Math.abs(Math.abs(s) - 1) < 1e-9
		? (`circular${back}` as Polarization)
		: (`elliptical${back}` as Polarization);
}

// --- the predictions -----------------------------------------------------------------------------------------------

/** A plus wave alone: h× at 0 and h₊ on. */
export const plusOnly = (k: Knobs) => k.plus > 0 && near(k.cross, 0);

/** Circular polarization as the second prediction asks: h× as large as h₊, a quarter period behind. */
export const circular = (k: Knobs) => k.plus > 0 && near(k.cross, k.plus) && near(k.lag, 90);

/** The arms turned by 45° in a plus wave. */
export const armsTurned = (k: Knobs) => plusOnly(k) && near(k.arms, 45);

/** How much of ωt the reader must watch for the first: half a period, to see the stretch change places. */
export const WATCH_FIRST = Math.PI;
/** And for the second: a quarter period, to see the pattern turn. */
export const WATCH_SECOND = Math.PI / 2;

/** Adds the phase just run to a watch, if the condition holds now. */
export const watch = (watched: number, holds: boolean, d: number) =>
	holds ? watched + d : watched;

/** The first, once a plus wave alone has been watched for half a period. */
export const noteFirst = (done: boolean, k: Knobs, watched: number) =>
	done || (plusOnly(k) && watched >= WATCH_FIRST - 1e-9);

/** The second, once the circular wave has been watched for a quarter period. */
export const noteSecond = (done: boolean, k: Knobs, watched: number) =>
	done || (circular(k) && watched >= WATCH_SECOND - 1e-9);

/** The third, once the arms are at 45° in a plus wave. */
export const noteThird = (done: boolean, k: Knobs) => done || armsTurned(k);

// --- the words -----------------------------------------------------------------------------------------------------

/** A setting as its slider reads: "0.50". */
export const setting = (v: number) => v.toFixed(2);

/** An angle in degrees, to the nearest degree, in [0, 180). */
export const degrees = (a: number) => {
	const d = Math.round(((a / DEG) % 180) + 180) % 180;
	return `${d}°`;
};

/** A signed number to two decimals, with a true minus sign: "−0.71", "0.00". */
export const signed2 = (v: number) => {
	const r = Math.round(v * 100) / 100;
	return r < 0 ? `−${(-r).toFixed(2)}` : r.toFixed(2);
};
