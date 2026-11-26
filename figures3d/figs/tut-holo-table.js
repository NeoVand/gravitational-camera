// The tutorial, section 13.8 (tutorial/what-a-field-keeps/holography.md), its second diagram: the four entries.
// A two-by-two table: columns "watching" and "pushing", rows "c -> infinity" and "finite c". Each cell has a small
// icon in ink, a line drawing (an eye; an eye with a clock; a hand; a hand with a wave), what the data give, the null
// space or the stability, and its sources in grey: watching, c -> infinity: the harmonic part only, the null space
// nabla^2 psi (section 2.5); watching, finite c: the light-cone transform only, the null space c^-2 psiddot -
// nabla^2 psi (Birkhoff; Devaney-Wolf; Bleistein-Cohen); pushing, c -> infinity: all of rho, logarithmic stability
// (13.2; Alessandrini, Mandache); pushing, finite c: waves through the body, |q| <= 2 omega / c, Hoelder to lambda/2,
// logarithmic beyond (Stefanov-Uhlmann). The two watching cells share the page's pale neutral tint, the pushing cells
// are white. Under the table a thin arrow from the watching column to the pushing column, "acting removes the null
// space"; right of the pushing column a thin arrow down it, "a short wave removes the logarithm to lambda/2".
// Departures from the diagram's comment: the text wins over the comment in two places: the null space of a field that
// travels is written as the text writes its source, c^-2 psiddot - nabla^2 psi, not as a box, which this section does
// not define; and the watching, finite-c cell names Bleistein and Cohen, whom the text cites for its being the whole
// null space. The sources of the cell pushing, c -> infinity are the text's: 13.2 for the logarithm, and Alessandrini
// and Mandache for its proof and its optimality. "Logarithmic beyond" is the comment's, the converse of the text's
// "to about half a wavelength" (design/research/holography/thread1-elliptic-hyperbolic.md, increasing stability).
// Exact: every entry against the chapter's text (tut-holo-lib.js asserts the sentences it draws from). Schematic: the
// icons.
import { Sheet, ORIGIN, finish, checker, placed, LABEL_GAP, n2 } from './tut-pot-lib.js';
import { TINT } from './tut-prob-lib.js';
import { INK, DIM, RULE } from '../lib.js';
import { chapter } from './tut-holo-lib.js';

const name = 'tut-holo-table';
const check = checker(name);

// ---- the drawing (points) ----------------------------------------------------------------------------------------
const COL = 122, ROW = [42, 60];                // the cells' width, the rows' heights
const HEAD_W = 40, HEAD_H = 20;                 // the row heads' column, the column heads' row
const GRID = 0.4, ICON_W = 0.5, ARROW_W = 0.45;
const BODY = 7.8, SRC = 6.8, HEAD = 8.5, NOTE = 7.2;
const PAD = 5, ICON = 16;                       // the cells' padding, the icons' box
const caption = 'Look first at the left column: watching, with or without the speed of light, leaves a null space. The entries are stated results, sourced in the text.';

// ---- the icons: line drawings in ink, in a box of 16 points, origin at its top left --------------------------------
const stroke = (d, w = ICON_W) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const eye = (s = 1) => stroke(`M0.5,${6 * s}Q${8 * s},${-1.5 * s} ${15.5 * s},${6 * s}Q${8 * s},${13.5 * s} 0.5,${6 * s}Z`) +
	`<circle cx="${8 * s}" cy="${6 * s}" r="${2.9 * s}" fill="none" stroke="${INK}" stroke-width="${ICON_W}"/>` +
	`<circle cx="${8 * s}" cy="${6 * s}" r="${1.15 * s}" fill="${INK}"/>`;
const clock = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${TINT}" stroke="${INK}" stroke-width="${ICON_W}"/>` +
	stroke(`M${x},${y}L${x},${y - 0.68 * r}M${x},${y}L${x + 0.5 * r},${y + 0.18 * r}`, ICON_W);
// an open hand, palm toward us, four fingers and the thumb, one outline; 11 wide and 16 tall
const HAND = 'M2.6,16L2.6,10.4L0.8,7.6Q0.2,6.5 1.2,6.1Q1.9,5.9 2.5,6.7L3.4,8L3.4,2.2Q3.4,1.3 4.25,1.3Q5.1,1.3 5.1,2.2L5.1,7' +
	'L5.1,1.1Q5.1,0.2 5.95,0.2Q6.8,0.2 6.8,1.1L6.8,7L6.8,1.6Q6.8,0.7 7.65,0.7Q8.5,0.7 8.5,1.6L8.5,7.4L8.5,3.2Q8.5,2.3 9.35,2.3' +
	'Q10.2,2.3 10.2,3.2L10.2,10.6Q10.2,13.2 8.8,14.4L8.8,16';
const hand = () => stroke(HAND);
const wave = (x, y, w, h) => {
	const pts = Array.from({ length: 41 }, (_, k) => [x + (w * k) / 40, y - h * Math.sin((4 * Math.PI * k) / 40)]);
	return stroke('M' + pts.map(([a, b]) => `${n2(a)},${n2(b)}`).join('L'));
};
const icons = {
	'0,0': () => ({ svg: eye(), w: 16, h: 12 }),
	'1,0': () => ({ svg: eye() + clock(14.2, 10.6, 3.6), w: 17.8, h: 14.2 }),
	'0,1': () => ({ svg: hand(), w: 10.7, h: 16 }),
	'1,1': () => ({ svg: hand() + wave(12.4, 8, 6.6, 1.7), w: 19, h: 16 })
};

