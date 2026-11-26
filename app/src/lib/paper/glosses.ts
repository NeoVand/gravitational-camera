/**
 * The paper page's glosses and paragraph anchors (design/book/BOOK-PLAN.md §6): what is done to the paper's rendered
 * HTML, section by section, at build time (lib/server/paper-notes.ts). Two things, on the HTML of lib/paper/render.ts:
 *
 * - every paragraph of the text gets an anchor, so that a side note can stand beside it: a run-in
 *   paragraph keeps its heading's ("par:the-earths-own-tide"), and any other takes one from its first words
 *   ("p:a-freely-falling-observer"), as run-in headings take theirs;
 * - the first use of each glossary term becomes a quiet link, a gloss, whose card shows the tutorial's definition.
 *
 * The gloss rule. The text searched is the prose of the section's paragraphs only: never a heading, an equation
 * or inline mathematics, a figure or its caption, a citation, a footnote mark, an existing link or the plain-words
 * box. A term is matched as a whole word, its first letter in either case (a sentence may begin with it) and the
 * rest as the glossary writes it, with an optional plural "s" or "es"; where two terms overlap, the longer wins
 * ("tidal tensor" before "tide"). Each term is glossed once in the section, at its first use that the density
 * allows:
 *
 * - a paragraph (with its parts continued after a display equation) of N characters of prose takes at most
 *   max(1, floor(N / charsPerGloss)) glosses: with charsPerGloss = 170, about the characters of two lines of the
 *   paper's column at 1440 px (some 85 to a line), so at most about one gloss per two lines;
 * - two glosses stand at least minGap = 60 characters apart (most of a line), so that no line holds two;
 * - when a paragraph holds more candidates than it may take, the longer terms (in words, then letters) go first,
 *   then the earlier: the specific term of the paragraph before the common word;
 * - a term left out gets one more chance, at its next use in a later paragraph; left out again, it is not glossed
 *   in this section, since a gloss far from the first use would come too late to help;
 * - the core terms (CORE_TERMS), the words the whole paper leans on, are glossed at their first use in each
 *   section: they go before all others, and the budget does not hold them back (the distance between glosses does,
 *   and then they wait for their next use).
 *
 * Both numbers are the two fields of GLOSS_DENSITY, which the caller may change.
 */
import { esc, slugify, uniqueIds } from '../render/pandoc';

export interface GlossDensity {
	/** characters of prose per gloss allowed in a paragraph */
	charsPerGloss: number;
	/** the least distance between two glosses, in characters of prose */
	minGap: number;
}

export const GLOSS_DENSITY: GlossDensity = { charsPerGloss: 170, minGap: 60 };

/** The words the whole paper leans on, as the glossary writes them: glossed at their first use in each section. */
export const CORE_TERMS: readonly string[] = [
	'pixel',
	'tide',
	'tidal tensor',
	'curvature',
	'magnetic part',
	'strain',
	'near field',
	'wave zone',
	'gravitational wave',
	'thermal glow',
	'noise',
	'signal-to-noise ratio',
	'blur'
];

export interface GlossTerm {
	/** the term as the glossary writes it */
	term: string;
	/** where the gloss links: the defining chapter, at the term's section if it has one */
	href: string;
	/** the key its links carry in data-gloss, the same in every section (by default, the term's slug) */
	key?: string;
}

export interface GlossOptions {
	density: GlossDensity;
	/** the core terms (CORE_TERMS) */
	core: readonly string[];
	/** hands out the paragraphs' anchors: share one across the sections of a page, so that no two are the same */
	ids?: (id: string) => string;
}

/** What the glossing did to one paragraph, for the record and the tests. */
export interface GlossParagraph {
	/** the paragraph's anchor */
	anchor: string;
	/** characters of prose in it */
	chars: number;
	/** how many glosses it could take */
	budget: number;
	/** the terms glossed in it, in the order of the text */
	terms: string[];
	/** the terms that matched in it, were not yet glossed, but did not fit */
	deferred: string[];
}

export interface Glossed {
	/** the pieces of HTML, with the paragraphs' anchors and the glosses */
	pieces: string[];
	/** each glossed term once, with the key its links carry in data-gloss */
	used: { key: string; term: string }[];
	paragraphs: GlossParagraph[];
}

/** The card a gloss opens. */
export interface GlossCard {
	/** the key its links carry in data-gloss */
	key: string;
	term: string;
	definitionHtml: string;
	/** the defining chapter's id ("1.4"), and its title as HTML */
	chapter: string;
	titleHtml: string;
	href: string;
}

/** Tags that have no closing tag. */
const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;
/** Elements whose text is never glossed. */
const CLOSED_TAGS =
	/^(a|h[1-6]|details|summary|figure|figcaption|sup|sub|code|pre|svg|math|table|script|style)$/i;
