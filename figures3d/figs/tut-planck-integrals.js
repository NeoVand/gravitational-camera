// The tutorial, chapter 10.1 (tutorial/glow/black-body.md), its third diagram: the three Bose integrals. One panel:
// across, x = hbar omega / k_B T from 0 to 12; up, from 0 to 1.5. The three curves x^n / (e^x - 1) for n = 1, 2, 3 in
// ink of three weights (thin, medium, thick), each over its area shaded very faintly in ink. The two peaks marked by a
// dot, with a dotted line down to the axis and its x under the axis, 1.594 (n = 2) and 2.821 (n = 3), and its height
// beside the dot, 0.648 and 1.421; the curve n = 1 starts at 1 and only falls, with no dot. Ink and the page's greys
// only: no orange or blue.
// Departures from the diagram's comment: the areas are named in a key at the upper right, "n = 1, area pi^2/6 =
// 1.645" and so on, beside a sample of each curve's weight, rather than at the curves' right ends, since at x = 12
// the three curves lie within a point of the axis and of one another (their values there are 7 x 10^-5, 9 x 10^-4
// and 0.011); the key also names n, which the curves need. The axis across is ticked and numbered at 0, 4, 8 and 12
// only, so that the peaks' positions can stand under it at their own places; the axis up is named x^n/(e^x - 1). Every
// curve and its shaded area run the whole axis, from x = 0 to 12, the tails lying just above the axis.
// Exact: every curve, the peaks (the roots of x = n (1 - e^{-x}), asserted maxima), their heights and the areas
// (Simpson's rule against n! zeta(n + 1), in tut-planck-lib.js). Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, NUM } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, near, bose, ENERGY, COUNT } from './tut-planck-lib.js';

const name = 'tut-planck-integrals';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X0 = 0, X1 = 12, Y0 = 0, Y1 = 1.5;
const DX = 20.5, DY = 96;                       // points per unit across and up
const WEIGHT = { 1: 0.4, 2: 0.8, 3: 1.3 };    // the three curves' strokes: thin, medium, thick
const FILL = 0.055;                             // each area's opacity of ink
const DOT = 1.55;                               // a peak's dot
const DROP = [0, 1.6];                          // the dotted line from a peak to the axis
const KEY_LINE = 15, PITCH = 12.5;              // the key's samples and baseline to baseline
const KEY_AT = [5.15, 1.43];                    // the key's first row: its sample's left end and its height, in units

const AREA_TEX = { 1: '\\pi^2/6 = 1.645', 2: '2\\zeta(3) = 2.404', 3: '\\pi^4/15 = 6.494' };

