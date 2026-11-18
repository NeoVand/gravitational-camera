/** Waiting times as the demos print them. */
import { describe, expect, it } from 'vitest';
import { duration, tidal, texWait, times } from './format';

describe('a waiting time', () => {
	it('keeps a digit after the point under ten seconds, and rounds above', () => {
		// the Sun's core from the Earth: 0.73 gravitons a second on a square metre
		expect(texWait(1 / 0.7334)).toBe('1.4\\ \\text{seconds}');
		expect(texWait(42.4)).toBe('42\\ \\text{seconds}');
		expect(texWait(88_540)).toBe('25\\ \\text{hours}');
	});
});

describe('a tide', () => {
	it('has three figures, a true minus sign and its unit', () => {
		// the Earth's own tide along the vertical, and across it
		expect(tidal(-3.0614683e-6, true)).toBe('−3.06 × 10⁻⁶ s⁻²');
		expect(tidal(1.5307e-6, true)).toBe('+1.53 × 10⁻⁶ s⁻²');
		expect(tidal(1.5307e-6)).toBe('1.53 × 10⁻⁶ s⁻²');
		expect(tidal(12880.26)).toBe('1.29 × 10⁴ s⁻²');
		// a mantissa that rounds up to ten moves to the next power
		expect(tidal(9.996e-10)).toBe('1.00 × 10⁻⁹ s⁻²');
		expect(tidal(0)).toBe('0 s⁻²');
	});

	it('a ratio and a span of time read plainly', () => {
		expect(times(4.16)).toBe('4.2');
		expect(times(329.6)).toBe('330');
		expect(times(196000)).toBe('2.0 × 10⁵');
		expect(duration(442.7)).toBe('7.4 minutes');
		expect(duration(0.0068)).toBe('6.8 ms');
		expect(duration(7.7e14)).toBe('2.4 × 10⁷ years');
	});
});
