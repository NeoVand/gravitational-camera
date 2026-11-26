// One tutorial file (a section of the book) from pandoc's tree to a tree pandoc's LaTeX writer turns into the book's
// LaTeX. Text, lists, tables, quotation marks, emphasis and citations are left to pandoc; this file does what is the
// book's own (the counterpart of the site's app/src/lib/tutorial/render.ts):
//
//   footnotes             side notes (pandoc writes \footnote; the class makes it a side note)
//   links into the book   \ref and \eqref to labels made from the files' anchors ("1.4:the-tide-of-one-mass")
//   links to the paper    the paper's number in the text, and its place in a margin note beside the paragraph
//   links out             their text, and the address in the margin
//   ::: plain, ::: paper  dropped
//   ::: try               a margin note: the interactive version is on the website
//   ::: check, problems   exercises at the end of the book chapter, with their solutions at the back
//   ::: deeper            "Further reading" at the end of the book chapter
//   derivation, example,
//   gap, history          the class's boxes (hairlines, a small-capital title)
//   {{paper eq:…}}        the paper's equation, tagged with the paper's number
//   {{paper fig:…}}       the paper's figure (its PDF) with its caption from the paper's LaTeX
//   ![…](tut-x){#fig:y}   the tutorial's drawing, as a PDF made from its SVG
//   **term**              the index entry, where the glossary says the term is defined
//
// The result is a pandoc document whose parts (title, body, opening figure, further reading, exercises, solutions)
// are separated by marker comments, so that one pandoc run writes them all.
import { plain, words, texEscape } from './util.mjs';
import { paperInText, paperPlace } from './paper.mjs';

const Str = (c) => ({ t: 'Str', c });
const Raw = (c) => ({ t: 'RawInline', c: ['latex', c] });
const RawB = (c) => ({ t: 'RawBlock', c: ['latex', c] });
const Plain = (c) => ({ t: 'Plain', c });
const Para = (c) => ({ t: 'Para', c });
export const MARK = (name) => RawB(`%%@@PART:${name}@@`);

const DROPPED = new Set(['plain', 'paper']);
const SKIP_FOR_INDEX = new Set(['plain', 'paper', 'check', 'problems', 'try', 'deeper', 'solution']);
const TIERS = { Practice: 'practice', Stretch: 'stretch', 'The camera': 'paper' };

/** A tutorial number (1.4, R7b, 0.6) at the start of a word. */
const numberIn = (s, id) => {
	const esc = id.replace(/\./g, '\\.');
	const m = String(s).match(new RegExp(`^(\\W*)${esc}(?![0-9a-z]|\\.[0-9])(.*)$`));
	return m ? { before: m[1], after: m[2] } : undefined;
};

const GREEK_NAMES = Object.fromEntries(
	'alpha α beta β gamma γ delta δ epsilon ε epsilon ϵ zeta ζ eta η theta θ iota ι kappa κ lambda λ mu μ nu ν xi ξ pi π rho ρ sigma σ tau τ upsilon υ phi φ phi ϕ chi χ psi ψ omega ω'
		.split(' ')
		.reduce((pairs, w, k, all) => (k % 2 ? pairs : [...pairs, [all[k + 1], w]]), [])
);

