// The tutorial, reading chapter R7b (tutorial/geometry/reading-section-v.md), its first diagram: Section V as a map of
// what Parts 5 and 7 have derived. The sibling of R5's map (figs/tut-read-iii-map.js) and R7's
// (figs/tut-read-ii-again-map.js): the same box, type, tint, outline, dotted outline, greyed box above, grey arrows and
// bracket into the capstone, and R3's half fill (figs/tut-read-iv2-map.js) for a box whose claims are of more than one
// kind, with its numbers in its filled lower half as R3's. Seven boxes, one for each stretch the chapter reads, in its
// order, four in the first row and three in the second (one drawing serves the desktop and the phone, so it is laid out
// to be read at 390 px, as R3's to R7's), joined in reading order by thin grey arrows: across each row, and from the
// end of the first row round to the start of the second. Boxes 3 to 7 are filled (every claim in them is checked
// here); boxes 1 and 2 have their lower half filled. Each box carries the stretch's name, wrapped to the box (in its
// upper half when the name fits there; the whole box, with its numbers under it, when it does not and the box is
// filled), and its equation numbers, and on a line of their own its figures, as the site prints them; under it, the
// chapters that teach it, wrapped to the box's width, and on a line of its own, in a small dotted box, the later
// chapter from which the box holds a claim that is read now and derived later. Above the first box a greyed box,
// "Parts 5 and 7", with an arrow down into it; at the right of the rows a thin bracket that gathers all seven and runs
// down into the capstone, a box with the orange outline and no fill under the second row. Every name, chapter list and
// number is the chapter's diagram comment's, checked against its text (the equations' and figures' numbers read off
// main.aux, as the site's /paper page prints them, checked below); the boxes' sizes and places are chosen for the
// drawing.
// The capstone's words are set on two lines, broken after "10^4 km,", so that the drawing stays within 300 points.
import { tex, INK, DIM, FAINT, ACCENT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-v-map';
const check = checker(name);

// ---- the chapter's seven stretches, in order (tutorial/geometry/reading-section-v.md) ----------------------------
// [name, its equations, its figures, taught in, read now and derived later in, its fill]
export const STRETCHES = [
	['Plain words', [], [], '5.2, 5.4, 7.6, 7.7', ['8.3'], 'half'],
	['Strain, power, dumbbell', ['quadrupole', 'dumbbell'], [], '7.7, 7.8', ['8.3'], 'half'],
	['A compact body is a point', ['unresolved'], [], '5.3, 7.7', [], 'solid'],
	['A source larger than its wave', ['wave-zone'], [], '5.2, 5.3, 7.7', [], 'solid'],
	['Polarization and the sense of turning', ['rotor-amplitudes', 'circular'], ['quadrupole', 'polarization'], '5.4, 7.7, 7.8', [], 'solid'],
	['What does not radiate', [], [], '7.6, 7.7', [], 'solid'],
	['The slowed light', [], ['which-way'], '5.2, 5.4, R5', [], 'solid']
];
// the equations' and the figures' numbers as the site's /paper page prints them (and main.aux's, checked below)
const NUMBER = { quadrupole: 27, dumbbell: 28, unresolved: 29, 'wave-zone': 30, 'rotor-amplitudes': 31, circular: 32 };
const FIGURE = { quadrupole: 15, polarization: 16, 'which-way': 17 };
const STUB = '\\text{Parts 5 and 7}';
const CAPSTONE = ['\\text{Capstone: the sealed rotor, 10 m to }10^4\\text{ km,}', '\\text{on the axis and edge-on}'];

// ---- the drawing (figure points, y down); everything as R5's map but the rows and the two lines of numbers -------
const SIZE = 8.5;                 // every label
const BW = 60;                    // a box's width: room for "Fig. 15, Fig. 16" (R3's to R5's is 58.09)
const HALF = 33;                  // half a box's height, as R3's to R7's
const GAP_X = 12;                 // between the boxes of a row: room for an arrow (R4's; four boxes leave less room)
const PER_ROW = 4;                // boxes in the first row
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline
const PITCH = 10;                 // baseline to baseline, within a name or a list of chapters
const NUM_PITCH = 11;             // baseline to baseline between a box's equation numbers and its figures (R7's)
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 21;               // from the lowest ink under a row to the next row's boxes: room for the return arrow
const STUB_PAD = [5, 3.6];        // the greyed box (and the capstone): air beside and above/below its text
const DROP = 11;                  // the arrow from the greyed box into the first box, and from the bracket into the capstone
const HEAD = 3.6;                 // the arrows' heads (two fifths of the arrow at most)
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const SPINE = 13;                 // from the rows' right edge to the bracket
const TICK = 2.6;                 // the bracket's top end, leftward
const CAP_OVER = 8;               // the capstone reaches this far right of the bracket
const OUT = 5.5;                  // the return arrow: from the fourth box's right edge out to its turn
const INSIDE = 2.6;               // the least air between a label and the edges of its box (or the half line)
const LIST_AIR = 1;               // a list of chapters stays this far inside its box's width on each side
const LATER_PAD = [2.4, 2.3];     // a later chapter's dotted box: air beside and above/below its number
const LATER_GAP = 4;              // between two later chapters' boxes, across and down
const LATER_DROP = 4.2;           // from the last list baseline's descender to the top of the later chapters' boxes
const NAME_EQ = 5.5;              // in a box whose name fills it, from the name's last baseline to the numbers' top (R5's 4, with air for the parentheses)

const FILL = '#f3dfcb';           // the solid fill: the pale tint of the accent (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter's comment, checked: seven stretches, two half filled and five filled, every one with chapters,
	// the later ones beyond Part 7; the equations', figures' and section's numbers
	check(STRETCHES.length === 7, 'the chapter reads seven stretches');
	check(STRETCHES.map((s) => s[5]).join() === 'half,half,solid,solid,solid,solid,solid', 'the fills are not two half filled and five filled');
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
	// the chapter's own text: each stretch's numbers are the ones it reads, and the graviton is read now from 8.3
	const md = await (await fetch('/tutorial/geometry/reading-section-v.md')).text();
	for (const k of Object.keys(NUMBER)) check(md.includes(`{{paper eq:${k}}}`), `the chapter does not show eq:${k}`);
	for (const k of Object.keys(FIGURE)) check(md.includes(`{{paper fig:${k}}}`), `the chapter does not show fig:${k}`);
	check(/\*read now, derived in Part 8\*, chapter 8\.3/.test(md), 'the graviton is not read now from 8.3');

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

	/** The later chapters, each in a small dotted box, in one row no wider than `room`, centred on x from the top y;
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
	check(R.r > x0 + BW / 2 + HEAD, 'the greyed box does not reach over the first box\'s middle');
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

		// the name, and the numbers: the name centred in the upper half on its caps and baselines (on its ink in a
		// half-filled box, so that its descenders clear the half line) and the numbers, on lines of their own, centred
		// together in the lower half on their ink, as R3's and R7's; a name too long for the upper half and the numbers
		// under it are centred together in the whole box, which only a filled box allows, as R5's
		const lines = names[i];
		const nums = [];
		if (STRETCHES[i][1].length) nums.push(STRETCHES[i][1].map((e) => `(${NUMBER[e]})`).join(', '));
		if (STRETCHES[i][2].length) nums.push(STRETCHES[i][2].map((f) => `Fig. ${FIGURE[f]}`).join(', '));
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const fitsHalf = lines.length <= 2;
		check(fitsHalf || kind === 'solid', `${what}: a name of ${lines.length} lines in a half-filled box`);
		let nameLabels = [];
		let numLabels = [];
		const setNums = async (dy) => {
			const out = [];
			for (const [k, s] of nums.entries()) out.push(await placedBase(`\\text{${s}}`, (l + r) / 2, dy + k * NUM_PITCH, INK));
			return out;
		};
		if (fitsHalf) {
			const base0 = t + (HALF - blockH) / 2 + CAP * SIZE;
			for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, INK));
			if (kind === 'half') {
				const inkT = Math.min(...nameLabels.map((g) => g.box.t)), inkB = Math.max(...nameLabels.map((g) => g.box.b));
				const dy = t + HALF / 2 - (inkT + inkB) / 2;
				nameLabels = [];
				for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + dy + k * PITCH, INK));
			}
			if (nums.length) {
				const probe = await setNums(0);
				const inkT = Math.min(...probe.map((g) => g.box.t)), inkB = Math.max(...probe.map((g) => g.box.b));
				numLabels = await setNums(m + HALF / 2 - (inkT + inkB) / 2);
			}
			for (const g of nameLabels) g.inside = { l, r, t, b: m, what };
			for (const g of numLabels) g.inside = { l, r, t: m, b, what };
		} else {
			// the name's caps to the numbers' foot, centred in the whole box
			const probe = await setNums(0);
			const numTop = Math.min(...probe.map((g) => g.box.t)), numFoot = Math.max(...probe.map((g) => g.box.b));
			const numH = nums.length ? NAME_EQ + numFoot - numTop : 0;
			const base0 = t + (2 * HALF - (blockH + numH)) / 2 + CAP * SIZE;
			for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, INK));
			if (nums.length) numLabels = await setNums(base0 + (lines.length - 1) * PITCH + NAME_EQ - numTop);
			for (const g of [...nameLabels, ...numLabels]) g.inside = { l, r, t, b, what };
			if (nums.length) check(Math.min(...numLabels.map((g) => g.box.t)) - Math.max(...nameLabels.map((g) => g.box.b)) >= LABEL_GAP, `the numbers of ${what} touch its name`);
		}
		L.push(...nameLabels, ...numLabels);

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
		// the run back to the left clears every label under the first row
		for (const g of under.slice(0, PER_ROW).flat()) check(g.box.b + LABEL_GAP <= yRun, `the return arrow touches ${g.src}`);
	}

	// ---- the bracket at the right of the rows, from the first row's top to below the last row's chapters, and on
	// down into the capstone, which spans the rows and the bracket
	const xs = x0 + W + SPINE;
	const yTop = boxes[0].t;
	const lastText = Math.max(...L.filter((g) => !g.inside || g.inside.what.startsWith('the dotted box')).map((g) => g.box.b));
	const cap = [];
	for (const [k, s] of CAPSTONE.entries()) cap.push(await placedBase(s, 0, k * PITCH, INK));
	const capInkW = Math.max(...cap.map((g) => g.box.r - g.box.l));
	const capInkH = Math.max(...cap.map((g) => g.box.b)) - Math.min(...cap.map((g) => g.box.t));
	const C = { l: x0, r: xs + CAP_OVER, t: lastText + DROP + 4 };
	C.b = C.t + capInkH + 2 * (STUB_PAD[1] + 1.6);
	check(capInkW + 2 * STUB_PAD[0] <= C.r - C.l, 'the capstone\'s words are wider than its box');
	S.path([[xs - TICK, yTop], [xs, yTop], [xs, C.t - END_AIR - DROP + 1.5]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket' });
	S.arrow([xs, C.t - END_AIR - DROP], [xs, C.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow into the capstone' });
	S.path([[C.l, C.t], [C.r, C.t], [C.r, C.b], [C.l, C.b]], { color: ACCENT, width: STROKE, closed: true, cap: 'butt', layer: 1, what: 'the capstone' });
	{
		const inkT = Math.min(...cap.map((g) => g.box.t)), inkB = Math.max(...cap.map((g) => g.box.b));
		const dy = (C.t + C.b) / 2 - (inkT + inkB) / 2;
		for (const [k, s] of CAPSTONE.entries()) {
			const g = await placedBase(s, (C.l + C.r) / 2, dy + k * PITCH, INK);
			g.inside = { ...C, what: 'the capstone' };
			L.push(g);
		}
	}
	// the return arrow keeps clear of the bracket, and the second row's last box of the bracket
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
	for (const g of L) check(g.box.r + LABEL_GAP <= xs || g.box.t >= C.t - 0.01, `the label ${g.src} reaches the bracket`);
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadVMap = { W, names, lists, stub: R, capstone: C, boxes };
	return finish(S, L, [240, 320]);
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
