/**
 * The worked inversion of the locked safe (inversion.ts) against the Python reference, reference/gravcam/inversion.py.
 * Every expected number was computed in reference/ with ../.venv/bin/python after
 *   from gravcam.inversion import *
 * and the call that gave it is named above it. Where the reference draws noise (numpy's generator, which is not
 * reproduced here) the comparison is made on readings without noise, or in expectation.
 */
import { describe, expect, it } from 'vitest';
import { G } from '../engine/physics/constants';
import {
	CAMERA,
	DEPTH,
	GOLD_MASS,
	LEFT,
	RIGHT,
	arrayPixels,
	cellStd,
	covariance,
	decisionError,
	design,
	distance,
	factor,
	footprint,
	grid,
	noiseForSnr,
	positiveCase,
	positiveFit,
	posterior,
	readBox,
	readPoint,
	readSphere,
	regionMass,
	variance,
	withNoise,
	workedCase
} from './inversion';
import { cholesky, choleskySolve, matrix, norm, transposeTimes } from './linalg';

const close = (actual: ArrayLike<number>, expected: number[], rel = 1e-12) => {
	const top = Math.max(...expected.map(Math.abs));
	expect(actual.length).toBe(expected.length);
	expected.forEach((v, i) => expect(Math.abs(actual[i] - v)).toBeLessThanOrEqual(rel * top));
};

const px = arrayPixels();
const cells = grid();
const A = design(px, cells);
const f = factor(A);
const total = (w: ArrayLike<number>, x: ArrayLike<number>) => {
	let s = 0;
	for (let i = 0; i < w.length; i++) s += w[i] * x[i];
	return s;
};

