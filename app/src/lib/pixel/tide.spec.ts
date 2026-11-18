/**
 * The closed forms behind the "Tidal field" reading (tide.ts), against the Python reference. Every expected tensor
 * below is [xx, xy, xz, yy, yz, zz] in s^-2, copied from a call of reference/gravcam (run from reference/ with
 * ../.venv/bin/python); the call is named above each.
 */
import { describe, expect, it } from 'vitest';
import { G } from '../engine/physics/constants';
import type { Vec3 } from '../engine/types';
import {
	DRAWN,
	EARTH_TIDE,
	PERSON_TIDE,
	add3,
	boxTide,
	exaggeration,
	largest,
	movingMagnetic,
	nameAxis,
	pointTide,
	principal,
	principalPlane,
	principalRows,
	ring,
	share,
	sphereTide,
	type Landmark,
	type Mat3
} from './tide';

/** A matrix as the reference's six numbers. */
const pack = (m: Mat3) => [m[0][0], m[0][1], m[0][2], m[1][1], m[1][2], m[2][2]];

/** Every component within `rel` of the expected tensor's largest. */
function expectTensor(actual: Mat3, expected: number[], rel = 1e-10) {
	const top = Math.max(...expected.map(Math.abs));
	pack(actual).forEach((v, k) => expect(Math.abs(v - expected[k])).toBeLessThanOrEqual(rel * top));
	// and it is symmetric
	for (let i = 0; i < 3; i++) for (let j = 0; j < i; j++) expect(actual[i][j]).toBe(actual[j][i]);
}

// tidal.point_mass_tidal_tensor([1, 2, -0.5], [0.2, -0.3, 0.4], 1000.0)
// tidal.uniform_box_tidal_tensor([0, 1.5, 0], [1.1, 0.13, -3.5], [0.3, 0.14, 0.4], 19300.0): the locked safe's gold
// tidal.uniform_box_tidal_tensor([2, 0.2, 0.3], [0.5, 0, 0], [1, 0.4, 0.6], 2000.0): outside, in the plane of no face
// tidal.uniform_box_tidal_tensor([0.6, 0.05, -0.1], [0.5, 0, 0], [1, 0.4, 0.6], 2000.0): inside the same box
// tidal.uniform_sphere_tidal_tensor([0.1, 0, 0.2], [0, 0, 0], 0.5, 7850 * 4/3 * pi * 0.125): inside a steel ball
const shapes = {
	point: [
		2.727740303046756e-9, -3.1238851603357046e-9, 1.2223898453487542e-9, -5.166860781497278e-9,
		3.5143708053776674e-9, 2.4391204784505226e-9
	],
	boxOutside: [
		2.75336151182307e-10, 1.0689036794297826e-10, 2.7204027469982837e-10, 2.280278224962983e-10,
		-3.394666436874239e-10, -5.033639736787483e-10
	],
	boxFacePlane: [
		-1.8137781584594333e-8, -4.212860808157355e-9, -6.027301020155394e-9, 9.536292656454798e-9,
		-9.15870488482812e-10, 8.60148892813953e-9
	],
	boxInside: [
		2.1099764731812237e-7, -8.643583186517943e-9, 1.3071326894065128e-8, 9.101078432413034e-7,
		3.738938886066078e-8, 5.563290572689224e-7
	],
	sphereInside: [2.1946435334087556e-6, 0.0, 0.0, 2.1946435334087556e-6, 0.0, 2.1946435334087556e-6]
};

// gravitomagnetic.electric_point(80, offset) and magnetic_point(80, offset, velocity), at the origin
const movingPoint = {
	mass: 80.0,
	offset: [1.0, -0.5, -3.0],
	velocity: [1.5, 0.2, -0.4],
	E: [
		1.1508641286937043e-10, 2.3810981972973196e-11, 1.4286589183783915e-10, 1.508028858288302e-10,
		-7.143294591891958e-11, -2.6588929869820066e-10
	],
	B: [
		2.5415963704301803e-19, -7.148239791834881e-19, -2.3033217107023506e-19, 6.512840699227336e-19,
		1.8783985675210546e-18, -9.054437069657516e-19
	]
};

