/**
 * Chapter 10.3's bound on every glow. A material's friction against a uniform shear, Re η(ω), is positive, and by
 * 4.5's sum rule (2/π)∫₀^∞ Re η dω = Δμ, the weight, the stiffness that relaxes. By Kirchhoff's law with 7.8's
 * α = 16πG Re η/c³ and 10.1's B_ω, its glow per volume is
 *
 *   P/V = 4π∫αB_ω dω = (16Għ/πc⁵)∫Re η ω³n̄ dω,   Ṅ/V = (16G/πc⁵)∫Re η ω²n̄ dω,   n̄ = 1/(e^x − 1), x = ħω/k_BT,
 *
 * and since ω³n̄ = (k_BT/ħ)³x³/(e^x − 1) is at most (k_BT/ħ)³·1.4214, and ω²n̄ at most (k_BT/ħ)²·0.6476,
 *
 *   P/V ≤ 8·1.4214 GΔμ(k_BT)³/ħ²c⁵ = 11.37 GΔμ(k_BT)³/ħ²c⁵,   Ṅ/V ≤ 8·0.6476 GΔμ(k_BT)²/ħ²c⁵ = 5.18 …,
 *
 * the paper's eq:glow-bound. The materials are the paper's tab:materials, exported from reference/gravcam/materials.py
 * into ./glow-bound-data.ts: copper's free electrons, iron's ceiling, silicon's and diamond's Raman lines, each
 * crystal's pairs of phonons, silica's flat band, water's simulated network and the flat placeholder; and a custom
 * line of the reader's. The spectra are the reference's at 293 K; only the pairs, and copper's collision time when
 * its rate is made to grow in proportion to T, change with temperature. The integrals are Gauss–Legendre quadrature
 * over pieces cut at every line, edge and corner of a spectrum.
 */
import { G } from '../../engine/physics/constants';
import { C, HBAR, KB, PEAK_X, numberTex, numberText } from './planck-spectrum';
import { MATERIALS, ROOM, type Channel, type MaterialId } from './glow-bound-data';

export { MATERIALS, PLACEHOLDER, REFERENCE, ROOM } from './glow-bound-data';
export type { Channel, MaterialId } from './glow-bound-data';

// --- the peaks and the bound ------------------------------------------------------------------------------------------

/** The largest values of x³/(e^x − 1) and x²/(e^x − 1): 1.4214 at x = 2.821 and 0.6476 at x = 1.594. */
export const PEAK_POWER = PEAK_X.frequency ** 3 / Math.expm1(PEAK_X.frequency);
export const PEAK_COUNT = PEAK_X.count ** 2 / Math.expm1(PEAK_X.count);
/** eq:glow-bound's constants, 8 × those: 11.37 and 5.18. */
export const POWER_CONSTANT = 8 * PEAK_POWER;
export const COUNT_CONSTANT = 8 * PEAK_COUNT;

/** The most power per volume a weight Δμ (Pa) can send at T, W m⁻³. */
export const powerBound = (weight: number, T: number) =>
	(POWER_CONSTANT * G * weight * (KB * T) ** 3) / (HBAR ** 2 * C ** 5);

/** The most gravitons per second and per volume, in all directions, s⁻¹ m⁻³. */
export const countBound = (weight: number, T: number) =>
	(COUNT_CONSTANT * G * weight * (KB * T) ** 2) / (HBAR ** 2 * C ** 5);

/** 16Għ/πc⁵: P/V per unit of ∫Re η ω³n̄ dω. */
const GLOW = (16 * G * HBAR) / (Math.PI * C ** 5);

/** The glow per unit of angular frequency, 4παB_ω = (16Għ/πc⁵)Re η ω³n̄, W m⁻³ s, for a friction η in Pa s. */
export const glowDensity = (eta: number, omega: number, T: number) =>
	omega <= 0 ? 0 : GLOW * eta * omega ** 3 * occupationOf((HBAR * omega) / (KB * T));

const occupationOf = (x: number) => (x > 700 ? 0 : 1 / Math.expm1(x));

/** The shape drawn faintly behind the friction, x³/(e^x − 1). */
export const planckShape = (x: number) => (x <= 0 ? 0 : x > 700 ? 0 : x ** 3 / Math.expm1(x));

