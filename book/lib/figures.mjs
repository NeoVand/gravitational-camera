// The tutorial's drawings (tutorial/figures/*.svg) as PDFs for the book, cached under book/build/figures/.
//
// The drawings keep to the paper's palette, but some fills are written for the site's two themes, as CSS
// light-dark() and color-mix() (figures3d/ writes them so). librsvg reads neither, so the day colours are worked out
// here first: light-dark(a, b) is a, and color-mix(in srgb, a p%, b) is the mixture. Embedded pictures declared as
// application/octet-stream get their real type. Nothing is ever written into tutorial/figures/.
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { BUILD, TUTORIAL, ensureDir, hash, pool, run } from './util.mjs';

/** The argument list of the call to fn( at `at`, split at top-level commas, and where it ends. */
function callArgs(s, at, fn) {
	let i = at + fn.length + 1;
	let depth = 1;
	let start = i;
	const args = [];
	for (; i < s.length; i++) {
		const c = s[i];
		if (c === '(') depth++;
		else if (c === ')') {
			depth--;
			if (depth === 0) {
				args.push(s.slice(start, i).trim());
				return { args, end: i + 1 };
			}
		} else if (c === ',' && depth === 1) {
			args.push(s.slice(start, i).trim());
			start = i + 1;
		}
	}
	throw new Error(`unbalanced ${fn}(`);
}

const hexRgb = (h) => {
	let x = h.replace('#', '');
	if (x.length === 3) x = [...x].map((c) => c + c).join('');
	return [0, 2, 4].map((k) => parseInt(x.slice(k, k + 2), 16));
};
const rgbHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

function parseColour(s) {
	s = s.trim();
	const named = { white: '#ffffff', black: '#000000', transparent: '#ffffff' };
	if (named[s]) return hexRgb(named[s]);
	if (s.startsWith('#')) return hexRgb(s);
	const m = s.match(/^rgba?\(([^)]*)\)$/);
	if (m) return m[1].split(/[ ,]+/).slice(0, 3).map(Number);
	throw new Error(`unknown colour "${s}"`);
}

/** color-mix(in srgb, A p%, B q%) as a hex colour. */
function mix(args) {
	if (!/^in srgb$/.test(args[0])) throw new Error(`color-mix in ${args[0]}`);
	const part = (a) => {
		const m = a.match(/^(.*?)(?:\s+([\d.]+)%)?$/);
		return { c: parseColour(m[1]), p: m[2] === undefined ? undefined : Number(m[2]) / 100 };
	};
	const a = part(args[1]);
	const b = part(args[2]);
	let pa = a.p;
	let pb = b.p;
	if (pa === undefined && pb === undefined) pa = pb = 0.5;
	else if (pa === undefined) pa = 1 - pb;
	else if (pb === undefined) pb = 1 - pa;
	const sum = pa + pb;
	return rgbHex(a.c.map((v, k) => (v * pa + b.c[k] * pb) / sum));
}

/** Resolves the innermost CSS colour functions first, until none is left. */
export function dayColours(svg) {
	// innermost calls (no parenthesis inside their arguments but rgb()) first, until none is left
	const inner = /(light-dark|color-mix)\(((?:[^()]|rgba?\([^()]*\))*)\)/g;
	for (let round = 0; round < 8 && /light-dark\(|color-mix\(/.test(svg); round++)
		svg = svg.replace(inner, (all, fn, body) => {
			const { args } = callArgs(`${fn}(${body})`, 0, fn);
			return fn === 'light-dark' ? args[0] : mix(args);
		});
	if (/light-dark\(|color-mix\(/.test(svg)) throw new Error('a CSS colour function the book cannot resolve');
	return svg;
}

const MAGIC = [
	['/9j/', 'image/jpeg'],
	['iVBOR', 'image/png'],
	['UklGR', 'image/webp'],
	['R0lGOD', 'image/gif']
];
const imageTypes = (svg) =>
	svg.replace(/data:application\/octet-stream;base64,([A-Za-z0-9+/]{8})/g, (all, head) => {
		const type = MAGIC.find(([m]) => head.startsWith(m))?.[1];
		return type ? `data:${type};base64,${head}` : all;
	});

export const printable = (svg) => imageTypes(dayColours(svg));

/** The PDF of each named drawing, converted when the SVG (or this converter) changed since the last build. */
export async function convertFigures(names, { jobs = 4, log }) {
	const dir = ensureDir(path.join(BUILD, 'figures'));
	const self = readFileSync(new URL(import.meta.url), 'utf8');
	const out = new Map();
	let converted = 0;
	await pool([...new Set(names)], jobs, async (name) => {
		const svgFile = path.join(TUTORIAL, 'figures', `${name}.svg`);
		const pdf = path.join(dir, `${name}.pdf`);
		const stamp = path.join(dir, `${name}.stamp`);
		const svg = readFileSync(svgFile, 'utf8');
		const key = hash(svg, self);
		if (existsSync(pdf) && existsSync(stamp) && readFileSync(stamp, 'utf8') === key) {
			out.set(name, pdf);
			return;
		}
		await run('rsvg-convert', ['--format', 'pdf', '--output', pdf], { input: printable(svg) });
		writeFileSync(stamp, key);
		converted++;
		out.set(name, pdf);
	});
	log?.(`figures: ${out.size} drawings, ${converted} converted`);
	return out;
}

export const figureSize = (file) => statSync(file).size;
