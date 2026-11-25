/**
 * Where the site's text comes from at build time: the paper (paper/*.tex) and the tutorial (tutorial/*.md and its
 * data files), each converted by pandoc. Used by the page loaders only.
 *
 * In a build (and in tests) every conversion runs once and is kept; in development it is kept for a few seconds,
 * so that edits to the sources show up on reload.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse as parseYaml } from 'yaml';
import { indexPaper, renderPaper } from '#lib/paper/render.js';
import type { FigureBlock, PaperIndex, RenderedPaper } from '#lib/paper/render.js';
import { esc } from '#lib/render/pandoc.js';
import { inlineDrawing } from '#lib/paper/drawing.js';
import { allChapters, parseCatalogue } from '#lib/tutorial/catalogue.js';
import type { Catalogue, Chapter } from '#lib/tutorial/catalogue.js';
import { normalizeFences, renderChapter, tutorialMath } from '#lib/tutorial/render.js';
import type { RenderedChapter } from '#lib/tutorial/render.js';
import { tutorialLive } from '#lib/tutorial/live.js';
import { ROLES } from '#lib/tutorial/colour.js';
import { marginNotes } from '#lib/tutorial/paper-links.js';
import { plainLinks } from '#lib/tutorial/plain-links.js';
import type { PlainLink } from '#lib/tutorial/plain-links.js';
import type { MarginChapter, MarginNote, PaperLink } from '#lib/tutorial/paper-links.js';
import type {
	ChapterRef,
	GlossaryEntry,
	SymbolCardData,
	SymbolEntry
} from '#lib/tutorial/types.js';
export type { ChapterRef, GlossaryEntry, SymbolCardData, SymbolEntry };

const PAPER_DIR = path.resolve('..', 'paper');
export const TUTORIAL_DIR = path.resolve('..', 'tutorial');
/** pandoc's default citation style, except that every entry names its authors (see the file). */
const STYLE = path.resolve('src', 'lib', 'paper', 'references.csl');

/** In development a conversion is kept for a few seconds only: long enough for one request, short enough that an
 * edit shows on the next reload. */
const LIFETIME = process.env.NODE_ENV === 'development' ? 3000 : Infinity;
const cache = new Map<string, { value: unknown; made: number }>();
function once<T>(key: string, make: () => T): T {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.made < LIFETIME) return hit.value as T;
	const value = make();
	cache.set(key, { value, made: Date.now() });
	return value;
}

function pandoc(args: string[], input: string, cwd: string, what: string): string {
	try {
		return execFileSync('pandoc', args, {
			cwd,
			input,
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024
		});
	} catch (cause) {
		throw new Error(`Could not convert ${what}: is pandoc installed?`, { cause });
	}
}

// ---- the paper ----------------------------------------------------------------------------------------------------

/**
 * Read a LaTeX file with its \input files spliced in and comment lines removed.
 * Figures and tables that span both columns of the PDF (figure*, table*)
 * become ordinary ones: pandoc keeps the caption and label of `figure` and
 * `table` only, and on the web every figure and table spans the text anyway.
 */
function readTex(file: string): string {
	const text = readFileSync(path.join(PAPER_DIR, file), 'utf8')
		.replace(/^%.*\n/gm, '')
		.replace(/\\(begin|end)\{(figure|table)\*\}/g, '\\$1{$2}');
	return text.replace(/\\input\{([^}]+)\}/g, (_, name: string) =>
		readTex(name.endsWith('.tex') ? name : `${name}.tex`)
	);
}

/** The paper, as pandoc's tree. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paperTree(): { meta: Record<string, any>; blocks: any[] } {
	return once('paper:tree', () =>
		JSON.parse(
			pandoc(
				[
					'-f',
					'latex+raw_tex',
					'-t',
					'json',
					'--citeproc',
					'--bibliography',
					'refs.bib',
					'--csl',
					STYLE
				],
				readTex('main.tex'),
				PAPER_DIR,
				'the paper'
			)
		)
	);
}

/** The paper's labels and equations, from its tree alone (the tutorial's catalogue needs them before the paper is
 * rendered, since the rendered paper links into the catalogue's chapters). */
export const paperIndex = (): PaperIndex => once('paper:index', () => indexPaper(paperTree()));

