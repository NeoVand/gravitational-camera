<script lang="ts">
	import { resolve } from '$app/paths';
	import { demos } from '#lib/demos/index.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
</script>

<svelte:head>
	<title>Demos · The Gravitational Camera</title>
	<meta
		name="description"
		content="Split-screen demos: ordinary light on one side, the gravitational camera on the other."
	/>
</svelte:head>

<SiteHeader current="demo" />

<main>
	<h1>Demos</h1>
	<p class="intro">
		Each demo shows one thing a gravitational camera could do that no camera using light ever will.
		One half of the picture is ordinary light, the other is gravity, and you move the line between
		them.
	</p>

	<ol>
		{#each demos as demo (demo.title)}
			<li class={{ soon: !demo.slug }}>
				<p class="affordance">{demo.affordance}</p>
				{#if demo.slug}
					<h2><a href={resolve(`/demo/${demo.slug}`)}>{demo.title}</a></h2>
				{:else}
					<h2>{demo.title} <span class="badge">planned</span></h2>
				{/if}
				<p>{demo.summary}</p>
			</li>
		{/each}
	</ol>
</main>

<style>
	main {
		max-width: 62rem;
		margin: 0 auto;
		padding: 1.2rem var(--gutter) 5rem;
	}

	h1 {
		margin: 3rem 0 1rem;
		font: 400 clamp(2.2rem, 5vw, 3.4rem) / 1.05 var(--font-serif);
		letter-spacing: -0.02em;
	}

	.intro {
		max-width: 40rem;
		margin: 0 0 3rem;
		color: var(--text-dim);
		font-size: 1.05rem;
		text-wrap: pretty;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		gap: 0;
		border-top: 1px solid var(--line);
	}

	li {
		padding: 1.5rem 1.5rem 1.7rem 0;
		border-bottom: 1px solid var(--line);
	}

	.affordance {
		margin: 0 0 0.5rem;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	li.soon .affordance {
		color: var(--text-faint);
	}

	h2 {
		margin: 0 0 0.5rem;
		font: 400 1.45rem/1.2 var(--font-serif);
	}

	h2 a {
		text-decoration-color: var(--accent);
	}

	li p:last-child {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	li.soon h2 {
		color: var(--text-dim);
	}

	.badge {
		font: 500 0.62rem/1 var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.3em 0.6em;
		vertical-align: middle;
		margin-left: 0.4em;
		white-space: nowrap;
	}
</style>
