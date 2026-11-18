/**
 * The noise in one near-field reconstruction (paper, Section "The near field", Eqs. array-data and wiener; the
 * reference's gravcam/resolution.py).
 *
 * An array reads the tide with white noise of spectral density N0. The best linear reconstruction, the Wiener filter
 * W = H / T with T = 2 pi G k e^(-kz), keeps a source pattern of wavenumber k with weight H = s^2 / (1 + s^2),
 * s = pi SNR q e^(-q), q = k z; and it passes the readings' noise with spectrum N0 |W|^2 = S_sigma H (1 - H), where
 * S_sigma = m^2 / z^2 is the prior's: point masses m, one per area z^2, the m of the signal-to-noise ratio
 * SNR = 2 G m / (z^2 sqrt N0). In the picture's angles (theta = x / z, so q is the wavenumber in radians^-1) and the
 * units of the tidal column (S = sigma / z), the noise of a reconstruction is a field with spectrum
 *
 *     P(q) = (m / z^3)^2 H(q) (1 - H(q))
 *
 * per steradian: ripples at the scale of the blur itself, their variance (m / z^3)^2 (1 / 2 pi) int H (1 - H) q dq.
 * `noiseField` makes one draw of it, in units of m / z^3, on a grid of the picture's tangent plane: white normal
 * numbers from a seed (lib/array/random.ts, as the locked safe's exposures), a Fourier transform, the filter
 * sqrt(P) over the cell's side, and the transform back. noise.spec.ts holds its variance and spectrum to
 * reference/fixtures/near-noise.json, made from resolution.py.
 */
import { normals } from '../array/random';
import { cutoff, transfer } from '../engine/resolution';

/** The reconstructed noise's spectrum against q, in units of (m / z^3)^2 per steradian: H (1 - H). */
export function noiseSpectrum(q: number, decades: number): number {
	const h = transfer(q, decades);
	return h * (1 - h);
}

/** (1 / 2 pi) int f(q) q dq on a trapezoid grid fine enough for H, out to where H has long gone. */
function radialIntegral(f: (q: number) => number, decades: number): number {
	const qMax = cutoff(decades) + 40;
	const n = Math.ceil(64 * qMax);
	const dq = qMax / n;
	let total = 0;
	for (let i = 1; i <= n; i++) total += (i === n ? 0.5 : 1) * f(i * dq) * i * dq;
	return (total * dq) / (2 * Math.PI);
}

/** The variance of the reconstructed noise, in units of (m / z^3)^2: (1 / 2 pi) int H (1 - H) q dq. */
export const noiseVariance = (decades: number): number =>
	radialIntegral((q) => noiseSpectrum(q, decades), decades);

/** The centre of the reconstructed image of a point of mass m, in units of m / z^3: (1 / 2 pi) int H q dq. */
export const pointPeak = (decades: number): number =>
	radialIntegral((q) => transfer(q, decades), decades);

/** In-place radix-2 transform of `n` complex numbers spaced `stride` apart from `offset`; sign -1 forward. */
function fft(
	re: Float64Array,
	im: Float64Array,
	n: number,
	offset: number,
	stride: number,
	sign: number
) {
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const a = offset + i * stride;
			const b = offset + j * stride;
			[re[a], re[b]] = [re[b], re[a]];
			[im[a], im[b]] = [im[b], im[a]];
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const angle = (sign * 2 * Math.PI) / len;
		const wr = Math.cos(angle);
		const wi = Math.sin(angle);
		for (let i = 0; i < n; i += len) {
			let cr = 1;
			let ci = 0;
			for (let k = 0; k < len / 2; k++) {
				const a = offset + (i + k) * stride;
				const b = offset + (i + k + len / 2) * stride;
				const tr = re[b] * cr - im[b] * ci;
				const ti = re[b] * ci + im[b] * cr;
				re[b] = re[a] - tr;
				im[b] = im[a] - ti;
				re[a] += tr;
				im[a] += ti;
				const next = cr * wr - ci * wi;
				ci = cr * wi + ci * wr;
				cr = next;
			}
		}
	}
}

/** The two-dimensional transform of an nx x ny grid, rows of nx; both powers of two. Inverse divides by nx ny. */
export function fft2(
	re: Float64Array,
	im: Float64Array,
	nx: number,
	ny: number,
	inverse = false
): void {
	const sign = inverse ? 1 : -1;
	for (let j = 0; j < ny; j++) fft(re, im, nx, j * nx, 1, sign);
	for (let i = 0; i < nx; i++) fft(re, im, ny, i, nx, sign);
	if (inverse) {
		const s = 1 / (nx * ny);
		for (let k = 0; k < nx * ny; k++) {
			re[k] *= s;
			im[k] *= s;
		}
	}
}

/** The angular wavenumber of grid frequency index k of n, for cells of side `cell` radians. */
const wavenumber = (k: number, n: number, cell: number) =>
	((2 * Math.PI) / (n * cell)) * (k < n / 2 ? k : k - n);

/**
 * The grid a noise field needs for a picture whose tangent plane spans 2 tanX by 2 tanY. A draw on a grid is periodic,
 * and holds only the wavenumbers of its lattice, 2 pi / side apart; over a box as small as the picture they are too
 * few to fill the narrow ring about q_c where the noise lives, and its variance comes out up to a third wrong. So the
 * box is square and twice the picture's longer side (within one per cent, noise.spec.ts), and the picture is the part
 * of it from its top left corner: `across` by `up` cells. The cells are four to a wavelength at q_c + 8, where H (1 - H)
 * has fallen below 1e-6 of its peak, at least 64 to the box's side and a power of two.
 */
export function noiseGrid(tanX: number, tanY: number, decades: number) {
	const wanted = (2 * Math.PI) / (cutoff(decades) + 8) / 4;
	const side = 4 * Math.max(tanX, tanY);
	const n = Math.min(1024, 2 ** Math.ceil(Math.log2(Math.max(64, side / wanted))));
	const cell = side / n;
	return { n, cell, across: (2 * tanX) / cell, up: (2 * tanY) / cell };
}

/**
 * One draw of the reconstruction's noise on an nx x ny grid of square cells `cell` radians on a side, rows of nx
 * from the top, in units of m / z^3: for a given seed the same draw on every machine. Its variance is
 * noiseVariance(decades), to within the scatter of one draw and, on a grid much smaller than ten wavelengths of the
 * cutoff, the lattice's sampling of the spectrum (`noiseGrid`).
 */
export function noiseField(
	nx: number,
	ny: number,
	cell: number,
	decades: number,
	seed: number
): Float64Array {
	const re = normals(seed, nx * ny);
	const im = new Float64Array(nx * ny);
	fft2(re, im, nx, ny);
	for (let j = 0; j < ny; j++) {
		const qy = wavenumber(j, ny, cell);
		for (let i = 0; i < nx; i++) {
			const q = Math.hypot(wavenumber(i, nx, cell), qy);
			const gain = Math.sqrt(noiseSpectrum(q, decades)) / cell;
			re[j * nx + i] *= gain;
			im[j * nx + i] *= gain;
		}
	}
	fft2(re, im, nx, ny, true);
	return re;
}
