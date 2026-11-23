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
			Both pictures come from one model of the Galaxy (two discs, a bulge and a disc of dust), each
			on its own scale of brightness, the waves over three decades; stars are added to the light for
			orientation. Seeing the waves this sharply would take a camera some 50 AU across: at three
			millihertz they are two-thirds of an astronomical unit long. Drag to look around; the wheel
			zooms.
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
			the plane near the Sun, thirty magnitudes toward the centre. Gravitational waves have
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
	{#snippet plain()}
		<p>
			This is the whole sky as seen from the Sun, looking toward the centre of our galaxy, the Milky
			Way. The picture is split by a vertical line. To the left, marked <em>Light</em>, is the sky
			in ordinary light. The Galaxy's stars form a bright band. A thin layer of dust lies along the
			middle of the band. It splits the band in two and hides the centre. Seen in light, the centre
			is hardly brighter than the opposite side of the sky.
		</p>
		<p>
			To the right, marked <em>Gravity · millihertz waves</em>, is the sky as an imagined
			<strong>gravitational camera</strong>
			would see it. This camera collects <strong>gravitational waves</strong>, which are ripples in
			gravity that travel at the speed of light. The Galaxy holds tens of millions of close pairs of
			<strong>white dwarfs</strong>, the small, dense remains of stars like the Sun. Each pair
			orbits in minutes or hours. It sends out waves at a few thousandths of a cycle per second, or
			a few <strong>millihertz</strong>. Dust does not stop these waves. In their glow, the centre
			of the Galaxy is about a hundred times brighter than the opposite side. The picture is a map
			of where the stars are. The colours run from dark, through amber and cream, to white for the
			brightest parts.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>Drag the dividing line across the centre of the Galaxy, and compare the two halves.</li>
			<li>Drag the picture to look around the whole sky.</li>
			<li>
				Open the Controls tab and choose <em>The first light</em>. This shows the glow that a hot
				Big Bang would have left in gravitational waves, if the early universe was hot enough to
				make them. The glow would be almost the same in every direction, at 0.905 kelvin, just under
				one degree above absolute zero. Orange marks where it is a little warmer, and blue where it
				is a little cooler. It is warmer by about a thousandth in the direction in which we are
				moving.
			</li>
		</ul>
		<p>
			These waves are very long, so a camera would need to be about 50 times as wide as the distance
			from the Earth to the Sun to see the Galaxy this sharply. Section XI of the paper,
			“Astrophysical and cosmological scenes”, describes both glows.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around the sky, and scroll to zoom. Drag the vertical dividing line
			to show more of the light view or more of the gravity view.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the sky and <em>Tidal field</em> shows how the
			gravity of the Galaxy's stars stretches and squeezes space at points around the Sun.
			<em>The Galaxy</em>
			and <em>The first light</em> choose which glow the gravity side shows. The
			<em>Field of view</em> slider widens or narrows the view. Reset puts the view back.
		</p>
	{/snippet}
</SkyDemo>
