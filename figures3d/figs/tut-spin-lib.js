// Shared numbers and marks for the two diagrams of the tutorial's chapter 8.4 (tutorial/quantum/spin.md):
// tut-bloch-sphere and tut-majorana-three. Not a figure itself. The colour roles are chapter 7.8's, read from app.css
// by `palette(check)` (figs/tut-quantum-lib.js, 8.1's): the curvature's for a reading's stars, ink and the page's
// greys for everything else; orange and blue, which mean a stretch and a squeeze, are not used. The complex numbers
// are 8.1's, the sheet, strokes, labels and cropping those of chapters 6.1 to 8.3 (figs/tut-pot-lib.js), and the sky
// is drawn as chapter 6.6's figure of light's two directions draws it (figs/tut-maxwell-sky.js, after the paper's
// figs/stars.js): an outline, a veil of the page's neutral tint over everything behind it, great circles solid in
// front and dashed behind, coincident stars as touching dots. All imported or followed, not copied, except the sky's
// few constants, which are 6.6's.
//
// `chapter(check)` asserts the chapter's statements that a figure draws or its caption prints, against the chapter's
// own text (fetched, outside its comments), and computes the numbers behind them:
//  - a spin one half: |n> = (cos(theta/2), e^{i phi} sin(theta/2)) has the outcome +1 of n.sigma and the mean spin
//    <sigma> = n; two directions 60 degrees apart have |<n1|n2>|^2 = cos^2 30 = (1 + n1.n2)/2 = 0.75; opposite
//    points are orthogonal (<up|down> = 0);
//  - the mixture half |up>, half |+x>: rho = (1/2)(|up><up| + |+x><+x|), b = tr(rho sigma) = (1/2, 0, 1/2), of
//    length 1/sqrt 2 = 0.71, inside the sphere;
//  - a reading W = E + iB: its stars are the roots of the quartic m(z)^T W m(z) = 2 p(z), m(z) = (1 - z^2,
//    i(1 + z^2), -2z), mapped to the sky by n(z) = (2 Re z, 2 Im z, 1 - |z|^2)/(1 + |z|^2), a root lost from the
//    top (the quartic's degree falling) a star at -z; for one wave along z (W = m m^T, m = (1, i, 0)/sqrt 2) the
//    quartic is 2 z^4 and the four stars sit at the north pole; for one body on the z axis (W = diag(1, 1, -2)) it is
//    -12 z^2, two stars at each pole; for the body and a wave along its line with E+ = w, 4 z^4 - 12 z^2, two stars
//    at the pole and two at (+-0.87, 0, -0.5), 120 degrees from it;
//  - the Bloch vector of one spin, b = P/u, with P_k = eps_kij (E B)_ij and u = (|E|^2 + |B|^2)/2: |b| = 1, 0 and
//    2/5 = 0.4 for the three, along +z; and the same b found the other way, as the Bloch vector of one of the four
//    spins one half of the symmetric state whose stars these are (the product of the four states |n_j>, summed over
//    every order, its partial trace over three of them).
import { CURV, palette, cx, add, mul, conj, scale, abs2, expi } from './tut-quantum-lib.js';
import { RULE, PAGE } from '../lib.js';

export { CURV, palette, cx, add, mul, conj, scale, abs2, expi };

export const near = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;
const nearC = (a, b, tol = 1e-12) => near(a[0], b[0], tol) && near(a[1], b[1], tol);
export const rad = (d) => (d * Math.PI) / 180;
export const deg = (r) => (r * 180) / Math.PI;
export const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
export const len = (u) => Math.hypot(...u);

