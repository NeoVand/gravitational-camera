/** The generator of the margin map, on small chapters written for the test. */
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { normalizeFences } from './render';
import { LABELS, linksModule, mapPaper } from './paper-map';
import type { MapAnchor, MapChapter } from './paper-map';

const chapter = (id: string, markdown: string, reads: string[] = []): MapChapter => ({
	id,
	reads,
	tree: JSON.parse(
		execFileSync('pandoc', ['-f', 'markdown+fenced_divs', '-t', 'json'], {
			input: normalizeFences(markdown),
			encoding: 'utf8'
		})
	)
});

/** A paper of two sections, an appendix of proofs, and one checks appendix that gets no note. */
const anchors: MapAnchor[] = [
	{ id: 'sec:pixel', section: 'sec:pixel' },
	{ id: 'eq:tidal', section: 'sec:pixel' },
	{ id: 'par:the-earths-own-tide', section: 'sec:pixel' },
	{ id: 'fig:tidal', section: 'sec:pixel' },
	{ id: 'eq:wave', section: 'sec:pixel' },
	{ id: 'eq:stated', section: 'sec:pixel' },
	{ id: 'eq:lonely', section: 'sec:pixel' },
	{ id: 'tab:regimes', section: 'sec:pixel' },
	{ id: 'sec:vistas', section: 'sec:vistas' },
	{ id: 'par:memory', section: 'sec:vistas' },
	{ id: 'par:memory-2', section: 'sec:vistas' },
	{ id: 'par:unread', section: 'sec:vistas' },
	{ id: 'fig:sky', section: 'sec:vistas' },
	{ id: 'fig:ladder', section: 'sec:vistas' },
	{ id: 'app:checks', section: 'app:checks' },
	{ id: 'tab:checks', section: 'app:checks' }
];

const tides = chapter(
	'1.4',
	`---
paper: [eq:tidal, eq:lonely]
---

## The tide is a table

The tide is [](/paper/#eq:tidal), shown here:

{{paper eq:tidal}}

## The figure

{{paper fig:tidal}}

::: try {#tidal-ring}
Move the mass.
:::

## The lonely equation

{{paper eq:lonely}}

::: paper
- [](/paper/#eq:wave) and [*The Earth's own tide*](/paper/#par:the-earths-own-tide) come later.
:::
`
);

const waves = chapter(
	'7.6',
	`Intro, which names [](/paper/#eq:tidal).

## The tide of a wave

The paper's [](/paper/#eq:wave) is the tide of a wave.
`
);

const reading = chapter(
	'R1',
	`[Section II](/paper/#sec:pixel) is read here.

## A map

| Stretch | Taught in |
|---|---|
| [*The Earth's own tide*](/paper/#par:the-earths-own-tide) | 1.4 |

## The Earth's own tide is subtracted

The paragraph [*The Earth's own tide*](/paper/#par:the-earths-own-tide) starts with Table [](/paper/#tab:regimes).

## The ledger: two are derived

| Equation | What it says | Where it is derived |
|---|---|---|
| [](/paper/#eq:tidal) | the tide, $c^2 R_{0i0j}$, see 9.9 | [1.4](/tutorial/newton/tides/#the-tide-is-a-table); 7.6 in relativity |
| [](/paper/#eq:wave) | the wave | 7.6 |
| [](/paper/#eq:stated) | the record | *stated in the paper* |
`,
	['sec:pixel']
);

/** Reads five sections, so it comes after the narrow reader of each. */
const broad = chapter(
	'R8',
	`## Quantum statements

[*Memory*](/paper/#par:memory) and [*The Earth's own tide*](/paper/#par:the-earths-own-tide), quantum.
`,
	['sec:pixel', 'sec:near-field', 'sec:no-lens', 'sec:first-image', 'sec:vistas']
);

const sky = chapter(
	'R12',
	`## Waves leave a memory

[*Memory*](/paper/#par:memory) says a burst leaves a memory.
`,
	['sec:vistas']
);

/** The evening tour shows figures in passing, live or not. */
const evening = chapter(
	'0.1',
	`## A glance at the sky

{{paper fig:sky}}

::: try {#sky-live}
Turn the sky.
:::

{{paper fig:ladder}}
`
);

const skyAtOnePoint = chapter(
	'9.6',
	`---
figures: [fig:sky]
---

## What one pixel sees

{{paper fig:sky}}

## Try a sky

::: try {#sky-live}
Choose a sky.
:::
`
);

const ladder = chapter(
	'13.3',
	`---
figures: [fig:ladder]
---

## Tides of every degree

Text first.

## The figure of the ladder

{{paper fig:ladder}}
`
);

const chapters = [evening, tides, waves, reading, broad, skyAtOnePoint, sky, ladder];
const result = mapPaper({
	anchors,
	chapters,
	liveFigures: new Map([
		['tidal-ring', 'fig:tidal'],
		['sky-live', 'fig:sky']
	]),
	overrides: {}
});
const byAnchor = new Map(result.links.map((l) => [l.anchor, l]));

