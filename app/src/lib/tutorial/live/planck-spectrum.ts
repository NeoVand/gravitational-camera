/**
 * Chapter 10.1's black body. Planck's law, summed over the two polarizations and per steradian,
 *
 *   B_ω(T) = ħω³/(4π³c²) · 1/(e^x − 1),   x = ħω/k_BT,
 *
 * drawn three ways: per unit of angular frequency, B_ω, whose shape in x is x³/(e^x − 1); per unit of wavelength,
 * B_λ = (2πc/λ²)B_ω = (ω²/2πc)B_ω, whose shape is x⁵/(e^x − 1); and as a count of quanta per unit of angular
 * frequency, B_ω/ħω, whose shape is x²/(e^x − 1). Each peaks where x = n(1 − e^{−x}), n = 3, 5 and 2: at x = 2.821,
 * 4.965 and 1.594. The curve is also the product of three factors,
 *
 *   B_ω = (c/4π) · (ω²/π²c³) · n̄ · ħω,
 *
 * the modes in a cubic metre per unit of ω (both polarizations), the occupation n̄ = 1/(e^x − 1) and the quantum ħω.
 * The totals are the Stefan–Boltzmann law, σ_SB T⁴ = π ∫B_ω dω, the number radiance N_bb = ∫B_ω/ħω dω =
 * ζ(3)(k_BT/ħ)³/2π³c², and their ratio, the mean energy of a quantum, (π⁴/15)/(2ζ(3)) k_BT = 2.701 k_BT. Everything
 * is drawn on scales of powers of ten, so the curves are computed as logarithms, which stay finite where the Wien
 * tail falls below the smallest double.
 */

// --- the constants (SI, exact since 2019, but ζ(3)) -------------------------------------------------------------------

/** Planck's constant, J s; the reduced one, ħ = h/2π. */
export const H = 6.62607015e-34;
export const HBAR = H / (2 * Math.PI);
/** Boltzmann's constant, J K⁻¹. */
export const KB = 1.380649e-23;
/** The speed of light, m s⁻¹. */
export const C = 299792458;
/** The electronvolt, J. */
export const EV = 1.602176634e-19;
/** Apéry's constant, ζ(3). */
export const ZETA3 = 1.2020569031595942;
/** The Stefan–Boltzmann constant π²k_B⁴/60ħ³c², W m⁻² K⁻⁴: 5.670 × 10⁻⁸. */
export const SIGMA_SB = (Math.PI ** 2 * KB ** 4) / (60 * HBAR ** 3 * C ** 2);
/** The mean energy of a quantum over k_BT, (π⁴/15)/(2ζ(3)) = 2.701. */
export const MEAN_RATIO = Math.PI ** 4 / 15 / (2 * ZETA3);

const LOG10E = Math.LOG10E;

// --- the three curves --------------------------------------------------------------------------------------------------

export type Mode = 'frequency' | 'wavelength' | 'count';
export const MODE_ORDER: readonly Mode[] = ['frequency', 'wavelength', 'count'];

/** The power n of each curve's shape xⁿ/(e^x − 1). */
export const POWER: Record<Mode, number> = { frequency: 3, wavelength: 5, count: 2 };

/** The root of x = n(1 − e^{−x}) above zero, by Newton's method from x = n: where xⁿ/(e^x − 1) peaks. */
export function peakX(n: number): number {
	let x = n;
	for (let i = 0; i < 50; i++) {
		const g = x - n * -Math.expm1(-x);
		const dx = g / (1 - n * Math.exp(-x));
		x -= dx;
		if (Math.abs(dx) < 1e-15 * x) break;
	}
	return x;
}

/** Where each curve peaks: x = 2.821, 4.965 and 1.594. */
export const PEAK_X: Record<Mode, number> = {
	frequency: peakX(3),
	wavelength: peakX(5),
	count: peakX(2)
};

/** x = ħω/k_BT at the frequency f = ω/2π, in hertz. */
export const xAt = (f: number, T: number) => (H * f) / (KB * T);

/** log₁₀ of the occupation n̄ = 1/(e^x − 1) = e^{−x}/(1 − e^{−x}), finite however large x is. */
export const logOccupation = (x: number) => -x * LOG10E - Math.log10(-Math.expm1(-x));

