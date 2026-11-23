/**
 * Chapter 3.4's camera of three pixels. Three pixels in a row, 1 m apart, read d = −ℰ_zz above three masses in a
 * row at the depth z = 1 m, a distance δ apart, the middle one under the middle pixel. A kilogram at the distance a
 * along the row gives a pixel g_z(a) = G(2z² − a²)/(z² + a²)^{5/2}, so the design matrix has the entries
 * A_ab = g_z(x_a − x'_b). Its singular value decomposition A = Σ s_i u_i v_iᵀ gives the three scene patterns v_i,
 * their gains s_i and the reading patterns u_i. Gains and readings are in units of G/z³ per kilogram, lengths in
 * metres, and z = 1 m throughout, so that δ/z is δ in metres.
 */

/** The depth of the masses below the pixels, metres. */
export const DEPTH = 1;

/** The places of the three pixels along the row, metres. */
export const PIXELS = [-1, 0, 1] as const;

/** G/z³ in s⁻² per kilogram, at z = 1 m: the unit of the gains. */
export const UNIT = 6.674e-11;

/** A list of three numbers. */
export type Three = [number, number, number];

/** A 3 × 3 matrix, by rows. */
export type Matrix = [Three, Three, Three];

/** The reading a kilogram at the distance a along the row gives a pixel, in units of G/z³: (2 − t²)/(1 + t²)^{5/2}, t = a/z. */
export function kernel(a: number, z = DEPTH): number {
	const t = a / z;
	return (2 - t * t) / (1 + t * t) ** 2.5;
}

/** The places of the three masses along the row, metres: −δ, 0 and δ. */
export const masses = (delta: number): Three => [-delta, 0, delta];

/** The design matrix A_ab = g_z(x_a − x'_b): row a is pixel a, column b is mass b. */
export function design(delta: number): Matrix {
	const x = masses(delta);
	return PIXELS.map((p) => x.map((q) => kernel(p - q)) as Three) as Matrix;
}

/** A matrix times a list. */
export const apply = (m: Matrix, v: Three): Three =>
	m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]) as Three;

/** The dot product of two lists. */
export const dot = (a: Three, b: Three) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** AᵀA, the symmetric and positive semidefinite 3 × 3 matrix whose eigenvalues are the squared gains. */
export function gram(m: Matrix): Matrix {
	const out: Matrix = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++)
			out[i][j] = m[0][i] * m[0][j] + m[1][i] * m[1][j] + m[2][i] * m[2][j];
	return out;
}

/**
 * The eigenvalues and unit eigenvectors of a symmetric 3 × 3 matrix, by cyclic Jacobi rotations: each rotation zeroes
 * one off-diagonal entry, and a few sweeps bring them all below the rounding of the diagonal. The eigenvectors are the
 * columns of the product of the rotations, returned as lists, largest eigenvalue first.
 */
export function eigen(t: Matrix): { values: Three; vectors: [Three, Three, Three] } {
	const a = t.map((row) => [...row]) as Matrix;
	const q: Matrix = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	for (let sweep = 0; sweep < 50; sweep++) {
		const off = Math.hypot(a[0][1], a[0][2], a[1][2]);
		const scale = Math.hypot(a[0][0], a[1][1], a[2][2]);
		if (off <= 1e-300 || off <= 1e-17 * scale) break;
		for (const [p, r] of [
			[0, 1],
			[0, 2],
			[1, 2]
		] as const) {
			if (a[p][r] === 0) continue;
			// the angle that zeroes a[p][r]: tan 2φ = 2 a_pr/(a_rr − a_pp), taken through the smaller root for accuracy
			const theta = (a[r][r] - a[p][p]) / (2 * a[p][r]);
			const tan = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
			const c = 1 / Math.sqrt(tan * tan + 1);
			const s = tan * c;
			for (let k = 0; k < 3; k++) {
				const akp = a[k][p];
				const akr = a[k][r];
				a[k][p] = c * akp - s * akr;
				a[k][r] = s * akp + c * akr;
			}
			for (let k = 0; k < 3; k++) {
				const apk = a[p][k];
				const ark = a[r][k];
				a[p][k] = c * apk - s * ark;
				a[r][k] = s * apk + c * ark;
			}
			for (let k = 0; k < 3; k++) {
				const qkp = q[k][p];
				const qkr = q[k][r];
				q[k][p] = c * qkp - s * qkr;
				q[k][r] = s * qkp + c * qkr;
			}
		}
	}
	const order = [0, 1, 2].sort((i, j) => a[j][j] - a[i][i]);
	return {
		values: order.map((i) => a[i][i]) as Three,
		vectors: order.map((i) => [q[0][i], q[1][i], q[2][i]] as Three) as [Three, Three, Three]
	};
}

