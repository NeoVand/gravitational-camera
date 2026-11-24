/**
 * Chapter 10.2's slab of two-level matter at one frequency. The matter has a lower and an upper level ħω apart, with
 * the populations P_l + P_u = 1; at a temperature T they stand in Boltzmann's ratio P_u/P_l = e^{−x}, x = ħω/k_BT, so
 * that P_l − P_u = tanh(x/2). Along a ray through it a mode's occupation n_ω changes as
 *
 *   dn_ω/ds = κP_u(n_ω + 1) − κP_l n_ω,
 *
 * the absorption κP_l n_ω, the stimulated emission κP_u n_ω and the spontaneous emission κP_u, per metre. Measured in
 * the depth d = κs, and with a = (P_l − P_u)d, the radiation that enters with n₀ leaves the depth d with
 *
 *   n_ω(d) = n₀e^{−a} + P_u d (1 − e^{−a})/a,
 *
 * which is n̄ + (n₀ − n̄)e^{−a} for thermal populations, n₀ + P_u d when P_u = P_l, and holds as written for an inverted
 * population, where a < 0. Times ħω³/4π³c², the equation is the equation of transfer with α = κ(P_l − P_u) and j_ω =
 * κP_u ħω³/4π³c². Everything is per unit of κ, so κ itself is never given a value.
 *
 * The temperature slider runs on positions: 0 to 400 are log₁₀ T from 1 to 5 (10 K to 10⁵ K), 410 is the stop where
 * P_u = P_l (T → ∞), the positions between are a detent that falls to one side or the other, and 410 to 510 are an
 * inverted population, P_u from 0.5 to 0.9 in steps of 0.004.
 */
import { C, H, HBAR, KB, numberTex, numberText, occupation, planck } from './planck-spectrum';

export { numberTex, numberText };

// --- the frequency ------------------------------------------------------------------------------------------------------

/** The one frequency f = ω/2π, Hz: 17 THz, near the peak of a room's glow (x = 2.821 at 293 K is 17.2 THz). */
export const F = 17e12;
export const OMEGA = 2 * Math.PI * F;
/** ħω³/4π³c², the radiance of one quantum in each mode, W m⁻² sr⁻¹ s. */
export const QUANTUM_RADIANCE = (HBAR * OMEGA ** 3) / (4 * Math.PI ** 3 * C ** 2);
/** x = ħω/k_BT at this frequency. */
export const xAt = (T: number) => (H * F) / (KB * T);

// --- the slab -----------------------------------------------------------------------------------------------------------

export type Slab = {
	kind: 'thermal' | 'stop' | 'inverted';
	/** The temperature, K, for thermal populations; Infinity at the stop; NaN when inverted. */
	T: number;
	/** ħω/k_BT for thermal populations; 0 at the stop; NaN when inverted. */
	x: number;
	Pl: number;
	Pu: number;
	/** P_l − P_u, computed without subtracting where the two are close. */
	diff: number;
};

/** Thermal populations at the temperature T. */
export function thermal(T: number): Slab {
	const x = xAt(T);
	const e = Math.exp(-x);
	return { kind: 'thermal', T, x, Pl: 1 / (1 + e), Pu: e / (1 + e), diff: Math.tanh(x / 2) };
}

/** Populations with P_u given, P_u > 1/2. */
export function inverted(Pu: number): Slab {
	return { kind: 'inverted', T: NaN, x: NaN, Pl: 1 - Pu, Pu, diff: 1 - 2 * Pu };
}

export const STOP_SLAB: Slab = { kind: 'stop', T: Infinity, x: 0, Pl: 0.5, Pu: 0.5, diff: 0 };

/** The temperature slider's positions. */
export const TEMP = {
	low: 0,
	/** The last thermal position, 10⁵ K. */
	top: 400,
	/** P_u = P_l. */
	stop: 410,
	high: 510,
	step: 1,
	page: 20,
	/** log₁₀ T at the position 0, and the positions in one power of ten. */
	log0: 1,
	perDecade: 100,
	/** P_u per position past the stop. */
	perStep: 0.004
};

export const T_MIN = 10 ** TEMP.log0;
export const T_MAX = 10 ** (TEMP.log0 + TEMP.top / TEMP.perDecade);
export const PU_MAX = 0.5 + (TEMP.high - TEMP.stop) * TEMP.perStep;

/** The slider's position for a temperature. */
export const tempPosition = (T: number) => (Math.log10(T) - TEMP.log0) * TEMP.perDecade;

