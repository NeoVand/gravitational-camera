/** One pixel's sky: the icosahedron is invisible to second moments; the octahedron is not. */
import { describe, expect, it } from 'vitest';
import { unit, type Vec3 } from './complex';
import { distanceFromUniform, lowPass, SKIES } from './sky';

const probes: Vec3[] = [
	[1, 0, 0],
	unit([0.3, 0.8, -0.2]),
	unit([-0.5, 0.1, 0.9]),
	unit([0.2, -0.7, -0.6])
];
const spread = (f: (n: Vec3) => number) => {
	const v = probes.map(f);
	return (Math.max(...v) - Math.min(...v)) / Math.max(...v);
};

describe("one pixel's sky", () => {
	it('twelve sources at the corners of an icosahedron give exactly a uniform sky’s second moments', () => {
		expect(distanceFromUniform(SKIES.icosahedron.sources)).toBeLessThan(1e-14);
		expect(spread((n) => lowPass(SKIES.icosahedron.sources, 4, n))).toBeLessThan(1e-12);
	});
	it('six at the corners of an octahedron do not', () => {
		expect(distanceFromUniform(SKIES.octahedron.sources)).toBeGreaterThan(0.05);
		expect(spread((n) => lowPass(SKIES.octahedron.sources, 4, n))).toBeGreaterThan(0.05);
	});
	it('fourth moments, of degree eight, tell the icosahedron from the uniform sky', () => {
		expect(spread((n) => lowPass(SKIES.icosahedron.sources, 8, n))).toBeGreaterThan(0.05);
	});
	it('the brightness kept is the sky’s total, on average', () => {
		// the mean over the sphere of the l = 0 part is the total over 4 pi
		expect(lowPass(SKIES.two.sources, 0, [1, 0, 0])).toBeCloseTo(12 / (4 * Math.PI), 12);
	});
});
