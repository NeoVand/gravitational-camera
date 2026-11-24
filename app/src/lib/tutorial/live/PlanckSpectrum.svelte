<script lang="ts">
	/**
	 * Chapter 10.1's black body. Panel 1: Planck's spectrum against the frequency f = ω/2π, both on scales of powers
	 * of ten with axes that stay fixed, so that a change of temperature moves the curve; the wavelength c/f along the
	 * top and the band of visible light shaded. A switch draws it per unit of angular frequency, B_ω, per unit of
	 * wavelength, B_λ = (ω²/2πc)B_ω, or as a count of quanta, B_ω/ħω, and the dot on its peak sits at x = ħω/k_BT =
	 * 2.821, 4.965 or 1.594. Panel 2: the three factors whose product is B_ω on the same frequency axis, the modes
	 * ω²/π²c³, the occupation n̄ = 1/(e^x − 1) with n̄ = 1 dotted, and the quantum ħω with k_BT dotted. A slider on a
	 * scale of powers of ten sets T from 0.5 K to 2 × 10⁷ K; five presets, and buttons that halve and double it. The
	 * readouts give the peak, σ_SB T⁴, N_bb, the mean energy and n̄ at the peak. The arithmetic is in
	 * ./planck-spectrum.ts. The chapter's try box asks the predictions, so the figure answers none of them in words.
	 * Nothing moves by itself, so reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AbacusIcon,
		DivideSignIcon,
		FireIcon,
		Globe02Icon,
		GravityIcon,
		Home01Icon,
		MultiplicationSignIcon,
		RulerIcon,
		SineIcon,
		Sun03Icon,
		ThermometerIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		EV,
		FACTOR_AXIS,
		F_AXIS,
		F_LABELS,
		KB,
		LAMBDA_LABELS,
		LAMBDA_TICKS,
		OPENING,
		PRESETS,
		PRESET_ORDER,
		TEMPERATURE,
		T_MAX,
		T_MIN,
		VISIBLE,
		Y_AXIS,
		count,
		frequencyText,
		logModes,
		logOccupation,
		logQuantum,
		logSpectrum,
		logThermal,
		meanEnergy,
		numberTex,
		numberText,
		peak,
		power,
		powers,
		presetOf,
		sample,
		temperatureTex,
		temperatureText,
		wavelengthText,
		xAt,
		type Mode,
		type PresetName
	} from './planck-spectrum';

	const uid = $props.id();

	// --- the temperature and the curve drawn ---------------------------------------------------------------------------
	let T = $state(OPENING.T);
	let mode = $state<Mode>(OPENING.mode);

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	/** A slider's value, kept on its steps but for the values a preset or a button sets exactly. */
	const onStep = (v: number, s: number) => Number((Math.round(v / s) * s).toFixed(6));

	function setLog(v: number) {
		T = 10 ** clamp(v, TEMPERATURE.low, TEMPERATURE.high);
	}

	/** Halve or double, exactly, within the slider's range. */
	const canHalve = $derived(T / 2 >= T_MIN * (1 - 1e-12));
	const canDouble = $derived(T * 2 <= T_MAX * (1 + 1e-12));

	/** The page keys move the slider by its larger step. */
	function pageKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
		e.preventDefault();
		setLog(
			onStep(
				Math.log10(T) + (e.key === 'PageUp' ? TEMPERATURE.page : -TEMPERATURE.page),
				TEMPERATURE.step
			)
		);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const p = $derived(peak(mode, T));
	const preset = $derived(presetOf(T));
	const kT = $derived(KB * T);
	const fPeak = $derived(frequencyText(p.f));
	const lPeak = $derived(wavelengthText(p.lambda));
	const tText = $derived(temperatureText(T));
	const tTex = $derived(temperatureTex(T));

	const fTex = $derived(`${fPeak.value}\\,\\mathrm{${fPeak.unit}}`);
	const lTex = $derived(`${lPeak.value}\\,${lPeak.tex}`);
	const xTex = $derived(p.x.toFixed(3));

	const tempTex = $derived(
		`T = ${tTex},\\quad k_BT = ${numberTex(kT, 4)}\\,\\mathrm{J} = ${numberTex(kT / EV, 4)}\\,\\mathrm{eV}`
	);
	const peakTex = $derived(
		mode === 'wavelength'
			? [
					`\\dfrac{2\\pi\\hbar c}{\\lambda k_BT} = ${xTex},`,
					`\\lambda = ${lTex},`,
					`f = c/\\lambda = ${fTex}`
				]
			: [
					`\\hbar\\omega = ${xTex}\\,k_BT,`,
					`f = \\omega/2\\pi = ${fTex},`,
					`\\lambda = c/f = ${lTex}`
				]
	);
	const powerTex = $derived(
		`\\sigma_{\\rm SB}T^4 = ${numberTex(power(T), 4)}\\,\\mathrm{W\\,m^{-2}}`
	);
	const radianceTex = $derived(
		`\\sigma_{\\rm SB}T^4/\\pi = ${numberTex(power(T) / Math.PI, 4)}\\,\\mathrm{W\\,m^{-2}\\,sr^{-1}}`
	);
	const countTex = $derived([
		`N_{\\rm bb} = \\zeta(3)\\,(k_BT/\\hbar)^3/2\\pi^3c^2`,
		`= ${numberTex(count(T), 4)}\\,\\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}`
	]);
	const meanTex = $derived([
		`\\bar E = 2.701\\,k_BT`,
		`= ${numberTex(meanEnergy(T), 4)}\\,\\mathrm{J}`,
		`= ${numberTex(meanEnergy(T) / EV, 4)}\\,\\mathrm{eV}`
	]);
	const occupationTex = $derived(
		`\\bar n = \\dfrac{1}{e^{${xTex}} - 1} = ${numberTex(p.occupation, 3)}`
	);

	const CURVE: Record<Mode, { name: string; tex: string; words: string }> = {
		frequency: {
			name: 'per unit frequency',
			tex: 'B_\\omega',
			words: 'Planck’s radiance per unit of angular frequency, B_ω'
		},
		wavelength: {
			name: 'per unit wavelength',
			tex: 'B_\\lambda',
			words: 'the radiance per unit of wavelength, B_λ'
		},
		count: {
			name: 'count of quanta',
			tex: 'B_\\omega/\\hbar\\omega',
			words: 'the count of quanta per unit of angular frequency, B_ω/ħω'
		}
	};

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, H: 318, L: 42, R: 352, T: 50, B: 280 }
			: { W: 680, H: 378, L: 54, R: 668, T: 50, B: 340 }
	);
	/** The factors' panel: three strips under one another, on the same frequency axis. */
	const strips = $derived.by(() => {
		const h = phone.current ? 50 : 56;
		const step = h + 32;
		return [0, 1, 2].map((i) => ({
			head: 6 + i * step + 11,
			y0: 6 + i * step + 19,
			y1: 6 + i * step + 19 + h
		}));
	});
	const fH = $derived(strips[2].y1 + 36);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const X = (lf: number) =>
		box.L + ((lf - F_AXIS.low) / (F_AXIS.high - F_AXIS.low)) * (box.R - box.L);
	const yAxis = $derived(Y_AXIS[mode]);
	const Y = (ly: number) => box.B - ((ly - yAxis.low) / (yAxis.high - yAxis.low)) * (box.B - box.T);
	/** A value up a strip's axis, kept a little beyond it so that the clip cuts a curve that leaves it. */
	const S = (ly: number, axis: { low: number; high: number }, s: { y0: number; y1: number }) =>
		s.y1 -
		((clamp(ly, axis.low - 1, axis.high + 1) - axis.low) / (axis.high - axis.low)) * (s.y1 - s.y0);

	const path = (pts: [number, number][]) =>
		pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join('');

	const curvePath = $derived(
		path(
			sample((lf) => logSpectrum(mode, lf, T)).map(([lf, ly]) => [
				X(lf),
				Y(clamp(ly, yAxis.low - 2, yAxis.high + 2))
			])
		)
	);
	const peakAt = $derived({ x: X(Math.log10(p.f)), y: Y(Math.log10(p.height)) });

	/** The peak's words over its dot, kept inside the drawing; the curve lies below its peak everywhere. */
	const peakLabel = $derived.by(() => {
		const w = 6.2 * 11 * u;
		return { x: clamp(peakAt.x, box.L + w / 2 + 2, box.R - w / 2 - 2), y: peakAt.y - 9 * u };
	});

	const modesPath = $derived(
		path(
			sample((lf) => logModes(lf), 0.5).map(([lf, ly]) => [
				X(lf),
				S(ly, FACTOR_AXIS.modes, strips[0])
			])
		)
	);
	const occupationPath = $derived(
		path(
			sample((lf) => logOccupation(xAt(10 ** lf, T))).map(([lf, ly]) => [
				X(lf),
				S(ly, FACTOR_AXIS.occupation, strips[1])
			])
		)
	);
	const quantumPath = $derived(
		path(
			sample((lf) => logQuantum(lf), 0.5).map(([lf, ly]) => [
				X(lf),
				S(ly, FACTOR_AXIS.quantum, strips[2])
			])
		)
	);
	const oneY = $derived(S(0, FACTOR_AXIS.occupation, strips[1]));
	const thermalY = $derived(S(logThermal(T), FACTOR_AXIS.quantum, strips[2]));
	/** k_BT's words above its line, or below it where the line runs near the strip's top. */
	const thermalLabelY = $derived(
		thermalY - strips[2].y0 < 14 * v ? thermalY + 12 * v : thermalY - 4 * v
	);
	const occupationDot = $derived(S(Math.log10(p.occupation), FACTOR_AXIS.occupation, strips[1]));

	const decades = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const description = $derived(
		`${CURVE[mode].words}, against the frequency, both on scales of powers of ten, for a black body at ${tText}. ` +
			`It rises at low frequencies, peaks at x = ħω/k_BT = ${xTex}, that is at ${fPeak.value} ${fPeak.unit} or a wavelength of ${lPeak.value} ${lPeak.unit}, where it is ${numberText(p.height, 3)} in its unit, and falls steeply above. The band of visible light, 400 to 700 nanometres, is shaded.`
	);
	const factorsDescription = $derived(
		`The three factors of B_omega against the same frequency axis, each on a scale of powers of ten: the modes per cubic metre per unit of omega, a straight line rising as omega squared; ` +
			`the occupation n bar = 1/(e^x − 1) at ${tText}, large at low frequencies and falling steeply above k_BT/h, with n bar = 1 dotted; and the quantum ħω in electronvolts, a straight line, with k_BT = ${numberText(kT / EV, 3)} eV dotted. ` +
			`At the peak, n bar = ${numberText(p.occupation, 3)}.`
	);

	const PRESET_NAMES: Record<
		PresetName,
		{ label: string; icon: typeof SineIcon; t: string; words: string }
	> = {
		sky: { label: 'Graviton sky', icon: GravityIcon, t: '0.905 K', words: 'the graviton sky' },
		room: { label: 'A room', icon: Home01Icon, t: '293 K', words: 'a room' },
		outer: { label: 'Outer core', icon: FireIcon, t: '4500 K', words: 'the outer core' },
		inner: { label: 'Inner core', icon: Globe02Icon, t: '5500 K', words: 'the inner core' },
		sun: { label: 'Sun’s core', icon: Sun03Icon, t: '1.3 × 10⁷ K', words: 'the Sun’s core' }
	};
	const MARKS = PRESET_ORDER.map((name) => ({
		at: Math.log10(PRESETS[name]),
		label: `T = ${PRESET_NAMES[name].t}, ${PRESET_NAMES[name].words}`
	}));
