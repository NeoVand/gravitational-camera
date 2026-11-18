/**
 * The linear algebra the array's inversion needs, written out: a few hundred unknowns at most, dense, in double
 * precision. Householder QR, a one-sided Jacobi singular value decomposition, Cholesky, least squares, and the
 * complementary error function. Each is pinned in linalg.spec.ts to numpy, scipy or Python's math module.
 */

/** A dense matrix by rows. */
export interface Matrix {
	rows: number;
	cols: number;
	data: Float64Array;
}

export const matrix = (rows: number, cols: number): Matrix => ({
	rows,
	cols,
	data: new Float64Array(rows * cols)
});

export function fromRows(rows: number[][]): Matrix {
	const out = matrix(rows.length, rows[0]?.length ?? 0);
	rows.forEach((row, i) => out.data.set(row, i * out.cols));
	return out;
}

export function transpose(a: Matrix): Matrix {
	const out = matrix(a.cols, a.rows);
	for (let i = 0; i < a.rows; i++)
		for (let j = 0; j < a.cols; j++) out.data[j * a.rows + i] = a.data[i * a.cols + j];
	return out;
}

/** A x. */
export function times(a: Matrix, x: ArrayLike<number>): Float64Array {
	const out = new Float64Array(a.rows);
	for (let i = 0; i < a.rows; i++) {
		let s = 0;
		const at = i * a.cols;
		for (let j = 0; j < a.cols; j++) s += a.data[at + j] * x[j];
		out[i] = s;
	}
	return out;
}

/** A^T y. */
export function transposeTimes(a: Matrix, y: ArrayLike<number>): Float64Array {
	const out = new Float64Array(a.cols);
	for (let i = 0; i < a.rows; i++) {
		const yi = y[i];
		if (yi === 0) continue;
		const at = i * a.cols;
		for (let j = 0; j < a.cols; j++) out[j] += a.data[at + j] * yi;
	}
	return out;
}

export function norm(x: ArrayLike<number>): number {
	let top = 0;
	for (let i = 0; i < x.length; i++) top = Math.max(top, Math.abs(x[i]));
	if (top === 0 || !isFinite(top)) return top;
	// scaled, so that readings of 1e-10 s^-2 neither underflow nor lose digits
	let s = 0;
	for (let i = 0; i < x.length; i++) s += (x[i] / top) ** 2;
	return top * Math.sqrt(s);
}

// --- Householder QR ---------------------------------------------------------------------------------------------------

export interface QR {
	rows: number;
	cols: number;
	/** The reflectors below the diagonal and R on and above it, by rows. */
	packed: Float64Array;
	/** 2 / v.v for each reflector v (zero where the column was already zero). */
	beta: Float64Array;
	/** With pivoting: column j of R stands for column perm[j] of the matrix. */
	perm?: Int32Array;
}

/**
 * A = Q R for a matrix with at least as many rows as columns, by Householder reflections. With `pivot`, the largest
 * remaining column is taken at each step, A P = Q R, so that R's diagonal falls in size: this is what lets the
 * Jacobi iteration of `svdOfQR` finish in a few sweeps on a matrix whose singular values span many decades.
 */
