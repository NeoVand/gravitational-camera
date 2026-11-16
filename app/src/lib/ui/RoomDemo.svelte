<script lang="ts">
	/**
	 * A near-field demo in a room: ordinary light on one side, the mass seen by
	 * the gravitational camera on the other, with the blur that the chosen
	 * sensitivity leaves.
	 */
	import type { Snippet } from 'svelte';
	import { posters } from '../demos/posters';
	import {
		ContrastIcon,
		DashedLineCircleIcon,
		Home03Icon,
		Image01Icon,
		Layers01Icon,
		Orbit01Icon,
		Radar01Icon,
		Sun03Icon,
		TemperatureIcon
	} from '@hugeicons/core-free-icons';
	import {
		MODE_FIELD,
		MODE_LIGHT,
		MODE_NEAR,
		MODE_THERMAL,
		analyzeScene,
		cameraBasis,
		columnsAlong,
		nearFieldBlur,
		type Scene,
		type View
	} from '../engine';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import Toggle from './controls/Toggle.svelte';
	import { length, superscript, texLength, texSci } from './format';
	import Tex from './Tex.svelte';
	import { cutoff } from '../engine/resolution';

	interface Props {
		scene: Scene;
		/** Distance to the objects of interest, metres, for the blur readout. */
		subjectDistance: number;
		/** Where the divider starts, 0 to 1. */
		startDivider?: number;
		/** Which gravitational view the demo is about. */
		gravity?: 'near' | 'thermal';
		/** Starting direction of view, degrees. */
		look?: { yaw: number; pitch: number; fov?: number };
		/** Start with the empty room subtracted from the gravity view. */
		subtract?: boolean;
		intro: Snippet;
		/** Lines about this scene for the end of the physics tab. */
		physicsExtra?: Snippet;
	}

	let {
		scene,
		subjectDistance,
		startDivider = 0.5,
		gravity = 'near',
		// turned a little to the left, so the objects sit clear of the notes
		look = { yaw: 13, pitch: -13 },
		subtract = false,
		intro,
		physicsExtra
	}: Props = $props();

	const DEG = Math.PI / 180;
	// svelte-ignore state_referenced_locally
	const START: View = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: (look.fov ?? 58) * DEG };

	let view: View = $state({ ...START });
	// svelte-ignore state_referenced_locally
	let divider = $state(startDivider);
	let outline = $state(true);
	let showLight = $state(true);
	let showGravity = $state(true);
	/** Signal-to-noise ratio as a power of ten. */
	let sensitivity = $state(20);
	let brightness = $state(0);
	let display: 'image' | 'pixels' = $state('image');
	// svelte-ignore state_referenced_locally
	let sliceDepth = $state(subjectDistance);
	// svelte-ignore state_referenced_locally
	let subtractRoom = $state(subtract);
	let splitView: SplitView | undefined = $state();

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	const exclusion = $derived(scene.observer.exclusion ?? 0.25);
	const hasRoom = $derived(objects.some((o) => o.background));

	// the near-field resolution law (paper, eq. resolution): full width at half
	// maximum of the best reconstruction of a point, for a planar array
	const blurAngle = $derived(nearFieldBlur(sensitivity));
	const blurSigma = $derived(blurAngle / 2.355);
	const centre = $derived(
		columnsAlong(objects, observer, cameraBasis(view).forward, exclusion, subtractRoom)
	);
</script>

<DemoShell
	title={scene.title}
	onreset={() => (view = { ...START })}
	onsave={() => splitView?.snapshot() ?? Promise.resolve(null)}
