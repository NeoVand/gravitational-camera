/**
 * The generator of the paper's margin map (paper-links.generated.ts): for every place in the paper that a reader
 * might want explained (a section, a run-in paragraph, a numbered equation, a figure, a table), the tutorial chapter
 * that serves it best, found in the tutorial's own records rather than written by hand. It reads, for each published
 * chapter in the order of parts.yaml: the sections a reading chapter reads (`reads:` in parts.yaml), the chapter's
 * front matter (`paper:` and `figures:`), its links into the paper (`[](/paper/#eq:x)`), its displays of the
 * paper's equations and figures (`{{paper eq:x}}`), its `::: try` blocks, and the ledger table of each reading
 * chapter.
 *
 * The rules, by kind of place, and the label each note gets:
 *
 *   sec:x   the reading chapter that reads the section, at its top                                        Reading
 *           (none reads it: the first chapter whose front matter lists it, at its top                    Background)
 *   par:x   the reading chapter of its section that links the paragraph, at the heading of the stretch that
 *           opens with the link (or, failing that, that first contains it)                                Reading
 *           (no reading chapter of its section links it: the first other chapter that does              Background)
 *   eq:x    the chapter its ledger row names first as deriving it, at the heading where that chapter
 *           first links or shows the equation; "derived here" names the reading chapter itself          Derivation
 *           (a row that says "stated", when no other ledger names a derivation, and an equation in no
 *           ledger: the first chapter that both lists it in `paper:` and shows it with {{paper eq:x}},
 *           else the first that shows it, else the first that links it, at that heading                  Background)
 *   fig:x,  in this order of preference: a chapter with a `::: try` block that mounts the figure's live
 *   tab:x   version, at that block's heading                                                               Live
 *           else a chapter whose front matter `figures:` lists it, as the chapter is about it; else one that
 *           shows it with {{paper fig:x}} (for a table, one that links it), at the heading where it first
 *           shows or links it                                                                               Background
 *           Within each step, a teaching chapter comes before Part 0 (the evening tour, which shows many
 *           figures in passing) and the reading chapters, and then the order of parts.yaml decides.
 *           Where that picks a chapter that only uses the figure, FIGURE_OVERRIDES names the one that
 *           explains it (each entry with its reason).
 *
 * "The reading chapter of a section" is the first, in the order of parts.yaml, whose `reads:` holds the section;
 * a reading chapter that reads more than two sections (R8 reads the quantum statements of five) is taken only when
 * no narrower one reads it, and R13b, the only reader of its four, is taken for them. "First" is always in the order
 * of parts.yaml: the first route holds only the chapters of Section II, so it cannot order the rest.
 *
 * So the labels are four: Reading, Derivation, Background, Live. The appendix of checks and its table, and the
 * statement on the use of AI, get no note (SKIP).
 */
import { plainText, wordsOf } from '../render/pandoc';
import type { Node } from '../render/pandoc';
import type { PaperLink } from './paper-links';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** The places of the paper that get no note. */
export const SKIP = new Set(['sec:ai-use', 'app:checks', 'tab:checks']);

export const LABELS = ['Reading', 'Derivation', 'Background', 'Live'] as const;

/** A place in the paper, in the paper's order, with the section (or appendix) it stands in. */
export interface MapAnchor {
	id: string;
	section: string;
}

/** A published chapter, as the generator reads it. */
export interface MapChapter {
	id: string;
	/** for a reading chapter, the sections of the paper it reads (parts.yaml) */
	reads: readonly string[];
	/** pandoc's tree of the chapter's Markdown */
	tree: { meta: Record<string, Node>; blocks: Node[] };
}

export interface MapInput {
	/** every anchor of the paper page, in the paper's order */
	anchors: readonly MapAnchor[];
	/** an equation label that is not its display's anchor (the second \label of a display) → that anchor */
	aliases?: ReadonlyMap<string, string>;
	/** the published chapters, in the order of parts.yaml */
	chapters: readonly MapChapter[];
	/** a `::: try` id → the paper figure whose live version it mounts */
	liveFigures?: ReadonlyMap<string, string>;
	/** figure or table → the chapter to choose over the rule (FIGURE_OVERRIDES by default) */
	overrides?: Readonly<Record<string, string>>;
}

