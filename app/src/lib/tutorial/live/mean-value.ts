/**
 * Chapter 2.1's mean value property, in two pictures.
 *
 * The square. A square of 40 × 40 cells, x and y from −1 to 1, whose 41 × 41 nodes hold the values of a function h.
 * The nodes on the four edges are set (a pattern, x² − y², x³ − 3xy² or zero, with each edge raised or lowered most at
 * its middle and not at all at its corners); the nodes inside are relaxed by Jacobi's method, each replaced at every sweep by the average of its four
 * neighbours, until none changes. What is left is harmonic on the grid: each value the average of its neighbours, the
 * plane's form of the chapter's equation (eq:neighbours). The values do not change along the third direction, so
 * ∂²h/∂z² = 0 and the Laplacian is ∂²h/∂x² + ∂²h/∂y²; the averages are over circles. For the two patterns the four-
 * point average is exact, because their fourth derivatives along x and along y vanish, so the settled grid holds the
 * pattern itself. A probe circle reads h at its centre and its average round the circle, by cubic interpolation
 * between the nodes.
 *
 * The gold. The chapter's number: the 324 kg of gold, 3.92 m from the camera, makes the potential −GM/D there. Its
 * potential averaged over a sphere of radius R about the camera is −GM times the average of 1/|x − y| over the
 * sphere, which is 1/|y| when the gold lies outside the sphere and 1/R when inside (the chapter's practice problem):
 * the mean value property holds while the ball holds no gold and fails once it does. A seeded draw of points spread
 * evenly over the sphere estimates the same average.
 */
import { G } from '../../engine/physics/constants';
import { generator } from './graviton-count';

export { G, generator };

// --- the square --------------------------------------------------------------------------------------------------

/** Cells along each side, and nodes. */
export const CELLS = 40;
export const NODES = CELLS + 1;
/** The spacing of the nodes: the square runs from −1 to 1. */
export const SPACING = 2 / CELLS;

export type Pattern = 'saddle' | 'cubic' | 'zero';
export type Edge = 'top' | 'right' | 'bottom' | 'left';
export const EDGES: Edge[] = ['top', 'right', 'bottom', 'left'];
export type Raise = Record<Edge, number>;
export const FLAT: Raise = { top: 0, right: 0, bottom: 0, left: 0 };

/** The patterns the edges can start from: x² − y² and Re (x + iy)³ = x³ − 3xy², both harmonic, and zero. */
export const PATTERNS: Record<
	Pattern,
	{ tex: string; words: string; f: (x: number, y: number) => number }
> = {
	saddle: { tex: 'x^2 - y^2', words: 'x² − y²', f: (x, y) => x * x - y * y },
	cubic: { tex: 'x^3 - 3xy^2', words: 'x³ − 3xy²', f: (x, y) => x * x * x - 3 * x * y * y },
	zero: { tex: '0', words: 'zero', f: () => 0 }
};

/** The place of node (i, j): i counts to the right from the left edge, j down from the top. */
export const nodeX = (i: number) => -1 + i * SPACING;
export const nodeY = (j: number) => 1 - j * SPACING;

/**
 * How far an edge node is raised: by its edge's amount times sin(π s), s running from 0 to 1 along the edge, so that
 * the raise is greatest at the edge's middle and vanishes at its two corners, and the values round the square stay
 * continuous.
 */
function raiseAt(raise: Raise, i: number, j: number): number {
	const bump = (n: number) => Math.sin((Math.PI * n) / CELLS);
	if (j === 0) return raise.top * bump(i);
	if (j === CELLS) return raise.bottom * bump(i);
	if (i === 0) return raise.left * bump(j);
	if (i === CELLS) return raise.right * bump(j);
	return 0;
}

/** The two arrays the relaxation swaps between, the current values first. */
export interface Plate {
	values: Float64Array;
	next: Float64Array;
}

/** A plate with the pattern everywhere and the edges raised as given: settled at once when nothing is raised. */
export function plate(pattern: Pattern, raise: Raise = FLAT): Plate {
	const values = new Float64Array(NODES * NODES);
	const f = PATTERNS[pattern].f;
	for (let j = 0; j < NODES; j++)
		for (let i = 0; i < NODES; i++) values[j * NODES + i] = f(nodeX(i), nodeY(j));
	const p = { values, next: new Float64Array(NODES * NODES) };
	setEdges(p, pattern, raise);
	return p;
}