>
	{#snippet stage()}
		<SplitView
			bind:this={splitView}
			poster={posters[scene.name]}
			{objects}
			{observer}
			sunDirection={[0, 1, 0]}
			bind:view
			bind:divider
			{showLight}
			{showGravity}
			leftMode={MODE_LIGHT}
			rightMode={gravity === 'thermal'
				? MODE_THERMAL
				: display === 'pixels'
					? MODE_FIELD
					: MODE_NEAR}
			fieldDepth={sliceDepth}
			exposure={(gravity === 'near' ? 2.2 : 1.6) * 10 ** brightness}
			nearBlur={blurSigma}
			{exclusion}
			room
			{outline}
			{subtractRoom}
			rightLabel={gravity === 'thermal'
				? 'Gravity · thermal'
				: display === 'image'
					? 'Gravity · near field'
					: 'Gravity · tidal field'}
		/>
	{/snippet}

	{#snippet controls()}
		{#if gravity === 'near'}
			<Group title="View">
				<Segmented
					label="What the gravity side shows"
					options={[
						{ value: 'image', label: 'Image', icon: Image01Icon },
						{ value: 'pixels', label: 'Tidal field', icon: Layers01Icon }
					]}
					bind:value={display}
				/>
				{#if display === 'pixels'}
					<Slider
						id="slice"
						label="Slice"
						icon={Layers01Icon}
						min={0.6}
						max={9}
						step={0.05}
						bind:value={sliceDepth}
						readout="{length(sliceDepth)} away"
						ends={['near', 'far']}
					/>
				{/if}
			</Group>
		{/if}
		<Group title="Camera">
			{#if gravity === 'near'}
				<Slider
					id="sensitivity"
					label="Sensitivity"
					icon={Radar01Icon}
					min={1}
					max={60}
					step={0.5}
					bind:value={sensitivity}
					readout="10{superscript(sensitivity)} · blur {(blurAngle / DEG).toFixed(1)}°"
					ends={['noisy', 'sharp']}
				/>
			{/if}
			<Slider
				id="brightness"
				label="Exposure"
				icon={ContrastIcon}
				min={-1.5}
				max={1.5}
				step={0.05}
				bind:value={brightness}
				readout="× {(10 ** brightness).toFixed(brightness < 0 ? 2 : 1)}"
			/>
		</Group>
		<Group title="Layers">
			<div class="toggles">
				<Toggle icon={Sun03Icon} label="Light" bind:checked={showLight} />
				<Toggle
					icon={gravity === 'near' ? Orbit01Icon : TemperatureIcon}
					label="Gravity"
					bind:checked={showGravity}
				/>
				<Toggle
					icon={DashedLineCircleIcon}
					label="Outline"
					hint="A faint copy of the shapes in the light picture, to match masses to objects"
					bind:checked={outline}
				/>
				{#if hasRoom}
					<Toggle
						icon={Home03Icon}
						label="Room"
						hint="The pull and glow of the empty room, its floor and walls. Turn it off to subtract them: gravity adds up, so this is exact."
						bind:checked={() => !subtractRoom, (on) => (subtractRoom = !on)}
					/>
				{/if}
			</div>
		</Group>
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		{#if gravity === 'near'}
			<dl>
				<div>
					<dt>Smallest detail at {length(subjectDistance)}</dt>
					<dd><Tex math={texLength(blurAngle * subjectDistance)} /></dd>
				</div>
				<div>
					<dt>Mass along the centre of view, weighted by 1/distance</dt>
					<dd><Tex math={`${centre.tidalColumn.toFixed(0)}\\ \\mathrm{kg\\,m^{-3}}`} /></dd>
				</div>
			</dl>
			<p class="fine">
				The gravity side is the expected reconstruction: mass along each line of sight, weighted by
				the inverse of its distance, blurred by the limit that noise sets. “Outline” adds a faint
				copy of the shapes in the ordinary picture so they can be matched to masses. “Tidal field”
				shows what the camera records before any image is computed: the tensor at every point of a
				slice through the room.
			</p>
			{#if hasRoom}
				<p class="fine">
					Turning off “Room” removes the pull of the floor and walls. Gravity adds up linearly, so a
					reading taken with the room empty can be taken away exactly; what is left is everything
					that was brought in.
				</p>
			{/if}
		{:else}
			<dl>
				<div>
					<dt>Expected brightness at the centre of view</dt>
					<dd>
						<Tex
							math={`${texSci(centre.numberRadiance)}\\ \\text{gravitons}\\ \\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`}
						/>
					</dd>
				</div>
			</dl>
			<p class="fine">
				The gravity side is the expected thermal image: the glow of everything along each line of
				sight, with colour standing for temperature. At these rates a real detector would wait far
				longer than the age of the universe for a single graviton. Friction values are assumptions.
			</p>
			{#if hasRoom}
				<p class="fine">
					Turning off “Room” removes the glow of the floor and walls, which is known in advance.
					Glows add up, so this is exact.
				</p>
			{/if}
		{/if}
	{/snippet}
	{#snippet physics()}
		{#if gravity === 'near'}
			<h4>What a pixel records</h4>
			<p>
				Each pixel is a tiny tidal detector. It records the tidal tensor, how the gravity of the
				scene stretches and squeezes space where the pixel sits:
			</p>
			<Tex display math={'\\mathcal{E}_{ij} = \\partial_i \\partial_j \\Phi .'} />
			<h4>What the image is</h4>
			<p>
				Grouping the scene's mass by direction gives the field at the camera as an integral over the
				sky of the <em>tidal column</em>
				<Tex math={'S'} />, mass along each line of sight weighted by the inverse of its distance:
			</p>
			<Tex
				display
				math={'\\mathcal{E}_{ij} = G \\!\\int\\! d\\Omega\\, (\\delta_{ij} - 3\\hat n_i \\hat n_j)\\, S(\\hat n),'}
			/>
			<Tex display math={'S(\\hat n) = \\int \\rho(r\\hat n)\\, \\frac{dr}{r} .'} />
			<p>
				The gravity side shows <Tex math={'S'} />. Nothing absorbs or scatters gravity, and mass has
				one sign, so nothing in the room can hide anything else.
			</p>
			<h4>Why it is blurred</h4>
			<p>
				Detail of wavenumber <Tex math={'k'} /> fades as <Tex math={'e^{-kz}'} /> between a source at
				depth <Tex math={'z'} /> and the camera. The best reconstruction keeps it with weight
				<Tex math={'H = S^2/(1+S^2)'} />, where <Tex
					math={'S = \\pi\\,\\mathrm{SNR}\\,kz\\,e^{-kz}'}
				/>. That cuts off at <Tex math={'q_c'} />, and the blur is
			</p>
			<Tex
				display
				math={'\\Delta\\theta = \\frac{4.43}{q_c}, \\qquad q_c\\, e^{-q_c} = \\frac{1}{\\pi\\,\\mathrm{SNR}} .'}
			/>
			<p>
				Sensitivity helps only through a logarithm. At <Tex
					math={`\\mathrm{SNR} = 10^{${sensitivity}}`}
				/>, <Tex math={`q_c = ${cutoff(sensitivity).toFixed(1)}`} /> and the blur is
				<Tex math={`${(blurAngle / DEG).toFixed(1)}^\\circ`} />, or
				<Tex math={texLength(blurAngle * subjectDistance)} /> at
				<Tex math={`${subjectDistance}\\,\\mathrm{m}`} />.
			</p>
			<dl class="numbers">
				<div>
					<dt>Tidal column along the centre of view</dt>
					<dd><Tex math={`S = ${centre.tidalColumn.toFixed(0)}\\ \\mathrm{kg\\,m^{-3}}`} /></dd>
				</div>
			</dl>
		{:else}
			<h4>Why warm matter glows</h4>
			<p>
				Anything that resists being sheared absorbs gravitational waves, at a rate set by its
				viscosity <Tex math={'\\eta'} />:
			</p>
			<Tex display math={'\\alpha = \\frac{16\\pi G\\,\\eta}{c^3} .'} />
			<p>
				By Kirchhoff's law, whatever absorbs also emits. At temperature <Tex math={'T'} /> each cubic
				metre sends out energy and gravitons at the rates
			</p>
			<Tex
				display
				math={'j_E = \\frac{\\alpha\\,\\sigma T^4}{\\pi}, \\qquad j_N = \\frac{j_E}{2.701\\,k_B T} \\;\\propto\\; \\eta\\,T^3 .'}
			/>
			<h4>What the image is</h4>
			<p>
				Matter is transparent to its own glow, so a pixel adds up everything along its line of
				sight:
			</p>
			<Tex display math={'N(\\hat n) = \\int j_N\\, dl .'} />
			<p>
				That is why the inside of a closed box shows, why a slab is brightest seen edge-on, and why
				the wavelength (microns, like thermal infrared) leaves the picture sharp.
			</p>
			<dl class="numbers">
				<div>
					<dt>Brightness along the centre of view</dt>
					<dd>
						<Tex
							math={`N = ${texSci(centre.numberRadiance)}\\ \\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`}
						/>
					</dd>
				</div>
			</dl>
		{/if}
		{@render physicsExtra?.()}
	{/snippet}
</DemoShell>
