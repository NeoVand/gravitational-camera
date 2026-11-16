/**
 * The room scenes: what the demos claim about them, checked on the engine's
 * double-precision physics, and the subtraction of the empty room.
 */
import { describe, expect, it } from 'vitest';
import mirrorJson from '../../../../scenes/blank-mirror.scene.json';
import furnaceJson from '../../../../scenes/closed-furnace.scene.json';
import honeyJson from '../../../../scenes/honey-and-water.scene.json';
import safeJson from '../../../../scenes/locked-safe.scene.json';
import { pixelDirection, screenPosition, type View } from './camera';
import {
	analyzeScene,
	columnsAlong,
	gravitonsInView,
	packPrims,
	PRIM_STRIDE,
	referenceTidal
} from './scene';
import { massPoints } from './tidal';
import type { AnalyzedObject, Scene, Vec3 } from './types';

const load = (json: unknown) => {
	const scene = json as Scene;
	return { scene, objects: analyzeScene(scene), observer: scene.observer.position };
};

const toward = (from: Vec3, to: Vec3): Vec3 => {
	const d: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
	const n = Math.hypot(...d);
	return [d[0] / n, d[1] / n, d[2] / n];
};

const byId = (objects: AnalyzedObject[], id: string) => {
	const o = objects.find((x) => x.id === id);
	if (!o) throw new Error(`no object ${id}`);
	return o;
};

describe('screenPosition', () => {
	it('inverts pixelDirection', () => {
		const view: View = { yaw: 0.23, pitch: -0.1, fov: 1.0 };
		for (const [i, j] of [
			[0, 0],
			[639.5, 359.5],
			[1279, 719],
			[100, 600]
		]) {
			const d = pixelDirection(view, 1280, 720, i, j);
			const [x, y] = screenPosition(view, 1280, 720, d)!;
			expect(x).toBeCloseTo(i + 0.5, 6);
			expect(y).toBeCloseTo(j + 0.5, 6);
		}
	});

	it('returns nothing for directions behind the camera', () => {
		expect(screenPosition({ yaw: 0, pitch: 0, fov: 1 }, 100, 100, [0, 0, 1])).toBeUndefined();
	});
});

describe('a floor in the near field', () => {
	it('has the same tidal column in every direction it is seen', () => {
		// a slab from depth h to h + t below the eye gives rho ln((h + t) / h) at any slant
		const { objects, observer } = load(mirrorJson);
		const floor = byId(objects, 'floor');
		const expected = floor.density * Math.log(1.8 / 1.5);
		for (const deg of [20, 35, 60, 89]) {
			const a = (deg * Math.PI) / 180;
			const dir: Vec3 = [0, -Math.sin(a), -Math.cos(a)];
			const only = columnsAlong([{ ...floor, parent: -1 }], observer, dir).tidalColumn;
			expect(only / expected).toBeCloseTo(1, 10);
		}
	});
});

describe('subtracting the empty room', () => {
	const { objects, observer } = load(mirrorJson);

	it('removes the floor and walls and keeps what was brought in', () => {
		const down: Vec3 = [0, -1, 0];
		expect(columnsAlong(objects, observer, down).tidalColumn).toBeGreaterThan(100);
		expect(columnsAlong(objects, observer, down, 0.25, true).tidalColumn).toBe(0);

		const ball = byId(objects, 'ball');
		const dir = toward(observer, ball.center);
		const full = columnsAlong(objects, observer, dir).tidalColumn;
		const kept = columnsAlong(objects, observer, dir, 0.25, true).tidalColumn;
		const alone = columnsAlong([{ ...ball, parent: -1 }], observer, dir).tidalColumn;
		expect(kept).toBeCloseTo(alone, 9);
		expect(full).toBeGreaterThan(kept);
	});

	it('sets the exposure from the objects, not the floor', () => {
		// without the room, the reference is the brightest object brought in: the ball
		const ball = byId(objects, 'ball');
		const toBall = columnsAlong(objects, observer, toward(observer, ball.center), 0.25, true);
		expect(referenceTidal(objects, observer, 0.25, true)).toBeCloseTo(toBall.tidalColumn, 9);
		expect(referenceTidal(objects, observer)).toBeGreaterThan(toBall.tidalColumn);
	});

	it('keeps background shapes for the light view but zeroes their pull and glow', () => {
		const sRef = 10;
		const packed = packPrims(objects, observer, {
			nRef: 1,
			sRef,
			glareAngle: 0,
			subtractRoom: true
		});
		expect(packed.count).toBe(objects.length);
		const f = new Float32Array(packed.buffer);
		objects.forEach((o, i) => {
			const k = (i * PRIM_STRIDE) / 4;
			const mass = f[k + 16];
			const glow = f[k + 15];
			if (o.background) {
				expect(mass).toBe(0);
				expect(glow).toBe(0);
			} else {
				expect(mass).toBeCloseTo(o.density / sRef, 4);
			}
		});
	});

	it('leaves out background masses from the raw pixel field', () => {
		const all = massPoints(objects).length;
		const kept = massPoints(objects, 0.25, true).length;
		expect(kept).toBeGreaterThan(0);
		expect(kept).toBeLessThan(all / 10);
	});

	it('marks every floor and wall in the room scenes', () => {
		for (const json of [mirrorJson, furnaceJson, honeyJson, safeJson]) {
			const { objects } = load(json);
			for (const o of objects) {
				if (/floor|wall/.test(o.id)) expect(o.background, o.id).toBe(true);
			}
		}
	});
});

describe('the thermal demos', () => {
	it('the hot iron outshines the cold one through the same steel', () => {
		const { objects, observer } = load(furnaceJson);
		const glow = (id: string) =>
			columnsAlong(objects, observer, toward(observer, byId(objects, id).center)).numberRadiance;
		// at fixed friction the number emissivity grows as T^3 (energy as T^4, mean energy as T)
		const ratio = glow('furnace-right-charge') / glow('furnace-left-charge');
		expect(ratio).toBeGreaterThan(20);
	});

	it('honey glows about ten thousand times brighter than water', () => {
		const { objects } = load(honeyJson);
		const contents = objects.filter((o) => o.id.endsWith('-contents'));
		expect(contents).toHaveLength(2);
		const [a, b] = contents.map((o) => o.jN);
		expect(Math.max(a, b) / Math.min(a, b)).toBeCloseTo(1e4, -2);
	});
});

describe('gravitons in a view', () => {
	it('adds up to j_N V / d² for a small glowing ball', () => {
		const scene = {
			name: 'ball',
			title: 'ball',
			observer: { position: [0, 0, 0] as Vec3 },
			materials: { warm: { density: 1000, temperature: 300, friction: 1 } },
			objects: [
				{
					id: 'ball',
					shape: { type: 'sphere' as const, center: [0, 0, -10] as Vec3, radius: 0.8 },
					material: 'warm'
				}
			]
		} as Scene;
		const objects = analyzeScene(scene);
		const basis = { right: [1, 0, 0] as Vec3, up: [0, 1, 0] as Vec3, forward: [0, 0, -1] as Vec3 };
		const got = gravitonsInView(objects, [0, 0, 0], basis, 0.3, 0.3);
		const want = (objects[0].jN * (4 / 3) * Math.PI * 0.8 ** 3) / 100;
		expect(Math.abs(got / want - 1)).toBeLessThan(0.02);
	});
});
