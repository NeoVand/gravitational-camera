/**
 * Push and weigh (paper, Section XIII, Eqs. push and ladder; reference/gravcam/readings.py, "The ladder"). A body's
 * field outside it, read at one time, gives only the harmonic moments of its mass. A tide applied from outside as an
 * impulse, followed by a weighing, gives more: an impulse of profile g, a harmonic polynomial, and strength eps
 * gives every part of the body the velocity eps grad g where it stands, and a body at rest gains the energy
 *
 *     dE = (eps^2 / 2) int rho |grad g|^2 dV,
 *
 * exactly in Newton's mechanics. How much of the interior is reached depends on the degree of the tide: tides of
 * degree up to m reach, in every angular sector, exactly the radial moments int rho r^(L + 2j) Y_LM dV with j < m.
 * For a round body a tide of degree l reads the single number M <r^(2l - 2)>. So there are bodies with the same
 * field outside that no tide of degree l tells apart and a tide of degree l + 1 does (PAIRS).
 *
 * Bodies here are round and made of thin shells. Units: total mass M = 1, outer radius R = 1, energies in units
 * of eps^2 M R^(2l - 2). Used by the figure "Push and weigh" (routes/figures/push-and-weigh).
 */
import { normals } from '../array/random';
import type { Vec3 } from '../pixel/complex';

/** A thin round shell about the centre. A radius of zero is a point at the centre. */
export interface Shell {
	mass: number;
	radius: number;
}

/** A round body made of thin shells; its name says what they are. */
export interface Body {
	name: string;
	shells: Shell[];
}

/** Two bodies with the same mass and, by the shell theorem, the same field outside. */
export interface Pair {
	/** what the two share beyond that */
	label: string;
	a: Body;
	b: Body;
}

export type PairName = 'point' | 'second' | 'fourth';

/**
 * Three pairs, one for each of the first three degrees of tide:
 *  - point: they differ already under the quadrupole;
 *  - second: the same <r^2> = 1/2, so the quadrupole reads them alike and the octupole reads one as twice the other;
 *  - fourth: the same <r^2> = 1/2 and <r^4> = 5/16, so neither of those tells them apart and the hexadecapole does.
 */
export const PAIRS: Record<PairName, Pair> = {
	point: {
		label: 'A point and a shell',
		a: { name: 'a point at the centre', shells: [{ mass: 1, radius: 0 }] },
		b: { name: 'a shell of radius R', shells: [{ mass: 1, radius: 1 }] }
	},
	second: {
		label: 'Same second moment',
		a: { name: 'a shell of radius R/√2', shells: [{ mass: 1, radius: Math.SQRT1_2 }] },
		b: {
			name: 'half at the centre, half on a shell of radius R',
			shells: [
				{ mass: 1 / 2, radius: 0 },
				{ mass: 1 / 2, radius: 1 }
			]
		}
	},
	fourth: {
		label: 'Same second and fourth moments',
		a: {
			name: 'two equal shells, of radii R/2 and √3R/2',
			shells: [
				{ mass: 1 / 2, radius: 1 / 2 },
				{ mass: 1 / 2, radius: Math.sqrt(3) / 2 }
			]
		},
		b: {
			name: 'a fifth at the centre, the rest on a shell of radius √(5/8)R',
			shells: [
				{ mass: 1 / 5, radius: 0 },
				{ mass: 4 / 5, radius: Math.sqrt(5 / 8) }
			]
		}
	}
};

/** The degrees of tide the figure offers, and their names. */
export const DEGREES = [2, 3, 4, 5] as const;
export type Degree = (typeof DEGREES)[number];
export const TIDE_NAMES: Record<Degree, string> = {
	2: 'quadrupole',
	3: 'octupole',
	4: 'hexadecapole',
	5: 'degree five'
};

/** Particles on each shell in the figure's simulation. */
export const PARTICLES = 2000;

// --- the tide ----------------------------------------------------------------------------------------------------------

