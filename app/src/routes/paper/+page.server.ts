import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderPaper } from '#lib/paper/render.js';
import type { PageServerLoad } from './$types';

const PAPER_DIR = path.resolve('..', 'paper');

/**
 * Read a LaTeX file with its \input files spliced in and comment lines removed.
 * Figures and tables that span both columns of the PDF (figure*, table*)
 * become ordinary ones: pandoc keeps the caption and label of `figure` and
 * `table` only, and on the web every figure and table spans the text anyway.
 */
function readTex(file: string): string {
	const text = readFileSync(path.join(PAPER_DIR, file), 'utf8')
		.replace(/^%.*\n/gm, '')
		.replace(/\\(begin|end)\{(figure|table)\*\}/g, '\\$1{$2}');
	return text.replace(/\\input\{([^}]+)\}/g, (_, name: string) =>
		readTex(name.endsWith('.tex') ? name : `${name}.tex`)
	);
}

/**
 * The paper lives in /paper as LaTeX. pandoc parses it; the site renders the
 * parse tree. This runs when the page is prerendered, and on every request in
 * development, so edits to the .tex files show up on reload.
 */
export const load: PageServerLoad = () => {
	let json: string;
	try {
		json = execFileSync(
			'pandoc',
			['-f', 'latex+raw_tex', '-t', 'json', '--citeproc', '--bibliography', 'refs.bib'],
			{ cwd: PAPER_DIR, input: readTex('main.tex'), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
		);
	} catch (cause) {
		throw new Error('Could not convert the paper: is pandoc installed?', { cause });
	}
	return { paper: renderPaper(JSON.parse(json)) };
};
