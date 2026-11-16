/**
 * The engine's double-precision physics against the Python reference
 * implementation (reference/), which uses a different algorithm for the line
 * integrals. The fixture is regenerated with
 * `python -m gravcam.export_fixtures` from the reference directory.
 */
import { describe, expect, it } from 'vitest';
import fixture from '../../../../reference/fixtures/sun-at-midnight.json';
import sceneJson from '../../../../scenes/sun-at-midnight.scene.json';
import { analyzeScene, columnsAlong, referenceRadiance, sphereChord } from './scene';
import type { Scene, Vec3 } from './types';

const scene = sceneJson as unknown as Scene;
const objects = analyzeScene(scene);
const observer = scene.observer.position;

type RefObject = {
	own_volume: number;
	alpha: number | null;
	j_E: number;
	j_N: number;
	density: number;
	temperature: number;
};
type RefRay = {
	label: string;
	direction: number[];
	number_radiance: number;
	mass_column: number;
	chords: Record<string, number>;
};
const refObjects = fixture.objects as Record<string, RefObject>;
const rays = fixture.rays as RefRay[];

/** Rays that graze a sphere: the chord there is ill-conditioned in the direction. */
const grazing = (label: string) => /limb|horizon/.test(label);

const close = (a: number, b: number, rel: number, floor = 0) =>
	Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b)) + floor;

describe('scene analysis against the reference', () => {
	it('covers the same objects', () => {
		expect(objects.map((o) => o.id).sort()).toEqual(Object.keys(refObjects).sort());
	});

	it.each(objects.map((o) => [o.id, o] as const))('%s: volume and emissivities', (id, o) => {
		const ref = refObjects[id];
		expect(close(o.ownVolume, ref.own_volume, 1e-12)).toBe(true);
		if (ref.alpha !== null) expect(close(o.alpha, ref.alpha, 1e-12)).toBe(true);
		expect(close(o.jE, ref.j_E, 1e-12)).toBe(true);
		expect(close(o.jN, ref.j_N, 1e-12)).toBe(true);
	});
});

describe('line integrals against the reference', () => {
	const scale = referenceRadiance(objects, observer);

	it('has a useful number of rays', () => {
		expect(rays.length).toBeGreaterThanOrEqual(100);
	});

	it('chords through every sphere', () => {
		const bad: string[] = [];
		for (const ray of rays) {
			const tol = grazing(ray.label) ? 1e-6 : 1e-9;
			for (const o of objects) {
				const mine = sphereChord(o.center, o.radius, observer, ray.direction as Vec3);
				// 1 mm of slack: a grazing chord can differ by rounding alone
				if (!close(mine, ray.chords[o.id], tol, 1e-3)) {
					bad.push(`${ray.label} ${o.id}: ${mine} vs ${ray.chords[o.id]}`);
				}
			}
		}
		expect(bad).toEqual([]);
	});

	it('number radiance and mass column', () => {
		const bad: string[] = [];
		for (const ray of rays) {
			const tol = grazing(ray.label) ? 1e-6 : 1e-9;
			const mine = columnsAlong(objects, observer, ray.direction as Vec3);
			if (!close(mine.numberRadiance, ray.number_radiance, tol, 1e-12 * scale)) {
				bad.push(`${ray.label} N: ${mine.numberRadiance} vs ${ray.number_radiance}`);
			}
			if (!close(mine.massColumn, ray.mass_column, tol, 1e-3)) {
				bad.push(`${ray.label} mass: ${mine.massColumn} vs ${ray.mass_column}`);
			}
		}
		expect(bad).toEqual([]);
	});

	it('uses the straight-down column as the brightness scale', () => {
		const down = rays.find((r) => r.label === 'down')!;
		expect(close(scale, down.number_radiance, 1e-12)).toBe(true);
	});
});
