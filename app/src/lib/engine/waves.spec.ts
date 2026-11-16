/**
 * The engine's wave physics against the Python reference
 * (reference/fixtures/which-way.json; derivations and brute-force checks in
 * reference/gravcam/waves.py).
 */
import { describe, expect, it } from 'vitest';
import fixture from '../../../../reference/fixtures/which-way.json';
import sceneJson from '../../../../scenes/which-way.scene.json';
import { analyzeScene } from './scene';
import type { Scene, Vec3 } from './types';
import {
	MAX_WAVE_SOURCES,
	WAVE_STRIDE,
	packWaves,
	power,
	rotors,
	seenFrom,
	spotWidth,
	wavelength
} from './waves';

const scene = sceneJson as unknown as Scene;
const objects = analyzeScene(scene);
const observer = scene.observer.position;
const found = rotors(objects);

const close = (got: number, want: number, rel = 1e-9) =>
	expect(Math.abs(got - want)).toBeLessThanOrEqual(rel * Math.abs(want) + 1e-300);

describe('rotors in the drums scene', () => {
	it('finds the turning pairs and leaves out the still one', () => {
		expect(found.map((r) => r.members.join(' ')).sort()).toEqual(
			fixture.rotors.map((r) => r.members.join(' ')).sort()
		);
	});

	it('agrees with the reference on every number', () => {
		for (const ref of fixture.rotors) {
			const r = found.find((x) => x.members.join() === ref.members.join())!;
			r.axis.forEach((v, k) => close(v, ref.angular_direction[k], 1e-12));
			close(r.omega, ref.omega, 1e-15);
			close(r.deltaInertia, ref.delta_inertia);
			close(power(r), ref.power);
			close(wavelength(r), ref.wavelength);
			const seen = seenFrom(r, observer);
			const at = ref.at_observer;
			close(seen.distance, at.distance);
			close(seen.cosIota, at.cos_iota);
			close(seen.amplitude, at.amplitude);
			close(seen.flux, at.flux);
			close(seen.circular, at.circular);
			close(seen.linear, at.linear);
		}
	});

	it('tells the senses apart: clockwise on top, anticlockwise in the middle', () => {
		const byDrum = (name: string) =>
			seenFrom(
				found.find((r) => r.members[0].startsWith(name))!,
				observer
			);
		expect(byDrum('drum-top').circular).toBeLessThan(-0.99);
		expect(byDrum('drum-middle').circular).toBeGreaterThan(0.99);
	});
});

describe('the wave camera', () => {
	it('sees each rotor as a spot as wide as the wavelength allows', () => {
		expect(spotWidth(0.1, 1)).toBeCloseTo(0.1029, 10);
	});

	it('packs direction, spot, brightness and polarization', () => {
		const packed = packWaves(found, observer, { c: 0.2, aperture: 1 });
		expect(packed.count).toBe(2);
		expect(packed.buffer.byteLength).toBe(WAVE_STRIDE * MAX_WAVE_SOURCES);
		const f = new Float32Array(packed.buffer);
		found.forEach((r, i) => {
			const k = (i * WAVE_STRIDE) / 4;
			const seen = seenFrom(r, observer, 0.2);
			const toward: Vec3 = [
				r.center[0] - observer[0],
				r.center[1] - observer[1],
				r.center[2] - observer[2]
			];
			const n = Math.hypot(...toward);
			toward.forEach((v, j) => expect(f[k + j]).toBeCloseTo(v / n, 6));
			// lambda = pi c / Omega = 0.1 m for 1 rev/s at c = 0.2 m/s
			expect(f[k + 3]).toBeCloseTo((1.029 * 0.1) / 2.355, 6);
			// equal rotors at nearly equal distances: the dimmer within 15% of the brighter
			expect(f[k + 7]).toBeGreaterThan(0.85);
			expect(f[k + 8]).toBeCloseTo(seen.circular, 6);
		});
	});

	it('brightens as light slows: the power goes as 1 / c⁵', () => {
		const r = found[0];
		close(power(r, 0.2) / power(r), (299_792_458 / 0.2) ** 5, 1e-12);
		expect(power(r, 0.2)).toBeGreaterThan(0.01);
	});
});
