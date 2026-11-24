/**
 * Majorana's stars: a spin s as a symmetric state of N = 2s spins one half, chapter 8.4's picture.
 *
 * A state is held as its N + 1 complex components c_m, m = −s … s, stored lowest first (index k = s + m, the number
 * of spins up), in the basis |s, m⟩ of S_z with the Condon–Shortley phases: S₋|s, m⟩ = √(s(s + 1) − m(m − 1))
 * |s, m − 1⟩ with a positive root. A spin one half along n̂ = (sin ϑ cos φ, sin ϑ sin φ, cos ϑ) is
 * |n̂⟩ = (cos ϑ/2, e^{iφ} sin ϑ/2), and N of them make the symmetric product, whose component with k spins up is the
 * sum over every choice of k of the N spins of Π a_j over the chosen times Π b_j over the rest, divided by √C(N, k).
 *
 * The stars of a state are the roots of Majorana's polynomial
 *
 *   p(z) = Σ_m (−1)^{s−m} √C(2s, s + m) c_m z^{s+m},
 *
 * carried to the sky by the stereographic map n̂(z) = (2 Re z, 2 Im z, 1 − |z|²)/(1 + |z|²), with z = tan(ϑ/2)e^{iφ};
 * a root missing because the top coefficients vanish is a star at −ẑ. Building from stars and finding them again are
 * inverse to each other, since p(z) is then Π(a_j z − b_j) up to a factor.
 *
 * For a spin two the state is also the paper's reading 𝒲 = E + iB, a complex symmetric trace-free table, with the
 * bracket tr(𝒲₁†𝒲₂) and the spin S_k𝒲 = [iL_k, 𝒲], (L_k)_ij = −ε_kij. Its basis 𝒴_m starts from the top state
 * 𝒴₂ = m mᵀ with m = (1, i, 0)/√2 and steps down with S_x − iS_y; then m(z)ᵀ𝒲m(z) = 2p(z), with chapter 6.6's
 * null vector m(z) = (1 − z², i(1 + z²), −2z), and one of the four spins has the Bloch vector b = P/u, with the
 * super-Poynting vector P_k = ε_kij(EB)_ij and the super-energy u = ½(|E|² + |B|²). For light, a spin one, the state
 * is the complex vector F = E + icB with S_kF = iL_kF = e_k × F and the basis 𝒱_m from 𝒱₁ = m in the same way.
 *
 * Everything here is a pure function of plain numbers; the reading 𝒲 is the state (not 𝒲*), as in the paper.
 */
import {
	abs,
	add,
	adjoint,
	cmat,
	conj,
	cx,
	div,
	mmul,
	mscale,
	mul,
	scale,
	sub,
	trace,
	ZERO,
	type CMat3,
	type Complex,
	type CVec3,
	type Vec3
} from '../pixel/complex';

export type { CMat3, Complex, CVec3, Vec3 };

// --- binomials and small helpers ------------------------------------------------------------------------------------

/** C(n, k). */
export function binomial(n: number, k: number): number {
	if (k < 0 || k > n) return 0;
	let r = 1;
	for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
	return Math.round(r);
}

/** Σ|c_m|². */
export const normSquared = (c: Complex[]) => c.reduce((s, x) => s + x.re * x.re + x.im * x.im, 0);

/** The state scaled to length one. */
export function normalized(c: Complex[]): Complex[] {
	const n = Math.sqrt(normSquared(c));
	if (!(n > 0)) throw new Error('the zero state has no direction');
	return c.map((x) => scale(x, 1 / n));
}

/** ⟨c₁|c₂⟩ = Σ c₁* c₂. */
export const bracket = (c1: Complex[], c2: Complex[]): Complex =>
	c1.reduce((s, x, k) => add(s, mul(conj(x), c2[k])), ZERO);

/** |⟨ψ₁|ψ₂⟩|² for the two states each scaled to length one. */
export function overlap(c1: Complex[], c2: Complex[]): number {
	const b = bracket(c1, c2);
	return (b.re * b.re + b.im * b.im) / (normSquared(c1) * normSquared(c2));
}

