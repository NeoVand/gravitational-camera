/**
 * Patterns on the sky, as chapter 2.2 writes them. A direction is the polar angle ϑ from the z axis and the azimuth φ
 * round it; the Legendre polynomials P_ℓ come from Bonnet's recurrence, and the spherical harmonics
 *
 *   Y_ℓm = √((2ℓ + 1)/4π · (ℓ − m)!/(ℓ + m)!) P_ℓ^m(cos ϑ) e^{imφ},  P_ℓ^m(μ) = (−1)^m (1 − μ²)^{m/2} d^m P_ℓ/dμ^m,
 *
 * for m ≥ 0, with Y_ℓ,−m = (−1)^m Y*_ℓm (the Condon–Shortley sign), are computed already normalized, by the
 * recurrence in ℓ at fixed m, which never forms a factorial. The second half rebuilds a cap of the sky, 1 within 30° of
 * the z axis and 0 outside, from its coefficients a_ℓ0 = ∮ Y*_ℓ0 f dΩ up to a degree L, and measures how sharp the
 * rebuilt edge is.
 */

/** The degrees the figure shows one at a time, and the most it uses to rebuild the cap. */
export const MOST_DEGREE = 12;
export const MOST_BUILD = 40;
/** The cap's radius: 30°, in radians. */
export const CAP = Math.PI / 6;
/** The edge is measured between these fractions of the cap's height. */
export const EDGE_LOW = 0.1;
export const EDGE_HIGH = 0.9;

const FOUR_PI = 4 * Math.PI;
export const degrees = (radians: number) => (radians * 180) / Math.PI;
export const radians = (deg: number) => (deg * Math.PI) / 180;

// --- the Legendre polynomials -------------------------------------------------------------------------------------

/** P_0(μ) … P_L(μ), by Bonnet's recurrence ℓ P_ℓ = (2ℓ − 1) μ P_ℓ−1 − (ℓ − 1) P_ℓ−2. */
export function legendreList(L: number, mu: number): Float64Array {
	const p = new Float64Array(L + 1);
	p[0] = 1;
	if (L >= 1) p[1] = mu;
	for (let l = 2; l <= L; l++) p[l] = ((2 * l - 1) * mu * p[l - 1] - (l - 1) * p[l - 2]) / l;
	return p;
}

/** P_ℓ(μ). */
export const legendre = (l: number, mu: number) => legendreList(l, mu)[l];

/** ∫_x^1 P_ℓ dμ: 1 − x for ℓ = 0, and (P_ℓ−1(x) − P_ℓ+1(x))/(2ℓ + 1) above. */
export function legendreTail(l: number, x: number): number {
	if (l === 0) return 1 - x;
	const p = legendreList(l + 1, x);
	return (p[l - 1] - p[l + 1]) / (2 * l + 1);
}

/** ∫_0^1 P_ℓ dμ, the integral behind the hemisphere pattern: ½, −⅛, 1/16 for ℓ = 1, 3, 5, zero for even ℓ ≥ 2. */
export const hemisphereIntegral = (l: number) => legendreTail(l, 0);

// --- the spherical harmonics --------------------------------------------------------------------------------------

/** √((2ℓ + 1)/4π · (ℓ − m)!/(ℓ + m)!), the factor of Y_ℓm, for 0 ≤ m ≤ ℓ. */
export function norm(l: number, m: number): number {
	let ratio = 1;
	for (let k = l - m + 1; k <= l + m; k++) ratio /= k;
	return Math.sqrt(((2 * l + 1) / FOUR_PI) * ratio);
}

/**
 * The normalized N_ℓm P_ℓ^m(μ) divided by (1 − μ²)^{m/2}, for 0 ≤ m ≤ ℓ: a polynomial in μ, with the zeros of the
 * pattern between the poles and none at them. Started at ℓ = m from (−1)^m √((2m + 1)!!/(4π (2m)!!)), then
 * N P_ℓ = √((4ℓ² − 1)/(ℓ² − m²)) [μ N P_ℓ−1 − √(((ℓ − 1)² − m²)/(4(ℓ − 1)² − 1)) N P_ℓ−2].
 */
export function reduced(l: number, m: number, mu: number): number {
	let pmm = 1 / Math.sqrt(FOUR_PI);
	for (let k = 1; k <= m; k++) pmm *= -Math.sqrt((2 * k + 1) / (2 * k));
	if (l === m) return pmm;
	let before = pmm;
	let now = Math.sqrt(2 * m + 3) * mu * pmm;
	for (let k = m + 2; k <= l; k++) {
		const a = Math.sqrt((4 * k * k - 1) / (k * k - m * m));
		const b = Math.sqrt(((k - 1) * (k - 1) - m * m) / (4 * (k - 1) * (k - 1) - 1));
		const next = a * (mu * now - b * before);
		before = now;
		now = next;
	}
	return now;
}

/** N_ℓm P_ℓ^m(cos ϑ), the part of Y_ℓm that depends on ϑ, for 0 ≤ m ≤ ℓ. */
export const polar = (l: number, m: number, theta: number) =>
	reduced(l, m, Math.cos(theta)) * Math.sin(theta) ** m;

