// Shared numbers, colours and marks for the three diagrams of the tutorial's chapter 7.6
// (tutorial/geometry/gravitational-waves.md): tut-gw-count, tut-gw-arms and tut-gw-turned. Not a figure itself. The
// colour roles are chapter 7.4's (figs/tut-linear-lib.js: the observer's, the curvature's and the field's, read from
// app.css), orange for a stretch and blue for a squeeze as in Part 1's rings (figs/tut-tides.js, figs/tut-five-lib.js);
// the sheet, strokes, labels and cropping are those of chapters 6.1 to 7.4 (figs/tut-pot-lib.js), all imported, not
// copied. The ring of twelve free steel beads is the paper's figure 2, panels (b) and (c) (figs/tidal.js): the ring
// drawn at the push's largest, an arrow at every bead, the pale ring of half a cycle later and the dashed circle
// undisturbed; here each arrow is orange where its bead is pushed outward and blue where inward.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints, and the chapter's
// other numbers on the way (SI throughout):
//  - the count: the harmonic condition on a plane wave along z, d^mu hbar_mu nu = -(f'/c)(a_0nu + a_3nu) = 0, four
//    independent conditions, leaving six amplitudes; the leftover gauge zeta_nu = c b_nu F(u) changes them by
//    -l_mu b_nu - l_nu b_mu + eta_mu nu (l.b), l = (1, 0, 0, -1), four independent changes that keep the harmonic
//    condition and reach exactly a_13, a_23, a_33 and the trace a_11 + a_22, never a_11 - a_22 or a_12; the chapter's
//    choice of the b_nu zeroes the four; 10 - 4 - 4 = 2;
//  - the projector Lambda(n): its four properties, Lambda_ij,ij = 2, and the chapter's example a_11 = 3, a_22 = 1,
//    a_13 = 2 kept as a_11 = -a_22 = 1;
//  - the tide: E_ij = -(1/2) d_t^2 h_ij from R_0i0j in TT gauge; a steady wave of 10^-21 at 100 Hz, w = 628 s^-1, tide
//    2.0 x 10^-16 s^-2, 47 million times less than the person's 9.34 x 10^-9 s^-2; the practice's 188 s^-1 and
//    1.8 x 10^-17 s^-2;
//  - the arms: delta xi_i = (1/2) h_ij xi_j grows the arm along e_1 by (1/2) h+ L and shrinks the one along e_2 by the
//    same, difference h+ L; arms turned by psi read h+ cos 2 psi + hx sin 2 psi, so at 45 degrees hx alone; on 4 km,
//    4 x 10^-18 m, a 400th of a proton's 1.7 x 10^-15 m; 3000 km at 100 Hz and 2 pi L / lambda = 8.4 x 10^-3;
//  - the magnetic part: B_ij = eps_ipq k_p E_qj for k along z is [[-Ex, E+], [E+, Ex]], symmetric and trace-free,
//    |B| = |E|, its shear i times E's (a turn of 45 degrees anticlockwise as seen by the reader the wave approaches,
//    found from the axes of the two tables), 1.5b's shears 1.2 + 0.5i and -0.5 + 1.2i for E+ = 0.6, Ex = 0.25; the
//    front-back rule eps_ipq n_p B_qj = E_ij for n = -k;
//  - the speed of gravity: 40 Mpc in 4.1 x 10^15 s, 130 million years, 1.7 s over it 4 x 10^-16.
import { OBS, CURV, FIELD, ACCENT, ACCENT2, stack, palette, C } from './tut-linear-lib.js';
import { INK, DIM, RULE, PAGE } from '../lib.js';
import { STEEL } from './tut-five-lib.js';

export { OBS, CURV, FIELD, ACCENT, ACCENT2, stack, palette, STEEL };

