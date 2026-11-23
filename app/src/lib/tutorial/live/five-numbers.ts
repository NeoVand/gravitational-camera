/**
 * A symmetric trace-free 3 × 3 table built from five numbers, 𝓔 = c_A b^A, in the basis of chapter 1.5, and what
 * it does to three rings of free balls, one in each coordinate plane. A ball at rest at ξ is pushed by −𝓔 ξ: where
 * that points outward the ring is stretched, where inward squeezed. The table's eigenvalues add to zero, because its
 * trace is zero, so no table squeezes every direction at once.
 */

/** A 3 × 3 table, by rows. */
export type Matrix = [[number, number, number], [number, number, number], [number, number, number]];

/** The five coefficients c_1 … c_5, in units of GM/r³. */
export type Coefficients = [number, number, number, number, number];

export type Vec3 = [number, number, number];

const r2 = Math.SQRT1_2;
const r6 = 1 / Math.sqrt(6);

/**
 * The chapter's orthonormal basis of symmetric trace-free tables, b^1 … b^5: three for the shears, xy, yz and zx,
 * then diag(1, −1, 0)/√2 and diag(−1, −1, 2)/√6. Each has length one, b^A : b^B = δ^AB.
 */
export const BASIS: readonly Matrix[] = [
	[
		[0, r2, 0],
		[r2, 0, 0],
		[0, 0, 0]
	],
	[
		[0, 0, 0],
		[0, 0, r2],
		[0, r2, 0]
	],
	[
		[0, 0, r2],
		[0, 0, 0],
		[r2, 0, 0]
	],
	[
		[r2, 0, 0],
		[0, -r2, 0],
		[0, 0, 0]
	],
	[
		[-r6, 0, 0],
		[0, -r6, 0],
		[0, 0, 2 * r6]
	]
];

/** The sliders' range for each coefficient, in units of GM/r³, and their step. */
export const LEAST = -3;
export const MOST = 3;
export const STEP = 0.05;

/** A table of zeros. */
export const zero = (): Matrix => [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

/** The table 𝓔_ij = c_A b^A_ij, summed over A. */
export function table(c: Readonly<Coefficients>): Matrix {
	const t = zero();
	for (let A = 0; A < 5; A++)
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) t[i][j] += c[A] * BASIS[A][i][j];
	return t;
}

/** The contraction D : T = D_ij T_ij, the sum of the products of matching entries. */
export function contract(d: Readonly<Matrix>, t: Readonly<Matrix>) {
	let s = 0;
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += d[i][j] * t[i][j];
	return s;
}

/** The coefficients of a table, c_A = b^A_ij 𝓔_ij: its symmetric trace-free part, read in the basis. */
export const coefficients = (t: Readonly<Matrix>): Coefficients =>
	BASIS.map((b) => contract(b, t)) as Coefficients;

/** The Frobenius norm |T| = √(T_ij T_ij), the length of the table. */
export const norm = (t: Readonly<Matrix>) => Math.sqrt(contract(t, t));

/** The length of the five coefficients, √(c_A c_A): by the orthonormal basis, the same as the length of the table. */
export const size = (c: Readonly<Coefficients>) => Math.hypot(...c);

export const trace = (t: Readonly<Matrix>) => t[0][0] + t[1][1] + t[2][2];

