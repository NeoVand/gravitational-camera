/**
 * The numbers of chapter 3.7's blur law, for its live figure. The cut-off and the Wiener weight come from the
 * site's engine (../../engine/resolution.ts); this adds what the figure draws besides: the curve q e^(−q) and the
 * level of the noise as powers of ten, the low crossing, the first estimate of the cut-off, and the exact picture of
 * a point under a plane of sensors, the Hankel transform of the weight, with its full width at half maximum.
 *
 * SNR is passed as a power of ten, `decades`, as in the engine.
 */
import { cutoff, slicePointSpread, transfer } from '../../engine/resolution';

export const DEGREE = Math.PI / 180;
/** One arcminute, the sharpness of the human eye, in radians. */
export const ARCMINUTE = DEGREE / 60;

/** L_π = ln(π SNR). */
export const logPiSnr = (decades: number) => Math.log(Math.PI) + decades * Math.LN10;

/** log10 of q e^(−q), the strength of a ripple of fineness q against the noise, up to the factor π SNR. */
export const log10Signal = (q: number) => Math.log10(q) - q / Math.LN10;

/** log10 of the level 1 / (π SNR), where a ripple is as strong as its noise. */
export const log10Level = (decades: number) => -(Math.log10(Math.PI) + decades);

/** The paper's approximation to the cut-off: ln(π SNR) + ln ln(π SNR). */
export function firstEstimate(decades: number): number {
	const L = logPiSnr(decades);
	return L + Math.log(L);
}

/** The smaller root of q e^(−q) = 1 / (π SNR), near 1 / (π SNR): the coarsest ripple the camera sees. */
export function lowCrossing(decades: number): number {
	const L = logPiSnr(decades);
	if (!(L > 1)) throw new RangeError('SNR too small for any detail to survive');
	// q = e^(q − L), which settles at once because q is small
	let q = Math.exp(-L);
	for (let i = 0; i < 60; i++) {
		const next = Math.exp(q - L);
		if (Math.abs(next - q) <= 1e-15 * q) return next;
		q = next;
	}
	return q;
}

/** The signal-to-noise ratio, as a power of ten, whose cut-off is `qc`: SNR = e^(q_c) / (π q_c). */
export const decadesFor = (qc: number) => (qc - Math.log(Math.PI * qc)) / Math.LN10;

// --- Bessel functions of the first kind, orders 0 and 1 (rational approximations, absolute error below 1e-8) ---------

export function besselJ0(x: number): number {
	const ax = Math.abs(x);
	if (ax < 8) {
		const y = x * x;
		const a =
			57568490574.0 +
			y *
				(-13362590354.0 +
					y * (651619640.7 + y * (-11214424.18 + y * (77392.33017 + y * -184.9052456))));
		const b =
			57568490411.0 +
			y * (1029532985.0 + y * (9494680.718 + y * (59272.64853 + y * (267.8532712 + y))));
		return a / b;
	}
	const z = 8 / ax;
	const y = z * z;
	const xx = ax - 0.785398164;
	const a =
		1 +
		y * (-0.1098628627e-2 + y * (0.2734510407e-4 + y * (-0.2073370639e-5 + y * 0.2093887211e-6)));
	const b =
		-0.1562499995e-1 +
		y * (0.1430488765e-3 + y * (-0.6911147651e-5 + y * (0.7621095161e-6 - y * 0.934935152e-7)));
	return Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * a - z * Math.sin(xx) * b);
}

export function besselJ1(x: number): number {
	const ax = Math.abs(x);
	if (ax < 8) {
		const y = x * x;
		const a =
			x *
			(72362614232.0 +
				y *
					(-7895059235.0 +
						y * (242396853.1 + y * (-2972611.439 + y * (15704.4826 + y * -30.16036606)))));
		const b =
			144725228442.0 +
			y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y))));
		return a / b;
	}
	const z = 8 / ax;
	const y = z * z;
	const xx = ax - 2.356194491;
	const a =
		1 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * -0.240337019e-6)));
	const b =
		0.04687499995 +
		y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
	const v = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * a - z * Math.sin(xx) * b);
	return x < 0 ? -v : v;
}

/** 2 J₁(x) / x, the picture of a point when the weight is a sharp step at the cut-off (1 at x = 0). */
export const airy = (x: number) => (Math.abs(x) < 1e-8 ? 1 : (2 * besselJ1(x)) / x);

/** sin x / x, the same for a row of sensors. */
export const sinc = (x: number) => (Math.abs(x) < 1e-8 ? 1 : Math.sin(x) / x);