/** The plain-words boxes' links into the tutorial (plain-links.ts), by the box's section, for published chapters. */
export function plainLinksBySection(
	links: readonly PlainLink[] = plainLinks
): Map<string, { phrase: string; href: string }[]> {
	const out = new Map<string, { phrase: string; href: string }[]>();
	for (const link of links) {
		const href = chapterHref(link.chapter, link.anchor);
		if (!href) continue;
		const list = out.get(link.section) ?? [];
		list.push({ phrase: link.phrase, href });
		out.set(link.section, list);
	}
	return out;
}

export const paperRendered = (): RenderedPaper =>
	once('paper:html', () => renderPaper(paperTree(), { plainLinks: plainLinksBySection() }));

/** What a chapter needs of the paper: its labels and equations, and its figures by id. */
export function paperContext(): { index: PaperIndex; figures: Map<string, FigureBlock> } {
	return once('paper:context', () => {
		const figures = new Map<string, FigureBlock>();
		for (const b of paperRendered().blocks) if (b.kind === 'figure') figures.set(b.id, b);
		return { index: paperIndex(), figures };
	});
}

// ---- the tutorial -------------------------------------------------------------------------------------------------

const readYaml = (file: string): unknown =>
	parseYaml(readFileSync(path.join(TUTORIAL_DIR, file), 'utf8'));

export const catalogue = (): Catalogue =>
	once('tutorial:catalogue', () =>
		parseCatalogue(readYaml('parts.yaml'), new Set(paperIndex().labels.keys()))
	);

export const chapterById = (id: string): Chapter | undefined =>
	allChapters(catalogue()).find((c) => c.id === id);

export const published = (): Chapter[] =>
	allChapters(catalogue()).filter((c) => c.status === 'published');

/** The macros put before every chapter: the paper's notation, then the tutorial's. */
const macros = () =>
	[path.join(PAPER_DIR, 'macros.tex'), path.join(TUTORIAL_DIR, 'macros.tex')]
		.map((file) =>
			readFileSync(file, 'utf8')
				.split('\n')
				.filter((line) => !/^\s*%/.test(line))
				.join('\n')
		)
		.join('\n');

export const MARKDOWN =
	'markdown+tex_math_dollars+fenced_divs+footnotes+citations+raw_tex+yaml_metadata_block';

/** A chapter's Markdown as pandoc's tree, with the macros applied. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chapterTree(file: string): { meta: Record<string, any>; blocks: any[] } {
	const source = readFileSync(path.join(TUTORIAL_DIR, file), 'utf8');
	// the front matter may follow other text when a blank line precedes it, so the macros can go first
	const input = `${macros()}\n\n${normalizeFences(source)}`;
	return JSON.parse(
		pandoc(
			[
				'-f',
				MARKDOWN,
				'-t',
				'json',
				'--citeproc',
				'--bibliography',
				path.join(PAPER_DIR, 'refs.bib'),
				'--csl',
				STYLE
			],
			input,
			TUTORIAL_DIR,
			`tutorial/${file}`
		)
	);
}

export const symbolKeys = (): Set<string> => new Set(symbols().map((s) => s.key));

/** The tutorial's own figures (tutorial/figures/*.svg, drawn by figures3d/render.mjs --tutorial --final), by name,
 * ready to inline. Drafts in tutorial/figures/staging/ are not among them. */
export function tutorialFigures(): Map<string, string> {
	return once('tutorial:figures', () => {
		const dir = path.join(TUTORIAL_DIR, 'figures');
		const names = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.svg')) : [];
		return new Map(
			names.map((f) => [
				f.replace(/\.svg$/, ''),
				inlineDrawing(readFileSync(path.join(dir, f), 'utf8'))
			])
		);
	});
}

/** A chapter rendered, from its file under tutorial/ (as "newton/tides.md"). */
export function renderChapterFile(file: string): RenderedChapter {
	return once(`tutorial:chapter:${file}`, () =>
		renderChapter(
			chapterTree(file),
			{
				live: new Set(Object.keys(tutorialLive)),
				symbols: symbolKeys(),
				paper: paperContext(),
				figures: tutorialFigures()
			},
			file
		)
	);
}