export default async function () {
	const { state, AREA } = await chapter(check);
	await palette(check);
	state(name, 'planck-integrals', 'Look first at the peaks: counting quanta ($n = 2$) peaks at $x = 1.59$, energy ($n = 3$) at 2.82, and the $n = 1$ curve falls from the start. The areas are the Bose integrals $n!\\,\\zeta(n + 1)$. All curves are exact.');
	for (const n of [1, 2, 3]) check(AREA_TEX[n].endsWith(AREA[n].toFixed(3)), `the key's area for n = ${n}`);

	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = (Y1 - Y0) * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });
	check(bose(3, ENERGY) < Y1 && bose(1, 0) < Y1, 'a curve leaves the panel');

	// ---- the areas, very faint, under all the lines
	for (const n of [1, 2, 3]) {
		const pts = graph(P, (x) => bose(n, x), X0, X1, 0.6);
		const d = 'M' + [P.at(X0, 0), ...pts, P.at(X1, 0)].map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
		S.raw(`<path d="${d}" fill="${INK}" fill-opacity="${FILL}" stroke="none"/>`, 0.5);
	}

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [0, 4, 8, 12], fmt: String, what: 'the axis across' });
	const yl = await yAxis(S, P, { ticks: [0, 0.5, 1, 1.5], fmt: (t) => (t === 0 ? null : String(t)), what: 'the axis up' });
	L.push(...yl);
	// the name of the axis up, over its top number
	L.push(await placed('x^n/(e^x - 1)', Math.min(...yl.map((l) => l.box.l)), Math.min(...yl.map((l) => l.box.t)) - 4.5, 0, 1, DIM));

	// ---- the curves, each across the whole axis, from x = 0 to 12
	const ends = {};
	for (const n of [1, 2, 3]) {
		const pts = graph(P, (x) => bose(n, x), X0, X1, 0.2);
		check(longest(pts) <= 0.2001, `the curve n = ${n} has a step of ${longest(pts)} pt`);
		check(near(pts[0][0], P.X(X0), 1e-9) && near(pts[pts.length - 1][0], P.X(X1), 1e-9), `the curve n = ${n} does not span the axis`);
		check(pts.every(([, y]) => y <= P.bottom + 1e-9), `the curve n = ${n} dips under the axis`);
		S.path(pts, { color: INK, width: WEIGHT[n], layer: 2 + n / 10, cap: 'butt', what: `the curve n = ${n}` });
		ends[n] = X1;
	}

	// ---- the peaks: a dot, a dotted line to the axis, x under the axis and the height beside the dot
	const below = [];
	for (const [n, x] of [[2, COUNT], [3, ENERGY]]) {
		const q = P.at(x, bose(n, x));
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${DOT}" fill="${INK}"/>`, 3);
		S.mark([q], DOT, `the peak n = ${n}`);
		S.raw(`<path d="M${n2(q[0])},${n2(q[1] + DOT + 1.2)}V${n2(P.bottom)}" stroke="${DIM}" stroke-width="0.55" stroke-dasharray="${DROP.join(' ')}" stroke-linecap="round" fill="none"/>`, 1.2);
		S.mark([[q[0], q[1] + DOT + 1.2], [q[0], P.bottom]], 0.3, `the drop from the peak n = ${n}`);
		S.path([[q[0], P.bottom], [q[0], P.bottom + TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the tick at the peak n = ${n}` });
		const lab = await placed(x.toFixed(3), q[0], P.bottom + TICK + NUM, 0.5, 0, INK);
		below.push(lab);
		L.push(lab);
		// the height: above the dot for n = 3 (the panel's top is free), above and to the right for n = 2
		const h = bose(n, x).toFixed(3);
		if (n === 3) L.push(await placed(h, q[0], q[1] - DOT - LABEL_GAP - 0.4, 0.5, 1, INK));
		else L.push(await S.clear(h, q[0] + DOT + LABEL_GAP, q[1] - DOT - LABEL_GAP, 0, 1, [0, -1]));
	}
	// the numbers under the axis keep clear of one another and of the axis's own numbers
	const all = [...xl, ...below].sort((a, b) => a.box.l - b.box.l);
	for (let i = 1; i < all.length; i++) check(all[i].box.l - all[i - 1].box.r >= 3, `the numbers ${all[i - 1].src} and ${all[i].src} under the axis are ${n2(all[i].box.l - all[i - 1].box.r)} pt apart`);
	L.push(...xl);
	const base = Math.max(...all.map((l) => l.box.b));
	L.push(await placed('x = \\hbar\\omega/k_BT', P.X((X0 + X1) / 2), base + 4, 0.5, 0, DIM));

	// ---- the key
	{
		const x = P.X(KEY_AT[0]);
		let y = P.Y(KEY_AT[1]);
		for (const n of [3, 2, 1]) {
			S.path([[x, y], [x + KEY_LINE, y]], { color: INK, width: WEIGHT[n], layer: 2, cap: 'butt', what: `the key's line n = ${n}` });
			L.push(await placed(`n = ${n}\\text{, area } ${AREA_TEX[n]}`, x + KEY_LINE + LABEL_GAP + 1, y, 0, 0.5, INK));
			y += PITCH;
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { peaks: [COUNT, ENERGY], heights: [bose(2, COUNT), bose(3, ENERGY)], areas: AREA, ends };
	return finish(S, L, [255, 300]);
}