// ---- a spin one half -------------------------------------------------------------------------------------------
/** The direction of polar angle theta and azimuth phi (degrees). */
export const dir = (theta, phi) => [Math.sin(rad(theta)) * Math.cos(rad(phi)), Math.sin(rad(theta)) * Math.sin(rad(phi)), Math.cos(rad(theta))];
/** Spin up along (theta, phi): (cos theta/2, e^{i phi} sin theta/2). */
export const ket = (theta, phi) => [cx(Math.cos(rad(theta) / 2)), scale(expi(rad(phi)), Math.sin(rad(theta) / 2))];
/** <a|b> for two states of a spin one half. */
export const bra = (a, b) => add(mul(conj(a[0]), b[0]), mul(conj(a[1]), b[1]));
/** The Pauli matrices. */
export const SIGMA = [
	[[cx(0), cx(1)], [cx(1), cx(0)]],
	[[cx(0), cx(0, -1)], [cx(0, 1), cx(0)]],
	[[cx(1), cx(0)], [cx(0), cx(-1)]]
];
const mat = (T, v) => T.map((row) => row.reduce((s, t, j) => add(s, mul(t, v[j])), cx(0)));
/** tr(rho A) for 2 x 2 tables. */
const trace = (rho, A) => [0, 1].reduce((s, i) => [0, 1].reduce((t, j) => add(t, mul(rho[i][j], A[j][i])), s), cx(0));
/** The Bloch vector of a density matrix, b_k = tr(rho sigma_k). */
export const blochOf = (rho) => SIGMA.map((s) => { const v = trace(rho, s); return v[0]; });
/** |psi><psi|. */
const proj = (psi) => psi.map((a) => psi.map((b) => mul(a, conj(b))));

// the drawn states: |n1> and |n2>, 60 degrees apart in one vertical plane; the mixture half |up>, half |+x>
export const THETA1 = 40, APART = 60, THETA2 = THETA1 + APART;
export const MIX = { up: [0, 0], plusX: [90, 0] };

// ---- a reading and its stars -----------------------------------------------------------------------------------
/** Polynomials in z with complex coefficients, lowest power first. */
const padd = (p, q) => Array.from({ length: Math.max(p.length, q.length) }, (_, k) => add(p[k] ?? cx(0), q[k] ?? cx(0)));
const pmul = (p, q) => {
	const r = Array.from({ length: p.length + q.length - 1 }, () => cx(0));
	p.forEach((a, i) => q.forEach((b, j) => { r[i + j] = add(r[i + j], mul(a, b)); }));
	return r;
};
const pscale = (p, c) => p.map((a) => mul(a, c));
/** Chapter 6.6's null vector m(z) = (1 - z^2, i(1 + z^2), -2z), as three polynomials. */
export const M_OF_Z = [[cx(1), cx(0), cx(-1)], [cx(0, 1), cx(0), cx(0, 1)], [cx(0), cx(-2)]];
/** The complex reading W = E + iB from two real symmetric tables. */
export const reading = (E, B) => E.map((row, i) => row.map((e, j) => cx(e, B[i][j])));
/** The quartic m(z)^T W m(z), its coefficients lowest first. */
export function quartic(W) {
	let q = [cx(0)];
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) q = padd(q, pscale(pmul(M_OF_Z[i], M_OF_Z[j]), W[i][j]));
	return q;
}
/** The value of a polynomial at z. */
export const peval = (p, z) => p.reduceRight((s, a) => add(mul(s, z), a), cx(0));
const cdiv = (a, b) => { const d = abs2(b); return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
/** The roots of a polynomial whose top coefficient is not zero (Durand and Kerner), after the roots at z = 0. */
function rootsOf(p) {
	let lo = 0;
	const roots = [];
	while (abs2(p[lo]) === 0) { roots.push(cx(0)); lo++; }
	const q = p.slice(lo), n = q.length - 1;
	if (n === 0) return roots;
	const top = q[n], monic = q.map((a) => cdiv(a, top));
	let z = Array.from({ length: n }, (_, k) => mul(cx(0.4, 0.9), expi((2 * Math.PI * k) / n + 0.3)));
	for (let it = 0; it < 500; it++) {
		z = z.map((zi, i) => {
			let den = cx(1);
			z.forEach((zj, j) => { if (j !== i) den = mul(den, add(zi, scale(zj, -1))); });
			return add(zi, scale(cdiv(peval(monic, zi), den), -1));
		});
	}
	return roots.concat(z);
}
/** Chapter 6.6's stereographic map from z to the sky. */
export const nOf = (z) => { const q = abs2(z); return [(2 * z[0]) / (1 + q), (2 * z[1]) / (1 + q), (1 - q) / (1 + q)]; };
const SOUTH = [0, 0, -1];
/** The four stars of a reading: the roots of its quartic, mapped, and a star at the south pole for each root lost
 * from the top. Returned with their roots (null for a lost root). */
export function stars(W, tol = 1e-12) {
	const q = quartic(W);
	const scaleOf = Math.max(...q.map((a) => Math.sqrt(abs2(a))));
	let deg = 4;
	while (deg > 0 && Math.sqrt(abs2(q[deg])) <= tol * scaleOf) deg--;
	const rs = rootsOf(q.slice(0, deg + 1).map((a) => (Math.sqrt(abs2(a)) <= tol * scaleOf ? cx(0) : a)));
	return [...rs.map((z) => ({ z, n: nOf(z) })), ...Array.from({ length: 4 - deg }, () => ({ z: null, n: SOUTH }))];
}
/** Stars grouped by place: [{ n, count }]. */
export function clusters(list, tol = 1e-6) {
	const out = [];
	for (const s of list) {
		const c = out.find((o) => len(o.n.map((v, k) => v - s.n[k])) < tol);
		if (c) c.count++; else out.push({ n: s.n.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)), z: s.z, count: 1 });
	}
	return out;
}
/** The paper's super-Poynting vector P_k = eps_kij (E B)_ij and super-energy u = (|E|^2 + |B|^2)/2. */
export function superPoynting(E, B) {
	const EB = E.map((row, i) => [0, 1, 2].map((j) => row.reduce((s, e, k) => s + e * B[k][j], 0)));
	const P = [EB[1][2] - EB[2][1], EB[2][0] - EB[0][2], EB[0][1] - EB[1][0]];
	const fro = (T) => T.flat().reduce((s, v) => s + v * v, 0);
	return { P, u: 0.5 * (fro(E) + fro(B)) };
}
/** The Bloch vector of one of four spins one half in the symmetric state with these stars: the product of the four
 * states |n_j>, summed over every order of its factors, scaled to length one, and traced over the last three. */