export function determinant(t: Readonly<Matrix>) {
	const [[a, b, c], [d, e, f], [g, h, i]] = t;
	return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/** T v. */
export function apply(t: Readonly<Matrix>, v: Readonly<Vec3>): Vec3 {
	return [
		t[0][0] * v[0] + t[0][1] * v[1] + t[0][2] * v[2],
		t[1][0] * v[0] + t[1][1] * v[1] + t[1][2] * v[2],
		t[2][0] * v[0] + t[2][1] * v[1] + t[2][2] * v[2]
	];
}

/** An eigenvalue of a symmetric table and its axis, a unit vector. */
export interface Eigen {
	value: number;
	axis: Vec3;
}

/**
 * The three eigenvalues of a symmetric 3 × 3 table, the smallest first, with orthonormal axes, by Jacobi's method:
 * each step turns two axes in the plane of one entry off the diagonal so as to make that entry zero, and the sweeps
 * go on until the entries off the diagonal are below the rounding of the diagonal ones. Every step is a rotation, so
 * the values are accurate to the rounding of the largest of them, however close two of them are. Each axis is turned
 * so that its largest component is positive, so that it does not flip as the table changes.
 */
export function eigen(t: Readonly<Matrix>): [Eigen, Eigen, Eigen] {
	const a = [0, 1, 2].map((i) => [0, 1, 2].map((j) => (t[i][j] + t[j][i]) / 2));
	// v's columns are the axes
	const v = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	for (let sweep = 0; sweep < 64; sweep++) {
		const off = Math.hypot(a[0][1], a[1][2], a[0][2]);
		const diag = Math.hypot(a[0][0], a[1][1], a[2][2]);
		if (off === 0 || off <= 1e-17 * diag) break;
		for (const [p, q] of [
			[0, 1],
			[1, 2],
			[0, 2]
		]) {
			const apq = a[p][q];
			if (apq === 0) continue;
			// the angle that zeroes a[p][q]: tan 2φ = 2 a_pq / (a_qq − a_pp), with t = tan φ the smaller root
			const theta = (a[q][q] - a[p][p]) / (2 * apq);
			const tan = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
			const c = 1 / Math.sqrt(tan * tan + 1);
			const s = tan * c;
			for (let k = 0; k < 3; k++) {
				const akp = a[k][p];
				const akq = a[k][q];
				a[k][p] = c * akp - s * akq;
				a[k][q] = s * akp + c * akq;
			}
			for (let k = 0; k < 3; k++) {
				const apk = a[p][k];
				const aqk = a[q][k];
				a[p][k] = c * apk - s * aqk;
				a[q][k] = s * apk + c * aqk;
			}
			a[p][q] = 0;
			a[q][p] = 0;
			for (let k = 0; k < 3; k++) {
				const vkp = v[k][p];
				const vkq = v[k][q];
				v[k][p] = c * vkp - s * vkq;
				v[k][q] = s * vkp + c * vkq;
			}
		}
	}
	const out = [0, 1, 2].map((i) => {
		const axis: Vec3 = [v[0][i], v[1][i], v[2][i]];
		const big = axis.reduce((m, x, k) => (Math.abs(x) > Math.abs(axis[m]) + 1e-12 ? k : m), 0);
		const sign = axis[big] < 0 ? -1 : 1;
		return { value: a[i][i], axis: axis.map((x) => sign * x + 0) as Vec3 };
	});
	out.sort((p, q) => p.value - q.value);
	return out as [Eigen, Eigen, Eigen];
}

/** How near two eigenvalues must be, as a part of |𝓔|, to count as equal in the point-mass ratio. */
export const RATIO_TOLERANCE = 0.01;

/**
 * Whether the eigenvalues stand in the ratio −2 : 1 : 1, the tide of a single mass seen along some axis: the two
 * larger equal and positive (the third is then −2 times either, since the three add to zero). If so, the axis that
 * points at the mass (or away from it), and GM/r³, the size of each squeeze.
 */
export function singleMass(t: Readonly<Matrix>): { axis: Vec3; strength: number } | undefined {
	const length = norm(t);
	if (length < 1e-9) return undefined;
	const [low, mid, high] = eigen(t);
	if (mid.value <= 0 || high.value - mid.value > RATIO_TOLERANCE * length) return undefined;
	return { axis: low.axis, strength: (mid.value + high.value) / 2 };
}

/**
 * The eigenvalues as a ratio, scaled so that the one largest in size is ±2 (−2 : 1 : 1 for a single mass), or
 * undefined for the table of zeros.
 */
export function ratio(
	values: readonly [number, number, number]
): [number, number, number] | undefined {
	const big = values.reduce((m, x) => (Math.abs(x) > Math.abs(m) ? x : m), 0);
	if (Math.abs(big) < 1e-9) return undefined;
	const k = 2 / Math.abs(big);
	return values.map((x) => k * x + 0) as [number, number, number];
}

/** The three rings, each the plane of two axes, in the cyclic order xy, yz, zx: the first is drawn across, the second up. */
export const PLANES = [
	{ id: 'xy', across: 0, up: 1 },
	{ id: 'yz', across: 1, up: 2 },
	{ id: 'zx', across: 2, up: 0 }
] as const;

export type Plane = (typeof PLANES)[number];

/** The 2 × 2 block of a table for one plane, [[T_aa, T_au], [T_ua, T_uu]] for the across axis a and the up axis u. */
export function block(t: Readonly<Matrix>, plane: Plane) {
	const { across: i, up: j } = plane;
	return { a: t[i][i], b: t[i][j], d: t[j][j] };
}

/**
 * The largest size of an eigenvalue of the plane blocks of any table on the sliders. The size of the largest
 * eigenvalue is a convex function of the five coefficients, so its largest value on the box of the sliders is at
 * one of the box's 32 corners.
 */
export function largestOnSliders() {
	let most = 0;
	for (let n = 0; n < 32; n++) {
		const c = [0, 1, 2, 3, 4].map((k) => ((n >> k) & 1 ? MOST : LEAST)) as Coefficients;
		const t = table(c);
		for (const plane of PLANES) {
			const { a, b, d } = block(t, plane);
			const h = Math.hypot((a - d) / 2, b);
			most = Math.max(most, Math.abs((a + d) / 2) + h);
		}
	}
	return most;
}

/** The largest size of a plane block's eigenvalue on the sliders, worked out once (see the spec). */
export const LARGEST = largestOnSliders();

/** How far the drawing moves a ball for each unit of −𝓔 ξ: the largest move anywhere on the sliders is 0.3 of the radius, so no ring folds. */
export const SCALE = 0.3 / LARGEST;

/** Where the drawing puts a ball at rest at ξ in a plane, (1 − s 𝓔) ξ, kept to the plane: its across and up parts. */
export function displaced(t: Readonly<Matrix>, plane: Plane, x: number, y: number, s = SCALE) {
	const { a, b, d } = block(t, plane);
	return { x: x - s * (a * x + b * y), y: y - s * (b * x + d * y) };
}

/** The push on a ball at ξ in a plane, −𝓔 ξ, kept to the plane. */
export function push(t: Readonly<Matrix>, plane: Plane, x: number, y: number) {
	const { a, b, d } = block(t, plane);
	return { x: -(a * x + b * y), y: -(b * x + d * y) };
}

export type Kind = 'stretch' | 'squeeze' | 'still';

/**
 * Whether a ball at ξ moves outward (a stretch), inward (a squeeze) or along the ring: the sign of ξ · (−𝓔 ξ),
 * counted as zero within a twentieth of |𝓔|.
 */
export function kind(t: Readonly<Matrix>, plane: Plane, x: number, y: number): Kind {
	const m = push(t, plane, x, y);
	const radial = m.x * x + m.y * y;
	const edge = 0.05 * norm(t) * (x * x + y * y);
	if (radial > edge) return 'stretch';
	if (radial < -edge) return 'squeeze';
	return 'still';
}

/**
 * Whether every ball of a plane's ring moves inward, which needs the plane's block to have two positive
 * eigenvalues; or every ball outward, two negative ones.
 */
export function ringKind(t: Readonly<Matrix>, plane: Plane): 'shrinks' | 'grows' | 'mixed' {
	const { a, b, d } = block(t, plane);
	const m = (a + d) / 2;
	const h = Math.hypot((a - d) / 2, b);
	const tiny = 1e-9 * Math.max(1, norm(t));
	if (m - h > tiny) return 'shrinks';
	if (m + h < -tiny) return 'grows';
	return 'mixed';
}

/** The ring's balls at rest, a unit circle: n of them, the first on the across axis, counter-clockwise. */
export function ring(n = 12): { x: number; y: number }[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (2 * Math.PI * i) / n;
		return { x: Math.cos(a), y: Math.sin(a) };
	});
}

/** A value on the sliders' grid and within their ends. */
export const snap = (v: number) =>
	Number((Math.round(Math.max(LEAST, Math.min(MOST, v)) / STEP) * STEP).toFixed(2)) + 0;

/** The presets, each a table in units of GM/r³ written in the five coefficients. */
export const PRESETS = {
	/** A person due east, along x: diag(−2, 1, 1), with c_4 = −3/√2 and c_5 = 3/√6. */
	person: [0, 0, 0, -3 / Math.SQRT2, 3 / Math.sqrt(6)] as Coefficients,
	/** A plus wave along z: diag(√2, −√2, 0), all in c_4. */
	plus: [0, 0, 0, 2, 0] as Coefficients,
	/** A cross wave along z: 𝓔_xy = 𝓔_yx = √2, all in c_1. */
	cross: [2, 0, 0, 0, 0] as Coefficients,
	zero: [0, 0, 0, 0, 0] as Coefficients
} as const;

/** A random table on the sliders' grid, each coefficient between −2.5 and 2.5, from a source of numbers in [0, 1). */
export const random = (next: () => number): Coefficients =>
	[0, 1, 2, 3, 4].map(() => snap(5 * next() - 2.5)) as Coefficients;
