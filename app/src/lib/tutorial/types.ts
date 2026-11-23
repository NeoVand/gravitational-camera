/** The shapes of the tutorial's data as the pages receive it (built by lib/server/sources.ts). */
import type { Chapter } from './catalogue';
import type { Role } from './colour';

/** A chapter as a link: its number, short title, and page if it is published. */
export interface ChapterRef {
	id: string;
	short: string;
	title: string;
	status: Chapter['status'];
	href?: string;
}

export interface SymbolEntry {
	key: string;
	title: string;
	tex: string;
	/** the symbol typeset */
	html: string;
	role: Role | 'none';
	kind: string;
	meaningHtml: string;
	chapter: string;
	anchor: string;
}

export interface SymbolCardData extends SymbolEntry {
	defined: ChapterRef;
}

export interface GlossaryEntry {
	term: string;
	definitionHtml: string;
	role: Role | 'none';
	chapter: string;
	anchor: string;
}
