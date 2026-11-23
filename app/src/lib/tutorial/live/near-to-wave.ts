/**
 * Chapter 5.2's field of one oscillating point source, along a line away from it:
 *
 *   u = Re[e^{i(kr − ωt)}]/r = cos(kr − ωt)/r,
 *
 * the chapter's u = Re[b̃ e^{i(kr − ωt)}/4πr] with b̃ = 4π, and its slope, the chapter's eq:slope at one frequency,
 *
 *   ∂u/∂r = Re[e^{i(kr − ωt)}(−1/r² + ik/r)],
 *
 * split into the near part −Re[e^{i(kr − ωt)}]/r² = −cos(kr − ωt)/r² and the wave part
 * Re[ik e^{i(kr − ωt)}]/r = −k sin(kr − ωt)/r. Everything here is exact: no step, no fit.
 *
 * The two parts have the sizes 1/r² and k/r, so the wave part is kr times the near part, and they are equal at
 * kr = 1, r = 1/k = c/2πf = λ/2π (the chapter's eq:boundary). The figure draws each part multiplied by r², so that the
 * near part keeps the envelope 1 and the wave part's envelope is kr. At a fixed r the near part follows the source a
 * phase kr late, and the wave part, which follows the source's rate of change, reaches each of its peaks a quarter
 * cycle sooner; both share the delay r/c.
 *
 * The figure keeps its distances in metres, for a source of a frequency f near 1 Hz, so that halving the frequency
 * moves the edge c/2πf twice as far out over the same metres. Its window spans two decades of distance, inside 0.01λ
 * to 10λ of the frequency now.
 */
import { C } from './regime-map';

export { C };

/** The frequency the figure opens at, Hz: the chapter's 1 Hz, whose near zone reaches 47,700 km. */
export const F0 = 1;
/** Its wavelength, m. */
export const LAMBDA0 = C / F0;

/** The window shown spans this many decades of distance. */
export const SPAN = 2;
/** The window's slider: the log₁₀ of its inner end in wavelengths, so that the window stays inside 0.01λ to 10λ. */
export const RANGE = { min: -2, max: 1 - SPAN, step: 0.01 };
/** The frequency's slider: log₂(f/F0), from half to double, in quarter octaves. */
export const FREQUENCY = { min: -1, max: 1, step: 0.25 };
/** Where the figure opens: the window 0.03λ to 3λ at 1 Hz, paused, with the probe at kr = 0.3. */
export const OPENING = { from: Math.log10(0.03), octaves: 0, kr: 0.3 };

// --- the source and its edge -------------------------------------------------------------------------------------

/** The frequency, Hz, so many octaves from F0. */
export const frequency = (octaves: number) => F0 * 2 ** octaves;
/** The wavelength c/f, m. */
export const wavelength = (f: number) => C / f;
/** The wavenumber k = ω/c = 2πf/c, per metre. */
export const wavenumber = (f: number) => (2 * Math.PI * f) / C;
/** The distance at which the two parts are equal: r = 1/k = c/2πf = λ/2π. */
export const boundary = (k: number) => 1 / k;
/** The same from the frequency, m. */
export const edge = (f: number) => boundary(wavenumber(f));

// --- the field and its slope, exactly -----------------------------------------------------------------------------

/** The phase kr − ωt. */
export const phase = (r: number, k: number, wt: number) => k * r - wt;

/** The field u = Re[e^{i(kr − ωt)}]/r. */
export const field = (r: number, k: number, wt: number) => Math.cos(phase(r, k, wt)) / r;

/** The near part of the slope, −Re[e^{i(kr − ωt)}]/r². */
export const nearPart = (r: number, k: number, wt: number) => -Math.cos(phase(r, k, wt)) / (r * r);

/** The wave part of the slope, Re[ik e^{i(kr − ωt)}]/r = −k sin(kr − ωt)/r. */
export const wavePart = (r: number, k: number, wt: number) => (-k * Math.sin(phase(r, k, wt))) / r;

