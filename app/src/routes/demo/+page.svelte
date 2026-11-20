<script lang="ts">
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Clock01Icon,
		GalaxyIcon,
		Orbit01Icon,
		TemperatureIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import { demos } from '#lib/demos/index.js';
	import { posters } from '#lib/demos/posters.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';

	/** The demos fall into the paper's regimes, and the sky: each group is a section of the page. */
	const groups = [
		{
			regime: 'near field',
			name: 'The near field',
			line: 'Mass itself, through any wall.',
			icon: Orbit01Icon
		},
		{
			regime: 'thermal',
			name: 'The thermal glow',
			line: 'Warm matter glows, and nothing blocks the glow of what lies behind.',
			icon: TemperatureIcon
		},
		{
			regime: 'waves',
			name: 'Waves from motion',
			line: 'Every moving thing is a point, and its waves say which way it turns.',
			icon: WavesIcon
		},
		{
			regime: 'sky',
			name: 'The sky',
			line: 'The same equations at the largest scales.',
			icon: GalaxyIcon
		}
	] as const;
</script>

<svelte:head>
	<title>Demos · Gravitational Camera</title>
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

	{#each groups as group (group.regime)}
		<section aria-labelledby="group-{group.regime.replace(' ', '-')}">
			<h2 id="group-{group.regime.replace(' ', '-')}">
				<HugeiconsIcon icon={group.icon} size={22} strokeWidth={1.4} />
				<span>{group.name}</span>
			</h2>
			<p class="line">{group.line}</p>
			<ol>
				{#each demos.filter((d) => d.regime === group.regime) as demo (demo.title)}
					<li>
						{#if demo.slug}
							<a class="demo" href={resolve(`/demo/${demo.slug}`)}>
								<img src={posters[demo.slug]} alt="" loading="lazy" width="1280" height="720" />
								<h3>{demo.title}</h3>
								<p class="summary"><em>{demo.affordance}.</em> {demo.summary}</p>
							</a>
						{:else}
							<div class="demo soon">
								<span class="empty">
									<HugeiconsIcon icon={Clock01Icon} size={20} strokeWidth={1.4} />
									<span>In progress</span>
								</span>
								<h3>{demo.title}</h3>
								<p class="summary"><em>{demo.affordance}.</em> {demo.summary}</p>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/each}
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
		margin: 0;
		color: var(--text-dim);
		font-size: 1.2rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	section {
		margin-top: clamp(3.5rem, 8vh, 5.5rem);
	}

	h2 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font: 400 clamp(1.6rem, 2.6vw, 2.1rem) / 1.15 var(--font-serif);
	}

	h2 :global(svg) {
		flex: none;
		color: var(--accent);
	}

	.line {
		margin: 0.35rem 0 1.6rem;
		color: var(--text-dim);
		font-style: italic;
		font-size: 1.1rem;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 2.6rem 1.8rem;
	}

	.demo {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	img,
	.empty {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 3px;
		background: var(--bg-sunken);
	}

	.empty {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 0.4rem;
		color: var(--text-faint);
		font-style: italic;
	}

	h3 {
		margin: 0.9rem 0 0.3rem;
		font: 400 1.4rem/1.2 var(--font-serif);
	}

	a.demo:hover h3 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	a.demo:focus-visible {
		outline: none;
	}

	a.demo:focus-visible img {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.soon h3 {
		color: var(--text-dim);
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
