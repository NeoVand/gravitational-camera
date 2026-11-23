/** Chapter 2.1's mean value figure: the square that relaxes, the probe circle, and the gold round the camera. */
import { describe, expect, it } from 'vitest';
import {
	CELLS,
	DRAW,
	FLAT,
	G,
	GOLD_AT_CAMERA,
	GOLD_DISTANCE,
	GOLD_MASS,
	NODES,
	PATTERNS,
	circle,
	circleInside,
	contour,
	extremes,
	goldAverage,
	holdsGold,
	inverseAverage,
	lineLevels,
	lineStep,
	nodeX,
	nodeY,
	plate,
	relax,
	residual,
	sampledGoldAverage,
	sampledInverseAverage,
	settle,
	setEdges,
	spherePoints,
	valueAt,
	type Pattern
} from './mean-value';

/** The largest difference between a plate's values and a pattern, over all nodes. */
function distance(values: Float64Array, pattern: Pattern) {
	let most = 0;
	for (let j = 0; j < NODES; j++)
		for (let i = 0; i < NODES; i++)
			most = Math.max(
				most,
				Math.abs(values[j * NODES + i] - PATTERNS[pattern].f(nodeX(i), nodeY(j)))
			);
	return most;
}

/** A plate whose inside starts at zero and whose edges hold the pattern, relaxed until it settles. */
function relaxedFromZero(pattern: Pattern) {
	const p = plate('zero');
	setEdges(p, pattern, FLAT);
	const sweeps = settle(p);
	return { p, sweeps };
}

describe('the square', () => {
	it('has 40 cells a side, from −1 to 1', () => {
		expect(CELLS).toBe(40);
		expect(nodeX(0)).toBe(-1);
		expect(nodeX(CELLS)).toBeCloseTo(1, 12);
		expect(nodeY(0)).toBe(1);
		expect(nodeY(CELLS)).toBeCloseTo(-1, 12);
	});

	it('settles, from zero inside, to x² − y² when the edges hold x² − y², to 10⁻⁶', () => {
		const { p, sweeps } = relaxedFromZero('saddle');
		expect(distance(p.values, 'saddle')).toBeLessThan(1e-6);
		// a few thousand sweeps: about twenty frames of 200
		expect(sweeps).toBeGreaterThan(1000);
		expect(sweeps).toBeLessThan(20000);
	});

	it('settles to x³ − 3xy² likewise', () => {
		const { p } = relaxedFromZero('cubic');
		expect(distance(p.values, 'cubic')).toBeLessThan(1e-6);
	});

	it('opens settled: the two patterns are already the average of their neighbours', () => {
		for (const pattern of ['saddle', 'cubic'] as const)
			expect(residual(plate(pattern).values)).toBeLessThan(1e-14);
		// x² is not: its four neighbours average b²/2 more than the centre, a quarter of b² times its Laplacian, 2
		const p = plate('zero');
		for (let j = 0; j < NODES; j++)
			for (let i = 0; i < NODES; i++) p.values[j * NODES + i] = nodeX(i) ** 2;
		expect(residual(p.values)).toBeCloseTo((2 / CELLS) ** 2 / 2, 12);
	});

	it('changes no edge node as it relaxes', () => {
		const raise = { top: 3, right: -1, bottom: 0.5, left: 0 };
		const p = plate('saddle', raise);
		const before = Float64Array.from(p.values);
		relax(p, 333);
		for (let j = 0; j < NODES; j++)
			for (let i = 0; i < NODES; i++) {
				if (i > 0 && i < CELLS && j > 0 && j < CELLS) continue;
				expect(p.values[j * NODES + i]).toBe(before[j * NODES + i]);
			}
		// an edge is raised most at its middle, as sin(π s) along it, and not at all at its corners
		expect(p.values[20]).toBeCloseTo(PATTERNS.saddle.f(0, 1) + 3, 12);
		expect(p.values[5]).toBeCloseTo(PATTERNS.saddle.f(nodeX(5), 1) + 3 * Math.sin(Math.PI / 8), 12);
		expect(p.values[0]).toBeCloseTo(PATTERNS.saddle.f(-1, 1), 12);
		expect(p.values[20 * NODES + CELLS]).toBeCloseTo(PATTERNS.saddle.f(1, 0) - 1, 12);
	});

	it('obeys the maximum principle: nothing inside rises above the edges or sinks below them', () => {
		for (const [pattern, raise] of [
			['zero', { top: 5, right: 0, bottom: 0, left: 0 }],
			['saddle', { top: 0, right: 2, bottom: -3, left: 1 }],
			['cubic', { top: -5, right: 5, bottom: 5, left: -5 }]
		] as const) {
			const p = plate(pattern, raise);
			settle(p);
			const e = extremes(p.values);
			expect(e.insideMax).toBeLessThan(e.edgeMax);
			expect(e.insideMin).toBeGreaterThan(e.edgeMin);
		}
	});
});

