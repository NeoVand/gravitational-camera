/**
 * Chapter 8.7's quantum tremor, on an exact engine. A body of up to five modes, each a damped oscillator of unit mass
 * weighed in the reading by c_n², so that its response is χ(ω) = Σ c_n²/(ω_n² − ω² − iΓ_nω), with Γ_n = 0.05 ω_n.
 * In thermal equilibrium at the temperature T its tremor at each frequency is the quantum fluctuation–dissipation
 * theorem's two-sided symmetrized spectrum S̄(ω) = ħ coth(ħω/2k_BT) Im χ, against the classical 2k_BT Im χ/ω; its
 * two orders apart are S(ω) = 2ħ(n̄ + 1) Im χ, the absorption, and S(−ω) = 2ħn̄ Im χ, the emission. The static jitter
 * ⟨δy²⟩ = (ħ/π)∫₀^∞ coth(ħω/2k_BT) Im χ dω is counted by quadrature, and set between the paper's two bounds,
 * k_BTχ₀ ≤ ⟨δy²⟩ ≤ ½ħ√(Aχ₀) coth(ħ√(A/χ₀)/2k_BT), with χ₀ = Σ c_n²/ω_n² and A = Σ c_n². The quantum thermometer
 * T = ħω/(2k_B artanh(ħ Im χ/S̄)) is read at the strongest line, beside the classical ωS̄/2k_B Im χ.
 *
 * Units: ħ = 1; a frequency in units of ω₁, the body's lowest mode; a response in units of χ₀; so a spectrum is in
 * units of ħχ₀, a jitter in units of ħω₁χ₀, and the temperature is θ = k_BT/ħω₁. A mode is kept as its frequency
 * x = ω_n/ω₁, its share of the static compliance, c_n²/ω_n²χ₀, and its damping q = Γ_n/ω_n. At θ = 0 every
 * formula is taken in its limit: coth → 1, n̄ → 0, the lower bound 0. Settings, curves, words and the predictions are
 * pure functions too.
 */
import { generator } from './graviton-count';
import { sci, sciTex, superscript } from './longest-path';

export { generator };

// --- the constants ---------------------------------------------------------------------------------------------------

/** The reduced Planck constant, J s, and Boltzmann's constant, J K⁻¹. */
export const HBAR = 1.0546e-34;
export const KB = 1.380649e-23;
/** Every mode's damping, Γ_n/ω_n. */
export const DAMPING = 0.05;

// --- the bodies ------------------------------------------------------------------------------------------------------

/** One mode: its frequency ω_n/ω₁, its share c_n²/ω_n²χ₀ of the static compliance, its damping Γ_n/ω_n. */
export interface Mode {
	readonly x: number;
	readonly share: number;
	readonly q: number;
}

export type Preset = 'ball' | 'one' | 'carts' | 'octaves' | 'random';
export const PRESETS: readonly Preset[] = ['ball', 'one', 'carts', 'octaves', 'random'];
export const PRESET_NAMES: Record<Preset, string> = {
	ball: 'Steel ball',
	one: 'One mode',
	carts: 'Two carts',
	octaves: 'Five modes an octave apart',
	random: 'Five random modes'
};

/** A body: its modes in order of frequency, and, for one with units, ω₁ in s⁻¹ and χ₀ in its own units. */
export interface Body {
	readonly preset: Preset;
	readonly modes: readonly Mode[];
	/** The spectrum's axis runs over ω/ω₁ from 0 to this. */
	readonly most: number;
	readonly units?: {
		/** ω₁, s⁻¹. */
		readonly omega1: number;
		/** χ₀, in m N⁻¹. */
		readonly chi0: number;
		/** The reading, as a letter, and what it is. */
		readonly letter: string;
		readonly reading: string;
	};
}

/** Appendix A's steel ball in 4.3's trial shape: R = 0.10 m, c_T = 3000 m s⁻¹, M = 32.9 kg. */
export const BALL = (() => {
	const R = 0.1;
	const cT = 3000;
	const M = 32.9;
	/** ω₁ = √10 c_T/R, 15.1 kHz, and the effective mass 3M/10, so c² = 1/m_eff for the swing q at the poles. */
	const omega = (Math.sqrt(10) * cT) / R;
	const mass = (3 * M) / 10;
	return { R, cT, M, omega, mass, c2: 1 / mass, chi0: 1 / (mass * omega * omega) };
})();

