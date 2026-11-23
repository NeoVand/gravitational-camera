<script lang="ts">
	/**
	 * Chapter 3.5's best guess of one number. One pattern of amount x is read as y = T x + n, with x of mean zero and
	 * standard deviation σ_x (the prior) and n of mean zero and standard deviation σ_n. (a) 500 simulated pairs, the
	 * true amount x across and the reading y up, each axis reaching 3.6 of its own standard deviations to each side;
	 * through them the naive guess y/T and the Wiener guess H y/T as lines, x̂ against y, so that the horizontal
	 * distance from a dot to a line is that guess's error; one pair is followed, with the two guesses of its reading.
	 * (b) The ratio s = Tσ_x/σ_n and the weight H = s²/(1 + s²), and the mean squared errors of guessing zero (the
	 * prior's variance), of the naive guess and of the Wiener guess, simulated over the 500 pairs beside their
	 * predictions. The numbers come from ./one-mode-wiener.ts. A prediction at the top is answered once the reader has
	 * set s = 1 again by moving the sliders. Nothing moves by itself, so reduced motion changes nothing: a new draw
	 * replaces the pairs at once.
	 */
	import { onMount } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowExpandIcon,
		AudioWaveformIcon,
		DiceIcon,
		VolumeHighIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import {
		LEAST,
		MOST,
		PAIRS,
		REACH,
		balanced,
		draw,
		example,
		pairs,
		predict,
		ratio,
		readingSpread,
		simulate,
		snap,
		stepRung,
		tickStep,
		weight
	} from './one-mode-wiener';

	const uid = $props.id();

	// --- the choices: the gain, the prior's spread, the noise, and the draw -------------------------------------------
	let gain = $state(1);
	let prior = $state(1);
	let noise = $state(1);
	const s = $derived(ratio(gain, prior, noise));
	const h = $derived(weight(s));

	/** The draw is seeded afresh on each visit, once the page is in the reader's hands; the server draws seed 1. */
	let seed = $state(1);
	const fresh = () => crypto.getRandomValues(new Uint32Array(1))[0];
	onMount(() => {
		seed = fresh();
	});

	// --- the prediction: answered once the reader has made s = 1 again, away from where the figure opened ------------
	let revealed = $state(false);

	type Which = 'gain' | 'prior' | 'noise';
	function set(which: Which, v: number) {
		const value = snap(v);
		if (which === 'gain') gain = value;
		else if (which === 'prior') prior = value;
		else noise = value;
		const away = gain !== 1 || prior !== 1 || noise !== 1;
		if (away && balanced(ratio(gain, prior, noise))) revealed = true;
	}
	const valueOf = (which: Which) => (which === 'gain' ? gain : which === 'prior' ? prior : noise);

	/** The arrow keys step one value of two figures at a time; the page keys ten. */
	function keys(which: Which) {
		return (e: KeyboardEvent) => {
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
				set(which, stepRung(valueOf(which), by[e.key]));
			} else if (e.key === 'Home' || e.key === 'End') {
				e.preventDefault();
				set(which, e.key === 'Home' ? LEAST : MOST);
			}
		};
	}

	// --- the pairs and their errors -----------------------------------------------------------------------------------
	const sample = $derived(draw(seed));
	const cloud = $derived(pairs(sample, gain, prior, noise));
	const simulated = $derived(simulate(sample, gain, prior, noise));
	const predicted = $derived(predict(gain, prior, noise));
	const followed = $derived(example(sample));

	// --- panel (a): the pairs, x across and y up, each axis scaled to its own spread ------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const size = $derived(phone.current ? { w: 332, h: 300 } : { w: 340, h: 316 });
	const a = $derived({ L: 34, R: size.w - 8, T: 26, B: size.h - 36 });
	const f1 = (v: number) => v.toFixed(1);

	const spreadY = $derived(readingSpread(gain, prior, noise));
	const halfX = $derived(REACH * prior);
	const halfY = $derived(REACH * spreadY);
	const ax = (x: number) => a.L + ((x / halfX + 1) / 2) * (a.R - a.L);
	const ay = (y: number) => a.B - ((y / halfY + 1) / 2) * (a.B - a.T);

	const dots = $derived.by(() => {
		let d = '';
		for (let i = 0; i < cloud.x.length; i++) d += `M${f1(ax(cloud.x[i]))},${f1(ay(cloud.y[i]))}h0`;
		return d;
	});

	/** A guess's line x̂ = k y, drawn from the bottom of the panel to its top: x̂ = k y at y = ±(the reach of y). */
	const guessLine = (k: number) =>
		`M${f1(ax(-k * halfY))},${f1(ay(-halfY))}L${f1(ax(k * halfY))},${f1(ay(halfY))}`;
	const naiveLine = $derived(guessLine(1 / gain));
	const wienerLine = $derived(guessLine(h / gain));

	/** The pair followed: its true amount, its reading, and where the two guesses put it. */
	const one = $derived({
		x: cloud.x[followed],
		y: cloud.y[followed],
		naive: cloud.y[followed] / gain,
		wiener: (h * cloud.y[followed]) / gain
	});

	/** Ticks at 1, 2 or 5 times a power of ten, as far as each axis reaches. */
	function ticks(half: number) {
		const step = tickStep(half);
		const out: number[] = [];
		const n = Math.floor(half / step + 1e-9);
		for (let k = -n; k <= n; k++) out.push(Number((k * step).toPrecision(6)));
		return out;
	}
	const ticksX = $derived(ticks(halfX));
	const ticksY = $derived(ticks(halfY));
	const minus = (v: number) => (v < 0 ? `−${-v}` : `${v}`);

	// --- panel (b): the errors, in units of the prior's variance ---------------------------------------------------------
	const SCALE = 2;
	const scaleTicks = [0, 0.5, 1, 1.5, 2];
	const rows = $derived([
		{
			key: 'prior',
			sim: simulated.prior / prior ** 2,
			pre: predicted.prior / prior ** 2,
			tex: ''
		},
		{
			key: 'naive',
			sim: simulated.naive / prior ** 2,
			pre: predicted.naive / prior ** 2,
			tex: '1/s^2'
		},
		{
			key: 'wiener',
			sim: simulated.wiener / prior ** 2,
			pre: predicted.wiener / prior ** 2,
			tex: '1/(1 + s^2)'
		}
	] as const);
	const NAMES = {
		prior: { words: 'The prior’s variance: the error of guessing zero, the prior’s mean', tex: '' },
		naive: { words: 'The naive guess', tex: 'y/T' },
		wiener: { words: 'The Wiener guess', tex: 'H\\,y/T' }
	};
	const place = (v: number) => `${(Math.min(v, SCALE) / SCALE) * 100}%`;

	// --- the numbers ----------------------------------------------------------------------------------------------------
	/** A slider's value as it stops: "0.25", "1.0", "10". */
	const setting = (v: number) => (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : '10');
	/** The ratio s to three figures: "0.333", "1.00", "10.0", "1000". */
	const sText = (v: number) => (v >= 999.5 ? String(Math.round(v)) : v.toPrecision(3));

	/** A positive number to `figures` figures, keeping a final zero, as LaTeX: "0.50", "0.0099", "2.7 \\times 10^{4}". */
	function texFig(x: number, figures = 2) {
		if (x >= 1e-3 && x < 1e4)
			return x >= 10 ** (figures - 1) ? String(Math.round(x)) : x.toPrecision(figures);
		const e = Math.floor(Math.log10(x));
		const m = (x / 10 ** e).toFixed(figures - 1);
		return Number(m) >= 10
			? `1.${'0'.repeat(figures - 1)} \\times 10^{${e + 1}}`
			: `${m} \\times 10^{${e}}`;
	}
	/** Its plain-text twin: "0.50", "0.0099", "27,000", "1.0 × 10⁻⁶". */
	function plain(x: number, figures = 2) {
		if (x >= 1e-3 && x < 1e4)
			return x >= 10 ** (figures - 1)
				? Math.round(x).toLocaleString('en-US')
				: x.toPrecision(figures);
		const e = Math.floor(Math.log10(x));
		const m = (x / 10 ** e).toFixed(figures - 1);
		return Number(m) >= 10
			? `1.${'0'.repeat(figures - 1)} × 10${superscript(e + 1)}`
			: `${m} × 10${superscript(e)}`;
	}
	/** The weight H to three figures, and closer to one by what it lacks: "0.500", "0.9901", "1 − 1.0 × 10⁻⁶". */
	const hTex = $derived(
		h < 0.995 ? texFig(h, 3) : h < 0.99995 ? h.toFixed(4) : `1 - ${texFig(1 - h, 2)}`
	);
	const hPlain = $derived(
		h < 0.995 ? plain(h, 3) : h < 0.99995 ? h.toFixed(4) : `1 − ${plain(1 - h, 2)}`
	);

	/** Which of the four regimes the bars are in, for the sentence under them. */
	const regime = $derived(balanced(s) ? 'one' : s < 1 ? 'below' : s < 3 ? 'above' : 'far');

	const labelA = $derived(
		`${PAIRS} simulated pairs, the true amount x across and the reading y up, at s = ${sText(s)}. The naive guess y over T and the Wiener guess H y over T are drawn as lines; the Wiener line is the steeper. One pair is followed: its true amount is ${one.x.toFixed(2)}, its reading ${one.y.toFixed(2)}, the naive guess ${one.naive.toFixed(2)} and the Wiener guess ${one.wiener.toFixed(2)}.`
	);
