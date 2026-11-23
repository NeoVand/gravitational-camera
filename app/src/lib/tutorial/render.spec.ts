/**
 * The tutorial's renderer, on Markdown run through pandoc as the site runs it (with the paper's and the
 * tutorial's macros), against the real paper for its labels, equations and figures.
 */
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
	MARKDOWN,
	SAMPLE_FILE,
	TUTORIAL_DIR,
	paperContext,
	renderChapterFile,
	symbolKeys
} from '#lib/server/sources.js';
import { normalizeFences, renderChapter } from './render';
import type { ChapterContext } from './render';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const macros = ['../paper/macros.tex', '../tutorial/macros.tex']
	.map((f) =>
		readFileSync(path.resolve(f), 'utf8')
			.split('\n')
			.filter((l) => !/^\s*%/.test(l))
			.join('\n')
	)
	.join('\n');

const FRONT = `---
id: X.9
title: A test
question: 'Does it work?'
part: X
---

`;

const context = (): ChapterContext => ({
	live: new Set(['tidal-rings']),
	symbols: symbolKeys(),
	paper: paperContext(),
	figures: new Map([['ring', '<svg class="drawing" role="img"></svg>']])
});

/** Markdown (front matter added) → the rendered chapter. */
function chapter(body: string, ctx = context()) {
	const json = execFileSync('pandoc', ['-f', MARKDOWN, '-t', 'json'], {
		input: `${macros}\n\n${normalizeFences(FRONT + body)}`,
		encoding: 'utf8',
		cwd: TUTORIAL_DIR
	});
	return renderChapter(JSON.parse(json), ctx, 'test');
}

const html = (body: string) =>
	chapter(body)
		.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
		.join('\n');

describe('front matter', () => {
	it('gives the id, title, question and part, with mathematics in the title', () => {
		const c = chapter('Text.').meta;
		expect(c).toMatchObject({
			id: 'X.9',
			titleText: 'A test',
			part: 'X',
			question: 'Does it work?'
		});
	});

	it('is required', () => {
		const json = execFileSync('pandoc', ['-f', MARKDOWN, '-t', 'json'], {
			input: '---\nid: X.1\n---\n\nText.',
			encoding: 'utf8'
		});
		expect(() => renderChapter(JSON.parse(json), context())).toThrow(/lacks "title"/);
	});
});

describe('equations', () => {
	it('are numbered per chapter and referred to by \\eqref and by an empty link', () => {
		const out = html(
			'$$a \\label{eq:one}$$\n\n$$b$$\n\n$$c \\label{eq:two}$$\n\nSee \\eqref{eq:two} and [](#eq:one).'
		);
		expect(out).toContain('<div class="equation" id="eq:one">');
		expect(out).toContain('<div class="equation" id="eq:two">');
		expect(out).toMatch(/id="eq:two">[\s\S]*?\(2\)/);
		expect(out).toContain('<a class="xref" href="#eq:two">(2)</a>');
		expect(out).toContain('<a class="xref" href="#eq:one">(1)</a>');
	});

	it('fail on an unknown label', () => {
		expect(() => html('See [](#eq:none).')).toThrow(/unknown label "eq:none"/);
		expect(() => html('See \\eqref{eq:none}.')).toThrow(/unknown label/);
	});

	it('keep the paper’s numbers for links into the paper', () => {
		const n = paperContext().index.labels.get('eq:tidal');
		expect(html('The paper’s [](/paper/#eq:tidal).')).toContain(
			`<a class="xref paper-ref" href="/paper/#eq:tidal">(${n})</a>`
		);
		expect(() => html('[](/paper/#eq:nothing-here)')).toThrow(/unknown paper label/);
	});
});

describe('the colour macros', () => {
	it('become KaTeX classes, and the chapter records its roles and symbols', () => {
		const c = chapter(
			'$\\sym{tidal-tensor}{\\curv{\\tE}}_{ij} = \\partial_i\\partial_j\\field{\\Phi}$'
		);
		const out = c.blocks.map((b) => (b.kind === 'html' ? b.html : '')).join('');
		expect(out).toContain('q-curv');
		expect(out).toContain('symbol-tidal-tensor');
		expect(out).toContain('<math');
		expect(c.roles).toEqual(['field', 'curv']);
		expect(c.symbols).toEqual(['tidal-tensor']);
	});

	it('fail for a symbol not in symbols.yaml, and for an undefined macro', () => {
		expect(() => html('$\\sym{no-such-symbol}{x}$')).toThrow(/not in tutorial\/symbols.yaml/);
		expect(() => html('$\\curvv{x}$')).toThrow();
	});
});

