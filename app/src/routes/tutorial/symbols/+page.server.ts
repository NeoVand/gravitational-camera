import { chapterRef, symbols } from '#lib/server/sources.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	symbols: symbols().map((s) => ({ ...s, defined: chapterRef(s.chapter) }))
});
