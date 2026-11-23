/** Waiting times as the demos print them. */
import { describe, expect, it } from 'vitest';
import { area, duration, grouped, tidal, texNumber, texWait, times } from './format';

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

describe('an area', () => {
	it('is in the unit that suits it, to two figures', () => {
		expect(area(1e-4)).toBe('1 cm²');
		expect(area(3.2e-3)).toBe('32 cm²');
		expect(area(1)).toBe('1 m²');
		expect(area(10 ** 2.5)).toBe('320 m²');
		expect(area(1800)).toBe('1,800 m²');
		expect(area(1e6)).toBe('1 km²');
	});
});

describe('a number for a reader', () => {
	it('is plain in the middle, a power of ten outside it, and never e-notation', () => {
		expect(texNumber(316.2)).toBe('316');
		expect(texNumber(3013.4)).toBe('3013');
		expect(texNumber(0.0423)).toBe('0.042');
		expect(texNumber(4.16)).toBe('4.2');
		expect(texNumber(2.43e-6)).toBe('2.4 \\times 10^{-6}');
		expect(texNumber(1e5)).toBe('10^{5}');
		expect(texNumber(1.2e5)).toBe('1.2 \\times 10^{5}');
		// a mantissa that rounds up to ten moves to the next power
		expect(texNumber(9.97e-9)).toBe('10^{-8}');
		expect(texNumber(-3.1e-7)).toBe('-3.1 \\times 10^{-7}');
		expect(texNumber(0)).toBe('0');
	});

	it('a count is grouped, to two figures beyond a thousand', () => {
		expect(grouped(316.2)).toBe('316');
		expect(grouped(1000)).toBe('1,000');
		expect(grouped(316228)).toBe('320,000');
		expect(grouped(1e6)).toBe('1,000,000');
	});
});
