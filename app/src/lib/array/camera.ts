/**
 * The camera at work on the locked safe, in two halves that share nothing but the readings.
 *
 * The scene's half (`trueReadings`, `expose`) knows what is in the safe and makes the readings an array would
 * record: the tensor of the true contents at every pixel, plus noise. The camera's half (`decide`, `gaussianImage`,
 * `positiveImage`, `analyse`) is given the readings, the noise level and its own geometry, and nothing else: no
 * function there takes the contents. Both halves are lib/array/inversion.ts, the port of the reference, put to use.
 *
 * What the camera is told in advance, as in the paper: the empty room and the two safes (subtracted before
 * anything here), that mass lies in the plane of the safes, and, for the decision alone, that the question is
 * whether a 324 kg bar is in the left safe or the right.
 */
import type { Vec3 } from '../engine/types';
import {
	DEPTH,
	GOLD_DENSITY,
	GOLD_MASS,
	GOLD_SIZE,
	LEFT,
	RIGHT,
	arrayPixels,
	cellStd,
	decisionError,
	decisionErrorLog10,
	design,
	distance,
	factor,
	footprint,
	grid,
	noiseForSnr,
	posterior,
	readBox,
	readPoint,
	readSphere,
	reduce,
	variance,
	type Factor
} from './inversion';
import { times } from './linalg';
import { nnls } from './nnls';
import { normals } from './random';

// --- the scene's half: what is really in the safe ---------------------------------------------------------------------

export const CONTENTS = ['bar-right', 'bar-left', 'sphere', 'point', 'nothing'] as const;
export type Contents = (typeof CONTENTS)[number];

/** A sphere of gold with the bar's mass: 15.9 cm in radius. */
export const SPHERE_RADIUS = Math.cbrt((3 * GOLD_MASS) / (4 * Math.PI * GOLD_DENSITY));
/** It rests on the floor of the right-hand safe's cavity, 5 cm above the ground; the point mass sits at its centre. */
export const SPHERE_CENTRE: Vec3 = [RIGHT[0], 0.05 + SPHERE_RADIUS, RIGHT[2]];

/** The tidal readings of the true contents at every pixel, without noise: five components a pixel, s^-2. */
export function trueReadings(pixels: Vec3[], contents: Contents): Float64Array {
	switch (contents) {
		case 'bar-right':
			return readBox(pixels, RIGHT);
		case 'bar-left':
			return readBox(pixels, LEFT);
		case 'sphere':
			return readSphere(pixels, SPHERE_CENTRE, SPHERE_RADIUS, GOLD_MASS);
		case 'point':
			return readPoint(pixels, SPHERE_CENTRE, GOLD_MASS);
		case 'nothing':
			return new Float64Array(5 * pixels.length);
	}
}

/**
 * One exposure: the true readings with white noise of standard deviation sigma on every component. The noise
 * depends on the seed alone, so the same seed with other contents, or another noise level, is the same draw.
 */
export function expose(
	pixels: Vec3[],
	contents: Contents,
	sigma: number,
	seed: number
): Float64Array {
	const truth = trueReadings(pixels, contents);
	const z = normals(seed, truth.length);
	return truth.map((v, i) => v + sigma * z[i]);
}

// --- the camera's half: what it can work out from the readings ------------------------------------------------------

export interface ArrayModel {
	side: number;
	n: number;
	/** Distance between neighbouring pixels, m. */
	spacing: number;
	pixels: Vec3[];
	/** The grid of point masses the image is made on, in the plane of the safes: 21 across by 11 up, 25 cm apart. */
	cells: Vec3[];
	across: number;
	up: number;
	factor: Factor;
	/** What the array would read, without noise, of a 324 kg bar in the right safe, and in the left. */
	right: Float64Array;
	left: Float64Array;
	/** The cells counted as each safe's footprint, as weights of one and zero. */
	inRight: Float64Array;
	inLeft: Float64Array;
}

