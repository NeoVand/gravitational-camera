/** One pixel, many voices: what gravity and light find from a series of readings. */
import { describe, expect, it } from 'vitest';
import { norm, unit, type Vec3 } from './complex';
import { findGravity, findLight, read } from './voices';

const FROM: Vec3[] = [
	unit([-0.6, 0.45, 0.66]),
	unit([0.45, 0.6, 0.66]),
	unit([0.62, -0.38, 0.69]),
	unit([-0.3, -0.62, 0.72]),
	unit([0.1, 0.9, -0.4])
];
const series = (count: number, noise = 0) =>
	Array.from({ length: 60 }, (_, i) => read(FROM.slice(0, count), i * 0.11, noise, i));

const matches = (found: Vec3[], truth: Vec3[], tol: number) =>
	found.length === truth.length &&
	truth.every((t) => found.some((f) => norm([f[0] - t[0], f[1] - t[1], f[2] - t[2]]) < tol));

describe('gravity separates up to four waves, light two', () => {
	for (const n of [1, 2, 3, 4]) {
		it(`gravity finds ${n} of ${n}`, () => {
			const g = findGravity(series(n));
			expect(g.silent).toBe(5 - n);
			expect(matches(g.directions, FROM.slice(0, n), 1e-5)).toBe(true);
		});
	}
	it('five waves fill all ten numbers: nothing to find', () => {
		const g = findGravity(series(5));
		expect(g.silent).toBe(0);
		expect(g.directions).toEqual([]);
	});
	for (const n of [1, 2]) {
		it(`light finds ${n} of ${n}`, () => {
			const l = findLight(series(n));
			expect(l.silent).toBe(3 - n);
			expect(matches(l.directions, FROM.slice(0, n), 1e-6)).toBe(true);
		});
	}
	it('three waves fill all six of light’s numbers', () => {
		const l = findLight(series(3));
		expect(l.silent).toBe(0);
		expect(l.directions).toEqual([]);
	});
	it('with a little noise, four are still found, nearly', () => {
		const g = findGravity(series(4, 1e-3), 1e-3);
		expect(g.silent).toBe(1);
		expect(matches(g.directions, FROM.slice(0, 4), 0.02)).toBe(true);
	});
});
