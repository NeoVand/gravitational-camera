<script lang="ts">
	/** Fig. hidden-flow, live: the radius of the inner ball. */
	import { RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../../ui/controls/Slider.svelte';
	import Frame from '../interactive/Frame.svelte';
	import { BALANCED } from '../../../hair/flow';
	import HiddenFlowDrawing from './HiddenFlowDrawing.svelte';

	let inner = $state(BALANCED);
</script>

<Frame
	slug="a-hidden-flow"
	aspect={16 / 9}
	vars="--stage-pad: 1rem 0.9rem 0.9rem"
	narrow={{ aspect: 0.47, vars: '--stage-pad: 1rem 0.5rem 0.8rem' }}
>
	{#snippet stage()}
		<HiddenFlowDrawing {inner} />
	{/snippet}
	{#snippet controls()}
		<Slider
			id="hidden-flow-inner"
			label="Radius of the inner ball"
			icon={RulerIcon}
			min={0.5}
			max={0.98}
			step={0.001}
			bind:value={inner}
			readout="{inner.toFixed(3)} R"
			mark={{ at: BALANCED, label: 'no angular momentum' }}
		/>
	{/snippet}
</Frame>
