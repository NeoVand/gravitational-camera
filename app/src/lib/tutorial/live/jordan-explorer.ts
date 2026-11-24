/**
 * Chapter 9.2's Jordan explorer: a trace-free complex symmetric 3 × 3 reading 𝒲, its eigenvalues, its two invariants
 * I = tr 𝒲² and J = tr 𝒲³, the number 1 − 6J²/I³, its singular values and rank, and the shape the chapter's tree sorts
 * it into: I, D, II, III, N or O, asked in the chapter's order (I³ = 6J²? then I = J = 0? then (𝒲 − w)(𝒲 + 2w) = 0
 * with w = −J/I, or 𝒲² = 0, then 𝒲 = 0).
 *
 * The reading is a preset's table plus three additions, each a slider's value times the preset's unit, the size of its
 * largest eigenvalue (1 for the presets whose eigenvalues all vanish): a wave along ẑ, c₂ m mᵀ with m = (1, i, 0)/√2;
 * a wave along x̂, c₂′ m′m′ᵀ with m′ = (0, 1, i)/√2; and a second mass on +x̂ at unit distance, μ(1 − 3x̂x̂ᵀ).
 *
 * Every decision is made on the reading divided by its length |𝒲| = √⟨𝒲|𝒲⟩, ⟨T|U⟩ = tr(T†U), so that the tolerances are
 * pure numbers: a quantity of degree k in 𝒲 counts as zero when it is below TOL·|𝒲|^k. Where the tree finds a
 * repeated eigenvalue the eigenvalues are given as w, w, −2w with w = −J/I exactly (or all zero), since a root finder
 * splits a double root by about the square root of the rounding; elsewhere they are the roots of the cubic
 * λ³ − ½Iλ − ⅓J, by Cardano's formula polished by Newton's steps. The singular values are the square roots of the
 * eigenvalues of the Hermitian 𝒲†𝒲: the largest by Jacobi's rotations, the other two from the cubic's coefficients
 * tr 𝒲†𝒲 = |𝒲|², the sum of the squared sizes of 𝒲's 2 × 2 minors (Cauchy–Binet) and |det 𝒲|², each computed from 𝒲
 * itself, so that a zero singular value comes out zero rather than the square root of a rounding.
 *
 * Everything here is a pure function of plain numbers; the component only draws it.
 */
import {
	abs,
	add,
	adjoint,
	ccbrt,
	cmat,
	csqrt,
	cx,
	det,
	div,
	fnorm,
	hermitianEigen,
	identity,
	madd,
	mmul,
	mscale,
	mul,
	scale,
	sub,
	trace,
	transpose,
	ZERO,
	type CMat3,
	type Complex,
	type Vec3
} from '../../pixel/complex';

export type { CMat3, Complex };

/** A quantity of degree k in 𝒲 below TOL·|𝒲|^k counts as zero. */
export const TOL = 1e-9;

// --- tables -------------------------------------------------------------------------------------------------------------

/** A table from real and imaginary rows. */
export const tableOf = (re: number[][], im?: number[][]): CMat3 =>
	cmat((i, j) => cx(re[i][j], im ? im[i][j] : 0));

/** m mᵀ with m = (1, i, 0)/√2, written exactly: ½ rows (1, i, 0), (i, −1, 0), (0, 0, 0). */
export const WAVE_Z: CMat3 = tableOf(
	[
		[0.5, 0, 0],
		[0, -0.5, 0],
		[0, 0, 0]
	],
	[
		[0, 0.5, 0],
		[0.5, 0, 0],
		[0, 0, 0]
	]
);

/** m′m′ᵀ with m′ = (0, 1, i)/√2, the same wave travelling along x̂. */
export const WAVE_X: CMat3 = tableOf(
	[
		[0, 0, 0],
		[0, 0.5, 0],
		[0, 0, -0.5]
	],
	[
		[0, 0, 0],
		[0, 0, 0.5],
		[0, 0.5, 0]
	]
);

/** The tide of a mass with GM/r³ = 1 along the unit direction n: 1 − 3 n nᵀ. */
export const massAlong = (n: Vec3): CMat3 =>
	cmat((i, j) => cx((i === j ? 1 : 0) - 3 * (n[i] * n[j])));

