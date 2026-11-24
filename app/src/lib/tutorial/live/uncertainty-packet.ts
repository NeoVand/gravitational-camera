/**
 * Chapter 8.2's uncertainty packet: a Gaussian wave packet on a line, ψ ∝ e^{−x²/4σ_x²} e^{iax²}, in units with
 * ħ = 1, or two in-phase copies of it a distance d apart. The engine samples ψ on a grid of 2048 points, finds σ_x
 * from |ψ|² on the grid, and the momentum distribution |ψ̃(k)|²/2π from a fast Fourier transform of the grid, in
 * chapter 2.6's convention ψ̃(k) = ∫ψ e^{−ikx} dx, normalized to unit area; σ_p = σ_k since p = ħk. The chapter's
 * closed forms, σ_p = (ħ/2σ_x)√(1 + 16a²σ_x⁴) for one packet and σ_x² = σ_x0² + (d²/4)/(1 + e^{−d²/8σ_x0²}) for two
 * unchirped copies, are here only to be checked against. Settings, words and predictions are pure functions too.
 */
import { fft } from './noise-spectrum';
import { stepped, type Range } from './near-to-far';
import { landed } from './two-paths';

export { landed, stepped, type Range };

// --- the settings ----------------------------------------------------------------------------------------------------

/** The packet's width σ_x, its chirp a, whether it is split into two copies, and their distance d. */
export interface Settings {
	sigma: number;
	a: number;
	split: boolean;
	d: number;
}

/** The figure opens on one packet of width 1 without a chirp; the copies, once split, start 3 apart. */
export const OPENING: Settings = { sigma: 1, a: 0, split: false, d: 3 };

/** The width σ_x, 0.25 to 4: 0.05 a press, 0.25 with Shift. */
export const SIGMA: Range = { min: 0.25, max: 4, step: 0.05, key: 0.05, large: 0.25 };
/** The chirp a, 0 to 1: 0.01 dragged, 0.05 a press, 0.25 with Shift. */
export const CHIRP: Range = { min: 0, max: 1, step: 0.01, key: 0.05, large: 0.25 };
/** The distance d between the copies, 0 to 10: 0.1 dragged, 0.5 a press, 2 with Shift. */
export const DIST: Range = { min: 0, max: 10, step: 0.1, key: 0.5, large: 2 };

/** The number of points of the grid the transform is taken on. */
export const N = 2048;

/** What the plots show: x from −12 to 12, p from −6 to 6, the same in every state. */
export const X_SPAN = 12;
export const P_SPAN = 6;

// --- the chapter's closed forms ----------------------------------------------------------------------------------

/** One packet's σ_p = (ħ/2σ_x)√(1 + 16a²σ_x⁴), with ħ = 1. */
export const sigmaPOne = (sigma: number, a: number) =>
	Math.sqrt(1 + 16 * a * a * sigma ** 4) / (2 * sigma);

/** One packet's σ_xσ_p/(ħ/2) = √(1 + 16a²σ_x⁴). */
export const ratioOne = (sigma: number, a: number) => Math.sqrt(1 + 16 * a * a * sigma ** 4);

/** e^{−d²/8σ_x0²}, the overlap of two unchirped copies' |ψ|², relative to one copy's. */
const overlapOf = (sigma: number, d: number) => Math.exp((-d * d) / (8 * sigma * sigma));

/** Two unchirped copies of width σ_x0, d apart: σ_x² = σ_x0² + (d²/4)/(1 + e^{−d²/8σ_x0²}). */
export const varXTwo = (sigma: number, d: number) =>
	sigma * sigma + (d * d) / 4 / (1 + overlapOf(sigma, d));

/**
 * Two unchirped copies' σ_p² = ⟨k²⟩ = ∫|ψ′|²/∫|ψ|², worked out the same way:
 * (1/4σ_x0²)[1 + e^{−d²/8σ_x0²}(1 − d²/4σ_x0²)]/(1 + e^{−d²/8σ_x0²}).
 */
export function varPTwo(sigma: number, d: number) {
	const e = overlapOf(sigma, d);
	return (1 + e * (1 - (d * d) / (4 * sigma * sigma))) / (1 + e) / (4 * sigma * sigma);
}

// --- the wave function ---------------------------------------------------------------------------------------------

/** The centres of the packet, or of its two copies. */
export const centresOf = (s: Settings) => (s.split && s.d > 0 ? [-s.d / 2, s.d / 2] : [0]);

