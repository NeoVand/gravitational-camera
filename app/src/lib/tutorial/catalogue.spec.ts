/** tutorial/parts.yaml: well formed, routes made of real chapters, and the route check itself. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { catalogue, loadChapter, paperContext, published } from '#lib/server/sources.js';
import { allChapters, parseCatalogue, routeGaps } from './catalogue';

const raw = () => parse(readFileSync('../tutorial/parts.yaml', 'utf8'));

describe('parts.yaml', () => {
	it('parses, with every reading chapter reading a section the paper has', () => {
		const c = parseCatalogue(raw(), new Set(paperContext().index.labels.keys()));
		expect(c.parts).toHaveLength(14);
		expect(allChapters(c).find((ch) => ch.id === '1.4')).toMatchObject({
			slug: 'newton/tides',
			short: 'Tides'
		});
		expect(c.routes.map((r) => r.id)).toContain('section-iv');
	});

	it('fails on a repeated id, a wrong slug, an unknown status, a route to nowhere', () => {
		const base = () =>
			raw() as {
				parts: { chapters: Record<string, unknown>[] }[];
				routes: { chapters: string[] }[];
			};
		let bad = base();
		bad.parts[1].chapters[1].id = bad.parts[1].chapters[0].id;
		expect(() => parseCatalogue(bad)).toThrow(/used twice/);
		bad = base();
		bad.parts[1].chapters[0].slug = 'elsewhere/x';
		expect(() => parseCatalogue(bad)).toThrow(/should be "newton\//);
		bad = base();
		bad.parts[0].chapters[0].status = 'finished';
		expect(() => parseCatalogue(bad)).toThrow(/unknown status/);
		bad = base();
		bad.routes[0].chapters.push('99.9');
		expect(() => parseCatalogue(bad)).toThrow(/no chapter 99.9/);
		expect(() => parseCatalogue(raw(), new Set(['sec:pixel']))).toThrow(/has no section/);
	});
});

describe('a route', () => {
	it('lacks every chapter its chapters require, however indirectly', () => {
		const route = { id: 'r', title: 'R', chapters: ['1.2', '1.4'] };
		const requires = { '1.4': ['1.2', '1.3'], '1.3': ['1.1'] };
		expect(routeGaps(route, requires)).toEqual([
			{ chapter: '1.4', lacks: '1.3' },
			{ chapter: '1.4', lacks: '1.1' }
		]);
		expect(routeGaps({ ...route, chapters: ['1.1', '1.2', '1.3', '1.4'] }, requires)).toEqual([]);
	});
});

describe('the routes of parts.yaml', () => {
	it('hold every chapter that their published chapters require', () => {
		const requires = Object.fromEntries(
			published().map((c) => [c.id, loadChapter(c).meta.requires])
		);
		for (const route of catalogue().routes)
			expect(routeGaps(route, requires), route.id).toEqual([]);
	});
});