/** Chapter 4.1's two coupled carts of 2 kg: lines at 5 and 5√3 s⁻¹ in the first cart's position, each of c² = 1/2m. */
export const CARTS = (() => {
	const m = 2;
	const omegas = [5, 5 * Math.sqrt(3)];
	const c2 = 1 / (2 * m);
	const chi0 = omegas.reduce((s, w) => s + c2 / (w * w), 0);
	return { m, omegas, c2, chi0 };
})();

/** The modes of given frequencies and weights c_n², each damped by q, as shares of their own χ₀. */
export function modesOf(xs: readonly number[], c2s: readonly number[], q = DAMPING): Mode[] {
	const parts = xs.map((x, i) => c2s[i] / (x * x));
	const chi0 = parts.reduce((s, p) => s + p, 0);
	return xs.map((x, i) => ({ x, share: parts[i] / chi0, q }));
}

/** Five modes an octave apart, at ω₁ to 16ω₁, each holding a fifth of χ₀ (c_n² = 0.2χ₀ω_n²). */
export const octaveModes = (q = DAMPING) =>
	[1, 2, 4, 8, 16].map((x) => ({ x, share: 0.2, q }) as Mode);

/**
 * Five random modes: the lowest at ω₁, four more above it at random gaps in log, the highest 0.6 to 1 decade up, so
 * that no two lines stand closer than 12% in frequency and merge; random shares.
 */
export function randomModes(random: () => number, q = DAMPING): Mode[] {
	const gaps = Array.from({ length: 4 }, () => 0.5 + random());
	const gapSum = gaps.reduce((s, g) => s + g, 0);
	const span = 0.6 + 0.4 * random();
	let at = 0;
	const xs = [1, ...gaps.map((g) => 10 ** ((span * (at += g)) / gapSum))];
	const weights = xs.map(() => 0.1 + 0.9 * random());
	const total = weights.reduce((s, w) => s + w, 0);
	return xs.map((x, i) => ({ x: Number(x.toFixed(3)), share: weights[i] / total, q }));
}

/** The body a preset stands for; the random one takes its modes. */
export function bodyOf(preset: Preset, random: readonly Mode[] = []): Body {
	switch (preset) {
		case 'ball':
			return {
				preset,
				modes: [{ x: 1, share: 1, q: DAMPING }],
				most: 2,
				units: {
					omega1: BALL.omega,
					chi0: BALL.chi0,
					letter: 'q',
					reading: 'the swing at the poles'
				}
			};
		case 'one':
			return { preset, modes: [{ x: 1, share: 1, q: DAMPING }], most: 2 };
		case 'carts':
			return {
				preset,
				modes: modesOf(
					CARTS.omegas.map((w) => w / CARTS.omegas[0]),
					CARTS.omegas.map(() => CARTS.c2)
				),
				most: 2.5,
				units: {
					omega1: CARTS.omegas[0],
					chi0: CARTS.chi0,
					letter: 'x',
					reading: 'the first cart’s position'
				}
			};
		case 'octaves':
			return { preset, modes: octaveModes(), most: 20 };
		case 'random': {
			const top = random.reduce((s, m) => Math.max(s, m.x), 1);
			return { preset, modes: random, most: Math.ceil(top * 1.25) };
		}
	}
}

/** Whether a preset is a body of a single mode. */
export const single = (p: Preset) => p === 'ball' || p === 'one';

// --- the response ----------------------------------------------------------------------------------------------------

/** χ₀ = Σ c_n²/ω_n², in units of the body's χ₀: 1 for a body built here. */
export const staticCompliance = (ms: readonly Mode[]) => ms.reduce((s, m) => s + m.share, 0);
/** The fast-end sum A = Σ c_n², in units of χ₀ω₁². */
export const responseSum = (ms: readonly Mode[]) => ms.reduce((s, m) => s + m.share * m.x * m.x, 0);
/** The rms frequency √(A/χ₀), in units of ω₁. */
export const rmsFrequency = (ms: readonly Mode[]) =>
	Math.sqrt(responseSum(ms) / staticCompliance(ms));

