/** The map from the paper's anchors to the tutorial, and the notes it makes. */
import { describe, expect, it } from 'vitest';
import { fixturePaperLinks, marginNotes, paperLinks } from './paper-links';
import type { MarginChapter } from './paper-links';

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
		for (const l of paperLinks) expect(l.chapter).toMatch(/^\d+\.\d+b?$/);
	});

	it('shows a note for each link to a published chapter, labelled as the plan writes it', () => {
		const notes = marginNotes(fixturePaperLinks, new Map([['X.1', sample]]), anchors);
		expect(notes.map((n) => [n.anchor, n.text])).toEqual([
			['eq:tidal', 'Background · A sample, X.1'],
			['eq:newton', 'Background · A sample, X.1']
		]);
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
