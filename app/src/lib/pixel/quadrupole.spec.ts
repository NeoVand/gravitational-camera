/**
 * The field of a turning quadrupole at every distance (quadrupole.ts), against the reference's exact solution of
 * linearized gravity, which it finds by finite differences of the metric (reference/gravcam/binary.py).
 */
import { describe, expect, it } from 'vitest';
import { C } from '../engine/physics/constants';
import type { Vec3 } from '../engine/types';
import { newtonQuadrupole, quadrupoleTerms, turningQuadrupole } from './quadrupole';
import { add3, pointTide, type Mat3 } from './tide';

const pack = (m: Mat3) => [m[0][0], m[0][1], m[0][2], m[1][1], m[1][2], m[2][2]];

function expectTensor(actual: Mat3, expected: number[], rel: number) {
	const top = Math.max(...expected.map(Math.abs));
	pack(actual).forEach((v, k) => expect(Math.abs(v - expected[k])).toBeLessThanOrEqual(rel * top));
}

// pair = binary.Pair.bound(30 * M_sun, 300e3): two masses m a distance d apart, turning at omega about z, on the x
// axis at t = 0. At each point x (0.05, 0.5 and 5 wavelengths out) and t = 0.0123 s:
//   E      binary.tidal(pair, t, x)[0]: the whole field, monopole included
//   wave   pair.wave_tidal(t, x): -(1/2) d_t^2 h^TT
//   newton pair.newtonian_tidal(t, x): Newton's law for the two masses, with no delay
const pair = {
	m: 5.96541e31,
	d: 300000.0,
	omega: 543.0703928385138,
	t: 0.0123,
	points: [
		{
			x: [26064.79047193875, -43441.317453231255, 70374.93427423463],
			E: [
				-87298707.46033037, -87756421.90509966, 89882775.72209933, -19676665.122865785,
				-78860252.08533825, 106975372.45546794
			],
			wave: [
				-126822.20109548108, -57805.50591050358, 11288.774535052518, 85289.03262795208,
				74056.99763842855, 41533.16846752903
			],
			newton: [
				-1354287.2441983353, -1204508.3159595216, -13126.46694028948, 583473.4003648532,
				593425.8007279598, 770813.8438334826
			]
		},
		{
			x: [-520278.2895593163, 554963.5088632707, 416222.631647453],
			E: [
				3971.0625589117144, 16861.660169161754, 13499.638688114017, -8994.537790877883,
				-6120.654538168728, 5023.475255240613
			],
			wave: [
				6192.521454335271, 4911.429173076744, 1192.0795871500943, 181.11396606780687,
				5897.80117825552, -6373.635420403075
			],
			newton: [
				-97.04841161770628, 12749.771265781383, 9576.729659401935, -3609.823576977995,
				-11239.12676868967, 3706.8719885957016
			]
		},
		{
			x: [0.0, 5202782.895593164, -6937043.860790885],
			E: [
				-1073.315440360313, -789.6867070907288, -527.230454187869, 661.1156489882228,
				551.2658745028698, 412.1997877728051
			],
			wave: [
				-1024.016444958345, -811.7383807250716, -608.8037855438037, 655.3705247733409,
				491.5278935800055, 368.64592018500406
			],
			newton: [
				12.199675885048062, 0.00312063351064934, -0.009366721002153577, -0.9706443172365878,
				17.574600766378182, -11.229031567811479
			]
		}
	]
};

/** The pair's quadrupole: what turns, and what does not (with its trace taken out). */
const k = 0.25 * pair.m * pair.d ** 2;
const turning = turningQuadrupole(
	[
		{ mass: pair.m, offset: [pair.d / 2, 0, 0] },
		{ mass: pair.m, offset: [-pair.d / 2, 0, 0] }
	],
	[0, 0, 1]
);
const steady = {
	re: [
		[k / 3, 0, 0],
		[0, k / 3, 0],
		[0, 0, (-2 * k) / 3]
	],
	im: [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	]
};

describe('a turning quadrupole, from the masses out to the waves', () => {
	it('two masses on a shaft have the reference’s rotor_quadrupole(m d^2 / 2)', () => {
		// (dI / 2) [[1, i, 0], [i, -1, 0], [0, 0, 0]]
		expect(turning.re[0][0] / k).toBeCloseTo(1, 14);
		expect(turning.re[1][1] / k).toBeCloseTo(-1, 14);
		expect(turning.im[0][1] / k).toBeCloseTo(1, 14);
		expect(turning.im[1][0] / k).toBeCloseTo(1, 14);
		expect(turning.re[0][1]).toBe(0);
		expect(turning.re[2][2]).toBe(0);
	});

	it('the closed form is the reference’s exact field at every distance', () => {
		for (const point of pair.points) {
			const x = point.x as Vec3;
			const field = add3(
				pointTide(2 * pair.m, [0, 0, 0], x),
				quadrupoleTerms(steady, 0, x, 0)[0],
				...quadrupoleTerms(turning, 2 * pair.omega, x, pair.t)
			);
			// the reference's finite differences are good to a part in a hundred million
			expectTensor(field, point.E, 1e-7);
		}
	});

	it('its last term is the wave, -(1/2) d_t^2 h^TT', () => {
		for (const point of pair.points) {
			const terms = quadrupoleTerms(turning, 2 * pair.omega, point.x as Vec3, pair.t);
			expectTensor(terms[4], point.wave, 1e-12);
		}
	});

	it('every term is trace-free, and five wavelengths out the wave is nearly all of it', () => {
		for (const point of pair.points) {
			const terms = quadrupoleTerms(turning, 2 * pair.omega, point.x as Vec3, pair.t);
			for (const term of terms) {
				const top = Math.max(...pack(term).map(Math.abs));
				expect(Math.abs(term[0][0] + term[1][1] + term[2][2])).toBeLessThan(1e-12 * top);
			}
		}
		const far = quadrupoleTerms(turning, 2 * pair.omega, pair.points[2].x as Vec3, pair.t);
		const size = (m: Mat3) => Math.hypot(...m.flat());
		expect(size(far[3]) / size(far[4])).toBeLessThan(0.3);
		expect(size(far[0]) / size(far[4])).toBeLessThan(1e-4);
	});

	it('with light infinitely fast only Newton’s quadrupole is left, at this instant', () => {
		const x = pair.points[0].x as Vec3;
		const w = 2 * pair.omega;
		const fast = add3(...quadrupoleTerms(turning, w, x, pair.t, 1e30 * C));
		expectTensor(fast, pack(newtonQuadrupole(turning, w, x, pair.t)), 1e-12);
		// near the pair that is Newton's law for the two masses, less their monopole and steady quadrupole, up to
		// the next multipole: here r = 44 d
		const near: Vec3 = [20 * pair.d, -30 * pair.d, 25 * pair.d];
		const points = (t: number) =>
			add3(
				...[1, -1].map((s) =>
					pointTide(
						pair.m,
						[
							(s * pair.d * Math.cos(pair.omega * t)) / 2,
							(s * pair.d * Math.sin(pair.omega * t)) / 2,
							0
						],
						near
					)
				)
			);
		const quadrupole = add3(
			pointTide(2 * pair.m, [0, 0, 0], near),
			quadrupoleTerms(steady, 0, near, 0)[0],
			newtonQuadrupole(turning, w, near, pair.t)
		);
		expectTensor(quadrupole, pack(points(pair.t)), 1e-5);
	});
});
