/** Chapter 5.5's slab in front of a background, against Planck's law written out and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	C,
	EARTH_TAU,
	GRAVITY_TAU,
	HBAR,
	KB,
	OMEGA,
	OPENING,
	PRESETS,
	STEEL_TAU,
	TAU,
	TEMPERATURE,
	THICK,
	THIN,
	absorbed,
	contrast,
	grey,
	hidesNothing,
	level,
	numberTex,
	numberText,
	percent,
	planck,
	presetOf,
	reading,
	temperatureOf
} from './radiative-transfer';

const three = (x: number) => Number(x.toPrecision(3));

/** Planck's law as the chapter prints it, B_ω(T) = ħω³/(4π³c²) · 1/(e^{ħω/k_BT} − 1), with ω given. */
const planckDirect = (omega: number, T: number) =>
	((HBAR * omega ** 3) / (4 * Math.PI ** 3 * C ** 2)) *
	(1 / (Math.exp((HBAR * omega) / (KB * T)) - 1));

describe('the frequency and the Planck radiance', () => {
	it('is taken at ħω = 2.82 k_B × 300 K: ω = 1.11 × 10¹⁴ s⁻¹, 17.6 THz', () => {
		expect((HBAR * OMEGA) / (KB * 300)).toBeCloseTo(2.82, 12);
		expect(three(OMEGA)).toBe(1.11e14);
		expect(three(OMEGA / (2 * Math.PI) / 1e12)).toBe(17.6);
	});

	it("agrees with the chapter's law written out, at every temperature of the sliders", () => {
		for (let T = TEMPERATURE.low; T <= TEMPERATURE.high; T += 7) {
			expect(planck(T) / planckDirect(OMEGA, T)).toBeCloseTo(1, 12);
		}
	});

	it('has the values the figure shows', () => {
		expect(three(planck(300))).toBe(8.15e-13);
		expect(three(planck(293))).toBe(7.59e-13);
		expect(three(planck(600))).toBe(4.15e-12);
		expect(three(planck(1500))).toBe(1.7e-11);
		expect(three(planck(50))).toBe(5.76e-19);
		expect(three(planck(3000))).toBe(3.95e-11);
	});

	it('rises with the temperature', () => {
		for (let T = TEMPERATURE.low; T < TEMPERATURE.high; T += 1) {
			expect(planck(T + 1)).toBeGreaterThan(planck(T));
		}
	});
});

describe('the slab', () => {
	it('gives I = I_bg e^{−τ} + B(1 − e^{−τ}), at ordinary depths, both ways', () => {
		for (const tau of [0.01, 0.1, 1, 3, 10, 100]) {
			for (const [slab, bg] of [
				[600, 300],
				[293, 1500],
				[300, 300],
				[50, 3000]
			]) {
				const r = reading(tau, slab, bg);
				const direct = planck(bg) * Math.exp(-tau) + planck(slab) * (1 - Math.exp(-tau));
				expect(r.I / direct).toBeCloseTo(1, 12);
				expect((r.bgShare + r.glowShare) / r.I).toBeCloseTo(1, 12);
				expect(r.change).toBeCloseTo((direct - planck(bg)) / planck(bg), 10);
			}
		}
	});

	it('at the opening, τ = 1, passes 37% of the background and shows 63% of B', () => {
		const r = reading(OPENING.tau, OPENING.slab, OPENING.bg);
		expect(r.t.toFixed(2)).toBe('0.37');
		expect(r.q.toFixed(2)).toBe('0.63');
		expect(three(r.I)).toBe(2.92e-12);
		expect(three(r.change)).toBe(2.59);
	});

	it('never leaves the range between I_bg and B: the bar never outgrows its scale', () => {
		for (let lt = TAU.low; lt <= TAU.high; lt += 0.5) {
			const r = reading(10 ** lt, 600, 300);
			expect(r.I).toBeGreaterThanOrEqual(r.bg);
			expect(r.I).toBeLessThanOrEqual(r.B * (1 + 1e-15));
		}
	});
});

describe('the tiny difference at τ = 10⁻³⁷', () => {
	it('is lost by the naive subtraction, and kept by expm1', () => {
		const tau = STEEL_TAU;
		const naiveQ = 1 - Math.exp(-tau);
		expect(naiveQ).toBe(0);
		expect(absorbed(tau)).toBe(tau);
		const r = reading(tau, 293, 1500);
		expect(r.I - r.bg).toBe(0); // the subtraction finds nothing
		expect(r.change).not.toBe(0);
	});

	it('gives (I − I_bg)/I_bg = (B/I_bg − 1)(1 − e^{−τ}) = −1.1 × 10⁻³⁷ for the steel preset', () => {
		const { tau, slab, bg } = PRESETS.steel;
		const r = reading(tau, slab, bg);
		const k = planck(slab) / planck(bg) - 1;
		expect(r.contrast / k).toBeCloseTo(1, 12);
		expect(three(r.contrast)).toBe(-0.955);
		expect(r.change / (k * tau)).toBeCloseTo(1, 12);
		expect(three(r.change)).toBe(-1.15e-37);
		expect(numberText(r.change)).toBe('−1.1 × 10⁻³⁷');
		expect(numberTex(r.change)).toBe('-1.1 \\times 10^{-37}');
	});

	it('finds B/I_bg − 1 without cancellation when the temperatures are a kelvin apart', () => {
		const k = contrast(301, 300);
		const exact = planck(301) / planck(300) - 1;
		expect(k / exact).toBeCloseTo(1, 9);
		expect(contrast(300, 300)).toBe(0);
	});
});