describe('the margin map, generated', () => {
	it('gives a section to the reading chapter that reads it, at its top, the narrow reader first', () => {
		expect(byAnchor.get('sec:pixel')).toEqual({
			anchor: 'sec:pixel',
			chapter: 'R1',
			label: 'Reading'
		});
		expect(byAnchor.get('sec:vistas')?.chapter).toBe('R12');
	});

	it('gives a paragraph to the reading chapter of its section, at the heading its link opens', () => {
		expect(byAnchor.get('par:the-earths-own-tide')).toEqual({
			anchor: 'par:the-earths-own-tide',
			chapter: 'R1',
			label: 'Reading',
			section: 'the-earths-own-tide-is-subtracted'
		});
		expect(byAnchor.get('par:memory')).toMatchObject({
			chapter: 'R12',
			section: 'waves-leave-a-memory'
		});
	});

	it('gives a paragraph no chapter links the note of its namesake, or of its section', () => {
		expect(byAnchor.get('par:memory-2')).toMatchObject({ chapter: 'R12', label: 'Background' });
		expect(byAnchor.get('par:unread')).toEqual({
			anchor: 'par:unread',
			chapter: 'R12',
			label: 'Reading'
		});
	});

	it('gives an equation to the first chapter its ledger row names, where that chapter first shows it', () => {
		expect(byAnchor.get('eq:tidal')).toEqual({
			anchor: 'eq:tidal',
			chapter: '1.4',
			label: 'Derivation',
			section: 'the-tide-is-a-table'
		});
		// a link in the closing list of the paper's places does not set the heading
		expect(byAnchor.get('eq:wave')).toMatchObject({
			chapter: '7.6',
			section: 'the-tide-of-a-wave'
		});
	});

	it('marks an equation the paper states, or no ledger holds, as background', () => {
		expect(byAnchor.get('eq:stated')).toEqual({
			anchor: 'eq:stated',
			chapter: 'R1',
			label: 'Background',
			section: 'the-ledger-two-are-derived'
		});
		expect(byAnchor.get('eq:lonely')).toMatchObject({
			chapter: '1.4',
			label: 'Background',
			section: 'the-lonely-equation'
		});
	});

	it('gives a figure to the first chapter that shows it, live when a try block mounts it', () => {
		expect(byAnchor.get('fig:tidal')).toEqual({
			anchor: 'fig:tidal',
			chapter: '1.4',
			label: 'Live',
			section: 'the-figure'
		});
	});

	it('prefers a teaching chapter to the evening tour, at each step: live, about it, showing it', () => {
		expect(byAnchor.get('fig:sky')).toEqual({
			anchor: 'fig:sky',
			chapter: '9.6',
			label: 'Live',
			section: 'try-a-sky'
		});
		expect(byAnchor.get('fig:ladder')).toEqual({
			anchor: 'fig:ladder',
			chapter: '13.3',
			label: 'Background',
			section: 'the-figure-of-the-ladder'
		});
	});

	it('takes an override when its chapter uses the figure, and the rule when it does not', () => {
		const overridden = mapPaper({
			anchors,
			chapters,
			liveFigures: new Map([['sky-live', 'fig:sky']]),
			overrides: { 'fig:sky': '0.1', 'fig:ladder': '7.6' }
		});
		const get = (a: string) => overridden.links.find((l) => l.anchor === a);
		expect(get('fig:sky')).toEqual({
			anchor: 'fig:sky',
			chapter: '0.1',
			label: 'Live',
			section: 'a-glance-at-the-sky'
		});
		expect(get('fig:ladder')?.chapter).toBe('13.3');
		expect(overridden.notes).toContain('fig:ladder: the override names 7.6, which does not use it');
	});

	it('gives a table the reading chapter that links it when no other chapter does', () => {
		expect(byAnchor.get('tab:regimes')).toMatchObject({ chapter: 'R1', label: 'Background' });
	});

	it('leaves out the checks, and uses only its four labels', () => {
		expect(byAnchor.has('app:checks')).toBe(false);
		expect(byAnchor.has('tab:checks')).toBe(false);
		expect(result.links.map((l) => l.anchor)).toEqual(
			anchors.map((a) => a.id).filter((id) => !/checks/.test(id))
		);
		for (const l of result.links) expect(LABELS).toContain(l.label);
	});

	it('writes a module that lists the links in order', () => {
		const text = linksModule(result.links.slice(0, 2), 'the test');
		expect(text).toContain(`export const paperLinks: PaperLink[] = [`);
		expect(text).toContain(`{ anchor: 'sec:pixel', chapter: 'R1', label: 'Reading' },`);
		expect(text.indexOf('sec:pixel')).toBeLessThan(text.indexOf('eq:tidal'));
	});
});
