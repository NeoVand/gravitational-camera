<script lang="ts">
	import { Orbit01Icon, RulerIcon, SignalFull02Icon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import RangeChart from '#lib/ui/RangeChart.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
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

	function reset() {
		logKr = 2.5;
		logRho = 3;
		degrees = 60;
	}
	const distance = (x: number) =>
		x < 1e4
			? `${x.toPrecision(2)}\\,\\mathrm{km}`
			: `${(x / 1e3).toPrecision(2)}\\times10^{3}\\,\\mathrm{km}`;
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
				readout="kr = {kr < 100 ? kr.toFixed(1) : Math.round(kr)}"
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
				readout="ρ = {rho < 1e4 ? Math.round(rho) : rho.toExponential(0)}"
				ends={['10', 'a million']}
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			A single plane wave has no distance. The waves of a real pair of orbiting stars are not quite
			plane, and one pixel can read how far they have come, in two ways.
		</p>
		<p>
			<strong style="color: #7fb4ff">The rank.</strong> A plane wave makes the pixel’s complex
			matrix a perfect square, of rank one. A nearby source spoils this by
			<Tex math={'C/(kr)^2'} />: so little that it is lost in the noise once
			<Tex math={'kr'} /> is of order <Tex math={'\\sqrt\\rho'} />.
		</p>
		<p>
			<strong style="color: #e8a45a">The split.</strong> Over a cycle, the waves of the two senses
			of rotation point in directions that differ by <Tex math={'8|\\cot\\iota|/kr'} />. Directions
			are read to about <Tex math={'1/\\rho'} />, so this ranges the source out to <Tex
				math={'kr'}
			/> of order
			<Tex math={'\\rho'} />, much farther.
		</p>
		<dl>
			<div>
				<dt>At 100 Hz, the source is</dt>
				<dd><Tex math={distance(km)} /></dd>
			</div>
			<div>
				<dt>The split · the rank departure</dt>
				<dd>
					<Tex
						math={`${splitArcsec < 1 ? splitArcsec.toExponential(1) : splitArcsec.toFixed(0)}'' \\cdot ${(rankConstant(iota, 0) / (kr * kr)).toExponential(1)}`}
					/>
				</dd>
			</div>
		</dl>
		<p class="fine">
			The laws are the leading terms of the field of two masses turning in a circle, checked against
			the exact field in the paper’s reference implementation (the paper’s figure on ranging). The
			errors are those of white noise on each number, to first order. Face on, the split vanishes;
			edge on, one sense of rotation is missing and so is the split.
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
