<script lang="ts">
	/**
	 * A wave demo in a room: ordinary light on one side, the gravitational waves
	 * of whatever spins on the other. At the true speed of light the waves are
	 * far longer than the room, which then lies inside their near zone, so the
	 * demo offers a clearly labelled teaching mode in which light (and gravity)
	 * are slowed until the waves are centimetres long.
	 */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ViewIcon } from '@hugeicons/core-free-icons';
	import {
		MODE_LIGHT,
		MODE_WAVES,
		analyzeScene,
		gravitonRate,
		packWaves,
		power,
		rotors as findRotors,
		seenFrom,
		spotWidth,
		wavelength,
		type Scene,
		type View
	} from '../engine';
	import { C } from '../engine/physics/constants';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import WaveGlyphs from './WaveGlyphs.svelte';
	import { length, sci, superscript } from './format';

	interface Props {
		scene: Scene;
		/** Where the divider starts, 0 to 1. */
		startDivider?: number;
		/** Starting direction of view, degrees. */
		look?: { yaw: number; pitch: number; fov?: number };
		/** Width of the camera's array of sensors, m. */
		aperture?: number;
		/** The slowed speed of light the demo starts with, m/s. */
		slowSpeed?: number;
		intro: Snippet;
	}

	let {
		scene,
		startDivider = 0.5,
		look = { yaw: 0, pitch: -10 },
		aperture = 1,
		slowSpeed = 0.2,
		intro
	}: Props = $props();

	const DEG = Math.PI / 180;
	// svelte-ignore state_referenced_locally
	const START: View = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: (look.fov ?? 58) * DEG };
	const LOG_C = Math.log10(C);

	let view: View = $state({ ...START });
	// svelte-ignore state_referenced_locally
	let divider = $state(startDivider);
	// svelte-ignore state_referenced_locally
	let logSpeed = $state(Math.log10(slowSpeed));
	let brightness = $state(0);
	let display: 'image' | 'pixels' = $state('image');
	let outline = $state(true);
	let showLight = $state(true);
	let showGravity = $state(true);

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	const rotors = $derived(findRotors(objects));
	const trueSpeed = $derived(logSpeed >= LOG_C - 1e-9);
	const speed = $derived(trueSpeed ? C : 10 ** logSpeed);

	const nearest = $derived(Math.min(...rotors.map((r) => seenFrom(r, observer).distance)));
	const lambda = $derived(Math.max(...rotors.map((r) => wavelength(r, speed))));
	// the radiation is only formed beyond about a wavelength over 2 pi
	const inNearZone = $derived(lambda / (2 * Math.PI) > nearest / 2);
	const spot = $derived(spotWidth(lambda, aperture));
	const waves = $derived(
		inNearZone
			? { buffer: new ArrayBuffer(48), count: 0 }
			: packWaves(rotors, observer, { c: speed, aperture })
	);
	const split = $derived(showLight && showGravity ? divider : showLight ? 1 : 0);
	const trueLambda = $derived(Math.max(...rotors.map((r) => wavelength(r))));
	const slowLambda = $derived(Math.max(...rotors.map((r) => wavelength(r, slowSpeed))));

	const powerTrue = $derived(rotors.length ? power(rotors[0]) : 0);
	const yearsPerGraviton = $derived(
		rotors.length ? 1 / gravitonRate(rotors[0]) / (365.25 * 86400) : 0
	);

	function speedText(c: number): string {
		if (c >= C * 0.999) return 'the true speed of light';
		if (c < 1) return `${Math.round(c * 100)} cm/s`;
		if (c < 1000) return `${c.toFixed(c < 10 ? 1 : 0)} m/s`;
		return `${sci(c)} m/s`;
	}
</script>

