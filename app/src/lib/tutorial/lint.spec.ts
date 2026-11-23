/** The style lint of STYLE.md (tutorial/lint.mjs). */
import { describe, expect, it } from 'vitest';

/** tutorial/lint.mjs is plain JavaScript run by node; it is loaded by its address, outside the type check. */
const { lintText } = (await import(
	/* @vite-ignore */ new URL('../../../../tutorial/lint.mjs', import.meta.url).href
)) as { lintText: (text: string, file: string) => { message: string }[] };

const flags = (text: string): string[] =>
	(lintText(`---\ntitle: x\n---\n\n${text}\n`, 'test.md') as { message: string }[]).map(
		(p) => p.message
	);

describe('the tutorial lint', () => {
	it('passes plain prose, -ize spellings, analyse and words that are only ever -ise', () => {
		expect(
			flags('We analyse the polarization. Otherwise the noise would rise; a precise exercise.')
		).toEqual([]);
	});

	it('flags em dashes, exclamation marks, -ise spellings and banned words', () => {
		const out = flags('We simply organise it — clearly! Let’s go.');
		expect(out).toEqual(
			expect.arrayContaining([
				expect.stringMatching(/em dash/),
				expect.stringMatching(/exclamation/),
				expect.stringMatching(/organise/),
				expect.stringMatching(/"simply"/),
				expect.stringMatching(/"clearly"/),
				expect.stringMatching(/let's/)
			])
		);
	});

	it('allows "note that" once, and a factorial in mathematics', () => {
		expect(flags('Note that a. Then $n!$ ways.')).toEqual([]);
		expect(flags('Note that a. Note that b.')).toHaveLength(1);
	});

	it('flags e-notation in text and in mathematics, and undefined colour macros', () => {
		expect(flags('A tide of 9e-9 per second.')).toHaveLength(1);
		expect(flags('$c = 3e8$')).toHaveLength(1);
		expect(flags('$\\curvv{x} + \\htmlClass{q-paint}{y}$')).toEqual([
			expect.stringMatching(/unknown colour role "q-paint"/),
			expect.stringMatching(/undefined colour macro "\\curvv"/)
		]);
		expect(flags('$\\curv{\\tE} + \\matter{\\rho}$')).toEqual([]);
	});

	it('lets a line allow a word', () => {
		expect(flags('It is just below the line. <!-- lint-allow: just -->')).toEqual([]);
	});
});
