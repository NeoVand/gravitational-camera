/**
 * The numbers of the figure "image charge", chapter 2.4's Dirichlet Green's functions by images and the skin of
 * balayage. Points lie in the plane of the cut, x to the right and y up.
 *
 * The ball, in units of its radius R = 1. A unit source at s inside it has the Kelvin image s* = R² s/s² outside,
 * of weight R/s and the opposite sign, and
 *
 *   4π 𝒢_D(s, x) = −1/|x − s| + (R/s)/|x − s*|
 *
 * vanishes on the whole sphere. Its slope along the outward normal is the Poisson kernel of the ball,
 *
 *   P(x, s) = (R² − s²)/4πR|x − s|³,
 *
 * written here in units of 1/4πR² as (1 − t²)/(1 − 2tμ + t²)^(3/2), with t = s/R and μ the cosine of the angle
 * between x and s. A nugget of mass m at s and a skin of surface density σ = mP on the sphere pull alike outside.
 *
 * The plane, in metres. A unit source at x = (a, z) above the plane has the mirror image x* = (a, −z), of the
 * opposite sign, and 4π𝒢_D = −1/|y − x| + 1/|y − x*| vanishes on the plane. Its Poisson kernel is
 * P_z(a) = z/2π(a² + z²)^(3/2), in m⁻².
 *
 * The skin's potential outside is found here by quadrature over the sphere in three dimensions, as rings about the
 * nugget's axis whose potential is a complete elliptic integral, so that the figure can show it lying on the
 * nugget's, not assume it.
 */

import type { Grid } from './potential-map';

export interface Point {
	x: number;
	y: number;
}

/** The nugget's distance from the centre, in units of R: where the figure opens, and how far out it may go. */
export const S_OPEN = 0.5;
export const S_MOST = 0.95;

/** The plane's source: where it opens and how high it may go, m. */
export const Z_OPEN = 0.5;
export const Z_LEAST = 0.4;
export const Z_MOST = 2;

// --- the ball: Kelvin's image and the Poisson kernel ---------------------------------------------------------------

/**
 * The Kelvin image of a point s inside the ball: on the same ray at R²/s, of weight R/s. At the centre it has gone
 * to infinity, and `at` is undefined.
 */
export function kelvinImage(s: Point): { at: Point | undefined; distance: number; weight: number } {
	const r = Math.hypot(s.x, s.y);
	if (r === 0) return { at: undefined, distance: Infinity, weight: Infinity };
	const k = 1 / (r * r);
	return { at: { x: s.x * k, y: s.y * k }, distance: 1 / r, weight: 1 / r };
}

/**
 * 4π𝒢_D(s, p) = −1/|p − s| + (R/s)/|p − s*|, in units of 1/R: zero on the sphere. With s at the centre, the image's
 * term is its limit, the constant 1/R.
 */
export function ballGreen(p: Point, s: Point): number {
	const source = -1 / Math.hypot(p.x - s.x, p.y - s.y);
	const img = kelvinImage(s);
	if (!img.at) return source + 1;
	return source + img.weight / Math.hypot(p.x - img.at.x, p.y - img.at.y);
}

/** The two terms of 4π𝒢_D at a point p: the source's, −1/|p − s|, and its image's, +(R/s)/|p − s*|. */
export function ballTerms(p: Point, s: Point): { source: number; image: number } {
	const img = kelvinImage(s);
	return {
		source: -1 / Math.hypot(p.x - s.x, p.y - s.y),
		image: img.at ? img.weight / Math.hypot(p.x - img.at.x, p.y - img.at.y) : 1
	};
}

/** The Poisson kernel of the ball, in units of 1/4πR²: (1 − t²)/(1 − 2tμ + t²)^(3/2). */
export function ballKernel(mu: number, t: number): number {
	return (1 - t * t) / Math.max(1e-300, 1 - 2 * t * mu + t * t) ** 1.5;
}

/** The kernel over the source, its largest: (1 + t)/(1 − t)², 6 at t = 1/2 and 190 at t = 0.9. */
export const kernelTop = (t: number) => (1 + t) / (1 - t) ** 2;

