/** The physics of chapter 1.4's ring, against the numbers the chapter prints. */
import { describe, expect, it } from 'vitest';
import {
	EOTVOS,
	G,
	PERSON,
	acceleration,
	enlargement,
	firstSecond,
	principal,
	pull,
	ratio,
	ring,
	strongestOf,
	tide,
	type Body
} from './tidal-ring';

const person = (x: number, y: number): Body => ({ x, y, mass: PERSON });
const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

describe('the tide of one mass', () => {
	it('is the person’s 9.3 eötvös along the line at one metre, and half of it across, squeezing', () => {
		const [along, across] = principal(tide([person(-1, 0)]));
		expect(along.value / EOTVOS).toBeCloseTo(-9.34, 2);
		expect(across.value / EOTVOS).toBeCloseTo(4.67, 2);
		// the stretch lies along the line to the mass, the squeeze across it
		close(Math.abs(along.axis.x), 1);
		close(Math.abs(across.axis.y), 1);
	});

	it('stretches along the line and squeezes across it as −2 : 1, wherever the mass is', () => {
		for (const angle of [0, 0.4, 1.2, Math.PI / 2, 2.5, -2]) {
			const r = 1.7;
			const t = tide([person(r * Math.cos(angle), r * Math.sin(angle))]);
			const [along, across] = principal(t);
			close(along.value, (-2 * G * PERSON) / r ** 3);
			close(across.value, (G * PERSON) / r ** 3);
			// the stretch's axis points at the mass (either way along it)
			close(Math.abs(along.axis.x * Math.cos(angle) + along.axis.y * Math.sin(angle)), 1);
			const [a, b] = ratio(t)!;
			close(a, -2);
			expect(b).toBe(1);
		}
	});

	it('falls as the cube of the distance: twice as far, eight times weaker', () => {
		const near = principal(tide([person(-1, 0)]))[0].value;
		const far = principal(tide([person(-2, 0)]))[0].value;
		close(near / far, 8);
		expect(far / EOTVOS).toBeCloseTo(-1.17, 2);
		// the pull falls only as the square
		close(Math.hypot(pull([person(-1, 0)]).x) / Math.hypot(pull([person(-2, 0)]).x), 4);
	});

	it('adds to zero over its three directions in empty space', () => {
		for (const bodies of [[person(-1, 0)], [person(0.6, 1.3), person(-2, 0.4)]]) {
			const t = tide(bodies);
			close(t.xx + t.yy + t.zz, 0, 20);
		}
	});

	it('moves each ball by −E ξ: the near and far balls apart, the side balls together', () => {
		const t = tide([person(-1, 0)]);
		const balls = ring();
		expect(balls).toHaveLength(12);
		// at +x, away from the mass: pushed outward (a stretch); at +y: pulled inward (a squeeze)
		expect(acceleration(t, balls[0].x, balls[0].y).x).toBeGreaterThan(0);
		expect(acceleration(t, balls[6].x, balls[6].y).x).toBeLessThan(0);
		expect(acceleration(t, balls[3].x, balls[3].y).y).toBeLessThan(0);
		close(acceleration(t, balls[3].x, balls[3].y).x, 0, 20);
	});

	it('agrees with the difference of the pulls across a small ring', () => {
		const bodies = [person(-0.8, 0.5), person(1.1, 1.4)];
		const t = tide(bodies);
		const h = 1e-4;
		for (const [x, y] of [
			[h, 0],
			[0, h],
			[h * 0.6, -h * 0.8]
		]) {
			// the pull at the ball less the pull at the centre: the masses seen from the ball sit at (b − ξ)
			const there = pull(bodies.map((b) => ({ ...b, x: b.x - x, y: b.y - y })));
			const here = pull(bodies);
			const a = acceleration(t, x, y);
			expect(Math.abs(there.x - here.x - a.x)).toBeLessThan(1e-3 * Math.hypot(a.x, a.y));
			expect(Math.abs(there.y - here.y - a.y)).toBeLessThan(1e-3 * Math.hypot(a.x, a.y));
		}
	});
});

describe('two equal masses on opposite sides', () => {
	it('cancel their pulls midway but double the stretch along the line', () => {
		const one = tide([person(-1, 0)]);
		const both = tide([person(-1, 0), person(1, 0)]);
		const g = pull([person(-1, 0), person(1, 0)]);
		close(Math.hypot(g.x, g.y), 0, 20);
		const [along, across] = principal(both);
		close(along.value, 2 * principal(one)[0].value);
		expect(along.value / EOTVOS).toBeCloseTo(-18.69, 2);
		close(across.value, 2 * principal(one)[1].value);
		close(Math.abs(along.axis.x), 1);
	});

	it('at right angles stretch the plane equally both ways and squeeze across it', () => {
		const t = tide([person(-1, 0), person(0, 1)]);
		const [a, b] = principal(t);
		close(a.value, b.value);
		close(a.value, (-G * PERSON) / 1);
		close(t.zz, 2 * G * PERSON);
		expect(ratio(t)).toEqual([-1, -1]);
	});

	it('balance on the bisector where cos²θ = 1/3: E_xx changes sign at y = √2 a', () => {
		const a = 1;
		const at = (y: number) => tide([person(-a, -y), person(a, -y)]).xx;
		expect(at(Math.SQRT2 * a * 0.99)).toBeLessThan(0);
		expect(at(Math.SQRT2 * a * 1.01)).toBeGreaterThan(0);
		close(at(Math.SQRT2 * a), 0, 20);
	});
});

describe('the drawing', () => {
	it('states its enlargement against one second of free fall from rest', () => {
		const largest = strongestOf(tide([person(-1, 0)]));
		close(firstSecond(largest), (G * PERSON) / 1);
		// drawn as 0.3 of the radius: about 6.42 × 10⁷ times the change in the first second
		expect(enlargement(largest, 0.3) / 1e7).toBeCloseTo(6.42, 2);
		expect(enlargement(0, 0.3)).toBe(0);
	});

	it('keeps each axis on the right-hand side, so that it does not flip', () => {
		for (const angle of [0, 1, 2, 3, -1, -2.9, Math.PI / 2, -Math.PI / 2]) {
			const [a, b] = principal(tide([person(Math.cos(angle), Math.sin(angle))]));
			for (const p of [a, b]) {
				expect(p.axis.x).toBeGreaterThanOrEqual(-1e-12);
				close(Math.hypot(p.axis.x, p.axis.y), 1);
			}
			close(a.axis.x * b.axis.x + a.axis.y * b.axis.y, 0, 12);
		}
	});
});
