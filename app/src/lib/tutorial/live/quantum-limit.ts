/**
 * Chapter 8.6's standard quantum limit, on an exact engine. Panel 1: a free mass read to σ₀ at the start spreads to
 * σ_x(τ)² = σ₀² + (ħτ/2mσ₀)² after the time τ; the least of it is σ_SQL = √(ħτ/m), at σ₀ = √(ħτ/2m); two masses a
 * distance ξ apart then resolve the tide 2σ_x(τ)/ξτ² on the paper's one-mass estimate, and √2 times that for the
 * distance of the two. Panel 2: an ideal interferometer of LIGO's size, mirrors of 40 kg and arms of 4 km, whose
 * one-sided quantum noise is S_h = S_shot + S_rp, S_shot = A/P and S_rp = BP/f⁴, with AB fixed so that the least of
 * S_h at each frequency is h_SQL² = 8ħ/mω²L², and the power in units of P₀, the power that touches h_SQL at 100 Hz.
 * Settings, curves, words and the predictions are pure functions too.
 */
import { stepped, type Range } from './near-to-far';
import { sci, sciTex, superscript } from './longest-path';

export { stepped, type Range };

// --- the constants ---------------------------------------------------------------------------------------------------

/** The reduced Planck constant, J s. */
export const HBAR = 1.0546e-34;
/** LIGO's mirrors, kg, and arms, m. */
export const MIRROR = 40;
export const ARM = 4000;
/** The frequency, Hz, at which the power P₀ touches the limit. */
export const F0 = 100;

// --- the settings ----------------------------------------------------------------------------------------------------

/** Panel 1, every setting as log₁₀: σ₀ over its optimum, the mass in kg, the time in s, the distance in m. */
export interface Masses {
	q: number;
	m: number;
	t: number;
	xi: number;
}

/** Panel 2, as log₁₀: the laser power over P₀ and the frequency of interest in Hz. */
export interface Light {
	p: number;
	f: number;
}

/** The figure opens at the optimum, for a gram read for a second, a centimetre apart. */
export const OPENING_MASSES: Masses = { q: 0, m: -3, t: 0, xi: -2 };
/** and on the power P₀, looked at 100 Hz. */
export const OPENING_LIGHT: Light = { p: 0, f: 2 };

/** σ₀ over the optimum, 0.03 to 30: a twentieth of a decade a press, a quarter with Shift. */
export const SHARP: Range = {
	min: Math.log10(0.03),
	max: Math.log10(30),
	step: 0.01,
	key: 0.05,
	large: 0.25
};
/** The mass, 1 mg to 10 kg: a tenth of a decade a press, half a decade with Shift. */
export const MASS: Range = { min: -6, max: 1, step: 0.01, key: 0.1, large: 0.5 };
/** The reading time, 1 ms to 100 s. */
export const TIME: Range = { min: -3, max: 2, step: 0.01, key: 0.1, large: 0.5 };
/** The distance of the masses, 1 mm to 1 m. */
export const SEPARATION: Range = { min: -3, max: 0, step: 0.01, key: 0.1, large: 0.5 };
/** The laser power over P₀, 0.01 to 100: a twentieth of a decade a press, a quarter with Shift. */
export const POWER: Range = { min: -2, max: 2, step: 0.01, key: 0.05, large: 0.25 };
/** The frequency of interest, 10 to 1000 Hz. */
export const FREQUENCY: Range = { min: 1, max: 3, step: 0.01, key: 0.05, large: 0.25 };

/** A log₁₀ held to its range and landed on its grid of hundredths, the two ends kept exact. */
export function snapLog(v: number, r: Range): number {
	if (!(v > r.min + r.step / 2)) return r.min;
	if (v >= r.max - r.step / 2) return r.max;
	return Math.round(Math.round(v / r.step) * r.step * 1e9) / 1e9 || 0;
}

// --- panel 1: the free masses ----------------------------------------------------------------------------------------

