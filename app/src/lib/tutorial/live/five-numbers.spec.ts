/** Five coefficients, the table they build, its eigenvalues, and how the three rings are drawn. */
import { describe, expect, it } from 'vitest';
import {
	BASIS,
	LARGEST,
	LEAST,
	MOST,
	PLANES,
	PRESETS,
	RATIO_TOLERANCE,
	SCALE,
	STEP,
	apply,
	block,
	coefficients,
	contract,
	determinant,
	displaced,
	eigen,
	kind,
	norm,
	push,
	random,
	ratio,
	ring,
	ringKind,
	singleMass,
	size,
	snap,
	table,
	trace,
	type Coefficients,
	type Matrix
} from './five-numbers';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

/** A small generator of the same random numbers on every run. */
function source(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}

const next = source(20261123);
const entry = (spread: number) => spread * (2 * next() - 1);

/** A random symmetric table, not trace-free, with entries of the given spread. */
function symmetric(spread: number): Matrix {
	const [a, b, c, d, e, f] = Array.from({ length: 6 }, () => entry(spread));
	return [
		[a, d, f],
		[d, b, e],
		[f, e, c]
	];
}

/** R diag(λ) Rᵀ for a random rotation R, to make tables with chosen, perhaps equal, eigenvalues. */
function turned(values: [number, number, number]): Matrix {
	// a random unit quaternion
	const q = Array.from({ length: 4 }, () => entry(1));
	const n = Math.hypot(...q);
	const [w, x, y, z] = q.map((v) => v / n);
	const r = [
		[1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
		[2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
		[2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)]
	];
	const t = [0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) =>
				r[i][0] * values[0] * r[j][0] +
				r[i][1] * values[1] * r[j][1] +
				r[i][2] * values[2] * r[j][2]
		)
	);
	return t as Matrix;
}

const randomC = (spread: number) => Array.from({ length: 5 }, () => entry(spread)) as Coefficients;

describe('the basis', () => {
	it('is the chapter’s five tables, each symmetric and trace-free', () => {
		expect(BASIS).toHaveLength(5);
		const s2 = Math.SQRT1_2;
		const s6 = 1 / Math.sqrt(6);
		expect(BASIS[0][0][1]).toBe(s2);
		expect(BASIS[1][1][2]).toBe(s2);
		expect(BASIS[2][0][2]).toBe(s2);
		expect([BASIS[3][0][0], BASIS[3][1][1], BASIS[3][2][2]]).toEqual([s2, -s2, 0]);
		expect([BASIS[4][0][0], BASIS[4][1][1], BASIS[4][2][2]]).toEqual([-s6, -s6, 2 * s6]);
		for (const b of BASIS) {
			close(trace(b), 0, 15);
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) expect(b[i][j]).toBe(b[j][i]);
		}
	});

	it('is orthonormal: b^A : b^B = δ^AB', () => {
		for (let A = 0; A < 5; A++)
			for (let B = 0; B < 5; B++) close(contract(BASIS[A], BASIS[B]), A === B ? 1 : 0, 15);
	});

	it('builds every symmetric trace-free table, and c_A = b^A : 𝓔 reads its coefficients back', () => {
		for (let n = 0; n < 200; n++) {
			const c = randomC(3);
			const t = table(c);
			close(trace(t), 0, 14);
			coefficients(t).forEach((v, A) => close(v, c[A], 14));
			// a symmetric table less its trace part is rebuilt from its five coefficients
			const s = symmetric(2);
			const third = trace(s) / 3;
			const free = s.map((row, i) => row.map((v, j) => v - (i === j ? third : 0))) as Matrix;
			const back = table(coefficients(s));
			for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(back[i][j], free[i][j], 13);
		}
	});

	it('gives |𝓔| = √(c_A c_A) = √(𝓔_ij 𝓔_ij) = √(λ₁² + λ₂² + λ₃²)', () => {
		for (let n = 0; n < 200; n++) {
			const c = randomC(3);
			const t = table(c);
			close(norm(t), size(c), 13);
			close(Math.hypot(...eigen(t).map((e) => e.value)), size(c), 12);
		}
	});
});