/** The kernel opposite the source, its least: (1 − t)/(1 + t)², 0.22 at t = 1/2. */
export const kernelBottom = (t: number) => (1 - t) / (1 + t) ** 2;

/**
 * The circle on which |p − b| = k |p − a| (Apollonius), as its centre and radius, for k ≠ 1. For a = s, b = s* and
 * k = R/s it is the ball's own circle, centre 0 and radius R.
 */
export function apollonius(a: Point, b: Point, k: number): { centre: Point; radius: number } {
	const k2 = k * k;
	const d = 1 - k2;
	const centre = { x: (b.x - k2 * a.x) / d, y: (b.y - k2 * a.y) / d };
	const c = (b.x * b.x + b.y * b.y - k2 * (a.x * a.x + a.y * a.y)) / d;
	return { centre, radius: Math.sqrt(Math.max(0, centre.x ** 2 + centre.y ** 2 - c)) };
}

// --- the plane: the mirror image and the half-space kernel -------------------------------------------------------

/** 4π𝒢_D(x, p) above the plane: −1/|p − x| + 1/|p − x*|, in m⁻¹, x* the mirror image of x below the plane. */
export function planeGreen(p: Point, x: Point): number {
	return -1 / Math.hypot(p.x - x.x, p.y - x.y) + 1 / Math.hypot(p.x - x.x, p.y + x.y);
}

/** The Poisson kernel of the half-space, P_z(a) = z/2π(a² + z²)^(3/2), in m⁻². */
export function planeKernel(a: number, z: number): number {
	return z / (2 * Math.PI * (a * a + z * z) ** 1.5);
}

/** The half-space kernel's full width at half its height: 2z√(2^(2/3) − 1) = 1.53z. */
export const planeWidth = (z: number) => 2 * z * Math.sqrt(2 ** (2 / 3) - 1);

// --- quadrature ----------------------------------------------------------------------------------------------------

/** The nodes and weights of Gauss–Legendre quadrature on [−1, 1], by Newton's method on P_n. */
function legendre(n: number): { x: Float64Array; w: Float64Array } {
	const x = new Float64Array(n);
	const w = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		let z = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
		let dp = 1;
		for (let it = 0; it < 100; it++) {
			let p0 = 1;
			let p1 = z;
			for (let l = 2; l <= n; l++) {
				const p2 = ((2 * l - 1) * z * p1 - (l - 1) * p0) / l;
				p0 = p1;
				p1 = p2;
			}
			dp = (n * (z * p1 - p0)) / (z * z - 1);
			const dz = p1 / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-16) break;
		}
		x[i] = z;
		w[i] = 2 / ((1 - z * z) * dp * dp);
	}
	return { x, w };
}

const GAUSS = legendre(8);

/**
 * The panels for an integral over μ = cos γ from −1 to 1: widths shrinking geometrically toward μ = 1, where the
 * kernel is sharpest, down to `finest`, and toward μ = −1, down to 10⁻⁴, so that a ring near either pole is resolved
 * along the arc; none wider than `widest`.
 */
function panels(finest: number, widest: number): number[] {
	const grade = (least: number) => {
		const out: number[] = [];
		let at = 0;
		let gap = least;
		while (at + gap < 1) {
			at += gap;
			out.push(at);
			gap = Math.min(gap * 1.5, widest);
		}
		return out;
	};
	const top = grade(finest);
	const bottom = grade(1e-4);
	// the two gradings meet where the gaps from each end are alike
	const fromTop = top.filter((d) => d < 1);
	const edges = new Set<number>([-1, 1]);
	for (const d of fromTop) if (1 - d > 0) edges.add(1 - d);
	for (const d of bottom) if (-1 + d < 0) edges.add(-1 + d);
	const sorted = [...edges].sort((p, q) => p - q);
	// drop edges closer than a tenth of the finest to the one before them
	return sorted.filter((v, i) => i === 0 || v - sorted[i - 1] > finest / 10 || v === 1);
}

