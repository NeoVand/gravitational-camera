// The paper as the book needs it: the number of each label (from the paper's own LaTeX run, paper/main.aux), and
// its figures and labelled equations from its sources, so that {{paper fig:…}} and {{paper eq:…}} can be set as the
// paper sets them.
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PAPER } from './util.mjs';

const stripComments = (tex) => tex.replace(/(^|[^\\])%.*$/gm, '$1');

function readTex(file) {
	const text = stripComments(readFileSync(path.join(PAPER, file), 'utf8'));
	return text.replace(/\\input\{([^}]+)\}/g, (_, name) => readTex(name.endsWith('.tex') ? name : `${name}.tex`));
}

/** The argument of the first `\cmd{…}` at or after `from`, braces balanced; undefined if there is none. */
export function argumentOf(tex, cmd, from = 0) {
	const at = tex.indexOf(cmd, from);
	if (at < 0) return undefined;
	let i = at + cmd.length;
	while (tex[i] === ' ' || tex[i] === '\n') i++;
	if (tex[i] === '[') {
		let depth = 0;
		for (; i < tex.length; i++) {
			if (tex[i] === '[') depth++;
			else if (tex[i] === ']' && --depth === 0) {
				i++;
				break;
			}
		}
	}
	if (tex[i] !== '{') return undefined;
	let depth = 0;
	const start = i + 1;
	for (; i < tex.length; i++) {
		if (tex[i] === '\\') {
			i++;
			continue;
		}
		if (tex[i] === '{') depth++;
		else if (tex[i] === '}' && --depth === 0) return { value: tex.slice(start, i), end: i + 1 };
	}
	return undefined;
}

export function loadPaper(warn) {
	const tex = readTex('main.tex');
	const numbers = new Map();
	const aux = path.join(PAPER, 'main.aux');
	if (existsSync(aux)) {
		const sources = [path.join(PAPER, 'main.tex'), ...readdirSync(path.join(PAPER, 'sections')).map((f) => path.join(PAPER, 'sections', f))];
		const newest = Math.max(...sources.map((f) => statSync(f).mtimeMs));
		if (statSync(aux).mtimeMs < newest)
			warn('paper/main.aux is older than the paper\'s sources: its numbers may be stale (run `make paper`)');
		for (const m of readFileSync(aux, 'utf8').matchAll(/\\newlabel\{([^}]+)\}\{\{([^{}]*)\}/g))
			numbers.set(m[1], m[2]);
	} else warn('paper/main.aux is missing: the paper\'s numbers are shown as labels (run `make paper`)');

	// the site's ids of the paper's run-in paragraphs (\paragraph{Title} → par:title), with their section
	const paragraphs = new Map();
	{
		let section = '';
		const re = /\\(section|paragraph)\*?\{((?:[^{}]|\{[^{}]*\})*)\}(\s*\\label\{([^}]+)\})?/g;
		for (const m of tex.matchAll(re)) {
			if (m[1] === 'section') section = m[4] ?? '';
			else {
				const title = m[2].replace(/\$[^$]*\$/g, (x) => x).trim();
				paragraphs.set(`par:${slugify(title)}`, { section, title: title.replace(/[.:]$/, '') });
			}
		}
	}
	const number = (label) => numbers.get(label) ?? (paragraphs.has(label) ? numbers.get(paragraphs.get(label).section) ?? label : label);

	/** The paper's TeX moved into the book: its references become its numbers, its citations the book's. */
	const transplant = (s) =>
		s
			.replace(/\\label\{[^}]*\}/g, '')
			.replace(/\\eqref\{([^}]+)\}/g, (_, l) => `(${number(l)})`)
			.replace(/\\ref\{([^}]+)\}/g, (_, l) => number(l))
			.replace(/\\cite\{([^}]+)\}/g, '\\autocite{$1}')
			.trim();

	const figures = new Map();
	for (const m of tex.matchAll(/\\begin\{figure(\*?)\}([\s\S]*?)\\end\{figure\1\}/g)) {
		const body = m[2];
		const label = body.match(/\\label\{(fig:[^}]+)\}/)?.[1];
		if (!label) continue;
		const files = [...body.matchAll(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g)].map((g) => path.join(PAPER, g[1]));
		const caption = argumentOf(body, '\\caption')?.value ?? '';
		const stripped = stripReferences(caption);
		figures.set(label, {
			label,
			wide: m[1] === '*',
			files,
			caption: transplant(stripped.tex),
			number: number(label),
			removed: stripped.removed,
			residual: [...stripped.tex.matchAll(/\\(?:eq)?ref\{([^}]+)\}/g)].map((r) => r[1])
		});
	}

	const equations = new Map();
	for (const m of tex.matchAll(/\\begin\{(equation|align|gather|multline)\}([\s\S]*?)\\end\{\1\}/g)) {
		const labels = [...m[2].matchAll(/\\label\{([^}]+)\}/g)].map((l) => l[1]);
		if (!labels.length) continue;
		// every labelled line keeps the paper's number; the book's counter is not touched
		const body = m[2]
			.replace(/\\label\{([^}]+)\}/g, (_, l) => `\\tag*{\\papertag{${number(l)}}}`)
			.replace(/\\eqref\{([^}]+)\}/g, (_, l) => `(${number(l)})`)
			.trim();
		for (const l of labels) equations.set(l, { env: m[1], body, number: number(l) });
	}

	const known = (label) => numbers.has(label) || paragraphs.has(label);
	return { numbers, number, known, paragraphs, figures, equations };
}

