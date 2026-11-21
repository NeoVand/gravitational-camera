/** Push and weigh: what an impulsive tide of each degree reads of a round body, exactly and by pushing particles. */
import { describe, expect, it } from 'vitest';
import type { Vec3 } from '../pixel/complex';
import {
	DEGREES,
	PAIRS,
	PARTICLES,
	THRESHOLD,
	compare,
	energyGained,
	exactEnergy,
	fibonacciSphere,
	firstDegreeThatSeparates,
	placesFor,
	push,
	pushAndWeigh,
	radialMoment,
	reading,
	sameReading,
	sampleBody,
	sphereAverage,
	tide,
	tideGradient,
	weigh,
	type Body
} from './ladder';

const pairs = Object.values(PAIRS);
const bodies = pairs.flatMap((pair) => [pair.a, pair.b]);
const points: Vec3[] = [
	[0.3, -0.7, 0.2],
	[-0.55, 0.4, -0.6],
	[0.9, 0.1, 0.05],
	[0, 0, 0.8]
];

describe('the tide of degree l', () => {
	it('is the harmonic polynomial Re (x + iy)^l / l', () => {
		for (const [x, y, z] of points) {
			expect(tide(2, [x, y, z])).toBeCloseTo((x * x - y * y) / 2, 14);
			expect(tide(3, [x, y, z])).toBeCloseTo((x ** 3 - 3 * x * y * y) / 3, 14);
		}
		// harmonic: it does not depend on z, and its mean over a circle in a plane of constant z is its value at
		// the centre (twelve points on the circle give the mean of a polynomial of degree five exactly)
		for (const l of DEGREES)
			for (const [x, y, z] of points) {
				let mean = 0;
				for (let k = 0; k < 12; k++) {
					const angle = (k * Math.PI) / 6;
					mean += tide(l, [x + 0.3 * Math.cos(angle), y + 0.3 * Math.sin(angle), z]) / 12;
				}
				expect(mean).toBeCloseTo(tide(l, [x, y, z]), 14);
				expect(tide(l, [x, y, z + 0.4])).toBe(tide(l, [x, y, z]));
			}
	});

	it('gives each place the velocity grad g, of square (x^2 + y^2)^(l-1)', () => {
		const h = 1e-5;
		for (const l of DEGREES)
			for (const p of points) {
				const v = tideGradient(l, p);
				const slope = (k: number) => {
					const up = [...p] as Vec3;
					const down = [...p] as Vec3;
					up[k] += h;
					down[k] -= h;
					return (tide(l, up) - tide(l, down)) / (2 * h);
				};
				for (const k of [0, 1, 2]) expect(v[k]).toBeCloseTo(slope(k), 8);
				expect(v[0] ** 2 + v[1] ** 2 + v[2] ** 2).toBeCloseTo(
					(p[0] ** 2 + p[1] ** 2) ** (l - 1),
					14
				);
			}
		// the quadrupole stretches along x and squeezes along y; nothing moves at the centre
		expect(tideGradient(2, [1, 0, 0])).toEqual([1, 0, 0]);
		expect(tideGradient(2, [0, 1, 0])).toEqual([0, -1, 0]);
		for (const l of DEGREES) expect(tideGradient(l, [0, 0, 0])).toEqual([0, 0, 0]);
	});

	it('has 2l lobes: along a circle about the z axis it goes as cos(l phi)', () => {
		for (const l of DEGREES)
			for (let k = 0; k < 2 * l; k++) {
				const phi = (k * Math.PI) / l;
				const middle: Vec3 = [0.8 * Math.cos(phi), 0.8 * Math.sin(phi), 0];
				// outward at the middle of one lobe, inward at the middle of the next
				const v = tideGradient(l, middle);
				const outward = (v[0] * middle[0] + v[1] * middle[1]) / 0.8;
				expect(outward).toBeCloseTo((k % 2 ? -1 : 1) * 0.8 ** (l - 1), 12);
				expect(Math.sign(tide(l, middle))).toBe(k % 2 ? -1 : 1);
			}
	});

	it('averages its squared gradient over a sphere to c_l = (2n)!!/(2n+1)!!', () => {
		expect(sphereAverage(1)).toBe(1);
		expect(sphereAverage(2)).toBeCloseTo(2 / 3, 15);
		expect(sphereAverage(3)).toBeCloseTo(8 / 15, 15);
		expect(sphereAverage(4)).toBeCloseTo(16 / 35, 15);
		expect(sphereAverage(5)).toBeCloseTo(128 / 315, 15);
		// against the integral itself: the mean of (1 - z^2)^(l-1) over -1 < z < 1, by Simpson's rule
		const steps = 2000;
		for (const l of DEGREES) {
			let sum = 0;
			for (let i = 0; i <= steps; i++) {
				const z = -1 + (2 * i) / steps;
				sum += (i === 0 || i === steps ? 1 : i % 2 ? 4 : 2) * (1 - z * z) ** (l - 1);
			}
			expect(sum / (3 * steps)).toBeCloseTo(sphereAverage(l), 11);
		}
	});
});