/**
 * ∫|ψ|² dx of the unnormalized ψ = Σ e^{−(x−c)²/4σ²} e^{ia(x−c)²}: √(2π)σ for one packet; for two copies twice that
 * times 1 + e^{−d²/8σ²} e^{−2a²d²σ²}, the cross term, whose phase turns as e^{2iadx}, entering with its Gaussian
 * average. At d = 0 the two copies are one packet of twice the amplitude.
 */
export function normOf(s: Settings) {
	const one = Math.sqrt(2 * Math.PI) * s.sigma;
	const cs = centresOf(s);
	if (cs.length === 1) return s.split ? 4 * one : one;
	const d = s.d;
	return 2 * one * (1 + overlapOf(s.sigma, d) * Math.exp(-2 * s.a * s.a * d * d * s.sigma ** 2));
}

/** The unnormalized ψ(x), as its real and imaginary parts. */
export function psiAt(x: number, s: Settings): { re: number; im: number } {
	let re = 0;
	let im = 0;
	const cs = centresOf(s);
	const twice = s.split && cs.length === 1 ? 2 : 1;
	for (const c of cs) {
		const u = x - c;
		const g = twice * Math.exp((-u * u) / (4 * s.sigma * s.sigma));
		const phase = s.a * u * u;
		re += g * Math.cos(phase);
		im += g * Math.sin(phase);
	}
	return { re, im };
}

/**
 * The span of the grid, chosen for each state so that both sides are resolved: ψ is negligible at its ends (9σ_x
 * beyond the outer centre, where |ψ| is e^{−20} of its peak), the momenta are sampled at a twelfth of one packet's σ_p
 * at least, and the fringes of two copies, 2π/d apart, at a tenth of their spacing. The 2048 points then reach
 * momenta of πN/L, at least eight of one packet's σ_p in every state the sliders allow.
 */
export function spanOf(s: Settings) {
	const d = s.split ? s.d : 0;
	return Math.max(2 * (d / 2 + 9 * s.sigma), (24 * Math.PI) / sigmaPOne(s.sigma, s.a), 10 * d);
}

/** The mean and standard deviation of a density sampled at the points t with spacing h. */
function moments(t: Float64Array, rho: Float64Array, h: number) {
	let m0 = 0;
	let m1 = 0;
	let m2 = 0;
	for (let i = 0; i < t.length; i++) {
		m0 += rho[i] * h;
		m1 += t[i] * rho[i] * h;
		m2 += t[i] * t[i] * rho[i] * h;
	}
	const mean = m1 / m0;
	return { area: m0, mean, sd: Math.sqrt(Math.max(0, m2 / m0 - mean * mean)) };
}

/** What the engine finds for a state: both distributions, their spreads and the product. */
export interface Transform {
	/** The span of the grid and its spacings in x and in k. */
	L: number;
	dx: number;
	dk: number;
	/** The grid in x, and |ψ|² normalized on it. */
	x: Float64Array;
	density: Float64Array;
	/** The momenta k = p in ascending order, and the momentum density |ψ̃(k)|²/2π, normalized to unit area. */
	k: Float64Array;
	momentum: Float64Array;
	/** Σ|ψ̃|²/2π dk before the momentum density is normalized: one, by Parseval's theorem, if ψ is. */
	parseval: number;
	/** ∫|ψ|² dx of the unnormalized ψ on the grid, to check against normOf. */
	norm: number;
	meanX: number;
	meanP: number;
	sigmaX: number;
	sigmaP: number;
	/** σ_xσ_p/(ħ/2). */
	ratio: number;
}

/** The grid, the transform and the spreads of a state. */
export function transform(s: Settings, n = N): Transform {
	const L = spanOf(s);
	const dx = L / n;
	const dk = (2 * Math.PI) / L;
	const x = new Float64Array(n);
	const re = new Float64Array(n);
	const im = new Float64Array(n);
	let norm = 0;
	for (let j = 0; j < n; j++) {
		x[j] = (j - n / 2) * dx;
		const z = psiAt(x[j], s);
		re[j] = z.re;
		im[j] = z.im;
		norm += (z.re * z.re + z.im * z.im) * dx;
	}
	const scale = 1 / Math.sqrt(norm);
	const density = new Float64Array(n);
	for (let j = 0; j < n; j++) {
		re[j] *= scale;
		im[j] *= scale;
		density[j] = re[j] * re[j] + im[j] * im[j];
	}
	const where = moments(x, density, dx);

	// ψ̃(k_m) = Σ_j ψ(x_j) e^{−ik_m x_j} dx; with x_j = (j − n/2)dx the shift of the origin only turns the phase
	fft(re, im, -1);
	const k = new Float64Array(n);
	const momentum = new Float64Array(n);
	let parseval = 0;
	for (let i = 0; i < n; i++) {
		const m = (i + n / 2) % n;
		k[i] = (i - n / 2) * dk;
		momentum[i] = ((re[m] * re[m] + im[m] * im[m]) * dx * dx) / (2 * Math.PI);
		parseval += momentum[i] * dk;
	}
	for (let i = 0; i < n; i++) momentum[i] /= parseval;
	const how = moments(k, momentum, dk);

	return {
		L,
		dx,
		dk,
		x,
		density,
		k,
		momentum,
		parseval,
		norm,
		meanX: where.mean,
		meanP: how.mean,
		sigmaX: where.sd,
		sigmaP: how.sd,
		ratio: 2 * where.sd * how.sd
	};
}

