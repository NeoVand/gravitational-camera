/**
 * Chapter 4.6's tremor, the paper's fig:tremor: Appendix A's lattice ball of 924 equal masses and its shell of 668,
 * of the same total mass and radius, whose quadrupole h = x·U·x, U = diag(−½, −½, 1)/√1.5, trembles at the
 * temperature T with ⟨Q̇_h²⟩ = k_BT Σ c_n², each mode n holding k_BT c_n² at its frequency ω_n. The table of ω_n and
 * c_n² comes from ./tremor-data.ts, diagonalized offline for next-nearest springs at the ratio r = ¼, ½ (the
 * paper's) and 1 of the nearest.
 *
 * Here every spring is multiplied by the stiffness s, which scales every ω_n by √s and leaves every c_n², a property
 * of the mode shapes, unchanged. Each mode is given the same quality factor Q, so its damping rate is Γ_n = ω_n/Q,
 * and its line in the spectrum of Q̇_h is k_BT c_n² · 2Γ_nω²/[(ω_n² − ω²)² + Γ_n²ω²] (chapter 4.6's velocity form),
 * whose area over dω/π is k_BT c_n² whatever Γ_n.
 *
 * Units: a frequency is in units of the ball's strongest mode at s = 1, r = ½ (the paper's axis), a weight in units
 * of the ball's total Σc_n², and the static jitter Σc_n²/ω_n² in units of the ball's at s = 1, r = ½. The spectrum is
 * drawn per unit of that frequency, with the ball's total as unit, so that its area from 0 to any frequency is the
 * rise of the cumulative curve there.
 */
import { RATIOS, TABLE, type Ratio } from './tremor-data';

export { RATIOS, type Ratio };
export type Body = 'ball' | 'shell';
export const BODIES: readonly Body[] = ['ball', 'shell'];

/** One level: its frequency x and its weight w in the units above. */
export interface Level {
	readonly x: number;
	readonly w: number;
}

const heaviest = <T extends { w: number }>(ls: readonly T[]): T =>
	ls.reduce((a, b) => (b.w > a.w ? b : a));

/** The ball's strongest mode at s = 1, r = ½, in the table's units: the unit of frequency. */
export const REFERENCE = TABLE[0.5].ball.levels.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
/** The ball's Σ_p m_p|∇h|², which its weights add up to: the unit of weight. */
export const UNIT = TABLE[0.5].ball.inertia;

/** The levels of a body at the spring ratio r and stiffness s, in order of frequency. */
export function levels(body: Body, ratio: Ratio, s = 1): Level[] {
	const root = Math.sqrt(s);
	return TABLE[ratio][body].levels.map(([omega, c2]) => ({
		x: (root * omega) / REFERENCE,
		w: c2 / UNIT
	}));
}

/** The total Σc_n², ball's = 1. */
export const total = (ls: readonly Level[]) => ls.reduce((s, l) => s + l.w, 0);
/** Σc_n²/ω_n² in units of x⁻², before it is set against the ball's at s = 1, r = ½. */
const rawJitter = (ls: readonly Level[]) => ls.reduce((s, l) => s + l.w / (l.x * l.x), 0);
/** The ball's static jitter at s = 1, r = ½: the unit of the static jitter. */
export const JITTER_UNIT = rawJitter(levels('ball', 0.5));
/** The static jitter Σc_n²/ω_n², ball's at s = 1, r = ½ = 1. */
export const jitter = (ls: readonly Level[]) => rawJitter(ls) / JITTER_UNIT;

/** The level that holds the most of the tremor. */
export const strongest = (ls: readonly Level[]) => heaviest(ls);
/** The share of the tremor in the strongest level. */
export const share = (ls: readonly Level[]) => strongest(ls).w / total(ls);
/** The share of the tremor in the levels below the frequency x. */
export const below = (ls: readonly Level[], x: number) =>
	ls.reduce((s, l) => (l.x < x ? s + l.w : s), 0) / total(ls);

