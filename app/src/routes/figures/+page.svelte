<script lang="ts">
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { BookOpen01Icon } from '@hugeicons/core-free-icons';
	import { figures } from '#lib/figures/index.js';
	import { posters } from '#lib/demos/posters.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
</script>

<svelte:head>
	<title>Interactive figures · Gravitational Camera</title>
	<meta
		name="description"
		content="The paper's results on what one gravitational pixel measures, as figures to explore."
	/>
</svelte:head>

<SiteHeader current="figures" />

<main>
	<h1>Interactive figures</h1>
	<p class="intro">
		What a single pixel of the camera measures, from the paper’s Section VIII, and what a tide
		applied from outside reveals, from its Section XIII, as figures to explore. These are diagrams
		of the results, not views through the camera; those of Section VIII also appear under their
		figures in the <a href={resolve('/paper')}
			><HugeiconsIcon icon={BookOpen01Icon} size={17} strokeWidth={1.5} />online paper</a
		>.
	</p>

	<ol>
		{#each figures as f (f.slug)}
			<li>
				<a class="figure" href={resolve(`/figures/${f.slug}` as '/figures/four-stars')}>
					<img src={posters[f.slug]} alt="" loading="lazy" width="1280" height="720" />
					<h2>{f.title}</h2>
					<p class="summary"><em>{f.affordance}.</em> {f.summary}</p>
				</a>
			</li>
		{/each}
	</ol>
</main>

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: 1.2rem var(--gutter) 6rem;
		font-family: var(--font-serif);
	}

	h1 {
		margin: 3rem 0 1rem;
		font: 300 clamp(2.6rem, 6vw, 4.2rem) / 1 var(--font-serif);
		font-variation-settings: 'opsz' 72;
		letter-spacing: -0.02em;
	}

	.intro {
		max-width: 40rem;
		margin: 0 0 3rem;
		color: var(--text-dim);
		font-size: 1.2rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.intro a {
		color: var(--text);
		white-space: nowrap;
	}

	.intro a :global(svg) {
		display: inline;
		margin-right: 0.25em;
		vertical-align: -0.15em;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 2.6rem 1.8rem;
	}

	.figure {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 3px;
		background: var(--bg-sunken);
	}

	h2 {
		margin: 0.9rem 0 0.3rem;
		font: 400 1.4rem/1.2 var(--font-serif);
	}

	a.figure:hover h2 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	a.figure:focus-visible {
		outline: none;
	}

	a.figure:focus-visible img {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.summary {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.summary em {
		color: var(--text);
	}
</style>
