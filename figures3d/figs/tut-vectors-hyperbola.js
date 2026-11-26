// The tutorial, section 6.2 (tutorial/relativity/spacetime-vectors.md), its second diagram: two four-velocities on
// the hyperbola u.u = -c^2, and the pixel's "now" as the mirror image of its four-velocity across the light line. One
// panel, units of c at one scale on both axes, so that light runs at 45 degrees: u^1 across from -0.4 to 2.0 and u^0
// upward from 0 to 2.0, thin ink, named "u^1/c" and "u^0/c" at their ends, with the number 1 on each. The light line
// u^0 = u^1, thin and dashed in the light role's colour, named "light". The upper branch of the hyperbola
// -(u^0)^2 + (u^1)^2 = -1 for u^1 from 0 to 1.7, a thin ink line, named "u.u = -c^2" near its upper end, off the
// curve. Two arrows from the origin in the observer's colour, each ending on the hyperbola: to (0, 1), named
// "at rest", and to (0.75, 1.25), named "0.6c". Each observer's now as a thin dashed line through the origin in the
// observer's colour: along the u^1 axis for the observer at rest, and along (u^1, u^0) = (1.25, 0.75) for the pixel,
// named "now at 0.6c". A faint dotted segment from (0.75, 1.25) to (1.25, 0.75), at right angles to the light line,
// shows the mirror.
// Departures from the diagram's comment: the axes carry the number 1, as section 6.1's hyperbola does, so that the
// units of c can be read; at u^0 = 1 the number stands without its tick, since the arrow "at rest" ends there and its
// point would hide a tick (6.1 does the same). The observer at rest's now runs along the u^1 axis and stops short of
// the axis's head. The panel is drawn at 95 points to c (228 points for the 2.4 across, about the comment's 520 site
// pixels at 1.9 pixels to the point, less the room the names take).
// Exact: the light line at 45 degrees on the page (asserted), the hyperbola (sampled so that no two neighbouring points
// are more than a quarter of a point apart, every point asserted on it), the arrows' ends on it, the pixel's now
// (u.a = 0, asserted in tut-vectors-lib.js) and the mirror segment (at right angles to the light line on the page,
// its middle on it, asserted). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, VEC, VEC_HEAD, LINE, HAIR, TICK } from './tut-pot-lib.js';
import { Plot, NUM } from './tut-prob-lib.js';
import { graph, longest, THIN } from './tut-fourier-lib.js';
import { dashed } from './tut-orb-lib.js';
import { DASH } from './tut-bessel-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, palette, OBS, LIGHT, U_REST, U_PIXEL, NOW_PIXEL, dot } from './tut-vectors-lib.js';

const name = 'tut-vectors-hyperbola';
const check = checker(name);

