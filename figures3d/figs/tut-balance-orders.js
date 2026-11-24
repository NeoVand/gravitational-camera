// The tutorial, chapter 10.2 (tutorial/glow/kirchhoff.md), its third diagram: the two orders of the stress spectrum.
// One panel: across, x = hbar omega / k_B T from 0 to 6, linear; up, the spectrum per Re eta Delta_ijkl in units of
// k_B T, on a logarithmic scale from 10^-2 to 10. The emission order 2 x nbar(x), solid ink, falling from 2 at x = 0;
// the symmetrized order x (2 nbar + 1) = x coth(x / 2), dashed ink, rising from 2 and growing as x; the classical 2 k_B T,
// a dotted grey line at 2. A dot on each curve at the energy peak x = 2.821, 0.357 and 3.18 written beside them, joined
// by a hairline named by their ratio, 8.9; a dotted drop from the lower dot to the axis, with 2.821 under it. Ink and
// the page's greys only: no orange or blue.
// Departures from the diagram's comment: the axis up has minor ticks at 2 to 9 in each decade, so that the scale reads
// as logarithmic; the axis across is numbered at 0, 2, 4 and 6 only, so that 2.821 can stand under it at its own place;
// the three curves are named beside them ("emission order, 2x nbar", "symmetrized, x coth(x/2)", "classical"), and the
// axis up is named "spectrum (k_B T Re eta Delta_ijkl)".
// Exact: both curves (asserted to be 2 x nbar and x (2 nbar + 1), to differ by x, to start at 2 and to fall and rise
// throughout, in tut-balance-lib.js), the dots and their values, the ratio 8.9 = (nbar + 1/2) / nbar. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, NUM } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, emission, symmetrized, CLASSICAL, X_PEAK } from './tut-balance-lib.js';

const name = 'tut-balance-orders';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X1 = 6, L0 = -2, L1 = 1;                   // x across; log10 of the spectrum up
const DX = 42, DL = 47;                          // points per unit of x and per decade
const CURVE = 0.7, W_DOT = 0.8;
const DASH = [3, 2], DOTS = [0, 1.7];
const DOT = 1.55;                                // a dot's radius
const MINOR = 1.4;                               // a minor tick's length
const DROP = [0, 1.6];                           // the dotted drop to the axis
const lg = Math.log10;
const caption = 'Look first at the dashed curve climbing: the symmetrized order keeps the zero point and grows without limit, while the emission order dies away with Planck\'s $\\bar n$. Only the solid curve gives Kirchhoff\'s law. Curves exact.';

