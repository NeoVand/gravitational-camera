/**
 * Chapter 13.8's readable cells: the try spec's checks, each against values written here independently of the module.
 * The counts are copied from the reference scripts' outputs in design/research/holography/scripts/paired-tides:
 * counts.out (exact.py's multiple-precision singular values, and core.py's rung-by-rung count), pivots.out, and a
 * run of exact.py at R_c/a = 1.2, 1.5 and 2 made for this figure (mpmath, 2026-11-24). The rounded values are the
 * chapter's and the spec's.
 */
import { describe, expect, it } from 'vitest';
import {
	PLANCK_AREA,
	REGIONS,
	RADII,
	SNR,
	ceiling,
	cellSide,
	entropy,
	gridLines,
	kappa,
	keptLog,
	keptRadius,
	lgamma,
	logResidual,
	looking,
	pairedCount,
	pairedCountSteps,
	pivotCount,
	readings,
	settingCount,
	settingCountSteps,
	snrTex,
	snrWords
} from './readable-cells';

const LN3 = Math.log(3);
const ln = (e: number) => e * Math.LN10;
/** x to n significant figures, as the chapter prints it. */
const sig = (x: number, n: number) => Number(x.toPrecision(n));

describe('the special functions', () => {
	it('ln Γ against factorials and Γ(½) = √π', () => {
		expect(lgamma(1)).toBeCloseTo(0, 14);
		expect(lgamma(0.5)).toBeCloseTo(0.5 * Math.log(Math.PI), 14);
		let f = 0;
		for (let n = 2; n <= 400; n++) {
			f += Math.log(n);
			expect(Math.abs(lgamma(n + 1) - f)).toBeLessThan(1e-12 * Math.max(1, f));
		}
	});

	it('the residuals of the chapter’s box: β₁/β₀ = 0.262 at ℓ = 0, and ln(β₂₀/β₀) = −27.65', () => {
		expect(Math.exp(logResidual(0, 1) - logResidual(0, 0))).toBeCloseTo(0.262, 3);
		expect(logResidual(0, 20) - logResidual(0, 0)).toBeCloseTo(-27.65, 2);
	});

	it('the entropy of a fair coin is ln 2', () => {
		expect(entropy(0.5)).toBeCloseTo(Math.LN2, 15);
		expect(entropy(0)).toBe(0);
	});
});

describe('looking: N₁ = (⌊L/Λ⌋ + 1)² from three radii', () => {
	it('is 169 at 10⁶ and 21,609 at 10⁷⁰', () => {
		expect(looking(ln(6), LN3)).toBe(169);
		expect(looking(ln(70), LN3)).toBe(21609);
	});

	it('is counts.out’s column at the other powers', () => {
		const table = { 3: 49, 10: 441, 12: 676, 30: 3969, 120: 63504 };
		for (const [e, n] of Object.entries(table)) expect(looking(ln(+e), LN3)).toBe(n);
	});

	it('is one number, the mass, for a camera so far that Λ > L', () => {
		expect(looking(ln(3), ln(3) + 0.1)).toBe(1);
	});
});

