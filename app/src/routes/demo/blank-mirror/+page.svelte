<script lang="ts">
	import sceneJson from '../../../../../scenes/blank-mirror.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>The blank mirror · Gravitational Camera</title>
	<meta
		name="description"
		content="A mirror, a television and a printed page. In light each carries a picture; to the gravitational camera all three are blank slabs."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={8}
	look={{ yaw: 13, pitch: -6 }}
	subtract
	subject={{ id: 'ball', name: 'the bronze ball' }}
>
	{#snippet intro()}
		<p>
			On the wall hang a mirror, a printed page and a television. In <strong>light</strong> each
			carries a picture: a reflection, a text, a landscape. A picture has no mass. In
			<strong>gravity</strong> the three are thin, faint, blank slabs (raise the exposure to see them),
			and the bronze ball beside the mirror has no twin inside it.
		</p>
		<p>
			This is what the camera cannot do, and also why it cannot be fooled: it cannot read, and an
			image of a thing is not the thing. Drag the divider left across the mirror.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			On the far wall of a room hang a mirror, a printed page and a television. In front of the
			mirror, a bronze ball stands on a marble plinth. The picture is split by a vertical line. To
			the left, marked <em>Light</em>, is what an ordinary camera sees. To the right, marked
			<em>Gravity · near field</em>, is what an imagined <strong>gravitational camera</strong> would show.
		</p>
		<p>
			This camera does not collect light. Each of its pixels measures how the pull of gravity
			changes from one point to the next. In this way it feels every mass nearby. On the gravity
			side, brightness shows mass along each line of sight. Black means no mass. Dark blue, then
			teal, then white mean more and more mass. The pull of the empty room has been taken away to
			begin with. So the floor and walls do not show, and only what was brought in does.
		</p>
		<p>
			In light, each of the three things on the wall carries a picture: a reflection, a text and a
			landscape. A picture has no mass. To the gravitational camera, each is only a thin, faint slab
			of glass, paper or plastic.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>
				Drag the dividing line slowly to the left, across the mirror. In light, the mirror shows a
				second bronze ball. In gravity, there is only one ball, because a reflection has no mass.
			</li>
			<li>
				Open the Controls tab and move the <em>Exposure</em> slider to the right. The three slabs appear,
				faint and blank. The page shows no text, and the screen shows no landscape.
			</li>
			<li>
				Turn on the <em>Room</em> switch under Layers. The floor and walls come back, and the thin slabs
				are lost against the wall behind them.
			</li>
		</ul>
		<p>
			The camera cannot read, and it cannot see a picture on a screen. The ink on a page and the
			light on a screen carry far too little mass. For the same reason, it cannot be fooled by an
			image of a thing, because an image is not the thing. Section X of the paper, “What the camera
			can do that light cannot”, lists this among what the camera cannot do.
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
			above the noise, and <em>Exposure</em> brightens or darkens the gravity side. The
			<em>Layers</em>
			switches show or hide each part of the picture. <em>Room</em> adds or removes the pull of the floor
			and walls. Reset puts the view back.
		</p>
	{/snippet}
</RoomDemo>
