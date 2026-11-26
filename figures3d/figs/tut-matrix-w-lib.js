// Shared numbers for the three diagrams of the tutorial's section 9.3 (tutorial/one-point/the-matrix-w.md):
// tut-same-eigenvalues, tut-ten-regroup and tut-speedometer-gap. Not a figure itself. Complex numbers and 3 x 3 tables
// are section 9.2's (figs/tut-cxsym-lib.js, itself on section 8.1's [re, im]); the fig:stars pair, its reading and its
// eigenvalues are 9.2's too, all imported, not copied. Orange and blue mean a stretch and a squeeze only.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the chapter's boost, Lambda = exp(-i eta u.L) with (L_k)_ij = -eps_kij: u.L sends x to u x x; Lambda is summed
//    as a power series and agrees with 1 - i sinh(eta) K + (1 - cosh eta) K^2 (K = u.L); Lambda^T Lambda = 1, det 1;
//    at 0.6c along x (eta = ln 2) its rows are (1, 0, 0), (0, 1.25, 0.75i), (0, -0.75i, 1.25), the chapter's;
//  - the fig:stars pair at rest (masses 1 : 0.45 at (-1.5, 0.3, 0) and (0.9, 1.1, 0.6)): eigenvalues -0.537, 0.135,
//    0.402, I = 0.468, J = -0.0874, and |E|^2 + |B|^2 = sum |W_ij|^2 = 0.468 = sum w_a^2;
//  - a pixel moving through them at 0.6c along the unit vector of (0.30, 0.80, -0.52): W' = Lambda W Lambda^T is
//    complex, with the same I, J and eigenvalues, |E|^2 + |B|^2 = 2.27; the velocity 0.6c u = (0.180, 0.480, -0.312)c;
//    the boost back, Lambda^-1 W' Lambda^-T, returns the room's reading (the principal observer is the room);
//  - the regrouping, from the dimensions of the orbits of the complex rotations (6 real generators: three turns L_k
//    and three boosts -i L_k) through a reading: for gravity, the tangent [X, W] in the 10 real numbers of W has rank
//    6 (3 from the turns, 3 from the boosts), so 10 - 6 = 4 invariants, 10 = 4 + 3 + 3, and the stabiliser is zero
//    (one principal observer); for light, the tangent X F in the 6 real numbers of F = w n has rank 4 (2 from the
//    turns, 2 from the boosts), so 6 = 2 + 2 + 2; the counts of invariants the same in a turned and boosted frame;
//  - the speedometer's precision, sigma_v = c sigma_n / (sqrt 2 gap), for sigma_n = 10^-16 s^-2: 2.1 m/s at a gap of
//    10^-8 s^-2; the person (70 kg, 1 m): w = G M / r^3 = 4.67 x 10^-9 s^-2, eigenvalues -2w = -9.34 and w = +4.67
//    (twice) x 10^-9 s^-2, the gap 3w = 1.40 x 10^-8 s^-2 = 14.0 x 10^-9, read to 1.5 m/s; between the two equal
//    squeezes the gap is zero;
//  - the diagrams' comments' numbers (kept here, since the figures replace the comments), and, once a figure stands in
//    the chapter, its name and label there.
import { cx, add, mul, scale, conj, abs2, tmul, ttrans, tadd, tscale, ident, invariants, roots, massReading, PAIR, size, det, absC, sub, nearC } from './tut-cxsym-lib.js';

