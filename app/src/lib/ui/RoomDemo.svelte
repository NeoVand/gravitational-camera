<script lang="ts">
	/**
	 * A near-field demo in a room: ordinary light on one side, the mass seen by
	 * the gravitational camera on the other, with the blur that the chosen
	 * sensitivity leaves; or a thermal one, the glow of warm matter.
	 *
	 * Beside the expected picture, a third view simulates what the instrument records. Near field, "One exposure":
	 * the same reconstruction with the reconstructed noise of one draw of the readings added (lib/measure/noise.ts),
	 * at the signal-to-noise ratio of the demo's subject. Thermal, "Counts": the gravitons an exposure of a given
	 * area and time counts in each picture element, expected or drawn (lib/measure/counts.ts).
	 */
	import type { Snippet } from 'svelte';
	import type { IconSvgElement } from '@hugeicons/svelte';
	import { posters } from '../demos/posters';
	import {
		Camera01Icon,
		ContrastIcon,
		DashedLineCircleIcon,
		DiceIcon,
		Home03Icon,
		Image01Icon,
		Layers01Icon,
		Orbit01Icon,
		Rotate01Icon,
		Radar01Icon,
		Sun03Icon,
		Target02Icon,
		TemperatureIcon
	} from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		MODE_COUNTS,
		MODE_FIELD,
		MODE_LIGHT,
		MODE_NEAR,
		MODE_THERMAL,
		analyzeScene,
		cameraBasis,
		columnsAlong,
		gravitonsInView,
		nearFieldBlur,
		referenceRadiance,
		type Scene,
		type View
	} from '../engine';
	import { countPicture, countRates } from '../measure/counts';
	import { CountExposure } from '../measure/exposure.svelte';
	import { noiseField, noiseGrid, noiseVariance, pointPeak } from '../measure/noise';
	import CountsControls from './CountsControls.svelte';
	import CountsReadout from './CountsReadout.svelte';
	import DemoShell from './DemoShell.svelte';
	import SplitView from './SplitView.svelte';
	import Group from './controls/Group.svelte';
	import Segmented from './controls/Segmented.svelte';
	import Slider from './controls/Slider.svelte';
	import Toggle from './controls/Toggle.svelte';
	import { length, superscript, texLength, texSci, texWait, times } from './format';
	import Tex from './Tex.svelte';
	import FlowField from './FlowField.svelte';
	import PixelProbe from './PixelProbe.svelte';
	import TidalReading from './TidalReading.svelte';
	import FieldLegend from './FieldLegend.svelte';
	import FieldLookControls from './FieldLookControls.svelte';
	import { massPoints, sliceReference } from '../engine/tidal';
	import { roomSlices } from '../pixel/slices';
	import { ROOM_SOURCES, roomReading } from '../pixel/tide-demos';
	import { C } from '../engine/physics/constants';
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
		/** Starting sensitivity (signal-to-noise as a power of ten) and exposure (decades). */
		startSensitivity?: number;
		startBrightness?: number;
		intro: Snippet;
		/** Lines about this scene for the end of the physics tab. */
		physicsExtra?: Snippet;
		/** Controls of this scene's own, above the common ones. */
		extraControls?: Snippet;
		/** Drawn over the picture, such as a label that light has been slowed down. */
		extraOverlay?: Snippet;
		/** Start with the "Pixel" layer on. */
		startProbe?: boolean;
		/**
		 * Near field: what the signal-to-noise ratio is quoted for, as in the paper, the peak field of a point of its
		 * mass at its distance against the noise averaged over a patch that wide (an object of the scene, and how to
		 * call it). The noise of "One exposure" is set by it.
		 */
		subject?: { id: string; name: string };
		/**
		 * A third view, in place of the picture: the camera's measurement and what is computed from it, for a demo
		 * that has the computation (the locked safe). Its stage is laid over the picture and its controls take the
		 * place of the picture's.
		 */
		work?: {
			label: string;
			icon: IconSvgElement;
			stage: Snippet;
			controls: Snippet;
			notes?: Snippet;
		};
	}

	let {
		scene,
		subjectDistance,
		startDivider = 0.5,
		gravity = 'near',
		// turned a little to the left, so the objects sit clear of the notes
		look = { yaw: 13, pitch: -13 },
		subtract = false,
		startSensitivity = 20,
		startBrightness = 0,
		intro,
		physicsExtra,
		extraControls,
		extraOverlay,
		startProbe = false,
		subject,
		work
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
	// svelte-ignore state_referenced_locally
	let sensitivity = $state(startSensitivity);
	// svelte-ignore state_referenced_locally
	let brightness = $state(startBrightness);
	/** The expected picture, the tidal field, a simulated exposure ("One exposure" or "Counts"), or the work. */
	let display = $state<'image' | 'pixels' | 'measure' | 'work'>('image');
	// svelte-ignore state_referenced_locally
	let sliceDepth = $state(subjectDistance);
	// svelte-ignore state_referenced_locally
	let subtractRoom = $state(subtract);
	let splitView: SplitView | undefined = $state();

	const objects = $derived(analyzeScene(scene));
	const observer = $derived(scene.observer.position);
	const exclusion = $derived(scene.observer.exclusion ?? 0.25);
	const hasRoom = $derived(objects.some((o) => o.background));
	// what moves: spinning spheres and bodies moving as a whole
	const spinning = $derived(
		objects.filter(
			(o) => (o.spin && o.spin.rate !== 0) || (o.velocity && Math.hypot(...o.velocity) > 0)
		)
	);
	let flow = $state(true);
	/** The "One pixel" layer: what a single pixel at the camera reads. */
	// svelte-ignore state_referenced_locally
	let probe = $state(startProbe);
	// the flow signal is about v/c of the mass signal, so its blur is that of a
	// camera less sensitive by that factor
	const rimSpeed = $derived(
		Math.max(
			0,
			...spinning.map((o) =>
				o.spin && o.spin.rate !== 0
					? 2 *
						Math.PI *
						Math.abs(o.spin.rate) *
						(o.radius + Math.hypot(...o.center.map((v, k) => v - o.spin!.center[k])))
					: Math.hypot(...o.velocity!)
			)
		)
	);
	const flowDecades = $derived(Math.max(1, sensitivity + Math.log10(rimSpeed / C)));
	const flowBlur = $derived(nearFieldBlur(flowDecades));
	const split = $derived(showLight && showGravity ? divider : showLight ? 1 : 0);
	// gravitons per second that the whole view sends a square-metre detector
	const inView = $derived(
		gravity === 'thermal'
			? gravitonsInView(
					objects,
					observer,
					cameraBasis(view),
					Math.tan(view.fov / 2) * 1.6,
					Math.tan(view.fov / 2),
					subtractRoom
				)
			: 0
	);

	// the near-field resolution law (paper, eq. resolution): full width at half
	// maximum of the best reconstruction of a point, for a planar array
	const blurAngle = $derived(nearFieldBlur(sensitivity));
	const blurSigma = $derived(blurAngle / 2.355);
	const centre = $derived(
		columnsAlong(objects, observer, cameraBasis(view).forward, exclusion, subtractRoom)
	);
	/**
	 * The same with the room counted. With the room taken away, a line of sight that meets nothing else has nothing
	 * along it, exactly: the readouts say so, and what the room alone gives there.
	 */
	const centreWithRoom = $derived(
		subtractRoom ? columnsAlong(objects, observer, cameraBasis(view).forward, exclusion) : centre
	);
	// the tidal tensor at the camera itself, by source: what one pixel there reads
	const tide = $derived(roomReading(scene.name, objects, observer, subtractRoom));
	// the field view's scale, as the picture itself sets it (SplitView): the median strength over the slice
	const fieldScale = $derived(
		display === 'pixels'
			? sliceReference(
					massPoints(objects, 0.25, subtractRoom),
					observer,
					view,
					splitView?.aspect() ?? 1.6,
					sliceDepth
				)
			: 1
	);
	// --- one exposure ------------------------------------------------------------------------------------------------
	const measuring = $derived(display === 'measure');
	// the picture's tangent plane, as the engine draws it: its own shape once laid out
	const tanY = $derived(Math.tan(view.fov / 2));
	const tanX = $derived(tanY * (splitView?.aspect() ?? 1.6));

	// near field: the subject the signal-to-noise ratio is quoted for, its mass and distance
	const subjectObject = $derived(subject && objects.find((o) => o.id === subject.id));
	const subjectMass = $derived(subjectObject ? subjectObject.density * subjectObject.ownVolume : 0);
	const subjectDepth = $derived(
		subjectObject
			? Math.hypot(...subjectObject.center.map((v, k) => v - observer[k]))
			: subjectDistance
	);
	/** The reconstructed noise is in units of m / z^3, kg m⁻³ of tidal column. */
	const noiseUnit = $derived(subjectMass / subjectDepth ** 3);
	/** Which draw of the readings' noise: each "New exposure" is another. */
	let noiseSeed = $state(1);
	// a draw depends on the picture, the sensitivity and the seed alone, not on the scene: one that moves keeps it
	const noise = $derived.by(() => {
		if (!measuring || gravity !== 'near' || !subject) return undefined;
		const g = noiseGrid(tanX, tanY, sensitivity);
		const field = noiseField(g.n, g.n, g.cell, sensitivity, noiseSeed);
		// the picture's part of the draw, from its top left corner, and a cell more for the last interpolation
		const width = Math.min(g.n, Math.floor(g.across) + 2);
		const height = Math.min(g.n, Math.floor(g.up) + 2);
		const data = new Float32Array(4 * width * height);
		for (let j = 0; j < height; j++)
			for (let i = 0; i < width; i++) data[4 * (j * width + i)] = field[j * g.n + i];
		return { image: { width, height, data }, across: g.across, up: g.up };
	});
	const noiseSigma = $derived(noiseUnit * Math.sqrt(noiseVariance(sensitivity)));
	const subjectPeak = $derived(noiseUnit * pointPeak(sensitivity));

	// thermal: the exposure and its counts
	const counting = new CountExposure();
	const countGrid = $derived(
		measuring && gravity === 'thermal'
			? countRates(
					objects,
					observer,
					cameraBasis(view),
					tanX,
					tanY,
					counting.across,
					3,
					subtractRoom
				)
			: undefined
	);
	const counts = $derived(
		countGrid &&
			countPicture(
				countGrid,
				counting.area * counting.time,
				referenceRadiance(objects, observer, subtractRoom),
				counting.show,
				counting.seed
			)
	);

	// where the sphere of points meets something: each thing in the room, each wall and the floor
	const sliceMarks = $derived(
		roomSlices(objects, observer, 0.45, ROOM_SOURCES[scene.name]?.groups).map((m) => ({
			at: m.at,
			label: `${m.label}, ${length(m.at)}`
		}))
	);
</script>

{#snippet fieldKey()}
	<FieldLegend
		where="on a sphere {length(sliceDepth)} about the camera"
		reference={fieldScale}
		full
	/>
{/snippet}

{#snippet status()}
	{#if display === 'pixels'}
		<FieldLegend where="on a sphere {length(sliceDepth)} about the camera" reference={fieldScale} />
	{/if}
	{#if probe}<PixelProbe {objects} {observer} {view} brief />{/if}
{/snippet}

<DemoShell
	title={scene.title}
	legend={display === 'pixels' ? fieldKey : undefined}
	foot={display === 'pixels' || probe ? status : undefined}
	onreset={display === 'work' ? undefined : () => (view = { ...START })}
	onsave={display === 'work' ? undefined : () => splitView?.snapshot() ?? Promise.resolve(null)}
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
			rightMode={display === 'pixels'
				? MODE_FIELD
				: gravity === 'thermal'
					? measuring
						? MODE_COUNTS
						: MODE_THERMAL
					: MODE_NEAR}
			image={counts?.image ?? noise?.image}
			noise={noise && { scale: noiseUnit, across: noise.across, up: noise.up }}
			fieldDepth={sliceDepth}
			exposure={(gravity === 'near' || display === 'pixels' ? 2.2 : 1.6) * 10 ** brightness}
			nearBlur={blurSigma}
			{exclusion}
			room
			{outline}
			{subtractRoom}
			rightLabel={display === 'pixels'
				? 'Gravity · tidal field'
				: measuring
					? gravity === 'thermal'
						? counting.show === 'draw'
							? 'Gravity · counted'
							: 'Gravity · counts expected'
						: 'Gravity · one exposure'
					: gravity === 'thermal'
						? 'Gravity · thermal'
						: spinning.length && flow
							? 'Gravity · near field and flow'
							: 'Gravity · near field'}
		>
			{#snippet overlay()}
				{#if gravity === 'near' && display === 'image' && flow && spinning.length}
					<FlowField {objects} {observer} {view} {exclusion} blur={flowBlur / 2.355} {split} />
				{/if}
				{@render extraOverlay?.()}
			{/snippet}
		</SplitView>
		{#if display === 'work' && work}{@render work.stage()}{/if}
	{/snippet}

	{#snippet pixel()}
		<PixelProbe {objects} {observer} {view} />
	{/snippet}

	{#snippet controls()}
		<Group title="View">
			<Segmented
				label="What the gravity side shows"
				options={[
					{ value: 'image', label: 'Image', icon: Image01Icon },
					{ value: 'pixels', label: 'Tidal field', icon: Layers01Icon },
					...(work
						? [{ value: 'work' as const, label: work.label, icon: work.icon, wide: true }]
						: gravity === 'thermal'
							? [{ value: 'measure' as const, label: 'Counts', icon: Camera01Icon, wide: true }]
							: subject
								? [
										{
											value: 'measure' as const,
											label: 'One exposure',
											icon: Camera01Icon,
											wide: true
										}
									]
								: [])
				]}
				bind:value={display}
			/>
		</Group>
		{#if display === 'pixels'}
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
		{#if display !== 'work'}{@render extraControls?.()}{/if}
		{#if measuring && counts}
			<CountsControls exposure={counting} needed={counts.needed} />
		{/if}
		{#if display === 'work' && work}
			{@render work.controls()}
		{:else}
			{@render pictureControls()}
		{/if}
	{/snippet}

	{#snippet notes()}
		{@render intro()}
		{#if display === 'work' && work?.notes}
			{@render work.notes()}
		{:else if measuring && gravity === 'near' && subject}
			<dl>
				<div>
					<dt>Signal to noise, for {subject.name}</dt>
					<dd>
						<Tex math={`10^{${sensitivity}}`} />: {times(subjectMass)} kg, {length(subjectDepth)} away
					</dd>
				</div>
				<div>
					<dt>Noise in the picture, one standard deviation</dt>
					<dd><Tex math={`${texSci(noiseSigma, 2)}\\ \\mathrm{kg\\,m^{-3}}`} /></dd>
				</div>
				<div>
					<dt>A point of that mass there peaks at</dt>
					<dd>
						<Tex math={`${texSci(subjectPeak, 2)}\\ \\mathrm{kg\\,m^{-3}}`} />, {times(
							subjectPeak / noiseSigma
						)} standard deviations
					</dd>
				</div>
			</dl>
			<p class="fine">
				“One exposure” is what the camera computes from one set of readings: the picture of “Image”,
				with the reconstruction of the readings’ noise added. The best reconstruction passes that
				noise only near its cutoff, so it comes out as ripples the size of the blur, the same
				everywhere: mass shows where it stands above them. More sensitivity makes the ripples finer,
				not fainter; what grows is how far a compact mass stands above them. Below zero is drawn
				black, as in “Image”. “New exposure” draws the noise again; turning the camera keeps it,
				since it belongs to the array. The flow is not drawn over a measurement.
			</p>
		{:else if measuring && gravity === 'thermal' && counts && countGrid}
			<CountsReadout picture={counts} exposure={counting} elements={countGrid.nx * countGrid.ny} />
			<p class="fine">
				“Counts” is what a camera that counts gravitons records: each element of the picture
				receives a random, Poisson, number of them, whose mean is the brightness of “Image” times
				the element’s solid angle, the collecting area and the time. Each is drawn in the colour of
				the temperature that sent it. “Expected” shows those means, on the same scale; one graviton
				is never drawn dim.
			</p>
		{:else if gravity === 'near'}
			<dl>
				<div>
					<dt>Smallest detail at {length(subjectDistance)}</dt>
					<dd><Tex math={texLength(blurAngle * subjectDistance)} /></dd>
				</div>
				<div>
					<dt>Mass along the centre of view, weighted by 1/distance</dt>
					<dd>
						<Tex
							math={`${texSci(centre.tidalColumn, 2)}\\ \\mathrm{kg\\,m^{-3}}`}
						/>{@render onlyRoom(
							centre.tidalColumn,
							centreWithRoom.tidalColumn,
							'\\mathrm{kg\\,m^{-3}}'
						)}
					</dd>
				</div>
			</dl>
			<p class="fine">
				The gravity side is an idealization: the mass of the known scene along each line of sight,
				weighted by the inverse of its distance, blurred by the paper’s resolution law. It is what
				an array as wide as the scene is deep would compute, with no noise and without the
				arrangements of mass the camera cannot tell apart. “Outline” adds a faint copy of the shapes
				in the ordinary picture so they can be matched to masses. “Tidal field” shows the field in
				the room, of which the camera reads the value at its own place: the tensor at every point of
				a slice through the room, all at the distance from the camera the slider sets. The colour is
				the direction of the stretch there and the fine strokes lie along it; the ticks on the
				slider mark where the slice meets something, and the controls under “Tidal field” set how it
				is drawn. What one pixel reads at the camera itself, in s⁻² and source by source, is under
				“Physics”.
			</p>
			{#if work}
				<p class="fine">
					“{work.label}” is not an idealization. It shows the readings of an array of pixels with
					noise, and what can be computed from them and from nothing else.
				</p>
			{/if}
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
						/>{@render onlyRoom(
							centre.numberRadiance,
							centreWithRoom.numberRadiance,
							'\\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}'
						)}
					</dd>
				</div>
			</dl>
			<p class="fine">
				The gravity side is the expected thermal image: the glow of everything along each line of
				sight, with colour standing for temperature. It is what the camera would build up over a
				long exposure: everything in this view sends a detector of one square metre one graviton
				every
				<Tex math={texWait(1 / inView)} />. Where the paper has an estimate of a material’s
				friction, the material carries it. The others keep the placeholder
				<Tex math={'10^{-3}\\ \\mathrm{Pa\\,s}'} />, unless the text above gives another.
			</p>
			<p class="fine">
				“Tidal field” shows what every mass in the room has, hot or cold: the tensor at every point
				of a slice through the room, as a wash of colour for the direction of the stretch with fine
				strokes along it. Its value at the camera itself, in s⁻² and source by source, is under
				“Physics”.
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
				The gravity side shows <Tex math={'S'} /> of the known scene, blurred by the law below: what an
				array as wide as the scene is deep would compute, with no noise and without the arrangements of
				mass it cannot tell apart. Nothing absorbs or scatters gravity, and mass has one sign, so nothing
				in the room can hide anything else.
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
			<h4>One exposure</h4>
			<p>
				The array reads the field with white noise. The reconstruction <Tex math={'W = H/T'} /> passes
				it with the spectrum
			</p>
			<Tex
				display
				math={'P(q) = \\left(\\frac{m}{z^3}\\right)^{2} H(q)\\,\\bigl(1 - H(q)\\bigr),'}
			/>
			<p>
				in the units of <Tex math={'S'} />, for a signal-to-noise ratio quoted for a point mass <Tex
					math="m"
				/> at depth <Tex math="z" />: a band of ripples at the cutoff, of variance
				<Tex math={'(m/z^3)^2 \\frac{1}{2\\pi}\\int H(1-H)\\,q\\,dq'} />.
			</p>
			<dl class="numbers">
				<div>
					<dt>Tidal column along the centre of view</dt>
					<dd>
						<Tex
							math={`S = ${texSci(centre.tidalColumn, 2)}\\ \\mathrm{kg\\,m^{-3}}`}
						/>{@render onlyRoom(
							centre.tidalColumn,
							centreWithRoom.tidalColumn,
							'\\mathrm{kg\\,m^{-3}}'
						)}
					</dd>
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
			<h4>How faint</h4>
			<p>
				Adding up every line of sight in view, a detector of one square metre would receive
				<Tex math={`${texSci(inView)}\\ \\text{gravitons per second}`} />, one every <Tex
					math={texWait(1 / inView)}
				/>. The picture is the expected image of a very long exposure, not a snapshot.
			</p>
			<h4>Counting</h4>
			<p>
				Over an exposure of area <Tex math="A" /> and time <Tex math={'\\tau'} />, an element of the
				picture of solid angle <Tex math={'\\Omega'} /> counts a Poisson number of gravitons, of mean
			</p>
			<Tex display math={'\\lambda = A\\,\\tau \\int_\\Omega N(\\hat n)\\, d\\Omega ,'} />
			<p>
				and scatters about it by <Tex math={'\\sqrt{\\lambda}'} />: a difference of a tenth stands
				five standard deviations clear only at about 2,500 gravitons an element.
			</p>
			<dl class="numbers">
				<div>
					<dt>Brightness along the centre of view</dt>
					<dd>
						<Tex
							math={`N = ${texSci(centre.numberRadiance)}\\ \\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`}
						/>{@render onlyRoom(
							centre.numberRadiance,
							centreWithRoom.numberRadiance,
							'\\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}'
						)}
					</dd>
				</div>
			</dl>
		{/if}
		{@render physicsExtra?.()}
		<h4>The tidal field at the camera</h4>
		<TidalReading reading={tide} basis={cameraBasis(view)} />
	{/snippet}
</DemoShell>

<!-- a readout of exactly zero along a line of sight that meets only the room, which is taken away -->
{#snippet onlyRoom(value: number, withRoom: number, unit: string)}
	{#if value === 0 && withRoom !== 0}
		<span class="why">
			Only the room lies along this line, and it is taken away; it gives
			<Tex math={`${texSci(withRoom, 2)}\\ ${unit}`} /> here.</span
		>
	{:else if value === 0}
		<span class="why">Nothing lies along this line.</span>
	{/if}
{/snippet}

<!-- the controls of the picture: its camera and its layers -->
{#snippet pictureControls()}
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
			{#if measuring && subject}
				<div class="actions">
					<button type="button" class="action" onclick={() => (noiseSeed += 1)}>
						<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.8} /> New exposure
					</button>
				</div>
				<p class="hint">
					Signal to noise for {subject.name}: {times(subjectMass)} kg, {length(subjectDepth)} away.
				</p>
			{/if}
		{/if}
		<Slider
			id="brightness"
			label={measuring ? 'Brightness' : 'Exposure'}
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
			{#if spinning.length && gravity === 'near'}
				<Toggle
					icon={Rotate01Icon}
					label="Flow"
					hint="The mass currents that the gravitomagnetic half of each pixel records, shown magnified"
					bind:checked={flow}
				/>
			{/if}
			<Toggle
				icon={Target02Icon}
				label="Pixel"
				hint="Keep in sight, at the foot of the panel, what a single pixel at the camera reads: its type, and whether anything moves. The Pixel tab has its four principal null directions."
				bind:checked={probe}
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

<style>
	.hint {
		margin: 0;
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--text-faint);
	}

	/* why a readout is exactly zero, under it, in the type of the notes */
	.why {
		display: block;
		margin-top: 0.25rem;
		font: 400 0.72rem/1.45 var(--font-sans);
		color: var(--text-faint);
	}
</style>