/** σ_SQL = √(ħτ/m), m. */
export const sqlWidth = (m: number, tau: number) => Math.sqrt((HBAR * tau) / m);
/** The best first reading, √(ħτ/2m), m. */
export const bestStart = (m: number, tau: number) => Math.sqrt((HBAR * tau) / (2 * m));
/** σ_x(τ) = √(σ₀² + (ħτ/2mσ₀)²), m. */
export const spreadAfter = (sigma0: number, m: number, tau: number) =>
	Math.hypot(sigma0, (HBAR * tau) / (2 * m * sigma0));

/** σ₀/σ_SQL for σ₀ a ratio r of its optimum: r/√2. */
export const startOverSql = (r: number) => r / Math.SQRT2;
/** σ_x(τ)/σ_SQL for σ₀ a ratio r of its optimum: √((r² + 1/r²)/2), the same for every mass and time. */
export const endOverSql = (r: number) => Math.sqrt((r * r + 1 / (r * r)) / 2);
/** σ_x(τ)/σ_SQL against x = σ₀/σ_SQL, the compromise curve: √(x² + 1/4x²). */
export const compromise = (x: number) => Math.hypot(x, 1 / (2 * x));

/** The smallest tide resolved on the paper's one-mass estimate, 2σ/ξτ², s⁻². */
export const tideOne = (sigma: number, xi: number, tau: number) => (2 * sigma) / (xi * tau * tau);
/** The same for the distance of two equal masses, whose spreads add in squares: √2 times more. */
export const tideTwo = (sigma: number, xi: number, tau: number) =>
	Math.SQRT2 * tideOne(sigma, xi, tau);

/** Everything panel 1 reads out. */
export function massesReading(s: Masses) {
	const r = 10 ** s.q;
	const m = 10 ** s.m;
	const tau = 10 ** s.t;
	const xi = 10 ** s.xi;
	const sql = sqlWidth(m, tau);
	const sigma0 = r * bestStart(m, tau);
	const sigmaX = spreadAfter(sigma0, m, tau);
	return {
		r,
		m,
		tau,
		xi,
		sql,
		best: bestStart(m, tau),
		sigma0,
		sigmaX,
		start: sigma0 / sql,
		end: sigmaX / sql,
		one: tideOne(sigmaX, xi, tau),
		two: tideTwo(sigmaX, xi, tau)
	};
}

/** Points log-spaced from a to b, inclusive. */
export function logSpaced(a: number, b: number, n: number): number[] {
	const la = Math.log10(a);
	const lb = Math.log10(b);
	return Array.from({ length: n }, (_, i) => 10 ** (la + ((lb - la) * i) / (n - 1)));
}

/** The inset's axes: across σ₀/σ_SQL, up σ_x(τ)/σ_SQL. */
export const INSET = { x: [0.02, 30] as const, y: [0.5, 30] as const };

/** A Gaussian bell of standard deviation σ and unit area, at the offset x from its centre. */
export const bell = (x: number, sigma: number) =>
	Math.exp((-x * x) / (2 * sigma * sigma)) / (Math.sqrt(2 * Math.PI) * sigma);

// --- panel 2: the interferometer -------------------------------------------------------------------------------------

/** h_SQL = √(8ħ/mω²L²) at the frequency f, Hz^-1/2, one-sided. */
export const hSql = (f: number, m = MIRROR, L = ARM) => {
	const w = 2 * Math.PI * f;
	return Math.sqrt((8 * HBAR) / (m * w * w * L * L));
};

/** A and B of S_shot = A/P and S_rp = BP/f⁴, with P in units of P₀: 2√(AB) = h_SQL(f)²f², touching at F0 for P₀. */
export const SHOT_A = hSql(F0) ** 2 / 2;
export const PRESSURE_B = (hSql(F0) ** 2 * F0 ** 4) / 2;

