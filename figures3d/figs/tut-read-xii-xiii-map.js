// The tutorial, reading chapter R13 (tutorial/what-a-field-keeps/reading-sections-xii-and-xiii.md), its first diagram:
// Sections XII and XIII as a map of what Parts 1 to 13 have derived. The sibling of R12's, R12b's and R11's maps
// (figs/tut-read-x-xi-map.js, figs/tut-read-xi-2-map.js, figs/tut-read-vii-map.js): the same box, type, fill, outline,
// dotted box, hatching and grey arrows, in ink and the page's greys only (the outline in ink, the fill the neutral tint
// of the page, the chapters and the dotted boxes in grey), since orange and blue mean a stretch and a squeeze. Fourteen
// boxes, one for each section of the chapter before the capstone, in its order (three for Section XII, eleven for
// Section XIII), in one column read down (one drawing serves the desktop and the phone, laid out to be read at 390 px,
// as R12's), joined in reading order by thin grey arrows. Each box carries, at its left, a short name for its section
// (the paper's paragraph where the section reads one; two names take two lines), under it the paper's equations and
// figures that the section shows or links, as the site numbers them, and under those, in grey, the chapters the
// section cites; at its right, each in a small dotted box, the results the section marks as stated in the paper, named
// by their authors where the section cites one paper, and by the result where it cites more. Two boxes carry a hatched
// corner, R12's hatching in a dog-ear at the top right, since one step of each is a sketch at depth B (the step from
// the moments to the projected body in 13.1, the closing condition on a wave of finite duration in 13.5) while the
// rest is derived. No box carries R13b's flag: the corrected paper shows what it says at the field at two times (the
// margin note on the impulses now spells out its "known push") and at the bits of a second reading (its 1300 bits
// name the cost of telling the radial powers apart). Below the column, set apart by a gap, the last box, the capstone, outlined a little heavier, with
// grey arrows into it along a bus outside the column's left side from the seven boxes whose results its table quotes.
// Departures from the diagram's comment, where the chapter's text decides: the boxes are the chapter's sections in one
// column read down, as in every reading map since R11, not two columns; each box lists every chapter its section cites
// and only those (R2 to R4 and 2.3 under Section XII's plain words, R8 and 1.7 under the bits, 2.8 under the field at
// one time, and so on), not the comment's two lists; the dotted insets are every result a section marks stated in the
// paper (nineteen): the comment's Balasin and Steinbauer are read now, derived in 13.5, so they have none, while the
// locality of sources, Spitzer's impulse approximation, the generator k^mu, the 1300 bits, Zambelli and Stringari's
// splitting and Dirac and Schwinger's brackets, which the comment leaves out, are marked stated and have one; the
// caption names the hatched corners, which the comment's caption does not.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated, its sketches at depth B, its margin note on the impulses, the ledger's sixteen equations, the capstone's
// table) and against the paper (main.aux, Sections XII and XIII's paragraphs); the boxes' sizes and places are chosen
// for the drawing.
import { tex, figure, Panel, INK, DIM, RULE } from '../lib.js';
import { Sheet, ORIGIN, M, checker, boxOf, n2, near, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-xii-xiii-map';
const check = checker(name);
const FILE = '/tutorial/what-a-field-keeps/reading-sections-xii-and-xiii.md';

// ---- the fourteen sections, in order ----------------------------------------------------------------------------
// [the section's heading, the box's name (a '|' breaks it into two lines), phrases of the section that name what the
// box is called, the chapters it cites (R2–R4 standing for "read in R2 to R4"), the results stated (the inset's words,
// the section's words in or just before the sentence that marks it), the sketch at depth B (the section's words) or
// null, the flag (the section's words where the paper says more than it shows) or null]
export const SECTIONS = [
	['Section XII\'s plain words: one reading holds a short list, and the scale from bald to hairy is short',
		'Section XII\'s plain words', ['The box\'s counts of bits are checked under *The number of bits*'], 'R2–R4, 2.3, 11.2', [
			['Yagi and Yunes\'s one per cent', '[@YagiYunes2013]']
		], null, null],
	['At one time the field holds the harmonic moments, and Einstein\'s theory fixes still less', 'The field at one time',
		['[*The field at one time*](/paper/#par:the-field-at-one-time)'], '2.5, 2.8', [
			['Donnelly and Giddings\'s free field', '[@DonnellyGiddings2017]'],
			['Corvino and Schoen\'s gluing', '[@CorvinoSchoen2006]']
		], null, null],
	['One reading holds about 1200 bits of a body and seven numbers of a black hole', 'The number of bits',
		['[*The number of bits*](/paper/#par:the-number-of-bits)'], 'R8, 1.7, 3.8', [
			['the $\\varepsilon$-entropy', '**$\\varepsilon$-entropy**'],
			['Hansen\'s moments', '[@Hansen1974]']
		], null, null],
	['Section XIII\'s plain words: the pull is first order, and the body\'s reply is second', 'Section XIII\'s plain words',
		['The plain words define **first order** and **second order**'], '1.7, 1.8, 2.6, 6.4, 13.1, 13.2, 13.3', [], null, null],
	['At two times the readings hold a bracket, and products of tides build every ripple', 'The field at two times',
		['[*The field at two times*](/paper/#par:the-field-at-two-times)'], '1.7, 2.5, 4.2, 4.5, 8.2, 13.2', [], null, null],
	['A flat camera reads the scene\'s transform on a cone at one time and inside it at two', 'The two readings as one transform',
		['[*The two readings as one transform*](/paper/#par:the-two-readings-as-one-transform)'], '13.2', [
			['Parker\'s formula', '[@Parker1973]'],
			['the locality of sources', 'the locality of sources [@GoldbergerRothstein2006a; @BianchiEtAl2025]'],
			['optical tomography', 'optical tomography [@MarkelSchotland2001; @ArridgeSchotland2009]']
		], null, null],
	['Fine detail still costs exponentially: the ambiguity goes and the blur stays', 'Stability',
		['[*Stability*](/paper/#par:stability)'], '13.2', [
			['the logarithmic stability', 'is logarithmic and cannot be better']
		], null, null],
	['Sixteen weighings read one ripple, and the weight changes by five parts in 10⁴¹', 'An impulsive tide and a weighing',
		['[*An impulsive tide and a weighing*](/paper/#par:an-impulsive-tide-and-a-weighing)'], '1.7, 4.5, 6.4, 8.2, 13.1, 13.2, 13.5, 13.6', [], null, null],
	['A passing mass reads the projected body with nothing weighed', 'A mass that passes',
		['[*A mass that passes*](/paper/#par:a-mass-that-passes)'], '1.8, 13.1, 13.3', [
			['Spitzer\'s impulse approximation', 'Spitzer\'s impulse approximation [@Spitzer1958; @BanikVanDenBosch2021]']
		], 'where the step from the moments to $\\matter\\Sigma$ is a sketch at depth B', null],
	['An impulsive wave does the same at any speed, and a particle of light kicks twice as hard', 'Impulsive waves',
		['The paragraph after the Figure carries the pass to the speed of light.'], '6.4, 6.5, 13.5', [
			['the generator $k^\\mu$', 'That $k^\\mu$ generates the wave\'s displacement'],
			['Krishnan et al.\'s ray integrals', '[@KrishnanSenapatiVashisth2020]']
		], 'The closing condition on a wave of finite duration is a sketch at depth B in 13.5.', null],
	['A second reading holds a volume\'s worth of moments, but the paper\'s bits include a price', 'The bits of a second reading',
		['[*The bits of a second reading*](/paper/#par:the-bits-of-a-second-reading)'], '13.1, 13.2, 13.3, 13.8', [
			['the 1300 bits', 'The paper\'s "$1300$ bits']
		], null, null],
	['A tide of degree m reaches m rungs of the ladder', 'What a tide of a given|degree reaches',
		['[*What a tide of a given degree reaches*](/paper/#par:what-a-tide-of-a-given-degree-reaches)'], '13.3', [
			['the triangular structure', 'The triangular structure of linearized impedance tomography']
		], null, null],
	['Two tides in either order read the flow, even a flow that shows nothing outside', 'The flow',
		['[*The flow*](/paper/#par:the-flow)'], '2.8, 13.4', [
			['Zambelli and Stringari\'s splitting', '[@ZambelliStringari1998]']
		], null, null],
	['The moments and the weight generate everything, but watching alone cannot read it', 'The algebra of the moments|and the energy',
		['[*The algebra of the moments and the energy*](/paper/#par:the-algebra-of-the-moments-and-the-energy)'], '4.2, 8.7, 13.6', [
			['Compère et al.\'s charges', '[@CompereOliveriSeraj2018]'],
			['Dirac and Schwinger\'s brackets', '[@Dirac1962; @Schwinger1963]'],
			['Marolf\'s statement', '[@Marolf2009; @Marolf2014]'],
			['Jacobson and Nguyen\'s analyticity', '[@JacobsonNguyen2019]']
		], null, null]
];
const NOT_CITED = ['0.104', '0.1041'];   // "0.0803 inside A and 0.1041 inside B", "0.080 and 0.104": numbers, not chapters
const CAPSTONE = 'The capstone: a ball and a shell read every way';
const CAPSTONE_NAME = 'The capstone: a ball and a shell read every way';
const CAPSTONE_CITES = '1.7, 1.8, 2.5, 3.8, 4.2, 6.4, 13.1, 13.2, 13.4, 13.5, 13.6';
const LEDGER = 'The ledger: Section XII\'s one equation and all fifteen of Section XIII\'s are derived';
// the boxes whose results the capstone's table quotes: [the box, the capstone's words, the box's words]
const USES = [
	['The number of bits', '| (a) one time | the paper\'s [](/paper/#eq:hair-bits) from $3R$ at $10^6$ | 1176 bits |', '$\\SNR = 10^6$, $L = 13.82$ and $H = 1176$ bits'],
	['The field at two times', '| (b) heat | $\\langle\\matter{\\dot Q_g}^2\\rangle = \\kB T\\int\\matter\\rho', 'Times $\\kB T$, it is the classical tremor'],
	['An impulsive tide and a weighing', '| (c) a push | $\\tfrac12\\epsilon^2\\int\\matter\\rho\\,\\lvert\\nabla g\\rvert^2\\,\\dd V$', 'the even part, $\\tfrac12\\epsilon^2\\int\\matter\\rho\\,|\\nabla g|^2\\,\\dd V$'],
	['Stability', 'the exponentials span only $e^{\\pi} = 23$', 'The two exponentials span $e^{|\\vect\\xi|R}$'],
	['A mass that passes', '| (e) the tonne\'s pass | $b = 1.5$ m, $V = 44\\unit{km\\,s^{-1}}$', 'The tonne\'s "five parts in $10^{33}$" is 13.1\'s $4.5 \\times 10^{-33}$, rechecked in the capstone'],
	['Impulsive waves', '| (f) light | $C = 4Gp/c^2 = 2G\\matter\\mu/V$', 'That is the pass\'s $C^2/2$ for $C = 4Gp/c^2$'],
	['The algebra of the moments|and the energy', '$0.111\\,\\matter M\\Omega R^4/c^2$.', '= 0.111\\,\\matter M\\Omega R^4/c^2$, half']
];
const LEDGER_EQS = 'hair-bits,hair-commutator,dust,calderon,scene-transform,cone,push,pass,shock,shock-even,massless-pass,ladder,ladder-identity,flow-bracket,hidden-spin,moment-bracket';
const CAPTION = 'Look first at the solid boxes: every paragraph of Sections XII and XIII rests on chapters of Parts 1 to 13, with its stated results in dotted insets. The hatched corners mark a step sketched at depth B. The last box follows one ball and one shell through seven of them.';
const POINTER = 'We read the two sections paragraph by paragraph (Figure [](#fig:read-xii-xiii-map)).';
// the reading chapters cited, and their files, for their parts
const READING = { R2: 'outside/reading-section-iv-1', R3: 'noise/reading-section-iv-2', R4: 'response/reading-section-iv-3', R8: 'quantum/reading-the-quantum-limits' };

// ---- the drawing (figure points, y down); the type, strokes and kit of R12's map -----------------------------------
const SIZE = 8.5;                 // every label
const W = 335;                    // the column's width: R12's
const LZ = 142;                   // the left part of a box, where its name, numbers and chapters stand
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NAME_LEAD = 10.2;           // between the two lines of a long name
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const LIST_LEAD = 10.2;           // between the two lines of a long list of chapters
const LIST_AIR = 8;               // a list of chapters breaks before it comes nearer the box's side than this, and INSIDE
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
const EAR = 11;                   // the hatched corner: the legs of its triangle, along the top and down the right side
const FLAG = { off: 4, staff: 11, w: 5.2, h: 4.4, width: 0.5 };  // the flag: its staff this far right of the box, its height, the pennant

const TALL = 1200;                // the provisional page, points, before the figure is cropped to its ink
const K_INK = 8;                  // pixels per point when the ink is measured
const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	// fourteen boxes are taller than the kit's provisional page: a taller one, cropped to the ink as the kit's finish
	S.P = new Panel({ x: 0, y: 0, w: TALL, h: TALL, scale: 1 });
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch(FILE)).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 16 && heads[14] === CAPSTONE && heads[15] === LEDGER, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first fourteen sections, in order');
	// a section's text, with the footnotes' marks taken out (the notes themselves follow the last section); and raw
	const rawSection = (i) => text.split(/^## .*$/m)[i + 1].split(/^\[\^\w+\]:/m)[0].replace(/\s+/g, ' ');
	const sectionText = (i) => rawSection(i).replace(/\[\^\w+\]/g, '');
	const ledger = sectionText(15);
	const capstone = sectionText(14);
	// the chapters a section cites: every way the chapter names one, and every parenthesis that holds only chapters
	// a number followed by a unit, or set in math, is a quantity, not a chapter ("from 26.3 km")
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d|\\s*(?:%|°|×|\'\'|\\\\|(?:km|kg|cm|mm|nm|m|s|K|per|GHz|MHz|kHz|Hz|eV|keV|MeV|GeV|pc|kpc|Mpc|ly|au|AU|J|W|yr|years?|days?|times|bits?)(?![A-Za-z])))';
	const citesOf = (sec) => {
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with|and|read in) \\[?${C}`])
			for (const m of sec.matchAll(new RegExp(re, 'g'))) if (!NOT_CITED.includes(m[1])) out.add(m[1]);
		for (const m of sec.matchAll(/\(([^()]*)\)/g)) {
			const items = m[1].split(/,\s*/);
			if (items.length > 1 && items.every((x) => /^(R\d+b?|\d+\.\d+)$/.test(x))) items.forEach((x) => out.add(x));
		}
		// "read in R2 to R4": the three reading chapters of Section IV
		if (/read in R2 to R4/.test(sec)) { out.delete('R2'); out.add('R2–R4'); }
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + parseInt(c.slice(1), 10) : Number(c));
	const sorted = (xs) => [...xs].sort((a, b) => order(a) - order(b));
	const sentences = (sec) => sec.split(/(?<=\.)\s+(?=[A-Z"\[*])/);
	// the ledger's sixteen equations, in order
	const ledgerRows = text.split(/^## .*$/m)[16].split('\n').filter((x) => x.startsWith('| [](/paper/#eq:'));
	const ledgerEqs = ledgerRows.flatMap((row) => [...row.split(' | ')[0].matchAll(/\[\]\(\/paper\/#eq:([\w-]+)\)/g)].map((m) => m[1]));
	check(ledgerEqs.join() === LEDGER_EQS && ledgerRows.length === 11, `the ledger's equations ${ledgerEqs}`);
	check(LEDGER.includes('all fifteen of Section XIII\'s') && ledgerEqs.length === 16, 'the ledger does not hold one and fifteen equations');
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	check(SECTIONS.every((_, k) => !refsOf(sectionText(k), 'tab').length), 'a section links a table');
	const shown = SECTIONS.map((_, k) => [...sectionText(k).matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1])).flat();
	check(shown.join() === LEDGER_EQS, `the sections show the equations ${shown}`);
	check(eqsOf.map((e) => e.join('+')).join() === ',split,hair-bits+capacity,,hair-commutator+sum-rule+dust+calderon+split,scene-transform+cone,,push,pass,shock+shock-even+massless-pass,,ladder+ladder-identity,flow-bracket+hidden-spin,moment-bracket+hidden-spin', `the equations the boxes hold ${eqsOf.map((e) => e.join('+'))}`);
	check(figsOf.map((f) => f.join('+')).join() === ',,hair,,same-outside,two-readings,,,passing,,,ladder,hidden-flow,', `the figures ${figsOf.map((f) => f.join('+'))}`);
	// a result stated in the paper
	const statedMark = (m) => m.includes('*stated in the paper*');
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		for (const p of s[2]) check(sec.includes(p), `the section "${s[0]}" does not name ${p}`);
		// the chapters cited, and only those
		check(sorted(citesOf(sec)).join(', ') === s[3], `the section "${s[0]}" cites ${sorted(citesOf(sec))}, the box lists ${s[3]}`);
		// the results stated: every sentence that marks one is named by an inset (a sentence "Both are" by the two
		// before it), and every inset's words stand in or just before a sentence so marked
		const ss = sentences(sec);
		const windows = ss.map((m, j) => (statedMark(m) ? (m.startsWith('Both are') ? ss.slice(Math.max(0, j - 2), j + 1).join(' ') : m) : null)).filter(Boolean);
		for (const w of windows) check(s[4].some(([, words]) => w.includes(words)), `the section "${s[0]}" states a result no inset shows: ${w}`);
		for (const [, words] of s[4]) check(windows.some((w) => w.includes(words)), `the inset "${words}" of "${s[0]}" is not marked stated`);
		check(!/\*stated\*|\(stated\)/.test(sec), `the section "${s[0]}" has another kind of stated mark`);
		check(!sec.includes('*derived here*'), `the section "${s[0]}" derives a step here`);
		// a hatched corner only where the section rests on a sketch at depth B
		check(sec.includes('depth B') === Boolean(s[5]) && (!s[5] || sec.includes(s[5])), `the section "${s[0]}" and depth B`);
		// a flag only where the chapter says the paper says more than it shows
		check(!s[6] || rawSection(k).includes(s[6]), `the flag of "${s[0]}"`);
	}
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 19, 'the insets are not nineteen');
	check(SECTIONS.filter((s) => s[5]).length === 2 && SECTIONS.filter((s) => s[6]).length === 0 && !CAPTION.includes('flag'), 'not two hatched corners and no flags');
	// the two sketches: 13.1's step to the projected body, 13.5's wave of finite duration
	check(sectionText(8).includes('([13.1](/tutorial/what-a-field-keeps/push-and-pass/#the-passers-loss-of-energy-holds-every-moment-of-the-projected-body), where the step from the moments to $\\matter\\Sigma$ is a sketch at depth B)'), 'the pass\'s sketch is not 13.1\'s');
	// no flags: the margin note on the impulses spells out the paper's "known push" and no longer qualifies it, and the
	// 1300 bits are the paper's own computation, stated, with no price left unmentioned
	const note = text.match(/^\[\^twotimes\]:([\s\S]*?)(?=^\[\^)/m)?.[1].replace(/\s+/g, ' ') ?? '';
	check(note.includes('is whatever supplies the impulses'), 'the margin note on the impulses');
	check(flat.includes('The Introduction\'s last bullet, whose "under a known push" the margin note on the impulses spells out.'), 'the paper box does not name the margin note on the impulses');
	check(flat.includes('except the 1300 bits, which come from the paper\'s own computation') && !/unmentioned price|says more than it shows:|which the text does not show/.test(flat.split('](tut-read-xii-xiii-map)')[1]), 'the 1300 bits are not the paper\'s own, or a remark on the paper\'s saying more is left');
	// the capstone: its chapters (the table's last column) and the boxes it uses
	const capCites = new Set();
	const capRows = [...capstone.matchAll(/\| \(([a-z])\) [^|]*\|[^|]*\|[^|]*\|[^|]*\|([^|]*)\|/g)];
	check(capRows.map((m) => m[1]).join('') === 'abcdefg', `the capstone's rows ${capRows.map((m) => m[1])}`);
	for (const m of capRows) for (const c of m[2].split(',').map((x) => x.trim())) if (/^(R\d+b?|\d+\.\d+)$/.test(c)) capCites.add(c);
	check(sorted(capCites).join(', ') === CAPSTONE_CITES, `the capstone's table cites ${sorted(capCites)}`);
	check(capstone.includes('The capstone follows chapter 13.1\'s steel ball, 1 m across and 4110 kg, and a thin shell'), 'the capstone does not follow one ball and one shell');
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(k >= 0 && capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 7 && CAPTION.includes('seven of them'), 'the capstone does not use seven boxes');
	check(/requires: \['1\.4', '1\.7', '1\.8', '2\.3', '2\.5', '2\.6', '2\.8', '3\.8', '4\.2', '4\.5', '6\.4', '6\.5', '8\.2', '8\.7', '11\.2', '13\.1', '13\.2', '13\.3', '13\.4', '13\.5', '13\.6'\]/.test(md), 'the chapter\'s requirements');
	// the parts the cited chapters belong to: 1 to 13
	const cited = new Set(SECTIONS.flatMap((s) => s[3].split(', ')).flatMap((c) => (c === 'R2–R4' ? ['R2', 'R3', 'R4'] : [c])));
	const parts = new Set();
	for (const c of cited) {
		if (!c.startsWith('R')) { parts.add(Number(c.split('.')[0])); continue; }
		const front = await (await fetch(`/tutorial/${READING[c]}.md`)).text();
		check(front.includes(`\nid: ${c}\n`), `${READING[c]} is not ${c}`);
		parts.add(Number(front.match(/\npart: '(\d+)'/)[1]));
	}
	check(Math.min(...parts) === 1 && Math.max(...parts) === 13 && CAPTION.includes('Parts 1 to 13'), `the parts cited ${[...parts]}`);
	// the caption and the pointer, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-xii-xiii-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-xii-xiii-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes(POINTER), 'the chapter does not point to its map');
	// the paper's Sections XII and XIII: their paragraphs, and the numbers
	const texHair = await (await fetch('/paper/sections/11a-hair.tex')).text();
	const upTo = texHair.slice(0, texHair.indexOf('\\label{sec:hole}'));
	const paras = [...upTo.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.join() === 'The field at one time,The number of bits,The field at two times,The two readings as one transform,Stability,An impulsive tide and a weighing,A mass that passes,The bits of a second reading,What a tide of a given degree reaches,The flow,The algebra of the moments and the energy', `Sections XII and XIII's paragraphs ${paras}`);
	for (const p of paras) check(SECTIONS.some((s) => s[1].replace('|', ' ') === p), `no box is named for the paragraph ${p}`);
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:hair') === 'XII' && auxNumber('sec:second-order') === 'XIII', 'the sections are not XII and XIII');
	const numsOf = (eqs, figs) => [...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k]));
	check(!nums.join().includes('undefined'), `an equation or figure without a number: ${nums}`);

	// ---- measuring ---------------------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const leftRoom = LZ - 2 * INSIDE;
	const rightRoom = W - LZ - 2 * RIGHT_AIR;
	// a list on as few lines as fit, the lines as even as the commas allow
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
		for (const [j, line] of nm.split('|').entries()) {
			y += j ? NAME_LEAD : 0;
			out.push({ ...(await placedBase(textOf(await fits(line, room)), 0, y, INK)), role: 'name' });
		}
		if (numbers) for (const [j, line] of (await lines(numbers, room)).entries()) {
			y += j ? NAME_LEAD : NUM_PITCH;
			out.push({ ...(await placedBase(textOf(line), 0, y, INK)), role: 'numbers' });
		}
		for (const [j, line] of (await lines(list, room - LIST_AIR)).entries()) {
			y += j ? LIST_LEAD : LIST_PITCH;
			out.push({ ...(await placedBase(`\\text{${line}}`, 0, y, DIM)), role: 'chapters' });
		}
		return { out, t: Math.min(...out.map((g) => g.box.t)), b: Math.max(...out.map((g) => g.box.b)) };
	};
	// the ink's extent of every stated result's words, together: one height for every dotted box
	const INSET_INK = { t: Infinity, b: -Infinity };
	for (const s of SECTIONS) for (const [w] of s[4]) {
		const g = await placedBase(textOf(w), 0, 0, DIM);
		INSET_INK.t = Math.min(INSET_INK.t, g.box.t); INSET_INK.b = Math.max(INSET_INK.b, g.box.b);
	}
	// the dotted boxes in rows, in the section's order, as many to a row as fit, each row centred about x = 0, the
	// first row's top at y = 0
	const insets = async (stated, what) => {
		const out = [], dots = [];
		if (!stated.length) return { out, dots, t: 0, b: 0 };
		const probes = [];
		for (const w of stated) probes.push(await placedBase(textOf(w), 0, 0, DIM));
		const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
		const h = INSET_INK.b - INSET_INK.t + 2 * LATER_PAD[1];
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
				const box = { l: x, r: x + ws[j], t: top, b: top + h };
				const g = await placedBase(textOf(stated[j]), (box.l + box.r) / 2, (box.t + box.b) / 2 - (INSET_INK.t + INSET_INK.b) / 2, DIM);
				out.push({ ...g, dotted: box, words: stated[j] });
				dots.push({ box, what: `the dotted box of "${stated[j]}" in ${what}` });
				x += ws[j] + LATER_GAP;
			}
			top += h + LATER_GAP;
		}
		return { out, dots, t: 0, b: top - LATER_GAP, rows: rows.length };
	};
	const sets = [], ins = [];
	for (const [k, s] of SECTIONS.entries()) {
		sets.push(await words(s[1], nums[k], s[3], leftRoom));
		ins.push(await insets(s[4].map((x) => x[0]), `box ${k + 1}`));
	}

	// ---- the boxes, one column, each as tall as the taller of its two parts -------------------------------------------
	const x0 = ORIGIN - W / 2;
	const xl = x0 + LZ / 2, xr = x0 + LZ + (W - LZ) / 2;       // the centres of a box's two parts
	const boxes = [];
	let top = 40;
	for (const [k, s] of SECTIONS.entries()) {
		const set = sets[k], inset = ins[k];
		const h = Math.max(set.b - set.t, inset.b - inset.t) + 2 * PAD_Y;
		const l = x0, r = x0 + W, t = top, b = top + h, m = (t + b) / 2;
		const what = `box ${k + 1}`;
		boxes.push({ l, r, t, b, m, name: s[1] });
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 0, what, solid: false });
		// a step sketched at depth B: R12's hatching in a dog-ear at the top right, cut off by a grey hairline
		if (s[5]) {
			check(h / 2 >= EAR + 3, `the hatched corner of ${what} reaches the box's middle`);
			ear(S, { r, t }, what);
		}
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
		// where the paper says more than it shows: a flag in the margin at the right, level with the box's middle
		if (s[6]) flag(S, [r + FLAG.off, m], what);
		// the words, centred in the left part; the dotted boxes, centred in the right part; both centred top to bottom
		const dy = m - (set.t + set.b) / 2;
		for (const g of set.out)
			L.push({ src: g.src, svg: `<g transform="translate(${n2(xl)},${n2(dy)})">${g.svg}</g>`, box: shift(g.box, xl, dy), inside: { l, r: x0 + LZ, t, b, what }, within: what });
		check(near2(dy + set.t - t, b - dy - set.b) && dy + set.t - t >= PAD_Y - 0.01, `the words of ${what} are not centred in it`);
		if (inset.out.length) {
			const iy = m - (inset.t + inset.b) / 2;
			for (const d of inset.dots) dotted(S, shift(d.box, xr, iy), d.what);
			for (const g of inset.out) {
				const box = shift(g.dotted, xr, iy);
				L.push({ src: g.src, svg: `<g transform="translate(${n2(xr)},${n2(iy)})">${g.svg}</g>`, box: shift(g.box, xr, iy), inside: { ...box, what: `the dotted box of "${g.words}" in ${what}` }, within: what });
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
	check(feeders.every(Boolean), 'a box the capstone uses is missing');
	feeders.sort((a, b) => a.t - b.t);
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
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within] : [])] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadXiiXiiiMap = { W, nums, boxes, last: K, drawn, rows: ins.map((i) => i.rows ?? 0), lists: sets.map((s) => s.out.filter((g) => g.role === 'chapters').length) };
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
	// each line rises to the right, y - t = c - x, and crosses the top at x = c (beyond r, it enters by the side); in
	// the triangle x <= r, y >= t and (r - x) + (y - t) <= EAR, so it runs from x = (r + c - EAR) / 2 to min(c, r)
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
