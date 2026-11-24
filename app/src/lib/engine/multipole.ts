/**
 * The all-zone tide of a turning pair in the plane of its orbit: chapter 7.7's eq:plane-tide, from the paper's
 * eq:multipole kept to the mass quadrupole.
 *
 * Two equal masses m a distance d apart turn at Ω about the z axis, anticlockwise seen from +z. Their changing second
 * moment, the chapter's turning table, is Re[−½ΔI (1 i; i −1) e^{−2iΩt}] with ΔI = m d²/2: at t = 0 they lie on the
 * y axis, and at time t along the angle Ωt + π/2. With k = 2Ω/c and a pixel at (r cos φ, r sin φ, 0), the tide across
 * the plane is
 *
 *   𝓔_zz = Re[(GΔI/4r⁵) ((kr)⁴ + 2i(kr)³ + 3(kr)² + 15i kr − 15) e^{i(kr + 2φ − 2Ωt)}].
 *
 * At φ = 0 this is the chapter's formula. The factor e^{2iφ} comes from n·q·n = −½ΔI e^{2iφ} for n = (cos φ, sin φ, 0):
 * the field at (r, φ) at time t is the field at (r, 0) at the time t − φ/Ω, so the pattern turns with the masses. The
 * bracket is the coefficient c of the closed-form tide of a turning quadrupole in ../pixel/quadrupole.ts, the only
 * term left there for 𝓔_zz in the plane (q_zz = q_zn = 0); multipole.spec.ts checks the two against each other, and
 * against the table of the paper's own figure (reference/fixtures/vistas.json, from reference/gravcam/binary.py).
 *
 * The squared size of the bracket is 225 + 135(kr)² + 39(kr)⁴ + 10(kr)⁶ + (kr)⁸, so the changing tide has the
 * amplitude (GΔI/4r⁵)√(…). Near the pair only the 15 is left, Newton's tide (15/4)GΔI/r⁵; far away only the (kr)⁴, the
 * wave 4GΔIΩ⁴/c⁴r. They are equal where (kr)⁴ = 15, at r = (15/16)^{1/4} c/Ω = 0.313λ, λ = πc/Ω.
 */
import { C, G } from './physics/constants';

/** The Sun's mass, kg (the reference's M_sun). */
export const M_SUN = 1.98847e30;

/** A complex number as [real, imaginary]. */
export type Complex = [number, number];

// --- the bracket, as a function of x = kr alone ---------------------------------------------------------------------

/** The bracket (kr)⁴ + 2i(kr)³ + 3(kr)² + 15i kr − 15. */
export const bracket = (x: number): Complex => [x ** 4 + 3 * x * x - 15, 2 * x ** 3 + 15 * x];

/** Its squared size in closed form, 225 + 135(kr)² + 39(kr)⁴ + 10(kr)⁶ + (kr)⁸. */
export const bracketSquared = (x: number) => {
	const s = x * x;
	return 225 + s * (135 + s * (39 + s * (10 + s)));
};

/** Its size. */
export const bracketSize = (x: number) => Math.sqrt(bracketSquared(x));

/** Its phase, in (−π, π]: π near the pair, where it is −15, and 0 far away, where it is (kr)⁴. */
export const bracketPhase = (x: number) => {
	const [re, im] = bracket(x);
	return Math.atan2(im, re);
};

/**
 * The phase of the pattern at (kr, φ) at t = 0: 𝓔_zz = |…| cos(ψ − 2Ωt) with ψ = kr + 2φ + arg(bracket). A crest
 * stands where ψ − 2Ωt is a multiple of 2π; at a fixed time it lies along φ = −(kr + arg)/2 + const, a trailing
 * two-armed spiral beyond λ/2π.
 */
export const patternPhase = (x: number, phi: number) => x + 2 * phi + bracketPhase(x);

// --- the two laws and the exact field, in units of the wave ---------------------------------------------------------

/** The exact field over Newton's tide, √(…)/15: 1 near the pair. */
export const overNear = (x: number) => bracketSize(x) / 15;
/** The exact field over the wave's tide, √(…)/(kr)⁴: 1 far away. */
export const overFar = (x: number) => bracketSize(x) / x ** 4;
/** The wave's tide over Newton's, (kr)⁴/15: 1 at the crossing. */
export const farOverNear = (x: number) => x ** 4 / 15;

/**
 * r|𝓔_zz| in units of GΔIΩ⁴/c⁴, as the chapter's crossover diagram draws it: (c/Ωr)⁴ = 16/(kr)⁴, so the exact field is
 * 4√(…)/(kr)⁴, Newton's tide 60/(kr)⁴ and the wave 4.
 */
