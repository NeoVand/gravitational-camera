/**
 * Majorana's stars (majorana.ts): building a state from its stars and finding them again, coincident and missing
 * roots, the basis 𝒴_m and the quartic m(z)ᵀ𝒲m(z) = 2p(z), ⟨S⟩ from the components against the table and against
 * 2P/u, the chapter's check values of |b|, |b| ≤ 1, and the coherent states' overlap cos^{4s}(ϑ/2).
 */
import { describe, expect, it } from 'vitest';
import {
	CLUSTER,
	TABLES,
	VECTORS,
	angleBetween,
	binomial,
	bloch,
	blochLength,
	coherent,
	componentsOfTable,
	componentsOfVector,
	coordinate,
	direction,
	evaluate,
	fromAngles,
	fromStars,
	majoranaPoly,
	meanSpin,
	meanSpinOfTable,
	normSquared,
	overlap,
	polyRoots,
	quartic,
	reading,
	spinOnTable,
	spinor,
	starsOf,
	superPoynting,
	tableBracket,
	tableOf,
	type CMat3,
	type Complex,
	type Vec3
} from './majorana';
import { cx } from '../pixel/complex';

const deg = (d: number) => (d * Math.PI) / 180;

/** A seeded generator, so that a failure can be repeated. */
function random(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A direction spread evenly over the sphere. */
function randomDirection(r: () => number): Vec3 {
	const z = 2 * r() - 1;
	const phi = 2 * Math.PI * r();
	const s = Math.sqrt(1 - z * z);
	return [s * Math.cos(phi), s * Math.sin(phi), z];
}

/** A random trace-free complex symmetric table. */
function randomReading(r: () => number): CMat3 {
	const sym = () => {
		const a = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 2 * r() - 1));
		const s = a.map((row, i) => row.map((_, j) => (a[i][j] + a[j][i]) / 2));
		const t = (s[0][0] + s[1][1] + s[2][2]) / 3;
		return s.map((row, i) => row.map((x, j) => (i === j ? x - t : x)));
	};
	return reading(sym(), sym());
}

const close = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** The largest distance from each of `want` to the nearest unused one of `got`. */
function mismatch(want: Vec3[], got: Vec3[]): number {
	const left = got.slice();
	let worst = 0;
	for (const w of want) {
		let best = Infinity;
		let at = -1;
		left.forEach((g, i) => {
			const d = close(w, g);
			if (d < best) {
				best = d;
				at = i;
			}
		});
		left.splice(at, 1);
		worst = Math.max(worst, best);
	}
	return worst;
}

const len = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);
const cabs = (z: Complex) => Math.hypot(z.re, z.im);

describe('the sphere and the plane', () => {
	it('maps z to n̂(z) and back', () => {
		const r = random(1);
		for (let i = 0; i < 50; i++) {
			const n = randomDirection(r);
			expect(close(direction(coordinate(n)), n)).toBeLessThan(1e-12);
		}
		expect(direction(cx(0))).toEqual([0, 0, 1]);
		expect(direction(undefined)).toEqual([0, 0, -1]);
		expect(close(direction(cx(1)), [1, 0, 0])).toBeLessThan(1e-15);
	});

	it('gives the spin one half up along n̂, with ⟨σ⟩ = n̂', () => {
		const r = random(2);
		for (let i = 0; i < 20; i++) {
			const n = randomDirection(r);
			const c = fromStars([n]);
			expect(close(bloch(c), n)).toBeLessThan(1e-12);
			// the one star of a spin one half is its Bloch vector: p(z) = c_{1/2}z − c_{−1/2}, root b/a
			const [a, b] = spinor(n);
			expect(cabs(a) ** 2 + cabs(b) ** 2).toBeCloseTo(1, 14);
		}
		const [a, b] = spinor(fromAngles(deg(60), deg(30)));
		expect(a.re).toBeCloseTo(Math.cos(deg(30)), 14);
		expect(b.re).toBeCloseTo(Math.sin(deg(30)) * Math.cos(deg(30)), 14);
		expect(b.im).toBeCloseTo(Math.sin(deg(30)) * Math.sin(deg(30)), 14);
	});

	it('measures angles near 0 and near 180°', () => {
		expect(angleBetween([0, 0, 1], [1e-9, 0, 1])).toBeCloseTo(1e-9, 20);
		expect(angleBetween([0, 0, 1], [1e-9, 0, -1])).toBeCloseTo(Math.PI - 1e-9, 15);
	});
});

