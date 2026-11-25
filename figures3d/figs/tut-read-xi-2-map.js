// The tutorial, reading chapter R12b (tutorial/sky/reading-section-xi-2.md), its first diagram: the second half of
// Section XI as a map of what Parts 2 to 13 have derived. The sibling of R12's, R11's and R10's maps
// (figs/tut-read-x-xi-map.js, figs/tut-read-vii-map.js, figs/tut-read-vi-map.js): the same box, type, fill, outline,
// dotted box and grey arrows, in ink and the page's greys only (the outline in ink, the fill the neutral tint of the
// page, the chapters and the dotted boxes in grey), since orange and blue mean a stretch and a squeeze. Eight boxes, one
// for each section of the chapter before the capstone, in its order, in one column read down (one drawing serves the
// desktop and the phone, laid out to be read at 390 px, as R12's), joined in reading order by thin grey arrows. Each
// box carries, at its left, a short name for its section (the paper's paragraph where the section reads one; the
// falling camera's section reads three, and its name takes two lines), under it the paper's equations and figures that
// the section shows or links, as the site numbers them, and under those, in grey, the chapters the section cites, with
// "derived here" where the chapter derives a step itself (R11's and R10's mark): the cone under the fast pixel and the
// delay's slope under the transparent Sun. At its right, each in a small dotted box, the results the section marks as
// stated in the paper, named by their authors where the section cites one or two. Every
// box is filled: no section rests on a sketch at depth B. Below the column, set apart by a gap, the last box, the
// capstone, outlined a little heavier, with grey arrows into it along a bus outside the column's left side from the
// four boxes whose results its table uses: A primordial graviton background (the 0.905 K of (a), the far count and
// wavelength of (b)), The hole against the glow (the 0.929 K of (a), the Hawking temperature of (c), the 7.27 degrees
// of (d), the ring of (e), the thermometer of (h)), The bookkeeping and spin ((f)'s depths, (g)'s 10.3 times at
// 43.6 GHz) and The falling camera ((d)'s 5.80 degrees, (i)'s 2 per mode).
// Departures from the diagram's comment, where the chapter's text decides: the boxes are the chapter's sections, as in
// every reading map, in one column read down, not nine columns; the plain words have no box, since the chapter reads
// them where they return; the solid boxes are the sections, not one box per chapter, and the chapters stand in grey in
// each section's box, every chapter its section cites and only those (R10b and 10.1 under the glow, R11 and 11.3
// under the four properties, 11.4 and 11.1 under the bookkeeping, R11 and 5.3 under the Sun); the boxes carry no tick
// for checked here, as R11's and R12's do not, and "derived here" stands with the chapters, as in R11's and R10's maps,
// not in hatched boxes (the hatching means a sketch at depth B); the dotted insets are every result a section marks
// stated in the paper, or stated with a source in the paper's references (fourteen, among them Vagnozzi and Loeb's
// test, Planck's speed, the parts growing without limit, Vilenkin's wedge, the weighing and the eclipses, Peters's
// cross-section and Vallée's signal), while the results the chapter marks stated as a chapter states them (the
// spinning hole's temperature as in 11.3, the Shapiro delay in 11.1, the factor as in R11) rest on chapters the box
// already lists, and the standard solar model's density is a side remark, so they have none (the comment's Shapiro
// delay among them); the capstone uses four boxes, not three, since its (a) and (b) take the glow's 0.905 K, count
// and wavelength, so the caption says four; the chapters cited reach back to 2.8 and 5.3, and forward to 13.5 (the
// shock's profile), so the caption says Parts 2 to 13, not 6 to 12.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraphs each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated or derived here, the ledger's equation, the capstone's table) and against the paper (main.aux, Section
// XI's paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-xi-2-map';
const check = checker(name);

