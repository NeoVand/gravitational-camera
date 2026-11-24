/**
 * Chapter 13.2's two readings as one transform, made live. A flat camera's harmonic functions h_k = e^{ik·a − |k|z}
 * multiply in pairs into e^{iK·a − κz}, with K = k + k′ and κ = |k| + |k′|, so (the paper's eq:cone)
 *
 *     first reading:   Q(k) = ρ̃(k, |k|),           on the cone κ = K,
 *     second reading:  ½(κ² − K²) ρ̃(K, κ),          inside it, κ > K,
 *
 * with ρ̃(K, κ) = ∫ρ e^{iK·a − κz} d²a dz the scene transform and ½(κ² − K²) = |k||k′| − k·k′. Every pair with k on
 * the ellipse |k| + |K − k| = κ, foci 0 and K, semi-axes κ/2 and ½√(κ² − K²), reaches the same point.
 *
 * Two scenes, both centred under the camera's origin, so that ρ̃ is real and depends on K only through K = |K|:
 *
 *   - a point mass m = 100 kg at depth z₀:  ρ̃ = m e^{−κz₀};
 *   - a null-space density ∇²ψ/4πG, with ψ = ψ₀(1 − r²/a²)³ inside a ball of radius a = 0.5 m centred 1 m deep:
 *     ρ̃ = (κ² − K²) ψ̃/4πG. The exponent of e^{iK·a − κz} is the complex vector q = (iK, −κ), with q·q = κ² − K² = s²,
 *     and for a round ψ the integral depends on q·q alone, so ψ̃ = e^{−κ z_c} 4π ∫₀^a ψ(r) r² sinh(sr)/(sr) dr,
 *     computed by Gauss–Legendre quadrature (24 nodes; the integrand is smooth and the rule exact to rounding here).
 *
 * The heat map is the size of the second reading over the half-plane (K, κ), shaded only where it stands above a
 * floor: the largest value over the panel divided by the signal-to-noise ratio. Units: wavevectors and κ in m⁻¹,
 * lengths in m, ρ̃ in kg, the second reading in kg m⁻².
 */
import { gaussLegendre } from '../../engine/memory';

export const G = 6.6743e-11;

// --- the ranges -----------------------------------------------------------------------------------------------------

/** The plane of wavevectors: k_x and k_y from −3 to 3 m⁻¹. */
export const PLANE = 3;
/** The half-plane (K, κ): each from 0 to 6 m⁻¹. */
export const HALF = 6;
/** The arrows' keys: 0.05 m⁻¹ a press, 0.25 with Shift. */
export const KEY_STEP = 0.05;
export const KEY_SHIFT = 0.25;
/** A dragged tip within this distance of the line along the other arrow, on its side, lands on that line. */
export const SNAP = 0.04;

export interface Vec {
	x: number;
	y: number;
}

export const OPENING = { k: { x: 1.3, y: 0.4 }, kp: { x: -0.2, y: 0.9 } };

/** The point mass: 100 kg, at a depth from 0.5 to 3 m. */
export const POINT = { m: 100, depth: { min: 0.5, max: 3, step: 0.05, opening: 1 } };

/** The null-space bump: ψ₀ in J kg⁻¹, its radius a and the depth of its centre in m. */
export const BUMP = { psi0: 1e-7, a: 0.5, depth: 1 };

/** The signal-to-noise ratio, on a log scale: 10 to 10⁶, opening at 10³. */
export const SNR = { low: 1, high: 6, step: 0.05, opening: 3 };

export type Scene = 'point' | 'null';

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A tip kept on the plane, on a grid of 10⁻⁶ m⁻¹ so that steps of 0.05 do not drift. */
export const kept = (v: Vec): Vec => ({
	x: Math.round(clamp(v.x, -PLANE, PLANE) * 1e6) / 1e6,
	y: Math.round(clamp(v.y, -PLANE, PLANE) * 1e6) / 1e6
});

// --- the pair -------------------------------------------------------------------------------------------------------

export interface Pair {
	/** K = k + k′ */
	sum: Vec;
	/** K = |k + k′| */
	K: number;
	/** κ = |k| + |k′| */
	kappa: number;
	/** ½(κ² − K²) = |k||k′| − k·k′, in m⁻² */
	factor: number;
	/** the ellipse's semi-axes, κ/2 and ½√(κ² − K²) */
	major: number;
	minor: number;
}

/**
 * The point of the transform that the pair (k, k′) reads. The factor is computed as (k × k′)²/(|k||k′| + k·k′) when
 * the two point within a right angle of each other, which is |k||k′| − k·k′ without the loss of figures near the cone,
 * and is exactly zero when they are parallel.
 */
