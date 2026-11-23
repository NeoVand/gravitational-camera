<script lang="ts">
	/**
	 * Chapter 3.7's blur law, in two linked panels. (a) The strength of each ripple over its noise, q e^(−q), against
	 * the level 1 / (π SNR) that the reader moves with the sensitivity: the ripples between the two crossings survive,
	 * and the upper crossing is the cut-off q_c. (b) The Wiener weight H that follows, and the exact picture of a
	 * point it draws, with its full width at half maximum, beside the sharp-edge approximation of step 5. The cut-off
	 * and the weight come from the engine (../../engine/resolution.ts), the transform from ./blur-law.ts. Two
	 * predictions at the top are answered once the reader has done what they ask.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { Grid3x3Icon, MoreHorizontalIcon, Radar01Icon } from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript, texNumber } from '../../ui/format';
	import { cutoff, transfer } from '../../engine/resolution';
	import {
		ARCMINUTE,
		DEGREE,
		LAW,
		airy,
		decadesFor,
		firstEstimate,
		log10Level,
		log10Signal,
		lowCrossing,
		pointSpread,
		sinc
	} from './blur-law';

	/** The sensitivity, as a power of ten, and its range. */
	const FIRST = 3;
	const LEAST = 1;
	const MOST = 60;
	const STEP = 0.5;
	let decades = $state(FIRST);

	type Sensors = 'plane' | 'row';
	let sensors = $state<Sensors>('plane');

	// --- the predictions ---------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The farthest the sensitivity has moved from where it opened, in powers of ten. */
	let moved = $state(0);
	let reachedTop = $state(false);
	const revealed = $derived(step === 1 ? moved >= 3 - 1e-9 : reachedTop);

	function setDecades(d: number) {
		decades = Math.max(LEAST, Math.min(MOST, d));
		moved = Math.max(moved, Math.abs(decades - FIRST));
		if (decades >= MOST) reachedTop = true;
	}

	// --- the physics -------------------------------------------------------------------------------------------------
	/** How far from the point the picture is drawn, radians. */
	const REACH = 60 * DEGREE;
	const spreadOf = (kind: Sensors, d: number) => pointSpread(kind, d, REACH);

	const qc = $derived(cutoff(decades));
	const qLow = $derived(lowCrossing(decades));
	const estimate = $derived(firstEstimate(decades));
	const level = $derived(log10Level(decades));
	const spread = $derived(spreadOf(sensors, decades));
	const law = $derived(LAW[sensors]);
	const approx = $derived(sensors === 'plane' ? airy : sinc);

	// the answers' numbers, from the same model
	const blurAt = (kind: Sensors, d: number) => spreadOf(kind, d).width / DEGREE;
	const eyeCutoff = LAW.plane / ARCMINUTE;
	const eyeDecades = Math.round(decadesFor(eyeCutoff) / 10) * 10;

	// --- the drawing's bounds: on a phone the panels are narrower and stacked ----------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const sizeA = $derived(
		phone.current ? { w: 332, h: 250, split: 0.3 } : { w: 672, h: 236, split: 0.26 }
	);
	const sizeB = $derived(phone.current ? { w: 332, h: 150 } : { w: 324, h: 172 });
	const sizeC = $derived(phone.current ? { w: 332, h: 170 } : { w: 324, h: 172 });

	// --- panel (a): a q axis logarithmic below 1 and linear above, a logarithmic strength ---------------------------
	const LOG_LEAST = -62;
	const Q_MOST = 160;
	const LV_TOP = 1;
	const LV_BOTTOM = -66;
	const a = $derived({ L: 46, R: sizeA.w - 16, T: 8, B: sizeA.h - 24 });
	const join = $derived(a.L + sizeA.split * (a.R - a.L));

	function qx(q: number) {
		if (q < 1) return a.L + (join - a.L) * (1 - Math.max(LOG_LEAST, Math.log10(q)) / LOG_LEAST);
		return join + ((a.R - join) * (q - 1)) / (Q_MOST - 1);
	}
	const vy = (lv: number) => a.T + ((LV_TOP - lv) / (LV_TOP - LV_BOTTOM)) * (a.B - a.T);

	/** The q of the curve: even in log q below 1, even in q above. */
	const curveQ = [
		...Array.from({ length: 249 }, (_, i) => 10 ** (LOG_LEAST - (LOG_LEAST * i) / 248)),
		...Array.from({ length: 318 }, (_, i) => 1 + ((Q_MOST - 1) * (i + 1)) / 318)
	];
	const f1 = (n: number) => n.toFixed(1);
	const line = (pts: { x: number; y: number }[]) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p.x)},${f1(p.y)}`).join('');

	const curve = $derived(line(curveQ.map((q) => ({ x: qx(q), y: vy(log10Signal(q)) }))));
	const levelY = $derived(vy(level));
	/** The ripples that stand above their noise: between the curve and the level, from one crossing to the other. */
	const band = $derived(
		line(
			[qLow, ...curveQ.filter((q) => q > qLow && q < qc), qc].map((q) => ({
				x: qx(q),
				y: Math.min(levelY, vy(log10Signal(q)))
			}))
		) + 'Z'
	);

	const ticksA = $derived(
		phone.current
			? { log: [-60, -30], linear: [50, 100, 150], level: [0, -30, -60] }
			: { log: [-60, -40, -20], linear: [40, 80, 120, 160], level: [0, -20, -40, -60] }
	);
	const power = (n: number) => (n === 0 ? '1' : `10${superscript(n)}`);

	// moving the level by pointer: the line, or anywhere on the panel with a mouse or a pen
	let svgA: SVGSVGElement | undefined;
	const holdA = (node: SVGSVGElement) => {
		svgA = node;
		return () => (svgA = undefined);
	};
	let dragging = $state(false);

	function decadesAt(e: PointerEvent) {
		const m = svgA?.getScreenCTM();
		if (!m) return decades;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const lv = LV_TOP - ((p.y - a.T) / (a.B - a.T)) * (LV_TOP - LV_BOTTOM);
		return Math.round((-lv - Math.log10(Math.PI)) / STEP) * STEP;
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		// a finger scrolls the page unless it takes the handle
		if (e.pointerType === 'touch' && !(e.target as Element).closest('.grip')) return;
		// a drag is not a click: nothing takes the focus, so no ring is drawn
		e.preventDefault();
		svgA?.setPointerCapture(e.pointerId);
		dragging = true;
		setDecades(decadesAt(e));
	}

	function move(e: PointerEvent) {
		if (dragging) setDecades(decadesAt(e));
	}

	function release() {
		dragging = false;
	}

	// --- panel (b): the weight against q ------------------------------------------------------------------------------
	const b = $derived({ L: 30, R: sizeB.w - 10, T: 8, B: sizeB.h - 22 });
	const bx = (q: number) => b.L + ((b.R - b.L) * q) / Q_MOST;
	const by = (h: number) => b.B - (b.B - b.T) * h;
	const weightQ = Array.from({ length: 641 }, (_, i) => (Q_MOST * i) / 640);
	const weight = $derived(line(weightQ.map((q) => ({ x: bx(q), y: by(transfer(q, decades)) }))));
	const weightFill = $derived(
		`${weight}L${f1(bx(Q_MOST))},${f1(by(0))}L${f1(bx(0))},${f1(by(0))}Z`
	);
	const ticksB = [0, 40, 80, 120, 160];

	// --- panel (b), beside: the picture of a point against angle -------------------------------------------------
	const ANGLE = 60;
	const V_TOP = 1.06;
	const V_BOTTOM = -0.28;
	const c = $derived({ L: 30, R: sizeC.w - 10, T: 8, B: sizeC.h - 22 });
	const cx = (deg: number) => c.L + ((c.R - c.L) * (deg + ANGLE)) / (2 * ANGLE);
	const cy = (v: number) => c.T + ((V_TOP - v) / (V_TOP - V_BOTTOM)) * (c.B - c.T);

	/** A curve over both sides of the point, from samples at 0, θ₁, θ₂, …. */
	function mirrored(theta: Float64Array, v: (i: number) => number) {
		const pts: { x: number; y: number }[] = [];
		for (let i = theta.length - 1; i > 0; i--) pts.push({ x: cx(-theta[i] / DEGREE), y: cy(v(i)) });
		for (let i = 0; i < theta.length; i++) pts.push({ x: cx(theta[i] / DEGREE), y: cy(v(i)) });
		return line(pts);
	}
	const picture = $derived(mirrored(spread.theta, (i) => spread.value[i]));
	const sharp = $derived(mirrored(spread.theta, (i) => approx(qc * spread.theta[i])));
	const halfDeg = $derived(spread.width / 2 / DEGREE);

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const degrees = (x: number) => `${x.toFixed(1)}^\\circ`;
	const snrTex = $derived(`\\mathrm{SNR} = 10^{${decades}}`);
	const lawTex = $derived(sensors === 'plane' ? '4.43' : '3.79');

	/** A number in words for a screen reader: "0.032", "3.2 times ten to the minus 4". */
	function spoken(x: number) {
		if (x >= 0.01) return x.toPrecision(2);
		const e = Math.floor(Math.log10(x));
		return `${(x / 10 ** e).toFixed(1)} times ten to the minus ${-e}`;
	}
	const labelA = $derived(
		`The curve q e to the minus q against q, above the dashed level one over pi SNR from q = ${spoken(qLow)} to the cut-off q c = ${qc.toFixed(1)}`
	);
</script>

<div class="blur-law">
	<section class="predict" aria-labelledby="blur-law-predict">
		<div class="steps">
			<span class="tag" id="blur-law-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Make the camera a thousand times more sensitive. How much sharper will the picture get?
			{:else}
				How sensitive would the camera need to be to match the human eye, one arcminute?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>Only from {blurAt(sensors, 3).toFixed(1)}° to {blurAt(sensors, 6).toFixed(1)}°.</strong
				>
				A thousand times the sensitivity moves the cut-off from {cutoff(3).toFixed(1)} to
				{cutoff(6).toFixed(1)}, because <Tex math="q_c" /> grows like the logarithm of the sensitivity:
				each factor of ten adds a little more than 2.3 to it.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>About <Tex math={'10^{6600}'} />, far beyond this slider.</strong> One arcminute is <Tex
					math={`${texNumber(ARCMINUTE, 2)}`}
				/> radians, so a plane of sensors needs
				<Tex
					math={`q_c = ${LAW.plane.toFixed(2)}/${texNumber(ARCMINUTE, 2)} = ${(Math.round(eyeCutoff / 100) * 100).toLocaleString('en-US').replace(',', '{,}')}`}
				/>
				and <Tex math={`\\mathrm{SNR} = e^{q_c}/\\pi q_c \\approx 10^{${eyeDecades}}`} />. At the
				top of the slider the blur is still {blurAt('plane', MOST).toFixed(1)}°, more than a hundred
				arcminutes.
			{:else if step === 1}
				The answer appears when you have moved the sensitivity by a factor of a thousand.
			{:else}
				The answer appears when the sensitivity reaches the top of the slider.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title"><span class="letter">(a)</span> Each ripple against its noise</p>
			<svg
				viewBox="0 0 {sizeA.w} {sizeA.h}"
				role="img"
				aria-label={labelA}
				class={['cut', { dragging }]}
				onpointerdown={press}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdA}
				{@attach fitText()}
			>
				<defs>
					<clipPath id="blur-law-a">
						<rect x={a.L} y={a.T} width={a.R - a.L} height={a.B - a.T} />
					</clipPath>
				</defs>

				<!-- the axes -->
				<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
				<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
				{#each ticksA.level as lv (lv)}
					<line class="tick" x1={a.L - 4} y1={vy(lv)} x2={a.L} y2={vy(lv)} />
					<text class="num" x={a.L - 7} y={vy(lv) + 3.8} text-anchor="end">{power(lv)}</text>
				{/each}
				{#each ticksA.log as lq (lq)}
					<line class="tick" x1={qx(10 ** lq)} y1={a.B} x2={qx(10 ** lq)} y2={a.B + 4} />
					<text class="num" x={qx(10 ** lq)} y={a.B + 16} text-anchor="middle">{power(lq)}</text>
				{/each}
				<line class="tick" x1={join} y1={a.B} x2={join} y2={a.B + 4} />
				<text class="num" x={join} y={a.B + 16} text-anchor="middle">1</text>
				{#each ticksA.linear as q (q)}
					<line class="tick" x1={qx(q)} y1={a.B} x2={qx(q)} y2={a.B + 4} />
					<text class="num" x={qx(q)} y={a.B + 16} text-anchor="middle">{q}</text>
				{/each}
				<!-- where the q axis changes from logarithmic to linear -->
				<path
					class="break"
					d="M{f1(join + 3)},{f1(a.B - 4)}l-3,8M{f1(join + 6.5)},{f1(a.B - 4)}l-3,8"
				/>

				<g clip-path="url(#blur-law-a)">
					<path class="kept" d={band} />
					<path class="signal" d={curve} />
					<line class="level" x1={a.L} y1={levelY} x2={a.R} y2={levelY} />
					<line class="drop" x1={qx(qLow)} y1={levelY} x2={qx(qLow)} y2={a.B} />
					<line class="drop" x1={qx(qc)} y1={levelY} x2={qx(qc)} y2={a.B} />
					<circle class="cross" cx={qx(qLow)} cy={levelY} r="3.2" />
					<circle class="cross" cx={qx(qc)} cy={levelY} r="3.2" />
				</g>
				<text class="sym" x={qx(qc) + 5} y={levelY - 6}>q<tspan class="sub" dy="3">c</tspan></text>

				<!-- the handle of the level -->
				<g class="grip" transform="translate({f1(a.R + 8)} {f1(levelY)})">
					<circle class="hit" r="14" />
					<circle class="knob" r="5" />
				</g>
			</svg>
			<p class="legend">
				<span><i class="key signal"></i><Tex math={'q\\,e^{-q}'} /></span>
				<span><i class="key level"></i>the noise, <Tex math={'1/(\\pi\\,\\mathrm{SNR})'} /></span>
				<span><i class="key kept"></i>the ripples that survive</span>
			</p>
		</div>

		<div class="pair">
			<div class="panel">
				<p class="title"><span class="letter">(b)</span> The weight of each ripple</p>
				<svg
					viewBox="0 0 {sizeB.w} {sizeB.h}"
					role="img"
					aria-label="The Wiener weight H against q: close to one up to the cut-off q c = {qc.toFixed(
						1
					)}, then zero"
					{@attach fitText()}
				>
					<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
					<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
					{#each [0, 0.5, 1] as h (h)}
						<line class="tick" x1={b.L - 4} y1={by(h)} x2={b.L} y2={by(h)} />
						<text class="num" x={b.L - 7} y={by(h) + 3.8} text-anchor="end"
							>{h === 0.5 ? '½' : h}</text
						>
					{/each}
					{#each ticksB as q (q)}
						<line class="tick" x1={bx(q)} y1={b.B} x2={bx(q)} y2={b.B + 4} />
						<text class="num" x={bx(q)} y={b.B + 16} text-anchor="middle">{q}</text>
					{/each}
					<path class="kept" d={weightFill} />
					<path class="weight" d={weight} />
					<circle class="cross" cx={bx(qc)} cy={by(0.5)} r="3.2" />
					<text class="sym" x={bx(qc) + 6} y={by(0.5) - 6}
						>q<tspan class="sub" dy="3">c</tspan></text
					>
					<text class="sym axis-name" x={b.R} y={b.B - 6} text-anchor="end">q</text>
				</svg>
				<p class="legend">
					<span><i class="key weight"></i><Tex math="H = s^2/(1+s^2)" /></span>
				</p>
			</div>

			<div class="panel">
				<p class="title">The picture of a point</p>
				<svg
					viewBox="0 0 {sizeC.w} {sizeC.h}"
					role="img"
					aria-label="The picture of a point against angle, {spread.width / DEGREE < 10
						? (spread.width / DEGREE).toFixed(1)
						: (spread.width / DEGREE).toFixed(0)} degrees wide at half its height"
					{@attach fitText()}
				>
					<line class="axis" x1={c.L} y1={cy(0)} x2={c.R} y2={cy(0)} />
					<line class="axis" x1={c.L} y1={c.T} x2={c.L} y2={c.B} />
					{#each [0, 0.5, 1] as v (v)}
						<line class="tick" x1={c.L - 4} y1={cy(v)} x2={c.L} y2={cy(v)} />
						<text class="num" x={c.L - 7} y={cy(v) + 3.8} text-anchor="end"
							>{v === 0.5 ? '½' : v}</text
						>
					{/each}
					{#each [-60, -30, 0, 30, 60] as deg (deg)}
						<line class="tick" x1={cx(deg)} y1={c.B} x2={cx(deg)} y2={c.B + 4} />
						<text class="num" x={cx(deg)} y={c.B + 16} text-anchor="middle"
							>{deg < 0 ? '−' : ''}{Math.abs(deg)}°</text
						>
					{/each}
					<line class="axis" x1={c.L} y1={c.B} x2={c.R} y2={c.B} />
					<path class="sharp" d={sharp} />
					<path class="picture" d={picture} />
					<!-- the full width at half maximum -->
					<path
						class="width"
						d="M{f1(cx(-halfDeg))},{f1(cy(0.5))}H{f1(cx(halfDeg))}M{f1(cx(-halfDeg))},{f1(
							cy(0.5) - 3.5
						)}v7M{f1(cx(halfDeg))},{f1(cy(0.5) - 3.5)}v7"
					/>
					<text class="num strong" x={cx(halfDeg) + 6} y={cy(0.5) + 3.8}
						>{(spread.width / DEGREE).toFixed(1)}°</text
					>
				</svg>
				<p class="legend">
					<span><i class="key picture"></i>exact</span>
					<span
						><i class="key sharp"></i>sharp edge, <Tex
							math={sensors === 'plane' ? '2J_1(u)/u' : '\\sin u/u'}
						/></span
					>
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="slide">
			<Slider
				id="blur-law-sensitivity"
				label="Sensitivity"
				icon={Radar01Icon}
				min={LEAST}
				max={MOST}
				step={STEP}
				bind:value={() => decades, setDecades}
				readout="SNR = 10{superscript(decades)}"
				ends={['10', '10⁶⁰']}
				marks={[3, 6, 10, 20, 30, 60].map((d) => ({
					at: d,
					label: `SNR = 10${superscript(d)}, in the chapter’s table`
				}))}
				marksHint="the ticks mark the sensitivities of the chapter’s table"
			/>
		</div>
		<div class="choice">
			<Segmented
				label="Sensors"
				options={[
					{ value: 'plane', label: 'A plane', icon: Grid3x3Icon },
					{ value: 'row', label: 'A row', icon: MoreHorizontalIcon }
				]}
				bind:value={sensors}
			/>
		</div>
		<p class="hint">
			Drag the slider or the dashed line in panel (a), or reach the slider with Tab and use the
			arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Sensitivity</dt>
				<dd><Tex math={snrTex} /></dd>
			</div>
			<div class="row">
				<dt>Cut-off</dt>
				<dd>
					<Tex math={`q_c = ${qc.toFixed(2)}`} /><span class="also"
						>first estimate <Tex
							math={`\\ln(\\pi\\,\\mathrm{SNR}) + \\ln\\ln(\\pi\\,\\mathrm{SNR}) = ${estimate.toFixed(2)}`}
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Coarsest ripple</dt>
				<dd>
					<Tex math={`q = ${texNumber(qLow, 2)}`} /><span class="also"
						>close to <Tex math={'1/(\\pi\\,\\mathrm{SNR})'} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Blur</dt>
				<dd>
					<Tex math={`\\Delta\\theta = ${lawTex}/q_c = ${degrees(law / qc / DEGREE)}`} /><span
						class="also">exact <Tex math={degrees(spread.width / DEGREE)} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			A ripple of fineness <Tex math="q = kz" /> stands above its noise by
			<Tex math={'s = \\pi\\,\\mathrm{SNR}\\,q\\,e^{-q}'} />, so it survives where the curve in (a)
			is above the dashed level. The <Tex math="q" /> axis of (a) is logarithmic left of 1 and linear
			right of it, and its other axis is logarithmic.
		</p>
		<p class="note">
			The solid picture is the exact transform of <Tex math="H" /> for {sensors === 'plane'
				? 'a plane of sensors'
				: 'a row of sensors over line masses'}, with the angle taken as distance over depth. The
			dashed one replaces <Tex math="H" /> by a sharp step at <Tex math="q_c" />, with
			<Tex math="u = q_c\theta" />; its full width is <Tex math={`${lawTex}/q_c`} />.
		</p>
	</div>
</div>

<style>
	.blur-law {
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
	.next:focus-visible {
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
		gap: 0.9rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
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

	svg.cut {
		/* the open panel lets a finger scroll the page; only the handle takes a drag */
		touch-action: pan-y;
		cursor: ns-resize;
	}

	svg.cut:focus {
		outline: none;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.break {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.num.strong {
		fill: var(--text);
		font-weight: 600;
	}

	.sym {
		fill: var(--text);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sym .sub {
		font-size: 0.72em;
		font-style: normal;
	}

	.axis-name {
		fill: var(--text-dim);
	}

	.kept {
		fill: color-mix(in srgb, var(--accent) 22%, transparent);
		stroke: none;
	}

	.signal {
		fill: none;
		stroke: var(--q-curv);
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linejoin: round;
	}

	.level {
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.drop {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.cross {
		fill: var(--accent);
		stroke: var(--bg);
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
		fill: var(--text-dim);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.weight {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linejoin: round;
	}

	.picture {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.sharp {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.width {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
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

	.key.signal {
		border-color: var(--q-curv);
	}

	.key.level {
		border-top: 1.5px dashed var(--text-dim);
	}

	.key.kept {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent) 30%, transparent);
	}

	.key.weight {
		border-color: var(--accent);
	}

	.key.picture {
		border-color: var(--q-matter);
	}

	.key.sharp {
		border-top: 1.5px dashed var(--text-dim);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.2rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slide {
		flex: 1 1 18rem;
		min-width: 0;
	}

	.choice {
		flex: 0 1 13rem;
	}

	.hint {
		flex: 1 1 100%;
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
		.pair {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.9rem;
		}

		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}

		.choice {
			flex: 1 1 100%;
		}
	}
</style>
