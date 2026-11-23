<script lang="ts">
	import sceneJson from '../../../../../scenes/which-way.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import WaveDemo from '#lib/ui/WaveDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>Which way it turns · Gravitational Camera</title>
	<meta
		name="description"
		content="Three sealed drums, one still and two turning. The polarization of their gravitational waves tells which is which, and which way."
	/>
</svelte:head>

<WaveDemo {scene} look={{ yaw: 1, pitch: 0 }} aperture={1.5}>
	{#snippet intro()}
		<p>
			Three sealed steel drums stand on a set of shelves against the wall, one above another. Inside
			each is a pair of steel balls on a shaft that points at the camera. In the bottom drum the
			pair is still; in the other two it turns once a second, in opposite directions. In <strong
				>light</strong
			> the drums are identical.
		</p>
		<p>
			A turning pair sends out <strong>gravitational waves</strong>. At the real speed of light the
			pair is far smaller than its waves, and the camera cannot resolve it; the slowed light of this
			view shortens the waves for display only. What the camera reads is their polarization: seen
			along the shaft, the pattern of stretching turns the same way as the balls. Colour shows the
			sense of turning.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			A set of shelves stands against the far wall, 4.5 metres from the camera. It holds three
			sealed steel drums, one above another. Inside each drum is a pair of steel balls on a shaft
			that points at the camera. In the bottom drum the pair is still. In the other two it turns
			once a second, one pair one way and the other pair the opposite way. In light the three drums
			look the same.
		</p>
		<p>
			The picture is split by a vertical line. To the left, marked <em>Light</em>, is what an
			ordinary camera sees. To the right is what an imagined <strong>gravitational camera</strong>
			would show. A turning pair sends out <strong>gravitational waves</strong>, which are ripples
			in gravity that travel at the speed of light. A wave stretches space in one direction and
			squeezes it in another. The pattern of stretch and squeeze, and the way it changes during each
			cycle, is called the wave's <strong>polarization</strong>. Seen along the shaft, the pattern
			turns round in the same direction as the balls.
		</p>
		<p>
			Each turning pair shows as one coloured spot. Magenta means that the pattern turns
			anticlockwise as the camera sees it. Green means clockwise. A pale spot means that the pair is
			seen edge-on. The still pair sends out no waves and shows nothing.
		</p>
		<p>
			At the true speed of light, these waves would be 150,000 kilometres long, and no camera in a
			room could form an image of them. So this view slows light down to 20 centimetres a second,
			and says so in the label at the foot of the picture. The waves are then 10 centimetres long.
			The colour of each spot does not depend on this.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>
				Turn on <em>Inside</em>. The drums are cut away in the light view, and you can watch each
				pair turn. Check each colour against the way its balls go round.
			</li>
			<li>Move the <em>Array width</em> slider. A wider camera makes smaller, sharper spots.</li>
			<li>
				Press <em>True speed</em>. The spots go, and the foot of the panel explains why. Press
				<em>Slow light</em> to bring them back.
			</li>
		</ul>
		<p>
			The camera cannot see the shape of the pair, but it can tell which way the pair turns. Section
			V of the paper, “Waves from moving bodies”, explains this.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the waves and <em>Tidal field</em> shows how gravity
			stretches and squeezes space at points around the camera. The <em>Speed of light</em> slider
			sets how far light is slowed. <em>Slow light</em> and <em>True speed</em> jump to either end.
			<em>Array width</em>
			sets the width of the camera, and <em>Exposure</em> brightens or darkens the gravity side.
			Under Layers, <em>Inside</em> cuts the drums away, <em>Raw pixels</em> draws the pattern of stretching
			from each drum, and the other switches show or hide each part. Reset puts the view back.
		</p>
	{/snippet}
</WaveDemo>
