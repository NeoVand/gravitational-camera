// The tutorial, reading chapter R13b (tutorial/what-a-field-keeps/reading-sections-xiv-and-xv.md), its first diagram:
// Sections XIV and XV, the Conclusion and the open problems as a map of what Parts 1 to 13 have derived. The sibling of
// R13's map (figs/tut-read-xii-xiii-map.js) and R12's (figs/tut-read-x-xi-map.js): the same box, type, fill, outline,
// dotted box, hatched corner, flag and grey arrows, in ink and the page's greys only (the outline in ink, the fill the
// neutral tint of the page, the chapters and the dotted boxes in grey), since orange and blue mean a stretch and a
// squeeze and nothing here is stretched or squeezed. Eight boxes, one for each section of the chapter before the
// capstone, in its order (five for Section XIV, three for Section XV), in one column read down (one drawing serves the
// desktop and the phone, laid out to be read at 390 px, as R12's and R13's), then the Conclusion's box, its four
// paragraphs each with the chapters it rests on, and the box of Section XVII's six open problems, each with the
// chapters that touch it, all joined in reading order by thin grey arrows. Each section's box carries, at its left, a
// short name for its section (the paper's paragraph where the section links one; two names take two lines), under it
// the paper's equations, figures and tables that the section shows or links, as the site numbers them, and under
// those, in grey, the chapters the section cites; at its right, each in a small dotted box, the results the section
// marks as stated in the paper. Four boxes carry R13's hatched corner, where a step they rest on is a sketch at depth
// B: the response (the zero Love number and Page's 256/225 in 11.4), the weight (the radii's formula in 13.7), and
// Section XV's plain words and the classical limit (13.8's count of cells, a sketch at depth B there and the
// tutorial's own, so those two corners carry a small grey tag, "tutorial's own"). Three boxes carry R13's flag in the
// margin at their right, where the chapter says the paper says more than it shows: the fluctuations (the paper's c/r_s,
// a little loose), What gravity cannot decohere (readings at two times differ only where impulses are supplied) and
// the Conclusion (two phrases leave out a condition). Below, set apart by a gap, the last
// box, the capstone, outlined a little heavier, with grey arrows into it along a bus outside the column's left side
// from the five boxes whose results its table quotes and from R13's bits, a stub above the column.
// Departures from the diagram's comment, where the chapter's text decides: one column read down, as every reading map
// since R11, not two; each box lists every chapter its section cites and only those, not the comment's three lists;
// the dotted insets are the results the sections mark stated in the paper (eleven): Binnington and Poisson, Damour and
// Nagar and Goldberger and Rothstein are read now, derived in 11.4, and Kehagias and Riotto, Porto and Goldberger, Li
// and Rothstein are cited in the weight's text without a mark of stated, so they have none, while the table's three
// entries of the hole, the holographic principle and the hole's gain under any tide are marked stated and have one;
// Section XV's plain words carry the hatched corner too, since they rest on 13.8's count; there are three flags, not
// four, since the paper as corrected leaves the weight's factor and radii, the plain words' count and tremor, the
// classical limit's count and the bead's density nothing more to show, while the chapter still finds the paper's c/r_s
// a little loose and says two of the Conclusion's phrases leave out a condition; the Conclusion's "Parts that
// exist" rest on stated results, so its chapters stand in a dotted box; the caption names the hatched corners and the
// Parts the chapters belong to (1 to 13, since the sections cite 1.5, 1.7, 1.8, 2.5, 2.8 and 3.2).
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section and each paragraph or problem cites, the equations, figures and tables it
// shows or links, the results it marks as stated, its sketches at depth B, its notes where the paper says more, the
// ledger's five equations, the capstone's table) and against the paper (main.aux, Sections XIV and XV's paragraphs);
// the boxes' sizes and places are chosen for the drawing.
import { tex, figure, Panel, INK, DIM, RULE } from '../lib.js';
import { Sheet, ORIGIN, M, checker, boxOf, n2, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-xiv-xv-map';
const check = checker(name);
const FILE = '/tutorial/what-a-field-keeps/reading-sections-xiv-and-xv.md';

// ---- the eight sections, in order -------------------------------------------------------------------------------
// [the section's heading, the box's name (a '|' breaks it into two lines), phrases of the section that name what the
// box is called, the chapters it cites, the results stated (the inset's words, the section's words in or just before
// the sentence that marks it), the sketch at depth B (the section's words) or null, the flag (pairs: the note's mark
// or null, and the words of the note or of the section where the paper says more than it shows) or null]
export const SECTIONS = [
	['Section XIV\'s plain words: a hole has no bulge, has friction, and trembles at its own temperature',
		'Section XIV\'s plain words', ['In the box, a hole that does not turn has "Love numbers of exactly zero"'], '4.2, 4.6, 11.4, 12.2, 13.7', [], null, null],
	['A hole raises no bulge, and its quadrupole answers a changing tide with friction alone', 'The response of a black|hole to a tide',
		['[*The response of a black hole to a tide*](/paper/#par:the-response-of-a-black-hole-to-a-tide)'], '4.1, 4.5, 4.6, 7.5, 11.4', [
			['Charalambous et al.\'s friction', '[@CharalambousDubovskyIvanov2021]'],
			['Poisson\'s $16/45$', '[@Poisson2004]']
		], 'as a sketch at depth B', null],
	['The quadrupole trembles at the Hawking temperature, and the tremor gives back the mass', 'The fluctuations of a black|hole\'s quadrupole',
		['[*The fluctuations of a black hole\'s quadrupole*](/paper/#par:the-fluctuations-of-a-black-holes-quadrupole)'], '1.5, 3.2, 4.2, 4.6, 11.3, 11.4, 13.7', [], null,
		[[null, 'a little stricter than the paper\'s $c/r_s$']]],
	['A hole weighs like a shell a little outside its horizon, yet its sums belong to no body', 'The weight of a black|hole\'s response',
		['[*The weight of a black hole\'s response*](/paper/#par:the-weight-of-a-black-holes-response)'], '4.5, 11.1, 11.3, 11.4, 13.7', [],
		'the formula a sketch at depth B', null],
	['The table, row by row: the stone\'s column reads the interior, and the hole\'s returns its mass', 'The table, row by row',
		['In Table [](/paper/#tab:hair)'], '1.7, 1.8, 2.5, 2.8, 3.8, 4.2, 4.5, 4.6, 11.2, 11.4, 13.1, 13.3, 13.4, 13.7', [
			['the hole\'s degree-$m$ tides', 'for tides of degree up to $m$'],
			['the hole\'s passing mass', 'for a mass that passes'],
			['the hole\'s two tides', 'for two tides in either order']
		], null, null],
	['Section XV\'s plain words: looking gives a surface\'s worth, and pushing gives the inside, slowly', 'Section XV\'s plain words',
		['The box\'s sphere of radius $R$'], '2.5, 8.1, 13.1, 13.2, 13.8', [
			['the holographic principle', 'The **holographic principle**']
		], 'by 13.8\'s count', null],
	['A hole gives seven numbers, a temperature and its mass again, and without quantum physics no temperature', 'Black holes and the|classical limit',
		['[*Black holes and the classical limit*](/paper/#par:black-holes-and-the-classical-limit)'], '2.5, 6.4, 11.2, 11.4, 13.1, 13.2, 13.3, 13.6, 13.7, 13.8', [
			['the gain under any tide', 'is set by its mass and spin alone'],
			['the four quantum arguments', 'Four quantum arguments']
		], 'by a count that is the tutorial\'s own', null],
	['A ball and a shell leave gravity no record, yet differ in their Diósi–Penrose energy', 'What gravity cannot|decohere',
		['[*What gravity cannot decohere*](/paper/#par:what-gravity-cannot-decohere)'], '2.5, 4.5, 6.4, 13.1, 13.8', [
			['Belenchia et al., Danielson et al.', '[@Belenchia2018; @DanielsonSatishchandranWald2022]'],
			['Donadi et al.\'s experiment', '[@DonadiEtAl2021]'],
			['Allali and Hertzberg\'s remark', '[@AllaliHertzberg2020]']
		], null, [['impulses', 'differ only where heat, the zero point or a tide supplies impulses']]]
];
// numbers a pattern takes for chapters: "and 1.070 times", "1.69 and 1.73"
const NOT_CITED = ['1.070', '1.73'];
// the sections whose step rests on 13.8's count of cells: their corners carry the tag
const OWN = [5, 6];
const TAG = '\\text{tutorial\'s own}';
const CAPSTONE = 'The capstone: a black hole and a moon of one mass';
const CAPSTONE_NAME = 'The capstone: a black hole and a moon of one mass';
const CAPSTONE_CITES = '1.7, 3.8, 4.2, 4.5, 4.6, 6.4, 8.6, 11.2, 11.4, 13.7, 13.8';
const LEDGER = 'The ledger: five equations derived, with 16/45 stated and the greybody factor numerical';
const LEDGER_EQS = 'horizon-friction,hole-noise,hole-thermometer,hole-sum-rule,dp-energy';
const CONCLUSION = 'The Conclusion follows from the chapters, though a few of its phrases say more';
const OPEN = 'Section XVII leaves six problems open, and the tutorial touched each';
// the Conclusion's four paragraphs: [the paragraph's title (a '|' breaks it), the chapters it cites]
const PARAGRAPHS = [
	['Spin and two small numbers', 'R5, R10b, R11, 0.2, 3.7, 6.3, 9.3, 9.4, 11.1, 11.3'],
	['What each channel|cannot tell apart', 'R12, 2.5, 2.8, 4.2, 7.6, 9.6, 11.4, 13.1, 13.2, 13.3, 13.4, 13.7'],
	['The vector and its square', 'R3, R9b, 0.2, 9.3'],
	['Parts that exist', 'R1, 8.6']
];
const CONCLUSION_FLAG = 'Two phrases leave out a condition';
// Section XVII's six problems: [the box's words, a phrase of the problem, the chapters it cites]
const PROBLEMS = [
	['1. what a finite record recovers', 'a finite record recovers', '13.8'],
	['2. the pair\'s test', 'is a test "described here and not designed"', '13.8'],
	['3. the general wave', 'The general wave is unsolved', '1.7, 6.4, 13.5'],
	['4. the full theory\'s algebra', 'Whether the full theory\'s moments "close on a known algebra is open"', '13.6'],
	['5. a bound on sensitivity', 'A bound on sensitivity', '13.8'],
	['6. friction in real materials', 'The friction of real materials', '10.3']
];
const CONCLUSION_NAME = 'Section XVI: the Conclusion';
const OPEN_NAME = 'Section XVII: six open problems';
// the boxes whose results the capstone's table quotes: [the box, the capstone's words, the box's words]
const USES = [
	['The response of a black|hole to a tide', '| (b) a steady tide | $k_2 = 0$ |', 'turn has $k_2 = 0$'],
	['The response of a black|hole to a tide', 'slow: $\\mathrm{Im}\\,\\chi = \\nu\\omega', 'so $\\mathrm{Im}\\,\\chi = \\nu\\omega$'],
	['The fluctuations of a black|hole\'s quadrupole', '$S_Q = 4.62\\times10^{-46}\\unit{kg^2\\,m^4\\,s}$: 0.905 K', '$S_Q = 4.62\\times10^{-46}\\unit{kg^2\\,m^4\\,s}$'],
	['The weight of a black|hole\'s response', '| (d) the sums | $0.345\\,\\matter Mr_s^2', 'the hole\'s $0.345\\,\\matter Mr_s^2$'],
	['The table, row by row', '| (f) a weighing after the tide |', '| Its weight, after a tide | 1.7, 13.1: the density | 11.4: its mass |'],
	['Black holes and the|classical limit', 'seven numbers, $7\\log_2\\SNR = 139.5$ bits', '"seven numbers at one time" are its mass, place and spin'],
	['Black holes and the|classical limit', 'row (g) 13.8\'s count of cells', 'derives both laws, by a count']
];
// R13's bits, the stub: the capstone's words, and R13's
const R13_USE = ['1176 bits from $3R_{\\rm m}$', '| (a) one time | the paper\'s [](/paper/#eq:hair-bits) from $3R$ at $10^6$ | 1176 bits |'];
const STUB = '\\text{R13\'s bits}';
const CAPTION = 'Look first at the solid boxes: every paragraph of Sections XIV and XV rests on chapters of Parts 1 to 13, with its stated results in dotted insets. The hatched corners mark a step sketched at depth B, and the flags mark where the paper says more than it shows. The last box follows one hole and one moon down the table\'s rows.';

// ---- the drawing (figure points, y down); the type, strokes and kit of R13's map -----------------------------------
const SIZE = 8.5;                 // every label
const W = 335;                    // the column's width: R12's and R13's
const LZ = 142;                   // the left part of a box, where its name, numbers and chapters stand
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NAME_LEAD = 10.2;           // between the two lines of a long name
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const LIST_LEAD = 10.2;           // between the lines of a long list of chapters
const LIST_AIR = 8;               // a list of chapters breaks before it comes nearer the box's side than this, and INSIDE
const PAD_Y = 5.2;                // the least air above and below a box's words
const INSIDE = 2.6;               // the least air between a label and its box's sides
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes, side by side or one above the other
const RIGHT_AIR = 6;              // the dotted boxes' rows keep this far inside the box's right part on each side
const ROW_GAP = 11;               // between the boxes: room for an arrow with a whole head
const ENTRY_PITCH = 14;           // in the Conclusion's and the problems' boxes, from one entry's last baseline to the next's first
const HEAD_PITCH = 15.5;          // and from the box's name to the first entry
const HEAD = 3.6;                 // the arrows' heads
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const TURN = 11;                  // the bus turns this far above the last box
const OUT = 6;                    // the bus runs this far outside the column
const IN = 22;                    // the bus enters the last box this far in from its side
const LAST_GAP = 16;              // from the last row to the last box
const STUB_UP = 10;               // R13's stub: its line this far above the first box
const HATCH = 0.4, HATCH_STEP = 2.4;      // R10's hatching: its lines and their spacing, measured across them
const EAR = 11;                   // the hatched corner: the legs of its triangle, along the top and down the right side
const FLAG = { off: 4, staff: 11, w: 5.2, h: 4.4, width: 0.5 };  // the flag: its staff this far right of the box, its height, the pennant

const TALL = 1400;                // the provisional page, points, before the figure is cropped to its ink
const K_INK = 8;                  // pixels per point when the ink is measured
const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	// eleven boxes are taller than the kit's provisional page: a taller one, cropped to the ink as the kit's finish
	S.P = new Panel({ x: 0, y: 0, w: TALL, h: TALL, scale: 1 });
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch(FILE)).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 12 && heads[8] === CAPSTONE && heads[9] === LEDGER && heads[10] === CONCLUSION && heads[11] === OPEN, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first eight sections, in order');
	// a section's text up to the notes (which follow the last section) and the closing blocks; raw keeps the notes' marks
	const rawSection = (i) => text.split(/^## .*$/m)[i + 1].split(/^\[\^\w+\]:/m)[0].split('**The idea to keep')[0].replace(/\s+/g, ' ');
	const sectionText = (i) => rawSection(i).replace(/\[\^\w+\]/g, '');
	const notes = Object.fromEntries([...text.matchAll(/^\[\^(\w+)\]:([\s\S]*?)(?=^\[\^|(?![\s\S]))/gm)].map((m) => [m[1], m[2].replace(/\s+/g, ' ')]));
	const capstone = sectionText(8);
	// the chapters a section cites: every way the chapter names one, every parenthesis that holds only chapters, and
	// every cell of a table that starts with chapters ("| 2.5, 2.8: the harmonic moments")
	// a number followed by a unit, or set in math, is a quantity, not a chapter ("from 26.3 km")
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d|\\s*(?:%|°|×|\'\'|\\\\|(?:km|kg|cm|mm|nm|m|s|K|per|GHz|MHz|kHz|Hz|eV|keV|MeV|GeV|pc|kpc|Mpc|ly|au|AU|J|W|yr|years?|days?|times|bits?)(?![A-Za-z])))';
	const CH = /^(R\d+b?|\d+\.\d+)$/;
	const citesOf = (sec) => {
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with|and|read in) \\[?${C}`])
			for (const m of sec.matchAll(new RegExp(re, 'g'))) if (!NOT_CITED.includes(m[1])) out.add(m[1]);
		for (const m of sec.matchAll(/\(([^()]*)\)/g)) {
			const items = m[1].split(/,\s*/);
			if (items.length > 1 && items.every((x) => CH.test(x))) items.forEach((x) => out.add(x));
		}
		for (const m of sec.matchAll(/\| ((?:(?:R\d+b?|\d+\.\d+), )*(?:R\d+b?|\d+\.\d+)): /g)) m[1].split(', ').forEach((x) => out.add(x));
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + parseInt(c.slice(1), 10) : Number(c));
	const sorted = (xs) => [...xs].sort((a, b) => order(a) - order(b));
	const sentences = (sec) => sec.split(/(?<=\.)\s+(?=[A-Z"\[*])/);
	// the ledger's five equations, in order
	const ledgerRows = text.split(/^## .*$/m)[10].split('\n').filter((x) => x.startsWith('| [](/paper/#eq:'));
	const ledgerEqs = ledgerRows.map((row) => row.match(/\[\]\(\/paper\/#eq:([\w-]+)\)/)[1]);
	check(ledgerEqs.join() === LEDGER_EQS && LEDGER.startsWith('The ledger: five equations derived'), `the ledger's equations ${ledgerEqs}`);
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const tabsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'tab'));
	const shown = SECTIONS.map((_, k) => [...sectionText(k).matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1])).flat();
	check(shown.join() === LEDGER_EQS, `the sections show the equations ${shown}`);
	check(eqsOf.map((e) => e.join('+')).join() === ',horizon-friction,hole-noise+hole-thermometer,sum-rule+hole-sum-rule,horizon-friction,,split+ladder+push,dust+dp-energy', `the equations the boxes hold ${eqsOf.map((e) => e.join('+'))}`);
	check(figsOf.map((f) => f.join('+')).join() === ',,,hole-response,,,,', `the figures ${figsOf.map((f) => f.join('+'))}`);
	check(tabsOf.map((f) => f.join('+')).join() === ',,,,hair,,,', `the tables ${tabsOf.map((f) => f.join('+'))}`);
	// a result stated in the paper
	const statedMark = (m) => m.includes('*stated in the paper*');
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		for (const p of s[2]) check(sec.includes(p), `the section "${s[0]}" does not name ${p}`);
		// the chapters cited, and only those
		check(sorted(citesOf(sec)).join(', ') === s[3], `the section "${s[0]}" cites ${sorted(citesOf(sec))}, the box lists ${s[3]}`);
		// the results stated: every sentence that marks one is named by an inset (a sentence "The sources" by the one
		// before it too), and every inset's words stand in or just before a sentence so marked
		const ss = sentences(sec);
		const windows = ss.map((m, j) => (statedMark(m) ? (m.startsWith('The sources') ? ss.slice(Math.max(0, j - 1), j + 1).join(' ') : m) : null)).filter(Boolean);
		for (const w of windows) check(s[4].some(([, words]) => w.includes(words)), `the section "${s[0]}" states a result no inset shows: ${w}`);
		for (const [, words] of s[4]) check(windows.some((w) => w.includes(words)), `the inset "${words}" of "${s[0]}" is not marked stated`);
		check(!/\*stated\*|\(stated\)/.test(sec), `the section "${s[0]}" has another kind of stated mark`);
		check(!sec.includes('*derived here*'), `the section "${s[0]}" derives a step here`);
		// a hatched corner only where the section rests on a sketch at depth B: its own words, or 13.8's count
		check((sec.includes('depth B') || OWN.includes(k)) === Boolean(s[5]) && (!s[5] || sec.includes(s[5])), `the section "${s[0]}" and depth B`);
		// a flag only where the chapter says the paper says more than it shows: in a note the section marks, or in its text
		for (const [mark, words] of s[6] ?? []) {
			if (mark) check(rawSection(k).includes(`[^${mark}]`) && (notes[mark] ?? '').includes(words), `the flag of "${s[0]}": the note ${mark}`);
			else check(sec.includes(words), `the flag of "${s[0]}": ${words}`);
		}
	}
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 11, 'the insets are not eleven');
	check(SECTIONS.filter((s) => s[5]).length === 4 && SECTIONS.filter((s) => s[6]).length === 2, 'not four hatched corners and two flags on the sections');
	// the sketches: 11.4's (the zero Love number, Page's 256/225), 13.7's formula, and 13.8's count, a sketch at depth B
	// there and the tutorial's own
	check(sectionText(1).includes('*read now, derived in chapter [11.4](/tutorial/black-holes/under-tides/#a-steady-tide-raises-no-bulge-on-a-hole)*, as a sketch at depth B') &&
		sectionText(1).includes('this is Don Page\'s $\\tfrac{256}{225}(G\\matter M\\omega/c^3)^6$ (*read now, derived in chapter [11.4](/tutorial/black-holes/under-tides/#the-same-friction-absorbs-long-gravitational-waves)*, as a sketch at depth B)'), 'the response\'s two sketches');
	check(sectionText(3).includes('the radii numerical, the formula a sketch at depth B'), 'the weight\'s sketch');
	const ch138 = (await (await fetch('/tutorial/what-a-field-keeps/holography.md')).text()).replace(/\s+/g, ' ');
	check(ch138.includes('The count is a sketch at depth B.') && ch138.includes('[^own]: This count is the tutorial\'s own'), '13.8\'s count is not a sketch at depth B, the tutorial\'s own');
	check(notes.Rd.includes('(13.8\'s count)'), 'the note on the plain words\' count');
	// the Conclusion: four paragraphs, the chapters each cites, the stated one, and the phrases that say more
	const concl = sectionText(10);
	check(concl.includes('[Section XVI](/paper/#sec:conclusion), the *Conclusion*, gathers the paper in four paragraphs.'), 'the Conclusion\'s four paragraphs');
	const paras = [...concl.matchAll(/\*([A-Z][^*]*)\.\* ([\s\S]*?)(?= \*[A-Z][^*]*\.\* |$)/g)].map((m) => [m[1], m[2]]);
	check(paras.map((p) => p[0]).join() === PARAGRAPHS.map((p) => p[0].replace('|', ' ')).join(), `the Conclusion's paragraphs ${paras.map((p) => p[0])}`);
	for (const [j, [t, body]] of paras.entries()) check(sorted(citesOf(body)).join(', ') === PARAGRAPHS[j][1], `the paragraph "${t}" cites ${sorted(citesOf(body))}`);
	const statedParas = paras.map((p) => statedMark(p[1]));
	check(statedParas.join() === 'false,false,false,true', 'the Conclusion\'s stated paragraph');
	check(concl.includes(CONCLUSION_FLAG) && CONCLUSION.includes('a few of its phrases say more'), 'the Conclusion\'s phrases that say more');
	// Section XVII: six problems, each with its chapters
	const open = text.split(/^## .*$/m)[12].split('**The idea to keep')[0];
	check(open.includes('[Section XVII](/paper/#sec:status), *Open problems*, names six.'), 'Section XVII does not name six');
	const items = [...open.matchAll(/^(\d)\. ([\s\S]*?)(?=^\d\. |(?![\s\S]))/gm)].map((m) => [m[1], m[2].replace(/\s+/g, ' ')]);
	check(items.map((i) => i[0]).join('') === '123456', `the problems ${items.map((i) => i[0])}`);
	for (const [j, [nr, body]] of items.entries()) {
		check(PROBLEMS[j][0].startsWith(`${nr}. `) && body.includes(PROBLEMS[j][1]), `the problem ${nr}`);
		check(sorted(citesOf(body)).join(', ') === PROBLEMS[j][2], `the problem ${nr} cites ${sorted(citesOf(body))}`);
		check(!statedMark(body) && !body.includes('depth B'), `the problem ${nr} has a mark`);
	}
	// the capstone: its chapters (the table's last column) and the boxes it uses
	const capCites = new Set();
	const capRows = [...capstone.matchAll(/\| \(([a-z])\) [^|]*\|[^|]*\|[^|]*\|([^|]*)\|/g)];
	check(capRows.map((m) => m[1]).join('') === 'abcdefg', `the capstone's rows ${capRows.map((m) => m[1])}`);
	for (const m of capRows) for (const c of m[2].split(',').map((x) => x.trim())) if (CH.test(c)) capCites.add(c);
	check(sorted(capCites).join(', ') === CAPSTONE_CITES, `the capstone's table cites ${sorted(capCites)}`);
	check(capstone.includes('The capstone sets the 0.905 K hole beside a rocky moon of the same mass'), 'the capstone does not set one hole beside one moon');
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(k >= 0 && capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const r13 = (await (await fetch('/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii.md')).text()).replace(/\s+/g, ' ');
	check(capstone.includes(R13_USE[0]) && r13.includes(R13_USE[1]) && capstone.includes('R13\'s impulse strength'), 'the capstone does not use R13\'s bits');
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 5, 'the capstone does not use five boxes');
	check(/requires: \['2\.5', '3\.8', '4\.2', '4\.5', '4\.6', '8\.1', '8\.6', '11\.2', '11\.3', '11\.4', '13\.1', '13\.3', '13\.7', '13\.8'\]/.test(md), 'the chapter\'s requirements');
	// the parts the sections' chapters belong to: 1 to 13
	const cited = new Set(SECTIONS.flatMap((s) => s[3].split(', ')));
	check([...cited].every((c) => !c.startsWith('R')), 'a section cites a reading chapter');
	const parts = new Set([...cited].map((c) => Number(c.split('.')[0])));
	check(Math.min(...parts) === 1 && Math.max(...parts) === 13 && CAPTION.includes('Parts 1 to 13'), `the parts cited ${[...parts]}`);
	// the reading chapters the Conclusion cites exist
	for (const c of new Set(PARAGRAPHS.flatMap((p) => p[1].split(', ')).filter((c) => c.startsWith('R'))))
		check(new RegExp(`\\[${c}\\]\\(/tutorial/|\\(${c}\\)|${c}'s`).test(concl), `the Conclusion's ${c}`);
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-xiv-xv-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-xiv-xv-map}`), 'the caption is not the figure\'s');
	// the paper's Sections XIV and XV: their paragraphs, and the numbers
	const texHair = await (await fetch('/paper/sections/11a-hair.tex')).text();
	const after = texHair.slice(texHair.indexOf('\\label{sec:hole}'));
	const paperParas = [...after.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paperParas.join() === 'The response of a black hole to a tide,The fluctuations of a black hole\'s quadrupole,The weight of a black hole\'s response,Black holes and the classical limit,What gravity cannot decohere', `Sections XIV and XV's paragraphs ${paperParas}`);
	for (const p of paperParas) check(SECTIONS.some((s) => s[1].replace('|', ' ') === p), `no box is named for the paragraph ${p}`);
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:hole') === 'XIV' && auxNumber('sec:holography') === 'XV' && auxNumber('sec:conclusion') === 'XVI' && auxNumber('sec:status') === 'XVII', 'the sections are not XIV to XVII');
	check(CONCLUSION_NAME.includes(`Section ${auxNumber('sec:conclusion')}:`) && OPEN_NAME.includes(`Section ${auxNumber('sec:status')}:`), 'the last two boxes\' sections');
	const numsOf = (eqs, figs, tabs) => [...tabs.map((t) => `Table ${auxNumber(`tab:${t}`)}`), ...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k], tabsOf[k]));
	check(nums.join(' | ') === ' | (97) | (98), (99) | (15), (100), Fig. 45 | Table VIII, (97) |  | (11), (87), (92) | (83), (101)', `the numbers ${nums.join(' | ')}`);

	// ---- measuring ---------------------------------------------------------------------------------------------------
	const widths = new Map();
	const width = async (s) => {
		if (!widths.has(s)) { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); widths.set(s, b.r - b.l); }
		return widths.get(s);
	};
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const leftRoom = LZ - 2 * INSIDE;
	const rightRoom = W - LZ - 2 * RIGHT_AIR;
	// a list on as few lines as fit, the widest line as narrow as the commas allow
	const lines = async (list, room) => {
		if ((await width(list)) <= room) return [list];
		const items = list.split(', ');
		const join = (a, b, last) => items.slice(a, b).join(', ') + (last ? '' : ',');
		for (let n = 2; n <= 3; n++) {
			let best = null;
			const cuts = n === 2 ? [...Array(items.length - 1).keys()].map((j) => [j + 1]) : [...Array(items.length - 1).keys()].flatMap((j) => [...Array(items.length - j - 2).keys()].map((q) => [j + 1, j + q + 2]));
			for (const cut of cuts) {
				const ends = [0, ...cut, items.length];
				const ls = ends.slice(0, -1).map((a, q) => join(a, ends[q + 1], q === n - 1));
				const ws = [];
				for (const l of ls) ws.push(await width(l));
				if (Math.max(...ws) <= room && (!best || Math.max(...ws) < best.d)) best = { d: Math.max(...ws), out: ls };
			}
			if (best) return best.out;
		}
		check(false, `the list "${list}" does not fit on three lines`);
	};

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels], measured -----------------------------
	const words = async (nm, numbers, list, room) => {
		const out = [];
		let y = 0;
		for (const [j, line] of nm.split('|').entries()) {
			y += j ? NAME_LEAD : 0;
			out.push({ ...(await placedBase(textOf(await fits(line, room)), 0, y, INK)), role: 'name' });
		}
		if (numbers) for (const [j, line] of (await lines(numbers, room)).entries()) {
			y += j ? NAME_LEAD : NUM_PITCH;
			out.push({ ...(await placedBase(textOf(line), 0, y, INK)), role: 'numbers' });
		}
		if (list) for (const [j, line] of (await lines(list, room - LIST_AIR)).entries()) {
			y += j ? LIST_LEAD : LIST_PITCH;
			out.push({ ...(await placedBase(`\\text{${line}}`, 0, y, DIM)), role: 'chapters' });
		}
		return { out, t: Math.min(...out.map((g) => g.box.t)), b: Math.max(...out.map((g) => g.box.b)) };
	};
	// the ink's extent of every stated result's words, together: one height for every dotted box
	const INSET_INK = { t: Infinity, b: -Infinity };
	for (const w of [...SECTIONS.flatMap((s) => s[4].map((x) => x[0])), PARAGRAPHS[3][1]]) {
		const g = await placedBase(textOf(w), 0, 0, DIM);
		INSET_INK.t = Math.min(INSET_INK.t, g.box.t); INSET_INK.b = Math.max(INSET_INK.b, g.box.b);
	}
	const insetH = INSET_INK.b - INSET_INK.t + 2 * LATER_PAD[1];
	// the dotted boxes in rows, in the section's order, as many to a row as fit, each row centred about x = 0, the
	// first row's top at y = 0
	const insets = async (stated, what) => {
		const out = [], dots = [];
		if (!stated.length) return { out, dots, t: 0, b: 0 };
		const probes = [];
		for (const w of stated) probes.push(await placedBase(textOf(w), 0, 0, DIM));
		const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
		const rows = [[]];
		let used = 0;
		for (const [j, w] of ws.entries()) {
			check(w <= rightRoom, `the stated result "${stated[j]}" of ${what} (${w.toFixed(1)} pt) is wider than its room`);
			if (rows.at(-1).length && used + LATER_GAP + w > rightRoom) { rows.push([]); used = 0; }
			used += (rows.at(-1).length ? LATER_GAP : 0) + w;
			rows.at(-1).push(j);
		}
		let top = 0;
		for (const row of rows) {
			const total = row.reduce((a, j) => a + ws[j], 0) + (row.length - 1) * LATER_GAP;
			let x = -total / 2;
			for (const j of row) {
				const box = { l: x, r: x + ws[j], t: top, b: top + insetH };
				const g = await placedBase(textOf(stated[j]), (box.l + box.r) / 2, (box.t + box.b) / 2 - (INSET_INK.t + INSET_INK.b) / 2, DIM);
				out.push({ ...g, dotted: box, words: stated[j] });
				dots.push({ box, what: `the dotted box of "${stated[j]}" in ${what}` });
				x += ws[j] + LATER_GAP;
			}
			top += insetH + LATER_GAP;
		}
		return { out, dots, t: 0, b: top - LATER_GAP, rows: rows.length };
	};
	const TAG_H = await (async () => { const b = (await placed(TAG, 0, 0, 0, 0, DIM)).box; return b.b - b.t; })();
	const sets = [], ins = [];
	for (const [k, s] of SECTIONS.entries()) {
		sets.push(await words(s[1], nums[k], s[3], leftRoom));
		ins.push(await insets(s[4].map((x) => x[0]), `box ${k + 1}`));
	}

	// ---- the boxes, one column, each as tall as the taller of its two parts -------------------------------------------
	const x0 = ORIGIN - W / 2;
	const xl = x0 + LZ / 2, xr = x0 + LZ + (W - LZ) / 2;       // the centres of a box's two parts
	const boxes = [];
	let top = 60;
	const frame = (l, r, t, b, what, stroke = STROKE) => {
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 0, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: stroke, closed: true, cap: 'butt', layer: 1, what });
	};
	const push = (g, dx, dy, inside, within) => L.push({ src: g.src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, dx, dy), inside, within });
	for (const [k, s] of SECTIONS.entries()) {
		const set = sets[k], inset = ins[k];
		let h = Math.max(set.b - set.t, inset.b - inset.t) + 2 * PAD_Y;
		// a box whose corner carries the tag is tall enough for its dotted boxes, centred, to pass under the tag
		if (OWN.includes(k)) h = Math.max(h, 2 * (INSIDE + 0.4 + TAG_H + LABEL_GAP + DOT + 0.3 + (inset.b - inset.t) / 2));
		const l = x0, r = x0 + W, t = top, b = top + h, m = (t + b) / 2;
		const what = `box ${k + 1}`;
		boxes.push({ l, r, t, b, m, name: s[1] });
		frame(l, r, t, b, what);
		// a step sketched at depth B: R12's hatching in a dog-ear at the top right, cut off by a grey hairline
		if (s[5]) {
			check(h / 2 >= EAR + 3, `the hatched corner of ${what} reaches the box's middle`);
			ear(S, { r, t }, what);
		}
		// 13.8's count, the tutorial's own: a small grey tag left of the corner, its top INSIDE below the box's top
		if (OWN.includes(k)) {
			const g = await placed(TAG, r - EAR - LABEL_GAP - 0.4, t + INSIDE + 0.4, 1, 0, DIM);
			L.push({ ...g, inside: { l: x0 + LZ, r, t, b, what }, within: what, tag: true });
		}
		// where the paper says more than it shows: a flag in the margin at the right, level with the box's middle
		if (s[6]) flag(S, [r + FLAG.off, m], what);
		// the words, centred in the left part; the dotted boxes, centred in the right part; both centred top to bottom
		const dy = m - (set.t + set.b) / 2;
		for (const g of set.out) push(g, xl, dy, { l, r: x0 + LZ, t, b, what }, what);
		check(near2(dy + set.t - t, b - dy - set.b) && dy + set.t - t >= PAD_Y - 0.01, `the words of ${what} are not centred in it`);
		if (inset.out.length) {
			const iy = m - (inset.t + inset.b) / 2;
			for (const d of inset.dots) dotted(S, shift(d.box, xr, iy), d.what);
			for (const g of inset.out) {
				const box = shift(g.dotted, xr, iy);
				push(g, xr, iy, { ...box, what: `the dotted box of "${g.words}" in ${what}` }, what);
				check(box.l >= x0 + LZ + RIGHT_AIR - 0.01 && box.r <= r - RIGHT_AIR + 0.01, `the dotted box of "${g.words}" leaves the right part of ${what}`);
				// the dotted boxes clear the hatched corner
				if (s[5]) check((r - box.r) + (box.t - t) >= EAR + 5 * Math.SQRT2, `the dotted box of "${g.words}" runs into the hatched corner of ${what}`);
			}
			check(iy - t >= PAD_Y - 0.01 && near2(iy - t, b - iy - inset.b), `the dotted boxes of ${what} are not centred in it`);
			// the two parts keep apart
			const wordsR = Math.max(...set.out.map((g) => g.box.r)) + xl, dotsL = Math.min(...inset.dots.map((d) => d.box.l)) + xr;
			check(dotsL - wordsR >= 10, `the words and the dotted boxes of ${what} are ${(dotsL - wordsR).toFixed(2)} pt apart`);
		}
		top = b + ROW_GAP;
	}

	// ---- the Conclusion's box and the problems' box: the name across the top, then one entry to a row, its title in
	// the left part and its chapters in grey in the right part --------------------------------------------------------
	const listBox = async (title, entries, what, flagged, flush) => {
		const head = await placedBase(textOf(await fits(title, W - 2 * INSIDE)), 0, 0, INK);
		const t = top;
		let y = t + PAD_Y - head.box.t;                       // the name's baseline
		push(head, x0 + W / 2, y, null, what);
		let last = y, lowest = y + head.box.b;
		// with `flush`, the titles stand flush left in a block centred in the left part (a numbered list)
		const titleW = [];
		for (const e of entries) titleW.push(await width(e.title));
		const blockL = xl - Math.max(...titleW) / 2;
		for (const [j, e] of entries.entries()) {
			const left = await words(e.title, '', '', leftRoom);
			// the entries' first baselines on a regular pitch, a little more below the name
			const base = last + (j ? ENTRY_PITCH : HEAD_PITCH);
			const dx = flush ? blockL + titleW[j] / 2 : xl;
			for (const g of left.out) { push(g, dx, base, null, what); if (flush) L.at(-1).flush = true; }
			let lastBase = base + (left.out.length - 1) * NAME_LEAD;
			lowest = Math.max(lowest, base + left.b);
			if (e.stated) {
				// a stated paragraph: its chapters in a dotted box, centred on the title's first line
				const g = (await insets([e.list], what)).out[0];
				const mid = base + (left.out[0].box.t + left.out[0].box.b) / 2;
				const dy = mid - (g.dotted.t + g.dotted.b) / 2;
				dotted(S, shift(g.dotted, xr, dy), `the dotted box of "${e.list}" in ${what}`);
				push(g, xr, dy, { ...shift(g.dotted, xr, dy), what: `the dotted box of "${e.list}" in ${what}` }, what);
				lowest = Math.max(lowest, dy + g.dotted.b);
			} else for (const [q, line] of (await lines(e.list, rightRoom)).entries()) {
				const g = await placedBase(`\\text{${line}}`, 0, 0, DIM);
				push(g, xr, base + q * LIST_LEAD, null, what);
				lastBase = Math.max(lastBase, base + q * LIST_LEAD);
				lowest = Math.max(lowest, base + q * LIST_LEAD + g.box.b);
			}
			last = lastBase;
		}
		const b = lowest + PAD_Y;
		const box = { l: x0, r: x0 + W, t, b, m: (t + b) / 2, name: title };
		frame(box.l, box.r, t, b, what);
		for (const g of L.filter((g) => g.within === what && !g.inside)) g.inside = { l: x0, r: x0 + W, t, b, what };
		if (flagged) flag(S, [box.r + FLAG.off, box.m], what);
		boxes.push(box);
		top = b + ROW_GAP;
		return box;
	};
	await listBox(CONCLUSION_NAME, PARAGRAPHS.map(([title, list], j) => ({ title, list, stated: statedParas[j] })), 'the Conclusion\'s box', true);
	await listBox(OPEN_NAME, PROBLEMS.map(([title, , list]) => ({ title, list, stated: false })), 'the problems\' box', false, true);

	// ---- the arrows of the reading order: down the column, under the words ------------------------------------------
	for (let k = 0; k + 1 < boxes.length; k++) {
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
		for (const g of cset.out) push(g, dx, dy, { ...K, what: 'the last box' }, 'the last box');
		check(near2(dy + cset.t - K.t, K.b - dy - cset.b), 'the words of the last box are not centred in it');
	}
	const feeders = feederNames.map((n) => boxes.find((b) => b.name === n));
	check(feeders.every(Boolean), 'a box the capstone uses is missing');
	feeders.sort((a, b) => a.t - b.t);
	const yb = K.t - TURN;
	check(yb - boxes.at(-1).b >= 3.5, 'the bus runs too near the last row');
	const xb = x0 - OUT, xin = x0 + IN;
	for (const b of feeders) S.path([[b.l - STROKE / 2, b.m], [xb, b.m]], { color: DIM, width: HAIR, cap: 'butt', what: `the line from "${b.name}"` });
	// R13's bits: a stub above the column, its grey name at the column's left, a line from it to the bus
	const ys = boxes[0].t - STUB_UP;
	const stub = await placed(STUB, x0 + 4, ys, 0, 0.5, DIM);
	L.push({ ...stub, on: [] });
	S.path([[stub.box.l - LABEL_GAP - 0.3, ys], [xb, ys], [xb, yb], [xin, yb]], { color: DIM, width: HAIR, cap: 'butt', what: 'the bus' });
	check(boxes[0].t - stub.box.b >= LABEL_GAP + 1, 'R13\'s stub sits on the first box');
	const ar = S.arrow([xin, yb], [xin, K.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: 'the bus\'s last leg' });
	check(ar.head === HEAD, 'the bus\'s last leg is too short for a whole head');
	check(xl - xin >= 30, 'the bus enters the last box too near the column\'s arrows');

	// ---- checks: every label inside its box clears the box's edges, centred left and right --------------------------
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		if (g.tag || g.flush) continue;
		const cx = (g.box.l + g.box.r) / 2;
		if (what.startsWith('the dotted box') || what === 'the last box') check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
		else check([xl, xr, x0 + W / 2].some((c) => Math.abs(cx - c) < 0.02), `the label ${g.src} is not centred in a part of ${what}`);
	}
	// the tags clear the hatched corners' hypotenuse and the dotted boxes
	for (const g of L.filter((g) => g.tag)) check(g.box.r <= x0 + W - EAR - LABEL_GAP, `the tag of ${g.within} runs into its corner`);
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within] : [])] : (g.on ?? []);
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadXivXvMap = { W, nums, boxes, last: K, drawn, rows: ins.map((i) => i.rows ?? 0), lists: sets.map((s) => s.out.filter((g) => g.role === 'chapters').length) };
	return finishTall(S, L, [340, 360]);
}

