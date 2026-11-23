/**
 * What the paper's renderer and the tutorial's share: pandoc's JSON tree turned into HTML, for the elements both
 * documents use in the same way (text, emphasis, links, mathematics, lists, tables, and \ref and \eqref). Each
 * document passes in how it typesets mathematics and resolves a label, and handles its own elements (headings, notes,
 * citations, boxes) before the shared ones are tried.
 *
 * Anything neither recognises is an error, never silently dropped: a paragraph that vanished from the web version
 * would be worse than a failed build.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Node = { t: string; c?: any };

export const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The text of a bare run of inlines, as pandoc writes "In plain words." */
export const plainText = (ns: Node[]): string =>
	ns.map((n) => (n.t === 'Str' ? n.c : n.t === 'Space' ? ' ' : '')).join('');

/** The words of a run of inlines, looking inside emphasis, quotation marks and spans; mathematics is left out. */
export const wordsOf = (ns: Node[]): string =>
	ns
		.map((n) => {
			if (n.t === 'Str') return n.c;
			if (n.t === 'Space' || n.t === 'SoftBreak' || n.t === 'LineBreak') return ' ';
			if (n.t === 'Emph' || n.t === 'Strong' || n.t === 'SmallCaps') return wordsOf(n.c);
			if (n.t === 'Quoted') return wordsOf(n.c[1]);
			if (n.t === 'Span' || n.t === 'Link') return wordsOf(n.c[1]);
			return '';
		})
		.join('');

/** A stable identifier from words: lower case, letters and digits, joined by hyphens ("The Earth's own tide." gives
 * "the-earths-own-tide"). */
export const slugify = (text: string): string =>
	text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/** Hands out identifiers, adding -2, -3 to repeats. */
export function uniqueIds() {
	const seen = new Map<string, number>();
	return (base: string) => {
		const k = (seen.get(base) ?? 0) + 1;
		seen.set(base, k);
		return k === 1 ? base : `${base}-${k}`;
	};
}

export interface Renderer {
	inline(n: Node): string;
	inlines(list: Node[]): string;
	paragraph(list: Node[]): string;
	block(n: Node): string;
	blocksHtml(list: Node[]): string;
	table(n: Node, id: string): string;
}

export interface RendererOptions {
	/** Names the document in error messages ("Paper", "Tutorial"). */
	who: string;
	/** Typesets one formula (display or inline), already stripped of nothing. */
	math(tex: string, display: boolean): string;
	/** The number of a label, for \ref and \eqref; throws for an unknown one. */
	ref(label: string): string;
	/** The number of a labelled table, if it has one. */
	tableNumber(id: string): string | undefined;
	/** The document's own inline elements; undefined to fall through to the shared ones. */
	inline?(n: Node, r: Renderer): string | undefined;
	/** The document's own block elements; undefined to fall through to the shared ones. */
	block?(n: Node, r: Renderer): string | undefined;
}

export function createRenderer(options: RendererOptions): Renderer {
	const { who } = options;

	const inline = (n: Node): string => {
		const own = options.inline?.(n, r);
		if (own !== undefined) return own;
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
				// a link out of the document opens beside it, so that the reader keeps their place
				const href = String(n.c[2][0]);
				const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
				return `<a href="${esc(href)}"${external}>${inlines(n.c[1])}</a>`;
			}
			case 'Math':
				return options.math(n.c[1], n.c[0].t === 'DisplayMath');
			case 'RawInline': {
				const src = String(n.c[1]);
				if (n.c[0] === 'html' && /^<!--[\s\S]*-->$/.test(src)) return '';
				const m = src.match(/^\\(eqref|ref)\{([^}]+)\}$/);
				if (m) {
					const number = options.ref(m[2]);
					const text = m[1] === 'eqref' ? `(${number})` : number;
					return `<a class="xref" href="#${esc(m[2])}">${text}</a>`;
				}
				throw new Error(`${who}: unsupported LaTeX in text: ${src}`);
			}
			default:
				throw new Error(`${who}: unsupported inline element "${n.t}"`);
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
				// the word joiner keeps the punctuation on the maths' line even where a phone lets the pair wrap
				html += `<span class="nowrap">${inline(n)}\u2060${esc(trailing)}</span>`;
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
		const row = (rw: any, tag: string) =>
			`<tr>${rw[1]
				.map((cell: any, k: number) => `<${tag}${align[k] ?? ''}>${blocksHtml(cell[4])}</${tag}>`)
				.join('')}</tr>`;
		const headRows = head[1].map((rw: any) => row(rw, 'th')).join('');
		const bodyRows = bodies
			.flatMap((b: any) => [...b[2], ...b[3]])
			.map((rw: any) => row(rw, 'td'))
			.join('');
		const number = options.tableNumber(id) ?? '';
		// a table of numbers keeps its natural width and is centred; one of
		// prose fills the column
		const kind = align.every((a: string) => a) ? 'table numeric' : 'table';
		const captionHtml = blocksHtml(caption[1]);
		return (
			`<figure class="${kind}"${id || number ? ` id="${esc(id)}"` : ''}><table>` +
			(headRows ? `<thead>${headRows}</thead>` : '') +
			`<tbody>${bodyRows}</tbody></table>` +
			(number || captionHtml
				? `<figcaption>${number ? `<span class="label">Table ${number}.</span> ` : ''}${captionHtml}</figcaption>`
				: '') +
			`</figure>`
		);
	};

	const block = (n: Node): string => {
		const own = options.block?.(n, r);
		if (own !== undefined) return own;
		switch (n.t) {
			case 'Para':
				return paragraph(n.c);
			case 'Plain':
				return inlines(n.c);
			case 'BulletList':
				return `<ul>${n.c.map((item: Node[]) => `<li>${blocksHtml(item)}</li>`).join('')}</ul>`;
			case 'OrderedList':
				return `<ol>${n.c[1].map((item: Node[]) => `<li>${blocksHtml(item)}</li>`).join('')}</ol>`;
			case 'Table':
				// newer pandoc (seen with 3.13): the Table carries its own label
				return table(n, n.c[0][0]);
			default:
				throw new Error(`${who}: unsupported block element "${n.t}"`);
		}
	};
	const blocksHtml = (list: Node[]): string => list.map(block).join('\n');

	const r: Renderer = { inline, inlines, paragraph, block, blocksHtml, table };
	return r;
}
