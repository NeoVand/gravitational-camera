/**
 * Beyond general relativity in one reading (paper, Eq. bianchi-wave). For any plane wave of the metric,
 * h_ab = eps_ab cos(omega t - n omega k.x / c), the curvature follows in closed form, and the second Bianchi
 * identity gives B = n [k]x E whatever the theory. So one reading of E (with its trace) and B (with its
 * antisymmetric part) gives the direction, the phase speed c/n, all six polarizations, and checks that they belong
 * to one wave. A port of reference/gravcam/beyond.py, tested against reference/fixtures/pixel.json. Used by the
 * demo "Beyond Einstein" (routes/demo/beyond-einstein).
 */
import { cross, dot, symmetricEigen, unit, type Vec3 } from './complex';
import { C } from './pixel';

const EPS3 = (i: number, j: number, k: number) => ((i - j) * (j - k) * (k - i)) / 2;

/**
 * (E, B) at the origin of a metric plane wave with lower-index polarization eps (4x4, x0 = ct first), phase speed
 * c/n along unit k, angular frequency omega, at time x0 / c; in the reference's conventions
 * (curvature.tidal_tensors): E_ij = c^2 R_0i0j, B_ij = (c^2 / 2) eps_ipq R_pqj0.
 */
export function metricWaveReading(
	eps: number[][],
	n: number,
	k: Vec3,
	omega: number,
	x0: number
): { E: number[][]; B: number[][] } {
	// h = eps cos(K . x), K = (omega / c)(1, -n k): d_a d_b h = -cos(phase) K_a K_b eps
	const K = [omega / C, -n * (omega / C) * k[0], -n * (omega / C) * k[1], -n * (omega / C) * k[2]];
	const f = -Math.cos((omega * x0) / C);
	const R = (a: number, b: number, c: number, d: number) =>
		0.5 *
		f *
		(K[b] * K[c] * eps[a][d] +
			K[a] * K[d] * eps[b][c] -
			K[b] * K[d] * eps[a][c] -
			K[a] * K[c] * eps[b][d]);
	const E = [1, 2, 3].map((i) => [1, 2, 3].map((j) => C * C * R(0, i, 0, j)));
	const B = [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => {
			let s = 0;
			for (let p = 0; p < 3; p++)
				for (let q = 0; q < 3; q++) s += EPS3(i, p, q) * R(p + 1, q + 1, j + 1, 0);
			return 0.5 * C * C * s;
		})
	);
	return { E, B };
}

export interface Inversion {
	/** direction of travel */
	k: Vec3;
	/** c / v_p */
	n: number;
	/** in the frame (e1, e2, k): plus, cross, the two vector modes, breathing, longitudinal */
	pol: { plus: number; cross: number; x: number; y: number; b: number; l: number };
	/** |B - n [k]x E| / |B|: zero for one metric plane wave */
	residual: number;
}

const crossMatrix = (k: Vec3) => [
	[0, -k[2], k[1]],
	[k[2], 0, -k[0]],
	[-k[1], k[0], 0]
];
const matmul = (A: number[][], B: number[][]) =>
	A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));

/** The frame (e1, e2, k), with e1 across k (or as given). */
export function waveFrame(k: Vec3, e1?: Vec3): [Vec3, Vec3, Vec3] {
	const kk = unit(k);
	let a = e1 ?? cross(Math.abs(kk[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], kk);
	a = unit([a[0] - dot(a, kk) * kk[0], a[1] - dot(a, kk) * kk[1], a[2] - dot(a, kk) * kk[2]]);
	return [a, cross(kk, a), kk];
}

/** Direction, phase speed and six polarizations from one reading (E, B). */
export function invertOneReading(E: number[][], B: number[][], e1?: Vec3): Inversion {
	// k^T B = 0: the eigenvector of B B^T with the smallest eigenvalue
	const BBt = matmul(
		B,
		B[0].map((_, j) => B.map((r) => r[j]))
	);
	const { vectors } = symmetricEigen(BBt);
	let k: Vec3 = [vectors[0][0], vectors[1][0], vectors[2][0]];
	let KE = matmul(crossMatrix(k), E);
	const sum = (A: number[][], Bm: number[][]) =>
		A.flat().reduce((s, x, i) => s + x * Bm.flat()[i], 0);
	let n = sum(B, KE) / sum(KE, KE);
	if (n < 0) {
		k = [-k[0], -k[1], -k[2]];
		n = -n;
		KE = KE.map((r) => r.map((x) => -x));
	}
	const diff = B.flat().map((x, i) => x - n * KE.flat()[i]);
	const residual = Math.hypot(...diff) / Math.hypot(...B.flat());
	const R = waveFrame(k, e1);
	const Ew = matmul(
		matmul(R, E),
		R[0].map((_, j) => R.map((r) => r[j]))
	);
	return {
		k,
		n,
		pol: {
			plus: 0.5 * (Ew[0][0] - Ew[1][1]),
			cross: Ew[0][1],
			x: Ew[0][2],
			y: Ew[1][2],
			b: 0.5 * (Ew[0][0] + Ew[1][1]),
			l: Ew[2][2]
		},
		residual
	};
}

/**
 * A metric wave whose tidal field, in the frame (e1, e2, k), has the given six polarizations: in a gauge with only
 * spatial components, E is proportional to the spatial polarization itself.
 */
export function waveOf(
	pol: Inversion['pol'],
	n: number,
	k: Vec3,
	e1?: Vec3
): { eps: number[][]; n: number; k: Vec3 } {
	const [a, b, c] = waveFrame(k, e1);
	const Ew = [
		[pol.b + pol.plus, pol.cross, pol.x],
		[pol.cross, pol.b - pol.plus, pol.y],
		[pol.x, pol.y, pol.l]
	];
	const F = [a, b, c];
	const spatial = [0, 1, 2].map((i) =>
		[0, 1, 2].map((j) => {
			let s = 0;
			for (let p = 0; p < 3; p++) for (let q = 0; q < 3; q++) s += F[p][i] * Ew[p][q] * F[q][j];
			return s;
		})
	);
	const eps = [[0, 0, 0, 0], ...spatial.map((r) => [0, ...r])];
	return { eps, n, k: unit(k) };
}
