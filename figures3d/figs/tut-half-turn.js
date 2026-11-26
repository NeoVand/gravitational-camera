// The tutorial, section 9.1 (tutorial/one-point/spin-two.md), its third diagram: half a turn gives gravity's pattern
// back and reverses light's arrow. After section 1.5b's tut-cx-spin. Two rows, three columns: the field turned by
// psi = 0, 90 and 180 degrees about its direction of travel k, which points out of the page, toward the reader (a small
// circled dot at each cell's centre), so that a turn by psi is anticlockwise on the page. Top row, gravity: a ring of
// twelve free beads under the tide Re(e^{-2 i psi} (e1 + i e2)(e1 + i e2)^T), twice the plus pattern Re(m m^T): at 0 a
// squeeze along e1 (blue) and a stretch along e2 (orange); at 90 the two have changed places; at 180 the ring is as at
// 0. Under each, the factor e^{-2 i psi}: 1, -1, 1. Bottom row, light: one ink arrow, light's E = Re(sqrt 2 e^{-i psi}
// m), along e1, e2 and -e1; under each, e^{-i psi}: 1, -i, -1. Thin grey axes e1 (right) and e2 (up) in each cell, at
// its lower left. Orange and blue only for stretch and squeeze.
// Departures from the diagram's comment: the axes' names, e1 and e2, are written in the first column only (the axes
// are the same in every cell, since the field turns and the axes do not), and the rows are named, "gravity" and
// "light", at their left.
// Exact: each ring is drawn from its own table, the image of the circle under 1 - eps T, its arrows -T xi at the beads
// on T's eigen-axes (figs/tut-five-lib.js), where T is the turned tide, asserted equal to R T(0) R^T and to
// Re(e^{-2 i psi} 2 m m^T) at each angle, and light's arrow is asserted equal to R e1 and to Re(sqrt 2 e^{-i psi} m)
// (figs/tut-spin-two-lib.js, which also asserts the factors and the squeeze along e1 at 0 against the chapter's text).
// Exaggerated: eps.
import { Panel, v3, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, AXIS, AXIS_HEAD, VEC, VEC_HEAD, placed, LABEL_GAP } from './tut-vec-lib.js';
import { ring, gnomon } from './tut-five-lib.js';
import { chapter } from './tut-spin-two-lib.js';

const name = 'tut-half-turn';
const check = checker(name);

const R = 22;                             // points: the undisturbed ring's radius
const EPS = 0.2;                          // the ring's eps (exaggerated), as tut-cx-spin
const BEAD = 1.7;                         // points: a bead's radius
const REACH = 9;                          // points per unit of |T xi|
const STEP = 94;                          // points between two columns
const ROW = 96;                           // points between the two rows' centres
const LIGHT_LEN = 24;                     // points: light's arrow
const GN = { gravity: [-37, -34], light: [-37, -22] }, GN_LEN = 11;   // the small axes: their corner, from the cell's
                                          // centre (nearer under light's short arrow), and their length
const KDOT = 2.1, KRIM = 0.45, KCORE = 0.7;   // the circled dot of k: its circle, its stroke, its centre
const FACTOR_GAP = 9;                     // from a cell's lowest mark to its factor's top

