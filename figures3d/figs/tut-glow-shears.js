// The tutorial, chapter 10.3 (tutorial/glow/why-matter-barely-glows.md), its fourth diagram: three of the five shears
// drive the Raman line. Chapter 1.5's five basis shears, drawn as its figure tut-five-basis draws them (figs/tut-five-
// basis.js and figs/tut-five-lib.js: a ring of twelve free steel beads under each table, its dashed undisturbed circle,
// orange stretch and blue squeeze arrows, its plane's two axes at its lower left), in two rows. Top row, the two on the
// diagonal, b^4 and b^5, under "stretch along the cube's axes", each with "s = 0" beside it. Bottom row, the three off
// it, b^1, b^2, b^3, the shears xy, yz and zx, under "the shears xy, yz, zx"; each ring's axes carry the third axis
// too, drawn obliquely towards the reader, and from each ring a short line runs down to a small drawing in a faint cube
// of two interleaved atoms, an open one of one copy and a filled one of the other, the filled one faint where it would
// sit and solid where it is shifted along that third axis, "s_z", "s_x" and "s_y". Neutral apart from the sign colours.
// Departures from the diagram's comment: the faint cube outline frames each small drawing of atoms (a cell of the
// crystal, drawn on the ring's own axes) rather than the rows; the top row's "0" is written "s = 0", the shift; each
// row has its title over it.
// Exact: the five tables and their rings (tut-five-basis.js: symmetric, trace-free, orthonormal; each ring the image
// of the circle under 1 - eps T), and which shift each drives: s_i = |eps_ijk| u_jk, the only coupling the crystal's
// half turns keep (asserted in tut-glow-lib.js), gives s along z for b^1, along x for b^2, along y for b^3, and 0 for
// b^4 and b^5, each shift along the axis at right angles to its ring's plane. Schematic, as the caption says: the
// rings' strain (eps, as in chapter 1.5), the atoms' places in the cell and the size of the shift.
import { Panel, v3, INK, DIM, RULE, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed, LABEL_GAP, AXIS, AXIS_HEAD, HAIR } from './tut-vec-lib.js';
import { ring, gnomon } from './tut-five-lib.js';
import { BASIS, EPS } from './tut-five-basis.js';
import { chapter, palette, shiftOf } from './tut-glow-lib.js';

const name = 'tut-glow-shears';
const check = checker(name);

// each ring's plane, as chapter 1.5 draws it: the axis to the right, the axis up, and its beads' phase (degrees)
const PLANES = [
	{ h: 0, v: 1, phase: 15 },
	{ h: 1, v: 2, phase: 15 },
	{ h: 2, v: 0, phase: 15 },
	{ h: 0, v: 1, phase: 0 },
	{ h: 0, v: 2, phase: 0 }
];
const LETTERS = ['x', 'y', 'z'];

// ---- the drawing (points, y up) ------------------------------------------------------------------------------------
const R = 24, BEAD = 1.9, REACH = 14.5;         // chapter 1.5's ring at four fifths of its size
const STEP = 104, TOP_STEP = 128;               // between the rings of the bottom row and of the top row
const ROW = 98;                                 // between the rows' centres
const GN = [-32, -32], GN_LEN = 11;             // the small axes: their corner from the ring's centre, their length
const OBLIQUE = [-0.62, -0.47];                 // the third axis, towards the reader, as drawn (unit-free, scaled below)
const NAME = [30, 29];                          // each ring's name, from its centre
const CELL = { drop: 68, q: 26, o: 10, line: 0.4, gap: 3 };   // the atoms' cube: its centre below the ring, side, depth
const ATOM = { r: 2.1, ring: 0.5, faint: 0.3, shift: 9.5, head: 2.6, width: 0.5 };
const caption = 'Look first at the bottom row: each of the three shears off the cube\'s diagonal shifts one copy of atoms against the other along the third axis, while the two stretches along the cube\'s axes shift nothing. So only three of a wave\'s five shears drive the Raman line. The rings are schematic.';

