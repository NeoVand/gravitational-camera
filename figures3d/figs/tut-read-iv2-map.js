// The tutorial, reading chapter R3 (tutorial/noise/reading-section-iv-2.md), its first diagram: the second half of
// Section IV as a map of what Part 3 has proved. The sibling of R2's map (figs/tut-read-iv-map.js): the same box,
// type, tint, outline and dotted outline. Eleven boxes, one for each stretch the chapter reads, in its order, in rows
// of four (one drawing serves the desktop and the phone, so it is laid out to be read at 390 px; R2's ten boxes are in
// rows of five, and rows of four keep the same box while the figure stays narrow). Each box carries the stretch's short
// name in its upper half and its equation numbers, as the site prints them, in its lower half; under it, the chapters
// that teach it, split at the chapter's semicolon (the chapters of Parts 1 to 3 first, the later ones after) and
// wrapped to the box's width. The box's fill is the chapter's mark: solid for "checked here", the lower half solid for
// claims of more than one kind, a dotted outline for "read now, derived later". Above the first box a greyed box, "R2:
// the first half", with an arrow down into it (R2's map ends with the mirror of this); at the right of the rows a
// thin bracket that gathers all eleven and runs down into one larger, filled box, the capstone. Every name, chapter
// list and mark is the chapter's (its diagram comment and its headings) and is checked below; the boxes' sizes and
// places are chosen for the drawing.
import { tex, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-iv2-map';
const check = checker(name);

// ---- the chapter's eleven stretches, in order (tutorial/noise/reading-section-iv-2.md) ---------------------------
// [short name, its lines in the box, its equations, taught in, mark]
export const STRETCHES = [
	['plain words', ['Plain words'], [], '3.1, 3.3, 3.7, 3.8, 3.9; 8.6', 'half'],
	['How sharp', ['How sharp'], ['wiener', 'cutoff', 'resolution'], '3.5, 3.6, 3.7', 'solid'],
	['GOCE', ['GOCE'], [], '2.2, 3.5, 3.7', 'half'],
	['other sensors · small camera', ['Other sensors,', 'small camera'], ['handheld'], '2.3, 2.7, 3.7', 'solid'],
	['precision', ['Precision'], [], '3.3, 3.9', 'solid'],
	['worked case', ['Worked case'], [], '1.3, 2.3, 3.3, 3.4, 3.5', 'solid'],
	['positivity', ['Positivity'], [], '3.9', 'half'],
	['zeros of the shear', ['Zeros of', 'the shear'], ['shear-zeros'], '1.5b, 3.9', 'half'],
	['limits', ['Limits'], [], '3.7; 8.1, 8.6, 11.1, 13.8', 'dotted'],
	['information', ['Information'], ['capacity-integral', 'capacity'], '3.8; 5.3, Part 9, Part 10', 'half'],
	['geometry', ['Geometry'], ['hyperbolic'], '3.9', 'half']
];
// the equations' numbers as the site prints them (paper/main.aux)
const NUMBER = { wiener: 19, cutoff: 20, resolution: 21, handheld: 22, 'shear-zeros': 23, 'capacity-integral': 24, capacity: 25, hyperbolic: 26 };
const R2 = '\\text{R2: the first half}';
const CAPSTONE = '\\text{Capstone: the locked safe}';

// ---- the drawing (figure points, y down); everything as R2's map but the rows ------------------------------------
const SIZE = 8.5;                 // every label
const BW = 58.09;                 // a box's width: R2's, which its figure takes from its widest name (tut-read-iv-map)
const HALF = 33;                  // half a box's height, as R2's
const GAP_X = 6.5;                // between the boxes of a row
const PER_ROW = 4;                // boxes in a row
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline
const PITCH = 10;                 // baseline to baseline, within a name or a list of chapters
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 13;               // from the last baseline of a row's chapters to the next row's boxes
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma, the ";")
const STUB_PAD = [5, 3.6];        // the R2 box: air beside and above/below its text
const DROP = 11;                  // the arrow from the R2 box into the first box, and from the bracket into the capstone
const HEAD = 3.6;                 // the arrows' heads (two fifths of the arrow at most)
const SPINE = 6;                  // from the rows' right edge to the bracket
const TICK = 2.6;                 // the bracket's top end, leftward
const CAP_H = 26;                 // the capstone's height
const INSIDE = 2.6;               // the least air between a label and the edges of its box (or the half line)
const LIST_AIR = 1;               // a list of chapters stays this far inside its box's width on each side

