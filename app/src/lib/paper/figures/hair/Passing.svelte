<script lang="ts">
	/** Fig. passing, live: the distance of the pass, by the bead or the slider. */
	import { RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../../ui/controls/Slider.svelte';
	import Frame from '../interactive/Frame.svelte';
	import { FARTHEST, NEAREST, PAPER_PASS } from '../../../hair/passing';
	import PassingDrawing from './PassingDrawing.svelte';

	let b = $state(PAPER_PASS);
</script>

<Frame
	slug="a-mass-that-passes"
	aspect={16 / 10}
	vars="--stage-pad: 1rem 0.9rem 0.9rem"
	narrow={{ aspect: 0.47, vars: '--stage-pad: 1rem 0.5rem 0.8rem' }}
>
	{#snippet stage()}
		<PassingDrawing bind:b />
	{/snippet}
	{#snippet controls()}
		<Slider
			id="passing-b"
			label="Distance of the pass"
			icon={RulerIcon}
			min={NEAREST}
			max={FARTHEST}
			step={0.01}
			bind:value={b}
			readout="b = {b.toFixed(2)} R"
			mark={{ at: PAPER_PASS, label: 'the paper’s' }}
		/>
	{/snippet}
</Frame>
