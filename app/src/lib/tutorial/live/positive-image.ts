/**
 * The numbers of chapter 3.9's positive image, for its live figure. It is the row-and-line-mass geometry of the
 * paper's Figure fig:nearfield and of chapters 3.5 and 3.7: an endless row of sensors reads the tide −𝓔_zz of line
 * masses lying in a row at the depth z below it, with white noise. Lengths are in units of z. A mass m at x gives the
 * reading m · t(u − x), with
 *
 *     t(u) = (1 − u²)/(1 + u²)²,
 *
 * in units of the peak tide 2Gm/z² of one mass. SNR is that peak over the noise of the reading averaged along a length
 * z (chapter 3.7's eq:snr, in a slice), so the noise has the density 1/SNR² in these units. A ripple of the scene of
 * fineness q = kz reaches the readings multiplied by the transform of t, π q e^(−q), and stands above its noise by
 *
 *     s = π SNR q e^(−q),
 *
 * chapter 3.7's ratio for the paper's prior of one mass per depth, so the Gaussian image keeps it with chapter 3.5's
 * weight H = s²/(1 + s²) (the engine's `transfer`).
 *
 * The readings are written as ripples: the row is taken as a ring of length PERIOD = 40 depths, long enough that its
 * ends do not matter, and each ripple cos(q u) or sin(q u), q = 2πk/PERIOD, is measured once, its noise a standard
 * Gaussian number in units of the noise. Ripples finer than q = 45 carry nothing at any SNR up to 10⁸, so they are
 * left out. The same draw of noise feeds both images:
 *
 * - the Gaussian image, the density H·(reading)/(gain) ripple by ripple: the scene blurred by the paper's picture of a
 *   point (engine/resolution.ts's slice point spread), plus the noise each ripple lets through, s/(1 + s²) of it;
 * - the positive image, the masses in the CELLS cells of a row that make the misfit to the readings least among
 *   masses that are never negative (non-negative least squares, by the exact active-set method of Lawson and Hanson,
 *   ../../array/nnls.ts).
 *
 * SNR is passed as a power of ten, `decades`, as in the engine.
 */
import { applyQ, applyQt, leastSquares, matrix, qr, type Matrix } from '../../array/linalg';
import { normals } from '../../array/random';
import { transfer } from '../../engine/resolution';

/**
 * How the figure opens: two masses 0.3 depths apart at SNR = 10³, the row of cells 1.2 depths wide; the share of 300
 * draws of the noise (seeds 1 to 300) in which the positive image then tells the two apart (`toldApart`), 0.977; and
 * the draw it opens with, seed 2, one of those 98 in 100 (seed 1 is one of the other two).
 */
export const OPENING = { decades: 3, separation: 0.3, width: 1.2, share: 0.977, seed: 2 } as const;

/**
 * The merge separations, in depths: where the positive image tells two equal masses apart in half of 400 draws of
 * the noise (seeds 1 to 400), with cells a sixth of the separation wide (`mergeSeparation`). From 10³ to 10⁶ the
 * separation shrinks about eightfold, near the cube root of the thousandfold gain, while the Gaussian image's (`wienerMerge`)
 * shrinks 1.7-fold.
 */
export const MERGE = { 3: 0.141, 6: 0.0164, draws: 400 } as const;

/** The cells of the positive image. */
export const CELLS = 40;
/** The length of the ring of sensors, in depths. */
export const PERIOD = 40;
/** The finest ripple kept, q = kz. */
export const Q_MOST = 45;
/** The ripples kept: q = 2πk/PERIOD for k = 1 … MODES. */
export const MODES = Math.floor((Q_MOST * PERIOD) / (2 * Math.PI));
/** The spacing of the ripples in q. */
const DQ = (2 * Math.PI) / PERIOD;
/** Each ripple's shape, cos(q u) or sin(q u), scaled to unit length along the ring. */
const NORM = Math.sqrt(2 / PERIOD);

