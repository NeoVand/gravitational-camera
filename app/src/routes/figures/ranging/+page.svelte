<script lang="ts">
	import { Orbit01Icon, RulerIcon, SignalFull02Icon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import RangeChart from '#lib/ui/RangeChart.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { grouped, texNumber } from '#lib/ui/format.js';
	import { helicitySplit, rankConstant } from '#lib/pixel/ranging.js';

	let logKr = $state(2.5);
	let logRho = $state(3);
	let degrees = $state(60);

	const kr = $derived(10 ** logKr);
	const rho = $derived(10 ** logRho);
	const iota = $derived((degrees * Math.PI) / 180);
	/** at 100 Hz, a reduced wavelength is c / (2 pi 200 rad/s) */
	const km = $derived((kr * 299792.458) / (2 * Math.PI * 200));
	const splitArcsec = $derived((helicitySplit(iota, kr) * 180 * 3600) / Math.PI);
	const departure = $derived(rankConstant(iota, 0) / (kr * kr));

	function reset() {
		logKr = 2.5;
		logRho = 3;
		degrees = 60;
	}
</script>

<svelte:head>
	<title>How far is that binary? · Gravitational Camera</title>
	<meta
		name="description"
		content="One gravitational pixel can tell how far away a pair of orbiting stars is: its two helicities point apart by an angle that shrinks with distance, out to a range set by the signal-to-noise ratio."
	/>
</svelte:head>

<DemoShell section="figures" title="How far is that binary?" onreset={reset}>
	{#snippet stage()}
		<RangeChart {kr} {rho} {iota} />
	{/snippet}

	{#snippet controls()}
		<Group title="The binary">
			<Slider
				id="distance"
				label="Distance"
				icon={RulerIcon}
				min={0.5}
				max={5.5}
				step={0.01}
				bind:value={logKr}
				readout="kr = {kr < 100 ? kr.toFixed(1) : grouped(kr)}"
				ends={['near', 'far']}
			/>
			<Slider
				id="inclination"
				label="Inclination"
				icon={Orbit01Icon}
				min={5}
				max={85}
				step={1}
				bind:value={degrees}
				readout="{degrees}°"
				ends={['face on', 'edge on']}
			/>
		</Group>
		<Group title="The pixel">
			<Slider
				id="snr"
				label="Signal-to-noise"
				icon={SignalFull02Icon}
				min={1}
				max={6}
				step={0.01}
				bind:value={logRho}
				readout="ρ = {grouped(rho)}"
				ends={['10', 'a million']}
			/>
		</Group>
	{/snippet}

	{#snippet plain()}
		<p>
			A pair of stars orbiting each other sends out <strong>gravitational waves</strong>, ripples in
			gravity that travel at the speed of light. Far from the pair, the crests of the waves are
			almost flat. A perfectly flat wave is called a <strong>plane wave</strong>. It carries no hint
			of how far it has come. Real waves are slightly curved. One pixel of the gravitational camera
			can read the curve in two ways.
		</p>
		<ul>
			<li>
				<strong>The rank.</strong> A plane wave makes the pixel's reading take a perfectly simple form.
				A nearby source spoils this simplicity a little. The spoiling shrinks with the square of the distance:
				at twice the distance it is four times smaller.
			</li>
			<li>
				<strong>The split.</strong> The waves of a pair turning in a circle can be split into two parts
				that turn in opposite directions. From a nearby source, these two parts seem to come from slightly
				different directions. The angle between them shrinks only in proportion to the distance: at twice
				the distance it is half as large. So the split stays readable much farther out.
			</li>
		</ul>
		<p>
			The chart shows how strongly each way stands out against the noise of the pixel. The across
			axis is the distance, written <em>kr</em>. It is the distance divided by the wavelength and
			multiplied by 2π. The up axis is the signal divided by the noise. The blue line is the rank
			and the orange line is the split. The dashed line marks where a signal equals the noise. Where
			a line falls below it, that way can no longer range the source. The vertical line is the
			source. Under the chart, each way gives its reading of the distance with its error, or says
			“lost in the noise”.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				At the start, the split reads the distance and the rank is lost in the noise. Move the <em
					>Distance</em
				>
				slider toward <em>near</em>, until both read it.
			</li>
			<li>
				Move the <em>Signal-to-noise</em> slider. The <strong>signal-to-noise ratio</strong> is the size
				of the signal divided by the typical size of the noise. As it rises, both lines rise, and the
				split gains more.
			</li>
			<li>
				Move the <em>Inclination</em> slider. It sets the angle between the orbit's axis and the
				line of sight, from <em>face on</em> to <em>edge on</em>. Near either end the split becomes
				hard to read.
			</li>
		</ul>
		<p>Section VIII of the paper, “One pixel, sparse arrays and depth”, explains both ways.</p>
	{/snippet}

	{#snippet help()}
		<p>
			Nothing on the chart is dragged. Everything is set in the Controls tab. The <em>Distance</em>
			slider moves the source nearer or farther. The <em>Inclination</em> slider tilts the orbit,
			from seen face on to seen edge on. The <em>Signal-to-noise</em> slider sets how far the pixel's
			signal stands above its noise, from 10 to a million. Reset puts all three back.
		</p>
	{/snippet}

	{#snippet notes()}
		<p>
			A single plane wave has no distance. The waves of a real pair of orbiting stars are not quite
			plane, and one pixel can read how far they have come, in two ways.
		</p>
		<p>
			<strong class="curve rank">The rank.</strong> A plane wave makes the pixel’s complex matrix a
			perfect square, of rank one. A nearby source spoils this by
			<Tex math={'C/(kr)^2'} />: so little that it is lost in the noise once
			<Tex math={'kr'} /> is of order <Tex math={'\\sqrt\\rho'} />.
		</p>
		<p>
			<strong class="curve split">The split.</strong> Over a cycle, the waves of the two senses of
			rotation point in directions that differ by <Tex math={'8|\\cot\\iota|/kr'} />. Directions are
			read to about <Tex math={'1/\\rho'} />, so this ranges the source out to <Tex math={'kr'} /> of
			order
			<Tex math={'\\rho'} />, much farther.
		</p>
		<dl>
			<div>
				<dt>At 100 Hz, the source is</dt>
				<dd><Tex math={`${texNumber(km)}\\,\\mathrm{km}`} /></dd>
			</div>
			<div>
				<dt>The split between the directions of the two senses of rotation</dt>
				<dd><Tex math={`${texNumber(splitArcsec)}^{\\prime\\prime}`} /></dd>
			</div>
			<div>
				<dt>The rank’s departure from one</dt>
				<dd><Tex math={texNumber(departure)} /></dd>
			</div>
		</dl>
		<p class="fine">
			The laws are the leading terms of the field of two masses turning in a circle, checked against
			the exact field in the paper’s reference implementation (the paper’s figure on ranging). The
			errors are those of white noise on each number, to first order. Face on, one sense of rotation
			is missing and so is the split; edge on, the split itself vanishes.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>Two ways of ranging</h4>
		<p>At one instant, the oscillating part of the reading departs from rank one by</p>
		<Tex
			display
			math={'\\frac{s_2}{s_1} = \\frac{C(\\iota,\\theta)}{(kr)^2} + O\\bigl((kr)^{-3}\\bigr),'}
		/>
		<p>
			not by <Tex math={'1/kr'} />: the first correction only tilts the apparent direction, which at
			one instant cannot be told from a tilt of the source. Over a cycle the two frequency parts
			<Tex math={'\\mathcal{W}_\\pm'} /> each carry that tilt, in opposite senses, and their directions
			differ by
		</p>
		<Tex display math={'\\Delta\\theta_\\pm = \\frac{8\\,|\\cot\\iota|}{kr} .'} />
		<p>
			The first falls as the square of the distance, the second as the distance: at signal-to-noise
			<Tex math={'\\rho'} />, they reach <Tex math={'kr \\sim \\sqrt\\rho'} /> and
			<Tex math={'kr \\sim \\rho'} />. A source seen at <Tex math={'\\rho = 10^3'} /> at 100 Hz is ranged
			out to a few hundred thousand kilometres.
		</p>
	{/snippet}
</DemoShell>

<style>
	/* each name is underlined in the colour of its curve on the chart, and stays in the ink of the panel, so that it
	   reads in either theme */
	.curve {
		text-decoration: underline 2px;
		text-underline-offset: 0.22em;
	}

	.rank {
		text-decoration-color: var(--accent-2);
	}

	.split {
		text-decoration-color: var(--accent);
	}
</style>
