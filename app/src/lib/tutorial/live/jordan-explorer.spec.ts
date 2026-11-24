/**
 * The Jordan explorer's arithmetic (jordan-explorer.ts): every check of chapter 9.2's specification (one mass, two
 * masses, a mass with a wave along its line, the paper's type III table, one wave, the wave moved across the line),
 * the invariance of the eigenvalues and the shape under complex rotations while the singular values change, the
 * chapter's other numbers, the root finder near repeated roots, the plane, the predictions and the words.
 */
import { describe, expect, it } from 'vitest';
import {
	abs,
	cx,
	det,
	div,
	mmul,
	mscale,
	mul,
	sub,
	trace,
	transpose,
	type Complex
} from '../../pixel/complex';
import {
	MASS_MAX,
	OPENING,
	PRESETS,
	STARS,
	TOL,
	TYPE_THREE,
	WAVE_MAX,
	WAVE_X,
	WAVE_Z,
	analyse,
	amounts,
	boost,
	complexText,
	complexTex,
	depressedRoots,
	entryOf,
	extentOf,
	figures,
	gathered,
	invariants,
	lengthOf,
	massAlong,
	niceAbove,
	noteFirst,
	noteSecond,
	observed,
	pathWords,
	presetOf,
	readingOf,
	sceneOf,
	singularValues,
	summaryOf,
	tableOf,
	tideOf,
	turn,
	type CMat3,
	type Scene
} from './jordan-explorer';

const near = (a: Complex, b: Complex, eps = 1e-9) => abs(sub(a, b)) <= eps;
const reals = (ws: Complex[]) => ws.map((w) => w.re);
const maxIm = (ws: Complex[]) => Math.max(...ws.map((w) => Math.abs(w.im)));
const fnormOf = (A: CMat3) => lengthOf(A);

/** A small seeded generator, so that the random rotations are the same at every run. */
function seeded(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 2 ** 32;
	};
}
function randomUnit(rand: () => number): [number, number, number] {
	const z = 2 * rand() - 1;
	const t = 2 * Math.PI * rand();
	const r = Math.sqrt(1 - z * z);
	return [r * Math.cos(t), r * Math.sin(t), z];
}
/** A complex rotation: a turn times a boost, each about a random axis. */
function randomRotation(rand: () => number): CMat3 {
	return mmul(turn(randomUnit(rand), 2 * Math.PI * rand()), boost(randomUnit(rand), 0.2 + rand()));
}

describe('the presets', () => {
	it('every table is symmetric and trace-free', () => {
		for (const p of PRESETS) {
			const W = readingOf(sceneOf(p.key));
			expect(abs(trace(W))).toBeLessThan(1e-15);
			for (let i = 0; i < 3; i++)
				for (let j = 0; j < 3; j++) expect(near(W[i][j], W[j][i], 0)).toBe(true);
		}
		for (const T of [WAVE_Z, WAVE_X, massAlong([1, 0, 0])]) expect(abs(trace(T))).toBe(0);
	});

	it('the waves are the squares of m = (1, i, 0)/√2 and m′ = (0, 1, i)/√2, with square zero', () => {
		const r = Math.SQRT1_2;
		const m = [cx(r), cx(0, r), cx(0)];
		const mx = [cx(0), cx(r), cx(0, r)];
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) {
				const mm = { re: 0, im: 0 };
				const a = m[i];
				const b = m[j];
				mm.re = a.re * b.re - a.im * b.im;
				mm.im = a.re * b.im + a.im * b.re;
				expect(near(WAVE_Z[i][j], mm, 1e-15)).toBe(true);
				const c = mx[i];
				const d = mx[j];
				expect(
					near(WAVE_X[i][j], cx(c.re * d.re - c.im * d.im, c.re * d.im + c.im * d.re), 1e-15)
				).toBe(true);
			}
		expect(fnormOf(mmul(WAVE_Z, WAVE_Z))).toBe(0);
		expect(fnormOf(mmul(WAVE_X, WAVE_X))).toBe(0);
	});

	it('the sliders are in units of the preset’s largest eigenvalue, 1 for the wave and type III', () => {
		expect(presetOf('mass').unit).toBe(2);
		expect(presetOf('mass-wave').unit).toBe(0.25);
		expect(presetOf('wave').unit).toBe(1);
		expect(presetOf('three').unit).toBe(1);
		expect(presetOf('two').unit).toBeCloseTo(0.537, 3);
		// the chapter's weak wave, c₂ = 0.05, is the z slider at its end
		expect(sceneOf('mass-wave').z).toBe(WAVE_MAX);
		expect(amounts(sceneOf('mass-wave')).c2).toBeCloseTo(0.05, 15);
		expect(amounts({ preset: 'mass', z: 0, x: 0, mass: MASS_MAX }).mu).toBe(1);
	});

	it('opens on one mass with every slider at zero', () => {
		expect(OPENING).toEqual({ preset: 'mass', z: 0, x: 0, mass: 0 });
	});
});

