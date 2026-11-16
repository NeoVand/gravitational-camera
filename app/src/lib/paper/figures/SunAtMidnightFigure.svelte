<script lang="ts">
	import { resolve } from '$app/paths';
	import { objectsAt, scene, sunDirection } from '../../demos/sun-at-midnight';
	import type { View } from '../../engine';
	import SplitView from '../../ui/SplitView.svelte';

	let { poster }: { poster?: string } = $props();

	const DEG = Math.PI / 180;
	let view: View = $state({ yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG });
	let divider = $state(0.4);
	const objects = objectsAt(0);
	const sun = sunDirection(0);
</script>

<div class="live">
	<SplitView
		{objects}
		observer={scene.observer.position}
		sunDirection={sun}
		bind:view
		bind:divider
		interactive={false}
		{poster}
	/>
</div>
<p class="hint">
	Live figure: drag the divider. <a href={resolve('/demo/sun-at-midnight')}>Open the full demo</a>
	to look around and change the time of day.
</p>

<style>
	.live {
		aspect-ratio: 16 / 9;
		border-radius: 6px;
		overflow: hidden;
	}

	.hint {
		margin: 0.5rem 0 0;
		font: 400 0.76rem/1.4 var(--font-sans);
		color: var(--text-faint);
	}
</style>