/** ∫ f(μ) dμ from −1 to 1 on panels graded toward μ = 1. */
function integrateMu(f: (mu: number) => number, finest = 1e-6, widest = 0.04): number {
	const e = panels(finest, widest);
	let sum = 0;
	for (let k = 0; k + 1 < e.length; k++) {
		const mid = (e[k] + e[k + 1]) / 2;
		const half = (e[k + 1] - e[k]) / 2;
		for (let i = 0; i < GAUSS.x.length; i++) sum += half * GAUSS.w[i] * f(mid + half * GAUSS.x[i]);
	}
	return sum;
}

/**
 * The kernel's integral over the sphere, by quadrature: ∮P dA = ½∫ (1 − t²)/(1 − 2tμ + t²)^(3/2) dμ in these
 * units. It is 1; the figure shows the quadrature's own value.
 */
export function kernelIntegral(t: number): number {
	return 0.5 * integrateMu((mu) => ballKernel(mu, t));
}

/** The half-space kernel's integral over the plane, by quadrature in a = z tan θ: 2π∫P_z a da = ∫ sin θ dθ = 1. */
export function planeKernelIntegral(z: number): number {
	// a = z tan θ, da = z sec²θ dθ: 2π P_z a da = sin θ dθ, integrated from 0 to π/2 on 64 panels
	const n = 64;
	const h = Math.PI / 2 / n;
	let sum = 0;
	for (let k = 0; k < n; k++) {
		const mid = (k + 0.5) * h;
		for (let i = 0; i < GAUSS.x.length; i++) {
			const th = mid + (h / 2) * GAUSS.x[i];
			const a = z * Math.tan(th);
			const da = z / Math.cos(th) ** 2;
			sum += (h / 2) * GAUSS.w[i] * 2 * Math.PI * planeKernel(a, z) * a * da;
		}
	}
	return sum;
}

// --- the skin: rings about the nugget's axis -----------------------------------------------------------------------

/**
 * The skin as rings about the nugget's axis: for each, its place along the axis (μ = cos γ, in units of R), its radius
 * √(1 − μ²) and its share of the mass, from Gauss–Legendre quadrature in μ on panels graded toward the nugget.
 */
export interface Rings {
	t: number;
	mu: Float64Array;
	radius: Float64Array;
	mass: Float64Array;
}

export function skinRings(t: number): Rings {
	const e = panels(Math.min(1e-4, ((1 - t) * (1 - t)) / 8), 0.04);
	const n = (e.length - 1) * GAUSS.x.length;
	const mu = new Float64Array(n);
	const radius = new Float64Array(n);
	const mass = new Float64Array(n);
	let j = 0;
	for (let k = 0; k + 1 < e.length; k++) {
		const mid = (e[k] + e[k + 1]) / 2;
		const half = (e[k + 1] - e[k]) / 2;
		for (let i = 0; i < GAUSS.x.length; i++) {
			const m = mid + half * GAUSS.x[i];
			mu[j] = m;
			radius[j] = Math.sqrt(Math.max(0, 1 - m * m));
			// σ dA = m P · 2πR² dμ = ½ (1 − t²)/(…)^(3/2) dμ in units of m
			mass[j] = 0.5 * half * GAUSS.w[i] * ballKernel(m, t);
			j++;
		}
	}
	return { t, mu, radius, mass };
}

/** The skin's mass by its rings: 1 to the quadrature's accuracy. */
export function ringsMass(r: Rings): number {
	let sum = 0;
	for (let i = 0; i < r.mass.length; i++) sum += r.mass[i];
	return sum;
}

/** The complete elliptic integral of the first kind K(m), m = k², by the arithmetic–geometric mean. */
export function ellipticK(m: number): number {
	let a = 1;
	let b = Math.sqrt(Math.max(0, 1 - m));
	for (let i = 0; i < 40 && Math.abs(a - b) > 1e-15 * a; i++) {
		const c = (a + b) / 2;
		b = Math.sqrt(a * b);
		a = c;
	}
	return Math.PI / (2 * a);
}

/**
 * The skin's potential at the point that lies `along` the nugget's axis and `off` it, in units of Gm/R: each ring of
 * mass w, radius ρ' and place z' gives −w (2/π) K(k²)/√((ρ + ρ')² + (z − z')²), k² = 4ρρ'/((ρ + ρ')² + (z − z')²).
 */
