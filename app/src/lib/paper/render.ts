/**
 * Turns pandoc's JSON tree of the paper (paper/main.tex) into HTML fragments
 * and figure slots. Runs at build time only.
 *
 * Anything the renderer does not recognise is an error, never silently
 * dropped: a paragraph that vanished from the web version would be worse than
 * a failed build. The elements the paper shares with the tutorial are rendered
 * by lib/render/pandoc.ts.
 */
import katex from 'katex';
import { createRenderer, esc, plainText, slugify, uniqueIds, wordsOf } from '../render/pandoc';
import type { Node } from '../render/pandoc';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HtmlBlock {
	kind: 'html';
	html: string;
}

export interface FigureBlock {
	kind: 'figure';
	id: string;
	number: number;
	captionHtml: string;
	/** Path of the static image as written in the LaTeX source. */
	image: string;
}

export interface RenderedPaper {
	title: string;
	date: string;
	authors: string[];
	abstractHtml: string;
	blocks: (HtmlBlock | FigureBlock)[];
	referencesHtml: string;
	footnotesHtml: string;
	/** Numbered top-level sections, for the table of contents. */
	contents: { id: string; number: string; titleHtml: string }[];
}

// typesetting only, and REVTeX's front matter, which the page shows from the metadata
const IGNORED_RAW = [
	/^\\maketitle$/,
	/^\\centering$/,
	/^\\bibliographystyle\{[^}]*\}$/,
	/^\\noaffiliation$/,
	/^\\affiliation\{[^}]*\}$/,
	/^\\email\{[^}]*\}$/,
	// page layout for print only
	/^\\FloatBarrier$/,
	/^\\appendix$/,
	/^\\clearpage$/
];

/**
 * A plain-language summary without its label: the leading bold "In plain words." of its first paragraph, and the
 * space after it, go to the summary line of its box.
 */
const plainBody = (blocks: Node[]): Node[] => {
	const [first, ...rest] = blocks;
	if (first?.t !== 'Para') return blocks;
	const [label, ...after] = first.c as Node[];
	if (label?.t !== 'Strong' || plainText(label.c).trim() !== 'In plain words.') return blocks;
	while (after.length && (after[0].t === 'Space' || after[0].t === 'SoftBreak')) after.shift();
	return after.length ? [{ ...first, c: after }, ...rest] : rest;
};

/** The identifier of a run-in paragraph heading ("\\paragraph{The Earth's own tide.}" gives "par:the-earths-own-tide"),
 * which LaTeX does not label; it is made from the heading's words, so that it stays put while they do. */
export const runInId = (content: Node[]) => `par:${slugify(wordsOf(content))}`;

/** What the paper numbers, and the source of every labelled equation, from a first pass over its tree. */
export interface PaperIndex {
	/** label → its number as printed ("3", "IV.2", "B") */
	labels: Map<string, string>;
	/** citation key → its number in the list of references */
	citeNumbers: Map<string, number>;
	/** equation label → the TeX of its display (with every \\label) and its number */
	equations: Map<string, { tex: string; number: string }>;
}

