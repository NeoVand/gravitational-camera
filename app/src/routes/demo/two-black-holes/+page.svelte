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
	<p class="circle">
		The dashed circle is λ/2π, about a sixth of a wavelength out, where Newton’s field gives way to
		the waves.
	</p>
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
		<!-- in brief, under every tab, the place and the scale alone: the Key tab has the rest -->
		{#if full}{@render circle()}{/if}
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
					{ value: 'play', label: 'Playing', icon: PlayIcon },
					{ value: 'pause', label: 'Paused', icon: PauseIcon }
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
	{#snippet plain()}
		<p>
			Two black holes, each thirty times the mass of the Sun, orbit each other. This page is a map
			of their gravity, seen from above, in the plane in which they orbit. It is not a camera's
			picture. Each point of the map is coloured by the <strong>tide</strong> at that point: the way gravity
			stretches space in one direction and squeezes it in another. Only the part of the tide that changes
			as the holes turn is drawn.
		</p>
		<p>
			Unless you have changed it, colour shows the direction of the stretch. Red means across the
			picture, green means up and down, and blue means toward you. Brightness shows how strong the
			tide is. The fine strokes lie along the stretch. The Key tab explains the scale. Nothing is
			drawn inside the orbit itself.
		</p>
		<p>
			The dashed circle lies about a sixth of a wavelength from the pair. Inside it, the pattern is
			simply Newton's pull of two masses, turning rigidly with them. A camera there could see the
			pair as two bodies. Farther out, the pattern falls behind the turning holes, because changes
			in gravity travel at the speed of light. It winds into a two-armed spiral. This spiral is the <strong
				>gravitational wave</strong
			>, a ripple in gravity that travels outward. In the wave the pair looks like a single point.
			The change from one picture to the other is gradual, not a sharp edge.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Move the <em>Zoom</em> slider toward <em>the waves</em> to see the spiral, and toward
				<em>the pair</em> to see the turning pull.
			</li>
			<li>
				Move the <em>Orbital speed</em> slider toward <em>about to merge</em>. The holes move closer
				and faster, and their waves become shorter. The About tab gives their separation, the length
				of their waves, and the time left before they merge.
			</li>
			<li>
				Under <em>Tidal field</em>, colour the map by <em>Stretch or squeeze</em>. Orange then marks
				where space across the plane is stretched at this moment, and blue where it is squeezed.
			</li>
		</ul>
		<p>
			The motion is slowed or quickened so that one wave passes every 1.6 seconds on the screen.
			Section XI of the paper, “Astrophysical and cosmological scenes”, describes this change from
			pull to wave.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Nothing on this map is dragged. Everything is set in the Controls tab. <em>Image</em> shows
			only the two holes on their orbit, and <em>Tidal field</em> shows the map of their gravity.
			The <em>Zoom</em> slider sets how many wavelengths the map spans. <em>Playing</em> and
			<em>Paused</em> start and stop the motion. The <em>Orbital speed</em> slider sets how fast the
			holes move, and so how close they are. Under <em>Tidal field</em>, you can choose what the
			colour shows, and set the contrast, the strength scale, the wash and the strokes. Reset puts
			the zoom back.
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