// ---- the eight sections, in order (tutorial/sky/reading-section-xi-2.md) --------------------------------------------
// [the section's heading, the box's name (a '|' breaks it into two lines), phrases of the section that name what the box
// is called, the chapters it cites, the results stated (the inset's words, the section's words that name the result),
// derived here]
export const SECTIONS = [
	['A glow from the start would be at 0.905 K and outshine every other graviton sky', 'A primordial graviton background',
		['Gravitons "stop interacting near the Planck temperature"', '{{paper eq:graviton-temperature}}'], 'R10b, 10.1, 12.2', [
			['Vagnozzi and Loeb\'s test', '[@VagnozziLoeb2022]'],
			['pulsar timing\'s $10^{-8}$', '[@NANOGrav2023]']
		], false],
	['The glow has a dipole and the light\'s large spots, lenses leave it uniform, and only holes darken it', 'The glow\'s four properties',
		['*It has a dipole from our motion.*', '*It shares the large spots.*', '*Lensing leaves its uniform part unchanged*', '*Only black holes cast shadows on it*'],
		'R11, 6.3, 11.3, 12.2', [
			['Planck\'s $370\\,\\mathrm{km\\,s^{-1}}$', '[@Planck2018I]'],
			['the spots scale by scale', 'The agreement scale by scale']
		], false],
	['Seen from rest near the hole, the shadow is 7.3° in radius and the sky 2.6% warmer', 'The hole against the glow',
		['{{paper fig:black-hole}}', 'The figure\'s "exact rays of the Schwarzschild metric"'], '11.1, 11.3', [], false],
	['Mode by mode a hole returns the sky changed by its share, and spin can make it bright', 'The bookkeeping and spin',
		['*The bookkeeping.*', 'its **superradiance**'], '11.1, 11.2, 11.3, 11.4', [
			['Teukolsky and Press\'s gains', '[@TeukolskyPress1974]']
		], false],
	['A falling camera sees a smaller shadow, and a fast pixel sees every scene as a wave', 'A falling camera, a fast pixel|and counting coincidences',
		['[*A freely falling camera*](/paper/#par:a-freely-falling-camera)',
			'[*Through a room at nearly the speed of light*](/paper/#par:through-a-room-at-nearly-the-speed-of-light)',
			'[*Counting coincidences*](/paper/#par:counting-coincidences)'], 'R8, 6.3, 8.5, 9.3, 9.4, 11.1, 13.5', [
			['unbounded $\\mathcal{E}$ and $\\mathcal{B}$', 'both grow without limit is *stated in the paper*'],
			['Aichelburg and Sexl\'s shock', '[@AichelburgSexl1971]']
		], true],
	['A cosmic string is invisible to every pixel and shows only against what lies behind', 'A cosmic string',
		['[*A cosmic string*](/paper/#par:a-cosmic-string)'], '12.2', [
			['Vilenkin\'s wedge', '[@Vilenkin1981]']
		], false],
	['The transparent Sun focuses only waves above 8 kHz', 'The transparent Sun as a lens',
		['[*The transparent Sun as a lens*](/paper/#par:the-transparent-sun-as-a-lens)'], 'R11, 5.3, 11.1, 12.1, 12.2', [
			['weighing the interior', 'Weighing the interior this way'],
			['neutron stars\' eclipses', 'eclipses of turning neutron stars'],
			['Patla and Nemiroff\'s 23.5 AU', '[@PatlaNemiroff2008]']
		], true],
	['Matter scatters almost nothing, so every picture is emitted, pulled or yielded', 'Scattering, earthquakes and tails',
		['[*Scattering, earthquakes and tails*](/paper/#par:scattering-earthquakes-and-tails)'], '2.8, 7.3, 7.5, 7.8', [
			['Peters\'s cross-section', '[@Peters1976]'],
			['Vall\\\'ee\'s prompt signal', '[@Vallee2017]'],
			['the tail', '[@DeWitt1960; @BlanchetDamour1992]']
		], false]
];
const NOT_CITED = ['0.29', '1.23', '2.05'];   // "0.54 and 0.29", "and 1.23 times", "from 2.05 to 200": numbers, not chapters
// the results the chapter marks stated without a source in the paper's references: as a chapter states them (the
// spinning hole's temperature, the Shapiro delay, the point lens's factor), or the standard solar model's density, a
// side remark: [the section, its words]
const STATED_IN_CHAPTERS = [
	[3, 'is lower by the same factor (*stated*, as in [11.3]'],
	[6, '(*stated in chapter [11.1]'],
	[6, 'some $150\\unit{g\\,cm^{-3}}$ against 76 (stated)'],
	[6, '(*checked here*; the factor stated, as in R11)']
];
const CAPSTONE = 'The capstone: a black hole against the first light';
const CAPSTONE_NAME = 'The capstone: a black hole against the first light';
const CAPSTONE_CITES = 'R8, 6.3, 8.5, 10.1, 11.1, 11.2, 11.3, 12.2';
const LEDGER = 'The ledger: with R12, three of Section XI\'s five equations are derived';
// the boxes the capstone uses: [the box, the capstone's words (its table and the line under it), the box's words]
const USES = [
	['A primordial graviton background', '| (a) the sky | $T_g = (3.91/106.75)^{1/3}T_\\gamma$', 'So $T_g = 0.3321\\times2.7255 = 0.905$ K'],
	['A primordial graviton background', '8.0% above the far $3.59\\times10^{14}$', '$3.59\\times10^{14}$ gravitons per second'],
	['The hole against the glow', '0.905 K; 0.929 K | 12.2, 11.1 |', 'the caption\'s "$0.929\\,\\mathrm K$"'],
	['The hole against the glow', '| (c) the hole | $T_H = \\hbar c^3/8\\pi G\\matter M\\kB$', 'The hole\'s Hawking temperature, $T_H = \\hbar c^3/8\\pi G\\matter M\\kB$'],
	['The hole against the glow', '| (d) the shadow | at (a)\'s $r$, 11.1\'s arcsine', '$7.27°$ at $r = 40\\,G\\matter M/c^2$'],
	['The hole against the glow', '| (e) the ring | the ray that turns through 180° | $20.2°$', 'arrives $20.2°$ from the hole'],
	['The hole against the glow', '| (h) how deep | (a) read backwards', 'the camera\'s thermometer reads how deep it sits'],
	['The bookkeeping and spin', '| 93%; 82% | 11.3, here |', 'and counted in gravitons 82%'],
	['The bookkeeping and spin', '$x = 0.92$: 43.6 GHz | 10.3 times the sky |', '$x = 0.92$ is 43.6 GHz'],
	['A falling camera, a fast pixel|and counting coincidences', 'falling, 6.3\'s aberration | $7.27°$; $5.80°$ falling', '$5.80°$ instead of $7.27°$'],
	['A falling camera, a fast pixel|and counting coincidences', '| (i) counting | (a)\'s thermal sky: $g^{(2)}$ per mode', 'a thermal sky gives 2 per mode']
];
const CAPTION = 'Look first at the solid boxes: every stretch of the second half of Section XI rests on chapters of Parts 2 to 13, with its stated results in dotted insets. The last box follows one hole through four of them.';
const POINTER = 'this chapter reads the rest in order, with the [plain words](/paper/#sec:vistas)\' claims where they return (Figure [](#fig:read-xi-2-map)).';
// the reading chapters cited, and their files, for their parts
const READING = { R8: 'quantum/reading-the-quantum-limits', R10b: 'glow/reading-section-ix', R11: 'black-holes/reading-section-vii' };

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