// a person walking at 1.4 m/s behind the wall, seen from [0, 1.5, 0]: E from tidal.uniform_box_tidal_tensor; B from
// gravitomagnetic.magnetic_point summed over cells of 1 cm and of 5 mm, and extrapolated (Richardson)
const walker = {
	center: [0.6, 0.85, -5.6],
	size: [0.36, 1.7, 0.2],
	density: 985.0,
	velocity: [1.4, 0.0, 0.0],
	E: [
		4.220693703709107e-11, 1.5215069149428018e-12, 1.3597100561833434e-11, 4.115374248939198e-11,
		-1.4216914670723522e-11, -8.33606795264469e-11
	],
	B: [
		0.0, -6.349706364705407e-20, 7.10528108396848e-21, 1.3278306380195743e-19,
		5.814695672634033e-19, -1.3278306380195743e-19
	]
};

describe('the tide of a uniform body', () => {
	it('a point mass, as the reference has it', () => {
		expectTensor(pointTide(1000, [0.2, -0.3, 0.4], [1, 2, -0.5]), shapes.point);
	});

	it('a box from outside: the prism formulas, to a part in ten thousand million', () => {
		expectTensor(
			boxTide(19300, [1.1, 0.13, -3.5], [0.15, 0.07, 0.2], [0, 1.5, 0]),
			shapes.boxOutside
		);
		expectTensor(boxTide(2000, [0.5, 0, 0], [0.5, 0.2, 0.3], [2, 0.2, 0.3]), shapes.boxFacePlane);
	});

	it('inside matter the trace is 4 pi G rho; outside it is zero', () => {
		const inside = boxTide(2000, [0.5, 0, 0], [0.5, 0.2, 0.3], [0.6, 0.05, -0.1]);
		expectTensor(inside, shapes.boxInside);
		expect(inside[0][0] + inside[1][1] + inside[2][2]).toBeCloseTo(4 * Math.PI * G * 2000, 18);
		const outside = boxTide(2000, [0.5, 0, 0], [0.5, 0.2, 0.3], [2, 0.2, 0.3]);
		expect(Math.abs(outside[0][0] + outside[1][1] + outside[2][2])).toBeLessThan(1e-22);
		expectTensor(sphereTide(7850, [0, 0, 0], 0.5, [0.1, 0, 0.2]), shapes.sphereInside);
	});

	it('a sphere from outside is its mass at its centre', () => {
		const mass = 7850 * (4 / 3) * Math.PI * 0.35 ** 3;
		expectTensor(
			sphereTide(7850, [1.1, 0.5, -3.6], 0.35, [0, 1.5, 0]),
			pack(pointTide(mass, [1.1, 0.5, -3.6], [0, 1.5, 0])),
			1e-14
		);
	});
});

describe('the magnetic part of moving mass', () => {
	it('a moving point: the boost of its tide is the reference’s magnetic_point', () => {
		const E = pointTide(movingPoint.mass, movingPoint.offset as Vec3, [0, 0, 0]);
		expectTensor(E, movingPoint.E);
		expectTensor(movingMagnetic(E, movingPoint.velocity as Vec3), movingPoint.B);
	});

	it('a walking person, a box: the boost of the prism’s tide is the sum over its cells', () => {
		const half = walker.size.map((s) => s / 2) as Vec3;
		const E = boxTide(walker.density, walker.center as Vec3, half, [0, 1.5, 0]);
		expectTensor(E, walker.E);
		// the cells' sum is itself good to a part in a thousand million
		expectTensor(movingMagnetic(E, walker.velocity as Vec3), walker.B, 1e-8);
	});
});