describe('the three pairs', () => {
	it('have the same mass, so the same field outside', () => {
		for (const body of bodies) expect(radialMoment(body, 0)).toBeCloseTo(1, 14);
		for (const { a, b } of pairs) expect(sameReading(a, b, 1)).toBe(true);
	});

	it('a point and a shell differ already under the quadrupole', () => {
		const { a, b } = PAIRS.point;
		expect(reading(a, 2)).toBe(0);
		expect(reading(b, 2)).toBeCloseTo(2 / 3, 12);
		expect(exactEnergy(a, 2)).toBe(0);
		expect(exactEnergy(b, 2)).toBeCloseTo(1 / 3, 12);
	});

	it('the second pair has the same second moment: alike under the quadrupole, one to two under the octupole', () => {
		const { a, b } = PAIRS.second;
		expect(radialMoment(a, 2)).toBeCloseTo(1 / 2, 12);
		expect(radialMoment(b, 2)).toBeCloseTo(1 / 2, 12);
		expect(reading(a, 2)).toBeCloseTo(1 / 3, 12);
		expect(reading(b, 2)).toBeCloseTo(1 / 3, 12);
		expect(reading(a, 3)).toBeCloseTo(2 / 15, 12);
		expect(reading(b, 3)).toBeCloseTo(4 / 15, 12);
		expect(reading(b, 3) / reading(a, 3)).toBeCloseTo(2, 12);
	});

	it('the third pair has the same second and fourth moments: the hexadecapole is the first to differ', () => {
		const { a, b } = PAIRS.fourth;
		for (const body of [a, b]) {
			expect(radialMoment(body, 2)).toBeCloseTo(1 / 2, 12);
			expect(radialMoment(body, 4)).toBeCloseTo(5 / 16, 12);
		}
		expect(radialMoment(a, 6)).toBeCloseTo(0.21875, 12);
		expect(radialMoment(b, 6)).toBeCloseTo(0.1953125, 12);
		expect(reading(a, 2)).toBeCloseTo(reading(b, 2), 12);
		expect(reading(a, 3)).toBeCloseTo(reading(b, 3), 12);
		expect(reading(a, 4)).toBeCloseTo(0.1, 12);
		expect(reading(b, 4)).toBeCloseTo((16 / 35) * 0.1953125, 12);
		expect(reading(b, 4)).toBeCloseTo(0.0892857142857, 12);
	});

	it('each is told apart first by the tide of its own degree, and by every higher one here', () => {
		expect(firstDegreeThatSeparates(PAIRS.point.a, PAIRS.point.b)).toBe(2);
		expect(firstDegreeThatSeparates(PAIRS.second.a, PAIRS.second.b)).toBe(3);
		expect(firstDegreeThatSeparates(PAIRS.fourth.a, PAIRS.fourth.b)).toBe(4);
		for (const { a, b } of pairs) {
			const first = firstDegreeThatSeparates(a, b)!;
			for (const l of DEGREES) expect(sameReading(a, b, l)).toBe(l < first);
		}
	});

	it('nothing tells a body from itself, and a uniform push tells a heavier body', () => {
		const { a } = PAIRS.second;
		expect(firstDegreeThatSeparates(a, a)).toBeUndefined();
		const heavier: Body = {
			name: 'the same shell, heavier',
			shells: [{ ...a.shells[0], mass: 2 }]
		};
		expect(firstDegreeThatSeparates(a, heavier)).toBe(1);
	});

	it('the energy gained is half the reading, times the square of the strength', () => {
		for (const body of bodies)
			for (const l of DEGREES) {
				expect(exactEnergy(body, l)).toBe(0.5 * reading(body, l));
				expect(exactEnergy(body, l, 0.3)).toBeCloseTo(0.09 * exactEnergy(body, l), 15);
			}
	});
});

