// The tutorial, section 8.5 (tutorial/quantum/counting-quanta.md), its first diagram: the counts of a coherent and of
// a thermal mode with the same mean. One panel: bars of P(n) for n = 0 to 14 at nbar = 4, side by side at each n, the
// coherent (Poisson) state's e^{-4} 4^n / n! as ink outlines on the left of each pair and the thermal state's
// 4^n / 5^{n+1} as light grey filled bars on the right. Across, the count n (ticks every 2); up, the probability, 0 to
// 0.21 (ticks every 0.05). A thin dashed vertical line at the common mean, n = 4, labelled "nbar = 4". The labels
// "coherent (Poisson)" and "thermal (geometric)" beside the bars, off them. Ink and the page's greys only.
// Departures from the diagram's comment: the dashed line at the mean runs up the gap between the two bars of n = 4, so
// that it crosses neither; "coherent (Poisson)" sits just right of the top of the coherent bar at n = 5 and "thermal
// (geometric)" above the thermal tail at n = 9 to 13, where only grey bars stand, so that each label is nearest the bars
// it names. The coherent bars at n = 12 to 14 (P < 0.001) are shorter than their own outline's width and are not drawn.
// Exact: every bar (the closed forms, asserted in tut-counting-lib.js against the values the comment lists, against
// their sums, means 4 and variances 4 and 20, and the geometric law against the Poisson law averaged over an
// exponential intensity); the mean. Chosen for the drawing: the bars' widths and the gap between the two of a pair.
import { Sheet, ORIGIN, finish, checker, placed, AXIS, HAIR, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, palette, near, NBAR, NMAX, poisson, geometric } from './tut-counting-lib.js';

const name = 'tut-count-bars';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const UNIT = 18.5;                       // points per count
const PH = 150;                          // the panel's height, 0 to Y1
const X0 = -0.75, X1 = NMAX + 0.75;
const Y1 = 0.21;
const BAR = 0.33;                        // a bar's width, in counts
const GAP = 0.12;                        // between the two bars of a pair, in counts (the pairs 0.22 apart)
const OUTLINE = 0.5;                     // the coherent bars' outline
const MEAN_W = 0.45, DASH = [2.4, 1.6];

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * UNIT;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - PH / 2, w: W, h: PH, x0: X0, x1: X1, y0: 0, y1: Y1 });
	const left = (n) => [P.X(n - GAP / 2 - BAR), P.X(n - GAP / 2)];    // the coherent bar of n
	const right = (n) => [P.X(n + GAP / 2), P.X(n + GAP / 2 + BAR)];  // the thermal bar of n

	// ---- the thermal bars, light grey, filled
	let d = '';
	for (let n = 0; n <= NMAX; n++) {
		const p = geometric(NBAR, n), [a, b] = right(n), y = P.Y(p);
		check(p < Y1 * 0.97, `the thermal bar ${n} reaches the top`);
		d += `M${n2(a)},${n2(P.bottom)}V${n2(y)}H${n2(b)}V${n2(P.bottom)}Z`;
		S.boxes.push({ box: { l: a, r: b, t: y, b: P.bottom }, what: `the thermal bar ${n}` });
	}
	S.raw(`<path d="${d}" fill="${RULE}"/>`, 0.5);
	// ---- the coherent bars, ink outlines open at the axis
	let drawn = 0;
	for (let n = 0; n <= NMAX; n++) {
		const p = poisson(NBAR, n), [a, b] = left(n), y = P.Y(p);
		check(p < Y1 * 0.97, `the coherent bar ${n} reaches the top`);
		if (P.bottom - y < OUTLINE) { check(p < 1e-3, `the coherent bar ${n} (${p}) is left out`); continue; }
		const ia = a + OUTLINE / 2, ib = b - OUTLINE / 2, iy = y + OUTLINE / 2;
		S.path([[ia, P.bottom], [ia, iy], [ib, iy], [ib, P.bottom]], { color: INK, width: OUTLINE, layer: 2, cap: 'butt', what: `the coherent bar ${n}` });
		drawn++;
	}
	check(drawn === 12, `${drawn} coherent bars drawn`);
	check(P.X(GAP / 2) - P.X(-GAP / 2) - MEAN_W > 1.6, 'the gap between a pair is too narrow for the mean\'s line');

	// ---- the axes
	const xt = Array.from({ length: NMAX / 2 + 1 }, (_, i) => 2 * i), yt = [0, 0.05, 0.1, 0.15, 0.2];
	const xl = await xAxis(S, P, { ticks: xt, what: 'the axis of counts' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: yt, fmt: (t) => (t === 0 ? '0' : t.toFixed(2)), what: 'the probability axis' })));
	const last = xl[xl.length - 1];
	L.push(await placed('n', P.right + LABEL_GAP + 1.2, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(await placed('P(n)', P.left + LABEL_GAP + 2, P.top, 0, 0.5, DIM));

	// ---- the mean, up the gap of n = 4
	const xm = P.X(NBAR);
	check(near(xm, (left(NBAR)[1] + right(NBAR)[0]) / 2, 1e-12), 'the mean\'s line is not in the middle of the gap');
	S.path([[xm, P.bottom], [xm, P.top + 6]], { color: DIM, width: MEAN_W, layer: 1.5, dash: DASH, cap: 'butt', what: 'the mean' });
	L.push(await placed('\\bar n = 4', xm, P.top + 6 - LABEL_GAP - 0.4, 0.5, 1, INK));

	// ---- the labels, each beside the bars it names
	{
		const [, b] = right(5), y = P.Y(poisson(NBAR, 5));
		L.push(await S.clear('\\text{coherent (Poisson)}', b + LABEL_GAP + 0.6, y, 0, 0.5, [1, 0]));
	}
	{
		const y = P.Y(geometric(NBAR, 9));
		L.push(await S.clear('\\text{thermal (geometric)}', P.X(9) - 0.2 * UNIT, y - LABEL_GAP - 3, 0, 1, [0, -1]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { poisson: Array.from({ length: NMAX + 1 }, (_, n) => poisson(NBAR, n)), geometric: Array.from({ length: NMAX + 1 }, (_, n) => geometric(NBAR, n)) };
	return finish(S, L, [280, 340]);
}
