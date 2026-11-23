<script lang="ts">
	/**
	 * Chapter 3.3's locked safe as a test. (a) The room as the camera sees it, to scale: the array, and the two safes
	 * 1.1 m to either side; after a trial, the gold in the safe it was put in and the safe the camera chose. Beside
	 * it, the running count of trials and wrong answers at the current signal-to-noise ratio, against the predicted
	 * P_err = P(Z > D/2). (b) The two bells of the chapter's hero at the current D: the densities of the statistic
	 * t/σ_n with the gold in the left safe (A) and in the right (B), the decision line t = 0, the wrong answers shaded
	 * beyond it, the trials so far as a histogram, and the last trial's t. The numbers come from ./which-safe.ts. Two
	 * predictions at the top are answered once the reader has done what they ask. Nothing moves by itself, so reduced
	 * motion changes nothing: a batch of trials replaces the count at once.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		FastForwardIcon,
		FullSignalIcon,
		PlayIcon,
		RefreshIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript, texNumber } from '../../ui/format';
	import {
		BIN,
		LEAST,
		MOST,
		READINGS,
		SEPARATION_PER_SNR,
		bell,
		emptyTally,
		errorProbability,
		expectedWrong,
		largestDifference,
		noise,
		reach,
		run,
		separation,
		snap,
		snrForError,
		source,
		stepRung,
		type Hypothesis,
		type Source,
		type Tally
	} from './which-safe';

	const uid = $props.id();

	// --- the choice: the signal-to-noise ratio, and the trials run at it -------------------------------------------
	let snr = $state(3);
	const d = $derived(separation(snr));
	const p = $derived(errorProbability(d));
	let tally = $state.raw<Tally>(emptyTally(separation(3)));

	/** The session's stream of coins and noises, seeded afresh on the first trial of each visit. */
	let random: Source | undefined;
	function stream(): Source {
		if (!random) {
			const seed = crypto.getRandomValues(new Uint32Array(1))[0];
			random = source(seed);
		}
		return random;
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The most trials run at a ratio of 10. */
	let atTen = $state(0);
	/** Whether the reader has stood at a ratio whose predicted error is within a little of one in a thousand. */
	let nearThousand = $state(false);
	const revealed = $derived(step === 1 ? atTen >= 1000 : nearThousand);

	function setSnr(v: number) {
		const s = snap(v);
		if (s === snr) return;
		snr = s;
		tally = emptyTally(separation(s));
		const e = errorProbability(separation(s));
		if (e > 1e-3 / 1.4 && e < 1.4e-3) nearThousand = true;
	}

	function trials(count: number) {
		tally = run(tally, count, stream());
		if (snr === 10) atTen = Math.max(atTen, tally.trials);
	}

	function again() {
		tally = emptyTally(d);
	}

	/** The arrow keys step one ratio of two figures at a time; the page keys ten. */
	function keys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const by: Record<string, number> = {
			ArrowRight: 1,
			ArrowUp: 1,
			ArrowLeft: -1,
			ArrowDown: -1,
			PageUp: 10,
			PageDown: -10
		};
		if (e.key in by) {
			e.preventDefault();
			setSnr(stepRung(snr, by[e.key]));
		} else if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			setSnr(e.key === 'Home' ? LEAST : MOST);
		}
	}

	// --- the drawing's bounds: on a phone the panels are narrower -----------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const size = $derived(phone.current ? { w: 332, h: 232 } : { w: 672, h: 244 });
	const f1 = (x: number) => x.toFixed(1);

	// --- panel (a): the room, to scale, 64 drawing units to the metre ---------------------------------------------------
	const ROOM = { w: 280, h: 186 };
	const METRE = 64;
	const MIDDLE = ROOM.w / 2;
	const FLOOR = 150;
	const rx = (x: number) => MIDDLE + x * METRE;
	const ry = (y: number) => FLOOR - y * METRE;
	/** The safes: 0.9 m wide and 0.8 m high about the gold, which lies 1.1 m to either side of the array's axis. */
	const SAFES = [
		{ h: 'A' as Hypothesis, x: -1.1, name: 'left safe' },
		{ h: 'B' as Hypothesis, x: 1.1, name: 'right safe' }
	];
	/** The array's 11 × 11 pixels, 10 cm apart, about the camera 1.5 m above the floor. */
	const PIXELS = Array.from({ length: 121 }, (_, k) => ({
		x: rx(-0.5 + 0.1 * Math.floor(k / 11)),
		y: ry(1.5 - 0.5 + 0.1 * (k % 11))
	}));

	// --- panel (b): the two bells -------------------------------------------------------------------------------------
	const half = $derived(reach(d));
	const P_TOP = 0.44;
	const b = $derived({ L: 10, R: size.w - 10, T: 30, B: size.h - 24 });
	const bx = (t: number) => b.L + ((t + half) / (2 * half)) * (b.R - b.L);
	const by = (density: number) => b.B - (density / P_TOP) * (b.B - b.T);

	/** A bell centred on `centre`, from `from` to `to`, as a polyline fine enough to look smooth. */
	function curve(centre: number, from: number, to: number) {
		const n = Math.max(2, Math.ceil(((to - from) / (2 * half)) * 360));
		let path = '';
		for (let k = 0; k <= n; k++) {
			const t = from + ((to - from) * k) / n;
			path += `${k ? 'L' : 'M'}${f1(bx(t))},${f1(by(bell(t - centre)))}`;
		}
		return path;
	}
	const bellA = $derived(curve(d / 2, -half, half));
	const bellB = $derived(curve(-d / 2, -half, half));
	/** The wrong answers: A's tail below the decision line, B's above it. */
	const tailA = $derived(
		`${curve(d / 2, -half, 0)}L${f1(bx(0))},${f1(b.B)}L${f1(bx(-half))},${f1(b.B)}Z`
	);
	const tailB = $derived(
		`${curve(-d / 2, 0, half)}L${f1(bx(half))},${f1(b.B)}L${f1(bx(0))},${f1(b.B)}Z`
	);

	/** The trials so far, as a histogram of each hypothesis's own trials, from 1,000 trials on. */
	const SHOW_FROM = 1000;
	function steps(bins: Uint32Array, count: number) {
		if (count === 0) return '';
		let path = `M${f1(bx(-half))},${f1(b.B)}`;
		for (let k = 0; k < bins.length; k++) {
			const density = bins[k] / (count * BIN);
			path += `V${f1(by(density))}H${f1(bx(-half + (k + 1) * BIN))}`;
		}
		return path + `V${f1(b.B)}`;
	}
	const histA = $derived(tally.trials >= SHOW_FROM ? steps(tally.binsA, tally.trialsA) : '');
	const histB = $derived(tally.trials >= SHOW_FROM ? steps(tally.binsB, tally.trialsB) : '');

	const ticks = $derived.by(() => {
		const every = half <= 5 ? 1 : half <= 9 ? 2 : 4;
		const spacing = phone.current && every === 1 && half > 4.5 ? 2 : every;
		const out: number[] = [];
		for (let t = -Math.floor(half / spacing) * spacing; t <= half; t += spacing) out.push(t);
		return out;
	});
	const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

	/** The letters over the peaks, kept apart when the peaks nearly meet. */
	const peakA = $derived(Math.max(bx(d / 2), bx(0) + 9));
	const peakB = $derived(Math.min(bx(-d / 2), bx(0) - 9));
	const peakY = $derived(by(bell(0)) - 9);

	const last = $derived(tally.last);
	const lastX = $derived(last ? bx(Math.max(-half, Math.min(half, last.t))) : 0);
	const lastY = $derived(last ? by(bell(last.t - (last.truth === 'A' ? d / 2 : -d / 2))) : 0);
	const lastWrong = $derived(!!last && last.pick !== last.truth);
	const lastAnchor = $derived(
		lastX < b.L + 70 ? 'start' : lastX > b.R - 70 ? 'end' : ('middle' as const)
	);

	// --- the numbers ----------------------------------------------------------------------------------------------------
	const count = (n: number) => n.toLocaleString('en-US');
	const snrText = (s: number) => (s < 10 ? s.toFixed(1) : String(s));
	const dText = (x: number) => (x < 10 ? x.toFixed(2) : x.toFixed(1));
	const tText = (t: number) => (t < 0 ? `-${Math.abs(t).toFixed(2)}` : t.toFixed(2));
	const safeName = (h: Hypothesis) => (h === 'A' ? 'the left safe' : 'the right safe');

	/** A probability for a screen reader: "0.183", "0.00104", "6.78 times ten to the power −20". */
	function spoken(x: number) {
		if (x >= 1e-6) return x.toPrecision(3);
		const e = Math.floor(Math.log10(x));
		return `${(x / 10 ** e).toFixed(2)} times ten to the power ${e}`;
	}

	/** The plain-text twin of texNumber, for the count: "0.183", "1.04 × 10⁻³". */
	function plain(x: number, figures = 3) {
		if (x === 0) return '0';
		if (x >= 0.01) return x.toPrecision(figures);
		const e = Math.floor(Math.log10(x));
		return `${(x / 10 ** e).toFixed(figures - 1)} × 10${superscript(e)}`;
	}

	/** A small number with its mantissa always shown, as LaTeX: "3.5 \\times 10^{-9}", "1.0 \\times 10^{-9}". */
	function texPower(x: number) {
		let e = Math.floor(Math.log10(x));
		let m = (x / 10 ** e).toFixed(1);
		if (Number(m) >= 10) {
			e += 1;
			m = '1.0';
		}
		return `${m} \\times 10^{${e}}`;
	}

	const fraction = $derived(tally.trials ? tally.wrong / tally.trials : 0);
	const expected = $derived(expectedWrong(tally.trials, p));
	const threshold = snrForError(1e-3);

	const labelRoom = $derived(
		last
			? `The room as the camera sees it: the array in the middle and a safe 1.1 metres to either side. In the last trial the gold was in ${safeName(last.truth)} and the camera chose ${safeName(last.pick)}, ${lastWrong ? 'a wrong answer' : 'the correct answer'}.`
			: 'The room as the camera sees it: the array in the middle and a safe 1.1 metres to either side. No trial has been run yet.'
	);
	const labelBells = $derived(
		`Two bells of unit width, the statistic t over sigma n with the gold in the left safe, centred at ${dText(d / 2)}, and in the right safe, centred at minus ${dText(d / 2)}; the decision line at zero, and the tail of each bell beyond it shaded, of area ${spoken(p)}` +
			(last ? `; the last trial gave t over sigma n = ${tText(last.t)}` : '')
	);