export function qr(a: Matrix, pivot = false): QR {
	const { rows: m, cols: n } = a;
	if (m < n) throw new RangeError('qr needs at least as many rows as columns');
	const w = Float64Array.from(a.data);
	const beta = new Float64Array(n);
	const v = new Float64Array(m);
	const perm = pivot ? Int32Array.from({ length: n }, (_, j) => j) : undefined;
	/** The squared length of what is left of column j below row k. */
	const below = (j: number, k: number) => {
		let s = 0;
		for (let i = k; i < m; i++) s += w[i * n + j] * w[i * n + j];
		return s;
	};
	const left = new Float64Array(n);
	const whole = new Float64Array(n);
	if (perm)
		for (let j = 0; j < n; j++) {
			left[j] = below(j, 0);
			whole[j] = left[j];
		}
	for (let k = 0; k < n; k++) {
		if (perm) {
			let best = k;
			for (let j = k + 1; j < n; j++) if (left[j] > left[best]) best = j;
			if (best !== k) {
				for (let i = 0; i < m; i++) {
					const t = w[i * n + k];
					w[i * n + k] = w[i * n + best];
					w[i * n + best] = t;
				}
				[perm[k], perm[best]] = [perm[best], perm[k]];
				[left[k], left[best]] = [left[best], left[k]];
				[whole[k], whole[best]] = [whole[best], whole[k]];
			}
		}
		let top = 0;
		for (let i = k; i < m; i++) top = Math.max(top, Math.abs(w[i * n + k]));
		if (top === 0) continue;
		let s = 0;
		for (let i = k; i < m; i++) s += (w[i * n + k] / top) ** 2;
		const size = top * Math.sqrt(s);
		const head = w[k * n + k];
		const alpha = head > 0 ? -size : size;
		// v = x - alpha e_k, scaled so that its head is one
		const v0 = head - alpha;
		v[k] = 1;
		let vv = 1;
		for (let i = k + 1; i < m; i++) {
			v[i] = w[i * n + k] / v0;
			vv += v[i] * v[i];
		}
		beta[k] = 2 / vv;
		for (let j = k + 1; j < n; j++) {
			let dot = 0;
			for (let i = k; i < m; i++) dot += v[i] * w[i * n + j];
			dot *= beta[k];
			for (let i = k; i < m; i++) w[i * n + j] -= dot * v[i];
			if (perm) {
				// what is left of the column loses its entry in row k; counted afresh once most of it has gone
				left[j] -= w[k * n + j] * w[k * n + j];
				if (!(left[j] > 1e-6 * whole[j])) {
					left[j] = below(j, k + 1);
					whole[j] = left[j];
				}
			}
		}
		w[k * n + k] = alpha;
		for (let i = k + 1; i < m; i++) w[i * n + k] = v[i];
	}
	return { rows: m, cols: n, packed: w, beta, perm };
}

/** The square upper triangle R of a factorisation. */
export function upper(f: QR): Matrix {
	const r = matrix(f.cols, f.cols);
	for (let i = 0; i < f.cols; i++)
		for (let j = i; j < f.cols; j++) r.data[i * f.cols + j] = f.packed[i * f.cols + j];
	return r;
}

/** Q^T b, all of its `rows` entries: the first `cols` are what R sees, the rest the part no fit can reach. */
export function applyQt(f: QR, b: ArrayLike<number>): Float64Array {
	const { rows: m, cols: n, packed: w, beta } = f;
	const out = Float64Array.from(b);
	for (let k = 0; k < n; k++) {
		if (beta[k] === 0) continue;
		let dot = out[k];
		for (let i = k + 1; i < m; i++) dot += w[i * n + k] * out[i];
		dot *= beta[k];
		out[k] -= dot;
		for (let i = k + 1; i < m; i++) out[i] -= dot * w[i * n + k];
	}
	return out;
}

/** Q b for a vector of `rows` entries. */
export function applyQ(f: QR, b: ArrayLike<number>): Float64Array {
	const { rows: m, cols: n, packed: w, beta } = f;
	const out = Float64Array.from(b);
	for (let k = n - 1; k >= 0; k--) {
		if (beta[k] === 0) continue;
		let dot = out[k];
		for (let i = k + 1; i < m; i++) dot += w[i * n + k] * out[i];
		dot *= beta[k];
		out[k] -= dot;
		for (let i = k + 1; i < m; i++) out[i] -= dot * w[i * n + k];
	}
	return out;
}

/**
 * The least-squares solution of A x = b for a matrix of full column rank, through QR. A column that the ones before
 * it already span (a zero on R's diagonal, to rounding) gets no weight.
 */