// ---- small linear algebra ----------------------------------------------------------------------------------------
/** The rank of a list of rows, by Gaussian elimination with partial pivoting. */
export function rank(rows, tol = 1e-9) {
	const m = rows.map((r) => r.slice());
	const ncol = m[0]?.length ?? 0;
	let rk = 0;
	for (let c = 0; c < ncol && rk < m.length; c++) {
		let p = rk;
		for (let i = rk + 1; i < m.length; i++) if (Math.abs(m[i][c]) > Math.abs(m[p][c])) p = i;
		if (Math.abs(m[p][c]) < tol) continue;
		[m[rk], m[p]] = [m[p], m[rk]];
		for (let i = 0; i < m.length; i++) if (i !== rk && Math.abs(m[i][c]) > tol) {
			const f = m[i][c] / m[rk][c];
			for (let j = c; j < ncol; j++) m[i][j] -= f * m[rk][j];
		}
		rk++;
	}
	return rk;
}

// ---- the count ---------------------------------------------------------------------------------------------------
/** The ten amplitudes a_mu nu, mu <= nu, in this order; a vector of ten numbers is a symmetric table. */
export const PAIRS = [];
for (let m = 0; m < 4; m++) for (let n = m; n < 4; n++) PAIRS.push([m, n]);
const slot = (m, n) => PAIRS.findIndex(([a, b]) => (a === Math.min(m, n) && b === Math.max(m, n)));
const ETA = [-1, 1, 1, 1];
const L_LOW = [1, 0, 0, -1];               // d_mu u times c, lower index: d_0 = c^-1 d_t gives 1, d_3 gives -1

/** The harmonic condition on a plane wave along z, as four rows on the ten amplitudes: a_0nu + a_3nu = 0. */
export function harmonicRows() {
	return [0, 1, 2, 3].map((nu) => {
		const r = new Array(10).fill(0);
		r[slot(0, nu)] += 1;
		r[slot(3, nu)] += 1;
		return r;
	});
}
/** The change of the ten amplitudes made by the leftover gauge b_nu: -l_mu b_nu - l_nu b_mu + eta_mu nu (l^a b_a). */
export function gaugeChange(b) {
	const lb = [0, 1, 2, 3].reduce((s, a) => s + ETA[a] * L_LOW[a] * b[a], 0);     // l^a b_a = -(b_0 + b_3)
	return PAIRS.map(([m, n]) => -L_LOW[m] * b[n] - L_LOW[n] * b[m] + (m === n ? ETA[m] * lb : 0));
}

/** The count, by linear algebra: the harmonic conditions' rank, the leftover gauge's rank within them, what is left,
 * and which amplitudes each step reaches. */
export function count() {
	const H = harmonicRows();
	const fixedByHarmonic = rank(H);
	const basis = [0, 1, 2, 3].map((k) => gaugeChange([0, 1, 2, 3].map((i) => (i === k ? 1 : 0))));
	const removed = rank(basis);
	// each gauge change keeps the harmonic condition
	const keepsHarmonic = basis.every((d) => H.every((r) => Math.abs(r.reduce((s, v, i) => s + v * d[i], 0)) < 1e-12));
	const left = 10 - fixedByHarmonic - removed;
	return { fixedByHarmonic, removed, left, keepsHarmonic, basis };
}

// ---- the projector -----------------------------------------------------------------------------------------------
export const projector = (n) => [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) - n[i] * n[j]));
/** Lambda_ij,kl(n) as a function of the four indices. */
export function lambda(n) {
	const P = projector(n);
	return (i, j, k, l) => 0.5 * (P[i][k] * P[j][l] + P[i][l] * P[j][k]) - 0.5 * P[i][j] * P[k][l];
}
/** Lambda applied to a symmetric 3 x 3 table. */
export const project = (n, T) => {
	const L = lambda(n);
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => {
		let s = 0;
		for (let k = 0; k < 3; k++) for (let l = 0; l < 3; l++) s += L(i, j, k, l) * T[k][l];
		return s;
	}));
};