export function skinPotentialAxial(r: Rings, along: number, off: number): number {
	let sum = 0;
	const rho = Math.abs(off);
	for (let i = 0; i < r.mu.length; i++) {
		const dz = along - r.mu[i];
		const sr = rho + r.radius[i];
		const q = sr * sr + dz * dz;
		const m = (4 * rho * r.radius[i]) / q;
		sum -= (r.mass[i] * (2 / Math.PI) * ellipticK(m)) / Math.sqrt(q);
	}
	return sum;
}

/** The nugget's direction: a unit vector toward s, or up when s is at the centre. */
export function axisOf(s: Point): Point {
	const r = Math.hypot(s.x, s.y);
	return r > 0 ? { x: s.x / r, y: s.y / r } : { x: 0, y: 1 };
}

/** The skin's potential at a point p of the cut, the nugget at s, in units of Gm/R. */
export function skinPotential(r: Rings, s: Point, p: Point): number {
	const e = axisOf(s);
	const along = p.x * e.x + p.y * e.y;
	const off = p.x * e.y - p.y * e.x;
	return skinPotentialAxial(r, along, off);
}

/** The nugget's potential, −Gm/|p − s|, in units of Gm/R. */
export function nuggetPotential(s: Point, p: Point): number {
	return -1 / Math.hypot(p.x - s.x, p.y - s.y);
}

/**
 * The radii, in units of R, of the nugget's equipotentials the figure draws: circles about the nugget on which its
 * potential is −Gm/d, each a quarter wider than the last. Only their parts outside the ball are drawn.
 */
export const EQUIPOTENTIALS = [0.64, 0.8, 1, 1.25, 1.5625, 1.953125, 2.44140625];

/**
 * The skin's own equipotential at the level −Gm/d, found along rays from the nugget by the secant method on the
 * skin's potential, at `count` angles. Points within `clear` of the centre are left out, so the line breaks where it
 * would enter the ball; the result is a list of open runs of points (closed into a loop when unbroken).
 */
export function skinLine(
	r: Rings,
	s: Point,
	d: number,
	clear: number,
	count = 120
): { runs: Point[][]; closed: boolean } {
	const level = -1 / d;
	const runs: Point[][] = [];
	let run: Point[] = [];
	let broken = false;
	let firstPoint: Point | undefined;
	for (let k = 0; k < count; k++) {
		const th = (2 * Math.PI * k) / count;
		const c = Math.cos(th);
		const sn = Math.sin(th);
		const at = (rr: number) => ({ x: s.x + rr * c, y: s.y + rr * sn });
		const f = (rr: number) => skinPotential(r, s, at(rr)) - level;
		let r0 = d;
		let f0 = f(r0);
		if (Math.hypot(at(r0).x, at(r0).y) < clear) {
			broken = true;
			if (run.length) runs.push(run);
			run = [];
			continue;
		}
		if (Math.abs(f0) > 1e-12 * Math.abs(level)) {
			let r1 = d * (1 + 1e-3);
			let f1 = f(r1);
			for (let it = 0; it < 30 && Math.abs(f1) > 1e-12 * Math.abs(level); it++) {
				const r2 = r1 - (f1 * (r1 - r0)) / (f1 - f0);
				r0 = r1;
				f0 = f1;
				r1 = r2;
				f1 = f(r1);
			}
			r0 = r1;
		}
		const p = at(r0);
		if (Math.hypot(p.x, p.y) < clear) {
			broken = true;
			if (run.length) runs.push(run);
			run = [];
			continue;
		}
		if (k === 0) firstPoint = p;
		run.push(p);
	}
	if (run.length) {
		// a run that reaches the last angle continues into the first, if the line was broken in between
		if (broken && runs.length && runs[0][0] === firstPoint) runs[0] = [...run, ...runs[0]];
		else runs.push(run);
	}
	return { runs, closed: !broken };
}

/** The skin's potential and the nugget's at a point outside, and how far apart they are, relative to the nugget's. */
export function compareAt(r: Rings, s: Point, q: Point) {
	const skin = skinPotential(r, s, q);
	const nugget = nuggetPotential(s, q);
	return { skin, nugget, apart: Math.abs(skin - nugget) / Math.abs(nugget) };
}

// --- shading: steps that double ----------------------------------------------------------------------------------

