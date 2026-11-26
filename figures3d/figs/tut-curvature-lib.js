// Shared numbers and colours for the four figures of the tutorial's section 7.2 (tutorial/geometry/curvature-and-tides.md):
// the hero tut-curvature-tube and the diagrams tut-curvature-loops, tut-curvature-deviation and tut-curvature-count.
// Not a figure itself. The colour roles are section 7.1's (figs/tut-metric-lib.js: the observer's and the curvature's,
// read from app.css's --q-obs and --q-curv), and the sheet, strokes, labels and cropping are those of sections 6.1 to
// 7.1, all imported, not copied.
//
// `chapter(check)` asserts every number of the chapter that a figure draws or its caption prints:
//  - the octant: an arrow carried without turning (the transport equation integrated by fourth-order Runge-Kutta in
//    the sphere's own labels, with its Christoffel symbols -sin cos and cot) round the loop pole -> equator at 0 degrees
//    -> equator at 90 degrees east -> pole comes home turned by 90.0 degrees; the loop's area, integrated, is
//    4 pi a^2 / 8 = pi a^2 / 2, and the area over a^2 is the turn; the arrow points due south at each of the drawn
//    places on the way;
//  - the flat sheet in polar labels: Gamma^r_thth = -r and Gamma^th_rth = 1/r from the metric dr^2 + r^2 dth^2
//    (finite differences), R^r_thrth = -1 + 0 + 0 + 1 = 0; the arrow carried round the loop r = 1 -> 3 -> (3, 90
//    degrees) -> (1, 90 degrees) -> (1, 0) comes home unturned, although its polar components change on the way;
//  - the sphere: R^th_phthph = sin^2 th, and the curvature R_thphthph / (g_thth g_phph) = 1/a^2;
//  - geodesic deviation: d^2 xi / dtau^2 = -R xi, integrated, against the closed forms xi_0 cosh(k tau) (a stretch)
//    and xi_0 cos(k tau) (a squeeze); beside a mass, the tide (GM/r^3) diag(-2, 1) along and across the line;
//  - the count: the components of R_abcd in four dimensions that the symmetries leave free, by the rank of the linear
//    conditions on its 256 entries, 20 = n^2 (n^2 - 1) / 12; sorted by their number of time indices, 6 + 8 + 6
//    (the tide, the 9 - 1 of one time index, and the six of space); in empty space (the ten conditions of a vanishing
//    Ricci tensor), 10 = 5 + 5, the tide's five and the magnetic part's five, with the six of space then fixed by the
//    tide.
import { OBS, CURV, palette } from './tut-metric-lib.js';
import { ACCENT, ACCENT2, INK } from '../lib.js';
import { placed } from './tut-pot-lib.js';

export { OBS, CURV, palette, ACCENT, ACCENT2 };

/** The lines `srcs` of one name as one label, each line's point (ax, 0) on x, the first line's top at y and each next
 * one `skip` under the last (section 6.4's names of two lines, tut-momentum-lightcone.js). */
export async function stack(srcs, x, y, ax = 0.5, color = INK, skip = 1.6) {
	const parts = [];
	let t = y;
	for (const src of srcs) { const p = await placed(src, x, t, ax, 0, color); parts.push(p); t = p.box.b + skip; }
	const box = { l: Math.min(...parts.map((p) => p.box.l)), r: Math.max(...parts.map((p) => p.box.r)), t: y, b: parts[parts.length - 1].box.b };
	return { src: srcs.join(' '), svg: parts.map((p) => p.svg).join(''), box };
}

// ---- the sphere and its octant ---------------------------------------------------------------------------------------
const DEG = Math.PI / 180;
/** The south-pointing unit vector at colatitude th, longitude ph, in the sphere's frame (x to 0 degrees, z north). */
export const south = (th, ph) => [Math.cos(th) * Math.cos(ph), Math.cos(th) * Math.sin(ph), -Math.sin(th)];
export const east = (th, ph) => [-Math.sin(ph), Math.cos(ph), 0];
export const onSphere = (th, ph, a = 1) => [a * Math.sin(th) * Math.cos(ph), a * Math.sin(th) * Math.sin(ph), a * Math.cos(th)];

