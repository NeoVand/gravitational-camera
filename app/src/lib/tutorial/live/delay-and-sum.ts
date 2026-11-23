/**
 * Chapter 5.3's delay and sum, for a row of N pixels a distance b apart, with the source and the steered direction
 * in the plane of the row and its normal, at the angles θ and θ' from the normal. Lengths are in wavelengths, so
 * k = 2π. The chapter's array factor, eq:das,
 *
 *   𝒜_{n̂'}(n̂) = Σ_p e^{−ik(n̂ − n̂')·x_p},   (n̂ − n̂')·x_p = x_p (sin θ − sin θ'),
 *
 * is a sum of powers of e^{−iψ} with ψ = kb(sin θ − sin θ'), and |𝒜|² = sin²(Nψ/2)/sin²(ψ/2). The chapter puts the
 * pixels at x_p = pb, p = 0 … N − 1. Here the phase of every wave is referred to the middle of the row, x_p =
 * (p − (N − 1)/2) b, which multiplies 𝒜 by a phase and leaves |𝒜|² as it was; it makes 𝒜 real, the chapter's
 * amplitude pattern a, so that two sources "in step" have equal phases at the middle of the row, as the chapter's
 * real a₁ and a₂ assume. Everything here is exact: the patterns are closed forms, and the widths and the dip are
 * found on them by bisection and by search.
 *
 * Two equal sources whose second runs ahead by the phase φ give the image |a₁ + e^{iφ}a₂|² = a₁² + a₂² +
 * 2a₁a₂ cos φ. Averaged over a set of phases, only the mean of cos φ enters: 1 for sources in step, 0 for the exact
 * average over every phase, and the mean of the last few random phases for the figure's running average.
 */

const DEG = Math.PI / 180;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** The number of pixels, from 2 to 32. */
export const COUNT = { min: 2, max: 32, step: 1 };
/** The spacing b in wavelengths, from λ/4 to 3λ. */
export const SPACING = { min: 0.25, max: 3, step: 0.05 };
/** Where the figure opens: 16 pixels λ/2 apart, one source at 20°, steered to 20°. */
export const OPENING = { N: 16, b: 0.5, theta: 20, steer: 20 };
/** The spacing of the first prediction, two wavelengths. */
export const SPREAD = 2;
/** The separation of the second prediction, in λ/D. */
export const PAIR = 1.2;
/** The chapter's rule: a pair counts as separated when the middle falls to 0.8 of the peaks, a dip of a fifth. */
export const DIP_RULE = 0.8;
/** The running average of the sources out of step is over this many frames. */
export const FRAMES = 50;

// --- the row ---------------------------------------------------------------------------------------------------

/** The width D = Nb, in wavelengths. */
export const aperture = (N: number, b: number) => N * b;

/** The pixels' places along the row, in wavelengths, from its middle: x_p = (p − (N − 1)/2) b. */
export const positions = (N: number, b: number) =>
	Array.from({ length: N }, (_, p) => (p - (N - 1) / 2) * b);

/** ψ = kb(sin θ − sin θ'), for the sines s and s' of the two angles. */
export const psiOf = (b: number, s: number, sSteer: number) => 2 * Math.PI * b * (s - sSteer);

/**
 * The array factor of the centred row, real: Σ_p e^{−i(p − (N − 1)/2)ψ} = sin(Nψ/2)/sin(ψ/2). At the grating
 * lobes, where sin(ψ/2) = 0, its limit is N cos(Nψ/2)/cos(ψ/2), which is ±N.
 */
export function dirichlet(N: number, psi: number) {
	const den = Math.sin(psi / 2);
	if (Math.abs(den) < 1e-9) return (N * Math.cos((N * psi) / 2)) / Math.cos(psi / 2);
	return Math.sin((N * psi) / 2) / den;
}

/** The amplitude pattern a = 𝒜/N of one source at θ, steered to θ' (degrees): 1 when θ' = θ. */
export const amplitude = (N: number, b: number, theta: number, steer: number) =>
	dirichlet(N, psiOf(b, Math.sin(theta * DEG), Math.sin(steer * DEG))) / N;

/** The beam pattern |𝒜|²/N² of one source. */
export const beam = (N: number, b: number, theta: number, steer: number) =>
	amplitude(N, b, theta, steer) ** 2;