// --- the curves ------------------------------------------------------------------------------------------------------

/** |ψ|² and Re ψ, normalized, at n + 1 points from −X_SPAN to X_SPAN, from the formula. */
export function positionCurve(s: Settings, n = 1200) {
	const scale = 1 / Math.sqrt(normOf(s));
	return Array.from({ length: n + 1 }, (_, i) => {
		const x = -X_SPAN + (2 * X_SPAN * i) / n;
		const z = psiAt(x, s);
		return { x, rho: (z.re * z.re + z.im * z.im) * scale * scale, re: z.re * scale };
	});
}

/** The momentum density at the grid's momenta from −P_SPAN to P_SPAN, with one point beyond each end. */
export function momentumCurve(t: Transform) {
	const out: { p: number; rho: number }[] = [];
	for (let i = 0; i < t.k.length; i++) {
		const inside = Math.abs(t.k[i]) <= P_SPAN;
		const next =
			(i + 1 < t.k.length && Math.abs(t.k[i + 1]) <= P_SPAN) ||
			(i > 0 && Math.abs(t.k[i - 1]) <= P_SPAN);
		if (inside || next) out.push({ p: t.k[i], rho: t.momentum[i] });
	}
	return out;
}

/** The highest value of a curve within its plot. */
export const peakOf = (values: number[]) => values.reduce((m, v) => Math.max(m, v), 0);

/** What the readouts show: the engine's spreads and the chapter's closed forms where there is one. */
export function reading(s: Settings) {
	const t = transform(s);
	const unchirpedPair = s.split && s.a === 0;
	return {
		t,
		sigmaX: t.sigmaX,
		sigmaP: t.sigmaP,
		ratio: t.ratio,
		/** One packet of the slider's width and chirp, alone. */
		alone: { sigmaX: s.sigma, sigmaP: sigmaPOne(s.sigma, s.a) },
		closed: s.split
			? unchirpedPair
				? { sigmaX: Math.sqrt(varXTwo(s.sigma, s.d)), sigmaP: Math.sqrt(varPTwo(s.sigma, s.d)) }
				: undefined
			: { sigmaX: s.sigma, sigmaP: sigmaPOne(s.sigma, s.a) }
	};
}

// --- the predictions --------------------------------------------------------------------------------------------

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** Whether a state is one packet without a chirp, chapter 8.1's Gaussian. */
const plain = (s: Settings) => !s.split && s.a === 0;

/**
 * The first prediction is answered once the reader has narrowed one unchirped packet to half a width it had before,
 * also unchirped. `seen` holds the widths it has had so; the opening's is among them.
 */
export function noteFirst(done: boolean, seen: readonly number[], s: Settings) {
	if (!plain(s)) return { done, seen: [...seen] };
	const now = done || seen.some((w) => near(w / 2, s.sigma));
	return { done: now, seen: seen.some((w) => near(w, s.sigma)) ? [...seen] : [...seen, s.sigma] };
}

/** The second, once one packet has a chirp. */
export const noteSecond = (done: boolean, s: Settings) => done || (!s.split && s.a > 0);

/** The third, once the packet is split with d at least six times the width of each copy. */
export const MANY = 6;
export const noteThird = (done: boolean, s: Settings) =>
	done || (s.split && s.d >= MANY * s.sigma - 1e-9);

// --- the words ------------------------------------------------------------------------------------------------------

/** A number to the given decimals, with a true minus sign and no "−0.000". */
export function fixed(x: number, places = 3): string {
	const f = 10 ** places;
	const r = Math.round(x * f) / f;
	if (r === 0) return (0).toFixed(places);
	return (r < 0 ? '−' : '') + Math.abs(r).toFixed(places);
}

/** The same with a LaTeX minus. */
export const texFixed = (x: number, places = 3) => fixed(x, places).replace('−', '-');