export function indexPaper(doc: { blocks: Node[] }): PaperIndex {
	const labels = new Map<string, string>();
	const citeNumbers = new Map<string, number>();
	const equationTex = new Map<string, { tex: string; number: string }>();
	let section = 0;
	let subsection = 0;
	// after \appendix, sections are lettered A, B, ... as LaTeX letters them
	let appendix = false;
	const sectionName = (k: number) => (appendix ? String.fromCharCode(64 + k) : String(k));
	let figures = 0;
	let tables = 0;
	let equations = 0;
	// pandoc has written a labelled table in two ways: as a Div that carries the
	// label and wraps the Table (older versions), and as a Table that carries
	// the label itself (newer versions; seen with 3.13). Tables counted through their Div are
	// remembered here so that they are not counted again.
	const wrappedTables = new WeakSet<object>();

	const scan = (x: any): void => {
		if (Array.isArray(x)) return x.forEach(scan);
		if (!x || typeof x !== 'object') return;
		const n = x as Node;
		if (n.t === 'RawBlock' && /^\\appendix$/.test(String(n.c[1]).trim())) {
			appendix = true;
			section = 0;
			return;
		}
		if (n.t === 'Header') {
			const [level, [id, classes]] = n.c;
			if ((classes as string[]).includes('unnumbered')) {
				// \section* and the like: shown, but neither numbered nor listed in the contents
			} else if (level === 1) {
				section += 1;
				subsection = 0;
				if (id) labels.set(id, sectionName(section));
			} else if (level === 2) {
				subsection += 1;
				if (id) labels.set(id, `${sectionName(section)}.${subsection}`);
			}
		} else if (n.t === 'Figure') {
			figures += 1;
			if (n.c[0][0]) labels.set(n.c[0][0], String(figures));
		} else if (n.t === 'Div' && n.c[1].some((b: Node) => b.t === 'Table')) {
			tables += 1;
			const inner = n.c[1].find((b: Node) => b.t === 'Table');
			wrappedTables.add(inner);
			const id = n.c[0][0] || inner.c[0][0];
			if (id) labels.set(id, String(tables));
		} else if (n.t === 'Table' && !wrappedTables.has(n)) {
			tables += 1;
			if (n.c[0][0]) labels.set(n.c[0][0], String(tables));
		} else if (n.t === 'Math' && n.c[0].t === 'DisplayMath') {
			const found = [...String(n.c[1]).matchAll(/\\label\{([^}]+)\}/g)];
			if (found.length) {
				equations += 1;
				for (const m of found) {
					labels.set(m[1], String(equations));
					equationTex.set(m[1], { tex: String(n.c[1]), number: String(equations) });
				}
			}
		} else if (n.t === 'Cite') {
			for (const c of n.c[0]) {
				if (!citeNumbers.has(c.citationId)) citeNumbers.set(c.citationId, citeNumbers.size + 1);
			}
			return; // the formatted text inside is replaced by numbers
		}
		for (const v of Object.values(n)) scan(v);
	};
	scan(doc.blocks);
	return { labels, citeNumbers, equations: equationTex };
}

