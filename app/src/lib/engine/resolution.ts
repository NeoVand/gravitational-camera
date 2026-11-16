/**
 * How sharp a near-field image can be (reference/gravcam/resolution.py).
 *
 * The best linear reconstruction from an array of tidal sensors passes source
 * patterns of wavenumber k at depth z with weight H = S² / (1 + S²), where
 * S = π · SNR · q · e^(−q) and q = k z. It cuts off at q_c, where
 * q_c e^(−q_c) = 1 / (π · SNR), and its point-spread function then has a full
 * width at half maximum of 4.4302 z / q_c for a planar array (3.7910 z / q_c
 * for a row of sensors), with a small correction at low SNR fitted to the
 * reference's exact calculation.
 *
 * SNR is the peak field of a point mass over the noise of the field averaged
 * over a patch as wide as the depth. It is passed as a power of ten so that
 * values like 10^60 need no special care.
 */

/** q_c for SNR = 10^decades: the larger root of q − ln q = ln(π · SNR). */
export function cutoff(decades: number): number {
	const target = Math.log(Math.PI) + decades * Math.LN10;
	if (!(target > 1)) throw new RangeError('SNR too small for any detail to survive');
	let q = target + Math.log(target);
	for (let i = 0; i < 50; i++) {
		const step = (q - Math.log(q) - target) / (1 - 1 / q);
		q -= step;
		if (Math.abs(step) < 1e-14 * q) break;
	}
	return q;
}

const FWHM = { array: [4.4302, 8.5], slice: [3.791, 4.2] } as const;

/**
 * Full width at half maximum of the reconstructed image of a point, as an
 * angle in radians (equivalently, in units of the depth).
 */
export function nearFieldBlur(decades: number, geometry: 'array' | 'slice' = 'array'): number {
	const q = cutoff(decades);
	const [limit, correction] = FWHM[geometry];
	return (limit - correction / (q * q)) / q;
}

/** H(q) for SNR = 10^decades: the share of a pattern of wavenumber q / z that survives. */
export function transfer(q: number, decades: number): number {
	if (q <= 0) return 0;
	const logS = Math.log(Math.PI) + decades * Math.LN10 + Math.log(q) - q;
	return 1 / (1 + Math.exp(Math.min(-2 * logS, 700)));
}

/**
 * The point-spread function of the best reconstruction in a slice (a row of
 * sensors over line masses), (1 / π) ∫ H(q) cos(q x) dq, normalised to 1 at
 * x = 0. Returned as samples at x = 0, step, 2 step, … up to `reach` (units
 * of the depth), with a function that interpolates them.
 */
export function slicePointSpread(decades: number, reach: number, step = 0.004) {
	const qMax = cutoff(decades) + 15; // beyond it H < 1e-13
	const dq = 1 / 16;
	const nq = Math.ceil(qMax / dq);
	const weights = new Float64Array(nq + 1);
	for (let i = 0; i <= nq; i++)
		weights[i] = transfer(i * dq, decades) * (i === 0 || i === nq ? 0.5 : 1);
	// H(0) = 0, but H reaches 1 within q ~ 1 / (π SNR), far inside the first
	// step, so the end point takes the right-hand limit
	weights[0] = 0.5;
	const n = Math.ceil(reach / step) + 1;
	const values = new Float64Array(n);
	for (let j = 0; j < n; j++) {
		const x = j * step;
		let s = 0;
		for (let i = 0; i <= nq; i++) s += weights[i] * Math.cos(i * dq * x);
		values[j] = s;
	}
	const peak = values[0];
	for (let j = 0; j < n; j++) values[j] /= peak;
	const at = (x: number) => {
		const u = Math.abs(x) / step;
		const j = Math.floor(u);
		if (j >= n - 1) return values[n - 1];
		return values[j] + (u - j) * (values[j + 1] - values[j]);
	};
	return { step, values, at };
}