describe('what a reading says', () => {
	const marks: Landmark[] = [
		{
			along: 'up-down',
			from: 'the vertical',
			dir: [0, 1, 0],
			across: 'every horizontal direction'
		},
		{ along: 'toward the Sun', from: 'the line to the Sun', dir: [0.6, 0, 0.8] }
	];
	// a body straight overhead: stretched along the vertical, squeezed half as much across it
	const overhead: Mat3 = [
		[1, 0, 0],
		[0, -2, 0],
		[0, 0, 1]
	];

	it('principal values come strongest stretch first, with their axes', () => {
		const p = principal(shapesMatrix(shapes.boxOutside));
		expect(p.map((q) => q.value)).toEqual([...p.map((q) => q.value)].sort((a, b) => a - b));
		// the gold's stretch is along the line to it, to a degree
		const toGold = [1.1, 0.13 - 1.5, -3.5];
		const n = Math.hypot(...toGold);
		const cos = Math.abs(p[0].axis.reduce((s, v, k) => s + (v * toGold[k]) / n, 0));
		expect(cos).toBeGreaterThan(Math.cos(Math.PI / 180));
		expect(largest(overhead).value).toBe(-2);
	});

	it('two equal values are one row, twice, with a plane for a direction', () => {
		const rows = principalRows(overhead, marks);
		expect(rows).toEqual([
			{ value: -2, times: 1, direction: 'up-down' },
			{ value: 1, times: 2, direction: 'every horizontal direction' }
		]);
		// three different values: three rows, the largest first
		const three = principalRows(
			[
				[3, 0, 0],
				[0, -5, 0],
				[0, 0, 2]
			],
			marks
		);
		expect(three.map((r) => r.value)).toEqual([-5, 3, 2]);
		expect(three.every((r) => r.times === 1)).toBe(true);
	});

	it('an axis is named by the nearest landmark, or by its angle from it', () => {
		expect(nameAxis([0, -1, 0], marks)).toBe('up-down');
		expect(nameAxis([-0.6, 0, -0.8], marks)).toBe('toward the Sun');
		const tilted: Vec3 = [Math.sin(0.4), Math.cos(0.4), 0];
		expect(nameAxis(tilted, marks)).toBe('23° from the vertical');
	});

	it('a ring of twelve: pulled out along a stretch, pushed in along a squeeze', () => {
		const points = ring(overhead, [1, 0, 0], [0, 1, 0]);
		expect(points).toHaveLength(12);
		// at the top of the ring (along the vertical) the particle moves outward by 2; at the side, inward by 1
		expect(points[3].radial).toBeCloseTo(2, 12);
		expect(points[0].radial).toBeCloseTo(-1, 12);
		expect(points[0].ay).toBeCloseTo(0, 12);
		// a ring facing the body is squeezed evenly
		const facing = ring(overhead, [1, 0, 0], [0, 0, 1]);
		expect(facing.every((q) => Math.abs(q.radial + 1) < 1e-12)).toBe(true);
		// the plane of the two largest values holds the stretch
		const [first, second] = principalPlane(overhead);
		expect(first.value).toBe(-2);
		expect(second.value).toBe(1);
	});

	it('the exaggeration is against one second of free fall', () => {
		// the Earth's own tide: in a second the ring changes by half of it
		const e = exaggeration(EARTH_TIDE);
		expect(e.inOneSecond).toBeCloseTo(1.54e-6, 8);
		expect(e.factor).toBeCloseTo(DRAWN / e.inOneSecond, 6);
		// and it would look as drawn after seven minutes
		expect(e.fallTime / 60).toBeCloseTo(7.35, 1);
	});

	it('the shares of the sources add up to one', () => {
		const a = shapesMatrix(shapes.boxOutside);
		const b = shapesMatrix(shapes.point);
		const sum = add3(a, b);
		expect(share(a, sum) + share(b, sum)).toBeCloseTo(1, 12);
	});

	it('the familiar tides are the paper’s', () => {
		// "the planet's own, 2GM/R^3 = 3.1e-6 s^-2"; "a person of 70 kg one metre away produces 9e-9 s^-2"
		expect(EARTH_TIDE).toBeCloseTo(3.08e-6, 8);
		expect(PERSON_TIDE).toBeCloseTo(9.3e-9, 10);
	});
});

function shapesMatrix(e: number[]): Mat3 {
	return [
		[e[0], e[1], e[2]],
		[e[1], e[3], e[4]],
		[e[2], e[4], e[5]]
	];
}
