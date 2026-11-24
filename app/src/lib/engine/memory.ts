/**
 * The memory of a burst: chapter 7.8's eq:memory-axes, the paper's eq:memory written in the camera's axes,
 *
 *   Δh₊ = (2G/c⁴r) ∫ (dE/d²n̂′) (1 + cos β) cos 2ψ d²n̂′,
 *   Δh× = (2G/c⁴r) ∫ (dE/d²n̂′) (1 + cos β) sin 2ψ d²n̂′,
 *
 * with β the angle of the emission n̂′ from the camera's direction N̂ and ψ its azimuth round N̂, measured from e₁.
 *
 * A pattern here is the same all round an axis ẑ and is given per unit energy: dE/d²n̂′ = E f(cos θ′), θ′ the angle
 * of n̂′ from ẑ, with ∫ f d²n̂′ = 1. It has a smooth part, summed on a grid centred on the camera's direction
 * (Gauss–Legendre in v = cos β, even steps in ψ), and narrow jets along ±ẑ, each a point of the sum, where the
 * integrand is read at the jet's own direction. As in the chapter, e₁ lies on the side of ẑ, so
 * ẑ = cos θ N̂ + sin θ e₁ and cos θ′ = cos θ cos β + sin θ sin β cos ψ.
 *
 * Results are in units of GE/c⁴r, the chapter's; the paper's fig:memory(b) uses 4GE/c⁴r. For a pattern whose smooth
 * part is a polynomial in cos θ′ of degree d, the integrand is a polynomial in v of degree d + 1 times cos^k ψ cos 2ψ
 * with k ≤ d, so the sum is exact, to rounding, once the grid has (d + 2)/2 points in v and d + 3 in ψ.
 *
 * A jet that points straight at the camera has sin²β and 1 − cos β both zero; there ψ has no meaning and the memory is
 * zero by symmetry (the chapter's footnote on turns about N̂), and the camera is inside the jet. `memory` says so with
 * `inside` rather than dividing by zero.
 */

/** A narrow jet along +ẑ (1) or −ẑ (−1), carrying the share `share` of the energy. */
export interface Jet {
	along: 1 | -1;
	share: number;
}

/** A burst the same all round ẑ: a smooth part f(cos θ′), per unit energy and steradian, and jets along the axis. */
export interface Pattern {
	smooth?: (x: number) => number;
	jets?: Jet[];
}

/** The memory seen from one direction, in units of GE/c⁴r. */
export interface Memory {
	plus: number;
	cross: number;
	/** A jet points straight at the camera: its part is zero by symmetry, and the camera is inside it. */
	inside: boolean;
}

/** The grid of the sum: points in v = cos β and in ψ. */
export interface Grid {
	v: number;
	psi: number;
}

/** Enough for every pattern of the figure, polynomials of degree four at most, with room to spare. */
export const GRID: Grid = { v: 24, psi: 32 };

// --- the quadrature ------------------------------------------------------------------------------------------------

const rules = new Map<number, { x: Float64Array; w: Float64Array }>();

/** Gauss–Legendre nodes and weights on [−1, 1], n points: exact for polynomials of degree 2n − 1. */
export function gaussLegendre(n: number): { x: Float64Array; w: Float64Array } {
	const known = rules.get(n);
	if (known) return known;
	const x = new Float64Array(n);
	const w = new Float64Array(n);
	for (let i = 0; i < Math.ceil(n / 2); i++) {
		// Newton's method on P_n from the usual first guess, the i-th root from the top
		let z = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5));
		let dp = 0;
		for (let it = 0; it < 100; it++) {
			let p0 = 1;
			let p1 = z;
			for (let k = 2; k <= n; k++) {
				const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
				p0 = p1;
				p1 = p2;
			}
			const pn = n === 1 ? z : p1;
			const pm = n === 1 ? 1 : p0;
			dp = (n * (z * pn - pm)) / (z * z - 1);
			const dz = pn / dp;
			z -= dz;
			if (Math.abs(dz) < 1e-16) break;
		}
		x[i] = z;
		x[n - 1 - i] = -z;
		w[i] = w[n - 1 - i] = 2 / ((1 - z * z) * dp * dp);
	}
	rules.set(n, { x, w });
	return { x, w };
}

