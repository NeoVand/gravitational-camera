// The tutorial, section 7.2 (tutorial/geometry/curvature-and-tides.md), its third diagram: the twenty numbers of the
// curvature at an event, sorted by their time indices. Twenty small squares in a row, outlined in thin ink, in three
// blocks: 6 filled in the curvature's colour, R_0i0j, the tide E; 8 in a lighter tint of it, R_0ijk, the magnetic part
// B; 6 in faint ink, R_ijkl, no time index. A bracket over all twenty, "20 independent numbers at an event". Under each
// block its name. Under the names, a thin rule across all twenty columns, with a small tick under each square that
// stays free in empty space, 5 of the first block and 5 of the second, and the note "empty space: 5 + 5 = 10, the
// pixel's ten numbers (Einstein's equation)" under it. Sources are named by topic, never by section number, since the
// book and the site number the sections differently.
// Departures from the diagram's comment: each block's name is set on two to four lines ("R_0i0j" over "the tide E
// (6)"; "R_0ijk" over "the magnetic part B (8)" over "gravitomagnetism"; "R_ijkl" over "no time index (6)" over "fixed
// by E" over "in empty space", which the comment leaves to the caption), since on one line each is wider than its
// block; the drawing is about 260 points wide, so that its text stays readable on a phone. The squares free in empty
// space are marked by a small dot in the curvature's colour just under each, not by ticks on a rule under the names,
// which stood three lines from the squares they marked; the note, in two lines, opens with the same dot: "free in
// empty space: 5 + 5 = 10, the pixel's ten numbers (Einstein's equation)". The dotted squares are the first five of
// each of the two blocks: which five is a choice of basis, not drawn.
// Exact: the counts, computed in tut-curvature-lib.js as the free components of R_abcd under its symmetries (the rank
// of the linear conditions on its 256 entries), sorted by time indices, 6 + 8 + 6 = 20, and in empty space 5 + 5 = 10
// with the six of space fixed by the tide; the squares and dots counted on the page against them. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK, FAINT } from '../lib.js';
import { chapter, palette, stack, CURV } from './tut-curvature-lib.js';

const name = 'tut-curvature-count';
const check = checker(name);

