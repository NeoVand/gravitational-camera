/**
 * Chapter 8.3's ladder oscillator: one oscillator in units of ħω, with z = ħω/k_BT the step over the thermal energy.
 * In thermal equilibrium the level n has the probability P(n) = (1 − e^{−z})e^{−nz}, the mean number of quanta is
 * n̄ = 1/(e^z − 1), and the mean energy, zero point included, is ⟨E⟩ = ħω(n̄ + ½), so ⟨E⟩/k_BT = (z/2)coth(z/2). A
 * coherent state with the mean n̄ has the Poisson distribution P(n) = e^{−n̄}n̄ⁿ/n! (chapter 8.5 derives it).
 *
 * The figure draws the phase plane in the chapter's scaled axes x/x_zp across and p/(mωx_zp) up, in which the ground
 * state's bell has the standard deviation 1 in each direction, the operator a is (x/x_zp + ip/(mωx_zp))/2, and the
 * energy is ħω/4 times the squared radius. So the level n's classical orbit has the radius √(2(2n + 1)), a coherent
 * state's centre sits at 2|α| = 2√n̄ and turns clockwise as αe^{−iωt}, its blob keeps the zero point's radius 1, and
 * the thermal state is a disc about the origin of one-standard-deviation radius √(2n̄ + 1). In the left panel the
 * parabola V = ½mω²x² is E/ħω = (x/x_zp)²/4, which meets the level n at the same ±√(2(2n + 1)).
 *
 * Settings, curves, words and the three predictions are pure functions here; the component only draws them.
 */
import { superscript } from '../../ui/format';
import { stepped, type Range } from './near-to-far';

export { stepped, type Range };

// --- the settings ----------------------------------------------------------------------------------------------------

/** log₁₀(k_BT/ħω), whether the coherent state is shown, and the coherent state's n̄. */
export interface Settings {
	lt: number;
	coherent: boolean;
	nbar: number;
}

/**
 * The temperature as log₁₀(k_BT/ħω), from 0.05 to 50: a hundredth of a decade dragged or pressed, a tenth with Shift.
 * The grid lands on k_BT = ħω exactly.
 */
export const TEMP: Range = {
	min: Math.log10(0.05),
	max: Math.log10(50),
	step: 0.01,
	key: 0.01,
	large: 0.1
};

/** The coherent state's n̄, 0 to 20: 0.1 dragged or pressed, 1 with Shift. */
export const NBAR: Range = { min: 0, max: 20, step: 0.1, key: 0.1, large: 1 };

/**
 * The figure opens cold, at k_BT = ħω/2, so that the first prediction, about k_BT = ħω, is not answered before the
 * reader asks it; the coherent state, once switched on, holds four quanta.
 */
export const OPENING: Settings = { lt: Math.log10(0.5), coherent: false, nbar: 4 };

/** The levels drawn, n = 0 to 20. */
export const LEVELS = 20;

/** Seconds on the screen for one turn of the coherent state. */
export const TURN_S = 6;

/** A temperature held to its range and landed on its grid of hundredths of a decade, the two ends kept exact. */
export function snapTemp(v: number): number {
	if (!(v > TEMP.min + TEMP.step / 2)) return TEMP.min;
	if (v >= TEMP.max - TEMP.step / 2) return TEMP.max;
	return Math.round(Math.round(v / TEMP.step) * TEMP.step * 1e9) / 1e9 || 0;
}

/** A coherent n̄ held to its range and its grid of tenths. */
export function snapNbar(v: number): number {
	const c = Math.max(NBAR.min, Math.min(NBAR.max, v));
	return Math.round(Math.round(c / NBAR.step) * NBAR.step * 1e9) / 1e9 || 0;
}

/** k_BT/ħω and z = ħω/k_BT for a slider's log₁₀(k_BT/ħω). */
export const tOf = (lt: number) => 10 ** lt;
export const zOf = (lt: number) => 10 ** -lt;

// --- the thermal oscillator ----------------------------------------------------------------------------------------

/** P(n) = (1 − e^{−z})e^{−nz}. */
export const thermalP = (n: number, z: number) => -Math.expm1(-z) * Math.exp(-n * z);

/** n̄ = 1/(e^z − 1). */
export const thermalNbar = (z: number) => 1 / Math.expm1(z);

