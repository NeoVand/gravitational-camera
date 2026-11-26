// The tutorial, section 6.5 (tutorial/relativity/stress-energy.md), its first diagram: the sign of the momentum flux.
// Two panels, "gas at rest" over "stretched rod". Above, a small cube in a light oblique projection, faint, inside a
// field of faint dots (the gas); on each of its three visible faces a short thick arrow in matter's colour points out
// along the face's normal, one named "momentum out", and "T^xx = +p" stands under the panel. Below, a horizontal rod
// with a short segment of it drawn as the same cube; at the cube's two end faces (normal along x) arrows in matter's
// colour point inward, toward the cube, named "momentum along +x flows toward -x" once, and small grey arrows at the
// rod's two far ends pull outward, named "tension tau"; "T^xx = -tau" stands under the panel. The faces along the
// rod's sides carry no arrows.
// Departures from the diagram's comment: on the site the panels are stacked at every width, so that the figure stays
// narrow and its text large on a phone (a drawing is shown at most 1.9 site pixels to the point and shrinks with a
// narrower column); the printed book (figureLayout 'book') sets them side by side, the gas at the left, the two titles
// on one line, the two cubes level and the two laws on one line, the rod 112 points long rather than 132 so that the
// pair fits the text width. The gas's dots fade out over 20 points at the edges of their field (an opacity falling
// smoothly to nothing, in six steps), so that the gas has no hard border. The arrows at the rod's end faces stand outside the cube, on the rod's axis, their heads at the faces'
// centres, so that they read as momentum crossing each face inward, as the gas's arrows start at its faces' centres
// and leave them. The arrow on the gas cube's front face points at the reader, along the projection's receding
// edges; all three of the gas's arrows have one length on the page, so that the front one clears its face. The rod's
// three visible faces carry a pale tint of the page and its edges are lighter than the cube's, so that it reads as one
// bar with the cube marked on it; the tension's arrows start just outside the rod's outline, level with its axis. The
// inward arrow's name stands in two lines under the rod, below that arrow.
// Exact: the cube's edges (a cabinet projection, the receding edges at 30 degrees and half length; the same cube in
// both panels, asserted), each arrow along its face's outward normal and starting at its centre (gas), or ending at
// it and pointing inward (rod) (asserted), no arrow on the rod's side faces; the signs +p and -tau (asserted in
// tut-stress-lib.js against section 4.3's stress). Schematic: the arrows' lengths, the dots.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, VEC, VEC_HEAD, HAIR } from './tut-pot-lib.js';
import { INK, DIM, FAINT, RULE } from '../lib.js';
import { TINT } from './tut-gauss-lib.js';
import { chapter, palette, MATTER, oblique, lines, flux } from './tut-stress-lib.js';

const name = 'tut-stress-flow-sign';
const check = checker(name);

const A = 40;                              // the cube's side, points (units of the projection)
const ANGLE = 30, K = 0.5;                 // the receding edges' angle and shortening
const OUT = 32;                            // the gas's arrows, page length
const IN = 30;                             // the rod's inward arrows, page length
const THICK = 1.05, THICK_HEAD = 5;        // "a short thick arrow"
const ROD = globalThis.figureLayout === 'book' ? 56 : 66;   // the rod's half length, points along x (the book's shorter)
const PULL = 20;                           // the tension's arrows
const AIR = 1.6;                           // between the rod's outline and a tension's arrow
const EDGE = 0.45;                         // the cube's edges
const DOT_R = 0.55, DOT_STEP = 8.2;        // the gas's dots: radius and spacing
const ROW = 6;                             // a title to its panel's ink
const GAP = 16;                            // the upper panel's ink to the lower panel's title
const BOOK = globalThis.figureLayout === 'book';
const BESIDE = 22;                         // the book's: the gas panel's ink to the rod panel's title
const FADE = 20;                           // the gas's dots fade out over this width at the field's edges, points
const LEVELS = 6;                          // the fade's steps of opacity

