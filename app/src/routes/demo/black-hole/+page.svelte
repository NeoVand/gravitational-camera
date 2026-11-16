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
</SkyDemo>
