<script lang="ts">
	import {
		Atom02Icon,
		DashboardSpeed01Icon,
		Orbit01Icon,
		SparklesIcon,
		StarIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import FourStars from '#lib/ui/FourStars.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Tex from '#lib/ui/Tex.svelte';
	import { norm, type Vec3 } from '#lib/pixel/complex.js';
	import { readGravity, sideways, type Source, type Wave } from '#lib/pixel/scene.js';

	type SceneKind = 'body' | 'two' | 'wave' | 'body-wave';

	const HOME: Vec3[] = [
		[-1.5, 0.15, 0.3],
		[0.9, 1.1, 0.6]
	];
	const K: Vec3 = [0.62, -0.42, 0.66];

	let kind = $state<SceneKind>('body');
	let speed = $state(0.6);
	let strength = $state(0.08);
	let yaw = $state(0.45);
	let pitch = $state(0.25);
	let positions: Vec3[] = $state(HOME.map((p) => [...p] as Vec3));

	// the first source moves up the screen at `speed`; the second stays put
	const sources: Source[] = $derived.by(() => {
		if (kind === 'wave') return [];
		const first: Source = { position: positions[0], mass: 1e3, charge: 1, velocity: [0, speed, 0] };
		if (kind === 'two')
			return [first, { position: positions[1], mass: 450, charge: 0.45, velocity: [0, 0, 0] }];
		return [first];
	});
	const wave: Wave | undefined = $derived(
		kind === 'wave' ? { k: K, strength: 1 } : kind === 'body-wave' ? { k: K, strength } : undefined
	);
	const reading = $derived(readGravity(sources, wave));
	const truth = $derived(sources.length === 1 ? sideways(sources[0]) : undefined);

	function reset() {
		yaw = 0.45;
		pitch = 0.25;
		positions = HOME.map((p) => [...p] as Vec3);
	}

	const fmt = (v: Vec3) => `${norm(v).toFixed(4)}\\,c`;
</script>

<svelte:head>
	<title>Principal null directions · Gravitational Camera</title>
	<meta
		name="description"
		content="Every reading of a gravitational pixel has four principal null directions, a reading of light only two. Move the sources and watch them: one body, a moving body, two bodies, a wave."
	/>
</svelte:head>

<DemoShell section="figures" title="Principal null directions" onreset={reset}>
	{#snippet stage()}
		<FourStars {sources} {wave} bind:yaw bind:pitch onmove={(i, p) => (positions[i] = p)} />
	{/snippet}

	{#snippet controls()}
		<Group title="Scene">
			<Segmented
				label="Sources"
				options={[
					{ value: 'body', label: 'One body', icon: Atom02Icon },
					{ value: 'two', label: 'Two', icon: Orbit01Icon },
					{ value: 'wave', label: 'A wave', icon: WavesIcon },
					{ value: 'body-wave', label: 'Both', icon: SparklesIcon }
				]}
				bind:value={kind}
			/>
		</Group>
		{#if kind !== 'wave'}
			<Group title="The first body">
				<Slider
					id="speed"
					label="Speed"
					icon={DashboardSpeed01Icon}
					min={0}
					max={0.95}
					step={0.01}
					bind:value={speed}
					readout="{speed.toFixed(2)} c, up the screen"
					ends={['at rest', 'nearly c']}
				/>
			</Group>
		{/if}
		{#if kind === 'body-wave'}
			<Group title="The wave">
				<Slider
					id="strength"
					label="Strength"
					icon={StarIcon}
					min={0}
					max={0.5}
					step={0.005}
					bind:value={strength}
					readout="{(strength * 100).toFixed(1)} % of the body's pull"
					ends={['none', 'strong']}
				/>
			</Group>
		{/if}
	{/snippet}

	{#snippet notes()}
		<p>
			A pixel of this camera reads ten numbers. Put together, they single out four directions on the
			sky around it, the <strong>principal null directions</strong> of the reading (for a field of spin
			two these are also called its Majorana stars). Light’s field at a point has only two.
		</p>
		<p>
			One body at rest puts gravity’s four directions in two pairs, on the line through it. Set it
			moving and both pairs fold toward its velocity; the arrow to their midpoint is its velocity
			across the line of sight, exactly, at any speed (the dotted ring is the true value). One wave
			puts all four on its direction of travel. A second body separates them, and the one reading
			shows that no single body could make this field. Light, at one point, gives the same two
			directions for one charge or many.
		</p>
		<dl>
			<div>
				<dt>What gravity’s four directions say</dt>
				<dd>
					{#if reading.type === 'D'}like one round body (Petrov type D){:else if reading.type === 'N'}one
						plane wave (type N){:else}not one round body or one wave (type {reading.type}){/if}
				</dd>
			</div>
			{#if reading.read && truth}
				<div>
					<dt>Sideways speed, from the directions · true</dt>
					<dd><Tex math={`${fmt(reading.read)} \\cdot ${fmt(truth)}`} /></dd>
				</div>
			{/if}
			{#if !Number.isNaN(reading.speciality)}
				<div>
					<dt>Speciality <Tex math={'|1 - 6J^2/I^3|'} />, zero for one body</dt>
					<dd>
						<Tex
							math={reading.speciality < 1e-9 ? '< 10^{-9}' : reading.speciality.toPrecision(3)}
						/>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="fine">
			Drag a body to move it, or drag anywhere else to turn the sky. Touching dots are directions
			that coincide; faint ones are on the far side. The fields are exact for bodies moving
			steadily, in linearized gravity, and computed here as the paper’s reference implementation
			computes them.
		</p>
	{/snippet}

	{#snippet physics()}
		<h4>Ten numbers, one complex matrix</h4>
		<p>
			The tidal field <Tex math={'\\mathcal{E}'} /> and its magnetic part <Tex
				math={'\\mathcal{B}'}
			/>
			make one complex symmetric matrix with no trace,
		</p>
		<Tex display math={'\\mathcal{W} = \\mathcal{E} + i\\,\\mathcal{B},'} />
		<p>
			on which every observer acts by a complex rotation. Writing a complex null vector by its point
			<Tex math={'z'} /> on the sky, <Tex
				math={'\\mathbf m(z) = (1 - z^2,\\, i(1 + z^2),\\, -2z)'}
			/>, the four directions are the roots of
		</p>
		<Tex display math={'\\mathbf m(z)^{T}\\,\\mathcal{W}\\,\\mathbf m(z) = 0 ,'} />
		<p>
			the principal null directions of the field. Light’s <Tex math={'\\mathbf E + ic\\mathbf B'} /> is
			a vector, and <Tex math={'\\mathbf m(z)\\cdot(\\mathbf E + ic\\mathbf B) = 0'} /> has only two roots.
		</p>
		<h4>A moving body, exactly</h4>
		<p>
			The field of a body moving steadily is its field at rest carried by a boost, an imaginary
			rotation
			<Tex math={'e^{i\\eta[\\hat{\\mathbf u}]_\\times}'} />, which moves its two pairs of
			directions by aberration. Their midpoint is
		</p>
		<Tex display math={'\\tfrac12(\\hat p_+ + \\hat p_-) = \\mathbf v_\\perp/c ,'} />
		<p>
			with <Tex math={'\\mathbf v_\\perp'} /> its velocity across the line from where it is now. The invariants
			<Tex math={'I = \\mathrm{tr}\\,\\mathcal{W}^2'} /> and
			<Tex math={'J = \\mathrm{tr}\\,\\mathcal{W}^3'} /> tell the types apart without solving anything:
			<Tex math={'1 - 6J^2/I^3 = 0'} /> for one body, <Tex math={'I = J = 0'} /> for one wave.
		</p>
	{/snippet}
</DemoShell>
