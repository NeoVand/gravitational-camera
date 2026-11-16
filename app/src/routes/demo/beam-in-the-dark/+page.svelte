<script lang="ts">
	import sceneJson from '../../../../../scenes/beam-in-the-dark.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { texSci } from '#lib/ui/format.js';

	const scene = sceneJson as unknown as Scene;
	const c = 299_792_458;
	const power = 1e5;
	const perMetre = (2 * power) / c ** 3;
	const beamMass = perMetre * 3.4;
	const hydrogen = beamMass / 1.6735e-27;
</script>

<svelte:head>
	<title>A beam in the dark · The Gravitational Camera</title>
	<meta
		name="description"
		content="An infrared laser beam cannot be seen from the side. Its energy still gravitates, and the camera sees a line."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={5.5}
	startDivider={0.5}
	look={{ yaw: 0, pitch: -4 }}
	subtract
	startSensitivity={40}
	startBrightness={0.6}
>
	{#snippet intro()}
		<p>
			A 100 kW infrared laser on the left fires across the room into a beam dump on the right. In
			<strong>light</strong> there is nothing between them: infrared is invisible, and a beam in clean
			air scatters almost nothing toward the side.
		</p>
		<p>
			But light carries energy, and energy gravitates. With the reading taken before the laser was
			switched on subtracted, the camera shows the <strong>beam</strong> as a line.
		</p>
	{/snippet}
	{#snippet physicsExtra()}
		<h4>Why light pulls twice as hard</h4>
		<p>
			A beam of power <Tex math="P" /> and cross-section <Tex math="A" /> carries the energy density
			<Tex math={'u = P/(Ac)'} />, and an equal pressure along its length. To a static observer
			beside it, both gravitate: the beam pulls like a line of matter with density
		</p>
		<Tex
			display
			math={'\\rho_{\\text{active}} = \\frac{2u}{c^2}, \\qquad \\lambda = \\frac{2P}{c^3} \\ \\text{per metre},'}
		/>
		<p>
			twice what its energy alone would suggest (Tolman, Ehrenfest and Podolsky, 1931). Two parallel
			beams, by contrast, do not attract at all.
		</p>
		<h4>How faint</h4>
		<p>
			This beam has <Tex math={`\\lambda = ${texSci(perMetre)}\\,\\mathrm{kg/m}`} />: the 3.4 m
			between laser and dump pull like <Tex math={`${texSci(beamMass)}\\,\\mathrm{kg}`} />, about <Tex
				math={texSci(hydrogen)}
			/> hydrogen atoms. Against the room it is a change of about one part in <Tex
				math={'10^{22}'}
			/>, which the camera can only see by subtracting the reading with the laser off. The demo
			starts at <Tex math={'\\mathrm{SNR} = 10^{40}'} /> for that reason.
		</p>
	{/snippet}
</RoomDemo>
