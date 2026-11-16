<script lang="ts">
	/**
	 * Draws one scene in ordinary light, filling the window, from a camera given
	 * in the address: ?scene=locked-safe&yaw=0&pitch=-14&fov=52 (degrees), with
	 * an optional &exposure= for a long exposure of a night scene. The
	 * paper's figures put this picture beside the gravitational image computed
	 * by the reference implementation from the same camera
	 * (paper/figures/make_figures.py; captured by scripts/capture.mjs).
	 */
	import type { Scene, View } from '#lib/engine/index.js';
	import { objectsAt, scene as sunScene, sunDirection } from '#lib/demos/sun-at-midnight.js';
	import { analyzeScene } from '#lib/engine/index.js';
	import SplitView from '#lib/ui/SplitView.svelte';
	import closedFurnace from '../../../../../scenes/closed-furnace.scene.json';
	import lockedSafe from '../../../../../scenes/locked-safe.scene.json';
	import whichWay from '../../../../../scenes/which-way.scene.json';

	const rooms: Record<string, Scene> = {
		'locked-safe': lockedSafe as unknown as Scene,
		'closed-furnace': closedFurnace as unknown as Scene,
		'which-way': whichWay as unknown as Scene
	};

	const DEG = Math.PI / 180;
	let ready = $state(false);
	let name = $state('sun-at-midnight');
	let view: View = $state({ yaw: 0, pitch: 0, fov: 52 * DEG });
	let exposure = $state(1);

	function read() {
		const q = new URLSearchParams(location.search);
		name = q.get('scene') ?? name;
		view = {
			yaw: Number(q.get('yaw') ?? 0) * DEG,
			pitch: Number(q.get('pitch') ?? 0) * DEG,
			fov: Number(q.get('fov') ?? 52) * DEG
		};
		exposure = Number(q.get('exposure') ?? 1);
		ready = true;
	}

	const room = $derived(rooms[name]);
	const objects = $derived(room ? analyzeScene(room) : objectsAt(0));
	const observer = $derived(room ? room.observer.position : sunScene.observer.position);
</script>

<svelte:head>
	<title>Render · Gravitational Camera</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main {@attach read}>
	{#if ready}
		<SplitView
			{objects}
			{observer}
			sunDirection={room ? [0, 1, 0] : sunDirection(0)}
			bind:view
			showGravity={false}
			lightExposure={exposure}
			room={Boolean(room)}
			interactive={false}
		/>
	{/if}
</main>

<style>
	main {
		position: fixed;
		inset: 0;
		background: #000;
	}
</style>
