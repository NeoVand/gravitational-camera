<script lang="ts">
	/**
	 * Chapter 11.3's hole against a warm sky. Panel 1: against x = GMω/c³, the sky's energy n_bg x³ and the hole's own
	 * n_H x³ (dashed, which may leave the top), both in units of the sky's peak, the share σ_abs/27π(GM/c²)² dotted on its own scale, and the
	 * removed σ_abs(n_bg − n_H)x³/27π(GM/c²)² shaded: solid where it is a shadow, hatched where it is a glow (neutral
	 * both: temperatures carry no colour, and orange and blue are the figures' stretch and squeeze). Its area over the
	 * area under the sky's curve is the depth D by energy. Panel 2: two copies of a uniform grey sky with the capture
	 * disc on each, its grey the sky's times 1 − D, weighed in energy and counted in quanta. One slider sets M from 0.3
	 * to 300 equilibrium masses, a hundredth of a power of ten a step, opening at 2; a switch sets the sky, gravitons at
	 * 0.905 K or light at 2.7255 K in geometric optics. The depths stay covered until the reader shows them. The
	 * greybody factors are the chapter's own Regge–Wheeler table, exported into ./hole-against-sky-data.ts; the
	 * arithmetic is in ./hole-against-sky.ts. The chapter's try box asks the predictions, so the figure answers none of
	 * them in words. Nothing moves by itself; under reduced motion the disc's grey changes without a fade.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BlackHole01Icon,
		GravityIcon,
		Sun03Icon,
		ViewIcon,
		ViewOffIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { numberTex, numberText, temperatureTex, wavelengthText } from './planck-spectrum';
	import {
		HEIGHT,
		MASS,
		M_EQ,
		OPENING,
		PAPER_MASSES,
		SKIES,
		STOPS,
		captureDiameter,
		clamp,
		depth,
		depthText,
		discGrey,
		drawnHeight,
		extent,
		hawkingTemperature,
		holePeak,
		massText,
		skyPeakWavelength,
		skyPeakX,
		spectrum,
		stopOf,
		ticks,
		type Sky
	} from './hole-against-sky';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let stop = $state(OPENING.stop);
	let sky = $state<Sky>(OPENING.sky);
	/** The depths stay covered until the reader has predicted and asks for them. */
	let shown = $state(false);

	const LAST = STOPS.length - 1;
	const setStop = (i: number) => (stop = clamp(Math.round(i), 0, LAST));

	/** Page Up and Page Down step a tenth of a power of ten; the arrows, Home and End keep the slider's own. */
	function pageKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
		e.preventDefault();
		setStop(stop + (e.key === 'PageUp' ? MASS.page : -MASS.page));
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const mu = $derived(STOPS[stop]);
	const geometric = $derived(SKIES[sky].geometric);
	const T_H = $derived(hawkingTemperature(mu * M_EQ));
	const T_bg = $derived(SKIES[sky].T);
	const energy = $derived(depth(mu, sky, 'energy'));
	const count = $derived(depth(mu, sky, 'count'));
	const peakX = $derived(skyPeakX(mu, sky));
	const peakLambda = $derived(wavelengthText(skyPeakWavelength(sky)));
	const disc = $derived(captureDiameter(mu));
	const hotter = $derived(T_H > T_bg);

	// --- the spectrum -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, H: 262, L: 36, R: 334, T: 34, B: 222 }
			: { W: 680, H: 290, L: 48, R: 640, T: 34, B: 246 }
	);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const ext = $derived(extent(mu, sky));
	const points = $derived(spectrum(mu, sky, phone.current ? 180 : 260));
	const top = $derived(drawnHeight(points));
	/** The hole's own curve leaves the top: where it peaks, and how high, for a word at the top. */
	const holeOff = $derived(holePeak(mu, sky) > 1.02 * top);
	const X = (x: number) => box.L + (x / ext.x) * (box.R - box.L);
	const Y = (y: number) => box.B - (clamp(y, -0.05 * top, 1.05 * top) / top) * (box.B - box.T);
	/** The share on its own scale: 1 where the sky's peak is drawn while the axis is not grown. */
	const SY = (s: number) => box.B - (s / HEIGHT) * (box.B - box.T);

	const line = (pts: [number, number][]) =>
		pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join('');

	const skyPath = $derived(line(points.map((p) => [X(p.x), Y(p.sky)])));
	const holePath = $derived(line(points.map((p) => [X(p.x), Y(p.hole)])));
	const sharePath = $derived(line(points.map((p) => [X(p.x), SY(p.share)])));
	/** The removed part, closed along the axis; its sign is the same at every x. */
	const removedPath = $derived(
		line(points.map((p) => [X(p.x), Y(Math.abs(p.removed))])) +
			`L${f2(box.R)},${f2(box.B)}L${f2(box.L)},${f2(box.B)}Z`
	);

	const xTicks = $derived(ticks(ext.x, phone.current ? 5 : 6));
	const yTicks = $derived(ticks(top, 3));
	const tickText = (t: number) => String(t);

	// --- the sky with its discs -------------------------------------------------------------------------------------
	const view = $derived(
		phone.current ? { W: 360, H: 156, sky: 118, r: 38 } : { W: 680, H: 156, sky: 120, r: 42 }
	);
	const discs = $derived([
		{ key: 'energy', cx: view.W * 0.27, D: energy, name: 'weighed in energy' },
		{ key: 'count', cx: view.W * 0.73, D: count, name: 'counted in quanta' }
	]);

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const massTex = $derived(
		`${M} = ${massText(mu)}\\,${M}_{\\rm eq} = ${numberTex(mu * M_EQ, 3)}\\,\\mathrm{kg}`
	);
	const tempTex = $derived(`T_H = ${temperatureTex(T_H)}`);
	const skyTex = $derived(
		`T_{\\rm bg} = ${sky === 'light' ? '2.7255\\,\\mathrm{K}' : temperatureTex(T_bg)}`
	);
	const discTex = $derived(`2\\sqrt{27}\\,G${M}/c^2 = ${numberTex(disc * 1e3, 3)}\\,\\mathrm{mm}`);
	const peakTex = $derived(`x = ${numberTex(peakX, 3)}`);
	const lambdaTex = $derived(`2\\pi c/\\omega = ${peakLambda.value}\\,${peakLambda.tex}`);
	const energyTex = $derived(`D = ${depthText(energy).replace('−', '-')}`);
	const countTex = $derived(`D = ${depthText(count).replace('−', '-')}`);

	const SKY_NAMES: Record<
		Sky,
		{ label: string; short: string; words: string; icon: typeof GravityIcon }
	> = {
		gravitons: {
			label: 'Gravitons, 0.905 K',
			short: 'Gravitons, 0.905 K',
			words: 'the graviton sky at 0.905 K',
			icon: GravityIcon
		},
		light: {
			label: 'Light, microwave sky, 2.7255 K',
			short: 'Light, 2.7255 K',
			words: 'the microwave sky of light at 2.7255 K, in geometric optics',
			icon: Sun03Icon
		}
	};

	const shade = (D: number) =>
		D > 0.005
			? 'darker than the sky'
			: D < -0.005
				? 'brighter than the sky'
				: 'of nearly the sky’s own grey';

	const spectrumDescription = $derived(
		`Against x = GMω/c³ from 0 to ${numberText(ext.x, 2)}, for a hole of ${massText(mu)} equilibrium masses against ${SKY_NAMES[sky].words}: ` +
			`the sky's energy per unit of x, peaking at x = ${numberText(peakX, 3)}; the hole's own spectrum n_H x³, dashed, peaking at x = 0.112 at ${numberText(holePeak(mu, sky), 3)} times the sky's peak${holeOff ? ', above the top of the scale' : ''}; ` +
			(geometric
				? 'the share of the capture disc that the hole takes, dotted, 1 at every x in geometric optics; '
				: 'the share of the capture disc that the hole takes, dotted, near 0 for long waves and rising to about 1 above x = 1; ') +
			`and, shaded, what the hole ${hotter ? 'adds to the sky, a glow' : 'takes from the sky, a shadow'}.`
	);
	const skyDescription = $derived(
		`Two copies of a uniform grey sky, each with the hole's capture disc drawn in proportion to the light it leaves: weighed in energy on the left, ${shade(energy)}${shown ? `, depth ${depthText(energy)}` : ''}; counted in quanta on the right, ${shade(count)}${shown ? `, depth ${depthText(count)}` : ''}.`
	);

	const MARKS = PAPER_MASSES.map((m) => ({
		at: stopOf(m),
		label: `${m} equilibrium masses, one of Section XI’s three holes`
	}));
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} trust />{/each}</span
	>{/snippet}

