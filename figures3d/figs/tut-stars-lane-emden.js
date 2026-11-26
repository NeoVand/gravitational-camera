// The tutorial, section 12.1 (tutorial/sky/stars.md), its second diagram: the Lane-Emden solutions and Eddington's
// Sun. Two panels side by side, sharing their tops and bottoms. Left, on linear axes: theta(xi) for n = 3/2 (dashed)
// and n = 3 (solid) from the centre to each first zero, xi from 0 to 7, the zeros xi_1 = 3.654 and 6.897 marked by
// small ticks up from the axis and numbered beside them. Right: Eddington's Sun, rho/rho_bar = (xi_1^3/3 omega) theta^3
// = 54.2 theta^3 against r/R from 0 to 1 on a logarithmic axis from 0.01 to 100, in matter's colour; the uniform ball as
// a thin flat line at 1; a dotted line at r/R = 0.25 with "41% of the mass inside", the share -xi^2 theta' / omega at
// xi = 0.25 xi_1 (0.406).
// The curves theta are neutral, as the chapter writes theta; the density is in matter's colour.
// Departures from the diagram's comment: the left axis is numbered at 0, 2, 4 and 6 only, so that the zeros' numbers,
// set just above the axis beside their ticks, stand clear of the axis's; the centre's 54.2 is printed where the curve
// leaves the axis.
// Exact: both curves (tut-stars-lib.js: Runge-Kutta from the series, the zeros and omega asserted against the
// chapter's numbers, n = 0 and n = 1 against their closed forms); the density, 54.2 theta^3 from the same solution;
// the 41%, asserted both as -xi^2 theta'/omega and as the sum of xi^2 theta^3. Schematic: nothing.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { graph, longest } from './tut-fourier-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, MATTER, fitDash } from './tut-stars-lib.js';

const name = 'tut-stars-lane-emden';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const H = 118;                                   // both panels' height
const LEFT = { w: 150, x1: 7 };
const RIGHT = { w: 140, y0: -2, y1: 2 };         // log10 of rho / rho_bar
const BETWEEN = 42;                              // from the left panel's right edge to the right panel's axis
const MAIN = 0.75, LINE = 0.45;                  // the curves; the uniform ball's line
const MINOR = 1.5;
const NAME = 7;                                  // the axes' names over the panels
const ZERO_TICK = 3.2;                           // the zeros' ticks, up from the axis
const DOT = 0.6, DOT_STEP = 1.6;
const caption = 'Look first at the right panel\'s curve against the flat line of the uniform ball: Eddington\'s Sun is 54 times denser than its mean at the centre and holds 41% of its mass inside a quarter of its radius. The left panel shows the two solutions of the Lane–Emden equation that the section uses. Curves exact.';