/** The shot noise's spectrum, Hz⁻¹, at the power p = P/P₀, the same at every frequency. */
export const shotPsd = (p: number) => SHOT_A / p;
/** The radiation pressure's spectrum, Hz⁻¹. */
export const pressurePsd = (f: number, p: number) => (PRESSURE_B * p) / f ** 4;
/** The total quantum noise √(S_shot + S_rp), Hz^-1/2. */
export const noise = (f: number, p: number) => Math.sqrt(shotPsd(p) + pressurePsd(f, p));
/** Where the power p touches h_SQL, the shot noise and the radiation pressure equal: (B p²/A)^1/4 = 100 Hz × √p. */
export const touchAt = (p: number) => ((PRESSURE_B * p * p) / SHOT_A) ** 0.25;
/** The noise over h_SQL at f, √((u + 1/u)/2) with u = f²/pF0², never below 1. */
export function overSql(f: number, p: number) {
	const u = (f * f) / (p * F0 * F0);
	return Math.sqrt((u + 1 / u) / 2);
}

/** The interferometer's axes: across 10 to 1000 Hz, up 10⁻²⁵ to 10⁻²² Hz^-1/2. */
export const STRAIN = { f: [10, 1000] as const, h: [1e-25, 1e-22] as const };

/** Everything panel 2 reads out. */
export function lightReading(s: Light) {
	const p = 10 ** s.p;
	const f = 10 ** s.f;
	return {
		p,
		f,
		touch: touchAt(p),
		noise: noise(f, p),
		limit: hSql(f),
		ratio: overSql(f, p),
		shot: Math.sqrt(shotPsd(p)),
		pressure: Math.sqrt(pressurePsd(f, p))
	};
}

// --- the predictions -------------------------------------------------------------------------------------------------

/** The first asks for σ₀ ten times sharper than the optimum, or sharper. */
export const SHARPER = -1;
export const noteFirst = (done: boolean, s: Masses) => done || s.q <= SHARPER + 1e-9;

/** The second asks, at 100 Hz, for a power at most a third of P₀ and one at least three times it. */
export const APART = 3;
export interface Tried {
	low: boolean;
	high: boolean;
}
export const NOTHING_TRIED: Tried = { low: false, high: false };

/** Whether the frequency of interest stands at 100 Hz. */
export const atF0 = (s: Light) => Math.abs(s.f - Math.log10(F0)) < 1e-9;

export function noteTried(tried: Tried, s: Light): Tried {
	if (!atF0(s)) return tried;
	const low = tried.low || s.p <= -Math.log10(APART) + 1e-9;
	const high = tried.high || s.p >= Math.log10(APART) - 1e-9;
	return low === tried.low && high === tried.high ? tried : { low, high };
}
export const noteSecond = (done: boolean, tried: Tried) => done || (tried.low && tried.high);

// --- the words -------------------------------------------------------------------------------------------------------

/** A positive number to three figures, its trailing zeros dropped: "1", "31.6", "0.1", "0.0302". */
export const three = (v: number) => String(Number(v.toPrecision(3)));

/** A quantity in the largest of its units that leaves it at least 1: [factor, name] from the smallest. */
function inUnits(v: number, units: [number, string][]) {
	let pick = units[0];
	for (const u of units) if (v >= u[0] * (1 - 1e-9)) pick = u;
	return `${three(v / pick[0])} ${pick[1]}`;
}
export const massWords = (kg: number) =>
	inUnits(kg, [
		[1e-6, 'mg'],
		[1e-3, 'g'],
		[1, 'kg']
	]);
export const timeWords = (s: number) =>
	inUnits(s, [
		[1e-3, 'ms'],
		[1, 's']
	]);
export const lengthWords = (m: number) =>
	inUnits(m, [
		[1e-3, 'mm'],
		[1e-2, 'cm'],
		[1, 'm']
	]);
export const hertzWords = (f: number) => `${three(f)} Hz`;

/** A number in a power of ten, to three figures: "3.25 × 10⁻¹⁶". */
export function powerWords(v: number) {
	const { mantissa, power } = sci(v);
	return power === 0 ? mantissa : `${mantissa} × 10${superscript(power)}`;
}
/** The same as LaTeX. */
export const powerTex = sciTex;

/** A ratio to three figures after the point: "1.000", "7.071". */
export const ratioWords = (v: number) => v.toFixed(3);

/** The power of ten nearest a positive number, as "10¹³". */
export const aboutTen = (v: number) => `10${superscript(Math.round(Math.log10(v)))}`;
