/**
 * The noise of a near-field reconstruction against the reference: reference/fixtures/near-noise.json, written by
 * gravcam.export_fixtures from gravcam.resolution (the Wiener filter H and its integrals). A draw must have the
 * spectrum (m / z^3)^2 H (1 - H) and the variance (1 / 2 pi) int H (1 - H) q dq that the filter gives the readings'
 * white noise.
 */
import { describe, expect, it } from 'vitest';
import fixture from '../../../../reference/fixtures/near-noise.json';
import { cutoff } from '../engine/resolution';
import { fft2, noiseField, noiseGrid, noiseSpectrum, noiseVariance, pointPeak } from './noise';

const rows = fixture.rows;

describe.each(rows.map((r) => [r.snr_decades, r] as const))('SNR 10^%s', (decades, row) => {
	it('has the reference’s cutoff, spectrum and integrals', () => {
		expect(cutoff(decades)).toBeCloseTo(row.q_c, 8);
		row.q.forEach((q, k) =>
			expect(Math.abs(noiseSpectrum(q, decades) - row.spectrum[k])).toBeLessThan(
				1e-9 + 1e-8 * row.spectrum[k]
			)
		);
		expect(Math.abs(noiseVariance(decades) / row.variance - 1)).toBeLessThan(1e-4);
		expect(Math.abs(pointPeak(decades) / row.peak - 1)).toBeLessThan(1e-4);
	});

	// a field wide enough for many independent ripples: 32 wavelengths of the cutoff across, four cells to one
	const n = 256;
	const cell = (2 * Math.PI) / (row.q_c + 8) / 4;
	const draws = [11, 12, 13, 14].map((seed) => noiseField(n, n, cell, decades, seed));

	it('one draw at a time has the reference’s variance', () => {
		// the scatter of a variance estimated from a field: 2 sum P^2 / (sum P)^2 of the grid's spectrum
		let sum = 0;
		let squares = 0;
		for (let j = 0; j < n; j++)
			for (let i = 0; i < n; i++) {
				const f = (k: number) => ((2 * Math.PI) / (n * cell)) * (k < n / 2 ? k : k - n);
				const p = noiseSpectrum(Math.hypot(f(i), f(j)), decades);
				sum += p;
				squares += p * p;
			}
		const scatter = Math.sqrt((2 * squares) / (sum * sum) / draws.length);
		const variance =
			draws.reduce((s, d) => s + d.reduce((t, v) => t + v * v, 0) / d.length, 0) / draws.length;
		expect(Math.abs(variance / row.variance - 1)).toBeLessThan(5 * scatter + 0.01);
	});

	it('and the spectrum H (1 - H), ring by ring', () => {
		// the periodogram of each draw, |F|^2 cell^2 / N, against the spectrum at the same points of the grid, in a
		// ring about each sample q a step of the grid wide (H (1 - H) itself is held to the reference above)
		const step = (2 * Math.PI) / (n * cell);
		const rings = row.q.map(() => ({ got: 0, want: 0, count: 0 }));
		for (const d of draws) {
			const re = Float64Array.from(d);
			const im = new Float64Array(n * n);
			fft2(re, im, n, n);
			for (let j = 0; j < n; j++)
				for (let i = 0; i < n; i++) {
					const f = (k: number) => step * (k < n / 2 ? k : k - n);
					const q = Math.hypot(f(i), f(j));
					row.q.forEach((at, k) => {
						if (Math.abs(q - at) > step) return;
						rings[k].got += ((re[j * n + i] ** 2 + im[j * n + i] ** 2) * cell * cell) / (n * n);
						rings[k].want += noiseSpectrum(q, decades);
						rings[k].count++;
					});
				}
		}
		rings.forEach(({ got, want, count }, k) => {
			// each periodogram value scatters as much as its mean (an exponential); half the modes are copies
			const tolerance = 5 / Math.sqrt(count / 2);
			if (want / count < 1e-4) expect(got / count).toBeLessThan(1e-3);
			else
				expect(
					Math.abs(got / want - 1),
					`q = ${row.q[k]}: ${got / count} against ${want / count}`
				).toBeLessThan(tolerance);
		});
	});
});

describe('a draw', () => {
	it('is the same for the same seed, and another for another', () => {
		const a = noiseField(64, 32, 0.05, 6, 3);
		const b = noiseField(64, 32, 0.05, 6, 3);
		const c = noiseField(64, 32, 0.05, 6, 4);
		expect(Array.from(a)).toEqual(Array.from(b));
		expect(a.some((v, k) => v !== c[k])).toBe(true);
	});

	it('has nothing uniform in it: a broad layer of mass has no tidal field, and the filter keeps none', () => {
		const a = noiseField(64, 64, 0.05, 6, 9);
		const mean = a.reduce((s, v) => s + v, 0) / a.length;
		expect(Math.abs(mean)).toBeLessThan(1e-12);
	});

	it('gets a grid that resolves the cutoff, a power of two on a side, and holds the picture', () => {
		for (const decades of [1, 3, 20, 60]) {
			const g = noiseGrid(0.9, 0.55, decades);
			expect(Math.log2(g.n) % 1).toBe(0);
			expect(g.across).toBeLessThanOrEqual(g.n / 2 + 1e-9);
			expect(g.up).toBeLessThanOrEqual(g.n / 2 + 1e-9);
			expect(g.across * g.cell).toBeCloseTo(1.8, 12);
			// four cells to the shortest wavelength that matters, unless the grid is at its largest
			if (g.n < 1024)
				expect(g.cell).toBeLessThanOrEqual((2 * Math.PI) / (cutoff(decades) + 8) / 4 + 1e-12);
		}
	});
});

describe.each(rows.map((r) => [r.snr_decades, r] as const))(
	'SNR 10^%s, on the grid a picture gets',
	(decades, row) => {
		it('the draws have the reference’s variance', () => {
			// a picture 58 degrees high on a wide screen, as the room demos start
			const g = noiseGrid(0.89, 0.555, decades);
			let total = 0;
			const seeds = 24;
			for (let seed = 1; seed <= seeds; seed++) {
				const d = noiseField(g.n, g.n, g.cell, decades, seed);
				total += d.reduce((s, v) => s + v * v, 0) / d.length;
			}
			// the scatter of the estimate, from the grid's own spectrum, as above; and one per cent for its lattice
			let sum = 0;
			let squares = 0;
			for (let j = 0; j < g.n; j++)
				for (let i = 0; i < g.n; i++) {
					const f = (k: number) => ((2 * Math.PI) / (g.n * g.cell)) * (k < g.n / 2 ? k : k - g.n);
					const p = noiseSpectrum(Math.hypot(f(i), f(j)), decades);
					sum += p;
					squares += p * p;
				}
			const scatter = Math.sqrt((2 * squares) / (sum * sum) / seeds);
			expect(Math.abs(total / seeds / row.variance - 1)).toBeLessThan(5 * scatter + 0.01);
		});
	}
);