describe('the array, its noise and its readings', () => {
	it('the gold is 324.24 kg, and the array is 11 x 11 pixels 10 cm apart about the camera', () => {
		// GOLD_MASS; array_pixels()[[0, 7, 60, 120]]
		expect(GOLD_MASS).toBe(324.24000000000007);
		expect(px.length).toBe(121);
		close(px[0], [-0.5, 1.0, 0.0]);
		close(px[7], [-0.5, 1.7, 0.0]);
		close(px[60], [0.0, 1.5, 0.0]);
		close(px[120], [0.5, 2.0, 0.0]);
	});

	it('noise_for_snr: sigma = 2 G m / (z^2 SNR a)', () => {
		// noise_for_snr(1e3, 0.1), noise_for_snr(10, 0.2), noise_for_snr(50, 0.05), noise_for_snr(1, 1.0)
		expect(noiseForSnr(1e3, 0.1)).toBeCloseTo(3.533183725714286e-11, 24);
		expect(noiseForSnr(10, 0.2) / 1.766591862857143e-9).toBeCloseTo(1, 13);
		expect(noiseForSnr(50, 0.05) / 1.4132734902857144e-9).toBeCloseTo(1, 13);
		expect(noiseForSnr(1, 1.0) / 3.533183725714286e-9).toBeCloseTo(1, 13);
		// the paper's definition (reference/tests/test_inversion.py): SNR = 2 G m / (z^2 sqrt(N0)), N0 = sigma^2 a^2,
		// and -E_zz of a point straight ahead is 2 G m / z^3
		const a = 0.1;
		expect((noiseForSnr(1e3, a) * a * 1e3) / ((2 * G * GOLD_MASS) / DEPTH ** 2)).toBeCloseTo(1, 12);
		const ahead = readPoint([CAMERA], [CAMERA[0], CAMERA[1], CAMERA[2] - DEPTH], GOLD_MASS);
		expect((ahead[0] + ahead[1]) / ((2 * G * GOLD_MASS) / DEPTH ** 3)).toBeCloseTo(1, 12);
	});

	it('the readings of the bar at four pixels: (xx, yy, xy, xz, yz) in s^-2', () => {
		// read_box(array_pixels(), RIGHT).reshape(-1, 5)[[0, 60, 120, 7]], and read_box(px, LEFT).reshape(-1, 5)[60]
		const right = readBox(px, RIGHT);
		const at = (y: Float64Array, p: number) => y.subarray(5 * p, 5 * p + 5);
		close(
			at(right, 0),
			[
				1.7840658157516568e-10, 3.0163822748173117e-10, 9.515775830112565e-11,
				3.8138514167990123e-10, -2.0777166877120724e-10
			]
		);
		close(
			at(right, 60),
			[
				2.75336151182307e-10, 2.280278224962983e-10, 1.0689036794297826e-10, 2.7204027469982837e-10,
				-3.394666436874239e-10
			]
		);
		close(
			at(right, 120),
			[
				3.1274385657772155e-10, 1.1604358905536048e-10, 7.032833404532372e-11,
				1.311544691722328e-10, -4.095143131856575e-10
			]
		);
		close(
			at(right, 7),
			[
				1.6739283268385537e-10, 1.7225288697444246e-10, 1.321478570268776e-10,
				2.936026900774759e-10, -2.8858958577613007e-10
			]
		);
		// the left safe is the mirror image: xy and xz change sign at the central pixel
		close(
			at(readBox(px, LEFT), 60),
			[
				2.75336151182307e-10, 2.280278224962983e-10, -1.0689036794297826e-10,
				-2.7204027469982837e-10, -3.394666436874239e-10
			]
		);
	});

	it('a point of the same mass reads nearly the same: read_point at two pixels', () => {
		// read_point(px, RIGHT, GOLD_MASS).reshape(-1, 5)[[60, 0]]
		const point = readPoint(px, RIGHT, GOLD_MASS);
		close(
			point.subarray(300, 305),
			[
				2.750237872679441e-10, 2.2802243838933616e-10, 1.0620937585854286e-10,
				2.7133782153642334e-10, -3.379389231862727e-10
			]
		);
		close(
			point.subarray(0, 5),
			[
				1.7851442271177082e-10, 3.009501156677842e-10, 9.452081670166413e-11,
				3.8025615914462586e-10, -2.0676428653489032e-10
			]
		);
	});

	it('a sphere and a point of the same mass cannot be told apart: distance 0 to rounding', () => {
		// read_point(px, RIGHT, GOLD_MASS) against read_sphere(px, RIGHT, 0.2, GOLD_MASS): identical in the reference
		const point = readPoint(px, RIGHT, GOLD_MASS);
		const sphere = readSphere(px, RIGHT, 0.2, GOLD_MASS);
		const top = Math.max(...point.map(Math.abs));
		expect(top).toBeCloseTo(4.0899974557620097e-10, 22);
		point.forEach((v, i) => expect(Math.abs(v - sphere[i])).toBeLessThan(1e-13 * top));
		// at SNR 1e6, where the bar and a point are 580 standard deviations apart, these are less than 1e-7 of one
		expect(distance(point, sphere, noiseForSnr(1e6, 0.1))).toBeLessThan(1e-7);
		expect(workedCase(1e3).pointSphere).toBeLessThan(1e-10);
	});
});

