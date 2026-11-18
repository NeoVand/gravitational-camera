<script lang="ts">
	import { asset } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowDown02Icon,
		PauseIcon,
		PlayIcon,
		Clock01Icon,
		ContrastIcon,
		Image01Icon,
		Layers01Icon,
		RulerIcon,
		Moon02Icon,
		Sun03Icon,
		TemperatureIcon
	} from '@hugeicons/core-free-icons';
	import {
		MODE_FIELD,
		MODE_THERMAL,
		cameraBasis,
		gravitonsInView,
		chordThrough,
		columnsAlong,
		referenceRadiance,
		type AnalyzedObject,
		type Vec3,
		type View
	} from '#lib/engine/index.js';
	import {
		LATITUDE,
		aim,
		formatClock,
		moonCenter,
		objectsAt,
		scene,
		sunDirection
	} from '#lib/demos/sun-at-midnight.js';
	import { fieldReference } from '#lib/pixel/field-view.js';
	import { logSlices, planetSlices } from '#lib/pixel/slices.js';
	import { sceneTide } from '#lib/pixel/tide.js';
	import { earthReading } from '#lib/pixel/tide-demos.js';
	import FieldLegend from '#lib/ui/FieldLegend.svelte';
	import FieldLookControls from '#lib/ui/FieldLookControls.svelte';
	import TidalReading from '#lib/ui/TidalReading.svelte';
	import Segmented from '#lib/ui/controls/Segmented.svelte';
	import { km, length, superscript, texSci, texWait } from '#lib/ui/format.js';
	import Tex from '#lib/ui/Tex.svelte';
	import DemoShell from '#lib/ui/DemoShell.svelte';
	import SplitView from '#lib/ui/SplitView.svelte';
	import Group from '#lib/ui/controls/Group.svelte';
	import Slider from '#lib/ui/controls/Slider.svelte';
	import Toggle from '#lib/ui/controls/Toggle.svelte';

	const DEG = Math.PI / 180;
	const START: View = { yaw: 16 * DEG, pitch: -31 * DEG, fov: 76 * DEG };
	const DOWN: View = { yaw: 16 * DEG, pitch: -62 * DEG, fov: 84 * DEG };

	let hours = $state(0);
	let view: View = $state(START);
	let divider = $state(0.4);
	let showLight = $state(true);
	let showGravity = $state(true);
	/** Exposure in decades relative to "exposed for Earth's interior". */
	let decades = $state(0);
	let splitView: SplitView | undefined = $state();
	/** The day runs at an hour a second while playing. */
	let playing = $state(false);
	/** What the gravity side shows: the thermal image, or the tidal field about the camera. */
	let display = $state<'image' | 'field'>('image');
	/**
	 * The field is drawn at the points this far from the camera, on a logarithmic slider: from 3 m, where it is the
	 * ground's own tide in every direction, through the planet and past the Moon, to beyond the Sun.
	 */
	let logRadius = $state(6.3);
	const radius = $derived(10 ** logRadius);
	/** The Earth's axis in the scene's axes: up by the latitude, toward the north (-z). */
	const POLE: Vec3 = [0, Math.sin(LATITUDE), -Math.cos(LATITUDE)];

	function clock() {
		let frame = 0;
		let last = performance.now();
		const tick = (now: number) => {
			if (playing) hours = (hours + (now - last) / 1000) % 24;
			last = now;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}

	const observer = scene.observer.position;
	const objects = $derived(objectsAt(hours));
	const sun = $derived(sunDirection(hours));
	const sunAltitude = $derived(Math.asin(sun[1]) / DEG);
	const exposure = $derived(1.2 * 10 ** decades);
	// the tide of the ground, the Moon and the Sun where the camera stands, at this hour
	const tide = $derived(earthReading(objects, observer, POLE));
	// the field view's scale: the median strength over the picture, from the exact tensor in and out of the shells
	// where the sphere of points meets something: the shells underfoot, the centre, the far side, the Moon, the Sun
	// its slider gives each stretch between them the same length of track, on the logarithm of the distance
	const slices = $derived(logSlices(planetSlices(objects, observer), 0.3, 11.3));
	const sliceMarks = $derived(
		slices.marks.map((m) => ({ at: m.position, label: `${m.label}, ${length(m.at)}` }))
	);
	const fieldScale = $derived.by(() => {
		const tanY = Math.tan(view.fov / 2);
		return fieldReference(
			(d) => sceneTide(objects, observer.map((v, k) => v + radius * d[k]) as Vec3),
			{ ...cameraBasis(view), tanX: tanY * aspect, tanY }
		);
	});

	// what lies along the centre of the view
	const centre = $derived.by(() => {
		const { forward } = cameraBasis(view);
		const earth = objects.find((o) => o.id === 'earth')!;
		const path = chordThrough(earth, observer, forward);
		return { path, ...columnsAlong(objects, observer, forward) };
	});

	// the picture's own shape once it is laid out; until then, that of a common screen
	const aspect = $derived(splitView?.aspect() ?? 1.6);
	const inViewOf = (things: AnalyzedObject[]) =>
		gravitonsInView(
			things,
			observer,
			cameraBasis(view),
			Math.tan(view.fov / 2) * aspect,
			Math.tan(view.fov / 2)
		);
	const inView = $derived(inViewOf(objects));
	/** The same with the Sun dark: what the planet and the Moon send by themselves. */
	const inViewWithoutSun = $derived(
		inViewOf(objects.map((o) => (o.id === 'sun' || o.id === 'sun-core' ? { ...o, jN: 0 } : o)))
	);

	const sunRatio = $derived(
		columnsAlong(objects, observer, sun).numberRadiance / referenceRadiance(objects, observer)
	);

	/** Unit vector from here to the Moon's centre: a degree off its direction from the Earth's centre. */
	const toMoon = $derived.by(() => {
		const d = moonCenter(hours).map((v, i) => v - observer[i]);
		const n = Math.hypot(...d);
		return d.map((v) => v / n) as Vec3;
	});
	const moonAltitude = $derived(Math.asin(toMoon[1]) / DEG);
	/**
	 * The Moon's own glow through its centre, against the Earth's straight down: the chord through each of its
	 * layers times that layer's glow over its parent's. Below the horizon the Earth lies on the same line of sight,
	 * and is left out of this.
	 */
	const moonRatio = $derived(
		objects.reduce(
			(sum, o) =>
				o.id === 'moon' || o.id === 'moon-core'
					? sum +
						chordThrough(o, observer, toMoon) * (o.jN - (o.parent >= 0 ? objects[o.parent].jN : 0))
					: sum,
			0
		) / referenceRadiance(objects, observer)
	);
	/** Everything along that line, the Earth included when it is in the way: what the exposure is set for. */
	const moonLineRatio = $derived(
		columnsAlong(objects, observer, toMoon).numberRadiance / referenceRadiance(objects, observer)
	);

	function lookDown() {
		view = { ...DOWN };
		decades = 0;
	}

	/**
	 * The Sun and the Moon each span half a degree. A one-degree view makes them
	 * as large on the screen as they seem to the eye; a wide one shows them, as a
	 * camera would, as small discs.
	 */
	const CLOSE_UP = 1 * DEG;

	function findTheSun() {
		view = { ...aim(sun), fov: CLOSE_UP };
		decades = -Math.log10(sunRatio);
	}

	/** Centre the Moon on the divider: light shows one half of it, gravity the other. */
	function findTheMoon() {
		view = { ...aim(toMoon), fov: CLOSE_UP };
		divider = 0.5;
		// half a decade under the Earth's exposure, so the warmer core shows
		decades = Math.min(3, -Math.log10(moonLineRatio) - 0.5);
	}
</script>

<svelte:head>
	<title>The Sun at midnight · Gravitational Camera</title>
	<meta
		name="description"
		content="Look down through the Earth at night: ordinary light on one side, thermal gravitational radiation on the other."
	/>
</svelte:head>

{#snippet fieldKey()}
	<FieldLegend where="on a sphere {length(radius)} about the camera" reference={fieldScale} full />
{/snippet}

{#snippet status()}
	<FieldLegend where="on a sphere {length(radius)} about the camera" reference={fieldScale} />
{/snippet}

<DemoShell
	title="The Sun at midnight"
	legend={display === 'field' ? fieldKey : undefined}
	foot={display === 'field' ? status : undefined}
	onreset={() => {
		view = { ...START };
		decades = 0;
	}}
	onsave={() => splitView?.snapshot() ?? Promise.resolve(null)}
>
	{#snippet stage()}
		<span class="clock" {@attach clock}></span>
		<SplitView
			bind:this={splitView}
			poster={asset('posters/sun-at-midnight.jpg')}
			{objects}
			{observer}
			sunDirection={sun}
			bind:view
			bind:divider
			{showLight}
			{showGravity}
			rightMode={display === 'field' ? MODE_FIELD : MODE_THERMAL}
			exposure={display === 'field' ? 2.2 : exposure}
			fieldDepth={radius}
			fieldReference={fieldScale}
			rightLabel={display === 'field' ? 'Gravity · tidal field' : 'Gravity · thermal'}
		></SplitView>
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
		{#if display === 'field'}
			<FieldLookControls reference={fieldScale}>
				<Slider
					id="slice"
					label="Slice"
					icon={RulerIcon}
					min={0}
					max={slices.scale.last}
					step={0.005}
					bind:value={
						() => slices.scale.toPosition(logRadius), (p) => (logRadius = slices.scale.toValue(p))
					}
					readout="{length(radius)} away"
					ends={['2 m', 'beyond the Sun']}
					marks={sliceMarks}
				/>
			</FieldLookControls>
		{/if}
		<Group title="Scene">
			<Slider
				id="time"
				label="Local time"
				icon={Clock01Icon}
				min={0}
				max={24}
				step={0.05}
				bind:value={hours}
				readout="{formatClock(hours)} · Sun {Math.abs(sunAltitude).toFixed(0)}° {sunAltitude < 0
					? 'below'
					: 'above'}"
				ends={['midnight', 'midnight']}
			/>
			<div class="actions">
				<button type="button" class="action" onclick={() => (playing = !playing)}>
					<HugeiconsIcon icon={playing ? PauseIcon : PlayIcon} size={16} strokeWidth={1.8} />
					{playing ? 'Pause' : 'Play the day'}
				</button>
				<button type="button" class="action" onclick={lookDown}>
					<HugeiconsIcon icon={ArrowDown02Icon} size={16} strokeWidth={1.8} /> Look down
				</button>
				<button type="button" class="action" onclick={findTheSun}>
					<HugeiconsIcon icon={Sun03Icon} size={16} strokeWidth={1.8} /> Find the Sun
				</button>
				<button type="button" class="action" onclick={findTheMoon}>
					<HugeiconsIcon icon={Moon02Icon} size={16} strokeWidth={1.8} /> Find the Moon
				</button>
			</div>
		</Group>
		<Group title="Camera">
			<Slider
				id="exposure"
				label="Exposure"
				icon={ContrastIcon}
				min={-12}
				max={3}
				step={0.05}
				bind:value={decades}
				readout="× 10{superscript(Math.round(decades))}"
				ends={['for the Sun', 'for the Earth']}
			/>
		</Group>
		<Group title="Layers">
			<div class="toggles">
				<Toggle icon={Sun03Icon} label="Light" bind:checked={showLight} />
				<Toggle icon={TemperatureIcon} label="Gravity" bind:checked={showGravity} />
			</div>
		</Group>
	{/snippet}

	{#snippet notes()}
		<p>
			You are standing on Earth’s night side. On the <strong>light</strong> side the ground is
			opaque. On the <strong>gravity</strong> side nothing is: you see the glow of warm matter all the
			way through the planet, and the Sun’s core beyond it.
		</p>
		<dl>
			<div>
				<dt>Centre of view passes through</dt>
				<dd>{centre.path > 0 ? km(centre.path) + ' of Earth' : 'no rock'}</dd>
			</div>
			<div>
				<dt>Expected brightness there</dt>
				<dd>
					<Tex
						math={`${texSci(centre.numberRadiance)}\\ \\text{gravitons}\\ \\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`}
					/>
				</dd>
			</div>
			<div>
				<dt>Sun’s core against Earth’s interior</dt>
				<dd><Tex math={`${texSci(sunRatio)}\\times\\ \\text{brighter}`} /></dd>
			</div>
			<div>
				<dt>Moon’s centre against Earth’s interior</dt>
				<dd>
					<Tex math={`${texSci(1 / moonRatio)}\\times\\ \\text{fainter}`} />, {Math.abs(
						moonAltitude
					).toFixed(0)}° {moonAltitude < 0 ? 'below' : 'above'} the horizon
				</dd>
			</div>
		</dl>
		<p class="fine">
			This is the expected image, not a photograph: at these rates a real detector would count
			single gravitons. Colour stands for source temperature. The friction of the Earth and the Moon
			at these frequencies is not known. Each shell is given the most its stiffness allows, so their
			brightness here is an upper bound.
		</p>
		<p class="fine">
			“Tidal field” shows the field itself on the gravity side: the tidal tensor of the Earth, the
			Moon and the Sun at the points of a sphere about you, as far away as the slider sets. The
			colour is the direction of the stretch and the fine strokes lie along it; the ticks on the
			slider mark the Earth’s shells, its centre and far side, the Moon and the Sun. Near by it is
			the ground’s own tide in every direction; farther, looking down, the points lie inside the
			planet, where the shells around a point add no stretch, only an even squeeze that the wash
			leaves out. What one pixel reads where you stand is under “Physics”.
		</p>
	{/snippet}
	{#snippet physics()}
		<h4>Why the Earth glows</h4>
		<p>
			Matter that resists being sheared absorbs gravitational waves at the rate
			<Tex math={'\\alpha = 16\\pi G\\eta/c^3'} />, where <Tex math={'\\eta'} /> is its viscosity, and
			so, by Kirchhoff's law, it also emits them. Per cubic metre and steradian,
		</p>
		<Tex
			display
			math={'j_E = \\frac{\\alpha\\,\\sigma T^4}{\\pi}, \\qquad j_N = \\frac{j_E}{2.701\\,k_B T} .'}
		/>
		<h4>Why nothing hides it</h4>
		<p>
			The absorption is so weak that the whole Earth is transparent to its own glow. Each pixel
			simply adds up the emission along its line of sight,
		</p>
		<Tex display math={'N(\\hat n) = \\int j_N\\, dl ,'} />
		<p>
			so a line of sight through the hot core is the brightest, and the Sun's core, thirteen million
			kelvin on average, shines through the planet as a star.
		</p>
		<h4>The Moon</h4>
		<p>
			In light, the nearly full Moon is the brightest thing in the night sky, but none of that light
			is its own: it is sunlight, reflected. In gravity the Moon shines only by its own warmth. Its
			interior is cooler than the Earth's, about <Tex math={'1200\\text{–}1700\\,\\mathrm{K}'} /> against
			up to
			<Tex math={'5500\\,\\mathrm{K}'} />, and a line of sight through it is a quarter as long, so
			its centre is about <Tex math={texSci(1 / moonRatio)} /> times fainter than the ground beneath your
			feet. Find it, and the exposure is raised to show it.
		</p>
		<h4>How large</h4>
		<p>
			The Moon and the Sun both span about half a degree of sky, the width of a fingernail at arm's
			length. A photograph with an ordinary lens shows the Moon as a small disc, smaller than it
			seems to the eye, and near the horizon it seems larger still: an illusion of perception, not
			of optics. Finding either one zooms to a view one degree tall, where it looks as large as it
			seems. In gravity the Sun looks five times smaller than its visible disc: its gravitons come
			from its core, the inner fifth of its radius, where it is hottest.
		</p>
		<h4>How faint</h4>
		<p>
			Along the centre of view the expected count is <Tex
				math={`${texSci(centre.numberRadiance)}\\ \\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`}
			/>. Added up over everything in view, a detector of one square metre would receive one
			graviton every <Tex math={texWait(1 / inView)} />; leaving out the Sun's core, one every
			<Tex math={texWait(1 / inViewWithoutSun)} />: the whole planet is a large, faint source. The
			picture is the expected image of a long exposure. The friction of the Earth and the Moon at
			these frequencies is not known. Each shell is given the most its stiffness allows, and its
			rate is in proportion, so the planet's rate is an upper bound: the wait without the Sun is at
			least that long.
		</p>
		<h4>The tidal field at the camera</h4>
		<TidalReading reading={tide} basis={cameraBasis(view)} />
	{/snippet}
</DemoShell>

<style>
	.clock {
		display: none;
	}
</style>
