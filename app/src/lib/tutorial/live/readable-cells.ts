/**
 * Chapter 13.8's readable cells: how many numbers looking reads, and how many interior cells pushing in pairs
 * resolves, for a stone of radius a read from a camera sphere of radius R_c at a signal-to-noise ratio SNR.
 *
 * Looking: N₁ = (⌊L/Λ⌋ + 1)², with L = ln SNR and Λ = ln(R_c/a).
 *
 * Pushing, the paired-tides count of the chapter's section 3 (*The model*), ported from
 * design/research/holography/scripts/paired-tides (core.py and exact.py). Lengths in units of a. In the sector of
 * degree ℓ the rung j (total degree n = ℓ + 2j) has the weight W_j = e^{−(n+2)Λ} times the root-sum-square of its
 * channels' coefficients, the masses on the sphere R_c and every ordered pair of directions one datum. The sector's
 * squared singular values are the eigenvalues of H = WGW, G_jk = 1/(2ℓ + 2j + 2k + 3), and each singular value
 * above the largest of all over SNR counts 2ℓ + 1 times. The sectors and their truncation are exact.py's.
 *
 * The reference finds the eigenvalues in multiple precision. Here they are found in double precision, to a relative
 * accuracy close to rounding, by the structure of H: G is a Cauchy matrix, 1/(a_j + a_k) with a_j = ℓ + 2j + 3/2,
 * so H is Cauchy-like, H_jk = w_j w_k/(a_j + a_k), and its Schur complements stay so, with each generator w_j
 * multiplied by (a_j − a_p)/(a_j + a_p) when the row p is eliminated. Gaussian elimination with diagonal pivoting
 * thus gives H = P L Δ Lᵀ Pᵀ with every entry of the unit triangle L (|L| ≤ 1) and every pivot Δ_k to a few
 * roundings, with no cancellation (Demmel, SIAM J. Matrix Anal. Appl. 21, 562, 1999). Then the singular values of
 * L Δ^{1/2}, a well-conditioned matrix with its columns scaled, come from one-sided Jacobi to a relative accuracy set
 * by the condition of L alone (Demmel and Veselić, 1992). The pivots far above the threshold are certainly counted;
 * those far below are dropped, which moves the eigenvalues near the threshold by less than e^{−40} of themselves; the
 * pivots near it are resolved through the Schur complement after the large ones, with Sylvester's law of inertia.
 *
 * The rung-by-rung (pivot) count of core.py is here too, for the tests.
 */

// --- constants -------------------------------------------------------------------------------------------------------

/** The sliders: log₁₀ SNR and R_c/a. */
export const SNR = { min: 3, max: 122, step: 0.1, opening: 6, arrow: 1, page: 10 };
export const RADII = { min: 1.2, max: 10, step: 0.1, opening: 3, page: 1 };

/** CODATA 2018, as the reference scripts. */
const G = 6.6743e-11;
const C = 2.99792458e8;
const HBAR = 1.054571817e-34;
/** The Planck length squared, ħG/c³, in m². */
export const PLANCK_AREA = (HBAR * G) / C ** 3;

/** The regions for the ceiling marker, each by its radius in metres. */
export const REGIONS = [
	{ id: 'metre', name: 'A metre', radius: 1 },
	{ id: 'earth', name: 'The Earth', radius: 6.371e6 },
	{ id: 'hubble', name: 'The Hubble radius', radius: 1.37e26 }
] as const;
export type RegionId = (typeof REGIONS)[number]['id'];

/** The ceiling on SNR in a region of radius ℓ_r: S_BH/2π = ℓ_r²/2ℓ_P². */
export const ceiling = (radius: number) => (radius * radius) / (2 * PLANCK_AREA);

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The slider's log₁₀ SNR kept on its grid of tenths. */
export const keptLog = (v: number) => clamp(Math.round(v * 10) / 10, SNR.min, SNR.max);
/** R_c/a kept on its grid of tenths. */
export const keptRadius = (v: number) => clamp(Math.round(v * 10) / 10, RADII.min, RADII.max);

