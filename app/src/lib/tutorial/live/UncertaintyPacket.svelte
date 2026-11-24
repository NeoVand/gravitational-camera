<script lang="ts">
	/**
	 * Chapter 8.2's uncertainty packet, in units with ħ = 1. Above: |ψ(x)|² of a Gaussian packet
	 * ψ ∝ e^{−x²/4σ_x²}e^{iax²} as a filled ink curve, with Re ψ as a thin grey line under it so that the chirp shows.
	 * Below: the momentum distribution |ψ̃(p)|²/2π, normalized to unit area, from a fast Fourier transform of ψ on a
	 * grid of 2048 points. Each curve carries a bracket of one standard deviation at e^{−1/2} of its height, as in
	 * diagram tut-uncertainty-widths. Sliders set the width σ_x and the chirp a; a toggle splits the packet into two
	 * in-phase copies a distance d apart, chapter 8.1's two places. The arithmetic is in ./uncertainty-packet.ts.
	 * Opens on one packet of width 1 without a chirp, at the bound; three predictions at the top are answered once
	 * the reader has done what each asks. Nothing in it moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowHorizontalIcon,
		RefreshIcon,
		RulerDimensionLineIcon,
		SineIcon,
		SplitIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		CHIRP,
		DIST,
		MANY,
		OPENING,
		P_SPAN,
		SIGMA,
		X_SPAN,
		fixed,
		landed,
		momentumCurve,
		noteFirst,
		noteSecond,
		noteThird,
		peakOf,
		positionCurve,
		reading,
		stepped,
		texFixed,
		type Range,
		type Settings
	} from './uncertainty-packet';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let sigma = $state(OPENING.sigma);
	let a = $state(OPENING.a);
	let split = $state(OPENING.split);
	let d = $state(OPENING.d);

	const settings = $derived<Settings>({ sigma, a, split, d });

	function setSigma(v: number) {
		sigma = landed(v, SIGMA);
		note();
	}
	function setA(v: number) {
		a = landed(v, CHIRP);
		note();
	}
	function setSplit(v: boolean) {
		split = v;
		note();
	}
	function setD(v: number) {
		d = landed(v, DIST);
		note();
	}
	function reset() {
		sigma = OPENING.sigma;
		a = OPENING.a;
		split = OPENING.split;
		d = OPENING.d;
		note();
	}

	/** Arrow keys step a slider onto its grid, with Shift by a larger step. */
	function sliderKeys(get: () => number, set: (v: number) => void, range: Range) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const next = stepped(get(), e.key, e.shiftKey, range);
			if (next === undefined) return;
			e.preventDefault();
			set(next);
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	/** The widths one unchirped packet has had, the opening's among them. */
	let seen: number[] = [OPENING.sigma];
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		const s = { sigma, a, split, d };
		const f = noteFirst(first, seen, s);
		first = f.done;
		seen = f.seen;
		second = noteSecond(second, s);
		third = noteThird(third, s);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const now = $derived(reading(settings));
	/** Whether the closed form shown may be written out: not before the prediction it answers is answered. */
	const formShown = $derived(split ? third : second);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const W = $derived(phone.current ? 400 : 700);
	const px0 = 46;
	const px1 = $derived(W - 24);
	/** The two panels: where each starts, its peak's height and its baseline. */
	const TOP = { y: 0, peak: 42, base: 140, wave: 42, ticks: 202 };
	const LOW = { y: 222, peak: 42, base: 150, ticks: 168 };
	const H = $derived(LOW.y + LOW.ticks + 10);

	const xOf = (x: number) => px0 + ((px1 - px0) * (x + X_SPAN)) / (2 * X_SPAN);
	const pOf = (p: number) => px0 + ((px1 - px0) * (p + P_SPAN)) / (2 * P_SPAN);
	const clampX = (v: number) => Math.max(px0, Math.min(px1, v));

	// the packet
	const place = $derived(positionCurve(settings, 1400));
	const placePeak = $derived(peakOf(place.map((q) => q.rho)));
	const placeY = (rho: number) => TOP.base - ((TOP.base - TOP.peak) * rho) / placePeak;
	const waveY = (re: number) => TOP.base - (TOP.wave * re) / Math.sqrt(placePeak);
	const placeFill = $derived(
		`M${f2(xOf(-X_SPAN))},${TOP.base}` +
			place.map((q) => `L${f2(xOf(q.x))},${f2(placeY(q.rho))}`).join('') +
			`L${f2(xOf(X_SPAN))},${TOP.base}Z`
	);
	const placeLine = $derived(
		place.map((q, i) => `${i ? 'L' : 'M'}${f2(xOf(q.x))},${f2(placeY(q.rho))}`).join('')
	);
	const waveLine = $derived(
		place.map((q, i) => `${i ? 'L' : 'M'}${f2(xOf(q.x))},${f2(waveY(q.re))}`).join('')
	);

	// the momenta, clipped to the plot
	const momenta = $derived(momentumCurve(now.t));
	const momentaPeak = $derived(
		peakOf(momenta.filter((q) => Math.abs(q.p) <= P_SPAN).map((q) => q.rho))
	);
	const momentumY = (rho: number) => LOW.base - ((LOW.base - LOW.peak) * rho) / momentaPeak;
	const momentaPoints = $derived(
		momenta.map((q) => ({ x: Math.max(px0, Math.min(px1, pOf(q.p))), y: momentumY(q.rho) }))
	);
	const momentaLine = $derived(
		momentaPoints.map((q, i) => `${i ? 'L' : 'M'}${f2(q.x)},${f2(q.y)}`).join('')
	);
	const momentaFill = $derived(`M${px0},${LOW.base}L${momentaLine.slice(1)}L${px1},${LOW.base}Z`);

	/** A bracket of one standard deviation from the mean, at e^{−1/2} of the curve's height. */
	const HALF = Math.exp(-0.5);
	function bracket(x0: number, x1: number, base: number, peak: number) {
		const y = base - (base - peak) * HALF;
		const a0 = clampX(x0);
		const a1 = clampX(x1);
		return { x0: a0, x1: a1, y, cut: x1 > px1 + 0.5, narrow: a1 - a0 < 26 * u };
	}
	const xBracket = $derived(
		bracket(xOf(now.t.meanX), xOf(now.t.meanX + now.sigmaX), TOP.base, TOP.peak)
	);
	const pBracket = $derived(
		bracket(pOf(now.t.meanP), pOf(now.t.meanP + now.sigmaP), LOW.base, LOW.peak)
	);

	const xTicks = Array.from({ length: 13 }, (_, i) => -12 + 2 * i);
	const pTicks = Array.from({ length: 13 }, (_, i) => -6 + i);

	// --- the words --------------------------------------------------------------------------------------------------
	const shape = $derived(
		split
			? `two in-phase copies, each of width σ_x0 = ${fixed(sigma, 2)}, a distance d = ${fixed(d, 1)} apart`
			: `one packet of width σ_x = ${fixed(sigma, 2)}`
	);
	const chirpWords = $derived(a === 0 ? 'no chirp' : `a chirp a = ${fixed(a, 2)}`);
	const description = $derived(
		`Above: |ψ(x)|² for ${shape}, with ${chirpWords}, as a filled curve over x from −12 to 12, with Re ψ as a thin grey line` +
			(a === 0 ? ' that follows its envelope' : ' that oscillates faster away from the centre') +
			`; its standard deviation σ_x = ${fixed(now.sigmaX)} is marked. Below: the momentum distribution from the ` +
			`transform, over p from −6 to 6, with σ_p = ${fixed(now.sigmaP)} marked` +
			(split ? ', its envelope crossed by fringes' : '') +
			`. The product σ_xσ_p/(ħ/2) = ${fixed(now.ratio)}.`
	);
	const summary = $derived(
		`σ_x = ${fixed(now.sigmaX)}, σ_p = ${fixed(now.sigmaP)}, σ_xσ_p/(ħ/2) = ${fixed(now.ratio)}.`
	);
	const agrees = (x: number, y: number) => Math.abs(x - y) <= 5e-4 * Math.abs(y);

	const closedTex = $derived.by(() => {
		const c = now.closed;
		if (!c) return undefined;
		if (!split)
			return formShown
				? `\\sigma_p = \\frac{\\hbar}{2\\sigma_x}\\sqrt{1 + 16a^2\\sigma_x^4} = ${texFixed(c.sigmaP)}`
				: `\\sigma_p = ${texFixed(c.sigmaP)}`;
		return formShown
			? `\\sigma_x^2 = \\sigma_{x0}^2 + \\frac{d^2/4}{1 + e^{-d^2/8\\sigma_{x0}^2}} = ${texFixed(c.sigmaX ** 2)}`
			: `\\sigma_x = ${texFixed(c.sigmaX)},\\quad \\sigma_p = ${texFixed(c.sigmaP)}`;
	});
	const closedAgrees = $derived(
		now.closed !== undefined &&
			agrees(now.sigmaX, now.closed.sigmaX) &&
			agrees(now.sigmaP, now.closed.sigmaP)
	);