</script>

{#snippet power10(e: number, dy: number)}{#if e === 0}1{:else if e === 1}10{:else}10<tspan
			class="exp"
			dy={-dy}>{e < 0 ? `−${-e}` : e}</tspan
		>{/if}{/snippet}

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} />{/each}</span
	>{/snippet}

<div class="planck-spectrum">
	<section class="panel" aria-label="Planck’s spectrum">
		<div class="stage">
			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={description}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
					</clipPath>
				</defs>

				<!-- the titles of the two axes that need words -->
				<text class="title" x={box.L - (phone.current ? 36 : 46)} y={box.T - 30 * u}
					>{#if mode === 'frequency'}<tspan class="it">B</tspan><tspan class="sub it" dy={2.5 * u}
							>ω</tspan
						><tspan dy={-2.5 * u}>, W m⁻² sr⁻¹ s</tspan>{:else if mode === 'wavelength'}<tspan
							class="it">B</tspan
						><tspan class="sub it" dy={2.5 * u}>λ</tspan><tspan dy={-2.5 * u}
							>, W m⁻² sr⁻¹ m⁻¹</tspan
						>{:else}<tspan class="it">B</tspan><tspan class="sub it" dy={2.5 * u}>ω</tspan><tspan
							dy={-2.5 * u}>/ħ</tspan
						><tspan class="it">ω</tspan>, m⁻² sr⁻¹{/if}</text
				>
				<text class="small dim end" x={box.R} y={box.T - 30 * u}
					>wavelength <tspan class="it">λ</tspan> = <tspan class="it">c</tspan>/<tspan class="it"
						>f</tspan
					></text
				>

				<rect class="frame" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />

				<!-- visible light -->
				<rect
					class="visible"
					x={X(VISIBLE.low)}
					y={box.T}
					width={X(VISIBLE.high) - X(VISIBLE.low)}
					height={box.B - box.T}
				/>

				<!-- the grid: the named frequencies and the labelled powers of ten -->
				{#each powers(yAxis) as e (e)}
					<line class="grid" x1={box.L} x2={box.R} y1={Y(e)} y2={Y(e)} />
					<text class="small y-tick" x={box.L - 5 * u} y={Y(e) + 3.5 * u}
						>{@render power10(e, 4.5 * u)}</text
					>
				{/each}
				{#each F_LABELS as t (t.at)}
					<line class="grid" x1={X(t.at)} x2={X(t.at)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(t.at)} y={box.B + 15 * u}>{t.text}</text>
				{/each}
				{#each decades(F_AXIS.low, F_AXIS.high) as e (e)}
					<line class="minor" x1={X(e)} x2={X(e)} y1={box.B} y2={box.B + 3 * u} />
				{/each}
				{#each LAMBDA_TICKS as at (at)}
					<line class="minor" x1={X(at)} x2={X(at)} y1={box.T - 3 * u} y2={box.T} />
				{/each}
				{#each LAMBDA_LABELS as t (t.at)}
					<text class="small tick" x={X(t.at)} y={box.T - 8 * u}>{t.text}</text>
				{/each}
				<text class="small dim end" x={box.R} y={box.B + 30 * u}
					>frequency <tspan class="it">f</tspan> = <tspan class="it">ω</tspan>/2π</text
				>

				<!-- the curve and its peak -->
				<line class="marker" x1={peakAt.x} x2={peakAt.x} y1={peakAt.y} y2={box.B} />
				<g clip-path="url(#{uid}-plot)">
					<path class="curve-halo" d={curvePath} />
					<path class="curve" d={curvePath} />
				</g>
				<circle class="dot" cx={peakAt.x} cy={peakAt.y} r={3.4 * u} />
				<text class="small words mid" x={peakLabel.x} y={peakLabel.y}
					><tspan class="it">x</tspan> = {xTex}</text
				>
			</svg>

			<ul class="legend" aria-hidden="true">
				<li>
					<span class="swatch curve-key"></span><span
						>{CURVE[mode].name}, <Tex math={CURVE[mode].tex} /> at {tText}</span
					>
				</li>
				<li>
					<span class="swatch dot-key"></span><span
						>its peak, at <Tex math={`x = \\hbar\\omega/k_BT = ${xTex}`} /></span
					>
				</li>
				<li><span class="swatch visible-key"></span>visible light, 400–700 nm</li>
			</ul>
		</div>
	</section>

	<section class="panel" aria-label="The three factors of Planck’s law">
		<div class="stage">
			<p class="heading">
				<Tex
					math={'B_\\omega = \\dfrac{c}{4\\pi}\\times\\dfrac{\\omega^2}{\\pi^2c^3}\\times\\bar n\\times\\hbar\\omega'}
				/>
				<span>: the modes, the occupation of each, and the quantum</span>
			</p>
			<svg
				viewBox="0 0 {box.W} {fH}"
				role="img"
				aria-label={factorsDescription}
				{@attach fitText((value) => (v = value))}
			>
				<defs>
					{#each strips as s, i (i)}
						<clipPath id="{uid}-strip-{i}">
							<rect x={box.L} y={s.y0} width={box.R - box.L} height={s.y1 - s.y0} />
						</clipPath>
					{/each}
				</defs>

				{#each strips as s, i (i)}
					{@const axis = [FACTOR_AXIS.modes, FACTOR_AXIS.occupation, FACTOR_AXIS.quantum][i]}
					<rect class="frame" x={box.L} y={s.y0} width={box.R - box.L} height={s.y1 - s.y0} />
					{#each F_LABELS as t (t.at)}
						<line class="grid" x1={X(t.at)} x2={X(t.at)} y1={s.y0} y2={s.y1} />
					{/each}
					{#each powers(axis).filter((e) => e <= axis.high - 0.15 * (axis.high - axis.low)) as e (e)}
						<line class="grid" x1={box.L} x2={box.R} y1={S(e, axis, s)} y2={S(e, axis, s)} />
						<text class="fine y-tick" x={box.L - 5 * v} y={S(e, axis, s) + 3.2 * v}
							>{@render power10(e, 4 * v)}</text
						>
					{/each}
				{/each}

				<!-- the strips' names -->
				<text class="small label" x={box.L} y={strips[0].head}
					>modes per m³ per unit of <tspan class="it">ω</tspan>,
					<tspan class="it">ω</tspan>²/π²<tspan class="it">c</tspan>³, m⁻³ s</text
				>
				<text class="small label" x={box.L} y={strips[1].head}
					>× occupation of each, <tspan class="it">n̄</tspan> = 1/(e<tspan class="it" dy={-4 * v}
						>x</tspan
					><tspan dy={4 * v}>&#8202;− 1)</tspan></text
				>
				<text class="small label" x={box.L} y={strips[2].head}
					>× the quantum ħ<tspan class="it">ω</tspan>, eV</text
				>

				<!-- the levels n̄ = 1 and k_BT -->
				<line class="level" x1={box.L} x2={box.R} y1={oneY} y2={oneY} />
				<text class="fine words end" x={box.R - 4 * v} y={oneY - 4 * v}
					><tspan class="it">n̄</tspan> = 1</text
				>
				<line class="level" x1={box.L} x2={box.R} y1={thermalY} y2={thermalY} />
				<text class="fine words" x={box.L + 4 * v} y={thermalLabelY}
					><tspan class="it">k</tspan><tspan class="sub" dy={2 * v}>B</tspan><tspan
						class="it"
						dy={-2 * v}>T</tspan
					></text
				>

				<!-- the peak's frequency, through all three -->
				<line class="marker" x1={peakAt.x} x2={peakAt.x} y1={strips[0].y0} y2={strips[2].y1} />

				<g clip-path="url(#{uid}-strip-0)"><path class="factor" d={modesPath} /></g>
				<g clip-path="url(#{uid}-strip-1)"><path class="factor" d={occupationPath} /></g>
				<g clip-path="url(#{uid}-strip-2)"><path class="factor" d={quantumPath} /></g>
				<circle class="dot" cx={peakAt.x} cy={occupationDot} r={3 * v} />

				{#each F_LABELS as t (t.at)}
					<text class="fine tick" x={X(t.at)} y={strips[2].y1 + 14 * v}>{t.text}</text>
				{/each}
				{#each decades(F_AXIS.low, F_AXIS.high) as e (e)}
					<line class="minor" x1={X(e)} x2={X(e)} y1={strips[2].y1} y2={strips[2].y1 + 3 * v} />
				{/each}
				<text class="fine dim end" x={box.R} y={strips[2].y1 + 28 * v}
					>frequency <tspan class="it">f</tspan></text
				>
			</svg>
		</div>
	</section>

	<div class="bar">
		<div class="presets" role="group" aria-label="Temperatures">
			{#each PRESET_ORDER as name (name)}
				<button
					type="button"
					aria-pressed={preset === name}
					aria-label="{PRESET_NAMES[name].label}, {PRESET_NAMES[name].t}"
					onclick={() => (T = PRESETS[name])}
				>
					<HugeiconsIcon icon={PRESET_NAMES[name].icon} size={16} strokeWidth={1.7} />
					<span class="preset-words"
						>{PRESET_NAMES[name].label}<span class="preset-t">{PRESET_NAMES[name].t}</span></span
					>
				</button>
			{/each}
		</div>
		<div class="controls">
			<div class="slot" onkeydowncapture={pageKeys} role="presentation">
				<Slider
					id="{uid}-temperature"
					label="Temperature"
					icon={ThermometerIcon}
					min={TEMPERATURE.low}
					max={TEMPERATURE.high}
					step={TEMPERATURE.step}
					bind:value={() => Math.log10(T), setLog}
					readout="T = {tText}"
					ends={['0.5 K', '2 × 10⁷ K']}
					marks={MARKS}
					marksHint="the ticks mark the five presets"
				/>
			</div>
			<div class="actions" role="group" aria-label="Halve or double the temperature">
				<button
					type="button"
					class="action"
					aria-label="Halve the temperature"
					disabled={!canHalve}
					onclick={() => (T = T / 2)}
				>
					<HugeiconsIcon icon={DivideSignIcon} size={15} strokeWidth={1.8} />Halve
					<span class="it-t">T</span>
				</button>
				<button
					type="button"
					class="action"
					aria-label="Double the temperature"
					disabled={!canDouble}
					onclick={() => (T = T * 2)}
				>
					<HugeiconsIcon icon={MultiplicationSignIcon} size={15} strokeWidth={1.8} />Double
					<span class="it-t">T</span>
				</button>
			</div>
			<div class="choice">
				<Segmented
					label="Draw the spectrum"
					options={[
						{
							value: 'frequency',
							label: phone.current ? 'Frequency' : 'Per unit frequency',
							icon: SineIcon
						},
						{
							value: 'wavelength',
							label: phone.current ? 'Wavelength' : 'Per unit wavelength',
							icon: RulerIcon
						},
						{
							value: 'count',
							label: phone.current ? 'Quanta' : 'Count of quanta',
							icon: AbacusIcon
						}
					]}
					bind:value={mode}
				/>
			</div>
		</div>
		<p class="hint">
			Choose a temperature, drag the slider, or halve and double it; then choose how to draw the
			spectrum. With the keyboard, reach each with Tab: the arrow keys step a hundredth of a power
			of ten in <Tex math="T" />, and Page Up and Page Down a tenth.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The temperature</dt>
				<dd><Tex math={tempTex} /></dd>
			</div>
			<div class="row">
				<dt>The peak</dt>
				<dd>
					{@render eq(peakTex)}<span class="also"
						>{#if mode === 'frequency'}Where <Tex math="B_\omega" />, the radiance per unit of
							angular frequency, is largest.{:else if mode === 'wavelength'}Where <Tex
								math="B_\lambda"
							/>, the radiance per unit of wavelength, is largest.{:else}Where <Tex
								math="B_\omega/\hbar\omega"
							/>, the count of quanta per unit of angular frequency, is largest.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The power</dt>
				<dd>
					<Tex math={powerTex} /><span class="also"
						>What a black surface sends into the half of the sky above it, per square metre: the
						radiance added over all frequencies is <Tex math={radianceTex} />.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The count</dt>
				<dd>
					{@render eq(countTex)}<span class="also"
						>Quanta per second, per square metre and per steradian: the number radiance.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The mean energy</dt>
				<dd>
					{@render eq(meanTex)}<span class="also"
						>The power divided by the count, for one quantum.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>At the peak</dt>
				<dd>
					<Tex math={occupationTex} /><span class="also"
						>The mean number of quanta in one mode at the peak’s frequency.</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Both axes of each panel are on scales of powers of ten and stay fixed as the temperature
		changes.
		<Tex math="B_\omega" /> is in <Tex math={'\\mathrm{W\\,m^{-2}\\,sr^{-1}}'} /> per <Tex
			math={'\\mathrm{s^{-1}}'}
		/>, written <Tex math={'\\mathrm{W\\,m^{-2}\\,sr^{-1}\\,s}'} />; the radiance per unit of
		wavelength is <Tex
			math="B_\lambda = (2\pi c/\lambda^2)\,B_\omega = (\omega^2/2\pi c)\,B_\omega"
		/>, in
		<Tex math={'\\mathrm{W\\,m^{-2}\\,sr^{-1}}'} /> per metre of wavelength; the count <Tex
			math="B_\omega/\hbar\omega"
		/> is in quanta <Tex math={'\\mathrm{s^{-1}\\,m^{-2}\\,sr^{-1}}'} /> per <Tex
			math={'\\mathrm{s^{-1}}'}
		/>, or <Tex math={'\\mathrm{m^{-2}\\,sr^{-1}}'} />. All three are drawn against the frequency
		<Tex math="f = \omega/2\pi" />, with the wavelength <Tex math="\lambda = c/f" /> along the top. The
		modes are counted for both polarizations. The constants are the SI's exact values and <Tex
			math="\zeta(3) = 1.2021"
		/>. Every curve and number is exact.
	</p>
</div>

<style>
	.planck-spectrum {
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
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
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

	.fine {
		font-size: calc(10.5px * var(--u, 1));
	}

	.label {
		fill: var(--text);
		font-weight: 500;
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

	.visible {
		fill: color-mix(in srgb, var(--text) 6%, transparent);
	}

	/* a radiance and a temperature are neutral (NOTATION.md, Part 10): the curves in the ink */
	.curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.6px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.factor {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.level {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: round;
	}

	.marker {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
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
		border-top: 1.6px solid;
	}

	.curve-key {
		border-color: var(--text);
	}

	.dot-key {
		width: 0.45rem;
		height: 0.45rem;
		border: 0;
		border-radius: 50%;
		background: var(--text);
	}

	.visible-key {
		width: 0.9rem;
		height: 0.7rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 12%, transparent);
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
		grid-template-columns: repeat(5, minmax(0, 1fr));
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
		min-height: 2.4rem;
		padding: 0.3rem 0.4rem;
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

	.preset-words {
		display: inline-flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.preset-t {
		font-size: 0.68rem;
		font-weight: 400;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.presets button[aria-pressed='true'] :global(svg) {
		color: var(--accent);
	}

	.presets button:focus-visible,
	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.presets button[aria-pressed='false']:hover {
			color: var(--text);
		}

		.action:not(:disabled):hover {
			border-color: var(--accent);
		}
	}

	.controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.7rem 1.1rem;
		align-items: center;
	}

	.slot {
		min-width: 0;
	}

	.choice {
		grid-column: 1 / -1;
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
		transition: border-color 0.15s;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	.action:disabled {
		color: var(--text-faint);
		cursor: default;
		opacity: 0.6;
	}

	.it-t {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.05em;
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

		.presets button {
			flex-direction: column;
			gap: 0.2rem;
			padding: 0.35rem 0.2rem;
			text-align: center;
			font-size: 0.7rem;
		}

		.preset-words {
			align-items: center;
		}

		.choice :global(button) {
			padding-inline: 0.3rem;
			gap: 0.3rem;
		}

		.controls {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.presets button,
		.action {
			transition: none;
		}
	}
</style>
