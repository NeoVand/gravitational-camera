<script lang="ts">
	/**
	 * The paper's right margin, where the paper meets the tutorial: a note beside each anchor that a published
	 * chapter gives the background for, at the height of the anchor, at 1240px and wider; a small chip after the
	 * anchor's heading on narrower screens. Either opens a preview of the chapter on hover or focus.
	 *
	 * With side notes (side-notes/), each stands beside its paragraph in the same column,
	 * the two kinds stacked together in the order of the text so that none overlaps another; on narrower screens each
	 * folds into a "Note" after its paragraph (SideNoteFold.svelte).
	 */
	import { mount, unmount } from 'svelte';
	import { resolve } from '$app/paths';
	import SideNote from './SideNote.svelte';
	import SideNoteFold from './SideNoteFold.svelte';
	import type { MarginNote } from './paper-links';
	import type { SideNoteView } from './side-notes/index';

	interface Props {
		notes: MarginNote[];
		/** the article holding the paper's text, once it is in the page */
		article?: HTMLElement;
		/** the side notes beside the paragraphs, if any */
		sideNotes?: SideNoteView[];
	}

	let { notes, article, sideNotes = [] }: Props = $props();

	/** Links in the notes are written from the site's root; on the published site it sits under a base path. */
	const href = (path: string) => `${resolve('/')}${path.replace(/^\//, '')}`;

	let tops: number[] = $state([]);
	let sideTops: number[] = $state([]);

	/** The note whose preview is open, and where the preview goes (in the window). */
	type Preview = { index: number; left: number; top: number };
	let preview = $state<Preview | null>(null);
	let closing = 0;

	function show(index: number, trigger: Element) {
		clearTimeout(closing);
		const box = trigger.getBoundingClientRect();
		const width = Math.min(20 * 16, innerWidth - 32);
		const left = Math.max(16, Math.min(box.left, innerWidth - width - 16));
		preview = { index, left, top: box.bottom + 8 };
	}

	function hide(soon = true) {
		clearTimeout(closing);
		if (soon) closing = window.setTimeout(() => (preview = null), 150);
		else preview = null;
	}

	/** The last element of the paragraph at this anchor: past its parts continued after an equation. */
	function lastPart(anchor: string): HTMLElement | null {
		let last = document.getElementById(anchor);
		if (last?.matches('h4')) last = last.nextElementSibling as HTMLElement | null;
		while (last?.nextElementSibling?.matches('.equation, p.continued, .tutorial-chip'))
			last = last.nextElementSibling as HTMLElement;
		return last;
	}

	/**
	 * For the margin: each note sits level with its anchor, or below the note before it where two would overlap.
	 * The chips for narrow screens are put after each anchor's heading (inside a heading, after an equation, at the
	 * end of a figure's caption), and leave with the margin. Runs again when the article or the notes change.
	 */
	const place = (aside: HTMLElement) => {
		const root = article;
		if (!root) return;
		const chips = notes.map((note, index) => {
			const anchor = document.getElementById(note.anchor);
			const chip = document.createElement('a');
			chip.className = 'tutorial-chip';
			chip.href = href(note.href);
			chip.textContent = note.text;
			chip.dataset.margin = String(index);
			const open = () => show(index, chip);
			chip.addEventListener('pointerenter', open);
			chip.addEventListener('focus', open);
			chip.addEventListener('pointerleave', () => hide());
			chip.addEventListener('blur', () => hide());
			if (anchor?.matches('h2, h3, h4')) anchor.append(' ', chip);
			else if (anchor?.matches('figure'))
				(anchor.querySelector('figcaption') ?? anchor).append(' ', chip);
			else anchor?.after(chip);
			return chip;
		});

		// each side note's fold goes after the whole of its paragraph
		const folds = sideNotes.map((note) => {
			const slot = document.createElement('div');
			slot.className = 'side-fold-slot';
			lastPart(note.anchor)?.after(slot);
			return { slot, fold: mount(SideNoteFold, { target: slot, props: { note } }) };
		});

		const measure = () => {
			const base = aside.getBoundingClientRect().top;
			const els = Array.from(aside.querySelectorAll<HTMLElement>('.note'));
			const sides = Array.from(aside.querySelectorAll<HTMLElement>('.side'));
			const at = (id: string) => {
				const anchor = document.getElementById(id);
				return anchor ? anchor.getBoundingClientRect().top - base : 0;
			};
			const margin = notes.map((note, i) => ({ side: false, i, at: at(note.anchor), el: els[i] }));
			const height = (el?: HTMLElement) => el?.offsetHeight ?? 0;
			// a side note goes level with its paragraph if it fits there; else below the first of the margin's
			// notes within the paragraph after which it fits, or failing that below the last of them, so that the
			// margin's notes stay level with their equations
			const side = sideNotes.map((note, i) => {
				const top = at(note.anchor);
				const bottom = (lastPart(note.anchor)?.getBoundingClientRect().bottom ?? 0) - base;
				const h = height(sides[i]) + 18;
				const within = margin.filter((m) => m.at >= top && m.at < bottom);
				const starts = [top, ...within.map((m) => m.at + height(m.el) + 12)];
				const free = (y: number) =>
					!margin.some((m) => m.at < y + h && m.at + height(m.el) + 12 > y);
				return { side: true, i, at: starts.find(free) ?? starts[starts.length - 1], el: sides[i] };
			});
			// the two kinds stacked together in the order of their places
			const items = [...margin, ...side];
			if (sideNotes.length) items.sort((a, b) => a.at - b.at || Number(a.side) - Number(b.side));
			const nextTops: number[] = [];
			const nextSide: number[] = [];
			let below = -Infinity;
			for (const item of items) {
				const top = Math.max(item.at, below);
				below = top + (item.el?.offsetHeight ?? 0) + (item.side ? 18 : 12);
				(item.side ? nextSide : nextTops)[item.i] = top;
			}
			tops = nextTops;
			sideTops = nextSide;
		};
		measure();
		const watch = new ResizeObserver(measure);
		watch.observe(root);
		for (const el of aside.querySelectorAll('.side')) watch.observe(el);
		document.fonts?.ready.then(measure);
		return () => {
			watch.disconnect();
			for (const chip of chips) chip.remove();
			for (const { slot, fold } of folds) {
				unmount(fold);
				slot.remove();
			}
		};
	};

	const open = $derived(preview ? notes[preview.index] : undefined);
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && hide(false)} onscroll={() => hide(false)} />