describe('stars to a state and back', () => {
	it('recovers random stars, for spins one half to two, to 1e-9', () => {
		const r = random(3);
		for (const N of [1, 2, 3, 4])
			for (let i = 0; i < 200; i++) {
				const stars = Array.from({ length: N }, () => randomDirection(r));
				const c = fromStars(stars);
				expect(c).toHaveLength(N + 1);
				expect(normSquared(c)).toBeCloseTo(1, 14);
				expect(mismatch(stars, starsOf(c).all)).toBeLessThan(1e-9);
			}
	});

	it('makes p(z) vanish at every star', () => {
		const r = random(4);
		for (let i = 0; i < 50; i++) {
			const stars = Array.from({ length: 4 }, () => randomDirection(r));
			const p = majoranaPoly(fromStars(stars));
			for (const n of stars) {
				const z = coordinate(n)!;
				const scaleOf = Math.max(1, cabs(z)) ** 4;
				expect(cabs(evaluate(p, z)) / scaleOf).toBeLessThan(1e-12);
			}
		}
	});

	it('gathers coincident stars into one of higher multiplicity', () => {
		const r = random(5);
		for (let i = 0; i < 100; i++) {
			const n = randomDirection(r);
			const m = randomDirection(r);
			const four = starsOf(fromStars([n, n, n, n]));
			expect(four.stars).toHaveLength(1);
			expect(four.stars[0].count).toBe(4);
			expect(close(four.stars[0].direction, n)).toBeLessThan(1e-9);

			const pairs = starsOf(fromStars([n, n, m, m]));
			if (close(n, m) > 0.05) {
				expect(pairs.stars.map((s) => s.count)).toEqual([2, 2]);
				expect(mismatch([n, n, m, m], pairs.all)).toBeLessThan(1e-9);
			}
			const three = starsOf(fromStars([n, n, n, m]));
			if (close(n, m) > 0.05) {
				expect(three.stars.map((s) => s.count).sort()).toEqual([1, 3]);
				expect(mismatch([n, n, n, m], three.all)).toBeLessThan(1e-9);
			}
		}
	});

	it('takes a missing root as a star at −ẑ, and finds stars near the south pole', () => {
		const south: Vec3 = [0, 0, -1];
		const n = fromAngles(deg(40), deg(20));
		const c = fromStars([n, south, south, n]);
		expect(cabs(c[4])).toBeLessThan(1e-15);
		const { roots, missing } = polyRoots(majoranaPoly(c));
		expect(missing).toBe(2);
		expect(roots).toHaveLength(2);
		expect(mismatch([n, n, south, south], starsOf(c).all)).toBeLessThan(1e-9);

		for (const t of [179, 179.9, 179.999, 179.99999]) {
			const near = fromAngles(deg(t), deg(70));
			const stars = [near, n, fromAngles(deg(100), deg(200)), [0, 0, 1] as Vec3];
			expect(mismatch(stars, starsOf(fromStars(stars)).all)).toBeLessThan(1e-9);
		}
	});

	it('keeps the stars of the poles exact', () => {
		const north: Vec3 = [0, 0, 1];
		const south: Vec3 = [0, 0, -1];
		const s = starsOf(fromStars([north, north, south, south]));
		expect(s.stars).toEqual([
			{ direction: [0, 0, 1], count: 2 },
			{ direction: [0, 0, -1], count: 2 }
		]);
	});

	it('gathers only stars closer than CLUSTER', () => {
		const n = fromAngles(deg(50), deg(10));
		const m = fromAngles(deg(50) + 0.01, deg(10));
		expect(close(n, m)).toBeGreaterThan(CLUSTER);
		expect(starsOf(fromStars([n, m, [0, 0, 1], [1, 0, 0]])).stars).toHaveLength(4);
	});
});