// --- the sphere and the plane ---------------------------------------------------------------------------------------

/** n̂(z) = (2 Re z, 2 Im z, 1 − |z|²)/(1 + |z|²); `undefined` stands for the point at infinity, −ẑ. */
export function direction(z: Complex | undefined): Vec3 {
	if (!z) return [0, 0, -1];
	const r2 = z.re * z.re + z.im * z.im;
	if (!Number.isFinite(r2)) return [0, 0, -1];
	return [(2 * z.re) / (1 + r2), (2 * z.im) / (1 + r2), (1 - r2) / (1 + r2)];
}

/** The stereographic coordinate of a direction, z = (n_x + i n_y)/(1 + n_z); `undefined` at −ẑ. */
export function coordinate(n: Vec3): Complex | undefined {
	const d = 1 + n[2];
	if (d <= 1e-300) return undefined;
	return cx(n[0] / d, n[1] / d);
}

/** A direction from the polar angle ϑ and the azimuth φ, radians. */
export const fromAngles = (theta: number, phi: number): Vec3 => [
	Math.sin(theta) * Math.cos(phi),
	Math.sin(theta) * Math.sin(phi),
	Math.cos(theta)
];

/** A vector scaled to length one. */
export function unitVec(n: Vec3): Vec3 {
	const r = Math.hypot(n[0], n[1], n[2]);
	return [n[0] / r, n[1] / r, n[2] / r];
}

/** The angle between two directions, radians, accurate for small and for nearly opposite angles. */
export function angleBetween(a: Vec3, b: Vec3): number {
	const ua = unitVec(a);
	const ub = unitVec(b);
	const cr = Math.hypot(
		ua[1] * ub[2] - ua[2] * ub[1],
		ua[2] * ub[0] - ua[0] * ub[2],
		ua[0] * ub[1] - ua[1] * ub[0]
	);
	return Math.atan2(cr, ua[0] * ub[0] + ua[1] * ub[1] + ua[2] * ub[2]);
}

/**
 * The spin one half up along n̂, |n̂⟩ = (cos ϑ/2, e^{iφ} sin ϑ/2), from the direction itself: cos ϑ/2 = √((1 + n_z)/2)
 * and e^{iφ} sin ϑ/2 = (n_x + i n_y)/√(2(1 + n_z)), which keeps its digits near both poles. At −ẑ it is (0, 1).
 */
export function spinor(n: Vec3): [Complex, Complex] {
	const u = unitVec(n);
	const a = Math.sqrt(Math.max(0, (1 + u[2]) / 2));
	const s = Math.sqrt(Math.max(0, (1 - u[2]) / 2));
	const r = Math.hypot(u[0], u[1]);
	if (r === 0) return [cx(a), cx(s)];
	return [cx(a), cx((s * u[0]) / r, (s * u[1]) / r)];
}

// --- building a state from its stars ----------------------------------------------------------------------------------

/**
 * The symmetric product of the spins one half |n̂_j⟩, as the N + 1 components c_m lowest first, scaled to length one.
 * The product Π_j (a_j u + b_j) collects, as its coefficient of u^k, the sum over every choice of k spins up.
 */
export function fromStars(stars: Vec3[]): Complex[] {
	if (stars.length === 0) throw new Error('a state needs at least one star');
	let poly: Complex[] = [cx(1)];
	for (const n of stars) {
		const [a, b] = spinor(n);
		const next: Complex[] = Array.from({ length: poly.length + 1 }, () => ZERO);
		poly.forEach((x, k) => {
			next[k] = add(next[k], mul(x, b));
			next[k + 1] = add(next[k + 1], mul(x, a));
		});
		poly = next;
	}
	const N = stars.length;
	return normalized(poly.map((x, k) => scale(x, 1 / Math.sqrt(binomial(N, k)))));
}

/** The spin coherent state |n̂⟩_s, all N = 2s stars at n̂. */
export const coherent = (n: Vec3, N: number): Complex[] =>
	fromStars(Array.from({ length: N }, () => n));

