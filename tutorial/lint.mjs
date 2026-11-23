#!/usr/bin/env node
/**
 * The style lint of STYLE.md, for every chapter (tutorial/**\/*.md) and the text of the data files (glossary.yaml,
 * symbols.yaml, parts.yaml). It flags, in the prose:
 *   - em dashes (use a colon, a full stop or parentheses);
 *   - -ise spellings (British with -ize; analyse and analysis are the exception);
 *   - exclamation marks;
 *   - the banned words and phrases of STYLE.md §2 (some only from their second use in a chapter);
 *   - e-notation (9e-9; write 9 × 10⁻⁹), here in mathematics too;
 *   - colour macros that are not defined (a misspelt \curv, or \htmlClass{q-…} with an unknown role).
 * A line may allow one flagged word with a comment: <!-- lint-allow: just -->.
 *
 * Usage: node tutorial/lint.mjs [files...]   (no files: the whole folder). Exit code 1 if anything is flagged.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROLES = ['matter', 'field', 'curv', 'obs', 'light'];
/** Standard TeX commands that happen to be spelt close to a role macro (\right is one letter from \light). */
const TEX_COMMANDS = new Set(['right', 'Right', 'curl', 'circ', 'cdot', 'ddot', 'dot', 'lbrace', 'rbrace', 'bigr', 'Bigr']);

/** Words ending in -ise that have no -ize spelling (matched whole, never as endings: "theorise" ends in "rise"). */
const ISE_OK = [
	'advise', 'apprise', 'arise', 'chastise', 'circumcise', 'comprise', 'compromise', 'concise', 'demise',
	'despise', 'devise', 'disguise', 'enterprise', 'excise', 'exercise', 'expertise', 'franchise', 'guise',
	'improvise', 'incise', 'merchandise', 'noise', 'paradise', 'poise', 'porpoise', 'praise', 'precise', 'premise',
	'promise', 'raise', 'reprise', 'revise', 'rise', 'supervise', 'surmise', 'surprise', 'televise', 'tortoise',
	'treatise', 'valise', 'wise', 'cruise', 'bruise', 'analyse', 'imprecise', 'unwise', 'advertise',
	'otherwise', 'likewise', 'clockwise', 'anticlockwise', 'counterclockwise', 'sunrise', 'moonrise', 'uprise',
	'reprise', 'paradise', 'despise', 'anise', 'premise', 'chemise'
];

