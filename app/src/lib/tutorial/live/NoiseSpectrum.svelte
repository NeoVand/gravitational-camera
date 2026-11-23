<script lang="ts">
	/**
	 * Chapter 3.2's noise, three ways at once. (a) One record of 2048 samples of white, red or narrow-band noise, in
	 * units of its standard deviation σ_n, with the averages of its successive blocks of τ samples drawn as steps and
	 * the band ± σ_n̄ in which an average lies two times in three. (b) The autocorrelation C(t) measured from 50 such
	 * records, over the exact curve, with the lags shorter than τ shaded. (c) The two-sided spectrum S(ω) measured
	 * from the same records, over the exact curve, on logarithmic axes, with the frequencies below 1/τ shaded. The
	 * readouts set the spread of the averages beside √(S(0)/τ), the law of white noise. The numbers come from
	 * ./noise-spectrum.ts. Two predictions at the top are answered once the reader has done what they ask. Nothing
	 * moves by itself, so reduced motion changes nothing: a new draw replaces the records at once.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AudioWaveformIcon,
		ChartAverageIcon,
		ChartSplineIcon,
		DiceIcon,
		SineIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		KINDS,
		LADDER,
		LAGS,
		MODELS,
		NARROW_PERIOD,
		NARROW_TC,
		RECORDS,
		RED_TC,
		SAMPLES,
		blockAverages,
		correlation,
		draw,
		law,
		logBins,
		measuredCorrelation,
		measuredSpread,
		nearestRung,
		periodogram,
		spectrum,
		varianceOfAverage,
		zeroFrequency,
		type Kind
	} from './noise-spectrum';

	const uid = $props.id();

	// --- the choices: the kind of noise, the averaging time, and the draw -----------------------------------------------
	let kind = $state<Kind>('white');
	let rung = $state(0);
	const tau = $derived(LADDER[rung]);
	let seed = $state(1);

	const KIND_NAMES: Record<Kind, { label: string; noun: string; icon: typeof SineIcon }> = {
		white: { label: 'White', noun: 'white noise', icon: AudioWaveformIcon },
		red: { label: 'Red', noun: 'red noise', icon: ChartSplineIcon },
		narrow: { label: 'Narrow-band', noun: 'narrow-band noise', icon: SineIcon }
	};

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The shortest and the longest averaging time seen with each kind. */
	let seen = $state<Record<Kind, { low: number; high: number } | undefined>>({
		white: { low: 1, high: 1 },
		red: undefined,
		narrow: undefined
	});
	const revealed = $derived(
		step === 1
			? !!seen.red && seen.red.low <= 10 && seen.red.high >= 100
			: KINDS.every((k) => (seen[k]?.high ?? 0) >= 10)
	);

	function note() {
		const s = seen[kind];
		seen[kind] = s
			? { low: Math.min(s.low, tau), high: Math.max(s.high, tau) }
			: { low: tau, high: tau };
	}

	function setRung(i: number) {
		rung = Math.max(0, Math.min(LADDER.length - 1, Math.round(i)));
		note();
	}

	function setKind(k: Kind) {
		kind = k;
		note();
	}

	// the kinds are a group of radio buttons: Tab reaches the chosen one, the arrows move the choice
	const kindButtons: Record<Kind, HTMLButtonElement | undefined> = {
		white: undefined,
		red: undefined,
		narrow: undefined
	};
	const holdKind =
		(k: Kind): Attachment<HTMLButtonElement> =>
		(node) => {
			kindButtons[k] = node;
			return () => (kindButtons[k] = undefined);
		};

	function kindKeys(e: KeyboardEvent) {
		const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
		const on = e.key === 'ArrowRight' || e.key === 'ArrowDown';
		const first = e.key === 'Home';
		const last = e.key === 'End';
		if (!back && !on && !first && !last) return;
		e.preventDefault();
		const i = KINDS.indexOf(kind);
		const next = first
			? 0
			: last
				? KINDS.length - 1
				: (i + (on ? 1 : KINDS.length - 1)) % KINDS.length;
		setKind(KINDS[next]);
		kindButtons[KINDS[next]]?.focus();
	}

	// --- the records, and what is measured from them ----------------------------------------------------------------------
	const model = $derived(MODELS[kind]);
	const records = $derived(draw(model, seed));
	const record = $derived(records[0]);
	const measuredC = $derived(measuredCorrelation(records));
	const bins = $derived(logBins(periodogram(records), 50));
	const averages = $derived(blockAverages(record, tau));
	const spread = $derived(measuredSpread(records, tau));
	const exactSd = $derived(Math.sqrt(varianceOfAverage(model, tau)));
	const lawSd = $derived(Math.sqrt(law(model, tau)));
	const s0 = $derived(zeroFrequency(model));
	/** S(0) as the readouts print it: 1, 800.2 or 0.51. */
	const s0Text = $derived(
		kind === 'white' ? '1' : kind === 'red' ? s0.toFixed(1) : s0.toPrecision(2)
	);

	// --- the drawing's bounds: on a phone the panels are narrower and stacked ---------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const sizeA = $derived(phone.current ? { w: 332, h: 200 } : { w: 672, h: 200 });
	const sizeB = $derived(phone.current ? { w: 332, h: 200 } : { w: 328, h: 206 });
	const f1 = (x: number) => x.toFixed(1);
	const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

	// --- panel (a): the record against time -----------------------------------------------------------------------------
	const Y_EDGE = 3.6;
	const a = $derived({ L: 24, R: sizeA.w - 6, T: 6, B: sizeA.h - 22 });
	const ax = (i: number) => a.L + (i / SAMPLES) * (a.R - a.L);
	const ay = (v: number) => a.B - ((v + Y_EDGE) / (2 * Y_EDGE)) * (a.B - a.T);

	const tracePath = $derived.by(() => {
		let d = `M${f1(ax(0))},${f1(ay(record[0]))}`;
		for (let i = 1; i < record.length; i++) d += `L${f1(ax(i))},${f1(ay(record[i]))}`;
		return d;
	});
	/** The averages as steps: each held across the τ samples it averages. */
	const stepsPath = $derived.by(() => {
		let d = '';
		for (let j = 0; j < averages.length; j++) {
			const y = f1(ay(averages[j]));
			d += j === 0 ? `M${f1(ax(0))},${y}` : `V${y}`;
			d += `H${f1(ax((j + 1) * tau))}`;
		}
		return d;
	});
	const ticksA = [-3, -2, -1, 0, 1, 2, 3];
	const timeTicks = [0, 500, 1000, 1500, 2000];

	// --- panel (b): the autocorrelation against the lag -------------------------------------------------------------
	const b = $derived({ L: 30, R: sizeB.w - 8, T: 8, B: sizeB.h - 22 });
	const bx = (t: number) => b.L + ((t + LAGS) / (2 * LAGS)) * (b.R - b.L);
	const by = (c: number) => b.B - ((c + 1.08) / 2.4) * (b.B - b.T);
	const ticksB = [-1, -0.5, 0, 0.5, 1];
	const lagTicks = [-200, -100, 0, 100, 200];

	const exactC = $derived.by(() => {
		let d = '';
		for (let t = -LAGS; t <= LAGS; t++)
			d += `${t === -LAGS ? 'M' : 'L'}${f1(bx(t))},${f1(by(correlation(model, t)))}`;
		return d;
	});
	/** The measured autocorrelation at every fourth lag, mirrored: C(−t) = C(t). */
	const dotsC = $derived.by(() => {
		let d = '';
		for (let t = -LAGS; t <= LAGS; t += 4) d += `M${f1(bx(t))},${f1(by(measuredC[Math.abs(t)]))}h0`;
		return d;
	});

	// moving τ by pointer on (b): the handle, or anywhere on the panel with a mouse or a pen
	let svgB: SVGSVGElement | undefined;
	const holdB: Attachment<SVGSVGElement> = (node) => {
		svgB = node;
		return () => (svgB = undefined);
	};
	let dragging = $state(false);

	function rungAt(e: PointerEvent) {
		const m = svgB?.getScreenCTM();
		if (!m) return rung;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const lag = Math.abs(((p.x - b.L) / (b.R - b.L)) * 2 * LAGS - LAGS);
		return nearestRung(lag);
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		// a finger scrolls the page unless it takes the handle
		if (e.pointerType === 'touch' && !(e.target as Element).closest('.grip')) return;
		// a drag is not a click: nothing takes the focus, so no ring is drawn
		e.preventDefault();
		svgB?.setPointerCapture(e.pointerId);
		dragging = true;
		setRung(rungAt(e));
	}

	function move(e: PointerEvent) {
		if (dragging) setRung(rungAt(e));
	}

	function release() {
		dragging = false;
	}

	// --- panel (c): the spectrum against the frequency, both logarithmic ----------------------------------------------
	const LOG_W_LOW = Math.log10(3e-4);
	const LOG_W_HIGH = Math.log10(Math.PI);
	const LOG_S_LOW = Math.log10(0.005);
	const LOG_S_HIGH = Math.log10(2000);
	const cx = (w: number) =>
		b.L + 6 + ((Math.log10(w) - LOG_W_LOW) / (LOG_W_HIGH - LOG_W_LOW)) * (b.R - b.L - 6);
	const cy = (s: number) =>
		b.B - ((Math.log10(s) - LOG_S_LOW) / (LOG_S_HIGH - LOG_S_LOW)) * (b.B - b.T);
	const ticksS = [0.01, 0.1, 1, 10, 100, 1000];
	const freqTicks = [
		{ w: 0.001, label: '0.001' },
		{ w: 0.01, label: '0.01' },
		{ w: 0.1, label: '0.1' },
		{ w: 1, label: '1' },
		{ w: Math.PI, label: 'π' }
	];

	const exactS = $derived.by(() => {
		const n = 700;
		const ws: number[] = [];
		for (let j = 0; j <= n; j++) ws.push(10 ** (LOG_W_LOW + ((LOG_W_HIGH - LOG_W_LOW) * j) / n));
		if (model.w0 > 0) ws.push(model.w0);
		ws.sort((p, q) => p - q);
		return ws
			.map((w, j) => `${j === 0 ? 'M' : 'L'}${f1(cx(w))},${f1(cy(spectrum(model, w)))}`)
			.join('');
	});
	const dotsS = $derived(bins.map((p) => `M${f1(cx(p.w))},${f1(cy(p.s))}h0`).join(''));

	// --- the numbers ----------------------------------------------------------------------------------------------------
	/** Two figures, keeping a final zero: "0.32", "0.10", "8.9", "28". */
	const two = (x: number) => (x >= 99.5 ? String(Math.round(x)) : x.toPrecision(2));
	const three = (x: number) => (x >= 999.5 ? String(Math.round(x)) : x.toPrecision(3));
	const samples = (n: number) => (n === 1 ? '1 sample' : `${n} samples`);

	const formula: Record<Kind, string> = {
		white: 'C(t) = S\\,\\delta(t),\\quad S = 1',
		red: 'C(t) = 0.8\\,e^{-|t|/\\tau_c} + 0.2\\,\\delta(t)',
		narrow: 'C(t) = e^{-|t|/\\tau_c}\\cos\\omega_0 t'
	};
	const zeroTex = $derived(
		kind === 'white'
			? 'S(0) = \\textstyle\\sum_t C(t) = 1'
			: kind === 'red'
				? `S(0) = 2(0.8)\\,\\tau_c + 0.2 = ${s0.toFixed(1)}`
				: `S(0) = \\textstyle\\sum_t C(t) = ${two(s0)}`
	);
	/** How far the exact spread of narrow-band averages lies above the law, in per cent. */
	const above = $derived(Math.round((exactSd / lawSd - 1) * 100));

	const labelA = $derived(
		`One record of ${SAMPLES} samples of ${KIND_NAMES[kind].noun}, in units of its standard deviation, and the averages of its successive blocks of ${samples(tau)}, which scatter by about ${two(exactSd)}`
	);
	const labelB = $derived(
		`The autocorrelation of ${KIND_NAMES[kind].noun} against the lag, from −200 to 200 samples: measured from ${RECORDS} records, as dots, over the exact curve, which is ${kind === 'white' ? 'a single spike at zero lag' : kind === 'red' ? 'a spike at zero lag on a slow decay over 500 samples' : 'an oscillation of period 20 samples dying away over 40'}; the lags shorter than τ = ${tau} are shaded`
	);
	const labelC = $derived(
		`The two-sided spectrum of ${KIND_NAMES[kind].noun} against the frequency, both on logarithmic scales: measured from ${RECORDS} records, as dots, over the exact curve, which is ${kind === 'white' ? 'flat at 1' : kind === 'red' ? 'falling as one over omega squared from 800 at zero frequency down to a floor of 0.2' : 'a peak of 40 at 0.31 radian per sample'}; the frequencies below 1/τ = ${two(1 / tau)} are shaded`
	);
