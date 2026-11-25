// The tutorial, reading chapter R12 (tutorial/sky/reading-sections-x-and-xi.md), its first diagram: Section X and the
// first half of Section XI as a map of what Parts 1 to 12 have derived. The sibling of R11's, R10's and R9's maps
// (figs/tut-read-vii-map.js, figs/tut-read-vi-map.js, figs/tut-read-viii-map.js): the same box, type, fill, outline,
// dotted box, hatching and grey arrows, in ink and the page's greys only (the outline in ink, the fill the neutral
// tint of the page, the chapters and the dotted boxes in grey), since orange and blue mean a stretch and a squeeze.
// Eight boxes, one for each section of the chapter before the capstone, in its order, in one column read down (one
// drawing serves the desktop and the phone, laid out to be read at 390 px, as R11's), joined in reading order by thin
// grey arrows. Each box carries, at its left, a short name for its section (the paper's paragraph where the section
// links one), under it the paper's equations, figures and tables that the section shows or links, as the site numbers
// them, and under those, in grey, the chapters the section cites (on two lines where they need them); at its right,
// each in a small dotted box, the results the section marks as stated in the paper, named by their authors where the
// section cites one. The two results that chapters 13.1 and 13.4 derive, which the chapter reads now (*read now,
// derived in chapter 13.1*, and 13.4, in its third section and its ledger), are dotted boxes filled as the others,
// each named with its chapter. The box of Memory is hatched, its words on clearings of the page, since
// its first equation is stated and only sketched in 7.8 at depth B (R10's rule); every other box is filled. Below the
// column, set apart by a gap, the last box, the capstone, outlined a little heavier, with grey arrows into it along a
// bus outside the column's left side from the three boxes whose results its steps use: Two facts (all energy
// gravitates, the weight of (a)), A beam of light (the person's tide of (b)) and An exploding star (the shell, its
// weight, squeeze and memory).
// Departures from the diagram's comment, where the chapter's text decides: the boxes are the chapter's sections, as in
// every reading map, so Section X's plain words and Table VI share the first box and the pair has two (the near and
// wave zones; the axis), and the column is one column read down, as R11's; each box lists every chapter its section
// cites, and only those (9.4 under the axis, 1.4 and R9 under the beam, 1.6, 2.5, 7.7, 12.2 and others under the blind
// spots, 3.7 and 12.1 under the pair, 5.3, 9.1 and 12.1 under the Milky Way; 7.5 appears only where a section cites
// it); 13.1 and 13.4 stand in their insets, not in the list, since each names one result; Wiseman and Will's shape is
// read now, derived in 7.8, so it has no inset, while the spin memory, Favata's recoil and the count of thousands
// are stated and do; the boxes carry no tick for checked here, since every section checks a number (R11 marks only
// derived here, which this chapter does not use); the capstone's arrows come from the three boxes its table and its
// notes use, so the caption says three, not four.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations, figures and tables it shows or links, the results it
// marks as stated, the ledger's two tables and four equations, the capstone's table) and against the paper (main.aux,
// Section XI's paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM, RULE, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-x-xi-map';
const check = checker(name);

