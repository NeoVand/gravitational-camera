<script lang="ts">
	/**
	 * Chapter 11.4's friction of a horizon. Panel 1: a body in the tide of a moon that circles it, the tide's stretch
	 * along the line to the moon in orange and its squeeze across it in blue (the figures' own colours), drawn either
	 * as the Earth not spinning (so that the lag is true), a stone whose bulge, in proportion to k₂ = 0.30 and
	 * exaggerated, lags the moon by a friction angle, or as a hole of radius r_s with grey arrows for the energy
	 * flowing in. Not to scale: the moon's drawn distance follows log d, and it turns far slower than any orbit here.
	 * Panel 2: on log axes against x = GMω/c³, Γ₂ from chapter 11.3's Regge–Wheeler table with Page's line
	 * (256/225)x⁶ dashed, and below it Im χ = (5/64)Γ₂/x⁵ in units
	 * of M r_s²(GM/c³)² with the friction law (4/45)x dashed, both neutral; a line marks the moon's tide at
	 * x = 2GMΩ/c³. One slider sets M from 1 to 10⁹ solar masses, one d from 3 to 10⁴ r_s, both on log scales, opening
	 * at 10 M_⊙ and 30 r_s; a switch sets the body. The arithmetic is in ./tidal-friction.ts. The chapter's try box asks
	 * the predictions, so the figure answers none of them in words. The moon turns unless motion is reduced; then it
	 * waits for the play button.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BlackHole01Icon,
		EarthIcon,
		PauseIcon,
		PlayIcon,
		RulerIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DISTANCE,
		DRAWN_PERIOD,
		K2_EARTH,
		LAG,
		MASS,
		MOON_MASS,
		M_SUN,
		PAGE_TOP,
		PEAK,
		SPAN,
		bulgeAxes,
		clamp,
		gamma2,
		imChi,
		law,
		lengthTex,
		moonPlace,
		numTex,
		numText,
		orbit,
		overPage,
		page,
		solarTex,
		solarText,
		sup,
		tableX
	} from './tidal-friction';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let logM = $state(MASS.opening);
	let logN = $state(DISTANCE.opening);
	type Body = 'earth' | 'hole';
	let body = $state<Body>('earth');

	const setMass = (v: number) =>
		(logM = clamp(Math.round(v / MASS.step) * MASS.step, MASS.min, MASS.max));
	const setDistance = (v: number) => (logN = clamp(v, DISTANCE.min, DISTANCE.max));

	/**
	 * Page Up and Page Down: a power of ten on the mass, a tenth of one on the distance; Home and End to the true ends,
	 * which the distance's own steps from 3 rₛ miss by a little. The arrows keep the sliders' own steps.
	 */
	function pageKeys(e: KeyboardEvent, which: 'mass' | 'distance') {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const set = which === 'mass' ? setMass : setDistance;
		const range = which === 'mass' ? MASS : DISTANCE;
		if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			set(e.key === 'Home' ? range.min : range.max);
			return;
		}
		if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
		e.preventDefault();
		const by = (e.key === 'PageUp' ? 1 : -1) * range.page;
		set((which === 'mass' ? logM : logN) + by);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const n = $derived(10 ** logN);
	const o = $derived(orbit(10 ** logM * M_SUN, n));
	const g2 = $derived(gamma2(o.x));
	const times = $derived(overPage(o.x));

	// --- the moon's turning, waiting for the play button under reduced motion --------------------------------------
	let phase = $state(0.62);
	let playing = $state(true);
	let checked = false;

	const clock: Attachment = () => {
		// read first, so that pressing play or pause runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			phase = (phase + (dt * 2 * Math.PI) / DRAWN_PERIOD) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the body in the tide -----------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const scene = $derived(
		phone.current
			? { W: 360, H: 262, cx: 180, cy: 131, R: 38, near: 2.05, far: 3.0 }
			: { W: 300, H: 336, cx: 150, cy: 164, R: 45, near: 2.05, far: 3.0 }
	);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (x: number) => x.toFixed(1);
	const f2 = (x: number) => x.toFixed(2);

	const moonR = $derived(scene.R * (scene.near + (scene.far - scene.near) * moonPlace(logN)));
	/** A point at radius r and angle θ (anticlockwise on the page) from the body's centre. */
	const P = (r: number, th: number): [number, number] => [
		scene.cx + r * Math.cos(th),
		scene.cy - r * Math.sin(th)
	];
	const moon = $derived(P(moonR, phase));

	/** An arrow from radius r0 to r1 along the angle θ: its shaft, and its head at r1. */
	function arrow(r0: number, r1: number, th: number) {
		const head = 6.5 * u;
		const half = 3.4 * u;
		const dir = Math.sign(r1 - r0);
		const [x0, y0] = P(r0, th);
		const [xb, yb] = P(r1 - dir * head, th);
		const [x1, y1] = P(r1, th);
		// across the shaft, on the page
		const ax = -Math.sin(th) * half;
		const ay = -Math.cos(th) * half;
		return {
			shaft: { x1: f2(x0), y1: f2(y0), x2: f2(xb), y2: f2(yb) },
			head: `M${f2(x1)},${f2(y1)}L${f2(xb + ax)},${f2(yb + ay)}L${f2(xb - ax)},${f2(yb - ay)}Z`
		};
	}

	const tideArrows = $derived.by(() => {
		const R = scene.R;
		const out = [];
		for (const k of [0, 1, 2, 3]) {
			const th = phase + (k * Math.PI) / 2;
			const stretch = k % 2 === 0;
			out.push({
				key: k,
				kind: stretch ? 'stretch' : 'squeeze',
				...(stretch ? arrow(1.3 * R, 1.82 * R, th) : arrow(1.75 * R, 1.3 * R, th))
			});
		}
		return out;
	});
	/** The energy flowing into the horizon, on the diagonals between the stretch and the squeeze. */
	const inflow = $derived(
		[1, 3, 5, 7].map((k) => ({
			key: k,
			...arrow(1.62 * scene.R, 1.12 * scene.R, phase + (k * Math.PI) / 4)
		}))
	);

	const axes = bulgeAxes(K2_EARTH);
	const bulgeTurn = $derived(-((phase - LAG) * 180) / Math.PI);
	const moonLine = $derived({
		a: P(-1.95 * scene.R, phase),
		b: P(moonR - 9 * u, phase)
	});
	const bulgeLine = $derived({
		a: P(axes.a * scene.R, phase - LAG),
		b: P(-axes.a * scene.R, phase - LAG)
	});

	// --- the greybody factor and the friction, on log axes ------------------------------------------------------------
	const plot = $derived(
		phone.current
			? { W: 360, H: 336, L: 44, R: 350, T: 30, B: 168, T2: 196, B2: 296 }
			: { W: 400, H: 336, L: 50, R: 388, T: 30, B: 168, T2: 196, B2: 296 }
	);
	const LX = (x: number) =>
		plot.L + ((Math.log10(x) - SPAN.x[0]) / (SPAN.x[1] - SPAN.x[0])) * (plot.R - plot.L);
	const GY = (g: number) =>
		plot.B -
		((Math.log10(g) - SPAN.gamma[0]) / (SPAN.gamma[1] - SPAN.gamma[0])) * (plot.B - plot.T);
	const CY = (c: number) =>
		plot.B2 - ((Math.log10(c) - SPAN.chi[0]) / (SPAN.chi[1] - SPAN.chi[0])) * (plot.B2 - plot.T2);

	const line = (pts: [number, number][]) =>
		pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join('');

	const X_LOW = 10 ** SPAN.x[0];
	const X_TOP = 10 ** SPAN.x[1];
	/** The computed curves on the table's own points, and on to x = 1, where Γ₂ is 1. */
	const NODES = [...tableX(X_TOP).filter((x) => x < X_TOP), X_TOP];
	const gammaPath = $derived(line(NODES.map((x) => [LX(x), GY(gamma2(x))])));
	const pagePath = $derived(
		line([
			[LX(X_LOW), GY(page(X_LOW))],
			[LX(PAGE_TOP), GY(1)]
		])
	);
	const chiPath = $derived(line(NODES.map((x) => [LX(x), CY(imChi(x))])));
	const lawPath = $derived(
		line([
			[LX(X_LOW), CY(law(X_LOW))],
			[LX(X_TOP), CY(law(X_TOP))]
		])
	);

	const range = (a: number, b: number, by: number) => {
		const out: number[] = [];
		for (let e = a; e <= b; e += by) out.push(e);
		return out;
	};
	const xTicks = range(SPAN.x[0], SPAN.x[1], 1);
	const gammaGrid = range(SPAN.gamma[0], SPAN.gamma[1], 7);
	const gammaLabels = [0, -14, -28, -42];
	const chiGrid = range(SPAN.chi[0], SPAN.chi[1], 3);
	const chiLabels = [3, 0, -3, -6, -9];
	const power10 = (e: number) => (e === 0 ? '1' : `10${sup(e)}`);

	const marker = $derived({ x: LX(o.x), g: GY(g2), c: CY(imChi(o.x)) });
	const peak = $derived({ x: LX(PEAK.x), y: CY(PEAK.value) });

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const m = '\\htmlClass{q-matter}{m}';
	const sun = `${M}_\\odot`;
	const massTex = $derived(`${M} = ${solarTex(logM)}\\,${sun} = ${numTex(o.M)}\\,\\mathrm{kg}`);
	const rsTex = $derived(`r_s = ${lengthTex(o.rs)}`);
	const nuTex = $derived([
		`\\nu = \\tfrac{16}{45}G^5${M}^6/c^{13}`,
		`= ${numTex(o.nu)}\\,\\mathrm{J\\,s^5}`
	]);
	const distanceTex = $derived(`d = ${numTex(n)}\\,r_s = ${lengthTex(o.d)}`);
	const moonTex = `${m} = ${numTex(MOON_MASS)}\\,\\mathrm{kg}`;
	const omegaTex = $derived(`\\Omega = \\sqrt{G${M}/d^3} = ${numTex(o.omega)}\\,\\mathrm{s^{-1}}`);
	const xTex = $derived(`x = 2G${M}\\Omega/c^3 = ${numTex(o.x)}`);
	const gammaTex = $derived(`\\Gamma_2 = ${numTex(g2)}`);
	const timesTex = $derived(`${numTex(times)}`);
	const powerTex = $derived([
		`P = \\nu\\cdot18\\,\\Omega^2(G${m}/d^3)^2`,
		`= ${numTex(o.power)}\\,\\mathrm{W}`
	]);
	const ratioTex = $derived([`P/P_{\\rm waves} = (G${M}/c^2d)^4`, `= ${numTex(o.ratio)}`]);
	const wavesTex = $derived(`P_{\\rm waves} = ${numTex(o.waves)}\\,\\mathrm{W}`);
	const PAGE_TEX = '\\tfrac{256}{225}x^6';
	const IMCHI_TEX = '\\mathrm{Im}\\,\\chi = 5c^5\\Gamma_2/16G\\omega^5';

	/** The Earth is drawn not spinning, so that its bulge lags: the real Earth spins faster than the Moon orbits. */
	const BODIES: { value: Body; label: string; icon: typeof EarthIcon }[] = $derived([
		{
			value: 'earth',
			label: phone.current ? 'Earth, not spinning' : 'The Earth, not spinning',
			icon: EarthIcon
		},
		{ value: 'hole', label: 'A hole', icon: BlackHole01Icon }
	]);

	const sceneDescription = $derived(
		(body === 'earth'
			? `The Earth, drawn not spinning, a stone disc, in the tide of a moon that circles it. Its outline is stretched into an oval, exaggerated, whose long axis lags ${Math.round((LAG * 180) / Math.PI)} degrees behind the line to the moon. `
			: `A black hole, a dark disc of radius r_s and perfectly round, in the tide of a moon that circles it; four grey arrows point in at the horizon between the tide's arrows. `) +
			`Orange arrows point outward along the line to the moon, the tide's stretch; blue arrows point inward across it, its squeeze. Not to scale; the moon ${playing ? 'turns slowly' : 'is drawn still'}.`
	);
	const plotDescription = $derived(
		`Two log–log plots against x = GMω/c³ from 10⁻⁷ to 1. Above, the greybody factor Γ₂ from 10⁻⁴² to 1: Page's line (256/225)x⁶ dashed, and the computed Γ₂ from x = 0.01, on the line at first and bending away above it before it levels off at 1 near x = 0.5. ` +
			`Below, the response Im χ in units of M r_s²(GM/c³)²: the friction law (4/45)x dashed, and the computed (5/64)Γ₂/x⁵, which leaves the law, peaks at x = ${PEAK.x} and falls. ` +
			`A vertical line marks the moon's tide at x = ${numText(o.x)}, where Γ₂ is ${numText(times)} times Page's line.`
	);
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} trust />{/each}</span
	>{/snippet}

