/** The shape of a side note, and of a side note ready to show. */

export interface SideNote {
	/**
	 * the paragraph's anchor on the paper page: a run-in paragraph's heading ("par:the-earths-own-tide"), or else
	 * "p:" and the paragraph's first four words of prose ("p:a-freely-falling-observer"; lib/paper/glosses.ts)
	 */
	anchor: string;
	/** the note, in plain sentences; $...$ for mathematics, with the paper's and the tutorial's macros */
	text: string;
	/** the chapter it is borrowed from, as parts.yaml numbers it */
	chapter: string;
	/** a section id within the chapter (its heading's anchor), where the link lands */
	section?: string;
	/** one of the tutorial's drawings (tutorial/figures/<name>.svg), shown small, and what it shows */
	figure?: { name: string; alt: string };
}

/** A side note, ready to show (lib/server/paper-notes.ts makes it). */
export interface SideNoteView {
	anchor: string;
	/** the note's text as HTML */
	html: string;
	/** the chapter section, from the site's root */
	href: string;
	/** "Tides, 1.4" */
	where: string;
	figure?: { name: string; alt: string };
}