/** cos θ′ for the emission at (v = cos β, ψ) seen from a camera at θ from ẑ. */
export const cosFromAxis = (theta: number, v: number, psi: number) =>
	Math.cos(theta) * v + Math.sin(theta) * Math.sqrt(Math.max(0, 1 - v * v)) * Math.cos(psi);

/** A jet points straight at the camera when its direction is within this of N̂, radians. */
const ON_LINE = 1e-9;

/** The memory of a pattern seen from the angle θ (radians) from its axis, in units of GE/c⁴r. */
export function memory(p: Pattern, theta: number, grid: Grid = GRID): Memory {
	let plus = 0;
	let cross = 0;
	let inside = false;
	if (p.smooth) {
		const { x, w } = gaussLegendre(grid.v);
		const c = Math.cos(theta);
		const s = Math.sin(theta);
		const dpsi = (2 * Math.PI) / grid.psi;
		for (let k = 0; k < grid.psi; k++) {
			const psi = (k + 0.5) * dpsi;
			const cp = Math.cos(psi);
			const c2 = Math.cos(2 * psi);
			const s2 = Math.sin(2 * psi);
			let ring = 0;
			for (let i = 0; i < grid.v; i++) {
				const v = x[i];
				const f = p.smooth(c * v + s * Math.sqrt(Math.max(0, 1 - v * v)) * cp);
				ring += w[i] * f * (1 + v);
			}
			plus += ring * c2 * dpsi;
			cross += ring * s2 * dpsi;
		}
		plus *= 2;
		cross *= 2;
	}
	for (const j of p.jets ?? []) {
		// the jet's direction ±ẑ = ±(cos θ N̂ + sin θ e₁): cos β = ±cos θ, and ψ is 0 or π, so cos 2ψ = 1, sin 2ψ = 0
		const v = j.along * Math.cos(theta);
		if (Math.acos(Math.min(1, v)) < ON_LINE) {
			inside = true;
			continue;
		}
		plus += 2 * j.share * (1 + v);
	}
	return { plus, cross, inside };
}

/**
 * The paper's eq:memory as it stands, before the denominator cancels: the + and × parts of [n̂′n̂′/(1 − n̂′·N̂)]^TT in
 * the axes e₁, e₂ across N̂, ½(a² − b²)/(1 − n̂′·N̂) and ab/(1 − n̂′·N̂), with a = n̂′·e₁, b = n̂′·e₂.
 * Times 4GE/c⁴r it is the memory of one particle of energy E; eq:memory-axes is twice it, in units of GE/c⁴r.
 */
export function epsteinTT(
	n: readonly [number, number, number],
	N: readonly [number, number, number],
	e1: readonly [number, number, number],
	e2: readonly [number, number, number]
): [number, number] {
	const a = n[0] * e1[0] + n[1] * e1[1] + n[2] * e1[2];
	const b = n[0] * e2[0] + n[1] * e2[1] + n[2] * e2[2];
	const k = 1 - (n[0] * N[0] + n[1] * N[1] + n[2] * N[2]);
	return [(0.5 * (a * a - b * b)) / k, (a * b) / k];
}

/** The integral of f over the sphere, ∫ f d²n̂′ = 2π ∫ f(x) dx: 1 for a pattern per unit energy. */
export function total(p: Pattern, n = 32): number {
	let sum = 0;
	if (p.smooth) {
		const { x, w } = gaussLegendre(n);
		for (let i = 0; i < n; i++) sum += w[i] * p.smooth(x[i]);
		sum *= 2 * Math.PI;
	}
	for (const j of p.jets ?? []) sum += j.share;
	return sum;
}

