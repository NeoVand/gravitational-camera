/**
 * Chapter 7.3's ball of free dust, Ricci against Weyl: the figure's model against the chapter's numbers. Inside water
 * the trace is 8.4 × 10⁻⁷ s⁻² and the tide has no trace-free part; beside a mass in empty space the trace is zero and
 * the principal values are −2 : 1 : 1; a beam squeezes by 4πGF/c³ across itself and not along; sunlight's trace is
 * 8.5 × 10⁻³² s⁻²; and a ball's volume changes at V̈/V = −tr 𝓔.
 */
import { describe, expect, it } from 'vitest';
import {
	BEAM,
	aspect,
	C,
	DENSITY,
	EARTH,
	G,
	OPENING,
	PRESSURE,
	PRESSURES,
	SUNLIGHT,
	WATER,
	beamAxis,
	beamCheck,
	beamStress,
	combine,
	displayScale,
	drawnTide,
	grains,
	identity,
	inSlice,
	mediumStress,
	moved,
	noteFirst,
	noteSecond,
	noteThird,
	outer,
	pointMassTide,
	pressureAt,
	pressureBoost,
	pressureSlider,
	principal,
	ricciTide,
	scaleWords,
	split,
	stepped,
	strength,
	sum,
	texTwo,
	tides,
	trace,
	two,
	volumeAfter,
	volumeRate,
	zero,
	type Mat3,
	type Settings
} from './ricci-weyl';

const close = (a: Mat3, b: Mat3, scale: number) => {
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++) expect(Math.abs(a[i][j] - b[i][j])).toBeLessThan(1e-12 * scale);
};

const at = (s: Partial<Settings>): Settings => ({ ...OPENING, ...s });

describe('the split into trace and trace-free parts', () => {
	const m: Mat3 = [
		[3, 1, -2],
		[1, -1, 0.5],
		[-2, 0.5, 4]
	];

	it('gives back the table, with the trace in the even part alone', () => {
		const s = split(m);
		expect(s.trace).toBeCloseTo(6, 12);
		close(sum(s.even, s.traceFree), m, 1);
		expect(trace(s.traceFree)).toBeCloseTo(0, 12);
		close(s.even, combine(2, identity()), 1);
	});

	it('leaves an even tide with no trace-free part, and a trace-free one with no even part', () => {
		close(split(combine(5, identity())).traceFree, zero(), 1);
		const tf = pointMassTide(70, 1, [0, 0, 1]);
		expect(split(tf).trace).toBeCloseTo(0, 22);
	});
});

describe('the principal values', () => {
	it('are found with their axes', () => {
		const m: Mat3 = [
			[2, 1, 0],
			[1, 2, 0],
			[0, 0, -1]
		];
		const p = principal(m);
		expect(p.map((q) => q.value)).toEqual([
			expect.closeTo(-1, 12),
			expect.closeTo(1, 12),
			expect.closeTo(3, 12)
		]);
		expect(Math.abs(p[2].axis[0])).toBeCloseTo(Math.SQRT1_2, 10);
		expect(strength(m)).toBeCloseTo(3, 12);
	});

	it('in the slice, with their directions', () => {
		const s = inSlice(beamCheck(1000, beamAxis(30)));
		const across = s.find((q) => q.value > 0)!;
		const along = s.find((q) => q.value < 1e-40)!;
		expect(across.angle).toBeCloseTo(120, 9);
		expect(along.angle).toBeCloseTo(30, 9);
	});
});