// ---- the magnetic part ---------------------------------------------------------------------------------------------
/** The Levi-Civita symbol. */
export const levi = (i, j, k) => ((i - j) * (j - k) * (k - i)) / 2;
/** B_ij = eps_ipq k_p E_qj, for 3 x 3 tables. */
export function magnetic(k, E) {
	return [0, 1, 2].map((i) => [0, 1, 2].map((j) => {
		let s = 0;
		for (let p = 0; p < 3; p++) for (let q = 0; q < 3; q++) s += levi(i, p, q) * k[p] * E[q][j];
		return s;
	}));
}
/** The plane wave's tide along z, from its two numbers. */
export const tide = (Ep, Ex) => [[Ep, Ex, 0], [Ex, -Ep, 0], [0, 0, 0]];
/** 1.5b's shear of a table across z, (T_11 - T_22) + 2i T_12, as [re, im]. */
export const shear = (T) => [T[0][0] - T[1][1], 2 * T[0][1]];
export const size = (T) => Math.sqrt(T.flat().reduce((s, v) => s + v * v, 0));
/** The axis of the larger eigenvalue of a symmetric 2 x 2 table [[a, b], [b, d]], radians from e_1 (anticlockwise). */
export const axisOf = ([[a, b], [, d]]) => 0.5 * Math.atan2(2 * b, a - d);

// ---- the arms ------------------------------------------------------------------------------------------------------
/** delta xi_i = (1/2) h_ij xi_j for the strains (hp, hx) across z, at xi in the plane. */
export const move = (hp, hx, [x, y]) => [0.5 * (hp * x + hx * y), 0.5 * (hx * x - hp * y)];
/** The arms' reading, the difference of the arms over one, for arms along psi and psi + 90 degrees. */
export function reading(hp, hx, psi) {
	const u = [Math.cos(psi), Math.sin(psi)], v = [-Math.sin(psi), Math.cos(psi)];
	const grow = (w) => { const d = move(hp, hx, w); return d[0] * w[0] + d[1] * w[1]; };
	return grow(u) - grow(v);
}

// ---- constants ---------------------------------------------------------------------------------------------------
export const LIGO_H = 1e-21;
export const ARM = 4000;                   // m
export const PROTON = 1.7e-15;             // m, its width as the chapter states it
export const MPC = 3.09e22;                // m
export const YEAR = 3.156e7;               // s
export const PERSON_TIDE = 9.34e-9;        // s^-2, chapter 1.4

