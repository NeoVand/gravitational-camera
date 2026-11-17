/**
 * Complex numbers, 3-vectors and 3x3 matrices, and the small eigenproblems the pixel algebra needs. Plain objects
 * and arrays: the demos evaluate a few hundred readings a frame, not millions.
 */

export interface Complex {
	re: number;
	im: number;
}
export type Vec3 = [number, number, number];
export type CVec3 = [Complex, Complex, Complex];
/** A complex 3x3 matrix, by rows. */
export type CMat3 = [CVec3, CVec3, CVec3];

export const cx = (re: number, im = 0): Complex => ({ re, im });
export const ZERO = cx(0);
export const add = (a: Complex, b: Complex): Complex => cx(a.re + b.re, a.im + b.im);
export const sub = (a: Complex, b: Complex): Complex => cx(a.re - b.re, a.im - b.im);
export const mul = (a: Complex, b: Complex): Complex =>
	cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const scale = (a: Complex, s: number): Complex => cx(a.re * s, a.im * s);
export const conj = (a: Complex): Complex => cx(a.re, -a.im);
export const abs = (a: Complex): number => Math.hypot(a.re, a.im);
export const div = (a: Complex, b: Complex): Complex => {
	const d = b.re * b.re + b.im * b.im;
	return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
export const csqrt = (a: Complex): Complex => {
	const r = abs(a);
	const re = Math.sqrt(Math.max(0, (r + a.re) / 2));
	const im = Math.sqrt(Math.max(0, (r - a.re) / 2));
	return cx(re, a.im < 0 ? -im : im);
};
export const cexp = (a: Complex): Complex => {
	const e = Math.exp(a.re);
	return cx(e * Math.cos(a.im), e * Math.sin(a.im));
};
/** The principal cube root. */
export const ccbrt = (a: Complex): Complex => {
	const r = Math.cbrt(abs(a));
	const t = Math.atan2(a.im, a.re) / 3;
	return cx(r * Math.cos(t), r * Math.sin(t));
};

// --- real vectors ---------------------------------------------------------------------------------------------------

export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];
export const norm = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a: Vec3): Vec3 => {
	const n = norm(a);
	return [a[0] / n, a[1] / n, a[2] / n];
};
export const plus = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const minus = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const times = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];

// --- complex vectors and matrices -----------------------------------------------------------------------------------

export const cvec = (v: Vec3): CVec3 => [cx(v[0]), cx(v[1]), cx(v[2])];
export const cdot = (a: CVec3, b: CVec3): Complex =>
	add(add(mul(a[0], b[0]), mul(a[1], b[1])), mul(a[2], b[2]));
export const ccross = (a: CVec3, b: CVec3): CVec3 => [
	sub(mul(a[1], b[2]), mul(a[2], b[1])),
	sub(mul(a[2], b[0]), mul(a[0], b[2])),
	sub(mul(a[0], b[1]), mul(a[1], b[0]))
];

export function cmat(f: (i: number, j: number) => Complex): CMat3 {
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => f(i, j))) as CMat3;
}
export const zeroMat = (): CMat3 => cmat(() => ZERO);
export const identity = (): CMat3 => cmat((i, j) => cx(i === j ? 1 : 0));
export const madd = (A: CMat3, B: CMat3): CMat3 => cmat((i, j) => add(A[i][j], B[i][j]));
export const mscale = (A: CMat3, s: Complex): CMat3 => cmat((i, j) => mul(A[i][j], s));
export const mmul = (A: CMat3, B: CMat3): CMat3 =>
	cmat((i, j) => add(add(mul(A[i][0], B[0][j]), mul(A[i][1], B[1][j])), mul(A[i][2], B[2][j])));
export const transpose = (A: CMat3): CMat3 => cmat((i, j) => A[j][i]);
export const adjoint = (A: CMat3): CMat3 => cmat((i, j) => conj(A[j][i]));
export const trace = (A: CMat3): Complex => add(add(A[0][0], A[1][1]), A[2][2]);
export const mvec = (A: CMat3, v: CVec3): CVec3 =>
	[0, 1, 2].map((i) =>
		add(add(mul(A[i][0], v[0]), mul(A[i][1], v[1])), mul(A[i][2], v[2]))
	) as CVec3;
export const outer = (a: CVec3, b: CVec3): CMat3 => cmat((i, j) => mul(a[i], b[j]));
export const fnorm = (A: CMat3): number =>
	Math.sqrt(A.flat().reduce((s, z) => s + z.re * z.re + z.im * z.im, 0));
export const realMat = (M: number[][]): CMat3 => cmat((i, j) => cx(M[i][j]));
export const det = (A: CMat3): Complex =>
	add(
		sub(
			mul(A[0][0], sub(mul(A[1][1], A[2][2]), mul(A[1][2], A[2][1]))),
			mul(A[0][1], sub(mul(A[1][0], A[2][2]), mul(A[1][2], A[2][0])))
		),
		mul(A[0][2], sub(mul(A[1][0], A[2][1]), mul(A[1][1], A[2][0])))
	);

// --- polynomials ----------------------------------------------------------------------------------------------------

/** Coefficients, lowest degree first. */
export type Poly = Complex[];
export function pmul(a: Poly, b: Poly): Poly {
	const out: Poly = Array.from({ length: a.length + b.length - 1 }, () => ZERO);
	a.forEach((x, i) => b.forEach((y, j) => (out[i + j] = add(out[i + j], mul(x, y)))));
	return out;
}
export function padd(a: Poly, b: Poly): Poly {
	const n = Math.max(a.length, b.length);
	return Array.from({ length: n }, (_, i) => add(a[i] ?? ZERO, b[i] ?? ZERO));
}

