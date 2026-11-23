<script lang="ts">
	/**
	 * Chapter 0.3's graviton count. A source from the paper's budget (tab:budget), an area and an exposure give a
	 * mean count μ; one Poisson draw of that exposure is played out on a time line, its arrivals as dots, while a
	 * picture cut into ⌊μ/2500⌋ equal parts fills in beside the scene it is a picture of, each part as noisy as its
	 * own count, 1/√N. The numbers come from ./graviton-count.ts. A prediction at the top is answered once the reader
	 * has set a lifetime of the Earth below on one square metre. A reader who asks for less motion sees the whole
	 * draw at once.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Clock01Icon,
		CropIcon,
		DiceIcon,
		FireIcon,
		Globe02Icon,
		Orbit01Icon,
		PauseIcon,
		PlayIcon,
		Sun03Icon,
		Timer02Icon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { duration, sci, texNumber } from '../../ui/format';
	import {
		CONTRAST,
		COUNTS_PER_ELEMENT,
		HOUR,
		LIFETIME,
		MOST_TILES,
		RINGS,
		SIGMAS,
		SOURCES,
		STEPS,
		YEAR,
		countBy,
		expectedCount,
		expose,
		pictureElements,
		tileEstimate,
		timeFor,
		type SourceId
	} from './graviton-count';

	const uid = $props.id();

	// --- the choices: a source, an area and an exposure, the last two as powers of ten -------------------------------
	let sourceId = $state<SourceId>('earth');
	const source = $derived(SOURCES[sourceId]);

	const AREA_LEAST = -2;
	const AREA_MOST = 2;
	let logArea = $state(0);
	const areaM2 = $derived(10 ** logArea);

	const TIME_LEAST = 0;
	const TIME_MOST = Math.log10(1e10 * YEAR);
	let logTime = $state(Math.log10(YEAR));
	const seconds = $derived(10 ** logTime);
	/** The marked exposures: a value dragged or stepped to within a step of one is taken to be it. */
	const MARKS = [
		{ at: Math.log10(HOUR), label: 'an hour' },
		{ at: Math.log10(YEAR), label: 'a year' },
		{ at: Math.log10(LIFETIME), label: 'a lifetime, 80 years' },
		{ at: Math.log10(1e6 * YEAR), label: 'a million years' }
	];
	function setLogTime(v: number) {
		const near = MARKS.find((m) => Math.abs(m.at - v) < 0.0075);
		logTime = near ? near.at : v;
	}

	let seed = $state(1);

	// --- the draw -----------------------------------------------------------------------------------------------------
	const mu = $derived(expectedCount(source, areaM2, seconds));
	const shot = $derived(expose(mu, seed));
	const elements = $derived(shot.elements);
	const thinned = $derived(shot.total > shot.dots.length);

	// --- the clock: the fraction of the exposure gone by --------------------------------------------------------------
	/** A run of the whole exposure takes this many seconds. */
	const RUN = 5;
	let u = $state(1);
	let playing = $state(false);

	function setU(v: number) {
		u = Math.max(0, Math.min(1, v));
		playing = false;
	}

	function togglePlay() {
		if (!playing && u >= 1) u = 0;
		playing = !playing;
	}

	function newDraw() {
		seed += 1;
		if (prefersReducedMotion.current) return;
		u = 0;
		playing = true;
	}

	/** The clock, attached to the figure: it runs while `playing`, and stops at the end of the exposure. */
	const clock: Attachment = () => {
		if (!playing) return;
		let frame = 0;
		let last: number | undefined;
		const tick = (now: number) => {
			const dt = last === undefined ? 0 : Math.min(0.25, (now - last) / 1000);
			last = now;
			u = Math.min(1, u + dt / RUN);
			if (u >= 1) {
				playing = false;
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	};

	/** The first time the figure comes into view, the draw is played from the start, unless less motion is asked for. */
	const firstSight: Attachment<HTMLElement> = (node) => {
		if (prefersReducedMotion.current || typeof IntersectionObserver === 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				observer.disconnect();
				u = 0;
				playing = true;
			},
			{ threshold: 0.35 }
		);
		observer.observe(node);
		return () => observer.disconnect();
	};

	const step = $derived(Math.floor(u * STEPS + 1e-9));
	const sofar = $derived(countBy(shot, u));
	/** The dots drawn by now: the arrivals are in order of time. */
	const shown = $derived.by(() => {
		let lo = 0;
		let hi = shot.dots.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (shot.dots[mid].t <= u) lo = mid + 1;
			else hi = mid;
		}
		return lo;
	});

	// --- the prediction -------------------------------------------------------------------------------------------------
	const revealed = $derived(
		sourceId === 'earth' &&
			Math.abs(logArea) < 1e-6 &&
			Math.abs(logTime - Math.log10(LIFETIME)) < 1e-6
	);
	const lifetimeMu = expectedCount(SOURCES.earth, 1, LIFETIME);

	// --- the drawing's bounds: on a phone the time line is narrower ---------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const sizeA = $derived(phone.current ? { w: 332, h: 122 } : { w: 672, h: 112 });
	const a = $derived({ L: 12, R: sizeA.w - 14, T: 16, D: sizeA.h - 36, A: sizeA.h - 26 });
	const tx = (t: number) => a.L + t * (a.R - a.L);
	const f1 = (n: number) => n.toFixed(1);
	const fractions = $derived(phone.current ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]);

	// moving the clock by pointer: the handle, or anywhere on the line with a mouse or a pen
	let svgA: SVGSVGElement | undefined;
	const holdA: Attachment<SVGSVGElement> = (node) => {
		svgA = node;
		return () => (svgA = undefined);
	};
	let dragging = $state(false);

	function uAt(e: PointerEvent) {
		const m = svgA?.getScreenCTM();
		if (!m) return u;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return Math.round(((p.x - a.L) / (a.R - a.L)) * 200) / 200;
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		// a finger scrolls the page unless it takes the handle
		if (e.pointerType === 'touch' && !(e.target as Element).closest('.grip')) return;
		e.preventDefault();
		svgA?.setPointerCapture(e.pointerId);
		dragging = true;
		setU(uAt(e));
	}

	function move(e: PointerEvent) {
		if (dragging) setU(uAt(e));
	}

	function release() {
		dragging = false;
	}

	// --- the picture and the scene --------------------------------------------------------------------------------------
	const P = 200;
	/** Brightness, relative to the scene's faintest level, to the opacity of the ink: the four levels well apart. */
	const LOW = 0.8;
	const HIGH = 1.4;
	const ink = (b: number) => 0.1 + 0.9 * Math.max(0, Math.min(1, (b - LOW) / (HIGH - LOW)));
	const fills = $derived(
		shot.tiles.map((tile) => {
			const b = tileEstimate(shot, tile, step / STEPS);
			return b === undefined ? undefined : ink(b);
		})
	);
	const outlined = $derived(shot.tiles.length <= 64);
	/** A tile's count by now, and its spread, for the caption. */
	const perTile = $derived(shot.tiles.reduce((s, t) => s + t.counts[step], 0) / shot.tiles.length);

	// --- the numbers ----------------------------------------------------------------------------------------------------
	/** A count in words: "438", "35,064", "2.6 × 10⁷"; a mean below one to two figures. */
	function count(x: number) {
		if (x === 0) return '0';
		if (x < 0.01) return sci(x);
		if (x < 10 && !Number.isInteger(x)) return x.toPrecision(2);
		if (x < 1e6) return Math.round(x).toLocaleString('en-US');
		return sci(x);
	}
	const texCount = (x: number) =>
		x >= 1000 && x < 1e6
			? Math.round(x).toLocaleString('en-US').replace(/,/g, '{,}')
			: texNumber(x, 2);
	/** A fraction as a number of per cent: "100", "15", "2.0", "0.53", "1.8 × 10⁻⁸". */
	function percent(x: number) {
		const p = x * 100;
		if (p >= 9.95) return `${Math.round(p)}`;
		if (p >= 0.01) return p.toPrecision(2);
		return sci(p);
	}
	const squareMetres = (m2: number) =>
		`${m2 >= 9.95 ? Math.round(m2) : Number(m2.toPrecision(2))} m²`;

	/** A waiting time after "every": "second", "20 hours", "9.0 × 10⁷ years". */
	const wait = (s: number) => (Math.abs(s - 1) < 1e-6 ? 'second' : duration(s));

	const spread = $derived(Math.sqrt(mu));
	const firstElement = $derived(timeFor(source, areaM2, COUNTS_PER_ELEMENT));
	const elementsWords = $derived(
		elements === 0
			? 'none yet'
			: elements < 1e6
				? Math.round(elements).toLocaleString('en-US')
				: sci(elements)
	);
	const timeWords = $derived(`${duration(u * seconds)} of ${duration(seconds)}`);

	const labelA = $derived(
		`A time line of the exposure, ${duration(seconds)} long, with ${count(sofar)} arrivals by ${duration(u * seconds)}${thinned ? `, drawn as ${shown} dots` : ''}`
	);
	const labelPicture = $derived(
		elements === 0
			? `The picture so far: one part, with ${count(perTile)} counts, fewer than the ${COUNTS_PER_ELEMENT} of one picture element`
			: `The picture so far: ${shot.tiles.length} parts of equal area, about ${count(perTile)} counts each`
	);
