// The tutorial, chapter 0.4 (tutorial/evening/one-pixel.md), its one diagram: the ten numbers of one reading,
// regrouped. Above, a bar of ten equal cells split 5 | 5: the five numbers of the tide (its stretch and squeeze) and
// the five of its magnetic part (the twist). Below, a bar of ten cells of the same width, split 4 | 3 | 3: the four
// invariants, the three angles of the field's own axes, and the three numbers of the velocity of its rest frame. The
// dividers of the two bars do not line up (asserted), and no line joins a cell above to a cell below: one broad arrow,
// as wide as the bars, runs from the whole upper bar to the whole lower one, because each lower number depends on all
// ten upper ones (the paper's equation eq:polar). The cells hold no values: the diagram counts, it does not compute.
// Neutral ink and the page's neutral tint only (Part 0 has no role colours). The strokes, labels and cropping are
// those of chapter 1.2's diagrams (figs/tut-pot-lib.js, imported).
import { tex, INK, DIM, RULE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, near, boxOf, n2, LINE, HAIR, TICK, SIZE } from './tut-pot-lib.js';

const name = 'tut-ten-numbers';
const check = checker(name);

// ---- the counts ---------------------------------------------------------------------------------------------------
export const UPPER = [5, 5];                   // the tide, the twist
export const LOWER = [4, 3, 3];                // the invariants, the axes, the velocity

// ---- the drawing (points, y down) ---------------------------------------------------------------------------------
const TINT = '#eeebe5';                        // the page's neutral tint (drawing.ts THEME): the broad arrow
const C = 29;                                  // a cell's width: the same for all twenty cells
const H = 15;                                  // a cell's height
const W = 10 * C;                              // a bar's width
const SEP = HAIR;                              // the lines between cells of one group, in the pale rule colour
const BR_GAP = 3;                              // air between a bar and its brackets' ticks
const BR_IN = 2.2;                             // a bracket stops this far inside its group's dividers
const LEAD = 10.5;                             // between the baselines of a two-line label
const ABOVE = 5;                               // from a bracket to the baseline of the label over it (room for
                                               // the descenders of q and of the parentheses)
const BELOW = 3;                               // from a bracket to the ascender height of the label under it
const ARROW_GAP = 4;                           // air between the broad arrow and each bar
const SHAFT = 27;                              // the broad arrow's straight part, top to the start of its point
const POINT = 17;                              // the depth of its point, a shallow V across the whole width
const BETWEEN = ARROW_GAP + SHAFT + POINT + ARROW_GAP;   // from the upper bar's foot to the lower bar's top

const UPPER_WORDS = [['stretch and squeeze (the tide)'], ['twist (the magnetic part)']];
const LOWER_WORDS = [['four invariants'], ['three angles', 'of the field’s axes'], ['the velocity', 'of its rest frame']];
const ARROW_WORDS = ['regrouped: each lower number', 'depends on all ten upper ones'];

/** The dividers of a bar split into groups of the given sizes: the x of each inner divider, in cells. */
const dividers = (groups) => groups.slice(0, -1).map((_, i) => groups.slice(0, i + 1).reduce((a, b) => a + b, 0));

