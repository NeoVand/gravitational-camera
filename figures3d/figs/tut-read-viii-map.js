// The tutorial, reading chapter R9 (tutorial/one-point/reading-section-viii.md), its one diagram: the first half of
// Section VIII as a map of what Part 9 and the parts before it have derived. The sibling of R7's and R8's maps
// (figs/tut-read-ii-again-map.js, figs/tut-read-quantum-map.js): the same box, type, fill, outline, dotted box,
// greyed box above, grey arrows and return arrow, in ink and the page's greys only (the outline in ink, the fill the
// neutral tint of the page, the dotted boxes in grey), since orange and blue mean a stretch and a squeeze. Ten boxes,
// one for each stretch the chapter reads, in its order, five in the first row and five in the second (one drawing
// serves the desktop and the phone, so it is laid out to be read at 390 px, as R3's to R8's), joined in reading order
// by thin grey arrows. Every box is filled: every claim in it is checked here or derived in Part 9 or earlier. Each box
// carries the stretch's name, wrapped to the box, and under it its equations' numbers as the site prints them (and the
// paper's figure the stretch shows); under the box, the chapters its section of the chapter cites, and under those,
// each in a small dotted box, the results the ledger lists as stated rather than derived. Above the first box a greyed
// box, "Part 9: one point of the field", with an arrow down into it. Below the rows, faint and dashed, a strip of
// sixteen small boxes, the section's other sixteen paragraphs, labelled "R9b, after 9.5–9.7", with the first and the
// last paragraph named at its ends. Every name, number and chapter is checked against the chapter's text (its
// headings in order, the chapters each section cites, the equations and figures it shows, the results its ledger
// lists as stated) and against the paper (main.aux, Section VIII's paragraphs); the boxes' sizes and places are
// chosen for the drawing.
import { tex, INK, DIM, FAINT } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-viii-map';
const check = checker(name);

// ---- the chapter's ten stretches, in order (tutorial/one-point/reading-section-viii.md) ---------------------------
// [its heading in the chapter, the box's name, a phrase of the section that names the stretch, its equations, its
// figure, the chapters its section cites, the results stated (the box's text, the ledger's words, the section's words
// or null)]
export const STRETCHES = [
	['The plain words hold, up to the moving body', 'Plain words (first half)', '[plain words](/paper/#sec:one-pixel)', [], null, '9.1, 9.3, 9.4', []],
	['Ten numbers are six more than a wave needs', 'Opening', 'A detector of one component cannot tell a wave', [], null, 'R1, 1.4, 9.7', []],
	['The ten numbers are one complex table, and a wave\'s is a square', 'One complex matrix', '[*One complex matrix*]', ['W', 'invariants', 'square', 'one-wave'], null,
		'1.1, 6.1, 6.6, 7.6, 8.4, 9.1, 9.2, 9.3', [
			['$SO(3,\\mathbb C)$', 'the group $SO(3,\\mathbb C)$', '$SO(3,\\mathbb C)$ is *stated in the paper*'],
			['the boost rule\'s gap', '[its boost rule\'s gap]', 'as a sketch with a named gap'],
			['matter neither reflects nor absorbs', 'and that matter neither reflects nor absorbs', '"matter neither reflects nor absorbs gravitational waves" is *stated in the paper*']
		]],
	['Four directions on the sky sort every reading', 'Principal null directions', '[*Principal null directions*]', ['stars'], 'stars', '6.6, 8.4, 9.4', [
		['Penrose\'s shapes and roots', 'Penrose\'s link of [shapes to root patterns]', null],
		['M\\"obius maps', 'the [Möbius maps]', null],
		['Majorana\'s factors and phases', 'Majorana\'s factors and phases', null]
	]],
	['One of the four spins points along the super-Poynting vector', 'Four spins one half', 'a state of four spins one half', ['one-spin'], null, '8.4', [
		['classes of entanglement', 'the classes of entanglement', 'are then classes of entanglement is *stated in the paper*']
	]],
	['The shape of the tide tells an isolated wave from an isolated mass', 'Shape', '[*Shape*]', [], null, '7.6', []],
	['The magnetic part equals the tide in a wave and is small near slow matter', 'The magnetic part', '[*The magnetic part*]', ['magnetic-ratio'], null, '7.5, 7.6, 9.3', []],
	['Ten numbers are four invariants, an orientation and a velocity', 'Ten numbers', '[*Ten numbers*]', ['polar', 'speedometer'], null, '9.2, 9.3', [
		['Schur\'s theorem', '[Schur\'s theorem]', 'by Schur\'s theorem, which chapter 9.3 states']
	]],
	['Complex eigenvalues show motion in the scene, and light reads less', 'Complex eigenvalues; light cannot do this', '"Light cannot do this."', [], 'speedometer', '6.6, 9.3', [
		['Kerr\'s eigenvalues beyond first order', 'Kerr\'s eigenvalues beyond first order', 'is Kerr\'s result, *stated in the paper*']
	]],
	['One pixel reads the position, velocity and mass of a moving body', 'The state of a moving body', '[*The state of a moving body*]', ['star-velocity', 'moving-state', 'contact'], null, '6.1, 6.3, 9.4', []]
];
const LEDGER = 'The ledger: the first half\'s twelve equations are derived';
const STUB = '\\text{Part 9: one point of the field}';
const R9B = '\\text{R9b, after 9.5–9.7}';
const FIRST_LATER = 'Separating waves at one point', LAST_LATER = 'Precision of depth';
const LATER_COUNT = 16;           // the section's other paragraphs, read in R9b

