/** The near-field resolution law against the reference's exact calculation. */
import { describe, expect, it } from 'vitest';
import study from '../../../../reference/results/near_field_resolution.json';
import { cutoff, nearFieldBlur, slicePointSpread } from './resolution';

describe('near-field resolution', () => {
	it('finds the cutoff the reference finds', () => {
		for (const row of study.rows) {
			expect(cutoff(row.snr_decades) / row.q_c).toBeCloseTo(1, 12);
		}
	});

	it('gives the half-maximum width of the exact point-spread function to 0.5%', () => {
		for (const row of study.rows) {
			expect(nearFieldBlur(row.snr_decades, 'array') / row.array.fwhm).toBeCloseTo(1, 2);
			expect(nearFieldBlur(row.snr_decades, 'slice') / row.slice.fwhm).toBeCloseTo(1, 2);
			expect(Math.abs(nearFieldBlur(row.snr_decades) / row.array.fwhm - 1)).toBeLessThan(5e-3);
		}
	});

	it('sharpens only logarithmically', () => {
		// a million times more sensitive: not even twice as sharp
		const ratio = nearFieldBlur(6) / nearFieldBlur(12);
		expect(ratio).toBeGreaterThan(1.5);
		expect(ratio).toBeLessThan(2);
	});

	it('draws the point-spread function of a slice as the reference does', () => {
		for (const profile of study.profiles) {
			const psf = slicePointSpread(profile.snr_decades, 1);
			profile.r.forEach((r, k) => {
				expect(
					Math.abs(psf.at(r) - profile.slice[k]),
					`10^${profile.snr_decades}, r ${r}`
				).toBeLessThan(2e-3);
			});
		}
	});

	it('refuses an SNR at which nothing survives', () => {
		expect(() => cutoff(-1)).toThrow(RangeError);
	});
});