/** A published chapter, checked against its entry in parts.yaml. */
export function loadChapter(chapter: Chapter): RenderedChapter {
	const file = `${chapter.slug}.md`;
	if (!existsSync(path.join(TUTORIAL_DIR, file)))
		throw new Error(
			`tutorial/parts.yaml: chapter ${chapter.id} is ${chapter.status}, but ${file} is missing`
		);
	const rendered = renderChapterFile(file);
	const { meta } = rendered;
	if (meta.id !== chapter.id)
		throw new Error(`tutorial/${file}: id ${meta.id}, but parts.yaml says ${chapter.id}`);
	if (meta.part !== chapter.part)
		throw new Error(`tutorial/${file}: part ${meta.part}, but parts.yaml says ${chapter.part}`);
	for (const need of meta.requires)
		if (!chapterById(need))
			throw new Error(`tutorial/${file}: requires an unknown chapter ${need}`);
	return rendered;
}

// ---- symbols and glossary -----------------------------------------------------------------------------------------

/** Text with $...$ mathematics, as HTML. */
export function textHtml(text: string): string {
	return text
		.split(/(\$[^$]+\$)/)
		.map((part) =>
			part.startsWith('$') && part.endsWith('$') && part.length > 2
				? tutorialMath(part.slice(1, -1), false, false, katexMacros())
				: esc(part)
		)
		.join('');
}

/** The macros, for TeX that pandoc does not see (the data files), as KaTeX takes them. */
const katexMacros = (): Record<string, string> =>
	once('tutorial:katex-macros', () => {
		const out: Record<string, string> = {};
		for (const m of macros().matchAll(/\\newcommand\{(\\[A-Za-z]+)\}(?:\[(\d)\])?\{(.*)\}\s*$/gm))
			out[m[1]] = m[3];
		return out;
	});

export function symbols(): SymbolEntry[] {
	return once('tutorial:symbols', () => {
		const raw = readYaml('symbols.yaml') as { symbols?: Record<string, unknown>[] };
		const seen = new Set<string>();
		return (raw.symbols ?? []).map((s) => {
			const key = String(s.key ?? '');
			if (!/^[a-z0-9-]+$/.test(key)) throw new Error(`tutorial/symbols.yaml: bad key "${key}"`);
			if (seen.has(key)) throw new Error(`tutorial/symbols.yaml: the key "${key}" is used twice`);
			seen.add(key);
			const role = String(s.role ?? 'none') as SymbolEntry['role'];
			if (role !== 'none' && !ROLES.includes(role))
				throw new Error(`tutorial/symbols.yaml: ${key} has an unknown role "${role}"`);
			const tex = String(s.tex ?? '');
			return {
				key,
				title: String(s.title ?? ''),
				tex,
				html: tutorialMath(tex, false, false, katexMacros()),
				role,
				kind: String(s.kind ?? ''),
				meaningHtml: textHtml(String(s.meaning ?? '')),
				chapter: String(s.chapter ?? ''),
				anchor: String(s.anchor ?? '')
			};
		});
	});
}

export function glossary(): GlossaryEntry[] {
	return once('tutorial:glossary', () => {
		const raw = readYaml('glossary.yaml') as { terms?: Record<string, unknown>[] };
		return (raw.terms ?? [])
			.map((t) => ({
				term: String(t.term ?? ''),
				definitionHtml: textHtml(String(t.definition ?? '')),
				role: String(t.role ?? 'none') as GlossaryEntry['role'],
				chapter: String(t.chapter ?? ''),
				anchor: String(t.anchor ?? '')
			}))
			.sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
	});
}

/** Where a chapter's page is, or undefined if it is not published (a link to it would lead nowhere). */
export function chapterHref(id: string, anchor = ''): string | undefined {
	const c = chapterById(id);
	if (!c || c.status !== 'published') return undefined;
	return `/tutorial/${c.slug}/${anchor ? `#${anchor}` : ''}`;
}

// ---- the paper's margin -------------------------------------------------------------------------------------------