describe('the probe circle', () => {
	const saddle = plate('saddle');
	settle(saddle);

	it('reads the chapter’s value at (0.3, 0.2): x² − y² = 0.05', () => {
		expect(valueAt(saddle.values, 0.3, 0.2)).toBeCloseTo(0.05, 3);
		expect(Number.isNaN(valueAt(saddle.values, 1.2, 0))).toBe(true);
	});

	it('averages to the value at its centre, for circles in the square, to a ten-thousandth', () => {
		for (const [cx, cy, r] of [
			[0.3, 0.2, 0.5],
			[0, 0, 1],
			[-0.4, 0.55, 0.3],
			[0.7, -0.6, 0.25],
			[0.12, -0.07, 0.07]
		]) {
			expect(circleInside(cx, cy, r)).toBe(true);
			const c = circle(saddle.values, cx, cy, r);
			expect(c.inside).toBe(1);
			expect(Math.abs(c.average - valueAt(saddle.values, cx, cy))).toBeLessThan(1e-4);
		}
	});

	it('does so, to a thousandth, after an edge is raised by 5 and the inside has settled', () => {
		const p = plate('zero', { top: 5, right: 0, bottom: 0, left: 0 });
		settle(p);
		for (const [cx, cy, r] of [
			[0, 0.5, 0.45],
			[0.6, 0.6, 0.35],
			[0, 0, 0.9]
		]) {
			const c = circle(p.values, cx, cy, r);
			expect(Math.abs(c.average - valueAt(p.values, cx, cy))).toBeLessThan(1e-3);
		}
	});

	it('does not while the averaging has not settled', () => {
		const p = plate('zero', { top: 5, right: 0, bottom: 0, left: 0 });
		relax(p, 40);
		const c = circle(p.values, 0, 0.5, 0.45);
		expect(Math.abs(c.average - valueAt(p.values, 0, 0.5))).toBeGreaterThan(0.05);
	});

	it('averages only over its part in the square when it crosses an edge, and then differs', () => {
		const c = circle(saddle.values, 0.8, 0, 0.5);
		expect(circleInside(0.8, 0, 0.5)).toBe(false);
		expect(c.inside).toBeGreaterThan(0.3);
		expect(c.inside).toBeLessThan(0.9);
		expect(Math.abs(c.average - valueAt(saddle.values, 0.8, 0))).toBeGreaterThan(0.05);
	});
});

describe('the lines of constant h', () => {
	it('are spaced 0.2 for edges of size 1, four on each side of zero', () => {
		expect(lineStep(1)).toBeCloseTo(0.2, 12);
		expect(lineLevels(1, 0.2)).toEqual([-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8]);
		expect(lineStep(6)).toBeCloseTo(1, 12);
		expect(lineStep(4)).toBeCloseTo(0.5, 12);
		expect(lineStep(2.5)).toBeCloseTo(0.5, 12);
	});

	it('trace x² − y² = 0 along the diagonals', () => {
		const p = plate('saddle');
		const segs = contour(p.values, 0);
		expect(segs.length).toBeGreaterThan(0);
		for (let n = 0; n < segs.length; n += 2)
			expect(Math.abs(Math.abs(segs[n]) - Math.abs(segs[n + 1]))).toBeLessThan(0.03);
	});

	it('trace x² − y² = 0.4 where it is 0.4, to the grid’s accuracy', () => {
		const p = plate('saddle');
		const segs = contour(p.values, 0.4);
		for (let n = 0; n < segs.length; n += 2)
			expect(Math.abs(PATTERNS.saddle.f(segs[n], segs[n + 1]) - 0.4)).toBeLessThan(2e-3);
	});
});

