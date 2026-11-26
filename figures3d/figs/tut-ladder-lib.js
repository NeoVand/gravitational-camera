// Shared numbers for the three diagrams of the tutorial's section 13.3 (tutorial/what-a-field-keeps/ladder.md):
// tut-ladder-laplacians, tut-ladder-rungs and tut-ladder-pair-profiles. Not a figure itself. The sheet, strokes,
// labels and cropping are sections 1.2 to 13.2's (figs/tut-pot-lib.js), the plots and axes section 3.1's
// (figs/tut-prob-lib.js), the beads the paper's (figs/ladder.js, stone.js's STEEL), matter's and the field's
// colours section 7.4's (figs/tut-linear-lib.js, asserted against app.css by `palette(check)`), all imported, not
// copied.
//
// The colours: the density and its moments (rho, delta rho, the arrows of the pair's masses, the bead of int rho r^4)
// in matter's colour; the potentials psi_1 and psi_2 in the field's; everything else in ink and the page's greys.
// Orange and blue, which mean a stretch and a squeeze, are not used: the diagram comments' "blue of the paper's
// squeeze" (the final zeros) and "the paper's orange" (the bead of int rho r^4, as in fig:ladder(b)) become ink and
// a bead of matter's colour, since neither is a stretch or a squeeze.
//
// The numbers, each computed here and asserted against the chapter's text (outside its comments) by `chapter(check)`:
//  - the Laplacians: on exact polynomials (integer coefficients in x, y, z), Lap(r^(2j) H_l) = 2j(2l + 2j + 1)
//    r^(2j-2) H_l for H_2 = x^2 - y^2 and j = 2, 1, 0, the factors 36, 14 and 0; Lap r^2 = 6, Lap r^4 = 20 r^2,
//    Lap^2 r^4 = 120; and for a harmonic h of degree five and a harmonic cubic g, Lap(d_i h d_i g) = 2 d_i d_k h
//    d_i d_k g, Lap(d_i d_k h d_i d_k g) = 2 d_i d_k d_l h d_i d_k d_l g, and the next Laplacian is zero; the text's
//    example h = (x^3 - 3xy^2)/3, g = (x^2 - y^2)/2: grad h . grad g = x^3 + xy^2, whose Laplacian is 8x;
//  - the beads: 2l + 1 in the cell of degree l, the cells of one degree n = l + 2j adding to (n + 1)(n + 2)/2, the
//    text's 9 + 5 + 1 = 15 and 9 + 5 = 14; the diagonals l + 2j = n for n = 2, 4, 6;
//  - the pair (G = M = R = 1): delta rho = rho_B - rho_A is +1/2 at the centre, -1 on the shell R/sqrt 2 and +1/2 on
//    the shell R; psi_1 = Phi_B - Phi_A = (1/2)(2 sqrt 2 - 1 - 1/r) inside R/sqrt 2, (1/2)(1/r - 1) out to R, zero
//    beyond, each piece harmonic away from r = 0 and continuous at the shells, its jumps of slope 4 pi G times the
//    shells' surface densities; int psi_1 dV = 0; psi_2 = (sqrt 2 - 1)/4 - r/4 + (2 sqrt 2 - 1) r^2/12 inside
//    R/sqrt 2 and (1 - r)^3/12r out to R, zero beyond: Lap psi_2 = psi_1 by differences, psi_2 and its slope
//    continuous at R/sqrt 2 and zero at R, its slope -1/4 (that is, -GM/4) at the centre; the moments int r^2 delta rho
//    = 0 and int r^4 delta rho = 1/4, the text's 1/4 M R^4 for A and 1/2 M R^4 for B.
import { palette, MATTER, FIELD } from './tut-linear-lib.js';