/** The slab at a slider position. */
export function slabAt(p: number): Slab {
	const v = Math.max(TEMP.low, Math.min(TEMP.high, p));
	if (v <= TEMP.top) return thermal(10 ** (TEMP.log0 + v / TEMP.perDecade));
	if (v <= TEMP.stop) return STOP_SLAB;
	return inverted(Math.min(PU_MAX, 0.5 + (v - TEMP.stop) * TEMP.perStep));
}

/**
 * A new position from the slider, kept off the detent between the last temperature and the stop: a value there goes
 * to the stop, unless it left the stop downwards, when it goes to the last temperature.
 */
export function snapTemp(next: number, prev: number): number {
	const v = Math.max(TEMP.low, Math.min(TEMP.high, next));
	if (v > TEMP.top && v < TEMP.stop) return prev === TEMP.stop ? TEMP.top : TEMP.stop;
	return v;
}

/**
 * The page keys: a fifth of a power of ten in T, or 0.08 in P_u. A step that would pass the stop halts on it, and one
 * that leaves the stop downwards goes to the last temperature, as the arrow keys do.
 */
export function pageTemp(p: number, up: boolean): number {
	const next = Math.max(TEMP.low, Math.min(TEMP.high, p + (up ? TEMP.page : -TEMP.page)));
	if (p === TEMP.stop) return up ? next : TEMP.top;
	if (up && p < TEMP.stop && next > TEMP.top) return TEMP.stop;
	if (!up && p > TEMP.stop && next < TEMP.stop) return TEMP.stop;
	return next;
}

// --- the radiation entering ------------------------------------------------------------------------------------------

/** log₁₀ n_ω of the radiation entering; the lowest position is n_ω = 0. */
export const ENTER = { low: -5, high: 3, step: 0.01, page: 0.5 };

export const enteringAt = (v: number) =>
	v <= ENTER.low + 1e-9 ? 0 : 10 ** Math.min(ENTER.high, v);

export const enteringPosition = (n: number) =>
	n <= 0 ? ENTER.low : Math.max(ENTER.low, Math.min(ENTER.high, Math.log10(n)));

export function pageEntering(v: number, up: boolean): number {
	const next = v + (up ? ENTER.page : -ENTER.page);
	return Number(Math.max(ENTER.low, Math.min(ENTER.high, next)).toFixed(6));
}

/** The furnace's hot block, whose glow at 17 THz is a beam hotter than a room. */
export const BLOCK_T = 1500;
export const ROOM_T = 293;

/** Where the figure opens: a room's slab, nothing entering. */
export const OPENING = { p: tempPosition(ROOM_T), v: ENTER.low };

// --- the numbers ----------------------------------------------------------------------------------------------------------

/** (1 − e^{−a})/a, 1 at a = 0, for either sign of a. */
export const relax = (a: number) => (Math.abs(a) < 1e-9 ? 1 - a / 2 : -Math.expm1(-a) / a);

/** The occupation at the depth d = κs, for radiation entering with n₀. */
export function occupationAt(n0: number, slab: Slab, d: number): number {
	const a = slab.diff * d;
	return n0 * Math.exp(-a) + slab.Pu * d * relax(a);
}

/** The slab's own occupation n̄ = P_u/(P_l − P_u) = 1/(e^x − 1), for thermal populations only. */
export const ownOccupation = (slab: Slab) =>
	slab.kind === 'thermal' ? occupation(slab.x) : undefined;

export type Reading = {
	/** The three rates per metre at the front face, in units of κ. */
	absorption: number;
	stimulated: number;
	spontaneous: number;
	/** α/κ = P_l − P_u. */
	alpha: number;
	/** j_ω/κ, W m⁻² sr⁻¹ s. */
	j: number;
	/** j_ω/α, W m⁻² sr⁻¹ s; undefined where α = 0. */
	ratio: number | undefined;
	/** B_ω(T), W m⁻² sr⁻¹ s, for thermal populations. */
	planck: number | undefined;
	/** n̄(T), for thermal populations. */
	nbar: number | undefined;
	/** The occupation leaving the slab, at d = D_MAX. */
	leaving: number;
};

/** The depth of the slab's back face, κs = 10. */
export const D_MAX = 10;