describe('the Ricci part from the energy and stress', () => {
	it('is the chapter’s formula, term by term', () => {
		const rho = 13100;
		const T: Mat3 = [
			[3e11, 2e10, 0],
			[2e10, 4e11, -1e10],
			[0, -1e10, 3.5e11]
		];
		const Tkk = trace(T);
		const want: Mat3 = [0, 1, 2].map((i) =>
			[0, 1, 2].map(
				(j) =>
					((4 * Math.PI * G) / 3) * (rho + Tkk / C ** 2) * (i === j ? 1 : 0) -
					((4 * Math.PI * G) / C ** 2) * (T[i][j] - (i === j ? Tkk / 3 : 0))
			)
		) as Mat3;
		close(ricciTide(rho, T), want, 1e-6);
	});

	it('has the trace 4πG(ρ + Σp/c²), the active density', () => {
		const rho = 13100;
		const p = 364e9;
		const m = mediumStress(rho, p);
		expect(trace(ricciTide(m.rho, m.T))).toBeCloseTo(
			4 * Math.PI * G * (rho + (3 * p) / C ** 2),
			20
		);
	});

	it('is 4πGρ/3 in every direction inside dust: the uniform-ball check', () => {
		close(ricciTide(WATER, zero()), combine((4 * Math.PI * G * WATER) / 3, identity()), 1e-6);
	});

	it('gives the chapter’s numbers: water, the Earth’s mean density', () => {
		expect(two(tides(at({ mass: 0 })).trace)).toBe('8.4 × 10⁻⁷');
		expect(two(tides(at({ rho: EARTH, mass: 0 })).trace)).toBe('4.6 × 10⁻⁶');
	});

	it('is the beam check: (4πGF/c³)(δ − n̂n̂), across the beam only', () => {
		for (const deg of [0, 30, 90, 137]) {
			const n = beamAxis(deg);
			const b = beamStress(SUNLIGHT, n);
			const t = ricciTide(b.rho, b.T);
			close(t, beamCheck(SUNLIGHT, n), 1e-31);
			// nothing along the beam
			const along = [0, 1, 2].reduce(
				(s, i) => s + [0, 1, 2].reduce((r, j) => r + n[i] * t[i][j] * n[j], 0),
				0
			);
			expect(Math.abs(along)).toBeLessThan(1e-45);
		}
		const k = (4 * Math.PI * G * SUNLIGHT) / C ** 3;
		const b = beamStress(SUNLIGHT, beamAxis(0));
		const p = principal(ricciTide(b.rho, b.T)).map((q) => q.value);
		expect(p[0]).toBeCloseTo(0, 45);
		expect(p[1] / k).toBeCloseTo(1, 12);
		expect(p[2] / k).toBeCloseTo(1, 12);
	});

	it('gives sunlight’s trace, 8πGF/c³ = 8.5 × 10⁻³² s⁻²', () => {
		const t = tides({ rho: 0, pressure: 0, flux: SUNLIGHT, beam: 0, mass: 0, distance: 2 });
		expect(two(t.trace)).toBe('8.5 × 10⁻³²');
		expect(t.trace).toBeCloseTo((8 * Math.PI * G * SUNLIGHT) / C ** 3, 45);
	});

	it('of an even pressure has no trace-free part, and the sum’s trace is the chapter’s sum', () => {
		const s = at({ rho: 13100, pressure: PRESSURES.earth, flux: 5000, beam: 40 });
		const t = tides(s);
		expect(strength(split(t.medium).traceFree)).toBeLessThan(1e-20);
		expect(t.trace / t.traceFormula).toBeCloseTo(1, 12);
		// the beam's trace-free part, k(⅓δ − n̂n̂) with k = 4πGF/c³: −⅔k along the beam
		expect(t.ricciTraceFree / ((8 * Math.PI * G * 5000) / (3 * C ** 3))).toBeCloseTo(1, 9);
		expect(tides(at({ mass: 0, pressure: 0.2 })).traceFree).toBe(0);
	});

	it('raises the active density by 3p/ρc² at the Earth’s and Sun’s centres', () => {
		expect(two(3 * PRESSURES.earth)).toBe('9.3 × 10⁻¹⁰');
		expect(two(3 * PRESSURES.sun)).toBe('5.6 × 10⁻⁶');
		expect(two(3 * PRESSURES.water)).toBe('3.4 × 10⁻¹⁵');
	});
});

describe('a point mass’s tide', () => {
	it('is trace-free, with principal values −2 : 1 : 1 and a = GM/d³', () => {
		const m = pointMassTide(70, 1, [1, 0, 0]);
		expect(Math.abs(trace(m))).toBeLessThan(1e-15 * G * 70);
		const p = principal(m).map((q) => q.value);
		const a = G * 70;
		expect(p[0] / a).toBeCloseTo(-2, 12);
		expect(p[1] / a).toBeCloseTo(1, 12);
		expect(p[2] / a).toBeCloseTo(1, 12);
		// the person a metre away: −9.3 × 10⁻⁹ along the line, 4.7 × 10⁻⁹ across
		expect(two(p[0])).toBe('−9.3 × 10⁻⁹');
		expect(two(p[2])).toBe('4.7 × 10⁻⁹');
	});

	it('stretches along the line to the mass', () => {
		const m = pointMassTide(1000, 2, [1, 0, 0]);
		const s = inSlice(m);
		const stretch = s.find((q) => q.value < 0)!;
		expect(stretch.angle).toBeCloseTo(0, 9);
	});

	it('is the Weyl part of the figure, and the whole trace-free part out of any medium', () => {
		const t = tides(at({ rho: 0 }));
		expect(t.trace).toBe(0);
		expect(t.weylSize).toBeCloseTo((2 * G * 1000) / 8, 22);
		expect(t.traceFree).toBeCloseTo(t.weylSize, 22);
		expect(t.ricciTraceFree).toBe(0);
	});
});