const CLOSED_CLASSES = /\bclass="[^"]*\b(katex|nowrap|cite|equation|tutorial-chip)\b/;

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A term as a pattern: its first letter in either case, apostrophes straight or curly, any run of spaces. */
function termPattern(term: string): string {
	const body = escapeRe(term).replace(/['’]/g, "['’]").replace(/\s+/g, '\\s+');
	const first = term[0];
	if (first.toLowerCase() !== first.toUpperCase() && body.startsWith(first))
		return `[${first.toLowerCase()}${first.toUpperCase()}]${body.slice(1)}`;
	return body;
}

/** The form under which a term and its uses are looked up: first letter small, one kind of apostrophe and space. */
const normal = (s: string) =>
	(s[0].toLowerCase() + s.slice(1)).replace(/’/g, "'").replace(/\s+/g, ' ');

/** The words a paragraph's anchor is made from: its first four. */
const ANCHOR_WORDS = 4;

interface Segment {
	piece: number;
	start: number;
	text: string;
	/** where the segment starts in its paragraph's prose */
	offset: number;
}

interface Paragraph {
	anchor: string;
	segments: Segment[];
	chars: number;
	/** where its first <p> opens, if it needs an id there */
	idAt?: { piece: number; at: number };
}

/**
 * Splits the pieces of a section's HTML (the parts between its figures) into paragraphs of searchable prose. A <p>
 * of class "continued" carries on the paragraph before it; a run-in heading names the paragraph after it.
 */
function paragraphsOf(pieces: readonly string[], ids: (id: string) => string): Paragraph[] {
	const paragraphs: Paragraph[] = [];
	const tags = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
	let runIn = '';
	let current: Paragraph | undefined;
	// the open elements: their name, whether text inside may be glossed, and whether they are a paragraph
	const open: { name: string; free: boolean; para: boolean }[] = [];
	const free = () => open.every((e) => e.free) && open.some((e) => e.para);

	pieces.forEach((html, piece) => {
		let at = 0;
		const take = (end: number) => {
			if (end > at && current && free()) {
				const text = html.slice(at, end);
				current.segments.push({ piece, start: at, text, offset: current.chars });
				current.chars += text.length;
			}
		};
		for (const m of html.matchAll(tags)) {
			take(m.index);
			at = m.index + m[0].length;
			const [, closing, name, attrs, selfClosing] = m;
			if (closing) {
				open.pop();
				continue;
			}
			if (selfClosing || VOID.test(name)) continue;
			const tag = name.toLowerCase();
			const outside = open.length === 0;
			if (outside && tag === 'h4') {
				runIn = attrs.match(/\bid="([^"]+)"/)?.[1] ?? '';
			} else if (outside && (tag === 'p' || tag === 'ul' || tag === 'ol')) {
				if (!/\bclass="[^"]*\bcontinued\b/.test(attrs) || !current) {
					current = {
						anchor: runIn,
						segments: [],
						chars: 0,
						idAt:
							!runIn && !/\bid="/.test(attrs) ? { piece, at: m.index + 1 + name.length } : undefined
					};
					paragraphs.push(current);
				}
				runIn = '';
			} else if (outside) {
				// a box, a figure, a table: what follows is a new paragraph
				current = undefined;
				if (tag !== 'div' || !/\bclass="[^"]*\bequation\b/.test(attrs)) runIn = '';
			}
			const para = tag === 'p' || tag === 'li';
			open.push({
				name: tag,
				free: !CLOSED_TAGS.test(tag) && !CLOSED_CLASSES.test(attrs),
				para
			});
			// an equation between two parts of a paragraph keeps the paragraph open
			if (outside && tag === 'div' && /\bclass="[^"]*\bequation\b/.test(attrs) && paragraphs.length)
				current = paragraphs[paragraphs.length - 1];
		}
		take(html.length);
	});
	// a paragraph without a run-in heading is named by its first words of prose, as such a heading is by its own
	for (const p of paragraphs)
		if (!p.anchor) {
			const words = p.segments
				.map((s) => s.text)
				.join('')
				.replace(/&[a-z]+;|&#\d+;/g, ' ')
				.split(/\s+/)
				.filter((w) => /[\p{L}\p{N}]/u.test(w))
				.slice(0, ANCHOR_WORDS)
				.join(' ');
			p.anchor = ids(`p:${slugify(words)}`);
		}
	return paragraphs;
}

/**
 * Gives the paragraphs of a section their anchors and glosses its terms, by the rule at the top of this file.
 * `pieces` are the stretches of the section's HTML between its figures, in order.
 */