/** The steps the ball's kernel and the skin are shaded in, in units of 1/4πR²: each twice the last, from 1/16 and
 * below to 128 and above. */
export const STEP_LEAST = -4;
export const STEP_MOST = 7;
/** The steps the half-space kernel is shaded in, in m⁻²: from 1/256 and below to 1 and above. */
export const PLANE_LEAST = -8;
export const PLANE_MOST = 0;

/** The step of a value: k for 2^k ≤ v < 2^(k+1), held within the steps drawn. */
export function stepOf(v: number, least = STEP_LEAST, most = STEP_MOST): number {
	if (!(v > 0)) return least;
	return Math.max(least, Math.min(most, Math.floor(Math.log2(v) + 1e-12)));
}

/**
 * The ball's kernel as a band just inside the sphere, from radius `inner` to 1, in arcs grouped by step: a path for
 * each step from STEP_LEAST to STEP_MOST, in units of R, the source on the +x axis and y up.
 */
export function ballBands(t: number, inner = 0.9, pieces = 180): string[] {
	const out: string[][] = Array.from({ length: STEP_MOST - STEP_LEAST + 1 }, () => []);
	const n = (v: number) => String(Math.round(v * 1e4) / 1e4);
	for (let i = 0; i < pieces; i++) {
		const a0 = (2 * Math.PI * i) / pieces;
		const a1 = (2 * Math.PI * (i + 1)) / pieces;
		const k = stepOf(ballKernel(Math.cos((a0 + a1) / 2), t)) - STEP_LEAST;
		const [c0, s0, c1, s1] = [Math.cos(a0), Math.sin(a0), Math.cos(a1), Math.sin(a1)];
		out[k].push(
			`M${n(c0)} ${n(s0)}A1 1 0 0 1 ${n(c1)} ${n(s1)}L${n(inner * c1)} ${n(inner * s1)}` +
				`A${inner} ${inner} 0 0 0 ${n(inner * c0)} ${n(inner * s0)}z`
		);
	}
	return out.map((p) => p.join(''));
}

/**
 * The half-space kernel as a band just under the plane, from a = −half to half, `depth` deep, in strips grouped by
 * step (in m⁻²), the source above a = 0: a path for each step, in metres, y up.
 */
export function planeBands(z: number, half: number, depth: number, pieces = 208): string[] {
	const out: string[][] = Array.from({ length: PLANE_MOST - PLANE_LEAST + 1 }, () => []);
	const n = (v: number) => String(Math.round(v * 1e4) / 1e4);
	const w = (2 * half) / pieces;
	for (let i = 0; i < pieces; i++) {
		const a = -half + i * w;
		const k = stepOf(planeKernel(a + w / 2, z), PLANE_LEAST, PLANE_MOST) - PLANE_LEAST;
		out[k].push(`M${n(a)} 0h${n(w)}v${n(-depth)}h${n(-w)}z`);
	}
	return out.map((p) => p.join(''));
}

// --- the level lines of the Green's function ---------------------------------------------------------------------

/** The levels of 4π𝒢_D the figure draws, in units of 1/R (the ball) or m⁻¹ (the plane): negative round the source,
 * positive round its image, and zero, which falls on the boundary. */
export const GREEN_LEVELS = [-4, -2, -1, -0.5, -0.25, 0, 0.25, 0.5, 1, 2, 4];

/**
 * Fill a grid (./potential-map's) with a function, in place, held within ±cap, the ring of nodes outside the frame at
 * zero, and return it; its lines are then traced by ./potential-map's `isolines`.
 */
export function sampleField(g: Grid, f: (p: Point) => number, cap: number): Grid {
	const { nx, ny, values, min, max } = g;
	const p = { x: 0, y: 0 };
	for (let j = 0; j < ny; j++) {
		p.y = g.top - (j - 1) * g.hy;
		for (let i = 0; i < nx; i++) {
			if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) {
				values[j * nx + i] = 0;
				continue;
			}
			p.x = g.left + (i - 1) * g.hx;
			const v = f(p);
			values[j * nx + i] = Number.isFinite(v)
				? Math.max(-cap, Math.min(cap, v))
				: v > 0
					? cap
					: -cap;
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
