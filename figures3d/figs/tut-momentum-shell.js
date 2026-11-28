// The tutorial, section 6.4 (tutorial/relativity/energy-and-momentum.md), its first diagram: the mass shell. One panel,
// units of mc^2 at one scale on both axes: p_z c across from -2.0 to 2.0 and E upward from 0 to 2.4, thin ink, named
// "p_z c/mc^2" (the momentum along one line, the z axis, negative for the other direction; it was "pc" with p in bold,
// a vector over a signed range) and "E/mc^2". The two light lines E = +-p_z c, thin and dashed in the light role's
// colour, named "light, E = |p_z|c" once, beside the upper right one. The upper branch of the hyperbola E^2 - p_z^2 c^2
// = m^2 c^4 from p_z c = -1.9 to 1.9, a thin stroke in matter's colour, named "m > 0" near its upper right end, off the
// curve. Two dots on it in matter's colour: at (0, 1), named "at rest, E = mc^2", and at (0.75, 1.25), named "0.6c";
// from the second, thin dotted segments across to the E axis and down to the p_z c axis, with the values 1.25 and 0.75
// at their ends.
// Departures from the diagram's comment: the axes carry numbers, as section 6.1's and 6.2's do, so that the units of
// mc^2 can be read: -2, -1, 0, 1 and 2 across and 2 upward. At E = 1 there is neither tick nor number, since the dot
// "at rest" sits on the axis there and its label says E = mc^2; a tick there would lie along the hyperbola's flat
// vertex, and its number, beside the axis, would sit on the curve (it passes within 0.3 points of it). The name of the
// dot at rest stands in two lines in the bowl under the hyperbola's vertex, left of the E axis, the one place near the
// dot that no line crosses. The light lines run from the origin to the panel's edges, (+-2, 2).
// Exact: the light lines at 45 degrees on the page (asserted), the hyperbola (sampled so that no two neighbouring
// points are more than a quarter of a point apart, every point asserted on it), the dots on it, and the dotted
// segments' ends at E = 1.25 and pc = 0.75 (asserted in tut-momentum-lib.js with 1.25^2 - 0.75^2 = 1). Nothing is
// schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest, THIN } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH, DOT } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, LIGHT, MATTER, shell, REST, MOVING } from './tut-momentum-lib.js';

const name = 'tut-momentum-shell';
const check = checker(name);

const U = 62;                              // points per unit of mc^2
const X = 2, TOP = 2.4;                    // the axes: pc from -X to X, E from 0 to TOP
const END = 1.9;                           // the hyperbola runs from -END to END
const POINT = DOT + 0.35;                  // a dot, radius (section 6.1's)
const CLEAR = 2.2;                         // the dotted segments start this far from the dot
const LINE_SKIP = 1.6;                     // between the two lines of a name