/** The tide at the origin of point masses (G = 1) at the given places: Σ (M/r³)(1 − 3 n̂n̂ᵀ). */
export function tideOf(masses: { mass: number; at: Vec3 }[]): CMat3 {
	let W = cmat(() => ZERO);
	for (const { mass, at } of masses) {
		const r = Math.hypot(...at);
		const n = at.map((x) => x / r) as Vec3;
		W = madd(W, mscale(massAlong(n), cx(mass / r ** 3)));
	}
	return W;
}

// --- the presets ----------------------------------------------------------------------------------------------------------

export type PresetKey = 'mass' | 'two' | 'wave' | 'mass-wave' | 'three';

export interface Preset {
	key: PresetKey;
	label: string;
	/** The table without the sliders' additions. */
	base: CMat3;
	/** The sliders' unit: the size of the largest eigenvalue with the preset's own sliders, or 1 if all vanish. */
	unit: number;
	/** The sliders' values as the preset opens. */
	opening: Sliders;
	/** Whether the table is a single mass and nothing else, the scene of the two predictions. */
	single: boolean;
}

/** The three sliders, each in units of the preset's unit. */
export interface Sliders {
	/** A wave along ẑ, 0 to 0.2. */
	z: number;
	/** A wave along x̂, 0 to 0.2. */
	x: number;
	/** A second mass on +x̂ at unit distance, 0 to 0.5. */
	mass: number;
}

export const WAVE_MAX = 0.2;
export const MASS_MAX = 0.5;
export const SLIDER_STEP = 0.01;

const NONE: Sliders = { z: 0, x: 0, mass: 0 };

/** The paper's Figure stars: masses 1 and 0.45 at (−1.5, 0.3, 0) and (0.9, 1.1, 0.6), in the figure's units. */
export const STARS = [
	{ mass: 1, at: [-1.5, 0.3, 0] as Vec3 },
	{ mass: 0.45, at: [0.9, 1.1, 0.6] as Vec3 }
];

/** The paper's type III table, rows (0, 0, 1), (0, 0, i), (1, i, 0). */
export const TYPE_THREE: CMat3 = tableOf(
	[
		[0, 0, 1],
		[0, 0, 0],
		[1, 0, 0]
	],
	[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 0]
	]
);

const ONE_MASS = massAlong([0, 0, 1]);

export const PRESETS: Preset[] = [
	{ key: 'mass', label: 'One mass', base: ONE_MASS, unit: 2, opening: NONE, single: true },
	{
		key: 'two',
		label: 'Two masses',
		base: tideOf(STARS),
		unit: 0, // filled in below, from the eigenvalues
		opening: NONE,
		single: false
	},
	{
		key: 'wave',
		label: 'One wave',
		base: mscale(WAVE_Z, cx(2)),
		unit: 1,
		opening: NONE,
		single: false
	},
	{
		key: 'mass-wave',
		label: 'Mass + wave along its line',
		base: mscale(ONE_MASS, cx(0.125)),
		unit: 0.25,
		// c₂ = 0.2 × 0.25 = 0.05, the chapter's weak wave
		opening: { z: 0.2, x: 0, mass: 0 },
		single: true
	},
	{
		key: 'three',
		label: 'The paper’s type III',
		base: TYPE_THREE,
		unit: 1,
		opening: NONE,
		single: false
	}
];

export const presetOf = (key: PresetKey): Preset =>
	PRESETS.find((p) => p.key === key) ?? PRESETS[0];

/** A scene: a preset and its three sliders. */
export interface Scene extends Sliders {
	preset: PresetKey;
}

export const OPENING: Scene = { preset: 'mass', ...NONE };

/** A preset as it opens. */
export const sceneOf = (key: PresetKey): Scene => ({ preset: key, ...presetOf(key).opening });

/** The reading of a scene. */
export function readingOf(s: Scene): CMat3 {
	const p = presetOf(s.preset);
	const u = p.unit;
	let W = p.base;
	if (s.z) W = madd(W, mscale(WAVE_Z, cx(s.z * u)));
	if (s.x) W = madd(W, mscale(WAVE_X, cx(s.x * u)));
	if (s.mass) W = madd(W, mscale(massAlong([1, 0, 0]), cx(s.mass * u)));
	return W;
}

