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
	if (seconds < 120) return `${seconds.toFixed(0)}\\ \\text{seconds}`;
	if (seconds < 7200) return `${(seconds / 60).toFixed(0)}\\ \\text{minutes}`;
	if (seconds < 172800) return `${(seconds / 3600).toFixed(0)}\\ \\text{hours}`;
	if (seconds < 2 * year) return `${(seconds / 86400).toFixed(0)}\\ \\text{days}`;
	return `${texSci(seconds / year)}\\ \\text{years}`;
}