/** The loop's three legs, as paths (th(s), ph(s)) for s from 0 to 1, colatitude and longitude. */
export const OCTANT = [
	(s) => [s * 90 * DEG, 0],                       // down the meridian of Greenwich
	(s) => [90 * DEG, s * 90 * DEG],                // east along the equator
	(s) => [(1 - s) * 90 * DEG, 90 * DEG]           // north along the meridian of 90 degrees east
];

/** Carry the arrow (v^th, v^ph) without turning along the path p(s), by dv^a/ds = -Gamma^a_bc v^b dx^c/ds; the sphere's
 * symbols Gamma^th_phph = -sin cos, Gamma^ph_thph = cot. At the pole (sin th = 0) the labels fail, so each leg starts
 * and ends a hair from it, where the arrow is read and set in the frame (south, east). */
function carrySphere(path, vSouthEast, n = 4000) {
	const eps = 1e-7;
	const s0 = path(0)[0] < 1e-9 ? eps : 0, s1 = path(1)[0] < 1e-9 ? 1 - eps : 1;
	const at = (s) => path(s);
	const d = (s) => { const h = 1e-6, a = at(s - h), b = at(s + h); return [(b[0] - a[0]) / (2 * h), (b[1] - a[1]) / (2 * h)]; };
	// components from the frame: v^th = v_south, v^ph = v_east / sin th (a unit sphere)
	let [th0] = at(s0);
	let v = [vSouthEast[0], vSouthEast[1] / Math.sin(th0)];
	const f = (s, v) => {
		const [th] = at(s), [dth, dph] = d(s);
		return [Math.sin(th) * Math.cos(th) * v[1] * dph, -(Math.cos(th) / Math.sin(th)) * (v[0] * dph + v[1] * dth)];
	};
	const h = (s1 - s0) / n;
	for (let i = 0; i < n; i++) {
		const s = s0 + i * h;
		const k1 = f(s, v), k2 = f(s + h / 2, v.map((x, j) => x + (h / 2) * k1[j]));
		const k3 = f(s + h / 2, v.map((x, j) => x + (h / 2) * k2[j])), k4 = f(s + h, v.map((x, j) => x + h * k3[j]));
		v = v.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
	}
	const [th1] = at(s1);
	return [v[0], v[1] * Math.sin(th1)];
}

/** The octant's arrow, carried round: its direction in space (the sphere's frame) at the start of each leg and at
 * the end, and the angle it has turned at the pole, degrees. */
export function octant() {
	// at the pole, an arrow toward longitude ph is (south, east) = (1, 0) in the frame of the meridian ph
	const legs = [];
	let se = [1, 0];                                   // pointing south along Greenwich, ahead
	for (const leg of OCTANT) { legs.push(se); se = carrySphere(leg, se); }
	// at the pole, the frame of the meridian of 90 degrees: south along it is the direction toward longitude 90
	const [th, ph] = OCTANT[2](1);
	const home = [0, 1, 2].map((i) => se[0] * south(1e-7, 90 * DEG)[i] + se[1] * east(th, ph)[i]);
	const start = south(1e-7, 0);
	const turn = Math.acos(Math.max(-1, Math.min(1, start[0] * home[0] + start[1] * home[1] + start[2] * home[2]))) / DEG;
	return { legs, end: se, home, turn };
}

/** The area of the octant on the unit sphere, sin th dth dph integrated by Simpson's rule. */
export function octantArea(n = 2000) {
	const h = (Math.PI / 2) / n;
	let s = 0;
	for (let i = 0; i <= n; i++) s += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * Math.sin(i * h);
	return ((s * h) / 3) * (Math.PI / 2);
}