/** The tide −𝓔_zz at the sensors from one mass at the depth 1, a distance u along the row: (1 − u²)/(1 + u²)². */
export const tide = (u: number) => (1 - u * u) / (1 + u * u) ** 2;

/** The transform of the tide, ∫ t(u) cos(q u) du = π q e^(−q): how strongly a ripple of the scene reaches the row. */
export const gain = (q: number) => Math.PI * Math.abs(q) * Math.exp(-Math.abs(q));

/** s = π SNR q e^(−q): how far a ripple of fineness q stands above its noise. */
export const ripple = (q: number, decades: number) => 10 ** decades * gain(q);

/** Chapter 3.5's weight H = s²/(1 + s²). */
export const weight = (q: number, decades: number) => transfer(q, decades);

/** A line mass: its place along the row, in depths, and its size, in units of the mass that SNR refers to. */
export interface Mass {
	x: number;
	m: number;
}

/** One draw of the noise: a standard Gaussian number for the cosine and the sine of every ripple. */
export const noiseDraw = (seed: number) => normals(seed, 2 * MODES);

/** cos(q_k x) and sin(q_k x) for k = 1 … MODES, by turning a unit vector step by step. */
function phases(x: number): { c: Float64Array; s: Float64Array } {
	const c = new Float64Array(MODES);
	const s = new Float64Array(MODES);
	const c1 = Math.cos(DQ * x);
	const s1 = Math.sin(DQ * x);
	let ck = c1;
	let sk = s1;
	for (let k = 0; k < MODES; k++) {
		c[k] = ck;
		s[k] = sk;
		const next = ck * c1 - sk * s1;
		sk = sk * c1 + ck * s1;
		ck = next;
	}
	return { c, s };
}

/** s for every ripple kept. */
export function ripples(decades: number): Float64Array {
	const out = new Float64Array(MODES);
	for (let k = 0; k < MODES; k++) out[k] = ripple((k + 1) * DQ, decades);
	return out;
}

/**
 * The design matrix in units of the noise: row 2k holds the cosine of ripple k + 1, row 2k + 1 its sine, and column
 * j what a unit mass at places[j] adds to them.
 */
export function design(places: readonly number[], decades: number): Matrix {
	const s = ripples(decades);
	const n = places.length;
	const a = matrix(2 * MODES, n);
	places.forEach((x, j) => {
		const p = phases(x);
		for (let k = 0; k < MODES; k++) {
			a.data[2 * k * n + j] = NORM * s[k] * p.c[k];
			a.data[(2 * k + 1) * n + j] = NORM * s[k] * p.s[k];
		}
	});
	return a;
}

/** The readings, ripple by ripple, in units of the noise: what the masses give plus the draw of noise. */
export function readings(
	masses: readonly Mass[],
	decades: number,
	noise: ArrayLike<number>
): Float64Array {
	const s = ripples(decades);
	const y = Float64Array.from(noise);
	for (const { x, m } of masses) {
		const p = phases(x);
		for (let k = 0; k < MODES; k++) {
			y[2 * k] += m * NORM * s[k] * p.c[k];
			y[2 * k + 1] += m * NORM * s[k] * p.s[k];
		}
	}
	return y;
}

/** The centres of the CELLS cells of a row `width` depths wide, centred under the middle of the camera. */
export function cellCentres(width: number, count = CELLS): number[] {
	const h = width / count;
	return Array.from({ length: count }, (_, j) => -width / 2 + (j + 0.5) * h);
}

/** The positive image: the mass in each cell, never negative, that fits the readings best. */
export function positiveImage(
	cells: readonly number[],
	masses: readonly Mass[],
	decades: number,
	noise: ArrayLike<number>
): { m: Float64Array; misfit: number } {
	return positiveFit(design(cells, decades), readings(masses, decades, noise));
}

