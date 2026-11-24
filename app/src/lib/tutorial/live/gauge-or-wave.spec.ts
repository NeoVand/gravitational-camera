/**
 * Chapter 7.4's gauge or wave: the figure's model against the chapter. The shift ζ_x = ε cos(kx − ωt) gives
 * h′_xx = 2εk sin(kx − ωt) and h′_0x = −(εω/c) sin(kx − ωt); the linearized curvature of any pure-gauge table is zero
 * to rounding; the proper separations of neighbouring balls never change under the ripple of labels, and a real
 * plus-polarized wave changes them by up to h₊/2; the tide at the centre is −½∂²_t h₊ and the gauge shift leaves it
 * alone; and each prediction is answered only once the reader has done what it asks.
 */
import { describe, expect, it } from 'vitest';
import {
	BALLS,
	C,
	GAUGE,
	GRID,
	K,
	MARKED,
	OMEGA,
	OPENING,
	PAIRS,
	RADIUS,
	RINGS,
	SPEED,
	WATCH,
	WAVE,
	centreTide,
	clampTo,
	drawnAt,
	event,
	figureGauge,
	figurePlanes,
	gaugeChange,
	gaugePlane,
	gaugeSizes,
	label,
	largestChange,
	largestComponent,
	lineAt,
	linesAt,
	meanCos,
	noteFirst,
	noteSecond,
	noteThird,
	pairChange,
	peakChange,
	peakTide,
	plusWave,
	riemann,
	ruled,
	separationChange,
	stepped,
	table,
	texTwo,
	tide,
	tideCheck,
	two,
	zero4,
	zetaGradient,
	type Gauge,
	type Point,
	type Vec4
} from './gauge-or-wave';

/** A repeatable stream of numbers in [0, 1). */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

const between = (r: () => number, a: number, b: number) => a + (b - a) * r();

describe('the gauge change of the table', () => {
	it('gives the chapter’s h′_xx = 2εk sin(kx − ωt) and h′_0x = −(εω/c) sin(kx − ωt) from flat spacetime', () => {
		const r = random(7);
		for (let n = 0; n < 50; n++) {
			const eps = between(r, 0.001, 0.3);
			const k = between(r, 0.1, 5);
			const omega = between(r, 0.1, 5);
			const c = between(r, 1, 50);
			const g = figureGauge(eps, k, omega, c);
			const t = between(r, -3, 3);
			const x: Vec4 = [c * t, between(r, -3, 3), between(r, -3, 3), between(r, -3, 3)];
			const h = gaugeChange(zero4(), zetaGradient(g, x));
			const s = Math.sin(k * x[1] - omega * t);
			expect(h[1][1]).toBeCloseTo(2 * eps * k * s, 12);
			expect(h[0][1]).toBeCloseTo(-((eps * omega) / c) * s, 12);
			expect(h[1][0]).toBe(h[0][1]);
			// nothing else
			for (let m = 0; m < 4; m++)
				for (let q = 0; q < 4; q++)
					if (!((m === 1 && q === 1) || m + q === 1)) expect(h[m][q]).toBe(0);
			// the same table as a plane wave
			const p = table([gaugePlane(g)], x);
			for (let m = 0; m < 4; m++)
				for (let q = 0; q < 4; q++) expect(p[m][q]).toBeCloseTo(h[m][q], 12);
		}
	});

	it('adds to a table already there', () => {
		const g = figureGauge(0.2);
		const x = event([0.4, -1.1], 0.7);
		const before = table([plusWave(0.1)], x);
		const after = gaugeChange(before, zetaGradient(g, x));
		const both = table([plusWave(0.1), gaugePlane(g)], x);
		for (let m = 0; m < 4; m++)
			for (let q = 0; q < 4; q++) expect(after[m][q]).toBeCloseTo(both[m][q], 14);
	});

	it('has the sizes 2εk and εω/c, the chapter’s 2 × 10⁻³ for ε = 1 mm and k = 1 m⁻¹', () => {
		expect(gaugeSizes(1e-3, 1, 1, 1).xx).toBeCloseTo(2e-3, 15);
		expect(gaugeSizes(1e-3, 1, 2 * Math.PI, 299792458).tx).toBeCloseTo(
			(2 * Math.PI * 1e-3) / 299792458,
			20
		);
		expect(gaugeSizes(1e-3, 1, 1, 1).xx / 1e-21 / 2e18).toBeCloseTo(1, 12);
		// the figure's: k = π/2 per spacing, the ripple at a tenth of c
		const s = gaugeSizes(0.2);
		expect(s.xx).toBeCloseTo(0.2 * Math.PI, 12);
		expect(s.tx).toBeCloseTo(0.2 * K * SPEED, 12);
		expect(OMEGA / K / C).toBeCloseTo(SPEED, 12);
		// the largest entries of the table over a period are those sizes
		let xx = 0;
		let tx = 0;
		for (let i = 0; i < 64; i++) {
			const h = table(figurePlanes({ gauge: 0.2, wave: 0, phase: 0 }), event([(4 * i) / 64, 0], 0));
			xx = Math.max(xx, Math.abs(h[1][1]));
			tx = Math.max(tx, Math.abs(h[0][1]));
		}
		expect(xx).toBeCloseTo(s.xx, 10);
		expect(tx).toBeCloseTo(s.tx, 10);
	});

	it('keeps the labels in order: εk < 1 at the slider’s top', () => {
		expect(GAUGE.max * K).toBeLessThan(1);
	});
});

