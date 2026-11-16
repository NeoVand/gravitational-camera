<script lang="ts">
	import sceneJson from '../../../../../scenes/full-or-empty.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
</script>

<svelte:head>
	<title>Full or empty · The Gravitational Camera</title>
	<meta
		name="description"
		content="Three identical steel tanks: one empty, one full of water, one full of mercury. The gravitational camera weighs them at a glance."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={3.5} startDivider={0.52}>
	{#snippet intro()}
		<p>
			Three steel tanks look the same in <strong>light</strong>. From left to right they hold air,
			water and mercury. In <strong>gravity</strong> brightness is mass along the line of sight, so the
			camera weighs them at a glance: mercury is thirteen times denser than water, and its tank far outshines
			the others.
		</p>
	{/snippet}
</RoomDemo>
