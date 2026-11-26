// The tutorial, section 9.6 (tutorial/one-point/the-sky-at-one-point.md), its first diagram: which of the hundred real
// numbers of one pixel's spectral matrix a sky of independent waves can fill. The 10 x 10 spectral matrix in the
// helicity coordinates, rows w+ and w-*, columns their conjugate transposes, drawn as a square of four 5 x 5 blocks,
// with a tick at every row and column on the square's top and left edges. Upper left C+, tinted in the sky's colour,
// "C+: (1/2)(I + V): 25"; lower right C-*, tinted, "C-*: (1/2)(I - V): 25"; upper right C+-, split along its diagonal
// by a staircase on the cells' edges into its symmetric part, the 15 cells on and above the diagonal, tinted, "C+-,
// symmetric: Q - iU at degree 4: 18" and "checks: 12", and its antisymmetric part, the 10 cells below, in grey,
// "antisymmetric: checks: 20"; lower left left blank, its text faint, "conjugate transpose of C+-: no new numbers". A
// bar under the square, as wide as it and a hundred units long, in five pieces, 25, 25 and 18 tinted and 12 and 20
// grey, with "25 + 25 + 18 = 68" under the first three in the sky's colour and "12 + 20 = 32" under the last two in
// grey. The sky's colour is the curvature's, as in all of Part 9; no orange or blue.
// Departures from the diagram's comment: the antisymmetric part is a grey tint, not a hatch, since a hatch's lines would
// run under its label; the block names C+, C-* and C+- stand in the blocks over their labels, and the rows and columns
// are named outside the square, so that the reader sees why the lower left block is the conjugate transpose of the upper
// right; the symmetric part's 15 cells hold both its 18 numbers of the sky and its 12 checks, which are combinations
// of entries, not cells, so its tint is the sky's and the 12 stands in grey beneath the 18.
// Exact: every count, computed in figs/tut-sky-lib.js as the rank of the span of the spectral matrices of single waves
// from 500 random directions in four states of polarization (68 in all; 25, 25 and 18 in the blocks; 18 and 0 in the
// symmetric and antisymmetric parts of C+-), asserted against the chapter's text; the pieces of the bar, in proportion
// to the counts; the 15 and 10 cells of the two parts of C+-, counted on the page. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, TICK, n2 } from './tut-pot-lib.js';
import { INK, DIM, FAINT } from '../lib.js';
import { chapter, CURV } from './tut-sky-lib.js';

const name = 'tut-sky-spectral-blocks';
const check = checker(name);

const CELL = 23;                           // a cell's side
const GRID = 0.45;                         // the blocks' outlines and the staircase
const TINT = 0.32;                         // the sky's colour at this opacity
const GREY = 0.3;                          // faint ink at this opacity (as sections 7.2 and 7.6's counts)
const PAD = 4;                             // a block's text in from its edges
const HEAD_AIR = 3;                        // the names of the rows and columns from the ticks
const BAR_AIR = 9, BAR_H = 9, BAR_GAP = 1.4;   // the bar under the square: its air, height, and the air between pieces
const SUM_AIR = 3.2;                       // the sums under the bar
const SKIP = 2;                            // between the lines of a block's text