describe('the checks of the specification', () => {
	it('one mass: I = 6, J = −6, 1 − 6J²/I³ = 0, type D, singular values 2, 1, 1', () => {
		const a = analyse(readingOf(sceneOf('mass')));
		expect(near(a.I, cx(6))).toBe(true);
		expect(near(a.J, cx(-6))).toBe(true);
		expect(a.ratio).toBeDefined();
		expect(abs(a.ratio!)).toBe(0);
		expect(reals(a.eigenvalues)).toEqual([-2, 1, 1]);
		expect(maxIm(a.eigenvalues)).toBe(0);
		expect(near(a.w!, cx(1), 1e-15)).toBe(true);
		expect(a.productSize).toBeLessThan(1e-15);
		expect(a.shape).toBe('D');
		a.singular.forEach((s, i) => expect(s).toBeCloseTo([2, 1, 1][i], 12));
		expect(a.rank).toBe(3);
		// det 𝒲 = J/3 = −2, the paper's value
		expect(near(det(a.W), cx(-2), 1e-15)).toBe(true);
	});

	it('two masses (Figure stars): eigenvalues −0.537, 0.135, 0.402, I = 0.468, J = −0.0874, 0.553, type I', () => {
		const a = analyse(readingOf(sceneOf('two')));
		[-0.537, 0.135, 0.402].forEach((w, i) => expect(a.eigenvalues[i].re).toBeCloseTo(w, 3));
		expect(maxIm(a.eigenvalues)).toBe(0);
		expect(a.I.re).toBeCloseTo(0.468, 3);
		expect(a.J.re).toBeCloseTo(-0.0874, 4);
		expect(a.ratio!.re).toBeCloseTo(0.553, 3);
		expect(a.ratio!.im).toBe(0);
		expect(a.shape).toBe('I');
		// the footnote: ½I³ − 3J² is the product of the squared differences, 0.0284
		const [w1, w2, w3] = reals(a.eigenvalues);
		const disc = ((w1 - w2) * (w2 - w3) * (w3 - w1)) ** 2;
		expect(disc).toBeCloseTo(0.0284, 4);
		expect(0.5 * a.I.re ** 3 - 3 * a.J.re ** 2).toBeCloseTo(disc, 12);
		// the eigenvalues add to zero and their squares to I
		expect(w1 + w2 + w3).toBeCloseTo(0, 14);
		expect(w1 ** 2 + w2 ** 2 + w3 ** 2).toBeCloseTo(a.I.re, 14);
	});

	it('a mass with a wave along its line: eigenvalues 0.125, 0.125, −0.25 unchanged, product entries 0.0094, type II', () => {
		const a = analyse(readingOf(sceneOf('mass-wave')));
		expect(reals(a.eigenvalues)).toEqual([-0.25, 0.125, 0.125]);
		expect(maxIm(a.eigenvalues)).toBe(0);
		expect(near(a.I, cx(6 * 0.125 ** 2), 1e-15)).toBe(true);
		expect(near(a.J, cx(-6 * 0.125 ** 3), 1e-15)).toBe(true);
		expect(abs(a.ratio!)).toBe(0);
		// (𝒲 − w)(𝒲 + 2w) = 3wc₂ m mᵀ, entries of size 3 × 0.125 × 0.05 / 2 = 0.009375
		const expected = mscale(WAVE_Z, cx(3 * 0.125 * 0.05));
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) expect(near(a.product![i][j], expected[i][j], 1e-15)).toBe(true);
		expect(a.productLargest).toBeCloseTo(0.009375, 15);
		expect(figures(a.productLargest!, 2)).toBe('0.0094');
		expect(a.productSize).toBeGreaterThan(0.1);
		expect(a.shape).toBe('II');
		expect(a.path.map((s) => [s.question, s.yes])).toEqual([
			['repeated', true],
			['zero', false],
			['product', false]
		]);
	});

	it('the paper’s type III: I = J = 0, rank 2, 𝒲² ≠ 0, 𝒲³ = 0, singular values √2, √2, 0', () => {
		const a = analyse(readingOf(sceneOf('three')));
		expect(abs(a.I)).toBe(0);
		expect(abs(a.J)).toBe(0);
		expect(a.ratio).toBeUndefined();
		expect(a.rank).toBe(2);
		expect(a.squareSize).toBeCloseTo(0.5, 15);
		expect(a.cubeSize).toBe(0);
		// 𝒲² = 2 m mᵀ
		const W2 = mmul(TYPE_THREE, TYPE_THREE);
		const twice = mscale(WAVE_Z, cx(2));
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) expect(near(W2[i][j], twice[i][j], 0)).toBe(true);
		a.singular.forEach((s, i) => expect(s).toBeCloseTo([Math.SQRT2, Math.SQRT2, 0][i], 12));
		expect(a.singular[2]).toBe(0);
		expect(a.eigenvalues.every((w) => abs(w) === 0)).toBe(true);
		expect(a.shape).toBe('III');
	});

	it('one wave: rank 1, singular values 2, 0, 0 (|𝒲| = |c₂|), every eigenvalue zero, type N', () => {
		const a = analyse(readingOf(sceneOf('wave')));
		expect(a.rank).toBe(1);
		a.singular.forEach((s, i) => expect(s).toBeCloseTo([2, 0, 0][i], 12));
		expect(a.singular[1]).toBe(0);
		expect(a.length).toBeCloseTo(2, 15);
		expect(a.squareSize).toBe(0);
		expect(a.eigenvalues.every((w) => abs(w) === 0)).toBe(true);
		expect(a.shape).toBe('N');
		expect(a.path.map((s) => s.yes)).toEqual([true, true, true, false]);
	});

	it('the wave moved across the line: eigenvalues −0.274, 0.125, 0.149, 1 − 6J²/I³ = 0.022, type I', () => {
		const s: Scene = { ...sceneOf('mass-wave'), z: 0, x: WAVE_MAX };
		const a = analyse(readingOf(s));
		[-0.274, 0.125, 0.149].forEach((w, i) => expect(a.eigenvalues[i].re).toBeCloseTo(w, 3));
		expect(maxIm(a.eigenvalues)).toBe(0);
		expect(a.ratio!.re).toBeCloseTo(0.022, 3);
		expect(a.shape).toBe('I');
		// I = 6w² + 3wc₂′: the wave across the line enters the traces
		expect(a.I.re).toBeCloseTo(6 * 0.125 ** 2 + 3 * 0.125 * 0.05, 14);
		// the exact roots of the y–z block, (−0.125 ± √0.178125)/2
		expect(a.eigenvalues[0].re).toBeCloseTo((-0.125 - Math.sqrt(0.178125)) / 2, 13);
		expect(a.eigenvalues[2].re).toBeCloseTo((-0.125 + Math.sqrt(0.178125)) / 2, 13);
	});

	it('the shape is fixed by the tree’s order: empty space is type O', () => {
		const a = analyse(tableOf([0, 1, 2].map(() => [0, 0, 0])));
		expect(a.shape).toBe('O');
		expect(a.rank).toBe(0);
		expect(a.ratio).toBeUndefined();
		expect(a.path.map((s) => s.question)).toEqual(['repeated', 'zero', 'square', 'empty']);
	});
});

