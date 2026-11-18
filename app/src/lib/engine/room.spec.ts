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
		const { scene, objects, observer } = load(furnaceJson);
		const glow = (id: string, subtractRoom = false) =>
			columnsAlong(
				objects,
				observer,
				toward(observer, byId(objects, id).center),
				0.25,
				subtractRoom
			).numberRadiance;
		// per volume the number emissivity goes as friction × T^3 (energy as T^4, mean energy as T), with the
		// frictions the scene gives
		const perVolume = (name: string) =>
			(scene.materials[name].friction ?? 0) * scene.materials[name].temperature ** 3;
		// a metal's friction falls as 1/T, so the hot iron sends (1500/293)^2 = 26 times the cold iron's, not 134
		expect(perVolume('hot-iron') / perVolume('cold-iron') / (1500 / 293) ** 2).toBeCloseTo(1, 2);
		expect(perVolume('steel')).toBe(perVolume('cold-iron'));
		expect(perVolume('air')).toBe(0);
		// The line from the eye, 1.5 m up, to the middle of a block, 3.5 m in and 0.3 m up, enters and leaves by
		// the front and back faces: the furnace's 0.9 m apart, its lining's 0.8 m and the block's 0.5 m. Then it
		// crosses 0.3 m of floor while it drops 1.2 m. So of its own length it has (0.9 - 0.8)/3.5 in steel,
		// 0.5/3.5 in iron and 0.3/1.2 in concrete.
		const line = (iron: string, floor = 1) =>
			(perVolume('steel') * 0.1 + perVolume(iron) * 0.5) / 3.5 +
			(floor * perVolume('concrete') * 0.3) / 1.2;
		const ratio = glow('furnace-right-charge') / glow('furnace-left-charge');
		expect(ratio / (line('hot-iron') / line('cold-iron'))).toBeCloseTo(1, 9);
		expect(ratio).toBeGreaterThan(15);
		// the furnaces by themselves, with the floor's glow behind them taken away
		const alone = glow('furnace-right-charge', true) / glow('furnace-left-charge', true);
		expect(alone / (line('hot-iron', 0) / line('cold-iron', 0))).toBeCloseTo(1, 9);
		expect(alone).toBeGreaterThan(20);
	});

	it('honey glows within a small factor of water, not ten thousand times brighter as its viscosity would have it', () => {
		const { objects } = load(honeyJson);
		const glow = (id: string) => objects.find((o) => o.id === id)!.jN;
		const ratio = glow('bottle-left-contents') / glow('bottle-right-contents');
		// honey at the most a relaxing stiffness of 30 GPa allows, water from its spectrum (reference scenefriction.py)
		expect(ratio).toBeGreaterThan(1);
		expect(ratio).toBeLessThan(5);
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

	/**
	 * What the grid of directions cannot see. The integral of dV / r² over a ball of radius R a distance D away is
	 * 2πR − π (D² − R²)/D · ln((D + R)/(D − R)); the values here are that, and the same for a box by Gauss-Legendre
	 * quadrature, from mpmath and numpy.
	 */
	const basis = { right: [1, 0, 0] as Vec3, up: [0, 1, 0] as Vec3, forward: [0, 0, -1] as Vec3 };
	const glowing = (objects: Scene['objects']) =>
		analyzeScene({
			name: 'glow',
			title: 'glow',
			observer: { position: [0, 0, 0] as Vec3 },
			materials: {
				warm: { density: 1000, temperature: 300, friction: 1 },
				hot: { density: 1000, temperature: 900, friction: 3 }
			},
			objects
		} as Scene);
	const ball = (center: Vec3, radius: number, material = 'warm', id = 'ball', parent?: string) => ({
		id,
		parent,
		shape: { type: 'sphere' as const, center, radius },
		material
	});

	it('adds a ball that lies wholly in view exactly, whatever its size', () => {
		for (const [radius, distance, tanHalf, integral] of [
			[0.8, 10, 0.3, 0.021474133068775946],
			[3, 5, 1, 4.913004943595706],
			// a hundredth of a cell across: the grid alone would miss it, or count it many times over
			[1e-3, 7, 0.3, 8.54855147323162e-11]
		]) {
			const objects = glowing([ball([0, 0, -distance], radius)]);
			const got = gravitonsInView(objects, [0, 0, 0], basis, tanHalf, tanHalf);
			expect(Math.abs(got / (objects[0].jN * integral) - 1)).toBeLessThan(1e-12);
		}
	});

	it('counts a body too small for the grid once if its centre is in view, and not otherwise', () => {
		// a ball 4 cm across some 6 m away, under half a cell, in a view whose right-hand edge is at x / z = 0.48
		const share = (x: number) => {
			const objects = glowing([ball([x, -0.8, -6], 0.02)]);
			const d2 = x * x + 0.64 + 36;
			// V / D², and the next term of its series, (R / D)² / 5
			const whole =
				((objects[0].jN * (4 / 3) * Math.PI * 0.02 ** 3) / d2) * (1 + 0.02 ** 2 / d2 / 5);
			return gravitonsInView(objects, [0, 0, 0], basis, 0.48, 0.3) / whole;
		};
		expect(Math.abs(share(1.2) - 1)).toBeLessThan(1e-9); // well inside
		expect(Math.abs(share(2.87) - 1)).toBeLessThan(1e-9); // across the edge, its centre inside
		expect(share(2.89)).toBe(0); // across the edge, its centre outside
		expect(share(3.2)).toBe(0); // out of view
		// and a small box, as a point with the first correction for its shape
		const box = glowing([
			{
				id: 'box',
				shape: { type: 'box' as const, center: [1.2, -0.8, -6] as Vec3, size: [0.04, 0.06, 0.02] },
				material: 'warm'
			}
		]);
		const boxed = gravitonsInView(box, [0, 0, 0], basis, 0.48, 0.3);
		expect(Math.abs(boxed / (box[0].jN * 1.2604942620561e-6) - 1)).toBeLessThan(1e-8);
	});

	it('counts nothing twice: a ball inside a ball adds only what it has over its parent', () => {
		const objects = glowing([
			ball([0, 0, -10], 0.8),
			ball([0, 0, -10], 0.3, 'hot', 'heart', 'ball')
		]);
		const [outer, inner] = objects;
		const want = outer.jN * 0.021474133068775946 + (inner.jN - outer.jN) * 0.001131177009057426;
		const got = gravitonsInView(objects, [0, 0, 0], basis, 0.3, 0.3);
		expect(Math.abs(got / want - 1)).toBeLessThan(1e-12);
	});

	it('leaves to the grid what the view cuts, as before', () => {
		// a ball half out of view: its part in view on a much finer grid of the same kind
		const objects = glowing([ball([3, 0, -10], 0.8)]);
		const got = gravitonsInView(objects, [0, 0, 0], basis, 0.3, 0.3);
		let fine = 0;
		const n = 800;
		const step = 0.6 / n;
		for (let j = 0; j < n; j++)
			for (let i = 0; i < n; i++) {
				const x = -0.3 + (i + 0.5) * step;
				const y = -0.3 + (j + 0.5) * step;
				const len = Math.hypot(x, y, 1);
				const N = columnsAlong(objects, [0, 0, 0], [x / len, y / len, -1 / len]).numberRadiance;
				fine += (N * step * step) / (1 + x * x + y * y) ** 1.5;
			}
		expect(fine).toBeGreaterThan(0.3 * objects[0].jN * 0.021474133068775946);
		expect(Math.abs(got / fine - 1)).toBeLessThan(0.03);
	});
});