<div class="hole-against-sky">
	<section class="panel" aria-label="The sky’s spectrum and what the hole takes">
		<div class="stage">
			<p class="heading">The sky’s energy, and what the hole takes from it or adds</p>
			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={spectrumDescription}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
					</clipPath>
					<pattern
						id="{uid}-hatch"
						width={5 * u}
						height={5 * u}
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(45)"
					>
						<rect class="hatch-ground" width={5 * u} height={5 * u} />
						<line class="hatch-line" x1="0" x2="0" y1="0" y2={5 * u} />
					</pattern>
				</defs>

				<!-- the axes' titles -->
				<text class="small" x={box.L} y={box.T - 12 * u}
					><tspan class="it">n</tspan><tspan class="it">x</tspan>³, the sky’s peak = 1</text
				>
				<text class="small end" x={box.R} y={box.T - 12 * u}
					><tspan class="it">σ</tspan><tspan class="sub" dy={2.5 * u}>abs</tspan><tspan
						dy={-2.5 * u}>/27π(</tspan
					><tspan class="it">GM</tspan>/<tspan class="it">c</tspan>²)², dotted</text
				>

				<rect class="frame" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />

				{#each yTicks as t (t)}
					<line class="grid" x1={box.L} x2={box.R} y1={Y(t)} y2={Y(t)} />
					<text class="small y-tick" x={box.L - 5 * u} y={Y(t) + 3.5 * u}>{tickText(t)}</text>
				{/each}
				{#each xTicks as t (t)}
					<line class="grid" x1={X(t)} x2={X(t)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(t)} y={box.B + 15 * u}>{tickText(t)}</text>
				{/each}
				<text class="small dim end" x={box.R} y={box.B + 30 * u}
					><tspan class="it">x</tspan> = <tspan class="it">GMω</tspan>/<tspan class="it">c</tspan
					>³</text
				>

				{#if holeOff}
					<text class="fine words end" x={box.R - 6 * u} y={box.T + 14 * u}
						>the hole’s own peaks at {numberText(holePeak(mu, sky), 2)} times the sky’s</text
					>
				{/if}

				<!-- the share's own scale, on the right -->
				<line class="share-tick" x1={box.R} x2={box.R + 4 * u} y1={SY(1)} y2={SY(1)} />
				<text class="fine start" x={box.R + 6 * u} y={SY(1) + 3.5 * u}>1</text>
				<text class="fine start" x={box.R + 6 * u} y={SY(0) + 3.5 * u}>0</text>

				<g clip-path="url(#{uid}-plot)">
					<path
						class={hotter ? 'glow' : 'shadow'}
						d={removedPath}
						fill={hotter ? `url(#${uid}-hatch)` : undefined}
					/>
					<path class="share" d={sharePath} />
					<path class="hole-curve" d={holePath} />
					<path class="sky-halo" d={skyPath} />
					<path class="sky-curve" d={skyPath} />
				</g>
			</svg>

			<ul class="legend" aria-hidden="true">
				<li>
					<span class="swatch sky-key"></span><span>the sky, <Tex math={'n_{\\rm bg}x^3'} /></span>
				</li>
				<li>
					<span class="swatch hole-key"></span><span>the hole’s own, <Tex math="n_Hx^3" /></span>
				</li>
				<li>
					<span class="swatch share-key"></span>{geometric
						? 'the share taken: all of the disc, geometric optics'
						: 'the share of the capture disc taken'}
				</li>
				{#if hotter}
					<li><span class="swatch glow-key"></span>added to the sky</li>
				{:else}
					<li><span class="swatch shadow-key"></span>taken from the sky</li>
				{/if}
			</ul>
		</div>
	</section>

	<section class="panel" aria-label="The hole against a uniform sky">
		<div class="stage">
			<p class="heading">The capture disc against a uniform sky</p>
			<svg
				viewBox="0 0 {view.W} {view.H}"
				role="img"
				aria-label={skyDescription}
				{@attach fitText((value) => (v = value))}
			>
				<rect class="sky-patch" width={view.W} height={view.sky} rx={6 * v} />
				{#each discs as d (d.key)}
					<circle class="disc" cx={d.cx} cy={view.sky / 2} r={view.r} style:fill={discGrey(d.D)} />
					<circle class="edge" cx={d.cx} cy={view.sky / 2} r={view.r} />
					<text class="label mid" x={d.cx} y={view.sky + 22 * v}>{d.name}</text>
				{/each}
			</svg>
			<ul class="legend" aria-hidden="true">
				<li>
					<span class="swatch patch-key"></span><span
						>the sky, a middle grey; the disc’s light is the sky’s times <Tex math="1 - D" />, white
						from 5.6 times the sky’s</span
					>
				</li>
				<li><span class="swatch edge-key"></span>the edge of the capture disc</li>
			</ul>
		</div>
	</section>

	<div class="bar">
		<div class="slot" onkeydowncapture={pageKeys} role="presentation">
			<Slider
				id="{uid}-mass"
				label="The hole’s mass"
				icon={BlackHole01Icon}
				min={0}
				max={LAST}
				step={1}
				bind:value={() => stop, setStop}
				readout="{massText(mu)} equilibrium masses"
				ends={['0.3', '300']}
				marks={MARKS}
				marksHint="the ticks mark the masses of Section XI’s three depths"
			/>
		</div>
		<Segmented
			label="The sky"
			options={(['gravitons', 'light'] as const).map((k) => ({
				value: k,
				label: phone.current ? SKY_NAMES[k].short : SKY_NAMES[k].label,
				icon: SKY_NAMES[k].icon
			}))}
			bind:value={sky}
		/>
		<p class="hint">
			Drag the mass, in equilibrium masses <Tex
				math={`${M}_{\\rm eq} = 1.356\\times10^{23}\\,\\mathrm{kg}`}
				trust
			/>, and choose the sky. With the keyboard, reach each with Tab: the arrow keys step a
			hundredth of a power of ten, Page Up and Page Down a tenth, and Home and End go to the ends.
			The depths stay covered until you show them.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The hole</dt>
				<dd>
					{@render eq([massTex])}<span class="also">its capture disc is</span>{@render eq([
						discTex
					])}<span class="also">across</span>
				</dd>
			</div>
			<div class="row">
				<dt>The temperatures</dt>
				<dd>
					{@render eq([tempTex])}<span class="also">the hole’s;</span>{@render eq([skyTex])}<span
						class="also">the sky’s</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The sky’s peak</dt>
				<dd>
					{@render eq([peakTex])}{@render eq([lambdaTex])}<span class="also"
						>where its energy per unit of frequency is largest</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The depth</dt>
				<dd>
					{#if shown}
						<span class="depths" aria-live="polite">
							<span class="depth"><span class="also">by energy</span><Tex math={energyTex} /></span>
							<span class="depth"><span class="also">by count</span><Tex math={countTex} /></span>
						</span>
					{:else}
						<span class="also">covered: predict first</span>
					{/if}
					<button
						type="button"
						class="reveal"
						aria-pressed={shown}
						aria-label={shown ? 'Cover the depths' : 'Show the depths'}
						onclick={() => (shown = !shown)}
					>
						{#if shown}
							<HugeiconsIcon icon={ViewOffIcon} size={15} strokeWidth={1.8} />Cover
						{:else}
							<HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={1.8} />Show the depths
						{/if}
					</button>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Look first at the shaded area against the area under the sky’s curve: their ratio is the depth
		by energy, <Tex
			math={`D = \\int\\sigma_{\\rm abs}(n_{\\rm bg} - n_H)\\,x^3\\,\\mathrm{d}x\\,/\\,27\\pi(G${M}/c^2)^2\\!\\int n_{\\rm bg}\\,x^3\\,\\mathrm{d}x`}
			trust
		/>, and by count <Tex math="x^2" /> takes the place of <Tex math="x^3" />. The occupations are <Tex
			math={'n_H = 1/(e^{8\\pi x} - 1)'}
		/> and <Tex math={'n_{\\rm bg} = 1/(e^{8\\pi x T_H/T_{\\rm bg}} - 1)'} />. For gravitons <Tex
			math={'\\sigma_{\\rm abs} = (\\pi c^2/\\omega^2)\\sum(2\\ell + 1)\\Gamma_\\ell'}
		/> adds the greybody factors <Tex math="\Gamma_\ell" /> for <Tex math="\ell = 2" /> to 33, from a
		numerical solution of the Regge–Wheeler equation on 400 values of <Tex math="x" /> up to 6, read as
		straight lines between them, with the capture area beyond. Light is drawn in geometric optics only:
		the hole takes the whole capture area at every frequency, its photon greybody factors left out. Both
		curves are in units of the sky’s peak; the axes grow when the hole is hotter than the sky, to hold
		what it adds, and its own curve, before its greybody factors, may leave the top. The dotted share
		keeps its own scale, on the right. The sky’s grey below is drawn in proportion to its light, the disc’s
		brightness the sky’s times <Tex math="1 - D" />.
	</p>
</div>

<style>
	.hole-against-sky {
		/* the sky below is a picture of light, the same grey on either ground */
		--sky-grey: #767676;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panel + .panel {
		border-top: 1px solid var(--line);
	}

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
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

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 500;
		fill: var(--text);
	}

	.dim {
		fill: var(--text-faint);
	}

	.mid {
		text-anchor: middle;
	}

	.start {
		text-anchor: start;
	}

	.end {
		text-anchor: end;
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	/* words over the curves keep a halo of the ground */
	.words {
		fill: var(--text-dim);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.y-tick {
		text-anchor: end;
		font-variant-numeric: tabular-nums;
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

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the spectra and the temperatures are neutral (NOTATION.md): everything in the ink */
	.sky-curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linejoin: round;
	}

	.sky-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.8px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.hole-curve {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 75%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.share {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: round;
	}

	.share-tick {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.shadow {
		fill: color-mix(in srgb, var(--text) 30%, transparent);
		stroke: none;
	}

	.glow {
		stroke: none;
	}

	.hatch-ground {
		fill: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.hatch-line {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	/* --- the sky and its discs ---------------------------------------------------------------- */

	.sky-patch {
		fill: var(--sky-grey);
	}

	.disc {
		transition: fill 0.2s;
	}

	.edge {
		fill: none;
		stroke: rgb(255 255 255 / 0.45);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
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

	.sky-key {
		border-color: var(--text);
	}

	.hole-key {
		border-top: 1.4px dashed color-mix(in srgb, var(--text) 75%, transparent);
	}

	.share-key {
		border-top: 2px dotted color-mix(in srgb, var(--text) 60%, transparent);
	}

	.shadow-key,
	.glow-key,
	.patch-key {
		width: 0.9rem;
		height: 0.7rem;
		border: 0;
		border-radius: 2px;
	}

	.shadow-key {
		background: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.glow-key {
		background: repeating-linear-gradient(
			-45deg,
			color-mix(in srgb, var(--text) 55%, transparent) 0 1.4px,
			color-mix(in srgb, var(--text) 7%, transparent) 1.4px 3.5px
		);
	}

	.patch-key {
		background: var(--sky-grey);
	}

	.edge-key {
		width: 0.8rem;
		height: 0.8rem;
		border: 1px dashed var(--text-dim);
		border-radius: 50%;
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
		grid-template-columns: 9rem minmax(0, 1fr);
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

	.depths {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.15rem 1.4rem;
	}

	.depth {
		display: inline-flex;
		align-items: baseline;
		gap: 0.45rem;
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	.reveal {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		align-self: center;
		min-height: 2rem;
		padding: 0.25rem 0.7rem 0.25rem 0.55rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.reveal :global(svg) {
		color: var(--accent);
	}

	.reveal:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.reveal:hover {
			border-color: var(--accent);
		}
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.disc,
		.reveal {
			transition: none;
		}
	}
</style>
