// Shared numbers for the three diagrams of the tutorial's section 9.4 (tutorial/one-point/petrov.md):
// tut-stereographic, tut-petrov-skies and tut-moving-pairs. Not a figure itself. A reading's quartic and its stars are
// section 8.4's (figs/tut-spin-lib.js: the roots of the paper's eq:stars, m(z)^T W m(z) = 0, mapped to the sky by
// k(z) = (2 Re z, 2 Im z, 1 - |z|^2)/(1 + |z|^2), a root lost from the top a star at -z); the six readings are
// section 9.2's (figs/tut-cxsym-lib.js, its examples and its algebraic sort of the shapes); the boost is section 9.3's,
// Lambda = exp(-i eta u.L) with (L_k)_ij = -eps_kij (figs/tut-matrix-w-lib.js; 9.2's boostX has the opposite sign and
// is not used); all imported, not copied. Orange and blue mean a stretch and a squeeze only, and are not used.
//
// `chapter(check)` asserts against the chapter's own text (fetched, outside its comments) every statement that a
// figure draws or its caption prints, and computes the numbers behind them:
//  - the sky as the complex plane: m(z) is null; the direction of travel of m(z), Re(i m x m*)/|m|^2, is k(z); z = 0,
//    1, i give +z, +x, +y and |z| -> infinity gives -z; |z| = tan(theta/2), arg z = phi; m(-1/conj z) =
//    -m(z)*/conj(z)^2 and k(-1/conj z) = -k(z); m(z1).m(z2) = -2 (z1 - z2)^2; the line from the south pole through
//    k(z) meets the plane of the equator at (Re z, Im z, 0);
//  - the drawn direction, 55 degrees from +z at the azimuth 30: z = tan(27.5) e^{i 30} = 0.52 e^{i 30}, and its
//    opposite -1/conj z = 1.92 e^{i 210}; the quartic of a wave along k(z), m m^T with m = m(z), is 4 (z' - z)^4 up
//    to its amplitude, a fourfold root at z (it and three derivatives vanish there);
//  - the six readings of the table of types, each sorted by 9.2's algebraic test and by the pattern of its roots:
//    I, the fig:stars pair (1 : 0.45 at (-1.5, 0.3, 0) and (0.9, 1.1, 0.6)), four single directions +-(-0.797,
//    0.224, -0.561) and +-(0.887, 0.227, -0.401), in two opposite pairs, each pair at right angles to the middle
//    axis, 1 - 6 J^2/I^3 = 0.553; II, w (1 - 3 z z^T) + c2 m m^T with w = 0.125, c2 = 0.05, the quartic
//    2 z^2 (c2 z^2 - 6 w), a double root at +z and two at z = +-3.87, the directions (+-0.484, 0, -0.875); D, one mass
//    on the z axis, -12 w z^2, two at +z and two at -z; III, the paper's table, 8 z^3, three at +z and one at -z; N,
//    one wave along +z, four at +z; O, no field, a quartic zero for every z;
//  - the boost: Lambda m(z) = e^{-eta} m(z e^eta) for a boost along z (the chapter's eq:boost-z), at several z and
//    eta; the fig:stars pair's roots times e^0.7 = 2.01375 for a pixel moving along +z at eta = 0.7;
//  - the moving body: at rest, w (1 - 3 n0 n0^T) with n0 = -x and w = 1/1.5^3 (a unit mass at 1.5, G = 1); the pixel
//    moves through the body's frame with c beta = -0.9 c y, so the body moves along +y at 0.9c for the pixel; its
//    reading Lambda W Lambda^T (u = -y, tanh eta = 0.9) has two double roots at (+-0.436, 0.9, 0); the paths at every
//    speed from 0 to 0.9c lie on the great circle z = 0; p+ (the aberrated +n0, eq:proof-stars) is the pair on the
//    body's side; the half sum is (0, 0.9, 0) = v_perp/c, the half difference (-0.436, 0, 0), of length
//    (1 - 0.81)^{1/2}, along the line to where the body is now, -x (a = beta.n0 = 0, so r = R* n0); the type stays
//    D; all equal to the paper's figure data (reference/results/figures/stars.json, its track);
//  - the diagrams' comments' numbers (kept here, since the figures replace the comments), and, once a figure stands in
//    the chapter, its name and label there and one pointer to it.
import { cx, add, mul, conj, scale, abs2, tadd, tscale, absC, sub, nearC, examples, sort, invariants, speciality, WAVE_W, WAVE_C2, mmT } from './tut-cxsym-lib.js';
import { boost, read } from './tut-matrix-w-lib.js';
import { quartic, peval, stars, clusters, nOf, M_OF_Z, dot, len, rad, deg } from './tut-spin-lib.js';

