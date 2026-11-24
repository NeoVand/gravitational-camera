<script lang="ts">
	/**
	 * Reading chapter R11's camera with a black hole in it, the paper's Figure fig:black-hole-camera made live. Panel 1,
	 * on log axes: the hole's stretch 2GM/r³ against the camera's distance r from 1 m to 10⁵ km, in the ink, with the
	 * person's tide (70 kg a metre from the camera) dashed, the bearable 1 s⁻² dotted, and the camera marked at its
	 * distance in the observer's colour. Panel 2, a side view not to scale: rays from the sky behind the hole, in the
	 * light's colour, passing it at b₋ to b₊ and bent onto a detector of radius a, the ring's own rays at b_E, and the
	 * hole as chapter 11.1's near-black disc. One slider sets r, logarithmic, opening at 26.3 km, where one equilibrium
	 * mass's tide is bearable; one sets the mass from 0.3 to 30 equilibrium masses, logarithmic, opening at 1. The
	 * arithmetic is in ./black-hole-camera.ts. The chapter's try box asks the predictions, so the figure answers none of
	 * them in words: it shows the live values only. Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { BlackHole01Icon, RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DETECTOR,
		DISTANCE,
		LOG_DISTANCE,
		LOG_MASS,
		MASS,
		OPENING,
		PERSON,
		PERSON_TIDE,
		R_LABELS,
		SPAN,
		TIDE_LABELS,
		angle,
		camera,
		distanceFromLog,
		landing,
		length,
		massFromLog,
		massText,
		numTex,
		numText,
		speedTex,
		tideOf,
		timeTex
	} from './black-hole-camera';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let logR = $state(Math.log10(OPENING.r));
	let logMu = $state(Math.log10(OPENING.mu));

	const setR = (v: number) => (logR = Math.log10(distanceFromLog(v)));
	const setMu = (v: number) => (logMu = Math.log10(massFromLog(v)));

	/**
	 * On either slider the arrow keys step a hundredth of a power of ten, Page Up and Page Down a tenth, and Home and End
	 * go to its ends.
	 */
	function sliderKeys(e: KeyboardEvent, which: 'distance' | 'mass') {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const range = which === 'distance' ? DISTANCE : MASS;
		const ends = which === 'distance' ? LOG_DISTANCE : LOG_MASS;
		const set = which === 'distance' ? setR : setMu;
		const now = which === 'distance' ? logR : logMu;
		if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			set(e.key === 'Home' ? ends.low : ends.high);
			return;
		}
		const by = {
			ArrowRight: range.key,
			ArrowUp: range.key,
			ArrowLeft: -range.key,
			ArrowDown: -range.key,
			PageUp: range.page,
			PageDown: -range.page
		}[e.key];
		if (by === undefined) return;
		e.preventDefault();
		set(now + by);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const r = $derived(10 ** logR);
	const mu = $derived(10 ** logMu);
	const c = $derived(camera(mu, r));

	const M = '\\htmlClass{q-matter}{M}';
	const m = '\\htmlClass{q-matter}{m}';

	const massTex = $derived(`${M} = ${numTex(c.M)}\\,\\mathrm{kg}`);
	const rsTex = $derived(`r_s = 2G${M}/c^2 = ${length(c.rs).tex}`);
	const tempTex = $derived([`T_H = \\hbar c^3/8\\pi G${M}k_B`, `= ${numTex(c.T_H)}\\,\\mathrm{K}`]);
	const tideTex = $derived([`2G${M}/r^3`, `= ${numTex(c.tide)}\\,\\mathrm{s^{-2}}`]);
	const overTex = $derived(`${numTex(c.overPerson)}`);
	const PERSON_TEX = `2G${m}/d^3 = ${numTex(PERSON_TIDE)}\\,\\mathrm{s^{-2}}`;
	const ringTex = $derived([`\\theta_E = \\sqrt{2r_s/r}`, `= ${angle(c.theta).tex}`]);
	const bETex = $derived([`b_E = \\sqrt{2r_s r}`, `= ${length(c.bE).tex}`]);
	const periodTex = $derived([`T = 2\\pi\\sqrt{r^3/G${M}}`, `= ${timeTex(c.period)}`]);
	const speedTexs = $derived([`v = \\sqrt{G${M}/r}`, `= ${speedTex(c.speed)}`]);
	const focusTex = $derived([`\\theta_E T/\\pi`, `= ${timeTex(c.focus)}`]);
	const areaTex = $derived([
		`\\pi a\\sqrt{a^2 + 4b_E^2}`,
		`= ${numTex(c.area)}\\,\\mathrm{m^2}`,
		`= ${numTex(c.gain)}\\,\\pi a^2`
	]);
	const dishTex = $derived(length(c.dish).tex);
	const A_TEX = `a = ${DETECTOR * 100}\\,\\mathrm{cm}`;

	// --- the tide against the distance, on log axes ---------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const plot = $derived(
		phone.current
			? { W: 360, H: 300, L: 42, R: 350, T: 26, B: 254 }
			: { W: 440, H: 300, L: 48, R: 428, T: 26, B: 254 }
	);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	const X = (e: number) => plot.L + ((e - SPAN.r[0]) / (SPAN.r[1] - SPAN.r[0])) * (plot.R - plot.L);
	const Y = (e: number) =>
		plot.B - ((e - SPAN.tide[0]) / (SPAN.tide[1] - SPAN.tide[0])) * (plot.B - plot.T);

	const R_GRID = Array.from({ length: SPAN.r[1] - SPAN.r[0] + 1 }, (_, k) => SPAN.r[0] + k);

	/** The tide is a straight line on these axes, slope −3: its two ends are enough. */
	const tidePath = $derived.by(() => {
		const k = Math.log10(tideOf(c.M, 1));
		return `M${f1(X(SPAN.r[0]))},${f1(Y(k - 3 * SPAN.r[0]))}L${f1(X(SPAN.r[1]))},${f1(Y(k - 3 * SPAN.r[1]))}`;
	});
	const personY = $derived(Y(Math.log10(PERSON_TIDE)));
	const bearableY = $derived(Y(0));
	const dot = $derived({ x: X(logR), y: Y(Math.log10(c.tide)) });

	// --- the rays to the camera, a side view not to scale -----------------------------------------------------------------
	/** Drawn lengths: the hole's plane at xL, the detector at xC, b_E and a in drawing units. */
	const S = { W: 300, H: 184, x0: 10, xL: 80, xC: 266, cy: 86, bE: 54, a: 6 };
	const root = Math.sqrt(S.a * S.a + 4 * S.bE * S.bE);
	const B_PLUS = (root + S.a) / 2;
	const B_MINUS = (root - S.a) / 2;
	/** A bundle above the axis (side 1) or below it (side −1): b₋ to b₊, landing within a of the axis. */
	const bundle = (side: 1 | -1) => {
		const y = (b: number) => f1(S.cy - side * b);
		return (
			`M${S.x0},${y(B_PLUS)}H${S.xL}L${S.xC},${y(landing(B_PLUS, S.bE))}` +
			`L${S.xC},${y(landing(B_MINUS, S.bE))}L${S.xL},${y(B_MINUS)}H${S.x0}Z`
		);
	};
	const BUNDLES = [bundle(1), bundle(-1)];
	const RING_RAYS = ([1, -1] as const).map(
		(side) => `M${S.x0},${S.cy - side * S.bE}H${S.xL}L${S.xC},${S.cy}`
	);
	const ARC = (() => {
		const rho = 40;
		const phi = Math.atan2(S.bE, S.xC - S.xL);
		const x = S.xC - rho * Math.cos(phi);
		const y = S.cy - rho * Math.sin(phi);
		return `M${S.xC - rho},${S.cy}A${rho},${rho} 0 0 1 ${f1(x)},${f1(y)}`;
	})();

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const plotDescription = $derived(
		`A log–log plot of the hole's tide against the camera's distance, from 1 metre to 100,000 kilometres, and from 10⁻¹² to 10¹⁵ per second squared. ` +
			`The hole of ${massText(mu)} equilibrium masses has the tide 2GM/r³, a straight line falling a thousandfold for each tenfold distance. ` +
			`A dashed level line is the tide of a person of 70 kg a metre from the camera, ${numText(PERSON_TIDE)} per second squared; a dotted one is the bearable 1 per second squared. ` +
			`The camera is marked at ${length(r).text}, where the hole's tide is ${numText(c.tide)} per second squared, ${numText(c.overPerson)} times the person's.`
	);
	const SIDE_DESCRIPTION =
		'A side view, not to scale. Rays from the sky behind the hole arrive level from the left, in two bundles, above and below the axis; at the hole, a small dark disc, each is bent toward the axis and the two bundles meet on a short detector at the right, of radius a. ' +
		'The ring’s own rays pass the hole at b_E and reach the detector’s centre at the angle θ_E from the axis; the distance r runs from the hole to the detector.';
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="black-hole-camera">
	<div class="panels">
		<section class="panel" aria-label="The hole’s tide against the distance">
			<div class="stage">
				<p class="heading">The hole’s tide against the camera’s distance</p>
				<svg
					viewBox="0 0 {plot.W} {plot.H}"
					role="img"
					aria-label={plotDescription}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<clipPath id="{uid}-plot">
							<rect x={plot.L} y={plot.T} width={plot.R - plot.L} height={plot.B - plot.T} />
						</clipPath>
					</defs>

					<text class="small" x={plot.L} y={plot.T - 10 * u}
						>the tide, 2<tspan class="it">GM</tspan>/<tspan class="it">r</tspan>³, in s⁻²</text
					>
					<rect
						class="frame"
						x={plot.L}
						y={plot.T}
						width={plot.R - plot.L}
						height={plot.B - plot.T}
					/>
					{#each R_GRID as e (e)}
						<line class="grid" x1={X(e)} x2={X(e)} y1={plot.T} y2={plot.B} />
					{/each}
					{#each TIDE_LABELS as t (t.e)}
						<line class="grid" x1={plot.L} x2={plot.R} y1={Y(t.e)} y2={Y(t.e)} />
						<text class="fine y-tick" x={plot.L - 5 * u} y={f1(Y(t.e) + 3.5 * u)}>{t.text}</text>
					{/each}
					{#each R_LABELS as t, i (t.e)}
						<text
							class="fine tick"
							class:first={i === 0}
							class:last={i === R_LABELS.length - 1}
							x={X(t.e)}
							y={plot.B + 15 * u}>{t.text}</text
						>
					{/each}
					<text class="small dim end" x={plot.R} y={plot.B + 32 * u}
						>the camera’s distance, <tspan class="it">r</tspan></text
					>

					<g clip-path="url(#{uid}-plot)">
						<line class="bearable" x1={plot.L} x2={plot.R} y1={bearableY} y2={bearableY} />
						<line class="person" x1={plot.L} x2={plot.R} y1={personY} y2={personY} />
						<path class="tide" d={tidePath} />
						<line class="marker" x1={dot.x} x2={dot.x} y1={plot.T} y2={plot.B} />
					</g>
					<text class="fine words" x={plot.L + 6 * u} y={f1(bearableY - 5 * u)}
						>bearable, 1 s⁻²</text
					>
					<text class="fine words" x={plot.L + 6 * u} y={f1(personY - 5 * u)}
						>a person 1 m from the camera</text
					>
					<circle class="camera" cx={f1(dot.x)} cy={f1(dot.y)} r={3.8 * u} />
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch tide-key"></span>the hole’s tide</li>
					<li>
						<span class="swatch person-key"></span><span
							>a person of {PERSON.m} kg a metre from the camera</span
						>
					</li>
					<li><span class="swatch bearable-key"></span>bearable</li>
					<li><span class="swatch camera-key"></span>the camera</li>
				</ul>
			</div>
		</section>

		<section class="panel" aria-label="The rays to the camera">
			<div class="stage">
				<p class="heading">The rays to the camera, not to scale</p>
				<svg
					viewBox="0 0 {S.W} {S.H}"
					role="img"
					aria-label={SIDE_DESCRIPTION}
					{@attach fitText((value) => (v = value))}
				>
					<line class="axis" x1={S.x0} x2={S.xC} y1={S.cy} y2={S.cy} />
					{#each BUNDLES as d, i (i)}
						<path class="bundle" {d} />
					{/each}
					{#each RING_RAYS as d, i (i)}
						<path class="ring-ray" {d} />
					{/each}
					<circle class="hole" cx={S.xL} cy={S.cy} r={6} />
					<line class="detector" x1={S.xC} x2={S.xC} y1={S.cy - S.a - 1} y2={S.cy + S.a + 1} />

					<!-- b_E, at the hole's plane -->
					<path
						class="dimension"
						d="M{S.xL - 20 - 3},{S.cy}h6M{S.xL - 20},{S.cy}V{S.cy - S.bE}M{S.xL - 20 - 3},{S.cy -
							S.bE}h6"
					/>
					<text class="small it-label end" x={S.xL - 26} y={S.cy - S.bE / 2 + 4}
						><tspan class="it">b</tspan><tspan class="sub" dy={2.5 * v}>E</tspan></text
					>

					<!-- θ_E, at the camera -->
					<path class="dimension" d={ARC} />
					<text class="small mid" x={S.xC - 30} y={S.cy - 20}
						><tspan class="it">θ</tspan><tspan class="sub" dy={2.5 * v}>E</tspan></text
					>

					<!-- the detector's width -->
					<text class="small start" x={S.xC + 7} y={S.cy + 4}>2<tspan class="it">a</tspan></text>

					<!-- r, from the hole to the camera -->
					<path
						class="dimension"
						d="M{S.xL},{S.cy + 66}v8M{S.xL},{S.cy + 70}H{S.xC}M{S.xC},{S.cy + 66}v8"
					/>
					<text class="small mid" x={(S.xL + S.xC) / 2} y={S.cy + 86}
						><tspan class="it">r</tspan></text
					>

					<text class="fine dim" x={S.x0} y={S.cy - B_PLUS - 10}>from the sky behind the hole</text>
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch hole-key"></span>the hole, drawn far larger</li>
					<li>
						<span class="swatch bundle-key"></span><span
							>rays passing at <Tex math="b_-" /> to <Tex math="b_+" />, which meet the detector</span
						>
					</li>
					<li><span class="swatch ring-key"></span>the ring’s rays, at <Tex math="b_E" /></li>
					<li>
						<span class="swatch detector-key"></span><span
							>the detector, of radius <Tex math="a" /></span
						>
					</li>
				</ul>
			</div>
		</section>
	</div>

	<div class="bar">
		<div class="slot" onkeydowncapture={(e) => sliderKeys(e, 'distance')} role="presentation">
			<Slider
				id="{uid}-distance"
				label="The camera’s distance"
				icon={RulerIcon}
				min={LOG_DISTANCE.low}
				max={LOG_DISTANCE.high}
				step={DISTANCE.step}
				bind:value={() => logR, setR}
				readout="r = {length(r).text}"
				ends={['1 m', '10⁵ km']}
				marks={[
					{
						at: Math.log10(OPENING.r),
						label: '26.3 km, the paper’s camera'
					}
				]}
				marksHint="the tick marks 26.3 km, the paper’s camera"
			/>
		</div>
		<div class="slot" onkeydowncapture={(e) => sliderKeys(e, 'mass')} role="presentation">
			<Slider
				id="{uid}-mass"
				label="The hole’s mass"
				icon={BlackHole01Icon}
				min={LOG_MASS.low}
				max={LOG_MASS.high}
				step={MASS.step}
				bind:value={() => logMu, setMu}
				readout="{massText(mu)} equilibrium masses"
				ends={['0.3', '30']}
				marks={[
					{ at: 0, label: 'one equilibrium mass, as warm as the graviton sky' },
					{ at: 1, label: 'ten equilibrium masses' }
				]}
				marksHint="the ticks mark one and ten equilibrium masses"
			/>
		</div>
		<p class="hint">
			Drag the camera’s distance and the hole’s mass, in equilibrium masses <Tex
				math={`${M}_{\\rm eq} = 1.356\\times10^{23}\\,\\mathrm{kg}`}
				trust
			/>. With the keyboard, reach each with Tab: the arrow keys step a hundredth of a power of ten,
			Page Up and Page Down a tenth, and Home and End go to the ends.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The hole</dt>
				<dd>{@render eq([massTex])}{@render eq([rsTex])}{@render eq(tempTex)}</dd>
			</div>
			<div class="row">
				<dt>Its tide on the camera</dt>
				<dd>
					{@render eq(tideTex)}<span class="also"
						><Tex math={overTex} /> times the person’s <Tex math={PERSON_TEX} trust /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The ring</dt>
				<dd>
					{@render eq(ringTex)}{@render eq(bETex)}<span class="also"
						>where its rays pass the hole</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The orbit</dt>
				<dd>{@render eq(periodTex)}{@render eq(speedTexs)}</dd>
			</div>
			<div class="row">
				<dt>In focus</dt>
				<dd>{@render eq(focusTex)}<span class="also">a turn, for each patch of sky</span></dd>
			</div>
			<div class="row">
				<dt>The gathered area</dt>
				<dd>
					{@render eq(areaTex)}<span class="also"
						>for <Tex math={A_TEX} />: a dish <Tex math={dishTex} /> across</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Look first at the camera’s dot on the hole’s line: the camera can sit only where the dot is at
		or below the dotted line, and wherever the dot is above the dashed one, the hole’s tide
		outweighs the person’s. The plot and the readouts are exact in the weak field, which holds
		everywhere here, since <Tex math="r" /> is never less than a hundred and fifty times <Tex
			math="r_s"
		/>: the tide is chapter 11.1’s exact <Tex math={`2G${M}/r^3`} trust />, the orbit is Newton’s
		circle, the ring is the weak-field <Tex math={'\\theta_E = \\sqrt{2r_s/r}'} />, and a patch of
		sky stays in focus while the camera’s axis sweeps <Tex math="2\theta_E" />. The gathered area is
		the annulus whose rays, landing <Tex math="b - b_E^2/b" /> from the axis, meet a detector of radius
		<Tex math="a" />: from <Tex
			math={'b_\\pm = \\tfrac12\\bigl[\\sqrt{a^2 + 4b_E^2} \\pm a\\bigr]'}
		/>. The side view is schematic: it keeps that rule but not the proportions, for the true angles
		are far smaller, <Tex math="b_E" /> is many times <Tex math="a" />, and the hole, 0.2 mm in
		radius at one equilibrium mass, is drawn far larger.
	</p>
</div>

<style>
	.black-hole-camera {
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
		grid-template-columns: minmax(0, 440fr) minmax(0, 300fr);
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

	.mid,
	.tick {
		text-anchor: middle;
	}

	.tick.first {
		text-anchor: start;
	}

	.tick.last,
	.end,
	.y-tick {
		text-anchor: end;
	}

	.start {
		text-anchor: start;
	}

	/* words over the lines keep a halo of the ground */
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

	.it-label,
	.panel text.small.mid,
	.panel text.small.start {
		fill: var(--text);
	}

	/* --- the plot ----------------------------------------------------------------------------- */

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* a tide drawn as a curve is neutral: the hole's in the ink, the person's and the bearable fainter */
	.tide {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.7px * var(--u, 1));
	}

	.person {
		stroke: color-mix(in srgb, var(--text) 68%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.bearable {
		stroke: color-mix(in srgb, var(--text) 68%, transparent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.marker {
		stroke: color-mix(in srgb, var(--q-obs) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the camera is the observer */
	.camera {
		fill: var(--q-obs);
		stroke: var(--bg-raised);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	/* --- the side view ------------------------------------------------------------------------ */

	.axis {
		stroke: color-mix(in srgb, var(--text) 14%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.bundle {
		fill: color-mix(in srgb, var(--q-light) 20%, transparent);
		stroke: color-mix(in srgb, var(--q-light) 70%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ring-ray {
		fill: none;
		stroke: var(--q-light);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.hole {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.detector {
		stroke: var(--q-obs);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.dimension {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
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

	.tide-key {
		border-color: var(--text);
	}

	.person-key {
		border-top: 1.4px dashed color-mix(in srgb, var(--text) 68%, transparent);
	}

	.bearable-key {
		border-top: 2px dotted color-mix(in srgb, var(--text) 68%, transparent);
	}

	.camera-key {
		width: 0.55rem;
		height: 0.55rem;
		border: 0;
		border-radius: 50%;
		background: var(--q-obs);
	}

	.hole-key {
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
		border-radius: 50%;
		background: var(--hole);
	}

	.bundle-key {
		height: 0.55rem;
		border: 0.8px solid color-mix(in srgb, var(--q-light) 70%, transparent);
		background: color-mix(in srgb, var(--q-light) 20%, transparent);
	}

	.ring-key {
		border-color: var(--q-light);
	}

	.detector-key {
		width: 0;
		height: 0.75rem;
		border: 0;
		border-left: 3px solid var(--q-obs);
		border-radius: 2px;
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
</style>