export interface MapResult {
	links: PaperLink[];
	/** places in the sources that the rules had to work around, for the report */
	notes: string[];
}

/**
 * Where the rule for figures and tables ties between teaching chapters and the earliest only uses the figure, the
 * chapter that explains it. Each must be published and use the figure (embed it, list it in `figures:` or link it);
 * the note lands where that chapter first embeds or links it, Live if one of its try blocks mounts it.
 */
export const FIGURE_OVERRIDES: Readonly<Record<string, string>> = {
	// the tides chapter; 7.6 only animates the wave panel
	'fig:tidal': '1.4',
	// the principal null directions, which the figure draws
	'fig:stars': '9.4',
	// the array camera, which the figure sizes
	'fig:array': '5.3',
	// where the figure is shown and computed
	'fig:which-way': '5.3',
	// it lists the figure, and it opens Part 13
	'fig:hair': '13.1',
	// it reads the table row by row in its capstone
	'tab:hair': 'R13b'
};

const isReading = (id: string) => /^R\d/.test(id);
/** Part 0, the evening tour, which shows many of the paper's figures at a glance */
const isOverview = (id: string) => id.startsWith('0.');
const PAPER_URL = /^\/paper\/?#(.+)$/;
const CHAPTER_ID = /(?<![\w.])(R\d+b?|\d+\.\d+b?)(?![\w.]*\d)/g;

/** The text of some blocks, for a table cell: words, links' words, emphasis; no mathematics. */
const blockWords = (blocks: Node[]): string =>
	blocks
		.map((b) => (b.t === 'Plain' || b.t === 'Para' ? wordsOf(b.c) : ''))
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();

/** Every link into the paper inside a node, in order, as the anchor it points to. */
function paperLinksIn(x: any, out: string[] = []): string[] {
	if (Array.isArray(x)) {
		for (const y of x) paperLinksIn(y, out);
		return out;
	}
	if (!x || typeof x !== 'object') return out;
	if (x.t === 'Link') {
		const m = String(x.c[2][0]).match(PAPER_URL);
		if (m) out.push(decodeURIComponent(m[1]));
	}
	for (const v of Object.values(x)) paperLinksIn(v, out);
	return out;
}

