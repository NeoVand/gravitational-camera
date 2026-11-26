// The tutorial, section 3.8 (tutorial/noise/bits.md), its first diagram: four yes-or-no questions find one of sixteen
// places. Each row is one question, "in the left half?", asked of the list of places that remain, drawn as numbered
// squares: the half the answer keeps in the first accent (its pale tint, an orange outline, the number in ink), the
// half it discards faint (a pale hairline outline, the number in the faint ink). The list goes 16, 8, 4, 2, and the
// last row is the one place left, 11; beside it, "four questions, log2 16 = 4 bits".
// Exact: the halvings (each row is the kept half of the row above, in order; the answers no, yes, no, yes lead to 11),
// the count of questions, log2 16 = 4. Schematic: the place that holds the gold, 11, chosen so that the answers mix.
import { Sheet, ORIGIN, finish, checker, placed, n2, HAIR } from './tut-pot-lib.js';
import { DIM, FAINT, RULE, INK, ACCENT } from '../lib.js';

const name = 'tut-bits-questions';
const check = checker(name);

export const N = 16, GOLD = 11;

/** The lists before each question, and the half each answer keeps. */
function mathematics() {
	const rows = [];
	let list = Array.from({ length: N }, (_, i) => i + 1);
	while (list.length > 1) {
		const left = list.slice(0, list.length / 2), right = list.slice(list.length / 2);
		const yes = left.includes(GOLD);
		rows.push({ list, kept: yes ? left : right, yes });
		list = yes ? left : right;
	}
	check(rows.length === 4 && rows.length === Math.log2(N), 'the questions are not log2 16 = 4');
	check(rows.map((r) => r.list.length).join() === '16,8,4,2', 'the lists are not 16, 8, 4, 2');
	check(rows.map((r) => (r.yes ? 'yes' : 'no')).join() === 'no,yes,no,yes', 'the answers');
	check(list.length === 1 && list[0] === GOLD, 'the last place is not the gold\'s');
	rows.forEach((r, i) => i && check(r.list.join() === rows[i - 1].kept.join(), `row ${i + 1} is not the kept half of row ${i}`));
	return { rows, last: list };
}

// ---- the drawing (points) -----------------------------------------------------------------------------------------
const SIDE = 13.5;                  // a square
const PITCH = 16.5;                 // square to square along a row
const ROW = 19.5;                   // row to row
const STROKE = 0.55;                // a kept square's outline (as the reading maps' boxes were)
const LABEL_TO_ROW = 7;             // from the question's ink to the first square
const PALE = '#f3dfcb';             // drawing.ts, THEME: the pale tint of the first accent

export default async function () {
	const { rows, last } = mathematics();
	const S = new Sheet(name);
	const L = [];
	const q = await placed('\\text{in the left half?}', 0, 0, 0, 0.5, DIM);
	const qw = q.box.r - q.box.l;
	const width = qw + LABEL_TO_ROW + (N - 1) * PITCH + SIDE;
	const x0 = ORIGIN - width / 2, sx = x0 + qw + LABEL_TO_ROW, y0 = ORIGIN - 60;

	const square = async (x, y, k, kept, what) => {
		const d = `M${n2(x)},${n2(y)}h${SIDE}v${SIDE}h${-SIDE}Z`;
		if (kept) S.fill(d, { l: x, r: x + SIDE, t: y, b: y + SIDE }, { color: PALE, layer: 1, what, solid: false });
		S.path([[x, y], [x + SIDE, y], [x + SIDE, y + SIDE], [x, y + SIDE]], { color: kept ? ACCENT : RULE, width: kept ? STROKE : HAIR, closed: true, cap: 'butt', layer: 1.2, what });
		const g = await placed(String(k), x + SIDE / 2, y + SIDE / 2, 0.5, 0.5, kept ? INK : FAINT);
		g.on = [what];
		check(g.box.l - x >= 1.6 && x + SIDE - g.box.r >= 1.6 && g.box.t - y >= 2 && y + SIDE - g.box.b >= 2, `the number ${k} is tight in its square`);
		L.push(g);
	};

	for (const [i, r] of rows.entries()) {
		const y = y0 + i * ROW;
		L.push(await placed('\\text{in the left half?}', x0, y + SIDE / 2, 0, 0.5, DIM));
		for (const [j, k] of r.list.entries()) await square(sx + j * PITCH, y, k, r.kept.includes(k), `square ${k} of row ${i + 1}`);
	}
	const yl = y0 + rows.length * ROW;
	await square(sx, yl, last[0], true, 'the last place');

	// the summary, on the last row, in the room the halvings leave
	L.push(await placed('\\text{four questions, }\\log_2 16 = 4\\text{ bits}', sx + 3 * PITCH, yl + SIDE / 2, 0, 0.5, INK));

	S.checkAll(L);
	window.tutBitsQuestions = { rows: rows.map((r) => [r.list.length, r.yes]) };
	return finish(S, L, [240, 340]);
}
