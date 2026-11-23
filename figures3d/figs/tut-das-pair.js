// The tutorial, chapter 5.3 (tutorial/waves/diffraction.md), its fourth diagram: sources in step blur more than
// sources out of step. One chart: across, the angle across the image in units of lambda/D, from -2.5 to 2.5; up, the
// image divided by its largest value, from 0 to 1. Two equal sources at +-0.6, 1.2 lambda/D apart, seen by a row
// aperture, whose amplitude pattern is sin x / x with x = pi D theta / lambda (chapter 3.6's slit). Thin grey: the
// image of each source alone, sinc^2; solid ink: the pair out of step, sinc^2(theta - 0.6) + sinc^2(theta + 0.6), whose
// middle dips to 0.50 of its peaks, marked by a short level tick named "dip"; dashed ink: the pair in step,
// (sinc(theta - 0.6) + sinc(theta + 0.6))^2, one peak in the middle. Two small triangles under the axis at +-0.6, named
// "sources" between them.
// Departures from the diagram's comment: each single image is divided by the same number as the pair out of step, the
// largest value of their sum, so that the solid curve is exactly the sum of the two grey ones (their peaks stand at
// 0.974); the comment left their scale open. The axis's tick and number at 0 give their place to the name "sources",
// which sits between the two markers.
// Exact: every curve (asserted against the sums they are), the dip and its tick, the markers' places. Every curve is
// sampled so that no two neighbouring points are more than a quarter of a point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE, THIN } from './tut-fourier-lib.js';
import { DASH, INK, DIM, FAINT } from './tut-bessel-lib.js';
import { chapter, amp, incoherent, coherent, HALF_SEP } from './tut-das-lib.js';

const name = 'tut-das-pair';
const check = checker(name);

const PW = 280, PH = 118;                 // the chart, points
const X = 2.5;                            // the angle runs from -X to X, units of lambda/D
const BOTTOM = -0.025, TOP = 1.13;        // the chart's range up: the axis a little below zero, room over the peaks
const DIP = 7;                            // the dip's tick, points long
const TRI = 3.0;                          // a marker: an upright triangle this tall, its apex on the axis
const TRI_GAP = 0.9;                      // under the axis's stroke by this much

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: -X, x1: X, y0: BOTTOM, y1: TOP });
	const inc = n.peakInc.y, coh = n.peakCoh.y;
	const single = (c) => (t) => amp(t, c) ** 2 / inc;
	const solid = (t) => incoherent(t) / inc, dashed = (t) => coherent(t) / coh;
	for (let t = -X; t <= X; t += 1e-3) {
		check(near(solid(t), single(HALF_SEP)(t) + single(-HALF_SEP)(t), 1e-14), `the solid curve is not the sum of the grey ones at ${t}`);
		check(solid(t) <= 1 + 1e-12 && dashed(t) <= 1 + 1e-12, `a curve exceeds its peak at ${t}`);
	}
	check(single(HALF_SEP)(HALF_SEP).toFixed(3) === '0.974', 'the single images\' peaks');

	// ---- the curves: the single images thin and grey under the two pairs
	const curves = [
		{ f: single(-HALF_SEP), color: FAINT, width: THIN, dash: null, layer: 1.5, what: 'the left source alone' },
		{ f: single(HALF_SEP), color: FAINT, width: THIN, dash: null, layer: 1.5, what: 'the right source alone' },
		{ f: solid, color: INK, width: CURVE, dash: null, layer: 2, what: 'the pair out of step' },
		{ f: dashed, color: INK, width: CURVE, dash: DASH, layer: 2.1, what: 'the pair in step' }
	];
	for (const { f, color, width, dash, layer, what } of curves) {
		const pts = graph(P, f, -X, X);
		check(longest(pts) <= 0.2501, `${what} is coarse`);
		S.path(pts, { color, width, layer, dash, cap: 'butt', what });
	}

	// ---- the dip: a short level tick across the middle of the solid curve, at its value there
	const dip = solid(0);
	check(near(dip, n.dip, 1e-15) && dip.toFixed(2) === '0.50', `the dip ${dip}`);
	const [dx, dy] = P.at(0, dip);
	S.path([[dx - DIP / 2, dy], [dx + DIP / 2, dy]], { color: DIM, width: HAIR + 0.15, layer: 3, cap: 'butt', what: 'the dip' });
	L.push(await S.clear('\\text{dip}', dx + DIP / 2 + LABEL_GAP + 0.6, dy + 0.3, 0, 0.5, [1, 0], { color: DIM }));

	// ---- the axes; the number 0 makes way for the sources' name
	const fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	const xl = await xAxis(S, P, { ticks: [-2, -1, 1, 2], fmt, what: 'the angle axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('\\theta/(\\lambda/D)', P.right + 4, last.box.t, 0, 0, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 0.5, 1], fmt: String, from: BOTTOM, to: 1, what: 'the image axis' })));

	// ---- the sources: upright triangles under the axis at +-0.6, named between them
	for (const c of [-HALF_SEP, HALF_SEP]) {
		const x = P.X(c), y = P.bottom + 0.45 / 2 + TRI_GAP;
		const pts = [[x, y], [x + 0.6 * TRI, y + TRI], [x - 0.6 * TRI, y + TRI]];
		S.raw(`<path d="M${pts.map(([a, b]) => `${n2(a)},${n2(b)}`).join('L')}Z" fill="${INK}"/>`, 3);
		S.mark([...pts, pts[0]], 0, `the source at ${c}`);
	}
	check(near(P.X(HALF_SEP) - P.X(-HALF_SEP), (1.2 * PW) / (2 * X), 1e-9), 'the sources are not 1.2 lambda/D apart');
	L.push(await placed('\\text{sources}', P.X(0), xl[0].box.t, 0.5, 0, INK));

	// ---- the names of the curves
	// the pair in step over its own peak, the pair out of step beside its right-hand peak
	L.push(await S.clear('\\text{in step}', P.X(0), P.Y(1) - LABEL_GAP - 0.6, 0.5, 1, [0, -1], { color: INK }));
	L.push(await S.clear('\\text{out of step}', P.X(0.62), P.Y(0.93), 0, 0.5, [1, 0], { color: INK }));
	L.push(await S.clear('\\text{one alone}', P.X(-1.05), P.Y(0.62), 1, 0.5, [-1, 0], { color: FAINT }));

	S.checkAll(L);
	window[name + '-numbers'] = { dip, peakInc: n.peakInc, peakCoh: n.peakCoh };
	return finish(S, L, [240, 340]);
}
