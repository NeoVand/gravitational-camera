/**
 * The engine's double-precision physics in the room scenes, against the Python
 * reference (reference/fixtures/<scene>.json, written by
 * `python -m gravcam.export_fixtures`). The reference finds crossings and
 * line integrals with its own code, and computes tidal tensors from the
 * closed-form fields of uniform boxes and spheres; the engine's raw-pixel view
 * instead sums a grid of point masses, so those are compared with a looser,
 * stated tolerance.
 */
import { describe, expect, it } from 'vitest';
import mirrorFixture from '../../../../reference/fixtures/blank-mirror.json';
import furnaceFixture from '../../../../reference/fixtures/closed-furnace.json';
import tanksFixture from '../../../../reference/fixtures/full-or-empty.json';
import honeyFixture from '../../../../reference/fixtures/honey-and-water.json';
import safeFixture from '../../../../reference/fixtures/locked-safe.json';
import mirrorJson from '../../../../scenes/blank-mirror.scene.json';
import furnaceJson from '../../../../scenes/closed-furnace.scene.json';
import tanksJson from '../../../../scenes/full-or-empty.scene.json';
import honeyJson from '../../../../scenes/honey-and-water.scene.json';
import safeJson from '../../../../scenes/locked-safe.scene.json';
import { analyzeScene, columnsAlong } from './scene';
import { massPoints, tidalTensor } from './tidal';
import type { Scene, Vec3 } from './types';

interface RoomFixture {
	observer: { position: number[]; exclusion: number };
	background: string[];
	objects: Record<string, { j_N: number; density: number; background: boolean }>;
	sensors: { point: number[]; tensor: number[][]; tensor_without_room: number[][] }[];
	rays: {
		label: string;
		direction: number[];
		number_radiance: number;
		mass_column: number;
		tidal_column: number;
	}[];
}

const cases: [string, unknown, unknown][] = [
	['locked-safe', safeJson, safeFixture],
	['full-or-empty', tanksJson, tanksFixture],
	['blank-mirror', mirrorJson, mirrorFixture],
	['closed-furnace', furnaceJson, furnaceFixture],
	['honey-and-water', honeyJson, honeyFixture]
];

/** Close to `want` within a relative tolerance, or an absolute one set by `scale`. */
function near(got: number, want: number, rel: number, scale: number, what: string) {
	expect(Math.abs(got - want), `${what}: got ${got}, want ${want}`).toBeLessThanOrEqual(
		rel * Math.abs(want) + 1e-12 * scale
	);
}

/** Frobenius norm of a symmetric tensor given as [xx, xy, xz, yy, yz, zz]. */
const norm6 = (e: number[]) =>
	Math.sqrt(e[0] ** 2 + e[3] ** 2 + e[5] ** 2 + 2 * (e[1] ** 2 + e[2] ** 2 + e[4] ** 2));
const flat = (m: number[][]) => [m[0][0], m[0][1], m[0][2], m[1][1], m[1][2], m[2][2]];

describe.each(cases)('%s', (_name, sceneJson, fixtureJson) => {
	const scene = sceneJson as Scene;
	const fixture = fixtureJson as RoomFixture;
	const objects = analyzeScene(scene);
	const origin = scene.observer.position;
	const exclusion = fixture.observer.exclusion;

	it('agrees on each object', () => {
		expect(objects.map((o) => o.id).sort()).toEqual(Object.keys(fixture.objects).sort());
		for (const o of objects) {
			const ref = fixture.objects[o.id];
			near(o.jN, ref.j_N, 1e-12, 0, `${o.id} j_N`);
			expect(o.density).toBe(ref.density);
			expect(o.background, o.id).toBe(ref.background);
		}
	});

	it('agrees on every ray', () => {
		const scale = {
			n: Math.max(...fixture.rays.map((r) => Math.abs(r.number_radiance))),
			m: Math.max(...fixture.rays.map((r) => Math.abs(r.mass_column))),
			s: Math.max(...fixture.rays.map((r) => Math.abs(r.tidal_column)))
		};
		for (const ray of fixture.rays) {
			const got = columnsAlong(objects, origin, ray.direction as Vec3, exclusion);
			near(got.numberRadiance, ray.number_radiance, 1e-9, scale.n, `${ray.label} N`);
			near(got.massColumn, ray.mass_column, 1e-9, scale.m, `${ray.label} mass column`);
			// the fixture keeps 10 significant digits of the tidal column
			near(got.tidalColumn, ray.tidal_column, 2e-9, scale.s, `${ray.label} tidal column`);
		}
	});

	it('raw pixels: point-mass tensors match the closed-form fields', () => {
		const all = massPoints(objects);
		const kept = massPoints(objects, 0.25, true);
		for (const sensor of fixture.sensors) {
			for (const [points, want] of [
				[all, flat(sensor.tensor)],
				[kept, flat(sensor.tensor_without_room)]
			] as const) {
				const got = tidalTensor(points, sensor.point as Vec3);
				const error = norm6(got.map((v, k) => v - want[k]));
				// a grid of 25 cm cells stands in for each box; observed errors are below 1.5e-3
				expect(error / norm6(want), `at ${sensor.point}`).toBeLessThan(5e-3);
			}
		}
	});
});
