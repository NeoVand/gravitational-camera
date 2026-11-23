<script lang="ts">
	/**
	 * Chapter 3.9's positive image. Line masses lie in a row of 40 cells at the depth z below an endless row of
	 * sensors that read the tide −𝓔_zz with white noise: the row-and-line-mass geometry of the paper's Figure
	 * fig:nearfield and of chapters 3.5 and 3.7. The reader places two or three equal masses by dragging (or with the
	 * arrow keys), sets the sensitivity SNR from 10² to 10⁸, and zooms the row of cells in about its middle. Three rows
	 * show the truth, the Gaussian image (chapter 3.5's weight s²/(1 + s²) per ripple) and the positive image
	 * (non-negative least squares on the 40 cells), all from one draw of the noise; the draw stays the same until the
	 * reader asks for a new one, so the picture changes smoothly. The numbers come from ./positive-image.ts. Two
	 * predictions at the top are answered once the reader has done what they ask. Nothing moves by itself, so reduced
	 * motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Add01Icon,
		DiceIcon,
		Radar01Icon,
		Remove01Icon,
		ViewIcon,
		ZoomInAreaIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import { nearFieldBlur } from '../../engine/resolution';
	import {
		CELLS,
		MERGE,
		MODES,
		OPENING,
		bumps,
		cellCentres,
		noiseDraw,
		positiveImage,
		toldApart,
		wienerImage,
		wienerMerge
	} from './positive-image';

	const uid = $props.id();

	// --- the choices --------------------------------------------------------------------------------------------------
	/** The sensitivity, as a power of ten. */
	const LEAST = 2;
	const MOST = 8;
	let decades = $state<number>(OPENING.decades);

	/** The widest row of cells, in depths, and how far the reader may zoom in on it. */
	const WIDEST = OPENING.width;
	const ZOOM_MOST = 30;
	/** The zoom, as a power of ten. */
	let zoomPower = $state(0);
	const width = $derived(WIDEST / 10 ** zoomPower);
	const cellWidth = $derived(width / CELLS);
	const cells = $derived(cellCentres(width));

	/** Where the masses lie along the row, in depths; each is one unit, the mass that SNR refers to. */
	let places = $state<number[]>([-OPENING.separation / 2, OPENING.separation / 2]);
	const masses = $derived(places.map((x) => ({ x, m: 1 })));

	/** The draw of the noise: the opening draw, then a fresh one on request. */
	let seed = $state<number>(OPENING.seed);
	const noise = $derived(noiseDraw(seed));

	/** Keep a place inside the row, half a cell from its ends. */
	const inside = (x: number, w = width) =>
		Math.max(-w / 2 + w / CELLS / 2, Math.min(w / 2 - w / CELLS / 2, x));

	// --- the predictions ------------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The positive image stays hidden until the reader has made the first prediction. */
	let shown = $state(false);
	/** The widest separation at which the reader has seen the positive image merge two masses, at 10³ and at 10⁶. */
	let seen = $state<{ 3: number; 6: number }>({ 3: 0, 6: 0 });
	const revealed = $derived(step === 1 ? shown : seen[3] > 0 && seen[6] > 0);

	// --- the images -----------------------------------------------------------------------------------------------------
	const fit = $derived(positiveImage(cells, masses, decades, noise));
	const SAMPLES = 241;
	const samples = $derived(
		Array.from({ length: SAMPLES }, (_, i) => -width / 2 + (width * i) / (SAMPLES - 1))
	);
	const wiener = $derived(wienerImage(samples, masses, decades, noise));
	const wienerBumps = $derived(bumps(wiener));
	const apart = $derived(toldApart(fit.m, cells, masses));

	/** The closest two masses' separation. */
	const separation = $derived.by(() => {
		let d = Infinity;
		for (let i = 0; i < places.length; i++)
			for (let k = i + 1; k < places.length; k++) d = Math.min(d, Math.abs(places[i] - places[k]));
		return d;
	});
	/** Cells fine enough beside the separation for a merge to be the image's and not the cells'. */
	const fine = $derived(cellWidth <= separation / 4 + 1e-12);

	const filled = $derived(Array.from(fit.m).filter((v) => v > 1e-6).length);
	const held = $derived(Array.from(fit.m).reduce((t, v) => t + v, 0));
	const blur = $derived(nearFieldBlur(decades, 'slice'));
	const wienerPair = $derived(wienerMerge(decades));

	/** After every change: has the reader just seen the positive image merge two masses, with fine cells? */
	function note() {
		if (!shown || places.length !== 2 || apart || !fine) return;
		if (separation >= OPENING.separation - 1e-9) return;
		if (decades === 3) seen[3] = Math.max(seen[3], separation);
		else if (decades === 6) seen[6] = Math.max(seen[6], separation);
	}

	function setDecades(d: number) {
		decades = Math.max(LEAST, Math.min(MOST, Math.round(d * 2) / 2));
		note();
	}

	function setZoom(p: number) {
		zoomPower = Math.max(0, Math.min(Math.log10(ZOOM_MOST), p));
		const w = WIDEST / 10 ** zoomPower;
		places = places.map((x) => inside(x, w));
		note();
	}

	function setPlace(i: number, x: number) {
		places[i] = inside(x);
		note();
	}

	function setCount(n: 2 | 3) {
		if (n === 3 && places.length === 2) {
			// the third mass goes into the widest gap, or beside the others
			const sorted = [...places].sort((a, b) => a - b);
			const edges = [-width / 2, ...sorted, width / 2];
			let best = 0;
			for (let i = 1; i < edges.length; i++)
				if (edges[i] - edges[i - 1] > edges[best + 1] - edges[best]) best = i - 1;
			places = [...places, inside((edges[best] + edges[best + 1]) / 2)];
		} else if (n === 2 && places.length === 3) places = places.slice(0, 2);
		note();
	}

	function newNoise() {
		seed = crypto.getRandomValues(new Uint32Array(1))[0];
		note();
	}

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const W = $derived(phone.current ? 340 : 680);
	const L = 12;
	const R = $derived(W - 12);
	const px = (x: number) => L + ((x + width / 2) / width) * (R - L);
	const f1 = (n: number) => n.toFixed(1);
	const NBSP = '\u00a0';

	/** On a phone the label of the sensors takes two lines, and everything below moves down. */
	const TOP = $derived(phone.current ? 13 : 0);
	const H = $derived(352 + TOP);
	/** The rows: where each title stands and where its zero line runs. */
	const ROWS = $derived({
		truth: { title: 62 + TOP, base: 118 + TOP },
		wiener: { title: 146 + TOP, base: 206 + TOP },
		positive: { title: 232 + TOP, base: 304 + TOP }
	});
	const SENSORS = $derived(26 + TOP);
	/** One mass, drawn as a stem or a bar of this height. */
	const UNIT = 36;
	/** The Gaussian image's peak, drawn this high. */
	const PEAK_HEIGHT = 48;

	const sensors = $derived(Array.from({ length: phone.current ? 25 : 49 }, (_, i) => i));

	const wienerPath = $derived.by(() => {
		let top = 0;
		for (const v of wiener) top = Math.max(top, Math.abs(v));
		const y = (v: number) => ROWS.wiener.base - Math.max(-0.4, Math.min(1, v / top)) * PEAK_HEIGHT;
		return Array.from(wiener, (v, i) => `${i ? 'L' : 'M'}${f1(px(samples[i]))},${f1(y(v))}`).join(
			''
		);
	});
	const wienerFill = $derived(
		`${wienerPath}L${f1(R)},${ROWS.wiener.base}L${f1(L)},${ROWS.wiener.base}Z`
	);

	const bars = $derived(
		Array.from(fit.m, (m, j) => ({ j, m }))
			.filter((b) => b.m > 1e-3)
			.map((b) => {
				const h = Math.min(2.1, b.m) * UNIT;
				return {
					j: b.j,
					x: px(cells[b.j] - cellWidth / 2) + 0.75,
					w: Math.max(1, ((R - L) * cellWidth) / width - 1.5),
					y: ROWS.positive.base - h,
					h
				};
			})
	);

	/** The cells' edges, as short ticks under a row's zero line. */
	const edges = (base: number) => {
		let d = '';
		for (let j = 0; j <= CELLS; j++) d += `M${f1(L + ((R - L) * j) / CELLS)},${base}v3`;
		return d;
	};

	/** Ticks along the row at 1, 2 or 5 times a power of ten, about five of them. */
	const ticks = $derived.by(() => {
		const raw = width / 5;
		const p = 10 ** Math.floor(Math.log10(raw));
		const step = [1, 2, 5, 10].map((k) => k * p).find((s) => s >= raw * 0.8) ?? 10 * p;
		const out: number[] = [];
		for (let k = Math.ceil(-width / 2 / step - 1e-9); k * step <= (width / 2) * (1 + 1e-9); k++)
			out.push(Number((k * step).toPrecision(6)));
		return { step, values: out };
	});
	const tickText = (v: number) => {
		const digits = Math.max(0, -Math.floor(Math.log10(ticks.step) + 1e-9));
		if (v === 0) return '0';
		const t = Math.abs(v).toFixed(digits);
		return v < 0 ? `−${t}` : t;
	};

	// --- dragging the masses, by pointer and by keys ---------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<number | undefined>();

	function placeAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return 0;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return -width / 2 + ((p.x - L) / (R - L)) * width;
	}

	function press(i: number, e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		dragging = i;
	}

	function move(e: PointerEvent) {
		if (dragging !== undefined) setPlace(dragging, placeAt(e));
	}

	function release() {
		dragging = undefined;
	}

	/** The arrow keys move a mass a quarter of a cell, or a whole cell with Shift; Home and End go to the ends. */
	function massKey(i: number, e: KeyboardEvent) {
		const by = e.shiftKey ? cellWidth : cellWidth / 4;
		const to: Record<string, number> = {
			ArrowLeft: places[i] - by,
			ArrowDown: places[i] - by,
			ArrowRight: places[i] + by,
			ArrowUp: places[i] + by,
			Home: -width,
			End: width
		};
		if (!(e.key in to)) return;
		e.preventDefault();
		setPlace(i, to[e.key]);
	}

	// --- the numbers --------------------------------------------------------------------------------------------------
	/** A length in depths to three significant figures: "0.300", "0.0169". */
	const z3 = (x: number) => (x >= 1 ? x.toFixed(2) : x.toPrecision(3));
	const NAMES = ['first', 'second', 'third'];
	const COUNT = [
		'no',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'ten'
	];
	const count = (n: number) => COUNT[n] ?? String(n);
	const factor = (a: number, b: number) => (a / b).toFixed(1);
	const snrTex = $derived(`\\mathrm{SNR} = 10^{${decades}}`);
	const M = '\\htmlClass{q-matter}{m}';
	const TEX = {
		snr: '\\mathrm{SNR}',
		snr3: '\\mathrm{SNR} = 10^3',
		tide: '-\\mathcal{E}_{zz}',
		ratio: 's = \\pi\\,\\mathrm{SNR}\\,q\\,e^{-q}',
		weight: 's^2/(1 + s^2)'
	};
	/** A length in depths, as LaTeX: "0.300\\,z". */
	const len = (x: number) => `${z3(x)}\\,z`;

	const wienerWords = $derived(
		width < blur && wienerBumps <= 1
			? 'one bump, wider than the row'
			: wienerBumps === 1
				? 'one bump'
				: `${count(wienerBumps)} bumps`
	);
	const verdict = $derived.by(() => {
		const all = places.length === 2 ? 'the two masses' : 'all three masses';
		if (apart)
			return `The positive image tells ${all} apart: each has a peak of its own, with empty cells between them.`;
		if (!fine)
			return `The positive image does not tell ${all} apart, but its cells are wider than a quarter of the closest separation. Zoom in until they are narrower, to see whether finer cells part them.`;
		return `The positive image merges the masses: ${places.length === 2 ? 'the two do not each have' : 'not every mass has'} a peak of its own.`;
	});

	const imageLabel = $derived(
		`${places.length} equal masses at ${places.map((x) => z3(x)).join(', ')} depths along the row, at SNR 10 to the ${decades}. The Gaussian image shows ${wienerWords}. ` +
			(shown
				? `The positive image puts mass in ${filled} of the ${CELLS} cells. ${verdict}`
				: 'The positive image is hidden until the first prediction is made.')
	);
