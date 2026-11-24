// The tutorial, reading chapter R10 (tutorial/glow/reading-section-vi.md), its one diagram: Section VI as a map of
// what Part 10 and the parts before it have derived. The sibling of R9's and R9b's maps (figs/tut-read-viii-map.js,
// figs/tut-read-viii-2-map.js): the same box, type, fill, outline, dotted box, hatching and grey arrows, in ink and the
// page's greys only (the outline in ink, the fill the neutral tint of the page, the dotted boxes in grey), since orange
// and blue mean a stretch and a squeeze. Thirteen boxes, one for each section of the chapter before the closed furnace,
// in its order, in two columns read down, seven and six (one drawing serves the desktop and the phone, laid out to be
// read at 390 px, as R9b's), joined in reading order by thin grey arrows, with a return arrow up the gutter from the
// seventh to the eighth. Each box carries a short name for its section (the paper's paragraph where the section reads
// one), under it the paper's equations, figures and table that the section shows or links, as the site numbers them,
// under those, in grey, the chapters the section cites, with "derived here" where the chapter derives a step itself,
// and under those, each in a small dotted box, the results the section marks as stated in the paper. A box is filled
// when its section rests on derivations, and hatched, its words on a clearing of the page, when its main result rests
// on a sketch at depth B (the electrons' friction and the pairs' stress, both of 10.3). Below both columns, set apart
// by a gap, the last box, the closed furnace end to end, outlined a little heavier, with grey arrows into it from the
// six boxes whose results its steps use: along a bus outside the left column from Matter is transparent (the paper's
// (72)), The hot furnace (the scene, its weight and its caption's ratios) and Friction at the frequencies of heat (a
// weight spread over a band, the concrete's friction); straight down from Free electrons (iron's ceiling); and along a
// bus outside the right column from Driven vibrations (the glass that stands for the concrete) and Pairs of phonons
// (iron's pairs).
// Departures from the diagram's comment, where the chapter's text decides: the boxes are the chapter's sections, not
// the paper's paragraphs, so the plain words' wavelength, the image's three consequences, the hot furnace, the
// summary paragraph and the table have boxes of their own; each box lists every chapter its section cites (R5, 5.3 and
// 4.4 beside Absorption's 7.8; 10.1 beside Emission's 10.2; 4.6, 10.2 and 10.3 beside Friction's 4.4 and 4.5; and so
// on); the dotted insets are the results each section marks as stated, one for each result it names; Emission is
// solid, since its law is derived in 10.2 at full depth and only its second route is a sketch; Free electrons is
// marked "derived here" for copper's collision time; the furnace's arrows come from the six boxes its text uses,
// not from Absorption, Emission and the table.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated or derived here, the ledger's eight equations, the furnace's uses) and against the paper (main.aux,
// Section VI's paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM, RULE, PAGE } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-vi-map';
const check = checker(name);

