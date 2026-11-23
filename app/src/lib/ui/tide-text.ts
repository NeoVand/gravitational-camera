import { tidal } from './format';

/**
 * A strength of the tidal field in s⁻², as the field view's scale gives it: plainly, to three figures, between a
 * hundredth and a thousand ("0.793 s⁻²"), and in powers of ten beyond.
 */
export function tideText(x: number): string {
	if (x >= 0.01 && x < 1000) return `${Number(x.toPrecision(3)).toLocaleString('en-US')} s⁻²`;
	return tidal(x);
}