/** (x + i y)^n for a whole number n, as its real and imaginary parts. */
function power(x: number, y: number, n: number): [number, number] {
	let re = 1,
		im = 0;
	for (let i = 0; i < n; i++) [re, im] = [re * x - im * y, re * y + im * x];
	return [re, im];
}

/**
 * The tide of degree l: g_l = Re[(x + i y)^l] / l, a harmonic polynomial with 2l lobes about the z axis.
 * g_2 = (x^2 - y^2) / 2 and g_3 = (x^3 - 3 x y^2) / 3.
 */
export function tide(l: number, x: Vec3): number {
	return power(x[0], x[1], l)[0] / l;
}

/** Its gradient, (Re w^(l-1), -Im w^(l-1), 0) with w = x + i y, of square (x^2 + y^2)^(l-1). */
export function tideGradient(l: number, x: Vec3): Vec3 {
	const [re, im] = power(x[0], x[1], l - 1);
	// 0 - im, so that no component is a negative zero
	return [re, 0 - im, 0];
}

/**
 * The mean of |grad g_l|^2 over a sphere of radius one: c_l = <sin^(2l-2) theta> = (2n)!! / (2n + 1)!! with
 * n = l - 1. c_2 = 2/3, c_3 = 8/15, c_4 = 16/35, c_5 = 128/315.
 */
export function sphereAverage(l: number): number {
	let c = 1;
	for (let k = 1; k < l; k++) c *= (2 * k) / (2 * k + 1);
	return c;
}

// --- what a tide reads, exactly ----------------------------------------------------------------------------------------

/** The radial moment of a body, the sum of mass radius^k over its shells: its mass for k = 0, M <r^k> in general. */
export function radialMoment(body: Body, k: number): number {
	return body.shells.reduce((sum, shell) => sum + shell.mass * shell.radius ** k, 0);
}

/** What a tide of degree l reads of a round body: int rho |grad g_l|^2 dV = c_l M <r^(2l-2)>. */
export function reading(body: Body, l: number): number {
	return sphereAverage(l) * radialMoment(body, 2 * l - 2);
}

/** The energy a body at rest gains from an impulse of profile g_l and strength eps: (eps^2 / 2) of its reading. */
export function exactEnergy(body: Body, l: number, eps = 1): number {
	return 0.5 * eps * eps * reading(body, l);
}

/** Two numbers closer than this part of the larger are equal: what rounding leaves of an exact equality. */
const ROUNDING = 1e-12;

const equal = (p: number, q: number) =>
	Math.abs(p - q) <= ROUNDING * Math.max(Math.abs(p), Math.abs(q));

/** Whether a tide of degree l reads two bodies alike. */
export function sameReading(a: Body, b: Body, l: number): boolean {
	return equal(reading(a, l), reading(b, l));
}

/**
 * The lowest degree of tide that tells two round bodies apart, looking up to `highest`; undefined if none does.
 * Degree 1 is a uniform push, which reads the mass: two bodies it tells apart differ already in their field outside.
 */
export function firstDegreeThatSeparates(a: Body, b: Body, highest = 12): number | undefined {
	for (let l = 1; l <= highest; l++) if (!sameReading(a, b, l)) return l;
	return undefined;
}

// --- the same, by pushing particles -------------------------------------------------------------------------------------

export interface Particle {
	position: Vec3;
	mass: number;
}

/**
 * n directions spread evenly over the sphere, on a Fibonacci spiral: their heights z are the middles of n equal
 * bands, and each is turned from the last by the golden angle.
 */
export function fibonacciSphere(n: number): Vec3[] {
	const golden = Math.PI * (3 - Math.sqrt(5));
	return Array.from({ length: n }, (_, i) => {
		const z = 1 - (2 * i + 1) / n;
		const s = Math.sqrt(1 - z * z);
		return [s * Math.cos(i * golden), s * Math.sin(i * golden), z];
	});
}

