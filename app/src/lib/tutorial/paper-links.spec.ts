/** The map from the paper's anchors to the tutorial, and the notes it makes. */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fixturePaperLinks, marginNotes, paperLinks } from './paper-links';
import type { MarginChapter } from './paper-links';
import { FIGURE_OVERRIDES, LABELS, SKIP } from './paper-map';
import { GENERATED, orderedAnchors, paperLinksSource } from '#lib/server/paper-map.js';
import { TUTORIAL_DIR, chapterById, derivations, loadChapter } from '#lib/server/sources.js';

const sample: MarginChapter = {
	id: 'X.1',
	short: 'A sample',
	href: '/dev/tutorial-sample/',
	titleHtml: 'A sample',
	questionHtml: 'Why?',
	equationHtml: ''
};
const anchors = new Set(['eq:tidal', 'eq:newton', 'sec:pixel']);

describe('the margin', () => {
	it('names each place in the paper once, and only chapters of the plan', () => {
		const anchors = paperLinks.map((l) => l.anchor);
		expect(new Set(anchors).size).toBe(anchors.length);
		for (const l of paperLinks) expect(l.chapter).toMatch(/^(R\d+b?|\d+\.\d+b?|A\.\d+)$/);
	});

	it('shows a note for each link to a published chapter, labelled as the plan writes it', () => {
		const notes = marginNotes(fixturePaperLinks, new Map([['X.1', sample]]), anchors);
		expect(notes.map((n) => [n.anchor, n.text])).toEqual([
			['eq:tidal', 'Background · A sample, X.1'],
			['eq:newton', 'Background · A sample, X.1']
		]);
	});

	it('does not repeat the label when the short title begins with it', () => {
		const reading = { ...sample, id: 'R1', short: 'Reading Section II' };
		const [note] = marginNotes(
			[{ anchor: 'sec:pixel', chapter: 'R1', label: 'Reading' }],
			new Map([['R1', reading]]),
			anchors
		);
		expect(note.text).toBe('Reading Section II, R1');
	});

	it('shows nothing for a chapter that is not published', () => {
		expect(marginNotes(fixturePaperLinks, new Map(), anchors)).toEqual([]);
	});

	it('fails for an anchor the paper lacks', () => {
		expect(() =>
			marginNotes([{ anchor: 'eq:gone', chapter: 'X.1', label: 'Background' }], new Map(), anchors)
		).toThrow(/no anchor "eq:gone"/);
	});
});

describe('the production map', () => {
	it('is what scripts/paper-links.mjs makes of the sources now', async () => {
		expect(readFileSync(GENERATED, 'utf8')).toBe(await paperLinksSource());
	}, 180_000);

	it('gives every section, paragraph, equation, figure and table one note, but the checks and the AI statement', () => {
		const places = orderedAnchors()
			.map((a) => a.id)
			.filter((id) => !SKIP.has(id));
		expect(paperLinks.map((l) => l.anchor)).toEqual(places);
		for (const l of paperLinks) expect(LABELS).toContain(l.label);
	});

	it('sends each equation of derivations.yaml to its chapter and heading', () => {
		const equations = new Set(
			orderedAnchors()
				.map((a) => a.id)
				.filter((id) => id.startsWith('eq:'))
		);
		const entries = derivations();
		expect(entries.size).toBeGreaterThan(0);
		for (const [label, entry] of entries) {
			expect(equations.has(label), `${label} is a paper equation`).toBe(true);
			expect(chapterById(entry.chapter)?.status, `${label} → ${entry.chapter}`).toBe('published');
			expect(paperLinks.find((l) => l.anchor === label)).toEqual({
				anchor: label,
				chapter: entry.chapter,
				label: entry.stated ? 'Background' : 'Derivation',
				...(entry.section ? { section: entry.section } : {})
			});
		}
	});

	it('takes each figure override, whose chapter is published and uses the figure', () => {
		for (const [anchor, id] of Object.entries(FIGURE_OVERRIDES)) {
			const c = chapterById(id);
			expect(c?.status, `${anchor} → ${id}`).toBe('published');
			const source = readFileSync(path.join(TUTORIAL_DIR, `${c!.slug}.md`), 'utf8');
			const front = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
			const figures = front.match(/^figures:\s*\[([^\]]*)\]/m)?.[1] ?? '';
			const uses =
				source.includes(`{{paper ${anchor}}}`) ||
				source.includes(`/paper/#${anchor})`) ||
				figures.split(/[,\s]+/).includes(anchor);
			expect(uses, `${id} uses ${anchor}`).toBe(true);
			expect(paperLinks.find((l) => l.anchor === anchor)?.chapter).toBe(id);
		}
	});

	it('lands each note on a published chapter, at a heading that chapter has', () => {
		const broken: string[] = [];
		const ids = new Map<string, Set<string>>();
		for (const l of paperLinks) {
			const c = chapterById(l.chapter);
			if (c?.status !== 'published') {
				broken.push(`${l.anchor}: ${l.chapter} is not published`);
				continue;
			}
			if (!l.section) continue;
			if (!ids.has(c.id)) {
				const html = loadChapter(c)
					.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
					.join('\n');
				ids.set(c.id, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])));
			}
			if (!ids.get(c.id)!.has(l.section))
				broken.push(`${l.anchor}: ${l.chapter} has no #${l.section}`);
		}
		expect(broken).toEqual([]);
	}, 180_000);
});
