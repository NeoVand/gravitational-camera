// Shared numbers for the three diagrams of the tutorial's chapter 9.2 (tutorial/one-point/complex-symmetric.md):
// tut-cx-eigen-plane, tut-cx-shape-tree and tut-cx-jordan-block. Not a figure itself. Complex numbers are chapter
// 8.1's [re, im] (figs/tut-quantum-lib.js), the sheet, strokes, labels and cropping those of chapters 6.1 to 8.7
// (figs/tut-pot-lib.js), the complex plane's thin axes, ticks and dots chapter 1.5b's (figs/tut-five-lib.js), all
// imported, not copied. Ink and the page's greys only: orange and blue mean a stretch and a squeeze, and are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the cubic: for a trace-free table, det(lambda - W) = lambda^3 - (1/2) I lambda - (1/3) J (eq:cubic), checked at
//    several lambda for every table below; its roots by Durand-Kerner, or, for a repeated one, the chapter's
//    w = -J/I (eq:repeated) and -2w;
//  - one mass, diag(1, 1, -2) in units of GM/r^3: I = 6, J = -6, 1 - 6J^2/I^3 = 0, w = 1, the cubic (lambda - 1)^2
//    (lambda + 2);
//  - the paper's fig:stars pair, masses 1 : 0.45 at (-1.5, 0.3, 0) and (0.9, 1.1, 0.6) (the places and masses read
//    from reference/gravcam/figure_data.py), W = sum m (1 - 3 n n^T)/r^3: eigenvalues -0.537, 0.135, 0.402,
//    I = 0.468, J = -0.0874, 1 - 6J^2/I^3 = 0.553, the discriminant (w1 - w2)^2 (w2 - w3)^2 (w3 - w1)^2 =
//    I^3/2 - 3J^2 = 0.0284 (the chapter's footnote);
//  - the same room read by a pixel moving at 0.6c along x: W' = Lambda W Lambda^T with Lambda = e^{iK}, K = eta times
//    the real antisymmetric generator about x, tanh eta = 0.6 (eta = ln 2), Lambda^T Lambda = 1; W' is complex, but
//    its I, J and eigenvalues are those of the room at rest;
//  - a spinning body: (1, 1, -2)(1 - 0.1 i)^{-3}, the paper's (r - i a cos theta)^{-3} at a cos theta / r = 0.1:
//    0.941 + 0.290i twice and -1.88 - 0.58i, all on the line through 0 at the phase 3 arctan 0.1 = 0.299 rad (near
//    the paper's 3 a cos theta / r = 0.3), 1 - 6J^2/I^3 = 0;
//  - the six shapes: the chapter's example of each (two masses, one mass, the mass with the weak wave along its line,
//    w = 0.125 and c2 = 0.05, the paper's type III rows, the wave N = 2 m m^T, and zero), each sent down the tree's
//    questions to its own leaf; each annihilated by its minimal polynomial and by no polynomial of lower degree of the
//    same kind; ranks 3, 3, 3, 2, 1, 0; the mass-and-wave product (W - w)(W + 2w) = 3 w c2 m m^T, entries 0.0094;
//  - the two tables of the Jordan diagram: diag(w, w, -2w) and the same with a 1 in row 1, column 2: the same
//    characteristic polynomial, I and J; (T - w)(T + 2w) zero for the first and 3w times the unit in row 1, column 2
//    for the second; eigenvectors e1, e2, e3 for the first and only e1 and e3 for the second.
import { cx, add, mul, conj, scale, abs2 } from './tut-quantum-lib.js';

export { cx, add, mul, conj, scale, abs2 };

