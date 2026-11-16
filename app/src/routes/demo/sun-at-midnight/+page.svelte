<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		cameraBasis,
		columnsAlong,
		referenceRadiance,
		sphereChord,
		type View
	} from '#lib/engine/index.js';
	import { aim, formatClock, objectsAt, scene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import SplitView from '#lib/ui/SplitView.svelte';

	const DEG = Math.PI / 180;
	const START: View = { yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG };
	const DOWN: View = { yaw: 16 * DEG, pitch: -62 * DEG, fov: 84 * DEG };

	let hours = $state(0);
	let view: View = $state(START);
	let divider = $state(0.4);
	let showLight = $state(true);
	let showGravity = $state(true);
	/** Exposure in decades relative to "exposed for Earth's interior". */
	let decades = $state(0);
	let infoOpen = $state(true);

	// On a phone the notes would cover the picture, so start with them closed.
	$effect(() => {
		if (window.matchMedia('(max-width: 640px)').matches) infoOpen = false;
	});

	const observer = scene.observer.position;
	const objects = $derived(objectsAt(hours));
	const sun = $derived(sunDirection(hours));
	const sunAltitude = $derived(Math.asin(sun[1]) / DEG);
	const exposure = $derived(1.2 * 10 ** decades);

	// what lies along the centre of the view
	const centre = $derived.by(() => {
		const { forward } = cameraBasis(view);
		const earth = objects.find((o) => o.id === 'earth')!;
		const path = sphereChord(earth.center, earth.radius, observer, forward);
		const columns = columnsAlong(objects, observer, forward);
		return { path, ...columns };
	});

	const sunBrightness = $derived.by(() => {
		const core = objects.find((o) => o.id === 'sun-core')!;
		const through = columnsAlong(objects, observer, sun).numberRadiance;
		return { ratio: through / referenceRadiance(objects, observer), radius: core.radius };
	});

	function lookDown() {
		view = { ...DOWN };
		decades = 0;
	}

	function findTheSun() {
		view = { ...aim(sun), fov: 1.6 * DEG };
		decades = -Math.log10(sunBrightness.ratio);
	}

	const km = (m: number) =>
		m >= 1e6 ? `${Math.round(m / 1e3).toLocaleString('en-US')} km` : `${Math.round(m)} m`;
	const sci = (x: number) => {
		if (x === 0) return '0';
		const e = Math.floor(Math.log10(Math.abs(x)));
		return `${(x / 10 ** e).toFixed(1)} × 10${superscript(e)}`;
	};
	const superscript = (n: number) =>
		String(n).replace(/[-0-9]/g, (c) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(c)]);
</script>

<svelte:head>
	<title>The Sun at midnight · The Gravitational Camera</title>
	<meta
		name="description"
		content="Look down through the Earth at night: ordinary light on one side, thermal gravitational radiation on the other."
	/>
</svelte:head>

