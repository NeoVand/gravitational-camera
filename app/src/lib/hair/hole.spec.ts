/** A black hole's response: its sums, tide by tide, as the radii of shells, and why no body has them. */
import { describe, expect, it } from 'vitest';
import {
	HOLE_RADII,
	PAPER_RADII,
	SHARP_LIMIT,
	bodyMoments,
	least,
	moments,
	positivity
} from './hole';

describe('the radii of the equivalent shells', () => {
	it('are those of the paper, rising towards 3 sqrt 3 / e = 1.91', () => {
		for (const l of [2, 3, 4, 5, 6])
			expect(HOLE_RADII[l].toFixed(2)).toBe(PAPER_RADII[l].toFixed(2));
		expect(SHARP_LIMIT.toFixed(2)).toBe('1.91');
		const r = Object.values(HOLE_RADII);
		r.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(r[i]));
		expect(r[r.length - 1]).toBeLessThan(SHARP_LIMIT);
	});

	it('give the moments a body would need, M R_l^(2l - 2)', () => {
		const m = moments();
		expect(m[0]).toBe(1);
		expect(m[1]).toBeCloseTo(HOLE_RADII[2] ** 2, 14);
		expect(m[2]).toBeCloseTo(HOLE_RADII[3] ** 4, 14);
		expect(m[3]).toBeCloseTo(HOLE_RADII[4] ** 6, 14);
		// the quadrupolar sum of the paper, 0.345 M r_s^2, is (1/3) of the first
		expect((m[1] / 3).toFixed(3)).toBe('0.345');
	});
});

describe('the test that every positive mass passes', () => {
	it('fails for the hole: -2.04 M r_s^6 at a = 4.34 r_s^2, from the sums of degrees 2, 3 and 4', () => {
		const { a, value } = least();
		expect(a.toFixed(2)).toBe('4.34');
		expect(value.toFixed(2)).toBe('-2.04');
		expect(positivity(a)).toBeCloseTo(value, 12);
		expect(positivity(a + 0.3)).toBeGreaterThan(value);
		expect(positivity(a - 0.3)).toBeGreaterThan(value);
		// M (R_4^6 - 2 a R_3^4 + a^2 R_2^2), written out
		const [r2, r3, r4] = [HOLE_RADII[2], HOLE_RADII[3], HOLE_RADII[4]];
		expect(positivity(a)).toBeCloseTo(r4 ** 6 - 2 * a * r3 ** 4 + a * a * r2 ** 2, 12);
	});

	it('fails with the paper’s rounded radii too, though they move the least to -2.4', () => {
		const { a, value } = least(moments(PAPER_RADII));
		expect(value).toBeLessThan(-2);
		expect(a).toBeCloseTo(4.37, 2);
	});

	it('fails for the next triples of degrees as well', () => {
		for (const k of [3, 4]) expect(least(moments(), k).value).toBeLessThan(0);
	});

	it('is passed by every body of positive mass', () => {
		const bodies = [
			[{ mass: 1, radius: 1 }],
			[
				{ mass: 0.5, radius: 0 },
				{ mass: 0.5, radius: 1.3 }
			],
			// a uniform ball of radius r_s, as 200 thin shells
			Array.from({ length: 200 }, (_, i) => ({
				mass: ((i + 1) ** 3 - i ** 3) / 200 ** 3,
				radius: (i + 0.5) / 200
			})),
			[
				{ mass: 0.2, radius: 0.4 },
				{ mass: 0.3, radius: 1.1 },
				{ mass: 0.5, radius: 1.9 }
			]
		];
		for (const shells of bodies) {
			const m = bodyMoments(shells);
			expect(least(m).value).toBeGreaterThanOrEqual(-1e-12);
			for (const a of [0, 1, 2.5, 4.34, 8]) expect(positivity(a, m)).toBeGreaterThanOrEqual(-1e-12);
		}
	});
});
