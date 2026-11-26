// The tutorial, section 5.2 (tutorial/waves/retarded-waves.md), its first diagram: the backward light cone of a field
// point, and the pieces of a source that make the field there now. A spacetime sketch in units where c = 1: time t
// upward and one space direction x across, both at one scale, so that light in the plane of the page runs at 45
// degrees; a second space direction y, toward the viewer, is suggested by an oblique view in which a step y away from
// the viewer is drawn as a step K y upward, so that circles of constant time are ellipses of height K times their
// width. The source is a round region of radius R centred at x = -D, y = 0; in spacetime it is an upright cylinder,
// its world tube, drawn as a band in the neutral tint with an elliptical cap at its top and at its foot. The field
// point is at x = y = 0; its world line is the upright line on the right. At its present time, t = 0, a dot; from it
// the backward cone, the points from which light reaches the dot, t = -sqrt(x^2 + y^2): its edges, drawn as its
// section by the plane of the page (y = 0), are the two lines at 45 degrees, named "light: speed c"; its circle of
// constant time at t = -T, an ellipse, the near half solid and the far half dashed where it lies behind the cone's
// edges. Where the cone passes through the world tube, the part of its surface inside the tube is filled in a darker
// tint: the pieces of the source that count now. One piece in the plane of the page, y at x = -D, its dot on the
// cone's edge; a dashed line at its time t - |x - y|/c across to a double arrow beyond the cone, and a dotted line at
// the present time to the same arrow, which spans the delay |x - y|/c and is named so.
// Exact: the 45-degree edges (asserted on the page), the cone's ellipse and the tube's ellipses (the images of the
// circles, sampled every quarter of a point), the point where the dashed far half of the cone's ellipse goes behind
// the edges (sin theta = 2K/(1 + K^2), asserted), the dark patch (the image of the cone's surface inside the tube,
// its bounds found in closed form and asserted against a fine grid; the section y = 0 runs inside it), the piece on
// the edge and inside the tube, and the double arrow, as long on the page as the piece is far from the world line.
// Schematic: the oblique view (its K), the sizes D, R and T, and the true outline of the cone in this view, which is
// wider than its section by the factor 1/sqrt(1 - K^2) and is not drawn: the edges drawn are the section, in which
// every exact mark lies.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, LABEL_GAP, LINE, AXIS, AXIS_HEAD } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { DOT as POINT, ZERO_LINE, ZERO_DASH } from './tut-bessel-lib.js';
import { DASH } from './tut-vec-lib.js';
import { TINT } from './tut-gauss-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter } from './tut-ret-lib.js';

const name = 'tut-ret-cone';
const check = checker(name);

// ---- the geometry, in units where c = 1 --------------------------------------------------------------------------
const K = 0.2;                            // a step y away from the viewer is drawn K y upward
const D = 1, R = 0.35;                    // the source's centre, x = -D, and radius
const T = 1.7;                            // the cone is drawn down to t = -T
const TUBE = [-2.3, 0.42];                // the world tube's times, and the world line's
const PIECE = -D;                         // the piece y, at x = -D, y = 0, on the cone's left edge
const ARROW_X = 1.32;                     // the double arrow, at this x
const S_PT = 62;                          // points per unit
const EDGE_W = LINE;                      // the cone's edges
const TUBE_W = HAIR;                      // the tube's outline
const HEAD = 3.0;                         // the double arrow's heads (figs/tut-flow-column.js)

// the page: x across, t up, y drawn as K y up; (x, y, t) -> figure points
const OX = ORIGIN, OY = ORIGIN;
const at = ([x, y, t]) => [OX + S_PT * x, OY - S_PT * (t + K * y)];

/** Points of the circle of radius rho about (cx, 0) at the time t, from the angle a to b, no two more than a quarter
 * of a point apart on the page; theta = 0 along +x, theta = pi/2 away from the viewer (+y). */
function circle(cx, rho, t, a, b) {
	const n = Math.max(8, Math.ceil((Math.abs(b - a) * rho * S_PT) / 0.2));
	return Array.from({ length: n + 1 }, (_, i) => { const th = a + ((b - a) * i) / n; return at([cx + rho * Math.cos(th), rho * Math.sin(th), t]); });
}

/** The cone's surface inside the tube, seen on the page: for each x across the tube, the range of the page's drop
 * f(y) = sqrt(x^2 + y^2) - K y (in units, below the dot) over the tube's chord |y| <= h(x). f is convex in y, so its
 * largest value is at an end of the chord, and its least at y* = K|x|/sqrt(1 - K^2) when that is on the chord,
 * where it is |x| sqrt(1 - K^2). */