<DemoShell title={scene.title}>
	{#snippet stage()}
		<SplitView
			{objects}
			{observer}
			sunDirection={[0, 1, 0]}
			bind:view
			bind:divider
			{showLight}
			{showGravity}
			leftMode={MODE_LIGHT}
			rightMode={MODE_WAVES}
			{waves}
			waveExposure={2.2 * 10 ** brightness}
			room
			{outline}
			rightLabel={trueSpeed
				? 'Gravity · waves'
				: `Gravity · waves · light slowed to ${speedText(speed)}`}
			dimRight={display === 'pixels' || inNearZone}
		>
			{#snippet overlay()}
				{#if inNearZone}
					<p class="notice">
						At {speedText(speed)} these waves are {length(lambda).replace(' ', ' ')} long, and the drums
						lie deep inside their near zone. There is no wave image to form: here the camera sees only
						the moving masses. Slow the light down to see the waves.
					</p>
				{:else if display === 'pixels'}
					<WaveGlyphs {rotors} {observer} {view} {split} />
				{/if}
			{/snippet}
		</SplitView>
	{/snippet}

	{#snippet controls()}
		<div class="row">
			<label for="speed">Speed of light</label>
			<input id="speed" type="range" min="-1" max={LOG_C} step="0.01" bind:value={logSpeed} />
			<output for="speed">
				{trueSpeed ? 'true speed' : `slowed to ${speedText(speed)}`} · waves {length(lambda)}
			</output>
		</div>
		<div class="row">
			<label for="brightness">Exposure</label>
			<input
				id="brightness"
				type="range"
				min="-1.5"
				max="1.5"
				step="0.05"
				bind:value={brightness}
			/>
			<output for="brightness">× {(10 ** brightness).toFixed(brightness < 0 ? 2 : 1)}</output>
		</div>
		<div class="buttons">
			<span class="segmented" role="group" aria-label="What the gravity side shows">
				<button
					type="button"
					aria-pressed={display === 'image'}
					onclick={() => (display = 'image')}
				>
					Image
				</button>
				<button
					type="button"
					aria-pressed={display === 'pixels'}
					onclick={() => (display = 'pixels')}
				>
					What the pixels record
				</button>
			</span>
			<button type="button" onclick={() => (logSpeed = Math.log10(slowSpeed))}>Slow light</button>
			<button type="button" onclick={() => (logSpeed = LOG_C)}>True speed</button>
			<button type="button" onclick={() => (view = { ...START })}>
				<HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={1.8} /> Reset view
			</button>
			<label class="check"><input type="checkbox" bind:checked={outline} /> Outline</label>
			<label class="check"><input type="checkbox" bind:checked={showLight} /> Light</label>
			<label class="check"><input type="checkbox" bind:checked={showGravity} /> Gravity</label>
		</div>
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		<ul class="legend" aria-label="Colours of the wave view">
			<li><span class="chip anticlockwise"></span> turning anticlockwise, as the camera sees it</li>
			<li><span class="chip clockwise"></span> turning clockwise</li>
			<li><span class="chip edge"></span> seen edge-on</li>
		</ul>
		<dl>
			<div>
				<dt>Wavelength · smallest detail with a {length(aperture)} array</dt>
				<dd>{length(lambda)} · {inNearZone ? 'none' : `${(spot / DEG).toFixed(1)}°`}</dd>
			</div>
			<div>
				<dt>Power radiated by one turning pair, at the true speed of light</dt>
				<dd>{sci(powerTrue)} W: one graviton every {sci(yearsPerGraviton)} years</dd>
			</div>
		</dl>
		<p class="fine">
			The slowed speed is a teaching device, and is labelled wherever it is on. Slowing light to {speedText(
				slowSpeed
			)} shrinks these waves from {length(trueLambda).replace(' ', '\u00a0')} to {length(
				slowLambda
			)}, which the camera can resolve, and makes them about 10{superscript(
				Math.round(5 * Math.log10(C / slowSpeed))
			)} times stronger. The polarization, which tells the sense of turning, does not depend on it. “What
			the pixels record” shows the pattern of stretching that passes over the camera from each drum.
		</p>
	{/snippet}
</DemoShell>

<style>
	.notice {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		width: min(26rem, 80%);
		margin: 0;
		padding: 1rem 1.2rem;
		border-radius: 0.8rem;
		background: rgb(10 12 18 / 0.78);
		color: #e8e6e0;
		font-size: 0.92rem;
		line-height: 1.5;
		text-align: center;
	}

	.legend {
		list-style: none;
		padding: 0;
		margin: 0.8rem 0;
		display: grid;
		gap: 0.35rem;
		font-size: 0.86rem;
	}

	.legend li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.chip {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		flex: none;
	}

	/* the same colours as WAVE_* in engine/wgsl/waves.wgsl */
	.anticlockwise {
		background: rgb(250 87 219);
	}

	.clockwise {
		background: rgb(102 242 117);
	}

	.edge {
		background: rgb(237 237 224);
	}
</style>