{#snippet head(d: string, kind: string)}<path class="head {kind}" {d} />{/snippet}

<div class="tidal-friction">
	<div class="panels">
		<section class="panel" aria-label="The body in its moon’s tide">
			<div class="stage">
				<p class="heading">
					{body === 'earth'
						? 'The Earth, not spinning, in its moon’s tide; its bulge exaggerated'
						: 'A hole in its moon’s tide'}
				</p>
				<svg
					viewBox="0 0 {scene.W} {scene.H}"
					role="img"
					aria-label={sceneDescription}
					{@attach fitText((value) => (u = value))}
					{@attach clock}
				>
					<defs>
						<radialGradient id="{uid}-stone" cx="0.38" cy="0.34" r="0.75">
							<stop offset="0" class="stone-0" />
							<stop offset="0.65" class="stone-1" />
							<stop offset="1" class="stone-2" />
						</radialGradient>
					</defs>

					<circle class="orbit" cx={scene.cx} cy={scene.cy} r={moonR} />
					<line
						class="moon-line"
						x1={f1(moonLine.a[0])}
						y1={f1(moonLine.a[1])}
						x2={f1(moonLine.b[0])}
						y2={f1(moonLine.b[1])}
					/>

					{#if body === 'earth'}
						<ellipse
							class="stone"
							cx={scene.cx}
							cy={scene.cy}
							rx={axes.a * scene.R}
							ry={axes.b * scene.R}
							fill="url(#{uid}-stone)"
							transform="rotate({f2(bulgeTurn)} {scene.cx} {scene.cy})"
						/>
						<line
							class="bulge-line"
							x1={f1(bulgeLine.a[0])}
							y1={f1(bulgeLine.a[1])}
							x2={f1(bulgeLine.b[0])}
							y2={f1(bulgeLine.b[1])}
						/>
					{:else}
						<circle class="hole" cx={scene.cx} cy={scene.cy} r={scene.R} />
						{#each inflow as a (a.key)}
							<line class="shaft inflow" {...a.shaft} />
							{@render head(a.head, 'inflow')}
						{/each}
					{/if}

					{#each tideArrows as a (a.key)}
						<line class="shaft {a.kind}" {...a.shaft} />
						{@render head(a.head, a.kind)}
					{/each}

					<circle
						class="stone"
						cx={f1(moon[0])}
						cy={f1(moon[1])}
						r={7 * u}
						fill="url(#{uid}-stone)"
					/>

					<text class="fine dim" x={8 * u} y={scene.H - 8 * u}>not to scale</text>
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch moon-key"></span>the moon, on its orbit</li>
					<li><span class="swatch stretch"></span>the tide’s stretch</li>
					<li><span class="swatch squeeze"></span>its squeeze</li>
					{#if body === 'earth'}
						<li>
							<span class="swatch bulge-key"></span><span
								>the bulge’s axis, <Tex math={`k_2 = ${K2_EARTH.toFixed(2)}`} />, lagging the line
								to the moon (dashed) by a friction angle, drawn larger</span
							>
						</li>
					{:else}
						<li><span class="swatch inflow-key"></span>energy flowing into the horizon</li>
					{/if}
				</ul>
			</div>
		</section>

		<section class="panel" aria-label="The greybody factor and the friction">
			<div class="stage">
				<p class="heading">The greybody factor and the friction, with the moon’s tide marked</p>
				<svg
					viewBox="0 0 {plot.W} {plot.H}"
					role="img"
					aria-label={plotDescription}
					{@attach fitText((value) => (v = value))}
				>
					<defs>
						<clipPath id="{uid}-top">
							<rect x={plot.L} y={plot.T} width={plot.R - plot.L} height={plot.B - plot.T} />
						</clipPath>
						<clipPath id="{uid}-bottom">
							<rect x={plot.L} y={plot.T2} width={plot.R - plot.L} height={plot.B2 - plot.T2} />
						</clipPath>
					</defs>

					<!-- the titles -->
					<text class="small" x={plot.L} y={plot.T - 10 * v}
						><tspan class="it">Γ</tspan><tspan class="sub" dy={2.5 * v}>2</tspan><tspan
							dy={-2.5 * v}>, the share of a quadrupole wave absorbed</tspan
						></text
					>
					<text class="small" x={plot.L} y={plot.T2 - 8 * v}
						>Im <tspan class="it">χ</tspan>, in <tspan class="it">M r</tspan><tspan
							class="sub"
							dy={2.5 * v}>s</tspan
						><tspan dy={-2.5 * v}>²(</tspan><tspan class="it">GM</tspan>/<tspan class="it">c</tspan
						>³)²</text
					>

					<rect
						class="frame"
						x={plot.L}
						y={plot.T}
						width={plot.R - plot.L}
						height={plot.B - plot.T}
					/>
					<rect
						class="frame"
						x={plot.L}
						y={plot.T2}
						width={plot.R - plot.L}
						height={plot.B2 - plot.T2}
					/>

					{#each xTicks as e (e)}
						<line class="grid" x1={LX(10 ** e)} x2={LX(10 ** e)} y1={plot.T} y2={plot.B} />
						<line class="grid" x1={LX(10 ** e)} x2={LX(10 ** e)} y1={plot.T2} y2={plot.B2} />
						<text class="fine tick" x={LX(10 ** e)} y={plot.B2 + 15 * v}>{power10(e)}</text>
					{/each}
					{#each gammaGrid as e (e)}
						<line class="grid" x1={plot.L} x2={plot.R} y1={GY(10 ** e)} y2={GY(10 ** e)} />
					{/each}
					{#each gammaLabels as e (e)}
						<text class="fine y-tick" x={plot.L - 5 * v} y={GY(10 ** e) + 3.5 * v}
							>{power10(e)}</text
						>
					{/each}
					{#each chiGrid as e (e)}
						<line class="grid" x1={plot.L} x2={plot.R} y1={CY(10 ** e)} y2={CY(10 ** e)} />
					{/each}
					{#each chiLabels as e (e)}
						<text class="fine y-tick" x={plot.L - 5 * v} y={CY(10 ** e) + 3.5 * v}
							>{power10(e)}</text
						>
					{/each}
					<text class="small dim end" x={plot.R} y={plot.B2 + 31 * v}
						><tspan class="it">x</tspan> = <tspan class="it">GMω</tspan>/<tspan class="it">c</tspan
						>³</text
					>

					<g clip-path="url(#{uid}-top)">
						<path class="law" d={pagePath} />
						<path class="computed" d={gammaPath} />
					</g>
					<g clip-path="url(#{uid}-bottom)">
						<path class="law" d={lawPath} />
						<path class="computed" d={chiPath} />
					</g>

					<!-- the peak of the response -->
					<circle class="peak" cx={peak.x} cy={peak.y} r={2.6 * v} />
					<text class="fine words mid" x={peak.x} y={peak.y - 6 * v}>{PEAK.x}</text>

					<!-- the moon's tide -->
					<line class="marker" x1={marker.x} x2={marker.x} y1={plot.T} y2={plot.B} />
					<line class="marker" x1={marker.x} x2={marker.x} y1={plot.T2} y2={plot.B2} />
					<circle class="dot" cx={marker.x} cy={marker.g} r={3.4 * v} />
					<circle class="dot" cx={marker.x} cy={marker.c} r={3.4 * v} />
				</svg>

				<ul class="legend" aria-hidden="true">
					<li>
						<span class="swatch computed-key"></span>computed, chapter 11.3’s Regge–Wheeler table
					</li>
					<li>
						<span class="swatch law-key"></span><span
							>the friction law: Page’s <Tex math={PAGE_TEX} />, and <Tex math="\nu\omega" /></span
						>
					</li>
					<li><span class="swatch marker-key"></span>the moon’s tide</li>
				</ul>
			</div>
		</section>
	</div>

	<div class="bar">
		<div class="slot" onkeydowncapture={(e) => pageKeys(e, 'mass')} role="presentation">
			<Slider
				id="{uid}-mass"
				label="The hole’s mass"
				icon={BlackHole01Icon}
				min={MASS.min}
				max={MASS.max}
				step={MASS.step}
				bind:value={() => logM, setMass}
				readout="{solarText(logM)} solar masses"
				ends={['1', '10⁹']}
			/>
		</div>
		<div class="slot" onkeydowncapture={(e) => pageKeys(e, 'distance')} role="presentation">
			<Slider
				id="{uid}-distance"
				label="The moon’s distance"
				icon={RulerIcon}
				min={DISTANCE.min}
				max={DISTANCE.max}
				step={DISTANCE.step}
				bind:value={() => logN, setDistance}
				readout="d = {numText(n)} rₛ"
				ends={['3 rₛ', '10⁴ rₛ']}
				marks={[{ at: 1, label: '10 rₛ' }]}
				marksHint="the tick marks 10 rₛ"
			/>
		</div>
		<div class="row-controls">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Stop the moon' : 'Turn the moon'}
				aria-pressed={playing}
				onclick={() => (playing = !playing)}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<div class="bodies">
				<Segmented label="The body in the tide" options={BODIES} bind:value={body} />
			</div>
		</div>
		<p class="hint">
			Drag the mass and the distance. With the keyboard, reach each with Tab: on the mass the arrow
			keys step a twentieth of a power of ten and Page Up and Page Down a whole one; on the distance
			the arrows step a hundredth and Page Up and Page Down a tenth; Home and End go to the ends.
			The play button starts and stops the moon, and the switch chooses the body.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The hole</dt>
				<dd>{@render eq([massTex])}{@render eq([rsTex])}</dd>
			</div>
			<div class="row">
				<dt>Its friction</dt>
				<dd>{@render eq(nuTex)}</dd>
			</div>
			<div class="row">
				<dt>The moon</dt>
				<dd>
					{@render eq([distanceTex])}{@render eq([moonTex])}<span class="also"
						>the Moon’s mass;</span
					>{@render eq([omegaTex])}
				</dd>
			</div>
			<div class="row">
				<dt>The tide’s frequency</dt>
				<dd>
					{@render eq([xTex])}{@render eq([gammaTex])}<span class="also"
						>there, <Tex math={timesTex} /> times Page’s line</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The power taken</dt>
				<dd>
					{@render eq(powerTex)}<span class="also">by the friction law</span>
				</dd>
			</div>
			<div class="row">
				<dt>Against the waves</dt>
				<dd>
					{@render eq(ratioTex)}<span class="also">of what the pair radiates,</span>{@render eq([
						wavesTex
					])}
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Look first at the dot on the dashed line as the moon comes in. The moon’s tide on the hole is <Tex
			math={`\\htmlClass{q-curv}{\\mathcal E}_{ij} = (G${m}/d^3)(\\delta_{ij} - 3\\hat n_i\\hat n_j)`}
			trust
		/>, turning at twice the orbit’s <Tex math="\Omega" />; the power is the electric half of the
		paper’s friction, for a light moon, and the waves are chapter 7.7’s <Tex
			math={`\\tfrac{32}{5}G^4${M}^3${m}^2/c^5d^5`}
			trust
		/>. The computed curves are chapter 11.3’s Regge–Wheeler table, from <Tex math="x = 0.01" />,
		read as a power of <Tex math="x" /> between its points; below it <Tex math="\Gamma_2" /> is Page’s
		form times <Tex math="1 + ax + bx^2" />, fitted to the table’s first two points, and the two
		lines differ by less than 7%. In these units <Tex math={IMCHI_TEX} /> is <Tex
			math="(5/64)\,\Gamma_2/x^5"
		/> and <Tex math="\nu\omega" /> is <Tex math="(4/45)\,x" />. The left panel is not to scale: the
		moon’s drawn distance follows <Tex math="\log d" />, the Earth’s bulge and its friction angle
		are exaggerated, and the moon turns far slower than any orbit here.
	</p>
</div>

<style>
	.tidal-friction {
		/* the horizon is black on either ground */
		--hole: #050403;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panels {
		display: grid;
		grid-template-columns: minmax(0, 300fr) minmax(0, 400fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.8rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.fine {
		font-size: calc(10.5px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	.mid {
		text-anchor: middle;
	}

	.end {
		text-anchor: end;
	}

	.tick {
		text-anchor: middle;
	}

	.y-tick {
		text-anchor: end;
	}

	/* words over the curves keep a halo of the ground */
	.words {
		fill: var(--text-dim);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.75em;
	}

	/* --- the body in the tide --------------------------------------------------------------- */

	.orbit {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.moon-line {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.bulge-line {
		stroke: color-mix(in srgb, var(--text) 80%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.stone {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.stone-0 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 22%,
			color-mix(in srgb, var(--text) 62%, var(--bg))
		);
	}

	.stone-1 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 14%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
	}

	.stone-2 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 8%,
			color-mix(in srgb, var(--text) 24%, var(--bg))
		);
	}

	.hole {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.shaft {
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
	}

	/* orange the stretch, blue the squeeze, as in every figure of the tutorial */
	.shaft.stretch {
		stroke: var(--accent);
	}

	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.shaft.inflow {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.head {
		stroke: none;
	}

	.head.stretch {
		fill: var(--accent);
	}

	.head.squeeze {
		fill: var(--accent-2);
	}

	.head.inflow {
		fill: color-mix(in srgb, var(--text) 55%, transparent);
	}

	/* --- the plots ---------------------------------------------------------------------------- */

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the greybody factor and the friction are neutral (NOTATION.md): everything in the ink */
	.computed {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.law {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.marker {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-raised);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.peak {
		fill: color-mix(in srgb, var(--text) 70%, transparent);
	}

	/* --- the legends ------------------------------------------------------------------------ */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.45rem 0.2rem 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 1.6px solid;
	}

	.swatch.stretch {
		border-top: 2px solid var(--accent);
	}

	.swatch.squeeze {
		border-top: 2px solid var(--accent-2);
	}

	.bulge-key {
		border-color: color-mix(in srgb, var(--text) 80%, transparent);
	}

	.inflow-key {
		border-top: 2px solid color-mix(in srgb, var(--text) 55%, transparent);
	}

	.computed-key {
		border-color: var(--text);
	}

	.law-key {
		border-top: 1.4px dashed color-mix(in srgb, var(--text) 70%, transparent);
	}

	.moon-key {
		width: 0.6rem;
		height: 0.6rem;
		border: 0.8px solid color-mix(in srgb, var(--text) 45%, transparent);
		border-radius: 50%;
		background: color-mix(in srgb, var(--text) 42%, var(--bg));
	}

	.marker-key {
		width: 0.5rem;
		height: 0.5rem;
		border: 0;
		border-radius: 50%;
		background: var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slot {
		min-width: 0;
	}

	.row-controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.bodies {
		flex: 1;
		min-width: 0;
	}

	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		min-height: 2.2rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	@media (hover: hover) {
		.play:hover {
			border-color: var(--accent);
		}
	}

	.play:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.readouts {
		padding: 0.75rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.15rem 0.6rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.3em;
		min-width: 0;
		max-width: 100%;
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	.note {
		margin: 0;
		padding: 0.7rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play {
			transition: none;
		}
	}
</style>