/**
 * A pattern turned so that its entry of largest size is positive (+ 0: never a −0). Entries within a part in 10⁹ of
 * the largest count as tied, and the last of them decides: the side-to-side pattern (−1, 0, 1)/√2 keeps its right
 * side positive, as the chapter writes it.
 */
export function orient(v: Three): Three {
	const big = Math.max(...v.map(Math.abs));
	let k = 0;
	for (let i = 0; i < 3; i++) if (Math.abs(v[i]) >= big * (1 - 1e-9)) k = i;
	return (v[k] < 0 ? v.map((x) => -x + 0) : v.map((x) => x + 0)) as Three;
}

/** One pattern of the decomposition: the scene pattern v, its gain s, and the reading pattern u = A v/s. */
export interface Pattern {
	v: Three;
	s: number;
	u: Three;
	/** The readings one kilogram of the pattern gives the three pixels, A v = s u. */
	readings: Three;
}

/**
 * The singular value decomposition of a 3 × 3 matrix, largest gain first. It makes the same Jacobi rotations that
 * would bring AᵀA to its diagonal, but applies them to the columns of A, so that AᵀA is never formed (one-sided
 * Jacobi): each rotation turns two columns until they are perpendicular, and the product of the rotations is V.
 * When the columns are all perpendicular, column i has the length s_i and the direction u_i, and column i of V is
 * v_i. Forming AᵀA would square the ratio of the gains, and the third gain, which falls as δ², would lose its digits.
 */
export function singular(m: Matrix): {
	s: Three;
	u: [Three, Three, Three];
	v: [Three, Three, Three];
} {
	// the columns of A, and of V
	const w = [0, 1, 2].map((j) => [m[0][j], m[1][j], m[2][j]]) as [Three, Three, Three];
	const v = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	] as [Three, Three, Three];
	const turn = (x: Three, y: Three, c: number, s: number) => {
		for (let k = 0; k < 3; k++) {
			const xk = x[k];
			const yk = y[k];
			x[k] = c * xk - s * yk;
			y[k] = s * xk + c * yk;
		}
	};
	for (let sweep = 0; sweep < 60; sweep++) {
		let turned = false;
		for (const [p, r] of [
			[0, 1],
			[0, 2],
			[1, 2]
		] as const) {
			const alpha = dot(w[p], w[p]);
			const beta = dot(w[r], w[r]);
			const gamma = dot(w[p], w[r]);
			if (Math.abs(gamma) <= 1e-16 * Math.sqrt(alpha * beta)) continue;
			turned = true;
			// the angle that makes the two columns perpendicular, through the smaller root for accuracy
			const zeta = (beta - alpha) / (2 * gamma);
			const tan = Math.sign(zeta || 1) / (Math.abs(zeta) + Math.sqrt(zeta * zeta + 1));
			const c = 1 / Math.sqrt(tan * tan + 1);
			turn(w[p], w[r], c, tan * c);
			turn(v[p], v[r], c, tan * c);
		}
		if (!turned) break;
	}
	const order = [0, 1, 2].sort((i, j) => dot(w[j], w[j]) - dot(w[i], w[i]));
	const s = order.map((i) => Math.hypot(...w[i])) as Three;
	return {
		s,
		u: order.map((i, k) => w[i].map((x) => (s[k] > 0 ? x / s[k] : 0)) as Three) as [
			Three,
			Three,
			Three
		],
		v: order.map((i) => v[i]) as [Three, Three, Three]
	};
}

/**
 * The camera's three patterns at the spacing δ, largest gain first: the scene pattern v_i, turned by `orient` so that
 * it never flips as δ moves, its gain s_i, and the reading pattern u_i, turned with it so that A v_i = s_i u_i.
 */
export function decompose(delta: number): Pattern[] {
	const { s, u, v } = singular(design(delta));
	return [0, 1, 2].map((i) => {
		const turned = orient(v[i]);
		const sign = turned[0] * v[i][0] + turned[1] * v[i][1] + turned[2] * v[i][2] < 0 ? -1 : 1;
		const ui = u[i].map((x) => sign * x + 0) as Three;
		return { v: turned, s: s[i], u: ui, readings: ui.map((x) => s[i] * x) as Three };
	});
}

// --- the sliders --------------------------------------------------------------------------------------------------

/** The spacing's range, metres. */
export const CLOSEST = 0.05;
export const FARTHEST = 1;

/** The spacings of the chapter's table, metres, where the slider has its ticks. */
export const TABLE = [1, 0.5, 0.25, 0.1] as const;

