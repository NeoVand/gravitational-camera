/**
 * Turns pandoc's JSON tree of one tutorial chapter (Markdown in tutorial/) into HTML blocks, its contents, and the
 * slots where interactive figures and the paper's own figures go. Runs at build time only.
 *
 * Shared elements (text, links, mathematics, lists, tables) are rendered as in the paper, by lib/render/pandoc.ts;
 * this file adds the chapter's own: front matter, margin notes, the boxes of STYLE.md §5 written as fenced divs,
 * equation numbers per chapter, and the paper's equations and figures pulled in by label. Anything it does not
 * recognise, and any label, live figure or symbol it cannot find, is an error.
 */
import katex from 'katex';
import { createRenderer, esc, plainText, wordsOf } from '../render/pandoc';
import type { Node, Renderer } from '../render/pandoc';
import type { FigureBlock, PaperIndex } from '../paper/render';
import { ROLES, type Role } from './colour';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChapterMeta {
	id: string;
	/** HTML (the title may hold mathematics) */
	title: string;
	/** the words of the title, for the window's title bar */
	titleText: string;
	/** the guiding question, HTML */
	question: string;
	part: string;
	requires: string[];
	paper: string[];
	figures: string[];
	live: string[];
	depth: string;
}

export interface HtmlBlock {
	kind: 'html';
	html: string;
}

/** An interactive figure, mounted by the page from the tutorial's registry. */
export interface TryBlock {
	kind: 'try';
	id: string;
	introHtml: string;
}

/** One of the paper's figures, shown as the paper shows it. */
export interface PaperFigureBlock {
	kind: 'paper-figure';
	id: string;
	number: number;
	image: string;
	captionHtml: string;
}

export type ChapterBlock = HtmlBlock | TryBlock | PaperFigureBlock;

export interface RenderedChapter {
	meta: ChapterMeta;
	blocks: ChapterBlock[];
	/** the chapter's sections (its ## headings), for the contents rail */
	contents: { id: string; titleHtml: string }[];
	/** the first displayed equation, for previews; '' if there is none */
	firstEquationHtml: string;
	/** the symbol keys (symbol-<key>) the chapter marks, in order of first use */
	symbols: string[];
	/** the colour roles the chapter uses */
	roles: Role[];
	/** the chapter's own references, if it cites any */
	referencesHtml: string;
}

/** What a chapter can refer to outside itself. */
export interface ChapterContext {
	/** ids of the registered interactive figures */
	live: ReadonlySet<string>;
	/** keys of the symbols in tutorial/symbols.yaml */
	symbols: ReadonlySet<string>;
	/** the paper: its labels and equations, and its rendered figures by id */
	paper: { index: PaperIndex; figures: ReadonlyMap<string, FigureBlock> };
}

/** The boxes a chapter may hold, as fenced-div classes. */
export const BOXES = [
	'plain',
	'derivation',
	'gap',
	'check',
	'example',
	'problems',
	'deeper',
	'paper',
	'history',
	'try'
] as const;

const TIERS = ['Practice', 'Stretch', 'The paper'] as const;

/** KaTeX for the tutorial: colour roles and symbol keys through \htmlClass only, and MathML for screen readers. */
export function tutorialMath(
	tex: string,
	display: boolean,
	allowPaperLink = false,
	/** macros for TeX that pandoc has not expanded (the data files) */
	macros?: Record<string, string>
): string {
	return katex.renderToString(tex, {
		displayMode: display,
		macros: macros ? { ...macros } : undefined,
		throwOnError: true,
		strict: 'ignore',
		output: 'htmlAndMathml',
		trust: (ctx) =>
			ctx.command === '\\htmlClass' ||
			(allowPaperLink && ctx.command === '\\href' && /^\/paper\/#/.test(ctx.url ?? ''))
	});
}

/** pandoc's fenced divs take `::: {.try #id}`; STYLE.md writes `::: try {#id}`, which this turns into the former. */
export function normalizeFences(markdown: string): string {
	return markdown.replace(
		/^(:{3,})[ \t]*([A-Za-z][\w-]*)[ \t]*\{([^}]*)\}[ \t]*$/gm,
		(_, fence: string, cls: string, attrs: string) => `${fence} {.${cls} ${attrs.trim()}}`
	);
}