describe('the eigen-solver', () => {
	const tables: Matrix[] = [
		...Array.from({ length: 400 }, () => symmetric(3)),
		...Array.from({ length: 200 }, () => table(randomC(3))),
		...Array.from({ length: 50 }, () => symmetric(1e6)),
		...Array.from({ length: 50 }, () => symmetric(1e-6)),
		...Array.from({ length: 50 }, () => turned([-2, 1, 1])),
		...Array.from({ length: 50 }, () => turned([1, 1, 1])),
		...Array.from({ length: 50 }, () => turned([-1, 1e-12, 1])),
		...Array.from({ length: 50 }, () => turned([3, 3 + 1e-9, -6])),
		...Object.values(PRESETS).map(table),
		[
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		],
		[
			[1, 1e-200, 0],
			[1e-200, 1, 0],
			[0, 0, 1]
		],
		[
			[1e9, 1, 0],
			[1, -1e-9, 0],
			[0, 0, 5]
		]
	];

	it('satisfies T v = λ v with orthonormal axes, smallest first, for random tables', () => {
		for (const t of tables) {
			const scale = Math.max(norm(t), 1e-300);
			const e = eigen(t);
			expect(e[0].value).toBeLessThanOrEqual(e[1].value);
			expect(e[1].value).toBeLessThanOrEqual(e[2].value);
			for (const { value, axis } of e) {
				const v = apply(t, axis);
				for (let k = 0; k < 3; k++)
					expect(Math.abs(v[k] - value * axis[k])).toBeLessThan(1e-13 * scale);
				// the largest component is positive
				const big = axis.reduce((m, x, k) => (Math.abs(x) > Math.abs(axis[m]) ? k : m), 0);
				expect(axis[big]).toBeGreaterThan(0);
			}
			for (let i = 0; i < 3; i++)
				for (let j = 0; j < 3; j++) {
					const dot = e[i].axis.reduce((s, x, k) => s + x * e[j].axis[k], 0);
					close(dot, i === j ? 1 : 0, 13);
				}
		}
	});

	it('keeps the trace, the length and the determinant', () => {
		for (const t of tables) {
			const scale = Math.max(norm(t), 1e-300);
			const [p, q, r] = eigen(t).map((e) => e.value);
			expect(Math.abs(p + q + r - trace(t))).toBeLessThan(1e-13 * scale);
			expect(Math.abs(Math.hypot(p, q, r) - norm(t))).toBeLessThan(1e-13 * scale);
			expect(Math.abs(p * q * r - determinant(t))).toBeLessThanOrEqual(1e-12 * scale ** 3);
		}
	});

	it('finds chosen eigenvalues, equal ones too, to the rounding', () => {
		for (const values of [
			[-2, 1, 1],
			[1, 1, 1],
			[-1, 0, 1],
			[-6, 3, 3 + 1e-9],
			[0, 0, 0]
		] as [number, number, number][])
			for (let n = 0; n < 20; n++) {
				const got = eigen(turned(values)).map((e) => e.value);
				got.forEach((v, k) => expect(Math.abs(v - values[k])).toBeLessThan(1e-14 * 8));
			}
	});

	it('gives eigenvalues that add to zero for every table of the five coefficients', () => {
		for (let n = 0; n < 500; n++) {
			const c = randomC(3);
			const [p, q, r] = eigen(table(c)).map((e) => e.value);
			expect(Math.abs(p + q + r)).toBeLessThan(1e-13 * Math.max(1, size(c)));
			// so one at least is a stretch and one a squeeze: no table squeezes every direction
			expect(p).toBeLessThanOrEqual(0);
			expect(r).toBeGreaterThanOrEqual(0);
		}
	});
});