describe('decisions', () => {
	it('decision_error is Phi(-d / 2)', () => {
		// decision_error(0), decision_error(6.18), decision_error(1.8111554511736525)
		expect(decisionError(0)).toBe(0.5);
		expect(decisionError(6.18)).toBeGreaterThan(0.9e-3);
		expect(decisionError(6.18)).toBeLessThan(1.1e-3);
		expect(decisionError(1.8111554511736525)).toBeCloseTo(0.18257970146405988, 14);
	});

	it('left against right: 1.81 standard deviations and 18% wrong at SNR 10; 6.16 and 0.10% at SNR 34', () => {
		// worked_case(10)["left_right"], ["error_left_right"]; the same for worked_case(34)
		const low = workedCase(10);
		expect(low.leftRight).toBeCloseTo(1.8111554511736525, 11);
		expect(low.errorLeftRight).toBeCloseTo(0.18257970146405988, 11);
		const better = workedCase(34);
		expect(better.leftRight).toBeCloseTo(6.15792853399042, 11);
		expect(better.errorLeftRight / 0.001038607973512946).toBeCloseTo(1, 9);
		// readings scale with 1 / sigma, so the distance grows in proportion to the SNR
		expect(workedCase(100).leftRight / low.leftRight).toBeCloseTo(10, 9);
	});

	it('the other distances of worked_case(1e3): gold or none, bar or point, deeper, aside', () => {
		// worked_case(1e3): sigma, gold_none, bar_point, deeper, aside
		const mid = workedCase(1e3);
		expect(mid.sigma).toBeCloseTo(3.533183725714286e-11, 24);
		expect(mid.leftRight).toBeCloseTo(181.11554511736526, 9);
		expect(mid.goldNone).toBeCloseTo(177.37592318474103, 9);
		// the bar's shape differs from a point's by 0.58 standard deviations
		expect(mid.barPoint).toBeCloseTo(0.5798149285891406, 9);
		expect(mid.deeper).toBeCloseTo(24.416690232273798, 9);
		expect(mid.aside).toBeCloseTo(17.391464208398258, 9);
	});

	it('turning the array through 70 degrees tells the safes apart 9% better', () => {
		// worked_case(1e3, tilt_deg=70)["left_right"]
		const turned = workedCase(1e3, 1, 11, 70);
		expect(turned.leftRight).toBeCloseTo(196.9035387699643, 9);
		expect(turned.leftRight / workedCase(1e3).leftRight).toBeCloseTo(1.087, 3);
	});
});

