// The tutorial, section 13.6 (tutorial/what-a-field-keeps/algebra-of-moments.md), its second diagram: the table of
// brackets. Three rows and three columns, the rows Q_h, Qdot_h and H (the energy), the columns Q_g, Qdot_g and H; the
// cell of a row A and a column B holds {A, B}, in the order of the chapter's [^order] footnote, which the corner names
// "{row, column}". Each cell is one formula in ink: {Q_h, Q_g} = 0 for Newton's moments and the paper's
// eq:moment-bracket for the moments of the energy at order 1/c^2; {Q_h, Qdot_g} = int rho grad h . grad g (the paper's
// eq:hair-commutator over i hbar); {Qdot_h, Qdot_g} = the paper's eq:flow-bracket; {Q_h, H} = Qdot_h; {Qdot_h, H} =
// Qddot_h; {H, H} = 0. Below the diagonal, pale, the same brackets in the other order, each minus its mirror:
// -int rho grad h . grad g, -Qdot_g and -Qddot_g. Each cell has a thin band on its left edge for what it reads: the
// density, the flow, or nothing of the inside; under the formula a short direct label, "weighs the density" or "weighs
// the flow"; in its top right corner a small tag, 1/c^0 or 1/c^2, the order of its leading term.
// Departures from the diagram's comment: the bands are not orange and blue, which the tutorial keeps for a stretch and
// a squeeze. The density and the flow are both quantities of matter, so both bands are in matter's colour, the density's
// solid and the flow's broken into dashes; the band of a cell that reads nothing of the inside is a grey. Direct labels
// under the formulas name the two. The cell {Q_h, Q_g} carries both of its values, "Newton: 0" small above the
// paper's eq:moment-bracket. The lower triangle's cells carry no tag and no label.
// Exact: every formula, its order and sign in the chapter's convention (tut-algebra-lib.js checks each bracket, the
// lower triangle's included, by finite differences on four parts with springs, and asserts the paper's three
// equations as the cells print them). Schematic: nothing; the bands' and cells' sizes are chosen for the drawing.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, HAIR, n2 } from './tut-pot-lib.js';
import { INK, DIM, FAINT, RULE } from '../lib.js';
import { chapter, MATTER } from './tut-algebra-lib.js';

