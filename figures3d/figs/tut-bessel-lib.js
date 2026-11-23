// Shared tools for the four diagrams of the tutorial's chapter 3.6 (tutorial/noise/bessel-and-airy.md):
// tut-bessel-average, tut-bessel-j0-j1, tut-bessel-disc-slit and tut-bessel-airy. Not a figure itself. The charts
// take chapter 3.1's sheet, axes and labels (figs/tut-pot-lib.js, figs/tut-prob-lib.js) and chapter 2.6's sampling
// of curves (figs/tut-fourier-lib.js), imported, not copied. The maps take chapter 3.2's diverging scale
// (figs/tut-noise-lib.js): orange where a value is above zero and blue where it is below, the colour's opacity on the
// page in proportion to the size of the value, up to DEEP at one.
//
// The Bessel functions are those of the chapter's live figure (app/src/lib/tutorial/live/round-pupil.ts), ported: the
// power series of eq:series and its derivative below u = 12, and beyond, the far form of eq:far carried to more terms,
// J_n(u) = sqrt(2 / pi u) (P cos chi - Q sin chi), chi = u - (n/2 + 1/4) pi, with P and Q the asymptotic series in 1/u
// cut at their smallest term. Each is used only on its own side, where both agree with the exact values to about
// 1e-12. `mathematics()` asserts every number of the chapter that a diagram draws.
//
// A map is drawn as an SVG gradient rather than as a raster: a pattern that depends on one coordinate only (a plane
// ripple across its crests, a round pattern along its radius) is a linear or radial gradient whose stops are placed,
// by halving, until straight interpolation between them is within TOL of the exact opacity everywhere. The gradient's
// colour is a palette colour, which the site turns into the theme's own (drawing.ts, THEME), so that the maps read in
// both themes, and it stays exact at any zoom.
import { INK, DIM, FAINT, ACCENT, ACCENT2, PAGE } from '../lib.js';
import { checker, n2, near } from './tut-pot-lib.js';

export { INK, DIM, FAINT, ACCENT, ACCENT2, PAGE, n2, near };

export const DEEP = 0.85;          // a map's strongest opacity, at a value of one (figs/tut-noise-lib.js, DEEP)
export const TOL = 0.0015;         // the largest error of a gradient's straight interpolation, in opacity
export const DASH = [2.2, 1.4];    // a dashed curve, as chapter 3.5's sin u / u
export const DOT = 1.05;           // a marked point, as chapter 3.5's
export const ZERO_LINE = 0.3;      // the dotted line at zero, as chapter 3.5's
export const ZERO_DASH = [1.2, 1.6];

// ---- the Bessel functions --------------------------------------------------------------------------------------
export const SWITCH = 12;

function series(order, u) {
	const q = (u / 2) ** 2;
	let term = order === 0 ? 1 : u / 2;
	let sum = term;
	for (let n = 1; n < 200; n++) {
		term *= -q / (n * (n + order));
		sum += term;
		if (Math.abs(term) < 1e-17 * Math.max(1, Math.abs(sum))) break;
	}
	return sum;
}

function far(order, u) {
	const mu = 4 * order * order;
	let p = 0, q = 0, a = 1, previous = Infinity;
	for (let k = 0; k < 80; k++) {
		const term = a / u ** k;
		if (Math.abs(term) > previous) break;
		previous = Math.abs(term);
		const sign = k % 4 < 2 ? 1 : -1;
		if (k % 2 === 0) p += sign * term;
		else q += sign * term;
		if (Math.abs(term) < 1e-17) break;
		a *= (mu - (2 * k + 1) ** 2) / (8 * (k + 1));
	}
	const chi = u - (order / 2 + 0.25) * Math.PI;
	return Math.sqrt(2 / (Math.PI * u)) * (p * Math.cos(chi) - q * Math.sin(chi));
}

/** J0(u), the circular ripple (eq:j0); even. */
export const J0 = (u) => { const a = Math.abs(u); return a < SWITCH ? series(0, a) : far(0, a); };
/** J1(u) = -J0'(u); odd. */
export const J1 = (u) => { const a = Math.abs(u); const v = a < SWITCH ? series(1, a) : far(1, a); return u < 0 ? -v : v; };
/** The round opening's normalized pattern, 2 J1(x) / x (eq:disc), one at x = 0. */
export const airy = (x) => (Math.abs(x) < 1e-6 ? 1 - (x * x) / 8 : (2 * J1(x)) / x);
/** The slit's, sin x / x. */
export const sinc = (x) => (Math.abs(x) < 1e-6 ? 1 - (x * x) / 6 : Math.sin(x) / x);
/** The far form's envelope, sqrt(2 / pi u) (eq:far). */
export const envelope = (u) => Math.sqrt(2 / (Math.PI * u));

