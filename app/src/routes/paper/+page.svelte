<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { resolve } from '$app/paths';
	import { figureImage, liveFigures } from '#lib/paper/figures.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const paper = $derived(data.paper);
</script>

<svelte:head>
	<title>The Gravitational Camera · paper</title>
	<meta
		name="description"
		content="Working draft of the paper: what a camera would see if every pixel were a gravitational-wave detector."
	/>
</svelte:head>

<!-- The HTML below is produced at build time from this repository's own LaTeX
     source (paper/), never from visitors, so rendering it as HTML is safe. -->
<!-- eslint-disable svelte/no-at-html-tags -->
<main>
	<a class="home" href={resolve('/')}>← The Gravitational Camera</a>

	<article>
		<header>
			<h1>{@html paper.title}</h1>
			{#if paper.authors.length}<p class="authors">{@html paper.authors.join(', ')}</p>{/if}
			<p class="date">{@html paper.date}</p>
		</header>

		<section class="abstract" aria-label="Abstract">
			{@html paper.abstractHtml}
		</section>

		{#each paper.blocks as block, i (i)}
			{#if block.kind === 'html'}
				{@html block.html}
			{:else}
				{@const Live = liveFigures[block.id]}
				{@const image = figureImage(block.image)}
				<figure class="plate" id={block.id}>
					{#if Live}
						<Live poster={image} />
					{:else if image}
						<img src={image} alt="" />
					{/if}
					<figcaption>
						<span class="label">Figure {block.number}.</span>
						{@html block.captionHtml}
					</figcaption>
				</figure>
			{/if}
		{/each}

		{#if paper.footnotesHtml}
			<section class="notes" aria-label="Footnotes">{@html paper.footnotesHtml}</section>
		{/if}

		{#if paper.referencesHtml}
			<section aria-label="References">
				<h2>References</h2>
				{@html paper.referencesHtml}
			</section>
		{/if}
	</article>
</main>

<style>
	main {
		padding: 1.2rem var(--gutter) 6rem;
	}

	.home {
		font-size: 0.8rem;
		color: var(--text-dim);
		text-decoration: none;
	}

	.home:hover {
		color: var(--text);
	}

	article {
		max-width: 44rem;
		margin: 0 auto;
		font: 400 1.16rem/1.62 var(--font-serif);
		font-optical-sizing: auto;
	}

	header {
		margin: 4.5rem 0 2.5rem;
	}

	h1 {
		margin: 0 0 1rem;
		font: 400 clamp(2.4rem, 6vw, 3.6rem) / 1.04 var(--font-serif);
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.authors,
	.date {
		margin: 0;
		font: 400 0.9rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}

	.abstract {
		margin: 0 0 3rem;
		padding: 1.3rem 0;
		border-block: 1px solid var(--line);
		font-size: 1.06rem;
		color: var(--text);
	}

	.abstract :global(p) {
		margin: 0;
	}

	article :global(h2) {
		margin: 3.2rem 0 0.9rem;
		font: 500 1.55rem/1.2 var(--font-serif);
		letter-spacing: -0.01em;
	}

	article :global(h2 .number) {
		color: var(--text-faint);
		margin-right: 0.35em;
	}

	article :global(h4.run-in) {
		margin: 1.6rem 0 -1.1rem;
		font: 600 0.78rem/1.4 var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	article :global(p) {
		margin: 1.15rem 0;
		text-wrap: pretty;
		hanging-punctuation: first;
	}

	article :global(p.continued) {
		margin-top: 0.6rem;
	}

	article :global(.equation) {
		margin: 1.1rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		font-size: 0.95em;
		scroll-margin-top: 4rem;
	}

	article :global(.katex) {
		font-size: 1.04em;
	}

	article :global(a.xref),
	article :global(.cite a) {
		text-decoration: none;
		color: var(--accent);
	}

	article :global(.cite) {
		font: 400 0.82em var(--font-sans);
		white-space: nowrap;
	}

	article :global(figure) {
		margin: 2.4rem 0;
	}

	.plate {
		margin-inline: clamp(-8rem, calc((44rem - 100vw) / 2 + var(--gutter)), 0rem);
	}

	.plate img {
		display: block;
		width: 100%;
		border-radius: 6px;
	}

	article :global(figcaption) {
		margin-top: 0.8rem;
		font: 400 0.84rem/1.5 var(--font-sans);
		color: var(--text-dim);
		max-width: 44rem;
		margin-inline: auto;
	}

	article :global(figcaption .label) {
		color: var(--text);
		font-weight: 600;
	}

	article :global(figcaption .katex) {
		font-size: 1em;
	}

	article :global(figure.table) {
		overflow-x: auto;
	}

	article :global(table) {
		width: 100%;
		border-collapse: collapse;
		font: 400 0.9rem/1.45 var(--font-sans);
	}

	article :global(th),
	article :global(td) {
		text-align: left;
		vertical-align: top;
		padding: 0.6rem 1rem 0.6rem 0;
		border-bottom: 1px solid var(--line);
	}

	article :global(th) {
		font-weight: 600;
		color: var(--text-dim);
		font-size: 0.74rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	article :global(ol.references) {
		padding-left: 1.6rem;
		font: 400 0.86rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}

	article :global(ol.references li) {
		margin: 0.5rem 0;
		scroll-margin-top: 4rem;
	}

	article :global(ol.references p) {
		margin: 0;
	}

	article :global(:target) {
		background: rgb(232 164 90 / 0.12);
		outline: 6px solid rgb(232 164 90 / 0.12);
	}
</style>