describe('the image: the Gaussian posterior on a grid of cells', () => {
	it('the grid is 21 x 11 cells 25 cm apart in the plane of the safes, and each safe has twelve', () => {
		// grid()[[0, 100, 230]]; np.nonzero(footprint(cells, RIGHT))[0], and for LEFT
		expect(cells.length).toBe(231);
		close(cells[0], [-2.5, 0.0, -3.5]);
		close(cells[100], [-0.25, 0.25, -3.5]);
		close(cells[230], [2.5, 2.5, -3.5]);
		const index = (w: Float64Array) => Array.from(w.keys()).filter((i) => w[i]);
		expect(index(footprint(cells, RIGHT))).toEqual([
			143, 144, 145, 154, 155, 156, 165, 166, 167, 176, 177, 178
		]);
		expect(index(footprint(cells, LEFT))).toEqual([44, 45, 46, 55, 56, 57, 66, 67, 68, 77, 78, 79]);
	});

	it('the design matrix is 605 x 231, readings per kilogram', () => {
		// A = design(px, grid()); A[0, 0], A[302, 100], A[604, 230], np.linalg.norm(A)
		expect([A.rows, A.cols]).toEqual([605, 231]);
		expect(A.data[0] / 2.8352560023956874e-13).toBeCloseTo(1, 12);
		expect(A.data[302 * 231 + 100] / -8.725584337599148e-14).toBeCloseTo(1, 12);
		expect(A.data[604 * 231 + 230] / 3.168510615814612e-13).toBeCloseTo(1, 12);
		expect(norm(A.data) / 3.0345970743379887e-10).toBeCloseTo(1, 12);
	});

	it('its singular values span 17 decades: np.linalg.svd(A, compute_uv=False)', () => {
		// S[:4], S[50], S[100]
		close(
			f.svd.s.subarray(0, 4),
			[2.2671544288200866e-10, 1.6139167350417573e-10, 1.0434636367222124e-10, 4.83780337784751e-11]
		);
		expect(f.svd.s[50] / 6.441269449043355e-18).toBeCloseTo(1, 6);
		// far below rounding against the largest: LAPACK and the Jacobi iteration agree on its size, not its digits
		expect(f.svd.s[100]).toBeGreaterThan(1e-22);
		expect(f.svd.s[100]).toBeLessThan(3e-22);
	});

	// mean, cov = posterior(A, read_box(px, RIGHT), noise_for_snr(snr, 0.1), GOLD_MASS), the readings without noise;
	// region_mass(mean, cov, cells, RIGHT), region_mass(mean, cov, cells, LEFT); np.sqrt(np.diag(cov))[[0, 100, 172]]
	const reference = [
		{
			snr: 10,
			right: [102.13349264330674, 947.0477092987627],
			left: [6.868768734578673, 947.0477092987618],
			std: [319.349647901333, 319.77240681097584, 321.2236351301207]
		},
		{
			snr: 34,
			right: [142.4952846318006, 879.9815739371658],
			left: [-1.8145896581074124, 879.9815739371653],
			std: [314.38077556089763, 318.1648243005621, 319.9752717439373]
		},
		{
			snr: 1e3,
			right: [228.23110559352418, 728.6228582760165],
			left: [-23.362317146700327, 728.6228582760151],
			std: [290.35285313971417, 314.20913178269234, 315.04650873657437]
		},
		{
			snr: 1e6,
			right: [377.8087889302828, 489.48750023819247],
			left: [18.740194682431458, 489.487500233118],
			std: [202.56266532182764, 297.64274341024384, 303.24524159364785]
		}
	];

	it.each(reference)(
		'at SNR $snr the mass in each footprint and its error are the reference’s',
		({ snr, right, left, std }) => {
			const sigma = noiseForSnr(snr, 0.1);
			const p = posterior(f, readBox(px, RIGHT), sigma, GOLD_MASS);
			const r = regionMass(p, cells, RIGHT);
			const l = regionMass(p, cells, LEFT);
			// the error belongs to the array and the noise, not to the data: +-730 kg at SNR 1e3, +-490 kg at 1e6
			expect(r[1] / right[1]).toBeCloseTo(1, 8);
			expect(l[1] / left[1]).toBeCloseTo(1, 8);
			// the means to a milligram where the problem is well conditioned, and to a part in 1e8 of the error at 1e6
			expect(Math.abs(r[0] - right[0])).toBeLessThan(1e-8 * right[1]);
			expect(Math.abs(l[0] - left[0])).toBeLessThan(1e-8 * left[1]);
			const each = cellStd(p);
			[0, 100, 172].forEach((c, k) => expect(each[c] / std[k]).toBeCloseTo(1, 8));
		}
	);

	it('at SNR 1e3 a safe’s contents are known only to +-730 kg: the image cannot say where the gold is', () => {
		const mid = workedCase(1e3);
		expect(mid.right[1]).toBeGreaterThan(700);
		expect(mid.right[1]).toBeLessThan(760);
		expect(mid.right[1]).toBeCloseTo(728.6228582760165, 6);
		expect(mid.left[1]).toBeCloseTo(728.6228582760151, 6);
		// one exposure's mean is a draw from that: within four errors of the truth in both safes
		expect(Math.abs(mid.right[0] - GOLD_MASS)).toBeLessThan(4 * mid.right[1]);
		expect(Math.abs(mid.left[0])).toBeLessThan(4 * mid.left[1]);
		// over many exposures the mean in the right safe is the noise-free one, 228 kg, and its scatter is less than
		// the error, the rest of which is the prior on what the data do not reach
		const sigma = noiseForSnr(1e3, 0.1);
		const masses = Array.from({ length: 200 }, (_, seed) => workedCaseMean(sigma, seed));
		const mean = masses.reduce((a, b) => a + b, 0) / masses.length;
		const scatter = Math.sqrt(masses.reduce((a, b) => a + (b - mean) ** 2, 0) / masses.length);
		expect(Math.abs(mean - 228.23110559352418)).toBeLessThan((4 * scatter) / Math.sqrt(200));
		expect(scatter).toBeLessThan(728.6);
		expect(scatter).toBeGreaterThan(100);
	});

	/** The right footprint's posterior mean for one seeded exposure of the bar. */
	function workedCaseMean(sigma: number, seed: number): number {
		const truth = readBox(px, RIGHT);
		const p = posterior(f, withNoise(truth, sigma, seed), sigma, GOLD_MASS);
		return total(footprint(cells, RIGHT), p.mean);
	}

	it('other arrays: a six-metre one at SNR 1e6, 4 m of 21 x 21, 2 m of 8 x 8, 25 cm of 7 x 7', () => {
		// worked_case(1e6, side=6.0)["right"][1]; worked_case(1e3, 4, 21), (1e3, 2, 8), (1e3, 0.25, 7): right[1], left_right
		expect(workedCase(1e6, 6).right[1]).toBeCloseTo(351.7161365703875, 5);
		const wide = workedCase(1e3, 4, 21);
		expect(wide.right[1]).toBeCloseTo(533.6809436186954, 6);
		expect(wide.leftRight).toBeCloseTo(611.9127076335104, 8);
		expect(wide.barPoint).toBeCloseTo(2.0922729871308436, 8);
		const eight = workedCase(1e3, 2, 8);
		expect(eight.right[1]).toBeCloseTo(629.7776964946739, 6);
		expect(eight.leftRight).toBeCloseTo(367.4202896639844, 8);
		const small = workedCase(1e3, 0.25, 7);
		expect(small.right[1]).toBeCloseTo(841.613632774077, 6);
		expect(small.leftRight).toBeCloseTo(48.243229792648, 9);
		expect(small.errorLeftRight / 7.415454073575468e-129).toBeCloseTo(1, 6);
	});

	it('one cell read by one pixel has the closed form 1 / (|a|^2 / sigma^2 + 1 / s^2)', () => {
		// as reference/tests/test_inversion.py: array_pixels(n=2)[:1], grid()[[100]]
		const one = design(arrayPixels(1, 2).slice(0, 1), [cells[100]]);
		const sigma = 1e-10;
		const s = 300;
		const column = Array.from(one.data);
		const p = posterior(
			factor(one),
			column.map((v) => 50 * v),
			sigma,
			s
		);
		const aa = column.reduce((t, v) => t + v * v, 0);
		expect(variance(p, [1]) / (1 / (aa / sigma ** 2 + 1 / s ** 2))).toBeCloseTo(1, 10);
		expect(p.mean[0] / ((50 * aa) / sigma ** 2 / (aa / sigma ** 2 + 1 / s ** 2))).toBeCloseTo(
			1,
			10
		);
	});

	/** The posterior by the direct route, inverting A^T A / sigma^2 + 1 / s^2 through Cholesky. */
	function direct(M: typeof A, y: ArrayLike<number>, sigma: number) {
		const k = M.cols;
		const P = matrix(k, k);
		for (let r = 0; r < M.rows; r++)
			for (let i = 0; i < k; i++) {
				const a = M.data[r * k + i] / sigma ** 2;
				if (a !== 0) for (let j = 0; j < k; j++) P.data[i * k + j] += a * M.data[r * k + j];
			}
		for (let i = 0; i < k; i++) P.data[i * k + i] += 1 / GOLD_MASS ** 2;
		const L = cholesky(P);
		const mean = choleskySolve(
			L,
			transposeTimes(M, y).map((v) => v / sigma ** 2)
		);
		const w = footprint(cells, RIGHT);
		return { mean, variance: total(w, choleskySolve(L, w)) };
	}

	it('where the direct inversion is well conditioned (SNR 10) the two routes agree', () => {
		const sigma = noiseForSnr(10, 0.1);
		const y = readBox(px, RIGHT);
		const p = posterior(f, y, sigma, GOLD_MASS);
		const d = direct(A, y, sigma);
		const top = Math.max(...p.mean.map(Math.abs));
		p.mean.forEach((v, i) => expect(Math.abs(v - d.mean[i])).toBeLessThan(1e-9 * top));
		expect(variance(p, footprint(cells, RIGHT)) / d.variance).toBeCloseTo(1, 9);
		// and the whole covariance is symmetric, with the cells' variances on its diagonal
		const cov = covariance(p);
		const each = cellStd(p);
		for (const i of [0, 57, 230]) {
			expect(Math.sqrt(cov.data[i * 231 + i]) / each[i]).toBeCloseTo(1, 10);
			expect(cov.data[i * 231 + 100]).toBeCloseTo(cov.data[100 * 231 + i], 6);
		}
	});

	it('an array with fewer readings than cells (5 x 5: 125 against 231) keeps the prior where it cannot reach', () => {
		// the reference's posterior needs 5 n^2 >= 231; here the independent route is the direct inversion above
		const few = arrayPixels(0.25, 5);
		const B = design(few, cells);
		const g = factor(B);
		expect(g.qr).toBeUndefined();
		expect(g.svd.s.length).toBe(125);
		const sigma = noiseForSnr(10, 0.25 / 4);
		const y = readBox(few, RIGHT);
		const p = posterior(g, y, sigma, GOLD_MASS);
		const d = direct(B, y, sigma);
		const top = Math.max(...p.mean.map(Math.abs));
		p.mean.forEach((v, i) => expect(Math.abs(v - d.mean[i])).toBeLessThan(1e-9 * top));
		const w = footprint(cells, RIGHT);
		expect(variance(p, w) / d.variance).toBeCloseTo(1, 9);
		// the same from the whole covariance and from the cells' own variances
		const cov = covariance(p);
		let quad = 0;
		for (let i = 0; i < 231; i++)
			for (let j = 0; j < 231; j++) quad += w[i] * cov.data[i * 231 + j] * w[j];
		expect(quad / d.variance).toBeCloseTo(1, 9);
		expect(cellStd(p)[150] / Math.sqrt(cov.data[150 * 231 + 150])).toBeCloseTo(1, 10);
		// no cell is known better than a well-read one, nor worse than its prior
		for (const s of cellStd(p)) expect(s).toBeLessThanOrEqual(GOLD_MASS * (1 + 1e-12));
	});
});

