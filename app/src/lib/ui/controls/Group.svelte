<script lang="ts">
	/** A titled section of the controls panel. */
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section>
	<h3>{title}</h3>
	<div class="body">{@render children()}</div>
</section>

<style>
	section + :global(section) {
		margin-top: 1.1rem;
	}

	h3 {
		margin: 0 0 0.6rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--text-faint);
	}

	.body {
		display: grid;
		gap: 0.85rem;
	}

	/* A grid of on/off chips that never leaves one alone on a row: up to five share a row; more are dealt into
	   rows as even as can be (six as three and three, seven and eight as four and the rest, nine and ten as five). */
	.body :global(.toggles) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(3.4rem, 1fr));
		gap: 0.4rem;
	}

	.body :global(.toggles:has(> :nth-child(6):last-child)),
	.body :global(.toggles:has(> :nth-child(11):last-child)),
	.body :global(.toggles:has(> :nth-child(12):last-child)) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.body :global(.toggles:has(> :nth-child(7):last-child)),
	.body :global(.toggles:has(> :nth-child(8):last-child)) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.body :global(.toggles:has(> :nth-child(9):last-child)),
	.body :global(.toggles:has(> :nth-child(10):last-child)) {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	/* Things to do, as against choices to make: separate buttons sharing the row evenly, as tall as a choice of
	   views (Segmented) so that the two sit together. */
	.body :global(.actions) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.body :global(.action) {
		flex: 1 1 0;
		min-width: max-content;
		min-height: var(--control-height, 2.55rem);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		border-radius: 10px;
		border: 1px solid var(--line-strong);
		background: transparent;
		color: var(--text);
		font-size: 0.78rem;
		line-height: 1.2;
		cursor: pointer;
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.body :global(.action :is(svg)) {
		flex: none;
		color: var(--text-dim);
	}

	.body :global(.action:hover) {
		background: color-mix(in srgb, var(--text) 7%, transparent);
		border-color: var(--text-faint);
	}

	.body :global(.action:active) {
		background: color-mix(in srgb, var(--text) 11%, transparent);
	}

	.body :global(.action:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
