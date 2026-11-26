#!/usr/bin/env node
// Builds The Gravitational Camera as a PDF from the tutorial's sources.
//
//   node book/build.mjs [options]        (or book/build.sh)
//
//   --parts Prologue,I   only these parts (a quick check; written to book/out/subset-<parts>.pdf)
//   --colour two|full|none   the colour of matter and field symbols (default two)
//   --font lm|garamond|libertinus|stix   the type (default lm, the paper's family)
//   --jobs N             parallel pandoc and figure jobs (default 4)
//   --no-pdf             convert only, do not run LaTeX
//   --no-cover           leave out the cover (book/cover/cover.pdf, trimmed of its bleed), which is otherwise page one
//   --runs N             at most N LuaLaTeX runs (default 4)
//
// Reads tutorial/book.yaml (parts → chapters → sections), tutorial/parts.yaml (each section's file),
// tutorial/glossary.yaml (index), paper/main.aux and the paper's .tex (numbers, figures, equations),
// tutorial/figures/*.svg (drawings). Writes book/build/ (cache and LaTeX) and book/out/.
import { readFileSync, writeFileSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { BOOK, BUILD, OUT, PAPER, ROOT, TUTORIAL, ensureDir, hash, siteInput, pool, readYaml, run, MARKDOWN, texEscape } from './lib/util.mjs';
import { loadPaper } from './lib/paper.mjs';
import { convertFigures } from './lib/figures.mjs';
import { anchorsOf, convertSection, paperFiguresOf } from './lib/convert.mjs';
import { unpaper } from './lib/unpaper.mjs';

const t0 = performance.now();
const args = process.argv.slice(2);
const opt = (name, fallback) => {
	const i = args.indexOf(`--${name}`);
	return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);
const JOBS = Number(opt('jobs', 4));
const COLOUR = opt('colour', 'two');
const FONT = opt('font', 'lm');
const RUNS = Number(opt('runs', 4));
const ONLY = opt('parts', '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

const warnings = [];
const warn = (m) => warnings.push(m);
const log = (m) => console.log(`[${((performance.now() - t0) / 1000).toFixed(1)}s] ${m}`);

// ---- the book's structure ---------------------------------------------------------------------------------------------
const book = readYaml(path.join(TUTORIAL, 'book.yaml'));
const catalogue = readYaml(path.join(TUTORIAL, 'parts.yaml'));
const entries = new Map();
for (const p of catalogue.parts) for (const c of p.chapters) entries.set(String(c.id), c);
const bySlug = new Map([...entries.values()].map((c) => [c.slug, String(c.id)]));

const front = (book.frontmatter ?? []).map((f) => String(f.id));
const parts = book.parts.filter((p) => !ONLY.length || ONLY.includes(String(p.id)));
if (!parts.length && !(ONLY.includes('A') && book.appendices?.length)) throw new Error(`--parts ${ONLY.join(',')}: no such part in tutorial/book.yaml`);
// the appendices (book.yaml's appendices:), each file a lettered chapter; in a build of some parts only with --parts A
const allAppendices = (book.appendices ?? []).map((a) => String(a.id));
const appendices = !ONLY.length || ONLY.includes('A') ? allAppendices : [];
const allSections = new Set([...front, ...book.parts.flatMap((p) => p.chapters.flatMap((c) => c.sections.map((s) => String(s.id)))), ...allAppendices]);
const sections = [...front, ...parts.flatMap((p) => p.chapters.flatMap((c) => c.sections.map((s) => String(s.id)))), ...appendices];
const included = new Set(sections);
for (const id of sections) if (!entries.has(id)) throw new Error(`tutorial/book.yaml: section ${id} is not in tutorial/parts.yaml`);

// ---- pass 1: every file as pandoc's tree (cached by content) ---------------------------------------------------------
const jsonDir = ensureDir(path.join(BUILD, 'json'));
const trees = new Map();
await pool([...allSections], JOBS, async (id) => {
	const file = path.join(TUTORIAL, `${entries.get(id).slug}.md`);
	const md = siteInput(readFileSync(file, 'utf8'));
	const key = hash(md, MARKDOWN);
	const cached = path.join(jsonDir, `${id}.json`);
	if (existsSync(cached)) {
		const c = JSON.parse(readFileSync(cached, 'utf8'));
		if (c.key === key) return trees.set(id, c.doc);
	}
	const { stdout } = await run('pandoc', ['-f', MARKDOWN, '-t', 'json'], { input: md, cwd: TUTORIAL });
	const doc = JSON.parse(stdout);
	writeFileSync(cached, JSON.stringify({ key, doc }));
	trees.set(id, doc);
});
log(`read ${trees.size} files (${sections.length} in this build)`);

const anchors = new Map([...trees].map(([id, doc]) => [id, anchorsOf(doc)]));

// ---- the paper ----------------------------------------------------------------------------------------------------------
const paper = loadPaper(warn);
// where each paper figure is shown in the book: section id → book labels
const paperFigs = new Map();
const paperFigureLabel = (fig, sid, create) => {
	if (!paperFigs.has(fig)) paperFigs.set(fig, []);
	const list = paperFigs.get(fig);
	if (create) {
		const k = list.filter((e) => e.sid === sid).length;
		const label = `pfig:${sid}:${fig}${k ? `:${k + 1}` : ''}`;
		list.push({ sid, label });
		return label;
	}
	return (list.find((e) => e.sid === sid) ?? list.find((e) => included.has(e.sid)))?.label;
};
// labels are made in order of the book, so that a link finds a figure shown later as well as earlier
for (const id of sections) for (const fig of paperFiguresOf(anchors.get(id))) paperFigureLabel(fig, id, true);
const preassigned = new Map([...paperFigs].map(([fig, list]) => [fig, list.map((e) => ({ ...e }))]));
const counters = new Map();
const labelFor = (fig, sid, create) => {
	if (!create) return paperFigureLabel(fig, sid, false);
	const k = (counters.get(`${sid}|${fig}`) ?? 0) + 1;
	counters.set(`${sid}|${fig}`, k);
	return preassigned.get(fig).filter((e) => e.sid === sid)[k - 1].label;
};

// ---- glossary → index ---------------------------------------------------------------------------------------------------
const glossary = readYaml(path.join(TUTORIAL, 'glossary.yaml')).terms ?? [];
const termsBySection = new Map();
let unplacedTerms = 0;
for (const t of glossary) {
	const sid = String(t.chapter ?? '');
	if (!allSections.has(sid)) {
		unplacedTerms++;
		continue;
	}
	if (!termsBySection.has(sid)) termsBySection.set(sid, []);
	termsBySection.get(sid).push({ term: String(t.term), anchor: String(t.anchor ?? '') });
}
if (unplacedTerms) warn(`glossary: ${unplacedTerms} terms are defined in chapters outside the book`);

// ---- figures -----------------------------------------------------------------------------------------------------------
const drawings = [];
const visitImages = (x) => {
	if (Array.isArray(x)) return x.forEach(visitImages);
	if (!x || typeof x !== 'object') return;
	if (x.t === 'Image') drawings.push(String(x.c[2][0]));
	if (x.c !== undefined) visitImages(x.c);
};
for (const id of sections) visitImages(trees.get(id).blocks);
const figurePdfs = await convertFigures(
	drawings.filter((n) => {
		const ok = existsSync(path.join(TUTORIAL, 'figures', `${n}.svg`));
		if (!ok) warn(`no drawing tutorial/figures/${n}.svg`);
		return ok;
	}),
	{ jobs: JOBS, log }
);

// ---- the book's own captions for the paper's figures (book/paper-captions.yaml: fig:label: "markdown") ------------
const paperCaptions = new Map();
{
	const file = path.join(BOOK, 'paper-captions.yaml');
	const own = existsSync(file) ? readYaml(file) ?? {} : {};
	const labels = Object.keys(own);
	for (const l of labels) if (!paper.figures.has(l)) warn(`paper-captions.yaml: the paper has no figure ${l}`);
	if (labels.length) {
		// one pandoc run for them all, each caption in a div of its own, read as the chapters are
		const md = labels.map((l, k) => `::: {#cap${k}}\n${String(own[l]).trim()}\n:::\n`).join('\n');
		const { stdout } = await run('pandoc', ['-f', MARKDOWN, '-t', 'json'], { input: siteInput(md), cwd: TUTORIAL });
		for (const b of JSON.parse(stdout).blocks) {
			const k = b.t === 'Div' ? Number(String(b.c[0][0]).replace('cap', '')) : NaN;
			if (Number.isNaN(k)) continue;
			const inl = b.c[1].flatMap((x, i) => (x.t === 'Para' || x.t === 'Plain' ? [...(i ? [{ t: 'Space' }] : []), ...x.c] : []));
			paperCaptions.set(labels[k], inl);
		}
	}
	// which paper figures the book shows with the paper's own caption, and what was taken out of it
	const shown = [...new Set([...paperFigs.keys()].filter((f) => paperFigs.get(f).some((e) => included.has(e.sid))))].sort();
	const lines = shown.map((f) => {
		const fig = paper.figures.get(f);
		if (!fig) return `${f}: not in the paper`;
		if (paperCaptions.has(f)) return `${f} (paper Fig. ${fig.number}): the book's caption`;
		return `${f} (paper Fig. ${fig.number}): the paper's caption${fig.removed.length ? `, without ${fig.removed.join(' | ')}` : ''}`;
	});
	writeFileSync(path.join(ensureDir(BUILD), 'paper-captions.txt'), lines.join('\n') + '\n');
	const unchanged = shown.filter((f) => !paperCaptions.has(f)).length;
	log(`paper figures: ${shown.length} shown, ${shown.length - unchanged} with the book's caption, ${unchanged} with the paper's (book/build/paper-captions.txt)`);
}

// ---- pass 2: each section to LaTeX ----------------------------------------------------------------------------------
const texDir = ensureDir(path.join(BUILD, 'tex'));
ensureDir(path.join(texDir, 'sec'));
ensureDir(path.join(texDir, 'ch'));

// no chapter openers: a chapter starts with its text (a copy of its first drawing repeated it; the hero drawings
// decorate the site, and the book drops those the text never refers to)
const openers = new Set();
const referencedFigures = new Set();
for (const id of sections) {
	const src = readFileSync(path.join(TUTORIAL, `${entries.get(id).slug}.md`), 'utf8');
	for (const m of src.matchAll(/\(#(fig:[a-z0-9-]+)\)/g)) referencedFigures.add(m[1]);
}
// a drawing of the tutorial used in more than one section is printed once, where the book first reaches it
const ownFigureHome = new Map();
const ownFigureAlias = new Map();
for (const id of sections) {
	const src = readFileSync(path.join(TUTORIAL, `${entries.get(id).slug}.md`), 'utf8');
	for (const m of src.matchAll(/\]\((tut-[a-z0-9-]+)\)\{#(fig:[a-z0-9-]+)\}/g)) {
		const home = ownFigureHome.get(m[1]);
		if (!home) ownFigureHome.set(m[1], { sid: id, fid: m[2] });
		else if (home.sid !== id) ownFigureAlias.set(`${id}|${m[2]}`, `${home.sid}:${home.fid}`);
	}
}
// a paper figure is printed once too, at its first place in the book
const paperFigureHome = (fig) => paperFigs.get(fig)?.find((e) => included.has(e.sid))?.label;
// the book names no paper: every sentence that does is taken out (book/lib/unpaper.mjs), and those taken from the
// text proper are listed in book/build/unpaper.txt
{
	const removed = [];
	let notes = 0;
	for (const id of sections) {
		trees.set(
			id,
			unpaper(trees.get(id), {
				figureShown: (label) => Boolean(paperFigureHome(label)),
				report: (kind, t) => (kind === 'note' ? notes++ : removed.push(`${id}\t${kind}\t${t}`))
			})
		);
	}
	writeFileSync(path.join(BUILD, 'unpaper.txt'), removed.join('\n') + '\n');
	log(`no paper: ${notes} notes and ${removed.length} sentences, headings or readings removed (book/build/unpaper.txt)`);
}
// the size a drawing is printed at, where the default (85% of its own) is too large for what it shows
const figureScales = existsSync(path.join(BOOK, 'figure-scales.yaml')) ? (readYaml(path.join(BOOK, 'figure-scales.yaml')) ?? {}) : {};
const converted = new Map();
const counts = { exercises: 0, figures: 0 };
await pool(sections, JOBS, async (id) => {
	const r = convertSection({
		id,
		doc: trees.get(id),
		paper,
		frontmatter: front.includes(id),
		appendix: allAppendices.includes(id),
		knownId: (sid) => entries.has(sid),
		paperCaption: (label) => paperCaptions.get(label),
		opener: openers.has(id),
		included: (sid) => included.has(sid),
		inBook: (sid) => allSections.has(sid),
		isFront: (sid) => front.includes(sid),
		bySlug,
		anchors: (sid) => anchors.get(sid) ?? { headers: new Map(), all: new Set() },
		paperFigureLabel: labelFor,
		paperFigureHome,
		ownFigureHome: (name) => ownFigureHome.get(name),
		figureAlias: (fid) => ownFigureAlias.get(`${id}|${fid}`),
		figureScale: (name) => figureScales[name],
		figurePdf: (name) => figurePdfs.get(name),
		figureReferenced: (fid) => referencedFigures.has(fid),
		glossary: termsBySection.get(id) ?? [],
		warn
	});
	counts.exercises += r.counts.exercises;
	counts.figures += r.counts.figures;
	let { stdout } = await run('pandoc', ['-f', 'json', '-t', 'latex', '--biblatex', '--wrap=preserve'], {
		input: JSON.stringify(r.doc)
	});
	const out = {};
	stdout = tabulars(stdout);
	// a box straight after another shares its rule: the second opens without one of its own
	stdout = stdout.replace(/(\\end\{gc(?:derivation|example|gap|history)\}\s*)(\\begin\{gc(?:derivation|example|gap|history)\})/g, '$1\\gcjoinbox$2');
	const re = /^%%@@PART:([A-Z]+)@@$/gm;
	let m;
	let last;
	while ((m = re.exec(stdout))) {
		if (last) out[last.name] = stdout.slice(last.end, m.index).trim();
		last = { name: m[1], end: m.index + m[0].length };
	}
	converted.set(id, { ...out, titleText: r.titleText, firstDrawing: r.firstDrawing });
});
log(`converted ${converted.size} sections: ${counts.figures} figures, ${counts.exercises} exercises`);

/**
 * pandoc writes every table as a longtable, which breaks across pages but not beside marginfix's margin (TeX finds
 * infinite shrinkage when it splits the page). The tutorial's tables are short: they become tabulars that do not
 * break, with the head first and the closing rule last.
 */
function tabulars(tex) {
	// the column spec runs over several lines when pandoc gives the columns widths: read it to its closing brace
	return tex.replace(/\\begin\{longtable\}\[\]\{([\s\S]*?)\\end\{longtable\}/g, (all, rest) => {
		let depth = 1;
		let i = 0;
		for (; i < rest.length && depth; i++) depth += rest[i] === '{' ? 1 : rest[i] === '}' ? -1 : 0;
		let spec = rest.slice(0, i - 1);
		const body = rest.slice(i).replace(/^\n/, '');
		let head = '';
		let foot = '';
		let rows = body;
		const cut = (marker) => {
			const k = rows.indexOf(marker);
			if (k < 0) return undefined;
			const before = rows.slice(0, k);
			rows = rows.slice(k + marker.length);
			return before;
		};
		const first = cut('\\endfirsthead');
		if (first !== undefined) {
			head = first;
			cut('\\endhead');
		} else head = cut('\\endhead') ?? '';
		const lastfoot = rows.indexOf('\\endlastfoot');
		if (lastfoot >= 0) {
			const f = rows.slice(0, lastfoot);
			rows = rows.slice(lastfoot + '\\endlastfoot'.length);
			const k = f.indexOf('\\endfoot');
			foot = k >= 0 ? f.slice(k + '\\endfoot'.length) : f;
		}
		// a caption of a longtable (none in the tutorial) would be lost: keep its text above
		const caption = head.match(/\\caption\{([\s\S]*?)\}\\tabularnewline/);
		head = head.replace(/\\caption[\s\S]*?\\tabularnewline/, '');
		const inner = `${head.trim()}\n${rows.trim()}\n${foot.trim()}`;
		const tab = (sp, text = inner) => `\\begin{tabular}{${sp}}\n${text}\n\\end{tabular}`;
		// at natural width a head cell is its words: pandoc's minipage of the line's width would fill the line
		const unboxed = inner.replace(/\\begin\{minipage\}\[[a-z]\]\{\\linewidth\}\\(?:raggedright|raggedleft|centering)\s*([\s\S]*?)\s*\\end\{minipage\}/g, '$1');
		// a table of wrapping columns is set at its natural width if that fits the line, and only otherwise wraps,
		// with each column as wide as its longest entry asks
		const cols = [...spec.matchAll(/>\{\\(raggedright|raggedleft|centering)\\arraybackslash\}p\{\(\\linewidth - (\d+)\\tabcolsep\) \* \\real\{([\d.]+)\}\}/g)];
		let fit = `\\gcfittable{${tab(spec)}}{}`;
		// a table of plain columns (l, c, r) wraps too, if it is wider than the line, rather than being shrunk
		const plainCols = spec.replace(/@\{\}/g, '').replace(/\s+/g, '');
		if (!cols.length && /^[lcr]+$/.test(plainCols) && plainCols.length > 1) {
			const n = plainCols.length;
			const para = { l: 'raggedright', c: 'centering', r: 'raggedleft' };
			spec = `@{}${[...plainCols].map((a) => `>{\\${para[a]}\\arraybackslash}p{(\\linewidth - ${2 * n}\\tabcolsep) * \\real{0.1}}`).join('\n  ')}@{}`;
			cols.push(...spec.matchAll(/p\{/g));
		}
		if (cols.length) {
			const natural = spec.replace(/>\{\\(raggedright|raggedleft|centering)\\arraybackslash\}p\{[^{}]*\{[\d.]+\}\}/g, (m, a) => ({ raggedright: 'l', raggedleft: 'r', centering: 'c' })[a]);
			const lengths = cols.map(() => 4);
			for (const line of unboxed.split('\\\\')) {
				const cells = line.replace(/\\(toprule|midrule|bottomrule)(\\noalign\{\})?/g, '').split(/(?<!\\)&/);
				if (cells.length !== cols.length) continue;
				cells.forEach((c, k) => {
					const text = c.replace(/\\[a-zA-Z@]+/g, 'x').replace(/[{}$\\^_]/g, '').replace(/\s+/g, ' ').trim();
					// as wide as the entry asks, up to a long line's worth, and never narrower than its longest word
					const word = Math.max(0, ...text.split(' ').map((w) => w.length));
					lengths[k] = Math.max(lengths[k], Math.min(text.length, 70), 1.4 * word + 2);
				});
			}
			const total = lengths.reduce((a, b) => a + b, 0);
			let k = 0;
			const wrapped = spec.replace(/\\real\{[\d.]+\}/g, () => `\\real{${(lengths[k++] / total).toFixed(4)}}`);
			fit = `\\gcfittable{${tab(natural, unboxed)}}{${tab(wrapped)}}`;
		}
		return `${caption ? `{\\small ${caption[1]}}\\par\n` : ''}\\begin{center}\\small\n${fit}\n\\end{center}`;
	});
}

// ---- assembly --------------------------------------------------------------------------------------------------------
const sectionTex = (id) => {
	const c = converted.get(id);
	const e = entries.get(id);
	// a reading chapter's front-matter title is already a book title; parts.yaml's short title is the tutorial's
	const short = /^R/.test(id) ? c.titleText : e.short ?? c.titleText;
	const head = front.includes(id)
		? `\\bookunnumbered{How to read this book}{sec:${id}}{How to read this book}\n\\gc@unnumberedheadings`
		: allAppendices.includes(id)
			? `\\bookappendix{${c.TITLE}}{sec:${id}}{${texEscape(c.titleText)}}{${texEscape(c.titleText)}}`
			: `\\booksection{${c.TITLE}}{${texEscape(short)}}{sec:${id}}{${texEscape(c.titleText)}}`;
	const tail = front.includes(id) ? '\n\\gc@numberedheadings' : '';
	writeFileSync(path.join(texDir, 'sec', `${id}.tex`), `% tutorial/${e.slug}.md\n\\makeatletter\n${head}\n\\makeatother\n\n${c.BODY}\n${tail ? `\\makeatletter${tail}\\makeatother\n` : ''}`);
	return `\\input{sec/${id}}`;
};

const main = [];
const solutions = [];
let chapterNo = 0;
for (const p of parts) {
	if (p.id !== 'Prologue') main.push(`\\bookpart{${p.id}}{${texEscape(p.title)}}`);
	for (const ch of p.chapters) {
		const ids = ch.sections.map((s) => String(s.id));
		const isPrologue = p.id === 'Prologue';
		if (!isPrologue) chapterNo++;
		const label = isPrologue ? 'ch:prologue' : `ch:${chapterNo}`;
		const title = texEscape(ch.title);
		const lines = [`% ${isPrologue ? 'Prologue' : `Chapter ${chapterNo}`}: ${ch.title}`];
		lines.push(isPrologue ? `\\bookprologue{${title}}{${label}}{${title}}` : `\\bookchapter{${title}}{${label}}{${title}}`);
		// the chapter opens with its first drawing: the figure itself if the text begins with it, else a copy
		const opener = converted.get(ids[0]).OPENER;
		const art = ids.map((id) => converted.get(id).firstDrawing).find(Boolean);
		if (opener) lines.push(opener);
		void art;
		for (const id of ids) lines.push(sectionTex(id));
		const deeper = ids.filter((id) => converted.get(id).DEEPER);
		if (deeper.length) {
			lines.push('\\furtherreading');
			for (const id of deeper) lines.push(`\\furtherreadingfor{sec:${id}}`, converted.get(id).DEEPER);
			lines.push('\\normalsize');
		}
		const ex = ids.map((id) => converted.get(id).EXERCISES).filter(Boolean);
		if (ex.length) lines.push('\\exercisesheading', ...ex, '\\normalsize');
		const sol = ids.map((id) => converted.get(id).SOLUTIONS).filter(Boolean);
		if (sol.length)
			solutions.push(`\\solutionsfor{${isPrologue ? 'Prologue' : `Chapter~\\ref{${label}}`}}{${title}}`, ...sol);
		const file = `ch/${isPrologue ? '00' : String(chapterNo).padStart(2, '0')}`;
		writeFileSync(path.join(texDir, `${file}.tex`), lines.join('\n\n') + '\n');
		main.push(`\\input{${file}}`);
	}
}
// the appendices: each file a lettered chapter, with its own exercises
const appendixInputs = [];
for (const id of appendices) {
	const c = converted.get(id);
	const lines = [`% Appendix: ${id}`, sectionTex(id)];
	if (c.DEEPER) lines.push('\\furtherreading', c.DEEPER, '\\normalsize');
	if (c.EXERCISES) lines.push('\\exercisesheading', c.EXERCISES, '\\normalsize');
	if (c.SOLUTIONS) solutions.push(`\\solutionsfor{Appendix~\\ref{sec:${id}}}{${texEscape(c.titleText)}}`, c.SOLUTIONS);
	const file = `ch/app-${id.replace(/\W/g, '-')}`;
	writeFileSync(path.join(texDir, `${file}.tex`), lines.join('\n\n') + '\n');
	appendixInputs.push(`\\input{${file}}`);
}
writeFileSync(path.join(texDir, 'solutions.tex'), solutions.join('\n\n') + '\n');

const frontSections = front.filter((id) => converted.has(id)).map(sectionTex);
// the cover, first, cut to the trim (its 3 mm of bleed, 8.504 bp, off each side), and a blank page behind it, so that the
// half title stays on a right-hand page; its page numbers are A and B, apart from the front matter's roman ones
const coverPdf = path.join(BOOK, 'cover', 'cover.pdf');
const withCover = !flag('no-cover') && existsSync(coverPdf);
if (!flag('no-cover') && !withCover) warn(`cover: ${path.relative(ROOT, coverPdf)} not found; built without it`);
const cover = withCover
	? String.raw`\pagenumbering{Alph}
\includepdf[pages=1, noautoscale, trim=8.504 8.504 8.504 8.504, clip]{${coverPdf}}
\cleardoublepage
`
	: '';
const doc = String.raw`% The Gravitational Camera, written by book/build.mjs. Do not edit: edit the tutorial, or the book's class.
\documentclass[colour=${COLOUR},font=${FONT}]{gcbook}
\addbibresource{${path.join(PAPER, 'refs.bib')}}
\addbibresource{${path.join(BOOK, 'book.bib')}}
\hypersetup{pdftitle={The Gravitational Camera}, pdfauthor={Mostafa Mohsenvand}}
${withCover ? '\\usepackage{pdfpages}' : ''}
\begin{document}
${cover}\frontmatter
\input{front}
\tableofcontents
\bookunnumbered{Preface}{preface}{Preface}
\input{preface}
${frontSections.join('\n')}
\mainmatter
${main.join('\n')}
\bookendparts
${appendixInputs.length ? `\\bookappendices\n${appendixInputs.join('\n')}\n` : ''}\backmatter
\bookunnumbered{Selected solutions}{solutions}{Selected solutions}
\begin{gcsolutions}
\input{solutions}
\end{gcsolutions}
\gcbibliography
\printindex
\end{document}
`;
writeFileSync(path.join(texDir, 'main.tex'), doc);
log(`wrote ${path.relative(ROOT, texDir)}/main.tex (${chapterNo} chapters${parts.some((p) => p.id === 'Prologue') ? ' and the Prologue' : ''})`);

// ---- LaTeX ------------------------------------------------------------------------------------------------------------
const report = () => {
	const seen = new Map();
	for (const w of warnings) {
		const k = w.replace(/^[^:]+: /, '');
		seen.set(k, (seen.get(k) ?? 0) + 1);
	}
	if (warnings.length) {
		console.log(`\n${warnings.length} conversion warnings:`);
		for (const w of [...new Set(warnings)].slice(0, 60)) console.log(`  ${w}`);
		if (warnings.length > 60) console.log(`  … and ${warnings.length - 60} more (all in book/build/warnings.txt)`);
	}
	writeFileSync(path.join(BUILD, 'warnings.txt'), warnings.join('\n') + '\n');
};

if (flag('no-pdf')) {
	report();
	process.exit(0);
}

const env = {
	...process.env,
	PATH: `/Library/TeX/texbin:${process.env.PATH}`,
	TEXINPUTS: `${path.join(BOOK, 'tex')}//:`,
	BIBINPUTS: `${PAPER}:${BOOK}:`
};
const sh = (cmd, a) =>
	new Promise((resolve) => {
		import('node:child_process').then(({ execFile }) =>
			// a run that loops (a margin note that never finds room, say) is stopped after 40 minutes
			execFile(cmd, a, { cwd: texDir, env, maxBuffer: 1 << 28, timeout: 40 * 60 * 1000 }, (err, stdout, stderr) => resolve({ err, stdout, stderr }))
		);
	});
const lualatex = async (k) => {
	const t = performance.now();
	const r = await sh('lualatex', ['-interaction=nonstopmode', '-file-line-error', 'main.tex']);
	log(`lualatex run ${k}: ${((performance.now() - t) / 1000).toFixed(0)} s${r.err ? ' (with errors)' : ''}`);
	return readFileSync(path.join(texDir, 'main.log'), 'latin1');
};
let texlog = await lualatex(1);
const b = await sh('biber', ['--quiet', 'main']);
if (b.err) warn(`biber: ${(b.stdout + b.stderr).split('\n').filter((l) => /ERROR|WARN/.test(l)).slice(0, 5).join(' | ')}`);
const mi = await sh('makeindex', ['-q', '-s', path.join(BOOK, 'tex', 'gcbook.ist'), 'main.idx']);
if (mi.err) warn(`makeindex: ${mi.stderr}`);
for (let k = 2; k <= RUNS; k++) {
	texlog = await lualatex(k);
	if (k >= 3 && !/Rerun to get|Label\(s\) may have changed|Please rerun|rerunfilecheck/.test(texlog)) break;
	if (k === 2) await sh('makeindex', ['-q', '-s', path.join(BOOK, 'tex', 'gcbook.ist'), 'main.idx']);
}

const errors = [...texlog.matchAll(/^(?:\S+:\d+: |! )(.*)$/gm)].map((m) => m[1]);
const missing = [...new Set([...texlog.matchAll(/Missing character: There is no (.+?) \(U\+([0-9A-F]+)\)/g)].map((m) => `${m[1]} U+${m[2]}`))];
const undefinedRefs = [...new Set([...texlog.matchAll(/Reference `([^']+)' on page \d+ undefined/g)].map((m) => m[1]))];
const undefinedCites = [...new Set([...texlog.matchAll(/Citation '([^']+)' on page \d+ undefined/g)].map((m) => m[1]))];
const overfull = (texlog.match(/^Overfull \\hbox/gm) ?? []).length;
const pdf = path.join(texDir, 'main.pdf');
const name = ONLY.length ? `subset-${ONLY.join('-')}.pdf` : 'the-gravitational-camera.pdf';
ensureDir(OUT);
let pages = '?';
if (existsSync(pdf)) {
	copyFileSync(pdf, path.join(OUT, name));
	const info = await sh('pdfinfo', [pdf]);
	pages = info.stdout.match(/Pages:\s+(\d+)/)?.[1] ?? '?';
}
report();
console.log(`\nLaTeX: ${errors.length} errors, ${undefinedRefs.length} undefined references, ${undefinedCites.length} undefined citations, ${missing.length} missing glyphs, ${overfull} overfull lines`);
for (const e of errors.slice(0, 20)) console.log(`  error: ${e}`);
if (undefinedRefs.length) console.log(`  undefined: ${undefinedRefs.slice(0, 15).join(', ')}`);
if (undefinedCites.length) console.log(`  uncited: ${undefinedCites.slice(0, 15).join(', ')}`);
if (missing.length) console.log(`  missing glyphs: ${missing.slice(0, 20).join(', ')}`);
log(`book/out/${name}: ${pages} pages`);
process.exit(errors.length ? 1 : 0);