function patchRange(x) {
	const h = Math.sqrt(Math.max(0, R * R - (x + D) ** 2));
	const f = (y) => Math.hypot(x, y) - K * y;
	const ys = (K * Math.abs(x)) / Math.sqrt(1 - K * K);
	const lo = ys <= h ? Math.abs(x) * Math.sqrt(1 - K * K) : f(h);
	return { lo, hi: Math.max(f(-h), f(h)), h, f };
}

export default async function () {
	chapter(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the numbers of the geometry
	check(D + R < T && D - R > 0, 'the tube is not wholly inside the drawn cone, to the left of the world line');
	check(Math.abs(PIECE + D) <= R, 'the piece is not in the tube');
	// on the page the edges run at 45 degrees: equal steps across and down
	const apex = at([0, 0, 0]);
	for (const s of [-1, 1]) {
		const e = at([s * T, 0, -T]);
		check(near(Math.abs(e[0] - apex[0]), e[1] - apex[1], 1e-9), 'an edge is not at 45 degrees');
	}

	// ---- the world tube: the band with its two caps
	const xl = -D - R, xr = -D + R;
	const top = circle(-D, R, TUBE[1], 0, 2 * Math.PI), foot = circle(-D, R, TUBE[0], Math.PI, 2 * Math.PI);
	const footBack = circle(-D, R, TUBE[0], 0, Math.PI);
	{
		const upper = circle(-D, R, TUBE[1], Math.PI, 0);     // the far half of the top cap, left to right
		const outline = [...upper, at([xr, 0, TUBE[0]]), ...[...foot].reverse().slice(1), at([xl, 0, TUBE[1]])];
		S.fill(pathOf(outline), { l: at([xl, 0, 0])[0], r: at([xr, 0, 0])[0], t: upper[Math.floor(upper.length / 2)][1], b: foot[Math.floor(foot.length / 2)][1] }, { color: TINT, layer: 0, what: 'the tube', solid: false });
		check(longest(top) <= 0.25 && longest(foot) <= 0.25, 'the tube\'s caps are coarse');
		S.path(top, { color: DIM, width: TUBE_W, layer: 1, what: 'the tube\'s top' });
		S.path(foot, { color: DIM, width: TUBE_W, layer: 1, what: 'the tube\'s foot' });
		S.path(footBack, { color: DIM, width: TUBE_W, layer: 1, dash: DASH, cap: 'butt', what: 'the tube\'s foot, behind' });
		for (const x of [xl, xr]) S.path([at([x, 0, TUBE[0]]), at([x, 0, TUBE[1]])], { color: DIM, width: TUBE_W, layer: 1, cap: 'butt', what: `the tube's side at ${x}` });
	}

	// ---- the dark patch: the cone's surface inside the tube
	{
		const n = Math.ceil(((xr - xl) * S_PT) / 0.2);
		const xs = Array.from({ length: n + 1 }, (_, i) => xl + ((xr - xl) * i) / n);
		const upper = xs.map((x) => [OX + S_PT * x, OY + S_PT * patchRange(x).lo]);
		const lower = xs.map((x) => [OX + S_PT * x, OY + S_PT * patchRange(x).hi]).reverse();
		// the bounds, against a fine grid of the chord; the section y = 0 inside them
		for (let i = 0; i <= 200; i++) {
			const x = xl + ((xr - xl) * i) / 200, p = patchRange(x);
			let lo = Infinity, hi = -Infinity;
			for (let j = 0; j <= 2000; j++) { const v = p.f(-p.h + (2 * p.h * j) / 2000); lo = Math.min(lo, v); hi = Math.max(hi, v); }
			check(near(lo, p.lo, 1e-6) && near(hi, p.hi, 1e-12), `the patch's bounds at x = ${x}`);
			check(Math.abs(x) >= p.lo - 1e-12 && Math.abs(x) <= p.hi + 1e-12, 'the section y = 0 leaves the patch');
		}
		const ring = [...upper, ...lower];
		S.fill(pathOf(ring), { l: upper[0][0], r: upper[upper.length - 1][0], t: Math.min(...ring.map((q) => q[1])), b: Math.max(...ring.map((q) => q[1])) }, { color: RULE, layer: 0.5, what: 'the patch', solid: false });
		S.mark([...ring, ring[0]], 0, 'the patch');
		window[name + '-patch'] = { top: Math.min(...ring.map((q) => q[1])), bottom: Math.max(...ring.map((q) => q[1])) };
	}

	// ---- the field point's world line
	const wl0 = at([0, 0, TUBE[0]]), wl1 = at([0, 0, TUBE[1]]);
	S.path([wl0, wl1], { color: INK, width: LINE, layer: 2, cap: 'butt', what: 'the world line' });

	// ---- the cone: its two edges, its circle at t = -T
	const left = at([-T, 0, -T]), right = at([T, 0, -T]);
	S.path([apex, left], { color: INK, width: EDGE_W, layer: 3, cap: 'butt', what: 'the left edge' });
	S.path([apex, right], { color: INK, width: EDGE_W, layer: 3, cap: 'butt', what: 'the right edge' });
	const nearHalf = circle(0, T, -T, Math.PI, 2 * Math.PI);
	check(longest(nearHalf) <= 0.25, 'the cone\'s circle is coarse');
	S.path(nearHalf, { color: INK, width: EDGE_W, layer: 3, what: 'the cone\'s circle, in front' });
	// the far half goes behind the edges where on the page |x| = drop below the dot: cos(theta) = 1 - K sin(theta),
	// sin(theta) = 2K/(1 + K^2)
	const th1 = Math.asin((2 * K) / (1 + K * K));
	{
		const q = at([T * Math.cos(th1), T * Math.sin(th1), -T]);
		check(near(q[0] - apex[0], q[1] - apex[1], 1e-9), 'the far half does not meet the right edge at theta_1');
		const farHalf = circle(0, T, -T, th1, Math.PI - th1);
		for (const p of farHalf) check(Math.abs(p[0] - apex[0]) <= p[1] - apex[1] + 1e-9, 'the dashed far half leaves the cone\'s edges');
		S.path(farHalf, { color: INK, width: HAIR, layer: 2.5, dash: DASH, cap: 'butt', what: 'the cone\'s circle, behind' });
	}

	// ---- the piece y, the times, the double arrow
	const piece = at([PIECE, 0, PIECE]);   // on the left edge: x = -D at t = -D
	check(near(piece[0] - apex[0], -(piece[1] - apex[1]), 1e-9), 'the piece is not on the left edge');
	const ax = at([ARROW_X, 0, 0])[0];
	const then = piece[1];
	// the dashed line at the piece's time, from the piece to the arrow; the dotted line at the present
	S.path([[piece[0] + POINT + 0.6, then], [ax + 2.2, then]], { color: DIM, width: ZERO_LINE + 0.1, dash: ZERO_DASH, cap: 'butt', layer: 1.5, what: 'the time of the piece' });
	S.dots([apex[0] + POINT + 0.6, apex[1]], [ax + 2.2, apex[1]], { color: DIM, layer: 1.5, what: 'the present' });
	// the arrow's heads touch the two lines; it spans |x - y|/c, as long as the piece is far from the world line
	const a1 = S.arrow([ax, (apex[1] + then) / 2], [ax, apex[1] + ZERO_LINE / 2], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the delay' });
	const a2 = S.arrow([ax, (apex[1] + then) / 2], [ax, then - ZERO_LINE / 2], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the delay, down' });
	check(near(a1.L + a2.L + ZERO_LINE, apex[0] - piece[0], 1e-9), 'the double arrow is not as long as the piece is far');
	check(ARROW_X < T && at([ARROW_X, 0, -ARROW_X])[1] > then + 8, 'the arrow is not clear of the right edge');

	// ---- the dots
	for (const [p, what] of [[apex, 'the present'], [piece, 'the piece']]) {
		S.raw(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${POINT}" fill="${INK}"/>`, 4);
		S.mark([p], POINT, `the dot of ${what}`);
	}

	// ---- the labels
	L.push(await S.clear('(\\boldsymbol x, t)', apex[0] - LABEL_GAP - 1, apex[1] - 1.5, 1, 1, [0, -1], { color: INK }));
	const y = await S.clear('\\boldsymbol y', piece[0] - POINT - LABEL_GAP - 0.4, then - 1, 1, 1, [-0.6, -0.8], { color: INK });
	y.on = ['the tube'];
	L.push(y);
	L.push(await S.clear('|\\boldsymbol x - \\boldsymbol y|/c', ax + LABEL_GAP + 2.2, (apex[1] + then) / 2, 0, 0.5, [1, 0], { color: DIM }));
	{
		// beside the right edge, under the dashed line and over the cone's circle
		const q = at([1.1, 0, -1.1]);
		L.push(await S.clear('\\text{light: speed } c', q[0] + LABEL_GAP, q[1], 0, 0, [1, 0], { color: INK }));
	}
	L.push(await S.clear('\\text{source}', at([-D, 0, 0])[0], foot[Math.floor(foot.length / 2)][1] + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: DIM }));
	L.push(await S.clear('\\text{field point}', wl0[0], wl0[1] + LABEL_GAP + 0.6, 0.5, 0, [0, 1], { color: DIM }));
	{
		// time upward, at the left
		const x = at([-D - R - 0.42, 0, 0])[0];
		const t0 = at([0, 0, -1.9])[1], t1 = at([0, 0, -0.9])[1];
		S.arrow([x, t0], [x, t1], { color: DIM, width: AXIS, head: AXIS_HEAD, layer: 1, what: 'time' });
		L.push(await placed('t', x, t1 - LABEL_GAP - 0.3, 0.5, 1, DIM));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { K, D, R, T, th1, delay: -PIECE };
	return finish(S, L, [240, 340]);
}
