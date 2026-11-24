// The tutorial, reading chapter R7 (tutorial/geometry/reading-section-ii-again.md), its one diagram: Section II read
// again as a map of what Part 7 has derived. The sibling of R5's map (figs/tut-read-iii-map.js): the same box, type,
// tint, outline, dotted outline, greyed box above and grey arrows, and R3's half fill (figs/tut-read-iv2-map.js) for a
// box whose claims are of more than one kind. Six boxes, one for each stretch the chapter reads, in its order, three in
// the first row and three in the second (one drawing serves the desktop and the phone, so it is laid out to be read at
// 390 px, as R3's to R5's), joined in reading order by thin grey arrows: across each row, and from the end of the first
// row round to the start of the second. Boxes 1 to 5 are filled (every claim in them is checked here); box 6 has its
// lower half filled, as R3's mixed boxes. Each box carries the stretch's name, wrapped to the box (in its upper half
// when the name fits there; the whole box when it does not and the box is filled and has no numbers), and its
// equation numbers as the site prints them, with the third box's two figures under its numbers; under it, the
// chapters that teach it, wrapped to the box's width, and on lines of their own, each in a small dotted box, the later
// chapters from which the box holds a claim that is read now and derived later. Above the first box a greyed box,
// "Part 7: gravity as geometry", with an arrow down into it. To the right of the second row a small box with the
// orange outline and no fill, "Section V: R7b", reached from box 6 by a dashed grey arrow: the section's one pointer
// forward. Every name, chapter list and number is the chapter's diagram comment's, checked against its text (the
// equations' and figures' numbers read off main.aux, as the site's /paper page prints them, checked below); the boxes'
// sizes and places are chosen for the drawing.
// The boxes are wider than R5's (72 pt, not 58.09): the sixth name, "What the premise asks; the Earth's own tide; W",
// must fit in three lines in its box's upper half, and its widest line, "What the premise", is 65.1 pt. The small box
// sets "Section V:" and "R7b" on two lines, so that the drawing stays within 340 pt.
import { tex, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-ii-again-map';
const check = checker(name);

// ---- the chapter's six stretches, in order (tutorial/geometry/reading-section-ii-again.md) -----------------------
// [name, its equations, its figures, taught in, read now and derived later in, its fill]
export const STRETCHES = [
	['Plain words: falling, curvature, the magnetic part', [], [], '7.1, 7.2, 7.3, 7.4, 7.5, 7.6', [], 'solid'],
	['The tide as curvature', ['tidal', 'deviation'], [], '7.1, 7.2', [], 'solid'],
	['Two limits', ['newton', 'wave'], ['tidal', 'tidal-field'], '7.1, 7.2, 7.4, 7.6', [], 'solid'],
	['The swaying person', [], [], 'R1, 7.6', [], 'solid'],
	['Ten numbers and the Ricci part', ['magnetic'], [], '7.2, 7.3, 7.5, 7.6', [], 'solid'],
	['What the premise asks; the Earth\'s own tide; $\\mathcal{W}$', [], [], '7.5, 7.6', ['8.6', '9.3'], 'half']
];
// the equations' and the figures' numbers as the site's /paper page prints them (and main.aux's, checked below)
const NUMBER = { tidal: 1, deviation: 2, newton: 3, wave: 4, magnetic: 5 };
const FIGURE = { tidal: 2, 'tidal-field': 3 };
const STUB = '\\text{Part 7: gravity as geometry}';
const FORWARD = ['\\text{Section V:}', '\\text{R7b}'];   // the small box: Section V, which reading chapter R7b reads

// ---- the drawing (figure points, y down); everything as R5's map but the boxes' width and the pointer forward ----
const SIZE = 8.5;                 // every label
const BW = 72;                    // a box's width: room for the sixth name in three lines (R5's is 58.09)
const HALF = 33;                  // half a box's height, as R3's to R5's
const GAP_X = 15;                 // between the boxes of a row: room for an arrow (short: the drawing must read on a phone)
const PER_ROW = 3;                // boxes in each row
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline
const PITCH = 10;                 // baseline to baseline, within a name, a list of chapters or a box's numbers
const NUM_PITCH = 11;             // baseline to baseline between a box's equation numbers and its figures (parentheses descend)
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 21;               // from the lowest ink under a row to the next row's boxes: room for the return arrow
const STUB_PAD = [5, 3.6];        // the greyed box (and the small box): air beside and above/below its text
const DROP = 11;                  // the arrow from the greyed box into the first box
const HEAD = 3.6;                 // the arrows' heads (two fifths of the arrow at most)
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const OUT = 5.5;                  // the return arrow: from the third box's right edge out to its turn
const GAP_V = 15;                 // from the sixth box to the small box: the dashed arrow
const DASH = [2.2, 1.4];          // the dashed arrow's dashes (the gaps stretched a little so that it ends on a dash)
const INSIDE = 2.6;               // the least air between a label and the edges of its box (or the half line)
const LIST_AIR = 1;               // a list of chapters stays this far inside its box's width on each side
const LATER_PAD = [2.4, 2.3];     // a later chapter's dotted box: air beside and above/below its number
const LATER_GAP = 4;              // between two later chapters' boxes, across and down
const LATER_DROP = 4.2;           // from the last list baseline's descender to the top of the later chapters' boxes

const FILL = '#f3dfcb';           // the solid fill: the pale tint of the accent (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter's comment, checked: six stretches, five filled and one half filled, every one with chapters, the
	// later ones beyond Part 7; the equations', figures' and section's numbers
	check(STRETCHES.length === 6, 'the chapter reads six stretches');
	check(STRETCHES.map((s) => s[5]).join() === 'solid,solid,solid,solid,solid,half', 'the fills are not five filled and one half');
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	for (const [k, v] of Object.entries(NUMBER)) check(auxNumber(`eq:${k}`) === String(v), `eq:${k} is not (${v})`);
	for (const [k, v] of Object.entries(FIGURE)) check(auxNumber(`fig:${k}`) === String(v), `fig:${k} is not Figure ${v}`);
	check(auxNumber('sec:waves') === 'V', 'sec:waves is not Section V');
	const part = (c) => (c.startsWith('R') ? 0 : Number(c.split('.')[0]));
	for (const [, , , list, later] of STRETCHES) {
		check(list.split(', ').every((c) => part(c) <= 7), `the list ${list} holds a later chapter`);
		check(later.every((c) => part(c) > 7), `the later chapters ${later} are not later`);
	}

	// ---- wrapping: greedily, at spaces, to a width
	const width = async (s) => { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const wrap = async (text, room, glue) => {
		const words = text.split(glue === ', ' ? ', ' : /\s/).filter(Boolean);
		const lines = [];
		let line = '';
		for (const [j, w0] of words.entries()) {
			const w = glue === ', ' && j < words.length - 1 ? `${w0},` : w0;
			const next = line ? `${line} ${w}` : w;
			if (line && (await width(next)) > room) { lines.push(line); line = w; } else line = next;
		}
		lines.push(line);
		for (const l of lines) check((await width(l)) <= room, `the line "${l}" is wider than its box`);
		return lines;
	};
	const names = [], lists = [];
	for (const s of STRETCHES) {
		const n = await wrap(s[0], BW - 2 * INSIDE, ' ');
		check(n.join(' ') === s[0], `the name "${s[0]}" is not wrapped whole`);
		names.push(n);
		const l = await wrap(s[3], BW - 2 * LIST_AIR, ', ');
		check(l.join(' ') === s[3], `the list of "${s[0]}" is not wrapped whole`);
		lists.push(l);
	}
	check(names[5].length === 3, 'the sixth name does not take three lines');

	/** The later chapters, each in a small dotted box, in rows no wider than `room`, centred on x from the top y;
	 * returns their labels. */
	const laterBoxes = async (later, x, y, room, what) => {
		const probes = [];
		for (const c of later) probes.push(await placed(`\\text{${c}}`, 0, 0, 0, 0, DIM, SIZE));
		const ws = probes.map((p) => p.box.r - p.box.l + 2 * LATER_PAD[0]);
		const hInk = Math.max(...probes.map((p) => p.box.b - p.box.t));
		const bh = hInk + 2 * LATER_PAD[1];
		const span = ws.reduce((s, w) => s + w, 0) + (later.length - 1) * LATER_GAP;
		check(span <= room + 1e-9, `the later chapters of ${what} are wider than their room`);
		const out = [];
		let bl = x - span / 2;
		for (const [k, c] of later.entries()) {
			const box = { l: bl, r: bl + ws[k], t: y, b: y + bh };
			dotted(S, box, `the dotted box of ${c} under ${what}`);
			const g = await placed(`\\text{${c}}`, (box.l + box.r) / 2, (box.t + box.b) / 2, 0.5, 0.5, DIM, SIZE);
			g.inside = { ...box, what: `the dotted box of ${c} under ${what}` };
			out.push(g);
			bl = box.r + LATER_GAP;
		}
		return out;
	};

	// ---- the rows
	const W = PER_ROW * BW + (PER_ROW - 1) * GAP_X;
	const x0 = ORIGIN - W / 2;

	// the greyed box above the first box
	const stub = await placedBase(STUB, 0, 0, FAINT);
	const stubW = stub.box.r - stub.box.l, stubH = stub.box.b - stub.box.t;
	const R = { l: x0, t: ORIGIN - 200 };
	R.r = R.l + stubW + 2 * STUB_PAD[0];
	R.b = R.t + stubH + 2 * STUB_PAD[1];
	check(R.r > x0 + BW, 'the greyed box does not reach over the first box');
	const stubText = await placed(STUB, (R.l + R.r) / 2, (R.t + R.b) / 2, 0.5, 0.5, FAINT, SIZE);
	S.path([[R.l, R.t], [R.r, R.t], [R.r, R.b], [R.l, R.b]], { color: FAINT, width: HAIR, closed: true, cap: 'butt', what: 'the greyed box' });
	stubText.inside = { ...R, what: 'the greyed box' };
	L.push(stubText);

	const boxes = [];
	const under = [];                                   // the labels under each box
	let top = R.b + DROP;
	for (let i = 0; i < STRETCHES.length; i++) {
		const col = i % PER_ROW, row = Math.floor(i / PER_ROW);
		if (i === PER_ROW) top = Math.max(...under.flat().map((g) => g.box.b)) + ROW_GAP;
		const l = x0 + col * (BW + GAP_X), t = top, r = l + BW, b = t + 2 * HALF, m = t + HALF;
		const what = `box ${i + 1}`;
		const kind = STRETCHES[i][5];
		boxes.push({ l, t, r, b, m, row });
		const rect = (y1, y2) => `M${n2(l)},${n2(y1)}H${n2(r)}V${n2(y2)}H${n2(l)}Z`;
		if (kind === 'solid') S.fill(rect(t, b), { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'half') S.fill(rect(m, b), { l, r, t: m, b }, { color: FILL, layer: 1, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what });

		// the name, centred in the upper half on its caps and baselines (on its ink in a half-filled box, so that its
		// descenders clear the half line), or, when it is too long for the upper half and the box has no numbers,
		// centred in the whole box; the numbers, on lines of their own, centred together in the lower half on their ink
		const lines = names[i];
		const nums = [];
		if (STRETCHES[i][1].length) nums.push(STRETCHES[i][1].map((e) => `(${NUMBER[e]})`).join(', '));
		if (STRETCHES[i][2].length) nums.push(STRETCHES[i][2].map((f) => `Fig. ${FIGURE[f]}`).join(', '));
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const fitsHalf = lines.length <= 2 || kind === 'half';
		check(fitsHalf || !nums.length, `${what}: a name of ${lines.length} lines and numbers: no room`);
		const base0 = fitsHalf ? t + (HALF - blockH) / 2 + CAP * SIZE : t + (2 * HALF - blockH) / 2 + CAP * SIZE;
		let nameLabels = [];
		for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(textOf(s), (l + r) / 2, base0 + k * PITCH, INK));
		if (kind === 'half') {
			const inkT = Math.min(...nameLabels.map((g) => g.box.t)), inkB = Math.max(...nameLabels.map((g) => g.box.b));
			const dy = t + HALF / 2 - (inkT + inkB) / 2;
			nameLabels = [];
			for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(textOf(s), (l + r) / 2, base0 + dy + k * PITCH, INK));
			check(!nums.length, `${what} is half filled and has numbers: no room`);
		}
		for (const g of nameLabels) {
			g.inside = { l, r, t, b: fitsHalf ? m : b, what };
			L.push(g);
		}
		if (nums.length) {
			let numLabels = [];
			for (const [k, s] of nums.entries()) numLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, k * NUM_PITCH, INK));
			const inkT = Math.min(...numLabels.map((g) => g.box.t)), inkB = Math.max(...numLabels.map((g) => g.box.b));
			const dy = m + HALF / 2 - (inkT + inkB) / 2;
			numLabels = [];
			for (const [k, s] of nums.entries()) numLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, dy + k * NUM_PITCH, INK));
			for (const g of numLabels) { g.inside = { l, r, t: m, b, what }; L.push(g); }
		}

		// the chapters that teach it, under the box, and the later ones each in a small dotted box
		const u = [];
		for (const [k, s] of lists[i].entries()) u.push(await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM));
		const later = STRETCHES[i][4];
		if (later.length) u.push(...(await laterBoxes(later, (l + r) / 2, Math.max(...u.map((g) => g.box.b)) + LATER_DROP, BW, what)));
		for (const g of u) check(g.box.l >= l - 0.01 && g.box.r <= r + 0.01, `the chapter label ${g.src} is wider than ${what}`);
		under.push(u);
		L.push(...u);
	}

	// ---- the arrows: from the greyed box into the first box, and through the boxes in reading order
	const b1 = boxes[0];
	S.arrow([(b1.l + b1.r) / 2, R.b + HAIR / 2], [(b1.l + b1.r) / 2, b1.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow from the greyed box' });
	for (let i = 0; i + 1 < boxes.length; i++) {
		const a = boxes[i], c = boxes[i + 1];
		if (a.row === c.row) {
			S.arrow([a.r + STROKE / 2, a.m], [c.l - END_AIR, c.m], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from box ${i + 1}` });
			continue;
		}
		// from the end of the first row: out to the right, down below the row's chapters, back to the left over the
		// second row, and down into its first box
		const xOut = a.r + OUT;
		const yRun = (Math.max(...under.slice(0, PER_ROW).flat().map((g) => g.box.b)) + c.t) / 2;
		const xIn = (c.l + c.r) / 2;
		S.path([[a.r + STROKE / 2, a.m], [xOut, a.m], [xOut, yRun], [xIn, yRun]], { color: DIM, width: HAIR, cap: 'square', what: 'the return arrow' });
		const last = S.arrow([xIn, yRun], [xIn, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the return arrow\'s last leg' });
		check(last.head === HEAD, 'the return arrow\'s last leg is too short for a whole head');
		for (const g of under.slice(0, PER_ROW).flat()) check(g.box.b + LABEL_GAP <= yRun, `the return arrow touches ${g.src}`);
	}

	// ---- the small box to the right of the second row, centred on the sixth box's middle, and the dashed arrow into it
	const b6 = boxes[5];
	const fw = [];
	for (const [k, s] of FORWARD.entries()) fw.push(await placedBase(s, 0, k * PITCH, INK));
	const fInkW = Math.max(...fw.map((g) => g.box.r - g.box.l));
	const fInkH = Math.max(...fw.map((g) => g.box.b)) - Math.min(...fw.map((g) => g.box.t));
	const V = { l: b6.r + GAP_V, t: b6.m - fInkH / 2 - STUB_PAD[1], b: b6.m + fInkH / 2 + STUB_PAD[1] };
	V.r = V.l + fInkW + 2 * STUB_PAD[0];
	S.path([[V.l, V.t], [V.r, V.t], [V.r, V.b], [V.l, V.b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what: 'the small box' });
	let fLabels = [];
	for (const [k, s] of FORWARD.entries()) fLabels.push(await placedBase(s, (V.l + V.r) / 2, k * PITCH, INK));
	{
		const inkT = Math.min(...fLabels.map((g) => g.box.t)), inkB = Math.max(...fLabels.map((g) => g.box.b));
		const dy = (V.t + V.b) / 2 - (inkT + inkB) / 2;
		fLabels = [];
		for (const [k, s] of FORWARD.entries()) fLabels.push(await placedBase(s, (V.l + V.r) / 2, dy + k * PITCH, INK));
	}
	for (const g of fLabels) { g.inside = { ...V, what: 'the small box' }; L.push(g); }
	dashedArrow(S, [b6.r + STROKE / 2, b6.m], [V.l - END_AIR, b6.m], 'the dashed arrow');
	// the small box clears the return arrow's turn above it
	check(V.t > boxes[2].b, 'the small box reaches up beside the first row');

	// ---- checks: every label inside its box clears the box's edges by INSIDE (a later chapter's by its padding),
	// centred left and right
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIiAgainMap = { W, names, lists, stub: R, forward: V, boxes };
	return finish(S, L, [240, 340]);
}

/** A stretch's name line as TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
}

/** A dashed arrow from A to B, as Sheet.arrow but its shaft dashed: it starts and ends on a dash, the gaps stretched
 * a little to fit. */
function dashedArrow(S, A, B, what) {
	const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
	const hd = Math.min(HEAD, 0.4 * L);
	const u = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], w = [-u[1], u[0]], hw = 0.36 * hd;
	const base = [B[0] - u[0] * hd, B[1] - u[1] * hd];
	const s1 = [B[0] - u[0] * hd * 0.8, B[1] - u[1] * hd * 0.8];
	const shaft = L - hd * 0.8;
	const n = Math.max(1, Math.floor((shaft - DASH[0]) / (DASH[0] + DASH[1])));
	const gap = (shaft - (n + 1) * DASH[0]) / n;
	check(gap >= DASH[1] - 0.01 && gap <= DASH[1] * 1.7, `${what}: its gaps are ${gap.toFixed(2)} pt`);
	S.path([A, s1], { color: DIM, width: HAIR, layer: 2, dash: [DASH[0], n2(gap)], cap: 'butt', what });
	S.raw(`<path d="M${n2(B[0])},${n2(B[1])}L${n2(base[0] + w[0] * hw)},${n2(base[1] + w[1] * hw)}L${n2(base[0] - w[0] * hw)},${n2(base[1] - w[1] * hw)}Z" fill="${DIM}"/>`, 2);
	S.mark([B, [base[0] + w[0] * hw, base[1] + w[1] * hw], [base[0] - w[0] * hw, base[1] - w[1] * hw], B], 0, what + "'s head");
	S.arrows.push({ L, head: hd, what });
}

/** A dotted outline: round dots along each side, one at every corner, evenly spaced (as R3's). */
function dotted(S, { l, r, t, b }, what) {
	const d = [];
	for (const [A, B] of [[[l, t], [r, t]], [[r, t], [r, b]], [[r, b], [l, b]], [[l, b], [l, t]]]) {
		const len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.round(len / DOT_STEP));
		for (let k = 0; k < n; k++) d.push(`M${n2(A[0] + ((B[0] - A[0]) * k) / n)},${n2(A[1] + ((B[1] - A[1]) * k) / n)}h0`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${ACCENT}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], DOT / 2, what);
}

/** A text label with its baseline at y and its ink centred on x. */
async function placedBase(src, x, y, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
