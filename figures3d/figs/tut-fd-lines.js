// The tutorial, section 4.6 (tutorial/response/fluctuation-dissipation.md), its second diagram: the trembling of a warm
// cart and its friction over the frequency are one curve. One chart: omega / omega_0 from 0 to 2.5 (linear), and the
// spectrum S_q in units of 2 k_B T / k omega_0 from 10^-3 to 40 (logarithmic). For Q = 3 (thin) and Q = 30 (thicker),
// the exact S_q = 2 k_B T m Gamma |chi|^2 with Gamma = omega_0 / Q, (1/Q) / ((1 - x^2)^2 + x^2/Q^2) in these units,
// solid; on each, dots at x = 0.05, 0.10, ..., 2.50 giving 2 k_B T Im chi / omega, computed from the complex chi, which
// lie on it. "Q = 3" and "Q = 30" beside the peaks; a legend, a stroke "S_q" and a dot "2 k_B T Im chi / omega".
// Neutral ink. Exact: both curves and all 100 dots (the dots asserted equal to the curve to a part in 10^12 at every
// dot and on a grid of 2500 points between them, the peak Q at omega_0, the area under each line pi/2 in these units,
// so that int S_q d omega / 2 pi = k_B T / k for both, figs/tut-fd-lib.js, `chapter`). Every curve is sampled so that
// no two neighbouring points are more than a quarter of a point apart. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis, LABEL_GAP } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, spectrum, dissipation, QS, DOTS } from './tut-fd-lib.js';

const name = 'tut-fd-lines';
const check = checker(name);

const X = [0, 2.5], Y = [-3, Math.log10(40)];   // x = omega / omega_0; log10 of S_q in units of 2 k_B T / k omega_0
const UNIT = 104;                          // points per unit of x
const DECADE = 33;                         // points per power of ten
const WIDTH = { 3: 0.45, 30: 0.85 };       // Q = 3 thin, Q = 30 thicker
const DOT = 1.05;                          // a dot's radius
const lg = Math.log10;

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];
	const PW = (X[1] - X[0]) * UNIT, PH = (Y[1] - Y[0]) * DECADE;
	const P = new Plot({ left: ORIGIN - PW / 2, top: ORIGIN - PH / 2, w: PW, h: PH, x0: X[0], x1: X[1], y0: Y[0], y1: Y[1] });

	// ---- the lines, and their dots
	const dotsOf = {};
	for (const Q of QS) {
		const f = (x) => lg(spectrum(x, Q));
		const pts = graph(P, f, X[0], X[1]);
		check(longest(pts) <= 0.2501, `the line of Q = ${Q} is coarse`);
		check(pts.every(([, y]) => y > P.top + 2 && y < P.bottom - 2), `the line of Q = ${Q} leaves the chart`);
		S.path(pts, { color: INK, width: WIDTH[Q], layer: 2, what: `the line of Q = ${Q}` });
		dotsOf[Q] = DOTS.map((x) => {
			const v = dissipation(x, Q);
			check(near(lg(v), f(x), 1e-12), `the dot of Q = ${Q} at ${x} is off its line`);
			return P.at(x, lg(v));
		});
		S.raw(dotsOf[Q].map(([x, y]) => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${DOT}" fill="${INK}"/>`).join(''), 3);
		for (const p of dotsOf[Q]) S.mark([p], DOT, `a dot of Q = ${Q}`);
	}
	// the peaks: Q at omega_0 (Q = 30 reaches 30, under the top of the chart at 40)
	for (const Q of QS) check(near(spectrum(1, Q), Q, 1e-15) && P.Y(lg(Q)) > P.top + 2, `the peak of Q = ${Q}`);

	// ---- the axes
	const fmtX = (t) => (t === 0 ? '0' : `${t}`);
	const xl = await xAxis(S, P, { ticks: [0, 0.5, 1, 1.5, 2, 2.5], fmt: fmtX, what: 'the omega axis' });
	L.push(...xl);
	const last = xl[xl.length - 1];
	L.push(await S.clear('\\omega/\\omega_0', last.box.r + 5, (last.box.t + last.box.b) / 2, 0, 0.5, [1, 0], { color: DIM }));
	const pow = (t) => (t === 0 ? '1' : t === 1 ? '10' : `10^{${t}}`);
	L.push(...(await yAxis(S, P, { ticks: [-3, -2, -1, 0, 1], fmt: pow, what: 'the S axis' })));
	L.push(await S.clear('S_q\\ \\ (2k_BT/k\\omega_0)', P.left + 4.5, P.top - LABEL_GAP, 0, 1, [0, -1], { color: DIM }));

	// ---- the names beside the peaks, off the lines: Q = 30 to the right of its peak, Q = 3 to the left of the spike
	L.push(await S.clear('Q = 30', P.X(1) + 5, P.Y(lg(30)) + 2, 0, 0.5, [1, 0]));
	L.push(await S.clear('Q = 3', P.X(0.93) - 3, P.Y(lg(3)) - LABEL_GAP - 2, 1, 1, [-1, 0]));

	// ---- the legend, upper right, where the chart is empty
	const lx = P.X(1.62), ly = P.Y(lg(14));
	S.path([[lx, ly], [lx + 14, ly]], { color: INK, width: 0.65, layer: 2, what: 'the legend\'s line' });
	L.push(await placed('S_q', lx + 14 + LABEL_GAP + 1.5, ly, 0, 0.5, INK));
	const dy = ly + 13, dx = lx + 7;
	S.raw(`<circle cx="${n2(dx)}" cy="${n2(dy)}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([[dx, dy]], DOT, 'the legend\'s dot');
	L.push(await placed('2k_BT\\,\\mathrm{Im}\\,\\chi/\\omega', lx + 14 + LABEL_GAP + 1.5, dy, 0, 0.5, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { peaks: QS.map((Q) => spectrum(1, Q)), ends: QS.map((Q) => [spectrum(0, Q), spectrum(2.5, Q)]) };
	return finish(S, L, [240, 340]);
}