const indexKey = (term) => {
	const display = term
		.replace(/(["!@|])/g, '"$1')
		.replace(/([&%#_])/g, '\\$1');
	// makeindex reads bytes: the sort key is plain ASCII (accents dropped, Greek letters spelt out)
	const sort = term
		.replace(/\$[^$]*\$/g, (m) => m.replace(/[\\${}^_]/g, ''))
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[\u0370-\u03ff]/g, (c) => GREEK_NAMES[c] ?? 'z')
		.replace(/[^\x00-\x7f]/g, '')
		.toLowerCase()
		.replace(/(["!@|])/g, '"$1')
		.replace(/[{}\\]/g, '');
	return sort === display ? `\\index{${display}}` : `\\index{${sort}@${display}}`;
};

const norm = (s) =>
	s
		.toLowerCase()
		.replace(/[’']/g, "'")
		.replace(/[^a-z0-9$\\' -]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/**
 * Converts one section.
 * ctx: { id, doc, entry (parts.yaml), frontmatter, opener, included(id), inBook(id), bySlug, anchors(id),
 *        paper, paperFigures (label → {section id → book label}), figurePdf(name), glossary ([{term, anchor}]),
 *        warn(message) }
 */
export function convertSection(ctx) {
	const { id, doc, paper } = ctx;
	const warn = (m) => ctx.warn(`${id}: ${m}`);
	// labels in ASCII: pandoc rewrites a heading's non-ASCII id (ρ becomes ux3c1), and the \ref must match
	const lab = (sid, anchor) => `${sid}:${anchor}`.replace(/[^\x00-\x7f]/g, (c) => `u${c.codePointAt(0).toString(16)}`);
	const secLabel = (sid) => `sec:${sid}`;
	const own = ctx.anchors(id);

	const st = {
		mode: 'text', // text | note | hoist
		numbers: true, // map plain-text section numbers to the book's
		margin: [], // margin items (arrays of inlines) of the paragraph being converted
		paper: [], // the paper's places named in that paragraph
		pending: [], // margin items waiting for the next paragraph
		pendingRaw: [], // labels and index entries waiting for the next paragraph
		exercises: [],
		solutions: [],
		exerciseCount: 0,
		deeper: [],
		opener: null,
		sawHeader: false,
		figures: 0
	};
	const withMode = (mode, fn) => {
		const saved = st.mode;
		st.mode = mode;
		try {
			return fn();
		} finally {
			st.mode = saved;
		}
	};
	/** Exercises and further reading are converted apart from the text: what waits for the next paragraph of the text
	 * must not land in them. */
	const apart = (fn) => {
		const saved = [st.pending, st.pendingRaw];
		st.pending = [];
		st.pendingRaw = [];
		try {
			const out = fn();
			if (st.pending.length || st.pendingRaw.length) out.push(Para(flushMargin()));
			return out;
		} finally {
			[st.pending, st.pendingRaw] = saved;
		}
	};
	/** A margin item, beside the current paragraph, or the next one if this text cannot hold a margin note. */
	const marginItem = (inlines) => {
		if (st.mode === 'text') st.margin.push(inlines);
		else if (st.mode === 'hoist') st.pending.push(inlines);
	};
	const paperItem = (label) => {
		const place = paperPlace(label, paper.number(label), paper);
		if (st.mode === 'text') st.paper.push(place);
		else if (st.mode === 'hoist') st.pending.push([Raw(`\\gcpaper{${place}}`)]);
	};

	// ---- the glossary's terms: the bold words that define them ----------------------------------------------------
	const indexAt = new Map(); // Strong node → index entries
	const indexAtHeader = new Map(); // header id → index entries (no bold word found)
	const indexAtStart = [];
	{
		const terms = ctx.glossary.map((g) => ({ ...g, key: norm(g.term), placed: false }));
		const active = []; // [level, id] of the headings above
		const visit = (x) => {
			if (Array.isArray(x)) return x.forEach(visit);
			if (!x || typeof x !== 'object') return;
			if (x.t === 'Div' && x.c[0][1].some((c) => SKIP_FOR_INDEX.has(c))) return;
			if (x.t === 'Note' || x.t === 'Figure') return;
			if (x.t === 'Header') {
				while (active.length && active[active.length - 1][0] >= x.c[0]) active.pop();
				active.push([x.c[0], x.c[1][0]]);
				return;
			}
			if (x.t === 'Strong') {
				const k = norm(plain(x.c));
				for (const t of terms) {
					if (t.placed) continue;
					if (t.anchor && !active.some(([, a]) => a === t.anchor)) continue;
					if (k === t.key || k === `${t.key}s` || k === `${t.key}es` || `${k}s` === t.key) {
						t.placed = true;
						if (!indexAt.has(x)) indexAt.set(x, []);
						indexAt.get(x).push(indexKey(t.term));
					}
				}
			}
			if (x.c !== undefined) visit(x.c);
		};
		visit(doc.blocks);
		for (const t of terms.filter((t) => !t.placed)) {
			if (t.anchor && own.headers.has(t.anchor)) {
				if (!indexAtHeader.has(t.anchor)) indexAtHeader.set(t.anchor, []);
				indexAtHeader.get(t.anchor).push(indexKey(t.term));
			} else {
				if (t.anchor) warn(`glossary: "${t.term}" names an unknown anchor #${t.anchor}`);
				indexAtStart.push(indexKey(t.term));
			}
		}
	}
	st.pendingRaw.push(...indexAtStart);

	// ---- links ---------------------------------------------------------------------------------------------------------
	const hyper = (label, inlines) => [Raw(`\\hyperref[${label}]{`), ...inlines, Raw('}')];

	/** The tutorial's number in a link's text, replaced by the book's; "chapter" becomes "section". */
	const numberize = (text, tid, ref) => {
		let found = false;
		const out = text.map((n) => {
			if (n.t !== 'Str') return n;
			const m = numberIn(n.c, tid);
			if (m) {
				found = true;
				return [Str(m.before), Raw(ref), Str(m.after)].filter((x) => x.t !== 'Str' || x.c);
			}
			const w = n.c.match(/^(\W*)([cC])hapter(s?)(\W*)$/);
			if (w) return Str(`${w[1]}${w[2] === 'C' ? 'S' : 's'}ection${w[3]}${w[4]}`);
			return n;
		});
		return found ? out.flat() : undefined;
	};

	const tutorialLink = (text, url) => {
		const m = url.match(/^\/tutorial\/(.*?)\/?(?:#(.*))?$/);
		const slug = m[1];
		const anchor = m[2] ? decodeURIComponent(m[2]) : '';
		const tid = ctx.bySlug.get(slug);
		const mapped = inlines(text);
		if (!tid || !ctx.inBook(tid)) {
			if (!mapped.length) warn(`a link with no text to ${url}, outside the book`);
			return { out: mapped };
		}
		if (!ctx.included(tid)) return { out: mapped.length ? mapped : [Str(`section ${tid}`)] };
		const front = ctx.isFront(tid);
		let label;
		if (anchor) {
			const a = ctx.anchors(tid);
			if (a.all.has(anchor)) label = lab(tid, anchor);
			else warn(`link to an unknown anchor ${url}`);
		}
		if (label && anchor.startsWith('eq:') && (!text.length || /^\(?[0-9.]+\)?$/.test(plain(text))))
			return { out: [Raw(`\\eqref{${label}}`)] };
		if (label && anchor.startsWith('fig:') && (!text.length || /^[0-9.]+$/.test(plain(text))))
			return { out: [Raw(`\\ref{${label}}`)] };
		const ref = front
			? `\\hyperref[${label ?? secLabel(tid)}]{\\emph{How to read this book}}`
			: label
				? `\\hyperref[${label}]{\\ref*{${secLabel(tid)}}}`
				: `\\ref{${secLabel(tid)}}`;
		if (!text.length) return { out: [Str(front ? '' : 'section '), Raw(ref)], numbered: true };
		const numbered = numberize(mapped, tid, ref);
		if (numbered) return { out: numbered, numbered: true };
		const target = label ?? secLabel(tid);
		const xref = front ? `\\gcxrefp{${texEscape(words(text))}}{${target}}` : `\\gcxref{${texEscape(words(text))}}{${target}}`;
		if (st.mode === 'note') return { out: [...hyper(target, mapped), Raw(front ? ` (p.\\,\\pageref{${target}})` : ` (\\S\\,\\ref{${target}})`)] };
		marginItem([Raw(xref)]);
		return { out: hyper(target, mapped) };
	};

	const paperLink = (text, url) => {
		const label = decodeURIComponent(url.replace(/^\/paper\/#?/, ''));
		if (!label) return inlines(text);
		if (!paper.known(label)) warn(`link to an unknown paper label "${label}"`);
		const number = paper.number(label);
		// a paper figure shown in the book is referred to by its number in the book
		const embed = label.startsWith('fig:') ? (ctx.paperFigureHome?.(label) ?? ctx.paperFigureLabel(label, id)) : undefined;
		paperItem(label);
		if (!text.length) return embed ? [Raw(`\\ref{${embed}}`)] : [Str(paperInText(label, number))];
		return inlines(text);
	};

	const urlTex = (u) => u.replace(/\\/g, '/').replace(/([%#])/g, '\\$1');

	const link = (n) => {
		const [, text, [url]] = n.c;
		if (url.startsWith('#')) {
			const target = decodeURIComponent(url.slice(1));
			const label = lab(id, target);
			if (!own.all.has(target)) {
				warn(`link to an unknown anchor #${target}`);
				return inlines(text);
			}
			if (target.startsWith('eq:')) return text.length ? hyper(label, inlines(text)) : [Raw(`\\eqref{${label}}`)];
			if (target.startsWith('fig:')) {
				const to = ctx.figureAlias?.(target) ?? label;
				return text.length ? hyper(to, inlines(text)) : [Raw(`\\ref{${to}}`)];
			}
			if (text.length) return hyper(label, inlines(text));
			const title = own.headers.get(target);
			if (!title) {
				warn(`a link with no text to #${target}, which is not a heading`);
				return [Raw(`\\ref{${label}}`)];
			}
			return [...hyper(label, withMode(st.mode === 'text' ? 'hoist' : st.mode, () => inlines(title))), Raw(ctx.frontmatter ? '' : ` (\\S\\,\\ref{${label}})`)];
		}
		if (url.startsWith('/tutorial/')) return tutorialLink(text, url);
		if (url.startsWith('/paper/')) return paperLink(text, url);
		if (/^https?:/i.test(url)) {
			// the text of a link out ("the GR course, section 0.7") numbers someone else's sections
			const mapped = withNumbers(false, () => inlines(text));
			if (!text.length || plain(text) === url) return [Raw(`\\gcurl{${urlTex(url)}}`)];
			// in a span, so that the numbers of its text are not taken for the book's sections
			const span = (c) => ({ t: 'Span', c: [['', [], []], c] });
			if (st.mode === 'note') return [span([...mapped, Raw(` (\\gcurl{${urlTex(url)}})`)])];
			marginItem([Raw(`\\gcurl{${urlTex(url)}}`)]);
			return [span([Raw(`\\href{${urlTex(url)}}{`), ...mapped, Raw('}')])];
		}
		warn(`a link the book cannot follow: ${url}`);
		return inlines(text);
	};

	// ---- inlines -------------------------------------------------------------------------------------------------------
	const rawTex = (src) =>
		src.replace(/\\(eqref|ref)\{([^}]+)\}/g, (all, cmd, l) => {
			if (!own.all.has(l)) {
				warn(`\\${cmd}{${l}}: no such label in this file`);
				return '(?)';
			}
			return `\\${cmd}{${lab(id, l)}}`;
		});

	const displayMath = (tex) => {
		const labels = [...tex.matchAll(/\\label\{([^}]+)\}/g)].map((m) => m[1]);
		const body = tex
			.replace(/\\label\{[^}]+\}/g, '')
			.replace(/\\(nonumber|notag)\b/g, '')
			.trim();
		if (!labels.length) return { t: 'Math', c: [{ t: 'DisplayMath' }, body] };
		if (labels.length > 1) warn(`one display with two labels: ${labels.join(', ')}`);
		return Raw(`\\begin{equation}\n${body}\n\\label{${lab(id, labels[0])}}\n\\end{equation}`);
	};

	const inline = (n) => {
		if (n.t === 'Str' && /\[\^[^\]]+\]/.test(n.c)) warn(`a footnote mark with no note: ${n.c}`);
		switch (n.t) {
			case 'Str':
			case 'Space':
			case 'SoftBreak':
			case 'LineBreak':
			case 'Code':
			case 'Cite':
				return n;
			case 'Emph':
			case 'Underline':
			case 'Strikeout':
			case 'Superscript':
			case 'Subscript':
			case 'SmallCaps':
				return { t: n.t, c: inlines(n.c) };
			case 'Strong': {
				const out = { t: 'Strong', c: inlines(n.c) };
				const idx = indexAt.get(n);
				return idx ? [out, Raw(idx.join(''))] : out;
			}
			case 'Quoted':
				return { t: 'Quoted', c: [n.c[0], inlines(n.c[1])] };
			case 'Span':
				return inlines(n.c[1]);
			case 'Math':
				return n.c[0].t === 'DisplayMath' ? displayMath(n.c[1]) : n;
			case 'RawInline': {
				const [fmt, src] = n.c;
				if (fmt === 'tex' || fmt === 'latex') return Raw(rawTex(src));
				if (fmt === 'html' && /^<!--[\s\S]*-->$/.test(src.trim())) return [];
				warn(`raw ${fmt} dropped: ${src.slice(0, 60)}`);
				return [];
			}
			case 'Link':
				return link(n);
			case 'Image':
				warn(`an image inside text is dropped: ${n.c[2][0]}`);
				return [];
			case 'Note': {
				if (st.mode === 'text') return { t: 'Note', c: withMode('note', () => blocks(n.c)) };
				if (st.mode === 'note') return withMode('note', () => noteInlines(n.c));
				// a note in a heading, caption or table: its text goes beside the next paragraph, unnumbered
				st.pending.push(withMode('note', () => noteInlines(n.c)));
				return [];
			}
			default:
				warn(`unknown inline ${n.t} dropped`);
				return [];
		}
	};

	/** Inlines, with "chapter 1.4" turned into "section 3.2" when the number is a link into the book. */
	function inlines(list) {
		const out = [];
		for (const n of list ?? []) {
			if (n.t === 'Link' && String(n.c[2][0]).startsWith('/tutorial/')) {
				const r = tutorialLink(n.c[1], n.c[2][0]);
				if (r.numbered && out.length >= 2 && out[out.length - 1].t === 'Space' && out[out.length - 2].t === 'Str') {
					const w = out[out.length - 2].c.match(/^(\W*)([cC])hapter(s?)$/);
					if (w) {
						out[out.length - 2] = Str(`${w[1]}${w[2] === 'C' ? 'S' : 's'}ection${w[3]}`);
						// "reading chapter R4" → "section 12.1"
						const r2 = out[out.length - 4];
						if (out.length >= 4 && out[out.length - 3].t === 'Space' && r2?.t === 'Str' && /^(\W*)[rR]eading$/.test(r2.c)) {
							const cap = /^\W*R/.test(r2.c);
							const lead = r2.c.match(/^(\W*)/)[1];
							out.splice(out.length - 4, 2);
							if (cap) out[out.length - 2] = Str(`${lead}Section${w[3]}`);
							else if (lead) out[out.length - 2] = Str(`${lead}section${w[3]}`);
						}
					}
				}
				out.push(...r.out);
				continue;
			}
			const r = inline(n);
			if (Array.isArray(r)) out.push(...r);
			else out.push(r);
		}
		return st.numbers ? plainNumbers(out) : out;
	}
	const withNumbers = (on, fn) => {
		const saved = st.numbers;
		st.numbers = on;
		try {
			return fn();
		} finally {
			st.numbers = saved;
		}
	};

	/**
	 * "section 4.5", "sections 4.5 and 4.6", "chapters 13.1–13.3", "section R9b" written as plain text: each tutorial
	 * number becomes the book's (\ref to the section), and "chapter" becomes "section" (or "appendix").
	 */
	const ID = String.raw`(?:R\d+b?|\d+\.\d+b?|A\.\d+)`;
	const TOKEN = new RegExp(`^(\\(?)(${ID})(?:[–-](${ID}))?([,;:)]*\\.?[,;:)]*)$`);
	const WORD = /^(\W*)([Ss]ection|[Cc]hapter|[Aa]ppendix|[Aa]ppendices)(s?)$/;
	const refFor = (tid) => {
		if (!ctx.knownId(tid)) {
			warn(`plain-text number "${tid}" is not a tutorial id`);
			return undefined;
		}
		if (!ctx.inBook(tid)) {
			warn(`plain-text number "${tid}" names a chapter outside the book`);
			return undefined;
		}
		if (!ctx.included(tid)) return undefined;
		if (ctx.isFront(tid)) return '\\emph{How to read this book}';
		return `\\ref{${secLabel(tid)}}`;
	};
	function plainNumbers(out) {
		for (let i = 0; i + 2 < out.length; i++) {
			const w = out[i].t === 'Str' && out[i].c.match(WORD);
			if (!w || out[i + 1].t !== 'Space' || out[i + 2].t !== 'Str' || !TOKEN.test(out[i + 2].c)) continue;
			// another book's or course's section ("the GR course's section 18.5", "Jackson's section 2.5"): left alone
			const near = out.slice(Math.max(0, i - 14), i);
			const before = near.filter((x) => x.t === 'Str').map((x) => x.c).join(' ');
			// a citation of a book just before: its title in italics, or its publisher and year
			if (near.some((x) => x.t === 'Emph') || /\b(1[89]|20)\d\d\)|edition|Press|Wiley|Springer|Dover|Freeman|Addison|Pergamon/.test(before)) continue;
			if (/course|lecture|[’']s$|\b(Jackson|Wald|Carroll|Misner|MTW|Weinberg|Landau|Griffiths|Feynman|Thorne|Blandford|Sakurai|Zee|Schutz|Maggiore|Poisson|Will|Kittel|Reif|Goldstein|Arfken|Born|Wolf|Hecht|Goodman|Kay|Cover|Shannon)\b/.test(before)) continue;
			const after = out.slice(i + 3, i + 8).filter((x) => x.t === 'Str').map((x) => x.c).join(' ');
			if (/^(?:of|in)\s+(?:the\s+)?(?:GR|course|[A-Z][a-z]+['’]?s?\b(?!.*section))/.test(after) && !/^of (?:the|this|a|an) /.test(after)) continue;
			const tokens = [];
			let j = i + 2;
			for (;;) {
				const m = out[j].c.match(TOKEN);
				tokens.push({ j, m });
				if (/\)/.test(m[4])) break;
				// a list goes on only to numbers that are the tutorial's ("section 3.7, 10.4 at…" is a list of one)
				const isId = (x) => x?.t === 'Str' && TOKEN.test(x.c) && ctx.knownId(x.c.match(TOKEN)[2]);
				if (/,/.test(m[4]) && out[j + 1]?.t === 'Space' && isId(out[j + 2])) j += 2;
				else if (!m[4] && out[j + 1]?.t === 'Space' && out[j + 2]?.t === 'Str' && /^(and|or|to)$/.test(out[j + 2].c) &&
					out[j + 3]?.t === 'Space' && isId(out[j + 4])) j += 4;
				else break;
			}
			let mapped = 0;
			let appendix = true;
			for (const { j: k, m } of tokens.reverse()) {
				const a = refFor(m[2]);
				const b = m[3] ? refFor(m[3]) : '';
				if (a === undefined || b === undefined) continue;
				mapped++;
				if (!m[2].startsWith('A.')) appendix = false;
				const parts = [m[1] && Str(m[1]), Raw(a), m[3] && Str('–'), m[3] && Raw(b), m[4] && Str(m[4])].filter(Boolean);
				out.splice(k, 1, ...parts);
			}
			if (mapped) {
				const plural = w[3] || /ices$/.test(w[2]);
				const cap = /^[SCA]/.test(w[2]);
				const word = appendix ? (plural ? 'appendices' : 'appendix') : `section${plural ? 's' : ''}`;
				out[i] = Str(`${w[1]}${cap ? word[0].toUpperCase() + word.slice(1) : word}`);
				// "reading chapter R4" → "section 14.1"
				if (i >= 2 && out[i - 1].t === 'Space' && out[i - 2].t === 'Str' && /^(\W*)[rR]eading$/.test(out[i - 2].c)) {
					const lead = out[i - 2].c.match(/^(\W*)/)[1];
					const capR = /^\W*R/.test(out[i - 2].c);
					out.splice(i - 2, 2);
					i -= 2;
					out[i] = Str(`${lead}${capR ? word[0].toUpperCase() + word.slice(1) : word}${plural && !appendix ? '' : ''}`);
				}
			}
		}
		return out;
	}

	/** A note's paragraphs as one run of inlines, for a margin note without a number. */
	const noteInlines = (bs) => {
		const out = [];
		for (const b of bs) {
			if (out.length) out.push(Raw('\\par '));
			if (b.t === 'Para' || b.t === 'Plain') out.push(...inlines(b.c));
			else warn(`a ${b.t} in a note that has to move into the margin is dropped`);
		}
		return out;
	};

	// ---- paragraphs and their margin notes -----------------------------------------------------------------------
	const flushMargin = () => {
		const items = [...st.pending.splice(0)];
		const out = [];
		if (st.pendingRaw.length) out.push(Raw(st.pendingRaw.splice(0).join('')));
		if (items.length) {
			const body = [];
			items.forEach((it, k) => {
				if (k) body.push(Raw('\\par '));
				body.push(...it);
			});
			out.push(Raw('\\gcmargin{'), ...body, Raw('}'));
		}
		return out;
	};

	const paragraph = (list, kind) => {
		if (st.mode !== 'text') {
			const content = inlines(list);
			return { t: kind, c: content };
		}
		const saved = [st.margin, st.paper];
		st.margin = [];
		st.paper = [];
		const content = inlines(list);
		const places = [...new Set(st.paper)];
		if (places.length) st.pending.push([Raw(`\\gcpaper{${places.join('; ')}}`)]);
		st.pending.push(...st.margin);
		[st.margin, st.paper] = saved;
		return { t: kind, c: [...flushMargin(), ...content] };
	};

	// ---- figures ---------------------------------------------------------------------------------------------------------
	const captionInlines = (bs) => {
		const out = [];
		for (const b of bs ?? []) {
			if (out.length) out.push(Str(' '));
			if (b.t === 'Para' || b.t === 'Plain') out.push(...b.c);
		}
		return withMode('hoist', () => inlines(out));
	};

	const takeOpener = (top) => {
		if (ctx.opener && top && !st.sawHeader && !st.opener && st.figures === 0) return true;
		return false;
	};

	const ownFigure = (n, top) => {
		const fid = String(n.c[0][0]);
		const content = n.c[2];
		const image = content.length === 1 && content[0].t === 'Plain' && content[0].c.length === 1 ? content[0].c[0] : undefined;
		if (image?.t !== 'Image') {
			warn(`figure ${fid} holds something other than one drawing`);
			return [];
		}
		const name = String(image.c[2][0]);
		// a hero drawing (the site's banner for a part) appears only if the text refers to it
		if (/-hero$/.test(name) && !ctx.figureReferenced?.(fid)) return [];
		// a drawing printed in an earlier section: a pointer in the margin
		const home = ctx.ownFigureHome?.(name);
		if (home && home.sid !== id) {
			st.pending.push([Raw(`\\gcfigback{${lab(home.sid, home.fid)}}`)]);
			return [];
		}
		const pdf = ctx.figurePdf(name);
		if (!pdf) {
			warn(`figure ${fid}: no drawing ${name}`);
			return [];
		}
		const caption = captionInlines(n.c[1][1]);
		const label = lab(id, fid);
		const opener = takeOpener(top);
		st.firstDrawing ??= pdf;
		st.figures++;
		const out = [
			RawB(`${opener ? '\\begin{gcopener}' : '\\begin{figure}[tbp]\n\\centering'}\n\\gcgraphic${ctx.figureScale?.(name) ? `[${ctx.figureScale(name)}]` : ''}{${pdf}}`),
			Plain([Raw('\\caption{'), ...caption, Raw(`}\\label{${label}}`)]),
			RawB(opener ? '\\end{gcopener}' : '\\end{figure}')
		];
		if (opener) {
			st.opener = out;
			return [];
		}
		return out;
	};

	const paperFigure = (figLabel, top) => {
		const fig = paper.figures.get(figLabel);
		if (!fig) {
			warn(`{{paper ${figLabel}}}: the paper has no such figure`);
			return [];
		}
		const label = ctx.paperFigureLabel(figLabel, id, true);
		// printed in an earlier section: a pointer in the margin
		const home = ctx.paperFigureHome?.(figLabel);
		if (home && home !== label) {
			st.pending.push([Raw(`\\gcfigback{${home}}`)]);
			return [];
		}
		const opener = takeOpener(top) && !fig.wide;
		st.firstDrawing ??= fig.files[0];
		st.figures++;
		// the paper's figures are drawn at the size they are printed in the paper
		const graphics = fig.files.map((f) => `\\gcgraphic[1]{${f}}`).join('\n');
		// the book's own caption (book/paper-captions.yaml) if it has one, else the paper's, stripped of its references
		const own = ctx.paperCaption(figLabel);
		const caption = own
			? Plain([Raw('\\caption{'), ...withMode('hoist', () => inlines(own)), Raw(`\\gcpapercredit{${fig.number}}}\\label{${label}}`)])
			: RawB(`\\caption{${fig.caption}\\gcpapercredit{${fig.number}}}\\label{${label}}`);
		const out = opener
			? [RawB(`\\begin{gcopener}\n${graphics}`), caption, RawB('\\end{gcopener}')]
			: [RawB(`\\begin{figure}[tbp]${fig.wide ? '\n\\begin{gcwide}' : ''}\n\\centering\n${graphics}`), caption, RawB(`${fig.wide ? '\\end{gcwide}\n' : ''}\\end{figure}`)];
		if (opener) {
			st.opener = out;
			return [];
		}
		return out;
	};

	const paperEquation = (eqLabel) => {
		const eq = paper.equations.get(eqLabel);
		if (!eq) {
			warn(`{{paper ${eqLabel}}}: the paper has no such equation`);
			return [];
		}
		return [{ ...Para([Raw(`\\begin{${eq.env}*}\n${eq.body}\n\\end{${eq.env}*}`)]), _display: true }];
	};

	// ---- boxes -----------------------------------------------------------------------------------------------------------
	const isHeader = (b, text) => b?.t === 'Header' && (text === undefined || plain(b.c[2]).trim() === text);
	const takeTitle = (kvs, content) => {
		if (content[0]?.t === 'Header') return { title: content[0].c[2], rest: content.slice(1) };
		const t = kvs.find(([k]) => k === 'title')?.[1];
		return { title: t ? [Str(t)] : [], rest: content };
	};
	const box = (env, title, content, withTitle = true) => [
		Plain([Raw(`\\begin{${env}}`), ...(withTitle ? [Raw('{'), ...withMode('hoist', () => inlines(title)), Raw('}')] : [])]),
		...blocks(content),
		RawB(`\\end{${env}}`)
	];

	/** An exercise's text, begun with its environment so that its number runs into the first line. */
	const runIn = (begin, end, content) => {
		const bs = blocks(content);
		if (bs[0] && (bs[0].t === 'Para' || bs[0].t === 'Plain')) bs[0] = { t: bs[0].t, c: [Raw(begin), ...bs[0].c] };
		else bs.unshift(Plain([Raw(begin)]));
		bs.push(RawB(end));
		return bs;
	};
	const exercise = (tier, q, a) => {
		const label = `ex:${id}:${++st.exerciseCount}`;
		// a problem tagged with its section, **[2.1]**, has the tag in its heading instead
		let section = id;
		const first = q[0];
		if (first && (first.t === 'Para' || first.t === 'Plain') && first.c[0]?.t === 'Strong') {
			const tag = plain(first.c[0].c).trim().match(/^\[([0-9RA][0-9a-z.]*)\]$/);
			if (tag) {
				if (ctx.included(tag[1])) section = tag[1];
				const rest = first.c.slice(1);
				while (rest[0] && (rest[0].t === 'Space' || rest[0].t === 'SoftBreak')) rest.shift();
				q = [{ t: first.t, c: rest }, ...q.slice(1)];
			}
		}
		st.exercises.push(...apart(() => runIn(`\\begin{exercise}{${label}}{${tier}}{${secLabel(section)}}`, '\\end{exercise}', q)));
		if (a?.length) st.solutions.push(...apart(() => runIn(`\\begin{solution}{${label}}`, '\\end{solution}', a)));
		else warn(`exercise ${label} has no solution`);
	};

	const check = (content) => {
		if (content.length === 1 && content[0].t === 'DefinitionList') {
			for (const [term, defs] of content[0].c) exercise('check', [Para(term)], defs.flat());
			return;
		}
		let i = 0;
		while (i < content.length) {
			if (!isHeader(content[i], 'Q')) {
				warn('check: a question does not start with "### Q"');
				return;
			}
			const q = [];
			for (i += 1; i < content.length && !isHeader(content[i]); i++) q.push(content[i]);
			const a = [];
			if (isHeader(content[i], 'A')) for (i += 1; i < content.length && !isHeader(content[i]); i++) a.push(content[i]);
			exercise('check', q, a);
		}
	};

	const problems = (content) => {
		let tier = 'practice';
		let text = [];
		for (const b of content) {
			if (b.t === 'Header') {
				const name = plain(b.c[2]).trim();
				if (TIERS[name]) tier = TIERS[name];
				else {
					warn(`problems: an unknown tier "${name}"`);
					text.push(b);
				}
				continue;
			}
			if (b.t === 'Div' && b.c[0][1].includes('solution')) {
				if (!text.length) warn('problems: a solution with no problem before it');
				else exercise(tier, text, b.c[1]);
				text = [];
				continue;
			}
			text.push(b);
		}
		if (text.length) exercise(tier, text, []);
	};

	const div = (n) => {
		const [[did, classes, kvs], content] = n.c;
		const kind = classes[0];
		if (did) st.pendingRaw.push(`\\phantomsection\\label{${lab(id, did)}}`);
		if (DROPPED.has(kind)) return [];
		switch (kind) {
			case 'try':
				st.pending.push([Raw('\\gctry')]);
				return [];
			case 'derivation': {
				const { title, rest } = takeTitle(kvs, content);
				return box('gcderivation', title, rest);
			}
			case 'example': {
				const { title, rest } = takeTitle(kvs, content);
				return box('gcexample', title, rest);
			}
			case 'history': {
				const { title, rest } = takeTitle(kvs, content);
				return box('gchistory', title, rest);
			}
			case 'gap':
				return box('gcgap', [], content, false);
			case 'deeper':
				st.deeper.push(...apart(() => withMode('note', () => blocks(content))));
				return [];
			case 'check':
				check(content);
				return [];
			case 'problems':
				problems(content);
				return [];
			default:
				warn(`unknown box ::: ${classes.join(' ')}; its content is kept`);
				return blocks(content);
		}
	};

	// ---- blocks ----------------------------------------------------------------------------------------------------------
	const cell = (c) => [c[0], c[1], c[2], c[3], blocks(c[4])];
	const row = (r) => [r[0], r[1].map(cell)];
	/** The longest cell of a table, in characters (mathematics counted at a third of its TeX). */
	const longestCell = (n) => {
		let max = 0;
		const visit = (x) => {
			if (Array.isArray(x)) {
				// a cell: [attr, align, rowspan, colspan, blocks]
				if (x.length === 5 && Array.isArray(x[4]) && typeof x[2] === 'number') {
					const len = x[4].map((b) => (b.c && Array.isArray(b.c) ? plain(b.c) : '')).join(' ').length;
					max = Math.max(max, len);
				}
				return x.forEach(visit);
			}
			if (x && typeof x === 'object' && x.c !== undefined) visit(x.c);
		};
		visit([n.c[3], n.c[4], n.c[5]]);
		return max;
	};
	const table = (n) =>
		withMode('hoist', () => {
			const [attr, caption, specs0, head, bodies, foot] = n.c;
			// a table of short entries (numbers, symbols) keeps its natural column widths and is shrunk to the line
			// if it is wider; one of sentences keeps pandoc's proportional columns, which wrap
			const natural = longestCell(n) <= 48;
			const specs = natural ? specs0.map(([align]) => [align, { t: 'ColWidthDefault' }]) : specs0;
			return {
				t: 'Table',
				c: [
					attr,
					[caption[0], blocks(caption[1])],
					specs,
					[head[0], head[1].map(row)],
					bodies.map((b) => [b[0], b[1], b[2].map(row), b[3].map(row)]),
					[foot[0], foot[1].map(row)]
				]
			};
		});

	const block = (n, top) => {
		switch (n.t) {
			case 'Para':
			case 'Plain': {
				const text = n.c.every((x) => x.t === 'Str' || x.t === 'Space') ? plain(n.c).trim() : '';
				const m = text.match(/^\{\{paper (eq|fig):([^}\s]+)\}\}$/);
				if (m) return m[1] === 'eq' ? paperEquation(`eq:${m[2]}`) : paperFigure(`fig:${m[2]}`, top);
				if (/\{\{paper\b/.test(text)) warn(`a paper label inside a paragraph: ${text.slice(0, 60)}`);
				return [paragraph(n.c, n.t)];
			}
			case 'Header': {
				const [level, [hid, cls, kvs], content] = n.c;
				if (level === 1) warn('a # heading in a section file');
				st.sawHeader = true;
				const title = withMode('hoist', () => inlines(content));
				const idx = indexAtHeader.get(hid);
				if (idx) st.pendingRaw.push(...idx);
				// in an appendix the file is the chapter, so its ## headings are its sections
				const lv = ctx.appendix ? Math.min(Math.max(level - 1, 1), 4) : Math.min(Math.max(level, 2), 4);
				return [{ t: 'Header', c: [lv, [lab(id, hid), cls, kvs], title] }];
			}
			case 'Figure':
				return ownFigure(n, top);
			case 'Div':
				return div(n);
			case 'BulletList':
				return [{ t: 'BulletList', c: n.c.map((item) => blocks(item)) }];
			case 'OrderedList':
				return [{ t: 'OrderedList', c: [n.c[0], n.c[1].map((item) => blocks(item))] }];
			case 'DefinitionList':
				return [{ t: 'DefinitionList', c: n.c.map(([term, defs]) => [withMode(st.mode === 'text' ? 'hoist' : st.mode, () => inlines(term)), defs.map((d) => blocks(d))]) }];
			case 'BlockQuote':
				return [{ t: 'BlockQuote', c: blocks(n.c) }];
			case 'LineBlock':
				return [{ t: 'LineBlock', c: n.c.map((l) => inlines(l)) }];
			case 'Table':
				return [table(n)];
			case 'CodeBlock':
			case 'HorizontalRule':
				return [n];
			case 'RawBlock': {
				const [fmt, src] = n.c;
				if (fmt === 'html' && /^<!--[\s\S]*-->$/.test(src.trim())) return [];
				if (fmt === 'tex' || fmt === 'latex') {
					if (/^(\s*\\(re)?newcommand[^\n]*\n?)+$/.test(src)) return [];
					return [RawB(rawTex(src))];
				}
				warn(`raw ${fmt} block dropped`);
				return [];
			}
			default:
				warn(`unknown block ${n.t} dropped`);
				return [];
		}
	};

	/** Blocks; the paper's displayed equations join the paragraph before them, as displays in a paragraph do. */
	function blocks(list, top = false) {
		const out = [];
		for (const b of list ?? []) {
			for (const r of block(b, top)) {
				const last = out[out.length - 1];
				if (r._display && last && (last.t === 'Para' || last.t === 'Plain')) {
					out[out.length - 1] = { t: last.t, c: [...last.c, { t: 'SoftBreak' }, ...r.c] };
				} else if (r._display) out.push({ t: 'Para', c: r.c });
				else out.push(r);
			}
		}
		return out;
	}

	// ---- the section ---------------------------------------------------------------------------------------------------
	const meta = doc.meta ?? {};
	const metaInlines = (k) => (meta[k]?.t === 'MetaInlines' ? meta[k].c : meta[k]?.t === 'MetaString' ? [Str(meta[k].c)] : []);
	const title = withMode('hoist', () => inlines(metaInlines('title')));
	const question = metaInlines('question');
	// the guiding question is asked again by the opening paragraph; in print it is kept only on request
	if (question.length && ctx.questions) st.pending.unshift([Raw('\\gcquestion{'), ...withMode('hoist', () => inlines(question)), Raw('}')]);

	const body = blocks(doc.blocks, true);
	if (st.pending.length || st.pendingRaw.length) body.push(Para(flushMargin()));

	return {
		titleText: words(metaInlines('title')),
		firstDrawing: st.firstDrawing,
		counts: { exercises: st.exerciseCount, figures: st.figures },
		doc: {
			'pandoc-api-version': doc['pandoc-api-version'],
			meta: {},
			blocks: [
				MARK('TITLE'),
				Plain(title),
				MARK('BODY'),
				...body,
				MARK('OPENER'),
				...(st.opener ?? []),
				MARK('DEEPER'),
				...st.deeper,
				MARK('EXERCISES'),
				...st.exercises,
				MARK('SOLUTIONS'),
				...st.solutions,
				MARK('END')
			]
		}
	};
}

/** The anchors a file defines: headings (with their titles), equations, figures, interactive figures, boxes. */
export function anchorsOf(doc) {
	const headers = new Map();
	const all = new Set();
	const paperFigs = [];
	const visit = (x) => {
		if (Array.isArray(x)) return x.forEach(visit);
		if (!x || typeof x !== 'object') return;
		if (x.t === 'Header') {
			headers.set(x.c[1][0], x.c[2]);
			all.add(x.c[1][0]);
		} else if (x.t === 'Figure' || x.t === 'Div') {
			if (x.c[0][0]) all.add(x.c[0][0]);
		} else if (x.t === 'Math' && x.c[0].t === 'DisplayMath') {
			for (const m of x.c[1].matchAll(/\\label\{([^}]+)\}/g)) all.add(m[1]);
			return;
		} else if (x.t === 'Para') {
			const t = x.c.every((y) => y.t === 'Str' || y.t === 'Space') ? plain(x.c).trim() : '';
			const m = t.match(/^\{\{paper fig:([^}\s]+)\}\}$/);
			if (m) paperFigs.push(`fig:${m[1]}`);
		}
		if (x.c !== undefined) visit(x.c);
	};
	visit(doc.blocks);
	return { headers, all, paperFigs };
}

/** The paper figures a file shows, in order. */
export const paperFiguresOf = (anchors) => anchors.paperFigs;