/** Sets the nodes on the edges to the pattern plus their edge's raise, leaving the inside as it was. */
export function setEdges(p: Plate, pattern: Pattern, raise: Raise): void {
	const f = PATTERNS[pattern].f;
	for (let j = 0; j < NODES; j++)
		for (let i = 0; i < NODES; i++) {
			if (i > 0 && i < CELLS && j > 0 && j < CELLS) continue;
			const v = f(nodeX(i), nodeY(j)) + raiseAt(raise, i, j);
			p.values[j * NODES + i] = v;
			p.next[j * NODES + i] = v;
		}
}

/**
 * `sweeps` sweeps of Jacobi's method: every inside node replaced by the average of its four neighbours, all at once.
 * Returns the largest change of any node in the last sweep.
 */
export function relax(p: Plate, sweeps: number): number {
	let change = 0;
	for (let s = 0; s < sweeps; s++) {
		const v = p.values;
		const w = p.next;
		change = 0;
		for (let j = 1; j < CELLS; j++) {
			const row = j * NODES;
			for (let i = 1; i < CELLS; i++) {
				const k = row + i;
				const a = 0.25 * (v[k - 1] + v[k + 1] + v[k - NODES] + v[k + NODES]);
				const d = Math.abs(a - v[k]);
				if (d > change) change = d;
				w[k] = a;
			}
		}
		p.values = w;
		p.next = v;
	}
	return change;
}

/** Relaxes until no node changes by more than `tolerance` in a sweep; returns the number of sweeps. */
export function settle(p: Plate, tolerance = 1e-12, most = 200000): number {
	let n = 0;
	while (n < most) {
		n += 50;
		if (relax(p, 50) <= tolerance) break;
	}
	return n;
}

/** The largest amount by which an inside node differs from the average of its four neighbours. */
export function residual(values: Float64Array): number {
	let most = 0;
	for (let j = 1; j < CELLS; j++)
		for (let i = 1; i < CELLS; i++) {
			const k = j * NODES + i;
			const a = 0.25 * (values[k - 1] + values[k + 1] + values[k - NODES] + values[k + NODES]);
			most = Math.max(most, Math.abs(a - values[k]));
		}
	return most;
}

/** Whether a point lies in the square, its edges included. */
export const inSquare = (x: number, y: number) =>
	Math.abs(x) <= 1 + 1e-12 && Math.abs(y) <= 1 + 1e-12;

/** The value at node (i, j), continued one node beyond the edges along a straight line. */
function node(values: Float64Array, i: number, j: number): number {
	if (i < 0) return 2 * node(values, 0, j) - node(values, 1, j);
	if (i > CELLS) return 2 * node(values, CELLS, j) - node(values, CELLS - 1, j);
	if (j < 0) return 2 * node(values, i, 0) - node(values, i, 1);
	if (j > CELLS) return 2 * node(values, i, CELLS) - node(values, i, CELLS - 1);
	return values[j * NODES + i];
}

/** The four weights of Catmull and Rom's cubic at the fraction u of the way between the middle two of four nodes. */
function weights(u: number): [number, number, number, number] {
	const u2 = u * u;
	const u3 = u2 * u;
	return [
		(-u3 + 2 * u2 - u) / 2,
		(3 * u3 - 5 * u2 + 2) / 2,
		(-3 * u3 + 4 * u2 + u) / 2,
		(u3 - u2) / 2
	];
}

/**
 * h at (x, y), by Catmull and Rom's cubic through the sixteen nodes round it, which passes through the nodes and
 * follows a smooth function about ten times more closely than a straight line between them; NaN outside the square.
 */
export function valueAt(values: Float64Array, x: number, y: number): number {
	if (!inSquare(x, y)) return NaN;
	const s = Math.min(CELLS, Math.max(0, (x + 1) / SPACING));
	const t = Math.min(CELLS, Math.max(0, (1 - y) / SPACING));
	const i = Math.min(CELLS - 1, Math.floor(s));
	const j = Math.min(CELLS - 1, Math.floor(t));
	const wx = weights(s - i);
	const wy = weights(t - j);
	let v = 0;
	for (let m = 0; m < 4; m++) {
		let row = 0;
		for (let n = 0; n < 4; n++) row += wx[n] * node(values, i - 1 + n, j - 1 + m);
		v += wy[m] * row;
	}
	return v;
}

/** Points round the probe circle: the reading at each is taken at the angle 2π(n + ½)/count from the +x axis. */
export const CIRCLE_POINTS = 360;

