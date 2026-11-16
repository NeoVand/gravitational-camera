<script lang="ts">
	import { asset } from '$app/paths';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowDown02Icon,
		PauseIcon,
		PlayIcon,
		Clock01Icon,
		ContrastIcon,
		Moon02Icon,
		Sun03Icon,
		TemperatureIcon
	} from '@hugeicons/core-free-icons';
	import {
		cameraBasis,
		gravitonsInView,
		chordThrough,
		columnsAlong,
		referenceRadiance,
		type Vec3,
		type View
	} from '#lib/engine/index.js';
	import {
		aim,
		formatClock,
		moonCenter,
		objectsAt,
		scene,
		sunDirection
	} from '#lib/demos/sun-at-midnight.js';
	import { km, superscript, texSci, texWait } from '#lib/ui/format.js';
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

	// what lies along the centre of the view
	const centre = $derived.by(() => {
		const { forward } = cameraBasis(view);
		const earth = objects.find((o) => o.id === 'earth')!;
		const path = chordThrough(earth, observer, forward);
		return { path, ...columnsAlong(objects, observer, forward) };
	});

	const inView = $derived(
		gravitonsInView(
			objects,
			observer,
			cameraBasis(view),
			Math.tan(view.fov / 2) * 1.6,
			Math.tan(view.fov / 2)
		)
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
	const moonRatio = $derived(
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
		decades = Math.min(3, -Math.log10(moonRatio) - 0.5);
	}
</script>

<svelte:head>
	<title>The Sun at midnight · Gravitational Camera</title>
	<meta
		name="description"
		content="Look down through the Earth at night: ordinary light on one side, thermal gravitational radiation on the other."
	/>
</svelte:head>

<DemoShell
	title="The Sun at midnight"
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
			{exposure}
		/>
	{/snippet}

	{#snippet controls()}
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
			single gravitons. Colour stands for source temperature. Earth’s internal friction is an
			assumed placeholder.
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
			so a line of sight through the hot core is the brightest, and the Sun's core, at fifteen
			million kelvin, shines through the planet as a star.
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
			graviton every <Tex math={texWait(1 / inView)} />: the whole planet is a large, faint source.
			The picture is the expected image of a long exposure. The Earth's internal friction is an
			assumed placeholder, and sets this rate in proportion.
		</p>
	{/snippet}
</DemoShell>

<style>
	.clock {
		display: none;
	}
</style>
