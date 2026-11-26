// The tutorial, section 8.6 (tutorial/quantum/quantum-limit.md), its first diagram: the compromise of the standard
// quantum limit. One panel on logarithmic axes, one decade as long across as up, so that the two terms are lines at
// 45 degrees: across, sigma_0 / sigma_SQL from 0.03 to 30; up, sigma_x(tau) / sigma_SQL from 0.5 to 30. The first
// reading's own term sigma_0 (slope +1) and the back-action's hbar tau / 2 m sigma_0 (slope -1), dashed grey; their
// quadrature sum sqrt(sigma_0^2 + (hbar tau / 2 m sigma_0)^2), in ink. Its least value 1 at 1/sqrt 2 = 0.707, an ink
// dot on a thin horizontal line at 1 named sigma_SQL = sqrt(hbar tau / m) at the right; a tick on the axis at 0.707
// named sqrt(hbar tau / 2m); open circles at 0.0707 and 7.07, each at 7.07, named "x 7". Ink and greys only.
// Departures from the diagram's comment: away from the least value the ink curve lies on the dashed lines (at three
// times the best it is 1% above its own term, less than its stroke), so the dashed lines are named in the empty band
// below the line at 1, each beside the stretch of its own line that runs on past the crossing to the axis, where no
// other line is near: "first reading" left of its line, "back-action" right of its; "sigma_x(tau)" sits just above the
// ink dot. The tick at 0.707 runs down past the axis's numbers, its name under them, since the number 1 stands 14 pt
// away; 0.03, at the corner, is ticked but not numbered.
// Exact: the three curves (eq:spread over sigma_SQL, asserted against the SI form for 1 g and 1 s in tut-sql-lib.js),
// the least value 1 at 1/sqrt 2 (by a scan), and the two points of 7.07, each ten times off the best.
import { Sheet, ORIGIN, finish, checker, placed, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest, CURVE } from './tut-fourier-lib.js';
import { INK, DIM, PAGE } from '../lib.js';
import { chapter, palette, MATTER, near, reading, kick, spread, BEST } from './tut-sql-lib.js';

