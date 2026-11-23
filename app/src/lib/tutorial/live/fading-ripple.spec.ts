/** Chapter 2.7's fading ripple: the chapter's numbers, the squaring on doubling, and the three readings' scalings. */
import { describe, expect, it } from 'vitest';
import {
	G,
	LADDER,
	OPENING,
	READINGS,
	SIGMA1,
	amplitudeLog10,
	bestSpacing,
	decadeAxis,
	fade,
	fadeDecades,
	factorLog10,
	kzOfPi,
	length,
	lengthAbout,
	printed,
	shape,
	tex,
	text,
	wavenumber
} from './fading-ripple';

describe('the chapter’s numbers', () => {
	it('crests 10 cm apart have k = 2π/0.1 m = 62.8 per metre', () => {
		expect(wavenumber(0.1)).toBeCloseTo(62.83, 2);
		expect(text(Math.log10(wavenumber(0.1)))).toBe('62.8');
	});

	it('at 10 cm, kz = 2π and the ripple is 535 times weaker', () => {
		const k = wavenumber(0.1);
		expect(k * 0.1).toBeCloseTo(2 * Math.PI, 12);
		expect(Math.exp(k * 0.1)).toBeCloseTo(535.49, 2);
		expect(text(fadeDecades(k, 0.1))).toBe('535');
		expect(tex(fadeDecades(k, 0.1))).toBe('535');
		expect(kzOfPi(0.1, 0.1)).toBe('2\\pi');
	});

	it('at 20 cm, kz = 4π and the ripple is 2.9 × 10⁵ times weaker', () => {
		const k = wavenumber(0.1);
		expect(Math.exp(k * 0.2)).toBeCloseTo(286751, 0);
		expect(text(fadeDecades(k, 0.2))).toBe('2.9 × 10⁵');
		expect(tex(fadeDecades(k, 0.2))).toBe('2.9 \\times 10^{5}');
		expect(kzOfPi(0.1, 0.2)).toBe('4\\pi');
	});

	it('crests 1 m apart seen from 1 m fade by 535 again: only kz enters', () => {
		expect(text(fadeDecades(wavenumber(1), 1))).toBe('535');
		for (const s of [0.01, 0.1, 1, 1000])
			expect(fade(wavenumber(s), s)).toBeCloseTo(Math.exp(-2 * Math.PI), 14);
	});

	it('the uneven floor: crests 1 m apart, 1.5 m below, σ₁ = 24 kg m⁻², gives kz = 9.4, a fade of 8.1 × 10⁻⁵ and a tide of 5.1 × 10⁻¹² s⁻²', () => {
		expect(SIGMA1).toBe(24);
		const k = wavenumber(1);
		expect(k).toBeCloseTo(6.28, 2);
		expect(k * 1.5).toBeCloseTo(9.42, 2);
		expect(text(-fadeDecades(k, 1.5))).toBe('8.1 × 10⁻⁵');
		expect(text(amplitudeLog10('tide', k, 1.5))).toBe('5.1 × 10⁻¹²');
		expect(10 ** amplitudeLog10('tide', k, 1.5)).toBeCloseTo(
			2 * Math.PI * G * k * 24 * Math.exp(-k * 1.5),
			25
		);
	});

	it('the floor of 720 kg m⁻² pulls with 2πGσ = 3.0 × 10⁻⁷ m s⁻², the pull of a very broad ripple', () => {
		expect(text(amplitudeLog10('pull', 1e-9, 0, 720))).toBe('3.0 × 10⁻⁷');
		// the pull of a ripple tends to that of a uniform sheet as k → 0
		expect(10 ** amplitudeLog10('pull', 1e-9, 1, 720)).toBeCloseTo(2 * Math.PI * G * 720, 15);
	});

	it('the best-seen ripples of a scene a metre below have crests 6.3 m apart', () => {
		expect(lengthAbout(bestSpacing(1))).toBe('6.3\u00a0m');
		expect(lengthAbout(bestSpacing(0.1))).toBe('63\u00a0cm');
	});

	it('crests 10 cm apart seen from a metre need e^{20π} = 1.9 × 10²⁷', () => {
		expect(text(fadeDecades(wavenumber(0.1), 1))).toBe('1.9 × 10²⁷');
	});
});

