<script lang="ts">
	/**
	 * A near-field demo in a room: ordinary light on one side, the mass seen by
	 * the gravitational camera on the other, with the blur that the chosen
	 * sensitivity leaves.
	 */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ViewIcon } from '@hugeicons/core-free-icons';
	import {
		MODE_LIGHT,
		MODE_NEAR,
		analyzeScene,
		cameraBasis,
		columnsAlong,
		type Scene,
		type View
	} from '../engine';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import TensorField from './TensorField.svelte';
	import { length, superscript } from './format';

	interface Props {
		scene: Scene;
		/** Distance to the objects of interest, metres, for the blur readout. */
		subjectDistance: number;
		/** Where the divider starts, 0 to 1. */
		startDivider?: number;
		intro: Snippet;
	}

	let { scene, subjectDistance, startDivider = 0.5, intro }: Props = $props();

	const DEG = Math.PI / 180;
	// turned a little to the left, so the objects sit clear of the notes
	const START: View = { yaw: 13 * DEG, pitch: -13 * DEG, fov: 58 * DEG };

	let view: View = $state(START);
	// svelte-ignore state_referenced_locally
	let divider = $state(startDivider);
	let outline = $state(true);
	let showLight = $state(true);
	let showGravity = $state(true);
	/** Signal-to-noise ratio as a power of ten. */
	let sensitivity = $state(20);
	let brightness = $state(0);
	let display: 'image' | 'pixels' = $state('image');
	let differences = $state(true);

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	const exclusion = $derived(scene.observer.exclusion ?? 0.25);

	// the near-field resolution law: full width of the blur is pi / ln(SNR)
	const blurAngle = $derived(Math.PI / (sensitivity * Math.LN10));
	const blurSigma = $derived(blurAngle / 2.355);
	const centre = $derived(columnsAlong(objects, observer, cameraBasis(view).forward, exclusion));
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
			rightMode={MODE_NEAR}
			exposure={2.2 * 10 ** brightness}
			nearBlur={blurSigma}
			{exclusion}
			room
			{outline}
			rightLabel={display === 'image' ? 'Gravity · near field' : 'Gravity · what the pixels record'}
			dimRight={display === 'pixels'}
		>
			{#snippet overlay()}
				{#if display === 'pixels'}
					<TensorField {objects} {observer} {view} {differences} />
				{/if}
			{/snippet}
		</SplitView>
	{/snippet}

	{#snippet controls()}
		<div class="row">
			<label for="sensitivity">Sensitivity</label>
			<input id="sensitivity" type="range" min="1" max="60" step="0.5" bind:value={sensitivity} />
			<output for="sensitivity">
				signal-to-noise 10{superscript(sensitivity)} · blur {(blurAngle / DEG).toFixed(1)}°
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
					Raw pixels
				</button>
			</span>
			{#if display === 'pixels'}
				<label class="check">
					<input type="checkbox" bind:checked={differences} /> Differences only
				</label>
			{/if}
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
		<dl>
			<div>
				<dt>Smallest detail at {length(subjectDistance)}</dt>
				<dd>{length(blurAngle * subjectDistance)}</dd>
			</div>
			<div>
				<dt>Mass along the centre of view, weighted by 1/distance</dt>
				<dd>{centre.tidalColumn.toFixed(0)} kg/m³</dd>
			</div>
		</dl>
		<p class="fine">
			The gravity side is the expected reconstruction: mass along each line of sight, weighted by
			the inverse of its distance, blurred by the limit that noise sets. “Raw pixels” shows what the
			camera records before any image is computed. Drag to look around, scroll to zoom.
		</p>
	{/snippet}
</DemoShell>