/** The sliders' values in the reading's own units: c₂, c₂′ and the second mass's GM/r³. */
export function amounts(s: Scene): { c2: number; c2x: number; mu: number } {
	const u = presetOf(s.preset).unit;
	return { c2: s.z * u, c2x: s.x * u, mu: s.mass * u };
}

// --- the arithmetic -----------------------------------------------------------------------------------------------------

/** |𝒲| = √⟨𝒲|𝒲⟩, ⟨T|U⟩ = tr(T†U). */
export const lengthOf = (W: CMat3) => fnorm(W);

/** I = tr 𝒲² and J = tr 𝒲³. */
export function invariants(W: CMat3): { I: Complex; J: Complex } {
	const W2 = mmul(W, W);
	return { I: trace(W2), J: trace(mmul(W2, W)) };
}

/** 𝒲 plus a number times the identity. */
export const shift = (W: CMat3, s: Complex): CMat3 => madd(W, mscale(identity(), s));

/**
 * The three roots of λ³ + pλ + q by Cardano's formula, taking the larger of the two cube roots' arguments so that
 * nothing cancels, each polished by Newton's steps on the cubic while they make its value smaller.
 */
export function depressedRoots(p: Complex, q: Complex): Complex[] {
	if (abs(p) === 0 && abs(q) === 0) return [ZERO, ZERO, ZERO];
	const halfQ = scale(q, 0.5);
	const s = csqrt(add(mul(halfQ, halfQ), scale(mul(p, mul(p, p)), 1 / 27)));
	const a = sub(s, halfQ);
	const b = scale(add(s, halfQ), -1);
	const t = abs(a) >= abs(b) ? a : b;
	const u = ccbrt(t);
	const v = abs(u) === 0 ? ZERO : div(scale(p, -1 / 3), u);
	const w1 = cx(-0.5, Math.sqrt(3) / 2);
	const w2 = cx(-0.5, -Math.sqrt(3) / 2);
	const f = (x: Complex) => add(add(mul(x, mul(x, x)), mul(p, x)), q);
	const df = (x: Complex) => add(scale(mul(x, x), 3), p);
	return [add(u, v), add(mul(w1, u), mul(w2, v)), add(mul(w2, u), mul(w1, v))].map((x0) => {
		let x = x0;
		for (let k = 0; k < 4; k++) {
			const d = df(x);
			if (abs(d) === 0) break;
			const next = sub(x, div(f(x), d));
			if (!(abs(f(next)) < abs(f(x)))) break;
			x = next;
		}
		return x;
	});
}

/** Eigenvalues in order of their real parts, then their imaginary parts. */
const ordered = (ws: Complex[]) =>
	ws.slice().sort((a, b) => (Math.abs(a.re - b.re) > 1e-12 ? a.re - b.re : a.im - b.im));

const tidyPart = (x: number, floor: number) => (Math.abs(x) <= floor ? 0 : x);
const tidy = (z: Complex, floor: number) => cx(tidyPart(z.re, floor), tidyPart(z.im, floor));

/** The questions of the chapter's tree, in its order. */
export type Question = 'repeated' | 'zero' | 'product' | 'square' | 'empty';
export type Shape = 'I' | 'D' | 'II' | 'III' | 'N' | 'O';

export interface Step {
	question: Question;
	yes: boolean;
}

