<script lang="ts">
	/** A formula, typeset by KaTeX (the same as in the paper). */
	import katex from 'katex';
	import 'katex/dist/katex.min.css';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		/** LaTeX source, without dollar signs. */
		math: string;
		/** A displayed equation on its own line, rather than inline. */
		display?: boolean;
		/** Allow \htmlClass, for the tutorial's colour roles (and nothing else KaTeX would need trusted for). */
		trust?: boolean;
	}

	let { math, display = false, trust = false }: Props = $props();

	const html = $derived(
		katex.renderToString(math, {
			displayMode: display,
			throwOnError: false,
			output: 'html',
			...(trust && {
				trust: (context: { command: string }) => context.command === '\\htmlClass',
				strict: 'ignore' as const
			})
		})
	);

	/**
	 * A displayed equation wider than its column scrolls sideways in its own box. Which ends have more of it out of
	 * sight is marked, so that the edge fades there and the equation never looks cut off.
	 */
	const edges: Attachment<HTMLElement> = (box) => {
		const mark = () => {
			const hidden = box.scrollWidth - box.clientWidth;
			box.classList.toggle('more-left', hidden > 1 && box.scrollLeft > 1);
			box.classList.toggle('more-right', hidden > 1 && box.scrollLeft < hidden - 1);
		};
		mark();
		const seen = new ResizeObserver(mark);
		seen.observe(box);
		if (box.firstElementChild) seen.observe(box.firstElementChild);
		box.addEventListener('scroll', mark, { passive: true });
		return () => {
			seen.disconnect();
			box.removeEventListener('scroll', mark);
		};
	};
</script>

<!-- one element either way, a block for a displayed formula and inline for one in the text -->
<!-- eslint-disable svelte/no-at-html-tags -- KaTeX output for formulas written in this repository -->
<svelte:element
	this={display ? 'div' : 'span'}
	class={display ? 'display' : 'inline'}
	{@attach display && edges}>{@html html}</svelte:element
>

<!-- eslint-enable svelte/no-at-html-tags -->

<style>
	.display {
		--fade: 1.75rem;
		margin: 0.7rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-x: contain;
		/* room for the scrollbar under the formula, where one is drawn */
		padding-bottom: 0.15rem;
		scrollbar-width: thin;
		scrollbar-color: var(--line-strong) transparent;
	}

	.display:global(.more-right) {
		mask-image: linear-gradient(to left, transparent, #000 var(--fade));
	}

	.display:global(.more-left) {
		mask-image: linear-gradient(to right, transparent, #000 var(--fade));
	}

	.display:global(.more-left.more-right) {
		mask-image: linear-gradient(
			to right,
			transparent,
			#000 var(--fade),
			#000 calc(100% - var(--fade)),
			transparent
		);
	}

	.display :global(.katex) {
		font-size: 1.05em;
	}

	.inline :global(.katex) {
		font-size: 1.04em;
		white-space: nowrap;
	}
</style>