const U = 95;                              // points per unit of c
const X0 = -0.4, X1 = 2.0, TOP = 2.0;      // the axes
const END = 1.7;                           // the hyperbola runs from u^1 = 0 to END
const MIRROR_CLEAR = 2.2;                  // the mirror's dots start this far from the arrow's point

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const P = new Plot({ left: ORIGIN - ((X1 - X0) * U) / 2, top: ORIGIN - (TOP * U) / 2, w: (X1 - X0) * U, h: TOP * U, x0: X0, x1: X1, y0: 0, y1: TOP });
	const at = ([u1, u0]) => P.at(u1, u0);
	const o = at([0, 0]);
	const h = (u1) => Math.sqrt(1 + u1 * u1);

	// ---- the axes, with the number 1 on each
	const xA = S.arrow(at([X0, 0]), at([X1, 0]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the u1 axis' });
	const tA = S.arrow(o, at([0, TOP]), { color: INK, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'the u0 axis' });
	{
		const [x, y] = at([1, 0]);
		S.path([[x, y], [x, y + TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'the u1 tick at 1' });
		L.push(await placed('1', x, y + TICK + NUM, 0.5, 0, DIM));
		// at u0 = 1 the arrow "at rest" ends, and a tick would show as a stub beside its point: the number alone
		const [u, v] = at([0, 1]);
		L.push(await placed('1', u - TICK - NUM, v, 1, 0.5, DIM));
	}
	L.push(await placed('u^1/c', xA.B[0] + LABEL_GAP + 1.2, xA.B[1], 0, 0.5, INK));
	L.push(await placed('u^0/c', tA.B[0], tA.B[1] - LABEL_GAP - 1.2, 0.5, 1, INK));

	// ---- the light line, u0 = u1, at 45 degrees on the page
	{
		const a = o, b = at([TOP, TOP]);
		check(near(b[0] - a[0], a[1] - b[1], 1e-9), 'the light line is not at 45 degrees');
		dashed(S, a, b, { color: LIGHT, width: THIN, dash: DASH, layer: 0.5, what: 'the light line' });
	}

	// ---- the hyperbola u.u = -c^2, from u1 = 0 to END
	check(h(END) < TOP && h(END).toFixed(2) === '1.97', `the hyperbola's end at ${h(END)}`);
	const curve = graph(P, h, 0, END);
	check(longest(curve) <= 0.2501, 'the hyperbola is coarse');
	for (const [px, py] of curve) {
		const u1 = (px - P.left) / U + X0, u0 = (P.bottom - py) / U;
		check(near(dot([u0, u1], [u0, u1]), -1, 1e-9), 'a point of the hyperbola is off it');
	}
	S.path(curve, { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the hyperbola' });

	// ---- the nows: along the u1 axis at rest (short of the axis's head), along (1.25, 0.75) at 0.6c to the panel's edge
	const nowEnd = at([X1, (X1 * NOW_PIXEL[1]) / NOW_PIXEL[0]]);
	check(near((X1 * NOW_PIXEL[1]) / NOW_PIXEL[0], 1.2, 1e-15), 'the pixel\'s now does not reach (2.0, 1.2)');
	dashed(S, at([X0, 0]), [xA.B[0] - AXIS_HEAD - 1, xA.B[1]], { color: OBS, width: THIN, dash: DASH, layer: 1.2, what: 'the now at rest' });
	dashed(S, o, nowEnd, { color: OBS, width: THIN, dash: DASH, layer: 1.2, what: 'the now at 0.6c' });

	// ---- the four-velocities, each ending on the hyperbola
	for (const u of [U_REST, U_PIXEL]) check(near(h(u[0]), u[1], 1e-14), `the arrow to ${u} does not end on the hyperbola`);
	const rest = S.arrow(o, at(U_REST), { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow at rest' });
	const pix = S.arrow(o, at(U_PIXEL), { color: OBS, width: VEC, head: VEC_HEAD, layer: 3, what: 'the arrow at 0.6c' });

	// ---- the mirror: from u's point to the now's point (1.25, 0.75), at right angles to the light line
	{
		const a = at(U_PIXEL), b = at(NOW_PIXEL), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], mid = at([1, 1]);
		// the light line runs along (1, -1) on the page (y down)
		check(near((b[0] - a[0]) * 1 + (b[1] - a[1]) * -1, 0, 1e-9), 'the mirror is not at right angles to the light line');
		check(near(m[0], mid[0], 1e-9) && near(m[1], mid[1], 1e-9), 'the mirror\'s middle is not on the light line');
		S.dots(a, b, { color: FAINT, clear0: MIRROR_CLEAR, layer: 1.6, what: 'the mirror' });
	}

	// ---- the names
	{
		// "at rest" to the right of its point, over the curve's flat top; "0.6c" up and to the left of its point
		L.push(await S.clear('\\text{at rest}', rest.B[0] + LABEL_GAP + 1, rest.B[1] - 1, 0, 1, [0.3, -0.95], { color: OBS }));
		L.push(await S.clear('0.6c', pix.B[0] - 2, pix.B[1] - 2, 1, 1, [-0.6, -0.8], { color: OBS, gap: 3.6 }));
		// the now's name under its end; "light" to the right of the light line, high up
		L.push(await S.clear('\\text{now at } 0.6c', nowEnd[0], nowEnd[1] + LABEL_GAP + 1, 1, 0, [0, 1], { color: OBS }));
		const q = at([1.78, 1.78]);
		L.push(await S.clear('\\text{light}', q[0] + 3, q[1], 0, 0.5, [1, 0], { color: LIGHT }));
		// the equation to the left of the curve's upper end
		const [ex, ey] = at([END, h(END)]);
		L.push(await S.clear('u\\cdot u = -c^2', ex - 6, ey - 1, 1, 1, [-1, 0], { color: INK }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, end: h(END) };
	return finish(S, L, [240, 340]);
}