// ---- the thirteen sections, in order (tutorial/glow/reading-section-vi.md) ----------------------------------------
// [the section's heading, the box's name, a phrase of the section that names what the box is called, the chapters
// it cites, the results stated (the inset's words, the section's words that name the result), the box's fill
// ('solid' or 'hatched', with the section's words), derived here]
export const SECTIONS = [
	['Heat glows at wavelengths of tens of micrometres', 'Plain words', 'In the [plain words](/paper/#sec:thermal)',
		'10.1', [], ['solid'], false],
	['Heat is fast enough, and a wave crossing matter fades at Hawking\'s rate', 'Absorption', '[*Absorption*](/paper/#par:absorption)',
		'R5, 4.4, 5.3, 7.8', [
			['the $10^{11}$ light-years', 'The universe\'s "$10^{11}$ light-years" is *stated in the paper*']
		], ['solid'], false],
	['A medium that absorbs must glow, by the same friction', 'Emission', '[*Emission*](/paper/#par:emission)',
		'10.1, 10.2', [
			['the plasma results', 'The plasma results and'],
			['What we add', 'and "What we add" are *stated in the paper*']
		], ['solid'], false],
	['Matter is transparent, so a pixel adds the glow along its whole line', 'Matter is transparent', '*Matter is transparent*:',
		'4.4, 5.5, 10.2', [
			['the illustrative values', 'Its values are "illustrative" (*stated in the paper*)']
		], ['solid'], false],
	['The hot furnace weighs the same, yet sends twenty-six times as many gravitons', 'The hot furnace', '{{paper fig:closed-furnace}}',
		'6.4, 10.1, 10.3', [], ['solid'], false],
	['The friction at the wave\'s frequency counts, and causality fixes its total', 'Friction at the frequencies of heat',
		'[*Friction at the frequencies of heat*](/paper/#par:friction-at-the-frequencies-of-heat)',
		'4.4, 4.5, 4.6, 10.2, 10.3', [], ['solid'], false],
	['Free electrons give copper its friction and iron a ceiling', 'Free electrons', 'In *Free electrons*',
		'4.4, 10.1, 10.3', [], ['hatched', 'derived in chapter [10.3](/tutorial/glow/why-matter-barely-glows/#free-electrons-fill-a-sphere-of-states-and-collisions-relax-a-sheared-one)* at depth B'], true],
	['A shear drives silicon\'s Raman line, every vibration of a glass and the bonds of water', 'Driven vibrations', 'In *Driven vibrations*',
		'4.1, 5.4, 10.3', [
			['Kleinman\'s weight', 'Kleinman\'s weight $M\\omega_0^2\\zeta_K^2/8a$ is *stated in the paper*'],
			['the glass and water spectra', 'The glass and water spectra are *stated in the paper*']
		], ['solid'], false],
	['Even a perfect crystal glows through pairs of phonons', 'Pairs of phonons', 'In *Pairs of phonons*',
		'10.2, 10.3', [
			['the pairs\' stress', 'In *Pairs of phonons* the stress'],
			['anharmonicity', 'Anharmonicity\'s factor of order one,'],
			['diamond\'s eighth', '"an eighth of diamond\'s glow" and'],
			['Akhiezer\'s tail', 'and Akhiezer\'s tail, with $\\tau$ a thermal phonon\'s relaxation time, are *stated in the paper*']
		], ['hatched', 'is *stated in the paper* and sketched in'], false],
	['Real materials glow at one to sixty per cent of the placeholder', 'One to sixty per cent', 'The summary paragraph\'s "one to sixty per cent"',
		'10.1, 10.3', [
			['the collision rate', 'A collision rate in proportion to $T$ [@Duthil2014] and'],
			['the factor of two', 'and the "factor of two" are *stated in the paper*']
		], ['solid'], false],
	['Each row of the table is a weight at a place', 'The table', 'The paper\'s Table [](/paper/#tab:materials)',
		'10.1, 10.2, 10.3', [
			['diamond\'s and water\'s rows', 'those of diamond and water are *stated in the paper*']
		], ['solid'], false],
	['No material can glow brighter than its weight allows', 'A bound on the glow', '[*A bound on the glow*](/paper/#par:a-bound-on-the-glow)',
		'5.5, 10.1, 10.3', [
			['the resonant bar', 'The resonant bar is *stated in the paper*']
		], ['solid'], false],
	['Ordinary bodies glow through their volume, not their surface', 'Volume and surface emission',
		'[*Volume and surface emission*](/paper/#par:volume-and-surface-emission)',
		'4.4, 10.3', [
			['surface absorption', 'that its surface does,'],
			['the surface glow', 'and its glow $\\sym{surface-power}{P_S}$, in watts,']
		], ['solid'], false]
];
const FURNACE = 'The closed furnace, from the friction of iron to a count of gravitons';
const FURNACE_NAME = 'The closed furnace, end to end';
const FURNACE_CITES = '5.5, 6.4, 10.1, 10.3';
const NOT_CITED = ['(chapter R10b)'];         // a pointer to where Section IX's budget is read, not a mark
const LEDGER = 'The ledger accounts for all eight of Section VI\'s equations';
// the boxes the furnace uses: [the box, the furnace's words, the box's words]
const USES = [
	['Matter is transparent', 'By the paper\'s [](/paper/#eq:column) the two lines read', 'the paper\'s [](/paper/#eq:column)'],
	['The hot furnace', 'We now follow the scene of the paper\'s Figure [](/paper/#fig:closed-furnace) end to end.', '{{paper fig:closed-furnace}}'],
	['The hot furnace', 'the hot block is heavier by $9.1\\times10^{-12}$ kg for each kilogram, one part in $10^{11}$ (chapter 6.4)', 'is $1.11\\times10^{-11}$ kg per megajoule (*checked here*, by chapter'],
	['The hot furnace', 'Their ratio is 16.1, the caption\'s sixteen, and without the floor 22.0, its twenty-two', 'The caption\'s sixteen and twenty-two are *checked*'],
	['Friction at the frequencies of heat', 'is $(\\pi/2)\\Delta\\matter\\mu/\\Delta\\omega = 3.44\\times10^{-4}\\unit{Pa\\,s}$', '$\\mathrm{Re}\\,\\matter\\eta \\approx (\\pi/2)\\Delta\\matter\\mu/\\Delta\\omega$'],
	['Free electrons', 'So for iron\'s ceiling, with 121 GPa,', 'and the weight is 121 GPa'],
	['Driven vibrations', 'and the concrete silica glass\'s count-equivalent friction', 'The glass and water spectra'],
	['Pairs of phonons', 'Iron\'s phonon pairs add 0.7%', 'In *Pairs of phonons*']
];
const CAPTION = 'Look first at the solid boxes: every paragraph of Section VI is derived in Part 10 or earlier, with its stated results in dotted insets. The hatched boxes rest on sketches at depth B. The last box follows one scene through six of them.';

