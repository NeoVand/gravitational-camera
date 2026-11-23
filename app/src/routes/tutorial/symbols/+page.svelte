<script lang="ts">
	import 'katex/dist/katex.min.css';
	import { resolve } from '$app/paths';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import Legend from '#lib/tutorial/Legend.svelte';
	import { ROLE_INFO } from '#lib/tutorial/colour.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Symbols · Tutorial · Gravitational Camera</title>
</svelte:head>

<SiteHeader current="tutorial" />

<!-- symbols from tutorial/symbols.yaml, rendered at build time -->
<!-- eslint-disable svelte/no-at-html-tags -->
<main>
	<header>
		<p class="kicker"><a href={resolve('/tutorial/' as '/')}>Tutorial</a></p>
		<h1>Symbols</h1>
		<p class="lede">
			Every symbol a chapter lets you click for its card, in the colour of its kind, with the
			chapter that defines it. The tutorial writes them as the paper does.
		</p>
	</header>

	<Legend open />

	<ul class="symbols">
		{#each data.symbols as s (s.key)}
			<li id="symbol-{s.key}">
				<span class="glyph">{@html s.html}</span>
				<div class="body">
					<p class="title">
						{s.title}
						{#if s.role !== 'none'}<span class="role q-{s.role}">{ROLE_INFO[s.role].name}</span
							>{/if}
					</p>
					<p class="kind">{s.kind}</p>
					<p class="meaning">{@html s.meaningHtml}</p>
					<p class="where">
						{#if s.defined.href}
							<a href={resolve((s.defined.href + (s.anchor ? `#${s.anchor}` : '')) as '/')}
								>{s.defined.id} {s.defined.short}</a
							>
						{:else}
							{s.defined.id} {s.defined.short} <span>(in preparation)</span>
						{/if}
					</p>
				</div>
			</li>
		{/each}
	</ul>
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
		margin: 4rem 0 1.4rem;
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

	.symbols {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.symbols li {
		display: grid;
		grid-template-columns: 4.5rem minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem 0;
		border-top: 1px solid var(--line);
	}

	.glyph {
		font-size: 1.5rem;
		text-align: center;
		padding-top: 0.1rem;
	}

	p {
		margin: 0;
	}

	.title {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		font: 500 1.15rem/1.3 var(--font-serif);
	}

	.role {
		font: 600 0.72rem/1 var(--font-sans);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.kind {
		margin-top: 0.15rem;
		font: italic 400 0.98rem/1.4 var(--font-serif);
		color: var(--text-faint);
	}

	.meaning {
		margin-top: 0.35rem;
	}

	.where {
		margin-top: 0.35rem;
		font: 400 0.82rem/1.4 var(--font-sans);
		color: var(--text-faint);
	}

	.where a {
		color: var(--accent);
		text-decoration: none;
	}
</style>