const fig = (v, n = 1) => Math.abs(v).toExponential(n);

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;

	// ---- the count
	const ct = count();
	check(ct.fixedByHarmonic === 4 && ct.removed === 4 && ct.left === 2 && ct.keepsHarmonic, `the count ${ct.fixedByHarmonic}, ${ct.removed}, ${ct.left}`);
	check(10 - 4 - 4 === 2 && PAIRS.length === 10, 'ten amplitudes');
	// the harmonic conditions fix the four with a time index: a_00, a_01, a_02, a_03 in terms of spatial ones
	{
		const H = harmonicRows();
		const time = PAIRS.map(([m]) => m === 0);
		check(rank(H.map((r) => r.filter((_, i) => time[i]))) === 4, 'the harmonic condition does not fix the four with a time index');
	}
	// what the leftover gauge reaches: a_13 (b_1), a_23 (b_2), a_33 (b_3 - b_0), a_11 = a_22 (-(b_0 + b_3)); a_12 and
	// a_11 - a_22 never; a_00 = a_33 and a_0i = -a_3i follow
	{
		const b = [0.3, -0.7, 1.1, 0.45];
		const d = gaugeChange(b), at = (m, n) => d[slot(m, n)];
		check(near(at(1, 1), -(b[0] + b[3]), 1e-15) && near(at(2, 2), at(1, 1), 1e-15) && near(at(3, 3), b[3] - b[0], 1e-15), 'the diagonal changes');
		check(near(at(1, 3), b[1], 1e-15) && near(at(2, 3), b[2], 1e-15) && at(1, 2) === 0, 'the off-diagonal changes');
		check(near(at(1, 1) - at(2, 2), 0, 1e-15), 'the gauge reaches a_11 - a_22');
		// the spatial part of the gauge's image is spanned by a_13, a_23, a_33 and the trace a_11 + a_22
		const spatial = PAIRS.map(([m]) => m !== 0);
		const img = ct.basis.map((v) => v.filter((_, i) => spatial[i]));
		const sp = PAIRS.filter(([m]) => m !== 0);
		const unit = (m, n) => sp.map(([a, c]) => (a === m && c === n ? 1 : 0));
		const trace = sp.map(([a, c]) => (a === c && a < 3 ? 1 : 0));
		const span = [unit(1, 3), unit(2, 3), unit(3, 3), trace];
		check(rank(img) === 4 && rank([...img, ...span]) === 4, 'the gauge does not reach exactly a_13, a_23, a_33 and a_11 + a_22');
		const diff = sp.map(([a, c]) => (a === 1 && c === 1 ? 1 : a === 2 && c === 2 ? -1 : 0));
		check(rank([...img, diff, unit(1, 2)]) === 6, 'a_11 - a_22 and a_12 are not left');
		// the chapter's choice: b_1 = -a_13, b_2 = -a_23, b_3 - b_0 = -a_33, b_0 + b_3 = (a_11 + a_22)/2
		const a = { 11: 3, 22: 1, 33: 0.4, 13: 2, 23: -0.6, 12: 0.8 };
		const s = 0.5 * (a[11] + a[22]), t = -a[33];
		const bb = [(s - t) / 2, -a[13], -a[23], (s + t) / 2];
		const g = gaugeChange(bb), G = (m, n) => g[slot(m, n)];
		check(near(a[13] + G(1, 3), 0, 1e-15) && near(a[23] + G(2, 3), 0, 1e-15) && near(a[33] + G(3, 3), 0, 1e-15), 'the chapter\'s b does not zero a_13, a_23, a_33');
		check(near(a[11] + G(1, 1) + a[22] + G(2, 2), 0, 1e-15) && near(a[11] + G(1, 1), 1, 1e-15) && near(a[12] + G(1, 2), a[12], 0), 'the chapter\'s b does not zero the trace');
	}

	// ---- the projector
	{
		const n = [0.36, -0.48, 0.8], L = lambda(n);
		let idem = 0, onN = 0, onDelta = 0, tr = 0;
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
			for (let m = 0; m < 3; m++) for (let q = 0; q < 3; q++) {
				let s = 0;
				for (let k = 0; k < 3; k++) for (let l = 0; l < 3; l++) s += L(i, j, k, l) * L(k, l, m, q);
				idem = Math.max(idem, Math.abs(s - L(i, j, m, q)));
			}
			for (let k = 0; k < 3; k++) onN = Math.max(onN, Math.abs([0, 1, 2].reduce((s, l) => s + L(i, j, k, l) * n[l], 0)));
			onDelta = Math.max(onDelta, Math.abs([0, 1, 2].reduce((s, k) => s + L(i, j, k, k), 0)));
			tr += L(i, j, i, j);
		}
		check(idem < 1e-14 && onN < 1e-14 && onDelta < 1e-14 && near(tr, 2, 1e-14), `the projector's properties ${idem} ${onN} ${onDelta} ${tr}`);
		const ex = project([0, 0, 1], [[3, 0, 2], [0, 1, 0], [2, 0, 0]]);
		check(near(ex[0][0], 1, 1e-15) && near(ex[1][1], -1, 1e-15) && near(ex[0][2], 0, 1e-15) && near(ex[0][1], 0, 1e-15), `the example keeps ${ex[0][0]}, ${ex[1][1]}`);
	}

	// ---- the tide: R_0i0j = -(1/2) d_0^2 h_ij in TT gauge, E = c^2 R_0i0j; a steady wave
	{
		const w = 2 * Math.PI * 100, h = LIGO_H;
		check(w.toFixed(0) === '628', `omega ${w}`);
		const E = 0.5 * w * w * h;
		check(fig(E) === '2.0e-16', `the tide ${E}`);
		// -1/2 d_t^2 (h cos wt) at t = 0, by finite differences
		const dt = 1e-6, hh = (t) => h * Math.cos(w * t);
		const num = -0.5 * (hh(dt) - 2 * hh(0) + hh(-dt)) / (dt * dt);
		check(Math.abs(num - E) < 1e-4 * E, `-1/2 d_t^2 h ${num}`);
		check(Math.round(PERSON_TIDE / E / 1e6) === 47, `the person over the wave ${PERSON_TIDE / E}`);
		const w30 = 2 * Math.PI * 30;
		check(w30.toFixed(0) === '188' && fig(0.5 * w30 * w30 * h) === '1.8e-17', `the practice ${w30} ${0.5 * w30 * w30 * h}`);
	}

	// ---- the arms
	{
		const hp = 0.37, Lm = 1;
		const g1 = move(hp, 0, [Lm, 0])[0], g2 = move(hp, 0, [0, Lm])[1];
		check(near(g1, hp / 2, 1e-15) && near(g2, -hp / 2, 1e-15) && near(g1 - g2, hp * Lm, 1e-15), 'the arms do not change by +-h+L/2');
		for (const [p, x] of [[0.3, 0], [0, 0.3], [0.2, -0.5]]) {
			check(near(reading(p, x, 0), p, 1e-15), 'the arms along e_1 and e_2 do not read h+');
			check(near(reading(p, x, Math.PI / 4), x, 1e-15), 'the arms at 45 degrees do not read hx');
			for (const psi of [0.3, 1.1]) check(near(reading(p, x, psi), p * Math.cos(2 * psi) + x * Math.sin(2 * psi), 1e-15), 'h+ cos 2psi + hx sin 2psi');
		}
		const diff = LIGO_H * ARM;
		check(diff.toExponential(0) === '4e-18' && Math.round(PROTON / diff / 100) * 100 === 400, `the difference ${diff}, ${PROTON / diff}`);
		const lam = C / 100;
		check(Math.round(lam / 1e6) * 1000 === 3000 && (2 * Math.PI * ARM / lam).toExponential(1) === '8.4e-3', `the wavelength ${lam} and the phase ${2 * Math.PI * ARM / lam}`);
	}

	// ---- the magnetic part
	{
		const k = [0, 0, 1];
		for (const [Ep, Ex] of [[0.6, 0.25], [-1, 0], [0.3, -0.9]]) {
			const E = tide(Ep, Ex), B = magnetic(k, E);
			check(near(B[0][0], -Ex, 1e-15) && near(B[0][1], Ep, 1e-15) && near(B[1][0], Ep, 1e-15) && near(B[1][1], Ex, 1e-15), `B for ${Ep}, ${Ex}`);
			check(B.every((r, i) => r.every((v, j) => near(v, B[j][i], 1e-15))) && near(B[0][0] + B[1][1] + B[2][2], 0, 1e-15), 'B is not symmetric and trace-free');
			check(near(size(B), size(E), 1e-15), '|B| is not |E|');
			const sE = shear(E), sB = shear(B);
			check(near(sB[0], -sE[1], 1e-15) && near(sB[1], sE[0], 1e-15), 'the shear of B is not i times E\'s');
			// the axes: B's stretch axis (the smaller eigenvalue, which pushes outward) is E's turned anticlockwise by 45 degrees
			const turn = axisOf(B) - axisOf(E);
			const t = ((turn * 180) / Math.PI + 360) % 180;
			check(near(t, 45, 1e-9), `B's axes are E's turned by ${t} degrees`);
			// front and back: n = -k gives eps_ipq n_p B_qj = E_ij
			const back = magnetic([0, 0, -1], B);
			check(back.every((r, i) => r.every((v, j) => near(v, E[i][j], 1e-15))), 'the front-back rule');
		}
		const sE = shear(tide(0.6, 0.25)), sB = shear(magnetic(k, tide(0.6, 0.25)));
		check(near(sE[0], 1.2, 1e-15) && near(sE[1], 0.5, 1e-15) && near(sB[0], -0.5, 1e-15) && near(sB[1], 1.2, 1e-15), `1.5b's shears ${sE} ${sB}`);
	}

	// ---- the speed of gravity
	{
		const T = (40 * MPC) / C;
		check(fig(T) === '4.1e+15' && Math.round(T / YEAR / 1e7) * 10 === 130, `the journey ${T} s, ${T / YEAR} years`);
		check((1.7 / 4.1e15).toExponential(0) === '4e-16', 'the fraction');
	}
	return { count: ct };
}

