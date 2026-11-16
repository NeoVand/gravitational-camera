<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowRight02Icon,
		BlackHoleIcon,
		BookOpen01Icon,
		DropletIcon,
		FlashlightIcon,
		GalaxyIcon,
		Layers01Icon,
		MirrorIcon,
		PlayCircleIcon,
		Rotate01Icon,
		SafeIcon,
		SpiralsIcon,
		TemperatureIcon,
		TestTube01Icon,
		ViewIcon,
		WaveIcon,
		WeightScale01Icon
	} from '@hugeicons/core-free-icons';
	import { posters } from '#lib/demos/posters.js';
	import { objectsAt, scene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import type { View } from '#lib/engine/index.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import SplitView from '#lib/ui/SplitView.svelte';

	const DEG = Math.PI / 180;
	let view: View = $state({ yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG });
	let divider = $state(0.46);
	const objects = objectsAt(0);
	const sun = sunDirection(0);

	const regimes = [
		{
			icon: WeightScale01Icon,
			name: 'The near field',
			line: 'Mass itself, through any wall.',
			text: 'At everyday speeds the camera feels the changing pull of whatever is near it. Nothing can be hidden, and everything can be weighed. The price is a blur that no sensitivity can remove.'
		},
		{
			icon: WaveIcon,
			name: 'Waves from motion',
			line: 'Every moving thing is a point.',
			text: 'Whatever spins, shakes or collides sends out waves far longer than itself. The camera cannot resolve it, but reads from the polarization which way it turns.'
		},
		{
			icon: TemperatureIcon,
			name: 'The thermal glow',
			line: 'Sharp, transparent, faint.',
			text: 'Warm matter glows in gravitational waves short enough for sharp pictures. Nothing blocks the glow of what lies behind, so the picture runs all the way through.'
		}
	];

	const affordances = [
		{
			icon: ViewIcon,
			name: 'See through anything',
			text: 'The whole Earth is transparent.',
			href: resolve('/demo/sun-at-midnight'),
			poster: posters['sun-at-midnight']
		},
		{
			icon: SafeIcon,
			name: 'Find what is hidden',
			text: 'No shield or cloak exists.',
			href: resolve('/demo/locked-safe'),
			poster: posters['locked-safe']
		},
		{
			icon: WeightScale01Icon,
			name: 'Weigh by looking',
			text: 'Brightness is mass, not surface.',
			href: resolve('/demo/full-or-empty'),
			poster: posters['full-or-empty']
		},
		{
			icon: MirrorIcon,
			name: 'Ignore images',
			text: 'A mirror shows nothing.',
			href: resolve('/demo/blank-mirror'),
			poster: posters['blank-mirror']
		},
		{
			icon: TemperatureIcon,
			name: 'Read inside temperature',
			text: 'Heat is seen through the walls.',
			href: resolve('/demo/closed-furnace'),
			poster: posters['closed-furnace']
		},
		{
			icon: DropletIcon,
			name: 'Tell materials by friction',
			text: 'Honey and water can differ.',
			href: resolve('/demo/honey-and-water'),
			poster: posters['honey-and-water']
		},
		{
			icon: Rotate01Icon,
			name: 'Read spin and its sense',
			text: 'Even in a sealed box.',
			href: resolve('/demo/which-way'),
			poster: posters['which-way']
		},
		{
			icon: Rotate01Icon,
			name: 'See flow in a sealed body',
			text: 'A spinning wheel shows its turning.',
			href: resolve('/demo/sealed-flywheel'),
			poster: posters['sealed-flywheel']
		},
		{
			icon: FlashlightIcon,
			name: 'See what emits no light',
			text: 'All energy gravitates.',
			href: resolve('/demo/beam-in-the-dark'),
			poster: posters['beam-in-the-dark']
		}
	];

	const vistas = [
		{
			icon: GalaxyIcon,
			name: 'The Milky Way',
			text: 'Its hidden heart is the brightest thing.',
			href: resolve('/demo/milky-way'),
			poster: posters['milky-way']
		},
		{
			icon: BlackHoleIcon,
			name: 'The only shadows',
			text: 'A black hole against the first light.',
			href: resolve('/demo/black-hole'),
			poster: posters['black-hole']
		},
		{
			icon: SpiralsIcon,
			name: 'Two black holes',
			text: 'From Newton’s pull to the waves.',
			href: resolve('/demo/two-black-holes'),
			poster: posters['two-black-holes']
		}
	];
</script>

<svelte:head>
	<title>Gravitational Camera: a thought experiment</title>
	<meta
		name="description"
		content="What would a camera see if every pixel were a gravitational-wave detector? A theory of gravitational image formation, with an engine you can play with."
	/>
</svelte:head>

<main class="always-dark">
	<section class="hero">
		<div class="picture">
			<SplitView
				{objects}
				observer={scene.observer.position}
				sunDirection={sun}
				bind:view
				bind:divider
				embedded
				leftLabel="Light"
				rightLabel="Gravity"
				poster={asset('posters/sun-at-midnight.jpg')}
			/>
		</div>
		<SiteHeader overlay />

		<div class="words">
			<h1>Gravitational Camera</h1>
			<p class="subtitle">A thought experiment</p>
			<p class="lede">
				What would a camera see if every pixel were a detector of gravitational waves?
			</p>
			<nav aria-label="Main">
				<a class="primary" href={resolve('/demo')}>
					<HugeiconsIcon icon={PlayCircleIcon} size={20} strokeWidth={1.7} />
					Open the demos
				</a>
				<a class="secondary" href={resolve('/paper')}>
					<HugeiconsIcon icon={BookOpen01Icon} size={20} strokeWidth={1.7} />
					Read the paper
				</a>
			</nav>
		</div>

		<p class="caption">
			Midnight, looking down. Left, ordinary light: dark ground under the stars. Right, thermal
			gravitational radiation: Earth’s interior, and the Sun’s core shining through the planet. Drag
			to look around, or drag the divider.
		</p>
	</section>

	<section class="band">
		<header>
			<h2>Three ways of seeing</h2>
			<p>
				A gravitational detector cannot tell a passing wave from the pull of a nearby object. What
				its pixels receive depends on how fast the source moves and how far away it is, and falls
				into three regimes with very different pictures.
			</p>
		</header>
		<ol class="regimes">
			{#each regimes as r (r.name)}
				<li>
					<span class="glyph"><HugeiconsIcon icon={r.icon} size={30} strokeWidth={1.4} /></span>
					<h3>{r.name}</h3>
					<p class="line">{r.line}</p>
					<p>{r.text}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section class="band">
		<header>
			<h2>What it can do that light cannot</h2>
			<p>
				Gravity is produced by everything and stopped by nothing. Each consequence is a demo: one
				half of the picture in light, the other in gravity.
			</p>
		</header>
		<ul class="affordances">
			{#each affordances as a (a.name)}
				<li>
					<a class="tile" href={a.href}>
						<span class="thumb"><img src={a.poster} alt="" loading="lazy" /></span>
						<span class="tile-text">
							<span class="glyph small"
								><HugeiconsIcon icon={a.icon} size={18} strokeWidth={1.6} /></span
							>
							<span>
								<span class="name">{a.name}</span>
								<span class="text">{a.text}</span>
							</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
		<a class="more" href={resolve('/demo')}>
			All demos <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={1.7} />
		</a>
	</section>

	<section class="band">
		<header>
			<h2>The sky</h2>
			<p>
				The same equations, solved exactly at the largest scales: a galaxy seen through its dust,
				the glow the Big Bang would have left, and the only things that cast shadows on it.
			</p>
		</header>
		<ul class="affordances">
			{#each vistas as a (a.name)}
				<li>
					<a class="tile" href={a.href}>
						<span class="thumb"><img src={a.poster} alt="" loading="lazy" /></span>
						<span class="tile-text">
							<span class="glyph small"
								><HugeiconsIcon icon={a.icon} size={18} strokeWidth={1.6} /></span
							>
							<span>
								<span class="name">{a.name}</span>
								<span class="text">{a.text}</span>
							</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="band doors">
		<a href={resolve('/paper')}>
			<span class="glyph"><HugeiconsIcon icon={BookOpen01Icon} size={30} strokeWidth={1.4} /></span>
			<h3>The paper</h3>
			<p>
				The theory, written to be read at two levels: plain-language summaries for everyone,
				derivations and live figures for physicists.
			</p>
		</a>
		<a href={resolve('/demo')}>
			<span class="glyph"><HugeiconsIcon icon={Layers01Icon} size={30} strokeWidth={1.4} /></span>
			<h3>The engine</h3>
			<p>
				A WebGPU renderer that draws the same scene in light and in gravity, side by side, in your
				browser.
			</p>
		</a>
		<a href={resolve('/dev/selftest')}>
			<span class="glyph"><HugeiconsIcon icon={TestTube01Icon} size={30} strokeWidth={1.4} /></span>
			<h3>The checks</h3>
			<p>
				Every picture is computed twice, by the engine and by an independent reference. Run the
				comparison on your own device.
			</p>
		</a>
	</section>

	<footer>
		<span>Work in progress. The physics is standard; the claims of novelty are provisional.</span>
		<a href="https://github.com/NeoVand/gravitational-camera">Source on GitHub</a>
	</footer>
</main>

<style>
	main {
		min-height: 100svh;
	}

	.hero {
		position: relative;
		min-height: min(100svh, 58rem);
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
		width: min(36rem, 100% - 2 * var(--gutter));
		margin-left: var(--gutter);
		padding-block: 6rem 7rem;
		pointer-events: none;
	}

	.words a {
		pointer-events: auto;
	}

	.subtitle {
		margin: 0.55rem 0 0;
		font: italic 400 clamp(1.35rem, 2.6vw, 1.9rem) / 1.2 var(--font-serif);
		color: var(--accent);
		text-shadow: 0 1px 14px rgb(0 0 0 / 0.85);
	}

	h1 {
		margin: 0;
		font: 400 clamp(2.8rem, 6.6vw, 4.9rem) / 1 var(--font-serif);
		letter-spacing: -0.022em;
		text-wrap: balance;
		text-shadow: 0 2px 30px rgb(0 0 0 / 0.7);
	}

	.lede {
		margin: 1.5rem 0 2.3rem;
		max-width: 27rem;
		font-size: clamp(1.08rem, 1.6vw, 1.3rem);
		line-height: 1.45;
		text-wrap: pretty;
		text-shadow: 0 1px 16px rgb(0 0 0 / 0.9);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		font-size: 0.96rem;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.7em 1.25em;
		border-radius: 999px;
		text-decoration: none;
		font-weight: 500;
	}

	nav a.primary {
		background: var(--text);
		color: var(--bg);
	}

	nav a.primary:hover {
		background: #fff;
	}

	nav a.secondary {
		border: 1px solid rgb(255 255 255 / 0.45);
		background: rgb(8 10 14 / 0.45);
		backdrop-filter: blur(6px);
	}

	nav a.secondary:hover {
		border-color: #fff;
	}

	/* on a phone the two buttons stack, the same width and height */
	@media (max-width: 560px) {
		nav {
			display: grid;
			grid-template-columns: 1fr;
			gap: 0.65rem;
			max-width: 22rem;
		}

		nav a {
			justify-content: center;
			padding: 0.85em 1.2em;
		}
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

	.band {
		max-width: 72rem;
		margin: 0 auto;
		padding: clamp(3.5rem, 8vw, 6rem) var(--gutter) 0;
	}

	.band > header {
		max-width: 40rem;
		margin-bottom: 2.4rem;
	}

	h2 {
		margin: 0 0 0.8rem;
		font: 400 clamp(1.9rem, 4vw, 2.7rem) / 1.08 var(--font-serif);
		letter-spacing: -0.015em;
		text-wrap: balance;
	}

	.band > header p {
		margin: 0;
		color: var(--text-dim);
		font-size: 1.05rem;
		text-wrap: pretty;
	}

	.glyph {
		display: inline-grid;
		place-items: center;
		width: 3.4rem;
		height: 3.4rem;
		border-radius: 14px;
		background: color-mix(in srgb, var(--accent) 14%, transparent);
		color: var(--accent);
	}

	.glyph.small {
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 11px;
		flex: none;
	}

	.regimes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
		gap: 1.2rem;
	}

	.regimes li,
	.doors a {
		padding: 1.6rem 1.6rem 1.7rem;
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 16px;
	}

	h3 {
		margin: 1.1rem 0 0.3rem;
		font: 500 1.35rem/1.2 var(--font-serif);
	}

	.line {
		margin: 0 0 0.7rem;
		color: var(--accent);
		font-size: 0.92rem;
	}

	.regimes p:last-child,
	.doors p {
		margin: 0;
		color: var(--text-dim);
		font-size: 0.93rem;
		line-height: 1.55;
		text-wrap: pretty;
	}

	.affordances {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
		gap: 1.8rem 1.4rem;
	}

	.tile {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.thumb {
		display: block;
		aspect-ratio: 16 / 9;
		border-radius: 10px;
		overflow: hidden;
		background: #0b0d12;
		box-shadow: 0 0 0 1px var(--line);
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.tile:hover .thumb img,
	.tile:focus-visible .thumb img {
		transform: scale(1.04);
	}

	.tile:focus-visible {
		outline: none;
	}

	.tile:focus-visible .thumb {
		box-shadow: 0 0 0 2px var(--accent);
	}

	.tile-text {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding-top: 0.8rem;
	}

	.name {
		display: block;
		margin-bottom: 0.15rem;
		font: 500 1rem/1.3 var(--font-sans);
		transition: color 0.2s;
	}

	.tile:hover .name {
		color: var(--accent);
	}

	.text {
		display: block;
		color: var(--text-dim);
		font-size: 0.86rem;
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1.6rem;
		color: var(--accent);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.more:hover {
		text-decoration: underline;
	}

	.doors {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
		gap: 1.2rem;
		padding-bottom: clamp(3.5rem, 8vw, 6rem);
	}

	.doors a {
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.doors a:hover {
		border-color: var(--accent);
	}

	/* On a phone the words would sit across the divider, so stack them below. */
	@media (max-width: 720px) {
		.hero {
			display: block;
			min-height: 0;
		}

		.picture {
			position: relative;
			height: 58svh;
		}

		.words {
			padding-block: 2rem 1.2rem;
		}

		.caption {
			position: static;
			margin: 0 var(--gutter) 1rem;
		}
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		padding: 1.2rem var(--gutter);
		border-top: 1px solid var(--line);
		font-size: 0.78rem;
		color: var(--text-faint);
	}
</style>
