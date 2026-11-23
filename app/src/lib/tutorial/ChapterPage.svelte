<script lang="ts">
	/**
	 * A tutorial chapter, set as the paper is set: the contents on the left (the parts, this part's chapters, and
	 * this chapter's sections), the text centred in the paper's measure, margin notes in the right margin at 1240px
	 * and wider. The chapter's HTML comes from lib/tutorial/render.ts at build time.
	 */
	import 'katex/dist/katex.min.css';
	import '#lib/paper/prose.css';
	import './tutorial.css';
	import { resolve } from '$app/paths';
	import { figureDrawing, figureImage } from '#lib/paper/figures.js';
	import { fitEquations, followHeadings } from '#lib/paper/reading.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import Legend from './Legend.svelte';
	import SymbolCard from './SymbolCard.svelte';
	import { SymbolCards } from './symbol-cards.svelte';
	import { tutorialLive } from './live';
	import type { ChapterPageData } from '#lib/server/sources.js';

	interface Props {
		data: ChapterPageData;
		/** for pages that must not be indexed (the sample) */
		noindex?: boolean;
	}

	let { data, noindex = false }: Props = $props();
	const chapter = $derived(data.chapter);
	const meta = $derived(chapter.meta);

	const cards = new SymbolCards(() => data.symbols);
	let active = $state('');
	const followReading = followHeadings('h2[id]', (id) => (active = id));

	/** On narrow screens a margin note opens below its line when its number is pressed. */
	function toggleNotes(node: HTMLElement) {
		const onClick = (event: MouseEvent) => {
			const mark = event.target instanceof Element ? event.target.closest('.mn-mark') : null;
			if (!(mark instanceof HTMLButtonElement)) return;
			mark.setAttribute('aria-expanded', String(mark.getAttribute('aria-expanded') !== 'true'));
		};
		node.addEventListener('click', onClick);
		return () => node.removeEventListener('click', onClick);
	}
</script>