// --- Majorana's polynomial and its roots ------------------------------------------------------------------------------

/** The coefficients of p(z), lowest first: (−1)^{N−k} √C(N, k) c_k for k = s + m. */
export function majoranaPoly(c: Complex[]): Complex[] {
	const N = c.length - 1;
	return c.map((x, k) => scale(x, ((N - k) % 2 ? -1 : 1) * Math.sqrt(binomial(N, k))));
}

/** A polynomial, lowest coefficient first, at z, by Horner's rule. */
export function evaluate(p: Complex[], z: Complex): Complex {
	let s = ZERO;
	for (let i = p.length - 1; i >= 0; i--) s = add(mul(s, z), p[i]);
	return s;
}

/** The derivative's coefficients. */
const derivative = (p: Complex[]) => p.slice(1).map((x, i) => scale(x, i + 1));

/**
 * The roots of p(z) (lowest coefficient first) by the Aberth–Ehrlich iteration, each then polished by Newton's rule in
 * z or in 1/z, whichever is the smaller. Leading coefficients below `tol` of the largest are roots at infinity and are
 * counted as `missing`; trailing ones are roots at zero, returned exactly. A root of multiplicity k converges to about
 * the k-th root of the working precision, as in any root finder; `starsOf` gathers such clusters.
 */
export function polyRoots(p: Complex[], tol = 1e-12): { roots: Complex[]; missing: number } {
	const big = Math.max(0, ...p.map(abs));
	const N = p.length - 1;
	if (!(big > 0)) throw new Error('the zero polynomial has no roots');
	let hi = N;
	while (hi > 0 && abs(p[hi]) <= tol * big) hi--;
	let lo = 0;
	while (lo < hi && abs(p[lo]) <= tol * big) lo++;
	const zeros: Complex[] = Array.from({ length: lo }, () => cx(0));
	const missing = N - hi;
	const d = hi - lo;
	if (d === 0) return { roots: zeros, missing };

	const q = p.slice(lo, hi + 1);
	// scale z by the geometric mean of the roots' sizes, so that the roots lie about the unit circle
	const rho = (abs(q[0]) / abs(q[d])) ** (1 / d);
	const qs = q.map((x, i) => scale(x, rho ** i));
	const lead = qs[d];
	const mon = qs.map((x) => div(x, lead));
	const dmon = derivative(mon);

	let z = Array.from({ length: d }, (_, j) => {
		const t = (2 * Math.PI * j) / d + 0.4;
		return cx(Math.cos(t), Math.sin(t));
	});
	for (let it = 0; it < 500; it++) {
		let moved = 0;
		const next = z.slice();
		for (let i = 0; i < d; i++) {
			const f = evaluate(mon, next[i]);
			if (abs(f) === 0) continue;
			const ratio = div(f, evaluate(dmon, next[i]));
			let sum = ZERO;
			for (let j = 0; j < d; j++) {
				if (j === i) continue;
				const diff = sub(next[i], next[j]);
				if (abs(diff) > 0) sum = add(sum, div(cx(1), diff));
			}
			const denom = sub(cx(1), mul(ratio, sum));
			const step = abs(denom) > 0 ? div(ratio, denom) : ratio;
			next[i] = sub(next[i], step);
			moved = Math.max(moved, abs(step) / (1 + abs(next[i])));
		}
		z = next;
		if (moved < 1e-16) break;
	}

	const roots = z.map((w) => polish(q, scale(w, rho)));
	return { roots: [...zeros, ...roots], missing };
}

