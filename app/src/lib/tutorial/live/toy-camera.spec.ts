/** Chapter 3.4's camera of three pixels: its design matrix, its decomposition, and the two laws as δ → 0. */
import { describe, expect, it } from 'vitest';
import {
	CLOSEST,
	CROWDED,
	FARTHEST,
	LOUDEST,
	NOISES,
	OPENING,
	QUIETEST,
	SPACINGS,
	TABLE,
	apply,
	curvature,
	decompose,
	design,
	dot,
	eigen,
	gainText,
	gram,
	kernel,
	orient,
	secondLaw,
	singular,
	slope,
	snap,
	spacingText,
	stepRung,
	thirdLaw,
	type Matrix,
	type Three
} from './toy-camera';

const close = (a: number, b: number, digits = 12) =>
	expect(Math.abs(a - b)).toBeLessThan(10 ** -digits * Math.max(1, Math.abs(b)));

/** A spread of spacings across the slider, and a few far closer. */
const spacings = [...SPACINGS, 0.03, 0.01, 0.003, 0.001];

describe('the kernel and the design matrix', () => {
	it('gives 2 G/z³ straight below, zero at √2 z, and is even', () => {
		close(kernel(0), 2);
		close(kernel(Math.SQRT2), 0);
		close(kernel(0.7), kernel(-0.7));
		close(kernel(1), 1 / 2 ** 2.5);
	});

	it('has the slope and curvature of the kernel', () => {
		for (const a of [-1.3, -1, -0.4, 0, 0.25, 1, 2]) {
			const h = 1e-4;
			close(slope(a), (kernel(a + h) - kernel(a - h)) / (2 * h), 7);
			close(curvature(a), (kernel(a + h) - 2 * kernel(a) + kernel(a - h)) / (h * h), 5);
		}
	});

	it('puts g_z(x_a − x′_b) in row a, column b', () => {
		const a = design(0.25);
		close(a[1][1], 2);
		close(a[0][0], kernel(-1 + 0.25));
		close(a[0][2], kernel(-1 - 0.25));
		close(a[2][0], kernel(1 + 0.25));
		// the mirror of the row maps the camera onto itself
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) close(a[i][j], a[2 - i][2 - j]);
	});
});

describe('the eigenproblem by Jacobi rotations', () => {
	it('decomposes a symmetric matrix into perpendicular axes', () => {
		const t: Matrix = [
			[4, 1, -2],
			[1, 2, 0.5],
			[-2, 0.5, -3]
		];
		const { values, vectors } = eigen(t);
		expect(values[0]).toBeGreaterThanOrEqual(values[1]);
		expect(values[1]).toBeGreaterThanOrEqual(values[2]);
		close(values[0] + values[1] + values[2], 3);
		for (let i = 0; i < 3; i++) {
			const tv = apply(t, vectors[i]);
			for (let k = 0; k < 3; k++) close(tv[k], values[i] * vectors[i][k], 12);
			for (let j = 0; j < 3; j++) close(dot(vectors[i], vectors[j]), i === j ? 1 : 0, 13);
		}
	});

	it('handles a matrix already diagonal, and repeated eigenvalues', () => {
		const { values } = eigen([
			[1, 0, 0],
			[0, 3, 0],
			[0, 0, 1]
		]);
		expect(values).toEqual([3, 1, 1]);
	});

	it('orients a pattern so its largest entry is positive, the last of a tie deciding', () => {
		expect(orient([-0.2, -0.9, 0.3])).toEqual([0.2, 0.9, -0.3]);
		const r = Math.SQRT1_2;
		expect(orient([r, 0, -r])).toEqual([-r, 0, r]);
		expect(orient([-r, 0, r])).toEqual([-r, 0, r]);
		expect(Object.is(orient([-1, 0, 0])[1], -0)).toBe(false);
	});
});

