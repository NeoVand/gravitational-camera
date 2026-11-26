<script lang="ts">
	/**
	 * The glosses of the paper's rich page (glosses.ts): a quiet dotted link on the first use of a glossary term,
	 * which on hover or focus opens a small card with the term, the tutorial's definition and the chapter that
	 * defines it. A touch opens the card first; a second touch on the same term follows its link.
	 */
	import { resolve } from '$app/paths';
	import type { GlossCard } from './glosses';

	interface Props {
		/** the article holding the paper's text, once it is in the page */
		article?: HTMLElement;
		cards: GlossCard[];
	}

	let { article, cards }: Props = $props();

	const byKey = $derived(new Map(cards.map((c) => [c.key, c])));

	/** The card open, and where it goes (in the window). */
	let open = $state<{ card: GlossCard; left: number; top: number; above: boolean } | null>(null);
	let closing = 0;

	function show(link: HTMLAnchorElement) {
		const card = byKey.get(link.dataset.gloss ?? '');
		if (!card) return;
		clearTimeout(closing);
		for (const other of article?.querySelectorAll('a.gloss[aria-describedby]') ?? [])
			other.removeAttribute('aria-describedby');
		link.setAttribute('aria-describedby', 'gloss-card');
		const box = link.getBoundingClientRect();
		const width = Math.min(19 * 16, innerWidth - 32);
		const left = Math.max(16, Math.min(box.left - 12, innerWidth - width - 16));
		// below the term, unless the window has too little room there
		const above = innerHeight - box.bottom < 220 && box.top > innerHeight - box.bottom;
		open = { card, left, top: above ? innerHeight - box.top + 8 : box.bottom + 8, above };
	}

	function hide(soon = true) {
		clearTimeout(closing);
		const close = () => {
			for (const link of article?.querySelectorAll('a.gloss[aria-describedby]') ?? [])
				link.removeAttribute('aria-describedby');
			open = null;
		};
		if (soon) closing = window.setTimeout(close, 150);
		else close();
	}

	/** The gloss an event is on, if it is in the article: its glosses are the page's own HTML, found by delegation. */
	const glossOf = (target: EventTarget | null) => {
		if (!cards.length || !(target instanceof Element)) return null;
		const link = target.closest<HTMLAnchorElement>('a.gloss');
		return link && article?.contains(link) ? link : null;
	};

	let touch = false;

	function over(e: PointerEvent) {
		const link = glossOf(e.target);
		if (link && e.pointerType !== 'touch') show(link);
	}

	function out(e: PointerEvent) {
		const link = glossOf(e.target);
		if (link && !link.contains(e.relatedTarget as Node | null)) hide();
	}

	function click(e: MouseEvent) {
		const link = glossOf(e.target);
		if (!link || !touch) return;
		// a first touch opens the card, a second on the same term follows the link
		if (open?.card.key !== link.dataset.gloss) {
			e.preventDefault();
			show(link);
		}
	}

	/** A touch anywhere but on a gloss or its card closes the card. */
	function down(e: PointerEvent) {
		touch = e.pointerType === 'touch';
		if (!open || !(e.target instanceof Element)) return;
		if (e.target.closest('a.gloss, .gloss-card')) return;
		hide(false);
	}
</script>

<svelte:window
	onkeydown={(e) => e.key === 'Escape' && hide(false)}
	onscroll={() => open && hide(false)}
/>

<svelte:document
	onpointerover={over}
	onpointerout={out}
	onpointerdown={down}
	onclick={click}
	onfocusin={(e) => {
		const link = glossOf(e.target);
		if (link) show(link);
	}}
	onfocusout={(e) => glossOf(e.target) && hide()}
/>

{#if open}
	<!-- eslint-disable svelte/no-at-html-tags -- the glossary's own definition and the chapter's title, rendered at build time -->
	<div
		class="gloss-card"
		id="gloss-card"
		role="tooltip"
		style:left="{open.left}px"
		style:top={open.above ? undefined : `${open.top}px`}
		style:bottom={open.above ? `${open.top}px` : undefined}
		onpointerenter={() => clearTimeout(closing)}
		onpointerleave={() => hide()}
	>
		<p class="term">{open.card.term}</p>
		<p class="definition">{@html open.card.definitionHtml}</p>
		<a class="chapter" href={resolve(open.card.href as '/')}
			>From chapter {open.card.chapter}, <span>{@html open.card.titleHtml}</span></a
		>
	</div>
	<!-- eslint-enable svelte/no-at-html-tags -->
{/if}

<style>
	/* the gloss: the text's own ink, a dotted hairline under it, solid on hover */
	:global(article.prose a.gloss) {
		color: inherit;
		text-decoration-line: underline;
		text-decoration-style: dotted;
		text-decoration-thickness: 1px;
		text-decoration-color: color-mix(in srgb, currentColor 55%, transparent);
		text-underline-offset: 0.22em;
		transition: text-decoration-color 0.15s;
	}

	:global(article.prose a.gloss:hover),
	:global(article.prose a.gloss:focus-visible),
	:global(article.prose a.gloss[aria-describedby]) {
		text-decoration-style: solid;
		text-decoration-color: currentColor;
	}

	:global(article.prose a.gloss:focus-visible) {
		outline: 1px solid var(--accent);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.gloss-card {
		position: fixed;
		z-index: 30;
		box-sizing: border-box;
		width: min(19rem, calc(100vw - 2rem));
		padding: 0.8rem 1rem 0.85rem;
		background: var(--bg-raised);
		border: 1px solid var(--line-strong);
		border-radius: 10px;
		box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
		font: 400 0.9rem/1.5 var(--font-serif);
		color: var(--text-dim);
	}

	.gloss-card p {
		margin: 0;
	}

	.term {
		font: 500 1.05rem/1.3 var(--font-serif);
		color: var(--text);
	}

	.definition {
		margin-top: 0.3rem !important;
	}

	.definition :global(.katex) {
		font-size: 1em;
	}

	.chapter {
		display: block;
		margin-top: 0.55rem;
		font: 400 0.76rem/1.45 var(--font-sans);
		color: var(--text-faint);
		text-decoration: none;
	}

	.chapter span {
		color: var(--text-dim);
	}

	.chapter:hover span,
	.chapter:focus-visible span {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
