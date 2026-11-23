/** Small helpers for showing numbers in the interface. */

export const superscript = (n: number) =>
	String(n).replace(/[-0-9.]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹·'['-0123456789.'.indexOf(c)]);

/** A number as "1.2 × 10⁵". */
export function sci(x: number): string {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	return `${(x / 10 ** e).toFixed(1)} × 10${superscript(e)}`;
}

/** A length in metres, as kilometres once it is large. */
export const km = (m: number) =>
	m >= 1e6 ? `${Math.round(m / 1e3).toLocaleString('en-US')} km` : `${Math.round(m)} m`;

/** A length in metres, in the unit that suits it. */
export function length(m: number): string {
	if (m < 0.995) return `${Math.round(m * 100)} cm`;
	if (m < 10) return `${m.toFixed(1)} m`;
	if (m < 1e4) return `${Math.round(m)} m`;
	return `${Math.round(m / 1e3).toLocaleString('en-US')} km`;
}

/** A number as LaTeX, "1.2 \times 10^{5}" (plain below a thousand). */
export function texSci(x: number, digits = 1): string {
	if (x === 0) return '0';
	const e = Math.floor(Math.log10(Math.abs(x)));
	if (e >= -2 && e < 3) return x.toFixed(Math.max(0, digits - e));
	return `${(x / 10 ** e).toFixed(digits)} \\times 10^{${e}}`;
}

/** A length as LaTeX with its unit, as `length` chooses it. */
export function texLength(m: number): string {
	const [value, unit] = length(m).split(' ');
	return `${value.replace(/,/g, '{,}')}\\,\\mathrm{${unit}}`;
}

/** A waiting time in seconds, as LaTeX in the unit that suits it. */
export function texWait(seconds: number): string {
	const year = 365.25 * 86400;
	if (!isFinite(seconds)) return '\\infty';
	if (seconds < 10) return `${texSci(seconds)}\\ \\text{seconds}`;
	if (seconds < 120) return `${seconds.toFixed(0)}\\ \\text{seconds}`;
	if (seconds < 7200) return `${(seconds / 60).toFixed(0)}\\ \\text{minutes}`;
	if (seconds < 172800) return `${(seconds / 3600).toFixed(0)}\\ \\text{hours}`;
	if (seconds < 2 * year) return `${(seconds / 86400).toFixed(0)}\\ \\text{days}`;
	return `${texSci(seconds / year)}\\ \\text{years}`;
}

/**
 * A tide in s⁻², to three figures: "−3.06 × 10⁻⁶ s⁻²". With `signed`, a plus goes before a positive value, since
 * the sign says which way the field acts: negative stretches, positive squeezes.
 */
export function tidal(x: number, signed = false): string {
	if (x === 0) return '0 s⁻²';
	let e = Math.floor(Math.log10(Math.abs(x)));
	let mantissa = (Math.abs(x) / 10 ** e).toFixed(2);
	if (mantissa === '10.00') {
		e += 1;
		mantissa = '1.00';
	}
	const sign = x < 0 ? '−' : signed ? '+' : '';
	return `${sign}${mantissa} × 10${superscript(e)} s⁻²`;
}

/** How many times: "4.2", "330", "2.0 × 10⁵". */
export function times(x: number): string {
	if (x >= 9.95e3 || x < 0.995) return sci(x);
	if (x < 9.95) return x.toFixed(1);
	return Math.round(x).toLocaleString('en-US');
}

/** A span of time in seconds, in the unit that suits it: "6.8 ms", "7.4 minutes", "21 days", "2.5 × 10⁷ years". */
export function duration(seconds: number): string {
	const year = 365.25 * 86400;
	const two = (v: number) => (v < 9.95 ? v.toFixed(1) : v.toFixed(0));
	if (seconds < 1e-3) return `${sci(seconds)} s`;
	if (seconds < 1) return `${two(seconds * 1e3)} ms`;
	if (seconds < 120) return `${two(seconds)} s`;
	if (seconds < 7200) return `${two(seconds / 60)} minutes`;
	if (seconds < 172800) return `${two(seconds / 3600)} hours`;
	if (seconds < 2 * year) return `${two(seconds / 86400)} days`;
	if (seconds < 1e4 * year) return `${two(seconds / year)} years`;
	return `${sci(seconds / year)} years`;
}

/** A number to two figures, plainly: "3.2", "45", "320", "1,800". */
const twoFigures = (x: number) =>
	x >= 99.5
		? Number(x.toPrecision(2)).toLocaleString('en-US')
		: x.toPrecision(2).replace(/\.0$/, '');

/** An area in square metres, in the unit that suits it: "4 cm²", "1 m²", "320 m²", "1 km²". */
export function area(m2: number): string {
	if (m2 < 0.0995) return `${twoFigures(m2 * 1e4)} cm²`;
	if (m2 < 9.95e4) return `${twoFigures(m2)} m²`;
	return `${twoFigures(m2 / 1e6)} km²`;
}

/**
 * A number for a reader, as LaTeX: plain from a hundredth up to ten thousand ("0.042", "316", "3013"), and outside
 * that in powers of ten ("2.4 \times 10^{-6}", "1.2 \times 10^{5}"), a mantissa of one left out ("10^{5}"). Never a
 * computer's "2.4e-6". `figures` is the number of significant figures kept below a hundred and in a mantissa.
 */
export function texNumber(x: number, figures = 2): string {
	if (x === 0) return '0';
	if (!Number.isFinite(x)) return x > 0 ? '\\infty' : '-\\infty';
	const sign = x < 0 ? '-' : '';
	const a = Math.abs(x);
	if (a >= 0.01 && a < 1e4) {
		if (a >= 10 ** (figures - 1)) return sign + String(Math.round(a));
		return sign + String(Number(a.toPrecision(figures)));
	}
	let e = Math.floor(Math.log10(a));
	let mantissa = (a / 10 ** e).toFixed(Math.max(0, figures - 1));
	if (Number(mantissa) >= 10) {
		e += 1;
		mantissa = (1).toFixed(Math.max(0, figures - 1));
	}
	return Number(mantissa) === 1 ? `${sign}10^{${e}}` : `${sign}${mantissa} \\times 10^{${e}}`;
}

/** A count in plain digits, to two significant figures beyond a thousand, grouped by commas: "316", "1,000", "320,000". */
export function grouped(x: number): string {
	const n = Math.abs(x) >= 1000 ? Number(x.toPrecision(2)) : Math.round(x);
	return n.toLocaleString('en-US');
}