export { quartic, stars, clusters, nOf, dot, len, rad, deg, cx, abs2 };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const cdiv = (a, b) => { const d = abs2(b); return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cexp = (t) => [Math.cos(t), Math.sin(t)];
/** m(z) as three complex numbers. */
export const mOf = (z) => M_OF_Z.map((p) => peval(p, z));
/** The direction of travel of a null vector m: Re(i m x m*)/|m|^2. */
export function travel(m) {
	const mc = m.map(conj);
	const c = [0, 1, 2].map((i) => { const j = (i + 1) % 3, k = (i + 2) % 3; return sub(mul(m[j], mc[k]), mul(m[k], mc[j])); });
	const n2 = m.reduce((s, a) => s + abs2(a), 0);
	return c.map((v) => mul(cx(0, 1), v)[0] / n2);
}
const cdot = (a, b) => a.reduce((s, x, i) => add(s, mul(x, b[i])), cx(0));
const tapply = (T, v) => T.map((r) => r.reduce((s, a, j) => add(s, mul(a, v[j])), cx(0)));

// ---- the drawn direction --------------------------------------------------------------------------------------------
export const THETA = 55, PHI = 30;                         // degrees: from +z, and the azimuth
export const Z = scale(cexp(rad(PHI)), Math.tan(rad(THETA / 2)));
export const OPPOSITE = scale(cdiv(cx(1), conj(Z)), -1);   // -1/conj z

// ---- the six readings -----------------------------------------------------------------------------------------------
export const TYPES = ['I', 'II', 'D', 'III', 'N', 'O'];
export const EXAMPLES = { I: 'two masses', II: 'a mass and a wave along its line', D: 'one mass', III: 'the type III table', N: 'one wave', O: 'no field' };

// ---- the moving body -------------------------------------------------------------------------------------------------
export const BODY = { mass: 1, at: [-1.5, 0, 0], speed: 0.9, moves: [0, 1, 0] };   // for the pixel
/** The body's reading at the pixel moving through its frame at beta: Lambda W Lambda^T, the pixel moving along -y. */
export function movingReading(beta) {
	const r = len(BODY.at), n0 = BODY.at.map((x) => x / r), w = BODY.mass / r ** 3;
	const W = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cx(w * ((i === j ? 1 : 0) - 3 * n0[i] * n0[j]))));
	return beta === 0 ? W : read(boost(BODY.moves.map((x) => -x), Math.atanh(beta)), W);
}
/** The two pairs at the speed beta: [p+, p-], each with its count; p+ the one on the body's side. */
export function pairsAt(beta) {
	const g = clusters(stars(movingReading(beta)));
	const side = (p) => dot(p.n, BODY.at);
	return g.sort((a, b) => side(b) - side(a));
}

