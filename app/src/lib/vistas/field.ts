/**
 * The tidal tensor at points about the camera, for the "Tidal field" view of the vista demos: about a black hole,
 * and in the Galaxy.
 */
import type { Cone } from '../pixel/field-view';
import { holeTide } from '../pixel/tide-demos';
import type { Mat3 } from '../pixel/tide';
import { GALAXY_TABLE } from './galaxy-table';
import type { Vec3 } from './sky';

/** The Sun's place in the Galaxy's model, kpc (reference/gravcam/galaxy.py). */
export const R_SUN = 8.2;
export const Z_SUN = 0.02;

/**
 * The tide at the point `reach` from the camera along the unit vector `n`, where a hole of `suns` solar masses lies
 * `distance` from the camera toward `toHole` (lengths in G M / c^2): what an observer held at rest there reads,
 * (G M / r^3) (delta_ij - 3 x_i x_j / r^2), a stretch of 2 G M / r^3 along the line to the hole and a squeeze of
 * G M / r^3 across it. That is exact in the Schwarzschild metric, with r the radius that gives a sphere its area and
 * the axes those of the observer at rest; the points themselves are placed as in flat space. Inside the horizon,
 * r <= 2, nothing can be held at rest and there is no such reading.
 */
export function holeField(
	toHole: Vec3,
	distance: number,
	reach: number,
	n: Vec3,
	suns = 10
): Mat3 | undefined {
	const x = [0, 1, 2].map((k) => reach * n[k] - distance * toHole[k]);
	const r = Math.hypot(x[0], x[1], x[2]);
	if (r <= 2) return undefined;
	const k = holeTide(suns, r);
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => k * ((i === j ? 1 : 0) - 3 * ((x[i] / r) * (x[j] / r))))
	);
}

/**
 * The directions from the camera along which the point `reach` away lies inside the horizon, where `holeField` gives
 * nothing: r <= 2 is n . toHole >= (reach^2 + distance^2 - 4) / (2 reach distance), a cone about the line to the
 * hole. Nothing where the sphere of points does not enter the horizon.
 */
export function holeHollow(toHole: Vec3, distance: number, reach: number): Cone | undefined {
	const cos = (reach * reach + distance * distance - 4) / (2 * reach * distance);
	return cos < 1 ? { axis: toHole, cos } : undefined;
}

/** Where a value falls on a rising list: the index below it and the fraction of the way to the next. */
function locate(list: number[], v: number): [number, number] {
	if (v <= list[0]) return [0, 0];
	const last = list.length - 1;
	if (v >= list[last]) return [last - 1, 1];
	let i = 0;
	while (list[i + 1] < v) i++;
	return [i, (v - list[i]) / (list[i + 1] - list[i])];
}

/** [E_RR, E_phiphi, E_zz, E_Rz] at distance R from the Galaxy's axis and height z, by linear interpolation. */
export function galaxyCylindrical(R: number, z: number): [number, number, number, number] {
	const { R: Rs, z: zs, E } = GALAXY_TABLE;
	const [i, f] = locate(Rs, R);
	const [j, g] = locate(zs, Math.abs(z));
	const out = [0, 1, 2, 3].map(
		(k) =>
			(1 - f) * ((1 - g) * E[i][j][k] + g * E[i][j + 1][k]) +
			f * ((1 - g) * E[i + 1][j][k] + g * E[i + 1][j + 1][k])
	) as [number, number, number, number];
	if (z < 0) out[3] = -out[3];
	return out;
}

/**
 * The tide of the Galaxy's stars at the point `reach` kpc from the Sun along the unit vector `n`, s^-2, in galactic
 * axes (x from the Sun toward the centre, y the way the Galaxy turns, z north). Inside the disc its trace is not
 * zero: it is 4 pi G times the density of stars there.
 */
export function galaxyField(reach: number, n: Vec3): Mat3 {
	// from the Galaxy's centre: the Sun is at x = -R_SUN
	const X = -R_SUN + reach * n[0];
	const Y = reach * n[1];
	const Z = Z_SUN + reach * n[2];
	const R = Math.hypot(X, Y);
	const [rr, pp, zz, rz] = galaxyCylindrical(R, Z);
	// on the axis itself every direction across it is alike
	const u = R > 1e-9 ? [X / R, Y / R, 0] : [1, 0, 0];
	const t = [-u[1], u[0], 0];
	const k = [0, 0, 1];
	return [0, 1, 2].map((a) =>
		[0, 1, 2].map(
			(b) =>
				rr * u[a] * u[b] + pp * t[a] * t[b] + zz * k[a] * k[b] + rz * (u[a] * k[b] + k[a] * u[b])
		)
	);
}
