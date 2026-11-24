// Shared numbers for the four diagrams of the tutorial's chapter 9.1 (tutorial/one-point/spin-two.md):
// tut-one-point-hero (the hero of Part 9, which chapter 9.4 reuses), tut-spin-weight-bars, tut-half-turn and
// tut-two-overlaps. Not a figure itself. Complex numbers are chapter 8.1's [re, im] (figs/tut-quantum-lib.js), a
// reading's stars chapter 8.4's (figs/tut-spin-lib.js: the roots of the paper's eq:stars, m(z)^T W m(z) = 0, mapped to
// the sky), all imported, not copied. Orange and blue mean a stretch and a squeeze only.
//
// `chapter(check)` asserts the chapter's statements that a figure draws or its caption prints, against the chapter's own
// text (fetched; outside its comments, except the interactive figure's `try` comment, which stays in the chapter and
// lists the bars at 60 degrees and the overlap 0.316), and computes the numbers behind them:
//  - the five tables about an axis k with e1 x e2 = k and m = (e1 + i e2)/sqrt 2: T2 = m m^T, T1 = m k^T + k m^T,
//    T0 = 3 k k^T - 1, T-1 = T1*, T-2 = T2*; each symmetric and trace-free; orthogonal under <T|U> = tr(T^dagger U),
//    with the squared lengths 1, 2, 6, 2, 1; and a turn R by psi about k (anticlockwise seen from the side k points
//    to) gives R m = e^{-i psi} m and R T_m R^T = e^{-i m psi} T_m, at several angles and about several axes;
//  - a mass on the axis: W = -(GM/r^3) T0, only m = 0, rank 3; the same mass along e1: 1 - 3 e1 e1^T =
//    T0/2 - (3/2)(T2 + T-2);
//  - a plane wave along k: E = E+ e+ + Ex ex and B_ij = eps_ipq k_p E_qj give W = E + iB = 2(E+ - i Ex) m m^T, rank 1,
//    W^2 = 0, and the weight shares about k are (0, 0, 0, 0, 1); about an axis 60 degrees away they are 0.0625,
//    0.2165, 0.4593, 0.6495, 0.5625 (m = -2 ... 2), their squares adding to one, the last cos^4 30 = 0.56, rank still 1;
//  - the half turn: a turn of the field by psi multiplies gravity's wave by e^{-2 i psi} (1, -1, 1 at 0, 90 and 180
//    degrees) and light's by e^{-i psi} (1, -i, -1), and the tide Re(e^{-2 i psi} m m^T) is the turned table
//    R Re(m m^T) R^T, a squeeze along e1 at psi = 0 (a positive entry squeezes);
//  - the overlaps: m1 = (1, i, 0)/sqrt 2, m2 = (cos t, i, -sin t)/sqrt 2: m1* . m2 = cos^2(t/2), light's overlap
//    |m1* . m2|^2 = cos^4(t/2) and gravity's |<m1 m1^T|m2 m2^T>|^2 = cos^8(t/2): 0.87 and 0.76 at 30 degrees, 0.56 and
//    0.32 at 60, 0.25 and 0.063 at 90; the widths at half height 2 arccos(2^{-1/4}) = 65.5 and 2 arccos(2^{-1/8}) =
//    47.0 degrees, found also by bisection;
//  - the hero's two masses: the paper's fig:stars pair (reference/gravcam/figure_data.py, stars: masses 1000 and 450
//    at (-1.5, 0.3, 0) and (0.9, 1.1, 0.6), at rest), whose reading is the sum of their tides, sum M (1 - 3 n n^T)/r^3;
//    its four stars, four separate points (Petrov type I), equal to those of reference/results/figures/stars.json; and
//    1 - 6 J^2 / I^3 = 0.55, the paper's number for them.
import { cx, add, mul, conj, scale, abs2, expi } from './tut-quantum-lib.js';
import { stars, clusters, len, dot, rad, deg } from './tut-spin-lib.js';

export { cx, add, mul, conj, scale, abs2, expi, stars, clusters, len, dot, rad, deg };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
const nearC = (a, b, tol = 1e-12) => near(a[0], b[0], tol) && near(a[1], b[1], tol);