/** The columns `index` of a matrix. */
function columns(a: Matrix, index: readonly number[]): Matrix {
	const out = matrix(a.rows, index.length);
	for (let i = 0; i < a.rows; i++)
		for (let k = 0; k < index.length; k++)
			out.data[i * index.length + k] = a.data[i * a.cols + index[k]];
	return out;
}

/**
 * Non-negative least squares: the x ≥ 0 that makes |y − A x|² least, by the active-set method of Lawson and Hanson
 * (Solving Least Squares Problems, 1974, chapter 23). The cells holding mass are the free set; each trial is the
 * least-squares fit on the free set, through QR; when a trial would make a free cell negative, the method steps back
 * to where that cell reaches zero and holds it there.
 *
 * One change from ../../array/nnls.ts: the columns of neighbouring cells are nearly parallel here (they differ by a
 * few parts in 10⁸ at the finest cells), so a cell is judged by what it would add to the fit beyond the free set: its
 * column is projected off the free columns, and the cell that would lower the misfit most enters, if it would lower
 * it at all (by more than 10⁻⁹, in units of the noise squared). A test on the plain slope a_j·r against a tolerance
 * scaled by the largest slope stops early at high SNR, where those slopes are tiny but the gains are not.
 */
export function positiveFit(a: Matrix, y: ArrayLike<number>): { m: Float64Array; misfit: number } {
	const { rows, cols: n } = a;
	const x = new Float64Array(n);
	const free: number[] = [];
	const refused = new Uint8Array(n);
	const cols = Array.from({ length: n }, () => new Float64Array(rows));
	for (let i = 0; i < rows; i++) for (let j = 0; j < n; j++) cols[j][i] = a.data[i * n + j];
	const length = (v: ArrayLike<number>) => {
		let s = 0;
		for (let i = 0; i < v.length; i++) s += v[i] * v[i];
		return Math.sqrt(s);
	};
	const sizes = Float64Array.from(cols, length);

	/** The least-squares fit on the free set, as a full vector. */
	const trial = () => {
		const z = new Float64Array(n);
		if (free.length) leastSquares(columns(a, free), y).forEach((v, k) => (z[free[k]] = v));
		return z;
	};

	let misfit = 0;
	for (let round = 0; round < 20 * n; round++) {
		// the residual, and each held cell's column, with the free columns' part removed
		const f = free.length ? qr(columns(a, free)) : undefined;
		const off = (v: ArrayLike<number>) => {
			if (!f) return Float64Array.from(v);
			const t = applyQt(f, v);
			t.fill(0, 0, free.length);
			return applyQ(f, t);
		};
		const r = off(y);
		misfit = length(r) ** 2;
		let enter = -1;
		let best = 1e-9;
		for (let j = 0; j < n; j++) {
			if (refused[j] || free.includes(j)) continue;
			const p = off(cols[j]);
			const size = length(p);
			if (!(size > 1e-13 * sizes[j])) continue;
			let slope = 0;
			for (let i = 0; i < rows; i++) slope += p[i] * r[i];
			if (slope <= 0) continue;
			const gain = (slope / size) ** 2;
			if (gain > best) {
				best = gain;
				enter = j;
			}
		}
		if (enter < 0) break;
		free.push(enter);
		let z = trial();
		if (!(z[enter] > 0)) {
			// rounding: the cell adds nothing the free set lacks
			free.pop();
			refused[enter] = 1;
			continue;
		}
		refused.fill(0);
		// step back while the trial would make a free cell negative
		for (let guard = 0; guard <= n; guard++) {
			let step = 1;
			let leave = -1;
			for (const j of free)
				if (z[j] <= 0 && x[j] / (x[j] - z[j]) < step) {
					step = x[j] / (x[j] - z[j]);
					leave = j;
				}
			if (leave < 0) break;
			for (const j of free) x[j] += step * (z[j] - x[j]);
			x[leave] = 0;
			for (let k = free.length - 1; k >= 0; k--)
				if (!(x[free[k]] > 0)) {
					x[free[k]] = 0;
					free.splice(k, 1);
				}
			z = trial();
		}
		x.fill(0);
		for (const j of free) x[j] = z[j];
	}
	return { m: x, misfit };
}

