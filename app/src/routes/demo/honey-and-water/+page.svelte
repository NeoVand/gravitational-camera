<script lang="ts">
	import sceneJson from '../../../../../scenes/honey-and-water.scene.json';
	import { analyzeScene, columnsAlong, type Scene, type Vec3 } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { texSci, texWait } from '#lib/ui/format.js';

	const scene = sceneJson as unknown as Scene;
	const objects = analyzeScene(scene);
	const observer = scene.observer.position;

	const honey = scene.materials['honey'];
	const water = scene.materials['water'];
	/** Honey's everyday viscosity, Pa s: what an earlier version of this picture used as its friction. */
	const STIRRED = 10;
	/** The relaxing shear stiffness whose most the honey is given (reference/gravcam/scenefriction.py), GPa. */
	const HONEY_STIFFNESS = 30;

	/** Volume for volume, at one temperature, the glow goes as the friction. */
	const perVolume = (honey.friction ?? 0) / (water.friction ?? 1);

	/** Brightness along the line of sight through the middle of a bottle's contents, glass and all. */
	function through(id: string): number {
		const o = objects.find((x) => x.id === id)!;
		const d = o.center.map((v, k) => v - observer[k]);
		const n = Math.hypot(...d);
		const dir = d.map((v) => v / n) as Vec3;
		return columnsAlong(objects, observer, dir, scene.observer.exclusion, true).numberRadiance;
	}
	const alongLine = through('bottle-left-contents') / through('bottle-right-contents');

	/** Gravitons per second that a bottle's contents alone send a detector of one square metre at the camera. */
	function rate(id: string): number {
		const o = objects.find((x) => x.id === id)!;
		const d2 = o.center.reduce((s, v, k) => s + (v - observer[k]) ** 2, 0);
		return (o.jN * o.ownVolume) / d2;
	}
	/** How many times the everyday viscosity, as friction, would overstate the honey's glow: at least this. */
	const overstated = Math.floor(STIRRED / (honey.friction ?? 1) / 1e4) * 1e4;
	const honeyRate = rate('bottle-left-contents');
	const waterRate = rate('bottle-right-contents');
</script>

<svelte:head>
	<title>Honey and water · Gravitational Camera</title>
	<meta
		name="description"
		content="Two sealed bottles at the same temperature, one of honey and one of water. Honey is far more viscous, yet at the frequencies of heat, which set the thermal gravitational glow, the two differ by a small factor."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={2.2}
	startDivider={0.3}
	gravity="thermal"
	look={{ yaw: 0, pitch: -12 }}
	subtract
>
	{#snippet intro()}
		<p>
			Two sealed, opaque bottles stand on a table at the same temperature. The left one holds honey,
			the right one water. In <strong>light</strong> they look alike: drag the divider to the right to
			see both.
		</p>
		<p>
			Stirred, honey is ten thousand times more viscous than water. That is not what sets its
			gravitational glow. A liquid glows in proportion to its friction at the frequencies of heat,
			trillions of times a second, and honey is viscous because its molecules rearrange slowly: at
			those frequencies the rearrangement is frozen, and less than a hundred-millionth of a pascal
			second of its viscosity is left. What dissipates a shear there are the fast vibrations of
			hydrogen bonds and molecules, which honey and water share.
		</p>
		<p>
			So in <strong>thermal gravitational radiation</strong> the two bottles glow within a small
			factor of each other: the honey here is {perVolume.toFixed(1)} times as bright as the water, volume
			for volume, and {alongLine.toFixed(1)} times along a line of sight through the middle of each bottle,
			glass included. That factor is all the camera has to tell them apart. Their temperatures are the
			same, and the glow says nothing of how a liquid pours.
		</p>
		<p class="fine">
			The water carries the friction of its simulated spectrum,
			<Tex math={`${texSci(water.friction ?? 0)}\\ \\mathrm{Pa\\,s}`} />. Honey’s has not been
			worked out; it is given the most that a relaxing shear stiffness of {HONEY_STIFFNESS} GPa, twice
			the water model’s, can send,
			<Tex math={`${texSci(honey.friction ?? 0)}\\ \\mathrm{Pa\\,s}`} />: an upper bound, and real
			honey may be nearer the water, or fainter than it. Its everyday viscosity used as its friction
			would overstate its glow
			{overstated.toLocaleString('en-GB')} times at least. Silica glass stands for the bottles, the floor
			and the walls; the glow of the room, about as bright as the bottles’, is taken away to begin with,
			and “Room” under Controls brings it back. The honey alone sends a detector of one square metre at
			the camera one graviton every
			<Tex math={texWait(1 / honeyRate)} />, the water one every
			<Tex math={texWait(1 / waterRate)} />.
		</p>
	{/snippet}
</RoomDemo>