export function leastSquares(a: Matrix, b: ArrayLike<number>): Float64Array {
	const f = qr(a);
	const n = a.cols;
	const c = applyQt(f, b);
	const x = new Float64Array(n);
	let top = 0;
	for (let i = 0; i < n; i++) top = Math.max(top, Math.abs(f.packed[i * n + i]));
	for (let i = n - 1; i >= 0; i--) {
		const d = f.packed[i * n + i];
		if (Math.abs(d) <= 1e-14 * top) continue;
		let s = c[i];
		for (let j = i + 1; j < n; j++) s -= f.packed[i * n + j] * x[j];
		x[i] = s / d;
	}
	return x;
}

// --- singular values --------------------------------------------------------------------------------------------------

export interface SVD {
	/** Singular values, the largest first; min(rows, cols) of them. */
	s: Float64Array;
	/** The left singular vectors as the rows of a matrix: U^T, min(rows, cols) x rows. */
	ut: Matrix;
	/** The right singular vectors as the rows of a matrix: V^T, min(rows, cols) x cols. */
	vt: Matrix;
	/** How many sweeps the Jacobi iteration took. */
	sweeps: number;
}

/**
 * One-sided Jacobi (Hestenes) on a square matrix held by columns: plane rotations of pairs of columns until every
 * pair is orthogonal. On return the columns of `x` are the left singular vectors times their singular values and
 * `v`, which must come in as the identity, holds the right singular vectors by columns.
 */
