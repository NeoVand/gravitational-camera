/**
 * The changing tidal field of an orbiting pair in the plane of its orbit, for
 * the demo of two black holes: E_zz(r, phi, t) = A(r) cos(2 Omega t - 2 phi + delta(r)),
 * from the linearized solution, truncated at the mass quadrupole, in the reference implementation
 * (reference/gravcam/binary.py, exported by gravcam.export_vistas). At the
 * order of the quadrupole, A and delta depend on r only through x = r / lambda,
 * lambda being the wavelength of the waves; the table holds x A(x), in units
 * of its value in the waves, and eta = delta + 2 pi x. It also holds the rest
 * of the tensor in the plane, against E_zz (`pairTensor`).
 */
import vistas from '../../../../reference/fixtures/vistas.json';

const xs = vistas.pair.x;
const strengths = vistas.pair.strength;
const etas = vistas.pair.eta;
const logX = xs.map(Math.log);
const logS = strengths.map(Math.log);

/**
 * Strength (r A, waves = 1) and phase delta at x = r / lambda. Inside the
 * table's range the logarithm of the strength and eta are interpolated
 * linearly in log x; beyond it the near field grows as x^-4 (r A of Newton's
 * quadrupole) and the waves keep a constant strength.
 */
export function pairField(x: number): { strength: number; delta: number } {
	const lx = Math.log(x);
	const n = xs.length;
	let strength: number;
	let eta: number;
	if (lx <= logX[0]) {
		strength = strengths[0] * (xs[0] / x) ** 4;
		eta = etas[0];
	} else if (lx >= logX[n - 1]) {
		strength = strengths[n - 1];
		eta = etas[n - 1];
	} else {
		// the samples are evenly spaced in log x
		const pos = ((lx - logX[0]) / (logX[n - 1] - logX[0])) * (n - 1);
		const i = Math.min(n - 2, Math.floor(pos));
		const f = pos - i;
		strength = Math.exp(logS[i] + f * (logS[i + 1] - logS[i]));
		eta = etas[i] + f * (etas[i + 1] - etas[i]);
	}
	return { strength, delta: eta - 2 * Math.PI * x };
}

/** A complex number as [real, imaginary]. */
export type Complex2 = [number, number];

const ETA_END = vistas.pair.eta_end;
const rrs = vistas.pair.rr as Complex2[];
const rphis = vistas.pair.rphi as Complex2[];

/** Linear interpolation in log x on the table, held at its ends. */
function along(x: number, values: Complex2[]): Complex2 {
	const lx = Math.log(x);
	const n = xs.length;
	if (lx <= logX[0]) return values[0];
	if (lx >= logX[n - 1]) return values[n - 1];
	const pos = ((lx - logX[0]) / (logX[n - 1] - logX[0])) * (n - 1);
	const i = Math.min(n - 2, Math.floor(pos));
	const f = pos - i;
	return [
		values[i][0] + f * (values[i + 1][0] - values[i][0]),
		values[i][1] + f * (values[i + 1][1] - values[i][1])
	];
}

const times = (a: Complex2, b: Complex2): Complex2 => [
	a[0] * b[0] - a[1] * b[1],
	a[0] * b[1] + a[1] * b[0]
];

/**
 * The whole changing tensor in the plane of the orbit at x = r / lambda, at phi = 0: E = Re[c exp(2 i Omega t)] in
 * the axes (r, phi, z), with c in units of the waves' amplitude at that distance (`waveTide`), the phase absolute
 * (the holes on the x axis at t = 0). The components with z vanish by the symmetry z -> -z. At any phi the tensor is
 * the one at phi = 0 and the time t - phi / Omega, turned by phi.
 */
export function pairTensor(x: number): {
	rr: Complex2;
	rphi: Complex2;
	phiphi: Complex2;
	zz: Complex2;
} {
	const { strength, delta } = pairField(x);
	const phase = delta + ETA_END;
	const zz: Complex2 = [strength * Math.cos(phase), strength * Math.sin(phase)];
	const rr = times(along(x, rrs), zz);
	return {
		rr,
		rphi: times(along(x, rphis), zz),
		phiphi: [-rr[0] - zz[0], -rr[1] - zz[1]],
		zz
	};
}

/** The Sun's mass, kg. */
const M_SUN = 1.98847e30;

/**
 * The amplitude of the waves' tide, s^-2, at x = r / lambda from a pair of holes of `mass` kg each turning at the
 * speed v (each, in units of c): G k w^4 / (2 c^4 r), with k = m d^2 / 4 the changing part of the second moment and
 * w = 2 Omega the waves' angular frequency.
 */
export function waveTide(v: number, x: number, mass = 30 * M_SUN): number {
	const G = 6.6743e-11;
	const c = 299_792_458;
	const d = (G * 2 * mass) / (4 * v * v * c * c);
	const omega = (2 * v * c) / d;
	const lambda = (Math.PI * c) / omega;
	const k = 0.25 * mass * d * d;
	return (G * k * (2 * omega) ** 4) / (2 * c ** 4 * x * lambda);
}

/** Separation of the pair over the wavelength, for an orbital speed v (each body), in units of c. */
export function separationOverWavelength(v: number): number {
	return (2 / Math.PI) * v;
}

/**
 * The changing tensor at a point of the plane of the orbit, (x, y) in wavelengths from the pair's centre, for holes
 * of `mass` kg each turning at the speed v: as `pairTensor`, in s^-2, with the angle phi of the point. Within the
 * orbit the expansion in multipoles does not hold, and closer than `edge` separations to the centre there is
 * nothing (a picture that hides the orbit's disc may ask for a little more, to blend up to its edge).
 */
export function pairTensorAt(
	v: number,
	x: number,
	y: number,
	mass?: number,
	edge = 0.8
): { phi: number; rr: Complex2; rphi: Complex2; phiphi: Complex2; zz: Complex2 } | undefined {
	const r = Math.hypot(x, y);
	if (r < edge * separationOverWavelength(v)) return undefined;
	const t = pairTensor(r);
	const s = waveTide(v, r, mass);
	const scale = (z: Complex2): Complex2 => [z[0] * s, z[1] * s];
	return {
		phi: Math.atan2(y, x),
		rr: scale(t.rr),
		rphi: scale(t.rphi),
		phiphi: scale(t.phiphi),
		zz: scale(t.zz)
	};
}

/**
 * The strength the view's scale is set against, s^-2: the median, over a 7 x 5 grid across a view `reach`
 * wavelengths each way from the pair, of the root mean square of the field's size over a wave period,
 * sqrt(sum |c_ij|^2 / 4) (the size being sqrt(sum E_ij^2 / 2), as in lib/pixel/field-view.ts).
 */
export function pairScale(v: number, reach: number, mass?: number): number {
	const sizes: number[] = [];
	const sq = (z: Complex2) => z[0] * z[0] + z[1] * z[1];
	for (let j = 0; j < 5; j++)
		for (let i = 0; i < 7; i++) {
			const t = pairTensorAt(v, ((i / 6) * 2 - 1) * reach, ((j / 4) * 2 - 1) * reach, mass);
			if (t) sizes.push(Math.sqrt((sq(t.rr) + sq(t.phiphi) + sq(t.zz) + 2 * sq(t.rphi)) / 4));
		}
	sizes.sort((a, b) => a - b);
	return Math.max(sizes[Math.floor(sizes.length / 2)] ?? 0, 1e-300);
}

/** The table, for drawing. */
export const pairTable = { x: xs, strength: strengths };

/** The primordial graviton background and our motion through it. */
export const primordial = vistas.primordial;
