// Shared numbers for the two diagrams of the tutorial's chapter 9.6 (tutorial/one-point/the-sky-at-one-point.md):
// tut-sky-spectral-blocks and tut-single-pixel-picture. Not a figure itself. Complex numbers are chapter 8.1's
// [re, im] (figs/tut-quantum-lib.js), a wave's unit null vector chapter 9.1's (figs/tut-spin-two-lib.js), the five
// orthonormal coordinates the paper's (reference/gravcam/pixel.py, STF), Legendre's polynomials chapter 2.2's
// recurrence (figs/tut-sph-legendre.js), and the colours chapter 9.5's (figs/tut-separating-lib.js: the curvature's
// for the sky, the light role's for light), all imported, not copied. Orange and blue mean a stretch and a squeeze
// only, and are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the count: single waves from 500 random directions (seeded), each in four states of polarization, (alpha+,
//    alpha-) = (1, 0), (0, 1), (1, 1) and (1, i); a wave's column in the helicity coordinates is x = (alpha+ q,
//    alpha-* q*), with q the five numbers of m m^T, and its spectral matrix x x^dagger, a 10 x 10 Hermitian table, is
//    100 real numbers. The ranks of the spans, found by Gram-Schmidt: 68 for the whole table; 25 for the upper left
//    block alpha+ alpha+* q q^dagger and 25 for the lower right q* q^T; 18 for the upper right q q^T with complex
//    weights; 18 in its symmetric part (15 complex entries, 30 real numbers, so 12 left over) and 0 in its
//    antisymmetric part (10 complex entries, 20 real numbers, all 20 left over); the brightness alone (the two diagonal
//    blocks alike) 25 and the circular polarization alone (opposite) 25; 25 + 25 + 18 = 68 and 12 + 20 = 32 make 100;
//    25 = 1 + 3 + 5 + 7 + 9 and 9 = 2 x 4 + 1;
//  - the picture: K(theta) = (1/25) sum_{l <= 4} (2l + 1) P_l(cos theta), checked against its value 1 at the source
//    and (1 - 3 + 5 - 7 + 9)/25 = 0.2 behind it; its half height at 25.8 degrees (full width 51.6), its zeros at 43.9,
//    80.4, 116.5 and 152.3 degrees, its dip -0.152 at 59.5 degrees, all by bisection and golden sections; light's
//    (1/9) sum_{l <= 2} (2l + 1) P_l, full width 88.5 degrees;
//  - the diagrams' comments' numbers (kept here, since the figures replace the comments), and, once a figure stands in
//    the chapter, its name and label there, one pointer to it, and the numbers its caption prints.
import { cx, add, mul, conj, scale, abs2, frame, nullOf, outer } from './tut-spin-two-lib.js';
import { CURV, LIGHT, palette } from './tut-separating-lib.js';
import { legendreList } from './tut-sph-legendre.js';
import { bisect, lowest } from './tut-bessel-lib.js';
import { uniforms } from './tut-prob-lib.js';

export { CURV, LIGHT };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

