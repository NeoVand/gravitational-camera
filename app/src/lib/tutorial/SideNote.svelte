<script lang="ts">
	/**
	 * One side note of the paper (side-notes/): its sentences, a small copy of the tutorial's drawing if it has one,
	 * and the link to the chapter section it is borrowed from. The margin shows it beside its paragraph on wide
	 * screens; on narrow ones it opens from a "Note" after the paragraph (SideNoteFold.svelte).
	 */
	import { resolve } from '$app/paths';
	import LazyDrawing from './landing/LazyDrawing.svelte';
	import type { SideNoteView } from './side-notes/index';

	let { note }: { note: SideNoteView } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- the note's own text, rendered at build time from side-notes/ -->
<p class="text">{@html note.html}</p>
{#if note.figure}
	<a class="picture" href={resolve(note.href as '/')} tabindex="-1" aria-hidden="true">
		<LazyDrawing name={note.figure.name} alt={note.figure.alt} />
	</a>
{/if}
<a class="from" href={resolve(note.href as '/')}>From {note.where}</a>

<style>
	.text {
		margin: 0;
		font: 400 0.9rem/1.5 var(--font-serif);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* a long formula may break at its operators rather than run out of the margin */
	.text :global(.katex) {
		font-size: 1em;
		white-space: normal;
	}

	.picture {
		display: block;
		height: 6.5rem;
		margin-top: 0.55rem;
	}

	.from {
		display: inline-block;
		margin-top: 0.4rem;
		font: 400 0.78rem/1.4 var(--font-sans);
		color: var(--text-faint);
		text-decoration: none;
	}

	.from::after {
		content: ' →';
	}

	.from:hover,
	.from:focus-visible {
		color: var(--accent);
	}
</style>
