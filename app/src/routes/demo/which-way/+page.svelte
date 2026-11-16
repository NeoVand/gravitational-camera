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

<WaveDemo {scene} startDivider={0.585} look={{ yaw: 13, pitch: 0 }} aperture={1.5}>
	{#snippet intro()}
		<p>
			Three sealed steel drums stand on a shelf against the wall. Inside each is a pair of steel
			balls on a shaft that points at the camera. In one drum the pair is still; in the other two it
			turns once a second, in opposite directions. In <strong>light</strong> the drums are identical.
		</p>
		<p>
			A turning pair sends out <strong>gravitational waves</strong>. The camera cannot resolve the
			pair, which is far smaller than the waves, but it reads their polarization: seen along the
			shaft, the pattern of stretching turns the same way as the balls. Colour shows the sense of
			turning.
		</p>
	{/snippet}
</WaveDemo>
