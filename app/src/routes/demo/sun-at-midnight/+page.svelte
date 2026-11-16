<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowDown02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
	import {
		cameraBasis,
		chordThrough,
		columnsAlong,
		referenceRadiance,
		type View
	} from '#lib/engine/index.js';
	import { aim, formatClock, objectsAt, scene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import { km, sci, superscript } from '#lib/ui/format.js';
	import DemoShell from '#lib/ui/DemoShell.svelte';
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

	const observer = scene.observer.position;
	const objects = $derived(objectsAt(hours));
	const sun = $derived(sunDirection(hours));
	const sunAltitude = $derived(Math.asin(sun[1]) / DEG);
	const exposure = $derived(1.2 * 10 ** decades);

	// what lies along the centre of the view
	const centre = $derived.by(() => {
		const { forward } = cameraBasis(view);
		const earth = objects.find((o) => o.id === 'earth')!;
		const path = chordThrough(earth, observer, forward);
		return { path, ...columnsAlong(objects, observer, forward) };
	});

	const sunRatio = $derived(
		columnsAlong(objects, observer, sun).numberRadiance / referenceRadiance(objects, observer)
	);

	function lookDown() {
		view = { ...DOWN };
		decades = 0;
	}

	function findTheSun() {
		view = { ...aim(sun), fov: 1.6 * DEG };
		decades = -Math.log10(sunRatio);
	}
</script>

<svelte:head>
	<title>The Sun at midnight · The Gravitational Camera</title>
	<meta
		name="description"
		content="Look down through the Earth at night: ordinary light on one side, thermal gravitational radiation on the other."
	/>
</svelte:head>

<DemoShell title="The Sun at midnight">
	{#snippet stage()}
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
	{/snippet}

	{#snippet controls()}
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
		<div class="buttons">
			<button type="button" onclick={lookDown}>
				<HugeiconsIcon icon={ArrowDown02Icon} size={16} strokeWidth={1.8} /> Look down
			</button>
			<button type="button" onclick={findTheSun}>
				<HugeiconsIcon icon={Sun03Icon} size={16} strokeWidth={1.8} /> Find the Sun
			</button>
			<label class="check"><input type="checkbox" bind:checked={showLight} /> Light</label>
			<label class="check"><input type="checkbox" bind:checked={showGravity} /> Gravity</label>
		</div>
	{/snippet}

	{#snippet notes()}
		<p>
			You are standing on Earth’s night side. On the <strong>light</strong> side the ground is
			opaque. On the <strong>gravity</strong> side nothing is: you see the glow of warm matter all the
			way through the planet, and the Sun’s core beyond it.
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
				<dt>Sun’s core against Earth’s interior</dt>
				<dd>{sci(sunRatio)} × brighter</dd>
			</div>
		</dl>
		<p class="fine">
			This is the expected image, not a photograph: at these rates a real detector would count
			single gravitons. Colour stands for source temperature. Earth’s internal friction is an
			assumed placeholder. Drag to look around, scroll to zoom.
		</p>
	{/snippet}
</DemoShell>
