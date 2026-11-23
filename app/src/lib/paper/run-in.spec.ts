/** The paper's run-in paragraph headings get stable ids from their words, for links into the paper. */
import { describe, expect, it } from 'vitest';
import { renderPaper } from './render';

const heading = (words: string[]) => ({
	t: 'Header',
	c: [
		4,
		['', [], []],
		words.flatMap((w, i) => (i ? [{ t: 'Space' }, { t: 'Str', c: w }] : [{ t: 'Str', c: w }]))
	]
});

describe('a run-in heading', () => {
	it('has an id made from its words, unique in the paper', () => {
		const out = renderPaper({
			meta: {},
			blocks: [
				heading(['The', 'Earth’s', 'own', 'tide.']),
				heading(['How', 'bright.']),
				heading(['How', 'bright.'])
			]
		})
			.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
			.join('');
		expect(out).toContain('<h4 class="run-in" id="par:the-earths-own-tide">');
		expect(out).toContain('id="par:how-bright"');
		expect(out).toContain('id="par:how-bright-2"');
	});
});
