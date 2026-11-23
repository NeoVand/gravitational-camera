<script lang="ts">
	/**
	 * Chapter 5.2's near zone and wave zone: the field of one oscillating point source, u = Re[e^{i(kr − ωt)}]/r,
	 * along a line away from it, over two decades of distance on a logarithmic axis. The top panel is a snapshot of
	 * the field, drawn as r u so that its swing is the same at every distance. The bottom panel is its slope ∂u/∂r,
	 * split into the near part and the wave part of the chapter's eq:slope, each drawn multiplied by r², with their
	 * sum: the near part's envelope is 1 and the wave part's is kr, and they cross at kr = 1, the line r = λ/2π. A
	 * probe, dragged or moved with the arrow keys, reads out the two parts' sizes. The distances are kept in metres
	 * for a source near 1 Hz, so that the frequency slider moves the edge over them. Everything is exact, from
	 * ./near-to-wave.ts. Two predictions at the top are answered once the reader has done what they ask. The figure
	 * opens paused, as the chapter asks, so it moves only when the reader presses play.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Clock03Icon,
		PauseIcon,
		PlayIcon,
		RulerIcon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import { texLength, texRatio } from './regime-map';
	import {
		FREQUENCY,
		LAMBDA0,
		OPENING,
		RANGE,
		SPAN,
		crossing,
		delayCycles,
		drawnField,
		drawnNear,
		drawnSlope,
		drawnWave,
		edge,
		fitWindow,
		frequency,
		krAt,
		nearSizeK2,
		placeOf,
		ratio,
		waveSizeK2,
		wavelength,
		windowFrom
	} from './near-to-wave';

	const uid = $props.id();

	/** Cycles of the source in one second on the screen. */
	const RATE = 0.4;
	/** The half-heights of the two panels: the field r u, and the parts of the slope times r². */
	const FIELD_TOP = 1.6;
	const SLOPE_TOP = 3.2;
	const LOG2 = Math.log10(2);

	// --- the settings: all distances as log₁₀ of metres over LAMBDA0, the wavelength at 1 Hz ------------------------
	/** The window's inner end. */
	let lo = $state(OPENING.from);
	/** The frequency, in octaves from 1 Hz. */
	let octaves = $state(OPENING.octaves);
	/** The probe. */
	let probe = $state(placeOf(OPENING.kr, OPENING.octaves));
	/** The source's phase ωt, radians. */
	let wt = $state(0);

	const round = (v: number, s: number) => Math.round(Math.round(v / s) * s * 1e9) / 1e9;
	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	const keepProbe = () => (probe = clamp(probe, lo, lo + SPAN));

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** Set once the probe has stood where the two parts are equal. */
	let equal = $state<{ f: number } | undefined>();
	/** The frequencies heard since the window last moved in metres, in octaves. */
	let heard: number[] = [OPENING.octaves];
	let halved = $state<{ from: number; to: number; kr0: number; kr1: number } | undefined>();
	const revealed = $derived(step === 1 ? equal !== undefined : halved !== undefined);

	function setProbe(place: number) {
		probe = clamp(place, lo, lo + SPAN);
		if (!equal && Math.abs(Math.log10(krAt(probe, octaves))) < 0.005)
			equal = { f: frequency(octaves) };
	}

	// --- the sliders --------------------------------------------------------------------------------------------------
	/** The window's inner end in wavelengths of the frequency now, as log₁₀: the range slider's value. */
	const from = $derived(windowFrom(lo, octaves));

	function setFrom(v: number) {
		const next = clamp(v, RANGE.min, RANGE.max);
		if (Math.abs(next - from) < 1e-9) return;
		lo = next - octaves * LOG2;
		heard = [octaves];
		keepProbe();
	}

	function setOctaves(v: number) {
		const next = round(clamp(v, FREQUENCY.min, FREQUENCY.max), FREQUENCY.step);
		if (next === octaves) return;
		const before = octaves;
		const fitted = fitWindow(lo, next);
		if (Math.abs(fitted - lo) > 1e-9) {
			lo = fitted;
			heard = [];
			keepProbe();
		}
		const kr0 = krAt(probe, before);
		octaves = next;
		if (!heard.includes(next)) heard = [...heard, next];
		if (!halved && heard.some((o) => Math.abs(o - (next + 1)) < 1e-9))
			halved = { from: frequency(next + 1), to: frequency(next), kr0, kr1: krAt(probe, next) };
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(false);

	function togglePlay() {
		playing = !playing;
	}

	function quarter() {
		playing = false;
		wt = round((wt + Math.PI / 2) % (2 * Math.PI), Math.PI / 2);
	}

	const clock: Attachment = () => {
		if (!playing) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			wt = (wt + 2 * Math.PI * RATE * dt) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };

	const layout = $derived.by(() => {
		const narrow = phone.current;
		const W = narrow ? 360 : 640;
		const left = narrow ? 30 : 34;
		const top: Box = { x: 0, y: 22, w: W, h: narrow ? 108 : 120 };
		const bottom: Box = { x: 0, y: top.y + top.h + 30, w: W, h: narrow ? 196 : 216 };
		const inner = { x: left, w: W - left - 12 };
		const H = bottom.y + bottom.h + 42;
		return { W, H, top, bottom, inner, samples: narrow ? 320 : 520 };
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (v: number) => v.toFixed(2);
	const X = (place: number) => layout.inner.x + ((place - lo) / SPAN) * layout.inner.w;
	const Yt = (v: number) =>
		layout.top.y + layout.top.h / 2 - (v / FIELD_TOP) * (layout.top.h / 2 - 4);
	const Yb = (v: number) =>
		layout.bottom.y +
		layout.bottom.h / 2 -
		(clamp(v, -1.5 * SLOPE_TOP, 1.5 * SLOPE_TOP) / SLOPE_TOP) * (layout.bottom.h / 2 - 4);

	// --- the curves -------------------------------------------------------------------------------------------------
	function curve(y: (v: number) => number, get: (kr: number) => number) {
		const n = layout.samples;
		let d = '';
		for (let j = 0; j <= n; j++) {
			const place = lo + (SPAN * j) / n;
			d += `${j ? 'L' : 'M'}${f2(X(place))},${f2(y(get(krAt(place, octaves))))}`;
		}
		return d;
	}

	const curves = $derived({
		field: curve(Yt, (kr) => drawnField(kr, wt)),
		near: curve(Yb, (kr) => drawnNear(kr, wt)),
		wave: curve(Yb, (kr) => drawnWave(kr, wt)),
		sum: curve(Yb, (kr) => drawnSlope(kr, wt))
	});

	const envelopes = $derived.by(() => {
		const near = `M${f2(X(lo))},${f2(Yb(1))}H${f2(X(lo + SPAN))}M${f2(X(lo))},${f2(Yb(-1))}H${f2(X(lo + SPAN))}`;
		return {
			near,
			wave: curve(Yb, (kr) => kr) + curve(Yb, (kr) => -kr)
		};
	});

	// --- the axes -----------------------------------------------------------------------------------------------------
	/** The edge r = λ/2π, where kr = 1. */
	const edgeAt = $derived(placeOf(1, octaves));

	/** Ticks of r/λ at 1 and 3 times the powers of ten, in the window. */
	const lambdaTicks = $derived.by(() => {
		const out: { place: number; label: string }[] = [];
		for (let e = -3; e <= 1; e++)
			for (const m of [1, 3]) {
				const v = m * 10 ** e;
				const at = Math.log10(v) - octaves * LOG2;
				if (at >= lo - 1e-9 && at <= lo + SPAN + 1e-9)
					out.push({ place: at, label: String(Number(v.toPrecision(2))) });
			}
		return out;
	});

	/** Ticks of the distance in kilometres, at the powers of ten in the window. */
	const kmTicks = $derived.by(() => {
		const out: { place: number; label: string }[] = [];
		const first = Math.ceil(lo + Math.log10(LAMBDA0 / 1e3) - 1e-9);
		for (let e = first; e <= first + SPAN; e++) {
			const at = e - Math.log10(LAMBDA0 / 1e3);
			if (at <= lo + SPAN + 1e-9) out.push({ place: at, label: `10${superscript(e)}` });
		}
		return out;
	});

	const fieldTicks = [-1, 0, 1];
	const slopeTicks = [-3, -2, -1, 0, 1, 2, 3];

	// --- the probe ----------------------------------------------------------------------------------------------------
	const f = $derived(frequency(octaves));
	const kr = $derived(krAt(probe, octaves));
	const rOverLambda = $derived(kr / (2 * Math.PI));
	const metres = $derived(10 ** probe * LAMBDA0);
	const side = $derived(kr < 1 - 1e-9 ? 'near' : kr > 1 + 1e-9 ? 'wave' : 'edge');
	const dots = $derived({
		field: Yt(drawnField(kr, wt)),
		near: Yb(drawnNear(kr, wt)),
		wave: Math.abs(drawnWave(kr, wt)) <= SLOPE_TOP * 1.04 ? Yb(drawnWave(kr, wt)) : undefined,
		sum: Math.abs(drawnSlope(kr, wt)) <= SLOPE_TOP * 1.04 ? Yb(drawnSlope(kr, wt)) : undefined
	});

	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	/** A drag lands on the edge within this many CSS pixels of it, and otherwise on hundredths of a decade of kr. */
	const SNAP = 6;
	const GRID = 0.01;

	function placeAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		if (Math.abs(p.x - X(edgeAt)) < SNAP * u) return setProbe(edgeAt);
		const place = lo + ((p.x - layout.inner.x) / layout.inner.w) * SPAN;
		const lkr = round(Math.log10(krAt(clamp(place, lo, lo + SPAN), octaves)), GRID);
		setProbe(placeOf(10 ** lkr, octaves));
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) placeAt(pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		// a drag is not a click: the probe does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
	}

	/** A press on the open drawing, with a mouse or a pen, brings the probe there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
		placeAt(e);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = false;
	}

	function key(e: KeyboardEvent) {
		const s = e.shiftKey ? 0.01 : 0.1;
		const d = { ArrowLeft: -s, ArrowDown: -s, ArrowRight: s, ArrowUp: s }[e.key];
		if (d === undefined) return;
		e.preventDefault();
		// on the grid of the step, so that a step lands on kr = 1 exactly
		const lkr = round(Math.log10(kr) + d, s);
		setProbe(placeOf(10 ** lkr, octaves));
	}

	// --- the numbers ----------------------------------------------------------------------------------------------
	const three = (v: number) => String(Number(v.toPrecision(3)));
	const cycles = $derived(wt / (2 * Math.PI));
	const sizeWords = $derived(
		side === 'near'
			? `the near part is the larger, ${three(1 / kr)} times`
			: side === 'wave'
				? `the wave part is the larger, ${three(kr)} times`
				: 'the two are equal: this is the edge'
	);
	const windowTex = $derived(
		`r = ${three(10 ** from)}\\lambda \\text{ to } ${three(10 ** (from + SPAN))}\\lambda`
	);

	// the answers' numbers, from the same model
	const facts1 = $derived(equal ? { f: equal.f, edge: edge(equal.f) } : undefined);
	const facts2 = $derived(
		halved ? { ...halved, before: edge(halved.from), after: edge(halved.to) } : undefined
	);

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`The field of a point source oscillating at ${three(f)} hertz, from ${three(10 ** from)} to ${three(10 ** (from + SPAN))} wavelengths, on a logarithmic axis, at the phase ${cycles.toFixed(2)} of a cycle. ` +
			`Top: the field times r. Bottom: its slope, and its near part and wave part, each times r squared; the near part's envelope is 1, the wave part's is kr, and they cross at the line r equals lambda over 2 pi, ${three(edge(f) / 1e3)} kilometres.`
	);
	const probeLabel = $derived(
		`The probe, at kr = ${three(kr)}, ${three(rOverLambda)} wavelengths: ${side === 'near' ? 'near zone' : side === 'wave' ? 'wave zone' : 'the edge'}; the wave part is kr times the near part. Drag it, or move it a tenth of a decade with the arrow keys.`
	);
</script>

<div class="near-to-wave">
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
				At what distance are the near and wave parts of the slope equal?
			{:else}
				Halve the frequency. Where does the boundary go?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && facts1}
				<strong>At <Tex math="\lambda/2\pi" />, about a sixth of a wavelength.</strong> There
				<Tex math="kr = 1" />, so the near part’s size <Tex math="1/r^2" /> and the wave part’s
				<Tex math="k/r" /> are both <Tex math="k^2" />, and their envelopes cross at the line. The
				<Tex math="2\pi" /> is there because <Tex math="\lambda" /> is one whole turn of the wave’s phase,
				while the edge is where the phase has turned by one radian:
				<Tex math="1/2\pi = 0.159" /> of a wavelength, which at <Tex
					math={`${three(facts1.f)}\\,\\mathrm{Hz}`}
				/> is <Tex math={texLength(facts1.edge)} />. Inside it the near part is the larger, by
				<Tex math="1/kr" />; outside it the wave part is, by <Tex math="kr" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2 && facts2}
				<strong>Twice as far out.</strong> The edge is at <Tex math="r = c/2\pi f" />: at
				<Tex math={`${three(facts2.from)}\\,\\mathrm{Hz}`} /> it was at
				<Tex math={texLength(facts2.before)} />, and at <Tex
					math={`${three(facts2.to)}\\,\\mathrm{Hz}`}
				/> it is at <Tex math={texLength(facts2.after)} />, over the same metres. On the logarithmic
				axis it moved right by <Tex math={'\\log_{10}2 = 0.30'} /> of a decade. At the probe, which stayed
				put, <Tex math="kr" /> halved, from {three(facts2.kr0)} to {three(facts2.kr1)}, and so did
				the wave part’s size against the near part’s.
			{:else if step === 1}
				The answer appears when the probe stands at the distance where the two parts have the same
				size.
			{:else}
				The answer appears when you have halved the frequency with its slider, with the same
				distances shown.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				{#each [['top', layout.top], ['bottom', layout.bottom]] as const as [name, box] (name)}
					<clipPath id="{uid}-{name}">
						<rect x={box.x + 1} y={box.y + 1} width={box.w - 2} height={box.h - 2} rx="7" />
					</clipPath>
				{/each}
			</defs>

			<!-- the field -->
			<text class="title" x="4" y={layout.top.y - 8 * u}
				>The field, drawn as <tspan class="it">r u</tspan></text
			>
			<text class="title end" x={layout.W - 4} y={layout.top.y - 8 * u}
				>{phone.current ? '' : 'the source’s phase '}<tspan class="it">ωt</tspan>/2π = {cycles.toFixed(
					2
				)}</text
			>
			<rect
				class="panel"
				x={layout.top.x + 0.5}
				y={layout.top.y + 0.5}
				width={layout.top.w - 1}
				height={layout.top.h - 1}
				rx="8"
			/>
			<g clip-path="url(#{uid}-top)">
				<rect
					class="zone"
					x={X(lo)}
					y={layout.top.y}
					width={Math.max(0, X(edgeAt) - X(lo))}
					height={layout.top.h}
				/>
				{#each fieldTicks as v (v)}
					<line
						class={['grid', { axis: v === 0 }]}
						x1={layout.inner.x}
						x2={layout.inner.x + layout.inner.w}
						y1={Yt(v)}
						y2={Yt(v)}
					/>
				{/each}
				{#each lambdaTicks as t (t.place)}
					<line
						class="grid"
						x1={X(t.place)}
						x2={X(t.place)}
						y1={layout.top.y}
						y2={layout.top.y + layout.top.h}
					/>
				{/each}
				<line
					class="edge"
					x1={X(edgeAt)}
					x2={X(edgeAt)}
					y1={layout.top.y}
					y2={layout.top.y + layout.top.h}
				/>
				<path class="ink" d={curves.field} />
				<text
					class="zone-name halo"
					x={X(edgeAt) - 7 * u}
					y={layout.top.y + layout.top.h - 7 * u}
					text-anchor="end">near zone</text
				>
				<text class="zone-name halo" x={X(edgeAt) + 7 * u} y={layout.top.y + layout.top.h - 7 * u}
					>wave zone</text
				>
				<text class="small edge-words halo" x={X(edgeAt) + 5 * u} y={layout.top.y + 14 * u}
					><tspan class="it">r</tspan> = <tspan class="it">λ</tspan>/2π</text
				>
			</g>
			{#each fieldTicks as v (v)}
				<text class="small y-tick" x={layout.inner.x - 5 * u} y={Yt(v)}
					>{v < 0 ? '−' : ''}{Math.abs(v)}</text
				>
			{/each}

			<!-- the slope and its two parts -->
			<text class="title" x="4" y={layout.bottom.y - 8 * u}
				>Its slope <tspan class="it">∂u</tspan>/<tspan class="it">∂r</tspan> and its near and wave
				parts, each times <tspan class="it">r</tspan>²</text
			>
			<rect
				class="panel"
				x={layout.bottom.x + 0.5}
				y={layout.bottom.y + 0.5}
				width={layout.bottom.w - 1}
				height={layout.bottom.h - 1}
				rx="8"
			/>
			<g clip-path="url(#{uid}-bottom)">
				<rect
					class="zone"
					x={X(lo)}
					y={layout.bottom.y}
					width={Math.max(0, X(edgeAt) - X(lo))}
					height={layout.bottom.h}
				/>
				{#each slopeTicks as v (v)}
					<line
						class={['grid', { axis: v === 0 }]}
						x1={layout.inner.x}
						x2={layout.inner.x + layout.inner.w}
						y1={Yb(v)}
						y2={Yb(v)}
					/>
				{/each}
				{#each lambdaTicks as t (t.place)}
					<line
						class="grid"
						x1={X(t.place)}
						x2={X(t.place)}
						y1={layout.bottom.y}
						y2={layout.bottom.y + layout.bottom.h}
					/>
				{/each}
				<line
					class="edge"
					x1={X(edgeAt)}
					x2={X(edgeAt)}
					y1={layout.bottom.y}
					y2={layout.bottom.y + layout.bottom.h}
				/>
				<path class="envelope near" d={envelopes.near} />
				<path class="envelope wave" d={envelopes.wave} />
				<path class="part near" d={curves.near} />
				<path class="part wave" d={curves.wave} />
				<path class="ink sum" d={curves.sum} />
			</g>
			{#each slopeTicks as v (v)}
				<text class="small y-tick" x={layout.inner.x - 5 * u} y={Yb(v)}
					>{v < 0 ? '−' : ''}{Math.abs(v)}</text
				>
			{/each}

			<!-- the probe's line, through both panels, and its points on the curves -->
			<line
				class="guide"
				x1={X(probe)}
				x2={X(probe)}
				y1={layout.top.y}
				y2={layout.bottom.y + layout.bottom.h}
			/>
			<circle class="dot ink-dot" cx={X(probe)} cy={dots.field} r={3 * u} />
			<circle class="dot near" cx={X(probe)} cy={dots.near} r={3 * u} />
			{#if dots.wave !== undefined}
				<circle class="dot wave" cx={X(probe)} cy={dots.wave} r={3 * u} />
			{/if}
			{#if dots.sum !== undefined}
				<circle class="dot ink-dot" cx={X(probe)} cy={dots.sum} r={3 * u} />
			{/if}

			<!-- the distance, in wavelengths and in kilometres -->
			{#each lambdaTicks as t (t.place)}
				<text
					class={['small tick', { first: t.place < lo + 1e-6, last: t.place > lo + SPAN - 1e-6 }]}
					x={X(t.place)}
					y={layout.bottom.y + layout.bottom.h + 18 * u}>{t.label}</text
				>
			{/each}
			<text class="small axis-name" x="0" y={layout.bottom.y + layout.bottom.h + 18 * u}
				><tspan class="it">r</tspan>/<tspan class="it">λ</tspan></text
			>
			{#each kmTicks as t (t.place)}
				<text class="small dim tick" x={X(t.place)} y={layout.bottom.y + layout.bottom.h + 33 * u}
					>{t.label}</text
				>
			{/each}
			<text class="small dim axis-name" x="0" y={layout.bottom.y + layout.bottom.h + 33 * u}
				>km</text
			>

			<g
				class={['probe', side]}
				transform="translate({f2(X(probe))} {f2(layout.bottom.y + layout.bottom.h)})"
				role="slider"
				tabindex="0"
				aria-roledescription="movable probe"
				aria-label={probeLabel}
				aria-valuemin={Number(krAt(lo, octaves).toPrecision(3))}
				aria-valuemax={Number(krAt(lo + SPAN, octaves).toPrecision(3))}
				aria-valuenow={Number(kr.toPrecision(3))}
				aria-valuetext="kr = {three(kr)}"
				onpointerdown={grab}
				onkeydown={key}
			>
				<circle class="hit" r={15 * u} />
				<circle class="focus" r={10 * u} />
				<circle class="ring" r={6 * u} />
				<circle class="pin" r={1.5 * u} />
			</g>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch near-key"></span>the near part, <Tex
					math={'-\\mathrm{Re}[e^{i(kr - \\omega t)}]/r^2'}
				/>
			</li>
			<li>
				<span class="swatch wave-key"></span>the wave part, <Tex
					math={'\\mathrm{Re}[ik\\,e^{i(kr - \\omega t)}]/r'}
				/>
			</li>
			<li><span class="swatch ink-key"></span>the field, and the slope, their sum</li>
			<li><span class="swatch envelope-key"></span>the envelopes, 1 and <Tex math="kr" /></li>
			<li><span class="swatch zone-key"></span>the near zone</li>
		</ul>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause' : 'Play'}
				aria-pressed={playing}
				onclick={togglePlay}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<button type="button" class="action" onclick={quarter}>
				<HugeiconsIcon icon={Clock03Icon} size={16} strokeWidth={1.7} />
				A quarter cycle on
			</button>
			<p class="hint">
				Drag the probe along the axis, or reach it with Tab and move it a tenth of a decade with the
				arrow keys (with Shift, a hundredth). The sliders take the arrow keys after Tab.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-range"
				label="Distance shown"
				icon={RulerIcon}
				min={RANGE.min}
				max={RANGE.max}
				step={RANGE.step}
				bind:value={() => from, setFrom}
				readout="{three(10 ** from)}λ to {three(10 ** (from + SPAN))}λ"
				ends={['0.01λ to 1λ', '0.1λ to 10λ']}
			/>
			<Slider
				id="{uid}-frequency"
				label="Frequency, at the same metres"
				icon={WaveIcon}
				min={FREQUENCY.min}
				max={FREQUENCY.max}
				step={FREQUENCY.step}
				bind:value={() => octaves, setOctaves}
				readout="f = {three(f)} Hz"
				ends={['half', 'double']}
				mark={{ at: OPENING.octaves, label: '1 Hz, where it opens' }}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The probe</dt>
				<dd>
					<Tex math={`r/\\lambda = ${texRatio(rOverLambda)}`} /><Tex
						math={`kr = ${texRatio(kr)}`}
					/><span class="also"><Tex math={`r = ${texLength(metres)}`} /></span>
				</dd>
			</div>
			<div class="row">
				<dt>Near part</dt>
				<dd>
					<Tex math={`1/r^2 = ${texRatio(nearSizeK2(kr))}\\,k^2`} /><span class="also"
						>falls as <Tex math="1/r^2" /> and follows the source’s value</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Wave part</dt>
				<dd>
					<Tex math={`k/r = ${texRatio(waveSizeK2(kr))}\\,k^2`} /><span class="also"
						>falls as <Tex math="1/r" /> and follows its rate of change</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Their ratio</dt>
				<dd aria-live="polite">
					<Tex math={`(k/r)/(1/r^2) = kr = ${texRatio(ratio(kr))}`} /><span class="also"
						>{sizeWords}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The timing</dt>
				<dd>
					<Tex math={`kr/2\\pi = ${three(delayCycles(kr))}`} /><span class="also"
						>of a cycle: the delay <Tex math="r/c" />, which both parts share; the wave part reaches
						each of its peaks a quarter cycle before the near part</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The source</dt>
				<dd>
					<Tex math={`f = ${three(f)}\\,\\mathrm{Hz}`} /><Tex
						math={`\\lambda = ${texLength(wavelength(f))}`}
					/><Tex math={`\\lambda/2\\pi = ${texLength(edge(f))}`} /><span class="also"
						><Tex math={windowTex} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The source <Tex math="b = \cos\omega t" /> sits at <Tex math="r = 0" />, off the left of the
			logarithmic axis. The field <Tex math={'u = \\mathrm{Re}[e^{i(kr - \\omega t)}]/r'} /> is drawn
			as
			<Tex math="ru" />, because across two decades <Tex math="u" /> itself changes a hundredfold. Its
			slope and the two parts are drawn times <Tex math="r^2" />: the near part as <Tex
				math="-\cos(kr - \omega t)"
			/>, the wave part as <Tex math="-kr\sin(kr - \omega t)" />, which runs off the panel beyond
			<Tex math={`kr = ${SLOPE_TOP}`} />. Everything is exact. For the higher derivatives the near
			and wave terms cross where <Tex math="(kr)^n = n!" />, at <Tex
				math={[1, 2, 3, 4].map((n) => crossing(n).toFixed(2)).join(',\\ ')}
			/> for the first four. The phase runs at {RATE} cycles a second; the figure opens paused.
		</p>
	</div>
</div>

<style>
	.near-to-wave {
		/* the two parts' colours: the near part blue and the wave part orange, as in the paper's regimes figure and
		   chapter 5.2's crossing diagram, so the chapter speaks one colour language; the accent is then kept off
		   every other mark in the plot, and the probe's focus ring is drawn in the ink */
		--near: var(--accent-2);
		--wave: var(--accent);
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
	.play:focus-visible,
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the probe takes a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .probe {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.dim {
		fill: var(--text-faint);
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	/* a tick at either end of the window keeps its words inside it */
	.tick.first {
		text-anchor: start;
	}

	.tick.last {
		text-anchor: end;
	}

	.axis-name {
		text-anchor: start;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zone {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.edge {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.edge-words {
		fill: var(--text);
	}

	.zone-name {
		fill: var(--text-dim);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.ink {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ink.sum {
		stroke-width: calc(1.9px * var(--u, 1));
	}

	.part {
		fill: none;
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.part.near,
	.envelope.near {
		stroke: var(--near);
	}

	.part.wave,
	.envelope.wave {
		stroke: var(--wave);
	}

	.envelope {
		fill: none;
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0.8;
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
		pointer-events: none;
	}

	.dot {
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
		pointer-events: none;
	}

	.dot.ink-dot {
		fill: var(--text);
	}

	.dot.near {
		fill: var(--near);
	}

	.dot.wave {
		fill: var(--wave);
	}

	.probe {
		cursor: grab;
		touch-action: none;
	}

	.probe:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.probe:focus-visible .focus {
		opacity: 1;
	}

	.ring {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
	}

	.pin {
		fill: var(--text);
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
		display: inline-block;
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.near-key {
		border-color: var(--near);
	}

	.wave-key {
		border-color: var(--wave);
	}

	.ink-key {
		border-color: var(--text);
		border-top-width: 2px;
	}

	.envelope-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: var(--text-dim);
	}

	.zone-key {
		height: 0.7rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 9%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}

	.play,
	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play {
		width: 2.2rem;
		padding: 0;
	}

	.action {
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover,
		.action:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: stretch;
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
		align-items: center;
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	/* words keep their own spacing: the tabular figures would widen a hyphen */
	.also {
		color: var(--text-dim);
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
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.hint {
			flex: 1 1 100%;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.action {
			transition: none;
		}
	}
</style>
