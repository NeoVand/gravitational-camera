/** The potential and the field of chapter 1.2's map, against their closed forms and against the engine's tide. */
import { describe, expect, it } from 'vitest';
import { tidalTensor } from '../../engine/tidal';
import {
	G,
	arrowLength,
	field,
	fieldOf,
	grid,
	isolines,
	levels,
	points,
	potential,
	sample,
	shares,
	zeroPull,
	zeroPullFraction,
	type Body
} from './potential-map';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));
const relative = (a: number, b: number, tolerance: number) =>
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tolerance * Math.abs(b));

const heavy: Body = { x: -1, y: 0, mass: 1000 };
const light: Body = { x: 1, y: 0, mass: 250 };

describe('one mass', () => {
	it('has the potential −G m / r and the pull G m / r² toward it', () => {
		const m: Body = { x: 0.3, y: -0.4, mass: 70 };
		for (const [x, y] of [
			[1.3, -0.4],
			[0.3, 2.6],
			[-1.2, 0.8],
			[2, 2]
		]) {
			const r = Math.hypot(x - m.x, y - m.y);
			relative(potential([m], x, y), (-G * m.mass) / r, 1e-14);
			const g = field([m], x, y);
			relative(Math.hypot(g.x, g.y), (G * m.mass) / r ** 2, 1e-14);
			// toward the mass
			close((g.x * (m.x - x) + g.y * (m.y - y)) / (Math.hypot(g.x, g.y) * r), 1);
		}
	});

	it('is the person’s 4.7 × 10⁻⁹ J kg⁻¹ and m s⁻² at one metre', () => {
		const person: Body = { x: 0, y: 0, mass: 70 };
		expect(potential([person], 1, 0) / 1e-9).toBeCloseTo(-4.672, 3);
		expect(field([person], 1, 0).x / 1e-9).toBeCloseTo(-4.672, 3);
	});
});

describe('two masses', () => {
	it('add their potentials as numbers and their pulls as arrows', () => {
		const [x, y] = [0.2, 0.9];
		const r1 = Math.hypot(x - heavy.x, y - heavy.y);
		const r2 = Math.hypot(x - light.x, y - light.y);
		relative(potential([heavy, light], x, y), -G * (heavy.mass / r1 + light.mass / r2), 1e-14);
		const g = field([heavy, light], x, y);
		const gx =
			G * ((heavy.mass * (heavy.x - x)) / r1 ** 3 + (light.mass * (light.x - x)) / r2 ** 3);
		const gy =
			G * ((heavy.mass * (heavy.y - y)) / r1 ** 3 + (light.mass * (light.y - y)) / r2 ** 3);
		relative(g.x, gx, 1e-13);
		relative(g.y, gy, 1e-13);
	});

	it('share the potential as fractions that add to one, and the sizes of the pulls', () => {
		const s = shares([heavy, light], 0, 1);
		// equidistant: the potential and the pulls share as the masses, 4 : 1
		close(s.potential[0], 0.8);
		close(s.potential[1], 0.2);
		close(s.pull[0], 0.8);
		const t = shares([heavy, light], 0.5, -0.3);
		close(t.potential[0] + t.potential[1], 1);
		close(t.pull[0] + t.pull[1], 1);
		expect(t.potential.every((v) => v > 0 && v < 1)).toBe(true);
	});
});