describe('what an observer can and cannot change', () => {
	it('a random complex rotation keeps the eigenvalues and the shape and changes the singular values', () => {
		const rand = seeded(20261124);
		for (const p of PRESETS) {
			const W = readingOf(sceneOf(p.key));
			const a = analyse(W);
			for (let k = 0; k < 6; k++) {
				const P = randomRotation(rand);
				// P is complex orthogonal: PᵀP = 1
				const PtP = mmul(transpose(P), P);
				for (let i = 0; i < 3; i++)
					for (let j = 0; j < 3; j++)
						expect(near(PtP[i][j], cx(i === j ? 1 : 0), 1e-12)).toBe(true);
				const b = analyse(observed(P, W));
				const big = Math.max(1, ...a.eigenvalues.map(abs));
				a.eigenvalues.forEach((w, i) => expect(near(b.eigenvalues[i], w, 1e-8 * big)).toBe(true));
				expect(near(b.I, a.I, 1e-9 * Math.max(1, abs(a.I)))).toBe(true);
				expect(near(b.J, a.J, 1e-9 * Math.max(1, abs(a.J)))).toBe(true);
				expect(b.shape).toBe(a.shape);
				expect(b.rank).toBe(a.rank);
				// the boost is not unitary, so the singular values change (a wave's may grow or, boosted along its
				// travel, shrink)
				const change = Math.max(...a.singular.map((s, i) => Math.abs(b.singular[i] - s)));
				expect(change).toBeGreaterThan(0.01 * a.singular[0]);
			}
		}
	});

	it('a turn alone keeps the singular values too', () => {
		const rand = seeded(7);
		const W = readingOf(sceneOf('two'));
		const a = analyse(W);
		const b = analyse(observed(turn(randomUnit(rand), 1.1), W));
		a.singular.forEach((s, i) => expect(b.singular[i]).toBeCloseTo(s, 12));
		expect(b.W.flat().every((z) => Math.abs(z.im) < 1e-15)).toBe(true);
	});

	it('the chapter’s pixel at 0.6c across the line: eigenvalues −2, 1, 1, singular values 6.04, 1, 0.331', () => {
		const L = boost([1, 0, 0], Math.log(2));
		const a = analyse(observed(L, readingOf(sceneOf('mass'))));
		expect(a.shape).toBe('D');
		[-2, 1, 1].forEach((w, i) => expect(near(a.eigenvalues[i], cx(w), 1e-12)).toBe(true));
		[6.04, 1, 0.331].forEach((s, i) => expect(a.singular[i]).toBeCloseTo(s, 2));
		// Λ†Λ = Λ²: the boost is Hermitian
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				expect(near(L[i][j], { re: L[j][i].re, im: -L[j][i].im }, 0)).toBe(true);
	});
});