describe('margin notes', () => {
	it('are numbered, with a toggle and a body that sits inside the paragraph', () => {
		const out = html(
			'One.[^a] Two.[^b]\n\n[^a]: First, with $x$.\n\n[^b]: Second.\n\n    Its second paragraph.'
		);
		expect(out).toContain('aria-controls="mn-1"');
		expect(out).toContain('<span class="mn-body" id="mn-2" role="note">');
		expect(out).not.toMatch(/<span class="mn-body"[^]*?<p>/);
		expect(out).toMatch(/^<p>One\./);
	});
});

describe('boxes', () => {
	it('plain words are closed, as in the paper', () => {
		expect(html('::: plain\nA **tide**.\n:::')).toBe(
			'<details class="plain"><summary>In plain words</summary><p>A <strong>tide</strong>.</p></details>'
		);
	});

	it('a derivation is closed, with its title', () => {
		const out = html('::: derivation\n### The Hessian of $1/r$\nWe differentiate.\n:::');
		expect(out).toMatch(
			/^<details class="box derivation"><summary>Derivation in full: The Hessian of <span class="katex">/
		);
		expect(() => html('::: derivation\nNo title.\n:::')).toThrow(/give it a title/);
	});

	it('gap, example, deeper, paper and history have their titles', () => {
		expect(html('::: gap\nSkipped.\n:::')).toContain('What this sketch skips');
		expect(html('::: {.example title="A person"}\nNumbers.\n:::')).toContain(
			'Worked example: A person'
		);
		expect(html('::: deeper\nMore.\n:::')).toContain('Go deeper');
		expect(html('::: paper\nUsed.\n:::')).toContain('Where the paper uses this');
		const history = html('::: history\nOnce.\n:::');
		expect(history).toMatch(/^<details class="box history"><summary>A little history<\/summary>/);
	});

	it('check yourself: questions with hidden answers, from headings or a definition list', () => {
		const a = html(
			'::: check\n### Q\nWhy?\n\n### A\nBecause.\n\n### Q\nHow much?\n\n### A\nTwo.\n:::'
		);
		expect(a.match(/<details class="answer">/g)).toHaveLength(2);
		expect(a).not.toMatch(/<details class="answer" open/);
		const b = html('::: check\nWhy?\n:   Because.\n:::');
		expect(b.match(/<details class="answer">/g)).toHaveLength(1);
		expect(() => html('::: check\n### Q\nWhy?\n:::')).toThrow(/followed by "### A"/);
	});

	it('problems: three tiers, each problem with a hidden solution', () => {
		const tier = (name: string) => `### ${name}\nDo it.\n\n::: solution\nDone.\n:::\n`;
		const out = html(`::: problems\n${tier('Practice')}${tier('Stretch')}${tier('The paper')}:::`);
		expect(out.match(/<details class="solution">/g)).toHaveLength(3);
		expect(out).toContain('<h4 class="tier-title">The paper</h4>');
		expect(() => html(`::: problems\n${tier('Practice')}${tier('The paper')}:::`)).toThrow(
			/expected the tier "### Stretch"/
		);
		expect(() => html('::: problems\n### Practice\nDo it.\n:::')).toThrow(
			/without a "::: solution"/
		);
	});

	it('an unknown box fails', () => {
		expect(() => html('::: sidebar\nNo.\n:::')).toThrow(/unknown box ::: sidebar/);
	});
});

describe('interactive figures', () => {
	it('mount by id, written as STYLE.md writes them', () => {
		const c = chapter('::: try {#tidal-rings}\nPredict first.\n:::');
		expect(c.blocks).toEqual([
			{ kind: 'try', id: 'tidal-rings', introHtml: '<p>Predict first.</p>' }
		]);
	});

	it('fail for an id not registered', () => {
		expect(() => html('::: try {#no-such-figure}\nPredict.\n:::')).toThrow(/no interactive figure/);
	});
});