describe('the curvature of a pure-gauge table', () => {
	it('is zero to rounding for random amplitudes, wavenumbers, speeds and directions of ζ', () => {
		const r = random(11);
		for (let n = 0; n < 200; n++) {
			const eps = between(r, 1e-4, 1);
			const k: Vec4 = [between(r, -5, 5), between(r, -5, 5), between(r, -5, 5), between(r, -5, 5)];
			const e: Vec4 = [between(r, -1, 1), between(r, -1, 1), between(r, -1, 1), between(r, -1, 1)];
			const g: Gauge = { eps, e, k };
			const x: Vec4 = [between(r, -9, 9), between(r, -9, 9), between(r, -9, 9), between(r, -9, 9)];
			const size = eps * Math.max(...k.map(Math.abs)) ** 3;
			expect(largestComponent(riemann([gaugePlane(g)], x))).toBeLessThan(1e-13 * Math.max(size, 1));
		}
	});

	it('is zero for the chapter’s ζ_x at any speed ω/k', () => {
		const r = random(3);
		for (let n = 0; n < 100; n++) {
			const g = figureGauge(between(r, 0.01, 0.3), between(r, 0.1, 10), between(r, 0.01, 100), C);
			const x = event([between(r, -3, 3), between(r, -3, 3)], between(r, 0, 2 * Math.PI));
			expect(largestComponent(riemann([gaugePlane(g)], x))).toBeLessThan(1e-12);
		}
	});

	it('is not zero for a real wave, and the gauge shift leaves it as it was', () => {
		const x = event([0.3, -0.8], 0.4);
		const wave = riemann([plusWave(0.2)], x);
		expect(largestComponent(wave)).toBeGreaterThan(0.01 / C ** 2);
		const both = riemann([plusWave(0.2), gaugePlane(figureGauge(0.3))], x);
		for (let a = 0; a < 4; a++)
			for (let b = 0; b < 4; b++)
				for (let g = 0; g < 4; g++)
					for (let d = 0; d < 4; d++) expect(both[a][b][g][d]).toBeCloseTo(wave[a][b][g][d], 14);
	});

	it('has the symmetries of the Riemann tensor', () => {
		const R = riemann([plusWave(0.25), gaugePlane(figureGauge(0.1))], event([0.5, 0.2], 1.1));
		for (let a = 0; a < 4; a++)
			for (let b = 0; b < 4; b++)
				for (let g = 0; g < 4; g++)
					for (let d = 0; d < 4; d++) {
						expect(R[a][b][g][d]).toBeCloseTo(-R[b][a][g][d], 14);
						expect(R[a][b][g][d]).toBeCloseTo(R[g][d][a][b], 14);
					}
	});
});