export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const div = (a, b) => { const d = abs2(b); return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
export const absC = (a) => Math.sqrt(abs2(a));
export const argC = (a) => Math.atan2(a[1], a[0]);
export const nearC = (a, b, tol) => absC(sub(a, b)) <= tol;

// ---- tables of complex numbers, 3 x 3 -----------------------------------------------------------------------------
export const ctable = (R) => R.map((row) => row.map((x) => (Array.isArray(x) ? x : cx(x))));
export const tmul = (A, B) => A.map((r, i) => [0, 1, 2].map((j) => r.reduce((s, a, k) => add(s, mul(a, B[k][j])), cx(0))));
export const tadd = (A, B) => A.map((r, i) => r.map((a, j) => add(a, B[i][j])));
export const tscale = (A, s) => A.map((r) => r.map((a) => mul(a, Array.isArray(s) ? s : cx(s))));
export const ttrans = (A) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => A[j][i]));
export const ident = (s = cx(1)) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? s : cx(0))));
/** T - s, s a number standing for s times the identity. */
export const minus = (T, s) => tadd(T, ident(scale(s, -1)));
export const trace = (A) => add(add(A[0][0], A[1][1]), A[2][2]);
/** The largest size of an entry. */
export const size = (A) => Math.max(...A.flat().map(absC));
export const det = (A) => {
	const m = (i, j) => A[i][j];
	const t = (a, b, c) => mul(mul(a, b), c);
	return sub(add(add(t(m(0, 0), m(1, 1), m(2, 2)), t(m(0, 1), m(1, 2), m(2, 0))), t(m(0, 2), m(1, 0), m(2, 1))),
		add(add(t(m(0, 2), m(1, 1), m(2, 0)), t(m(0, 0), m(1, 2), m(2, 1))), t(m(0, 1), m(1, 0), m(2, 2))));
};
/** The rank, from the 3 x 3 determinant and the 2 x 2 minors, against `tol` times the size of the table. */
export function rank(A, tol = 1e-9) {
	const s = size(A);
	if (s === 0) return 0;
	if (absC(det(A)) > tol * s ** 3) return 3;
	for (const [i, k] of [[0, 1], [0, 2], [1, 2]]) for (const [j, l] of [[0, 1], [0, 2], [1, 2]]) {
		if (absC(sub(mul(A[i][j], A[k][l]), mul(A[i][l], A[k][j]))) > tol * s * s) return 2;
	}
	return 1;
}
export const invariants = (W) => { const W2 = tmul(W, W); return { I: trace(W2), J: trace(tmul(W2, W)) }; };
/** 1 - 6 J^2 / I^3. */
export const speciality = ({ I, J }) => sub(cx(1), div(scale(mul(J, J), 6), mul(mul(I, I), I)));
/** The cubic lambda^3 - I lambda / 2 - J / 3 at lambda. */
export const cubic = ({ I, J }, l) => sub(sub(mul(mul(l, l), l), mul(scale(I, 0.5), l)), scale(J, 1 / 3));

/** The three roots of lambda^3 - I lambda / 2 - J / 3 by Durand-Kerner (for distinct roots), sorted by real part. */
export function roots(inv) {
	let z = [cx(0.4, 0.9), cx(-0.65, 0.42), cx(0.13, -0.77)];
	const s = Math.max(Math.sqrt(absC(inv.I)), Math.cbrt(absC(inv.J)), 1e-300);
	z = z.map((q) => scale(q, s));
	for (let it = 0; it < 500; it++) {
		z = z.map((zi, i) => {
			let d = cx(1);
			z.forEach((zj, j) => { if (j !== i) d = mul(d, sub(zi, zj)); });
			return sub(zi, div(cubic(inv, zi), d));
		});
	}
	return z.sort((a, b) => a[0] - b[0]);
}

// ---- the readings -----------------------------------------------------------------------------------------------
/** The tide of masses at places (from the pixel), sum m (1 - 3 n n^T)/r^3, as a complex table. */
export function massReading(masses, places) {
	const W = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	masses.forEach((m, a) => {
		const p = places[a], r = Math.hypot(...p), n = p.map((x) => x / r);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) W[i][j] += (m * ((i === j ? 1 : 0) - 3 * n[i] * n[j])) / r ** 3;
	});
	return ctable(W);
}
export const ONE_MASS = [1, 1, -2];                       // units of GM/r^3, the mass on z
export const PAIR = { masses: [1, 0.45], places: [[-1.5, 0.3, 0], [0.9, 1.1, 0.6]] };
export const BETA = 0.6;                                  // the moving pixel's speed, c
export const SPIN = 0.1;                                  // a cos theta / r of the spinning body (exaggerated)
export const M = [cx(Math.SQRT1_2), cx(0, Math.SQRT1_2), cx(0)];   // m = (1, i, 0)/sqrt 2
export const mmT = () => M.map((a) => M.map((b) => mul(a, b)));
export const WAVE_W = 0.125, WAVE_C2 = 0.05;              // the chapter's mass and weak wave along its line
export const TYPE_III = ctable([[0, 0, 1], [0, 0, cx(0, 1)], [1, cx(0, 1), 0]]);

