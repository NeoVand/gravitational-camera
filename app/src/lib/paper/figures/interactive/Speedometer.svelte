<script lang="ts">
	import {
		Compass01Icon,
		DashboardSpeed01Icon,
		PauseIcon,
		Rocket01Icon,
		WorkoutRunIcon
	} from '@hugeicons/core-free-icons';
	import SpeedometerView from '../../../ui/Speedometer.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import Slider from '../../../ui/controls/Slider.svelte';
	import type { Vec3 } from '../../../pixel/complex';
	import { lightReading, reading, type Thing } from '../../../pixel/speedometer';
	import Frame from './Frame.svelte';

	const ROOM: Thing[] = [
		{ position: [-2.6, 1.7, 0.6], mass: 6e3, charge: 1 },
		{ position: [0.6, -1.9, -0.4], mass: 3e3, charge: -0.6 },
		{ position: [1.6, 2.1, 0.3], mass: 8e3, charge: 0.8 },
		{ position: [3.4, -1.2, 0.5], mass: 4e3, charge: 0.5 }
	];
	let speed = $state(0.6);
	let heading = $state(300);
	let pixel: Vec3 = $state([-1.2, 0.1, 0]);
	let mover: 'still' | 'walk' | 'fast' = $state('still');
	const v: Vec3 = $derived([
		speed * Math.cos((heading * Math.PI) / 180),
		speed * Math.sin((heading * Math.PI) / 180),
		0
	]);
	const room: Thing[] = $derived(
		ROOM.map((t, i) =>
			i === 1 && mover !== 'still'
				? { ...t, velocity: [0, mover === 'walk' ? 1.5 / 299_792_458 : 0.05, 0] as Vec3 }
				: t
		)
	);
	const g = $derived(reading(room, pixel, v));
	const l = $derived(lightReading(ROOM, pixel, v));
</script>

<Frame
	slug="speedometer"
	aspect={16 / 11}
	vars="--figure-width: min(96cqw, 128cqh); --stage-pad: 0.6rem 0.6rem 2.6rem"
>
	{#snippet stage()}
		<SpeedometerView
			{room}
			{pixel}
			{v}
			gravity={g.read}
			light={l}
			alarm={g.alarm}
			onmove={(p) => (pixel = p)}
		/>
	{/snippet}
	{#snippet controls()}
		<Slider
			id="speedometer-speed"
			label="Speed"
			icon={DashboardSpeed01Icon}
			min={0}
			max={0.9}
			step={0.01}
			bind:value={speed}
			readout="{speed.toFixed(2)} c"
		/>
		<Slider
			id="speedometer-heading"
			label="Heading"
			icon={Compass01Icon}
			min={0}
			max={360}
			step={1}
			bind:value={heading}
			readout="{heading}°"
		/>
		<Segmented
			label="One of the masses"
			options={[
				{ value: 'still', label: 'Still', icon: PauseIcon },
				{ value: 'walk', label: 'Walks', icon: WorkoutRunIcon },
				{ value: 'fast', label: 'Flies', icon: Rocket01Icon }
			]}
			bind:value={mover}
		/>
	{/snippet}
</Frame>