/** Every id the paper page has: sections, run-in paragraphs, equations, figures, tables. */
export const paperAnchors = (): Set<string> =>
	once('paper:anchors', () => {
		const ids = new Set<string>();
		for (const b of paperRendered().blocks) {
			if (b.kind === 'figure') ids.add(b.id);
			else for (const m of b.html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
		}
		return ids;
	});

/** What the margin shows of a rendered chapter. */
export const marginChapter = (
	rendered: RenderedChapter,
	short: string,
	href: string
): MarginChapter => ({
	id: rendered.meta.id,
	short,
	href,
	titleHtml: rendered.meta.title,
	questionHtml: rendered.meta.question,
	equationHtml: rendered.firstEquationHtml
});

/**
 * What the margin shows of each chapter, kept while the chapter's file is unchanged: the margin points into nearly
 * every chapter, and rendering them all again on each reload of the paper in development would take many seconds.
 */
const marginChapters = new Map<string, { modified: number; chapter: MarginChapter }>();
function marginChapterOf(c: Chapter): MarginChapter {
	const modified = statSync(path.join(TUTORIAL_DIR, `${c.slug}.md`)).mtimeMs;
	const hit = marginChapters.get(c.id);
	if (hit?.modified === modified) return hit.chapter;
	const chapter = marginChapter(loadChapter(c), c.short, `/tutorial/${c.slug}/`);
	marginChapters.set(c.id, { modified, chapter });
	return chapter;
}

/** The margin notes for these links, from the published chapters (and any others given, as in tests). */
export function paperMargin(
	links: readonly PaperLink[],
	extra: ReadonlyMap<string, MarginChapter> = new Map()
): MarginNote[] {
	if (!links.length) return [];
	const chapters = new Map(extra);
	for (const link of links) {
		if (chapters.has(link.chapter)) continue;
		const c = chapterById(link.chapter);
		if (c?.status === 'published') chapters.set(c.id, marginChapterOf(c));
	}
	return marginNotes(links, chapters, paperAnchors());
}

/** The sample chapter of tutorial/_fixtures, which tests render at /dev/tutorial-sample/. */
export const SAMPLE_FILE = '_fixtures/sample.md';
export const SAMPLE_HREF = '/dev/tutorial-sample/';

// ---- what the pages show ------------------------------------------------------------------------------------------

export const chapterRef = (id: string): ChapterRef => {
	const c = chapterById(id);
	return {
		id,
		short: c?.short ?? id,
		title: c?.title ?? id,
		status: c?.status ?? 'planned',
		href: chapterHref(id)
	};
};

/** The parts and their chapters, as the contents rail and the home page list them. */
export const rail = () =>
	catalogue().parts.map((p) => ({
		id: p.id,
		slug: p.slug,
		title: p.title,
		chapters: p.chapters.map((c) => chapterRef(c.id))
	}));

/** HTML written with links from the site's root, moved under the page's root (resolve('/') in the loader). */
export const underRoot = (html: string, root: string) =>
	root === '/' ? html : html.replace(/href="\//g, `href="${root}`);

/**
 * Everything a chapter's page needs, for a published chapter or for the sample (which has no entry). `root` is
 * where the site's root is from the page (resolve('/') in the loader), for the links inside the chapter's HTML.
 */
export function chapterPage(rendered: RenderedChapter, entry: Chapter | undefined, root: string) {
	const order = published();
	const at = entry ? order.findIndex((c) => c.id === entry.id) : -1;
	const neighbour = (c?: Chapter) =>
		c ? { id: c.id, title: c.title, href: `/tutorial/${c.slug}/` } : undefined;
	const part = entry ? catalogue().parts.find((p) => p.id === entry.part) : undefined;
	const used = new Set(rendered.symbols);
	const blocks = rendered.blocks.map((b) =>
		b.kind === 'html'
			? { ...b, html: underRoot(b.html, root) }
			: b.kind === 'try'
				? { ...b, introHtml: underRoot(b.introHtml, root) }
				: { ...b, captionHtml: underRoot(b.captionHtml, root) }
	);
	return {
		chapter: { ...rendered, blocks },
		part: part ? { id: part.id, slug: part.slug, title: part.title } : undefined,
		rail: rail(),
		requires: rendered.meta.requires.map(chapterRef),
		symbols: symbols()
			.filter((s) => used.has(s.key))
			.map((s): SymbolCardData => ({ ...s, defined: chapterRef(s.chapter) })),
		prev: at > 0 ? neighbour(order[at - 1]) : undefined,
		next: at >= 0 ? neighbour(order[at + 1]) : undefined
	};
}

export type ChapterPageData = ReturnType<typeof chapterPage>;
