/**
 * Where the paper meets the tutorial: the paper's anchors (section ids, run-in paragraph ids "par:…", equation
 * labels, figure ids) that a tutorial chapter gives the background for. The paper page shows each as a note in its
 * right margin at 1240px and wider ("Background · Tides, 1.4"), opening a preview of the chapter on hover or
 * focus, and as a small chip after its heading on narrower screens. Only links to published chapters show, so an
 * entry can be written before its chapter is.
 */

export interface PaperLink {
	/** the paper's anchor: "eq:tidal", "sec:pixel", "par:the-earths-own-tide", "fig:tidal" */
	anchor: string;
	/** the tutorial chapter's id, as parts.yaml numbers it */
	chapter: string;
	/** what the chapter is to this place in the paper: "Background", "Derivation", "Numbers" */
	label: string;
	/** a section id within the chapter, if the link should land there */
	section?: string;
}

/** The production map, in the order of the paper. */
export const paperLinks: PaperLink[] = [
	{ anchor: 'eq:tidal', chapter: '1.4', label: 'Background' },
	{ anchor: 'eq:newton', chapter: '1.4', label: 'Derivation' },
	{ anchor: 'eq:tidal-brightness', chapter: '1.4', label: 'Numbers' },
	{ anchor: 'eq:evanescent', chapter: '3.7', label: 'Background' },
	{ anchor: 'eq:cutoff', chapter: '3.7', label: 'Derivation' },
	{ anchor: 'eq:resolution', chapter: '3.7', label: 'Derivation' }
];

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
	/** "Background · Tides, 1.4" */
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
				text: `${link.label} · ${chapter.short}, ${chapter.id}`,
				label: link.label,
				chapter
			}
		];
	});
}
