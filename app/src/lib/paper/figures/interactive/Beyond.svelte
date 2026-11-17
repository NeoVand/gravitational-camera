<script lang="ts">
	import { Add01Icon, AtomIcon, Orbit01Icon, StarIcon } from '@hugeicons/core-free-icons';
	import BeyondEinstein from '../../../ui/BeyondEinstein.svelte';
	import Segmented from '../../../ui/controls/Segmented.svelte';
	import Toggle from '../../../ui/controls/Toggle.svelte';
	import type { Vec3 } from '../../../pixel/complex';
	import {
		invertOneReading,
		metricWaveReading,
		waveOf,
		type Inversion
	} from '../../../pixel/beyond';
	import Frame from './Frame.svelte';

	type Theory = 'einstein' | 'graviton' | 'scalar';
	let theory = $state<Theory>('einstein');
	let second = $state(false);
	const n = 0.8;
	const presets: Record<Theory, { pol: Inversion['pol']; speed: number }> = {
		einstein: { pol: { plus: 0.8, cross: 0.4, x: 0, y: 0, b: 0, l: 0 }, speed: 1 },
		graviton: {
			pol: { plus: 0.3, cross: 0.2, x: 0, y: 0, b: 0.5, l: -2 * (1 - n * n) * 0.5 },
			speed: 1 / n
		},
		scalar: { pol: { plus: 0, cross: 0, x: 0, y: 0, b: 0.7, l: (1 - n * n) * 0.7 }, speed: 1 / n }
	};
	const set = $derived(presets[theory]);
	const reading = $derived.by(() => {
		const w = waveOf(set.pol, 1 / set.speed, [0.6, 0, 0.8]);
		const one = metricWaveReading(w.eps, w.n, w.k, 1, 0);
		if (!second) return one;
		const v = waveOf({ plus: 0.5, cross: -0.3, x: 0, y: 0, b: 0, l: 0 }, 1, [
			-0.48, 0.6, 0.64
		] as Vec3);
		const two = metricWaveReading(v.eps, v.n, v.k, 1, 0.9);
		return {
			E: one.E.map((r, i) => r.map((x, j) => x + two.E[i][j])),
			B: one.B.map((r, i) => r.map((x, j) => x + two.B[i][j]))
		};
	});
	const read = $derived(invertOneReading(reading.E, reading.B));
</script>

<Frame slug="beyond-einstein" aspect={16 / 11} vars="--figure-width: min(94cqw, 136cqh)">
	{#snippet stage()}
		<BeyondEinstein E={reading.E} B={reading.B} set={set.pol} {read} speed={set.speed} />
	{/snippet}
	{#snippet controls()}
		<Segmented
			label="Theory"
			options={[
				{ value: 'einstein', label: 'Einstein', icon: StarIcon },
				{ value: 'graviton', label: 'Massive', icon: AtomIcon },
				{ value: 'scalar', label: 'Scalar', icon: Orbit01Icon }
			]}
			bind:value={theory}
		/>
		<Toggle icon={Add01Icon} label="A second wave" bind:checked={second} />
	{/snippet}
</Frame>