/**
 * A ring of twelve free steel beads (the paper's figure 2, panels (b) and (c)), on the Sheet S, in figure points (y
 * down): centre c, undisturbed radius R. T is the 2 x 2 table that pushes it, in the page's axes e_1 (right) and e_2
 * (up), in units of its own size: the bead whose undisturbed place is xi is drawn at c + R (1 - eps T) xi, and the
 * pale bead of half a cycle later at c + R (1 + eps T) xi; at each bead an arrow -T xi, `reach` points per unit,
 * starting TAIL clear of it and moved off the ring by up to ASIDE where it runs along it (tidal.js), orange where it
 * points outward and blue where inward. `phase`: the first bead's angle, radians, so that the beads stand on the
 * table's axes.
 */
export const RING = { stroke: 0.65, bead: 2.7, tail: 1.35, aside: 1.1, head: 3.2, width: 0.55, undisturbed: [2.4, 2], pale: [1.4, 1.4] };
export function freeRing(S, check, { c, R, T, eps, phase, reach, what }) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	const mul = (M, [x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
	check(near(T[0][1], T[1][0], 1e-15), `${what}: the table is not symmetric`);
	const fp = ([x, y]) => [c[0] + R * x, c[1] - R * y];          // the plane's (e_1, e_2) to figure points
	const image = (xi, s) => { const t = mul(T, xi); return [xi[0] - s * eps * t[0], xi[1] - s * eps * t[1]]; };
	const N = 360, circle = (k) => [Math.cos((2 * Math.PI * k) / N), Math.sin((2 * Math.PI * k) / N)];
	const ring = Array.from({ length: N + 1 }, (_, k) => fp(image(circle(k), 1)));
	const pale = Array.from({ length: N + 1 }, (_, k) => fp(image(circle(k), -1)));
	S.raw(`<path d="M${ring.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L')}Z" fill="none" stroke="${INK}" stroke-width="${RING.stroke}"/>`, 2);
	S.mark(ring, RING.stroke / 2, `${what}'s ring`);
	const beads = [], arrows = [];
	for (let k = 0; k < 12; k++) {
		const t = phase + (2 * Math.PI * k) / 12, xi = [Math.cos(t), Math.sin(t)];
		const p = fp(image(xi, 1)), q = fp(image(xi, -1));
		S.sphere(q, RING.bead, STEEL, { layer: 1, opacity: 0.3, spec: 0.3 }, `${what}'s pale bead ${k}`);
		S.sphere(p, RING.bead, STEEL, { layer: 3, spec: 0.6, shininess: 36 }, `${what}'s bead ${k}`);
		const a = mul(T, xi).map((v) => -v);                       // the push, in the plane's axes
		const out = a[0] * xi[0] + a[1] * xi[1];
		check(Math.abs(out) > 0.2, `${what}: bead ${k} is pushed neither out nor in`);
		// in figure points: y down
		const u = [a[0] / Math.hypot(...a), -a[1] / Math.hypot(...a)];
		// the ring's tangent at the bead, on the arrow's side, and the way off it
		const d = mul([[1 - eps * T[0][0], -eps * T[0][1]], [-eps * T[1][0], 1 - eps * T[1][1]]], [-xi[1], xi[0]]);
		let tan = [d[0], -d[1]];
		const tl = Math.hypot(...tan);
		tan = [tan[0] / tl, tan[1] / tl];
		const along = u[0] * tan[0] + u[1] * tan[1];
		if (along < 0) tan = [-tan[0], -tan[1]];
		const al = Math.abs(along);
		let off = [u[0] * al - tan[0], u[1] * al - tan[1]];
		const ol = Math.hypot(...off);
		off = ol > 1e-9 ? [off[0] / ol, off[1] / ol] : [0, 0];
		const from = [p[0] + u[0] * (RING.bead + RING.tail) + off[0] * RING.aside * al, p[1] + u[1] * (RING.bead + RING.tail) + off[1] * RING.aside * al];
		const L = Math.hypot(...a) * reach;
		const to = [from[0] + u[0] * L, from[1] + u[1] * L];
		const drawn = S.arrow(from, to, { color: out > 0 ? ACCENT : ACCENT2, width: RING.width, head: RING.head, layer: 4, what: `${what}'s arrow ${k}` });
		beads.push({ k, xi, p, q, out });
		arrows.push({ k, out, from, to, L: drawn.L, head: drawn.head });
	}
	// each bead the image of its place; one scale for every arrow
	for (const b of beads) check(near(Math.hypot(b.p[0] - fp(image(b.xi, 1))[0], b.p[1] - fp(image(b.xi, 1))[1]), 0, 1e-9), `${what}: bead ${b.k}`);
	for (const a of arrows) check(near(a.L, Math.hypot(...mul(T, beads[a.k].xi)) * reach, 1e-9), `${what}: arrow ${a.k} is not at the common scale`);
	// the dashed circle undisturbed and the pale ring, no dash near an arrow
	const segs = arrows.map((a) => [a.from, a.to]);
	const clear = 0.36 * RING.head + 0.55 + 0.6;
	const nearArrow = (q) => segs.some(([A, B]) => {
		const dd = [B[0] - A[0], B[1] - A[1]], t = Math.max(0, Math.min(1, ((q[0] - A[0]) * dd[0] + (q[1] - A[1]) * dd[1]) / (dd[0] ** 2 + dd[1] ** 2)));
		return Math.hypot(q[0] - A[0] - t * dd[0], q[1] - A[1] - t * dd[1]) < clear;
	});
	const dashes = (pts, [on, off], color, width, layer, name) => {
		const s = [0];
		for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
		const total = s[s.length - 1], n = Math.round(total / (on + off)), period = total / n, dash = (on * period) / (on + off);
		const atS = (x) => {
			x = ((x % total) + total) % total;
			let i = 1;
			while (s[i] < x) i++;
			const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
			return [pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])];
		};
		for (let k = 0; k < n; k++) {
			const seg = Array.from({ length: 7 }, (_, j) => atS(k * period - dash / 2 + (dash * j) / 6));
			if (seg.some(nearArrow)) continue;
			S.path(seg, { color, width, layer, what: name });
		}
	};
	dashes(Array.from({ length: 721 }, (_, k) => fp([Math.cos((2 * Math.PI * k) / 720), Math.sin((2 * Math.PI * k) / 720)])), RING.undisturbed, DIM, 0.5, 0, `${what}'s undisturbed circle`);
	dashes(pale, RING.pale, RULE, 0.5, 0, `${what}'s pale ring`);
	return { beads, arrows, ring, pale, fp };
}

/** The direction out of the page: a small circle with a dot at its centre, at the figure point q. */
export const ODOT = { r: 2.3, dot: 0.75, width: 0.5 };
export function odot(S, q, what = 'the direction out of the page') {
	S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${ODOT.r}" fill="none" stroke="${INK}" stroke-width="${ODOT.width}"/><circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${ODOT.dot}" fill="${INK}"/>`, 3);
	S.mark([q], ODOT.r + ODOT.width / 2, what);
}

export { PAGE };
