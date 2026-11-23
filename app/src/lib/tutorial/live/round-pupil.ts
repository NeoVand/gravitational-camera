/**
 * The numbers of chapter 3.6's round opening, for its live figure. An opening of radius R, in metres, lets everything
 * through inside and nothing outside. A disc transforms to π R² · 2J₁(x)/x and a slit of half-width R, on a line, to
 * 2R · sin x/x, with x = kR (eq:disc). Normalized to one at the centre, these are the amplitudes; their squares are the
 * intensities, and the disc's intensity is the Airy pattern.
 *
 * The Bessel functions come from the power series of eq:series and its derivative below u = 12, and beyond from the
 * far form of eq:far carried to more terms: J_n(u) = √(2/πu) (P cos χ − Q sin χ), with χ = u − (n/2 + 1/4)π and P, Q
 * the asymptotic series in 1/u, cut where their terms stop shrinking. At the switch both agree with the exact values
 * to about 10⁻¹², and over the drawn range the error stays below 10⁻¹¹. The series alone loses digits to
 * cancellation as u grows (10⁻¹⁰ at u = 20), and the far form alone fails near the centre, which is why each is used
 * only on its own side.
 */

export type Shape = 'disc' | 'slit';
export type Measure = 'amplitude' | 'intensity';

export const SHAPES: readonly Shape[] = ['disc', 'slit'];
export const MEASURES: readonly Measure[] = ['amplitude', 'intensity'];

/** Where the series hands over to the far form. */
export const SWITCH = 12;

/** The radii the slider stops at, in metres: 0.5 to 2 m in steps of 0.05 m, so that every radius up to 1 m can be doubled. */
export const RADIUS = { least: 0.5, most: 2, step: 0.05 } as const;
/** The opening state: the disc, its amplitude, a radius of one metre, and the first prediction. */
export const OPENING = { shape: 'disc', measure: 'amplitude', radius: 1 } as const;
/** The wavenumbers drawn, in m⁻¹: the map and the profile run from −K_REACH to K_REACH. */
export const K_REACH = 12;
/** The opening's panel runs from −A_REACH to A_REACH metres on each axis: the largest disc fits with room. */
export const A_REACH = 2.4;

// --- the Bessel functions -------------------------------------------------------------------------------------------

/** The power series of J₀ (order 0) or J₁ (order 1): Σ (−1)ⁿ (u/2)^{2n+m} / (n! (n+m)!). */
function series(order: 0 | 1, u: number): number {
	const q = (u / 2) ** 2;
	let term = order === 0 ? 1 : u / 2;
	let sum = term;
	for (let n = 1; n < 200; n++) {
		term *= -q / (n * (n + order));
		sum += term;
		if (Math.abs(term) < 1e-17 * Math.max(1, Math.abs(sum))) break;
	}
	return sum;
}

/**
 * The far form for u > 0: √(2/πu) (P cos χ − Q sin χ). The k-th term of the asymptotic series is a_k/u^k, with
 * a_0 = 1 and a_{k+1} = a_k (4m² − (2k+1)²) / (8(k+1)); the even terms build P and the odd ones Q, with the signs
 * +, +, −, −, … The sum stops at the smallest term.
 */
function far(order: 0 | 1, u: number): number {
	const mu = 4 * order * order;
	let p = 0;
	let q = 0;
	let a = 1;
	let previous = Infinity;
	for (let k = 0; k < 80; k++) {
		const term = a / u ** k;
		if (Math.abs(term) > previous) break;
		previous = Math.abs(term);
		const sign = k % 4 < 2 ? 1 : -1;
		if (k % 2 === 0) p += sign * term;
		else q += sign * term;
		if (Math.abs(term) < 1e-17) break;
		a *= (mu - (2 * k + 1) ** 2) / (8 * (k + 1));
	}
	const chi = u - (order / 2 + 0.25) * Math.PI;
	return Math.sqrt(2 / (Math.PI * u)) * (p * Math.cos(chi) - q * Math.sin(chi));
}

/** The Bessel function of order zero, J₀(u), the circular ripple (eq:j0). It is even. */
export function besselJ0(u: number): number {
	const a = Math.abs(u);
	return a < SWITCH ? series(0, a) : far(0, a);
}

/** The Bessel function of order one, J₁(u) = −J₀′(u). It is odd. */
export function besselJ1(u: number): number {
	const a = Math.abs(u);
	const v = a < SWITCH ? series(1, a) : far(1, a);
	return u < 0 ? -v : v;
}

// --- the two openings' patterns -----------------------------------------------------------------------------------

/** The disc's normalized amplitude 2J₁(x)/x, one at x = 0 (eq:disc). */
export const airy = (x: number) => (Math.abs(x) < 1e-6 ? 1 - (x * x) / 8 : (2 * besselJ1(x)) / x);

/** The slit's normalized amplitude sin x/x, one at x = 0. */
export const sinc = (x: number) => (Math.abs(x) < 1e-6 ? 1 - (x * x) / 6 : Math.sin(x) / x);

/** The normalized amplitude of an opening. */
export const amplitude = (shape: Shape, x: number) => (shape === 'disc' ? airy(x) : sinc(x));

/** What the figure draws: the amplitude, or the intensity, its square. */
export function pattern(shape: Shape, measure: Measure, x: number): number {
	const v = amplitude(shape, x);
	return measure === 'amplitude' ? v : v * v;
}