// ---- the flat sheet in polar labels ------------------------------------------------------------------------------
/** The metric dr^2 + r^2 dth^2 as [g_rr, g_thth], and its Christoffel symbols by finite differences of it. */
const gSheet = (r) => [1, r * r];
export function christoffelSheet(r) {
	const h = 1e-5, dg = (gSheet(r + h)[1] - gSheet(r - h)[1]) / (2 * h);
	return { r_thth: -0.5 * (1 / gSheet(r)[0]) * dg, th_rth: 0.5 * (1 / gSheet(r)[1]) * dg };
}
/** R^r_thrth = d_r Gamma^r_thth - d_th Gamma^r_thr + Gamma^r_rs Gamma^s_thth - Gamma^r_ths Gamma^s_thr, term by term. */
export function riemannSheet(r) {
	const h = 1e-5, G = christoffelSheet;
	const first = (G(r + h).r_thth - G(r - h).r_thth) / (2 * h);
	const second = 0, third = 0;                         // Gamma^r_thr = 0, Gamma^r_rs = 0
	const fourth = -G(r).r_thth * G(r).th_rth;           // only s = th
	return { first, second, third, fourth, sum: first + second + third + fourth };
}

/** The sheet's loop: (r(s), th(s)) for its four legs. */
export const SHEET_LOOP = [
	(s) => [1 + 2 * s, 0],
	(s) => [3, s * 90 * DEG],
	(s) => [3 - 2 * s, 90 * DEG],
	(s) => [1, (1 - s) * 90 * DEG]
];
/** Carry (v^r, v^th) round the sheet's loop by the transport equation; returns the components at each leg's start and
 * at the end, and the arrow's fixed Cartesian direction at each. */
export function carrySheet(v0 = [1, 0], n = 4000) {
	let v = v0.slice();
	const out = [];
	for (const path of SHEET_LOOP) {
		out.push(v.slice());
		const d = (s) => { const k = 1e-6, a = path(s - k), b = path(s + k); return [(b[0] - a[0]) / (2 * k), (b[1] - a[1]) / (2 * k)]; };
		const f = (s, v) => {
			const [r] = path(s), [dr, dth] = d(s), G = christoffelSheet(r);
			// dv^r = -Gamma^r_thth v^th dth; dv^th = -Gamma^th_rth (v^r dth + v^th dr)
			return [-G.r_thth * v[1] * dth, -G.th_rth * (v[0] * dth + v[1] * dr)];
		};
		const h = 1 / n;
		for (let i = 0; i < n; i++) {
			const s = i * h;
			const k1 = f(s, v), k2 = f(s + h / 2, v.map((x, j) => x + (h / 2) * k1[j]));
			const k3 = f(s + h / 2, v.map((x, j) => x + (h / 2) * k2[j])), k4 = f(s + h, v.map((x, j) => x + h * k3[j]));
			v = v.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
		}
	}
	out.push(v.slice());
	return out;
}
/** The Cartesian direction of the polar components (v^r, v^th) at the angle th, radius r. */
export const cartesian = ([vr, vth], r, th) => [vr * Math.cos(th) - r * vth * Math.sin(th), vr * Math.sin(th) + r * vth * Math.cos(th)];

// ---- geodesic deviation -----------------------------------------------------------------------------------------
/** The separation xi(tau) under d^2 xi / dtau^2 = -K xi, from xi(0) = xi0 at rest: K < 0 stretches, K > 0 squeezes. */
export const deviation = (K, xi0, tau) => (K < 0 ? xi0 * Math.cosh(Math.sqrt(-K) * tau) : xi0 * Math.cos(Math.sqrt(K) * tau));
/** The same, integrated by fourth-order Runge-Kutta. */
export function deviationRK(K, xi0, tau, n = 2000) {
	let x = xi0, v = 0;
	const h = tau / n;
	for (let i = 0; i < n; i++) {
		const a1 = -K * x, b1 = v;
		const a2 = -K * (x + (h / 2) * b1), b2 = v + (h / 2) * a1;
		const a3 = -K * (x + (h / 2) * b2), b3 = v + (h / 2) * a2;
		const a4 = -K * (x + h * b3), b4 = v + h * a3;
		x += (h / 6) * (b1 + 2 * b2 + 2 * b3 + b4);
		v += (h / 6) * (a1 + 2 * a2 + 2 * a3 + a4);
	}
	return x;
}
/** The tide beside a mass, in units of GM/r^3, along and across the line to it (section 1.4): (-2, 1). */
export const TIDE = [-2, 1];