describe('the tide at the centre', () => {
	it('is −½∂²_t h₊ = ½h₊ω² cos ωt for the wave, and nothing for the gauge shift', () => {
		const r = random(5);
		for (let n = 0; n < 50; n++) {
			const s = { gauge: between(r, 0, 0.3), wave: between(r, 0, 0.3), phase: between(r, 0, 7) };
			expect(centreTide(s)).toBeCloseTo(tideCheck(s), 12);
			expect(centreTide({ ...s, wave: 0 })).toBe(0);
		}
		// along y the opposite, and nothing out of the screen, along the wave
		const t = tide(figurePlanes({ gauge: 0.2, wave: 0.2, phase: 0 }), event([0, 0], 0));
		expect(t[0][0]).toBeCloseTo(0.1, 12);
		expect(t[1][1]).toBeCloseTo(-0.1, 12);
		expect(t[2][2]).toBeCloseTo(0, 12);
		expect(t[0][1]).toBeCloseTo(0, 12);
	});

	it('swings between ±h₊/2 over a period, and is zero with only the gauge shift on', () => {
		expect(peakTide({ gauge: 0.2, wave: 0.2 })).toBeCloseTo(0.1, 12);
		expect(peakTide({ gauge: 0.3, wave: 0 })).toBe(0);
	});
});

describe('the proper separations of neighbouring balls', () => {
	it('never change under the ripple of labels, for random shifts, wavenumbers, speeds and pairs', () => {
		const r = random(13);
		for (let n = 0; n < 300; n++) {
			const g: Gauge = {
				eps: between(r, 1e-3, 1),
				// a spatial shift, which leaves the slices of constant time alone
				e: [0, between(r, -1, 1), between(r, -1, 1), between(r, -1, 1)],
				k: [between(r, -5, 5), between(r, -5, 5), between(r, -5, 5), between(r, -5, 5)]
			};
			const t = between(r, -5, 5);
			const a: Vec4 = [t, between(r, -3, 3), between(r, -3, 3), between(r, -3, 3)];
			const b: Vec4 = [t, a[1] + between(r, -0.5, 0.5), a[2] + between(r, -0.5, 0.5), a[3]];
			expect(Math.abs(separationChange(a, b, [], [g]))).toBeLessThan(1e-12);
		}
	});

	it('never change in the figure with only the gauge shift on, at any phase', () => {
		for (const phase of [0, 0.4, 1.3, 2.9, 4.4]) {
			const s = { gauge: GAUGE.max, wave: 0, phase };
			for (const p of PAIRS) expect(Math.abs(pairChange(s, p))).toBeLessThan(1e-14);
			expect(largestChange(s)).toBe(0);
		}
		expect(peakChange({ gauge: 0.2, wave: 0 })).toBe(0);
	});

	it('agree to first order with the length of the line between the balls in the new labels, measured with the metric', () => {
		// a direct sum along the line, by many short steps, with g′_ij = δ_ij + h′_ij: what is left is of second order
		const s = { gauge: 1e-5, wave: 1e-5, phase: 0.9 };
		const planes = figurePlanes(s);
		const g = figureGauge(s.gauge);
		const length = (a: Point, b: Point) => {
			const A = label(a, s);
			const B = label(b, s);
			const n = 400;
			let L = 0;
			for (let i = 0; i < n; i++) {
				const f = (i + 0.5) / n;
				// the table at the old labels of the step's middle (the chapter's footnote: the same to first order)
				const mid: Point = [a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])];
				const h = table(planes, event(mid, s.phase));
				const d = [(B[0] - A[0]) / n, (B[1] - A[1]) / n];
				L += Math.sqrt(
					(1 + h[1][1]) * d[0] ** 2 + 2 * h[1][2] * d[0] * d[1] + (1 + h[2][2]) * d[1] ** 2
				);
			}
			return L;
		};
		for (const [a, b] of PAIRS.slice(0, 40)) {
			const L0 = Math.hypot(b[0] - a[0], b[1] - a[1]);
			const direct = length(a, b) / L0 - 1;
			const read = separationChange(event(a, s.phase), event(b, s.phase), [plusWave(s.wave)], [g]);
			expect(Math.abs(direct - read)).toBeLessThan(1e-8);
		}
	});

	it('change by ½h₊ cos ωt (n_x² − n_y²) under a real wave, h₊/2 at most', () => {
		const r = random(17);
		for (let n = 0; n < 50; n++) {
			const s = { gauge: 0, wave: between(r, 0.01, 0.3), phase: between(r, 0, 7) };
			for (const p of PAIRS.slice(0, 30)) {
				const [a, b] = p;
				const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
				const nx = (b[0] - a[0]) / L;
				const ny = (b[1] - a[1]) / L;
				expect(pairChange(s, p)).toBeCloseTo(
					0.5 * s.wave * Math.cos(s.phase) * (nx * nx - ny * ny),
					12
				);
			}
		}
		expect(peakChange({ gauge: 0, wave: 0.2 })).toBeCloseTo(0.1, 12);
		expect(largestChange({ gauge: 0, wave: 0.2, phase: 0 })).toBeCloseTo(0.1, 12);
		expect(largestChange({ gauge: 0, wave: 0.2, phase: Math.PI })).toBeCloseTo(-0.1, 12);
	});

	it('are the same with the gauge shift on as without it', () => {
		const r = random(19);
		for (let n = 0; n < 30; n++) {
			const s = { gauge: between(r, 0, 0.3), wave: between(r, 0, 0.3), phase: between(r, 0, 7) };
			for (const p of PAIRS)
				expect(pairChange(s, p)).toBeCloseTo(pairChange({ ...s, gauge: 0 }, p), 13);
		}
	});

	it('average a cosine exactly along a line', () => {
		const r = random(23);
		for (let n = 0; n < 50; n++) {
			const a = between(r, -9, 9);
			const b = a + between(r, -3, 3);
			let sum = 0;
			const m = 20000;
			for (let i = 0; i < m; i++) sum += Math.cos(a + ((i + 0.5) / m) * (b - a));
			expect(meanCos(a, b)).toBeCloseTo(sum / m, 7);
		}
		expect(meanCos(1.2, 1.2)).toBeCloseTo(Math.cos(1.2), 14);
	});
});