describe('the volume', () => {
	it('changes at V̈/V = −tr 𝓔', () => {
		for (const s of [
			OPENING,
			at({ rho: 0, pressure: 0 }),
			at({ rho: 0, mass: 0, flux: 8000, beam: 70 })
		]) {
			const t = tides(s);
			expect(t.volumeRate).toBe(-t.trace);
			expect(Math.abs(volumeRate(t.total) - t.volumeRate)).toBeLessThan(1e-12 * strength(t.total));
			// the second derivative of det(1 − ½𝓔t²) at t = 0, from the curve itself, for the table made of unit size
			const k = strength(t.total);
			const m = combine(1 / k, t.total);
			const h = 1e-3;
			const second = (volumeAfter(m, h) - 2 * volumeAfter(m, 0) + volumeAfter(m, -h)) / (h * h);
			expect(Math.abs(second - volumeRate(m))).toBeLessThan(
				1e-5 * Math.max(1, Math.abs(volumeRate(m)))
			);
		}
	});

	it('is kept by the Weyl part to first order and shrinks inside water', () => {
		const weyl = tides(at({ rho: 0 })).total;
		expect(Math.abs(volumeAfter(weyl, 1) - 1)).toBeLessThan(1e-15);
		expect(volumeAfter(tides(at({ mass: 0 })).total, 1)).toBeLessThan(1);
	});
});

describe('the drawing', () => {
	it('opens drawn ×2 × 10⁶, shrinking and a little longer toward the mass', () => {
		const m = drawnTide(OPENING);
		const N = displayScale(m)!;
		expect(N).toBe(2e6);
		expect(scaleWords(N)).toBe('×2 × 10⁶');
		const x = moved(m, N, 1, [1, 0]);
		const y = moved(m, N, 1, [0, 1]);
		expect(x[0]).toBeLessThan(1);
		expect(y[1]).toBeLessThan(x[0]);
	});

	it('keeps every radius’s change within 40 per cent, at least 16 per cent at the largest', () => {
		for (const s of [
			OPENING,
			at({ rho: 20000 }),
			at({ rho: 0, mass: 10000, distance: 0.5 }),
			at({ rho: 0, mass: 0, flux: SUNLIGHT })
		]) {
			const m = drawnTide(s);
			const N = displayScale(m)!;
			const most = (strength(m) * N) / 2;
			expect(most).toBeLessThanOrEqual(0.4 * (1 + 1e-9));
			expect(most).toBeGreaterThan(0.16);
		}
		expect(displayScale(zero())).toBeUndefined();
	});

	it('draws the pressure’s share ×10¹⁴ in water at one atmosphere, and its true size once it is large', () => {
		expect(pressureBoost(PRESSURES.water)).toBe(1e14);
		expect(pressureBoost(0)).toBe(1);
		expect(pressureBoost(0.3)).toBe(1);
		const w = PRESSURES.water;
		const drawn = trace(drawnTide(at({ mass: 0, pressure: w })));
		expect(drawn / (4 * Math.PI * G * WATER)).toBeCloseTo(1 + 3 * w * 1e14, 9);
		// the true trace is not boosted
		expect(tides(at({ mass: 0, pressure: w })).trace / (4 * Math.PI * G * WATER)).toBeCloseTo(
			1,
			12
		);
	});

	it('gives the shape: round in water, a little longer toward the mass as the figure opens', () => {
		const water = at({ mass: 0 });
		const w = aspect(drawnTide(water), displayScale(drawnTide(water))!, tides(water).total);
		expect(w.drawn).toBeCloseTo(1, 12);
		expect(w.excess).toBe(0);
		const o = aspect(drawnTide(OPENING), 2e6, tides(OPENING).total);
		expect(o.drawn).toBeGreaterThan(1.01);
		expect(o.excess).toBeCloseTo((3 * G * 1000) / 8 / 2, 20);
	});

	it('has 200 grains inside the unit circle', () => {
		const g = grains();
		expect(g).toHaveLength(200);
		expect(Math.max(...g.map(([x, y]) => Math.hypot(x, y)))).toBeLessThanOrEqual(1);
	});

	it('moves a grain by −½𝓔ξ₀t²', () => {
		const m = combine(2, outer([1, 0, 0]));
		expect(moved(m, 1, 1, [0.5, 0.5])).toEqual([0, 0.5]);
		expect(moved(m, 1, 0, [0.5, 0.5])).toEqual([0.5, 0.5]);
	});
});

