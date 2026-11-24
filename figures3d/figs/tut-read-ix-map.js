// The tutorial, reading chapter R10b (tutorial/glow/reading-section-ix.md), its first diagram: Section IX as a map of
// what Part 10 and the parts before it have derived. The sibling of R9's, R9b's and R10's maps
// (figs/tut-read-viii-map.js, figs/tut-read-viii-2-map.js, figs/tut-read-vi-map.js): the same box, type, fill, outline,
// dotted box and grey arrows, in ink and the page's greys only (the outline in ink, the fill the neutral tint of the
// page, the dotted boxes in grey), since orange and blue mean a stretch and a squeeze. Twelve boxes, one for each
// section of the chapter before the capstone, in its order, in two columns of six read down (one drawing serves the
// desktop and the phone, laid out to be read at 390 px, as R9b's and R10's), joined in reading order by thin grey
// arrows, with a return arrow up the gutter from the sixth to the seventh. Each box carries a short name for its
// section (the paper's paragraph where the section reads one: The graviton budget, Recovering the layers, What the
// Earth's materials allow, Arrival and absorption, Counting or recording), under it the paper's equations, figures and
// table that the section shows or links, as the site numbers them, under those, in grey, the chapters the section
// cites, and under those, each in a small dotted box, the results the section marks as stated in the paper. Every box
// is filled and outlined solid: the chapter derives nothing itself and rests on no sketch. Below both columns, set
// apart by a gap, the last box, the capstone, outlined a little heavier, with grey arrows into it from the eight boxes
// whose results its steps use: along a bus outside the left column from Line of sight (the paper's (72)), The Sun's
// core (its 0.73 a second), The kinks (the line to the Sun passes between them), Stiffnesses and the Moon (each
// shell's bound) and The graviton budget (the 35,800), and along a bus outside the right column from Recovering the
// layers (the paper's (75)), The fit (the 29 km) and Arrival and absorption (a metre of 30 GPa).
// Departures from the diagram's comment, where the chapter's text decides: the box of the Sun's core lists no chapter,
// since its section cites none (its numbers are checked from the paper's own); each box lists every chapter its
// section cites for what it uses (Line of sight also 8.3; the table R10, 5.2, 5.4, 5.5 and 7.7; the fit R3, 3.3 and
// 5.6; the materials also 10.1 and 10.3; Counting or recording 8.5, 8.6 and 10.2; the counting pixel R8, 8.4, 8.6 and
// 9.6), but not the chapters it names only as having used or anticipated its result (R2's radius of the core; 3.8's,
// R3's and R5's 450 a year; 0.3's margin note and its live figure; R8's reading ahead); the dotted insets are the
// results the text marks as stated, so the Sun's box also has the inner fifth, the fit's has the sample's fitted radii,
// and neither PREM's shear moduli nor the core's resistivity has one (the text does not mark them stated); the capstone
// has an eighth arrow, from Recovering the layers, since its step (a) uses the paper's (75); the caption says "eight of
// them", not "all of them".
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated, the ledger's four equations, the capstone's uses) and against the paper (main.aux, Section IX's
// paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-ix-map';
const check = checker(name);

// ---- the twelve sections, in order (tutorial/glow/reading-section-ix.md) ------------------------------------------
// [the section's heading, the box's name, a phrase of the section that names what the box is called, the chapters
// it cites, the results stated (the inset's words, the section's words that name the result)]
export const SECTIONS = [
	['A pixel counts the glow along its line of sight', 'Line of sight', 'pixel that looks along the unit vector',
		'5.5, 8.3, 10.1', []],
	['At midnight the Sun\'s core outshines the ground ten billion times', 'The Sun\'s core', 'The scene\'s core is at',
		'', [
			['the Sun\'s $10^8$ W', 'The Sun\'s "$10^8$ W" in gravitational waves is *stated in the paper*'],
			['the inner fifth', 'The scene spreads the Sun\'s glow over its inner fifth (*stated in the paper*)']
		]],
	['The kinks fall where a line of sight grazes a boundary', 'The kinks', 'the caption\'s 63°, 33° and 11°',
		'5.6', []],
	['The Moon is faint, and every brightness of the Earth is an upper bound', 'Stiffnesses and the Moon', 'PREM\'s shear moduli',
		'10.3', [
			['PREM\'s radii', 'The radii from the Preliminary Reference Earth Model, PREM [@DziewonskiAnderson1981], are *stated in the paper*']
		]],
	['The Earth below sends a square metre one graviton every twenty hours', 'The graviton budget', '[*The graviton budget*](/paper/#par:the-graviton-budget)',
		'3.1, 8.5, 10.1', [
			['the primordial glow\'s 0.905 K', 'Section XI\'s primordial glow, at 0.905 K (*stated in the paper*)']
		]],
	['The budget runs from a second to ninety million years', 'The table', 'The paper\'s Table [](/paper/#tab:budget)',
		'R10, 5.2, 5.4, 5.5, 7.7', []],
	['One camera peels the layers, and the heights measure friction times temperature cubed', 'Recovering the layers',
		'[*Recovering the layers*](/paper/#par:recovering-the-layers)', '5.5, 5.6, 10.1', []],
	['A lifetime places the edge of the core to 29 km', 'The fit', 'This is the fit that 5.6\'s gap box left here',
		'R3, 3.3, 5.6', [
			['the sample\'s fitted radii', 'The sample\'s fitted radii, $1281 \\pm 41$ km for the inner core against the forecast\'s 39 km, are *stated in the paper*']
		]],
	['Real materials may hide the core in counts, but not in colour', 'What the Earth\'s materials allow',
		'[*What the Earth\'s materials allow*](/paper/#par:what-the-earths-materials-allow)', 'R10, 10.1, 10.3', []],
	['No detector made of matter could catch these gravitons', 'Arrival and absorption',
		'[*Arrival and absorption*](/paper/#par:arrival-and-absorption)', '10.3', [
			['the verdicts', 'The verdicts of Dyson and of Rothman and Boughn are *stated in the paper*']
		]],
	['Recording adds half a quantum, so a thermal camera must count', 'Counting or recording',
		'[*Counting or recording*](/paper/#par:counting-or-recording)', '8.5, 8.6, 10.2', [
			['Tsang\'s scaling', 'Tsang\'s scaling with the occupation against its square'],
			['the repeaters', 'the repeaters [@Gottesman2012]'],
			['the converter', 'and the converter [@Dyson2013] are *stated in the paper*']
		]],
	['A counting pixel finds the Sun\'s core to a degree in half an hour', 'A counting pixel', 'a coherent state of spin two',
		'R8, 8.4, 8.6, 9.6', []]
];
const CAPSTONE = 'The capstone: the Sun at midnight, from stiffness to the edge of the core';
const CAPSTONE_NAME = 'The capstone: the Sun at midnight';
const CAPSTONE_CITES = '10.3';
const LEDGER = 'The ledger: Section IX\'s four equations are derived';
// the chapters a section names only as having used or anticipated its result, or as the source of a live figure:
// pointers, not marks (the section's words, as regular expressions over its flattened text); and two numbers that the
// chapters' pattern would read as chapters
const NOT_CITED = [
	/So \[R2\]\([^)]*\)'s "radius of the core/,
	/The 447 is the "about 450" that chapters .*? "almost no gravitons arrive"\./,
	/Chapter 0\.3's count/,
	/which chapter 0\.3's margin note sent here/,
	/and that \[R8\]\([^)]*\) read ahead/,
	/from 28\.86/,
	/from 15\.8%/
];
// the boxes the capstone uses: [the box, the capstone's words, the box's words]
const USES = [
	['Line of sight', 'By the paper\'s [](/paper/#eq:column), with $\\ell_k$ the chord', '{{paper eq:column}}'],
	['The Sun\'s core', 'cubic metre crossed by the Sun\'s 0.73 a second', 'so 0.73 gravitons cross each square metre a second'],
	['The kinks', 'The line to the Sun leaves at 40°, between the kinks at 63° and 33°', 'leave $\\arcsin(r/R)$ from straight down'],
	['Stiffnesses and the Moon', 'A shell\'s share is the first over the second', 'in the capstone\'s step (a)'],
	['The graviton budget', 'shares out the 35,800 gravitons of eighty years', '35,800 in eighty years'],
	['Recovering the layers', 'by the paper\'s [](/paper/#eq:jN-friction)', '{{paper eq:jN-friction}}'],
	['The fit', 'places the core\'s edge to 29 km', 'the core\'s boundary to 28.9 km'],
	['Arrival and absorption', 'a metre of 30 GPa stops at most $5.87\\times10^{-24}', '$5.87\\times10^{-24}\\unit{s^{-1}}$ for a metre of 30 GPa']
];
const CAPTION = 'Look first at the solid boxes: every paragraph of Section IX is derived in Part 10 or earlier, with its stated results in dotted insets. The last box follows the paper\'s first image through eight of them.';

