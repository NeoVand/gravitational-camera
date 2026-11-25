// The tutorial, reading chapter R9b (tutorial/one-point/reading-section-viii-2.md), its first diagram: the second half
// of Section VIII as a map of what Part 9 and the parts before it have derived. The sibling of R9's map
// (figs/tut-read-viii-map.js): the same box, type, fill, outline, dotted box, dashed strip and grey arrows, in ink and
// the page's greys (the outline in ink, the fill the neutral tint of the page, the dotted boxes in grey), with the
// capstone, its outline and the arrows into it in the curvature's colour; no orange or blue, which mean a stretch and
// a squeeze. Sixteen boxes, one for each of the paper's paragraphs the chapter reads, in its order, in two columns of
// eight read down (one drawing serves the desktop and the phone, laid out to be read at 390 px, as R3's to R9's),
// joined in reading order by thin grey arrows, with a return arrow up the gutter from the eighth to the ninth. Each
// box carries the paragraph's name (the paper's, wrapped to the box), under it its equations' numbers as the site
// prints them (and the paper's figure or table its section shows), under those, in grey, the chapters its section
// cites, with "derived here" where the chapter derives it, and under those, each in a small dotted box, the results
// its section marks as stated. A box is filled when its section rests on derivations, and hatched, its words on a
// clearing of the page, when its main result rests on an estimate (Lensed images) or on stated coefficients
// (Ranging). Below both columns the capstone, outlined in the curvature's colour, with arrows in that colour into it
// from What no reading can tell, Depth, Separation with noise and Precision of depth. Above the columns, faint and
// dashed, a strip of six small boxes, the first half's six paragraphs, labelled "R9, after 9.1–9.4", with the first
// and the last named at its ends.
// Departures from the diagram's comment, where the chapter's text decides: each box lists every chapter its section
// cites (Separating waves also 9.1; Lensed images also 9.7; Ranging also 9.1; Matter at the pixel also 6.5; What no
// reading can tell also R9, 0.4 and 9.2; One pixel and many also R5; Variation across the array also 1.5; Depth also
// R9; Precision also R1, 1.5, 6.6, 9.3, 9.5 and 9.6, its table's column; Separation with noise 9.7; Precision of depth
// also R9 and 1.3); the dotted insets are the results the text marks as stated, so the sky and the tests of general
// relativity have none (the text marks no convex cone and no Carlip), Precision has "sound's column", and Precision
// of depth also has the direction's part in its bounds; the paper's figures and table stand under the equations, as in
// R9's map; "Front and back" and "Three dimensions", one section of the chapter, are two boxes, split where the
// section turns to the second paragraph. The drawing is R9's width; it is taller, since it holds sixteen boxes and
// the capstone.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated, derived here or estimated, the ledger's fourteen equations) and against the paper (main.aux, Section
// VIII's paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM, FAINT, RULE, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, placed, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';
import { CURV, palette } from './tut-metric-lib.js';

const name = 'tut-read-viii-2-map';
const check = checker(name);

