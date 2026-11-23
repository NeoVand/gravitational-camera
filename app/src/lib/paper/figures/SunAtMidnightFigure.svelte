<script lang="ts">
	import { objectsAt, scene, sunDirection } from '../../demos/sun-at-midnight';
	import type { View } from '../../engine';
	import SplitView from '../../ui/SplitView.svelte';
	import Frame from './interactive/Frame.svelte';

	let { poster }: { poster?: string } = $props();

	const DEG = Math.PI / 180;
	let view: View = $state({ yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG });
	let divider = $state(0.4);
	const objects = objectsAt(0);
	const sun = sunDirection(0);
</script>

<Frame
	slug="sun-at-midnight"
	section="demo"
	aspect={16 / 9}
	hint="Drag to look around, or drag the divider."
>
	{#snippet stage()}
		<SplitView
			{objects}
			observer={scene.observer.position}
			sunDirection={sun}
			bind:view
			bind:divider
			embedded
			{poster}
		/>
	{/snippet}
</Frame>