const name = 'tut-moment-algebra';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const COLS = [116, 116, 52];               // the columns' widths
const ROWS = [50, 55, 40];                 // the rows' heights
const HEAD_W = 44, HEAD_H = 20;            // the row heads' column and the column heads' row
const FORMULA = 8.2, SMALL = 6.6, TAG = 6.4, HEAD = 8.5;   // type sizes
const BAND = { w: 2.4, inset: 2.6, pad: 4.2, dash: [2.3, 1.3] };   // the bands: width, from the cell's edges, and dashes
const PALE = 0.42, PALE_TEXT = 0.5;        // the lower triangle: its bands' and its formulas' opacity
const GRID = 0.4;                          // the grid's hairlines
const caption = 'Look first at the bands: the bracket of a moment with a rate weighs the density, the bracket of two rates and, at order $1/c^2$, the bracket of two moments of the energy weigh the flow, and the energy turns each moment into its rate. Cells below the diagonal, drawn pale, follow by antisymmetry, $\\{B, A\\} = -\\{A, B\\}$. The tag in each corner is the order of the leading term.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'moment-algebra', caption);
	const S = new Sheet(name);
	const L = [];
	const M = (s) => `{\\color{${MATTER}}${s}}`;
	const rho = M('\\rho'), J = M('\\mathbf J');
	const Q = (s) => M(s);

	// ---- the grid
	const W = COLS.reduce((a, b) => a + b, 0), H = ROWS.reduce((a, b) => a + b, 0);
	const x0 = ORIGIN - (W + HEAD_W) / 2 + HEAD_W, y0 = ORIGIN - (H + HEAD_H) / 2 + HEAD_H;
	const xs = [x0], ys = [y0];
	COLS.forEach((w) => xs.push(xs.at(-1) + w));
	ROWS.forEach((h) => ys.push(ys.at(-1) + h));
	// the hairlines: under the column heads, right of the row heads, and between the cells
	for (const y of ys.slice(0, -1)) S.path([[x0 - HEAD_W, y], [xs.at(-1), y]], { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the rule at ${n2(y)}` });
	for (const x of xs.slice(0, -1)) S.path([[x, y0 - HEAD_H], [x, ys.at(-1)]], { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the rule at ${n2(x)}` });

	// ---- the heads
	const rows = [Q('Q_h'), Q('\\dot Q_h'), 'H'], cols = [Q('Q_g'), Q('\\dot Q_g'), 'H'];
	for (let i = 0; i < 3; i++) {
		L.push(await placed(rows[i], x0 - HEAD_W / 2, (ys[i] + ys[i + 1]) / 2, 0.5, 0.5, INK, HEAD));
		L.push(await placed(`\\vphantom{\\dot Q}${cols[i]}`, (xs[i] + xs[i + 1]) / 2, y0 - HEAD_H / 2, 0.5, 0.5, INK, HEAD));
	}
	L.push(await placed('\\{\\text{row, column}\\}', x0 - HEAD_W / 2, y0 - HEAD_H / 2, 0.5, 0.5, DIM, 6.2));

	// ---- the cells: [row, column, formula, what it reads, the order of its leading term, Newton's value]
	const flowBracket = `\\begin{aligned}\\textstyle\\int ${J}\\cdot\\bigl[&(\\nabla\\nabla h)\\nabla g\\\\[-1pt]&{}-(\\nabla\\nabla g)\\nabla h\\bigr]\\,\\mathrm dV\\end{aligned}`;
	const cells = [
		[0, 0, `\\frac{1}{c^2}\\!\\int ${J}\\cdot(g\\nabla h - h\\nabla g)\\,\\mathrm dV`, 'flow', 2, '0'],
		[0, 1, `\\int ${rho}\\,\\nabla h\\cdot\\nabla g\\,\\mathrm dV`, 'density', 0],
		[0, 2, Q('\\dot Q_h'), 'none', 0],
		[1, 1, flowBracket, 'flow', 0],
		[1, 2, Q('\\ddot Q_h'), 'none', 0],
		[2, 2, '0', 'none', 0],
		// below the diagonal, minus the mirror
		[1, 0, `-\\!\\int ${rho}\\,\\nabla h\\cdot\\nabla g\\,\\mathrm dV`, 'density', 0],
		[2, 0, `-${Q('\\dot Q_g')}`, 'none', 0],
		[2, 1, `-${Q('\\ddot Q_g')}`, 'none', 0]
	];
	check(cells.length === 9 && new Set(cells.map(([i, j]) => `${i},${j}`)).size === 9, 'the table is not three by three');
	// each cell below the diagonal is its mirror's formula with the names of h and g exchanged, negated: the mirror of
	// {Qdot_h, Q_g} is {Q_g, Qdot_h} = int rho grad g . grad h, symmetric in h and g
	for (const [i, j, f] of cells.filter(([i, j]) => i > j)) {
		const mirror = cells.find(([a, b]) => a === j && b === i)[2].replace(/_h/g, '_g');
		check(f === `-${mirror}` || f === `-\\!${mirror}`, `the cell (${i}, ${j}) is not minus its mirror`);
	}
	for (const [i, j, f, reads, order, newton] of cells) {
		const pale = i > j, first = L.length;
		const l = xs[j], r = xs[j + 1], t = ys[i], b = ys[i + 1];
		// the band on the left edge
		const bx = l + BAND.inset + BAND.w / 2, bt = t + BAND.inset, bb = b - BAND.inset;
		const color = reads === 'none' ? RULE : MATTER;
		const dash = reads === 'flow' ? ` stroke-dasharray="${BAND.dash.join(' ')}"` : '';
		S.raw(`<path d="M${n2(bx)},${n2(bt)}L${n2(bx)},${n2(bb)}" stroke="${color}" stroke-width="${BAND.w}"${dash}${pale ? ` stroke-opacity="${PALE}"` : ''} fill="none"/>`, 1);
		S.boxes.push({ box: { l: bx - BAND.w / 2, r: bx + BAND.w / 2, t: bt, b: bb }, what: `the band (${i}, ${j})` });
		// the formula, with its small lines above and below, centred in the room right of the band
		const cx = (l + BAND.inset + BAND.w + BAND.pad + r - 3) / 2;
		const body = await placed(f, 0, 0, 0.5, 0.5, INK, FORMULA);
		const below = !pale && reads !== 'none' ? await placed(`\\text{weighs the ${reads}}`, 0, 0, 0.5, 0, DIM, SMALL) : null;
		const above = newton ? await placed(`\\text{Newton: }${newton}`, 0, 0, 0.5, 1, DIM, SMALL) : null;
		const gap = 2.6, hb = body.box.b - body.box.t;
		const stack = hb + (below ? gap + below.box.b - below.box.t : 0) + (above ? gap + above.box.b - above.box.t : 0);
		let y = (t + b) / 2 - stack / 2;
		if (above) { L.push(await placed(`\\text{Newton: }${newton}`, cx, y, 0.5, 0, DIM, SMALL)); y += above.box.b - above.box.t + gap; }
		{
			const lab = await placed(f, cx, y, 0.5, 0, INK, FORMULA);
			if (pale) lab.svg = `<g opacity="${PALE_TEXT}">${lab.svg}</g>`;
			L.push(lab);
			y += hb + gap;
		}
		if (below) L.push(await placed(`\\text{weighs the ${reads}}`, cx, y, 0.5, 0, DIM, SMALL));
		// the tag
		if (!pale) L.push(await placed(order ? '1/c^2' : '1/c^0', r - 2.6, t + 2.6, 1, 0, FAINT, TAG));
		check(L.slice(first).every((x) => x.box.l >= l + BAND.inset + BAND.w + 1.5 && x.box.r <= r - 1.5 && x.box.t >= t + 1.5 && x.box.b <= b - 1.5), `the cell (${i}, ${j}) overflows`);
	}

	S.checkAll(L, 1.5);
	window[name + '-numbers'] = { cells: cells.length };
	return finish(S, L, [300, 360]);
}
