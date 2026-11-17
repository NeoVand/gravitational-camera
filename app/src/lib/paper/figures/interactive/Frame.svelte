<script lang="ts">
	/**
	 * An interactive figure inside the online paper: its picture on a dark stage of fixed shape, its few controls
	 * below, and a way to open it full screen with all of them.
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
</script>

<div class="interactive always-dark">
	<div class="stage" style="aspect-ratio: {aspect}; {vars}">{@render stage()}</div>
	<div class="bar">
		{#if controls}<div class="controls">{@render controls()}</div>{/if}
		<a class="full" href={resolve(`/figures/${slug}` as '/figures/four-stars')}>
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
