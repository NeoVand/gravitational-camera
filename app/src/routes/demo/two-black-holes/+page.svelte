<script lang="ts">
	import {
		DashboardSpeed01Icon,
		Image01Icon,
		Layers01Icon,
		PauseIcon,
		PlayIcon,
		ZoomInAreaIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import FieldLegend from '#lib/ui/FieldLegend.svelte';
	import FieldLookControls from '#lib/ui/FieldLookControls.svelte';
	import PairField from '#lib/ui/PairField.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { pairScale, separationOverWavelength } from '#lib/vistas/pair.js';

	let speed = $state(0.1);
	// half the view, in wavelengths, on a logarithmic slider
	let logReach = $state(Math.log10(0.5));
	let motion: 'play' | 'pause' = $state('play');
	/** The same switch as in every demo. Here the picture is itself the tidal field, so it starts on. */
	let display = $state<'image' | 'field'>('field');

	const reach = $derived(10 ** logReach);
	const ratio = $derived(separationOverWavelength(speed));
	/** The strength the view's scale is set against, s⁻², as PairField sets it. */
	const fieldScale = $derived(pairScale(speed, reach));
	/** For two holes of thirty Suns each: G M / c^3 of the pair, seconds. */
	const GM_C3 = 60 * 4.925e-6;
	/** Seconds in which one wave passes on screen. */
	const SCREEN_PERIOD = 1.6;
	/**
	 * The separation is G M / (4 v²), so it is 6 G M / c², about where the last stable orbit lies, at
	 * v = c / √24 = 0.204 c. The linearized model means nothing closer: the slider stops at its last step below
	 * that, 0.2 c, where the holes are 6.25 G M / c² apart.
	 */
	const MAX_SPEED = 0.2;
	const separation = $derived(GM_C3 / (4 * speed * speed)); // in units of c times a second
	const frequency = $derived((8 * speed ** 3) / (Math.PI * GM_C3));
	/** Seconds in which one wave truly passes: 1.6 s at 0.042 c, longer below it. */
	const truePeriod = $derived(1 / frequency);
	const wavelengthKm = $derived(299792.458 / frequency);
	const toMerge = $derived((5 / 64) * (1 / (4 * speed * speed)) ** 4 * GM_C3);
</script>

<svelte:head>
	<title>Two black holes, inside out · Gravitational Camera</title>
	<meta
		name="description"
		content="The changing tidal field of an orbiting pair of black holes, from Newton's pull turning with them to the spiral of their waves, from an exact solution."
	/>
</svelte:head>

{#snippet circle()}
	<p class="circle">The dashed circle is λ/2π, where Newton’s field gives way to the waves.</p>
{/snippet}

{#snippet key(full: boolean)}
	<FieldLegend
		where="in the plane of the orbit, its changing part"
		reference={fieldScale}
		{full}
		subject="Every pixel is coloured by the changing part of the tidal tensor at its own point in the plane of the orbit, for two holes of 30 Suns."
		sign={{
			stretch: 'space across the plane of the orbit, along your line of sight, is stretched',
			zero: 'it passes through zero',
			squeeze: 'it is squeezed',
			strength: 'strength over a wave period: the brightness'
		}}
		median="Half the picture is stronger, as a root mean square over a wave period, than"
	>
		{@render circle()}
	</FieldLegend>
{/snippet}

{#snippet fieldKey()}
	{@render key(true)}
{/snippet}

{#snippet status()}
	{#if display === 'field'}
		{@render key(false)}
	{:else}
		<p class="none">
			There is no camera picture here to go back to: this demo is the map of the pair’s tidal field.
			Only the pair is drawn.
		</p>
		{@render circle()}
	{/if}
{/snippet}

<DemoShell
	title="Two black holes, inside out"
	legend={display === 'field' ? fieldKey : undefined}
	foot={status}
	onreset={() => (logReach = Math.log10(0.5))}
>
	{#snippet stage()}
		<PairField
			{speed}
			{reach}
			playing={motion === 'play'}
			period={SCREEN_PERIOD}
			field={display === 'field'}
		/>
	{/snippet}

	{#snippet controls()}
		<Group title="View">
			<Segmented
				label="What the picture shows"
				options={[
					{ value: 'image', label: 'Image', icon: Image01Icon },
					{ value: 'field', label: 'Tidal field', icon: Layers01Icon }
				]}
				bind:value={display}
			/>
			<Slider
				id="reach"
				label="Zoom"
				icon={ZoomInAreaIcon}
				min={-1.6}
				max={0.8}
				step={0.01}
				bind:value={logReach}
				readout="{(2 * reach).toFixed(reach < 0.5 ? 2 : 1)} wavelengths across"
				ends={['the pair', 'the waves']}
			/>
			<Segmented
				label="Motion"
				options={[
					{ value: 'play', label: 'Turning', icon: PlayIcon },
					{ value: 'pause', label: 'Still', icon: PauseIcon }
				]}
				bind:value={motion}
			/>
		</Group>
		<Group title="The pair">
			<Slider
				id="speed"
				label="Orbital speed"
				icon={DashboardSpeed01Icon}
				min={0.02}
				max={MAX_SPEED}
				step={0.005}
				bind:value={speed}
				readout="{speed.toFixed(3)} c · {ratio.toFixed(3)} λ apart"
				ends={['wide', 'about to merge']}
			/>
		</Group>
		{#if display === 'field'}
			<FieldLookControls reference={fieldScale} />
		{/if}
	{/snippet}

	{#snippet notes()}
		<p>
			Two black holes orbit each other, seen from above. The picture is the part of the tidal field
			that changes as they turn, drawn as every demo’s “Tidal field” view draws it: colour for the
			direction of the stretch, fine strokes along it, brightness for its strength. Colour it by
			“Stretch or squeeze” under Controls for the colours of the paper’s figure: <strong
				>orange</strong
			>
			where space across the plane of the orbit is stretched at this moment, <strong>blue</strong> where
			it is squeezed, pale where it passes through zero; its brightness is then the strength over a whole
			wave period, which does not pass through zero. Coloured by direction, where the two strongest stretches
			are nearly equal the stretch has no single direction, and the colour passes from one axis’s to the
			other’s.
		</p>
		<p>
			Close to the pair, inside the dashed circle a sixth of a wavelength out, the pattern is
			Newton’s pull of two masses, turning rigidly with them. A camera well inside could see the
			pair as two bodies, if it is sensitive and wide enough. Farther out the pattern lags behind,
			because the field travels at the speed of light, and winds into the spiral of the waves: there
			the pair is a single point that only ripples. The circle marks a gradual change, not a sharp
			edge.
		</p>
		<dl>
			<div>
				<dt>Separation, for two holes of 30 Suns · their waves</dt>
				<dd>
					<Tex
						math={`${(separation * 299792.458).toFixed(0)}\\,\\mathrm{km} \\cdot \\lambda = ${wavelengthKm.toFixed(0)}\\,\\mathrm{km}`}
					/>
				</dd>
			</div>
			<div>
				<dt>Frequency of the waves · time left before they merge</dt>
				<dd>
					<Tex
						math={`${frequency.toPrecision(3)}\\,\\mathrm{Hz} \\cdot ${toMerge < 120 ? toMerge.toPrecision(2) + '\\,\\mathrm{s}' : (toMerge / 3600).toPrecision(2) + '\\,\\mathrm{h}'}`}
					/>
				</dd>
			</div>
		</dl>
		<p class="fine">
			The motion is {truePeriod < SCREEN_PERIOD ? 'slowed' : 'quickened'}: one wave passes every
			{SCREEN_PERIOD} seconds here, against
			<Tex math={`${Number(truePeriod.toPrecision(2))}\\,\\mathrm{s}`} /> in truth. The strength falls
			as the fifth power of the distance near the pair and only as the first power in the waves; “Strength
			scale” under Controls brings up the weak or tames the strong. Inside the orbit the field is not
			shown. This is the exact solution of linearized gravity for the pair’s quadrupole, which this close
			to a merger is a guide to the full answer, not a substitute for it.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The field in every zone</h4>
		<p>
			Outside the pair, linearized gravity has an exact solution in multipoles. Kept to the mass
			quadrupole <Tex math={'I_{ij}'} />, at the retarded time <Tex math={'u = t - r/c'} />,
		</p>
		<Tex
			display
			math={'\\bar h^{00} = \\frac{4G}{c^2}\\Bigl[\\frac{M}{r} + \\frac12\\partial_i\\partial_j\\frac{I_{ij}(u)}{r}\\Bigr],\\qquad \\bar h^{ij} = \\frac{2G}{c^4}\\frac{\\ddot I_{ij}(u)}{r},'}
		/>
		<p>and its curvature is the tidal field at every distance. The two limits meet where</p>
		<Tex
			display
			math={'\\frac{G\\,\\Delta I}{r^5} \\approx \\frac{G\\,\\Delta I\\,\\omega^4}{c^4 r} \\quad\\Rightarrow\\quad r \\approx \\frac{c}{\\omega} = \\frac{\\lambda}{2\\pi}.'}
		/>
		<p>
			The paper’s reference implementation computes the field by finite differences of the curvature
			and checks it against Newton’s near the pair and the quadrupole wave far away.
		</p>
	{/snippet}
</DemoShell>

<style>
	.circle,
	.none {
		margin: 0.35rem 0 0;
	}

	.none {
		margin-top: 0;
	}
</style>