describe('the chapter’s other numbers', () => {
	it('diag(1, 2, −3): I = 14, J = −18, 1 − 6J²/I³ = 0.29', () => {
		const a = analyse(
			tableOf([
				[1, 0, 0],
				[0, 2, 0],
				[0, 0, -3]
			])
		);
		expect(near(a.I, cx(14))).toBe(true);
		expect(near(a.J, cx(-18))).toBe(true);
		expect(a.ratio!.re).toBeCloseTo(1 - (6 * 324) / 2744, 14);
		expect(figures(a.ratio!.re, 2)).toBe('0.29');
		expect(reals(a.eigenvalues).map((w) => Math.round(w * 1e12) / 1e12)).toEqual([-3, 1, 2]);
	});

	it('the spinning body of the eigen-plane: (1, 1, −2)(1 − 0.1i)⁻³ is type D off the real axis', () => {
		const z = cx(1, -0.1);
		const f = div(cx(1), mul(z, mul(z, z)));
		const W = mscale(massAlong([0, 0, 1]), f);
		const a = analyse(W);
		expect(a.shape).toBe('D');
		expect(a.eigenvalues[1].re).toBeCloseTo(0.941, 3);
		expect(a.eigenvalues[1].im).toBeCloseTo(0.29, 2);
		expect(a.eigenvalues[0].re).toBeCloseTo(-1.88, 2);
		expect(a.eigenvalues[0].im).toBeCloseTo(-0.58, 2);
	});

	it('one mass along any n̂ is type D, and two equal masses at right angles are too', () => {
		const rand = seeded(3);
		for (let k = 0; k < 5; k++) expect(analyse(massAlong(randomUnit(rand))).shape).toBe('D');
		// the one-mass preset with a second mass as heavy, on +x̂: diag(−1, 2, −1), symmetric about ŷ
		const a = analyse(readingOf({ preset: 'mass', z: 0, x: 0, mass: MASS_MAX }));
		expect(reals(a.eigenvalues)).toEqual([-1, -1, 2]);
		expect(a.shape).toBe('D');
	});

	it('the tide of the stars pair is the sum of the two masses’ tides', () => {
		const a = tideOf(STARS);
		const b = tideOf([STARS[0]]);
		const c = tideOf([STARS[1]]);
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++) expect(a[i][j].re).toBeCloseTo(b[i][j].re + c[i][j].re, 15);
	});
});

