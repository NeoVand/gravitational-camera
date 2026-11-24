<script lang="ts">
	/**
	 * Chapter 12.2's thermal history. One panel: against the photons' temperature T, on a scale of powers of ten from
	 * the Planck temperature on the left to today's 2.7255 K on the right, three lines of T a in units of the
	 * photons' value today, T_γ a₀: the photons' in the light colour, stepping up at each annihilation by
	 * (g*s before / g*s after)^{1/3} and ending at 1; the neutrinos' in the ink, dashed, with the photons' down to
	 * 10¹⁰ K and then flat at (4/11)^{1/3}; and the gravitons' in the field colour, flat at (3.909/g_hot)^{1/3}, hidden
	 * when inflation comes after they parted. Where lines coincide they are drawn nested, widest underneath. A dashed
	 * marker stands at the slider's temperature. One slider sets the temperature, running hot on the left like the
	 * plot; a second sets the hot count g_hot, with buttons for the Standard Model's 106.75 and twice it; a switch adds
	 * inflation. The readouts give g*s and 1 + z at the marker, the three temperatures today, and the gravitons'
	 * ΔN_eff, Ω_g and Ω_g h². The arithmetic is in ./thermal-history.ts. The chapter's try box asks the prediction, so
	 * the figure answers it in no words: it shows the live values only. Nothing moves by itself; under reduced motion
	 * the gravitons' line goes without a fade.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AbacusIcon,
		Atom01Icon,
		BalloonIcon,
		MultiplicationSignIcon,
		ThermometerIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		COUNT,
		G_SM,
		G_TWICE,
		H0,
		NU_LINE,
		OPENING,
		REVERSED,
		TEMPERATURE,
		T_NU,
		clamp,
		countOf,
		countText,
		extraText,
		gStar,
		gravitonLine,
		gravitonText,
		neutrinoLine,
		neutrinoPath,
		onePlusZ,
		photonLine,
		photonPath,
		smallTex,
		snap,
		stageText,
		stepFrom,
		temperatureOf,
		temperatureTex,
		temperatureText,
		type Scale
	} from './thermal-history';

	const uid = $props.id();

	// --- the state ----------------------------------------------------------------------------------------------------
	let logT = $state<number>(OPENING.logT);
	let gHot = $state<number>(OPENING.gHot);
	let inflation = $state<boolean>(OPENING.inflation);

	const T = $derived(temperatureOf(logT));
	const setLog = (v: number) => (logT = clamp(v, TEMPERATURE.cold, TEMPERATURE.hot));
	const setCount = (v: number) => (gHot = clamp(v, COUNT.lo, COUNT.hi));

	/** The temperature slider's ticks, in its own reversed value, −log₁₀ T. */
	const T_MARKS = [
		{ T: 1e31, label: 'T = 10³¹ K, where a graviton meets another once in 3000 expansion times' },
		{ T: 1e10, label: 'T = 10¹⁰ K, where the neutrinos decouple' },
		{ T: 2970, label: 'T = 2970 K, where the microwave sky is released' }
	].map((m) => ({ at: -Math.log10(m.T), label: m.label }));
	const T_AT = T_MARKS.map((m) => m.at);
	const C_MARKS = [
		{ at: G_SM, label: 'the Standard Model’s 106.75' },
		{ at: G_TWICE, label: 'twice the Standard Model’s, 213.5' }
	];
	const C_AT = C_MARKS.map((m) => m.at);

	/**
	 * The keys. On the temperature, the left and right arrows move the marker a hundredth of a power of ten along the
	 * plot, Up and Page Up warm it by a hundredth and by a whole power, Down and Page Down cool it, and Home and End go
	 * to the Planck temperature and today. On the count, the arrows step 0.25, the page keys 10, Home and End the ends.
	 */
	function keys(get: () => number, s: Scale, set: (v: number) => void, by: Record<string, number>) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			let next: number | undefined;
			if (e.key === 'Home') next = s.lo;
			else if (e.key === 'End') next = s.hi;
			else if (e.key in by) next = stepFrom(get(), s, by[e.key]);
			if (next === undefined) return;
			e.preventDefault();
			set(next);
		};
	}
	const pages = (s: Scale) => Math.round(s.page / s.step);
	const temperatureKeys = keys(
		() => -logT,
		REVERSED,
		(v) => setLog(-v),
		{
			ArrowRight: 1,
			ArrowDown: 1,
			ArrowLeft: -1,
			ArrowUp: -1,
			PageDown: pages(REVERSED),
			PageUp: -pages(REVERSED)
		}
	);
	const countKeys = keys(() => gHot, COUNT, setCount, {
		ArrowRight: 1,
		ArrowUp: 1,
		ArrowLeft: -1,
		ArrowDown: -1,
		PageUp: pages(COUNT),
		PageDown: -pages(COUNT)
	});

	/** The temperature slider's native value is −log₁₀ T: say the temperature to a screen reader instead. */
	const tText = $derived(temperatureText(T));
	const valueText: Attachment<HTMLElement> = (node) => {
		node.querySelector('input[type="range"]')?.setAttribute('aria-valuetext', `T = ${tText}`);
	};

	// --- the numbers --------------------------------------------------------------------------------------------------
	const g = $derived(gStar(T, gHot));
	const z1 = $derived(onePlusZ(T, gHot));
	const k = $derived(countOf(gHot, inflation));
	const yPhoton = $derived(photonLine(T, gHot));
	const yNeutrino = $derived(neutrinoLine(T, gHot));
	const yGraviton = $derived(gravitonLine(gHot));

	const markerTex = $derived([
		`T_\\gamma = ${temperatureTex(T)}`,
		`g_{*s} = ${countText(g)}`,
		`1 + z = ${smallTex(z1)}`
	]);
	const todayTex = $derived([
		'T_\\gamma = 2.7255\\,\\mathrm{K}',
		`T_\\nu = ${T_NU.toFixed(3)}\\,\\mathrm{K}`,
		k.Tg === null ? 'T_g:\\ \\text{none}' : `T_g = ${k.Tg.toPrecision(4)}\\,\\mathrm{K}`
	]);
	const energyTex = $derived([
		`\\Delta N_{\\rm eff} = ${extraText(k.dNeff)}`,
		inflation ? '\\Omega_g = 0' : `\\Omega_g = ${smallTex(k.omega)}\\ (H_0 = ${H0})`,
		`\\Omega_gh^2 = ${smallTex(k.omegaH2)}`
	]);

	// --- the drawing --------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, H: 296, L: 30, R: 298, T: 40, B: 248 }
			: { W: 680, H: 330, L: 40, R: 608, T: 40, B: 282 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const Y_TOP = 1.1;
	const f2 = (n: number) => n.toFixed(2);

	const X = (lt: number) =>
		box.L + ((TEMPERATURE.hot - lt) / (TEMPERATURE.hot - TEMPERATURE.cold)) * (box.R - box.L);
	const Y = (y: number) => box.B - (y / Y_TOP) * (box.B - box.T);
	const path = (pts: [number, number][]) =>
		pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(X(x))},${f2(Y(y))}`).join('');

	const photonD = $derived(path(photonPath(gHot, TEMPERATURE.hot, TEMPERATURE.cold)));
	const neutrinoD = $derived(path(neutrinoPath(gHot, TEMPERATURE.hot, TEMPERATURE.cold)));
	const gravitonD = $derived(
		path([
			[TEMPERATURE.hot, yGraviton],
			[TEMPERATURE.cold, yGraviton]
		])
	);

	const mx = $derived(X(clamp(Math.log10(T), TEMPERATURE.cold, TEMPERATURE.hot)));
	/** The marker's temperature over the frame, kept inside the drawing. */
	const markerLabel = $derived.by(() => {
		const w = 6.1 * (tText.length + 4) * u;
		return clamp(mx, box.L + w / 2, box.W - w / 2 - 2);
	});

	const X_LABELS = $derived(phone.current ? [30, 20, 10] : [30, 25, 20, 15, 10, 5]);
	const DECADES = Array.from({ length: 32 }, (_, i) => i + 1);
	const Y_TICKS = [0, 0.2, 0.4, 0.6, 0.8, 1];

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const description = $derived(
		`T a in units of the photons’ value today, from 0 to 1.1, against the photons’ temperature on a scale of powers of ten, from the Planck temperature, 1.42 × 10³² K, on the left to today’s 2.7255 K on the right. ` +
			`The photons’ line starts at ${yGraviton.toFixed(3)}, steps up at each annihilation and ends at 1, 2.7255 K today. ` +
			`The neutrinos’ line follows it down to 10¹⁰ K and then stays at ${NU_LINE.toFixed(3)}, 1.945 K today. ` +
			(inflation
				? 'The gravitons’ line is not drawn: inflation after they parted left none. '
				: `The gravitons’ line is flat at ${yGraviton.toFixed(3)}, ${gravitonText(k.Tg)} today. `) +
			`The marker stands at T = ${tText}, where g*s = ${countText(g)} and the lines are at ${yPhoton.toFixed(3)} for the photons and ${yNeutrino.toFixed(3)} for the neutrinos.`
	);
</script>

{#snippet power10(e: number)}10<tspan class="exp" dy={-4.5 * u}>{e}</tspan>{/snippet}

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} />{/each}</span
	>{/snippet}

<div class="thermal-history">
	<section class="panel" aria-label="The temperatures of the photons, neutrinos and gravitons">
		<div class="stage">
			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={description}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={box.L} y={box.T - 6} width={box.R - box.L} height={box.B - box.T + 12} />
					</clipPath>
				</defs>

				<!-- the vertical axis's name -->
				<text class="title" x={4} y={box.T - 24 * u}
					><tspan class="it">T a</tspan> / <tspan class="it">T</tspan><tspan
						class="sub it"
						dy={2.5 * u}>γ</tspan
					><tspan dy={-2.5 * u}>&#8202;</tspan><tspan class="it">a</tspan><tspan
						class="sub"
						dy={2.5 * u}>0</tspan
					></text
				>

				<rect class="frame" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />

				{#each Y_TICKS as y (y)}
					<line class="grid" x1={box.L} x2={box.R} y1={Y(y)} y2={Y(y)} />
					<text class="small y-tick" x={box.L - 5 * u} y={Y(y) + 3.5 * u}>{y === 0 ? '0' : y}</text>
				{/each}
				{#each X_LABELS as e (e)}
					<line class="grid" x1={X(e)} x2={X(e)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(e)} y={box.B + 16 * u}>{@render power10(e)}</text>
				{/each}
				{#each DECADES as e (e)}
					<line class="minor" x1={X(e)} x2={X(e)} y1={box.B} y2={box.B + 3 * u} />
				{/each}
				<text class="small dim" x={box.L} y={box.B + 32 * u}>← earlier, hotter</text>
				<text class="small dim end" x={box.R} y={box.B + 32 * u}
					>the photons’ temperature <tspan class="it">T</tspan>, K</text
				>

				<!-- the marker -->
				<line class="marker" x1={mx} x2={mx} y1={box.T - 4 * u} y2={box.B} />
				<text class="small words mid" x={markerLabel} y={box.T - 8 * u}
					><tspan class="it">T</tspan> = {tText}</text
				>

				<!-- the lines, nested where they coincide: the gravitons' widest, then the photons', then the
				     neutrinos' dashed on top -->
				<g clip-path="url(#{uid}-plot)">
					<path class={['graviton', { gone: inflation }]} d={gravitonD} />
					<path class="photon" d={photonD} />
					<path class="neutrino" d={neutrinoD} />
				</g>

				<circle
					class={['graviton-dot', { gone: inflation }]}
					cx={mx}
					cy={Y(yGraviton)}
					r={5.4 * u}
				/>
				<circle class="photon-dot" cx={mx} cy={Y(yPhoton)} r={3.4 * u} />
				<circle class="neutrino-dot" cx={mx} cy={Y(yNeutrino)} r={1.8 * u} />

				<!-- today's values at the right-hand end -->
				<text class="small end-value photon-ink" x={box.R + 6 * u} y={Y(1) + 3.5 * u}>2.7255 K</text
				>
				<text class="small end-value" x={box.R + 6 * u} y={Y(NU_LINE) + 3.5 * u}
					>{T_NU.toFixed(3)} K</text
				>
				<text
					class={['small end-value graviton-ink', { gone: inflation }]}
					x={box.R + 6 * u}
					y={Y(yGraviton) + 3.5 * u}>{k.Tg === null ? '' : `${k.Tg.toPrecision(3)} K`}</text
				>
			</svg>

			<ul class="legend" aria-hidden="true">
				<li><span class="swatch photon-key"></span>photons</li>
				<li><span class="swatch neutrino-key"></span>neutrinos</li>
				<li class={{ off: inflation }}>
					<span class="swatch graviton-key"></span>{inflation
						? 'gravitons: none after inflation'
						: 'gravitons'}
				</li>
				<li><span class="swatch marker-key"></span>the slider’s temperature</li>
			</ul>
		</div>
	</section>

	<div class="bar">
		<div class="slot" role="presentation" onkeydowncapture={temperatureKeys} {@attach valueText}>
			<Slider
				id="{uid}-temperature"
				label="Temperature of the photons"
				icon={ThermometerIcon}
				min={REVERSED.lo}
				max={REVERSED.hi}
				step={REVERSED.step}
				bind:value={() => -logT, (v) => setLog(-snap(v, REVERSED, T_AT))}
				readout="T = {tText}"
				ends={['1.42 × 10³² K', '2.7255 K']}
				marks={T_MARKS}
				marksHint="the ticks mark the neutrinos’ parting and the microwave sky’s release"
			/>
		</div>
		<div class="count">
			<div class="slot" role="presentation" onkeydowncapture={countKeys}>
				<Slider
					id="{uid}-count"
					label={phone.current ? 'Hot count g*ₛ' : 'Hot count g*ₛ at the gravitons’ decoupling'}
					icon={AbacusIcon}
					min={COUNT.lo}
					max={COUNT.hi}
					step={COUNT.step}
					bind:value={() => gHot, (v) => setCount(snap(v, COUNT, C_AT))}
					readout={countText(gHot)}
					ends={['106.75', '1000']}
					marks={C_MARKS}
					marksHint="the ticks mark the Standard Model and twice it"
				/>
			</div>
			<div class="actions" role="group" aria-label="Hot counts to choose">
				<button
					type="button"
					class="action"
					aria-pressed={gHot === G_SM}
					aria-label="Standard Model, 106.75"
					onclick={() => (gHot = G_SM)}
				>
					<HugeiconsIcon icon={Atom01Icon} size={15} strokeWidth={1.8} />Standard Model
				</button>
				<button
					type="button"
					class="action"
					aria-pressed={gHot === G_TWICE}
					aria-label="Twice the Standard Model, 213.5"
					onclick={() => (gHot = G_TWICE)}
				>
					<HugeiconsIcon icon={MultiplicationSignIcon} size={15} strokeWidth={1.8} />Twice
				</button>
			</div>
		</div>
		<div class="switch">
			<Toggle
				icon={BalloonIcon}
				label="Inflation after decoupling"
				bind:checked={inflation}
				hint="A fast early expansion after the gravitons parted, which thins them to nothing"
			/>
		</div>
		<p class="hint">
			Drag the photons’ temperature and the hot count, or choose a count; the switch adds inflation.
			With the keyboard, reach each with Tab. On the temperature, the left and right arrows move the
			marker a hundredth of a power of ten along the plot, Up and Page Up warm it by a hundredth and
			by a whole power, Down and Page Down cool it, and Home and End go to the Planck temperature
			and today; on the count, the arrows step 0.25 and the page keys 10.
		</p>
	</div>

	<div class="readouts" aria-live="polite">
		<dl>
			<div class="row">
				<dt>At the marker</dt>
				<dd>
					{#each markerTex as part, i (i)}{@render eq([part])}{/each}<span class="also"
						>{stageText(T)}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Today</dt>
				<dd>
					{#each todayTex as part, i (i)}{@render eq([part])}{/each}<span class="also"
						>the photons, the neutrinos and the gravitons</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The gravitons’ energy</dt>
				<dd>
					{#each energyTex as part, i (i)}{@render eq([part])}{/each}<span class="also"
						>{inflation
							? 'inflation left no gravitons to count'
							: 'in extra species of neutrino, and as shares of the critical density'}</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		The heights of the steps are exact: each is <Tex
			math={'(g_{*s}^{\\rm before}/g_{*s}^{\\rm after})^{1/3}'}
		/>, from the chapter’s counts of the Standard Model, and so are the values at the right-hand end
		and the readouts of today, with <Tex math={'T_\\gamma = 2.7255\\,\\mathrm{K}'} />, <Tex
			math={'T_\\nu = (4/11)^{1/3}T_\\gamma'}
		/> and <Tex math={'g_{*s} = 43/11 = 3.909'} /> today. The steps’ places are schematic: each is drawn
		sharp, at the temperature named for its species, while a real annihilation takes a factor of a few
		in temperature, and the neutrinos part gradually near <Tex math={'10^{10}\\,\\mathrm{K}'} />.
		Any species beyond the Standard Model are taken to annihilate with the top quark, at <Tex
			math={'2.0\\times10^{15}\\,\\mathrm{K}'}
		/>, so that the gravitons’ line meets the photons’ at the left-hand edge. <Tex
			math="\Omega_g"
		/> is scaled from <Tex math={'6.619\\times10^{-7}'} /> at 0.90507 K, with <Tex
			math={`H_0 = ${H0}\\,\\mathrm{km\\,s^{-1}\\,Mpc^{-1}}`}
		/>; <Tex math="\Omega_gh^2" /> does not depend on <Tex math="H_0" />. The
		<Tex math="1 + z" /> at the marker is exact for the stepped count drawn.
	</p>
</div>

<style>
	.thermal-history {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panel ------------------------------------------------------------------------ */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
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

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.small {
		font-size: calc(11px * var(--u, 1));
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
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		font-variant-numeric: tabular-nums;
	}

	.exp {
		font-size: 0.78em;
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

	.sub.it {
		font-size: 0.86em;
	}

	.words {
		fill: var(--text);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.end-value {
		fill: var(--text);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
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

	.minor {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.marker {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	/* the colour roles (NOTATION.md): photons in the light colour, gravitons in the field colour, neutrinos neutral */
	.graviton,
	.photon,
	.neutrino {
		fill: none;
		stroke-linejoin: round;
	}

	.graviton {
		stroke: var(--q-field);
		stroke-opacity: 0.5;
		stroke-width: calc(6px * var(--u, 1));
		stroke-linecap: round;
	}

	.photon {
		stroke: var(--q-light);
		stroke-width: calc(2.2px * var(--u, 1));
	}

	.neutrino {
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.graviton-dot {
		fill: color-mix(in srgb, var(--q-field) 55%, var(--bg-sunken));
	}

	.photon-dot {
		fill: var(--q-light);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.neutrino-dot {
		fill: var(--text);
	}

	.photon-ink {
		fill: var(--q-light);
	}

	.graviton-ink {
		fill: var(--q-field);
	}

	.graviton,
	.graviton-dot,
	.graviton-ink {
		transition: opacity 0.3s;
	}

	.gone {
		opacity: 0;
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

	.legend li.off {
		color: var(--text-faint);
	}

	.swatch {
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 2px solid;
	}

	.photon-key {
		border-color: var(--q-light);
	}

	.neutrino-key {
		border-top: 1.4px dashed var(--text);
	}

	.graviton-key {
		height: 6px;
		border: 0;
		border-radius: 3px;
		background: color-mix(in srgb, var(--q-field) 50%, transparent);
	}

	.off .graviton-key {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.marker-key {
		width: 0;
		height: 0.8rem;
		border-top: 0;
		border-left: 1px dashed color-mix(in srgb, var(--text) 55%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.8rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slot {
		min-width: 0;
	}

	.count {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.6rem 1.1rem;
		align-items: center;
	}

	.actions {
		display: flex;
		gap: 0.4rem;
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		min-height: 2.2rem;
		padding: 0.3rem 0.7rem 0.3rem 0.55rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background-color 0.15s;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	.action[aria-pressed='true'] {
		border-color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.action[aria-pressed='false']:hover {
			border-color: var(--accent);
		}
	}

	.switch {
		max-width: 20rem;
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
		gap: 0.15rem 0.9rem;
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.count {
			grid-template-columns: minmax(0, 1fr);
		}

		.switch {
			max-width: none;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.graviton,
		.graviton-dot,
		.graviton-ink,
		.action {
			transition: none;
		}
	}
</style>
