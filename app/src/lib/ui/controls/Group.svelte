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
		font: 600 0.62rem/1 var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.body {
		display: grid;
		gap: 0.85rem;
	}

	.body :global(.toggles) {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(3.7rem, 1fr));
		gap: 0.4rem;
	}

	.body :global(.actions) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.body :global(.action) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.75rem;
		border-radius: 9px;
		border: 1px solid rgb(255 255 255 / 0.1);
		background: rgb(255 255 255 / 0.04);
		color: var(--text);
		font-size: 0.76rem;
		cursor: pointer;
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.body :global(.action:hover) {
		background: rgb(255 255 255 / 0.09);
		border-color: rgb(255 255 255 / 0.2);
	}

	.body :global(.action:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
