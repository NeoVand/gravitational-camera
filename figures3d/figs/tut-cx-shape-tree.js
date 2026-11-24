// The tutorial, chapter 9.2 (tutorial/one-point/complex-symmetric.md), its second diagram: a tree of questions that
// sorts a trace-free complex symmetric reading W into its six shapes. From the root, "a reading W, trace-free":
// "I^3 = 6J^2?" -- no: three different eigenvalues, type I (two masses); yes: "I = J = 0?" -- no: "(W - w)(W + 2w) = 0,
// with w = -J/I?", yes: type D (one mass), no: type II (a mass with a wave along its line); yes: "W^2 = 0?" -- no:
// type III (W^3 = 0, rank 2, the paper's rows (0,0,1), (0,0,i), (1,i,0)); yes: "W = 0?" -- no: type N (one wave, rank
// 1), yes: type O (no field). The questions in thin rounded ink boxes, the leaves in thin square ink boxes with the
// Petrov letter in bold at the left, the example in the dim ink, and under it the minimal polynomial; the leaves a
// real symmetric table can reach (I, D, O) carry a tick and "possible at rest". Thin ink arrows, "yes" and "no" in the
// dim ink beside them. Ink and greys only.
// Departures from the diagram's comment: the tree is drawn as a spine of questions down the left (the root, then
// "I^3 = 6J^2?", "I = J = 0?", "W^2 = 0?", "W = 0?", each "yes" downward) with the leaves in one column at the right,
// each on the row of the question that sends a reading to it, and "(W - w)(W + 2w) = 0?" between them on its row; the
// "no" of that question and the "yes" of "W = 0?" turn down and then right into their leaves. So one drawing about
// 300 points wide reads from the top at every width, and on a phone its text stays at the size of every label. The
// example is in the dim ink at that size, not smaller, for the same reason; "type" is not printed, the bold letter
// says it. The caption's "second level" reads "the first two questions", the two that use only I and J.
// Exact: every leaf is where the chapter's example of that shape is sent by these questions, computed (tut-cxsym-lib.js:
// the fig:stars pair, one mass, the mass with the weak wave along its line, the paper's type III rows, the wave
// 2 m m^T, zero); every minimal polynomial annihilates its example and none of lower degree does; the ranks 2 and 1;
// the shapes possible at rest are those whose examples are real tables (asserted). Nothing is schematic.
import { Sheet, ORIGIN, finish, checker, boxOf, placed, n2, LABEL_GAP } from './tut-pot-lib.js';
import { INK, DIM, tex } from '../lib.js';
import { chapter, examples, sort } from './tut-cxsym-lib.js';

const name = 'tut-cx-shape-tree';
const check = checker(name);

const SIZE = 8.5;                          // every label (tut-pot-lib.js)
const LETTER = 10.5;                       // the Petrov letters
const PITCH = 10.6;                        // baseline to baseline within a box
const PAD = [4.2, 3.6];                    // a box's air beside and above/below its text
const STROKE = 0.5;                        // a box's outline
const RADIUS = 3.2;                        // a question's rounded corners
const LINK = 0.45;                         // an arrow's stroke
const HEAD = 3.2;                          // an arrow's head
const END_AIR = 1.2;                       // an arrow's head stops this far short of the box it enters
const ACROSS = 21;                         // the room for an arrow across between columns
const DROP = 13;                           // the least length of an arrow down the spine
const LEAF_GAP = 6.5;                      // between two leaves
const LETTER_COL = 18;                     // the leaves' letter column
const TICK_MARK = [5.2, 4.2];              // the tick's width and height
const ANSWER_AIR = 1.8;                    // a "yes" or "no" from its arrow, beyond LABEL_GAP