// ---- the drawing (figure points, y down); the type, strokes and kit of R9b's map ----------------------------------
const SIZE = 8.5;                 // every label
const CW = 152;                   // a box's width: two columns and the gutter make R9b's width
const GUT = 13;                   // the gutter between the columns: the return arrow runs up its middle
const PER_COL = 7;                // the first column's boxes; the second holds the other six
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
const PAD_Y = 5.2;                // the least air above and below a box's words
const INSIDE = 2.6;               // the least air between a label and its box's sides
const LATER_PAD = [2.4, 2.3];     // a stated result's dotted box: air beside and above/below its words
const LATER_GAP = 4;              // between two stated results' boxes, side by side or one above the other
const LATER_DROP = 3.2;           // from the chapters' descender to the top of the dotted boxes
const DESC = 2.6;                 // the deepest descender of a chapter list, below its baseline (the comma)
const ROW_GAP = 11;               // between the rows of a column: room for an arrow with a whole head
const HEAD = 3.6;                 // the arrows' heads
const END_AIR = 1.2;              // an arrow's head stops this far short of the box it enters
const TURN = 11;                  // the return arrow turns this far above the eighth box; the buses this far above the last
const OUT = 6;                    // the buses run this far outside the columns
const IN = 22;                    // a bus enters the last box this far in from its side
const LAST_GAP = 16;              // from the last row to the last box
const HATCH = 0.4, HATCH_STEP = 2.4;      // the hatching: its lines and their spacing, measured across them
const CLEAR = [3, 2.4];           // a hatched box's clearing: air beside and above/below its words

const OUTLINE = INK;
const FILL = '#eeebe5';           // the neutral tint of the page (drawing.ts THEME)