describe('a reading as a spin two', () => {
	it('has an orthonormal basis 𝒴_m of symmetric trace-free tables, each with S_z = m', () => {
		TABLES.forEach((Y, k) => {
			const m = k - 2;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					expect(cabs({ re: Y[i][j].re - Y[j][i].re, im: Y[i][j].im - Y[j][i].im })).toBeLessThan(
						1e-15
					);
				}
			}
			const tr = Y[0][0].re + Y[1][1].re + Y[2][2].re;
			expect(Math.abs(tr)).toBeLessThan(1e-15);
			const SzY = spinOnTable(2, Y);
			for (let i = 0; i < 3; i++)
				for (let j = 0; j < 3; j++) {
					expect(SzY[i][j].re).toBeCloseTo(m * Y[i][j].re, 14);
					expect(SzY[i][j].im).toBeCloseTo(m * Y[i][j].im, 14);
				}
			TABLES.forEach((Z, l) => {
				const b = tableBracket(Y, Z);
				expect(b.re).toBeCloseTo(k === l ? 1 : 0, 14);
				expect(b.im).toBeCloseTo(0, 14);
			});
		});
		// the body's table: diag(1, 1, −2) = −√6 𝒴₀
		const Y0 = TABLES[2];
		expect(Y0[0][0].re).toBeCloseTo(-1 / Math.sqrt(6), 14);
		expect(Y0[2][2].re).toBeCloseTo(2 / Math.sqrt(6), 14);
	});

	it('satisfies m(z)ᵀ𝒲m(z) = 2p(z) for random readings', () => {
		const r = random(6);
		for (let i = 0; i < 100; i++) {
			const W = randomReading(r);
			const p = majoranaPoly(componentsOfTable(W));
			for (let j = 0; j < 5; j++) {
				const z = cx(3 * r() - 1.5, 3 * r() - 1.5);
				const q = quartic(W, z);
				const two = evaluate(p, z);
				expect(q.re).toBeCloseTo(2 * two.re, 11);
				expect(q.im).toBeCloseTo(2 * two.im, 11);
			}
			// the components hold the whole table
			const back = tableOf(componentsOfTable(W));
			for (let a = 0; a < 3; a++)
				for (let b = 0; b < 3; b++) {
					expect(back[a][b].re).toBeCloseTo(W[a][b].re, 13);
					expect(back[a][b].im).toBeCloseTo(W[a][b].im, 13);
				}
		}
	});

	it('gives the wave and the body their quartics, 2z⁴ and −12z²', () => {
		const wave = TABLES[4];
		const body = reading(
			[
				[1, 0, 0],
				[0, 1, 0],
				[0, 0, -2]
			],
			[
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			]
		);
		const z = cx(0.3, -0.7);
		const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im };
		const z4 = { re: z2.re * z2.re - z2.im * z2.im, im: 2 * z2.re * z2.im };
		expect(quartic(wave, z).re).toBeCloseTo(2 * z4.re, 14);
		expect(quartic(wave, z).im).toBeCloseTo(2 * z4.im, 14);
		expect(quartic(body, z).re).toBeCloseTo(-12 * z2.re, 14);
		expect(quartic(body, z).im).toBeCloseTo(-12 * z2.im, 14);
	});

	it('has ⟨S⟩ from the components equal to the table’s and to 2P/u, with |b| ≤ 1', () => {
		const r = random(7);
		let longest = 0;
		for (let i = 0; i < 500; i++) {
			const W = randomReading(r);
			const c = componentsOfTable(W);
			const S = meanSpin(c);
			const T = meanSpinOfTable(W);
			const { P, u } = superPoynting(W);
			for (let k = 0; k < 3; k++) {
				expect(S[k]).toBeCloseTo(T[k], 12);
				expect(bloch(c)[k]).toBeCloseTo(P[k] / u, 12);
			}
			longest = Math.max(longest, blochLength(c));
		}
		expect(longest).toBeLessThanOrEqual(1 + 1e-12);
	});

	it('keeps |b| ≤ 1 for random stars too, with equality only when they coincide', () => {
		const r = random(8);
		for (let i = 0; i < 500; i++) {
			const stars = Array.from({ length: 4 }, () => randomDirection(r));
			expect(blochLength(fromStars(stars))).toBeLessThan(1);
		}
	});
});