// ---- the sixteen paragraphs, in order (tutorial/one-point/reading-section-viii-2.md) --------------------------------
// [the paper's paragraph, the box's name, the chapters its section cites, the results stated (the inset's words, the
// section's words that mark it stated), the box's fill ('solid' or 'hatched', with the section's words), derived here]
export const PARAGRAPHS = [
	['Separating waves at one point', 'Separating waves at one point', '9.1, 9.5', [
		['Sylvester\'s converse', 'Sylvester\'s converse *stated*'],
		['Bézout\'s count', 'Bézout\'s count *stated*']
	], ['solid'], false],
	['Lensed images at one point', 'Lensed images at one point', '9.5, 9.7', [], ['hatched', '*, an estimate)'], false],
	['What one pixel sees of the sky', 'What one pixel sees of the sky', '9.6', [], ['solid'], false],
	['Ranging a wave source', 'Ranging a wave source', '9.1, 9.7', [
		['Sachs\'s peeling', '**peels** into parts falling as $1/r$, $1/r^2$, $1/r^3$ and beyond (Sachs, *stated*']
	], ['hatched', 'from the pair\'s stated coefficients'], false],
	['The absence of gravitational aberration', 'The absence of gravitational aberration', '6.3, 7.7, 9.3', [], ['solid'], false],
	['Tests of general relativity from one reading', 'Tests of general relativity from one reading', '9.7', [], ['solid'], false],
	['Matter at the pixel', 'Matter at the pixel', '1.4, 6.5, 7.3, 7.5', [], ['solid'], false],
	['What no reading can tell', 'What no reading can tell', 'R9, 0.4, 1.4, 2.3, 9.2, 9.4', [], ['solid'], false],
	['One pixel and many', 'One pixel and many', 'R5, 9.1, 9.7', [
		['the subspace bound', 'a subspace method separates up to $5N - 1$ uncorrelated sources, against $N - 1$ for scalar sensors and $3N - 1$ for sensors of light (*stated*, as in 9.7)'],
		['Capon\'s factor', 'the fringe spacing $\\vartheta_1 = c/(fD)$ at broadside for the frequency $f$ (*stated*)']
	], ['solid'], false],
	['Variation across the array', 'Variation across the array', '1.5, 8.6', [], ['solid'], false],
	['Depth', 'Depth', 'R9, 1.4, 7.5', [], ['solid'], true],
	['Front and back', 'Front and back', '1.4', [], ['solid'], false],
	['Three dimensions', 'Three dimensions', '2.5, 5.6', [], ['solid'], false],
	['Precision', 'Precision', 'R1, 1.5, 6.6, 9.3, 9.5, 9.6, 9.7', [
		['sound\'s column', 'Sound\'s column is *stated in the paper*']
	], ['solid'], false],
	['Separation with noise', 'Separation with noise', '9.7', [
		['the 2.2 and 1.26', 'The array\'s factors on the wave\'s error, 2.2 and 1.26 (Figure [](/paper/#fig:separation-noise)(a)), are *stated*']
	], ['solid'], false],
	['Precision of depth', 'Precision of depth', 'R9, 1.3, 3.3', [
		['direction adds nothing', 'that the direction does not enlarge them is *stated*'],
		['the 0.7 fit', 'is the fit of Figure [](/paper/#fig:separation-noise)(c), *stated*']
	], ['solid'], true]
];
// the chapter's sections: the paragraph boxes each heading holds (the twelfth holds two paragraphs)
const SECTION_OF = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14];
const SPLIT = 'In [*Three dimensions*]';      // where the twelfth section turns to its second paragraph
const NOT_CITED = ['(not 9.3\'s $P$)'];       // a chapter named to tell two letters apart, not cited
const INTO_CAPSTONE = ['What no reading can tell', 'Depth', 'Separation with noise', 'Precision of depth'];
const CAPSTONE = 'The capstone: one pixel on a desk';
const STEPS = 'a person, a rotor and a passing wave, in steps (a) to (h)';
const LEDGER = 'The ledger: all fourteen equations are derived';
const R9 = '\\text{R9, after 9.1–9.4}';
const CAPTION = 'Look first at the solid boxes: every paragraph of the second half of Section VIII is derived in Part 9 or earlier, or derived here, with its stated results in dotted insets. The two hatched boxes rest on an estimate or on stated coefficients. Four boxes meet in the capstone.';

// ---- the drawing (figure points, y down); the type, strokes and kit of R9's map ----------------------------------
const SIZE = 8.5;                 // every label
const CW = 152;                   // a box's width: two columns and the gutter make R9's width
const GUT = 13;                   // the gutter between the columns: the return arrow runs up its middle
const STROKE = 0.55;              // a box's outline
const CAP_STROKE = 0.75;          // the capstone's outline, in the curvature's colour
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const PITCH = 10;                 // baseline to baseline within a name
const NUM_PITCH = 11;             // from a name's last baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const PAD_Y = 5.2;                // the least air above and below a box's words
const INSIDE = 2.6;               // the least air between a label and its box's sides
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes, side by side
const LATER_DROP = 3.2;           // from the chapters' descender to the top of the dotted boxes
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma)
const ROW_GAP = 11;               // between the rows of a column: room for an arrow with a whole head
const HEAD = 3.6;                 // the arrows' heads
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const TURN = 11;                  // the return arrow turns this far above the ninth box
const OUT = 6;                    // the capstone's bus runs this far right of the second column
const CAP_GAP = 16;               // from the last row to the capstone
const CAP_PAD = 5.2;              // the capstone's words: air above and below
const CAP_PITCH = 10.6;           // between the capstone's two baselines
const HATCH = 0.4, HATCH_STEP = 2.4;      // the hatching: its lines and their spacing, measured across them
const CLEAR = [3, 2.4];           // a hatched box's clearing: air beside and above/below its words
const STRIP_LABEL = 5;            // from the strip's label to its small boxes
const CELL_GAP = 3;               // between the strip's small boxes
const CELL_H = 11;                // a small box's height
const CELL_DASH = [1.8, 1.2];     // its dashes
const END_DROP = 10.5;            // from a small box's bottom to the baseline of the paragraph named under it
const STRIP_AIR = 6;              // from the names under the strip to the return arrow's turn
const FIRST_HALF = 6;             // the first half's paragraphs, read in R9

