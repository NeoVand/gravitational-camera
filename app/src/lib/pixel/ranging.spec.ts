/** Ranging a wave source: the laws against the reference implementation's values. */
import { describe, expect, it } from 'vitest';
import ranging from '../../../../reference/results/figures/ranging.json';
import { fromRank, fromSplit, helicitySplit, rankConstant, reach } from './ranging';

const rad = (d: number) => (d * Math.PI) / 180;

describe('how far away is a wave source', () => {
	it('the constant C matches the reference, and its special values', () => {
		for (const row of ranging.instant)
			expect(rankConstant(rad(row.iota), 0)).toBeCloseTo(row.C, 10);
		expect(rankConstant(rad(30), 0)).toBeCloseTo(10 / 49, 12);
		expect(rankConstant(Math.PI / 2, 0.7)).toBeCloseTo(2, 12);
		expect(rankConstant(Math.acos(1 / Math.sqrt(3)), 0)).toBeCloseTo(0, 12);
	});

	it('the split, against the exact field of a pair at kr = 200', () => {
		for (const [deg, krTimesSplit] of ranging.split) {
			expect(helicitySplit(rad(deg), 1) / krTimesSplit).toBeCloseTo(1, 1);
		}
	});

	it('the split reaches kr of order rho, the rank departure only of order sqrt(rho)', () => {
		const a = reach(rad(60), 1e3),
			b = reach(rad(60), 1e5);
		expect(b.split / a.split).toBeCloseTo(100, 6);
		expect(b.rank / a.rank).toBeCloseTo(10, 6);
		expect(fromSplit(rad(60), 300, 1e3).krSigma).toBeLessThan(Infinity);
		expect(fromRank(rad(60), 300, 1e3).krSigma).toBe(Infinity);
	});
});
