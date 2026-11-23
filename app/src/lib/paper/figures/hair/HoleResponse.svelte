<script lang="ts">
	/** Fig. hole-response, live: the degree of the tide, and the number a of the test of positive mass. */
	import { LayerIcon, RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../../ui/controls/Slider.svelte';
	import Frame from '../interactive/Frame.svelte';
	import { HOLE_RADII, least } from '../../../hair/hole';
	import HoleResponseDrawing from './HoleResponseDrawing.svelte';

	const lowest = least();
	let degree = $state(2);
	let a = $state(Math.round(100 * lowest.a) / 100);
</script>

<Frame
	slug="black-hole-response"
	aspect={16 / 9}
	vars="--stage-pad: 1rem 0.9rem 0.9rem"
	narrow={{ aspect: 0.44, vars: '--stage-pad: 1rem 0.5rem 0.8rem' }}
>
	{#snippet stage()}
		<HoleResponseDrawing bind:degree bind:a />
	{/snippet}
	{#snippet controls()}
		<Slider
			id="hole-degree"
			label="Degree of the tide"
			icon={LayerIcon}
			min={2}
			max={8}
			step={1}
			bind:value={degree}
			readout="ℓ = {degree}: {HOLE_RADII[degree].toFixed(2)} rₛ"
		/>
		<Slider
			id="hole-a"
			label="The number a of the test"
			icon={RulerIcon}
			min={0}
			max={9}
			step={0.01}
			bind:value={a}
			readout="a = {a.toFixed(2)}"
			mark={{ at: lowest.a, label: 'the least' }}
		/>
	{/snippet}
</Frame>
