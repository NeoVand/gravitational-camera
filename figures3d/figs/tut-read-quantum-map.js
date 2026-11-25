// The tutorial, reading chapter R8 (tutorial/quantum/reading-the-quantum-limits.md), its first diagram: the quantum
// stretches of Sections II and IV and Appendix A as a map of what Part 8 has derived, with two optional stretches of
// Sections IX and XI. The sibling of R3's to R7b's maps (figs/tut-read-iv2-map.js to figs/tut-read-v-map.js): the
// same box, type, half fill, dotted later chapters, greyed box above, grey arrows, return arrow and bracket into the
// capstone, here in ink and the page's greys only (the outline in ink, the fill the neutral tint of the page, the
// dotted boxes in grey), since orange and blue mean a stretch and a squeeze. Six boxes, one for each quantum stretch
// the chapter reads, in its order, four in the first row and two in the second (one drawing serves the desktop and the
// phone, so it is laid out to be read at 390 px, as R3's to R7b's), joined in reading order by thin grey arrows. A
// third row, offset to the right, holds the two optional stretches, dashed and wider (their names and numbers are
// longer), joined by an arrow, with "Read ahead" in grey at their left and, under each, the reading chapter that will
// point back. Boxes 1, 2, 3 and 6 are filled (every claim in them is checked here); boxes 4, 5, 7 and 8 have their
// lower half filled (they hold a claim read now and derived later, in the small dotted box under them, or stated in
// the paper). Each box carries the stretch's name, wrapped to the box, and under it, in its lower half, its numbers;
// under the box, the chapters that teach it. Above the first box a greyed box, "Part 8, completing R1, R3 and R4",
// with an arrow down into it; at the right of the rows a thin bracket that gathers all eight and runs down into the
// capstone, a box with an ink outline and no fill. Every name, number and chapter is checked against the chapter's
// text (its headings, its marks, the chapters each stretch cites, the equation's number off main.aux); the boxes'
// sizes and places are chosen for the drawing.
import { tex, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { pixelTide, ladder, blur } from './tut-sql-lib.js';
import { capacity } from './tut-bits-lib.js';
import { ball } from './tut-quanta-lib.js';

const name = 'tut-read-quantum-map';
const check = checker(name);

// ---- the chapter's eight stretches, in order (tutorial/quantum/reading-the-quantum-limits.md) ---------------------
// [its heading in the chapter, the box's name, its numbers (TeX, a line each), taught in, read now and derived later
// in, its fill, optional]
export const STRETCHES = [
	['Two gram masses at the standard quantum limit resolve a tide 144,000 times below the person\'s', '§II What the premise asks', ['\\text{one mass }6.5,', '\\text{two }9.2\\!\\times\\!10^{-14}'], '8.6', [], 'solid', false],
	['The plain words\' ceiling, its blur and its 22 kilobytes come out of Parts 3 and 8', '§IV plain words', ['10^{70}\\text{, }1.5^\\circ\\text{,}', '\\text{22 kB}'], '3.7, 3.8, 8.6', [], 'solid', false],
	['The ball\'s tremor is classical, holds four hundred million quanta and needs no graviton', 'What heat reveals', ['4\\times10^8\\text{ quanta}', '\\text{no graviton}'], '7.7, 8.3', [], 'solid', false],
	['No camera\'s state can change fast enough to pass about $10^{70}$ on a person', 'Limits on sensitivity (1)', ['\\mathrm{SNR}\\lesssim', 'M_sc^2\\tau/\\hbar'], '3.7, 8.6', ['11.1'], 'half', false],
	['A camera that could read a quantum mass would end its superposition', 'Limits on sensitivity (2)', ['\\text{a mass in}', '\\text{two places}'], '8.1', ['13.8'], 'half', false],
	['Appendix A\'s quantum jitter lies between the classical value and one mode', 'App. A, quoted by What an applied tide reveals', ['(\\mathrm{A1})'], '4.5, 8.7', [], 'solid', false],
	['Read ahead: a counter adds no noise, and each graviton tells about one bit', '§IX Counting or recording', ['\\text{with §VII\'s sentence:}', '1.17\\text{ bits}'], '8.4, 8.5, 8.6', ['Part 10'], 'half', true],
	['Read ahead: coincidences tell a sky born hot from one born in inflation', '§XI Counting coincidences', ['g^{(2)}'], '8.5', ['12.2'], 'half', true]
];
// the reading chapters each optional stretch is read ahead for
const AHEAD = { 6: 'for R10 and R11', 7: 'for R12' };
// a chapter a box lists that its stretch does not cite by number: the plain words' ceiling is the fourth stretch's,
// derived in 8.6
const ALSO = { 1: ['8.6'] };
const STUB = '\\text{Part 8, completing R1, R3 and R4}';
const CAPSTONE = '\\text{Capstone: from two grams to the ceiling}';
const ROW_OF = [0, 0, 0, 0, 1, 1, 2, 2], COL_OF = [0, 1, 2, 3, 0, 1, 0, 1];

// ---- the drawing (figure points, y down); everything as R7b's map but the colours and the third row --------------
const SIZE = 8.5;                 // every label
const BW = 60;                    // a box's width, as R7b's
const BW_OPT = 86;                // an optional box's width: room for "with §VII's sentence:" on one line
const HALF = 33;                  // half a box's height, as R3's to R7b's
const GAP_X = 12;                 // between the boxes of a row, as R7b's
const PER_ROW = 4;
const STROKE = 0.55;              // a box's outline
const DASH = [2.6, 1.6];          // an optional box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a later chapter
const PITCH = 10;                 // baseline to baseline, within a name or a list of chapters
const NUM_PITCH = 10.5;           // baseline to baseline between a box's lines of numbers
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 21;               // from the lowest ink under a row to the next row's boxes: room for the return arrow
const OPT_GAP = 14;               // the same above the optional row, which no arrow enters
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
const LATER_GAP = 4;              // between two later chapters' boxes
const LATER_DROP = 4.2;           // from the last list baseline's descender to the top of the later chapters' boxes
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma), as R3's
const AHEAD_DROP = 11;            // from the dotted box's bottom to the baseline of the reading chapter's line
const NAME_EQ = 5.5;              // in a box whose name fills it, from the name's last baseline to the numbers' top