/** Everything about an array that does not depend on the readings; the factorisation takes a few tenths of a second. */
export function buildArray(side: number, n: number): ArrayModel {
	const pixels = arrayPixels(side, n);
	const cells = grid();
	const up = cells.findIndex((c) => c[0] !== cells[0][0]);
	return {
		side,
		n,
		spacing: side / (n - 1),
		pixels,
		cells,
		across: cells.length / up,
		up,
		factor: factor(design(pixels, cells)),
		right: readBox(pixels, RIGHT),
		left: readBox(pixels, LEFT),
		inRight: footprint(cells, RIGHT),
		inLeft: footprint(cells, LEFT)
	};
}

/** A misfit against the number of readings: chi-squared, how many it is spread over, and whether it is too large. */
export interface Misfit {
	chi2: number;
	count: number;
	/** More than four standard deviations of chi-squared above its expected value: the model does not fit. */
	poor: boolean;
}

const misfit = (chi2: number, count: number): Misfit => ({
	chi2,
	count,
	poor: chi2 - count > 4 * Math.sqrt(2 * count)
});

export interface Decision {
	choice: 'right' | 'left';
	/** How far apart the two possibilities' readings are, in standard deviations of the noise. */
	distance: number;
	/** The chance that a decision at this noise is wrong: Phi(-distance / 2). */
	error: number;
	/** log10 of that chance, which stays finite where the chance underflows. */
	errorLog10: number;
	/** The natural logarithm of the likelihood ratio in favour of the choice, for this exposure. */
	logRatio: number;
	/** How well the chosen possibility fits the readings. */
	fit: Misfit;
}

/** Which safe holds the bar, by likelihood ratio between the two possibilities, each as likely as the other beforehand. */
export function decide(model: ArrayModel, y: ArrayLike<number>, sigma: number): Decision {
	const toRight = distance(y, model.right, sigma) ** 2;
	const toLeft = distance(y, model.left, sigma) ** 2;
	const choice = toRight <= toLeft ? 'right' : 'left';
	const d = distance(model.right, model.left, sigma);
	return {
		choice,
		distance: d,
		error: decisionError(d),
		errorLog10: decisionErrorLog10(d),
		logRatio: Math.abs(toLeft - toRight) / 2,
		fit: misfit(Math.min(toRight, toLeft), y.length)
	};
}

export interface Image {
	/** Each cell's mass, kg: the posterior mean, or the positive fit. */
	mass: Float64Array;
	/** Each cell's uncertainty, kg: the posterior standard deviation, or the spread over redrawn noise. */
	spread: Float64Array;
	/** The mass in each safe's footprint and its uncertainty, kg. */
	right: [number, number];
	left: [number, number];
	/** How well masses on the grid can account for the readings at all. */
	fit: Misfit;
}

const sumOver = (w: ArrayLike<number>, x: ArrayLike<number>) => {
	let s = 0;
	for (let i = 0; i < w.length; i++) s += w[i] * x[i];
	return s;
};

/**
 * The Gaussian image: the posterior mean and standard deviation of the mass in each cell, each cell given a prior of
 * zero mean and standard deviation equal to the gold's mass, as in the paper. The fit is the readings against that
 * prior's own prediction, y ~ N(0, sigma^2 + s^2 A A^T), which is chi-squared over all the readings if the scene is
 * what the prior says.
 */
export function gaussianImage(model: ArrayModel, y: ArrayLike<number>, sigma: number): Image {
	const f = model.factor;
	const p = posterior(f, y, sigma, GOLD_MASS);
	const along = times(f.svd.ut, y);
	let chi2 = 0;
	let reached = 0;
	for (let k = 0; k < along.length; k++) {
		chi2 += along[k] ** 2 / (sigma ** 2 + (GOLD_MASS * f.svd.s[k]) ** 2);
		reached += along[k] ** 2;
	}
	let whole = 0;
	for (let i = 0; i < y.length; i++) whole += y[i] * y[i];
	// the part of the readings that no masses on the grid can produce is noise alone, if the model is right
	const beyond = f.qr ? reduce(f, y).beyond : Math.max(0, whole - reached);
	return {
		mass: p.mean,
		spread: cellStd(p),
		right: [sumOver(model.inRight, p.mean), Math.sqrt(variance(p, model.inRight))],
		left: [sumOver(model.inLeft, p.mean), Math.sqrt(variance(p, model.inLeft))],
		fit: misfit(chi2 + beyond / sigma ** 2, y.length)
	};
}

