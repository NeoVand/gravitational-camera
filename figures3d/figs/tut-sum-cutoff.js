// The tutorial, chapter 13.7 (tutorial/what-a-field-keeps/thermometer.md), its first diagram: where the hole's sum
// comes from. One panel on logarithmic axes: across, x = GM omega / c^3 from 0.01 to 3; up, the integrand of the sum,
// (5/32 pi) Gamma_2 / x^4, in units of M r_s^2, from 10^-6 to 3 (the axis starts a little below 10^-6, so that its
// numbers clear those across). The integrand from the Regge-Wheeler Gamma_2, thin solid ink, its peak, 1.34 at
// x = 0.40, an ink dot; Page's line (5/32 pi)(256/225) x^2 dashed, which the curve leaves as it rises; the swallowing
// tail (5/32 pi) x^-4 dotted, which the curve joins near x = 0.6. The band 0.3 <= x <= 0.6, which holds 74% of the sum,
// a pale neutral tint, its share printed in it. At x = 1/8 pi a tick on the axis, numbered, and a faint dotted rule up
// to the words "friction law and classical tremor hold to the left". Each line is named beside it.
// Departures from the diagram's comment: the band is the page's neutral tint, not the paper's pale orange, which in
// the tutorial's figures means a stretch; the laws are dashed and dotted in the page's dim grey, as chapter 11.4's
// tut-hole-imchi draws them; the mark at 1/8 pi is a tick numbered on the axis and a faint dotted rule up to its words
// in the empty upper left, since the lower left, under the curve, has no room for them; the lines are named by short
// formulas ("Page's limit, ∝ x^2", "Gamma_2 = 1, ∝ x^-4"), their factors being the curve's own 5/32 pi; the peak is
// labelled "1.34 at x = 0.40", as the chapter gives x to two places; a tick at 3 closes the axis, as in
// tut-hole-imchi.
// Exact: the curve (tut-thermo-lib.js: the solver's Gamma_2 on 241 points, asserted against chapter 11.3's table, ln
// Gamma_2 a cubic spline in ln x between them), the two laws, the peak (from the solver, asserted against the spline),
// the band's share (the integral, asserted against the chapter's 6.938 and "three quarters"), and x = 1/8 pi.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, TINT } from './tut-prob-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, near, X, integrand, pageLine, tail, PEAK, K, I2, moment } from './tut-thermo-lib.js';

