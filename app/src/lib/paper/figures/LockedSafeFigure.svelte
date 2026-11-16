<script lang="ts">
	import sceneJson from '../../../../../scenes/locked-safe.scene.json';
	import type { Scene } from '../../engine';
	import LiveFigure from './LiveFigure.svelte';

	let { poster }: { poster?: string } = $props();
</script>

<LiveFigure
	scene={sceneJson as unknown as Scene}
	gravity="near"
	look={{ yaw: 0, pitch: -14 }}
	divider={0.5}
	demo="locked-safe"
	{poster}
/>
