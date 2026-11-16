/**
 * Mass currents, which the gravitomagnetic half of a pixel's reading images
 * (reference/gravcam/currents.py has the argument and the tests): the current
 * column J(n) = ∫ ρ v dr / r along a line of sight. For a sphere turning at
 * angular velocity ω about the point s (from the observer), entered and left
 * at distances a and b,
 *
 *     J = ρ [ (ω × n) (b − a) − (ω × s) ln(b / a) ].
 */
import { crossing, DEFAULT_EXCLUSION } from './scene';
import type { AnalyzedObject, Vec3 } from './types';

const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];

/** J along one unit direction from `origin`, kg m⁻² s⁻¹. */
export function currentColumn(
	objects: AnalyzedObject[],
	origin: Vec3,
	dir: Vec3,
	exclusion = DEFAULT_EXCLUSION
): Vec3 {
	const out: Vec3 = [0, 0, 0];
	for (const o of objects) {
		if (!o.spin || o.spin.rate === 0) continue;
		const hit = crossing(o, origin, dir);
		if (!hit || hit[1] <= exclusion) continue;
		const a = Math.max(hit[0], exclusion);
		const b = hit[1];
		const p = o.parent >= 0 ? objects[o.parent] : undefined;
		const rho = o.density - (p?.density ?? 0);
		const n = Math.hypot(...o.spin.axis);
		const w = o.spin.axis.map((x) => (2 * Math.PI * o.spin!.rate * x) / n) as Vec3;
		const s = o.spin.center.map((x, k) => x - origin[k]) as Vec3;
		const wn = cross(w, dir);
		const ws = cross(w, s);
		const log = Math.log(b / a);
		for (let k = 0; k < 3; k++) out[k] += rho * (wn[k] * (b - a) - ws[k] * log);
	}
	return out;
}
