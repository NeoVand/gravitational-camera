<script lang="ts">
	/**
	 * A side note folded after its paragraph, for screens too narrow for the margin: a quiet "Note" that opens in
	 * place, so that the reading flow is not broken by it and a phone, which cannot hover, can still read it.
	 */
	import SideNote from './SideNote.svelte';
	import type { SideNoteView } from './side-notes/index';

	let { note }: { note: SideNoteView } = $props();
</script>

<details class="fold">
	<summary>Note <span>· {note.where}</span></summary>
	<div class="body"><SideNote {note} /></div>
</details>

<style>
	.fold {
		margin: -0.35rem 0 1.15rem;
		padding-left: 0.8rem;
		border-left: 1px solid var(--line-strong);
	}

	summary {
		display: flex;
		align-items: baseline;
		gap: 0.45em;
		width: fit-content;
		list-style: none;
		cursor: pointer;
		font: italic 400 0.95rem/1.6 var(--font-serif);
		color: var(--text-dim);
		border-radius: 2px;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary span {
		font: 400 0.75rem/1.6 var(--font-sans);
		color: var(--text-faint);
	}

	/* the disclosure mark of the plain-words boxes, in the text's own grey */
	summary::before {
		content: '';
		flex: none;
		width: 0.32em;
		height: 0.32em;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-0.12em) rotate(-45deg);
		transition: transform 0.15s ease;
	}

	.fold[open] > summary::before {
		transform: translateY(-0.22em) rotate(45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		summary::before {
			transition: none;
		}
	}

	summary:hover {
		color: var(--text);
	}

	summary:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}

	.body {
		padding: 0.35rem 0 0.2rem;
	}

	.body :global(.picture) {
		height: 10rem;
		max-width: 22rem;
	}
</style>