describe('the balls and the lines', () => {
	it('are 25 rings of twelve, a spacing apart, with neighbours on each ring and across each gap', () => {
		expect(RINGS).toHaveLength(GRID * GRID);
		expect(RINGS.every((r) => r.balls.length === BALLS)).toBe(true);
		expect(RINGS[12].centre).toEqual([0, 0]);
		expect(PAIRS).toHaveLength(25 * 12 + 2 * 5 * 4);
		const across = PAIRS.slice(0).filter(
			([a, b]) => Math.abs(Math.hypot(b[0] - a[0], b[1] - a[1]) - (1 - 2 * RADIUS)) < 1e-12
		);
		expect(across).toHaveLength(40);
		expect(MARKED[0][0]).toBeCloseTo(RADIUS, 12);
		expect(MARKED[1][0]).toBeCloseTo(1 - RADIUS, 12);
	});

	it('give each ball the label x + ε cos(kx − ωt), and the line of a label passes through the ball that carries it', () => {
		const s = { gauge: 0.3, wave: 0, phase: 1.7 };
		const r = random(29);
		for (let n = 0; n < 50; n++) {
			const x = between(r, -3, 3);
			const [xp] = label([x, 0.4], s);
			expect(xp).toBeCloseTo(x + 0.3 * Math.cos(K * x - 1.7), 14);
			expect(lineAt(xp, s)).toBeCloseTo(x, 11);
		}
	});

	it('draw, as rulers measure, the balls still under the gauge shift and moved by the wave; at their labels, the other way round', () => {
		const p: Point = [1.3, -0.7];
		const gauge = { gauge: 0.2, wave: 0, phase: 0.6 };
		expect(drawnAt(p, gauge, 'rulers')).toEqual(p);
		expect(drawnAt(p, gauge, 'labels')[0]).not.toBeCloseTo(p[0], 3);
		const wave = { gauge: 0, wave: 0.2, phase: 0 };
		expect(drawnAt(p, wave, 'labels')).toEqual(p);
		expect(ruled(p, wave)[0]).toBeCloseTo(1.3 * 1.1, 12);
		expect(ruled(p, wave)[1]).toBeCloseTo(-0.7 * 0.9, 12);
		// the lines: straight and even at the labels; rippled along x as rulers measure
		expect(linesAt(1, gauge, 'labels')).toEqual({ x: 1, y: 1 });
		expect(linesAt(1, gauge, 'rulers').x).not.toBeCloseTo(1, 3);
		expect(linesAt(1, gauge, 'rulers').y).toBe(1);
	});
});