</script>

<div class="noise-spectrum">
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
				For red noise, does averaging ten times longer shrink the scatter of the averages by
				<Tex math={`\\sqrt{10}`} />?
			{:else}
				Which kind of noise obeys the square-root law of chapter 3.1?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No: it barely improves.</strong> Averaged over 10 samples, red noise scatters by
				0.90; over 100 samples, by 0.87, not by <Tex math={`0.90/\\sqrt{10} = 0.29`} />. Its
				correlation time, <Tex math="\tau_c = 500" /> samples, is longer than any average here, so the
				readings of one average share the same slow wander, and averaging cannot remove what they share.
				In (c) this is the pile of the spectrum at low frequency, up to <Tex math="S(0) = 800.2" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>Only white noise.</strong> Its readings are uncorrelated, its <Tex math="C(t)" /> is a
				single spike, and its averages scatter by <Tex
					math={`\\sigma_n/\\sqrt{\\tau} = 1/\\sqrt{\\tau}`}
				/>, the law of chapter 3.1 with <Tex math="\tau" /> readings. Red noise barely averages down within
				100 samples. Narrow-band noise averages down unevenly, best over whole periods of 20 samples,
				and once <Tex math="\tau \gg \tau_c" /> it follows <Tex math={`\\sqrt{S(0)/\\tau}`} /> with
				<Tex math="S(0) = 0.51" /> rather than <Tex math="\sigma_n^2 = 1" />: its spectrum is low at
				zero frequency, so its long averages are quieter than those of white noise.
			{:else if step === 1}
				The answer appears once you have chosen red noise and averaged it over 10 samples or fewer
				and over 100.
			{:else}
				The answer appears once you have averaged each of the three kinds over 10 samples or more.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title">
				<span class="letter">(a)</span> One record <Tex math="n(t)" />, in units of
				<Tex math="\sigma_n" />, against the time in samples, and its averages over
				<Tex math="\tau =" />&nbsp;<strong class="tally">{tau}</strong>
				{tau === 1 ? 'sample' : 'samples'}
			</p>
			<svg viewBox="0 0 {sizeA.w} {sizeA.h}" role="img" aria-label={labelA} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-a">
						<rect x={a.L} y={a.T} width={a.R - a.L} height={a.B - a.T} />
					</clipPath>
				</defs>

				<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
				<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
				{#each ticksA as v (v)}
					<line class="tick" x1={a.L - 4} y1={ay(v)} x2={a.L} y2={ay(v)} />
					<text class="num" x={a.L - 7} y={ay(v) + 3.8} text-anchor="end">{minus(v)}</text>
				{/each}
				{#each timeTicks as i (i)}
					<line class="tick" x1={ax(i)} y1={a.B} x2={ax(i)} y2={a.B + 4} />
					<text class="num" x={ax(i)} y={a.B + 16} text-anchor={i === 0 ? 'start' : 'middle'}
						>{i}</text
					>
				{/each}

				<g clip-path="url(#{uid}-a)">
					<rect
						class="band"
						x={a.L}
						y={ay(exactSd)}
						width={a.R - a.L}
						height={ay(-exactSd) - ay(exactSd)}
					/>
					<line class="zero" x1={a.L} y1={ay(0)} x2={a.R} y2={ay(0)} />
					<path class="trace" d={tracePath} />
					{#if tau > 1}
						<path class="steps-halo" d={stepsPath} />
						<path class="steps-line" d={stepsPath} />
					{/if}
				</g>
			</svg>
			<p class="legend">
				<span><i class="key trace"></i>the record, one of {RECORDS}</span>
				<span
					><i class="key mean"></i><span
						>its averages over <Tex math="\tau" />{#if tau === 1}, here the record itself{/if}</span
					></span
				>
				<span
					><i class="key band"></i><span
						>the band <Tex math={`\\pm\\,\\sigma_{\\bar n}`} />, exact</span
					></span
				>
			</p>
		</div>

		<div class="pair">
			<div class="panel">
				<p class="title">
					<span class="letter">(b)</span> The autocorrelation <Tex math="C(t)" />, against the lag
					<Tex math="t" /> in samples
				</p>
				<svg
					viewBox="0 0 {sizeB.w} {sizeB.h}"
					role="img"
					aria-label={labelB}
					class={['lags', { dragging }]}
					onpointerdown={press}
					onpointermove={move}
					onpointerup={release}
					onpointercancel={release}
					{@attach holdB}
					{@attach fitText()}
				>
					<rect class="shade" x={bx(-tau)} y={b.T} width={bx(tau) - bx(-tau)} height={b.B - b.T} />
					<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
					<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
					<line class="zero" x1={b.L} y1={by(0)} x2={b.R} y2={by(0)} />
					{#each ticksB as v (v)}
						<line class="tick" x1={b.L - 4} y1={by(v)} x2={b.L} y2={by(v)} />
						<text class="num" x={b.L - 7} y={by(v) + 3.8} text-anchor="end">{minus(v)}</text>
					{/each}
					{#each lagTicks as t (t)}
						<line class="tick" x1={bx(t)} y1={b.B} x2={bx(t)} y2={b.B + 4} />
						<text class="num" x={bx(t)} y={b.B + 16} text-anchor={t === 200 ? 'end' : 'middle'}
							>{minus(t)}</text
						>
					{/each}

					<path class="exact" d={exactC} />
					<path class="dots" d={dotsC} />

					<g class="grip" transform="translate({f1(bx(tau))} {f1(b.T + 5)})">
						<circle class="hit" r="14" />
						<circle class="knob" r="4.5" />
					</g>
				</svg>
				<p class="legend">
					<span><i class="key exact"></i>exact</span>
					<span><i class="key dot"></i>measured, {RECORDS} records</span>
					<span><i class="key shade"></i><span>lags shorter than <Tex math="\tau" /></span></span>
				</p>
			</div>

			<div class="panel">
				<p class="title">
					<span class="letter">(c)</span> The spectrum <Tex math="S(\omega)" />, two-sided, against
					<Tex math="\omega" /> in radians per sample
				</p>
				<svg viewBox="0 0 {sizeB.w} {sizeB.h}" role="img" aria-label={labelC} {@attach fitText()}>
					<defs>
						<clipPath id="{uid}-c">
							<rect x={b.L} y={b.T} width={b.R - b.L} height={b.B - b.T} />
						</clipPath>
					</defs>
					<rect class="shade" x={b.L} y={b.T} width={cx(1 / tau) - b.L} height={b.B - b.T} />
					<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
					<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
					{#each ticksS as s (s)}
						<line class="tick" x1={b.L - 4} y1={cy(s)} x2={b.L} y2={cy(s)} />
						<text class="num" x={b.L - 7} y={cy(s) + 3.8} text-anchor="end">{s}</text>
					{/each}
					{#each freqTicks as f (f.label)}
						<line class="tick" x1={cx(f.w)} y1={b.B} x2={cx(f.w)} y2={b.B + 4} />
						<text
							class="num"
							x={cx(f.w)}
							y={b.B + 16}
							text-anchor={f.label === 'π' ? 'end' : 'middle'}>{f.label}</text
						>
					{/each}

					<g clip-path="url(#{uid}-c)">
						<path class="exact" d={exactS} />
						<path class="dots" d={dotsS} />
					</g>
				</svg>
				<p class="legend">
					<span><i class="key exact"></i>exact</span>
					<span><i class="key dot"></i>measured, {RECORDS} records</span>
					<span><i class="key shade"></i><span>below <Tex math="1/\tau" /></span></span>
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="row-controls">
			<div class="kinds" role="radiogroup" aria-label="Kind of noise">
				{#each KINDS as k (k)}
					<button
						type="button"
						role="radio"
						aria-checked={kind === k}
						tabindex={kind === k ? 0 : -1}
						onclick={() => setKind(k)}
						onkeydown={kindKeys}
						{@attach holdKind(k)}
					>
						<HugeiconsIcon icon={KIND_NAMES[k].icon} size={16} strokeWidth={1.7} />
						{KIND_NAMES[k].label}
					</button>
				{/each}
			</div>
			<button type="button" class="redraw" onclick={() => (seed += 1)}>
				<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
				New draw
			</button>
		</div>
		<Slider
			id="{uid}-tau"
			label="Averaging time"
			icon={ChartAverageIcon}
			min={0}
			max={LADDER.length - 1}
			step={1}
			bind:value={() => rung, setRung}
			readout="τ = {samples(tau)}"
			ends={['1 sample', '100']}
			marks={[10, 100].map((m) => ({ at: LADDER.indexOf(m), label: `${m} samples` }))}
			marksHint="the ticks mark 10 and 100 samples"
		/>
		<p class="hint">
			Choose a kind of noise, then drag the slider or the point at the top of (b). With the
			keyboard, reach the kinds and the slider with Tab and use the arrow keys; the dice draw the
			records again.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The noise</dt>
				<dd>
					<Tex math={formula[kind]} /><span class="also">
						{#if kind === 'white'}
							readings at different instants are uncorrelated
						{:else if kind === 'red'}
							a slow wander that lasts <Tex math={`\\tau_c = ${RED_TC}`} /> samples, over a white floor
						{:else}
							<Tex math={`\\tau_c = ${NARROW_TC}`} /> samples and a period of {NARROW_PERIOD},
							<Tex math={`\\omega_0 = 2\\pi/${NARROW_PERIOD} = 0.31`} /> radian per sample
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>At zero frequency</dt>
				<dd>
					<Tex math={zeroTex} /><span class="also">
						{#if kind === 'white'}
							the same as at every other frequency
						{:else if kind === 'red'}
							the spectrum piles up toward zero frequency
						{:else}
							far below the peak at <Tex math="\omega_0" />, where <Tex math="S = 40" />
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Averaging time</dt>
				<dd>
					<Tex math={`\\tau = ${tau}\\ \\text{${tau === 1 ? 'sample' : 'samples'}}`} /><span
						class="also"
						>an average keeps the frequencies below about <Tex math={`1/\\tau = ${two(1 / tau)}`} /> radian
						per sample</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Spread of the averages</dt>
				<dd>
					<Tex math={`\\sigma_{\\bar n} = ${two(spread)}`} /><span class="also"
						>measured over the {RECORDS} records; exactly {three(exactSd)}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The law of white noise</dt>
				<dd>
					<Tex math={`\\sqrt{S(0)/\\tau} = \\sqrt{${s0Text}/${tau}} = ${two(lawSd)}`} /><span
						class="also"
					>
						{#if kind === 'white'}
							It holds at every <Tex math="\tau" />, because the readings are uncorrelated.
						{:else if kind === 'red'}
							It does not apply: <Tex math="\tau" /> is far shorter than
							<Tex math={`\\tau_c = ${RED_TC}`} /> samples, so each average is little different from one
							reading, and its spread stays near <Tex math="\sigma_n = 1" />.
						{:else if tau < NARROW_TC}
							It does not apply yet: <Tex math="\tau" /> is shorter than
							<Tex math={`\\tau_c = ${NARROW_TC}`} /> samples, and the average depends on how many whole
							swings it holds.
						{:else}
							It is near: the exact spread is {above}% above it, because <Tex math="\tau" /> is not yet
							much longer than <Tex math={`\\tau_c = ${NARROW_TC}`} /> samples. It holds once
							<Tex math="\tau \gg \tau_c" />.
						{/if}
					</span>
				</dd>
			</div>
		</dl>
		<p class="note">
			Time is counted in samples, one reading each, so the chapter’s integrals over time become
			sums: the spectrum is <Tex math={`S(\\omega) = \\sum_t C(t)\\,e^{i\\omega t}`} />, for <Tex
				math="\omega"
			/>
			between <Tex math="-\pi" /> and <Tex math="\pi" /> radians per sample. The noise is in units of
			its standard deviation, <Tex math="\sigma_n = 1" />, so <Tex math="C(0) = 1" /> for every kind.
			Each draw makes {RECORDS} records of {SAMPLES} samples; (a) shows the first.
		</p>
		<p class="note">
			In (b), each record is multiplied by a copy of itself shifted by <Tex math="t" />, and the
			product is averaged along the record and over the records; <Tex math="C" /> is even, so the left
			half mirrors the right. In (c), the dots are the mean of <Tex math="|\tilde n(\omega)|^2/T" /> over
			the records, gathered in bands of frequency; each record is first faded in and out at its ends,
			so that the slow wander of red noise does not spill into other frequencies. A record of {SAMPLES}
			samples tells apart no frequencies below a few times <Tex math="2\pi/2048 = 0.003" />, so the
			dots start there; the exact curve goes on to the left, where its height is <Tex
				math="S(0)"
			/>. The spectrum is two-sided: the same values lie at negative <Tex math="\omega" />, not
			drawn.
		</p>
	</div>
</div>

<style>
	.noise-spectrum {
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
	.redraw:focus-visible,
	.kinds button:focus-visible {
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

	/* --- the panels ------------------------------------------------------------------------ */

	.stage {
		display: grid;
		gap: 1rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
	}

	.panel {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.panel p {
		margin: 0;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
	}

	/* side by side, the two titles keep the same height, so that the drawings line up */
	.pair .title {
		min-height: 2.6em;
	}

	.tally {
		color: var(--text);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.letter {
		font: italic 500 0.85rem/1 var(--font-serif);
		color: var(--text);
		margin-right: 0.2rem;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.lags {
		/* the open panel lets a finger scroll the page; only the handle takes a drag */
		touch-action: pan-y;
		cursor: ew-resize;
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.trace {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
		stroke-linejoin: round;
	}

	.band {
		fill: color-mix(in srgb, var(--accent) 13%, transparent);
	}

	.steps-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.75;
		stroke-linejoin: round;
	}

	.steps-line {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.shade {
		fill: color-mix(in srgb, var(--accent) 10%, transparent);
	}

	.exact {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the measured points: round ends of strokes of no length */
	.dots {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-linecap: round;
	}

	.grip {
		cursor: grab;
		touch-action: none;
	}

	svg.dragging,
	svg.dragging .grip {
		cursor: grabbing;
	}

	.hit {
		fill: transparent;
	}

	.knob {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin-top: 0.35rem !important;
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
	}

	.legend > span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.key {
		flex: none;
		display: inline-block;
		width: 1rem;
		height: 0;
		border-top: 2px solid;
	}

	.key.trace {
		border-top: 1px solid color-mix(in srgb, var(--text) 45%, transparent);
	}

	.key.mean {
		border-color: var(--accent);
	}

	.key.exact {
		border-top: 1px solid var(--text);
	}

	.key.dot {
		width: 0.4rem;
		height: 0.4rem;
		border: 0;
		border-radius: 50%;
		background: var(--accent);
	}

	.key.band,
	.key.shade {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent) 24%, transparent);
	}

	.key.shade {
		background: color-mix(in srgb, var(--accent) 18%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.row-controls {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	/* the kinds, drawn as the site's segmented choice */
	.kinds {
		flex: 1 1 auto;
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.kinds button {
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
			background 0.15s,
			color 0.15s;
	}

	.kinds button[aria-checked='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.kinds button[aria-checked='true'] :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.kinds button[aria-checked='false']:hover {
			color: var(--text);
		}

		.redraw:hover {
			border-color: var(--accent);
		}
	}

	.redraw {
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

	.redraw :global(svg) {
		color: var(--accent);
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
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
		gap: 0.45rem;
	}

	.row {
		display: grid;
		grid-template-columns: 10rem 1fr;
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
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.pair {
			grid-template-columns: minmax(0, 1fr);
		}

		.pair .title {
			min-height: 0;
		}

		.row-controls {
			flex-wrap: wrap;
		}

		.kinds {
			flex-basis: 100%;
		}

		.kinds button {
			gap: 0.3rem;
			padding: 0.3rem 0.25rem;
			white-space: nowrap;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.redraw,
		.kinds button {
			transition: none;
		}
	}
</style>