/** [pattern, message, allowed uses per chapter] */
const BANNED = [
	[/\bclearly\b/gi, '"clearly"', 0],
	[/\bobviously\b/gi, '"obviously"', 0],
	[/\btrivially\b/gi, '"trivially"', 0],
	[/\bsimply\b/gi, '"simply" (as a softener)', 0],
	[/\bjust\b/gi, '"just" (as a softener)', 0],
	[/\bof course\b/gi, '"of course"', 0],
	[/\bit is easy to see\b/gi, '"it is easy to see"', 0],
	[/\bit is straightforward\b/gi, '"it is straightforward"', 0],
	[/\bnote that\b/gi, '"note that" more than once', 1],
	[/\binterestingly\b/gi, '"interestingly"', 0],
	[/\bremarkably\b/gi, '"remarkably"', 0],
	[/\bcrucially\b/gi, '"crucially"', 0],
	[/\bessentially\b/gi, '"essentially"', 0],
	[/\bbasically\b/gi, '"basically"', 0],
	[/\bactually\b/gi, '"actually" (as filler)', 0],
	[/\blet['’]s\b/gi, '"let\'s" (use "we")', 0],
	[/\bmagic(al)?\b/gi, '"magic"', 0],
	[/\bthe beauty of\b/gi, '"the beauty of"', 0],
	[/\belegant(ly)?\b/gi, '"elegant"', 0],
	[/\bit turns out that\b/gi, '"it turns out that" more than once', 1],
	[/\bin this chapter we will\b/gi, '"in this chapter we will" more than once', 1]
];

const macroNames = () => {
	const names = new Set();
	for (const file of [path.join(HERE, 'macros.tex'), path.join(HERE, '..', 'paper', 'macros.tex')])
		for (const m of readFileSync(file, 'utf8').matchAll(/\\newcommand\{\\([A-Za-z]+)\}/g)) names.add(m[1]);
	return names;
};

/** Levenshtein distance, for misspelt macros. */
function distance(a, b) {
	const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
	for (let j = 1; j <= b.length; j++) d[0][j] = j;
	for (let i = 1; i <= a.length; i++)
		for (let j = 1; j <= b.length; j++)
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
	return d[a.length][b.length];
}

/**
 * The text split into prose and mathematics, with line numbers kept: front matter keys, code, URLs, HTML comments
 * and link targets are blanked (with spaces, so that positions stay), and mathematics is moved to its own list.
 */
function split(text, yaml) {
	const blank = (s) => s.replace(/[^\n]/g, ' ');
	let prose = text;
	if (yaml) prose = prose.replace(/^\s*#.*$/gm, blank).replace(/^(\s*-?\s*)[A-Za-z_]+:/gm, (m) => blank(m));
	else prose = prose.replace(/^---\n[\s\S]*?\n(---|\.\.\.)\n/, (m) => blank(m));
	prose = prose
		.replace(/<!--[\s\S]*?-->/g, blank)
		.replace(/```[\s\S]*?```/g, blank)
		.replace(/`[^`\n]*`/g, blank)
		.replace(/\]\([^)\s]*\)/g, (m) => ']' + blank(m.slice(1)))
		.replace(/https?:\/\/\S+/g, blank);
	const maths = [];
	prose = prose.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, (m, offset) => {
		maths.push({ tex: m, offset });
		return blank(m);
	});
	return { prose, maths };
}

const lineOf = (text, offset) => text.slice(0, offset).split('\n').length;

export function lintText(text, file, macros = macroNames()) {
	const yaml = file.endsWith('.yaml');
	const { prose, maths } = split(text, yaml);
	const problems = [];
	const flag = (offset, message) => {
		const line = lineOf(text, offset);
		const source = text.split('\n')[line - 1] ?? '';
		const allowed = source.match(/<!--\s*lint-allow:\s*([^>]*?)\s*-->/)?.[1];
		if (allowed && message.toLowerCase().includes(allowed.toLowerCase())) return;
		problems.push({ file, line, message });
	};

	for (const m of prose.matchAll(/—/g)) flag(m.index, 'em dash: use a colon, a full stop or parentheses');
	for (const m of prose.matchAll(/!/g)) flag(m.index, 'exclamation mark');
	for (const m of prose.matchAll(/\b([A-Za-z]+?)is(e|es|ed|ing|ation|ations|er|ers)\b/g)) {
		const word = m[0].toLowerCase();
		const stem = `${m[1].toLowerCase()}ise`;
		if (ISE_OK.includes(stem)) continue;
		flag(m.index, `"${m[0]}": British spelling with -ize`);
	}
	for (const [re, message, allowed] of BANNED) {
		const hits = [...prose.matchAll(re)];
		hits.slice(allowed).forEach((h) => flag(h.index, `banned: ${message}`));
	}
	for (const m of prose.matchAll(/\bwe will see later\b/gi)) {
		const sentence = prose.slice(m.index, prose.indexOf('.', m.index) + 1 || undefined);
		if (!/\]/.test(sentence)) flag(m.index, 'banned: "we will see later" without a link');
	}

	const enotation = /\b\d+(\.\d+)?[eE][+-]?\d+\b/g;
	for (const m of prose.matchAll(enotation)) flag(m.index, `e-notation "${m[0]}": write it as a × 10ⁿ`);
	for (const { tex, offset } of maths) {
		for (const m of tex.matchAll(enotation))
			flag(offset + m.index, `e-notation "${m[0]}": write it as a × 10ⁿ`);
		for (const m of tex.matchAll(/\\htmlClass\{([^}]*)\}/g))
			for (const cls of m[1].split(/\s+/))
				if (cls.startsWith('q-') && !ROLES.includes(cls.slice(2)))
					flag(offset + m.index, `unknown colour role "${cls}"`);
		for (const m of tex.matchAll(/\\([A-Za-z]+)/g)) {
			const name = m[1];
			if (macros.has(name) || TEX_COMMANDS.has(name)) continue;
			const near = [...ROLES, 'sym'].find((r) => name !== r && (distance(name, r) <= (r.length > 3 ? 2 : 1) || (name.startsWith(r) && name.length <= r.length + 3)));
			if (near) flag(offset + m.index, `undefined colour macro "\\${name}" (did you mean \\${near}?)`);
		}
	}
	return problems;
}

function files(dir) {
	return readdirSync(dir).flatMap((name) => {
		const full = path.join(dir, name);
		if (statSync(full).isDirectory()) return files(full);
		if (name === 'README.md') return [];
		return /\.(md|yaml)$/.test(name) ? [full] : [];
	});
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
	const targets = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.resolve(f)) : files(HERE);
	const macros = macroNames();
	const problems = targets.flatMap((f) => lintText(readFileSync(f, 'utf8'), path.relative(process.cwd(), f), macros));
	for (const p of problems) console.log(`${p.file}:${p.line}: ${p.message}`);
	if (problems.length) {
		console.log(`\ntutorial lint: ${problems.length} problem${problems.length === 1 ? '' : 's'} (STYLE.md)`);
		process.exit(1);
	}
	console.log(`tutorial lint: ${targets.length} files, no problems`);
}