export default async function () {
	const nums = await chapter(check);
	const [up, down, linear] = nums.sky, [symChecks, antiChecks] = nums.checks;
	const S = new Sheet(name);
	const L = [];
	const B = 5 * CELL, side = 2 * B;
	const x0 = ORIGIN - B, y0 = ORIGIN - B - 20;
	const X = (j) => x0 + j * CELL, Y = (i) => y0 + i * CELL;
	const poly = (pts) => 'M' + pts.map(([x, y]) => `${n2(x)},${n2(y)}`).join('L') + 'Z';
	const square = (l, t, w, h) => [[l, t], [l + w, t], [l + w, t + h], [l, t + h]];

	// ---- the fills: C+ and C-* tinted; C+- split along its diagonal, on and above it tinted, below it grey
	S.raw(`<path d="${poly(square(X(0), Y(0), B, B))}" fill="${CURV}" fill-opacity="${TINT}"/>`, 0);
	S.raw(`<path d="${poly(square(X(5), Y(5), B, B))}" fill="${CURV}" fill-opacity="${TINT}"/>`, 0);
	// the staircase between the upper right block's cells (i, j), j >= i, and those below them: from the block's left
	// edge at row 1, right one cell and down one row, four times, to its bottom
	const staircase = [[X(5), Y(1)]];
	for (let i = 1; i <= 4; i++) { staircase.push([X(5 + i), Y(i)]); staircase.push([X(5 + i), Y(i + 1)]); }
	const upper = [[X(5), Y(0)], [X(10), Y(0)], [X(10), Y(5)], ...staircase.slice().reverse()];
	const lower = [[X(5), Y(1)], ...staircase.slice(1), [X(5), Y(5)]];
	S.raw(`<path d="${poly(upper)}" fill="${CURV}" fill-opacity="${TINT}"/>`, 0);
	S.raw(`<path d="${poly(lower)}" fill="${FAINT}" fill-opacity="${GREY}"/>`, 0);
	// the cells of the two parts, counted: a cell's centre in the upper or lower polygon
	const inside = (pts, [x, y]) => {
		let c = false;
		for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
			const [xi, yi] = pts[i], [xj, yj] = pts[j];
			if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
		}
		return c;
	};
	let nUp = 0, nLow = 0;
	for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
		const p = [X(5 + j + 0.5), Y(i + 0.5)];
		const a = inside(upper, p), b = inside(lower, p);
		check(a !== b && a === (j >= i), `the cell ${i}, ${j} of C+-`);
		if (a) nUp++; else nLow++;
	}
	check(nUp === 15 && nLow === 10 && nUp * 2 === linear + symChecks && nLow * 2 === antiChecks, `the cells ${nUp} and ${nLow}`);

	// ---- the lines: the square, the cross between its blocks, the staircase
	S.path(square(x0, y0, side, side), { color: INK, width: GRID, closed: true, cap: 'square', layer: 1, what: 'the square' });
	S.path([[X(5), Y(0)], [X(5), Y(10)]], { color: INK, width: GRID, cap: 'butt', layer: 1, what: 'the middle column line' });
	S.path([[X(0), Y(5)], [X(10), Y(5)]], { color: INK, width: GRID, cap: 'butt', layer: 1, what: 'the middle row line' });
	S.path(staircase, { color: INK, width: GRID, cap: 'butt', layer: 1, what: 'the staircase' });

	// ---- the ticks of the rows and columns, outward on the top and left edges
	for (let k = 1; k < 10; k++) {
		if (k === 5) continue;
		S.path([[X(k), y0], [X(k), y0 - TICK]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the column tick ${k}` });
		S.path([[x0, Y(k)], [x0 - TICK, Y(k)]], { color: DIM, width: HAIR, cap: 'butt', layer: 1, what: `the row tick ${k}` });
	}
	// the names of the rows and columns: x = (w+, w-*) down the side, x^dagger across the top
	L.push(await placed('\\mathbf w_+^\\dagger', X(2.5), y0 - TICK - HEAD_AIR, 0.5, 1, INK));
	L.push(await placed('\\mathbf w_-^{\\mathsf T}', X(7.5), y0 - TICK - HEAD_AIR, 0.5, 1, INK));
	L.push(await placed('\\mathbf w_+', x0 - TICK - HEAD_AIR, Y(2.5), 1, 0.5, INK));
	L.push(await placed('\\mathbf w_-^*', x0 - TICK - HEAD_AIR, Y(7.5), 1, 0.5, INK));

	// ---- the blocks' text
	// a block's text: lines one under another, each in its colour, checked as one label
	const group = (parts) => ({ src: parts.map((p) => p.src).join(' / '), svg: parts.map((p) => p.svg).join(''), box: { l: Math.min(...parts.map((p) => p.box.l)), r: Math.max(...parts.map((p) => p.box.r)), t: parts[0].box.t, b: parts[parts.length - 1].box.b } });
	const lines = async (rows, x, y, ax) => {
		const parts = [];
		let t = y;
		for (const [src, color] of rows) { const p = await placed(src, x, t, ax, 0, color); parts.push(p); t = p.box.b + SKIP; }
		return parts;
	};
	const centred = async (rows, x, y) => {
		const probe = await lines(rows, 0, 0, 0.5);
		const h = probe[probe.length - 1].box.b - probe[0].box.t;
		return group(await lines(rows, x, y - h / 2, 0.5));
	};
	const half = (s) => `\\tfrac12(I ${s} V)\\text{: }`;
	check(up === 25 && down === 25, 'the diagonal blocks');
	L.push(await centred([['C_+', INK], [`${half('+')}${up}`, INK]], X(2.5), Y(2.5)));
	L.push(await centred([['C_-^*', INK], [`${half('-')}${down}`, INK]], X(7.5), Y(7.5)));
	L.push(await centred([['\\text{conjugate transpose}', FAINT], ['\\text{of }C_{+-}\\text{:}', FAINT], ['\\text{no new numbers}', FAINT]], X(2.5), Y(7.5)));
	// the symmetric part: right-aligned in its upper rows
	L.push(group(await lines([['C_{+-}\\text{, symmetric:}', INK], [`Q - iU\\text{ at degree 4: }${linear}`, INK], [`\\text{checks: }${symChecks}`, DIM]], X(10) - PAD, Y(0) + PAD + 0.6, 1)));
	// the antisymmetric part: left-aligned in its lowest rows
	{
		const rows = [['\\text{antisymmetric:}', DIM], [`\\text{checks: }${antiChecks}`, DIM]];
		const probe = await lines(rows, 0, 0, 0);
		const h = probe[probe.length - 1].box.b - probe[0].box.t;
		L.push(group(await lines(rows, X(5) + PAD, Y(5) - PAD - 0.6 - h, 0)));
	}

	// ---- the bar: a hundred units across the square's width, in five pieces
	const pieces = [[up, CURV, TINT], [down, CURV, TINT], [linear, CURV, TINT], [symChecks, FAINT, GREY], [antiChecks, FAINT, GREY]];
	const total = pieces.reduce((s, p) => s + p[0], 0);
	check(total === 100, `the bar adds to ${total}`);
	const unit = side / total, yb = Y(10) + BAR_AIR;
	let at = x0;
	const ends = [];
	for (const [k, [v, color, op]] of pieces.entries()) {
		const l = at + (k > 0 ? BAR_GAP / 2 : 0), r = at + v * unit - (k < pieces.length - 1 ? BAR_GAP / 2 : 0);
		S.raw(`<path d="${poly(square(l, yb, r - l, BAR_H))}" fill="${color}" fill-opacity="${op}"/>`, 0);
		S.boxes.push({ box: { l, r, t: yb, b: yb + BAR_H }, what: `the bar's piece ${k}` });
		ends.push(at + v * unit);
		at += v * unit;
	}
	check(near(at, X(10), 1e-9), 'the bar is not as wide as the square');
	const skyEnd = ends[2];
	check(near((skyEnd - x0) / unit, 68, 1e-9), 'the sky\'s pieces are not 68 units');
	const sum = (vs) => `${vs.join(' + ')} = ${vs.reduce((s, v) => s + v, 0)}`;
	const s1 = sum([up, down, linear]), s2 = sum([symChecks, antiChecks]);
	check(s1 === '25 + 25 + 18 = 68' && s2 === '12 + 20 = 32', `the sums ${s1}, ${s2}`);
	L.push(await placed(s1, (x0 + skyEnd) / 2, yb + BAR_H + SUM_AIR, 0.5, 0, CURV));
	L.push(await placed(s2, (skyEnd + X(10)) / 2, yb + BAR_H + SUM_AIR, 0.5, 0, DIM));

	S.checkAll(L);
	window[name + '-numbers'] = { sky: nums.sky, checks: nums.checks, cells: [nUp, nLow] };
	return finish(S, L, [220, 300]);
}