/** A pseudo-random number in [0, 1) from two integers (fixed, so the dots do not move between renders). */
const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };

/** The nine visible edges of the box [x0, x1] x [y0, y1] x [w0, w1] in the cabinet projection pr (front, top and
 * right faces seen). */
function boxEdges(pr, [x0, x1], [y0, y1], [w0, w1]) {
	const p = (x, y, w) => pr([x, y, w]);
	return [
		[p(x0, y0, w0), p(x1, y0, w0)], [p(x1, y0, w0), p(x1, y1, w0)], [p(x1, y1, w0), p(x0, y1, w0)], [p(x0, y1, w0), p(x0, y0, w0)],
		[p(x0, y1, w0), p(x0, y1, w1)], [p(x1, y1, w0), p(x1, y1, w1)], [p(x0, y1, w1), p(x1, y1, w1)],
		[p(x1, y0, w0), p(x1, y0, w1)], [p(x1, y0, w1), p(x1, y1, w1)]
	];
}

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const left = BOOK ? 40 : ORIGIN - 120;              // (the book's two panels need the provisional page's width)
	const c = Math.cos((ANGLE * Math.PI) / 180) * K, s = Math.sin((ANGLE * Math.PI) / 180) * K;
	const toward = [-c / K, s / K];                    // the page direction of the normal toward the reader (unit)

	// ================= gas at rest =================
	const t1 = await placed('\\text{gas at rest}', left, ORIGIN - 200, 0, 0, INK);
	L.push(t1);
	// the cube [0, A]^3, its front face's lower left corner at o1
	const o1 = [left + (BOOK ? 62 : 80), t1.box.b + ROW + OUT + A * (1 + s) + 6];
	const g = oblique(o1, 1, ANGLE, K);
	const cube1 = boxEdges(g, [0, A], [0, A], [0, A]);
	cube1.forEach(([a, b], k) => S.path([a, b], { color: DIM, width: EDGE, layer: 1, cap: 'round', what: `the gas cube's edge ${k}` }));
	// the arrows: from each visible face's centre, out along its normal, one length on the page
	const faces = [
		{ key: 'x', centre: [A, A / 2, A / 2], n: [1, 0] },          // the right face, normal +x
		{ key: 'y', centre: [A / 2, A, A / 2], n: [0, -1] },         // the top face, normal +y
		{ key: 'front', centre: [A / 2, A / 2, 0], n: toward }       // the front face, normal toward the reader
	];
	const out = {};
	for (const f of faces) {
		const a = g(f.centre), b = [a[0] + f.n[0] * OUT, a[1] + f.n[1] * OUT];
		out[f.key] = S.arrow(a, b, { color: MATTER, width: THICK, head: THICK_HEAD, layer: 3, what: `the arrow out of the ${f.key} face` });
	}
	// outward: the page directions of +x, +y and -w (toward the reader), and the front arrow runs along the receding
	// edges, the other way, and leaves its face
	{
		const d = (p, q) => { const a = g(p), b = g(q), l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
		const ex = d([0, 0, 0], [1, 0, 0]), ey = d([0, 0, 0], [0, 1, 0]), ew = d([0, 0, 0], [0, 0, 1]);
		check(near(out.x.u[0], ex[0]) && near(out.x.u[1], ex[1]) && near(out.y.u[0], ey[0]) && near(out.y.u[1], ey[1]), 'the right and top arrows are not along +x and +y');
		check(near(out.front.u[0], -ew[0]) && near(out.front.u[1], -ew[1]), 'the front arrow is not toward the reader');
		const tip = out.front.B, front = [g([0, 0, 0]), g([A, A, 0])];
		check(tip[0] < front[0][0] - 4, 'the front arrow does not clear its face');
		check(front[1][1] < tip[1] && tip[1] < front[0][1], 'the front arrow leaves its face by the bottom');
	}
	L.push(await placed('\\text{momentum out}', out.x.B[0] + LABEL_GAP + 0.8, out.x.B[1], 0, 0.5, MATTER));
	// the panel's line
	check(flux(+1) === +1, 'a pressure is a positive flux');
	const inkBottom1 = Math.max(...S.marks.flatMap((m) => m.pts.map((p) => p[1] + m.r)));
	const law1 = await placed('T^{xx} = +p', g([A / 2, 0, 0])[0] + 10, inkBottom1 + 9, 0.5, 0, INK);
	L.push(law1);

	// ================= stretched rod =================
	// on the site under the gas; in the book at its right, the two titles on one line and the two cubes level
	const gasRight = Math.max(...L.map((l) => l.box.r), ...S.marks.flatMap((m) => m.pts.map((p) => p[0] + m.r)));
	const left2 = BOOK ? gasRight + BESIDE : left;
	const t2 = await placed('\\text{stretched rod}', left2, BOOK ? t1.box.t : law1.box.b + GAP, 0, 0, INK);
	L.push(t2);
	// the rod [-ROD, ROD] x [0, A] x [0, A], the cube its segment [-A/2, A/2]
	const o2 = BOOK ? [left2 + ROD + PULL + AIR + 2, o1[1]] : [ORIGIN - 10, t2.box.b + ROW + A * (1 + s) + 10];
	const r = oblique(o2, 1, ANGLE, K);
	boxEdges(r, [-ROD, ROD], [0, A], [0, A]).forEach(([a, b], k) => S.path([a, b], { color: RULE, width: EDGE, layer: 0.8, cap: 'round', what: `the rod's edge ${k}` }));
	// the rod's three visible faces, a pale tint of the page, so that it reads as one bar
	{
		const P = (x, y, w) => r([x, y, w]);
		const quads = [
			[P(-ROD, 0, 0), P(ROD, 0, 0), P(ROD, A, 0), P(-ROD, A, 0)],
			[P(-ROD, A, 0), P(ROD, A, 0), P(ROD, A, A), P(-ROD, A, A)],
			[P(ROD, 0, 0), P(ROD, 0, A), P(ROD, A, A), P(ROD, A, 0)]
		];
		const d = quads.map((q) => 'M' + q.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join('L') + 'Z').join('');
		S.raw(`<path d="${d}" fill="${TINT}"/>`, 0.4);
	}
	const cube2 = boxEdges(r, [-A / 2, A / 2], [0, A], [0, A]);
	cube2.forEach(([a, b], k) => S.path([a, b], { color: DIM, width: EDGE, layer: 1, cap: 'round', what: `the rod's cube's edge ${k}` }));
	// the same cube: every edge of the second the first's, moved
	{
		const dx = cube2[0][0][0] - cube1[0][0][0], dy = cube2[0][0][1] - cube1[0][0][1];
		cube2.forEach(([a, b], k) => check(near(a[0] - dx, cube1[k][0][0], 1e-9) && near(a[1] - dy, cube1[k][0][1], 1e-9) && near(b[0] - dx, cube1[k][1][0], 1e-9) && near(b[1] - dy, cube1[k][1][1], 1e-9), `the rod's cube's edge ${k} is not the gas cube's`));
	}
	// the inward arrows: on the rod's axis, their heads at the end faces' centres
	const inward = {};
	for (const side of [-1, 1]) {
		const face = r([side * (A / 2), A / 2, A / 2]);
		const from = [face[0] + side * IN, face[1]];
		inward[side] = S.arrow(from, face, { color: MATTER, width: THICK, head: THICK_HEAD, layer: 3, what: `the inward arrow at ${side}` });
		check(near(inward[side].u[0], -side, 1e-12) && near(inward[side].u[1], 0, 1e-12), 'an end face\'s arrow does not point inward along x');
		check(Math.abs(from[0] - face[0]) < ROD - A / 2, 'an inward arrow starts off the rod');
	}
	check(flux(-1) === -1, 'a tension is a negative flux');
	// the tension: small grey arrows at the rod's far ends, level with the end faces' centres, outward from just
	// outside the rod's outline
	const pull = {};
	for (const side of [-1, 1]) {
		const end = r([side * ROD, A / 2, A / 2]);
		const edge = side > 0 ? r([ROD, 0, A])[0] : r([-ROD, 0, 0])[0];     // the outline's right or left edge
		const from = [edge + side * (AIR + VEC / 2), end[1]];
		pull[side] = S.arrow(from, [from[0] + side * PULL, end[1]], { color: DIM, width: VEC, head: VEC_HEAD, layer: 2, what: `the pull at ${side}` });
	}
	L.push(await S.clear('\\text{tension } \\tau', pull[1].B[0] + LABEL_GAP + 0.6, pull[1].B[1], 0, 0.5, [1, 0], { color: DIM }));
	// the name of the right arrow, under the rod
	const rodBottom = r([0, 0, 0])[1];
	L.push(await lines(S, ['\\text{momentum along } {+x}', '\\text{flows toward } {-x}'], (inward[1].A[0] + inward[1].B[0]) / 2, rodBottom + LABEL_GAP + 2.5, 0.5, 0, [0, 1], MATTER, L));
	const inkBottom2 = Math.max(...L.slice(-1).map((l) => l.box.b), rodBottom);
	const law2 = await placed('T^{xx} = -\\tau', r([0, 0, A / 2])[0], inkBottom2 + 9, 0.5, 0, INK);
	L.push(law2);
	if (BOOK) {
		// the two laws on one line, under the lower of the two panels
		const k = L.indexOf(law1);
		L[k] = await placed('T^{xx} = +p', g([A / 2, 0, 0])[0] + 10, law2.box.t, 0.5, 0, INK);
	}

	// ================= the gas's dots =================
	{
		const box = { l: left, r: o1[0] + A + c * A + OUT + 6, t: t1.box.b + ROW, b: inkBottom1 + 2 };
		const dots = [];
		// each dot's opacity: 1 inside, falling smoothly to 0 over FADE points to the field's edges, in LEVELS steps
		const fade = (x, y) => { const d = Math.min(x - box.l, box.r - x, y - box.t, box.b - y) / FADE; const t = Math.max(0, Math.min(1, d)); return t * t * (3 - 2 * t); };
		const nx = Math.floor((box.r - box.l) / DOT_STEP), ny = Math.floor((box.b - box.t) / DOT_STEP);
		for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
			const x = box.l + (i + 0.15 + 0.7 * hash(i, j)) * DOT_STEP, y = box.t + (j + 0.15 + 0.7 * hash(j + 17, i + 5)) * DOT_STEP;
			if (x > box.r || y > box.b) continue;
			const near_ = S.clearance({ l: x, r: x, t: y, b: y }).d < DOT_R + 1.6;
			const onLabel = L.some((l) => x > l.box.l - LABEL_GAP - DOT_R && x < l.box.r + LABEL_GAP + DOT_R && y > l.box.t - LABEL_GAP - DOT_R && y < l.box.b + LABEL_GAP + DOT_R);
			const level = Math.round(fade(x, y) * LEVELS);
			if (!near_ && !onLabel && level > 0) dots.push([x, y, level]);
		}
		for (let k = 1; k <= LEVELS; k++) {
			const these = dots.filter((d) => d[2] === k);
			if (these.length) S.raw(`<path d="${these.map(([x, y]) => `M${x.toFixed(2)},${y.toFixed(2)}h0`).join('')}" stroke="${FAINT}" stroke-opacity="${(k / LEVELS).toFixed(3)}" stroke-width="${2 * DOT_R}" stroke-linecap="round" fill="none"/>`, 0.5);
		}
		for (const q of dots) S.mark([q.slice(0, 2)], DOT_R, 'a dot of the gas');
		check(dots.filter((d) => d[2] === LEVELS).length > 60, `too few dots: ${dots.length}`);
	}

	S.checkAll(L);
	window[name + '-numbers'] = { ...nums };
	return finish(S, L, BOOK ? [380, 470] : [220, 300]);
}