// ---- the count ---------------------------------------------------------------------------------------------------
/** The rank of a list of rows (each an array), by Gaussian elimination with partial pivoting. */
function rank(rows, ncol, tol = 1e-9) {
	const m = rows.map((r) => r.slice());
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
/** The free components of R_abcd in n dimensions, under the four symmetries, and (with `vacuum`, n = 4 and the
 * metric diag(-1, 1, 1, 1)) the ten conditions R_bd = eta^ac R_abcd = 0. `keep(a, b, c, d)` restricts the unknowns to
 * a class; `zero(a, b, c, d)` sets some unknowns to zero, to ask what the others leave free. */
export function freeComponents(n, { vacuum = false, keep = () => true, zero = () => false } = {}) {
	const idx = [];
	for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) for (let d = 0; d < n; d++) idx.push([a, b, c, d]);
	const at = ([a, b, c, d]) => ((a * n + b) * n + c) * n + d;
	const unknown = idx.filter((q) => keep(...q));
	const col = new Map(unknown.map((q, i) => [at(q), i]));
	const rows = [];
	// a term outside the class is dropped: every condition lies within one class, except the vacuum's, which join a
	// class only to entries that the symmetries make zero (R_000j) or to the class kept with it (R_0i0j and R_kikj)
	const row = (terms) => {
		const r = new Array(unknown.length).fill(0);
		for (const [q, s] of terms) { const i = col.get(at(q)); if (i !== undefined) r[i] += s; }
		if (r.some((v) => v !== 0)) rows.push(r);
	};
	for (const [a, b, c, d] of idx) {
		row([[[a, b, c, d], 1], [[b, a, c, d], 1]]);
		row([[[a, b, c, d], 1], [[a, b, d, c], 1]]);
		row([[[a, b, c, d], 1], [[c, d, a, b], -1]]);
		row([[[a, b, c, d], 1], [[a, c, d, b], 1], [[a, d, b, c], 1]]);
		if (zero(a, b, c, d) && keep(a, b, c, d)) row([[[a, b, c, d], 1]]);
	}
	if (vacuum) {
		const eta = (a) => (a === 0 ? -1 : 1);
		for (let b = 0; b < n; b++) for (let d = b; d < n; d++) row(Array.from({ length: n }, (_, a) => [[a, b, a, d], eta(a)]));
	}
	return unknown.length - rank(rows, unknown.length);
}
/** The number of time indices (0s) in a component. */
export const times = (...q) => q.filter((i) => i === 0).length;

