/** Chapter 4.4's Maxwell liquid, against direct searches and the chapter's numbers. */
import { describe, expect, it } from 'vitest';
import {
	BAND_X,
	COPPER_TAU,
	ETA0,
	ETA_AXIS,
	MU,
	NEAR_CEILING,
	OPENING,
	PEAK_X,
	PLACEHOLDER,
	PRESETS,
	ROOM,
	TEMPERATURE,
	THOUSANDFOLD,
	ceiling,
	friction,
	glow,
	gpa,
	numberTex,
	numberText,
	planck,
	presetOf,
	relaxationTime,
	shareOfCeiling,
	tail,
	terahertz,
	timeWords,
	weight
} from './maxwell-liquid';

/** A number to two figures, as the chapter prints it. */
const two = (x: number) => Number(x.toPrecision(2));
const three = (x: number) => Number(x.toPrecision(3));

describe('the glow', () => {
	it('peaks at x = 2.821, found here by a search over x', () => {
		let best = 2.8;
		for (let x = 2.8; x <= 2.85; x += 1e-6) if (planck(x) > planck(best)) best = x;
		expect(PEAK_X).toBeCloseTo(best, 5);
		expect(PEAK_X.toFixed(3)).toBe('2.821');
	});

	it('is above a tenth of its peak from x = 0.420 to 8.30', () => {
		expect(BAND_X.low.toFixed(3)).toBe('0.420');
		expect(BAND_X.high.toFixed(2)).toBe('8.30');
		const tenth = planck(PEAK_X) / 10;
		expect(planck(BAND_X.low)).toBeCloseTo(tenth, 10);
		expect(planck(BAND_X.high)).toBeCloseTo(tenth, 10);
		expect(planck(BAND_X.low * 0.99)).toBeLessThan(tenth);
		expect(planck(BAND_X.low * 1.01)).toBeGreaterThan(tenth);
		expect(planck(BAND_X.high * 1.01)).toBeLessThan(tenth);
		expect(planck(BAND_X.high * 0.99)).toBeGreaterThan(tenth);
	});

	it('at 293 K spans 1.61 × 10¹³ to 3.18 × 10¹⁴ s⁻¹, 2.6 to 51 THz, its peak at 1.08 × 10¹⁴ s⁻¹, 17 THz', () => {
		const g = glow(ROOM);
		expect(three(g.low)).toBe(1.61e13);
		expect(three(g.high)).toBe(3.18e14);
		expect(three(g.peak)).toBe(1.08e14);
		expect(two(terahertz(g.low))).toBe(2.6);
		expect(two(terahertz(g.high))).toBe(51);
		expect(Math.round(terahertz(g.peak))).toBe(17);
		expect(three(terahertz(g.peak) * 1e12)).toBe(1.72e13);
		expect(three(g.peak ** 2)).toBe(1.17e28);
	});

	it('moves in proportion to the temperature', () => {
		expect(glow(2000).peak / glow(200).peak).toBeCloseTo(10, 12);
	});
});

