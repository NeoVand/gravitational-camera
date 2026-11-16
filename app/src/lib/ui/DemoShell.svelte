<script lang="ts">
	/**
	 * The frame shared by every demo: the picture, a title, a panel of controls
	 * and a card of notes that can be put away.
	 */
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, Cancel01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';

	interface Props {
		title: string;
		stage: Snippet;
		controls: Snippet;
		notes: Snippet;
	}

	let { title, stage, controls, notes }: Props = $props();
	let notesOpen = $state(true);

	// On a phone the notes would cover the picture, so start with them closed.
	$effect(() => {
		if (window.matchMedia('(max-width: 640px)').matches) notesOpen = false;
	});
</script>

<main class="always-dark">
	<div class="stage">{@render stage()}</div>

	<header>
		<a class="home" href={resolve('/demo')}>
			<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={1.8} /> All demos
		</a>
		<h1>{title}</h1>
	</header>

	<section class="panel" aria-label="Controls">
		{@render controls()}
		<button type="button" class="notes-toggle" onclick={() => (notesOpen = !notesOpen)}>
			<HugeiconsIcon icon={InformationCircleIcon} size={18} strokeWidth={1.6} />
			{notesOpen ? 'Hide notes' : 'Notes'}
		</button>
	</section>

	{#if notesOpen}
		<aside class="notes">
			{@render notes()}
			<button type="button" class="close" onclick={() => (notesOpen = false)}>
				<HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} /> Close
			</button>
		</aside>
	{/if}
</main>

<style>
	main {
		position: fixed;
		inset: 0;
		display: grid;
		grid-template-rows: 1fr auto;
		background: #000;
	}

	.stage {
		position: relative;
		min-height: 0;
	}

	header {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.9rem var(--gutter);
		pointer-events: none;
	}

	header a,
	header h1 {
		pointer-events: auto;
	}

	.home {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
		color: var(--text-dim);
		text-decoration: none;
	}

	.home:hover {
		color: var(--text);
	}

	h1 {
		margin: 2.2rem 0 0;
		font: 400 clamp(1.5rem, 3vw, 2.2rem) / 1.1 var(--font-serif);
		letter-spacing: -0.01em;
		text-shadow: 0 1px 12px rgb(0 0 0 / 0.8);
	}

	.panel {
		position: relative;
		display: grid;
		gap: 0.55rem;
		padding: 0.9rem var(--gutter) 1rem;
		background: var(--bg-raised);
		border-top: 1px solid var(--line);
		font-size: 0.85rem;
	}

	.panel :global(.row) {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr) minmax(0, 19rem);
		align-items: center;
		gap: 0.9rem;
	}

	.panel :global(.row > label) {
		color: var(--text-dim);
	}

	.panel :global(output) {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.panel :global(input[type='range']) {
		width: 100%;
		accent-color: var(--accent);
	}

	.panel :global(.buttons) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 0.9rem;
		padding-right: 7.5rem;
	}

	.panel :global(button),
	.notes button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: transparent;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.35em 0.9em;
		cursor: pointer;
	}

	.panel :global(button:hover),
	.notes button:hover {
		border-color: var(--text-dim);
	}

	.panel :global(button[aria-pressed='true']) {
		background: var(--text);
		border-color: var(--text);
		color: var(--bg);
	}

	.panel :global(.segmented) {
		display: inline-flex;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 2px;
	}

	.panel :global(.segmented button) {
		border: 0;
		padding: 0.3em 0.85em;
	}

	.panel :global(.check) {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
	}

	.panel :global(.check input) {
		accent-color: var(--accent);
	}

	.panel .notes-toggle {
		position: absolute;
		right: var(--gutter);
		bottom: 1rem;
		border-color: transparent;
		color: var(--text-dim);
	}

	.notes {
		position: absolute;
		left: var(--gutter);
		bottom: 9.6rem;
		width: min(23rem, calc(100% - 2 * var(--gutter)));
		max-height: calc(100% - 17rem);
		overflow: auto;
		padding: 1rem 1.1rem;
		background: rgb(10 13 18 / 0.78);
		border: 1px solid var(--line);
		border-radius: 12px;
		backdrop-filter: blur(10px);
		font-size: 0.84rem;
		line-height: 1.5;
	}

	.notes :global(p) {
		margin: 0 0 0.8rem;
	}

	.notes :global(dl) {
		margin: 0 0 0.8rem;
		display: grid;
		gap: 0.5rem;
	}

	.notes :global(dt) {
		color: var(--text-dim);
		font-size: 0.74rem;
	}

	.notes :global(dd) {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.notes :global(.fine) {
		color: var(--text-dim);
		font-size: 0.76rem;
		margin: 0;
	}

	.notes .close {
		display: none;
	}

	@media (max-width: 640px) {
		main {
			grid-template-rows: auto 1fr auto;
		}

		header {
			position: static;
			grid-row: 1;
			padding: 0.6rem var(--gutter) 0.7rem;
			background: var(--bg-raised);
		}

		h1 {
			margin-top: 0.15rem;
			font-size: 1.35rem;
			text-shadow: none;
		}

		.stage {
			grid-row: 2;
		}

		.panel {
			grid-row: 3;
		}

		.panel :global(.row) {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}

		.panel :global(.buttons) {
			padding-right: 0;
			padding-bottom: 2.2rem;
		}

		.notes {
			position: fixed;
			inset: auto 0 0 0;
			width: auto;
			max-height: 70svh;
			border-radius: 14px 14px 0 0;
			background: rgb(10 13 18 / 0.96);
			z-index: 5;
		}

		.notes .close {
			display: inline-flex;
			margin-top: 0.9rem;
		}
	}
</style>