// --- the channels ---------------------------------------------------------------------------------------------------

/** Re η of one channel at ω (s⁻¹) and T (K), Pa s. */
export function friction(ch: Channel, omega: number, T: number): number {
	switch (ch.kind) {
		case 'drude':
			return (ch.weight * ch.tau) / (1 + (omega * ch.tau) ** 2);
		case 'ceiling':
			return ch.weight / (2 * omega);
		case 'line':
			return (
				(ch.weight * ch.omega0 ** 2 * ch.width) /
				((ch.omega0 ** 2 - omega ** 2) ** 2 + (ch.width * omega) ** 2)
			);
		case 'band':
			return omega < ch.omegaMax ? (0.5 * Math.PI * ch.weight) / ch.omegaMax : 0;
		case 'maxwell':
			return ch.eta0 / (1 + (omega * ch.tau) ** 2);
		case 'inertia':
			return (
				ch.eta0 / ((1 - (omega * ch.tau0) ** 2) ** 2 + ((omega * ch.tau0 ** 2) / ch.tauM) ** 2)
			);
		case 'flat':
			return ch.eta;
		case 'pairs': {
			if (omega >= 2 * ch.omegaD) return 0;
			const y = (HBAR * omega) / (4 * KB * T);
			const coth = 1 / Math.tanh(Math.max(y, 1e-300));
			return (((9 * Math.PI) / 64) * (2 / 3) * ch.n * HBAR * omega ** 3 * coth) / ch.omegaD ** 3;
		}
	}
}

/** The sum of the channels' frictions. */
export const frictionOf = (chs: readonly Channel[], omega: number, T: number) =>
	chs.reduce((s, ch) => s + friction(ch, omega, T), 0);

/**
 * The weight of a channel, (2/π)∫₀^∞ Re η dω, Pa: the stated weight of the electrons, a line and the band; η₀/τ of a
 * Maxwell element and η₀τ_m/τ₀² of a shear-inertia one (Schulz et al.); the pairs' by quadrature, 2nk_BT when
 * classical. The ceiling's is the electrons' weight it is the ceiling of (its own integral diverges), and the flat
 * placeholder has none: Infinity.
 */
export function channelWeight(ch: Channel, T: number): number {
	switch (ch.kind) {
		case 'drude':
		case 'ceiling':
		case 'line':
		case 'band':
			return ch.weight;
		case 'maxwell':
			return ch.eta0 / ch.tau;
		case 'inertia':
			return (ch.eta0 * ch.tauM) / ch.tau0 ** 2;
		case 'flat':
			return Infinity;
		case 'pairs':
			return (2 / Math.PI) * integrate((w) => friction(ch, w, T), cuts([ch], 0, 2 * ch.omegaD));
	}
}

/** Where a channel's spectrum turns or jumps: the places the quadrature cuts at. */
function features(ch: Channel): number[] {
	switch (ch.kind) {
		case 'drude':
			return [0.3, 1, 3, 10].map((k) => k / ch.tau);
		case 'line':
		case 'inertia': {
			const w0 = ch.kind === 'line' ? ch.omega0 : 1 / ch.tau0;
			const g = ch.kind === 'line' ? ch.width : ch.tauM / ch.tau0 ** 2;
			const out = [w0];
			for (const k of [0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128]) out.push(w0 - k * g, w0 + k * g);
			return out;
		}
		case 'band':
			return [ch.omegaMax];
		case 'maxwell':
			return [0.3, 1, 3, 10].map((k) => k / ch.tau);
		case 'pairs':
			return [2 * ch.omegaD];
		default:
			return [];
	}
}

/** The pieces from a to b, cut at every feature of the channels and into at least `pieces` equal parts. */
export function cuts(chs: readonly Channel[], a: number, b: number, pieces = 24): number[] {
	const set = new Set<number>();
	for (let i = 0; i <= pieces; i++) set.add(a + ((b - a) * i) / pieces);
	for (const ch of chs) for (const w of features(ch)) if (w > a && w < b) set.add(w);
	return [...set].sort((p, q) => p - q);
}

// --- Gauss–Legendre quadrature ------------------------------------------------------------------------------------------

