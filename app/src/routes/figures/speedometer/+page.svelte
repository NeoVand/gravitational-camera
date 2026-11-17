<script lang="ts">
	import { Compass01Icon, DashboardSpeed01Icon, WorkoutRunIcon } from '@hugeicons/core-free-icons';
	import { PauseIcon, Rocket01Icon } from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import Speedometer from '#lib/ui/Speedometer.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { minus, norm, type Vec3 } from '#lib/pixel/complex.js';
	import { lightReading, reading, type Thing } from '#lib/pixel/speedometer.js';

	const ROOM: Thing[] = [
		{ position: [-2.6, 1.7, 0.6], mass: 6e3, charge: 1 },
		{ position: [0.6, -1.9, -0.4], mass: 3e3, charge: -0.6 },
		{ position: [1.6, 2.1, 0.3], mass: 8e3, charge: 0.8 },
		{ position: [3.4, -1.2, 0.5], mass: 4e3, charge: 0.5 }
	];
	const C = 299_792_458;
	const WALK = 1.5 / C;

	let speed = $state(0.6);
	let heading = $state(300);
	let pixel: Vec3 = $state([-1.2, 0.1, 0]);
	let mover: 'still' | 'walk' | 'fast' = $state('still');

	const v: Vec3 = $derived([
		speed * Math.cos((heading * Math.PI) / 180),
		speed * Math.sin((heading * Math.PI) / 180),
		0
	]);
	const room: Thing[] = $derived(
		ROOM.map((t, i) =>
			i === 1 && mover !== 'still'
				? { ...t, velocity: [0, mover === 'walk' ? WALK : 0.05, 0] as Vec3 }
				: t
		)
	);
	const g = $derived(reading(room, pixel, v));
	const l = $derived(lightReading(ROOM, pixel, v));
	const error = $derived(norm(minus(g.read, v)));

	function reset() {
		pixel = [-1.2, 0.1, 0];
	}
	const fmt = (x: number) =>
		x < 1e-12 ? '< 10^{-12}' : x.toExponential(1).replace(/e([-+]\d+)/, '\\times 10^{$1}');
</script>

<svelte:head>
	<title>The speedometer in the dark · Gravitational Camera</title>
	<meta
		name="description"
		content="One gravitational pixel crossing a room it knows nothing about reads its own velocity, every component, at any speed; and knows at once if anything in the room moves. Light reads two components."
	/>
</svelte:head>

<DemoShell section="figures" title="The speedometer in the dark" onreset={reset}>
	{#snippet stage()}
		<Speedometer
			{room}
			{pixel}
			{v}
			gravity={g.read}
			light={l}
			alarm={g.alarm}
			onmove={(p) => (pixel = p)}
		/>
	{/snippet}

	{#snippet controls()}
		<Group title="The pixel">
			<Slider
				id="speed"
				label="Speed"
				icon={DashboardSpeed01Icon}
				min={0}
				max={0.9}
				step={0.01}
				bind:value={speed}
				readout="{speed.toFixed(2)} c"
				ends={['at rest', 'nearly c']}
			/>
			<Slider
				id="heading"
				label="Heading"
				icon={Compass01Icon}
				min={0}
				max={360}
				step={1}
				bind:value={heading}
				readout="{heading}°"
			/>
		</Group>
		<Group title="The room">
			<Segmented
				label="One of the masses"
				options={[
					{ value: 'still', label: 'Still', icon: PauseIcon },
					{ value: 'walk', label: 'Walks', icon: WorkoutRunIcon },
					{ value: 'fast', label: 'Flies', icon: Rocket01Icon }
				]}
				bind:value={mover}
			/>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			A pixel crosses a dark room at a good fraction of the speed of light. It knows nothing of the
			room: not how many masses there are, nor where. From one reading of its ten numbers it finds
			its own velocity, every component of it (orange, over the true one, dashed white), because the
			tide of a room at rest has no magnetic part in the room’s own frame, and that frame can be
			found from the reading alone.
		</p>
		<p>
			So the eigenvalues of what it reads stay real, however fast it goes. If anything in the room
			moves, a person walking past at 1.5 m/s, they turn complex, and the <strong
				>motion alarm</strong
			> goes off. The pixel’s own motion can never set it off.
		</p>
		<p>
			Light cannot do this. In a room of charges at rest, a sensor of light reads only the part of
			its velocity across the field it feels (blue); along the field, any speed looks the same.
		</p>
		<dl>
			<div>
				<dt>Gravity reads · error</dt>
				<dd>
					<Tex math={`${norm(g.read).toFixed(4)}\\,c \\cdot ${fmt(error)}`} />
				</dd>
			</div>
			<div>
				<dt>Light reads (across its field)</dt>
				<dd><Tex math={`${norm(l.read).toFixed(4)}\\,c`} /></dd>
			</div>
			<div>
				<dt>Motion alarm</dt>
				<dd><Tex math={g.alarm < 1e-15 ? '< 10^{-15}' : fmt(g.alarm)} /></dd>
			</div>
		</dl>
		<p class="fine">
			Drag the pixel to move it. The fields are exact for bodies at rest or moving steadily,
			computed as the paper’s reference implementation computes them; the readings here have no
			noise. With noise
			<Tex math={'\\sigma'} /> on each number, each component is read to
			<Tex math={'c\\,\\sigma/\\sqrt2\\,|\\lambda_b - \\lambda_c|'} />: two metres per second near a
			person, for a pixel that reads the room’s tide to one part in <Tex math={'10^8'} />.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>Ten numbers: four, three and three</h4>
		<p>
			The pixel’s complex matrix <Tex math={'\\mathcal{W} = \\mathcal{E} + i\\mathcal{B}'} /> can be written
		</p>
		<Tex
			display
			math={'\\mathcal{W} = P\\,\\mathrm{diag}(w_1, w_2, w_3)\\,P^{T},\\qquad P = R_0\\,e^{iK_0},'}
		/>
		<p>
			with <Tex math={'P'} /> a complex rotation: four numbers in the eigenvalues that no observer can
			change, three angles in <Tex math={'R_0'} />, and three in the imaginary rotation
			<Tex math={'e^{2iK_0} = P^{\\dagger}P'} />, the velocity of the one frame in which
			<Tex math={'\\mathcal{E}'} /> and <Tex math={'\\mathcal{B}'} /> share their axes. For a room at
			rest that frame is the room’s, and the eigenvalues are real for every observer.
		</p>
		<h4>Light’s blind spot</h4>
		<p>
			Light’s field has two invariants, <Tex math={'\\mathbf E^2 - c^2\\mathbf B^2'} /> and
			<Tex math={'\\mathbf E\\cdot\\mathbf B'} />. Where <Tex math={'\\mathbf B'} /> vanishes, a boost
			along <Tex math={'\\mathbf E'} /> leaves it vanishing: the frame is fixed only up to that boost.
			One body does the same to gravity, along the line to it; a room of several removes the blind spot.
		</p>
	{/snippet}
</DemoShell>