/** Chapter links inside a node, as [chapter id, anchor] from "/tutorial/<slug>/#anchor". */
function tutorialLinksIn(x: any, out: { text: string; anchor: string }[] = []) {
	if (Array.isArray(x)) {
		for (const y of x) tutorialLinksIn(y, out);
		return out;
	}
	if (!x || typeof x !== 'object') return out;
	if (x.t === 'Link') {
		const m = String(x.c[2][0]).match(/^\/tutorial\/[^#]+\/#(.+)$/);
		if (m) out.push({ text: wordsOf(x.c[1]).trim(), anchor: m[1] });
	}
	for (const v of Object.values(x)) tutorialLinksIn(v, out);
	return out;
}

interface LedgerRow {
	/** chapter ids named in the row's last cell, in order */
	chapters: string[];
	/** the anchor a chapter id in the cell links to, if it does */
	anchors: Map<string, string>;
	/** the cell begins "stated": the paper takes it from outside */
	stated: boolean;
	/** the reading chapter derives it itself ("derived here", "assembled here", or "checked here" with no chapter) */
	here: boolean;
}

/** What one chapter says about the paper. */
interface Scan {
	id: string;
	order: number;
	reads: readonly string[];
	/** front matter `paper:` */
	listed: Set<string>;
	/** front matter `figures:`, the paper's figures and tables the chapter is about */
	figures: Set<string>;
	/** anchor → the heading (h2 id, '' before the first) where the chapter's text first links it or shows it */
	first: Map<string, string>;
	/** every anchor the chapter links, its closing lists ("The paper", the problems) included */
	mentions: Set<string>;
	/** anchor → the heading where it is first shown with {{paper …}} */
	shown: Map<string, string>;
	/** par anchor → the first heading whose opening paragraph links it */
	opens: Map<string, string>;
	/** equation → its row in the chapter's ledger */
	ledger: Map<string, LedgerRow>;
	/** the chapter's try blocks, with the heading each stands under */
	tries: { id: string; section: string }[];
}

function scanChapter(
	chapter: MapChapter,
	order: number,
	known: ReadonlySet<string>,
	alias: (label: string) => string
): Scan {
	const scan: Scan = {
		id: chapter.id,
		order,
		reads: chapter.reads,
		listed: new Set(),
		figures: new Set(),
		first: new Map(),
		mentions: new Set(),
		shown: new Map(),
		opens: new Map(),
		ledger: new Map(),
		tries: []
	};
	const metaList = (key: string): string[] => {
		const meta = chapter.tree.meta[key];
		const items = meta?.t === 'MetaList' ? meta.c : meta ? [meta] : [];
		return items
			.filter((m: Node) => m.t === 'MetaInlines' || m.t === 'MetaString')
			.map((m: Node) => alias(m.t === 'MetaString' ? String(m.c) : wordsOf(m.c).trim()));
	};
	for (const label of metaList('paper')) scan.listed.add(label);
	for (const label of metaList('figures')) scan.figures.add(label);

	let section = '';
	let inLedger = false;
	/** inside the closing list of the paper's places or the problems, whose links say nothing of the heading */
	let aside = 0;
	const note = (map: Map<string, string>, anchor: string) => {
		scan.mentions.add(anchor);
		if (!aside && !map.has(anchor)) map.set(anchor, section);
	};
	const visit = (x: any): void => {
		if (Array.isArray(x)) return x.forEach(visit);
		if (!x || typeof x !== 'object') return;
		const n = x as Node;
		if (n.t === 'Header' && n.c[0] === 2) {
			section = String(n.c[1][0]);
			inLedger = /^The ledger\b/.test(wordsOf(n.c[2]).trim());
			return;
		}
		if (n.t === 'Para') {
			const m = plainText(n.c)
				.trim()
				.match(/^\{\{paper ((?:eq|fig):[^}\s]+)\}\}$/);
			if (m) {
				const anchor = alias(m[1]);
				note(scan.shown, anchor);
				note(scan.first, anchor);
				return;
			}
		}
		if (n.t === 'Div') {
			const [id, classes] = n.c[0] as [string, string[]];
			if (classes.includes('try') && id) scan.tries.push({ id, section });
			if (classes.includes('paper') || classes.includes('problems')) {
				aside += 1;
				visit(n.c[1]);
				aside -= 1;
				return;
			}
		}
		if (n.t === 'Table' && inLedger) readLedger(n);
		if (n.t === 'Link') {
			const m = String(n.c[2][0]).match(PAPER_URL);
			if (m) note(scan.first, alias(decodeURIComponent(m[1])));
		}
		for (const v of Object.values(n)) visit(v);
	};

	/** A ledger: each row's first cell holds the paper's equations, its last cell where they are derived. */
	const readLedger = (table: Node) => {
		const bodies = table.c[4] as any[];
		for (const body of bodies)
			for (const row of body[3] as any[]) {
				const cells = (row[1] as any[]).map((cell) => cell[4] as Node[]);
				if (cells.length < 2) continue;
				const equations = paperLinksIn(cells[0])
					.map(alias)
					.filter((a) => a.startsWith('eq:'));
				if (!equations.length) continue;
				const last = cells[cells.length - 1];
				const text = blockWords(last);
				const chapters = [...text.matchAll(CHAPTER_ID)]
					.map((m) => m[1])
					.filter((id) => known.has(id));
				const anchors = new Map<string, string>();
				for (const l of tutorialLinksIn(last))
					if (known.has(l.text) && !anchors.has(l.text)) anchors.set(l.text, l.anchor);
				const here =
					/\b(derived|assembled) here\b/.test(text) ||
					(!chapters.length && /\bchecked here\b/.test(text));
				const stated = /^stated\b/i.test(text);
				for (const eq of equations)
					if (!scan.ledger.has(eq))
						scan.ledger.set(eq, { chapters: [...new Set(chapters)], anchors, stated, here });
			}
	};

	// the top level, where each heading's opening paragraph is known
	let opening = false;
	for (const b of chapter.tree.blocks) {
		if (b.t === 'Header' && b.c[0] === 2) {
			visit(b);
			opening = true;
			continue;
		}
		if (opening && (b.t === 'Para' || b.t === 'Plain')) {
			for (const a of paperLinksIn(b).map(alias)) if (a.startsWith('par:')) note(scan.opens, a);
			opening = false;
		} else if (b.t !== 'RawBlock') opening = false;
		visit(b);
	}
	return scan;
}

/** The margin map, from the sources. */
export function mapPaper(input: MapInput): MapResult {
	const aliases = input.aliases ?? new Map<string, string>();
	const overrides = input.overrides ?? FIGURE_OVERRIDES;
	const alias = (label: string) => aliases.get(label) ?? label;
	const known = new Set(input.chapters.map((c) => c.id));
	const scans = input.chapters.map((c, i) => scanChapter(c, i, known, alias));
	const byId = new Map(scans.map((s) => [s.id, s]));
	const notes: string[] = [];

	/** The reading chapters of a section, narrow ones first, each group in order. */
	const readersOf = (section: string) => {
		const readers = scans.filter((s) => isReading(s.id) && s.reads.includes(section));
		return [
			...readers.filter((s) => s.reads.length <= 2),
			...readers.filter((s) => s.reads.length > 2)
		];
	};
	/** The first chapter, in order, that links or shows the anchor. */
	const mentioning = (anchor: string, among: readonly Scan[] = scans) =>
		among.find((s) => s.mentions.has(anchor));
	/** Where in a chapter a note on the anchor lands: the heading that opens with it, or first holds it. */
	const at = (scan: Scan, anchor: string) => scan.opens.get(anchor) ?? scan.first.get(anchor);

	const made = new Map<string, PaperLink>();
	const link = (anchor: string, scan: Scan, label: PaperLink['label'], section?: string) => {
		made.set(anchor, { anchor, chapter: scan.id, label, ...(section ? { section } : {}) });
	};

	for (const { id: anchor, section } of input.anchors) {
		if (SKIP.has(anchor)) continue;
		const kind = anchor.slice(0, anchor.indexOf(':'));
		const readers = readersOf(section);

		if (kind === 'sec' || kind === 'app') {
			const reader = readersOf(anchor)[0];
			const lister = scans.find((s) => s.listed.has(anchor));
			if (reader) link(anchor, reader, 'Reading');
			else if (lister) {
				link(anchor, lister, 'Background');
				notes.push(
					`${anchor}: no reading chapter reads it; the first to list it in paper: is ${lister.id}`
				);
			}
		} else if (kind === 'par') {
			const reader = mentioning(anchor, readers);
			const other = mentioning(anchor);
			if (reader) link(anchor, reader, 'Reading', at(reader, anchor));
			else if (other) {
				link(anchor, other, isReading(other.id) ? 'Reading' : 'Background', at(other, anchor));
				notes.push(
					`${anchor}: no reading chapter of ${section} links it; ${other.id} is the first that does`
				);
			}
		} else if (kind === 'eq') {
			// the ledger of a reading chapter of the equation's section first, then the others
			const ledgers = [...readers, ...scans.filter((s) => !readers.includes(s))].filter((s) =>
				s.ledger.has(anchor)
			);
			const derived = ledgers.find((s) => !s.ledger.get(anchor)!.stated);
			const row = derived?.ledger.get(anchor);
			const by = row && (row.here ? derived : byId.get(row.chapters[0]));
			if (derived && row && by) {
				const where = at(by, anchor) ?? (by === derived ? undefined : row.anchors.get(by.id));
				if (!by.mentions.has(anchor))
					notes.push(
						`${anchor}: ${by.id} derives it (the ledger of ${derived.id}) but never links or shows it`
					);
				link(anchor, by, 'Derivation', where);
			} else {
				if (derived) notes.push(`${anchor}: the ledger of ${derived.id} names no chapter for it`);
				const stated = ledgers.find((s) => s.ledger.get(anchor)!.stated);
				const background =
					stated ??
					scans.find((s) => s.listed.has(anchor) && s.shown.has(anchor)) ??
					scans.find((s) => s.shown.has(anchor)) ??
					mentioning(anchor);
				if (background) link(anchor, background, 'Background', at(background, anchor));
			}
		} else if (kind === 'fig' || kind === 'tab') {
			// a teaching chapter before the evening tour and the reading chapters, which show figures in passing
			const best = (among: Scan[]) =>
				among.find((s) => !isReading(s.id) && !isOverview(s.id)) ?? among[0];
			const tryOf = (s: Scan) => s.tries.find((t) => input.liveFigures?.get(t.id) === anchor);
			const chosen = byId.get(overrides[anchor] ?? '');
			const uses = (s: Scan) => s.figures.has(anchor) || s.mentions.has(anchor);
			if (anchor in overrides && !(chosen && uses(chosen)))
				notes.push(`${anchor}: the override names ${overrides[anchor]}, which does not use it`);
			if (chosen && uses(chosen)) {
				link(anchor, chosen, tryOf(chosen) ? 'Live' : 'Background', at(chosen, anchor));
				continue;
			}
			const live = best(scans.filter((s) => tryOf(s)));
			const about = best(scans.filter((s) => s.figures.has(anchor)));
			const shows = best(scans.filter((s) => s.shown.has(anchor)));
			const links = best(scans.filter((s) => s.mentions.has(anchor)));
			if (live) link(anchor, live, 'Live', tryOf(live)!.section || undefined);
			else {
				const chapter = about ?? shows ?? links;
				if (chapter) link(anchor, chapter, 'Background', at(chapter, anchor));
			}
		}
	}

	// A paragraph no chapter links takes the note of the paragraph whose heading it repeats ("…-2" after "…"), or
	// else its section's, at the chapter's top.
	for (const { id: anchor, section } of input.anchors) {
		if (SKIP.has(anchor) || made.has(anchor) || !anchor.startsWith('par:')) continue;
		const namesake = made.get(anchor.replace(/-\d+$/, ''));
		const home = made.get(section);
		if (namesake && namesake.anchor !== anchor) {
			made.set(anchor, { ...namesake, anchor, label: 'Background' });
			notes.push(`${anchor}: no chapter links it; it takes the note of ${namesake.anchor}`);
		} else if (home) {
			made.set(anchor, { anchor, chapter: home.chapter, label: home.label });
			notes.push(`${anchor}: no chapter links it; it takes the note of its section, ${section}`);
		}
	}

	const links: PaperLink[] = [];
	for (const { id } of input.anchors) {
		if (SKIP.has(id)) continue;
		const l = made.get(id);
		if (l) links.push(l);
		else notes.push(`${id}: no chapter serves it`);
	}
	return { links, notes };
}

/** The generated module's text (before prettier), from the links. */
export function linksModule(links: readonly PaperLink[], source: string): string {
	const quote = (v: string) => `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
	const rows = links.map(
		(l) =>
			`\t{ ${Object.entries(l)
				.map(([k, v]) => `${k}: ${quote(String(v))}`)
				.join(', ')} },`
	);
	return [
		`/**`,
		` * The paper's margin map, one note per place in the paper, generated from the tutorial's records by`,
		` * ${source} (the rules are in paper-map.ts). Do not edit by hand: change the sources and run the script; a test`,
		` * fails while this file differs from what the sources give.`,
		` */`,
		`import type { PaperLink } from './paper-links';`,
		``,
		`export const paperLinks: PaperLink[] = [`,
		...rows,
		`];`,
		``
	].join('\n');
}
