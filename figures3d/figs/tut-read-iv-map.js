// The tutorial, reading chapter R2 (tutorial/outside/reading-section-iv-1.md), its one diagram: the first half of
// Section IV as a map of what Part 2 has proved. Ten boxes, one for each row of the chapter's table, in its order, in
// two rows of five (one drawing serves both the desktop and the phone, so it is laid out to be read at 390 px). Each
// box carries the stretch's short name (the paper's paragraph headings, paper/sections/04-near-field.tex) in its upper
// half and its equation numbers, as the site prints them, in its lower half; under it, the chapters that teach it,
// split at the table's semicolon (the chapters of Parts 1 and 2 on the first line, the later ones on the second). The
// box's fill is the table's mark: solid for "checked here", the lower half solid and the upper half outlined for
// "mixed", a dotted outline for "read in R4". Under the last box a thin bracket, and from it an arrow down to a greyed
// box, "R3: the blur, the precision, the bits", the rest of How sharp. Every label, chapter list and mark is copied
// from the table and checked against it below; the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM, FAINT, ACCENT, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-iv-map';
const check = checker(name);

// ---- the chapter's table, row by row (tutorial/outside/reading-section-iv-1.md) ----------------------------------
// [the table's stretch, its equations, taught in, mark]
export const TABLE = [
	['Plain words, to the second limit', [], '1.3, 1.4, 2.5, 2.7', 'mixed: heat R4, blur R3'],
	['How bright', ['tidal-brightness'], '1.4', 'checked here'],
	['What the image is', ['tidal-column'], '1.5, 2.2, 2.3', 'checked here'],
	['The magnetic picture', ['magnetic-point', 'current-column'], '1.5, 1.6, 2.8; 7.5', 'mixed: formulas Part 7'],
	['What the image cannot show', [], '1.3, 2.3, 2.5; 3.7', 'mixed: blur Part 3'],
	['What the image does show', ['split', 'harmonic-point'], '2.1, 2.4, 2.5; 3.5', 'mixed: completeness stated, white prior Part 3'],
	['What breaks the tie', [], '1.6, 2.5, 2.8; 7.5, Part 10', 'mixed: general spin Part 7, glow Part 10'],
	['The Earth by three channels', [], '1.3, 1.6; Part 10', 'mixed: glow Part 10, moment of inertia stated'],
	['What heat reveals to A model-independent thermometer', [], 'Part 4', 'read in R4'],
	['How sharp, first paragraph', ['evanescent', 'array-data'], '2.5, 2.7', 'checked here']
];
// the equations' numbers as the site prints them (paper/main.aux, and the chapter's page)
const NUMBER = { 'tidal-brightness': 7, 'tidal-column': 8, 'magnetic-point': 9, 'current-column': 10, split: 11, 'harmonic-point': 12, evanescent: 17, 'array-data': 18 };
// the short names, as set in the boxes, a line each
const NAMES = [
	['Plain words'], ['How bright'], ['What the', 'image is'], ['The magnetic', 'picture'], ['What the', 'image', 'cannot show'],
	['What the', 'image', 'does show'], ['What breaks', 'the tie'], ['The Earth', 'by three', 'channels'], ['Heat,', 'applied tide,', 'thermometer'], ['How sharp']
];
const KIND = (mark) => (mark === 'checked here' ? 'solid' : mark.startsWith('mixed') ? 'half' : mark === 'read in R4' ? 'dotted' : null);
const R3 = '\\text{R3: the blur, the precision, the bits}';

// ---- the drawing (figure points, y down) ------------------------------------------------------------------------
const SIZE = 8.5;                 // every label, as in the tutorial's other diagrams
const SIDE = 3.2;                 // a box's width: its widest name line and this much air on each side
const HALF = 33;                  // half a box's height: the name above, the equation numbers below
const GAP_X = 6.5;                // between the boxes of a row
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline: the dots' size and their spacing (about)
const PITCH = 10;                 // baseline to baseline, within a name or a list of chapters
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 10;               // from the last line of a row's chapters to the next row's boxes
const BRACKET = 4.5;              // from the last line of How sharp's chapters to its bracket
const TICK = 2.6;                 // the bracket's ends, upward
const DROP = 11;                  // the arrow from the bracket to the R3 box
const HEAD = 3.6;                 // the arrow's head (two fifths of the arrow at most)
const R3_PAD = [5, 3.6];          // the R3 box: air beside and above/below its text
const INSIDE = 2.6;               // the least air between a label and the edges of its box (or the half line)

const FILL = '#f3dfcb';          // the solid fill: the pale tint of the accent (the site mixes it with its page)
const ON_FILL = INK;              // the text on it