const FILL = '#f3dfcb';           // the solid fill: the pale tint of the accent (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked: eleven stretches, their marks, and the counts the caption gives
	check(STRETCHES.length === 11, 'the chapter reads eleven stretches');
	const kinds = STRETCHES.map((s) => s[4]);
	check(kinds.filter((k) => k === 'solid').length === 4 && kinds.filter((k) => k === 'half').length === 6 && kinds.filter((k) => k === 'dotted').length === 1, 'the marks are not 4 checked, 6 mixed, 1 read now');
	STRETCHES.forEach(([short, lines]) => {
		const words = lines.join(' ').toLowerCase().replace(/,/g, '');
		check(words === short.toLowerCase().replace(' ·', ''), `the name "${lines.join(' ')}" is not the chapter's "${short}"`);
	});
	check(Object.values(NUMBER).join() === '19,20,21,22,23,24,25,26', 'Section IV\'s last eight equations are 19 to 26');

	// ---- the lists of chapters, wrapped to the box's width: at the semicolon first, then between items
	const width = async (s) => { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const lists = [];
	for (const s of STRETCHES) {
		const parts = s[3].split('; ');
		const lines = [];
		for (const [k, part] of parts.entries()) {
			const items = part.split(', ');
			let line = '';
			for (const [j, item] of items.entries()) {
				const tail = j < items.length - 1 ? ',' : k < parts.length - 1 ? ';' : '';
				const next = line ? `${line} ${item}${tail}` : `${item}${tail}`;
				if (line && (await width(next)) > BW - 2 * LIST_AIR) { lines.push(line); line = `${item}${tail}`; }
				else line = next;
			}
			lines.push(line);
		}
		check(lines.join(' ') === s[3].replace(/;/g, ';'), `the list of ${s[0]} is not the chapter's`);
		for (const l of lines) check((await width(l)) <= BW - 2 * LIST_AIR, `the list line "${l}" is wider than its box`);
		lists.push(lines);
	}
	for (const s of STRETCHES) for (const n of s[1]) check((await width(n)) <= BW - 2 * INSIDE, `the name "${n}" is wider than its box`);

	// ---- the rows
	const rows = Math.ceil(STRETCHES.length / PER_ROW);
	const W = PER_ROW * BW + (PER_ROW - 1) * GAP_X;
	const x0 = ORIGIN - W / 2;
	const lineCount = Array.from({ length: rows }, (_, r) => Math.max(...lists.slice(r * PER_ROW, (r + 1) * PER_ROW).map((l) => l.length)));

	// the R2 box above the first box
	const stub = await placedBase(R2, 0, 0, FAINT);
	const stubW = stub.box.r - stub.box.l, stubH = stub.box.b - stub.box.t;
	const R = { l: x0, t: ORIGIN - 250 };
	R.r = R.l + stubW + 2 * STUB_PAD[0];
	R.b = R.t + stubH + 2 * STUB_PAD[1];
	const y0 = R.b + DROP;
	const stubText = await placed(R2, (R.l + R.r) / 2, (R.t + R.b) / 2, 0.5, 0.5, FAINT, SIZE);
	S.path([[R.l, R.t], [R.r, R.t], [R.r, R.b], [R.l, R.b]], { color: FAINT, width: HAIR, closed: true, cap: 'butt', what: 'the R2 box' });
	stubText.inside = { ...R, what: 'the R2 box' };
	L.push(stubText);

	const boxes = [];
	let top = y0;
	const rowTops = [];
	for (let r = 0; r < rows; r++) {
		rowTops.push(top);
		top += 2 * HALF + UNDER + (lineCount[r] - 1) * PITCH + DESC + ROW_GAP;
	}
	for (let i = 0; i < STRETCHES.length; i++) {
		const col = i % PER_ROW, row = Math.floor(i / PER_ROW);
		const l = x0 + col * (BW + GAP_X), t = rowTops[row], r = l + BW, b = t + 2 * HALF, m = t + HALF;
		const kind = kinds[i];
		const what = `box ${i + 1}`;
		boxes.push({ l, t, r, b, m });
		const rect = (y1, y2) => `M${n2(l)},${n2(y1)}H${n2(r)}V${n2(y2)}H${n2(l)}Z`;
		if (kind === 'solid') S.fill(rect(t, b), { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'half') S.fill(rect(m, b), { l, r, t: m, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'dotted') {
			// round dots along each side, one at every corner, evenly spaced (as R2's)
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
		const lines = STRETCHES[i][1];
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const base0 = t + (HALF - blockH) / 2 + CAP * SIZE;
		for (const [k, s] of lines.entries()) {
			const g = await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, INK);
			g.inside = { l, r, t, b: m, what };
			L.push(g);
		}
		// the equation numbers, centred in the lower half on their ink
		const eqs = STRETCHES[i][2].map((e) => `(${NUMBER[e]})`).join(', ');
		if (eqs) {
			const g = await placed(`\\text{${eqs}}`, (l + r) / 2, m + HALF / 2, 0.5, 0.5, INK, SIZE);
			g.inside = { l, r, t: m, b, what };
			L.push(g);
		}
		// the chapters that teach it, under the box
		for (const [k, s] of lists[i].entries()) L.push(await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM));
	}

	// ---- the arrow from the R2 box into the first box
	const b1 = boxes[0];
	S.arrow([(b1.l + b1.r) / 2, R.b + HAIR / 2], [(b1.l + b1.r) / 2, b1.t - 1.2], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow from R2' });

	// ---- the bracket at the right of the rows, from the first row's top to below the last row's chapters, and on
	// down into the capstone
	const xs = x0 + W + SPINE;
	const yTop = boxes[0].t;
	const lastText = Math.max(...L.filter((g) => !g.inside).map((g) => g.box.b));
	const C = { l: x0, r: xs + 2 * STUB_PAD[0] + 10, t: lastText + DROP + 4 };
	C.b = C.t + CAP_H;
	// the bracket's last DROP points are the arrow, drawn as R2's arrows are
	S.path([[xs - TICK, yTop], [xs, yTop], [xs, C.t - 1.2 - DROP + 1.5]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket' });
	S.arrow([xs, C.t - 1.2 - DROP], [xs, C.t - 1.2], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow into the capstone' });
	const capRect = `M${n2(C.l)},${n2(C.t)}H${n2(C.r)}V${n2(C.b)}H${n2(C.l)}Z`;
	S.fill(capRect, C, { color: FILL, layer: 1, what: 'the capstone', solid: false });
	S.path([[C.l, C.t], [C.r, C.t], [C.r, C.b], [C.l, C.b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what: 'the capstone' });
	const capText = await placed(CAPSTONE, (C.l + C.r) / 2, (C.t + C.b) / 2, 0.5, 0.5, INK, SIZE);
	capText.inside = { ...C, what: 'the capstone' };
	L.push(capText);

	// ---- checks: every label inside its box clears the box's edges and its middle by INSIDE, left and right alike
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		check(Math.min(...a) >= INSIDE, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	// the bracket clears every label and box beside it
	for (const g of L) check(g.box.r + LABEL_GAP <= xs || g.inside?.what === 'the capstone', `the label ${g.src} reaches the bracket`);
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIv2Map = { W, BW, rows, lineCount, lists, stub: R, capstone: C };
	return finish(S, L, [240, 340]);
}

/** A text label with its baseline at y and its ink centred on x. */
async function placedBase(src, x, y, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
