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
	return `${Math.round(m)} m`;
}