describe('the field is minus the gradient of the potential', () => {
	const bodies = [heavy, light, { x: 0.4, y: 1.1, mass: 70 }];

	it('by central differences, anywhere off the masses', () => {
		const h = 1e-5;
		for (const [x, y] of [
			[0, 0.5],
			[0.33, 0],
			[-2.5, 1.4],
			[1.6, -0.7],
			[0.4, 0.8]
		]) {
			const g = field(bodies, x, y);
			const dx = (potential(bodies, x + h, y) - potential(bodies, x - h, y)) / (2 * h);
			const dy = (potential(bodies, x, y + h) - potential(bodies, x, y - h)) / (2 * h);
			const size = Math.hypot(g.x, g.y);
			expect(Math.abs(g.x + dx)).toBeLessThan(1e-7 * size);
			expect(Math.abs(g.y + dy)).toBeLessThan(1e-7 * size);
		}
	});

	it('and its own gradient is minus the engine’s tidal tensor, ∂_j g_i = −∂_i ∂_j Φ', () => {
		const h = 1e-5;
		const [x, y] = [0.25, 0.6];
		const e = tidalTensor(points(bodies), [x, y, 0]);
		const gx = (field(bodies, x + h, y).x - field(bodies, x - h, y).x) / (2 * h);
		const gxy = (field(bodies, x, y + h).x - field(bodies, x, y - h).x) / (2 * h);
		const gy = (field(bodies, x, y + h).y - field(bodies, x, y - h).y) / (2 * h);
		const scale = Math.hypot(e[0], e[1], e[3]);
		expect(Math.abs(gx + e[0])).toBeLessThan(1e-6 * scale);
		expect(Math.abs(gxy + e[1])).toBeLessThan(1e-6 * scale);
		expect(Math.abs(gy + e[3])).toBeLessThan(1e-6 * scale);
	});
});

describe('the point of zero pull', () => {
	it('lies 1 / (1 + √(M/m)) of the way from the lighter mass: a third for 1000 kg and 250 kg', () => {
		close(zeroPullFraction(1000, 250), 1 / 3);
		close(zeroPullFraction(1000, 1000), 1 / 2);
		const p = zeroPull(heavy, light);
		close(p.x, 1 - 2 / 3);
		close(p.y, 0);
		close(p.fromLighter, 2 / 3);
		// the order of the two does not matter
		expect(zeroPull(light, heavy)).toEqual(p);
	});

	it('is where the two pulls cancel, nearer the lighter mass, for any masses and any line', () => {
		for (const [m1, m2, a, b] of [
			[1000, 70, { x: -1, y: 0 }, { x: 1, y: 0 }],
			[1000, 400, { x: 0.3, y: -1.2 }, { x: -0.6, y: 0.9 }],
			[500, 500, { x: 2, y: 1 }, { x: -1, y: -1 }],
			[80, 900, { x: -0.2, y: 0.4 }, { x: 0.5, y: 1.7 }]
		] as const) {
			const A = { ...a, mass: m1 };
			const B = { ...b, mass: m2 };
			const p = zeroPull(A, B);
			const g = field([A, B], p.x, p.y);
			const one = fieldOf(A, p.x, p.y);
			expect(Math.hypot(g.x, g.y)).toBeLessThan(1e-12 * Math.hypot(one.x, one.y));
			const lighter = m1 <= m2 ? A : B;
			const d = Math.hypot(A.x - B.x, A.y - B.y);
			close(Math.hypot(p.x - lighter.x, p.y - lighter.y), p.fromLighter);
			expect(p.fromLighter).toBeLessThanOrEqual(d / 2 + 1e-12);
		}
	});

	it('is not where the potential is zero: Φ there is below the potential far away', () => {
		const p = zeroPull(heavy, light);
		const phi = potential([heavy, light], p.x, p.y);
		// −G (1000 / (4/3) + 250 / (2/3)) = −G · 1125
		relative(phi, -G * 1125, 1e-14);
		expect(phi).toBeLessThan(0);
	});

	it('is a saddle of the potential: lowest across the line, highest along it', () => {
		const p = zeroPull(heavy, light);
		const at = potential([heavy, light], p.x, p.y);
		const h = 1e-3;
		expect(potential([heavy, light], p.x + h, p.y)).toBeLessThan(at);
		expect(potential([heavy, light], p.x - h, p.y)).toBeLessThan(at);
		expect(potential([heavy, light], p.x, p.y + h)).toBeGreaterThan(at);
		expect(potential([heavy, light], p.x, p.y - h)).toBeGreaterThan(at);
	});
});