/** The chapter's numbers, computed and asserted. */
export function chapter(check) {
	const near = (a, b, tol) => Math.abs(a - b) <= tol;
	// ---- the octant: the turn, the area, and their equality
	const o = octant();
	check(near(o.turn, 90, 1e-6) && o.turn.toFixed(0) === '90', `the octant's turn is ${o.turn} degrees`);
	const area = octantArea();
	check(near(area, (4 * Math.PI) / 8, 1e-12) && near(area, Math.PI / 2, 1e-12), `the octant's area is ${area} a^2, not pi a^2 / 2`);
	check(near(area / DEG, o.turn, 1e-6), 'the turn is not the area over a^2');
	// the arrow points due south at the start of each leg: ahead, across the path, behind; and home toward 90 east
	for (const [i, se] of o.legs.entries()) check(near(se[0], 1, 1e-9) && near(se[1], 0, 1e-9), `the arrow does not point south at leg ${i}`);
	check(near(o.home[1], 1, 1e-6) && near(o.home[0], 0, 1e-6), 'the arrow does not come home toward 90 degrees east');
	// at the middle of each leg too (the drawn places): carry half a leg
	for (const [i, leg] of OCTANT.entries()) {
		const half = carrySphere((s) => leg(s / 2), o.legs[i]);
		check(near(half[0], 1, 1e-9) && near(half[1], 0, 1e-9), `the arrow does not point south at the middle of leg ${i}`);
	}
	// the chapter's triangle on the Earth: 1000 km sides, 4.3 x 10^5 km^2, 0.61 degrees
	{
		const a = 6371, s = 1000 / a;                          // the side as an angle
		// an equilateral spherical triangle: cos s = cos^2 s + sin^2 s cos A; the excess 3A - pi is the area over a^2
		const A = Math.acos((Math.cos(s) - Math.cos(s) ** 2) / Math.sin(s) ** 2), excess = 3 * A - Math.PI;
		check((excess * a * a / 1e5).toFixed(1) === '4.3' && (excess / DEG).toFixed(2) === '0.61', `the Earth's triangle ${excess * a * a} km^2, ${excess / DEG} degrees`);
	}
	// ---- the sheet
	for (const r of [0.5, 1, 2, 3]) {
		const G = christoffelSheet(r);
		check(near(G.r_thth, -r, 1e-8) && near(G.th_rth, 1 / r, 1e-8), `the sheet's symbols at r = ${r}`);
		const R = riemannSheet(r);
		check(near(R.first, -1, 1e-6) && R.second === 0 && R.third === 0 && near(R.fourth, 1, 1e-8) && near(R.sum, 0, 1e-6), `R^r_thrth at ${r}: ${R.sum}`);
	}
	const carried = carrySheet([1, 0]);
	const corners = SHEET_LOOP.map((p) => p(0)).concat([SHEET_LOOP[0](0)]);
	const dirs = carried.map((v, i) => cartesian(v, corners[i][0], corners[i][1]));
	for (const [i, d] of dirs.entries()) check(near(d[0], 1, 1e-9) && near(d[1], 0, 1e-9), `the sheet's arrow turns at corner ${i}: ${d}`);
	check(near(carried[2][0], 0, 1e-9) && near(carried[2][1], -1 / 3, 1e-9), 'the polar components at (3, 90 degrees) are not (0, -1/3)');
	// ---- the sphere's one number
	for (const th of [0.3, 0.9, 1.4]) {
		const h = 1e-5, G = (t) => -Math.sin(t) * Math.cos(t), cot = Math.cos(th) / Math.sin(th);
		const R = (G(th + h) - G(th - h)) / (2 * h) - G(th) * cot;
		check(near(R, Math.sin(th) ** 2, 1e-8), `R^th_phthph at ${th}`);
		for (const a of [1, 6371e3]) check(near((a * a * R) / (a * a * a * a * Math.sin(th) ** 2), 1 / (a * a), 1e-8 / (a * a)), 'the curvature is not 1/a^2');
	}
	// ---- geodesic deviation
	for (const K of [-2, -1, 1, 0.3]) for (const tau of [0.4, 1.1]) {
		check(near(deviationRK(K, 1, tau), deviation(K, 1, tau), 1e-10), `the deviation with K = ${K}`);
	}
	check(TIDE[0] + 2 * TIDE[1] === 0, 'the tide beside a mass is not trace-free');
	// ---- the count
	const all = freeComponents(4);
	check(all === 20 && all === (16 * 15) / 12, `the free components ${all}`);
	check(freeComponents(2) === 1 && freeComponents(3) === 6, 'the counts in two and three dimensions');
	const byTime = [2, 1, 0].map((k) => freeComponents(4, { keep: (...q) => times(...q) === k }));
	check(byTime.join() === '6,8,6' && byTime[0] + byTime[1] + byTime[2] === 20, `sorted by time indices: ${byTime}`);
	// none with two time indices in one pair: such a pair is zero
	check(freeComponents(4, { keep: (a, b) => a === 0 && b === 0 }) === 0, 'R_00cd is not zero');
	check(9 - 1 === byTime[1], 'one time index: 9 entries, one condition');
	// empty space: 10 in all, 5 with one time index, and the classes of two and of none share 5, all fixed by the tide
	const vac = freeComponents(4, { vacuum: true });
	check(vac === 10, `in empty space ${vac}`);
	const vacB = freeComponents(4, { vacuum: true, keep: (...q) => times(...q) === 1 });
	const vacEandS = freeComponents(4, { vacuum: true, keep: (...q) => times(...q) !== 1 });
	const spaceAlone = freeComponents(4, { vacuum: true, keep: (...q) => times(...q) !== 1, zero: (...q) => times(...q) === 2 });
	check(vacB === 5 && vacEandS === 5 && spaceAlone === 0 && vacB + vacEandS === vac, `empty space: ${vacB} + ${vacEandS}, space alone ${spaceAlone}`);
	return { turn: o.turn, area, count: [all, ...byTime], vacuum: [vacEandS, vacB] };
}
