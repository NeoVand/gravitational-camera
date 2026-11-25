/** The numbers of chapter 0.3's graviton count, against the numbers the chapter and the paper print. */
import { describe, expect, it } from 'vitest';
import {
	COUNTS_PER_ELEMENT,
	LIFETIME,
	MOST_DOTS,
	SOURCES,
	STEPS,
	YEAR,
	countBy,
	expectedCount,
	expose,
	generator,
	logFactorial,
	pictureElements,
	poisson,
	poissonChance,
	tileBrightness,
	tileEstimate,
	tiling,
	timeFor
} from './graviton-count';

describe('the counts of the paper’s budget', () => {
	it('needs 2500 counts for ten per cent at five standard deviations', () => {
		expect(COUNTS_PER_ELEMENT).toBe(2500);
		// the spread of 2500 counts is 50, two per cent of them, a fifth of the ten per cent sought
		expect(Math.sqrt(COUNTS_PER_ELEMENT) / COUNTS_PER_ELEMENT).toBeCloseTo(0.02, 12);
	});

	it('gives about 35,000 counts from the Earth below in a lifetime, and fourteen picture elements', () => {
		const mu = expectedCount(SOURCES.earth, 1, LIFETIME);
		expect(mu).toBeCloseTo(35064, 0);
		// the chapter's 35,000 and the paper's 3.6 × 10⁴, to their figures
		expect(Math.abs(mu - 35000) / 35000).toBeLessThan(0.01);
		expect(Math.round(mu / 1e3)).toBe(35);
		expect(pictureElements(mu)).toBe(14);
		expect(Math.sqrt(mu)).toBeCloseTo(187.3, 1);
	});

	it('collects 2500 from the Sun’s core on one square metre in about 42 minutes', () => {
		expect(timeFor(SOURCES.sun, 1, COUNTS_PER_ELEMENT) / 60).toBeCloseTo(41.7, 1);
	});

	it('waits tens of millions of years for one count from the furnace and the turning pair', () => {
		expect(timeFor(SOURCES.iron, 1, 1) / YEAR).toBeCloseTo(1.1e8, -5);
		expect(timeFor(SOURCES.pair, 1, 1) / YEAR).toBeCloseTo(4e7, -5);
		// a lifetime: under one chance in a million of a single count
		const mu = expectedCount(SOURCES.iron, 1, LIFETIME);
		expect(1 - poissonChance(0, mu)).toBeLessThan(1e-6);
	});

	it('spreads the hot iron’s gravitons over a sphere as wide as the line of sight, 3.86 m', () => {
		// R10's block: 5.4 × 10⁻¹⁴ gravitons a second in all directions
		const rate = 5.4e-14;
		const wait = (r: number) => (4 * Math.PI * r ** 2) / rate / YEAR;
		// "4π(3.86 m)² = 187 m²", "1.1 × 10⁸ years", the table's row "at 3.9 m"
		expect(Math.round(4 * Math.PI * 3.86 ** 2)).toBe(187);
		expect(Number(wait(3.86).toPrecision(2))).toBe(1.1e8);
		expect(SOURCES.iron.every / YEAR).toBe(1.1e8);
		expect(SOURCES.iron.scene).toContain('3.9 m');
		// the furnace's 3.5 m along the floor would have given 9.0 × 10⁷ years
		expect(Number(wait(3.5).toPrecision(2))).toBe(9.0e7);
	});

	it('gives the hot iron no picture element on a square metre even in 10¹⁰ years', () => {
		expect(pictureElements(expectedCount(SOURCES.iron, 1, 1e10 * YEAR))).toBe(0);
		expect(Math.round(expectedCount(SOURCES.iron, 1, 1e10 * YEAR))).toBe(91);
		// the first element on a square metre: 2500 × 1.1 × 10⁸ = 2.75 × 10¹¹ years
		expect(timeFor(SOURCES.iron, 1, COUNTS_PER_ELEMENT) / YEAR).toBeCloseTo(2.75e11, -8);
	});

	it('counts picture elements only when they are whole', () => {
		expect(pictureElements(2499)).toBe(0);
		expect(pictureElements(2500)).toBe(1);
		expect(pictureElements(34999)).toBe(13);
		expect(pictureElements(35000)).toBe(14);
	});
});

