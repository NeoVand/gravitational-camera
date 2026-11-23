<script lang="ts">
	/**
	 * A wave demo in a room: ordinary light on one side, the gravitational waves
	 * of whatever spins on the other. At the true speed of light the waves are
	 * far longer than the room, which then lies inside their near zone, so the
	 * demo offers a clearly labelled setting in which light (and gravity)
	 * are slowed until the waves are centimetres long.
	 */
	import type { Snippet } from 'svelte';
	import { posters } from '../demos/posters';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ContrastIcon,
		DashedLineCircleIcon,
		Home03Icon,
		Image01Icon,
		Layers01Icon,
		RabbitIcon,
		Rotate01Icon,
		SnailIcon,
		Sun03Icon,
		RulerIcon,
		ViewIcon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import {
		MODE_LIGHT,
		MODE_FIELD,
		MODE_WAVES,
		analyzeScene,
		cameraBasis,
		gravitonRate,
		nearFieldBlur,
		packWaves,
		power,
		rotors as findRotors,
		seenFrom,
		spotWidth,
		spunAt,
		wavelength,
		type Scene,
		type View
	} from '../engine';
	import { C } from '../engine/physics/constants';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import WaveGlyphs from './WaveGlyphs.svelte';
	import TidalReading from './TidalReading.svelte';
	import FieldLegend from './FieldLegend.svelte';
	import FieldLookControls from './FieldLookControls.svelte';
	import { fieldReference } from '../pixel/field-view';
	import { roomSlices } from '../pixel/slices';
	import { sceneTide } from '../pixel/tide';
	import { ROOM_SOURCES, drumsReading, prepareDrums } from '../pixel/tide-demos';
	import type { Vec3 } from '../engine';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import Toggle from './controls/Toggle.svelte';
	import { length, sci, texLength, texSci } from './format';
	import Tex from './Tex.svelte';

	interface Props {
		scene: Scene;
		/** Where the divider starts, 0 to 1. */
		startDivider?: number;
		/** Starting direction of view, degrees. */
		look?: { yaw: number; pitch: number; fov?: number };
		/** Width of the camera's array of sensors, m. */
		aperture?: number;
		/** The slowed speed of light the demo starts with, m/s. */
		slowSpeed?: number;
		intro: Snippet;
	}

	let {
		scene,
		startDivider = 0.5,
		look = { yaw: 0, pitch: -10 },
		aperture: startAperture = 1,
		slowSpeed = 0.2,
		intro
	}: Props = $props();

	const DEG = Math.PI / 180;
	// svelte-ignore state_referenced_locally
	const START: View = { yaw: look.yaw * DEG, pitch: look.pitch * DEG, fov: (look.fov ?? 58) * DEG };
	const LOG_C = Math.log10(C);

	let view: View = $state({ ...START });
	// svelte-ignore state_referenced_locally
	let divider = $state(startDivider);
	// svelte-ignore state_referenced_locally
	let logSpeed = $state(Math.log10(slowSpeed));
	let brightness = $state(0);
	/** What the gravity side shows: the wave image, or the tidal field of the room and the drums. */
	let display = $state<'image' | 'field'>('image');
	/** Over the wave image: the pattern of stretching that each drum's waves give a ring of particles. */
	let rawPixels = $state(false);
	/** The field view: how far from the camera its points lie (the drums are 4.5 m away), and the room's part. */
	let sliceDepth = $state(4.5);
	let subtractRoom = $state(false);
	let outline = $state(true);
	let showLight = $state(true);
	let showGravity = $state(true);
	let splitView: SplitView | undefined = $state();
	// svelte-ignore state_referenced_locally
	let logAperture = $state(Math.log10(startAperture));
	const aperture = $derived(10 ** logAperture);
	/** Cut the drums away in the light view, and let the balls turn. */
	let inside = $state(false);
	let time = $state(0);
	const field = $derived(display === 'field');

	/** A clock for the turning balls, running while the drums are open or the camera's reading is shown. */
	function clock() {
		let frame = 0;
		let last = performance.now();
		const tick = (now: number) => {
			if (inside || field) time += (now - last) / 1000;
			last = now;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}

	const still = $derived(analyzeScene(scene));
	// the balls only need to move when they can be seen
	const objects = $derived(inside || field ? spunAt(still, time) : still);
	const observer = $derived(scene.observer.position);
	const rotors = $derived(findRotors(still));
	// the tide at the camera: what does not change through a turn is worked out once
	const drums = $derived(prepareDrums(scene.name, still, observer));
	const tide = $derived(drumsReading(drums, time, subtractRoom));
	// where the sphere of points meets something: the drums, the shelf, the walls and the floor
	const sliceMarks = $derived(
		roomSlices(still, observer, 0.45, ROOM_SOURCES['which-way'].groups).map((m) => ({
			at: m.at,
			label: `${m.label}, ${length(m.at)}`
		}))
	);
	// the field view's scale: the median strength over the picture, from the exact tensor of the boxes and balls
	const fieldScale = $derived.by(() => {
		const tanY = Math.tan(view.fov / 2);
		return fieldReference(
			(d) =>
				sceneTide(objects, observer.map((v, k) => v + sliceDepth * d[k]) as Vec3, subtractRoom),
			{ ...cameraBasis(view), tanX: tanY * (splitView?.aspect() ?? 1.6), tanY }
		);
	});
	const trueSpeed = $derived(logSpeed >= LOG_C - 1e-9);
	const speed = $derived(trueSpeed ? C : 10 ** logSpeed);

	const nearest = $derived(Math.min(...rotors.map((r) => seenFrom(r, observer).distance)));
	const lambda = $derived(Math.max(...rotors.map((r) => wavelength(r, speed))));
	// the radiation is only formed beyond about a wavelength over 2 pi
	const inNearZone = $derived(lambda / (2 * Math.PI) > nearest / 2);
	const spot = $derived(spotWidth(lambda, aperture));
	const waves = $derived(
		inNearZone
			? { buffer: new ArrayBuffer(48), count: 0 }
			: packWaves(rotors, observer, { c: speed, aperture })
	);
	const split = $derived(showLight && showGravity ? divider : showLight ? 1 : 0);
	const trueLambda = $derived(Math.max(...rotors.map((r) => wavelength(r))));
	const slowLambda = $derived(Math.max(...rotors.map((r) => wavelength(r, slowSpeed))));

	const powerTrue = $derived(rotors.length ? power(rotors[0]) : 0);
	const yearsPerGraviton = $derived(
		rotors.length ? 1 / gravitonRate(rotors[0]) / (365.25 * 86400) : 0
	);

	function speedText(c: number): string {
		if (c >= C * 0.999) return 'the true speed of light';
		if (c < 1) return `${Math.round(c * 100)} cm/s`;
		if (c < 1000) return `${c.toFixed(c < 10 ? 1 : 0)} m/s`;
		return `${sci(c)} m/s`;
	}
</script>

{#snippet fieldKey()}
	<FieldLegend
		where="on a sphere {length(sliceDepth)} about the camera"
		reference={fieldScale}
		full
	/>
{/snippet}

{#snippet status()}
	{#if field}
		<FieldLegend where="on a sphere {length(sliceDepth)} about the camera" reference={fieldScale} />
	{:else}
		<p class="notice">
			At {speedText(speed)} these waves are {length(lambda).replace(' ', ' ')} long, and the drums lie
			deep inside their near zone. There is no wave image to form: here the camera sees only the moving
			masses. Slow the light down to see the waves.
		</p>
	{/if}
{/snippet}

<DemoShell
	title={scene.title}
	legend={field ? fieldKey : undefined}
	foot={field || inNearZone ? status : undefined}
	onreset={() => (view = { ...START })}
	onsave={() => splitView?.snapshot() ?? Promise.resolve(null)}
>
	{#snippet stage()}
		<span class="clock" {@attach clock}></span>
		<SplitView
			bind:this={splitView}
			poster={posters[scene.name]}
			cutaway={inside}
			{objects}
			{observer}
			sunDirection={[0, 1, 0]}
			bind:view
			bind:divider
			{showLight}
			{showGravity}
			leftMode={MODE_LIGHT}
			rightMode={field ? MODE_FIELD : MODE_WAVES}
			{waves}
			waveExposure={2.2 * 10 ** brightness}
			exposure={2.2 * 10 ** brightness}
			nearBlur={nearFieldBlur(20) / 2.355}
			fieldDepth={sliceDepth}
			fieldReference={fieldScale}
			{subtractRoom}
			room
			{outline}
			rightLabel={field
				? 'Gravity · tidal field'
				: trueSpeed
					? 'Gravity · waves'
					: `Gravity · waves · light slowed to ${speedText(speed)}`}
			dimRight={!field && (rawPixels || inNearZone)}
		>
			{#snippet overlay()}
				{#if !field && !inNearZone && rawPixels}
					<WaveGlyphs {rotors} {observer} {view} {split} />
				{/if}
			{/snippet}
		</SplitView>
	{/snippet}

	{#snippet controls()}
		<Group title="View">
			<Segmented
				label="What the gravity side shows"
				options={[
					{ value: 'image', label: 'Image', icon: Image01Icon },
					{ value: 'field', label: 'Tidal field', icon: Layers01Icon }
				]}
				bind:value={display}
			/>
		</Group>
		{#if field}
			<FieldLookControls reference={fieldScale}>
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
					marks={sliceMarks}
				/>
			</FieldLookControls>
		{/if}
		<Group title="Slowed light">
			<Slider
				id="speed"
				label="Speed of light"
				icon={trueSpeed ? RabbitIcon : SnailIcon}
				min={-1}
				max={LOG_C}
				step={0.01}
				bind:value={logSpeed}
				readout="{trueSpeed ? 'true' : speedText(speed)} · waves {length(lambda)}"
				ends={['crawling', 'true speed']}
			/>
			<div class="actions">
				<button type="button" class="action" onclick={() => (logSpeed = Math.log10(slowSpeed))}>
					<HugeiconsIcon icon={SnailIcon} size={16} strokeWidth={1.7} /> Slow light
				</button>
				<button type="button" class="action" onclick={() => (logSpeed = LOG_C)}>
					<HugeiconsIcon icon={RabbitIcon} size={16} strokeWidth={1.7} /> True speed
				</button>
			</div>
		</Group>
		<Group title="Camera">
			<Slider
				id="aperture"
				label="Array width"
				icon={RulerIcon}
				min={-0.5}
				max={1.5}
				step={0.01}
				bind:value={logAperture}
				readout="{length(aperture)} · detail {inNearZone ? '—' : `${(spot / DEG).toFixed(1)}°`}"
				ends={['30 cm', '30 m']}
			/>
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
				<Toggle icon={WavesIcon} label="Gravity" bind:checked={showGravity} />
				<Toggle
					icon={ViewIcon}
					label="Inside"
					hint="Cut the drums away in the light view, to watch the balls turn"
					bind:checked={inside}
				/>
				<Toggle
					icon={DashedLineCircleIcon}
					label="Outline"
					hint="A faint copy of the shapes in the light picture"
					bind:checked={outline}
				/>
				<Toggle
					icon={Rotate01Icon}
					label="Raw pixels"
					hint="Over the wave image: the pattern of stretching that passes over the camera from each drum"
					bind:checked={rawPixels}
				/>
				<Toggle
					icon={Home03Icon}
					label="Room"
					hint="In the tidal field: the pull of the empty room, its floor and walls. Turn it off to subtract them: gravity adds up, so this is exact."
					bind:checked={() => !subtractRoom, (on) => (subtractRoom = !on)}
				/>
			</div>
		</Group>
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		<ul class="legend" aria-label="Colours of the wave view">
			<li><span class="chip anticlockwise"></span> turning anticlockwise, as the camera sees it</li>
			<li><span class="chip clockwise"></span> turning clockwise</li>
			<li><span class="chip edge"></span> seen edge-on</li>
		</ul>
		<dl>
			<div>
				<dt>Wavelength · smallest detail with a {length(aperture)} array</dt>
				<dd>
					<Tex
						math={`\\lambda = ${texLength(lambda)} \\quad \\Delta\\theta = ${inNearZone ? '\\text{none}' : `${(spot / DEG).toFixed(1)}^\\circ`}`}
					/>
				</dd>
			</div>
			<div>
				<dt>Power radiated by one turning pair, at the true speed of light</dt>
				<dd>
					<Tex
						math={`P = ${texSci(powerTrue)}\\,\\mathrm{W}:\\ \\text{one graviton every } ${texSci(yearsPerGraviton)}\\ \\text{years}`}
					/>
				</dd>
			</div>
		</dl>
		<p class="fine">
			The slowed speed is a teaching device, and is labelled wherever it is on. Slowing light to {speedText(
				slowSpeed
			)} shrinks these waves from {length(trueLambda).replace(' ', '\u00a0')} to {length(
				slowLambda
			)}, which the camera can resolve. It rescales the wavelength and nothing else, and brightness
			is shown on a relative scale. The polarization, which tells the sense of turning, does not
			depend on it. “Raw pixels” shows the pattern of stretching that passes over the camera from
			each drum.
		</p>
		<p class="fine">
			What is real here: the drums, the balls and their turning, which pairs turn and which way, and
			so the colour of each spot; and, at the true speed of light, the power each pair sends out and
			its gravitons, given above, so few that the picture is the expected image of an exposure no
			camera could make. What is slowed: the speed of light alone, and with it the length of the
			waves, the size of the spots and how bright they are.
		</p>
		<p class="fine">
			“Tidal field” shows the field itself on the gravity side, at the true speed of light: the
			tidal tensor of the room, the shelf, the drums and the balls at the points of a sphere about
			the camera, as far away as the slider sets. The colour is the direction of the stretch and the
			fine strokes lie along it. Where the sphere passes through the two turning pairs the strokes
			turn with them, once a second, as in truth. The waves are some 10²⁷ times weaker than that
			turning part, and no picture of the field could show them. What one pixel reads at the camera,
			with the turning part and the wave in s⁻², is under “Physics”.
		</p>
	{/snippet}
	{#snippet physics()}
		<h4>What a turning pair sends out</h4>
		<p>
			A pair of masses turning at angular speed <Tex math={'\\Omega'} /> has a changing mass quadrupole,
			and radiates at <Tex math={'2\\Omega'} />. Seen at distance <Tex math="r" />, with its axis at
			angle <Tex math={'\\iota'} /> to the line of sight, the two polarizations are
		</p>
		<Tex display math={'h_+ = A\\,\\frac{1+\\cos^2\\iota}{2}, \\qquad h_\\times = A\\cos\\iota,'} />
		<Tex display math={'A = \\frac{4G\\,\\Delta I\\,\\Omega^2}{c^4 r},'} />
		<p>
			a quarter cycle apart, with <Tex math={'\\Delta I = md^2/2'} /> for two masses <Tex
				math="m"
			/>
			a distance <Tex math="d" /> apart. The pattern of stretching therefore turns, and the share of the
			signal that is circularly polarized,
		</p>
		<Tex display math={'\\frac{V}{I} = \\frac{2h_+h_\\times}{h_+^2 + h_\\times^2},'} />
		<p>
			is positive when it turns anticlockwise as the camera sees it. That sign is the colour of each
			spot. It does not depend on the speed of light.
		</p>
		<h4>Why each rotor is a spot</h4>
		<p>
			The waves are <Tex math={'\\lambda = \\pi c/\\Omega'} /> long, and no camera resolves detail finer
			than about the wavelength over its width <Tex math="D" />:
		</p>
		<Tex display math={'\\Delta\\theta \\approx 1.03\\,\\frac{\\lambda}{D} .'} />
		<p>
			This is diffraction, not noise: a more sensitive camera sees the spot better, but no smaller.
			Only a wider array, or shorter waves, makes it sharper. Here <Tex
				math={`\\lambda = ${texLength(lambda)}`}
			/> and <Tex math={`D = ${texLength(aperture)}`} />{#if !inNearZone}, so <Tex
					math={`\\Delta\\theta = ${(spot / DEG).toFixed(1)}^\\circ`}
				/>{/if}.
		</p>
		<h4>Why the light is slowed</h4>
		<p>The power radiated is</p>
		<Tex display math={'P = \\frac{32}{5}\\,\\frac{G\\,\\Delta I^2\\,\\Omega^6}{c^5} .'} />
		<p>
			At the true speed of light that is <Tex math={`${texSci(powerTrue)}\\,\\mathrm{W}`} /> per pair,
			one graviton every <Tex math={`${texSci(yearsPerGraviton)}`} /> years, and the waves are
			<Tex math={texLength(trueLambda)} /> long: the room is deep inside their near zone. Slowing light
			to <Tex math={`${slowSpeed}\\,\\mathrm{m/s}`} /> makes them <Tex
				math={texLength(slowLambda)}
			/> long, so that the camera can show them. It is a teaching device, labelled wherever it is on,
			and not a consistent world: the moving masses can outrun the slowed light, and then the formula
			above no longer holds. Brightness is therefore shown on a relative scale. The polarization, which
			gives the sense of turning, does not depend on the speed of light at all.
		</p>
		<h4>The tidal field at the camera</h4>
		<TidalReading reading={tide} basis={cameraBasis(view)} />
	{/snippet}
</DemoShell>

<style>
	.clock {
		display: none;
	}

	.notice {
		margin: 0;
		color: var(--text);
	}

	.legend {
		list-style: none;
		padding: 0;
		margin: 0.8rem 0;
		display: grid;
		gap: 0.35rem;
		font-size: 0.86rem;
	}

	.legend li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.chip {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 50%;
		flex: none;
		/* a rim, so that the pale chip shows on a pale panel */
		box-shadow: 0 0 0 1px var(--line-strong);
	}

	/* the same colours as WAVE_* in engine/wgsl/waves.wgsl */
	.anticlockwise {
		background: rgb(250 87 219);
	}

	.clockwise {
		background: rgb(102 242 117);
	}

	.edge {
		background: rgb(237 237 224);
	}
</style>
