// The tutorial, section 8.2 (tutorial/quantum/operators.md), its first diagram: three Gaussian packets and their
// momenta. Three columns side by side, one per packet, of widths sigma_x = 2 l, l and l/2 for an arbitrary length l.
// In each column two thin plots, one above the other: above, |psi(x)|^2 against x; below, the momentum density
// |psi~(k)|^2 / 2 pi hbar against p = hbar k (section 2.6's transform, as the chapter has it), whose spreads are
// sigma_p = hbar/4l, hbar/2l and hbar/l. The rows keep one scale across the three columns, in both directions, so the
// narrow packet stands four times as tall as the wide one and has the wide distribution of momenta. Each curve's
// standard deviation is marked as section 2.6's tut-fourier-gauss marks it: a short horizontal bracket at e^{-1/2} of
// the curve's height, from the centre to where the curve crosses that level, which for a Gaussian is exactly one
// standard deviation out. Under each column, "sigma_x sigma_p = hbar/2". Ink only; no orange or blue.
// Departures from the diagram's comment: the brackets' labels carry their values ("sigma_x = 2l", "sigma_p = hbar/4l"),
// so that the halving and the doubling can be read off the drawing; each row is named once, above it ("|psi(x)|^2
// against x", "|psi~(k)|^2 / 2 pi hbar against p = hbar k"), and each axis has ticks at -4l, 0, 4l (x) and -2 hbar/l,
// 0, 2 hbar/l (p), numbered, so that the common scales show. One drawing serves every width: the columns stay side by
// side on a phone (the site shows the same drawing at every width).
// Exact: every curve (closed forms, asserted against quadrature: the areas, the standard deviations and the transform);
// the brackets' heights and lengths; the scales (one per row). Chosen for the drawing: the ranges and the two rows'
// heights.
import { Sheet, ORIGIN, finish, checker, placed, near, AXIS, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, merge, LABEL_GAP, END, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, WIDTHS, xDensity, pDensity, sigmaP } from './tut-operators-lib.js';

const name = 'tut-uncertainty-widths';
const check = checker(name);

// ---- the drawing (points); l = hbar = 1 --------------------------------------------------------------------------
const PW = 96, GUT = 14;                 // a panel's width; between the columns
const PH = 40;                           // the tallest curve of each row
const XR = 5.6, PR = 2.8;                // x from -XR l to XR l; p from -PR hbar/l to PR hbar/l
const XT = [-4, 0, 4], PT = [-2, 0, 2];  // the ticks
const TITLE_AIR = 4;                     // a row's title to its tallest curve
const ROW_AIR = 9;                       // the first row's numbers to the second row's title
const PRODUCT_AIR = 6;                   // the second row's numbers to the products
const BRACKET = 0.55;

