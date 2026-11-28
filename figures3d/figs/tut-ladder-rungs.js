// The tutorial, section 13.3 (tutorial/what-a-field-keeps/ladder.md), its second diagram: the paper's fig:ladder(b)
// rebuilt as a grid. The degree l across, 0 to 6, one column each, headed "l = 0" to "l = 6"; the rung j upward, 0 to
// 3, each row named "j = 0" to "j = 3" on the left. Each cell holds the 2l + 1 beads of its patterns, the paper's lit
// steel beads (figs/ladder.js, stone.js's STEEL), in a short row of l + 1 with the other l nested on it, and is
// labelled once, small, under its beads: int rho r^(l+2j) Y_l (int rho r^(2j) when l = 0). Four translucent bands from
// the bottom, each a neutral tint over the rungs j < m that tides of degree up to m reach, named inside at its
// left, just over the beads of its top row: "m = 1: one reading, or uniform tides", "m = 2: quadrupolar tides",
// "m = 3: octupolar tides", "m = 4: hexadecapolar tides"; the fourth covers the top row j = 3, so that every row lies
// in a band, and the heads of the columns stand above it. Thin dashed diagonals through the cells with l + 2j = n, for
// n = 2, 4, 6, from the bead of the cell (0, n/2) (the dashes start at its edge) down through (n, 0) and a little
// beyond, named there "n = 2", "n = 4", "n = 6": the orders of a held mass. The caption names m, the degree of tide.
// The bead of int rho r^4 (l = 0, j = 2) is lit like the others but in matter's colour (halfway between its light and
// dark shades), a bead of gold among steel.
// Departures from the diagram's comment: the bead of int rho r^4 is in matter's colour, not the paper's orange, which
// the tutorial keeps for a stretch; it is a moment of the density. A cell's beads stand in two staggered rows, l + 1
// under l, rather than in one row, so that the thirteen of l = 6 fit a column a seventh of the drawing wide and the
// diagonals run straight through the cells' middles. The degree and the rung are named by their letters, "l = 0" and
// "j = 0", at the columns' heads and the rows' left. Each band's name stands on two lines, so that no diagonal crosses
// it. The diagonals' names stand at their lower ends, under the grid.
// Exact: the number of beads in each cell, 2l + 1 (asserted with the counts of tut-ladder-lib.js), the cells on each
// diagonal, the rungs each band covers, the cell of int rho r^4. Schematic: the spacing of beads, cells and bands.
import { Sheet, ORIGIN, finish, checker, placed, beside, near, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { dashed } from './tut-orb-lib.js';
import { STEEL } from '../stone.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, MATTER, TOP_L, TOP_J, beads, DIAGONALS, onDiagonal, BANDS, FIRST_APART } from './tut-ladder-lib.js';

const name = 'tut-ladder-rungs';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const D = 44;                              // from one column's middle to the next
const H = 50;                              // from one row's middle to the next
const PITCH = 5.0, BEAD = 2.15;            // the beads: spacing in a row, and radius
const TIER = (PITCH * Math.sqrt(3)) / 2;   // the nested row above
const CELL = 6.2;                          // a cell's label
const HEAD = 7.6;                          // the heads of the columns and rows
const BAND_NAME = 7.0;                     // the bands' names
const TINT = 0.042;                        // each band's tint, the ink's opacity
const EDGE = 0.35;                         // a band's top edge
const BELOW = 2.3;                         // from a cell's beads to its label
const DASH = [2.0, 1.5], DIAG = 0.45;      // the diagonals
// the bead of int rho r^4: a lit bead of the colour halfway between matter's two (light and dark), so that it reads as
// matter beside the steel in either theme
const GOLD = (() => { const [a, b] = MATTER.match(/#[0-9a-f]{6}/g); return '#' + [1, 3, 5].map((i) => Math.round((parseInt(a.slice(i, i + 2), 16) + parseInt(b.slice(i, i + 2), 16)) / 2).toString(16).padStart(2, '0')).join(''); })();
const BEYOND = 0.36;                       // how far a diagonal runs past (n, 0), in rows
const caption = 'Look first at the bands: each degree $m$ of tide adds one floor, one more power of $r^2$, to every column of angular patterns. The bead in the colour of matter, $\\int\\matter\\rho\\,r^4$, is the first at which the two bodies of the opening differ. The dashed diagonals collect the moments that a held mass reaches at one power of its distance. The number of beads in a cell is exact; the spacing is chosen for the drawing.';

/** A cell's label: int rho r^(l+2j) Y_l, the power left out when it is zero and written bare when it is one. */
function moment(l, j) {
	const n = l + 2 * j, rho = `{\\color{${MATTER}}\\rho}`;
	const r = n === 0 ? '' : n === 1 ? '\\,r' : `\\,r^{${n}}`;
	return `\\int\\!${rho}${r}${l ? `Y_{${l}}` : ''}`;
}

export default async function () {
	const { state } = await chapter(check);
	state(name, 'ladder-rungs', caption);
	const S = new Sheet(name);
	const L = [];
	const X0 = ORIGIN - 3 * D, Y0 = ORIGIN + 1.5 * H;
	const at = (l, j) => [X0 + l * D, Y0 - j * H];          // a cell's middle, its beads' middle

	// ---- the beads, and each cell's label under them
	const beadsAt = [];                                       // every bead drawn, [x, y]
	const clusters = [];
	let count = 0;
	for (let j = 0; j <= TOP_J; j++) for (let l = 0; l <= TOP_L; l++) {
		const [cx, cy] = at(l, j);
		const here = [];
		// l + 1 in the row below, l nested on it, their middles TIER apart, the pair of rows centred on the cell
		const rows = l ? [[l + 1, cy + TIER / 2], [l, cy - TIER / 2]] : [[1, cy]];
		for (const [k, y] of rows) for (let i = 0; i < k; i++) here.push([cx + (i - (k - 1) / 2) * PITCH, y]);
		check(here.length === beads(l), `the cell (${l}, ${j}) has ${here.length} beads`);
		for (const p of here) {
			const first = l === FIRST_APART[0] && j === FIRST_APART[1];
			S.sphere(p, BEAD, first ? GOLD : STEEL, { spec: 0.6, shininess: 36, layer: 2 }, first ? 'the gold bead' : `a bead of (${l}, ${j})`);
		}
		count += here.length;
		beadsAt.push(...here);
		const box = { l: Math.min(...here.map((p) => p[0])) - BEAD, r: Math.max(...here.map((p) => p[0])) + BEAD, t: Math.min(...here.map((p) => p[1])) - BEAD, b: Math.max(...here.map((p) => p[1])) + BEAD };
		clusters.push({ l, j, box });
		const lab = await placed(moment(l, j), cx, box.b + BELOW, 0.5, 0, INK, CELL);
		lab.cell = [l, j];
		L.push(lab);
	}
	check(count === (TOP_J + 1) * (TOP_L + 1) ** 2, `the beads: ${count}`);
	// every cell's beads keep within its column, with air to the next
	check(clusters.every((c) => c.box.r - c.box.l < D - 6), 'a cell is wider than its column allows');

	// ---- the heads: j left of the rows (the heads of the columns go over the top band, below)
	const left = X0 - D / 2;                                  // the grid's left edge, where the bands start
	for (let j = 0; j <= TOP_J; j++) L.push(await placed(`j = ${j}`, left - 4.5, at(0, j)[1], 1, 0.5, DIM, HEAD));

	// ---- the bands: tides of degree up to m reach the rungs j < m
	const right = X0 + TOP_L * D + D / 2;
	const cellLabel = (l, j) => L.find((x) => x.cell && x.cell[0] === l && x.cell[1] === j);
	const bottom = Math.max(...L.filter((x) => x.cell && x.cell[1] === 0).map((x) => x.box.b)) + 3.2;
	const names = { 1: ['m = 1\\text{: one reading,}', '\\text{or uniform tides}'], 2: ['m = 2\\text{:}', '\\text{quadrupolar tides}'], 3: ['m = 3\\text{:}', '\\text{octupolar tides}'], 4: ['m = 4\\text{:}', '\\text{hexadecapolar tides}'] };
	// the lib's three bands and a fourth over the top row, so that no row is left out of a band
	const bands = [...BANDS, TOP_J + 1];
	check(bands.join() === '1,2,3,4' && bands.at(-1) === TOP_J + 1, `the bands ${bands}`);
	let topEdge;
	for (const m of bands) {
		// the top edge: under the labels of the row j = m, with air; the top band's, over its name, with air
		const above = m <= TOP_J ? Math.max(...Array.from({ length: TOP_L + 1 }, (_, l) => cellLabel(l, m).box.b)) : null;
		let top = m <= TOP_J ? above + 3.4 : null;
		// its name, at its left, two lines, low in the band's top strip (just over the beads of the row j = m - 1), where
		// no diagonal crosses it
		const [a, b] = names[m];
		const under = Math.min(...clusters.filter((c) => c.j === m - 1).map((c) => c.box.t));
		const two = await placed(`\\vphantom{(}${b}`, left + 3.2, under - LABEL_GAP - 0.5, 0, 1, INK, BAND_NAME);
		const one = await placed(`\\vphantom{(}${a}`, left + 3.2, two.box.t - 0.6, 0, 1, INK, BAND_NAME);
		if (top === null) top = one.box.t - EDGE / 2 - LABEL_GAP - 2.2;   // the top band: its edge over its name
		topEdge = top;
		S.raw(`<rect x="${n2(left)}" y="${n2(top)}" width="${n2(right - left)}" height="${n2(bottom - top)}" fill="${INK}" fill-opacity="${TINT}"/>`, 0.2);
		S.path([[left, top], [right, top]], { color: FAINT, width: EDGE, layer: 0.4, cap: 'butt', what: `the edge of band ${m}` });
		check(one.box.t > top + EDGE / 2 + LABEL_GAP, `band ${m}'s name reaches its edge`);
		// one label of two lines
		L.push({ src: `${a} / ${b}`, svg: one.svg + two.svg, box: { l: one.box.l, r: Math.max(one.box.r, two.box.r), t: one.box.t, b: two.box.b } });
	}
	S.boxes.push({ box: { l: left, r: right, t: bottom - 0.01, b: bottom }, what: 'the bands\' foot' });
	// the heads of the columns, over the top band's edge
	for (let l = 0; l <= TOP_L; l++) L.push(await placed(`\\ell = ${l}`, at(l, 0)[0], topEdge - 4.2, 0.5, 1, DIM, HEAD));

	// ---- the diagonals l + 2j = n, from (0, n/2) through (n, 0) and a little beyond, their names at the lower end
	const labelBoxes = () => L.map((x) => x.box);
	const toBox = (b, [x, y]) => Math.hypot(Math.max(b.l - x, 0, x - b.r), Math.max(b.t - y, 0, y - b.b));
	const clash = (q, gap) => beadsAt.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < BEAD + gap) ||
		labelBoxes().some((b) => toBox(b, q) < LABEL_GAP + DIAG / 2 + 0.15);
	for (const n of DIAGONALS) {
		const cells = onDiagonal(n);
		check(cells.every(([l, j]) => l + 2 * j === n), `the diagonal ${n}`);
		const a0 = at(...cells.at(-1)), b = at(...cells[0]);   // (0, n/2) and (n, 0)
		const a = a0;
		const u = [(b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]), (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1])];
		const start = a0;                                       // the first bead's middle; the dashes begin at its edge
		const end = [b[0] + u[0] * (BEYOND * H) / u[1], b[1] + BEYOND * H];
		// every cell of the diagonal lies on the straight line
		for (const c of cells) {
			const p = at(...c), cross = (p[0] - a[0]) * u[1] - (p[1] - a[1]) * u[0];
			check(Math.abs(cross) < 1e-9, `the cell ${c} is off the diagonal ${n}`);
		}
		const drawn = dashed(S, start, end, { clash, color: DIM, width: DIAG, layer: 1, dash: DASH, what: `the diagonal ${n}` });
		check(drawn.length > 6, `the diagonal ${n} has ${drawn.length} dashes`);
		L.push(await beside(`n = ${n}`, end, u, LABEL_GAP + 0.4, DIM, BAND_NAME));
	}

	S.checkAll(L);
	window[name + '-numbers'] = { beads: count };
	return finish(S, L, [280, 380]);
}
