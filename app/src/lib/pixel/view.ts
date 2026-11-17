/**
 * The sky around a pixel as the demos draw it: an orthographic view turned by `yaw` about the vertical and tilted
 * by `pitch`; camera x to the right, y up, z toward the viewer.
 */
import { unit, type Vec3 } from './complex';

export interface View {
	yaw: number;
	pitch: number;
}

/** World to camera. */
export function toCamera(view: View, p: Vec3): Vec3 {
	const cy = Math.cos(view.yaw),
		sy = Math.sin(view.yaw);
	const cp = Math.cos(view.pitch),
		sp = Math.sin(view.pitch);
	const x1 = cy * p[0] + sy * p[2],
		z1 = -sy * p[0] + cy * p[2];
	return [x1, cp * p[1] - sp * z1, sp * p[1] + cp * z1];
}

/** Camera to world. */
export function toWorld(view: View, q: Vec3): Vec3 {
	const cy = Math.cos(view.yaw),
		sy = Math.sin(view.yaw);
	const cp = Math.cos(view.pitch),
		sp = Math.sin(view.pitch);
	const y1 = cp * q[1] + sp * q[2],
		z1 = -sp * q[1] + cp * q[2];
	return [cy * q[0] - sy * z1, y1, sy * q[0] + cy * z1];
}

/** A world point on the screen, `scale` drawing units per unit, y down; z > 0 is in front. */
export function project(view: View, p: Vec3, scale: number) {
	const q = toCamera(view, p);
	return { x: scale * q[0], y: -scale * q[1], z: q[2] };
}

/** A great circle of the sky as two SVG paths, the half in front and the half behind. */
export function greatCircle(
	view: View,
	normal: Vec3,
	scale: number
): { front: string; back: string } {
	const n = unit(normal);
	const a: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
	const along = a[0] * n[0] + a[1] * n[1] + a[2] * n[2];
	const u = unit([a[0] - along * n[0], a[1] - along * n[1], a[2] - along * n[2]]);
	const w: Vec3 = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
	let front = '',
		back = '';
	let prev: boolean | undefined;
	for (let k = 0; k <= 120; k++) {
		const t = (2 * Math.PI * k) / 120;
		const p = project(
			view,
			[0, 1, 2].map((i) => Math.cos(t) * u[i] + Math.sin(t) * w[i]) as Vec3,
			scale
		);
		const isFront = p.z >= 0;
		const cmd = prev === isFront ? 'L' : 'M';
		if (isFront) front += `${cmd}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
		else back += `${cmd}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
		prev = isFront;
	}
	return { front, back };
}
