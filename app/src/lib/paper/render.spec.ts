/** How the paper's links are written into the page. */
import { describe, expect, it } from 'vitest';
import { renderPaper } from './render';

/** A pandoc paragraph holding one link, as pandoc writes \href and an in-page link. */
const linkDoc = (url: string, text: string) => ({
	meta: {},
	blocks: [
		{
			t: 'BlockQuote',
			c: [
				{
					t: 'Para',
					c: [{ t: 'Link', c: [['', [], []], [{ t: 'Str', c: text }], [url, '']] }]
				}
			]
		}
	]
});

const html = (url: string, text: string) =>
	renderPaper(linkDoc(url, text))
		.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
		.join('');

describe('a link', () => {
	it('to another site opens in a new tab', () => {
		expect(html('https://en.wikipedia.org/wiki/Tidal_tensor', 'tidal tensor')).toBe(
			'<aside class="plain"><p><a href="https://en.wikipedia.org/wiki/Tidal_tensor" target="_blank" rel="noopener noreferrer">tidal tensor</a></p></aside>'
		);
		expect(html('http://example.org/a?b=1&c=2', 'x')).toContain(
			'href="http://example.org/a?b=1&amp;c=2" target="_blank" rel="noopener noreferrer"'
		);
	});

	it('within the page stays in it', () => {
		const out = html('#sec:pixel', 'the pixel');
		expect(out).toContain('<a href="#sec:pixel">the pixel</a>');
		expect(out).not.toContain('target=');
	});
});
