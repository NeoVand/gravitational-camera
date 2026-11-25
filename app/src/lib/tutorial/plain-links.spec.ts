/** The plain-words boxes' links into the tutorial: the phrases, where they lead, and how the renderer places them. */
import { describe, expect, it } from 'vitest';
import { linkPhrases, phraseSites, renderPaper } from '#lib/paper/render.js';
import { chapterById, loadChapter, paperRendered, paperTree } from '#lib/server/sources.js';
import { plainLinks } from './plain-links';

describe('linking a phrase in a box', () => {
	const box =
		'<p>The tide is a <strong>table</strong>, and the tide <a href="#x">is a table</a> ' +
		'<span class="katex"><span>is a table</span></span>; the tide is a table.</p>';

	it('finds the phrase in the text only, never inside a link or the mathematics', () => {
		expect(phraseSites(box, 'is a table')).toEqual([box.lastIndexOf('is a table')]);
		expect(phraseSites(box, 'The tide is a')).toHaveLength(1);
		// across the bold word, the words are not one run of text
		expect(phraseSites(box, 'a table,')).toEqual([]);
	});

	it('wraps the one occurrence in a link that opens in the same tab', () => {
		const html = linkPhrases(box, [{ phrase: 'is a table', href: '/tutorial/newton/tides/' }]);
		expect(html).toContain(
			'the tide <a class="tutorial-link" href="/tutorial/newton/tides/">is a table</a>.</p>'
		);
		expect(html).not.toContain('target=');
	});

	it('leaves a phrase found twice or never unlinked (the test of plain-links.ts names it)', () => {
		expect(linkPhrases(box, [{ phrase: 'The tide', href: '/' }])).toContain('tutorial-link');
		expect(linkPhrases(box, [{ phrase: 'the tide', href: '/' }])).toBe(box);
		expect(linkPhrases(box, [{ phrase: 'a lens', href: '/' }])).toBe(box);
	});
});

/** Each plain-words box of the paper as rendered without the links, by its section. */
function boxes(): Map<string, string> {
	const html = renderPaper(paperTree())
		.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
		.join('\n');
	const out = new Map<string, string>();
	let section = '';
	for (const part of html.split(/(?=<h2 id=")|(?=<details class="plain">)/)) {
		section = part.match(/^<h2 id="([^"]+)"/)?.[1] ?? section;
		if (part.startsWith('<details class="plain">')) {
			expect(out.has(section), `${section} has one box`).toBe(false);
			out.set(section, part.slice(0, part.indexOf('</details>')));
		}
	}
	return out;
}

describe('the plain-words links of plain-links.ts', () => {
	it('give every box two to five phrases, each found exactly once in its box', () => {
		const all = boxes();
		expect(all.size).toBe(15);
		const counts = new Map<string, number>();
		for (const l of plainLinks) counts.set(l.section, (counts.get(l.section) ?? 0) + 1);
		expect([...counts.keys()].sort()).toEqual([...all.keys()].sort());
		for (const [section, n] of counts) {
			expect(n, section).toBeGreaterThanOrEqual(2);
			expect(n, section).toBeLessThanOrEqual(5);
		}
		const wrong = plainLinks
			.map((l) => ({ l, n: phraseSites(all.get(l.section) ?? '', l.phrase).length }))
			.filter(({ n }) => n !== 1)
			.map(({ l, n }) => `${l.section}: "${l.phrase}" ${n} times`);
		expect(wrong).toEqual([]);
	});

	it('lead to published chapters, at sections those chapters have', () => {
		const wrong: string[] = [];
		for (const l of plainLinks) {
			const c = chapterById(l.chapter);
			if (c?.status !== 'published') {
				wrong.push(`"${l.phrase}": ${l.chapter} is not published`);
				continue;
			}
			if (!l.anchor) continue;
			const html = loadChapter(c)
				.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
				.join('\n');
			if (!html.includes(`id="${l.anchor}"`))
				wrong.push(`"${l.phrase}": ${l.chapter} has no #${l.anchor}`);
		}
		expect(wrong).toEqual([]);
	}, 180_000);

	it('are in the paper as rendered for the site, one link for each', () => {
		const html = paperRendered()
			.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
			.join('\n');
		expect(html.match(/<a class="tutorial-link" href="\/tutorial\//g)).toHaveLength(
			plainLinks.length
		);
	});
});