/** Im χ/ω of one mode at ω ≥ 0: c²Γ/[(ω_n² − ω²)² + Γ²ω²], finite at ω = 0. */
export function lineOverOmega(m: Mode, w: number): number {
	const g = m.q * m.x;
	const a = m.x * m.x - w * w;
	return (m.share * m.x * m.x * g) / (a * a + g * g * w * w);
}

/** Im χ/ω of the body at |ω|. */
export const imChiOverOmega = (ms: readonly Mode[], w: number) =>
	ms.reduce((s, m) => s + lineOverOmega(m, Math.abs(w)), 0);
/** Im χ of the body, odd in ω. */
export const imChi = (ms: readonly Mode[], w: number) => w * imChiOverOmega(ms, w);

// --- the factors of heat ---------------------------------------------------------------------------------------------

/** coth(ħω/2k_BT) for ω > 0, at θ = k_BT/ħω₁; 1 at θ = 0. */
export function cothFactor(w: number, theta: number): number {
	if (theta <= 0) return 1;
	const u = w / (2 * theta);
	if (u < 1e-4) return 1 / u + u / 3;
	return 1 + 2 / Math.expm1(2 * u);
}

/** |ω| coth(ħ|ω|/2k_BT), even in ω: 2k_BT/ħ at ω = 0, |ω| at θ = 0. */
export function omegaCoth(w: number, theta: number): number {
	const a = Math.abs(w);
	if (theta <= 0) return a;
	const u = a / (2 * theta);
	if (u < 1e-4) return 2 * theta * (1 + (u * u) / 3);
	return a * (1 + 2 / Math.expm1(2 * u));
}

/** The occupation n̄ = 1/(e^{ħω/k_BT} − 1) at ω > 0; 0 at θ = 0. */
export const occupation = (w: number, theta: number) =>
	theta <= 0 ? 0 : 1 / Math.expm1(w / theta);

// --- the spectra -----------------------------------------------------------------------------------------------------

/** The symmetrized spectrum S̄ = ħ coth(ħω/2k_BT) Im χ, two-sided and even, in units of ħχ₀. */
export const symmetrized = (ms: readonly Mode[], w: number, theta: number) =>
	imChiOverOmega(ms, w) * omegaCoth(w, theta);

/** The classical spectrum 2k_BT Im χ/ω, even, in units of ħχ₀. */
export const classical = (ms: readonly Mode[], w: number, theta: number) =>
	2 * Math.max(0, theta) * imChiOverOmega(ms, w);

/**
 * The unsymmetrized spectrum S(ω): at ω > 0 the absorption 2ħ(n̄ + 1) Im χ, at ω < 0 the emission, S(−|ω|) =
 * 2ħn̄ Im χ(|ω|); both meet S̄ at ω = 0. The average of S(ω) and S(−ω) is S̄(ω).
 */
export function unsymmetrized(ms: readonly Mode[], w: number, theta: number): number {
	if (w === 0) return symmetrized(ms, 0, theta);
	const a = Math.abs(w);
	const n = occupation(a, theta);
	return 2 * (w > 0 ? n + 1 : n) * imChi(ms, a);
}

// --- the jitter ------------------------------------------------------------------------------------------------------

/** Adaptive Simpson's rule for a smooth g on [a, b], to the absolute tolerance given. */
export function integrate(
	g: (t: number) => number,
	a: number,
	b: number,
	tolerance: number
): number {
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
	const panels = 16;
	const h = (b - a) / panels;
	let out = 0;
	for (let i = 0; i < panels; i++) {
		const x0 = a + i * h;
		const x1 = i === panels - 1 ? b : x0 + h;
		const f0 = g(x0);
		const fm = g((x0 + x1) / 2);
		const f1 = g(x1);
		out += step(x0, x1, f0, fm, f1, simpson(f0, fm, f1, x1 - x0), tolerance / panels, 30);
	}
	return out;
}

/** An undamped mode's jitter, ½ħ(c²/ω_n) coth(ħω_n/2k_BT): [the chapter's ⟨x²⟩] for a unit mass, times c². */
export const undampedModeJitter = (m: Mode, theta: number) =>
	0.5 * m.share * m.x * cothFactor(m.x, theta);

