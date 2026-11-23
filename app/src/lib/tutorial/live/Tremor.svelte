<script lang="ts">
	/**
	 * Chapter 4.6's tremor, the live version of the paper's fig:tremor: Appendix A's lattice ball of 924 equal masses
	 * (blue) and its shell of 668 (orange), of the same total mass and radius. Left, each body's cumulative Σ c_n² of
	 * the quadrupole h = x·U·x in order of frequency, frequency in units of the ball's strongest mode at s = 1, r = ½,
	 * as the paper draws it; a switch replaces it by the static jitter Σ c_n²/ω_n². Right (below on a phone), the
	 * spectrum of the quadrupole's rate, Σ c_n²·2Γ_nω²/[(ω_n² − ω²)² + Γ_n²ω²], on a logarithmic axis, every line
	 * drawn with its width Γ_n = ω_n/Q. A slider multiplies every spring by s from ¼ to 4, three buttons set the ratio
	 * r of the next-nearest springs to the nearest, and a slider sets Q from 3 to 300. The numbers come from
	 * ./tremor.ts and its exact table. Two predictions at the top are answered once the reader has done what they ask.
	 * Only the left axis moves by itself, when the static jitter rescales it; under reduced motion it jumps.
	 */
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DropletIcon,
		Dumbbell01Icon,
		ThermometerIcon,
		Undo02Icon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		LOW_Q,
		OPENING,
		PLOT_MOST,
		QUALITY,
		RATE_AXIS,
		RATIOS,
		SECOND_RATIO,
		SPECTRUM_AXIS,
		STIFFNESS,
		below,
		fourfold,
		jitterAxis,
		levels,
		lowQ,
		peak,
		qualityOf,
		samples,
		share,
		spectrum,
		spectrumArea,
		steps,
		stiffnessOf,
		strongest,
		sum,
		total,
		type Body,
		type Level,
		type Measure,
		type Ratio
	} from './tremor';

	const uid = $props.id();

	// --- the springs and the friction -------------------------------------------------------------------------------
	let logS = $state(Math.log2(OPENING.s));
	let ratio = $state<Ratio>(OPENING.ratio);
	let logQ = $state(Math.log10(OPENING.Q));
	let still = $state(OPENING.jitter);

	const s = $derived(stiffnessOf(logS));
	const Q = $derived(qualityOf(logQ));
	const measure = $derived<Measure>(still ? 'jitter' : 'rate');
	const bodies = $derived<Record<Body, Level[]>>({
		ball: levels('ball', ratio, s),
		shell: levels('shell', ratio, s)
	});

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	/** A slider's value, kept on its steps. */
	const onStep = (v: number, by: number, from: number) =>
		Number((from + Math.round((v - from) / by) * by).toFixed(6));

	function setS(log: number) {
		logS = clamp(onStep(log, STIFFNESS.step, STIFFNESS.low), STIFFNESS.low, STIFFNESS.high);
		note();
	}

	function setQ(log: number) {
		logQ = clamp(onStep(log, QUALITY.step, QUALITY.low), QUALITY.low, QUALITY.high);
		note();
	}

	function setRatio(r: Ratio) {
		ratio = r;
		note();
	}

	function reset() {
		logS = Math.log2(OPENING.s);
		ratio = OPENING.ratio;
		logQ = Math.log10(OPENING.Q);
		still = OPENING.jitter;
		note();
	}

	/** The page keys move a slider by its larger step. */
	function pageKeys(get: () => number, set: (v: number) => void, page: number) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
			e.preventDefault();
			set(get() + (e.key === 'PageUp' ? page : -page));
		};
	}

	/** On the ratio's buttons the arrow keys move to the next one. */
	function ratioKey(e: KeyboardEvent) {
		const by =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? 1
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? -1
					: 0;
		if (!by) return;
		e.preventDefault();
		const i = clamp(RATIOS.indexOf(ratio) + by, 0, RATIOS.length - 1);
		setRatio(RATIOS[i]);
		const group = (e.currentTarget as HTMLElement).parentElement;
		group?.querySelectorAll('button')[i]?.focus();
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The softest springs since the first prediction was asked. */
	let softest = $state(OPENING.s);
	type Stiffer = {
		from: number;
		to: number;
		before: Record<Body, number>;
		after: Record<Body, number>;
		totals: Record<Body, number>;
	};
	type Broader = {
		low: number;
		high: number;
		areas: Record<Body, number>;
	};
	let stiffer = $state.raw<Stiffer | undefined>();
	let broader = $state.raw<Broader | undefined>();
	const revealed = $derived(step === 1 ? stiffer !== undefined : broader !== undefined);

	function choose(k: 1 | 2) {
		step = k;
		// the answer comes only from what the reader does once the question is asked
		if (k === 1 && !stiffer) softest = s;
	}

	function note() {
		if (step === 1 && !stiffer) {
			softest = Math.min(softest, s);
			if (fourfold(s, softest)) {
				const soft = {
					ball: levels('ball', ratio, softest),
					shell: levels('shell', ratio, softest)
				};
				const now = { ball: levels('ball', ratio, s), shell: levels('shell', ratio, s) };
				stiffer = {
					from: softest,
					to: s,
					before: { ball: strongest(soft.ball).x, shell: strongest(soft.shell).x },
					after: { ball: strongest(now.ball).x, shell: strongest(now.shell).x },
					totals: { ball: total(now.ball), shell: total(now.shell) }
				};
			}
		}
		if (step === 2 && !broader && lowQ(Q)) {
			const ball = levels('ball', ratio, s);
			const shell = levels('shell', ratio, s);
			const top = strongest(ball);
			broader = {
				low: peak(top, Q),
				high: peak(top, 10 * Q),
				areas: { ball: spectrumArea(ball, Q), shell: spectrumArea(shell, Q) }
			};
		}
	}

	/** Where the first prediction's answer appears: four times the softest springs, if the slider reaches it. */
	const target = $derived(4 * softest);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const totals = $derived({ ball: total(bodies.ball), shell: total(bodies.shell) });
	const jitters = $derived({
		ball: sum(bodies.ball, 'jitter'),
		shell: sum(bodies.shell, 'jitter')
	});
	const tops = $derived({ ball: strongest(bodies.ball), shell: strongest(bodies.shell) });
	const shares = $derived({ ball: share(bodies.ball), shell: share(bodies.shell) });
	const underTwice = $derived(below(bodies.ball, 2 * tops.ball.x));
	const areas = $derived({
		ball: spectrumArea(bodies.ball, Q),
		shell: spectrumArea(bodies.shell, Q)
	});
	const ends = $derived(still ? jitters : totals);

	const f2 = (n: number) => n.toFixed(2);
	const f3 = (n: number) => n.toFixed(3);
	const pct = (x: number) => (100 * x).toFixed(1);
	const sText = (v: number) => (v < 1 ? v.toFixed(3).replace(/0$/, '') : v.toFixed(2));
	const rText: Record<Ratio, string> = { 0.25: '¼', 0.5: '½', 1: '1' };
	const rTex: Record<Ratio, string> = { 0.25: '\\tfrac14', 0.5: '\\tfrac12', 1: '1' };
	const QH = '\\htmlClass{q-matter}{Q}_h';
	const MP = '\\htmlClass{q-matter}{m}_p';

	// --- the drawing ------------------------------------------------------------------------------------------------
	const box = { W: 340, H: 274, L: 44, R: 328, T: 34, B: 226 };
	/** Drawing units in one CSS pixel, for each plot. */
	let u1 = $state(1);
	let u2 = $state(1);

	const X = (x: number) => box.L + (x / PLOT_MOST) * (box.R - box.L);
	const xTicks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

	// the left plot: the paper's axis for the rate, fitted for the static jitter
	const axis = $derived(still ? jitterAxis(Math.max(jitters.ball, jitters.shell)) : RATE_AXIS);
	const top = Tween.of(() => axis.top, {
		duration: () => (prefersReducedMotion.current ? 0 : 450),
		easing: cubicOut
	});
	const Y1 = (v: number) => box.B - (v / top.current) * (box.B - box.T);
	const yTicks = $derived.by(() => {
		const out: number[] = [];
		for (let v = 0; v <= axis.top + 1e-9; v += axis.step) out.push(Number(v.toFixed(6)));
		return out;
	});
	const yText = (v: number) => (still ? String(v) : v.toFixed(1));

	const stepPath = (ls: readonly Level[]) =>
		steps(ls, measure, PLOT_MOST)
			.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(X(x))},${f2(Y1(y))}`)
			.join('');
	const cumulative = $derived({ ball: stepPath(bodies.ball), shell: stepPath(bodies.shell) });

	// the right plot: logarithmic, 10⁻³ to 10³
	const Y2 = (v: number) => {
		const lv = Math.log10(Math.max(v, 1e-12));
		return (
			box.B -
			((lv - SPECTRUM_AXIS.low) / (SPECTRUM_AXIS.high - SPECTRUM_AXIS.low)) * (box.B - box.T)
		);
	};
	const decades = Array.from(
		{ length: SPECTRUM_AXIS.high - SPECTRUM_AXIS.low + 1 },
		(_, i) => SPECTRUM_AXIS.low + i
	);
	const SUPER: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³' };
	const decadeText = (k: number) =>
		k === 0 ? '1' : k === 1 ? '10' : `10${[...String(k)].map((c) => SUPER[c]).join('')}`;
	const floor = Y2(10 ** SPECTRUM_AXIS.low) + 40;

	function spectrumPath(ls: readonly Level[]) {
		const xs = samples(ls, Q, PLOT_MOST);
		const line = xs
			.map((x, i) => `${i ? 'L' : 'M'}${f2(X(x))},${f2(Math.min(floor, Y2(spectrum(x, ls, Q))))}`)
			.join('');
		const fill = `${line}L${f2(X(xs[xs.length - 1]))},${f2(floor)}L${f2(X(xs[0]))},${f2(floor)}Z`;
		return { line, fill };
	}
	const spectra = $derived({ ball: spectrumPath(bodies.ball), shell: spectrumPath(bodies.shell) });

	/** The words beside each curve's end, as the paper places them. */
	const endWords = (b: Body) => `${b}: ${f2(ends[b])}`;
	const endY = (b: Body) => Y1(ends[b]) - 6 * u1;

	// --- the words for screen readers -------------------------------------------------------------------------------
	const description = $derived(
		`${still ? 'The static jitter' : 'The tremor of the quadrupole'}, added up mode by mode in order of frequency, for the lattice ball and shell, with every spring ${sText(s)} times as stiff as the paper's and next-nearest springs at ${rText[ratio]} of the nearest. ` +
			`The ball ends at ${f3(ends.ball)}, the shell at ${f3(ends.shell)}. ` +
			`The ball's strongest mode, at ${f3(tops.ball.x)}, holds ${f3(shares.ball)} of its tremor; the shell's, at ${f3(tops.shell.x)}, holds ${f3(shares.shell)}.`
	);
	const spectrumDescription = $derived(
		`The spectrum of the quadrupole's rate on a logarithmic scale, every mode a line of quality factor ${Q}. The ball's tallest line stands ${peak(tops.ball, Q).toPrecision(3)} high at ${f3(tops.ball.x)}; the shell's ${peak(tops.shell, Q).toPrecision(3)} at ${f3(tops.shell.x)}. The areas under them are ${f3(areas.ball)} and ${f3(areas.shell)}.`
	);