/**
 * h round a circle of radius r about (cx, cy), at `count` angles evenly spaced (NaN where the circle leaves the
 * square), its average over the part inside the square, and the fraction of the circle that is inside.
 */
export function circle(
	values: Float64Array,
	cx: number,
	cy: number,
	r: number,
	count = CIRCLE_POINTS
) {
	const samples = new Float64Array(count);
	let sum = 0;
	let inside = 0;
	for (let n = 0; n < count; n++) {
		const th = (2 * Math.PI * (n + 0.5)) / count;
		const v = valueAt(values, cx + r * Math.cos(th), cy + r * Math.sin(th));
		samples[n] = v;
		if (!Number.isNaN(v)) {
			sum += v;
			inside++;
		}
	}
	return { samples, average: inside ? sum / inside : NaN, inside: inside / count };
}

/** Whether a circle lies wholly in the square, touching its edges allowed. */
export const circleInside = (cx: number, cy: number, r: number) =>
	Math.abs(cx) + r <= 1 + 1e-9 && Math.abs(cy) + r <= 1 + 1e-9;

/** The largest and smallest values on the edges (corners left out) and inside, with the places of the largest. */
export function extremes(values: Float64Array) {
	let edgeMax = -Infinity;
	let edgeMin = Infinity;
	let insideMax = -Infinity;
	let insideMin = Infinity;
	let maxAt = { x: 0, y: 0 };
	let minAt = { x: 0, y: 0 };
	let edgeMaxAt = { x: 0, y: 0 };
	for (let j = 0; j < NODES; j++)
		for (let i = 0; i < NODES; i++) {
			const v = values[j * NODES + i];
			const onEdge = i === 0 || j === 0 || i === CELLS || j === CELLS;
			if (onEdge) {
				const corner = (i === 0 || i === CELLS) && (j === 0 || j === CELLS);
				if (corner) continue;
				if (v > edgeMax) {
					edgeMax = v;
					edgeMaxAt = { x: nodeX(i), y: nodeY(j) };
				}
				edgeMin = Math.min(edgeMin, v);
			} else {
				if (v > insideMax) {
					insideMax = v;
					maxAt = { x: nodeX(i), y: nodeY(j) };
				}
				if (v < insideMin) {
					insideMin = v;
					minAt = { x: nodeX(i), y: nodeY(j) };
				}
			}
		}
	return { edgeMax, edgeMin, insideMax, insideMin, maxAt, minAt, edgeMaxAt };
}

/** The largest size of any value on the edges: the map's colours and its lines are scaled to it. */
export function edgeScale(values: Float64Array): number {
	const e = extremes(values);
	return Math.max(Math.abs(e.edgeMax), Math.abs(e.edgeMin), 1e-9);
}

/** A step for the lines of constant h: 1, 2 or 5 times a power of ten, giving at most eight lines on each side of 0. */
export function lineStep(scale: number): number {
	const rough = scale / 8;
	const p = 10 ** Math.floor(Math.log10(rough) + 1e-9);
	for (const m of [1, 2, 5, 10]) if (m * p >= rough - 1e-12) return m * p;
	return 10 * p;
}

/** The levels of the lines: every multiple of `step` strictly within ±scale, zero included. */
export function lineLevels(scale: number, step: number): number[] {
	const most = Math.ceil(scale / step - 1e-9) - 1;
	const out: number[] = [];
	for (let k = -most; k <= most; k++) out.push(Number((k * step).toFixed(12)));
	return out;
}

/*
 * The segments of a cell by its case, for marching squares: bit 8 for the top left node above the level, 4 top
 * right, 2 bottom right, 1 bottom left; edges 0 top, 1 right, 2 bottom, 3 left. Cases 5 and 10 are settled by the
 * mean of the four nodes.
 */
const SEGMENTS: number[][] = [
	[],
	[3, 2],
	[2, 1],
	[3, 1],
	[0, 1],
	[],
	[0, 2],
	[0, 3],
	[0, 3],
	[0, 2],
	[],
	[0, 1],
	[3, 1],
	[2, 1],
	[3, 2],
	[]
];

/**
 * The line h = level through the square, by marching squares on the nodes: a flat list of segments x0, y0, x1, y1,
 * each crossing placed on its cell's edge by linear interpolation.
 */
