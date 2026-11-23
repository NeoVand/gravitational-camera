/**
 * The potential and the field of chapter 1.2's map: two point masses on a plane, seen from above, in SI units.
 *
 *   Φ(x) = −Σ G m_a / |x − x_a|,      g(x) = −∇Φ = −Σ G m_a (x − x_a) / |x − x_a|³,
 *
 * the sums over the masses. The site's engine (../../engine/tidal.ts) gives the next derivative, the tidal tensor
 * E_ij = ∂_i ∂_j Φ, from its flat list of point masses; `points` writes the masses in that form, and the spec checks
 * the field here against it. This adds the two lower rungs, Φ and g, the point between two masses where their pulls
 * cancel, and the equipotential lines the figure draws: levels of Φ evenly spaced in its logarithm, traced by
 * marching squares on a grid.
 */
import { G } from '../../engine/physics/constants';

export { G };

/** A point mass on the plane: its place, m, x to the right and y up, and its mass, kg. */
export interface Body {
	x: number;
	y: number;
	mass: number;
}

/** The masses in the engine's flat form (x, y, z, mass, repeated), on the plane z = 0. */
export const points = (bodies: Body[]) =>
	Float64Array.from(bodies.flatMap((b) => [b.x, b.y, 0, b.mass]));

/** One mass's potential at (x, y), J kg⁻¹: −G m / r. */
export const potentialOf = (b: Body, x: number, y: number) =>
	(-G * b.mass) / Math.hypot(x - b.x, y - b.y);

/** The potential of all the masses at (x, y), J kg⁻¹. */
export const potential = (bodies: Body[], x: number, y: number) =>
	bodies.reduce((s, b) => s + potentialOf(b, x, y), 0);

/** One mass's pull at (x, y), m s⁻²: G m / r² toward it. */
export function fieldOf(b: Body, x: number, y: number): { x: number; y: number } {
	const dx = b.x - x;
	const dy = b.y - y;
	const r2 = dx * dx + dy * dy;
	const k = (G * b.mass) / (r2 * Math.sqrt(r2));
	return { x: k * dx, y: k * dy };
}

/** The field of all the masses at (x, y), m s⁻²: the pulls added as arrows. */
export function field(bodies: Body[], x: number, y: number): { x: number; y: number } {
	let gx = 0;
	let gy = 0;
	for (const b of bodies) {
		const g = fieldOf(b, x, y);
		gx += g.x;
		gy += g.y;
	}
	return { x: gx, y: gy };
}

/**
 * Each mass's share at (x, y), as fractions that add to one: of the potential (the terms all have one sign, so each
 * is a plain fraction), and of the sizes of the pulls, |g_a| / Σ |g_b|. The pulls add as arrows, not as sizes, so
 * the second says how strongly each mass pulls, not how much of the total it makes.
 */
export function shares(bodies: Body[], x: number, y: number) {
	const phi = bodies.map((b) => potentialOf(b, x, y));
	const pulls = bodies.map((b) => Math.hypot(fieldOf(b, x, y).x, fieldOf(b, x, y).y));
	const phiSum = phi.reduce((s, v) => s + v, 0);
	const pullSum = pulls.reduce((s, v) => s + v, 0);
	return { potential: phi.map((v) => v / phiSum), pull: pulls.map((v) => v / pullSum) };
}

/**
 * Where the pulls of two masses cancel, as a fraction of the way from the lighter to the heavier. On the line
 * between them, s from the lighter and d − s from the heavier, the pulls are opposite and equal when
 * m_light / s² = m_heavy / (d − s)², so (d − s) / s = √(m_heavy / m_light) and
 *
 *   s / d = 1 / (1 + √(m_heavy / m_light)),
 *
 * less than one half: nearer the lighter mass. Off the line the two pulls have parts across it of one sign, which
 * cannot cancel, and beyond either mass they point the same way; so this is the only point of zero pull.
 */
export const zeroPullFraction = (heavy: number, light: number) =>
	1 / (1 + Math.sqrt(heavy / light));

/** The point of zero pull between two masses, m, and its distance from the lighter one (the first if equal). */
export function zeroPull(a: Body, b: Body): { x: number; y: number; fromLighter: number } {
	const [light, heavy] = a.mass <= b.mass ? [a, b] : [b, a];
	const f = zeroPullFraction(heavy.mass, light.mass);
	const d = Math.hypot(heavy.x - light.x, heavy.y - light.y);
	return {
		x: light.x + f * (heavy.x - light.x),
		y: light.y + f * (heavy.y - light.y),
		fromLighter: f * d
	};
}