describe('the root finder and the singular values', () => {
	it('finds three roots of a cubic near a double root to the rounding of a simple one', () => {
		for (const eps of [1e-3, 1e-5, 1e-7]) {
			const roots = [1, 1 + eps, -2 - eps];
			const p = roots[0] * roots[1] + roots[1] * roots[2] + roots[2] * roots[0];
			const q = -roots[0] * roots[1] * roots[2];
			const got = depressedRoots(cx(p), cx(q))
				.map((z) => z.re)
				.sort((a, b) => a - b);
			const want = roots.slice().sort((a, b) => a - b);
			// a double root moved by eps is found to about the rounding over eps
			got.forEach((g, i) => expect(Math.abs(g - want[i])).toBeLessThan(1e-14 / eps + 1e-14));
		}
	});

	it('finds complex roots: the three cube roots of J/3 when I = 0', () => {
		const got = depressedRoots(cx(0), cx(-1));
		for (const z of got) {
			const z3 = { re: z.re ** 3 - 3 * z.re * z.im ** 2, im: 3 * z.re ** 2 * z.im - z.im ** 3 };
			expect(near(z3, cx(1), 1e-14)).toBe(true);
		}
	});

	it('a reading with I = 0 and J ≠ 0 has three different eigenvalues, type I', () => {
		// diag(1, ω, ω²) has I = 1 + ω² + ω⁴ = 0 and J = 3
		const w = { re: -0.5, im: Math.sqrt(3) / 2 };
		const W = tableOf(
			[
				[1, 0, 0],
				[0, w.re, 0],
				[0, 0, w.re]
			],
			[
				[0, 0, 0],
				[0, w.im, 0],
				[0, 0, -w.im]
			]
		);
		const a = analyse(W);
		expect(abs(a.I)).toBe(0);
		expect(a.ratio).toBeUndefined();
		expect(a.shape).toBe('I');
		expect(near(a.J, cx(3), 1e-14)).toBe(true);
	});

	it('the singular values are the square roots of the eigenvalues of 𝒲†𝒲, with zeros exact', () => {
		// two waves, along ẑ and x̂: rank two
		const W = readingOf({ preset: 'wave', z: 0, x: 0.2, mass: 0 });
		const s = singularValues(W);
		expect(s[2]).toBeLessThan(1e-14);
		expect(analyse(W).rank).toBe(2);
		// s₁² + s₂² + s₃² = |𝒲|², s₁s₂s₃ = |det 𝒲|
		const rand = seeded(11);
		for (let k = 0; k < 5; k++) {
			const R = randomRotation(rand);
			const V = observed(R, readingOf(sceneOf('two')));
			const t = singularValues(V);
			expect(t[0] ** 2 + t[1] ** 2 + t[2] ** 2).toBeCloseTo(lengthOf(V) ** 2, 10);
			expect(t[0] * t[1] * t[2]).toBeCloseTo(abs(det(V)), 10);
			expect(t[0]).toBeGreaterThanOrEqual(t[1]);
			expect(t[1]).toBeGreaterThanOrEqual(t[2]);
		}
	});

	it('invariants are the traces of the powers', () => {
		const { I, J } = invariants(TYPE_THREE);
		expect(abs(I)).toBe(0);
		expect(abs(J)).toBe(0);
	});
});

describe('the plane of eigenvalues', () => {
	it('chooses nice extents, the preset’s own until an eigenvalue would leave the plane', () => {
		expect(niceAbove(2)).toBe(2);
		expect(niceAbove(0.537)).toBe(1);
		expect(niceAbove(0.25)).toBe(0.25);
		expect(niceAbove(0.3)).toBe(0.5);
		expect(niceAbove(3)).toBe(5);
		const mass = analyse(readingOf(OPENING));
		expect(extentOf(mass.eigenvalues, 2)).toBe(2);
		expect(extentOf([cx(2.5), cx(0), cx(-2.5)], 2)).toBe(2.5);
		expect(extentOf([cx(3), cx(0), cx(-3)], 2)).toBe(5);
		expect(extentOf([cx(0), cx(0), cx(0)], 1)).toBe(1);
	});

	it('gathers equal eigenvalues, so that their dots touch', () => {
		expect(gathered(analyse(readingOf(OPENING)).eigenvalues).map((g) => g.count)).toEqual([1, 2]);
		expect(gathered(analyse(readingOf(sceneOf('wave'))).eigenvalues).map((g) => g.count)).toEqual([
			3
		]);
		expect(gathered(analyse(readingOf(sceneOf('two'))).eigenvalues).map((g) => g.count)).toEqual([
			1, 1, 1
		]);
	});

	it('keeps every slider’s reading on the plane', () => {
		for (const p of PRESETS)
			for (const z of [0, WAVE_MAX])
				for (const x of [0, WAVE_MAX])
					for (const mass of [0, MASS_MAX]) {
						const a = analyse(readingOf({ preset: p.key, z, x, mass }));
						const T = extentOf(a.eigenvalues, p.unit);
						for (const w of a.eigenvalues) {
							expect(Math.abs(w.re)).toBeLessThanOrEqual(1.1 * T);
							expect(Math.abs(w.im)).toBeLessThanOrEqual(0.7 * T);
						}
					}
	});
});

