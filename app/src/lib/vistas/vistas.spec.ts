/**
 * The vista demos' physics against the Python reference
 * (reference/fixtures/vistas.json, written by `python -m gravcam.export_vistas`).
 */
import { describe, expect, it } from 'vitest';
import vistas from '../../../../reference/fixtures/vistas.json';
import { blueshift, shadowRadius, sweep, sweepTable } from './lens';
import { pairField, separationOverWavelength } from './pair';

describe('rays near a black hole', () => {
	for (const row of vistas.sweep.rows) {
		it(`sweep angles match the reference at r = ${row.r} GM/c^2`, () => {
			expect(shadowRadius(row.r)).toBeCloseTo(row.shadow, 8);
			row.psi.forEach((psi, i) => {
				const ours = sweep(row.r, psi);
				const theirs = row.dphi[i];
				if (theirs === null) expect(Number.isNaN(ours)).toBe(true);
				else expect(Math.abs(ours - theirs)).toBeLessThan(2e-7 * Math.max(1, theirs));
			});
		});
	}

	it('the table marks the shadow and agrees with the sweep', () => {
		const r = 40;
		const table = sweepTable(r, 1024);
		const edge = shadowRadius(r);
		for (let i = 0; i < table.length; i++) {
			const psi = (i / (table.length - 1)) * Math.PI;
			if (psi < edge * 0.999) expect(table[i]).toBe(-1);
			if (psi > edge * 1.001) expect(table[i]).toBeGreaterThan(0);
		}
		// looking straight away from the hole, the ray goes straight out
		expect(table[table.length - 1]).toBeCloseTo(0, 6);
	});

	it('far away, the bending is Einstein’s 4GM/(c^2 b)', () => {
		const r = 1e6;
		const psi = 1e-3; // b ~ 1000
		const b = (r * Math.sin(psi)) / Math.sqrt(1 - 2 / r);
		// the ray turns through pi - psi and the bending; the next term is 15 pi / 4 b^2
		const bending = sweep(r, psi) - (Math.PI - psi);
		expect(Math.abs(bending / (4 / b + (15 * Math.PI) / (4 * b * b)) - 1)).toBeLessThan(2e-3);
	});

	it('the whole sky is warmed by the depth of the potential', () => {
		expect(blueshift(40)).toBeCloseTo(1 / Math.sqrt(0.95), 12);
	});
});

describe('the field of an orbiting pair', () => {
	it('reproduces the table at its samples and falls to the waves far away', () => {
		const { x, strength } = vistas.pair;
		for (const i of [0, 37, 120, 200, x.length - 1]) {
			expect(Math.abs(pairField(x[i]).strength / strength[i] - 1)).toBeLessThan(1e-7);
		}
		expect(pairField(500).strength).toBeCloseTo(1, 3);
	});

	it('is Newton’s quadrupole close in: r A grows as r^-4', () => {
		const a = pairField(0.001).strength;
		const b = pairField(0.002).strength;
		expect(a / b).toBeCloseTo(16, 6);
	});

	it('winds once a wavelength far out', () => {
		const p = pairField(10).delta;
		const q = pairField(11).delta;
		expect(p - q).toBeCloseTo(2 * Math.PI, 2);
	});

	it('a pair at a tenth of light speed is a sixteenth of a wavelength across', () => {
		expect(separationOverWavelength(0.1)).toBeCloseTo(0.0637, 4);
	});
});
