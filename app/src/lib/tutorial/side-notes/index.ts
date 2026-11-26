/**
 * Side notes: beside the paragraphs of the paper's text, short notes borrowed from the tutorial, in the plain voice of
 * the plain-words boxes, each with a link to the chapter section it comes from and, where one shows the idea well, a
 * small copy of one of the tutorial's drawings (design/book/BOOK-PLAN.md §6).
 *
 * One file per section of the paper, named after its id ("sec:pixel" in sec-pixel.ts, "app:proofs" in
 * app-proofs.ts), each exporting `section` and
 * `notes`, so that each section's notes can be drafted on their own; this index gathers every such file. How to
 * write them is in design/book/SIDE-NOTES-GUIDE.md. side-notes.spec.ts checks that every anchor, chapter section and
 * drawing exists.
 */
import type { SideNote } from './types';

export type { SideNote, SideNoteView } from './types';

const files = import.meta.glob<{ section: string; notes: SideNote[] }>(
	['./*.ts', '!./index.ts', '!./types.ts', '!./*.spec.ts'],
	{ eager: true }
);

/** By the paper's section id. */
export const sideNotes: Readonly<Record<string, readonly SideNote[]>> = (() => {
	const out: Record<string, SideNote[]> = {};
	for (const [file, mod] of Object.entries(files)) {
		const expected = file.replace(/^\.\/|\.ts$/g, '').replace('-', ':');
		if (mod.section !== expected)
			throw new Error(
				`side-notes/${file.slice(2)}: section is "${mod.section}", not "${expected}"`
			);
		out[mod.section] = mod.notes;
	}
	return out;
})();

/** Every drawing the notes show, for the endpoint that serves them (routes/tutorial/pictures). */
export const sideNoteDrawings = (): string[] =>
	Object.values(sideNotes).flatMap((notes) =>
		notes.flatMap((n) => (n.figure ? [n.figure.name] : []))
	);
