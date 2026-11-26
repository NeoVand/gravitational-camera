// The tutorial, section 8.3 (tutorial/quantum/quanta.md), its second diagram: one state per area 2 pi hbar. Chapter
// 1.7's phase plane in the scaled axes x / x_zp across and p / m omega x_zp up, so that the ellipses are circles: thin
// grey axes with ticks at 0, +-2 and +-4. The bands owned by the levels n = 0, 1, 2, 3, between the circles of radius
// 2 sqrt n and 2 sqrt(n + 1) in these units (the central disc of radius 2 for n = 0), shaded alternately lighter and
// light grey with no outline (the outermost band light, so that its edge shows against the page). On each band, the classical orbit of its level, the circle of radius sqrt(2(2n + 1))
// at the energy (n + 1/2) hbar omega, as a thin ink line. Each band labelled outside the drawing, "n = 0" to "n = 3";
// "area 2 pi hbar" once, for the n = 1 band; the n = 0 orbit labelled "encloses pi hbar". Ink and the page's neutral
// greys only; no orange or blue.
// Departures from the diagram's comment: the axes run along the drawing's left and bottom edges, not through its
// centre, so that their numbers stay off the bands and the circles; the band labels sit at the right, each joined to
// its band by a thin horizontal leader that starts at a small dot between the band's orbit and its outer edge, and
// "area 2 pi hbar" sits above the drawing, joined to the n = 1 band by a vertical leader; "encloses pi hbar" is set
// inside the ground orbit, which is the area it names. The caption's "each halfway across its band" is said as "each
// dividing its band's area in half": the orbit of radius sqrt(4n + 2) halves the band's area (r^2 is the mean of 4n
// and 4n + 4), not its width (the ground orbit, sqrt 2, is 71% of the way out to the disc's edge, 2).
// Exact: every circle (radius 2 sqrt n, 2 sqrt(n + 1) and sqrt(2(2n + 1)) on one scale, sampled every quarter of a
// point), and with them the areas the caption names (asserted in tut-quanta-lib.js: each band 2 pi hbar, the ground
// orbit pi hbar, each orbit halving its band). Chosen for the drawing: the scale, the leaders' heights.
import { Sheet, ORIGIN, finish, checker, placed, AXIS, HAIR, TICK, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { Plot, xAxis, yAxis } from './tut-prob-lib.js';
import { longest } from './tut-fourier-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter, palette, near, BANDS, edges, orbit, areaInHbar } from './tut-quanta-lib.js';

const name = 'tut-phase-rings';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const U = 22;                            // points per scaled unit, on both axes
const FRAME = 4.6;                       // the axes at u = -4.6 and w = -4.6
const ORBIT_W = 0.55;                    // an orbit's stroke
const SHADE = [0.2, 0.42];               // the bands' opacities of the rule's grey: lighter (n even), light (n odd)
const LEADER_END = 4.35;                 // the leaders end at u = 4.35 (the right) or w = 4.35 (above)
const HEIGHTS = [-1.3, 0.1, 1.5, 2.9];   // the band labels' leaders, w for n = 0 to 3
const AREA_U = -1.2;                     // the "area" leader's u
const ANCHOR = 0.8;                      // a leader's dot

export default async function () {
	await chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const R = FRAME * U;
	const P = new Plot({ left: ORIGIN - R, top: ORIGIN - R, w: 2 * R, h: 2 * R, x0: -FRAME, x1: FRAME, y0: -FRAME, y1: FRAME });
	const C = P.at(0, 0);
	check(near(P.X(1) - P.X(0), P.Y(0) - P.Y(1), 1e-12), 'the two axes have different scales: the circles would not be round');
	const circle = (r) => {
		const n = Math.max(64, Math.ceil((2 * Math.PI * r * U) / 0.25));
		return Array.from({ length: n }, (_, i) => [C[0] + r * U * Math.cos((2 * Math.PI * i) / n), C[1] - r * U * Math.sin((2 * Math.PI * i) / n)]);
	};
	const arcs = (r) => `M${n2(C[0] + r * U)},${n2(C[1])}A${n2(r * U)},${n2(r * U)} 0 1 0 ${n2(C[0] - r * U)},${n2(C[1])}A${n2(r * U)},${n2(r * U)} 0 1 0 ${n2(C[0] + r * U)},${n2(C[1])}Z`;

	// ---- the bands, alternately light and lighter, with no outline
	for (const n of BANDS) {
		const [a, b] = edges(n);
		check(near(areaInHbar(Math.PI * (b * b - a * a)), 2 * Math.PI, 1e-14), `the band ${n} is not 2 pi hbar`);
		const d = arcs(b) + (a > 0 ? arcs(a) : '');
		S.raw(`<path d="${d}" fill="${RULE}" fill-opacity="${SHADE[n % 2]}" fill-rule="evenodd"/>`, 0.5);
	}
	// ---- the orbits
	for (const n of BANDS) {
		const r = orbit(n), pts = circle(r);
		check(longest([...pts, pts[0]]) <= 0.2501, `the orbit ${n} has a step of ${longest(pts)} pt`);
		const [a, b] = edges(n);
		check(a < r && r < b && near(r * r - a * a, b * b - r * r, 1e-12), `the orbit ${n} does not halve its band`);
		S.raw(`<circle cx="${n2(C[0])}" cy="${n2(C[1])}" r="${n2(r * U)}" fill="none" stroke="${INK}" stroke-width="${ORBIT_W}"/>`, 2);
		S.mark([...pts, pts[0]], ORBIT_W / 2, `the orbit ${n}`);
	}

	// ---- the axes, along the left and bottom edges
	const ticks = [-4, -2, 0, 2, 4], fmt = (t) => (t < 0 ? `-${-t}` : `${t}`);
	L.push(...(await xAxis(S, P, { ticks, fmt, y: P.Y(-FRAME), what: 'the u axis' })));
	L.push(...(await yAxis(S, P, { ticks, fmt, x: P.X(-FRAME), what: 'the w axis' })));
	L.push(await placed('x/x_{\\rm zp}', P.right + LABEL_GAP + 0.6, P.bottom, 0, 0.5, DIM));
	L.push(await placed('p/(m\\omega x_{\\rm zp})', P.left, P.top - LABEL_GAP - 0.6, 0.5, 1, DIM));

	// ---- the labels: each band's at the right, on a leader from a dot between its orbit and its outer edge
	const dot = (q, what) => {
		S.raw(`<circle cx="${n2(q[0])}" cy="${n2(q[1])}" r="${ANCHOR}" fill="${INK}"/>`, 3);
		S.mark([q], ANCHOR, what);
	};
	for (const n of BANDS) {
		const rho = (orbit(n) + edges(n)[1]) / 2, h = HEIGHTS[n];
		const u = Math.sqrt(rho * rho - h * h);
		const q = P.at(u, h), end = P.at(LEADER_END, h);
		check(near(Math.hypot(u, h), rho, 1e-12) && LEADER_END > edges(BANDS.length - 1)[1], `the leader of ${n} does not start in its band`);
		S.path([q, end], { color: DIM, width: HAIR, layer: 2.5, cap: 'butt', what: `the leader of ${n}` });
		dot(q, `the dot of ${n}`);
		L.push(await placed(`n = ${n}`, end[0] + LABEL_GAP + 0.3, end[1], 0, 0.5, INK));
	}
	{
		const rho = (orbit(1) + edges(1)[1]) / 2, w = Math.sqrt(rho * rho - AREA_U * AREA_U);
		const q = P.at(AREA_U, w), end = P.at(AREA_U, LEADER_END);
		S.path([q, end], { color: DIM, width: HAIR, layer: 2.5, cap: 'butt', what: 'the area\'s leader' });
		dot(q, 'the area\'s dot');
		L.push(await placed('\\text{area }2\\pi\\hbar', end[0], end[1] - LABEL_GAP - 0.3, 0.5, 1, INK));
	}
	check(near(areaInHbar(Math.PI * orbit(0) ** 2), Math.PI, 1e-14), 'the ground orbit does not enclose pi hbar');
	L.push(await placed('\\text{encloses }\\pi\\hbar', C[0], C[1], 0.5, 0.5, INK));

	S.checkAll(L);
	window[name + '-numbers'] = { edges: BANDS.map(edges), orbits: BANDS.map(orbit) };
	return finish(S, L, [220, 290]);
}
