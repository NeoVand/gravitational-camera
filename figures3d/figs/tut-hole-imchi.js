// The tutorial, section 11.4 (tutorial/black-holes/under-tides.md), its third diagram: the hole's response at every
// frequency. One panel on logarithmic axes: across, x = GM omega / c^3 from 10^-2 to 3; up, Im chi in units of
// M r_s^2 (GM/c^3)^2 from 10^-4 to 10^2. The response (5/64) Gamma_2 / x^5 from section 11.3's greybody table, thin
// solid ink, rising, peaking at x = 0.39 (an ink dot, "x = 0.39"), then falling; the friction law (4/45) x dashed; the
// asymptote (5/64)/x^5 dotted, meeting the curve at the right. Each line is named beside it.
// Departures from the diagram's comment: the axis up starts at 10^-4, not 10^-3, so that the friction law, 8.9 x 10^-4
// at x = 0.01, and the curve's left end stay in the panel, and ends at 10^2, not 10, so that the asymptote shows for a
// decade above the peak before it meets the curve; the laws are dashed and dotted in the page's dim grey, not in an
// accent colour (tut-friction-lib.js: the figures' orange and blue mean a stretch and a squeeze, and the interactive
// draws these laws neutral); the dot's label says "x = 0.39", so that it is not read as a height; the asymptote is
// drawn only where it lies in the panel, from x = 0.24, where it leaves the top, and is named at its upper end
// "Gamma_2 = 1", the curve's own formula with every wave absorbed, rather than "(5/64)/x^5", so that the lines are named
// in one notation, the chapter's, while the axes are in the reduced units.
// Exact: the curve, from the table (tut-friction-lib.js, asserted number for number against the interactive's data and
// read between its points as the interactive reads it), drawn on the table's x from 0.01 and, above 0.78, where the table
// holds Gamma_2 at 1, as (5/64)/x^5 itself; the two laws; the peak, at the table's x of greatest Im chi; the units
// (asserted in SI in tut-friction-lib.js).
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, X, imChi, law, tail, PEAK, TABLE_ONE } from './tut-friction-lib.js';

const name = 'tut-hole-imchi';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = -2, X1 = lg(3), Y0 = -4.3, Y1 = 2;
const DX = 98, DY = 27;                         // points per decade
const CURVE = 0.7, LAW = 0.55, DASH = [3, 2], DOT = 1.55;
const caption = 'Look first at the left, where the solid curve, $5c^5\\Gamma_2/16G\\omega^5$, meets the dashed friction law $\\nu\\omega$: that is the box\'s limit. To the right the law fails, because the waves are no longer long against the hole. Curves exact.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'hole-imchi', caption);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	const at = (x, y) => P.at(lg(x), lg(y));

	// ---- the axes
	const pow = (k) => (k === 0 ? '1' : k === 1 ? '10' : `10^{${k}}`);
	const xl = await xAxis(S, P, { ticks: [-2, -1, 0, lg(3)], fmt: (t) => (near(t, lg(3), 1e-12) ? '3' : ['0.01', '0.1', '1'][t + 2]), what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: [-4, -3, -2, -1, 0, 1, 2], fmt: pow, what: 'the axis up' })));
	const below = Math.max(...xl.map((l) => l.box.b));
	L.push(await placed('x = GM\\omega/c^3', P.X(-0.5), below + 4, 0.5, 0, DIM));
	L.push(await placed('\\mathrm{Im}\\,\\chi\\ \\ \\text{(units of }Mr_s^2(GM/c^3)^2\\text{)}', P.left - 4, P.top - 9, 0, 1, DIM));

	// ---- the friction law, dashed, across the panel; the asymptote, dotted, from where it enters at the top
	check(lg(law(10 ** X0)) > Y0 + 0.5 && lg(law(10 ** X1)) < Y1 - 1, 'the friction law leaves the panel');
	S.path([at(10 ** X0, law(10 ** X0)), at(10 ** X1, law(10 ** X1))], { color: DIM, width: LAW, dash: DASH, cap: 'butt', layer: 1.6, what: 'the friction law' });
	const xTop = (5 / 64 / 10 ** Y1) ** (1 / 5);
	check(near(tail(xTop), 10 ** Y1, 1e-12) && xTop > 0.23 && xTop < 0.24, `the asymptote enters at ${xTop}`);
	check(lg(tail(10 ** X1)) > Y0 + 0.4, 'the asymptote leaves the panel at the bottom');
	S.dots(at(xTop, tail(xTop)), at(10 ** X1, tail(10 ** X1)), { color: DIM, layer: 1.7, what: 'the asymptote' });

	// ---- the response: the table's points from 0.01 to 0.78, then (5/64)/x^5 to the panel's end
	const xs = [...X, ...Array.from({ length: 200 }, (_, k) => TABLE_ONE * (10 ** X1 / TABLE_ONE) ** ((k + 1) / 200))];
	check(near(xs[0], 10 ** X0, 1e-12), 'the curve does not start at the panel\'s edge');
	const pts = xs.map((x) => at(x, imChi(x)));
	check(pts.every(([, y]) => y >= P.top && y <= P.bottom), 'the curve leaves the panel');
	S.path(pts, { color: INK, width: CURVE, layer: 2, what: 'the response' });
	// at the left it lies on the law within the ratio 1.07, a fifth of a point at this scale
	check(Math.abs(P.Y(lg(imChi(0.01))) - P.Y(lg(law(0.01)))) < 0.85, 'the curve is not on the law at the left');

	// ---- the peak
	const pk = at(PEAK.x, PEAK.value);
	S.raw(`<circle cx="${n2(pk[0])}" cy="${n2(pk[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([pk], DOT, 'the peak');
	L.push(await S.clear(`x = ${PEAK.x.toFixed(2)}`, pk[0] - DOT - LABEL_GAP, pk[1] - 1.5, 1, 0.5, [-0.97, -0.24], { gap: LABEL_GAP + 1.4 }));

	// ---- the names: the curve's left of its rise, the law's above it at the right, the asymptote's right of its top
	{
		const y = 0.4, x = 0.2;
		check(imChi(x) < y, 'the curve\'s name is not left of its rise');
		L.push(await S.clear('5c^5\\Gamma_2/16G\\omega^5', P.X(lg(x)) - 6, P.Y(lg(y)), 1, 0.5, [-1, 0]));
	}
	{
		// above the law's right end, where the falling curve is far below it
		const q = at(1.9, law(1.9));
		check(imChi(1.2) < law(1.2) / 3, 'the curve is near the law\'s name');
		L.push(await S.clear('\\text{friction law, }\\nu\\omega', q[0], q[1] - 2.2, 0.5, 1, [0, -1]));
	}
	{
		// the asymptote's name at its upper end: the same curve with every wave absorbed, Gamma_2 = 1
		const q = at(0.27, tail(0.27));
		L.push(await S.clear('\\Gamma_2 = 1', q[0] + 3, q[1], 0, 0.5, [1, 0]));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { peak: PEAK, xTop, atLeft: imChi(0.01) / law(0.01) };
	return finish(S, L, [260, 340]);
}
