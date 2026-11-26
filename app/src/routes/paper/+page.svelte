<script lang="ts">
	import 'katex/dist/katex.min.css';
	import '#lib/paper/prose.css';
	import { onDestroy } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Pdf01Icon, PlayCircleIcon } from '@hugeicons/core-free-icons';
	import { figureDemos, figureDrawing, figureImage, liveFigures } from '#lib/paper/figures.js';
	import { fitEquations, followHeadings } from '#lib/paper/reading.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import PaperMargin from '#lib/tutorial/PaperMargin.svelte';
	import PaperGlosses from '#lib/paper/PaperGlosses.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const paper = $derived(data.paper);

	/** The article, for the tutorial's notes in the right margin to find their anchors in. */
	let article: HTMLElement | undefined = $state();
	const holdArticle = (el: HTMLElement) => {
		article = el;
		return () => (article = undefined);
	};

	/** The section being read: the last heading above a line a third of the way down. */
	let active = $state('');
	/** Which live figures' panels are open: the drawn ones are only made, and set running, when they are. */
	let opened: Record<string, boolean> = $state({});

	/** Where the drawn live figures the reader has opened are remembered, for the length of the visit. */
	const OPENED_KEY = 'paper:opened-live';

	function saveOpened() {
		const ids = Object.keys(opened).filter(
			(id) => opened[id] && liveFigures[id] && !('picture' in liveFigures[id])
		);
		try {
			sessionStorage.setItem(OPENED_KEY, JSON.stringify(ids));
		} catch {
			// storage may be blocked; the figures then simply open closed
		}
	}

	function restoreOpened() {
		let ids: unknown = [];
		try {
			ids = JSON.parse(sessionStorage.getItem(OPENED_KEY) ?? '[]');
		} catch {
			// as above
		}
		if (!Array.isArray(ids)) return;
		for (const id of ids) if (typeof id === 'string' && id in liveFigures) opened[id] = true;
	}

	/** A figure's link to its full-screen page, which names the figure so that the page can send the reader back to it. */
	const from = (id: string) => `?from=${encodeURIComponent(id)}`;

	/**
	 * Before a link from a figure to its full-screen page is followed, the paper's
	 * own history entry is made to point at that figure, so that Back returns to it.
	 * The router keeps its bookkeeping in history.state, which is carried over
	 * unchanged; only the address gains the figure's hash.
	 */
	function rememberPlace(article: HTMLElement) {
		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
			if (!(link instanceof HTMLAnchorElement)) return;
			if (link.target && link.target !== '_self') return;
			const url = new URL(link.href);
			const figure = url.searchParams.get('from');
			if (url.origin !== location.origin || !figure || !document.getElementById(figure)) return;
			const here = `${location.href.split('#')[0]}#${figure}`;
			if (here !== location.href) history.replaceState(history.state, '', here);
		};
		article.addEventListener('click', onClick);
		return () => article.removeEventListener('click', onClick);
	}

	let stopSettling = () => {};

	/**
	 * Brings the element with this id to the top of the window and keeps it
	 * there while the page above it settles (fonts, equations, live figures
	 * being made), until the reader scrolls, types or clicks, or a few seconds pass.
	 */
	function settleAt(id: string) {
		stopSettling();
		const target = document.getElementById(id);
		if (!target) return;
		let settled = false;
		const place = () => {
			if (!settled) target.scrollIntoView({ block: 'start', behavior: 'instant' });
		};
		const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
		const watch = new ResizeObserver(place);
		const stop = () => {
			settled = true;
			watch.disconnect();
			clearTimeout(timer);
			for (const type of inputs) removeEventListener(type, stop, true);
		};
		const timer = setTimeout(stop, 4000);
		for (const type of inputs) addEventListener(type, stop, { capture: true, passive: true });
		stopSettling = stop;
		watch.observe(target.closest('article') ?? document.body);
		document.fonts?.ready.then(place);
		place();
	}

	// Arriving at the paper with a hash, by a link, a reload or Back from a
	// full-screen figure: the figures the reader had opened open again, and the
	// target is held in view while the page settles. Moves within the paper are
	// left to the browser.
	afterNavigate((navigation) => {
		if (navigation.type !== 'enter' && navigation.from?.route.id === navigation.to?.route.id)
			return;
		const id = decodeURIComponent(location.hash.slice(1));
		if (!id) return;
		restoreOpened();
		settleAt(id);
	});

	onDestroy(() => stopSettling());

	const followReading = followHeadings('h2[id]', (id) => (active = id));
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

	<article
		class="paper prose"
		{@attach holdArticle}
		{@attach followReading}
		{@attach fitEquations}
		{@attach rememberPlace}
	>
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
							open={opened[block.id] ?? 'picture' in live}
							ontoggle={(e) => {
								opened[block.id] = e.currentTarget.open;
								if (!('picture' in live)) saveOpened();
							}}
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
								? resolve(`/figures/${demo.slug}/${from(block.id)}` as '/figures/four-stars')
								: resolve(`/demo/${demo.slug}/${from(block.id)}` as '/demo/black-hole')}
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

	{#if data.margin.length || data.sideNotes.length}
		<PaperMargin notes={data.margin} {article} sideNotes={data.sideNotes} />
	{/if}
	{#if data.glosses.length}
		<PaperGlosses {article} cards={data.glosses} />
	{/if}
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

	/* Wide screens: the text stays centred in the window and the contents sit at
	   the window's left side, set in from the edge a little more as the window widens. */
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
			width: min(15rem, 100%);
			padding-left: clamp(0rem, 6vw - 4.5rem, 2.5rem);
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

	/* the summary line of the live version of a figure, as that of a plain-words box (prose.css) */
	.live > summary {
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

	.live > summary::-webkit-details-marker {
		display: none;
	}

	/* the disclosure mark: a small chevron in the accent, pointing right when closed, down when open */
	.live > summary::before {
		content: '';
		flex: none;
		width: 0.36em;
		height: 0.36em;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: translateY(-0.12em) rotate(-45deg);
		transition: transform 0.15s ease;
	}

	.live[open] > summary::before {
		transform: translateY(-0.22em) rotate(45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.live > summary::before {
			transition: none;
		}
	}

	.live > summary:focus-visible {
		outline: 1px solid var(--accent);
		outline-offset: 3px;
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

	/* The live version of a figure: its own card (that of the interactive
	   figures, of the live scenes, or of the drawn figures in figure.css) is its
	   only frame, and it spans the figure's full width, on the caption's left edge. */
	.live {
		margin-top: 0.7rem;
	}

	.live > summary {
		width: fit-content;
		font: italic 500 1.06rem/1.6 var(--font-serif);
	}

	.plate .live .art {
		margin-top: 0.6rem;
		padding: 0;
		background: none;
		border: 0;
		border-radius: 0;
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
</style>
