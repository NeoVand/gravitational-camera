/** The speedometer in the dark: gravity reads every component of the pixel's velocity; light, two. */
import { describe, expect, it } from 'vitest';
import { cross, minus, norm, type Vec3 } from './complex';
import { lightReading, reading, relativeVelocity, type Thing } from './speedometer';

const room: Thing[] = [
	{ position: [-2.2, 1.6, 0.6], mass: 6e3, charge: 1 },
	{ position: [0.4, -1.9, -0.4], mass: 3e3, charge: -0.6 },
	{ position: [1.3, 2.2, 0.3], mass: 8e3, charge: 0.8 },
	{ position: [3.0, -1.0, 0.5], mass: 4e3, charge: 0.5 }
];
const v: Vec3 = [0.5, 0.25, -0.1];

describe('the speedometer in the dark', () => {
	it('gravity reads every component of the pixel’s velocity, exactly, at any speed', () => {
		for (const pixel of [
			[0, 0, 0],
			[1.2, -0.4, 0.2],
			[-1, 1, -0.3]
		] as Vec3[]) {
			const r = reading(room, pixel, v);
			expect(norm(minus(r.read, v))).toBeLessThan(1e-9);
			expect(r.alarm).toBeLessThan(1e-12);
		}
	});

	it('anything moving in the room sets off the alarm, even at a walking pace', () => {
		const walking = room.map((t, i) =>
			i === 1 ? { ...t, velocity: [1.5 / 299_792_458, 0, 0] as Vec3 } : t
		);
		expect(reading(walking, [0, 0, 0], v).alarm).toBeGreaterThan(1e-10);
		expect(reading(room, [0, 0, 0], v).alarm).toBeLessThan(1e-13);
	});

	it('light reads only the part of the velocity across its field', () => {
		const { read, along } = lightReading(room, [0.3, 0.1, 0], v);
		// what it misses lies along E, and what it reads lies across it
		expect(norm(cross(minus(v, read), along))).toBeLessThan(1e-9);
		expect(Math.abs(read[0] * along[0] + read[1] * along[1] + read[2] * along[2])).toBeLessThan(
			1e-9
		);
	});

	it('velocities add relativistically', () => {
		expect(norm(minus(relativeVelocity([0, 0, 0], v), [-0.5, -0.25, 0.1]))).toBeLessThan(1e-15);
		const w = relativeVelocity([0.9, 0, 0], [-0.9, 0, 0]);
		expect(w[0]).toBeCloseTo(1.8 / 1.81, 12);
	});
});