/** The point in (a, b) where f changes sign, by bisection to 1e-13. */
export function bisect(f, a, b) {
	let fa = f(a);
	for (let i = 0; i < 200 && b - a > 1e-13; i++) {
		const m = (a + b) / 2, fm = f(m);
		if (fm === 0) return m;
		if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m;
	}
	return (a + b) / 2;
}

/** The lowest point of f in (a, b), by golden sections. */
export function lowest(f, a, b) {
	const g = (Math.sqrt(5) - 1) / 2;
	for (let i = 0; i < 200; i++) {
		const c = b - g * (b - a), d = a + g * (b - a);
		if (f(c) < f(d)) b = d; else a = c;
	}
	const x = (a + b) / 2;
	return { x, y: f(x) };
}

/** The average of cos(u cos phi) over a whole turn (eq:j0), by the trapezoid rule on n points, which for this
 * periodic integrand converges faster than any power of 1/n: the definition, to check the series against. */
export function average(u, n = 400) {
	let s = 0;
	for (let i = 0; i < n; i++) s += Math.cos(u * Math.cos((2 * Math.PI * i) / n));
	return s / n;
}

/** -J0'(u), the same average differentiated under the integral sign: the average of cos(phi) sin(u cos phi). */
export function slope(u, n = 400) {
	let s = 0;
	for (let i = 0; i < n; i++) { const c = Math.cos((2 * Math.PI * i) / n); s += c * Math.sin(u * c); }
	return s / n;
}

/** The numbers the chapter gives, computed and asserted; returned for the diagrams to draw. */
export function mathematics(name) {
	const check = checker(name);
	// the functions against their definition, and the chapter's values at 2.7 and 10
	for (const u of [0.5, 2.7, 5, 9.9, 11.9]) check(near(J0(u), average(u), 1e-12), `J0(${u}) against the average`);
	for (const u of [12.1, 14, 15, 20]) check(near(J0(u), average(u, 600), 1e-11), `the far form of J0(${u})`);
	// J1 = -J0', the average of cos(phi) sin(u cos phi): the definition differentiated under the integral sign
	for (const u of [1, 4, 11.99, 12.01, 14.5, 20]) check(near(J1(u), slope(u, 600), 1e-11), `J1 = -J0' at ${u}`);
	check(J0(2.7).toFixed(9) === '-0.142449370' && J1(2.7).toFixed(5) === '0.44160', 'the values at 2.7');
	check(J0(10).toFixed(4) === '-0.2459' && J1(10).toFixed(4) === '0.0435', 'the values at 10');
	// the zeros
	const z0 = [[2, 3], [5, 6], [8, 9], [11, 12.5], [14, 15.5]].map(([a, b]) => bisect(J0, a, b));
	const z1 = [[3, 4.5], [6.5, 7.5], [9.5, 10.5], [13, 13.6]].map(([a, b]) => bisect(J1, a, b));
	check(z0.slice(0, 4).map((z) => z.toFixed(3)).join() === '2.405,5.520,8.654,11.792', `the zeros of J0: ${z0}`);
	check(z1.map((z, i) => z.toFixed(i < 3 ? 3 : 2)).join() === '3.832,7.016,10.173,13.32', `the zeros of J1: ${z1}`);
	// they alternate
	check(z0[0] < z1[0] && z1[0] < z0[1] && z0[1] < z1[1] && z1[1] < z0[2] && z0[2] < z1[2] && z1[2] < z0[3] && z0[3] < z1[3] && z1[3] < z0[4], 'the zeros do not alternate');
	// the deepest trough of J0 lies at the first zero of J1
	const trough = lowest(J0, 3, 4.5);
	check(near(trough.x, z1[0], 1e-6) && trough.y.toFixed(3) === '-0.403', `the trough ${trough.x}, ${trough.y}`);
	// the round opening and the slit: the half maxima, the first zeros, the first dips
	const halfDisc = bisect((x) => airy(x) - 0.5, 1, 3);
	const halfSlit = bisect((x) => sinc(x) - 0.5, 1, 3);
	const halfAiry = bisect((x) => airy(x) ** 2 - 0.5, 1, 3);
	check(halfDisc.toFixed(3) === '2.215' && halfSlit.toFixed(3) === '1.895' && halfAiry.toFixed(3) === '1.616', `the half maxima ${halfDisc}, ${halfSlit}, ${halfAiry}`);
	check((z1[0] / Math.PI - 1).toFixed(2) === '0.22', 'the disc\'s first zero is not 22% later');
	const dipDisc = lowest(airy, 4, 6.5), dipSlit = lowest(sinc, 3.5, 6);
	check(dipDisc.x.toFixed(3) === '5.136' && dipDisc.y.toFixed(3) === '-0.132', `the disc's dip ${dipDisc.x}, ${dipDisc.y}`);
	check(dipSlit.x.toFixed(3) === '4.493' && dipSlit.y.toFixed(3) === '-0.217', `the slit's dip ${dipSlit.x}, ${dipSlit.y}`);
	// the brightest ring of the Airy pattern: 1.75% of the peak, at 5.136
	check((100 * dipDisc.y ** 2).toFixed(2) === '1.75', 'the first ring\'s brightness');
	// the shadows' spreads: R/2 for the disc (a half-ellipse), R/sqrt 3 = 0.58 R for the flat bar, by the integrals
	const spread = (w, n = 200000) => { let m0 = 0, m2 = 0; for (let i = 0; i < n; i++) { const a = -1 + (2 * (i + 0.5)) / n; m0 += w(a); m2 += a * a * w(a); } return Math.sqrt(m2 / m0); };
	const sDisc = spread((a) => 2 * Math.sqrt(1 - a * a)), sSlit = spread(() => 1);
	check(near(sDisc, 0.5, 1e-5) && sSlit.toFixed(2) === '0.58', `the spreads ${sDisc}, ${sSlit}`);
	// the light inside the first and second dark rings, 1 - J0^2 - J1^2
	check((1 - J0(z1[0]) ** 2).toFixed(3) === '0.838' && (1 - J0(z1[1]) ** 2 - J1(z1[1]) ** 2).toFixed(3) === '0.910', 'the light inside the dark rings');
	return { z0, z1, trough, halfDisc, halfSlit, halfAiry, dipDisc, dipSlit, sDisc, sSlit };
}

