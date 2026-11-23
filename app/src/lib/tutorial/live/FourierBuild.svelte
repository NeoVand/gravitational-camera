<script lang="ts">
	/**
	 * Chapter 2.6's narrow bump rebuilt from ripples. The chapter's Gaussian δ_ε, of width ε and area 1, is repeated
	 * every L = 1 m, and the sum of its mean and its first N ripples, f_N(x) = Σ_{|n|≤N} c_n e^{ik_n x} with
	 * k_n = 2πn/L, is drawn over it: (a) across one period and a little beyond, (b) close to the bump, from −5ε to 5ε,
	 * and (c) the transform e^{−ε²k²/2} with the ripples kept marked on it, whose handle also sets N. The readouts
	 * give the period, the ripples kept, their amounts, the largest gap and the widths at half height. The numbers come
	 * from ./fourier-build.ts. Two predictions at the top are answered once the reader has done what they ask. Nothing
	 * moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { ArrowHorizontalIcon, CosineIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		MATCH,
		MOST,
		OPENING,
		PERIOD,
		WIDTHS,
		bump,
		bumpHalfWidth,
		partialSums,
		peak,
		sumHalfWidth,
		transform,
		wavenumber
	} from './fourier-build';

	const uid = $props.id();

	// --- the choices: the number of ripples and the width of the bump ---------------------------------------------------
	let ripples = $state<number>(OPENING.ripples);
	let rung = $state(WIDTHS.indexOf(OPENING.width));
	const eps = $derived(WIDTHS[rung]);

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** Whether the sum has matched the bump at each of the try's two widths. */
	let matched = $state({ coarse: false, fine: false });
	/** Whether the reader has cut N so far that the sum grew visibly wider than the bump. */
	let cut = $state(false);
	const revealed = $derived(step === 1 ? matched.coarse && matched.fine : cut);

	function note() {
		if (gapNow < MATCH) {
			if (eps === 0.1) matched.coarse = true;
			if (eps === 0.01) matched.fine = true;
		}
	}

	function setRipples(n: number) {
		const next = Math.max(1, Math.min(MOST, Math.round(n)));
		const fewer = next < ripples;
		ripples = next;
		if (fewer && widthOfSum >= 1.5 * bumpHalfWidth(eps)) cut = true;
		note();
	}

	function setRung(i: number) {
		rung = Math.max(0, Math.min(WIDTHS.length - 1, Math.round(i)));
		note();
	}

	// --- the drawing's bounds: on a phone the panels are narrower and stacked ---------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const sizeA = $derived(phone.current ? { w: 332, h: 206 } : { w: 672, h: 214 });
	const sizeB = $derived(phone.current ? { w: 332, h: 190 } : { w: 328, h: 196 });
	const f1 = (x: number) => x.toFixed(1);
	const minus = (v: number | string) => String(v).replace('-', '−');

	/** Heights in (a) and (b) are in units of the bump's height; the window leaves room for the ringing below zero. */
	const Y_LOW = -0.3;
	const Y_HIGH = 1.1;
	const heightTicks = [0, 0.5, 1];

	/** A path through the points (x, y), already in drawing units. */
	function line(xs: readonly number[], ys: readonly number[]): string {
		let d = `M${f1(xs[0])},${f1(ys[0])}`;
		for (let i = 1; i < xs.length; i++) d += `L${f1(xs[i])},${f1(ys[i])}`;
		return d;
	}

	// --- panel (a): one period and a little beyond ----------------------------------------------------------------------
	const SPAN_A = 0.6;
	const a = $derived({ L: 30, R: sizeA.w - 8, T: 26, B: sizeA.h - 22 });
	const ax = (x: number) => a.L + ((x + SPAN_A) / (2 * SPAN_A)) * (a.R - a.L);
	const ay = (v: number) => a.B - ((v - Y_LOW) / (Y_HIGH - Y_LOW)) * (a.B - a.T);
	const placesA = Array.from({ length: 2401 }, (_, i) => -SPAN_A + (i / 2400) * 2 * SPAN_A);
	const bumpA = $derived(placesA.map((x) => bump(eps, x) / peak(eps)));
	const sumA = $derived(partialSums(eps, ripples, placesA).map((v) => v / peak(eps)));
	const bumpPathA = $derived(
		line(
			placesA.map(ax),
			bumpA.map((v) => ay(v))
		)
	);
	const bumpFillA = $derived(`${bumpPathA}L${f1(a.R)},${f1(ay(0))}L${f1(a.L)},${f1(ay(0))}Z`);
	const sumPathA = $derived(
		line(
			placesA.map(ax),
			sumA.map((v) => ay(v))
		)
	);
	const placeTicks = [-0.5, -0.25, 0, 0.25, 0.5];

	// --- panel (b): close to the bump, from −5ε to 5ε, but never beyond one period -------------------------------------
	const spanB = $derived(Math.min(5 * eps, PERIOD / 2));
	const b = $derived({ L: 30, R: sizeB.w - 8, T: 8, B: sizeB.h - 22 });
	const bx = (x: number) => b.L + ((x + spanB) / (2 * spanB)) * (b.R - b.L);
	const by = (v: number) => b.B - ((v - Y_LOW) / (Y_HIGH - Y_LOW)) * (b.B - b.T);
	const placesB = $derived(Array.from({ length: 801 }, (_, i) => -spanB + (i / 800) * 2 * spanB));
	const bumpPathB = $derived(
		line(
			placesB.map(bx),
			placesB.map((x) => by(bump(eps, x) / peak(eps)))
		)
	);
	const bumpFillB = $derived(`${bumpPathB}L${f1(b.R)},${f1(by(0))}L${f1(b.L)},${f1(by(0))}Z`);
	const sumPathB = $derived(
		line(
			placesB.map(bx),
			partialSums(eps, ripples, placesB).map((v) => by(v / peak(eps)))
		)
	);
	/** Ticks at even multiples of ε inside the close view. */
	const epsTicks = $derived([-4, -2, 0, 2, 4].filter((m) => Math.abs(m * eps) <= spanB + 1e-9));

	// --- panel (c): the transform, and the ripples kept ------------------------------------------------------------------
	/**
	 * The wavenumbers shown run to the first of 50, 100, 200 and 400 m⁻¹ that holds the transform down to about 0.03%
	 * (k = 4/ε) and the last ripple kept. While the handle is dragged the range is held, so that the drawing does not
	 * move under the pointer.
	 */
	const K_RANGES = [50, 100, 200, 400];
	let heldK = $state<number | undefined>(undefined);
	const kHigh = $derived(
		heldK ??
			K_RANGES.find((r) => r >= 4 / eps - 1e-9 && r >= 1.05 * wavenumber(ripples)) ??
			K_RANGES[K_RANGES.length - 1]
	);
	const c = $derived({ L: 30, R: sizeB.w - 8, T: 8, B: sizeB.h - 22 });
	const cx = (k: number) => c.L + (k / kHigh) * (c.R - c.L);
	const cy = (v: number) => c.B - (v / 1.1) * (c.B - c.T);
	const transformPath = $derived.by(() => {
		const ks = Array.from({ length: 1601 }, (_, i) => (i / 1600) * kHigh);
		return line(
			ks.map(cx),
			ks.map((k) => cy(transform(eps, k)))
		);
	});
	const all = Array.from({ length: MOST + 1 }, (_, n) => n);
	/** The ripples whose wavenumbers fall inside the range shown. */
	const shown = $derived(all.filter((n) => wavenumber(n) <= kHigh));
	const keptStems = $derived(
		shown
			.filter((n) => n <= ripples)
			.map((n) => `M${f1(cx(wavenumber(n)))},${f1(c.B)}V${f1(cy(transform(eps, wavenumber(n))))}`)
			.join('')
	);
	const keptDots = $derived(
		shown
			.filter((n) => n <= ripples)
			.map((n) => `M${f1(cx(wavenumber(n)))},${f1(cy(transform(eps, wavenumber(n))))}h0`)
			.join('')
	);
	const leftDots = $derived(
		shown
			.filter((n) => n > ripples)
			.map((n) => `M${f1(cx(wavenumber(n)))},${f1(cy(transform(eps, wavenumber(n))))}h0`)
			.join('')
	);
	const kTicks = $derived.by(() => {
		const every = kHigh === 50 ? 10 : kHigh / 4;
		return Array.from({ length: Math.round(kHigh / every) + 1 }, (_, i) => i * every);
	});

	// moving N by pointer on (c): the handle, or anywhere on the panel with a mouse or a pen
	let svgC: SVGSVGElement | undefined;
	const holdC: Attachment<SVGSVGElement> = (node) => {
		svgC = node;
		return () => (svgC = undefined);
	};
	let dragging = $state(false);

	function ripplesAt(e: PointerEvent) {
		const m = svgC?.getScreenCTM();
		if (!m) return ripples;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const n = (((p.x - c.L) / (c.R - c.L)) * kHigh) / wavenumber(1);
		// the handle stays on the drawing: no farther than the last ripple shown
		return Math.min(n, Math.floor(kHigh / wavenumber(1)));
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		// a finger scrolls the page unless it takes the handle
		if (e.pointerType === 'touch' && !(e.target as Element).closest('.grip')) return;
		// a drag is not a click: nothing takes the focus, so no ring is drawn
		e.preventDefault();
		svgC?.setPointerCapture(e.pointerId);
		dragging = true;
		heldK = kHigh;
		setRipples(ripplesAt(e));
	}

	function move(e: PointerEvent) {
		if (dragging) setRipples(ripplesAt(e));
	}

	function release() {
		dragging = false;
		heldK = undefined;
	}

	// --- the numbers ----------------------------------------------------------------------------------------------------
	/** The largest gap over one period, as a share of the bump's height, from the samples of (a) inside the period. */
	const gapNow = $derived.by(() => {
		let most = 0;
		for (let i = 0; i < placesA.length; i++)
			if (Math.abs(placesA[i]) <= PERIOD / 2) most = Math.max(most, Math.abs(sumA[i] - bumpA[i]));
		return most;
	});
	const lowestNow = $derived(Math.min(...sumA));
	const widthOfSum = $derived(sumHalfWidth(eps, ripples));

	/** Three figures, keeping a final zero: "18.8", "258", "0.250". */
	const three = (x: number) => (x >= 999.5 ? String(Math.round(x)) : x.toPrecision(3));
	/** A share as a percentage: "34%", "2.5%", "0.40%", and the smallest as "less than 0.001%". */
	function percent(share: number): string {
		const p = Math.abs(share) * 100;
		if (p < 0.001) return 'less than 0.001%';
		if (p >= 10) return `${Math.round(p)}%`;
		if (p >= 1) return `${p.toFixed(1)}%`;
		return `${p.toPrecision(2)}%`;
	}
	/** A width ε as the slider and the readouts print it, in metres: "0.1 m", "0.012 m". */
	const metres = (x: number) => `${x} m`;

	const kN = $derived(wavenumber(ripples));
	const kNext = $derived(wavenumber(ripples + 1));
	const nextShare = $derived(transform(eps, kNext));
	const isMatched = $derived(gapNow < MATCH);
	const epsTex = $derived(String(eps));

	const labelA = $derived(
		`The bump of width ε = ${eps} metres, repeated every metre, and the sum of its mean and its first ${ripples} ripples, from −0.6 to 0.6 metres; the sum ${isMatched ? 'matches the bump to within 1%' : `misses it by up to ${percent(gapNow)} of its height`}`
	);
	const labelB = $derived(
		`Close to the bump, from ${minus(-spanB)} to ${spanB.toPrecision(2)} metres: the sum's central peak is ${three(widthOfSum * 100)} centimetres wide at half its height, the bump's ${three(bumpHalfWidth(eps) * 100)}`
	);
	const labelC = $derived(
		`The transform e to the minus epsilon squared k squared over 2, from k = 0 to ${kHigh} per metre, with the ${ripples + 1} wavenumbers kept, from 0 to ${three(kN)} per metre, marked on it`
	);
