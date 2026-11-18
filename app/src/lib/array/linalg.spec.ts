/**
 * The linear algebra of the array's inversion against numpy, scipy and Python's math module. Each expected value
 * was computed in reference/ with ../.venv/bin/python; the call is named above it.
 */
import { describe, expect, it } from 'vitest';
import {
	applyQ,
	applyQt,
	cholesky,
	choleskySolve,
	erfc,
	fromRows,
	leastSquares,
	log10Erfc,
	matrix,
	norm,
	qr,
	svd,
	times,
	transpose,
	transposeTimes,
	upper,
	type Matrix
} from './linalg';
import { nnls } from './nnls';
import { normals, uniform } from './random';

// A = np.array([[4,1,-2,0.5],[1,3,0,-1],[-2,0,5,2],[0.5,-1,2,6],[1,1,1,1],[0,2,-1,3]]); b = np.array([1,-2,3,0.5,2,-1])
const A = fromRows([
	[4, 1, -2, 0.5],
	[1, 3, 0, -1],
	[-2, 0, 5, 2],
	[0.5, -1, 2, 6],
	[1, 1, 1, 1],
	[0, 2, -1, 3]
]);
const b = [1, -2, 3, 0.5, 2, -1];

const product = (a: Matrix, c: Matrix): Matrix => {
	const out = matrix(a.rows, c.cols);
	for (let i = 0; i < a.rows; i++)
		for (let j = 0; j < c.cols; j++)
			for (let k = 0; k < a.cols; k++)
				out.data[i * c.cols + j] += a.data[i * a.cols + k] * c.data[k * c.cols + j];
	return out;
};

const close = (actual: ArrayLike<number>, expected: number[], rel = 1e-12) => {
	const top = Math.max(...expected.map(Math.abs));
	expected.forEach((v, i) => expect(Math.abs(actual[i] - v)).toBeLessThanOrEqual(rel * top));
};

describe('QR and least squares', () => {
	it('R has the diagonal of np.linalg.qr(A)[1], up to sign', () => {
		// np.abs(np.diag(np.linalg.qr(A)[1]))
		const r = upper(qr(A));
		close(
			[0, 1, 2, 3].map((i) => Math.abs(r.data[i * 4 + i])),
			[4.716990566028302, 3.670410074141519, 4.845916055678455, 5.857115771178039]
		);
	});

	it('Q is orthogonal: Q^T undoes Q, and lengths are kept', () => {
		const f = qr(A);
		const back = applyQ(f, applyQt(f, b));
		close(back, b, 1e-14);
		expect(norm(applyQt(f, b))).toBeCloseTo(norm(b), 12);
	});

	it('least squares agrees with np.linalg.lstsq(A, b)', () => {
		close(
			leastSquares(A, b),
			[0.6084895734792194, -0.4004773198034916, 0.7615173914247568, -0.10103484859033823]
		);
	});

	it('pivoting takes the largest column first and leaves the fit the same', () => {
		const f = qr(A, true);
		// column 3 is the longest: 0.25 + 1 + 4 + 36 + 1 + 9
		expect(f.perm![0]).toBe(3);
		const r = upper(f);
		for (let i = 1; i < 4; i++)
			expect(Math.abs(r.data[i * 4 + i])).toBeLessThanOrEqual(
				Math.abs(r.data[(i - 1) * 4 + i - 1])
			);
	});
});

describe('the singular value decomposition', () => {
	it('gives the singular values of np.linalg.svd(A)', () => {
		close(svd(A).s, [8.129666996355038, 6.099916943368871, 3.7898371229944665, 2.6147012054057264]);
	});

	it('U S V^T is the matrix again, with orthonormal U and V, for a tall and for a wide matrix', () => {
		for (const M of [A, transpose(A)]) {
			const { s, ut, vt } = svd(M);
			const scaled = matrix(s.length, vt.cols);
			for (let k = 0; k < s.length; k++)
				for (let j = 0; j < vt.cols; j++)
					scaled.data[k * vt.cols + j] = s[k] * vt.data[k * vt.cols + j];
			close(product(transpose(ut), scaled).data, Array.from(M.data), 1e-14);
			for (const Q of [ut, vt]) {
				const gram = product(Q, transpose(Q));
				for (let i = 0; i < Q.rows; i++)
					for (let j = 0; j < Q.rows; j++)
						expect(gram.data[i * Q.rows + j]).toBeCloseTo(i === j ? 1 : 0, 13);
			}
		}
	});

	it('finds singular values nine decades apart: the 10 x 8 Hilbert matrix', () => {
		// H = np.array([[1/(i+j+1) for j in range(8)] for i in range(10)]); np.linalg.svd(H, compute_uv=False)
		const H = fromRows(
			Array.from({ length: 10 }, (_, i) => Array.from({ length: 8 }, (_, j) => 1 / (i + j + 1)))
		);
		const expected = [
			1.7227770710133055, 0.3191327950097162, 0.030499580073023693, 0.0019172284055028702,
			8.309243675042807e-5, 2.453454655962527e-6, 4.6556932071802536e-8, 4.831291853305489e-10
		];
		const { s } = svd(H);
		// each to its own size, not to the largest
		expected.forEach((v, k) => expect(Math.abs(s[k] / v - 1)).toBeLessThan(1e-6));
		expect(Math.abs(s[0] / expected[0] - 1)).toBeLessThan(1e-14);
	});
});