/** Two labels as one, the lines of one name. */
const lines = (a, b) => ({ src: `${a.src} ${b.src}`, svg: a.svg + b.svg, box: { l: Math.min(a.box.l, b.box.l), r: Math.max(a.box.r, b.box.r), t: a.box.t, b: b.box.b } });

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - X * U, top: ORIGIN - (TOP * U) / 2, w: 2 * X * U, h: TOP * U, x0: -X, x1: X, y0: 0, y1: TOP });
	const at = ([x, e]) => P.at(x, e);
	const o = at([0, 0]);

	// ---- the axes: pc across the bottom, E up the middle
	const xA = S.arrow(at([-X, 0]), at([X, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the pc axis' });
	const eA = S.arrow(o, at([0, TOP]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the E axis' });
	for (const t of [-2, -1, 1]) {
		const [x, y] = at([t, 0]);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: `the pc tick at ${t}` });
		L.push(await placed(String(t), x, y + TICK + NUM, 0.5, 0, DIM));
	}
	{
		// the tick at 2 sits under the axis's head: its number only, beside the head's point
		const [x, y] = at([2, 0]);
		L.push(await placed('2', x, y + TICK + NUM, 0.5, 0, DIM));
		L.push(await placed('0', o[0], o[1] + TICK + NUM, 0.5, 0, DIM));
		const [u, v] = at([0, 2]);
		S.path([[u, v], [u - TICK, v]], { color: DIM, width: HAIR, cap: 'butt', what: 'the E tick at 2' });
		L.push(await placed('2', u - TICK - NUM, v, 1, 0.5, DIM));
	}
	L.push(await placed('p_zc/mc^2', xA.B[0] - 2, xA.B[1] - LABEL_GAP - 3, 1, 1, INK));
	L.push(await placed('E/mc^2', eA.B[0] + LABEL_GAP + 2, eA.B[1] + 1, 0, 0, INK));

	// ---- the light lines, E = |p|c, at 45 degrees on the page
	for (const s of [1, -1]) {
		const a = o, b = at([s * X, X]);
		check(near(Math.abs(b[0] - a[0]), a[1] - b[1], 1e-9), 'a light line is not at 45 degrees');
		dashed(S, a, b, { color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: `the light line ${s}` });
	}

	// ---- the mass shell, from -END to END
	check(shell(END).toFixed(3) === '2.147' && shell(END) < TOP, `the hyperbola's end at ${shell(END)}`);
	const curve = graph(P, shell, -END, END);
	check(longest(curve) <= 0.2501, 'the hyperbola is coarse');
	for (const [px, py] of curve) {
		const x = (px - P.left) / U - X, e = (P.bottom - py) / U;
		check(near(e * e - x * x, 1, 1e-9), 'a point of the hyperbola is off it');
	}
	S.path(curve, { color: MATTER, width: LINE, layer: 2, cap: 'butt', what: 'the hyperbola' });

	// ---- the dotted segments from the dot at 0.6c to the two axes, then the dots
	const m = at(MOVING), r = at(REST);
	check(near(MOVING[0], 0.75, 1e-15) && near(MOVING[1], 1.25, 1e-15), 'the dot at 0.6c is not at (0.75, 1.25)');
	S.dots(m, at([0, MOVING[1]]), { color: DIM, clear0: CLEAR, clear1: AXIS / 2 + 0.6, layer: 1.5, what: 'the dotted segment to E' });
	S.dots(m, at([MOVING[0], 0]), { color: DIM, clear0: CLEAR, clear1: AXIS / 2 + 0.6, layer: 1.5, what: 'the dotted segment to pc' });
	for (const [p, what] of [[r, 'the dot at rest'], [m, 'the dot at 0.6c']]) {
		S.raw(`<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${POINT}" fill="${MATTER}"/>`, 4);
		S.mark([p], POINT, what);
	}
	// the values at the segments' ends, set as the axes' numbers are
	const [pc, e] = MOVING.map((v) => String(+v.toFixed(2)));
	check(pc === '0.75' && e === '1.25', `the printed values ${pc} ${e}`);
	L.push(await placed(e, o[0] - TICK - NUM, m[1], 1, 0.5, DIM));
	L.push(await placed(pc, m[0], o[1] + TICK + NUM, 0.5, 0, DIM));

	// ---- the names
	{
		// at rest: two lines in the bowl under the vertex, left of the E axis
		const a = await S.clear('\\text{at rest,}', r[0] - LABEL_GAP - 1.5, r[1] + POINT + 1.5, 1, 0, [0, 1], { color: MATTER });
		const b = await placed('E = mc^2', a.box.r, a.box.b + LINE_SKIP, 1, 0, MATTER);
		L.push(lines(a, b));
		// 0.6c: to the right of its dot, under the curve
		L.push(await S.clear('0.6c', m[0] + POINT + LABEL_GAP, m[1] + 1, 0, 0, [0.6, 0.8], { color: MATTER }));
		// m > 0: up and to the left of the curve's upper right end, inside the curve
		const [ex, ey] = at([END, shell(END)]);
		L.push(await S.clear('m > 0', ex - 4, ey - 1, 1, 1, [-1, 0], { color: MATTER }));
		// light: under the upper right light line, inside the panel
		const q = at([0.95, 0.95]);
		L.push(await S.clear('\\text{light, } E = |p_z|c', q[0], q[1], 0, 0, [0.7071, 0.7071], { color: LIGHT }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, end: shell(END) };
	return finish(S, L, [240, 300]);
}