function orthogonalise(x: Float64Array[], v: Float64Array[]): number {
	const n = x.length;
	const TOL = 1e-15;
	for (let sweep = 1; sweep <= 80; sweep++) {
		let turned = false;
		// the squared lengths are carried through a sweep and taken afresh at the start of each
		const len = x.map((col) => {
			let s = 0;
			for (let i = 0; i < col.length; i++) s += col[i] * col[i];
			return s;
		});
		for (let p = 0; p < n - 1; p++) {
			const xp = x[p];
			for (let q = p + 1; q < n; q++) {
				const xq = x[q];
				let gamma = 0;
				for (let i = 0; i < n; i++) gamma += xp[i] * xq[i];
				const alpha = len[p];
				const beta = len[q];
				if (gamma === 0 || Math.abs(gamma) <= TOL * Math.sqrt(alpha * beta)) continue;
				turned = true;
				const zeta = (beta - alpha) / (2 * gamma);
				const t = (zeta < 0 ? -1 : 1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
				const c = 1 / Math.sqrt(1 + t * t);
				const s = c * t;
				for (let i = 0; i < n; i++) {
					const a = xp[i];
					const b = xq[i];
					xp[i] = c * a - s * b;
					xq[i] = s * a + c * b;
				}
				const vp = v[p];
				const vq = v[q];
				for (let i = 0; i < n; i++) {
					const a = vp[i];
					const b = vq[i];
					vp[i] = c * a - s * b;
					vq[i] = s * a + c * b;
				}
				len[p] = Math.max(0, alpha - t * gamma);
				len[q] = Math.max(0, beta + t * gamma);
			}
		}
		if (!turned) return sweep;
	}
	throw new Error('the Jacobi iteration did not converge');
}

/**
 * The thin singular value decomposition, A = U S V^T, of any dense matrix. A matrix with more columns than rows is
 * transposed first. The work is a QR factorisation and then one-sided Jacobi rotations on the transpose of R, which
 * finds small singular values to their own relative accuracy and never forms A^T A.
 */
export function svd(a: Matrix): SVD {
	if (a.rows < a.cols) {
		const t = svd(transpose(a));
		return { s: t.s, ut: t.vt, vt: t.ut, sweeps: t.sweeps };
	}
	return svdOfQR(qr(a, true));
}

/** The same from a QR factorisation already in hand, pivoted or not. */
export function svdOfQR(f: QR): SVD {
	const { rows: m, cols: n } = f;
	// the columns of X are the rows of R, that is, X = R^T = V S U_r^T: its left vectors are A's right ones
	const x: Float64Array[] = [];
	const w: Float64Array[] = [];
	for (let k = 0; k < n; k++) {
		const col = new Float64Array(n);
		for (let j = k; j < n; j++) col[j] = f.packed[k * n + j];
		x.push(col);
		const e = new Float64Array(n);
		e[k] = 1;
		w.push(e);
	}
	const sweeps = orthogonalise(x, w);
	const s = new Float64Array(n);
	for (let k = 0; k < n; k++) s[k] = norm(x[k]);
	const order = Array.from({ length: n }, (_, k) => k).sort((i, j) => s[j] - s[i]);
	const out: SVD = {
		s: new Float64Array(n),
		ut: matrix(n, m),
		vt: matrix(n, n),
		sweeps
	};
	const padded = new Float64Array(m);
	order.forEach((k, at) => {
		out.s[at] = s[k];
		// R^T = X W^T with X = V S, so V_k = x_k / s_k, and R = W S V^T, so U_k = Q (w_k, 0)
		if (s[k] > 0)
			for (let j = 0; j < n; j++) out.vt.data[at * n + (f.perm ? f.perm[j] : j)] = x[k][j] / s[k];
		padded.fill(0);
		padded.set(w[k]);
		out.ut.data.set(applyQ(f, padded), at * m);
	});
	return out;
}

// --- Cholesky -----------------------------------------------------------------------------------------------------------

/** The lower triangle L of A = L L^T for a symmetric positive definite matrix; throws if it is not one. */
export function cholesky(a: Matrix): Matrix {
	const n = a.rows;
	const l = matrix(n, n);
	for (let i = 0; i < n; i++) {
		for (let j = 0; j <= i; j++) {
			let s = a.data[i * n + j];
			for (let k = 0; k < j; k++) s -= l.data[i * n + k] * l.data[j * n + k];
			if (i === j) {
				if (!(s > 0)) throw new RangeError('the matrix is not positive definite');
				l.data[i * n + i] = Math.sqrt(s);
			} else {
				l.data[i * n + j] = s / l.data[j * n + j];
			}
		}
	}
	return l;
}

/** The solution of L L^T x = b. */
export function choleskySolve(l: Matrix, b: ArrayLike<number>): Float64Array {
	const n = l.rows;
	const x = Float64Array.from(b);
	for (let i = 0; i < n; i++) {
		let s = x[i];
		for (let k = 0; k < i; k++) s -= l.data[i * n + k] * x[k];
		x[i] = s / l.data[i * n + i];
	}
	for (let i = n - 1; i >= 0; i--) {
		let s = x[i];
		for (let k = i + 1; k < n; k++) s -= l.data[k * n + i] * x[k];
		x[i] = s / l.data[i * n + i];
	}
	return x;
}

// --- the complementary error function --------------------------------------------------------------------------------

/**
 * erfc(x), to a relative accuracy near 1e-13 wherever it does not underflow: below 2.5 from the series of positive
 * terms erf(x) = (2 / sqrt(pi)) exp(-x^2) sum_n 2^n x^(2n+1) / (2n+1)!!, above from the continued fraction
 * erfc(x) = exp(-x^2) / (sqrt(pi) (x + (1/2) / (x + 1 / (x + (3/2) / (x + ...))))).
 */
export function erfc(x: number): number {
	if (x < 0) return 2 - erfc(-x);
	if (x < 2.5) {
		let term = x;
		let sum = x;
		for (let n = 1; n < 200; n++) {
			term *= (2 * x * x) / (2 * n + 1);
			sum += term;
			if (term < 1e-17 * sum) break;
		}
		return 1 - (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x) * sum;
	}
	return Math.exp(-x * x) / (Math.sqrt(Math.PI) * tailOf(x));
}

/** The continued fraction x + (1/2) / (x + 1 / (x + (3/2) / (x + ...))), evaluated from the tail upward. */
function tailOf(x: number): number {
	let tail = x;
	for (let k = 120; k >= 1; k--) tail = x + k / 2 / tail;
	return tail;
}

/** log10 of erfc(x), which stays finite where erfc itself underflows: -x^2 / ln 10 - log10(sqrt(pi) tail). */
export function log10Erfc(x: number): number {
	if (x < 2.5) return Math.log10(erfc(x));
	return -(x * x) / Math.LN10 - Math.log10(Math.sqrt(Math.PI) * tailOf(x));
}