/** The occupation n̄ = 1/(e^x − 1). */
export const occupation = (x: number) => 1 / Math.expm1(x);

/** Planck's B_ω, W m⁻² sr⁻¹ per s⁻¹, at the angular frequency ω. */
export const planck = (omega: number, T: number) =>
	((HBAR * omega ** 3) / (4 * Math.PI ** 3 * C ** 2)) * occupation((HBAR * omega) / (KB * T));

const LOG_PLANCK = Math.log10(HBAR / (4 * Math.PI ** 3 * C ** 2));
const LOG_2PIC = Math.log10(2 * Math.PI * C);
const LOG_HBAR = Math.log10(HBAR);
const LOG_2PI = Math.log10(2 * Math.PI);

/**
 * log₁₀ of the curve drawn, at log₁₀ of the frequency f in hertz: B_ω in W m⁻² sr⁻¹ s, B_λ in W m⁻² sr⁻¹ m⁻¹, or
 * B_ω/ħω in quanta s⁻¹ m⁻² sr⁻¹ per s⁻¹, which is m⁻² sr⁻¹.
 */
export function logSpectrum(mode: Mode, lf: number, T: number): number {
	const lw = lf + LOG_2PI;
	const occ = logOccupation(xAt(10 ** lf, T));
	const b = LOG_PLANCK + 3 * lw + occ;
	if (mode === 'frequency') return b;
	if (mode === 'wavelength') return b + 2 * lw - LOG_2PIC;
	return b - LOG_HBAR - lw;
}

/** The curve drawn, as a number (zero where it falls below the smallest double). */
export const spectrum = (mode: Mode, f: number, T: number) =>
	10 ** logSpectrum(mode, Math.log10(f), T);

// --- the three factors -------------------------------------------------------------------------------------------------

const LOG_MODES = -Math.log10(Math.PI ** 2 * C ** 3);

/** log₁₀ of the modes in a cubic metre per unit of ω, both polarizations, ω²/π²c³ (m⁻³ s). */
export const logModes = (lf: number) => LOG_MODES + 2 * (lf + LOG_2PI);

/** log₁₀ of the quantum ħω = hf, in electronvolts. */
export const logQuantum = (lf: number) => Math.log10(H / EV) + lf;

/** log₁₀ of k_BT, in electronvolts. */
export const logThermal = (T: number) => Math.log10((KB * T) / EV);

/** The product of the factors, (c/4π) · ω²/π²c³ · n̄ · ħω, in log₁₀: B_ω again. */
export const logProduct = (lf: number, T: number) =>
	Math.log10(C / (4 * Math.PI)) +
	logModes(lf) +
	logOccupation(xAt(10 ** lf, T)) +
	logQuantum(lf) +
	Math.log10(EV);

// --- the peaks and the totals ------------------------------------------------------------------------------------------

export type Peak = {
	/** x = ħω/k_BT at the peak. */
	x: number;
	/** Its angular frequency, s⁻¹, its frequency f = ω/2π, Hz, and its wavelength c/f, m. */
	omega: number;
	f: number;
	lambda: number;
	/** The occupation there, 1/(e^x − 1). */
	occupation: number;
	/** The height of the curve there, in its own unit. */
	height: number;
};

export function peak(mode: Mode, T: number): Peak {
	const x = PEAK_X[mode];
	const omega = (x * KB * T) / HBAR;
	const f = omega / (2 * Math.PI);
	return {
		x,
		omega,
		f,
		lambda: C / f,
		occupation: occupation(x),
		height: spectrum(mode, f, T)
	};
}

/** σ_SB T⁴, W m⁻²: what a black surface sends into the half of the sky above it. */
export const power = (T: number) => SIGMA_SB * T ** 4;

/** The number radiance N_bb = ζ(3)(k_BT/ħ)³/2π³c², quanta s⁻¹ m⁻² sr⁻¹. */
export const count = (T: number) => (ZETA3 / (2 * Math.PI ** 3 * C ** 2)) * ((KB * T) / HBAR) ** 3;

