<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { resolve } from '$app/paths';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import { ROLE_INFO } from '#lib/tutorial/colour.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Glossary · Tutorial · Gravitational Camera</title>
</svelte:head>

<SiteHeader current="tutorial" />

<!-- definitions from tutorial/glossary.yaml, rendered at build time -->
<!-- eslint-disable svelte/no-at-html-tags -->
<main>
	<header>
		<p class="kicker"><a href={resolve('/tutorial/' as '/')}>Tutorial</a></p>
		<h1>Glossary</h1>
		<p class="lede">
			Every term the tutorial defines, in a sentence or two, with the chapter that defines it in
			full.
		</p>
	</header>

	<dl>
		{#each data.terms as t (t.term)}
			<div class="entry" id="term-{t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
				<dt>
					{t.term}
					{#if t.role !== 'none'}<span class="role q-{t.role}">{ROLE_INFO[t.role].name}</span>{/if}
				</dt>
				<dd>
					<p>{@html t.definitionHtml}</p>
					<p class="where">
						{#if t.defined.href}
							<a href={resolve((t.defined.href + (t.anchor ? `#${t.anchor}` : '')) as '/')}
								>{t.defined.id} {t.defined.short}</a
							>
						{:else}
							{t.defined.id} {t.defined.short} <span class="planned">(in preparation)</span>
						{/if}
					</p>
				</dd>
			</div>
		{/each}
	</dl>
</main>

<style>
	main {
		max-width: 44rem;
		margin: 0 auto;
		padding: 0 var(--gutter) 6rem;
		box-sizing: content-box;
		font: 400 1.1rem/1.6 var(--font-serif);
	}

	header {
		margin: 4rem 0 2.4rem;
	}

	.kicker {
		margin: 0 0 0.8rem;
		font: italic 400 1.05rem/1.2 var(--font-serif);
		color: var(--accent);
	}

	.kicker a {
		text-decoration: none;
	}

	h1 {
		margin: 0 0 1rem;
		font: 400 clamp(2.4rem, 6vw, 3.4rem) / 1.04 var(--font-serif);
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0;
		color: var(--text-dim);
	}

	dl {
		margin: 0;
	}

	.entry {
		padding: 1rem 0;
		border-top: 1px solid var(--line);
	}

	dt {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		font: 500 1.2rem/1.3 var(--font-serif);
	}

	.role {
		font: 600 0.72rem/1 var(--font-sans);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	dd {
		margin: 0.3rem 0 0;
	}

	dd p {
		margin: 0;
	}

	.where {
		margin-top: 0.35rem !important;
		font: 400 0.82rem/1.4 var(--font-sans);
		color: var(--text-faint);
	}

	.where a {
		color: var(--accent);
		text-decoration: none;
	}
</style>
