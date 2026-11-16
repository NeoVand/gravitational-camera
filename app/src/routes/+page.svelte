<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { objectsAt, scene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import type { View } from '#lib/engine/index.js';
	import SplitView from '#lib/ui/SplitView.svelte';

	const DEG = Math.PI / 180;
	let view: View = $state({ yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG });
	let divider = $state(0.46);
	const objects = objectsAt(0);
	const sun = sunDirection(0);
</script>

<svelte:head>
	<title>The Gravitational Camera</title>
	<meta
		name="description"
		content="What would a camera see if every pixel were a gravitational-wave detector? A theory of gravitational image formation, with an engine you can play with."
	/>
</svelte:head>

<main>
	<section class="hero">
		<div class="picture">
			<SplitView
				{objects}
				observer={scene.observer.position}
				sunDirection={sun}
				bind:view
				bind:divider
				interactive={false}
				leftLabel="Light"
				rightLabel="Gravity"
				poster={asset('posters/sun-at-midnight.jpg')}
			/>
		</div>

		<div class="words">
			<h1>The Gravitational Camera</h1>
			<p class="lede">
				What would a camera see if every pixel were a detector of gravitational waves?
			</p>
			<nav aria-label="Main">
				<a class="primary" href={resolve('/demo')}>Open the demos</a>
				<a href={resolve('/paper')}>Read the paper</a>
			</nav>
		</div>

		<p class="caption">
			Midnight, looking down. Left, ordinary light: dark ground under the stars. Right, thermal
			gravitational radiation: Earth's interior, and the Sun's core shining through the planet. Drag
			the divider.
		</p>
	</section>

	<footer>
		<span>A thought experiment, worked out and rendered. Work in progress.</span>
		<a href="https://github.com/NeoVand/gravitational-camera">Source</a>
	</footer>
</main>

<style>
	main {
		min-height: 100svh;
		display: grid;
		grid-template-rows: 1fr auto;
	}

	.hero {
		position: relative;
		min-height: min(100svh, 60rem);
		display: grid;
		align-items: center;
		overflow: hidden;
	}

	.picture {
		position: absolute;
		inset: 0;
	}

	.words {
		position: relative;
		width: min(34rem, 100% - 2 * var(--gutter));
		margin-left: var(--gutter);
		padding-block: 4rem 6rem;
		pointer-events: none;
	}

	.words a {
		pointer-events: auto;
	}

	h1 {
		margin: 0;
		font: 400 clamp(2.6rem, 6.4vw, 4.6rem) / 1.02 var(--font-serif);
		letter-spacing: -0.02em;
		text-wrap: balance;
		text-shadow: 0 2px 30px rgb(0 0 0 / 0.7);
	}

	.lede {
		margin: 1.4rem 0 2.2rem;
		max-width: 26rem;
		font-size: clamp(1.05rem, 1.6vw, 1.25rem);
		line-height: 1.45;
		color: var(--text);
		text-wrap: pretty;
		text-shadow: 0 1px 16px rgb(0 0 0 / 0.9);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem 1.6rem;
		align-items: center;
		font-size: 0.95rem;
	}

	nav a {
		text-decoration: none;
		padding: 0.65em 0;
		border-bottom: 1px solid var(--text-faint);
	}

	nav a:hover {
		border-color: var(--accent);
	}

	nav a.primary {
		padding: 0.65em 1.3em;
		border: 1px solid var(--text);
		border-radius: 999px;
		background: var(--text);
		color: var(--bg);
		font-weight: 500;
	}

	nav a.primary:hover {
		background: #fff;
		border-color: #fff;
	}

	.caption {
		position: absolute;
		left: var(--gutter);
		bottom: 1.4rem;
		margin: 0;
		max-width: 34rem;
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--text-dim);
		text-shadow: 0 1px 10px rgb(0 0 0 / 0.9);
		pointer-events: none;
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		padding: 1rem var(--gutter);
		border-top: 1px solid var(--line);
		font-size: 0.78rem;
		color: var(--text-faint);
	}
</style>