// ---- the numbers of the diagrams' comments, which the figures replace -------------------------------------------------
export const COMMENT = {
	stereo: ['about 55° from +ẑ and azimuth 30°', 'tan(27.5°) = 0.52', '"−1/z̄" in the plane (distance 1.92, azimuth 210°)'],
	skies: ['±(−0.797, 0.224, −0.561) and ±(0.887, 0.227, −0.401)', '(w = 0.125, c₂ = 0.05)', '(±0.484, 0, −0.875)'],
	moving: ['(±0.436, 0.9, 0)', '(0, 0.9, 0)', 'v = 0.9c']
};
export const FIGURES = [['tut-stereographic', 'stereographic'], ['tut-petrov-skies', 'petrov-skies'], ['tut-moving-pairs', 'moving-pairs']];

/** The chapter's statements behind the three figures, asserted against its text, and the numbers computed. */
export async function chapter(check) {
	const md = await (await fetch('/tutorial/one-point/petrov.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const comments = [...md.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1].replace(/\s+/g, ' '));
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);
	for (const [n, id] of FIGURES) {
		const drawn = flat.includes(`](${n}){#fig:${id}}`), planned = comments.some((c) => c.includes(`diagram: ${n} `));
		check(drawn !== planned, `the diagram ${n} is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
		if (drawn) check(flat.split(`(Figure [](#fig:${id}))`).length === 2, `not one pointer to fig:${id}`);
	}
	const comment = (n) => comments.find((c) => c.includes(`diagram: ${n} `)) ?? null;
	const fix3 = (v) => v.map((x) => (Math.abs(x) < 5e-4 ? 0 : x).toFixed(3)).join(', ');

	// ---- the sky as the complex plane
	has(String.raw`$$\sym{null-vector-z}{\vect m(z)} = \bigl(1 - z^2,\ i(1 + z^2),\ -2z\bigr) ,$$`, 'm(z)');
	has(String.raw`$$\boxed{\;\sym{sky-direction}{\hat k(z)} = \dfrac{\bigl(2\,\mathrm{Re}\,z,\ 2\,\mathrm{Im}\,z,\ 1 - |z|^2\bigr)}{1 + |z|^2}\;} \label{eq:direction}$$`, 'k(z)');
	has(String.raw`The directions of $z = 0$, $1$ and $i$ are $+\hat z$, $+\hat x$ and $+\hat y$, $z \to \infty$ gives $-\hat z$, and the circle $|z| = 1$ is the equator.`, 'the checks');
	has(String.raw`$$|z| = \tan\frac\vartheta2, \qquad \arg z = \varphi .$$`, 'the half angle');
	has(String.raw`So the direction opposite to $z$ is $-1/\bar z$`, 'the opposite direction');
	has(String.raw`$$\boxed{\;\vect m(z_1)\cdot\vect m(z_2) = -2(z_1 - z_2)^2 .\;} \label{eq:product}$$`, 'the product');
	for (const z of [cx(0.3, -0.7), cx(-1.2, 0.4), Z, cx(2.5, 1.1)]) {
		const m = mOf(z), k = travel(m), want = nOf(z);
		check(absC(cdot(m, m)) < 1e-12, 'm(z) is not null');
		check(k.every((v, i) => near(v, want[i], 1e-12)), `the direction of travel of m(z) is not k(z) at ${z}`);
		const o = scale(cdiv(cx(1), conj(z)), -1), mo = mOf(o), z2 = mul(conj(z), conj(z));
		check(mo.every((v, i) => nearC(v, scale(cdiv(conj(m[i]), z2), -1), 1e-12)), 'm(-1/conj z) is not -m(z)*/conj(z)^2');
		check(nOf(o).every((v, i) => near(v, -want[i], 1e-12)), 'k(-1/conj z) is not -k(z)');
		const z1 = cx(-0.4, 0.9);
		check(nearC(cdot(m, mOf(z1)), scale(mul(sub(z, z1), sub(z, z1)), -2), 1e-12), 'm(z1).m(z2) is not -2 (z1 - z2)^2');
		// the line from the south pole through k(z) meets z = 0 at (Re z, Im z)
		const t = 1 / (1 + want[2]), hit = [t * want[0], t * want[1], -1 + t * (want[2] + 1)];
		check(near(hit[0], z[0], 1e-12) && near(hit[1], z[1], 1e-12) && near(hit[2], 0, 1e-12), 'the line from the south pole does not meet the plane at z');
	}
	check([[cx(0), [0, 0, 1]], [cx(1), [1, 0, 0]], [cx(0, 1), [0, 1, 0]], [cx(1e9), [0, 0, -1]]].every(([z, n]) => nOf(z).every((v, i) => near(v, n[i], 1e-8))), 'z = 0, 1, i, infinity');
	for (let a = 0; a < 360; a += 15) check(near(nOf(cexp(rad(a)))[2], 0, 1e-15), '|z| = 1 is not the equator');
	// the drawn direction
	const kz = nOf(Z), ko = nOf(OPPOSITE);
	check(near(deg(Math.acos(kz[2])), THETA, 1e-9) && near(deg(Math.atan2(kz[1], kz[0])), PHI, 1e-9), 'k(z) is not at 55 degrees and the azimuth 30');
	check(Math.sqrt(abs2(Z)).toFixed(2) === '0.52' && Math.sqrt(abs2(OPPOSITE)).toFixed(2) === '1.92' && near(deg(Math.atan2(OPPOSITE[1], OPPOSITE[0])) + 360, 210, 1e-9), `z = ${Z}, -1/conj z = ${OPPOSITE}`);
	check(ko.every((v, i) => near(v, -kz[i], 1e-12)), 'the opposite is not -k');
	{
		// the quartic of a wave along k(z): a fourfold root at z
		const m = mOf(Z), W = m.map((a) => m.map((b) => mul(a, b)));
		let poly = quartic(W);
		const big = Math.max(...poly.map((a) => absC(a)));
		for (let order = 0; order < 4; order++) {
			check(absC(peval(poly, Z)) < 1e-12 * big, `the wave's quartic's derivative ${order} does not vanish at z`);
			poly = poly.slice(1).map((a, j) => scale(a, j + 1));
		}
		check(absC(peval(poly, Z)) > 1e-3 * big, 'the wave\'s quartic vanishes to more than fourth order');
	}
	const c1 = comment('tut-stereographic');
	if (c1) check(COMMENT.stereo.every((s) => c1.includes(s)), 'the first comment\'s numbers');

	// ---- the six readings and their types
	has(String.raw`Solving the quartic gives the figure's two lines of marks, $\pm(-0.797, 0.224, -0.561)$ and $\pm(0.887, 0.227, -0.401)$.`, 'the pair\'s directions');
	has(String.raw`has the quartic $2z^2(\curv c_2z^2 - 6\curv w)$: two roots at $z = 0$, and two that split from $-\hat z$ to $z = \pm(6\curv w/\curv c_2)^{1/2} = \pm3.87$, the directions $(\pm0.484, 0, -0.875)$, for 9.2's $\curv w = 0.125$ and $\curv c_2 = 0.05$.`, 'type II');
	has(String.raw`gives $2m_3(m_1 + im_2) = 2(-2z)(-2z^2) = 8z^3$, with $m_k$ the components of $\vect m(z)$: three roots at $z = 0$ and one at infinity.`, 'type III');
	has(String.raw`On the $z$ axis the bracket is $-2z$ and the quartic $-12\curv wz^2$: a double root at $z = 0$, and two roots at infinity, $-\hat z$.`, 'type D');
	has('One root four times: all four directions lie on the wave\'s direction of travel.', 'type N');
	has(String.raw`**type O**, no field, where the quartic vanishes for every $z$ and singles out nothing`, 'type O');
	for (const [t, pattern, example] of [['I', 'four separate', 'two masses'], ['II', 'two together, two apart', 'a mass and a wave along its line'], ['D', 'two pairs', String.raw`one mass, if $\curv w > 0$`], ['III', 'three together, one apart', 'the type III table'], ['N', 'four together', 'one wave'], ['O', 'none singled out', 'no field']]) {
		has(`| ${t} | ${pattern} |`, `the table's row ${t}`);
		has(`| ${example} |`, `the table's example of ${t}`);
		check(EXAMPLES[t] === example.replace(String.raw`, if $\curv w > 0$`, ''), `the example of ${t}`);
	}
	const ex = examples();
	check(absC(sub(ex.II[0][0], cx(WAVE_W + WAVE_C2 / 2))) < 1e-15 && WAVE_W === 0.125 && WAVE_C2 === 0.05, 'type II is not w (1 - 3 z z^T) + c2 m m^T');
	{
		const want = tadd(tscale([[1, 0, 0], [0, 1, 0], [0, 0, -2]].map((r) => r.map((v) => cx(v))), WAVE_W), tscale(mmT(), WAVE_C2));
		check(ex.II.every((r, i) => r.every((v, j) => nearC(v, want[i][j], 1e-15))), 'type II\'s table');
	}
	const skies = {};
	for (const t of TYPES) {
		const W = ex[t], q = quartic(W);
		const leaf = sort(W).leaf;
		check(leaf === t, `9.2's sort puts the example of ${t} in ${leaf}`);
		if (t === 'O') {
			check(q.every((a) => absC(a) === 0), 'the quartic of O is not zero');
			skies[t] = { W, groups: [], pattern: [] };
			continue;
		}
		const list = stars(W);
		for (const s of list) if (s.z) check(absC(peval(q, s.z)) < 1e-9 * Math.max(...q.map(absC)), `${t}: ${s.z} is not a root`);
		const groups = clusters(list, 1e-5);
		const pattern = groups.map((g) => g.count).sort((a, b) => b - a).join('');
		check(pattern === { I: '1111', II: '211', D: '22', III: '31', N: '4' }[t], `${t}: the roots fall as ${pattern}`);
		check(groups.every((g) => near(len(g.n), 1, 1e-9)), `${t}: a direction off the sky`);
		skies[t] = { W, groups, pattern };
	}
	{
		const g = skies.I.groups, a = ['-0.797, 0.224, -0.561', '0.797, -0.224, 0.561', '0.887, 0.227, -0.401', '-0.887, -0.227, 0.401'];
		check(a.every((s) => g.some((q) => fix3(q.n) === s)), `I: the directions ${g.map((q) => fix3(q.n))}`);
		for (const s of g) check(g.some((q) => len(q.n.map((v, i) => v + s.n[i])) < 1e-9), 'I: a direction without its opposite');
		const sp = speciality(invariants(skies.I.W));
		check(sp[0].toFixed(3) === '0.553' && near(sp[1], 0), `I: 1 - 6 J^2/I^3 = ${sp}`);
		const up = (n) => skies[n].groups.find((q) => near(q.n[2], 1, 1e-9)), down = (n) => skies[n].groups.find((q) => near(q.n[2], -1, 1e-9));
		check(up('II').count === 2 && skies.II.groups.filter((q) => q.count === 1).every((q) => fix3(q.n) === '0.484, 0.000, -0.875' || fix3(q.n) === '-0.484, 0.000, -0.875'), `II: ${skies.II.groups.map((q) => fix3(q.n))}`);
		check(skies.II.groups.filter((q) => q.count === 1).every((q) => Math.sqrt(abs2(q.z)).toFixed(2) === '3.87' && near(Math.sqrt(abs2(q.z)), Math.sqrt((6 * WAVE_W) / WAVE_C2), 1e-9)), 'II: the roots +-3.87');
		check(up('D').count === 2 && down('D').count === 2, 'D: not two at each pole');
		check(up('III').count === 3 && down('III').count === 1, 'III: not three at +z and one at -z');
		check(up('N').count === 4, 'N: not four at +z');
		// the quartics themselves
		const isPoly = (q, want, what) => check(q.length === 5 && q.every((a, k) => nearC(a, cx(want[k] ?? 0), 1e-12)), `${what}: the quartic is ${JSON.stringify(q)}`);
		isPoly(quartic(ex.D), [0, 0, -12, 0, 0], 'D');
		isPoly(quartic(ex.III), [0, 0, 0, 8, 0], 'III');
		isPoly(quartic(ex.II), [0, 0, -12 * WAVE_W, 0, 2 * WAVE_C2], 'II');
		isPoly(quartic(ex.N), [0, 0, 0, 0, 4], 'N');
	}
	const c2 = comment('tut-petrov-skies');
	if (c2) check(COMMENT.skies.every((s) => c2.includes(s)) && Object.values(EXAMPLES).every((s) => c2.includes(`"${s}"`)), 'the second comment\'s numbers and lines');

	// ---- the boost
	has(String.raw`it reads $\Lambda\curv{\mathcal W}\Lambda^{\mathsf T}$ with $\sym{complex-boost}{\Lambda} = \exp(-i\obs\eta\,\hat z\cdot\mathbf L)$`, 'the boost');
	has(String.raw`$$\boxed{\;\Lambda\,\vect m(z) = e^{-\obs\eta}\,\vect m\bigl(z\,e^{\obs\eta}\bigr) .\;} \label{eq:boost-z}$$`, 'eq:boost-z');
	has(String.raw`**Its roots are the old roots times $e^{\obs\eta}$.**`, 'the roots times e^eta');
	has(String.raw`**Check:** for the figure's two masses at $\obs\eta = 0.7$, all four roots grow by $2.01375 = e^{0.7}$.`, 'the check at eta = 0.7');
	has('A mark shows where a wave would travel to, so the marks slide behind the pixel', 'the convention of the marks');
	for (const eta of [0.3, 0.7, 1.4]) {
		const L = boost([0, 0, 1], eta);
		for (const z of [cx(0.3, -0.7), cx(-1.2, 0.4), Z]) {
			const lhs = tapply(L, mOf(z)), rhs = mOf(scale(z, Math.exp(eta))).map((v) => scale(v, Math.exp(-eta)));
			check(lhs.every((v, i) => nearC(v, rhs[i], 1e-12)), `Lambda m(z) is not e^-eta m(z e^eta) at eta = ${eta}`);
		}
	}
	{
		const eta = 0.7, before = stars(skies.I.W), after = stars(read(boost([0, 0, 1], eta), skies.I.W));
		check(Math.exp(eta).toFixed(5) === '2.01375', 'e^0.7');
		for (const s of before) check(after.some((q) => q.z && absC(sub(q.z, scale(s.z, Math.exp(eta)))) < 1e-9), 'a root of the pair does not grow by e^0.7');
	}

	// ---- the moving body
	has(String.raw`A body as in the figure, at $1.5$ along $-\hat x$ and moving along $+\hat y$ at $0.9c$, has the directions $(\pm0.436, 0.9, 0)$, each twice: the half sum is $(0, 0.9, 0)$, and the half difference has the length $0.436 = (1 - 0.81)^{1/2}$`, 'the moving body');
	has(String.raw`\tfrac12(\hat p_+ + \hat p_-) = \frac{\obs{\vect v}_\perp}{c},\\ \tfrac12(\hat p_+ - \hat p_-) = \pm\Bigl(1 - \frac{\obs v_\perp^2}{c^2}\Bigr)^{1/2}\hat n ,`, 'the half sum and the half difference');
	has(String.raw`For the pixel the body moves with $\obs{\vect v} = -c\obs{\vect\beta}$`, 'v = -c beta');
	has(String.raw`with the upper signs for $\sym{pnd-pairs}{\hat p_+}$ and the lower for $\hat p_-$`, 'p+ and p-');
	const moving = pairsAt(BODY.speed);
	check(moving.length === 2 && moving.every((g) => g.count === 2), 'the moving body\'s directions are not two pairs');
	check(fix3(moving[0].n) === '-0.436, 0.900, 0.000' && fix3(moving[1].n) === '0.436, 0.900, 0.000', `the moving pairs ${moving.map((g) => fix3(g.n))}`);
	check(sort(movingReading(BODY.speed)).leaf === 'D', 'the moving body is not of type D');
	check(Math.max(...movingReading(BODY.speed).flat().map((z) => Math.abs(z[1]))) > 0.05, 'the moving body\'s reading is not complex');
	// p+ from the paper's eq:proof-stars: [n_perp + gamma (a/beta - beta) beta^] / gamma (1 - a), beta the pixel's
	{
		const b = BODY.speed, bh = BODY.moves.map((x) => -x), n0 = BODY.at.map((x) => x / len(BODY.at)), a = b * dot(bh, n0), g = 1 / Math.sqrt(1 - b * b);
		const nperp = n0.map((x, i) => x - dot(n0, bh) * bh[i]);
		const pp = nperp.map((x, i) => (x + g * (a / b - b) * bh[i]) / (g * (1 - a))), pm = nperp.map((x, i) => (-x + g * (-a / b - b) * bh[i]) / (g * (1 + a)));
		check(len(pp.map((v, i) => v - moving[0].n[i])) < 1e-6 && len(pm.map((v, i) => v - moving[1].n[i])) < 1e-6, 'the pairs are not eq:proof-stars\'s p+ and p-');
		check(a === 0 || near(a, 0, 1e-15), 'the body does not move across the line');
	}
	const half = [0, 1, 2].map((i) => (moving[0].n[i] + moving[1].n[i]) / 2), diff = [0, 1, 2].map((i) => (moving[0].n[i] - moving[1].n[i]) / 2);
	check(fix3(half) === '0.000, 0.900, 0.000' && near(half[1], BODY.speed, 1e-7), `the half sum ${half}`);
	const now = BODY.at.map((x) => x / len(BODY.at));
	check(len(cross(diff, now)) < 1e-7 && dot(diff, now) > 0 && near(len(diff), Math.sqrt(1 - BODY.speed ** 2), 1e-7) && len(diff).toFixed(3) === '0.436', `the half difference ${diff}`);
	check(near(dot(half, diff), 0, 1e-7) && near(dot(half, half) + dot(diff, diff), 1, 1e-7), 'the half sum and the half difference');
	const track = Array.from({ length: 91 }, (_, k) => (BODY.speed * k) / 90).map((b) => ({ b, pairs: pairsAt(b) }));
	for (const { b, pairs } of track) {
		check(pairs.length === 2 && pairs.every((g) => g.count === 2 && near(g.n[2], 0, 1e-7) && near(len(g.n), 1, 1e-9)), `the pairs at ${b} are off the great circle z = 0`);
		check(pairs.every((g) => near(g.n[1], b, 1e-7)), `the pairs at ${b} do not have the y component ${b}`);
	}
	check(near(track[0].pairs[0].n[0], -1, 1e-7) && near(track[0].pairs[1].n[0], 1, 1e-7), 'the pairs at rest are not +-x');
	{
		const data = await (await fetch('/reference/results/figures/stars.json')).json();
		check(JSON.stringify(data.body) === JSON.stringify(BODY.at) && data.beta === BODY.speed, 'the body is not the paper\'s');
		const end = data.gravity.track[data.gravity.track.length - 1];
		check(end.stars.every(([n, c]) => c === 2 && moving.some((g) => len(g.n.map((v, i) => v - n[i])) < 1e-6)), 'the moving pairs are not the paper\'s');
		check(len(end.midpoint.map((v, i) => v - half[i])) < 1e-6, 'the half sum is not the paper\'s midpoint');
	}
	const c3 = comment('tut-moving-pairs');
	if (c3) check(COMMENT.moving.every((s) => c3.includes(s)), 'the third comment\'s numbers');

	return { kz, ko, skies, moving, half, diff, now, track };
}
