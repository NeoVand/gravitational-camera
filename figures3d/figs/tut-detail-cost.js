// The tutorial, chapter 13.2 (tutorial/what-a-field-keeps/calderon.md), its fourth diagram: what fine detail costs a
// second reading. Log-log axes: across, the detail 2 pi/|xi| from 2 cm to 1 m, increasing to the right; up, the span
// e^{|xi|R} of the two exponentials across the steel ball of radius R = 0.5 m, from 1 to 10^40, drawn as one exact
// curve, log10 span = 2 pi R / (d ln 10), which leaves the top of the plot at d = 3.4 cm. Three marked points at 20, 10
// and 5 cm with their values 6.6 x 10^6, 4.4 x 10^13 and 1.9 x 10^27 beside them, off the curve, and one faint
// horizontal line at 10^18, "best clocks, 10^18".
// Departures from the diagram's comment: the line's label carries its value, 10^18, since the vertical axis is ticked
// only every ten decades.
// Exact: the curve, the points and their values (tut-calderon-lib.js, asserted against the chapter's text), the line.
// Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, n2, LABEL_GAP, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { text } from '../stone.js';
import { chapter, log10Span, DETAILS, CLOCKS, sci, CLOCK_DETAIL, near } from './tut-calderon-lib.js';

const name = 'tut-detail-cost';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const W = 226, H = 150;                // the plot
const CURVE_W = 0.7;                   // the curve
const DOT_R = 1.35;                    // a marked point
const MINOR = 1.5;                     // a minor tick
const VALUE = [3.2, 1.6];             // a value's lower left corner from its point
const NAME_UP = 7;                     // the vertical axis's name over the plot
const TOP = 40;                        // log10 of the plot's top
const caption = 'Look first at the three marked points: halving the size of the detail squares the precision a second reading needs. The faint line is the best fractional precision of today\'s clocks, for comparison. The ball is the steel ball one metre across.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'detail-cost', caption);

	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: Math.log10(0.02), x1: 0, y0: 0, y1: TOP });
	const X = (d) => P.X(Math.log10(d));

	// ---- the axes
	{
		const ticks = [0.02, 0.05, 0.1, 0.2, 0.5, 1].map(Math.log10);
		const fmt = (t) => { const d = 10 ** t; return d >= 0.999 ? '1\\,\\mathrm m' : `${Math.round(d * 100)}\\,\\mathrm{cm}`; };
		const xl = await xAxis(S, P, { ticks, fmt, what: 'the detail axis' });
		L.push(...xl);
		for (const d of [0.03, 0.04, 0.06, 0.07, 0.08, 0.09, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9]) {
			S.path([[X(d), P.bottom], [X(d), P.bottom + MINOR]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the tick at ${d}` });
		}
		L.push(await placed('\\text{detail }2\\pi/|\\boldsymbol\\xi|', P.X((P.x0 + P.x1) / 2), Math.max(...xl.map((l) => l.box.b)) + 3.6, 0.5, 0, DIM));
		const yl = await yAxis(S, P, { ticks: [0, 10, 20, 30, 40], fmt: (t) => (t === 0 ? null : `10^{${t}}`), what: 'the span axis' });
		L.push(...yl);
		L.push(await placed('\\text{span }e^{|\\boldsymbol\\xi|R}\\ \\ (R = 0.5\\,\\mathrm m)', Math.min(...yl.map((l) => l.box.l)), P.top - NAME_UP, 0, 1, DIM));
	}

	// ---- the clocks' line, under the curve
	const yc = P.Y(Math.log10(CLOCKS));
	S.path([[P.left + 0.3, yc], [P.right, yc]], { color: FAINT, width: HAIR, cap: 'butt', layer: 1, what: 'the clocks' });
	L.push(await placed(text('best clocks, ') + '10^{18}', P.right, yc - LABEL_GAP - 0.4, 1, 1, DIM));

	// ---- the curve: from 1 m to where it leaves the top
	const dTop = 10 ** Math.log10((2 * Math.PI * 0.5) / (TOP * Math.LN10));
	check(near(log10Span(dTop), TOP, 1e-9) && dTop.toFixed(4) === '0.0341', `the curve leaves the top at ${dTop}`);
	const n = 1200, pts = [];
	for (let i = 0; i <= n; i++) {
		const u = Math.log10(dTop) + ((0 - Math.log10(dTop)) * i) / n;
		pts.push([P.X(u), P.Y(log10Span(10 ** u))]);
	}
	check(near(pts[0][1], P.top, 1e-6) && pts.every(([x, y]) => x >= P.left - 1e-9 && x <= P.right + 1e-9 && y >= P.top - 1e-6 && y <= P.bottom), 'the curve leaves the plot');
	S.path(pts, { color: INK, width: CURVE_W, cap: 'butt', layer: 3, what: 'the curve' });
	// it crosses the clocks' line at 7.6 cm
	check(near(log10Span(CLOCK_DETAIL), 18, 1e-12), 'the crossing');

	// ---- the three points and their values, right of each
	for (const d of DETAILS) {
		const y = log10Span(d), p = [X(d), P.Y(y)];
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${DOT_R}" fill="${INK}"/>`, 4);
		S.mark([p], DOT_R, `the point at ${d}`);
		const [m, e] = sci(y);
		// one offset for all three, up and to the right of the point, where the curve is not
		L.push(await placed(`${m}\\times10^{${e}}`, p[0] + VALUE[0], p[1] - VALUE[1], 0, 1, INK));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { spans: DETAILS.map((d) => sci(log10Span(d))), top: dTop, clocks: CLOCK_DETAIL };
	return finish(S, L, [240, 340]);
}
