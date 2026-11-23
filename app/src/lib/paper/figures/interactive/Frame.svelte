<script lang="ts">
	/**
	 * A live figure inside the online paper: its picture on a stage of fixed shape, in the site's theme, a bar below
	 * with its few controls (or a line on how to handle it), and a way to open it full screen with all of them: an
	 * interactive figure's own page, or a demo's. The full-screen link says which figure of the paper it was opened
	 * from (`?from=`, the id of the figure the frame stands in), so that the page can lead back to it.
	 */
	import type { Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { FullScreenIcon } from '@hugeicons/core-free-icons';

	interface Props {
		slug: string;
		/** Where the full-screen version lives: an interactive figure's page (the default) or a demo. */
		section?: 'figures' | 'demo';
		/** width over height of the stage */
		aspect?: number;
		/** CSS custom properties for the drawing, such as its width (--figure-width) */
		vars?: string;
		stage: Snippet;
		controls?: Snippet;
		/** A line on how to handle the picture, for a figure without controls of its own. */
		hint?: string;
		/** The stage's shape and drawing on a phone, where a wide stage leaves the drawing too small. */
		narrow?: { aspect?: number; vars?: string };
	}

	let {
		slug,
		section = 'figures',
		aspect = 16 / 10,
		vars = '',
		stage,
		controls,
		hint,
		narrow
	}: Props = $props();

	/** The width below which the column is a phone's, as in the site's header. */
	const phone = new MediaQuery('max-width: 560px', false);
	const style = $derived(
		phone.current && narrow
			? `aspect-ratio: ${narrow.aspect ?? aspect}; ${vars}; ${narrow.vars ?? ''}`
			: `aspect-ratio: ${aspect}; ${vars}`
	);

	/** The id of the paper's figure this frame stands in, read from the page once it is there. */
	let from = $state('');
	const href = $derived(
		resolve(
			`${section}/${slug}/${from ? `?from=${encodeURIComponent(from)}` : ''}` as 'figures/four-stars/'
		)
	);

	function figureOf(node: HTMLElement) {
		from = node.closest('figure[id]')?.id ?? '';
	}
</script>

<div class="interactive" {@attach figureOf}>
	<div class="stage" {style}>{@render stage()}</div>
	<div class="bar">
		{#if controls}
			<div class="controls">{@render controls()}</div>
		{:else if hint}
			<p class="hint">{hint}</p>
		{/if}
		<a class="full" {href}>
			<HugeiconsIcon icon={FullScreenIcon} size={15} strokeWidth={1.8} />
			Full screen
		</a>
	</div>
</div>

<style>
	.interactive {
		font-family: var(--font-sans);
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--line);
		text-align: left;
	}
	.stage {
		position: relative;
		width: 100%;
		--stage-pad: 0.6rem 0.6rem 0.8rem;
		--tag-inset: 10px;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.6rem 1rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}
	.controls {
		flex: 1 1 18rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
		gap: 0.6rem 1rem;
	}
	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
	}
	.full {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-left: auto;
		color: var(--text-dim);
		font: 500 0.78rem/1.35 var(--font-sans);
		text-decoration: none;
		white-space: nowrap;
	}
	.full:hover {
		color: var(--text);
	}
	.full:hover,
	.full:focus-visible {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}
</style>
