<script lang="ts">
	/**
	 * An interactive figure inside the online paper: its picture on a stage of fixed shape, in the site's theme, its
	 * few controls below, and a way to open it full screen with all of them. The full-screen link says which figure of
	 * the paper it was opened from (`?from=`, the id of the figure the frame stands in), so that the page can lead
	 * back to it.
	 */
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { FullScreenIcon } from '@hugeicons/core-free-icons';

	interface Props {
		slug: string;
		/** width over height of the stage */
		aspect?: number;
		/** CSS custom properties for the drawing, such as its width (--figure-width) */
		vars?: string;
		stage: Snippet;
		controls?: Snippet;
	}

	let { slug, aspect = 16 / 10, vars = '', stage, controls }: Props = $props();

	/** The id of the paper's figure this frame stands in, read from the page once it is there. */
	let from = $state('');
	const href = $derived(
		resolve(
			`figures/${slug}/${from ? `?from=${encodeURIComponent(from)}` : ''}` as 'figures/four-stars/'
		)
	);

	function figureOf(node: HTMLElement) {
		from = node.closest('figure[id]')?.id ?? '';
	}
</script>

<div class="interactive" {@attach figureOf}>
	<div class="stage" style="aspect-ratio: {aspect}; {vars}">{@render stage()}</div>
	<div class="bar">
		{#if controls}<div class="controls">{@render controls()}</div>{/if}
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
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 0.6rem 1rem;
	}
	.full {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-left: auto;
		color: var(--text-dim);
		font: 500 0.78rem/1 var(--font-sans);
		text-decoration: none;
		white-space: nowrap;
	}
	.full:hover {
		color: var(--text);
	}
</style>
