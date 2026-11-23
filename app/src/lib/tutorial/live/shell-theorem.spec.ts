/** The shell theorem's live figure: the mass within, the pull inside and out, and the moment of inertia. */
import { describe, expect, it } from 'vitest';
import {
	BALL,
	LEAST,
	MOST,
	density,
	inertia,
	massWithin,
	pull,
	shading,
	type Body
} from './shell-theorem';

const powers = [LEAST, -2, -1.5, -1, -0.5, BALL, 0.5, 1, 2, 5, 10, MOST];
const bodies: Body[] = [...powers, 'shell'];

/** ∫ f from a to b by Simpson's rule, on n (even) intervals. */
function simpson(f: (x: number) => number, a: number, b: number, n = 4000) {
	const h = (b - a) / n;
	let s = f(a) + f(b);
	for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
	return (s * h) / 3;
}

describe('the mass within r', () => {
	it('is none at the centre and the whole mass at the surface and beyond', () => {
		for (const body of bodies) {
			expect(massWithin(0, body)).toBe(0);
			expect(massWithin(1, body)).toBe(1);
			expect(massWithin(2.5, body)).toBe(1);
		}
	});

	it('is the integral of the density', () => {
		for (const p of [-1.5, -1, BALL, 1, 4]) {
			// with x = r s², the integrand 4π x² ρ dx is smooth at the centre; the midpoint rule keeps off it
			for (const r of [0.3, 0.7, 1]) {
				const n = 4000;
				let m = 0;
				for (let i = 0; i < n; i++) {
					const s = (i + 0.5) / n;
					const x = r * s * s;
					m += 4 * Math.PI * x * x * density(x, p) * 2 * r * s;
				}
				m /= n;
				expect(m).toBeCloseTo(massWithin(r, p), 6);
			}
		}
	});

	it('gathers at the centre as p → −3, and at the surface for the shell', () => {
		expect(massWithin(0.01, -2.999)).toBeGreaterThan(0.98);
		expect(massWithin(0.5, LEAST)).toBeCloseTo(0.5 ** 0.1, 12);
		expect(massWithin(0.999, 'shell')).toBe(0);
		expect(massWithin(0.95, 2000)).toBeLessThan(1e-40);
	});
});

describe('the pull', () => {
	it('is continuous at the surface for every power, where it is GM/R²', () => {
		for (const p of powers) {
			expect(pull(1, p)).toBe(1);
			expect(pull(1 - 1e-9, p)).toBeCloseTo(1, 6);
			expect(pull(1 + 1e-9, p)).toBeCloseTo(1, 6);
		}
	});

	it('is GM/r² outside, whatever the body', () => {
		for (const r of [1, 1.3, 2, 2.7, 3]) {
			for (const body of bodies) expect(pull(r, body)).toBe(1 / (r * r));
		}
		for (const body of bodies) expect(pull(2, body)).toBe(0.25);
	});

	it('is GM r/R³ inside the uniform ball', () => {
		for (const r of [0, 0.2, 0.5, 0.9]) expect(pull(r, BALL)).toBeCloseTo(r, 14);
	});

	it('is zero inside the shell, which jumps to GM/R² at the surface', () => {
		for (const r of [0, 0.1, 0.5, 0.999]) expect(pull(r, 'shell')).toBe(0);
		expect(pull(1, 'shell')).toBe(1);
		// and a shell is the limit of a steep power
		expect(pull(0.9, 2000)).toBeLessThan(1e-80);
	});

	it('approaches the point mass’s GM/r² inside as p → −3', () => {
		for (const r of [0.05, 0.3, 0.8]) {
			const point = 1 / (r * r);
			expect(Math.abs(pull(r, -2.9999) / point - 1)).toBeLessThan(1e-3);
			// and at the slider's end within a third
			expect(pull(r, LEAST) / point).toBeGreaterThan(0.74);
		}
		// p = −1 pulls with GM/R² at every depth
		for (const r of [0, 0.25, 0.75]) expect(pull(r, -1)).toBeCloseTo(1, 14);
		expect(pull(0, -1.5)).toBe(Infinity);
		expect(pull(0, 0.5)).toBe(0);
	});
});

describe('the moment of inertia', () => {
	it('is (2/3)(p+3)/(p+5) MR², the sum of the shells’ (2/3) r² dM', () => {
		for (const p of [-2, -1, BALL, 1, 3, 10]) {
			// dM/dr = (p+3) r^(p+2)
			const I = simpson((r) => (2 / 3) * r * r * (p + 3) * r ** (p + 2), 0, 1);
			expect(I).toBeCloseTo(inertia(p), 8);
		}
	});

	it('is 0.4 for the uniform ball and 2/3 for the shell', () => {
		expect(inertia(BALL)).toBeCloseTo(0.4, 15);
		expect(inertia('shell')).toBe(2 / 3);
		expect(inertia(1e9)).toBeCloseTo(2 / 3, 8);
		expect(inertia(-2.99999)).toBeLessThan(1e-5);
	});

	it('grows as the mass moves out, from the point to the shell', () => {
		for (let i = 1; i < powers.length; i++)
			expect(inertia(powers[i])).toBeGreaterThan(inertia(powers[i - 1]));
		expect(inertia(MOST)).toBeLessThan(inertia('shell'));
		// near the real Earth's 0.331 for p close to −1
		expect(inertia(-1)).toBeCloseTo(1 / 3, 15);
	});
});

describe('the shading of the cut', () => {
	it('is even for the ball, a rim for the shell, and brightest where the density is greatest', () => {
		expect(shading(BALL).every((s) => s.level === 1)).toBe(true);
		const shell = shading('shell');
		expect(shell[0].level).toBe(0);
		expect(shell[shell.length - 1].level).toBe(1);
		const out = shading(4);
		expect(out[0].level).toBe(0);
		expect(out[out.length - 1].level).toBe(1);
		const inward = shading(-2);
		expect(inward[0].level).toBe(1);
		expect(inward[inward.length - 1].level).toBeLessThan(0.01);
		for (const body of bodies) {
			const s = shading(body);
			for (let i = 1; i < s.length; i++) expect(s[i].t).toBeGreaterThan(s[i - 1].t);
			for (const { level } of s) expect(level).toBeGreaterThanOrEqual(0);
			for (const { level } of s) expect(level).toBeLessThanOrEqual(1);
		}
	});
});
