<script lang="ts">
	/**
	 * The tutorial's front page. A banner in the landing page's manner, one scene cut by a seam into light and
	 * gravity; the fourteen parts as a gallery; the routes, each the shortest path to one part of the paper; and
	 * every numbered equation of the paper with the chapter that derives it.
	 */
	import { resolve } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowDown01Icon,
		BookOpen01Icon,
		Moon02Icon,
		PlayCircleIcon,
		Route01Icon
	} from '@hugeicons/core-free-icons';
	import { stills } from '#lib/demos/stills.js';
	import { posters } from '#lib/demos/posters.js';
	import SiteHeader from '#lib/ui/SiteHeader.svelte';
	import DotPath from '#lib/tutorial/landing/DotPath.svelte';
	import EquationWall from '#lib/tutorial/landing/EquationWall.svelte';
	import LazyDrawing from '#lib/tutorial/landing/LazyDrawing.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const BANNER = 'full-or-empty';
	const href = (path: string | undefined) => (path ? resolve(path as '/') : undefined);

	// --- the banner's seam: 0 is all gravity, 1 all light; drag the picture, or use the arrow keys on the handle
	let seam = $state(0.5);
	let dragging = $state(false);

	function follow(e: PointerEvent, stage: HTMLElement) {
		const r = stage.getBoundingClientRect();
		seam = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
	}

	function grab(e: PointerEvent) {
		// the banner's own links and buttons keep their clicks
		if ((e.target as Element).closest('a, button')) return;
		e.preventDefault();
		const stage = e.currentTarget as HTMLElement;
		stage.setPointerCapture(e.pointerId);
		dragging = true;
		follow(e, stage);
	}

	function nudge(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.1 : 0.02;
		const to =
			e.key === 'ArrowLeft'
				? seam - step
				: e.key === 'ArrowRight'
					? seam + step
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? 1
							: undefined;
		if (to === undefined) return;
		e.preventDefault();
		seam = Math.max(0, Math.min(1, to));
	}

	const chapterWord = (n: number) => (n === 1 ? '1 chapter' : `${n} chapters`);
	const partsCrossed = (route: (typeof data.routes)[number]) =>
		new Set(route.chapters.map((c) => c.part)).size;
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
	<!-- the banner: one scene of the demos, light on the left of the seam and gravity on its right -->
	<section class="banner" aria-labelledby="title" style:--seam={seam}>
		<div
			class={['stage', { dragging }]}
			role="presentation"
			onpointerdown={grab}
			onpointermove={(e) => dragging && follow(e, e.currentTarget)}
			onpointerup={() => (dragging = false)}
			onpointercancel={() => (dragging = false)}
		>
			<span class="pictures" aria-hidden="true">
				<span class="layer light"
					><img src={stills[BANNER].light} alt="" width="1600" height="800" /></span
				>
				<span class="layer gravity"
					><img src={stills[BANNER].gravity} alt="" width="1600" height="800" /></span
				>
			</span>
			<span class="side ink at-light" aria-hidden="true">Light</span>
			<span class="side ink at-gravity" aria-hidden="true">Gravity</span>
			<span
				class="handle"
				role="slider"
				tabindex="0"
				aria-label="The seam between light and gravity"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(seam * 100)}
				aria-valuetext="{Math.round(seam * 100)}% light"
				onkeydown={nudge}
			>
				<span class="grip"></span>
			</span>
		</div>
		<div class="words">
			<p class="kicker">Tutorial</p>
			<h1 id="title">From calculus to the gravitational camera</h1>
			<p class="lede">
				If you know some calculus, vectors and a little probability, this tutorial will take you the
				rest of the way: through every argument and every equation of the paper, one question at a
				time.
			</p>
			<nav class="calls" aria-label="Start">
				<a href={href(data.parts[0].chapters[0].href)}>
					<HugeiconsIcon icon={Moon02Icon} size={20} strokeWidth={1.5} />
					<span>Begin with one evening</span>
				</a>
				<a href="#routes">
					<HugeiconsIcon icon={Route01Icon} size={20} strokeWidth={1.5} />
					<span>Choose a destination</span>
				</a>
			</nav>
		</div>
		<p class="caption">
			<span>
				Three tanks that look the same: one empty, one of water, one of mercury. Light shows their
				surfaces; gravity shows their mass. Drag the picture to move the seam.
			</span>
			<span class="facts">
				<a href="#parts">{data.counts.chapters} chapters in {data.counts.parts} parts</a>
				<span aria-hidden="true">·</span>
				<a href={resolve('/tutorial/glossary/' as '/')}>glossary</a>
				<span aria-hidden="true">·</span>
				<a href={resolve('/tutorial/symbols/' as '/')}>symbols</a>
			</span>
		</p>
	</section>

	<!-- the parts -->
	<section class="parts" aria-labelledby="parts">
		<header class="head">
			<h2 id="parts">Fourteen parts</h2>
			<p>
				Each part answers the questions that a scene of the paper raises, and most end by reading
				that section of the paper with what the part has built.
			</p>
		</header>
		<ol class="gallery">
			{#each data.parts as part (part.id)}
				<li class="part" id="part-{part.id}" style:--k={Number(part.id) / 13}>
					<a class="opening" href={href(part.href)}>
						<span class={['picture', part.picture.kind]}>
							{#if part.picture.kind === 'drawing'}
								<LazyDrawing name={part.picture.name} alt={part.picture.alt} />
							{:else}
								<img
									src={posters[part.picture.slug]}
									alt={part.picture.alt}
									width="1280"
									height="720"
									loading="lazy"
									decoding="async"
								/>
							{/if}
						</span>
						<span class="number">Part {part.id}</span>
						<h3>{part.title}</h3>
					</a>
					<p class="line">{part.line}</p>
					<details>
						<summary>
							<HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.6} />
							<span>{chapterWord(part.chapters.length)}</span>
						</summary>
						<ol class="chapters">
							{#each part.chapters as c (c.id)}
								<li>
									<span class="id">{c.id}</span>
									<span class="title">
										{#if c.href}
											<a href={resolve(c.href as '/')}>{c.title}</a>
										{:else}
											{c.title}
										{/if}
										{#if c.reading}<em class="reading">reading</em>{/if}
									</span>
								</li>
							{/each}
						</ol>
					</details>
				</li>
			{/each}
		</ol>
	</section>

	<!-- the routes -->
	<section class="routes" aria-labelledby="routes">
		<header class="head">
			<h2 id="routes">Go straight to a part of the paper</h2>
			<p>
				A route is the shortest path through the tutorial to one part of the paper: every chapter
				that part needs, and nothing else, in the order to read them. The times assume an unhurried
				reader with a pencil.
			</p>
		</header>

		<ol class="cards">
			{#each data.routes as route (route.id)}
				<li class="route" id="route-{route.id}">
					<a class="destination" href={href(route.href)}>
						<img
							src={posters[route.poster]}
							alt=""
							width="1280"
							height="720"
							loading="lazy"
							decoding="async"
						/>
						<h3>{route.destination}</h3>
					</a>
					<p class="length">
						{chapterWord(route.chapters.length)} from {partsCrossed(route)} parts, {route.time}
					</p>
					<DotPath
						chapters={route.chapters}
						label="The chapters of the route to {route.destination}"
					/>
					<a class="start" href={href(route.href)}>
						<HugeiconsIcon icon={PlayCircleIcon} size={18} strokeWidth={1.5} />
						<span>Start the route</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<!-- the equations -->
	<section class="equations" aria-labelledby="equations">
		<header class="head">
			<h2 id="equations">Every equation of the paper, and where it is derived</h2>
			<p>
				The paper numbers {data.equations.total} equations. Each tile is one of them, in the paper’s order,
				and leads to the chapter that derives it:
				<strong
					>{data.equations.derived} of {data.equations.total} are derived in the tutorial</strong
				>; {data.equations.total - data.equations.derived} are stated in the paper and read there.
			</p>
		</header>
		<EquationWall tiles={data.equations.tiles} />
		<p class="key">
			<span class="item"
				><span class="sample derived" aria-hidden="true"></span> derived in the tutorial</span
			>
			<span class="item"
				><span class="sample" aria-hidden="true"></span> stated in the paper and read</span
			>
			<span class="item"
				><span class="ramp" aria-hidden="true"></span> toned by part, from Part 0 to Part 13</span
			>
		</p>
	</section>

	<p class="closing">
		<HugeiconsIcon icon={BookOpen01Icon} size={20} strokeWidth={1.5} />
		<span>
			Words and symbols are collected in the <a href={resolve('/tutorial/glossary/' as '/')}
				>glossary</a
			>
			and the <a href={resolve('/tutorial/symbols/' as '/')}>list of symbols</a>; the destination of
			every route is the <a href={resolve('/paper')}>paper</a> itself.
		</span>
	</p>
</main>

<style>
	main {
		padding-bottom: 6rem;
		font-family: var(--font-serif);
		font-optical-sizing: auto;
	}

	/* --- the banner ------------------------------------------------------------------------------------------- */

	.banner {
		--at: calc(var(--seam) * 100%);
		position: relative;
	}

	.stage {
		position: relative;
		overflow: hidden;
		touch-action: pan-y;
		cursor: ew-resize;
		user-select: none;
	}

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

	.pictures img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 2.2;
		object-fit: cover;
		/* the floor's edge stays below the calls */
		object-position: 50% 0%;
		-webkit-user-drag: none;
	}

	/* words drawn white with a difference blend read dark on the light picture and pale on the gravity one */
	.ink {
		color: #fff;
		mix-blend-mode: difference;
	}

	.side {
		position: absolute;
		bottom: 0.9rem;
		font: italic 500 1.02rem/1 var(--font-serif);
		pointer-events: none;
	}

	.at-light {
		right: calc(100% - var(--at) + 1rem);
	}

	.at-gravity {
		left: calc(var(--at) + 1rem);
	}

	.handle {
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--at);
		width: 24px;
		margin-left: -12px;
		cursor: ew-resize;
	}

	.handle::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 1.5px;
		translate: -50% 0;
		background: rgb(255 255 255 / 0.85);
	}

	/* the same handle as the landing page's divider */
	.grip {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 28px;
		height: 28px;
		translate: -50% -50%;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.92);
		box-shadow: 0 1px 8px rgb(0 0 0 / 0.45);
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

	.handle:focus-visible {
		outline: none;
	}

	.handle:focus-visible .grip {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	/* on a phone the words follow the picture, in the page's own ink */
	.words {
		position: relative;
		padding: 1.6rem var(--gutter) 0;
	}

	.kicker {
		margin: 0 0 0.6rem;
		color: var(--accent);
		font: italic 400 1.1rem/1.2 var(--font-serif);
	}

	h1 {
		margin: 0;
		font: 300 clamp(2.3rem, 8.4vw, 4rem) / 1.02 var(--font-serif);
		font-variation-settings: 'opsz' 72;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.lede {
		max-width: 34rem;
		margin: 1rem 0 0;
		color: var(--text-dim);
		font-size: 1.15rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.calls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 2rem;
		margin-top: 1.4rem;
		font-size: 1.12rem;
		font-style: italic;
	}

	.calls a {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		color: inherit;
		text-decoration: none;
	}

	.calls a :global(svg) {
		flex: none;
		color: var(--accent);
	}

	.calls a span {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.28em;
	}

	.calls a:hover span {
		text-decoration-thickness: 2px;
	}

	/* from a tablet up the words lie on the picture's wall, left of the tanks, at a size that keeps with it */
	@media (min-width: 56rem) {
		.words {
			position: absolute;
			top: 0;
			left: 0;
			width: 37%;
			padding: clamp(1.6rem, 3.6vw, 3.4rem) 0 0 var(--gutter);
			color: #fff;
			mix-blend-mode: difference;
			pointer-events: none;
		}

		.words a {
			pointer-events: auto;
		}

		.kicker,
		.lede,
		.calls a :global(svg) {
			color: inherit;
		}

		h1 {
			font-size: clamp(2.6rem, 3.5vw, 4rem);
		}

		.lede {
			font-size: clamp(1.02rem, 1.25vw, 1.25rem);
		}

		.calls {
			flex-direction: column;
			align-items: flex-start;
			font-size: clamp(1.05rem, 1.3vw, 1.25rem);
		}

		.calls a:focus-visible {
			outline: 1.5px solid #fff;
			outline-offset: 4px;
		}
	}

	.caption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem 2rem;
		margin: 1rem 0 0;
		padding: 0 var(--gutter);
		color: var(--text-dim);
		font: italic 400 0.98rem/1.5 var(--font-serif);
	}

	.caption > span:first-child {
		max-width: 44rem;
	}

	.facts {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0 0.5rem;
		color: var(--text-faint);
		font-style: normal;
	}

	.facts a {
		color: var(--text-dim);
	}

	/* --- the sections ----------------------------------------------------------------------------------------- */

	section:not(.banner) {
		max-width: 72rem;
		margin: clamp(4.5rem, 10vh, 7rem) auto 0;
		padding: 0 var(--gutter);
		scroll-margin-top: 1rem;
	}

	.head {
		max-width: 44rem;
		margin-bottom: 2.2rem;
	}

	h2 {
		margin: 0;
		font: 300 clamp(2rem, 4vw, 2.9rem) / 1.1 var(--font-serif);
		font-variation-settings: 'opsz' 60;
		letter-spacing: -0.015em;
		scroll-margin-top: 1.5rem;
	}

	.head p {
		margin: 0.7rem 0 0;
		color: var(--text-dim);
		font-size: 1.15rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	.head strong {
		color: var(--text);
		font-weight: 500;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* --- the parts -------------------------------------------------------------------------------------------- */

	.gallery {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(3rem, 6vw, 4.5rem) clamp(2rem, 4vw, 3.5rem);
	}

	.part {
		--tone: color-mix(in oklab, var(--accent) calc(var(--k) * 100%), var(--accent-2));
		scroll-margin-top: 1.5rem;
	}

	.opening {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.picture {
		display: block;
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.picture.poster img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 3px;
	}

	.picture.drawing {
		padding: 0.4rem 0;
	}

	.number {
		display: block;
		margin-top: 1.1rem;
		color: var(--tone);
		font: italic 400 1.02rem/1.2 var(--font-serif);
	}

	h3 {
		margin: 0.25rem 0 0;
		font: 400 clamp(1.4rem, 2.2vw, 1.75rem) / 1.2 var(--font-serif);
		text-wrap: balance;
	}

	.opening:hover h3 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	.opening:focus-visible {
		outline: none;
	}

	.opening:focus-visible .picture {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.opening:focus-visible h3 {
		text-decoration: underline;
	}

	.line {
		margin: 0.45rem 0 0;
		color: var(--text-dim);
		font-size: 1.05rem;
		line-height: 1.5;
		text-wrap: pretty;
	}

	details {
		margin-top: 0.7rem;
	}

	summary {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--text-faint);
		font: italic 400 1rem/1.4 var(--font-serif);
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary :global(svg) {
		flex: none;
		transition: rotate 0.15s;
		rotate: -90deg;
	}

	details[open] summary :global(svg) {
		rotate: 0deg;
	}

	summary:hover span {
		color: var(--text-dim);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}

	.chapters {
		margin: 0.6rem 0 0;
		padding-left: 0.2rem;
	}

	.chapters li {
		display: flex;
		gap: 0.8rem;
		padding: 0.16rem 0;
		font-size: 0.98rem;
		line-height: 1.4;
	}

	.chapters .id {
		flex: none;
		min-width: 2.6em;
		color: var(--tone);
		font-variant-numeric: tabular-nums;
	}

	.chapters a {
		text-decoration-thickness: 1px;
	}

	.chapters .reading {
		margin-left: 0.35em;
		color: var(--text-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		summary :global(svg) {
			transition: none;
		}
	}

	/* --- the routes: cards ------------------------------------------------------------------------------------ */

	.cards {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(3rem, 6vw, 4.5rem) clamp(2rem, 4vw, 3.5rem);
	}

	.route {
		scroll-margin-top: 1.5rem;
	}

	.destination {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	.destination img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 2.35;
		object-fit: cover;
		border-radius: 3px;
	}

	.destination h3 {
		margin-top: 0.9rem;
	}

	.destination:hover h3 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	.destination:focus-visible {
		outline: none;
	}

	.destination:focus-visible img {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.length {
		margin: 0.3rem 0 1.6rem;
		color: var(--text-dim);
		font-style: italic;
		font-size: 1.02rem;
	}

	.start {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		margin-top: 0.6rem;
		color: var(--text);
		font-size: 1.08rem;
		font-style: italic;
		text-decoration: none;
	}

	.start :global(svg) {
		color: var(--accent);
	}

	.start span {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.28em;
	}

	.start:hover span {
		text-decoration-thickness: 2px;
	}

	/* --- the equations ---------------------------------------------------------------------------------------- */

	.key {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 1.6rem;
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.95rem;
		font-style: italic;
	}

	.sample {
		width: 0.9rem;
		height: 0.9rem;
		border: 1px solid var(--accent-2);
	}

	.sample.derived {
		border-color: transparent;
		background: color-mix(in oklab, var(--accent-2) 30%, var(--bg));
	}

	.key .item {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.ramp {
		width: 3.5rem;
		height: 0.35rem;
		background: linear-gradient(90deg, var(--accent-2), var(--accent));
	}

	.closing {
		display: flex;
		gap: 0.6rem;
		max-width: 72rem;
		margin: clamp(4.5rem, 10vh, 7rem) auto 0;
		padding: 0 var(--gutter);
		color: var(--text-dim);
		font-size: 1.15rem;
		font-style: italic;
		line-height: 1.5;
	}

	.closing :global(svg) {
		flex: none;
		margin-top: 0.2rem;
		color: var(--accent);
	}

	/* --- a phone ---------------------------------------------------------------------------------------------- */

	@media (max-width: 44rem) {
		.gallery,
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}

		.pictures img {
			aspect-ratio: 1.7;
			object-position: 62% 60%;
		}
	}
</style>