// ---- the five orthonormal coordinates (reference/gravcam/pixel.py, STF) ---------------------------------------------
const r2 = Math.SQRT2, r6 = Math.sqrt(6);
export const STF = [
	[[1 / r2, 0, 0], [0, -1 / r2, 0], [0, 0, 0]],
	[[1 / r6, 0, 0], [0, 1 / r6, 0], [0, 0, -2 / r6]],
	[[0, 1 / r2, 0], [1 / r2, 0, 0], [0, 0, 0]],
	[[0, 0, 1 / r2], [0, 0, 0], [1 / r2, 0, 0]],
	[[0, 0, 0], [0, 0, 1 / r2], [0, 1 / r2, 0]]
];
/** The five numbers of a complex symmetric trace-free table: tr(T_a W). */
export const five = (W) => STF.map((T) => T.flat().reduce((s, t, k) => add(s, scale(W.flat()[k], t)), cx(0)));
/** The steering vector of a wave travelling along k: the five numbers of m m^T. */
export const steering = (k) => { const m = nullOf(frame(k, Math.abs(k[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])); return five(outer(m, m)); };

// ---- the count ------------------------------------------------------------------------------------------------------
export const DIRECTIONS = 500;
export const STATES = [[cx(1), cx(0)], [cx(0), cx(1)], [cx(1), cx(1)], [cx(1), cx(0, 1)]];   // (alpha+, alpha-)
const SEED = 9006;

/** Random directions, uniform on the sphere, seeded. */
export function directions(n = DIRECTIONS, seed = SEED) {
	const u = uniforms(seed);
	return Array.from({ length: n }, () => {
		const z = 2 * u() - 1, f = 2 * Math.PI * u(), s = Math.sqrt(1 - z * z);
		return [s * Math.cos(f), s * Math.sin(f), z];
	});
}
/** The real numbers of a Hermitian n x n table: its diagonal, then the real and imaginary parts above it. */
export const hermitianReals = (H) => {
	const n = H.length, out = [];
	for (let i = 0; i < n; i++) out.push(H[i][i][0]);
	for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push(H[i][j][0], H[i][j][1]);
	return out;
};
/** The real numbers of a complex 5 x 5 table's symmetric part, (A_ij + A_ji)/2 for i <= j, and of its antisymmetric
 * part, (A_ij - A_ji)/2 for i < j. */
export const symmetricReals = (A) => { const out = []; for (let i = 0; i < 5; i++) for (let j = i; j < 5; j++) out.push((A[i][j][0] + A[j][i][0]) / 2, (A[i][j][1] + A[j][i][1]) / 2); return out; };
export const antisymmetricReals = (A) => { const out = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) out.push((A[i][j][0] - A[j][i][0]) / 2, (A[i][j][1] - A[j][i][1]) / 2); return out; };
const allReals = (A) => A.flat().flatMap((z) => [z[0], z[1]]);
/** x y^dagger of two complex columns. */
const dyad = (x, y) => x.map((a) => y.map((b) => mul(a, conj(b))));

/** The rank of the span of real vectors, by Gram-Schmidt twice over, against `tol` times the largest length. */
export function rank(vectors, tol = 1e-9) {
	const big = Math.max(...vectors.map((v) => Math.hypot(...v)));
	if (!(big > 0)) return 0;
	const basis = [];
	for (const v of vectors) {
		let w = v.slice();
		for (let pass = 0; pass < 2; pass++) for (const b of basis) {
			const d = w.reduce((s, x, i) => s + x * b[i], 0);
			for (let i = 0; i < w.length; i++) w[i] -= d * b[i];
		}
		const l = Math.hypot(...w);
		if (l > tol * big) basis.push(w.map((x) => x / l));
	}
	return basis.length;
}

/** The ranks of the spans of single waves' spectral matrices, whole and by block. */
export function count() {
	const qs = directions().map(steering);
	const whole = [], upperLeft = [], lowerRight = [], upperRight = [], sym = [], anti = [], bright = [], circ = [];
	for (const q of qs) {
		const qc = q.map(conj);
		for (const [a, b] of STATES) {
			const x = [...q.map((v) => mul(a, v)), ...qc.map((v) => mul(conj(b), v))];
			const C = dyad(x, x);
			whole.push(hermitianReals(C));
			const UR = C.slice(0, 5).map((r) => r.slice(5));
			upperRight.push(allReals(UR));
			sym.push(symmetricReals(UR));
			anti.push(antisymmetricReals(UR));
		}
		const UL = dyad(q, q), LR = dyad(qc, qc);
		upperLeft.push(hermitianReals(UL));
		lowerRight.push(hermitianReals(LR));
		// the brightness reaches both diagonal blocks alike, the circular polarization with opposite signs
		bright.push([...hermitianReals(UL), ...hermitianReals(LR)]);
		circ.push([...hermitianReals(UL), ...hermitianReals(LR).map((v) => -v)]);
	}
	const big = Math.max(...anti.map((v) => Math.hypot(...v)));
	return {
		whole: rank(whole), upperLeft: rank(upperLeft), lowerRight: rank(lowerRight), upperRight: rank(upperRight),
		sym: rank(sym), anti: rank(anti), antiLargest: big, bright: rank(bright), circ: rank(circ),
		reals: { whole: whole[0].length, hermitian: upperLeft[0].length, upperRight: upperRight[0].length, sym: sym[0].length, anti: anti[0].length },
		unit: qs.every((q) => near(q.reduce((s, z) => s + abs2(z), 0), 1, 1e-12))
	};
}