/**
 * A paper caption's pointers into the rest of the paper ("(see Sec.~\ref{…})", "Eq.~\eqref{…}", "Section~\ref{…}
 * gives the model.") mean nothing in the book: they are taken out. Returns the caption and what was removed.
 */
export function stripReferences(tex) {
	const removed = [];
	const REF = String.raw`\\(?:eq)?ref\{[^}]+\}`;
	const NAME = String.raw`(?:Sec(?:tion)?s?\.?|Eqs?\.|Equations?|Fig(?:ure)?s?\.?|Tables?|App(?:endix)?\.?)`;
	const REFS = String.raw`${REF}(?:[\s~]*(?:,|and|--|–)[\s~]*(?:${NAME}~?)?${REF})*`;
	const take = (re, by = '') => {
		tex = tex.replace(re, (all) => {
			removed.push(all.replace(/\s+/g, ' ').trim());
			return by;
		});
	};
	// a sentence that only points into the paper: "Section~\ref{sec:first-image} gives the model and its assumptions."
	take(new RegExp(String.raw`(^|(?<=[.;]\s))\s*(?:See\s+)?${NAME}~?${REFS}[^.]*\.`, 'g'));
	// a parenthesis that holds a pointer: "(see Sec.~\ref{x})", "(Fig.~\ref{x})", "(Eqs.~\eqref{a}, \eqref{b})"
	take(new RegExp(String.raw`\s*\((?:see\s+|cf\.\s+)?(?:${NAME}~?)?${REFS}\)`, 'g'));
	// a pointer in running text: ", Eq.~\eqref{x}," or " of Eq.~\eqref{x}" or " by Eq.~\eqref{x}"
	take(new RegExp(String.raw`,\s*(?:as\s+in\s+|by\s+|from\s+|see\s+)?${NAME}~?${REFS}(?=[,.;)])`, 'g'));
	take(new RegExp(String.raw`\s+(?:of|by|from|in|see|as\s+in|against)\s+${NAME}~?${REFS}`, 'g'));
	take(new RegExp(String.raw`\s*,?\s*${NAME}~?${REFS}`, 'g'));
	return { tex: tex.replace(/\(\s*\)/g, '').replace(/\s+([,.;])/g, '$1').replace(/,\s*\./g, '.'), removed };
}

/** The site's identifiers (app/src/lib/render/pandoc.ts, slugify). */
export const slugify = (text) =>
	text
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/** How a paper label reads in the margin: "eq. (3)", "Sec. IV", "Fig. 12", "Table II". */
export function paperPlace(label, number, paper) {
	const [kind] = label.split(':');
	switch (kind) {
		case 'par': {
			const p = paper?.paragraphs.get(label);
			return p ? `Sec.~${number}, \\emph{${p.title.replace(/([#%&])/g, '\\$1')}}` : `Sec.~${number}`;
		}
		case 'eq':
			return `eq.~(${number})`;
		case 'sec':
			return `Sec.~${number}`;
		case 'fig':
			return `Fig.~${number}`;
		case 'tab':
			return `Table~${number}`;
		case 'app':
			return `App.~${number}`;
		default:
			return /^[A-Z]+(\.\d+)?$/.test(number) ? `Sec.~${number}` : `${number}`;
	}
}

/** How a paper label reads in running text, as the site shows it: "(3)" for an equation, else its number. */
export const paperInText = (label, number) => (label.startsWith('eq:') ? `(${number})` : number);
