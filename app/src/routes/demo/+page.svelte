<script lang="ts">
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Clock01Icon,
		GalaxyIcon,
		Orbit01Icon,
		PlayIcon,
		Target02Icon,
		TemperatureIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import { demos } from '#lib/demos/index.js';
	import { posters } from '#lib/demos/posters.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';

	const regimeIcons = {
		'one pixel': Target02Icon,
		'near field': Orbit01Icon,
		thermal: TemperatureIcon,
		waves: WavesIcon,
		sky: GalaxyIcon
	};
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

	<ol>
		{#each demos as demo (demo.title)}
			<li>
				{#if demo.slug}
					<a class="card" href={resolve(`/demo/${demo.slug}`)}>
						<div class="thumb">
							<img src={posters[demo.slug]} alt="" loading="lazy" />
							<span class="play" aria-hidden="true">
								<HugeiconsIcon icon={PlayIcon} size={18} strokeWidth={2} />
							</span>
						</div>
						{@render text(demo)}
					</a>
				{:else}
					<div class="card soon">
						<div class="thumb empty">
							<HugeiconsIcon icon={Clock01Icon} size={20} strokeWidth={1.6} />
							<span>In progress</span>
						</div>
						{@render text(demo)}
					</div>
				{/if}
			</li>
		{/each}
	</ol>
</main>

{#snippet text(demo: (typeof demos)[number])}
	<div class="text">
		<p class="meta">
			<span class="affordance">{demo.affordance}</span>
			<span class="regime">
				<HugeiconsIcon icon={regimeIcons[demo.regime]} size={13} strokeWidth={1.8} />
				{demo.regime}
			</span>
		</p>
		<h2>{demo.title}</h2>
		<p class="summary">{demo.summary}</p>
	</div>
{/snippet}

<style>
	main {
		max-width: 72rem;
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
		margin: 0 0 2.8rem;
		color: var(--text-dim);
		font-size: 1.05rem;
		text-wrap: pretty;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 2.2rem 1.6rem;
	}

	.card {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.thumb {
		position: relative;
		aspect-ratio: 16 / 9;
		border-radius: 12px;
		overflow: hidden;
		background: #0b0d12;
		box-shadow: 0 0 0 1px var(--line);
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1),
			filter 0.3s;
	}

	a.card:hover .thumb img,
	a.card:focus-visible .thumb img {
		transform: scale(1.04);
		filter: brightness(1.06);
	}

	.play {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 50%;
		background: rgb(244 241 234 / 0.94);
		color: #14161b;
		box-shadow: 0 2px 10px rgb(0 0 0 / 0.35);
		opacity: 0;
		translate: 0 6px;
		transition:
			opacity 0.2s,
			translate 0.2s;
	}

	a.card:hover .play,
	a.card:focus-visible .play {
		opacity: 1;
		translate: 0 0;
	}

	a.card:focus-visible {
		outline: none;
	}

	a.card:focus-visible .thumb {
		box-shadow: 0 0 0 2px var(--accent);
	}

	.thumb.empty {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 0.5rem;
		color: var(--text-faint);
		font-size: 0.78rem;
		background: repeating-linear-gradient(
			-45deg,
			transparent 0 10px,
			rgb(127 127 127 / 0.05) 10px 20px
		);
		box-shadow: inset 0 0 0 1px var(--line);
	}

	.text {
		padding: 0.95rem 0.15rem 0;
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		margin: 0 0 0.4rem;
	}

	.affordance {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.soon .affordance {
		color: var(--text-faint);
	}

	.regime {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		color: var(--text-dim);
		font-size: 0.7rem;
		white-space: nowrap;
	}

	h2 {
		margin: 0 0 0.4rem;
		font: 400 1.45rem/1.2 var(--font-serif);
		transition: color 0.2s;
	}

	a.card:hover h2 {
		color: var(--accent);
	}

	.soon h2 {
		color: var(--text-dim);
	}

	.summary {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
	}
</style>
