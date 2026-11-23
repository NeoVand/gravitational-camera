<script lang="ts">
	/**
	 * Chapter 3.1's square-root law. (a) Two and a half hours of one-second readings of a gradiometer, x = s + n,
	 * with the person away (s = 0), one metre away (s = 9.34 E) and away again, fifty minutes each, and a noise of
	 * σ_n = 30 E in each reading; over them, the averages of successive blocks of N readings, and the band, the
	 * person's tide ± σ_x̄, in which an average lies two times in three. (b) The noise of the average against N on
	 * logarithmic axes: the law σ_n/√N, the step s it must fall below, and the noise this draw's average shows. The
	 * numbers come from ./averaging-noise.ts. Two predictions at the top are answered once the reader has done what
	 * they ask. Nothing moves by itself.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ChartAverageIcon, DiceIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		BEST_NOISE,
		BEST_RATIO,
		LADDER,
		MEASURED,
		MOST,
		NOISE,
		RECORD,
		STAY,
		TIDE,
		averaged,
		draw,
		measuredNoise,
		nearestRung,
		noiseOfAverage,
		readings,
		stepAppears
	} from './averaging-noise';

	const uid = $props.id();

	// --- the choices: how many readings are averaged, and the draw ------------------------------------------------
	let rung = $state(0);
	const n = $derived(LADDER[rung]);
	let seed = $state(1);

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The most readings averaged so far. */
	let most = $state(1);
	const revealed = $derived(step === 1 ? most >= 4 : most >= 10);

	function setRung(i: number) {
		rung = Math.max(0, Math.min(LADDER.length - 1, Math.round(i)));
		most = Math.max(most, LADDER[rung]);
	}

	// --- the record -------------------------------------------------------------------------------------------------
	const record = $derived(draw(seed));
	const raw = $derived(readings(record));
	const mean = $derived(averaged(record, n));
	const sigmaBar = $derived(noiseOfAverage(n));
	const measuredNow = $derived(measuredNoise(record, n));
	const measured = $derived(MEASURED.map((m) => ({ n: m, sigma: measuredNoise(record, m) })));

	// --- the drawing's bounds: on a phone the panels are narrower -----------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const sizeA = $derived(phone.current ? { w: 332, h: 230 } : { w: 672, h: 236 });
	const sizeB = $derived(phone.current ? { w: 332, h: 196 } : { w: 672, h: 178 });
	const f1 = (x: number) => x.toFixed(1);

	// --- panel (a): the readings against time -------------------------------------------------------------------------
	const Y_LOW = -42;
	const Y_HIGH = 52;
	const a = $derived({ L: 30, R: sizeA.w - 6, T: 6, B: sizeA.h - 22 });
	const ax = (seconds: number) => a.L + (seconds / RECORD) * (a.R - a.L);
	const ay = (v: number) => a.B - ((v - Y_LOW) / (Y_HIGH - Y_LOW)) * (a.B - a.T);

	/** Values, one to each block of `width` seconds, as dots at the middles of their blocks: one path of round caps. */
	function dots(values: Float64Array, width: number) {
		let d = '';
		for (let j = 0; j < values.length; j++)
			d += `M${f1(ax((j + 0.5) * width))},${f1(ay(values[j]))}h0`;
		return d;
	}
	const rawDots = $derived(dots(raw, 1));
	const meanDots = $derived(dots(mean.reading, n));
	/**
	 * The dots of the averages grow as they get fewer: 1.6 units across for one reading, 6 for a thousand, and a
	 * quarter smaller on a phone, where the record is drawn half as wide.
	 */
	const meanSize = $derived((1.6 + (4.4 * Math.log10(n)) / 3) * (phone.current ? 0.75 : 1));

	/** The person's tide, and the band ± σ_x̄ about it: the person is there in the middle stay. */
	const tideLine = $derived(
		`M${f1(a.L)},${f1(ay(0))}H${f1(ax(STAY))}V${f1(ay(TIDE))}H${f1(ax(2 * STAY))}V${f1(ay(0))}H${f1(a.R)}`
	);
	const band = $derived.by(() => {
		const up = (v: number) => f1(ay(v + sigmaBar));
		const down = (v: number) => f1(ay(v - sigmaBar));
		const [x0, x1, x2, x3] = [a.L, ax(STAY), ax(2 * STAY), a.R].map(f1);
		return (
			`M${x0},${up(0)}H${x1}V${up(TIDE)}H${x2}V${up(0)}H${x3}` +
			`V${down(0)}H${x2}V${down(TIDE)}H${x1}V${down(0)}H${x0}Z`
		);
	});

	const ticksY = [-40, -20, 0, 20, 40];
	const minutes = $derived(phone.current ? [0, 50, 100, 150] : [0, 25, 50, 75, 100, 125, 150]);
	const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

	// --- panel (b): the noise of the average against N, both logarithmic ---------------------------------------------
	const LOG_N_LOW = -0.1;
	const LOG_N_HIGH = 3.1;
	const LOG_S_LOW = Math.log10(0.55);
	const LOG_S_HIGH = Math.log10(55);
	const b = $derived({ L: 30, R: sizeB.w - 10, T: 6, B: sizeB.h - 22 });
	const bx = (m: number) =>
		b.L + ((Math.log10(m) - LOG_N_LOW) / (LOG_N_HIGH - LOG_N_LOW)) * (b.R - b.L);
	const by = (s: number) =>
		b.B - ((Math.log10(s) - LOG_S_LOW) / (LOG_S_HIGH - LOG_S_LOW)) * (b.B - b.T);
	const crossing = stepAppears();

	// moving N by pointer: the handle, or anywhere on the panel with a mouse or a pen
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
		const logN = LOG_N_LOW + ((p.x - b.L) / (b.R - b.L)) * (LOG_N_HIGH - LOG_N_LOW);
		return nearestRung(10 ** logN);
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

	// --- the numbers ----------------------------------------------------------------------------------------------------
	/** Two figures, keeping a final zero: "30", "15", "9.5", "3.0", "0.95". */
	const two = (x: number) => (x >= 99.5 ? String(Math.round(x)) : x.toPrecision(2));
	const ratioNow = $derived(TIDE / sigmaBar);
	const bestNow = $derived(BEST_RATIO * Math.sqrt(n));
	/** A time of readings, one a second: "10 s", "2.5 minutes", "17 minutes". */
	const seconds = (s: number) =>
		s < 120 ? `${s} s` : `${Number((s / 60).toPrecision(2))} minutes`;
	const readingsWord = (m: number) => (m === 1 ? 'reading' : 'readings');

	const labelA = $derived(
		`Two and a half hours of one-second readings, noise 30 eötvös each, while the person steps in for fifty minutes and out again; the ${RECORD / n} averages of ${n} ${readingsWord(n)} each scatter by about ${two(sigmaBar)} eötvös about the person’s tide, a step of 9.34`
	);
	const labelB = $derived(
		`The noise of the average against the number of readings averaged, both on logarithmic scales: the line 30 over root N falls below the step of 9.34 eötvös at N = ${crossing.toFixed(1)}; at N = ${n} it is ${two(sigmaBar)}, and this draw measures ${two(measuredNow)}`
	);