export function blochOfStars(list) {
	const kets = list.map(({ z }) => {
		if (z === null) return [cx(0), cx(1)];
		const s = 1 / Math.sqrt(1 + abs2(z));
		return [cx(s), scale(z, s)];
	});
	const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
	const psi = Array.from({ length: 16 }, () => cx(0));
	for (const p of perms([0, 1, 2, 3])) for (let k = 0; k < 16; k++) {
		let a = cx(1);
		for (let s = 0; s < 4; s++) a = mul(a, kets[p[s]][(k >> (3 - s)) & 1]);
		psi[k] = add(psi[k], a);
	}
	const norm = Math.sqrt(psi.reduce((s, a) => s + abs2(a), 0));
	const v = psi.map((a) => scale(a, 1 / norm));
	const rho = [0, 1].map((i) => [0, 1].map((j) => {
		let s = cx(0);
		for (let r = 0; r < 8; r++) s = add(s, mul(v[i * 8 + r], conj(v[j * 8 + r])));
		return s;
	}));
	return blochOf(rho);
}

// the three readings, in units of the body's w (w = 1): one wave along z; one body on the z axis; the body and a
// wave along its line with the tide E+ = w (the paper's type II)
const Z3 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
const WAVE_E = [[1, 0, 0], [0, -1, 0], [0, 0, 0]], WAVE_B = [[0, 1, 0], [1, 0, 0], [0, 0, 0]];
const BODY_E = [[1, 0, 0], [0, 1, 0], [0, 0, -2]];
const sum = (A, B) => A.map((row, i) => row.map((v, j) => v + B[i][j]));
export const READINGS = [
	{ key: 'wave', E: WAVE_E, B: WAVE_B },
	{ key: 'body', E: BODY_E, B: Z3 },
	{ key: 'both', E: sum(BODY_E, WAVE_E), B: WAVE_B }
];