/** The spacing below which the prediction is answered, metres. */
export const CROWDED = 0.25;

/** The noise's range, in units of G/z³ times one kilogram: σ_n compared with the gain of one kilogram of a pattern. */
export const QUIETEST = 0.001;
export const LOUDEST = 1;

/** The figure opens at the widest spacing and a noise of 0.05. */
export const OPENING = { delta: 1, noise: 0.05 } as const;

/** Every number of two significant figures from `low` to `high`, rising; both ends are powers of ten times 1 or 5. */
function rungs(low: number, high: number): number[] {
	const out: number[] = [];
	for (let e = Math.floor(Math.log10(low)) - 1; e <= Math.ceil(Math.log10(high)); e++)
		for (let k = 10; k < 100; k++) {
			const v = Number((k * 10 ** (e - 1)).toPrecision(2));
			if (v >= low - 1e-12 && v <= high + 1e-12) out.push(v);
		}
	return [...new Set(out)].sort((x, y) => x - y);
}

/** Every spacing the slider stops at: 0.050, 0.051, …, 0.99, 1.0. */
export const SPACINGS: readonly number[] = rungs(CLOSEST, FARTHEST);

/** Every noise the slider stops at: 0.0010, 0.0011, …, 0.99, 1.0. */
export const NOISES: readonly number[] = rungs(QUIETEST, LOUDEST);

/** A value to two significant figures, within the range. */
export function snap(v: number, low: number, high: number): number {
	const held = Math.max(low, Math.min(high, v));
	return Math.max(low, Math.min(high, Number(held.toPrecision(2))));
}

/** The value `steps` rungs above `v` (below, if negative) on a ladder of rungs, held within it. */
export function stepRung(ladder: readonly number[], v: number, steps: number): number {
	let i = ladder.findIndex((r) => r >= v - 1e-12);
	if (i < 0) i = ladder.length - 1;
	return ladder[Math.max(0, Math.min(ladder.length - 1, i + steps))];
}

// --- the numbers as the chapter prints them ---------------------------------------------------------------------------

/** A gain as the chapter's table prints it: two decimals from 0.1 up, two significant figures below. */
export function gainText(s: number): string {
	if (s >= 0.0995) return s.toFixed(2);
	return s.toPrecision(2);
}

/** A spacing as the chapter writes it, without trailing zeros: "1", "0.5", "0.25", "0.05". */
export const spacingText = (delta: number) => String(Number(delta.toPrecision(2)));

// --- the two laws as the masses crowd together ------------------------------------------------------------------------

/** The kernel's slope, in units of G/z⁴: d g_z/da. */
export function slope(a: number, z = DEPTH): number {
	const t = a / z;
	const w = 1 + t * t;
	return (-2 * t * w - 5 * t * (2 - t * t)) / (z * w ** 3.5);
}

/**
 * The second gain divided by δ as δ → 0. One kilogram of the pattern (−1, 0, 1)/√2 gives pixel a the reading
 * (g_z(x_a + δ) − g_z(x_a − δ))/√2 ≈ √2 δ g'(x_a); the middle pixel sees no slope, and the two outer ones the slope
 * at 1 m, so the readings have the length 2δ|g'(z)|.
 */
export const secondLaw = () => 2 * Math.abs(slope(PIXELS[2]));

/** The kernel's curvature, in units of G/z⁵: d²g_z/da², from the slope by a central difference. */
export function curvature(a: number, z = DEPTH): number {
	const h = 1e-5 * z;
	return (slope(a + h, z) - slope(a - h, z)) / (2 * h);
}

/**
 * The third gain divided by δ² as δ → 0. A kilogram at each outer mass gives the pixels 2c + δ²w to second order,
 * with c the readings of a kilogram under the middle pixel and w the kernel's curvature at the pixels, so only the
 * part w⊥ of w across c tells the two outer masses from a double one in the middle. In the scenes that are the same
 * on both sides, with the basis (1, 0, 1)/√2 and (0, 1, 0), the camera's two columns are √2c + δ²w/√2 and c: the
 * two gains there multiply to the area between them, δ²|w⊥||c|/√2, and the first is √3|c| to leading order, so the
 * third is δ²|w⊥|/√6.
 */
export function thirdLaw(): number {
	const c = PIXELS.map((x) => kernel(x)) as Three;
	const w = PIXELS.map((x) => curvature(x)) as Three;
	const along = dot(w, c) / dot(c, c);
	const across = w.map((wi, i) => wi - along * c[i]) as Three;
	return Math.hypot(...across) / Math.sqrt(6);
}