// ---- the eight sections, in order (tutorial/sky/reading-sections-x-and-xi.md) ---------------------------------------
// [the section's heading, the box's name, a phrase of the section that names what the box is called, the chapters it
// cites, the results stated (the inset's words, the section's words that name the result, the chapter that
// derives it or null), hatched (with the section's words)]
export const SECTIONS = [
	['Most of Section X\'s list rests on two facts that earlier chapters derived', 'Two facts and the affordances',
		'Section X\'s plain words name two facts', '4.6, 5.4, 6.4, 7.8', [], null],
	['A beam of light pulls with twice its energy, far too faintly to show beside a person', 'A beam of light',
		'A beam of power $P$ carries energy', 'R9, 1.4, 6.5, 7.5', [], null],
	['Each channel has blind spots, and another channel covers them', 'The blind spots',
		'collects the **blind spots**', '1.3, 1.6, 2.5, 2.8, 4.6, 5.5, 5.6, 7.3, 7.5, 7.6, 7.7, 9.6, 11.1, 12.2', [
			['the passing mass, 13.1', 'The passing mass is *read now, derived in chapter [13.1](/tutorial/', '13.1'],
			['the two tides, 13.4', 'the two tides are *read now, derived in chapter [13.4](/tutorial/', '13.4']
		], null],
	['Near the pair the tide turns with it, and beyond three-tenths of a wavelength it is a wave', 'A pair of black holes',
		'[*A pair of black holes, from the near zone to the wave zone*](/paper/#par:a-pair-of-black-holes-from-the-near-zone-to-the-wave-zone)',
		'3.7, 7.6, 7.7, 12.1', [
			['Thorne\'s field', 'gives Thorne\'s field of a source in every zone', null]
		], null],
	['On the orbit\'s axis one pixel sees the type pass from D through II toward N', 'One pixel on the axis',
		'One pixel on the axis of the orbit', '7.5, 7.6, 7.7, 9.4', [], null],
	['A burst leaves a memory, largest where the oscillating wave is weakest', 'Memory',
		'[*Memory*](/paper/#par:memory)', '5.4, 7.8', [
			['Christodoulou and Thorne\'s memory', '[@Christodoulou1991; @Thorne1992]', null],
			['the spin memory', 'The **spin memory**', null]
		], 'sketches at depth B (*stated in the paper*'],
	['A round collapse sends no waves, but the camera weighs its neutrinos as they pass', 'An exploding star',
		'[*An exploding star*](/paper/#par:an-exploding-star)', 'R9b, 6.4, 7.3, 7.8, 11.1, 12.1', [
			['Vaidya\'s field', '[@Vaidya1951]', null],
			['Favata\'s recoil', 'the recoil of the remnant leaves a memory of second order', null]
		], null],
	['In waves the Galaxy\'s centre is a hundred times brighter than the opposite sky', 'The Milky Way',
		'[*The Milky Way*](/paper/#par:the-milky-way)', '5.3, 9.1, 12.1', [
			['Nelemans\'s foreground', '[@Nelemans2001]', null],
			['Bland-Hawthorn and Gerhard\'s model', '[@BlandHawthornGerhard2016]', null],
			['Fritz\'s thirty to fifty', '[@Fritz2011]', null],
			['the count of thousands', 'the count *stated in the paper*', null]
		], null]
];
const NOT_CITED = ['31.4'];                 // "by 31.4 magnitudes": a number, not a chapter
const CAPSTONE = 'The capstone: a star collapses ten kiloparsecs away';
const CAPSTONE_NAME = 'The capstone: a star collapses ten kiloparsecs away';
const CAPSTONE_CITES = 'R9b, 6.4, 6.5, 7.3, 7.8, 11.1, 12.1';
const LEDGER = 'The ledger: Section X has two tables and no equations, and four of Section XI\'s are read here';
// the boxes the capstone uses: [the box, the capstone's words, the box's words]
const USES = [
	['Two facts and the affordances', '(a) The paper\'s energy weighs a sixth of the Sun', '**All energy gravitates**, because a body\'s mass is its energy over $c^2$'],
	['A beam of light', 'the person\'s tide a metre away', 'A person of 70 kg a metre away makes $9.3\\times10^{-9}\\unit{s^{-2}}$'],
	['An exploding star', '$0.168\\,M_\\odot$', 'is $0.168\\,M_\\odot c^2$'],
	['An exploding star', '$1.0\\times10^{11}$', '$1.0\\times10^{11}$ for 10 s at 10 kpc'],
	['An exploding star', '$4.0\\times10^{-21}$', 'it is $4.0\\times10^{-21}$'],
	['An exploding star', '| (f) waves | a round collapse | none | 11.1 |', 'so a round collapse radiates nothing']
];
const CAPTION = 'Look first at the solid boxes: Section X and every paragraph of Section XI read here rest on chapters of Parts 1 to 12, with their stated results in dotted insets, and the two that chapters [13.1](/tutorial/what-a-field-keeps/push-and-pass/) and [13.4](/tutorial/what-a-field-keeps/flows-inside/) derive named with their chapters. The hatched box rests on a sketch at depth B. The last box follows one collapsing star through three of them.';
const POINTER = 'We read Section X, and Section XI as far as *The Milky Way* (Figure [](#fig:read-x-xi-map)).';