const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/sky/reading-section-xi-2.md')).text();
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
	// a result stated in the paper: marked so, or marked stated with a source in the paper's references
	const statedMark = (m) => m.includes('*stated in the paper*') || /\*stated\* \[@/.test(m);
	// the ledger's one equation
	const ledgerRows = [...text.split(/^## .*$/m)[10].matchAll(/^\| the paper's \[\]\(\/paper\/#((?:eq|tab):[\w-]+)\),/gm)].map((m) => m[1]);
	check(ledgerRows.join() === 'eq:graviton-temperature', `the ledger's rows ${ledgerRows}`);
	check(ledger.includes('| the paper\'s [](/paper/#eq:graviton-temperature), the glow\'s temperature | 12.2; *read now*, its numbers *checked here* |'), 'the ledger\'s row');
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const tabsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'tab'));
	const shown = SECTIONS.map((_, k) => [...sectionText(k).matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1])).flat();
	check(shown.join() === 'graviton-temperature', `the sections show the equations ${shown}`);
	check(eqsOf.map((e) => e.join('+')).join() === 'graviton-temperature,,,,,,,current-column', `the equations the boxes hold ${eqsOf.map((e) => e.join('+'))}`);
	check(figsOf.map((f) => f.join('+')).join() === ',,black-hole,,,,sun-lens,', `the figures ${figsOf.map((f) => f.join('+'))}`);
	check(tabsOf.every((t) => !t.length), 'a section links a table');
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		for (const p of s[2]) check(sec.includes(p), `the section "${s[0]}" does not name ${p}`);
		// the chapters cited, and only those
		check(sorted(citesOf(sec)).join(', ') === s[3], `the section "${s[0]}" cites ${sorted(citesOf(sec))}, the box lists ${s[3]}`);
		// the results stated: every sentence that marks one is named by an inset, and every inset's words are there
		const marks = sentences(sec).filter(statedMark);
		for (const m of marks) check(s[4].some(([, words]) => m.includes(words)), `the section "${s[0]}" states a result no inset shows: ${m}`);
		for (const [, words] of s[4]) check(marks.some((m) => m.includes(words)), `the inset "${words}" of "${s[0]}" is not marked stated`);
		// a stated mark without a citation is a chapter's, and is listed
		for (const m of sentences(sec).filter((x) => /\*stated[^*]*\*|\(stated\)|factor stated/.test(x) && !statedMark(x)))
			check(STATED_IN_CHAPTERS.some(([j, words]) => j === k && m.includes(words)), `the section "${s[0]}" states a result neither inset nor chapter: ${m}`);
		check(sec.includes('*derived here*') === s[5], `the section "${s[0]}" is ${s[5] ? 'not ' : ''}derived here`);
		check(!sec.includes('depth B'), `the section "${s[0]}" rests on a sketch`);
	}
	for (const [j, words] of STATED_IN_CHAPTERS) check(sectionText(j).includes(words), `the section ${j} does not say ${words}`);
	check(sectionText(4).includes('The cone is *derived here*') && sectionText(6).includes('The delay\'s slope is *derived here*'), 'the two steps derived here are not the cone and the delay\'s slope');
	check(flat.includes('*derived here* marks two steps no chapter takes'), 'the chapter does not name two steps derived here');
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 14, 'the insets are not fourteen');
	// the capstone: its chapters (the table's last column) and the boxes it uses
	const capCites = new Set();
	const capRows = [...capstone.matchAll(/\| \(([a-z])\) [^|]*\|[^|]*\|[^|]*\|([^|]*)\|/g)];
	check(capRows.map((m) => m[1]).join('') === 'abcdefghi', `the capstone's rows ${capRows.map((m) => m[1])}`);
	for (const m of capRows) for (const c of m[2].split(',').map((x) => x.trim())) if (/^(R\d+b?|\d+\.\d+)$/.test(c)) capCites.add(c);
	check(sorted(capCites).join(', ') === CAPSTONE_CITES, `the capstone's table cites ${sorted(capCites)}`);
	check(capstone.includes('A hole of ten equilibrium masses'), 'the capstone does not follow one hole');
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(k >= 0 && capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 4 && CAPTION.includes('four of them'), 'the capstone does not use four boxes');
	check(refsOf(capstone, 'eq').length === 0 && refsOf(capstone, 'fig').length === 0, 'the capstone links an equation or a figure');
	check(/requires: \['6\.3', '8\.5', '11\.1', '11\.2', '11\.3', '12\.1', '12\.2'\]/.test(md), 'the chapter\'s requirements');
	// the parts the cited chapters belong to: 2 to 13 (13.5, the shock's profile)
	const cited = new Set(SECTIONS.flatMap((s) => s[3].split(', ')));
	const parts = new Set();
	for (const c of cited) {
		if (!c.startsWith('R')) { parts.add(Number(c.split('.')[0])); continue; }
		const front = await (await fetch(`/tutorial/${READING[c]}.md`)).text();
		check(front.includes(`\nid: ${c}\n`), `${READING[c]} is not ${c}`);
		parts.add(Number(front.match(/\npart: '(\d+)'/)[1]));
	}
	check(Math.min(...parts) === 2 && Math.max(...parts) === 13 && CAPTION.includes('Parts 2 to 13'), `the parts cited ${[...parts]}`);
	// the caption and the pointer, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-xi-2-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-xi-2-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes(POINTER), 'the chapter does not point to its map');
	// the paper's Section XI: its last seven paragraphs, and the numbers
	const tex11 = await (await fetch('/paper/sections/11-vistas.tex')).text();
	const paras = [...tex11.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.slice(4).join() === 'A primordial graviton background,A freely falling camera,Through a room at nearly the speed of light,Counting coincidences,A cosmic string,The transparent Sun as a lens,Scattering, earthquakes and tails', `Section XI's paragraphs ${paras}`);
	for (const p of [paras[4], ...paras.slice(8)]) check(SECTIONS.some((s) => s[1] === p), `no box is named for the paragraph ${p}`);
	for (const p of paras.slice(5, 8)) check(sectionText(4).includes(`[*${p}*](/paper/#par:`), `the falling camera's box does not read ${p}`);
	check(flat.includes('Section XI\'s [*A primordial graviton background*](/paper/#par:a-primordial-graviton-background)'), 'the chapter does not read the primordial background');
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:vistas') === 'XI', 'the section is not XI');
	const numsOf = (eqs, figs) => [...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k]));
	check(nums.join(' | ') === '(80) |  | Fig. 38 |  |  |  | Fig. 39 | (10)', `the numbers ${nums.join(' | ')}`);

	// ---- measuring ---------------------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const leftRoom = LZ - 2 * INSIDE;
	const rightRoom = W - LZ - 2 * RIGHT_AIR;
	// a list of chapters on as few lines as fit, the lines as even as the commas allow
	const lines = async (list, room) => {
		if ((await width(list)) <= room) return [list];
		// "derived here" on a line of its own, when the chapters fit on one
		const [chapters, derived] = list.split('; ');
		if (derived && (await width(`${chapters};`)) <= room) return [`${chapters};`, derived];
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
		for (const w of stated) probes.push(await placedBase(textOf(w), 0, 0, DIM));
		const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
		// every dotted box as tall as the tallest words of the whole map, so that the rows match from box to box
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
	// the ink's extent of every stated result's words, together: one height for every dotted box
	const INSET_INK = { t: Infinity, b: -Infinity };
	for (const s of SECTIONS) for (const [w] of s[4]) {
		const g = await placedBase(textOf(w), 0, 0, DIM);
		INSET_INK.t = Math.min(INSET_INK.t, g.box.t); INSET_INK.b = Math.max(INSET_INK.b, g.box.b);
	}
	const sets = [], ins = [];
	for (const [k, s] of SECTIONS.entries()) {
		sets.push(await words(s[1], nums[k], s[5] ? `${s[3]}; derived here` : s[3], leftRoom));
		ins.push(await insets(s[4].map((x) => x[0]), `box ${k + 1}`));
	}

	// ---- the boxes, one column, each as tall as the taller of its two parts -------------------------------------------
	const x0 = ORIGIN - W / 2;
	const xl = x0 + LZ / 2, xr = x0 + LZ + (W - LZ) / 2;       // the centres of a box's two parts
	const boxes = [];
	let top = ORIGIN - 320;
	for (const [k, s] of SECTIONS.entries()) {
		const set = sets[k], inset = ins[k];
		const h = Math.max(set.b - set.t, inset.b - inset.t) + 2 * PAD_Y;
		const l = x0, r = x0 + W, t = top, b = top + h, m = (t + b) / 2;
		const what = `box ${k + 1}`;
		boxes.push({ l, r, t, b, m, name: s[1] });
		S.fill(`M${n2(l)},${n2(t)}H${n2(r)}V${n2(b)}H${n2(l)}Z`, { l, r, t, b }, { color: FILL, layer: 0, what, solid: false });
		S.path([[l, t], [r, t], [r, b], [l, b]], { color: OUTLINE, width: STROKE, closed: true, cap: 'butt', layer: 1, what });
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
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within] : [])] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadXi2Map = { W, nums, boxes, last: K, drawn, rows: ins.map((i) => i.rows ?? 0) };
	return finish(S, L, [330, 350]);
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
