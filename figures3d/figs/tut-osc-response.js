// The tutorial, section 4.1 (tutorial/response/oscillator.md), its third diagram: the response function of an
// oscillator in three panels that share the axis omega / omega0 from 0 to 2, each with three curves for Q = 3, 10
// and 30, in the swing's colour (the chapter's live figure, driven-cart), one weight for each Q. Top: k |chi| on a
// logarithmic scale from 0.1 to 40, which starts at 1, peaks just below omega0 at 3.04 (0.972), 10.01 (0.9975) and
// 30.00 (0.9997), and falls toward the free mass's (omega0 / omega)^2, dashed. Middle: the lag phi = arg chi, from
// 0 to 180 degrees, 90 degrees at omega0 for every Q. Bottom: omega Im chi in units of 1 / m Gamma, the line, which
// peaks at 1 exactly at omega0 for every Q; a dotted line at 1/2, a dot where each curve crosses it, at the half-power
// points sqrt(1 + 1/4Q^2) -+ 1/2Q (for Q = 10, 0.9512 and 1.0512), and under the axis a dimension line for each Q
// between its two half-power points, 1/Q long (0.333, 0.1, 0.033). A dotted line at omega / omega0 = 1 through the
// three panels.
// Exact: every curve, k chi = 1 / (1 - x^2 - i x / Q) (eq:chi with x = omega / omega0), the peaks and the
// half-power points, asserted in tut-osc-lib.js, `cart`, and against the curves here. Each curve is sampled so that
// no two neighbouring points are more than a quarter of a point apart, and is stopped where it would merge with a
// horizontal axis (figs/tut-prob-lib.js, `merge`). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, dimension, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { DIM, FAINT, ACCENT, ACCENT2, ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { cart, kChi, modulus, argument, deg, line, halfPower } from './tut-osc-lib.js';

const name = 'tut-osc-response';
const check = checker(name);

const QS = [3, 10, 30];
const WEIGHT = { 3: 0.45, 10: 0.65, 30: 0.9 };   // one hue, three weights
const PW = 270;                                  // omega / omega0 from 0 to 2
const XMAX = 2;
const LOG = [-1, Math.log10(40)];                // the top panel: log10 of k |chi|
const DECADE = 34;                               // points per decade
const PHASE_H = 56;                              // the middle panel: 0 to 180 degrees
const LINE_H = 66, LINE_TOP = 1.1;               // the bottom panel: 0 to 1.1
const GAP = 12;                                  // between panels
const ENV_DASH = [1.8, 1.4], ENV = 0.45;         // the free mass's asymptote, as section 3.6's envelope
const DOT_R = 1.05;
const FIRST = 9, ROW = 10.5;                     // the widths' rows under the axis (figs/tut-measure-peak.js)
const AIR = 1.4;                                 // a curve stops where less than this, points, would part it from an axis