const W = '\\mathcal W';
const LEAVES = {
	I: { lines: [['\\text{three different}', INK], ['\\text{eigenvalues}', INK], ['\\text{two masses}', DIM], ['(\\lambda - w_1)(\\lambda - w_2)(\\lambda - w_3)', INK]], rest: true },
	D: { lines: [['\\text{one mass}', DIM], ['(\\lambda - w)(\\lambda + 2w)', INK]], rest: true },
	II: { lines: [['\\text{a mass with a wave}', DIM], ['\\text{along its line}', DIM], ['(\\lambda - w)^2(\\lambda + 2w)', INK]] },
	III: { lines: [[`${W}^3 = 0\\text{, rank }2`, INK], ['\\text{the paper\'s rows}', DIM], ['(0, 0, 1),\\ (0, 0, i),\\ (1, i, 0)', DIM], ['\\lambda^3', INK]] },
	N: { lines: [['\\text{rank }1', INK], ['\\text{one wave}', DIM], ['\\lambda^2', INK]] },
	O: { lines: [['\\text{no field}', DIM], ['\\lambda', INK]], rest: true }
};
const QUESTIONS = {
	q1: [`I^3 = 6J^2?`],
	q2: [`I = J = 0?`],
	q3: [`(${W} - w)(${W} + 2w) = 0,`, `\\text{with }w = -J/I?`],
	q4: [`${W}^2 = 0?`],
	q5: [`${W} = 0?`]
};

/** A line of TeX with its baseline's left end at (x, y): its svg and ink box. */
async function line(src, x, y, color = INK, size = SIZE) {
	const svg = await tex(src, [x, y], size, 'lB', color);
	return { src, svg, box: boxOf(svg) };
}
/** Lines of TeX ([src, x, color]) one under another, PITCH apart, or farther where their ink would come nearer than
 * the labels' least air: the lines, placed, and the last baseline. */
