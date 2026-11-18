/** Numbers of the camera's work as text, each with its unit. */
import { sci } from '../ui/format';

/** A mass and its error with digits to suit the error: "383 ± 729 kg", "317 ± 16 kg", "327.66 ± 0.02 kg". */
export function massWithError(mass: number, error: number): string {
	const digits = error >= 9.95 || error === 0 ? 0 : error >= 0.995 ? 1 : error >= 0.0995 ? 2 : 3;
	const text = (v: number) => {
		const s = Math.abs(v).toFixed(digits);
		return (v < 0 && Number(s) !== 0 ? '−' : '') + s;
	};
	return `${text(mass)} ± ${Math.abs(error).toFixed(digits)} kg`;
}

const raised = (n: number) =>
	String(n).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);

/** Ten to a whole power, however large: "10¹⁷⁸³", and past five figures "10ⁿ with n = 1.8 × 10⁹". */
const tenTo = (power: number) =>
	power < 99999.5 ? `10${raised(Math.round(power))}` : `10ⁿ with n = ${sci(power)}`;

/**
 * A chance of error from its base-ten logarithm: "46%", "18%", "1.8%", "0.10%", then "1 in 2.4 × 10⁵", and, past
 * what a number can hold, "1 in 10¹⁷⁸³".
 */
export function chance(log10p: number): string {
	if (log10p < -15) return `1 in ${tenTo(-log10p)}`;
	const p = 10 ** log10p;
	if (p >= 0.0995) return `${(100 * p).toFixed(0)}%`;
	if (p >= 0.00995) return `${(100 * p).toFixed(1)}%`;
	if (p >= 0.000995) return `${(100 * p).toFixed(2)}%`;
	const one = 1 / p;
	return `1 in ${one < 9950 ? Math.round(one).toLocaleString('en-US') : sci(one)}`;
}

/** A count of standard deviations: "0.58", "1.81", "181", "1.8 × 10⁵"; below a thousandth, "0.000". */
export function deviations(d: number): string {
	if (d < 0.0005) return '0.000';
	if (d < 9.995) return d.toFixed(2);
	if (d < 99.95) return d.toFixed(1);
	if (d < 9999.5) return d.toFixed(0);
	return sci(d);
}

/** A likelihood ratio from its natural logarithm: "2.2 to 1", "440 to 1", "10⁷⁰¹⁷ to 1". */
export function odds(logRatio: number): string {
	const decades = logRatio / Math.LN10;
	if (decades >= 4) return `${tenTo(decades)} to 1`;
	const r = Math.exp(logRatio);
	return `${r < 9.95 ? r.toFixed(1) : Math.round(r).toLocaleString('en-US')} to 1`;
}

/** A signal-to-noise ratio: "1", "34", "1,000", "1.0 × 10⁶". */
export function ratio(snr: number): string {
	if (snr < 9.95) return snr.toFixed(1).replace(/\.0$/, '');
	if (snr < 9999.5) return Math.round(snr).toLocaleString('en-US');
	return sci(snr);
}

/** A scale's end, rounded up to two figures so that nothing is clipped: 1.234e-9 gives 1.3e-9. */
export function roundUp(x: number): number {
	if (!(x > 0)) return 1;
	const e = Math.floor(Math.log10(x));
	const unit = 10 ** (e - 1);
	return Math.ceil(x / unit - 1e-9) * unit;
}

// --- colours -------------------------------------------------------------------------------------------------------------

export type Rgb = [number, number, number];

/** The panel a map sits on: a value of zero is drawn in it. */
export const GROUND: Rgb = [16, 19, 25];
/** Readings: orange for a stretch (negative), blue for a squeeze (positive), as everywhere on the site. */
export const STRETCH: Rgb = [232, 164, 90];
export const SQUEEZE: Rgb = [127, 180, 255];
/** Mass: gold above zero, violet below. */
export const MASS: Rgb = [242, 196, 86];
export const NEGATIVE: Rgb = [164, 140, 255];
/** Uncertainty: pale, with no hue. */
export const DOUBT: Rgb = [226, 222, 212];

/** The colour a fraction t in [0, 1] of the way from the ground to `full`; beyond one it stays at `full`. */
export const shade = (full: Rgb, t: number): Rgb => {
	const u = Math.max(0, Math.min(1, t));
	return [0, 1, 2].map((k) => Math.round(GROUND[k] + (full[k] - GROUND[k]) * u)) as Rgb;
};

/** A value against a scale's end: `below` for negative values, `above` for positive, the ground at zero. */
export const diverging = (below: Rgb, above: Rgb, value: number, end: number): Rgb =>
	value < 0 ? shade(below, -value / end) : shade(above, value / end);

export const css = (c: Rgb) => `rgb(${c[0]} ${c[1]} ${c[2]})`;