/**
 * The share of a pattern in degrees ℓ ≥ 2, weighted by its square: with 4πf = Σ c_ℓ P_ℓ(cos θ′), the part of
 * ∫ (4πf)² d²n̂′ ∝ Σ c_ℓ²/(2ℓ + 1) that has ℓ ≥ 2. Zero for a sphere and a dipole, (q²/5)/(1 + q²/5) for 1 + qP₂. A
 * narrow jet holds every degree with c_ℓ = 2ℓ + 1, so the share tends to one as the jet narrows; it is one here.
 */
export function highShare(p: Pattern, n = 32): number {
	if (p.jets?.length) return 1;
	if (!p.smooth) return 0;
	const { x, w } = gaussLegendre(n);
	let c0 = 0;
	let c1 = 0;
	let square = 0;
	for (let i = 0; i < n; i++) {
		const g = 4 * Math.PI * p.smooth(x[i]);
		c0 += w[i] * g;
		c1 += w[i] * g * x[i];
		square += w[i] * g * g;
	}
	c0 *= 0.5;
	c1 *= 1.5;
	if (square <= 0) return 0;
	return Math.max(0, 1 - (2 * c0 * c0 + (2 / 3) * c1 * c1) / square);
}

// --- the patterns ------------------------------------------------------------------------------------------------

/** Legendre's P₂ and P₃. */
export const P2 = (x: number) => 0.5 * (3 * x * x - 1);
export const P3 = (x: number) => 0.5 * (5 * x * x * x - 3 * x);

const SPHERE = 1 / (4 * Math.PI);

/** All the energy in one narrow jet along ẑ. */
export const oneJet = (): Pattern => ({ jets: [{ along: 1, share: 1 }] });
/** Two opposite jets along ±ẑ, sharing the energy. */
export const twoJets = (): Pattern => ({
	jets: [
		{ along: 1, share: 0.5 },
		{ along: -1, share: 0.5 }
	]
});
/** The same in every direction, E/4π. */
export const sphere = (): Pattern => ({ smooth: () => SPHERE });
/** Brighter on one side, (E/4π)(1 + a cos θ′), |a| ≤ 1. */
export const dipole = (a: number): Pattern => ({ smooth: (x) => SPHERE * (1 + a * x) });
/** Stronger along the axis, (E/4π)(1 + qP₂(cos θ′)), −1 ≤ q ≤ 2. */
export const quadrupole = (q: number): Pattern => ({ smooth: (x) => SPHERE * (1 + q * P2(x)) });
/** The chapter's Stretch, (E/4π)(1 + q₃P₃(cos θ′)). */
export const octupole = (q3: number): Pattern => ({ smooth: (x) => SPHERE * (1 + q3 * P3(x)) });
/** A slow circular pair averaged over an orbit, ẑ its axis: (5E/8π)(1 + 6cos²θ′ + cos⁴θ′)/8. */
export const merger = (): Pattern => ({
	smooth: (x) => {
		const s = x * x;
		return ((5 / (8 * Math.PI)) * (1 + 6 * s + s * s)) / 8;
	}
});

// --- the chapter's closed forms, in units of GE/c⁴r ------------------------------------------------------------------

export const closed = {
	/** One narrow jet: 2(1 + cos θ) off its line. */
	oneJet: (theta: number) => 2 * (1 + Math.cos(theta)),
	/** Two opposite jets sharing E: 2, off their line. */
	twoJets: () => 2,
	sphere: () => 0,
	dipole: () => 0,
	/** 1 + qP₂: (q/2) sin²θ, the paper's eq:burst-memory. */
	quadrupole: (theta: number, q: number) => (q / 2) * Math.sin(theta) ** 2,
	/** 1 + q₃P₃: (q₃/2) sin²θ cos θ. */
	octupole: (theta: number, q3: number) => (q3 / 2) * Math.sin(theta) ** 2 * Math.cos(theta),
	/** The merger: sin²ι (17 + cos²ι)/24, the paper's eq:merger-memory. */
	merger: (iota: number) => (Math.sin(iota) ** 2 * (17 + Math.cos(iota) ** 2)) / 24
};