/** The nodes and weights of n-point Gauss–Legendre quadrature on [−1, 1], by Newton's method on P_n. */
function gaussLegendre(n: number): { x: number[]; w: number[] } {
	const x: number[] = [];
	const w: number[] = [];
	for (let i = 1; i <= n; i++) {
		let z = Math.cos((Math.PI * (i - 0.25)) / (n + 0.5));
		let dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1;
			let p1 = z;
			for (let k = 2; k <= n; k++) {
				const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
				p0 = p1;
				p1 = p2;
			}
			dp = (n * (z * p1 - p0)) / (z * z - 1);
			const dz = p1 / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-15) break;
		}
		x.push(z);
		w.push(2 / ((1 - z * z) * dp * dp));
	}
	return { x, w };
}

const GL = gaussLegendre(20);

/** ∫f over the pieces between consecutive cuts. */
export function integrate(f: (w: number) => number, at: readonly number[]): number {
	let total = 0;
	for (let i = 0; i + 1 < at.length; i++) {
		const a = at[i];
		const b = at[i + 1];
		const h = (b - a) / 2;
		const m = (a + b) / 2;
		let s = 0;
		for (let k = 0; k < GL.x.length; k++) s += GL.w[k] * f(m + h * GL.x[k]);
		total += s * h;
	}
	return total;
}

// --- a material and its glow -------------------------------------------------------------------------------------------

/** The reader's own line: its weight in Pa, centre f₀ = ω₀/2π and width Γ/2π in Hz. */
export type Custom = { weight: number; f0: number; width: number };

export type Choice = MaterialId | 'custom';
export const CHOICES: readonly Choice[] = [
	'copper',
	'iron',
	'silicon',
	'diamond',
	'silica',
	'water',
	'placeholder',
	'custom'
];

/** The crystals, which have pairs of phonons; the metal whose collision rate can follow T. */
export const hasPairs = (c: Choice) => c !== 'custom' && MATERIALS[c].pairs !== undefined;
export const canFollow = (c: Choice) => c === 'copper';

export type Options = { pairs: boolean; follow: boolean };

/** A collision time of 293 K, or one whose rate grows in proportion to T. */
export const tauAt = (tau: number, T: number, follow: boolean) => (follow ? (tau * ROOM) / T : tau);

export type Built = {
	/** The main channels and, apart, the pairs if counted. */
	main: Channel[];
	pairs?: Channel;
	all: Channel[];
};

export function build(c: Choice, custom: Custom, T: number, o: Options): Built {
	let main: Channel[];
	let pairs: Channel | undefined;
	if (c === 'custom') {
		main = [
			{
				kind: 'line',
				weight: custom.weight,
				omega0: 2 * Math.PI * custom.f0,
				width: 2 * Math.PI * custom.width
			}
		];
	} else {
		const m = MATERIALS[c];
		main = m.channels.map((ch) =>
			ch.kind === 'drude' && o.follow ? { ...ch, tau: tauAt(ch.tau, T, true) } : ch
		);
		pairs = o.pairs ? m.pairs : undefined;
	}
	return { main, pairs, all: pairs ? [...main, pairs] : main };
}

export type Glow = {
	/** Δμ, Pa (Infinity for the placeholder), and the pairs' share of it. */
	weight: number;
	pairsWeight: number;
	/** P/V, W m⁻³; Ṅ/V in all directions, s⁻¹ m⁻³; the number emissivity per steradian, Ṅ/4πV. */
	power: number;
	count: number;
	number: number;
	/** The constant friction with the same power, Pa s. */
	etaEff: number;
	/** The mean energy of a graviton over k_BT. */
	meanKT: number;
	/** The shares of eq:glow-bound's two bounds (NaN without a finite weight). */
	powerShare: number;
	countShare: number;
};

/** ∫ω³n̄ dω = (k_BT/ħ)⁴π⁴/15: the placeholder's power per unit of its friction, before 16Għ/πc⁵. */
const flatPower = (T: number) => ((KB * T) / HBAR) ** 4 * (Math.PI ** 4 / 15);

/** The top of the glow's integrals, x = 60, beyond which e^{−x} leaves nothing. */
const topOf = (T: number) => (60 * KB * T) / HBAR;