/** A body as particles: n equal ones on each shell, on a Fibonacci sphere, and one for a point at the centre. */
export function sampleBody(body: Body, n: number): Particle[] {
	const sphere = fibonacciSphere(n);
	return body.shells.flatMap((shell): Particle[] =>
		shell.radius === 0
			? [{ position: [0, 0, 0], mass: shell.mass }]
			: sphere.map((u) => ({
					position: [shell.radius * u[0], shell.radius * u[1], shell.radius * u[2]],
					mass: shell.mass / n
				}))
	);
}

/** The velocities an impulse of profile g_l and strength eps gives the particles: eps grad g_l where each stands. */
export function push(particles: Particle[], l: number, eps: number): Vec3[] {
	return particles.map((p) => {
		const g = tideGradient(l, p.position);
		return [eps * g[0], eps * g[1], eps * g[2]];
	});
}

/** The kinetic energy of particles with these velocities, the sum of m v^2 / 2: what a body at rest gains. */
export function energyGained(particles: Particle[], velocities: Vec3[]): number {
	return particles.reduce((sum, p, i) => {
		const v = velocities[i];
		return sum + 0.5 * p.mass * (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	}, 0);
}

// --- weighing, with noise ----------------------------------------------------------------------------------------------

/** Weighings of one body after as many pushes. */
export interface Weighing {
	/** the energy gained as each weighing read it */
	readings: number[];
	/** their mean */
	mean: number;
	/** the standard error of the mean, sigma / sqrt(N) */
	error: number;
}

/**
 * Weighings of a body that gains `energy` from each push: one reading for each number of `noise` (standard
 * normal), with Gaussian noise of standard deviation sigma.
 */
export function weigh(energy: number, sigma: number, noise: ArrayLike<number>): Weighing {
	const readings = Array.from(noise, (z) => energy + sigma * z);
	const mean = readings.reduce((sum, r) => sum + r, 0) / readings.length;
	return { readings, mean, error: sigma / Math.sqrt(readings.length) };
}

/**
 * The decimal places that show a standard error to two figures, for writing a mean and its error alike: between
 * three and seven, and five for a reading without noise.
 */
export function placesFor(error: number): number {
	return error > 0 ? Math.min(7, Math.max(3, 1 - Math.floor(Math.log10(error)))) : 5;
}

/** A difference of more than this many of its standard errors tells two bodies apart. */
export const THRESHOLD = 3;

export interface Comparison {
	/** the mean for B less the mean for A */
	difference: number;
	/** the standard error of that difference */
	error: number;
	/** the size of the difference in its standard errors; infinite for a difference read without noise */
	sigmas: number;
	/** whether the two are told apart: the difference is greater than three of its standard errors */
	apart: boolean;
}

/** What two weighings say of their bodies. */
export function compare(a: Weighing, b: Weighing): Comparison {
	const difference = b.mean - a.mean;
	const error = Math.hypot(a.error, b.error);
	// read without noise, any difference is real but one of rounding
	const real = !equal(a.mean, b.mean);
	const sigmas = error > 0 ? Math.abs(difference) / error : real ? Infinity : 0;
	return { difference, error, sigmas, apart: real && sigmas > THRESHOLD };
}

export interface Experiment extends Comparison {
	a: Weighing;
	b: Weighing;
}

/**
 * The experiment: each of two bodies is pushed `count` times by the tide of degree l, at eps = 1, and weighed after
 * each push, every weighing with Gaussian noise of standard deviation sigma, in the units of the energy. The noise
 * is drawn from the seed (lib/array/random.ts), in turn for A and for B: the same seed gives the same weighings, and
 * a larger count adds pushes to those already made.
 */
export function pushAndWeigh(
	a: Body,
	b: Body,
	l: number,
	sigma: number,
	count: number,
	seed: number
): Experiment {
	const n = Math.max(1, Math.round(count));
	const z = normals(seed, 2 * n);
	const turn = (first: number) => Array.from({ length: n }, (_, i) => z[2 * i + first]);
	const wa = weigh(exactEnergy(a, l), sigma, turn(0));
	const wb = weigh(exactEnergy(b, l), sigma, turn(1));
	return { a: wa, b: wb, ...compare(wa, wb) };
}