export const SQ = 10.4;                           // a square's side
export const IN = 1.7;                            // the air between squares in a block
export const BLOCK = 10;                          // the air between blocks
export const OUTLINE = 0.45;                      // the squares' outline
const TINT_B = 0.42;                       // the magnetic part's fill: the curvature's colour at this opacity
const TINT_S = 0.3;                        // the space block's fill: faint ink at this opacity
export const BRACKET = 3.2;                       // the bracket's hooks
export const BRACKET_AIR = 3;                     // between the squares and the bracket
export const LINE_SKIP = 1.6;                     // between the lines of a name
const FREE_AIR = 2.2, FREE_R = 1.3;        // a free square's dot: its air under the square, its radius
const NOTE_AIR = 8;                        // between the names and the note

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const [all, tide, magnetic, space] = nums.count;
	const [vacE, vacB] = nums.vacuum;
	const S = new Sheet(name);
	const L = [];
	const blocks = [
		{ n: tide, fill: CURV, op: 1, lines: ['R_{0i0j}', '\\text{the tide }\\mathcal{E}\\text{ (' + tide + ')}'], free: vacE },
		{ n: magnetic, fill: CURV, op: TINT_B, lines: ['R_{0ijk}', '\\text{the magnetic part }\\mathcal{B}\\text{ (' + magnetic + ')}', '\\text{gravitomagnetism}'], free: vacB },
		{ n: space, fill: FAINT, op: TINT_S, lines: ['R_{ijkl}', '\\text{no time index (' + space + ')}', '\\text{fixed by }\\mathcal{E}', '\\text{in empty space}'], free: 0 }
	];
	const width = blocks.reduce((s, b) => s + b.n * SQ + (b.n - 1) * IN, 0) + 2 * BLOCK;
	let x = ORIGIN - width / 2;
	const top = ORIGIN - 20;
	const columns = [];                    // each square's centre x, and its block
	for (const [k, b] of blocks.entries()) {
		b.l = x;
		for (let i = 0; i < b.n; i++) {
			const l = x, r = x + SQ;
			S.raw(`<rect x="${l.toFixed(2)}" y="${top.toFixed(2)}" width="${SQ}" height="${SQ}" fill="${b.fill}"${b.op < 1 ? ` fill-opacity="${b.op}"` : ''}/>`, 1);
			const h = OUTLINE / 2;
			S.path([[l + h, top + h], [r - h, top + h], [r - h, top + SQ - h], [l + h, top + SQ - h]], { color: INK, width: OUTLINE, closed: true, layer: 2, what: `square ${columns.length}` });
			columns.push({ x: (l + r) / 2, k, i });
			x = r + (i < b.n - 1 ? IN : BLOCK);
		}
		b.r = x - BLOCK;
	}
	check(columns.length === all && all === 20, `${columns.length} squares`);
	check(blocks.map((b) => b.n).join() === '6,8,6', 'the blocks are not 6, 8 and 6');
	const left = columns[0].x - SQ / 2, right = columns[all - 1].x + SQ / 2;
	check(near(right - left, width - 0, 1e-9), 'the row\'s width');

	// ---- the bracket over all twenty, and its name
	{
		const y = top - BRACKET_AIR;
		S.path([[left, y], [left, y - BRACKET], [right, y - BRACKET], [right, y]], { color: INK, width: HAIR, cap: 'butt', what: 'the bracket' });
		L.push(await placed(`\\text{${all} independent numbers at an event}`, (left + right) / 2, y - BRACKET - LABEL_GAP - 0.4, 0.5, 1, INK));
	}

	// ---- a dot under each square that stays free in empty space, just under the squares
	const yDot = top + SQ + FREE_AIR + FREE_R;
	let free = 0;
	for (const c of columns) {
		if (c.i >= blocks[c.k].free) continue;
		S.raw(`<circle cx="${c.x.toFixed(2)}" cy="${yDot.toFixed(2)}" r="${FREE_R}" fill="${CURV}"/>`, 2);
		S.mark([[c.x, yDot]], FREE_R, `the free dot ${free}`);
		free++;
	}
	check(free === 10 && free === vacE + vacB && vacE === 5 && vacB === 5, `${free} free squares`);

	// ---- the names under the blocks, under the dots
	let bottom = top + SQ;
	for (const b of blocks) {
		const lab = await stack(b.lines, (b.l + b.r) / 2, yDot + FREE_R + LABEL_GAP + 1.2, 0.5, INK, LINE_SKIP);
		L.push(lab);
		bottom = Math.max(bottom, lab.box.b);
	}

	// ---- the note, a dot of the key before it: the two lines flush left, the whole centred under the row
	{
		const srcs = [`\\text{free in empty space: }${vacE} + ${vacB} = ${vacE + vacB}\\text{,}`, '\\text{the pixel\'s ten numbers (Einstein\'s equation)}'];
		const probe = await stack(srcs, 0, 0, 0, INK, LINE_SKIP);
		const lead = 2 * FREE_R + LABEL_GAP + 1, w = lead + probe.box.r - probe.box.l;
		const x = (left + right) / 2 - w / 2;
		const note = await stack(srcs, x + lead, bottom + NOTE_AIR, 0, INK, LINE_SKIP);
		L.push(note);
		const first = await placed(srcs[0], x + lead, bottom + NOTE_AIR, 0, 0, INK);
		const q = [x + FREE_R, (first.box.t + first.box.b) / 2];
		S.raw(`<circle cx="${q[0].toFixed(2)}" cy="${q[1].toFixed(2)}" r="${FREE_R}" fill="${CURV}"/>`, 2);
		S.mark([q], FREE_R, 'the note\'s dot');
	}

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [230, 300]);
}