// ---- the drawing (figure points, y down); everything as R8's map but the width of the boxes and the dashed strip --
const SIZE = 8.5;                 // every label
const BW = 55;                    // a box's width: room for "entanglement" in its dotted box; five to a row
const HALF = 33;                  // half a box's height, as R3's to R8's
const GAP_X = 10.5;               // between the boxes of a row: the least that gives an arrow a whole head
const PER_ROW = 5;
const STROKE = 0.55;              // a box's outline
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const PITCH = 10;                 // baseline to baseline, within a name, a list of chapters or a stated result
const NUM_PITCH = 11;             // baseline to baseline between a box's lines of numbers (parentheses descend)
const UNDER = 9.4;                // from a box's bottom edge to the first baseline of its chapters
const ROW_GAP = 21;               // from the lowest ink under a row to the next row's boxes: room for the return arrow
const STUB_PAD = [5, 3.6];        // the greyed box: air beside and above/below its text
const DROP = 11;                  // the arrow from the greyed box into the first box
const HEAD = 3.6;                 // the arrows' heads (two fifths of the arrow at most)
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const OUT = 5.5;                  // the return arrow: from the fifth box's right edge out to its turn
const INSIDE = 2.6;               // the least air between a label and the edges of its box (or the half line)
const LIST_AIR = 1;               // a list of chapters (or a stated result) stays this far inside its box's width
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes
const LATER_DROP = 4.2;           // from the last list baseline's descender to the top of the first dotted box
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma), as R3's
const NAME_EQ = 5.5;              // in a box whose name fills it, from the name's last baseline to the numbers' top
const STRIP_GAP = 16;             // from the lowest ink under the second row to the dashed strip's label
const STRIP_LABEL = 5;            // from the strip's label to its small boxes
const CELL_GAP = 3;               // between the strip's small boxes
const CELL_H = 11;                // a small box's height
const CELL_DASH = [1.8, 1.2];     // its dashes
const END_DROP = 10.5;            // from a small box's bottom to the baseline of the paragraph named under it