export function glow(chs: readonly Channel[], T: number): Glow {
	const at = cuts(chs, 0, topOf(T), 48);
	const eta = (w: number) => frictionOf(chs, w, T);
	const occ = (w: number) => occupationOf((HBAR * w) / (KB * T));
	const p = integrate((w) => eta(w) * w ** 3 * occ(w), at);
	const n = integrate((w) => eta(w) * w ** 2 * occ(w), at);
	const weight = chs.reduce((s, ch) => s + channelWeight(ch, T), 0);
	const pairsWeight = chs
		.filter((ch) => ch.kind === 'pairs')
		.reduce((s, ch) => s + channelWeight(ch, T), 0);
	const power = GLOW * p;
	const count = (GLOW / HBAR) * n;
	const finite = Number.isFinite(weight);
	return {
		weight,
		pairsWeight,
		power,
		count,
		number: count / (4 * Math.PI),
		etaEff: p / flatPower(T),
		meanKT: (HBAR * p) / (n * KB * T),
		powerShare: finite ? power / powerBound(weight, T) : NaN,
		countShare: finite ? count / countBound(weight, T) : NaN
	};
}

/** (2/π)∫₀^ω Re η dω over the weight: the share of the area the plot holds, up to its edge ω. */
export function shownShare(chs: readonly Channel[], omega: number, T: number): number {
	const weight = chs.reduce((s, ch) => s + channelWeight(ch, T), 0);
	if (!Number.isFinite(weight)) return NaN;
	const area = integrate((w) => frictionOf(chs, w, T), cuts(chs, 0, omega, 48));
	return Math.min(1, ((2 / Math.PI) * area) / weight);
}

// --- the custom line ---------------------------------------------------------------------------------------------------

export const THZ = 1e12;
export const GPA = 1e9;

/** Its ranges: weight 1 to 100 GPa, centre 0.2 to 1000 THz, Q = f₀/(Γ/2π) from 1 to 1000. */
export const CUSTOM_RANGE = {
	weight: { low: 1 * GPA, high: 100 * GPA, step: 1 * GPA },
	f0: { low: 0.2 * THZ, high: 1000 * THZ },
	Q: { low: 1, high: 1000 },
	/** Shift + an arrow widens or narrows by 10^0.1. */
	widthStep: 10 ** 0.1
};

export const OPENING_CUSTOM: Custom = { weight: 18 * GPA, f0: 30 * THZ, width: 1.5 * THZ };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Its quality factor, f₀ over the width. */
export const qualityOf = (c: Custom) => c.f0 / c.width;

/** Keep the width within Q = 1 to 1000 of the centre. */
const fitWidth = (f0: number, width: number) =>
	clamp(width, f0 / CUSTOM_RANGE.Q.high, f0 / CUSTOM_RANGE.Q.low);

/** Move the centre, keeping the width where the range allows, and the centre within [lo, hi]. */
export function moveCentre(c: Custom, f0: number, hi = CUSTOM_RANGE.f0.high): Custom {
	const to = clamp(f0, CUSTOM_RANGE.f0.low, Math.min(hi, CUSTOM_RANGE.f0.high));
	return { ...c, f0: to, width: fitWidth(to, c.width) };
}

export const setWidth = (c: Custom, width: number): Custom => ({
	...c,
	width: fitWidth(c.f0, width)
});

/** Widen (+1) or narrow (−1) by a step. */
export const stepWidth = (c: Custom, dir: number) =>
	setWidth(c, c.width * CUSTOM_RANGE.widthStep ** dir);

export const setWeight = (c: Custom, weight: number): Custom => ({
	...c,
	weight: clamp(weight, CUSTOM_RANGE.weight.low, CUSTOM_RANGE.weight.high)
});

/** One more or one less gigapascal, on the whole gigapascals. */
export const stepWeight = (c: Custom, dir: number) =>
	setWeight(c, (Math.round(c.weight / GPA) + dir) * GPA);

/** The height of the line at its centre, Δμ/Γ, Pa s; and the weight that gives a height at its width. */
export const lineHeight = (c: Custom) => c.weight / (2 * Math.PI * c.width);
export const weightForHeight = (c: Custom, height: number) => height * 2 * Math.PI * c.width;

// --- the temperature --------------------------------------------------------------------------------------------------

