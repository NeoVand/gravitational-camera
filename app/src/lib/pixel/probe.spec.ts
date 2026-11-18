/** The "One pixel" layer: a pixel's reading in a room, and what it says. */
import { describe as group, expect, it } from 'vitest';
import { analyzeScene } from '../engine/scene';
import type { Scene } from '../engine/types';
import lockedSafe from '../../../../scenes/locked-safe.scene.json';
import flywheel from '../../../../scenes/sealed-flywheel.scene.json';
import { symmetricEigen } from './complex';
import { eigenvalues } from './pixel';
import { describe, movingPoint, readingAt, spinDipole } from './probe';

const scene = flywheel as unknown as Scene;
const safe = lockedSafe as unknown as Scene;

group('one pixel in a room', () => {
	it('a room at rest reads real eigenvalues; a spinning flywheel sets off the alarm', () => {
		const still = analyzeScene({
			...scene,
			objects: scene.objects.map((o) => (o.spin ? { ...o, spin: { ...o.spin, rate: 0 } } : o))
		});
		const at = scene.observer.position;
		expect(describe(readingAt(still, at)).alarm).toBeLessThan(1e-14);
		const turning = analyzeScene(scene);
		const d = describe(readingAt(turning, at));
		expect(d.alarm).toBeGreaterThan(1e-12);
		expect(d.stars.length).toBe(4);
	});

	it('the alarm of a room is max |v.B.v| / max |w| on the axes v of its tide, to first order', () => {
		// the flywheel's room (an alarm of 1.1e-9), and a person walking in the locked safe's room (some 1e-11)
		const walker = analyzeScene({
			...safe,
			materials: { ...safe.materials, person: { density: 985, temperature: 310, friction: 0.001 } },
			objects: [
				...safe.objects,
				{
					id: 'walking',
					shape: { type: 'box', center: [-0.3, 0.85, -5.6], size: [0.36, 1.7, 0.2] },
					material: 'person',
					velocity: [1.4, 0, 0]
				}
			]
		});
		const rooms = [
			{ objects: analyzeScene(scene), at: scene.observer.position, size: 1e-9 },
			{ objects: walker, at: safe.observer.position, size: 1e-12 }
		];
		for (const { objects, at, size } of rooms) {
			const W = readingAt(objects, at);
			const { values, vectors } = symmetricEigen(W.map((r) => r.map((z) => z.re)));
			const turns = values.map((_, n) =>
				W.reduce(
					(s, r, i) => s + r.reduce((t, z, j) => t + vectors[i][n] * z.im * vectors[j][n], 0),
					0
				)
			);
			const expected =
				Math.max(...turns.map(Math.abs)) / Math.max(...values.map((v) => Math.abs(v)));
			expect(expected).toBeGreaterThan(size);
			expect(Math.abs(describe(W).alarm / expected - 1)).toBeLessThan(1e-9);
		}
	});

	it('outside a spinning ball the eigenvalues turn by 3 a cos(theta) / r, as in Kerr’s solution', () => {
		const G = 6.6743e-11,
			C = 299_792_458;
		const M = 5.97e24,
			r = 6.371e6,
			J = 5.86e33;
		const a = J / (M * C);
		for (const theta of [0, 0.7]) {
			const n = [Math.sin(theta), 0, Math.cos(theta)]; // from the centre to the pixel
			const at = [n[0] * r, n[1] * r, n[2] * r] as [number, number, number];
			const k = (G * M) / r ** 3;
			const B = spinDipole([0, 0, J], [0, 0, 0], at);
			const W = [0, 1, 2].map((i) =>
				[0, 1, 2].map((j) => ({ re: k * ((i === j ? 1 : 0) - 3 * n[i] * n[j]), im: B[i][j] }))
			) as never;
			const w = eigenvalues(W);
			const top = w.reduce((p, q) => (Math.hypot(q.re, q.im) > Math.hypot(p.re, p.im) ? q : p));
			const phase = Math.abs(Math.atan2(top.im, -top.re));
			// first order in a / r, as the reference checks it (rel 1e-3)
			expect(Math.abs(phase - (3 * a * Math.cos(theta)) / r)).toBeLessThan(1e-3 * ((3 * a) / r));
		}
	});

	it('a body moving across the line of sight: |B| / |E| = sqrt 3 v_perp / c; along it, no B at all', () => {
		const G = 6.6743e-11,
			C = 299_792_458,
			M = 80,
			r = 3;
		const center: [number, number, number] = [0, 0, -r];
		const k = (G * M) / r ** 3;
		const E = Math.hypot(k * 1, k * 1, k * 2); // diag(1, 1, -2) G M / r^3
		const across = movingPoint(M, center, [1.5, 0, 0], [0, 0, 0]);
		const B = Math.hypot(...across.flat());
		expect(B / E / (1.5 / C)).toBeCloseTo(Math.sqrt(3), 10);
		const along = movingPoint(M, center, [0, 0, 1.5], [0, 0, 0]);
		expect(Math.hypot(...along.flat())).toBe(0);
	});
});
