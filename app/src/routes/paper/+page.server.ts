import { resolve } from '$app/paths';
import { paperNotes } from '#lib/server/paper-notes.js';
import { paperMargin, paperRendered, underRoot } from '#lib/server/sources.js';
import { paperLinks } from '#lib/tutorial/paper-links.js';
import type { PageServerLoad } from './$types';

/**
 * The paper lives in /paper as LaTeX. pandoc parses it; the site renders the
 * parse tree (lib/server/sources.ts). This runs when the page is prerendered,
 * and on every request in development, so edits to the .tex files show up on
 * reload. The margin holds the tutorial's notes for its published chapters,
 * and beside the paragraphs its side notes; the text glosses the glossary's
 * terms (lib/server/paper-notes.ts). The plain-words boxes and the glosses
 * link into the tutorial from the site's root, which the published site moves
 * under its base path.
 */
export const load: PageServerLoad = () => {
	const paper = paperRendered();
	const notes = paperNotes();
	const root = resolve('/');
	return {
		paper: {
			...paper,
			blocks: notes.blocks.map((b) =>
				b.kind === 'html' ? { ...b, html: underRoot(b.html, root) } : b
			)
		},
		margin: paperMargin(paperLinks),
		sideNotes: notes.notes,
		glosses: notes.glosses
	};
};
