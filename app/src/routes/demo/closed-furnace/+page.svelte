<script lang="ts">
	import sceneJson from '../../../../../scenes/closed-furnace.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>The closed furnace · Gravitational Camera</title>
	<meta
		name="description"
		content="Two identical closed furnaces holding the same block of iron, one hot and one cold. Thermal gravitational radiation shows the heat through the steel."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={3.5} startDivider={0.42} gravity="thermal">
	{#snippet intro()}
		<p>
			Two closed steel furnaces hold the same block of iron. In the right-hand one the iron is at
			1500 K. In <strong>light</strong> they are identical, and since they hold the same mass even the
			near-field view cannot tell them apart.
		</p>
		<p>
			In <strong>thermal gravitational radiation</strong> the hot iron glows straight through the steel:
			matter is transparent to its own gravitational glow, so the camera reads the temperature inside,
			not the temperature of the skin.
		</p>
		<p>
			Everything at room temperature glows faintly too. The bright line along the foot of the far
			wall is the floor itself, seen at a slant: there a line of sight crosses five times more
			concrete than looking straight down. A transparent glowing slab is brightest edge-on.
		</p>
	{/snippet}
</RoomDemo>