</script>

<div class="which-safe">
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
				At a signal-to-noise ratio of 10, how often will the camera pick the wrong safe?
			{:else}
				Find the signal-to-noise ratio at which the camera picks the wrong safe once in a thousand
				choices.
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>About 18% of the time.</strong> At <Tex math={'\\mathrm{SNR} = 10'} /> the 605 predicted
				readings of the two safes lie <Tex math="D = 1.81" /> noise standard deviations apart, so <Tex
					math={'P_{\\rm err} = P(Z > 0.905) = 0.183'}
				/>: almost one choice in five is wrong, though no single reading differs by more than a
				fifth of <Tex math="\sigma_n" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>About 34.</strong> One error in a thousand needs <Tex
					math={'P(Z > D/2) = 10^{-3}'}
				/>, so <Tex math="D/2 = 3.09" /> and <Tex math="D = 6.18" />; with
				<Tex math={'D = 0.181\\,\\mathrm{SNR}'} /> that is <Tex
					math={`\\mathrm{SNR} = ${threshold.toFixed(1)}`}
				/>. At 34, <Tex math="D = 6.16" /> and <Tex math={'P_{\\rm err} = 1.04\\times10^{-3}'} />,
				so 10,000 trials give about ten wrong answers. A ratio 3.4 times larger than 10 makes the
				errors about 180 times rarer, because the tail of the Gaussian falls so fast.
			{:else if step === 1}
				The answer appears when you have run a thousand trials or more at a ratio of 10, the middle
				tick of the slider.
			{:else}
				The answer appears when you have moved the slider to the ratio at which the predicted error,
				in the count, is close to one in a thousand.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="top">
			<div class="panel">
				<p class="title">
					<span class="letter">(a)</span> The last trial, in the room as the camera sees it
				</p>
				<svg
					class="room"
					viewBox="0 0 {ROOM.w} {ROOM.h}"
					role="img"
					aria-label={labelRoom}
					{@attach fitText()}
				>
					<line class="floor" x1="8" y1={FLOOR} x2={ROOM.w - 8} y2={FLOOR} />

					<!-- the array, a metre across, 3.5 m in front of the safes -->
					<rect
						class="array"
						x={rx(-0.55)}
						y={ry(2.05)}
						width={1.1 * METRE}
						height={1.1 * METRE}
						rx="3"
					/>
					{#each PIXELS as px, k (k)}
						<circle class="pixel" cx={f1(px.x)} cy={f1(px.y)} r="0.9" />
					{/each}
					<text class="label" x={rx(0)} y={ry(2.05) - 5} text-anchor="middle"
						>the array, 3.5 m in front</text
					>

					{#each SAFES as safe (safe.h)}
						{@const chosen = last?.pick === safe.h}
						<g class={['safe', safe.h === 'A' ? 'a' : 'b', { chosen }]}>
							<rect
								class="body"
								x={rx(safe.x - 0.45)}
								y={ry(0.8)}
								width={0.9 * METRE}
								height={0.8 * METRE}
								rx="3"
							/>
							<rect
								class="door"
								x={rx(safe.x - 0.45) + 4}
								y={ry(0.8) + 4}
								width={0.9 * METRE - 8}
								height={0.8 * METRE - 8}
								rx="2"
							/>
							{#if last?.truth === safe.h}
								<rect
									class="gold"
									x={rx(safe.x - 0.15)}
									y={ry(0.2)}
									width={0.3 * METRE}
									height={0.14 * METRE}
									rx="1"
								/>
							{/if}
						</g>
						<text class="label" x={rx(safe.x)} y={FLOOR + 15} text-anchor="middle"
							>{safe.name}, <tspan class="italic">{safe.h}</tspan></text
						>
						{#if chosen}
							<text
								class={['verdict', lastWrong ? 'wrong' : 'correct']}
								x={rx(safe.x)}
								y={FLOOR + 29}
								text-anchor="middle">chosen, {lastWrong ? 'wrong' : 'correct'}</text
							>
						{/if}
					{/each}
				</svg>
				<p class="legend">
					<span><i class="key gold"></i>the gold, 324 kg</span>
				</p>
			</div>

			<div class="count" aria-live="polite">
				<p class="title">The count at <Tex math={`\\mathrm{SNR} = ${snrText(snr)}`} /></p>
				<dl class="score">
					<div>
						<dt>Trials</dt>
						<dd>{count(tally.trials)}</dd>
					</div>
					<div>
						<dt>Wrong answers</dt>
						<dd class="bad">{count(tally.wrong)}</dd>
					</div>
					<div>
						<dt>Fraction wrong</dt>
						<dd>
							{tally.trials ? plain(fraction) : '–'}
						</dd>
					</div>
					<div>
						<dt>Predicted, <Tex math={'P_{\\rm err}'} /></dt>
						<dd class="predicted">{plain(p)}</dd>
					</div>
				</dl>
				<p class="expect">
					{#if tally.trials === 0}
						No trials yet at this ratio. Run one, or a batch; the count starts again when the ratio
						changes.
					{:else if expected.mean >= 0.5}
						{count(tally.trials)}
						{tally.trials === 1 ? 'trial' : 'trials'} should give about {count(
							Math.round(expected.mean)
						)} wrong {Math.round(expected.mean) === 1 ? 'answer' : 'answers'}, give or take {count(
							Math.max(1, Math.round(expected.spread))
						)}.
					{:else}
						{count(tally.trials)}
						{tally.trials === 1 ? 'trial' : 'trials'} should most often give no wrong answer at all: the
						expected number is {plain(expected.mean, 2)}.
					{/if}
				</p>
			</div>
		</div>

		<div class="panel">
			<p class="title">
				<span class="letter">(b)</span> The statistic <Tex math="t/\sigma_n" /> under each hypothesis,
				at <Tex math={`D = ${dText(d)}`} />
			</p>
			<svg viewBox="0 0 {size.w} {size.h}" role="img" aria-label={labelBells} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-b">
						<rect x={b.L} y={b.T - 6} width={b.R - b.L} height={b.B - b.T + 6} />
					</clipPath>
				</defs>

				<g clip-path="url(#{uid}-b)">
					<path class="tail a" d={tailA} />
					<path class="tail b" d={tailB} />
					{#if histA}<path class="hist a" d={histA} />{/if}
					{#if histB}<path class="hist b" d={histB} />{/if}
					<path class="bell b" d={bellB} />
					<path class="bell a" d={bellA} />
				</g>

				<!-- the axis, and the decision line -->
				<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
				{#each ticks as t (t)}
					<line class="tick" x1={bx(t)} y1={b.B} x2={bx(t)} y2={b.B + 4} />
					<text class="num" x={bx(t)} y={b.B + 16} text-anchor="middle">{minus(t)}</text>
				{/each}
				<line class="decision" x1={bx(0)} y1={b.T - 4} x2={bx(0)} y2={b.B} />

				<text class="peak a" x={peakA} y={peakY} text-anchor="middle">A</text>
				<text class="peak b" x={peakB} y={peakY} text-anchor="middle">B</text>

				<!-- the last trial -->
				{#if last}
					<line
						class={['marker', last.truth === 'A' ? 'a' : 'b']}
						x1={lastX}
						y1={b.B}
						x2={lastX}
						y2={b.T - 12}
					/>
					<circle
						class={['dot', last.truth === 'A' ? 'a' : 'b']}
						cx={lastX}
						cy={Math.max(b.T - 6, lastY)}
						r="3.2"
					/>
					<text class="label strong" x={lastX} y={b.T - 17} text-anchor={lastAnchor}
						>last trial, t/σ<tspan class="sub" dy="2.5">n</tspan><tspan dy="-2.5"
							>{` = ${tText(last.t).replace('-', '−')}`}</tspan
						>{#if lastWrong}<tspan class="wrong-text">, wrong</tspan>{/if}</text
					>
				{/if}
			</svg>
			<p class="legend">
				<span><i class="key a"></i><span><Tex math="A" />, the gold in the left safe</span></span>
				<span><i class="key b"></i><span><Tex math="B" />, the gold in the right safe</span></span>
				<span><i class="key decision"></i><span>the decision line, <Tex math="t = 0" /></span></span
				>
				<span
					><i class="key tail"></i><span
						>the wrong answers, of area <Tex math={'P_{\\rm err}'} /> on each side</span
					></span
				>
				<span
					><i class="key hist"></i><span>the trials so far, from {count(SHOW_FROM)} on</span></span
				>
			</p>
		</div>
	</div>

	<div class="bar">
		<!-- the arrow keys are caught on their way to the slider, so that each steps one ratio -->
		<div class="grow" onkeydowncapture={keys} role="presentation">
			<Slider
				id="{uid}-snr"
				label="Signal-to-noise ratio"
				icon={FullSignalIcon}
				min={0}
				max={2}
				step={0.001}
				bind:value={() => Math.log10(snr), (v) => setSnr(10 ** v)}
				readout="SNR = {snrText(snr)}"
				ends={['1', '100']}
				marks={[3, 10, 30].map((s) => ({ at: Math.log10(s), label: `SNR = ${s}` }))}
				marksHint="the ticks mark ratios of 3, 10 and 30"
			/>
		</div>
		<div class="runs" role="group" aria-label="Run trials">
			<span class="runs-label">Run</span>
			<button type="button" class="run" onclick={() => trials(1)}>
				<HugeiconsIcon icon={PlayIcon} size={15} strokeWidth={1.7} />
				1 trial
			</button>
			<button type="button" class="run" onclick={() => trials(100)}>
				<HugeiconsIcon icon={FastForwardIcon} size={15} strokeWidth={1.7} />
				100
			</button>
			<button type="button" class="run" onclick={() => trials(10_000)}>
				<HugeiconsIcon icon={FastForwardIcon} size={15} strokeWidth={1.7} />
				10,000
			</button>
			<button
				type="button"
				class="run again"
				onclick={again}
				disabled={tally.trials === 0}
				aria-label="Start the count again"
				title="Start the count again"
			>
				<HugeiconsIcon icon={RefreshIcon} size={15} strokeWidth={1.7} />
			</button>
		</div>
		<p class="hint">
			Drag the slider, or reach it with Tab and step one ratio at a time with the arrow keys. Each
			trial puts the gold in a safe at random and draws the noise afresh.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Signal-to-noise ratio</dt>
				<dd>
					<Tex math={`\\mathrm{SNR} = ${snrText(snr)}`} /><span class="also"
						>noise of one reading <Tex
							math={`\\sigma_n = ${texPower(noise(snr))}\\,\\mathrm{s^{-2}}`}
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Separation</dt>
				<dd>
					<span
						><Tex math="D = |\mathbf f_A - \mathbf f_B|/\sigma_n" />
						<Tex
							math={`= ${SEPARATION_PER_SNR.toFixed(3)}\\times${snrText(snr)} = ${dText(d)}`}
						/></span
					><span class="also"
						>over all {READINGS} readings; the largest difference in a single reading is {largestDifference(
							snr
						).toPrecision(2)}
						<Tex math="\sigma_n" /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Error probability</dt>
				<dd>
					<span
						><Tex math={'P_{\\rm err} = P(Z > D/2)'} />
						<Tex math={`= P(Z > ${dText(d / 2)}) = ${texNumber(p, 3)}`} /></span
					><span class="also">one choice in <Tex math={texNumber(1 / p, 2)} /> is wrong</span>
				</dd>
			</div>
			<div class="row">
				<dt>Last trial</dt>
				<dd>
					{#if last}
						<span
							>Trial {count(tally.trials)} put the gold in {safeName(last.truth)}
							<Tex math={`(${last.truth})`} />. The readings gave <Tex
								math={`t/\\sigma_n = ${tText(last.t)}`}
							/>, so the camera chose {safeName(last.pick)}
							<Tex math={`(${last.pick})`} />, {lastWrong
								? 'a wrong answer'
								: 'the correct answer'}.</span
						>
					{:else}
						<span class="also">None yet.</span>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			Each trial puts the gold in the left or the right safe with equal chances, adds to each of the
			605 predicted readings an independent Gaussian noise of standard deviation <Tex
				math="\sigma_n"
			/>, and picks the safe whose predicted readings lie closer. Only one number decides: <Tex
				math="t = \mathbf u\cdot\bigl(\mathbf y - \tfrac12(\mathbf f_A + \mathbf f_B)\bigr)"
			/>, the readings projected on the unit vector <Tex math="\mathbf u" /> along the difference of the
			predictions. In units of <Tex math="\sigma_n" /> it is <Tex math="D/2 + Z" /> when the gold is in
			the left safe and <Tex math="-D/2 + Z" /> when it is in the right, with <Tex math="Z" /> a standard
			Gaussian, and the camera picks <Tex math="A" /> when <Tex math="t > 0" />. So each trial draws <Tex
				math="t"
			/> directly. That is exact, and it lets 10,000 trials run at once.
		</p>
		<p class="note">
			In (b) the bells are the densities of <Tex math="t/\sigma_n" /> with the gold in each safe, of unit
			width and <Tex math="D" /> apart. The shaded tails beyond the decision line are the wrong answers,
			each of area <Tex math={'P_{\\rm err}'} />; the steps are the trials so far, those of each
			safe as a histogram of their own. The predicted readings are those of the paper’s Appendix A:
			a uniform bar of gold 0.3 × 0.14 × 0.4 m, 3.5 m in front of the array, 1.1 m to the left or
			the right of its axis and 1.37 m below it, read with <Tex
				math={'\\sigma_n = 2Gm/(z^2 b\\,\\mathrm{SNR})'}
			/>. The noise comes from a stream seeded afresh on each visit.
		</p>
	</div>
</div>

<style>
	.which-safe {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		--hyp-a: var(--accent);
		--hyp-b: var(--q-field);
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
	.run:focus-visible {
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

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.1rem;
		align-items: start;
	}

	.panel,
	.count {
		min-width: 0;
	}

	.panel p,
	.count p {
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

	/* the room */
	.floor {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.array {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pixel {
		fill: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.safe .body {
		fill: color-mix(in srgb, var(--hyp) 7%, transparent);
		stroke: var(--hyp);
		stroke-width: calc(1px * var(--u, 1));
	}

	.safe.chosen .body {
		fill: color-mix(in srgb, var(--hyp) 16%, transparent);
		stroke-width: calc(2px * var(--u, 1));
	}

	.safe .door {
		fill: none;
		stroke: color-mix(in srgb, var(--hyp) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.safe.a {
		--hyp: var(--hyp-a);
	}

	.safe.b {
		--hyp: var(--hyp-b);
	}

	.gold {
		fill: var(--q-matter);
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(0.6px * var(--u, 1));
	}

	.label,
	.verdict {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.label.strong {
		fill: var(--text);
	}

	.italic {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(12px * var(--u, 1));
	}

	.sub {
		font-size: calc(8px * var(--u, 1));
	}

	.verdict {
		font-weight: 600;
	}

	.verdict.correct {
		fill: var(--good);
	}

	.verdict.wrong,
	.wrong-text {
		fill: var(--bad);
		font-weight: 600;
	}

	/* the bells */
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

	.a {
		--hyp: var(--hyp-a);
	}

	.b {
		--hyp: var(--hyp-b);
	}

	.bell {
		fill: none;
		stroke: var(--hyp);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.tail {
		fill: color-mix(in srgb, var(--hyp) 24%, transparent);
		stroke: none;
	}

	.hist {
		fill: none;
		stroke: color-mix(in srgb, var(--hyp) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: miter;
	}

	.decision {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.peak {
		fill: var(--hyp);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(3px * var(--u, 1));
	}

	.marker {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.dot {
		fill: var(--hyp);
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

	.key.a {
		border-color: var(--hyp-a);
	}

	.key.b {
		border-color: var(--hyp-b);
	}

	.key.decision {
		border-top: 1.5px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.key.tail {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--hyp-b) 35%, transparent) 50%,
			color-mix(in srgb, var(--hyp-a) 35%, transparent) 50%
		);
	}

	.key.hist {
		height: 0.55rem;
		border: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
		border-bottom: 0;
		border-radius: 0;
	}

	.key.gold {
		width: 0.8rem;
		height: 0.45rem;
		border: 0;
		border-radius: 1px;
		background: var(--q-matter);
	}

	/* the count */
	.count {
		align-self: stretch;
		display: flex;
		flex-direction: column;
	}

	.score {
		margin: 0.15rem 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.55rem 0.9rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 9px;
		background: var(--well);
	}

	.score dt {
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.score dd {
		margin: 0.1rem 0 0;
		font: 500 1.15rem/1.25 var(--font-sans);
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.score dd.bad {
		color: var(--bad);
	}

	.score dd.predicted {
		color: var(--accent);
	}

	.expect {
		margin-top: 0.55rem !important;
		font-size: 0.76rem;
		line-height: 1.45;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.grow {
		min-width: 0;
	}

	.runs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.runs-label {
		font-size: 0.8rem;
		color: var(--text);
		margin-right: 0.15rem;
	}

	.run {
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
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.run :global(svg) {
		color: var(--accent);
	}

	.run.again {
		margin-left: auto;
		padding: 0.3rem 0.6rem;
	}

	.run.again :global(svg) {
		color: var(--text-dim);
	}

	.run:disabled {
		opacity: 0.45;
		cursor: default;
	}

	@media (hover: hover) {
		.run:not(:disabled):hover {
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
		.top {
			grid-template-columns: minmax(0, 1fr);
		}

		/* the room is kept to the size of a picture */
		svg.room {
			max-width: 17rem;
			margin: 0 auto;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.05rem;
		}

		.readouts dl {
			gap: 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.run {
			transition: none;
		}
	}
</style>