</script>

<div class="tremor">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as k (k)}
					<button type="button" aria-pressed={step === k} onclick={() => choose(k)}>{k}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Make every spring four times stiffer. What happens to the totals, and to the frequencies?
			{:else}
				Lower <Tex math="Q" /> to 3. Does the shell still tremble 1.22 times as much as the ball?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if step === 1 && stiffer}
				<strong>The totals stay; every frequency doubles.</strong> From
				<Tex math={`s = ${sText(stiffer.from)}`} /> to <Tex math={`s = ${sText(stiffer.to)}`} /> the ball’s
				strongest mode moved from {f3(stiffer.before.ball)} to {f3(stiffer.after.ball)} and the shell’s
				from {f3(stiffer.before.shell)} to {f3(stiffer.after.shell)}, each by a factor of
				{f2(stiffer.after.ball / stiffer.before.ball)}, while the totals stayed at {f3(
					stiffer.totals.ball
				)} and {f3(stiffer.totals.shell)}. A mode’s weight <Tex math="c_n^2" /> belongs to its shape,
				which a common factor on every spring does not change, and its frequency goes as the square root
				of the stiffness. So the stiffness sets where the tremor lies, and the arrangement of the mass
				sets how much there is.
				<button type="button" class="next" onclick={() => choose(2)}>Next prediction</button>
			{:else if step === 2 && broader}
				<strong>Yes: the lines broaden, their areas stay.</strong> At <Tex math="Q = 3" /> every line
				is ten times wider than at <Tex math="Q = 30" /> and ten times lower: the ball’s strongest line,
				alone, stands {broader.low.toPrecision(3)} high, against {broader.high.toPrecision(3)}. The
				areas under the two spectra, counted to infinity, are still {f3(broader.areas.ball)} and {f3(
					broader.areas.shell
				)}, in the ratio {f3(broader.areas.shell / broader.areas.ball)}. The friction spreads each
				mode’s share over frequency; it does not change the share.
			{:else if step === 1}
				{#if target <= 4 + 1e-9}
					The answer appears when the springs are four times as stiff as when this was asked: drag
					the stiffness to <Tex math={`s = ${sText(target)}`} />.
				{:else}
					The springs are already stiffer than a quarter of the slider’s end: move the stiffness
					down first, and the answer appears at four times the softest setting.
				{/if}
			{:else}
				{#if lowQ(Q)}
					<Tex math="Q" /> is at 3 already: move the friction up and back to its left end, and the answer
					appears.
				{:else}
					The answer appears when <Tex math="Q = 3" />: drag the friction to its left end, or press
					Home on it.
				{/if}
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="plots">
			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={description}
				{@attach fitText((value) => (u1 = value))}
			>
				<defs>
					<clipPath id="{uid}-left">
						<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T + 1} />
					</clipPath>
				</defs>
				<text class="title" x={box.L - 34 * u1} y={box.T - 14 * u1}
					>{#if still}⟨δ<tspan class="it">Q</tspan><tspan class="sub" dy={2.5 * u1}>h</tspan><tspan
							dy={-2.5 * u1}>²⟩, the ball’s at&nbsp;</tspan
						><tspan class="it">s</tspan> = 1,&nbsp;<tspan class="it">r</tspan> = ½ is 1{:else}⟨<tspan
							class="it">Q</tspan
						><tspan class="over" dx={-7.4 * u1} dy={-3.2 * u1}>˙</tspan><tspan
							class="sub"
							dx={1.2 * u1}
							dy={5.7 * u1}>h</tspan
						><tspan dy={-2.5 * u1}>²⟩, the ball’s total = 1</tspan>{/if}</text
				>
				<rect class="panel" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
				{#each yTicks as v (v)}
					{#if Y1(v) >= box.T - 0.5}
						<line class={['grid', { axis: v === 0 }]} x1={box.L} x2={box.R} y1={Y1(v)} y2={Y1(v)} />
						<text class="small y-tick" x={box.L - 5 * u1} y={Y1(v)}>{yText(v)}</text>
					{/if}
				{/each}
				{#each xTicks as x (x)}
					<line class="grid" x1={X(x)} x2={X(x)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(x)} y={box.B + 15 * u1}>{x.toFixed(1)}</text>
				{/each}
				<text class="small tick" x={(box.L + box.R) / 2} y={box.B + 36 * u1}
					>frequency / the ball’s strongest mode at <tspan class="it">s</tspan> = 1,
					<tspan class="it">r</tspan> = ½</text
				>
				<g clip-path="url(#{uid}-left)">
					{#each ['shell', 'ball'] as const as b (b)}
						<path class="step {b}" d={cumulative[b]} />
					{/each}
				</g>
				{#each ['shell', 'ball'] as const as b (b)}
					<text class="small end-words {b}" x={X(3.9)} y={endY(b)}>{endWords(b)}</text>
				{/each}
			</svg>

			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={spectrumDescription}
				{@attach fitText((value) => (u2 = value))}
			>
				<defs>
					<clipPath id="{uid}-right">
						<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
					</clipPath>
				</defs>
				<text class="title" x={box.L - 34 * u2} y={box.T - 14 * u2}
					>spectrum of <tspan class="it">Q</tspan><tspan class="over" dx={-7.4 * u2} dy={-3.2 * u2}
						>˙</tspan
					><tspan class="sub" dx={1.2 * u2} dy={5.7 * u2}>h</tspan><tspan dy={-2.5 * u2}
						>, per unit of frequency</tspan
					></text
				>
				<rect class="panel" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
				{#each decades as k (k)}
					<line
						class={['grid', { axis: k === 0 }]}
						x1={box.L}
						x2={box.R}
						y1={Y2(10 ** k)}
						y2={Y2(10 ** k)}
					/>
					<text class="small y-tick" x={box.L - 5 * u2} y={Y2(10 ** k)}>{decadeText(k)}</text>
				{/each}
				{#each xTicks as x (x)}
					<line class="grid" x1={X(x)} x2={X(x)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(x)} y={box.B + 15 * u2}>{x.toFixed(1)}</text>
				{/each}
				<text class="small tick" x={(box.L + box.R) / 2} y={box.B + 36 * u2}
					>frequency, as on the left; <tspan class="it">Q</tspan> = {Q}</text
				>
				<g clip-path="url(#{uid}-right)">
					{#each ['shell', 'ball'] as const as b (b)}
						<path class="fill {b}" d={spectra[b].fill} />
					{/each}
					{#each ['shell', 'ball'] as const as b (b)}
						<path class="curve {b}" d={spectra[b].line} />
					{/each}
				</g>
			</svg>
		</div>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch ball"></span>the ball, 924 masses</li>
			<li><span class="swatch shell"></span>the shell, 668 masses, beyond four spacings</li>
		</ul>
	</div>

	<div class="bar">
		<div class="row-controls">
			<div class="ratio">
				<span class="ratio-name" id="{uid}-ratio">Next-nearest springs</span>
				<div class="presets" role="group" aria-labelledby="{uid}-ratio">
					{#each RATIOS as r (r)}
						<button
							type="button"
							aria-pressed={ratio === r}
							aria-label="r = {rText[r]}{r === 0.5 ? ', the paper’s' : ''}"
							onclick={() => setRatio(r)}
							onkeydown={ratioKey}
							><span class="it-text">r</span> = {rText[r]}{#if r === 0.5}<span class="paper"
									>, the paper’s</span
								>{/if}</button
						>
					{/each}
				</div>
			</div>
			<div class="switch-cell">
				<Toggle icon={ThermometerIcon} label="Static jitter" bind:checked={still} />
			</div>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
				Reset
			</button>
		</div>
		<div class="sliders">
			<div onkeydowncapture={pageKeys(() => logS, setS, STIFFNESS.page)} role="presentation">
				<Slider
					id="{uid}-stiffness"
					label="Stiffness"
					icon={Dumbbell01Icon}
					min={STIFFNESS.low}
					max={STIFFNESS.high}
					step={STIFFNESS.step}
					bind:value={() => logS, setS}
					readout="every spring × {sText(s)}"
					ends={['× ¼', '× 4']}
					marks={[
						{ at: 0, label: 's = 1, the paper’s springs' },
						{ at: 2, label: 's = 4, every spring four times stiffer' }
					]}
					marksHint="the ticks mark the paper’s springs and four times stiffer"
				/>
			</div>
			<div onkeydowncapture={pageKeys(() => logQ, setQ, QUALITY.page)} role="presentation">
				<Slider
					id="{uid}-quality"
					label="Friction"
					icon={DropletIcon}
					min={QUALITY.low}
					max={QUALITY.high}
					step={QUALITY.step}
					bind:value={() => logQ, setQ}
					readout="Q = {Q}"
					ends={['Q = 3, broad', '300, sharp']}
					marks={[
						{ at: QUALITY.low, label: `Q = ${LOW_Q}` },
						{ at: Math.log10(OPENING.Q), label: 'Q = 30, where it opens' }
					]}
					marksHint="the ticks mark Q = 3 and Q = 30"
				/>
			</div>
		</div>
		<p class="hint">
			Drag the sliders, or reach each control with Tab: on a slider the arrow keys step the
			stiffness by a twentieth of a doubling and <Tex math="Q" /> by a fiftieth of a power of ten, and
			Page Up and Page Down ten times as far; on the spring ratios the arrow keys move between the three.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The bodies</dt>
				<dd>
					<Tex math={`s = ${sText(s)},\\quad r = ${rTex[ratio]}`} /><span class="also"
						>The ball is the sites of a simple cubic lattice within six spacings of its centre, less
						the centre; the shell keeps the 668 beyond four. The masses are equal and add to the
						same total in both. Nearest neighbours are joined by springs of stiffness <Tex
							math="s"
						/>, next-nearest by springs of <Tex math="rs" />.</span
					>
				</dd>
			</div>
			{#if still}
				<div class="row">
					<dt>Static jitter</dt>
					<dd>
						<Tex
							math={`\\sum c_n^2/\\omega_n^2:\\ \\text{ball } ${f3(jitters.ball)},\\ \\text{shell } ${f3(jitters.shell)}`}
						/><span class="also"
							>shell over ball {f2(jitters.shell / jitters.ball)}, in units of the ball’s at <Tex
								math="s = 1,\ r = \tfrac12"
							/>. Unlike the totals it changes with the springs: each weight counts over the square
							of its frequency, so it falls as <Tex math="1/s" />, and the soft shell holds far
							more.</span
						>
					</dd>
				</div>
			{:else}
				<div class="row">
					<dt>The totals</dt>
					<dd>
						<Tex
							math={`\\sum c_n^2:\\ \\text{ball } ${f3(totals.ball)},\\ \\text{shell } ${f3(totals.shell)}`}
						/><span class="also"
							>in the ratio {f3(totals.shell / totals.ball)}, that of the lattices’ <Tex
								math={`\\sum_p ${MP}r_p^2`}
								trust
							/>, {f3(SECOND_RATIO)}, at every setting. Each equals <Tex
								math={`\\sum_p ${MP}|\\nabla h(\\mathbf x_p)|^2`}
								trust
							/> to rounding.</span
						>
					</dd>
				</div>
			{/if}
			<div class="row">
				<dt>The strongest modes</dt>
				<dd>
					<Tex
						math={`\\text{ball } ${f3(shares.ball)}\\text{ at } ${f3(tops.ball.x)},\\quad \\text{shell } ${f3(shares.shell)}\\text{ at } ${f3(tops.shell.x)}`}
					/><span class="also"
						>the share of each body’s tremor in its strongest mode, and that mode’s frequency. The
						ball’s lies {f2(tops.ball.x / tops.shell.x)} times higher than the shell’s, and {pct(
							underTwice
						)}% of the ball’s tremor lies below twice it.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The friction</dt>
				<dd>
					<Tex math={`Q = ${Q},\\quad \\Gamma_n = \\omega_n/Q`} /><span class="also"
						>every mode equally damped. The area under each spectrum, from 0 to <Tex
							math="\infty"
						/> by quadrature: ball {f3(areas.ball)}, shell {f3(areas.shell)}, the totals at every <Tex
							math="Q"
						/>.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each mode <Tex math="n" /> holds <Tex math="k_BT\,c_n^2" /> of <Tex
				math={`\\langle\\dot{${QH}}^2\\rangle`}
				trust
			/>, for <Tex math="h = z^2 - \tfrac12(x^2 + y^2)" /> divided by <Tex math="\sqrt{1.5}" />. The
			weights and frequencies come from the exact normal modes of both lattices, found at each <Tex
				math="r"
			/>; the stiffness multiplies every frequency by <Tex math="\sqrt s" />. Frequency is in units
			of the ball’s strongest mode at <Tex math="s = 1,\ r = \tfrac12" />, as on the paper’s axis.
			The spectrum, each line <Tex
				math="c_n^2\cdot2\Gamma_n\omega^2/[(\omega_n^2 - \omega^2)^2 + \Gamma_n^2\omega^2]"
			/>, is drawn per unit of that frequency with the ball’s total as unit, so that its area up to
			any frequency is the height of the curve on the left there; its axis is logarithmic, so that
			the small lines show. The curves are exact.
		</p>
	</div>
</div>

<style>
	.tremor {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* the two bodies, as in the paper's figure */
	.ball {
		--hue: var(--accent-2);
	}

	.shell {
		--hue: var(--accent);
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
	.action:focus-visible,
	.presets button:focus-visible {
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

	/* --- the pictures --------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	.plots {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
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
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
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

	.sub {
		font-size: 0.75em;
	}

	/* the dot of a rate, set back over the letter before it */
	.over {
		font-family: var(--font-serif);
		font-weight: 700;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.step {
		fill: none;
		stroke: var(--hue);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: miter;
	}

	.end-words {
		text-anchor: end;
		fill: var(--hue);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.fill {
		fill: color-mix(in srgb, var(--hue) 13%, transparent);
		stroke: none;
	}

	.curve {
		fill: none;
		stroke: var(--hue);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
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
		border-top: 2px solid var(--hue);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.row-controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 11rem auto;
		gap: 0.6rem;
		align-items: end;
	}

	.ratio {
		display: grid;
		gap: 0.3rem;
	}

	.ratio-name {
		font: 500 0.74rem/1.2 var(--font-sans);
		color: var(--text-dim);
	}

	.presets {
		display: grid;
		grid-template-columns: 1fr 1.6fr 1fr;
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
		min-height: 2rem;
		padding: 0.3rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.76rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	@media (hover: hover) {
		.presets button[aria-pressed='false']:hover {
			color: var(--text);
		}
	}

	.it-text {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.08em;
		margin-right: 0.15em;
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.55rem;
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

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
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

		.plots {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.9rem;
		}

		.row-controls {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		.ratio {
			grid-column: 1 / -1;
		}

		.paper {
			display: none;
		}

		.presets {
			grid-template-columns: repeat(3, minmax(0, 1fr));
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
		.presets button,
		.action {
			transition: none;
		}
	}
</style>