/**
 * The Gaussian image at the places xs, as a density in masses per depth: each ripple of the readings divided by its
 * gain and kept with the weight H. The masses' part is the scene blurred by the paper's picture of a point (with
 * H = 1 for the uniform ripple, the engine's convention, so that the picture of a mass holds that mass); the noise's
 * part is s/(1 + s²) of each ripple's noise.
 */
export function wienerImage(
	xs: readonly number[],
	masses: readonly Mass[],
	decades: number,
	noise: ArrayLike<number>
): Float64Array {
	const s = ripples(decades);
	const h = s.map((v) => (v * v) / (1 + v * v));
	const pass = s.map((v) => v / (1 + v * v));
	const total = masses.reduce((t, { m }) => t + m, 0);
	const at = masses.map(({ x }) => phases(x));
	return Float64Array.from(xs, (x) => {
		const p = phases(x);
		let v = total / PERIOD;
		for (let k = 0; k < MODES; k++) {
			let scene = 0;
			masses.forEach(({ m }, i) => {
				// cos(q(x − x_i)) = cos q x cos q x_i + sin q x sin q x_i
				scene += m * (p.c[k] * at[i].c[k] + p.s[k] * at[i].s[k]);
			});
			v += (2 / PERIOD) * h[k] * scene;
			v += NORM * pass[k] * (noise[2 * k] * p.c[k] + noise[2 * k + 1] * p.s[k]);
		}
		return v;
	});
}

/** The Gaussian image of one unit mass without noise, at a distance r: the paper's picture of a point, in masses per depth. */
export function pointSpread(r: number, decades: number): number {
	const s = ripples(decades);
	let v = 1 / PERIOD;
	for (let k = 0; k < MODES; k++) {
		const q = (k + 1) * DQ;
		v += (2 / PERIOD) * ((s[k] * s[k]) / (1 + s[k] * s[k])) * Math.cos(q * r);
	}
	return v;
}

/**
 * The separation beyond which the Gaussian image of two equal masses, without noise, dips between them: twice the first
 * place where the picture of a point turns from curving down to curving up (the Sparrow limit).
 */
export function wienerMerge(decades: number): number {
	const s = ripples(decades);
	const curve = (r: number) => {
		let v = 0;
		for (let k = 0; k < MODES; k++) {
			const q = (k + 1) * DQ;
			v -= ((s[k] * s[k]) / (1 + s[k] * s[k])) * q * q * Math.cos(q * r);
		}
		return v;
	};
	let a = 0;
	let b = 0.01;
	while (curve(b) < 0) [a, b] = [b, b + 0.01];
	for (let i = 0; i < 50; i++) {
		const mid = (a + b) / 2;
		if (curve(mid) < 0) a = mid;
		else b = mid;
	}
	return a + b;
}

/**
 * The bumps of a curve: its highest points above half its peak, two counted apart only when the curve between them
 * dips below 97% of the lower (the near-field figure's test).
 */
export function bumps(values: ArrayLike<number>): number {
	let top = -Infinity;
	for (let i = 0; i < values.length; i++) top = Math.max(top, values[i]);
	const found: number[] = [];
	let low = Infinity;
	for (let i = 1; i < values.length - 1; i++) {
		low = Math.min(low, values[i]);
		const v = values[i];
		if (!(v >= values[i - 1] && v > values[i + 1] && v > top / 2)) continue;
		const last = found.at(-1);
		if (last !== undefined && low >= 0.97 * Math.min(last, v))
			found[found.length - 1] = Math.max(last, v);
		else found.push(v);
		low = Infinity;
	}
	return found.length;
}

// --- counting peaks --------------------------------------------------------------------------------------------------