/** How many times the noise is drawn again to find the spread of the positive image. */
export const REDRAWS = 40;

/**
 * The positive image: the masses, none negative, that fit the readings best, with no prior (the reference's
 * positive_case). Its uncertainty is found as the reference finds it, as the spread over fresh draws of the noise,
 * with one difference that keeps the camera honest: the reference redraws about the true scene, which the camera
 * does not have, so here the noise is redrawn about the camera's own fit (a parametric bootstrap). Near the
 * boundary m = 0 such a spread can run small; it says nothing of the grid's own error, which `fit` reports.
 */
export function positiveImage(
	model: ArrayModel,
	y: ArrayLike<number>,
	sigma: number,
	redraws = REDRAWS,
	seed = 1
): Image {
	const { M, c, beyond } = reduce(model.factor, y);
	const scaled = { ...M, data: M.data.map((v) => v / sigma) };
	const best = nnls(
		scaled,
		c.map((v) => v / sigma)
	);
	const k = M.cols;
	// noise turned by Q is noise still, so the redrawn readings can be made in the reduced form directly
	const fitted = times(scaled, best.x);
	const z = normals(seed, redraws * fitted.length);
	const sum = new Float64Array(k);
	const squares = new Float64Array(k);
	const right: number[] = [];
	const left: number[] = [];
	for (let t = 0; t < redraws; t++) {
		const again = nnls(
			scaled,
			fitted.map((v, i) => v + z[t * fitted.length + i])
		).x;
		for (let i = 0; i < k; i++) {
			sum[i] += again[i];
			squares[i] += again[i] * again[i];
		}
		right.push(sumOver(model.inRight, again));
		left.push(sumOver(model.inLeft, again));
	}
	const spreadOf = (values: number[]) => {
		if (!values.length) return 0;
		const mean = values.reduce((a, b) => a + b, 0) / values.length;
		return Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
	};
	const spread = new Float64Array(k);
	if (redraws > 0)
		for (let i = 0; i < k; i++)
			spread[i] = Math.sqrt(Math.max(0, squares[i] / redraws - (sum[i] / redraws) ** 2));
	return {
		mass: best.x,
		spread,
		right: [sumOver(model.inRight, best.x), spreadOf(right)],
		left: [sumOver(model.inLeft, best.x), spreadOf(left)],
		fit: misfit(best.residual ** 2 + beyond / sigma ** 2, y.length)
	};
}

/**
 * A bar fitted as point masses 25 cm apart comes out a little heavy even without noise: 327.7 kg for 324.2 kg, one
 * part in a hundred (camera.spec.ts), "the cost of modelling a bar as a grid of points" in the paper's words.
 */
export const GRID_EXCESS = 0.011;

/** What the array cannot tell apart, in standard deviations of the noise: properties of the array, not of the scene. */
export interface Ambiguities {
	/** A sphere of gold against a point of the same mass at its centre. */
	spherePoint: number;
	/** The largest difference between those two sets of readings, as a fraction of the largest reading. */
	spherePointRelative: number;
	/** The bar against a point of the same mass at its centre. */
	barPoint: number;
	/** The bar in the right safe against no gold at all. */
	goldNone: number;
}

export function ambiguities(pixels: Vec3[], sigma: number): Ambiguities {
	const sphere = readSphere(pixels, SPHERE_CENTRE, SPHERE_RADIUS, GOLD_MASS);
	const point = readPoint(pixels, SPHERE_CENTRE, GOLD_MASS);
	let apart = 0;
	let top = 0;
	for (let i = 0; i < point.length; i++) {
		apart = Math.max(apart, Math.abs(sphere[i] - point[i]));
		top = Math.max(top, Math.abs(point[i]));
	}
	const bar = readBox(pixels, RIGHT);
	return {
		spherePoint: distance(sphere, point, sigma),
		spherePointRelative: apart / top,
		barPoint: distance(bar, readPoint(pixels, RIGHT, GOLD_MASS), sigma),
		goldNone: distance(bar, new Float64Array(bar.length), sigma)
	};
}