export function contour(values: Float64Array, level: number): number[] {
	const out: number[] = [];
	const cross = (k0: number, k1: number, x0: number, y0: number, x1: number, y1: number) => {
		const a = values[k0];
		const t = (level - a) / (values[k1] - a);
		return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
	};
	for (let j = 0; j < CELLS; j++)
		for (let i = 0; i < CELLS; i++) {
			const k = j * NODES + i;
			const tl = values[k];
			const tr = values[k + 1];
			const br = values[k + NODES + 1];
			const bl = values[k + NODES];
			const kind =
				(tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
			if (kind === 0 || kind === 15) continue;
			const x0 = nodeX(i);
			const x1 = nodeX(i + 1);
			const y0 = nodeY(j);
			const y1 = nodeY(j + 1);
			const edge = (e: number) =>
				e === 0
					? cross(k, k + 1, x0, y0, x1, y0)
					: e === 1
						? cross(k + 1, k + NODES + 1, x1, y0, x1, y1)
						: e === 2
							? cross(k + NODES, k + NODES + 1, x0, y1, x1, y1)
							: cross(k, k + NODES, x0, y0, x0, y1);
			let segs = SEGMENTS[kind];
			if (kind === 5 || kind === 10) {
				const above = (tl + tr + br + bl) / 4 > level;
				// the mean above joins the nodes above, and cuts off the two below
				segs = (kind === 10) === above ? [0, 1, 3, 2] : [0, 3, 1, 2];
			}
			for (let s = 0; s < segs.length; s += 2) out.push(...edge(segs[s]), ...edge(segs[s + 1]));
		}
	return out;
}

// --- the gold round the camera -------------------------------------------------------------------------------------

/** The gold of the locked safe: its mass, kg, and its distance from the camera, m (chapter 1.2). */
export const GOLD_MASS = 324;
export const GOLD_DISTANCE = 3.92;

/** The gold's potential at the camera, J kg⁻¹: −GM/D. */
export const GOLD_AT_CAMERA = (-G * GOLD_MASS) / GOLD_DISTANCE;

/**
 * The average of 1/|x − y| over the sphere |x| = R, for a point y at the distance D from its centre: 1/D when y
 * lies outside the sphere and 1/R when inside, m⁻¹.
 */
export const inverseAverage = (D: number, R: number) => 1 / Math.max(D, R);

/** The gold's potential averaged over a sphere of radius R about the camera, J kg⁻¹. */
export const goldAverage = (R: number) => -G * GOLD_MASS * inverseAverage(GOLD_DISTANCE, R);

/** Whether the ball of radius R about the camera holds the gold. */
export const holdsGold = (R: number) => R > GOLD_DISTANCE;

/** The number of points in a draw. */
export const DRAW = 100000;

/**
 * `count` points spread evenly over the unit sphere, drawn from `seed`: x, y, z repeated. The height z is uniform on
 * [−1, 1] and the angle round the axis uniform on [0, 2π), which spreads equal areas equally (Archimedes).
 */
export function spherePoints(seed: number, count = DRAW): Float64Array {
	const random = generator(seed);
	const out = new Float64Array(3 * count);
	for (let n = 0; n < count; n++) {
		const z = 2 * random() - 1;
		const phi = 2 * Math.PI * random();
		const s = Math.sqrt(Math.max(0, 1 - z * z));
		out[3 * n] = s * Math.cos(phi);
		out[3 * n + 1] = s * Math.sin(phi);
		out[3 * n + 2] = z;
	}
	return out;
}

/**
 * The average of 1/|R u − D x̂| over the drawn unit vectors u (the point y at the distance D along +x), m⁻¹, and its
 * standard error, the spread of the values over the square root of their number.
 */
export function sampledInverseAverage(points: Float64Array, D: number, R: number) {
	const count = points.length / 3;
	let sum = 0;
	let squares = 0;
	for (let n = 0; n < count; n++) {
		const dx = R * points[3 * n] - D;
		const dy = R * points[3 * n + 1];
		const dz = R * points[3 * n + 2];
		const v = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
		sum += v;
		squares += v * v;
	}
	const mean = sum / count;
	const spread = Math.sqrt(Math.max(0, squares / count - mean * mean));
	return { mean, error: spread / Math.sqrt(count) };
}

/** The gold's potential averaged over the drawn points of a sphere of radius R, J kg⁻¹, with its standard error. */
export function sampledGoldAverage(points: Float64Array, R: number) {
	const s = sampledInverseAverage(points, GOLD_DISTANCE, R);
	return { mean: -G * GOLD_MASS * s.mean, error: G * GOLD_MASS * s.error };
}