/** P_ℓ^m(μ) itself, with the Condon–Shortley sign, for 0 ≤ m ≤ ℓ. */
export const associated = (l: number, m: number, mu: number) =>
	(reduced(l, m, mu) * Math.max(0, 1 - mu * mu) ** (m / 2)) / norm(l, m);

export type Complex = { re: number; im: number };

/** Y_ℓm(ϑ, φ), for −ℓ ≤ m ≤ ℓ. */
export function harmonic(l: number, m: number, theta: number, phi: number): Complex {
	const k = Math.abs(m);
	const r = polar(l, k, theta);
	const re = r * Math.cos(k * phi);
	const im = r * Math.sin(k * phi);
	if (m >= 0) return { re, im };
	const sign = k % 2 ? -1 : 1;
	return { re: sign * re, im: -sign * im };
}

/**
 * Re Y_ℓm = s N_ℓ|m| P_ℓ^|m|(cos ϑ) cos(mφ), where s = 1 for m ≥ 0 and s = (−1)^m for m < 0: so m and −m have
 * the same real part up to that sign.
 */
export const sign = (m: number) => (m < 0 && Math.abs(m) % 2 ? -1 : 1);
export const realPart = (l: number, m: number, theta: number, phi: number) =>
	sign(m) * polar(l, Math.abs(m), theta) * Math.cos(m * phi);

/** The number of patterns of degree up to ℓ: 1 + 3 + … + (2ℓ + 1) = (ℓ + 1)². */
export const patternsUpTo = (l: number) => (l + 1) * (l + 1);

/** Bisection for a root of f between a and b, where f changes sign. */
function bisect(f: (x: number) => number, a: number, b: number): number {
	let fa = f(a);
	for (let i = 0; i < 80; i++) {
		const c = 0.5 * (a + b);
		const fc = f(c);
		if (fc === 0) return c;
		if (fa * fc < 0) b = c;
		else {
			a = c;
			fa = fc;
		}
	}
	return 0.5 * (a + b);
}

/**
 * The polar angles, in radians from the north pole, of the ℓ − |m| circles of latitude on which Y_ℓm is zero: the
 * zeros of P_ℓ^|m|(cos ϑ) between the poles.
 */
export function latitudeZeros(l: number, m: number): number[] {
	const k = Math.abs(m);
	const f = (theta: number) => reduced(l, k, Math.cos(theta));
	const n = 4000;
	const out: number[] = [];
	let a = 0;
	let fa = f(a);
	for (let i = 1; i <= n; i++) {
		const b = (Math.PI * i) / n;
		const fb = f(b);
		if (fa === 0) out.push(a);
		else if (fa * fb < 0) out.push(bisect(f, a, b));
		a = b;
		fa = fb;
	}
	return out;
}

/** The azimuths in [0, 2π) of the 2|m| half great circles from pole to pole on which cos(mφ), and so Re Y_ℓm, is zero. */
export function meridianZeros(m: number): number[] {
	const k = Math.abs(m);
	return Array.from({ length: 2 * k }, (_, j) => ((2 * j + 1) * Math.PI) / (2 * k));
}

/** The largest size of N_ℓm P_ℓ^m(cos ϑ) over the sphere, the end of the colour scale: on a grid, then refined. */
export function largest(l: number, m: number): number {
	const k = Math.abs(m);
	const n = 720;
	let best = 0;
	let at = 0;
	for (let i = 0; i <= n; i++) {
		const t = (Math.PI * i) / n;
		const v = Math.abs(polar(l, k, t));
		if (v > best) {
			best = v;
			at = t;
		}
	}
	// a golden-section search round the best point of the grid
	let a = Math.max(0, at - Math.PI / n);
	let b = Math.min(Math.PI, at + Math.PI / n);
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 60; i++) {
		const c = b - g * (b - a);
		const d = a + g * (b - a);
		if (Math.abs(polar(l, k, c)) > Math.abs(polar(l, k, d))) b = d;
		else a = c;
	}
	return Math.max(best, Math.abs(polar(l, k, 0.5 * (a + b))));
}

/** A function of ϑ sampled at n + 1 points from 0 to π, for drawing. */
export function sampleTheta(n: number, f: (theta: number) => number): Float64Array {
	const out = new Float64Array(n + 1);
	for (let i = 0; i <= n; i++) out[i] = f((Math.PI * i) / n);
	return out;
}

/** A table of `sampleTheta` read at ϑ, by straight lines between its points. */
export function readTable(table: Float64Array, theta: number): number {
	const n = table.length - 1;
	const s = Math.max(0, Math.min(n, (theta / Math.PI) * n));
	const i = Math.min(n - 1, Math.floor(s));
	return table[i] + (s - i) * (table[i + 1] - table[i]);
}

// --- the cap rebuilt from its degrees -----------------------------------------------------------------------------