// ---- the sky, as chapter 6.6 draws it ---------------------------------------------------------------------------
export const SKY = '#eeebe5', VEIL = 0.72;   // the paper's veil (drawing.ts, THEME: a neutral tint of the page)
export const OUTLINE = 0.5, CIRCLE = 0.4;   // the sky's outline, its great circles
export const FAINT_CIRCLE = 0.6;            // the great circles in front: their opacity
export const BEHIND_DASH = [1.2, 1.6];      // a curve behind the sky
export const STAR = 2.4, STAR_EDGE = 0.45, STAR_STEP = 0.9;   // a star's dot, its rim, touching dots' offset in radii

/** An orthographic view from the azimuth `az` and elevation `el` (degrees), z up: returns [right, up, toward the
 * reader] for a point of space. */
export function view(az, el) {
	const a = rad(az), e = rad(el);
	const c = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
	const r = [-Math.sin(a), Math.cos(a), 0];
	const u = [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)];
	return (p) => [dot(p, r), dot(p, u), dot(p, c)];
}

/** A sky of radius R points centred at c on the Sheet S, seen by `v`: at(p) is a point of space on the page (y down),
 * front(p) whether a point of the sky faces the reader. */
export function sky(S, check, c, R, v) {
	const at = (p) => { const q = v(p); return [c[0] + q[0] * R, c[1] - q[1] * R]; };
	const front = (p) => v(p)[2] > 0;
	// the view is a turn: a unit vector stays a unit vector
	for (const p of [[0.6, 0.48, 0.64], [0, 0, 1], [1, 0, 0]]) check(near(len(v(p)), 1, 1e-12), 'the view is not a turn');
	/** A curve on the sky, split where it passes behind: solid in front (at `layer`, at `opacity`), dashed behind,
	 * where the veil covers it. */
	function runs(pts, what, { color = RULE, width = CIRCLE, layer = 1, opacity = FAINT_CIRCLE } = {}) {
		let run = [], vis = null, n = 0;
		const flush = () => {
			if (run.length < 2) return;
			const q = run.map(at);
			if (vis) {
				S.raw(`<path d="M${q.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}"/>`, layer);
				S.mark(q, width / 2, `${what}, part ${n++}`);
			} else S.path(q, { color, width: width * 0.85, layer: 0.3, dash: BEHIND_DASH, cap: 'butt', what: `${what}, part ${n++} behind` });
		};
		for (const p of pts) {
			check(near(len(p), 1, 1e-12), `${what}: a point off the sky`);
			const f = front(p);
			if (vis !== null && f !== vis) { run.push(p); flush(); run = [p]; } else run.push(p);
			vis = f;
		}
		flush();
	}
	/** The veil and the outline. */
	function veil() {
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="${SKY}" fill-opacity="${VEIL}"/>`, 0.5);
		S.raw(`<circle cx="${c[0].toFixed(2)}" cy="${c[1].toFixed(2)}" r="${R}" fill="none" stroke="${RULE}" stroke-width="${OUTLINE}"/>`, 0.6);
		S.mark(Array.from({ length: 361 }, (_, k) => [c[0] + R * Math.cos(rad(k)), c[1] + R * Math.sin(rad(k))]), OUTLINE / 2, 'the sky');
	}
	/** The equator. */
	function equator() {
		runs(Array.from({ length: 721 }, (_, k) => [Math.cos(rad(k / 2)), Math.sin(rad(k / 2)), 0]), 'the equator');
	}
	/** A dot of radius r at a point p of space, under the veil if p is a point of the sky that faces away. */
	function dot(p, r, { fill, stroke = PAGE, width = STAR_EDGE, offset = [0, 0], what = 'a dot', behind } = {}) {
		const q0 = at(p), q = [q0[0] + offset[0], q0[1] + offset[1]];
		const back = behind ?? !front(p);
		S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`, back ? 0.4 : 5);
		S.mark([q], r + width / 2, what);
		return q;
	}
	/** A star of multiplicity n at p: n touching dots, as the paper's figure draws them, so that they can be counted. */
	function star(p, n, color, what) {
		const s = STAR * STAR_STEP;
		const at = { 1: [[0, 0]], 2: [[-s, 0], [s, 0]], 4: [[-s, -s], [s, -s], [-s, s], [s, s]] }[n];
		check(at !== undefined, `${what}: no drawing for a star of multiplicity ${n}`);
		return at.map((o, i) => dot(p, STAR, { fill: color, offset: o, what: `${what}, dot ${i}` }));
	}
	return { at, front, runs, veil, equator, dot, star, c, R };
}