</script>

<div class="uncertainty-packet">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Narrow the packet by half. What happens to the spread of momenta?
			{:else if step === 2}
				Add a chirp. Can the ratio <Tex math="\sigma_x\sigma_p/(\hbar/2)" /> fall below 1?
			{:else}
				Split the packet, with <Tex math="d" /> several times <Tex math="\sigma_x" />. Which spread
				grows?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>It doubles, and the ratio stays at 1.</strong> Without a chirp the packet is chapter
				8.1’s Gaussian, whose transform is chapter 2.6’s bell <Tex math={'e^{-\\sigma_x^2k^2}'} />,
				so <Tex math="\sigma_p = \hbar/2\sigma_x" />: halve the width and the momenta spread twice
				as far. Their product stays at <Tex math="\hbar/2" /> at every width, the least that Robertson’s
				inequality allows.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>No; it only grows.</strong> The chirp <Tex math={'e^{iax^2}'} /> leaves <Tex
					math="|\psi|^2"
				/> alone, so <Tex math="\sigma_x" /> stays, but it spreads the momenta:
				<Tex math={'\\sigma_p = (\\hbar/2\\sigma_x)\\sqrt{1 + 16a^2\\sigma_x^4}'} />. The ratio is
				<Tex math={'\\sqrt{1 + 16a^2\\sigma_x^4}'} />, never below 1, and the same chirp costs a
				wide packet more than a narrow one.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong
					><Tex math="\sigma_x" />, to nearly <Tex math="d/2" />, while <Tex math="\sigma_p" /> hardly
					changes, so the ratio grows.</strong
				>
				For two copies of width <Tex math={'\\sigma_{x0}'} />,
				<Tex math={'\\sigma_x^2 = \\sigma_{x0}^2 + (d^2/4)/(1 + e^{-d^2/8\\sigma_{x0}^2})'} />. Each
				copy alone has the same momenta; the fine fringes across their distribution, <Tex
					math="2\pi\hbar/d"
				/> apart, are the two places interfering. Nearer, where the copies overlap, <Tex
					math="\sigma_x"
				/> grows by less and <Tex math="\sigma_p" /> falls a little below one copy’s.
			{:else if step === 1}
				The answer appears once you have halved the width of one packet without a chirp, from 1 to
				0.5, say.
			{:else if step === 2}
				The answer appears once you have added a chirp to one packet.
			{:else}
				The answer appears once you have split the packet with <Tex math="d" /> at least {MANY} times
				its width <Tex math="\sigma_x" />.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {W} {H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<!-- the packet -->
			<g transform="translate(0 {TOP.y})">
				<text class="title" x="6" y="14"
					>The packet: |<tspan class="it">ψ</tspan>(<tspan class="it">x</tspan>)|<tspan
						class="sup"
						dy="-4">2</tspan
					><tspan dy="4">, with Re&nbsp;</tspan><tspan class="it">ψ</tspan> in grey</text
				>
				<line class="grid" x1={px0} x2={px1} y1={TOP.peak} y2={TOP.peak} />
				<text class="small dim end" x={px0 - 6} y={TOP.peak + 4}>{fixed(placePeak, 2)}</text>
				<path class="wave" d={waveLine} />
				<path class="fill" d={placeFill} />
				<path class="curve" d={placeLine} />
				<line class="axis" x1={px0} x2={px1} y1={TOP.base} y2={TOP.base} />
				<text class="small dim end" x={px0 - 6} y={TOP.base + 4}>0</text>
				{#each xTicks as t (t)}
					<line
						class="tick"
						x1={xOf(t)}
						x2={xOf(t)}
						y1={TOP.base + TOP.wave + 4}
						y2={TOP.base + TOP.wave + 8}
					/>
					{#if t % 4 === 0}
						<text class="small dim mid" x={xOf(t)} y={TOP.ticks}>{fixed(t, 0)}</text>
					{/if}
				{/each}
				<line
					class="axis faint"
					x1={px0}
					x2={px1}
					y1={TOP.base + TOP.wave + 4}
					y2={TOP.base + TOP.wave + 4}
				/>
				<text class="small it start" x={px1 + 8} y={TOP.base + TOP.wave + 8}>x</text>

				<g class="bracket">
					<line x1={f2(xBracket.x0)} x2={f2(xBracket.x1)} y1={f2(xBracket.y)} y2={f2(xBracket.y)} />
					<line
						x1={f2(xBracket.x0)}
						x2={f2(xBracket.x0)}
						y1={f2(xBracket.y - 4)}
						y2={f2(xBracket.y + 4)}
					/>
					<line
						x1={f2(xBracket.x1)}
						x2={f2(xBracket.x1)}
						y1={f2(xBracket.y - 4)}
						y2={f2(xBracket.y + 4)}
					/>
				</g>
				<text
					class="small halo strong {xBracket.narrow ? 'start' : 'mid'}"
					x={f2(xBracket.narrow ? xBracket.x1 + 6 : (xBracket.x0 + xBracket.x1) / 2)}
					y={f2(xBracket.narrow ? xBracket.y + 4 : xBracket.y - 7)}
					><tspan class="it">σ</tspan><tspan class="it sub" dy="3">x</tspan></text
				>
			</g>

			<!-- the momenta -->
			<g transform="translate(0 {LOW.y})">
				<text class="title" x="6" y="14"
					>The momenta: |<tspan class="it">ψ̃</tspan>(<tspan class="it">p</tspan>)|<tspan
						class="sup"
						dy="-4">2</tspan
					><tspan dy="4">/2π, from the transform</tspan></text
				>
				<line class="grid" x1={px0} x2={px1} y1={LOW.peak} y2={LOW.peak} />
				<text class="small dim end" x={px0 - 6} y={LOW.peak + 4}>{fixed(momentaPeak, 2)}</text>
				<path class="fill" d={momentaFill} />
				<path class="curve" d={momentaLine} />
				<line class="axis" x1={px0} x2={px1} y1={LOW.base} y2={LOW.base} />
				<text class="small dim end" x={px0 - 6} y={LOW.base + 4}>0</text>
				{#each pTicks as t (t)}
					<line class="tick" x1={pOf(t)} x2={pOf(t)} y1={LOW.base} y2={LOW.base + 4} />
					{#if t % 2 === 0}
						<text class="small dim mid" x={pOf(t)} y={LOW.ticks}>{fixed(t, 0)}</text>
					{/if}
				{/each}
				<text class="small it start" x={px1 + 8} y={LOW.base + 4}>p</text>

				<g class="bracket">
					<line x1={f2(pBracket.x0)} x2={f2(pBracket.x1)} y1={f2(pBracket.y)} y2={f2(pBracket.y)} />
					<line
						x1={f2(pBracket.x0)}
						x2={f2(pBracket.x0)}
						y1={f2(pBracket.y - 4)}
						y2={f2(pBracket.y + 4)}
					/>
					{#if pBracket.cut}
						<polygon
							points="{f2(pBracket.x1)},{f2(pBracket.y)} {f2(pBracket.x1 - 6)},{f2(
								pBracket.y - 3.5
							)} {f2(pBracket.x1 - 6)},{f2(pBracket.y + 3.5)}"
						/>
					{:else}
						<line
							x1={f2(pBracket.x1)}
							x2={f2(pBracket.x1)}
							y1={f2(pBracket.y - 4)}
							y2={f2(pBracket.y + 4)}
						/>
					{/if}
				</g>
				<text
					class="small halo strong {pBracket.narrow ? 'start' : 'mid'}"
					x={f2(pBracket.narrow ? pBracket.x1 + 6 : (pBracket.x0 + pBracket.x1) / 2)}
					y={f2(pBracket.narrow ? pBracket.y + 4 : pBracket.y - 7)}
					><tspan class="it">σ</tspan><tspan class="it sub" dy="3">p</tspan>{#if pBracket.cut}<tspan
							dy="-3">, beyond the plot</tspan
						>{/if}</text
				>
			</g>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="fill-key"></span>a probability density, each scaled to its own peak</li>
			<li>
				<span class="line-key wave-key"></span><span
					>Re <Tex math="\psi" />, which shows the chirp</span
				>
			</li>
			<li>
				<span class="bracket-key"></span><span
					>one standard deviation from the mean, at <Tex math={'e^{-1/2}'} /> of the height</span
				>
			</li>
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => sigma, setSigma, SIGMA)}
				role="presentation"
			>
				<Slider
					id="{uid}-sigma"
					label="Width"
					icon={ArrowHorizontalIcon}
					min={SIGMA.min}
					max={SIGMA.max}
					step={SIGMA.step}
					bind:value={() => sigma, setSigma}
					readout={split ? `σₓ₀ = ${fixed(sigma, 2)} each` : `σₓ = ${fixed(sigma, 2)}`}
					marks={[
						{ at: 0.25, label: '0.25' },
						{ at: 0.5, label: '0.5' },
						{ at: 1, label: '1, as the figure opens' },
						{ at: 2, label: '2' },
						{ at: 4, label: '4' }
					]}
					marksHint="the ticks mark 0.25, 0.5, 1, 2 and 4"
				/>
			</div>
			<div class="slot" onkeydowncapture={sliderKeys(() => a, setA, CHIRP)} role="presentation">
				<Slider
					id="{uid}-chirp"
					label="Chirp"
					icon={SineIcon}
					min={CHIRP.min}
					max={CHIRP.max}
					step={CHIRP.step}
					bind:value={() => a, setA}
					readout="a = {fixed(a, 2)}"
					marks={[
						{ at: 0, label: 'none, as the figure opens' },
						{ at: 0.25, label: '0.25' },
						{ at: 0.5, label: '0.5' },
						{ at: 1, label: '1' }
					]}
					marksHint="the ticks mark 0, 0.25, 0.5 and 1"
				/>
			</div>
			<div class="slot toggle-slot">
				<Toggle
					icon={SplitIcon}
					label="Split into two packets"
					bind:checked={() => split, setSplit}
				/>
			</div>
			<div
				class={['slot', { off: !split }]}
				inert={!split}
				onkeydowncapture={sliderKeys(() => d, setD, DIST)}
				role="presentation"
			>
				<Slider
					id="{uid}-d"
					label="Distance apart"
					icon={RulerDimensionLineIcon}
					min={DIST.min}
					max={DIST.max}
					step={DIST.step}
					bind:value={() => d, setD}
					readout={split ? `d = ${fixed(d, 1)}` : `d = ${fixed(d, 1)}, once split`}
					marks={[
						{ at: 0, label: '0, one place' },
						{ at: 3, label: '3, as the copies open' },
						...(MANY * sigma <= DIST.max && MANY * sigma !== 3
							? [{ at: landed(MANY * sigma, DIST), label: `${MANY} widths` }]
							: []),
						{ at: 10, label: '10' }
					]}
					marksHint="the ticks mark 0, 3, {MANY} widths apart and 10"
				/>
			</div>
		</div>

		<div class="controls">
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Reach the sliders and the toggle with Tab. The arrow keys step the width and the chirp by
				0.05 and the distance by 0.5, Shift by 0.25, 0.25 and 2; Home and End go to the ends. Space
				splits the packet and joins it again.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>The spreads</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\sigma_x = ${texFixed(now.sigmaX)},\\quad \\sigma_p = ${texFixed(now.sigmaP)}`}
						/></span
					>
					<span class="also">from <Tex math="|\psi|^2" /> on the grid and from its transform</span>
				</dd>
			</div>
			<div class="row">
				<dt>The product</dt>
				<dd>
					<span class="eq"
						><Tex math={`\\sigma_x\\sigma_p/(\\hbar/2) = ${texFixed(now.ratio)}`} /></span
					>
				</dd>
			</div>
			{#if split}
				<div class="row">
					<dt>One copy alone</dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\sigma_{x0} = ${texFixed(now.alone.sigmaX)},\\quad \\sigma_p = ${texFixed(now.alone.sigmaP)}`}
							/></span
						>
					</dd>
				</div>
			{/if}
			<div class="row">
				<dt>The closed form</dt>
				<dd>
					{#if closedTex}
						<span class="eq"><Tex math={closedTex} /></span>
						<span class="also"
							>{split ? 'for two copies without a chirp' : 'the chapter’s'}; {closedAgrees
								? 'the transform agrees to three figures'
								: 'the transform differs'}</span
						>
					{:else}
						<span class="also"
							>the chapter gives one for two copies without a chirp; set <Tex math="a = 0" /> to check
							it</span
						>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			In units with <Tex math="\hbar = 1" />, so that <Tex math="p = k" />. The figure samples <Tex
				math="\psi"
			/> at 2048 points across a span of <span class="value">{fixed(now.t.L, 1)}</span>, chosen for
			each state so that both the packet and its momenta are resolved, and takes the fast Fourier
			transform, <Tex math={'\\tilde\\psi(k) = \\int\\psi\\,e^{-ikx}\\,dx'} /> as in chapter 2.6. The
			momentum density <Tex math="|\tilde\psi(k)|^2/2\pi" /> is normalized to unit area, as
			<Tex math="|\psi|^2" /> is; each plot is drawn to its own peak, whose value is marked at its left.
			The two copies are in phase, each with the slider’s width and its own chirp about its centre. Both
			means are zero, so each bracket runs from zero to one standard deviation.
		</p>
	</div>
</div>

<style>
	.uncertainty-packet {
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 700px;
		height: auto;
		margin: 0 auto;
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

	tspan.sub,
	tspan.sup {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the curves: ink, a pale ink fill, Re ψ thin and grey beneath */
	.fill {
		fill: color-mix(in srgb, var(--text) 13%, transparent);
		stroke: none;
	}

	.curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linejoin: round;
	}

	.wave {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
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
		stroke: color-mix(in srgb, var(--text) 14%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.bracket line {
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.bracket polygon {
		fill: var(--text);
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 700px;
		margin: 0.45rem auto 0;
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

	.fill-key {
		flex: none;
		width: 1.1rem;
		height: 0.6rem;
		border-top: 1.7px solid var(--text);
		background: color-mix(in srgb, var(--text) 13%, transparent);
	}

	.line-key {
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1px solid color-mix(in srgb, var(--text) 42%, transparent);
	}

	.bracket-key {
		flex: none;
		width: 1.1rem;
		height: 0.5rem;
		border: 1.3px solid var(--text);
		border-top: 0;
		border-bottom: 0;
		background: linear-gradient(var(--text), var(--text)) center / 100% 1.3px no-repeat;
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
		grid-template-columns: repeat(auto-fit, minmax(14.5rem, 1fr));
		gap: 0.8rem 1.1rem;
		align-items: start;
	}

	.slot {
		min-width: 0;
		transition: opacity 0.15s;
	}

	.slot.off {
		opacity: 0.45;
	}

	.toggle-slot {
		align-self: center;
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

	.value {
		font-weight: 600;
		color: var(--text);
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

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action,
		.slot {
			transition: none;
		}
	}
</style>
