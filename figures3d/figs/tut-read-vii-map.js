// The tutorial, reading chapter R11 (tutorial/black-holes/reading-section-vii.md), its first diagram: Section VII as a
// map of what Part 11 and the parts before it have derived. The sibling of R10's and R10b's maps
// (figs/tut-read-vi-map.js, figs/tut-read-ix-map.js): the same box, type, fill, outline, dotted box and grey arrows, in
// ink and the page's greys only (the outline in ink, the fill the neutral tint of the page, the chapters and the dotted
// boxes in grey), since orange and blue mean a stretch and a squeeze. Six boxes, one for each section of the chapter
// before the capstone, in its order, in one column read down (one drawing serves the desktop and the phone, laid out
// to be read at 390 px, as R10's), joined in reading order by thin grey arrows. Each box carries, at its left, a short
// name for its section (the paper's paragraph where the section links one), under it the paper's equations and
// figures that the section shows or links, as the site numbers them, and under those, in grey, the chapters the
// section cites, with "derived here" where the chapter derives a step itself; at its right, each in a small dotted
// box, the results the section marks as stated in the paper. Every box is filled: every claim in it is derived in a
// chapter or checked here. Below the column, set apart by a gap, the last box, the capstone, outlined a little
// heavier, with grey arrows into it along a bus outside the column's left side from the three boxes whose results its
// steps use: A black hole as the lens (the mass and the cut-off), The camera cannot sit close (the orbit, the view,
// the area and the cost) and What a lens would add (classically nothing, R8's image from counts).
// Departures from the diagram's comment, where the chapter's text decides: each box lists every chapter its section
// cites, and only those (the first box R9, 5.1 and 5.5: the opening's R10 is not in the section, and R9 is; the
// second adds 11.3, for the shadows; the third adds 10.2, for the unstable balance; the fourth adds 5.3, for the gap
// box's sum of wavelets; the fifth adds 5.3, for the computed sum); the sixth box is also "derived here", for the front
// and back of the magnetic records; the dotted insets are the results each section marks as stated, one for each
// result it names (Press's mirror condition among them); the chapter numbers are in the page's grey, as in every
// reading map, not the observer's colour; the capstone's arrows come from the three boxes its table uses, so the
// caption says three, not four.
// Every name, number and chapter is checked against the chapter's text (its headings in order, the paragraph each
// section links, the chapters each section cites, the equations and figures it shows or links, the results it marks
// as stated or derived here, the ledger's five equations, the capstone's table) and against the paper (main.aux,
// Section VII's paragraphs); the boxes' sizes and places are chosen for the drawing.
import { tex, INK, DIM } from '../lib.js';
import { Sheet, ORIGIN, finish, checker, boxOf, n2, HAIR, LABEL_GAP } from './tut-pot-lib.js';

const name = 'tut-read-vii-map';
const check = checker(name);

