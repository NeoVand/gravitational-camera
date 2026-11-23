import { resolve } from '$app/paths';
import { SAMPLE_FILE, chapterPage, renderChapterFile } from '#lib/server/sources.js';
import type { PageServerLoad } from './$types';

/**
 * The tutorial's test chapter (tutorial/_fixtures/sample.md), which uses every kind of block a chapter can hold.
 * Not linked from anywhere and not indexed; the end-to-end tests read it.
 */
export const load: PageServerLoad = () =>
	chapterPage(renderChapterFile(SAMPLE_FILE), undefined, resolve('/'));