describe('the decomposition by one-sided Jacobi rotations', () => {
	it('decomposes any matrix, even one with a zero gain', () => {
		const cases: Matrix[] = [
			[
				[1, 2, -1],
				[0.5, -3, 2],
				[4, 0, 1]
			],
			[
				[1, 2, 3],
				[2, 4, 6],
				[0, 1, -1]
			]
		];
		for (const m of cases) {
			const { s, u, v } = singular(m);
			expect(s[0]).toBeGreaterThanOrEqual(s[1]);
			expect(s[1]).toBeGreaterThanOrEqual(s[2]);
			for (let r = 0; r < 3; r++)
				for (let c = 0; c < 3; c++)
					close(
						s[0] * u[0][r] * v[0][c] + s[1] * u[1][r] * v[1][c] + s[2] * u[2][r] * v[2][c],
						m[r][c],
						13
					);
			for (let i = 0; i < 3; i++)
				for (let j = 0; j < 3; j++) close(dot(v[i], v[j]), i === j ? 1 : 0, 13);
		}
		// the second has rank two: its third gain is zero
		close(singular(cases[1]).s[2], 0, 13);
	});
});

describe('the decomposition of the camera', () => {
	it('reproduces the chapter’s table to the printed digits', () => {
		const table: [number, string[]][] = [
			[1, ['2.23', '2.04', '1.73']],
			[0.5, ['2.58', '1.01', '0.63']],
			[0.25, ['3.14', '0.43', '0.14']],
			[0.1, ['3.43', '0.16', '0.021']]
		];
		for (const [delta, printed] of table)
			expect(decompose(delta).map((p) => gainText(p.s))).toEqual(printed);
		expect(TABLE).toEqual(table.map(([d]) => d));
	});

	it('gives orthonormal scene and reading patterns, and A v = s u', () => {
		for (const delta of spacings) {
			const a = design(delta);
			const ps = decompose(delta);
			for (let i = 0; i < 3; i++) {
				const av = apply(a, ps[i].v);
				for (let k = 0; k < 3; k++) {
					close(av[k], ps[i].s * ps[i].u[k], 13);
					close(ps[i].readings[k], av[k], 14);
				}
				for (let j = 0; j < 3; j++) {
					close(dot(ps[i].v, ps[j].v), i === j ? 1 : 0, 13);
					close(dot(ps[i].u, ps[j].u), i === j ? 1 : 0, 12);
				}
			}
			expect(ps[0].s).toBeGreaterThan(ps[1].s);
			expect(ps[1].s).toBeGreaterThan(ps[2].s);
		}
	});

	it('rebuilds A from its three terms', () => {
		for (const delta of [1, 0.37, 0.05]) {
			const a = design(delta);
			const ps = decompose(delta);
			for (let r = 0; r < 3; r++)
				for (let c = 0; c < 3; c++)
					close(
						ps.reduce((sum, p) => sum + p.s * p.u[r] * p.v[c], 0),
						a[r][c],
						13
					);
		}
	});

	it('gives the squared gains as the eigenvalues of AᵀA, adding to the sum of the squared entries', () => {
		for (const delta of [1, 0.25, 0.05]) {
			const a = design(delta);
			const sum = a.flat().reduce((t, x) => t + x * x, 0);
			const { values } = eigen(gram(a));
			const ps = decompose(delta);
			close(
				ps.reduce((t, p) => t + p.s * p.s, 0),
				sum,
				12
			);
			for (let i = 0; i < 3; i++) close(ps[i].s * ps[i].s, values[i], 10);
		}
	});

	it('has the patterns the chapter describes', () => {
		for (const delta of spacings) {
			const [first, second, third] = decompose(delta);
			// one sign in all three places, close to a uniform row
			for (const x of first.v) expect(x).toBeGreaterThan(0.4);
			// mass moved from one side to the other: (−1, 0, 1)/√2
			close(second.v[0], -Math.SQRT1_2, 12);
			close(second.v[1], 0, 12);
			close(second.v[2], Math.SQRT1_2, 12);
			// the middle against the two sides, the middle positive
			expect(third.v[1]).toBeGreaterThan(0.55);
			expect(third.v[0]).toBeLessThan(0);
			close(third.v[0], third.v[2], 11);
		}
	});

	it('never flips a pattern as δ moves along the slider', () => {
		const ladder = [...SPACINGS].reverse();
		for (let k = 1; k < ladder.length; k++) {
			const before = decompose(ladder[k - 1]);
			const after = decompose(ladder[k]);
			for (let i = 0; i < 3; i++) {
				expect(dot(before[i].v, after[i].v)).toBeGreaterThan(0.99);
				expect(dot(before[i].u, after[i].u)).toBeGreaterThan(0.99);
			}
		}
	});
});

