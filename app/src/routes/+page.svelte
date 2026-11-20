<script lang="ts">
	/**
	 * The landing page is one long split picture. A seam runs down the whole page: light on its
	 * left, gravity on its right. It is the divider of the picture at the top, so moving that
	 * divider moves the seam through every scene below. The words are drawn white with a
	 * difference blend, so they read dark on the light side and pale on the gravity side wherever
	 * the seam is; the two grounds are each other's complement, so each side's ink is the other
	 * side's colour.
	 */
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BlackHoleIcon,
		BookOpen01Icon,
		Chart01Icon,
		FlashlightIcon,
		GalaxyIcon,
		GeologyCrustIcon,
		GithubIcon,
		MirrorIcon,
		PlayCircleIcon,
		Rotate01Icon,
		SafeIcon,
		TemperatureIcon,
		WeightScale01Icon,
		WorkoutRunIcon
	} from '@hugeicons/core-free-icons';
	import { stills } from '#lib/demos/stills.js';
	import { objectsAt, scene as sunScene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import type { View } from '#lib/engine/index.js';
	import SplitView from '#lib/ui/SplitView.svelte';

	const DEG = Math.PI / 180;
	let view: View = $state({ yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG });
	/** Where the seam is, 0 (all gravity) to 1 (all light): the picture's divider. */
	let seam = $state(0.5);
	const objects = objectsAt(0);
	const sun = sunDirection(0);

	// --- the seam below the picture: grab it anywhere; its handle shows where the pointer is ---
	let gripAt = $state(0);
	let hovering = $state(false);
	let dragging = $state(false);

	function follow(e: PointerEvent) {
		// the seam's strip lives in the page, whose box is the seam's ruler
		const r = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
		gripAt = e.clientY - r.top;
		if (dragging) seam = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
	}

	function grab(e: PointerEvent) {
		// no text selection, and no dragging of the picture underneath, which would cancel the pointer
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragging = true;
		follow(e);
	}

	function release() {
		dragging = false;
	}

	/** The scenes, rooms first; from `skyFrom` on, the sky. */
	const scenes = [
		{
			slug: 'locked-safe',
			href: resolve('/demo/locked-safe'),
			icon: SafeIcon,
			name: 'Find what is hidden',
			line: 'Two identical steel safes, one holding gold. No wall shields mass.'
		},
		{
			slug: 'full-or-empty',
			href: resolve('/demo/full-or-empty'),
			icon: WeightScale01Icon,
			name: 'Weigh by looking',
			line: 'Three identical tanks: one empty, one of water, one of mercury.'
		},
		{
			slug: 'closed-furnace',
			href: resolve('/demo/closed-furnace'),
			icon: TemperatureIcon,
			name: 'Read the heat inside',
			line: 'Two closed furnaces, one hot. Its heat shows through the steel.'
		},
		{
			slug: 'blank-mirror',
			href: resolve('/demo/blank-mirror'),
			icon: MirrorIcon,
			name: 'A mirror shows nothing',
			line: 'A mirror, a television and a printed page are blank slabs to gravity.'
		},
		{
			slug: 'sealed-flywheel',
			href: resolve('/demo/sealed-flywheel'),
			icon: Rotate01Icon,
			name: 'See a sealed wheel turn',
			line: 'Spinning or still, it looks and weighs the same. Its gravitomagnetic field does not.'
		},
		{
			slug: 'beam-in-the-dark',
			href: resolve('/demo/beam-in-the-dark'),
			icon: FlashlightIcon,
			name: 'See what emits no light',
			line: 'An infrared beam, invisible from the side. Its energy still gravitates.'
		},
		{
			slug: 'behind-the-wall',
			href: resolve('/demo/behind-the-wall'),
			icon: WorkoutRunIcon,
			name: 'See through walls',
			line: 'Two people behind a wall, and which of them is moving.'
		},
		{
			slug: 'milky-way',
			href: resolve('/demo/milky-way'),
			icon: GalaxyIcon,
			name: 'The heart of the Galaxy',
			line: 'Dust hides the centre from light, not from gravity.'
		},
		{
			slug: 'black-hole',
			href: resolve('/demo/black-hole'),
			icon: BlackHoleIcon,
			name: 'The only shadows',
			line: 'A black hole against the glow of the first gravitons.'
		}
	];
	const skyFrom = 'milky-way';
</script>

<svelte:head>
	<title>Gravitational Camera: a thought experiment</title>
	<meta
		name="description"
		content="What would a camera see if every pixel were a gravitational-wave detector? A theory of gravitational image formation, with an engine you can play with."
	/>
</svelte:head>

<div class="page" style:--seam={seam}>
	<!-- the seam: drag it anywhere down the page (the picture's own divider is the keyboard's way) -->
	<div
		class={['seam', { shown: hovering || dragging }]}
		role="presentation"
		onpointerenter={(e) => {
			hovering = true;
			follow(e);
		}}
		onpointerleave={() => (hovering = false)}
		onpointerdown={grab}
		onpointermove={follow}
		onpointerup={release}
		onpointercancel={release}
	>
		<span class="grip" style:top="{gripAt}px"></span>
	</div>

	<header class="ink top">
		<nav aria-label="Site">
			<a class="brand" href={resolve('/')} aria-label="Gravitational Camera, home">
				<HugeiconsIcon icon={GeologyCrustIcon} size={22} strokeWidth={1.5} />
			</a>
			<a href={resolve('/demo')}>
				<HugeiconsIcon icon={PlayCircleIcon} size={18} strokeWidth={1.5} />
				<span>Demos</span>
			</a>
			<a href={resolve('/figures')}>
				<HugeiconsIcon icon={Chart01Icon} size={18} strokeWidth={1.5} />
				<span>Figures</span>
			</a>
			<span class="gap"></span>
			<a href={resolve('/paper')}>
				<HugeiconsIcon icon={BookOpen01Icon} size={18} strokeWidth={1.5} />
				<span>Paper</span>
			</a>
			<a href="https://github.com/NeoVand/gravitational-camera">
				<HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.5} />
				<span>Source</span>
			</a>
		</nav>
	</header>

	<main>
		<section class="opening">
			<div class="ink words">
				<h1>Gravitational Camera</h1>
				<p class="subtitle">A thought experiment</p>
				<p class="question">
					What would a camera see if every pixel were a detector of gravitational waves?
				</p>
				<nav class="calls" aria-label="Start">
					<a href={resolve('/demo')}>
						<HugeiconsIcon icon={PlayCircleIcon} size={20} strokeWidth={1.5} />
						<span>Open the demos</span>
					</a>
					<a href={resolve('/paper')}>
						<HugeiconsIcon icon={BookOpen01Icon} size={20} strokeWidth={1.5} />
						<span>Read the paper</span>
					</a>
				</nav>
			</div>

			<div class="hero">
				<span class="pictures still" aria-hidden="true">
					<span class="layer light"
						><img src={stills['sun-at-midnight'].light} alt="" width="1600" height="800" /></span
					>
					<span class="layer gravity"
						><img src={stills['sun-at-midnight'].gravity} alt="" width="1600" height="800" /></span
					>
				</span>
				<SplitView
					{objects}
					observer={sunScene.observer.position}
					sunDirection={sun}
					bind:view
					bind:divider={seam}
					embedded
					leftLabel="Light"
					rightLabel="Gravity"
				/>
			</div>

			<p class="ink caption hero-caption">
				Midnight, looking down. In light, dark ground under the stars; in gravity, the Earth’s warm
				interior, and the Sun shining up through the planet. Drag the picture to look around. Move
				its divider and the whole page follows.
			</p>
		</section>

		<section class="scenes" aria-label="Scenes">
			{#each scenes as s (s.slug)}
				{#if s.slug === skyFrom}
					<p class="ink turn">The same camera, pointed at the sky.</p>
				{/if}
				<a class="scene" href={s.href}>
					<span class="pictures">
						<span class="layer light">
							<img
								src={stills[s.slug].light}
								alt=""
								width="1600"
								height="800"
								loading="lazy"
								decoding="async"
							/>
						</span>
						<span class="layer gravity">
							<img
								src={stills[s.slug].gravity}
								alt=""
								width="1600"
								height="800"
								loading="lazy"
								decoding="async"
							/>
						</span>
					</span>
					<span class="ink caption">
						<span class="glyph"><HugeiconsIcon icon={s.icon} size={24} strokeWidth={1.4} /></span>
						<span class="name">{s.name}</span>
						<span class="line">{s.line}</span>
					</span>
				</a>
			{/each}
		</section>

		<section class="ink closing">
			<p>
				The paper works this out in linearized gravity: what such a camera could image, how sharply,
				and what it could never see.
			</p>
			<nav class="calls" aria-label="More">
				<a href={resolve('/demo')}>
					<HugeiconsIcon icon={PlayCircleIcon} size={20} strokeWidth={1.5} />
					<span>All the demos</span>
				</a>
				<a href={resolve('/paper')}>
					<HugeiconsIcon icon={BookOpen01Icon} size={20} strokeWidth={1.5} />
					<span>Read the paper</span>
				</a>
			</nav>
		</section>
	</main>

	<footer class="ink">
		<p>Work in progress. The physics is standard; the claims of novelty are provisional.</p>
	</footer>
</div>

<style>
	/* The two grounds are complements (255 minus each other), so white drawn with a difference
	   blend comes out as the other ground's colour on each side. */
	.page {
		--lux: #d2dde7;
		--umbra: #2d2218;
		--g: clamp(1rem, 4vw, 3rem);
		--at: calc(var(--seam) * 100%);

		position: relative;
		min-height: 100vh;
		overflow-x: clip;
		background: linear-gradient(90deg, var(--lux) 0 var(--at), var(--umbra) var(--at) 100%);
		font-family: var(--font-serif);
		font-optical-sizing: auto;
		color: #fff;
	}

	/* the seam, from the top of the page to the bottom: a hairline in a strip wide enough to grab */
	.seam {
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--at);
		z-index: 1;
		width: 24px;
		margin-left: -12px;
		cursor: ew-resize;
		touch-action: pan-y;
		user-select: none;
	}

	.seam::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1px;
		translate: -0.5px 0;
		background: rgb(232 164 90 / 0.75);
	}

	/* the same handle as the picture's divider, where the pointer meets the seam */
	.grip {
		position: absolute;
		left: 50%;
		width: 28px;
		height: 28px;
		translate: -50% -50%;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.92);
		box-shadow: 0 1px 8px rgb(0 0 0 / 0.45);
		opacity: 0;
		transition: opacity 0.15s;
		pointer-events: none;
	}

	.seam.shown .grip {
		opacity: 1;
	}

	.grip::before,
	.grip::after {
		content: '';
		position: absolute;
		top: 50%;
		width: 6px;
		height: 6px;
		border: solid #111;
		border-width: 0 0 1.5px 1.5px;
	}

	.grip::before {
		left: 7px;
		transform: translateY(-50%) rotate(45deg);
	}

	.grip::after {
		right: 7px;
		transform: translateY(-50%) rotate(-135deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.grip {
			transition: none;
		}
	}

	.ink {
		color: #fff;
		mix-blend-mode: difference;
	}

	.ink a {
		color: inherit;
		text-decoration: none;
	}

	.ink a:focus-visible,
	.scene:focus-visible {
		outline: 1.5px solid #fff;
		outline-offset: 4px;
		border-radius: 2px;
	}

	/* --- the top line -------------------------------------------------------- */

	.top nav {
		display: flex;
		align-items: center;
		gap: clamp(1rem, 2.4vw, 2rem);
		padding: 1.25rem var(--g);
		font-size: 1.0625rem;
	}

	.top .gap {
		flex: 1;
	}

	.top a,
	.calls a {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
	}

	.top .brand {
		margin-right: clamp(0.25rem, 1vw, 0.75rem);
	}

	.top a:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.25em;
	}

	/* --- the opening ------------------------------------------------------- */

	.opening {
		padding-top: clamp(2.5rem, 8vh, 6rem);
	}

	.words {
		text-align: center;
		padding-inline: var(--g);
	}

	h1 {
		margin: 0;
		font-size: clamp(3.2rem, 9vw, 8.5rem);
		font-weight: 300;
		font-variation-settings: 'opsz' 72;
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	.subtitle {
		margin: 0.6rem 0 0;
		font-size: clamp(1.35rem, 2.4vw, 2rem);
		font-style: italic;
		font-weight: 300;
	}

	.question {
		max-width: 30ch;
		margin: clamp(1.75rem, 4vh, 2.75rem) auto 0;
		font-size: clamp(1.15rem, 1.7vw, 1.45rem);
		line-height: 1.45;
	}

	/* two calls, one each side of the seam's home */
	.calls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: clamp(2.5rem, 7vw, 6rem);
		margin: clamp(1.75rem, 4vh, 2.5rem) auto 0;
		font-size: clamp(1.1rem, 1.5vw, 1.3rem);
		font-style: italic;
	}

	.calls a {
		justify-self: end;
	}

	.calls a span {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.28em;
	}

	.calls a + a {
		justify-self: start;
	}

	.calls a:hover span {
		text-decoration-thickness: 2px;
	}

	.hero {
		position: relative;
		z-index: 2;
		height: min(50vw, 80vh);
		min-height: 300px;
		margin-top: clamp(2.5rem, 7vh, 5rem);
	}

	/* the engine paints over the stills once it runs; until then, or without WebGPU, the
	   stills show the same view, split at the same seam */
	.hero :global(.frame) {
		background: transparent;
	}

	.hero :global(.notice) {
		display: none;
	}

	/* the picture's own labels, in the page's voice */
	.hero :global(.tag) {
		font: italic 400 0.95rem/1 var(--font-serif);
		letter-spacing: 0;
		text-transform: none;
	}

	.hero .pictures {
		position: absolute;
		inset: 0;
	}

	.hero .layer {
		position: absolute;
		inset: 0;
	}

	.hero .pictures img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.caption {
		display: block;
		text-align: center;
		padding-inline: var(--g);
	}

	.hero-caption {
		max-width: 62ch;
		margin: 1.25rem auto 0;
		font-size: 0.98rem;
		font-style: italic;
		line-height: 1.5;
	}

	/* --- the scenes ---------------------------------------------------------- */

	.scenes {
		display: grid;
		row-gap: clamp(4.5rem, 12vh, 8rem);
		margin-top: clamp(5rem, 14vh, 9rem);
	}

	.scene {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	/* each layer spans the whole page, so the seam cuts both at the same place as the page's */
	.pictures {
		position: relative;
		display: block;
	}

	.layer {
		display: block;
	}

	.layer.light {
		clip-path: inset(0 calc(100% - var(--at)) 0 0);
	}

	.layer.gravity {
		position: absolute;
		inset: 0;
		clip-path: inset(0 0 0 var(--at));
	}

	/* the stills are 2:1; a wider crop keeps each subject and loses floor and ceiling */
	.scene img {
		display: block;
		width: min(100% - 2 * var(--g), 64rem);
		height: auto;
		aspect-ratio: 2.35;
		margin-inline: auto;
		object-fit: cover;
		object-position: 50% 55%;
	}

	.scene .caption {
		margin-top: 1.1rem;
	}

	.scene .glyph {
		display: flex;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.scene .name {
		display: block;
		font-size: clamp(1.45rem, 2.4vw, 2.1rem);
		font-weight: 350;
		line-height: 1.2;
	}

	.scene .line {
		display: block;
		max-width: 46ch;
		margin: 0.35rem auto 0;
		font-size: clamp(1rem, 1.3vw, 1.125rem);
		font-style: italic;
		line-height: 1.45;
	}

	.scene:hover .name {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}

	/* inside the scenes' grid, whose gap already sets it apart */
	.turn {
		margin: clamp(1.5rem, 5vh, 3.5rem) auto 0;
		padding-inline: var(--g);
		text-align: center;
		font-size: clamp(1.6rem, 3.2vw, 2.75rem);
		font-weight: 300;
		font-style: italic;
	}

	/* --- the end --------------------------------------------------------------- */

	.closing {
		margin: clamp(7rem, 18vh, 11rem) auto 0;
		padding-inline: var(--g);
		text-align: center;
	}

	.closing p {
		max-width: 36ch;
		margin: 0 auto;
		font-size: clamp(1.3rem, 2.2vw, 1.85rem);
		font-weight: 300;
		line-height: 1.35;
	}

	footer {
		padding: clamp(5rem, 14vh, 8rem) var(--g) 2rem;
		text-align: center;
		font-size: 0.9rem;
		font-style: italic;
		opacity: 0.85;
	}

	footer p {
		margin: 0;
	}

	@media (max-width: 40rem) {
		.calls {
			column-gap: 2rem;
		}

		.hero {
			height: 62vw;
		}
	}
</style>