<aside class="margin" aria-label="Background in the tutorial" {@attach place}>
	{#each notes as note, i (note.anchor)}
		<a
			class="note"
			href={resolve(note.href as '/')}
			style:top="{tops[i] ?? 0}px"
			data-margin={i}
			aria-describedby={preview?.index === i ? 'tutorial-preview' : undefined}
			onpointerenter={(e) => show(i, e.currentTarget)}
			onpointerleave={() => hide()}
			onfocus={(e) => show(i, e.currentTarget)}
			onblur={() => hide()}
		>
			<span class="label">{note.label}</span>
			<span class="where">{note.chapter.short}, {note.chapter.id}</span>
		</a>
	{/each}
	{#each sideNotes as note, i (note.anchor)}
		<div class="side" style:top="{sideTops[i] ?? 0}px" data-side={i}>
			<SideNote {note} />
		</div>
	{/each}
</aside>

{#if open && preview}
	<!-- eslint-disable svelte/no-at-html-tags -- the chapter's own title, question and equation, rendered at build time -->
	<div
		class="preview"
		id="tutorial-preview"
		role="tooltip"
		style:left="{preview.left}px"
		style:top="{preview.top}px"
		onpointerenter={() => clearTimeout(closing)}
		onpointerleave={() => hide()}
	>
		<p class="kicker">Tutorial · {open.chapter.id}</p>
		<p class="title">{@html open.chapter.titleHtml}</p>
		<p class="question">{@html open.chapter.questionHtml}</p>
		{#if open.chapter.equationHtml}
			<div class="eq">{@html open.chapter.equationHtml}</div>
		{/if}
	</div>
	<!-- eslint-enable svelte/no-at-html-tags -->
{/if}

<style>
	.margin {
		display: none;
	}

	@media (min-width: 1240px) {
		.margin {
			display: block;
			position: relative;
			grid-column: 3;
			grid-row: 1;
		}
	}

	.note {
		position: absolute;
		left: 0;
		width: min(13rem, 100%);
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 0.1rem 0 0.15rem 0.75rem;
		border-left: 1px solid var(--line-strong);
		font: 400 0.82rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-decoration: none;
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.note .label {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.note:hover,
	.note:focus-visible {
		color: var(--text);
		border-left-color: var(--accent);
	}

	/* a side note: the same hairline as the notes, a little wider, its text in the paper's serif */
	.side {
		position: absolute;
		left: 0;
		box-sizing: border-box;
		width: min(15rem, 100%);
		padding: 0.1rem 0 0.15rem 0.75rem;
		border-left: 1px solid var(--line);
	}

	/* the folds of the side notes, put after their paragraphs by the effect above, for narrow screens only */
	@media (min-width: 1240px) {
		:global(.side-fold-slot) {
			display: none;
		}
	}

	/* the chips, put into the paper's text by the effect above */
	:global(.tutorial-chip) {
		display: inline-block;
		margin-left: 0.3em;
		padding: 0.05rem 0.55rem 0.1rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		font: 400 0.75rem/1.5 var(--font-sans);
		font-style: normal;
		color: var(--text-dim);
		text-decoration: none;
		white-space: nowrap;
		vertical-align: 0.12em;
	}

	:global(.tutorial-chip:hover),
	:global(.tutorial-chip:focus-visible) {
		color: var(--text);
		border-color: var(--accent);
	}

	/* after an equation, the chip sits under it at the right */
	:global(.equation + .tutorial-chip) {
		display: table;
		margin: -0.6rem 0 0.8rem auto;
	}

	@media (min-width: 1240px) {
		:global(.tutorial-chip) {
			display: none !important;
		}
	}

	.preview {
		position: fixed;
		z-index: 30;
		width: min(20rem, calc(100vw - 2rem));
		padding: 0.85rem 1rem 0.9rem;
		background: var(--bg-raised);
		border: 1px solid var(--line-strong);
		border-radius: 10px;
		box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
		font: 400 0.9rem/1.45 var(--font-serif);
		color: var(--text-dim);
	}

	.preview p {
		margin: 0;
	}

	.preview .kicker {
		font: 500 0.72rem/1.4 var(--font-sans);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.preview .title {
		margin-top: 0.2rem;
		font: 500 1.08rem/1.3 var(--font-serif);
		color: var(--text);
	}

	.preview .question {
		margin-top: 0.35rem;
		font-style: italic;
	}

	.preview .eq {
		margin-top: 0.5rem;
		overflow-x: auto;
		color: var(--text);
	}

	.preview .eq :global(.katex-display) {
		margin: 0.3rem 0 0;
	}
</style>
