/** The "One pixel" layer: a pixel's reading in a room, and what it says. */
import { describe as group, expect, it } from 'vitest';
import { analyzeScene } from '../engine/scene';
import type { Scene } from '../engine/types';
import flywheel from '../../../../scenes/sealed-flywheel.scene.json';
import { eigenvalues } from './pixel';
import { describe, movingPoint, readingAt, spinDipole } from './probe';

const scene = flywheel as unknown as Scene;

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
