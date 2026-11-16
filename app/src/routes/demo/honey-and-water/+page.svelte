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
		content="Two sealed bottles at the same temperature, one of honey and one of water. Thermal gravitational glow follows internal friction, so they can differ."
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
			Thermal gravitational glow is set by how strongly a material resists being sheared at the
			frequencies of heat, trillions of times a second. This picture uses the everyday viscosities,
			with which honey glows ten thousand times brighter than water.
		</p>
		<p>
			That is an assumption, and probably the wrong one for honey. Honey is thick because its
			molecules rearrange slowly; at the frequencies of heat that rearrangement is frozen, and honey
			need not outshine water at all. What the picture does show is real: two liquids with different
			friction at those frequencies glow differently, through a sealed bottle, and the paper
			explains how that friction can be worked out.
		</p>
	{/snippet}
</RoomDemo>
