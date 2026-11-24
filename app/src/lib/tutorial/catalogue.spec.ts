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
	}, 180_000);
});

describe('the glossary and the symbol cards', () => {
	it('point into published chapters only at sections those chapters have', async () => {
		const { glossary, symbols } = await import('#lib/server/sources.js');
		const ids = new Map<string, Set<string>>();
		for (const c of published()) {
			const chapter = loadChapter(c);
			const html = chapter.blocks.map((b) => (b.kind === 'html' ? b.html : '')).join('\n');
			ids.set(c.id, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
		}
		const broken = [
			...glossary().map((g) => ({ name: g.term, chapter: g.chapter, anchor: g.anchor })),
			...symbols().map((s) => ({ name: s.key, chapter: s.chapter, anchor: s.anchor }))
		].filter((e) => e.anchor && ids.has(e.chapter) && !ids.get(e.chapter)!.has(e.anchor));
		expect(broken).toEqual([]);
	}, 180_000);
});

describe('links between chapters', () => {
	it('point only at sections the linked chapter has, when it is published', () => {
		const chapters = published().map((c) => {
			const chapter = loadChapter(c);
			const html = chapter.blocks
				.map((b) => {
					if (b.kind === 'html') return b.html;
					if (b.kind === 'try') return b.introHtml;
					if (b.kind === 'figure') return b.captionHtml;
					return '';
				})
				.join('\n');
			const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
			return { id: c.id, href: `/tutorial/${c.slug}/`, html, ids };
		});
		const byHref = new Map(chapters.map((c) => [c.href, c]));
		const broken: string[] = [];
		let seen = 0;
		for (const c of chapters)
			for (const m of c.html.matchAll(/href="(\/tutorial\/[^"#]+\/)#([^"]+)"/g)) {
				seen++;
				const target = byHref.get(m[1]);
				if (target && !target.ids.has(m[2])) broken.push(`${c.id} → ${m[1]}#${m[2]}`);
			}
		expect(seen).toBeGreaterThan(50);
		expect(broken).toEqual([]);
	}, 180_000);
});