/** ⟨E⟩/k_BT = (z/2)coth(z/2), which is z(n̄ + ½); 1 + z²/12 near z = 0. */
export function energyOverKT(z: number): number {
	const u = z / 2;
	if (u < 1e-4) return 1 + (u * u) / 3;
	return u / Math.tanh(u);
}

/** ⟨E⟩/k_BT − 1, the excess over equipartition. */
export const excessOf = (z: number) => energyOverKT(z) - 1;

/** The chapter's first correction to equipartition, (ħω)²/12k_BT, over k_BT: z²/12. */
export const approxExcess = (z: number) => (z * z) / 12;

/** The probability in the levels above n = top: e^{−(top + 1)z}. */
export const thermalAbove = (top: number, z: number) => Math.exp(-(top + 1) * z);

/** The one-standard-deviation radius of the thermal disc in the scaled axes, √(2n̄ + 1) = √coth(z/2). */
export const discRadius = (nbar: number) => Math.sqrt(2 * nbar + 1);

/**
 * The temperature at which ⟨E⟩ is 1% above k_BT, found by bisection: k_BT = 2.88ħω, where n̄ = 2.41. The excess
 * falls as the temperature rises, so the mode is within 1% at every temperature above it.
 */
export function onePercentPoint(share = 0.01) {
	let lo = 0.5;
	let hi = 50;
	for (let i = 0; i < 200; i++) {
		const mid = (lo + hi) / 2;
		if (excessOf(1 / mid) > share) lo = mid;
		else hi = mid;
	}
	const t = (lo + hi) / 2;
	return { t, z: 1 / t, nbar: thermalNbar(1 / t) };
}

// --- the coherent state ----------------------------------------------------------------------------------------------

/** ln n!, summed. */
function lnFactorial(n: number): number {
	let s = 0;
	for (let k = 2; k <= n; k++) s += Math.log(k);
	return s;
}

/** The coherent state's P(n) = e^{−n̄}n̄ⁿ/n!, a Poisson distribution. */
export function poissonP(n: number, nbar: number): number {
	if (nbar <= 0) return n === 0 ? 1 : 0;
	return Math.exp(-nbar + n * Math.log(nbar) - lnFactorial(n));
}

/** The probability in the levels above n = top. */
export function poissonAbove(top: number, nbar: number): number {
	let below = 0;
	for (let n = 0; n <= top; n++) below += poissonP(n, nbar);
	return Math.max(0, 1 - below);
}

/** The radius of the circle the coherent state's centre goes round, 2|α| = 2√n̄. */
export const centreRadius = (nbar: number) => 2 * Math.sqrt(Math.max(0, nbar));

/** The coherent state's blob: one standard deviation of the zero point, in the scaled axes. */
export const BLOB = 1;

/**
 * The coherent state's centre after the phase ωt, in the scaled axes: (2√n̄ cos ωt, −2√n̄ sin ωt), since ⟨a⟩ =
 * αe^{−iωt} with α = √n̄ at the start. It turns clockwise, as the classical cart does with p up.
 */
export function centreAt(nbar: number, phase: number) {
	const r = centreRadius(nbar);
	return { x: r * Math.cos(phase), p: -r * Math.sin(phase) };
}

// --- the levels and the curves ---------------------------------------------------------------------------------------

/** The level n's energy over ħω, n + ½. */
export const levelEnergy = (n: number) => n + 0.5;

/** The level n's classical orbit in the scaled axes, and where it meets the parabola: √(2(2n + 1)). */
export const orbitRadius = (n: number) => Math.sqrt(2 * (2 * n + 1));

/** The parabola E/ħω = (x/x_zp)²/4, at m + 1 points from −span to span. */
export function parabola(span: number, m = 160) {
	return Array.from({ length: m + 1 }, (_, i) => {
		const x = -span + (2 * span * i) / m;
		return { x, e: (x * x) / 4 };
	});
}

/** The ground state's bell |ψ₀|² ∝ e^{−(x/x_zp)²/2}, scaled to the peak 1, at m + 1 points from −span to span. */
export function bell(span = 3.5, m = 120) {
	return Array.from({ length: m + 1 }, (_, i) => {
		const x = -span + (2 * span * i) / m;
		return { x, h: Math.exp((-x * x) / 2) };
	});
}

