/** The numbers of chapter 3.7's live figure, against the numbers the chapter prints. */
import { describe, expect, it } from 'vitest';
import { cutoff, nearFieldBlur } from '../../engine/resolution';
import {
	ARCMINUTE,
	DEGREE,
	LAW,
	airy,
	besselJ0,
	besselJ1,
	decadesFor,
	firstEstimate,
	log10Level,
	log10Signal,
	lowCrossing,
	planePointSpread,
	rowPointSpread
} from './blur-law';

describe('the Bessel functions', () => {
	it('match tabulated values', () => {
		expect(besselJ0(0)).toBeCloseTo(1, 8);
		expect(besselJ0(1)).toBeCloseTo(0.7651976866, 7);
		expect(besselJ0(2.404825557695773)).toBeCloseTo(0, 7);
		expect(besselJ0(10)).toBeCloseTo(-0.2459357645, 7);
		expect(besselJ0(100)).toBeCloseTo(0.0199858503, 7);
		expect(besselJ1(1)).toBeCloseTo(0.4400505857, 7);
		expect(besselJ1(-1)).toBeCloseTo(-0.4400505857, 7);
		expect(besselJ1(3.831705970207512)).toBeCloseTo(0, 7);
		expect(besselJ1(10)).toBeCloseTo(0.0434727462, 7);
		expect(besselJ1(100)).toBeCloseTo(-0.077145352, 7);
	});

	it('give the chapter’s half widths and ringing', () => {
		expect(LAW.plane).toBeCloseTo(4.4302, 4);
		expect(LAW.row).toBeCloseTo(3.791, 3);
		// 2J₁(x)/x reaches −0.13 of the peak at x = 5.14
		expect(airy(5.1356)).toBeCloseTo(-0.132, 3);
	});
});

describe('the cut-off', () => {
	it('crosses the level where the chapter says', () => {
		// step 2: q = 10.4 has s = 0.99 at SNR = 10³
		expect(log10Signal(cutoff(3))).toBeCloseTo(log10Level(3), 10);
		expect(log10Signal(lowCrossing(3))).toBeCloseTo(log10Level(3), 10);
		expect(lowCrossing(3)).toBeCloseTo(3.2e-4, 5);
		expect(lowCrossing(60)).toBeGreaterThan(0);
		expect(lowCrossing(60) * Math.PI * 1e60).toBeCloseTo(1, 10);
	});

	it('has the paper’s first estimate', () => {
		expect(firstEstimate(3)).toBeCloseTo(10.1385, 4);
		expect(cutoff(3)).toBeCloseTo(10.3937, 4);
	});

	it('needs about 10^6610 to match the eye', () => {
		expect(Math.round(decadesFor(LAW.plane / ARCMINUTE) / 10) * 10).toBe(6610);
		expect(decadesFor(cutoff(30))).toBeCloseTo(30, 10);
	});
});

describe('the exact picture of a point', () => {
	const table = [
		[3, 24.0, 20.7],
		[6, 14.1, 12.1],
		[10, 9.2, 7.9],
		[20, 5.0, 4.2],
		[30, 3.4, 2.9],
		[60, 1.8, 1.5]
	] as const;

	it.each(table)('at 10^%i is %f° on a plane and %f° on a row', (decades, plane, row) => {
		const a = planePointSpread(decades, 60 * DEGREE);
		expect(Math.abs(a.width / DEGREE - plane)).toBeLessThan(0.05);
		expect(a.value[0]).toBeCloseTo(1, 12);
		const b = rowPointSpread(decades, 60 * DEGREE);
		expect(Math.abs(b.width / DEGREE - row)).toBeLessThan(0.05);
	});

	it('agrees with the engine’s fitted widths and the paper’s four per cent', () => {
		for (const decades of [2, 3, 6, 10, 30, 60]) {
			const exact = planePointSpread(decades, 60 * DEGREE).width;
			expect(exact / nearFieldBlur(decades, 'array')).toBeCloseTo(1, 2);
			const ratio = exact / (LAW.plane / cutoff(decades));
			expect(ratio).toBeGreaterThan(0.96);
			expect(ratio).toBeLessThan(1.001);
		}
		// 0.967 at SNR = 100, 0.982 at 10³
		expect(planePointSpread(2, 1).width / (LAW.plane / cutoff(2))).toBeCloseTo(0.967, 3);
		expect(planePointSpread(3, 1).width / (LAW.plane / cutoff(3))).toBeCloseTo(0.982, 3);
	});

	it('is quick enough to follow a slider', () => {
		const t = performance.now();
		planePointSpread(60, 60 * DEGREE);
		rowPointSpread(60, 60 * DEGREE);
		expect(performance.now() - t).toBeLessThan(400);
	});
});
