/**
 * What one pixel at a point of a demo's scene reads (paper, Section III): E from the scene's masses
 * (engine/tidal.ts) and B from its spinning spheres, each exactly a spin dipole outside it; and what that one
 * reading says: its type, its four stars, and the motion alarm. Used by the "One pixel" layer of the room demos.
 */
import { cx, cmat, dot, type CMat3, type Vec3 } from './complex';
import { motionAlarm, petrov, speciality, stars, C, G } from './pixel';
import { massPoints, tidalTensor } from '../engine/tidal';
import type { AnalyzedObject } from '../engine/types';

/** B at `at` outside a spherically symmetric body with angular momentum L about its centre: a spin dipole. */
export function spinDipole(L: Vec3, center: Vec3, at: Vec3): number[][] {
	const x: Vec3 = [center[0] - at[0], center[1] - at[1], center[2] - at[2]];
	const r = Math.hypot(...x);
	const n = x.map((v) => v / r);
	const Ln = dot(L, n as Vec3);
	const k = -(3 * G) / (C * r ** 4);
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) => k * (L[i] * n[j] + n[i] * L[j] + Ln * ((i === j ? 1 : 0) - 5 * n[i] * n[j]))
		)
	);
}

/** The angular momentum of a sphere spinning about an axis through its own centre: (2/5) M R^2 omega. */
function angularMomentum(o: AnalyzedObject): Vec3 | undefined {
	if (!o.spin || o.spin.rate === 0 || o.half) return undefined;
	const off = Math.hypot(...o.center.map((v, k) => v - o.spin!.center[k]));
	if (off > 1e-9) return undefined; // a sphere swung about another point is not a spin dipole
	const mass = o.density * (4 / 3) * Math.PI * o.radius ** 3;
	const omega = 2 * Math.PI * o.spin.rate;
	const a = o.spin.axis;
	const len = Math.hypot(...a);
	const s = (0.4 * mass * o.radius ** 2 * omega) / len;
	return [a[0] * s, a[1] * s, a[2] * s];
}

/** W = E + iB at a point of the scene, in s^-2. */
export function readingAt(objects: AnalyzedObject[], at: Vec3, cell = 0.25): CMat3 {
	const e = tidalTensor(massPoints(objects, cell), at);
	const E = [
		[e[0], e[1], e[2]],
		[e[1], e[3], e[4]],
		[e[2], e[4], e[5]]
	];
	const B = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (const o of objects) {
		const L = angularMomentum(o);
		if (!L) continue;
		const b = spinDipole(L, o.center, at);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) B[i][j] += b[i][j];
	}
	return cmat((i, j) => cx(E[i][j], B[i][j]));
}

export interface Description {
	type: string;
	/** |1 - 6 J^2 / I^3|, zero for one body */
	speciality: number;
	/** the four stars, as directions in the scene */
	stars: Vec3[];
	/** max |Im w| / max |w| */
	alarm: number;
}

export function describe(W: CMat3): Description {
	const sp = speciality(W);
	return {
		type: petrov(W, 1e-9),
		speciality: Math.hypot(sp.re, sp.im),
		stars: stars(W),
		alarm: motionAlarm(W)
	};
}