describe('the same, by pushing particles', () => {
	it('a Fibonacci sphere: unit vectors, their heights the middles of equal bands', () => {
		const n = 500;
		const sphere = fibonacciSphere(n);
		expect(sphere).toHaveLength(n);
		for (const u of sphere) expect(Math.hypot(...u)).toBeCloseTo(1, 14);
		expect(sphere[0][2]).toBeCloseTo(1 - 1 / n, 14);
		expect(sphere[n - 1][2]).toBeCloseTo(-1 + 1 / n, 14);
		// evenly spread: the centre of the points lies near the centre of the sphere
		for (const k of [0, 1, 2])
			expect(Math.abs(sphere.reduce((sum, u) => sum + u[k], 0) / n)).toBeLessThan(5e-3);
	});

	it('a body is n equal particles on each shell, and one for a point at the centre', () => {
		const n = 300;
		for (const body of bodies) {
			const particles = sampleBody(body, n);
			const centres = body.shells.filter((s) => s.radius === 0).length;
			expect(particles).toHaveLength(centres + n * (body.shells.length - centres));
			expect(particles.reduce((sum, p) => sum + p.mass, 0)).toBeCloseTo(1, 12);
			const radii = body.shells.map((s) => s.radius);
			for (const p of particles) {
				const r = Math.hypot(...p.position);
				expect(radii.some((radius) => Math.abs(r - radius) < 1e-14)).toBe(true);
			}
			// the particles carry the body's radial moments
			for (const k of [2, 4, 6])
				expect(
					particles.reduce((sum, p) => sum + p.mass * Math.hypot(...p.position) ** k, 0)
				).toBeCloseTo(radialMoment(body, k), 12);
		}
	});

	it('outside, the particles of every body pull as its mass at the centre would: the shell theorem', () => {
		const outside: Vec3[] = [
			[2.5, 0, 0],
			[0.9, -1.1, 0.6],
			[0, 0, 1.3],
			[-1.2, 0.2, 0.4]
		];
		for (const body of bodies) {
			const particles = sampleBody(body, PARTICLES);
			for (const x of outside) {
				const d = Math.hypot(...x);
				let potential = 0;
				const field: Vec3 = [0, 0, 0];
				for (const p of particles) {
					const r = x.map((c, k) => c - p.position[k]);
					const s = Math.hypot(...r);
					potential += p.mass / s;
					for (const k of [0, 1, 2]) field[k] -= (p.mass * r[k]) / s ** 3;
				}
				// with G = 1: the potential M / d and the field M / d^2 toward the centre, to the sampling error,
				// which is largest just outside a shell
				expect(Math.abs(potential * d - 1)).toBeLessThan(1e-5);
				expect(Math.hypot(...field.map((g, k) => g * d * d + x[k] / d))).toBeLessThan(1e-3);
			}
		}
	});

	it('a push gives each particle eps grad g where it stands, and none at the centre', () => {
		const particles = sampleBody(PAIRS.second.b, 50);
		const velocities = push(particles, 3, 0.25);
		expect(velocities).toHaveLength(particles.length);
		particles.forEach((p, i) => {
			const g = tideGradient(3, p.position);
			for (const k of [0, 1, 2]) expect(velocities[i][k]).toBeCloseTo(0.25 * g[k], 15);
		});
		expect(velocities[0]).toEqual([0, 0, 0]);
	});

	it('the energy summed over the particles is the exact one, to the sampling error', () => {
		let worst = 0;
		for (const body of bodies)
			for (const l of DEGREES) {
				const particles = sampleBody(body, PARTICLES);
				const exact = exactEnergy(body, l);
				const simulated = energyGained(particles, push(particles, l, 1));
				if (exact === 0) expect(simulated).toBe(0);
				else worst = Math.max(worst, Math.abs(simulated / exact - 1));
			}
		// the squared velocity depends on the height alone, where the particles are a midpoint rule: with n to a
		// shell the error is 1/(2 n^2) of the whole for the quadrupole, and far less for the higher tides
		expect(worst).toBeLessThan(1e-6);
		expect(worst).toBeCloseTo(1 / (2 * PARTICLES ** 2), 10);
	});

	it('the sampling error falls as the square of the number of particles', () => {
		const { b } = PAIRS.point;
		const error = (n: number) => {
			const particles = sampleBody(b, n);
			return Math.abs(energyGained(particles, push(particles, 2, 1)) / exactEnergy(b, 2) - 1);
		};
		expect(error(200)).toBeCloseTo(1 / (2 * 200 ** 2), 9);
		expect(error(200) / error(2000)).toBeCloseTo(100, 0);
	});

	it('the energy goes as the square of the strength of the push', () => {
		const particles = sampleBody(PAIRS.fourth.a, 400);
		const one = energyGained(particles, push(particles, 4, 1));
		expect(energyGained(particles, push(particles, 4, 0.3))).toBeCloseTo(0.09 * one, 14);
		expect(energyGained(particles, push(particles, 4, -1))).toBeCloseTo(one, 14);
	});
});

