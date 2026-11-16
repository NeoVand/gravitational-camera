<script lang="ts">
	/** A formula, typeset by KaTeX (the same as in the paper). */
	import katex from 'katex';
	import 'katex/dist/katex.min.css';

	interface Props {
		/** LaTeX source, without dollar signs. */
		math: string;
		/** A displayed equation on its own line, rather than inline. */
		display?: boolean;
	}

	let { math, display = false }: Props = $props();

	const html = $derived(
		katex.renderToString(math, { displayMode: display, throwOnError: false, output: 'html' })
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- KaTeX output for formulas written in this repository -->
{#if display}<div class="display">{@html html}</div>{:else}<span class="inline">{@html html}</span
	>{/if}

<style>
	.display {
		margin: 0.7rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: thin;
	}

	.display :global(.katex) {
		font-size: 1.05em;
	}

	.inline :global(.katex) {
		font-size: 1.04em;
		white-space: nowrap;
	}
</style>
