<script lang="ts">
	import { PauseIcon, PlayIcon, WaveIcon } from '@hugeicons/core-free-icons';
	import VoicesView from '../../../ui/Voices.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import Slider from '../../../ui/controls/Slider.svelte';
	import { unit, type Vec3 } from '../../../pixel/complex';
	import { findGravity, findLight, read } from '../../../pixel/voices';
	import Frame from './Frame.svelte';

	const WINDOW = 48;
	const STEP = 0.09;
	let count = $state(4);
	let motion: 'play' | 'pause' = $state('play');
	let t = $state(10);
	let yaw = $state(0);
	let pitch = $state(0.15);
	let directions: Vec3[] = $state([
		unit([-0.6, 0.45, 0.66]),
		unit([0.45, 0.6, 0.66]),
		unit([0.62, -0.38, 0.69]),
		unit([-0.3, -0.62, 0.72]),
		unit([0.05, 0.1, 0.99])
	]);
	const sources = $derived(directions.slice(0, count));
	const readings = $derived(
		Array.from({ length: WINDOW }, (_, i) => {
			const k = Math.floor(t / STEP) - (WINDOW - 1 - i);
			return read(sources, k * STEP, 0, k);
		})
	);
	const gravity = $derived(findGravity(readings));
	const light = $derived(findLight(readings));

	$effect(() => {
		if (motion !== 'play' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			t += Math.min(0.1, (now - last) / 1000);
			last = now;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<Frame
	slug="four-voices"
	aspect={1.15}
	vars="--figure-width: min(46cqw, 52cqh); --traces-width: 92cqw"
>
	{#snippet stage()}
		<VoicesView
			{sources}
			{readings}
			{gravity}
			{light}
			bind:yaw
			bind:pitch
			onmove={(i, d) => (directions[i] = d)}
		/>
	{/snippet}
	{#snippet controls()}
		<Slider
			id="voices-count"
			label="Waves at once"
			icon={WaveIcon}
			min={1}
			max={5}
			step={1}
			bind:value={count}
			readout={`${count} at once`}
		/>
		<Segmented
			label="Motion"
			options={[
				{ value: 'play', label: 'Playing', icon: PlayIcon },
				{ value: 'pause', label: 'Paused', icon: PauseIcon }
			]}
			bind:value={motion}
		/>
	{/snippet}
</Frame>