const near2 = (a, b) => Math.abs(a - b) < 0.02;

/** Where an SVG has ink: the kit's measure (tut-pot-lib.js), on the taller page. */
async function inkOf(svg, w, h) {
	const img = new Image();
	img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
	await img.decode();
	const c = document.createElement('canvas');
	c.width = Math.ceil(w * K_INK); c.height = Math.ceil(h * K_INK);
	const ctx = c.getContext('2d');
	ctx.drawImage(img, 0, 0, c.width, c.height);
	const a = ctx.getImageData(0, 0, c.width, c.height).data;
	let l = Infinity, r = -1, t = Infinity, b = -1;
	for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (a[(y * c.width + x) * 4 + 3] > 8) {
		if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
	}
	return { l: l / K_INK, r: (r + 1) / K_INK, t: t / K_INK, b: (b + 1) / K_INK };
}

/** The kit's finish (tut-pot-lib.js) on the taller page: cropped to the ink with the margin M on every side. */
async function finishTall(sheet, labels, width) {
	const raw = await figure(TALL, TALL, [sheet.P], labels.map((l) => Promise.resolve(l.svg)));
	const ink = await inkOf(raw, TALL, TALL);
	check(ink.l > 1 && ink.t > 1 && ink.r < TALL - 1 && ink.b < TALL - 1, 'the ink reaches the provisional page\'s edge');
	const W = n2(ink.r - ink.l + 2 * M), H = n2(ink.b - ink.t + 2 * M);
	const [head, rest] = [raw.slice(0, raw.indexOf('</defs>') + 7), raw.slice(raw.indexOf('</defs>') + 7, raw.lastIndexOf('</svg>'))];
	const svg = head.replace(/width="[^"]*" height="[^"]*" viewBox="[^"]*"/, `width="${W}pt" height="${H}pt" viewBox="0 0 ${W} ${H}"`) +
		`<g transform="translate(${n2(M - ink.l)},${n2(M - ink.t)})">${rest}</g></svg>`;
	const out = await inkOf(svg, W, H);
	const tol = 1.5 / K_INK + 0.01;
	check(near(out.l, M, tol) && near(out.t, M, tol) && near(W - out.r, M, tol) && near(H - out.b, M, tol),
		`the margins are not equal: ${[out.l, out.t, W - out.r, H - out.b].map((v) => v.toFixed(2)).join(', ')}`);
	check(W >= width[0] && W <= width[1], `the width ${W} pt is outside ${width.join('–')} pt`);
	window[name] = { W, H, margins: [out.l, out.t, W - out.r, H - out.b].map(n2), shift: [n2(M - ink.l), n2(M - ink.t)] };
	return svg;
}
const shift = (b, dx, dy) => ({ l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy });

