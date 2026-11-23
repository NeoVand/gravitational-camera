<script lang="ts">
	import {
		DashboardCircleIcon,
		GridIcon,
		StarsIcon,
		SunCloud01Icon
	} from '@hugeicons/core-free-icons';
	import OnePixelSky from '../../../ui/OnePixelSky.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import { SKIES } from '../../../pixel/sky';
	import Frame from './Frame.svelte';

	let choice = $state<'icosahedron' | 'uniform' | 'octahedron' | 'two'>('icosahedron');
	let yaw = $state(0.3);
	let pitch = $state(0.35);
</script>

<Frame
	slug="one-pixel-sky"
	aspect={16 / 8}
	vars="--figure-width: min(25cqw, calc(100cqh - 5.5rem)); --stage-pad: 1rem 1.2rem 0.8rem"
	narrow={{ aspect: 1.15, vars: '--figure-width: initial' }}
>
	{#snippet stage()}
		<OnePixelSky sources={SKIES[choice].sources} bind:yaw bind:pitch />
	{/snippet}
	{#snippet controls()}
		<Segmented
			label="Sources"
			options={[
				{ value: 'icosahedron', label: 'Twelve', icon: StarsIcon },
				{ value: 'uniform', label: 'Uniform', icon: SunCloud01Icon },
				{ value: 'octahedron', label: 'Six', icon: GridIcon },
				{ value: 'two', label: 'Two', icon: DashboardCircleIcon }
			]}
			bind:value={choice}
		/>
	{/snippet}
</Frame>
