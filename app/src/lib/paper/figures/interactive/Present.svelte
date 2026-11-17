<script lang="ts">
	import { DashboardSpeed01Icon, StopIcon, WorkoutRunIcon } from '@hugeicons/core-free-icons';
	import NowAndThen from '../../../ui/NowAndThen.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import Slider from '../../../ui/controls/Slider.svelte';
	import { position, type Crossing } from '../../../pixel/present';
	import Frame from './Frame.svelte';

	const C = 1.5;
	const ENTER = -7.4;
	let beta = $state(0.6);
	let startX = $state(ENTER);
	let t = $state(0);
	let stop: number | undefined = $state();
	const crossing: Crossing = $derived({ start: [startX, 1.4, 0], beta, c: C, stop });

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			t += Math.min(0.05, (now - last) / 1000);
			last = now;
			if (stop === undefined && position(crossing, t)[0] > 7.4) restart();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function restart() {
		t = 0;
		startX = ENTER;
		stop = undefined;
	}
	function setSpeed(v: number) {
		const x = position(crossing, t)[0];
		beta = v;
		if (stop === undefined) startX = x - v * C * t;
	}
	function setPhase(v: 'moving' | 'stopped') {
		if (v === 'stopped' && stop === undefined) stop = t;
		if (v === 'moving' && stop !== undefined) restart();
	}
</script>

<Frame slug="now-and-then" aspect={16 / 10}>
	{#snippet stage()}
		<NowAndThen {crossing} {t} />
	{/snippet}
	{#snippet controls()}
		<Slider
			id="present-speed"
			label="Speed"
			icon={DashboardSpeed01Icon}
			min={0.1}
			max={0.9}
			step={0.01}
			bind:value={() => beta, setSpeed}
			readout="{beta.toFixed(2)} of light’s"
		/>
		<Segmented
			label="Stop or go"
			options={[
				{ value: 'moving', label: 'Moving', icon: WorkoutRunIcon },
				{ value: 'stopped', label: 'Stop it', icon: StopIcon }
			]}
			bind:value={() => (stop === undefined ? 'moving' : 'stopped'), setPhase}
		/>
	{/snippet}
</Frame>
