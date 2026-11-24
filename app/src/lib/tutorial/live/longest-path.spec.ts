/**
 * Chapter 7.1's tossed clock: the figure's model against the chapter's numbers. Free fall gains g²T³/24c² =
 * 3.57 × 10⁻¹⁶ s at T = 2 s on the Earth, the path a·z(t) gains (2a − a²) times as much (2.68 at a = ½ and 3/2),
 * 2.86 × 10⁻¹⁵ s at T = 4 s, and the Moon 0.0273 times the Earth's; no other path through the two events gains
 * as much as free fall.
 */
import { describe, expect, it } from 'vitest';
import {
	AT,
	BODIES,
	C,
	EARTH,
	FIRST_START,
	FREE,
	HIGHER,
	MOON,
	OPENING,
	STAR,
	TOP,
	firstAnswer,
	freeFall,
	freeGain,
	gain,
	gainReading,
	keyStep,
	noteFirst,
	noteSecond,
	noteThird,
	nudged,
	onGround,
	pathAt,
	peak,
	placed,
	quartic,
	scaled,
	sci,
	sciWords,
	secondAnswer,
	thirdAnswer,
	three,
	tickLabel,
	ticks,
	top,
	tossed,
	type Handles
} from './longest-path';

const gE = BODIES[EARTH].g;
const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);