/** The slope ∂u/∂r, the sum of the two parts. */
export const slope = (r: number, k: number, wt: number) => nearPart(r, k, wt) + wavePart(r, k, wt);

/** The sizes of the two parts, their amplitudes over a cycle: 1/r² and k/r. */
export const nearSize = (r: number) => 1 / (r * r);
export const waveSize = (r: number, k: number) => k / r;

/** The same in units of k², as functions of kr alone: 1/(kr)² and 1/kr. Their ratio, wave over near, is kr. */
export const nearSizeK2 = (kr: number) => 1 / (kr * kr);
export const waveSizeK2 = (kr: number) => 1 / kr;
export const ratio = (kr: number) => waveSizeK2(kr) / nearSizeK2(kr);

/**
 * What the figure draws, each part multiplied by r², as functions of kr and ωt alone: the near part −cos(kr − ωt),
 * of envelope 1, and the wave part −kr sin(kr − ωt), of envelope kr; and their sum. The field is drawn multiplied
 * by r, cos(kr − ωt), of envelope 1.
 */
export const drawnNear = (kr: number, wt: number) => -Math.cos(kr - wt);
export const drawnWave = (kr: number, wt: number) => -kr * Math.sin(kr - wt);
export const drawnSlope = (kr: number, wt: number) => drawnNear(kr, wt) + drawnWave(kr, wt);
export const drawnField = (kr: number, wt: number) => Math.cos(kr - wt);
/** The envelopes of the drawn parts and of their sum: 1, kr and √(1 + (kr)²). */
export const envelope = (kr: number) => ({ near: 1, wave: kr, sum: Math.hypot(1, kr) });

// --- the timing at one distance ------------------------------------------------------------------------------------

const turn = (a: number) => ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

/**
 * The source's phase ωt, in [0, 2π), at which each part reaches its peak at a distance where the delay is kr
 * radians. The source b = cos ωt peaks at ωt = 0. The near part −cos(kr − ωt) peaks at ωt = kr + π: the delay kr,
 * and half a cycle for its sign, since the slope of 1/r is negative. The wave part −kr sin(kr − ωt) peaks at
 * ωt = kr + π/2, a quarter cycle sooner.
 */
export const peaks = (kr: number) => ({
	source: 0,
	near: turn(kr + Math.PI),
	wave: turn(kr + Math.PI / 2)
});

/** How far the wave part's peaks lead the near part's, in cycles: a quarter, at every distance. */
export const LEAD = 0.25;

/** The delay r/c in cycles of the source, kr/2π. */
export const delayCycles = (kr: number) => kr / (2 * Math.PI);

// --- every derivative behaves alike --------------------------------------------------------------------------------

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** Where the near and wave terms of the n-th derivative of e^{ikr}/r are equal: (kr)ⁿ = n!. */
export const crossing = (n: number) => factorial(n) ** (1 / n);

// --- the window ----------------------------------------------------------------------------------------------------

/**
 * The window's inner end, as log₁₀ of metres over LAMBDA0, made to fit at a frequency so many octaves from F0: the
 * same metres if the window then lies inside 0.01λ to 10λ, and otherwise the nearest window that does.
 */
export function fitWindow(inner: number, octaves: number) {
	const shift = octaves * Math.log10(2);
	const from = Math.min(RANGE.max, Math.max(RANGE.min, inner + shift));
	return from - shift;
}

/** The window's inner end in wavelengths of the frequency now, log₁₀, from its place in metres. */
export const windowFrom = (inner: number, octaves: number) => inner + octaves * Math.log10(2);

/** kr at a distance given as log₁₀ of metres over LAMBDA0, at so many octaves from F0. */
export const krAt = (place: number, octaves: number) => 2 * Math.PI * 10 ** place * 2 ** octaves;

/** The distance, as log₁₀ of metres over LAMBDA0, at which kr has a value. */
export const placeOf = (kr: number, octaves: number) =>
	Math.log10(kr / (2 * Math.PI)) - octaves * Math.log10(2);
