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
			'<details class="plain"><summary>In plain words</summary><p><a href="https://en.wikipedia.org/wiki/Tidal_tensor" target="_blank" rel="noopener noreferrer">tidal tensor</a></p></details>'
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

/** A summary box as pandoc writes `\begin{quote} \textbf{In plain words.} ... \end{quote}`. */
const boxDoc = (blocks: unknown[]) => ({ meta: {}, blocks: [{ t: 'BlockQuote', c: blocks }] });
const boxHtml = (blocks: unknown[]) =>
	renderPaper(boxDoc(blocks))
		.blocks.map((b) => (b.kind === 'html' ? b.html : ''))
		.join('');
const label = {
	t: 'Strong',
	c: [
		{ t: 'Str', c: 'In' },
		{ t: 'Space' },
		{ t: 'Str', c: 'plain' },
		{ t: 'Space' },
		{ t: 'Str', c: 'words.' }
	]
};

describe('a plain-language box', () => {
	it('is closed, with its label as the line that opens it', () => {
		const out = boxHtml([
			{ t: 'Para', c: [label, { t: 'Space' }, { t: 'Str', c: 'Gravity.' }] },
			{ t: 'BulletList', c: [[{ t: 'Plain', c: [{ t: 'Str', c: 'one' }] }]] }
		]);
		expect(out).toBe(
			'<details class="plain"><summary>In plain words</summary><p>Gravity.</p>\n<ul><li>one</li></ul></details>'
		);
	});

	it('keeps bold terms inside its text', () => {
		const out = boxHtml([
			{
				t: 'Para',
				c: [label, { t: 'Space' }, { t: 'Strong', c: [{ t: 'Str', c: 'tide' }] }]
			}
		]);
		expect(out).toContain('<p><strong>tide</strong></p>');
		expect(out).not.toContain('In plain words.');
	});
});