export default async function () {
	const { state } = await chapter(check);
	await palette(check);
	state(name, 'glow-shears', caption);

	// ---- which shift each table drives: along the axis at right angles to its plane, or none
	const shifts = BASIS.map(shiftOf);
	for (const [A, s] of shifts.entries()) {
		const { h, v } = PLANES[A];
		if (A < 3) {
			const third = 3 - h - v;
			check(s.every((x, i) => (i === third ? Math.abs(x) > 1 : near(x, 0, 1e-15))), `b^${A + 1} does not shift along ${LETTERS[third]}: ${s}`);
		} else check(s.every((x) => near(x, 0, 1e-15)), `b^${A + 1} shifts the copies: ${s}`);
	}
	// the planes are right-handed (h x v is the third axis), so the third axis points at the reader in every drawing
	for (const { h, v } of PLANES.slice(0, 3)) check((v - h + 3) % 3 === 1, 'a plane is not right-handed');
	check(LETTERS[3 - PLANES[0].h - PLANES[0].v] === 'z' && LETTERS[3 - PLANES[1].h - PLANES[1].v] === 'x' && LETTERS[3 - PLANES[2].h - PLANES[2].v] === 'y', 'the third axes are not z, x, y');

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const E = [v3(1, 0, 0), v3(0, 1, 0)];
	const centres = [[-STEP, -ROW / 2], [0, -ROW / 2], [STEP, -ROW / 2], [-TOP_STEP / 2, ROW / 2], [TOP_STEP / 2, ROW / 2]];
	const ob = Math.hypot(...OBLIQUE), O3 = v3(OBLIQUE[0] / ob, OBLIQUE[1] / ob, 0);
	const labels = [];
	const tips = [];

	for (let A = 0; A < 5; A++) {
		const { h, v, phase } = PLANES[A];
		const b = BASIS[A];
		const T = [[b[h][h], b[h][v]], [b[v][h], b[v][v]]];
		const c = v3(...centres[A], 0);
		ring(ink, { c, eh: E[0], ev: E[1], R, T, eps: EPS, phase: (phase * Math.PI) / 180, bead: BEAD, reach: REACH, what: `the ring of b^${A + 1}` });
		// the plane's axes at the lower left, and for the bottom row the third axis, towards the reader
		const O = v3(centres[A][0] + GN[0], centres[A][1] + GN[1], 0);
		const axes = [{ d: E[0], tex: LETTERS[h] }, { d: E[1], tex: LETTERS[v] }];
		if (A < 3) axes.push({ d: O3, tex: LETTERS[3 - h - v] });
		const t = gnomon(ink, O, axes, GN_LEN, { what: `the axes of b^${A + 1}` });
		axes.forEach((x, i) => tips.push({ tip: ink.at(t[i]), src: x.tex, u: i === 0 ? [1, 0] : i === 1 ? [0, -1] : [O3.x, -O3.y] }));
		const [nx, ny] = ink.at(v3(centres[A][0] + NAME[0], centres[A][1] + NAME[1], 0));
		labels.push(await placed(`b^{${A + 1}}`, nx, ny, 0.5, 0.5, INK));
	}

	// ---- the bottom row: a short line down from each ring to its cell, the cell, the two atoms, the shift
	const sub = ['s_z', 's_x', 's_y'];
	for (let A = 0; A < 3; A++) {
		const cx = centres[A][0], cy = centres[A][1] - CELL.drop;
		const half = CELL.q / 2, o = O3.clone().multiplyScalar(CELL.o);
		// the cube: the back square, the front square (nearer the reader, along the third axis), and the four edges
		const corner = (i, j, k) => v3(cx + (i ? half : -half) + (k ? o.x / 2 : -o.x / 2), cy + (j ? half : -half) + (k ? o.y / 2 : -o.y / 2), 0);
		for (const k of [0, 1]) for (const [p, q] of [[[0, 0], [1, 0]], [[1, 0], [1, 1]], [[1, 1], [0, 1]], [[0, 1], [0, 0]]]) ink.line(corner(...p, k), corner(...q, k), { color: RULE, width: CELL.line, layer: 0.5, what: `the cell's edge ${A}` });
		for (const [i, j] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ink.line(corner(i, j, 0), corner(i, j, 1), { color: RULE, width: CELL.line, layer: 0.5, what: `the cell's edge ${A}` });
		// the line from the ring down to the cell's top
		const top = Math.max(...[0, 1].flatMap((i) => [0, 1].map((k) => corner(i, 1, k).y)));
		// from under the ring's lowest bead (the ellipse's lowest point is above R (1 + EPS / sqrt 2) below its centre)
		const from = centres[A][1] - R * (1 + EPS * Math.SQRT1_2) - BEAD - 3.2;
		check(from - (top + CELL.gap) > 6, `the line to the cell ${A} is ${from - top - CELL.gap} pt long`);
		ink.line(v3(cx, from, 0), v3(cx, top + CELL.gap, 0), { color: DIM, width: HAIR, layer: 0.5, what: `the line to the cell ${A}` });
		// the atoms: the open one at the left, the filled one faint where it would sit and solid where it is
		const openAt = v3(cx - 5, cy + 4, 0), faintAt = v3(cx + 5, cy + 4, 0), solidAt = faintAt.clone().addScaledVector(O3, ATOM.shift);
		// all three inside both of the cube's squares, clear of its edges
		for (const p of [openAt, faintAt, solidAt]) check(Math.abs(p.x - cx) + ATOM.r + 1 < half - Math.abs(o.x) / 2 && Math.abs(p.y - cy) + ATOM.r + 1 < half - Math.abs(o.y) / 2, `an atom of cell ${A} meets its cube`);
		const disc = (p, fill, extra, layer, what) => { const [x, y] = ink.at(p); P.items.push({ kind: 'raw', layer, depth: 0, svg: `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${ATOM.r}" fill="${fill}"${extra}/>` }); ink.mark([[x, y]], ATOM.r, what); };
		disc(openAt, PAGE, ` stroke="${INK}" stroke-width="${ATOM.ring}"`, 3, `the open atom ${A}`);
		disc(faintAt, INK, ` fill-opacity="${ATOM.faint}"`, 2.5, `the faint atom ${A}`);
		disc(solidAt, INK, '', 3.5, `the solid atom ${A}`);
		const end = faintAt.clone().addScaledVector(O3, ATOM.shift - ATOM.r - 0.4);
		ink.arrow(faintAt, end, { color: INK, width: ATOM.width, head: ATOM.head, layer: 3, what: `the shift ${A}` });
		// the shift is along the third axis of the ring above it
		const s = shifts[A], third = 3 - PLANES[A].h - PLANES[A].v;
		check(sub[A] === `s_${LETTERS[third]}` && Math.abs(s[third]) > 0, `the shift ${A} is not ${sub[A]}`);
		labels.push(await ink.label(sub[A], ink.at(v3(cx + half + o.x / 2 + 1, cy - 2, 0)), [1, 0], LABEL_GAP + 0.3, INK));
	}
	// ---- the top row: no shift
	for (let A = 3; A < 5; A++) labels.push(await ink.label('\\boldsymbol s = 0', ink.at(v3(centres[A][0] + R * (1 + EPS * 0.75), centres[A][1], 0)), [1, 0], LABEL_GAP + 9, INK));

	// ---- the axes' letters, and the rows' titles
	for (const l of tips) labels.push(await ink.label(l.src, l.tip, l.u, 2.2, INK));
	// the top row's title over its highest mark; the bottom row's midway between the rows' facing marks
	const marks = (y0, y1) => ink.marks.flatMap((m) => m.pts.map((p) => p[1])).filter((y) => y >= y0 && y <= y1);
	const yTop = ink.at(v3(0, centres[3][1], 0))[1], yBottom = ink.at(v3(0, centres[0][1], 0))[1];
	const highest = Math.min(...marks(-Infinity, yTop));
	labels.push(await placed('\\text{stretch along the cube\'s axes}', ORIGIN, highest - 7, 0.5, 1, INK));
	const above = Math.max(...marks(yTop, (yTop + yBottom) / 2)), below = Math.min(...marks((yTop + yBottom) / 2, yBottom));
	labels.push(await placed('\\text{the shears } xy,\\ yz,\\ zx', ORIGIN, (above + below) / 2, 0.5, 0.5, INK));

	ink.checkAll(labels);
	window[name + '-numbers'] = { shifts };
	return finish(name, P, labels, [285, 345]);
}
