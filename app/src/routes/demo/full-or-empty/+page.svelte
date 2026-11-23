<script lang="ts">
	import sceneJson from '../../../../../scenes/full-or-empty.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>Full or empty · Gravitational Camera</title>
	<meta
		name="description"
		content="Three identical steel tanks: one empty, one full of water, one full of mercury. The gravitational camera weighs them at a glance."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={3.5}
	subject={{ id: 'tank-middle-contents', name: 'the water in the middle tank' }}
>
	{#snippet intro()}
		<p>
			Three steel tanks look the same in <strong>light</strong>. From left to right they hold air,
			water and mercury. In <strong>gravity</strong> brightness is mass along the line of sight, so the
			camera weighs them at a glance: mercury is thirteen times denser than water, and its tank far outshines
			the others.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			Three steel tanks stand on the floor, 3.5 metres from the camera. They look the same. From
			left to right, the first holds air, the second holds water and the third holds mercury, a
			liquid metal. The picture is split by a vertical line. To the left, marked <em>Light</em>, is
			what an ordinary camera sees. To the right, marked <em>Gravity · near field</em>, is what an
			imagined <strong>gravitational camera</strong> would show.
		</p>
		<p>
			This camera does not collect light. Each of its pixels measures how the pull of gravity
			changes from one point to the next. In this way it feels every mass nearby. On the gravity
			side, brightness shows mass. In each direction, the picture adds up the mass that lies along
			that line of sight. Nearer mass counts for more. Black means no mass. Dark blue, then teal,
			then white mean more and more mass. The faint lines are a copy of the shapes in the light
			picture, so that each bright patch can be matched to an object.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>
				Drag the dividing line to the left, so that the gravity side covers all three tanks. The
				tank of air shows only its thin steel wall. The tank of mercury is by far the brightest,
				because a litre of mercury has about thirteen times the mass of a litre of water.
			</li>
			<li>
				Open the Controls tab and move the <em>Sensitivity</em> slider to the left. The
				<strong>sensitivity</strong> is the size of the signal divided by the size of the random noise
				in the camera's readings. The readout gives it as a power of ten. For example, 10²⁰ means that
				the signal is 10²⁰ times larger than the noise. The readout also gives the width of the blur in
				degrees. As the sensitivity falls, the blur grows, and the three tanks melt into one patch.
			</li>
			<li>
				Under View, choose <em>One exposure</em>. This adds the noise of one real set of readings,
				at the sensitivity you have chosen. Press <em>New exposure</em> to take another.
			</li>
		</ul>
		<p>
			The camera weighs what it looks at, because its signal is set by mass and not by surfaces. Its
			pictures are always blurred, because fine detail in the pull fades quickly with distance. A
			more sensitive camera is sharper, but only slowly. Section IV of the paper, “The near field”,
			explains both facts.
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
			adds the noise of one set of readings. <em>New exposure</em> draws that noise again.
			<em>Sensitivity</em>
			sets how far the signal stands above the noise, and <em>Exposure</em> brightens or darkens the
			gravity side. The <em>Layers</em> switches show or hide the light view, the gravity view, the outline
			of the shapes, the reading of one pixel, and the pull of the empty room. Reset puts the view back.
		</p>
	{/snippet}
</RoomDemo>