const CAP = 0.683;                // the cap height of Computer Modern, in ems: a name block is centred on caps and baselines

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// the table, checked: ten rows, their kinds, and the equation numbers
	check(TABLE.length === 10 && NAMES.length === 10, 'the table has ten rows');
	const kinds = TABLE.map((r) => KIND(r[3]));
	check(kinds.every(Boolean), 'a mark the drawing does not know');
	check(kinds.filter((k) => k === 'solid').length === 3 && kinds.filter((k) => k === 'half').length === 6 && kinds.filter((k) => k === 'dotted').length === 1, 'the marks are not 3 checked, 6 mixed, 1 in R4');
	NAMES.forEach((n, i) => {
		const words = n.join(' ').replace(/,/g, '');
		const ok = i === 8 ? ['heat', 'thermometer'].every((w) => TABLE[i][0].toLowerCase().includes(w)) : TABLE[i][0].replace(/,/g, '').startsWith(words);
		check(ok, `the name "${n.join(' ')}" is not the table's "${TABLE[i][0]}"`);
	});

	const widths = [];
	for (const n of NAMES) for (const s of n) { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); widths.push(b.r - b.l); }
	const chapterLines = TABLE.map((r) => r[2].split('; ').map((s, k, a) => (k < a.length - 1 ? s + ';' : s)));
	// the lists of chapters stay within their boxes' width too, a point in from each side
	const listW = [];
	for (const c of chapterLines) for (const s of c) { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); listW.push(b.r - b.l); }
	const BW = Math.max(Math.max(...widths) + 2 * SIDE, Math.max(...listW) + 2);
	const W = 5 * BW + 4 * GAP_X;
	const x0 = ORIGIN - W / 2, y0 = ORIGIN - 100;
	check(chapterLines.every((c) => c.length <= 2), 'a list of chapters takes more than two lines');
	const rowH = 2 * HALF + UNDER + PITCH;       // a box and two lines of chapters, to the last baseline
	const boxes = [];

	for (let i = 0; i < 10; i++) {
		const col = i % 5, row = Math.floor(i / 5);
		const l = x0 + col * (BW + GAP_X), t = y0 + row * (rowH + ROW_GAP + 3), r = l + BW, b = t + 2 * HALF, m = t + HALF;
		const kind = kinds[i];
		const what = `box ${i + 1}`;
		boxes.push({ l, t, r, b, m });
		const rect = (y1, y2) => `M${n2(l)},${n2(y1)}H${n2(r)}V${n2(y2)}H${n2(l)}Z`;
		if (kind === 'solid') S.fill(rect(t, b), { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'half') S.fill(rect(m, b), { l, r, t: m, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'dotted') {
			// round dots along each side, one at every corner, evenly spaced
			const d = [];
			for (const [A, B] of [[[l, t], [r, t]], [[r, t], [r, b]], [[r, b], [l, b]], [[l, b], [l, t]]]) {
				const len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.round(len / DOT_STEP);
				for (let k = 0; k < n; k++) d.push(`M${n2(A[0] + ((B[0] - A[0]) * k) / n)},${n2(A[1] + ((B[1] - A[1]) * k) / n)}h0`);
			}
			S.raw(`<path d="${d.join('')}" stroke="${ACCENT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
			S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], DOT / 2, what);
		} else {
			S.path([[l, t], [r, t], [r, b], [l, b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
		}

		// the name, centred in the upper half on its caps and baselines
		const lines = NAMES[i];
		const onFill = kind === 'solid';
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const base0 = t + (HALF - blockH) / 2 + CAP * SIZE;
		for (const [k, s] of lines.entries()) {
			const g = await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, onFill ? ON_FILL : INK);
			g.inside = { l, r, t, b: m, what };
			L.push(g);
		}
		// the equation numbers, centred in the lower half on their ink (the parentheses are symmetric about the axis)
		const eqs = TABLE[i][1].map((e) => `(${NUMBER[e]})`).join(', ');
		if (eqs) {
			const g = await placed(`\\text{${eqs}}`, (l + r) / 2, m + HALF / 2, 0.5, 0.5, kind === 'dotted' ? INK : ON_FILL, SIZE);
			g.inside = { l, r, t: m, b, what };
			L.push(g);
		}
		// the chapters that teach it, under the box
		for (const [k, s] of chapterLines[i].entries()) {
			const g = await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM);
			L.push(g);
		}
	}

	// ---- under the last box, a bracket, and from it an arrow down to the greyed box of R3
	const last = boxes[9];
	const lastText = L.filter((g) => g.box.t > last.b && g.box.l >= last.l - 1 && g.box.r <= last.r + 1);
	const yB = Math.max(...lastText.map((g) => g.box.b)) + BRACKET;
	const bl = last.l + 3, br = last.r - 3, bc = (last.l + last.r) / 2;
	S.path([[bl, yB - TICK], [bl, yB], [br, yB], [br, yB - TICK]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket' });
	const r3 = await placedBase(R3, 0, 0, DIM);
	const r3w = r3.box.r - r3.box.l;
	const R = { r: last.r, t: yB + DROP };
	R.l = R.r - r3w - 2 * R3_PAD[0];
	// the text centred on its ink, with the same air above and below
	R.b = R.t + (r3.box.b - r3.box.t) + 2 * R3_PAD[1];
	const r3Text = await placed(R3, (R.l + R.r) / 2, (R.t + R.b) / 2, 0.5, 0.5, FAINT, SIZE);
	// the greyed box: a hairline outline in the faint ink, nothing filled
	S.path([[R.l, R.t], [R.r, R.t], [R.r, R.b], [R.l, R.b]], { color: FAINT, width: HAIR, closed: true, cap: 'butt', what: 'the R3 box' });
	r3Text.inside = { ...R, what: 'the R3 box' };
	L.push(r3Text);
	S.arrow([bc, yB + HAIR / 2], [bc, R.t - 1.2], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow to R3' });

	// ---- checks: every label inside its box clears the box's edges and its middle by INSIDE, left and right alike
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		check(Math.min(...a) >= INSIDE, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	// labels clear every mark but their own box's outline (checked above), and each other
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIvMap = { W, rowH, R3: R, kinds };
	return finish(S, L, [240, 340]);
}

/** A text label with its baseline at y and its ink centred on x. */
async function placedBase(src, x, y, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
