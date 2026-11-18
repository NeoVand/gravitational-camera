/**
 * The worked near-field inversion of the paper (Section IV, "A worked case" and "What positivity buys"; Appendix,
 * "The worked inversion"): the locked safe, read by an array of pixels with noise, and reconstructed with its
 * uncertainty. A port of reference/gravcam/inversion.py, function for function; inversion.spec.ts pins each to it.
 *
 * The scene: the empty room and the two steel safes are known and subtracted, so what remains is the gold, a bar of
 * 324 kg (0.3 x 0.14 x 0.4 m) in one safe or the other, 3.5 m in front of the camera. The array: n x n pixels on a
 * square of side D centred on the camera, each reading the five independent components of the trace-free tidal
 * tensor E with white noise sigma per component. Noise is quoted as the paper's signal-to-noise ratio for a point
 * mass m at depth z (Eq. array-data): SNR = 2 G m / (z^2 sqrt(N0)), with N0 = sigma^2 a^2 for pixels a apart.
 *
 * Where this differs from the reference, and why:
 *  - the noise is drawn by lib/array/random.ts, not numpy, so one exposure's numbers differ from the reference's
 *    for the same seed; everything that does not depend on the draw agrees to rounding;
 *  - the reference's posterior needs at least as many readings as cells (5 n^2 >= 231, n >= 7); here an array
 *    with fewer is handled too, the patterns it cannot reach keeping their prior.
 */
import { G } from '../engine/physics/constants';
import type { Vec3 } from '../engine/types';
import { boxTide, pointTide, sphereTide, type Mat3 } from '../pixel/tide';
import {
	applyQt,
	erfc,
	log10Erfc,
	matrix,
	norm,
	qr,
	svd,
	svdOfQR,
	times,
	transposeTimes,
	type Matrix,
	type QR,
	type SVD
} from './linalg';
import { nnls } from './nnls';
import { normals } from './random';

export const CAMERA: Vec3 = [0, 1.5, 0];
export const GOLD_SIZE: Vec3 = [0.3, 0.14, 0.4];
export const GOLD_DENSITY = 19300;
/** 324 kg. */
export const GOLD_MASS = GOLD_DENSITY * (GOLD_SIZE[0] * GOLD_SIZE[1] * GOLD_SIZE[2]);
export const RIGHT: Vec3 = [1.1, 0.13, -3.5];
export const LEFT: Vec3 = [-1.1, 0.13, -3.5];
export const DEPTH = 3.5;

/** The five independent components of a trace-free tensor, in the order every reading keeps them. */
export const COMPONENTS = ['xx', 'yy', 'xy', 'xz', 'yz'] as const;

/** Pixel positions, n * n of them: a square of the given side facing -z, turned by `tiltDeg` about the vertical. */
export function arrayPixels(side = 1, n = 11, tiltDeg = 0, center: Vec3 = CAMERA): Vec3[] {
	const t = (tiltDeg * Math.PI) / 180;
	// the array's horizontal direction
	const across: Vec3 = [Math.cos(t), 0, Math.sin(t)];
	const out: Vec3[] = [];
	for (let i = 0; i < n; i++) {
		const x = (i - (n - 1) / 2) * (side / (n - 1));
		for (let j = 0; j < n; j++) {
			const y = (j - (n - 1) / 2) * (side / (n - 1));
			out.push([center[0] + x * across[0], center[1] + y, center[2] + x * across[2]]);
		}
	}
	return out;
}

/** The five independent components (xx, yy, xy, xz, yz) of each tensor, one after another. */
export function components(tensors: Mat3[]): Float64Array {
	const out = new Float64Array(5 * tensors.length);
	tensors.forEach((E, p) => out.set([E[0][0], E[1][1], E[0][1], E[0][2], E[1][2]], 5 * p));
	return out;
}

export const readPoint = (pixels: Vec3[], position: Vec3, mass: number): Float64Array =>
	components(pixels.map((at) => pointTide(mass, position, at)));

