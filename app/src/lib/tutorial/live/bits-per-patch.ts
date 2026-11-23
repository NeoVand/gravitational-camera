/**
 * The numbers of chapter 3.8's bits per patch, for its live figure. A near-field camera reads each ripple of a flat
 * scene at q = k z standing above its noise by s = π SNR q e^(−q); a ripple carries at most ½ log₂(1 + s²) bits, and a
 * patch of area z² holds q dq / 2π of them in each ring, so that the bits per patch are
 *
 *     C = (1 / 4π) ∫₀^∞ q log₂(1 + π² SNR² q² e^(−2q)) dq        (the paper's eq:capacity-integral),
 *
 * close, for a sensitive camera, to the closed form (q_c³/3 − q_c²/2) / (4π ln 2) (eq:capacity), which factors into
 * q_c²/4π patterns of (q_c/3 − ½)/ln 2 bits each. The cut-off q_c comes from the site's engine
 * (../../engine/resolution.ts). SNR is passed as a power of ten, `decades`, as in the engine.
 */
import { cutoff } from '../../engine/resolution';

/** The slider: from SNR = 10 to the rough quantum ceiling 10^70, one power of ten at a time, opening at 10^3. */
export const LEAST = 1;
export const MOST = 70;
export const FIRST = 3;
/** The integral is shown beside the closed form up to here; beyond it the two agree within half a per cent. */
export const INTEGRAL_MOST = 10;
/** A byte is eight bits, and a kilobyte 1000 bytes, as the chapter counts them. */
export const BYTE = 8;
export const KILOBYTE = 8000;
/** The predictions: a million times the sensitivity, from 10^3 to 10^9. */
export const MILLION_FROM = 3;
export const MILLION_TO = 9;

/** L_π = ln(π SNR). */
const logPiSnr = (decades: number) => Math.log(Math.PI) + decades * Math.LN10;

/** ln(1 + eˣ), without overflow for large x. */
const softplus = (x: number) => (x > 0 ? x + Math.log1p(Math.exp(-x)) : Math.log1p(Math.exp(x)));

/** The bits a pattern of wavenumber q / z carries at most, ½ log₂(1 + s²), with s = π SNR q e^(−q). */
export function ripple(q: number, decades: number): number {
	if (q <= 0) return 0;
	const lnS = logPiSnr(decades) + Math.log(q) - q;
	return softplus(2 * lnS) / (2 * Math.LN2);
}

/** The patterns per area z²: the ripples with q < q_c, which fill a disc of radius q_c / z, q_c² / 4π of them. */
export const patterns = (qc: number) => (qc * qc) / (4 * Math.PI);

/** The mean of log₂ s over the patterns, (q_c/3 − ½) / ln 2: the bits each carries on average. */
export const bitsEach = (qc: number) => (qc / 3 - 0.5) / Math.LN2;

/** The closed form, (q_c³/3 − q_c²/2) / (4π ln 2) bits per area z², the patterns times the bits each. */
export const closedForm = (qc: number) => patterns(qc) * bitsEach(qc);

/** What the readouts show at one sensitivity. */
export function count(decades: number) {
	const qc = cutoff(decades);
	return { qc, patterns: patterns(qc), each: bitsEach(qc), closed: closedForm(qc) };
}

// --- the integral, by adaptive Gauss–Kronrod quadrature --------------------------------------------------------------

/** The 15-point Kronrod rule and its 7-point Gauss rule, on [−1, 1]: nodes from the end inwards, the middle last. */
const XK = [
	0.9914553711208126, 0.9491079123427585, 0.8648644233597691, 0.7415311855993945,
	0.5860872354676911, 0.4058451513773972, 0.20778495500789848, 0
];
const WK = [
	0.022935322010529224, 0.06309209262997856, 0.10479001032225019, 0.14065325971552592,
	0.1690047266392679, 0.19035057806478542, 0.20443294007529889, 0.20948214108472782
];
const WG = [0.1294849661688697, 0.27970539148927664, 0.3818300505051189, 0.4179591836734694];

/** ∫ f over [a, b] by the 15-point rule, with the difference from the 7-point rule as the error. */
function kronrod(f: (x: number) => number, a: number, b: number) {
	const mid = (a + b) / 2;
	const half = (b - a) / 2;
	const centre = f(mid);
	let k = WK[7] * centre;
	let g = WG[3] * centre;
	for (let i = 0; i < 7; i++) {
		const pair = f(mid - half * XK[i]) + f(mid + half * XK[i]);
		k += WK[i] * pair;
		if (i % 2 === 1) g += WG[(i - 1) / 2] * pair;
	}
	return { value: k * half, error: Math.abs((k - g) * half) };
}

/** ∫ f over [a, b], halving each piece until its error is below `tolerance`. */
function adaptive(
	f: (x: number) => number,
	a: number,
	b: number,
	tolerance: number,
	depth = 0
): number {
	const { value, error } = kronrod(f, a, b);
	if (error <= tolerance || depth >= 40) return value;
	const mid = (a + b) / 2;
	return (
		adaptive(f, a, mid, tolerance / 2, depth + 1) + adaptive(f, mid, b, tolerance / 2, depth + 1)
	);
}

/**
 * The paper's eq:capacity-integral, bits per area z². The range is split where the integrand changes its character:
 * at q = 1 / (π SNR), below which a ripple is buried and carries almost nothing, at the cut-off q_c, and 60 beyond
 * it, where s² has fallen by e^(−120) and nothing is left. Relative accuracy about 10⁻¹⁰.
 */