describe('the average of 1/|x − y| over a sphere', () => {
	/** The practice problem's integral, ½ ∫ dμ / √(D² + R² − 2DRμ) from −1 to 1, by the midpoint rule. */
	function bands(D: number, R: number, n = 200000) {
		let s = 0;
		for (let k = 0; k < n; k++) {
			const mu = -1 + (2 * (k + 0.5)) / n;
			s += 1 / Math.sqrt(D * D + R * R - 2 * D * R * mu);
		}
		return (s * (2 / n)) / 2;
	}

	it('is 1/|y| when y lies outside the sphere and 1/R when inside', () => {
		for (const [D, R] of [
			[3, 1],
			[2, 1],
			[3.92, 2],
			[3.92, 5],
			[0.5, 1],
			[0, 2]
		]) {
			expect(inverseAverage(D, R)).toBeCloseTo(1 / Math.max(D, R), 14);
			if (D > 0) expect(bands(D, R)).toBeCloseTo(inverseAverage(D, R), 6);
		}
		// the chapter's check question: a sphere of 1 m, |y| = 3 m
		expect(inverseAverage(3, 1)).toBeCloseTo(1 / 3, 14);
	});

	it('is found by a seeded draw: 0.5 for R = 1, |y| = 2, and 1 for |y| inside', () => {
		const points = spherePoints(7, 400000);
		const out = sampledInverseAverage(points, 2, 1);
		expect(Math.abs(out.mean - 0.5)).toBeLessThan(4 * out.error);
		expect(out.mean).toBeCloseTo(0.5, 3);
		const inside = sampledInverseAverage(points, 0.5, 1);
		expect(inside.mean).toBeCloseTo(1, 2);
	});

	it('draws points on the unit sphere, spread evenly, the same for the same seed', () => {
		const a = spherePoints(3, 20000);
		const b = spherePoints(3, 20000);
		const c = spherePoints(4, 20000);
		expect(Array.from(a.slice(0, 30))).toEqual(Array.from(b.slice(0, 30)));
		expect(a[0]).not.toBe(c[0]);
		let mean = [0, 0, 0];
		for (let n = 0; n < 20000; n++) {
			expect(Math.hypot(a[3 * n], a[3 * n + 1], a[3 * n + 2])).toBeCloseTo(1, 12);
			mean = mean.map((m, k) => m + a[3 * n + k] / 20000);
		}
		for (const m of mean) expect(Math.abs(m)).toBeLessThan(0.02);
		expect(spherePoints(1).length).toBe(3 * DRAW);
	});
});

describe('the gold round the camera', () => {
	it('makes the chapter’s potential at the camera: −5.52 × 10⁻⁹ J/kg', () => {
		expect(GOLD_MASS).toBe(324);
		expect(GOLD_DISTANCE).toBe(3.92);
		expect(GOLD_AT_CAMERA).toBeCloseTo((-G * 324) / 3.92, 20);
		expect(GOLD_AT_CAMERA.toPrecision(3)).toBe('-5.52e-9');
	});

	it('averages to the same over a sphere of 2 m, which holds no gold', () => {
		expect(holdsGold(2)).toBe(false);
		expect(goldAverage(2)).toBe(GOLD_AT_CAMERA);
	});

	it('averages to −GM/R = −4.32 × 10⁻⁹ over a sphere of 5 m, a fifth smaller in size', () => {
		expect(holdsGold(5)).toBe(true);
		expect(goldAverage(5).toPrecision(3)).toBe('-4.32e-9');
		expect(goldAverage(5).toPrecision(2)).toBe('-4.3e-9');
		const smaller = 1 - goldAverage(5) / GOLD_AT_CAMERA;
		expect(smaller).toBeGreaterThan(0.18);
		expect(smaller).toBeLessThan(0.22);
	});

	it('is found by the figure’s draw to the three figures it shows', () => {
		const points = spherePoints(1);
		for (const R of [0.5, 2, 3, 5, 6]) {
			const s = sampledGoldAverage(points, R);
			expect(Math.abs(s.mean - goldAverage(R))).toBeLessThan(4 * s.error);
			expect(s.error / Math.abs(goldAverage(R))).toBeLessThan(2e-3);
		}
	});
});