export interface Analysis {
	W: CMat3;
	/** |𝒲|. */
	length: number;
	I: Complex;
	J: Complex;
	/** 1 − 6J²/I³, undefined when |I| < TOL·|𝒲|². */
	ratio: Complex | undefined;
	/** The three eigenvalues, ordered; equal ones exactly equal. */
	eigenvalues: Complex[];
	/** Whether I³ = 6J² (to TOL), the first question. */
	repeated: boolean;
	/** Whether I = J = 0 (to TOL). */
	zero: boolean;
	/** w = −J/I, when I is not zero: the repeated eigenvalue, when there is one. */
	w: Complex | undefined;
	/** (𝒲 − w)(𝒲 + 2w), when w is defined (asked by the tree only when an eigenvalue repeats). */
	product: CMat3 | undefined;
	/** |(𝒲 − w)(𝒲 + 2w)|/|𝒲|², |𝒲²|/|𝒲|² and |𝒲³|/|𝒲|³ (zero for no reading). */
	productSize: number | undefined;
	squareSize: number;
	cubeSize: number;
	/** The largest entry of the product, in size. */
	productLargest: number | undefined;
	/** s₁ ≥ s₂ ≥ s₃. */
	singular: number[];
	rank: number;
	shape: Shape;
	/** The questions asked on the way to the shape, with their answers. */
	path: Step[];
}

/** The eigenvalues alone, by the same rules as `analyse`. */
export function eigenvaluesOf(W: CMat3): Complex[] {
	return analyse(W).eigenvalues;
}

/**
 * The singular values s₁ ≥ s₂ ≥ s₃, the square roots of the eigenvalues of 𝒲†𝒲: the largest by Jacobi's rotations on
 * the Hermitian table, the other two from the sum and product of the remaining eigenvalues, read off the cubic's
 * coefficients computed from 𝒲 itself.
 */
export function singularValues(W: CMat3): number[] {
	const L2 = lengthOf(W) ** 2;
	if (!(L2 > 0)) return [0, 0, 0];
	const H = mmul(adjoint(W), W);
	const top = Math.max(...hermitianEigen(H).values);
	// the sum of the squared sizes of the nine 2 × 2 minors of 𝒲, the second coefficient of 𝒲†𝒲's cubic
	let e2 = 0;
	for (const [r1, r2] of [
		[0, 1],
		[0, 2],
		[1, 2]
	])
		for (const [c1, c2] of [
			[0, 1],
			[0, 2],
			[1, 2]
		]) {
			const m = sub(mul(W[r1][c1], W[r2][c2]), mul(W[r1][c2], W[r2][c1]));
			e2 += m.re * m.re + m.im * m.im;
		}
	const e3 = abs(det(W)) ** 2;
	const l1 = Math.max(top, 0);
	if (!(l1 > 0)) return [0, 0, 0];
	const sum = Math.max(0, (e2 - e3 / l1) / l1);
	// the two remaining eigenvalues are real: a product beyond their sum's square is rounding (of det 𝒲 against minors
	// that vanish), and is cut back to it
	const product = Math.min(e3 / l1, (sum * sum) / 4);
	const root = Math.sqrt(Math.max(0, sum * sum - 4 * product));
	const l2 = (sum + root) / 2;
	const l3 = l2 > 0 ? product / l2 : 0;
	return [l1, l2, l3].map((x) => Math.sqrt(Math.max(0, x))).sort((a, b) => b - a);
}

/** The rank: the number of singular values above TOL of the largest. */
export function rankOf(singular: number[]): number {
	if (!(singular[0] > 0)) return 0;
	return singular.filter((s) => s > TOL * singular[0]).length;
}

