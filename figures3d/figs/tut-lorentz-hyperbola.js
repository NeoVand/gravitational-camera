// The tutorial, chapter 6.1 (tutorial/relativity/lorentz.md), its fourth diagram: one tick of a clock for observers
// at three speeds, on the hyperbola of one interval. One panel, units of c tau at one scale on both axes: x across and
// ct upward, each from 0 to 2.4, named at their ends, with ticks at 1 and 2. The light line x = ct, thin and dashed in
// the light role's colour. The upper branch of the hyperbola -c^2 t^2 + x^2 = -c^2 tau^2 for c tau = 1, ct =
// sqrt(1 + x^2), a thin ink line, named by its equation near its upper end, off the curve. Three points on it as dots
// in the observer's colour at (x, ct) = (sinh eta, cosh eta): (0, 1), named eta = 0; (0.75, 1.25), named
// eta = ln 2, 0.6c; and (1.875, 2.125), named eta = ln 4, 0.882c; and a thin line in the observer's colour from the
// origin to each, the time axes of the three observers.
// Departure from the diagram's comment: the hyperbola is drawn for x from 0 to sqrt(2.4^2 - 1) = 2.18, where it
// reaches the top of the ct axis; the comment's x = 2.3 would carry it to ct = 2.51, above the axis's 2.4. The panel
// is drawn at 76 points to the unit (182 points for the axes' 2.4, about the comment's 440 site pixels at half a point
// each, less the room the names take).
// Exact: the light line at 45 degrees on the page (asserted), the hyperbola (sampled so that no two neighbouring points
// are more than a quarter of a point apart, every point asserted on it), the dots on it at (sinh eta, cosh eta) and
// the lines through them, of slope tanh eta from the vertical (asserted in tut-lorentz-lib.js with 15/17 = 0.882).
// Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest, THIN } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, palette, OBS, LIGHT, RAPIDITIES, onHyperbola } from './tut-lorentz-lib.js';

const name = 'tut-lorentz-hyperbola';
const check = checker(name);

const U = 86;                              // points per unit of c tau
const TOP = 2.4;                           // the axes' ends
const POINT = DOT + 0.35;                  // a dot, radius
const RAYS = 0.45;                         // the observers' time axes

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const W = TOP * U;
	const P = new Plot({ left: ORIGIN - W / 2, top: ORIGIN - W / 2, w: W, h: W, x0: 0, x1: TOP, y0: 0, y1: TOP });
	const f = (x) => Math.sqrt(1 + x * x);

	// ---- the axes, with heads at their ends, ticks at 1 and 2
	const xA = S.arrow(P.at(0, 0), P.at(TOP, 0), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the x axis' });
	const tA = S.arrow(P.at(0, 0), P.at(0, TOP), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the ct axis' });
	for (const t of [1, 2]) {
		const [x, y] = P.at(t, 0), [u, v] = P.at(0, t);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: `the x tick at ${t}` });
		// at ct = 1 the first observer's dot marks the place on the axis, and a tick would show as a stub beside it
		if (t !== 1) S.path([[u, v], [u - TICK, v]], { color: DIM, width: HAIR, cap: 'butt', what: `the ct tick at ${t}` });
		L.push(await placed(String(t), x, y + TICK + NUM, 0.5, 0, DIM));
		L.push(await placed(String(t), u - TICK - NUM, v, 1, 0.5, DIM));
	}
	L.push(await placed('0', P.left - TICK - NUM + 1, P.bottom + TICK + NUM - 1, 1, 0, DIM));
	L.push(await placed('x', xA.B[0] + LABEL_GAP + 1.2, xA.B[1], 0, 0.5, INK));
	L.push(await placed('ct', tA.B[0], tA.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));

	// ---- the light line, x = ct, at 45 degrees on the page
	{
		const a = P.at(0, 0), b = P.at(TOP, TOP);
		check(near(b[0] - a[0], a[1] - b[1], 1e-9), 'the light line is not at 45 degrees');
		dashed(S, a, b, { color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: 'the light line' });
	}

	// ---- the hyperbola, from x = 0 to where it reaches ct = TOP
	const xEnd = Math.sqrt(TOP * TOP - 1);
	check(xEnd.toFixed(2) === '2.18' && near(f(xEnd), TOP, 1e-12), `the hyperbola's end at ${xEnd}`);
	const curve = graph(P, f, 0, xEnd);
	check(longest(curve) <= 0.2501, 'the hyperbola is coarse');
	for (const [px, py] of curve) {
		const x = (px - P.left) / U, ct = (P.bottom - py) / U;
		check(near(-ct * ct + x * x, -1, 1e-9), 'a point of the hyperbola is off it');
	}
	S.path(curve, { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the hyperbola' });

	// ---- the three observers: a line from the origin to each point (sinh eta, cosh eta), a dot there
	const pts = RAPIDITIES.map(onHyperbola);
	pts.forEach(([x, ct], i) => {
		check(near(f(x), ct, 1e-14), `the point ${i} is off the curve`);
		const [px, py] = P.at(x, ct), o = P.at(0, 0);
		// the first observer's axis is the ct axis itself
		if (i > 0) {
			const d = Math.hypot(px - o[0], py - o[1]), u = [(px - o[0]) / d, (py - o[1]) / d];
			S.path([o, [px - u[0] * POINT, py - u[1] * POINT]], { color: OBS, width: RAYS, layer: 1.5, cap: 'butt', what: `the time axis ${i}` });
		}
		S.raw(`<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${POINT}" fill="${OBS}"/>`, 4);
		S.mark([[px, py]], POINT, `the point ${i}`);
	});

	// ---- the names: each point's above and to the left of it, outside the curve; the equation at the curve's end
	{
		const names = ['\\eta = 0', '\\eta = \\ln 2,\\ 0.6c', '\\eta = \\ln 4,\\ 0.882c'];
		check(Math.tanh(RAPIDITIES[2]).toFixed(3) === '0.882' && Math.tanh(RAPIDITIES[1]).toFixed(1) === '0.6', 'the printed speeds');
		// eta = 0 to the right of its dot, over the curve's flat top; the other two up and to the left of theirs,
		// clear of the curve beneath them
		const at = pts.map((p) => P.at(...p));
		L.push(await S.clear(names[0], at[0][0] + POINT + LABEL_GAP, at[0][1] - POINT - 0.5, 0, 1, [0.3, -0.95], { color: OBS }));
		L.push(await S.clear(names[1], at[1][0] + 8, at[1][1] - POINT - LABEL_GAP, 1, 1, [0, -1], { color: OBS }));
		L.push(await S.clear(names[2], at[2][0] - POINT - 1, at[2][1] - POINT - 1, 1, 1, [-0.6, -0.8], { color: OBS }));
		const [ex, ey] = P.at(xEnd, TOP);
		L.push(await S.clear('-c^2t^2 + x^2 = -c^2\\tau^2', ex - 8, ey - 1, 1, 1, [-1, 0], { color: INK }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, end: xEnd };
	return finish(S, L, [200, 340]);
}