/** The point inside (lo, hi) where a continuous f changes sign, by bisection to 10⁻¹³. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
	let flo = f(lo);
	for (let i = 0; i < 200 && hi - lo > 1e-13; i++) {
		const mid = (lo + hi) / 2;
		const fm = f(mid);
		if (fm === 0) return mid;
		if (Math.sign(fm) === Math.sign(flo)) {
			lo = mid;
			flo = fm;
		} else hi = mid;
	}
	return (lo + hi) / 2;
}

/** The first zero of J₁, 3.8317: the disc's first dark ring. */
export const J1_ZERO = bisect(besselJ1, 3, 4.5);

/** The first x > 0 at which the opening's pattern is zero: 3.832 for the disc, π for the slit. */
export const firstZero = (shape: Shape) => (shape === 'disc' ? J1_ZERO : Math.PI);

/** The x at which the pattern first falls to one half of its height at the centre. */
export function halfPoint(shape: Shape, measure: Measure): number {
	return bisect((x) => pattern(shape, measure, x) - 0.5, 0.1, firstZero(shape));
}

/**
 * The first ring: the most negative amplitude between the first and the second zero, by golden-section search. Its
 * square is the brightest ring of the intensity.
 */
export function firstRing(shape: Shape): { x: number; amplitude: number } {
	let lo = firstZero(shape);
	let hi = shape === 'disc' ? 7.0156 : 2 * Math.PI;
	const g = (Math.sqrt(5) - 1) / 2;
	let c = hi - g * (hi - lo);
	let d = lo + g * (hi - lo);
	for (let i = 0; i < 200 && hi - lo > 1e-12; i++) {
		if (amplitude(shape, c) < amplitude(shape, d)) hi = d;
		else lo = c;
		c = hi - g * (hi - lo);
		d = lo + g * (hi - lo);
	}
	const x = (lo + hi) / 2;
	return { x, amplitude: amplitude(shape, x) };
}

/**
 * The pattern sampled at `count` + 1 even steps of x from 0 to `reach`, for a map that looks the value up by the
 * distance from its centre.
 */
export function radialTable(
	shape: Shape,
	measure: Measure,
	reach: number,
	count: number
): Float64Array {
	const table = new Float64Array(count + 1);
	for (let i = 0; i <= count; i++) table[i] = pattern(shape, measure, (i / count) * reach);
	return table;
}

/** The value of a table from radialTable at x, by linear interpolation, and 0 beyond its reach. */
export function lookUp(table: Float64Array, reach: number, x: number): number {
	const n = table.length - 1;
	const s = (Math.abs(x) / reach) * n;
	if (s >= n) return 0;
	const i = Math.floor(s);
	return table[i] + (s - i) * (table[i + 1] - table[i]);
}

// --- the slider and the second prediction ----------------------------------------------------------------------------

/** The slider's rung for a radius: the radius in steps of 0.05 m, 10 to 40. */
export const rungOf = (radius: number) => Math.round(radius / RADIUS.step);
/** The radius of a rung, in metres. */
export const radiusOf = (rung: number) => Number((rung * RADIUS.step).toFixed(2));
/** A radius brought onto the slider's stops. */
export function snapRadius(radius: number): number {
	const least = rungOf(RADIUS.least);
	const most = rungOf(RADIUS.most);
	return radiusOf(Math.max(least, Math.min(most, rungOf(radius))));
}

/**
 * Whether the radius now set doubles one already visited: the earlier radius, in metres, or undefined. Rungs are
 * whole multiples of 0.05 m, so a doubling is exact.
 */
export function doubledFrom(visited: ReadonlySet<number>, radius: number): number | undefined {
	const rung = rungOf(radius);
	return rung % 2 === 0 && visited.has(rung / 2) ? radiusOf(rung / 2) : undefined;
}

// --- the colours of the map ----------------------------------------------------------------------------------------

export type Rgb = [number, number, number];
type Lab = [number, number, number];

const toLinear = (c: number) => {
	const s = c / 255;
	return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (c: number) => {
	const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(0, c) ** (1 / 2.4) - 0.055;
	return Math.max(0, Math.min(255, 255 * s));
};

/** sRGB (0–255) to OKLab, Björn Ottosson's perceptual space, in which equal steps look about equal. */
export function oklab([r8, g8, b8]: Rgb): Lab {
	const r = toLinear(r8);
	const g = toLinear(g8);
	const b = toLinear(b8);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	];
}

/** OKLab back to sRGB (0–255), clipped to the screen's gamut. */
export function srgb([L, A, B]: Lab): Rgb {
	const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
	return [
		fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707598676 * s)
	];
}

/**
 * The map's colour ramp: zero is the ground, +1 the positive colour and −1 the negative one, each reached by a
 * straight line in OKLab, so that the colour changes evenly with the value. `colour(v)` returns sRGB, 0–255.
 */
export function ramp(zero: Rgb, positive: Rgb, negative: Rgb): (v: number) => Rgb {
	const z = oklab(zero);
	const p = oklab(positive);
	const n = oklab(negative);
	return (v: number) => {
		const t = Math.min(1, Math.abs(v));
		const end = v >= 0 ? p : n;
		return srgb([
			z[0] + (end[0] - z[0]) * t,
			z[1] + (end[1] - z[1]) * t,
			z[2] + (end[2] - z[2]) * t
		]);
	};
}