</script>

<div class="positive-image">
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
				At <Tex math={TEX.snr3} /> the Gaussian image shows one bump. Will the positive image show two?
			{:else}
				Lower the separation until the positive image merges the two masses, at <Tex math="10^3" /> and
				then at <Tex math="10^6" />. By what factor does that separation shrink?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Yes, almost always.</strong> Over 300 draws of the noise, the positive image gives
				each of two masses <Tex math={len(OPENING.separation)} /> apart a peak of its own in
				{Math.round(OPENING.share * 100)} draws of 100. The Gaussian image cannot: its picture of one
				mass is <Tex math={len(nearFieldBlur(3, 'slice'))} /> wide at half its height, and two equal masses
				make two bumps only beyond <Tex math={len(wienerMerge(3))} />. The Gaussian image keeps only
				the ripples that stand above the noise; the positive image may use every ripple, as long as
				no cell holds negative mass, and the readings then leave room for little but mass near the
				two places.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>About {factor(MERGE[3], MERGE[6])}-fold, not thirtyfold.</strong> Over {MERGE.draws}
				draws of the noise, with cells a sixth of the separation wide, the positive image tells the two
				masses apart in half the draws at <Tex math={len(MERGE[3])} /> at <Tex math="10^3" /> and at
				<Tex math={len(MERGE[6])} /> at <Tex math="10^6" />: {factor(MERGE[3], MERGE[6])} times closer.
				The Gaussian image’s two bumps merge at <Tex math={len(wienerMerge(3))} /> and
				<Tex math={len(wienerMerge(6))} />, only {factor(wienerMerge(3), wienerMerge(6))} times closer.
				Along the whole slider the positive image’s merge separation falls about twofold for each factor
				of ten in sensitivity, close to one over the cube root of <Tex math={TEX.snr} />. That is a
				power law, and in the end it overtakes the slow, logarithmic narrowing of the blur. The
				readings could tell the pair from a single mass at still smaller separations; drawing two
				separate peaks in the right places needs more of the pair’s shape, which the sensors measure
				less well. In your draw of the noise, the widest separations at which you saw the masses
				merge were <Tex math={len(seen[3])} /> and <Tex math={len(seen[6])} />.
			{:else if step === 1}
				Make your prediction, then press <em>Show the positive image</em>.
				<button type="button" class="show" onclick={() => ((shown = true), note())}>
					<HugeiconsIcon icon={ViewIcon} size={15} strokeWidth={1.7} />
					Show the positive image
				</button>
			{:else}
				The answer appears once you have seen the positive image merge two masses brought closer
				than <Tex math={len(OPENING.separation)} />, with cells no wider than a quarter of their
				separation, at <Tex math="10^3" />{seen[3] ? ' (done)' : ''} and at <Tex
					math="10^6"
				/>{seen[6] ? ' (done)' : ''}.{shown ? '' : ' First show the positive image.'}
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {W} {H}"
			role="img"
			aria-label={imageLabel}
			class={{ dragging: dragging !== undefined }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText()}
		>
			<defs>
				<clipPath id="{uid}-clip">
					<rect x={L - 1} y="0" width={R - L + 2} height={H} />
				</clipPath>
			</defs>

			<!-- the row of sensors -->
			{#if phone.current}
				<text class="label" x={L} y="12"
					>A row of sensors reads the tide<tspan class="italic">{NBSP}−𝓔</tspan><tspan
						class="sub"
						dy="3">zz</tspan
					><tspan dy="-3">{NBSP}with noise,</tspan></text
				>
				<text class="label" x={L} y="26"
					>a depth{NBSP}<tspan class="italic">z</tspan><tspan>{NBSP}above the cells</tspan></text
				>
			{:else}
				<text class="label" x={L} y="13"
					>A row of sensors reads the tide<tspan class="italic">{NBSP}−𝓔</tspan><tspan
						class="sub"
						dy="3">zz</tspan
					><tspan dy="-3">{NBSP}with noise, a depth{NBSP}</tspan><tspan class="italic">z</tspan
					><tspan>{NBSP}above the cells</tspan></text
				>
			{/if}
			<line class="sensor-line" x1={L} y1={SENSORS} x2={R} y2={SENSORS} />
			{#each sensors as i (i)}
				<rect
					class="sensor"
					x={L + ((R - L) * (i + 0.5)) / sensors.length - 2}
					y={SENSORS - 2.5}
					width="4"
					height="4"
				/>
			{/each}

			<!-- the true places, carried down through the images -->
			{#each places as x, i (i)}
				<line
					class="guide"
					x1={px(x)}
					y1={ROWS.truth.base}
					x2={px(x)}
					y2={shown ? ROWS.positive.base : ROWS.wiener.base}
				/>
			{/each}

			<!-- the truth -->
			<text class="title" x={L} y={ROWS.truth.title}>The truth</text>
			<text class="note-text" x={R} y={ROWS.truth.title} text-anchor="end"
				>{places.length === 2 ? 'two' : 'three'} equal masses</text
			>
			<line class="zero" x1={L} y1={ROWS.truth.base} x2={R} y2={ROWS.truth.base} />
			<path class="edges" d={edges(ROWS.truth.base)} />

			<!-- the Gaussian image -->
			<text class="title" x={L} y={ROWS.wiener.title}>The Gaussian image</text>
			<text class="note-text" x={R} y={ROWS.wiener.title} text-anchor="end"
				>{phone.current ? wienerWords : `${wienerWords}, drawn to its own peak`}</text
			>
			<g clip-path="url(#{uid}-clip)">
				<path class="wiener-fill" d={wienerFill} />
				<path class="wiener" d={wienerPath} />
			</g>
			<line class="zero" x1={L} y1={ROWS.wiener.base} x2={R} y2={ROWS.wiener.base} />

			<!-- the positive image -->
			<text class="title" x={L} y={ROWS.positive.title}>The positive image</text>
			{#if shown}
				<text class="note-text" x={R} y={ROWS.positive.title} text-anchor="end"
					>{apart
						? places.length === 2
							? 'told apart'
							: 'all told apart'
						: fine
							? 'merged'
							: 'cells too wide to judge'}</text
				>
				{#each bars as b (b.j)}
					<rect class="bar" x={b.x} y={b.y} width={b.w} height={b.h} />
				{/each}
			{:else}
				<rect
					class="veil"
					x={L}
					y={ROWS.positive.title + 10}
					width={R - L}
					height={ROWS.positive.base - ROWS.positive.title - 14}
					rx="6"
				/>
				<text
					class="note-text"
					x={(L + R) / 2}
					y={(ROWS.positive.title + ROWS.positive.base) / 2 + 6}
					text-anchor="middle">Hidden until you make the first prediction</text
				>
			{/if}
			<line class="zero" x1={L} y1={ROWS.positive.base} x2={R} y2={ROWS.positive.base} />
			<path class="edges" d={edges(ROWS.positive.base)} />

			<!-- the row's scale, in depths -->
			{#each ticks.values as v (v)}
				<line
					class="tick"
					x1={px(v)}
					y1={ROWS.positive.base + 8}
					x2={px(v)}
					y2={ROWS.positive.base + 12}
				/>
				<text class="num" x={px(v)} y={ROWS.positive.base + 24} text-anchor="middle"
					>{tickText(v)}</text
				>
			{/each}
			<text class="label" x={R} y={H - 4} text-anchor="end"
				>place along the row, in depths <tspan class="italic">z</tspan></text
			>

			<!-- the masses, on top: dragged, or moved with the arrow keys -->
			{#each places as x, i (i)}
				<g
					class="mass"
					transform="translate({f1(px(x))} {ROWS.truth.base})"
					role="slider"
					tabindex="0"
					aria-label="The {NAMES[i]} mass"
					aria-orientation="horizontal"
					aria-valuemin={-width / 2}
					aria-valuemax={width / 2}
					aria-valuenow={Number(x.toFixed(5))}
					aria-valuetext="{z3(Math.abs(x))} depths {x < 0 ? 'left of' : 'right of'} the middle"
					onpointerdown={(e) => press(i, e)}
					onkeydown={(e) => massKey(i, e)}
				>
					<line class="stem" x1="0" y1="0" x2="0" y2={-UNIT} />
					<circle class="hit" cy={-UNIT} r="15" />
					<circle class="focus" cy={-UNIT} r="10" />
					<circle class="dot" cy={-UNIT} r="5.5" />
				</g>
			{/each}
		</svg>
		<p class="verdict" aria-live="polite">
			The Gaussian image shows {wienerWords}.
			{#if shown}{verdict}{/if}
		</p>
	</div>

	<div class="bar-controls">
		<div class="sliders">
			<Slider
				id="{uid}-snr"
				label="Sensitivity"
				icon={Radar01Icon}
				min={LEAST}
				max={MOST}
				step={0.5}
				bind:value={() => decades, setDecades}
				readout="SNR = 10{superscript(decades)}"
				ends={['10²', '10⁸']}
				marks={[3, 6].map((d) => ({
					at: d,
					label: `SNR = 10${superscript(d)}, in the predictions`
				}))}
				marksHint="the ticks mark the two sensitivities of the predictions"
			/>
			<Slider
				id="{uid}-zoom"
				label="Zoom"
				icon={ZoomInAreaIcon}
				min={0}
				max={Math.log10(ZOOM_MOST)}
				step={0.01}
				bind:value={() => zoomPower, setZoom}
				readout="cells {z3(cellWidth)} z wide"
				ends={['× 1', `× ${ZOOM_MOST}`]}
			/>
		</div>
		<div class="row-controls">
			<p class="hint">
				Drag a mass, or reach it with Tab and move it with the arrow keys: a quarter of a cell at a
				time, a whole cell with Shift. Zooming in about the middle keeps the masses inside the row.
			</p>
			<div class="buttons">
				<button type="button" class="button" onclick={() => setCount(places.length === 2 ? 3 : 2)}>
					{#if places.length === 2}
						<HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.7} />
					{:else}
						<HugeiconsIcon icon={Remove01Icon} size={16} strokeWidth={1.7} />
					{/if}
					{places.length === 2 ? 'Add a third mass' : 'Remove the third mass'}
				</button>
				<button type="button" class="button" onclick={newNoise}>
					<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
					New noise
				</button>
			</div>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Sensitivity</dt>
				<dd>
					<Tex math={snrTex} /><span class="also"
						>the peak tide of one mass is <Tex math={`10^{${decades}}`} />
						times the noise of a reading averaged along a length <Tex math="z" /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Separation</dt>
				<dd>
					<Tex math={`d = ${z3(separation)}\\,z`} /><span class="also"
						>{places.length === 2
							? 'between the two masses'
							: 'between the closest two of the three masses'}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Cells</dt>
				<dd>
					<span>each <Tex math={len(cellWidth)} /> wide</span><span class="also"
						>the {CELLS} cells span <Tex math={len(width)} />, centred under the middle of the row
						of sensors</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Gaussian image</dt>
				<dd>
					<span>the picture of one mass is <Tex math={len(blur)} /> wide at half its height</span
					><span class="also"
						>two equal masses make two bumps beyond <Tex math={len(wienerPair)} /></span
					>
				</dd>
			</div>
			{#if shown}
				<div class="row">
					<dt>Positive image</dt>
					<dd>
						<span>{held.toFixed(2)} masses in {count(filled)} of the {CELLS} cells</span><span
							class="also"
							>misfit <Tex trust math={`|\\mathbf y - A${M}|^2 = ${Math.round(fit.misfit)}`} />,
							against
							{2 * MODES} on average for the true masses</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			Each mass is a line mass of one unit, at the depth <Tex math="z" /> below an endless row of sensors
			that read the tide <Tex math={TEX.tide} />. <Tex math={TEX.snr} /> is the peak tide of one mass
			over the noise of a reading averaged along a length <Tex math="z" />, as in chapter 3.7. The
			readings are taken as {MODES} ripples, each read twice (its cosine and its sine), with white noise;
			a ripple of fineness <Tex math="q = kz" /> stands above its noise by <Tex math={TEX.ratio} />.
			The Gaussian image keeps each ripple with the weight <Tex math={TEX.weight} />. The positive
			image is the list of cell masses <Tex trust math={`${M}_j \\ge 0`} /> that makes the misfit least
			(non-negative least squares), found exactly by the active-set method of Lawson and Hanson. Both
			images come from the same draw of the noise, which stays until you ask for a new one.
		</p>
		<p class="note">
			A mass counts as told apart when the positive image has a peak of its own near it: a run of
			filled cells, with empty cells on each side, that holds at least a quarter of a mass and whose
			centre lies within a quarter of the separation from it. The bars of the positive image and the
			stems of the truth are drawn to one scale; the Gaussian image is drawn to its own peak.
		</p>
	</div>
</div>

<style>
	.positive-image {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		--mass: var(--q-matter);
		--wiener: var(--accent);
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
	.show:focus-visible,
	.button:focus-visible {
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

	.show,
	.button {
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

	.show {
		display: flex;
		margin-top: 0.5rem;
	}

	.show :global(svg),
	.button :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.show:hover,
		.button:hover {
			border-color: var(--accent);
		}
	}

	/* --- the drawing ------------------------------------------------------------------------ */

	.stage {
		padding: 0.8rem 0.9rem 0.75rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.dragging {
		cursor: grabbing;
	}

	.title {
		fill: var(--text);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.label,
	.note-text {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.italic {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(12px * var(--u, 1));
		fill: var(--text);
	}

	.sub {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(8.5px * var(--u, 1));
		fill: var(--text);
	}

	.sensor-line {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.sensor {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.edges,
	.tick {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.guide {
		stroke: color-mix(in srgb, var(--mass) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.wiener {
		fill: none;
		stroke: var(--wiener);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.wiener-fill {
		fill: color-mix(in srgb, var(--wiener) 14%, transparent);
	}

	.bar {
		fill: color-mix(in srgb, var(--mass) 55%, transparent);
		stroke: var(--mass);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.veil {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
		stroke: color-mix(in srgb, var(--text) 25%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.mass {
		cursor: grab;
		touch-action: none;
		outline: none;
	}

	.stem {
		stroke: var(--mass);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.dot {
		fill: var(--mass);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.mass:focus-visible .focus {
		opacity: 1;
	}

	.verdict {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		line-height: 1.45;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem 1.2rem;
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

	.buttons {
		flex: none;
		display: flex;
		gap: 0.5rem;
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
		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row-controls {
			flex-wrap: wrap;
		}

		.buttons {
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
		.show,
		.button {
			transition: none;
		}
	}
</style>
