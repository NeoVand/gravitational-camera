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

<RoomDemo
	{scene}
	subjectDistance={4}
	subtract
	look={{ yaw: 0, pitch: -6 }}
	subject={{ id: 'ball-mass', name: 'the ball' }}
	caption="light slowed to {c.toFixed(1)} m/s"
>
	{#snippet extraControls()}
		<Group title="The ball">
			<Slider
				id="beta"
				label="Ball against light"
				icon={DashboardSpeed01Icon}
				min={0.15}
				max={0.9}
				step={0.01}
				bind:value={() => beta, setBeta}
				readout="{beta.toFixed(2)} c · light at {c.toFixed(1)} m/s"
				ends={['light much faster', 'light barely faster']}
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
			well, to second order (the paper, Section VIII).
		</p>
	{/snippet}
	{#snippet plain()}
		<p>
			A bronze ball flies across a room from left to right, 3.6 metres from the camera. In this view
			light has been slowed down to a few metres a second, so that the ball moves at a good fraction
			of light's speed. The label at the foot of the picture gives the slowed speed.
		</p>
		<p>
			The picture is split by a vertical line. To the left, marked <em>Light</em>, is what an
			ordinary camera sees. Light takes time to travel from the ball to the camera. So the camera
			sees the ball where it was when that light set out, which is behind its true place. To the
			right, marked <em>Gravity · near field</em>, is what an imagined
			<strong>gravitational camera</strong> would show. Each pixel of this camera measures how the pull
			of gravity changes from one point to the next. The glow is the ball's mass. The faint outline is
			where light shows the ball. The pull of the empty room has been taken away, so that only the ball
			and a marble plinth show.
		</p>
		<p>
			The glow is ahead of the outline. The field of a body that moves steadily is its field at
			rest, carried along with it. So it points at where the ball is now, however slow light is.
		</p>
		<p>Try these first. Open the Controls tab.</p>
		<ul>
			<li>Drag the dividing line to the right, and compare the two halves.</li>
			<li>
				Move the <em>Ball against light</em> slider. It sets the ball's speed as a fraction of the speed
				of light. Its readout gives that fraction and the speed of light in metres a second. The faster
				the ball goes compared with light, the farther behind the light picture falls.
			</li>
			<li>
				Press <em>Stop it</em>. Neither half of the picture shows the stop at once. Light goes on
				showing the ball flying until light from the stop arrives. The glow goes on moving, to where
				the ball would have been. It stops only when news of the stop reaches the camera. That news
				travels at the speed of light, as a ripple in gravity. Then both halves agree. Press
				<em>Flying</em> to start again.
			</li>
		</ul>
		<p>
			In the same way, the gravity of the Sun points to where the Sun is now. Section VIII of the
			paper, “One pixel, sparse arrays and depth”, finds that the Sun seen in gravity lies 20.5
			arcseconds ahead of the Sun seen in light. An arcsecond is a 3600th of a degree.
		</p>
	{/snippet}
	{#snippet help()}
		<p>
			Drag the picture to look around, and scroll to zoom. Drag the vertical dividing line to show
			more light or more gravity.
		</p>
		<p>
			In the Controls tab, the <em>Ball against light</em> slider sets how fast the ball goes
			compared with light, and so how slow light is in this view. <em>Stop it</em> stops the ball,
			and <em>Flying</em> sends it across again. <em>Image</em> shows the gravity picture,
			<em>Tidal field</em>
			shows how gravity stretches and squeezes space at points around the camera, and
			<em>One exposure</em>
			adds the noise of one set of readings. <em>Sensitivity</em> sets how far the signal stands
			above the noise, and <em>Exposure</em> brightens the gravity side. The <em>Layers</em>
			switches show or hide each part; <em>Outline</em> shows where light sees the ball. Reset puts the
			view back.
		</p>
	{/snippet}
</RoomDemo>