/** Paper HTML moved onto another page: its in-page links point into the paper, and its ids are dropped. */
const intoPaper = (html: string) =>
	html.replace(/ id="[^"]*"/g, '').replace(/href="#/g, 'href="/paper/#');

/** Block HTML that must sit inside a paragraph (a margin note): paragraphs and boxes become spans. */
const asInline = (html: string) =>
	html
		.replace(/<p( class="[^"]*")?>/g, '<span class="p">')
		.replace(/<\/p>/g, '</span>')
		.replace(/<div/g, '<span')
		.replace(/<\/div>/g, '</span>');

const metaText = (m: Node | undefined): string => {
	if (!m) return '';
	if (m.t === 'MetaInlines') return wordsOf(m.c).trim();
	if (m.t === 'MetaString') return String(m.c);
	if (m.t === 'MetaBool') return String(m.c);
	return '';
};

const metaList = (m: Node | undefined): string[] => {
	if (!m) return [];
	if (m.t === 'MetaList') return m.c.map(metaText).filter(Boolean);
	const one = metaText(m);
	return one ? [one] : [];
};

export function renderChapter(
	doc: { meta: Record<string, Node>; blocks: Node[] },
	ctx: ChapterContext,
	/** names the chapter in error messages */
	source = 'chapter'
): RenderedChapter {
	const who = `Tutorial (${source})`;
	const fail = (message: string): never => {
		throw new Error(`${who}: ${message}`);
	};

	// ---- first pass: equation numbers, section ids, citations ------------------------------------------------
	const labels = new Map<string, string>();
	const sections = new Map<string, Node[]>();
	const citeNumbers = new Map<string, number>();
	let equations = 0;
	const scan = (x: any, top: boolean): void => {
		if (Array.isArray(x)) return x.forEach((y) => scan(y, top));
		if (!x || typeof x !== 'object') return;
		const n = x as Node;
		if (n.t === 'Math' && n.c[0].t === 'DisplayMath') {
			const found = [...String(n.c[1]).matchAll(/\\label\{([^}]+)\}/g)];
			if (found.length > 1)
				fail(`one display has two labels (${found.map((m) => m[1]).join(', ')})`);
			if (found.length) {
				const label = found[0][1];
				if (!label.startsWith('eq:')) fail(`equation labels start with "eq:" ("${label}")`);
				if (labels.has(label)) fail(`the label "${label}" is used twice`);
				equations += 1;
				labels.set(label, String(equations));
			}
			return;
		}
		if (n.t === 'Header' && top && n.c[0] === 2) sections.set(n.c[1][0], n.c[2]);
		if (n.t === 'Cite') {
			for (const c of n.c[0])
				if (!citeNumbers.has(c.citationId)) citeNumbers.set(c.citationId, citeNumbers.size + 1);
			return;
		}
		for (const v of Object.values(n)) scan(v, false);
	};
	for (const b of doc.blocks) scan(b, true);

	const ref = (label: string): string => {
		const number = labels.get(label);
		if (!number) fail(`reference to unknown label "${label}"`);
		return number!;
	};

	// ---- front matter ---------------------------------------------------------------------------------------------
	const required = (key: string) => {
		const v = metaText(doc.meta[key]);
		if (!v) fail(`front matter lacks "${key}"`);
		return v;
	};

	// ---- second pass: HTML ----------------------------------------------------------------------------------------
	let notes = 0;
	let firstEquationHtml = '';
	let referencesHtml = '';
	const contents: RenderedChapter['contents'] = [];

	const math = (tex: string, display: boolean): string => {
		const label = tex.match(/\\label\{([^}]+)\}/)?.[1];
		const body = tex.replace(/\\label\{[^}]+\}/g, '').replace(/\\nonumber/g, '');
		const html = tutorialMath(display && label ? `${body}\\tag{${ref(label)}}` : body, display);
		if (!display) return html;
		// a preview shows the equation away from its chapter, so without the chapter's number
		if (!firstEquationHtml)
			firstEquationHtml = `<div class="equation">${label ? tutorialMath(body, true) : html}</div>`;
		return `<div class="equation"${label ? ` id="${esc(label)}"` : ''}>${html}</div>`;
	};

	/** A paper equation by label, with the paper's number as its tag, linked to it. */
	const paperEquation = (label: string): string => {
		const eq = ctx.paper.index.equations.get(label);
		if (!eq) fail(`{{paper ${label}}}: the paper has no equation with that label`);
		const body = eq!.tex.replace(/\\label\{[^}]+\}/g, '').replace(/\\nonumber/g, '');
		const tag = `\\tag*{\\href{/paper/#${label}}{\\text{paper (${eq!.number})}}}`;
		const html = tutorialMath(body + tag, true, true);
		return `<div class="equation from-paper" id="paper-${esc(label)}">${html}</div>`;
	};

	/** Splits a box's leading heading off as its title. */
	const takeTitle = (r: Renderer, kvs: [string, string][], content: Node[]) => {
		if (content[0]?.t === 'Header')
			return { title: r.inlines(content[0].c[2]), rest: content.slice(1) };
		const attr = kvs.find(([k]) => k === 'title')?.[1];
		return { title: attr ? esc(attr) : '', rest: content };
	};

	const isHeader = (n: Node | undefined, text?: string) =>
		n?.t === 'Header' && (text === undefined || plainText(n.c[2]).trim() === text);

	/** Questions with hidden answers, from `### Q` / `### A` headings or a definition list. */
	const check = (r: Renderer, content: Node[]): string => {
		const pairs: { q: string; a: string }[] = [];
		if (content.length === 1 && content[0].t === 'DefinitionList') {
			for (const [term, defs] of content[0].c as [Node[], Node[][]][])
				pairs.push({
					q: `<p>${r.inlines(term)}</p>`,
					a: defs.map((d) => r.blocksHtml(d)).join('\n')
				});
		} else {
			let i = 0;
			while (i < content.length) {
				if (!isHeader(content[i], 'Q')) fail('check: each question starts with "### Q"');
				const q: Node[] = [];
				for (i += 1; i < content.length && !isHeader(content[i]); i++) q.push(content[i]);
				if (!isHeader(content[i], 'A')) fail('check: each question is followed by "### A"');
				const a: Node[] = [];
				for (i += 1; i < content.length && !isHeader(content[i]); i++) a.push(content[i]);
				if (!q.length || !a.length) fail('check: a question or an answer is empty');
				pairs.push({ q: r.blocksHtml(q), a: r.blocksHtml(a) });
			}
		}
		if (!pairs.length) fail('check: no questions');
		return (
			`<section class="box check"><p class="box-title">Check yourself</p><ol class="questions">` +
			pairs
				.map(
					({ q, a }) =>
						`<li><div class="question">${q}</div><details class="answer"><summary>Answer</summary><div class="answer-body">${a}</div></details></li>`
				)
				.join('') +
			`</ol></section>`
		);
	};

	/** Three tiers of problems, each problem followed by a `::: solution` div. */
	const problems = (r: Renderer, content: Node[]): string => {
		const tiers: string[] = [];
		let i = 0;
		for (const tier of TIERS) {
			if (!isHeader(content[i], tier))
				fail(`problems: expected the tier "### ${tier}" (the tiers are ${TIERS.join(', ')})`);
			const items: string[] = [];
			let text: Node[] = [];
			for (i += 1; i < content.length && !isHeader(content[i]); i++) {
				const n = content[i];
				if (n.t === 'Div' && n.c[0][1].includes('solution')) {
					if (!text.length) fail(`problems (${tier}): a solution with no problem before it`);
					items.push(
						`<li class="problem"><div class="problem-text">${r.blocksHtml(text)}</div><details class="solution"><summary>Solution</summary><div class="solution-body">${r.blocksHtml(n.c[1])}</div></details></li>`
					);
					text = [];
				} else text.push(n);
			}
			if (text.length) fail(`problems (${tier}): a problem without a "::: solution"`);
			if (!items.length) fail(`problems (${tier}): no problems`);
			tiers.push(
				`<section class="tier"><h4 class="tier-title">${esc(tier)}</h4><ol>${items.join('')}</ol></section>`
			);
		}
		if (i < content.length) fail('problems: something follows the last tier');
		return `<section class="box problems"><p class="box-title">Problems</p>${tiers.join('')}</section>`;
	};

	const out: ChapterBlock[] = [];
	// figures are slots of their own between blocks of HTML, so they stand at the top level of the chapter
	const topLevel = new Set<Node>(doc.blocks);
	const atTop = (n: Node, what: string) => {
		if (!topLevel.has(n))
			fail(`${what} stands at the top level of the chapter, not inside a box or list`);
	};

	const renderer = createRenderer({
		who,
		math,
		ref,
		tableNumber: () => undefined,
		inline(n, r) {
			switch (n.t) {
				case 'Note': {
					notes += 1;
					const k = notes;
					return (
						`<span class="margin-note">` +
						`<button type="button" class="mn-mark" aria-expanded="false" aria-controls="mn-${k}" aria-label="Note ${k}">${k}</button>` +
						`<span class="mn-body" id="mn-${k}" role="note"><span class="mn-number">${k}</span> ${asInline(r.blocksHtml(n.c))}</span>` +
						`</span>`
					);
				}
				case 'Cite': {
					const items = n.c[0].map((c: any) => {
						const k = citeNumbers.get(c.citationId)!;
						return `<a href="#ref-${esc(c.citationId)}">${k}</a>`;
					});
					return `<span class="cite">[${items.join(', ')}]</span>`;
				}
				case 'Superscript':
					return `<sup>${r.inlines(n.c)}</sup>`;
				case 'Subscript':
					return `<sub>${r.inlines(n.c)}</sub>`;
				case 'Link': {
					// a link with no text is a cross-reference: the number of an equation, the title of a section,
					// or the number of something in the paper
					if (n.c[1].length) return undefined;
					const href = String(n.c[2][0]);
					const local = href.match(/^#(.+)$/);
					if (local) {
						const target = local[1];
						if (target.startsWith('eq:'))
							return `<a class="xref" href="#${esc(target)}">(${ref(target)})</a>`;
						const title = sections.get(target);
						if (!title) fail(`link to unknown section "#${target}"`);
						return `<a class="xref" href="#${esc(target)}">${r.inlines(title!)}</a>`;
					}
					const paper = href.match(/^\/paper\/#(.+)$/);
					if (paper) {
						const number = ctx.paper.index.labels.get(paper[1]);
						if (!number) fail(`link to unknown paper label "${paper[1]}"`);
						const text = paper[1].startsWith('eq:') ? `(${number})` : number;
						return `<a class="xref paper-ref" href="${esc(href)}">${text}</a>`;
					}
					return fail(`a link with no text to "${href}"`);
				}
			}
			return undefined;
		},
		block(n, r) {
			switch (n.t) {
				case 'Header': {
					const [level, [id], content] = n.c;
					if (level === 1) fail('a chapter has no # heading: its title is in the front matter');
					if (level === 2) {
						contents.push({ id, titleHtml: r.inlines(content) });
						return `<h2 id="${esc(id)}">${r.inlines(content)}</h2>`;
					}
					return `<h3 id="${esc(id)}">${r.inlines(content)}</h3>`;
				}
				case 'Para': {
					const words = plainText(n.c).trim();
					const m = words.match(/^\{\{paper (eq|fig):([^}\s]+)\}\}$/);
					if (m) {
						const label = `${m[1]}:${m[2]}`;
						if (m[1] === 'eq') return paperEquation(label);
						atTop(n, `{{paper ${label}}}`);
						const fig = ctx.paper.figures.get(label);
						if (!fig) fail(`{{paper ${label}}}: the paper has no figure with that label`);
						out.push({
							kind: 'paper-figure',
							id: label,
							number: fig!.number,
							image: fig!.image,
							captionHtml: intoPaper(fig!.captionHtml)
						});
						return '';
					}
					if (/\{\{paper\b/.test(words))
						fail(`a paper label must stand alone in its paragraph: ${words}`);
					return undefined;
				}
				case 'DefinitionList':
					return `<dl>${(n.c as [Node[], Node[][]][])
						.map(
							([term, defs]) =>
								`<dt>${r.inlines(term)}</dt>${defs.map((d) => `<dd>${r.blocksHtml(d)}</dd>`).join('')}`
						)
						.join('')}</dl>`;
				case 'RawBlock': {
					// the macro definitions put before every chapter; pandoc has already applied them
					const src = String(n.c[1]).trim();
					if (/^(\\(re)?newcommand\{[^\n]*\n?)+$/.test(src + '\n')) return '';
					return fail(`unsupported LaTeX block: ${src.slice(0, 120)}`);
				}
				case 'Div': {
					const [[id, classes, kvs], content] = n.c as [
						[string, string[], [string, string][]],
						Node[]
					];
					if (classes.includes('references')) {
						const entries = content
							.map((e: Node) => ({ key: String(e.c[0][0]).replace(/^ref-/, ''), node: e }))
							.filter((e) => citeNumbers.has(e.key))
							.sort((a, b) => citeNumbers.get(a.key)! - citeNumbers.get(b.key)!);
						referencesHtml = `<ol class="references">${entries
							.map((e) => `<li id="ref-${esc(e.key)}">${r.blocksHtml(e.node.c[1])}</li>`)
							.join('')}</ol>`;
						return '';
					}
					const kind = classes.find((c) => (BOXES as readonly string[]).includes(c));
					if (!kind) return fail(`unknown box ::: ${classes.join(' ') || '(no class)'}`);
					switch (kind) {
						case 'plain':
							return `<details class="plain"><summary>In plain words</summary>${r.blocksHtml(content)}</details>`;
						case 'derivation': {
							const { title, rest } = takeTitle(r, kvs, content);
							if (!title) fail('derivation: give it a title (a heading inside, or title="…")');
							return `<details class="box derivation"><summary>Derivation in full: ${title}</summary><div class="box-body">${r.blocksHtml(rest)}</div></details>`;
						}
						case 'history': {
							const { title, rest } = takeTitle(r, kvs, content);
							return `<details class="box history"><summary>A little history${title ? `: ${title}` : ''}</summary><div class="box-body">${r.blocksHtml(rest)}</div></details>`;
						}
						case 'example': {
							const { title, rest } = takeTitle(r, kvs, content);
							if (!title) fail('example: give it a title (a heading inside, or title="…")');
							return `<section class="box example"><p class="box-title">Worked example: ${title}</p>${r.blocksHtml(rest)}</section>`;
						}
						case 'gap':
							return `<aside class="box gap"><p class="box-title">What this sketch skips</p>${r.blocksHtml(content)}</aside>`;
						case 'deeper':
							return `<aside class="box deeper"><p class="box-title">Go deeper</p>${r.blocksHtml(content)}</aside>`;
						case 'paper':
							return `<aside class="box paper-uses"><p class="box-title">Where the paper uses this</p>${r.blocksHtml(content)}</aside>`;
						case 'check':
							return check(r, content);
						case 'problems':
							return problems(r, content);
						case 'try': {
							if (!id) fail('try: name the interactive figure, as ::: try {#its-id}');
							atTop(n, 'try');
							if (!ctx.live.has(id)) fail(`try: no interactive figure is registered as "${id}"`);
							out.push({ kind: 'try', id, introHtml: r.blocksHtml(content) });
							return '';
						}
					}
					return fail(`unknown box ${kind}`);
				}
			}
			return undefined;
		}
	});

	const push = (html: string) => {
		if (!html) return;
		const last = out[out.length - 1];
		if (last?.kind === 'html') last.html += '\n' + html;
		else out.push({ kind: 'html', html });
	};
	for (const n of doc.blocks) push(renderer.block(n));

	const metaHtml = (key: string) => {
		const m = doc.meta[key];
		if (m?.t === 'MetaInlines') return renderer.inlines(m.c);
		if (m?.t === 'MetaString') return esc(String(m.c));
		return '';
	};

	const id = required('id');
	const titleText = required('title');
	required('question');
	const part = required('part');
	const meta: ChapterMeta = {
		id,
		title: metaHtml('title'),
		titleText,
		question: metaHtml('question'),
		part,
		requires: metaList(doc.meta.requires),
		paper: metaList(doc.meta.paper),
		figures: metaList(doc.meta.figures),
		live: metaList(doc.meta.live),
		depth: metaText(doc.meta.depth)
	};
	for (const live of meta.live)
		if (!ctx.live.has(live)) fail(`front matter: no interactive figure is registered as "${live}"`);
	for (const label of meta.paper)
		if (!ctx.paper.index.labels.has(label)) fail(`front matter: the paper has no label "${label}"`);

	// symbol keys and colour roles, read back from the typeset HTML
	const all = out
		.map((b) => (b.kind === 'html' ? b.html : b.kind === 'try' ? b.introHtml : ''))
		.join('\n');
	const symbols = [...new Set([...all.matchAll(/\bsymbol-([a-z0-9-]+)/g)].map((m) => m[1]))];
	for (const key of symbols)
		if (!ctx.symbols.has(key)) fail(`the symbol "${key}" is not in tutorial/symbols.yaml`);
	const roles = ROLES.filter((role) => all.includes(`q-${role}`));

	return { meta, blocks: out, contents, firstEquationHtml, symbols, roles, referencesHtml };
}
