/** The rich page's glosses and paragraph anchors (glosses.ts), on small pieces of HTML. */
import { describe, expect, it } from 'vitest';
import { uniqueIds } from '../render/pandoc';
import { glossSection, sectionSpans } from './glosses';

const terms = [
	{ term: 'tide', href: '/tutorial/newton/tides/' },
	{ term: 'tidal tensor', href: '/tutorial/newton/tides/#t' },
	{ term: 'pixel', href: '/tutorial/evening/a-camera-for-gravity/' },
	{ term: 'Hessian', href: '/tutorial/newton/tides/#h' }
];
const filler = ' and so on'.repeat(30);

describe('glossing a section', () => {
	it('anchors each paragraph by its first words, or by its run-in heading', () => {
		const { pieces, paragraphs } = glossSection(
			[
				'<h2 id="sec:x">X</h2><p>A freely falling observer feels.</p><div class="equation" id="eq:a">$</div>' +
					'<p class="continued">More.</p><h4 class="run-in" id="par:the-run">The run.</h4><p>Words here.</p>'
			],
			[]
		);
		expect(paragraphs.map((p) => p.anchor)).toEqual(['p:a-freely-falling-observer', 'par:the-run']);
		expect(pieces[0]).toContain('<p id="p:a-freely-falling-observer">A freely');
		expect(pieces[0]).toContain('<p>Words here.</p>');
		// a list is a paragraph too
		const list = glossSection(['<ul><li><p>One thing and another.</p></li></ul>'], []);
		expect(list.pieces[0]).toMatch(/^<ul id="p:one-thing-and-another"><li>/);
	});

	it('glosses the first use only, the longer term first, in the text’s own words', () => {
		const { pieces, used } = glossSection(
			[`<p>The tidal tensor is a table. The tide of a pixel${filler}. A tide again.</p>`],
			terms,
			{ density: { charsPerGloss: 10, minGap: 5 } }
		);
		expect(pieces[0]).toContain(
			'The <a class="gloss" href="/tutorial/newton/tides/#t" data-gloss="tidal-tensor">tidal tensor</a>'
		);
		expect(pieces[0].match(/class="gloss"/g)).toHaveLength(3);
		expect(pieces[0]).toContain('data-gloss="tide">tide</a> of a');
		expect(pieces[0]).toContain('A tide again');
		expect(used.map((u) => u.term).sort()).toEqual(['pixel', 'tidal tensor', 'tide']);
	});

	it('takes a capital at the start of a sentence and a plural, but not part of a word', () => {
		const { pieces } = glossSection(
			[`<p>Tides are many${filler}. Pixels too, and a pixel-wide.</p>`],
			terms
		);
		expect(pieces[0]).toContain('data-gloss="tide">Tides</a>');
		expect(pieces[0]).toContain('data-gloss="pixel">Pixels</a>');
	});

	it('leaves out mathematics, links, headings, figures, citations and the plain-words box', () => {
		const html =
			'<h2 id="s">The tide</h2><details class="plain"><p>The tide.</p></details>' +
			'<p><span class="katex">tide</span> <a href="#x">tide</a> <span class="cite">[tide]</span>' +
			' <sup>tide</sup></p><figure><figcaption>tide</figcaption></figure>';
		expect(glossSection([html], terms).pieces[0]).not.toContain('gloss');
	});

	it('keeps to the density: one gloss per so many characters, so far apart, one more chance', () => {
		const text = `<p>The tide, the pixel and the Hessian.</p><p>A Hessian${filler}.</p><p>A pixel.</p>`;
		const { paragraphs } = glossSection([text], terms, {
			density: { charsPerGloss: 170, minGap: 60 }
		});
		// the first paragraph is short: one gloss, the longest term; the others wait
		expect(paragraphs[0]).toMatchObject({
			budget: 1,
			terms: ['Hessian'],
			deferred: ['pixel', 'tide']
		});
		expect(paragraphs[1].terms).toEqual([]);
		expect(paragraphs[2].terms).toEqual(['pixel']);
		// with a looser rule, all three fit in the first
		const loose = glossSection([text], terms, { density: { charsPerGloss: 10, minGap: 5 } });
		expect(loose.paragraphs[0].terms).toEqual(['tide', 'pixel', 'Hessian']);
	});

	it('glosses the core terms at their first use, before the others and past the budget', () => {
		const text = `<p>The tide, the pixel and the Hessian${filler}.</p>`;
		const plain = glossSection([text], terms, { density: { charsPerGloss: 10_000, minGap: 5 } });
		expect(plain.paragraphs[0].terms).toEqual(['Hessian']);
		const core = glossSection([text], terms, {
			density: { charsPerGloss: 10_000, minGap: 5 },
			core: ['tide', 'pixel']
		});
		// the core terms take the paragraph's one gloss and more; the Hessian waits for its next use
		expect(core.paragraphs[0]).toMatchObject({ terms: ['tide', 'pixel'], deferred: ['Hessian'] });
	});

	it('shares the paragraphs’ anchors across sections, so that no two are the same', () => {
		const ids = uniqueIds();
		const a = glossSection(['<p>The two parts are here.</p>'], [], { ids });
		const b = glossSection(['<p>The two parts are there.</p>'], [], { ids });
		expect([a.paragraphs[0].anchor, b.paragraphs[0].anchor]).toEqual([
			'p:the-two-parts-are',
			'p:the-two-parts-are-2'
		]);
	});

	it('finds a section across the blocks between its figures', () => {
		const first = '<p>a</p><h2 id="sec:b">B</h2><p>b</p>';
		const third = '<p>c</p><h2 id="sec:c">C</h2>';
		const blocks = [
			{ kind: 'html' as const, html: first },
			{ kind: 'figure' as const },
			{ kind: 'html' as const, html: third },
			{ kind: 'figure' as const },
			{ kind: 'html' as const, html: '<h2 id="sec:d">D</h2><p>d</p>' }
		];
		expect(sectionSpans(blocks, 'sec:b')).toEqual([
			{ index: 0, start: 8, end: first.length },
			{ index: 2, start: 0, end: 8 }
		]);
		// a section whose next heading opens a block ends at that block
		expect(sectionSpans(blocks, 'sec:c')).toEqual([
			{ index: 2, start: 8, end: third.length },
			{ index: 4, start: 0, end: 0 }
		]);
	});
});