/** The mean energy of a quantum, 2.701 k_BT, J. */
export const meanEnergy = (T: number) => MEAN_RATIO * KB * T;

// --- the controls -------------------------------------------------------------------------------------------------------

/** log₁₀ T from 0.5 K to 2 × 10⁷ K: the arrows step a hundredth of a power of ten, the page keys a tenth. */
export const TEMPERATURE = {
	low: Math.log10(0.5),
	high: Math.log10(2e7),
	step: 0.01,
	page: 0.1
};
export const T_MIN = 0.5;
export const T_MAX = 2e7;

export type PresetName = 'sky' | 'room' | 'outer' | 'inner' | 'sun';
export const PRESETS: Record<PresetName, number> = {
	sky: 0.905,
	room: 293,
	outer: 4500,
	inner: 5500,
	sun: 1.3e7
};
export const PRESET_ORDER: readonly PresetName[] = ['sky', 'room', 'outer', 'inner', 'sun'];

/** Where the figure opens. */
export const OPENING = { T: PRESETS.room, mode: 'frequency' as Mode };

/** Which preset a temperature is, if any. */
export const presetOf = (T: number) =>
	PRESET_ORDER.find((p) => Math.abs(Math.log10(PRESETS[p] / T)) < 1e-6);

// --- the axes -----------------------------------------------------------------------------------------------------------

/** log₁₀ of the frequency in hertz along the bottom: 100 MHz to 10 EHz, wide enough for every curve's peak. */
export const F_AXIS = { low: 8, high: 19 };

/**
 * log₁₀ of each curve's height up the side, fixed whatever the temperature, so that a change of temperature moves
 * the curve: from about seven powers of ten below its peak at 0.5 K to more than two above its peak at 2 × 10⁷ K.
 * `every` is the spacing of the labelled powers of ten.
 */
export const Y_AXIS: Record<Mode, { low: number; high: number; every: number }> = {
	frequency: { low: -27, high: 5, every: 5 },
	wavelength: { low: -14, high: 35, every: 10 },
	count: { low: -4, high: 20, every: 5 }
};

/** The factors' axes: the modes in m⁻³ s, the occupation, and the quantum in eV. */
export const FACTOR_AXIS = {
	modes: { low: -10, high: 15, every: 10 },
	occupation: { low: -8, high: 10, every: 5 },
	quantum: { low: -7, high: 5, every: 5 }
};

/** The labelled powers of ten of an axis: the multiples of `every` within it. */
export function powers(axis: { low: number; high: number; every: number }): number[] {
	const out: number[] = [];
	for (let e = Math.ceil(axis.low / axis.every) * axis.every; e <= axis.high; e += axis.every) {
		out.push(e);
	}
	return out;
}

/** The frequencies named along the bottom: 1 GHz, 1 THz, 1 PHz and 1 EHz. */
export const F_LABELS = [
	{ at: 9, text: '1 GHz' },
	{ at: 12, text: '1 THz' },
	{ at: 15, text: '1 PHz' },
	{ at: 18, text: '1 EHz' }
];

/** The wavelengths named along the top, at log₁₀ f = log₁₀(c/λ): 1 m, 1 mm, 1 µm and 1 nm. */
export const LAMBDA_LABELS = [
	{ at: Math.log10(C), text: '1 m' },
	{ at: Math.log10(C / 1e-3), text: '1 mm' },
	{ at: Math.log10(C / 1e-6), text: '1 µm' },
	{ at: Math.log10(C / 1e-9), text: '1 nm' }
];

/** Every power of ten of the wavelength on the axis, for its small ticks. */
export const LAMBDA_TICKS = (() => {
	const out: number[] = [];
	for (let k = -12; k <= 2; k++) {
		const at = Math.log10(C) - k;
		if (at >= F_AXIS.low && at <= F_AXIS.high) out.push(at);
	}
	return out;
})();

/** Visible light, 400 to 700 nm, as log₁₀ of its frequencies. */
export const VISIBLE = { low: Math.log10(C / 700e-9), high: Math.log10(C / 400e-9) };