/** A cell is empty when it holds less than this share of one mass. */
export const CRUMB = 0.01;
/** A run of filled cells counts as a peak when it holds at least this share of one mass. */
export const PEAK = 0.25;

/** The runs of neighbouring filled cells, each with its first and last cell and its mass. */
export function clusters(image: ArrayLike<number>, unit = 1) {
	const out: { first: number; last: number; mass: number }[] = [];
	for (let j = 0; j < image.length; j++) {
		if (!(image[j] > CRUMB * unit)) continue;
		const last = out.at(-1);
		if (last && last.last === j - 1) {
			last.last = j;
			last.mass += image[j];
		} else out.push({ first: j, last: j, mass: image[j] });
	}
	return out;
}

/**
 * The peaks of a positive image: runs of filled cells, with empty cells between them, that hold a quarter of a mass
 * or more, each with its mass and its centre of mass.
 */
export function peaks(image: ArrayLike<number>, cells: readonly number[], unit = 1) {
	return clusters(image, unit)
		.filter((c) => c.mass >= PEAK * unit)
		.map((c) => {
			let moment = 0;
			for (let j = c.first; j <= c.last; j++) moment += image[j] * cells[j];
			return { ...c, at: moment / c.mass };
		});
}

/**
 * Whether the positive image tells every mass apart: each mass has a peak of its own whose centre lies within a
 * quarter of the distance to its nearest neighbour. A single blob that the noise splits into two peaks fails this,
 * because its peaks stand where the blob's edges are, not where the masses are.
 */
export function toldApart(
	image: ArrayLike<number>,
	cells: readonly number[],
	masses: readonly Mass[]
) {
	if (masses.length < 2) return false;
	const unit = masses.reduce((t, { m }) => t + m, 0) / masses.length;
	const found = peaks(image, cells, unit);
	const used = new Set<number>();
	return masses.every(({ x }, i) => {
		let gap = Infinity;
		masses.forEach((o, k) => k !== i && (gap = Math.min(gap, Math.abs(o.x - x))));
		let pick = -1;
		found.forEach((p, k) => {
			if (used.has(k) || Math.abs(p.at - x) > gap / 4) return;
			if (pick < 0 || Math.abs(p.at - x) < Math.abs(found[pick].at - x)) pick = k;
		});
		if (pick < 0) return false;
		used.add(pick);
		return true;
	});
}

// --- where two masses merge ----------------------------------------------------------------------------------------

/**
 * The share of noise draws in which the positive image tells apart two unit masses `d` apart, centred under the
 * camera. Each cell is d/perSeparation wide, so that the cells are fine beside the separation at every SNR (the reader
 * does the same with the figure's zoom).
 */
export function splitShare(
	d: number,
	decades: number,
	seeds: readonly number[],
	perSeparation = 6
) {
	const width = (CELLS * d) / perSeparation;
	const cells = cellCentres(width);
	const pair = [
		{ x: -d / 2, m: 1 },
		{ x: d / 2, m: 1 }
	];
	let split = 0;
	for (const seed of seeds) {
		const { m } = positiveImage(cells, pair, decades, noiseDraw(seed));
		if (toldApart(m, cells, pair)) split++;
	}
	return split / seeds.length;
}

/**
 * The separation at which the positive image tells the two masses apart in half the draws: the merge separation. Found by
 * bisection in log d between `low` and `high`, with the same draws at every separation.
 */
export function mergeSeparation(
	decades: number,
	seeds: readonly number[],
	low: number,
	high: number,
	perSeparation = 6,
	steps = 18
) {
	let a = Math.log(low);
	let b = Math.log(high);
	for (let i = 0; i < steps; i++) {
		const mid = (a + b) / 2;
		if (splitShare(Math.exp(mid), decades, seeds, perSeparation) >= 0.5) b = mid;
		else a = mid;
	}
	return Math.exp((a + b) / 2);
}