export const readBox = (
	pixels: Vec3[],
	position: Vec3,
	size: Vec3 = GOLD_SIZE,
	density = GOLD_DENSITY
): Float64Array =>
	components(
		pixels.map((at) => boxTide(density, position, [size[0] / 2, size[1] / 2, size[2] / 2], at))
	);

export const readSphere = (
	pixels: Vec3[],
	position: Vec3,
	radius: number,
	mass: number
): Float64Array =>
	components(
		pixels.map((at) => sphereTide(mass / ((4 / 3) * Math.PI * radius ** 3), position, radius, at))
	);

/** sigma per component (s^-2) that gives this SNR, by SNR = 2 G m / (z^2 sigma a). */
export const noiseForSnr = (snr: number, spacing: number, mass = GOLD_MASS, depth = DEPTH) =>
	(2 * G * mass) / (depth ** 2 * snr * spacing);

/** How many noise standard deviations apart two predicted readings are (the Mahalanobis distance). */
export function distance(y1: ArrayLike<number>, y2: ArrayLike<number>, sigma: number): number {
	const d = new Float64Array(y1.length);
	for (let i = 0; i < d.length; i++) d[i] = y1[i] - y2[i];
	return norm(d) / sigma;
}

/** Chance of choosing wrongly between two equally likely scenes whose readings are d apart: Phi(-d/2). */
export const decisionError = (d: number) => 0.5 * erfc(d / (2 * Math.SQRT2));

/** log10 of that chance, for distances at which the chance itself is too small for a number. */
export const decisionErrorLog10 = (d: number) => Math.log10(0.5) + log10Erfc(d / (2 * Math.SQRT2));

/** Cells of a grid of point masses in the plane of the safes. */
export function grid(
	step = 0.25,
	x: [number, number] = [-2.5, 2.5],
	y: [number, number] = [0, 2.5],
	z = -DEPTH
): Vec3[] {
	const out: Vec3[] = [];
	const nx = Math.floor((x[1] + 1e-9 - x[0]) / step) + 1;
	const ny = Math.floor((y[1] + 1e-9 - y[0]) / step) + 1;
	for (let i = 0; i < nx; i++)
		for (let j = 0; j < ny; j++) out.push([x[0] + i * step, y[0] + j * step, z]);
	return out;
}

/** Readings per kilogram in each cell: 5 * pixels rows, one column a cell. */
export function design(pixels: Vec3[], cells: Vec3[]): Matrix {
	const A = matrix(5 * pixels.length, cells.length);
	cells.forEach((cell, c) => {
		const column = readPoint(pixels, cell, 1);
		for (let r = 0; r < column.length; r++) A.data[r * cells.length + c] = column[r];
	});
	return A;
}

/** A design matrix with what the inversion needs of it, computed once for an array: A = U S V^T, and A = Q R. */
export interface Factor {
	A: Matrix;
	svd: SVD;
	/** Where there are at least as many readings as cells: the QR factorisation, for the positive fit. */
	qr?: QR;
	R?: Matrix;
}

export function factor(A: Matrix): Factor {
	if (A.rows < A.cols) return { A, svd: svd(A) };
	const f = qr(A, true);
	// R with its columns back in the order of the cells, so that |A x - y| = |R x - Q^T y| up to a constant
	const k = A.cols;
	const R = matrix(k, k);
	for (let i = 0; i < k; i++)
		for (let j = i; j < k; j++) R.data[i * k + f.perm![j]] = f.packed[i * k + j];
	return { A, svd: svdOfQR(f), qr: f, R };
}

export interface Posterior {
	/** The posterior mean of each cell's mass, kg. */
	mean: Float64Array;
	/** The posterior variance along each singular pattern V_k, kg^2. */
	shrink: Float64Array;
	/** The prior variance, kg^2, which every pattern the data do not reach keeps. */
	prior: number;
	/** The patterns, by rows. */
	vt: Matrix;
}

/**
 * Gaussian posterior of the cell masses for zero-mean independent priors of standard deviation `priorStd`.
 *
 * Through the singular values of A / sigma = U S V^T: each pattern V_k is measured with precision S_k^2 and kept
 * with weight S_k^2 / (S_k^2 + 1/s^2), the Wiener filter of the paper's Eq. wiener; patterns the data do not reach
 * keep their prior. Stable however small the noise, unlike inverting A^T A / sigma^2 + 1/s^2 directly.
 */