describe('positivity', () => {
	it('without noise the positive fit puts 327.66 kg in the right safe and none in the left, at any SNR', () => {
		// x, _ = scipy.optimize.nnls(A / sigma, read_box(px, RIGHT) / sigma, maxiter=5000); x[footprint(cells, RIGHT)].sum(),
		// x[footprint(cells, LEFT)].sum(), and the cells that are not zero: 0, 154, 155, 165, 166
		for (const snr of [10, 1e3, 1e6]) {
			const m = positiveFit(f, readBox(px, RIGHT), noiseForSnr(snr, 0.1));
			expect(total(footprint(cells, RIGHT), m)).toBeCloseTo(327.6639863186257, 6);
			expect(total(footprint(cells, LEFT), m)).toBe(0);
			const kept = Array.from(m.keys()).filter((i) => m[i] > 0);
			expect(kept).toEqual([0, 154, 155, 165, 166]);
			close(
				kept.map((i) => m[i]),
				[0.205, 74.48, 111.556, 96.34, 45.289],
				1e-5
			);
		}
	});

	it('positive_case(1e3): about 317 +- 16 kg in the right safe and almost nothing in the left', () => {
		// positive_case(1e3) = {"right": (316.77, 15.77), "left": (0.06, 0.29)} with numpy's draws, seed 1. The draw
		// matters: seeds 1 to 8 give means from 306.5 to 318.2 kg and spreads from 13.6 to 33.8 kg, and 400 draws
		// (positive_case(1e3, trials=400, seed=11)) give 315.3 +- 17.2 kg. This generator's seed 1 is one more such.
		const positive = positiveCase(1e3);
		const [m, s] = positive.right;
		// within the stated error of the stated value
		expect(Math.abs(m - 317)).toBeLessThan(16);
		// and the reference's own test: within a tenth of the gold's mass, a spread under 30 kg, nothing on the left,
		// against +-730 kg without positivity
		expect(Math.abs(m - GOLD_MASS)).toBeLessThan(0.1 * GOLD_MASS);
		expect(s).toBeLessThan(30);
		expect(s).toBeGreaterThan(10);
		expect(positive.left[0]).toBeLessThan(5);
		expect(workedCase(1e3).right[1]).toBeGreaterThan(20 * s);
	});

	it('positive_case(1e4): 328 +- 1 kg, the excess being the cost of a bar as a grid of points', () => {
		// positive_case(1e4) = {"right": (327.53, 0.77), "left": (0.0, 0.0)}
		const positive = positiveCase(1e4);
		expect(positive.right[0]).toBeCloseTo(327.5, 0);
		expect(positive.right[1]).toBeLessThan(2);
		expect(positive.left[0]).toBeLessThan(0.1);
	});
});
