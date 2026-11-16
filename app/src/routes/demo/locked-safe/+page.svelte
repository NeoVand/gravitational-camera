<script lang="ts">
	import sceneJson from '../../../../../scenes/locked-safe.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>The locked safe · The Gravitational Camera</title>
	<meta
		name="description"
		content="Two identical steel safes, one holding gold. Ordinary light cannot tell them apart; the gravitational camera can."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={3.5} startDivider={0.6}>
	{#snippet intro()}
		<p>
			Two steel safes stand in a room. The right-hand one holds 320 kg of gold; the other is empty.
			In
			<strong>light</strong> they are identical. In <strong>gravity</strong> nothing can be hidden: mass
			has only one sign, so no wall, however thick, shields what is behind it.
		</p>
		<p>
			What limits the camera is blur, not walls. Lower the sensitivity and the gold dissolves into
			the safe around it.
		</p>
	{/snippet}
</RoomDemo>