const lstr = (v) => (v === 0.5 ? '\\ell/2' : v === 1 ? '\\ell' : `${v}\\ell`);
const pstr = (v) => (v === 0.25 ? '\\hbar/4\\ell' : v === 0.5 ? '\\hbar/2\\ell' : v === 1 ? '\\hbar/\\ell' : `${v}\\hbar/\\ell`);
const tick = (t, unit) => (t === 0 ? '0' : `${t < 0 ? '-' : ''}${Math.abs(t)}${unit}`);

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = 3 * PW + 2 * GUT, left = ORIGIN - W / 2;
	const level = Math.exp(-0.5);
	const xTop = xDensity(Math.min(...WIDTHS))(0), pTop = pDensity(Math.max(...WIDTHS))(0);
	check(near(xTop / xDensity(Math.max(...WIDTHS))(0), 4, 1e-12) && near(pTop / pDensity(Math.min(...WIDTHS))(0), 4, 1e-12), 'the tallest curves are not four times the lowest');
	// the curves must fit their ranges: each falls below the axis's merge before the panel's edge
	check(xDensity(2)(XR) / xTop < 0.02 && pDensity(0.5)(PR) / pTop < 0.02, 'a curve is cut by its panel');

	// row 1's title, then its plots
	const t1 = await placed('|\\psi(x)|^2\\text{ against }x', left, ORIGIN - 80, 0, 1, INK);
	L.push(t1);
	const top1 = t1.box.b + TITLE_AIR;
	let rowBottom = 0;
	const plots = [];
	for (const [c, s] of WIDTHS.entries()) {
		const x0 = left + c * (PW + GUT);
		const A = new Plot({ left: x0, top: top1, w: PW, h: PH, x0: -XR, x1: XR, y0: 0, y1: xTop });
		plots.push(A);
	}
	// the curves, brackets and axes of a row
	async function row(P, f, sd, ticks, unit, src, what) {
		const clear = merge(P, CURVE);
		let lo = 0, hi = P.x1;
		if (f(hi) < clear) for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(m) > clear) lo = m; else hi = m; }
		const pts = graph(P, f, -hi, hi);
		check(longest(pts) <= 0.2501, `${what} has a step of ${longest(pts)} pt`);
		S.path(pts, { color: INK, width: CURVE, layer: 2, what });
		// the axis, its ticks and numbers
		S.path([[P.left, P.bottom], [P.right, P.bottom]], { color: DIM, width: AXIS, layer: 1, cap: 'butt', what: `${what}'s axis` });
		let low = P.bottom;
		for (const t of ticks) {
			S.path([[P.X(t), P.bottom], [P.X(t), P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `${what}'s tick at ${t}` });
			const n = await placed(tick(t, unit), P.X(t), P.bottom + TICK + NUM, 0.5, 0, DIM);
			L.push(n);
			low = Math.max(low, n.box.b);
		}
		// the bracket: from the centre to the crossing of e^{-1/2} of the top, exactly one standard deviation out
		check(near(f(sd), f(0) * level, 1e-12), `${what}: the bracket is not at its standard deviation`);
		const y = P.Y(f(sd));
		S.path([[P.X(0), y], [P.X(sd), y]], { color: INK, width: BRACKET, layer: 3, cap: 'butt', what: `${what}'s bracket` });
		S.path([[P.X(0), y - END], [P.X(0), y + END]], { color: INK, width: BRACKET, layer: 3, cap: 'butt', what: `${what}'s bracket's end` });
		L.push(await S.clear(src, P.X(sd) + LABEL_GAP + 1.2, y - LABEL_GAP - 0.6, 0, 1, [1, 0]));
		return low;
	}
	for (const [c, s] of WIDTHS.entries())
		rowBottom = Math.max(rowBottom, await row(plots[c], xDensity(s), s, XT, '\\ell', `\\sigma_x = ${lstr(s)}`, `|psi|^2 of width ${s}`));

	// row 2
	const t2 = await placed('|\\tilde\\psi(k)|^2/2\\pi\\hbar\\text{ against }p = \\hbar k', left, rowBottom + ROW_AIR, 0, 0, INK);
	L.push(t2);
	const top2 = t2.box.b + TITLE_AIR;
	let bottom2 = 0;
	const lows = [];
	for (const [c, s] of WIDTHS.entries()) {
		const x0 = left + c * (PW + GUT);
		const B = new Plot({ left: x0, top: top2, w: PW, h: PH, x0: -PR, x1: PR, y0: 0, y1: pTop });
		const low = await row(B, pDensity(s), sigmaP(s), PT, '\\hbar/\\ell', `\\sigma_p = ${pstr(sigmaP(s))}`, `the momenta of width ${s}`);
		lows.push([B, low]);
		bottom2 = Math.max(bottom2, low);
		check(near(s * sigmaP(s), 0.5, 1e-15), `sigma_x sigma_p is not hbar/2 for ${s}`);
	}
	for (const [B] of lows) L.push(await placed('\\sigma_x\\sigma_p = \\hbar/2', B.X(0), bottom2 + PRODUCT_AIR, 0.5, 0, INK));
	// the same scales: one unit of x, and one of p, the same length in every column
	check(near(plots[0].X(1) - plots[0].X(0), plots[2].X(1) - plots[2].X(0), 1e-12) && near(lows[0][0].Y(0) - lows[0][0].Y(1), lows[2][0].Y(0) - lows[2][0].Y(1), 1e-12), 'the scales differ');

	S.checkAll(L);
	window[name + '-numbers'] = { widths: WIDTHS, spreads: WIDTHS.map((s) => sigmaP(s)) };
	return finish(S, L, [240, 340]);
}