/** The points of a curve given as log₁₀ y against log₁₀ f, every `step` of a power of ten across the axis. */
export function sample(fn: (lf: number) => number, step = 0.01): [number, number][] {
	const n = Math.round((F_AXIS.high - F_AXIS.low) / step);
	const out: [number, number][] = [];
	for (let i = 0; i <= n; i++) {
		const lf = F_AXIS.low + (i * (F_AXIS.high - F_AXIS.low)) / n;
		out.push([lf, fn(lf)]);
	}
	return out;
}

// --- words and numbers ---------------------------------------------------------------------------------------------------

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
export const sup = (e: number) => [...String(e)].map((c) => SUPER[c]).join('');

/** Mantissa and exponent, the mantissa rounded to `figures` and carried if it rounds to 10. */
function split(x: number, figures: number) {
	let e = Math.floor(Math.log10(x));
	let m = Number((x / 10 ** e).toFixed(figures - 1));
	if (m >= 10) {
		e += 1;
		m = 1;
	}
	return { m: m.toFixed(figures - 1), e };
}

/** Digits to `figures` figures, keeping trailing zeros: "0.06330", "417.9", "4045". */
function digits(a: number, figures: number): string {
	const e = Math.floor(Math.log10(a));
	const places = Math.max(0, figures - 1 - e);
	return a.toFixed(places);
}

/** A number as text to `figures` figures, with a true minus sign: "417.9", "0.06821", "1.218 × 10²²". */
export function numberText(x: number, figures = 3): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '−' : '';
	const a = Math.abs(x);
	if (a >= 0.001 && a < 1e4) return sign + digits(a, figures);
	const { m, e } = split(a, figures);
	return `${sign}${m} × 10${sup(e)}`;
}

/** The same as LaTeX: "1.218 \times 10^{22}". */
export function numberTex(x: number, figures = 3): string {
	if (x === 0) return '0';
	const sign = x < 0 ? '-' : '';
	const a = Math.abs(x);
	if (a >= 0.001 && a < 1e4) return sign + digits(a, figures);
	const { m, e } = split(a, figures);
	return `${sign}${m} \\times 10^{${e}}`;
}

/** A temperature: "0.905 K", "293 K", "4500 K", "1.30 × 10⁷ K" (text) and its LaTeX. */
export function temperatureText(T: number): string {
	if (T < 100) return `${digits(T, 3)} K`;
	if (T < 1e5) return `${Math.round(T)} K`;
	return `${numberText(T, 3)} K`;
}

export function temperatureTex(T: number): string {
	if (T < 100) return `${digits(T, 3)}\\,\\mathrm{K}`;
	if (T < 1e5) return `${Math.round(T)}\\,\\mathrm{K}`;
	return `${numberTex(T, 3)}\\,\\mathrm{K}`;
}

const F_UNITS = [
	{ scale: 1e18, unit: 'EHz' },
	{ scale: 1e15, unit: 'PHz' },
	{ scale: 1e12, unit: 'THz' },
	{ scale: 1e9, unit: 'GHz' },
	{ scale: 1e6, unit: 'MHz' }
];

/** A frequency in the prefix that leaves 1 to 1000 of it, to three figures: "17.2 THz", "53.1 GHz". */
export function frequencyText(f: number): { value: string; unit: string } {
	const u = F_UNITS.find((p) => f >= p.scale * 0.9995) ?? F_UNITS[F_UNITS.length - 1];
	return { value: digits(f / u.scale, 3), unit: u.unit };
}

/** A wavelength in m, mm, µm or nm, to three figures: "17.4 µm", "5.65 mm", "0.392 nm". */
export function wavelengthText(lambda: number): { value: string; unit: string; tex: string } {
	const units = [
		{ scale: 1, unit: 'm', tex: '\\mathrm{m}' },
		{ scale: 1e-3, unit: 'mm', tex: '\\mathrm{mm}' },
		{ scale: 1e-6, unit: 'µm', tex: '\\mu\\mathrm{m}' }
	];
	const u = units.find((p) => lambda >= p.scale * 0.9995) ?? {
		scale: 1e-9,
		unit: 'nm',
		tex: '\\mathrm{nm}'
	};
	return { value: digits(lambda / u.scale, 3), unit: u.unit, tex: u.tex };
}
