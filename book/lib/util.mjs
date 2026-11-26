// Shared helpers of the book build: paths, YAML, pandoc, a small pool of child processes, hashing.
import { createRequire } from 'node:module';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BOOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const ROOT = path.dirname(BOOK);
export const TUTORIAL = path.join(ROOT, 'tutorial');
export const PAPER = path.join(ROOT, 'paper');
export const BUILD = path.join(BOOK, 'build');
export const OUT = path.join(BOOK, 'out');

// the site's YAML parser (app/node_modules), so that the book reads the data files exactly as the site does
const require = createRequire(path.join(ROOT, 'app', 'package.json'));
const YAML = require('yaml');
export const readYaml = (file) => YAML.parse(readFileSync(file, 'utf8'));

export const hash = (...parts) => {
	const h = createHash('sha1');
	for (const p of parts) h.update(typeof p === 'string' ? p : JSON.stringify(p));
	return h.digest('hex').slice(0, 16);
};

export const ensureDir = (dir) => {
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
};

/** Runs a program with input on stdin; resolves to its stdout. */
export function run(cmd, args, { input, cwd, maxBuffer = 1 << 28 } = {}) {
	return new Promise((resolve, reject) => {
		const child = execFile(cmd, args, { cwd, maxBuffer, encoding: 'utf8' }, (err, stdout, stderr) => {
			if (err) {
				err.message += `\n${stderr}`;
				reject(err);
			} else resolve({ stdout, stderr });
		});
		if (input !== undefined) {
			child.stdin.on('error', () => {});
			child.stdin.end(input);
		}
	});
}

/** Maps over items with at most `limit` promises in flight. */
export async function pool(items, limit, fn) {
	const out = new Array(items.length);
	let next = 0;
	const worker = async () => {
		while (next < items.length) {
			const i = next++;
			out[i] = await fn(items[i], i);
		}
	};
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
	return out;
}

/** The reader the site uses (app/src/lib/server/sources.ts), with the macros put before every file as it does, so
 * that headings get the same identifiers as on the site (they are made from the expanded mathematics). The book's
 * class defines \\htmlClass, which the colour and symbol macros expand to. */
export const MARKDOWN = 'markdown+tex_math_dollars+fenced_divs+footnotes+citations+raw_tex+yaml_metadata_block';
export const macros = () =>
	[path.join(PAPER, 'macros.tex'), path.join(TUTORIAL, 'macros.tex')]
		.map((f) =>
			readFileSync(f, 'utf8')
				.split('\n')
				.filter((line) => !/^\s*%/.test(line))
				.join('\n')
		)
		.join('\n');
export const siteInput = (md) => `${macros()}\n\n${normalizeFences(md)}`;

/** pandoc's fenced divs take `::: {.try #id}`; the tutorial writes `::: try {#id}` (as render.ts normalizes). */
export const normalizeFences = (md) =>
	md.replace(
		/^(:{3,})[ \t]*([A-Za-z][\w-]*)[ \t]*\{([^}]*)\}[ \t]*$/gm,
		(_, fence, cls, attrs) => `${fence} {.${cls} ${attrs.trim()}}`
	);

/** The words of a run of pandoc inlines (as the site's wordsOf), mathematics as its TeX. */
export const plain = (ns) =>
	(ns ?? [])
		.map((n) => {
			switch (n.t) {
				case 'Str':
					return n.c;
				case 'Space':
				case 'SoftBreak':
				case 'LineBreak':
					return ' ';
				case 'Emph':
				case 'Strong':
				case 'SmallCaps':
				case 'Underline':
				case 'Superscript':
				case 'Subscript':
					return plain(n.c);
				case 'Quoted':
					return n.c[0].t === 'DoubleQuote' ? `“${plain(n.c[1])}”` : `‘${plain(n.c[1])}’`;
				case 'Span':
				case 'Link':
					return plain(n.c[1]);
				case 'Math':
					return n.c[1];
				case 'Code':
					return n.c[1];
				default:
					return '';
			}
		})
		.join('');

/** Text without mathematics, for PDF bookmarks and running heads. */
export const words = (ns) =>
	(ns ?? [])
		.map((n) =>
			n.t === 'Math'
				? mathWords(n.c[1])
				: n.t === 'Str'
					? n.c
					: ['Space', 'SoftBreak', 'LineBreak'].includes(n.t)
						? ' '
						: n.c && Array.isArray(n.c)
							? words(n.t === 'Link' || n.t === 'Span' ? n.c[1] : n.t === 'Quoted' ? n.c[1] : n.c)
							: ''
		)
		.join('');

/** A rough reading of TeX as text, for bookmarks: \mathcal{E} becomes E, \alpha becomes α. */
const GREEK = {
	alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η',
	theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ',
	tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ',
	Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω', tE: 'E', tB: 'B', hbar: 'ħ',
	nabla: '∇', partial: '∂', infty: '∞', times: '×', cdot: '·', le: '≤', ge: '≥', approx: '≈', sim: '~'
};
const mathWords = (tex) =>
	tex
		.replace(/\\sym\{[^}]*\}/g, '')
		.replace(/\\([A-Za-z]+)/g, (_, cs) => GREEK[cs] ?? '')
		.replace(/[{}^_$\\]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/** TeX special characters escaped, for text the build writes into LaTeX itself. */
export const texEscape = (s) =>
	String(s)
		.replace(/\\/g, '\\textbackslash{}')
		.replace(/([#$%&_{}])/g, '\\$1')
		.replace(/~/g, '\\textasciitilde{}')
		.replace(/\^/g, '\\textasciicircum{}');
