/** The numbers of chapter 3.9's positive image, against the geometry, the engine and the figure's answers. */
import { describe, expect, it } from 'vitest';
import { cutoff, nearFieldBlur } from '../../engine/resolution';
import {
	CELLS,
	MERGE,
	MODES,
	OPENING,
	PERIOD,
	bumps,
	cellCentres,
	design,
	gain,
	mergeSeparation,
	noiseDraw,
	pointSpread,
	positiveImage,
	ripple,
	tide,
	toldApart,
	weight,
	wienerImage,
	wienerMerge
} from './positive-image';

const silent = new Float64Array(2 * MODES);

describe('the geometry of fig:nearfield', () => {
	it('reads the tide (1 − u²)/(1 + u²)² of a line mass, and its transform π q e^(−q)', () => {
		expect(tide(0)).toBe(1);
		expect(tide(1)).toBe(0);
		expect(tide(Math.sqrt(3))).toBeCloseTo(-1 / 8, 12);
		// ∫ t(u) cos(q u) du by the trapezoid rule on a long row
		for (const q of [0.5, 1, 3]) {
			let s = 0;
			const du = 0.002;
			for (let u = -400; u <= 400; u += du) s += tide(u) * Math.cos(q * u) * du;
			expect(s).toBeCloseTo(gain(q), 3);
		}
	});

	it('gives two cells the overlap of their tides along the endless row, in units of the noise', () => {
		// ∫ t(u − a) t(u − b) du = 2π (8 − 6Δ²)/(4 + Δ²)³, Δ = a − b; times SNR² in units of the noise
		const a = design([0, 0.3, 1], 0);
		const column = (j: number) => Array.from({ length: a.rows }, (_, i) => a.data[i * 3 + j]);
		const dot = (x: number[], y: number[]) => x.reduce((t, v, i) => t + v * y[i], 0);
		const exact = (d: number) => (2 * Math.PI * (8 - 6 * d * d)) / (4 + d * d) ** 3;
		// the ring leaves out the uniform ripple, which the tide lacks: a part in PERIOD of the overlap at most
		expect(dot(column(0), column(0))).toBeCloseTo(exact(0), 3);
		expect(dot(column(0), column(1))).toBeCloseTo(exact(0.3), 3);
		expect(dot(column(0), column(2))).toBeCloseTo(exact(1), 3);
		expect(PERIOD).toBe(40);
	});
});

describe('the Gaussian image', () => {
	it('keeps each ripple with chapter 3.5’s weight s²/(1 + s²), s = π SNR q e^(−q)', () => {
		for (const d of [3, 6]) {
			for (const q of [0.1, 1, 5, 12]) {
				const s = Math.PI * 10 ** d * q * Math.exp(-q);
				expect(ripple(q, d)).toBeCloseTo(s, 6);
				expect(weight(q, d)).toBeCloseTo((s * s) / (1 + s * s), 12);
			}
			expect(weight(cutoff(d), d)).toBeCloseTo(0.5, 10);
		}
	});

	it('draws a point as the paper does: the engine’s width, and the whole mass', () => {
		for (const d of [3, 6]) {
			const peak = pointSpread(0, d);
			let a = 0;
			let b = 1;
			for (let i = 0; i < 50; i++) {
				const mid = (a + b) / 2;
				if (pointSpread(mid, d) > peak / 2) a = mid;
				else b = mid;
			}
			expect(2 * a).toBeCloseTo(nearFieldBlur(d, 'slice'), 3);
			let mass = 0;
			for (let r = -PERIOD / 2; r < PERIOD / 2; r += 0.002) mass += pointSpread(r, d) * 0.002;
			expect(mass).toBeCloseTo(1, 3);
		}
	});

	it('merges two equal masses below 0.391 z at 10³ and 0.231 z at 10⁶: 1.7-fold, less than twofold', () => {
		expect(wienerMerge(3)).toBeCloseTo(0.391, 3);
		expect(wienerMerge(6)).toBeCloseTo(0.231, 3);
		const ratio = wienerMerge(3) / wienerMerge(6);
		expect(ratio).toBeGreaterThan(1.6);
		expect(ratio).toBeLessThan(2);
	});

	it('shows one bump for the opening pair, and two once they are far apart', () => {
		const xs = Array.from({ length: 241 }, (_, i) => -0.6 + (1.2 * i) / 240);
		const at = (d: number) => [
			{ x: -d / 2, m: 1 },
			{ x: d / 2, m: 1 }
		];
		expect(bumps(wienerImage(xs, at(0.3), 3, noiseDraw(OPENING.seed)))).toBe(1);
		expect(bumps(wienerImage(xs, at(0.8), 3, noiseDraw(OPENING.seed)))).toBe(2);
	});
});