// ---- the drawing (figure points, y down); the type, strokes and kit of R11's map -----------------------------------
const SIZE = 8.5;                 // every label
const W = 335;                    // the column's width: R11's
const LZ = 142;                   // the left part of a box, where its name, numbers and chapters stand
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const LIST_LEAD = 10.2;           // between the two lines of a long list of chapters
const PAD_Y = 5.2;                // the least air above and below a box's words
const INSIDE = 2.6;               // the least air between a label and its box's sides
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes, side by side or one above the other
const RIGHT_AIR = 6;              // the dotted boxes' rows keep this far inside the box's right part on each side
const ROW_GAP = 11;               // between the boxes: room for an arrow with a whole head
const HEAD = 3.6;                 // the arrows' heads
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const TURN = 11;                  // the bus turns this far above the last box
const OUT = 6;                    // the bus runs this far outside the column
const IN = 22;                    // the bus enters the last box this far in from its side
const LAST_GAP = 16;              // from the last row to the last box
const HATCH = 0.4, HATCH_STEP = 2.4;      // R10's hatching: its lines and their spacing, measured across them
const CLEAR = [3, 2.4];           // a hatched box's clearing: air beside and above/below its words

const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/sky/reading-sections-x-and-xi.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 10 && heads[8] === CAPSTONE && heads[9] === LEDGER, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first eight sections, in order');
	// a section's text, with the footnotes' marks taken out (the notes themselves follow the last section)
	const sectionText = (i) => text.split(/^## .*$/m)[i + 1].split(/^\[\^\w+\]:/m)[0].replace(/\[\^\w+\]/g, '').replace(/\s+/g, ' ');
	const ledger = sectionText(9);
	const capstone = sectionText(8);
	// the chapters a section cites: every way the chapter names one
	// a number followed by a unit, or set in math, is a quantity, not a chapter ("from 26.3 km")
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d|\\s*(?:%|°|×|\'\'|\\\\|(?:km|kg|cm|mm|nm|m|s|K|per|GHz|MHz|kHz|Hz|eV|keV|MeV|GeV|pc|kpc|Mpc|ly|au|AU|J|W|yr|years?|days?|times|bits?)(?![A-Za-z])))';
	const citesOf = (sec) => {
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with|and) \\[?${C}`])
			for (const m of sec.matchAll(new RegExp(re, 'g'))) if (!NOT_CITED.includes(m[1])) out.add(m[1]);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c));
	const sorted = (xs) => [...xs].sort((a, b) => order(a) - order(b));
	const sentences = (sec) => sec.split(/(?<=\.)\s+(?=[A-Z"\[*])/);
	// the ledger's two tables and four equations, in order
	const ledgerRefs = [...ledger.matchAll(/\| (?:Table )?\[\]\(\/paper\/#((?:eq|tab):[\w-]+)\),/g)].map((m) => m[1]);
	check(ledgerRefs.join() === 'tab:affordances,tab:null,eq:multipole,eq:memory,eq:merger-memory,eq:burst-memory', `the ledger's rows ${ledgerRefs}`);
	check(/\| \[\]\(\/paper\/#eq:multipole\), the field in every zone \| \*stated in the paper\* \(Thorne's\); checked, and its tide derived, in 7\.7 \|/.test(ledger), 'the ledger does not state Thorne\'s field');
	check(/the row of \[13\.1\]\(\/tutorial\/[^)]*\) \*read now, derived in chapter 13\.1\*; that of \[13\.4\]\(\/tutorial\/[^)]*\) \*read now, derived in chapter 13\.4\*/.test(ledger), 'the ledger does not leave the rows of 13.1 and 13.4 to those chapters');
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const tabsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'tab'));
	const shown = SECTIONS.map((_, k) => [...sectionText(k).matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1])).flat();
	check(shown.join() === 'multipole,memory,merger-memory,burst-memory', `the sections show the equations ${shown}`);
	check(eqsOf.map((e) => e.join('+')).join() === ',,,multipole,stars,memory+merger-memory,burst-memory,column+one-wave', `the equations the boxes hold ${eqsOf.map((e) => e.join('+'))}`);
	check(figsOf.map((f) => f.join('+')).join() === ',,,binary-field,,memory,,milky-way', `the figures ${figsOf.map((f) => f.join('+'))}`);
	check(tabsOf.map((f) => f.join('+')).join() === 'affordances,,null,,,,,', `the tables ${tabsOf.map((f) => f.join('+'))}`);
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		check(sec.includes(s[2]), `the section "${s[0]}" does not name ${s[2]}`);
		// the chapters cited: the box's list, and the chapters of Part 13, which stand in their insets instead
		const later = s[4].filter((x) => x[2]).map((x) => x[2]);
		const cited = citesOf(sec);
		check(sorted(cited.filter((c) => !later.includes(c))).join(', ') === s[3], `the section "${s[0]}" cites ${sorted(cited)}, the box lists ${s[3]}`);
		for (const c of later) check(cited.includes(c) && order(c) >= 13, `the inset's chapter ${c} of "${s[0]}"`);
		// the results stated: every sentence that marks one is named by an inset, and every inset's words are there; a
		// result named with its chapter is read now and derived in that chapter
		const marks = sentences(sec).filter((m) => m.includes('*stated in the paper*'));
		for (const m of marks) check(s[4].some(([, words, c]) => !c && m.includes(words)), `the section "${s[0]}" states a result no inset shows: ${m}`);
		for (const [, words, c] of s[4]) {
			if (c) check(sec.includes(words) && words.includes(`*read now, derived in chapter [${c}]`), `the inset "${words}" of "${s[0]}" is not read now and derived in ${c}`);
			else check(marks.some((m) => m.includes(words)), `the inset "${words}" of "${s[0]}" is not marked stated`);
		}
		check(!sec.includes('*derived here*'), `the section "${s[0]}" derives a step here`);
		// hatched only where the section rests on a sketch at depth B
		check(sec.includes('depth B') === Boolean(s[5]) && (!s[5] || sec.includes(s[5])), `the section "${s[0]}" and depth B`);
	}
	check(/The passing mass is \*read now, derived in chapter \[13\.1\]\(\/tutorial\/what-a-field-keeps\/push-and-pass\/\)\*, and the two tides are \*read now, derived in chapter \[13\.4\]\(\/tutorial\/what-a-field-keeps\/flows-inside\//.test(flat), 'the chapter does not leave the two rows to 13.1 and 13.4');
	check(sectionText(3).includes('(*stated in the paper*). Chapter 7.7 states it from Thorne, checks that it solves'), 'Thorne\'s field is not stated and checked in 7.7');
	check(sectionText(5).includes('*read now, derived in chapter [7.8]') && sectionText(5).includes('the shape of Wiseman and Will'), 'Wiseman and Will\'s shape is not derived in 7.8');
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 11, 'the insets are not eleven');
	// the capstone: its chapters (the table's last column) and the boxes it uses
	const capCites = new Set();
	for (const row of capstone.split('| (').slice(1).filter((x) => x.split('|').length > 4)) for (const c of row.split('|')[3].split(',').map((x) => x.trim())) if (/^(R\d+b?|\d+\.\d+)$/.test(c)) capCites.add(c);
	check(sorted(capCites).join(', ') === CAPSTONE_CITES, `the capstone's table cites ${[...capCites]}`);
	check(capstone.includes('The capstone follows one core collapse 10 kpc away'), 'the capstone does not follow one collapse');
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 3 && CAPTION.includes('three of them'), 'the capstone does not use three boxes');
	check(refsOf(capstone, 'eq').length === 0 && refsOf(capstone, 'fig').length === 0, 'the capstone links an equation or a figure');
	check(/requires: \['6\.4', '6\.5', '7\.3', '7\.5', '7\.7', '7\.8', '11\.1', '12\.1'\]/.test(md), 'the chapter\'s requirements');
	// the caption and the pointer, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-x-xi-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-x-xi-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes(POINTER), 'the chapter does not point to its map');
	// the paper's Section XI: its first four paragraphs, and the numbers
	const tex11 = await (await fetch('/paper/sections/11-vistas.tex')).text();
	const paras = [...tex11.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.slice(0, 4).join() === 'A pair of black holes, from the near zone to the wave zone,Memory,An exploding star,The Milky Way', `Section XI's paragraphs ${paras}`);
	for (const p of paras.slice(0, 4)) check(SECTIONS.some((s) => p.startsWith(s[1])), `no box is named for the paragraph ${p}`);
	check(flat.includes('We read Section X, and Section XI as far as *The Milky Way*'), 'the chapter does not read to The Milky Way');
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:affordances') === 'X' && auxNumber('sec:vistas') === 'XI', 'the sections are not X and XI');
	check(['multipole', 'memory', 'merger-memory', 'burst-memory'].map((e) => auxNumber(`eq:${e}`)).join() === '76,77,78,79', 'Section XI\'s four equations are not (76) to (79)');
	const numsOf = (eqs, figs, tabs) => [...tabs.map((t) => `Table ${auxNumber(`tab:${t}`)}`), ...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k], tabsOf[k]));
	check(nums.join(' | ') === 'Table VI |  | Table VII | (76), Fig. 35 | (50) | (77), (78), Fig. 36 | (79) | (49), (72), Fig. 37', `the numbers ${nums.join(' | ')}`);

	// ---- measuring ---------------------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const leftRoom = LZ - 2 * INSIDE;
	const rightRoom = W - LZ - 2 * RIGHT_AIR;
	// a list of chapters on as few lines as fit, the lines as even as the commas allow
	const lines = async (list, room) => {
		if ((await width(list)) <= room) return [list];
		const items = list.split(', ');
		let best = null;
		for (let j = 1; j < items.length; j++) {
			const a = items.slice(0, j).join(', ') + ',', b = items.slice(j).join(', ');
			const wa = await width(a), wb = await width(b);
			if (wa <= room && wb <= room && (!best || Math.abs(wa - wb) < best.d)) best = { d: Math.abs(wa - wb), out: [a, b] };
		}
		check(best, `the list "${list}" does not fit on two lines`);
		return best.out;
	};

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels], measured -----------------------------
	const words = async (nm, numbers, list, room) => {
		const out = [];
		let y = 0;
		out.push({ ...(await placedBase(textOf(await fits(nm, room)), 0, y, INK)), role: 'name' });
		if (numbers) {
			y += NUM_PITCH;
			out.push({ ...(await placedBase(textOf(await fits(numbers, room)), 0, y, INK)), role: 'numbers' });
		}
		for (const [j, line] of (await lines(list, room)).entries()) {
			y += j ? LIST_LEAD : LIST_PITCH;
			out.push({ ...(await placedBase(`\\text{${line}}`, 0, y, DIM)), role: 'chapters' });
		}
		return { out, t: Math.min(...out.map((g) => g.box.t)), b: Math.max(...out.map((g) => g.box.b)) };
	};
	// the dotted boxes in rows, in the section's order, as many to a row as fit, each row centred about x = 0, the
	// first row's top at y = 0
	const insets = async (stated, what) => {
		const out = [], dots = [];
		if (!stated.length) return { out, dots, t: 0, b: 0 };
		const probes = [];
		for (const [w] of stated) probes.push(await placedBase(textOf(w), 0, 0, DIM));
		const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
		const inkT = Math.min(...probes.map((g) => g.box.t)), inkB = Math.max(...probes.map((g) => g.box.b));
		const h = inkB - inkT + 2 * LATER_PAD[1];
		const rows = [[]];
		let used = 0;
		for (const [j, w] of ws.entries()) {
			check(w <= rightRoom, `the stated result "${stated[j][0]}" of ${what} (${w.toFixed(1)} pt) is wider than its room`);
			if (rows.at(-1).length && used + LATER_GAP + w > rightRoom) { rows.push([]); used = 0; }
			used += (rows.at(-1).length ? LATER_GAP : 0) + w;
			rows.at(-1).push(j);
		}
		let top = 0;
		for (const row of rows) {
			const total = row.reduce((a, j) => a + ws[j], 0) + (row.length - 1) * LATER_GAP;
			let x = -total / 2;
			for (const j of row) {
				const box = { l: x, r: x + ws[j], t: top, b: top + h };
				const g = await placedBase(textOf(stated[j][0]), (box.l + box.r) / 2, (box.t + box.b) / 2 - (inkT + inkB) / 2, DIM);
				out.push({ ...g, dotted: box, words: stated[j][0], derivedIn: stated[j][2] });
				dots.push({ box, what: `the dotted box of "${stated[j][0]}" in ${what}` });
				x += ws[j] + LATER_GAP;
			}
			top += h + LATER_GAP;
		}
		return { out, dots, t: 0, b: top - LATER_GAP, rows: rows.length };
	};
	const sets = [], ins = [];
	for (const [k, s] of SECTIONS.entries()) {
		sets.push(await words(s[1], nums[k], s[3], leftRoom));
		ins.push(await insets(s[4], `box ${k + 1}`));
	}

	// ---- the boxes, one column, each as tall as the taller of its two parts -------------------------------------------
	const x0 = ORIGIN - W / 2;
	const xl = x0 + LZ / 2, xr = x0 + LZ + (W - LZ) / 2;       // the centres of a box's two parts
	const boxes = [];
	let top = ORIGIN - 320;
	for (const [k, s] of SECTIONS.entries()) {
		const set = sets[k], inset = ins[k];
		const hatched = Boolean(s[5]);
		const h = Math.max(set.b - set.t + (hatched ? 2 * CLEAR[1] + 3 : 0), inset.b - inset.t) + 2 * PAD_Y;
		const l = x0, r = x0 + W, t = top, b = top + h, m = (t + b) / 2;
		const what = `box ${k + 1}`;
		boxes.push({ l, r, t, b, m, name: s[1] });
		const dy = m - (set.t + set.b) / 2;
		if (hatched) {
			hatch(S, { l, r, t, b }, what);
			// the clearings: the page itself, under the words and under each dotted box
			const cl = { l: xl + Math.min(...set.out.map((g) => g.box.l)) - CLEAR[0], r: xl + Math.max(...set.out.map((g) => g.box.r)) + CLEAR[0], t: dy + set.t - CLEAR[1], b: dy + set.b + CLEAR[1] };
			check(cl.t - t >= 1.5 && b - cl.b >= 1.5 && cl.l - l >= 3, `the clearing of ${what} reaches its edge`);
			S.raw(`<path d="M${n2(cl.l)},${n2(cl.t)}H${n2(cl.r)}V${n2(cl.b)}H${n2(cl.l)}Z" fill="${PAGE}"/>`, 0.5);
		} else S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 0, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
		// the words, centred in the left part; the dotted boxes, centred in the right part; both centred top to bottom
		for (const g of set.out)
			L.push({ src: g.src, svg: `<g transform="translate(${n2(xl)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, xl, dy), inside: { l, r: x0 + LZ, t, b, what }, within: what });
		check(near2(dy + set.t - t, b - dy - set.b) && dy + set.t - t >= PAD_Y - 0.01, `the words of ${what} are not centred in it`);
		if (inset.out.length) {
			const iy = m - (inset.t + inset.b) / 2;
			for (const d of inset.dots) {
				const box = shift(d.box, xr, iy);
				// every box on hatching shows the page
				if (hatched) S.raw(`<path d="M${n2(box.l)},${n2(box.t)}H${n2(box.r)}V${n2(box.b)}H${n2(box.l)}Z" fill="${PAGE}"/>`, 0.5);
				dotted(S, box, d.what);
			}
			for (const g of inset.out) {
				const box = shift(g.dotted, xr, iy);
				L.push({ src: g.src, svg: `<g transform="translate(${n2(xr)},${n2(iy)})">${g.svg}</g>`, box: shift(g.box, xr, iy), inside: { ...box, what: `the dotted box of "${g.words}" in ${what}` }, within: what });
				check(box.l >= x0 + LZ + RIGHT_AIR - 0.01 && box.r <= r - RIGHT_AIR + 0.01, `the dotted box of "${g.words}" leaves the right part of ${what}`);
			}
			check(iy - t >= PAD_Y - 0.01 && near2(iy - t, b - iy - inset.b), `the dotted boxes of ${what} are not centred in it`);
			const wordsR = Math.max(...set.out.map((g) => g.box.r)) + xl, dotsL = Math.min(...inset.dots.map((d) => d.box.l)) + xr;
			check(dotsL - wordsR >= 10, `the words and the dotted boxes of ${what} are ${(dotsL - wordsR).toFixed(2)} pt apart`);
		}
		top = b + ROW_GAP;
	}
	check(ins[2].out.map((g) => g.derivedIn).join() === '13.1,13.4' && ins.every((x, k) => k === 2 || x.out.every((g) => !g.derivedIn)), 'the insets named with their chapters are not exactly the two of 13.1 and 13.4');

	// ---- the arrows of the reading order: down the column, under the words ------------------------------------------
	for (let k = 0; k + 1 < SECTIONS.length; k++) {
		const a = boxes[k], c = boxes[k + 1];
		const ar = S.arrow([xl, a.b + STROKE / 2], [xl, c.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from box ${k + 1}` });
		check(ar.head === HEAD, `the arrow from box ${k + 1} is too short for a whole head`);
	}

	// ---- the last box, the capstone, and the bus into it ------------------------------------------------------------
	const cset = await words(CAPSTONE_NAME, '', CAPSTONE_CITES, W - 2 * INSIDE);
	const K = { l: x0, r: x0 + W, t: boxes.at(-1).b + LAST_GAP };
	K.b = K.t + (cset.b - cset.t) + 2 * PAD_Y;
	S.fill(`M${n2(K.l)},${n2(K.t)}H${n2(K.r)}V${n2(K.b)}H${n2(K.l)}Z`, K, { color: FILL, layer: 0, what: 'the last box', solid: false });
	S.path([[K.l, K.t], [K.r, K.t], [K.r, K.b], [K.l, K.b]], { color: OUTLINE, width: LAST_STROKE, closed: true, cap: 'butt', layer: 1, what: 'the last box' });
	{
		const dx = x0 + W / 2, dy = (K.t + K.b) / 2 - (cset.t + cset.b) / 2;
		for (const g of cset.out) L.push({ src: g.src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, dx, dy), inside: { ...K, what: 'the last box' }, within: 'the last box' });
		check(near2(dy + cset.t - K.t, K.b - dy - cset.b), 'the words of the last box are not centred in it');
	}
	const feeders = feederNames.map((n) => boxes.find((b) => b.name === n));
	check(feeders.every(Boolean) && feeders.every((b, i) => i === 0 || b.t > feeders[i - 1].t), 'a box the capstone uses is missing');
	const yb = K.t - TURN;
	check(yb - boxes.at(-1).b >= 3.5, 'the bus runs too near the last row');
	const xb = x0 - OUT, xin = x0 + IN;
	for (const b of feeders) S.path([[b.l - STROKE / 2, b.m], [xb, b.m]], { color: DIM, width: HAIR, cap: 'butt', what: `the line from "${b.name}"` });
	S.path([[xb, feeders[0].m], [xb, yb], [xin, yb]], { color: DIM, width: HAIR, cap: 'square', what: 'the bus' });
	const ar = S.arrow([xin, yb], [xin, K.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the bus\'s last leg' });
	check(ar.head === HEAD, 'the bus\'s last leg is too short for a whole head');
	check(xl - xin >= 30, 'the bus enters the last box too near the column\'s arrows');

	// ---- checks: every label inside its box clears the box's edges, centred left and right --------------------------
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		if (what.startsWith('the dotted box') || what === 'the last box') check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
		else check(Math.abs((g.box.l + g.box.r) / 2 - xl) < 0.02, `the label ${g.src} is not centred in the left part of ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within, `the hatching of ${g.within}`] : [])] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadXXiMap = { W, nums, boxes, last: K, drawn, rows: ins.map((i) => i.rows ?? 0) };
	return finish(S, L, [330, 350]);
}

const near2 = (a, b) => Math.abs(a - b) < 0.02;
const shift = (b, dx, dy) => ({ l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy });

/** A label's TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
}

/** Hatching at 45 degrees, rising to the right, inside a box, in the rule's grey (R10's). */
function hatch(S, { l, r, t, b }, what) {
	const step = HATCH_STEP * Math.SQRT2;            // along x, for lines HATCH_STEP apart
	const d = [];
	const h = b - t;
	for (let s = l - h + step / 2; s < r; s += step) {
		let xa = s, ya = b, xc = s + h, yc = t;
		if (xa < l) { ya -= l - xa; xa = l; }
		if (xc > r) { yc += xc - r; xc = r; }
		if (xc - xa < 0.3) continue;
		d.push(`M${n2(xa)},${n2(ya)}L${n2(xc)},${n2(yc)}`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${RULE}" stroke-width="${HATCH}" stroke-linecap="butt" fill="none"/>`, 0);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], 0, `the hatching of ${what}`);
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