describe('the presets', () => {
	it('"fog in light" is τ = 3 at 300 K both sides, and is invisible', () => {
		const { tau, slab, bg } = PRESETS.fog;
		expect(presetOf(PRESETS.fog)).toBe('fog');
		const r = reading(tau, slab, bg);
		expect(r.change).toBe(0);
		expect(r.I).toBe(r.bg);
		expect(r.t.toFixed(3)).toBe('0.050');
	});

	it('"steel in gravity" is a metre of the placeholder, 293 K, in front of 1500 K', () => {
		expect(presetOf(PRESETS.steel)).toBe('steel');
		expect(PRESETS.steel).toEqual({ tau: 1.2e-37, slab: 293, bg: 1500 });
		expect(three(planck(293) / planck(1500))).toBe(0.0447);
		expect(hidesNothing(PRESETS.steel)).toBe(true);
	});

	it('match no other setting', () => {
		expect(presetOf(OPENING)).toBeUndefined();
		expect(presetOf({ ...PRESETS.fog, slab: 301 })).toBeUndefined();
	});
});

describe('the first prediction: a slab as warm as its background', () => {
	it('changes nothing from transparent to opaque, while the two shares trade places', () => {
		for (const T of [50, 300, 1500, 3000]) {
			const thin = reading(THIN, T, T);
			const thick = reading(THICK, T, T);
			for (let lt = TAU.low; lt <= TAU.high; lt += 0.25) {
				const r = reading(10 ** lt, T, T);
				expect(r.change).toBe(0);
				expect(r.I).toBe(r.bg);
			}
			expect(thin.bgShare / thin.I).toBeGreaterThan(0.99);
			expect(thick.glowShare / thick.I).toBeGreaterThan(0.9999);
		}
		expect(percent(reading(THIN, 300, 300).t)).toBe('99.0%');
		expect(percent(reading(THIN, 300, 300).q)).toBe('0.995%');
		expect(percent(reading(THICK, 300, 300).t)).toBe('0.0045%');
		expect(percent(reading(THICK, 300, 300).q)).toBe('99.9955%');
	});
});

describe('the second prediction: a cold slab in gravity', () => {
	it('is answered at τ = 10⁻³⁰ and at the Earth’s 1.6 × 10⁻³⁰, not at 10⁻²⁹', () => {
		expect(hidesNothing({ tau: 1e-30, slab: 293, bg: 1500 })).toBe(true);
		expect(hidesNothing({ tau: EARTH_TAU, slab: 293, bg: 1500 })).toBe(true);
		expect(hidesNothing({ tau: 1e-29, slab: 293, bg: 1500 })).toBe(false);
		expect(hidesNothing({ tau: 1e-30, slab: 1500, bg: 293 })).toBe(false);
		expect(GRAVITY_TAU).toBeGreaterThan(EARTH_TAU);
	});

	it('dims the background by 10⁻³⁰: the pixel reads I_bg(1 − 9.6 × 10⁻³¹)', () => {
		const r = reading(1e-30, 293, 1500);
		expect(r.q).toBe(1e-30);
		expect(three(r.change)).toBe(-9.55e-31);
		expect(numberText(r.change)).toBe('−9.6 × 10⁻³¹');
		// on a bar a few hundred pixels tall the change is some 10⁻²⁸ of a pixel
		expect(Math.abs(r.change) * 300).toBeLessThan(1e-27);
	});
});

describe('the picture and the words', () => {
	it('maps the radiances of the sliders onto lightness from 0 to 1', () => {
		expect(level(planck(TEMPERATURE.low))).toBeCloseTo(0, 12);
		expect(level(planck(TEMPERATURE.high))).toBeCloseTo(1, 12);
		for (const T of [60, 293, 600, 1500, 2900]) {
			expect(temperatureOf(planck(T)) / T).toBeCloseTo(1, 10);
			expect(level(planck(T))).toBeCloseTo(Math.log(T / 50) / Math.log(60), 10);
		}
		expect(level(planck(300))).toBeGreaterThan(level(planck(293)));
		expect(grey(planck(300))).toMatch(/^hsl\(32 10% \d+\.\d%\)$/);
	});

	it('writes numbers with true minus signs and zero as 0', () => {
		expect(numberText(0)).toBe('0');
		expect(numberText(0.36787944)).toBe('0.37');
		expect(numberText(1.2e-37)).toBe('1.2 × 10⁻³⁷');
		expect(numberText(1e-30)).toBe('10⁻³⁰');
		expect(numberTex(8.147e-13, 3)).toBe('8.15 \\times 10^{-13}');
		expect(numberTex(-0.9553, 3)).toBe('-0.955');
	});
});
