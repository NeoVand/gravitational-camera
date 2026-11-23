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

<RoomDemo {scene} subjectDistance={2.2} gravity="thermal" look={{ yaw: 14, pitch: -12 }} subtract>
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
			those frequencies the rearrangement is frozen, and the slow rearrangement that makes honey
			thick adds less than a hundred-millionth of a pascal second. What friction there is comes from
			the fast vibrations of hydrogen bonds and molecules, which honey and water share.
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
	{#snippet plain()}
		<p>
			Two sealed bottles stand on a wooden table, 2.2 metres from the camera. You cannot see through
			them. The left bottle holds honey and the right bottle holds water. Both are at room
			temperature. The picture is split by a vertical line. To the left, marked <em>Light</em>, is
			what an ordinary camera sees. To the right, marked <em>Gravity · thermal</em>, is what an
			imagined <strong>gravitational camera</strong> would show.
		</p>
		<p>
			This camera collects <strong>gravitational waves</strong>, which are ripples in gravity that
			travel at the speed of light. Every warm object sends out a very weak glow of these waves,
			made by the jiggling of its atoms and molecules. This is the <strong>thermal glow</strong>.
			The glass does not block it. Brightness shows how much glow arrives from each direction.
			Colour shows the temperature of what sent it.
		</p>
		<p>
			How brightly a material glows depends on its internal friction. Internal friction is how
			strongly the material resists having its layers slid past one another. For a liquid stirred
			slowly, this friction is its <strong>viscosity</strong>. Honey is ten thousand times more
			viscous than water. But the glow is set by the friction at the speed at which heat makes
			molecules jiggle, about ten million million times a second. Honey is thick because its
			molecules rearrange slowly. At such a speed they have no time to rearrange, so honey and water
			resist in much the same way.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>
				Drag the dividing line to the right, until you can see both bottles in light. They look
				alike.
			</li>
			<li>
				Look at the two bottles on the gravity side. They glow within a small factor of each other.
				Volume for volume, the honey here is about 3.8 times as bright as the water. Along a line of
				sight through the middle of each bottle, glass included, it is about 3.1 times as bright.
			</li>
			<li>
				Open the Controls tab and turn on the <em>Room</em> switch. The glow of the floor, walls and table
				comes back. It is about as bright as the bottles.
			</li>
		</ul>
		<p>
			The honey's value is an upper limit, because its friction at these speeds has not yet been
			worked out. The glow tells materials apart, but it says nothing of how a liquid pours. Section
			VI of the paper, “The thermal glow”, explains which friction matters.
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
			<em>Room</em> adds or removes the glow of the room.
		</p>
	{/snippet}
</RoomDemo>