/** A few Newton steps on p in z inside the unit circle, or on z^d p(1/z) in 1/z outside it, kept while they help. */
function polish(p: Complex[], z0: Complex): Complex {
	const inside = abs(z0) <= 1;
	const poly = inside ? p : p.slice().reverse();
	const dpoly = derivative(poly);
	let w = inside ? z0 : div(cx(1), z0);
	let res = abs(evaluate(poly, w));
	for (let it = 0; it < 6 && res > 0; it++) {
		const dp = evaluate(dpoly, w);
		if (abs(dp) === 0) break;
		const trial = sub(w, div(evaluate(poly, w), dp));
		const r = abs(evaluate(poly, trial));
		if (!(r < res)) break;
		w = trial;
		res = r;
	}
	if (inside) return w;
	return abs(w) === 0 ? cx(Infinity) : div(cx(1), w);
}

/** A star and how many of the state's stars sit on it. */
export interface Star {
	direction: Vec3;
	count: number;
}

/** Stars closer than this on the unit sphere (chord) are taken as one star of higher multiplicity. */
export const CLUSTER = 2e-3;

/**
 * The stars of a state: the roots of its Majorana polynomial on the sky, missing roots at −ẑ. Roots that come out as
 * a small cluster, as the k roots of a k-fold star do, are gathered into one star of multiplicity k, placed at the root
 * of the (k − 1)-th derivative of p found by Newton's rule from the cluster's mean (in z, or in 1/z for a cluster in
 * the southern half): a simple root, so accurate to the working precision where the cluster's members are not.
 * Returned with every star once (`all`, N directions) and grouped (`stars`).
 */
export function starsOf(c: Complex[], cluster = CLUSTER): { all: Vec3[]; stars: Star[] } {
	const p = majoranaPoly(c);
	const { roots, missing } = polyRoots(p);
	const finite = (z: Complex) => Number.isFinite(z.re) && Number.isFinite(z.im);
	const points: { z: Complex | undefined; n: Vec3 }[] = [
		...roots.map((z) =>
			finite(z) ? { z, n: direction(z) } : { z: undefined, n: [0, 0, -1] as Vec3 }
		),
		...Array.from({ length: missing }, () => ({ z: undefined, n: [0, 0, -1] as Vec3 }))
	];
	// gather by chord distance, transitively
	const group = points.map((_, i) => i);
	const find = (i: number): number => (group[i] === i ? i : (group[i] = find(group[i])));
	for (let i = 0; i < points.length; i++)
		for (let j = i + 1; j < points.length; j++) {
			const a = points[i].n;
			const b = points[j].n;
			if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < cluster) group[find(i)] = find(j);
		}
	const sets = new Map<number, number[]>();
	points.forEach((_, i) => {
		const r = find(i);
		sets.set(r, [...(sets.get(r) ?? []), i]);
	});
	const stars: Star[] = [];
	const all: Vec3[] = [];
	for (const members of sets.values()) {
		const n = clusterDirection(
			p,
			members.map((i) => points[i])
		);
		stars.push({ direction: n, count: members.length });
		for (let i = 0; i < members.length; i++) all.push(n);
	}
	stars.sort((a, b) => b.direction[2] - a.direction[2] || b.count - a.count);
	all.sort((a, b) => b[2] - a[2] || b[0] - a[0] || b[1] - a[1]);
	return { all, stars };
}

/** The k-th derivative's coefficients. */
function derivativeOf(p: Complex[], k: number): Complex[] {
	let d = p;
	for (let i = 0; i < k; i++) d = derivative(d);
	return d;
}

/** Where a cluster of k roots of p sits: the root of p^{(k−1)} near their mean, in z or in w = 1/z. */
function clusterDirection(p: Complex[], points: { z: Complex | undefined; n: Vec3 }[]): Vec3 {
	const k = points.length;
	if (k === 1) return points[0].n;
	const north = points.reduce((s, q) => s + q.n[2], 0) >= 0;
	const poly = north ? p : p.slice().reverse();
	const ws = points.map((q) =>
		north ? (q.z ?? cx(0)) : q.z && abs(q.z) > 0 ? div(cx(1), q.z) : cx(0)
	);
	const back = (w: Complex): Vec3 =>
		north ? direction(w) : abs(w) === 0 ? [0, 0, -1] : direction(div(cx(1), w));
	// a star exactly at a pole, from exact zero or missing roots, stays exact
	if (ws.every((w) => w.re === 0 && w.im === 0)) return back(cx(0));
	let w = scale(
		ws.reduce((s, x) => add(s, x), ZERO),
		1 / k
	);
	const D = derivativeOf(poly, k - 1);
	const dD = derivative(D);
	let res = abs(evaluate(D, w));
	for (let it = 0; it < 8 && res > 0; it++) {
		const slope = evaluate(dD, w);
		if (abs(slope) === 0) break;
		const trial = sub(w, div(evaluate(D, w), slope));
		const r = abs(evaluate(D, trial));
		if (!(r < res)) break;
		w = trial;
		res = r;
	}
	return back(w);
}