// ---- the six sections, in order (tutorial/black-holes/reading-section-vii.md) ---------------------------------------
// [the section's heading, the box's name, a phrase of the section that names what the box is called, the chapters it
// cites, the results stated (the inset's words, the section's words that name the result), derived here]
export const SECTIONS = [
	['Matter barely slows a wave, and reflects less still', 'The optical constants of matter',
		'[*The optical constants of matter*](/paper/#par:the-optical-constants-of-matter)', 'R9, 5.1, 5.5', [
			['Peters\'s index', 'opens with Peters\'s index'],
			['Press\'s stiffness', 'Press\'s stiffness term'],
			['$(v/c)^2$ of free matter', 'the $(v/c)^2$ of free matter'],
			['Press\'s reflection', 'A sharp face reflects the amplitude']
		], false],
	['Every optical constant of a body is its compactness times factors below one', 'Compactness times factors below one',
		'Both are set by the **compactness**', 'R5, 4.4, 5.1, 5.5, 7.8, 11.1, 11.2, 11.3', [
			['Press\'s mirror condition', 'Press\'s mirror condition'],
			['Smolin\'s absorption', 'Smolin\'s absorption'],
			['Loeb\'s bound', 'Loeb\'s bound'],
			['Patla and Nemiroff\'s solar focus', 'Patla and Nemiroff\'s solar focus'],
			['McKernan\'s resonant stars', 'McKernan\'s resonant stars']
		], false],
	['Only a black hole is compact enough, and it focuses only the glow of warm matter', 'A black hole as the lens',
		'[*A black hole as the lens*](/paper/#par:a-black-hole-as-the-lens)', '5.5, 10.1, 10.2, 11.1, 11.3', [], false],
	['The camera must orbit 26 km away, where the hole gathers 130 times its area', 'The camera cannot sit close',
		'"The camera cannot sit close."', '1.4, 1.8, 5.3, 11.1', [
			['the point lens\'s gain', 'On the axis a point lens raises']
		], true],
	['A lens adds nothing classical, and no lens sharpens the near field', 'What a lens would add',
		'[*What a lens would add*](/paper/#par:what-a-lens-would-add)', 'R8, R10b, 2.7, 4.3, 5.3', [
			['the quantum half', 'The quantum half'],
			['Pendry\'s slab', 'Pendry\'s slab']
		], false],
	['Delaying and adding the records is the camera\'s lens', 'The computed image',
		'[*The computed image*](/paper/#par:the-computed-image)', '1.1, 5.3, 7.6, 9.6', [], true]
];
const CAPSTONE = 'The capstone: a black hole as the camera\'s lens';
const CAPSTONE_NAME = 'The capstone: a black hole as the camera\'s lens';
const CAPSTONE_CITES = 'R8, 1.4, 1.8, 11.1, 11.3';
const LEDGER = 'The ledger: four of Section VII\'s five equations are derived, and one is stated';
// the boxes the capstone uses: [the box, the capstone's words (its table), the box's words]
const USES = [
	['A black hole as the lens', '$1.356\\times10^{23}$ kg; unstable', '\\matter M_{\\rm eq}} = 1.356\\times10^{23}$ kg'],
	['A black hole as the lens', 'focuses $\\lambda < 4\\pi r_s$', 'a mass focuses only waves shorter than $4\\pi r_s$'],
	['The camera cannot sit close', '26.3 km; 8.9 s', 'once every 8.9 s'],
	['The camera cannot sit close', '$25.5\'\'$, 3.25 m, 0.35 ms a turn', 'where the ring is $25.5\'\'$'],
	['The camera cannot sit close', '1.02 m², 130 times; 795', 'For $a = 5$ cm it is 1.02 m², 130 times'],
	['The camera cannot sit close', 'the person\'s tide wins beyond 12,470 km', 'at 12,470 km'],
	['What a lens would add', '| classically nothing | R8 |', 'classically nothing']
];
const CAPTION = 'Look first at the solid boxes: every paragraph of Section VII rests on chapters of Parts 1 to 11, with its stated results in dotted insets. The last box follows one hole through three of them.';