</script>

<div class="graviton-count" {@attach clock} {@attach firstSight}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
		</div>
		<p class="question">
			How many picture elements does a lifetime, eighty years, of the Earth below give on one square
			metre?
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed}
				<strong>Only {pictureElements(lifetimeMu)}.</strong> Eighty years at one graviton every
				twenty hours is {Math.round(lifetimeMu).toLocaleString('en-US')} gravitons. Each element needs
				<Tex math={`(${SIGMAS}/${CONTRAST})^2 = ${COUNTS_PER_ELEMENT}`} /> of them, for a difference of
				ten per cent to stand five standard deviations above the counting noise, so
				<Tex
					math={`${Math.round(lifetimeMu).toLocaleString('en-US').replace(',', '{,}')}/2500 = ${(lifetimeMu / COUNTS_PER_ELEMENT).toFixed(1)}`}
				/>. The limit is the count, not the sharpness.
			{:else}
				The answer appears when you have chosen the Earth below, one square metre and a lifetime
				(the third tick on the exposure slider).
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title">
				<span class="letter">(a)</span> The arrivals:
				<strong class="tally">{count(sofar)}</strong>
				so far{#if thinned}, each dot standing for about {count(shot.perDot)}{/if}
			</p>
			<svg
				viewBox="0 0 {sizeA.w} {sizeA.h}"
				role="img"
				aria-label={labelA}
				class={['line', { dragging }]}
				onpointerdown={press}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach holdA}
				{@attach fitText()}
			>
				<rect class="band" x={a.L} y={a.T} width={a.R - a.L} height={a.D - a.T} rx="4" />
				<rect
					class="past"
					x={a.L}
					y={a.T}
					width={Math.max(0, tx(u) - a.L)}
					height={a.D - a.T}
					rx="4"
				/>
				{#each shot.dots.slice(0, shown) as dot, i (i)}
					<circle
						class="dot"
						cx={f1(tx(dot.t))}
						cy={f1(a.T + 5 + dot.lift * (a.D - a.T - 10))}
						r={phone.current ? 1.9 : 2.2}
					/>
				{/each}
				{#if shown > 0 && u < 1}
					{@const newest = shot.dots[shown - 1]}
					<circle
						class="newest"
						cx={f1(tx(newest.t))}
						cy={f1(a.T + 5 + newest.lift * (a.D - a.T - 10))}
						r="5"
					/>
				{/if}

				<!-- the axis of time -->
				<line class="axis" x1={a.L} y1={a.A} x2={a.R} y2={a.A} />
				{#each fractions as f (f)}
					<line class="tick" x1={tx(f)} y1={a.A} x2={tx(f)} y2={a.A + 4} />
					<text
						class="num"
						x={tx(f)}
						y={a.A + 16}
						text-anchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}
						>{f === 0 ? '0' : duration(f * seconds)}</text
					>
				{/each}

				<!-- the clock's hand and its handle -->
				<line class="hand" x1={tx(u)} y1={a.T - 4} x2={tx(u)} y2={a.A} />
				<g class="grip" transform="translate({f1(tx(u))} {a.T - 7})">
					<circle class="hit" r="14" />
					<circle class="knob" r="5" />
				</g>
			</svg>
		</div>

		<div class="pictures">
			<figure class="panel">
				<p class="title"><span class="letter">(b)</span> The picture so far</p>
				<svg viewBox="0 0 {P} {P}" role="img" aria-label={labelPicture} {@attach fitText()}>
					<rect class="empty" width={P} height={P} />
					{#each shot.tiles as tile, i (i)}
						{#if fills[i] !== undefined}
							<rect
								class="tile"
								x={tile.x * P}
								y={tile.y * P}
								width={tile.w * P}
								height={tile.h * P}
								fill-opacity={fills[i]}
							/>
						{/if}
						{#if outlined}
							<rect
								class="edge"
								x={tile.x * P}
								y={tile.y * P}
								width={tile.w * P}
								height={tile.h * P}
							/>
						{/if}
					{/each}
				</svg>
				<figcaption>
					{#if step === 0}
						Nothing counted yet.
					{:else if elements === 0}
						Not yet one picture element: {count(perTile)} of the {COUNTS_PER_ELEMENT.toLocaleString(
							'en-US'
						)} counts it needs, uncertain by {percent(1 / Math.sqrt(Math.max(1, perTile)))} per cent.
					{:else}
						{shot.tiles.length.toLocaleString('en-US')}
						{shot.tiles.length === 1 ? 'part' : 'equal parts'}{#if elements > MOST_TILES}&nbsp;(of
							{elementsWords}){/if}, about {count(perTile)} counts each so far, uncertain by about {percent(
							1 / Math.sqrt(Math.max(1, perTile))
						)} per cent.
					{/if}
				</figcaption>
			</figure>

			<figure class="panel">
				<p class="title"><span class="letter">(c)</span> What is there</p>
				<svg
					viewBox="0 0 {P} {P}"
					role="img"
					aria-label="The scene: four levels of brightness, ten per cent apart, in rings about the centre"
					{@attach fitText()}
				>
					<defs>
						<clipPath id="{uid}-scene">
							<rect width={P} height={P} />
						</clipPath>
					</defs>
					<rect class="empty" width={P} height={P} />
					<g clip-path="url(#{uid}-scene)">
						{#each RINGS as ring (ring.level)}
							{#if ring.r === Infinity}
								<rect class="tile" width={P} height={P} fill-opacity={ink(ring.level)} />
							{:else}
								<circle
									class="tile"
									cx={P / 2}
									cy={P / 2}
									r={(ring.r * P) / 2}
									fill-opacity={ink(ring.level)}
								/>
							{/if}
						{/each}
					</g>
				</svg>
				<figcaption>
					Four levels ten per cent apart: the stronger the colour, the more gravitons a part sends.
					<span class="levels" aria-hidden="true">
						{#each RINGS as ring (ring.level)}
							<i style:opacity={ink(ring.level)}></i>
						{/each}
					</span>
				</figcaption>
			</figure>
		</div>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause' : 'Play the exposure'}
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
			<div class="grow">
				<Slider
					id="{uid}-clock"
					label="Time gone by"
					icon={Clock01Icon}
					min={0}
					max={1}
					step={0.005}
					bind:value={() => u, setU}
					readout={timeWords}
				/>
			</div>
			<button type="button" class="redraw" onclick={newDraw}>
				<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
				New draw
			</button>
		</div>
		<div class="slide">
			<Slider
				id="{uid}-exposure"
				label="Exposure"
				icon={Timer02Icon}
				min={TIME_LEAST}
				max={TIME_MOST}
				step={0.01}
				bind:value={() => logTime, setLogTime}
				readout={duration(seconds)}
				ends={['1 s', '10¹⁰ years']}
				marks={MARKS}
				marksHint="the ticks mark an hour, a year, a lifetime and a million years"
			/>
		</div>
		<div class="slide">
			<Slider
				id="{uid}-area"
				label="Detector"
				icon={CropIcon}
				min={AREA_LEAST}
				max={AREA_MOST}
				step={0.05}
				bind:value={logArea}
				readout={squareMetres(areaM2)}
				ends={['0.01 m²', '100 m²']}
				marks={[{ at: 0, label: 'one square metre, as in the paper’s table' }]}
				marksHint="the tick marks one square metre, as in the paper’s table"
			/>
		</div>
		<div class="choice">
			<Segmented
				label="Source"
				options={[
					{ value: 'sun', label: 'The Sun’s core', icon: Sun03Icon },
					{ value: 'earth', label: 'The Earth below', icon: Globe02Icon },
					{ value: 'iron', label: 'Hot iron, 3.5 m', icon: FireIcon },
					{ value: 'pair', label: 'Turning pair, 4.5 m', icon: Orbit01Icon }
				]}
				bind:value={sourceId}
			/>
		</div>
		<p class="hint">
			Press play, or drag the time line in (a). Reach the sliders with Tab and use the arrow keys;
			the dice draw the exposure again.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Source</dt>
				<dd>
					<span>one graviton per m² every {wait(source.every)}</span><span class="also"
						>from {source.scene}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>On {squareMetres(areaM2)}</dt>
				<dd>one every {wait(source.every / areaM2)}</dd>
			</div>
			<div class="row">
				<dt>Expected count</dt>
				<dd>
					<Tex math={`\\mu = ${texCount(mu)}`} /><span class="also"
						>spread <Tex math={`\\sqrt{\\mu} = ${texCount(spread)}`} />{#if mu >= 1}, or {percent(
								1 / spread
							)} per cent{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>This draw</dt>
				<dd>
					<span>{count(shot.total)} gravitons</span><span class="also">{count(sofar)} by now</span>
				</dd>
			</div>
			<div class="row">
				<dt>Picture elements</dt>
				<dd>
					<Tex
						math={`\\lfloor \\mu/${COUNTS_PER_ELEMENT} \\rfloor = ${texNumber(elements, 2)}`}
					/><span class="also">the first after {duration(firstElement)}</span>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each graviton comes at a random moment, whatever the others do, so the count in a given time
			is a Poisson draw: it averages <Tex math="\mu" /> and varies by about <Tex
				math={'\\sqrt{\\mu}'}
			/>. A brightness found from <Tex math="N" /> counts is uncertain by <Tex
				math={'1/\\sqrt{N}'}
			/> of itself. To see one part ten per cent brighter than another at five standard deviations,
			<Tex math={'5\\sqrt{N}'} /> must be <Tex math="0.1\,N" />, which takes <Tex
				math={`N = ${COUNTS_PER_ELEMENT}`}
			/> counts in each part.
		</p>
		<p class="note">
			The picture is cut into as many equal parts as the expected count holds 2500s (at most {MOST_TILES.toLocaleString(
				'en-US'
			)} are drawn), and each part shows its own count so far. The rates are the paper’s graviton budget,
			for a detector that collects from every direction; the Earth’s is an upper bound. The exposure and
			the detector’s area are set on logarithmic sliders.
		</p>
	</div>
</div>

<style>
	.graviton-count {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the prediction ----------------------------------------------------------------- */

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
		display: grid;
		gap: 1rem;
		padding: 0.8rem 0.9rem 0.9rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pictures {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 15rem));
		justify-content: center;
		gap: 2rem;
	}

	.panel {
		min-width: 0;
		margin: 0;
	}

	.panel p {
		margin: 0;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
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

	figcaption {
		margin-top: 0.4rem;
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: tabular-nums;
	}

	.levels {
		display: inline-flex;
		gap: 2px;
		margin-left: 0.3rem;
		vertical-align: -0.1rem;
	}

	.levels i {
		display: inline-block;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 2px;
		background: var(--accent);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.line {
		/* the open line lets a finger scroll the page; only the handle takes a drag */
		touch-action: pan-y;
		cursor: ew-resize;
	}

	.band {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.past {
		fill: color-mix(in srgb, var(--accent) 7%, transparent);
	}

	.dot {
		fill: var(--accent);
	}

	.newest {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

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

	.hand {
		stroke: var(--text);
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
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.empty {
		fill: var(--bg-sunken);
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tile {
		fill: var(--accent);
	}

	.edge {
		fill: none;
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: 0.7rem 1.4rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		grid-column: 1 / -1;
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
	}

	.grow {
		flex: 1 1 auto;
		min-width: 0;
	}

	.choice {
		grid-column: 1 / -1;
	}

	.play,
	.redraw {
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
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.play {
		flex: none;
		width: 2.2rem;
		height: 2.2rem;
		margin-top: 0.1rem;
		padding: 0;
	}

	.redraw {
		flex: none;
		margin-top: 0.1rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.play :global(svg),
	.redraw :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover,
		.redraw:hover {
			border-color: var(--accent);
		}
	}

	.play:focus-visible,
	.redraw:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		grid-column: 1 / -1;
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
		.pictures {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.9rem;
		}

		.bar {
			grid-template-columns: minmax(0, 1fr);
		}

		.time {
			flex-wrap: wrap;
		}

		.redraw {
			margin-left: 2.8rem;
		}

		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.redraw {
			transition: none;
		}
	}
</style>
