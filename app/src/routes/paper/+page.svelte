<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Pdf01Icon, PlayCircleIcon } from '@hugeicons/core-free-icons';
	import { figureDemos, figureDrawing, figureImage, liveFigures } from '#lib/paper/figures.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const paper = $derived(data.paper);

	/** The section being read: the last heading above a line a third of the way down. */
	let active = $state('');
	/** Which live figures' panels are open: the drawn ones are only made, and set running, when they are. */
	let opened: Record<string, boolean> = $state({});

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

	/**
	 * Shrinks each display equation that is wider than the column until it fits
	 * (down to 60% of its size; beyond that it scrolls sideways), so that on a
	 * phone no equation runs under its number or off the screen.
	 */
	function fitEquations(article: HTMLElement) {
		const fit = () => {
			for (const eq of article.querySelectorAll<HTMLElement>('.equation')) {
				eq.style.removeProperty('--fit');
				eq.classList.remove('wide');
				const html = eq.querySelector<HTMLElement>('.katex-html');
				if (!html) continue;
				// the body is centred and the number sits at the right edge, so a
				// body that clears the number on both sides needs the number's width twice
				let body = 0;
				let tag = 0;
				for (const part of Array.from(html.children)) {
					const width = part.getBoundingClientRect().width;
					if (part.matches('.tag, .katex-tag')) tag = width;
					else body += width;
				}
				const need = body + 2 * tag + 8;
				const room = eq.clientWidth;
				if (need <= room) continue;
				const scale = room / need;
				eq.style.setProperty('--fit', String(Math.max(0.6, scale)));
				// too wide even at that size: the number follows the body, and both scroll
				if (scale < 0.6) eq.classList.add('wide');
			}
		};
		fit();
		const watch = new ResizeObserver(fit);
		watch.observe(article);
		document.fonts?.ready.then(fit);
		return () => watch.disconnect();
	}
</script>

