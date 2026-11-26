import { resolve } from '$app/paths';
import {
	SAMPLE_FILE,
	SAMPLE_HREF,
	marginChapter,
	paperMargin,
	paperRendered,
	renderChapterFile,
	underRoot
} from '#lib/server/sources.js';
import { fixturePaperLinks } from '#lib/tutorial/paper-links.js';
import type { PageServerLoad } from './$types';

/**
 * Section II of the paper on the paper's own page, with the tutorial's margin seeded from the test map
 * (fixturePaperLinks, against the sample chapter). Not linked, not indexed; the end-to-end tests read it, so that
 * the margin is tested on the paper's layout while the real paper page, with an empty map, stays as it was.
 */
export const load: PageServerLoad = () => {
	const paper = paperRendered();
	// the blocks from Section II's heading up to the next section's
	const blocks: typeof paper.blocks = [];
	let inside = false;
	for (const b of paper.blocks) {
		if (b.kind === 'figure') {
			if (inside) blocks.push(b);
			continue;
		}
		let html = b.html;
		if (!inside) {
			const start = html.indexOf('<h2 id="sec:pixel"');
			if (start < 0) continue;
			inside = true;
			html = html.slice(start);
		}
		const end = html.indexOf('<h2 ', 1);
		if (end > 0) {
			blocks.push({ kind: 'html', html: html.slice(0, end) });
			break;
		}
		blocks.push({ kind: 'html', html });
	}
	// links to places outside the excerpt lose their target, so that the page links nowhere it lacks
	const ids = new Set<string>();
	for (const b of blocks)
		if (b.kind === 'figure') ids.add(b.id);
		else for (const m of b.html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
	const local = (html: string) =>
		html.replace(/ href="#([^"]+)"/g, (whole, id: string) => (ids.has(id) ? whole : ''));
	// the plain-words box links into the tutorial from the site's root, which the published site moves under its base
	const root = resolve('/');
	const excerpt = blocks.map((b) =>
		b.kind === 'figure'
			? { ...b, captionHtml: local(b.captionHtml) }
			: { ...b, html: underRoot(local(b.html), root) }
	);
	const sample = renderChapterFile(SAMPLE_FILE);
	return {
		paper: {
			...paper,
			abstractHtml: '',
			blocks: excerpt,
			contents: paper.contents.filter((c) => c.id === 'sec:pixel'),
			referencesHtml: '',
			footnotesHtml: ''
		},
		margin: paperMargin(
			fixturePaperLinks,
			new Map([['X.1', marginChapter(sample, 'A sample', SAMPLE_HREF)]])
		),
		// the excerpt is the paper's text as rendered, without the side notes and glosses of the paper's own page
		sideNotes: [],
		glosses: []
	};
};