export { MATTER, FIELD };
export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- exact polynomials in x, y, z: Map 'a,b,c' -> coefficient -------------------------------------------------------
const key = (a, b, c) => `${a},${b},${c}`;
const exps = (k) => k.split(',').map(Number);
export const poly = (terms) => { const p = new Map(); for (const [c, a, b, d] of terms) add(p, key(a, b, d), c); return p; };
function add(p, k, c) { const v = (p.get(k) ?? 0) + c; if (v === 0) p.delete(k); else p.set(k, v); }
export const plus = (p, q, s = 1) => { const o = new Map(p); for (const [k, c] of q) add(o, k, s * c); return o; };
export const scale = (p, s) => { const o = new Map(); for (const [k, c] of p) add(o, k, s * c); return o; };
export function times(p, q) {
	const o = new Map();
	for (const [k1, c1] of p) for (const [k2, c2] of q) { const [a, b, c] = exps(k1), [d, e, f] = exps(k2); add(o, key(a + d, b + e, c + f), c1 * c2); }
	return o;
}
/** The derivative along the axis i (0, 1, 2). */
export function d(p, i) {
	const o = new Map();
	for (const [k, c] of p) { const e = exps(k); if (e[i] === 0) continue; const c1 = c * e[i]; e[i]--; add(o, key(...e), c1); }
	return o;
}
export const lap = (p) => plus(plus(d(d(p, 0), 0), d(d(p, 1), 1)), d(d(p, 2), 2));
export const same = (p, q) => plus(p, q, -1).size === 0;
export const isZero = (p) => p.size === 0;
export const R2 = poly([[1, 2, 0, 0], [1, 0, 2, 0], [1, 0, 0, 2]]);
export const power = (p, n) => { let o = poly([[1, 0, 0, 0]]); for (let k = 0; k < n; k++) o = times(o, p); return o; };
/** The sum over all index tuples of length `order` of the derivatives of h and g along them. */
export function contracted(h, g, order) {
	let tuples = [[]];
	for (let k = 0; k < order; k++) tuples = tuples.flatMap((t) => [0, 1, 2].map((i) => [...t, i]));
	let s = new Map();
	for (const t of tuples) s = plus(s, times(t.reduce(d, h), t.reduce(d, g)));
	return s;
}

// ---- the Laplacians of r^(2j) H_l ---------------------------------------------------------------------------------
export const DEGREE = 2;                                   // the left column's l
export const factor = (l, j) => 2 * j * (2 * l + 2 * j + 1);
export const H2 = poly([[1, 2, 0, 0], [-1, 0, 2, 0]]);     // x^2 - y^2

// ---- the beads ------------------------------------------------------------------------------------------------------
export const TOP_L = 6, TOP_J = 3;
export const beads = (l) => 2 * l + 1;
export const DIAGONALS = [2, 4, 6];
/** The cells (l, j) on the diagonal l + 2j = n inside the drawn grid. */
export const onDiagonal = (n) => Array.from({ length: TOP_J + 1 }, (_, j) => [n - 2 * j, j]).filter(([l]) => l >= 0 && l <= TOP_L);
/** The bands: tides of degree up to m reach the rungs j < m. */
export const BANDS = [1, 2, 3];
export const FIRST_APART = [0, 2];                         // (l, j) of int rho r^4

// ---- the pair (G = M = R = 1) ---------------------------------------------------------------------------------------
export const A = Math.SQRT1_2;                             // A's shell
export const MASSES = [[0, 0.5], [A, -1], [1, 0.5]];      // delta rho: [radius, mass]
const C1 = (2 * Math.SQRT2 - 1) / 2;
export const psi1 = (r) => (r < A ? C1 - 1 / (2 * r) : r < 1 ? (1 / r - 1) / 2 : 0);
export const psi2 = (r) => (r < A ? (Math.SQRT2 - 1) / 4 - r / 4 + (C1 * r * r) / 6 : r < 1 ? (1 - r) ** 3 / (12 * r) : 0);
export const PSI1_ZERO = 1 / (2 * C1);                     // where psi_1 crosses zero, inside A's shell
export const PSI1_PEAK = psi1(A);                          // (sqrt 2 - 1)/2, at A's shell
export const PSI2_CENTRE = (Math.SQRT2 - 1) / 4;
/** The potential of a thin shell of mass m and radius s (a point when s = 0), at r. */
const shellPhi = (m, s, r) => -m / Math.max(r, s);

