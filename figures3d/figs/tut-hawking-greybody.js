// The tutorial, section 11.3 (tutorial/black-holes/hawking.md), its third diagram: the greybody factors and the
// absorption cross-section of a Schwarzschild hole, from the Regge-Wheeler equation. Two panels side by side, sharing
// their tops and bottoms. Left, on logarithmic axes: Gamma_l against x = GM omega / c^3 from 0.05 to 2.5, for
// l = 2, 3, 4, 6 and 10, each named at its rise; Page's long-wave limit (256/225) x^6, dashed, beside the curve l = 2 up
// to x = 0.25. Right, on linear axes: sigma_abs / 27 pi (GM/c^2)^2 against x from 0 to 3, rising from 0 and swinging
// about a thin line at 1, "capture cross-section". The curve l = 2 and Page's limit in ink, the other degrees in the
// page's grey: the greybody factor is neutral in the chapter's equations, and the figures' one accent, orange, means
// a stretch.
// Departures from the diagram's comment: the left panel is logarithmic in both directions, from x = 0.05 and from
// Gamma = 2 x 10^-7 (where every drawn row of the table is known on both sides of the axis) to 3, since Page's x^6 is
// 2.8 x 10^-4 at x = 0.25 and would lie on a linear axis; on it the dashed line runs from where it enters the panel to
// x = 0.25, and the curves l = 3 to 10 are named by their degree alone, l = 2 in full. The caption says the left
// panel's axes are logarithmic.
// Exact: every curve passes through the values of the chapter's table (tut-hawking-lib.js, read out of the chapter's
// interactive figure's data), joined by monotone cubics (in log Gamma against log x on the left, so that a power law
// is a straight line; in sigma_abs against x on the right, where the interactive figure joins the same points by
// straight lines, which never differ from the cubics by more than 0.6% of the capture area); Page's limit; the line at
// 1. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, X, gamma, share, page, index } from './tut-hawking-lib.js';

const name = 'tut-hawking-greybody';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const H = 118;                                   // both panels' height
const LEFT = { w: 146, x0: 0.05, x1: 2.5, y0: 2e-7, y1: 3 };
const RIGHT = { w: 136, x1: 3, y1: 1.12 };
const BETWEEN = 40;                              // from the left panel's right edge to the right panel's axis
const MAIN = 0.75, OTHER = 0.5, LINE = 0.45;     // the curve l = 2 (and Page's), the other degrees, the line at 1
const DASH = [2.4, 1.6];
const MINOR = 1.5;
const NAME = 7;                                  // the axes' names over the panels
const DEGREES = [2, 3, 4, 6, 10];
const caption = 'Look first at the left panel\'s $\\ell = 2$ curve and its dashed partner, on logarithmic axes: long waves are absorbed as Page\'s $x^6$. On the right, the partial-wave sum climbs to the capture cross-section once the waves are shorter than the hole. Curves from the Regge–Wheeler equation.';

/** A monotone cubic (Fritsch and Carlson) through the points (xs, ys): a function on [xs[0], xs[n - 1]]. */
function monotone(xs, ys) {
	const n = xs.length, h = [], s = [];
	for (let i = 0; i < n - 1; i++) { h.push(xs[i + 1] - xs[i]); s.push((ys[i + 1] - ys[i]) / h[i]); }
	const m = new Array(n);
	m[0] = s[0]; m[n - 1] = s[n - 2];
	for (let i = 1; i < n - 1; i++) {
		if (s[i - 1] * s[i] <= 0) m[i] = 0;
		else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / s[i - 1] + w2 / s[i]); }
	}
	return (x) => {
		let i = 0, j = n - 1;
		while (j - i > 1) { const k = (i + j) >> 1; if (xs[k] <= x) i = k; else j = k; }
		const t = (x - xs[i]) / h[i], t2 = t * t, t3 = t2 * t;
		return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
	};
}

