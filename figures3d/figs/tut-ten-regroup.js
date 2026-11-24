// The tutorial, chapter 9.3 (tutorial/one-point/the-matrix-w.md), its second diagram: a pixel's ten numbers regrouped
// by what an observer can change, after chapter 0.4's tut-ten-numbers (its cells, brackets, strokes and labels). Above,
// ten cells in two rows of five, in the curvature's colour: the stretch, E (a tiny ring), and the twist, B (a tiny
// gyroscope), joined by a bracket, "W = E + iB, five complex numbers". Thin ink arrows lead from the whole upper block
// down to three groups: four cells, the eigenvalues, the same for every observer (with tr W^2 and tr W^3); three cells,
// R0, the field's own axes, three angles; three cells in the observer's colour, eta u, the velocity of the principal
// observer, v = c tanh eta R0 u. Under the groups, 10 = 4 + 3 + 3, and to the right, faint, light's 6 = 2 + 2 + 2
// (chapter 6.6). No orange or blue.
// Departures from the diagram's comment: the comment's "(Σ = 0)" is written sum w_a = 0, and "tr W^2, tr W^3" stands
// as the last line under the eigenvalues' cells, in the page's dim ink, not beside the cells, so that the drawing stays
// about 300 points wide and readable on a phone; each arrow starts from one point under the whole upper block, not from
// particular cells, because every lower number depends on all ten upper ones (chapter 0.4's reason for its one broad
// arrow; the paper's eq:polar); one tiny ring and one tiny gyroscope name the rows, beside their labels, not one per
// cell.
// Exact: the counts, from the dimension of the orbit of the complex rotations through a reading (figs/tut-matrix-w-lib.js:
// the rank of the six tangents, three turns and three boosts, among the ten real numbers of W, and among the six of
// light's F, in the principal frame): 4 invariants, 3 angles, 3 for the velocity; light's 2, 2 and 2; the sums printed
// from them and asserted against the chapter's text. Schematic: the cells hold no values; the icons.
import { Sheet, ORIGIN, finish, checker, placed, near, n2, LINE, HAIR, TICK, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { palette, OBS, CURV } from './tut-gravitomag-lib.js';
import { chapter } from './tut-matrix-w-lib.js';

const name = 'tut-ten-regroup';
const check = checker(name);

const C = 21;                                  // a cell's width: the same for all twenty cells
const H = 13;                                  // a cell's height
const ROW_GAP = 3;                             // between the two upper rows
const COL = 100;                               // a lower group's column: its labels stay inside it
const COL_GAP = 6;                             // between the columns
const SEP = 0.4, SEP_A = 0.45;                 // the lines between cells of one group: stroke, opacity
const TINT_A = 0.1;                            // the cells' tint
const DROP = 40;                               // from the upper block's foot to the lower cells' top
const ARROW_GAP = 4;                           // air at each end of an arrow
const ARROW_W = 0.5, ARROW_HEAD = 3.6;
const BR_GAP = 3;                              // the bracket's ticks from the cells
const LINE_SKIP = 2.4;                         // between lines of a label, ink to ink
const ICON = 6.5;                              // an icon's half-width
const SUM_DROP = 7;                            // from the lowest group label to the sums

export default async function () {
	const nums = await chapter(check);
	await palette(check);
	const g = nums.regroup.gravity, l = nums.regroup.light;
	const GROUPS = [g.invariants, g.angles, g.velocity];
	check(GROUPS.join() === '4,3,3' && GROUPS.reduce((a, b) => a + b) === g.total && g.total === 10, `gravity's groups ${GROUPS}`);
	check([l.invariants, l.angles, l.velocity].join() === '2,2,2' && l.total === 6, 'light\'s groups');

	const S = new Sheet(name);
	const L = [];
	const W = 3 * COL + 2 * COL_GAP;
	const X0 = ORIGIN - W / 2;
	const colX = (k) => X0 + k * (COL + COL_GAP) + COL / 2;          // a column's centre

	// ---- a group of n cells, centred at x, top y, in a colour
	const cells = (n, x, y, color, what) => {
		const a = x - (n * C) / 2;
		S.raw(`<rect x="${n2(a)}" y="${n2(y)}" width="${n * C}" height="${H}" fill="${color}" fill-opacity="${TINT_A}" stroke="none"/>`, 0);
		for (let k = 1; k < n; k++) S.raw(`<path d="M${n2(a + k * C)},${n2(y)}V${n2(y + H)}" stroke="${color}" stroke-opacity="${SEP_A}" stroke-width="${SEP}"/>`, 1);
		S.path([[a, y], [a + n * C, y], [a + n * C, y + H], [a, y + H]], { color, width: LINE, closed: true, layer: 2, what: `${what}'s outline` });
		for (let k = 0; k < n; k++) check(near(a + (k + 1) * C - (a + k * C), C, 1e-12), `${what}: a cell is not ${C} pt wide`);
		return { l: a, r: a + n * C, t: y, b: y + H };
	};

	// ---- the upper block: two rows of five over the middle column
	const yU = ORIGIN - 80;
	const rows = [cells(5, colX(1), yU, CURV, 'the stretch row'), cells(5, colX(1), yU + H + ROW_GAP, CURV, 'the twist row')];
	// the rows' names, right-aligned left of the icons
	const iconX = rows[0].l - LABEL_GAP - 2 - ICON;
	{
		// a tiny ring: a stretched ellipse of eight balls (the stretch row)
		const [X, Y] = [iconX, rows[0].t + H / 2];
		S.raw(`<ellipse cx="${n2(X)}" cy="${n2(Y)}" rx="${ICON}" ry="${n2(ICON * 0.68)}" fill="none" stroke="${INK}" stroke-width="0.35"/>`, 2);
		for (let k = 0; k < 8; k++) {
			const t = (k * Math.PI) / 4;
			S.raw(`<circle cx="${n2(X + ICON * Math.cos(t))}" cy="${n2(Y + ICON * 0.68 * Math.sin(t))}" r="0.95" fill="${INK}"/>`, 3);
		}
		S.mark(Array.from({ length: 73 }, (_, i) => [X + ICON * Math.cos((i * Math.PI) / 36), Y + ICON * 0.68 * Math.sin((i * Math.PI) / 36)]), 1, 'the tiny ring');
		// a tiny gyroscope (the twist row): a disc on an axle, chapter 7.5's
		const [Xg, Yg] = [iconX, rows[1].t + H / 2], a = ICON * 0.85, b = 1.5, ax = 5.2;
		S.path([[Xg, Yg], [Xg, Yg + ax]], { color: INK, width: 0.5, layer: 2, what: 'the tiny gyroscope\'s axle' });
		S.raw(`<ellipse cx="${n2(Xg)}" cy="${n2(Yg)}" rx="${n2(a)}" ry="${b}" fill="${FAINT}" stroke="${INK}" stroke-width="0.35"/>`, 3);
		S.boxes.push({ box: { l: Xg - a, r: Xg + a, t: Yg - b, b: Yg + b }, what: 'the tiny gyroscope' });
		S.path([[Xg, Yg - b], [Xg, Yg - ax]], { color: INK, width: 0.5, layer: 4, what: 'the tiny gyroscope\'s axle' });
	}
	const right = iconX - ICON - LABEL_GAP - 1;
	L.push(await placed('\\text{stretch, }\\mathcal E\\ (5)', right, rows[0].t + H / 2, 1, 0.5, INK));
	L.push(await placed('\\text{twist, }\\mathcal B\\ (5)', right, rows[1].t + H / 2, 1, 0.5, INK));
	// the bracket joining the two rows, at their right, and its words
	{
		const xb = rows[0].r + BR_GAP + TICK, t = rows[0].t + 1.5, b = rows[1].b - 1.5;
		S.path([[xb - TICK, t], [xb, t], [xb, b], [xb - TICK, b]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: 'the bracket' });
		const mid = (t + b) / 2;
		const a = await placed('\\mathcal W = \\mathcal E + i\\mathcal B,', xb + LABEL_GAP + 1, mid - LINE_SKIP / 2, 0, 1, INK);
		const c = await placed('\\text{five complex numbers}', xb + LABEL_GAP + 1, mid + LINE_SKIP / 2, 0, 0, INK);
		L.push(a, c);
	}
	const upperFoot = rows[1].b;

	// ---- the lower groups
	const yL = upperFoot + DROP;
	const colors = [CURV, CURV, OBS];
	const groups = GROUPS.map((n, k) => cells(n, colX(k), yL, colors[k], `group ${k}`));
	check(groups.every((q, k) => q.r - q.l <= COL && (k === 0 || q.l > groups[k - 1].r + 10)), 'the groups crowd their columns');

	// ---- the arrows: from one point under the whole upper block to the top of each group
	const from = [colX(1), upperFoot + ARROW_GAP];
	for (const [k, q] of groups.entries()) {
		const to = [(q.l + q.r) / 2, q.t - ARROW_GAP];
		S.arrow(from, to, { color: INK, width: ARROW_W, head: ARROW_HEAD, layer: 2, what: `the arrow to group ${k}` });
	}

	// ---- the groups' words, each line inside its column
	const WORDS = [
		[['\\text{eigenvalues }w_1, w_2, w_3', INK], ['{\\textstyle\\sum} w_a = 0\\text{: the same}', INK], ['\\text{for every observer}', INK], ['\\mathrm{tr}\\,\\mathcal W^2,\\ \\mathrm{tr}\\,\\mathcal W^3', DIM]],
		[['R_0\\text{: the field’s own}', INK], ['\\text{axes, three angles}', INK]],
		[['\\eta\\hat u\\text{: the velocity of}', OBS], ['\\text{the principal observer,}', OBS], ['\\boldsymbol v = c\\tanh\\eta\\,R_0\\hat u', OBS]]
	];
	let lowest = 0;
	for (const [k, lines] of WORDS.entries()) {
		let t = yL + H + LABEL_GAP + 2;
		for (const [src, color] of lines) {
			const q = await placed(src, colX(k), t, 0.5, 0, color);
			check(q.box.r - q.box.l <= COL + 1e-9, `the line ${src} (${n2(q.box.r - q.box.l)} pt) is wider than its column`);
			L.push(q);
			t = q.box.b + LINE_SKIP;
			lowest = Math.max(lowest, q.box.b);
		}
	}

	// ---- the sums: gravity's under the groups, light's to the right, faint
	const sum = `${g.total} = ${g.invariants} + ${g.angles} + ${g.velocity}`, light = `${l.total} = ${l.invariants} + ${l.angles} + ${l.velocity}`;
	check(sum === '10 = 4 + 3 + 3' && light === '6 = 2 + 2 + 2', 'the sums');
	const ys = lowest + SUM_DROP;
	L.push(await placed(sum, colX(1), ys, 0.5, 0, INK));
	L.push(await placed(`\\text{light: }${light}`, X0 + W, ys, 1, 0, FAINT));

	S.checkAll(L);
	window[name + '-numbers'] = { gravity: g, light: l };
	return finish(S, L, [280, 340]);
}