/** Every number of the chapter that the three diagrams draw or their captions print, checked once. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/what-a-field-keeps/ladder.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s.replace(/\s+/g, ' ')), `the chapter does not say ${what}: ${s}`);
	const r = String.raw;

	// ---- the Laplacians
	has(r`$$\boxed{\;\nabla^2\bigl(r^{2j}H_\ell\bigr) = 2j\,(2\ell + 2j + 1)\,r^{2j-2}H_\ell .\;}$$`, 'the boxed Laplacian');
	has(r`$j = 1$ and $H_2 = x^2 - y^2$ give $\nabla^2[r^2(x^2 - y^2)] = 14(x^2 - y^2)$`, 'the factor 14');
	has(r`$r^{2j}H_\ell$ is polyharmonic of order exactly $j + 1$`, 'the order');
	has(r`$\nabla^2r^2 = 6$ and $\nabla^4r^2 = 0$`, 'the Laplacians of r^2');
	has(r`$\nabla^2r^4 = 20r^2$ and $\nabla^4r^4 = 120$`, 'the Laplacians of r^4');
	check([2, 1, 0].map((j) => factor(DEGREE, j)).join() === '36,14,0', 'the factors');
	for (const j of [2, 1]) {
		const left = lap(times(power(R2, j), H2)), right = scale(times(power(R2, j - 1), H2), factor(DEGREE, j));
		check(same(left, right), `Lap(r^${2 * j} H_2) is not ${factor(DEGREE, j)} r^${2 * j - 2} H_2`);
	}
	check(isZero(lap(H2)), 'H_2 is not harmonic');
	check(same(lap(R2), poly([[6, 0, 0, 0]])) && isZero(lap(lap(R2))), 'Lap r^2');
	check(same(lap(power(R2, 2)), scale(R2, 20)) && same(lap(lap(power(R2, 2))), poly([[120, 0, 0, 0]])), 'Lap r^4');

	// ---- the identity: the text's indices and an example of degrees five and three
	has(r`We write the dot product with summed indices, $\partial_ih\,\partial_ig$`, 'the summed indices');
	has(r`$$\nabla^2(\nabla h\cdot\nabla g) = 2\,\partial_i\partial_kh\,\partial_i\partial_kg .$$`, 'the first step');
	has(r`So each further Laplacian adds one derivative to each factor and a factor 2`, 'the further steps');
	has(r`If $g$ has degree $m$ or less, its derivatives of order $m + 1$ are zero, and so is the left side.`, 'the end');
	{
		// h = Re (x + iy)^5 + Re (y + iz)^4 and g = Re (x + iz)^3 + xyz, both harmonic, g a cubic
		const h = poly([[1, 5, 0, 0], [-10, 3, 2, 0], [5, 1, 4, 0], [1, 0, 4, 0], [-6, 0, 2, 2], [1, 0, 0, 4]]);
		const g = poly([[1, 3, 0, 0], [-3, 1, 0, 2], [1, 1, 1, 1]]);
		check(isZero(lap(h)) && isZero(lap(g)), 'the example h or g is not harmonic');
		const [s1, s2, s3, s4] = [1, 2, 3, 4].map((k) => contracted(h, g, k));
		check(same(s1, plus(times(d(h, 0), d(g, 0)), plus(times(d(h, 1), d(g, 1)), times(d(h, 2), d(g, 2))))), 'grad h . grad g');
		check(same(lap(s1), scale(s2, 2)) && same(lap(s2), scale(s3, 2)) && isZero(s4) && isZero(lap(s3)), 'the right column');
		check(!isZero(s3), 'the third derivatives of the cubic vanish');
	}
	has(r`read $h = \tfrac13(x^3 - 3xy^2)$ after the quadrupolar tide $g = \tfrac12(x^2 - y^2)$. Then
		$\nabla h\cdot\nabla g = x^3 + xy^2$, whose Laplacian is $8x$`, 'the example');
	{
		const h = poly([[1, 3, 0, 0], [-3, 1, 2, 0]]), g = poly([[1, 2, 0, 0], [-1, 0, 2, 0]]);   // 3h and 2g
		const s = scale(contracted(h, g, 1), 1 / 6);
		check(same(s, poly([[1, 3, 0, 0], [1, 1, 2, 0]])) && same(lap(s), poly([[8, 1, 0, 0]])) && isZero(lap(lap(s))), 'the text\'s example');
	}

	// ---- the beads
	has(r`at degree four, $9 + 5 + 1 = 15$`, 'the count at degree four');
	has(r`At degree four the biharmonic polynomials fill $9 + 5 = 14$ of the 15 dimensions of all quartics`, 'the biharmonic count');
	has(r`Their moments are the **radial moments** $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$,
		against $r^{2j}H_\ell$ with $j < m$, and $j$ is the moment's **rung**`, 'the radial moments');
	has(r`So the term $n$ of the
		energy holds each moment $\int\matter\rho\,r^{\ell+2j}Y_\ell\,\dd V$ with $\ell + 2j = n$`, 'the diagonals');
	has(r`A reading at one time holds the rung $j = 0$ alone`, 'the bottom rung');
	for (let n = 0; n <= 8; n++) {
		let sum = 0;
		for (let j = 0; 2 * j <= n; j++) sum += beads(n - 2 * j);
		check(sum === ((n + 1) * (n + 2)) / 2, `the beads of degree ${n}`);
	}
	check(beads(4) + beads(2) + beads(0) === 15 && beads(4) + beads(2) === 14, 'the counts at degree four');
	check(DIAGONALS.map((n) => onDiagonal(n).length).join() === '2,3,4', 'the diagonals');
	check(onDiagonal(6)[0][0] === TOP_L && onDiagonal(6).at(-1)[1] === TOP_J, 'the grid does not hold the diagonal n = 6');

	// ---- the pair
	has(r`Body A is a thin shell of mass $\matter M$ and radius $R/\sqrt2$. Body B holds
		half of that mass at its centre and half on a thin shell of radius $R$.`, 'the pair');
	has(r`$\int\matter\rho\,r^4\,\dd V$ is $\tfrac14\matter MR^4$ for A and
		$\tfrac12\matter MR^4$ for B`, 'the fourth moments');
	has(r`The opening's bodies both have $\int\matter\rho\,r^2\,\dd V = \tfrac12\matter MR^2$`, 'the second moments');
	has(r`the difference $\matter{\delta\rho} = \matter\rho_B - \matter\rho_A$ of the pair of the opening is
		$\nabla^4\field\psi_2/4\pi G$ with $\field\psi_2$ zero outside the ball of radius $R$.`, 'the stretch problem');
	has(r`The solution of $\nabla^2\field\psi_1 = 4\pi G\matter{\delta\rho}$ vanishes outside $R$`, 'psi_1');
	has(r`Then $\nabla^2\field\psi_2 = \field\psi_1$ has a solution that vanishes outside $R$
		if $\int\field\psi_1\,\dd V = 0$`, 'psi_2');
	check(near(MASSES.reduce((s, [, m]) => s + m, 0), 0), 'delta rho has a mass');
	check(near(MASSES.reduce((s, [q, m]) => s + m * q * q, 0), 0, 1e-15), 'int r^2 delta rho');
	check(near(MASSES.reduce((s, [q, m]) => s + m * q ** 4, 0), 0.5 - 0.25, 1e-15), 'int r^4 delta rho');
	// psi_1 is Phi_B - Phi_A
	const phiB = (q) => shellPhi(0.5, 0, q) + shellPhi(0.5, 1, q), phiA = (q) => shellPhi(1, A, q);
	for (let k = 1; k <= 300; k++) { const q = (1.3 * k) / 300; check(near(psi1(q), phiB(q) - phiA(q), 1e-12), `psi_1 at ${q}`); }
	// radial Laplacians by differences, away from the shells
	const radLap = (f, q, h = 1e-4) => (f(q + h) - 2 * f(q) + f(q - h)) / (h * h) + ((f(q + h) - f(q - h)) / (2 * h)) * (2 / q);
	for (const q of [0.1, 0.3, 0.5, 0.65, 0.75, 0.9, 0.97, 1.1]) {
		check(Math.abs(radLap(psi1, q)) < 1e-5, `psi_1 is not harmonic at ${q}`);
		check(near(radLap(psi2, q), psi1(q), 1e-5), `Lap psi_2 is not psi_1 at ${q}`);
	}
	// continuity, and the jumps of slope: 4 pi G sigma = 4 pi m / (4 pi s^2) = m / s^2
	const slope = (f, q, s, h = 1e-7) => (f(q + s * h) - f(q)) / (s * h);
	for (const [q, m] of MASSES.slice(1)) {
		check(near(psi1(q - 1e-12), psi1(q + 1e-12), 1e-9), `psi_1 jumps at ${q}`);
		check(near(slope(psi1, q, 1) - slope(psi1, q, -1), m / (q * q), 1e-5), `the kink of psi_1 at ${q}`);
		check(near(psi2(q - 1e-12), psi2(q + 1e-12), 1e-9) && near(slope(psi2, q, 1), slope(psi2, q, -1), 1e-5), `psi_2 at ${q}`);
	}
	check(near(psi1(1e-6) + 1 / (2e-6), C1, 1e-6), 'psi_1 near the centre');
	// int psi_1 dV = 4 pi int r^2 psi_1 dr = 0, by Simpson's rule on each piece
	{
		const simpson = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h); return (s * h) / 3; };
		const I = simpson((q) => (q === 0 ? 0 : q * q * psi1(q)), 0, A) + simpson((q) => q * q * psi1(q), A, 1);
		check(Math.abs(I) < 1e-12, `int psi_1 dV = ${I}`);
	}
	check(near(psi2(1 - 1e-9), 0, 1e-12) && Math.abs(slope(psi2, 1, -1, 1e-5)) < 1e-9 && psi2(1.05) === 0, 'psi_2 at R');
	check(near(slope(psi2, 0, 1, 1e-8), -0.25, 1e-7) && near(psi2(0), PSI2_CENTRE, 1e-15), 'psi_2 at the centre');
	for (let k = 1; k < 400; k++) { const q = k / 400; check(psi2(q) > 0 && psi2(q) < psi2(q - 1 / 400), `psi_2 does not fall at ${q}`); }
	check(near(psi1(PSI1_ZERO), 0, 1e-12) && PSI1_ZERO < A && near(PSI1_PEAK, (Math.SQRT2 - 1) / 2, 1e-12), 'psi_1\'s zero and peak');

	/** Whether the diagram `name` is drawn (its figure line, with the caption `caption`) or still planned (its comment). */
	const state = (name, id, caption) => {
		const drawn = flat.includes(`](${name}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${name} `));
		check(drawn !== planned, `the diagram ${name} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) {
			has(`![${caption}](${name}){#fig:${id}}`, `the caption of ${name}`);
			has(`(Figure [](#fig:${id}))`, `the pointer to ${name}`);
		}
		return drawn;
	};
	return { md, flat, has, state };
}
