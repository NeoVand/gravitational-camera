<script lang="ts">
	/**
	 * Chapter 8.6's standard quantum limit, in two panels on an exact engine. Panel 1: two free masses as grey balls,
	 * each with its position's bell at the start, of standard deviation σ₀, and after the time τ, of σ_x(τ) =
	 * √(σ₀² + (ħτ/2mσ₀)²), drawn hugely magnified at a fixed number of pixels per σ_SQL; beside them a small log–log
	 * copy of diagram tut-sql-compromise with a dot that follows the slider. Panel 2: diagram tut-sql-interferometer's
	 * axes with the h_SQL line for 40 kg and 4 km and one grey quantum-noise curve, √(S_shot + S_rp), for the chosen
	 * power, a dot where it touches the line. Every slider is logarithmic. The arithmetic is in ./quantum-limit.ts.
	 * Opens at the optimum for a gram, a second and a centimetre, and on the power P₀ at 100 Hz; two predictions at
	 * the top are answered once the reader has done what each asks. Nothing moves by itself.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		FlashIcon,
		RefreshIcon,
		RulerDimensionLineIcon,
		SineIcon,
		Target02Icon,
		Timer01Icon,
		WeightScaleIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		F0,
		FREQUENCY,
		INSET,
		MASS,
		NOTHING_TRIED,
		OPENING_LIGHT,
		OPENING_MASSES,
		POWER,
		SEPARATION,
		SHARP,
		STRAIN,
		TIME,
		aboutTen,
		compromise,
		hSql,
		hertzWords,
		lengthWords,
		lightReading,
		logSpaced,
		massWords,
		massesReading,
		noise,
		noteFirst,
		noteSecond,
		noteTried,
		powerTex,
		powerWords,
		ratioWords,
		snapLog,
		stepped,
		three,
		timeWords,
		type Range
	} from './quantum-limit';

	const uid = $props.id();

	// --- the settings, each as log₁₀ ------------------------------------------------------------------------------
	let q = $state(OPENING_MASSES.q);
	let m = $state(OPENING_MASSES.m);
	let t = $state(OPENING_MASSES.t);
	let xi = $state(OPENING_MASSES.xi);
	let p = $state(OPENING_LIGHT.p);
	let f = $state(OPENING_LIGHT.f);

	/** A setter for a slider: the value landed on its grid, then the predictions told. */
	function setter(range: Range, set: (v: number) => void) {
		return (v: number) => {
			set(snapLog(v, range));
			note();
		};
	}
	const setQ = setter(SHARP, (v) => (q = v));
	const setM = setter(MASS, (v) => (m = v));
	const setT = setter(TIME, (v) => (t = v));
	const setXi = setter(SEPARATION, (v) => (xi = v));
	const setP = setter(POWER, (v) => (p = v));
	const setF = setter(FREQUENCY, (v) => (f = v));

	function resetMasses() {
		q = OPENING_MASSES.q;
		m = OPENING_MASSES.m;
		t = OPENING_MASSES.t;
		xi = OPENING_MASSES.xi;
		note();
	}
	function resetLight() {
		p = OPENING_LIGHT.p;
		f = OPENING_LIGHT.f;
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
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	/** The powers tried at 100 Hz: one at most P₀/3, one at least 3P₀. */
	let tried = NOTHING_TRIED;
	const revealed = $derived(step === 1 ? first : second);

	function note() {
		first = noteFirst(first, { q, m, t, xi });
		tried = noteTried(tried, { p, f });
		second = noteSecond(second, tried);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const one = $derived(massesReading({ q, m, t, xi }));
	const two = $derived(lightReading({ p, f }));

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel, in panel 1, for the magnification. */
	let u1 = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const path = (pts: { x: number; y: number }[]) =>
		pts.map((r, i) => `${i ? 'L' : 'M'}${f2(r.x)},${f2(r.y)}`).join('');

	/** Pixels of the drawing per σ_SQL, and a bell's peak at σ = σ_SQL; the bells keep unit area. */
	const PER_SQL = 14;
	const PEAK = 34;
	/** The tallest a bell is drawn; a narrower one is cut off there. */
	const TALLEST = 66;

	/** Panel 1's layout: the masses' strip, its two rows, and the inset. */
	const L1 = $derived.by(() => {
		const rows = (second: number) =>
			[
				{ base: 108, time: 'start' },
				{ base: second, time: 'end' }
			] as const;
		// on a phone each spread's words go under its row, at the right; on a wide screen beside the second ball
		if (phone.current)
			return {
				W: 400,
				H: 574,
				x0: 0,
				x1: 400,
				balls: [140, 300],
				rows: rows(226),
				words: { x: 400, dy: 34, anchor: 'end' },
				dim: 282,
				scale: 310,
				inset: { x0: 52, x1: 384, y0: 360, y1: 530, title: 342 }
			};
		return {
			W: 640,
			H: 300,
			x0: 0,
			x1: 404,
			balls: [150, 304],
			rows: rows(214),
			words: { x: 316, dy: 14, anchor: 'start' },
			dim: 252,
			scale: 286,
			inset: { x0: 470, x1: 632, y0: 40, y1: 236, title: 14 }
		};
	});

	/** A bell of σ (in units of σ_SQL) on the base line at x = c, as a fill and a line, held to the strip. */
	function bellPaths(c: number, base: number, s: number) {
		const w = s * PER_SQL;
		const a = Math.max(L1.x0, c - 4.5 * w);
		const b = Math.min(L1.x1, c + 4.5 * w);
		const n = 140;
		const pts = Array.from({ length: n + 1 }, (_, i) => {
			const x = a + ((b - a) * i) / n;
			const z = (x - c) / w;
			return { x, y: base - (PEAK / s) * Math.exp(-0.5 * z * z) };
		});
		// a narrow bell keeps its peak
		if (c > a && c < b) {
			pts.push({ x: c, y: base - PEAK / s });
			pts.sort((r, v) => r.x - v.x);
		}
		const line = path(pts);
		return { line, fill: `${line}L${f2(b)},${base}L${f2(a)},${base}Z`, cut: PEAK / s > TALLEST };
	}

	const bells = $derived(
		L1.rows.map((row) => {
			const s = row.time === 'start' ? one.start : one.end;
			return { row, s, shapes: L1.balls.map((c) => bellPaths(c, row.base, s)) };
		})
	);

	/** How many times the bells are magnified on the screen, near enough: CSS pixels are 1/96 inch. */
	const magnified = $derived(((PER_SQL / u1) * 0.0254) / 96 / one.sql);

	// the inset: log–log, across σ₀/σ_SQL, up σ_x(τ)/σ_SQL
	const I = $derived(L1.inset);
	const ix = (x: number) =>
		I.x0 + ((I.x1 - I.x0) * Math.log10(x / INSET.x[0])) / Math.log10(INSET.x[1] / INSET.x[0]);
	const iy = (y: number) =>
		I.y1 - ((I.y1 - I.y0) * Math.log10(y / INSET.y[0])) / Math.log10(INSET.y[1] / INSET.y[0]);
	const iclipY = (y: number) => Math.max(I.y0, Math.min(I.y1, iy(y)));
	const insetXs = logSpaced(INSET.x[0], INSET.x[1], 160);
	const sumLine = $derived(path(insetXs.map((x) => ({ x: ix(x), y: iclipY(compromise(x)) }))));
	/** The two terms, σ₀ and ħτ/2mσ₀, over σ_SQL: x and 1/2x, held to the inset. */
	const termLine = (g: (x: number) => number) =>
		path(
			insetXs
				.filter((x) => g(x) >= INSET.y[0] && g(x) <= INSET.y[1])
				.map((x) => ({ x: ix(x), y: iy(g(x)) }))
		);
	const startTerm = $derived(termLine((x) => x));
	const kickTerm = $derived(termLine((x) => 1 / (2 * x)));
	const xTicksInset = [0.1, 1, 10];
	const yTicksInset = [1, 10];
	const insetMinor = $derived([0.02, 0.03, 0.05, 0.2, 0.3, 0.5, 2, 3, 5, 20, 30].map((x) => ix(x)));

	// panel 2: log–log, across the frequency, up the strain noise
	const L2 = $derived(
		phone.current
			? { W: 400, H: 300, x0: 52, x1: 372, y0: 30, y1: 244 }
			: { W: 640, H: 290, x0: 62, x1: 596, y0: 30, y1: 236 }
	);
	const fx = (v: number) =>
		L2.x0 + ((L2.x1 - L2.x0) * Math.log10(v / STRAIN.f[0])) / Math.log10(STRAIN.f[1] / STRAIN.f[0]);
	const hy = (v: number) =>
		L2.y1 - ((L2.y1 - L2.y0) * Math.log10(v / STRAIN.h[0])) / Math.log10(STRAIN.h[1] / STRAIN.h[0]);
	const freqs = logSpaced(STRAIN.f[0], STRAIN.f[1], 240);
	const limitLine = $derived(path(freqs.map((v) => ({ x: fx(v), y: hy(hSql(v)) }))));
	const noiseLine = $derived(path(freqs.map((v) => ({ x: fx(v), y: hy(noise(v, two.p)) }))));
	const fMajor = [10, 100, 1000];
	const fMinor = [20, 30, 40, 50, 60, 70, 80, 90, 200, 300, 400, 500, 600, 700, 800, 900];
	const hMajor = [-25, -24, -23, -22];

	/**
	 * The words beside the noise curve: above its flat right end, where nothing else is drawn; when the power is
	 * high and the curve is still falling there, to the right of its steep part, a decade and a half below the top.
	 */
	const noiseLabel = $derived.by(() => {
		if (two.touch < 250)
			return {
				x: L2.x1 - 4,
				y: Math.max(L2.y0 + 22, hy(noise(STRAIN.f[1], two.p)) - 7),
				anchor: 'end'
			};
		// the radiation pressure alone reaches the height h at f = F0·(p/2)^1/4·√(h_SQL(F0)/h)
		const h = 10 ** (Math.log10(STRAIN.h[1]) - 0.6);
		const at = F0 * (two.p / 2) ** 0.25 * Math.sqrt(hSql(F0) / h);
		return { x: fx(at) + 10, y: hy(h) - 2, anchor: 'start' };
	});
	/** h_SQL's name, under its line and ending where it starts, at the end away from the touching point. */
	const limitLabel = $derived.by(() => {
		const at = two.touch < 70 ? 600 : 24;
		return { x: fx(at), y: hy(hSql(at)) + 16 };
	});
	const touchDot = $derived({ x: fx(two.touch), y: hy(hSql(two.touch)) });
	/**
	 * The touching point's words below and to the left of it, under the falling line where nothing else is drawn;
	 * near the left edge below and to the right, low enough to clear the line.
	 */
	const touchLabel = $derived(
		touchDot.x - L2.x0 > 120
			? { x: touchDot.x - 6, y: touchDot.y + 16, anchor: 'end' }
			: { x: touchDot.x + 6, y: touchDot.y + 48, anchor: 'start' }
	);
	const marker = $derived({ x: fx(two.f), noise: hy(two.noise), limit: hy(two.limit) });

	// --- the words --------------------------------------------------------------------------------------------------
	const sql = $derived(powerWords(one.sql));
	const massesDescription = $derived(
		`Two grey balls, free masses of ${massWords(one.m)} each, ${lengthWords(one.xi)} apart (not to scale), drawn at ` +
			`t = 0 and at t = τ = ${timeWords(one.tau)}. Above each ball the bell of its position, magnified about ` +
			`${aboutTen(magnified)} times: at the start of standard deviation σ₀ = ${ratioWords(one.start)} σ_SQL, ` +
			`after τ of σ_x(τ) = ${ratioWords(one.end)} σ_SQL, where σ_SQL = ${sql} m. Inset: the compromise curve, ` +
			`σ_x(τ)/σ_SQL against σ₀/σ_SQL on logarithmic axes, lowest at 1 where σ₀/σ_SQL = 0.707, with a dot at ` +
			`${three(one.start)}, ${three(one.end)}.`
	);
	const lightDescription = $derived(
		`Strain noise against frequency from 10 to 1000 Hz, logarithmic, from 10⁻²⁵ to 10⁻²² Hz^-1/2. The line ` +
			`h_SQL for mirrors of 40 kg and arms of 4 km, falling as 1/f, and the grey quantum noise for the power ` +
			`${three(two.p)} P₀, flat at high frequency and falling as 1/f² at low, touching the line at ` +
			`${hertzWords(two.touch)}. A marker at ${hertzWords(two.f)}, where the noise is ${ratioWords(two.ratio)} ` +
			`times h_SQL.`
	);
	const summary = $derived(
		`σ₀ = ${ratioWords(one.start)} σ_SQL, σ_x(τ) = ${ratioWords(one.end)} σ_SQL. ` +
			`The power ${three(two.p)} P₀ touches the limit at ${hertzWords(two.touch)}; at ${hertzWords(two.f)} ` +
			`the noise is ${ratioWords(two.ratio)} times h_SQL.`
	);
	const metres = (v: number) => `${powerTex(v)}\\,\\mathrm{m}`;
	const perSecond = (v: number) => `${powerTex(v)}\\,\\mathrm{s^{-2}}`;
	const strain = (v: number) => `${powerTex(v)}\\,\\mathrm{Hz^{-1/2}}`;
</script>

<div class="quantum-limit">
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
				Read the first position ten times more sharply than the optimum. Does the final uncertainty
				shrink?
			{:else}
				At 100 Hz, which laser power touches the limit?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No; it grows sevenfold, from the back-action.</strong> With <Tex math="\sigma_0" /> a
				tenth of the best, <Tex
					math={'\\sigma_x(\\tau)/\\sigma_{\\rm SQL} = \\sqrt{1/200 + 50} \\approx 7.07'}
				/>: the first reading’s own term falls a hundredfold, to <Tex math="1/200" />, but the kick
				<Tex math="\hbar/2\sigma_0" /> is ten times harder, and its term grows a hundredfold, to 50. Ten
				times looser gives the same 7.07 the other way round, for every mass and time.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Only <Tex math="P_0" />; any other power is above the line at 100 Hz.</strong>
				Less power raises the shot noise, more raises the radiation pressure. Each power touches the limit
				at one frequency only, where its two noises are equal,
				<Tex math={'f = 100\\,\\mathrm{Hz}\\times\\sqrt{P/P_0}'} />, and more power helps only above
				that frequency, which moves as <Tex math="\sqrt P" />.
			{:else if step === 1}
				The answer appears once you have set <Tex math="\sigma_0" /> to a tenth of the optimum or less.
			{:else}
				The answer appears once you have tried, with the frequency at 100 Hz, a power of at most a
				third of <Tex math="P_0" /> and one of at least three times it.
			{/if}
		</p>
	</section>

	<p class="sr-only" aria-live="polite">{summary}</p>

	<!-- panel 1: the free masses -->
	<section class="panel" aria-label="Two free masses at the standard quantum limit">
		<div class="stage">
			<svg
				viewBox="0 0 {L1.W} {L1.H}"
				role="img"
				aria-label={massesDescription}
				{@attach fitText((value) => (u1 = value))}
			>
				<defs>
					{#each L1.rows as row, i (i)}
						<clipPath id="{uid}-row{i}">
							<rect x={L1.x0} y={row.base - TALLEST} width={L1.x1 - L1.x0} height={TALLEST + 1} />
						</clipPath>
					{/each}
				</defs>
				<text class="title" x="0" y="14">Two free masses of {massWords(one.m)}, read twice</text>

				{#each bells as b, i (i)}
					<text class="small strong start" x={L1.x0} y={b.row.base - 40}
						><tspan class="it">t</tspan> = {#if b.row.time === 'start'}0{:else}<tspan class="it"
								>τ</tspan
							>{/if}</text
					>
					<text class="small dim start" x={L1.x0} y={b.row.base - 26}
						>{b.row.time === 'start' ? 'first reading' : timeWords(one.tau)}</text
					>
					<line class="axis faint" x1={L1.x0} x2={L1.x1} y1={b.row.base} y2={b.row.base} />
					<g clip-path="url(#{uid}-row{i})">
						{#each b.shapes as shape, k (k)}
							<path class="fill" d={shape.fill} />
							<path class="curve" d={shape.line} />
						{/each}
					</g>
					{#each L1.balls as c, k (k)}
						<circle class="ball" cx={c} cy={b.row.base + 10} r="7" />
						{#if b.shapes[k].cut}
							<text class="small dim mid" x={c} y={b.row.base - TALLEST - 4}>cut</text>
						{/if}
					{/each}
					<text
						class="small halo strong {L1.words.anchor}"
						x={L1.words.x}
						y={b.row.base + L1.words.dy}
						>{#if b.row.time === 'start'}<tspan class="it">σ</tspan><tspan class="sub" dy="3"
								>0</tspan
							><tspan dy="-3">&nbsp;= {ratioWords(one.start)}</tspan>{:else}<tspan class="it"
								>σ</tspan
							><tspan class="it sub" dy="3">x</tspan><tspan dy="-3">(</tspan><tspan class="it"
								>τ</tspan
							>) = {ratioWords(one.end)}{/if}<tspan class="dim">&nbsp;σ</tspan><tspan
							class="sub dim"
							dy="3">SQL</tspan
						></text
					>
				{/each}

				<!-- the distance and the scale -->
				<g class="dimension">
					<line x1={L1.balls[0]} x2={L1.balls[1]} y1={L1.dim} y2={L1.dim} />
					<line x1={L1.balls[0]} x2={L1.balls[0]} y1={L1.dim - 4} y2={L1.dim + 4} />
					<line x1={L1.balls[1]} x2={L1.balls[1]} y1={L1.dim - 4} y2={L1.dim + 4} />
				</g>
				<text class="small halo mid" x={(L1.balls[0] + L1.balls[1]) / 2} y={L1.dim - 6}
					><tspan class="it">ξ</tspan> = {lengthWords(one.xi)}, not to scale</text
				>
				<g class="dimension strong-line">
					<line x1={L1.x0} x2={L1.x0 + PER_SQL} y1={L1.scale} y2={L1.scale} />
					<line x1={L1.x0} x2={L1.x0} y1={L1.scale - 4} y2={L1.scale + 4} />
					<line x1={L1.x0 + PER_SQL} x2={L1.x0 + PER_SQL} y1={L1.scale - 4} y2={L1.scale + 4} />
				</g>
				<text class="small start" x={L1.x0 + PER_SQL + 6} y={L1.scale + 4}
					><tspan class="it">σ</tspan><tspan class="sub" dy="3">SQL</tspan><tspan dy="-3"
						>&nbsp;= {sql} m; spreads magnified about {aboutTen(magnified)} times</tspan
					></text
				>

				<!-- the inset: the compromise -->
				<text class="small strong start" x={I.x0 - 40} y={I.title}
					><tspan class="it">σ</tspan><tspan class="it sub" dy="3">x</tspan><tspan dy="-3">(</tspan
					><tspan class="it">τ</tspan>)/<tspan class="it">σ</tspan><tspan class="sub" dy="3"
						>SQL</tspan
					><tspan dy="-3">&nbsp;against&nbsp;</tspan><tspan class="it">σ</tspan><tspan
						class="sub"
						dy="3">0</tspan
					><tspan dy="-3">/</tspan><tspan class="it">σ</tspan><tspan class="sub" dy="3">SQL</tspan
					></text
				>
				{#each insetMinor as x, i (i)}
					<line class="tick" x1={f2(x)} x2={f2(x)} y1={I.y1} y2={I.y1 + 3} />
				{/each}
				{#each xTicksInset as x (x)}
					<line class="grid" x1={f2(ix(x))} x2={f2(ix(x))} y1={I.y0} y2={I.y1} />
					<line class="tick" x1={f2(ix(x))} x2={f2(ix(x))} y1={I.y1} y2={I.y1 + 5} />
					<text class="small dim mid" x={f2(ix(x))} y={I.y1 + 17}>{x}</text>
				{/each}
				{#each yTicksInset as y (y)}
					<line class="tick" x1={I.x0 - 5} x2={I.x0} y1={f2(iy(y))} y2={f2(iy(y))} />
					<text class="small dim end" x={I.x0 - 8} y={f2(iy(y) + 4)}>{y}</text>
				{/each}
				<line class="axis" x1={I.x0} x2={I.x1} y1={I.y1} y2={I.y1} />
				<line class="axis" x1={I.x0} x2={I.x0} y1={I.y0} y2={I.y1} />
				<line class="limit-thin" x1={I.x0} x2={I.x1} y1={f2(iy(1))} y2={f2(iy(1))} />
				<line
					class="tick"
					x1={f2(ix(Math.SQRT1_2))}
					x2={f2(ix(Math.SQRT1_2))}
					y1={I.y1 - 6}
					y2={I.y1}
				/>
				<path class="term" d={startTerm} />
				<path class="term" d={kickTerm} />
				<path class="curve thin" d={sumLine} />
				<circle class="least" cx={f2(ix(Math.SQRT1_2))} cy={f2(iy(1))} r="2.2" />
				{#if first}
					{#each [Math.SQRT1_2 / 10, Math.SQRT1_2 * 10] as x (x)}
						<circle class="open" cx={f2(ix(x))} cy={f2(iy(compromise(x)))} r="3" />
					{/each}
					<text class="small dim halo mid" x={f2(ix(Math.SQRT1_2))} y={f2(iy(7.07) + 4)}>×7</text>
				{/if}
				<circle class="now" cx={f2(ix(one.start))} cy={f2(iy(one.end))} r="4.5" />
				<text class="small dim end" x={I.x1} y={I.y1 + 32}
					><tspan class="it">σ</tspan><tspan class="sub" dy="3">0</tspan><tspan dy="-3">/</tspan
					><tspan class="it">σ</tspan><tspan class="sub" dy="3">SQL</tspan></text
				>
			</svg>

			<ul class="legend" aria-hidden="true">
				<li><span class="ball-key"></span>a free mass</li>
				<li>
					<span class="fill-key"></span>its position’s bell, of unit area, cut off where too tall to
					draw
				</li>
				<li>
					<span class="term-key"></span><span
						>the two terms: the first reading’s <Tex math="\sigma_0" /> and the back-action’s
						<Tex math="\hbar\tau/2m\sigma_0" /></span
					>
				</li>
			</ul>
		</div>

		<div class="bar">
			<div class="groups">
				<div class="slot" onkeydowncapture={sliderKeys(() => q, setQ, SHARP)} role="presentation">
					<Slider
						id="{uid}-sharp"
						label="σ₀ / optimum"
						icon={Target02Icon}
						min={SHARP.min}
						max={SHARP.max}
						step={SHARP.step}
						bind:value={() => q, setQ}
						readout={three(one.r)}
						marks={[
							{ at: -1, label: '0.1, ten times sharper' },
							{ at: 0, label: '1, the optimum, as the figure opens' },
							{ at: 1, label: '10, ten times looser' }
						]}
						marksHint="logarithmic, from 0.03 to 30; the ticks mark 0.1, 1 and 10"
					/>
				</div>
				<div class="slot" onkeydowncapture={sliderKeys(() => m, setM, MASS)} role="presentation">
					<Slider
						id="{uid}-mass"
						label="Mass, m"
						icon={WeightScaleIcon}
						min={MASS.min}
						max={MASS.max}
						step={MASS.step}
						bind:value={() => m, setM}
						readout={massWords(one.m)}
						marks={[
							{ at: -6, label: '1 mg' },
							{ at: -3, label: '1 g, as the figure opens' },
							{ at: 0, label: '1 kg' },
							{ at: 1, label: '10 kg' }
						]}
						marksHint="logarithmic, from 1 mg to 10 kg"
					/>
				</div>
				<div class="slot" onkeydowncapture={sliderKeys(() => t, setT, TIME)} role="presentation">
					<Slider
						id="{uid}-time"
						label="Reading time, τ"
						icon={Timer01Icon}
						min={TIME.min}
						max={TIME.max}
						step={TIME.step}
						bind:value={() => t, setT}
						readout={timeWords(one.tau)}
						marks={[
							{ at: -3, label: '1 ms' },
							{ at: 0, label: '1 s, as the figure opens' },
							{ at: 2, label: '100 s' }
						]}
						marksHint="logarithmic, from 1 ms to 100 s"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => xi, setXi, SEPARATION)}
					role="presentation"
				>
					<Slider
						id="{uid}-xi"
						label="Distance apart, ξ"
						icon={RulerDimensionLineIcon}
						min={SEPARATION.min}
						max={SEPARATION.max}
						step={SEPARATION.step}
						bind:value={() => xi, setXi}
						readout={lengthWords(one.xi)}
						marks={[
							{ at: -3, label: '1 mm' },
							{ at: -2, label: '1 cm, as the figure opens' },
							{ at: -1, label: '10 cm' },
							{ at: 0, label: '1 m' }
						]}
						marksHint="logarithmic, from 1 mm to 1 m"
					/>
				</div>
			</div>
			<div class="controls">
				<button type="button" class="action" onclick={resetMasses}>
					<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
					Back to the opening
				</button>
				<p class="hint">
					Reach each slider with Tab. The arrow keys step σ₀ by a twentieth of a decade and the
					others by a tenth, Shift by a quarter and a half; Home and End go to the ends.
				</p>
			</div>
		</div>

		<div class="readouts">
			<dl>
				<div class="row">
					<dt>The first reading</dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\sigma_0 = ${ratioWords(one.start)}\\,\\sigma_{\\rm SQL} = ${metres(one.sigma0)}`}
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>After the time <Tex math="\tau" /></dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\sigma_x(\\tau) = ${ratioWords(one.end)}\\,\\sigma_{\\rm SQL} = ${metres(one.sigmaX)}`}
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The limit</dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\sigma_{\\rm SQL} = \\sqrt{\\hbar\\tau/m} = ${metres(one.sql)}`}
							/></span
						>
						<span class="also"
							>at the best first reading, <Tex
								math={`\\sqrt{\\hbar\\tau/2m} = ${metres(one.best)}`}
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The tide resolved</dt>
					<dd>
						<span class="eq"
							><Tex math={`2\\sigma_x(\\tau)/\\xi\\tau^2 = ${perSecond(one.one)}`} /></span
						>
						<span class="also">the one-mass estimate</span>
						<span class="eq"
							><Tex
								math={`\\sqrt2\\times2\\sigma_x(\\tau)/\\xi\\tau^2 = ${perSecond(one.two)}`}
							/></span
						>
						<span class="also">for the distance of the two</span>
					</dd>
				</div>
			</dl>
		</div>
	</section>

	<!-- panel 2: the interferometer -->
	<section class="panel" aria-label="The interferometer’s standard quantum limit">
		<div class="stage">
			<svg viewBox="0 0 {L2.W} {L2.H}" role="img" aria-label={lightDescription} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={L2.x0} y={L2.y0} width={L2.x1 - L2.x0} height={L2.y1 - L2.y0} />
					</clipPath>
				</defs>
				<text class="title" x="0" y="14"
					>Strain noise, Hz<tspan class="sup" dy="-4">−1/2</tspan><tspan dy="4"
						>, for mirrors of 40 kg and arms of 4 km</tspan
					></text
				>

				{#each fMinor as v (v)}
					<line class="tick" x1={f2(fx(v))} x2={f2(fx(v))} y1={L2.y1} y2={L2.y1 + 3} />
				{/each}
				{#each fMajor as v (v)}
					<line class="grid" x1={f2(fx(v))} x2={f2(fx(v))} y1={L2.y0} y2={L2.y1} />
					<line class="tick" x1={f2(fx(v))} x2={f2(fx(v))} y1={L2.y1} y2={L2.y1 + 5} />
					<text class="small dim mid" x={f2(fx(v))} y={L2.y1 + 17}>{v}</text>
				{/each}
				{#each hMajor as k (k)}
					<line class="grid" x1={L2.x0} x2={L2.x1} y1={f2(hy(10 ** k))} y2={f2(hy(10 ** k))} />
					<text class="small dim end" x={L2.x0 - 6} y={f2(hy(10 ** k) + 4)}
						>10<tspan class="sup" dy="-5">−{-k}</tspan></text
					>
				{/each}
				<line class="axis" x1={L2.x0} x2={L2.x1} y1={L2.y1} y2={L2.y1} />
				<line class="axis" x1={L2.x0} x2={L2.x0} y1={L2.y0} y2={L2.y1} />
				<text class="small dim end" x={L2.x1} y={L2.y1 + 33}>frequency, Hz</text>

				<!-- the frequency of interest -->
				<line
					class="marker"
					x1={f2(marker.x)}
					x2={f2(marker.x)}
					y1={L2.y1}
					y2={f2(Math.max(L2.y0, marker.noise))}
				/>

				<g clip-path="url(#{uid}-plot)">
					<path class="noise" d={noiseLine} />
					<path class="limit" d={limitLine} />
				</g>
				{#if marker.noise >= L2.y0}
					<circle class="open" cx={f2(marker.x)} cy={f2(marker.noise)} r="3" />
				{/if}
				<text
					class="small halo {marker.x > (L2.x0 + L2.x1) / 2 ? 'end' : 'start'}"
					x={f2(marker.x + (marker.x > (L2.x0 + L2.x1) / 2 ? -6 : 6))}
					y={L2.y0 + 12}
					><tspan class="it">f</tspan> = {hertzWords(two.f)}: {ratioWords(two.ratio)}
					<tspan class="it">h</tspan><tspan class="sub" dy="3">SQL</tspan></text
				>

				<circle class="touch" cx={f2(touchDot.x)} cy={f2(touchDot.y)} r="3.6" />
				<text
					class="small strong halo {touchLabel.anchor}"
					x={f2(touchLabel.x)}
					y={f2(touchLabel.y)}>touches at {hertzWords(two.touch)}</text
				>
				<text class="small strong halo end" x={f2(limitLabel.x)} y={f2(limitLabel.y)}
					><tspan class="it">h</tspan><tspan class="sub" dy="3">SQL</tspan></text
				>
				<text class="small halo {noiseLabel.anchor}" x={f2(noiseLabel.x)} y={f2(noiseLabel.y)}
					><tspan class="it">P</tspan> = {three(two.p)}
					<tspan class="it">P</tspan><tspan class="sub" dy="3">0</tspan></text
				>
			</svg>

			<ul class="legend" aria-hidden="true">
				<li>
					<span class="limit-key"></span><span
						><Tex math={'h_{\\rm SQL} = \\sqrt{8\\hbar/m\\omega^2L^2}'} /></span
					>
				</li>
				<li>
					<span class="noise-key"></span><span
						>the quantum noise <Tex math={'\\sqrt{S_{\\rm shot} + S_{\\rm rp}}'} /></span
					>
				</li>
				<li><span class="dot-key"></span>where the two touch</li>
			</ul>
		</div>

		<div class="bar">
			<div class="groups">
				<div class="slot" onkeydowncapture={sliderKeys(() => p, setP, POWER)} role="presentation">
					<Slider
						id="{uid}-power"
						label="Laser power / P₀"
						icon={FlashIcon}
						min={POWER.min}
						max={POWER.max}
						step={POWER.step}
						bind:value={() => p, setP}
						readout={three(two.p)}
						marks={[
							{ at: -2, label: '0.01' },
							{ at: -1, label: '0.1' },
							{ at: 0, label: '1, as the figure opens' },
							{ at: 1, label: '10' },
							{ at: 2, label: '100' }
						]}
						marksHint="logarithmic, from 0.01 to 100"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => f, setF, FREQUENCY)}
					role="presentation"
				>
					<Slider
						id="{uid}-frequency"
						label="Frequency of interest, f"
						icon={SineIcon}
						min={FREQUENCY.min}
						max={FREQUENCY.max}
						step={FREQUENCY.step}
						bind:value={() => f, setF}
						readout={hertzWords(two.f)}
						marks={[
							{ at: 1, label: '10 Hz' },
							{ at: 2, label: '100 Hz, as the figure opens' },
							{ at: 3, label: '1000 Hz' }
						]}
						marksHint="logarithmic, from 10 to 1000 Hz"
					/>
				</div>
			</div>
			<div class="controls">
				<button type="button" class="action" onclick={resetLight}>
					<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
					Back to the opening
				</button>
				<p class="hint">
					The arrow keys step both sliders by a twentieth of a decade, Shift by a quarter; Home and
					End go to the ends.
				</p>
			</div>
		</div>

		<div class="readouts">
			<dl>
				<div class="row">
					<dt>Touches the limit</dt>
					<dd>
						<span class="eq"><Tex math={`f = ${three(two.touch)}\\,\\mathrm{Hz}`} /></span>
						<span class="also">where the shot noise and the radiation pressure are equal</span>
					</dd>
				</div>
				<div class="row">
					<dt>At {hertzWords(two.f)}</dt>
					<dd>
						<span class="eq"
							><Tex math={`\\sqrt{S_{\\rm shot} + S_{\\rm rp}} = ${strain(two.noise)}`} /></span
						>
						<span class="eq"><Tex math={`h_{\\rm SQL} = ${strain(two.limit)}`} /></span>
					</dd>
				</div>
				<div class="row">
					<dt>The ratio</dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\sqrt{S_{\\rm shot} + S_{\\rm rp}}/h_{\\rm SQL} = ${ratioWords(two.ratio)}`}
							/></span
						>
					</dd>
				</div>
			</dl>
		</div>
	</section>

	<p class="note">
		Exact for a packet with no chirp and for an ideal interferometer: <Tex
			math="\sigma_x(\tau)^2 = \sigma_0^2 + (\hbar\tau/2m\sigma_0)^2"
		/>
		with <Tex math={'\\hbar = 1.0546\\times10^{-34}\\,\\mathrm{J\\,s}'} />; the shot noise
		<Tex math={'S_{\\rm shot} = A/P'} /> and the radiation pressure <Tex
			math={'S_{\\rm rp} = BP/f^4'}
		/>, one-sided, with <Tex math="AB" /> fixed so that their least sum at each frequency is <Tex
			math={'h_{\\rm SQL}^2'}
		/>, and <Tex math="P_0" /> the power that touches at {F0} Hz. The bells are drawn at {PER_SQL} units
		of the drawing per <Tex math={'\\sigma_{\\rm SQL}'} />, whatever the mass and the time, so that
		their widths compare; the masses’ distance is not to scale. The inset’s axes are those of the
		chapter’s diagram, carried down to 0.02 so that the sharpest reading stays on it.
	</p>
</div>

<style>
	.quantum-limit {
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

	/* --- the panels ----------------------------------------------------------------------- */

	.panel + .panel {
		border-top: 1px solid var(--line);
	}

	.stage {
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 640px;
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

	.dim,
	tspan.dim {
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

	tspan.it.sub {
		font-size: 0.86em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the masses: grey balls, ink bells with a pale fill */
	.ball {
		fill: color-mix(in srgb, var(--text) 34%, var(--bg-sunken));
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.fill {
		fill: color-mix(in srgb, var(--text) 11%, transparent);
		stroke: none;
	}

	.curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve.thin {
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.term {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.limit-thin {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.dimension line {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.dimension.strong-line line {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis.faint {
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.least,
	.touch {
		fill: var(--text);
	}

	.now {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.open {
		fill: var(--bg-sunken);
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the interferometer: h_SQL thick ink, the noise thin grey */
	.limit {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2.2px * var(--u, 1));
	}

	.noise {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.marker {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 640px;
		margin: 0.5rem auto 0;
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

	.ball-key {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--text) 34%, var(--bg-sunken));
		border: 0.8px solid color-mix(in srgb, var(--text) 55%, transparent);
	}

	.fill-key {
		flex: none;
		width: 1.1rem;
		height: 0.6rem;
		border-top: 1.4px solid var(--text);
		background: color-mix(in srgb, var(--text) 11%, transparent);
	}

	.term-key,
	.limit-key,
	.noise-key {
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1px dashed color-mix(in srgb, var(--text) 45%, transparent);
	}

	.limit-key {
		border-top: 2.2px solid var(--text);
	}

	.noise-key {
		border-top: 1.3px solid color-mix(in srgb, var(--text) 50%, transparent);
	}

	.dot-key {
		flex: none;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--text);
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
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
