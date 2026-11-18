/**
 * The complex square root where its argument is nearly real, and the motion alarm that rests on it. In the room
 * demos a pixel's eigenvalues have imaginary parts some 1e-11 of their size; a square root that forms its small
 * part as a difference of nearly equal numbers loses them. Expected values: mpmath at 60 digits.
 */
import { describe, expect, it } from 'vitest';
import { csqrt, cx, mul } from './complex';
import { eigenvalues, motionAlarm, weyl } from './pixel';

const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);

describe('the complex square root', () => {
	it('keeps the small part of the root of a nearly real number', () => {
		const cases: [[number, number], [number, number]][] = [
			[
				[4, 4e-12],
				[2, 1e-12]
			],
			[
				[-4, 4e-12],
				[1e-12, 2]
			],
			[
				[-4, -4e-12],
				[1e-12, -2]
			],
			// the size of an eigenvector's square, and of a cubic's discriminant, in a room
			[
				[3.7e-16, 5.3e-27],
				[1.9235384061671344e-8, 1.3776693990115962e-19]
			],
			[
				[-2.9e-45, 4.1e-56],
				[3.806754432629563e-34, 5.385164807134504e-23]
			],
			[
				[-2.9e-45, -4.1e-56],
				[3.806754432629563e-34, -5.385164807134504e-23]
			],
			[
				[2, 3],
				[1.67414922803554, 0.8959774761298381]
			]
		];
		for (const [[x, y], [re, im]] of cases) {
			const w = csqrt(cx(x, y));
			expect(rel(w.re, re)).toBeLessThan(1e-14);
			expect(rel(w.im, im)).toBeLessThan(1e-14);
			// and squares back to its argument, small part included
			const back = mul(w, w);
			expect(rel(back.re, x)).toBeLessThan(1e-14);
			expect(rel(back.im, y)).toBeLessThan(1e-14);
		}
	});

	it('is the principal root, and exact where it can be', () => {
		expect(csqrt(cx(0))).toEqual(cx(0));
		expect(csqrt(cx(4))).toEqual(cx(2));
		expect(csqrt(cx(-4))).toEqual(cx(0, 2));
		expect(csqrt(cx(0, 2)).re).toBeCloseTo(1, 14);
		expect(csqrt(cx(0, 2)).im).toBeCloseTo(1, 14);
		expect(csqrt(cx(0, -2)).im).toBeCloseTo(-1, 14);
	});
});

describe('the motion alarm of a nearly static field', () => {
	// a tidal tensor with eigenvalues k (1, 2, -3) on three known axes, and a magnetic part a billionth of its size
	const k = 1e-8;
	const eps = 1e-9;
	const axes = [
		[1, 2, 2],
		[2, 1, -2],
		[2, -2, 1]
	].map((v) => v.map((x) => x / 3));
	const lam = [1, 2, -3];
	const B0 = [
		[1, 2, -1],
		[2, -3, 0.5],
		[-1, 0.5, 2]
	];
	const E = [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => k * lam.reduce((s, l, n) => s + l * axes[n][i] * axes[n][j], 0))
	);
	const W = weyl(
		E,
		B0.map((r) => r.map((x) => eps * k * x))
	);

	it('each eigenvalue turns by v.B.v, as first-order perturbation theory says', () => {
		// v_n . B0 v_n on the three axes; the next term in the imaginary parts is smaller by eps^2
		const turns = [5 / 9, 23 / 9, -28 / 9];
		const w = eigenvalues(W);
		lam.forEach((l, n) => {
			const z = w.reduce((p, q) => (Math.abs(q.re - l * k) < Math.abs(p.re - l * k) ? q : p));
			expect(Math.abs(z.re / k - l)).toBeLessThan(1e-12);
			expect(Math.abs(z.im / (eps * k) - turns[n])).toBeLessThan(1e-12);
		});
	});

	it('the alarm is (28/27) eps', () => {
		// mpmath, 60 digits: 1.037037037037037037e-9
		expect(rel(motionAlarm(W), 1.037037037037037e-9)).toBeLessThan(1e-12);
	});
});