describe('the sliders', () => {
	it('step by 0.01, by 0.05 with Shift, and stop at the ends', () => {
		expect(stepped(0.2, 'ArrowRight', false, GAUGE)).toBeCloseTo(0.21, 12);
		expect(stepped(0.2, 'ArrowLeft', true, GAUGE)).toBeCloseTo(0.15, 12);
		expect(stepped(0.3, 'ArrowUp', false, GAUGE)).toBe(0.3);
		expect(stepped(0, 'ArrowDown', true, WAVE)).toBe(0);
		expect(stepped(0.13, 'PageUp', false, WAVE)).toBeCloseTo(0.15, 12);
		expect(stepped(0.2, 'Home', false, WAVE)).toBe(0);
		expect(stepped(0.2, 'End', false, WAVE)).toBe(0.3);
		expect(stepped(0.2, 'a', false, WAVE)).toBeUndefined();
	});

	it('hold a value to the range and the step', () => {
		expect(clampTo(0.333, GAUGE)).toBeCloseTo(0.3, 12);
		expect(clampTo(-1, GAUGE)).toBe(0);
		expect(clampTo(0.1234, WAVE)).toBeCloseTo(0.12, 12);
	});
});

describe('the predictions', () => {
	it('opens with the gauge shift at 0.2 and no wave', () => {
		expect(OPENING).toEqual({ gauge: 0.2, wave: 0, phase: 0 });
	});

	it('answers the first once only the gauge shift is on and the ripple has been watched half a period, or the shift set', () => {
		const s = { gauge: 0.2, wave: 0 };
		expect(noteFirst(false, s, 0, false)).toBe(false);
		expect(noteFirst(false, s, WATCH / 2, false)).toBe(false);
		expect(noteFirst(false, s, WATCH, false)).toBe(true);
		expect(noteFirst(false, s, 0, true)).toBe(true);
		expect(noteFirst(false, { gauge: 0, wave: 0 }, 9, true)).toBe(false);
		expect(noteFirst(false, { gauge: 0.2, wave: 0.1 }, 9, true)).toBe(false);
		expect(noteFirst(true, { gauge: 0, wave: 0.1 }, 0, false)).toBe(true);
	});

	it('answers the second once the gauge shift is off and the wave on', () => {
		expect(noteSecond(false, { gauge: 0.2, wave: 0 })).toBe(false);
		expect(noteSecond(false, { gauge: 0.2, wave: 0.1 })).toBe(false);
		expect(noteSecond(false, { gauge: 0, wave: 0 })).toBe(false);
		expect(noteSecond(false, { gauge: 0, wave: 0.1 })).toBe(true);
		expect(noteSecond(true, { gauge: 0.2, wave: 0 })).toBe(true);
	});

	it('answers the third once both are on', () => {
		expect(noteThird(false, { gauge: 0.2, wave: 0 })).toBe(false);
		expect(noteThird(false, { gauge: 0, wave: 0.1 })).toBe(false);
		expect(noteThird(false, { gauge: 0.2, wave: 0.1 })).toBe(true);
		expect(noteThird(true, { gauge: 0, wave: 0 })).toBe(true);
	});

	it('gives the answers’ numbers: 0 and 0; about h₊/2 and a tide; the same with the shift on', () => {
		expect(peakChange({ gauge: 0.2, wave: 0 })).toBe(0);
		expect(peakTide({ gauge: 0.2, wave: 0 })).toBe(0);
		expect(peakChange({ gauge: 0, wave: 0.2 })).toBeCloseTo(0.1, 12);
		expect(peakTide({ gauge: 0, wave: 0.2 })).toBeCloseTo(0.1, 12);
		expect(peakChange({ gauge: 0.2, wave: 0.2 })).toBeCloseTo(0.1, 12);
		expect(peakTide({ gauge: 0.2, wave: 0.2 })).toBeCloseTo(0.1, 12);
	});
});

describe('the words', () => {
	it('gives numbers to two figures', () => {
		expect(two(0)).toBe('0');
		expect(two(0.1)).toBe('0.10');
		expect(two(0.15)).toBe('0.15');
		expect(two(-0.087)).toBe('−0.087');
		expect(two(0.0995)).toBe('0.10');
		expect(two(0.63)).toBe('0.63');
		expect(two(2e-3)).toBe('2.0 × 10⁻³');
		expect(two(3e20)).toBe('3.0 × 10²⁰');
		expect(texTwo(3e20)).toBe('3.0 \\times 10^{20}');
		expect(texTwo(-0.05)).toBe('-0.050');
	});
});
