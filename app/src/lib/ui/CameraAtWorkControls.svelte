<script lang="ts">
	/**
	 * The controls of "The camera at work": the array and its noise, which exposure, which image, and what is really
	 * in the safe. They set lib/array/workbench.svelte.ts; the view beside them shows what the worker sends back.
	 */
	import {
		CircleIcon,
		CubeIcon,
		DiceIcon,
		GridViewIcon,
		Maximize01Icon,
		PlusSignIcon,
		Radar01Icon,
		RecordIcon,
		UnavailableIcon
	} from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { noiseForSnr, labSnr, type Contents } from '../array/camera';
	import { ratio } from '../array/present';
	import type { SafeCamera } from '../array/workbench.svelte';
	import { length, tidal } from './format';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import Toggle from './controls/Toggle.svelte';

	interface Props {
		camera: SafeCamera;
	}

	let { camera }: Props = $props();

	const spacing = $derived(camera.side / (camera.n - 1));
	const sigma = $derived(noiseForSnr(10 ** camera.decades, spacing));

	/** The signal-to-noise ratios the paper's worked case quotes; 34 is not on a step of the slider. */
	const PAPER = [10, 34, 1e3, 1e6];

	const inside: { value: Contents; label: string; icon: typeof CubeIcon; wide?: boolean }[] = [
		{ value: 'bar-left', label: 'Bar, left', icon: CubeIcon },
		{ value: 'bar-right', label: 'Bar, right', icon: CubeIcon },
		{ value: 'sphere', label: 'Sphere', icon: CircleIcon },
		{ value: 'point', label: 'Point', icon: RecordIcon },
		{ value: 'nothing', label: 'Nothing', icon: UnavailableIcon, wide: true }
	];
</script>

<Group title="Array">
	<Slider
		id="snr"
		label="Signal to noise"
		icon={Radar01Icon}
		min={0}
		max={6}
		step={0.01}
		bind:value={camera.decades}
		readout={ratio(10 ** camera.decades)}
		mark={{ at: Math.log10(labSnr(spacing)), label: 'best gradiometer today, in 1 s' }}
	/>
	<div class="presets" role="group" aria-label="The paper’s signal-to-noise ratios">
		<span>the paper’s</span>
		{#each PAPER as snr (snr)}
			<button
				type="button"
				aria-label="Signal-to-noise ratio {ratio(snr)}"
				aria-pressed={Math.abs(camera.decades - Math.log10(snr)) < 1e-9}
				onclick={() => (camera.decades = Math.log10(snr))}
			>
				{snr === 1e6 ? '10⁶' : ratio(snr)}
			</button>
		{/each}
	</div>
	<Slider
		id="side"
		label="Side"
		icon={Maximize01Icon}
		min={0.25}
		max={4}
		step={0.25}
		bind:value={camera.side}
		readout="{camera.side.toFixed(2)} m"
	/>
	<Slider
		id="pixels"
		label="Pixels"
		icon={GridViewIcon}
		min={5}
		max={21}
		step={1}
		bind:value={camera.n}
		readout="{camera.n} × {camera.n}"
	/>
	<div class="actions">
		<button type="button" class="action" onclick={() => camera.newExposure()}>
			<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.8} /> New exposure
		</button>
		<span class="count">exposure {camera.seed}</span>
	</div>
	<p class="hint">
		Pixels {length(spacing)} apart, each component read with noise σ = {tidal(sigma)}.
	</p>
</Group>
<Group title="Image">
	<div class="toggles">
		<Toggle
			icon={PlusSignIcon}
			label="Positivity"
			hint="Mass is never negative. With this on, the image is the best fit in which no cell’s mass is below zero."
			bind:checked={camera.positive}
		/>
	</div>
</Group>
<Group title="What is inside">
	<Segmented label="What is really in the safe" options={inside} bind:value={camera.contents} />
	<p class="hint">The camera is not told. It sees only the readings.</p>
</Group>

<style>
	.presets {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: -0.3rem;
		font-size: 0.68rem;
		color: var(--text-faint);
	}

	.presets span {
		margin-right: auto;
	}

	.presets button {
		padding: 0.22rem 0.5rem;
		border-radius: 7px;
		border: 1px solid rgb(255 255 255 / 0.1);
		background: rgb(255 255 255 / 0.04);
		color: var(--text-dim);
		font: 400 0.7rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.presets button:hover {
		color: var(--text);
		border-color: rgb(255 255 255 / 0.2);
	}

	.presets button[aria-pressed='true'] {
		color: var(--text);
		background: rgb(232 164 90 / 0.12);
		border-color: rgb(232 164 90 / 0.45);
	}

	.presets button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.count {
		align-self: center;
		font: 400 0.72rem/1 var(--font-mono);
		color: var(--text-faint);
	}

	.hint {
		margin: 0;
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--text-faint);
	}
</style>
