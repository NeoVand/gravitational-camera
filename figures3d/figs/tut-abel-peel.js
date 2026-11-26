// The tutorial, section 5.6 (tutorial/waves/abel-transform.md), its fourth diagram: errors grow inward as the shells
// are peeled. One chart: across, r/R from 0 (the centre, left) to 1 (the surface, right); up, the glow in units of the
// true glow. Five shells of equal width R/5, all of glow 1: a thin dashed grey line at 1 across the axis, named "true";
// the recovered glows, five short ink bars at 1, one across the middle of each shell; through each, a vertical error
// bar in section 3.1's colour of the noise, of half-height 1.0, 1.6, 2.2, 3.1 and 5.8% from the surface inward, drawn
// ten times their size ("error bars x 10" in the lower right corner). Numerals 1 to 5 over the error bars, from the
// right, the order in which the shells are read, and over them a thin arrow from right to left named "peeling order".
// Departures from the diagram's comment: the vertical axis runs to 1.6, not 1.3, since the innermost error bar, 5.8%
// drawn ten times, reaches 1.58; the axis has numbers only at 0 and 1, the glows' zero and true value. The bars span
// the middle seven tenths of each shell, so that the dashed true line shows between them. The error bars are drawn in
// the second accent (blue), section 3.1's colour for the noise (figs/tut-prob-lib.js, NOISE), and "error bars x 10"
// with them. The chart is drawn at half a point per site pixel, 282 by 102 points for the data.
// Exact: the recovered glows, 1 (the peeling of exact readings, asserted in tut-abel-lib.js), and the error bars'
// half-heights, each reading's 1% carried exactly through the peeling (asserted there: 1.0, 1.6, 2.2, 3.1 and 5.8%,
// also against 40,000 seeded noisy peelings), drawn ten times their size (asserted in points). Schematic: the bars'
// width. Nothing else is.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NOISE } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, FIVE, DASH } from './tut-abel-lib.js';

const name = 'tut-abel-peel';
const check = checker(name);

const PW = 282, PH = 102;                  // the chart, points
const TOP = 1.6;
const SCALE = 10;                          // the error bars' exaggeration
const SPAN = 0.7;                          // a bar's share of its shell's width
const BAR = 1.0;                           // a bar's stroke
const ERR = 0.6, CAP = 2.6;                // an error bar's stroke and half its caps' width
const ARROW = 0.5, HEAD = 3.4;             // the arrow of the peeling order
const UP = 9;                              // from the highest numeral's top to the arrow

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: 0, x1: 1, y0: 0, y1: TOP });

	// ---- the true glow, dashed under everything
	S.path([P.at(0, 1), P.at(1, 1)], { color: FAINT, width: HAIR + 0.1, dash: DASH, layer: 1, cap: 'butt', what: 'the true glow' });

	// ---- the shells, from the surface (k = 1) inward: a bar at the recovered glow, its error bar, its numeral
	const numerals = [];
	for (let k = 1; k <= 5; k++) {
		const outer = FIVE[k - 1], inner = FIVE[k], mid = (outer + inner) / 2, half = (SPAN * (outer - inner)) / 2;
		const e = nums.errors[k - 1], glow = 1;
		check(near(outer - inner, 0.2, 1e-15), `shell ${k} is not R/5 wide`);
		const y = P.Y(glow), x = P.X(mid);
		const lo = P.Y(glow - SCALE * e), hi = P.Y(glow + SCALE * e);
		check(near((lo - hi) / 2, (SCALE * e * PH) / TOP, 1e-9) && hi > P.top - 1e-9, `the error bar of shell ${k}`);
		S.path([P.at(mid - half, glow), P.at(mid + half, glow)], { color: INK, width: BAR, layer: 2, cap: 'butt', what: `the bar of shell ${k}` });
		S.path([[x, lo], [x, hi]], { color: NOISE, width: ERR, layer: 3, cap: 'butt', what: `the error bar of shell ${k}` });
		for (const yy of [lo, hi]) S.path([[x - CAP, yy], [x + CAP, yy]], { color: NOISE, width: ERR, layer: 3, cap: 'butt', what: `the error bar's cap, shell ${k}` });
		const n = await placed(String(k), x, hi - ERR / 2 - LABEL_GAP - 1, 0.5, 1, INK);
		numerals.push(n);
		L.push(n);
	}
	check(nums.errors.every((e, i) => i === 0 || e > nums.errors[i - 1]), 'the errors do not grow inward');

	// ---- the axes
	L.push(...await xAxis(S, P, { ticks: [0, 0.2, 0.4, 0.6, 0.8, 1], fmt: (t) => String(t), what: 'the r axis' }));
	L.push(...await yAxis(S, P, { ticks: [0, 1], fmt: (t) => String(t), what: 'the glow axis' }));
	{
		const one = L.filter((l) => l.src === '1').reduce((a, b) => (a.box.t > b.box.t ? a : b));
		L.push(await placed('r/R', one.box.r + LABEL_GAP + 2.5, (one.box.t + one.box.b) / 2, 0, 0.5, DIM));
		L.push(await placed('\\text{glow}', P.left, P.top - 5, 0.5, 1, DIM));
	}

	// ---- the peeling order: an arrow from right to left over the numerals, named over its middle
	const ya = Math.min(...numerals.map((n) => n.box.t)) - UP;
	const a = S.arrow([P.X(0.97), ya], [P.X(0.08), ya], { color: DIM, width: ARROW, head: HEAD, layer: 2, what: 'the peeling order' });
	check(a.head <= 0.4 * a.L, 'the arrow\'s head');
	L.push(await S.clear('\\text{peeling order}', P.X(0.525), ya - LABEL_GAP - 1, 0.5, 1, [0, -1], { color: DIM }));

	// ---- the names: true at the right end of its line; the exaggeration in the lower right corner
	L.push(await S.clear('\\text{true}', P.right + LABEL_GAP + 1, P.Y(1), 0, 0.5, [1, 0], { color: DIM }));
	L.push(await S.clear('\\text{error bars} \\times 10', P.right, P.Y(0.22), 1, 1, [0, -1], { color: NOISE }));

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, [240, 340]);
}