// --- the mean spin and the Bloch vector of one spin -------------------------------------------------------------------

/**
 * ⟨S⟩ of a state, in units of ħ: ⟨S_z⟩ = Σ m|c_m|² and ⟨S_x⟩ + i⟨S_y⟩ = ⟨S₊⟩ = Σ c*_{m+1} c_m √(s(s + 1) − m(m + 1)),
 * over Σ|c_m|².
 */
export function meanSpin(c: Complex[]): Vec3 {
	const N = c.length - 1;
	const s = N / 2;
	const n2 = normSquared(c);
	let sz = 0;
	let plus = ZERO;
	c.forEach((x, k) => {
		const m = k - s;
		sz += m * (x.re * x.re + x.im * x.im);
		if (k < N)
			plus = add(plus, scale(mul(conj(c[k + 1]), x), Math.sqrt(s * (s + 1) - m * (m + 1))));
	});
	return [plus.re / n2, plus.im / n2, sz / n2];
}

/** The Bloch vector of any one of the 2s spins one half, b = ⟨S⟩/s. */
export function bloch(c: Complex[]): Vec3 {
	const s = (c.length - 1) / 2;
	const S = meanSpin(c);
	return [S[0] / s, S[1] / s, S[2] / s];
}

/** |b|. */
export const blochLength = (c: Complex[]) => Math.hypot(...bloch(c));

// --- spin two: the reading 𝒲 as a table ---------------------------------------------------------------------------

/** The generators (L_k)_ij = −ε_kij, which turn arrows: L_k a = e_k × a. */
export const GENERATORS: CMat3[] = [0, 1, 2].map((k) =>
	cmat((i, j) => cx(-levi(k, i, j)))
) as CMat3[];

/** ε_ijk. */
export function levi(i: number, j: number, k: number): number {
	if (i === j || j === k || i === k) return 0;
	return (j - i + 3) % 3 === 1 && (k - j + 3) % 3 === 1 ? 1 : -1;
}

const I = cx(0, 1);

/** S_k𝒲 = [iL_k, 𝒲]. */
export function spinOnTable(k: number, W: CMat3): CMat3 {
	const L = GENERATORS[k];
	const LW = mmul(L, W);
	const WL = mmul(W, L);
	return cmat((i, j) => mul(I, sub(LW[i][j], WL[i][j])));
}

/** S₋𝒲 = S_x𝒲 − iS_y𝒲. */
const lowerTable = (W: CMat3): CMat3 => {
	const X = spinOnTable(0, W);
	const Y = spinOnTable(1, W);
	return cmat((i, j) => sub(X[i][j], mul(I, Y[i][j])));
};

/** The null vector of a wave along +ẑ, m = (1, i, 0)/√2. */
export const M_TOP: CVec3 = [cx(Math.SQRT1_2), cx(0, Math.SQRT1_2), cx(0)];

/** The basis 𝒴_m, lowest m first (index k = m + 2): 𝒴₂ = m mᵀ, then 𝒴_{m−1} = S₋𝒴_m/√(6 − m(m − 1)). */
export const TABLES: CMat3[] = (() => {
	const top = cmat((i, j) => mul(M_TOP[i], M_TOP[j]));
	const out: CMat3[] = [top];
	for (let m = 2; m > -2; m--) {
		const next = lowerTable(out[out.length - 1]);
		out.push(mscale(next, cx(1 / Math.sqrt(6 - m * (m - 1)))));
	}
	return out.reverse();
})();

