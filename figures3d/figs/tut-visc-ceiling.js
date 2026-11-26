// The tutorial, section 4.4 (tutorial/response/viscosity.md), its fourth diagram: the ceiling of a metal's friction.
// Re eta = mu tau / (1 + omega^2 tau^2) against the collision time tau on a logarithmic axis from 10^-16 to 10^-12 s,
// at the glow's peak at 293 K, omega = 1.082 x 10^14 s^-1, for copper's free electrons, mu = 2 n E_F / 5 with
// n = 8.47 x 10^28 m^-3 and E_F = 7.03 eV (38.15 GPa; the diagram's comment printed 38.1), on a linear axis from 0
// to 2 x 10^-4 Pa s; one curve in the second accent, copper's colour in the paper's fig:materials (it ends 2 pt above
// the axis at both ends of the chart, so nothing of it merges with the axis). Its peak, mu/2omega = 1.76 x 10^-4 Pa s at tau = 1/omega = 9.24 x 10^-15 s, marked by a
// dotted line across the chart, named at its right end, and a short upright tick across the curve with "omega tau =
// 1" above it; copper's own tau = 2.5 x 10^-14 s marked by a dot on the curve at 1.15 x 10^-4 Pa s (omega tau = 2.71,
// 65% of the ceiling).
// Exact: the curve, the ceiling, the peak's place and copper's dot (asserted in tut-visc-lib.js, `chapter`, and against
// the marks here; the curve is asserted to stay under the ceiling and to be symmetric about the peak on the log
// axis). The curve is sampled so that no two neighbouring points are more than a quarter of a point apart. Nothing is
// schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, merge, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, ACCENT2, DOT as POINT } from './tut-bessel-lib.js';
import { chapter, byTau, CU_MU, CU_TAU, W_PEAK } from './tut-visc-lib.js';

const name = 'tut-visc-ceiling';
const check = checker(name);

const X = [-16, -12];                      // log10 tau (s)
const Y = [0, 2];                          // Re eta, 10^-4 Pa s
const PW = 228, PH = 118;
const MARK = 2.6;                          // half the length of the tick across the peak (figs/tut-osc-ringdown.js)
const AIR = 1.4;                           // the curve stops where less than this, points, would part it from the axis
const lg = Math.log10;

export default async function () {
	const n = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X[0], x1: X[1], y0: Y[0], y1: Y[1] });
	const f = (x) => byTau(10 ** x, W_PEAK, CU_MU) / 1e-4;
	const top = n.ceiling / 1e-4, xTop = lg(1 / W_PEAK);
	check(near(f(xTop), top, 1e-12) && top.toFixed(2) === '1.76' && top < Y[1], 'the ceiling');

	// ---- the ceiling, dotted, across the chart, under the curve
	S.dots([P.left, P.Y(top)], [P.right, P.Y(top)], { color: DIM, clear0: 1.2, layer: 1, what: 'the ceiling' });
	L.push(await placed('\\mu_\\infty/2\\omega', P.right + LABEL_GAP + 0.6, P.Y(top), 0, 0.5, DIM));

	// ---- the curve, where it stands clear of the axis
	const clear = merge(P, CURVE) + (AIR / P.h) * (Y[1] - Y[0]);
	let a = X[0], b = X[1];
	while (f(a) < clear) a += 1e-4;
	while (f(b) < clear) b -= 1e-4;
	check(b - a > 3.9, `the curve stops at ${a} and ${b}`);
	const pts = graph(P, f, a, b);
	check(longest(pts) <= 0.2501, 'the curve is coarse');
	S.path(pts, { color: ACCENT2, width: CURVE, layer: 2, what: 'the curve' });

	// ---- the peak: a tick across the curve, its words above
	const [px, py] = P.at(xTop, top);
	S.path([[px, py - MARK], [px, py + MARK]], { color: DIM, width: HAIR, layer: 3, cap: 'butt', what: 'the tick at the peak' });
	L.push(await S.clear('\\omega\\tau = 1', px, py - MARK - LABEL_GAP - 0.3, 0.5, 1, [0, -1], { color: DIM }));

	// ---- copper
	const xc = lg(CU_TAU), yc = f(xc);
	check(near(yc, n.cu / 1e-4, 1e-12) && (yc / top * 100).toFixed(0) === '65', 'copper\'s dot');
	const [cx, cy] = P.at(xc, yc);
	S.raw(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${POINT}" fill="${INK}"/>`, 3);
	S.mark([[cx, cy]], POINT, 'copper');
	L.push(await S.clear('\\text{copper}', cx + LABEL_GAP + 2, cy, 0, 0.5, [1, 0], { color: INK }));

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [-16, -15, -14, -13, -12], fmt: (t) => `10^{${t}}`, what: 'the tau axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await S.clear('\\tau\\ (\\mathrm{s})', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2], fmt: (t) => (t === 0 ? null : String(t)), what: 'the eta axis' })));   // the zero is the tau axis itself; its number would touch 10^-16
	L.push(await S.clear('\\mathrm{Re}\\,\\eta\\ (10^{-4}\\,\\mathrm{Pa\\,s})', P.left + 4.5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));

	S.checkAll(L);
	window[name + '-numbers'] = { ...n, a, b };
	return finish(S, L, [240, 340]);
}