// ---- vectors and tables, real ([x, y, z]) and complex ([[re, im] x 3]) ------------------------------------------
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const unit = (v) => { const l = len(v); return v.map((x) => x / l); };
const cvec = (v) => v.map((x) => (Array.isArray(x) ? x : cx(x)));
/** The table a b^T of two complex vectors. */
export const outer = (a, b) => cvec(a).map((x) => cvec(b).map((y) => mul(x, y)));
const tadd = (A, B) => A.map((r, i) => r.map((v, j) => add(v, B[i][j])));
const tscale = (A, c) => A.map((r) => r.map((v) => mul(v, Array.isArray(c) ? c : cx(c))));
const tconj = (A) => A.map((r) => r.map(conj));
const ident = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map((r) => r.map((v) => cx(v)));
/** The product of two complex tables. */
export const tmul = (A, B) => A.map((r, i) => [0, 1, 2].map((j) => r.reduce((s, a, k) => add(s, mul(a, B[k][j])), cx(0))));
const ttrans = (A) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[j][i]));
/** <T|U> = tr(T^dagger U) = T*_ij U_ij. */
export const bracket = (T, U) => T.flat().reduce((s, t, k) => add(s, mul(conj(t), U.flat()[k])), cx(0));
export const lengthOf = (T) => Math.sqrt(bracket(T, T)[0]);
const tnear = (A, B, tol = 1e-12) => A.flat().every((v, k) => nearC(v, B.flat()[k], tol));
const trace = (A) => add(add(A[0][0], A[1][1]), A[2][2]);

/** The frame of an axis k: e1, e2 across it with e1 x e2 = k, e1 chosen toward `hint` (a vector not along k). */
export function frame(k, hint = [1, 0, 0]) {
	k = unit(k);
	const e1 = unit(hint.map((h, i) => h - dot(hint, k) * k[i]));
	const e2 = cross(k, e1);
	return { k, e1, e2 };
}
/** The null vector m = (e1 + i e2)/sqrt 2 of a frame. */
export const nullOf = ({ e1, e2 }) => e1.map((a, i) => cx(a / Math.SQRT2, e2[i] / Math.SQRT2));
/** The five tables T_m about a frame's axis, keyed by m = -2 ... 2. */
export function tables(f) {
	const m = nullOf(f), k = f.k;
	const T2 = outer(m, m), T1 = tadd(outer(m, k), outer(k, m)), T0 = tadd(tscale(outer(k, k), 3), tscale(ident, -1));
	return { 2: T2, 1: T1, 0: T0, '-1': tconj(T1), '-2': tconj(T2) };
}
export const WEIGHTS = [-2, -1, 0, 1, 2];
/** Each weight's share of the reading W about a frame's axis: |c_m| sqrt<T_m|T_m> / |W|. */
export function shares(W, f) {
	const T = tables(f), size = lengthOf(W);
	return WEIGHTS.map((m) => {
		const c = bracket(T[m], W), n = bracket(T[m], T[m])[0];
		return Math.sqrt(abs2(c)) / n * Math.sqrt(n) / size;
	});
}
/** The rank of a complex 3 x 3 table: from its determinant and its 2 x 2 minors, against its size. */
export function rank(W, tol = 1e-10) {
	const s = lengthOf(W);
	if (s === 0) return 0;
	const minor = (i0, i1, j0, j1) => add(mul(W[i0][j0], W[i1][j1]), scale(mul(W[i0][j1], W[i1][j0]), -1));
	const det = add(add(mul(W[0][0], minor(1, 2, 1, 2)), scale(mul(W[0][1], minor(1, 2, 0, 2)), -1)), mul(W[0][2], minor(1, 2, 0, 1)));
	if (Math.sqrt(abs2(det)) > tol * s ** 3) return 3;
	for (const [i0, i1] of [[0, 1], [0, 2], [1, 2]]) for (const [j0, j1] of [[0, 1], [0, 2], [1, 2]])
		if (Math.sqrt(abs2(minor(i0, i1, j0, j1))) > tol * s * s) return 2;
	return 1;
}
/** The real turn by psi (radians) about the unit axis k (Rodrigues), anticlockwise seen from the side k points to. */
export function turn(k, psi) {
	const c = Math.cos(psi), s = Math.sin(psi), K = [[0, -k[2], k[1]], [k[2], 0, -k[0]], [-k[1], k[0], 0]];
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? c : 0) + s * K[i][j] + (1 - c) * k[i] * k[j]));
}
const rtable = (R) => R.map((r) => r.map((v) => cx(v)));
/** R T R^T for a real turn R and a complex table T. */
export const turned = (R, T) => tmul(tmul(rtable(R), T), ttrans(rtable(R)));
/** A plane wave's reading along k with the amplitudes E+ and Ex: E = E+ e+ + Ex ex, B_ij = eps_ipq k_p E_qj. */
export function waveReading(f, Ep = 1, Ex = 0) {
	const { k, e1, e2 } = f;
	const E = [0, 1, 2].map((i) => [0, 1, 2].map((j) => Ep * (e1[i] * e1[j] - e2[i] * e2[j]) + Ex * (e1[i] * e2[j] + e2[i] * e1[j])));
	// (k x a) b^T applied to the first index: B = [k]x E
	const B = [0, 1, 2].map((i) => [0, 1, 2].map((j) => [0, 1, 2].reduce((s, q) => s + cross(k, [0, 1, 2].map((r) => (r === q ? 1 : 0)))[i] * E[q][j], 0)));
	return { E, B, W: E.map((r, i) => r.map((e, j) => cx(e, B[i][j]))) };
}
/** The tide of masses M_a at the places p_a, seen from the origin (G = 1): sum M (1 - 3 n n^T)/r^3, as a complex
 * reading with no magnetic part. */