describe('the gains as the masses crowd together', () => {
	it('lets the second gain fall as δ, at 2|g′(z)|', () => {
		close(secondLaw(), 1.590990257669732, 12);
		for (const delta of [1e-2, 1e-3, 1e-4])
			close(decompose(delta)[1].s / delta, secondLaw(), 2 * -Math.log10(delta) - 1);
	});

	it('lets the third gain fall as δ², at |w⊥|/√6', () => {
		close(thirdLaw(), 2.0508, 4);
		for (const delta of [1e-2, 1e-3, 1e-4]) {
			const ratio = decompose(delta)[2].s / delta ** 2;
			expect(Math.abs(ratio - thirdLaw()) / thirdLaw()).toBeLessThan(delta);
		}
		// halving δ quarters the third gain, and halves the second
		const [a, b] = [decompose(0.02), decompose(0.01)];
		expect(a[2].s / b[2].s).toBeCloseTo(4, 2);
		expect(a[1].s / b[1].s).toBeCloseTo(2, 2);
	});

	it('lets the first gain grow to √3 |c|, three kilograms on one spot', () => {
		const c = [kernel(-1), kernel(0), kernel(1)] as Three;
		close(decompose(1e-4)[0].s, Math.sqrt(3) * Math.hypot(...c), 7);
	});

	it('makes the third the fastest to fall between every two rows of the table', () => {
		for (let k = 1; k < TABLE.length; k++) {
			const [p, q] = [decompose(TABLE[k - 1]), decompose(TABLE[k])];
			const fall = p.map((x, i) => x.s / q[i].s);
			expect(fall[2]).toBeGreaterThan(fall[1]);
			expect(fall[1]).toBeGreaterThan(fall[0]);
		}
	});
});

describe('the sliders and the printed numbers', () => {
	it('stops at two significant figures from end to end', () => {
		expect(SPACINGS[0]).toBe(CLOSEST);
		expect(SPACINGS.at(-1)).toBe(FARTHEST);
		expect(SPACINGS).toContain(0.25);
		expect(SPACINGS).toContain(0.1);
		expect(SPACINGS).toContain(0.5);
		expect(NOISES[0]).toBe(QUIETEST);
		expect(NOISES.at(-1)).toBe(LOUDEST);
		expect(NOISES).toContain(OPENING.noise);
		for (const ladder of [SPACINGS, NOISES])
			for (let k = 1; k < ladder.length; k++) expect(ladder[k]).toBeGreaterThan(ladder[k - 1]);
		expect(SPACINGS.length).toBe(50 + 90 + 1);
	});

	it('snaps and steps', () => {
		expect(snap(0.2468, CLOSEST, FARTHEST)).toBe(0.25);
		expect(snap(0.01, CLOSEST, FARTHEST)).toBe(CLOSEST);
		expect(snap(3, CLOSEST, FARTHEST)).toBe(FARTHEST);
		expect(stepRung(SPACINGS, 0.25, -1)).toBe(0.24);
		expect(stepRung(SPACINGS, 0.1, -1)).toBe(0.099);
		expect(stepRung(SPACINGS, 0.99, 5)).toBe(1);
		expect(stepRung(SPACINGS, 0.05, -1)).toBe(0.05);
		expect(CROWDED).toBe(0.25);
	});

	it('prints gains and spacings as the chapter does', () => {
		expect(gainText(2.2328)).toBe('2.23');
		expect(gainText(0.6294)).toBe('0.63');
		expect(gainText(0.1391)).toBe('0.14');
		expect(gainText(0.02081)).toBe('0.021');
		expect(gainText(0.005149)).toBe('0.0051');
		expect(spacingText(1)).toBe('1');
		expect(spacingText(0.5)).toBe('0.5');
		expect(spacingText(0.25)).toBe('0.25');
		expect(spacingText(0.05)).toBe('0.05');
		expect(spacingText(0.099)).toBe('0.099');
	});
});