export { cx, add, mul, scale, conj, abs2, tmul, ttrans, tadd, tscale, ident, invariants, roots, massReading, PAIR, size, det, absC, sub, nearC };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
const unit = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
export const eps = (i, j, k) => ((i - j) * (j - k) * (k - i)) / 2;
/** The chapter's generators, (L_k)_ij = -eps_kij, as real 3 x 3 tables. */
export const GEN = [0, 1, 2].map((k) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => -eps(k, i, j))));
/** u.L, real. */
export const uL = (u) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => u.reduce((s, uk, k) => s + uk * GEN[k][i][j], 0)));
const rmul = (A, B) => A.map((r, i) => [0, 1, 2].map((j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
const ctab = (A) => A.map((r) => r.map((v) => (Array.isArray(v) ? v : cx(v))));
/** The chapter's boost Lambda = exp(-i eta u.L), closed form. */
export function boost(u, eta) {
	const K = uL(u), K2 = rmul(K, K), sh = Math.sinh(eta), ch = Math.cosh(eta);
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => cx((i === j ? 1 : 0) + (1 - ch) * K2[i][j], -sh * K[i][j])));
}
/** exp(A) of a complex table by its power series (for the check). */
function expSeries(A, terms = 60) {
	let term = ident(), sum = ident();
	for (let n = 1; n < terms; n++) { term = tscale(tmul(term, A), 1 / n); sum = tadd(sum, term); }
	return sum;
}
/** Lambda W Lambda^T. */
export const read = (L, W) => tmul(tmul(L, W), ttrans(L));
/** |E|^2 + |B|^2 = sum |W_ij|^2. */
export const sizeSq = (W) => W.flat().reduce((s, z) => s + abs2(z), 0);

// ---- the scene ------------------------------------------------------------------------------------------------------
export const BETA = 0.6;
export const ETA = Math.atanh(BETA);
export const HEADING = [0.30, 0.80, -0.52];       // the chapter's moving pixel's direction, before normalising
export const U_HAT = unit(HEADING);
export const ROOM = () => massReading(PAIR.masses, PAIR.places);
export const MOVING = () => read(boost(U_HAT, ETA), ROOM());

// ---- the speedometer, SI ----------------------------------------------------------------------------------------------
export const G = 6.674e-11, C = 299792458;
export const SIGMA_N = 1e-16;                      // s^-2
export const PERSON = 70, PERSON_R = 1;            // kg, m
export const sigmaV = (gap) => (C * SIGMA_N) / (Math.SQRT2 * gap);
export const GAP_RANGE = [1e-10, 1e-6];            // s^-2, the diagram's horizontal axis
export const SIGMA_RANGE = [1e-2, 1e3];            // m/s, its vertical axis

// ---- the regrouping: real ranks ---------------------------------------------------------------------------------------
/** The rank of real vectors (rows), by elimination with partial pivoting, against tol times the largest entry. */
export function rankOf(rows, tol = 1e-9) {
	const A = rows.map((r) => r.slice());
	const big = Math.max(...A.flat().map(Math.abs), 1e-300);
	let rank = 0;
	const n = A[0].length;
	for (let c = 0; c < n && rank < A.length; c++) {
		let p = rank;
		for (let i = rank + 1; i < A.length; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
		if (Math.abs(A[p][c]) <= tol * big) continue;
		[A[rank], A[p]] = [A[p], A[rank]];
		for (let i = 0; i < A.length; i++) if (i !== rank) {
			const f = A[i][c] / A[rank][c];
			for (let j = c; j < n; j++) A[i][j] -= f * A[rank][j];
		}
		rank++;
	}
	return rank;
}
/** The ten real numbers of a trace-free symmetric complex table: the five independent entries' real and imaginary
 * parts (W_33 follows from the trace). */
const tenOf = (W) => [[0, 0], [1, 1], [0, 1], [0, 2], [1, 2]].flatMap(([i, j]) => W[i][j]);
/** The orbit's tangent directions at W: the turns' [L_k, W] and the boosts' -i [L_k, W], each as ten real numbers. */
function gravityTangents(W) {
	const turns = GEN.map((Lk) => { const L = ctab(Lk); return tenOf(tadd(tmul(L, W), tscale(tmul(W, L), -1))); });
	const boosts = GEN.map((Lk) => { const L = tscale(ctab(Lk), cx(0, -1)); return tenOf(tadd(tmul(L, W), tscale(tmul(W, L), -1))); });
	return { turns, boosts };
}
/** For light: the tangents L_k F and -i L_k F, each as six real numbers. */
function lightTangents(F) {
	const app = (L, v) => L.map((r) => r.reduce((s, a, k) => add(s, mul(a, v[k])), cx(0)));
	const turns = GEN.map((Lk) => app(ctab(Lk), F).flat());
	const boosts = GEN.map((Lk) => app(tscale(ctab(Lk), cx(0, -1)), F).flat());
	return { turns, boosts };
}
/** The counts: total, invariants, turns' share (angles), boosts' share (velocity), for gravity and light. */
export function counts(W, F) {
	const g = gravityTangents(W), l = lightTangents(F);
	const gT = rankOf(g.turns), gB = rankOf(g.boosts), gAll = rankOf([...g.turns, ...g.boosts]);
	const lT = rankOf(l.turns), lB = rankOf(l.boosts), lAll = rankOf([...l.turns, ...l.boosts]);
	return {
		gravity: { total: 10, invariants: 10 - gAll, angles: gT, velocity: gAll - gT, boostsAlone: gB },
		light: { total: 6, invariants: 6 - lAll, angles: lT, velocity: lAll - lT, boostsAlone: lB }
	};
}

// ---- the numbers of the diagrams' comments, which the figures replace ---------------------------------------------------
export const COMMENT = {
	eigen: ['-0.537', '0.135', '0.402'], I: '0.468', J: '-0.0874', size: ['0.468', '2.27'],
	gravity: '10 = 4 + 3 + 3', light: '6 = 2 + 2 + 2',
	sigmaAt: [['1e-8', '2.1'], ['1.40e-8', '1.5']], person: ['-9.34', '4.67'], personGap: '14.0'
};
export const FIGURES = [['tut-same-eigenvalues', 'same-eigenvalues'], ['tut-ten-regroup', 'ten-regroup'], ['tut-speedometer-gap', 'speedometer-gap']];

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/one-point/the-matrix-w.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	// each diagram stands in the chapter, as its figure or (before it is drawn in) as its comment
	for (const [n, id] of FIGURES) {
		const drawn = flat.includes(`](${n}){#fig:${id}}`), planned = comments.some((c) => c.includes(`diagram: ${n} `));
		check(drawn !== planned, `the diagram ${n} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) has(`(Figure [](#fig:${id}))`, `a pointer to fig:${id}`);
	}
	const comment = (n) => comments.find((c) => c.includes(`diagram: ${n} `)) ?? null;

	// ---- the boost
	has('$\\sym{complex-boost}{\\Lambda} = \\exp(-i\\obs\\eta\\,\\hat u\\cdot\\mathbf L)$ built from the generators $\\sym{generators}{(L_k)_{ij}} = -\\epsilon_{kij}$', 'the boost and the generators');
	has('At $0.6c$ along $x$, where $\\obs\\eta = \\ln2$, its rows are $(1, 0, 0)$, $(0, 1.25, 0.75i)$ and $(0, -0.75i, 1.25)$', 'the boost\'s rows');
	has('$$\\boxed{\\;\\curv{\\mathcal W}\' = \\Lambda\\,\\curv{\\mathcal W}\\,\\Lambda^{\\mathsf T}, \\qquad \\Lambda = \\exp(-i\\obs\\eta\\,\\hat u\\cdot\\mathbf L),\\;} \\label{eq:rule}$$', 'the rule');
	has('The table $\\hat u\\cdot\\mathbf L$ sends a vector $\\vect x$ to $\\hat u\\times\\vect x$', 'u.L x = u x x');
	check(near(ETA, Math.LN2, 1e-15), 'artanh 0.6 is not ln 2');
	for (const u of [[1, 0, 0], U_HAT, unit([-0.4, 0.2, 0.9])]) {
		const K = uL(u), x = [0.3, -1.1, 0.7], Kx = K.map((r) => r[0] * x[0] + r[1] * x[1] + r[2] * x[2]);
		const ux = [u[1] * x[2] - u[2] * x[1], u[2] * x[0] - u[0] * x[2], u[0] * x[1] - u[1] * x[0]];
		check(Kx.every((v, i) => near(v, ux[i], 1e-14)), 'u.L x is not u x x');
		for (const eta of [0.3, ETA, 1.4]) {
			const L = boost(u, eta), Ls = expSeries(tscale(ctab(K), cx(0, -eta)));
			check(size(tadd(L, tscale(Ls, -1))) < 1e-13, 'the closed form of Lambda is not the series exp(-i eta u.L)');
			check(size(tadd(tmul(ttrans(L), L), tscale(ident(), -1))) < 1e-13 && nearC(det(L), cx(1), 1e-13), 'Lambda is not a complex rotation');
		}
	}
	{
		const L = boost([1, 0, 0], Math.LN2);
		const want = [[cx(1), cx(0), cx(0)], [cx(0), cx(1.25), cx(0, 0.75)], [cx(0), cx(0, -0.75), cx(1.25)]];
		check(size(tadd(L, tscale(want, -1))) < 1e-14, 'the boost at 0.6c along x does not have the chapter\'s rows');
	}

	// ---- the room at rest and the moving pixel
	has('Two masses in the ratio $1 : 0.45$ have the eigenvalues $-0.537$, $0.135$ and $0.402$ in the scene\'s units', 'the pair\'s eigenvalues');
	has('A pixel moving through them at $0.6c$ along the unit vector of $(0.30, 0.80, -0.52)$ reads a table with complex entries and the same three real eigenvalues', 'the moving pixel');
	has('returns the pixel\'s own velocity, $(0.180, 0.480, -0.312)\\,c$', 'the velocity');
	has('Its $|\\curv\\tE|^2 + |\\curv\\tB|^2$ is $2.27$, and the principal observer\'s is $0.468 = \\sum_a\\curv w_a^2$, the least value', 'the sizes');
	has('A pixel measures its real part from the drift of its free balls and its imaginary part from the turning of its gyroscopes', 'the free balls and the gyroscopes');
	const room = ROOM(), moving = MOVING();
	const iRoom = invariants(room), iMoving = invariants(moving);
	const wRoom = roots(iRoom), wMoving = roots(iMoving);
	check(wRoom.every((z) => Math.abs(z[1]) < 1e-12) && wRoom.map((z) => z[0].toFixed(3)).join() === COMMENT.eigen.join(), `the room's eigenvalues ${wRoom}`);
	wMoving.forEach((z, i) => check(nearC(z, wRoom[i], 1e-10), `the moving pixel's eigenvalue ${i + 1} is ${z}`));
	for (const z of wMoving) check(absC(det(tadd(moving, tscale(ident(), scale(z, -1))))) < 1e-10, 'an eigenvalue is not one of Lambda W Lambda^T');
	check(nearC(iRoom.I, iMoving.I, 1e-12) && nearC(iRoom.J, iMoving.J, 1e-12), 'I and J change with the motion');
	check(iRoom.I[0].toFixed(3) === COMMENT.I && iRoom.J[0].toFixed(4) === COMMENT.J && Math.abs(iRoom.I[1]) + Math.abs(iRoom.J[1]) < 1e-15, `I = ${iRoom.I}, J = ${iRoom.J}`);
	const sizes = [sizeSq(room), sizeSq(moving)];
	const sumW2 = wRoom.reduce((s, z) => s + abs2(z), 0);
	check(near(sizes[0], sumW2, 1e-12) && sizes.map((s, i) => s.toFixed(i ? 2 : 3)).join() === COMMENT.size.join(), `the sizes ${sizes}`);
	check(Math.max(...moving.flat().map((z) => Math.abs(z[1]))) > 0.1, 'the moving pixel\'s reading has no magnetic part');
	const v = U_HAT.map((x) => BETA * x);
	check(v.map((x) => x.toFixed(3)).join() === '0.180,0.480,-0.312', `the velocity ${v}`);
	{
		const back = read(boost(U_HAT, -ETA), moving);
		check(size(tadd(back, tscale(room, -1))) < 1e-13, 'the boost back does not return the room\'s reading');
	}
	const c1 = comment('tut-same-eigenvalues');
	if (c1) {
		check(c1.includes('"w = −0.537, 0.135, 0.402", with "I = 0.468, J = −0.0874"'), 'the first comment\'s numbers');
		check(c1.includes('|𝓔|² + |𝓑|² from 0.468 to 2.27') && c1.includes('pixel moving at 0.6c'), 'the first comment\'s sizes');
	}

	// ---- the regrouping
	has('So the ten numbers are four in the eigenvalues, three in $R_0$ and three in $\\obs\\eta\\hat u$: $10 = 4 + 3 + 3$', 'the count');
	has('two components of the sensor\'s velocity across $\\hat n$: $6 = 2 + 2 + 2$', 'light\'s count');
	has('The eigenvalues are three complex numbers adding to zero (the table has no trace), so two are free: four real numbers that no observer can change', 'the four invariants');
	has('$$\\boxed{\\;\\obs{\\vect v} = c\\tanh\\obs\\eta\\;R_0\\hat u ,\\;} \\label{eq:velocity}$$', 'the velocity of the principal observer');
	const D = wRoom.map((z, i) => [0, 1, 2].map((j) => (i === j ? z : cx(0))));
	const w0 = cx(0.7, 0.2), Fn = [cx(0), cx(0), w0];                      // light: F = w n, n = z, in its own frame
	const R = (() => { const a = 0.7, b = -0.4; const Rz = [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]], Rx = [[1, 0, 0], [0, Math.cos(b), -Math.sin(b)], [0, Math.sin(b), Math.cos(b)]]; return ctab(rmul(Rz, Rx)); })();
	const B = boost(unit([0.2, -0.5, 0.8]), 0.45);
	const P = tmul(B, R);
	const Fp = P.map((r) => r.reduce((s, a, k) => add(s, mul(a, Fn[k])), cx(0)));
	// in the principal frame (W = D, F = w n) the turns move the axes and the boosts the velocity; in any other frame
	// the number of invariants is the same, and so is the size of the orbit (no boost or turn is lost or gained)
	const regroup = [counts(D, Fn), counts(read(P, D), Fp), counts(moving, Fp)];
	const c = regroup[0];
	check(c.gravity.invariants === 4 && c.gravity.angles === 3 && c.gravity.velocity === 3 && c.gravity.boostsAlone === 3, `gravity's count ${JSON.stringify(c.gravity)}`);
	check(c.light.invariants === 2 && c.light.angles === 2 && c.light.velocity === 2 && c.light.boostsAlone === 2, `light's count ${JSON.stringify(c.light)}`);
	check(`${c.gravity.total} = ${c.gravity.invariants} + ${c.gravity.angles} + ${c.gravity.velocity}` === COMMENT.gravity, 'gravity\'s sum');
	check(`${c.light.total} = ${c.light.invariants} + ${c.light.angles} + ${c.light.velocity}` === COMMENT.light, 'light\'s sum');
	for (const o of regroup.slice(1)) check(o.gravity.invariants === 4 && o.light.invariants === 2, `the counts in another frame: ${JSON.stringify(o)}`);
	const c2 = comment('tut-ten-regroup');
	if (c2) check(c2.includes('"10 = 4 + 3 + 3"') && c2.includes('"6 = 2 + 2 + 2"') && c2.includes('v = c tanh η R₀û'), 'the second comment\'s counts');

	// ---- the speedometer
	has('$$\\boxed{\\;\\sigma_v = \\frac{c\\,\\sigma_n}{\\sqrt2\\,|\\curv\\lambda_b - \\curv\\lambda_c|} .\\;} \\label{eq:precision}$$', 'the precision');
	has('A tide whose eigenvalues are $10^{-8}\\unit{s^{-2}}$ apart, read to one part in $10^8$, so $\\sigma_n = 10^{-16}\\unit{s^{-2}}$, gives $\\sigma_v = 3.00 \\times 10^8 \\times 10^{-16}/(1.414 \\times 10^{-8}) = 2.1\\unit{m\\,s^{-1}}$', 'the walking pace');
	has('Beside the person a metre away the eigenvalues are $-2\\curv w$, $\\curv w$ and $\\curv w$, with $\\curv w = G\\matter M/r^3 = 4.67 \\times 10^{-9}\\unit{s^{-2}}$', 'the person\'s eigenvalues');
	has('The two components across the line to the person face the gap $3\\curv w = 1.40 \\times 10^{-8}\\unit{s^{-2}}$ and are read to $1.5\\unit{m\\,s^{-1}}$. The component along the line faces the gap between the two equal squeezes, zero.', 'the person\'s gaps');
	has('For the person of 70 kg a metre away', 'the person');
	const w = (G * PERSON) / PERSON_R ** 3;
	const person = { w, stretch: -2 * w, squeeze: w, gap: 3 * w, along: 0 };
	check((w / 1e-9).toFixed(2) === COMMENT.person[1] && (person.stretch / 1e-9).toFixed(2) === COMMENT.person[0], `the person's eigenvalues ${person.stretch}, ${w}`);
	check((person.gap / 1e-9).toFixed(1) === COMMENT.personGap && (person.gap / 1e-8).toFixed(2) === '1.40', `the person's gap ${person.gap}`);
	check(near(person.stretch + 2 * person.squeeze, 0, 1e-24), 'the person\'s tide has a trace');
	const at = COMMENT.sigmaAt.map(([g]) => sigmaV(Number(g)));
	check(at[0].toFixed(1) === COMMENT.sigmaAt[0][1] && sigmaV(person.gap).toFixed(1) === COMMENT.sigmaAt[1][1] && near(Number(COMMENT.sigmaAt[1][0]), Number(person.gap.toPrecision(3)), 1e-20), `sigma_v ${at}, ${sigmaV(person.gap)}`);
	check(near((3.00e8 * 1e-16) / (1.414 * 1e-8), sigmaV(1e-8), 0.01), 'the chapter\'s rounded c and sqrt 2');
	check(sigmaV(GAP_RANGE[0]) < SIGMA_RANGE[1] && sigmaV(GAP_RANGE[1]) > SIGMA_RANGE[0], 'the line leaves the axes');
	const c3 = comment('tut-speedometer-gap');
	if (c3) check(c3.includes('"gap 10⁻⁸: 2.1 m/s"') && c3.includes('3GM/r³ = 1.40 × 10⁻⁸: 1.5 m/s') && c3.includes('−9.34') && c3.includes('+4.67') && c3.includes('gap 14.0'), 'the third comment\'s numbers');

	return { room, moving, wRoom, wMoving, iRoom, sizes, v, regroup: regroup[0], person, sigmaAt: [sigmaV(1e-8), sigmaV(person.gap)] };
}