export function pair(k: Vec, kp: Vec): Pair {
	const a = Math.hypot(k.x, k.y);
	const b = Math.hypot(kp.x, kp.y);
	const dot = k.x * kp.x + k.y * kp.y;
	const cross = k.x * kp.y - k.y * kp.x;
	const ab = a * b;
	let factor: number;
	if (Math.abs(cross) <= 1e-9 * ab && dot >= 0) factor = 0;
	else if (dot > 0) factor = (cross * cross) / (ab + dot);
	else factor = ab - dot;
	const sum = { x: k.x + kp.x, y: k.y + kp.y };
	const kappa = a + b;
	// on the cone K is κ exactly: the two are parallel and the lengths add
	const K = factor === 0 ? kappa : Math.hypot(sum.x, sum.y);
	return { sum, K, kappa, factor, major: kappa / 2, minor: Math.sqrt(2 * factor) / 2 };
}

/**
 * The ellipse |k| + |K − k| = κ as a closed polygon of n points: centre K/2, the long axis along K. When K = 0 it is
 * the circle of radius κ/2 about the origin.
 */
export function ellipse(p: Pair, n = 120): Vec[] {
	const c = { x: p.sum.x / 2, y: p.sum.y / 2 };
	const length = Math.hypot(p.sum.x, p.sum.y);
	const u = length > 1e-12 ? { x: p.sum.x / length, y: p.sum.y / length } : { x: 1, y: 0 };
	const points: Vec[] = [];
	for (let i = 0; i < n; i++) {
		const t = (2 * Math.PI * i) / n;
		const [A, B] = [p.major * Math.cos(t), p.minor * Math.sin(t)];
		points.push({ x: c.x + A * u.x - B * u.y, y: c.y + A * u.y + B * u.x });
	}
	return points;
}

/**
 * A dragged tip near the ray along the other arrow lands on it: within SNAP of the ray, on its side of the origin,
 * the tip is carried onto it. The keys never snap, so that they can always step away.
 */
export function snapped(tip: Vec, other: Vec): Vec {
	const length = Math.hypot(other.x, other.y);
	if (length < 1e-9) return tip;
	const u = { x: other.x / length, y: other.y / length };
	const along = tip.x * u.x + tip.y * u.y;
	const across = tip.x * -u.y + tip.y * u.x;
	if (along <= 0 || Math.abs(across) > SNAP) return tip;
	return { x: along * u.x, y: along * u.y };
}

// --- the scenes' transforms -----------------------------------------------------------------------------------------

/** ρ̃(K, κ) of the point mass at depth z₀ below the origin, in kg. */
export const pointTransform = (kappa: number, z0: number) => POINT.m * Math.exp(-kappa * z0);

const RULE = gaussLegendre(24);

/** sinh(x)/x, with its series near zero. */
const sinhc = (x: number) => (Math.abs(x) < 1e-4 ? 1 + (x * x) / 6 : Math.sinh(x) / x);

/**
 * ∫₀^a (1 − r²/a²)³ r² sinh(sr)/(sr) dr, in m³, by Gauss–Legendre quadrature on [0, a]. For s = 0 it is 16a³/315.
 */
export function bumpIntegral(s: number, a = BUMP.a): number {
	let sum = 0;
	for (let i = 0; i < RULE.x.length; i++) {
		const r = (a * (RULE.x[i] + 1)) / 2;
		const u = 1 - (r * r) / (a * a);
		sum += RULE.w[i] * u * u * u * r * r * sinhc(s * r);
	}
	return (sum * a) / 2;
}

/** ψ̃(K, κ) of the bump, in J kg⁻¹ m³, for κ ≥ K. */
export function bumpTransform(K: number, kappa: number): number {
	const s = Math.sqrt(Math.max(0, kappa * kappa - K * K));
	return Math.exp(-kappa * BUMP.depth) * 4 * Math.PI * BUMP.psi0 * bumpIntegral(s);
}

/** ρ̃(K, κ) of the null-space density ∇²ψ/4πG, in kg: (κ² − K²) ψ̃/4πG, zero on the cone whatever ψ is. */
export const nullTransform = (K: number, kappa: number) =>
	((kappa * kappa - K * K) * bumpTransform(K, kappa)) / (4 * Math.PI * G);

/** ρ̃(K, κ) of the chosen scene, in kg. */
export const transform = (scene: Scene, K: number, kappa: number, z0: number) =>
	scene === 'point' ? pointTransform(kappa, z0) : nullTransform(K, kappa);

/**
 * The size of the second reading at (K, κ), ½(κ² − K²)|ρ̃(K, κ)|, in kg m⁻²; zero on the cone and below it, where no
 * pair of tides reaches.
 */
export function second(scene: Scene, K: number, kappa: number, z0: number): number {
	if (kappa <= K) return 0;
	return 0.5 * (kappa * kappa - K * K) * Math.abs(transform(scene, K, kappa, z0));
}

// --- the map over the half-plane ------------------------------------------------------------------------------------

/** The map's cells: CELLS across and up, values taken at their centres. */
export const CELLS = 150;
const CELL = HALF / CELLS;

/**
 * The largest second reading over the panel. For either scene it falls with K at fixed κ (the factor falls, and the
 * bump's ψ̃ grows with s), so it lies on K = 0: a fine scan of κ, then golden-section search about the best.
 */
