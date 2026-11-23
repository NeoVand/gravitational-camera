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

<RoomDemo {scene} subjectDistance={3.5} gravity="thermal">
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
			behind counted; the paper’s “about sixteen times as bright” is the second, with the floor. Matter
			is transparent to its own gravitational glow, so the camera reads the temperature inside, not the
			temperature of the skin.
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
	{#snippet plain()}
		<p>
			Two closed steel furnaces stand 3.5 metres from the camera. Each holds the same block of iron.
			The block in the right-hand furnace is at 1500 kelvin. The block in the left-hand furnace is
			at room temperature. The picture is split by a vertical line. To the left, marked <em
				>Light</em
			>, the two furnaces look the same. To the right, marked <em>Gravity · thermal</em>, is what an
			imagined <strong>gravitational camera</strong> would show.
		</p>
		<p>
			This camera collects <strong>gravitational waves</strong>, which are ripples in gravity that
			travel at the speed of light. Every warm object sends out a very weak glow of these waves,
			made by the jiggling of its atoms. This is the <strong>thermal glow</strong>. Almost nothing
			absorbs it, so steel walls do not block it. Each point of the picture adds up the glow of
			everything along its line of sight, like an X-ray in which things shine by their own heat.
			Brightness shows how much glow arrives. Colour shows the temperature of what sent it. Matter
			at room temperature is a dark red, and the hot iron is a bright orange-red.
		</p>
		<p>
			Along a line of sight through the middle of each block, the hot one is about 22 times brighter
			than the cold one. Counting the glow of the floor behind it, it is about 16 times brighter.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>Drag the dividing line to the left, so that the gravity side covers both furnaces.</li>
			<li>
				Look at the foot of the far wall. The bright line there is the floor itself, seen at a
				slant. A line of sight along the floor crosses much more concrete than one that points down.
			</li>
			<li>
				Open the Controls tab and turn off the <em>Room</em> switch. The glow of the floor and walls is
				taken away, and only the furnaces remain.
			</li>
			<li>
				Under View, choose <em>Counts</em>, then press <em>Long enough</em>. This shows the picture
				as a real detector would build it, one <strong>graviton</strong> at a time. A graviton is the
				smallest packet of gravitational-wave energy.
			</li>
		</ul>
		<p>
			The camera reads the temperature inside a body, not the temperature of its skin. The glow also
			depends on the material's internal friction, which is how strongly the material resists having
			its layers slid past one another. So the camera can read a temperature only if it knows the
			material. Section VI of the paper, “The thermal glow”, describes these two furnaces.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Image</em> shows the expected glow, <em>Tidal field</em> shows how
			gravity stretches and squeezes space at points around the camera, and <em>Counts</em> shows
			the gravitons that one exposure would collect. Under <em>Counts</em>, the sliders set the
			detector's area, the exposure time and the number of picture elements. <em>New exposure</em>
			draws the counts again, and <em>Long enough</em> sets a time that makes the picture clear.
			<em>Exposure</em>
			brightens or darkens the gravity side. The <em>Layers</em> switches show or hide each part.
			<em>Room</em> adds or removes the glow of the floor and walls.
		</p>
	{/snippet}
</RoomDemo>