/** A small generator of numbers, the same on every run. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

describe('the closed forms', () => {
	it('gives the chapter’s 3.57 × 10⁻¹⁶ s for T = 2 s on the Earth', () => {
		expect(three(tossed(gE, 2) / 1e-16)).toBe('3.57');
		expect((gE ** 2 * 8) / (24 * C * C)).toBeCloseTo(tossed(gE, 2), 30);
	});

	it('gives 2.68 for half and for 1.5 times the height', () => {
		expect(three(scaled(0.5, gE, 2) / 1e-16)).toBe('2.68');
		expect(three(scaled(1.5, gE, 2) / 1e-16)).toBe('2.68');
		expect(scaled(0, gE, 2)).toBe(0);
		expect(scaled(1, gE, 2)).toBe(tossed(gE, 2));
	});

	it('gives 2.86 × 10⁻¹⁵ s at T = 4 s and the Moon’s 0.0273', () => {
		expect(three(tossed(gE, 4) / 1e-15)).toBe('2.86');
		expect(three(tossed(gE, 4) / 1e-16)).toBe('28.6');
		expect(three((BODIES[MOON].g / gE) ** 2)).toBe('0.0273');
	});
});

describe('the curve through the handles', () => {
	it('passes through the two events and the three handles', () => {
		const next = random(7);
		for (let n = 0; n < 50; n++) {
			const f: Handles = [next() * TOP, next() * TOP, next() * TOP];
			expect(Math.abs(quartic(f, 0).q)).toBe(0);
			expect(Math.abs(quartic(f, 1).q)).toBeLessThan(1e-15);
			AT.forEach((s, k) => expect(quartic(f, s).q).toBeCloseTo(f[k], 12));
		}
	});

	it('is free fall’s parabola, exactly, through handles placed on it', () => {
		for (let i = 0; i <= 40; i++) {
			const s = i / 40;
			expect(quartic(FREE, s).q).toBe(4 * s * (1 - s));
			expect(quartic(FREE, s).dq).toBe(4 * (1 - 2 * s));
		}
		const T = 2;
		for (let i = 0; i <= 10; i++) {
			const t = (T * i) / 10;
			const { z, v } = pathAt(FREE, gE, T, t);
			expect(z).toBeCloseTo(freeFall(gE, T, t), 12);
			expect(v).toBeCloseTo(gE * (T / 2 - t), 12);
		}
		// the handles of free fall are at 3/4, 1 and 3/4 of its highest point
		AT.forEach((s, k) => expect(freeFall(gE, T, s * T) / peak(gE, T)).toBeCloseTo(FREE[k], 14));
	});

	it('has a slope that is the derivative of its height', () => {
		const f: Handles = [0.3, 1.7, 0.9];
		const h = 1e-6;
		for (const s of [0.1, 0.33, 0.5, 0.71, 0.9]) {
			const d = (quartic(f, s + h).q - quartic(f, s - h).q) / (2 * h);
			expect(quartic(f, s).dq).toBeCloseTo(d, 6);
		}
	});

	it('never goes below the ground', () => {
		const f: Handles = [0, 2, 0];
		const dips = Array.from({ length: 101 }, (_, i) => quartic(f, i / 100).q).some((q) => q < 0);
		expect(dips).toBe(true);
		for (let i = 0; i <= 100; i++)
			expect(pathAt(f, gE, 2, (2 * i) / 100).z).toBeGreaterThanOrEqual(0);
	});
});

describe('the gain by the trapezoid rule', () => {
	it('reproduces free fall’s closed form, to three figures and to the rule’s 2.5 parts in 10⁵', () => {
		const g = freeGain(gE, 2);
		expect(three(g / 1e-16)).toBe('3.57');
		expect(rel(g, tossed(gE, 2))).toBeLessThan(2.6e-5);
		expect(gain(FREE, gE, 2)).toBe(g);
		for (const T of [0.5, 1.3, 2, 4]) {
			for (const body of [EARTH, MOON, STAR]) {
				expect(rel(freeGain(BODIES[body].g, T), tossed(BODIES[body].g, T))).toBeLessThan(2.6e-5);
			}
		}
	});

	it('gives (2a − a²) times free fall’s for the path a·z(t)', () => {
		for (const a of [0, 0.25, 0.5, 0.9, 1, 1.5, 2]) {
			const f: Handles = [0.75 * a, a, 0.75 * a];
			const g = gain(f, gE, 2);
			if (a === 0) expect(g).toBe(0);
			else expect(Math.abs(g - scaled(a, gE, 2))).toBeLessThan(1e-4 * tossed(gE, 2));
			expect(g / freeGain(gE, 2)).toBeCloseTo(2 * a - a * a, 3);
		}
		expect(three(gain([0.375, 0.5, 0.375], gE, 2) / 1e-16)).toBe('2.68');
		expect(three(gain([1.125, 1.5, 1.125], gE, 2) / 1e-16)).toBe('2.68');
	});

	it('is largest for the free path, among random placements of the handles', () => {
		const next = random(2026);
		const best = freeGain(gE, 2);
		for (let n = 0; n < 2000; n++) {
			const f: Handles = [next() * TOP, next() * TOP, next() * TOP];
			expect(gain(f, gE, 2)).toBeLessThan(best);
		}
		// and near it: small changes of any handle lose
		for (let k = 0; k < 3; k++) {
			for (const d of [-0.01, 0.01]) {
				const f = [...FREE] as [number, number, number];
				f[k] += d;
				expect(gain(f, gE, 2)).toBeLessThan(best);
			}
		}
	});

	it('grows as T³ and as g²', () => {
		const f: Handles = [0.2, 1.3, 1.1];
		const base = gain(f, gE, 1);
		for (const T of [0.5, 2, 3.7, 4])
			expect(rel(gain(f, gE, T), base * T ** 3)).toBeLessThan(1e-12);
		for (const body of [MOON, STAR]) {
			const g = BODIES[body].g;
			expect(rel(gain(f, g, 1), base * (g / gE) ** 2)).toBeLessThan(1e-12);
		}
		expect(rel(freeGain(gE, 4) / freeGain(gE, 2), 8)).toBeLessThan(1e-12);
	});

	it('keeps the ratio to free fall when T or g changes', () => {
		const f: Handles = [0.5, 0.4, 1.6];
		const r = gain(f, gE, 2) / freeGain(gE, 2);
		expect(gain(f, BODIES[MOON].g, 3.3) / freeGain(BODIES[MOON].g, 3.3)).toBeCloseTo(r, 10);
	});
});

describe('the handles', () => {
	it('open on free fall at T = 2 s on the Earth', () => {
		expect(OPENING).toEqual({ tenths: 20, body: EARTH, handles: FREE });
	});

	it('are placed in metres and kept between the ground and the top', () => {
		const H = peak(gE, 2);
		expect(placed(FREE, 1, 2 * H * 0.6, gE, 2)[1]).toBeCloseTo(1.2, 14);
		expect(placed(FREE, 0, -3, gE, 2)[0]).toBe(0);
		expect(placed(FREE, 2, 100, gE, 2)[2]).toBe(TOP);
		expect(placed(FREE, 1, 0, gE, 2)).toEqual([0.75, 0, 0.75]);
	});

	it('step by 0.1 m and 1 m, and land on the ground', () => {
		expect(keyStep(EARTH, false, gE, 2)).toBe(0.1);
		expect(keyStep(MOON, true, BODIES[MOON].g, 2)).toBe(1);
		const gS = BODIES[STAR].g;
		expect(keyStep(STAR, false, gS, 2)).toBeCloseTo(peak(gS, 2) / 50, 0);
		expect(keyStep(STAR, true, gS, 2)).toBeCloseTo(peak(gS, 2) / 5, 0);
		const H = peak(gE, 2);
		const up = nudged(FREE, 1, 0.1, gE, 2);
		expect(up[1] * H).toBeCloseTo(H + 0.1, 12);
		let f: Handles = [0.1 / H, 1, 1];
		f = nudged(f, 0, -0.1, gE, 2);
		expect(f[0]).toBe(0);
		// from free fall to the ground with Shift
		let g: Handles = FREE;
		for (let n = 0; n < 6; n++) for (const k of [0, 1, 2] as const) g = nudged(g, k, -1, gE, 2);
		expect(onGround(g)).toBe(true);
		expect(gain(g, gE, 2)).toBe(0);
	});
});

describe('the predictions', () => {
	it('answer the first only after the ground and a higher path', () => {
		let s = noteFirst(FIRST_START, FREE);
		expect(s.done).toBeUndefined();
		s = noteFirst(s, [0, 0.5, 0]);
		expect(s.ground).toBe(false);
		s = noteFirst(s, [0, 0, 0]);
		expect(s.ground).toBe(true);
		expect(s.done).toBeUndefined();
		// only a little higher is not yet higher
		s = noteFirst(s, [0.8, 1.05, 0.8]);
		expect(s.done).toBeUndefined();
		const high: Handles = [1, 1.5, 1];
		expect(top(high)).toBeGreaterThanOrEqual(HIGHER);
		s = noteFirst(s, high);
		expect(s.done).toEqual(high);
		// once answered, it stays
		expect(noteFirst(s, FREE)).toBe(s);
		// in the other order too
		let t = noteFirst(FIRST_START, high);
		expect(t.done).toBeUndefined();
		t = noteFirst(t, FREE);
		t = noteFirst(t, [0, 0, 0]);
		expect(t.done).toEqual(high);
	});

	it('quote the higher path’s numbers', () => {
		const a = firstAnswer([1.125, 1.5, 1.125]);
		expect(three(a.free / 1e-16)).toBe('3.57');
		expect(three(a.half / 1e-16)).toBe('2.68');
		expect(three(a.gain / 1e-16)).toBe('2.68');
		expect(three(a.ratio)).toBe('0.750');
		expect(three(a.top)).toBe('7.36');
		expect(three(a.peak)).toBe('4.91');
	});

	it('answer the second at T = 4 s on the Earth, and the third on the Moon at T = 2 s', () => {
		expect(noteSecond(false, 39, EARTH)).toBe(false);
		expect(noteSecond(false, 40, MOON)).toBe(false);
		expect(noteSecond(false, 40, EARTH)).toBe(true);
		expect(noteSecond(true, 5, STAR)).toBe(true);
		expect(noteThird(false, 20, EARTH)).toBe(false);
		expect(noteThird(false, 21, MOON)).toBe(false);
		expect(noteThird(false, 20, MOON)).toBe(true);
		expect(noteThird(true, 40, STAR)).toBe(true);
		const b = secondAnswer();
		expect(three(b.ratio)).toBe('8.00');
		expect(three(b.four / 1e-16)).toBe('28.6');
		expect(three(b.four / 1e-15)).toBe('2.86');
		const c = thirdAnswer();
		expect(three(c.squared)).toBe('0.0273');
		expect(three(c.ratio)).toBe('0.0273');
		expect(three(c.moon / 1e-16)).toBe('0.0973');
	});
});

describe('the words and the axes', () => {
	it('read gains in 10⁻¹⁶ s, and in seconds at the neutron star', () => {
		expect(gainReading(freeGain(gE, 2), EARTH)).toMatchObject({ number: '3.57', unit: '1e-16' });
		expect(gainReading(0, EARTH).number).toBe('0');
		const star = gainReading(freeGain(BODIES[STAR].g, 2), STAR);
		expect(star.unit).toBe('s');
		expect(star.number).toBe('6.27 × 10⁶');
		expect(star.tex).toBe('6.27 \\times 10^{6}');
	});

	it('write powers of ten', () => {
		expect(sci(9.996e5)).toEqual({ mantissa: '1.00', power: 6 });
		expect(sciWords(-2.5e-3)).toBe('−2.50 × 10⁻³');
		expect(sciWords(3.21)).toBe('3.21');
	});

	it('choose ticks', () => {
		expect(ticks(2 * peak(gE, 2)).values).toEqual([0, 2, 4, 6, 8]);
		expect(ticks(2).values).toEqual([0, 0.5, 1, 1.5, 2]);
		expect(ticks(4).values).toEqual([0, 1, 2, 3, 4]);
		const m = ticks(2 * peak(BODIES[MOON].g, 2));
		expect(m.values).toEqual([0, 0.5, 1, 1.5]);
		expect(tickLabel(1.5, m.step)).toBe('1.5');
		expect(tickLabel(1, m.step)).toBe('1.0');
		const s = ticks(2 * peak(BODIES[STAR].g, 2));
		expect(s.power).toBe(12);
		expect(s.values.at(-1)).toBeLessThanOrEqual(1.3);
		expect(ticks(0.7).values).toEqual([0, 0.2, 0.4, 0.6]);
	});
});