<main class="always-dark">
	<div class="stage">
		<SplitView
			{objects}
			{observer}
			sunDirection={sun}
			bind:view
			bind:divider
			{showLight}
			{showGravity}
			{exposure}
		/>
	</div>

	<header>
		<a class="home" href={resolve('/')}>← The Gravitational Camera</a>
		<h1>The Sun at midnight</h1>
	</header>

	<section class="panel" aria-label="Controls">
		<div class="row">
			<label for="time">Local time</label>
			<input id="time" type="range" min="0" max="24" step="0.05" bind:value={hours} />
			<output for="time">
				{formatClock(hours)} · Sun {Math.abs(sunAltitude).toFixed(0)}°
				{sunAltitude < 0 ? 'below' : 'above'} the horizon
			</output>
		</div>
		<div class="row">
			<label for="exposure">Exposure</label>
			<input id="exposure" type="range" min="-12" max="3" step="0.05" bind:value={decades} />
			<output for="exposure">10{superscript(Math.round(decades))} ×</output>
		</div>
		<div class="row buttons">
			<button type="button" onclick={lookDown}>Look down</button>
			<button type="button" onclick={findTheSun}>Find the Sun</button>
			<label class="check"><input type="checkbox" bind:checked={showLight} /> Light</label>
			<label class="check"><input type="checkbox" bind:checked={showGravity} /> Gravity</label>
			<button type="button" class="quiet" onclick={() => (infoOpen = !infoOpen)}>
				{infoOpen ? 'Hide notes' : 'Notes'}
			</button>
		</div>
	</section>

	{#if infoOpen}
		<aside class="notes">
			<p>
				You are standing on Earth's night side. On the <strong>light</strong> side the ground is
				opaque. On the <strong>gravity</strong> side nothing is: you see the glow of warm matter all the
				way through the planet, and the Sun's core beyond it.
			</p>
			<dl>
				<div>
					<dt>Centre of view passes through</dt>
					<dd>{centre.path > 0 ? km(centre.path) + ' of Earth' : 'no rock'}</dd>
				</div>
				<div>
					<dt>Expected brightness there</dt>
					<dd>{sci(centre.numberRadiance)} gravitons s⁻¹ m⁻² sr⁻¹</dd>
				</div>
				<div>
					<dt>Sun's core vs Earth's interior</dt>
					<dd>{sci(sunBrightness.ratio)} × brighter</dd>
				</div>
			</dl>
			<p class="fine">
				This is the expected image, not a photograph: at these rates a real detector would count
				single gravitons. Colour stands for source temperature. Earth's internal friction is an
				assumed placeholder. Drag to look around, scroll to zoom.
			</p>
			<button type="button" class="close" onclick={() => (infoOpen = false)}>Close</button>
		</aside>
	{/if}
</main>

<style>
	main {
		position: fixed;
		inset: 0;
		display: grid;
		grid-template-rows: 1fr auto;
		background: #000;
	}

	.stage {
		position: relative;
		min-height: 0;
	}

	header {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.9rem var(--gutter);
		pointer-events: none;
	}

	header a,
	header h1 {
		pointer-events: auto;
	}

	.home {
		font-size: 0.8rem;
		color: var(--text-dim);
		text-decoration: none;
	}

	.home:hover {
		color: var(--text);
	}

	h1 {
		margin: 2.4rem 0 0;
		font: 400 clamp(1.5rem, 3vw, 2.2rem) / 1.1 var(--font-serif);
		letter-spacing: -0.01em;
		text-shadow: 0 1px 12px rgb(0 0 0 / 0.8);
	}

	.panel {
		display: grid;
		gap: 0.55rem;
		padding: 0.9rem var(--gutter) 1rem;
		background: var(--bg-raised);
		border-top: 1px solid var(--line);
		font-size: 0.85rem;
	}

	.row {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr) minmax(0, 17rem);
		align-items: center;
		gap: 0.9rem;
	}

	.row label {
		color: var(--text-dim);
	}

	output {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 0.9rem;
	}

	button {
		background: transparent;
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.35em 0.9em;
		cursor: pointer;
	}

	button:hover {
		border-color: var(--text-dim);
	}

	button.quiet {
		margin-left: auto;
		border-color: transparent;
		color: var(--text-dim);
	}

	.check {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		color: var(--text);
	}

	.check input {
		accent-color: var(--accent);
	}

	.notes {
		position: absolute;
		left: var(--gutter);
		bottom: 9.4rem;
		width: min(22rem, calc(100% - 2 * var(--gutter)));
		padding: 1rem 1.1rem;
		background: rgb(10 13 18 / 0.72);
		border: 1px solid var(--line);
		border-radius: 10px;
		backdrop-filter: blur(10px);
		font-size: 0.84rem;
		line-height: 1.5;
	}

	.notes p {
		margin: 0 0 0.8rem;
	}

	dl {
		margin: 0 0 0.8rem;
		display: grid;
		gap: 0.5rem;
	}

	dt {
		color: var(--text-dim);
		font-size: 0.74rem;
	}

	dd {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.fine {
		color: var(--text-dim);
		font-size: 0.76rem;
		margin: 0;
	}

	.close {
		display: none;
	}

	@media (max-width: 640px) {
		main {
			grid-template-rows: auto 1fr auto;
		}

		header {
			position: static;
			grid-row: 1;
			padding: 0.6rem var(--gutter) 0.7rem;
			background: var(--bg-raised);
		}

		h1 {
			margin-top: 0.15rem;
			font-size: 1.35rem;
			text-shadow: none;
		}

		.stage {
			grid-row: 2;
		}

		.panel {
			grid-row: 3;
		}

		.row {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}

		.notes {
			position: fixed;
			inset: auto 0 0 0;
			width: auto;
			max-height: 70svh;
			overflow: auto;
			border-radius: 14px 14px 0 0;
			background: rgb(10 13 18 / 0.96);
			z-index: 5;
		}

		.close {
			display: inline-block;
			margin-top: 0.9rem;
		}
	}
</style>
