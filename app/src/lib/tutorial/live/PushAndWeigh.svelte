<script lang="ts">
	/**
	 * Chapter 13.3's push and weigh: the paper's live figure for fig:ladder (lib/ui/PushAndWeigh.svelte, with its
	 * maths in lib/hair/ladder.ts), in the tutorial's try frame, as Passing.svelte puts fig:passing in it. The
	 * controls are the page's (/figures/push-and-weigh/): the pair of bodies, the degree of the tide, the noise and
	 * the number of pushes, with the Push button that weighs again with new noise. It opens as the page does, on the
	 * pair with the same second moment under the octupolar tide. Under reduced motion a push weighs again without
	 * moving the particles, as on the page.
	 */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CircleDotIcon,
		DiceIcon,
		HexagonIcon,
		Layers01Icon,
		OctagonIcon,
		RepeatIcon,
		SquareIcon,
		StarIcon,
		Target03Icon,
		VolumeHighIcon
	} from '@hugeicons/core-free-icons';
	import Figure from '../../ui/PushAndWeigh.svelte';
	import Group from '../../ui/controls/Group.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Frame from '../../paper/figures/interactive/Frame.svelte';
	import { PAIRS, pushAndWeigh, type Degree, type PairName } from '../../hair/ladder';

	let chosen = $state<PairName>('second');
	let degree = $state<Degree>(3);
	let sigma = $state(0.02);
	let count = $state(10);
	/** The pushes made so far: each press of Push weighs again, with noise drawn from this number. */
	let trial = $state(1);
	let figure: Figure | undefined = $state();

	const pair = $derived(PAIRS[chosen]);
	const weighed = $derived(pushAndWeigh(pair.a, pair.b, degree, sigma, count, trial));
</script>

<Frame
	slug="push-and-weigh"
	aspect={0.88}
	vars="--stage-pad: 1rem 0.9rem 0.9rem"
	narrow={{ aspect: 0.43, vars: '--stage-pad: 1rem 0.5rem 0.8rem' }}
>
	{#snippet stage()}
		<Figure
			bind:this={figure}
			a={pair.a}
			b={pair.b}
			{degree}
			{weighed}
			onpush={() => (trial += 1)}
		/>
	{/snippet}
	{#snippet controls()}
		<div class="panel">
			<Group title="The two bodies">
				<Segmented
					label="The pair of bodies"
					options={[
						{ value: 'point', label: PAIRS.point.label, icon: CircleDotIcon },
						{ value: 'second', label: PAIRS.second.label, icon: Layers01Icon, wide: true },
						{ value: 'fourth', label: PAIRS.fourth.label, icon: Target03Icon, wide: true }
					]}
					bind:value={chosen}
				/>
			</Group>
			<Group title="The tide">
				<Segmented
					label="The degree of the tide"
					options={[
						{ value: '2', label: 'Quadrupole', icon: SquareIcon },
						{ value: '3', label: 'Octupole', icon: HexagonIcon },
						{ value: '4', label: 'Hexadecapole', icon: OctagonIcon },
						{ value: '5', label: 'Degree five', icon: StarIcon }
					]}
					bind:value={() => String(degree), (v) => (degree = Number(v) as Degree)}
				/>
			</Group>
			<Group title="The weighing">
				<Slider
					id="push-and-weigh-noise"
					label="Noise"
					icon={VolumeHighIcon}
					min={0}
					max={0.05}
					step={0.0005}
					bind:value={sigma}
					readout={sigma ? `σ = ${sigma.toFixed(4)}` : 'none'}
					ends={['none', 'much']}
				/>
				<Slider
					id="push-and-weigh-pushes"
					label="Pushes"
					icon={RepeatIcon}
					min={1}
					max={100}
					step={1}
					bind:value={count}
					readout="N = {count}"
					ends={['one', 'a hundred']}
				/>
				<div class="actions">
					<button type="button" class="action" onclick={() => figure?.push()}>
						<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.8} /> Push
					</button>
				</div>
			</Group>
		</div>
	{/snippet}
</Frame>

<style>
	/* the page's three groups of controls: the bodies and the tide side by side where the bar is wide, the weighing
	   in a row of its own under them, and all one above another on a phone */
	.panel {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
		align-items: start;
		gap: 1rem 1.4rem;
	}

	/* the groups start level: the panel's gap does the spacing, not the margin they keep on the page */
	.panel > :global(section) {
		margin-top: 0;
	}

	.panel > :global(section:last-child) {
		grid-column: 1 / -1;
	}

	/* the weighing: its two sliders and the Push button in a row, the button level with the tracks */
	.panel > :global(section:last-child > .body) {
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
		align-items: end;
		gap: 0.85rem 1.4rem;
	}
</style>
