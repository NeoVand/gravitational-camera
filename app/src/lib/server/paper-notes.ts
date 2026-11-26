/**
 * The paper page's notes from the tutorial, made at build time (design/book/BOOK-PLAN.md §6): the paper's HTML with
 * every paragraph anchored and the glossary's terms glossed in every section (lib/paper/glosses.ts), the cards the
 * glosses open, and the side notes beside the paragraphs (lib/tutorial/side-notes/). The paper's loader puts them in
 * the page, so that they are in its HTML from the first paint.
 */
import { CORE_TERMS, GLOSS_DENSITY, glossSection, sectionSpans } from '#lib/paper/glosses.js';
import type { GlossCard, GlossDensity, GlossParagraph, GlossTerm } from '#lib/paper/glosses.js';
import type { RenderedPaper } from '#lib/paper/render.js';
import { slugify, uniqueIds } from '#lib/render/pandoc.js';
import { sideNotes } from '#lib/tutorial/side-notes/index.js';
import type { SideNote, SideNoteView } from '#lib/tutorial/side-notes/index.js';
import {
	chapterById,
	chapterHref,
	glossary,
	paperRendered,
	textHtml,
	tutorialFigures
} from './sources';

export interface PaperNotes {
	/** the paper's blocks, with the paragraphs' anchors and the glosses */
	blocks: RenderedPaper['blocks'];
	/** one card for each term glossed anywhere */
	glosses: GlossCard[];
	/** the side notes, in the order of the paper */
	notes: SideNoteView[];
	/** what the glossing did, section by section and paragraph by paragraph */
	sections: { id: string; paragraphs: GlossParagraph[] }[];
}

/** The ids of the paper's sections, in order: every second-level heading of its text. */
const sectionIds = (paper: RenderedPaper): string[] =>
	paper.blocks.flatMap((b) =>
		b.kind === 'html' ? [...b.html.matchAll(/<h2 id="([^"]+)"/g)].map((m) => m[1]) : []
	);

export function makePaperNotes(
	paper: RenderedPaper,
	notesBySection: Readonly<Record<string, readonly SideNote[]>> = sideNotes,
	density: GlossDensity = GLOSS_DENSITY
): PaperNotes {
	const keys = uniqueIds();
	const entries = glossary().flatMap((g) => {
		const href = chapterHref(g.chapter, g.anchor);
		return href ? [{ entry: g, term: { term: g.term, href, key: keys(slugify(g.term)) } }] : [];
	});
	const terms: GlossTerm[] = entries.map((e) => e.term);
	const entryOf = new Map(entries.map((e) => [e.term.term, e.entry]));
	const figures = tutorialFigures();

	const html = paper.blocks.map((b) => (b.kind === 'html' ? b.html : ''));
	const cards = new Map<string, GlossCard>();
	const notes: SideNoteView[] = [];
	const sections: PaperNotes['sections'] = [];
	// the paragraphs' anchors are handed out across the whole page, so that no two are the same
	const ids = uniqueIds();

	const ordered = sectionIds(paper);
	for (const section of Object.keys(notesBySection))
		if (!ordered.includes(section))
			throw new Error(`side-notes: the paper has no section "${section}"`);

	for (const id of ordered) {
		// found in the blocks as glossed so far, since a block may hold the end of one section and the start of the next
		const spans = sectionSpans(
			paper.blocks.map((b, i) =>
				b.kind === 'html' ? { kind: 'html' as const, html: html[i] } : b
			),
			id
		);
		const done = glossSection(
			spans.map((s) => html[s.index].slice(s.start, s.end)),
			terms,
			{ density, core: CORE_TERMS, ids }
		);
		spans.forEach((s, k) => {
			html[s.index] = html[s.index].slice(0, s.start) + done.pieces[k] + html[s.index].slice(s.end);
		});
		for (const { key, term } of done.used) {
			if (cards.has(key)) continue;
			const g = entryOf.get(term)!;
			const c = chapterById(g.chapter)!;
			cards.set(key, {
				key,
				term,
				definitionHtml: g.definitionHtml,
				chapter: c.id,
				titleHtml: textHtml(c.title),
				href: chapterHref(c.id, g.anchor)!
			});
		}
		sections.push({ id, paragraphs: done.paragraphs });

		const anchors = new Set(done.paragraphs.map((p) => p.anchor));
		for (const note of notesBySection[id] ?? []) {
			if (!anchors.has(note.anchor))
				throw new Error(`side-notes: ${id} has no paragraph "${note.anchor}"`);
			const href = chapterHref(note.chapter, note.section);
			if (!href) continue; // a chapter not published: no note
			if (note.figure && !figures.has(note.figure.name))
				throw new Error(`side-notes: no drawing tutorial/figures/${note.figure.name}.svg`);
			const c = chapterById(note.chapter)!;
			notes.push({
				anchor: note.anchor,
				html: textHtml(note.text),
				href,
				where: `${c.short}, ${c.id}`,
				figure: note.figure
			});
		}
	}
	return {
		blocks: paper.blocks.map((b, i) => (b.kind === 'html' ? { ...b, html: html[i] } : b)),
		glosses: [...cards.values()],
		notes,
		sections
	};
}

/** The notes for the paper as it is now, made once for each rendering of it. */
let kept: { paper: RenderedPaper; notes: PaperNotes } | undefined;
export function paperNotes(): PaperNotes {
	const paper = paperRendered();
	if (kept?.paper !== paper) kept = { paper, notes: makePaperNotes(paper) };
	return kept.notes;
}