describe('the sliders', () => {
	it('step by the arrows and by Shift, onto their grids, within their ends', () => {
		expect(stepped(1000, 'ArrowRight', false, DENSITY)).toBe(1100);
		expect(stepped(5513, 'ArrowRight', false, DENSITY)).toBe(5600);
		expect(stepped(5513, 'ArrowLeft', false, DENSITY)).toBe(5500);
		expect(stepped(5513, 'ArrowUp', true, DENSITY)).toBe(6000);
		expect(stepped(50, 'ArrowLeft', false, DENSITY)).toBe(0);
		expect(stepped(19950, 'ArrowRight', true, DENSITY)).toBe(20000);
		expect(stepped(1000, 'End', false, DENSITY)).toBe(20000);
		expect(stepped(1000, 'Home', false, DENSITY)).toBe(0);
		expect(stepped(1000, 'a', false, DENSITY)).toBeUndefined();
	});

	it('turn the dial round', () => {
		expect(stepped(355, 'ArrowRight', false, BEAM)).toBe(0);
		expect(stepped(0, 'ArrowLeft', false, BEAM)).toBe(355);
		expect(stepped(10, 'ArrowRight', true, BEAM)).toBe(45);
	});

	it('read the pressure from a decimal logarithm, none at the left end', () => {
		expect(pressureAt(PRESSURE.min)).toBe(0);
		expect(pressureAt(PRESSURE.max)).toBeCloseTo(0.3, 12);
		expect(pressureAt(-10)).toBeCloseTo(1e-10, 22);
		expect(pressureSlider(0)).toBe(PRESSURE.min);
		expect(pressureAt(pressureSlider(PRESSURES.earth))).toBeCloseTo(PRESSURES.earth, 20);
	});
});

describe('the predictions', () => {
	it('the first, in water with nothing else nearby', () => {
		expect(noteFirst(false, OPENING)).toBe(false);
		expect(noteFirst(false, at({ mass: 0 }))).toBe(true);
		expect(noteFirst(false, at({ mass: 0, flux: 10 }))).toBe(false);
		expect(noteFirst(false, at({ mass: 0, rho: EARTH }))).toBe(false);
		expect(noteFirst(false, at({ mass: 0, pressure: 0.1 }))).toBe(false);
		expect(noteFirst(false, at({ mass: 0, pressure: PRESSURES.water }))).toBe(true);
		expect(noteFirst(true, OPENING)).toBe(true);
	});

	it('the second, out of the water with a mass near', () => {
		expect(noteSecond(false, OPENING)).toBe(false);
		expect(noteSecond(false, at({ rho: 0 }))).toBe(true);
		expect(noteSecond(false, at({ rho: 0, mass: 0 }))).toBe(false);
		expect(noteSecond(false, at({ rho: 0, flux: 1361 }))).toBe(false);
		expect(noteSecond(true, OPENING)).toBe(true);
	});

	it('the third, a beam alone through the ball', () => {
		expect(noteThird(false, at({ flux: 1361 }))).toBe(false);
		expect(noteThird(false, at({ rho: 0, flux: 1361 }))).toBe(false);
		expect(noteThird(false, at({ rho: 0, mass: 0, flux: 1361 }))).toBe(true);
		expect(noteThird(false, at({ rho: 0, mass: 0 }))).toBe(false);
		expect(noteThird(true, OPENING)).toBe(true);
	});

	it('answer with the chapter’s numbers', () => {
		const one = tides(at({ mass: 0 }));
		expect(two(one.trace)).toBe('8.4 × 10⁻⁷');
		expect(one.traceFree).toBeLessThan(1e-20);
		const two_ = tides(at({ rho: 0 }));
		expect(two_.trace).toBe(0);
		const three = tides(at({ rho: 0, mass: 0, flux: SUNLIGHT }));
		const p = inSlice(three.total).map((q) => q.value);
		expect(Math.max(...p) / ((4 * Math.PI * G * SUNLIGHT) / C ** 3)).toBeCloseTo(1, 12);
	});
});

describe('the words', () => {
	it('give two figures', () => {
		expect(two(8.387e-7)).toBe('8.4 × 10⁻⁷');
		expect(two(-1.668e-8)).toBe('−1.7 × 10⁻⁸');
		expect(two(9.99e-7)).toBe('1.0 × 10⁻⁶');
		expect(two(101325)).toBe('1.0 × 10⁵');
		expect(two(0)).toBe('0');
		expect(two(0.25)).toBe('0.25');
		expect(texTwo(8.387e-7)).toBe('8.4 \\times 10^{-7}');
		expect(texTwo(-1e-6)).toBe('-1.0 \\times 10^{-6}');
		expect(scaleWords(1e14)).toBe('×10¹⁴');
		expect(scaleWords(50)).toBe('×50');
	});
});