describe('the positive image', () => {
	it('recovers two separated masses exactly without noise', () => {
		const cells = cellCentres(1.2);
		const truth = [
			{ x: cells[10], m: 2 },
			{ x: cells[25], m: 1 }
		];
		for (const d of [3, 6]) {
			const { m, misfit } = positiveImage(cells, truth, d, silent);
			expect(m).toHaveLength(CELLS);
			m.forEach((v, j) => expect(v).toBeCloseTo(j === 10 ? 2 : j === 25 ? 1 : 0, 6));
			expect(misfit).toBeLessThan(1e-6);
		}
	});

	it('never holds negative mass, and fits the noise as well as the truth does', () => {
		const cells = cellCentres(1.2);
		const pair = [
			{ x: -0.15, m: 1 },
			{ x: 0.15, m: 1 }
		];
		const noise = noiseDraw(OPENING.seed);
		const { m, misfit } = positiveImage(cells, pair, 3, noise);
		expect(Math.min(...m)).toBeGreaterThanOrEqual(0);
		const truth = noise.reduce((t, v) => t + v * v, 0);
		expect(misfit).toBeLessThanOrEqual(truth);
		expect(m.reduce((t, v) => t + v, 0)).toBeCloseTo(2, 1);
	});

	it('tells the opening pair apart in its opening draw, where the Gaussian image cannot', () => {
		const cells = cellCentres(OPENING.width);
		const pair = [
			{ x: -OPENING.separation / 2, m: 1 },
			{ x: OPENING.separation / 2, m: 1 }
		];
		const { m } = positiveImage(cells, pair, OPENING.decades, noiseDraw(OPENING.seed));
		expect(toldApart(m, cells, pair)).toBe(true);
		expect(OPENING.separation).toBeLessThan(wienerMerge(OPENING.decades));
	});

	it('does not tell a single mass split by the noise for two', () => {
		const cells = cellCentres(0.12);
		// a blob in two cells far apart from where two masses 0.01 apart would stand
		const image = new Float64Array(CELLS);
		image[5] = 1;
		image[34] = 1;
		const pair = [
			{ x: -0.005, m: 1 },
			{ x: 0.005, m: 1 }
		];
		expect(toldApart(image, cells, pair)).toBe(false);
	});
});

describe('where the positive image merges two masses', () => {
	it('shrinks about eightfold from 10³ to 10⁶, far less than √1000, while the Gaussian image’s merge shrinks 1.7-fold', () => {
		// fewer draws than the figure's 400, so a looser tolerance
		const seeds = Array.from({ length: 80 }, (_, i) => i + 1);
		const at3 = mergeSeparation(3, seeds, 0.05, 0.5, 6, 9);
		const at6 = mergeSeparation(6, seeds, 0.005, 0.06, 6, 9);
		expect(at3 / MERGE[3]).toBeGreaterThan(0.85);
		expect(at3 / MERGE[3]).toBeLessThan(1.15);
		expect(at6 / MERGE[6]).toBeGreaterThan(0.85);
		expect(at6 / MERGE[6]).toBeLessThan(1.15);
		const shrink = at3 / at6;
		expect(shrink).toBeGreaterThan(6.5);
		expect(shrink).toBeLessThan(11);
		expect(MERGE[3] / MERGE[6]).toBeCloseTo(8.6, 1);
		expect(shrink).toBeGreaterThan(2 * (wienerMerge(3) / wienerMerge(6)));
	}, 240_000);
});