// ---- the drawing (figure points, y down); the type, strokes and kit of R10's map -----------------------------------
const SIZE = 8.5;                 // every label
const W = 335;                    // the column's width: R10b's, so that the dotted boxes stand in two or three rows
const LZ = 142;                   // the left part of a box, where its name, numbers and chapters stand
const STROKE = 0.55;              // a box's outline
const LAST_STROKE = 0.75;         // the last box's outline, set apart
const DOT = 0.75, DOT_STEP = 2.2; // the dotted outline of a result stated
const NUM_PITCH = 11;             // from a name's baseline to its numbers' (parentheses descend)
const LIST_PITCH = 10.6;          // from the numbers' (or the name's) baseline to the chapters'
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
	const md = await (await fetch('/tutorial/black-holes/reading-section-vii.md')).text();
	const text = md.replace(/<!--[\s\S]*?-->/g, ' ');
	const flat = text.replace(/\s+/g, ' ');
	const heads = [...text.matchAll(/^## (.*)$/gm)].map((m) => m[1]);
	check(heads.length === 8 && heads[6] === CAPSTONE && heads[7] === LEDGER, `the chapter's headings ${heads}`);
	check(SECTIONS.every((s, i) => heads[i] === s[0]), 'the boxes are not the chapter\'s first six sections, in order');
	const sectionText = (i) => text.split(/^## .*$/m)[i + 1].replace(/\s+/g, ' ');
	const ledger = sectionText(7).split('[^')[0];
	const capstone = sectionText(6);
	// the chapters a section cites: every way the chapter names one
	const C = '(R\\d+b?|\\d+\\.\\d+)(?!\\d)';
	const citesOf = (sec) => {
		const out = new Set();
		for (const re of [`\\[${C}\\]\\(/tutorial/`, `[Cc]hapters? \\[?${C}`, `\\(${C}\\)`, `(?<![\\d.\\w$])${C}'s\\b`, `(?:by|from|as in|with|and) \\[?${C}`])
			for (const m of sec.matchAll(new RegExp(re, 'g'))) out.add(m[1]);
		return [...out];
	};
	const order = (c) => (c.startsWith('R') ? -100 + Number(c.slice(1).replace('b', '')) : Number(c));
	const listOf = (sec) => citesOf(sec).sort((a, b) => order(a) - order(b)).join(', ');
	// the sentences of a section that mark a result stated
	const sentences = (sec) => sec.split(/(?<=\.)\s+(?=[A-Z"\[*])/);
	// the ledger's five equations, in order, and the boxes that hold them
	const ledgerEqs = [...ledger.matchAll(/\| \[\]\(\/paper\/#eq:([\w-]+)\),/g)].map((m) => m[1]);
	check(ledgerEqs.join() === 'index,optics-bound,lens-compactness,beam,diffraction' && LEDGER.includes('five'), `the ledger's equations ${ledgerEqs}`);
	const refsOf = (sec, kind) => [...new Set([...sec.matchAll(new RegExp(`(?:\\{\\{paper |\\]\\(/paper/#)${kind}:([\\w-]+)`, 'g'))].map((m) => m[1]))];
	const eqsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'eq'));
	const figsOf = SECTIONS.map((_, k) => refsOf(sectionText(k), 'fig'));
	const shown = SECTIONS.map((_, k) => [...sectionText(k).matchAll(/\{\{paper eq:([\w-]+)\}\}/g)].map((m) => m[1])).flat();
	check(shown.join() === ledgerEqs.join(), `the sections do not show the ledger's equations in order: ${shown}`);
	check(eqsOf.map((e) => e.join('+')).join() === 'index,optics-bound+alpha+lens-compactness,lens-compactness,,beam+evanescent+index,beam+diffraction', `the equations the boxes hold ${eqsOf.map((e) => e.join('+'))}`);
	check(figsOf.map((f) => f.join('+')).join() === ',,,black-hole-camera,,array', `the figures shown ${figsOf.map((f) => f.join('+'))}`);
	for (const [k, s] of SECTIONS.entries()) {
		const sec = sectionText(k);
		check(sec.includes(s[2]), `the section "${s[0]}" does not name ${s[2]}`);
		const list = listOf(sec);
		check(list === s[3], `the section "${s[0]}" cites ${list}, the box lists ${s[3]}`);
		// the results stated: every sentence that marks one is named by an inset, and every inset's words are there
		for (const [, words] of s[4]) check(sec.includes(words), `the section "${s[0]}" does not say ${words}`);
		const marks = sentences(sec).filter((m) => m.includes('*stated in the paper*'));
		for (const m of marks) check(s[4].some(([, words]) => m.includes(words)), `the section "${s[0]}" states a result no inset shows: ${m}`);
		for (const [, words] of s[4]) check(marks.some((m) => m.includes(words)), `the inset "${words}" of "${s[0]}" is not marked stated`);
		check(sec.includes('*derived here*') === s[5], `the section "${s[0]}" is ${s[5] ? 'not ' : ''}derived here`);
		check(!sec.includes('depth B'), `the section "${s[0]}" rests on a sketch`);
	}
	check(SECTIONS.reduce((n, s) => n + s[4].length, 0) === 12, 'the insets are not twelve');
	// the capstone: its chapters (the table's last column) and the boxes it uses
	const capCites = new Set();
	for (const row of capstone.split('| (').slice(1)) for (const c of row.split('|')[3].split(',').map((x) => x.trim())) if (/^(R\d+b?|\d+\.\d+)$/.test(c)) capCites.add(c);
	check([...capCites].sort((a, b) => order(a) - order(b)).join(', ') === CAPSTONE_CITES, `the capstone's table cites ${[...capCites]}`);
	check(capstone.includes('The capstone follows one hole through Part 11.') || capstone.includes('The capstone follows one hole through Part 11 (Figure'), 'the capstone does not follow one hole');
	for (const [box, inCap, inBox] of USES) {
		const k = SECTIONS.findIndex((s) => s[1] === box);
		check(capstone.includes(inCap), `the capstone does not say ${inCap}`);
		check(sectionText(k).includes(inBox), `the section of "${box}" does not say ${inBox}`);
	}
	const feederNames = [...new Set(USES.map((u) => u[0]))];
	check(feederNames.length === 3 && CAPTION.includes('three of them'), 'the capstone does not use three boxes');
	check(refsOf(capstone, 'eq').length === 0 && refsOf(capstone, 'fig').length === 0, 'the capstone links an equation or a figure');
	// the opening: the chapter reads the section in order, with the marks of R10
	check(flat.includes('We read the section in order'), 'the chapter does not read the section in order');
	check(/requires: \['1\.8', '2\.7', '5\.1', '5\.3', '5\.5', 'R5', '11\.1', '11\.3'\]/.test(md), 'the chapter\'s requirements');
	// the caption, once drawn
	const drawn = flat.includes(`](${name}){#fig:read-vii-map}`);
	const planned = md.includes(`<!-- diagram: ${name} `);
	check(drawn !== planned, `the diagram is ${drawn ? 'both drawn and planned' : 'neither drawn nor planned'}`);
	if (drawn) check(flat.includes(`![${CAPTION}](${name}){#fig:read-vii-map}`), 'the caption is not the figure\'s');
	if (drawn) check(flat.includes('We read the section in order (Figure [](#fig:read-vii-map)).'), 'the chapter does not point to its map');
	// the paper's Section VII: its paragraphs and numbers
	const tex7 = await (await fetch('/paper/sections/07-no-lens.tex')).text();
	const paras = [...tex7.matchAll(/\\paragraph\{([^}]*)\.\}/g)].map((m) => m[1]);
	check(paras.join() === 'The optical constants of matter,A black hole as the lens,What a lens would add,The computed image', `Section VII's paragraphs ${paras}`);
	for (const p of paras) check(SECTIONS.some((s) => s[1] === p), `no box is named for the paragraph ${p}`);
	check(tex7.includes('cannot sit close'), 'the paper does not say the camera cannot sit close');
	const aux = await (await fetch('/paper/main.aux')).text();
	const auxNumber = (label) => aux.match(new RegExp(`\\\\newlabel\\{${label}\\}\\{\\{([^}]*)\\}`))?.[1];
	check(auxNumber('sec:no-lens') === 'VII', 'sec:no-lens is not Section VII');
	check(ledgerEqs.map((e) => auxNumber(`eq:${e}`)).join() === '41,42,43,44,45', 'the five equations are not (41) to (45), in order');
	const numsOf = (eqs, figs) => [...eqs.map((e) => auxNumber(`eq:${e}`)).sort((a, b) => a - b).map((n) => `(${n})`), ...figs.map((f) => `Fig. ${auxNumber(`fig:${f}`)}`)].join(', ');
	const nums = SECTIONS.map((_, k) => numsOf(eqsOf[k], figsOf[k]));
	check(nums.join(' | ') === '(41) | (34), (42), (43) | (43) | Fig. 21 | (17), (41), (44) | (44), (45), Fig. 22', `the numbers ${nums.join(' | ')}`);

	// ---- measuring ---------------------------------------------------------------------------------------------------
	const width = async (s) => { const b = boxOf(await tex(textOf(s), [0, 0], SIZE, 'lB', INK)); return b.r - b.l; };
	const fits = async (s, room) => { const w = await width(s); check(w <= room, `the line "${s}" is ${w.toFixed(2)} pt wide, its room ${room.toFixed(2)} pt`); return s; };
	const leftRoom = LZ - 2 * INSIDE;
	const rightRoom = W - LZ - 2 * RIGHT_AIR;

	// ---- one box's words, set about x = 0 with the first baseline at 0: [labels], measured -----------------------------
	const words = async (nm, numbers, list, room) => {
		const out = [];
		let y = 0;
		out.push({ ...(await placedBase(textOf(await fits(nm, room)), 0, y, INK)), role: 'name' });
		if (numbers) {
			y += NUM_PITCH;
			out.push({ ...(await placedBase(textOf(await fits(numbers, room)), 0, y, INK)), role: 'numbers' });
		}
		y += LIST_PITCH;
		out.push({ ...(await placedBase(`\\text{${await fits(list, room)}}`, 0, y, DIM)), role: 'chapters' });
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
		const inkT = Math.min(...probes.map((g) => g.box.t)), inkB = Math.max(...probes.map((g) => g.box.b));
		const h = inkB - inkT + 2 * LATER_PAD[1];
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
				const g = await placedBase(textOf(stated[j]), (box.l + box.r) / 2, (box.t + box.b) / 2 - (inkT + inkB) / 2, DIM);
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
		sets.push(await words(s[1], nums[k], s[5] ? `${s[3]}; derived here` : s[3], leftRoom));
		ins.push(await insets(s[4].map((x) => x[0]), `box ${k + 1}`));
	}

	// ---- the boxes, one column, each as tall as the taller of its two parts -------------------------------------------
	const x0 = ORIGIN - W / 2;
	const xl = x0 + LZ / 2, xr = x0 + LZ + (W - LZ) / 2;       // the centres of a box's two parts
	const boxes = [];
	let top = ORIGIN - 300;
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
	window.tutReadViiMap = { W, nums, boxes, last: K, drawn, rows: ins.map((i) => i.rows ?? 0) };
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
