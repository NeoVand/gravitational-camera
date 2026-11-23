<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const total = $derived(data.parts.reduce((n, p) => n + p.chapters.length, 0));
	const ready = $derived(
		data.parts.reduce((n, p) => n + p.chapters.filter((c) => c.status === 'published').length, 0)
	);
</script>

<svelte:head>
	<title>Tutorial · Gravitational Camera</title>
	<meta
		name="description"
		content="A tutorial that leads from calculus, vectors and probability to every argument of the paper Gravitational Camera: A Thought Experiment."
	/>
</svelte:head>

<SiteHeader current="tutorial" />

<main>
	<header>
		<p class="kicker">Tutorial</p>
		<h1>From calculus to the gravitational camera</h1>
		<p class="lede">
			This tutorial leads to every argument and every equation of the paper. It starts from single
			and multivariable calculus, vectors and matrices, and basic probability, and it derives the
			rest. Each chapter answers one question that a scene of the paper raises, and each part ends
			by reading a section of the paper.
		</p>
		<p class="status">
			{ready
				? `${ready} of ${total} chapters are ready.`
				: `${total} chapters are planned; the first are being written.`}
			<a href={resolve('/tutorial/glossary/' as '/')}>Glossary</a> ({data.counts.terms} terms) ·
			<a href={resolve('/tutorial/symbols/' as '/')}>Symbols</a> ({data.counts.symbols})
		</p>
	</header>

	<section class="ledger" aria-labelledby="ledger">
		<h2 id="ledger">The equation ledger</h2>
		<p>
			How many of the paper's {data.ledger.equations} numbered equations a reader of the published chapters
			can derive: <strong>{data.ledger.derived} of {data.ledger.equations}</strong>.
		</p>
		<div
			class="bar"
			role="meter"
			aria-label="Equations of the paper derived so far"
			aria-valuemin={0}
			aria-valuemax={data.ledger.equations}
			aria-valuenow={data.ledger.derived}
		>
			<span style:width="{(100 * data.ledger.derived) / Math.max(1, data.ledger.equations)}%"
			></span>
		</div>
	</section>

	<section aria-labelledby="parts">
		<h2 id="parts">Parts and chapters</h2>
		<p class="key">
			A chapter whose number is in the accent is ready to read; the others are in preparation.
		</p>
		{#each data.parts as part (part.id)}
			<section class="part" id="part-{part.id}" aria-labelledby="part-{part.id}-title">
				<h3 id="part-{part.id}-title"><span class="number">Part {part.id}</span> {part.title}</h3>
				<ol>
					{#each part.chapters as c (c.id)}
						<li class={c.status}>
							<span class="id">{c.id}</span>
							{#if c.href}
								<a href={resolve(c.href as '/')}>{c.title}</a>
							{:else}
								<span class="title">{c.title}</span>
							{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</section>

	<section aria-labelledby="routes">
		<h2 id="routes">Routes</h2>
		<p class="key">
			Each route is the shortest path through the tutorial to one part of the paper, in the order to
			read it.
		</p>
		{#each data.routes as route (route.id)}
			<section class="route" id="route-{route.id}">
				<h3>{route.title}</h3>
				<ol class="steps">
					{#each route.chapters as c, i (c.id)}
						<li class={c.status}>
							{#if c.href}
								<a href={resolve(c.href as '/')} title={c.title}>{c.id}</a>
							{:else}
								<span title="{c.title} (in preparation)">{c.id}</span>
							{/if}{#if i < route.chapters.length - 1}<span class="sep" aria-hidden="true"
								></span>{/if}
						</li>
					{/each}
				</ol>
			</section>
		{/each}
	</section>
</main>

<style>
	main {
		max-width: 44rem;
		margin: 0 auto;
		padding: 0 var(--gutter) 6rem;
		box-sizing: content-box;
		font: 400 1.17rem/1.64 var(--font-serif);
	}

	header {
		margin: 4rem 0 2.6rem;
	}

	.kicker {
		margin: 0 0 0.8rem;
		font: italic 400 1.05rem/1.2 var(--font-serif);
		color: var(--accent);
	}

	h1 {
		margin: 0 0 1.2rem;
		font: 400 clamp(2.4rem, 6vw, 3.6rem) / 1.04 var(--font-serif);
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.lede {
		margin: 0;
		font-size: 1.22rem;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.status {
		margin: 1.2rem 0 0;
		font: 400 0.88rem/1.5 var(--font-sans);
		color: var(--text-faint);
	}

	.status a {
		color: var(--text-dim);
	}

	h2 {
		margin: 3.4rem 0 0.6rem;
		font: 500 1.7rem/1.2 var(--font-serif);
		letter-spacing: -0.01em;
		scroll-margin-top: 4.5rem;
	}

	.key {
		margin: 0 0 1.4rem;
		font-size: 1rem;
		color: var(--text-dim);
	}

	.ledger {
		padding-top: 0.2rem;
	}

	.ledger p {
		margin: 0 0 0.8rem;
		font-size: 1.02rem;
		color: var(--text-dim);
	}

	.ledger strong {
		color: var(--text);
		font-weight: 600;
	}

	.bar {
		height: 6px;
		border-radius: 3px;
		background: var(--bg-sunken);
		border: 1px solid var(--line);
		overflow: hidden;
	}

	.bar span {
		display: block;
		height: 100%;
		background: var(--accent);
	}

	.part {
		margin: 0 0 1.8rem;
		scroll-margin-top: 4.5rem;
	}

	h3 {
		margin: 0 0 0.5rem;
		font: 500 1.2rem/1.3 var(--font-serif);
	}

	h3 .number {
		margin-right: 0.35em;
		font-weight: 400;
		color: var(--text-faint);
	}

	.part ol {
		list-style: none;
		margin: 0;
		padding: 0 0 0 0.1rem;
		border-left: 1px solid var(--line);
	}

	.part li {
		display: flex;
		gap: 0.8rem;
		padding: 0.18rem 0 0.18rem 0.9rem;
		font-size: 0.98rem;
		line-height: 1.4;
	}

	.part .id {
		flex: none;
		min-width: 2.4em;
		font-variant-numeric: tabular-nums;
		color: var(--text-faint);
	}

	.part .planned .title,
	.part .draft .title {
		color: var(--text-dim);
	}

	.part .published .id {
		color: var(--accent);
	}

	.part a {
		text-decoration-thickness: 1px;
	}

	.route {
		margin: 0 0 1.6rem;
	}

	.steps {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		row-gap: 0.45rem;
		list-style: none;
		margin: 0;
		padding: 0;
		font: 400 0.78rem/1.4 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.steps li {
		display: inline-flex;
		align-items: center;
	}

	.steps li > :first-child {
		padding: 0.08rem 0.5rem 0.12rem;
		border: 1px dashed var(--line-strong);
		border-radius: 999px;
		color: var(--text-dim);
		text-decoration: none;
	}

	.steps .published > a {
		border-style: solid;
		border-color: var(--accent);
		color: var(--text);
	}

	.sep {
		width: 0.55rem;
		height: 1px;
		background: var(--line-strong);
	}
</style>
