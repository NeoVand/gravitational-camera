<script lang="ts">
	import SkyDemo from '#lib/ui/SkyDemo.svelte';
	import Tex from '#lib/ui/Tex.svelte';
</script>

<svelte:head>
	<title>The Milky Way · Gravitational Camera</title>
	<meta
		name="description"
		content="The whole sky from the Sun, in light and in the gravitational waves of the Galaxy's white-dwarf pairs: dust hides the centre from light, not from gravity."
	/>
</svelte:head>

<SkyDemo title="The Milky Way" slug="milky-way" look={{ yaw: 0, pitch: 0, fov: 100 }}>
	{#snippet intro()}
		<p>
			The whole sky from the Sun, looking toward the centre of the Galaxy. In <strong>light</strong>
			its stars shine through a thin disc of dust, which splits the band and hides the centre: it is hardly
			brighter than the opposite side of the sky.
		</p>
		<p>
			Tens of millions of close pairs of white dwarfs send out <strong>gravitational waves</strong>
			near a millihertz, and nothing stops them. In that light the Galaxy’s centre is a hundred times
			brighter than the opposite side, and the picture is a map of where its stars are.
		</p>
		<p>
			Switch the gravity side to <strong>the first light</strong> to see the glow a hot Big Bang would
			have left in gravitons: 0.905 K, warmer by a thousandth toward where we are heading.
		</p>
		<p class="fine">
			Both pictures come from one model of the Galaxy (two discs, a bulge and a disc of dust) on one
			logarithmic scale; stars are added to the light for orientation. Seeing the waves this sharply
			would take a camera some 50 AU across: at three millihertz they are two-thirds of an
			astronomical unit long. Drag to look around; the wheel zooms.
		</p>
	{/snippet}
	{#snippet physics()}
		<h4>One sum, with and without dust</h4>
		<p>Each picture is the column integral of the stars’ glow along the line of sight:</p>
		<Tex
			display
			math={"I(\\hat n) = \\int_0^\\infty j(s\\hat n)\\, e^{-\\tau(s)}\\,\\mathrm{d}s, \\qquad \\tau(s) = \\int_0^s \\kappa\\,\\mathrm{d}s'."}
		/>
		<p>
			Light has the dust’s opacity <Tex math={'\\kappa'} />, about one magnitude per kiloparsec in
			the plane near the Sun, forty magnitudes toward the centre. Gravitational waves have
			<Tex math={'\\tau = 0'} />: matter absorbs them some 10<sup>30</sup> times too weakly to matter.
		</p>
		<h4>The first light</h4>
		<p>
			If gravitons were ever in equilibrium, near the Planck temperature, they kept a black-body
			spectrum, colder than the microwave background because the particles that later annihilated
			heated only the photons:
		</p>
		<Tex
			display
			math={'T_g = \\left(\\frac{3.91}{106.75}\\right)^{1/3} T_\\gamma = 0.905\\,\\mathrm{K}.'}
		/>
		<p>
			Our motion through it at 370 km/s makes one side warmer by
			<Tex math={'v/c = 1.2\\times10^{-3}'} />, the same dipole as the microwave background’s.
		</p>
	{/snippet}
</SkyDemo>
