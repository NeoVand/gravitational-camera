/**
 * What one pixel knows (paper, Section III): the algebra of its ten numbers as one complex symmetric matrix
 * W = E + iB. A port of reference/gravcam/pixel.py, with the same names and conventions, tested against
 * reference/fixtures/pixel.json (pixel.spec.ts).
 */
import {
	abs,
	add,
	adjoint,
	cdot,
	cmat,
	conj,
	ccross,
	csqrt,
	ccbrt,
	cross,
	cx,
	div,
	dot,
	fnorm,
	hermitianEigen,
	identity,
	madd,
	minus,
	mmul,
	mscale,
	mul,
	mvec,
	norm,
	nullVector as smallestRightVector,
	outer,
	padd,
	pmul,
	realMat,
	roots,
	scale,
	sub,
	trace,
	transpose,
	unit,
	zeroMat,
	ZERO,
	type CMat3,
	type Complex,
	type CVec3,
	type Poly,
	type Vec3
} from './complex';

export const G = 6.6743e-11;
export const C = 299_792_458;

export function weyl(E: number[][], B: number[][]): CMat3 {
	return cmat((i, j) => cx(E[i][j], B[i][j]));
}

/** (I, J) = (tr W^2, tr W^3), the same for every observer. */
export function invariants(W: CMat3): { I: Complex; J: Complex } {
	const W2 = mmul(W, W);
	return { I: trace(W2), J: trace(mmul(W2, W)) };
}

/** 1 - 6 J^2 / I^3: zero for a repeated eigenvalue (one body, types D and II); NaN when I = 0. */
export function speciality(W: CMat3): Complex {
	const { I, J } = invariants(W);
	if (abs(I) === 0) return cx(NaN, NaN);
	return sub(cx(1), scale(div(mul(J, J), mul(I, mul(I, I))), 6));
}

/** The roots of the characteristic polynomial l^3 - (I/2) l - J/3 of a trace-free W, by Cardano. */
function cardano(W: CMat3): Complex[] {
	const { I, J } = invariants(W);
	const p = scale(I, -0.5);
	const q = scale(J, -1 / 3);
	// depressed cubic l^3 + p l + q = 0, with u v = -p/3
	const disc = add(scale(mul(q, q), 0.25), scale(mul(p, mul(p, p)), 1 / 27));
	let u = ccbrt(add(scale(q, -0.5), csqrt(disc)));
	if (abs(u) < 1e-300) u = ccbrt(sub(scale(q, -0.5), csqrt(disc)));
	const w = [cx(1), cx(-0.5, Math.sqrt(3) / 2), cx(-0.5, -Math.sqrt(3) / 2)];
	return w.map((wk) => {
		const uk = mul(u, wk);
		return abs(uk) === 0 ? ZERO : sub(uk, div(scale(p, 1 / 3), uk));
	});
}

/**
 * The three eigenvalues of a trace-free W. The polynomial alone loses half the digits of a pair that nearly
 * coincide (one body), so only the simplest root is taken from it; the other two come from the 2x2 block of W on
 * the complement of that root's eigenvector, which keeps them to full precision.
 */