export default async function () {
	const nums = await chapter(check);
	const P = new Panel({ x: ORIGIN, y: ORIGIN, w: 0, h: 0, scale: 1 });
	const ink = new Sheet(P, name);
	const E1 = v3(1, 0, 0), E2 = v3(0, 1, 0);
	const L = [];
	const factors = { gravity: ['1', '-1', '1'], light: ['1', '-i', '-1'] };
	const cells = [];

	for (const [j, h] of nums.halfTurn.entries()) {
		check(h.deg === [0, 90, 180][j], 'the columns are not 0, 90 and 180 degrees');
		const x = (j - 1) * STEP;
		// ---- gravity: twice the turned tide, Re(e^{-2 i psi} (e1 + i e2)(e1 + i e2)^T), in the plane's axes
		const T = h.tide.map((r) => r.map((v) => 2 * v));
		const want = [[Math.cos(2 * (h.deg * Math.PI) / 180), Math.sin(2 * (h.deg * Math.PI) / 180)], [0, 0]];
		check(near(T[0][0], want[0][0], 1e-12) && near(T[0][1], want[0][1], 1e-12) && near(T[1][1], -T[0][0], 1e-12), `the tide at ${h.deg} is not the turned plus pattern`);
		const Cg = v3(x, 0, 0);
		const r = ring(ink, { c: Cg, eh: E1, ev: E2, R, T, eps: EPS, phase: 0, bead: BEAD, reach: REACH, what: `gravity at ${h.deg}` });
		// the squeeze (blue, in) lies along e1 where T's e1 entry is positive, and the stretch along e2
		const squeeze = r.arrows.filter((a) => !a.stretch), stretch = r.arrows.filter((a) => a.stretch);
		const alongX = (as) => as.every((a) => near(a.from.y, 0, 1e-9));
		check(squeeze.length === 2 && stretch.length === 2, `gravity at ${h.deg}: not two squeezes and two stretches`);
		check(T[0][0] > 0 ? alongX(squeeze) && !alongX(stretch) : alongX(stretch) && !alongX(squeeze), `gravity at ${h.deg}: the squeeze is not along e1 where the tide is positive`);
		// ---- light: E, the real part of sqrt 2 e^{-i psi} m
		const Cl = v3(x, -ROW, 0);
		const tip = Cl.clone().add(v3(h.E[0] * LIGHT_LEN, h.E[1] * LIGHT_LEN, 0));
		check(near(Math.hypot(h.E[0], h.E[1]), 1, 1e-12), 'light\'s E is not of length one');
		const a = ink.arrow(Cl.clone().add(v3(h.E[0] * (KDOT + KRIM / 2 + 0.9), h.E[1] * (KDOT + KRIM / 2 + 0.9), 0)), tip, { color: INK, width: VEC, head: VEC_HEAD, layer: 3, what: `light's E at ${h.deg}` });
		void a;
		// ---- in each cell: the circled dot of k at the centre, and the small axes at the lower left
		for (const [C, row] of [[Cg, 'gravity'], [Cl, 'light']]) {
			const [px, py] = ink.at(C);
			P.items.push({ kind: 'raw', layer: 5, depth: 0, svg: `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${KDOT}" fill="none" stroke="${INK}" stroke-width="${KRIM}"/><circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${KCORE}" fill="${INK}"/>` });
			ink.mark([[px, py]], KDOT + KRIM / 2, `${row} at ${h.deg}: k`);
			const O = C.clone().add(v3(...GN[row], 0));
			const tips = gnomon(ink, O, [{ d: E1, tex: 'e_1', color: DIM }, { d: E2, tex: 'e_2', color: DIM }], GN_LEN, { what: `${row} at ${h.deg}: the axes` });
			cells.push({ C, row, j, tips, O });
		}
	}
	// the axes' names, in the first column
	for (const c of cells.filter((c) => c.j === 0)) {
		L.push(await ink.label('\\boldsymbol e_1', ink.at(c.tips[0]), [1, 0], LABEL_GAP, DIM));
		L.push(await ink.label('\\boldsymbol e_2', ink.at(c.tips[1]), [0, -1], LABEL_GAP, DIM));
	}
	// ---- the factors, under each cell, on one line per row
	for (const row of ['gravity', 'light']) {
		const mine = cells.filter((c) => c.row === row);
		const lowest = Math.max(...ink.marks.filter((m) => m.what.startsWith(row)).flatMap((m) => m.pts.map((p) => p[1] + m.r)));
		for (const c of mine) {
			const f = row === 'gravity' ? 'e^{-2i\\psi}' : 'e^{-i\\psi}';
			L.push(await placed(`${f} = ${factors[row][c.j]}`, ink.at(c.C)[0], lowest + FACTOR_GAP, 0.5, 0, INK));
		}
	}
	// ---- the columns' heads, and the rows' names
	const top = Math.min(...ink.marks.flatMap((m) => m.pts.map((p) => p[1] - m.r)));
	for (const [j, d] of [0, 90, 180].entries()) L.push(await placed(`\\psi = ${d}^\\circ`, ink.at(v3((j - 1) * STEP, 0, 0))[0], top - 6, 0.5, 1, INK));
	const leftmost = Math.min(...ink.marks.flatMap((m) => m.pts.map((p) => p[0] - m.r)));
	L.push(await placed('\\text{gravity}', leftmost - 8, ink.at(v3(0, 0, 0))[1], 1, 0.5, INK));
	L.push(await placed('\\text{light}', leftmost - 8, ink.at(v3(0, -ROW, 0))[1], 1, 0.5, INK));

	ink.checkAll(L);
	window[name + '-numbers'] = nums.halfTurn;
	return finish(name, P, L, [240, 340]);
}