// --- special functions -----------------------------------------------------------------------------------------------

const HALF_LOG_2PI = 0.5 * Math.log(2 * Math.PI);

/** ln Γ(x) for x > 0, by Stirling's series after shifting x above 15: about 10⁻¹⁵ of its size. */
export function lgamma(x: number): number {
	let shift = 0;
	while (x < 15) {
		shift += Math.log(x);
		x += 1;
	}
	const z = 1 / (x * x);
	const series =
		(1 / x) *
		(1 / 12 -
			z * (1 / 360 - z * (1 / 1260 - z * (1 / 1680 - z * (1 / 1188 - z * (691 / 360360))))));
	return (x - 0.5) * Math.log(x) - x + HALF_LOG_2PI + series - shift;
}

/** The entropy of a coin, in nats. */
export const entropy = (p: number) =>
	p <= 0 || p >= 1 ? 0 : -p * Math.log(p) - (1 - p) * Math.log(1 - p);

// --- looking ---------------------------------------------------------------------------------------------------------

/** N₁ = (⌊L/Λ⌋ + 1)², the numbers looking reads, L = ln SNR. */
export const looking = (lnSnr: number, lam: number) => (Math.floor(lnSnr / lam) + 1) ** 2;

/** The cell's side over the radius, from (4π/3)a³ = N d³. */
export const cellSide = (count: number) => ((4 * Math.PI) / 3 / count) ** (1 / 3);

/**
 * κ = Λ³ ∫₀^½ ⅔(1 − 2p) dp/[Λ + h(p)]³, the large-L limit of N₂/(L/Λ)³ for pairs. With p = u², which smooths the
 * logarithm of h at 0, by Simpson's rule on 4000 intervals.
 */
export function kappa(lam: number): number {
	const f = (u: number) => {
		const p = u * u;
		return (2 * u * (2 / 3) * (1 - 2 * p)) / (lam + entropy(p)) ** 3;
	};
	const n = 4000;
	const top = Math.SQRT1_2;
	const h = top / n;
	let s = f(0) + f(top);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(i * h);
	return lam ** 3 * ((s * h) / 3);
}

// --- the weights of the rungs ----------------------------------------------------------------------------------------

const LOG_4PI = Math.log(4 * Math.PI);
const LOG_4 = Math.log(4);
const LOG_3 = Math.log(3);

/** c_a = C(2a, a)/4^a, grown as needed. */
let central = new Float64Array([1]);
function centralTo(n: number) {
	if (central.length > n) return;
	const next = new Float64Array(Math.max(n + 1, 2 * central.length));
	next.set(central);
	for (let a = central.length; a < next.length; a++)
		next[a] = (next[a - 1] * (2 * a - 1)) / (2 * a);
	central = next;
}

/** Per sector ℓ, the Λ-free part of ln W_j for j = 0, 1, …, grown as needed. */
const bases: Float64Array[] = [];

/**
 * ½ ln Σ over channels of the coefficient squared, for the rung j of sector ℓ: core.py's log_w_pair without t^N.
 * The channels are ℓ₁ = g − b, ℓ₂ = j + 1 + b for b = 0, …, ℓ, with g = ℓ + j + 1, and
 * ⟨ℓ₁0 ℓ₂0|ℓ0⟩² = K 4^ℓ c_b c_{ℓ−b}, K = (2ℓ + 1)(2j + 2)! g!²/[(2g + 1)! (j + 1)!²].
 */
function channelBase(l: number, j: number): number {
	const g = l + j + 1;
	const n = l + 2 * j + 2;
	centralTo(l);
	let sum = 0;
	for (let b = 0; b <= l; b++) {
		sum += (central[b] * central[l - b]) / ((2 * (g - b) + 1) * (2 * (j + 1 + b) + 1));
	}
	const logK =
		Math.log(2 * l + 1) +
		lgamma(2 * j + 3) -
		lgamma(2 * g + 2) +
		2 * (lgamma(g + 1) - lgamma(j + 2));
	const P = 0.5 * (n - l) * (n + l + 1);
	return (
		0.5 * (2 * Math.log(P) + 3 * LOG_4PI - Math.log(2 * l + 1) + logK + l * LOG_4 + Math.log(sum))
	);
}

