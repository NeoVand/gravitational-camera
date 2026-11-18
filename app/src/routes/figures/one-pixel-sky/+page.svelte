<script lang="ts">
	import {
		DashboardCircleIcon,
		GridIcon,
		SunCloud01Icon,
		StarsIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import OnePixelSky from '#lib/ui/OnePixelSky.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { distanceFromUniform, SKIES } from '#lib/pixel/sky.js';

	type Choice = 'icosahedron' | 'uniform' | 'octahedron' | 'two';
	let choice = $state<Choice>('icosahedron');
	let yaw = $state(0.3);
	let pitch = $state(0.35);

	const sky = $derived(SKIES[choice]);
	const distance = $derived(distanceFromUniform(sky.sources));

	function reset() {
		yaw = 0.3;
		pitch = 0.35;
	}
</script>

<svelte:head>
	<title>One pixel’s sky · Gravitational Camera</title>
	<meta
		name="description"
		content="What one gravitational pixel can measure of a sky full of sources: its harmonics of degree four and below. Twelve sources on an icosahedron look exactly like a uniform sky."
	/>
</svelte:head>

<DemoShell section="figures" title="One pixel’s sky" onreset={reset}>
	{#snippet stage()}
		<OnePixelSky sources={sky.sources} bind:yaw bind:pitch />
	{/snippet}

	{#snippet controls()}
		<Group title="The sky">
			<Segmented
				label="Sources"
				options={[
					{ value: 'icosahedron', label: 'Twelve', icon: StarsIcon },
					{ value: 'uniform', label: 'Uniform', icon: SunCloud01Icon },
					{ value: 'octahedron', label: 'Six', icon: GridIcon },
					{ value: 'two', label: 'Two', icon: DashboardCircleIcon }
				]}
				bind:value={choice}
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			A sky full of independent sources, all sounding at once at the same frequency. What can one
			pixel learn of it? Its readings are noise; what carries information is how they vary together,
			their second moments, a hundred numbers at each frequency. They fix the sky’s brightness only
			up to its harmonics of degree four: the middle sphere.
		</p>
		<p>
			So a pixel cannot tell twelve sources at the corners of an <strong>icosahedron</strong> from a uniform
			sky of the same brightness: the corners average every pattern of degree five or less as the whole
			sphere does. Six at the corners of an octahedron, which average only to degree three, it can. If
			the sources are not Gaussian noise, the readings’ fourth moments reach degree eight, and the icosahedron
			shows (right).
		</p>
		<dl>
			<div>
				<dt>{sky.label}: the pixel’s second moments, against a uniform sky’s</dt>
				<dd>
					<Tex
						math={distance < 1e-12
							? '\\text{the same, to } 10^{-15}'
							: `\\text{differ by } ${(100 * distance).toFixed(0)}\\,\\%`}
					/>
				</dd>
			</div>
		</dl>
		<p class="fine">
			The brightness is drawn on one scale on all three spheres; where the kept harmonics overshoot
			below zero the sphere is dark. The pixel also sees as many harmonics of the sky’s circular
			polarization, and eighteen numbers of its linear polarization; one of them says whether the
			sky as a whole turns one way. Drag to turn the spheres.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>A hundred numbers, sixty-eight of them the sky’s</h4>
		<p>
			At each frequency the pixel’s ten numbers have a ten-by-ten spectral matrix. For independent
			sources it is a sum over the sky of each direction’s steering vectors, through the kernel
		</p>
		<Tex
			display
			math={'\\sum_{A=+,\\times} e^{A}_{ij}\\, e^{A}_{kl} = P_{ik}P_{jl} + P_{il}P_{jk} - P_{ij}P_{kl},\\qquad P_{ij} = \\delta_{ij} - \\hat n_i\\hat n_j ,'}
		/>
		<p>
			a polynomial of degree four in <Tex math={'\\hat n'} />. So the brightness enters only through
			its harmonics of degree four and below, 25 numbers; as many of the circular polarization, and
			18 of the linear:
		</p>
		<Tex display math={'25 + 25 + 18 = 68 .'} />
		<p>
			The other 32 vanish for any sky of gravitational waves. For light the count is 28 of 36; for
			sound, a pressure and a velocity, 9 of 16.
		</p>
	{/snippet}
</DemoShell>
