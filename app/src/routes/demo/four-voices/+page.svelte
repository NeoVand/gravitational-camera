<script lang="ts">
	import { PauseIcon, PlayIcon, VolumeHighIcon, WaveIcon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import Voices from '#lib/ui/Voices.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { unit, type Vec3 } from '#lib/pixel/complex.js';
	import { findGravity, findLight, read } from '#lib/pixel/voices.js';

	const HOME: Vec3[] = [
		unit([-0.6, 0.45, 0.66]),
		unit([0.45, 0.6, 0.66]),
		unit([0.62, -0.38, 0.69]),
		unit([-0.3, -0.62, 0.72]),
		unit([0.05, 0.1, 0.99])
	];
	const WINDOW = 48;
	const STEP = 0.09; // seconds between readings

	let count = $state(4);
	let noise = $state(0);
	let motion: 'play' | 'pause' = $state('play');
	let t = $state(10);
	let yaw = $state(0);
	let pitch = $state(0.15);
	let directions: Vec3[] = $state(HOME.map((d) => [...d] as Vec3));

	const sources = $derived(directions.slice(0, count));
	const readings = $derived(
		Array.from({ length: WINDOW }, (_, i) => {
			const k = Math.floor(t / STEP) - (WINDOW - 1 - i);
			return read(sources, k * STEP, noise, k);
		})
	);
	const gravity = $derived(findGravity(readings, noise));
	const light = $derived(findLight(readings, noise));

	// the clock: the waves play on while the demo is open and not paused
	$effect(() => {
		if (motion !== 'play') return;
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			t += Math.min(0.1, (now - last) / 1000);
			last = now;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function reset() {
		yaw = 0;
		pitch = 0.15;
		directions = HOME.map((d) => [...d] as Vec3);
	}
</script>

<svelte:head>
	<title>One pixel, four voices · Gravitational Camera</title>
	<meta
		name="description"
		content="One gravitational pixel hears four waves at once, each with any waveform, and finds where every one comes from. A sensor of light at one point finds two."
	/>
</svelte:head>

<DemoShell title="One pixel, four voices" onreset={reset}>
	{#snippet stage()}
		<Voices
			{sources}
			{readings}
			{gravity}
			{light}
			bind:yaw
			bind:pitch
			onmove={(i, d) => (directions[i] = d)}
		/>
	{/snippet}

	{#snippet controls()}
		<Group title="Waves">
			<Slider
				id="count"
				label="How many"
				icon={WaveIcon}
				min={1}
				max={5}
				step={1}
				bind:value={count}
				readout="{count} at once"
				ends={['one', 'five']}
			/>
			<Segmented
				label="Motion"
				options={[
					{ value: 'play', label: 'Playing', icon: PlayIcon },
					{ value: 'pause', label: 'Still', icon: PauseIcon }
				]}
				bind:value={motion}
			/>
		</Group>
		<Group title="The pixel">
			<Slider
				id="noise"
				label="Noise"
				icon={VolumeHighIcon}
				min={0}
				max={0.03}
				step={0.001}
				bind:value={noise}
				readout={noise ? `${(noise * 100).toFixed(1)} % of a wave` : 'none'}
				ends={['none', 'some']}
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			Up to five waves cross one point, each from its own direction and each with a waveform of its
			own, in both polarizations: a chirp, bursts, a hum, a rumble. One pixel reads the sum, ten
			numbers at every moment (top), and from those alone finds where each wave comes from (dots).
		</p>
		<p>
			A wave of gravity sets its ten numbers in a fixed proportion, a square, so however the
			waveforms wander, four waves leave one combination of the numbers silent. That combination
			vanishes on the sky at exactly four points: the four sources. Light’s field at a point is a
			vector, and its sensor finds two. Add a fifth wave (a third for light) and every combination
			is used: nothing is silent, and nothing can be found.
		</p>
		<dl>
			<div>
				<dt>Gravity · light</dt>
				<dd>
					found {gravity.directions.length} of {count} · {light.directions.length} of {count}
				</dd>
			</div>
		</dl>
		<p class="fine">
			Drag a source to move it, anywhere else on a sky to turn it. The shading is the sum, over the
			combinations the readings leave silent, of how far each direction is from silencing it, on a
			scale of three decades; dark is silent. Each moment uses the last 48 readings.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>A square for each wave</h4>
		<p>
			A plane wave travelling along <Tex math={'\\hat k'} /> sets the pixel’s complex matrix to
			<Tex math={'\\mathcal{W} = a(t)\\,\\mathbf m\\mathbf m^{T}'} />, with
			<Tex math={'\\mathbf m'} /> a complex null vector fixed by the direction and
			<Tex math={'a(t)'} /> any waveform. Four waves give readings in a four-dimensional subspace of the
			five complex dimensions of <Tex math={'\\mathcal{W}'} />, so one matrix
			<Tex math={'A'} /> has <Tex math={'\\mathrm{tr}(A\\mathcal{W}) = 0'} /> at every moment, and each
			wave’s <Tex math={'\\mathbf m'} /> satisfies
		</p>
		<Tex
			display
			math={'\\mathbf m^{T}A\\,\\mathbf m = 0, \\qquad \\mathbf m\\cdot\\mathbf m = 0 :'}
		/>
		<p>
			two conics, which meet in four points. For light the readings
			<Tex math={'\\mathbf E + ic\\mathbf B = a(t)\\,\\mathbf m'} /> are vectors; two waves leave one
			vector <Tex math={'\\mathbf a'} /> with <Tex math={'\\mathbf m\\cdot\\mathbf a = 0'} />, a
			single conic’s two points. In general a point sensor of spin <Tex math={'s'} /> separates
			<Tex math={'2s'} /> waves from their time history.
		</p>
	{/snippet}
</DemoShell>