describe('the friction of a Maxwell liquid', () => {
	it('has the plateau η₀ when slow and the tail μ∞²/η₀ω² when fast', () => {
		const { eta0, mu } = PRESETS.honey;
		const tau = relaxationTime(eta0, mu);
		expect(friction(1e-6 / tau, eta0, mu) / eta0).toBeCloseTo(1, 10);
		const fast = 1e6 / tau;
		expect(friction(fast, eta0, mu) / tail(fast, eta0, mu)).toBeCloseTo(1, 10);
		expect(friction(1 / tau, eta0, mu)).toBeCloseTo(eta0 / 2, 12);
	});

	it('gives the chapter’s numbers for honey and the Maxwell water at the glow’s peak', () => {
		const w = glow(ROOM).peak;
		const honey = PRESETS.honey;
		const water = PRESETS.placeholder;
		expect(relaxationTime(honey.eta0, honey.mu)).toBeCloseTo(1e-8, 20);
		expect(relaxationTime(water.eta0, water.mu)).toBeCloseTo(1e-12, 24);
		expect(two(w * relaxationTime(honey.eta0, honey.mu))).toBe(1.1e6);
		expect(Math.round(w * relaxationTime(water.eta0, water.mu))).toBe(108);
		expect(two(friction(w, honey.eta0, honey.mu))).toBe(8.5e-12);
		expect(two(friction(w, water.eta0, water.mu))).toBe(8.5e-8);
		// honey's lies 10⁸ below the placeholder and the water's 10⁴
		expect(Math.round(Math.log10(PLACEHOLDER / friction(w, honey.eta0, honey.mu)))).toBe(8);
		expect(Math.round(Math.log10(PLACEHOLDER / friction(w, water.eta0, water.mu)))).toBe(4);
	});

	it('of the two crosses at ω = μ∞/√(η_h η_w) = 10¹⁰ s⁻¹, on the placeholder', () => {
		const h = PRESETS.honey;
		const w = PRESETS.placeholder;
		const cross = h.mu / Math.sqrt(h.eta0 * w.eta0);
		expect(cross).toBeCloseTo(1e10, 0);
		expect(friction(cross, h.eta0, h.mu) / friction(cross, w.eta0, w.mu)).toBeCloseTo(1, 12);
		expect(two(friction(cross, h.eta0, h.mu))).toBe(1e-3);
	});

	it('falls a thousandfold, to 8.5 × 10⁻¹⁵ Pa s, when honey is made a thousand times more viscous', () => {
		const w = glow(ROOM).peak;
		const before = friction(w, OPENING.eta0, OPENING.mu);
		const after = friction(w, THOUSANDFOLD.eta0, THOUSANDFOLD.mu);
		expect(before / after).toBeCloseTo(1000, 6);
		expect(two(after)).toBe(8.5e-15);
		expect(Math.log10(THOUSANDFOLD.eta0)).toBe(ETA0.high);
		expect(after).toBeGreaterThan(10 ** ETA_AXIS.low);
	});
});

describe('the weight', () => {
	it('is μ∞ by quadrature, whatever η₀', () => {
		for (const eta0 of [1e-4, 1e-3, 9.5e-4, 1, 10, 1e4])
			for (const mu of [1e8, 1e9, 38e9, 1e11]) expect(weight(eta0, mu) / mu).toBeCloseTo(1, 9);
	});

	it('agrees with a plain sum over ω for honey', () => {
		const { eta0, mu } = PRESETS.honey;
		const tau = relaxationTime(eta0, mu);
		// the midpoint rule in ω, out to 10⁶/τ, and the tail's own area beyond it, (2/π) μ∞²/η₀ω
		const top = 1e6 / tau;
		const n = 2_000_000;
		const h = top / n;
		let s = 0;
		for (let i = 0; i < n; i++) s += friction((i + 0.5) * h, eta0, mu) * h;
		const area = (2 / Math.PI) * (s + (mu * mu) / (eta0 * top));
		expect(area / mu).toBeCloseTo(1, 4);
	});
});

