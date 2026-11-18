<script lang="ts">
	/**
	 * What a thermal demo's "Counts" view has counted, and what it would need: the exposure, the gravitons expected
	 * from everything in view and those this draw counted, and how long an exposure would give the picture 2,500
	 * gravitons in its brightest element, said plainly against a lifetime and the age of the universe.
	 */
	import { ENOUGH, LIFETIME, UNIVERSE, YEAR, type CountPicture } from '../measure/counts';
	import type { CountExposure } from '../measure/exposure.svelte';
	import { area, duration, texSci, times } from './format';
	import Tex from './Tex.svelte';

	interface Props {
		picture: CountPicture;
		exposure: CountExposure;
		/** Elements in the picture. */
		elements: number;
	}

	let { picture, exposure, elements }: Props = $props();

	/** A count, whole: "0", "37", "1,204", or past a million "2.4 × 10⁹". */
	const whole = (n: number) => (n < 1e6 ? Math.round(n).toLocaleString('en-US') : times(n));
	/** Square-metre-years for the picture, and how long they take on a square metre and on a square kilometre. */
	const neededYears = $derived(picture.needed / YEAR);
	const onMetre = $derived(picture.needed);
	const onKilometre = $derived(picture.needed / 1e6);
</script>

<dl>
	<div>
		<dt>This exposure</dt>
		<dd>{area(exposure.area)} for {duration(exposure.time)}</dd>
	</div>
	<div>
		<dt>Gravitons expected from everything in view</dt>
		<dd><Tex math={texSci(picture.expected, 2)} /></dd>
	</div>
	{#if picture.counted !== undefined}
		<div>
			<dt>Counted in this exposure</dt>
			<dd>
				{whole(picture.counted)}{#if picture.counted > 0}, in {whole(picture.lit ?? 0)} of {elements.toLocaleString(
						'en-US'
					)} elements{/if}
			</dd>
		</div>
	{/if}
	<div>
		<dt>For {ENOUGH.toLocaleString('en-US')} in the brightest element</dt>
		<dd>
			{#if Number.isFinite(neededYears)}
				<Tex math={`${texSci(neededYears, 1)}\\ \\mathrm{m^2\\,years}`} />
			{:else}
				no exposure: nothing in view glows
			{/if}
		</dd>
	</div>
</dl>
<p class="fine" data-testid="counts-verdict">
	{#if picture.expected < 0.01}
		Over {duration(exposure.time)} on {area(exposure.area)} the camera expects
		<Tex math={texSci(picture.expected, 1)} /> gravitons from everything in view. Almost every exposure
		this long counts none: the true picture is black.
	{:else if picture.expected < 3}
		Over {duration(exposure.time)} on {area(exposure.area)} the camera expects
		<Tex math={texSci(picture.expected, 1)} /> gravitons from everything in view: now and then one, nothing
		like a picture.
	{:else if picture.brightest < 10}
		The picture is a scatter of single gravitons: its brightest element expects
		<Tex math={texSci(picture.brightest, 1)} />.
	{:else if picture.brightest < 0.99 * ENOUGH}
		The picture is grainy: its brightest element expects <Tex math={texSci(picture.brightest, 1)} />
		gravitons, give or take their square root. Telling a difference of a tenth at five standard deviations
		takes about {ENOUGH.toLocaleString('en-US')} in each element.
	{:else}
		Enough for a picture: the brightest element expects <Tex math={texSci(picture.brightest, 1)} /> gravitons,
		and its noise is a fiftieth of that or less.
	{/if}
	{#if Number.isFinite(neededYears)}
		A picture with {ENOUGH.toLocaleString('en-US')} gravitons in its brightest element takes
		{duration(onMetre)} on a square metre{#if onMetre > UNIVERSE}, <Tex
				math={texSci(onMetre / UNIVERSE, 1)}
			/> times the age of the universe,{:else if onMetre > LIFETIME}, <Tex
				math={texSci(onMetre / LIFETIME, 1)}
			/> lifetimes,{/if} or {duration(onKilometre)} on a square kilometre.
	{/if}
</p>
