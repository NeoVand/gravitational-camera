/** The camera sees the present: the field points at where the body is; light at where it was. */
import { describe, expect, it } from 'vitest';
import { minus, norm, type Vec3 } from './complex';
import {
	extrapolated,
	informed,
	lineAngle,
	position,
	retarded,
	stretchAxis,
	type Crossing
} from './present';

const k: Crossing = { start: [-4, 2, 0], beta: 0.6, c: 1.5 };
const camera: Vec3 = [0, -2, 0];

describe('now and then', () => {
	it('the stretch axis points at the present position, at any speed', () => {
		for (const t of [0, 1.3, 3.1, 5]) {
			const { axis } = stretchAxis(k, camera, t);
			expect(lineAngle(axis, minus(position(k, t), camera))).toBeLessThan(1e-7);
		}
	});

	it('light arrives from the retarded position, a light-travel time back', () => {
		const t = 3;
		const r = retarded(k, camera, t);
		const dt = norm(minus(camera, r)) / k.c;
		expect(norm(minus(r, position(k, t - dt)))).toBeLessThan(1e-9);
		// it lags behind the body, by about the aberration angle
		expect(r[0]).toBeLessThan(position(k, t)[0]);
		expect(lineAngle(minus(r, camera), minus(position(k, t), camera))).toBeGreaterThan(0.3);
	});

	it('after a stop, the field points at where the body would have been until the news arrives', () => {
		const s: Crossing = { ...k, stop: 2 };
		const t = 2.5; // the news has travelled 0.75
		const far: Vec3 = [3, -3, 0];
		expect(informed(s, far, t)).toBe(false);
		expect(lineAngle(stretchAxis(s, far, t).axis, minus(extrapolated(s, t), far))).toBeLessThan(
			1e-7
		);
		const near: Vec3 = [position(s, 2)[0] + 0.3, 1.8, 0];
		expect(informed(s, near, t)).toBe(true);
		expect(lineAngle(stretchAxis(s, near, t).axis, minus(position(s, t), near))).toBeLessThan(1e-9);
	});
});