</script>

<div class="averaging-noise">
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
				How much longer must you average to halve the noise?
			{:else}
				How many readings must be averaged before the person’s step of 9.34 E shows through a noise
				of 30 E?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Four times as long.</strong> The noise of the average of <Tex math="N" /> readings is
				<Tex math={'\\sigma_{\\bar x} = \\sigma_n/\\sqrt{N}'} />, so to halve it <Tex
					math={'\\sqrt{N}'}
				/> must double, and <Tex math="N" /> grow fourfold: four readings give
				<Tex math={'30/\\sqrt{4} = 15\\,\\mathrm{E}'} />. Averaging four readings halves the noise;
				it does not quarter it.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>About ten.</strong> The step shows once the noise of the average has fallen to the
				size of the step, <Tex math={'\\sigma_n/\\sqrt{N} = s'} />, at
				<Tex math={`N = (\\sigma_n/s)^2 = (30/9.34)^2 = ${crossing.toFixed(1)}`} />. There the
				signal-to-noise ratio is about one; at a hundred readings it is 3.1, and at a thousand 9.8.
			{:else if step === 1}
				The answer appears when the noise of the average, in the readouts, is half of 30 E or less.
			{:else}
				The answer appears when you have averaged enough readings to see the step: move the slider
				up until you do.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title">
				<span class="letter">(a)</span> The readings, and their averages
				<strong class="tally">{n}</strong> at a time, in eötvös
			</p>
			<svg viewBox="0 0 {sizeA.w} {sizeA.h}" role="img" aria-label={labelA} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-a">
						<rect x={a.L} y={a.T} width={a.R - a.L} height={a.B - a.T} />
					</clipPath>
				</defs>

				<!-- the axes -->
				<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
				<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
				{#each ticksY as v (v)}
					<line class="tick" x1={a.L - 4} y1={ay(v)} x2={a.L} y2={ay(v)} />
					<text class="num" x={a.L - 7} y={ay(v) + 3.8} text-anchor="end">{minus(v)}</text>
				{/each}
				{#each minutes as m (m)}
					<line class="tick" x1={ax(m * 60)} y1={a.B} x2={ax(m * 60)} y2={a.B + 4} />
					<text
						class="num"
						x={ax(m * 60)}
						y={a.B + 16}
						text-anchor={m === 0 ? 'start' : m === 150 ? 'end' : 'middle'}
						>{m === 150 ? '150 min' : m}</text
					>
				{/each}

				<g clip-path="url(#{uid}-a)">
					<path class="band" d={band} />
					<path
						class="raw"
						d={rawDots}
						style:stroke-width="calc({phone.current ? 1.1 : 1.4}px * var(--u, 1))"
					/>
					<path class="mean" d={meanDots} style:stroke-width="calc({meanSize}px * var(--u, 1))" />
					<path class="tide-halo" d={tideLine} />
					<path class="tide" d={tideLine} />
				</g>
			</svg>
			<p class="legend">
				<span><i class="key raw"></i>the readings, <Tex math="x = s + n" /></span>
				<span><i class="key mean"></i>averages of <Tex math="N" /> readings</span>
				<span><i class="key tide"></i>the person’s tide <Tex math="s" /></span>
				<span><i class="key band"></i><Tex math={'\\pm\\,\\sigma_{\\bar x}'} /> about it</span>
			</p>
		</div>

		<div class="panel">
			<p class="title">
				<span class="letter">(b)</span> The noise of the average, in eötvös, against the number
				averaged, <Tex math="N" />
			</p>
			<svg
				viewBox="0 0 {sizeB.w} {sizeB.h}"
				role="img"
				aria-label={labelB}
				class={['law', { dragging }]}
				onpointerdown={press}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdB}
				{@attach fitText()}
			>
				<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
				<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
				{#each [1, 3, 10, 30] as s (s)}
					<line class="tick" x1={b.L - 4} y1={by(s)} x2={b.L} y2={by(s)} />
					<text class="num" x={b.L - 7} y={by(s) + 3.8} text-anchor="end">{s}</text>
				{/each}
				{#each [1, 10, 100, 1000] as m (m)}
					<line class="tick" x1={bx(m)} y1={b.B} x2={bx(m)} y2={b.B + 4} />
					<text class="num" x={bx(m)} y={b.B + 16} text-anchor="middle">{m}</text>
				{/each}

				<!-- the step, the law, and where they cross -->
				<line class="step" x1={b.L} y1={by(TIDE)} x2={b.R} y2={by(TIDE)} />
				<line
					class="law-line"
					x1={bx(1)}
					y1={by(NOISE)}
					x2={bx(MOST)}
					y2={by(noiseOfAverage(MOST))}
				/>
				<line class="drop" x1={bx(crossing)} y1={by(TIDE)} x2={bx(crossing)} y2={b.B} />
				<circle class="cross" cx={bx(crossing)} cy={by(TIDE)} r="3.2" />

				<!-- this draw -->
				{#each measured as p (p.n)}
					<circle class="measured" cx={f1(bx(p.n))} cy={f1(by(p.sigma))} r="3" />
				{/each}

				<!-- the number averaged now, and its handle -->
				{#if Math.abs(Math.log10(n / crossing)) > 0.05}
					<line class="guide" x1={bx(n)} y1={by(sigmaBar)} x2={bx(n)} y2={b.B} />
				{/if}
				<g class="grip" transform="translate({f1(bx(n))} {f1(by(sigmaBar))})">
					<circle class="hit" r="14" />
					<circle class="knob" r="5" />
				</g>
			</svg>
			<p class="legend">
				<span><i class="key law"></i><Tex math={'\\sigma_{\\bar x} = \\sigma_n/\\sqrt{N}'} /></span>
				<span><i class="key measured"></i>this draw</span>
				<span><i class="key step"></i>the step, <Tex math={'s = 9.34\\,\\mathrm{E}'} /></span>
			</p>
		</div>
	</div>

	<div class="bar">
		<div class="row-controls">
			<div class="grow">
				<Slider
					id="{uid}-n"
					label="Readings averaged"
					icon={ChartAverageIcon}
					min={0}
					max={LADDER.length - 1}
					step={1}
					bind:value={() => rung, setRung}
					readout="{n} {readingsWord(n)}, {seconds(n)}"
					ends={['1', '1000']}
					marks={[4, 10, 100, 1000].map((m) => ({
						at: LADDER.indexOf(m),
						label: `${m} readings`
					}))}
					marksHint="the ticks mark 4, 10, 100 and 1000 readings"
				/>
			</div>
			<button type="button" class="redraw" onclick={() => (seed += 1)}>
				<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
				New draw
			</button>
		</div>
		<p class="hint">
			Drag the slider or the point on the line in (b), or reach the slider with Tab and use the
			arrow keys; the dice draw the noise again.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Readings averaged</dt>
				<dd>
					<Tex math={`N = ${n}`} /><span class="also"
						>{n === 1 ? 'a single reading' : `${seconds(n)}, at one reading a second`}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Noise of one reading</dt>
				<dd>
					<Tex math={`\\sigma_n = ${NOISE}\\,\\mathrm{E}`} /><span class="also"
						>{Math.round(NOISE / BEST_NOISE)} times the best gradiometer’s 0.02 E</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Noise of the average</dt>
				<dd>
					<Tex
						math={`\\sigma_{\\bar x} = \\sigma_n/\\sqrt{N} = ${NOISE}/\\sqrt{${n}} = ${two(sigmaBar)}\\,\\mathrm{E}`}
					/><span class="also">this draw shows {two(measuredNow)} E</span>
				</dd>
			</div>
			<div class="row">
				<dt>Signal to noise</dt>
				<dd>
					<Tex math={`s/\\sigma_{\\bar x} = 9.34/${two(sigmaBar)} = ${two(ratioNow)}`} /><span
						class="also"
						>with 0.02 E it would be <Tex math={`467\\sqrt{N} = ${texNumber(bestNow, 3)}`} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each reading is the person’s tide <Tex math="s" />, 9.34 E while the person stands one metre
			away and zero while away, plus a noise <Tex math="n" /> of mean zero and standard deviation
			<Tex math={'\\sigma_n = 30\\,\\mathrm{E}'} />, drawn afresh each second. That is 1500 times
			the noise of the best laboratory gradiometer, which sees the step in a single reading at a
			ratio of 467; at 30 E the step is hidden. The person stays fifty minutes at a time, longer
			than the longest average, so that averaging does not blur the step.
		</p>
		<p class="note">
			Each dot in (a) is the average of <Tex math="N" /> successive readings, drawn at the middle of the
			time they take; the record holds <Tex math={`9000/N = ${RECORD / n}`} /> of them, independent of
			one another. An average lies within the band, the person’s tide <Tex
				math={'\\pm\\,\\sigma_{\\bar x}'}
			/>, 68.3% of the time. In (b) both axes are logarithmic, and the circles are the noise of this
			draw’s averages, measured over the whole record; at large <Tex math="N" /> there are fewer averages
			to measure it with, so the circles stray further from the line.
		</p>
	</div>
</div>

<style>
	.averaging-noise {
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
	.redraw:focus-visible {
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

	.panel {
		min-width: 0;
	}

	.panel p {
		margin: 0;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
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

	svg.law {
		/* the open panel lets a finger scroll the page; only the handle takes a drag */
		touch-action: pan-y;
		cursor: ew-resize;
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	/* the readings and their averages: dots, drawn as the round ends of strokes of no length */
	.raw {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
		stroke-linecap: round;
	}

	.mean {
		fill: none;
		stroke: var(--accent);
		stroke-linecap: round;
	}

	.band {
		fill: color-mix(in srgb, var(--accent) 13%, transparent);
		stroke: none;
	}

	.tide-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.2px * var(--u, 1));
		stroke-opacity: 0.7;
	}

	.tide {
		fill: none;
		stroke: var(--q-curv);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.step {
		stroke: var(--q-curv);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.law-line {
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.drop,
	.guide {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.cross {
		fill: var(--q-curv);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.measured {
		fill: var(--bg);
		stroke: var(--accent);
		stroke-width: calc(1.2px * var(--u, 1));
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

	.legend span {
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

	.key.raw,
	.key.mean {
		width: 0.4rem;
		height: 0.4rem;
		border: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--text) 35%, transparent);
	}

	.key.mean {
		background: var(--accent);
	}

	.key.law {
		border-color: var(--accent);
	}

	.key.tide,
	.key.step {
		border-top: 1.5px dashed var(--q-curv);
	}

	.key.band {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent) 26%, transparent);
	}

	.key.measured {
		width: 0.5rem;
		height: 0.5rem;
		border: 1.2px solid var(--accent);
		border-radius: 50%;
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
		align-items: flex-start;
		gap: 0.9rem;
	}

	.grow {
		flex: 1 1 auto;
		min-width: 0;
	}

	.redraw {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		margin-top: 0.1rem;
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

	@media (hover: hover) {
		.redraw:hover {
			border-color: var(--accent);
		}
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
		gap: 0.35rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem 1fr;
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
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.also {
		color: var(--text-dim);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.row-controls {
			flex-wrap: wrap;
		}

		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.redraw {
			transition: none;
		}
	}
</style>