/** The tide the paper's best laboratory gradiometer resolves in one second: 0.02 E (Section II, "What the premise asks"). */
export const LAB_NOISE = 2e-11;

/** The largest tide of the gold at the camera, 2 G m / z^3: 1.0e-9 s^-2, one eotvos. */
export const GOLD_TIDE = noiseForSnr(1, DEPTH);

/**
 * The SNR, in the paper's sense, of an array whose every pixel is such a gradiometer read for a second: the SNR at
 * which sigma is 0.02 E. One pixel alone reads the gold's largest tide at 50 to 1; the array's SNR counts the
 * (z / a)^2 pixels that would fill a patch as wide as the scene is deep, so it is z / a times that.
 */
export const labSnr = (spacing: number) => noiseForSnr(LAB_NOISE, spacing);

export interface Analysis {
	decision: Decision;
	image: Image;
	/** Whether the image is the positive one. */
	positive: boolean;
	ambiguities: Ambiguities;
}

/** Everything the view shows of the camera's work, from the readings, the noise level and the array alone. */
export function analyse(
	model: ArrayModel,
	y: ArrayLike<number>,
	sigma: number,
	positive: boolean,
	seed = 1
): Analysis {
	return {
		decision: decide(model, y, sigma),
		image: positive
			? positiveImage(model, y, sigma, REDRAWS, seed)
			: gaussianImage(model, y, sigma),
		positive,
		ambiguities: ambiguities(model.pixels, sigma)
	};
}

// --- one exposure, from the scene to the camera -------------------------------------------------------------------------

/** What the view asks for: the array, its noise, which exposure, what image, and (for the scene alone) the contents. */
export interface Request {
	snr: number;
	side: number;
	n: number;
	seed: number;
	positive: boolean;
	contents: Contents;
}

export interface Exposure {
	request: Request;
	/** Noise per component, s^-2, and the distance between pixels, m. */
	sigma: number;
	spacing: number;
	/** The readings: (xx, yy, xy, xz, yz) of each pixel in turn, s^-2; pixel i * n + j is column i, row j from the bottom. */
	readings: Float64Array;
	analysis: Analysis;
	/** The image's grid: cells across and up, 25 cm apart, the first at x = -2.5 m on the floor; cell i * up + j. */
	across: number;
	up: number;
	/** The SNR at which every pixel would be the paper's best laboratory gradiometer, read for a second. */
	labSnr: number;
	/** How long the work took, ms. */
	took: number;
}

/** Where `work` keeps the arrays it has factored. */
export const arrayCache = () => new Map<string, ArrayModel>();

/**
 * One exposure and its processing. This is the only place where the two halves meet: the scene makes the readings
 * from the true contents, and the camera is handed the readings. `arrays` keeps each array's factorisation.
 */
export function work(request: Request, arrays: Map<string, ArrayModel>): Exposure {
	const started = typeof performance === 'undefined' ? 0 : performance.now();
	const key = `${request.side}/${request.n}`;
	let model = arrays.get(key);
	if (!model) {
		model = buildArray(request.side, request.n);
		// a dozen arrays are kept; the oldest goes first
		if (arrays.size >= 12) arrays.delete(arrays.keys().next().value!);
		arrays.set(key, model);
	}
	const sigma = noiseForSnr(request.snr, model.spacing);
	const readings = expose(model.pixels, request.contents, sigma, request.seed);
	// the redraws for the positive image's spread come from a stream of their own
	const analysis = analyse(model, readings, sigma, request.positive, request.seed + 0x9e3779b9);
	return {
		request,
		sigma,
		spacing: model.spacing,
		readings,
		analysis,
		across: model.across,
		up: model.up,
		labSnr: labSnr(model.spacing),
		took: typeof performance === 'undefined' ? 0 : performance.now() - started
	};
}

export { GOLD_MASS, GOLD_SIZE, LEFT, RIGHT, noiseForSnr };
