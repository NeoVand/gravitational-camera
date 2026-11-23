<script lang="ts">
	import SkyDemo from '#lib/ui/SkyDemo.svelte';
	import Tex from '#lib/ui/Tex.svelte';
</script>

<svelte:head>
	<title>A black hole against the first light · Gravitational Camera</title>
	<meta
		name="description"
		content="A black hole in front of the Milky Way, by exact Schwarzschild rays: in light, the Galaxy bent into rings; in primordial gravitons, a uniform glow with one shadow."
	/>
</svelte:head>

<SkyDemo
	title="A black hole against the first light"
	slug="black-hole"
	hole={{ l: 0, b: 9, distance: 40 }}
	startRight="primordial"
	look={{ yaw: 0, pitch: 9, fov: 50 }}
>
	{#snippet intro()}
		<p>
			A black hole hangs just above the centre of the Galaxy, and the camera is at rest a little way
			from it. In <strong>light</strong> the Milky Way is bent around the hole into a ring, with a second
			image above it; the stars smear into arcs near its edge.
		</p>
		<p>
			In <strong>primordial gravitons</strong>, the glow a hot Big Bang would have left, the sky is
			uniform but for the faint dipole of our motion. Bending cannot show in a uniform glow, and
			nothing but a black hole absorbs gravitons appreciably: so the hole’s shadow is the only dark
			thing in this sky. It is dark because the hole is colder than the glow; a hole of 1.4 × 10²³
			kg would be just as warm, and invisible.
		</p>
		<p class="fine">
			Every ray is traced exactly through the Schwarzschild metric. Move closer and the shadow grows
			and the whole sky warms, because the camera sits deeper in the hole’s potential. Drag to look
			around: away from the hole the sky is almost undisturbed.
		</p>
	{/snippet}
	{#snippet physics()}
		<h4>Which rays fall in</h4>
		<p>
			A camera at rest a distance <Tex math={'r'} /> from the hole, in units of
			<Tex math={'GM/c^2'} />, sees a ray at angle <Tex math={'\\psi'} /> from the hole with impact parameter
		</p>
		<Tex display math={'b = \\frac{r\\sin\\psi}{\\sqrt{1 - 2/r}}.'} />
		<p>
			Rays with <Tex math={'b < \\sqrt{27}'} /> heading inward fall in: that is the shadow, of angular
			radius <Tex math={'\\sin\\psi_s = \\sqrt{27}\\,\\sqrt{1-2/r}\\,/\\,r'} />. Every other ray
			came from far away, having swept the angle
		</p>
		<Tex
			display
			math={'\\Delta\\phi = \\int \\frac{\\mathrm{d}u}{\\sqrt{1/b^2 - u^2 + 2u^3}}, \\qquad u = 1/r,'}
		/>
		<p>
			an elliptic integral, which the demo evaluates exactly for each direction and the paper’s
			reference implementation checks.
		</p>
		<h4>The warmer sky</h4>
		<p>
			At rest in the hole’s potential the camera sees every frequency from far away raised by
			<Tex math={'1/\\sqrt{1-2/r}'} />, so the first light’s 0.905 K reads warmer, the same in every
			direction. Its thermometer tells how deep it sits.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			A black hole hangs just above the centre of our galaxy, the Milky Way. The camera is held at
			rest a little way from it. The picture is split by a vertical line. To the left, marked <em
				>Light</em
			>, is the sky in ordinary light. The hole's gravity bends the light that passes near it. So
			the Milky Way is bent into a ring round the hole, with a second image above it. Near the edge
			of the hole the stars are smeared into arcs. The black disc in the middle is the hole's
			<strong>shadow</strong>: the directions from which no light can reach the camera, because
			light from there would have to come out of the hole.
		</p>
		<p>
			To the right is the same sky as an imagined <strong>gravitational camera</strong> would see it,
			in the glow that a hot Big Bang would have left in gravitational waves. If the early universe was
			hot enough, this glow would fill the whole sky, at 0.905 kelvin, just under one degree above absolute
			zero. Orange marks where it is a little warmer and blue where it is a little cooler. The glow is
			the same in every direction, apart from a faint difference caused by our own motion. Bending cannot
			show in a glow that is the same everywhere. Ordinary matter absorbs almost none of this glow. So
			the hole's shadow is the only dark thing in this sky.
		</p>
		<p>
			A black hole also glows a little. Stephen Hawking found its temperature, which is lower for
			heavier holes. This hole is dark because it is colder than the glow. A hole of about 1.4 ×
			10²³ kilograms, about twice the mass of the Moon, would be exactly as warm as the glow, and it
			could not be seen at all.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>Drag the dividing line across the hole, and compare the two halves.</li>
			<li>
				Open the Controls tab and move the <em>Distance</em> slider toward <em>close</em>. The
				shadow grows. The whole sky also warms. The camera sits deep in the hole's gravity, and the
				waves gain energy as they fall in toward it. The label at the foot of the gravity side gives
				the temperature.
			</li>
			<li>Drag the picture to look away from the hole. There the sky is almost undisturbed.</li>
		</ul>
		<p>Section XI of the paper, “Astrophysical and cosmological scenes”, describes this view.</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more of the light view or more of the gravity view.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the sky and <em>Tidal field</em> shows how gravity
			stretches and squeezes space at points around the camera. The <em>Field of view</em> slider
			widens or narrows the view. The <em>Distance</em> slider moves the camera nearer to the hole or
			farther from it. Its readout gives the distance in units of half the radius of the hole's edge,
			and the size of the shadow in degrees. Reset puts the view back.
		</p>
	{/snippet}
</SkyDemo>