describe('the chapter’s check values', () => {
	const north: Vec3 = [0, 0, 1];
	const south: Vec3 = [0, 0, -1];
	const zero = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	const body = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, -2]
	];
	/** A body at w = 1 on the z axis and a wave along +ẑ with the tide E₊. */
	const bodyAndWave = (plus: number) =>
		reading(
			[
				[1 + plus, 0, 0],
				[0, 1 - plus, 0],
				[0, 0, -2]
			],
			[
				[0, plus, 0],
				[plus, 0, 0],
				[0, 0, 0]
			]
		);

	it('all four stars together: |b| = 1, along them', () => {
		const n = fromAngles(deg(70), deg(-40));
		const c = fromStars([n, n, n, n]);
		expect(blochLength(c)).toBeCloseTo(1, 13);
		expect(close(bloch(c), n)).toBeLessThan(1e-13);
		// the wave's table is the top state, all four stars at the north pole
		expect(starsOf(componentsOfTable(TABLES[4])).stars).toEqual([{ direction: north, count: 4 }]);
	});

	it('two stars at each pole: |b| = 0, and the body at rest has them', () => {
		expect(blochLength(fromStars([north, north, south, south]))).toBeLessThan(1e-15);
		const c = componentsOfTable(reading(body, zero));
		expect(blochLength(c)).toBeLessThan(1e-15);
		expect(starsOf(c).stars).toEqual([
			{ direction: north, count: 2 },
			{ direction: south, count: 2 }
		]);
	});

	it('a body and a wave of equal tide: stars at the pole and (±0.87, 0, −0.5), |b| = 0.4', () => {
		const W = bodyAndWave(1);
		const c = componentsOfTable(W);
		const { P, u } = superPoynting(W);
		expect(P[2]).toBeCloseTo(2, 13);
		expect(u).toBeCloseTo(5, 13);
		expect(blochLength(c)).toBeCloseTo(0.4, 13);
		const { all, stars } = starsOf(c);
		expect(stars[0]).toEqual({ direction: north, count: 2 });
		const half = Math.sqrt(3) / 2;
		expect(mismatch([north, north, [half, 0, -0.5], [-half, 0, -0.5]], all)).toBeLessThan(1e-12);
		expect(half).toBeCloseTo(0.87, 2);
	});

	it('E₊ = 3w: the free stars at 90°, |b| = 6/7', () => {
		const c = componentsOfTable(bodyAndWave(3));
		expect(blochLength(c)).toBeCloseTo(6 / 7, 13);
		expect(mismatch([north, north, [1, 0, 0], [-1, 0, 0]], starsOf(c).all)).toBeLessThan(1e-12);
	});

	it('two coincident pairs 120° apart: |b| = 0.91 along their bisector', () => {
		const r = random(9);
		for (let i = 0; i < 20; i++) {
			// a random pair of directions 120° apart
			const a = randomDirection(r);
			const t = randomDirection(r);
			const k = a[0] * t[0] + a[1] * t[1] + a[2] * t[2];
			const perp = [t[0] - k * a[0], t[1] - k * a[1], t[2] - k * a[2]];
			const pl = len(perp as Vec3);
			const e = perp.map((x) => x / pl) as Vec3;
			const b = [0, 1, 2].map((j) => Math.cos(deg(120)) * a[j] + Math.sin(deg(120)) * e[j]) as Vec3;
			const v = bloch(fromStars([a, a, b, b]));
			expect(len(v)).toBeCloseTo(0.91, 2);
			const mid = [a[0] + b[0], a[1] + b[1], a[2] + b[2]] as Vec3;
			expect(angleBetween(v, mid)).toBeLessThan(1e-9);
		}
		expect(
			blochLength(
				fromStars([
					fromAngles(deg(60), 0),
					fromAngles(deg(60), 0),
					fromAngles(deg(60), Math.PI),
					fromAngles(deg(60), Math.PI)
				])
			)
		).toBeCloseTo(0.91, 2);
	});

	it('the coherent states’ overlap is cos⁸(ϑ/2): 0.32 at 60°', () => {
		const r = random(10);
		for (let i = 0; i < 50; i++) {
			const a = randomDirection(r);
			const b = randomDirection(r);
			const t = angleBetween(a, b);
			expect(overlap(coherent(a, 4), coherent(b, 4))).toBeCloseTo(Math.cos(t / 2) ** 8, 12);
			expect(overlap(coherent(a, 1), coherent(b, 1))).toBeCloseTo(Math.cos(t / 2) ** 2, 12);
			expect(overlap(coherent(a, 2), coherent(b, 2))).toBeCloseTo(Math.cos(t / 2) ** 4, 12);
		}
		const sixty = overlap(coherent([0, 0, 1], 4), coherent(fromAngles(deg(60), deg(25)), 4));
		expect(sixty).toBeCloseTo(Math.cos(deg(30)) ** 8, 13);
		expect(sixty.toFixed(2)).toBe('0.32');
		// the chapter's problem: 1/2 and 1/16 at right angles
		expect(overlap(coherent([0, 0, 1], 1), coherent([1, 0, 0], 1))).toBeCloseTo(0.5, 14);
		expect(overlap(coherent([0, 0, 1], 4), coherent([1, 0, 0], 4))).toBeCloseTo(1 / 16, 14);
	});
});

