// The tutorial, section 7.3 (tutorial/geometry/einstein-equation.md), its second diagram: section 7.2's row of twenty
// curvature numbers (figs/tut-curvature-count.js, the same squares, air and blocks of 6, 8 and 6), recoloured into
// Ricci and Weyl. In the first block 5 squares in the curvature's colour and 1 in matter's; in the second 5 and 3; in
// the third all 6 in matter's. Above the row two brackets: one in the curvature's colour over the ten Weyl squares,
// named "Weyl: from matter elsewhere (10)"; one in matter's colour over the ten Ricci squares, dotted where it jumps the
// Weyl squares between them, named "Ricci: fixed by the matter at the point (10)". Under the matter squares of each
// block a small name, "tr E", "the antisymmetric part of B", "fixed by E in vacuum"; under them each block's name,
// "R_0i0j: E (6)", "R_0ijk: B (8)", "R_ijkl (6)"; at the foot "empty space: the Ricci squares are zero, and
// 5 + 5 = 10 are left".
// Departures from the diagram's comment: the Weyl and the Ricci squares stand in two rows, each square in its own
// column of section 7.2's row, the Weyl squares above and the Ricci squares dropped one row below, so that each kind
// reads as one row with its name at its left ("Weyl (10): from matter elsewhere", "Ricci (10): set by the matter at the
// point", in their colours), and no brackets are needed: two brackets over interleaved groups had to cross, and the
// Weyl bracket ran over the square of tr E. The Weyl squares are the first five of each block, where section 7.2's
// figure dots the squares free in empty space, so that the two figures read alike (which five is a choice of basis).
// The blocks' names stand over the columns, each over a thin bracket that spans its block; the small names stand
// under the Ricci squares, "tr E", "antisymmetric / part of B" and "fixed by E / and the matter" (in two lines each
// where one would overlap). The foot does not say that the Ricci squares are zero in empty space, which the six of
// R_ijkl are not: it says what Einstein's equation makes of each group there, "empty space: tr E = 0, B is symmetric,
// R_ijkl is fixed by E; the Weyl tensor's 5 + 5 = 10 are left".
// Exact: the counts, from tut-curvature-lib.js (the free components of R_abcd, 20 = 6 + 8 + 6, and in empty space
// 10 = 5 + 5 + 0), and the Ricci squares 1 + 3 + 6 = 10 as their difference (tut-einstein-lib.js), the squares
// counted on the page against them, each column holding one square, in one of the rows. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR } from './tut-pot-lib.js';
import { INK } from '../lib.js';
import { SQ, IN, BLOCK, OUTLINE, BRACKET, BRACKET_AIR, LINE_SKIP } from './tut-curvature-count.js';
import { chapter, palette, stack, CURV, MATTER } from './tut-einstein-lib.js';

const name = 'tut-einstein-twenty';
const check = checker(name);