/**
 * One mode's jitter (1/π)∫₀^∞ coth(ħω/2k_BT) Im χ dω, in units of ħω₁χ₀, by adaptive Simpson's rule after the
 * change ω = ω_n + (Γ_n/2) tan φ, which makes the line nearly flat in φ however narrow it is. The integrand is
 * taken as (Im χ/ω)·ω coth(ħω/2k_BT), finite at ω = 0, and it falls to 0 at φ = π/2. An undamped mode takes its
 * closed form.
 */
export function modeJitter(m: Mode, theta: number): number {
	if (m.q <= 0) return undampedModeJitter(m, theta);
	const half = (m.q * m.x) / 2;
	const a = Math.atan(-m.x / half);
	const g = (phi: number) => {
		if (phi >= Math.PI / 2) return 0;
		const tan = Math.tan(phi);
		const w = m.x + half * tan;
		return lineOverOmega(m, w) * omegaCoth(w, theta) * half * (1 + tan * tan);
	};
	const scale = m.share * (m.x + Math.max(0, theta));
	return integrate(g, a, Math.PI / 2, 1e-10 * scale) / Math.PI;
}

/** The body's jitter ⟨δy²⟩, the sum of its modes', in units of ħω₁χ₀. */
export const jitter = (ms: readonly Mode[], theta: number) =>
	ms.reduce((s, m) => s + modeJitter(m, theta), 0);

/** The same with every line shrunk to zero width: ½ħ Σ c_n²/ω_n coth(ħω_n/2k_BT). */
export const undampedJitter = (ms: readonly Mode[], theta: number) =>
	ms.reduce((s, m) => s + undampedModeJitter(m, theta), 0);

/** The zero point of the modes, ½ħ Σ c_n²/ω_n: the undamped jitter at absolute zero. */
export const zeroPoint = (ms: readonly Mode[]) => undampedJitter(ms, 0);

/** The lower bound k_BTχ₀, in units of ħω₁χ₀: 0 at absolute zero. */
export const lowerBound = (ms: readonly Mode[], theta: number) =>
	Math.max(0, theta) * staticCompliance(ms);

/** The upper bound ½ħ√(Aχ₀) coth(ħ√(A/χ₀)/2k_BT), one mode at √(A/χ₀), in units of ħω₁χ₀. */
export function upperBound(ms: readonly Mode[], theta: number): number {
	const chi0 = staticCompliance(ms);
	const w = rmsFrequency(ms);
	return 0.5 * chi0 * w * cothFactor(w, theta);
}

// --- the thermometer -------------------------------------------------------------------------------------------------

/** The strongest line: the mode with the largest share, whose line stands highest; of equals, the lowest. */
export const strongest = (ms: readonly Mode[]) =>
	ms.reduce((a, b) => (b.share > a.share * (1 + 1e-12) ? b : a));

/** artanh z = ½ ln((1 + z)/(1 − z)), given 1 + z and 1 − z. */
export const artanhOf = (onePlus: number, oneMinus: number) => 0.5 * Math.log(onePlus / oneMinus);

/**
 * The quantum thermometer's reading k_BT/ħω₁ = ω/(2 artanh(ħ Im χ/S̄)), from a measured S̄ and Im χ at ω. With
 * z = ħ Im χ/S̄, 1 − z is (S̄ − ħ Im χ)/S̄, which is the emission S(−ω)/S̄: given the emission, 1 − z keeps its
 * figures when z is within 10⁻¹⁶ of 1, as in a frozen line. With no emission at all it reads absolute zero.
 */
export function thermometer(w: number, im: number, sbar: number, emission = sbar - im): number {
	if (!(emission > 0)) return 0;
	return w / (2 * artanhOf((sbar + im) / sbar, emission / sbar));
}

/** The classical thermometer's reading, ωS̄/2k_B Im χ, as k_BT/ħω₁. */
export const classicalThermometer = (w: number, im: number, sbar: number) => (w * sbar) / (2 * im);

/** Both thermometers read at the centre of the strongest line. */
export function thermometers(ms: readonly Mode[], theta: number) {
	const line = strongest(ms);
	const w = line.x;
	const im = imChi(ms, w);
	const sbar = symmetrized(ms, w, theta);
	const emission = unsymmetrized(ms, -w, theta);
	return {
		w,
		im,
		sbar,
		emission,
		quantum: thermometer(w, im, sbar, emission),
		classical: classicalThermometer(w, im, sbar),
		/** Whether the line is so cold, ħω > 700 k_BT, that its emission is below the smallest number a double holds. */
		frozen: theta > 0 && !(emission > 0)
	};
}