// --- what the figure shows ---------------------------------------------------------------------------------------

/** The numbers of a state: the thermal oscillator at its temperature, and the coherent state's. */
export function reading(s: Settings) {
	const z = zOf(s.lt);
	const nbarT = thermalNbar(z);
	const levels = Array.from({ length: LEVELS + 1 }, (_, n) => n);
	return {
		t: tOf(s.lt),
		z,
		thermal: {
			nbar: nbarT,
			energy: energyOverKT(z),
			excess: excessOf(z),
			ground: thermalP(0, z),
			p: levels.map((n) => thermalP(n, z)),
			above: thermalAbove(LEVELS, z),
			radius: discRadius(nbarT)
		},
		coherent: {
			nbar: s.nbar,
			/** ⟨E⟩/ħω = n̄ + ½. */
			energy: s.nbar + 0.5,
			ground: poissonP(0, s.nbar),
			p: levels.map((n) => poissonP(n, s.nbar)),
			above: poissonAbove(LEVELS, s.nbar),
			radius: centreRadius(s.nbar)
		}
	};
}

// --- the predictions --------------------------------------------------------------------------------------------

/** The first prediction is answered once the reader has set k_BT = ħω, with the thermal bars shown. */
export const noteFirst = (done: boolean, s: Settings) =>
	done || (!s.coherent && Math.abs(s.lt) < 1e-9);

/** The second, once the mean energy is within 1% of k_BT. */
export const noteSecond = (done: boolean, s: Settings) => done || excessOf(zOf(s.lt)) <= 0.01;

/** The least n̄ at which the third is asked: below it the blob and the disc are both about the zero point. */
export const LEAST = 1;
/** How near the coherent n̄ must be to the thermal one: within 5%, or 0.1, whichever is more. */
export const sameNbar = (coherent: number, thermal: number) =>
	Math.abs(coherent - thermal) <= Math.max(0.1, 0.05 * thermal) + 1e-9;

/** The third, once the coherent state is shown with the thermal state's n̄, at least LEAST. */
export const noteThird = (done: boolean, s: Settings) => {
	if (done) return true;
	const thermal = thermalNbar(zOf(s.lt));
	return s.coherent && thermal >= LEAST - 1e-9 && sameNbar(s.nbar, thermal);
};

// --- the words ------------------------------------------------------------------------------------------------------

/** A number to the given decimals, with a true minus sign and no "−0.000". */
export function fixed(x: number, places = 3): string {
	const f = 10 ** places;
	const r = Math.round(x * f) / f;
	if (r === 0) return (0).toFixed(places);
	return (r < 0 ? '−' : '') + Math.abs(r).toFixed(places);
}

/** k_BT/ħω to three figures: 0.0500, 0.500, 1.00, 2.88, 50.0. */
export const tWords = (t: number) => t.toPrecision(3);

/** A mean number of quanta below a thousandth, as a mantissa to one decimal and a power of ten. */
function smallParts(n: number) {
	let e = Math.floor(Math.log10(n));
	let m = (n / 10 ** e).toFixed(1);
	if (m === '10.0') {
		m = '1.0';
		e += 1;
	}
	return { m, e };
}

/** A mean number of quanta: three figures, or as a power of ten below a thousandth. */
export function nbarWords(n: number): string {
	if (n === 0) return '0';
	if (n < 1e-3) {
		const { m, e } = smallParts(n);
		return `${m} × 10${superscript(e)}`;
	}
	return n.toPrecision(3);
}

/** The same as LaTeX. */
export function texNbar(n: number): string {
	if (n > 0 && n < 1e-3) {
		const { m, e } = smallParts(n);
		return `${m}\\times10^{${e}}`;
	}
	return nbarWords(n);
}

/** A share as a percentage to one decimal, held clear of 0 and 100 when it is not quite either. */
export function percentWords(p: number): string {
	if (p >= 0.9995 && p < 1) return '> 99.9%';
	if (p > 0 && p < 0.0005) return '< 0.1%';
	return `${(100 * p).toFixed(1)}%`;
}

/** The excess over k_BT as a percentage, to two decimals. */
export const excessWords = (x: number) => `${(100 * x).toFixed(2)}%`;
