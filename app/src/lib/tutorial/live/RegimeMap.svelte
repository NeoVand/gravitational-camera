<script lang="ts">
	/**
	 * Chapter 0.1's map of the regimes, the paper's Figure fig:regimes made live: frequency against distance, both
	 * in powers of ten, the near field and the wave zone shaded either side of the edge r = c/2πf, and the paper's
	 * eight sources where the paper puts them. A probe, dragged or moved a decade at a time with the arrow keys,
	 * reads out the frequency, the wavelength, the reach of the near zone, which side of the edge it stands on and,
	 * at the frequencies of thermal glow, the temperature whose glow peaks there. Pressing a source brings the probe
	 * onto it. The numbers come from ./regime-map.ts. A prediction at the top is answered once the reader has put the
	 * probe where it asks.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import {
		EDGE_LABEL,
		FRAME,
		MERGER,
		SOURCES,
		THERMAL_FROM,
		TICKS,
		ZONE_NAMES_AT,
		clampToFrame,
		depth,
		edgeInFrame,
		nearZone,
		peakFrequency,
		peakTemperature,
		period,
		regime,
		sourceName,
		texFrequency,
		texLength,
		texRatio,
		texTemperature,
		wavelength,
		zones
	} from './regime-map';

	type Point = { lf: number; lr: number };

	/** Where the probe opens: 10 kHz, 1000 km, in the wave zone, clear of the sources and the labels. */
	let probe = $state<Point>({ lf: 4, lr: 6 });
	/** The source the probe stands on, if any. */
	let on = $state<number | undefined>();

	// --- the prediction: a person swaying once a second, 10 km away ---------------------------------------------------
	const ASKED: Point = { lf: 0, lr: 4 };
	let answered = $state(false);

	/** Every move of the probe comes here: it says whether the probe is on a source, and checks the prediction. */
	function set(p: Point, source?: number) {
		probe = p;
		on = source;
		if (Math.abs(p.lf - ASKED.lf) < 0.05 && Math.abs(p.lr - ASKED.lr) < 0.05) answered = true;
	}

	// --- the drawing's bounds: on a phone the chart is nearly square ------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const size = $derived(phone.current ? { w: 350, h: 330 } : { w: 700, h: 400 });
	const P = $derived(
		phone.current
			? { L: 40, R: size.w - 8, T: 8, B: size.h - 36 }
			: { L: 52, R: size.w - 12, T: 10, B: size.h - 38 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	/** One of the paper's points, in drawing units: its words are 6.5 pt, the site's 11 px (10 on a phone). */
	const pt = $derived((phone.current ? 1.4 : 1.6) * u);
	const nameSize = $derived(phone.current ? 10 : 11);

	const [LF0, LF1] = FRAME.lf;
	const [LR0, LR1] = FRAME.lr;
	const x = (lf: number) => P.L + ((lf - LF0) / (LF1 - LF0)) * (P.R - P.L);
	const y = (lr: number) => P.B - ((lr - LR0) / (LR1 - LR0)) * (P.B - P.T);
	const f1 = (n: number) => n.toFixed(1);
	const polygon = (pts: Point[]) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f1(x(p.lf))},${f1(y(p.lr))}`).join('') + 'Z';

	const shade = zones();
	const edge = edgeInFrame();
	const nearPath = $derived(polygon(shade.near));
	const wavePath = $derived(polygon(shade.wave));
	const edgePath = $derived(
		`M${f1(x(edge[0].lf))},${f1(y(edge[0].lr))}L${f1(x(edge[1].lf))},${f1(y(edge[1].lr))}`
	);
	/** The height of the edge at a frequency, as a power of ten. */
	const edgeAt = (lf: number) => Math.log10(nearZone(10 ** lf));

	const power = (n: number) => (n === 0 ? '1' : `10${superscript(n)}`);

	/** A source's name, line by line, set from its point as the paper sets it (centred on the point vertically). */
	function nameLines(i: number) {
		const s = SOURCES[i];
		const size = nameSize * u;
		const lead = 1.15 * size;
		const cx = x(Math.log10(s.f)) + s.offset[0] * pt;
		const cy = y(Math.log10(s.r)) - s.offset[1] * pt;
		const anchor = s.align === 'left' ? 'start' : s.align === 'right' ? 'end' : 'middle';
		return {
			anchor,
			lines: s.lines.map((text, k) => ({
				text,
				x: cx,
				y: cy + (k - (s.lines.length - 1) / 2) * lead + 0.36 * size
			}))
		};
	}

	// --- the probe ---------------------------------------------------------------------------------------------------
	const f = $derived(10 ** probe.lf);
	const r = $derived(10 ** probe.lr);
	const lambda = $derived(wavelength(f));
	const reach = $derived(nearZone(f));
	const side = $derived(regime(f, r));
	const ratio = $derived(depth(f, r));
	const thermal = $derived(f >= THERMAL_FROM * (1 - 1e-9));
	const T = $derived(peakTemperature(f));
	const here = $derived(on === undefined ? undefined : SOURCES[on]);

	/** The probe's place on the source, if it is a thermal one at the true peak of its spectrum. */
	function onto(i: number): Point {
		const s = SOURCES[i];
		return { lf: Math.log10(s.thermal ? peakFrequency(s.thermal) : s.f), lr: Math.log10(s.r) };
	}

	const goTo = (i: number) => set(onto(i), i);

	/** The probe and the point of the edge straight above or below it, drawn when it is inside the frame. */
	const tie = $derived.by(() => {
		const er = edgeAt(probe.lf);
		if (er < LR0 || er > LR1) return undefined;
		return { x: x(probe.lf), y0: y(probe.lr), y1: y(er) };
	});

	// --- moving the probe: by pointer, by the arrow keys, by a source ---------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	/** A drag lands on a source within this many CSS pixels of it, and otherwise on tenths of a decade. */
	const SNAP = 11;
	const GRID = 0.1;

	function placeAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		let best: number | undefined;
		let nearest = SNAP * u;
		SOURCES.forEach((s, i) => {
			const d = Math.hypot(p.x - x(Math.log10(s.f)), p.y - y(Math.log10(s.r)));
			if (d < nearest) {
				nearest = d;
				best = i;
			}
		});
		if (best !== undefined) return goTo(best);
		const lf = LF0 + ((p.x - P.L) / (P.R - P.L)) * (LF1 - LF0);
		const lr = LR0 + ((P.B - p.y) / (P.B - P.T)) * (LR1 - LR0);
		const snap = (v: number) => Math.round(Math.round(v / GRID) * GRID * 1e9) / 1e9;
		set(clampToFrame({ lf: snap(lf), lr: snap(lr) }));
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

	/** A press on the open chart, with a mouse or a pen, brings the probe there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		// a press on a source is a click on it, which brings the probe onto the source
		if ((e.target as Element).closest('.source')) return;
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
		const step = e.shiftKey ? 0.1 : 1;
		const d = {
			ArrowLeft: { lf: -step, lr: 0 },
			ArrowRight: { lf: step, lr: 0 },
			ArrowUp: { lf: 0, lr: step },
			ArrowDown: { lf: 0, lr: -step }
		}[e.key];
		if (!d) return;
		e.preventDefault();
		// rounded, so that a step from a decade lands on the next one exactly
		const round = (v: number) => Math.round(v * 1e9) / 1e9;
		set(clampToFrame({ lf: round(probe.lf + d.lf), lr: round(probe.lr + d.lr) }));
	}

	function choose(e: KeyboardEvent, i: number) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		goTo(i);
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const reachTex = $derived(texLength(reach));
	/** A number in words for a screen reader, to three figures: "0.316", "1.76 times ten to the 13". */
	function spoken(v: number) {
		if (v >= 0.01 && v < 1e4) return String(Number(v.toPrecision(3)));
		const e = Math.floor(Math.log10(v));
		return `${Number((v / 10 ** e).toPrecision(3))} times ten to the ${e < 0 ? 'minus ' : ''}${Math.abs(e)}`;
	}
	const probeLabel = $derived(
		`The probe, at ${spoken(f)} hertz and ${spoken(r)} metres: ${side === 'near' ? 'near field' : 'wave zone'}. Drag it, or move it a factor of ten with the arrow keys.`
	);
</script>

<div class="regime-map">
	<section class="predict" aria-labelledby="regime-map-predict">
		<span class="tag" id="regime-map-predict">Predict</span>
		<p class="question">
			A person sways once a second, 10 km from the camera. Is the camera in the person’s near field,
			or in the waves?
		</p>
		<p class={['answer', { shown: answered }]} aria-live="polite">
			{#if answered}
				<strong>In the near field, deep inside it.</strong> At 1 Hz the wavelength is
				<Tex math={texLength(wavelength(1))} />, and the near zone reaches
				<Tex math={`\\lambda/2\\pi = ${texLength(nearZone(1))}`} />, so 10 km is about
				<Tex math={`1/${texRatio(1 / depth(1, 1e4))}`} /> of the way to its edge. The camera feels the
				person’s pull change as the person sways; no wave has room to form.
			{:else}
				The answer appears when the probe stands at 1 Hz and 10 km.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {size.w} {size.h}"
			role="group"
			aria-label="Frequency against distance, both in powers of ten: the near field and the wave zone either side of the line r = c over 2 pi f, with eight sources and a probe"
			class={{ dragging }}
			style:--name-size="{nameSize}px"
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="regime-map-frame">
					<rect x={P.L} y={P.T} width={P.R - P.L} height={P.B - P.T} />
				</clipPath>
			</defs>

			<!-- the two zones and the edge between them -->
			<path class="zone near" d={nearPath} />
			<path class="zone wave" d={wavePath} />
			<path class="edge" d={edgePath} />

			<!-- the frame and its ticks -->
			<rect class="frame" x={P.L} y={P.T} width={P.R - P.L} height={P.B - P.T} />
			{#each TICKS.lf as lf (lf)}
				<line class="tick" x1={x(lf)} y1={P.B} x2={x(lf)} y2={P.B + 4 * u} />
				<text class="num" x={x(lf)} y={P.B + 15 * u} text-anchor="middle">{power(lf)}</text>
			{/each}
			{#each TICKS.lr as lr (lr)}
				<line class="tick" x1={P.L - 4 * u} y1={y(lr)} x2={P.L} y2={y(lr)} />
				<text class="num" x={P.L - 7 * u} y={y(lr) + 3.8 * u} text-anchor="end">{power(lr)}</text>
			{/each}
			<text class="axis-name" x={(P.L + P.R) / 2} y={P.B + 30 * u} text-anchor="middle"
				>frequency of the source, <tspan class="sym">f</tspan> (Hz)</text
			>
			<text
				class="axis-name"
				transform="translate({f1(P.L - 31 * u)} {f1((P.T + P.B) / 2)}) rotate(-90)"
				text-anchor="middle">distance, <tspan class="sym">r</tspan> (m)</text
			>

			<!-- the zones' names, the same distance in from the left and the right -->
			<text
				class="zone-name near"
				x={P.L + 5 * pt}
				y={y(ZONE_NAMES_AT) + 4.5 * u}
				text-anchor="start">near field</text
			>
			<text class="zone-name wave" x={P.R - 5 * pt} y={y(ZONE_NAMES_AT) + 4.5 * u} text-anchor="end"
				>wave zone</text
			>

			<!-- the edge's name, with its leader -->
			<line
				class="leader"
				x1={x(EDGE_LABEL.to)}
				y1={y(edgeAt(EDGE_LABEL.to))}
				x2={x(EDGE_LABEL.lf) - 2 * u}
				y2={y(EDGE_LABEL.lr)}
			/>
			<text class="edge-name" x={x(EDGE_LABEL.lf)} y={y(EDGE_LABEL.lr) + 4.5 * u}
				><tspan class="sym">r</tspan> = <tspan class="sym">c</tspan>/2π<tspan class="sym">f</tspan
				></text
			>

			<!-- two neutron stars merging, far beyond the top of the chart -->
			<g class="merger">
				<line x1={x(MERGER.lf)} y1={y(MERGER.from)} x2={x(MERGER.lf)} y2={y(MERGER.to) + 5 * u} />
				<path d="M{f1(x(MERGER.lf))},{f1(y(MERGER.to))}l{f1(-3 * u)},{f1(6 * u)}h{f1(6 * u)}Z" />
				{#each MERGER.lines as line, k (k)}
					<text x={x(MERGER.text.lf)} y={y(MERGER.text.lr) + (9 + 12.6 * k) * u}>{line}</text>
				{/each}
			</g>

			<!-- the probe's tie to the edge above or below it, and its lines to the axes -->
			<g clip-path="url(#regime-map-frame)">
				<line class="guide" x1={P.L} y1={y(probe.lr)} x2={x(probe.lf)} y2={y(probe.lr)} />
				<line class="guide" x1={x(probe.lf)} y1={P.B} x2={x(probe.lf)} y2={y(probe.lr)} />
				{#if tie}
					<line class={['tie', side]} x1={tie.x} y1={tie.y0} x2={tie.x} y2={tie.y1} />
					<circle class="edge-point" cx={tie.x} cy={tie.y1} r={3 * u} />
				{/if}
			</g>

			<!-- the paper's eight sources: press one to bring the probe onto it -->
			{#each SOURCES as s, i (i)}
				{@const name = nameLines(i)}
				<g
					class={['source', { thermal: s.thermal, current: on === i }]}
					role="button"
					tabindex="0"
					aria-label="{sourceName(s)}. Move the probe here."
					onclick={() => goTo(i)}
					onkeydown={(e) => choose(e, i)}
				>
					<circle class="hit" cx={x(Math.log10(s.f))} cy={y(Math.log10(s.r))} r={11 * u} />
					<circle class="focus" cx={x(Math.log10(s.f))} cy={y(Math.log10(s.r))} r={7 * u} />
					<circle class="dot" cx={x(Math.log10(s.f))} cy={y(Math.log10(s.r))} r={3.4 * u} />
					<text class="name" text-anchor={name.anchor}>
						{#each name.lines as line, k (k)}
							<tspan x={line.x} y={line.y}>{line.text}</tspan>
						{/each}
					</text>
				</g>
			{/each}

			<g
				class={['probe', side]}
				transform="translate({f1(x(probe.lf))} {f1(y(probe.lr))})"
				role="button"
				tabindex="0"
				aria-roledescription="movable probe"
				aria-label={probeLabel}
				onpointerdown={grab}
				onkeydown={key}
			>
				<circle class="hit" r={16 * u} />
				<circle class="focus" r={11 * u} />
				<circle class="ring" r={7 * u} />
				<circle class="pin" r={1.5 * u} />
			</g>
		</svg>
		<p class="legend">
			<span><i class="key mechanical"></i>a body moving as a whole</span>
			<span><i class="key thermal"></i>a hot body, at the peak of its glow</span>
			<span><i class="key edge"></i>the edge of the near zone</span>
		</p>
	</div>

	<div class="bar">
		<p class="hint">
			Drag the probe, or reach it with Tab and move it a factor of ten with the arrow keys (with
			Shift, a tenth of that). Press a source to bring the probe onto it.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Probe</dt>
				<dd>
					<Tex math={`f = ${texFrequency(f)}`} /><Tex math={`r = ${texLength(r)}`} />
					{#if here}<span class="also">{sourceName(here)}</span>{/if}
					{#if f < 1}<span class="also">one cycle every {period(1 / f)}</span>{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Wavelength</dt>
				<dd><Tex math={`\\lambda = c/f = ${texLength(lambda)}`} /></dd>
			</div>
			<div class="row">
				<dt>Near zone</dt>
				<dd>
					<Tex math={`\\lambda/2\\pi = ${reachTex}`} /><span class="also"
						><Tex math={`r/(\\lambda/2\\pi) = ${texRatio(ratio)}`} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Regime</dt>
				<dd aria-live="polite">
					<strong class={side}>{side === 'near' ? 'near field' : 'wave zone'}</strong>
					{#if ratio > 1 / 3 && ratio < 3}<span class="also"
							>close to the edge, where the pull and the wave are mixed</span
						>{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Thermal peak</dt>
				<dd>
					{#if thermal}
						<Tex math={`T = ${texTemperature(T)}`} /><span class="also"
							>a body this hot glows most brightly here</span
						>
					{:else}
						<span class="faint"
							>none: a glow peaking here would need <Tex math={`T = ${texTemperature(T)}`} />,
							colder than the 2.7 K afterglow of the Big Bang</span
						>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			Both axes are in powers of ten, as in the paper’s map of the regimes: each tick is a factor of
			a million in frequency or a thousand in distance. Below and left of the line <Tex
				math="r = c/2\pi f"
			/> a pixel feels the source’s pull change as the source moves; above and right of it the source
			reaches the pixel only as a wave. Hot bodies are placed at the peak of their glow,
			<Tex math="f = 2.8214\,k_BT/2\pi\hbar" />, where 2.8214 solves <Tex
				math={'x = 3(1 - e^{-x})'}
			/>.
		</p>
	</div>
</div>

<style>
	.regime-map {
		/* how deeply the two zones are shaded: the blue needs more to show on the dark ground */
		--near: 20%;
		--wave: 12%;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the prediction ------------------------------------------------------------------- */

	.predict {
		padding: 0.75rem 0.9rem 0.8rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.tag {
		display: block;
		margin-bottom: 0.35rem;
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
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

	/* --- the chart ------------------------------------------------------------------------ */

	.stage {
		padding: 0.8rem 0.9rem 0.2rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open chart lets a finger scroll the page; only the probe takes a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .probe {
		cursor: grabbing;
	}

	.zone.near {
		fill: color-mix(in srgb, var(--accent-2) var(--near), transparent);
	}

	.zone.wave {
		fill: color-mix(in srgb, var(--accent) var(--wave), transparent);
	}

	.edge {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.frame {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		fill: var(--text-dim);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
	}

	.sym {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.12em;
	}

	.zone-name {
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
	}

	.zone-name.near {
		fill: var(--accent-2);
	}

	.zone-name.wave {
		fill: var(--accent);
	}

	.leader {
		stroke: var(--text-dim);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.edge-name {
		fill: var(--text);
		font: 400 calc(11.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.merger line {
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.merger path {
		fill: var(--text-dim);
	}

	.merger text {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.tie {
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.tie.near {
		stroke: var(--accent-2);
	}

	.tie.wave {
		stroke: var(--accent);
	}

	.edge-point {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.source {
		cursor: pointer;
	}

	.source:focus,
	.probe:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.dot {
		fill: var(--accent-2);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.source.thermal .dot {
		fill: var(--accent);
	}

	.name {
		fill: var(--text);
		font: 400 calc(var(--name-size) * var(--u, 1)) / 1 var(--font-sans);
		paint-order: stroke;
		stroke: color-mix(in srgb, var(--bg-sunken) 70%, transparent);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.source:hover .name,
	.source.current .name {
		fill: var(--accent-ink);
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.source:focus-visible .focus,
	.probe:focus-visible .focus {
		opacity: 1;
	}

	.probe {
		cursor: grab;
		touch-action: none;
	}

	.ring {
		fill: color-mix(in srgb, var(--bg) 55%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
	}

	.pin {
		fill: var(--text);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
		padding: 0.45rem 0 0.55rem;
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
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
	}

	.key.mechanical {
		background: var(--accent-2);
	}

	.key.thermal {
		background: var(--accent);
	}

	.key.edge {
		width: 1rem;
		height: 0;
		border-radius: 0;
		border-top: 1.5px solid var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
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
		grid-template-columns: 7rem 1fr;
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

	.readouts strong {
		font-weight: 600;
	}

	strong.near {
		color: var(--accent-2);
	}

	strong.wave {
		color: var(--accent-ink);
	}

	.also {
		color: var(--text-dim);
	}

	.faint {
		color: var(--text-faint);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	:global(:root[data-theme='light']) .regime-map {
		--near: 11%;
		--wave: 9%;
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .regime-map {
			--near: 11%;
			--wave: 9%;
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.7rem 0.5rem 0.2rem;
		}

		.legend {
			padding-left: 0.4rem;
		}

		.row {
			grid-template-columns: 5.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
