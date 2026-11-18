/**
 * The engine's double-precision physics against the Python reference
 * implementation (reference/), which uses a different algorithm for the line
 * integrals. The fixture is regenerated with
 * `python -m gravcam.export_fixtures` from the reference directory.
 */
import { describe, expect, it } from 'vitest';
import fixture from '../../../../reference/fixtures/sun-at-midnight.json';
import sceneJson from '../../../../scenes/sun-at-midnight.scene.json';
import { cameraBasis, type View } from './camera';
import {
	analyzeScene,
	chordThrough,
	columnsAlong,
	gravitonsInView,
	referenceRadiance
} from './scene';
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
				const mine = chordThrough(o, observer, ray.direction as Vec3);
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

/**
 * Everything in a view, with the Sun and the Moon in it: each a twentieth of a cell of the grid of directions or
 * less. Expected values from the reference: the Sun as emission.number_flux_at_distance(1e8, 13e6, d) at its
 * distance d = 149 603 214 894 m; the Earth's part of the demo's opening view from columns.chords on a grid of
 * 2560 x 1600 directions; the Moon as the integral of dV / r² over each of its two layers, in closed form
 * (mpmath, 50 digits). The Earth's and the Moon's shells have the frictions of the scene file, each the most its
 * stiffness allows, so both numbers are upper bounds: emission.object_emission gives each shell's j_N from them.
 */
describe('gravitons in view against the reference', () => {
	const DEG = Math.PI / 180;
	const SUN = 0.733427287467359;
	const EARTH = 3.282516e-6;
	const MOON = 3.1331046000828605e-12;
	const opening: View = { yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG };
	const inView = (things: typeof objects, view: View) =>
		gravitonsInView(
			things,
			observer,
			cameraBasis(view),
			1.6 * Math.tan(view.fov / 2),
			Math.tan(view.fov / 2)
		);
	const toward = (id: string, fov: number): View => {
		const d = objects.find((o) => o.id === id)!.center.map((v, k) => v - observer[k]);
		return {
			yaw: Math.atan2(-d[0], -d[2]),
			pitch: Math.asin(d[1] / Math.hypot(...d)),
			fov: fov * DEG
		};
	};

	it('the opening view of the Sun at midnight holds the Sun’s core: 0.73 gravitons a second', () => {
		expect(close(inView(objects, opening), SUN + EARTH, 1e-6)).toBe(true);
	});

	it('with the Sun dark, the planet alone sends at most one in 85 hours', () => {
		const dark = objects.map((o) => (o.id.startsWith('sun') ? { ...o, jN: 0 } : o));
		const got = inView(dark, opening);
		expect(close(got, EARTH, 1e-3)).toBe(true);
		expect(Math.round(1 / got / 3600)).toBe(85);
	});

	it('the Sun counts once at any zoom, and not at all out of view', () => {
		for (const fov of [90, 20, 1]) {
			// what is left is the Earth in front of it, some 8e-6 in a wide view
			const rest = inView(objects, toward('sun', fov)) - SUN;
			expect(rest).toBeGreaterThan(0);
			expect(rest).toBeLessThan(1e-4);
		}
		// looking up at the sky above where the Sun is: nothing at all
		const away = { ...toward('sun', 40), pitch: 60 * DEG };
		expect(inView(objects, away)).toBe(0);
	});

	it('the Moon in view, above the horizon: its two layers, each over its parent', () => {
		for (const fov of [40, 1])
			expect(close(inView(objects, toward('moon', fov)), MOON, 1e-9)).toBe(true);
	});
});