/** tr(A†B). */
export const tableBracket = (A: CMat3, B: CMat3): Complex => trace(mmul(adjoint(A), B));

/** A reading's five components c_m = tr(𝒴_m†𝒲), lowest m first. */
export const componentsOfTable = (W: CMat3): Complex[] => TABLES.map((Y) => tableBracket(Y, W));

/** The reading Σ c_m 𝒴_m. */
export const tableOf = (c: Complex[]): CMat3 =>
	cmat((i, j) => c.reduce((s, x, k) => add(s, mul(x, TABLES[k][i][j])), ZERO));

/** A reading from its real tide E and magnetic part B, 𝒲 = E + iB. */
export const reading = (E: number[][], B: number[][]): CMat3 =>
	cmat((i, j) => cx(E[i][j], B[i][j]));

/** m(z) = (1 − z², i(1 + z²), −2z). */
export function nullVector(z: Complex): CVec3 {
	const z2 = mul(z, z);
	return [sub(cx(1), z2), mul(I, add(cx(1), z2)), scale(z, -2)];
}

/** Section VIII's quartic m(z)ᵀ𝒲m(z), which is 2p(z). */
export function quartic(W: CMat3, z: Complex): Complex {
	const m = nullVector(z);
	let s = ZERO;
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s = add(s, mul(mul(m[i], W[i][j]), m[j]));
	return s;
}

/** The super-Poynting vector P_k = ε_kij(EB)_ij and the super-energy u = ½(|E|² + |B|²) of a reading. */
export function superPoynting(W: CMat3): { P: Vec3; u: number } {
	const E = W.map((r) => r.map((x) => x.re));
	const B = W.map((r) => r.map((x) => x.im));
	const EB = (i: number, j: number) => E[i][0] * B[0][j] + E[i][1] * B[1][j] + E[i][2] * B[2][j];
	const P: Vec3 = [0, 0, 0];
	for (let k = 0; k < 3; k++)
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) P[k] += levi(k, i, j) * EB(i, j);
	let u = 0;
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) u += E[i][j] ** 2 + B[i][j] ** 2;
	return { P, u: u / 2 };
}

/** ⟨S_k⟩ = tr(𝒲†[iL_k, 𝒲])/tr(𝒲†𝒲), straight from the table. */
export function meanSpinOfTable(W: CMat3): Vec3 {
	const n = tableBracket(W, W).re;
	return [0, 1, 2].map((k) => tableBracket(W, spinOnTable(k, W)).re / n) as Vec3;
}

// --- spin one: light's F as a vector ---------------------------------------------------------------------------------

/** S_kF = iL_kF = i e_k × F. */
export function spinOnVector(k: number, F: CVec3): CVec3 {
	const L = GENERATORS[k];
	return [0, 1, 2].map((i) =>
		mul(I, add(add(mul(L[i][0], F[0]), mul(L[i][1], F[1])), mul(L[i][2], F[2])))
	) as CVec3;
}

/** The basis 𝒱_m, lowest m first (index k = m + 1): 𝒱₁ = m, then 𝒱_{m−1} = S₋𝒱_m/√(2 − m(m − 1)). */
export const VECTORS: CVec3[] = (() => {
	const out: CVec3[] = [M_TOP];
	for (let m = 1; m > -1; m--) {
		const v = out[out.length - 1];
		const X = spinOnVector(0, v);
		const Y = spinOnVector(1, v);
		const r = 1 / Math.sqrt(2 - m * (m - 1));
		out.push([0, 1, 2].map((i) => scale(sub(X[i], mul(I, Y[i])), r)) as CVec3);
	}
	return out.reverse();
})();

/** Light's three components c_m = 𝒱_m†F, lowest m first. */
export const componentsOfVector = (F: CVec3): Complex[] =>
	VECTORS.map((V) => V.reduce((s, x, i) => add(s, mul(conj(x), F[i])), ZERO));