// ---- the chapter's text and numbers --------------------------------------------------------------------------------
export async function chapter(check) {
	const md = await (await fetch('/tutorial/quantum/spin.md')).text();
	const flat = md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ');
	const has = (s, what) => check(flat.includes(s), `the chapter does not say ${what}: ${s}`);

	// ---- a spin one half
	has('$$\\sym{spin-direction-state}{|\\hat n\\rangle} = \\begin{pmatrix}\\cos\\tfrac\\vartheta2\\\\ e^{i\\varphi}\\sin\\tfrac\\vartheta2\\end{pmatrix}$$', 'the state |n>');
	has('so $\\langle\\boldsymbol\\sigma\\rangle = \\hat n$', 'the mean spin');
	has('$$\\boxed{|\\langle\\hat n_1|\\hat n_2\\rangle|^2 = \\cos^2\\frac{\\vartheta_{12}}{2} = \\tfrac12\\bigl(1 + \\hat n_1\\cdot\\hat n_2\\bigr)} .$$', 'the overlap');
	has('For directions 60° apart it is $\\cos^230° = 0.75$: a spin prepared up along one is found up along the other three times in four.', 'the overlap at 60 degrees');
	has('at 180° it is zero, so opposite points of the sphere are orthogonal states', 'that opposite points are orthogonal');
	has('$$\\boxed{\\varrho = \\tfrac12\\bigl(1 + \\mathbf b\\cdot\\boldsymbol\\sigma\\bigr)} .$$', 'the density matrix');
	has('Half $|{\\uparrow}\\rangle$ and half spin up along $x$ give $\\mathbf b = \\tfrac12(\\hat z + \\hat x)$, of length $1/\\sqrt2 = 0.71$, because mixing averages the arrows.', 'the mixture');
	for (const [t, p] of [[THETA1, 17], [THETA2, 17], [0, 0], [180, 0], [90, 0], [63, 211]]) {
		const k = ket(t, p), n = dir(t, p);
		const nsig = SIGMA.reduce((T, s, i) => T.map((row, a) => row.map((v, b) => add(v, scale(s[a][b], n[i])))), [[cx(0), cx(0)], [cx(0), cx(0)]]);
		const out = mat(nsig, k);
		check(nearC(out[0], k[0]) && nearC(out[1], k[1]), `|n> at (${t}, ${p}) is not the eigenvector of n.sigma with +1`);
		const b = blochOf(proj(k));
		check(b.every((v, i) => near(v, n[i])), `<sigma> is not n at (${t}, ${p})`);
		check(near(abs2(k[0]) + abs2(k[1]), 1), 'a state of length other than one');
	}
	const overlaps = [0, 30, 145, 211].map((phi) => {
		const a = ket(THETA1, phi), b = ket(THETA2, phi), n1 = dir(THETA1, phi), n2 = dir(THETA2, phi);
		check(near(deg(Math.acos(dot(n1, n2))), APART, 1e-9), `the two directions are not ${APART} degrees apart`);
		const o = abs2(bra(a, b));
		check(near(o, Math.cos(rad(APART / 2)) ** 2) && near(o, 0.5 * (1 + dot(n1, n2))), `|<n1|n2>|^2 = ${o}`);
		return o;
	});
	check(overlaps[0].toFixed(2) === '0.75' && (Math.cos(rad(30)) ** 2).toFixed(2) === '0.75', 'cos^2 30 is not 0.75');
	check(near(abs2(bra(ket(0, 0), ket(180, 0))), 0, 1e-30) && near(abs2(bra(ket(70, 40), ket(110, 220))), 0), 'opposite points are not orthogonal');
	const rho = [0, 1].map((i) => [0, 1].map((j) => scale(add(proj(ket(...MIX.up))[i][j], proj(ket(...MIX.plusX))[i][j]), 0.5)));
	const mix = blochOf(rho);
	check(near(mix[0], 0.5) && near(mix[1], 0) && near(mix[2], 0.5), `the mixture's b is ${mix}`);
	check(len(mix).toFixed(2) === '0.71' && near(len(mix), 1 / Math.SQRT2), `|b| = ${len(mix)}`);

	// ---- a reading's stars and one spin's Bloch vector
	has('$\\vect m(z) = (1 - z^2,\\ i(1 + z^2),\\ -2z)$', 'm(z)');
	has('$\\hat n(z) = (2\\,\\mathrm{Re}\\,z,\\ 2\\,\\mathrm{Im}\\,z,\\ 1 - |z|^2)/(1 + |z|^2)$', 'the stereographic map');
	has('a root missing because the top coefficient vanishes is a star at $-\\hat z$', 'the lost roots');
	has('$$\\vect m(z)^{\\mathsf T}\\curv{\\mathcal W}\\,\\vect m(z) = 2\\,p(z) .$$', 'the quartic');
	has('(\\vect m\\cdot\\vect m(z))^2 = 2z^4$, whose four roots are $z = 0$: the north pole, the direction of travel', 'the wave\'s quartic');
	has('$\\curv{\\mathcal W} \\propto \\mathrm{diag}(1, 1, -2)$ gives $(1 - z^2)^2 - (1 + z^2)^2 - 8z^2 = -12z^2$: two stars at the north pole, and two missing roots, which are stars at the south pole', 'the body\'s quartic');
	has('$\\sym{super-poynting}{P_k} = \\epsilon_{kij}(\\curv{\\tE}\\curv{\\tB})_{ij}$', 'P');
	has('$\\sym{super-energy}{u} = \\tfrac12(|\\curv{\\tE}|^2 + |\\curv{\\tB}|^2)$', 'u');
	has('so one spin has the Bloch vector $\\mathbf b = \\mathbf P/u$, a pure number', 'b = P/u');
	has('so $\\mathbf b = \\hat k$ and $|\\mathbf P| = u$: one spin is pure', 'the wave\'s b');
	has('Then $\\curv{\\tB} = 0$, so $\\mathbf P = 0$ and each spin is unpolarized', 'the body\'s b');
	has('$\\curv{\\mathcal W}_{\\rm body} = \\curv w\\,\\mathrm{diag}(1, 1, -2)$', 'the body\'s reading');
	has('with the tide $\\curv{\\tE}_+ = \\curv w$, so that $\\curv{\\tE}_{\\rm wave} = \\curv w\\,\\mathrm{diag}(1, -1, 0)$ and $\\curv{\\tB}_{\\rm wave} = \\curv w(\\hat x\\hat y^{\\mathsf T} + \\hat y\\hat x^{\\mathsf T})$', 'the wave\'s reading');
	has('The wave alone gives $\\mathbf P = 2\\curv w^2\\hat z$, and the body adds nothing', 'P of the body and the wave');
	has('The super-energy is $u = 3\\curv w^2$ from the body plus $2\\curv w^2$ from the wave, with no cross term, so $|\\mathbf P|/u = 2/5 = 0.4$. Two stars stay on the wave\'s direction, and the other two move to 120° from it.', 'the body and the wave');

	// the quartic, from m(z) and W, against the chapter's three
	const S2 = 1 / Math.SQRT2, m = [cx(S2), cx(0, S2), cx(0)];
	const Wm = m.map((a) => m.map((b) => mul(a, b)));
	const isPoly = (q, want, what) => check(q.length === 5 && q.every((a, k) => nearC(a, cx(want[k] ?? 0), 1e-12)), `${what}: the quartic is ${JSON.stringify(q)}`);
	isPoly(quartic(Wm), [0, 0, 0, 0, 2], 'm m^T');
	for (const z of [cx(0.3, -0.7), cx(-1.2, 0.4)]) {
		const mz = M_OF_Z.map((p) => peval(p, z));
		check(nearC(mul(m.reduce((s, a, k) => add(s, mul(a, mz[k])), cx(0)), m.reduce((s, a, k) => add(s, mul(a, mz[k])), cx(0))), scale(mul(mul(z, z), mul(z, z)), 2), 1e-12), 'the wave\'s quartic is not (m.m(z))^2 = 2 z^4');
		check(near(mz.reduce((s, a) => add(s, mul(a, a)), cx(0))[0], 0, 1e-12) && near(mz.reduce((s, a) => add(s, mul(a, a)), cx(0))[1], 0, 1e-12), 'm(z) is not null');
	}
	const W = READINGS.map((r) => reading(r.E, r.B));
	isPoly(quartic(W[0]), [0, 0, 0, 0, 4], 'the wave (E = diag(1, -1, 0)): twice m m^T');
	isPoly(quartic(W[1]), [0, 0, -12, 0, 0], 'the body');
	isPoly(quartic(W[2]), [0, 0, -12, 0, 4], 'the body and the wave');
	const result = READINGS.map((r, i) => {
		const list = stars(W[i]);
		for (const s of list) if (s.z) check(Math.sqrt(abs2(peval(quartic(W[i]), s.z))) < 1e-9, `${r.key}: a root ${s.z} is not a root`);
		const { P, u } = superPoynting(r.E, r.B);
		const b = P.map((v) => v / u);
		const b4 = blochOfStars(list);
		check(b.every((v, k) => near(v, b4[k], 1e-9)), `${r.key}: P/u = ${b} but the stars' state has b = ${b4}`);
		return { key: r.key, stars: list, groups: clusters(list), P, u, b, size: len(b) };
	});
	const [wave, body, both] = result;
	check(wave.groups.length === 1 && wave.groups[0].count === 4 && near(wave.groups[0].n[2], 1), 'the wave\'s four stars are not at the north pole');
	check(near(wave.size, 1) && near(wave.b[2], 1) && near(wave.P[2], 2) && near(wave.u, 2), `the wave: P = ${wave.P}, u = ${wave.u}`);
	check(body.groups.length === 2 && body.groups.every((g) => g.count === 2) && near(body.groups[0].n[2], 1) && near(body.groups[1].n[2], -1), 'the body\'s stars are not two at each pole');
	check(body.size === 0 && near(body.u, 3), `the body: P = ${body.P}, u = ${body.u}`);
	check(near(both.P[2], 2) && near(both.u, 5) && near(both.size, 0.4) && both.size.toFixed(1) === '0.4' && near(both.b[2], 0.4), `the body and the wave: P = ${both.P}, u = ${both.u}`);
	{
		const g = both.groups;
		check(g.length === 3 && g[0].count === 2 && near(g[0].n[2], 1), 'the body and the wave: two stars do not stay at the pole');
		const free = g.slice(1).sort((p, q) => q.n[0] - p.n[0]);
		check(free.every((s) => s.count === 1 && near(s.n[1], 0, 1e-12) && near(s.n[2], -0.5, 1e-12) && near(Math.abs(s.n[0]), Math.sqrt(3) / 2, 1e-12)), `the free stars are at ${free.map((s) => s.n)}`);
		check(free[0].n[0].toFixed(2) === '0.87' && free[1].n[0].toFixed(2) === '-0.87', 'the free stars are not at (+-0.87, 0, -0.5)');
		check(free.every((s) => near(deg(Math.acos(s.n[2])), 120, 1e-9)), 'the free stars are not 120 degrees from the pole');
		check(free.every((s) => near(Math.abs(s.z[0]), Math.sqrt(3), 1e-9) && near(s.z[1], 0, 1e-9)), 'the free roots are not +-sqrt 3');
	}
	return { overlap: overlaps[0], mix, readings: result };
}