async function stacked(specs) {
	const out = [];
	let base = 0;
	for (const [i, [src, x, color]] of specs.entries()) {
		const probe = await line(src, x, 0, color);
		if (i) base = Math.max(base + PITCH, out[i - 1].box.b + LABEL_GAP + 0.25 - probe.box.t);
		out.push(await line(src, x, base, color));
	}
	return { ls: out, last: base };
}
const shift = (l, dx, dy) => ({ ...l, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${l.svg}</g>`, box: { l: l.box.l + dx, r: l.box.r + dx, t: l.box.t + dy, b: l.box.b + dy } });
const union = (bs) => ({ l: Math.min(...bs.map((b) => b.l)), r: Math.max(...bs.map((b) => b.r)), t: Math.min(...bs.map((b) => b.t)), b: Math.max(...bs.map((b) => b.b)) });

export default async function () {
	const nums = await chapter(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the mathematics: each example sorted to its leaf, and the leaves possible at rest
	const ex = examples();
	const PATHS = {
		I: 'I3=6J2:no', D: 'I3=6J2:yes,I=J=0:no,(W-w)(W+2w)=0:yes', II: 'I3=6J2:yes,I=J=0:no,(W-w)(W+2w)=0:no',
		III: 'I3=6J2:yes,I=J=0:yes,W2=0:no', N: 'I3=6J2:yes,I=J=0:yes,W2=0:yes,W=0:no', O: 'I3=6J2:yes,I=J=0:yes,W2=0:yes,W=0:yes'
	};
	for (const [leaf, Wt] of Object.entries(ex)) {
		const s = sort(Wt);
		check(s.leaf === leaf && s.path.join() === PATHS[leaf], `${leaf}: sorted to ${s.leaf} by ${s.path}`);
		const real = Wt.flat().every((z) => z[1] === 0);
		check(real === !!LEAVES[leaf].rest, `${leaf}: possible at rest is ${!!LEAVES[leaf].rest}, but its example is ${real ? '' : 'not '}real`);
	}
	nums.has('A real symmetric table, the reading of a scene at rest, always has the shape I, D or O', 'the shapes at rest');
	check(Object.keys(LEAVES).filter((k) => LEAVES[k].rest).join() === 'I,D,O', 'the leaves possible at rest');

	// ---- measure the questions and the leaves at the origin
	const ascent = (await line('\\vphantom{(}x', 0, 0)).box.t;     // negative: the top of a parenthesis above the baseline
	const qBox = {};
	for (const [k, srcs] of Object.entries(QUESTIONS)) {
		const { ls, last } = await stacked(srcs.map((s) => [s, 0, INK]));
		const ink = union(ls.map((l) => l.box));
		const h = last + 2 * PAD[1] + Math.max(-ink.t, -ascent) + Math.max(ink.b - last, 2.6);
		qBox[k] = { ls, ink, w: ink.r - ink.l + 2 * PAD[0], h, top: Math.max(-ink.t, -ascent) };
	}
	const leafBox = {};
	for (const [k, leaf] of Object.entries(LEAVES)) {
		const specs = leaf.lines.map(([s, c]) => [s, LETTER_COL, c]);
		if (leaf.rest) specs.push(['\\text{possible at rest}', LETTER_COL + TICK_MARK[0] + LABEL_GAP + 0.8, DIM]);
		const { ls: all, last } = await stacked(specs);
		const ls = leaf.rest ? all.slice(0, -1) : all, rest = leaf.rest ? all[all.length - 1] : null;
		const letter = await line(`\\mathbf{${k}}`, 0, 0, INK, LETTER);
		const ink = union(all.map((l) => l.box));
		const top = Math.max(-ink.t, -ascent, -letter.box.t);
		const h = last + top + Math.max(ink.b - last, 2.6) + 2 * PAD[1];
		leafBox[k] = { ls, rest, letter, ink, h, top, last, w: ink.r + 2 * PAD[0] };
		check(letter.box.r < LETTER_COL - 3, `${k}: the letter runs into its text`);
	}
	const leafW = Math.max(...Object.values(leafBox).map((b) => b.w));

	// ---- the columns
	const colA = Math.max(...['q1', 'q2', 'q4', 'q5'].map((k) => qBox[k].w));
	const xA = ORIGIN - 150 + colA / 2;                          // the spine's centre
	const xB = xA + colA / 2 + ACROSS;                           // the left of the column of q3
	const xC = xB + qBox.q3.w + ACROSS;                          // the leaves' left edge

	// ---- drawing a box and placing its text
	const frame = (l, t, w, h, rounded, what) => {
		const r = rounded ? RADIUS : 0;
		const d = rounded
			? `M${n2(l + r)},${n2(t)}H${n2(l + w - r)}A${r},${r} 0 0 1 ${n2(l + w)},${n2(t + r)}V${n2(t + h - r)}A${r},${r} 0 0 1 ${n2(l + w - r)},${n2(t + h)}H${n2(l + r)}A${r},${r} 0 0 1 ${n2(l)},${n2(t + h - r)}V${n2(t + r)}A${r},${r} 0 0 1 ${n2(l + r)},${n2(t)}Z`
			: `M${n2(l)},${n2(t)}H${n2(l + w)}V${n2(t + h)}H${n2(l)}Z`;
		S.raw(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${STROKE}" stroke-linejoin="round"/>`, 1);
		S.mark([[l, t], [l + w, t], [l + w, t + h], [l, t + h], [l, t]], STROKE / 2, what);
		return { l, r: l + w, t, b: t + h, cx: l + w / 2, cy: t + h / 2 };
	};
	const question = (k, cx, cy) => {
		const q = qBox[k];
		const B = frame(cx - q.w / 2, cy - q.h / 2, q.w, q.h, true, `the question ${k}`);
		const dx = B.l + PAD[0] - q.ink.l, dy = B.t + PAD[1] + q.top;
		for (const l of q.ls) L.push(shift(l, dx, dy));
		return B;
	};
	const leafAt = (k, top) => {
		const lb = leafBox[k];
		const B = frame(xC, top, leafW, lb.h, false, `the leaf ${k}`);
		const dx = xC + PAD[0], dy = top + PAD[1] + lb.top;
		for (const l of lb.ls) L.push(shift(l, dx, dy));
		L.push(shift(lb.letter, dx, dy));
		if (lb.rest) {
			const r = shift(lb.rest, dx, dy);
			L.push(r);
			// the tick: two strokes, its foot on the line's baseline
			const x0 = dx + LETTER_COL, yb = dy + lb.last;
			const [tw, th] = TICK_MARK;
			S.path([[x0, yb - 0.45 * th], [x0 + 0.36 * tw, yb], [x0 + tw, yb - th]], { color: INK, width: 0.6, layer: 2, what: `the tick of ${k}` });
		}
		return B;
	};
	const answer = (src, x, y, ax, ay) => placed(`\\text{${src}}`, x, y, ax, ay, DIM);
	const arrow = (A, B, what) => S.arrow(A, B, { color: INK, width: LINK, head: HEAD, layer: 2, what });
	const gapOf = LINK / 2 + LABEL_GAP + ANSWER_AIR;
	/** An arrow across from a box's right edge to a box's left edge at the height y, its answer above it. */
	const across = async (from, to, y, src) => {
		const a = arrow([from.r + STROKE / 2, y], [to.l - END_AIR, y], `the arrow ${src} into ${to.l}`);
		L.push(await answer(src, from.r + STROKE / 2 + 3.2, y - gapOf, 0, 1));
		return a;
	};
	/** An arrow down from a box's bottom to a box's top at x, its answer right of it. */
	const down = async (from, to, x, src) => {
		const a = arrow([x, from.b + STROKE / 2], [x, to.t - END_AIR], `the arrow ${src} down to ${to.t}`);
		check(to.t - from.b >= DROP - 1e-9, `an arrow down is ${to.t - from.b} pt long`);
		L.push(await answer(src, x + gapOf, (from.b + to.t) / 2, 0, 0.5));
		return a;
	};
	/** An arrow down from a box's bottom at x to the height y, then across into a box's left edge. */
	const elbow = async (from, to, x, y, src) => {
		S.path([[x, from.b + STROKE / 2], [x, y], [x + 4, y]], { color: INK, width: LINK, layer: 2, cap: 'butt', what: `the elbow ${src}'s first legs` });
		const a = arrow([x, y], [to.l - END_AIR, y], `the elbow ${src}`);
		L.push(await answer(src, x + gapOf, (from.b + STROKE / 2 + y) / 2 - 1.5, 0, 0.5));
		return a;
	};

	// ---- the root
	const rootSrc = await line(`\\text{a reading }${W}\\text{, trace-free}`, 0, 0);
	const rootW = rootSrc.box.r - rootSrc.box.l + 2 * PAD[0], rootH = rootSrc.box.b - Math.min(rootSrc.box.t, ascent) + 2 * PAD[1];
	const left = xA - colA / 2;
	const root = frame(left, ORIGIN - 160, rootW, rootH, false, 'the root');
	L.push(shift(rootSrc, root.l + PAD[0] - rootSrc.box.l, root.t + PAD[1] - Math.min(rootSrc.box.t, ascent)));
	check(root.r < xC - 8, 'the root reaches the leaves');

	// ---- the rows, from the top: each question on the row of its leaf
	const rows = {};
	let yQ1 = root.b + DROP + qBox.q1.h / 2;
	const topI = yQ1 - leafBox.I.h / 2;
	const I = leafAt('I', topI);
	const q1 = question('q1', xA, I.cy);
	let topD = I.b + LEAF_GAP;
	const yD = Math.max(topD + leafBox.D.h / 2, q1.b + DROP + qBox.q2.h / 2, q1.b + DROP + qBox.q3.h / 2);
	const D = leafAt('D', yD - leafBox.D.h / 2);
	const q2 = question('q2', xA, D.cy);
	const q3 = question('q3', xB + qBox.q3.w / 2, D.cy);
	const II = leafAt('II', Math.max(D.b + LEAF_GAP, q3.b + DROP - 4));
	const III = leafAt('III', II.b + LEAF_GAP);
	const q4 = question('q4', xA, III.cy);
	const N = leafAt('N', III.b + LEAF_GAP);
	const q5 = question('q5', xA, N.cy);
	const O = leafAt('O', Math.max(N.b + LEAF_GAP, q5.b + DROP - 4));
	rows.leaves = { I, D, II, III, N, O };

	// ---- the arrows
	arrow([xA, root.b + STROKE / 2], [xA, q1.t - END_AIR], 'the arrow from the root');
	check(q1.t - root.b >= DROP - 1e-9, 'the root\'s arrow is short');
	await across(q1, I, I.cy, 'no');
	await down(q1, q2, xA, 'yes');
	await across(q2, q3, D.cy, 'no');
	await across(q3, D, D.cy, 'yes');
	await elbow(q3, II, q3.cx, II.cy, 'no');
	await down(q2, q4, xA, 'yes');
	await across(q4, III, III.cy, 'no');
	await down(q4, q5, xA, 'yes');
	await across(q5, N, N.cy, 'no');
	await elbow(q5, O, xA, O.cy, 'yes');
	// the long arrows cross the column of q3 clear of it
	check(I.cy < q3.t - 4 && III.cy > q3.b + 4 && II.cy > q3.b + 4, 'an arrow across runs into the question of the powers');

	S.checkAll(L);
	window[name + '-numbers'] = { leaves: Object.keys(LEAVES) };
	return finish(S, L, [260, 340]);
}
