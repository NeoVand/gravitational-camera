// The tutorial, section 11.1 (tutorial/black-holes/schwarzschild.md), its first diagram: at the horizon a clock at rest
// stops and the push that holds it grows without limit. One panel on linear axes: across, r/r_s, ticked from 1 to 6;
// up, one shared scale from 0 to 2. The clock rate sqrt(1 - r_s/r), from 0 at the horizon toward 1, in the observer's
// colour (the chapter colours tau so), named "clock rate"; the hovering acceleration over Newton's value,
// 1/sqrt(1 - r_s/r), from infinity toward 1, in ink, named "a / (GM/r^2)", cut just past 2, where it ends in a head,
// named "infinity". A thin ink line at r = r_s, "horizon", and a dashed one at r = 1.5 r_s, "photon sphere"; a
// faint dotted line at 1, the far value of both curves.
// Departures from the diagram's comment: the axis across starts at 0.5 r_s, so that the clock rate, which leaves the
// horizon straight up, does not run along the vertical axis; the horizon's line stops where the clock rate comes
// within 2 points of it, so that the two never run side by side; the curve runs on along itself for 7.5 points past
// 2 and ends in a head, named "infinity" at its tip (the comment's "-> infinity" is the head and its name); the
// dotted line at 1 is added.
// Exact: both curves (asserted reciprocal, 1/2 and 2 at 4r_s/3, 1 far away), the cut at 4r_s/3, the head's direction
// (the curve's tangent at its tip), the lines at r_s and 1.5 r_s. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, boxOf, LABEL_GAP, SIZE } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { tex, INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, near, OBS, rate, push } from './tut-schw-lib.js';