/** log₁₀ T from 100 K to 6000 K: the arrows step a two-hundredth of a power of ten, the page keys a twentieth. */
export const TEMPERATURE = {
	low: 2,
	high: Math.log10(6000),
	step: 0.005,
	page: 0.05
};
export const T_MIN = 100;
export const T_MAX = 6000;

/** The temperatures worth going to: the table's, the closed furnace's hot iron and the inner core. */
export const T_PRESETS = [
	{ T: 293, label: 'Room', words: 'room temperature' },
	{ T: 1500, label: 'Hot iron', words: 'the closed furnace’s hot iron' },
	{ T: 5500, label: 'Inner core', words: 'the inner core' }
] as const;

export const OPENING = { choice: 'silicon' as Choice, T: ROOM, pairs: true, follow: false };

// --- the axes ---------------------------------------------------------------------------------------------------------

/** The frequency axis's ends, THz: the smallest that reaches x = 7 at T. */
export const F_STEPS = [10, 20, 50, 100, 200, 500, 1000];
export function fAxisFor(T: number): number {
	const need = (7 * KB * T) / (2 * Math.PI * HBAR) / THZ;
	return F_STEPS.find((s) => s >= need) ?? F_STEPS[F_STEPS.length - 1];
}

/** Ticks of f along the bottom, THz: five or so, at 1, 2 or 5 times a power of ten. */
export function fTicks(top: number, most = 6): number[] {
	const step = niceStep(top / most);
	const out: number[] = [];
	for (let v = 0; v <= top + 1e-9; v += step) out.push(Number(v.toFixed(6)));
	return out;
}

/** The step of x along the top: 1, 2 or 5, so that at most `most` ticks fit. */
export function xStep(xTop: number, most = 10): number {
	return [1, 2, 5, 10, 20].find((s) => xTop / s <= most) ?? 50;
}

/** The smallest of 1, 2, 2.5 or 5 times a power of ten at or above v. */
export function niceStep(v: number): number {
	const e = Math.floor(Math.log10(v));
	const m = v / 10 ** e;
	const k = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10;
	return k * 10 ** e;
}

/** A vertical axis that holds v with a little room: its top, its step, and the power of ten its labels count. */
export function axisFor(v: number, steps = 4): { top: number; step: number; unit: number } {
	const safe = v > 0 && Number.isFinite(v) ? v * 1.08 : 1;
	const step = niceStep(safe / steps);
	const top = Math.ceil(safe / step - 1e-9) * step;
	const unit = 10 ** Math.floor(Math.log10(top));
	return { top, step, unit };
}

/**
 * The angular frequencies to draw at, from 0 to ω_top: n evenly, and more about every line so that a narrow one is
 * drawn at its true height.
 */
export function samples(chs: readonly Channel[], wTop: number, n = 480): number[] {
	const set = new Set<number>();
	for (let i = 0; i <= n; i++) set.add((wTop * i) / n);
	for (const ch of chs) {
		if (ch.kind === 'line' || ch.kind === 'inertia') {
			const w0 = ch.kind === 'line' ? ch.omega0 : 1 / ch.tau0;
			const g = ch.kind === 'line' ? ch.width : ch.tauM / ch.tau0 ** 2;
			for (let k = -40; k <= 40; k++) {
				const w = w0 + (g * k * Math.abs(k)) / 80;
				if (w > 0 && w < wTop) set.add(w);
			}
		}
		if (ch.kind === 'band' || ch.kind === 'pairs') {
			const edge = ch.kind === 'band' ? ch.omegaMax : 2 * ch.omegaD;
			if (edge < wTop) for (const d of [-1e-6, 1e-6]) set.add(edge * (1 + d));
		}
	}
	return [...set].sort((a, b) => a - b);
}

// --- words and numbers ---------------------------------------------------------------------------------------------------

export { numberTex, numberText };

/** A share as a percentage to three figures, or to one place above 10%: "98.2", "5.60", "100". */
export function percent(s: number): string {
	const p = 100 * s;
	if (p >= 99.95) return p.toFixed(1);
	if (p >= 10) return p.toFixed(1);
	return p.toPrecision(3);
}

/** A temperature: "293 K", "1500 K". */
export const temperatureText = (T: number) => `${Math.round(T)} K`;
