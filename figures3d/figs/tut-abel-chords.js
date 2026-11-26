// The tutorial, section 5.6 (tutorial/waves/abel-transform.md), its first diagram: from the surface of a round planet
// each line of sight is a chord. The planet in section, a circle of radius R, with three filled discs inside it drawn
// to the paper's Earth: the inner core (1222 km), the core (3480 km) and the lower mantle (5701 km) of R = 6371 km, in
// the paper's fig:earth-glow shell colours mixed with the page; the ring between 5701 km and R, the upper mantle and
// the crust, in the upper mantle's. The camera, a small ink triangle on the circle's top, named "camera", and C; a
// dashed line from it to the centre O, named "straight down", with R beside it. Three lines of sight from C, each
// running to its exit point, at 11.1, 33.1 and 63.5 degrees from straight down, each tangent to one disc. On the
// 33.1 degree line: the dotted perpendicular from O, its foot M with a right-angle mark, named b = R sin theta; the
// angle theta, an arc at the camera; a dot on the chord halfway from M to the exit point, the segment from O to it
// named r and the stretch of the chord from M to it named s.
// Departures from the diagram's comment: the camera stands on the surface, so each line of sight is its chord from C
// to the exit point, all of it drawn in the heavier stroke; the comment's thin line "across the whole planet" and its
// heavier chord "inside the circle" are the same segment. The name b = R sin theta stands under OM, inside the
// triangle OMC's neighbour OMD, since over OM the line at 11.1 degrees leaves no room for it. The scene is drawn at
// half a point per site pixel of the comment (the site shows a point as 1.9 of its pixels), so that the planet's radius
// is 120 points.
// Exact: the discs' radii, 120 r/R points (asserted, 46, 131 and 215 site pixels), the lines' angles arcsin(r/R)
// (asserted 11.1, 33.1 and 63.5 degrees), each line's distance from O equal to its disc's radius (asserted: tangent),
// its exit point on the circle (asserted), M the foot of the perpendicular (asserted at right angles and R sin theta
// from O), the dot halfway from M to the exit point and r^2 = b^2 + s^2 there (asserted). Schematic: the camera's
// glyph, and the crust, 25 km, which at this scale would be a quarter of a point and is drawn with the upper mantle.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, HAIR, LINE, RIGHT, LABEL_GAP, DOT, DOT_STEP } from './tut-pot-lib.js';
import { pathOf } from './tut-prob-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, BOUNDARIES, EARTH, PAPER_SHELLS, shellFill, DASH } from './tut-abel-lib.js';

const name = 'tut-abel-chords';
const check = checker(name);

const K = 0.5;                             // points per site pixel
const R = 240 * K;                         // the planet's radius, points
const CHORD = 0.7;                         // a line of sight, inside the planet
const MARK = 1.05;                         // the dot on the chord, radius
const CAM = { h: 6.2, w: 6.4 };            // the camera: a triangle, its apex on C, pointing down
const ARC = 30;                            // the angle's arc, points from C
const SHOWN = 1;                           // the line whose geometry is drawn: the core's, 33.1 degrees

