<script lang="ts">
	/**
	 * Chapter 3.8's bits per patch. (a) One patch of the scene, z on a side, drawn as its patterns: a grid of cells, the
	 * coarsest pattern at the top left and finer ones to the right and down, each cell shaded by the bits its pattern
	 * carries at most, ½ log₂(1 + s²), and the arc q = q_c beyond which the patterns fall below their noise. The grid
	 * subdivides as the sensitivity grows. (b) What the patch holds: the patterns q_c²/4π times the bits each,
	 * (q_c/3 − ½)/ln 2, is the closed form C, with the paper's integral beside it up to 10¹⁰, and the total on a scale
	 * of powers of ten with a byte and a kilobyte marked. The numbers come from ./bits-per-patch.ts, the cut-off from
	 * the engine. Two predictions at the top are answered once the reader has done what they ask. Nothing moves by
	 * itself and nothing fades, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { Radar01Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		FIRST,
		INTEGRAL_MOST,
		KILOBYTE,
		LEAST,
		MILLION_FROM,
		MILLION_TO,
		MOST,
		bitTicks,
		count,
		cutText,
		firstKilobyte,
		integral,
		percent,
		plain,
		size,
		snrTex,
		snrText,
		tenths,
		tex,
		tile
	} from './bits-per-patch';

	const uid = $props.id();

	// --- the sensitivity, as a power of ten ---------------------------------------------------------------------------
	let decades = $state(FIRST);

	// --- the predictions ------------------------------------------------------------------------------------------------
	const KILOBYTE_AT = firstKilobyte();
	let step = $state<1 | 2>(1);
	let reachedMillion = $state(false);
	let foundKilobyte = $state(false);
	const revealed = $derived(step === 1 ? reachedMillion : foundKilobyte);

	function setDecades(d: number) {
		decades = Math.max(LEAST, Math.min(MOST, Math.round(d)));
		if (decades === MILLION_TO) reachedMillion = true;
		if (step === 2 && decades === KILOBYTE_AT) foundKilobyte = true;
	}

	/** The arrow keys step one power of ten, the page keys ten. */
	function keys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		if (e.key === 'PageUp' || e.key === 'PageDown') {
			e.preventDefault();
			setDecades(decades + (e.key === 'PageUp' ? 10 : -10));
		}
	}

	// the answers' numbers, from the same model
	const before = count(MILLION_FROM);
	const after = count(MILLION_TO);
	const bitsBefore = Math.round(integral(MILLION_FROM));
	const bitsAfter = Math.round(integral(MILLION_TO));
	const growth = Math.round(bitsAfter / bitsBefore);
	const cube = Math.round((after.qc / before.qc) ** 3);
	const near = [20, KILOBYTE_AT - 1, KILOBYTE_AT].map((d) => ({ d, bits: count(d).closed }));

	// --- the numbers ----------------------------------------------------------------------------------------------------
	const now = $derived(count(decades));
	const withIntegral = $derived(decades <= INTEGRAL_MOST);
	const exact = $derived(withIntegral ? integral(decades) : undefined);
	const short = $derived(exact === undefined ? undefined : (exact - now.closed) / exact);
	const snrNow = $derived(`\\mathrm{SNR} = ${snrTex(decades)}`);

	// --- panel (a): the tile ----------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const t = $derived(phone.current ? { w: 332, side: 300, L: 16 } : { w: 300, side: 276, L: 12 });
	const T = 20;
	const height = $derived(T + t.side + 4);
	const grid = $derived(tile(decades));
	const cell = $derived(t.side / grid.n);
	/** The gap between cells: a thin line of the frame, never more than two units. */
	const gap = $derived(Math.min(2, Math.max(0.4, cell * 0.07)));
	const f2 = (x: number) => x.toFixed(2);

	const cells = $derived.by(() => {
		const out: { x: number; y: number; share: number }[] = [];
		for (let j = 0; j < grid.n; j++)
			for (let i = 0; i < grid.n; i++)
				out.push({
					x: t.L + i * cell + gap / 2,
					y: T + j * cell + gap / 2,
					share: grid.bits[j * grid.n + i] / grid.most
				});
		return out;
	});
	const shade = (share: number) =>
		`color-mix(in oklab, var(--accent) ${(100 * share).toFixed(1)}%, var(--bg-sunken))`;

	/** The cut-off, a quarter circle about the coarse corner. */
	const arcR = $derived(grid.radius * cell);
	const arc = $derived(
		`M${f2(t.L + arcR)},${T}A${f2(arcR)},${f2(arcR)} 0 0 1 ${t.L},${f2(T + arcR)}`
	);
	const arcLabelX = $derived(Math.min(t.L + arcR, t.L + t.side - 12));

	const ticks = $derived(bitTicks(grid.most));
	const tickPlace = (v: number) => `${(v / grid.most) * 100}%`;

	// --- panel (b): the total on a scale of powers of ten -------------------------------------------------------------------
	const SCALE_TOP = 6;
	const powers = [0, 1, 2, 3, 4, 5, 6];
	const along = (bits: number) => `${(Math.max(0, Math.log10(bits)) / SCALE_TOP) * 100}%`;
	const powerText = (e: number) => (e === 0 ? '1' : e === 1 ? '10' : e === 2 ? '100' : snrText(e));

	// --- the words for screen readers ------------------------------------------------------------------------------------
	const labelA = $derived(
		`One patch of the scene as its patterns: ${grid.n} by ${grid.n} cells, the coarsest pattern at the top left. About ${tenths(now.patterns)} of them lie within the arc of the cut-off, q c = ${cutText(now.qc)}. The coarsest carries ${tenths(grid.most)} bits, and the cells beyond the arc almost none.`
	);