// --- everything read out ---------------------------------------------------------------------------------------------

export function reading(body: Body, theta: number) {
	const ms = body.modes;
	const j = jitter(ms, theta);
	const lower = lowerBound(ms, theta);
	const upper = upperBound(ms, theta);
	const rms = rmsFrequency(ms);
	const u = body.units;
	return {
		theta,
		jitter: j,
		lower,
		upper,
		/** ⟨δy²⟩/k_BTχ₀: infinite at absolute zero, where k_BTχ₀ = 0. */
		overLower: lower > 0 ? j / lower : Infinity,
		overUpper: j / upper,
		rms,
		zeroPoint: zeroPoint(ms),
		thermo: thermometers(ms, theta),
		/** For a body with units: T in kelvin, √(A/χ₀) in s⁻¹ and the rms reading in metres. */
		kelvin: u ? (theta * HBAR * u.omega1) / KB : undefined,
		rmsPerSecond: u ? rms * u.omega1 : undefined,
		rmsReading: u ? Math.sqrt(j * HBAR * u.omega1 * u.chi0) : undefined
	};
}

// --- the temperature -------------------------------------------------------------------------------------------------

/**
 * The temperature slider, in log₁₀ θ from 10⁻² to 10², with one more stop below its left end that stands for
 * exactly zero: a twentieth of a decade a press, a quarter with Shift or Page.
 */
export const TEMPERATURE = { zero: -2.25, min: -2, max: 2, step: 0.01, key: 0.05, large: 0.25 };
/** The figure opens on five modes an octave apart at k_BT = ħω₁. */
export const OPENING = { preset: 'octaves' as Preset, t: 0 };

export const isZero = (v: number) => v <= TEMPERATURE.zero + 1e-9;
/** θ = k_BT/ħω₁ for a slider value: 0 at the stop, 10^v on the track. */
export const thetaOf = (v: number) => (isZero(v) ? 0 : 10 ** v);

/** A slider value held to the track or the stop, landed on its grid of hundredths. */
export function snapTemperature(v: number): number {
	const T = TEMPERATURE;
	if (!(v >= (T.zero + T.min) / 2)) return T.zero;
	if (v <= T.min + T.step / 2) return T.min;
	if (v >= T.max - T.step / 2) return T.max;
	return Math.round(Math.round(v / T.step) * T.step * 1e9) / 1e9 || 0;
}

/** The value a key moves the slider to, or undefined for a key it does not use. */
export function stepTemperature(v: number, key: string, shift: boolean): number | undefined {
	const T = TEMPERATURE;
	if (key === 'Home') return T.zero;
	if (key === 'End') return T.max;
	const dir = { ArrowRight: 1, ArrowUp: 1, PageUp: 1, ArrowLeft: -1, ArrowDown: -1, PageDown: -1 }[
		key
	];
	if (dir === undefined) return undefined;
	if (isZero(v)) return dir > 0 ? T.min : T.zero;
	if (dir < 0 && v <= T.min + 1e-9) return T.zero;
	const size = shift || key.startsWith('Page') ? T.large : T.key;
	const k = dir > 0 ? Math.floor(v / size + 1e-9) + 1 : Math.ceil(v / size - 1e-9) - 1;
	const next = Math.round(k * size * 1e9) / 1e9 || 0;
	return Math.max(T.min, Math.min(T.max, next));
}

// --- the curves ------------------------------------------------------------------------------------------------------

/** The right panel's axes: across θ from 10⁻² to 10², up the jitter in units of ħω₁χ₀ from 10⁻² to 300. */
export const BOUNDS_AXES = { t: [-2, 2] as const, y: [0.01, 300] as const };

/** The slider values at which the jitter is drawn against the temperature: every fortieth of a decade. */
export const CURVE_TS = Array.from({ length: 161 }, (_, i) => -2 + i / 40);