describe('doubling the height squares the fade', () => {
	for (const s of LADDER)
		for (const z of [0.01, 0.1, 0.5, 1, 2])
			it(`crests ${length(s)} apart, ${length(z)} and ${length(2 * z)}`, () => {
				const k = wavenumber(s);
				expect(fadeDecades(k, 2 * z)).toBeCloseTo(2 * fadeDecades(k, z), 9);
				// the same for every reading: its own power of k cancels between the two heights
				for (const r of READINGS)
					expect(factorLog10(r, k, z) - factorLog10(r, k, 2 * z)).toBeCloseTo(fadeDecades(k, z), 9);
			});

	it('is not halving: 535 becomes 2.9 × 10⁵, not 1070', () => {
		const k = wavenumber(0.1);
		expect(10 ** fadeDecades(k, 0.2)).toBeCloseTo((10 ** fadeDecades(k, 0.1)) ** 2, 4);
		expect(10 ** fadeDecades(k, 0.2)).toBeGreaterThan(100 * 2 * 535);
	});
});

describe('the three readings scale by k⁻¹, 1 and k', () => {
	for (const s of [0.01, 0.1, 1, 2])
		for (const z of [0.01, 0.1, 2])
			it(`crests ${length(s)} apart at ${length(z)}`, () => {
				const k = wavenumber(s);
				const pull = factorLog10('pull', k, z);
				expect(factorLog10('potential', k, z) - pull).toBeCloseTo(-Math.log10(k), 10);
				expect(factorLog10('tide', k, z) - pull).toBeCloseTo(Math.log10(k), 10);
				expect(pull).toBeCloseTo(Math.log10(2 * Math.PI * G) - k * z * Math.LOG10E, 10);
			});

	it('at a fixed height, q⁻¹e^{1−q}, e^{1−q} and q e^{1−q}, all 1 at q = 1, the tide’s a peak there', () => {
		for (const r of READINGS) expect(shape(r, 1)).toBeCloseTo(1, 14);
		expect(shape('tide', 0)).toBe(0);
		for (const q of [0.5, 0.9, 1.1, 2]) expect(shape('tide', q)).toBeLessThan(1);
		expect(shape('pull', 0)).toBeCloseTo(Math.E, 14);
		expect(shape('potential', 0.01)).toBeGreaterThan(100);
	});
});

describe('printing', () => {
	it('never prints Infinity or 0 at the ends of the sliders', () => {
		const k = wavenumber(0.01);
		const big = fadeDecades(k, 2); // e^{1257}
		expect(Math.exp(k * 2)).toBe(Infinity);
		expect(text(big)).toBe('5.6 × 10⁵⁴⁵');
		expect(text(amplitudeLog10('potential', k, 2))).toMatch(/^\d\.\d × 10⁻[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/u);
		expect(text(fadeDecades(wavenumber(2), 0.01))).toBe('1.03');
	});

	it('carries a mantissa that rounds up to the next power', () => {
		expect(printed(Math.log10(9.96e5))).toEqual({ mantissa: '1.0', exponent: 6 });
		expect(text(Math.log10(999.7))).toBe('1000');
		expect(text(Math.log10(1071))).toBe('1070');
		expect(text(Math.log10(9996))).toBe('1.0 × 10⁴');
		expect(text(Math.log10(0.5))).toBe('5.0 × 10⁻¹');
		expect(text(Math.log10(1.1))).toBe('1.10');
		expect(text(Math.log10(2.9e5), true)).toBe('2.9×10⁵');
	});

	it('prints the slider’s lengths', () => {
		expect(LADDER[0]).toBe(0.01);
		expect(LADDER[LADDER.length - 1]).toBe(2);
		expect(LADDER).toContain(OPENING.spacing);
		expect(LADDER).toContain(2 * OPENING.height);
		expect(LADDER.map(length)).toContain('1.2\u00a0cm');
		expect(length(0.1)).toBe('10\u00a0cm');
		expect(length(1.5)).toBe('1.5\u00a0m');
	});

	it('names kz as a multiple of π only when it is one', () => {
		expect(kzOfPi(0.2, 0.1)).toBe('\\pi');
		expect(kzOfPi(0.1, 0.15)).toBe('3\\pi');
		expect(kzOfPi(0.12, 0.1)).toBeUndefined();
	});

	it('steps a logarithmic axis by 1, 2 or 5 decades times a power of ten, in at most four steps', () => {
		expect(decadeAxis(0.04)).toEqual({ step: 1, bottom: -1, ticks: [0, -1] });
		expect(decadeAxis(8.19).ticks).toEqual([0, -5, -10]);
		expect(decadeAxis(1637.6)).toEqual({
			step: 500,
			bottom: -2000,
			ticks: [0, -500, -1000, -1500, -2000]
		});
		for (const d of [0.1, 1, 2.7, 13, 99, 400, 1637]) {
			const a = decadeAxis(d);
			expect(a.bottom).toBeLessThanOrEqual(-d);
			expect(a.ticks.length).toBeLessThanOrEqual(5);
		}
	});
});