const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)
const CAP = 0.683;                // the cap height of Computer Modern, in ems

export default async function () {
	await palette(check);
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/one-point/reading-section-viii-2.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 17 && heads[16] === LEDGER && heads[15] === 'The capstone: one pixel on a desk', `the chapter's headings ${heads}`);
	const sectionText = (i) => text.split(/^## .*$/m)[i + 1].replace(/\s+/g, ' ');
	const ledger = sectionText(16).split('[^')[0];
	// the paragraphs' text: a section, or the half of the twelfth on either side of SPLIT
	const para = (k) => {
		const s = sectionText(SECTION_OF[k]);
		if (SECTION_OF[k] !== 11) return s;
		check(s.split(SPLIT).length === 2, 'the twelfth section does not turn once to Three dimensions');
		return k === 11 ? s.split(SPLIT)[0] : SPLIT + s.split(SPLIT)[1];
	};
	// the paper's Section VIII: the first half's six paragraphs and these sixteen
	const tex8 = await (await fetch('/paper/sections/08-one-pixel.tex')).text();
	const paras = [...tex8.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.length === FIRST_HALF + 16 && paras[FIRST_HALF - 1] === 'The state of a moving body', `Section VIII's paragraphs ${paras}`);
	check(PARAGRAPHS.every((p, k) => paras[FIRST_HALF + k] === p[0]), 'the boxes are not the paper\'s last sixteen paragraphs, in order');
	const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	// a number followed by a unit, or set in math, is a quantity, not a chapter ("from 26.3 km")
	const C = '(R\\d+b?|\\d\\.\\d)(?!\\d|\\s*(?:%|°|×|\'\'|\\\\|(?:km|kg|cm|mm|nm|m|s|K|per|GHz|MHz|kHz|Hz|eV|keV|MeV|GeV|pc|kpc|Mpc|ly|au|AU|J|W|yr|years?|days?|times|bits?)(?![A-Za-z])))';
	const citesOf = (sec) => {
		let s = sec;
		for (const n of NOT_CITED) s = s.split(n).join(' ');
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}(?![\\d.]\\d)`, `\\(${C}\\)`, `(?<![\\d.\\w])${C}'s\\b`, `as in ${C}`, `\\| ${C}(?:, ${C})? \\|$`])
			for (const m of s.matchAll(new RegExp(re, 'gm'))) for (const c of m.slice(1)) if (c) out.add(c);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c));
	// the table's column "Derived in", read from its rows (they stand on lines of their own)
	const tableCites = [...sectionText(12).matchAll(/\| ((?:R\d+|\d+\.\d+)(?:, (?:R\d+|\d+\.\d+))*) \|/g)].flatMap((m) => m[1].split(', '));
	check(tableCites.join() === 'R1,6.6,6.6,9.3,9.3,9.5,9.6,9.7', `the table's column cites ${tableCites}`);
	for (const n of NOT_CITED) check(flat.includes(n), `the chapter does not say ${n}`);
	// the ledger's fourteen equations, in order, and the boxes that hold them: the first that shows or links each
	const ledgerEqs = [...new Set([...ledger.matchAll(/\| \[\]\(\/paper\/#eq:([\w-]+)\)(?:, \[\]\(\/paper\/#eq:([\w-]+)\))? \|/g)].flatMap((m) => m.slice(1).filter(Boolean)))];
	check(ledgerEqs.length === 14 && LEDGER.includes('fourteen'), `the ledger's equations ${ledgerEqs}`);
	const eqsOf = PARAGRAPHS.map(() => []);
	for (const e of ledgerEqs) {
		const k = PARAGRAPHS.findIndex((_, j) => para(j).includes(`{{paper eq:${e}}}`) || para(j).includes(`[](/paper/#eq:${e})`));
		check(k >= 0, `no paragraph shows eq:${e}`);
		eqsOf[k].push(e);
	}
	const figsOf = PARAGRAPHS.map((_, k) => [...para(k).matchAll(/\{\{paper fig:([\w-]+)\}\}/g)].map((m) => m[1]));
	for (const [k, p] of PARAGRAPHS.entries()) {
		const sec = para(k);
		check(sec.includes(`[*${p[0]}*](/paper/#par:${slug(p[0])})`), `the section of "${p[1]}" does not link its paragraph`);
		const words = p[1].toLowerCase().split(' ');
		check(words.join(' ') === p[0].toLowerCase(), `the box's name "${p[1]}" is not the paragraph's`);
		const cites = (SECTION_OF[k] === 12 ? [...citesOf(sec), ...tableCites] : citesOf(sec));
		const list = [...new Set(cites)].sort((a, b) => order(a) - order(b)).join(', ');
		check(list === p[2], `the section of "${p[1]}" cites ${list}, the box lists ${p[2]}`);
		// the results stated: one inset for each, and no more
		const stated = (sec.match(/\*stated/g) ?? []).length;
		check(stated === p[3].length, `the section of "${p[1]}" marks ${stated} results stated, the box shows ${p[3].length}`);
		for (const [, words2] of p[3]) check(sec.includes(words2), `the section of "${p[1]}" does not say ${words2}`);
		// hatched: an estimate or stated coefficients; derived here
		if (p[4][0] === 'hatched') check(sec.includes(p[4][1]), `the section of "${p[1]}" does not say ${p[4][1]}`);
		else check(!sec.includes('an estimate') && !sec.includes('stated coefficients'), `the section of "${p[1]}" rests on an estimate`);
		check(sec.includes('*derived here*') === p[5], `the section of "${p[1]}" is ${p[5] ? 'not ' : ''}derived here`);
	}
	check(eqsOf.flat().join() === ledgerEqs.join(), 'the boxes do not hold the ledger\'s equations in order');
	check(figsOf.flat().join() === 'present,separation-noise', `the figures shown ${figsOf.flat()}`);
	check(sectionText(12).includes('The table:') && /^paper: \[.*tab:one-pixel/m.test(md), 'Precision does not show the paper\'s table');
	// the capstone, and the paragraphs it uses
	const cap = sectionText(15);
	for (const [words, k] of [['(c) How far and how heavy.**', 15], ['the paper\'s [](/paper/#eq:magnetic-range) gives', 15], ['(f) The wave under the rotor.**', 14], ['(h) What one reading cannot tell.**', 7], ['from the twist of the person walking past', 10]])
		check(cap.includes(words) && PARAGRAPHS[k], `the capstone does not say ${words}`);
	for (const l of 'abcdefgh') check(cap.includes(`**(${l}) `), `the capstone has no step (${l})`);
	check(cap.includes('**(h) What one reading cannot tell.**') && !cap.includes('**(i) '), 'the capstone\'s steps are not (a) to (h)');
	check(flat.includes('what does one pixel on a desk learn about a person, a rotor and a passing wave?'), 'the chapter\'s question');
	check(flat.includes('So the desk has learned that one pixel with six neighbours weighs the person'), 'the capstone\'s summary');
	// the opening: sixteen paragraphs read in order, and R9 the first half
	check(flat.includes('This chapter reads the sixteen paragraphs from [*Separating waves at one point*](/paper/#par:separating-waves-at-one-point) to [*Precision of depth*](/paper/#par:precision-of-depth) in order'), 'the chapter does not read the sixteen paragraphs');
	check(flat.includes('read the first half of [Section VIII]') && flat.includes('With chapters [9.5]'), 'the chapter does not leave the first half to R9');
	check(/requires: \[.*'R9'/.test(md), 'R9b does not require R9');
	const r9 = await (await fetch('/tutorial/one-point/reading-section-viii.md')).text();
	check(r9.replace(/\s+/g, ' ').includes('With chapters 9.1 to 9.4 behind us'), 'R9 does not start from 9.1 to 9.4');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-viii-2-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-viii-2-map}`), 'the caption is not the figure\'s');
	// the paper's numbers
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:one-pixel') === 'VIII', 'sec:one-pixel is not Section VIII');
	check(ledgerEqs.map((e) => auxNumber(`eq:${e}`)).join() === '58,59,60,61,62,63,64,65,66,67,68,69,70,71', 'the fourteen equations are not (58) to (71), in order');
	const nums = PARAGRAPHS.map((_, k) => {
		const out = eqsOf[k].map((e) => `(${auxNumber(`eq:${e}`)})`);
		for (const f of figsOf[k]) out.push(`Fig. ${auxNumber(`fig:${f}`)}`);
		if (k === 13) out.push(`Table ${auxNumber('tab:one-pixel')}`);
		return out.join(', ');
	});
	check(nums[4] === 'Fig. 28' && nums[13] === 'Table IV' && nums[15] === '(70), (71), Fig. 31', `the figures' and table's numbers ${nums}`);

	// ---- measuring and wrapping -------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const wrap = async (txt, room) => {
		const words = txt.split(' ');
		const lines = [];
		let line = '';
		for (const w of words) {
			const next = line ? `${line} ${w}` : w;
			if (line && (await width(next)) > room) { lines.push(line); line = w; } else line = next;
		}
		lines.push(line);
		if (lines.length === 2) {
			// two lines: the break that makes the longer one shortest, so that no word stands alone
			let best = null;
			for (let j = 1; j < words.length; j++) {
				const a = words.slice(0, j).join(' '), b = words.slice(j).join(' ');
				const w = Math.max(await width(a), await width(b));
				if (w <= room && (!best || w < best.w)) best = { w, ls: [a, b] };
			}
			lines.splice(0, 2, ...best.ls);
		}
		for (const l of lines) { const w = await width(l); check(w <= room, `the line "${l}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); }
		return lines;
	};
	const room = CW - 2 * INSIDE;

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels, dotted boxes], measured -------------
	const content = async (k) => {
		const p = PARAGRAPHS[k];
		const out = [], dots = [];
		let y = 0;
		const lines = await wrap(p[1], room);
		for (const [j, s] of lines.entries()) out.push({ ...(await placedBase(textOf(s), 0, y + j * PITCH, INK)), role: 'name' });
		y += (lines.length - 1) * PITCH;
		if (nums[k]) {
			y += NUM_PITCH;
			for (const s of await wrap(nums[k], room)) out.push({ ...(await placedBase(textOf(s), 0, y, INK)), role: 'numbers' });
		}
		y += LIST_PITCH;
		const list = p[5] ? `${p[2]}; derived here` : p[2];
		for (const s of await wrap(list, room)) out.push({ ...(await placedBase(`\\text{${s}}`, 0, y, DIM)), role: 'chapters' });
		if (p[3].length) {
			// the dotted boxes side by side if they fit, centred; each one line
			const probes = [];
			for (const [words] of p[3]) probes.push(await placedBase(textOf(words), 0, 0, DIM));
			const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
			const total = ws.reduce((a, b) => a + b, 0) + (ws.length - 1) * LATER_GAP;
			check(total <= room + 2 * INSIDE - 2, `the stated results of "${p[1]}" (${total.toFixed(1)} pt) do not fit side by side`);
			const inkT = Math.min(...probes.map((g) => g.box.t)), inkB = Math.max(...probes.map((g) => g.box.b));
			const top = y + DESC + LATER_DROP, bottom = top + (inkB - inkT) + 2 * LATER_PAD[1];
			let x = -total / 2;
			for (const [j, [words]] of p[3].entries()) {
				const box = { l: x, r: x + ws[j], t: top, b: bottom };
				const g = await placedBase(textOf(words), (box.l + box.r) / 2, (top + bottom) / 2 - (inkT + inkB) / 2, DIM);
				out.push({ ...g, role: `stated ${j}`, dotted: box });
				dots.push({ box, what: `the dotted box of "${words}" in box ${k + 1}` });
				x += ws[j] + LATER_GAP;
			}
		}
		const b = Math.max(...out.map((g) => (g.dotted ? g.dotted.b : g.box.b)));
		return { out, dots, t: Math.min(...out.map((g) => g.box.t)), b, lines };
	};
	const sets = [];
	for (let k = 0; k < 16; k++) sets.push(await content(k));

	// ---- the strip above the columns: the first half -----------------------------------------------------------------
	const W = 2 * CW + GUT;
	const x0 = ORIGIN - W / 2;
	const col = (c) => x0 + c * (CW + GUT);
	const lab = await placed(R9, x0 + W / 2, ORIGIN - 300, 0.5, 0, DIM, SIZE);
	L.push(lab);
	const cy = lab.box.b + STRIP_LABEL;
	const cw = (W - (FIRST_HALF - 1) * CELL_GAP) / FIRST_HALF;
	for (let k = 0; k < FIRST_HALF; k++) {
		const cl = x0 + k * (cw + CELL_GAP);
		dashedBox(S, { l: cl, r: cl + cw, t: cy, b: cy + CELL_H }, `the small box ${k + 1} of the strip`);
	}
	const ends = [];
	ends.push(await placedSide(`\\text{${paras[0]}}`, x0, cy + CELL_H + END_DROP, FAINT, 'l'));
	ends.push(await placedSide(`\\text{${paras[FIRST_HALF - 1]}}`, x0 + W, cy + CELL_H + END_DROP, FAINT, 'r'));
	check(ends[0].box.r + 12 <= ends[1].box.l, 'the names at the strip\'s ends run together');
	L.push(...ends);

	// ---- the rows: each as tall as the taller of its two boxes -------------------------------------------------------
	const boxes = [];
	let top = Math.max(...ends.map((g) => g.box.b)) + STRIP_AIR + TURN;
	const rowTops = [];
	for (let r = 0; r < 8; r++) {
		const h = Math.max(sets[r].b - sets[r].t, sets[r + 8].b - sets[r + 8].t) + 2 * PAD_Y;
		rowTops.push([top, top + h]);
		top += h + ROW_GAP;
	}
	for (let k = 0; k < 16; k++) {
		const c = Math.floor(k / 8), r = k % 8;
		const l = col(c), rr = l + CW, [t, b] = rowTops[r];
		const what = `box ${k + 1}`;
		const set = sets[k];
		const dx = (l + rr) / 2, dy = (t + b) / 2 - (set.t + set.b) / 2;
		const hatched = PARAGRAPHS[k][4][0] === 'hatched';
		boxes.push({ l, r: rr, t, b, m: (t + b) / 2, c, row: r, name: PARAGRAPHS[k][0] });
		if (hatched) {
			hatch(S, { l, r: rr, t, b }, what);
			// the clearing under the words: the page itself
			const cl = { l: dx + Math.min(...set.out.map((g) => g.dotted ? g.dotted.l : g.box.l)) - CLEAR[0], r: dx + Math.max(...set.out.map((g) => g.dotted ? g.dotted.r : g.box.r)) + CLEAR[0], t: dy + set.t - CLEAR[1], b: dy + set.b + CLEAR[1] };
			check(cl.t - t >= 1.5 && b - cl.b >= 1.5 && cl.l - l >= 3, `the clearing of ${what} reaches its edge`);
			S.raw(`<path d="M${n2(cl.l)},${n2(cl.t)}H${n2(cl.r)}V${n2(cl.b)}H${n2(cl.l)}Z" fill="${PAGE}"/>`, 1);
		} else S.fill(`M${n2(l)},${n2(t)}H${n2(rr)}V${n2(b)}H${n2(l)}Z`, { l, r: rr, t, b }, { color: FILL, layer: 0, what, solid: false });
		S.path([[l, t], [rr, t], [rr, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
		for (const d of set.dots) dotted(S, shift(d.box, dx, dy), d.what);
		const groups = {};
		for (const g of set.out) {
			const moved = { src: g.src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, dx, dy) };
			moved.inside = g.dotted ? { ...shift(g.dotted, dx, dy), what: `the dotted box of "${PARAGRAPHS[k][3][Number(g.role.split(' ')[1])][0]}" in ${what}` } : { l, r: rr, t, b, what };
			moved.within = what;
			moved.group = `the ${g.role} of ${what}`;
			(groups[g.role] ??= []).push(moved);
			L.push(moved);
		}
		for (const [role, gs] of Object.entries(groups))
			for (let j = 1; j < gs.length; j++) check(gs[j].box.t - gs[j - 1].box.b >= 0.5, `the lines of the ${role} of ${what} touch`);
		const ink = { t: dy + set.t, b: dy + set.b };
		check(near2(ink.t - t, b - ink.b), `the words of ${what} are not centred in it`);
		check(ink.t - t >= PAD_Y - 0.01, `the words of ${what} are ${(ink.t - t).toFixed(2)} pt from its top`);
	}

	// ---- the arrows of the reading order: down each column, and up the gutter from the eighth box to the ninth -------
	for (let k = 0; k + 1 < 16; k++) {
		const a = boxes[k], c = boxes[k + 1];
		if (a.c === c.c) {
			const x = (a.l + a.r) / 2;
			const ar = S.arrow([x, a.b + STROKE / 2], [x, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from box ${k + 1}` });
			check(ar.head === HEAD, `the arrow from box ${k + 1} is too short for a whole head`);
			continue;
		}
		const xg = a.r + GUT / 2, yt = c.t - TURN, xi = (c.l + c.r) / 2;
		S.path([[a.r + STROKE / 2, a.m], [xg, a.m], [xg, yt], [xi, yt]], { color: DIM, width: HAIR, cap: 'square', what: 'the return arrow' });
		const last = S.arrow([xi, yt], [xi, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the return arrow\'s last leg' });
		check(last.head === HEAD, 'the return arrow\'s last leg is too short for a whole head');
		check(yt - Math.max(...ends.map((g) => g.box.b)) >= STRIP_AIR - 0.01, 'the return arrow runs too near the strip\'s names');
	}

	// ---- the capstone and the arrows into it, in the curvature's colour -----------------------------------------------
	const capName = await placedBase(`\\text{${CAPSTONE}}`, 0, 0, INK);
	const capSteps = await placedBase(`\\text{${STEPS}}`, 0, CAP_PITCH, DIM);
	const capH = capSteps.box.b - capName.box.t + 2 * CAP_PAD;
	const K = { l: x0, r: x0 + W, t: rowTops[7][1] + CAP_GAP };
	K.b = K.t + capH;
	S.fill(`M${n2(K.l)},${n2(K.t)}H${n2(K.r)}V${n2(K.b)}H${n2(K.l)}Z`, K, { color: FILL, layer: 0, what: 'the capstone', solid: false });
	S.path([[K.l, K.t], [K.r, K.t], [K.r, K.b], [K.l, K.b]], { color: CURV, width: CAP_STROKE, closed: true, cap: 'butt', layer: 1, what: 'the capstone' });
	const base = (K.t + K.b) / 2 - (capName.box.t + capSteps.box.b) / 2;
	const cn = await placedBase(`\\text{${CAPSTONE}}`, x0 + W / 2, base, INK);
	const cs = await placedBase(`\\text{${STEPS}}`, x0 + W / 2, base + CAP_PITCH, DIM);
	for (const g of [cn, cs]) { g.inside = { ...K, what: 'the capstone' }; L.push(g); }
	check(cs.box.t - cn.box.b >= 0.5, 'the capstone\'s lines touch');
	const feeders = INTO_CAPSTONE.map((n) => boxes.find((b) => b.name === n));
	check(feeders.every(Boolean), 'a box into the capstone is missing');
	const below = feeders.filter((b) => b.row === 7), beside = feeders.filter((b) => b.row < 7);
	check(below.length === 2 && beside.length === 2 && beside.every((b) => b.c === 1), 'the capstone\'s feeders are not two from the last row and two from the second column');
	for (const b of below) {
		const x = (b.l + b.r) / 2;
		const ar = S.arrow([x, b.b + STROKE / 2], [x, K.t - END_AIR], { color: CURV, width: HAIR, head: HEAD, layer: 2, what: `the arrow from "${b.name}" into the capstone` });
		check(ar.head === HEAD, 'an arrow into the capstone is too short for a whole head');
	}
	// the bus: out of the right sides of Depth and Separation with noise, down the right, and into the capstone's top
	const xb = col(1) + CW + OUT, yb = K.t - TURN, xin = col(1) + CW - 22;
	for (const b of beside) S.path([[b.r + STROKE / 2, b.m], [xb, b.m]], { color: CURV, width: HAIR, cap: 'butt', what: `the line from "${b.name}"` });
	const yTop = Math.min(...beside.map((b) => b.m));
	S.path([[xb, yTop], [xb, yb], [xin, yb]], { color: CURV, width: HAIR, cap: 'square', what: 'the capstone\'s bus' });
	const ar = S.arrow([xin, yb], [xin, K.t - END_AIR], { color: CURV, width: HAIR, head: HEAD, layer: 2, what: 'the bus\'s last leg' });
	check(ar.head === HEAD, 'the bus\'s last leg is too short for a whole head');
	check(yb - rowTops[7][1] >= 3.5, 'the bus runs too near the last row');
	check(xin - ((boxes[15].l + boxes[15].r) / 2) >= 30, 'the bus enters the capstone too near the last box\'s arrow');

	// ---- checks: every label inside its box clears the box's edges, centred left and right --------------------------
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within, `the hatching of ${g.within}`] : [])] : [];
	const merged = [];
	for (const g of L) {
		const m = g.group && merged.find((h) => h.group === g.group);
		if (!m) { merged.push({ ...g, box: { ...g.box } }); continue; }
		m.src += ` / ${g.src}`;
		m.box = { l: Math.min(m.box.l, g.box.l), r: Math.max(m.box.r, g.box.r), t: Math.min(m.box.t, g.box.t), b: Math.max(m.box.b, g.box.b) };
	}
	S.checkAll(merged, LABEL_GAP - 0.05);
	window.tutReadViii2Map = { W, nums, boxes, rows: rowTops, capstone: K, drawn };
	return finish(S, L, [300, 340]);
}

const near2 = (a, b) => Math.abs(a - b) < 0.02;
const shift = (b, dx, dy) => ({ l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy });

/** A label's TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
}

/** Hatching at 45 degrees, rising to the right, inside a box, in the rule's grey (no outline: the box has its own). */
function hatch(S, { l, r, t, b }, what) {
	const step = HATCH_STEP * Math.SQRT2;            // along x, for lines HATCH_STEP apart
	const d = [];
	const h = b - t;
	for (let s = l - h + step / 2; s < r; s += step) {
		// the line x - l' = (b - y): from (s, b) to (s + h, t), clipped to [l, r]
		let xa = s, ya = b, xc = s + h, yc = t;
		if (xa < l) { ya -= l - xa; xa = l; }
		if (xc > r) { yc += xc - r; xc = r; }
		if (xc - xa < 0.3) continue;
		d.push(`M${n2(xa)},${n2(ya)}L${n2(xc)},${n2(yc)}`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${RULE}" stroke-width="${HATCH}" stroke-linecap="butt" fill="none"/>`, 0);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], 0, `the hatching of ${what}`);
}

/** A dotted outline: round dots along each side, one at every corner, evenly spaced (as R9's), in grey. */
function dotted(S, { l, r, t, b }, what) {
	const d = [];
	for (const [A, B] of [[[l, t], [r, t]], [[r, t], [r, b]], [[r, b], [l, b]], [[l, b], [l, t]]]) {
		const len = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(1, Math.round(len / DOT_STEP));
		for (let k = 0; k < n; k++) d.push(`M${n2(A[0] + ((B[0] - A[0]) * k) / n)},${n2(A[1] + ((B[1] - A[1]) * k) / n)}h0`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${DIM}" stroke-width="${DOT}" stroke-linecap="round" fill="none"/>`, 1);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], DOT / 2, what);
}

/** A faint dashed outline, each side dashed on its own so that every corner falls on a dash (as R9's). */
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
async function placedSide(src, x, y, color, side) {
	const probe = boxOf(await tex(src, [0, 0], SIZE, 'lB', color));
	const g = await tex(src, [x - (side === 'l' ? probe.l : probe.r), y], SIZE, 'lB', color);
	return { src, svg: g, box: boxOf(g) };
}