/** The whole reading of a table: invariants, eigenvalues, singular values, the tests and the shape. */
export function analyse(W: CMat3): Analysis {
	const L = lengthOf(W);
	const { I, J } = invariants(W);
	const W2 = mmul(W, W);
	const W3 = mmul(W2, W);
	const singular = singularValues(W);
	const rank = rankOf(singular);
	if (!(L > 0)) {
		return {
			W,
			length: 0,
			I: ZERO,
			J: ZERO,
			ratio: undefined,
			eigenvalues: [ZERO, ZERO, ZERO],
			repeated: true,
			zero: true,
			w: undefined,
			product: undefined,
			productSize: undefined,
			productLargest: undefined,
			squareSize: 0,
			cubeSize: 0,
			singular: [0, 0, 0],
			rank: 0,
			shape: 'O',
			path: [
				{ question: 'repeated', yes: true },
				{ question: 'zero', yes: true },
				{ question: 'square', yes: true },
				{ question: 'empty', yes: true }
			]
		};
	}
	const Ih = scale(I, 1 / L ** 2);
	const Jh = scale(J, 1 / L ** 3);
	const I3 = mul(Ih, mul(Ih, Ih));
	const sixJ2 = scale(mul(Jh, Jh), 6);
	const defined = abs(Ih) >= TOL;
	const ratio = defined ? tidy(sub(cx(1), div(sixJ2, I3)), TOL) : undefined;
	const zero = abs(Ih) <= TOL && abs(Jh) <= TOL;
	const repeated = zero || (ratio !== undefined && abs(ratio) <= TOL);
	const squareSize = fnorm(W2) / L ** 2;
	const cubeSize = fnorm(W3) / L ** 3;

	// w = −J/I, and the product of the test for a diagonal form, wherever I is not zero
	const wExact = defined ? div(scale(J, -1), I) : undefined;
	let product: CMat3 | undefined;
	let productSize: number | undefined;
	let productLargest: number | undefined;
	if (wExact) {
		product = mmul(shift(W, scale(wExact, -1)), shift(W, scale(wExact, 2)));
		productSize = fnorm(product) / L ** 2;
		productLargest = Math.max(...product.flat().map(abs));
	}
	const w = wExact && tidy(wExact, TOL * L);

	let eigenvalues: Complex[];
	if (zero) eigenvalues = [ZERO, ZERO, ZERO];
	else if (repeated && wExact) eigenvalues = [wExact, wExact, scale(wExact, -2)];
	else eigenvalues = depressedRoots(scale(Ih, -0.5), scale(Jh, -1 / 3)).map((x) => scale(x, L));
	eigenvalues = ordered(eigenvalues.map((x) => tidy(x, TOL * L)));

	const path: Step[] = [{ question: 'repeated', yes: repeated }];
	let shape: Shape;
	if (!repeated) shape = 'I';
	else {
		path.push({ question: 'zero', yes: zero });
		if (!zero && productSize !== undefined) {
			const vanishes = productSize <= TOL;
			path.push({ question: 'product', yes: vanishes });
			shape = vanishes ? 'D' : 'II';
		} else {
			const vanishes = squareSize <= TOL;
			path.push({ question: 'square', yes: vanishes });
			if (!vanishes) shape = 'III';
			else {
				path.push({ question: 'empty', yes: false });
				shape = 'N';
			}
		}
	}
	return {
		W,
		length: L,
		I: tidy(I, TOL * L ** 2),
		J: tidy(J, TOL * L ** 3),
		ratio,
		eigenvalues,
		repeated,
		zero,
		w,
		product,
		productSize,
		productLargest,
		squareSize,
		cubeSize,
		singular,
		rank,
		shape,
		path
	};
}

// --- complex rotations, for the checks ------------------------------------------------------------------------------------

/** The cross-product table [n]×, with [n]× v = n × v. */
const crossTable = (n: Vec3): number[][] => [
	[0, -n[2], n[1]],
	[n[2], 0, -n[0]],
	[-n[1], n[0], 0]
];

/** A turn by the angle θ (radians) about the unit axis n, by Rodrigues's formula. */
export function turn(n: Vec3, theta: number): CMat3 {
	const A = crossTable(n);
	const A2 = A.map((r, i) => r.map((_, j) => A[i].reduce((s, a, k) => s + a * A[k][j], 0)));
	return cmat((i, j) =>
		cx((i === j ? 1 : 0) + Math.sin(theta) * A[i][j] + (1 - Math.cos(theta)) * A2[i][j])
	);
}

/**
 * A boost of rapidity η along the unit vector n, the turn by the imaginary angle iη: 1 + i sinh η [n]× +
 * (1 − cosh η)[n]×², complex orthogonal and Hermitian (the sign of the turn's sense follows chapter 6.6's up to the
 * direction, which no check here depends on).
 */
export function boost(n: Vec3, eta: number): CMat3 {
	const A = crossTable(n);
	const A2 = A.map((r, i) => r.map((_, j) => A[i].reduce((s, a, k) => s + a * A[k][j], 0)));
	return cmat((i, j) =>
		cx((i === j ? 1 : 0) + (1 - Math.cosh(eta)) * A2[i][j], Math.sinh(eta) * A[i][j])
	);
}

