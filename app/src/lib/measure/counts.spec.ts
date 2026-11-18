/**
 * The counting camera's expectations against the reference (reference/fixtures/<scene>.json, block "counts",
 * written by gravcam.export_fixtures from gravcam.columns and gravcam.emission), and its Poisson draws against
 * their law.
 */
import { describe, expect, it } from 'vitest';
import furnaceFixture from '../../../../reference/fixtures/closed-furnace.json';
import honeyFixture from '../../../../reference/fixtures/honey-and-water.json';
import sunFixture from '../../../../reference/fixtures/sun-at-midnight.json';
import furnaceJson from '../../../../scenes/closed-furnace.scene.json';
import honeyJson from '../../../../scenes/honey-and-water.scene.json';
import sunJson from '../../../../scenes/sun-at-midnight.scene.json';
import { uniform } from '../array/random';
import { analyzeScene, gravitonsInView } from '../engine/scene';
import { K_B, MEAN_QUANTUM_KT } from '../engine/physics/constants';
import type { Scene, Vec3 } from '../engine/types';
import { LIFETIME, countRates, logGamma, poisson } from './counts';

interface CountsBlock {
	view: { forward: number[]; right: number[]; up: number[]; tan_x: number; tan_y: number };
	cells: [number, number];
	samples: number;
	points: string[];
	rate: number[][];
	rate_without_room?: number[][];
}

const cases: [string, unknown, unknown][] = [
	['sun-at-midnight', sunJson, sunFixture],
	['closed-furnace', furnaceJson, furnaceFixture],
	['honey-and-water', honeyJson, honeyFixture]
];

describe.each(cases)('%s: expected counts', (_name, sceneJson, fixtureJson) => {
	const scene = sceneJson as Scene;
	const counts = (fixtureJson as { counts: CountsBlock }).counts;
	const objects = analyzeScene(scene);
	const origin = scene.observer.position;
	const { view } = counts;
	const basis = {
		forward: view.forward as Vec3,
		right: view.right as Vec3,
		up: view.up as Vec3
	};
	const grid = (subtractRoom: boolean) =>
		countRates(
			objects,
			origin,
			basis,
			view.tan_x,
			view.tan_y,
			counts.cells[0],
			counts.samples,
			subtractRoom
		);

	const compare = (rates: Float64Array, want: number[][]) => {
		const top = Math.max(...want.flat());
		want.forEach((row, j) =>
			row.forEach((value, i) => {
				const got = rates[j * counts.cells[0] + i];
				expect(
					Math.abs(got - value),
					`element ${i}, ${j}: ${got} against ${value}`
				).toBeLessThanOrEqual(1e-8 * Math.abs(value) + 1e-12 * top);
			})
		);
	};

	it('cuts the view into the same elements, and counts the same balls whole', () => {
		const g = grid(false);
		expect([g.nx, g.ny]).toEqual(counts.cells);
		expect([...g.points].sort()).toEqual([...counts.points].sort());
	});

	it('expects the reference’s gravitons from every element', () =>
		compare(grid(false).rate, counts.rate));

	it('and without the room, where it has one', () => {
		if (!counts.rate_without_room) return expect(objects.some((o) => o.background)).toBe(false);
		compare(grid(true).rate, counts.rate_without_room);
	});

	it('adds up to what the whole view sends, as the engine counts it on its own grid', () => {
		const g = grid(false);
		const total = g.rate.reduce((s, v) => s + v, 0);
		const whole = gravitonsInView(objects, origin, basis, view.tan_x, view.tan_y);
		expect(Math.abs(total / whole - 1)).toBeLessThan(0.03);
	});
});

describe('the Sun at midnight, counted', () => {
	const scene = sunJson as unknown as Scene;
	const objects = analyzeScene(scene);
	const origin = scene.observer.position;

	it('counts the Sun’s core whole, at the flux of its luminosity, L / (4 pi d^2) / (2.701 k T)', () => {
		const block = (sunFixture as unknown as { counts: CountsBlock }).counts;
		const g = countRates(
			objects,
			origin,
			{
				forward: block.view.forward as Vec3,
				right: block.view.right as Vec3,
				up: block.view.up as Vec3
			},
			block.view.tan_x,
			block.view.tan_y,
			block.cells[0],
			block.samples
		);
		const core = scene.objects.find((o) => o.id === 'sun-core')!;
		const material = scene.materials[core.material];
		const d = Math.hypot(...core.shape.center.map((v, k) => v - origin[k]));
		const flux =
			material.luminosity! / (4 * Math.PI * d * d) / (MEAN_QUANTUM_KT * K_B * material.temperature);
		// the brightest element holds the core, and nothing else in it comes near
		const top = Math.max(...g.rate);
		expect(Math.abs(top / flux - 1)).toBeLessThan(1e-4);
	});

	it('in eighty years, a square metre facing the ground counts the paper’s 3.6 x 10^4 from the Earth below', () => {
		// the planet alone, straight down, out to 87 degrees from the vertical
		const earth = objects.map((o) =>
			['earth', 'upper-mantle', 'lower-mantle', 'outer-core', 'inner-core'].includes(o.id)
				? o
				: { ...o, jN: 0 }
		);
		const down = { forward: [0, -1, 0] as Vec3, right: [1, 0, 0] as Vec3, up: [0, 0, -1] as Vec3 };
		const g = countRates(earth, origin, down, 19, 19, 96, 4);
		const lifetime = g.rate.reduce((s, v) => s + v, 0) * LIFETIME;
		expect(lifetime).toBeGreaterThan(0.95 * 3.56e4);
		expect(lifetime).toBeLessThan(1.02 * 3.6e4);
	});
});

describe('Poisson draws', () => {
	it('ln Gamma is right at whole and half numbers', () => {
		expect(logGamma(1)).toBeCloseTo(0, 12);
		expect(logGamma(5)).toBeCloseTo(Math.log(24), 12);
		expect(logGamma(0.5)).toBeCloseTo(0.5 * Math.log(Math.PI), 12);
		expect(logGamma(101)).toBeCloseTo(363.73937555556347, 9);
	});

	it.each([0.002, 0.7, 5, 29.5, 30.5, 400, 1e6, 1e10, 1e15])(
		'mean %s: the draws have its mean and variance',
		(mean) => {
			const next = uniform(1916 + Math.round(Math.log(mean) * 100));
			const n = 40_000;
			// about the mean itself, so that the sums keep their digits at large means
			let sum = 0;
			let squares = 0;
			for (let i = 0; i < n; i++) {
				const k = poisson(mean, next);
				expect(Number.isInteger(k) && k >= 0).toBe(true);
				sum += k - mean;
				squares += (k - mean) ** 2;
			}
			const m = mean + sum / n;
			const variance = squares / n - (sum / n) ** 2;
			// five standard errors of the mean, and of the variance (whose own variance is 2 mean^2 + mean)
			expect(Math.abs(m - mean)).toBeLessThan(5 * Math.sqrt(mean / n) + 1e-12 * mean);
			expect(Math.abs(variance - mean)).toBeLessThan(
				5 * Math.sqrt((2 * mean * mean + mean) / n) + 1e-6 * mean
			);
		}
	);

	it('a mean below one gives zero most of the time, and one now and then', () => {
		const next = uniform(7);
		const draws = Array.from({ length: 20_000 }, () => poisson(0.05, next));
		const ones = draws.filter((k) => k === 1).length / draws.length;
		expect(Math.abs(ones - 0.05 * Math.exp(-0.05))).toBeLessThan(0.01);
		expect(poisson(0, next)).toBe(0);
	});
});
