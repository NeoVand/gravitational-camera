// The tutorial, section 7.3 (tutorial/geometry/einstein-equation.md), its second diagram: section 7.2's row of twenty
// curvature numbers (figs/tut-curvature-count.js, the same squares, air and blocks of 6, 8 and 6), recoloured into
// Ricci and Weyl. In the first block 5 squares in the curvature's colour and 1 in matter's; in the second 5 and 3; in
// the third all 6 in matter's. Above the row two brackets: one in the curvature's colour over the ten Weyl squares,
// named "Weyl: from matter elsewhere (10)"; one in matter's colour over the ten Ricci squares, dotted where it jumps the
// Weyl squares between them, named "Ricci: fixed by the matter at the point (10)". Under the matter squares of each
// block a small name, "tr E", "the antisymmetric part of B", "fixed by E in vacuum"; under them each block's name,
// "R_0i0j: E (6)", "R_0ijk: B (8)", "R_ijkl (6)"; at the foot "empty space: the Ricci squares are zero, and
// 5 + 5 = 10 are left".
// Departures from the diagram's comment: the Weyl squares are the first five of each block, where section 7.2's figure
// ticks the squares free in empty space, so that the two rows read alike (which five is a choice of basis). The Ricci
// bracket is solid over the matter squares and dotted where it jumps the Weyl squares, and it stands below the Weyl
// bracket, whose hooks over the second block cross its dotted jump through a gap; the two brackets cannot both be
// drawn above interleaved groups without one crossing the other. The Ricci bracket's name stands in two lines over its
// right-hand piece, the Weyl bracket's over its middle. The small names under the second and third blocks are set in
// two lines each ("antisymmetric / part of B", "fixed by E / in vacuum"), which on one line overlap.
// Exact: the counts, from tut-curvature-lib.js (the free components of R_abcd, 20 = 6 + 8 + 6, and in empty space
// 10 = 5 + 5 + 0), and the Ricci squares 1 + 3 + 6 = 10 as their difference (tut-einstein-lib.js), the squares
// counted on the page against them. Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, placed, near, LABEL_GAP, HAIR, DOT_STEP } from './tut-pot-lib.js';
import { INK } from '../lib.js';
import { SQ, IN, BLOCK, OUTLINE, BRACKET, BRACKET_AIR, LINE_SKIP } from './tut-curvature-count.js';
import { chapter, palette, stack, CURV, MATTER } from './tut-einstein-lib.js';

const name = 'tut-einstein-twenty';
const check = checker(name);

const BRACKET_W = 0.55;                    // the brackets' stroke
const WEYL_UP = 7;                         // the Weyl bracket stands this far above the Ricci bracket
const JUMP = 1.6;                          // the dotted jump leaves this much air each side of a hook it passes
const HOOK_IN = 1.4;                       // each hook stands this far inside its group's outer square edge
const SMALL_AIR = LABEL_GAP + 1;           // from the squares to the small names
const NAME_AIR = 5;                        // from the small names to the blocks' names
const FOOT_AIR = 6;                        // from the blocks' names to the foot

