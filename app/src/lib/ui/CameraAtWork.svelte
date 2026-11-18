<script lang="ts">
	/**
	 * "The camera at work" on the locked safe: the readings of an array of pixels with noise, as they would arrive, and
	 * what is computed from them: an image with its uncertainty, a decision with its chance of error, and a list of
	 * what no reading depends on. Every number is from lib/array (the port of reference/gravcam/inversion.py), computed
	 * in a worker from the readings alone; the only thing here that knows the true contents is the label that says so.
	 */
	import {
		GOLD_MASS,
		GOLD_TIDE,
		GRID_EXCESS,
		LAB_NOISE,
		LEFT,
		REDRAWS,
		RIGHT,
		type Contents
	} from '../array/camera';
	import {
		DOUBT,
		GROUND,
		MASS,
		NEGATIVE,
		SQUEEZE,
		STRETCH,
		chance,
		css,
		deviations,
		diverging,
		massWithError,
		odds,
		ratio,
		roundUp,
		shade
	} from '../array/present';
	import type { SafeCamera } from '../array/workbench.svelte';
	import { length, sci, tidal } from './format';
	import HeatMap from './HeatMap.svelte';

	interface Props {
		camera: SafeCamera;
	}

	let { camera }: Props = $props();

	const INSIDE: Record<Contents, string> = {
		'bar-right': 'a gold bar in the right safe',
		'bar-left': 'a gold bar in the left safe',
		sphere: 'a gold sphere in the right safe',
		point: 'a point mass in the right safe',
		nothing: 'nothing in either safe'
	};

	const COMPONENTS = ['xx', 'yy', 'xy', 'xz', 'yz'];

	const shot = $derived(camera.exposure);
	const analysis = $derived(shot?.analysis);
	/** What was in the safe for the exposure on show: the label follows the readings, not the control. */
	const inside = $derived(shot?.request.contents ?? camera.contents);

	/** The five maps of the readings, one a component, each n x n. */
	const maps = $derived.by(() => {
		if (!shot) return [];
		const pixels = shot.readings.length / 5;
		return COMPONENTS.map((name, c) => ({
			name,
			values: Float64Array.from({ length: pixels }, (_, p) => shot.readings[5 * p + c])
		}));
	});
	/** The readings' scale: the largest of them, rounded up. */
	const top = $derived(
		shot ? roundUp(shot.readings.reduce((m, v) => Math.max(m, Math.abs(v)), 0)) : 1
	);
	/** Where one standard deviation of the noise falls along half the scale, 0 to 1. */
	const noiseAt = $derived(shot ? Math.min(1, shot.sigma / top) : 0);

	/** The pixel at the centre of the array, or the nearest to it above and to the right: pixel i * n + j. */
	const central = $derived(shot ? Math.floor(shot.request.n / 2) * (shot.request.n + 1) : 0);

	const reading = (v: number) => diverging(STRETCH, SQUEEZE, v, top);
	const mass = (v: number) => diverging(NEGATIVE, MASS, v, GOLD_MASS);
	const doubt = (v: number) => shade(DOUBT, v / GOLD_MASS);

	const gradient = (...stops: string[]) => `linear-gradient(to right, ${stops.join(', ')})`;
	const READING_SCALE = gradient(css(STRETCH), css(GROUND), css(SQUEEZE));
	const MASS_SCALE = gradient(css(NEGATIVE), css(GROUND), css(MASS));
	const POSITIVE_SCALE = gradient(css(GROUND), css(MASS));
	const DOUBT_SCALE = gradient(css(GROUND), css(DOUBT));

	/** What the two footprint masses say, from the numbers alone. */
	const verdict = $derived.by(() => {
		if (!analysis) return '';
		const { right, left } = analysis.image;
		const clear = ([m, s]: [number, number]) => (s > 0 ? m / s : m > 0 ? Infinity : 0);
		const r = clear(right);
		const l = clear(left);
		const errors = (z: number) => (isFinite(z) ? `${deviations(z)} errors` : 'many errors');
		if (r >= 2 && l >= 2) return 'Both footprints stand more than two errors clear of empty.';
		if (r >= 2)
			return `The right footprint holds mass, ${errors(r)} clear of empty. The left does not.`;
		if (l >= 2)
			return `The left footprint holds mass, ${errors(l)} clear of empty. The right does not.`;
		return 'Neither footprint stands two errors clear of empty. This image cannot say where the gold is.';
	});

	const kg = (v: number) => `${Math.round(v)} kg`;
	const whole = (v: number) => Math.round(v).toLocaleString('en-US');
	const exposures = $derived(camera.tally.right + camera.tally.left);
	/** The SNR at which a difference of d standard deviations at this SNR would be told wrongly once in a thousand. */
	const needed = (d: number) => (shot && d > 0 ? (shot.request.snr * 6.18) / d : Infinity);

	// the image's frame, in centimetres so that the overlay's lettering has an ordinary size: cells 25 cm apart
	// from x = -250 cm, y = 0, each drawn as a square about its node
	const FRAME = { x: -262.5, y: -12.5, w: 525, h: 275 };
	const safes = [LEFT, RIGHT].map((c) => ({ x: 100 * c[0] - 40, y: 0, w: 80, h: 100 }));
	// the cells counted as a safe's: nodes within 45 cm across and up to 60 cm above the gold's centre
	const footprints = [LEFT, RIGHT].map((c) => {
		const first = Math.ceil((c[0] - 0.45 + 2.5) / 0.25 - 1e-9) * 25 - 250;
		const last = Math.floor((c[0] + 0.45 + 2.5) / 0.25 + 1e-9) * 25 - 250;
		const highest = Math.floor((c[1] + 0.6) / 0.25 + 1e-9) * 25;
		return { x: first - 12.5, y: -12.5, w: last - first + 25, h: highest + 25 };
	});
	/** SVG's y runs down: a rectangle given by its lower left corner. */
	const box = (r: { x: number; y: number; w: number; h: number }) => ({
		x: r.x,
		y: -(r.y + r.h),
		width: r.w,
		height: r.h
	});