/**
 * The chapter's sum itself, |Σ_p e^{−ik(sin θ − sin θ')pb}|² over p = 0 … N − 1, term by term: the check on the
 * closed form, whatever the origin.
 */
export function directSum(N: number, b: number, theta: number, steer: number) {
	const d = 2 * Math.PI * b * (Math.sin(theta * DEG) - Math.sin(steer * DEG));
	let re = 0;
	let im = 0;
	for (let p = 0; p < N; p++) {
		re += Math.cos(p * d);
		im -= Math.sin(p * d);
	}
	return re * re + im * im;
}

/**
 * The image of two equal sources at θ₁ and θ₂, steered to θ', divided by N² (the peak of one source alone), when
 * the mean of cos φ over the phases shown is c: (a₁² + a₂² + 2c a₁a₂). c = 1 in step, 0 for the exact average.
 */
export function pairImage(N: number, b: number, t1: number, t2: number, steer: number, c: number) {
	const a1 = amplitude(N, b, t1, steer);
	const a2 = amplitude(N, b, t2, steer);
	return a1 * a1 + a2 * a2 + 2 * c * a1 * a2;
}

// --- the main lobe ----------------------------------------------------------------------------------------------

/** The ψ at which |𝒜|²/N² falls to one half, between 0 and its first zero 2π/N, by bisection. */
export function halfPsi(N: number) {
	let lo = 0;
	let hi = (2 * Math.PI) / N;
	for (let i = 0; i < 80; i++) {
		const mid = (lo + hi) / 2;
		if ((dirichlet(N, mid) / N) ** 2 > 0.5) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/**
 * The main lobe's full width at half height, in degrees of θ', for the source at θ: the half heights lie at
 * sin θ' = sin θ ± ψ½/kb. Where one of them lies beyond the horizon the lobe is cut there, at ±90°, and `cut` says
 * so.
 */
export function mainLobe(N: number, b: number, theta: number) {
	const s = Math.sin(theta * DEG);
	const ds = halfPsi(N) / (2 * Math.PI * b);
	const lo = s - ds;
	const hi = s + ds;
	const cut = lo < -1 || hi > 1;
	const from = Math.asin(clamp(lo, -1, 1)) / DEG;
	const to = Math.asin(clamp(hi, -1, 1)) / DEG;
	return { width: to - from, from, to, cut, ds };
}

/** The first zero beside the main lobe lies at sin θ − sin θ' = λ/Nb = λ/D. */
export const firstZero = (N: number, b: number) => 1 / aperture(N, b);

// --- the grating lobes ------------------------------------------------------------------------------------------

/**
 * The copies of a source at θ: the directions θ' with sin θ − sin θ' = mλ/b, m = ±1, ±2, …, that lie within the
 * horizon. Sorted from the right-hand horizon to the left.
 */
export function gratingLobes(b: number, theta: number) {
	const s = Math.sin(theta * DEG);
	const out: { m: number; sin: number; angle: number }[] = [];
	const most = Math.ceil(2 * b) + 1;
	for (let m = -most; m <= most; m++) {
		if (m === 0) continue;
		const sin = s - m / b;
		if (Math.abs(sin) <= 1 + 1e-12) out.push({ m, sin, angle: Math.asin(clamp(sin, -1, 1)) / DEG });
	}
	return out.sort((x, y) => y.angle - x.angle);
}

/** No copy can appear at any steering when b ≤ λ/2. */
export const safeSpacing = (b: number) => b <= 0.5 + 1e-12;

// --- two sources ------------------------------------------------------------------------------------------------

/** The separation of the second source from the first, Δ sin θ in units of λ/D: (sin θ₂ − sin θ₁) Nb. */
export const separation = (N: number, b: number, t1: number, t2: number) =>
	(Math.sin(t2 * DEG) - Math.sin(t1 * DEG)) * aperture(N, b);

/** The angle, degrees, of a source q λ/D from the one at θ₁ in sin θ, or undefined beyond the horizon. */
export function placeAt(N: number, b: number, t1: number, q: number) {
	const s = Math.sin(t1 * DEG) + q / aperture(N, b);
	return Math.abs(s) <= 1 ? Math.asin(s) / DEG : undefined;
}

/**
 * The dip at the midpoint, in sin θ', of the image of two equal sources, as a fraction of its peaks. The pattern is
 * symmetric about the midpoint, so the peak is searched for on one side, from half a width λ/D outside the nearer
 * source to the midpoint, on a fine grid and then by golden section. If the largest value there is at the midpoint
 * itself, the image has one peak and no dip, and `ratio` is 1.
 */
export function dip(N: number, b: number, t1: number, t2: number, c: number) {
	const [a, z] = t1 <= t2 ? [t1, t2] : [t2, t1];
	const sa = Math.sin(a * DEG);
	const mid = (sa + Math.sin(z * DEG)) / 2;
	const f = (s: number) => pairImage(N, b, a, z, Math.asin(clamp(s, -1, 1)) / DEG, c);
	const from = Math.max(-1, sa - 0.5 / aperture(N, b));
	const n = 2000;
	let best = -Infinity;
	let at = 0;
	for (let j = 0; j <= n; j++) {
		const v = f(from + ((mid - from) * j) / n);
		if (v > best) {
			best = v;
			at = j;
		}
	}
	const atMid = f(mid);
	if (at >= n - 1) return { ratio: 1, onePeak: true, peak: atMid, middle: atMid, mid };
	// golden section on the grid's bracket
	let lo = from + ((mid - from) * Math.max(0, at - 1)) / n;
	let hi = from + ((mid - from) * Math.min(n, at + 1)) / n;
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 60; i++) {
		const x1 = hi - g * (hi - lo);
		const x2 = lo + g * (hi - lo);
		if (f(x1) < f(x2)) lo = x1;
		else hi = x2;
	}
	const peak = Math.max(best, f((lo + hi) / 2));
	return { ratio: atMid / peak, onePeak: false, peak, middle: atMid, mid };
}

// --- the records -------------------------------------------------------------------------------------------------

/** A source as the records see it: the sine of its angle, and its phase φ at the middle of the row. */
export type Wave = { sin: number; phase: number };

/**
 * The record of the pixel at x (wavelengths from the middle) at the source's phase ωt, a time τ (in cycles) from now:
 * u_p = Σ cos(ωt + 2πτ + 2π x sin θ + φ), the chapter's F(t + n̂·x_p/c) with F = cos ωt for each source.
 */
export function record(x: number, waves: Wave[], wt: number, tau: number) {
	let u = 0;
	for (const w of waves) u += Math.cos(wt + 2 * Math.PI * (tau + x * w.sin) + w.phase);
	return u;
}

/** The same record delayed for the steered direction: u_p(t − x_p sin θ'/c). */
export const delayed = (x: number, waves: Wave[], sSteer: number, wt: number, tau: number) =>
	record(x, waves, wt, tau - x * sSteer);

/** The delayed records summed: Σ_j a_j N cos(ωt + 2πτ + φ_j), the chapter's S(t). */
export function summed(
	N: number,
	b: number,
	waves: Wave[],
	sSteer: number,
	wt: number,
	tau: number
) {
	let s = 0;
	for (const w of waves)
		s += dirichlet(N, psiOf(b, w.sin, sSteer)) * Math.cos(wt + 2 * Math.PI * tau + w.phase);
	return s;
}

// --- the phases out of step -------------------------------------------------------------------------------------

/** A small seeded generator of uniform numbers in [0, 1), so that the figure and its tests repeat. */
export function generator(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** The mean of cos φ over a set of phases. */
export const meanCos = (phases: number[]) =>
	phases.length ? phases.reduce((s, p) => s + Math.cos(p), 0) / phases.length : 0;

// --- the answers -----------------------------------------------------------------------------------------------

/** The first prediction's facts: the copies at the wider spacing, and the main lobe at both spacings. */
export function spreadAnswer(N: number, theta: number, from = OPENING.b, to = SPREAD) {
	return {
		theta,
		sin: Math.sin(theta * DEG),
		step: 1 / to,
		lobes: gratingLobes(to, theta),
		before: mainLobe(N, from, theta).width,
		after: mainLobe(N, to, theta).width,
		widths: [aperture(N, from), aperture(N, to)] as const
	};
}

/** The second prediction's facts: the dip out of step (the exact average), and the image in step. */
export function pairAnswer(N: number, b: number, t1: number, t2: number) {
	const out = dip(N, b, t1, t2, 0);
	const inStep = dip(N, b, t1, t2, 1);
	return { out, inStep, sep: separation(N, b, t1, t2) };
}