describe('pushing: N₂, the exact singular-value count of pairs', () => {
	it('is 271, 1682, 21,675 and 251,536 at 10⁶, 10¹², 10³⁰ and 10⁷⁰ from three radii', () => {
		expect(pairedCount(6, LN3).count).toBe(271);
		expect(pairedCount(12, LN3).count).toBe(1682);
		expect(pairedCount(30, LN3).count).toBe(21675);
		expect(pairedCount(70, LN3).count).toBe(251536);
	});

	it('is counts.out’s exact column at 10³, 10¹⁰ and 10¹²⁰, with the top singular value in sector 0', () => {
		expect(pairedCount(3, LN3).count).toBe(46);
		expect(pairedCount(10, LN3).count).toBe(1035);
		const top = pairedCount(120, LN3);
		expect(top.count).toBe(1227687);
		expect(top.topSector).toBe(0);
	});

	it('counts exact_30_70.out’s rungs in sector 0: 20 at 10³⁰ and 46 at 10⁷⁰', () => {
		expect(pairedCount(30, LN3).rungsAtZero).toBe(20);
		expect(pairedCount(70, LN3).rungsAtZero).toBe(46);
	});

	it('is exact.py’s count at other radii, where the grading is weakest', () => {
		const table: [number, number, number][] = [
			[1.2, 3, 1722],
			[1.2, 10, 41851],
			[1.2, 20, 285686],
			[1.5, 30, 190307],
			[2, 60, 457197]
		];
		for (const [r, e, n] of table) expect(pairedCount(e, Math.log(r)).count).toBe(n);
	});

	it('is counts.out’s exact count at the ceilings of a metre, the Earth and the Hubble radius', () => {
		const at = (radius: number) => pairedCount(Math.log10(ceiling(radius)), LN3).count;
		expect(sig(at(1), 4)).toBe(2.431e5);
		expect(sig(at(6.371e6), 4)).toBe(4.123e5);
		expect(sig(at(1.37e26), 4)).toBe(1.276e6);
	});

	it('grows 6.2 times from 10⁶ to 10¹², and 1.27 times from 10⁷⁰ to 10⁷⁶', () => {
		expect(sig(pairedCount(12, LN3).count / pairedCount(6, LN3).count, 2)).toBe(6.2);
		expect(sig(pairedCount(76, LN3).count / pairedCount(70, LN3).count, 3)).toBe(1.27);
	});

	it('gives the same count by steps as at once', () => {
		const steps = pairedCountSteps(70, LN3);
		let yields = 0;
		let next = steps.next();
		while (!next.done) {
			yields++;
			next = steps.next();
		}
		expect(yields).toBeGreaterThan(10);
		expect(next.value.count).toBe(251536);
	});

	it('keeps each slider setting’s count, the ceiling’s own tick included', () => {
		const at = Math.log10(ceiling(1));
		expect(sig(settingCount(at, 3), 4)).toBe(2.431e5);
		// counted once: a second time it is returned without a step
		expect(settingCountSteps(at, 3).next()).toEqual({ done: true, value: settingCount(at, 3) });
		expect(settingCount(6, 3)).toBe(271);
	});

	it('runs over the sliders’ whole range, the slowest corner in well under two seconds', () => {
		const t = performance.now();
		const corner = pairedCount(SNR.max, Math.log(RADII.min)).count;
		expect(performance.now() - t).toBeLessThan(2000);
		// the asymptote κ(L/Λ)³ is near, within the finite-L drift
		const asymptote = kappa(Math.log(RADII.min)) * (ln(SNR.max) / Math.log(RADII.min)) ** 3;
		expect(corner / asymptote).toBeGreaterThan(0.8);
		expect(corner / asymptote).toBeLessThan(1.3);
	});
});

describe('the rung-by-rung (pivot) count, for comparison', () => {
	it('is counts.out’s pivot column, within 2 per cent of the exact one', () => {
		const table: [number, number, number][] = [
			[3, 46, 46],
			[6, 271, 271],
			[10, 1035, 1035],
			[12, 1649, 1682],
			[30, 21675, 21675],
			[70, 250818, 251536],
			[120, 1225502, 1227687]
		];
		for (const [e, pivot, exact] of table) {
			const n = pivotCount(ln(e), LN3);
			expect(n).toBe(pivot);
			expect(Math.abs(n / exact - 1)).toBeLessThan(0.02);
		}
	});

	it('approaches κ: N₂/(L/Λ)³ = 0.0760 at L = 400 (counts.out)', () => {
		expect(pivotCount(400, LN3) / (400 / LN3) ** 3).toBeCloseTo(0.076, 4);
	});
});

