/**
 * The paper's labels and ids, against a snapshot (paper-labels.snapshot.json, taken from the paper as committed before
 * the side notes and glosses came to its page). The tutorial's links and the margin map point at these, so nothing the
 * paper page does to its HTML may change them: the side notes' paragraph anchors are added under "p:", apart from the
 * run-in headings' "par:". When the paper itself gains or loses a label, update the snapshot on purpose.
 */
import { describe, expect, it } from 'vitest';
import { paperNotes } from '#lib/server/paper-notes.js';
import { paperIndex, paperRendered } from '#lib/server/sources.js';
import { paperLinks } from '#lib/tutorial/paper-links.js';
import { sideNotes } from '#lib/tutorial/side-notes/index.js';
import snapshot from './paper-labels.snapshot.json';

type Blocks = ReturnType<typeof paperRendered>['blocks'];

/** Every id the paper's blocks carry, in order: the ids in their HTML, and the figures' own. */
const idsOf = (blocks: Blocks): string[] =>
	blocks.flatMap((b) =>
		b.kind === 'html'
			? [...b.html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])
			: 'id' in b && typeof b.id === 'string' && b.id
				? [b.id]
				: []
	);

const LABELLED = /^(sec|par|eq|fig|tab|app):/;

describe("the paper's labels", () => {
	it('are those of the snapshot, with the same numbers', () => {
		expect(Object.fromEntries(paperIndex().labels)).toEqual(snapshot.labels);
	});

	it('come with the ids of the snapshot in the rendered paper, run-in headings included', () => {
		expect(idsOf(paperRendered().blocks).filter((id) => LABELLED.test(id))).toEqual(snapshot.ids);
	});

	it('are left as they are by the side notes and glosses of the paper page', () => {
		const ids = idsOf(paperNotes().blocks);
		expect(ids.filter((id) => !id.startsWith('p:'))).toEqual(idsOf(paperRendered().blocks));
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('hold every anchor of the margin map and of the side notes', () => {
		const ids = new Set(idsOf(paperNotes().blocks));
		const known = new Set(snapshot.ids);
		expect(paperLinks.map((l) => l.anchor).filter((a) => !known.has(a))).toEqual([]);
		const notes = Object.values(sideNotes).flatMap((list) => list.map((n) => n.anchor));
		expect(notes.filter((a) => !(a.startsWith('p:') ? ids.has(a) : known.has(a)))).toEqual([]);
	});
});