export function glossSection(
	pieces: readonly string[],
	terms: readonly GlossTerm[],
	options: Partial<GlossOptions> = {}
): Glossed {
	const density = options.density ?? GLOSS_DENSITY;
	const { find, termOf } = compiled(terms);
	const core = new Set(options.core ?? []);
	const isCore = (t: GlossTerm) => core.has(t.term);

	const keys = uniqueIds();
	const keyOf = new Map<GlossTerm, string>();
	const glossed = new Set<GlossTerm>();
	/** how many paragraphs have left each term out */
	const missed = new Map<GlossTerm, number>();
	const MAX_MISSED = 2;
	const edits: { piece: number; at: number; end: number; insert: (text: string) => string }[] = [];
	const report: GlossParagraph[] = [];
	const paragraphs = paragraphsOf(pieces, options.ids ?? uniqueIds());

	for (const p of paragraphs) {
		if (p.idAt) {
			const anchor = p.anchor;
			edits.push({
				...p.idAt,
				at: p.idAt.at,
				end: p.idAt.at,
				insert: () => ` id="${esc(anchor)}"`
			});
		}
		// the first use in this paragraph of each term not yet glossed
		const seen = new Map<GlossTerm, { segment: Segment; index: number; text: string }>();
		if (find)
			for (const segment of p.segments)
				for (const m of segment.text.matchAll(find)) {
					const term = termOf(m[0]);
					if (
						term &&
						!glossed.has(term) &&
						!seen.has(term) &&
						(isCore(term) || (missed.get(term) ?? 0) < MAX_MISSED)
					)
						seen.set(term, { segment, index: m.index, text: m[0] });
				}
		const budget = Math.max(1, Math.floor(p.chars / density.charsPerGloss));
		const words = (t: GlossTerm) => t.term.split(/\s+/).length;
		const ranked = [...seen.entries()].sort(
			([a, x], [b, y]) =>
				Number(isCore(b)) - Number(isCore(a)) ||
				words(b) - words(a) ||
				b.term.length - a.term.length ||
				x.segment.offset + x.index - (y.segment.offset + y.index)
		);
		const taken: { term: GlossTerm; at: number }[] = [];
		const deferred: string[] = [];
		for (const [term, use] of ranked) {
			const at = use.segment.offset + use.index;
			const full = !isCore(term) && taken.length >= budget;
			if (full || taken.some((t) => Math.abs(t.at - at) < density.minGap)) {
				deferred.push(term.term);
				missed.set(term, (missed.get(term) ?? 0) + 1);
				continue;
			}
			taken.push({ term, at });
			glossed.add(term);
			if (!keyOf.has(term)) keyOf.set(term, term.key ?? keys(slugify(term.term)));
			const key = keyOf.get(term)!;
			const start = use.segment.start + use.index;
			edits.push({
				piece: use.segment.piece,
				at: start,
				end: start + use.text.length,
				insert: (text) =>
					`<a class="gloss" href="${esc(term.href)}" data-gloss="${esc(key)}">${text}</a>`
			});
		}
		taken.sort((a, b) => a.at - b.at);
		report.push({
			anchor: p.anchor,
			chars: p.chars,
			budget,
			terms: taken.map((t) => t.term.term),
			deferred
		});
	}

	const out = pieces.map((html, piece) => {
		const mine = edits.filter((e) => e.piece === piece).sort((a, b) => b.at - a.at);
		for (const e of mine)
			html = html.slice(0, e.at) + e.insert(html.slice(e.at, e.end)) + html.slice(e.end);
		return html;
	});
	return {
		pieces: out,
		used: [...keyOf.entries()].map(([t, key]) => ({ key, term: t.term })),
		paragraphs: report
	};
}

/** The glossary as one pattern, made once for each list of terms (the paper's sections share one). */
const patterns = new WeakMap<
	readonly GlossTerm[],
	{ find?: RegExp; termOf: (text: string) => GlossTerm | undefined }
>();
function compiled(terms: readonly GlossTerm[]) {
	const hit = patterns.get(terms);
	if (hit) return hit;
	const usable = terms.filter((t) => t.term.length >= 3 && /^[\p{L}]/u.test(t.term));
	const byForm = new Map<string, GlossTerm>();
	for (const t of usable) if (!byForm.has(normal(t.term))) byForm.set(normal(t.term), t);
	const sorted = [...byForm.values()].sort((a, b) => b.term.length - a.term.length);
	const find = sorted.length
		? new RegExp(
				`(?<![\\p{L}\\p{N}\\-])(?:${sorted.map((t) => termPattern(t.term)).join('|')})(?:es|s)?(?![\\p{L}\\p{N}\\-])`,
				'gu'
			)
		: undefined;
	const termOf = (text: string): GlossTerm | undefined => {
		const n = normal(text);
		return byForm.get(n) ?? byForm.get(n.replace(/s$/, '')) ?? byForm.get(n.replace(/es$/, ''));
	};
	const made = { find, termOf };
	patterns.set(terms, made);
	return made;
}

/** Where a section runs in the paper's blocks: for each HTML block it touches, the stretch it covers. */
export function sectionSpans(
	blocks: readonly ({ kind: 'html'; html: string } | { kind: 'figure' })[],
	id: string
): { index: number; start: number; end: number }[] {
	const spans: { index: number; start: number; end: number }[] = [];
	let inside = false;
	for (const [index, b] of blocks.entries()) {
		if (b.kind !== 'html') continue;
		let start = 0;
		let from = 0;
		if (!inside) {
			start = b.html.indexOf(`<h2 id="${id}"`);
			if (start < 0) continue;
			inside = true;
			from = start + 1;
		}
		// the next section's heading, which may open the next block
		const next = b.html.indexOf('<h2 ', from);
		spans.push({ index, start, end: next < 0 ? b.html.length : next });
		if (next >= 0) break;
	}
	return spans;
}
