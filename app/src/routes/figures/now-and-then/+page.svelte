<script lang="ts">
	import {
		DashboardSpeed01Icon,
		PauseIcon,
		PlayIcon,
		StopIcon,
		WorkoutRunIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import NowAndThen from '#lib/ui/NowAndThen.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { position, type Crossing } from '#lib/pixel/present.js';

	const C = 1.5; // light's speed in the scene, units per second
	const Y = 1.4;
	const ENTER = -7.4;
	const LEAVE = 7.4;

	let beta = $state(0.6);
	let startX = $state(ENTER);
	let t = $state(0);
	let stop: number | undefined = $state();
	let motion: 'play' | 'pause' = $state('play');

	const crossing: Crossing = $derived({ start: [startX, Y, 0], beta, c: C, stop });

	// the clock; the body comes round again once it has left, unless it has stopped
	$effect(() => {
		if (motion !== 'play') return;
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

	/** A new speed, keeping the body where it is. */
	function setSpeed(v: number) {
		const x = position(crossing, t)[0];
		beta = v;
		if (stop === undefined) startX = x - v * C * t;
	}

	function setPhase(v: 'moving' | 'stopped') {
		if (v === 'stopped' && stop === undefined) stop = t;
		if (v === 'moving' && stop !== undefined) restart();
	}
</script>

<svelte:head>
	<title>Now and then · Gravitational Camera</title>
	<meta
		name="description"
		content="A body crossing a scene, with light slowed down: light shows where it was, the tidal field points at where it is. Stop it, and watch the news spread."
	/>
</svelte:head>

<DemoShell section="figures" title="Now and then" onreset={restart}>
	{#snippet stage()}
		<NowAndThen {crossing} {t} />
	{/snippet}

	{#snippet controls()}
		<Group title="The body">
			<Slider
				id="speed"
				label="Speed"
				icon={DashboardSpeed01Icon}
				min={0.1}
				max={0.9}
				step={0.01}
				bind:value={() => beta, setSpeed}
				readout="{beta.toFixed(2)} of light’s"
				ends={['slow', 'nearly light']}
			/>
			<Segmented
				label="Stop or go"
				options={[
					{ value: 'moving', label: 'Moving', icon: WorkoutRunIcon },
					{ value: 'stopped', label: 'Stop it', icon: StopIcon }
				]}
				bind:value={() => (stop === undefined ? 'moving' : 'stopped'), setPhase}
			/>
		</Group>
		<Group title="Time">
			<Segmented
				label="Motion"
				options={[
					{ value: 'play', label: 'Running', icon: PlayIcon },
					{ value: 'pause', label: 'Paused', icon: PauseIcon }
				]}
				bind:value={motion}
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			A body crosses the scene. Light is slowed down here, and labelled so, until the body moves at
			a good fraction of its speed. A camera below sees it by its <strong>light</strong> where it
			was when that light set out: behind. Its gravitational pixel feels the
			<strong>tidal field</strong>, whose stretch points straight at where the body is now. So does
			the field at every point of the scene (the short lines).
		</p>
		<p>
			Press <em>Stop it</em>. Nothing can know at once: the news spreads as a ring at the speed of
			light, the passing wave that joins the old field to the new. Outside the ring the field still
			points at where the body would have been, had it gone on; inside, at where it stopped. The
			camera learns of the stop, in light and in gravity, when the ring reaches it.
		</p>
		<p class="fine">
			For a body moving steadily the field is exact: its field at rest, carried along. The stop is a
			cartoon: something must stop the body, and its own field is left out, as is the wave in the
			ring. An electric field meter would also point at the present position of a steadily moving
			charge; what light shows, an image, comes from where it was. For bodies in orbit gravity goes
			further, and anticipates the curve of the orbit too (see the physics).
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>The field of a moving body</h4>
		<p>
			A body moving steadily carries its field at rest along with it. Seen from the scene, that
			field is the static one at the separation measured in the body’s own frame, turned by the
			boost, an imaginary rotation of the complex matrix <Tex
				math={'\\mathcal{W} = \\mathcal{E} + i\\mathcal{B}'}
			/>:
		</p>
		<Tex
			display
			math={'\\mathcal{W} = L\\,\\mathcal{W}_0(\\mathbf r^{\\prime})\\,L^{T}, \\qquad L = e^{i\\eta[\\hat{\\mathbf u}]_\\times}.'}
		/>
		<p>
			Its stretch axis lies along the line to where the body is now, at any speed, while light
			arrives from where it was, displaced by the aberration angle, about <Tex
				math={'v_\\perp/c'}
			/>.
		</p>
		<h4>Orbits, and the Sun</h4>
		<p>
			Near two masses in orbit, the changing part of the tidal field is Newton’s field of their
			present positions to order <Tex math={'(kr)^2'} />; their retarded positions miss by
			<Tex math={'kr'} />. The first-order retardation cancels because mass and momentum are
			conserved. So the gravitational Sun is 20.5″ ahead of the Sun we see, along its yearly path,
			as general relativity predicts and as Laplace, who did not know this, took for gravity being
			far faster than light.
		</p>
	{/snippet}
</DemoShell>