export default async function () {
	check(UPPER.reduce((a, b) => a + b) === 10 && LOWER.reduce((a, b) => a + b) === 10, 'a bar does not hold ten numbers');
	const du = dividers(UPPER), dl = dividers(LOWER);
	check(du.every((d) => !dl.includes(d)), 'a divider of the upper bar lines up with one of the lower bar');

	const S = new Sheet(name);
	const X0 = ORIGIN - W / 2;
	const yU = ORIGIN - (H + BETWEEN) / 2 - H / 2;   // the upper bar's top
	const yL = yU + H + BETWEEN;                     // the lower bar's top
	const labels = [];

	// ---- the bars: ten equal cells each, a fine line between cells of a group, a full line between groups
	const bar = (y, groups, what) => {
		const inner = dividers(groups);
		for (let k = 1; k < 10; k++) {
			const x = X0 + k * C;
			const full = inner.includes(k);
			S.path([[x, y], [x, y + H]], { color: full ? INK : RULE, width: full ? LINE : SEP, layer: 2, cap: 'butt', what: `${what}: the line after cell ${k}` });
		}
		S.path([[X0, y], [X0 + W, y], [X0 + W, y + H], [X0, y + H]], { color: INK, width: LINE, layer: 3, closed: true, what: `${what}: its outline` });
		// the cells, exactly equal: each k C wide from the bar's left edge
		for (let k = 0; k < 10; k++) check(near(X0 + (k + 1) * C - (X0 + k * C), C, 1e-12), `${what}: cell ${k} is not ${C} pt wide`);
		return inner;
	};
	bar(yU, UPPER, 'the upper bar');
	bar(yL, LOWER, 'the lower bar');
	check(near(yL - (yU + H), BETWEEN, 1e-12), 'the bars are not BETWEEN apart');

	// ---- the brackets: above the upper bar, below the lower one, each spanning its group with small ticks toward
	// the bar; a group's label centred on its bracket
	const brackets = async (y, groups, words, side, what) => {
		let first = 0;
		const yb = side < 0 ? y - BR_GAP - TICK : y + H + BR_GAP + TICK;   // the bracket's long line
		for (const [g, n] of groups.entries()) {
			const a = X0 + first * C + BR_IN, b = X0 + (first + n) * C - BR_IN;
			first += n;
			S.path([[a, yb - side * TICK], [a, yb], [b, yb], [b, yb - side * TICK]], { color: DIM, width: HAIR, layer: 1, cap: 'butt', what: `${what}: the bracket of group ${g}` });
			const mid = (a + b) / 2;
			const lines = words[g];
			// above: the last baseline ABOVE over the bracket; below: the first line's top BELOW under it, so that
			// every lower label hangs from one line
			const capTop = await tex('\\text{h}', [0, 0], SIZE, 'cB', INK).then((s) => -boxOf(s).t);
			const base0 = side < 0 ? yb - ABOVE - (lines.length - 1) * LEAD : yb + BELOW + capTop;
			const parts = [];
			for (const [i, w] of lines.entries()) {
				const svg = await tex(`\\text{${w}}`, [mid, base0 + i * LEAD], SIZE, 'cB', i === 0 ? INK : DIM);
				parts.push({ svg, box: boxOf(svg) });
			}
			const box = { l: Math.min(...parts.map((p) => p.box.l)), r: Math.max(...parts.map((p) => p.box.r)), t: Math.min(...parts.map((p) => p.box.t)), b: Math.max(...parts.map((p) => p.box.b)) };
			// a label stays over its own group: no wider than its bracket
			check(box.r - box.l <= b - a + 1e-9, `${what}: the label of group ${g} (${n2(box.r - box.l)} pt) is wider than its bracket (${n2(b - a)} pt)`);
			labels.push({ src: lines.join(' / '), svg: parts.map((p) => p.svg).join(''), box });
		}
	};
	await brackets(yU, UPPER, UPPER_WORDS, -1, 'the upper bar');
	await brackets(yL, LOWER, LOWER_WORDS, +1, 'the lower bar');

	// ---- the broad arrow: as wide as the bars, from just under the upper bar to just over the lower one, its point a
	// shallow V across the whole width; the words inside it
	const t = yU + H + ARROW_GAP, s = t + SHAFT, p = s + POINT;
	check(near(yL - p, ARROW_GAP, 1e-12), 'the broad arrow does not stop ARROW_GAP over the lower bar');
	const outline = [[X0, t], [X0 + W, t], [X0 + W, s], [ORIGIN, p], [X0, s]];
	S.fill('M' + outline.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z', { l: X0, r: X0 + W, t, b: p }, { color: TINT, layer: 0, what: 'the broad arrow' });
	const words = [];
	const capTop = -boxOf(await tex('\\text{h}', [0, 0], SIZE, 'cB', INK)).t;
	// the two lines centred in the arrow's straight part: from its top to its bottom, ink to ink
	const span = capTop + LEAD;                               // cap height of the first line to the second baseline
	const b0 = t + (SHAFT - span) / 2 + capTop;
	for (const [i, w] of ARROW_WORDS.entries()) {
		const svg = await tex(`\\text{${w}}`, [ORIGIN, b0 + i * LEAD], SIZE, 'cB', INK);
		words.push({ svg, box: boxOf(svg) });
	}
	const wbox = { l: Math.min(...words.map((p) => p.box.l)), r: Math.max(...words.map((p) => p.box.r)), t: Math.min(...words.map((p) => p.box.t)), b: Math.max(...words.map((p) => p.box.b)) };
	check(wbox.b <= s, 'the words run into the broad arrow\'s point');
	labels.push({ src: ARROW_WORDS.join(' '), svg: words.map((p) => p.svg).join(''), box: wbox, on: ['the broad arrow'] });

	S.checkAll(labels);
	return finish(S, labels, [280, 340]);
}
