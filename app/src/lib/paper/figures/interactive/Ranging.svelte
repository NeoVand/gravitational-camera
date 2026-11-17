<script lang="ts">
	import { Orbit01Icon, RulerIcon, SignalFull02Icon } from '@hugeicons/core-free-icons';
	import RangeChart from '../../../ui/RangeChart.svelte';
	import Slider from '../../../ui/controls/Slider.svelte';
	import Frame from './Frame.svelte';

	let logKr = $state(2.5);
	let logRho = $state(3);
	let degrees = $state(60);
	const kr = $derived(10 ** logKr);
	const rho = $derived(10 ** logRho);
</script>

<Frame slug="ranging" aspect={16 / 10.5} vars="--figure-width: min(96cqw, 150cqh)">
	{#snippet stage()}
		<RangeChart {kr} {rho} iota={(degrees * Math.PI) / 180} />
	{/snippet}
	{#snippet controls()}
		<Slider
			id="ranging-distance"
			label="Distance"
			icon={RulerIcon}
			min={0.5}
			max={5.5}
			step={0.01}
			bind:value={logKr}
			readout="kr = {kr < 100 ? kr.toFixed(1) : Math.round(kr)}"
		/>
		<Slider
			id="ranging-snr"
			label="Signal-to-noise"
			icon={SignalFull02Icon}
			min={1}
			max={6}
			step={0.01}
			bind:value={logRho}
			readout="ρ = {rho < 1e4 ? Math.round(rho) : rho.toExponential(0)}"
		/>
		<Slider
			id="ranging-inclination"
			label="Inclination"
			icon={Orbit01Icon}
			min={5}
			max={85}
			step={1}
			bind:value={degrees}
			readout="{degrees}°"
		/>
	{/snippet}
</Frame>