export default async function () {
	const { state } = await chapter(check);
	state(name, 'holo-table', caption);
	const S = new Sheet(name);
	const L = [];
	const W = 2 * COL, H = ROW[0] + ROW[1];
	const x0 = ORIGIN - (W + HEAD_W) / 2 + HEAD_W - 30, y0 = ORIGIN - (H + HEAD_H) / 2 + HEAD_H;
	const xs = [x0, x0 + COL, x0 + 2 * COL], ys = [y0, y0 + ROW[0], y0 + H];

	// ---- the watching column's tint, under the grid
	S.raw(`<rect x="${n2(xs[0])}" y="${n2(ys[0])}" width="${COL}" height="${H}" fill="${TINT}"/>`, 0.3);

	// ---- the grid: under the column heads, between the rows and the columns, and right of the row heads
	for (const y of [ys[0], ys[1]]) S.path([[x0 - HEAD_W, y], [xs[2], y]], { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the rule at ${n2(y)}` });
	for (const x of [xs[0], xs[1]]) S.path([[x, y0 - HEAD_H], [x, ys[2]]], { color: RULE, width: GRID, cap: 'butt', layer: 0.5, what: `the rule at ${n2(x)}` });

	// ---- the heads
	for (const [j, s] of ['\\text{watching}', '\\text{pushing}'].entries()) L.push(await placed(s, xs[j] + COL / 2, y0 - HEAD_H / 2, 0.5, 0.5, INK, HEAD));
	for (const [i, s] of ['c \\to \\infty', '\\text{finite }c'].entries()) L.push(await placed(s, x0 - HEAD_W / 2, (ys[i] + ys[i + 1]) / 2, 0.5, 0.5, INK, HEAD));

	// ---- the cells: [row, column, lines], each line [TeX, colour, size]
	const cells = [
		[0, 0, [['\\text{harmonic part only}', INK, BODY], ['\\text{null space }\\nabla^2\\psi', INK, BODY], ['\\text{section 2.5}', DIM, SRC]]],
		[1, 0, [['\\text{light-cone transform only}', INK, BODY], ['\\text{null space }c^{-2}\\ddot\\psi - \\nabla^2\\psi', INK, BODY],
			['\\text{Birkhoff; Devaney–Wolf;}', DIM, SRC], ['\\text{Bleistein–Cohen}', DIM, SRC]]],
		[0, 1, [['\\text{all of }\\rho', INK, BODY], ['\\text{logarithmic stability}', INK, BODY], ['\\text{13.2; Alessandrini, Mandache}', DIM, SRC]]],
		[1, 1, [['\\text{waves through the body:}', INK, BODY], ['|\\mathbf q| \\le 2\\omega/c\\text{;}', INK, BODY],
			['\\text{H\\"{o}lder to }\\lambda/2\\text{,}', INK, BODY], ['\\text{logarithmic beyond}', INK, BODY], ['\\text{Stefanov–Uhlmann}', DIM, SRC]]]
	];
	for (const [i, j, lines] of cells) {
		const l = xs[j], r = xs[j + 1], t = ys[i], b = ys[i + 1], first = L.length;
		// the icon, at the top left
		const ic = icons[`${i},${j}`]();
		const ix = l + PAD, iy = t + PAD;
		S.raw(`<g transform="translate(${n2(ix)},${n2(iy)})">${ic.svg}</g>`, 2);
		S.boxes.push({ box: { l: ix - 0.5, r: ix + ic.w + 0.5, t: iy - 0.5, b: iy + ic.h + 0.5 }, what: `the icon (${i}, ${j})` });
		// the lines, from the icon's top, left-aligned at the column's indent, right of its wider icon
		let y = t + PAD + 1;
		const indent = l + PAD + (j === 0 ? 17.8 : 19) + 5;
		for (const [k, [src, color, size]] of lines.entries()) {
			const gap = k === 0 ? 0 : lines[k - 1][1] !== color ? 3.4 : 2.2;
			const probe = await placed(src, 0, 0, 0, 0, color, size);
			y += gap;
			L.push(await placed(src, indent, y, 0, 0, color, size));
			y += probe.box.b - probe.box.t;
		}
		check(L.slice(first).every((x) => x.box.l >= l + 2 && x.box.r <= r - 2 && x.box.t >= t + 2 && x.box.b <= b - 2), `the cell (${i}, ${j}) overflows`);
	}

	// ---- the arrows: across, under the table; down, right of the pushing column
	{
		const y = ys[2] + 9, a = [xs[0] + COL / 2, y], bb = [xs[1] + COL / 2, y];
		S.arrow(a, bb, { color: INK, width: ARROW_W, head: 3.6, what: 'the arrow across' });
		L.push(await placed('\\text{acting removes the null space}', (a[0] + bb[0]) / 2, y + 3.4, 0.5, 0, INK, NOTE));
	}
	{
		const x = xs[2] + 8, a = [x, (ys[0] + ys[1]) / 2], bb = [x, (ys[1] + ys[2]) / 2];
		S.arrow(a, bb, { color: INK, width: ARROW_W, head: 3.6, what: 'the arrow down' });
		L.push(await placed('\\begin{array}{l}\\text{a short wave}\\\\\\text{removes the}\\\\\\text{logarithm}\\\\\\text{to }\\lambda/2\\end{array}', x + 4.5, (a[1] + bb[1]) / 2, 0, 0.5, INK, NOTE));
	}

	S.checkAll(L, 1.8);
	window[name + '-numbers'] = { cells: cells.length };
	return finish(S, L, [260, 340]);
}
