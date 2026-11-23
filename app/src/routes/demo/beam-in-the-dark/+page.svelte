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
	<title>A beam in the dark · Gravitational Camera</title>
	<meta
		name="description"
		content="An infrared laser beam cannot be seen from the side. Its energy still gravitates, and the camera sees a line."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={5.5}
	look={{ yaw: 0, pitch: -4 }}
	subtract
	startSensitivity={40}
	startBrightness={0.6}
	subject={{ id: 'beam', name: 'the beam' }}
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
			/> hydrogen atoms. That is a change of about five parts in <Tex math={'10^{25}'} /> of the tide
			of the room, which the camera can only see by subtracting the reading with the laser off. The demo
			starts at <Tex math={'\\mathrm{SNR} = 10^{40}'} />, quoted, as in every demo, for its subject,
			here the beam itself: the noise is <Tex math={'10^{-40}'} /> of the beam's tide, some five parts
			in <Tex math={'10^{65}'} /> of the room's.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			A powerful infrared laser stands on the left of a room, 5.5 metres from the camera. It fires
			its beam across the room into a block on the right, called a beam dump, which absorbs it. The
			beam is 3.4 metres long and carries 100 kilowatts. The picture is split by a vertical line. To
			the left, marked <em>Light</em>, there is nothing between laser and dump. Infrared light is
			invisible to the eye. A beam in clean air also sends almost no light to the side.
		</p>
		<p>
			To the right, marked <em>Gravity · near field</em>, is what an imagined
			<strong>gravitational camera</strong> would show. Each pixel of this camera measures how the pull
			of gravity changes from one point to the next. Light carries energy. By Einstein's E = mc², energy
			has mass, and so it pulls. The beam pulls even twice as hard as its energy alone would suggest,
			because the pressure of the light along the beam also produces gravity.
		</p>
		<p>
			The camera has taken one reading before the laser was switched on. That reading is taken away
			from every later one. The room, the laser and the dump therefore vanish from the gravity side,
			and only the beam is left, as a thin line. Brightness shows mass, from black through dark blue
			and teal to white.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Move the <em>Sensitivity</em> slider to the left. The <strong>sensitivity</strong> is the size
				of the signal divided by the size of the random noise in the readings. The page starts at 10⁴⁰,
				which is far beyond any real instrument. As the sensitivity falls, the line spreads into a faint
				smear.
			</li>
			<li>
				Turn on the <em>Room</em> switch. The floor, the walls, the laser and the dump come back, and
				the beam is lost against them.
			</li>
		</ul>
		<p>
			The whole beam pulls like about 2.5 × 10⁻²⁰ kilograms of matter, the mass of about fifteen
			million hydrogen atoms. Its pull is about five parts in 10²⁵ of the pull of the room. Section
			X of the paper, “What the camera can do that light cannot”, explains why light itself is among
			the things the camera can see.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the gravity picture, <em>Tidal field</em> shows how
			gravity stretches and squeezes space at points around the camera, and <em>One exposure</em>
			adds the noise of one set of readings. <em>Sensitivity</em> sets how far the signal stands
			above the noise, and <em>Exposure</em> brightens or darkens the gravity side. Under Layers,
			<em>Room</em> adds or removes everything that was there before the laser was switched on. The other
			switches show or hide each part of the picture. Reset puts the view back.
		</p>
	{/snippet}
</RoomDemo>
