<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Pdf01Icon } from '@hugeicons/core-free-icons';
	import { drawnFigures, figureImage, pictureFigures } from '#lib/paper/figures.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const paper = $derived(data.paper);

	/** The section being read: the last heading above a line a third of the way down. */
	let active = $state('');

	function followReading(article: HTMLElement) {
		const headings = Array.from(article.querySelectorAll<HTMLElement>('h2[id]'));
		let frame = 0;
		const update = () => {
			frame = 0;
			const line = innerHeight * 0.33;
			let current = '';
			for (const h of headings) {
				if (h.getBoundingClientRect().top <= line) current = h.id;
				else break;
			}
			active = current;
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		return () => {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(frame);
		};
	}
</script>

<svelte:head>
	<title>The Gravitational Camera · paper</title>
	<meta
		name="description"
		content="Working draft of the paper: what a camera would see if every pixel were a gravitational-wave detector."
	/>
</svelte:head>

<SiteHeader current="paper" />

<!-- The HTML below is produced at build time from this repository's own LaTeX
     source (paper/), never from visitors, so rendering it as HTML is safe. -->
<!-- eslint-disable svelte/no-at-html-tags -->
<div class="layout">
	<nav class="contents" aria-label="Contents">
		<p>Contents</p>
		<ol>
			{#each paper.contents as entry (entry.id)}
				<li>
					<a href="#{entry.id}" aria-current={active === entry.id ? 'location' : undefined}
						><span>{entry.number}</span>{@html entry.titleHtml}</a
					>
				</li>
			{/each}
		</ol>
	</nav>

	<article {@attach followReading}>
		<header>
			<p class="kicker">Working draft</p>
			<h1>{@html paper.title}</h1>
			{#if paper.authors.length}<p class="authors">{@html paper.authors.join(', ')}</p>{/if}
			<p class="date">{@html paper.date}</p>
			<!-- the PDF is built from the same LaTeX by the deploy workflow -->
			<a class="pdf" href="{resolve('/')}the-gravitational-camera.pdf" download>
				<HugeiconsIcon icon={Pdf01Icon} size={16} strokeWidth={1.8} /> PDF
			</a>
		</header>

		<section class="abstract" aria-label="Abstract">
			<h2>Abstract</h2>
			{@html paper.abstractHtml}
		</section>

		{#each paper.blocks as block, i (i)}
			{#if block.kind === 'html'}
				{@html block.html}
			{:else}
				{@const Picture = pictureFigures[block.id]}
				{@const Drawing = drawnFigures[block.id]}
				{@const image = figureImage(block.image)}
				<figure class="plate" id={block.id}>
					<div class="art">
						{#if Picture}
							<Picture poster={image} />
						{:else if Drawing}
							<Drawing />
						{:else if image}
							<img src={image} alt="" />
						{/if}
					</div>
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
</div>

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

	/* Wide screens: the text stays centred on the page and the contents sit in
	   the left margin. */
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
			justify-self: end;
			width: min(15rem, 100%);
			position: sticky;
			top: 4.5rem;
			align-self: start;
			margin-top: 5.2rem;
			max-height: calc(100vh - 6rem);
			overflow: auto;
			font-size: 0.82rem;
		}
	}

	.contents p {
		margin: 0 0 0.7rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.contents ol {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--line);
	}

	.contents a {
		display: flex;
		gap: 0.6rem;
		padding: 0.32rem 0 0.32rem 0.9rem;
		margin-left: -1px;
		border-left: 1px solid transparent;
		color: var(--text-dim);
		text-decoration: none;
		line-height: 1.35;
	}

	.contents a {
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.contents a:hover {
		color: var(--text);
	}

	.contents a[aria-current='location'] {
		color: var(--text);
		border-left-color: var(--accent);
	}

	.contents a[aria-current='location'] span {
		color: var(--accent);
	}

	.contents a span {
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
		min-width: 1.1em;
	}

	header {
		margin: 4rem 0 2.2rem;
	}

	.pdf {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		padding: 0.4rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font: 500 0.78rem/1 var(--font-sans);
		color: var(--text-dim);
		text-decoration: none;
	}

	.pdf:hover {
		color: var(--text);
		border-color: var(--line-strong);
	}

	.kicker {
		margin: 0 0 0.9rem;
		font: 600 0.72rem/1 var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h1 {
		margin: 0 0 1rem;
		font: 400 clamp(2.5rem, 6vw, 3.8rem) / 1.03 var(--font-serif);
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
		padding: 1.3rem 1.5rem 1.4rem;
		background: var(--bg-raised);
		border-radius: 10px;
		font-size: 1.04rem;
		line-height: 1.6;
	}

	.abstract h2 {
		margin: 0 0 0.5rem;
		font: 600 0.72rem/1 var(--font-sans);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.abstract :global(p) {
		margin: 0;
	}

	article :global(h2) {
		margin: 3.6rem 0 1rem;
		font: 500 1.7rem/1.2 var(--font-serif);
		letter-spacing: -0.01em;
		scroll-margin-top: 4.5rem;
		text-wrap: balance;
	}

	article :global(h2 .number) {
		color: var(--text-faint);
		margin-right: 0.35em;
	}

	article :global(h4.run-in) {
		margin: 2rem 0 -0.9rem;
		font: 600 0.76rem/1.4 var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	article :global(p) {
		margin: 1.15rem 0;
		text-wrap: pretty;
		hanging-punctuation: first;
	}

	article :global(.nowrap) {
		white-space: nowrap;
	}

	article :global(p.continued) {
		margin-top: 0.6rem;
	}

	article :global(ul) {
		margin: 1.1rem 0;
		padding-left: 1.3rem;
	}

	article :global(li) {
		margin: 0.5rem 0;
	}

	article :global(li p) {
		margin: 0;
	}

	/* the plain-language summaries */
	article :global(aside.plain) {
		margin: 1.4rem 0 1.8rem;
		padding: 1rem 1.3rem 1.05rem;
		border-left: 3px solid var(--accent);
		background: color-mix(in srgb, var(--accent) 9%, transparent);
		border-radius: 0 10px 10px 0;
		font: 400 1rem/1.58 var(--font-sans);
	}

	article :global(aside.plain p) {
		margin: 0;
	}

	article :global(aside.plain strong) {
		display: block;
		margin-bottom: 0.3rem;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	article :global(.equation) {
		margin: 1.2rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		font-size: 0.95em;
		scroll-margin-top: 5rem;
	}

	article :global(.katex) {
		font-size: 1.04em;
	}

	/* short inline formulas should not break across lines */
	article :global(p .katex),
	article :global(li .katex) {
		white-space: nowrap;
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
		margin: 2.6rem 0;
		scroll-margin-top: 4.5rem;
	}

	.plate .art {
		padding: clamp(0.8rem, 2.5vw, 1.4rem);
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 12px;
	}

	.plate img {
		display: block;
		width: 100%;
		border-radius: 6px;
	}

	article :global(figcaption) {
		margin-top: 0.8rem;
		font: 400 0.86rem/1.52 var(--font-sans);
		color: var(--text-dim);
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
		border-bottom-color: var(--line-strong);
	}

	/* small capitals for words only: maths keeps its letters (π is not Π) */
	article :global(th .katex) {
		text-transform: none;
		letter-spacing: 0;
		font-size: 1.25em;
	}

	article :global(th.right),
	article :global(td.right) {
		text-align: right;
		padding: 0.6rem 0 0.6rem 1rem;
		font-variant-numeric: tabular-nums;
	}

	article :global(th.center),
	article :global(td.center) {
		text-align: center;
	}

	/* the outer cells sit on the edges of the table, so its text is centred
	   between them */
	article :global(th:last-child),
	article :global(td:last-child) {
		padding-right: 0;
	}

	article :global(th.right:first-child),
	article :global(td.right:first-child) {
		padding-left: 0;
	}

	/* a table of numbers keeps its own width, centred in the column */
	article :global(figure.table.numeric table) {
		width: auto;
		margin-inline: auto;
	}

	article :global(figure.table.numeric th.right),
	article :global(figure.table.numeric td.right) {
		padding-left: clamp(0.7rem, 3vw, 1.6rem);
	}

	article :global(figure.table.numeric th.right:first-child),
	article :global(figure.table.numeric td.right:first-child) {
		padding-left: 0;
	}

	article :global(ol.references) {
		padding-left: 1.6rem;
		font: 400 0.86rem/1.5 var(--font-sans);
		color: var(--text-dim);
	}

	article :global(ol.references li) {
		margin: 0.5rem 0;
		scroll-margin-top: 5rem;
	}

	article :global(ol.references p) {
		margin: 0;
	}

	article :global(:target) {
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		outline: 6px solid color-mix(in srgb, var(--accent) 14%, transparent);
	}
</style>
