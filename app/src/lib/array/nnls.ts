/**
 * Non-negative least squares: the x >= 0 that makes |A x - b| least, by the active-set method of Lawson and Hanson
 * ("Solving Least Squares Problems", 1974, chapter 23), the algorithm behind scipy.optimize.nnls, which the
 * reference's positive_case calls. Each trial solution is a least-squares fit through QR on the columns let free,
 * so nothing is squared.
 */
import { leastSquares, matrix, norm, times, transposeTimes, type Matrix } from './linalg';

export interface Nnls {
	x: Float64Array;
	/** |A x - b|. */
	residual: number;
	iterations: number;
}

export function nnls(a: Matrix, b: ArrayLike<number>, maxIterations = 5000): Nnls {
	const { rows: m, cols: n } = a;
	const x = new Float64Array(n);
	const free = new Uint8Array(n);
	const residual = Float64Array.from(b);
	let w = transposeTimes(a, residual);
	// a gradient this small against the largest at the start is rounding
	let scale = 0;
	for (let j = 0; j < n; j++) scale = Math.max(scale, Math.abs(w[j]));
	const tolerance = 10 * Math.max(m, n) * Number.EPSILON * scale;
	const refused = new Uint8Array(n);

	/** The least-squares fit on the free columns alone; zero elsewhere. */
	const fit = (): Float64Array => {
		const index: number[] = [];
		for (let j = 0; j < n; j++) if (free[j]) index.push(j);
		const sub = matrix(m, index.length);
		for (let i = 0; i < m; i++)
			for (let k = 0; k < index.length; k++)
				sub.data[i * index.length + k] = a.data[i * n + index[k]];
		const z = new Float64Array(n);
		const solved = leastSquares(sub, b);
		index.forEach((j, k) => (z[j] = solved[k]));
		return z;
	};

	let iterations = 0;
	for (;;) {
		// the column, among those held at zero, along which the misfit falls fastest
		let enter = -1;
		for (let j = 0; j < n; j++)
			if (!free[j] && !refused[j] && w[j] > tolerance && (enter < 0 || w[j] > w[enter])) enter = j;
		if (enter < 0) break;
		if (++iterations > maxIterations) throw new Error('nnls: too many iterations');
		free[enter] = 1;
		let z = fit();
		// a column that the free ones already span would come in with no weight, or a negative one: leave it out
		if (!(z[enter] > 0)) {
			free[enter] = 0;
			refused[enter] = 1;
			continue;
		}
		refused.fill(0);
		for (;;) {
			// the free column whose weight reaches zero first on the way from x to the fit
			let step = 1;
			let leave = -1;
			for (let j = 0; j < n; j++) {
				if (!free[j] || z[j] > 0) continue;
				const reach = x[j] / (x[j] - z[j]);
				if (leave < 0 || reach < step) {
					step = reach;
					leave = j;
				}
			}
			if (leave < 0) break;
			// move toward the fit as far as positivity allows, and hold at zero whatever arrives there
			for (let j = 0; j < n; j++) if (free[j]) x[j] += step * (z[j] - x[j]);
			x[leave] = 0;
			free[leave] = 0;
			for (let j = 0; j < n; j++)
				if (free[j] && x[j] <= 0) {
					x[j] = 0;
					free[j] = 0;
				}
			if (++iterations > maxIterations) throw new Error('nnls: too many iterations');
			z = fit();
		}
		x.set(z);
		const predicted = times(a, x);
		for (let i = 0; i < m; i++) residual[i] = b[i] - predicted[i];
		w = transposeTimes(a, residual);
	}
	return { x, residual: norm(residual), iterations };
}