<svelte:head>
	<title>{meta.id} {meta.titleText} · Tutorial · Gravitational Camera</title>
	{#if noindex}<meta name="robots" content="noindex" />{/if}
</svelte:head>

<SiteHeader current="tutorial" />

<!-- The HTML below is produced at build time from this repository's own Markdown (tutorial/), never from
     visitors, so rendering it as HTML is safe. -->
<!-- eslint-disable svelte/no-at-html-tags -->
<div class="layout">
	<nav class="contents" aria-label="Tutorial contents">
		<p><a href={resolve('/tutorial/' as '/')}>Tutorial</a></p>
		<ol class="parts">
			{#each data.rail as part (part.id)}
				{@const current = part.id === data.part?.id}
				<li class={{ current }}>
					<a class="part" href={resolve(`/tutorial/#part-${part.id}` as '/')}
						><span>{part.id}</span>{part.title}</a
					>
					{#if current}
						<ol class="chapters">
							{#each part.chapters as c (c.id)}
								<li>
									{#if c.id === meta.id}
										<span class="ch here" aria-current="page"><span>{c.id}</span>{c.short}</span>
										{#if chapter.contents.length}
											<ol class="sections">
												{#each chapter.contents as s (s.id)}
													<li>
														<a
															href="#{s.id}"
															aria-current={active === s.id ? 'location' : undefined}
															>{@html s.titleHtml}</a
														>
													</li>
												{/each}
											</ol>
										{/if}
									{:else if c.href}
										<a class="ch" href={resolve(c.href as '/')}><span>{c.id}</span>{c.short}</a>
									{:else}
										<span class="ch planned"><span>{c.id}</span>{c.short}</span>
									{/if}
								</li>
							{/each}
						</ol>
					{/if}
				</li>
			{/each}
		</ol>
		{#if !data.part && chapter.contents.length}
			<p class="this">This chapter</p>
			<ol class="sections">
				{#each chapter.contents as s (s.id)}
					<li>
						<a href="#{s.id}" aria-current={active === s.id ? 'location' : undefined}
							>{@html s.titleHtml}</a
						>
					</li>
				{/each}
			</ol>
		{/if}
	</nav>

	<article
		class="prose chapter"
		{@attach cards.watch}
		{@attach followReading}
		{@attach fitEquations}
		{@attach toggleNotes}
	>
		<header>
			<p class="kicker">
				{#if data.part}
					<a href={resolve(`/tutorial/#part-${data.part.id}` as '/')}
						>Part {data.part.id} · {data.part.title}</a
					>
				{:else}
					<a href={resolve('/tutorial/' as '/')}>Tutorial</a> · Part {meta.part}
				{/if}
			</p>
			<h1><span class="number">{meta.id}</span> {@html meta.title}</h1>
			<p class="question">{@html meta.question}</p>
			{#if data.requires.length}
				<p class="needs">
					<span class="needs-label">What you need</span>
					{#each data.requires as r (r.id)}
						{#if r.href}
							<a class="chip" href={resolve(r.href as '/')}><span>{r.id}</span> {r.short}</a>
						{:else}
							<span class="chip planned" title="In preparation"><span>{r.id}</span> {r.short}</span>
						{/if}
					{/each}
				</p>
			{/if}
		</header>

		{#if chapter.contents.length}
			<details class="toc">
				<summary>In this chapter</summary>
				<ol>
					{#each chapter.contents as s (s.id)}
						<li><a href="#{s.id}">{@html s.titleHtml}</a></li>
					{/each}
				</ol>
			</details>
		{/if}

		{#if chapter.roles.length}
			<Legend roles={chapter.roles} />
		{/if}

		{#each chapter.blocks as block, i (i)}
			{#if block.kind === 'html'}
				{@html block.html}
			{:else if block.kind === 'try'}
				{@const live = tutorialLive[block.id]}
				<section class="try" id="try-{block.id}" aria-label="Try it: {live.label}">
					<p class="try-title">Try it</p>
					{@html block.introHtml}
					<div class="try-figure"><live.component /></div>
				</section>
			{:else}
				{@const drawing = figureDrawing(block.image)}
				{@const image = figureImage(block.image)}
				<figure class="plate from-paper" id="paper-{block.id}">
					<div class={['art', { drawn: !!drawing }]}>
						{#if drawing}
							{@html drawing}
						{:else if image}
							<img src={image} alt="" />
						{/if}
					</div>
					<figcaption>
						<a class="label" href={resolve(`/paper/#${block.id}` as '/')}
							>The paper, Figure {block.number}.</a
						>
						{@html block.captionHtml}
					</figcaption>
				</figure>
			{/if}
		{/each}

		{#if chapter.referencesHtml}
			<section aria-label="References">
				<h2 class="references-title">References</h2>
				{@html chapter.referencesHtml}
			</section>
		{/if}

		{#if data.prev || data.next}
			<nav class="turn" aria-label="Previous and next chapter">
				{#if data.prev}
					<a class="prev" href={resolve(data.prev.href as '/')}
						><span class="dir">Previous</span><span>{data.prev.id} {data.prev.title}</span></a
					>
				{:else}<span></span>{/if}
				{#if data.next}
					<a class="next" href={resolve(data.next.href as '/')}
						><span class="dir">Next</span><span>{data.next.id} {data.next.title}</span></a
					>
				{/if}
			</nav>
		{:else}
			<nav class="turn" aria-label="Back to the tutorial">
				<a class="prev" href={resolve('/tutorial/' as '/')}
					><span class="dir">Back</span><span>All chapters of the tutorial</span></a
				>
			</nav>
		{/if}
	</article>
</div>

<SymbolCard {cards} />

<style>
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		padding: 0 var(--gutter) 6rem;
	}

	.contents {
		display: none;
	}

	article {
		width: 100%;
		max-width: 44rem;
		margin: 0 auto;
		font: 400 1.17rem/1.64 var(--font-serif);
		font-optical-sizing: auto;
	}

	@media (min-width: 1240px) {
		.layout {
			grid-template-columns: minmax(0, 1fr) minmax(0, 44rem) minmax(0, 1fr);
			column-gap: 3rem;
		}

		article {
			grid-column: 2;
			margin: 0;
		}

		.contents {
			display: block;
			grid-column: 1;
			justify-self: start;
			box-sizing: border-box;
			width: min(16rem, 100%);
			padding-left: clamp(0rem, 6vw - 4.5rem, 2.5rem);
			position: sticky;
			top: 4.5rem;
			align-self: start;
			margin-top: 5.2rem;
			max-height: calc(100vh - 6rem);
			overflow: auto;
			font-size: 0.82rem;
		}

		.toc {
			display: none;
		}
	}

	/* the contents: as the paper's, a hairline on the left, the place you are in the accent */
	.contents > p {
		margin: 0 0 0.7rem;
		font: italic 400 1rem/1.3 var(--font-serif);
		color: var(--text-dim);
	}

	.contents > p a {
		text-decoration: none;
	}

	.contents > p a:hover {
		color: var(--text);
	}

	.contents ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.parts {
		border-left: 1px solid var(--line);
	}

	.part,
	.ch,
	.sections a {
		display: flex;
		gap: 0.6rem;
		margin-left: -1px;
		border-left: 1px solid transparent;
		color: var(--text-dim);
		text-decoration: none;
		font: 400 0.92rem/1.35 var(--font-serif);
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.part {
		padding: 0.28rem 0 0.28rem 0.9rem;
	}

	.part span,
	.ch span {
		flex: none;
		min-width: 1.6em;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.current > .part {
		color: var(--text);
	}

	.chapters {
		margin: 0.1rem 0 0.4rem;
	}

	.ch {
		padding: 0.22rem 0 0.22rem 1.6rem;
		font-size: 0.88rem;
	}

	.ch span {
		min-width: 2.2em;
	}

	.ch.planned {
		color: var(--text-faint);
	}

	.ch.here {
		color: var(--text);
		border-left-color: var(--accent);
	}

	.ch.here span {
		color: var(--accent);
	}

	.sections a {
		padding: 0.2rem 0 0.2rem 3.35rem;
		font-size: 0.85rem;
	}

	.contents > p.this {
		margin: 1.4rem 0 0.5rem;
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--text-dim);
	}

	.this + .sections {
		border-left: 1px solid var(--line);
	}

	.this + .sections a {
		padding-left: 0.9rem;
	}

	.part:hover,
	.ch:is(a):hover,
	.sections a:hover {
		color: var(--text);
	}

	.sections a[aria-current='location'] {
		color: var(--text);
		border-left-color: var(--accent);
	}

	/* the chapter's header: the part, the number and title, the guiding question, what it builds on */
	header {
		margin: 4rem 0 1.6rem;
	}

	.kicker {
		margin: 0 0 0.8rem;
		font: italic 400 1.05rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.kicker a {
		text-decoration: none;
	}

	.kicker a:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	h1 {
		margin: 0 0 1rem;
		font: 400 clamp(2.2rem, 5.4vw, 3.3rem) / 1.06 var(--font-serif);
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	h1 .number {
		color: var(--text-faint);
		margin-right: 0.15em;
	}

	.question {
		margin: 0;
		font: italic 400 1.3rem/1.45 var(--font-serif);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.needs {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.45rem;
		margin: 1.4rem 0 0;
		font: 400 0.8rem/1.4 var(--font-sans);
	}

	.needs-label {
		margin-right: 0.3rem;
		font: italic 400 1rem/1.4 var(--font-serif);
		color: var(--text-dim);
	}

	.chip {
		display: inline-flex;
		gap: 0.35rem;
		padding: 0.15rem 0.65rem 0.2rem;
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		color: var(--text-dim);
		text-decoration: none;
	}

	.chip span {
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	a.chip:hover {
		color: var(--text);
		border-color: var(--accent);
	}

	.chip.planned {
		border-style: dashed;
	}

	/* on narrow screens the sections, which the rail lists on wide ones */
	.toc {
		margin: 0 0 1.2rem;
		font: 400 0.95rem/1.5 var(--font-serif);
	}

	.toc summary {
		cursor: pointer;
		width: fit-content;
		font-style: italic;
		color: var(--text-dim);
	}

	.toc ol {
		margin: 0.5rem 0 0;
		padding: 0.1rem 0 0.1rem 1.6rem;
		border-left: 1px solid var(--line);
	}

	.toc li {
		margin: 0.2rem 0;
	}

	.toc a {
		color: var(--text-dim);
		text-decoration: none;
	}

	.toc a:hover {
		color: var(--text);
	}

	/* try it: the interactive figure, on its own card */
	.try {
		margin: 2.4rem 0;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}

	.try-title {
		margin: 0 0 0.3rem !important;
		font: italic 500 1.06rem/1.4 var(--font-serif);
		color: var(--accent);
	}

	.try-figure {
		margin-top: 1rem;
	}

	/* the paper's figures, as the paper page shows them */
	.plate .art {
		padding: clamp(0.8rem, 2.5vw, 1.4rem);
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 12px;
	}

	.plate .art.drawn {
		padding: 0;
		background: none;
		border: 0;
	}

	.plate img {
		display: block;
		width: 100%;
		border-radius: 6px;
	}

	.plate :global(svg.drawing) {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 auto;
	}

	.plate figcaption a.label {
		text-decoration: none;
	}

	.plate figcaption a.label:hover {
		text-decoration: underline;
	}

	:global(:root[data-theme='dark'] .plate svg.drawing image.ink) {
		filter: invert(1);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light']) .plate svg.drawing image.ink) {
			filter: invert(1);
		}
	}

	.references-title {
		font-size: 1.3rem !important;
	}

	/* previous and next, at the foot */
	.turn {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 4rem;
		padding-top: 1.2rem;
		border-top: 1px solid var(--line);
	}

	.turn a {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		text-decoration: none;
		font: 400 1rem/1.35 var(--font-serif);
		color: var(--text);
	}

	.turn a:hover span:last-child {
		text-decoration: underline;
		text-decoration-thickness: 1px;
	}

	.turn .next {
		grid-column: 2;
		text-align: right;
	}

	.turn .dir {
		font: italic 400 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}
</style>
