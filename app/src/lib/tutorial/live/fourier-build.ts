/**
 * The numbers of chapter 2.6's narrow bump rebuilt from ripples, for its live figure. The bump is the chapter's
 * Gaussian of width ε and area 1, δ_ε(x) = e^{−x²/2ε²}/(√(2π) ε), with x and ε in metres. A Fourier series needs a
 * pattern that repeats, so the bump is repeated every L = 1 m, and the series of eq:series rebuilds that repeating
 * pattern from the ripples e^{ik_n x} with k_n = 2πn/L.
 *
 * "The sum of the first N ripples" is the partial sum
 *
 *   f_N(x) = Σ_{n=−N}^{N} c_n e^{ik_n x} = 1/L + (2/L) Σ_{n=1}^{N} e^{−ε²k_n²/2} cos k_n x,
 *
 * the mean and the ripples k_1 … k_N, each with its partner at −k_n. Its coefficients are exactly the transform of
 * eq:gauss-pair at the wavenumbers of the period, over L: c_n = δ̃_ε(k_n)/L = e^{−ε²k_n²/2}/L, because the integral
 * of the repeated bump over one period is the integral of one bump over the whole line. By the convolution theorem,
 * keeping |n| ≤ N is a blur of the repeated bump with the kernel D_N(x) = (1/L) Σ_{|n|≤N} e^{ik_n x} =
 * sin((2N+1)πx/L) / (L sin(πx/L)), a peak of width about L/(2N+1) with ripples on both sides: this is why a sum cut
 * short is wider than the bump and rings.
 */

/** The period, in metres. */
export const PERIOD = 1;
/** The most ripples the figure keeps. */
export const MOST = 60;
/** The widths ε the slider stops at, in metres, about even in their logarithm; 0.1 and 0.01 are the try's two. */
export const WIDTHS: readonly number[] = [
	0.01, 0.012, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.15
];
/** The opening state: the try's first width, and a sum close to the bump but still ringing. */
export const OPENING = { width: 0.1, ripples: 3 } as const;
/** The sum "matches" the bump when it differs from it nowhere by more than this share of the bump's height. */
export const MATCH = 0.01;

/** The wavenumber k_n = 2πn/L of the n-th ripple of the period, in m⁻¹. */
export const wavenumber = (n: number) => (2 * Math.PI * n) / PERIOD;

/** The transform of the bump, δ̃_ε(k) = e^{−ε²k²/2} (eq:gauss-pair), with no unit. */
export const transform = (eps: number, k: number) => Math.exp(-(eps * eps * k * k) / 2);

/** The Fourier coefficient of the repeated bump, c_n = δ̃_ε(k_n)/L, in m⁻¹. */
export const coefficient = (eps: number, n: number) => transform(eps, wavenumber(n)) / PERIOD;

/** The height of the bump at its centre, 1/(√(2π) ε), in m⁻¹. */
export const peak = (eps: number) => 1 / (Math.sqrt(2 * Math.PI) * eps);

/** The full width of the bump at half its height, 2√(2 ln 2) ε = 2.35 ε, in metres. */
export const bumpHalfWidth = (eps: number) => 2 * Math.sqrt(2 * Math.LN2) * eps;

/** The repeated bump Σ_j δ_ε(x − jL), in m⁻¹; three copies on each side are far more than enough for ε ≤ 0.15 m. */
export function bump(eps: number, x: number): number {
	let s = 0;
	for (let j = -3; j <= 3; j++) {
		const u = x - j * PERIOD;
		s += Math.exp(-(u * u) / (2 * eps * eps));
	}
	return s * peak(eps);
}

/** The partial sum f_N(x) of the mean and the first N ripples, in m⁻¹. */
export function partialSum(eps: number, n: number, x: number): number {
	let s = coefficient(eps, 0);
	for (let m = 1; m <= n; m++) s += 2 * coefficient(eps, m) * Math.cos(wavenumber(m) * x);
	return s;
}

/** The partial sum at many places at once, each ripple's cosine stepped by the angle-addition rule. */
export function partialSums(eps: number, n: number, xs: readonly number[]): number[] {
	const c = Array.from({ length: n + 1 }, (_, m) => coefficient(eps, m));
	return xs.map((x) => {
		const k = wavenumber(1) * x;
		const ck = Math.cos(k);
		const sk = Math.sin(k);
		let cos = 1;
		let sin = 0;
		let s = c[0];
		for (let m = 1; m <= n; m++) {
			const next = cos * ck - sin * sk;
			sin = sin * ck + cos * sk;
			cos = next;
			s += 2 * c[m] * cos;
		}
		return s;
	});
}

/** The kernel D_N(x) = (1/L) Σ_{|n|≤N} e^{ik_n x} of the blur that keeping N ripples does, in m⁻¹. */
export function kernel(n: number, x: number): number {
	const t = (Math.PI * x) / PERIOD;
	const below = Math.sin(t);
	if (Math.abs(below) < 1e-12) return (2 * n + 1) / PERIOD;
	return Math.sin((2 * n + 1) * t) / (PERIOD * below);
}

/** Evenly spaced places across one period, −L/2 to L/2, with x = 0 among them. */
function across(points: number): number[] {
	const half = Math.floor(points / 2);
	return Array.from({ length: 2 * half + 1 }, (_, i) => ((i - half) / (2 * half)) * PERIOD);
}

/** The largest gap between the sum and the bump over one period, as a share of the bump's height. */
export function gap(eps: number, n: number, points = 4001): number {
	const xs = across(points);
	const sums = partialSums(eps, n, xs);
	let most = 0;
	for (let i = 0; i < xs.length; i++) most = Math.max(most, Math.abs(sums[i] - bump(eps, xs[i])));
	return most / peak(eps);
}

/** The lowest value of the sum over one period, as a share of the bump's height: below zero, the sum rings. */
export function lowest(eps: number, n: number, points = 4001): number {
	return Math.min(...partialSums(eps, n, across(points))) / peak(eps);
}

/** The fewest ripples with which the sum matches the bump to within MATCH, or undefined if more than MOST are needed. */
export function ripplesNeeded(eps: number): number | undefined {
	for (let n = 0; n <= MOST; n++) if (gap(eps, n) < MATCH) return n;
	return undefined;
}

/**
 * The full width of the sum's central peak at half the sum's own height at x = 0, in metres: the first place on each
 * side where the sum falls to half, found by stepping out and then halving the step.
 */
export function sumHalfWidth(eps: number, n: number): number {
	const half = partialSum(eps, n, 0) / 2;
	const step = PERIOD / 4000;
	let x = 0;
	while (x < PERIOD / 2 && partialSum(eps, n, x + step) > half) x += step;
	if (x >= PERIOD / 2) return PERIOD;
	let lo = x;
	let hi = x + step;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		if (partialSum(eps, n, mid) > half) lo = mid;
		else hi = mid;
	}
	return lo + hi;
}