/** Σ_p m_p r_p², shell over ball: the ratio the totals stand in. */
export const SECOND_RATIO = TABLE[0.5].shell.second / TABLE[0.5].ball.second;

// --- the cumulative curves ------------------------------------------------------------------------------------------

export type Measure = 'rate' | 'jitter';

/** What a level adds to a cumulative curve: its weight, or its weight over its frequency squared. */
export const amount = (l: Level, m: Measure) =>
	m === 'rate' ? l.w : l.w / (l.x * l.x) / JITTER_UNIT;

/** The sum of the measure over every level. */
export const sum = (ls: readonly Level[], m: Measure) => ls.reduce((s, l) => s + amount(l, m), 0);

/**
 * The corners of the cumulative curve from 0 to `most`, a step up at each level, as the paper draws it: at the plot's
 * edge it holds the sum of the levels below it.
 */
export function steps(ls: readonly Level[], m: Measure, most: number): [number, number][] {
	const out: [number, number][] = [[0, 0]];
	let y = 0;
	for (const l of ls) {
		if (l.x >= most) break;
		out.push([l.x, y]);
		y += amount(l, m);
		out.push([l.x, y]);
	}
	out.push([most, y]);
	return out;
}

// --- the spectrum of the rate ---------------------------------------------------------------------------------------

/** Chapter 4.6's line of the rate of one mode: c² · 2Γω²/[(ω_n² − ω²)² + Γ²ω²], Γ = ω_n/Q, in any one unit. */
export function rateLine(omega: number, omegaN: number, Q: number, c2: number): number {
	const G = omegaN / Q;
	const a = omegaN * omegaN - omega * omega;
	const b = G * omega;
	return (c2 * 2 * G * omega * omega) / (a * a + b * b);
}

/** One level's line as plotted: per unit of x, ball's total = 1, so that its area over x is its weight. */
export const line = (x: number, l: Level, Q: number) => rateLine(x, l.x, Q, l.w) / Math.PI;

/** The whole spectrum, the sum of the lines. */
export const spectrum = (x: number, ls: readonly Level[], Q: number) =>
	ls.reduce((s, l) => s + line(x, l, Q), 0);

/** The height of a level's line at its peak, 2Qw/πx_n. */
export const peak = (l: Level, Q: number) => line(l.x, l, Q);

/** Adaptive Simpson's rule for a smooth g on [a, b], to the absolute tolerance given. */
function adaptive(g: (t: number) => number, a: number, b: number, tolerance: number): number {
	const simpson = (f0: number, fm: number, f1: number, h: number) => (h / 6) * (f0 + 4 * fm + f1);
	const step = (
		x0: number,
		x1: number,
		f0: number,
		fm: number,
		f1: number,
		whole: number,
		tol: number,
		depth: number
	): number => {
		const m = (x0 + x1) / 2;
		const l = g((x0 + m) / 2);
		const r = g((m + x1) / 2);
		const left = simpson(f0, l, fm, m - x0);
		const right = simpson(fm, r, f1, x1 - m);
		const diff = left + right - whole;
		if (depth <= 0 || Math.abs(diff) <= 15 * tol) return left + right + diff / 15;
		return (
			step(x0, m, f0, l, fm, left, tol / 2, depth - 1) +
			step(m, x1, fm, r, f1, right, tol / 2, depth - 1)
		);
	};
	const panels = 32;
	const h = (b - a) / panels;
	let out = 0;
	for (let i = 0; i < panels; i++) {
		const x0 = a + i * h;
		const x1 = x0 + h;
		const f0 = g(x0);
		const fm = g(x0 + h / 2);
		const f1 = g(x1);
		out += step(x0, x1, f0, fm, f1, simpson(f0, fm, f1, h), tolerance / panels, 40);
	}
	return out;
}

/**
 * The area under one line from 0 to `upTo` (∞ by default), by adaptive Simpson's rule after the change
 * x = x_n + (Γ/2) tan θ, as chapter 4.5's sum rule does: the line becomes nearly flat in θ however narrow it is, and
 * its 1/x² tail a finite value at θ = π/2. The quadrature counts the area; it does not assume it.
 */