describe('the Poisson draws', () => {
	it('match ln k! and the chances of a count', () => {
		expect(logFactorial(0)).toBe(0);
		expect(logFactorial(10)).toBeCloseTo(Math.log(3628800), 10);
		// Stirling's series against the table at the join
		let exact = 0;
		for (let k = 2; k <= 300; k++) exact += Math.log(k);
		expect(logFactorial(300)).toBeCloseTo(exact, 8);
		expect(poissonChance(0, 1)).toBeCloseTo(Math.exp(-1), 12);
		let sum = 0;
		for (let k = 0; k < 60; k++) sum += poissonChance(k, 12);
		expect(sum).toBeCloseTo(1, 10);
	});

	it('have the mean μ and the spread √μ, small and large', () => {
		for (const mu of [0.3, 3, 29, 50, 2500, 1e6, 1e12]) {
			const random = generator(7 + Math.round(Math.log(mu + 1)));
			const n = 20000;
			let s = 0;
			let s2 = 0;
			for (let i = 0; i < n; i++) {
				const k = poisson(mu, random);
				expect(Number.isInteger(k) && k >= 0).toBe(true);
				s += k - mu;
				s2 += (k - mu) ** 2;
			}
			const mean = s / n;
			const variance = s2 / n - mean ** 2;
			// the mean to five of its standard errors, the variance to six per cent
			expect(Math.abs(mean)).toBeLessThan(5 * Math.sqrt(mu / n));
			expect(variance / mu).toBeGreaterThan(0.94);
			expect(variance / mu).toBeLessThan(1.06);
		}
	});

	it('give a count of nought as often as e^(−μ)', () => {
		const random = generator(3);
		let zeros = 0;
		const n = 40000;
		for (let i = 0; i < n; i++) if (poisson(1, random) === 0) zeros++;
		expect(Math.abs(zeros / n - Math.exp(-1))).toBeLessThan(0.01);
	});
});

describe('the picture', () => {
	it('is cut into tiles of equal area that fill it', () => {
		for (const n of [1, 2, 3, 7, 14, 15, 100, 1024]) {
			const tiles = tiling(n);
			expect(tiles).toHaveLength(n);
			const total = tiles.reduce((s, t) => s + t.w * t.h, 0);
			expect(total).toBeCloseTo(1, 12);
			for (const t of tiles) {
				expect(t.w * t.h).toBeCloseTo(1 / n, 12);
				expect(t.x + t.w).toBeLessThanOrEqual(1 + 1e-12);
				expect(t.y + t.h).toBeLessThanOrEqual(1 + 1e-12);
			}
		}
	});

	it('has rings ten per cent apart, brightest in the middle', () => {
		const middle = tileBrightness({ x: 0.45, y: 0.45, w: 0.1, h: 0.1 });
		const corner = tileBrightness({ x: 0, y: 0, w: 0.05, h: 0.05 });
		expect(middle).toBeCloseTo(1.3, 10);
		expect(corner).toBeCloseTo(1, 10);
	});
});

describe('one exposure', () => {
	const mu = expectedCount(SOURCES.earth, 1, LIFETIME);
	const shot = expose(mu, 1);

	it('has a picture element for each 2500 counts, and adds up', () => {
		expect(shot.elements).toBe(14);
		expect(shot.tiles).toHaveLength(14);
		expect(shot.tiles.reduce((s, t) => s + t.mean, 0)).toBeCloseTo(mu, 6);
		expect(shot.tiles.reduce((s, t) => s + t.counts[STEPS], 0)).toBe(shot.total);
		// one draw of 35,000 lies within a few spreads of 187
		expect(Math.abs(shot.total - mu)).toBeLessThan(5 * Math.sqrt(mu));
		for (let j = 1; j <= STEPS; j++)
			expect(shot.counts[j]).toBeGreaterThanOrEqual(shot.counts[j - 1]);
	});

	it('thins its arrivals to 500 dots, in order, and tallies to the whole count', () => {
		expect(shot.dots).toHaveLength(MOST_DOTS);
		for (let i = 1; i < shot.dots.length; i++)
			expect(shot.dots[i].t).toBeGreaterThanOrEqual(shot.dots[i - 1].t);
		expect(countBy(shot, 0)).toBe(0);
		expect(countBy(shot, 1)).toBe(shot.total);
		expect(countBy(shot, 0.5)).toBe(shot.counts[STEPS / 2]);
		expect(shot.perDot).toBeCloseTo(shot.total / MOST_DOTS, 12);
	});

	it('shows every arrival while there are few', () => {
		const few = expose(expectedCount(SOURCES.earth, 1, YEAR), 4);
		expect(few.elements).toBe(0);
		expect(few.tiles).toHaveLength(1);
		expect(few.dots).toHaveLength(few.total);
		expect(countBy(few, 1)).toBe(few.total);
	});

	it('is the same for the same seed', () => {
		const again = expose(mu, 1);
		expect(again.total).toBe(shot.total);
		expect(again.dots[17]).toEqual(shot.dots[17]);
		expect(expose(mu, 2).total).not.toBe(shot.total);
	});

	it('tells each tile’s brightness to about 1/√N by its end', () => {
		for (const tile of shot.tiles) {
			const estimate = tileEstimate(shot, tile, 1)!;
			const spread = tile.truth / Math.sqrt(tile.mean);
			expect(Math.abs(estimate - tile.truth)).toBeLessThan(5 * spread);
		}
		expect(tileEstimate(shot, shot.tiles[0], 0)).toBeUndefined();
	});

	it('draws at most 1024 tiles however long the exposure', () => {
		const long = expose(expectedCount(SOURCES.sun, 100, 1e10 * YEAR), 5);
		expect(long.elements).toBeGreaterThan(1e12);
		expect(long.tiles).toHaveLength(1024);
		expect(long.dots).toHaveLength(MOST_DOTS);
	});
});