/** The jitter and both bounds at every value of CURVE_TS, and at absolute zero. */
export function boundCurves(ms: readonly Mode[]) {
	const at = (v: number) => {
		const theta = thetaOf(v);
		return {
			t: v,
			jitter: jitter(ms, theta),
			lower: lowerBound(ms, theta),
			upper: upperBound(ms, theta)
		};
	};
	return { points: CURVE_TS.map(at), zero: at(TEMPERATURE.zero) };
}

/** Where the spectrum is drawn on ω from a to b: evenly, and closer across each line, ±12 widths about its peak. */
export function spectrumSamples(ms: readonly Mode[], a: number, b: number, n = 600): number[] {
	const out: number[] = [];
	for (let i = 0; i <= n; i++) out.push(a + ((b - a) * i) / n);
	for (const m of ms) {
		const g = m.q * m.x;
		for (const sign of a < 0 ? [-1, 1] : [1])
			for (let i = -48; i <= 48; i++) out.push(sign * (m.x + (i / 4) * g));
	}
	out.sort((p, r) => p - r);
	return out.filter((w, i) => w >= a && w <= b && (i === 0 || w - out[i - 1] > 1e-9));
}

/** A linear axis from 0 that holds `most` with a little room: its top and its ticks, at 1, 2 or 5 × 10^k. */
export function linearAxis(most: number, count = 5) {
	const raw = Math.max(most, 1e-12) / count;
	const p = 10 ** Math.floor(Math.log10(raw));
	const step = [1, 2, 5, 10].map((k) => k * p).find((s) => s >= raw * (1 - 1e-9)) ?? 10 * p;
	const top = step * Math.ceil((most * 1.06) / step - 1e-9);
	const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) =>
		Number((i * step).toPrecision(6))
	);
	return { top, step, ticks };
}

// --- the predictions -------------------------------------------------------------------------------------------------

/** The first asks to cool the body to absolute zero. */
export const noteFirst = (done: boolean, v: number) => done || isZero(v);

/** The slider values visited since the body was last chosen. */
export interface Span {
	readonly low: number;
	readonly high: number;
}
export const spanAt = (v: number): Span => ({ low: v, high: v });
export const widen = (s: Span, v: number): Span =>
	v < s.low || v > s.high ? { low: Math.min(s.low, v), high: Math.max(s.high, v) } : s;

/**
 * The second asks to make the body a single mode, and is answered once its temperature has been at most 0.1 ħω₁/k_B
 * (absolute zero included) and at least 10 ħω₁/k_B, across the knee where the quanta stop being small.
 */
export const COLD = -1;
export const WARM = 1;
export const noteSecond = (done: boolean, preset: Preset, span: Span) =>
	done || (single(preset) && span.low <= COLD + 1e-9 && span.high >= WARM - 1e-9);

/** Whether a slider value lies in a span. */
export const within = (s: Span, v: number) => v >= s.low - 1e-9 && v <= s.high + 1e-9;

// --- the words -------------------------------------------------------------------------------------------------------

/** A positive number to three figures, its trailing zeros dropped: "1", "31.6", "0.1", "0.0302". */
export const three = (v: number) => String(Number(v.toPrecision(3)));

/** A ratio to three figures after the point: "0.984". */
export const ratioWords = (v: number) => v.toFixed(3);

/** θ = k_BT/ħω₁ in words: "0", "0.01", "3.16", "100". */
export const thetaWords = (theta: number) => (theta <= 0 ? '0' : three(theta));

/** A number in a power of ten, to three figures: "7.44 × 10⁻²¹". */
export function powerWords(v: number) {
	const { mantissa, power } = sci(v);
	return power === 0 ? mantissa : `${mantissa} × 10${superscript(power)}`;
}
/** The same as LaTeX. */
export const powerTex = sciTex;

/** A temperature in the largest of K, mK, μK, nK, pK that leaves it at least 1; "0 K" at absolute zero. */
export function kelvinWords(T: number): string {
	if (T <= 0) return '0 K';
	const units: [number, string][] = [
		[1e-12, 'pK'],
		[1e-9, 'nK'],
		[1e-6, 'μK'],
		[1e-3, 'mK'],
		[1, 'K']
	];
	let pick = units[0];
	for (const u of units) if (T >= u[0] * (1 - 1e-9)) pick = u;
	return `${three(T / pick[0])} ${pick[1]}`;
}
