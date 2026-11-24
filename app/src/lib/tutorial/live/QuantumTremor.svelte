<script lang="ts">
	/**
	 * Chapter 8.7's quantum tremor, in two panels on an exact engine. Left: the symmetrized spectrum S̄ = ħ coth(ħω/2k_BT)
	 * Im χ of a body of up to five damped modes against ω on a linear axis, thick ink, with the classical 2k_BT Im χ/ω
	 * dashed grey; a switch makes the axis two-sided and adds the unsymmetrized S(ω) as a thin line, the absorption at
	 * positive frequencies and the emission S(−ω) at negative ones, whose average is S̄. Right: a small log plot of the
	 * static jitter between its two bounds against the temperature, with a stop at absolute zero and a dot at the
	 * slider's value. The jitter is drawn over the temperatures visited since the body was chosen, and everywhere once
	 * both predictions are answered, so that the figure never shows an answer before the reader has done what its
	 * prediction asks. The arithmetic is in ./quantum-tremor.ts. Opens on five modes an octave apart at k_BT = ħω₁.
	 * Nothing moves by itself.
	 */
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowLeftRightIcon,
		DiceFaces03Icon,
		Link02Icon,
		MusicNote01Icon,
		RefreshIcon,
		SphereIcon,
		ThermometerIcon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BALL,
		BOUNDS_AXES,
		DAMPING,
		HBAR,
		KB,
		OPENING,
		PRESETS,
		PRESET_NAMES,
		TEMPERATURE,
		bodyOf,
		boundCurves,
		classical,
		generator,
		isZero,
		kelvinWords,
		linearAxis,
		noteFirst,
		noteSecond,
		powerTex,
		randomModes,
		ratioWords,
		reading,
		snapTemperature,
		spanAt,
		spectrumSamples,
		stepTemperature,
		strongest,
		symmetrized,
		thetaOf,
		thetaWords,
		three,
		unsymmetrized,
		widen,
		within,
		type Mode,
		type Preset,
		type Span
	} from './quantum-tremor';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	/** The random modes: seed 1 on the server and at hydration, seeded afresh once the page is the reader's. */
	let random = generator(1);
	onMount(() => {
		random = generator(crypto.getRandomValues(new Uint32Array(1))[0]);
	});
	let drawn = $state.raw<Mode[]>(randomModes(random));

	let preset = $state<Preset>(OPENING.preset);
	/** The temperature slider's value: log₁₀(k_BT/ħω₁), or TEMPERATURE.zero for absolute zero. */
	let t = $state(OPENING.t);
	let both = $state(false);

	const body = $derived(bodyOf(preset, drawn));
	const theta = $derived(thetaOf(t));
	const zero = $derived(isZero(t));

	function setPreset(p: Preset) {
		if (p === preset) return;
		preset = p;
		span = spanAt(t);
		note();
	}
	function drawNew() {
		drawn = randomModes(random);
		preset = 'random';
		span = spanAt(t);
		note();
	}
	function setT(v: number) {
		const next = snapTemperature(v);
		if (next === t) return;
		t = next;
		span = widen(span, t);
		note();
	}
	function reset() {
		preset = OPENING.preset;
		t = OPENING.t;
		both = false;
		span = spanAt(t);
		note();
	}

	/** On the slider the arrow keys step onto its grid and onto the stop at zero. */
	function sliderKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const next = stepTemperature(t, e.key, e.shiftKey);
		if (next === undefined) return;
		e.preventDefault();
		setT(next);
	}

	/** On the switch the arrow keys choose the next body, Home and End the first and the last. */
	function presetKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLButtonElement)) return;
		const i = PRESETS.indexOf(preset);
		const next =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? Math.min(PRESETS.length - 1, i + 1)
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? Math.max(0, i - 1)
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? PRESETS.length - 1
							: undefined;
		if (next === undefined) return;
		e.preventDefault();
		setPreset(PRESETS[next]);
		(e.currentTarget as HTMLElement).querySelectorAll('button')[next]?.focus();
	}

	/** Anywhere in the figure the number keys 1 to 5 choose a body. */
	function numberKeys(e: KeyboardEvent) {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		const k = Number(e.key);
		if (!Number.isInteger(k) || k < 1 || k > PRESETS.length || e.key.length !== 1) return;
		e.preventDefault();
		setPreset(PRESETS[k - 1]);
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	/** The temperatures visited since the body was chosen. */
	let span = $state.raw<Span>(spanAt(OPENING.t));
	const revealed = $derived(step === 1 ? first : second);
	/** Once both are answered, the jitter is drawn at every temperature. */
	const everywhere = $derived(first && second);

	function note() {
		first = noteFirst(first, t);
		second = noteSecond(second, preset, span);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const r = $derived(reading(body, theta));
	const curves = $derived(boundCurves(body.modes));
	const line = $derived(strongest(body.modes));
	const physical = $derived(body.units);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const f2 = (n: number) => n.toFixed(2);
	const path = (pts: { x: number; y: number }[]) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`).join('');

	// the left panel: the spectrum, on a linear axis
	const L = $derived(
		phone.current
			? { W: 400, H: 290, x0: 44, x1: 390, y0: 40, y1: 236 }
			: { W: 420, H: 290, x0: 46, x1: 410, y0: 40, y1: 236 }
	);
	const range = $derived({ a: both ? -body.most : 0, b: body.most });
	const ws = $derived(spectrumSamples(body.modes, range.a, range.b));
	const spectra = $derived(
		ws.map((w) => ({
			w,
			sbar: symmetrized(body.modes, w, theta),
			cl: classical(body.modes, w, theta),
			s: both ? unsymmetrized(body.modes, w, theta) : 0
		}))
	);
	const peak = $derived(spectra.reduce((m, p) => Math.max(m, p.sbar, p.s), 0));
	const yAxis = $derived(linearAxis(peak));
	const sx = (w: number) => L.x0 + ((w - range.a) / (range.b - range.a)) * (L.x1 - L.x0);
	const sy = (v: number) => L.y1 - (v / yAxis.top) * (L.y1 - L.y0);
	const sbarLine = $derived(path(spectra.map((p) => ({ x: sx(p.w), y: sy(p.sbar) }))));
	const classicalLine = $derived(path(spectra.map((p) => ({ x: sx(p.w), y: sy(p.cl) }))));
	const sLine = $derived(both ? path(spectra.map((p) => ({ x: sx(p.w), y: sy(p.s) }))) : '');
	const xTicks = $derived.by(() => {
		const half = linearAxis(body.most, phone.current ? 3 : 4).ticks.filter(
			(v) => v <= body.most + 1e-9
		);
		return both
			? [
					...half
						.slice(1)
						.map((v) => -v)
						.reverse(),
					...half
				]
			: half;
	});
	const tickWords = (v: number) => (v < 0 ? `−${three(-v)}` : three(v));

	// the right panel: the jitter and its bounds, on log axes, with absolute zero in a column of its own
	const B = $derived(
		phone.current
			? { W: 400, H: 270, z: 52, x0: 84, x1: 388, y0: 40, y1: 222 }
			: { W: 300, H: 290, z: 48, x0: 78, x1: 290, y0: 40, y1: 236 }
	);
	const [TLO, THI] = BOUNDS_AXES.t;
	const [YLO, YHI] = BOUNDS_AXES.y;
	const bx = (v: number) => (isZero(v) ? B.z : B.x0 + ((v - TLO) / (THI - TLO)) * (B.x1 - B.x0));
	const by = (y: number) =>
		B.y1 -
		((Math.log10(Math.max(y, YLO / 10)) - Math.log10(YLO)) / (Math.log10(YHI) - Math.log10(YLO))) *
			(B.y1 - B.y0);
	const upperLine = $derived(path(curves.points.map((p) => ({ x: bx(p.t), y: by(p.upper) }))));
	const lowerLine = $derived(
		path(curves.points.map((p) => ({ x: bx(p.t), y: by(Math.max(p.lower, YLO)) })))
	);
	const traced = $derived(
		everywhere ? curves.points : curves.points.filter((p) => within(span, p.t))
	);
	const jitterLine = $derived(
		traced.length > 1 ? path(traced.map((p) => ({ x: bx(p.t), y: by(p.jitter) }))) : ''
	);
	const zeroShown = $derived(everywhere || isZero(span.low));
	const dot = $derived({ x: bx(t), y: by(r.jitter) });
	const decades = [-2, -1, 0, 1, 2];
	const minor = [2, 3, 5, 20, 30, 50, 200, 300, 500, 2000, 3000, 5000]
		.map((k) => Math.log10(k) - 3)
		.filter((v) => v > TLO && v < THI);
	const yDecades = [-2, -1, 0, 1, 2];
	const decadeWords = (k: number) => (k >= 0 ? String(10 ** k) : `0.${'0'.repeat(-k - 1)}1`);

	// --- the words --------------------------------------------------------------------------------------------------
	const kelvin = (theta: number) => kelvinWords((theta * HBAR * (physical?.omega1 ?? 1)) / KB);
	const tempWords = $derived(
		preset === 'ball' ? `T = ${kelvin(theta)}` : `kʙT/ħω₁ = ${thetaWords(theta)}`
	);
	/** "725 nK" as LaTeX. */
	function kelvinTex(words: string) {
		const [n, unit] = words.split(' ');
		return `${n}\\,\\text{${unit}}`;
	}
	const tempTex = $derived(
		preset === 'ball'
			? `T = ${kelvinTex(kelvin(theta))}`
			: `k_BT/\\hbar\\omega_1 = ${thetaWords(theta)}`
	);
	const marks = $derived(
		[
			{ at: TEMPERATURE.zero, theta: 0, words: 'absolute zero' },
			{ at: -2, theta: 0.01, words: '' },
			{ at: -1, theta: 0.1, words: '' },
			{ at: 0, theta: 1, words: preset === OPENING.preset ? 'as the figure opens' : '' },
			{ at: 1, theta: 10, words: '' },
			{ at: 2, theta: 100, words: '' }
		].map((m) => ({
			at: m.at,
			label:
				(preset === 'ball' ? kelvin(m.theta) : thetaWords(m.theta)) +
				(m.words ? `, ${m.words}` : '')
		}))
	);

	const modesWords = $derived(
		body.modes.map((m) => `${three(m.x)} ω₁ holding ${Math.round(100 * m.share)}% of χ₀`).join('; ')
	);
	const bodyWords = $derived(
		preset === 'ball'
			? 'Appendix A’s steel ball as one mode, chapter 4.3’s trial shape, at 15.1 kHz'
			: preset === 'one'
				? 'one mode'
				: preset === 'carts'
					? 'chapter 4.1’s two carts, read at the first cart'
					: preset === 'octaves'
						? 'five modes an octave apart, each holding a fifth of χ₀'
						: 'five random modes'
	);
	const spectrumDescription = $derived(
		`The tremor at each frequency for ${bodyWords}, at ${tempWords}: ω/ω₁ across, on a linear axis from ` +
			`${three(range.a)} to ${three(range.b)}, the spectral density in units of ħχ₀ up, to ${three(yAxis.top)}. ` +
			`Lines at ${modesWords}, each of width 0.05 of its frequency. Thick: the symmetrized spectrum ` +
			`S̄ = ħ coth(ħω/2kʙT) Im χ, ${three(symmetrized(body.modes, line.x, theta))} at the strongest line; ` +
			`dashed grey: the classical 2kʙT Im χ/ω, ${three(classical(body.modes, line.x, theta))} there.` +
			(both
				? ` Thin: the two orders, S(ω), ${three(unsymmetrized(body.modes, line.x, theta))} at +${three(line.x)} ω₁, ` +
					`the absorption, and S(−ω), ${three(unsymmetrized(body.modes, -line.x, theta))} at −${three(line.x)} ω₁, ` +
					`the emission; S̄ is their average.`
				: '')
	);
	const boundsDescription = $derived(
		`The jitter ⟨δy²⟩ in units of ħω₁χ₀ against kʙT/ħω₁, both logarithmic, from 0.01 to 100 across and 0.01 ` +
			`to 300 up, with absolute zero in a column of its own at the left. A grey line: the lower bound kʙTχ₀; ` +
			`dashed: the upper bound, one mode at √(A/χ₀) = ${three(r.rms)} ω₁, flat at ${three(curves.zero.upper)} ` +
			`when cold. Thick: the jitter, drawn ${everywhere ? 'at every temperature' : 'over the temperatures visited'}. ` +
			`A dot at ${tempWords}: the jitter ${three(r.jitter)}, between ${three(r.lower)} and ${three(r.upper)}.`
	);
	const summary = $derived(
		`${PRESET_NAMES[preset]}, ${tempWords}. Jitter ${three(r.jitter)} ħω₁χ₀; ` +
			(zero ? 'over kʙTχ₀ infinite' : `over kʙTχ₀ ${ratioWords(r.overLower)}`) +
			`; over the upper bound ${ratioWords(r.overUpper)}.`
	);

	const thermoWords = (v: number) => (preset === 'ball' ? kelvin(v) : `${thetaWords(v)} ħω₁/kʙ`);
	const rmsTex = $derived(
		physical
			? `\\sqrt{A/\\chi_0} = ${three(r.rms)}\\,\\omega_1 = ${powerTex(r.rmsPerSecond!)}\\,\\mathrm{s^{-1}}`
			: `\\sqrt{A/\\chi_0} = ${three(r.rms)}\\,\\omega_1`
	);
	/** Four figures, so that a jitter just below its bound reads apart from it: "1.120 ≤ 1.122". */
	const four = (v: number) => (v === 0 ? '0' : v.toPrecision(4));
	const boundsTex = $derived(`${four(r.lower)} \\le ${four(r.jitter)} \\le ${four(r.upper)}`);
	const presetOptions = [
		{ value: 'ball' as const, label: 'Steel ball', icon: SphereIcon },
		{ value: 'one' as const, label: 'One mode', icon: WaveIcon },
		{ value: 'carts' as const, label: 'Two carts', icon: Link02Icon },
		{ value: 'octaves' as const, label: 'Octaves', icon: MusicNote01Icon },
		{ value: 'random' as const, label: 'Random', icon: DiceFaces03Icon, wide: true }
	];
</script>

<div class="quantum-tremor" onkeydown={numberKeys} role="presentation">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Cool the body to absolute zero. Does its jitter vanish?
			{:else}
				Make the body a single mode. Where does the jitter lie?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No: it falls to the zero point of its modes, below the upper bound.</strong> The
				classical jitter <Tex math="k_BT\chi_0" /> goes to nothing, but each mode keeps <Tex
					math="\tfrac12\hbar c_n^2/\omega_n"
				/>, so a body of narrow lines keeps <Tex math="\tfrac12\hbar\sum_n c_n^2/\omega_n" />, at
				most <Tex math={'\\tfrac12\\hbar\\sqrt{A\\chi_0}'} />. Lines of width <Tex
					math="0.05\,\omega_n"
				/>, as here, keep 0.984 of that. Five modes an octave apart stop at 0.739 of the upper
				bound.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Just below the upper bound, at every temperature.</strong> One mode’s weight
				<Tex math="\mu" /> sits nearly at one frequency, its own <Tex math={'\\sqrt{A/\\chi_0}'} />,
				where Jensen’s inequality is an equality. A line of no width would reach the bound; this
				one, of width <Tex math="0.05\,\omega_0" />, reaches 0.984 of it at absolute zero and comes
				closer as it warms, while the lower bound joins both only when <Tex
					math="\hbar\omega_0 \ll k_BT"
				/>.
			{:else if step === 1}
				The answer appears once you have set the temperature to exactly zero, the stop at the left
				end of its slider.
			{:else}
				The answer appears once you have made the body a single mode, the steel ball or one mode,
				and set its temperature both at most 0.1 and at least 10 in units of <Tex
					math="\hbar\omega_1/k_B"
				/>.
			{/if}
		</p>
	</section>

	<p class="sr-only" aria-live="polite">{summary}</p>

	<div class="stage">
		<div class="plots" style:--columns="minmax(0, {L.W}fr) minmax(0, {B.W}fr)">
			<figure class="plot">
				<svg
					viewBox="0 0 {L.W} {L.H}"
					role="img"
					aria-label={spectrumDescription}
					{@attach fitText()}
				>
					<defs>
						<clipPath id="{uid}-spectrum">
							<rect x={L.x0} y={L.y0 - 2} width={L.x1 - L.x0} height={L.y1 - L.y0 + 2} />
						</clipPath>
					</defs>
					<text class="title" x="0" y="14">The tremor at each frequency</text>
					<text class="small dim start" x="0" y="29"
						>spectral density, units of <tspan class="it">ħχ</tspan><tspan class="sub" dy="3"
							>0</tspan
						><tspan dy="-3">; {tempWords}</tspan></text
					>

					{#each yAxis.ticks as v (v)}
						<line class="grid" x1={L.x0} x2={L.x1} y1={f2(sy(v))} y2={f2(sy(v))} />
						<text class="small dim end" x={L.x0 - 6} y={f2(sy(v) + 4)}>{three(v)}</text>
					{/each}
					{#each xTicks as v (v)}
						<line class="tick" x1={f2(sx(v))} x2={f2(sx(v))} y1={L.y1} y2={L.y1 + 5} />
						<text class="small dim mid" x={f2(sx(v))} y={L.y1 + 17}>{tickWords(v)}</text>
					{/each}
					<line class="axis" x1={L.x0} x2={L.x1} y1={L.y1} y2={L.y1} />
					<line class="axis" x1={L.x0} x2={L.x0} y1={L.y0} y2={L.y1} />
					{#if both}
						<line class="axis faint" x1={f2(sx(0))} x2={f2(sx(0))} y1={L.y0} y2={L.y1} />
					{/if}
					<text class="small dim end" x={L.x1} y={L.y1 + 33}
						><tspan class="it">ω</tspan> / <tspan class="it">ω</tspan><tspan class="sub" dy="3"
							>1</tspan
						></text
					>

					<g clip-path="url(#{uid}-spectrum)">
						<path class="classical" d={classicalLine} />
						{#if both}<path class="orders" d={sLine} />{/if}
						<path class="sbar" d={sbarLine} />
					</g>
					{#if both}
						<text class="small strong halo start" x={L.x0 + 6} y={L.y0 + 4}
							>emission, <tspan class="it">S</tspan>(−<tspan class="it">ω</tspan>)</text
						>
						<text class="small strong halo end" x={L.x1 - 2} y={L.y0 + 4}
							>absorption, <tspan class="it">S</tspan>(<tspan class="it">ω</tspan>)</text
						>
					{/if}
				</svg>
				<ul class="legend" aria-hidden="true">
					<li>
						<span class="sbar-key"></span><span
							><Tex
								math={'\\bar S = \\hbar\\coth(\\hbar\\omega/2k_BT)\\,\\mathrm{Im}\\,\\chi'}
							/></span
						>
					</li>
					<li>
						<span class="classical-key"></span><span
							>classical, <Tex math={'2k_BT\\,\\mathrm{Im}\\,\\chi/\\omega'} /></span
						>
					</li>
					{#if both}
						<li>
							<span class="orders-key"></span><span
								>the two orders, <Tex
									math={'S(\\pm\\omega) = 2\\hbar(\\bar n + \\tfrac12 \\pm \\tfrac12)\\,\\mathrm{Im}\\,\\chi'}
								/></span
							>
						</li>
					{/if}
				</ul>
			</figure>

			<figure class="plot">
				<svg
					viewBox="0 0 {B.W} {B.H}"
					role="img"
					aria-label={boundsDescription}
					{@attach fitText()}
				>
					<defs>
						<clipPath id="{uid}-bounds">
							<rect x={B.x0} y={B.y0} width={B.x1 - B.x0} height={B.y1 - B.y0} />
						</clipPath>
					</defs>
					<text class="title" x="0" y="14">The jitter between its bounds</text>
					<text class="small dim start" x="0" y="29"
						>units of <tspan class="it">ħω</tspan><tspan class="sub" dy="3">1</tspan><tspan
							class="it"
							dy="-3">χ</tspan
						><tspan class="sub" dy="3">0</tspan><tspan dy="-3">, logarithmic</tspan></text
					>

					{#each yDecades as k (k)}
						<line class="grid" x1={B.x0} x2={B.x1} y1={f2(by(10 ** k))} y2={f2(by(10 ** k))} />
						<line
							class="grid"
							x1={B.z - 8}
							x2={B.z + 8}
							y1={f2(by(10 ** k))}
							y2={f2(by(10 ** k))}
						/>
						<text class="small dim end" x={B.z - 12} y={f2(by(10 ** k) + 4)}>{decadeWords(k)}</text>
					{/each}
					{#each minor as v (v)}
						<line class="tick" x1={f2(bx(v))} x2={f2(bx(v))} y1={B.y1} y2={B.y1 + 3} />
					{/each}
					{#each decades as k (k)}
						<line class="grid" x1={f2(bx(k))} x2={f2(bx(k))} y1={B.y0} y2={B.y1} />
						<line class="tick" x1={f2(bx(k))} x2={f2(bx(k))} y1={B.y1} y2={B.y1 + 5} />
						<text class="small dim mid" x={f2(bx(k))} y={B.y1 + 17}>{decadeWords(k)}</text>
					{/each}
					<line class="tick" x1={B.z} x2={B.z} y1={B.y1} y2={B.y1 + 5} />
					<text class="small dim mid" x={B.z} y={B.y1 + 17}>0</text>
					<line class="axis" x1={B.x0} x2={B.x1} y1={B.y1} y2={B.y1} />
					<line class="axis" x1={B.z - 10} x2={B.z + 10} y1={B.y1} y2={B.y1} />
					<line class="axis" x1={B.x0} x2={B.x0} y1={B.y0} y2={B.y1} />
					<!-- the break between absolute zero and the logarithmic axis -->
					<g class="break">
						<line x1={B.z + 12} x2={B.z + 18} y1={B.y1 + 4} y2={B.y1 - 4} />
						<line x1={B.z + 17} x2={B.z + 23} y1={B.y1 + 4} y2={B.y1 - 4} />
					</g>
					<text class="small dim end" x={B.x1} y={B.y1 + 33}
						><tspan class="it">k</tspan><tspan class="sub" dy="3">B</tspan><tspan class="it" dy="-3"
							>T</tspan
						>&nbsp;/&nbsp;<tspan class="it">ħω</tspan><tspan class="sub" dy="3">1</tspan></text
					>
					{#if preset === 'ball'}
						<text class="small dim start" x={B.z - 10} y={B.y1 + 33}>1 = {kelvin(1)}</text>
					{/if}

					<!-- the temperature now -->
					<line class="marker" x1={f2(dot.x)} x2={f2(dot.x)} y1={B.y1} y2={f2(dot.y)} />

					<g clip-path="url(#{uid}-bounds)">
						<path class="lower" d={lowerLine} />
						{#if jitterLine}<path class="jitter" d={jitterLine} />{/if}
						<path class="upper" d={upperLine} />
					</g>
					<!-- absolute zero: the upper bound and the zero point; the lower bound is 0, off the axis -->
					{#if zeroShown}
						<line
							class="jitter"
							x1={B.z - 8}
							x2={B.z + 8}
							y1={f2(by(curves.zero.jitter))}
							y2={f2(by(curves.zero.jitter))}
						/>
					{/if}
					<line
						class="upper"
						x1={B.z - 8}
						x2={B.z + 8}
						y1={f2(by(curves.zero.upper))}
						y2={f2(by(curves.zero.upper))}
					/>
					<path
						class="arrow"
						d="M{B.z},{B.y1 - 22}V{B.y1 - 4}M{B.z - 3},{B.y1 - 8}L{B.z},{B.y1 - 3}L{B.z + 3},{B.y1 -
							8}"
					/>
					<circle class="now" cx={f2(dot.x)} cy={f2(dot.y)} r="4" />
				</svg>
				<ul class="legend" aria-hidden="true">
					<li>
						<span class="jitter-key"></span><span
							>the jitter <Tex math="\langle\delta y^2\rangle" />{everywhere
								? ''
								: ', where you have taken it'}</span
						>
					</li>
					<li>
						<span class="upper-key"></span><span
							>upper bound, one mode at <Tex math={'\\sqrt{A/\\chi_0}'} /></span
						>
					</li>
					<li>
						<span class="lower-key"></span><span>lower bound, <Tex math="k_BT\chi_0" /></span>
					</li>
				</ul>
			</figure>
		</div>
	</div>

	<div class="bar">
		<div class="groups">
			<div class="slot" onkeydowncapture={presetKeys} role="presentation">
				<Segmented label="Body" options={presetOptions} bind:value={() => preset, setPreset} />
			</div>
			<div class="slot">
				<div onkeydowncapture={sliderKeys} role="presentation">
					<Slider
						id="{uid}-temperature"
						label="Temperature"
						icon={ThermometerIcon}
						min={TEMPERATURE.zero}
						max={TEMPERATURE.max}
						step={TEMPERATURE.step}
						bind:value={() => t, setT}
						readout={tempWords}
						{marks}
						marksHint="logarithmic from 0.01 to 100, with a stop at exactly zero below its left end"
					/>
				</div>
				<div class="toggle-row">
					<Toggle
						icon={ArrowLeftRightIcon}
						label="Both orders, S(ω) and S(−ω)"
						hint="Make the axis two-sided and add the absorption and the emission"
						bind:checked={both}
					/>
				</div>
			</div>
		</div>
		<div class="controls">
			<button type="button" class="action" onclick={drawNew}>
				<HugeiconsIcon icon={DiceFaces03Icon} size={16} strokeWidth={1.7} />
				Draw new random modes
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Reach each control with Tab. The number keys 1 to 5 choose a body; on the slider the arrow
				keys step the temperature by a twentieth of a decade, Shift by a quarter, and Home goes to
				absolute zero, End to 100.
			</p>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The body</dt>
				<dd>
					<span class="also">
						{#if preset === 'ball'}
							Appendix A’s steel ball in chapter 4.3’s trial shape, as one mode of the swing <Tex
								math="q"
							/> at the poles: <Tex
								math={`\\omega_1 = \\sqrt{10}\\,c_T/R = ${powerTex(BALL.omega)}\\,\\mathrm{s^{-1}}`}
							/>, 15.1 kHz, with the effective mass <Tex
								math={`3M/10 = ${three(BALL.mass)}\\,\\mathrm{kg}`}
							/>, so <Tex math={`c^2 = 1/m = ${three(BALL.c2)}\\,\\mathrm{kg^{-1}}`} />.
						{:else if preset === 'one'}
							One mode, <Tex math="\chi = c^2/(\omega_1^2 - \omega^2 - i\Gamma\omega)" />.
						{:else if preset === 'carts'}
							Chapter 4.1’s two carts of 2 kg, read at the first: lines at <Tex
								math={'5\\ \\text{and}\\ 8.66\\,\\mathrm{s^{-1}}'}
							/>, each of <Tex math={'c_n^2 = 1/2m = 0.25\\,\\mathrm{kg^{-1}}'} />, holding 3/4 and
							1/4 of <Tex math={'\\chi_0 = 1/75\\,\\mathrm{m\\,N^{-1}}'} />.
						{:else if preset === 'octaves'}
							Five modes at <Tex math="\omega_1, 2\omega_1, 4\omega_1, 8\omega_1, 16\omega_1" />,
							each holding a fifth of <Tex math="\chi_0" /> (<Tex
								math="c_n^2 = 0.2\,\chi_0\omega_n^2"
							/>).
						{:else}
							Five modes at <Tex
								math={body.modes.map((m) => `${three(m.x)}`).join(',\\ ') + '\\ \\omega_1'}
							/>, holding {body.modes.map((m) => `${Math.round(100 * m.share)}%`).join(', ')} of
							<Tex math="\chi_0" />.
						{/if}
						Every line has <Tex math={`\\Gamma_n = ${DAMPING}\\,\\omega_n`} />.
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>The temperature</dt>
				<dd>
					<span class="eq"><Tex math={tempTex} /></span>
					{#if preset === 'ball'}
						<span class="also"
							><Tex math={`k_BT/\\hbar\\omega_1 = ${thetaWords(theta)}`} />; at 300 K it stands at
							<Tex math={`${powerTex((KB * 300) / (HBAR * BALL.omega))}`} />, far beyond the right
							end, where the bounds meet</span
						>
					{:else if preset === 'carts'}
						<span class="also"
							>with <Tex math={'\\omega_1 = 5\\,\\mathrm{s^{-1}}'} />: <Tex
								math={`T = ${powerTex((theta * HBAR * 5) / KB)}\\,\\mathrm{K}`}
							/></span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The jitter</dt>
				<dd>
					<span class="eq"
						><Tex
							math={'k_BT\\chi_0 \\le \\langle\\delta y^2\\rangle \\le \\tfrac12\\hbar\\sqrt{A\\chi_0}\\,\\coth\\frac{\\hbar\\sqrt{A/\\chi_0}}{2k_BT}'}
						/></span
					>
					<span class="eq"><Tex math={boundsTex} /></span>
					<span class="also">in units of <Tex math="\hbar\omega_1\chi_0" /></span>
					{#if physical && r.rmsReading !== undefined}
						<span class="eq"
							><Tex
								math={`\\sqrt{\\langle\\delta ${physical.letter}^2\\rangle} = ${powerTex(r.rmsReading)}\\,\\mathrm{m}`}
							/></span
						>
						<span class="also">{physical.reading}</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Against the classical</dt>
				<dd>
					{#if zero}
						<span class="eq"
							><Tex math={'\\langle\\delta y^2\\rangle/k_BT\\chi_0 = \\text{—}'} /></span
						>
						<span class="also"
							>infinite: at absolute zero <Tex math="k_BT\chi_0 = 0" />, while the jitter keeps its
							zero point</span
						>
					{:else}
						<span class="eq"
							><Tex
								math={`\\langle\\delta y^2\\rangle/k_BT\\chi_0 = ${ratioWords(r.overLower)}`}
							/></span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Against the upper bound</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\langle\\delta y^2\\rangle\\Big/\\tfrac12\\hbar\\sqrt{A\\chi_0}\\coth(\\dots) = ${r.overUpper.toFixed(4)}`}
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The rms frequency</dt>
				<dd><span class="eq"><Tex math={rmsTex} /></span></dd>
			</div>
			<div class="row">
				<dt>The thermometers</dt>
				<dd>
					<span class="eq"
						><Tex
							math={'T = \\frac{\\hbar\\omega}{2k_B\\,\\mathrm{artanh}(\\hbar\\,\\mathrm{Im}\\,\\chi/\\bar S)}'}
						/></span
					>
					<span class="also"
						>read at the strongest line, <Tex
							math={`\\omega = ${three(r.thermo.w)}\\,\\omega_1`}
						/>: quantum {#if r.thermo.frozen}<strong>unreadable</strong>, the line frozen, its
							emission below
							<Tex math={'e^{-700}'} /> of its absorption{:else}<strong
								>{thermoWords(r.thermo.quantum)}</strong
							>{/if}, classical <Tex math={'\\omega\\bar S/2k_B\\,\\mathrm{Im}\\,\\chi'} />
						<strong>{thermoWords(r.thermo.classical)}</strong>{#if zero}, the zero point mistaken
							for heat{/if}</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Exact for a body of up to five modes of unit mass, mode <Tex math="n" /> weighed in the reading by
		<Tex math="c_n^2" />, so that <Tex
			math="\chi = \sum_n c_n^2/(\omega_n^2 - \omega^2 - i\Gamma_n\omega)"
		/>, with <Tex math={`\\Gamma_n = ${DAMPING}\\,\\omega_n`} />, <Tex
			math="\chi_0 = \sum_n c_n^2/\omega_n^2"
		/> and <Tex math="A = \sum_n c_n^2" />. The jitter <Tex
			math={'(\\hbar/\\pi)\\int_0^\\infty\\coth(\\hbar\\omega/2k_BT)\\,\\mathrm{Im}\\,\\chi\\,d\\omega'}
		/>
		is counted by quadrature, line by line; because the lines have width, it is a little below the undamped
		<Tex math="\tfrac12\hbar\sum_n (c_n^2/\omega_n)\coth(\hbar\omega_n/2k_BT)" /> of the chapter’s diagrams.
		The spectra are two-sided, so that <Tex
			math="\langle\delta y^2\rangle = \int\bar S\,d\omega/2\pi"
		/>; the left panel’s axis is rescaled to the tallest curve shown. At absolute zero every formula
		is taken in its limit: <Tex math="\coth \to 1" />, <Tex math="\bar n \to 0" />, the lower bound
		0.
		<Tex math={'\\hbar = 1.0546\\times10^{-34}\\,\\mathrm{J\\,s}'} />.
	</p>
</div>

<style>
	.quantum-tremor {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
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
	.action:focus-visible {
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

	/* --- the panels ----------------------------------------------------------------------- */

	.stage {
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	/* the two panels side by side, each as wide as its drawing is, so that they stand equally tall */
	.plots {
		display: grid;
		grid-template-columns: var(--columns);
		gap: 0.9rem;
		align-items: start;
	}

	.plot {
		margin: 0;
		min-width: 0;
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
		font-variant-numeric: tabular-nums;
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

	.dim {
		fill: var(--text-faint);
	}

	.strong {
		fill: var(--text);
		font-weight: 600;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	tspan.it {
		font-size: 1.1em;
	}

	tspan.sub {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis.faint {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.break line {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the spectrum: S̄ thick ink, the classical dashed grey, the two orders a thin ink line */
	.sbar,
	.jitter {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.classical {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 48%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.orders {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the bounds: the lower a thin grey line, the upper thin dashed ink */
	.lower {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.upper {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.arrow {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.marker {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.now {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	/* --- the legends ------------------------------------------------------------------------ */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.45rem 0 0;
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

	.sbar-key,
	.jitter-key,
	.classical-key,
	.orders-key,
	.upper-key,
	.lower-key {
		flex: none;
		width: 1.2rem;
		height: 0;
		border-top: 2px solid var(--text);
	}

	.classical-key {
		border-top: 1.2px dashed color-mix(in srgb, var(--text) 48%, transparent);
	}

	.orders-key {
		border-top: 1px solid var(--text);
	}

	.upper-key {
		border-top: 1px dashed var(--text);
	}

	.lower-key {
		border-top: 1px solid color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.8rem 1.1rem;
		align-items: start;
	}

	.slot {
		min-width: 0;
		display: grid;
		gap: 0.6rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.6rem;
		align-items: center;
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 16rem;
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

	.eq {
		display: inline-flex;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.also strong {
		color: var(--text);
		font-weight: 600;
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
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.plots {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