export function reading(n0: number, slab: Slab): Reading {
	return {
		absorption: slab.Pl * n0,
		stimulated: slab.Pu * n0,
		spontaneous: slab.Pu,
		alpha: slab.diff,
		j: slab.Pu * QUANTUM_RADIANCE,
		ratio: slab.diff === 0 ? undefined : (slab.Pu / slab.diff) * QUANTUM_RADIANCE,
		planck: slab.kind === 'thermal' ? planck(OMEGA, slab.T) : undefined,
		nbar: ownOccupation(slab),
		leaving: occupationAt(n0, slab, D_MAX)
	};
}

// --- the strip ------------------------------------------------------------------------------------------------------------

/** log₁₀ of the depth κs across the strip: 10⁻³ to 10. */
export const D_AXIS = { low: -3, high: 1 };

/** The curve as [log₁₀ κs, log₁₀ n_ω], every hundredth of a power of ten; points where n_ω = 0 are left out. */
export function profile(n0: number, slab: Slab, step = 0.01): [number, number][] {
	const n = Math.round((D_AXIS.high - D_AXIS.low) / step);
	const out: [number, number][] = [];
	for (let i = 0; i <= n; i++) {
		const ld = D_AXIS.low + (i * (D_AXIS.high - D_AXIS.low)) / n;
		const y = occupationAt(n0, slab, 10 ** ld);
		if (y > 0) out.push([ld, Math.log10(y)]);
	}
	return out;
}

export type Window = {
	/** log₁₀ n_ω at the bottom and the top of the strip, whole powers of ten. */
	low: number;
	high: number;
	/** The spacing of the labelled powers of ten. */
	every: number;
	/** Where n̄(T) lies if it is off the strip. */
	nbarOff?: 'below' | 'above';
};

/** How far beyond the curve the strip reaches to keep n̄(T) on it, in powers of ten. */
export const REACH = 3;
/** The fewest powers of ten up the strip. */
export const MIN_SPAN = 3;

/** The strip's range up the side: the curve's, widened to whole powers of ten, to n̄(T) if it is near, and to three. */
export function windowFor(n0: number, slab: Slab): Window {
	const pts = profile(n0, slab, 0.05);
	let lo = Math.min(...pts.map((p) => p[1]));
	let hi = Math.max(...pts.map((p) => p[1]));
	const nbar = ownOccupation(slab);
	let nbarOff: Window['nbarOff'];
	if (nbar !== undefined) {
		const l = Math.log10(nbar);
		if (l < lo - REACH) nbarOff = 'below';
		else if (l > hi + REACH) nbarOff = 'above';
		else {
			lo = Math.min(lo, l);
			hi = Math.max(hi, l);
		}
	}
	let low = Math.floor(lo - 0.12);
	let high = Math.ceil(hi + 0.12);
	if (high - low < MIN_SPAN) {
		const extra = MIN_SPAN - (high - low);
		low -= Math.floor(extra / 2);
		high += Math.ceil(extra / 2);
	}
	const span = high - low;
	return { low, high, every: span <= 6 ? 1 : span <= 12 ? 2 : 3, nbarOff };
}

/** The labelled powers of ten of a window. */
export function powers(w: { low: number; high: number; every: number }): number[] {
	const out: number[] = [];
	for (let e = Math.ceil(w.low / w.every) * w.every; e <= w.high + 1e-9; e += w.every) out.push(e);
	return out;
}

// --- words -------------------------------------------------------------------------------------------------------------------

/** A temperature as text and as LaTeX: "293 K", "1.00 × 10⁵ K". */
export function tempText(T: number): string {
	if (T < 100) return `${T.toFixed(T < 10 ? 2 : 1)} K`;
	if (T < 1e4) return `${Math.round(T)} K`;
	return `${numberText(T, 3)} K`;
}

export function tempTex(T: number): string {
	if (T < 100) return `${T.toFixed(T < 10 ? 2 : 1)}\\,\\mathrm{K}`;
	if (T < 1e4) return `${Math.round(T)}\\,\\mathrm{K}`;
	return `${numberTex(T, 3)}\\,\\mathrm{K}`;
}

/** The temperature slider's reading. */
export function slabWords(slab: Slab): string {
	if (slab.kind === 'thermal') return tempText(slab.T);
	if (slab.kind === 'stop') return 'levels equal';
	return `inverted, ${(100 * slab.Pu).toFixed(1)}% upper`;
}

/** The entering slider's reading. */
export const enteringWords = (n0: number) => `${numberText(n0, 3)} per mode`;