const name = 'tut-sql-compromise';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const lg = Math.log10;
const X0 = lg(0.03), X1 = lg(30), Y0 = lg(0.5), Y1 = lg(30);
const DEC = 92;                          // points per decade, both ways
const TERM_W = 0.5, DASH = [3, 2];
const SQL_W = 0.4;
const DOT = 1.7, RING = 1.9, RING_W = 0.55;
const M = (s) => `{\\color{${MATTER}}${s}}`;

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DEC, H = (Y1 - Y0) * DEC;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: Y0, y1: Y1 });

	// ---- the axes
	const xs = [0.03, 0.1, 0.3, 1, 3, 10, 30], ys = [0.5, 1, 3, 10, 30];
	const xl = await xAxis(S, P, { ticks: xs.map(lg), fmt: (t) => (t === X0 ? null : String(xs[xs.findIndex((v) => near(lg(v), t, 1e-12))])), what: 'the axis across' });
	L.push(...xl);
	L.push(...(await yAxis(S, P, { ticks: ys.map(lg), fmt: (t) => String(ys[ys.findIndex((v) => near(lg(v), t, 1e-12))]), what: 'the axis up' })));
	const numbersBottom = Math.max(...xl.map((l) => l.box.b));
	// the tick at the best first reading, down past the numbers, and its name under them
	{
		const x = P.X(lg(BEST)), y1 = numbersBottom + 1.2;
		S.path([[x, P.bottom], [x, y1]], { color: DIM, width: HAIR, cap: 'butt', what: 'the tick at 0.707' });
		L.push(await placed(`\\sqrt{\\hbar\\tau/2${M('m')}}`, x, y1 + LABEL_GAP + 0.4, 0.5, 0, INK));
	}
	L.push(await placed('\\sigma_0/\\sigma_{\\rm SQL}', P.right, numbersBottom + 1.2 + LABEL_GAP + 0.4, 1, 0, DIM));
	L.push(await placed('\\sigma_x(\\tau)/\\sigma_{\\rm SQL}', P.left + LABEL_GAP + 2, P.top, 0, 0.5, DIM));

	// ---- the line at sigma_SQL
	S.path([P.at(X0, 0), P.at(X1, 0)], { color: DIM, width: SQL_W, layer: 1.2, cap: 'butt', what: 'the line at sigma_SQL' });

	// ---- the two terms, dashed, and the sum in ink: each kept inside the panel
	const first = [P.at(Y0, Y0), P.at(X1, X1)];
	check(near(reading(0.5), 0.5, 1e-15) && near(reading(30), 30, 1e-15), 'the first reading\'s line');
	const xk = lg(1 / (2 * 0.5));             // where the back-action's line leaves the panel's bottom
	check(near(kick(10 ** xk), 0.5, 1e-12) && kick(0.03) < 30, 'the back-action\'s line');
	const back = [P.at(X0, lg(kick(0.03))), P.at(xk, Y0)];
	S.path(first, { color: DIM, width: TERM_W, layer: 1.5, dash: DASH, cap: 'butt', what: 'the first reading' });
	S.path(back, { color: DIM, width: TERM_W, layer: 1.5, dash: DASH, cap: 'butt', what: 'the back-action' });
	const sum = graph(P, (x) => lg(spread(10 ** x)), X0, X1);
	check(longest(sum) <= 0.2501, `the sum has a step of ${longest(sum)} pt`);
	check(lg(spread(30)) <= Y1 + 1e-5 && lg(spread(0.03)) < Y1, 'the sum leaves the panel');
	S.path(sum, { color: INK, width: CURVE, layer: 2, what: 'the sum' });

	// ---- the least value and the two points ten times off it
	const m = P.at(lg(BEST), 0);
	S.raw(`<circle cx="${n2(m[0])}" cy="${n2(m[1])}" r="${DOT}" fill="${INK}"/>`, 3);
	S.mark([m], DOT, 'the least value');
	const rings = [];
	for (const s of [BEST / 10, BEST * 10]) {
		const q = P.at(lg(s), lg(spread(s)));
		check(spread(s).toFixed(2) === '7.07', `the point at ${s} is at ${spread(s)}`);
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${RING}" fill="${PAGE}" stroke="${INK}" stroke-width="${RING_W}"/>`, 3);
		S.mark([q], RING + RING_W / 2, `the point at ${s}`);
		rings.push(q);
	}

	// ---- labels
	// sigma_x(tau) just above the dot
	L.push(await S.clear('\\sigma_x(\\tau)', m[0], m[1] - DOT - LABEL_GAP - 0.5, 0.5, 1, [0, -1]));
	// sigma_SQL at the right, above its line
	L.push(await S.clear(`\\sigma_{\\rm SQL} = \\sqrt{\\hbar\\tau/${M('m')}}`, P.right - 2, P.Y(0) - SQL_W / 2 - LABEL_GAP, 1, 1, [0, -1]));
	// the two terms, in the band below the line at 1, each beside the part of its line that runs on past the other's
	// to the axis: "first reading" left of its line, "back-action" right of its line
	{
		const yb = lg(0.62);
		L.push(await S.clear('\\text{first reading}', P.X(yb) - 3, P.Y(yb), 1, 0.5, [-1, 0]));
		L.push(await S.clear('\\text{back-action}', P.X(lg(1 / (2 * 10 ** yb))) + 3, P.Y(yb), 0, 0.5, [1, 0]));
	}
	// x 7 beside each open circle, on the outer side of the curve
	L.push(await S.clear('\\times7', rings[0][0] - RING - LABEL_GAP, rings[0][1] + RING + LABEL_GAP, 1, 0, [-0.7071, 0.7071]));
	L.push(await S.clear('\\times7', rings[1][0] + RING + LABEL_GAP, rings[1][1] + RING + LABEL_GAP, 0, 0, [0.7071, 0.7071]));

	S.checkAll(L);
	window[name + '-numbers'] = { best: BEST, at7: spread(BEST * 10) };
	return finish(S, L, [260, 340]);
}
