// The tutorial, reading chapter R4 (tutorial/response/reading-section-iv-3.md), its first diagram: the stretches of the
// paper that the chapter reads, as a map of what Part 4 has proved. The sibling of R3's map (figs/tut-read-iv2-map.js):
// the same box, type, tint, outline, dotted outline, greyed box above and bracket into the capstone. Seven boxes, one
// for each stretch the chapter reads, in its order, four in the first row and three in the second (one drawing serves
// the desktop and the phone, so it is laid out to be read at 390 px, as R3's), joined in reading order by thin grey
// arrows: across each row, and from the end of the first row round to the start of the second. Every stretch is
// checked here, so every box is filled. Each box carries the stretch's name, wrapped to the box (its upper half, as
// R3's, when the name fits there; the whole box when it does not), and its equation numbers, as the site prints them;
// under it, the chapters that teach it, wrapped to the box's width, and on a line of their own, each in a small dotted
// box, the later chapters from which the box holds a claim that is read now and derived later. Above the first box a
// greyed box, "The first half: R2. How sharp: R3.", with an arrow down into it; at the right of the rows a thin
// bracket that gathers all seven and runs down into one larger, filled box, the capstone. Every name, chapter list and
// equation number is the chapter's diagram comment's (the equation numbers read off the site's /paper page) and is
// checked below; the boxes' sizes and places are chosen for the drawing.
// The comment names the fourth stretch "Fig. tremor"; the drawing prints the figure's number, as the site does. It
// names the third "What heat reveals, second paragraph: three conditions, the lattice, the steel ball", which would run
// to eight lines in a box that holds five; the drawing keeps "What heat reveals, second paragraph", the second's twin.
import { tex, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-iv3-map';
const check = checker(name);

// ---- the chapter's seven stretches, in order (tutorial/response/reading-section-iv-3.md) --------------------------
// [name, its equations, taught in, read now and derived later in]
export const STRETCHES = [
	['Plain words: Heat; A tide applied from outside', [], '4.2, 4.3, 4.5, 4.6', []],
	['What heat reveals, first paragraph', ['thermal-moment', 'thermal-multipole'], '2.1, 2.2, 3.9, 4.2, 4.6', ['13.2']],
	['What heat reveals, second paragraph', [], '3.3, 4.2, 4.3, 4.6', ['5.2', '7.7']],
	['Fig. 8 and App. A, The trembling lattice', ['jitter-bounds'], '4.3, 4.5, 4.6', ['8.7']],
	['What an applied tide reveals', ['sum-rule'], '4.5, 4.6', ['8.7']],
	['A model-independent thermometer', ['thermometer'], '2.2, 2.3, 4.6', []],
	['Sec. XIII, The field at two times', ['hair-commutator', 'dust'], '1.7, 4.2, 4.5', ['8.2']]
];
// the equations' numbers as the site's /paper page prints them (the appendix's continue the main text's count; the
// others are also main.aux's, checked below), and the figure's
const NUMBER = { 'thermal-moment': 13, 'thermal-multipole': 14, 'jitter-bounds': 102, 'sum-rule': 15, thermometer: 16, 'hair-commutator': 82, dust: 83 };
const FIGURE = { tremor: 8 };
const STUB = '\\text{The first half: R2. How sharp: R3.}';
const CAPSTONE = '\\text{The capstone: the steel ball}';

// ---- the drawing (figure points, y down); everything as R3's map but the rows, the arrows and the dotted chapters --
const SIZE = 8.5;                 // every label
const BW = 58.09;                 // a box's width: R3's
const HALF = 33;                  // half a box's height, as R3's
const GAP_X = 12;                 // between the boxes of a row: room for an arrow (R3's, without arrows, is 6.5)
const PER_ROW = 4;                // boxes in the first row
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline
const PITCH = 10;                 // baseline to baseline, within a name or a list of chapters
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 21;               // from the lowest ink under a row to the next row's boxes: room for the return arrow
const STUB_PAD = [5, 3.6];        // the greyed box: air beside and above/below its text
const DROP = 11;                  // the arrow from the greyed box into the first box, and from the bracket into the capstone
const HEAD = 3.6;                 // the arrows' heads (two fifths of the arrow at most)
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const SPINE = 13;                 // from the rows' right edge to the bracket
const TICK = 2.6;                 // the bracket's top end, leftward
const OUT = 5.5;                  // the return arrow: from the fourth box's right edge out to its turn
const CAP_H = 26;                 // the capstone's height
const INSIDE = 2.6;               // the least air between a label and the edges of its box
const LIST_AIR = 1;               // a list of chapters stays this far inside its box's width on each side
const LATER_PAD = [2.4, 2.3];     // a later chapter's dotted box: air beside and above/below its number
const LATER_GAP = 4;              // between two later chapters' boxes
const LATER_DROP = 4.2;           // from the last list baseline's descender to the top of the later chapters' boxes
const NAME_EQ = 4;                // in a box whose name fills it, from the name's last baseline to the equations' top

const FILL = '#f3dfcb';           // the solid fill: the pale tint of the accent (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter's comment, checked: seven stretches, every one with chapters, the later ones beyond Part 4
	check(STRETCHES.length === 7, 'the chapter reads seven stretches');
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	for (const [k, v] of Object.entries(NUMBER)) {
		if (k === 'jitter-bounds') check(auxNumber(`eq:${k}`) === 'A1', 'the jitter bounds are not the appendix\'s first equation');
		else check(auxNumber(`eq:${k}`) === String(v), `eq:${k} is not (${v})`);
	}
	check(auxNumber('fig:tremor') === String(FIGURE.tremor), 'fig:tremor is not Figure 8');
	const part = (c) => Number(c.split('.')[0]);
	for (const [, , list, later] of STRETCHES) {
		check(list.split(', ').every((c) => part(c) <= 4), `the list ${list} holds a later chapter`);
		check(later.every((c) => part(c) > 4), `the later chapters ${later} are not later`);
	}

	// ---- wrapping: greedily, at spaces and after hyphens, to a width
	const width = async (s) => { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const wrap = async (text, room, glue) => {
		const words = text.split(glue === ', ' ? ', ' : /(?<=-)|\s/).filter(Boolean);
		const lines = [];
		let line = '';
		for (const [j, w0] of words.entries()) {
			const w = glue === ', ' && j < words.length - 1 ? `${w0},` : w0;
			const sep = line && !line.endsWith('-') ? ' ' : '';
			const next = line + sep + w;
			if (line && (await width(next)) > room) { lines.push(line); line = w; } else line = next;
		}
		lines.push(line);
		for (const l of lines) check((await width(l)) <= room, `the line "${l}" is wider than its box`);
		return lines;
	};
	const names = [], lists = [];
	for (const s of STRETCHES) {
		const n = await wrap(s[0], BW - 2 * INSIDE, ' ');
		check(n.join(' ').replace(/- /g, '-') === s[0], `the name "${s[0]}" is not wrapped whole`);
		names.push(n);
		const l = await wrap(s[2], BW - 2 * LIST_AIR, ', ');
		check(l.join(' ') === s[2], `the list of "${s[0]}" is not wrapped whole`);
		lists.push(l);
	}

	// ---- the rows
	const W = PER_ROW * BW + (PER_ROW - 1) * GAP_X;
	const x0 = ORIGIN - W / 2;

	// the greyed box above the first box
	const stub = await placedBase(STUB, 0, 0, FAINT);
	const stubW = stub.box.r - stub.box.l, stubH = stub.box.b - stub.box.t;
	const R = { l: x0, t: ORIGIN - 250 };
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
		const col = i < PER_ROW ? i : i - PER_ROW, row = i < PER_ROW ? 0 : 1;
		if (i === PER_ROW) top = Math.max(...under.flat().map((g) => g.box.b)) + ROW_GAP;
		const l = x0 + col * (BW + GAP_X), t = top, r = l + BW, b = t + 2 * HALF, m = t + HALF;
		const what = `box ${i + 1}`;
		boxes.push({ l, t, r, b, m, row });
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what });

		// the name, and the equation numbers: the name centred in the upper half on its caps and baselines and the
		// numbers centred in the lower half on their ink, as R3's; a name too long for the upper half and the numbers
		// under it are centred together in the whole box
		const lines = names[i];
		const eqs = STRETCHES[i][1].map((e) => `(${NUMBER[e]})`).join(', ');
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const fitsHalf = lines.length <= 2;                // as R3's names, which run to two lines
		let base0, eqY;
		if (fitsHalf) {
			base0 = t + (HALF - blockH) / 2 + CAP * SIZE;
			eqY = { y: m + HALF / 2, ay: 0.5 };
		} else {
			const eqH = eqs ? NAME_EQ + (await placed(`\\text{${eqs}}`, 0, 0, 0, 0, INK, SIZE)).box.b - (await placed(`\\text{${eqs}}`, 0, 0, 0, 0, INK, SIZE)).box.t : 0;
			// the ink of the block: the caps of the first line to the parentheses' foot (or the last baseline)
			const total = blockH + eqH;
			base0 = t + (2 * HALF - total) / 2 + CAP * SIZE;
			eqY = { y: base0 + (lines.length - 1) * PITCH + NAME_EQ, ay: 0 };
		}
		const inName = [];
		for (const [k, s] of lines.entries()) {
			const g = await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, INK);
			g.inside = { l, r, t, b: fitsHalf ? m : b, what };
			L.push(g); inName.push(g);
		}
		if (eqs) {
			const g = await placed(`\\text{${eqs}}`, (l + r) / 2, eqY.y, 0.5, eqY.ay, INK, SIZE);
			g.inside = { l, r, t: fitsHalf ? m : t, b, what };
			if (!fitsHalf) check(g.box.t - Math.max(...inName.map((n) => n.box.b)) >= LABEL_GAP, `the equations of ${what} touch its name`);
			L.push(g);
		}

		// the chapters that teach it, under the box, and the later ones each in a small dotted box
		const u = [];
		for (const [k, s] of lists[i].entries()) u.push(await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM));
		const later = STRETCHES[i][3];
		if (later.length) {
			const probes = [];
			for (const c of later) probes.push(await placed(`\\text{${c}}`, 0, 0, 0, 0, DIM, SIZE));
			const ws = probes.map((p) => p.box.r - p.box.l + 2 * LATER_PAD[0]);
			const hInk = Math.max(...probes.map((p) => p.box.b - p.box.t));
			const span = ws.reduce((s, w) => s + w, 0) + (later.length - 1) * LATER_GAP;
			const bt = Math.max(...u.map((g) => g.box.b)) + LATER_DROP, bh = hInk + 2 * LATER_PAD[1];
			let bl = (l + r) / 2 - span / 2;
			for (const [k, c] of later.entries()) {
				const box = { l: bl, r: bl + ws[k], t: bt, b: bt + bh };
				dotted(S, box, `the dotted box of ${c} under ${what}`);
				const g = await placed(`\\text{${c}}`, (box.l + box.r) / 2, (box.t + box.b) / 2, 0.5, 0.5, DIM, SIZE);
				g.inside = { ...box, what: `the dotted box of ${c} under ${what}` };
				u.push(g);
				bl = box.r + LATER_GAP;
			}
		}
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
		// the bends as one line, and the last leg, down into the box, as an arrow drawn as the others
		S.path([[a.r + STROKE / 2, a.m], [xOut, a.m], [xOut, yRun], [xIn, yRun]], { color: DIM, width: HAIR, cap: 'square', what: 'the return arrow' });
		const last = S.arrow([xIn, yRun], [xIn, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the return arrow\'s last leg' });
		check(last.head === HEAD, 'the return arrow\'s last leg is too short for a whole head');
		window.returnArrow = { xOut, yRun, xIn };
	}

	// ---- the bracket at the right of the rows, from the first row's top to below the last row's chapters, and on
	// down into the capstone
	const xs = x0 + W + SPINE;
	const yTop = boxes[0].t;
	const lastText = Math.max(...L.filter((g) => !g.inside || g.inside.what.startsWith('the dotted box')).map((g) => g.box.b));
	const C = { l: x0, r: xs + 2 * STUB_PAD[0] + 10, t: lastText + DROP + 4 };
	C.b = C.t + CAP_H;
	S.path([[xs - TICK, yTop], [xs, yTop], [xs, C.t - END_AIR - DROP + 1.5]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket' });
	S.arrow([xs, C.t - END_AIR - DROP], [xs, C.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow into the capstone' });
	S.fill(`M${n2(C.l)},${n2(C.t)}H${n2(C.r)}V${n2(C.b)}H${n2(C.l)}Z`, C, { color: FILL, layer: 1, what: 'the capstone', solid: false });
	S.path([[C.l, C.t], [C.r, C.t], [C.r, C.b], [C.l, C.b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what: 'the capstone' });
	const capText = await placed(CAPSTONE, (C.l + C.r) / 2, (C.t + C.b) / 2, 0.5, 0.5, INK, SIZE);
	capText.inside = { ...C, what: 'the capstone' };
	L.push(capText);
	// the return arrow keeps clear of the bracket
	check(xs - (x0 + W + OUT) >= 6, 'the return arrow runs too near the bracket');

	// ---- checks: every label inside its box clears the box's edges by INSIDE (a later chapter's by its padding),
	// centred left and right
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) check(g.box.r + LABEL_GAP <= xs || g.inside?.what === 'the capstone', `the label ${g.src} reaches the bracket`);
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIv3Map = { W, names, lists, stub: R, capstone: C, boxes };
	return finish(S, L, [240, 340]);
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