/** The reading of an observer turned or moving, P𝒲Pᵀ. */
export const observed = (P: CMat3, W: CMat3): CMat3 => mmul(mmul(P, W), transpose(P));

// --- the plane of eigenvalues -------------------------------------------------------------------------------------------

/** Nice extents for the plane's ticks: 1, 2, 2.5 and 5 times a power of ten. */
export function niceAbove(x: number): number {
	if (!(x > 0)) return 1;
	const k = Math.floor(Math.log10(x));
	for (const e of [k, k + 1])
		for (const n of [1, 2, 2.5, 5]) {
			const v = n * 10 ** e;
			if (v >= x * (1 - 1e-12)) return v;
		}
	return 10 ** (k + 1);
}

/**
 * The plane's extent T: ticks at multiples of T/2 across, the real axis drawn to 1.2T and the imaginary to 0.8T. It is
 * the preset's own unless an eigenvalue would leave the plane, so that it stays still while a slider moves.
 */
export function extentOf(eigenvalues: Complex[], unit: number): number {
	const needed = Math.max(
		...eigenvalues.map((w) => Math.max(Math.abs(w.re) / 1.1, Math.abs(w.im) / 0.7))
	);
	return Math.max(niceAbove(unit), niceAbove(needed));
}

/** The eigenvalues gathered where they coincide (to TOL of the largest), each place with how many sit there. */
export function gathered(eigenvalues: Complex[]): { at: Complex; count: number }[] {
	const big = Math.max(...eigenvalues.map(abs));
	const out: { at: Complex; count: number }[] = [];
	for (const w of eigenvalues) {
		const g = out.find((o) => abs(sub(o.at, w)) <= TOL * big);
		if (g) g.count++;
		else out.push({ at: w, count: 1 });
	}
	return out;
}

// --- the predictions ------------------------------------------------------------------------------------------------------

const on = (x: number) => x >= SLIDER_STEP / 2;

/** The first, once a single mass has a wave along its line and nothing else. */
export const noteFirst = (done: boolean, s: Scene) =>
	done || (presetOf(s.preset).single && on(s.z) && !on(s.x) && !on(s.mass));

/** The second, once a single mass has a wave across its line instead, and nothing else. */
export const noteSecond = (done: boolean, s: Scene) =>
	done || (presetOf(s.preset).single && on(s.x) && !on(s.z) && !on(s.mass));

// --- the words -----------------------------------------------------------------------------------------------------------

const SUPER: Record<string, string> = {
	'-': '⁻',
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹'
};

/** A number to n significant figures, trailing zeros dropped, as text ("−0.274", "6", "1.5 × 10⁻⁵") and as TeX. */
export function figuresOf(x: number, n = 3): { text: string; tex: string } {
	if (!Number.isFinite(x)) return { text: '—', tex: '\\text{—}' };
	if (x === 0) return { text: '0', tex: '0' };
	const a = Math.abs(x);
	if (a < 1e-4) {
		const [m, e] = x.toExponential(n - 1).split('e');
		const mant = String(Number(m));
		const exp = String(Number(e));
		return {
			text: `${mant.replace('-', '−')} × 10${[...exp].map((c) => SUPER[c]).join('')}`,
			tex: `${mant}\\times10^{${exp}}`
		};
	}
	const s = String(Number(x.toPrecision(n)));
	return { text: s.replace('-', '−'), tex: s };
}

export const figures = (x: number, n = 3) => figuresOf(x, n).text;

/** A complex number to three figures in each part: "0", "−2", "0.5i", "0.941 + 0.29i"; as text or TeX. */
export function complexOf(z: Complex, n = 3): { text: string; tex: string } {
	const re = z.re;
	const im = z.im;
	if (re === 0 && im === 0) return { text: '0', tex: '0' };
	const imAbs = figuresOf(Math.abs(im), n);
	const unitIm = imAbs.text === '1';
	const imText = unitIm ? 'i' : `${imAbs.text}i`;
	const imTex = unitIm ? 'i' : `${imAbs.tex}i`;
	if (im === 0) return figuresOf(re, n);
	if (re === 0) return { text: im < 0 ? `−${imText}` : imText, tex: im < 0 ? `-${imTex}` : imTex };
	const r = figuresOf(re, n);
	return {
		text: `${r.text} ${im < 0 ? '−' : '+'} ${imText}`,
		tex: `${r.tex} ${im < 0 ? '-' : '+'} ${imTex}`
	};
}