// ---- the drawing (figure points, y down); the type, strokes and kit of R10's map ----------------------------------
const SIZE = 8.5;                 // every label
const CW = 152;                   // a box's width: two columns and the gutter make R10's width
const GUT = 13;                   // the gutter between the columns: the return arrow runs up its middle
const PER_COL = 6;                // the first column's boxes; the second holds the other six
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const PAD_Y = 5.2;                // the least air above and below a box's words
const INSIDE = 2.6;               // the least air between a label and its box's sides
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes, side by side or one above the other
const LATER_DROP = 3.2;           // from the last line's descender to the top of the dotted boxes
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma)
const ROW_GAP = 11;               // between the rows of a column: room for an arrow with a whole head
const HEAD = 3.6;                 // the arrows' heads
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const TURN = 11;                  // the return arrow turns this far above the seventh box; the buses this far above the last
const OUT = 6;                    // the buses run this far outside the columns
const IN = 22;                    // a bus enters the last box this far in from its side
const LAST_GAP = 16;              // from the last row to the last box

const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/glow/reading-section-ix.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 14 && heads[12] === CAPSTONE && heads[13] === LEDGER, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first twelve sections, in order');
	const sectionText = (i) => text.split(/^## .*$/m)[i + 1].replace(/\s+/g, ' ');
	const ledger = sectionText(13).split('[^')[0];
	const capstone = sectionText(12);
	// the chapters a section cites: every way the chapter names one, less the pointers that are not marks
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d)';
	const citesOf = (sec) => {
		let s = sec;
		for (const n of NOT_CITED) s = s.replace(n, ' ');
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with) \\[?${C}`])
			for (const m of s.matchAll(new RegExp(re, 'g'))) out.add(m[1]);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c));
	const listOf = (sec) => citesOf(sec).sort((a, b) => order(a) - order(b)).join(', ');
	// every pointer left out is in the section it belongs to, once
	for (const n of NOT_CITED) check(SECTIONS.filter((_, k) => n.test(sectionText(k))).length === 1, `the pointer ${n} is not in exactly one section`);
	// the ledger's four equations, in order, and the boxes that hold them: the first that shows or links each
	const ledgerEqs = [...ledger.matchAll(/\| \[\]\(\/paper\/#eq:([\w-]+)\) \|/g)].map((m) => m[1]);
	check(ledgerEqs.join() === 'column,abel,abel-inverse,jN-friction' && LEDGER.includes('four'), `the ledger's equations ${ledgerEqs}`);
	const shows = (sec, kind, l) => sec.includes(`{{paper ${kind}:${l}}}`) || sec.includes(`[](/paper/#${kind}:${l})`);
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	for (const e of ledgerEqs) check(SECTIONS.some((_, j) => shows(sectionText(j), 'eq', e)), `no section shows eq:${e}`);
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const tabsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'tab'));
	check(eqsOf.flat().join() === 'kirchhoff,column,glow-bound,kirchhoff,dumbbell,column,abel,abel-inverse,jN-friction,beam', `the equations the boxes hold ${eqsOf.flat()}`);
	check(figsOf.flat().join() === 'earth-glow,budget,earth-inverted' && tabsOf.flat().join() === 'budget', `the figures and table shown ${figsOf.flat()} ${tabsOf.flat()}`);
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		check(sec.includes(s[2]), `the section "${s[0]}" does not name ${s[2]}`);
		const list = listOf(sec);
		check(list === s[3], `the section "${s[0]}" cites ${list}, the box lists ${s[3]}`);
		// the results stated: every sentence that marks one is named by an inset, and every inset's words are there
		for (const [, words] of s[4]) check(sec.includes(words), `the section "${s[0]}" does not say ${words}`);
		const marks = [...sec.matchAll(/[^.]*\*stated in the paper\*/g)].map((m) => m[0]);
		for (const m of marks) check(s[4].some(([, words]) => m.includes(words.split('*stated')[0].slice(0, 30)) || words.includes(m.slice(-60))), `the section "${s[0]}" states a result no inset shows: ${m}`);
		check(marks.length <= s[4].length && (marks.length > 0) === (s[4].length > 0), `the section "${s[0]}" marks ${marks.length} results stated, the box shows ${s[4].length}`);
		// nothing is derived here, and nothing rests on a sketch: every box is solid
		check(!sec.includes('*derived here*') && !/depth B|a sketch|an estimate\)/.test(sec), `the section "${s[0]}" derives a step or rests on a sketch`);
	}
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 9, 'the insets are not nine');
	check((flat.match(/\*stated in the paper\*/g) ?? []).length === 8, 'the chapter marks other results stated');
	check(flat.includes('Nothing is derived here: the one step from outside Part 10, a collision time read from a resistivity, is derived in R10.'), 'the chapter derives something itself');
	// the capstone: its chapters, its equations and the boxes it uses
	check(listOf(capstone) === CAPSTONE_CITES, `the capstone cites ${listOf(capstone)}`);
	const capEqs = refsOf(capstone, 'eq');
	check(capEqs.join() === 'jN-friction,column' && refsOf(capstone, 'fig').length === 0 && refsOf(capstone, 'tab').length === 0, `the capstone links ${capEqs}`);
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(k >= 0, `no box is named ${box}`);
		check(capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 8 && CAPTION.includes('eight of them'), 'the capstone does not use eight boxes');
	// the opening: the chapter reads the section in order, with the three marks
	check(flat.includes('This chapter reads the section in order'), 'the chapter does not read the section in order');
	check(/requires: \['R10', '3\.1', '3\.3', '5\.5', '5\.6', '7\.7', '8\.4', '8\.5', '8\.6', '10\.1', '10\.2', '10\.3'\]/.test(md), 'the chapter\'s requirements');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-ix-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-ix-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes('This chapter reads the section in order (Figure [](#fig:read-ix-map))'), 'the chapter does not point to its map');
	// the paper's Section IX: its paragraphs and numbers
	const tex9 = await (await fetch('/paper/sections/09-first-image.tex')).text();
	const paras = [...tex9.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.join() === 'The graviton budget,Recovering the layers,What the Earth\'s materials allow,Arrival and absorption,Counting or recording', `Section IX's paragraphs ${paras}`);
	for (const p of paras) check(SECTIONS.some((s) => s[1] === p), `no box is named for the paragraph ${p}`);
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:first-image') === 'IX', 'sec:first-image is not Section IX');
	check(ledgerEqs.map((e) => auxNumber(`eq:${e}`)).join() === '72,73,74,75', 'the four equations are not (72) to (75), in order');
	const numsOf = (eqs, figs, tabs) => [...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...tabs.map((t) => `Table ${auxNumber(`tab:${t}`)}`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k], tabsOf[k]));
	const capNums = numsOf(capEqs, [], []);
	check(nums.join('|') === '(35), (72)||Fig. 32|(38)||(28), (35), Table V, Fig. 33|(72), (73), (74), (75)|Fig. 34|||(44)|' && capNums === '(72), (75)', `the numbers ${nums.join('|')} ${capNums}`);

	// ---- measuring and wrapping -------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const room = CW - 2 * INSIDE;

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels, dotted boxes], measured -------------
	const content = async (nm, numbers, list, stated, what) => {
		const out = [], dots = [];
		let y = 0;
		out.push({ ...(await placedBase(textOf(await fits(nm, room)), 0, y, INK)), role: 'name' });
		if (numbers) {
			y += NUM_PITCH;
			out.push({ ...(await placedBase(textOf(await fits(numbers, room)), 0, y, INK)), role: 'numbers' });
		}
		if (list) {
			y += LIST_PITCH;
			out.push({ ...(await placedBase(`\\text{${await fits(list, room)}}`, 0, y, DIM)), role: 'chapters' });
		}
		if (stated.length) {
			// the dotted boxes in rows, in the section's order, as many to a row as fit, each row centred
			const probes = [];
			for (const words of stated) probes.push(await placedBase(textOf(words), 0, 0, DIM));
			const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
			const inkT = Math.min(...probes.map((g) => g.box.t)), inkB = Math.max(...probes.map((g) => g.box.b));
			const h = inkB - inkT + 2 * LATER_PAD[1];
			const rowRoom = CW - 2;
			const rows = [[]];
			let used = 0;
			for (const [j, w] of ws.entries()) {
				check(w <= rowRoom, `the stated result "${stated[j]}" of ${what} (${w.toFixed(1)} pt) is wider than its room`);
				if (rows.at(-1).length && used + LATER_GAP + w > rowRoom) { rows.push([]); used = 0; }
				used += (rows.at(-1).length ? LATER_GAP : 0) + w;
				rows.at(-1).push(j);
			}
			let top = y + DESC + LATER_DROP;
			for (const row of rows) {
				const total = row.reduce((a, j) => a + ws[j], 0) + (row.length - 1) * LATER_GAP;
				let x = -total / 2;
				for (const j of row) {
					const box = { l: x, r: x + ws[j], t: top, b: top + h };
					const g = await placedBase(textOf(stated[j]), (box.l + box.r) / 2, (box.t + box.b) / 2 - (inkT + inkB) / 2, DIM);
					out.push({ ...g, role: `stated ${j}`, dotted: box, words: stated[j] });
					dots.push({ box, what: `the dotted box of "${stated[j]}" in ${what}` });
					x += ws[j] + LATER_GAP;
				}
				top += h + LATER_GAP;
			}
		}
		const b = Math.max(...out.map((g) => (g.dotted ? g.dotted.b : g.box.b)));
		return { out, dots, t: Math.min(...out.map((g) => g.box.t)), b };
	};
	const sets = [];
	for (const [k, s] of SECTIONS.entries()) sets.push(await content(s[1], nums[k], s[3], s[4].map((x) => x[0]), `box ${k + 1}`));

	// ---- the rows: each as tall as the taller of its boxes -----------------------------------------------------------
	const W = 2 * CW + GUT;
	const x0 = ORIGIN - W / 2;
	const col = (c) => x0 + c * (CW + GUT);
	const colOf = (k) => (k < PER_COL ? 0 : 1), rowOf = (k) => (k < PER_COL ? k : k - PER_COL);
	const rowTops = [];
	let top = ORIGIN - 250;
	for (let r = 0; r < PER_COL; r++) {
		const inRow = SECTIONS.map((_, k) => k).filter((k) => rowOf(k) === r);
		const h = Math.max(...inRow.map((k) => sets[k].b - sets[k].t)) + 2 * PAD_Y;
		rowTops.push([top, top + h]);
		top += h + ROW_GAP;
	}
	const boxes = [];
	for (const [k, s] of SECTIONS.entries()) {
		const c = colOf(k), r = rowOf(k);
		const l = col(c), rr = l + CW, [t, b] = rowTops[r];
		const what = `box ${k + 1}`;
		const set = sets[k];
		const dx = (l + rr) / 2, dy = (t + b) / 2 - (set.t + set.b) / 2;
		boxes.push({ l, r: rr, t, b, m: (t + b) / 2, c, row: r, name: s[1] });
		S.fill(`M${n2(l)},${n2(t)}H${n2(rr)}V${n2(b)}H${n2(l)}Z`, { l, r: rr, t, b }, { color: FILL, layer: 0, what, solid: false });
		S.path([[l, t], [rr, t], [rr, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
		for (const d of set.dots) dotted(S, shift(d.box, dx, dy), d.what);
		for (const g of set.out) {
			const moved = { src: g.src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, dx, dy) };
			moved.inside = g.dotted ? { ...shift(g.dotted, dx, dy), what: `the dotted box of "${g.words}" in ${what}` } : { l, r: rr, t, b, what };
			moved.within = what;
			L.push(moved);
		}
		const ink = { t: dy + set.t, b: dy + set.b };
		check(near2(ink.t - t, b - ink.b), `the words of ${what} are not centred in it`);
		check(ink.t - t >= PAD_Y - 0.01, `the words of ${what} are ${(ink.t - t).toFixed(2)} pt from its top`);
	}

	// ---- the arrows of the reading order: down each column, and up the gutter from the sixth box to the seventh -------
	for (let k = 0; k + 1 < SECTIONS.length; k++) {
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
	}

	// ---- the last box, the capstone, and the arrows into it ----------------------------------------------------------
	const fset = await content(CAPSTONE_NAME, capNums, CAPSTONE_CITES, [], 'the last box');
	const K = { l: x0, r: x0 + W, t: rowTops[PER_COL - 1][1] + LAST_GAP };
	K.b = K.t + (fset.b - fset.t) + 2 * PAD_Y;
	S.fill(`M${n2(K.l)},${n2(K.t)}H${n2(K.r)}V${n2(K.b)}H${n2(K.l)}Z`, K, { color: FILL, layer: 0, what: 'the last box', solid: false });
	S.path([[K.l, K.t], [K.r, K.t], [K.r, K.b], [K.l, K.b]], { color: OUTLINE, width: LAST_STROKE, closed: true, cap: 'butt', layer: 1, what: 'the last box' });
	{
		const dx = x0 + W / 2, dy = (K.t + K.b) / 2 - (fset.t + fset.b) / 2;
		for (const g of fset.out) L.push({ src: g.src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, dx, dy), inside: { ...K, what: 'the last box' }, within: 'the last box' });
		check(near2(dy + fset.t - K.t, K.b - dy - fset.b), 'the words of the last box are not centred in it');
	}
	const feeders = feederNames.map((n) => boxes.find((b) => b.name === n));
	check(feeders.every(Boolean), 'a box the capstone uses is missing');
	const left = feeders.filter((b) => b.c === 0), right = feeders.filter((b) => b.c === 1);
	check(left.length === 5 && right.length === 3 && feeders.every((b) => b.row < PER_COL - 1), 'the capstone\'s feeders are not five beside the first column and three beside the second, above the last row');
	// the buses: out of the outer sides of the boxes used, down outside the columns, and into the last box's top
	const yb = K.t - TURN;
	check(yb - rowTops[PER_COL - 1][1] >= 3.5, 'the buses run too near the last row');
	for (const [side, bs] of [[-1, left], [1, right]]) {
		const edge = side < 0 ? x0 : x0 + W;
		const xb = edge + side * OUT, xin = edge - side * IN;
		for (const b of bs) S.path([[side < 0 ? b.l - STROKE / 2 : b.r + STROKE / 2, b.m], [xb, b.m]], { color: DIM, width: HAIR, cap: 'butt', what: `the line from "${b.name}"` });
		const yTop = Math.min(...bs.map((b) => b.m));
		S.path([[xb, yTop], [xb, yb], [xin, yb]], { color: DIM, width: HAIR, cap: 'square', what: `the ${side < 0 ? 'left' : 'right'} bus` });
		const ar = S.arrow([xin, yb], [xin, K.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the ${side < 0 ? 'left' : 'right'} bus's last leg` });
		check(ar.head === HEAD, 'a bus\'s last leg is too short for a whole head');
	}

	// ---- checks: every label inside its box clears the box's edges, centred left and right --------------------------
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within] : [])] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadIxMap = { W, nums, capNums, boxes, rows: rowTops, last: K, drawn };
	return finish(S, L, [300, 345]);
}

const near2 = (a, b) => Math.abs(a - b) < 0.02;
const shift = (b, dx, dy) => ({ l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy });

/** A label's TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
}

/** A dotted outline: round dots along each side, one at every corner, evenly spaced (as R10's), in grey. */
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
