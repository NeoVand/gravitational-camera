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
	 * sees both through the wall, its flow image shows which one moves and which way, and a single pixel's motion
	 * alarm goes off. Built here, frame by frame, from the locked safe's room.
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
		content="Two people behind a wall. Light sees the wall. The gravitational camera sees both people through it, and knows which one is moving."
	/>
</svelte:head>

<RoomDemo
	{scene}
	subjectDistance={5}
	startDivider={0.2}
	subtract
	startProbe
	startSensitivity={30}
	look={{ yaw: 0, pitch: -8 }}
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
			And one pixel knows that something moves without forming any image: the “Pixel” panel turns
			red. A room at rest can never set that off, however the camera moves.
		</p>
	{/snippet}
	{#snippet physicsExtra()}
		<p>
			A body moving across the line of sight with speed <Tex math={'v_\\perp'} /> adds to the pixel a
			magnetic part <Tex math={'|\\mathcal{B}| = \\sqrt3\\,(v_\\perp/c)\\,|\\mathcal{E}|'} />.
			Walking pace is
			<Tex math={'v/c \\approx 5\\times10^{-9}'} />, so the flow image is that much fainter than the
			mass image, and more blurred at the same sensitivity. The pixel’s alarm, the phase of its
			eigenvalues, needs no image at all.
		</p>
	{/snippet}
</RoomDemo>
