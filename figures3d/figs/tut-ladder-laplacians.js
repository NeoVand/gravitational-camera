// The tutorial, section 13.3 (tutorial/what-a-field-keeps/ladder.md), its first diagram: two columns of steps, read
// downward, on the page's ground. Left: r^4 H_2, an arrow "grad^2, x 36" down to r^2 H_2, an arrow "grad^2, x 14" down to
// H_2, an arrow "grad^2, x 0" down to 0: the factors 2j(2l + 2j + 1) for l = 2 and j = 2, 1, 0. Right: grad h . grad g
// = d_i h d_i g, an arrow "grad^2, x 2" down to d_i d_k h d_i d_k g, an arrow "grad^2, x 2" down to d_i d_k d_l h
// d_i d_k d_l g, and, g being a cubic, an arrow "grad^2" down to 0, beside it "g has no fourth derivatives". The rows of
// the two columns share their heights; the two zeros, set at the size of every other expression, share one baseline. Thin single strokes, all in ink.
// Departures from the diagram's comment: the final zeros are in ink, not in the blue of the paper's squeeze, which
// the tutorial keeps for a squeeze; both columns' first lines are boxed, not the left one alone, since both are where
// a column starts.
// Exact: every expression and factor, each asserted on exact polynomials in tut-ladder-lib.js (the left column for
// H_2 = x^2 - y^2, the right for a harmonic h of degree five and a harmonic cubic g). Nothing is drawn to scale.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, AXIS, AXIS_HEAD, HAIR } from './tut-pot-lib.js';
import { INK, DIM } from '../lib.js';
import { chapter, factor, DEGREE } from './tut-ladder-lib.js';

const name = 'tut-ladder-laplacians';
const check = checker(name);

const ROW = 33;                            // from one row's middle to the next
const APART = 116;                         // between the columns' middles
const PAD_X = 5, PAD_Y = 3.6;              // a box's ink to its outline
const OUTLINE = HAIR + 0.1;                // a box's outline (tut-linear-steps)
const ROUND = 2;                           // its corners
const CLEAR = 3.2;                         // from an expression's ink to an arrow's end
const caption = 'Look first at the two zeros at the bottom. On the left, each Laplacian lowers the power of $r$ by two and multiplies by a number, until $r^4H_2$ is gone after three steps. On the right, each Laplacian adds one derivative to each factor of $\\nabla h\\cdot\\nabla g$, until the derivatives of a cubic tide run out.';

export default async function () {
	const { state } = await chapter(check);
	state(name, 'ladder-laplacians', caption);
	const S = new Sheet(name);
	const L = [];
	const xL = ORIGIN - APART / 2, xR = ORIGIN + APART / 2;
	const y = (k) => ORIGIN + (k - 1.5) * ROW;

	// the factors, from the formula: 36, 14, 0
	const f = [2, 1, 0].map((j) => factor(DEGREE, j));
	check(f.join() === '36,14,0', `the factors ${f}`);
	const left = ['r^4H_2', 'r^2H_2', 'H_2'];
	const right = ['\\nabla h\\cdot\\nabla g = \\partial_ih\\,\\partial_ig', '\\partial_i\\partial_kh\\,\\partial_i\\partial_kg',
		'\\partial_i\\partial_k\\partial_lh\\,\\partial_i\\partial_k\\partial_lg'];
	const steps = [
		{ x: xL, rows: left, arrows: f.map((n) => `\\nabla^2,\\ {\\times}${n}`), box: 0 },
		{ x: xR, rows: right, arrows: ['\\nabla^2,\\ {\\times}2', '\\nabla^2,\\ {\\times}2', '\\nabla^2'], box: 0 }
	];

	// every row's expression shares the middle of its row; a strut gives each the height of the tallest
	const strut = '\\vphantom{\\partial_i\\partial_k\\partial_lh^4}';
	for (const col of steps) {
		const ends = [];
		for (const [k, src] of col.rows.entries()) {
			const e = await placed(strut + src, col.x, y(k), 0.5, 0.5, INK);
			L.push(e);
			ends.push(e.box);
			if (k === col.box) {
				// the first line boxed, as tut-linear-steps boxes a step
				const b = { l: e.box.l - PAD_X, r: e.box.r + PAD_X, t: e.box.t - PAD_Y, b: e.box.b + PAD_Y }, o = OUTLINE / 2;
				S.raw(`<rect x="${(b.l + o).toFixed(2)}" y="${(b.t + o).toFixed(2)}" width="${(b.r - b.l - OUTLINE).toFixed(2)}" height="${(b.b - b.t - OUTLINE).toFixed(2)}" rx="${ROUND}" fill="none" stroke="${INK}" stroke-width="${OUTLINE}"/>`, 1);
				S.mark([[b.l + o, b.t + o], [b.r - o, b.t + o], [b.r - o, b.b - o], [b.l + o, b.b - o], [b.l + o, b.t + o]], o, `the box of ${src}`);
				ends[k] = b;
			}
		}
		// the zero, at the size of the rest and on the same strut, in the row below the last expression
		const z = await placed(strut + '0', col.x, y(3), 0.5, 0.5, INK);
		L.push(z);
		ends.push(z.box);
		col.ends = ends;
	}
	// the two zeros share a baseline and a size
	check(near(L.at(-1).box.b, steps[0].ends[3].b, 1e-9), 'the zeros are not on one baseline');

	// the arrows, from each expression to the next, and their labels to the right
	const arrows = [];
	for (const col of steps) {
		for (let k = 0; k < 3; k++) {
			const a = S.arrow([col.x, col.ends[k].b + CLEAR], [col.x, col.ends[k + 1].t - CLEAR], { color: INK, width: AXIS, head: AXIS_HEAD, layer: 2, what: `the arrow ${col.x} ${k}` });
			arrows.push(a);
			const mid = (col.ends[k].b + col.ends[k + 1].t) / 2;
			const lab = await placed(col.arrows[k], col.x + LABEL_GAP + 2.2, mid, 0, 0.5, INK);
			L.push(lab);
			if (col === steps[1] && k === 2) {
				// why the last one ends at zero
				L.push(await placed('\\text{($g$ has no fourth derivatives)}', lab.box.r + 4.2, mid, 0, 0.5, DIM));
			}
		}
	}
	// the two columns' arrows of one step have one length
	for (let k = 0; k < 3; k++) check(near(arrows[k].L, arrows[k + 3].L, 0.6), `the arrows of step ${k + 1} differ: ${arrows[k].L} ${arrows[k + 3].L}`);
	check(arrows.every((a) => a.L > 9), 'an arrow is too short');
	// the left column's labels stay left of the right column's expressions
	const leftLabels = L.filter((l) => l.src.startsWith('\\nabla^2,') && l.box.l < ORIGIN);
	const rightInk = Math.min(...steps[1].ends.map((b) => b.l));
	check(leftLabels.every((l) => l.box.r + 8 < rightInk), 'the left labels reach the right column');

	S.checkAll(L);
	window[name + '-numbers'] = { factors: f };
	return finish(S, L, [240, 360]);
}