describe('the levels', () => {
	it('are evenly spaced in the logarithm, fall on powers of ten, and run deeper', () => {
		const ls = levels(1e-8, 1e-6, 10);
		expect(ls).toHaveLength(21);
		expect(ls.every((l) => l < 0)).toBe(true);
		close(ls[0], -1e-8, 12);
		close(ls[10], -1e-7, 12);
		close(ls[20], -1e-6, 12);
		for (let k = 1; k < ls.length; k++) relative(ls[k] / ls[k - 1], 10 ** 0.1, 1e-12);
	});

	it('cover only the range asked for', () => {
		const ls = levels(2e-8, 5e-7, 4);
		expect(Math.abs(ls[0])).toBeGreaterThanOrEqual(2e-8);
		expect(Math.abs(ls[ls.length - 1])).toBeLessThanOrEqual(5e-7);
		expect(Math.abs(ls[0]) / 10 ** -0.25).toBeGreaterThan(2e-8 * 0.999);
	});
});

describe('the lines of the map', () => {
	const frame = { left: -3.2, top: 1.8, width: 6.4, height: 3.6, step: 0.025 };

	// a line is placed by interpolating along a cell's edge; it stays within a twentieth of a cell of the true one
	const within = 0.05 * frame.step;

	it('are circles of radius G m / |Φ| about one mass', () => {
		const m: Body = { x: 0.2, y: -0.1, mass: 1000 };
		const g = sample(grid(frame), [m], 1e-5);
		for (const r of [0.15, 0.5, 1.2]) {
			const loops = isolines(g, (-G * m.mass) / r);
			expect(loops).toHaveLength(1);
			const loop = loops[0];
			// many points: drawn smooth, not as a polygon
			expect(loop.length / 2).toBeGreaterThan(20);
			for (let k = 0; k < loop.length; k += 2)
				expect(Math.abs(Math.hypot(loop[k] - m.x, loop[k + 1] - m.y) - r)).toBeLessThan(within);
		}
	});

	it('close round the outside of the frame where they leave it, so that each bounds a region', () => {
		const g = sample(grid(frame), [heavy, light], 1e-5);
		const loops = isolines(g, -G * 1250 * 0.3);
		expect(loops.length).toBeGreaterThan(0);
		let outside = 0;
		for (const loop of loops)
			for (let k = 0; k < loop.length; k += 2) {
				const x = loop[k];
				const y = loop[k + 1];
				expect(x).toBeGreaterThanOrEqual(frame.left - g.hx - 1e-12);
				expect(x).toBeLessThanOrEqual(frame.left + frame.width + g.hx + 1e-12);
				if (x < frame.left || x > frame.left + frame.width) outside++;
				expect(Math.abs(y)).toBeLessThanOrEqual(frame.top + g.hy + 1e-12);
			}
		expect(outside).toBeGreaterThan(0);
	});

	it('are two loops below the level of the zero-pull point and one above it', () => {
		const g = sample(grid(frame), [heavy, light], 1e-5);
		const p = zeroPull(heavy, light);
		const saddle = potential([heavy, light], p.x, p.y);
		expect(isolines(g, saddle * 1.05)).toHaveLength(2);
		expect(isolines(g, saddle * 0.95)).toHaveLength(1);
		// and none at a level deeper than the grid holds
		expect(isolines(g, -2e-5)).toHaveLength(0);
	});

	it('lie where the potential takes their level', () => {
		const g = sample(grid(frame), [heavy, light], 1e-5);
		for (const level of levels(3e-8, 3e-7, 4))
			for (const loop of isolines(g, level))
				for (let k = 0; k < loop.length; k += 2) {
					const [x, y] = [loop[k], loop[k + 1]];
					if (Math.abs(x) > 3.2 || Math.abs(y) > 1.8) continue;
					// a fifth of a metre from a mass the line is under its sphere in the figure
					if ([heavy, light].some((b) => Math.hypot(x - b.x, y - b.y) < 0.2)) continue;
					// the distance to the true line: the error in Φ over the size of its gradient
					const g = field([heavy, light], x, y);
					const off = Math.abs(potential([heavy, light], x, y) - level) / Math.hypot(g.x, g.y);
					expect(off).toBeLessThan(within);
				}
	});
});

describe('the arrow', () => {
	it('grows by one unit for each factor of ten in the field', () => {
		close(arrowLength(1e-9, 1e-10, 20), 20);
		close(arrowLength(1e-7, 1e-10, 20), 60);
		expect(arrowLength(1e-11, 1e-10, 20)).toBe(0);
		expect(arrowLength(0, 1e-10, 20)).toBe(0);
	});
});