</script>

<div class="one-mode-wiener">
	<section class="predict" aria-labelledby="{uid}-predict">
		<span class="tag" id="{uid}-predict">Predict</span>
		<p class="question">
			When the noise is equal to the signal, what fraction of the reading should the estimate keep?
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed}
				<strong>One half.</strong> When the scene’s part of the reading is as large as the noise,
				<Tex math="s = T\sigma_x/\sigma_n = 1" />, and the best guess keeps <Tex
					math="H = s^2/(1 + s^2) = \tfrac12"
				/> of the naive guess <Tex math="y/T" />. It leaves half the prior’s variance as error,
				while the naive guess leaves <Tex math="\sigma_x^2/s^2 = \sigma_x^2" />, no better than
				guessing zero. Any gain, prior and noise with <Tex math="s = 1" /> give the same half: only the
				ratio counts.
			{:else}
				The answer appears once you have moved the sliders and made the noise equal to the signal
				again, <Tex math="s = 1" />, in a new way: for instance by doubling both the gain and the
				noise.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="top">
			<div class="panel">
				<p class="title">
					<span class="letter">(a)</span>
					{PAIRS} simulated pairs, the true amount <Tex math="x" /> across and the reading
					<Tex math="y" /> up
				</p>
				<svg viewBox="0 0 {size.w} {size.h}" role="img" aria-label={labelA} {@attach fitText()}>
					<defs>
						<clipPath id="{uid}-a">
							<rect x={a.L} y={a.T} width={a.R - a.L} height={a.B - a.T} />
						</clipPath>
					</defs>

					<!-- the axes, each reaching 3.6 of its own standard deviations, and the zero lines -->
					<line class="zero" x1={ax(0)} y1={a.T} x2={ax(0)} y2={a.B} />
					<line class="zero" x1={a.L} y1={ay(0)} x2={a.R} y2={ay(0)} />
					<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
					<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
					{#each ticksX as v (v)}
						<line class="tick" x1={ax(v)} y1={a.B} x2={ax(v)} y2={a.B + 4} />
						<text class="num" x={ax(v)} y={a.B + 15} text-anchor="middle">{minus(v)}</text>
					{/each}
					{#each ticksY as v (v)}
						<line class="tick" x1={a.L - 4} y1={ay(v)} x2={a.L} y2={ay(v)} />
						<text class="num" x={a.L - 7} y={ay(v) + 3.6} text-anchor="end">{minus(v)}</text>
					{/each}
					<text class="label" x={a.R} y={a.B + 30} text-anchor="end"
						><tspan class="italic">x</tspan>, the true amount</text
					>
					<text class="label" x={a.L - 4} y={a.T - 13}
						><tspan class="italic">y</tspan>, the reading</text
					>

					<g clip-path="url(#{uid}-a)">
						<path class="dots" d={dots} />
						<!-- the pair followed: its reading, and the two guesses on it -->
						<line class="reading" x1={a.L} y1={ay(one.y)} x2={a.R} y2={ay(one.y)} />
						<path class="line naive" d={naiveLine} />
						<path class="line wiener" d={wienerLine} />
						<circle class="guess naive" cx={ax(one.naive)} cy={ay(one.y)} r="4" />
						<circle class="guess wiener" cx={ax(one.wiener)} cy={ay(one.y)} r="4" />
						<circle class="truth" cx={ax(one.x)} cy={ay(one.y)} r="2.4" />
					</g>
				</svg>
				<p class="legend">
					<span
						><i class="key naive"></i><span>the naive guess, <Tex math="\hat x = y/T" /></span
						></span
					>
					<span
						><i class="key wiener"></i><span>the Wiener guess, <Tex math="\hat x = H\,y/T" /></span
						></span
					>
					<span
						><i class="key truth"></i><span
							>one pair (the dot), its reading (dotted) and its two guesses (the rings)</span
						></span
					>
				</p>
			</div>

			<div class="panel errors">
				<p class="title">
					<span class="letter">(b)</span> The mean squared errors <Tex
						math="\langle(\hat x - x)^2\rangle"
					/>, in units of the prior’s variance <Tex math="\sigma_x^2" />
				</p>
				<dl class="score">
					<div>
						<dt>Ratio, <Tex math="s = T\sigma_x/\sigma_n" /></dt>
						<dd>{sText(s)}</dd>
					</div>
					<div>
						<dt>Weight, <Tex math="H = s^2/(1 + s^2)" /></dt>
						<dd class="kept">{hPlain}</dd>
					</div>
				</dl>
				<ul class="bars">
					{#each rows as row (row.key)}
						<li class={row.key}>
							<p class="name">
								{NAMES[row.key].words}{#if NAMES[row.key].tex},
									<Tex math={NAMES[row.key].tex} />{/if}
							</p>
							<div class="track" aria-hidden="true">
								<i class="unit"></i>
								<b class="fill" style:width={place(row.sim)}></b>
								{#if row.pre <= SCALE}
									<i class="predicted" style:left={place(row.pre)}></i>
								{/if}
								{#if row.sim > SCALE}
									<span class="beyond">beyond the scale</span>
								{/if}
							</div>
							<p class="values">
								simulated <strong>{plain(row.sim)}</strong>, predicted
								<strong>{plain(row.pre)}</strong>{#if row.tex}<span
										>, from <Tex math={row.tex} /></span
									>{/if}
							</p>
						</li>
					{/each}
				</ul>
				<div class="scale" aria-hidden="true">
					{#each scaleTicks as v (v)}
						<span style:left={place(v)}>{v}</span>
					{/each}
				</div>
				<p class="verdict">
					{#if regime === 'one'}
						At <Tex math="s = 1" /> the naive guess does no better than guessing zero, and the Wiener
						guess halves its error.
					{:else if regime === 'below'}
						Below <Tex math="s = 1" /> the naive guess is worse than no guess at all: dividing by the
						small gain enlarges the noise more than it recovers the scene. The Wiener guess keeps less
						than half of the reading, and its error stays below the prior’s variance.
					{:else if regime === 'above'}
						Both guesses do better than guessing zero, and the Wiener guess still does better than
						the naive one.
					{:else}
						The pattern stands well above its noise: <Tex math="H" /> is close to one, and the two guesses
						nearly agree.
					{/if}
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="sliders">
			<div onkeydowncapture={keys('gain')} role="presentation">
				<Slider
					id="{uid}-gain"
					label="Gain"
					icon={VolumeHighIcon}
					min={-1}
					max={1}
					step={0.001}
					bind:value={() => Math.log10(gain), (v) => set('gain', 10 ** v)}
					readout="T = {setting(gain)}"
					ends={['0.1', '10']}
					marks={[1, 3, 10].map((v) => ({ at: Math.log10(v), label: `T = ${v}` }))}
					marksHint="the ticks mark gains of 1, 3 and 10"
				/>
			</div>
			<div onkeydowncapture={keys('prior')} role="presentation">
				<Slider
					id="{uid}-prior"
					label="Prior"
					icon={ArrowExpandIcon}
					min={-1}
					max={1}
					step={0.001}
					bind:value={() => Math.log10(prior), (v) => set('prior', 10 ** v)}
					readout="σₓ = {setting(prior)}"
					ends={['0.1', '10']}
					marks={[{ at: 0, label: 'σₓ = 1' }]}
					marksHint="the tick marks a spread of 1"
				/>
			</div>
			<div onkeydowncapture={keys('noise')} role="presentation">
				<Slider
					id="{uid}-noise"
					label="Noise"
					icon={AudioWaveformIcon}
					min={-1}
					max={1}
					step={0.001}
					bind:value={() => Math.log10(noise), (v) => set('noise', 10 ** v)}
					readout="σₙ = {setting(noise)}"
					ends={['0.1', '10']}
					marks={[1, 3].map((v) => ({ at: Math.log10(v), label: `σₙ = ${v}` }))}
					marksHint="the ticks mark noises of 1 and 3"
				/>
			</div>
		</div>
		<div class="row-controls">
			<p class="hint">
				Drag a slider, or reach it with Tab and step one value at a time with the arrow keys. The
				dice draw 500 new pairs.
			</p>
			<button type="button" class="redraw" onclick={() => (seed = fresh())}>
				<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
				New draw
			</button>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The model</dt>
				<dd>
					<Tex math={`y = T\\,x + n,\\quad T = ${setting(gain)}`} /><span class="also"
						>the true amount <Tex math="x" /> has the prior’s standard deviation <Tex
							math={`\\sigma_x = ${setting(prior)}`}
						/>, the noise <Tex math="n" /> the standard deviation <Tex
							math={`\\sigma_n = ${setting(noise)}`}
						/>; both have mean zero and are independent</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Ratio</dt>
				<dd>
					<Tex
						math={`s = T\\sigma_x/\\sigma_n = ${setting(gain)}\\times${setting(prior)}/${setting(noise)} = ${sText(s)}`}
					/><span class="also"
						>a scene of the expected size moves the reading by {sText(s)} noise standard deviations</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Weight</dt>
				<dd>
					<Tex math={`H = s^2/(1 + s^2) = ${hTex}`} /><span class="also"
						>the share of the naive guess <Tex math="y/T" /> that the best guess keeps</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Naive guess</dt>
				<dd>
					<Tex
						math={`\\langle(y/T - x)^2\\rangle = \\sigma_n^2/T^2 = \\sigma_x^2/s^2 = ${texFig(predicted.naive / prior ** 2)}\\,\\sigma_x^2`}
					/><span class="also"
						>the {PAIRS} pairs give {plain(simulated.naive / prior ** 2)}<Tex
							math="\,\sigma_x^2"
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Wiener guess</dt>
				<dd>
					<Tex
						math={`\\langle(H\\,y/T - x)^2\\rangle = \\sigma_x^2/(1 + s^2) = ${texFig(predicted.wiener / prior ** 2)}\\,\\sigma_x^2`}
					/><span class="also"
						>the {PAIRS} pairs give {plain(simulated.wiener / prior ** 2)}<Tex
							math="\,\sigma_x^2"
						/></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each pair draws the true amount <Tex math="x" /> from a Gaussian of mean zero and standard deviation
			<Tex math="\sigma_x" />, the prior, and the noise <Tex math="n" /> from an independent Gaussian
			of mean zero and standard deviation <Tex math="\sigma_n" />, and sets <Tex
				math="y = Tx + n"
			/>. The same 500 pairs of standard Gaussian numbers are rescaled when a slider moves, so that
			the cloud changes smoothly; a new draw takes fresh ones, from a stream seeded afresh on each
			visit. The simulated errors are the means of <Tex math="(\hat x - x)^2" /> over the 500 pairs; they
			scatter about the predicted values by about <Tex math={'\\sqrt{2/500}'} />, or 6%, of them.
		</p>
		<p class="note">
			In (a) each axis reaches 3.6 of its own standard deviations to each side, <Tex
				math="\sigma_x"
			/> across and <Tex math={'\\sqrt{T^2\\sigma_x^2 + \\sigma_n^2}'} /> up, so the shape of the cloud
			depends on <Tex math="s" /> alone. Each line gives, for a reading <Tex math="y" />, the guess
			<Tex math="\hat x" /> beside it, so the horizontal distance from a dot to a line is that guess’s
			error. The Wiener line runs through the middle of each horizontal slice of the cloud: it is the
			mean of <Tex math="x" /> among the pairs with that reading. The bars in (b) are the simulated errors,
			and the thin marks the predicted ones; the bars are drawn up to twice the prior’s variance.
		</p>
	</div>
</div>

<style>
	.one-mode-wiener {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		--naive: var(--q-field);
		--wiener: var(--accent);
	}

	/* --- the prediction ------------------------------------------------------------------ */

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

	/* --- the panels ------------------------------------------------------------------------ */

	.stage {
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.1rem;
		align-items: start;
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

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 14%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.label {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.italic {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(12.5px * var(--u, 1));
		fill: var(--text);
	}

	/* the pairs: dots, drawn as the round ends of strokes of no length */
	.dots {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(2.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.line {
		fill: none;
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.line.naive {
		stroke: var(--naive);
	}

	.line.wiener {
		stroke: var(--wiener);
	}

	.reading {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.guess {
		fill: none;
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.guess.naive {
		stroke: var(--naive);
	}

	.guess.wiener {
		stroke: var(--wiener);
	}

	.truth {
		fill: var(--text);
		stroke: none;
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

	.key.naive {
		border-color: var(--naive);
	}

	.key.wiener {
		border-color: var(--wiener);
	}

	.key.truth {
		width: 0.45rem;
		height: 0.45rem;
		border: 0;
		border-radius: 50%;
		background: var(--text);
	}

	/* the errors */
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

	.score dd.kept {
		color: var(--wiener);
	}

	.bars {
		list-style: none;
		margin: 0.7rem 0 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
	}

	.bars li {
		--tone: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.bars li.naive {
		--tone: var(--naive);
	}

	.bars li.wiener {
		--tone: var(--wiener);
	}

	.name {
		font-size: 0.74rem;
		line-height: 1.35;
		color: var(--text);
	}

	.track {
		position: relative;
		height: 0.7rem;
		margin: 0.2rem 0 0.15rem;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--tone) 45%, transparent);
		border-right: 1px solid var(--tone);
	}

	.unit {
		position: absolute;
		left: 50%;
		top: -0.15rem;
		bottom: -0.15rem;
		border-left: 1px dashed color-mix(in srgb, var(--text) 35%, transparent);
	}

	.predicted {
		position: absolute;
		top: -0.2rem;
		bottom: -0.2rem;
		width: 0;
		border-left: 1.5px solid var(--text);
		translate: -0.75px 0;
	}

	.beyond {
		position: absolute;
		right: 0.35rem;
		top: 50%;
		translate: 0 -50%;
		font-size: 0.62rem;
		line-height: 1;
		color: var(--text);
	}

	.values {
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.values strong {
		color: var(--text);
		font-weight: 600;
	}

	.scale {
		position: relative;
		height: 1rem;
		margin-top: 0.1rem;
		font-size: 0.66rem;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.scale span {
		position: absolute;
		top: 0;
		translate: -50% 0;
	}

	.scale span:first-child {
		translate: 0 0;
	}

	.scale span:last-child {
		translate: -100% 0;
	}

	.verdict {
		margin-top: 0.45rem !important;
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

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem 1.2rem;
	}

	.sliders > div {
		min-width: 0;
	}

	.row-controls {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.hint {
		flex: 1 1 auto;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
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

	.redraw:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.redraw:hover {
			border-color: var(--accent);
		}
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
		grid-template-columns: 8rem 1fr;
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

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row-controls {
			flex-wrap: wrap;
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
		.redraw {
			transition: none;
		}
	}
</style>
