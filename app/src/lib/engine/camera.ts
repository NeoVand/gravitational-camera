import type { Vec3 } from './types';

export interface View {
	/** Radians; 0 looks along −z, positive turns left (toward −x). */
	yaw: number;
	/** Radians; positive looks up. */
	pitch: number;
	/** Vertical field of view, radians. */
	fov: number;
}

export interface CameraBasis {
	right: Vec3;
	up: Vec3;
	forward: Vec3;
}

const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];

/** Right-handed camera frame, +y up. Shared convention with the Python reference. */
export function cameraBasis(view: View): CameraBasis {
	const { yaw, pitch } = view;
	const forward: Vec3 = [
		-Math.sin(yaw) * Math.cos(pitch),
		Math.sin(pitch),
		-Math.cos(yaw) * Math.cos(pitch)
	];
	const right: Vec3 = [Math.cos(yaw), 0, -Math.sin(yaw)];
	return { right, up: cross(right, forward), forward };
}

/** Unit direction of the ray through pixel (i, j), counted from the top-left. */
export function pixelDirection(
	view: View,
	width: number,
	height: number,
	i: number,
	j: number
): Vec3 {
	const { right, up, forward } = cameraBasis(view);
	const t = Math.tan(view.fov / 2);
	const sx = (((i + 0.5) / width) * 2 - 1) * t * (width / height);
	const sy = (1 - ((j + 0.5) / height) * 2) * t;
	const d: Vec3 = [
		forward[0] + sx * right[0] + sy * up[0],
		forward[1] + sx * right[1] + sy * up[1],
		forward[2] + sx * right[2] + sy * up[2]
	];
	const n = Math.hypot(d[0], d[1], d[2]);
	return [d[0] / n, d[1] / n, d[2] / n];
}