/** A label's TeX: text, with any $...$ set in maths. */
function textOf(s) {
	return s.split(/(\$[^$]*\$)/).filter(Boolean).map((p) => (p.startsWith('$') ? p.slice(1, -1) : `\\text{${p}}`)).join('');
}

/** The hatched corner: a right triangle at a box's top right, its legs EAR along the top and down the side, hatched as
 * R10's boxes (45 degrees, rising to the right, in the rule's grey) and cut off by a grey hairline. */
function ear(S, { r, t }, what) {
	const step = HATCH_STEP * Math.SQRT2;            // along x, for lines HATCH_STEP apart
	const d = [];
	for (let c = r - EAR + step / 2; c < r + EAR; c += step) {
		const xa = (r + c - EAR) / 2, xc = Math.min(c, r);
		if (xc - xa < 0.3) continue;
		d.push(`M${n2(xa)},${n2(t + c - xa)}L${n2(xc)},${n2(t + c - xc)}`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${RULE}" stroke-width="${HATCH}" stroke-linecap="butt" fill="none"/>`, 0.5);
	S.path([[r - EAR, t], [r, t + EAR]], { color: DIM, width: HAIR, cap: 'butt', layer: 0.6, what: `the hatched corner of ${what}` });
	S.mark([[r - EAR, t], [r, t], [r, t + EAR], [r - EAR, t]], 0, `the hatched corner of ${what}`);
}

/** A small flag in the margin: an ink staff rising from the point q, a filled pennant at its top pointing right. */
function flag(S, q, what) {
	const [x, y] = q, top = y - FLAG.staff / 2, foot = y + FLAG.staff / 2;
	S.raw(`<path d="M${n2(x)},${n2(foot)}V${n2(top)}" stroke="${INK}" stroke-width="${FLAG.width}" stroke-linecap="butt" fill="none"/>` +
		`<path d="M${n2(x)},${n2(top)}L${n2(x + FLAG.w)},${n2(top + FLAG.h / 2)}L${n2(x)},${n2(top + FLAG.h)}Z" fill="${INK}"/>`, 2);
	S.mark([[x, foot], [x, top]], FLAG.width / 2, `the flag of ${what}`);
	S.mark([[x, top], [x + FLAG.w, top + FLAG.h / 2], [x, top + FLAG.h], [x, top]], 0, `the flag of ${what}`);
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

/** A TeX label whose ink box has its point (ax, ay) at (x, y). */
async function placed(src, x, y, ax, ay, color) {
	const g = await tex(src, [0, 0], SIZE, 'lt', color);
	const b = boxOf(g);
	const dx = x - (b.l + ax * (b.r - b.l)), dy = y - (b.t + ay * (b.b - b.t));
	return { src, svg: `<g transform="translate(${n2(dx)},${n2(dy)})">${g}</g>`, box: { l: b.l + dx, r: b.r + dx, t: b.t + dy, b: b.b + dy } };
}
