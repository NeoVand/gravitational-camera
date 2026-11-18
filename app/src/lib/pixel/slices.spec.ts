/** The ticks of the "Slice" slider: each is worked out from the demo's own scene. */
import { describe, expect, it } from 'vitest';
import safeJson from '../../../../scenes/locked-safe.scene.json';
import sunJson from '../../../../scenes/sun-at-midnight.scene.json';
import { analyzeScene } from '../engine/scene';
import type { Scene } from '../engine/types';
import {
	discRadius,
	evenScale,
	galaxySlices,
	holeSlices,
	logSlices,
	planetSlices,
	roomSlices
} from './slices';

describe('where the tidal field is worth looking', () => {
	it('the Sun at midnight: the shells underfoot, the centre, the far side, the Moon and the Sun', () => {
		const scene = sunJson as unknown as Scene;
		const marks = planetSlices(analyzeScene(scene), scene.observer.position);
		expect(marks.map((m) => m.label)).toEqual([
			'the ground',
			'the top of the upper mantle',
			'the top of the lower mantle',
			'the top of the outer core',
			'the top of the inner core',
			'the Earth’s centre',
			'the far side of the Earth',
			'the Moon',
			'the Sun'
		]);
		// the camera stands 2 m over a planet of 6371 km; its shells are 6346, 5701, 3480 and 1221.5 km in radius
		const km = marks.map((m) => m.at / 1000);
		[0.002, 25.002, 670.002, 2891.002, 5149.502, 6371.002, 12742.002].forEach((want, k) =>
			expect(km[k]).toBeCloseTo(want, 6)
		);
		// the Moon as the scene file has it at midnight, high in the sky and so nearer than its 384 400 km;
		// the Sun beyond the planet, farther than one astronomical unit
		expect(km[7]).toBeGreaterThan(378_000);
		expect(km[7]).toBeLessThan(384_400);
		expect(km[8]).toBeGreaterThan(1.495978707e8);
		expect(km[8]).toBeLessThan(1.495978707e8 + 6372);
	});

	it('a room: each thing at its centre, each wall and the floor at its nearest point', () => {
		const scene = safeJson as unknown as Scene;
		const marks = roomSlices(analyzeScene(scene), scene.observer.position);
		const at = (label: string) => marks.find((m) => m.label.includes(label))!.at;
		// the camera is 1.5 m over a floor whose top is at 0, 6 m from each side wall and 8 m from the back one
		expect(at('the floor')).toBeCloseTo(1.5, 12);
		expect(at('the left wall')).toBeCloseTo(6, 12);
		expect(at('the back wall')).toBeCloseTo(8, 12);
		// the two safes stand alike on either side, so they share a tick: sqrt(1.1^2 + 1^2 + 3.5^2) m away
		expect(at('the left safe')).toBeCloseTo(Math.hypot(1.1, 1, 3.5), 12);
		expect(marks.map((m) => m.label)).toEqual([
			'the floor',
			'the left safe and the right safe',
			'the left wall and the right wall',
			'the back wall'
		]);
		// with the names the demo's reading uses for things made of several objects
		const groups = [{ label: 'the two safes', ids: ['safe-left', 'safe-right'] }];
		const grouped = roomSlices(analyzeScene(scene), scene.observer.position, 0.45, groups);
		expect(grouped[1].label).toBe('the two safes');
		expect(grouped[1].at).toBeCloseTo(Math.hypot(1.1, 1, 3.5), 12);
		expect(marks.map((m) => m.at)).toEqual([...marks.map((m) => m.at)].sort((a, b) => a - b));
	});

	it('a black hole: the photon sphere at 3 and the horizon at 2, either side of the hole’s centre', () => {
		expect(holeSlices(40).map((m) => m.at)).toEqual([37, 38, 40, 42, 43]);
		// a camera closer than the photon sphere's far side still has what lies ahead
		expect(holeSlices(2.5).map((m) => m.at)).toEqual([0.5, 2.5, 4.5, 5.5]);
	});

	it('the Milky Way: the disc’s plane and height, the centre, and the radius that holds 95% of the thin disc', () => {
		// 1 - (1 + x) e^-x = 0.95 at x = 4.7439
		expect(discRadius(0.95)).toBeCloseTo(4.7439, 4);
		const marks = galaxySlices();
		expect(marks.map((m) => m.label)).toEqual([
			'the plane of the disc',
			'one scale height of the thin disc',
			'the edge of the disc, on the near side',
			'the Galaxy’s centre',
			'the edge of the disc, on the far side'
		]);
		const at = marks.map((m) => m.at);
		expect(at[0]).toBe(0.02);
		expect(at[1]).toBe(0.3);
		expect(at[2]).toBeCloseTo(4.7439 * 2.6 - 8.2, 3);
		expect(at[3]).toBeCloseTo(Math.hypot(8.2, 0.02), 12);
		expect(at[4]).toBeCloseTo(4.7439 * 2.6 + 8.2, 3);
	});

	it('the slider gives each stretch between marks the same length of track, and comes back to the same value', () => {
		const scale = evenScale([0, 1, 1.1, 5]);
		expect(scale.last).toBe(3);
		expect([0, 1, 1.1, 5].map(scale.toPosition)).toEqual([0, 1, 2, 3]);
		expect(scale.toValue(1.5)).toBeCloseTo(1.05, 12);
		expect(scale.toPosition(3)).toBeCloseTo(2 + 1.9 / 3.9, 12);
		for (const v of [0.3, 1.04, 2.7, 5])
			expect(scale.toValue(scale.toPosition(v))).toBeCloseTo(v, 12);
		// the Sun's slider: its eight marks sit at positions 1 to 8, in order, and the ground's (at the near end) is left out
		const scene = sunJson as unknown as Scene;
		const { marks, scale: sun } = logSlices(
			planetSlices(analyzeScene(scene), scene.observer.position),
			0.3,
			11.3
		);
		expect(marks.map((m) => m.position)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
		expect(marks[0].label).toBe('the top of the upper mantle');
		expect(sun.last).toBe(9);
		expect(10 ** sun.toValue(3)).toBeCloseTo(2891002, 3);
	});
});