export function largest(scene: Scene, z0: number): number {
	const f = (kappa: number) => second(scene, 0, kappa, z0);
	const n = 600;
	let best = 0;
	for (let i = 1; i <= n; i++) if (f((HALF * i) / n) > f((HALF * best) / n)) best = i;
	let lo = (HALF * Math.max(0, best - 1)) / n;
	let hi = (HALF * Math.min(n, best + 1)) / n;
	const g = (Math.sqrt(5) - 1) / 2;
	for (let it = 0; it < 80; it++) {
		const a = hi - g * (hi - lo);
		const b = lo + g * (hi - lo);
		if (f(a) < f(b)) lo = a;
		else hi = b;
	}
	return Math.max(f((lo + hi) / 2), f((HALF * best) / n));
}

/** The map, row by row from κ = 0 upward, K across: the second reading at each cell's centre (0 below the cone). */
export function map(scene: Scene, z0: number): Float64Array {
	const values = new Float64Array(CELLS * CELLS);
	for (let j = 0; j < CELLS; j++) {
		const kappa = (j + 0.5) * CELL;
		for (let i = 0; i < CELLS; i++)
			values[j * CELLS + i] = second(scene, (i + 0.5) * CELL, kappa, z0);
	}
	return values;
}

/** The null-space scene's map and its largest value do not depend on any setting: computed once, here. */
export const NULL_MAP = map('null', 0);
export const NULL_LARGEST = largest('null', 0);

/** The noise floor: the largest value over the panel divided by the signal-to-noise ratio. */
export const floorOf = (top: number, snr: number) => top / snr;

/**
 * A cell's shade, 0 to 1: 0 below the floor, and above it the reading's place between the floor and the top on a
 * log scale, raised from 0.14 so that the readable edge shows.
 */
export function shade(value: number, top: number, snr: number): number {
	if (!(value > 0) || value < top / snr) return 0;
	const t = 1 + Math.log10(Math.min(1, value / top)) / Math.log10(snr);
	return 0.14 + 0.86 * t;
}

/**
 * The outer readable edge of the point mass's map at the ripple K: the κ above the peak at which the second reading
 * falls to the floor, found by bisection (it may lie above the panel); NaN where no part of the ripple is readable.
 */
export function pointEdge(z0: number, K: number, snr: number): number {
	const floor = floorOf(largest('point', z0), snr);
	const f = (kappa: number) => second('point', K, kappa, z0) - floor;
	// the peak in κ at this K: d/dκ of ½(κ² − K²)e^{−κz₀} vanishes at κ = (1 + √(1 + K²z₀²))/z₀
	let lo = (1 + Math.sqrt(1 + K * K * z0 * z0)) / z0;
	if (f(lo) <= 0) return NaN;
	let hi = lo;
	while (f(hi) > 0) hi *= 2;
	for (let it = 0; it < 200; it++) {
		const mid = (lo + hi) / 2;
		if (f(mid) > 0) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

// --- the words ------------------------------------------------------------------------------------------------------

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
const superscript = (n: number) =>
	String(n)
		.split('')
		.map((c) => SUPER[c])
		.join('');

/** A number to `digits` significant figures, in a × 10ⁿ form outside 0.01 to 10⁴; zero is "0". */
export function sig(x: number, digits = 3): string {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	const plain = x.toPrecision(digits);
	if (e >= -2 && e < 4 && !plain.includes('e')) return plain.replace('-', '−');
	const mantissa = x / 10 ** e;
	const m = mantissa.toFixed(digits - 1);
	// rounding may carry the mantissa to 10
	if (Math.abs(parseFloat(m)) >= 10)
		return `${(mantissa / 10).toFixed(digits - 1)} × 10${superscript(e + 1)}`;
	return `${m} × 10${superscript(e)}`.replace('-', '−');
}

/** The same, in TeX. */
export function sigTex(x: number, digits = 3): string {
	return sig(x, digits)
		.replace('−', '-')
		.replace(/ × 10(\S+)/, (_, p: string) => {
			const n = p
				.split('')
				.map((c) => Object.keys(SUPER).find((k) => SUPER[k] === c))
				.join('');
			return `\\times 10^{${n}}`;
		});
}

/** The signal-to-noise ratio for a power of ten: "10³" on a whole power, "3.2 × 10³" between. */
export function snrText(logSnr: number): string {
	const whole = Math.round(logSnr);
	if (Math.abs(logSnr - whole) < 1e-9) return `10${superscript(whole)}`;
	return sig(10 ** logSnr, 2);
}

/** The readouts at the pair (k, k′). */
export function readouts(k: Vec, kp: Vec, scene: Scene, z0: number, snr: number) {
	const p = pair(k, kp);
	const reading = second(scene, p.K, p.kappa, z0);
	const top = scene === 'point' ? largest('point', z0) : NULL_LARGEST;
	const floor = floorOf(top, snr);
	return {
		...p,
		reading,
		floor,
		above: reading >= floor && reading > 0,
		text: {
			K: p.K.toFixed(2),
			kappa: p.kappa.toFixed(2),
			major: sig(p.major, 3),
			minor: sig(p.minor, 3),
			factor: sig(p.factor, 4),
			reading: sig(reading, 3),
			floor: sig(floor, 3)
		}
	};
}