export function renderPaper(doc: { meta: Record<string, Node>; blocks: Node[] }): RenderedPaper {
	// ---- first pass: number everything that can be referred to ---------------
	const { labels, citeNumbers } = indexPaper(doc);

	const ref = (label: string): string => {
		const number = labels.get(label);
		if (!number) throw new Error(`Paper: reference to unknown label "${label}"`);
		return number;
	};

	// ---- second pass: HTML ---------------------------------------------------
	const footnotes: string[] = [];
	const contents: RenderedPaper['contents'] = [];
	let referencesHtml = '';
	const runInIds = uniqueIds();

	const math = (tex: string, display: boolean): string => {
		const label = tex.match(/\\label\{([^}]+)\}/)?.[1];
		let body = tex.replace(/\\label\{[^}]+\}/g, '').replace(/\\nonumber/g, '');
		if (display && label) body += `\\tag{${ref(label)}}`;
		const html = katex.renderToString(body, { displayMode: display, throwOnError: true });
		if (!display) return html;
		return `<div class="equation"${label ? ` id="${esc(label)}"` : ''}>${html}</div>`;
	};

	const { block, blocksHtml, inlines, table } = createRenderer({
		who: 'Paper',
		math,
		ref,
		tableNumber: (id) => labels.get(id),
		inline(n) {
			switch (n.t) {
				case 'Cite': {
					const items = n.c[0].map((c: any) => {
						const k = citeNumbers.get(c.citationId)!;
						return `<a href="#ref-${esc(c.citationId)}">${k}</a>`;
					});
					return `<span class="cite">[${items.join(', ')}]</span>`;
				}
				case 'Note': {
					footnotes.push(blocksHtml(n.c));
					const k = footnotes.length;
					return `<sup><a id="fnref-${k}" href="#fn-${k}">${k}</a></sup>`;
				}
			}
			return undefined;
		},
		block(n) {
			switch (n.t) {
				case 'Header': {
					const [level, [id], content] = n.c;
					if (level >= 3)
						return `<h4 class="run-in" id="${esc(runInIds(runInId(content)))}">${inlines(content)}</h4>`;
					const number = labels.get(id);
					const tag = level === 1 ? 'h2' : 'h3';
					if (level === 1 && number) contents.push({ id, number, titleHtml: inlines(content) });
					return `<${tag} id="${esc(id)}">${number ? `<span class="number">${number}</span> ` : ''}${inlines(content)}</${tag}>`;
				}
				case 'BlockQuote':
					// the LaTeX `quote` environment carries the plain-language summaries, closed until opened;
					// their leading "In plain words." becomes the summary that opens them
					return `<details class="plain"><summary>In plain words</summary>${blocksHtml(plainBody(n.c))}</details>`;
				case 'RawBlock': {
					const src = String(n.c[1]).trim();
					if (IGNORED_RAW.some((re) => re.test(src))) return '';
					throw new Error(`Paper: unsupported LaTeX block: ${src.slice(0, 120)}`);
				}
				case 'Div': {
					const [[id, classes], content] = n.c;
					const t = content.find((b: Node) => b.t === 'Table');
					if (t) return table(t, id || t.c[0][0]);
					if (classes.includes('references')) {
						const entries = content
							.map((e: Node) => ({ key: String(e.c[0][0]).replace(/^ref-/, ''), node: e }))
							.filter((e: any) => citeNumbers.has(e.key))
							.sort((a: any, b: any) => citeNumbers.get(a.key)! - citeNumbers.get(b.key)!);
						referencesHtml = `<ol class="references">${entries
							.map((e: any) => `<li id="ref-${esc(e.key)}">${blocksHtml(e.node.c[1])}</li>`)
							.join('')}</ol>`;
						return '';
					}
					return blocksHtml(content);
				}
			}
			return undefined;
		}
	});

	const out: (HtmlBlock | FigureBlock)[] = [];
	const push = (html: string) => {
		if (!html) return;
		const last = out[out.length - 1];
		if (last?.kind === 'html') last.html += '\n' + html;
		else out.push({ kind: 'html', html });
	};

	for (const n of doc.blocks) {
		if (n.t === 'Figure') {
			const [[id], caption, content] = n.c;
			let image = '';
			const find = (x: any): void => {
				if (Array.isArray(x)) return x.forEach(find);
				if (x && typeof x === 'object') {
					if (x.t === 'Image') image = x.c[2][0];
					else Object.values(x).forEach(find);
				}
			};
			find(content);
			out.push({
				kind: 'figure',
				id,
				number: Number(labels.get(id) ?? 0),
				captionHtml: blocksHtml(caption[1]),
				image
			});
		} else push(block(n));
	}

	// ---- front matter --------------------------------------------------------
	const meta = (key: string): string => {
		const m = doc.meta[key];
		if (!m) return '';
		if (m.t === 'MetaInlines') return inlines(m.c);
		if (m.t === 'MetaBlocks') return blocksHtml(m.c);
		return '';
	};
	const authorMeta = doc.meta.author;
	const authors: string[] =
		authorMeta?.t === 'MetaList'
			? authorMeta.c.map((a: Node) => (a.t === 'MetaInlines' ? inlines(a.c) : '')).filter(Boolean)
			: [];

	return {
		title: meta('title'),
		date: meta('date'),
		authors,
		abstractHtml: meta('abstract'),
		blocks: out,
		contents,
		referencesHtml,
		footnotesHtml: footnotes.length
			? `<ol class="footnotes">${footnotes
					.map((f, i) => `<li id="fn-${i + 1}">${f} <a href="#fnref-${i + 1}">↩</a></li>`)
					.join('')}</ol>`
			: ''
	};
}