/**
 * The roots of a polynomial (lowest degree first) by the Durand-Kerner iteration, after dropping leading
 * coefficients that are negligible against the rest. Repeated roots converge to about the square root (double) or
 * fourth root (quadruple) of the working precision, as in any root finder.
 */
export function roots(p: Poly): Complex[] {
	const big = Math.max(...p.map(abs));
	let n = p.length - 1;
	while (n > 0 && abs(p[n]) < 1e-13 * big) n--;
	if (n < 1) return [];
	const lead = p[n];
	const q = p.slice(0, n + 1).map((c) => div(c, lead));
	let z = Array.from({ length: n }, (_, k) => {
		const s = cx(0.4, 0.9);
		let w = cx(1);
		for (let i = 0; i < k; i++) w = mul(w, s);
		return w;
	});
	const evalp = (x: Complex) => {
		let s = q[n];
		for (let i = n - 1; i >= 0; i--) s = add(mul(s, x), q[i]);
		return s;
	};
	for (let it = 0; it < 600; it++) {
		let moved = 0;
		z = z.map((zi, i) => {
			let d = cx(1);
			z.forEach((zj, j) => {
				if (j !== i) d = mul(d, sub(zi, zj));
			});
			const step = abs(d) === 0 ? cx(1e-12) : div(evalp(zi), d);
			moved = Math.max(moved, abs(step));
			return sub(zi, step);
		});
		if (moved < 1e-15) break;
	}
	return z;
}

// --- eigenproblems --------------------------------------------------------------------------------------------------

/** Eigenvalues and eigenvectors (columns) of a real symmetric matrix, by Jacobi rotations; ascending. */
export function symmetricEigen(M: number[][]): { values: number[]; vectors: number[][] } {
	const n = M.length;
	const A = M.map((r) => r.slice());
	const V: number[][] = Array.from({ length: n }, (_, i) =>
		Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
	);
	for (let sweep = 0; sweep < 100; sweep++) {
		let off = 0;
		for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
		if (
			off <
			1e-30 *
				Math.max(
					1e-300,
					A.reduce((s, r, i) => s + r[i] * r[i], 0)
				)
		)
			break;
		for (let p = 0; p < n; p++) {
			for (let q = p + 1; q < n; q++) {
				if (Math.abs(A[p][q]) < 1e-300) continue;
				const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
				const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
				const c = 1 / Math.sqrt(t * t + 1);
				const s = t * c;
				for (let k = 0; k < n; k++) {
					const akp = A[k][p],
						akq = A[k][q];
					A[k][p] = c * akp - s * akq;
					A[k][q] = s * akp + c * akq;
				}
				for (let k = 0; k < n; k++) {
					const apk = A[p][k],
						aqk = A[q][k];
					A[p][k] = c * apk - s * aqk;
					A[q][k] = s * apk + c * aqk;
				}
				for (let k = 0; k < n; k++) {
					const vkp = V[k][p],
						vkq = V[k][q];
					V[k][p] = c * vkp - s * vkq;
					V[k][q] = s * vkp + c * vkq;
				}
			}
		}
	}
	const order = A.map((r, i) => [r[i], i] as const).sort((a, b) => a[0] - b[0]);
	return {
		values: order.map(([v]) => v),
		vectors: Array.from({ length: n }, (_, k) => order.map(([, i]) => V[k][i]))
	};
}

/**
 * Eigenvalues and eigenvectors of a Hermitian matrix (given as rows of complex numbers), ascending, through the real
 * symmetric matrix [[A, -B], [B, A]] of A + iB, whose spectrum is the Hermitian one twice over.
 */
export function hermitianEigen(H: Complex[][]): { values: number[]; vectors: Complex[][] } {
	const n = H.length;
	const M = Array.from({ length: 2 * n }, (_, i) =>
		Array.from({ length: 2 * n }, (_, j) => {
			const a = H[i % n][j % n];
			if (i < n && j < n) return a.re;
			if (i >= n && j >= n) return a.re;
			if (i < n) return -a.im; // top right: -B
			return a.im; // bottom left: B
		})
	);
	const { values, vectors } = symmetricEigen(M);
	// each eigenvalue appears twice; keep every other one, and the complex vector x + iy of each
	const outValues: number[] = [];
	const outVectors: Complex[][] = [];
	for (let k = 0; k < 2 * n; k += 2) {
		outValues.push(values[k]);
		const v = Array.from({ length: n }, (_, i) => cx(vectors[i][k], vectors[i + n][k]));
		const len = Math.sqrt(v.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0));
		outVectors.push(v.map((z) => scale(z, 1 / len)));
	}
	return { values: outValues, vectors: outVectors };
}

/** The vector x (unit length) minimizing |A x| for a complex matrix A (rows): the smallest right singular vector. */
export function nullVector(A: Complex[][]): Complex[] {
	const n = A[0].length;
	const H = Array.from({ length: n }, (_, i) =>
		Array.from({ length: n }, (_, j) =>
			A.reduce((s, row) => add(s, mul(conj(row[i]), row[j])), ZERO)
		)
	);
	return hermitianEigen(H).vectors[0];
}
