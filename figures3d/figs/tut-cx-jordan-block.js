// The tutorial, chapter 9.2 (tutorial/one-point/complex-symmetric.md), its third diagram: two 3 x 3 tables side by
// side, each a grid of nine thin ink cells. Left, "diagonalizable (type D)": w, w, -2w on the diagonal, the zeros in
// the faint ink; under it an arrow under each column, all three eigenvectors. Right, "a Jordan block (type II)": the
// same diagonal with a 1 in the first row, second column, the upper-left 2 x 2 block outlined in heavier ink; under
// it two arrows and a dashed third, "missing", and "two eigenvectors". Ink and greys only.
// Departures from the diagram's comment: the two tables stand side by side at every width, in one drawing about 230
// points wide, so that the text stays readable on a phone; each arrow stands under the column of its axis and is named
// by it, x-hat, y-hat and z-hat (the dashed one "missing"), with "three eigenvectors" and "two eigenvectors" under
// them, so that the reader sees which axes the tables only stretch.
// Exact: the entries; the two tables' characteristic polynomials, I and J agree (asserted at several w, real and
// complex, in tut-cxsym-lib.js); (T - w)(T + 2w) is zero for the left and 3w in the first row, second column for the
// right; the left table only scales x-hat, y-hat and z-hat, the right one only x-hat and z-hat, and it has two
// independent eigenvectors (from the ranks of T - w and T + 2w). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, jordanFacts, jordanTables, cx } from './tut-cxsym-lib.js';

const name = 'tut-cx-jordan-block';
const check = checker(name);

const CELL = 28;                           // a cell's side
const GRID = 0.45;                         // the cells' lines
const BLOCK = 1.0;                         // the Jordan block's outline
const APART = 124;                         // the two tables' centres
const TITLE_AIR = 5.5;                     // a title's ink to its table
const ARROW = [4.2, 16.5];                 // an arrow under a column: its head and its tail below the table
const LINK = 0.6, HEAD = 3.4;              // the arrows
const DASH = [1.9, 1.5];
const ROW_AIR = 3.4;                       // from one row of names to the next

export default async function () {
	const nums = await chapter(check);
	const facts = jordanFacts(check);
	nums.has('Both tables have the same eigenvalues and the same $I$ and $J$', 'the caption');
	nums.has('Look first at the 1 above the diagonal: it joins two equal eigenvalues into one block with a single eigenvector', 'the caption');
	const { D, J } = jordanTables(cx(1));
	const S = new Sheet(name);
	const L = [];
	const top = ORIGIN - 40;
	check(D[0][0][0] === 1 && D[1][1][0] === 1 && D[2][2][0] === -2, 'the diagonal is not w, w, -2w at w = 1');
	check(J[0][1][0] === 1 && J.flat().filter((z, k) => k % 4 !== 0).filter((z) => z[0] !== 0 || z[1] !== 0).length === 1, 'the Jordan table has not one 1 off the diagonal');

	const tables = [
		{ key: 'D', T: D, title: '\\text{diagonalizable (type D)}', eig: facts.eig.D, summary: '\\text{three eigenvectors}' },
		{ key: 'J', T: J, title: '\\text{a Jordan block (type II)}', eig: facts.eig.J, summary: '\\text{two eigenvectors}', block: true }
	];
	const out = {};
	for (const [n, t] of tables.entries()) {
		const cxm = ORIGIN + (n - 0.5) * APART, left = cxm - 1.5 * CELL;
		// the grid
		for (let k = 0; k <= 3; k++) {
			S.path([[left + k * CELL, top], [left + k * CELL, top + 3 * CELL]], { color: INK, width: GRID, cap: 'square', layer: 1, what: `${t.key}'s column line ${k}` });
			S.path([[left, top + k * CELL], [left + 3 * CELL, top + k * CELL]], { color: INK, width: GRID, cap: 'square', layer: 1, what: `${t.key}'s row line ${k}` });
		}
		if (t.block) S.path([[left, top], [left + 2 * CELL, top], [left + 2 * CELL, top + 2 * CELL], [left, top + 2 * CELL]], { color: INK, width: BLOCK, closed: true, cap: 'square', layer: 1.5, what: 'the Jordan block' });
		// the entries, centred in their cells
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
			const z = t.T[i][j], zero = z[0] === 0 && z[1] === 0;
			const src = i === j ? (i === 2 ? '-2w' : 'w') : zero ? '0' : '1';
			check(i === j || (zero ? src === '0' : src === '1' && t.key === 'J' && i === 0 && j === 1), `${t.key}: the entry ${i + 1}, ${j + 1}`);
			const g = await placed(src, left + (j + 0.5) * CELL, top + (i + 0.5) * CELL, 0.5, 0.5, zero ? FAINT : INK);
			L.push(g);
		}
		// the title
		const title = await placed(t.title, cxm, top - TITLE_AIR, 0.5, 1, INK);
		L.push(title);
		// the arrows under the columns: solid under an eigenvector, dashed under the axis that is not one
		const names = ['\\hat x', '\\hat y', '\\hat z'];
		let row1 = 0;
		for (let k = 0; k < 3; k++) {
			const x = left + (k + 0.5) * CELL;
			const A = [x, top + 3 * CELL + ARROW[1]], B = [x, top + 3 * CELL + ARROW[0]];
			if (t.eig[k]) S.arrow(A, B, { color: INK, width: LINK, head: HEAD, layer: 2, what: `${t.key}'s arrow ${k + 1}` });
			else {
				S.path([A, [x, B[1] + HEAD * 0.8]], { color: INK, width: LINK, dash: DASH, cap: 'butt', layer: 2, what: `${t.key}'s dashed arrow` });
				const w = 0.36 * HEAD;
				S.raw(`<path d="M${x},${B[1]}L${(x + w).toFixed(2)},${(B[1] + HEAD).toFixed(2)}L${(x - w).toFixed(2)},${(B[1] + HEAD).toFixed(2)}Z" fill="${INK}"/>`, 2);
				S.mark([B, [x + w, B[1] + HEAD], [x - w, B[1] + HEAD], B], 0, `${t.key}'s dashed arrow's head`);
			}
			const lab = await placed(t.eig[k] ? names[k] : '\\text{missing}', x, A[1] + LABEL_GAP + 0.6, 0.5, 0, t.eig[k] ? INK : DIM);
			L.push(lab);
			row1 = Math.max(row1, lab.box.b);
		}
		out[t.key] = { row1, cxm };
	}
	// the summaries on one line under both
	const yS = Math.max(out.D.row1, out.J.row1) + ROW_AIR;
	for (const t of tables) L.push(await placed(t.summary, out[t.key].cxm, yS, 0.5, 0, INK));
	check(tables[0].eig.filter(Boolean).length === 3 && tables[1].eig.filter(Boolean).length === 2, 'the eigenvectors drawn');

	S.checkAll(L);
	window[name + '-numbers'] = { eig: facts.eig };
	return finish(S, L, [200, 300]);
}
