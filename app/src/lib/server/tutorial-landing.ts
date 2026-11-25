/**
 * Everything the tutorial's landing page (/tutorial) shows, from the catalogue, the paper's equation numbers and
 * the margin map. The choices themselves (pictures, sentences, reading times) are in lib/tutorial/landing.ts.
 */
import { allChapters } from '#lib/tutorial/catalogue.js';
import {
	PART_LINES,
	PART_PICTURES,
	ROUTE_POSTERS,
	destination,
	equationWall,
	readingMinutes,
	readingTime
} from '#lib/tutorial/landing.js';
import type { LandingChapter, LandingPart, LandingRoute } from '#lib/tutorial/landing.js';
import { paperLinks } from '#lib/tutorial/paper-links.js';
import { catalogue, chapterHref, glossary, paperIndex, symbols } from './sources.js';

export function tutorialLanding() {
	const cat = catalogue();
	const chapters = new Map(
		cat.parts.flatMap((p) =>
			p.chapters.map((c): [string, LandingChapter & { size: typeof c.size }] => [
				c.id,
				{
					id: c.id,
					title: c.title,
					part: p.id,
					reading: c.id.startsWith('R'),
					href: chapterHref(c.id),
					size: c.size
				}
			])
		)
	);
	const dot = (id: string): LandingChapter => {
		const c = chapters.get(id);
		if (!c) throw new Error(`tutorial landing: no chapter ${id}`);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { size, ...rest } = c;
		return rest;
	};

	const parts: LandingPart[] = cat.parts.map((p) => {
		const picture = PART_PICTURES[p.id];
		const line = PART_LINES[p.id];
		if (!picture || !line) throw new Error(`tutorial landing: part ${p.id} has no picture or line`);
		return {
			id: p.id,
			title: p.title,
			line,
			picture,
			href: chapterHref(p.chapters[0].id),
			chapters: p.chapters.map((c) => dot(c.id))
		};
	});

	const routes: LandingRoute[] = cat.routes.map((r) => {
		const poster = ROUTE_POSTERS[r.id];
		if (!poster) throw new Error(`tutorial landing: route ${r.id} has no picture`);
		const minutes = readingMinutes(r.chapters.map((id) => chapters.get(id)!));
		return {
			id: r.id,
			destination: destination(r.title),
			poster,
			minutes,
			time: readingTime(minutes),
			href: chapterHref(r.chapters[0]),
			chapters: r.chapters.map(dot)
		};
	});

	const tiles = equationWall(paperIndex().equations, paperLinks).map((t) => {
		const c = dot(t.chapter);
		return {
			number: t.number,
			derived: t.derived,
			chapter: t.chapter,
			title: c.title,
			part: c.part,
			href: chapterHref(t.chapter, t.section)
		};
	});

	return {
		parts,
		routes,
		equations: {
			tiles,
			derived: tiles.filter((t) => t.derived).length,
			total: tiles.length
		},
		counts: {
			chapters: allChapters(cat).length,
			parts: cat.parts.length,
			terms: glossary().length,
			symbols: symbols().length
		}
	};
}

export type TutorialLanding = ReturnType<typeof tutorialLanding>;
