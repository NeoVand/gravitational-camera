/**
 * Turns pandoc's JSON tree of the paper (paper/main.tex) into HTML fragments
 * and figure slots. Runs at build time only.
 *
 * Anything the renderer does not recognise is an error, never silently
 * dropped: a paragraph that vanished from the web version would be worse than
 * a failed build.
 */
import katex from 'katex';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Node = { t: string; c?: any };

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

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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

/** The text of a bare run of inlines, as pandoc writes "In plain words." */
const plainText = (ns: Node[]): string =>
	ns.map((n) => (n.t === 'Str' ? n.c : n.t === 'Space' ? ' ' : '')).join('');

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

export function renderPaper(doc: { meta: Record<string, Node>; blocks: Node[] }): RenderedPaper {
	// ---- first pass: number everything that can be referred to ---------------
	const labels = new Map<string, string>();
	const citeNumbers = new Map<string, number>();
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
				for (const m of found) labels.set(m[1], String(equations));
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

	const ref = (label: string): string => {
		const number = labels.get(label);
		if (!number) throw new Error(`Paper: reference to unknown label "${label}"`);
		return number;
	};

	// ---- second pass: HTML ---------------------------------------------------
	const footnotes: string[] = [];

	const math = (tex: string, display: boolean): string => {
		const label = tex.match(/\\label\{([^}]+)\}/)?.[1];
		let body = tex.replace(/\\label\{[^}]+\}/g, '').replace(/\\nonumber/g, '');
		if (display && label) body += `\\tag{${ref(label)}}`;
		const html = katex.renderToString(body, { displayMode: display, throwOnError: true });
		if (!display) return html;
		return `<div class="equation"${label ? ` id="${esc(label)}"` : ''}>${html}</div>`;
	};

	const inline = (n: Node): string => {
		switch (n.t) {
			case 'Str':
				return esc(n.c);
			case 'Space':
			case 'SoftBreak':
				return ' ';
			case 'LineBreak':
				return '<br>';
			case 'Emph':
				return `<em>${inlines(n.c)}</em>`;
			case 'Strong':
				return `<strong>${inlines(n.c)}</strong>`;
			case 'Code':
				return `<code>${esc(n.c[1])}</code>`;
			case 'Quoted':
				return n.c[0].t === 'DoubleQuote' ? `“${inlines(n.c[1])}”` : `‘${inlines(n.c[1])}’`;
			case 'Span':
				return inlines(n.c[1]);
			case 'Link': {
				// a link out of the paper opens beside it, so that the reader keeps their place
				const href = String(n.c[2][0]);
				const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
				return `<a href="${esc(href)}"${external}>${inlines(n.c[1])}</a>`;
			}
			case 'Math':
				return math(n.c[1], n.c[0].t === 'DisplayMath');
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
			case 'RawInline': {
				const src = String(n.c[1]);
				const m = src.match(/^\\(eqref|ref)\{([^}]+)\}$/);
				if (m) {
					const number = ref(m[2]);
					const text = m[1] === 'eqref' ? `(${number})` : number;
					return `<a class="xref" href="#${esc(m[2])}">${text}</a>`;
				}
				throw new Error(`Paper: unsupported LaTeX in text: ${src}`);
			}
			default:
				throw new Error(`Paper: unsupported inline element "${n.t}"`);
		}
	};
	/**
	 * Punctuation that follows inline mathematics must not wrap onto the next
	 * line by itself, so the two are kept together.
	 */
	const inlines = (list: Node[]): string => {
		let html = '';
		for (let i = 0; i < list.length; i++) {
			const n = list[i];
			const next = list[i + 1];
			const trailing =
				n.t === 'Math' && n.c[0].t === 'InlineMath' && next?.t === 'Str'
					? String(next.c).match(/^[,.;:!?)\]]+/)?.[0]
					: undefined;
			if (trailing) {
				html += `<span class="nowrap">${inline(n)}${esc(trailing)}</span>`;
				html += esc(String(next.c).slice(trailing.length));
				i += 1;
			} else html += inline(n);
		}
		return html;
	};

	/** A paragraph may contain display equations, which cannot sit inside <p>. */
	const paragraph = (list: Node[]): string => {
		const parts: string[] = [];
		let run: Node[] = [];
		const flush = () => {
			const html = inlines(run).trim();
			if (html) parts.push(`<p${parts.length ? ' class="continued"' : ''}>${html}</p>`);
			run = [];
		};
		for (const n of list) {
			if (n.t === 'Math' && n.c[0].t === 'DisplayMath') {
				flush();
				parts.push(inline(n));
			} else run.push(n);
		}
		flush();
		return parts.join('\n');
	};

	const table = (n: Node, id: string): string => {
		const [, caption, colspecs, head, bodies] = n.c;
		// column alignment from the LaTeX column spec (l, c, r)
		const align = colspecs.map((spec: any) =>
			spec[0].t === 'AlignRight'
				? ' class="right"'
				: spec[0].t === 'AlignCenter'
					? ' class="center"'
					: ''
		);
		const row = (r: any, tag: string) =>
			`<tr>${r[1]
				.map((cell: any, k: number) => `<${tag}${align[k] ?? ''}>${blocksHtml(cell[4])}</${tag}>`)
				.join('')}</tr>`;
		const headRows = head[1].map((r: any) => row(r, 'th')).join('');
		const bodyRows = bodies
			.flatMap((b: any) => [...b[2], ...b[3]])
			.map((r: any) => row(r, 'td'))
			.join('');
		const number = labels.get(id) ?? '';
		// a table of numbers keeps its natural width and is centred; one of
		// prose fills the column
		const kind = align.every((a: string) => a) ? 'table numeric' : 'table';
		return (
			`<figure class="${kind}" id="${esc(id)}"><table>` +
			(headRows ? `<thead>${headRows}</thead>` : '') +
			`<tbody>${bodyRows}</tbody></table>` +
			`<figcaption><span class="label">Table ${number}.</span> ${blocksHtml(caption[1])}</figcaption></figure>`
		);
	};

	const out: (HtmlBlock | FigureBlock)[] = [];
	const contents: RenderedPaper['contents'] = [];
	let referencesHtml = '';
	const push = (html: string) => {
		if (!html) return;
		const last = out[out.length - 1];
		if (last?.kind === 'html') last.html += '\n' + html;
		else out.push({ kind: 'html', html });
	};

	const block = (n: Node): string => {
		switch (n.t) {
			case 'Para':
				return paragraph(n.c);
			case 'Plain':
				return inlines(n.c);
			case 'Header': {
				const [level, [id], content] = n.c;
				if (level >= 3) return `<h4 class="run-in">${inlines(content)}</h4>`;
				const number = labels.get(id);
				const tag = level === 1 ? 'h2' : 'h3';
				if (level === 1 && number) contents.push({ id, number, titleHtml: inlines(content) });
				return `<${tag} id="${esc(id)}">${number ? `<span class="number">${number}</span> ` : ''}${inlines(content)}</${tag}>`;
			}
			case 'BulletList':
				return `<ul>${n.c.map((item: Node[]) => `<li>${blocksHtml(item)}</li>`).join('')}</ul>`;
			case 'OrderedList':
				return `<ol>${n.c[1].map((item: Node[]) => `<li>${blocksHtml(item)}</li>`).join('')}</ol>`;
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
			case 'Table':
				// newer pandoc (seen with 3.13): the Table carries its own label
				return table(n, n.c[0][0]);
			default:
				throw new Error(`Paper: unsupported block element "${n.t}"`);
		}
	};
	const blocksHtml = (list: Node[]): string => list.map(block).join('\n');

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