describe('Cholesky', () => {
	it('factors A^T A as np.linalg.cholesky does, and solves the normal equations', () => {
		const P = product(transpose(A), A);
		const L = cholesky(P);
		// np.diag(np.linalg.cholesky(A.T @ A))
		close(
			[0, 1, 2, 3].map((i) => L.data[i * 4 + i]),
			[4.716990566028302, 3.670410074141519, 4.8459160556784555, 5.857115771178041]
		);
		// np.linalg.solve(A.T @ A, A.T @ b)
		close(
			choleskySolve(L, transposeTimes(A, b)),
			[0.6084895734792192, -0.40047731980349194, 0.7615173914247563, -0.10103484859033805]
		);
	});

	it('refuses a matrix that is not positive definite', () => {
		expect(() =>
			cholesky(
				fromRows([
					[1, 2],
					[2, 1]
				])
			)
		).toThrow(RangeError);
	});
});

describe('non-negative least squares', () => {
	it('agrees with scipy.optimize.nnls(A, b), which holds two of the four at zero', () => {
		const fit = nnls(A, b);
		close(fit.x, [0.4031563845050216, 0, 0.6700143472022956, 0]);
		expect(fit.residual).toBeCloseTo(2.926649922769165, 12);
		expect(norm(times(A, fit.x).map((v, i) => v - b[i]))).toBeCloseTo(fit.residual, 12);
	});

	it('agrees with scipy on a second problem, and gives nothing when every column points away', () => {
		// B, c below; scipy.optimize.nnls(B, c) and nnls(B, -np.abs(c))
		const B = fromRows([
			[1, 2, 3, 4, 5],
			[2, -1, 0.5, 3, 1],
			[0, 1, -2, 1, 4],
			[3, 0, 1, -1, 2],
			[1, 1, 1, 1, 1],
			[2, 3, -1, 0, -2],
			[-1, 2, 2, 1, 0]
		]);
		const c = [3, 1, -2, 4, 0.5, -1, 2];
		const fit = nnls(B, c);
		close(fit.x, [0.45856969851488294, 0, 1.0331123717254127, 0, 0.019615654280068947]);
		expect(fit.residual).toBeCloseTo(2.221448832672792, 12);
		const none = nnls(
			B,
			c.map((v) => -Math.abs(v))
		);
		expect(Array.from(none.x)).toEqual([0, 0, 0, 0, 0]);
		expect(none.residual).toBeCloseTo(5.937171043518958, 12);
	});
});

describe('erfc', () => {
	it('agrees with math.erfc to a part in 1e12, from 0 to where it is 1e-296', () => {
		// [(x, math.erfc(x)) for x in (0, 0.1, 0.5, 1, 2, 2.4999, 2.5, 3, 5, 10, 26)]
		const table: [number, number][] = [
			[0, 1.0],
			[0.1, 0.8875370839817152],
			[0.5, 0.4795001221869535],
			[1, 0.15729920705028516],
			[2, 0.0046777349810472645],
			[2.4999, 0.00040716990033345127],
			[2.5, 0.000406952017444959],
			[3, 2.2090496998585438e-5],
			[5, 1.537459794428035e-12],
			[10, 2.0884875837625446e-45],
			[26, 5.663192408856143e-296]
		];
		for (const [x, value] of table) expect(Math.abs(erfc(x) / value - 1)).toBeLessThan(1e-12);
		expect(erfc(-1)).toBeCloseTo(2 - 0.15729920705028516, 14);
		expect(erfc(40)).toBe(0);
	});

	it('its logarithm agrees with math.log10(math.erfc(x)), and goes on where erfc is zero', () => {
		// math.log10(math.erfc(x)) for x in (1, 5, 26)
		expect(log10Erfc(1)).toBeCloseTo(Math.log10(0.15729920705028516), 12);
		expect(log10Erfc(5)).toBeCloseTo(Math.log10(1.537459794428035e-12), 11);
		expect(log10Erfc(26)).toBeCloseTo(Math.log10(5.663192408856143e-296), 9);
		// erfc(x) ~ exp(-x^2) / (x sqrt(pi)) for large x: at 100, log10 = -4342.94 - 2.25
		expect(erfc(100)).toBe(0);
		expect(log10Erfc(100)).toBeCloseTo(-1e4 / Math.LN10 - Math.log10(100 * Math.sqrt(Math.PI)), 4);
	});
});

describe('seeded noise', () => {
	it('the same seed gives the same draws, another seed others', () => {
		expect(Array.from(normals(7, 9))).toEqual(Array.from(normals(7, 9)));
		expect(Array.from(normals(7, 9))).not.toEqual(Array.from(normals(8, 9)));
		// a longer draw begins with the shorter one
		expect(Array.from(normals(7, 20).subarray(0, 8))).toEqual(Array.from(normals(7, 8)));
		const next = uniform(3);
		const first = [next(), next(), next()];
		const again = uniform(3);
		expect([again(), again(), again()]).toEqual(first);
		first.forEach((u) => expect(u >= 0 && u < 1).toBe(true));
	});

	it('the draws are standard normal: mean 0, variance 1, no skew, kurtosis 3', () => {
		const z = normals(12345, 200_000);
		const moment = (p: number) => z.reduce((s, v) => s + v ** p, 0) / z.length;
		// each within four standard errors: 1/sqrt(N), sqrt(2/N), sqrt(15/N), sqrt(96/N)
		expect(Math.abs(moment(1))).toBeLessThan(4 / Math.sqrt(z.length));
		expect(Math.abs(moment(2) - 1)).toBeLessThan(4 * Math.sqrt(2 / z.length));
		expect(Math.abs(moment(3))).toBeLessThan(4 * Math.sqrt(15 / z.length));
		expect(Math.abs(moment(4) - 3)).toBeLessThan(4 * Math.sqrt(96 / z.length));
		// neighbours are not correlated
		let lag = 0;
		for (let i = 1; i < z.length; i++) lag += z[i] * z[i - 1];
		expect(Math.abs(lag / z.length)).toBeLessThan(4 / Math.sqrt(z.length));
	});
});