describe('weighing, with noise', () => {
	const { a, b } = PAIRS.second;

	it('readings are the energy plus the noise; their mean has the error sigma / sqrt(N)', () => {
		const w = weigh(0.5, 0.25, [1, -1, 2, 0]);
		expect(w.readings).toEqual([0.75, 0.25, 1, 0.5]);
		expect(w.mean).toBe(0.625);
		expect(w.error).toBe(0.125);
	});

	it('a mean and its error are written to the places that show the error to two figures', () => {
		expect(placesFor(0.0063)).toBe(4);
		expect(placesFor(0.05)).toBe(3);
		expect(placesFor(0.00005)).toBe(6);
		// never fewer than three or more than seven, and five where there is no error to show
		expect(placesFor(0.4)).toBe(3);
		expect(placesFor(1e-12)).toBe(7);
		expect(placesFor(0)).toBe(5);
	});

	it('two bodies are told apart by a difference of more than three standard errors', () => {
		const at = (mean: number, error: number) => ({ readings: [mean], mean, error });
		const near = compare(at(1, 0.03), at(1.12, 0.04));
		expect(near.difference).toBeCloseTo(0.12, 14);
		expect(near.error).toBeCloseTo(0.05, 14);
		expect(near.sigmas).toBeCloseTo(2.4, 12);
		expect(near.apart).toBe(false);
		const far = compare(at(1.2, 0.03), at(1, 0.04));
		expect(far.difference).toBeCloseTo(-0.2, 14);
		expect(far.sigmas).toBeCloseTo(4, 12);
		expect(far.apart).toBe(true);
		expect(THRESHOLD).toBe(3);
	});

	it('without noise the readings are exact: told apart by any difference but one of rounding', () => {
		const same = pushAndWeigh(a, b, 2, 0, 7, 1);
		expect(same.a.mean).toBeCloseTo(exactEnergy(a, 2), 14);
		expect(same.error).toBe(0);
		expect(same.sigmas).toBe(0);
		expect(same.apart).toBe(false);
		const different = pushAndWeigh(a, b, 3, 0, 7, 1);
		expect(different.difference).toBeCloseTo(1 / 15, 14);
		expect(different.sigmas).toBe(Infinity);
		expect(different.apart).toBe(true);
	});

	it('the same seed gives the same weighings, another seed others, and more pushes add to those made', () => {
		const first = pushAndWeigh(a, b, 3, 0.02, 10, 5);
		expect(pushAndWeigh(a, b, 3, 0.02, 10, 5)).toEqual(first);
		expect(pushAndWeigh(a, b, 3, 0.02, 10, 6).a.readings).not.toEqual(first.a.readings);
		const more = pushAndWeigh(a, b, 3, 0.02, 25, 5);
		expect(more.a.readings.slice(0, 10)).toEqual(first.a.readings);
		expect(more.b.readings.slice(0, 10)).toEqual(first.b.readings);
		expect(more.a.readings).toHaveLength(25);
		expect(first.a.error).toBeCloseTo(0.02 / Math.sqrt(10), 15);
		expect(first.error).toBeCloseTo(0.02 * Math.sqrt(2 / 10), 15);
	});

	it('the means scatter about the exact energies by their standard error, A and B independently', () => {
		const seeds = 4000;
		const sum = { a: 0, b: 0, aa: 0, bb: 0, ab: 0 };
		for (let seed = 1; seed <= seeds; seed++) {
			const w = pushAndWeigh(a, b, 3, 0.02, 10, seed);
			const za = (w.a.mean - exactEnergy(a, 3)) / w.a.error;
			const zb = (w.b.mean - exactEnergy(b, 3)) / w.b.error;
			sum.a += za;
			sum.b += zb;
			sum.aa += za * za;
			sum.bb += zb * zb;
			sum.ab += za * zb;
		}
		// each is a standard normal number: over 4000 seeds its mean is zero to about 0.016, its mean square one to
		// about 0.022, and the mean of the product of the two zero to about 0.016; the bounds are five times those
		expect(Math.abs(sum.a / seeds)).toBeLessThan(0.08);
		expect(Math.abs(sum.b / seeds)).toBeLessThan(0.08);
		expect(Math.abs(sum.aa / seeds - 1)).toBeLessThan(0.11);
		expect(Math.abs(sum.bb / seeds - 1)).toBeLessThan(0.11);
		expect(Math.abs(sum.ab / seeds)).toBeLessThan(0.08);
	});

	it('the quadrupole does not tell the second pair apart, whatever the noise; the octupole does', () => {
		let quadrupole = 0;
		let octupole = 0;
		const seeds = 2000;
		for (let seed = 1; seed <= seeds; seed++) {
			if (pushAndWeigh(a, b, 2, 0.02, 10, seed).apart) quadrupole++;
			if (pushAndWeigh(a, b, 3, 0.02, 10, seed).apart) octupole++;
		}
		// under the quadrupole only the noise differs: three standard errors are passed 27 times in ten thousand
		expect(quadrupole).toBeLessThan(0.01 * seeds);
		// under the octupole the two stand 7.5 standard errors apart
		expect(octupole).toBe(seeds);
	});

	it('the third pair needs a finer balance or more pushes', () => {
		const { a: c, b: d } = PAIRS.fourth;
		const gap = exactEnergy(c, 4) - exactEnergy(d, 4);
		expect(gap).toBeCloseTo(0.05 - 0.04464285714286, 12);
		const told = (sigma: number, count: number) => {
			let n = 0;
			for (let seed = 1; seed <= 500; seed++)
				if (pushAndWeigh(c, d, 4, sigma, count, seed).apart) n++;
			return n / 500;
		};
		// 1.2 standard errors apart, then 3.8, then 12
		expect(told(0.01, 10)).toBeLessThan(0.1);
		expect(told(0.01, 100)).toBeGreaterThan(0.6);
		expect(told(0.001, 10)).toBe(1);
	});
});
