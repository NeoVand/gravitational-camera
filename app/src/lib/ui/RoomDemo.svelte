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
		MODE_THERMAL,
		analyzeScene,
		cameraBasis,
		columnsAlong,
		nearFieldBlur,
		type Scene,
		type View
	} from '../engine';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import TensorField from './TensorField.svelte';
	import { length, sci, superscript } from './format';

	interface Props {
		scene: Scene;
		/** Distance to the objects of interest, metres, for the blur readout. */
		subjectDistance: number;
		/** Where the divider starts, 0 to 1. */
		startDivider?: number;
		/** Which gravitational view the demo is about. */
		gravity?: 'near' | 'thermal';
		/** Starting direction of view, degrees. */
		look?: { yaw: number; pitch: number; fov?: number };
		/** Start with the empty room subtracted from the gravity view. */
		subtract?: boolean;
		intro: Snippet;
	}

	let {
		scene,
		subjectDistance,
		startDivider = 0.5,
		gravity = 'near',
		// turned a little to the left, so the objects sit clear of the notes
		look = { yaw: 13, pitch: -13 },
		subtract = false,
		intro
	}: Props = $props();

	const DEG = Math.PI / 180;
	// svelte-ignore state_referenced_locally
	const START: View = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: (look.fov ?? 58) * DEG };

	let view: View = $state({ ...START });
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
	// svelte-ignore state_referenced_locally
	let subtractRoom = $state(subtract);

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	const exclusion = $derived(scene.observer.exclusion ?? 0.25);
	const hasRoom = $derived(objects.some((o) => o.background));

	// the near-field resolution law (paper, eq. resolution): full width at half
	// maximum of the best reconstruction of a point, for a planar array
	const blurAngle = $derived(nearFieldBlur(sensitivity));
	const blurSigma = $derived(blurAngle / 2.355);
	const centre = $derived(
		columnsAlong(objects, observer, cameraBasis(view).forward, exclusion, subtractRoom)
	);
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
			rightMode={gravity === 'near' ? MODE_NEAR : MODE_THERMAL}
			exposure={(gravity === 'near' ? 2.2 : 1.6) * 10 ** brightness}
			nearBlur={blurSigma}
			{exclusion}
			room
			{outline}
			{subtractRoom}
			rightLabel={gravity === 'thermal'
				? 'Gravity · thermal'
				: display === 'image'
					? 'Gravity · near field'
					: 'Gravity · what the pixels record'}
			dimRight={gravity === 'near' && display === 'pixels'}
		>
			{#snippet overlay()}
				{#if gravity === 'near' && display === 'pixels'}
					<TensorField {objects} {observer} {view} {differences} {subtractRoom} />
				{/if}
			{/snippet}
		</SplitView>
	{/snippet}

	{#snippet controls()}
		{#if gravity === 'near'}
			<div class="row">
				<label for="sensitivity">Sensitivity</label>
				<input id="sensitivity" type="range" min="1" max="60" step="0.5" bind:value={sensitivity} />
				<output for="sensitivity">
					signal-to-noise 10{superscript(sensitivity)} · blur {(blurAngle / DEG).toFixed(1)}°
				</output>
			</div>
		{/if}
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
			<output for="brightness">
				{gravity === 'near'
					? `× ${(10 ** brightness).toFixed(brightness < 0 ? 2 : 1)}`
					: `× 10${superscript(Math.round(brightness))}`}
			</output>
		</div>
		<div class="buttons">
			{#if gravity === 'near'}
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
			{/if}
			<button type="button" onclick={() => (view = { ...START })}>
				<HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={1.8} /> Reset view
			</button>
			{#if hasRoom}
				<label class="check">
					<input type="checkbox" bind:checked={subtractRoom} /> Subtract the empty room
				</label>
			{/if}
			<label class="check"><input type="checkbox" bind:checked={outline} /> Outline</label>
			<label class="check"><input type="checkbox" bind:checked={showLight} /> Light</label>
			<label class="check"><input type="checkbox" bind:checked={showGravity} /> Gravity</label>
		</div>
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		{#if gravity === 'near'}
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
				the inverse of its distance, blurred by the limit that noise sets. “Outline” adds a faint
				copy of the shapes in the ordinary picture so they can be matched to masses. “Raw pixels”
				shows what the camera records before any image is computed. Drag to look around, scroll to
				zoom.
			</p>
			{#if hasRoom}
				<p class="fine">
					“Subtract the empty room” removes the pull of the floor and walls. Gravity adds up
					linearly, so a reading taken with the room empty can be taken away exactly; what is left
					is everything that was brought in.
				</p>
			{/if}
		{:else}
			<dl>
				<div>
					<dt>Expected brightness at the centre of view</dt>
					<dd>{sci(centre.numberRadiance)} gravitons s⁻¹ m⁻² sr⁻¹</dd>
				</div>
			</dl>
			<p class="fine">
				The gravity side is the expected thermal image: the glow of everything along each line of
				sight, with colour standing for temperature. At these rates a real detector would wait far
				longer than the age of the universe for a single graviton. Friction values are assumptions.
				Drag to look around, scroll to zoom.
			</p>
			{#if hasRoom}
				<p class="fine">
					“Subtract the empty room” removes the glow of the floor and walls, which is known in
					advance. Glows add up, so this is exact.
				</p>
			{/if}
		{/if}
	{/snippet}
</DemoShell>