function base(l: number, j: number): number {
	let row = bases[l];
	if (!row || row.length <= j) {
		const next = new Float64Array(Math.max(j + 1, 2 * (row?.length ?? 8)));
		next.fill(NaN);
		if (row) next.set(row);
		bases[l] = row = next;
	}
	let v = row[j];
	if (Number.isNaN(v)) row[j] = v = channelBase(l, j);
	return v;
}

/** ln W_j of sector ℓ. */
export const logWeight = (l: number, j: number, lam: number) => -(l + 2 * j + 2) * lam + base(l, j);

/** ln of the residual of r^(ℓ+2j) against the lower powers, in L²(r² dr), times √3 so that ℓ = j = 0 gives 1. */
export function logResidual(l: number, j: number): number {
	const e = l + 2 * j + 1;
	return (
		lgamma(j + 1) +
		lgamma(l + j + 1.5) -
		lgamma(l + 2 * j + 1.5) -
		0.5 * Math.log(2 * e + 1) +
		0.5 * LOG_3
	);
}

/** ln of a rung's pivot amplitude: its weight times its residual. */
export const amplitude = (l: number, j: number, lam: number) =>
	logWeight(l, j, lam) + logResidual(l, j);

// --- the rung-by-rung count ------------------------------------------------------------------------------------------

/** core.py's count_pivot for pairs: rungs whose pivot amplitude exceeds the (0, 0) one over SNR, times 2ℓ + 1. */
export function pivotCount(lnSnr: number, lam: number): number {
	const ref = amplitude(0, 0, lam);
	const nmax = Math.floor(lnSnr / lam) + 40;
	let total = 0;
	for (let l = 0; l <= nmax; l++) {
		if (-l * lam + 40 < -lnSnr) break;
		let count = 0;
		for (let j = 0; j < Math.floor(nmax / 2) + 2; j++) {
			const above = amplitude(l, j, lam) - ref + lnSnr;
			if (above > 0) count++;
			else if (j > 3 && above < -30) break;
		}
		total += (2 * l + 1) * count;
	}
	return total;
}

// --- the exact count -------------------------------------------------------------------------------------------------

/** exact.py's truncation: the rungs the pivots count, and ten more. */
const EXTRA = 10;
/** Pivots this far above or below the threshold, in nats of the eigenvalue, are decided without Jacobi. */
const WIDE = 40;

/** rungs_pivot of exact.py: the last rung whose pivot amplitude stands above the threshold. */
function pivotRungs(l: number, lnSnr: number, lam: number, ref: number): number {
	let n = 0;
	for (let j = 0; j < 400; j++) {
		const above = amplitude(l, j, lam) - ref + lnSnr;
		if (above > 0) n = j + 1;
		else if (above < -40) break;
	}
	return n;
}

/**
 * One-sided Jacobi (Hestenes) on the columns of the m × q matrix B, stored by columns; returns the squared column
 * norms once the columns are orthogonal, which are the squared singular values.
 */