export default async function () {
	const { state, half, three, contrast, inner } = await chapter(check);
	state(name, 'stars-lane-emden', caption);

	const S = new Sheet(name);
	const L = [];
	const total = LEFT.w + BETWEEN + RIGHT.w;
	const top = ORIGIN - H / 2;
	const A = new Plot({ left: ORIGIN - total / 2, top, w: LEFT.w, h: H, x0: 0, x1: LEFT.x1, y0: 0, y1: 1 });
	const B = new Plot({ left: A.right + BETWEEN, top, w: RIGHT.w, h: H, x0: 0, x1: 1, y0: RIGHT.y0, y1: RIGHT.y1 });
	check(near(A.top, B.top, 0) && near(A.bottom, B.bottom, 0), 'the panels do not share their tops and bottoms');

	// ---- the left panel: theta(xi)
	{
		const xl = await xAxis(S, A, { ticks: [0, 1, 2, 3, 4, 5, 6, 7], fmt: (t) => (t % 2 === 0 && t < 7 ? String(t) : null), what: 'the left axis across' });
		L.push(...xl);
		L.push(await placed('\\xi', A.X(3.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, A, { ticks: [0, 0.5, 1], what: 'the left axis up' });
		L.push(...yl);
		L.push(await placed('\\theta', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, DIM));
		const curves = {};
		for (const sol of [three, half]) {
			const pts = graph(A, sol.theta, 0, sol.xi1);
			check(longest(pts) <= 0.26 && near(pts[pts.length - 1][1], A.bottom, 1e-9) && near(pts[0][1], A.top, 1e-9), `the curve of n = ${sol.n} is not fine or does not end on the axis`);
			const fit = fitDash(pts, DASH);
			check(Math.abs(fit.f - 1) < 0.1, 'the dashes are stretched more than a tenth');
			S.path(pts, { color: INK, width: MAIN, dash: sol.n === 3 ? null : fit.dash, cap: 'butt', layer: 3, what: `the curve of n = ${sol.n}` });
			curves[sol.n] = pts;
		}
		// the zeros: a small tick up from the axis at each, its number just above the axis to its right (n = 3/2,
		// between its own curve's end and the curve n = 3) or over it (n = 3, whose curve meets the axis almost flat)
		for (const sol of [half, three]) {
			const x = A.X(sol.xi1);
			S.path([[x, A.bottom], [x, A.bottom - ZERO_TICK]], { color: INK, width: HAIR, layer: 2, cap: 'butt', what: `the zero of n = ${sol.n}` });
			const num = sol.xi1.toFixed(3);
			check(num === (sol.n === 3 ? '6.897' : '3.654'), `the zero ${num}`);
			if (sol.n === 1.5) L.push(await S.clear(num, x + LABEL_GAP + 0.6, A.bottom - ZERO_TICK, 0, 1, [0, -1], { color: INK }));
			else L.push(await S.clear(num, x, A.bottom - ZERO_TICK - LABEL_GAP - 0.4, 0.5, 1, [0, -1], { color: INK }));
		}
		// the names: n = 3/2 under its curve, n = 3 over its own
		L.push(await S.clear('n = 3/2', A.X(2.45), A.Y(0.3), 1, 0.5, [-1, 0], { color: INK }));
		L.push(await S.clear('n = 3', A.X(4.3), A.Y(0.24), 0, 1, [0.3, -1], { color: INK }));
	}

	// ---- the right panel: Eddington's Sun
	{
		const xl = await xAxis(S, B, { ticks: [0, 0.25, 0.5, 0.75, 1], what: 'the right axis across' });
		L.push(...xl);
		L.push(await placed('r/R', B.X(0.5), Math.max(...xl.map((l) => l.box.b)) + 4, 0.5, 0, DIM));
		const yl = await yAxis(S, B, { ticks: [-2, -1, 0, 1, 2], fmt: (t) => ['0.01', '0.1', '1', '10', '100'][t + 2], what: 'the right axis up' });
		L.push(...yl);
		L.push(await placed('\\rho/\\bar\\rho', Math.min(...yl.map((l) => l.box.l)), top - NAME, 0, 1, MATTER));
		// the uniform ball, a thin line at 1
		S.path([B.at(0, 0), B.at(1, 0)], { color: DIM, width: LINE, layer: 1.5, cap: 'butt', what: 'the uniform ball' });
		// the density, 54.2 theta^3, until it falls to 0.01
		const xi1 = three.xi1;
		const dens = (u) => contrast * three.theta(u * xi1) ** 3;
		let lo = 0.5, hi = 1;
		for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (dens(m) > 10 ** RIGHT.y0) lo = m; else hi = m; }
		const end = (lo + hi) / 2;
		const pts = graph(B, (u) => Math.log10(dens(u)), 0, end);
		check(longest(pts) <= 0.26 && near(pts[pts.length - 1][1], B.bottom, 1e-6), 'the density is not fine or does not end on the floor');
		check(pts.every(([, y]) => y >= B.top), 'the density leaves the panel');
		S.path(pts, { color: MATTER, width: MAIN, layer: 3, cap: 'butt', what: 'the density' });
		check(near(dens(0), contrast, 1e-12) && contrast.toFixed(1) === '54.2', 'the centre is not 54.2');
		L.push(await S.clear(contrast.toFixed(1), B.X(0.03), B.Y(Math.log10(contrast)) - LABEL_GAP - 0.4, 0, 1, [1, 0], { color: MATTER }));
		L.push(await S.clear('\\text{uniform ball}', B.X(0.97), B.Y(0) - LINE / 2 - LABEL_GAP - 0.4, 1, 1, [0, -1], { color: DIM }));
		// a quarter of the radius: a dotted line up the panel, and the share of the mass inside it
		const x = B.X(0.25);
		const dots = S.dots([x, B.bottom], [x, B.top], { color: DIM, clear0: 0, clear1: 0, what: 'the quarter of the radius' });
		check(dots.step > DOT_STEP * 0.9 && dots.step < DOT_STEP * 1.1 && DOT === 0.6, 'the dots');
		const pct = Math.round(100 * inner);
		check(pct === 41, `the share is ${inner}`);
		L.push(await S.clear(`${pct}\\%\\text{ of the mass inside}`, x + LABEL_GAP + 0.6, B.Y(1.62), 0, 0.5, [0, 1], { color: INK }));
		window[name + '-numbers'] = { inner, contrast, end, xi: [half.xi1, three.xi1], omega: [half.omega, three.omega] };
	}

	S.checkAll(L);
	return finish(S, L, [300, 370]);
}