export const scaledExact = (x: number) => (4 * bracketSize(x)) / x ** 4;
export const scaledNear = (x: number) => 60 / x ** 4;
export const scaledFar = () => 4;

/**
 * The local law of the exact field, d ln|𝓔_zz| / d ln r = −5 + ½ d ln(…)/d ln(kr): −5 near the pair, Newton's r⁻⁵, and
 * −1 far away, the wave's r⁻¹. It falls steadily from one to the other.
 */
export function localLaw(x: number): number {
	const s = x * x;
	const slope = s * (270 + s * (156 + s * (60 + 8 * s)));
	return -5 + slope / (2 * bracketSquared(x));
}

/** kr where the two laws cross, (kr)⁴ = 15: 1.968. */
export const CROSSING_KR = 15 ** 0.25;
/** The same in wavelengths, kr/2π: 0.3133. */
export const CROSSING = CROSSING_KR / (2 * Math.PI);

/** kr at which the local law is n, for n between −5 and −1, by bisection in log kr (the law falls monotonically). */
export function lawAt(n: number): number {
	if (!(n > -5 && n < -1)) return NaN;
	let lo = Math.log(1e-4);
	let hi = Math.log(1e4);
	for (let i = 0; i < 200; i++) {
		const mid = 0.5 * (lo + hi);
		if (localLaw(Math.exp(mid)) < n) lo = mid;
		else hi = mid;
		if (hi - lo < 1e-14) break;
	}
	return Math.exp(0.5 * (lo + hi));
}

/** kr where the local law passes r⁻³, halfway between r⁻⁵ and r⁻¹: 1.948, 0.310λ. */
export const LAW3_KR = lawAt(-3);
export const LAW3 = LAW3_KR / (2 * Math.PI);

// --- a pair in SI units ---------------------------------------------------------------------------------------------

/** Two equal masses `mass` (kg each) a distance `separation` (m) apart, turning at `omega` (s⁻¹). */
export interface Pair {
	mass: number;
	separation: number;
	omega: number;
}

/** The rate of a circular orbit by Kepler's law, Ω = √(2Gm/d³). */
export const keplerRate = (mass: number, separation: number, g = G) =>
	Math.sqrt((2 * g * mass) / separation ** 3);

/** The pair on its Newtonian circular orbit. */
export const boundPair = (mass: number, separation: number): Pair => ({
	mass,
	separation,
	omega: keplerRate(mass, separation)
});

/** The difference of the principal values of the second moment, ΔI = m d²/2. */
export const deltaI = (p: Pair) => (p.mass * p.separation ** 2) / 2;
/** The speed of each mass, v = Ωd/2. */
export const orbitalSpeed = (p: Pair) => (p.omega * p.separation) / 2;
/** The wavenumber of the waves, at twice the orbital rate: k = 2Ω/c. */
export const wavenumber = (omega: number, c = C) => (2 * omega) / c;
/** Their wavelength, λ = πc/Ω. */
export const wavelength = (omega: number, c = C) => (Math.PI * c) / omega;
/** The distance in the plane at which the two laws cross, 0.313λ. */
export const crossingDistance = (omega: number, c = C) => CROSSING * wavelength(omega, c);

/** Where the two masses are at time t, as their angle from the x axis: Ωt + π/2 (on the y axis at t = 0). */
export const pairAngle = (p: Pair, t: number) => p.omega * t + Math.PI / 2;

/** 𝓔_zz at (r cos φ, r sin φ, 0) at time t, s⁻². */
export function planeTide(p: Pair, r: number, phi: number, t: number, c = C): number {
	const x = wavenumber(p.omega, c) * r;
	const [re, im] = bracket(x);
	const scale = (G * deltaI(p)) / (4 * r ** 5);
	const phase = x + 2 * phi - 2 * p.omega * t;
	return scale * (re * Math.cos(phase) - im * Math.sin(phase));
}

/** Its amplitude, (GΔI/4r⁵)√(225 + 135(kr)² + 39(kr)⁴ + 10(kr)⁶ + (kr)⁸). */
export const planeAmplitude = (p: Pair, r: number, c = C) =>
	((G * deltaI(p)) / (4 * r ** 5)) * bracketSize(wavenumber(p.omega, c) * r);

/** Newton's changing tide across the plane, (15/4)GΔI/r⁵. */
export const nearLaw = (p: Pair, r: number) => (15 / 4) * ((G * deltaI(p)) / r ** 5);

/** The wave's, 4GΔIΩ⁴/c⁴r. */
export const farLaw = (p: Pair, r: number, c = C) =>
	(4 * G * deltaI(p) * p.omega ** 4) / (c ** 4 * r);
