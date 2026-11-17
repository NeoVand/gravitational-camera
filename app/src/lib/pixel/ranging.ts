/**
 * How far away is a wave source (paper, Eqs. ranging-instant, ranging-C, helicity-split), for two masses turning in
 * a circle seen by one pixel at reduced distance kr and inclination iota, with signal-to-noise ratio rho over a
 * cycle. The leading-order laws, which the reference implementation checks against the exact field of the pair
 * (paper, Fig. ranging); the errors are the first-order propagation of white noise. Used by the demo "How far is
 * that binary?" (routes/demo/ranging).
 */

/** C(iota, theta) in s2/s1 = C/(kr)^2 at one instant (theta the phase of the wave). */
export function rankConstant(iota: number, theta: number): number {
	const ci = Math.cos(iota),
		si = Math.sin(iota);
	const ct = Math.cos(theta),
		st = Math.sin(theta);
	const A = (1 - 3 * ci * ci) * ct * ct - 4 * ci * ci * st * st;
	const B = 2 * ci * st * ct;
	const D = (1 + ci * ci) ** 2 * ct * ct + 4 * ci * ci * st * st;
	return (2 * si * si * Math.hypot(A, B)) / D;
}

/** The angle between the directions read from the two frequency parts: 8 |cot iota| / kr. */
export function helicitySplit(iota: number, kr: number): number {
	return (8 * Math.abs(Math.cos(iota) / Math.sin(iota))) / kr;
}

/** How the signal divides between the two frequency parts: amplitudes (1 +- cos iota)^2, normalized. */
export function partShares(iota: number): [number, number] {
	const a = (1 + Math.cos(iota)) ** 2,
		b = (1 - Math.cos(iota)) ** 2;
	const n = Math.hypot(a, b);
	return [a / n, b / n];
}

export interface Range {
	/** the quantity read, and its standard deviation */
	value: number;
	sigma: number;
	/** kr estimated, and its standard deviation (Infinity if the reading is lost in the noise) */
	kr: number;
	krSigma: number;
}

/**
 * Ranging from the split of directions: each part's direction is read to 1/rho_part per axis (the spin-2 bound), so
 * the angle between them to sqrt(1/rho_+^2 + 1/rho_-^2); kr = 8 |cot iota| / angle.
 */
export function fromSplit(iota: number, kr: number, rho: number): Range {
	const [a, b] = partShares(iota);
	const sigma = Math.sqrt(1 / (rho * a) ** 2 + 1 / (rho * b) ** 2);
	const value = helicitySplit(iota, kr);
	const k = 8 * Math.abs(Math.cos(iota) / Math.sin(iota));
	return { value, sigma, kr, krSigma: value > sigma ? (kr * kr * sigma) / k : Infinity };
}

/**
 * Ranging from the departure from rank one: s2/s1 = C/(kr)^2 is read to about 1/rho, so kr = sqrt(C / (s2/s1)) to
 * relative error (kr^2 / C) / (2 rho). Averaged over the cycle's phases.
 */
export function fromRank(iota: number, kr: number, rho: number): Range {
	let C = 0;
	for (let i = 0; i < 64; i++) C += rankConstant(iota, (Math.PI * i) / 64) / 64;
	const value = C / (kr * kr);
	const sigma = 1 / rho;
	return { value, sigma, kr, krSigma: value > sigma ? (kr * sigma) / (2 * value) : Infinity };
}

/** The farthest kr each method reaches (where its signal equals its noise). */
export function reach(iota: number, rho: number): { split: number; rank: number } {
	const [a, b] = partShares(iota);
	const sigma = Math.sqrt(1 / (rho * a) ** 2 + 1 / (rho * b) ** 2);
	let C = 0;
	for (let i = 0; i < 64; i++) C += rankConstant(iota, (Math.PI * i) / 64) / 64;
	return {
		split: (8 * Math.abs(Math.cos(iota) / Math.sin(iota))) / sigma,
		rank: Math.sqrt(C * rho)
	};
}
