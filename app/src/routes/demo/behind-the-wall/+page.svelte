<script lang="ts">
	import { PauseIcon, WorkoutRunIcon } from '@hugeicons/core-free-icons';
	import roomJson from '../../../../../scenes/locked-safe.scene.json';
	import type { Scene, Vec3 } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Tex from '#lib/ui/Tex.svelte';

	/**
	 * Two people behind a wall that light cannot see through; one walks back and forth. The gravitational camera
	 * sees both through the wall, its flow image shows which one moves and which way, and a single pixel's test for
	 * motion turns on. Built here, frame by frame, from the locked safe's room.
	 */
	const room = roomJson as unknown as Scene;
	const WALK = 1.4; // m/s
	const FROM = -0.3;
	const TO = 2.5;

	let walker: 'walks' | 'stands' = $state('walks');
	let t = $state(0);

	// back and forth along the room, at a steady walking pace
	const leg = (TO - FROM) / WALK;
	const phase = $derived((t % (2 * leg)) / leg);
	const x = $derived(
		walker === 'walks' ? FROM + (TO - FROM) * (phase < 1 ? phase : 2 - phase) : 1.4
	);
	const v = $derived(walker === 'walks' ? (phase < 1 ? WALK : -WALK) : 0);

	const person = (id: string, center: Vec3, velocity?: Vec3) => ({
		id,
		shape: { type: 'box' as const, center, size: [0.36, 1.7, 0.2] as Vec3 },
		material: 'person',
		velocity
	});

	const scene: Scene = $derived({
		...room,
		name: 'behind-the-wall',
		title: 'Behind the wall',
		materials: {
			...room.materials,
			person: {
				density: 985,
				temperature: 310,
				friction: 0.001,
				light: { color: [0.55, 0.42, 0.34], texture: 'fabric' }
			}
		},
		objects: [
			...room.objects.filter((o) =>
				['floor', 'back-wall', 'left-wall', 'right-wall'].includes(o.id)
			),
			{
				id: 'partition',
				background: true,
				shape: { type: 'box', center: [0, 1.3, -2.8], size: [9, 2.6, 0.15] },
				material: 'plaster'
			},
			person('standing', [-0.9, 0.85, -4.2]),
			person('walking', [x, 0.85, -5.6], [v, 0, 0])
		]
	});

	$effect(() => {
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			t += Math.min(0.05, (now - last) / 1000);
			last = now;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svelte:head>
	<title>Behind the wall · Gravitational Camera</title>
	<meta
		name="description"
		content="Two people behind a wall. Light sees the wall. The gravitational camera sees both people through it, and shows which one is moving."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={5}
	subtract
	startProbe
	startSensitivity={30}
	look={{ yaw: 18.5, pitch: -8 }}
	subject={{ id: 'standing', name: 'the person standing' }}
>
	{#snippet extraControls()}
		<Group title="The people">
			<Segmented
				label="The second person"
				options={[
					{ value: 'walks', label: 'Walks', icon: WorkoutRunIcon },
					{ value: 'stands', label: 'Stands', icon: PauseIcon }
				]}
				bind:value={walker}
			/>
		</Group>
	{/snippet}
	{#snippet intro()}
		<p>
			A wall across the room. In <strong>light</strong> that is all there is. Behind it two people stand,
			and one of them walks back and forth.
		</p>
		<p>
			The <strong>gravitational</strong> camera sees both through the wall: mass has one sign, so no wall
			screens it, and the pull of the wall itself, like the rest of the empty room, is known in advance
			and subtracted. The walker also shows in the second half of each pixel, the one that records moving
			mass: the colour on the walker is the flow, its hue the direction of walking.
		</p>
		<p>
			And a single pixel detects that something moves without forming any image: the eigenvalues of
			its reading turn complex, and the “Pixel” panel turns red. A room at rest can never do that,
			however the camera moves.
		</p>
	{/snippet}
	{#snippet physicsExtra()}
		<p>
			A body moving across the line of sight with speed <Tex math={'v_\\perp'} /> adds to the pixel a
			magnetic part <Tex math={'|\\mathcal{B}| = \\sqrt3\\,(v_\\perp/c)\\,|\\mathcal{E}|'} />.
			Walking pace is
			<Tex math={'v/c \\approx 5\\times10^{-9}'} />, so the flow image is that much fainter than the
			mass image, and more blurred at the same sensitivity. The pixel’s test for motion, the
			imaginary part of its eigenvalues, needs no image at all.
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			A wall stands across a room, 2.8 metres from the camera. Behind it are two people. One stands
			still. The other walks back and forth at a steady walking pace. Light cannot pass the wall, so
			an ordinary camera sees only the wall.
		</p>
		<p>
			The picture is split by a vertical line. To the left, marked <em>Light</em>, is what an
			ordinary camera sees. To the right is what an imagined <strong>gravitational camera</strong> would
			show. Each pixel of this camera measures how the pull of gravity changes from one point to the next.
			On the gravity side, the dark blue to white glow shows mass along each line of sight. Both people
			show through the wall, because no wall can block a pull. The pull of the wall itself, and of the
			rest of the empty room, is known in advance and taken away.
		</p>
		<p>
			Moving mass also produces a second kind of gravitational effect, much as a moving electric
			charge produces magnetism. Each pixel measures this too. It shows the walker in colour, and
			the colour gives the direction of walking.
		</p>
		<p>
			A single pixel can even tell that something moves without forming any picture. The line at the
			foot of the panel, headed <em>One pixel, at the camera</em>, reports a test on that one
			pixel's reading. The test gives exactly zero when nothing in the scene moves, whatever the
			camera does. When someone walks, it gives a small number, and the line turns red with the
			words “something moves”.
		</p>
		<p>Try these first.</p>
		<ul>
			<li>Drag the dividing line to the right to see the wall in light, then back again.</li>
			<li>
				Open the Controls tab. Under <em>The people</em>, choose <em>Stands</em>. The colour on the
				second person goes, and the line at the foot of the panel says “all still”. Choose
				<em>Walks</em> to set the person moving again.
			</li>
			<li>
				With both people standing, drag the picture to turn the camera. The test still says “all
				still”.
			</li>
		</ul>
		<p>
			Walking pace is about five billionths of the speed of light, so the colour is drawn far
			brighter than its true strength. Section VIII of the paper, “One pixel, sparse arrays and
			depth”, explains the test for motion.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, <em>Walks</em> and <em>Stands</em> set what the second person does.
			<em>Image</em>
			shows the gravity picture, <em>Tidal field</em> shows how gravity stretches and squeezes space
			at points around the camera, and <em>One exposure</em> adds the noise of one set of readings.
			<em>Sensitivity</em>
			sets how far the signal stands above the noise, and <em>Exposure</em> brightens the gravity
			side. Under Layers, <em>Flow</em> shows or hides the colour of moving mass, <em>Pixel</em>
			shows or hides the line about one pixel's reading, and <em>Room</em> brings back the wall, the floor
			and the walls. Reset puts the view back.
		</p>
	{/snippet}
</RoomDemo>
