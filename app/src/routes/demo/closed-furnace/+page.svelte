<script lang="ts">
	import sceneJson from '../../../../../scenes/closed-furnace.scene.json';
	import { analyzeScene, columnsAlong, type Scene, type Vec3 } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';

	const scene = sceneJson as unknown as Scene;
	const objects = analyzeScene(scene);
	const observer = scene.observer.position;

	/** Brightness along the line of sight through the middle of a block, with or without the room's own glow. */
	function through(id: string, subtractRoom: boolean): number {
		const block = objects.find((o) => o.id === id)!;
		const d = block.center.map((v, k) => v - observer[k]);
		const n = Math.hypot(...d);
		const dir = d.map((v) => v / n) as Vec3;
		return columnsAlong(objects, observer, dir, scene.observer.exclusion, subtractRoom)
			.numberRadiance;
	}
	const hotOverCold = (subtractRoom: boolean) =>
		Math.round(
			through('furnace-right-charge', subtractRoom) / through('furnace-left-charge', subtractRoom)
		);

	const hot = scene.materials['hot-iron'];
	const cold = scene.materials['cold-iron'];
	/** What equal friction would give, volume for volume: the cube of the temperatures' ratio. */
	const cube = (hot.temperature / cold.temperature) ** 3;
	/** What the scene's frictions give: a metal's falls as 1/T, which leaves the square. */
	const perVolume = (cube * (hot.friction ?? 0)) / (cold.friction ?? 1);
</script>

<svelte:head>
	<title>The closed furnace · Gravitational Camera</title>
	<meta
		name="description"
		content="Two identical closed furnaces holding the same block of iron, one hot and one cold. Thermal gravitational radiation shows the heat through the steel."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={3.5} startDivider={0.42} gravity="thermal">
	{#snippet intro()}
		<p>
			Two closed steel furnaces hold the same block of iron. In the right-hand one the iron is at
			{hot.temperature} K. In <strong>light</strong> they are identical, and since they hold the same
			mass even the near-field view cannot tell them apart.
		</p>
		<p>
			In <strong>thermal gravitational radiation</strong> both blocks show through the steel, and
			the hot one far outshines the cold. Along a line of sight through the middle of each block it
			is {hotOverCold(true)} times the brighter, or {hotOverCold(false)} times with the glow of the floor
			behind counted. Matter is transparent to its own gravitational glow, so the camera reads the temperature
			inside, not the temperature of the skin.
		</p>
		<p>
			Every solid thing at room temperature glows faintly too. The bright line along the foot of the
			far wall is the floor itself, seen at a slant: there a line of sight crosses five times more
			concrete than looking straight down. A transparent glowing slab is brightest edge-on.
		</p>
		<p class="fine">
			Iron and steel are given the friction of iron’s spectrum. A metal’s friction falls as 1/T, so
			the hot block has a fifth of the cold one’s: volume for volume it sends
			{perVolume.toFixed(0)} times the cold block’s gravitons, not the {cube.toFixed(0)} that equal friction
			would give. Silica glass stands for concrete and plaster. Air is given no friction, so the air inside
			each furnace adds nothing.
		</p>
	{/snippet}
</RoomDemo>