export default async function () {
	const n = cart(check);
	const S = new Sheet(name);
	const L = [];
	const left = ORIGIN - PW / 2;
	const H1 = (LOG[1] - LOG[0]) * DECADE;
	const top0 = ORIGIN - (H1 + PHASE_H + LINE_H + 2 * GAP) / 2;
	const P1 = new Plot({ left, top: top0, w: PW, h: H1, x0: 0, x1: XMAX, y0: LOG[0], y1: LOG[1] });
	const P2 = new Plot({ left, top: P1.bottom + GAP, w: PW, h: PHASE_H, x0: 0, x1: XMAX, y0: 0, y1: 180 });
	const P3 = new Plot({ left, top: P2.bottom + GAP, w: PW, h: LINE_H, x0: 0, x1: XMAX, y0: 0, y1: LINE_TOP });

	// ---- the line at omega0, dotted, through the three panels, under everything
	S.path([[P1.X(1), P1.top], [P3.X(1), P3.bottom]], { color: DIM, width: ZERO_LINE, layer: 0.5, cap: 'butt', dash: ZERO_DASH, what: 'the line at omega0' });

	// ---- top: k |chi|, log scale; the free mass's (omega0 / omega)^2 dashed where the curves approach it
	const asym = graph(P1, (x) => Math.log10(1 / (x * x)), 1.25, XMAX);
	check(longest(asym) <= 0.2501, 'the asymptote is coarse');
	S.path(asym, { color: FAINT, width: ENV, layer: 1.5, dash: ENV_DASH, cap: 'butt', what: 'the free mass' });
	const tops = {};
	for (const Q of QS) {
		const f = (x) => Math.log10(modulus(kChi(x, Q)));
		const pts = graph(P1, f, 0, XMAX);
		check(longest(pts) <= 0.2501, `k|chi| for Q = ${Q} is coarse`);
		check(pts.every(([, y]) => y >= P1.top + 2 && y <= P1.bottom - 3), `k|chi| for Q = ${Q} leaves its panel`);
		S.path(pts, { color: ACCENT, width: WEIGHT[Q], layer: 2, what: `k|chi|, Q = ${Q}` });
		const p = n.peaks.find((x) => x.Q === Q);
		check(near(f(p.x), Math.log10(p.y), 1e-12), `the peak of Q = ${Q} is not on its curve`);
		tops[Q] = P1.at(p.x, Math.log10(p.y));
	}
	// k |chi| = 1 for a slow push; above omega0 the free mass's 1/x^2 is approached from above
	for (const Q of QS) check(near(modulus(kChi(0, Q)), 1, 1e-15) && modulus(kChi(2, Q)) > 0.25, 'the ends of k|chi|');

	// ---- middle: the lag, 0 to 180 degrees, stopped where it would merge with the axis at 0
	for (const Q of QS) {
		const f = (x) => deg(argument(kChi(x, Q)));
		check(near(f(1), 90, 1e-12) && f(XMAX) < 180 && f(1e-6) > 0, `the lag of Q = ${Q}`);
		// from where the lag first stands clear of the axis by AIR
		const clear2 = merge(P2, WEIGHT[Q]) + (AIR / P2.h) * 180;
		let a = 0;
		while (f(a) < clear2) a += 1e-4;
		const pts = graph(P2, f, a, XMAX);
		check(longest(pts) <= 0.2501, `the lag for Q = ${Q} is coarse`);
		S.path(pts, { color: ACCENT, width: WEIGHT[Q], layer: 2, what: `the lag, Q = ${Q}` });
	}

	// ---- bottom: the line, omega Im chi m Gamma; the level 1/2, dotted; a dot at each half-power point
	S.dots([P3.X(0), P3.Y(0.5)], [P3.X(XMAX), P3.Y(0.5)], { color: DIM, clear0: 1.2, layer: 1, what: 'the level 1/2' });
	const dots = [];
	for (const Q of QS) {
		const f = (x) => line(x, Q);
		check(near(f(1), 1, 1e-15), `the line of Q = ${Q} is not 1 at omega0`);
		// m Gamma omega Im chi from the response itself: Im(k chi) x / Q, since k = m omega0^2 and Gamma = omega0 / Q
		for (const x of [0.3, 0.97, 1.4]) check(near((kChi(x, Q)[1] * x) / Q, f(x), 1e-12), `the line of Q = ${Q} is not omega Im chi`);
		// the stretch where it stands clear of the axis by AIR: one, around omega0
		const clear3 = merge(P3, WEIGHT[Q]) + (AIR / P3.h) * LINE_TOP;
		let a = 1, b = 1;
		while (a > 0 && f(a) > clear3) a -= 1e-4;
		while (b < XMAX && f(b) > clear3) b += 1e-4;
		const pts = graph(P3, f, Math.max(0, a), Math.min(XMAX, b));
		check(longest(pts) <= 0.2501, `the line of Q = ${Q} is coarse`);
		S.path(pts, { color: ACCENT, width: WEIGHT[Q], layer: 2, what: `the line, Q = ${Q}` });
		const [lo, hi] = halfPower(Q);
		check(near(hi - lo, 1 / Q, 1e-15) && near(f(lo), 0.5, 1e-12) && near(f(hi), 0.5, 1e-12), `the half-power points of Q = ${Q}`);
		for (const x of [lo, hi]) {
			const [px, py] = P3.at(x, 0.5);
			S.raw(`<circle cx="${n2(px)}" cy="${n2(py)}" r="${DOT_R}" fill="${ACCENT2}"/>`, 3);
			S.mark([[px, py]], DOT_R, `the half-power point ${x}`);
		}
		dots.push({ Q, lo, hi });
	}

	// ---- the axes: an x axis under each panel, its numbers under the last; the y axes and their names
	const fmtX = (t) => (t === 0 ? '0' : Number.isInteger(t) ? `${t}` : t.toFixed(1));
	await xAxis(S, P1, { ticks: [0, 0.5, 1, 1.5, 2], fmt: () => null, what: 'the top axis' });
	await xAxis(S, P2, { ticks: [0, 0.5, 1, 1.5, 2], fmt: () => null, what: 'the middle axis' });
	const xl = await xAxis(S, P3, { ticks: [0, 0.5, 1, 1.5, 2], fmt: fmtX, what: 'the bottom axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await placed('\\omega/\\omega_0', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, DIM));
	L.push(...(await yAxis(S, P1, { ticks: [-1, 0, 1], fmt: (t) => ({ '-1': '0.1', 0: '1', 1: '10' })[t], what: 'the k|chi| axis' })));
	L.push(...(await yAxis(S, P2, { ticks: [0, 90, 180], fmt: (t) => `${t}^\\circ`, what: 'the lag axis' })));
	L.push(...(await yAxis(S, P3, { ticks: [0, 0.5, 1], fmt: (t) => (t === 0.5 ? '\\tfrac12' : `${t}`), what: 'the line axis' })));
	L.push(await S.clear('k|\\chi|', P1.left + 4.5, P1.top, 0, 1, [0, -1], { color: DIM }));
	L.push(await S.clear('\\varphi', P2.left + 4.5, P2.top + 1, 0, 0, [1, 0], { color: DIM }));
	L.push(await S.clear('m\\Gamma\\omega\\,\\mathrm{Im}\\,\\chi', P3.left + 4.5, P3.top, 0, 0, [1, 0], { color: DIM }));

	// ---- the curves' names, beside their peaks; the asymptote's
	L.push(await S.clear('Q = 30', tops[30][0] + LABEL_GAP + 0.5, tops[30][1], 0, 0.5, [1, 0], { color: ACCENT }));
	L.push(await S.clear('Q = 10', tops[10][0] + LABEL_GAP + 0.5, tops[10][1], 0, 0.5, [1, 0], { color: ACCENT }));
	// Q = 3, the lowest curve near omega0, under its rising flank
	const x3 = 0.8, lowest3 = Math.min(...[0.7, 0.8, 0.9].map((x) => Math.log10(modulus(kChi(x, 3)))));
	L.push(await S.clear('Q = 3', P1.X(x3), P1.Y(lowest3) + LABEL_GAP, 0.5, 0, [0, 1], { color: ACCENT }));
	L.push(await S.clear('(\\omega_0/\\omega)^2', P1.X(1.75), P1.Y(Math.log10(1 / 1.75 ** 2)) + LABEL_GAP, 0.5, 0, [0, 1], { color: DIM }));

	// ---- the widths, one row each under the axis, from half-power point to half-power point
	const base = Math.max(...xl.map((l) => l.box.b));
	for (const [k, { Q, lo, hi }] of [...dots].reverse().entries()) {
		const y = base + FIRST + k * ROW;
		dimension(S, P3.X(lo), P3.X(hi), y, { color: ACCENT2, what: `the width for Q = ${Q}` });
		L.push(await placed(`Q = ${Q}`, P3.X(hi) + LABEL_GAP + 2.4, y, 0, 0.5, ACCENT2));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { peaks: n.peaks, half: dots };
	return finish(S, L, [240, 340]);
}
