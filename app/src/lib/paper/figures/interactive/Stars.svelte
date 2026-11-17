<script lang="ts">
	import {
		Atom02Icon,
		DashboardSpeed01Icon,
		Orbit01Icon,
		SparklesIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import FourStars from '../../../ui/FourStars.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import Slider from '../../../ui/controls/Slider.svelte';
	import type { Vec3 } from '../../../pixel/complex';
	import type { Source, Wave } from '../../../pixel/scene';
	import Frame from './Frame.svelte';

	type Kind = 'body' | 'two' | 'wave' | 'body-wave';
	const K: Vec3 = [0.62, -0.42, 0.66];
	let kind = $state<Kind>('body');
	let speed = $state(0.6);
	let yaw = $state(0.45);
	let pitch = $state(0.25);
	let positions: Vec3[] = $state([
		[-1.5, 0.15, 0.3],
		[0.9, 1.1, 0.6]
	]);
	const sources: Source[] = $derived.by(() => {
		if (kind === 'wave') return [];
		const first: Source = { position: positions[0], mass: 1e3, charge: 1, velocity: [0, speed, 0] };
		if (kind === 'two')
			return [first, { position: positions[1], mass: 450, charge: 0.45, velocity: [0, 0, 0] }];
		return [first];
	});
	const wave: Wave | undefined = $derived(
		kind === 'wave'
			? { k: K, strength: 1 }
			: kind === 'body-wave'
				? { k: K, strength: 0.08 }
				: undefined
	);
</script>

<Frame slug="four-stars" aspect={1} vars="--figure-width: min(48cqh, 90cqw)">
	{#snippet stage()}
		<FourStars {sources} {wave} bind:yaw bind:pitch onmove={(i, p) => (positions[i] = p)} />
	{/snippet}
	{#snippet controls()}
		<Segmented
			label="Sources"
			options={[
				{ value: 'body', label: 'One body', icon: Atom02Icon },
				{ value: 'two', label: 'Two', icon: Orbit01Icon },
				{ value: 'wave', label: 'A wave', icon: WavesIcon },
				{ value: 'body-wave', label: 'Both', icon: SparklesIcon }
			]}
			bind:value={kind}
		/>
		<Slider
			id="stars-speed"
			label="Speed of the first body"
			icon={DashboardSpeed01Icon}
			min={0}
			max={0.95}
			step={0.01}
			bind:value={speed}
			readout="{speed.toFixed(2)} c"
		/>
	{/snippet}
</Frame>
