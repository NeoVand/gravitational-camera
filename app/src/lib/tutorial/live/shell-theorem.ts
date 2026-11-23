/**
 * The numbers of chapter 1.3's shell theorem, for its live figure. A round body of radius R and mass M, in units
 * G = M = R = 1, whose density grows or falls as a power of the distance from the centre, ρ(r) ∝ (r/R)^p inside the
 * body, or which is a thin shell, the limit p → ∞. The figure draws the pull g = G M_enc(r)/r², the same for every
 * body outside it, and the moment of inertia, which differs from one body to the next.
 *
 * The mass within r is ∫ 4π r² ρ dr, finite only for p > −3, and with the whole mass M at r = R it is
 * M_enc(r) = M (r/R)^(p+3), so ρ(r) = (p+3) M/(4π R³) (r/R)^p. As p → −3 the mass gathers at the centre and the
 * body becomes a point; as p → ∞ it gathers at the surface and the body becomes a thin shell.
 */

/** A body: the power p of its density, or a thin shell. */
export type Body = number | 'shell';

/** The least and greatest powers the figure offers: the point mass and the shell are their limits. */
export const LEAST = -2.9;
export const MOST = 20;

/** The power of a uniform ball. */
export const BALL = 0;

/** M_enc(r)/M, the fraction of the mass within the distance r of the centre (r in units of R). */
export function massWithin(r: number, body: Body): number {
	if (r >= 1) return 1;
	if (r <= 0) return 0;
	if (body === 'shell') return 0;
	return r ** (body + 3);
}

/**
 * The pull g(r) = G M_enc(r)/r², in units of GM/R², pointing to the centre. At the centre it is the limit of
 * r^(p+1): zero for p > −1, the pull at the surface for p = −1, and without bound for p < −1.
 */
export function pull(r: number, body: Body): number {
	if (r > 0) return massWithin(r, body) / (r * r);
	if (body === 'shell' || body > -1) return 0;
	return body === -1 ? 1 : Infinity;
}

/** The density ρ(r), in units of M/R³, for a body with a power p, out to its surface (none beyond it). */
export function density(r: number, p: number): number {
	if (r > 1 || r < 0) return 0;
	return ((p + 3) / (4 * Math.PI)) * r ** p;
}

/**
 * The moment of inertia about an axis through the centre, in units of MR². A thin shell of radius r and mass dM has
 * the moment (2/3) r² dM, since its mass lies on average at x² + y² = (2/3) r² from the axis. With
 * dM = M (p+3) r^(p+2) dr, I = (2/3) ∫₀¹ (p+3) r^(p+4) dr = (2/3)(p+3)/(p+5): 2/5 for the uniform ball, 0 for the
 * point and 2/3 for the shell.
 */
export function inertia(body: Body): number {
	if (body === 'shell') return 2 / 3;
	return ((2 / 3) * (body + 3)) / (body + 5);
}

/**
 * The shading of the body cut through its centre: at each fraction t of the radius, from 0 to 1, how dense it is
 * against the densest part shown, 0 to 1. A density that grows without bound at the centre is measured against its
 * value at a twenty-fifth of the radius, so that the centre shows as a bright point rather than the whole disc as
 * pale. A shell has no inside; its shading is a thin rim at t = 1.
 */
export function shading(body: Body): { t: number; level: number }[] {
	if (body === 'shell')
		return [
			{ t: 0, level: 0 },
			{ t: 0.9, level: 0 },
			{ t: 0.93, level: 1 },
			{ t: 1, level: 1 }
		];
	const p = body;
	const inner = 0.04;
	const top = p >= 0 ? 1 : inner ** p;
	// even steps over the disc, and finer ones near the centre, where a falling density changes fastest
	const ts = [
		...Array.from({ length: 12 }, (_, i) => (0.1 * i * i) / 144),
		...Array.from({ length: 61 }, (_, i) => 0.1 + (0.9 * i) / 60)
	];
	return ts.map((t) => ({ t, level: t === 0 && p < 0 ? 1 : Math.min(1, t ** p / top) }));
}
