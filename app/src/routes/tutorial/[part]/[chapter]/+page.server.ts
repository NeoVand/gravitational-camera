import { error } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { chapterPage, loadChapter, published } from '#lib/server/sources.js';
import type { EntryGenerator, PageServerLoad } from './$types';

/** Every published chapter has a page; planned and draft ones have none yet. */
export const entries: EntryGenerator = () =>
	published().map((c) => {
		const [part, chapter] = c.slug.split('/');
		return { part, chapter };
	});

export const load: PageServerLoad = ({ params }) => {
	const entry = published().find((c) => c.slug === `${params.part}/${params.chapter}`);
	if (!entry) error(404, 'No such chapter');
	return chapterPage(loadChapter(entry), entry, resolve('/'));
};
