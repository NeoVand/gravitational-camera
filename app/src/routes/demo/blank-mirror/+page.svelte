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
	startDivider={0.57}
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
</RoomDemo>
