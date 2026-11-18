<script lang="ts">
	/**
	 * The controls of a thermal demo's "Counts" view: the exposure in plain terms, a collecting area and a time, how
	 * finely the picture is cut, the expected counts or one draw, a new draw, and an exposure long enough for the
	 * picture. They set lib/measure/exposure.svelte.ts.
	 */
	import {
		ApertureIcon,
		ChartScatterIcon,
		Clock01Icon,
		DiceIcon,
		GridViewIcon,
		HourglassIcon
	} from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { LIFETIME, UNIVERSE, YEAR } from '../measure/counts';
	import { AREAS, LONGEST, type CountExposure } from '../measure/exposure.svelte';
	import { area, duration } from './format';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';

	interface Props {
		exposure: CountExposure;
		/** Square-metre-seconds for 2,500 gravitons in the brightest element: what "Long enough" sets. */
		needed: number;
	}

	let { exposure, needed }: Props = $props();

	const times = [
		{ at: Math.log10(86400), label: 'a day' },
		{ at: Math.log10(YEAR), label: 'a year' },
		{ at: Math.log10(LIFETIME), label: 'eighty years, a lifetime' },
		{ at: Math.log10(UNIVERSE), label: 'the age of the universe' }
	];
</script>

<Group title="Exposure">
	<Slider
		id="area"
		label="Collecting area"
		icon={ApertureIcon}
		min={AREAS[0]}
		max={AREAS[1]}
		step={0.05}
		bind:value={exposure.logArea}
		readout={area(exposure.area)}
		ends={['a square centimetre', 'a square kilometre']}
	/>
	<Slider
		id="time"
		label="Exposure time"
		icon={HourglassIcon}
		min={0}
		max={LONGEST}
		step={0.05}
		bind:value={exposure.logTime}
		readout={duration(exposure.time)}
		ends={['a second', '10²⁰ years']}
		marks={times}
		marksHint="the ticks: a day, a year, a lifetime, the age of the universe"
	/>
	<Slider
		id="elements"
		label="Picture elements"
		icon={GridViewIcon}
		min={12}
		max={192}
		step={4}
		bind:value={exposure.across}
		readout="{exposure.across} across"
		ends={['coarse', 'fine']}
	/>
	<Segmented
		label="What the counts show"
		options={[
			{ value: 'expected', label: 'Expected', icon: ChartScatterIcon },
			{ value: 'draw', label: 'One exposure', icon: DiceIcon }
		]}
		bind:value={exposure.show}
	/>
	<div class="actions">
		<button type="button" class="action" onclick={() => exposure.newExposure()}>
			<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.8} /> New exposure
		</button>
		<button
			type="button"
			class="action"
			disabled={!Number.isFinite(needed)}
			onclick={() => exposure.exposeFor(needed)}
		>
			<HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} /> Long enough
		</button>
	</div>
	<p class="hint">
		“Long enough” sets the exposure that gives the brightest part of the picture 2,500 gravitons in
		an element, enough to see a difference of a tenth at five standard deviations.
	</p>
</Group>

<style>
	.hint {
		margin: 0;
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--text-faint);
	}
</style>