export function posterior(
	f: Factor,
	y: ArrayLike<number>,
	sigma: number,
	priorStd: number
): Posterior {
	const { s, ut, vt } = f.svd;
	const prior = priorStd ** 2;
	const shrink = new Float64Array(s.length);
	const weighted = times(ut, y);
	for (let k = 0; k < s.length; k++) {
		const S = s[k] / sigma;
		shrink[k] = 1 / (S * S + 1 / prior);
		// the gain S / (S^2 + 1/s^2) on U_k . y / sigma
		weighted[k] *= (S * shrink[k]) / sigma;
	}
	return { mean: transposeTimes(vt, weighted), shrink, prior, vt };
}

/** The posterior variance of a weighted sum of cells, w . cov . w, kg^2. */
export function variance(p: Posterior, w: ArrayLike<number>): number {
	const along = times(p.vt, w);
	let reached = 0;
	let total = 0;
	for (let k = 0; k < along.length; k++) {
		reached += along[k] * along[k];
		total += p.shrink[k] * along[k] * along[k];
	}
	if (p.vt.rows === p.vt.cols) return total;
	// fewer patterns than cells: the rest of w lies where the data do not reach, and keeps the prior
	let whole = 0;
	for (let i = 0; i < w.length; i++) whole += w[i] * w[i];
	return total + p.prior * Math.max(0, whole - reached);
}

/** The posterior standard deviation of each cell's mass, kg. */
export function cellStd(p: Posterior): Float64Array {
	const { rows, cols, data } = p.vt;
	const out = new Float64Array(cols);
	const reached = new Float64Array(cols);
	for (let k = 0; k < rows; k++)
		for (let i = 0; i < cols; i++) {
			const v2 = data[k * cols + i] ** 2;
			out[i] += p.shrink[k] * v2;
			reached[i] += v2;
		}
	for (let i = 0; i < cols; i++) {
		if (rows < cols) out[i] += p.prior * Math.max(0, 1 - reached[i]);
		out[i] = Math.sqrt(out[i]);
	}
	return out;
}

/** The whole posterior covariance, kg^2: V diag(shrink) V^T, with the prior on what V does not span. */
export function covariance(p: Posterior): Matrix {
	const { rows, cols, data } = p.vt;
	const cov = matrix(cols, cols);
	const full = rows === cols;
	for (let k = 0; k < rows; k++) {
		const weight = full ? p.shrink[k] : p.shrink[k] - p.prior;
		for (let i = 0; i < cols; i++) {
			const vi = weight * data[k * cols + i];
			if (vi === 0) continue;
			for (let j = 0; j < cols; j++) cov.data[i * cols + j] += vi * data[k * cols + j];
		}
	}
	if (!full) for (let i = 0; i < cols; i++) cov.data[i * cols + i] += p.prior;
	return cov;
}

/** The cells within a safe's footprint, as weights of one and zero. */
export function footprint(
	cells: Vec3[],
	center: Vec3,
	half: [number, number] = [0.45, 0.6]
): Float64Array {
	return Float64Array.from(cells, (c) =>
		Math.abs(c[0] - center[0]) <= half[0] && c[1] <= center[1] + half[1] ? 1 : 0
	);
}

const sumOver = (w: ArrayLike<number>, x: ArrayLike<number>) => {
	let s = 0;
	for (let i = 0; i < w.length; i++) s += w[i] * x[i];
	return s;
};

/** Total mass in the cells within a safe's footprint, and its standard deviation, kg. */
export function regionMass(
	p: Posterior,
	cells: Vec3[],
	center: Vec3,
	half: [number, number] = [0.45, 0.6]
): [number, number] {
	const w = footprint(cells, center, half);
	return [sumOver(w, p.mean), Math.sqrt(variance(p, w))];
}

/** `truth` with white noise of standard deviation sigma, from a seed. */
export function withNoise(truth: ArrayLike<number>, sigma: number, seed: number): Float64Array {
	const z = normals(seed, truth.length);
	return z.map((v, i) => truth[i] + sigma * v);
}