export function massReading(masses, places) {
	const E = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	masses.forEach((M, a) => {
		const p = places[a], r = len(p), n = p.map((x) => x / r);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) E[i][j] += (M / r ** 3) * ((i === j ? 1 : 0) - 3 * n[i] * n[j]);
	});
	return E.map((r) => r.map((v) => cx(v)));
}
/** The invariants I = tr W^2 and J = tr W^3. */
export const invariants = (W) => { const W2 = tmul(W, W); return { I: trace(W2), J: trace(tmul(W2, W)) }; };

// ---- the two overlaps --------------------------------------------------------------------------------------------
export const light = (t) => Math.cos(t / 2) ** 4;        // t in radians
export const gravity = (t) => Math.cos(t / 2) ** 8;
/** The angle (degrees) at which f falls to one half, by bisection on [0, 180]. */
export function halfAngle(f) {
	let a = 0, b = Math.PI;
	for (let i = 0; i < 200; i++) { const c = (a + b) / 2; if (f(c) > 0.5) a = c; else b = c; }
	return deg((a + b) / 2);
}

// ---- the hero's two masses: the paper's fig:stars pair -------------------------------------------------------------
export const PAIR = { masses: [1000, 450], places: [[-1.5, 0.3, 0], [0.9, 1.1, 0.6]] };

// the numbers the diagrams' comments in the chapter gave (they are replaced by the figures, so they are kept here)
export const BARS60 = ['0.0625', '0.2165', '0.4593', '0.6495', '0.5625'];
export const OVERLAPS = [[30, '0.76', '0.87'], [60, '0.32', '0.56'], [90, '0.063', '0.25']];   // degrees, gravity, light
export const WIDTHS = { light: '65.5', gravity: '47.0' };