describe('the predictions', () => {
	const mass = sceneOf('mass');
	it('the first is answered once a single mass has a wave along its line, and nothing else', () => {
		expect(noteFirst(false, mass)).toBe(false);
		expect(noteFirst(false, { ...mass, z: 0.01 })).toBe(true);
		expect(noteFirst(false, sceneOf('mass-wave'))).toBe(true);
		expect(noteFirst(false, { ...mass, z: 0.05, x: 0.05 })).toBe(false);
		expect(noteFirst(false, { ...mass, z: 0.05, mass: 0.1 })).toBe(false);
		expect(noteFirst(false, { ...sceneOf('two'), z: 0.05 })).toBe(false);
		expect(noteFirst(false, { ...sceneOf('wave'), z: 0.05 })).toBe(false);
		// once answered, it stays answered
		expect(noteFirst(true, mass)).toBe(true);
	});

	it('the second is answered once the wave is across the line instead', () => {
		expect(noteSecond(false, mass)).toBe(false);
		expect(noteSecond(false, { ...mass, x: 0.01 })).toBe(true);
		expect(noteSecond(false, { ...sceneOf('mass-wave'), z: 0, x: 0.2 })).toBe(true);
		expect(noteSecond(false, { ...sceneOf('mass-wave'), x: 0.2 })).toBe(false);
		expect(noteSecond(false, { ...mass, x: 0.05, mass: 0.1 })).toBe(false);
		expect(noteSecond(false, { ...sceneOf('three'), x: 0.05 })).toBe(false);
		expect(noteSecond(true, mass)).toBe(true);
	});

	it('what each answer says is what the figure then shows', () => {
		const first = analyse(readingOf({ ...mass, z: 0.05 }));
		expect(first.shape).toBe('II');
		expect(reals(first.eigenvalues)).toEqual([-2, 1, 1]);
		const second = analyse(readingOf({ ...mass, x: 0.05 }));
		expect(second.shape).toBe('I');
		expect(new Set(second.eigenvalues.map((w) => w.re.toFixed(6))).size).toBe(3);
	});
});

describe('the words', () => {
	it('writes numbers to three figures, dropping trailing zeros', () => {
		expect(figures(6)).toBe('6');
		expect(figures(-0.27352)).toBe('−0.274');
		expect(figures(0.5527)).toBe('0.553');
		expect(figures(0.009375)).toMatch(/^0\.0093[78]$/);
		expect(figures(1.5e-5)).toBe('1.5 × 10⁻⁵');
		expect(figures(0)).toBe('0');
	});

	it('writes complex numbers as text and TeX', () => {
		expect(complexText(cx(0))).toBe('0');
		expect(complexText(cx(-2))).toBe('−2');
		expect(complexText(cx(0, 0.5))).toBe('0.5i');
		expect(complexText(cx(0, -1))).toBe('−i');
		expect(complexText(cx(0.9411, -0.2903))).toBe('0.941 − 0.29i');
		expect(complexTex(cx(-0.9411, 0.2903))).toBe('-0.941 + 0.29i');
		expect(complexTex(cx(2e-5, 1))).toBe('2\\times10^{-5} + i');
	});

	it('writes the grid’s entries, zero below the tolerance of |𝒲|', () => {
		expect(entryOf(cx(0.5, 0.5), 2)).toEqual({
			re: '0.5',
			im: '+0.5i',
			reZero: false,
			imZero: false
		});
		expect(entryOf(cx(1e-17, -1), 2)).toEqual({ re: '0', im: '−i', reZero: true, imZero: false });
		expect(entryOf(cx(-2, TOL / 10), 2).imZero).toBe(true);
	});

	it('says the whole reading in one sentence', () => {
		const a = analyse(readingOf(sceneOf('mass-wave')));
		expect(summaryOf(a)).toContain('Type II');
		expect(summaryOf(a)).toContain('−0.25, 0.125, 0.125');
		expect(pathWords(a.path)).toBe(
			'I cubed equals 6 J squared? yes; I and J are zero? no; (𝒲 − w)(𝒲 + 2w) is zero, with w = −J/I? no'
		);
		expect(summaryOf(analyse(readingOf(sceneOf('wave'))))).toContain('undefined');
	});
});