export function eigenvalues(W: CMat3): Complex[] {
	const roots3 = cardano(W);
	const gap = (k: number) =>
		Math.min(...roots3.filter((_, i) => i !== k).map((z) => abs(sub(z, roots3[k]))));
	const s = [0, 1, 2].reduce((b, k) => (gap(k) > gap(b) ? k : b), 0);
	const lam = roots3[s];
	const M = madd(W, mscale(identity(), scale(lam, -1)));
	const cands = [ccross(M[0], M[1]), ccross(M[0], M[2]), ccross(M[1], M[2])];
	const v = cands.reduce((best, c) => (cnorm(c) > cnorm(best) ? c : best));
	const pp = cdot(v, v);
	const size = fnorm(W);
	if (size === 0 || cnorm(v) === 0 || abs(pp) < 1e-6 * cnorm(v) ** 2) return roots3;
	const p = v.map((z) => div(z, csqrt(pp))) as CVec3;
	// a basis of the complement, orthonormal in the bilinear sense: q1 from a real axis, q2 = p x q1
	const axis = [0, 1, 2].reduce((b, i) => (abs(p[i]) < abs(p[b]) ? i : b), 0);
	const e: CVec3 = [ZERO, ZERO, ZERO];
	e[axis] = cx(1);
	const pe = cdot(p, e);
	let q1 = e.map((z, i) => sub(z, mul(pe, p[i]))) as CVec3;
	q1 = q1.map((z) => div(z, csqrt(cdot(q1, q1)))) as CVec3;
	const q2 = ccross(p, q1);
	const a = cdot(q1, mvec(W, q1)),
		b = cdot(q1, mvec(W, q2)),
		d = cdot(q2, mvec(W, q2));
	const mean = scale(add(a, d), 0.5);
	const half = csqrt(add(scale(mul(sub(a, d), sub(a, d)), 0.25), mul(b, b)));
	const out = [...roots3];
	const others = [0, 1, 2].filter((i) => i !== s);
	// keep the simple root as it is, refined against the trace: it is minus the sum of the other two
	out[others[0]] = add(mean, half);
	out[others[1]] = sub(mean, half);
	out[s] = scale(add(out[others[0]], out[others[1]]), -1);
	return out;
}

/** Petrov type: O, N, III, D, II or I, with the reference's tolerance (relative to |W|). */
export function petrov(W: CMat3, tol = 1e-7): 'O' | 'N' | 'III' | 'D' | 'II' | 'I' {
	const s = fnorm(W);
	if (s === 0) return 'O';
	const Wn = mscale(W, cx(1 / s));
	const W2 = mmul(Wn, Wn);
	if (fnorm(W2) < tol) return 'N';
	if (fnorm(mmul(W2, Wn)) < tol) return 'III';
	if (abs(speciality(Wn)) > Math.sqrt(tol)) return 'I';
	const lam = eigenvalues(Wn);
	let best: [number, number] = [0, 1];
	for (const [i, j] of [
		[0, 1],
		[0, 2],
		[1, 2]
	] as const)
		if (abs(sub(lam[i], lam[j])) < abs(sub(lam[best[0]], lam[best[1]]))) best = [i, j];
	const mu = scale(add(lam[best[0]], lam[best[1]]), 0.5);
	const other = lam[3 - best[0] - best[1]];
	const shift = (z: Complex) => madd(Wn, mscale(identity(), scale(z, -1)));
	return fnorm(mmul(shift(mu), shift(other))) < Math.sqrt(tol) ? 'D' : 'II';
}

// --- null vectors and directions ------------------------------------------------------------------------------------

/** m(z) = (1 - z^2, i(1 + z^2), -2z): every complex null vector, up to scale, by its point z on the sky. */
export function nullVectorAt(z: Complex): CVec3 {
	const z2 = mul(z, z);
	return [sub(cx(1), z2), mul(cx(0, 1), add(cx(1), z2)), scale(z, -2)];
}

/** The unit propagation direction carried by a complex null vector: Re(i m x m*) / |m|^2. */
export function direction(m: CVec3): Vec3 {
	const mc = m.map(conj) as CVec3;
	const q = ccross(m, mc).map((z) => mul(cx(0, 1), z).re) as Vec3;
	return unit(q);
}