</script>

<!-- the worker lives as long as the view -->
<section
	class="bench"
	aria-label="The camera at work"
	aria-busy={camera.busy}
	data-snr={shot?.request.snr}
	{@attach () => camera.start()}
>
	<div class="page">
		<header>
			<div>
				<p class="kicker">The camera at work</p>
				<p class="given">
					<strong>Given.</strong> The empty room and the two steel safes are known, and their field is
					taken from every reading. What is left is whatever was put inside.
				</p>
			</div>
			<p class="truth">
				<span>Inside, hidden from the camera</span>
				<strong data-testid="inside">{INSIDE[inside]}</strong>
			</p>
		</header>

		{#if camera.failure}
			<p class="failure">The computation failed: {camera.failure}</p>
		{/if}

		{#if shot && analysis}
			{@const { request, sigma } = shot}
			{@const { decision, image, ambiguities } = analysis}
			<!-- two columns where there is room: 1 and 4 on the left, 2 and 3 on the right; one column in the order 1 to 4 -->
			<div class="panels">
				<div class="column">
					<article class="first" data-testid="readings">
						<h2><span>1</span> Measured</h2>
						<p class="lead">
							It measures the tidal tensor at {request.n * request.n} pixels: five numbers each, {shot
								.readings.length} readings, every one with noise of {tidal(sigma)}.
						</p>
						<div class="maps">
							{#each maps as map (map.name)}
								<figure>
									<HeatMap
										values={map.values}
										cols={request.n}
										rows={request.n}
										colour={reading}
										label="The {map.name} component of the tidal tensor at each pixel"
									/>
									<figcaption><i>E</i><sub>{map.name}</sub></figcaption>
								</figure>
							{/each}
						</div>
						<div class="scale">
							<div class="bar" style:background={READING_SCALE}>
								<i style:left="{50 - 50 * noiseAt}%"></i>
								<i style:left="{50 + 50 * noiseAt}%"></i>
							</div>
							<div class="ends">
								<span>{tidal(-top)}<br />stretch</span>
								<span>0</span>
								<span>{tidal(top, true)}<br />squeeze</span>
							</div>
						</div>
						<dl class="central" data-testid="central">
							<dt>
								{request.n % 2
									? 'The pixel at the centre reads'
									: 'A pixel beside the centre reads'}
							</dt>
							{#each maps as map (map.name)}
								<dd><i>E</i><sub>{map.name}</sub> {tidal(map.values[central], true)}</dd>
							{/each}
						</dl>
						<p class="fine">
							Each map is the array, {length(request.side)} across, seen from behind: <i>x</i> to
							the right, <i>y</i> up, <i>z</i> back toward the camera. The two ticks on the scale
							are the noise, ±{tidal(sigma)}. Exposure {request.seed} at signal-to-noise ratio {ratio(
								request.snr
							)}.
						</p>
						<p class="fine">
							For scale: {kg(GOLD_MASS)} at 3.5 m gives {tidal(GOLD_TIDE)} at most. The best laboratory
							gradiometer resolves {tidal(LAB_NOISE)} in a second: {Math.round(
								GOLD_TIDE / LAB_NOISE
							)} to 1 on that tide in one pixel, and a signal-to-noise ratio of {ratio(shot.labSnr)} for
							this array.
						</p>
					</article>
					<article class="fourth" data-testid="unknowable">
						<h2><span>4</span> Cannot be known</h2>
						<p class="lead">It cannot know what no reading depends on, or depends on too little.</p>
						<ul class="apart">
							<li class={{ now: inside === 'sphere' || inside === 'point' }}>
								<strong data-testid="sphere-point"
									>{deviations(ambiguities.spherePoint)} standard deviations</strong
								>
								between a sphere of gold and a point of the same mass at its centre, at any signal-to-noise
								ratio. The readings are identical: the two computed sets differ by
								{ambiguities.spherePointRelative === 0
									? 'nothing at all'
									: `${sci(ambiguities.spherePointRelative)} of the largest reading, which is rounding`}.
								{#if inside === 'sphere'}
									The sphere is inside now. Put the point in its place and no reading changes.
								{:else if inside === 'point'}
									The point is inside now. Put the sphere in its place and no reading changes.
								{/if}
							</li>
							<li>
								<strong data-testid="bar-point"
									>{deviations(ambiguities.barPoint)} standard deviations</strong
								>
								between the bar and a point of the same mass at its centre. To tell them apart, wrong
								once in a thousand, needs a signal-to-noise ratio of {ratio(
									needed(ambiguities.barPoint)
								)}.
							</li>
							<li>
								<strong>{deviations(ambiguities.goldNone)} standard deviations</strong>
								between the bar in the right safe and no gold at all.
							</li>
						</ul>
						<p class="fine">
							These belong to the array and its noise, not to what is in the safe. Two scenes fewer
							than about six standard deviations apart are confused more often than once in a
							thousand.
						</p>
					</article>
				</div>
				<div class="column">
					<article class="second" data-testid="decision">
						<h2><span>2</span> Computed: a decision</h2>
						<p class="lead">
							Told that a {kg(GOLD_MASS)} bar is in one safe or the other, it chooses the likelier.
						</p>
						<p class="choice" data-testid="choice" data-choice={decision.choice}>
							{#if decision.fit.poor}
								Neither fits the readings
							{:else}
								Gold in the {decision.choice} safe
							{/if}
						</p>
						{#if decision.fit.poor}
							<p class="forced">
								Made to choose, it would say the {decision.choice} safe. But the readings are not those
								of a {kg(GOLD_MASS)} bar in either.
							</p>
						{/if}
						<dl class="facts">
							<div>
								<dt>Wrong, at this signal-to-noise ratio</dt>
								<dd data-testid="error" data-error={decision.error} data-log={decision.errorLog10}>
									{chance(decision.errorLog10)}{decision.error >= 0.000995 ? ' of the time' : ''}
								</dd>
							</div>
							<div>
								<dt>The two possibilities’ readings are</dt>
								<dd data-testid="distance">
									{deviations(decision.distance)} standard deviations apart
								</dd>
							</div>
							<div>
								<dt>This exposure favours its choice by</dt>
								<dd>{odds(decision.logRatio)}</dd>
							</div>
							<div class="whole">
								<dt>Fit of the choice to the readings</dt>
								<dd class={{ poor: decision.fit.poor }} data-testid="fit">
									χ² = {whole(decision.fit.chi2)} for {decision.fit.count} readings{decision.fit
										.poor
										? ', where about ' + decision.fit.count + ' is a fit'
										: ''}
								</dd>
							</div>
							<div>
								<dt>
									{exposures === 1 ? 'The one exposure' : `The ${exposures} exposures`} at these settings
								</dt>
								<dd data-testid="tally">right {camera.tally.right}, left {camera.tally.left}</dd>
							</div>
						</dl>
					</article>
					<article class="third" data-testid="image">
						<h2><span>3</span> Computed: an image</h2>
						<p class="lead">
							{#if analysis.positive}
								It computes the masses, none below zero, that fit the readings best on a grid in the
								plane of the safes, 25 cm apart.
							{:else}
								It computes the mass in each cell of a grid in the plane of the safes, 25 cm apart,
								and how well each is known.
							{/if}
						</p>
						<div class="pair">
							<div>
								<figure>
									<HeatMap
										values={image.mass}
										cols={shot.across}
										rows={shot.up}
										colour={mass}
										label="The mass computed in each cell"
									>
										{@render outlines(false)}
									</HeatMap>
									<figcaption>
										{analysis.positive ? 'Mass, the best positive fit' : 'Mass, the posterior mean'}
									</figcaption>
								</figure>
								<div class="scale">
									<div
										class="bar"
										style:background={analysis.positive ? POSITIVE_SCALE : MASS_SCALE}
									></div>
									<div class="ends">
										{#if analysis.positive}
											<span>0</span><span>{kg(GOLD_MASS)}</span>
										{:else}
											<span>−{kg(GOLD_MASS)}</span><span>0</span><span>+{kg(GOLD_MASS)}</span>
										{/if}
									</div>
								</div>
							</div>
							<div>
								<figure>
									<HeatMap
										values={image.spread}
										cols={shot.across}
										rows={shot.up}
										colour={doubt}
										label="The uncertainty of the mass in each cell"
									>
										{@render outlines(!analysis.positive)}
									</HeatMap>
									<figcaption>
										{analysis.positive
											? `Its spread over ${REDRAWS} redraws of the noise`
											: 'Its uncertainty, one standard deviation'}
									</figcaption>
								</figure>
								<div class="scale">
									<div class="bar" style:background={DOUBT_SCALE}></div>
									<div class="ends">
										<span>0</span>
										<span>{kg(GOLD_MASS)}{analysis.positive ? '' : ', nothing learnt'}</span>
									</div>
								</div>
							</div>
						</div>
						<dl class="masses">
							{#each [['Left safe', 'mass-left', image.left], ['Right safe', 'mass-right', image.right]] as const as [name, id, found] (id)}
								<div>
									<dt>{name}</dt>
									{#if analysis.positive && found[1] === 0}
										<dd data-testid={id}>{kg(found[0])}</dd>
										<dd class="note">the same in all {REDRAWS} redraws</dd>
									{:else}
										<dd data-testid={id}>{massWithError(...found)}</dd>
									{/if}
								</div>
							{/each}
						</dl>
						<p class="verdict" data-testid="verdict">{verdict}</p>
						{#if analysis.positive && image.fit.poor}
							<p class="caution" data-testid="grid-caution">
								At this noise the readings show that the gold is not a set of points on this grid:
								the fit misses them by χ² = {whole(image.fit.chi2)} for {image.fit.count} readings. A
								bar fitted as points comes out about {Math.round(100 * GRID_EXCESS)}% heavy, and the
								error shown, which is the noise’s alone, does not include that.
							</p>
						{/if}
						<p class="fine">
							Solid lines are the safes, dashed lines the cells counted as each safe’s, and the
							cross is straight ahead of the camera.
							{#if analysis.positive}
								The error is the spread of the fit when the noise is drawn again {REDRAWS} times about
								the fitted scene.
							{:else}
								Each cell starts with a prior of 0 ± {kg(GOLD_MASS)}, so a cell at {kg(GOLD_MASS)} of
								uncertainty has learnt nothing, and a cell may come out negative.
							{/if}
						</p>
					</article>
				</div>
			</div>
			<p class="foot">
				Computed in your browser from the readings alone, in {shot.took < 10
					? shot.took.toFixed(1)
					: Math.round(shot.took)} ms, by a port of the paper’s reference implementation.
			</p>
		{:else if !camera.failure}
			<p class="waiting">Taking the first exposure.</p>
		{/if}
	</div>
</section>

{#snippet outlines(pale: boolean)}
	<!-- each line is drawn twice, one tone under the other, so that it reads wherever the map is dark or pale -->
	<svg
		class={{ pale }}
		viewBox="{FRAME.x} {-(FRAME.y + FRAME.h)} {FRAME.w} {FRAME.h}"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		{#each ['under', 'over'] as layer (layer)}
			<g class={layer}>
				{#each footprints as f (f.x)}<rect class="cells" {...box(f)} />{/each}
				{#each safes as s (s.x)}<rect {...box(s)} />{/each}
				<path d="M-9,-150H9M0,-159V-141" />
				<path d="M-240,-240H-140M-240,-247V-233M-140,-247V-233" />
			</g>
		{/each}
		<text x="-128" y="-231">1 m</text>
	</svg>
{/snippet}

<style>
	/* the view covers the picture, and its page scrolls between the title and the dock, clear of the open cards */
	.bench {
		position: absolute;
		inset: 0;
		padding: var(--clear-top, 5rem) var(--clear-right, 1rem) var(--clear-bottom, 5rem)
			var(--clear-left, 1rem);
		/* opaque: nothing of the picture beneath shows through */
		background: #090b10;
		color: var(--text);
		font: 400 0.78rem/1.5 var(--font-sans);
	}

	.page {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: rgb(255 255 255 / 0.18) transparent;
		padding-right: 0.35rem;
		container-type: inline-size;
	}

	.page > * {
		max-width: 68rem;
		margin-inline: auto;
	}

	p {
		margin: 0;
		text-wrap: pretty;
	}

	header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.5rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid rgb(255 255 255 / 0.1);
	}

	.kicker {
		font: 600 0.62rem/1 var(--font-sans);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 0.45rem;
	}

	.given {
		max-width: 38rem;
		color: var(--text-dim);
		font-size: 0.82rem;
	}

	.given strong,
	.lead {
		color: var(--text);
	}

	.truth {
		flex: none;
		display: grid;
		gap: 0.15rem;
		text-align: right;
		font-size: 0.72rem;
	}

	.truth span {
		color: var(--text-faint);
	}

	.truth strong {
		font-weight: 500;
		color: var(--text);
	}

	.panels {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 0.9rem;
	}

	.column {
		display: contents;
	}

	.second {
		order: 2;
	}

	.third {
		order: 3;
	}

	.fourth {
		order: 4;
	}

	@container (min-width: 40rem) {
		.panels {
			flex-direction: row;
			align-items: flex-start;
		}

		.column {
			flex: 1 1 0;
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}
	}

	article {
		min-width: 0;
		padding: 0.85rem 0.95rem 0.95rem;
		border-radius: 12px;
		border: 1px solid rgb(255 255 255 / 0.08);
		background: rgb(255 255 255 / 0.025);
	}

	h2 {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0 0 0.45rem;
		font: 600 0.62rem/1 var(--font-sans);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	h2 span {
		color: var(--accent);
		letter-spacing: 0;
	}

	.lead {
		margin-bottom: 0.75rem;
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.fine {
		margin-top: 0.55rem;
		color: var(--text-faint);
		font-size: 0.7rem;
		line-height: 1.45;
	}

	figure {
		margin: 0;
		min-width: 0;
	}

	figcaption {
		margin-top: 0.3rem;
		color: var(--text-dim);
		font-size: 0.7rem;
		line-height: 1.3;
	}

	/* --- the readings ------------------------------------------------------------- */

	.maps {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.45rem;
	}

	.maps figcaption {
		text-align: center;
		font-family: var(--font-serif);
		font-size: 0.82rem;
		color: var(--text);
	}

	.scale {
		margin-top: 0.6rem;
	}

	.bar {
		position: relative;
		height: 7px;
		border-radius: 2px;
		outline: 1px solid rgb(255 255 255 / 0.12);
	}

	/* the noise, one standard deviation either side of zero */
	.bar i {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 1px;
		background: #fff;
	}

	.ends {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.3rem;
		font: 400 0.68rem/1.3 var(--font-sans);
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.ends span:last-child {
		text-align: right;
	}

	.ends span:nth-child(2):not(:last-child) {
		text-align: center;
	}

	.central {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.4rem, 1fr));
		gap: 0.1rem 0.8rem;
		margin: 0.75rem 0 0;
		font-variant-numeric: tabular-nums;
	}

	.central dt {
		grid-column: 1 / -1;
		color: var(--text-faint);
		font-size: 0.7rem;
	}

	.central dd {
		margin: 0;
		white-space: nowrap;
	}

	.central sub {
		margin-right: 0.3rem;
	}

	/* --- the image ---------------------------------------------------------------- */

	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.7rem;
	}

	.pair > div {
		min-width: 0;
	}

	.pair .scale {
		margin-top: 0.4rem;
	}

	svg rect,
	svg path {
		fill: none;
		vector-effect: non-scaling-stroke;
	}

	.under {
		stroke: rgb(7 9 13 / 0.7);
		stroke-width: 3;
	}

	.over {
		stroke: rgb(255 255 255 / 0.92);
		stroke-width: 1;
	}

	.over .cells {
		stroke-dasharray: 2 2;
	}

	/* on a map that is mostly pale the tones change places */
	.pale .under {
		stroke: rgb(255 255 255 / 0.55);
	}

	.pale .over {
		stroke: rgb(7 9 13 / 0.9);
	}

	svg.pale text {
		fill: #090b10;
		stroke: rgb(255 255 255 / 0.55);
	}

	.under .cells {
		stroke: none;
	}

	svg text {
		fill: #fff;
		stroke: rgb(7 9 13 / 0.8);
		stroke-width: 4px;
		paint-order: stroke;
		font: 500 27px var(--font-sans);
	}

	/* side by side where both fit, one above the other where the figures are long */
	.masses {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.7rem;
		margin: 0.8rem 0 0;
	}

	.masses div {
		flex: 1 1 0;
		min-width: max-content;
	}

	.masses dt,
	.facts dt {
		color: var(--text-faint);
		font-size: 0.7rem;
	}

	.masses dd {
		margin: 0.1rem 0 0;
		font: 500 1.15rem/1.25 var(--font-sans);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.masses dd.note {
		font: 400 0.7rem/1.3 var(--font-sans);
		color: var(--text-faint);
	}

	.verdict {
		margin-top: 0.55rem;
		color: var(--text-dim);
	}

	.caution,
	.failure {
		margin-top: 0.6rem;
		padding: 0.5rem 0.65rem;
		border-left: 2px solid var(--accent);
		background: rgb(232 164 90 / 0.08);
		color: var(--text);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	/* --- the decision --------------------------------------------------------------- */

	.choice {
		font: 400 1.5rem/1.15 var(--font-serif);
		letter-spacing: -0.005em;
		margin-bottom: 0.7rem;
	}

	.forced {
		margin: -0.3rem 0 0.7rem;
		color: var(--text-dim);
	}

	.facts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.45rem 0.9rem;
		margin: 0;
	}

	.facts .whole {
		grid-column: 1 / -1;
	}

	.facts div {
		padding-top: 0.45rem;
		border-top: 1px solid rgb(255 255 255 / 0.07);
	}

	.facts dd {
		margin: 0.05rem 0 0;
		font: 500 0.82rem/1.35 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.facts dd.poor {
		color: var(--accent);
	}

	/* --- what cannot be known --------------------------------------------------------- */

	.apart {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
		color: var(--text-dim);
	}

	.apart li {
		padding-left: 0.7rem;
		border-left: 2px solid rgb(255 255 255 / 0.12);
	}

	.apart li.now {
		border-left-color: var(--accent);
	}

	.apart strong {
		display: block;
		color: var(--text);
		font: 500 0.86rem/1.4 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.foot,
	.waiting {
		margin-top: 0.8rem;
		color: var(--text-faint);
		font-size: 0.68rem;
	}

	@container (max-width: 34rem) {
		header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.6rem;
		}

		.truth {
			text-align: left;
		}
	}
</style>