/**
 * The levels of the map: Φ = −10^(k / perDecade) J kg⁻¹ for every whole k with |Φ| from `least` to `most`, deepest
 * last. Evenly spaced in log |Φ|: beside one mass, where |Φ| = G m / r, the lines are circles whose radii shrink by
 * the same factor, 10^(1/perDecade), from each to the next. The levels fall on whole powers of ten and do not move
 * when the masses do.
 */
export function levels(least: number, most: number, perDecade: number): number[] {
	const first = Math.ceil(Math.log10(least) * perDecade - 1e-9);
	const last = Math.floor(Math.log10(most) * perDecade + 1e-9);
	const out: number[] = [];
	for (let k = first; k <= last; k++) out.push(-(10 ** (k / perDecade)));
	return out;
}

/** The part of the plane the map shows, m: its top left corner, its size, and the largest spacing of the grid. */
export interface Frame {
	left: number;
	top: number;
	width: number;
	height: number;
	step: number;
}

/**
 * The potential on a grid over a frame, with a ring of nodes one step outside it held at zero, above every level:
 * each level's line then closes round the outside of the frame, so that it bounds the region below it and can be
 * filled. Node (i, j) is at x = left + (i − 1) hx, y = top − (j − 1) hy; within `cap` of a mass's singularity the
 * potential is held at −cap. `min` and `max` are each cell's least and greatest corner.
 */
export interface Grid {
	nx: number;
	ny: number;
	left: number;
	top: number;
	hx: number;
	hy: number;
	values: Float64Array;
	min: Float64Array;
	max: Float64Array;
}

/** The grid of a frame, its arrays allocated but not filled. */
export function grid(frame: Frame): Grid {
	const cx = Math.max(2, Math.round(frame.width / frame.step));
	const cy = Math.max(2, Math.round(frame.height / frame.step));
	const nx = cx + 3;
	const ny = cy + 3;
	return {
		nx,
		ny,
		left: frame.left,
		top: frame.top,
		hx: frame.width / cx,
		hy: frame.height / cy,
		values: new Float64Array(nx * ny),
		min: new Float64Array((nx - 1) * (ny - 1)),
		max: new Float64Array((nx - 1) * (ny - 1))
	};
}

/** Fill a grid with the potential of the masses, in place, and return it. */
export function sample(g: Grid, bodies: Body[], cap: number): Grid {
	const { nx, ny, values, min, max } = g;
	const gm = bodies.map((b) => G * b.mass);
	for (let j = 0; j < ny; j++) {
		const y = g.top - (j - 1) * g.hy;
		for (let i = 0; i < nx; i++) {
			if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) {
				values[j * nx + i] = 0;
				continue;
			}
			const x = g.left + (i - 1) * g.hx;
			let phi = 0;
			for (let a = 0; a < bodies.length; a++)
				phi -= gm[a] / Math.hypot(x - bodies[a].x, y - bodies[a].y);
			values[j * nx + i] = Math.max(-cap, phi);
		}
	}
	for (let j = 0; j < ny - 1; j++)
		for (let i = 0; i < nx - 1; i++) {
			const k = j * nx + i;
			const a = values[k];
			const b = values[k + 1];
			const c = values[k + nx + 1];
			const d = values[k + nx];
			min[j * (nx - 1) + i] = Math.min(a, b, c, d);
			max[j * (nx - 1) + i] = Math.max(a, b, c, d);
		}
	return g;
}

/** Scratch space for `isolines`, kept between calls for one grid size. */
interface Links {
	size: number;
	first: Int32Array;
	second: Int32Array;
	seen: Uint8Array;
	touched: Int32Array;
}
let links: Links | undefined;

function linksFor(size: number): Links {
	if (!links || links.size !== size)
		links = {
			size,
			first: new Int32Array(size).fill(-1),
			second: new Int32Array(size).fill(-1),
			seen: new Uint8Array(size),
			touched: new Int32Array(size)
		};
	return links;
}

/*
 * The segments of a cell by its case: bit 8 for the top left corner below the level, 4 top right, 2 bottom right,
 * 1 bottom left; the cell's edges are 0 top, 1 right, 2 bottom, 3 left. Cases 5 and 10, two opposite corners below,
 * are settled by the cell's mean, below the level or not.
 */
