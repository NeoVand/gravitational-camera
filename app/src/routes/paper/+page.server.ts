import { paperMargin, paperRendered } from '#lib/server/sources.js';
import { paperLinks } from '#lib/tutorial/paper-links.js';
import type { PageServerLoad } from './$types';

/**
 * The paper lives in /paper as LaTeX. pandoc parses it; the site renders the
 * parse tree (lib/server/sources.ts). This runs when the page is prerendered,
 * and on every request in development, so edits to the .tex files show up on
 * reload. The margin holds the tutorial's notes for its published chapters.
 */
export const load: PageServerLoad = () => ({
	paper: paperRendered(),
	margin: paperMargin(paperLinks)
});
