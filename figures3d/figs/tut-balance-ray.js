// The tutorial, section 10.2 (tutorial/glow/kirchhoff.md), its second diagram: the occupation along a ray through a
// slab. One panel on linear axes: across, the optical depth tau from 0 to 5; up, n_omega / nbar(T) from 0 to 2. The
// occupation n = nbar + (n_0 - nbar) e^{-tau} for the three entering occupations n_0 = 2 nbar, nbar and 0: the first
// and last as solid ink curves falling and rising to nbar, the second the thin dashed line at 1, "nbar(T)". An inset,
// "a thin slab", draws the curve from 0 for tau from 0 to 0.01, the straight ramp n_omega = tau nbar. Ink and the
// page's greys only: no orange or blue.
// Departures from the diagram's comment: the curve that enters at nbar stays at nbar, so it is the dashed line itself,
// and the panel shows two curves and the line rather than three curves and a line beneath them. The inset stands at
// the upper right, over the place where the curves have met, rather than near the origin, since its range, 0.01 of an
// optical depth, is a fiftieth of a point on the panel's scale, and the space under the rising curve is too low for
// it; it is square, so that n_omega = tau nbar runs at 45 degrees; its axes are named, tau and n_omega / nbar, and its
// name beside it says what it shows, "a thin slab: the lower curve near 0, magnified". Its ramp is the exact
// curve 1 - e^{-tau}, which differs from tau by less than tau^2 / 2 (a quarter of a point at its top), and is named
// "n_omega ~ tau nbar". The axes are named "optical depth tau" and "n_omega / nbar(T)".
// Exact: the two curves and the line (the solution of dn/ds = alpha (nbar - n), asserted against a Runge-Kutta
// integration in tut-balance-lib.js, within 2% of nbar by tau = 4), the inset's curve and its scales. Schematic:
// nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, relax } from './tut-balance-lib.js';

const name = 'tut-balance-ray';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X1 = 5, Y1 = 2.12;
const DX = 54, DY = 64;                          // points per optical depth and per nbar
const CURVE = 0.7, LINE = 0.6, DASH = [3, 2];
const INSET = { tau: 0.01, w: 46, at: [2.75, 1.33] };    // its range, its side (square: n = tau at 45 degrees), its lower left corner (units)
const caption = 'Look first at the three curves meeting: whatever enters the slab, the occupation relaxes to the slab\'s own $\\bar n(T)$, so the slab\'s glow does not depend on the radiation around it. In gravity every body lives in the inset, where the occupation is $\\tau$ times $\\bar n$. Curves exact.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'balance-ray', caption);

	const S = new Sheet(name);
	const L = [];
	const W = X1 * DX, H = Y1 * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: X1, y0: 0, y1: Y1 });

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [0, 1, 2, 3, 4, 5], what: 'the axis across' });
	L.push(...xl);
	L.push(await placed('\\text{optical depth }\\tau', P.X(X1 / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	const yl = await yAxis(S, P, { ticks: [0, 1, 2], fmt: (t) => (t === 0 ? null : String(t)), what: 'the axis up' });
	L.push(...yl);
	L.push(await placed('n_\\omega/\\bar n(T)', Math.min(...yl.map((l) => l.box.l)), P.top - 4.5, 0, 1, DIM));

	// ---- the line nbar(T), which is also the curve that enters at nbar
	check(near(relax(2, 0), 2, 0) && near(relax(1, 0), 1, 0) && near(relax(0, 0), 0, 0), 'the entering occupations');
	S.path([P.at(0, 1), P.at(X1, 1)], { color: INK, width: LINE, dash: DASH, cap: 'butt', layer: 2, what: 'the line nbar' });
	for (let i = 0; i <= 50; i++) check(near(relax(1, (i / 50) * X1), 1, 1e-15), 'the curve from nbar leaves the line');
	L.push(await placed('\\bar n(T)', P.right + LABEL_GAP + 1, P.Y(1), 0, 0.5, INK));

	// ---- the two curves, from 2 nbar and from nothing
	for (const n0 of [2, 0]) {
		const pts = graph(P, (t) => relax(n0, t), 0, X1, 0.2);
		check(longest(pts) <= 0.2001, `the curve from ${n0} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top - 1e-9 && y <= P.bottom + 1e-9), `the curve from ${n0} leaves the panel`);
		S.path(pts, { color: INK, width: CURVE, layer: 2.2, what: `the curve from ${n0}` });
		// by tau = 4 it lies within a point and a half of the line
		check(Math.abs(P.Y(relax(n0, 4)) - P.Y(1)) < 1.5, `the curve from ${n0} has not met the line by tau = 4`);
	}

	// ---- the inset: the curve from nothing, tau from 0 to 0.01
	{
		const I = new Plot({ left: P.X(INSET.at[0]), top: P.Y(INSET.at[1]) - INSET.w, w: INSET.w, h: INSET.w, x0: 0, x1: INSET.tau, y0: 0, y1: INSET.tau });
		const fmt = (t) => (t === 0 ? '0' : '0.01');
		const ixl = await xAxis(S, I, { ticks: [0, INSET.tau], fmt, what: 'the inset\'s axis across' });
		L.push(...ixl);
		L.push(...(await yAxis(S, I, { ticks: [0, INSET.tau], fmt: (t) => (t === 0 ? null : '0.01'), what: 'the inset\'s axis up' })));
		const pts = graph(I, (t) => relax(0, t), 0, INSET.tau, 0.2);
		S.path(pts, { color: INK, width: CURVE, layer: 2.2, what: 'the inset\'s ramp' });
		// the ramp is straight: it leaves the line n = tau by less than a quarter of a point
		const off = Math.max(...pts.map(([x, y]) => Math.abs(y - I.Y(I.x0 + ((x - I.left) / I.w) * INSET.tau))));
		check(off < 0.25, `the inset's curve is ${off} pt from a straight ramp`);
		L.push(await S.clear('n_\\omega \\approx \\tau\\bar n', I.X(0.0008), I.Y(0.0058), 0, 1, [0, -1]));
		// its axes named: tau across, under the middle of its axis, between its numbers and on their baseline (none of
		// them descends); n_omega / nbar up, left of its axis at its middle
		L.push(await placed('\\tau', I.X(INSET.tau / 2), Math.max(...ixl.map((l) => l.box.b)), 0.5, 1, DIM));
		L.push(await placed('n_\\omega/\\bar n', I.left - 4, I.Y(INSET.tau / 2), 1, 0.5, DIM));
		// its name, at its right: what it shows
		{
			const rows = ['\\text{a thin slab:}', '\\text{the lower curve}', '\\text{near 0, magnified}'];
			const parts = [];
			let t = I.top;
			for (const src of rows) { const g = await placed(src, I.right + 3 * LABEL_GAP, t, 0, 0, INK); parts.push(g); t = g.box.b + 2; }
			L.push({ src: rows.join(' / '), svg: parts.map((g) => g.svg).join(''), box: { l: Math.min(...parts.map((g) => g.box.l)), r: Math.max(...parts.map((g) => g.box.r)), t: parts[0].box.t, b: parts[2].box.b } });
		}
		check(I.top > P.top, 'the inset leaves the panel');
		// the inset stands clear of the curve from 2 nbar beneath it
		check(I.bottom + 14 < P.Y(relax(2, INSET.at[0])), `the inset's numbers reach the falling curve`);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { at4: [relax(2, 4), relax(0, 4)], thin: relax(0, INSET.tau) };
	return finish(S, L, [290, 330]);
}