// ---- the picture ----------------------------------------------------------------------------------------------------
export const rad = (d) => (d * Math.PI) / 180;
/** The picture of a source cut off at degree L, (1/(L + 1)^2) sum_{l <= L} (2l + 1) P_l(cos theta), theta in degrees. */
export function picture(theta, L = 4) {
	const p = legendreList(L, Math.cos(rad(theta)));
	return p.reduce((s, v, l) => s + (2 * l + 1) * v, 0) / (L + 1) ** 2;
}
export const K = (t) => picture(t, 4);
export const lightK = (t) => picture(t, 2);
/** The numbers of the picture: half height, zeros, dip and the value behind; light's full width. */
export function marks() {
	const half = bisect((t) => K(t) - 0.5, 0, 40);
	const zeros = [];
	for (let t = 0.5; t <= 180; t += 0.5) if (Math.sign(K(t)) !== Math.sign(K(t - 0.5))) zeros.push(bisect(K, t - 0.5, t));
	const dip = lowest(K, zeros[0], zeros[1]);
	const lightHalf = bisect((t) => lightK(t) - 0.5, 0, 70);
	return { half, full: 2 * half, zeros, dip, back: K(180), lightHalf, lightFull: 2 * lightHalf };
}

// ---- the numbers of the diagrams' comments, which the figures replace -----------------------------------------------
export const COMMENT = {
	blocks: ['10×10', '(w₊, w₋*)', '5×5', '"½(I + V): 25"', '"½(I − V): 25"', '15 complex entries', '9 complex combinations', '"Q − iU at degree 4: 18"', '6 that stay zero: "checks: 12"', '10 complex entries: "checks: 20"', '"conjugate transpose of C₊₋: no new numbers"', '25 + 25 + 18 = 68', '12 + 20 = 32'],
	picture: ['ϑ = 25.8°', '"51.6° full width"', 'first zero at 43.9°', 'the dip −0.152 at 59.5°', 'the later zeros at 80.4°, 116.5° and 152.3°', 'value 0.2 at 180°', 'Σ_{ℓ≤2}(2ℓ+1)P_ℓ/9 (full width 88.5°)']
};
export const FIGURES = [['tut-sky-spectral-blocks', 'sky-spectral-blocks'], ['tut-single-pixel-picture', 'single-pixel-picture']];