const name = 'tut-sum-cutoff';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = -2, X1 = lg(3), Y0 = -6.3, Y1 = lg(3);
const DX = 98, DY = 26;                         // points per decade
const CURVE = 0.7, LAW = 0.55, DASH = [3, 2], DOT_R = 1.55;
const SMALL = 7;                                // the words at 1/8 pi
const BAND = [0.3, 0.6];
const EDGE = 1 / (8 * Math.PI);
const caption = 'Look first at the shaded band: three quarters of the hole\'s sum comes from frequencies where it begins to swallow waves. Below, the integrand follows Page\'s $x^2$, the friction law; above, it falls as $x^{-4}$, because every short wave is swallowed. Curves exact.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'sum-cutoff', caption);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const at = (x, y) => P.at(lg(x), lg(y));

	// ---- the band, under everything
	const share = moment(...BAND) / I2;
	check(Math.round(share * 100) === 74, `the band's share is ${share}`);
	{
		const l = P.X(lg(BAND[0])), r = P.X(lg(BAND[1]));
		S.raw(`<rect x="${n2(l)}" y="${n2(P.top)}" width="${n2(r - l)}" height="${n2(P.h)}" fill="${TINT}"/>`, 0.2);
		S.boxes.push({ box: { l, r, t: P.top, b: P.bottom }, what: 'the band' });
	}

	// ---- the axes, with the tick at 1/8 pi among the numbers
	const pow = (k) => (k === 0 ? '1' : `10^{${k}}`);
	const xl = await xAxis(S, P, {
		ticks: [-2, lg(EDGE), -1, 0, lg(3)],
		fmt: (t) => (near(t, lg(3), 1e-12) ? '3' : near(t, lg(EDGE), 1e-12) ? '1/8\\pi' : ['0.01', '0.1', '1'][t + 2]),
		what: 'the axis across'
	});
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-6, -5, -4, -3, -2, -1, 0], fmt: pow, what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('x = GM\\omega/c^3', P.X(-0.5), below + 4, 0.5, 0, DIM));
	L.push(await placed('\\text{integrand of the sum (units of }Mr_s^2\\text{)}', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the laws: Page's line across the panel, dashed; the tail, dotted, from where it enters at the top
	check(lg(pageLine(10 ** X0)) > Y0 && lg(pageLine(10 ** X1)) < Y1, 'Page\'s line leaves the panel');
	S.path([at(10 ** X0, pageLine(10 ** X0)), at(10 ** X1, pageLine(10 ** X1))], { color: DIM, width: LAW, dash: DASH, cap: 'butt', layer: 1.6, what: 'Page\'s line' });
	const xTop = (K / 10 ** Y1) ** (1 / 4);
	check(near(tail(xTop), 10 ** Y1, 1e-12) && xTop > 0.35 && xTop < PEAK.x, `the tail enters at ${xTop}`);
	S.dots(at(xTop, tail(xTop)), at(10 ** X1, tail(10 ** X1)), { color: DIM, layer: 1.7, what: 'the tail' });

	// ---- the integrand, on the grid's points
	const pts = X.map((x) => at(x, integrand(x)));
	check(pts.every(([, y]) => y >= P.top && y <= P.bottom), 'the curve leaves the panel');
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the integrand' });
	// it lies on Page's line at the left (within 7%) and on the tail at the right (within a thousandth from 0.6)
	check(integrand(0.01) / pageLine(0.01) < 1.08 && Math.abs(integrand(0.6) / tail(0.6) - 1) < 1e-3, 'the curve\'s two ends');

	// ---- the peak
	const pk = at(PEAK.x, PEAK.value);
	S.raw(`<circle cx="${n2(pk[0])}" cy="${n2(pk[1])}" r="${DOT_R}" fill="${INK}"/>`, 3);
	S.mark([pk], DOT_R, 'the peak');
	L.push(await S.clear(`${PEAK.value.toFixed(2)}\\ \\text{at}\\ x = ${PEAK.x.toFixed(2)}`, pk[0] - DOT_R - LABEL_GAP, pk[1] - 1, 1, 0.5, [-0.97, -0.24], { gap: LABEL_GAP + 1.4 }));

	// ---- the band's share, low in the band
	{
		const lab = await placed(`${Math.round(share * 100)}\\%`, P.X(lg(Math.sqrt(BAND[0] * BAND[1]))), P.Y(-4.6), 0.5, 0.5, INK);
		check(lab.box.l > P.X(lg(BAND[0])) + 2 && lab.box.r < P.X(lg(BAND[1])) - 2, 'the share does not fit the band');
		L.push({ ...lab, on: ['the band'] });
	}

	// ---- 1/8 pi: a faint dotted rule from the tick up, and its words at the top, left of it
	{
		const x = P.X(lg(EDGE));
		const words = await placed('\\begin{array}{r}\\text{friction law and}\\\\\\text{classical tremor}\\\\\\text{hold to the left}\\end{array}', x - 3, P.top, 1, 0, DIM, SMALL);
		S.dots([x, P.bottom - TICK], [x, P.top], { color: FAINT, clear0: 0, clear1: 0, layer: 0.9, what: 'the rule at 1/8 pi' });
		check(words.box.l > P.left + 4, 'the words at 1/8 pi reach the axis');
		L.push(words);
	}

	// ---- the names: the curve's left of its rise; Page's line's under it; the tail's right of its top
	{
		const x = 0.2, y = 0.3;
		check(integrand(x) < y / 5, 'the curve\'s name is not left of its rise');
		L.push(await S.clear('(5/32\\pi)\\,\\Gamma_2/x^4', P.X(lg(x)), P.Y(lg(y)), 1, 0.5, [-1, 0]));
	}
	{
		// under the line, from x = 0.05, ending before the band
		const q = at(0.05, pageLine(0.05));
		const lab = await placed('\\text{Page\'s limit, }\\propto x^2', q[0], q[1] + LABEL_GAP + 1.2, 0, 0, INK);
		check(lab.box.r < P.X(lg(BAND[0])) - LABEL_GAP, 'Page\'s name reaches the band');
		L.push(lab);
	}
	{
		const q = at(0.47, tail(0.47));
		L.push(await S.clear('\\Gamma_2 = 1,\\ \\propto x^{-4}', q[0] + 3, q[1], 0, 0.5, [1, 0]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { peak: PEAK, share, xTop, I2, edge: EDGE };
	return finish(S, L, [260, 340]);
}