const OUTLINE = INK;              // a box's outline
const FILL = '#eeebe5';           // the fill: the neutral tint of the page (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked: its headings in order, the marks read now and derived later, the chapters each stretch
	// cites, and the numbers the boxes print
	const md = await (await fetch('/tutorial/quantum/reading-the-quantum-limits.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 10 && heads[8] === 'The capstone: from two grams to the ceiling', `the chapter's headings ${heads}`);
	check(STRETCHES.every((s, i) => heads[i] === s[0]), 'the stretches are not the chapter\'s first eight sections, in order');
	const section = (i) => text.split(/^## .*$/m)[i + 1];
	const cites = (sec, c) => new RegExp(`(^|[^\\d.])${c.replace('.', '\\.')}([^\\d]|$)`).test(sec);
	for (const [i, s] of STRETCHES.entries()) {
		for (const c of s[3].split(', ')) check(cites(section(i), c) || (ALSO[i] ?? []).includes(c), `the stretch "${s[1]}" does not cite ${c}`);
		for (const c of s[4]) check(cites(section(i), c), `the stretch "${s[1]}" does not cite ${c}`);
	}
	// the paragraphs named, in their stretches
	const para = { 0: 'What the premise asks', 2: 'What heat reveals', 3: 'Limits on sensitivity', 4: 'The second paragraph', 5: 'What an applied tide reveals', 6: 'Counting or recording', 7: 'Counting coincidences' };
	for (const [i, p] of Object.entries(para)) check(section(Number(i)).includes(p), `the stretch ${i} does not name ${p}`);
	check(section(6).includes('[*What a lens would add*]') && section(6).includes('Section VII'), 'Section VII\'s sentence is not read in the stretch of Section IX');
	check(section(1).includes('plain words of Section IV'), 'the second stretch is not the plain words of Section IV');
	check(section(5).includes('Appendix A') && section(5).includes('{{paper eq:jitter-bounds}}'), 'the sixth stretch does not show eq:jitter-bounds');
	// the marks: read now and derived later in 11.1, 13.8, Part 10 and 12.2, and nothing else
	const one = (i) => section(i).replace(/\s+/g, ' ');
	check(/\*read now, derived in Part 11\*, chapter 11\.1/.test(one(3)) && /\*read now, derived in Part 13\*, chapter \[13\.8\]\(\/tutorial\//.test(one(4)), 'the marks of 11.1 and 13.8');
	check(/\*read now, derived in Part 10\*/.test(one(6)) && /\*read now, derived in chapter \[12\.2\]\(\/tutorial\//.test(one(7)), 'the marks of Part 10 and 12.2');
	const laterMarks = [...flat.matchAll(/\*read now, derived in (?:Part (\d+)\*|chapter \[(\d+)\.\d+\])/g)].filter((m) => Number(m[1] ?? m[2]) > 8);
	check(laterMarks.length === 4, `the chapter reads now ${laterMarks.length} claims derived after Part 8, not four`);
	check(section(4).includes('*stated in the paper*') && section(6).includes('*stated in the paper*') && section(7).includes('*stated in the paper*'), 'the stated claims of the half-filled boxes');
	for (const i of [0, 1, 2, 5]) check(!/\*read now|\*stated in the paper\*/.test(section(i)), `the filled box ${i + 1} holds a claim not checked here`);
	// the numbers: the pixel's tide, the ceiling's 10^70, its blur and its 22 kilobytes, the quanta, the bits, (A1)
	const sig = (v, d) => Number(v).toPrecision(d);
	check(sig(pixelTide(), 2) === '6.5e-14' && flat.includes('$2\\sigma_{\\rm SQL}/\\xi\\tau^2 = 6.5\\times10^{-14}\\unit{s^{-2}}$'), 'the pixel\'s tide');
	// the box prints both: the one-mass estimate, and the two masses' distance, sqrt 2 more, the paper's figure
	check(sig(Math.SQRT2 * pixelTide(), 2) === '9.2e-14' && flat.includes('resolves $\\sqrt2$ times more, $9.2\\times10^{-14}\\unit{s^{-2}}$, the paper\'s figure') && flat.includes('this chapter carries the one-mass estimate'), 'the two masses\' tide');
	const tex2 = (await (await fetch('/paper/sections/02-pixel.tex')).text()).replace(/\s+/g, ' ');
	check(tex2.includes('would resolve $9\\times10^{-14}\\,\\mathrm{s^{-2}}$') && flat.includes('"would resolve $9\\times10^{-14}\\,\\mathrm{s^{-2}}$"'), 'the paper\'s 9 x 10^-14');
	const ceiling = ladder().ceiling, d = Math.log10(ceiling);
	check(sig(ceiling, 2) === '2.6e+70' && Math.round(d) === 70 && flat.includes('it is $2.6\\times10^{70}$, "about $10^{70}$"'), `the ceiling ${ceiling}`);
	check(blur(d).toFixed(2) === '1.51' && flat.includes('a blur of $1.51°$ at that ratio'), `the ceiling's blur ${blur(d)}`);
	const kB = capacity(d) / 8000;
	check(kB.toFixed(1) === '22.6' && flat.includes('which is 22.6 kilobytes of 8000 bits'), `the kilobytes ${kB}`);
	const quanta = ball();
	check(sig(quanta, 2) === '4.1e+8' && sig(quanta, 1) === '4e+8' && flat.includes('$\\kB T/\\hbar\\omega = 4.1\\times10^8$ at Rayleigh\'s 15.1 kHz'), `the quanta ${quanta}`);
	const bits = Math.log2(5) - 4 / (5 * Math.LN2);
	check(bits.toFixed(3) === '1.168' && bits.toFixed(2) === '1.17' && flat.includes('$\\log_2 5 - 4/(5\\ln2) = 1.168$ bits'), `the bits ${bits}`);
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('eq:jitter-bounds') === 'A1', 'eq:jitter-bounds is not (A1)');
	for (const [label, n] of [['sec:pixel', 'II'], ['sec:near-field', 'IV'], ['sec:no-lens', 'VII'], ['sec:first-image', 'IX'], ['sec:vistas', 'XI']]) check(auxNumber(label) === n, `${label} is not Section ${n}`);
	check(flat.includes('$\\sym{second-order-coherence}{g^{(2)}}$'), 'the stretch of Section XI does not use g^(2)');
	// the fills: four filled, four half filled; the later chapters beyond Part 8
	check(STRETCHES.map((s) => s[5]).join() === 'solid,solid,solid,half,half,solid,half,half', 'the fills');
	const part = (c) => (c.startsWith('Part ') ? Number(c.slice(5)) : Number(c.split('.')[0]));
	for (const s of STRETCHES) {
		check(s[3].split(', ').every((c) => part(c) <= 8), `the list ${s[3]} holds a later chapter`);
		check(s[4].every((c) => part(c) > 8), `the later chapters ${s[4]} are not later`);
	}

	// ---- wrapping: greedily, at spaces, to a width
	const width = async (s) => { const b = boxOf(await tex(`\\text{${s}}`, [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const wrap = async (txt, room, glue) => {
		const words = txt.split(glue === ', ' ? ', ' : /\s/).filter(Boolean);
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
	const bw = (i) => (STRETCHES[i][6] ? BW_OPT : BW);
	const names = [], lists = [];
	for (const [i, s] of STRETCHES.entries()) {
		const n = await wrap(s[1], bw(i) - 2 * INSIDE, ' ');
		check(n.join(' ') === s[1], `the name "${s[1]}" is not wrapped whole`);
		names.push(n);
		const l = await wrap(s[3], bw(i) - 2 * LIST_AIR, ', ');
		check(l.join(' ') === s[3], `the list of "${s[1]}" is not wrapped whole`);
		lists.push(l);
	}

	/** The later chapters, each in a small dotted box, in one row no wider than `room`, centred on x from the top y. */
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
	const left = (i) => (STRETCHES[i][6] ? x0 + W - (2 - COL_OF[i]) * BW_OPT - (1 - COL_OF[i]) * GAP_X : x0 + COL_OF[i] * (BW + GAP_X));

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
		const row = ROW_OF[i];
		if (i > 0 && row !== ROW_OF[i - 1]) top = Math.max(...under.flat().map((g) => g.box.b)) + (STRETCHES[i][6] ? OPT_GAP : ROW_GAP);
		const l = left(i), t = top, r = l + bw(i), b = t + 2 * HALF, m = t + HALF;
		const what = `box ${i + 1}`;
		const [, , nums, , later, kind, optional] = STRETCHES[i];
		boxes.push({ l, t, r, b, m, row });
		const rect = (y1, y2) => `M${n2(l)},${n2(y1)}H${n2(r)}V${n2(y2)}H${n2(l)}Z`;
		if (kind === 'solid') S.fill(rect(t, b), { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		if (kind === 'half') S.fill(rect(m, b), { l, r, t: m, b }, { color: FILL, layer: 1, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what, dash: optional ? DASH : null });

		// the name centred in the upper half, on its caps and baselines (on its ink in a half-filled box), and the
		// numbers centred together in the lower half on their ink; a name too long for the upper half and the numbers
		// under it are centred together in the whole box, which only a filled box allows, as R5's and R7b's
		const lines = names[i];
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const fitsHalf = lines.length <= 2;
		check(fitsHalf || kind === 'solid', `${what}: a name of ${lines.length} lines in a half-filled box`);
		let nameLabels = [];
		let numLabels = [];
		const setNums = async (dy) => {
			const out = [];
			for (const [k, s] of nums.entries()) out.push(await placedBase(s, (l + r) / 2, dy + k * NUM_PITCH, INK));
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
			const probe = await setNums(0);
			const inkT = Math.min(...probe.map((g) => g.box.t)), inkB = Math.max(...probe.map((g) => g.box.b));
			numLabels = await setNums(m + HALF / 2 - (inkT + inkB) / 2);
			for (const g of nameLabels) g.inside = { l, r, t, b: m, what };
			for (const g of numLabels) g.inside = { l, r, t: m, b, what };
		} else {
			const probe = await setNums(0);
			const numTop = Math.min(...probe.map((g) => g.box.t)), numFoot = Math.max(...probe.map((g) => g.box.b));
			const numH = NAME_EQ + numFoot - numTop;
			const base0 = t + (2 * HALF - (blockH + numH)) / 2 + CAP * SIZE;
			for (const [k, s] of lines.entries()) nameLabels.push(await placedBase(`\\text{${s}}`, (l + r) / 2, base0 + k * PITCH, INK));
			numLabels = await setNums(base0 + (lines.length - 1) * PITCH + NAME_EQ - numTop);
			for (const g of [...nameLabels, ...numLabels]) g.inside = { l, r, t, b, what };
			check(Math.min(...numLabels.map((g) => g.box.t)) - Math.max(...nameLabels.map((g) => g.box.b)) >= LABEL_GAP, `the numbers of ${what} touch its name`);
		}
		// the lines of one name, and of one box's numbers, are one label: they keep apart, and are checked as one
		// against the marks and the other labels
		for (const [group, ls] of [['name', nameLabels], ['numbers', numLabels]]) {
			for (let k = 1; k < ls.length; k++) check(ls[k].box.t - ls[k - 1].box.b >= 0.5, `the lines of the ${group} of ${what} touch`);
			for (const g of ls) g.group = `the ${group} of ${what}`;
		}
		L.push(...nameLabels, ...numLabels);

		// the chapters that teach it, under the box; the later ones each in a small dotted box; the reading chapter
		// an optional stretch is read ahead for, in grey
		const u = [];
		for (const [k, s] of lists[i].entries()) u.push(await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM));
		if (later.length) u.push(...(await laterBoxes(later, (l + r) / 2, b + UNDER + (lists[i].length - 1) * PITCH + DESC + LATER_DROP, bw(i), what)));
		if (AHEAD[i]) {
			const lastBox = u[u.length - 1].inside;
			u.push(await placedBase(`\\text{${AHEAD[i]}}`, (l + r) / 2, lastBox.b + AHEAD_DROP, FAINT));
		}
		for (const g of u) check(g.box.l >= l - 0.01 && g.box.r <= r + 0.01, `the label ${g.src} is wider than ${what}`);
		under.push(u);
		L.push(...u);
	}

	// ---- the arrows: from the greyed box into the first box, and through the boxes in reading order; none from the
	// sixth box into the optional row
	const b1 = boxes[0];
	S.arrow([(b1.l + b1.r) / 2, R.b + HAIR / 2], [(b1.l + b1.r) / 2, b1.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow from the greyed box' });
	for (let i = 0; i + 1 < boxes.length; i++) {
		const a = boxes[i], c = boxes[i + 1];
		if (a.row === c.row) {
			S.arrow([a.r + STROKE / 2, a.m], [c.l - END_AIR, c.m], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from box ${i + 1}` });
			continue;
		}
		if (c.row === 2) continue;
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

	// ---- "Read ahead" at the left of the optional row, centred in the room left of its first box
	{
		const o = boxes[6];
		const g = await placed('\\text{Read ahead}', (x0 + o.l - GAP_X) / 2, o.m, 0.5, 0.5, FAINT, SIZE);
		check(g.box.l >= x0 && g.box.r + GAP_X <= o.l, '"Read ahead" does not fit left of the optional row');
		L.push(g);
	}

	// ---- the bracket at the right of the rows, from the first row's top to below the last row's labels, and on down
	// into the capstone, which spans the rows and the bracket
	const xs = x0 + W + SPINE;
	const yTop = boxes[0].t;
	const lastText = Math.max(...L.filter((g) => !g.inside || g.inside.what.startsWith('the dotted box')).map((g) => g.box.b));
	const cap = await placedBase(CAPSTONE, 0, 0, INK);
	const capInkW = cap.box.r - cap.box.l, capInkH = cap.box.b - cap.box.t;
	const C = { l: x0, r: xs + CAP_OVER, t: lastText + DROP + 4 };
	C.b = C.t + capInkH + 2 * (STUB_PAD[1] + 1.6);
	check(capInkW + 2 * STUB_PAD[0] <= C.r - C.l, 'the capstone\'s words are wider than its box');
	S.path([[xs - TICK, yTop], [xs, yTop], [xs, C.t - END_AIR - DROP + 1.5]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bracket' });
	S.arrow([xs, C.t - END_AIR - DROP], [xs, C.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow into the capstone' });
	S.path([[C.l, C.t], [C.r, C.t], [C.r, C.b], [C.l, C.b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what: 'the capstone' });
	{
		const dy = (C.t + C.b) / 2 - (cap.box.t + cap.box.b) / 2;
		const g = await placedBase(CAPSTONE, (C.l + C.r) / 2, dy, INK);
		g.inside = { ...C, what: 'the capstone' };
		L.push(g);
	}
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
	const merged = [];
	for (const g of L) {
		const m = g.group && merged.find((h) => h.group === g.group);
		if (!m) { merged.push({ ...g, box: { ...g.box } }); continue; }
		m.src += ` / ${g.src}`;
		m.box = { l: Math.min(m.box.l, g.box.l), r: Math.max(m.box.r, g.box.r), t: Math.min(m.box.t, g.box.t), b: Math.max(m.box.b, g.box.b) };
	}
	S.checkAll(merged, LABEL_GAP - 0.05);
	window.tutReadQuantumMap = { W, names, lists, stub: R, capstone: C, boxes };
	return finish(S, L, [240, 320]);
}

/** A dotted outline: round dots along each side, one at every corner, evenly spaced (as R3's), in grey. */
function dotted(S, { l, r, t, b }, what) {
	const d = [];
	for (const [A, B] of [[[l, t], [r, t]], [[r, t], [r, b]], [[r, b], [l, b]], [[l, b], [l, t]]]) {
		const len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.round(len / DOT_STEP));
		for (let k = 0; k < n; k++) d.push(`M${n2(A[0] + ((B[0] - A[0]) * k) / n)},${n2(A[1] + ((B[1] - A[1]) * k) / n)}h0`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], DOT / 2, what);
}

/** A TeX label with its baseline at y and its ink centred on x. */
async function placedBase(src, x, y, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