/** The first x > 0 where a curve that starts at 1 and falls through ½ on (lo, hi) is ½, by bisection. */
function halfPoint(f: (x: number) => number, lo: number, hi: number): number {
	for (let i = 0; i < 80 && hi - lo > 1e-13 * hi; i++) {
		const mid = (lo + hi) / 2;
		if (f(mid) > 0.5) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

/**
 * The full width at half maximum, in x, of 2J₁(x)/x (4.4302) and of sin x / x (3.7910): the blur times the
 * cut-off, when the weight is a sharp step.
 */
export const LAW = {
	plane: 2 * halfPoint(airy, 1, 3),
	row: 2 * halfPoint(sinc, 1, 3)
} as const;

// --- the exact picture of a point under a plane of sensors ----------------------------------------------------------

/**
 * The weights of the picture of a point, f(r) = ∫ H(q) J₀(q r) q dq, after one integration by parts:
 * f(r) = ∫ 2 H (1 − H) (q − 1) J₁(q r) / r dq, since q J₁(q r) / r has the derivative q J₀(q r) and
 * dH/dq = 2 H (1 − H) (1/q − 1). The new weight lives only on the two edges of H, so few nodes are needed:
 * a fine even grid round the cut-off, and a grid even in ln q below q = 1, for the low edge. Returned as nodes
 * and trapezoid weights (the weight times dq).
 */
function planeNodes(decades: number) {
	const qc = cutoff(decades);
	const nodes: number[] = [];
	const weights: number[] = [];
	const weight = (q: number) => {
		const H = transfer(q, decades);
		return 2 * H * (1 - H) * (q - 1);
	};
	const add = (qs: number[]) => {
		for (let i = 0; i < qs.length; i++) {
			const left = i > 0 ? qs[i] - qs[i - 1] : 0;
			const right = i < qs.length - 1 ? qs[i + 1] - qs[i] : 0;
			nodes.push(qs[i]);
			weights.push((weight(qs[i]) * (left + right)) / 2);
		}
	};
	// the low edge: from well below the low crossing up to q = 1
	const lnLow = Math.log(lowCrossing(decades)) - 8;
	const low = Array.from({ length: 241 }, (_, i) => Math.exp(lnLow * (1 - i / 240)));
	add(low);
	// the cut-off: beyond 25 on either side 2 H (1 − H) is below e^(−45)
	const a = Math.max(1, qc - 25);
	const b = qc + 15;
	const dq = 0.04;
	const n = Math.ceil((b - a) / dq);
	add(Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n));
	return { qc, nodes: Float64Array.from(nodes), weights: Float64Array.from(weights) };
}

/** f(r) from the nodes; at r = 0, J₁(q r) / r is q / 2. */
function evaluate(nodes: Float64Array, weights: Float64Array, r: number): number {
	let s = 0;
	if (r === 0) {
		for (let i = 0; i < nodes.length; i++) s += weights[i] * nodes[i] * 0.5;
		return s;
	}
	for (let i = 0; i < nodes.length; i++) s += weights[i] * besselJ1(nodes[i] * r);
	return s / r;
}

export interface PointSpread {
	/** The cut-off. */
	qc: number;
	/** Angles from the point, radians (distance over depth), from 0 outwards. */
	theta: Float64Array;
	/** The picture of a point at those angles, 1 at the centre. */
	value: Float64Array;
	/** Its exact full width at half maximum, radians. */
	width: number;
}

/**
 * The exact picture of a point, at angles from 0 to `reach` radians: dense across the central peak, where it
 * changes fastest, coarser beyond.
 */
export function planePointSpread(decades: number, reach: number): PointSpread {
	const { qc, nodes, weights } = planeNodes(decades);
	const peak = evaluate(nodes, weights, 0);
	const f = (r: number) => evaluate(nodes, weights, r) / peak;
	const half = halfPoint(f, (0.5 * LAW.plane) / (2 * qc), (2 * LAW.plane) / (2 * qc));
	return { qc, ...sampled(f, half, reach), width: 2 * half };
}

/**
 * The exact picture of a point under a row of sensors, from the engine's own transform: finely sampled across
 * the peak, for the width, and coarsely out to `reach`.
 */
export function rowPointSpread(decades: number, reach: number): PointSpread {
	const qc = cutoff(decades);
	const guess = LAW.row / (2 * qc);
	const near = slicePointSpread(decades, 4 * guess, guess / 60);
	const far = slicePointSpread(decades, reach + 0.004, 0.004);
	const at = (r: number) => (r < 4 * guess ? near.at(r) : far.at(r));
	const half = halfPoint(near.at, 0.5 * guess, 2 * guess);
	return { qc, ...sampled(at, half, reach), width: 2 * half };
}

/** Samples of a picture: 30 across its half width at half maximum and out to four times it, then 0.25° apart. */
function sampled(f: (r: number) => number, half: number, reach: number) {
	const fine = half / 30;
	const coarse = Math.max(fine, 0.25 * DEGREE);
	const theta: number[] = [];
	for (let r = 0; r <= reach + 1e-12; r += r < 4 * half ? fine : coarse) theta.push(r);
	if (theta[theta.length - 1] < reach) theta.push(reach);
	return { theta: Float64Array.from(theta), value: Float64Array.from(theta, f) };
}

const spreads = new Map<string, PointSpread>();

/** The exact picture of a point for either kind of array, remembered, since a slider comes back to the same values. */
export function pointSpread(sensors: 'plane' | 'row', decades: number, reach: number): PointSpread {
	const key = `${sensors}:${decades}:${reach}`;
	let s = spreads.get(key);
	if (!s) {
		s = sensors === 'plane' ? planePointSpread(decades, reach) : rowPointSpread(decades, reach);
		spreads.set(key, s);
	}
	return s;
}
