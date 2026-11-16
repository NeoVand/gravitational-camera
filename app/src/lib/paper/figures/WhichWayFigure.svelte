<script lang="ts">
	import sceneJson from '../../../../../scenes/which-way.scene.json';
	import type { Scene } from '../../engine';
	import LiveFigure from './LiveFigure.svelte';

	let { poster }: { poster?: string } = $props();
</script>

<LiveFigure
	scene={sceneJson as unknown as Scene}
	gravity="waves"
	look={{ yaw: 0, pitch: 0, fov: 50 }}
	divider={0.47}
	demo="which-way"
	{poster}
/>
