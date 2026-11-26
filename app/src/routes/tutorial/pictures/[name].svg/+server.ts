/**
 * The tutorial's drawings that the landing page and the paper's side notes show, each as the chapters inline it
 * (themed by the site's colour variables), for the page to fetch and inline as a picture nears the screen: the
 * drawings carry rendered stone and run to several hundred kilobytes each, too much to put in the page itself.
 */
import { error } from '@sveltejs/kit';
import { PART_PICTURES } from '#lib/tutorial/landing.js';
import { sideNoteDrawings } from '#lib/tutorial/side-notes/index.js';
import { tutorialFigures } from '#lib/server/sources.js';
import type { EntryGenerator, RequestHandler } from './$types';

const shown = () => [
	...new Set([
		...Object.values(PART_PICTURES).flatMap((p) => (p.kind === 'drawing' ? [p.name] : [])),
		...sideNoteDrawings()
	])
];

export const prerender = true;
export const trailingSlash = 'never';

export const entries: EntryGenerator = () => shown().map((name) => ({ name }));

export const GET: RequestHandler = ({ params }) => {
	const svg = shown().includes(params.name) ? tutorialFigures().get(params.name) : undefined;
	if (!svg) error(404, `No drawing ${params.name}`);
	return new Response(svg, {
		headers: { 'content-type': 'image/svg+xml; charset=utf-8' }
	});
};