const SEGMENTS: number[][] = [
	[],
	[3, 2],
	[2, 1],
	[3, 1],
	[0, 1],
	[], // 5, settled below
	[0, 2],
	[0, 3],
	[0, 3],
	[0, 2],
	[], // 10, settled below
	[0, 1],
	[3, 1],
	[2, 1],
	[3, 2],
	[]
];
const SADDLE_JOINED: Record<number, number[]> = {
	// the mean below the level joins the corners below: the two above are cut off
	5: [0, 3, 1, 2],
	10: [0, 1, 3, 2]
};
const SADDLE_APART: Record<number, number[]> = {
	// the mean above: the two corners below are cut off
	5: [0, 1, 3, 2],
	10: [0, 3, 1, 2]
};

/**
 * The lines of Φ = level on a sampled grid, by marching squares: closed loops, each a flat list x0, y0, x1, y1, …
 * in metres, the last point joining the first. Each crossing is placed on its cell's edge by linear interpolation.
 */
export function isolines(g: Grid, level: number): Float64Array[] {
	const { nx, ny, values, min, max } = g;
	// horizontal edges (i, j)–(i + 1, j) are numbered j nx + i; vertical edges (i, j)–(i, j + 1) nx ny + j nx + i
	const L = linksFor(2 * nx * ny);
	let touchedCount = 0;
	const join = (e: number, f: number) => {
		if (L.first[e] < 0) {
			L.first[e] = f;
			L.touched[touchedCount++] = e;
		} else L.second[e] = f;
		if (L.first[f] < 0) {
			L.first[f] = e;
			L.touched[touchedCount++] = f;
		} else L.second[f] = e;
	};
	const V = nx * ny;
	for (let j = 0; j < ny - 1; j++)
		for (let i = 0; i < nx - 1; i++) {
			const c = j * (nx - 1) + i;
			if (!(min[c] < level && max[c] >= level)) continue;
			const k = j * nx + i;
			const tl = values[k];
			const tr = values[k + 1];
			const br = values[k + nx + 1];
			const bl = values[k + nx];
			const kind =
				(tl < level ? 8 : 0) | (tr < level ? 4 : 0) | (br < level ? 2 : 0) | (bl < level ? 1 : 0);
			const edges = [k, V + k + 1, k + nx, V + k];
			const segs =
				kind === 5 || kind === 10
					? (tl + tr + br + bl) / 4 < level
						? SADDLE_JOINED[kind]
						: SADDLE_APART[kind]
					: SEGMENTS[kind];
			for (let s = 0; s < segs.length; s += 2) join(edges[segs[s]], edges[segs[s + 1]]);
		}

	const at = (e: number, out: number[]) => {
		if (e < V) {
			const i = e % nx;
			const j = (e - i) / nx;
			const a = values[e];
			const t = (level - a) / (values[e + 1] - a);
			out.push(g.left + (i - 1 + t) * g.hx, g.top - (j - 1) * g.hy);
		} else {
			const k = e - V;
			const i = k % nx;
			const j = (k - i) / nx;
			const a = values[k];
			const t = (level - a) / (values[k + nx] - a);
			out.push(g.left + (i - 1) * g.hx, g.top - (j - 1 + t) * g.hy);
		}
	};

	const loops: Float64Array[] = [];
	for (let n = 0; n < touchedCount; n++) {
		const start = L.touched[n];
		if (L.seen[start]) continue;
		const pts: number[] = [];
		let prev = -1;
		let cur = start;
		while (cur >= 0 && !L.seen[cur]) {
			L.seen[cur] = 1;
			at(cur, pts);
			const next = L.first[cur] !== prev ? L.first[cur] : L.second[cur];
			prev = cur;
			cur = next;
		}
		loops.push(Float64Array.from(pts));
	}
	for (let n = 0; n < touchedCount; n++) {
		const e = L.touched[n];
		L.first[e] = -1;
		L.second[e] = -1;
		L.seen[e] = 0;
	}
	return loops;
}

/**
 * The drawn length of the field's arrow, in units of `perDecade`: logarithmic, zero at `floor` m s⁻² and one unit
 * longer for each factor of ten above it, so that a field a thousand times stronger is three units longer, not a
 * thousand times. Never negative.
 */
export const arrowLength = (size: number, floor: number, perDecade: number) =>
	size > floor ? perDecade * Math.log10(size / floor) : 0;