function jacobi(B: Float64Array, m: number, q: number): Float64Array {
	const tol = 1e-15 * Math.max(1, Math.sqrt(m));
	const norms = new Float64Array(q);
	const dotCols = (p: number, r: number) => {
		let s = 0;
		const op = p * m;
		const or = r * m;
		for (let i = 0; i < m; i++) s += B[op + i] * B[or + i];
		return s;
	};
	for (let p = 0; p < q; p++) norms[p] = dotCols(p, p);
	for (let sweep = 0; sweep < 60; sweep++) {
		let rotated = false;
		for (let p = 0; p < q - 1; p++) {
			for (let r = p + 1; r < q; r++) {
				const alpha = norms[p];
				const beta = norms[r];
				if (alpha === 0 || beta === 0) continue;
				const gamma = dotCols(p, r);
				if (Math.abs(gamma) <= tol * Math.sqrt(alpha * beta)) continue;
				rotated = true;
				const zeta = (beta - alpha) / (2 * gamma);
				const t = Math.sign(zeta || 1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
				const c = 1 / Math.sqrt(1 + t * t);
				const s = c * t;
				const op = p * m;
				const or = r * m;
				for (let i = 0; i < m; i++) {
					const x = B[op + i];
					const y = B[or + i];
					B[op + i] = c * x - s * y;
					B[or + i] = s * x + c * y;
				}
				norms[p] = dotCols(p, p);
				norms[r] = dotCols(r, r);
			}
		}
		if (!rotated) break;
	}
	return norms;
}

/** A sector's weights and truncation. */
interface Sector {
	l: number;
	/** ln w_j, j = 0 … J − 1. */
	logW: Float64Array;
	/** ln of the largest diagonal entry of H, its first pivot. */
	logTopDiagonal: number;
}

/** The factors H = P L Δ Lᵀ Pᵀ of a sector, in the order of the pivots. */
interface Factors {
	J: number;
	/** ln Δ_k, falling. */
	logPivot: Float64Array;
	/** L by columns in the pivots' order: L[k·J + m] is row m (in the pivots' order) of column k. */
	L: Float64Array;
}

/** Elimination with diagonal pivoting on the Cauchy-like H_jk = w_j w_k/(a_j + a_k), in the generators alone. */
function factor(s: Sector): Factors {
	const J = s.logW.length;
	const a = new Float64Array(J);
	for (let i = 0; i < J; i++) a[i] = s.l + 2 * i + 1.5;
	const lg = Float64Array.from(s.logW);
	const sign = new Float64Array(J).fill(1);
	const alive = new Uint8Array(J).fill(1);
	const order = new Int32Array(J);
	const position = new Int32Array(J);
	const logPivot = new Float64Array(J);
	/** By original row: column k's entry. */
	const byRow = new Float64Array(J * J);
	for (let k = 0; k < J; k++) {
		let p = -1;
		let best = -Infinity;
		for (let i = 0; i < J; i++) {
			if (!alive[i]) continue;
			const d = 2 * lg[i] - Math.log(2 * a[i]);
			if (d > best) {
				best = d;
				p = i;
			}
		}
		order[k] = p;
		position[p] = k;
		logPivot[k] = best;
		alive[p] = 0;
		byRow[p * J + k] = 1;
		for (let i = 0; i < J; i++) {
			if (!alive[i]) continue;
			const ratio = lg[i] - lg[p];
			byRow[i * J + k] =
				ratio < -745 ? 0 : sign[i] * sign[p] * Math.exp(ratio) * ((2 * a[p]) / (a[i] + a[p]));
			const diff = a[i] - a[p];
			lg[i] += Math.log(Math.abs(diff) / (a[i] + a[p]));
			if (diff < 0) sign[i] = -sign[i];
		}
	}
	const L = new Float64Array(J * J);
	for (let i = 0; i < J; i++) {
		const m = position[i];
		for (let k = 0; k <= m; k++) L[k * J + m] = byRow[i * J + k];
	}
	return { J, logPivot, L };
}

/** ln of the largest eigenvalue of a sector's H. */
function logLargest(f: Factors): number {
	const { J, logPivot, L } = f;
	let q = 0;
	while (q < J && logPivot[q] > logPivot[0] - WIDE) q++;
	const B = new Float64Array(J * q);
	for (let k = 0; k < q; k++) {
		const scale = Math.exp(0.5 * (logPivot[k] - logPivot[0]));
		for (let m = k; m < J; m++) B[k * J + m] = L[k * J + m] * scale;
	}
	const norms = jacobi(B, J, q);
	return logPivot[0] + Math.log(Math.max(...norms));
}

/** How many eigenvalues of a sector's H exceed e^logTheta. */
function countAbove(f: Factors, logTheta: number): number {
	const { J, logPivot, L } = f;
	let k1 = 0;
	while (k1 < J && logPivot[k1] > logTheta + WIDE) k1++;
	let k2 = k1;
	while (k2 < J && logPivot[k2] > logTheta - WIDE) k2++;
	if (k2 === k1) return k1;

	// X = L₁₁⁻ᵀ L₂₁ᵀ (k1 × m), by back substitution, one column per row of L₂₁
	const m = J - k1;
	const q = k2 - k1;
	const X = new Float64Array(k1 * m);
	for (let r = 0; r < m; r++) {
		const row = k1 + r;
		for (let i = k1 - 1; i >= 0; i--) {
			let v = L[i * J + row];
			for (let t = i + 1; t < k1; t++) v -= L[i * J + t] * X[t * m + r];
			X[i * m + r] = v;
		}
	}
	// K = I + XᵀX = C Cᵀ, C lower triangular
	const Cm = new Float64Array(m * m);
	for (let r = 0; r < m; r++) {
		for (let s = 0; s <= r; s++) {
			let v = r === s ? 1 : 0;
			for (let i = 0; i < k1; i++) v += X[i * m + r] * X[i * m + s];
			Cm[r * m + s] = v;
		}
	}
	for (let r = 0; r < m; r++) {
		for (let s = 0; s <= r; s++) {
			let v = Cm[r * m + s];
			for (let t = 0; t < s; t++) v -= Cm[r * m + t] * Cm[s * m + t];
			Cm[r * m + s] = r === s ? Math.sqrt(v) : v / Cm[s * m + s];
		}
	}
	// B = C⁻¹ L₂₂[:, mid] (Δ/θ)^½, by forward substitution, column by column
	const B = new Float64Array(m * q);
	for (let c = 0; c < q; c++) {
		const k = k1 + c;
		const scale = Math.exp(0.5 * (logPivot[k] - logTheta));
		for (let r = 0; r < m; r++) {
			let v = L[k * J + k1 + r] * scale;
			for (let t = 0; t < r; t++) v -= Cm[r * m + t] * B[c * m + t];
			B[c * m + r] = v / Cm[r * m + r];
		}
	}
	const norms = jacobi(B, m, q);
	let above = k1;
	for (let c = 0; c < q; c++) if (norms[c] > 1) above++;
	return above;
}

export interface Count {
	/** N₂. */
	count: number;
	/** The sector whose singular value is the largest. */
	topSector: number;
	/** The rungs counted in sector 0. */
	rungsAtZero: number;
}

/**
 * N₂, the singular-value count of exact.py, for SNR = 10^log10Snr and Λ = ln(R_c/a), as steps: the generator yields
 * between sectors, so that a caller may spread the work over several frames, and returns the count.
 */
export function* pairedCountSteps(log10Snr: number, lam: number): Generator<void, Count, void> {
	const lnSnr = log10Snr * Math.LN10;
	const ref = amplitude(0, 0, lam);
	const sectors: Sector[] = [];
	const last = Math.floor(lnSnr / lam) + 5;
	for (let l = 0; l < last; l++) {
		if (-l * lam + 15 < -lnSnr) break;
		const J = pivotRungs(l, lnSnr, lam, ref) + EXTRA;
		const logW = new Float64Array(J);
		let top = -Infinity;
		for (let j = 0; j < J; j++) {
			logW[j] = logWeight(l, j, lam);
			top = Math.max(top, 2 * logW[j] - Math.log(2 * (l + 2 * j + 1.5)));
		}
		sectors.push({ l, logW, logTopDiagonal: top });
		if (l % 64 === 63) yield;
	}

	// the largest eigenvalue: its sector's largest diagonal entry is within a factor J of the best one's
	const bestDiagonal = Math.max(...sectors.map((s) => s.logTopDiagonal));
	let logTop = -Infinity;
	let topSector = 0;
	for (const s of sectors) {
		if (s.logTopDiagonal + Math.log(s.logW.length) < bestDiagonal) continue;
		const v = logLargest(factor(s));
		if (v > logTop) {
			logTop = v;
			topSector = s.l;
		}
	}
	const logTheta = logTop - 2 * lnSnr;

	let count = 0;
	let rungsAtZero = 0;
	for (const s of sectors) {
		// no eigenvalue exceeds the trace, at most J times the largest diagonal entry
		if (s.logTopDiagonal + Math.log(s.logW.length) < logTheta) continue;
		yield;
		const n = countAbove(factor(s), logTheta);
		if (s.l === 0) rungsAtZero = n;
		count += (2 * s.l + 1) * n;
	}
	return { count, topSector, rungsAtZero };
}

/** N₂ at once. */
export function pairedCount(log10Snr: number, lam: number): Count {
	const steps = pairedCountSteps(log10Snr, lam);
	for (;;) {
		const next = steps.next();
		if (next.done) return next.value;
	}
}

// --- the counts made ------------------------------------------------------------------------------------------------

/** The counts made, by setting, kept for the page's life: each slider setting is counted once. */
const made = new Map<string, number>();
const settingKey = (log10Snr: number, radius: number) => `${log10Snr}|${radius}`;

/** N₂ for a slider setting, if it has been counted. */
export const madeCount = (log10Snr: number, radius: number) =>
	made.get(settingKey(log10Snr, radius));

/** N₂ for a slider setting, as steps (see pairedCountSteps), kept once it is made. */
export function* settingCountSteps(
	log10Snr: number,
	radius: number
): Generator<void, number, void> {
	const known = madeCount(log10Snr, radius);
	if (known !== undefined) return known;
	const n = (yield* pairedCountSteps(log10Snr, Math.log(radius))).count;
	made.set(settingKey(log10Snr, radius), n);
	return n;
}

/** N₂ for a slider setting at once, kept. */
export function settingCount(log10Snr: number, radius: number): number {
	const steps = settingCountSteps(log10Snr, radius);
	for (;;) {
		const next = steps.next();
		if (next.done) return next.value;
	}
}

// --- what the figure shows -------------------------------------------------------------------------------------------

export interface Readings {
	lnSnr: number;
	lam: number;
	looking: number;
	pushing: number;
	side: number;
	ratio: number;
	kappa: number;
}

/** The readouts, from a count N₂ already made. */
export function readings(log10Snr: number, radius: number, pushing: number): Readings {
	const lnSnr = log10Snr * Math.LN10;
	const lam = Math.log(radius);
	const n1 = looking(lnSnr, lam);
	return {
		lnSnr,
		lam,
		looking: n1,
		pushing,
		side: cellSide(pushing),
		ratio: pushing / n1,
		kappa: kappa(lam)
	};
}

/** SNR = 10^x as "1.9 × 10⁶⁹", or "10⁶" on a whole power. */
export function snrWords(log10Snr: number): string {
	const e = Math.floor(log10Snr + 1e-9);
	const mantissa = 10 ** (log10Snr - e);
	const sup = String(e).replace(/[0-9]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
	return mantissa < 1.05 ? `10${sup}` : `${mantissa.toFixed(1)} × 10${sup}`;
}

/** SNR = 10^x as LaTeX. */
export function snrTex(log10Snr: number): string {
	const e = Math.floor(log10Snr + 1e-9);
	const mantissa = 10 ** (log10Snr - e);
	return mantissa < 1.05 ? `10^{${e}}` : `${mantissa.toFixed(1)}\\times10^{${e}}`;
}

/** A count with thin groups: "21,675". */
export const grouped = (n: number) => Math.round(n).toLocaleString('en-US');

/** The grid of cells of side d (in units of a) over the disc of radius 1, as the offsets of its lines from 0. */
export function gridLines(side: number): number[] {
	// a line through the centre, then out by d each way: the cells sit square on the disc's axes
	const out: number[] = [];
	for (let i = 0; i * side < 1; i++) {
		out.push(i * side);
		if (i > 0) out.push(-i * side);
	}
	return out.sort((p, q) => p - q);
}