const ROW_GAP = 13;                        // between the Weyl row and the Ricci row
const NAME_AIR = 8;                        // from a row's name to the row's first column
const SMALL_AIR = LABEL_GAP + 1;           // from the Ricci squares to the small names
const FOOT_AIR = 8;                        // from the small names to the foot

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const [all, tide, magnetic, space] = nums.count;
	const blocks = [
		{ n: tide, weyl: nums.weyl[0], name: 'R_{0i0j}\\text{: }\\mathcal{E}\\text{ (' + tide + ')}', small: ['\\mathrm{tr}\\,\\mathcal{E}'] },
		{ n: magnetic, weyl: nums.weyl[1], name: 'R_{0ijk}\\text{: }\\mathcal{B}\\text{ (' + magnetic + ')}', small: ['\\text{antisymmetric}', '\\text{part of }\\mathcal{B}'] },
		{ n: space, weyl: nums.weyl[2], name: 'R_{ijkl}\\text{ (' + space + ')}', small: ['\\text{fixed by }\\mathcal{E}', '\\text{and the matter}'] }
	];
	const width = blocks.reduce((s, b) => s + b.n * SQ + (b.n - 1) * IN, 0) + 2 * BLOCK;
	const x0 = ORIGIN - width / 2 + 50;
	const top = ORIGIN - 20, low = top + SQ + ROW_GAP;   // the Weyl row's top and the Ricci row's
	const columns = [];                    // each square: its left and right, its block, and whether it is Weyl's
	let x = x0;
	for (const [k, b] of blocks.entries()) {
		b.l = x;
		for (let i = 0; i < b.n; i++) {
			const l = x, r = x + SQ, weyl = i < b.weyl, t = weyl ? top : low;
			S.raw(`<rect x="${l.toFixed(2)}" y="${t.toFixed(2)}" width="${SQ}" height="${SQ}" fill="${weyl ? CURV : MATTER}"/>`, 1);
			const h = OUTLINE / 2;
			S.path([[l + h, t + h], [r - h, t + h], [r - h, t + SQ - h], [l + h, t + SQ - h]], { color: INK, width: OUTLINE, closed: true, layer: 2, what: `square ${columns.length}` });
			columns.push({ l, r, k, i, weyl });
			x = r + (i < b.n - 1 ? IN : BLOCK);
		}
		b.r = x - BLOCK;
	}
	check(columns.length === all && all === 20 && blocks.map((b) => b.n).join() === '6,8,6', `${columns.length} squares`);
	const weylCount = blocks.map((b, k) => columns.filter((c) => c.k === k && c.weyl).length);
	const ricciCount = blocks.map((b, k) => columns.filter((c) => c.k === k && !c.weyl).length);
	check(weylCount.join() === '5,5,0' && weylCount.join() === nums.weyl.join(), `the Weyl squares ${weylCount}`);
	check(ricciCount.join() === '1,3,6' && ricciCount.join() === nums.ricci.join(), `the Ricci squares ${ricciCount}`);
	check(columns.filter((c) => c.weyl).length === 10 && columns.filter((c) => !c.weyl).length === 10, 'not ten and ten');
	check(near(columns[all - 1].r - columns[0].l, width, 1e-9), 'the row\'s width');

	// ---- the rows' names, at their left, in their colours
	const rowName = async (srcs, t, color) => {
		const probe = await stack(srcs, 0, 0, 1, color, LINE_SKIP);
		const h = probe.box.b - probe.box.t;
		return stack(srcs, x0 - NAME_AIR, t + SQ / 2 - h / 2, 1, color, LINE_SKIP);
	};
	L.push(await rowName(['\\text{Weyl (10):}', '\\text{from matter elsewhere}'], top, CURV));
	L.push(await rowName(['\\text{Ricci (10): set by}', '\\text{the matter at the point}'], low, MATTER));

	// ---- the blocks' names over the columns, each over a thin bracket that spans its block
	for (const [k, b] of blocks.entries()) {
		const y = top - BRACKET_AIR;
		S.path([[b.l, y], [b.l, y - BRACKET], [b.r, y - BRACKET], [b.r, y]], { color: INK, width: HAIR, cap: 'butt', what: `the bracket of block ${k}` });
		L.push(await placed(b.name, (b.l + b.r) / 2, y - BRACKET - LABEL_GAP - 0.4, 0.5, 1, INK));
	}

	// ---- the small names under each block's Ricci squares
	let below = low + SQ;
	for (const [k, b] of blocks.entries()) {
		const own = columns.filter((c) => c.k === k && !c.weyl);
		const lab = await stack(b.small, (own[0].l + own[own.length - 1].r) / 2, low + SQ + SMALL_AIR, 0.5, MATTER, LINE_SKIP);
		L.push(lab);
		below = Math.max(below, lab.box.b);
	}
	// ---- the foot: what Einstein's equation makes of each group in empty space
	L.push(await stack(['\\text{empty space: }\\mathrm{tr}\\,\\mathcal{E} = 0\\text{, }\\mathcal{B}\\text{ is symmetric, }R_{ijkl}\\text{ is fixed by }\\mathcal{E}\\text{;}',
		`\\text{the Weyl tensor's }${nums.weyl[0]} + ${nums.weyl[1]} = ${nums.weyl[0] + nums.weyl[1]}\\text{ are left}`], (columns[0].l + columns[all - 1].r) / 2, below + FOOT_AIR, 0.5, INK, LINE_SKIP));

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [300, 380]);
}