export default async function () {
	const nums = chapter(check);
	const S = new Sheet(name);
	const L = [];
	const O = [ORIGIN, ORIGIN];
	// world (x right, y up, R = 1) to the page
	const P = ([x, y]) => [O[0] + R * x, O[1] - R * y];
	const circle = (r, n = 720) => Array.from({ length: n + 1 }, (_, k) => P([r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n)]));
	const radii = BOUNDARIES.map(({ r }) => r / EARTH);
	radii.forEach((r, k) => check(near(R * r, K * nums.discs[k], 1e-12), `disc ${k} is not 240 r/R site pixels`));

	// ---- the shells: fills from the outside in, then the boundaries over them
	const fills = [PAPER_SHELLS.upper, PAPER_SHELLS.lower, PAPER_SHELLS.outer, PAPER_SHELLS.inner];
	[1, ...[...radii].reverse()].forEach((r, k) => S.raw(`<path d="${pathOf(circle(r))}" fill="${shellFill(fills[k])}"/>`, 0.1 + 0.01 * k));
	radii.forEach((r, k) => S.path(circle(r), { color: DIM, width: HAIR, layer: 0.5, what: `the ${BOUNDARIES[k].key}'s boundary` }));
	S.path(circle(1), { color: INK, width: LINE, layer: 0.6, what: 'the surface' });

	// ---- straight down: dashed from C to O
	const C = [0, 1];
	S.path([P(C), P([0, 0])], { color: DIM, width: HAIR, dash: DASH, layer: 1, cap: 'butt', what: 'straight down' });
	S.raw(`<circle cx="${n2(O[0])}" cy="${n2(O[1])}" r="${MARK}" fill="${INK}"/>`, 3);
	S.mark([O], MARK, 'the centre');

	// ---- the three lines of sight, each from C to its exit point, tangent to its disc
	const lines = radii.map((r, k) => {
		const t = (nums.angles[k] * Math.PI) / 180;
		const d = [Math.sin(t), -Math.cos(t)];
		const half = Math.cos(t);                              // half the chord, R cos theta
		const M = [C[0] + d[0] * half, C[1] + d[1] * half];
		const E = [C[0] + d[0] * 2 * half, C[1] + d[1] * 2 * half];
		check(near(Math.hypot(...E), 1, 1e-14), `line ${k} does not end on the surface`);
		check(near(Math.hypot(...M), r, 1e-14) && near(Math.hypot(...M), Math.sin(t), 1e-14), `line ${k} is not tangent to its disc`);
		check(near(M[0] * d[0] + M[1] * d[1], 0, 1e-14), `OM is not at right angles to line ${k}`);
		S.path([P(C), P(E)], { color: INK, width: CHORD, layer: 2, cap: 'butt', what: `the line at ${nums.angles[k].toFixed(1)}` });
		return { t, d, M, E, half };
	});

	// ---- the camera: a small ink triangle over C, its apex on the surface
	{
		const [x, y] = P(C);
		const tri = [[x, y], [x - CAM.w / 2, y - CAM.h], [x + CAM.w / 2, y - CAM.h]];
		S.fill(pathOf(tri), { l: x - CAM.w / 2, r: x + CAM.w / 2, t: y - CAM.h, b: y }, { color: INK, layer: 4, what: 'the camera' });
	}

	// ---- the geometry of one line: M, the perpendicular, the right angle, the dot, r and s, the angle theta
	const { t, d, M, E } = lines[SHOWN];
	const b = Math.sin(t);
	const D = [(M[0] + E[0]) / 2, (M[1] + E[1]) / 2];
	const s = Math.hypot(D[0] - M[0], D[1] - M[1]), r = Math.hypot(...D);
	check(near(r * r, b * b + s * s, 1e-14) && near(s, Math.cos(t) / 2, 1e-14), 'r^2 = b^2 + s^2 at the dot');
	S.dots(P([0, 0]), P(M), { color: DIM, clear0: MARK + 0.6, what: 'the perpendicular OM' });
	S.path([P([0, 0]), P(D)], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: 'the segment r' });
	S.raw(`<circle cx="${n2(P(D)[0])}" cy="${n2(P(D)[1])}" r="${MARK}" fill="${INK}"/>`, 3);
	S.mark([P(D)], MARK, 'the dot');
	{
		// the right angle at M, between MO and MD, so on the side away from C
		const m = P(M), toO = [-M[0] / b, M[1] / b], along = [d[0], -d[1]];
		check(near(toO[0] * along[0] + toO[1] * along[1], 0, 1e-12), 'the right-angle mark is not square');
		const q0 = [m[0] + toO[0] * RIGHT, m[1] + toO[1] * RIGHT], q2 = [m[0] + along[0] * RIGHT, m[1] + along[1] * RIGHT];
		S.path([q0, [q0[0] + along[0] * RIGHT, q0[1] + along[1] * RIGHT], q2], { color: INK, width: HAIR, layer: 3, cap: 'butt', what: 'the right-angle mark' });
	}
	{
		// theta: an arc about C from straight down to the line
		const c = P(C);
		const arc = Array.from({ length: 121 }, (_, j) => { const g = (t * j) / 120; return [c[0] + ARC * Math.sin(g), c[1] + ARC * Math.cos(g)]; });
		S.path(arc, { color: DIM, width: HAIR, layer: 1, what: 'the angle' });
		// its name inside the wedge between the 11.1 and 33.1 degree lines, beyond the arc
		const g = (lines[0].t + t) / 2, u = [Math.sin(g), Math.cos(g)];
		L.push(await S.clear('\\theta', c[0] + u[0] * (ARC + 3), c[1] + u[1] * (ARC + 3), 0.5, 0.5, u, { color: INK }));
	}

	// ---- the names
	const c = P(C), m = P(M), o = P([0, 0]), dd = P(D);
	const outward = [M[0] / b, -M[1] / b];                         // page direction from O through M
	L.push(await S.clear('M', m[0] + outward[0] * (LABEL_GAP + 3.5), m[1] + outward[1] * (LABEL_GAP + 3.5), 0.5, 0.5, outward, { color: INK }));
	// C and "camera" on either side of the glyph, on one baseline just over the surface
	const base = c[1] - LABEL_GAP - 0.8;
	L.push(await S.clear('C', c[0] + CAM.w / 2 + LABEL_GAP + 0.5, base, 0, 1, [1, 0], { color: INK }));
	L.push(await S.clear('\\text{camera}', c[0] - CAM.w / 2 - LABEL_GAP - 0.5, base, 1, 1, [-1, 0], { color: INK }));
	L.push(await S.clear('O', o[0] - LABEL_GAP - 1, o[1] + 1, 1, 0, [-1, 0], { color: INK }));
	// R in the core's band and "straight down" in the lower mantle's, left of the dashed line, clear of the boundaries
	L.push(await S.clear('R', o[0] - LABEL_GAP - 0.5, P([0, 0.38])[1], 1, 0.5, [-1, 0], { color: INK }));
	L.push(await S.clear('\\text{straight down}', o[0] - LABEL_GAP - 0.5, P([0, 0.72])[1], 1, 0.5, [-1, 0], { color: DIM }));
	// b under the middle of OM, in the triangle OMD (over OM the line at 11.1 degrees and the core's boundary leave no
	// room); b = R sin theta under the planet
	{
		const mid = [(o[0] + m[0]) / 2, (o[1] + m[1]) / 2], side = [outward[1] < 0 ? -outward[1] : outward[1], Math.abs(outward[0])];
		L.push(await S.clear('b', mid[0] + side[0] * (LABEL_GAP + 3), mid[1] + side[1] * (LABEL_GAP + 3), 0.5, 0.5, side, { color: INK }));
		L.push(await placed('b = R\\sin\\theta', o[0], o[1] + R + 7, 0.5, 0, INK));
	}
	// r under the middle of OD; s beside the middle of MD, on the side away from O
	{
		const mid = [(o[0] + dd[0]) / 2, (o[1] + dd[1]) / 2];
		L.push(await S.clear('r', mid[0], mid[1] + LABEL_GAP + 0.5, 0.5, 0, [0, 1], { color: INK }));
		const ms = [(m[0] + dd[0]) / 2, (m[1] + dd[1]) / 2];
		L.push(await S.clear('s', ms[0] + outward[0] * (LABEL_GAP + 2), ms[1] + outward[1] * (LABEL_GAP + 2), 0.5, 0.5, outward, { color: INK }));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums, b, s, r };
	return finish(S, L, [240, 340]);
}
