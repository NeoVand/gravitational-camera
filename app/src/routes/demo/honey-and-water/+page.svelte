<script lang="ts">
	import sceneJson from '../../../../../scenes/honey-and-water.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>Honey and water · Gravitational Camera</title>
	<meta
		name="description"
		content="Two sealed bottles at the same temperature, one of honey and one of water. Thermal gravitational glow follows internal friction, so they differ."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={2.2}
	startDivider={0.42}
	gravity="thermal"
	look={{ yaw: 0, pitch: -12 }}
>
	{#snippet intro()}
		<p>
			Two sealed, opaque bottles stand on a table at the same temperature. The left one holds honey,
			the right one water. In <strong>light</strong> they look alike: drag the divider to the right to
			see both.
		</p>
		<p>
			Thermal gravitational glow is set by how strongly a material resists being sheared. With their
			everyday viscosities, honey glows ten thousand times brighter than water. Whether everyday
			viscosity carries over to the frequencies of heat is an open question in the paper, so read
			this picture as “if it does”.
		</p>
	{/snippet}
</RoomDemo>