</script>

<div class="fourier-build">
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
				To rebuild a bump ten times narrower, how many more ripples are needed?
			{:else}
				What happens to the sum when <Tex math="N" /> is cut below what the bump needs?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>About ten times as many.</strong> At <Tex math={`\\varepsilon = 0.1\\ \\text{m}`} />
				the sum first comes within 1% of the bump with 4 ripples, and at
				<Tex math={`\\varepsilon = 0.01\\ \\text{m}`} /> it needs 41. The bump’s transform
				<Tex math={`e^{-\\varepsilon^2k^2/2}`} /> is a Gaussian of width <Tex
					math="1/\varepsilon"
				/>
				in wavenumber, and the ripples needed reach out to about <Tex math="k = 2.5/\varepsilon" />:
				ten times farther for a bump ten times narrower. On a period <Tex math="L" /> the ripples stand
				<Tex math={`2\\pi/L = 6.28\\ \\text{m}^{-1}`} /> apart, so reaching ten times farther takes ten
				times as many.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>It grows wider and rings on both sides.</strong> At
				<Tex math={`\\varepsilon = 0.01\\ \\text{m}`} /> with 10 ripples, the sum’s peak is 5.9 cm wide
				at half its height, against 2.4 cm for the bump, and it dips below zero by 9% of the bump’s height.
				Keeping only the ripples with <Tex math="|n| \le N" /> multiplies each ripple by 1 or 0, so by
				the convolution theorem the sum is the bump blurred by the sum of the kept ripples alone. That
				kernel is a peak about <Tex math="L/(2N+1)" /> wide with ripples on both sides: the sum is about
				as wide as that peak or wider, and the kernel’s side ripples are the ringing.
			{:else if step === 1}
				The answer appears once the sum has matched the bump, to within 1% of its height, at
				<Tex math={`\\varepsilon = 0.1\\ \\text{m}`} /> and at <Tex
					math={`\\varepsilon = 0.01\\ \\text{m}`}
				/>.
			{:else}
				The answer appears once you have lowered <Tex math="N" /> until the sum’s peak is half as wide
				again as the bump.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title">
				<span class="letter">(a)</span> The bump <Tex math="\delta_\varepsilon(x)" />, repeated
				every
				<Tex math={`L = 1\\ \\text{m}`} />, and the sum of its first
				<strong class="tally">{ripples}</strong>
				{ripples === 1 ? 'ripple' : 'ripples'}, against <Tex math="x" /> in metres
			</p>
			<svg viewBox="0 0 {sizeA.w} {sizeA.h}" role="img" aria-label={labelA} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-a">
						<rect x={a.L} y={a.T - 4} width={a.R - a.L} height={a.B - a.T + 4} />
					</clipPath>
				</defs>

				<!-- beyond the period on each side -->
				<rect class="beyond" x={a.L} y={a.T} width={ax(-PERIOD / 2) - a.L} height={a.B - a.T} />
				<rect
					class="beyond"
					x={ax(PERIOD / 2)}
					y={a.T}
					width={a.R - ax(PERIOD / 2)}
					height={a.B - a.T}
				/>
				<line class="edge" x1={ax(-PERIOD / 2)} y1={a.T} x2={ax(-PERIOD / 2)} y2={a.B} />
				<line class="edge" x1={ax(PERIOD / 2)} y1={a.T} x2={ax(PERIOD / 2)} y2={a.B} />

				<!-- the period, as a bracket above the drawing -->
				<path
					class="bracket"
					d="M{f1(ax(-0.5))},{a.T - 6}v-6H{f1(ax(0) - 30)}M{f1(ax(0) + 30)},{a.T - 12}H{f1(
						ax(0.5)
					)}v6"
				/>
				<text class="num strong" x={ax(0)} y={a.T - 8.5} text-anchor="middle">L = 1 m</text>

				<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
				<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
				<line class="zero" x1={a.L} y1={ay(0)} x2={a.R} y2={ay(0)} />
				{#each heightTicks as v (v)}
					<line class="tick" x1={a.L - 4} y1={ay(v)} x2={a.L} y2={ay(v)} />
					<text class="num" x={a.L - 7} y={ay(v) + 3.8} text-anchor="end">{v}</text>
				{/each}
				{#each placeTicks as x (x)}
					<line class="tick" x1={ax(x)} y1={a.B} x2={ax(x)} y2={a.B + 4} />
					<text class="num" x={ax(x)} y={a.B + 16} text-anchor="middle">{minus(x)}</text>
				{/each}

				<g clip-path="url(#{uid}-a)">
					<path class="bump-fill" d={bumpFillA} />
					<path class="bump" d={bumpPathA} />
					<path class="sum-halo" d={sumPathA} />
					<path class="sum" d={sumPathA} />
				</g>
			</svg>
			<p class="legend">
				<span><i class="key bump"></i>the bump, repeated</span>
				<span
					><i class="key sum"></i>the sum of the mean and the first {ripples}
					{ripples === 1 ? 'ripple' : 'ripples'}</span
				>
				<span><i class="key beyond"></i>the next period on each side</span>
			</p>
		</div>

		<div class="pair">
			<div class="panel">
				<p class="title">
					<span class="letter">(b)</span> Close to the bump, against <Tex math="x" /> in units of
					<Tex math={`\\varepsilon = ${epsTex}\\ \\text{m}`} />
				</p>
				<svg viewBox="0 0 {sizeB.w} {sizeB.h}" role="img" aria-label={labelB} {@attach fitText()}>
					<defs>
						<clipPath id="{uid}-b">
							<rect x={b.L} y={b.T - 4} width={b.R - b.L} height={b.B - b.T + 4} />
						</clipPath>
					</defs>
					<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
					<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
					<line class="zero" x1={b.L} y1={by(0)} x2={b.R} y2={by(0)} />
					{#each heightTicks as v (v)}
						<line class="tick" x1={b.L - 4} y1={by(v)} x2={b.L} y2={by(v)} />
						<text class="num" x={b.L - 7} y={by(v) + 3.8} text-anchor="end">{v}</text>
					{/each}
					{#each epsTicks as m (m)}
						<line class="tick" x1={bx(m * eps)} y1={b.B} x2={bx(m * eps)} y2={b.B + 4} />
						<text class="num" x={bx(m * eps)} y={b.B + 16} text-anchor="middle"
							>{m === 0 ? '0' : `${minus(m)}ε`}</text
						>
					{/each}
					<g clip-path="url(#{uid}-b)">
						<path class="bump-fill" d={bumpFillB} />
						<path class="bump" d={bumpPathB} />
						<path class="sum-halo" d={sumPathB} />
						<path class="sum" d={sumPathB} />
					</g>
				</svg>
				<p class="legend">
					<span class="words"
						>heights, here and in (a), in units of the bump’s height, <Tex
							math={`1/(\\sqrt{2\\pi}\\,\\varepsilon)`}
						/></span
					>
				</p>
			</div>

			<div class="panel">
				<p class="title">
					<span class="letter">(c)</span> The transform <Tex
						math={`\\tilde\\delta_\\varepsilon(k) = e^{-\\varepsilon^2k^2/2}`}
					/>, against <Tex math="k" /> in <Tex math={`\\text{m}^{-1}`} />
				</p>
				<svg
					viewBox="0 0 {sizeB.w} {sizeB.h}"
					role="img"
					aria-label={labelC}
					class={['wavenumbers', { dragging }]}
					onpointerdown={press}
					onpointermove={move}
					onpointerup={release}
					onpointercancel={release}
					{@attach holdC}
					{@attach fitText()}
				>
					<line class="axis" x1={c.L} y1={c.B} x2={c.R} y2={c.B} />
					<line class="axis" x1={c.L} y1={c.T} x2={c.L} y2={c.B} />
					{#each heightTicks as v (v)}
						<line class="tick" x1={c.L - 4} y1={cy(v)} x2={c.L} y2={cy(v)} />
						<text class="num" x={c.L - 7} y={cy(v) + 3.8} text-anchor="end">{v}</text>
					{/each}
					{#each kTicks as k (k)}
						<line class="tick" x1={cx(k)} y1={c.B} x2={cx(k)} y2={c.B + 4} />
						<text
							class="num"
							x={cx(k)}
							y={c.B + 16}
							text-anchor={k === 0 ? 'start' : k === kHigh ? 'end' : 'middle'}>{k}</text
						>
					{/each}

					<path class="exact" d={transformPath} />
					<path class="left" d={leftDots} />
					<path class="stems" d={keptStems} />
					<path class="dots" d={keptDots} />

					<line class="reach" x1={cx(kN)} y1={c.T + 5} x2={cx(kN)} y2={c.B} />
					<g class="grip" transform="translate({f1(cx(kN))} {f1(c.T + 5)})">
						<circle class="hit" r="14" />
						<circle class="knob" r="4.5" />
					</g>
				</svg>
				<p class="legend">
					<span><i class="key exact"></i>transform</span>
					<span
						><i class="key dot"></i><span>kept, <Tex math="k_0" /> to <Tex math="k_N" /></span
						></span
					>
					<span><i class="key dot left"></i>left out</span>
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<Slider
			id="{uid}-n"
			label="Ripples kept"
			icon={CosineIcon}
			min={1}
			max={MOST}
			step={1}
			bind:value={() => ripples, setRipples}
			readout="N = {ripples}"
			ends={['1', String(MOST)]}
		/>
		<Slider
			id="{uid}-eps"
			label="Width of the bump"
			icon={ArrowHorizontalIcon}
			min={0}
			max={WIDTHS.length - 1}
			step={1}
			bind:value={() => rung, setRung}
			readout="ε = {metres(eps)}"
			ends={[metres(WIDTHS[0]), metres(WIDTHS[WIDTHS.length - 1])]}
			marks={[0.01, 0.1].map((w) => ({ at: WIDTHS.indexOf(w), label: `ε = ${w} m` }))}
			marksHint="the ticks mark the two widths of the first prediction"
		/>
		<p class="hint">
			Drag the sliders, or the handle at the top of (c), which sets the last ripple kept. With the
			keyboard, reach the sliders with Tab and use the arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The period</dt>
				<dd>
					<Tex math={`L = 1\\ \\text{m}`} /><span class="also"
						>The bump is repeated every metre, and the series rebuilds that repeating pattern from
						the ripples that repeat with it, <Tex
							math={`k_n = 2\\pi n/L = 6.28\\,n\\ \\text{m}^{-1}`}
						/>.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The sum</dt>
				<dd>
					<Tex
						math={`f_{${ripples}}(x) = \\sum_{n=-${ripples}}^{${ripples}} c_n\\,e^{ik_nx}`}
					/><span class="also"
						>It holds the mean, <Tex math="c_0" />, and the first {ripples}
						{ripples === 1 ? 'ripple' : 'ripples'}, up to <Tex
							math={`k_{${ripples}} = ${three(kN)}\\ \\text{m}^{-1}`}
						/>, each with its partner at <Tex math="-k_n" />: {2 * ripples + 1} terms in all. The finest
						has crests {three(100 / ripples)} cm apart.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Their amounts</dt>
				<dd>
					<Tex
						math={`c_n = \\tilde\\delta_\\varepsilon(k_n)/L = e^{-\\varepsilon^2k_n^2/2}/L`}
					/><span class="also"
						>The first ripple left out, at <Tex
							math={`k_{${ripples + 1}} = ${three(kNext)}\\ \\text{m}^{-1}`}
						/>, would come in with {percent(nextShare)} of its full amount.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>How close</dt>
				<dd>
					<span
						>The sum differs from the bump by at most {percent(gapNow)} of the bump’s height{#if lowestNow < -0.0005},
							and dips below zero by {percent(lowestNow)}{/if}.</span
					>
					<span class="verdict" style:color={isMatched ? 'var(--good)' : 'var(--text-dim)'}>
						{isMatched
							? 'It matches the bump to within 1%.'
							: 'It does not yet match the bump to within 1%.'}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Widths at half height</dt>
				<dd>
					<span
						>The bump is <Tex
							math={`2.35\\,\\varepsilon = ${three(bumpHalfWidth(eps) * 100)}\\ \\text{cm}`}
						/> wide at half its height, and the sum’s central peak is {three(widthOfSum * 100)} cm wide
						at half its own.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The bump is the chapter’s Gaussian <Tex
				math={`\\delta_\\varepsilon(x) = e^{-x^2/2\\varepsilon^2}/(\\sqrt{2\\pi}\\,\\varepsilon)`}
			/>, of area 1, with <Tex math="x" /> and <Tex math="\varepsilon" /> in metres. A Fourier series
			needs a pattern that repeats, so the bump is repeated every <Tex math="L" />; one period of
			the repeated bump holds exactly one whole bump, so its coefficients are the transform at the
			wavenumbers of the period, divided by <Tex math="L" />. A ripple’s full amount is <Tex
				math="1/L"
			/>, the amount a point holds of every ripple. Heights in (a) and (b) are in units of the
			bump’s height at its centre, here <Tex math={`${three(peak(eps))}\\ \\text{m}^{-1}`} />. The
			transform is the same at
			<Tex math="-k" />, so (c) shows only <Tex math="k \ge 0" />; its dots stand at the heights
			<Tex math="L\,c_n" />.
		</p>
	</div>
</div>

<style>
	.fourier-build {
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

	svg.wavenumbers {
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

	.num.strong {
		fill: var(--text);
		font-weight: 500;
	}

	.beyond {
		fill: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.edge {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.bracket {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.bump-fill {
		fill: color-mix(in srgb, var(--text) 8%, transparent);
	}

	.bump,
	.exact {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.sum-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.sum {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.stems {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the ripples: round ends of strokes of no length */
	.dots,
	.left {
		fill: none;
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-linecap: round;
	}

	.dots {
		stroke: var(--accent);
	}

	.left {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.reach {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
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

	/* a sentence with a formula in it flows as text */
	.legend > span.words {
		display: inline;
	}

	.key {
		flex: none;
		display: inline-block;
		width: 1rem;
		height: 0;
		border-top: 2px solid;
	}

	.key.bump,
	.key.exact {
		border-top: 1px solid var(--text);
	}

	.key.sum {
		border-color: var(--accent);
	}

	.key.beyond {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 12%, transparent);
	}

	.key.dot {
		width: 0.4rem;
		height: 0.4rem;
		border: 0;
		border-radius: 50%;
		background: var(--accent);
	}

	.key.dot.left {
		background: color-mix(in srgb, var(--text) 30%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
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

	.verdict {
		font-weight: 500;
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

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