// ---- gradients ------------------------------------------------------------------------------------------------

/** Stops for a gradient on [0, 1] whose colour is `color(t)` (constant between breaks) and whose opacity is `op(t)`:
 * `breaks` are offsets where the colour may change (each gets a stop on either side); between them, stops are added by
 * halving until straight interpolation is within TOL of op at the quarter points of every interval. */
export function stops(op, color, breaks = [], tol = TOL) {
	const edges = [0, ...breaks.filter((b) => b > 0 && b < 1), 1];
	const out = [];
	const add = (t, c, o) => out.push(`<stop offset="${t.toFixed(6)}" stop-color="${c}" stop-opacity="${Math.max(0, Math.min(1, o)).toFixed(4)}"/>`);
	let worst = 0, count = 0;
	for (let e = 0; e < edges.length - 1; e++) {
		const a = edges[e], b = edges[e + 1];
		const mid = (a + b) / 2, c = color(mid);
		const eps = 1e-9 * (b - a);
		const value = (t) => op(Math.min(b - eps, Math.max(a + eps, t)));
		const pts = [a];
		const refine = (x, y, depth) => {
			const fx = value(x), fy = value(y);
			let bad = false;
			for (const s of [0.25, 0.5, 0.75]) {
				const t = x + s * (y - x);
				if (Math.abs(value(t) - (fx + s * (fy - fx))) > tol) bad = true;
			}
			if (bad && depth < 24) { refine(x, (x + y) / 2, depth + 1); refine((x + y) / 2, y, depth + 1); } else pts.push(y);
		};
		// start from 16 pieces, so that no feature narrower than the first test is missed
		for (let i = 0; i < 16; i++) refine(a + ((b - a) * i) / 16, a + ((b - a) * (i + 1)) / 16, 0);
		for (const t of pts) add(t, c, value(t));
		// the error on a fine grid, as the check
		for (let i = 0; i < pts.length - 1; i++) {
			const x = pts[i], y = pts[i + 1], fx = value(x), fy = value(y);
			for (let s = 1; s < 8; s++) { const t = x + (s / 8) * (y - x); worst = Math.max(worst, Math.abs(value(t) - (fx + (s / 8) * (fy - fx)))); }
		}
		count += pts.length;
	}
	return { svg: out.join(''), worst, count };
}