describe('the paper’s equations and figures by label', () => {
	it('show the paper’s equation with its number, linked to it', () => {
		const { number } = paperContext().index.equations.get('eq:tidal')!;
		const out = html('{{paper eq:tidal}}');
		expect(out).toMatch(/^<div class="equation from-paper" id="paper-eq:tidal">/);
		expect(out).toContain('href="/paper/#eq:tidal"');
		expect(out).toContain(`paper (${number})`);
	});

	it('show the paper’s figure, its links pointing into the paper', () => {
		const c = chapter('{{paper fig:tidal}}');
		const fig = c.blocks[0];
		expect(fig.kind).toBe('paper-figure');
		if (fig.kind !== 'paper-figure') return;
		expect(fig.number).toBe(paperContext().figures.get('fig:tidal')!.number);
		expect(fig.captionHtml).not.toMatch(/href="#/);
		expect(fig.captionHtml).not.toMatch(/ id="/);
	});

	it('fail for a label the paper lacks', () => {
		expect(() => html('{{paper eq:not-in-the-paper}}')).toThrow(/no equation with that label/);
		expect(() => html('{{paper fig:not-in-the-paper}}')).toThrow(/no figure with that label/);
	});
});

describe('the tutorial’s own figures', () => {
	it('show the drawing by name, numbered in the chapter, and an empty link gives the number', () => {
		const c = chapter(
			'See Figure [](#fig:ring-one).\n\n![A ring of beads, $r = 1$.](ring){#fig:ring-one}\n'
		);
		const fig = c.blocks.find((b) => b.kind === 'figure');
		expect(fig).toMatchObject({ kind: 'figure', id: 'fig:ring-one', number: 1 });
		expect(fig!.kind === 'figure' && fig!.html).toContain('<svg');
		expect(fig!.kind === 'figure' && fig!.captionHtml).toContain('katex');
		expect(c.blocks[0].kind === 'html' && c.blocks[0].html).toContain('href="#fig:ring-one">1</a>');
	});

	it('fail for a drawing not in tutorial/figures, a missing id or a caption', () => {
		expect(() => chapter('![A caption.](nothing){#fig:x}\n')).toThrow(/no drawing "nothing"/);
		expect(() => chapter('![A caption.](ring)\n')).toThrow(/needs an id/);
		expect(() => chapter('![](ring){#fig:x}\n')).toThrow(/with a caption/);
	});
});

describe('sections', () => {
	it('make the contents, and an empty link to one gives its title', () => {
		const c = chapter(
			'## A tide is a difference\n\nText.\n\n## Then more\n\nSee [](#a-tide-is-a-difference).'
		);
		expect(c.contents.map((s) => s.id)).toEqual(['a-tide-is-a-difference', 'then-more']);
		const out = c.blocks.map((b) => (b.kind === 'html' ? b.html : '')).join('');
		expect(out).toContain(
			'<a class="xref" href="#a-tide-is-a-difference">A tide is a difference</a>'
		);
		expect(() => html('See [](#nowhere).')).toThrow(/unknown section/);
	});
});

describe('the sample chapter', () => {
	it('renders every block, with no TeX left in the text', () => {
		const c = renderChapterFile(SAMPLE_FILE);
		const out = c.blocks
			.map((b) => (b.kind === 'html' ? b.html : b.kind === 'try' ? b.introHtml : ''))
			.join('\n');
		for (const cls of [
			'details class="plain"',
			'box derivation',
			'box gap',
			'box example',
			'box check',
			'box problems',
			'box paper-uses',
			'box deeper',
			'box history',
			'equation from-paper',
			'margin-note',
			'class="cite"'
		])
			expect(out, cls).toContain(cls);
		expect(c.blocks.map((b) => b.kind)).toEqual(expect.arrayContaining(['try', 'paper-figure']));
		expect(c.referencesHtml).toContain('ref-ThorneWinstein1999');
		expect(c.firstEquationHtml).toContain('katex-display');
		// TeX outside KaTeX's annotations would show as text
		const text = out.replace(/<annotation[^]*?<\/annotation>/g, '').replace(/<[^>]+>/g, '');
		expect(text).not.toMatch(/\\[a-zA-Z]+|\{\{paper|\$/);
	});
});
