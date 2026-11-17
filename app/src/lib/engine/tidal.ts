/**
 * The Newtonian tidal tensor of a scene, E_ij = ∂_i ∂_j Φ, at points outside
 * its matter. This is what one pixel of a near-field camera records.
 *
 * Bodies are replaced by point masses: a sphere by one at its centre (exact
 * outside it), a box by a grid of cells no larger than `cell`. Nested objects
 * contribute their density contrast with the parent.
 */
import { cameraBasis, type View } from './camera';
import { G } from './physics/constants';
import type { AnalyzedObject, Vec3 } from './types';

/**
 * Flat list of point masses: x, y, z, mass, repeated. With `subtractRoom`,
 * objects marked as background are left out (their children still count
 * their contrast with them).
 */
export function massPoints(
	objects: AnalyzedObject[],
	cell = 0.25,
	subtractRoom = false
): Float64Array {
	const out: number[] = [];
	for (const o of objects) {
		if (subtractRoom && o.background) continue;
		const parent = o.parent >= 0 ? objects[o.parent] : undefined;
		const contrast = o.density - (parent?.density ?? 0);
		if (!o.half) {
			out.push(...o.center, contrast * (4 / 3) * Math.PI * o.radius ** 3);
			continue;
		}
		const n = o.half.map((h) => Math.min(40, Math.max(1, Math.ceil((2 * h) / cell))));
		const step = o.half.map((h, k) => (2 * h) / n[k]);
		const mass = contrast * step[0] * step[1] * step[2];
		for (let i = 0; i < n[0]; i++)
			for (let j = 0; j < n[1]; j++)
				for (let k = 0; k < n[2]; k++)
					out.push(
						o.center[0] - o.half[0] + (i + 0.5) * step[0],
						o.center[1] - o.half[1] + (j + 0.5) * step[1],
						o.center[2] - o.half[2] + (k + 0.5) * step[2],
						mass
					);
	}
	return Float64Array.from(out);
}

/** The tidal tensor at a point, as [xx, xy, xz, yy, yz, zz], in s⁻². */
export function tidalTensor(points: Float64Array, at: Vec3): number[] {
	let xx = 0;
	let xy = 0;
	let xz = 0;
	let yy = 0;
	let yz = 0;
	let zz = 0;
	for (let i = 0; i < points.length; i += 4) {
		const dx = points[i] - at[0];
		const dy = points[i + 1] - at[1];
		const dz = points[i + 2] - at[2];
		const r2 = dx * dx + dy * dy + dz * dz;
		const k = (G * points[i + 3]) / (r2 * r2 * Math.sqrt(r2));
		xx += k * (r2 - 3 * dx * dx);
		yy += k * (r2 - 3 * dy * dy);
		zz += k * (r2 - 3 * dz * dz);
		xy -= 3 * k * dx * dy;
		xz -= 3 * k * dx * dz;
		yz -= 3 * k * dy * dz;
	}
	return [xx, xy, xz, yy, yz, zz];
}

/** u·E·v for a tensor in the packed form above. */
export function contract(e: number[], u: Vec3, v: Vec3): number {
	return (
		e[0] * u[0] * v[0] +
		e[3] * u[1] * v[1] +
		e[5] * u[2] * v[2] +
		e[1] * (u[0] * v[1] + u[1] * v[0]) +
		e[2] * (u[0] * v[2] + u[2] * v[0]) +
		e[4] * (u[1] * v[2] + u[2] * v[1])
	);
}

/** Size of the traceless part of a tensor [xx, xy, xz, yy, yz, zz]: sqrt(sum of squares / 2). */
export function anisotropy(e: number[]): number {
	const t = (e[0] + e[3] + e[5]) / 3;
	const a = e[0] - t;
	const b = e[3] - t;
	const c = e[5] - t;
	return Math.sqrt(0.5 * (a * a + b * b + c * c + 2 * (e[1] ** 2 + e[2] ** 2 + e[4] ** 2)));
}

/**
 * The typical size of the tidal field on the slice the field view draws, the points
 * `depth` metres from the camera: the median over a 7 x 5 grid of directions
 * spanning the picture, in s⁻².
 * The field view draws strengths relative to it.
 */
export function sliceReference(
	points: Float64Array,
	observer: Vec3,
	view: View,
	aspect: number,
	depth: number
): number {
	const { right, up, forward } = cameraBasis(view);
	const t = Math.tan(view.fov / 2);
	const sizes: number[] = [];
	for (let j = 0; j < 5; j++) {
		for (let i = 0; i < 7; i++) {
			const sx = ((i / 6) * 2 - 1) * t * aspect;
			const sy = ((j / 4) * 2 - 1) * t;
			const ray = [0, 1, 2].map((k) => forward[k] + sx * right[k] + sy * up[k]);
			const norm = Math.hypot(...ray);
			const at = ray.map((d, k) => observer[k] + (depth * d) / norm) as Vec3;
			sizes.push(anisotropy(tidalTensor(points, at)));
		}
	}
	sizes.sort((a, b) => a - b);
	return Math.max(sizes[Math.floor(sizes.length / 2)], 1e-300);
}