// ---- the chapter's text and numbers --------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/one-point/spin-two.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const tryComment = (md.match(/<!-- try: square-of-vector[\s\S]*?-->/) ?? [''])[0].replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	check(tryComment.length > 0, 'the chapter has lost its try comment');
	// the four figures stand in the chapter under their names
	for (const [n, id] of [['tut-one-point-hero', 'one-point-hero'], ['tut-spin-weight-bars', 'spin-weight-bars'], ['tut-half-turn', 'half-turn'], ['tut-two-overlaps', 'two-overlaps']])
		has(`](${n}){#fig:${id}}`, `the figure ${n}`);

	// ---- the five tables and the turn
	has(String.raw`T_2 = \vect m\vect m^{\mathsf T}, \qquad T_1 = \vect m\hat k^{\mathsf T} + \hat k\vect m^{\mathsf T},\\ T_0 = 3\hat k\hat k^{\mathsf T} - 1,`, 'the tables');
	has(String.raw`So $R\vect m = e^{-i\psi}\vect m$ and $R\vect m^* = e^{i\psi}\vect m^*$.`, 'the turn of m');
	has(String.raw`$$\boxed{\;\begin{gathered}RT_mR^{\mathsf T} = e^{-im\psi}\,T_m,\\ m = 2, 1, 0, -1, -2 .\end{gathered}\;}`, 'the weights');
	has('with the squared lengths 1, 2, 6, 2 and 1', 'the squared lengths');
	has(String.raw`| the field, in fixed axes (this chapter and 8.4) | $e^{-im\psi}$ |`, 'the sign convention');
	const axes = [frame([0, 0, 1]), frame([0.3, -0.5, 0.81], [0.2, 1, 0.4]), frame([-0.7, 0.1, -0.2], [0, 0, 1])];
	for (const f of axes) {
		check(near(dot(cross(f.e1, f.e2), f.k), 1, 1e-12) && near(dot(f.e1, f.k), 0, 1e-12), 'a frame is not right-handed');
		const T = tables(f), m = nullOf(f);
		const lengths = WEIGHTS.map((w) => bracket(T[w], T[w])[0]);
		check(lengths.every((v, i) => near(v, [1, 2, 6, 2, 1][i], 1e-12)), `the squared lengths are ${lengths}`);
		for (const a of WEIGHTS) {
			check(tnear(T[a], ttrans(T[a])) && nearC(trace(T[a]), cx(0)), `T_${a} is not symmetric and trace-free`);
			for (const b of WEIGHTS) if (a !== b) check(nearC(bracket(T[a], T[b]), cx(0)), `T_${a} and T_${b} are not orthogonal`);
		}
		for (const psi of [0.4, Math.PI / 2, 2.1, Math.PI]) {
			const R = turn(f.k, psi);
			const Rm = R.map((r) => r.reduce((s, x, j) => add(s, scale(m[j], x)), cx(0)));
			check(Rm.every((v, i) => nearC(v, mul(expi(-psi), m[i]))), 'R m is not e^{-i psi} m');
			const Re1 = R.map((r) => dot(r, f.e1));
			check(near(dot(Re1, f.e2), Math.sin(psi)), 'the turn is not anticlockwise seen from the side k points to');
			for (const w of WEIGHTS) check(tnear(turned(R, T[w]), tscale(T[w], expi(-w * psi)), 1e-12), `R T_${w} R^T is not e^{-i ${w} psi} T_${w}`);
		}
	}
	// ---- a mass on the axis, and across it
	has(String.raw`so $\curv{\mathcal W} = -(G\matter M/r^3)\,T_0$: weight 0 alone`, 'the mass on the axis');
	has(String.raw`$1 - 3\vect e_1\vect e_1^{\mathsf T} = \tfrac12T_0 - \tfrac32(T_2 + T_{-2})$`, 'the mass across the axis');
	const Z = frame([0, 0, 1]), TZ = tables(Z);
	const onAxis = massReading([1], [[0, 0, 1]]);
	check(tnear(onAxis, tscale(TZ[0], -1)), 'the mass on the axis is not -T0');
	const across = massReading([1], [[1, 0, 0]]);
	check(tnear(across, tadd(tscale(TZ[0], 0.5), tscale(tadd(TZ[2], TZ[-2]), -1.5))), 'the mass along e1 is not T0/2 - 3/2 (T2 + T-2)');
	const mass = { shares: shares(onAxis, Z), rank: rank(onAxis) };
	check(mass.shares.every((v, i) => near(v, i === 2 ? 1 : 0, 1e-12)) && mass.rank === 3, `the mass on the axis: ${mass.shares}, rank ${mass.rank}`);

	// ---- a wave along the axis, and tilted by 60 degrees
	has(String.raw`$$\boxed{\;\curv{\mathcal W} = 2(\curv\tE_+ - i\curv\tE_\times)\,\vect m\vect m^{\mathsf T},\;}$$`, 'the square');
	has('and a wave\'s reading has rank one', 'rank one');
	has('About an axis at 60° to the wave the same reading fills all five weights, and it still has rank one (Figure [](#fig:spin-weight-bars)).', 'the tilted wave');
	has(String.raw`The section on overlaps finds the share of the weight 2, $\cos^4(30°) = 0.56$.`, 'the share at 60 degrees');
	for (const [Ep, Ex] of [[1, 0], [0.3, -0.8]]) for (const f of axes) {
		const { W } = waveReading(f, Ep, Ex), m = nullOf(f);
		check(tnear(W, tscale(outer(m, m), cx(2 * Ep, -2 * Ex)), 1e-12), 'the wave is not 2(E+ - i Ex) m m^T');
		check(rank(W) === 1 && tnear(tmul(W, W), tscale(ident, 0), 1e-12), 'the wave is not of rank one with W^2 = 0');
	}
	const along = shares(waveReading(Z).W, Z);
	check(along.every((v, i) => near(v, i === 4 ? 1 : 0, 1e-12)), `the wave along the axis: ${along}`);
	const tilt = rad(60), f60 = frame([Math.sin(tilt), 0, Math.cos(tilt)], [Math.cos(tilt), 0, -Math.sin(tilt)]);
	check(near(f60.e2[1], 1, 1e-12), 'the tilted wave\'s e2 is not y');
	const W60 = waveReading(f60).W;
	const tilted = { shares: shares(W60, Z), rank: rank(W60) };
	check(tilted.shares.every((v, i) => v.toFixed(4) === BARS60[i]), `the bars at 60 degrees are ${tilted.shares}`);
	check(near(tilted.shares.reduce((s, v) => s + v * v, 0), 1, 1e-12), 'the squares of the shares do not add to one');
	check(near(tilted.shares[4], Math.cos(rad(30)) ** 4, 1e-12) && tilted.shares[4].toFixed(2) === '0.56', 'the share of the weight 2 is not cos^4 30');
	check(tilted.rank === 1, 'the tilted wave is not of rank one');
	check(tryComment.includes(`at 60° the gravity bars are ${BARS60.join(', ')} (m = −2 … 2)`), 'the try comment\'s bars');

	// ---- the half turn
	has(String.raw`So a turn by $\psi$ about the direction of travel multiplies light's wave by $e^{-i\psi}$ and gravity's by $e^{-2i\psi}$. A half turn, $\psi = \pi$, gives $-1$ for light and $+1$ for gravity (Figure [](#fig:half-turn)).`, 'the half turn');
	has(String.raw`At $t = 0$ the tide $\mathrm{Re}(e^{-i\omega t}\,\vect m\vect m^{\mathsf T})$ is $\tfrac12(\vect e_1\vect e_1^{\mathsf T} - \vect e_2\vect e_2^{\mathsf T})$, a squeeze along $\vect e_1$, because a positive entry of the tide squeezes`, 'the squeeze along e1');
	const halfTurn = [0, 90, 180].map((d) => {
		const psi = rad(d), R = turn(Z.k, psi), m = nullOf(Z), mm = outer(m, m);
		const g = expi(-2 * psi), l = expi(-psi);
		const tide = turned(R, mm.map((r) => r.map((v) => cx(v[0])))).map((r) => r.map((v) => v[0]));
		const want = tscale(mm, g).map((r) => r.map((v) => v[0]));
		check(tide.every((r, i) => r.every((v, j) => near(v, want[i][j], 1e-12))), `the turned tide is not Re(e^{-2 i psi} m m^T) at ${d}`);
		// light's E: Re of sqrt 2 e^{-i psi} m, which is R e1
		const E = m.map((v) => mul(scale(v, Math.SQRT2), l)[0]), Re1 = R.map((r) => dot(r, Z.e1));
		check(E.every((v, i) => near(v, Re1[i], 1e-12)), `light's E is not R e1 at ${d}`);
		return { deg: d, gravity: g, light: l, tide: [[tide[0][0], tide[0][1]], [tide[1][0], tide[1][1]]], E: [E[0], E[1]] };
	});
	const fmt = (z) => { const r = Math.round(z[0]), i = Math.round(z[1]); check(near(z[0], r, 1e-12) && near(z[1], i, 1e-12), 'a factor is not a whole number'); return i === 0 ? `${r}` : `${i < 0 ? '-' : ''}i`; };
	check(halfTurn.map((h) => fmt(h.gravity)).join() === '1,-1,1' && halfTurn.map((h) => fmt(h.light)).join() === '1,-i,-1', 'the factors');
	check(halfTurn[0].tide[0][0] > 0 && near(halfTurn[0].tide[0][0], 0.5) && near(halfTurn[0].tide[1][1], -0.5), 'the tide at 0 does not squeeze along e1');
	check(near(halfTurn[1].tide[0][0], -0.5) && near(halfTurn[2].tide[0][0], 0.5), 'the tide does not swap at 90 and return at 180');

	// ---- the overlaps
	has(String.raw`$\vect m_2 = (\cos\vartheta, i, -\sin\vartheta)/\sqrt2$`, 'm2');
	has(String.raw`$$\vect m_1^*\cdot\vect m_2 = \tfrac12(\cos\vartheta + 1) = \cos^2\frac\vartheta2 .$$`, 'the product');
	has(String.raw`$$\boxed{\;|\langle\vect m_1\vect m_1^{\mathsf T}|\vect m_2\vect m_2^{\mathsf T}\rangle|^2 = \cos^8\frac\vartheta2 .\;}$$`, 'the overlap of two squares');
	has('At 60° the readings of two gravitational waves overlap by 0.32, and the fields of two light waves by 0.56 (Figure [](#fig:two-overlaps)).', 'the overlaps at 60 degrees');
	has(String.raw`At $\vartheta = 0$ both overlaps are 1. At $\vartheta = 180°$ both are 0`, 'the limits');
	check(tryComment.includes('two waves 60° apart overlap 0.316 and 0.5625'), 'the try comment\'s overlaps');
	const m1 = [cx(Math.SQRT1_2), cx(0, Math.SQRT1_2), cx(0)];
	for (let d = 0; d <= 180; d += 7.5) {
		const t = rad(d), m2 = [cx(Math.cos(t) * Math.SQRT1_2), cx(0, Math.SQRT1_2), cx(-Math.sin(t) * Math.SQRT1_2)];
		const p = m1.reduce((s, a, i) => add(s, mul(conj(a), m2[i])), cx(0));
		check(nearC(p, cx(Math.cos(t / 2) ** 2)), 'm1* . m2 is not cos^2(t/2)');
		check(near(abs2(p), light(t)) && near(abs2(bracket(outer(m1, m1), outer(m2, m2))), gravity(t)), `the overlaps at ${d}`);
		const k2 = [Math.sin(t), 0, Math.cos(t)];
		check(near(dot(cross([Math.cos(t), 0, -Math.sin(t)], [0, 1, 0]), k2), 1, 1e-12), 'm2\'s axes do not have e1 x e2 = k2');
	}
	check(near(light(0), 1) && near(gravity(0), 1) && near(light(Math.PI), 0) && near(gravity(Math.PI), 0), 'the limits');
	for (const [d, g, l] of OVERLAPS) check(gravity(rad(d)).toPrecision(2) === g && light(rad(d)).toPrecision(2) === l, `the overlaps at ${d}`);
	check(gravity(rad(60)).toFixed(3) === '0.316' && light(rad(60)).toFixed(4) === '0.5625', 'the overlaps at 60 to the try comment\'s digits');
	const widths = { light: halfAngle(light), gravity: halfAngle(gravity) };
	check(near(widths.light, deg(2 * Math.acos(2 ** -0.25)), 1e-9) && near(widths.gravity, deg(2 * Math.acos(2 ** -0.125)), 1e-9), 'the half widths');
	check(widths.light.toFixed(1) === WIDTHS.light && widths.gravity.toFixed(1) === WIDTHS.gravity, `the half widths are ${widths.light}, ${widths.gravity}`);

	// ---- the hero's two masses, and the paper's static figure
	const data = await (await fetch('/reference/results/figures/stars.json')).json();
	check(JSON.stringify(data.pair) === JSON.stringify(PAIR.places) && JSON.stringify(data.pair_mass) === JSON.stringify(PAIR.masses), 'the pair is not fig:stars\'s');
	const Wpair = massReading(PAIR.masses, PAIR.places);
	const pairStars = clusters(stars(Wpair));
	check(pairStars.length === 4 && pairStars.every((s) => s.count === 1), 'the pair\'s stars are not four separate points');
	check(data.gravity.pair_type === 'I' && data.gravity.pair.length === 4, 'the paper\'s pair is not of type I');
	for (const [n] of data.gravity.pair) check(pairStars.some((s) => len(s.n.map((v, i) => v - n[i])) < 1e-5), `the paper's star ${n} is not one of ours`);
	const { I, J } = invariants(Wpair);
	check(near(I[1], 0) && near(J[1], 0), 'the static pair\'s invariants are not real');
	const speciality = 1 - (6 * J[0] ** 2) / I[0] ** 3;
	check(speciality.toFixed(2) === '0.55' && near(speciality, data.gravity.pair_speciality, 1e-5), `1 - 6 J^2/I^3 = ${speciality}`);
	// the pair's stars come in opposite pairs, because its reading is real
	for (const s of pairStars) check(pairStars.some((q) => len(q.n.map((v, i) => v + s.n[i])) < 1e-9), 'a star of the static pair has no opposite');

	return { mass, along, tilted, halfTurn, widths, pair: { stars: pairStars, speciality } };
}