const name = 'tut-schw-clocks';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const X0 = 0.5, X1 = 6, Y1 = 2;                 // the axes' ranges: r/r_s, and the shared scale
const DX = 50, DY = 62;                         // points per unit across and up
const CURVE = 0.7;                              // the two curves
const LINE = 0.45;                              // the horizon's and the photon sphere's lines
const TOP = 2.32;                               // the lines run up to here, their names above
const ARROW = { len: 7.5, head: 3 };            // the arrow at the cut
const FLOOR = 2;                                // the horizon's line stops this far (points) from the clock rate
const DOT = 0.5, DOT_STEP = 1.6;                // the dotted line at 1
const caption = 'Look first at the horizon line: there a clock at rest stops, as seen from far away, and the push needed to hold it grows without limit. Both curves are exact for the Schwarzschild metric.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'schw-clocks', caption);

	const S = new Sheet(name);
	const L = [];
	const W = (X1 - X0) * DX, H = Y1 * DY;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - H / 2, w: W, h: H, x0: X0, x1: X1, y0: 0, y1: Y1 });

	// ---- the axes
	const xl = await xAxis(S, P, { ticks: [1, 2, 3, 4, 5, 6], what: 'the axis across' });
	L.push(...xl);
	L.push(await placed('r/r_s', P.X((1 + X1) / 2), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
	L.push(...(await yAxis(S, P, { ticks: [0, 1, 2], what: 'the axis up' })));

	// ---- the far value, dotted, from the horizon to the end
	{
		const y = P.Y(1), a = P.X(1) + 2, b = P.right;
		const n = Math.round((b - a) / DOT_STEP), step = (b - a) / n;
		const pts = Array.from({ length: n + 1 }, (_, i) => [a + i * step, y]);
		S.raw(`<path d="${pts.map(([x, yy]) => `M${x.toFixed(2)},${yy.toFixed(2)}h0`).join('')}" stroke="${FAINT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 0.8);
		S.mark([[a, y], [b, y]], DOT / 2, 'the dotted line at 1');
	}

	// ---- the curves
	const clock = graph(P, rate, 1, X1, 0.2);
	check(longest(clock) <= 0.2001 && near(clock[0][1], P.Y(0), 1e-9) && near(clock[0][0], P.X(1), 1e-9), 'the clock rate does not start at the horizon, on the axis');
	S.path(clock, { color: OBS, width: CURVE, layer: 3, cap: 'butt', what: 'the clock rate' });
	const cut = 4 / 3;                                      // where 1/sqrt(1 - r_s/r) = 2
	check(near(push(cut), Y1, 1e-14) && near(rate(cut), 0.5, 1e-15), 'the cut is not at 4r_s/3');
	// the push runs on past the cut, along itself, for ARROW.len points of the page, and ends in a head along its
	// tangent: the arrow "-> infinity"
	const hold = graph(P, push, cut, X1, 0.2);
	check(longest(hold) <= 0.2001 && near(hold[0][1], P.top, 1e-9), 'the push does not start at the top');
	const on = [];                                          // past the cut, from the cut up toward the horizon
	{
		let x = cut;
		const at = (xx) => P.at(xx, push(xx));
		let s = 0;
		on.push(at(x));
		while (s < ARROW.len) {
			let dx = 1e-3;
			while (Math.hypot(...at(x - dx).map((v, k) => v - at(x)[k])) > 0.1) dx /= 2;
			s += Math.hypot(...at(x - dx).map((v, k) => v - at(x)[k]));
			x -= dx;
			on.push(at(x));
		}
		check(x > 1 && push(x) > Y1, 'the arrow does not run past the cut');
		const tip = on[on.length - 1];
		const h = 1e-7, slope = (push(x + h) - push(x - h)) / (2 * h);
		const d = [-DX, slope * DY], l = Math.hypot(...d), u = [d[0] / l, d[1] / l];      // up the page as r falls
		check(u[0] < 0 && u[1] < 0, 'the arrow does not point up and toward the horizon');
		const hd = ARROW.head, hw = 0.36 * hd, base = [tip[0] - u[0] * hd, tip[1] - u[1] * hd], w = [-u[1], u[0]];
		// the curve stops inside the head, at 0.8 of its length from the tip
		let k = on.length - 1;
		while (k > 0 && Math.hypot(on[k][0] - tip[0], on[k][1] - tip[1]) < 0.8 * hd) k--;
		S.path([...on.slice(0, k + 1).reverse(), ...hold.slice(1)], { color: INK, width: CURVE, layer: 3, cap: 'butt', what: 'the push' });
		const tri = [tip, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw]];
		S.raw(`<path d="M${tri.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join('L')}Z" fill="${INK}"/>`, 3);
		S.mark([...tri, tri[0]], 0, 'the arrow\'s head');
		check(hd <= 0.4 * ARROW.len, 'the head is longer than two fifths of the arrow');
		L.push(await S.clear('\\infty', tip[0], tip[1] - LABEL_GAP - 0.2, 0.5, 1, [0, -1]));
	}
	for (const x of [1.01, 2, 4, 6]) check(near(rate(x) * push(x), 1, 1e-14), `the curves are not reciprocal at ${x}`);
	check(rate(X1) < 1 && push(X1) > 1 && push(X1) - 1 < 0.1, 'the curves do not close on 1');

	// ---- the horizon, solid, down to where the clock rate comes within FLOOR of it; the photon sphere, dashed
	{
		// the clock rate's distance from the line x = 1, in points, at the height y: (x(y) - 1) DX, x(y) = 1/(1 - y^2)
		const gapAt = (y) => (1 / (1 - y * y) - 1) * DX;
		let lo = 0, hi = 1;
		for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (gapAt(m) < FLOOR + CURVE / 2 + LINE / 2) lo = m; else hi = m; }
		const yEnd = (lo + hi) / 2;
		check(yEnd > 0.1 && yEnd < 0.3, `the horizon's line stops at ${yEnd}`);
		S.path([[P.X(1), P.Y(yEnd)], [P.X(1), P.Y(TOP)]], { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the horizon' });
		// the two names on one baseline: "horizon" over its line, "photon sphere" beside the top of its dashed line,
		// which runs up to the middle of the names' small letters
		const base = P.Y(TOP) - LABEL_GAP - LINE / 2 - 0.1;
		const h = await tex('\\text{horizon}', [P.X(1), base], SIZE, 'cB', INK);
		L.push({ src: 'horizon', svg: h, box: boxOf(h) });
		check(near(boxOf(h).b, base, 0.25), 'the name "horizon" does not sit on its baseline');
		const xh = boxOf(await tex('\\text{x}', [0, base], SIZE, 'lB', INK));
		dashed(S, [P.X(1.5), P.Y(0)], [P.X(1.5), (xh.t + xh.b) / 2], { color: DIM, width: LINE, layer: 2, what: 'the photon sphere' });
		const p = await tex('\\text{photon sphere}', [P.X(1.5) + LABEL_GAP + LINE / 2 + 0.4, base], SIZE, 'lB', DIM);
		L.push({ src: 'photon sphere', svg: p, box: boxOf(p) });
	}

	// ---- the curves' names, beside them toward their far ends
	{
		const xa = 4.6;
		L.push(await S.clear('a/(GM/r^2)', P.X(xa), P.Y(push(xa)) - LABEL_GAP, 0.5, 1, [0, -1]));
		const xc = 4.6;
		L.push(await S.clear('\\text{clock rate}', P.X(xc), P.Y(rate(xc)) + LABEL_GAP, 0.5, 0, [0, 1], { color: OBS }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { cut, slope: -2.25 };
	return finish(S, L, [285, 345]);
}
