/**
 * The paper page's side notes and glosses: every note's anchor, chapter section and drawing exists, each section's
 * notes stand in the order of its text, and the glosses keep to their rule in every section.
 */
import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GLOSS_DENSITY } from '#lib/paper/glosses.js';
import { paperNotes } from '#lib/server/paper-notes.js';
import { chapterById, loadChapter, tutorialFigures } from '#lib/server/sources.js';
import { sideNotes } from './side-notes/index';

const notes = paperNotes();
const paragraphsOf = (section: string) =>
	notes.sections.find((s) => s.id === section)?.paragraphs.map((p) => p.anchor) ?? [];

describe('the side notes', () => {
	it('come one file to a section, named after it', () => {
		const files = readdirSync(new URL('./side-notes/', import.meta.url)).filter(
			(f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f)
		);
		expect(files.map((f) => f.slice(0, -3).replace('-', ':')).sort()).toEqual(
			Object.keys(sideNotes).sort()
		);
	});

	it('stand beside paragraphs the paper has, one note each, in the order of the text', () => {
		const wrong: string[] = [];
		for (const [section, list] of Object.entries(sideNotes)) {
			const anchors = paragraphsOf(section);
			const at = list.map((n) => anchors.indexOf(n.anchor));
			list.forEach((n, i) => at[i] < 0 && wrong.push(`${section}: no paragraph "${n.anchor}"`));
			if ([...at].sort((a, b) => a - b).join() !== at.join())
				wrong.push(`${section}: not in the order of the text`);
			if (new Set(at).size !== at.length) wrong.push(`${section}: two notes beside one paragraph`);
		}
		expect(wrong).toEqual([]);
		// Section II has a note beside every paragraph of its text
		expect(sideNotes['sec:pixel'].map((n) => n.anchor)).toEqual(paragraphsOf('sec:pixel'));
	});

	it('link to published chapters, at sections those chapters have, and show drawings that exist', () => {
		const drawings = tutorialFigures();
		const wrong: string[] = [];
		for (const n of Object.values(sideNotes).flat()) {
			const c = chapterById(n.chapter);
			if (c?.status !== 'published') {
				wrong.push(`${n.anchor}: ${n.chapter} is not published`);
				continue;
			}
			if (n.section) {
				const html = loadChapter(c)
					.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
					.join('\n');
				if (!html.includes(`id="${n.section}"`))
					wrong.push(`${n.anchor}: ${n.chapter} has no #${n.section}`);
			}
			if (n.figure && !drawings.has(n.figure.name))
				wrong.push(`${n.anchor}: no ${n.figure.name}.svg`);
		}
		expect(wrong).toEqual([]);
		expect(notes.notes).toHaveLength(Object.values(sideNotes).flat().length);
	});

	it('are short: at most three sentences and sixty words each', () => {
		for (const n of Object.values(sideNotes).flat()) {
			expect(n.text.split(/\s+/).length, n.anchor).toBeLessThanOrEqual(60);
			expect(n.text.split(/[.;:]\s+(?=[A-Z])/).length, n.anchor).toBeLessThanOrEqual(3);
		}
	});
});

describe('the glosses of the paper', () => {
	const html = notes.blocks.map((b) => (b.kind === 'html' ? b.html : '')).join('\n');

	it('give each glossed term one card, leading to a published chapter', () => {
		const keys = new Set([...html.matchAll(/data-gloss="([^"]+)"/g)].map((m) => m[1]));
		expect(keys.size).toBeGreaterThan(50);
		expect(notes.glosses.map((g) => g.key).sort()).toEqual([...keys].sort());
		for (const g of notes.glosses) {
			expect(chapterById(g.chapter)?.status, g.term).toBe('published');
			expect(g.href, g.term).toMatch(/^\/tutorial\//);
		}
	});

	it('gloss each term at most once in a section, and keep to the density but for the core terms', () => {
		for (const { id, paragraphs } of notes.sections) {
			const terms = paragraphs.flatMap((p) => p.terms);
			expect(new Set(terms).size, id).toBe(terms.length);
			for (const p of paragraphs)
				expect(p.budget, p.anchor).toBe(
					Math.max(1, Math.floor(p.chars / GLOSS_DENSITY.charsPerGloss))
				);
		}
	});

	it('give every paragraph of the page its own anchor', () => {
		const anchors = notes.sections.flatMap((s) => s.paragraphs.map((p) => p.anchor));
		expect(new Set(anchors).size).toBe(anchors.length);
		for (const a of anchors) expect(html, a).toContain(`id="${a}"`);
	});

	it('leave the plain-words boxes and the headings as they were', () => {
		for (const box of html.match(/<details class="plain">[\s\S]*?<\/details>/g) ?? [])
			expect(box).not.toContain('class="gloss"');
		for (const h of html.match(/<h[24][^>]*>.*?<\/h[24]>/g) ?? []) expect(h).not.toContain('gloss');
	});
});
