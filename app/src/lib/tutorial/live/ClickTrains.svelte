<script lang="ts">
	/**
	 * Chapter 8.5's click trains. Top: one or two trains of clicks along a time axis, as diagram tut-click-trains,
	 * thin ink ticks scrolling to the left as they arrive at the right edge, the windows marked by faint grey ticks.
	 * Below, left: the histogram of counts per window on a logarithmic axis, grey bars, with the Poisson and geometric
	 * laws at the same n̄ drawn over it. Right: the measured n̄, variance and coherences with their standard errors,
	 * and the two classical bounds, each struck through once the measurement breaks it by more than three errors.
	 * A switch chooses the steady, the thermal or the pair source, a logarithmic slider n̄ from 0.01 to 10. The
	 * engine and every number are in ./click-trains.ts. Opens on the steady source at n̄ = 1, running; under reduced
	 * motion it opens paused and still, and Run sets it going. Two predictions at the top are answered once the reader
	 * has done what each asks.
	 */
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		EraserIcon,
		FireIcon,
		Layers01Icon,
		Link02Icon,
		PauseIcon,
		PlayIcon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		COUNT_RATE,
		FLOOR,
		MIN_CLICKS,
		MIN_PAIRS,
		MODES,
		MODE_NAMES,
		NBAR,
		NOTHING_RAN,
		OPENING,
		PHONE_WINDOWS,
		SHOW_RATE,
		TRAIN_WINDOWS,
		countRange,
		countWords,
		crossBound,
		emptyTally,
		errorsWords,
		fillTrain,
		fractions,
		generator,
		geometricLaw,
		lawPoints,
		lowerBound,
		nbarOf,
		nbarWords,
		noteFirst,
		noteRun,
		noteSecond,
		poissonLaw,
		ranEnough,
		readings,
		runWindows,
		scrollTrain,
		snapLt,
		stepped,
		twoDetectors,
		windowsDue,
		withError,
		type Estimate,
		type Mode,
		type Range,
		type Shown,
		type Verdict
	} from './click-trains';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let mode = $state<Mode>(OPENING.mode);
	/** log₁₀ n̄. */
	let lt = $state(OPENING.lt);
	const nbar = $derived(nbarOf(lt));
	const two = $derived(twoDetectors(mode));

	function setMode(v: Mode) {
		if (v === mode) return;
		mode = v;
		restart();
	}
	function setLt(v: number) {
		const next = snapLt(v);
		if (next === lt) return;
		lt = next;
		restart();
	}

	/** Arrow keys step the slider onto its grid, with Shift by a larger step. */
	function sliderKeys(get: () => number, set: (v: number) => void, range: Range) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const next = stepped(get(), e.key, e.shiftKey, range);
			if (next === undefined) return;
			e.preventDefault();
			set(next);
		};
	}

	/** On the switch the arrow keys choose the next source, Home and End the first and the last. */
	function modeKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLButtonElement)) return;
		const i = MODES.indexOf(mode);
		const next =
			e.key === 'ArrowRight' || e.key === 'ArrowDown'
				? Math.min(MODES.length - 1, i + 1)
				: e.key === 'ArrowLeft' || e.key === 'ArrowUp'
					? Math.max(0, i - 1)
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? MODES.length - 1
							: undefined;
		if (next === undefined) return;
		e.preventDefault();
		setMode(MODES[next]);
		(e.currentTarget as HTMLElement).querySelectorAll('button')[next]?.focus();
	}

	// --- the engine -------------------------------------------------------------------------------------------------
	/** The stream of random numbers: seed 1 on the server and at hydration, seeded afresh once the page is the reader's. */
	let random = generator(1);
	onMount(() => {
		random = generator(crypto.getRandomValues(new Uint32Array(1))[0]);
	});

	/** The windows counted since the last clearing; not reactive, read into `shown` a few times a second. */
	let tally = emptyTally();
	/** The fraction of a window owed to the count from the last frame. */
	let owed = 0;
	/** "Now", the trains' right edge, in windows since the start. */
	let head = $state(TRAIN_WINDOWS);
	let train = $state.raw<Shown[]>(
		fillTrain(TRAIN_WINDOWS, OPENING.mode, nbarOf(OPENING.lt), random)
	);

	/** The readings and the histogram as last shown. */
	let shown = $state.raw(snapshot());

	function snapshot() {
		return {
			r: readings(tally, twoDetectors(mode)),
			hist: fractions(tally, countRange(mode, nbarOf(lt)))
		};
	}

	/** Shows the tally, and notes the run for the predictions once it is long enough. */
	function refresh() {
		shown = snapshot();
		if (!ranEnough(mode, tally)) return;
		const next = noteRun(ran, { mode, lt });
		if (next === ran) return;
		ran = next;
		first = noteFirst(first, ran);
		second = noteSecond(second, ran);
	}

	/** A new setting, or Clear: the count starts again, and the trains are filled afresh from the source. */
	function restart() {
		tally = emptyTally();
		owed = 0;
		train = fillTrain(head, mode, nbar, random);
		refresh();
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	/** The settings each source has been run at long enough. */
	let ran = NOTHING_RAN;
	const revealed = $derived(step === 1 ? first : second);

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let checked = false;

	function toggle() {
		playing = !playing;
		if (!playing) refresh();
	}

	/**
	 * While running, counts COUNT_RATE windows a second and scrolls the trains by SHOW_RATE; under reduced motion it
	 * opens paused, and Run sets it going.
	 */
	const clock: Attachment = () => {
		// read first, so that pressing Run or Pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		let since = 0;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			const due = windowsDue(owed, dt);
			owed = due.owed;
			runWindows(tally, mode, nbar, due.count, random);
			const next = head + SHOW_RATE * dt;
			if (Math.floor(next) !== Math.floor(head))
				train = scrollTrain(train, next, mode, nbar, random);
			head = next;
			since += dt;
			if (since >= 0.25) {
				since = 0;
				refresh();
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the trains -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel, in the histogram. */
	let uH = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	/** A click's height above its train's line. */
	const CLICK = 24;

	interface Label {
		x: number;
		y: number;
		text: string;
	}
	interface Row {
		y: number;
		labels: Label[];
	}

	const trainLayout = $derived.by(() => {
		if (phone.current) {
			const rows: Row[] = two
				? [
						{ y: 70, labels: [{ x: 0, y: 36, text: 'pair source, detector 1' }] },
						{ y: 122, labels: [{ x: 0, y: 140, text: 'detector 2' }] }
					]
				: [{ y: 96, labels: [{ x: 0, y: 58, text: MODE_NAMES[mode] }] }];
			return { W: 400, H: 176, X0: 0, X1: 400, rows, windows: PHONE_WINDOWS, caption: 164 };
		}
		const rows: Row[] = two
			? [
					{
						y: 70,
						labels: [
							{ x: 0, y: 58, text: 'pair source,' },
							{ x: 0, y: 72, text: 'detector 1' }
						]
					},
					{ y: 124, labels: [{ x: 0, y: 126, text: 'detector 2' }] }
				]
			: [{ y: 98, labels: [{ x: 0, y: 100, text: MODE_NAMES[mode] }] }];
		return { W: 680, H: 156, X0: 124, X1: 680, rows, windows: TRAIN_WINDOWS, caption: 150 };
	});
	const windowW = $derived((trainLayout.X1 - trainLayout.X0) / trainLayout.windows);

	/** Each window's grey tick and clicks, in the moving frame's own units: x = (window + time within it)·width. */
	const drawnWindows = $derived(
		train.map((w) => {
			const x0 = w.id * windowW;
			const xs = w.times.map((f) => x0 + f * windowW);
			const rows = trainLayout.rows;
			return {
				id: w.id,
				ticks: rows.map((r) => `M${f2(x0)},${r.y}V${r.y + 6}`).join(''),
				clicks: rows.map((r) => xs.map((x) => `M${f2(x)},${r.y - CLICK}V${r.y}`).join('')).join(''),
				links:
					rows.length === 2
						? xs.map((x) => `M${f2(x)},${rows[0].y + 1}V${rows[1].y - CLICK - 1}`).join('')
						: ''
			};
		})
	);
	const shift = $derived(trainLayout.X1 - head * windowW);
	/** The clicks now in view, for the description. */
	const inView = $derived(
		train.reduce(
			(s, w) =>
				s +
				w.times.filter((f) => w.id + f <= head && w.id + f >= head - trainLayout.windows).length,
			0
		)
	);

	// --- the histogram ----------------------------------------------------------------------------------------------
	/** The plot; the strip to its right holds the laws' names where their curves reach the last count. */
	const HP = { x0: 50, x1: 276, y0: 34, y1: 206 };
	const DECADES = -Math.log10(FLOOR);
	const hy = (p: number) => HP.y0 + (-Math.log10(p) / DECADES) * (HP.y1 - HP.y0);
	const top = $derived(countRange(mode, nbar));
	const bw = $derived((HP.x1 - HP.x0) / (top + 1));
	const hx = (n: number) => HP.x0 + (n + 0.5) * bw;
	const nTicks = $derived.by(() => {
		const every = top <= 10 ? 1 : top <= 20 ? 2 : 5;
		return Array.from({ length: Math.floor(top / every) + 1 }, (_, k) => k * every);
	});
	const decadeTicks = Array.from({ length: DECADES + 1 }, (_, k) => k);

	const laws = $derived.by(() => {
		const make = (law: typeof poissonLaw, name: string) => {
			const pts = lawPoints(law, nbar, top).map((q) => ({ x: hx(q.n), y: hy(q.p) }));
			return {
				name,
				pts,
				path: pts.map((q, i) => `${i ? 'L' : 'M'}${f2(q.x)},${f2(q.y)}`).join('')
			};
		};
		const poisson = make(poissonLaw, 'Poisson');
		const geometric = make(geometricLaw, 'geometric');
		// the words beside each curve's last point, to its right, or above it at the right edge; kept apart
		const place = (c: typeof poisson) => {
			const q = c.pts[c.pts.length - 1];
			return { x: q.x + 6, y: q.y + 4, anchor: 'start' };
		};
		const a = place(poisson);
		const b = place(geometric);
		const gap = 12 * uH;
		if (Math.abs(a.y - b.y) < gap && Math.abs(a.x - b.x) < 70 * uH) {
			// the geometric law lies above the Poisson law in its tail
			const mid = (a.y + b.y) / 2;
			b.y = Math.min(b.y, mid - gap / 2);
			a.y = Math.max(a.y, mid + gap / 2);
		}
		return [
			{ ...poisson, label: a, dashed: false },
			{ ...geometric, label: b, dashed: true }
		];
	});
	const bars = $derived(
		shown.hist.p.map((p, n) => ({ n, p })).filter((b) => b.p >= FLOOR && b.n <= top)
	);

	// --- the words --------------------------------------------------------------------------------------------------
	const r = $derived(shown.r);
	const lower = $derived(lowerBound(r));
	const cross = $derived(crossBound(r));

	const est = (e: Estimate | undefined, waiting: string) => (e ? withError(e) : waiting);
	const clicksWaiting = `waiting for ${MIN_CLICKS} clicks`;
	const pairsWaiting = (have: number) =>
		`waiting for ${MIN_PAIRS} pairs of clicks in one window (${countWords(have)} so far)`;
	const both = (a: Estimate | undefined, b: Estimate | undefined) => {
		if (!a || !b) return clicksWaiting;
		const s1 = withError(a);
		const s2 = withError(b);
		return s1 === s2 ? `${s1} at both` : `${s1} and ${s2}`;
	};

	function verdictWords(v: Verdict, waiting: string): string {
		if (v.status === 'waiting') return waiting;
		if (v.status === 'broken') return `broken ${errorsWords(v.errors)}`;
		return 'holds';
	}
	const lowerWords = $derived(
		verdictWords(lower, r.windows ? 'waiting for pairs of clicks' : 'not yet measured')
	);
	const crossWords = $derived(
		two
			? verdictWords(cross, r.windows ? 'waiting for pairs of clicks' : 'not yet measured')
			: 'needs two detectors: the pair source'
	);

	const modeWords = $derived(
		mode === 'coherent'
			? 'the steady (coherent) source'
			: mode === 'thermal'
				? 'the thermal source'
				: 'the pair source, at two detectors'
	);
	const trainsDescription = $derived(
		`Click trains from ${modeWords}, n̄ = ${nbarWords(nbar)} per window: ${trainLayout.windows} windows marked by ` +
			`faint grey ticks along a time axis, with ${inView} clicks in view as thin ticks` +
			(two
				? ` on each train; every click of detector 1 has its partner directly below it in detector 2`
				: '') +
			`. ${playing ? 'The trains scroll to the left as clicks arrive at the right edge.' : 'Paused.'}`
	);
	const histDescription = $derived.by(() => {
		const p = shown.hist.p;
		const lead =
			`Histogram of the fraction of windows with n clicks, n from 0 to ${top}, on a logarithmic axis from 1 down ` +
			`to one in a million, with the Poisson law and the geometric law at n̄ = ${nbarWords(nbar)} drawn over it.`;
		if (!r.windows) return `${lead} No windows counted yet.`;
		const few = p
			.slice(0, 4)
			.map((v, n) => `n = ${n}: ${v.toPrecision(2)}`)
			.join(', ');
		return `${lead} Measured after ${countWords(r.windows)} windows: ${few}.`;
	});
	const summary = $derived(
		`${MODE_NAMES[mode]}, n̄ = ${nbarWords(nbar)}. ${playing ? 'Counting.' : 'Paused.'} ` +
			`Bound g2 ≥ 1: ${lowerWords}.` +
			(two ? ` Bound g2 12 ≤ √(g2 11 · g2 22): ${crossWords}.` : '')
	);
</script>

<div class="click-trains">
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
				At the same mean rate, which train has more close pairs of clicks?
			{:else}
				Switch to the pair source and lower <Tex math="\bar n" />. What happens to <Tex
					math={'g^{(2)}_{12}'}
				/>?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>The thermal one.</strong> Its <Tex math={'g^{(2)}'} /> is 2, so two or more clicks in
				one window come about twice as often as from the steady source at small <Tex
					math="\bar n"
				/>: at
				<Tex math="\bar n = 0.1" />, in 0.83% of windows against 0.47%. The thermal source’s
				intensity wanders from window to window, and its clicks crowd into the bright windows; the
				steady source’s fall independently, with <Tex math={'g^{(2)} = 1'} />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong
					>It grows as <Tex math="2 + 1/\bar n" />, to about 12 at <Tex math="\bar n = 0.1" />,
					while each detector’s own <Tex math={'g^{(2)}'} /> stays at 2.</strong
				>
				So the classical bound <Tex math={'\\sqrt{g^{(2)}_{11}g^{(2)}_{22}} = 2'} /> is broken further
				the fainter the source. The two detectors always count the same, so at small <Tex
					math="\bar n"
				/>
				nearly every click of one has its partner in the other, while two classical beams with the same
				bunching could at most double the chance of a coincidence.
			{:else if step === 1}
				The answer appears once you have run the steady and the thermal sources at the same <Tex
					math="\bar n"
				/>.
			{:else}
				The answer appears once you have run the pair source at two values of <Tex math="\bar n" />,
				the lower at most 0.3 and at most a third of the other, each long enough to measure <Tex
					math={'g^{(2)}_{12}'}
				/>.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			class="trains"
			viewBox="0 0 {trainLayout.W} {trainLayout.H}"
			role="img"
			aria-label={trainsDescription}
			{@attach fitText()}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-clip">
					<rect
						x={trainLayout.X0}
						y="0"
						width={trainLayout.X1 - trainLayout.X0}
						height={trainLayout.H}
					/>
				</clipPath>
			</defs>
			<text class="title" x="0" y="14"
				>Clicks in time, <tspan class="it">n̄</tspan> = {nbarWords(nbar)} per window</text
			>
			<text class="small dim end" x={trainLayout.X1} y="14">now</text>
			<line
				class="now"
				x1={trainLayout.X1}
				x2={trainLayout.X1}
				y1="20"
				y2={trainLayout.rows[trainLayout.rows.length - 1].y + 6}
			/>

			{#each trainLayout.rows as row, i (i)}
				<line class="line" x1={trainLayout.X0} x2={trainLayout.X1} y1={row.y} y2={row.y} />
				{#each row.labels as label, k (k)}
					<text class="small strong start" x={label.x} y={label.y}>{label.text}</text>
				{/each}
			{/each}

			<g clip-path="url(#{uid}-clip)">
				<g transform="translate({f2(shift)} 0)">
					{#each drawnWindows as w (w.id)}
						<path class="window" d={w.ticks} />
						{#if w.links}<path class="link" d={w.links} />{/if}
						<path class="click" d={w.clicks} />
					{/each}
				</g>
			</g>

			<text class="small dim start" x={trainLayout.X0} y={trainLayout.caption}
				>grey ticks: the windows, each one coherence time of one mode</text
			>
		</svg>

		<div class="lower">
			<svg
				class="histogram"
				viewBox="0 0 340 246"
				role="img"
				aria-label={histDescription}
				{@attach fitText((value) => (uH = value))}
			>
				<text class="title" x="0" y="14"
					>Windows with <tspan class="it">n</tspan> clicks{two ? ', at each detector' : ''}</text
				>
				<text class="small dim start" x="0" y="28">fraction of all windows, logarithmic</text>

				{#each decadeTicks as k (k)}
					<line class="grid" x1={HP.x0} x2={HP.x1} y1={f2(hy(10 ** -k))} y2={f2(hy(10 ** -k))} />
					{#if k % 2 === 0}
						<text class="small dim end" x={HP.x0 - 6} y={f2(hy(10 ** -k) + 4)}
							>{#if k === 0}1{:else}10<tspan class="sup" dy="-5">−{k}</tspan>{/if}</text
						>
					{/if}
				{/each}

				{#each bars as b (b.n)}
					<rect
						class="bar"
						x={f2(hx(b.n) - 0.36 * bw)}
						y={f2(hy(b.p))}
						width={f2(0.72 * bw)}
						height={f2(HP.y1 - hy(b.p))}
					/>
				{/each}

				{#each laws as law (law.name)}
					<path class={['law', { dashed: law.dashed }]} d={law.path} />
					{#each law.pts as q, i (i)}
						<circle
							class={['law-dot', { open: law.dashed }]}
							cx={f2(q.x)}
							cy={f2(q.y)}
							r={f2((top > 20 ? 1.4 : 2) * uH)}
						/>
					{/each}
					<text class="small strong halo {law.label.anchor}" x={f2(law.label.x)} y={f2(law.label.y)}
						>{law.name}</text
					>
				{/each}

				<line class="axis" x1={HP.x0} x2={HP.x1} y1={HP.y1} y2={HP.y1} />
				<line class="axis" x1={HP.x0} x2={HP.x0} y1={HP.y0} y2={HP.y1} />
				{#each nTicks as n (n)}
					<line class="tick" x1={f2(hx(n))} x2={f2(hx(n))} y1={HP.y1} y2={HP.y1 + 4} />
					<text class="small dim mid" x={f2(hx(n))} y={HP.y1 + 16}>{n}</text>
				{/each}
				<text class="small dim end" x={HP.x1} y={HP.y1 + 32}
					>clicks in a window, <tspan class="it">n</tspan></text
				>
				{#if !r.windows}
					<text class="small dim mid" x={(HP.x0 + HP.x1) / 2} y={(HP.y0 + HP.y1) / 2 + 40}
						>{playing ? 'counting…' : 'press Run to count windows'}</text
					>
				{:else if shown.hist.above >= FLOOR}
					<text class="small dim end" x={HP.x1} y={HP.y0 - 4}
						><tspan class="it">n</tspan> &gt; {top}: {(100 * shown.hist.above).toPrecision(
							2
						)}%</text
					>
				{/if}
			</svg>

			<div class="readouts">
				<p class="sr-only" aria-live="polite">{summary}</p>
				<dl>
					<div class="row">
						<dt>Counted</dt>
						<dd>
							<span class="value">{countWords(r.windows)}</span>
							{r.windows === 1 ? 'window' : 'windows'},
							<span class="value">{countWords(r.clicks)}</span>
							{r.clicks === 1 ? 'click' : 'clicks'}{two ? ' at each detector' : ''}
						</dd>
					</div>
					<div class="row">
						<dt>
							{#if two}<Tex math="\bar n_1,\ \bar n_2" />{:else}<Tex math="\bar n" />{/if}
						</dt>
						<dd>{two ? both(r.mean, r.mean2) : est(r.mean, clicksWaiting)}</dd>
					</div>
					<div class="row">
						<dt>Variance</dt>
						<dd>{two ? both(r.variance, r.variance2) : est(r.variance, clicksWaiting)}</dd>
					</div>
					{#if two}
						<div class="row">
							<dt><Tex math={'g^{(2)}_{11},\\ g^{(2)}_{22}'} /></dt>
							<dd>{r.g && r.g22 ? both(r.g, r.g22) : pairsWaiting(r.pairs)}</dd>
						</div>
						<div class="row">
							<dt><Tex math={'g^{(2)}_{12}'} /></dt>
							<dd>
								{r.g12
									? withError(r.g12)
									: `waiting for ${MIN_PAIRS} coincidences (${countWords(r.coincidences)} so far)`}
							</dd>
						</div>
					{:else}
						<div class="row">
							<dt><Tex math={'g^{(2)}'} /></dt>
							<dd>{est(r.g, pairsWaiting(r.pairs))}</dd>
						</div>
					{/if}
				</dl>

				<div class="bounds">
					<p class="bounds-title">The classical bounds</p>
					<p class={['bound', { broken: lower.status === 'broken' }]}>
						<span class="law-text"><Tex math={'g^{(2)} \\ge 1'} /></span>
						<span class="verdict">{lowerWords}</span>
					</p>
					<p class={['bound', { broken: two && cross.status === 'broken', inactive: !two }]}>
						<span class="law-text"
							><Tex math={'g^{(2)}_{12} \\le \\sqrt{g^{(2)}_{11}g^{(2)}_{22}}'} /></span
						>
						<span class="verdict">{crossWords}</span>
					</p>
					{#if two && r.excess && cross.status !== 'waiting'}
						<p class="excess">
							<Tex math={'g^{(2)}_{12} - \\sqrt{g^{(2)}_{11}g^{(2)}_{22}}'} />
							= <span class="nowrap">{withError(r.excess)}</span>
						</p>
					{/if}
				</div>
			</div>
		</div>

		<ul class="legend" aria-hidden="true">
			<li><span class="click-key"></span>a click</li>
			<li><span class="bar-key"></span>windows counted</li>
			<li><span class="poisson-key"></span>Poisson law at the same <Tex math="\bar n" /></li>
			<li><span class="geometric-key"></span>geometric (thermal) law</li>
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div class="slot" onkeydowncapture={modeKeys} role="presentation">
				<Segmented
					label="Source"
					options={[
						{ value: 'coherent', label: 'Coherent', icon: WaveIcon },
						{ value: 'thermal', label: 'Thermal', icon: FireIcon },
						{ value: 'pair', label: 'Pair', icon: Link02Icon }
					]}
					bind:value={() => mode, setMode}
				/>
			</div>
			<div class="slot" onkeydowncapture={sliderKeys(() => lt, setLt, NBAR)} role="presentation">
				<Slider
					id="{uid}-nbar"
					label="n̄ per window"
					icon={Layers01Icon}
					min={NBAR.min}
					max={NBAR.max}
					step={NBAR.step}
					bind:value={() => lt, setLt}
					readout="n̄ = {nbarWords(nbar)}"
					marks={[
						{ at: -2, label: '0.01' },
						{ at: -1, label: '0.1' },
						{ at: 0, label: '1, as the figure opens' },
						{ at: 1, label: '10' }
					]}
					marksHint="logarithmic, from 0.01 to 10; the ticks mark 0.01, 0.1, 1 and 10"
				/>
			</div>
		</div>

		<div class="controls">
			<button type="button" class="action" aria-pressed={playing} onclick={toggle}>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.7} />
					Pause
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
					Run
				{/if}
			</button>
			<button type="button" class="action" onclick={restart}>
				<HugeiconsIcon icon={EraserIcon} size={16} strokeWidth={1.7} />
				Clear
			</button>
			<p class="hint">
				Reach the switch, the slider and the buttons with Tab. On the switch the arrow keys choose
				the source; on the slider they step <Tex math="\bar n" /> by a twentieth of a decade, Shift by
				a quarter, and Home and End go to the ends. Space runs or pauses the count.
			</p>
		</div>
	</div>

	<p class="note">
		One mode per window throughout: each window is one coherence time of one mode, and its count is
		drawn afresh, from a Poisson law of mean <Tex math="\bar n" /> for the steady source, from a Poisson
		law whose mean is itself drawn from an exponential law of mean <Tex math="\bar n" /> for the thermal
		source, and from the geometric law <Tex math={'\\bar n^n/(1 + \\bar n)^{n+1}'} />, given to both
		detectors, for the pair. Every count is ideal. The count runs at {countWords(COUNT_RATE)} windows
		a second; the trains show windows of the same source at {SHOW_RATE} a second, with the clicks spread
		at random within each. Each error is one standard error, from the scatter of the windows; a bound
		is struck through once the measurement passes it by more than three errors. Changing the source or
		<Tex math="\bar n" /> starts the count again.
	</p>
</div>

<style>
	.click-trains {
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
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.trains {
		max-width: 680px;
		margin: 0 auto;
	}

	.lower {
		display: grid;
		grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
		gap: 0.6rem 1.2rem;
		max-width: 680px;
		margin: 0.9rem auto 0;
		align-items: start;
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

	tspan.sup {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the trains: thin ink clicks on a grey line, the windows' ticks faint grey */
	.line {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.now {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.window {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.click {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.link {
		stroke: color-mix(in srgb, var(--text) 16%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	/* the histogram: grey bars, the two laws as thin ink lines with dots */
	.grid {
		stroke: color-mix(in srgb, var(--text) 9%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.bar {
		fill: color-mix(in srgb, var(--text) 24%, transparent);
	}

	.law {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.law.dashed {
		stroke-dasharray: calc(4px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.law-dot {
		fill: var(--text);
	}

	.law-dot.open {
		fill: var(--bg-sunken);
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the readouts ------------------------------------------------------------------------ */

	.readouts {
		min-width: 0;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.35rem;
	}

	.row {
		display: grid;
		grid-template-columns: 6.2rem minmax(0, 1fr);
		gap: 0.1rem 0.7rem;
		align-items: baseline;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts dd {
		margin: 0;
		min-width: 0;
		font-variant-numeric: tabular-nums;
		text-wrap: pretty;
	}

	.value {
		font-weight: 600;
		color: var(--text);
	}

	.bounds {
		margin-top: 0.75rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--line);
	}

	.bounds p {
		margin: 0;
	}

	.bounds-title {
		font-weight: 500;
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
	}

	.bound {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.1rem 0.7rem;
		margin-bottom: 0.35rem !important;
	}

	.law-text {
		position: relative;
		display: inline-block;
		font-size: 1.05em;
	}

	.verdict {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* a broken bound turns grey and is struck through; KaTeX's boxes take no text decoration, so a rule is drawn */
	.bound.broken .law-text {
		color: var(--text-faint);
	}

	.bound.broken .law-text::after {
		content: '';
		position: absolute;
		left: -0.15em;
		right: -0.15em;
		top: 52%;
		border-top: 1.5px solid var(--text-faint);
	}

	.bound.broken .verdict {
		color: var(--text);
		font-weight: 600;
	}

	.excess {
		margin-top: -0.15rem !important;
		color: var(--text-dim);
	}

	.nowrap {
		white-space: nowrap;
	}

	.bound.inactive {
		opacity: 0.5;
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 680px;
		margin: 0.6rem auto 0;
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

	.click-key,
	.bar-key,
	.poisson-key,
	.geometric-key {
		flex: none;
		position: relative;
		width: 1.1rem;
		height: 0.7rem;
	}

	.click-key {
		width: 0.5rem;
		border-left: 1px solid var(--text);
		border-bottom: 1px solid color-mix(in srgb, var(--text) 40%, transparent);
	}

	.bar-key {
		width: 0.6rem;
		background: color-mix(in srgb, var(--text) 24%, transparent);
	}

	.poisson-key,
	.geometric-key {
		height: 0;
		border-top: 1px solid var(--text);
	}

	.geometric-key {
		border-top-style: dashed;
	}

	.poisson-key::after,
	.geometric-key::after {
		content: '';
		position: absolute;
		left: 50%;
		top: -0.2rem;
		width: 0.3rem;
		height: 0.3rem;
		margin-left: -0.2rem;
		margin-top: -0.5px;
		border-radius: 50%;
		background: var(--text);
		border: 1px solid var(--text);
	}

	.geometric-key::after {
		background: var(--bg-sunken);
	}

	/* --- the controls --------------------------------------------------------------------- */

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

		.lower {
			grid-template-columns: minmax(0, 1fr);
		}

		svg.histogram {
			max-width: 420px;
			margin: 0 auto;
		}

		.row {
			grid-template-columns: 5.4rem minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