/** The chapter's statements behind the two figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	await palette(check);
	const md = await (await fetch('/tutorial/one-point/the-sky-at-one-point.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	const drawn = {};
	for (const [n, id] of FIGURES) {
		drawn[n] = flat.includes(`](${n}){#fig:${id}}`);
		const planned = comments.some((c) => c.includes(`diagram: ${id} `));
		check(drawn[n] !== planned, `the diagram ${n} is ${drawn[n] ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn[n]) check(flat.split(`(Figure [](#fig:${id}))`).length === 2, `not one pointer to fig:${id}`);
	}
	const comment = (id) => comments.find((c) => c.includes(`diagram: ${id} `)) ?? null;

	// ---- the count
	has(String.raw`So its ten diagonal entries are real, and the 45 entries above them are complex and fix those below: $10 + 2\times45 = 100$ real numbers.`, 'the hundred numbers');
	has('These are the paper\'s **helicity blocks**: 25 real numbers in each Hermitian block and 50 in the complex $C_{+-}$.', 'the blocks\' sizes');
	has(String.raw`The spectral matrix of the column $(\mathbf w_+, \mathbf w_-^*)$ has $C_+$ at its upper left, $C_-^*$ at its lower right, $C_{+-}$ at its upper right and the conjugate transpose of $C_{+-}$ at its lower left.`, 'where the blocks stand');
	has(String.raw`C_\pm &= \oint\tfrac12(I \pm V)\,\mathbf q\mathbf q^\dagger\,\dd\Omega ,\\ C_{+-} &= \oint\tfrac12(Q - iU)\,\mathbf q\mathbf q^{\mathsf T}\,\dd\Omega .`, 'the blocks');
	has('which makes $1 + 3 + 5 + 7 + 9 = 25$, as many as $C_+$ holds', 'the 25');
	has('25 numbers each of $I$ and $V$', 'the 25 and 25');
	has(String.raw`Such a table has $2\times4 + 1 = 9$ complex components (chapter 2.2's count with $\ell = 4$), so $C_{+-}$ holds at most 18 real numbers of the sky.`, 'the 18');
	has(String.raw`The antisymmetric part of $C_{+-}$, ten complex entries, is zero for every sky, since $\mathbf q\mathbf q^{\mathsf T}$ is symmetric. Of the fifteen complex entries of its symmetric part, the sky reaches only nine combinations. That leaves $20 + 12 = 32$ real numbers that vanish for any sky of waves`, 'the 32');
	has('span 25 real dimensions of $C$ for the brightness, 25 for the circular polarization and 18 for the linear polarization', 'the numerical count');
	has('single waves from 500 random directions, in four states of polarization each', 'the sample');
	has('That makes 25 + 25 + 18 = 68. The other 32 averages are zero for every sky of waves, so they test the instrument.', 'the plain count');
	has('Sixty-eight carry the sky: 25 of the brightness, 25 of the circular polarization and 18 of the linear polarization.', 'the check\'s answer');
	const n = count();
	check(n.unit, 'a steering vector is not of length one');
	for (let a = 0; a < 5; a++) for (let b = 0; b < 5; b++) {
		const d = STF[a].flat().reduce((s, t, k) => s + t * STF[b].flat()[k], 0), tr = STF[a][0][0] + STF[a][1][1] + STF[a][2][2];
		check(near(d, a === b ? 1 : 0, 1e-15) && near(tr, 0, 1e-15), 'the five coordinates are not orthonormal and trace-free');
	}
	check(n.reals.whole === 100 && n.reals.hermitian === 25 && n.reals.upperRight === 50 && n.reals.sym === 30 && n.reals.anti === 20, `the real numbers ${JSON.stringify(n.reals)}`);
	check(n.upperLeft === 25 && n.lowerRight === 25 && n.upperRight === 18 && n.sym === 18 && n.anti === 0 && n.antiLargest < 1e-15, `the blocks' ranks ${JSON.stringify(n)}`);
	check(n.bright === 25 && n.circ === 25, `the brightness and circular polarization reach ${n.bright} and ${n.circ}`);
	check(n.whole === 68 && n.upperLeft + n.lowerRight + n.upperRight === n.whole, `the whole table's rank ${n.whole}`);
	const sky = [n.upperLeft, n.lowerRight, n.sym], checks = [n.reals.sym - n.sym, n.reals.anti - n.anti];
	check(sky.join() === '25,25,18' && checks.join() === '12,20', `the counts ${sky} and ${checks}`);
	check(sky.reduce((s, v) => s + v, 0) === 68 && checks.reduce((s, v) => s + v, 0) === 32 && 68 + 32 === n.reals.whole, '68 + 32 is not 100');
	check([0, 1, 2, 3, 4].reduce((s, l) => s + 2 * l + 1, 0) === 25 && 2 * 4 + 1 === 9 && n.sym === 2 * 9, '25 and 9');
	check(15 * 2 === n.reals.sym && 10 * 2 === n.reals.anti && n.sym / 2 === 9 && checks[0] / 2 === 6, 'the entries 15 and 10, the combinations 9 and 6');
	if (drawn['tut-sky-spectral-blocks']) {
		has(`a sky of independent waves fills $${sky.join(' + ')} = 68$ of the hundred real numbers of one pixel's spectral matrix and leaves $${checks.join(' + ')} = 32$ at zero`, 'the caption\'s counts');
		has(`In $C_{+-}$ the ${n.reals.sym / 2} entries on and above the diagonal stand for its symmetric part, which the sky reaches in only nine complex combinations, and the ${n.reals.anti / 2} below it for its antisymmetric part, which no sky reaches.`, 'the caption\'s parts');
	}
	const c1 = comment('sky-spectral-blocks');
	if (c1) check(COMMENT.blocks.every((s) => c1.includes(s)), 'the first comment\'s numbers');

	// ---- the picture
	has(String.raw`$$\boxed{\;\sym{pixel-picture}{K(\vartheta)} = \frac1{25}\sum_{\ell=0}^{4}(2\ell + 1)\,P_\ell(\cos\vartheta) .\;}`, 'the picture');
	has('**Numbers.** The picture falls to one half at $\\vartheta = 25.8°$, a full width at half height of $51.6°$', 'the half height');
	has('It crosses zero at $43.9°$ and dips to $-0.152$ at $59.5°$', 'the zero and the dip');
	has('Behind the source it rises to $K(180°) = (1 - 3 + 5 - 7 + 9)/25 = 0.2$', 'the value behind');
	has(String.raw`its picture, $\sum_{\ell\le2}(2\ell + 1)P_\ell/9$, is $88.5°$ wide`, 'light\'s width');
	has('Its full width at half height is 51.6°.', 'the check\'s width');
	const m = marks();
	check(near(K(0), 1, 1e-14) && near(m.back, (1 - 3 + 5 - 7 + 9) / 25, 1e-14) && near(lightK(0), 1, 1e-14), 'K at the source and behind it');
	check(m.half.toFixed(1) === '25.8' && m.full.toFixed(1) === '51.6', `the half height at ${m.half}`);
	check(m.zeros.length === 4 && m.zeros.map((z) => z.toFixed(1)).join() === '43.9,80.4,116.5,152.3', `the zeros ${m.zeros}`);
	check(m.dip.y.toFixed(3) === '-0.152' && m.dip.x.toFixed(1) === '59.5' && m.back.toFixed(1) === '0.2', `the dip ${m.dip.y} at ${m.dip.x}`);
	check(m.lightFull.toFixed(1) === '88.5', `light's full width ${m.lightFull}`);
	// the dip is the lowest point anywhere, and K falls through one half only once
	for (let t = 0; t <= 180; t += 0.01) check(K(t) >= m.dip.y - 1e-12 && (t <= m.half || K(t) < 0.5), `K at ${t}`);
	if (drawn['tut-single-pixel-picture']) {
		const d = (x) => `$${x.toFixed(1)}°$`;
		has(`one pixel's picture $K(\\vartheta)$ of a point source, the source cut off at degree four, is ${d(m.full)} wide at half height`, 'the caption\'s width');
		has(`falls to $${m.dip.y.toFixed(3)}$ at ${d(m.dip.x)}`, 'the caption\'s dip');
		has(`Light's point sensor, cut off at degree two, gives the dashed picture, ${d(m.lightFull)} wide.`, 'the caption\'s light');
		has(`with zeros at ${m.zeros.slice(0, 3).map(d).join(', ')} and ${d(m.zeros[3])}.`, 'the caption\'s zeros');
	}
	const c2 = comment('single-pixel-picture');
	if (c2) check(COMMENT.picture.every((s) => c2.includes(s)), 'the second comment\'s numbers');

	return { has, drawn, count: n, sky, checks, marks: m };
}