export function integral(decades: number): number {
	const qc = cutoff(decades);
	const low = Math.exp(-logPiSnr(decades));
	// two halves: a ring of patterns holds q dq / 2π of them, each with ½ log₂(1 + s²) bits
	const f = (q: number) => 2 * q * ripple(q, decades);
	// a rough first value sets the absolute tolerance
	const rough = closedForm(qc) * 4 * Math.PI;
	const tolerance = 1e-12 * Math.max(rough, 1);
	const edges = [0, low, Math.min(1, qc / 2), qc, qc + 10, qc + 60];
	let total = 0;
	for (let i = 0; i + 1 < edges.length; i++)
		total += adaptive(f, edges[i], edges[i + 1], tolerance);
	return total / (4 * Math.PI);
}

/** How far the closed form falls below the integral, as a fraction of the integral. */
export function shortfall(decades: number): number {
	const exact = integral(decades);
	return (exact - count(decades).closed) / exact;
}

/** The first power of ten at which the picture, by the closed form, holds a kilobyte. */
export function firstKilobyte(): number {
	for (let d = LEAST; d <= MOST; d++) if (count(d).closed >= KILOBYTE) return d;
	return MOST;
}

// --- the tile ---------------------------------------------------------------------------------------------------------

/** The most cells drawn across the tile; at 10^70 the patterns need 54, so it never binds on the slider. */
export const MOST_ACROSS = 64;

/**
 * The patch z × z as its patterns, in a grid of n × n cells, the coarsest at the top left. The cell i columns across
 * and j rows down stands for the pattern of wavenumber q = π √((i + ½)² + (j + ½)²), the cosine with about i half-waves
 * across the patch and j down, so that each cell takes an area π² of the quarter plane of q: the cells within q < q_c
 * then number about q_c² / 4π, as the patterns do. The grid is the square that holds that quarter disc,
 * n = ⌈q_c / π⌉. Each cell carries ½ log₂(1 + s²) bits at its own q, large for the coarse patterns and falling to
 * nothing past the cut-off; `most` is the largest, that of the corner cell.
 */
export function tile(decades: number) {
	const qc = cutoff(decades);
	const n = Math.min(MOST_ACROSS, Math.max(1, Math.ceil(qc / Math.PI)));
	const bits = new Float64Array(n * n);
	for (let j = 0; j < n; j++)
		for (let i = 0; i < n; i++)
			bits[j * n + i] = ripple(Math.PI * Math.hypot(i + 0.5, j + 0.5), decades);
	let most = 0;
	for (const b of bits) most = Math.max(most, b);
	return { n, bits, most, radius: qc / Math.PI };
}

/** Ticks for the bits of a cell, from 0 to `most`: steps of 1, 2 or 5 times a power of ten, at most five of them. */
export function bitTicks(most: number): number[] {
	const power = 10 ** Math.floor(Math.log10(most / 5));
	const step = [1, 2, 5, 10].map((m) => m * power).find((s) => most / s <= 5) ?? 10 * power;
	const out: number[] = [];
	for (let k = 0; k * step <= most + 1e-9; k++) out.push(Number((k * step).toPrecision(6)));
	return out;
}

// --- the numbers as the chapter writes them ---------------------------------------------------------------------------

const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const superscript = (n: number) =>
	String(n).replace(/[-0-9]/g, (c) => (c === '-' ? '⁻' : SUPER[Number(c)]));

/** x to three significant figures, plainly while they stay below 10⁴ ("36.8", "571", "4970") and as a power of ten beyond. */
function three(x: number): { mantissa: string; power?: number } {
	if (x < 9995) return { mantissa: String(Number(x.toPrecision(3))) };
	let e = Math.floor(Math.log10(x));
	let m = (x / 10 ** e).toFixed(2);
	if (Number(m) >= 10) {
		e += 1;
		m = '1.00';
	}
	return { mantissa: m, power: e };
}

/** A number of bits, a count or a size to three significant figures: "36.8", "4970", "1.78 × 10⁵". */
export function plain(x: number): string {
	const { mantissa, power } = three(x);
	return power === undefined ? mantissa : `${mantissa} × 10${superscript(power)}`;
}

/** The same as LaTeX: "36.8", "1.78 \times 10^{5}". */
export function tex(x: number): string {
	const { mantissa, power } = three(x);
	return power === undefined ? mantissa : `${mantissa} \\times 10^{${power}}`;
}

/** A count of patterns or of bits per pattern: one decimal below 100 ("8.6", "4.3", "79.8"), then three figures. */
export const tenths = (x: number) => (x < 99.95 ? x.toFixed(1) : String(Number(x.toPrecision(3))));

/** The cut-off to four significant figures, as the chapter gives it: "10.39", "17.84", "167.4". */
export const cutText = (qc: number) => qc.toPrecision(4);

/**
 * The size of a number of bits in bytes or, from a kilobyte up, in kilobytes: "less than a byte", "4.6 bytes", "621 bytes",
 * "22.3 kilobytes".
 */
export function size(bits: number): string {
	if (bits < BYTE) return 'less than a byte';
	if (bits < KILOBYTE) return `${plain(bits / BYTE)} bytes`;
	// at most 22.3 on the slider: three figures, keeping a final zero, "1.00"
	return `${(bits / KILOBYTE).toPrecision(3)} kilobytes`;
}

/** A shortfall as a percentage, to the places the chapter uses: "15%", "5.4%", "2.9%", "0.9%", "0.36%". */
export function percent(fraction: number): string {
	const p = 100 * fraction;
	if (p >= 9.95) return `${p.toFixed(0)}%`;
	if (p >= 0.5) return `${p.toFixed(1)}%`;
	return `${p.toFixed(2)}%`;
}

/** SNR = 10ⁿ in plain text, and ten as "10". */
export const snrText = (decades: number) => (decades === 1 ? '10' : `10${superscript(decades)}`);

/** The same as LaTeX. */
export const snrTex = (decades: number) => (decades === 1 ? '10' : `10^{${decades}}`);