export default async function () {
	const nums = chapter(check);
	await palette(check);
	const S = new Sheet(name);
	const L = [];
	const [all, tide, magnetic, space] = nums.count;
	const blocks = [
		{ n: tide, weyl: nums.weyl[0], name: 'R_{0i0j}\\text{: }\\mathcal{E}\\text{ (' + tide + ')}', small: ['\\mathrm{tr}\\,\\mathcal{E}'] },
		{ n: magnetic, weyl: nums.weyl[1], name: 'R_{0ijk}\\text{: }\\mathcal{B}\\text{ (' + magnetic + ')}', small: ['\\text{antisymmetric}', '\\text{part of }\\mathcal{B}'] },
		{ n: space, weyl: nums.weyl[2], name: 'R_{ijkl}\\text{ (' + space + ')}', small: ['\\text{fixed by }\\mathcal{E}', '\\text{in vacuum}'] }
	];
	const width = blocks.reduce((s, b) => s + b.n * SQ + (b.n - 1) * IN, 0) + 2 * BLOCK;
	let x = ORIGIN - width / 2;
	const top = ORIGIN - 20;
	const columns = [];                    // each square: its left and right, its block, and whether it is Weyl's
	for (const [k, b] of blocks.entries()) {
		b.l = x;
		for (let i = 0; i < b.n; i++) {
			const l = x, r = x + SQ, weyl = i < b.weyl;
			S.raw(`<rect x="${l.toFixed(2)}" y="${top.toFixed(2)}" width="${SQ}" height="${SQ}" fill="${weyl ? CURV : MATTER}"/>`, 1);
			const h = OUTLINE / 2;
			S.path([[l + h, top + h], [r - h, top + h], [r - h, top + SQ - h], [l + h, top + SQ - h]], { color: INK, width: OUTLINE, closed: true, layer: 2, what: `square ${columns.length}` });
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

	// ---- the groups: runs of squares of one kind, in order
	const groups = [];
	for (const c of columns) {
		const g = groups[groups.length - 1];
		if (g && g.weyl === c.weyl) { g.r = c.r; g.n++; } else groups.push({ weyl: c.weyl, l: c.l, r: c.r, n: 1 });
	}
	check(groups.map((g) => `${g.weyl ? 'W' : 'R'}${g.n}`).join() === 'W5,R1,W5,R9', `the groups ${groups.map((g) => g.n)}`);
	const weylGroups = groups.filter((g) => g.weyl), ricciGroups = groups.filter((g) => !g.weyl);

	// ---- the Weyl bracket: hooks at each end of its two groups, one line across from the first to the last
	const yHook = top - BRACKET_AIR;
	const yR = yHook - BRACKET, yW = yR - WEYL_UP;
	const hooksW = weylGroups.flatMap((g) => [g.l + HOOK_IN, g.r - HOOK_IN]);
	for (const [j, hx] of hooksW.entries()) S.path([[hx, yHook], [hx, yW]], { color: CURV, width: BRACKET_W, cap: 'butt', what: `the Weyl bracket's hook ${j}` });
	S.path([[hooksW[0], yW], [hooksW[hooksW.length - 1], yW]], { color: CURV, width: BRACKET_W, cap: 'butt', what: 'the Weyl bracket' });

	// ---- the Ricci bracket: solid over its groups, dotted across the Weyl squares between them, with a gap at each
	// Weyl hook it passes
	for (const [j, g] of ricciGroups.entries()) {
		S.path([[g.l + HOOK_IN, yHook], [g.l + HOOK_IN, yR], [g.r - HOOK_IN, yR], [g.r - HOOK_IN, yHook]], { color: MATTER, width: BRACKET_W, cap: 'butt', what: `the Ricci bracket over group ${j}` });
	}
	{
		const a = ricciGroups[0].r - HOOK_IN, b = ricciGroups[1].l + HOOK_IN;
		const crossed = hooksW.filter((hx) => hx > a && hx < b);
		check(crossed.length === 2, `the dotted jump passes ${crossed.length} Weyl hooks`);
		const stops = [a + 0.9, ...crossed.flatMap((hx) => [hx - JUMP, hx + JUMP]), b - 0.9];
		for (let s = 0; s < stops.length; s += 2) if (stops[s + 1] - stops[s] >= 1) S.dots([stops[s], yR], [stops[s + 1], yR], { color: MATTER, what: `the Ricci bracket's jump ${s / 2}` });
		for (const hx of crossed) { const c = S.clearance({ l: hx, r: hx, t: yR, b: yR }, (w) => !w.startsWith('the Ricci bracket\'s jump')); check(c.d >= JUMP - 0.5, `a dot sits on a Weyl hook: ${c.d} from ${c.what}`); }
	}

	// ---- the brackets' names
	const weylName = await placed('\\text{Weyl: from matter elsewhere (10)}', (hooksW[0] + hooksW[hooksW.length - 1]) / 2, yW - LABEL_GAP - 0.5, 0.5, 1, CURV);
	L.push(weylName);
	{
		const g = ricciGroups[1];
		const probe = await stack(['\\text{Ricci: fixed by the matter}', '\\text{at the point (10)}'], 0, 0, 0.5, MATTER, LINE_SKIP);
		const h = probe.box.b - probe.box.t;
		L.push(await stack(['\\text{Ricci: fixed by the matter}', '\\text{at the point (10)}'], (g.l + g.r) / 2, yR - LABEL_GAP - 0.5 - h, 0.5, MATTER, LINE_SKIP));
	}

	// ---- the small names under each block's matter squares
	let below = top + SQ;
	for (const [k, b] of blocks.entries()) {
		const own = columns.filter((c) => c.k === k && !c.weyl);
		const lab = await stack(b.small, (own[0].l + own[own.length - 1].r) / 2, top + SQ + SMALL_AIR, 0.5, MATTER, LINE_SKIP);
		L.push(lab);
		below = Math.max(below, lab.box.b);
		b.small$ = lab;
	}
	check(blocks[1].small$.box.l > columns.find((c) => c.k === 1 && !c.weyl).l - 12, 'the second small name reaches far under the Weyl squares');
	// ---- the blocks' names
	let names = below;
	for (const b of blocks) {
		const lab = await placed(b.name, (b.l + b.r) / 2, below + NAME_AIR, 0.5, 0, INK);
		L.push(lab);
		names = Math.max(names, lab.box.b);
	}
	L.push(await placed(`\\text{empty space: the Ricci squares are zero, and }${nums.weyl[0]} + ${nums.weyl[1]} = ${nums.weyl[0] + nums.weyl[1]}\\text{ are left}`, (columns[0].l + columns[all - 1].r) / 2, names + FOOT_AIR, 0.5, 0, INK));
	check(near(columns[all - 1].r - columns[0].l, width, 1e-9), 'the row\'s width');
	void HAIR;

	S.checkAll(L);
	window[name + '-numbers'] = nums;
	return finish(S, L, [240, 300]);
}