const OUTLINE = INK;              // a box's outline
const FILL = '#eeebe5';           // the fill: the neutral tint of the page (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked: its headings in order, the phrases that name each stretch, the chapters each section
	// cites (all of them, and no others), the equations and figures it shows, the results stated
	const md = await (await fetch('/tutorial/one-point/reading-section-viii.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 11 && heads[10] === LEDGER, `the chapter's headings ${heads}`);
	check(STRETCHES.every((s, i) => heads[i] === s[0]), 'the stretches are not the chapter\'s first ten sections, in order');
	const section = (i) => text.split(/^## .*$/m)[i + 1].replace(/\s+/g, ' ');
	const ledger = section(10).split('[^')[0];
	const C = '(R\\d+b?|\\d+\\.\\d+b?)';
	const citesOf = (sec) => {
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `\\[${C}'s [^\\]]*\\]\\(/tutorial/`, `[Cc]hapters? ${C}(?![\\d.]\\d)`, `\\(${C}\\)`, `(?<![\\d.])${C}'s\\b`])
			for (const m of sec.matchAll(new RegExp(re, 'g'))) out.add(m[1]);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c.replace('b', '')));
	for (const [i, s] of STRETCHES.entries()) {
		const sec = section(i);
		const cites = citesOf(sec).sort((a, b) => order(a) - order(b)).join(', ');
		check(cites === s[5], `the section "${s[0]}" cites ${cites}, the box lists ${s[5]}`);
		check(sec.includes(s[2]), `the section "${s[0]}" does not name ${s[2]}`);
		const eqs = [...sec.matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1]);
		check(eqs.join() === s[3].join(), `the section "${s[0]}" shows the equations ${eqs}`);
		const figs = [...sec.matchAll(/\{\{paper fig:([\w-]+)\}\}/g)].map((m) => m[1]);
		check(figs.join() === (s[4] ? s[4] : ''), `the section "${s[0]}" shows the figures ${figs}`);
		for (const [, inLedger, inSection] of s[6]) {
			check(ledger.includes(inLedger), `the ledger does not state "${inLedger}"`);
			if (inSection) check(sec.includes(inSection), `the section "${s[0]}" does not state "${inSection}"`);
		}
		if (sec.includes('*stated in the paper*')) check(s[6].length > 0, `the section "${s[0]}" states a result its box does not show`);
	}
	check(section(8).includes('"If the eigenvalues are complex'), 'the ninth stretch does not read the complex eigenvalues');
	// the results stated: the ledger's nine, each in one box
	check(ledger.includes('Nine results are stated, not derived.'), 'the ledger does not count nine results stated');
	check(STRETCHES.reduce((n, s) => n + s[6].length, 0) === 9, 'the boxes do not hold nine results stated');
	// the one chapter cited from after this one: 9.7, for the opening's claim with noise and over time
	const flat = text.replace(/\s+/g, ' ');
	const later = (c) => !c.startsWith('R') && order(c) > 9.4;
	for (const [i, s] of STRETCHES.entries()) for (const c of s[5].split(', ').filter(later)) check(i === 1 && c === '9.7', `the box ${i + 1} lists the later chapter ${c}`);
	check(section(1).includes('with noise and over time, *read now, derived in chapter 9.7*'), 'the opening does not read 9.7\'s claim');
	// the paper's numbers
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:one-pixel') === 'VIII', 'sec:one-pixel is not Section VIII');
	const nums = STRETCHES.map((s) => {
		const out = [];
		if (s[3].length) out.push(s[3].map((e) => `(${auxNumber(`eq:${e}`)})`).join(', '));
		if (s[4]) out.push(`Fig. ${auxNumber(`fig:${s[4]}`)}`);
		return out;
	});
	for (const s of STRETCHES) for (const e of s[3]) check(/^\d+$/.test(auxNumber(`eq:${e}`) ?? ''), `eq:${e} has no number`);
	check(STRETCHES.flatMap((s) => s[3]).map((e) => auxNumber(`eq:${e}`)).join() === '46,47,48,49,50,51,52,53,54,55,56,57', 'the twelve equations are not (46) to (57), in order');
	check(STRETCHES.flatMap((s) => s[3]).length === 12 && LEDGER.includes('twelve equations'), 'the boxes do not hold the twelve equations');
	// the paper's Section VIII: the stretches end at The state of a moving body, and sixteen paragraphs follow
	const tex8 = await (await fetch('/paper/sections/08-one-pixel.tex')).text();
	const paras = [...tex8.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	const k = paras.indexOf('The state of a moving body');
	const rest = paras.slice(k + 1);
	check(k === 5 && rest.length === LATER_COUNT && rest[0] === FIRST_LATER && rest[rest.length - 1] === LAST_LATER, `the paragraphs after the moving body: ${rest}`);
	check(section(0).includes('The rest, from *Separating waves* on, is read in R9b.') && ledger.includes('belong to chapters 9.5 to 9.7 and to R9b'), 'the chapter does not leave the rest to 9.5–9.7 and R9b');
	// Part 9's title
	const parts = await (await fetch('/tutorial/parts.yaml')).text();
	check(/id: '9'\n(?:.*\n)?\s+title: One point of the field/.test(parts), 'Part 9 is not "One point of the field"');
	check(flat.includes('With chapters 9.1 to 9.4 behind us'), 'the chapter does not start from 9.1 to 9.4');

	// ---- wrapping: greedily, at spaces, to a width
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
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
		for (const l of lines) { const w = await width(l); check(w <= room, `the line "${l}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); }
		return lines;
	};
	const names = [], lists = [], numLines = [], stated = [];
	for (const [i, s] of STRETCHES.entries()) {
		const n = await wrap(s[1], BW - 2 * INSIDE, ' ');
		check(n.join(' ') === s[1], `the name "${s[1]}" is not wrapped whole`);
		names.push(n);
		const l = await wrap(s[5], BW - 2 * LIST_AIR, ', ');
		check(l.join(' ') === s[5], `the list of "${s[1]}" is not wrapped whole`);
		lists.push(l);
		const e = [];
		for (const line of nums[i]) e.push(...(await wrap(line, BW - 2 * INSIDE, ', ')));
		numLines.push(e);
		const st = [];
		for (const [words] of s[6]) st.push(await wrap(words, BW - 2 * LATER_PAD[0], ' '));
		stated.push(st);
	}

	// ---- the rows
	const W = PER_ROW * BW + (PER_ROW - 1) * GAP_X;
	const x0 = ORIGIN - W / 2;

	// the greyed box above the first box
	const stub = await placedBase(STUB, 0, 0, FAINT);
	const stubW = stub.box.r - stub.box.l, stubH = stub.box.b - stub.box.t;
	const R = { l: x0, t: ORIGIN - 260 };
	R.r = R.l + stubW + 2 * STUB_PAD[0];
	R.b = R.t + stubH + 2 * STUB_PAD[1];
	check(R.r > x0 + BW / 2 + HEAD, 'the greyed box does not reach over the first box\'s middle');
	const stubText = await placed(STUB, (R.l + R.r) / 2, (R.t + R.b) / 2, 0.5, 0.5, FAINT, SIZE);
	S.path([[R.l, R.t], [R.r, R.t], [R.r, R.b], [R.l, R.b]], { color: FAINT, width: HAIR, closed: true, cap: 'butt', what: 'the greyed box' });
	stubText.inside = { ...R, what: 'the greyed box' };
	L.push(stubText);

	const boxes = [];
	const under = [];                                   // the bottom of the ink under each box
	let top = R.b + DROP;
	for (let i = 0; i < STRETCHES.length; i++) {
		const row = Math.floor(i / PER_ROW), col = i % PER_ROW;
		if (i > 0 && col === 0) top = Math.max(...under.slice(i - PER_ROW, i)) + ROW_GAP;
		const l = x0 + col * (BW + GAP_X), t = top, r = l + BW, b = t + 2 * HALF, m = t + HALF;
		const what = `box ${i + 1}`;
		boxes.push({ l, t, r, b, m, row });
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 1, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });

		// the name centred in the upper half on its caps and baselines and the numbers centred in the lower half on
		// their ink, as R8's; a name too long for the upper half and the numbers under it centred together in the
		// whole box, as R8's; a name with no numbers centred in the whole box on its ink
		const lines = names[i], e = numLines[i];
		const blockH = CAP * SIZE + (lines.length - 1) * PITCH;
		const setLines = async (ls, dy, pitch) => {
			const out = [];
			for (const [k, s] of ls.entries()) out.push(await placedBase(textOf(s), (l + r) / 2, dy + k * pitch, INK));
			return out;
		};
		const inkOf = (gs) => [Math.min(...gs.map((g) => g.box.t)), Math.max(...gs.map((g) => g.box.b))];
		let nameLabels, numLabels = [];
		if (!e.length) {
			const [a, z] = inkOf(await setLines(lines, 0, PITCH));
			nameLabels = await setLines(lines, (t + b) / 2 - (a + z) / 2, PITCH);
			for (const g of nameLabels) g.inside = { l, r, t, b, what };
		} else if (lines.length <= 2) {
			nameLabels = await setLines(lines, t + (HALF - blockH) / 2 + CAP * SIZE, PITCH);
			const [a, z] = inkOf(await setLines(e, 0, NUM_PITCH));
			numLabels = await setLines(e, m + HALF / 2 - (a + z) / 2, NUM_PITCH);
			for (const g of nameLabels) g.inside = { l, r, t, b: m, what };
			for (const g of numLabels) g.inside = { l, r, t: m, b, what };
		} else {
			const [a, z] = inkOf(await setLines(e, 0, NUM_PITCH));
			const numH = NAME_EQ + z - a;
			const base0 = t + (2 * HALF - (blockH + numH)) / 2 + CAP * SIZE;
			nameLabels = await setLines(lines, base0, PITCH);
			numLabels = await setLines(e, base0 + (lines.length - 1) * PITCH + NAME_EQ - a, NUM_PITCH);
			for (const g of [...nameLabels, ...numLabels]) g.inside = { l, r, t, b, what };
			check(inkOf(numLabels)[0] - inkOf(nameLabels)[1] >= LABEL_GAP, `the numbers of ${what} touch its name`);
		}
		// the lines of one name, and of one box's numbers, are one label
		for (const [group, ls] of [['name', nameLabels], ['numbers', numLabels]]) {
			for (let k = 1; k < ls.length; k++) check(ls[k].box.t - ls[k - 1].box.b >= 0.5, `the lines of the ${group} of ${what} touch`);
			for (const g of ls) g.group = `the ${group} of ${what}`;
		}
		L.push(...nameLabels, ...numLabels);

		// the chapters its section cites, under the box; under them the results stated, each in a small dotted box
		const u = [];
		for (const [k, s] of lists[i].entries()) u.push(await placedBase(`\\text{${s}}`, (l + r) / 2, b + UNDER + k * PITCH, DIM));
		let foot = Math.max(...u.map((g) => g.box.b));
		let y = b + UNDER + (lists[i].length - 1) * PITCH + DESC + LATER_DROP;
		for (const [k, ls] of stated[i].entries()) {
			const whatBox = `the dotted box of "${STRETCHES[i][6][k][0]}" under ${what}`;
			const probe = await setDim(ls, 0, (l + r) / 2);
			const [a, z] = inkOf(probe);
			const inkW = Math.max(...probe.map((g) => g.box.r - g.box.l));
			const box = { l: (l + r) / 2 - inkW / 2 - LATER_PAD[0], r: (l + r) / 2 + inkW / 2 + LATER_PAD[0], t: y, b: y + (z - a) + 2 * LATER_PAD[1] };
			check(box.l >= l - 0.01 && box.r <= r + 0.01, `${whatBox} is wider than its box`);
			dotted(S, box, whatBox);
			const gs = await setDim(ls, (box.t + box.b) / 2 - (a + z) / 2, (l + r) / 2);
			for (const g of gs) { g.inside = { ...box, what: whatBox }; g.group = whatBox; }
			for (let q = 1; q < gs.length; q++) check(gs[q].box.t - gs[q - 1].box.b >= 0.5, `the lines of ${whatBox} touch`);
			u.push(...gs);
			foot = box.b;
			y = box.b + LATER_GAP;
		}
		for (const g of u) check(g.box.l >= l - 0.01 && g.box.r <= r + 0.01, `the label ${g.src} is wider than ${what}`);
		under.push(foot);
		L.push(...u);
	}

	// ---- the arrows: from the greyed box into the first box, and through the boxes in reading order
	const b1 = boxes[0];
	S.arrow([(b1.l + b1.r) / 2, R.b + HAIR / 2], [(b1.l + b1.r) / 2, b1.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the arrow from the greyed box' });
	for (let i = 0; i + 1 < boxes.length; i++) {
		const a = boxes[i], c = boxes[i + 1];
		if (a.row === c.row) {
			const ar = S.arrow([a.r + STROKE / 2, a.m], [c.l - END_AIR, c.m], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from box ${i + 1}` });
			check(ar.head === HEAD, `the arrow from box ${i + 1} is too short for a whole head`);
			continue;
		}
		// from the end of the first row: out to the right, down below the row's chapters and results stated, back to
		// the left over the second row, and down into its first box
		const xOut = a.r + OUT;
		const yRun = (Math.max(...under.slice(0, PER_ROW)) + c.t) / 2;
		const xIn = (c.l + c.r) / 2;
		S.path([[a.r + STROKE / 2, a.m], [xOut, a.m], [xOut, yRun], [xIn, yRun]], { color: DIM, width: HAIR, cap: 'square', what: 'the return arrow' });
		const last = S.arrow([xIn, yRun], [xIn, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the return arrow\'s last leg' });
		check(last.head === HEAD, 'the return arrow\'s last leg is too short for a whole head');
		check(yRun - Math.max(...under.slice(0, PER_ROW)) >= LABEL_GAP + 2, 'the return arrow runs too near the first row\'s labels');
	}

	// ---- the dashed strip: its label, sixteen small boxes across the rows' width, and the first and last
	// paragraphs named under its ends
	const sTop = Math.max(...under.slice(PER_ROW)) + STRIP_GAP;
	const lab = await placed(R9B, (x0 + x0 + W) / 2, sTop, 0.5, 0, DIM, SIZE);
	L.push(lab);
	const cy = lab.box.b + STRIP_LABEL;
	const cw = (W - (LATER_COUNT - 1) * CELL_GAP) / LATER_COUNT;
	check(cw >= 12, `the strip's small boxes are ${cw.toFixed(2)} pt wide`);
	for (let k = 0; k < LATER_COUNT; k++) {
		const cl = x0 + k * (cw + CELL_GAP);
		dashedBox(S, { l: cl, r: cl + cw, t: cy, b: cy + CELL_H }, `the small box ${k + 1} of the strip`);
	}
	const ends = [];
	ends.push(await placedLeft(`\\text{${FIRST_LATER}}`, x0, cy + CELL_H + END_DROP, FAINT, 'l'));
	ends.push(await placedLeft(`\\text{${LAST_LATER}}`, x0 + W, cy + CELL_H + END_DROP, FAINT, 'r'));
	check(ends[0].box.r + 12 <= ends[1].box.l, 'the names at the strip\'s ends run together');
	L.push(...ends);

	// ---- checks: every label inside its box clears the box's edges by INSIDE (a result stated by its padding),
	// centred left and right
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what] : [];
	const merged = [];
	for (const g of L) {
		const m = g.group && merged.find((h) => h.group === g.group);
		if (!m) { merged.push({ ...g, box: { ...g.box } }); continue; }
		m.src += ` / ${g.src}`;
		m.box = { l: Math.min(m.box.l, g.box.l), r: Math.max(m.box.r, g.box.r), t: Math.min(m.box.t, g.box.t), b: Math.max(m.box.b, g.box.b) };
	}
	S.checkAll(merged, LABEL_GAP - 0.05);
	window.tutReadViiiMap = { W, names, lists, numLines, stated, stub: R, boxes };
	return finish(S, L, [240, 330]);

	/** The lines of a result stated, in grey, centred on x, the first baseline at y. */
	async function setDim(ls, y, x) {
		const out = [];
		for (const [k, s] of ls.entries()) out.push(await placedBase(textOf(s), x, y + k * PITCH, DIM));
		return out;
	}
}

/** A label's TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
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

/** A faint dashed outline, each side dashed on its own so that every corner falls on a dash. */
function dashedBox(S, { l, r, t, b }, what) {
	for (const [A, B] of [[[l, t], [r, t]], [[r, t], [r, b]], [[r, b], [l, b]], [[l, b], [l, t]]]) {
		const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
		const n = Math.max(1, Math.round((len - CELL_DASH[0]) / (CELL_DASH[0] + CELL_DASH[1])));
		const gap = (len - (n + 1) * CELL_DASH[0]) / n;
		S.raw(`<path d="M${n2(A[0])},${n2(A[1])}L${n2(B[0])},${n2(B[1])}" fill="none" stroke="${FAINT}" stroke-width="${HAIR}" stroke-linecap="butt" stroke-dasharray="${CELL_DASH[0]} ${n2(gap)}"/>`, 1);
	}
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], HAIR / 2, what);
}

/** A TeX label with its baseline at y and its ink centred on x. */
async function placedBase(src, x, y, color) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (probe.l + probe.r) / 2, y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}

/** A TeX label with its baseline at y and its ink's left (or right) edge at x. */
async function placedLeft(src, x, y, color, side) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (side === 'l' ? probe.l : probe.r), y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