describe('light as a spin one', () => {
	it('has the basis 𝒱_m, with 𝒱₀ = −ẑ', () => {
		VECTORS.forEach((V, k) => {
			VECTORS.forEach((U, l) => {
				let re = 0;
				let im = 0;
				for (let i = 0; i < 3; i++) {
					re += V[i].re * U[i].re + V[i].im * U[i].im;
					im += V[i].re * U[i].im - V[i].im * U[i].re;
				}
				expect(re).toBeCloseTo(k === l ? 1 : 0, 14);
				expect(im).toBeCloseTo(0, 14);
			});
		});
		expect(VECTORS[1][2].re).toBeCloseTo(-1, 14);
	});

	it('gives a wave both stars along its travel and a charge at rest an opposite pair', () => {
		const wave = componentsOfVector([cx(1), cx(0, 1), cx(0)]);
		expect(starsOf(wave).stars).toEqual([{ direction: [0, 0, 1], count: 2 }]);
		expect(blochLength(wave)).toBeCloseTo(1, 14);
		const charge = componentsOfVector([cx(0), cx(0), cx(1)]);
		expect(blochLength(charge)).toBeLessThan(1e-15);
		expect(starsOf(charge).stars.map((s) => s.direction)).toEqual([
			[0, 0, 1],
			[0, 0, -1]
		]);
	});
});

describe('binomials', () => {
	it('are the counts', () => {
		expect([0, 1, 2, 3, 4].map((k) => binomial(4, k))).toEqual([1, 4, 6, 4, 1]);
		expect(binomial(4, 5)).toBe(0);
	});
});
