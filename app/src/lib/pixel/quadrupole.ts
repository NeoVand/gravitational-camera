/**
 * The tidal field of a turning quadrupole at every distance, near zone and wave zone together, in closed form.
 *
 * Linearized gravity outside a source whose mass quadrupole is Q_ij(u) = Re[q_ij e^{-i w u}] (q trace-free), at the
 * retarded time u = t - r / c, has (reference/gravcam/binary.py, where the same field is found by finite differences
 * of the metric)
 *
 *   E_ij = Re{ -(G / 2 r^5) e^{i (z - w t)} [a q_ij + b (n_i q_jn + n_j q_in) + c delta_ij q_nn + d n_i n_j q_nn] },
 *
 * with z = w r / c, n the unit vector from the source, q_in = q_ik n_k, q_nn = n.q.n, and
 *
 *   a =   6 -   6 i z -  6 z^2 +  4 i z^3 + 2 z^4
 *   b = -30 +  30 i z + 18 z^2 -  8 i z^3 - 2 z^4
 *   c = -15 +  15 i z +  3 z^2 +  2 i z^3 +   z^4
 *   d = 105 - 105 i z - 45 z^2 + 10 i z^3 +   z^4.
 *
 * The terms without z are Newton's quadrupole, falling as 1 / r^5; those in z^4 are the wave,
 * E_ij = -(1/2) d_t^2 h_ij^TT with h^TT = (2 G / c^4 r) (d^2 Q / du^2)^TT, falling as 1 / r. The trace vanishes at
 * every power. Derived from the harmonic-gauge metric of binary.py; the spec checks it against binary.tidal at every
 * distance, and the wave term against Pair.wave_tidal.
 */
import { C, G } from '../engine/physics/constants';
import type { Vec3 } from '../engine/types';
import type { Rotor } from '../engine/waves';
import type { AnalyzedObject } from '../engine/types';
import type { Mat3 } from './tide';

/** A complex symmetric matrix as its real and imaginary parts. */
export interface ComplexMat3 {
	re: Mat3;
	im: Mat3;
}

/** The coefficients (a, b, c, d) of each power of z; the odd powers carry a factor of i. */
const POWERS: [number, number, number, number][] = [
	[6, -30, -15, 105],
	[-6, 30, 15, -105],
	[-6, 18, 3, -45],
	[4, -8, 2, 10],
	[2, -2, 1, 1]
];

/** a q_ij + b (n_i q_jn + n_j q_in) + c delta_ij q_nn + d n_i n_j q_nn, for a real matrix q. */
function combine(q: Mat3, n: Vec3, k: [number, number, number, number]): Mat3 {
	const qn = [0, 1, 2].map((i) => q[i][0] * n[0] + q[i][1] * n[1] + q[i][2] * n[2]);
	const qnn = qn[0] * n[0] + qn[1] * n[1] + qn[2] * n[2];
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) =>
				k[0] * q[i][j] +
				k[1] * (n[i] * qn[j] + n[j] * qn[i]) +
				(i === j ? k[2] * qnn : 0) +
				k[3] * n[i] * n[j] * qnn
		)
	);
}

/**
 * The five terms of the field, by power of z = w r / c, at the point `x` (from the source) and time `t`: [0] is
 * Newton's quadrupole (with the wave's phase), [4] the wave. Their sum is the field. With w = 0 only [0] is not zero:
 * the field of a quadrupole at rest.
 */
export function quadrupoleTerms(q: ComplexMat3, omega: number, x: Vec3, t: number, c = C): Mat3[] {
	const r = Math.hypot(x[0], x[1], x[2]);
	const n: Vec3 = [x[0] / r, x[1] / r, x[2] / r];
	const z = (omega * r) / c;
	const phase = z - omega * t;
	const cos = Math.cos(phase);
	const sin = Math.sin(phase);
	const scale = -G / (2 * r ** 5);
	return POWERS.map((k, p) => {
		const re = combine(q.re, n, k);
		const im = combine(q.im, n, k);
		const zp = scale * z ** p;
		// Re[e^{i phase} (re + i im)], with a further factor of i at the odd powers
		return re.map((row, i) =>
			row.map((v, j) =>
				p % 2 === 0 ? zp * (cos * v - sin * im[i][j]) : zp * (-sin * v - cos * im[i][j])
			)
		);
	});
}

/** Newton's quadrupole field at this instant, with no delay: the limit of the whole as c grows without bound. */
export function newtonQuadrupole(q: ComplexMat3, omega: number, x: Vec3, t: number): Mat3 {
	// the same formula with the wave's phase z left out
	const r = Math.hypot(x[0], x[1], x[2]);
	const n: Vec3 = [x[0] / r, x[1] / r, x[2] / r];
	const cos = Math.cos(omega * t);
	const sin = -Math.sin(omega * t);
	const scale = -G / (2 * r ** 5);
	const re = combine(q.re, n, POWERS[0]);
	const im = combine(q.im, n, POWERS[0]);
	return re.map((row, i) => row.map((v, j) => scale * (cos * v - sin * im[i][j])));
}

/**
 * The turning part of a rotor's quadrupole: masses m_k at p_k from a point of the axis, turning at W about the unit
 * vector `axis` (anticlockwise seen from its tip), have I_ij(t) = steady + Re[q_ij e^{-2 i W t}] with
 * q = sum of (m / 2) [(p p - p' p') + i (p p' + p' p)], p' = axis x p. It is trace-free. For two masses m a distance d
 * apart this is the reference's rotor_quadrupole(m d^2 / 2).
 */
export function turningQuadrupole(
	masses: { mass: number; offset: Vec3 }[],
	axis: Vec3
): ComplexMat3 {
	const re = [0, 1, 2].map(() => [0, 0, 0]);
	const im = [0, 1, 2].map(() => [0, 0, 0]);
	for (const { mass, offset } of masses) {
		const along = offset[0] * axis[0] + offset[1] * axis[1] + offset[2] * axis[2];
		const p = offset.map((v, k) => v - along * axis[k]);
		const s = [
			axis[1] * p[2] - axis[2] * p[1],
			axis[2] * p[0] - axis[0] * p[2],
			axis[0] * p[1] - axis[1] * p[0]
		];
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) {
				re[i][j] += 0.5 * mass * (p[i] * p[j] - s[i] * s[j]);
				im[i][j] += 0.5 * mass * (p[i] * s[j] + s[i] * p[j]);
			}
	}
	return { re, im };
}

/** The turning quadrupole of one of a scene's rotors: its spheres' mass over that of what they move through. */
export function rotorQuadrupole(objects: AnalyzedObject[], rotor: Rotor): ComplexMat3 {
	const members = objects.filter((o) => rotor.members.includes(o.id));
	return turningQuadrupole(
		members.map((o) => ({
			mass:
				(o.density - (o.parent >= 0 ? objects[o.parent].density : 0)) *
				(4 / 3) *
				Math.PI *
				o.radius ** 3,
			offset: o.center.map((v, k) => v - rotor.center[k]) as Vec3
		})),
		rotor.axis
	);
}