describe('the ceiling', () => {
	it('is the most friction any τ gives, μ∞/2ω, at ωτ = 1, found here by a search over τ', () => {
		const w = glow(ROOM).peak;
		const mu = PRESETS.copper.mu;
		let best = { tau: 0, f: 0 };
		for (let lt = -17; lt <= -12; lt += 1e-5) {
			const tau = 10 ** lt;
			const f = friction(w, mu * tau, mu);
			if (f > best.f) best = { tau, f };
		}
		expect(best.tau * w).toBeCloseTo(1, 4);
		expect(best.f / ceiling(w, mu)).toBeCloseTo(1, 9);
		expect(shareOfCeiling(w, mu / w, mu)).toBeCloseTo(1, 12);
	});

	it('for copper’s electrons is 1.8 × 10⁻⁴ Pa s at τ = 9.2 × 10⁻¹⁵ s, and copper reaches 65% of it', () => {
		const w = glow(ROOM).peak;
		const c = PRESETS.copper;
		expect(c.eta0).toBeCloseTo(9.5e-4, 15);
		expect(relaxationTime(c.eta0, c.mu)).toBeCloseTo(COPPER_TAU, 25);
		expect(two(1 / w)).toBe(9.2e-15);
		expect(two(ceiling(w, c.mu))).toBe(1.8e-4);
		expect(two(w * COPPER_TAU)).toBe(2.7);
		expect(two(friction(w, c.eta0, c.mu))).toBe(1.1e-4);
		expect(Math.round(100 * shareOfCeiling(w, c.eta0, c.mu))).toBe(65);
		// the chapter's band edges: 8.2 × 10⁻⁴ at 2.6 THz, 1.5 × 10⁻⁵ at 51 THz
		expect(two(friction(glow(ROOM).low, c.eta0, c.mu))).toBe(8.2e-4);
		expect(two(friction(glow(ROOM).high, c.eta0, c.mu))).toBe(1.5e-5);
	});

	it('for honey is 4.6 × 10⁻⁶ Pa s, of which it reaches two millionths', () => {
		const w = glow(ROOM).peak;
		const h = PRESETS.honey;
		expect(two(ceiling(w, h.mu))).toBe(4.6e-6);
		expect(Math.round(1e6 * shareOfCeiling(w, h.eta0, h.mu))).toBe(2);
	});

	it('is approached within 2% at two of the slider’s tenths of a power of ten, at copper’s stiffness', () => {
		const w = glow(ROOM).peak;
		const mu = PRESETS.copper.mu;
		const hits: number[] = [];
		for (let k = ETA0.low * 10; k <= ETA0.high * 10; k++) {
			const eta0 = 10 ** (k / 10);
			if (shareOfCeiling(w, eta0, mu) >= NEAR_CEILING) hits.push(k / 10);
		}
		expect(hits).toEqual([-3.5, -3.4]);
	});
});

describe('the sliders and the words', () => {
	it('reach the chapter’s values', () => {
		for (const p of Object.values(PRESETS)) {
			expect(Math.log10(p.eta0)).toBeGreaterThanOrEqual(ETA0.low);
			expect(Math.log10(p.eta0)).toBeLessThanOrEqual(ETA0.high);
			expect(Math.log10(p.mu)).toBeGreaterThanOrEqual(MU.low);
			expect(Math.log10(p.mu)).toBeLessThanOrEqual(MU.high);
		}
		expect(10 ** TEMPERATURE.low).toBeCloseTo(200, 9);
		expect(10 ** TEMPERATURE.high).toBeCloseTo(2000, 9);
		expect(presetOf(OPENING)).toBe('honey');
		expect(presetOf({ eta0: 2, mu: 1e9 })).toBeUndefined();
	});

	it('print numbers as the chapter does', () => {
		expect(numberText(8.53e-12)).toBe('8.5 × 10⁻¹²');
		expect(numberText(1e4)).toBe('10⁴');
		expect(numberText(9.5e-4)).toBe('9.5 × 10⁻⁴');
		expect(numberText(293, 3)).toBe('293');
		expect(numberTex(1.0823e14, 3)).toBe('1.08 \\times 10^{14}');
		expect(numberTex(9.99e-5)).toBe('10^{-4}');
		expect(gpa(1e9)).toBe('1.0');
		expect(gpa(38e9)).toBe('38');
		expect(gpa(1e8)).toBe('0.10');
		expect(timeWords(1e-8).text).toBe('10 ns');
		expect(timeWords(1e-12).text).toBe('1 ps');
		expect(timeWords(2.5e-14).text).toBe('25 fs');
		expect(timeWords(1e-4).text).toBe('100 μs');
		expect(timeWords(1e-15).text).toBe('1 fs');
	});
});
