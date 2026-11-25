/**
 * Where the paper meets the tutorial: the paper's anchors (section ids, run-in paragraph ids "par:…", equation
 * labels, figure ids) that a tutorial chapter gives the background for. The paper page shows each as a note in its
 * right margin at 1240px and wider ("Background · Tides, 1.4"), opening a preview of the chapter on hover or
 * focus, and as a small chip after its heading on narrower screens. Only links to published chapters show.
 */

export interface PaperLink {
	/** the paper's anchor: "eq:tidal", "sec:pixel", "par:the-earths-own-tide", "fig:tidal" */
	anchor: string;
	/** the tutorial chapter's id, as parts.yaml numbers it */
	chapter: string;
	/** what the chapter is to this place in the paper: "Reading", "Derivation", "Background" or "Live" (paper-map.ts) */
	label: string;
	/** a section id within the chapter, if the link should land there */
	section?: string;
}

/**
 * The production map, in the order of the paper: one note for every section, run-in paragraph, numbered equation,
 * figure and table, generated from the tutorial's records by scripts/paper-links.mjs (the rules are in paper-map.ts).
 */
export { paperLinks } from './paper-links.generated';

/** The same seed against the sample chapter (tutorial/_fixtures/sample.md, id X.1), for tests only. */
export const fixturePaperLinks: PaperLink[] = [
	{ anchor: 'eq:tidal', chapter: 'X.1', label: 'Background' },
	{ anchor: 'eq:newton', chapter: 'X.1', label: 'Background' }
];

/** What the paper page needs of a chapter to show a note and its preview. */
export interface MarginChapter {
	id: string;
	short: string;
	href: string;
	titleHtml: string;
	questionHtml: string;
	equationHtml: string;
}

/** One note, ready to place. */
export interface MarginNote {
	anchor: string;
	href: string;
	/** "Background · Tides, 1.4", or "Reading Section II, R1" where the short title already names the label */
	text: string;
	label: string;
	chapter: MarginChapter;
}

/**
 * The notes to show: one per link whose chapter is published (`chapters` holds only those) and whose anchor the
 * paper has. An anchor the paper lacks is an error, so that a renamed label cannot silently drop a note.
 */
export function marginNotes(
	links: readonly PaperLink[],
	chapters: ReadonlyMap<string, MarginChapter>,
	paperAnchors: ReadonlySet<string>
): MarginNote[] {
	return links.flatMap((link) => {
		if (!paperAnchors.has(link.anchor))
			throw new Error(`paper-links.ts: the paper has no anchor "${link.anchor}"`);
		const chapter = chapters.get(link.chapter);
		if (!chapter) return [];
		return [
			{
				anchor: link.anchor,
				href: chapter.href + (link.section ? `#${link.section}` : ''),
				// "Reading Section IV (1), R2" says it is a reading without "Reading · " before it
				text: chapter.short.startsWith(`${link.label} `)
					? `${chapter.short}, ${chapter.id}`
					: `${link.label} · ${chapter.short}, ${chapter.id}`,
				label: link.label,
				chapter
			}
		];
	});
}