<svelte:head>
	<title>Paper · Gravitational Camera: a thought experiment</title>
	<meta
		name="description"
		content="Working draft of the paper: what a camera would see if every pixel were a gravitational-wave detector."
	/>
	<meta name="author" content={paper.authors.join(', ')} />
	<!-- for scholarly search engines -->
	<meta name="citation_title" content={paper.title} />
	{#each paper.authors as author (author)}
		<meta name="citation_author" content={author} />
	{/each}
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

	<article class="paper" {@attach followReading} {@attach fitEquations}>
		<header>
			<p class="kicker">Working draft</p>
			<h1>{@html paper.title}</h1>
			{#if paper.authors.length}<p class="authors">{@html paper.authors.join(', ')}</p>{/if}
			<p class="date">{@html paper.date}</p>
			<!-- the PDF is built from the same LaTeX by the deploy workflow -->
			<a class="pdf" href="{resolve('/')}gravitational-camera.pdf" download>
				<HugeiconsIcon icon={Pdf01Icon} size={18} strokeWidth={1.6} /> Download the PDF
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
				{@const live = liveFigures[block.id]}
				{@const demo = figureDemos[block.id]}
				{@const drawing = figureDrawing(block.image)}
				{@const image = figureImage(block.image)}
				<figure class="plate" id={block.id}>
					<div class="art">
						{#if drawing}
							{@html drawing}
						{:else if image}
							<img src={image} alt="" />
						{/if}
					</div>
					{#if live}
						<details
							class="live"
							open={'picture' in live}
							ontoggle={(e) => (opened[block.id] = e.currentTarget.open)}
						>
							<summary>{live.label}</summary>
							<div class="art">
								{#if 'picture' in live}
									<live.picture poster={image} />
								{:else if opened[block.id]}
									<live.drawing />
								{/if}
							</div>
						</details>
					{/if}
					{#if demo}
						<a
							class="demo-link"
							href={demo.section === 'figures'
								? resolve(`/figures/${demo.slug}` as '/figures/four-stars')
								: resolve(`/demo/${demo.slug}` as '/demo/black-hole')}
						>
							<HugeiconsIcon icon={PlayCircleIcon} size={15} strokeWidth={1.8} />
							{demo.label}
						</a>
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
		font: italic 400 1rem/1.3 var(--font-serif);
		color: var(--text-dim);
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
		font: 400 0.95rem/1.35 var(--font-serif);
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
		gap: 0.45rem;
		margin-top: 1.1rem;
		font: italic 400 1.05rem/1 var(--font-serif);
		color: var(--text-dim);
		text-decoration: none;
	}

	.pdf:hover {
		color: var(--text);
	}

	.pdf:hover :global(span),
	.pdf:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}

	.kicker {
		margin: 0 0 0.8rem;
		font: italic 400 1.05rem/1.2 var(--font-serif);
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
		font: 400 1.05rem/1.5 var(--font-serif);
		color: var(--text-dim);
	}

	/* the abstract, set apart by a rule and its own heading, not a box */
	.abstract {
		margin: 0 0 3rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--line);
		font-size: 1.04rem;
		line-height: 1.6;
	}

	.abstract h2 {
		margin: 0 0 0.5rem;
		font: italic 400 1.05rem/1.3 var(--font-serif);
		color: var(--text-dim);
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

	/* the paper's run-in paragraph heads, in italic as a journal sets them */
	article :global(h4.run-in) {
		margin: 2rem 0 -0.9rem;
		font: italic 500 1.08rem/1.4 var(--font-serif);
		color: var(--text);
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

	/* the plain-language summaries: a hairline in the accent, no box; closed until asked for */
	article :global(details.plain) {
		margin: 1.4rem 0 1.8rem;
		padding: 0.15rem 0 0.2rem 1.25rem;
		border-left: 1px solid var(--accent);
		font: 400 1.06rem/1.6 var(--font-serif);
		color: var(--text-dim);
	}

	article :global(details.plain > summary) {
		display: flex;
		align-items: baseline;
		gap: 0.5em;
		list-style: none;
		cursor: pointer;
		font-style: italic;
		font-weight: 500;
		color: var(--accent);
		border-radius: 2px;
	}

	article :global(details.plain > summary::-webkit-details-marker) {
		display: none;
	}

	/* the disclosure mark: a small chevron in the accent, pointing right when closed, down when open */
	article :global(details.plain > summary::before) {
		content: '';
		flex: none;
		width: 0.36em;
		height: 0.36em;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-0.12em) rotate(-45deg);
		transition: transform 0.15s ease;
	}

	article :global(details.plain[open] > summary::before) {
		transform: translateY(-0.22em) rotate(45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		article :global(details.plain > summary::before) {
			transition: none;
		}
	}

	article :global(details.plain > summary:focus-visible) {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
	}

	article :global(details.plain[open] > summary) {
		margin-bottom: 0.4rem;
	}

	article :global(details.plain p) {
		margin: 0;
	}

	article :global(details.plain p + p) {
		margin-top: 0.6rem;
	}

	article :global(details.plain ul) {
		margin: 0.6rem 0;
		padding-left: 1.2rem;
	}

	article :global(details.plain li) {
		margin: 0;
		font: inherit;
		color: inherit;
	}

	article :global(details.plain li + li) {
		margin-top: 0.25rem;
	}

	article :global(details.plain > :last-child) {
		margin-bottom: 0;
	}

	/* inside the summaries bold marks defined terms and run-in lead phrases */
	article :global(details.plain strong) {
		font-weight: 600;
		color: var(--text);
	}

	/* the summaries' outside links: the text's own colour, a hairline underline in the accent */
	article :global(details.plain a[href^='http']) {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
	}

	article :global(details.plain a[href^='http']:hover),
	article :global(details.plain a[href^='http']:focus-visible) {
		color: var(--accent);
	}

	article :global(.equation) {
		margin: 1.2rem 0;
		overflow-x: auto;
		overflow-y: hidden;
		font-size: calc(0.95em * var(--fit, 1));
		scroll-margin-top: 5rem;
	}

	article :global(.katex) {
		font-size: 1.04em;
	}

	article :global(.equation.wide .katex-display > .katex) {
		text-align: left;
	}

	article :global(.equation.wide .katex-html) {
		white-space: nowrap;
	}

	article :global(.equation.wide .katex-html > .tag),
	article :global(.equation.wide .katex-html > .katex-tag) {
		position: static;
		margin-left: 1.2em;
	}

	/* short inline formulas should not break across lines */
	article :global(p .katex),
	article :global(li .katex) {
		white-space: nowrap;
	}

	/* on a phone a long one may, at its operators, rather than run off the screen */
	@media (max-width: 640px) {
		article :global(p .katex),
		article :global(li .katex),
		article :global(.nowrap) {
			white-space: normal;
		}
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

	/* the paper's drawings sit on the page itself, as in print, and shrink to
	   the width of the column; on a phone they can be pinched to enlarge */
	.plate .art:has(> :global(svg.drawing)) {
		padding: 0;
		background: none;
		border: 0;
	}

	.plate :global(svg.drawing) {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 auto;
	}

	/* engraved objects are black ink on transparency: on the dark theme the ink turns light */
	:global(:root[data-theme='dark'] svg.drawing image.ink) {
		filter: invert(1);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light']) svg.drawing image.ink) {
			filter: invert(1);
		}
	}

	/* a long page of reading at night wants a darker ground than the pictures' umber */
	:global(:root[data-theme='dark']:has(article.paper)) {
		--bg: #18120c;
		--bg-raised: #21190f;
		--bg-sunken: #110d08;
	}

	@media (prefers-color-scheme: dark) {
		:global(:root:not([data-theme='light']):has(article.paper)) {
			--bg: #18120c;
			--bg-raised: #21190f;
			--bg-sunken: #110d08;
		}
	}

	.live {
		margin-top: 0.7rem;
	}

	.demo-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.7rem;
		font: 500 0.8rem/1.4 var(--font-sans);
		color: var(--accent);
		text-decoration: none;
	}

	.demo-link:hover {
		text-decoration: underline;
	}

	.live summary {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		font: 500 0.8rem/1.4 var(--font-sans);
		color: var(--accent);
		list-style: none;
	}

	.live summary::-webkit-details-marker {
		display: none;
	}

	.live summary::before {
		content: '▸';
		transition: transform 0.15s;
	}

	.live[open] summary::before {
		transform: rotate(90deg);
	}

	.live .art {
		margin-top: 0.6rem;
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
		font-weight: 500;
		font-style: italic;
		color: var(--text-dim);
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

	/* where a link has just taken you: the number in the accent, no band */
	article :global(:target .number),
	article :global(.equation:target .katex-tag) {
		color: var(--accent);
	}
</style>