</script>

<div class="bits-per-patch">
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
				How many more bits does a million times the sensitivity buy, from <Tex math="10^3" /> to
				<Tex math="10^9" />?
			{:else}
				Where does the picture reach a kilobyte?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>From {bitsBefore} bits to {bitsAfter}: {bitsAfter - bitsBefore} more, about {growth} times
					as many.</strong
				>
				A million times the sensitivity moves the cut-off <Tex math="q_c" /> only from {before.qc.toFixed(
					1
				)} to {after.qc.toFixed(1)}, and the cube of that ratio is {cube}. The patterns grow as
				<Tex math="q_c^2" />, from {tenths(before.patterns)} to {tenths(after.patterns)}, and the
				bits in each a little faster than <Tex math="q_c" />, from {tenths(before.each)} to {tenths(
					after.each
				)}, because of the <Tex math="-\tfrac12" /> in <Tex math="(q_c/3 - \tfrac12)/\ln 2" />. The
				sensitivity buys bits only through its logarithm.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>Near <Tex math={`10^{${KILOBYTE_AT}}`} />.</strong> A kilobyte is 1000 bytes of
				eight bits, {KILOBYTE} bits. At <Tex math={`10^{${near[0].d}}`} /> the patch holds {plain(
					near[0].bits
				)} bits, {size(near[0].bits)}; at <Tex math={`10^{${near[1].d}}`} />, {plain(near[1].bits)}
				bits, {size(near[1].bits)}; and at <Tex math={`10^{${near[2].d}}`} />, {plain(near[2].bits)} bits,
				{size(near[2].bits)}: twenty-one powers of ten of sensitivity beyond <Tex math="10^3" />.
			{:else if step === 1}
				The answer appears once you have moved the sensitivity to <Tex math="10^9" />.
			{:else}
				The answer appears once you have found the first power of ten at which the patch holds a
				kilobyte, {KILOBYTE} bits.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="pair">
			<div class="panel">
				<p class="title">
					<span class="letter">(a)</span> One patch of the scene, <Tex math="z \times z" />, as its
					patterns
				</p>
				<svg viewBox="0 0 {t.w} {height}" role="img" aria-label={labelA} {@attach fitText()}>
					<rect class="frame" x={t.L} y={T} width={t.side} height={t.side} />
					{#each cells as c, k (k)}
						<rect
							x={f2(c.x)}
							y={f2(c.y)}
							width={f2(cell - gap)}
							height={f2(cell - gap)}
							style:fill={shade(c.share)}
						/>
					{/each}
					<path class="arc-halo" d={arc} />
					<path class="arc" d={arc} />
					<line class="tick" x1={t.L + arcR} y1={T - 4} x2={t.L + arcR} y2={T} />
					<text class="sym" x={arcLabelX} y={T - 7} text-anchor="middle"
						>q<tspan class="sub" dy="3">c</tspan></text
					>
				</svg>
				<div
					class="colour-bar"
					style:--left={t.L / t.w}
					style:--width={t.side / t.w}
					aria-hidden="true"
				>
					<i></i>
					<div class="bar-ticks">
						{#each ticks as v (v)}
							<span style:left={tickPlace(v)}>{v}</span>
						{/each}
					</div>
				</div>
				<p class="legend">
					Each square is one pattern, shaded by the bits it carries at most, <Tex
						math="\tfrac12\log_2(1 + s^2)"
					/>, on the scale above. The coarsest is at the top left; finer patterns lie to the right
					and down. The arc is the cut-off <Tex math="q = q_c" />.
				</p>
			</div>

			<div class="panel">
				<p class="title"><span class="letter">(b)</span> What the patch holds</p>
				<dl class="sum">
					<div>
						<dt>Patterns</dt>
						<dd>{tenths(now.patterns)}</dd>
					</div>
					<span class="op" aria-hidden="true">×</span>
					<div>
						<dt>Bits each</dt>
						<dd>{tenths(now.each)}</dd>
					</div>
					<span class="op" aria-hidden="true">=</span>
					<div>
						<dt>Bits per patch</dt>
						<dd class="total">{plain(now.closed)}</dd>
					</div>
				</dl>
				<p class="check">
					{#if exact !== undefined && short !== undefined}
						The integral gives <strong>{plain(exact)} bits</strong>; the closed form is {percent(
							short
						)}
						lower.
					{:else}
						Beyond <Tex math={`10^{${INTEGRAL_MOST}}`} /> the closed form lies within half a per cent
						of the integral.
					{/if}
				</p>

				<p class="scale-title">
					The bits per patch, {plain(now.closed)}, {now.closed < 8 ? 'are' : 'make'}
					{size(now.closed)}:
				</p>
				<div class="track-wrap" aria-hidden="true">
					<div class="marks">
						<span style:left={along(8)}>a byte</span>
						<span style:left={along(KILOBYTE)}>a kilobyte</span>
					</div>
					<div class="track">
						<b class="fill" style:width={along(now.closed)}></b>
						<i class="mark" style:left={along(8)}></i>
						<i class="mark" style:left={along(KILOBYTE)}></i>
					</div>
					<div class="scale">
						{#each powers as e (e)}
							<span style:left="{(e / SCALE_TOP) * 100}%">{powerText(e)}</span>
						{/each}
					</div>
				</div>
				<p class="scale-note">bits, on a scale of powers of ten</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div onkeydowncapture={keys} role="presentation">
			<Slider
				id="{uid}-sensitivity"
				label="Sensitivity"
				icon={Radar01Icon}
				min={LEAST}
				max={MOST}
				step={1}
				bind:value={() => decades, setDecades}
				readout="SNR = {snrText(decades)}"
				ends={['10', '10⁷⁰']}
				marks={[3, 6, 9, 30, 70].map((d) => ({ at: d, label: `SNR = ${snrText(d)}` }))}
				marksHint="the ticks mark 10³, 10⁶, 10⁹, 10³⁰ and 10⁷⁰"
			/>
		</div>
		<p class="hint">
			Drag the slider, or reach it with Tab and step one power of ten at a time with the arrow keys,
			ten with Page Up and Page Down.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Sensitivity</dt>
				<dd>
					<Tex math={snrNow} /><span class="also"
						>The camera’s signal-to-noise ratio: the peak tide of one point mass over the noise
						averaged on a patch <Tex math="z \times z" />, where <Tex math="z" /> is the depth of the
						scene.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Cut-off</dt>
				<dd>
					<Tex math={`q_c = ${cutText(now.qc)}`} /><span class="also"
						>The larger root of <Tex math={'q_c e^{-q_c} = 1/\\pi\\,\\mathrm{SNR}'} />. A ripple of
						wavenumber <Tex math="k = q/z" /> stands above its noise by <Tex
							math={'s = \\pi\\,\\mathrm{SNR}\\,q\\,e^{-q}'}
						/>, and those with <Tex math="q > q_c" /> fall below it.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Patterns</dt>
				<dd>
					<Tex math={`q_c^2/4\\pi = ${tenths(now.patterns)}`} /><span class="also"
						>The ripples the camera keeps, those with <Tex math="q < q_c" />, in each area <Tex
							math="z^2"
						/>.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Bits each</dt>
				<dd>
					<Tex math={`(q_c/3 - \\tfrac12)/\\ln 2 = ${tenths(now.each)}`} /><span class="also"
						>The mean of <Tex math="\log_2 s" /> over the patterns: the bits each carries on average.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Closed form</dt>
				<dd>
					<Tex
						math={`C \\approx \\frac{q_c^3/3 - q_c^2/2}{4\\pi\\ln 2} = ${tex(now.closed)}\\ \\text{bits}`}
					/><span class="also"
						>The patterns times the bits each, per area <Tex math="z^2" />: {size(now.closed)}. A
						byte is eight bits, and a kilobyte 1000 bytes, 8000 bits.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The integral</dt>
				<dd>
					{#if exact !== undefined && short !== undefined}
						<Tex
							math={`C = \\frac{1}{4\\pi}\\int_0^\\infty q\\,\\log_2\\bigl(1 + \\pi^2\\mathrm{SNR}^2q^2e^{-2q}\\bigr)\\,\\mathrm{d}q = ${tex(exact)}\\ \\text{bits}`}
						/><span class="also"
							>The paper’s equation, the bits of every ripple added up. The closed form is {percent(
								short
							)} lower: it leaves out the soft edge near <Tex math="q_c" /> and the ripples beyond it.</span
						>
					{:else}
						<span class="also"
							>Shown up to <Tex math={`10^{${INTEGRAL_MOST}}`} />. Beyond it the closed form lies
							within half a per cent of the integral, and better the more sensitive the camera.</span
						>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			The cell in column <Tex math="i" /> and row <Tex math="j" /> of (a), counting from zero at the top
			left, stands for the pattern of wavenumber <Tex
				math={'q = \\pi\\sqrt{(i + \\tfrac12)^2 + (j + \\tfrac12)^2}'}
			/>, a ripple with about <Tex math="i" /> half-waves across the patch and <Tex math="j" /> down.
			Each cell then takes the same share of the plane of wavenumbers, so the cells inside the arc number
			about <Tex math="q_c^2/4\pi" />; the drawing rounds them to whole cells, and the readouts give
			the count exactly. The grid is the square that holds the arc, {grid.n} cells on a side here, from
			2 at <Tex math="10" /> to 54 at <Tex math="10^{70}" />. Each cell is shaded by
			<Tex math="\tfrac12\log_2(1 + s^2)" /> at its own <Tex math="q" />, on a scale from zero to
			the bits of the coarsest cell, {tenths(grid.most)} here; the scale changes with the sensitivity.
			The cells’ bits add up to the integral within a per cent.
		</p>
	</div>
</div>

<style>
	.bits-per-patch {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the prediction ------------------------------------------------------------------ */

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
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pair {
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

	/* (a): the tile; its frame shows between the cells as thin lines */
	.frame {
		fill: color-mix(in srgb, var(--text) 16%, var(--bg-sunken));
	}

	.arc {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.arc-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.7;
	}

	.tick {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.sym {
		fill: var(--text);
		font: italic 400 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sub {
		font-size: calc(9.5px * var(--u, 1));
	}

	.colour-bar {
		margin: 0.25rem 0 0 calc(100% * var(--left));
		width: calc(100% * var(--width));
	}

	.colour-bar i {
		display: block;
		height: 0.5rem;
		border-radius: 2px;
		border: 1px solid var(--line);
		background: linear-gradient(in oklab 90deg, var(--bg-sunken), var(--accent));
	}

	.bar-ticks {
		position: relative;
		height: 0.95rem;
		font-size: 0.66rem;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.bar-ticks span {
		position: absolute;
		top: 0.1rem;
		translate: -50% 0;
	}

	.bar-ticks span:first-child {
		translate: 0 0;
	}

	.legend {
		margin-top: 0.35rem !important;
		font-size: 0.72rem;
		line-height: 1.45;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* (b): the patterns times the bits each */
	.sum {
		margin: 0.15rem 0 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1.2fr);
		align-items: end;
		gap: 0.4rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--line);
		border-radius: 9px;
		background: var(--well);
	}

	.sum dt {
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.sum dd {
		margin: 0.1rem 0 0;
		font: 500 1.15rem/1.25 var(--font-sans);
		font-variant-numeric: tabular-nums;
		color: var(--text);
		white-space: nowrap;
	}

	.sum dd.total {
		color: var(--accent);
	}

	.op {
		font: 400 1rem/1.25 var(--font-sans);
		color: var(--text-faint);
		padding-bottom: 0.05rem;
	}

	.check {
		margin-top: 0.45rem !important;
		font-size: 0.76rem;
		line-height: 1.45;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.check strong {
		color: var(--text);
		font-weight: 600;
	}

	.scale-title {
		margin-top: 1rem !important;
		font-size: 0.76rem;
		line-height: 1.4;
		color: var(--text);
	}

	.track-wrap {
		margin: 0.2rem 0.6rem 0 0.3rem;
	}

	.marks {
		position: relative;
		height: 1rem;
		font-size: 0.66rem;
		color: var(--text-dim);
	}

	.marks span {
		position: absolute;
		bottom: 0.1rem;
		translate: -50% 0;
		white-space: nowrap;
	}

	.track {
		position: relative;
		height: 0.7rem;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent) 45%, transparent);
		border-right: 1px solid var(--accent);
	}

	.mark {
		position: absolute;
		top: -0.2rem;
		bottom: -0.2rem;
		width: 0;
		border-left: 1px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.scale {
		position: relative;
		height: 1rem;
		margin-top: 0.15rem;
		font-size: 0.66rem;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.scale span {
		position: absolute;
		top: 0;
		translate: -50% 0;
	}

	.scale-note {
		font-size: 0.66rem;
		color: var(--text-faint);
		text-align: right;
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
		align-items: baseline;
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
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
		.pair {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