export function lineArea(l: Level, Q: number, upTo = Infinity): number {
	const half = l.x / Q / 2;
	const a = Math.atan(-l.x / half);
	const open = !Number.isFinite(upTo);
	const b = open ? Math.PI / 2 : Math.atan((upTo - l.x) / half);
	if (b <= a) return 0;
	// far out the line is 2Γw/πx² and dx/dθ ≈ (Γ/2) tan²θ with x ≈ (Γ/2) tan θ: the product tends to 4w/π
	const atInfinity = (4 * l.w) / Math.PI;
	const g = (t: number) => {
		if (open && t >= Math.PI / 2) return atInfinity;
		const tan = Math.tan(t);
		return line(l.x + half * tan, l, Q) * half * (1 + tan * tan);
	};
	return adaptive(g, a, b, 1e-12 * Math.max(l.w, 1e-300));
}

/** The area under the whole spectrum from 0 to `upTo`, by quadrature, line by line. */
export const spectrumArea = (ls: readonly Level[], Q: number, upTo = Infinity) =>
	ls.reduce((s, l) => s + lineArea(l, Q, upTo), 0);

/** The frequencies at which the spectrum is drawn: evenly over the plot, closer near each line's peak. */
export function samples(ls: readonly Level[], Q: number, most: number): number[] {
	const out: number[] = [];
	for (let i = 0; i <= 480; i++) out.push((most * i) / 480);
	for (const l of ls) {
		if (l.x > most) break;
		const G = l.x / Q;
		for (let i = -24; i <= 24; i++) out.push(l.x + (i / 4) * G);
	}
	out.sort((a, b) => a - b);
	return out.filter((x, i) => x > 0 && x <= most && (i === 0 || x - out[i - 1] > 1e-9));
}

// --- the controls -----------------------------------------------------------------------------------------------------

/** The stiffness, on a slider in log₂ s from −2 to 2 (s from ¼ to 4); the quality factor in log₁₀ Q, 3 to 300. */
export const STIFFNESS = { low: -2, high: 2, step: 0.05, page: 0.5 };
export const QUALITY = { low: Math.log10(3), high: Math.log10(300), step: 0.02, page: 0.2 };
export const OPENING = { s: 1, ratio: 0.5 as Ratio, Q: 30, jitter: false };

/** The plot runs over x from 0 to 4, as the paper's; the spectrum's axis is logarithmic from 10⁻³ to 10³. */
export const PLOT_MOST = 4;
export const SPECTRUM_AXIS = { low: -3, high: 3 };

/** The cumulative plot's axis: the paper's 0 to 1.36 for the rate, fitted for the static jitter. */
export const RATE_AXIS = { top: 1.36, step: 0.2 };
export const JITTER_TOPS = [1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 60].map((top) => ({
	top,
	step: top <= 2 ? 0.5 : top <= 4 ? 1 : top <= 10 ? 2 : top <= 20 ? 5 : 10
}));

/** The axis for the static jitter: the first top that leaves the larger total an eighth of room. */
export function jitterAxis(most: number) {
	return JITTER_TOPS.find((t) => most <= t.top / 1.125) ?? JITTER_TOPS[JITTER_TOPS.length - 1];
}

/** The quality factor a slider value stands for, to three figures. */
export const qualityOf = (log: number) => Number((10 ** log).toPrecision(3));
/** The stiffness a slider value stands for. */
export const stiffnessOf = (log: number) => 2 ** log;

/** The first prediction is answered when the springs are four times as stiff as at their softest since it was asked. */
export const fourfold = (s: number, softest: number) => s >= 4 * softest * (1 - 1e-9);
/** The second when Q is at 3. */
export const LOW_Q = 3;
export const lowQ = (Q: number) => Q <= LOW_Q * (1 + 1e-9);
