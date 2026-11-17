/** Beyond general relativity in one reading, against the reference (reference/fixtures/pixel.json). */
import { describe, expect, it } from 'vitest';
import fixtures from '../../../../reference/fixtures/pixel.json';
import type { Vec3 } from './complex';
import { invertOneReading, metricWaveReading, waveOf } from './beyond';

const rel = (a: number[][], b: number[][]) =>
	Math.hypot(...a.flat().map((x, i) => x - b.flat()[i])) / Math.hypot(...b.flat());

describe('one reading of a metric plane wave', () => {
	for (const w of fixtures.beyond) {
		it(`n = ${w.n}: the closed-form curvature matches the reference's finite differences, and inverts`, () => {
			const { E, B } = metricWaveReading(w.eps, w.n, w.k as Vec3, w.omega, w.x0);
			expect(rel(E, w.E)).toBeLessThan(1e-7);
			expect(rel(B, w.B)).toBeLessThan(1e-7);
			const inv = invertOneReading(E, B, w.e1 as Vec3);
			expect(inv.n).toBeCloseTo(w.n, 10);
			inv.k.forEach((x, i) => expect(x).toBeCloseTo(w.k[i], 10));
			expect(inv.residual).toBeLessThan(1e-12);
			for (const key of ['plus', 'cross', 'x', 'y', 'b', 'l'] as const) {
				expect(inv.pol[key] / w.pol[key]).toBeCloseTo(1, 6);
			}
		});
	}

	it('a wave set by its six polarizations is read back exactly; two waves fail the checks', () => {
		const pol = { plus: 0.3, cross: -0.2, x: 0.15, y: 0.05, b: -0.4, l: 0.25 };
		const k: Vec3 = [0.6, 0, 0.8];
		const w = waveOf(pol, 1.2, k);
		const { E, B } = metricWaveReading(w.eps, w.n, w.k, 1, 0);
		const inv = invertOneReading(E, B);
		expect(inv.n).toBeCloseTo(1.2, 10);
		const scale = inv.pol.plus / pol.plus;
		for (const key of ['plus', 'cross', 'x', 'y', 'b', 'l'] as const)
			expect(inv.pol[key]).toBeCloseTo(scale * pol[key], 10);
		const other = waveOf({ ...pol, plus: 0.5 }, 1, [0, 0.6, 0.8]);
		const r2 = metricWaveReading(other.eps, other.n, other.k, 1, 0);
		const sum = (A: number[][], Bm: number[][]) => A.map((r, i) => r.map((x, j) => x + Bm[i][j]));
		expect(invertOneReading(sum(E, r2.E), sum(B, r2.B)).residual).toBeGreaterThan(0.05);
	});
});
