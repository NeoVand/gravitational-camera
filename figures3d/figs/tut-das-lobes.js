// The tutorial, section 5.3 (tutorial/waves/diffraction.md), its second diagram: gaps between pixels make copies of
// the image. One chart: across, sin theta from -1 to 1, ticks every 0.25, with the matching angles -90, -30, 0, 30 and
// 90 degrees on a second scale along the top; up, the beam pattern |A|^2/N^2 from 0 to 1. Two curves for a row of
// eight pixels steered straight ahead: pixels lambda/2 apart (solid, ink), its main lobe's first zeros at +-0.25 and
// its largest side lobes 0.0525 at +-0.36; and pixels 2 lambda apart (dashed, dim grey), its main lobe four times
// narrower, first zeros at +-0.0625, and its grating lobes of full height at sin theta = +-0.5 and +-1, each named by
// its order m. A dimension line over the peaks from 0 to 0.5, named lambda/b under it. A key names the two spacings.
// Departures from the diagram's comment: the comment put the lambda/b bracket "under the dashed curve"; there the
// bracket would cross both curves' lobes, so it stands over the peaks, where nothing else is drawn. A key names the
// two curves, which the comment left unnamed on the chart.
// Exact: both curves (the closed form, asserted in tut-das-lib.js against the direct sum of the phasors), their zeros,
// side lobes and grating lobes (asserted there and against the marks here), the top scale (asserted to be the sines of
// its angles) and the dimension. Every curve is sampled so that no two neighbouring points are more than a quarter of a
// point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, HAIR, TICK, AXIS as AXIS_STROKE } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, LABEL_GAP, NUM } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { DASH, INK, DIM } from './tut-bessel-lib.js';
import { chapter, pattern } from './tut-das-lib.js';

const name = 'tut-das-lobes';
const check = checker(name);

const PW = 286, PH = 112;                  // the chart, points
const BOTTOM = -0.025, TOP = 1.13;         // the chart's range up: the axis a little below zero, room over the peaks
const BAR_AT = 1.07;                       // the dimension line's height
const KEY = 11;                            // the key's sample lines, points
const OFF = 5;                             // the vertical axis stands this far left of sin theta = -1, clear of its peak

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: -1, x1: 1, y0: BOTTOM, y1: TOP });

	// ---- the two curves: the dashed one over the solid one
	const curves = [
		{ q: 0.5, color: INK, dash: null, layer: 2, what: 'the pattern for b = lambda/2' },
		{ q: 2, color: DIM, dash: DASH, layer: 2.1, what: 'the pattern for b = 2 lambda' }
	];
	for (const { q, color, dash, layer, what } of curves) {
		const pts = graph(P, (s) => pattern(s, q), -1, 1);
		check(longest(pts) <= 0.2501, `${what} is coarse`);
		check(pts.every(([, y]) => y <= P.Y(0) + 1e-9 && y >= P.Y(1) - 1e-9), `${what} leaves 0..1`);
		S.path(pts, { color, width: CURVE, layer, dash, cap: 'butt', what });
	}
	// the marks agree with the chapter: zeros, the side lobe, the grating lobes
	check(near(pattern(0.25, 0.5), 0, 1e-15) && near(pattern(0.0625, 2), 0, 1e-15), 'the first zeros');
	check(near(pattern(n.side.x, 0.5), 0.0525, 5e-5), 'the side lobe');

	// ---- the axes: sin theta below, theta above, the pattern at the left
	const fmt = (t) => (t === 0 ? '0' : (t < 0 ? '-' : '') + String(Math.abs(t)).replace(/^0\./, '0.'));
	const xl = await xAxis(S, P, { ticks: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1], fmt, from: -1 - (OFF / PW) * 2, what: 'the sin theta axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('\\sin\\theta', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	{
		S.path([[P.left - OFF, P.top], [P.right, P.top]], { color: DIM, width: AXIS_STROKE, layer: 1, cap: 'butt', what: 'the theta axis' });
		const top = [];
		for (const d of [-90, -30, 0, 30, 90]) {
			const s = Math.sin((d * Math.PI) / 180);
			check(near(s, { '-90': -1, '-30': -0.5, 0: 0, 30: 0.5, 90: 1 }[d], 1e-15), `the top scale at ${d}`);
			const px = P.X(s);
			S.path([[px, P.top], [px, P.top - TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `the theta tick at ${d}` });
			top.push(await placed(`${d < 0 ? '-' : ''}${Math.abs(d)}^\\circ`, px, P.top - TICK - NUM, 0.5, 1, DIM));
		}
		L.push(...top);
		const end = top[top.length - 1];
		L.push(await placed('\\theta', end.box.r + 5, (end.box.t + end.box.b) / 2, 0, 0.5, DIM));
	}
	const yl = await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '0.5' : String(t)), from: BOTTOM, to: 1, x: P.left - OFF, what: 'the pattern axis' });
	L.push(...yl);
	{
		const highest = Math.min(...L.map((l) => l.box.t));
		L.push(await placed('|\\mathcal A|^2/N^2', P.left - OFF - 20, highest - 3, 0, 1, DIM));
	}

	// ---- the orders of the grating lobes, beside each peak at the same height, on its side toward the middle
	const H = 0.86;
	for (const m of [-2, -1, 1, 2]) {
		const c = m / 2;
		const out = -Math.sign(m);
		let s = c;
		while (pattern(s, 2) > H) s += out * 1e-5;
		const src = `m = ${m < 0 ? '-' : ''}${Math.abs(m)}`;
		const x = P.X(s) + out * (LABEL_GAP + 0.9);
		L.push(await S.clear(src, x, P.Y(H), out > 0 ? 0 : 1, 0.5, [out, 0], { color: DIM }));
	}

	// ---- lambda/b, over the peaks at 0 and 0.5
	{
		const y = P.Y(BAR_AT);
		dimension(S, P.X(0), P.X(0.5), y, { color: DIM, width: HAIR + 0.15, what: 'lambda/b' });
		check(y + 2.2 < P.Y(1) - 2.5, 'the dimension touches the peaks');
		L.push(await S.clear('\\lambda/b', P.X(0.25), y + 2.2 + LABEL_GAP + 0.4, 0.5, 0, [0, 1], { color: DIM }));
	}

	// ---- the key: a sample of each line and its spacing, at the right between the m = 1 and m = 2 lobes
	{
		const x0 = P.X(0.6), rows = [[0.42, 0.5, INK, null], [0.27, 2, DIM, DASH]];
		for (const [v, q, color, dash] of rows) {
			const y = P.Y(v);
			S.path([[x0, y], [x0 + KEY, y]], { color, width: CURVE, layer: 2, dash, cap: 'butt', what: `the key's line for ${q}` });
			L.push(await placed(q === 0.5 ? 'b = \\lambda/2' : 'b = 2\\lambda', x0 + KEY + LABEL_GAP + 1, y, 0, 0.5, color));
		}
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...n };
	return finish(S, L, [240, 340]);
}
