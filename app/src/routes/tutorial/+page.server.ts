import {
	catalogue,
	chapterRef,
	glossary,
	paperContext,
	rail,
	symbols
} from '#lib/server/sources.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const numbered = new Set([...paperContext().index.equations.values()].map((e) => e.number));
	return {
		parts: rail(),
		routes: catalogue().routes.map((r) => ({
			id: r.id,
			title: r.title,
			chapters: r.chapters.map(chapterRef)
		})),
		ledger: { equations: numbered.size, derived: 0 },
		counts: { terms: glossary().length, symbols: symbols().length }
	};
};