export default async function () {
	const S = new Sheet(name);
	const L = [];

	// ---- the chapter, checked ---------------------------------------------------------------------------------------
	const md = await (await fetch('/tutorial/glow/reading-section-vi.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 15 && heads[13] === FURNACE && heads[14] === LEDGER, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first thirteen sections, in order');
	const sectionText = (i) => text.split(/^## .*$/m)[i + 1].replace(/\s+/g, ' ');
	const ledger = sectionText(14).split('[^')[0];
	const furnace = sectionText(13);
	// the chapters a section cites: every way the chapter names one, less the pointers that are not marks
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d)';
	const citesOf = (sec) => {
		let s = sec;
		for (const n of NOT_CITED) s = s.split(n).join(' ');
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with) \\[?${C}`])
			for (const m of s.matchAll(new RegExp(re, 'g'))) out.add(m[1]);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c));
	const listOf = (sec) => citesOf(sec).sort((a, b) => order(a) - order(b)).join(', ');
	for (const n of NOT_CITED) check(furnace.includes(n), `the furnace does not say ${n}`);
	// the ledger's eight equations, in order, and the boxes that hold them: the first that shows or links each
	const ledgerEqs = [...ledger.matchAll(/\| \[\]\(\/paper\/#eq:([\w-]+)\) \|/g)].map((m) => m[1]);
	check(ledgerEqs.length === 8 && LEDGER.includes('eight'), `the ledger's equations ${ledgerEqs}`);
	const shows = (sec, kind, l) => sec.includes(`{{paper ${kind}:${l}}}`) || sec.includes(`[](/paper/#${kind}:${l})`);
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	for (const e of ledgerEqs) {
		const k = SECTIONS.findIndex((_, j) => shows(sectionText(j), 'eq', e));
		check(k >= 0, `no section shows eq:${e}`);
	}
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const tabsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'tab'));
	check(eqsOf.flat().filter((e) => ledgerEqs.includes(e)).join() === ledgerEqs.join(), 'the boxes do not hold the ledger\'s equations in order');
	check(eqsOf.flat().join() === [...ledgerEqs.slice(0, 3), 'column', ...ledgerEqs.slice(3)].join(), `the equations the boxes hold ${eqsOf.flat()}`);
	check(figsOf.flat().join() === 'line-integral,closed-furnace,materials' && tabsOf.flat().join() === 'materials', `the figures and table shown ${figsOf.flat()} ${tabsOf.flat()}`);
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
		// hatched: its main result rests on a sketch at depth B; derived here
		if (s[5][0] === 'hatched') check(sec.includes(s[5][1]), `the section "${s[0]}" does not say ${s[5][1]}`);
		check(sec.includes('*derived here*') === s[6], `the section "${s[0]}" is ${s[6] ? 'not ' : ''}derived here`);
	}
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 16, 'the insets are not sixteen');
	check(sectionText(2).includes('*read now, derived in chapter 10.2* at depth B') && sectionText(2).includes('*read now, derived in chapter [10.2]'), 'Emission\'s law and its second route are not as read');
	check(sectionText(6).includes('$\\tau = 2.49\\times10^{-14}$ s, the paper\'s $2.5\\times10^{-14}$') && flat.includes('one short step, copper\'s collision time, is *derived here*'), 'copper\'s collision time is not derived here');
	// the furnace: its numbers, its chapters and the boxes it uses
	check(listOf(furnace) === FURNACE_CITES, `the furnace cites ${listOf(furnace)}`);
	const furnaceEqs = refsOf(furnace, 'eq'), furnaceFigs = refsOf(furnace, 'fig');
	check(furnaceEqs.join() === 'jN-friction,column' && furnaceFigs.join() === 'closed-furnace' && refsOf(furnace, 'tab').length === 0, `the furnace links ${furnaceEqs} ${furnaceFigs}`);
	for (const [box, inFurnace, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(furnace.includes(inFurnace), `the furnace does not say ${inFurnace}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 6 && CAPTION.includes('six of them'), 'the furnace does not use six boxes');
	for (const [k, s] of SECTIONS.entries()) if (!feederNames.includes(s[1])) for (const w of ['eq:column', 'fig:closed-furnace', '121 GPa', 'silica glass', 'pairs add'])
		check(!(sectionText(k).includes(w) && furnace.includes(w)) || (k === 10 && w === 'silica glass'), `the furnace uses "${w}" of "${s[1]}", which has no arrow`);
	// the opening: the chapter reads the section in order, with the four marks
	check(flat.includes('This chapter reads the section in order'), 'the chapter does not read the section in order');
	check(/requires: \['4\.4', '4\.5', '5\.4', '5\.5', '6\.4', '7\.8', '10\.1', '10\.2', '10\.3'\]/.test(md), 'the chapter\'s requirements');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-vi-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-vi-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes('This chapter reads the section in order (Figure [](#fig:read-vi-map)).'), 'the chapter does not point to its map');
	// the paper's Section VI: its paragraphs and numbers
	const tex6 = await (await fetch('/paper/sections/06-thermal.tex')).text();
	const paras = [...tex6.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.join() === 'Absorption,Emission,Friction at the frequencies of heat,A bound on the glow,Volume and surface emission', `Section VI's paragraphs ${paras}`);
	for (const p of paras) check(SECTIONS.some((s) => s[1] === p), `no box is named for the paragraph ${p}`);
	for (const p of ['Matter is transparent', 'Free electrons', 'Driven vibrations', 'Pairs of phonons']) check(tex6.includes(`\\emph{${p}.}`), `the paper has no ${p}`);
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:thermal') === 'VI', 'sec:thermal is not Section VI');
	check(ledgerEqs.map((e) => auxNumber(`eq:${e}`)).join() === '33,34,35,36,37,38,39,40', 'the eight equations are not (33) to (40), in order');
	const numsOf = (eqs, figs, tabs) => [...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...tabs.map((t) => `Table ${auxNumber(`tab:${t}`)}`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k], tabsOf[k]));
	const furnaceNums = numsOf(furnaceEqs, furnaceFigs, []);
	check(nums[3] === '(72), Fig. 18' && nums[4] === 'Fig. 19' && nums[10] === 'Table III, Fig. 20' && furnaceNums === '(72), (75), Fig. 19', `the numbers ${nums} ${furnaceNums}`);

	// ---- measuring and wrapping -------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const room = CW - 2 * INSIDE;

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels, dotted boxes], measured -------------
	const content = async (nm, numbers, list, stated, hatched, what) => {
		const out = [], dots = [];
		let y = 0;
		out.push({ ...(await placedBase(textOf(await fits(nm, room)), 0, y, INK)), role: 'name' });
		if (numbers) {
			y += NUM_PITCH;
			out.push({ ...(await placedBase(textOf(await fits(numbers, room)), 0, y, INK)), role: 'numbers' });
		}
		y += LIST_PITCH;
		out.push({ ...(await placedBase(`\\text{${await fits(list, room)}}`, 0, y, DIM)), role: 'chapters' });
		if (stated.length) {
			// the dotted boxes in rows, in the section's order, as many to a row as fit, each row centred
			const probes = [];
			for (const words of stated) probes.push(await placedBase(textOf(words), 0, 0, DIM));
			const ws = probes.map((g) => g.box.r - g.box.l + 2 * LATER_PAD[0]);
			const inkT = Math.min(...probes.map((g) => g.box.t)), inkB = Math.max(...probes.map((g) => g.box.b));
			const h = inkB - inkT + 2 * LATER_PAD[1];
			const rowRoom = hatched ? CW - 2 * (CLEAR[0] + 3) : CW - 2;
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
	for (const [k, s] of SECTIONS.entries())
		sets.push(await content(s[1], nums[k], s[6] ? `${s[3]}; derived here` : s[3], s[4].map((x) => x[0]), s[5][0] === 'hatched', `box ${k + 1}`));

	// ---- the rows: each as tall as the taller of its boxes -----------------------------------------------------------
	const W = 2 * CW + GUT;
	const x0 = ORIGIN - W / 2;
	const col = (c) => x0 + c * (CW + GUT);
	const colOf = (k) => (k < PER_COL ? 0 : 1), rowOf = (k) => (k < PER_COL ? k : k - PER_COL);
	const rowTops = [];
	let top = ORIGIN - 300;
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
		const hatched = s[5][0] === 'hatched';
		boxes.push({ l, r: rr, t, b, m: (t + b) / 2, c, row: r, name: s[1] });
		if (hatched) {
			hatch(S, { l, r: rr, t, b }, what);
			// the clearing under the words: the page itself
			const cl = { l: dx + Math.min(...set.out.map((g) => g.dotted ? g.dotted.l : g.box.l)) - CLEAR[0], r: dx + Math.max(...set.out.map((g) => g.dotted ? g.dotted.r : g.box.r)) + CLEAR[0], t: dy + set.t - CLEAR[1], b: dy + set.b + CLEAR[1] };
			check(cl.t - t >= 1.5 && b - cl.b >= 1.5 && cl.l - l >= 3, `the clearing of ${what} reaches its edge`);
			S.raw(`<path d="M${n2(cl.l)},${n2(cl.t)}H${n2(cl.r)}V${n2(cl.b)}H${n2(cl.l)}Z" fill="${PAGE}"/>`, 1);
		} else S.fill(`M${n2(l)},${n2(t)}H${n2(rr)}V${n2(b)}H${n2(l)}Z`, { l, r: rr, t, b }, { color: FILL, layer: 0, what, solid: false });
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

	// ---- the arrows of the reading order: down each column, and up the gutter from the seventh box to the eighth ------
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

	// ---- the last box, the closed furnace, and the arrows into it ----------------------------------------------------
	const fset = await content(FURNACE_NAME, furnaceNums, FURNACE_CITES, [], false, 'the last box');
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
	check(feeders.every(Boolean), 'a box the furnace uses is missing');
	const below = feeders.filter((b) => b.row === PER_COL - 1), left = feeders.filter((b) => b.row < PER_COL - 1 && b.c === 0), right = feeders.filter((b) => b.c === 1);
	check(below.length === 1 && left.length === 3 && right.length === 2, 'the furnace\'s feeders are not one from the last row, three beside the first column and two beside the second');
	check(boxes.filter((b) => b.c === 1).every((b) => b.row < PER_COL - 1), 'the second column reaches the last row');
	for (const b of below) {
		const x = (b.l + b.r) / 2;
		const ar = S.arrow([x, b.b + STROKE / 2], [x, K.t - END_AIR], { color: DIM, width: HAIR, head: HEAD, layer: 2, what: `the arrow from "${b.name}" into the last box` });
		check(ar.head === HEAD, 'the arrow into the last box is too short for a whole head');
	}
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
		for (const b of below) check(Math.abs(xin - (b.l + b.r) / 2) >= 30, 'a bus enters the last box too near the straight arrow');
	}

	// ---- checks: every label inside its box clears the box's edges, centred left and right --------------------------
	for (const g of L.filter((g) => g.inside)) {
		const { l, r, t, b, what } = g.inside;
		const a = [g.box.l - l, r - g.box.r, g.box.t - t, b - g.box.b];
		const least = what.startsWith('the dotted box') ? Math.min(...LATER_PAD) - 0.6 : INSIDE;
		check(Math.min(...a) >= least, `the label ${g.src} is ${Math.min(...a).toFixed(2)} pt from an edge of ${what}`);
		check(Math.abs(a[0] - a[1]) < 0.02, `the label ${g.src} is not centred in ${what}`);
	}
	for (const g of L) g.on = g.inside ? [g.inside.what, ...(g.within ? [g.within, `the hatching of ${g.within}`] : [])] : [];
	S.checkAll(L, LABEL_GAP - 0.05);
	window.tutReadViMap = { W, nums, furnaceNums, boxes, rows: rowTops, last: K, drawn };
	return finish(S, L, [300, 345]);
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
		let xa = s, ya = b, xc = s + h, yc = t;
		if (xa < l) { ya -= l - xa; xa = l; }
		if (xc > r) { yc += xc - r; xc = r; }
		if (xc - xa < 0.3) continue;
		d.push(`M${n2(xa)},${n2(ya)}L${n2(xc)},${n2(yc)}`);
	}
	S.raw(`<path d="${d.join('')}" stroke="${RULE}" stroke-width="${HATCH}" stroke-linecap="butt" fill="none"/>`, 0);
	S.mark([[l, t], [r, t], [r, b], [l, b], [l, t]], 0, `the hatching of ${what}`);
}

/** A dotted outline: round dots along each side, one at every corner, evenly spaced (as R9b's), in grey. */
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
