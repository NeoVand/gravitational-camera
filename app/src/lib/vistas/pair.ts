/**
 * The changing tidal field of an orbiting pair in the plane of its orbit, for
 * the vista demo: E_zz(r, phi, t) = A(r) cos(2 Omega t - 2 phi + delta(r)),
 * from the linearized solution, truncated at the mass quadrupole, in the reference implementation
 * (reference/gravcam/binary.py, exported by gravcam.export_vistas). At the
 * order of the quadrupole, A and delta depend on r only through x = r / lambda,
 * lambda being the wavelength of the waves; the table holds x A(x), in units
 * of its value in the waves, and eta = delta + 2 pi x.
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

/** Separation of the pair over the wavelength, for an orbital speed v (each body), in units of c. */
export function separationOverWavelength(v: number): number {
	return (2 / Math.PI) * v;
}

/** The table, for drawing. */
export const pairTable = { x: xs, strength: strengths };

/** The primordial graviton background and our motion through it. */
export const primordial = vistas.primordial;