/** The boost e^{iK} along x of rapidity eta: K = eta [[0,0,0],[0,0,-1],[0,1,0]], so that (iK)^2 = eta^2 P (P the
 * projector on y, z) and e^{iK} = (1 - P) + cosh(eta) P + i sinh(eta) K / eta. */
export function boostX(eta) {
	const ch = Math.cosh(eta), sh = Math.sinh(eta);
	return [[cx(1), cx(0), cx(0)], [cx(0), cx(ch), cx(0, -sh)], [cx(0), cx(0, sh), cx(ch)]];
}

/** The six shapes' examples, as tables. */
export function examples() {
	const mass = ctable([[1, 0, 0], [0, 1, 0], [0, 0, -2]]);
	const pair = massReading(PAIR.masses, PAIR.places);
	const massWave = tadd(tscale(mass, WAVE_W), tscale(mmT(), WAVE_C2));
	const wave = tscale(mmT(), 2);
	const zero = ctable([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
	return { I: pair, D: mass, II: massWave, III: TYPE_III, N: wave, O: zero };
}

/** The tree's questions, asked of W with the tolerance tol (relative to the size of W): the leaf it reaches and the
 * answers on the way. */
export function sort(W, tol = 1e-9) {
	const s = size(W), path = [];
	if (s === 0) { path.push('I3=6J2:yes', 'I=J=0:yes', 'W2=0:yes', 'W=0:yes'); return { leaf: 'O', path }; }
	const { I, J } = invariants(W);
	const gap = absC(sub(mul(mul(I, I), I), scale(mul(J, J), 6)));
	if (gap > tol * s ** 6) { path.push('I3=6J2:no'); return { leaf: 'I', path }; }
	path.push('I3=6J2:yes');
	if (absC(I) > tol * s * s) {
		path.push('I=J=0:no');
		const w = scale(div(J, I), -1);
		const P = tmul(minus(W, w), minus(W, scale(w, -2)));
		if (size(P) <= tol * s * s) { path.push('(W-w)(W+2w)=0:yes'); return { leaf: 'D', path, w }; }
		path.push('(W-w)(W+2w)=0:no');
		return { leaf: 'II', path, w, P };
	}
	path.push('I=J=0:yes');
	if (size(tmul(W, W)) > tol * s * s) { path.push('W2=0:no'); return { leaf: 'III', path }; }
	path.push('W2=0:yes', 'W=0:no');
	return { leaf: 'N', path };
}

/** The product of the factors (W - lambda) over the listed numbers. */
export const product = (W, ls) => ls.reduce((P, l) => tmul(P, minus(W, l)), ident());

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/one-point/complex-symmetric.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const near = (a, b, tol) => Math.abs(a - b) <= tol;

	// ---- the cubic and the repeated root
	has('$$\\boxed{\\;\\begin{gathered}\\det(\\lambda - \\curv{\\mathcal W}) = \\lambda^3 - \\tfrac12I\\lambda - \\tfrac13J,\\\\ \\det\\curv{\\mathcal W} = \\tfrac13J .\\end{gathered}\\;} \\label{eq:cubic}$$', 'the cubic');
	has('$$\\boxed{\\;1 - \\frac{6J^2}{I^3} = 0, \\qquad \\curv w = -\\frac JI ,\\;} \\label{eq:repeated}$$', 'the repeated eigenvalue');
	has('The eigenvalues add up to the trace', 'the trace');

	// ---- one mass
	has('$\\curv{\\mathcal W} = (G\\matter M/r^3)\\,\\mathrm{diag}(1, 1, -2)$, so $I = 6(G\\matter M/r^3)^2$, $J = -6(G\\matter M/r^3)^3$', 'one mass');
	has('In units of $G\\matter M/r^3$ the cubic is $\\lambda^3 - 3\\lambda + 2 = (\\lambda - 1)^2(\\lambda + 2)$', 'the mass\'s cubic');
	const one = examples().D, oneInv = invariants(one);
	check(nearC(oneInv.I, cx(6), 1e-12) && nearC(oneInv.J, cx(-6), 1e-12), 'one mass: I and J');
	check(absC(speciality(oneInv)) < 1e-12 && nearC(scale(div(oneInv.J, oneInv.I), -1), cx(1), 1e-12), 'one mass: 1 - 6J^2/I^3 and w');
	for (const l of [cx(0.3), cx(-1.1, 0.4), cx(2, -1)]) {
		check(nearC(cubic(oneInv, l), mul(mul(sub(l, cx(1)), sub(l, cx(1))), add(l, cx(2))), 1e-12), 'one mass: the cubic is not (l - 1)^2 (l + 2)');
		check(nearC(cubic(oneInv, l), det(minus(one, l)).map((x) => -x), 1e-12), 'one mass: the cubic is not det(l - W)');
	}

	// ---- the pair of the paper's fig:stars
	const fd = await (await fetch('/reference/gravcam/figure_data.py')).text();
	check(fd.includes('pair = ([1e3, 0.45e3], [np.array([-1.5, 0.3, 0.0]), np.array([0.9, 1.1, 0.6])])'), 'the pair is not figure_data.py\'s');
	has('has two masses in the ratio $1 : 0.45$, at $(-1.5, 0.3, 0)$ and $(0.9, 1.1, 0.6)$ in the figure\'s units, from the pixel', 'the pair');
	has('They give the eigenvalues $-0.537$, $0.135$ and $0.402$ in the figure\'s units, $I = 0.468$ and $J = -0.0874$, so $1 - 6J^2/I^3 = 0.553$: the paper\'s 0.55', 'the pair\'s numbers');
	const pair = examples().I, pairInv = invariants(pair);
	const pairW = roots(pairInv);
	check(pairW.every((z) => Math.abs(z[1]) < 1e-12), 'the pair\'s eigenvalues are not real');
	check(pairW.map((z) => z[0].toFixed(3)).join() === '-0.537,0.135,0.402', `the pair's eigenvalues ${pairW.map((z) => z[0])}`);
	check(pairInv.I[0].toFixed(3) === '0.468' && pairInv.J[0].toFixed(4) === '-0.0874' && speciality(pairInv)[0].toFixed(3) === '0.553', 'the pair\'s I, J or 1 - 6J^2/I^3');
	const disc = pairW.reduce((p, z, i) => mul(p, mul(sub(z, pairW[(i + 1) % 3]), sub(z, pairW[(i + 1) % 3]))), cx(1));
	const discInv = sub(scale(mul(mul(pairInv.I, pairInv.I), pairInv.I), 0.5), scale(mul(pairInv.J, pairInv.J), 3));
	check(nearC(disc, discInv, 1e-14) && disc[0].toFixed(4) === '0.0284', `the pair's discriminant ${disc}`);
	has('for the two masses below both are 0.0284', 'the discriminant');
	// each root is an eigenvalue: det(W - w) = 0
	for (const z of pairW) check(absC(det(minus(pair, z))) < 1e-12, 'a root of the cubic is not an eigenvalue of the pair');

	// ---- the moving pixel: Lambda W Lambda^T, complex, with the room's eigenvalues
	const eta = Math.atanh(BETA);
	check(near(eta, Math.LN2, 1e-15), 'tanh eta = 0.6 is not eta = ln 2');
	has('$\\tanh\\obs\\eta = 0.6$, so $\\obs\\eta = \\ln 2$', 'the rapidity');
	has('An observer turned or moving reads $P\\curv{\\mathcal W}P^{\\mathsf T}$ with $P$ a complex rotation', 'the moving reading');
	has('The cubic, and with it $I$ and $J$, is the same for every observer', 'the invariance');
	const L = boostX(eta);
	check(size(tadd(tmul(ttrans(L), L), tscale(ident(), -1))) < 1e-12 && nearC(det(L), cx(1), 1e-12), 'the boost is not a complex rotation');
	const moved = tmul(tmul(L, pair), ttrans(L));
	check(Math.max(...moved.flat().map((z) => Math.abs(z[1]))) > 0.05, 'the moving pixel\'s reading is not complex');
	const movedInv = invariants(moved), movedW = roots(movedInv);
	check(nearC(movedInv.I, pairInv.I, 1e-12) && nearC(movedInv.J, pairInv.J, 1e-12), 'the moving pixel\'s I and J are not the room\'s');
	movedW.forEach((z, i) => check(nearC(z, pairW[i], 1e-10), `the moving pixel's eigenvalue ${i + 1} is ${z}`));
	for (const z of movedW) check(absC(det(minus(moved, z))) < 1e-10, 'a moving eigenvalue is not an eigenvalue of Lambda W Lambda^T');

	// ---- the spinning body: (1, 1, -2)(1 - 0.1 i)^{-3}
	const f = div(cx(1), mul(mul(cx(1, -SPIN), cx(1, -SPIN)), cx(1, -SPIN)));
	const spin = ctable([[f, 0, 0], [0, f, 0], [0, 0, scale(f, -2)]]);
	const spinInv = invariants(spin);
	check(absC(speciality(spinInv)) < 1e-12, 'the spinning body has no repeated eigenvalue');
	const ws = scale(div(spinInv.J, spinInv.I), -1);
	check(nearC(ws, f, 1e-12), 'w = -J/I is not (1 - 0.1i)^{-3}');
	check(ws[0].toFixed(3) === '0.941' && ws[1].toFixed(3) === '0.290', `the spinning body's w ${ws}`);
	check(scale(ws, -2)[0].toFixed(2) === '-1.88' && scale(ws, -2)[1].toFixed(2) === '-0.58', `its -2w ${scale(ws, -2)}`);
	check(near(argC(ws), 3 * Math.atan(SPIN), 1e-12) && argC(ws).toFixed(3) === '0.299' && Math.abs(argC(ws) - 3 * SPIN) < 0.002, `its phase ${argC(ws)}`);
	check(near(argC(scale(ws, -2)), argC(ws) - Math.PI, 1e-12), '-2w is not on the line through w and 0');
	for (const l of [cx(0.2, 0.1), cx(-1, 0.5)]) check(nearC(cubic(spinInv, l), mul(mul(sub(l, ws), sub(l, ws)), add(l, scale(ws, 2))), 1e-12), 'the spinning body\'s cubic');
	const paper = await (await fetch('/paper/sections/08-one-pixel.tex')).text();
	check(paper.replace(/\s+/g, ' ').includes('proportional to $(r - ia\\cos\\vartheta)^{-3}$, as in Kerr\'s solution \\cite{Kerr1963}, so their phase, $3a\\cos\\vartheta/r$ for $a \\ll r$'), 'the paper\'s phase of a spinning body');
	check(paper.replace(/\s+/g, ' ').includes('if the eigenvalues are complex, something in the scene moves relative to the rest of it, or turns; the pixel\'s own motion cannot make them so'), 'the paper\'s test for motion');

	// ---- the six shapes and their minimal polynomials
	has('For a trace-free complex symmetric $3\\times3$ table this leaves six shapes', 'six shapes');
	has('a table is diagonalizable exactly when some product of factors $\\curv{\\mathcal W} - \\lambda$, with different numbers $\\lambda$, is zero', 'the test');
	has('For one mass it is $(\\lambda - \\curv w)(\\lambda + 2\\curv w)$', 'the mass\'s minimal polynomial');
	has('and [](#eq:cayley) reads $(\\curv{\\mathcal W} - \\curv w)^2(\\curv{\\mathcal W} + 2\\curv w) = 0$', 'type II\'s polynomial');
	has('**All eigenvalues zero and $\\curv{\\mathcal W}^2 \\neq 0$** (III): with $I = J = 0$, [](#eq:cayley) gives $\\curv{\\mathcal W}^3 = 0$', 'type III');
	has('**$\\curv{\\mathcal W} \\neq 0$ and $\\curv{\\mathcal W}^2 = 0$** (N): one plane wave, of rank one', 'type N');
	has('**$\\curv{\\mathcal W} = 0$** (O): no field', 'type O');
	has('A real symmetric table, the reading of a scene at rest, always has the shape I, D or O', 'the shapes at rest');
	has('**The paper\'s type III table**, with rows $(0, 0, 1)$, $(0, 0, i)$, $(1, i, 0)$', 'the type III rows');
	has('Both traces vanish, as for a wave, but the rank is two', 'type III\'s rank');
	has('With $\\curv w = 0.125$ and $\\curv c_2 = 0.05$, in any unit of tide, the product has entries of size $0.0094$', 'the mass and wave');
	has('each labelled here with the Petrov letter that chapter 9.4 explains', 'the Petrov letters');
	const ex = examples();
	const RANKS = { I: 3, D: 3, II: 3, III: 2, N: 1, O: 0 };
	const MINIMAL = {};
	for (const [leaf, W] of Object.entries(ex)) {
		const s = sort(W);
		check(s.leaf === leaf, `the example of ${leaf} is sorted to ${s.leaf} (${s.path.join(', ')})`);
		check(rank(W) === RANKS[leaf], `the rank of ${leaf} is ${rank(W)}, not ${RANKS[leaf]}`);
		const sz = Math.max(size(W), 1);
		const zero = (T, k) => size(T) <= 1e-12 * sz ** k;
		const inv = invariants(W);
		// the minimal polynomial: its factors' numbers, and its degree
		let factors;
		if (leaf === 'I') factors = roots(inv);
		else if (leaf === 'D' || leaf === 'II') { const w = scale(div(inv.J, inv.I), -1); factors = leaf === 'D' ? [w, scale(w, -2)] : [w, w, scale(w, -2)]; }
		else factors = { III: [cx(0), cx(0), cx(0)], N: [cx(0), cx(0)], O: [cx(0)] }[leaf];
		check(zero(product(W, factors), factors.length), `${leaf} is not annihilated by its minimal polynomial`);
		// no polynomial of lower degree with the same numbers as factors (each dropped once) vanishes
		const lower = factors.map((_, k) => factors.filter((__, j) => j !== k));
		check(factors.length === 1 ? !zero(ident(), 0) : lower.every((fs) => !zero(product(W, fs), fs.length)), `${leaf}'s minimal polynomial is not minimal`);
		// eq:cayley: every reading obeys its cubic
		check(zero(tadd(tadd(tmul(tmul(W, W), W), tscale(W, scale(inv.I, -0.5))), ident(scale(inv.J, -1 / 3))), 3), `${leaf} does not obey eq:cayley`);
		MINIMAL[leaf] = factors.length;
	}
	check(Object.values(MINIMAL).join() === '3,2,3,3,2,1', `the minimal polynomials' degrees ${Object.values(MINIMAL)}`);
	// the mass with the wave: the eigenvalues of the mass, and the product 3 w c2 m m^T
	{
		const W = ex.II, inv = invariants(W);
		check(nearC(inv.I, cx(6 * WAVE_W ** 2), 1e-14) && nearC(inv.J, cx(-6 * WAVE_W ** 3), 1e-14), 'the wave changes I or J');
		const P = product(W, [cx(WAVE_W), cx(-2 * WAVE_W)]);
		check(size(tadd(P, tscale(mmT(), -3 * WAVE_W * WAVE_C2))) < 1e-15, 'the product is not 3 w c2 m m^T');
		check(size(P).toFixed(4) === '0.0094', `the product's entries ${size(P)}`);
	}
	// the type III table: W^2 = 2 m m^T, W m = 0, sqrt 2 times m z^T + z m^T
	{
		const W = ex.III, z = [cx(0), cx(0), cx(1)];
		check(size(tadd(tmul(W, W), tscale(mmT(), -2))) < 1e-15, 'type III: W^2 is not 2 m m^T');
		check(W.every((row) => absC(row.reduce((s, a, k) => add(s, mul(a, M[k])), cx(0))) < 1e-15), 'type III: W m is not 0');
		const T1 = M.map((a, i) => z.map((b, j) => add(mul(a, b), mul(z[i], M[j]))));
		check(size(tadd(W, tscale(T1, -Math.SQRT2))) < 1e-15, 'type III is not sqrt 2 (m z^T + z m^T)');
	}

	// ---- the Jordan form
	has('every square table is a row of **Jordan blocks** down the diagonal, each with one eigenvalue on its diagonal and 1 on the line above it', 'the Jordan blocks');
	has('The six shapes have blocks of sizes $1, 1, 1$ (I, D, O), $2, 1$ (II, N) and $3$ (III)', 'the blocks of the shapes');
	return { md, flat, has, pairW, movedW, spinW: [ws, ws, scale(ws, -2)], pairInv, f };
}

/** The two tables of the Jordan diagram at the number w: diag(w, w, -2w), and the same with 1 in row 1, column 2. */
export function jordanTables(w) {
	const D = [[w, cx(0), cx(0)], [cx(0), w, cx(0)], [cx(0), cx(0), scale(w, -2)]];
	const J = D.map((r) => r.slice());
	J[0][1] = cx(1);
	return { D, J };
}

/** The Jordan diagram's facts, at several numbers w: the same polynomial, I and J; the test; the eigenvectors. */
export function jordanFacts(check) {
	const E = [0, 1, 2].map((k) => [0, 1, 2].map((i) => cx(i === k ? 1 : 0)));
	const applyT = (T, v) => T.map((row) => row.reduce((s, a, k) => add(s, mul(a, v[k])), cx(0)));
	const out = {};
	for (const w of [cx(1), cx(0.125), cx(0.7, -0.4), cx(-2.3, 1.1)]) {
		const { D, J } = jordanTables(w);
		const iD = invariants(D), iJ = invariants(J);
		check(nearC(iD.I, iJ.I, 1e-12) && nearC(iD.J, iJ.J, 1e-12) && nearC(iD.I, scale(mul(w, w), 6), 1e-12) && nearC(iD.J, scale(mul(mul(w, w), w), -6), 1e-12), 'the two tables\' I and J');
		check(nearC(trace(D), cx(0), 1e-15) && nearC(trace(J), cx(0), 1e-15), 'a table is not trace-free');
		for (const l of [cx(0.3, 0.2), cx(-1.4), cx(2, 2)]) check(nearC(det(minus(D, l)), det(minus(J, l)), 1e-12), 'the two characteristic polynomials differ');
		const test = (T) => product(T, [w, scale(w, -2)]);
		check(size(test(D)) < 1e-12, '(D - w)(D + 2w) is not zero');
		const tJ = test(J);
		check(tJ.every((r, i) => r.every((a, j) => (i === 0 && j === 1 ? nearC(a, scale(w, 3), 1e-12) : absC(a) < 1e-12))), '(J - w)(J + 2w) is not 3w in row 1, column 2');
		// eigenvectors: the unit vectors that each table only scales
		const eig = (T) => E.map((e) => { const Te = applyT(T, e); return [0, 1, 2].every((i) => absC(sub(Te[i], mul(T[0][0], e[i]))) < 1e-12) || [0, 1, 2].every((i) => absC(sub(Te[i], mul(T[2][2], e[i]))) < 1e-12); });
		check(eig(D).join() === 'true,true,true' && eig(J).join() === 'true,false,true', `the eigenvectors ${eig(D)} / ${eig(J)}`);
		// and the number of independent eigenvectors: 3 - rank(T - w) + 3 - rank(T + 2w)
		const count = (T) => 6 - rank(minus(T, w)) - rank(minus(T, scale(w, -2)));
		check(count(D) === 3 && count(J) === 2, `eigenvector counts ${count(D)}, ${count(J)}`);
		out.eig = { D: eig(D), J: eig(J) };
	}
	return out;
}