export default async function () {
	const { state, at } = await chapter(check);
	await palette(check);
	state(name, 'balance-orders', caption);

	const S = new Sheet(name);
	const L = [];
	const W = X1 * DX, H = (L1 - L0) * DL;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: 0, x1: X1, y0: L0, y1: L1 });
	const Q = (x, v) => P.at(x, lg(v));
	check(emission(X1) > 10 ** L0 && symmetrized(X1) < 10 ** L1, 'a curve leaves the panel');

	// ---- the axis up: decades numbered, minor ticks between
	S.path([[P.left, P.bottom], [P.left, P.top]], { color: DIM, width: 0.45, layer: 1, cap: 'butt', what: 'the axis up' });
	const yl = [];
	for (let d = L0; d <= L1; d++) {
		const y = P.Y(d);
		S.path([[P.left, y], [P.left - TICK, y]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at 10^${d}` });
		yl.push(await placed(d < 0 ? (10 ** d).toFixed(-d) : String(10 ** d), P.left - TICK - NUM, y, 1, 0.5, DIM));
		if (d < L1) for (let k = 2; k <= 9; k++) {
			const ym = P.Y(d + lg(k));
			S.path([[P.left, ym], [P.left - MINOR, ym]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the minor tick ${k} x 10^${d}` });
		}
	}
	L.push(...yl);
	L.push(await placed('\\text{spectrum}\\ \\ (k_BT\\,\\mathrm{Re}\\,\\eta\\,\\Delta_{ijkl})', Math.min(...yl.map((l) => l.box.l)), Math.min(...yl.map((l) => l.box.t)) - 4.5, 0, 1, DIM));

	// ---- the classical line, and the two orders
	S.path([Q(0, CLASSICAL), Q(X1, CLASSICAL)], { color: FAINT, width: W_DOT, dash: DOTS, cap: 'round', layer: 1.8, what: 'the classical line' });
	const sym = graph(P, (x) => lg(symmetrized(x)), 0, X1, 0.2);
	const emi = graph(P, (x) => lg(emission(x)), 0, X1, 0.2);
	for (const [pts, what] of [[sym, 'the symmetrized order'], [emi, 'the emission order']]) {
		check(longest(pts) <= 0.2001, `${what} has a step of ${longest(pts)} pt`);
		check(pts.every(([, y]) => y >= P.top && y <= P.bottom), `${what} leaves the panel`);
	}
	S.path(sym, { color: INK, width: CURVE, dash: DASH, cap: 'butt', layer: 2, what: 'the symmetrized order' });
	S.path(emi, { color: INK, width: CURVE, layer: 2.2, what: 'the emission order' });
	check(near(P.Y(lg(emission(0))), P.Y(lg(CLASSICAL)), 1e-9) && near(P.Y(lg(symmetrized(0))), P.Y(lg(CLASSICAL)), 1e-9), 'the curves do not start on the classical line');

	// ---- the dots at the energy peak, their values, the hairline and the ratio
	const up = Q(X_PEAK, at.symmetrized), lo = Q(X_PEAK, at.emission);
	for (const [q, what] of [[up, 'the symmetrized dot'], [lo, 'the emission dot']]) {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([q], DOT, what);
	}
	S.path([[up[0], up[1] + DOT + 1.2], [lo[0], lo[1] - DOT - 1.2]], { color: INK, width: HAIR, layer: 2.5, cap: 'butt', what: 'the hairline' });
	L.push(await S.clear(`${at.ratio.toFixed(1)}\\times`, up[0] + LABEL_GAP + 0.6, P.Y((lg(at.symmetrized) + lg(at.emission)) / 2), 0, 0.5, [1, 0]));
	L.push(await S.clear(at.symmetrized.toFixed(2), up[0] - DOT - 0.5, up[1] - DOT - 0.5, 1, 1, [-0.6, -0.8]));
	L.push(await S.clear(at.emission.toFixed(3), lo[0] - DOT - 0.5, lo[1] + DOT + 0.5, 1, 0, [-0.6, 0.8]));
	S.raw(`<path d="M${n2(lo[0])},${n2(lo[1] + DOT + 1.2)}V${n2(P.bottom)}" stroke="${DIM}" stroke-width="0.55" stroke-dasharray="${DROP.join(' ')}" stroke-linecap="round" fill="none"/>`, 1.2);
	S.mark([[lo[0], lo[1] + DOT + 1.2], [lo[0], P.bottom]], 0.3, 'the drop from the emission dot');

	// ---- the axis across, with 2.821 under it at its own place
	const xl = await xAxis(S, P, { ticks: [0, 2, 4, 6], what: 'the axis across' });
	S.path([[lo[0], P.bottom], [lo[0], P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the tick at the peak' });
	const pk = await placed(String(X_PEAK), lo[0], P.bottom + TICK + NUM, 0.5, 0, INK);
	const below = [...xl, pk].sort((a, b) => a.box.l - b.box.l);
	for (let i = 1; i < below.length; i++) check(below[i].box.l - below[i - 1].box.r >= 3, `the numbers ${below[i - 1].src} and ${below[i].src} under the axis touch`);
	L.push(...below);
	L.push(await placed('x = \\hbar\\omega/k_BT', P.X(X1 / 2), Math.max(...below.map((l) => l.box.b)) + 4, 0.5, 0, DIM));

	// ---- the names of the curves
	{
		const [xs, ys] = Q(3.9, symmetrized(3.9));
		L.push(await S.clear('\\text{symmetrized, }x\\coth(x/2)', xs, ys - LABEL_GAP, 0.5, 1, [-0.5, -1].map((v) => v / Math.hypot(0.5, 1))));
		const [xe, ye] = Q(3.75, emission(3.75));
		L.push(await S.clear('\\text{emission order, }2x\\bar n', xe, ye - LABEL_GAP, 0, 1, [0, -1]));
		const [xc, yc] = Q(5.25, CLASSICAL);
		L.push(await S.clear('\\text{classical}', xc, yc - LABEL_GAP, 0.5, 1, [0, -1]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...at, end: [emission(X1), symmetrized(X1)] };
	return finish(S, L, [270, 320]);
}