describe('the cell size, d/a = (4π/3N₂)^⅓', () => {
	it('is 0.25 at 10⁶ and 0.026 at 10⁷⁰', () => {
		expect(sig(cellSide(pairedCount(6, LN3).count), 2)).toBe(0.25);
		expect(sig(cellSide(pairedCount(70, LN3).count), 2)).toBe(0.026);
	});

	it('is counts.out’s d/a to four places', () => {
		expect(cellSide(271)).toBeCloseTo(0.2491, 4);
		expect(cellSide(1682)).toBeCloseTo(0.1355, 4);
		expect(cellSide(21675)).toBeCloseTo(0.0578, 4);
		expect(cellSide(251536)).toBeCloseTo(0.0255, 4);
	});

	it('gives N₂/N₁ as the chapter’s table: 1.6, 2.5, 5.5, 11.6', () => {
		const ratio = (e: number) => readings(e, 3, pairedCount(e, LN3).count).ratio;
		expect(sig(ratio(6), 2)).toBe(1.6);
		expect(sig(ratio(12), 2)).toBe(2.5);
		expect(sig(ratio(30), 2)).toBe(5.5);
		expect(sig(ratio(70), 3)).toBe(11.6);
	});
});

describe('the asymptotic κ for pairs', () => {
	it('is 0.014, 0.053, 0.073 and 0.107 at R_c/a = 1.2, 2, 3 and 10', () => {
		const at = (r: number) => Number(kappa(Math.log(r)).toFixed(3));
		expect(at(1.2)).toBe(0.014);
		expect(at(2)).toBe(0.053);
		expect(at(3)).toBe(0.073);
		expect(at(10)).toBe(0.107);
	});

	it('is pivots.out’s integral to four places: 0.0140, 0.0527, 0.0733, 0.1066', () => {
		expect(kappa(Math.log(1.2))).toBeCloseTo(0.014, 4);
		expect(kappa(Math.log(2))).toBeCloseTo(0.0527, 4);
		expect(kappa(LN3)).toBeCloseTo(0.07332, 5);
		expect(kappa(Math.log(10))).toBeCloseTo(0.1066, 4);
	});

	it('tends to ⅙, the count of all polynomials, for a far camera', () => {
		expect(kappa(1e4)).toBeCloseTo(1 / 6, 3);
	});
});

describe('the ceilings S_BH/2π = ℓ_r²/2ℓ_P²', () => {
	it('uses ℓ_P = 1.6 × 10⁻³⁵ m', () => {
		expect(sig(Math.sqrt(PLANCK_AREA), 2)).toBe(1.6e-35);
	});

	it('is 1.9 × 10⁶⁹ for a metre, 7.8 × 10⁸² for the Earth and 3.6 × 10¹²¹ for the Hubble radius', () => {
		const by = Object.fromEntries(REGIONS.map((r) => [r.id, ceiling(r.radius)]));
		expect(sig(by.metre, 2)).toBe(1.9e69);
		expect(sig(by.earth, 2)).toBe(7.8e82);
		expect(sig(by.hubble, 2)).toBe(3.6e121);
	});

	it('equals S_BH/2π with S_BH = 4πℓ²/4ℓ_P², and falls on the slider', () => {
		for (const r of REGIONS) {
			const S = (4 * Math.PI * r.radius ** 2) / (4 * PLANCK_AREA);
			expect(ceiling(r.radius) / (S / (2 * Math.PI))).toBeCloseTo(1, 12);
			const at = Math.log10(ceiling(r.radius));
			expect(at).toBeGreaterThan(SNR.min);
			expect(at).toBeLessThan(SNR.max);
		}
	});
});

describe('the controls and the words', () => {
	it('keeps the sliders on their grids and inside their ends', () => {
		expect(keptLog(69.26)).toBe(69.3);
		expect(keptLog(200)).toBe(SNR.max);
		expect(keptLog(-1)).toBe(SNR.min);
		expect(keptRadius(2.04)).toBe(2);
		expect(keptRadius(0)).toBe(RADII.min);
		expect(SNR.opening).toBe(6);
		expect(RADII.opening).toBe(3);
	});

	it('writes SNR as a power of ten', () => {
		expect(snrWords(6)).toBe('10⁶');
		expect(snrWords(Math.log10(1.9e69))).toBe('1.9 × 10⁶⁹');
		expect(snrTex(70)).toBe('10^{70}');
		expect(snrTex(Math.log10(3.6e121))).toBe('3.6\\times10^{121}');
	});

	it('draws a grid of side d through the centre, symmetric and inside the disc', () => {
		const lines = gridLines(0.25);
		expect(lines).toEqual([-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]);
		expect(gridLines(0.026).every((x) => Math.abs(x) < 1)).toBe(true);
	});
});
