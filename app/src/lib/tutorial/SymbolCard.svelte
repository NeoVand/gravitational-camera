<script lang="ts">
	/**
	 * The card a symbol opens when it is clicked (or focused and Enter pressed): what the symbol stands for, its
	 * colour role and kind, one paragraph, and the chapter that defines it. Which card is open is kept by
	 * symbol-cards.svelte.ts, whose attachment the chapter's article carries.
	 */
	import { resolve } from '$app/paths';
	import { ROLE_INFO } from './colour';
	import type { SymbolCards } from './symbol-cards.svelte';

	interface Props {
		cards: SymbolCards;
	}

	let { cards }: Props = $props();

	/** The card itself, so that a press inside it does not close it. */
	let card: HTMLElement | undefined;
	const keep = (el: HTMLElement) => {
		card = el;
		return () => (card = undefined);
	};

	const open = $derived(cards.open);
	const entry = $derived(open?.entry);
</script>

<svelte:window
	onkeydown={(e) => e.key === 'Escape' && cards.close(true)}
	onpointerdown={(e) => {
		if (!open || !(e.target instanceof Node)) return;
		if (card?.contains(e.target) || open.trigger.contains(e.target)) return;
		cards.close();
	}}
/>

{#if open && entry}
	<!-- eslint-disable svelte/no-at-html-tags -- from tutorial/symbols.yaml, rendered at build time -->
	<section
		class="symbol-card"
		id="symbol-card"
		aria-label="Symbol: {entry.title}"
		style:left="{open.left}px"
		style:top="{open.top}px"
		{@attach keep}
	>
		<header>
			<span class="glyph">{@html entry.html}</span>
			<div>
				<p class="title">{entry.title}</p>
				{#if entry.role !== 'none'}
					<p class="role q-{entry.role}">
						<span class="dot"></span>{ROLE_INFO[entry.role].name}
					</p>
				{/if}
			</div>
			<button type="button" class="close" aria-label="Close" onclick={() => cards.close(true)}
				>×</button
			>
		</header>
		<p class="kind">{entry.kind}</p>
		<p class="meaning">{@html entry.meaningHtml}</p>
		<p class="where">
			{#if entry.defined.href}
				<a href={resolve((entry.defined.href + (entry.anchor ? `#${entry.anchor}` : '')) as '/')}
					>Defined in {entry.defined.id}, {entry.defined.short}</a
				>
			{:else}
				Defined in {entry.defined.id}, {entry.defined.short} (in preparation)
			{/if}
		</p>
	</section>
	<!-- eslint-enable svelte/no-at-html-tags -->
{/if}

<style>
	.symbol-card {
		position: absolute;
		z-index: 30;
		width: min(21rem, calc(100vw - 2rem));
		padding: 0.9rem 1rem 0.95rem;
		background: var(--bg-raised);
		border: 1px solid var(--line-strong);
		border-radius: 10px;
		box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
		font: 400 0.88rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}

	header {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.8rem;
	}

	.glyph {
		min-width: 2.4rem;
		font-size: 1.45rem;
		color: var(--text);
		text-align: center;
	}

	p {
		margin: 0;
	}

	.title {
		font: 500 1.06rem/1.3 var(--font-serif);
		color: var(--text);
	}

	.role {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.78rem;
		font-weight: 600;
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
	}

	.close {
		align-self: start;
		width: 1.7rem;
		height: 1.7rem;
		border: 0;
		border-radius: 50%;
		background: none;
		font-size: 1.2rem;
		line-height: 1;
		color: var(--text-faint);
		cursor: pointer;
	}

	.close:hover {
		color: var(--text);
		background: var(--well);
	}

	.kind {
		margin-top: 0.6rem;
		font-style: italic;
		color: var(--text-faint);
	}

	.meaning {
		margin-top: 0.4rem;
		color: var(--text);
		font: 400 0.95rem/1.5 var(--font-serif);
	}

	.where {
		margin-top: 0.6rem;
		font-size: 0.8rem;
	}

	.where a {
		color: var(--accent);
		text-decoration: none;
	}

	.where a:hover {
		text-decoration: underline;
	}
</style>