describe('the presets', () => {
	it('put the person along x: diag(−2, 1, 1), c_4 = −3/√2, c_5 = 3/√6, |𝓔| = √6', () => {
		const t = table(PRESETS.person);
		const want = [
			[-2, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(t[i][j], want[i][j], 15);
		close(PRESETS.person[3], -2.1213203435596424);
		close(PRESETS.person[4], 1.224744871391589);
		close(size(PRESETS.person), Math.sqrt(6));
		const [low, mid, high] = eigen(t);
		close(low.value, -2, 14);
		close(mid.value, 1, 14);
		close(high.value, 1, 14);
		expect(low.axis).toEqual([1, 0, 0]);
	});

	it('put the waves along z: plus diag(√2, −√2, 0) in c_4, cross 𝓔_xy = √2 in c_1, nothing in z', () => {
		const plus = table(PRESETS.plus);
		const cross = table(PRESETS.cross);
		close(plus[0][0], Math.SQRT2, 15);
		close(plus[1][1], -Math.SQRT2, 15);
		close(cross[0][1], Math.SQRT2, 15);
		close(cross[1][0], Math.SQRT2, 15);
		for (const t of [plus, cross]) {
			for (let k = 0; k < 3; k++) {
				expect(t[2][k]).toBe(0);
				expect(t[k][2]).toBe(0);
			}
			expect(eigen(t).map((e) => Number(e.value.toFixed(12)) + 0)).toEqual([
				-1.414213562373, 0, 1.414213562373
			]);
			close(norm(t), 2);
		}
		// the cross wave is the plus wave turned by 45° about z: its eigen-axes are the diagonals
		const [low, , high] = eigen(cross);
		close(Math.abs(low.axis[0]), Math.SQRT1_2);
		close(Math.abs(low.axis[1]), Math.SQRT1_2);
		close(Math.abs(high.axis[0]), Math.SQRT1_2);
		close(low.axis[0] * low.axis[1], -0.5);
		close(high.axis[0] * high.axis[1], 0.5);
	});

	it('stay on the sliders, and random tables lie on their grid', () => {
		for (const c of Object.values(PRESETS))
			for (const v of c) {
				expect(v).toBeGreaterThanOrEqual(LEAST);
				expect(v).toBeLessThanOrEqual(MOST);
			}
		const draw = source(7);
		for (let n = 0; n < 100; n++)
			for (const v of random(draw)) {
				expect(Math.abs(v)).toBeLessThanOrEqual(2.5);
				close(v / STEP, Math.round(v / STEP), 9);
			}
		expect(snap(3.4)).toBe(3);
		expect(snap(-0.026)).toBe(-0.05);
		expect(Object.is(snap(-0.001), -0)).toBe(false);
	});
});

describe('the point-mass ratio −2 : 1 : 1', () => {
	it('is found for a single mass along any axis, at any distance', () => {
		const p = singleMass(table(PRESETS.person));
		expect(p).toBeDefined();
		expect(p!.axis).toEqual([1, 0, 0]);
		close(p!.strength, 1, 14);
		// c_5 < 0 alone is a mass straight above, diag(1, 1, −2)
		const above = singleMass(table([0, 0, 0, 0, -2]));
		expect(above?.axis).toEqual([0, 0, 1]);
		close(above!.strength, 2 / Math.sqrt(6));
		for (let n = 0; n < 100; n++) {
			const k = 0.1 + 3 * next();
			const t = turned([-2 * k, k, k]);
			const s = singleMass(t);
			expect(s).toBeDefined();
			close(s!.strength, k, 12);
			// the axis points at the mass: the stretch is along it
			const v = apply(t, s!.axis);
			for (let i = 0; i < 3; i++) close(v[i], -2 * k * s!.axis[i], 12);
		}
		expect(ratio([-2, 1, 1])).toEqual([-2, 1, 1]);
	});

	it('is not found for the opposite ratio, for waves, for zero or for tables a little off', () => {
		// c_5 > 0 alone is diag(−1, −1, 2): a squeeze of twice the size and two stretches
		expect(singleMass(table([0, 0, 0, 0, 1]))).toBeUndefined();
		expect(ratio([-1, -1, 2])).toEqual([-1, -1, 2]);
		expect(singleMass(table(PRESETS.plus))).toBeUndefined();
		expect(singleMass(table(PRESETS.cross))).toBeUndefined();
		expect(singleMass(table(PRESETS.zero))).toBeUndefined();
		expect(ratio([0, 0, 0])).toBeUndefined();
		const off = 3 * RATIO_TOLERANCE;
		expect(singleMass(turned([-2, 1 - off, 1 + off]))).toBeUndefined();
		expect(
			singleMass(turned([-2, 1 - RATIO_TOLERANCE / 4, 1 + RATIO_TOLERANCE / 4]))
		).toBeDefined();
		for (let n = 0; n < 200; n++) {
			const t = table(randomC(3));
			const [, mid, high] = eigen(t);
			expect(singleMass(t) !== undefined).toBe(
				mid.value > 0 && high.value - mid.value <= RATIO_TOLERANCE * norm(t)
			);
		}
	});
});

describe('the three rings', () => {
	const corners: Coefficients[] = Array.from(
		{ length: 32 },
		(_, n) => [0, 1, 2, 3, 4].map((k) => ((n >> k) & 1 ? MOST : LEAST)) as Coefficients
	);

	it('are the planes xy, yz and zx, each drawn with its block of the table', () => {
		expect(PLANES.map((p) => p.id)).toEqual(['xy', 'yz', 'zx']);
		const t = table(PRESETS.person);
		expect(block(t, PLANES[0])).toEqual({ a: t[0][0], b: t[0][1], d: t[1][1] });
		expect(block(t, PLANES[1])).toEqual({ a: t[1][1], b: t[1][2], d: t[2][2] });
		expect(block(t, PLANES[2])).toEqual({ a: t[2][2], b: t[2][0], d: t[0][0] });
	});

	it('move by at most 0.3 of the radius anywhere on the sliders, so that none folds', () => {
		close(SCALE * LARGEST, 0.3);
		// the largest is at a corner of the box; random tables inside never beat it
		for (let n = 0; n < 2000; n++) {
			const c = Array.from({ length: 5 }, () => LEAST + (MOST - LEAST) * next()) as Coefficients;
			const t = table(c);
			for (const plane of PLANES)
				for (const b of ring(24)) {
					const p = displaced(t, plane, b.x, b.y);
					const r = Math.hypot(p.x, p.y);
					expect(r).toBeGreaterThan(0.7 - 1e-12);
					expect(r).toBeLessThan(1.3 + 1e-12);
				}
		}
		let most = 0;
		for (const c of corners)
			for (const plane of PLANES)
				for (const b of ring(360)) {
					const m = push(table(c), plane, b.x, b.y);
					most = Math.max(most, Math.hypot(m.x, m.y));
				}
		close(most, LARGEST, 4);
	});

	it('draw each ball at (1 − s𝓔)ξ in its plane, and colour it by the sign of ξ · (−𝓔ξ)', () => {
		const t = table(PRESETS.person);
		const [xy, yz, zx] = PLANES;
		// beside a mass along x the balls on x move out, the others in
		const east = displaced(t, xy, 1, 0);
		close(east.x, 1 + 2 * SCALE);
		close(east.y, 0);
		expect(kind(t, xy, 1, 0)).toBe('stretch');
		expect(kind(t, xy, 0, 1)).toBe('squeeze');
		expect(kind(t, yz, Math.SQRT1_2, Math.SQRT1_2)).toBe('squeeze');
		expect(kind(t, zx, 0, 1)).toBe('stretch');
		const cross = table(PRESETS.cross);
		expect(kind(cross, xy, 1, 0)).toBe('still');
		expect(kind(cross, xy, Math.SQRT1_2, Math.SQRT1_2)).toBe('squeeze');
		expect(kind(cross, xy, Math.SQRT1_2, -Math.SQRT1_2)).toBe('stretch');
	});

	it('shrink one at a time at most: a ring that shrinks needs two positive diagonal entries', () => {
		const t = table(PRESETS.person);
		expect(PLANES.map((p) => ringKind(t, p))).toEqual(['mixed', 'shrinks', 'mixed']);
		expect(PLANES.map((p) => ringKind(table([0, 0, 0, 0, 2]), p))).toEqual([
			'grows',
			'mixed',
			'mixed'
		]);
		for (let n = 0; n < 2000; n++) {
			const t = table(randomC(3));
			const shrinking = PLANES.filter((p) => ringKind(t, p) === 'shrinks').length;
			expect(shrinking).toBeLessThanOrEqual(1);
		}
	});
});
