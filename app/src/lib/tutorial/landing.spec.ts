/** The tutorial's landing page: its pictures, reading times and the wall of the paper's equations. */
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { catalogue, paperIndex, tutorialFigures } from '#lib/server/sources.js';
import { tutorialLanding } from '#lib/server/tutorial-landing.js';
import {
	MINUTES,
	PART_LINES,
	PART_PICTURES,
	ROUTE_POSTERS,
	destination,
	equationWall,
	partsLacking,
	readingMinutes,
	readingTime
} from './landing';
import { paperLinks } from './paper-links';

describe('reading time', () => {
	it('adds the chapters by size', () => {
		expect(readingMinutes([{ size: 'S' }, { size: 'M' }, { size: 'L' }])).toBe(
			MINUTES.S + MINUTES.M + MINUTES.L
		);
		expect(readingMinutes([])).toBe(0);
	});

	it('says hours to the nearest half hour', () => {
		expect(readingTime(20)).toBe('about half an hour');
		expect(readingTime(50)).toBe('about 1 hour');
		expect(readingTime(80)).toBe('about 1½ hours');
		expect(readingTime(860)).toBe('about 14½ hours');
		expect(readingTime(1740)).toBe('about 29 hours');
	});

	it('names a route by its destination', () => {
		expect(destination('To Section IV, the near field')).toBe('Section IV, the near field');
		expect(destination('To Sections XII to XV, what a field keeps')).toBe(
			'Sections XII to XV, what a field keeps'
		);
	});
});

describe('the wall of equations', () => {
	const equations = new Map([
		['eq:a', { number: '1' }],
		['eq:b', { number: '2' }],
		['eq:b2', { number: '2' }],
		['eq:c', { number: '10' }]
	]);

	it('orders the equations by number and prefers the label that is derived', () => {
		const wall = equationWall(equations, [
			{ anchor: 'eq:c', chapter: '3.1', label: 'Background' },
			{ anchor: 'eq:b', chapter: '1.2', label: 'Background' },
			{ anchor: 'eq:b2', chapter: '1.4', label: 'Derivation', section: 'there' },
			{ anchor: 'eq:a', chapter: '1.1', label: 'Derivation' }
		]);
		expect(wall.map((t) => t.number)).toEqual(['1', '2', '10']);
		expect(wall[1]).toEqual({
			number: '2',
			label: 'eq:b2',
			derived: true,
			chapter: '1.4',
			section: 'there'
		});
		expect(wall[2]).toMatchObject({ derived: false, chapter: '3.1' });
	});

	it('fails on an equation without a chapter', () => {
		expect(() =>
			equationWall(equations, [{ anchor: 'eq:a', chapter: '1.1', label: 'Derivation' }])
		).toThrow(/equation 2 .* has no chapter/);
	});

	it('has one tile for every numbered equation of the paper, each with a chapter', () => {
		const numbers = new Set([...paperIndex().equations.values()].map((e) => e.number));
		const { equations: wall } = tutorialLanding();
		expect(wall.total).toBe(numbers.size);
		expect(wall.tiles.map((t) => t.number)).toEqual(
			[...numbers].sort((a, b) => Number(a) - Number(b))
		);
		const derived = wall.tiles.filter((t) => t.derived).length;
		expect(wall.derived).toBe(derived);
		// the paper's margin map calls these "Derivation"; every other equation is read
		expect(derived).toBe(
			equationWall(paperIndex().equations, paperLinks).filter((t) => t.derived).length
		);
		expect(derived).toBeGreaterThan(wall.total / 2);
		for (const t of wall.tiles) expect(t.href, `equation ${t.number}`).toMatch(/^\/tutorial\//);
	});
});

describe('pictures', () => {
	it('gives every part a picture and a sentence', () => {
		const cat = catalogue();
		expect(cat.parts).toHaveLength(14);
		expect(partsLacking(cat)).toEqual([]);
		expect(Object.keys(PART_PICTURES).sort()).toEqual(cat.parts.map((p) => p.id).sort());
		expect(Object.keys(PART_LINES).sort()).toEqual(cat.parts.map((p) => p.id).sort());
	});

	it('finds every picture it names', () => {
		const figures = tutorialFigures();
		for (const [part, p] of Object.entries(PART_PICTURES)) {
			if (p.kind === 'drawing') expect(figures.has(p.name), `part ${part}: ${p.name}`).toBe(true);
			else expect(existsSync(`static/posters/${p.slug}.jpg`), `part ${part}: ${p.slug}`).toBe(true);
			expect(p.alt.length, `part ${part}`).toBeGreaterThan(10);
		}
		for (const [route, slug] of Object.entries(ROUTE_POSTERS))
			expect(existsSync(`static/posters/${slug}.jpg`), `route ${route}: ${slug}`).toBe(true);
	});

	it('gives every route a picture, its length and its time', () => {
		const cat = catalogue();
		const sizes = new Map(cat.parts.flatMap((p) => p.chapters.map((c) => [c.id, c])));
		const { routes, parts } = tutorialLanding();
		expect(routes.map((r) => r.id)).toEqual(cat.routes.map((r) => r.id));
		for (const [i, r] of routes.entries()) {
			expect(ROUTE_POSTERS[r.id], r.id).toBe(r.poster);
			expect(r.chapters.map((c) => c.id)).toEqual(cat.routes[i].chapters);
			expect(r.minutes).toBe(readingMinutes(cat.routes[i].chapters.map((id) => sizes.get(id)!)));
			expect(r.time).toBe(readingTime(r.minutes));
			expect(r.destination).not.toMatch(/^To /);
		}
		// every part opens on its first chapter
		for (const p of parts) expect(p.href, `part ${p.id}`).toBe(p.chapters[0].href);
	});
});