/** A unit null vector m = (e1 + i e2)/sqrt 2 with e1 x e2 = k, so that direction(m) = k. */
export function nullFrame(k: Vec3): CVec3 {
	const kk = unit(k);
	const a: Vec3 = Math.abs(kk[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
	const e1 = unit(cross(a, kk));
	const e2 = cross(kk, e1);
	return [0, 1, 2].map((i) => cx(e1[i] / Math.SQRT2, e2[i] / Math.SQRT2)) as CVec3;
}

/** The fixed rotation the reference solves the star quartic in, so that no root falls at z = infinity. */
const TURN: number[][] = (() => {
	const w: Vec3 = [0.53, 0.21, 0.37]; // [w]x = [[0, -0.37, 0.21], [0.37, 0, -0.53], [-0.21, 0.53, 0]]
	const t = norm(w);
	const n = unit(w);
	const K = [
		[0, -n[2], n[1]],
		[n[2], 0, -n[0]],
		[-n[1], n[0], 0]
	];
	return [0, 1, 2].map((i) =>
		[0, 1, 2].map(
			(j) =>
				(i === j ? 1 : 0) +
				Math.sin(t) * K[i][j] +
				(1 - Math.cos(t)) * K[i].reduce((s, _, k) => s + K[i][k] * K[k][j], 0)
		)
	);
})();
const turn = (v: Vec3): Vec3 => [0, 1, 2].map((i) => dot(TURN[i] as Vec3, v)) as Vec3;
const TURN_T = transpose(realMat(TURN));
const TURN_M = realMat(TURN);

const M_POLY: Poly[] = [
	[cx(1), ZERO, cx(-1)],
	[cx(0, 1), ZERO, cx(0, 1)],
	[ZERO, cx(-2)]
];

function rootDirections(p: Poly, count: number): Vec3[] {
	const out = roots(p).map((z) => turn(direction(nullVectorAt(z))));
	// a root at infinity: m ~ (-1, i, 0)
	while (out.length < count) out.push(turn(direction([cx(-1), cx(0, 1), ZERO])));
	return out;
}

/** The four principal directions of the field, its stars (propagation convention): the roots of m(z)^T W m(z). */
export function stars(W: CMat3): Vec3[] {
	const A = mmul(mmul(TURN_T, W), TURN_M);
	let p: Poly = [ZERO];
	for (let i = 0; i < 3; i++)
		for (let j = 0; j < 3; j++) p = padd(p, pmul(pmul(M_POLY[i], [A[i][j]]), M_POLY[j]));
	return rootDirections(p, 4);
}

/** Light's two stars: the roots of m(z) . F = 0, F = E + icB. */
export function lightStars(F: CVec3): Vec3[] {
	const Ft = mvec(TURN_T, F);
	let p: Poly = [ZERO];
	for (let i = 0; i < 3; i++) p = padd(p, pmul(M_POLY[i], [Ft[i]]));
	return rootDirections(p, 2);
}

// --- fields of moving sources ---------------------------------------------------------------------------------------

/** exp(i eta [u]x), carrying a field from the rest frame of a body with velocity v (m/s) to the frame it moves in. */
export function boost(v: Vec3): CMat3 {
	const speed = norm(v);
	if (speed === 0) return identity();
	const u = unit(v);
	const eta = Math.atanh(speed / C);
	const K = [
		[0, -u[2], u[1]],
		[u[2], 0, -u[0]],
		[-u[1], u[0], 0]
	];
	const K2 = K.map((r, i) => r.map((_, j) => K[i].reduce((s, _, k) => s + K[i][k] * K[k][j], 0)));
	return cmat((i, j) =>
		cx((i === j ? 1 : 0) + (1 - Math.cosh(eta)) * K2[i][j], Math.sinh(eta) * K[i][j])
	);
}

function restSeparation(R: Vec3, v: Vec3): Vec3 {
	const speed = norm(v);
	if (speed === 0) return R;
	const u = unit(v);
	const gamma = 1 / Math.sqrt(1 - (speed / C) ** 2);
	const along = dot(R, u) * (gamma - 1);
	return [R[0] + along * u[0], R[1] + along * u[1], R[2] + along * u[2]];
}

export interface Body {
	/** kg */
	mass: number;
	/** present position, m */
	position: Vec3;
	/** m/s */
	velocity: Vec3;
}

/** W at x of point masses moving uniformly: each one's static tide at its rest-frame separation, boosted. */
export function movingMassesW(bodies: Body[], x: Vec3 = [0, 0, 0]): CMat3 {
	let W = zeroMat();
	for (const b of bodies) {
		const Rp = restSeparation(minus(x, b.position), b.velocity);
		const r = norm(Rp);
		const n = Rp.map((c) => c / r);
		const k = (G * b.mass) / r ** 3;
		const W0 = cmat((i, j) => cx(k * ((i === j ? 1 : 0) - 3 * n[i] * n[j])));
		const L = boost(b.velocity);
		W = madd(W, mmul(mmul(L, W0), transpose(L)));
	}
	return W;
}

export interface Charge {
	/** in units with E = q R / r^3 */
	charge: number;
	position: Vec3;
	velocity: Vec3;
}

/** F = E + icB at x of point charges moving uniformly (Heaviside's field), by the same boost. */
export function movingChargesF(charges: Charge[], x: Vec3 = [0, 0, 0]): CVec3 {
	let F: CVec3 = [ZERO, ZERO, ZERO];
	for (const q of charges) {
		const Rp = restSeparation(minus(x, q.position), q.velocity);
		const r3 = norm(Rp) ** 3;
		const F0: CVec3 = [
			cx((q.charge * Rp[0]) / r3),
			cx((q.charge * Rp[1]) / r3),
			cx((q.charge * Rp[2]) / r3)
		];
		const v = mvec(boost(q.velocity), F0);
		F = [add(F[0], v[0]), add(F[1], v[1]), add(F[2], v[2])];
	}
	return F;
}

/** W of a plane wave travelling along k with complex amplitude a: a m m^T, m = nullFrame(k). */
export function planeWaveW(k: Vec3, a: Complex): CMat3 {
	const m = nullFrame(k);
	return mscale(outer(m, m), a);
}

/** F = E + icB of a light wave travelling along k with complex amplitude a: a m. */
export function lightWaveF(k: Vec3, a: Complex): CVec3 {
	return nullFrame(k).map((z) => mul(z, a)) as CVec3;
}

// --- what one reading says ------------------------------------------------------------------------------------------

/** max |Im w| / max |w| over the eigenvalues: zero for any static scene however the pixel moves. */
export function motionAlarm(W: CMat3): number {
	const w = eigenvalues(W);
	return Math.max(...w.map((z) => Math.abs(z.im))) / Math.max(...w.map(abs));
}

/**
 * v_perp / c of a single body, exactly at any speed: the midpoint of its two double stars (W of type D).
 * v_perp is its velocity across the line from it to the pixel.
 */
export function bodyVelocity(W: CMat3): Vec3 {
	const s = stars(W);
	const d = (i: number, j: number) => norm(minus(s[i], s[j]));
	let j = 1;
	for (const k of [2, 3]) if (d(0, k) < d(0, j)) j = k;
	const rest = [1, 2, 3].filter((k) => k !== j);
	const a = unit([0, 1, 2].map((i) => s[0][i] + s[j][i]) as Vec3);
	const b = unit([0, 1, 2].map((i) => s[rest[0]][i] + s[rest[1]][i]) as Vec3);
	return [0, 1, 2].map((i) => 0.5 * (a[i] + b[i])) as Vec3;
}

/**
 * W = P diag(w) P^T with P = R0 exp(i K0): the eigenvalues, the real rotation to the field's axes, and the rapidity
 * vector theta = R0 axial(K0) of the frame in which the field is at rest. Needs three distinct eigenvalues.
 */
export function polar(W: CMat3): { w: Complex[]; R0: number[][]; theta: Vec3 } {
	const w = eigenvalues(W);
	// eigenvectors: the cross product of two rows of W - w, normalized so that p^T p = 1
	const cols = w.map((l) => {
		const M = madd(W, mscale(identity(), scale(l, -1)));
		const cands = [ccross(M[0], M[1]), ccross(M[0], M[2]), ccross(M[1], M[2])];
		const v = cands.reduce((best, c) => (cnorm(c) > cnorm(best) ? c : best));
		const n = csqrt(cdot(v, v));
		if (abs(n) < 1e-9 * cnorm(v)) throw new Error('W is not diagonalizable by a complex rotation');
		return v.map((z) => div(z, n)) as CVec3;
	});
	let P = cmat((i, j) => cols[j][i]);
	if (det3(P).re < 0) P = cmat((i, j) => (j === 0 ? scale(P[i][0], -1) : P[i][j]));
	// H = P^dagger P = exp(2 i K0), Hermitian and positive; K0 = Im(log H) / 2
	const H = mmul(adjoint(P), P);
	const { values, vectors } = hermitianEigen(H);
	const logH = cmat((i, j) =>
		values.reduce(
			(s, lam, k) => add(s, scale(mul(vectors[k][i], conj(vectors[k][j])), Math.log(lam))),
			ZERO
		)
	);
	const K0 = [0, 1, 2].map((i) => [0, 1, 2].map((j) => 0.25 * (logH[i][j].im - logH[j][i].im)));
	// exp(-i K0) for a real antisymmetric K0, by Rodrigues' formula at an imaginary angle
	const ax: Vec3 = [K0[2][1], K0[0][2], K0[1][0]];
	const t = norm(ax);
	let E = identity();
	if (t > 0) {
		const Kn = K0.map((r) => r.map((x) => x / t));
		const Kn2 = Kn.map((r, i) =>
			r.map((_, j) => Kn[i].reduce((s, _, k) => s + Kn[i][k] * Kn[k][j], 0))
		);
		E = cmat((i, j) =>
			cx((i === j ? 1 : 0) + (1 - Math.cosh(t)) * Kn2[i][j], -Math.sinh(t) * Kn[i][j])
		);
	}
	const R0 = mmul(P, E).map((r) => r.map((z) => z.re));
	const theta = [0, 1, 2].map((i) => dot(R0[i] as Vec3, ax)) as Vec3;
	return { w, R0, theta };
}

function cnorm(v: CVec3): number {
	return Math.sqrt(v.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0));
}
function det3(A: CMat3): Complex {
	return cdot(A[0], ccross(A[1], A[2]));
}

/** Velocity (units of c) of the frame in which the field is at rest, relative to the pixel. */
export function restFrameVelocity(W: CMat3): Vec3 {
	const { theta } = polar(W);
	const eta = norm(theta);
	return eta === 0 ? [0, 0, 0] : (theta.map((x) => (Math.tanh(eta) * x) / eta) as Vec3);
}

// --- separating waves -----------------------------------------------------------------------------------------------

/** The five complex coordinates of a symmetric trace-free matrix in the reference's basis (pixel.STF). */
const STF: number[][][] = [
	[
		[1, 0, 0],
		[0, -1, 0],
		[0, 0, 0]
	].map((r) => r.map((x) => x / Math.SQRT2)),
	[
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, -2]
	].map((r) => r.map((x) => x / Math.sqrt(6))),
	[
		[0, 1, 0],
		[1, 0, 0],
		[0, 0, 0]
	].map((r) => r.map((x) => x / Math.SQRT2)),
	[
		[0, 0, 1],
		[0, 0, 0],
		[1, 0, 0]
	].map((r) => r.map((x) => x / Math.SQRT2)),
	[
		[0, 0, 0],
		[0, 0, 1],
		[0, 1, 0]
	].map((r) => r.map((x) => x / Math.SQRT2))
];
export const vec5 = (W: CMat3): Complex[] =>
	STF.map((T) => W.flat().reduce((s, z, k) => add(s, scale(z, T[Math.floor(k / 3)][k % 3])), ZERO));
export const mat5 = (a: Complex[]): CMat3 =>
	cmat((i, j) => a.reduce((s, z, k) => add(s, scale(z, STF[k][i][j])), ZERO));

/** The steering vector of a direction: the five complex numbers of m m^T for a wave travelling along k (unit norm). */
export function steeringOf(k: Vec3): Complex[] {
	const m = nullFrame(k);
	return vec5(outer(m, m));
}

/** The matrix A with tr(A W) = 0 for every reading: its m^T A m vanishes on the sky at the waves' directions. */
export function annihilator(readings: CMat3[]): CMat3 {
	return mat5(smallestRightVector(readings.map(vec5)));
}

/** Four plane waves with any waveforms, from fixed directions, from a series of readings. */
export function fourWaves(readings: CMat3[]): Vec3[] {
	return stars(annihilator(readings));
}

/** Light's limit: two plane waves with any waveforms, from a series of readings F = E + icB. */
export function lightTwoWaves(readings: CVec3[]): Vec3[] {
	return lightStars(smallestRightVector(readings) as CVec3);
}