export const complexText = (z: Complex, n = 3) => complexOf(z, n).text;
export const complexTex = (z: Complex, n = 3) => complexOf(z, n).tex;

/** An entry of the grid: its two parts to three figures, each zero below TOL·|𝒲|. */
export function entryOf(
	z: Complex,
	length: number
): { re: string; im: string; reZero: boolean; imZero: boolean } {
	const re = tidyPart(z.re, TOL * length);
	const im = tidyPart(z.im, TOL * length);
	const imText = figures(Math.abs(im));
	return {
		re: figures(re),
		im: im === 0 ? '0i' : `${im < 0 ? '−' : '+'}${imText === '1' ? '' : imText}i`,
		reZero: re === 0,
		imZero: im === 0
	};
}

/** Each leaf of the chapter's tree: its words, its example, its minimal polynomial (TeX), and whether a scene at rest
 * can reach it. */
export const LEAVES: Record<
	Shape,
	{ words: string; example: string; minimal: string; atRest: boolean }
> = {
	I: {
		words: 'three different eigenvalues',
		example: 'two masses',
		minimal: '(\\lambda - w_1)(\\lambda - w_2)(\\lambda - w_3)',
		atRest: true
	},
	D: {
		words: 'a repeated eigenvalue, diagonalizable',
		example: 'one mass',
		minimal: '(\\lambda - w)(\\lambda + 2w)',
		atRest: true
	},
	II: {
		words: 'a repeated eigenvalue, not diagonalizable',
		example: 'a mass with a wave along its line',
		minimal: '(\\lambda - w)^2(\\lambda + 2w)',
		atRest: false
	},
	III: {
		words: '𝒲³ = 0, rank 2',
		example: 'the paper’s rows (0, 0, 1), (0, 0, i), (1, i, 0)',
		minimal: '\\lambda^3',
		atRest: false
	},
	N: {
		words: 'one wave, rank 1',
		example: 'a plane wave',
		minimal: '\\lambda^2',
		atRest: false
	},
	O: { words: 'no field', example: 'empty space', minimal: '\\lambda', atRest: true }
};

/** The tree's questions, as TeX. */
export const QUESTIONS: Record<Question, string> = {
	repeated: 'I^3 = 6J^2',
	zero: 'I = J = 0',
	product: '(\\mathcal W - w)(\\mathcal W + 2w) = 0',
	square: '\\mathcal W^2 = 0',
	empty: '\\mathcal W = 0'
};

/** The questions in words, for a screen reader. */
export const QUESTION_WORDS: Record<Question, string> = {
	repeated: 'I cubed equals 6 J squared',
	zero: 'I and J are zero',
	product: '(𝒲 − w)(𝒲 + 2w) is zero, with w = −J/I',
	square: '𝒲² is zero',
	empty: '𝒲 is zero'
};

/** The eigenvalues in words. */
export const eigenWords = (ws: Complex[]) => ws.map((w) => complexText(w)).join(', ');

/** The path through the tree in words. */
export const pathWords = (path: Step[]) =>
	path.map((s) => `${QUESTION_WORDS[s.question]}? ${s.yes ? 'yes' : 'no'}`).join('; ');

/** A whole reading in one sentence, for a screen reader. */
export function summaryOf(a: Analysis): string {
	return (
		`Type ${a.shape}: ${LEAVES[a.shape].words}. Eigenvalues ${eigenWords(a.eigenvalues)}; ` +
		`I = ${complexText(a.I)}, J = ${complexText(a.J)}, 1 − 6J²/I³ ${
			a.ratio ? `= ${complexText(a.ratio)}` : 'undefined'
		}; rank ${a.rank}, singular values ${a.singular.map((s) => (s <= TOL * a.singular[0] ? '0' : figures(s))).join(', ')}.`
	);
}

// the two masses' unit, once the arithmetic above is defined
PRESETS[1].unit = Math.max(...eigenvaluesOf(PRESETS[1].base).map(abs));