/** Points along a function on [a, b] of the plot P, no two more than `chord` points apart on the page. */
function trace(P, X_, Y_, f, a, b, chord = 0.2) {
	const pts = [[X_(a), Y_(f(a))]];
	let x = a;
	while (x < b) {
		let dx = ((b - a) / 50);
		for (let i = 0; i < 40; i++) {
			const x2 = Math.min(b, x + dx);
			if (Math.hypot(X_(x2) - X_(x), Y_(f(x2)) - Y_(f(x))) <= chord) break;
			dx /= 2;
		}
		x = Math.min(b, x + dx);
		pts.push([X_(x), Y_(f(x))]);
	}
	return pts;
}

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'hawking-greybody', caption);

	const S = new Sheet(name);
	const L = [];
	const total = LEFT.w + BETWEEN + RIGHT.w;
	const top = ORIGIN - H / 2;
	const A = new Plot({ left: ORIGIN - total / 2, top, w: LEFT.w, h: H, x0: Math.log10(LEFT.x0), x1: Math.log10(LEFT.x1), y0: Math.log10(LEFT.y0), y1: Math.log10(LEFT.y1) });
	const B = new Plot({ left: A.right + BETWEEN, top, w: RIGHT.w, h: H, x0: 0, x1: RIGHT.x1, y0: 0, y1: RIGHT.y1 });
	check(near(A.top, B.top, 0) && near(A.bottom, B.bottom, 0), 'the panels do not share their tops and bottoms');
	const AX = (x) => A.X(Math.log10(x)), AY = (g) => A.Y(Math.log10(g));

	// ---- the left panel's axes: logarithmic, ticked at every decade up, numbered at every second
	{
		const xl = await xAxis(S, A, { ticks: [0.1, 0.2, 0.5, 1, 2].map(Math.log10), fmt: (t) => String(+(10 ** t).toFixed(1)), what: 'the left axis across' });
		L.push(...xl);
		L.push(await placed('x = GM\\omega/c^3', A.X((A.x0 + A.x1) / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, A, { ticks: [-6, -4, -2, 0], fmt: (t) => (t === 0 ? '1' : `10^{${t}}`), what: 'the left axis up' });
		L.push(...yl);
		for (const k of [-5, -3, -1]) S.path([[A.left, A.Y(k)], [A.left - MINOR, A.Y(k)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the left axis's tick at 10^${k}` });
		L.push(await placed('\\Gamma_\\ell', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
	}

	// ---- the curves Gamma_l: through the table's points in log-log, from where each enters the panel
	const curves = {};
	for (const l of [...DEGREES].reverse()) {
		const idx = X.map((_, i) => i).filter((i) => X[i] <= LEFT.x1 + 1e-9);
		// the last point below the panel's floor, then every point up to x = 2.5 (the row's 0s left out)
		const first = idx.findIndex((i) => gamma(l, i) >= LEFT.y0);
		check(first > 0 && gamma(l, idx[first - 1]) > 0 && gamma(l, idx[first - 1]) < LEFT.y0, `the row of l = ${l} is not known where it enters the panel`);
		const use = idx.slice(first - 1);
		const lx = use.map((i) => Math.log10(X[i])), lg = use.map((i) => Math.log10(gamma(l, i)));
		const f = monotone(lx, lg);
		for (let k = 0; k < lx.length; k++) check(near(f(lx[k]), lg[k], 1e-12), `the curve of l = ${l} misses the table at ${X[use[k]]}`);
		// where it enters: f = log y0, by bisection on the first step
		let lo = lx[0], hi = lx[1];
		for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (f(mid) < A.y0) lo = mid; else hi = mid; }
		const a = (lo + hi) / 2;
		check(Math.max(a, A.x0) === a || l === 2, `the curve of l = ${l} enters left of the panel`);
		const start = Math.max(a, A.x0);
		const pts = trace(A, A.X.bind(A), A.Y.bind(A), (u) => Math.min(f(u), 0), start, A.x1);
		check(pts.every(([x, y]) => x >= A.left - 1e-9 && x <= A.right + 1e-9 && y >= A.top && y <= A.bottom + 1e-9), `the curve of l = ${l} leaves its panel`);
		S.path(pts, { color: l === 2 ? INK : FAINT, width: l === 2 ? MAIN : OTHER, cap: 'butt', layer: l === 2 ? 3 : 2, what: `the curve of l = ${l}` });
		curves[l] = { f, start };
	}
	check(near(10 ** curves[2].f(Math.log10(0.1)), gamma(2, index(0.1)), 1e-18) && (10 ** curves[2].f(-1)).toExponential(1) === '3.1e-6', 'Gamma_2 at 0.1');
	// Page's limit, dashed, from where it enters the panel to x = 0.25
	{
		const a = (LEFT.y0 / (256 / 225)) ** (1 / 6);
		check(near(page(a), LEFT.y0, 1e-20) && a > curves[2].start, 'Page\'s line enters left of the curve l = 2');
		const pts = trace(A, A.X.bind(A), A.Y.bind(A), (u) => Math.log10(page(10 ** u)), Math.log10(a), Math.log10(0.25));
		S.path(pts, { color: INK, width: MAIN, dash: DASH, cap: 'butt', layer: 3, what: 'Page\'s limit' });
		check(page(0.25).toExponential(1) === '2.8e-4', 'Page\'s limit at 0.25');
		// below the curve l = 2 all the way
		for (const [x, y] of pts) check(y >= AY(10 ** curves[2].f(A.x0 + ((x - A.left) / A.w) * (A.x1 - A.x0))) - 1e-9, 'Page\'s line crosses the curve l = 2');
		// its name in the wedge between it and the curve l = 3, centred between the two at the height 10^-6
		const at = (f, g) => { let lo = A.x0, hi = A.x1; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (f(m) < g) lo = m; else hi = m; } return lo; };
		const xp = at((u) => Math.log10(page(10 ** u)), -6), x3 = at(curves[3].f, -6);
		L.push(await placed('\\text{Page}', (A.X(xp) + A.X(x3)) / 2, A.Y(-6), 0.5, 0.5, INK));
	}
	// the names, at the rises: left of each curve at the height Gamma = 10^-3 (l = 2 in full), moved left to clear
	for (const l of DEGREES) {
		const { f } = curves[l];
		let lo = A.x0, hi = A.x1;
		for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (f(mid) < -3) lo = mid; else hi = mid; }
		const src = l === 2 ? '\\ell = 2' : String(l);
		L.push(await S.clear(src, A.X(lo) - LABEL_GAP - 0.6, A.Y(l === 2 ? -2.2 : -3.4 + 0.45 * DEGREES.indexOf(l)), 1, 0.5, [-1, 0], { color: l === 2 ? INK : DIM }));
	}

	// ---- the right panel: sigma_abs over the capture area, through (0, 0) and the table's points
	{
		const xl = await xAxis(S, B, { ticks: [0, 1, 2, 3], what: 'the right axis across' });
		L.push(...xl);
		L.push(await placed('x', B.X(1.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, B, { ticks: [0, 0.5, 1], what: 'the right axis up' });
		L.push(...yl);
		L.push(await placed('\\sigma_{\\rm abs}/27\\pi(GM/c^2)^2', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
		S.path([B.at(0, 1), B.at(B.x1, 1)], { color: DIM, width: LINE, cap: 'butt', layer: 1.5, what: 'the line at 1' });
		const xs = [0, ...X], ys = [0, ...share];
		const f = monotone(xs, ys);
		for (let k = 0; k < xs.length; k++) check(near(f(xs[k]), ys[k], 1e-12), `the cross-section misses the table at ${xs[k]}`);
		// against the interactive figure's straight lines between the same points
		let worst = 0;
		for (let k = 0; k < xs.length - 1; k++) for (let j = 1; j < 10; j++) {
			const x = xs[k] + ((xs[k + 1] - xs[k]) * j) / 10, lin = ys[k] + ((ys[k + 1] - ys[k]) * j) / 10;
			worst = Math.max(worst, Math.abs(f(x) - lin));
		}
		check(worst < 0.006, `the cubic and the straight lines differ by ${worst}`);
		const pts = trace(B, B.X.bind(B), B.Y.bind(B), f, 0, B.x1);
		check(pts.every(([x, y]) => y >= B.top && y <= B.bottom + 1e-9), 'the cross-section leaves its panel');
		S.path(pts, { color: INK, width: MAIN, cap: 'butt', layer: 3, what: 'the cross-section' });
		L.push(await placed('\\text{capture cross-section}', B.X(0.08), B.Y(1) - LINE / 2 - LABEL_GAP - 1.2, 0, 1, DIM));
		window[name + '-numbers'] = { worst, at1: f(1), swings: [Math.min(...share.slice(index(1.4))), Math.max(...share.slice(index(1.4)))] };
	}

	S.checkAll(L);
	return finish(S, L, [300, 360]);
}
