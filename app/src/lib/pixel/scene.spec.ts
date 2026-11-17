/** The scene read by gravity and by light, as the demo "The four stars" shows it. */
import { describe, expect, it } from 'vitest';
import { norm, type Vec3 } from './complex';
import { readGravity, readLight, sideways, type Source } from './scene';

const body = (position: Vec3, velocity: Vec3 = [0, 0, 0], mass = 1e3, charge = 1): Source => ({
	position,
	velocity,
	mass,
	charge
});
const count = (stars: { count: number }[]) => stars.reduce((s, x) => s + x.count, 0);

describe('the four stars against the two', () => {
	it('one body at rest: two double stars on the line through it, type D; light: two single stars there', () => {
		const g = readGravity([body([-1.5, 0, 0])]);
		expect(g.type).toBe('D');
		expect(g.stars.map((s) => s.count).sort()).toEqual([2, 2]);
		for (const s of g.stars) expect(Math.abs(Math.abs(s.direction[0]) - 1)).toBeLessThan(1e-6);
		const l = readLight([body([-1.5, 0, 0])]);
		expect(l.stars.map((s) => s.count)).toEqual([1, 1]);
	});

	it('one body at 0.9 c: the midpoint of its stars is its sideways velocity', () => {
		const b = body([-1.5, 0.2, 0.3], [0.1, 0.85, -0.2]);
		const g = readGravity([b]);
		expect(g.type).toBe('D');
		const truth = sideways(b);
		expect(norm(g.read!.map((x, i) => x - truth[i]) as Vec3)).toBeLessThan(1e-6);
		const l = readLight([b]);
		const mid = [0, 1, 2].map(
			(i) => 0.5 * (l.stars[0].direction[i] + l.stars[1].direction[i])
		) as Vec3;
		expect(norm(mid.map((x, i) => x - truth[i]) as Vec3)).toBeLessThan(1e-9);
	});

	it('two bodies: four separate stars for gravity, still two for light', () => {
		const sources = [body([-1.5, 0.3, 0]), body([0.9, 1.1, 0.6], [0, 0, 0], 450, 0.45)];
		const g = readGravity(sources);
		expect(g.type).toBe('I');
		expect(g.stars.length).toBe(4);
		expect(readLight(sources).stars.length).toBe(2);
	});

	it('one wave: a quadruple star on its direction of travel; light: a double one', () => {
		const k: Vec3 = [0.6, -0.4, 0.69];
		const g = readGravity([], { k, strength: 1 });
		expect(g.type).toBe('N');
		expect(count(g.stars)).toBe(4);
		expect(g.stars.length).toBe(1);
		const l = readLight([], { k, strength: 1 });
		expect(l.stars.length).toBe(1);
		expect(l.stars[0].count).toBe(2);
	});

	it('a body and a weak wave: the double stars split', () => {
		const g = readGravity([body([-1.5, 0, 0])], { k: [0.6, -0.4, 0.69], strength: 0.05 });
		expect(g.type).toBe('I');
		expect(g.stars.length).toBe(4);
	});
});
