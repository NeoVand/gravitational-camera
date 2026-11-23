import { chapterRef, glossary } from '#lib/server/sources.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	terms: glossary().map((t) => ({ ...t, defined: chapterRef(t.chapter) }))
});
