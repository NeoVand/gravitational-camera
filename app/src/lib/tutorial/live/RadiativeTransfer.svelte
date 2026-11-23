<script lang="ts">
	/**
	 * Chapter 5.5's slab in front of a background. On the left a background, a tall rectangle whose grey follows its
	 * radiance I_bg; in the middle a slab, a band whose grey follows its Planck radiance B and whose opacity follows
	 * 1 − e^{−τ}; on the right a pixel, filled with the grey of what it receives. Beside the pixel one bar, linear,
	 * of what it receives, I = I_bg e^{−τ} + B(1 − e^{−τ}), in two stacked parts: the background's share in the
	 * paper's blue and the slab's glow in its orange, as chapter 5.5's slab diagram draws them; a thin line marks the
	 * background alone, I_bg, and a dotted one the slab's own B. Three sliders set τ on a scale of powers of ten from
	 * 10⁻³⁷ to 10², and the slab's and the background's temperatures; two presets set fog in light and steel in
	 * gravity. The radiances are Planck's at ħω = 2.82 k_B × 300 K, from ./radiative-transfer.ts, which keeps the
	 * change of a slab of τ = 10⁻³⁷ without subtracting. Two predictions at the top are answered once the reader has
	 * done what they ask. Nothing moves by itself, so reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CloudFogIcon,
		GravityIcon,
		Layers01Icon,
		ThermometerIcon,
		ThermometerWarmIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		EARTH_TAU,
		OMEGA,
		OPENING,
		PRESETS,
		PRESET_ORDER,
		STEEL_TAU,
		TAU,
		TEMPERATURE,
		THICK,
		THIN,
		X_REF,
		T_REF,
		grey,
		hidesNothing,
		numberTex,
		numberText,
		percent,
		presetOf,
		reading,
		type PresetName
	} from './radiative-transfer';

	const uid = $props.id();

	// --- the slab and the background --------------------------------------------------------------------------------
	let tau = $state(OPENING.tau);
	let slab = $state(OPENING.slab);
	let bg = $state(OPENING.bg);

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	/** A slider's value, kept on its steps but for the values a preset or a tick sets exactly. */
	const onStep = (v: number, s: number) => Number((Math.round(v / s) * s).toFixed(6));

	function setTau(log: number) {
		tau = 10 ** clamp(log, TAU.low, TAU.high);
		note();
	}

	function setSlab(T: number) {
		slab = Math.round(clamp(T, TEMPERATURE.low, TEMPERATURE.high));
		note();
	}

	function setBg(T: number) {
		bg = Math.round(clamp(T, TEMPERATURE.low, TEMPERATURE.high));
		note();
	}

	function choose(p: PresetName) {
		tau = PRESETS[p].tau;
		slab = PRESETS[p].slab;
		bg = PRESETS[p].bg;
		note();
	}

	/** The page keys move a slider by its larger step. */
	function pageKeys(get: () => number, set: (v: number) => void, s: number, page: number) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
			e.preventDefault();
			set(onStep(get() + (e.key === 'PageUp' ? page : -page), s));
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let unchanged = $state(false);
	let unhidden = $state(false);
	const revealed = $derived(step === 1 ? unchanged : unhidden);
	/** The depths seen since the two temperatures were last made equal: transparent and opaque. */
	let seen = { thin: false, thick: false };

	function note() {
		if (slab !== bg) {
			seen = { thin: false, thick: false };
		} else {
			if (tau <= THIN) seen.thin = true;
			if (tau >= THICK) seen.thick = true;
			if (step === 1 && seen.thin && seen.thick) unchanged = true;
		}
		if (step === 2 && hidesNothing({ tau, slab, bg })) unhidden = true;
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const r = $derived(reading(tau, slab, bg));
	const preset = $derived(presetOf({ tau, slab, bg }));
	/** The two depths of the first answer, at the temperature shown. */
	const thinR = $derived(reading(THIN, bg, bg));
	const thickR = $derived(reading(THICK, bg, bg));

	const UNIT = '\\,\\mathrm{W\\,m^{-2}\\,sr^{-1}\\,s}';
	const IBG = 'I_{\\mathrm{bg}}';
	const TS = 'T_{\\mathrm{slab}}';
	const TB = 'T_{\\mathrm{bg}}';

	/** e^{−τ} as the reader can tell it from one: "1 − 1.2 × 10^{−37}" when it is that close. */
	const tTex = $derived(r.q < 1e-3 ? `1 - ${numberTex(r.q)}` : numberTex(r.t, 3));
	/** 1 − e^{−τ} likewise: "1 − 1.3 × 10^{−14}" when the slab is that opaque. */
	const qTex = $derived(r.t < 1e-3 ? `1 - ${numberTex(r.t)}` : numberTex(r.q, r.q < 1e-3 ? 2 : 3));
	const tauTex = $derived(numberTex(tau));
	/** I_bg(1 ± d), for a change too small to show in I's own figures. */
	const tiny = $derived(r.change !== 0 && Math.abs(r.change) < 5e-4);
	/* each readout's formula in pieces, so that a narrow column can break it between them */
	const pixelTex = $derived([
		`I = ${IBG}e^{-\\tau} + B(1 - e^{-\\tau})`,
		`= ${numberTex(r.I, 3)}${UNIT}`,
		...(tiny ? [`= ${IBG}\\,(1 ${r.change < 0 ? '-' : '+'} ${numberTex(Math.abs(r.change))})`] : [])
	]);
	const changeTex = $derived([
		`\\dfrac{I - ${IBG}}{${IBG}}`,
		`= \\Bigl(\\dfrac{B}{${IBG}} - 1\\Bigr)(1 - e^{-\\tau})`,
		...(r.contrast === 0
			? ['= 0']
			: [`= (${numberTex(r.contrast, 3)})(${qTex})`, `= ${numberTex(r.change)}`])
	]);

	/** How deep the slab is, in the chapter's words. */
	const depth = $derived(tau >= 3 ? 'thick' : tau <= 0.1 ? 'thin' : 'between');

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? {
					W: 360,
					H: 296,
					top: 44,
					bot: 250,
					bg: [8, 62],
					slab: [120, 160],
					pixel: 214,
					size: 14,
					cone: 26,
					bar: [278, 302],
					reach: 8,
					narrow: true
				}
			: {
					W: 680,
					H: 296,
					top: 44,
					bot: 250,
					bg: [24, 124],
					slab: [236, 306],
					pixel: 430,
					size: 18,
					cone: 38,
					bar: [540, 580],
					reach: 12,
					narrow: false
				}
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const mid = $derived((box.top + box.bot) / 2);

	/** The bar: linear, its full height the larger of I_bg and B, which I never exceeds. */
	const scale = $derived(Math.max(r.bg, r.B));
	const barTop = $derived(box.top + 14);
	const barH = $derived(box.bot - barTop);
	const Y = (v: number) => box.bot - (v / scale) * barH;
	const yI = $derived(Y(r.I));
	const yShare = $derived(Y(r.bgShare));
	const yBg = $derived(Y(r.bg));
	const yB = $derived(Y(r.B));
	/** The gap between the bar's top and the line, |I − I_bg|, in CSS pixels, from the change kept apart. */
	const gapPx = $derived(((Math.abs(r.change) * r.bg) / scale) * (barH / u));
	const barX = $derived((box.bar[0] + box.bar[1]) / 2);

	const pixelLeft = $derived(box.pixel - box.size / 2);
	/** The two arrows on the line of sight: between the background and the slab, and the slab and the pixel. */
	const arrows = $derived([
		(box.bg[1] + box.slab[0]) / 2,
		(box.slab[1] + pixelLeft - box.cone) / 2
	]);
	const arrow = (x: number) =>
		`M${f2(x - 4 * u)},${f2(mid - 3.6 * u)}L${f2(x + 3 * u)},${f2(mid)}L${f2(x - 4 * u)},${f2(mid + 3.6 * u)}Z`;

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const description = $derived(
		`A background at ${bg} kelvin, of radiance ${numberText(r.bg, 3)}, seen through a slab at ${slab} kelvin of optical depth ${numberText(tau)}, whose own radiance B is ${numberText(r.B, 3)}, in watts per square metre per steradian per unit of angular frequency. ` +
			`The pixel receives ${numberText(r.I, 3)}: the background's share ${numberText(r.bgShare, 3)} and the slab's glow ${numberText(r.glowShare, 3)}. ` +
			`Its relative change from the background alone is ${numberText(r.change)}.`
	);

	const PRESET_NAMES: Record<PresetName, { label: string; icon: typeof CloudFogIcon }> = {
		fog: { label: 'Fog in light', icon: CloudFogIcon },
		steel: { label: 'Steel in gravity', icon: GravityIcon }
	};
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
			/>{/each}</span
	>{/snippet}

<div class="radiative-transfer">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Set the slab as warm as the background. What does the pixel see as you thicken it from
				transparent to opaque?
			{:else}
				In gravity, with <Tex math={'\\tau = 10^{-30}'} />, can a cold slab hide a hot body behind
				it?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>No change at all: the pixel receives <Tex math={`I = ${IBG}`} /> at every <Tex
						math="\tau"
					/>.</strong
				>
				At <Tex math={`${TS} = ${TB} = ${bg}\\,\\mathrm{K}`} />, the slab’s <Tex math="B" /> equals
				<Tex math={IBG} />, so the change <Tex math={`(B - ${IBG})(1 - e^{-\\tau})`} /> is zero whatever
				<Tex math="\tau" />. The bar’s two parts trade places while its top stays on the line: at <Tex
					math={`\\tau = ${THIN}`}
				/> the background’s share is {percent(thinR.t)} of it and the slab’s glow {percent(
					thinR.q
				)}; at <Tex math={`\\tau = ${THICK}`} /> they are {percent(thickR.t)} and {percent(
					thickR.q
				)}. The slab hides the background and shows in its place a glow exactly as bright. Now warm
				the slab, or cool it.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong
					>No: it dims the background by the fraction <Tex
						math={`1 - e^{-\\tau} = ${qTex}`}
					/>.</strong
				>
				It takes that share of the hot body’s radiance and adds back its own glow, whose <Tex
					math="B"
				/> is {percent(r.B / r.bg)} of <Tex math={IBG} />, so that <Tex
					math={`(I - ${IBG})/${IBG} = ${numberTex(r.change)}`}
				/>. On the bar, {Math.round(barH / u)} pixels tall, the gap between its top and the line is
				<Tex math={numberTex(gapPx)} /> of a pixel, far below the width of a line. To hide what lies behind
				it a slab needs <Tex math="\tau" /> near one or more, and a line of sight through the whole Earth
				has only <Tex math={`\\tau = ${numberTex(EARTH_TAU)}`} />.
			{:else if step === 1}
				The answer appears once you have set the two temperatures equal and, keeping them so, moved <Tex
					math="\tau"
				/> to <Tex math={String(THIN)} /> or less and to <Tex math={String(THICK)} /> or more.
			{:else}
				The answer appears once you have set the slab colder than the background and <Tex
					math="\tau"
				/> at about <Tex math={'10^{-30}'} /> or less.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<!-- the line of sight, from the background through the slab to the pixel -->
			<line class="ray" x1={box.bg[1]} x2={pixelLeft} y1={mid} y2={mid} />
			{#each arrows as x (x)}
				<path class="arrow" d={arrow(x)} />
			{/each}

			<!-- the background -->
			<text class="small label" x={(box.bg[0] + box.bg[1]) / 2} y={box.top - 10 * u}
				>background</text
			>
			<rect
				class="body"
				x={box.bg[0]}
				y={box.top}
				width={box.bg[1] - box.bg[0]}
				height={box.bot - box.top}
				fill={grey(r.bg)}
			/>
			<text
				class={['small value', { start: box.narrow }]}
				x={box.narrow ? box.bg[0] : (box.bg[0] + box.bg[1]) / 2}
				y={box.bot + 17 * u}
				><tspan class="it">T</tspan><tspan class="sub" dy={2.5 * u}>bg</tspan><tspan dy={-2.5 * u}
					>&nbsp;= {bg} K</tspan
				></text
			>

			<!-- the slab: the background seen through it, and over that its own grey, laid on as opaquely as it absorbs,
			     so that a transparent slab shows the background and an opaque one its own glow; its outline always -->
			<text class="small label" x={(box.slab[0] + box.slab[1]) / 2} y={box.top - 10 * u}>slab</text>
			<rect
				x={box.slab[0]}
				y={box.top}
				width={box.slab[1] - box.slab[0]}
				height={box.bot - box.top}
				fill={grey(r.bg)}
			/>
			<rect
				x={box.slab[0]}
				y={box.top}
				width={box.slab[1] - box.slab[0]}
				height={box.bot - box.top}
				fill={grey(r.B)}
				fill-opacity={r.q}
			/>
			<rect
				class="outline"
				x={box.slab[0]}
				y={box.top}
				width={box.slab[1] - box.slab[0]}
				height={box.bot - box.top}
			/>
			<text class="small value" x={(box.slab[0] + box.slab[1]) / 2} y={box.bot + 17 * u}
				><tspan class="it">T</tspan><tspan class="sub" dy={2.5 * u}>slab</tspan><tspan dy={-2.5 * u}
					>&nbsp;= {slab} K</tspan
				></text
			>
			<text class="small value" x={(box.slab[0] + box.slab[1]) / 2} y={box.bot + 33 * u}
				><tspan class="it">τ</tspan> = {numberText(tau)}</text
			>

			<!-- the pixel, filled with what it receives, and its cone of directions -->
			<path
				class="cone"
				d="M{f2(pixelLeft - box.cone)},{f2(mid - box.reach)}L{f2(pixelLeft)},{f2(mid)}L{f2(
					pixelLeft - box.cone
				)},{f2(mid + box.reach)}"
			/>
			<rect
				class="pixel"
				x={pixelLeft}
				y={mid - box.size / 2}
				width={box.size}
				height={box.size}
				fill={grey(r.I)}
			/>
			<text class="small label" x={box.pixel} y={mid - box.size / 2 - 9 * u}>pixel</text>

			<!-- the bar of what the pixel receives -->
			<text
				class={['small label', { end: box.narrow }]}
				x={box.narrow ? box.W - 2 : barX}
				y={box.top - 10 * u}>the pixel receives <tspan class="it">I</tspan></text
			>
			{#if box.bot - yShare > 0}
				<rect
					class="share-bg"
					x={box.bar[0]}
					y={yShare}
					width={box.bar[1] - box.bar[0]}
					height={box.bot - yShare}
				/>
			{/if}
			{#if yShare - yI > 0}
				<rect
					class="share-glow"
					x={box.bar[0]}
					y={yI}
					width={box.bar[1] - box.bar[0]}
					height={yShare - yI}
				/>
			{/if}
			<line
				class="base"
				x1={box.bar[0] - 10 * u}
				x2={box.bar[1] + 10 * u}
				y1={box.bot}
				y2={box.bot}
			/>
			<line class="level-b" x1={box.bar[0] - 10 * u} x2={box.bar[1] + 10 * u} y1={yB} y2={yB} />
			<line class="level-bg" x1={box.bar[0] - 10 * u} x2={box.bar[1] + 10 * u} y1={yBg} y2={yBg} />
			<text class="small words end" x={box.bar[0] - 13 * u} y={yB + 4 * u}
				><tspan class="it">B</tspan></text
			>
			<text class="small words" x={box.bar[1] + 13 * u} y={yBg + 4 * u}
				><tspan class="it">I</tspan><tspan class="sub" dy={2.5 * u}>bg</tspan></text
			>
			<text class="small dim" x={barX} y={box.bot + 17 * u}>0</text>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch bg-key"></span>the background’s share, <Tex
					math={`${IBG}\\,e^{-\\tau}`}
				/>
			</li>
			<li>
				<span class="swatch glow-key"></span>the slab’s glow, <Tex math={'B(1 - e^{-\\tau})'} />
			</li>
			<li><span class="swatch line-key"></span>the background alone, <Tex math={IBG} /></li>
			<li><span class="swatch b-key"></span>the slab’s own radiance, <Tex math="B" /></li>
		</ul>
	</div>

	<div class="bar">
		<div class="presets" role="group" aria-label="Presets">
			{#each PRESET_ORDER as p (p)}
				<button type="button" aria-pressed={preset === p} onclick={() => choose(p)}>
					<HugeiconsIcon icon={PRESET_NAMES[p].icon} size={16} strokeWidth={1.7} />
					{PRESET_NAMES[p].label}
				</button>
			{/each}
		</div>
		<div class="sliders">
			<div
				onkeydowncapture={pageKeys(() => Math.log10(tau), setTau, TAU.step, TAU.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-tau"
					label="Optical depth"
					icon={Layers01Icon}
					min={TAU.low}
					max={TAU.high}
					step={TAU.step}
					bind:value={() => Math.log10(tau), setTau}
					readout="τ = {numberText(tau)}"
					ends={['10⁻³⁷', '10²']}
					marks={[
						{
							at: Math.log10(STEEL_TAU),
							label: 'τ = 1.2 × 10⁻³⁷, a metre of the placeholder’s matter'
						},
						{ at: Math.log10(EARTH_TAU), label: 'τ = 1.6 × 10⁻³⁰, the Earth’s diameter of it' },
						{ at: 0, label: 'τ = 1, optical depth one' }
					]}
					marksHint="the ticks mark a metre of matter in gravity, the Earth’s diameter, and τ = 1"
				/>
			</div>
			<div
				onkeydowncapture={pageKeys(() => slab, setSlab, TEMPERATURE.step, TEMPERATURE.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-slab"
					label="Slab"
					icon={ThermometerWarmIcon}
					min={TEMPERATURE.low}
					max={TEMPERATURE.high}
					step={TEMPERATURE.step}
					bind:value={() => slab, setSlab}
					readout="{slab} K"
					ends={['50 K', '3000 K']}
					marks={[
						{ at: 293, label: 'T = 293 K, the chapter’s room' },
						{ at: 1500, label: 'T = 1500 K, the furnace’s hot block' }
					]}
					marksHint="the ticks mark the chapter’s 293 K and the hot block’s 1500 K"
				/>
			</div>
			<div
				onkeydowncapture={pageKeys(() => bg, setBg, TEMPERATURE.step, TEMPERATURE.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-bg"
					label="Background"
					icon={ThermometerIcon}
					min={TEMPERATURE.low}
					max={TEMPERATURE.high}
					step={TEMPERATURE.step}
					bind:value={() => bg, setBg}
					readout="{bg} K"
					ends={['50 K', '3000 K']}
					marks={[
						{ at: 293, label: 'T = 293 K, the chapter’s room' },
						{ at: 1500, label: 'T = 1500 K, the furnace’s hot block' }
					]}
					marksHint="the ticks mark the chapter’s 293 K and the hot block’s 1500 K"
				/>
			</div>
		</div>
		<p class="hint">
			Choose a preset, or drag the sliders. With the keyboard, reach each with Tab: the arrow keys
			step a tenth of a power of ten in <Tex math="\tau" /> and a kelvin in each temperature, and Page
			Up and Page Down a power of ten in <Tex math="\tau" /> and 100 K in each temperature.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The slab</dt>
				<dd>
					{@render eq([`\\tau = ${tauTex},\\quad`, `e^{-\\tau} = ${tTex}`])}<span class="also"
						>It lets through the share <Tex math={'e^{-\\tau}'} /> of the background and takes away the
						share <Tex math={`1 - e^{-\\tau} = ${qTex}`} />. {#if depth === 'thick'}It is optically
							thick: it hides what lies behind it and shows its own glow.{:else if depth === 'thin'}It
							is optically thin: it passes the background almost whole and adds about <Tex
								math="\tau B"
							/> of its own.{:else}It is neither thick nor thin.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The background</dt>
				<dd>
					{@render eq([`${IBG} = B_\\omega(${TB})`, `= ${numberTex(r.bg, 3)}${UNIT}`])}<span
						class="also">The Planck radiance at <Tex math={`${TB} = ${bg}\\,\\mathrm{K}`} />.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The slab’s radiance</dt>
				<dd>
					{@render eq([`B = B_\\omega(${TS})`, `= ${numberTex(r.B, 3)}${UNIT}`])}<span class="also"
						>The Planck radiance at <Tex math={`${TS} = ${slab}\\,\\mathrm{K}`} />: by Kirchhoff’s
						law, the radiance <Tex math="j_\omega/\alpha" /> of a thick slab.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The pixel</dt>
				<dd>
					{@render eq(pixelTex)}<span class="also"
						>{#if tiny}To three figures this is <Tex math={IBG} />: the change is too small to show
							here, and is shown apart, below.{:else}The top of the bar.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The change</dt>
				<dd>
					{@render eq(changeTex)}<span class="also"
						>{#if r.contrast === 0}The slab is as warm as its background, so it cannot be seen,
							whatever its depth.{:else if r.contrast > 0}The slab is warmer than its background and
							shows bright against it.{:else}The slab is cooler than its background and shows dark
							against it.{/if}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Every radiance is taken at the one angular frequency <Tex
				math={`\\omega = ${numberTex(OMEGA, 3)}\\,\\mathrm{s^{-1}}`}
			/>, where <Tex math={`\\hbar\\omega = ${X_REF}\\,k_B \\times ${T_REF}\\,\\mathrm{K}`} />, near
			the peak of the glow at 300 K, so the subscript <Tex math="\omega" /> is left off <Tex
				math="I"
			/>; each is in W m⁻² sr⁻¹ per s⁻¹, written <Tex
				math={'\\mathrm{W\\,m^{-2}\\,sr^{-1}\\,s}'}
			/>. Planck’s law is the same for light, which also has two polarizations. The greys of the
			background, the slab and the pixel grow with their radiance: each radiance is shown in the
			grey of the temperature whose Planck radiance it is, from 50 K, near black, to 3000 K, near
			white, on a scale of powers of ten in the temperature. The slab shows the background’s grey
			with its own laid over it at the opacity <Tex math={'1 - e^{-\\tau}'} />. The bar is linear,
			and its full height is the larger of <Tex math={IBG} /> and <Tex math="B" />. Below <Tex
				math={'\\tau \\approx 10^{-16}'}
			/>
			the change is smaller than the rounding of the numbers, so it is computed as <Tex
				math={`(B/${IBG} - 1)(1 - e^{-\\tau})`}
			/>, never by subtracting. Everything is exact.
		</p>
	</div>
</div>

<style>
	.radiative-transfer {
		/* the two shares' colours: the background's blue and the slab's glow orange, as in chapter 5.5's slab
		   diagram and the near and wave parts of chapter 5.2's figure, so the chapter speaks one colour language */
		--share-bg: var(--accent-2);
		--share-glow: var(--accent);
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the predictions ---------------------------------------------------------------- */

	.predict {
		padding: 0.75rem 0.9rem 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.steps {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.35rem;
	}

	.tag {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.pick {
		display: inline-flex;
		gap: 3px;
		padding: 2px;
		border-radius: 9px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.pick button {
		min-width: 1.9rem;
		min-height: 1.7rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.78rem/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}

	.pick button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.pick button:focus-visible,
	.next:focus-visible,
	.presets button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.predict p {
		margin: 0;
		text-wrap: pretty;
	}

	.question {
		font: 500 0.9rem/1.45 var(--font-sans);
	}

	.answer {
		margin-top: 0.3rem !important;
		font: 400 0.8rem/1.5 var(--font-sans);
		color: var(--text-faint);
	}

	.answer.shown {
		color: var(--text-dim);
	}

	.answer strong {
		color: var(--text);
		font-weight: 600;
	}

	.next {
		margin-left: 0.3rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		cursor: pointer;
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
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
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.label,
	.value {
		text-anchor: middle;
	}

	.label {
		fill: var(--text);
		font-weight: 500;
	}

	.value {
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
		text-anchor: middle;
	}

	/* after the classes that centre their words, so that these win */
	.start {
		text-anchor: start;
	}

	.end {
		text-anchor: end;
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

	.words {
		fill: var(--text);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ray {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.arrow {
		fill: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.body,
	.pixel {
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pixel {
		stroke: var(--text);
	}

	.outline {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.cone {
		fill: color-mix(in srgb, var(--text) 8%, transparent);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.share-bg {
		fill: color-mix(in srgb, var(--share-bg) 80%, transparent);
	}

	.share-glow {
		fill: color-mix(in srgb, var(--share-glow) 85%, transparent);
	}

	.base {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.level-bg {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.level-b {
		stroke: color-mix(in srgb, var(--text) 65%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: round;
	}

	/* --- the legend ------------------------------------------------------------------------- */

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
		border-top: 1.5px solid;
	}

	.bg-key,
	.glow-key {
		width: 0.9rem;
		height: 0.7rem;
		border: 0;
		border-radius: 2px;
	}

	.bg-key {
		background: color-mix(in srgb, var(--share-bg) 80%, transparent);
	}

	.glow-key {
		background: color-mix(in srgb, var(--share-glow) 85%, transparent);
	}

	.line-key {
		border-color: var(--text);
	}

	.b-key {
		border-top: 1.5px dotted color-mix(in srgb, var(--text) 65%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.presets button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2rem;
		padding: 0.3rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.76rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.presets button[aria-pressed='true'] :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.presets button[aria-pressed='false']:hover {
			color: var(--text);
		}
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
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
		grid-template-columns: 8.5rem minmax(0, 1fr);
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
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
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
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.presets button {
			flex-direction: column;
			gap: 0.2rem;
			padding: 0.35rem 0.25rem;
			text-align: center;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.presets button {
			transition: none;
		}
	}
</style>