/** Every number the paper quotes for one noise level and one array. */
export function workedCase(snr: number, side = 1, n = 11, tiltDeg = 0, seed = 0) {
	const pixels = arrayPixels(side, n, tiltDeg);
	const spacing = side / (n - 1);
	const sigma = noiseForSnr(snr, spacing);
	const right = readBox(pixels, RIGHT);
	const left = readBox(pixels, LEFT);
	const none = new Float64Array(right.length);
	const point = readPoint(pixels, RIGHT, GOLD_MASS);
	const sphere = readSphere(pixels, RIGHT, 0.2, GOLD_MASS);
	const deeper = readBox(pixels, [RIGHT[0], RIGHT[1], RIGHT[2] - 0.2]);
	const aside = readBox(pixels, [RIGHT[0] + 0.2, RIGHT[1], RIGHT[2]]);
	const cells = grid();
	const f = factor(design(pixels, cells));
	const p = posterior(f, withNoise(right, sigma, seed), sigma, GOLD_MASS);
	return {
		sigma,
		leftRight: distance(right, left, sigma),
		goldNone: distance(right, none, sigma),
		errorLeftRight: decisionError(distance(right, left, sigma)),
		barPoint: distance(right, point, sigma),
		pointSphere: distance(point, sphere, sigma),
		deeper: distance(right, deeper, sigma),
		aside: distance(right, aside, sigma),
		right: regionMass(p, cells, RIGHT),
		left: regionMass(p, cells, LEFT)
	};
}

/** The least-squares problem |A x - y| in the smallest form that keeps its misfit: M, c and what no x can reach. */
export interface Reduced {
	M: Matrix;
	c: Float64Array;
	/** The squared length of the part of y that no arrangement of masses on the grid can produce. */
	beyond: number;
}

/**
 * With at least as many readings as cells, |A x - y|^2 = |R x - (Q^T y) head|^2 + |(Q^T y) tail|^2, so a fit can be
 * made to R, a square matrix. With fewer the problem is left as it is.
 */
export function reduce(f: Factor, y: ArrayLike<number>): Reduced {
	if (!f.qr || !f.R) return { M: f.A, c: Float64Array.from(y), beyond: 0 };
	const k = f.A.cols;
	const turned = applyQt(f.qr, y);
	let beyond = 0;
	for (let i = k; i < turned.length; i++) beyond += turned[i] * turned[i];
	return { M: f.R, c: turned.slice(0, k), beyond };
}

/**
 * The cell masses, none negative, that fit the readings best (non-negative least squares, no prior), as the
 * reference's positive_case computes them with scipy.optimize.nnls.
 */
export function positiveFit(f: Factor, y: ArrayLike<number>, sigma: number): Float64Array {
	const { M, c } = reduce(f, y);
	return nnls(
		{ ...M, data: M.data.map((v) => v / sigma) },
		c.map((v) => v / sigma)
	).x;
}

const meanAndSpread = (values: number[]): [number, number] => {
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	return [mean, Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length)];
};

/**
 * The same data, reconstructed with every cell's mass constrained to be non-negative: mean and spread over draws of
 * the noise of the mass found in each safe.
 */
export function positiveCase(snr: number, trials = 40, side = 1, n = 11, seed = 1) {
	const pixels = arrayPixels(side, n);
	const sigma = noiseForSnr(snr, side / (n - 1));
	const cells = grid();
	const f = factor(design(pixels, cells));
	const truth = readBox(pixels, RIGHT);
	const inRight = footprint(cells, RIGHT);
	const inLeft = footprint(cells, LEFT);
	const z = normals(seed, trials * truth.length);
	const right: number[] = [];
	const left: number[] = [];
	for (let t = 0; t < trials; t++) {
		const y = truth.map((v, i) => v + sigma * z[t * truth.length + i]);
		const m = positiveFit(f, y, sigma);
		right.push(sumOver(inRight, m));
		left.push(sumOver(inLeft, m));
	}
	return { right: meanAndSpread(right), left: meanAndSpread(left) };
}
