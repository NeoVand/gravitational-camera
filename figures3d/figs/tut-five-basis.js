// The tutorial, chapter 1.5 (tutorial/newton/five-numbers.md), its second diagram: the five basis tables b^1 ... b^5
// of the symmetric trace-free tables, each drawn as a ring of twelve free steel beads pushed by that one table. b^1,
// b^2 and b^3 each fill one pair of places off the diagonal, so each acts in one plane (xy, yz, zx) and its axes are
// that plane's diagonals; b^4 sets x against y; b^5 sets z against x and y together, drawn in the plane of x and z
// (the plane of y and z looks the same). Each ring is seen face on, with its plane's two axes drawn small at its
// lower left. Exact: the tables (asserted symmetric, trace-free and orthonormal, b^A : b^B = delta^AB, and each
// ring's plane carried into itself by its table, so that the in-plane 2 x 2 block is the whole push); each ring, the
// image of the circle under 1 - eps T with one eps for the five (tut-five-lib.js); the beads, the images of twelve
// equally spaced places, set so that two lie on each eigen-axis; the arrows, -T xi at those beads, at one scale for
// the five rings (so b^5's blue arrows are twice its orange ones, and every arrow of b^1 ... b^4 has the length
// 1/sqrt2). Exaggerated: eps.
import { Panel, v3, INK } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, placed } from './tut-vec-lib.js';
import { ring, gnomon } from './tut-five-lib.js';

const r2 = Math.SQRT1_2, r6 = 1 / Math.sqrt(6);
/** The five basis tables of the chapter, rows and columns x, y, z. */
export const BASIS = [
	[[0, r2, 0], [r2, 0, 0], [0, 0, 0]],
	[[0, 0, 0], [0, 0, r2], [0, r2, 0]],
	[[0, 0, r2], [0, 0, 0], [r2, 0, 0]],
	[[r2, 0, 0], [0, -r2, 0], [0, 0, 0]],
	[[-r6, 0, 0], [0, -r6, 0], [0, 0, 2 * r6]]
];
// each ring's plane: the axis drawn to the right and the axis drawn up (0, 1, 2 for x, y, z), and its beads' phase
const PLANES = [
	{ h: 0, v: 1, phase: 15 },
	{ h: 1, v: 2, phase: 15 },
	{ h: 2, v: 0, phase: 15 },
	{ h: 0, v: 1, phase: 0 },
	{ h: 0, v: 2, phase: 0 }
];
const LETTERS = ['x', 'y', 'z'];

export const EPS = 0.3;                   // the one eps of the figure (exaggerated)
const R = 30;                             // points: an undisturbed ring's radius
const BEAD = 2.3;                         // points: a bead's radius
const REACH = 18;                         // points per unit of |T xi|: the arrows' common scale
const STEP = 104;                         // points between the centres of neighbouring rings in a row
const ROW = 112;                          // points between the rows
const GN = [-40, -40], GN_LEN = 13;       // the small axes: their corner, from the ring's centre, and their length
const NAME = [38, 36];                    // the centre of each ring's name, from the ring's centre
const name = 'tut-five-basis';
const check = checker(name);

export default async function () {
	// ---- the tables: symmetric, trace-free, orthonormal
	for (const [A, b] of BASIS.entries()) {
		check(b.every((row, i) => row.every((x, j) => x === b[j][i])), `b^${A + 1} is not symmetric`);
		check(near(b[0][0] + b[1][1] + b[2][2], 0, 1e-15), `b^${A + 1} is not trace-free`);
	}
	for (let A = 0; A < 5; A++) for (let B = 0; B < 5; B++) {
		let c = 0;
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) c += BASIS[A][i][j] * BASIS[B][i][j];
		check(near(c, A === B ? 1 : 0, 1e-12), `b^${A + 1} : b^${B + 1} = ${c}`);
	}

	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const E = [v3(1, 0, 0), v3(0, 1, 0)];                 // right and up on the page
	const centres = [[-STEP, ROW / 2], [0, ROW / 2], [STEP, ROW / 2], [-STEP / 2, -ROW / 2], [STEP / 2, -ROW / 2]];
	const rings = [];
	for (let A = 0; A < 5; A++) {
		const { h, v, phase } = PLANES[A];
		const b = BASIS[A];
		// the plane is carried into itself: no entry joins an in-plane axis to the third
		const third = 3 - h - v;
		check(b[h][third] === 0 && b[v][third] === 0, `b^${A + 1} does not keep the plane of ${LETTERS[h]} and ${LETTERS[v]}`);
		const T = [[b[h][h], b[h][v]], [b[v][h], b[v][v]]];
		const c = v3(...centres[A], 0);
		rings.push(ring(ink, { c, eh: E[0], ev: E[1], R, T, eps: EPS, phase: (phase * Math.PI) / 180, bead: BEAD, reach: REACH, what: `the ring of b^${A + 1}` }));
	}
	// the arrows: one scale, so each length is |eigenvalue| REACH
	const lengths = rings.map((r) => r.arrows.map((a) => +(a.L / REACH).toFixed(6)));
	for (let A = 0; A < 4; A++) check(lengths[A].every((l) => near(l, r2, 1e-6)), `an arrow of b^${A + 1} is not 1/sqrt2 long`);
	check(rings[4].arrows.filter((a) => !a.stretch).every((a) => near(a.L, 2 * rings[4].arrows.find((o) => o.stretch).L, 1e-9)), 'b^5: the squeeze is not twice the stretch');
	check(rings[4].arrows.filter((a) => a.stretch).every((a) => Math.abs(a.from.y - centres[4][1]) < 1e-9), 'b^5: the stretch is not along x');

	// ---- the small axes, at each ring's lower left
	const L = [];
	for (let A = 0; A < 5; A++) {
		const { h, v } = PLANES[A];
		const O = v3(centres[A][0] + GN[0], centres[A][1] + GN[1], 0);
		const tips = gnomon(ink, O, [{ d: E[0], tex: LETTERS[h] }, { d: E[1], tex: LETTERS[v] }], GN_LEN, { what: `the axes of b^${A + 1}` });
		L.push({ tip: ink.at(tips[0]), src: LETTERS[h], u: [1, 0] }, { tip: ink.at(tips[1]), src: LETTERS[v], u: [0, -1] });
	}
	const labels = [];
	for (const l of L) labels.push(await ink.label(l.src, l.tip, l.u, 2.2, INK));
	// ---- the names, at each ring's upper right, opposite its axes
	for (let A = 0; A < 5; A++) {
		const [x, y] = ink.at(v3(centres[A][0] + NAME[0], centres[A][1] + NAME[1], 0));
		labels.push(await placed(`b^{${A + 1}}`, x, y, 0.5, 0.5, INK));
	}
	ink.checkAll(labels);
	return finish(name, P, labels, [240, 340]);
}
