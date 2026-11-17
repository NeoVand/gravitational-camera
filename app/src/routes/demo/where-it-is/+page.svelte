<script lang="ts">
	import { DashboardSpeed01Icon, StopIcon, WorkoutRunIcon } from '@hugeicons/core-free-icons';
	import roomJson from '../../../../../scenes/locked-safe.scene.json';
	import mirrorJson from '../../../../../scenes/blank-mirror.scene.json';
	import type { Scene } from '#lib/engine/index.js';
	import RoomDemo from '#lib/ui/RoomDemo.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import type { Vec3 } from '#lib/pixel/complex.js';
	import { extrapolated, informed, position, retarded, type Crossing } from '#lib/pixel/present.js';

	/**
	 * A bronze ball flies across a room, with light slowed down so that it moves at a good fraction of light's
	 * speed. Two copies of it stand for what each half of the camera shows: one that light sees and that has no
	 * mass, where the light reaching the camera left it; and one with the ball's mass, unseen by light, where its
	 * field at the camera points (lib/pixel/present.ts). Built here rather than in scenes/, because the two copies
	 * coincide whenever the ball is at rest, which the scene format does not allow.
	 */
	const room = roomJson as unknown as Scene;
	const bronze = (mirrorJson as unknown as Scene).materials.bronze;
	const SPEED = 1.2; // the ball, metres per second
	const Y = 1.3;
	const Z = -3.6;
	const ENTER = -5.6;
	const LEAVE = 5.6;
	const camera = room.observer.position as Vec3;

	let beta = $state(0.6);
	let startX = $state(ENTER);
	let t = $state(0);
	let stop: number | undefined = $state();

	const c = $derived(SPEED / beta);
	const crossing: Crossing = $derived({ start: [startX, Y, Z], beta, c, stop });
	// where light shows the ball, and where its field at the camera says it is
	const seen = $derived(retarded(crossing, camera, t));
	const felt = $derived(
		stop !== undefined && t >= stop && !informed(crossing, camera, t)
			? extrapolated(crossing, t)
			: position(crossing, t)
	);

	const scene: Scene = $derived({
		...room,
		name: 'where-it-is',
		title: 'Where it is now',
		materials: {
			...room.materials,
			marble: (mirrorJson as unknown as Scene).materials.marble,
			'bronze-seen': { ...bronze, density: 0.001 },
			'bronze-mass': { ...bronze, light: { ...bronze.light!, hidden: true } }
		},
		objects: [
			...room.objects.filter((o) =>
				['floor', 'back-wall', 'left-wall', 'right-wall'].includes(o.id)
			),
			{
				id: 'plinth',
				shape: { type: 'box', center: [0, 0.45, -4.6], size: [0.6, 0.9, 0.6] },
				material: 'marble'
			},
			{
				id: 'ball-seen',
				shape: { type: 'sphere', center: seen, radius: 0.3 },
				material: 'bronze-seen'
			},
			{
				id: 'ball-mass',
				shape: { type: 'sphere', center: felt, radius: 0.3 },
				material: 'bronze-mass'
			}
		]
	});

	$effect(() => {
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			t += Math.min(0.05, (now - last) / 1000);
			last = now;
			if (stop === undefined && position(crossing, t)[0] > LEAVE) restart();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function restart() {
		t = 0;
		startX = ENTER;
		stop = undefined;
	}
	function setBeta(v: number) {
		const x = position(crossing, t)[0];
		beta = v;
		if (stop === undefined) startX = x - SPEED * t;
	}
	function setPhase(v: 'moving' | 'stopped') {
		if (v === 'stopped' && stop === undefined) stop = t;
		if (v === 'moving' && stop !== undefined) restart();
	}
</script>

<svelte:head>
	<title>Where it is now · Gravitational Camera</title>
	<meta
		name="description"
		content="A ball flies across a room with light slowed down: light shows it where it was, the gravitational camera where it is. Stop it, and watch each find out."
	/>
</svelte:head>

<RoomDemo {scene} subjectDistance={4} startDivider={0.18} subtract look={{ yaw: 0, pitch: -6 }}>
	{#snippet extraControls()}
		<Group title="The ball">
			<Slider
				id="beta"
				label="Light slowed to"
				icon={DashboardSpeed01Icon}
				min={0.15}
				max={0.9}
				step={0.01}
				bind:value={() => beta, setBeta}
				readout="{c.toFixed(1)} m/s: the ball at {beta.toFixed(2)} c"
				ends={['nearly normal', 'barely faster']}
			/>
			<Segmented
				label="Stop or go"
				options={[
					{ value: 'moving', label: 'Flying', icon: WorkoutRunIcon },
					{ value: 'stopped', label: 'Stop it', icon: StopIcon }
				]}
				bind:value={() => (stop === undefined ? 'moving' : 'stopped'), setPhase}
			/>
		</Group>
	{/snippet}
	{#snippet extraOverlay()}
		<p class="slow">light slowed to {c.toFixed(1)} m/s</p>
	{/snippet}
	{#snippet intro()}
		<p>
			A bronze ball flies across a room. Light has been slowed down here, and labelled so, to a few
			metres a second, so that the ball moves at a good fraction of its speed. Seen by
			<strong>light</strong>, it is where it was when the light now reaching the camera left it:
			behind its true place, by more the faster it goes.
		</p>
		<p>
			The <strong>gravitational</strong> camera sees it where it is. The field of a body moving steadily
			is its field at rest carried along, so it points at the present position, however slow light is.
			On the gravity side the glow is the ball’s mass, and the faint outline is where light shows it (“Outline”
			in the layers); drag the divider to see the light picture itself. The pull of the empty room is
			subtracted, so that only the ball and the plinth show.
		</p>
		<p>
			Press <em>Stop it</em>. Neither half can know at once. Light goes on showing the ball flying
			until the light from the stop arrives; the field goes on pointing at where the ball would have
			been until the news, travelling at the speed of light as a wave, reaches the camera. Then both
			agree.
		</p>
	{/snippet}
	{#snippet physicsExtra()}
		<p>
			The ball is drawn twice, once for each half: light sees a copy with no mass, where light from
			the ball left it, <Tex math={'|\\mathbf x - \\mathbf p(t_r)| = c\\,(t - t_r)'} />; gravity
			sees the ball’s mass, unseen by light, at <Tex math={'\\mathbf p(t)'} />. At these speeds the
			moving ball’s field is also squeezed along its motion, by <Tex math={'1/\\gamma'} />; that is
			left out of the picture. For bodies in orbit the field anticipates the curve of the orbit as
			well, to second order (the paper, Section III).
		</p>
	{/snippet}
</RoomDemo>

<style>
	.slow {
		position: absolute;
		left: 50%;
		top: 1rem;
		translate: -50% 0;
		margin: 0;
		padding: 0.35em 0.8em;
		border-radius: 999px;
		background: rgb(8 10 14 / 0.65);
		border: 1px solid rgb(255 255 255 / 0.18);
		color: rgb(255 255 255 / 0.85);
		font: 500 0.72rem/1.2 var(--font-sans);
		pointer-events: none;
	}
</style>