/**
 * The cap's coefficient of degree ℓ: the cap is symmetric about the z axis, so only m = 0 enters, and
 * a_ℓ0 = ∮ Y_ℓ0 f dΩ = 2π √((2ℓ + 1)/4π) ∫_{cos α}^1 P_ℓ dμ. Every a_ℓm with m ≠ 0 is zero.
 */
export const capCoefficient = (l: number, alpha = CAP) =>
	2 * Math.PI * Math.sqrt((2 * l + 1) / FOUR_PI) * legendreTail(l, Math.cos(alpha));

export function capCoefficients(L: number, alpha = CAP): Float64Array {
	const x = Math.cos(alpha);
	const p = legendreList(L + 1, x);
	const out = new Float64Array(L + 1);
	for (let l = 0; l <= L; l++) {
		const tail = l === 0 ? 1 - x : (p[l - 1] - p[l + 1]) / (2 * l + 1);
		out[l] = 2 * Math.PI * Math.sqrt((2 * l + 1) / FOUR_PI) * tail;
	}
	return out;
}

/** The cap itself: 1 within α of the north pole, 0 outside. */
export const cap = (theta: number, alpha = CAP) => (theta < alpha ? 1 : 0);

/** The cap rebuilt from degrees 0 to L, f_L = Σ_ℓ≤L a_ℓ0 Y_ℓ0, at the polar angle ϑ. */
export function rebuilt(
	L: number,
	theta: number,
	alpha = CAP,
	a = capCoefficients(L, alpha)
): number {
	const p = legendreList(L, Math.cos(theta));
	let f = 0;
	for (let l = 0; l <= L; l++) f += a[l] * Math.sqrt((2 * l + 1) / FOUR_PI) * p[l];
	return f;
}

/** ∮ f² dΩ for the cap, 2π(1 − cos α): its value and the area of the cap. */
export const capSquare = (alpha = CAP) => 2 * Math.PI * (1 - Math.cos(alpha));

/**
 * The share of ∮ f² dΩ that the leftover f − f_L still holds: by orthonormality ∮ (f − f_L)² dΩ is the sum of
 * a_ℓ0² over the degrees above L, which is ∮ f² dΩ less the sum up to L.
 */
export function leftoverShare(L: number, alpha = CAP): number {
	const a = capCoefficients(L, alpha);
	let kept = 0;
	for (let l = 0; l <= L; l++) kept += a[l] * a[l];
	return Math.max(0, 1 - kept / capSquare(alpha));
}

export type Edge = { inner: number; outer: number; width: number };

/**
 * The rebuilt edge: the polar angle nearest the edge, inside it, where f_L last stands at nine tenths of the cap's
 * height, the angle outside where it first falls to a tenth, and the width between them, all in radians. Undefined
 * while f_L never reaches nine tenths inside the cap.
 */
export function edge(L: number, alpha = CAP): Edge | undefined {
	const a = capCoefficients(L, alpha);
	const f = (theta: number) => rebuilt(L, theta, alpha, a);
	const step = Math.PI / 3600;
	const high = (t: number) => f(t) - EDGE_HIGH;
	const low = (t: number) => f(t) - EDGE_LOW;
	// inward from the edge to the first point at nine tenths, and outward to the first at a tenth
	let inner: number | undefined;
	for (let prev = alpha, t = alpha - step; t >= 0; prev = t, t -= step)
		if (high(t) >= 0) {
			inner = high(prev) >= 0 ? prev : bisect(high, t, prev);
			break;
		}
	if (inner === undefined) return undefined;
	let outer: number | undefined;
	for (let prev = alpha, t = alpha + step; t <= Math.PI; prev = t, t += step)
		if (low(t) <= 0) {
			outer = low(prev) <= 0 ? prev : bisect(low, prev, t);
			break;
		}
	if (outer === undefined) return undefined;
	return { inner, outer, width: outer - inner };
}

/** The least degree L at which the rebuilt edge is no wider than `width` radians. */
export function sharpDegree(width: number, alpha = CAP): number {
	for (let L = 0; L <= 400; L++) {
		const e = edge(L, alpha);
		if (e && e.width <= width) return L;
	}
	return Number.NaN;
}

/**
 * The ringing by the edge: the first crest of f_L inside the cap, going inward from the edge, and the first trough
 * outside it, going outward, with their polar angles in radians.
 */
export function ringing(L: number, alpha = CAP) {
	const a = capCoefficients(L, alpha);
	const f = (theta: number) => rebuilt(L, theta, alpha, a);
	const step = Math.PI / 7200;
	let crest = { at: 0, value: f(0) };
	for (let t = alpha - step, before = f(alpha); t > 0; t -= step) {
		const v = f(t);
		if (v < before) {
			crest = { at: t + step, value: before };
			break;
		}
		before = v;
	}
	let trough = { at: Math.PI, value: f(Math.PI) };
	for (let t = alpha + step, before = f(alpha); t < Math.PI; t += step) {
		const v = f(t);
		if (v > before) {
			trough = { at: t - step, value: before };
			break;
		}
		before = v;
	}
	return { crest, trough };
}
