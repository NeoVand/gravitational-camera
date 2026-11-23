<script lang="ts">
	/**
	 * Chapter 3.6's round opening. (a) The opening, a disc of radius R or a slit of half-width R, in a screen, across a₁
	 * and a₂ in metres. (b) Its pattern across the plane of wavevectors, k₁ and k₂ in m⁻¹, painted pixel by pixel on a
	 * colour scale that is even in OKLab: the normalized amplitude, 2J₁(x)/x or sin x/x with x = kR, or the intensity,
	 * its square; the half height and the first zero are drawn on it. (c) The profile through the centre along k₁, with
	 * the other opening's profile dashed behind it, the full width at half height as a bracket and the first zeros as
	 * dots. The readouts give the half height, the first zero and the first ring in x = kR and in m⁻¹. The numbers come
	 * from ./round-pupil.ts. Two predictions at the top are answered once the reader has done what they ask. Nothing
	 * moves by itself, so reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery, SvelteSet } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CircleIcon,
		Layout3ColumnIcon,
		RulerIcon,
		Sun03Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		A_REACH,
		K_REACH,
		MEASURES,
		OPENING,
		RADIUS,
		SHAPES,
		doubledFrom,
		firstRing,
		firstZero,
		halfPoint,
		lookUp,
		pattern,
		radialTable,
		ramp,
		rungOf,
		snapRadius,
		type Measure,
		type Rgb,
		type Shape
	} from './round-pupil';

	const uid = $props.id();

	// --- the choices: the opening, what is drawn, and the radius ----------------------------------------------------------
	let shape = $state<Shape>(OPENING.shape);
	let measure = $state<Measure>(OPENING.measure);
	let radius = $state<number>(OPENING.radius);
	const other = $derived<Shape>(shape === 'disc' ? 'slit' : 'disc');

	// --- the predictions ------------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** Whether the reader has switched to the intensity while the first prediction was shown. */
	let switched = $state(false);
	/** The radius the reader doubled, once the second prediction is shown and they have doubled one. */
	let doubled = $state<number | undefined>(undefined);
	/** The rungs of the slider visited while the second prediction is shown. */
	let visited = new SvelteSet<number>();
	const revealed = $derived(step === 1 ? switched : doubled !== undefined);

	function goTo(s: 1 | 2) {
		if (s === 2 && step !== 2) visited = new SvelteSet([rungOf(radius)]);
		step = s;
	}

	function setMeasure(m: Measure) {
		measure = m;
		if (m === 'intensity' && step === 1) switched = true;
	}

	function setRadius(v: number) {
		radius = snapRadius(v);
		if (step !== 2) return;
		const from = doubledFrom(visited, radius);
		if (from !== undefined && doubled === undefined) doubled = from;
		visited.add(rungOf(radius));
	}

	// --- the two choices are groups of radio buttons: Tab reaches the chosen one, the arrows move the choice ---------------
	const buttons: Record<string, HTMLButtonElement | undefined> = {};
	const hold =
		(key: string): Attachment<HTMLButtonElement> =>
		(node) => {
			buttons[key] = node;
			return () => (buttons[key] = undefined);
		};

	function radioKeys<T extends string>(list: readonly T[], current: T, set: (v: T) => void) {
		return (e: KeyboardEvent) => {
			const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
			const on = e.key === 'ArrowRight' || e.key === 'ArrowDown';
			if (!back && !on && e.key !== 'Home' && e.key !== 'End') return;
			e.preventDefault();
			const i = list.indexOf(current);
			const next =
				e.key === 'Home'
					? 0
					: e.key === 'End'
						? list.length - 1
						: (i + (on ? 1 : list.length - 1)) % list.length;
			set(list[next]);
			buttons[list[next]]?.focus();
		};
	}

	const SHAPE_NAMES: Record<Shape, { label: string; icon: typeof CircleIcon }> = {
		disc: { label: 'Disc', icon: CircleIcon },
		slit: { label: 'Slit', icon: Layout3ColumnIcon }
	};
	const MEASURE_NAMES: Record<Measure, { label: string; icon: typeof CircleIcon }> = {
		amplitude: { label: 'Amplitude', icon: WaveIcon },
		intensity: { label: 'Intensity', icon: Sun03Icon }
	};

	// --- the numbers ----------------------------------------------------------------------------------------------------
	const half = $derived(halfPoint(shape, measure));
	const zero = $derived(firstZero(shape));
	const ring = $derived(firstRing(shape));
	const kHalf = $derived(half / radius);
	const kZero = $derived(zero / radius);
	const otherHalf = $derived(halfPoint(other, measure));
	const otherZero = $derived(firstZero(other));

	/** x to three decimals, as the chapter gives it: "2.215", "3.832". */
	const x3 = (x: number) => x.toFixed(3);
	/** A wavenumber in m⁻¹ to three figures: "2.22", "11.1". */
	const k3 = (k: number) => k.toPrecision(3);
	/** The radius as the slider prints it: "1.00". */
	const rText = (r: number) => r.toFixed(2);
	/** A negative number with a true minus sign. */
	const minus = (v: number | string) => String(v).replace('-', '−');

	const ampTex: Record<Shape, string> = { disc: '2J_1(x)/x', slit: '\\sin x/x' };
	const shownTex = $derived(
		measure === 'amplitude' ? ampTex[shape] : `\\bigl(${ampTex[shape]}\\bigr)^2`
	);
	const otherTex = $derived(
		measure === 'amplitude' ? ampTex[other] : `\\bigl(${ampTex[other]}\\bigr)^2`
	);
	/** The full width at half height in units of 1/R: "4.43", "3.23". */
	const fullWidth = $derived((2 * half).toFixed(2));
	const zeroTex = $derived(shape === 'disc' ? x3(zero) : `\\pi = ${x3(zero)}`);

	// --- the drawing's bounds: on a phone the panels are narrower and stacked -------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const f1 = (x: number) => x.toFixed(1);

	/** The two square panels, (a) and (b), share one frame. */
	const sq = $derived.by(() => {
		const w = phone.current ? 332 : 328;
		const L = 30;
		const R = w - 8;
		const T = 6;
		const B = T + (R - L);
		return { w, h: B + 24, L, R, T, B };
	});
	const sx = (v: number, reach: number) => sq.L + ((v + reach) / (2 * reach)) * (sq.R - sq.L);
	const sy = (v: number, reach: number) => sq.B - ((v + reach) / (2 * reach)) * (sq.B - sq.T);
	const scale = (v: number, reach: number) => (v / (2 * reach)) * (sq.R - sq.L);

	// --- panel (a): the opening ---------------------------------------------------------------------------------------
	const aTicks = [-2, -1, 0, 1, 2];
	const ax = (a: number) => sx(a, A_REACH);
	const ay = (a: number) => sy(a, A_REACH);
	const rDraw = $derived(scale(radius, A_REACH));

	// --- panel (b): the map, painted on a canvas under the drawing --------------------------------------------------------
	const kTicks = [-10, -5, 0, 5, 10];
	const kx = (k: number) => sx(k, K_REACH);
	const ky = (k: number) => sy(k, K_REACH);
	/** A long slit's pattern lies along k₂ = 0; the band that shows it is this many m⁻¹ to each side of that line. */
	const BAND = 0.55;

	type Palette = { zero: Rgb; positive: Rgb; negative: Rgb };
	let palette = $state<Palette | undefined>();

	function parse(text: string): Rgb | undefined {
		const s = text.trim();
		const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
		if (hex) {
			const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
			return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
		}
		const n = s.match(/[\d.]+/g);
		return n && n.length >= 3 ? [Number(n[0]), Number(n[1]), Number(n[2])] : undefined;
	}

	/** The site's colours, read from its tokens, and read again when the theme changes. */
	const theme: Attachment<HTMLElement> = (node) => {
		const read = () => {
			const css = getComputedStyle(node);
			const get = (name: string) => parse(css.getPropertyValue(name));
			const z = get('--bg-sunken');
			const positive = get('--accent');
			const negative = get('--accent-2');
			if (z && positive && negative) palette = { zero: z, positive, negative };
		};
		read();
		const watch = new MutationObserver(read);
		watch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'class']
		});
		const media = matchMedia('(prefers-color-scheme: light)');
		media.addEventListener('change', read);
		return () => {
			watch.disconnect();
			media.removeEventListener('change', read);
		};
	};

	const colourOf = $derived(
		palette ? ramp(palette.zero, palette.positive, palette.negative) : undefined
	);

	/** The width of the map's drawing on the screen, in CSS pixels. */
	let mapWidth = $state(0);
	const measureMap: Attachment<HTMLElement> = (node) => {
		const seen = new ResizeObserver(() => (mapWidth = node.clientWidth));
		seen.observe(node);
		mapWidth = node.clientWidth;
		return () => seen.disconnect();
	};

	/** The pattern against x, out to the corner of the map at this radius, for the painter to look up. */
	const reachX = $derived(K_REACH * Math.SQRT2 * radius * 1.001);
	const table = $derived(radialTable(shape, measure, reachX, 4096));

	function paint(
		target: HTMLCanvasElement,
		px: number,
		values: Float64Array,
		reach: number,
		r: number,
		which: Shape,
		colour: (v: number) => Rgb
	) {
		const N = Math.max(2, Math.round(px));
		if (target.width !== N) {
			target.width = N;
			target.height = N;
		}
		const context = target.getContext('2d');
		if (!context) return;
		const image = context.createImageData(N, N);
		const data = image.data;
		const ground = colour(0);
		/** Pixels across one m⁻¹, for the band's soft edges. */
		const perK = N / (2 * K_REACH);
		const row = new Array<Rgb>(N);
		if (which === 'slit')
			for (let i = 0; i < N; i++) {
				const k1 = ((i + 0.5) / N) * 2 * K_REACH - K_REACH;
				row[i] = colour(lookUp(values, reach, k1 * r));
			}
		for (let j = 0; j < N; j++) {
			const k2 = K_REACH - ((j + 0.5) / N) * 2 * K_REACH;
			const cover =
				which === 'slit' ? Math.max(0, Math.min(1, (BAND - Math.abs(k2)) * perK + 0.5)) : 1;
			for (let i = 0; i < N; i++) {
				let c: Rgb;
				if (which === 'disc') {
					const k1 = ((i + 0.5) / N) * 2 * K_REACH - K_REACH;
					c = colour(lookUp(values, reach, Math.hypot(k1, k2) * r));
				} else c = row[i];
				const at = 4 * (j * N + i);
				data[at] = ground[0] + (c[0] - ground[0]) * cover;
				data[at + 1] = ground[1] + (c[1] - ground[1]) * cover;
				data[at + 2] = ground[2] + (c[2] - ground[2]) * cover;
				data[at + 3] = 255;
			}
		}
		context.putImageData(image, 0, 0);
	}

	/** Paints the map, and paints it again whenever the opening, the measure, the radius, the colours or the size change. */
	const draw: Attachment<HTMLCanvasElement> = (node) => {
		if (!colourOf || mapWidth <= 0) return;
		const ratio = Math.min(2, window.devicePixelRatio || 1);
		const px = (mapWidth * (sq.R - sq.L) * ratio) / sq.w;
		paint(node, px, table, reachX, radius, shape, colourOf);
	};

	/** The colour bar under the map, drawn with the same ramp: from −0.25 for the amplitude, from 0 for the intensity. */
	const barLow = $derived(measure === 'amplitude' ? -0.25 : 0);
	const barTicks = $derived(measure === 'amplitude' ? [-0.2, 0, 0.5, 1] : [0, 0.5, 1]);
	const barPlace = (v: number) => `${((v - barLow) / (1 - barLow)) * 100}%`;
	const bar = $derived.by(() => {
		if (!colourOf) return 'transparent';
		const stops: string[] = [];
		for (let i = 0; i <= 24; i++) {
			const v = barLow + (i / 24) * (1 - barLow);
			const c = colourOf(v).map(Math.round).join(' ');
			stops.push(`rgb(${c}) ${((i / 24) * 100).toFixed(1)}%`);
		}
		return `linear-gradient(90deg, ${stops.join(', ')})`;
	});

	// --- panel (c): the profile through the centre ----------------------------------------------------------------------
	const sizeC = $derived(phone.current ? { w: 332, h: 200 } : { w: 672, h: 212 });
	const c = $derived({ L: 30, R: sizeC.w - 8, T: 8, B: sizeC.h - 24 });
	const Y_LOW = -0.3;
	const Y_HIGH = 1.08;
	const cx = (k: number) => c.L + ((k + K_REACH) / (2 * K_REACH)) * (c.R - c.L);
	const cy = (v: number) => c.B - ((v - Y_LOW) / (Y_HIGH - Y_LOW)) * (c.B - c.T);
	const heightTicks = [0, 0.5, 1];
	const profileKs = Array.from({ length: 1601 }, (_, i) => -K_REACH + (i / 1600) * 2 * K_REACH);
	const profilePath = (s: Shape) => {
		let d = '';
		for (let i = 0; i < profileKs.length; i++) {
			const k = profileKs[i];
			d += `${i ? 'L' : 'M'}${f1(cx(k))},${f1(cy(pattern(s, measure, k * radius)))}`;
		}
		return d;
	};
	const mainPath = $derived(profilePath(shape));
	const otherPath = $derived(profilePath(other));
	const mainFill = $derived(
		`${mainPath}L${f1(cx(K_REACH))},${f1(cy(0))}L${f1(cx(-K_REACH))},${f1(cy(0))}Z`
	);

	// --- the words for screen readers ------------------------------------------------------------------------------------
	const shapeWords = $derived(
		shape === 'disc'
			? `a disc of radius ${rText(radius)} metres`
			: `a slit of half-width ${rText(radius)} metres`
	);
	const labelA = $derived(
		`The opening, ${shapeWords}, in an opaque screen, drawn across a one and a two from −${A_REACH} to ${A_REACH} metres`
	);
	const labelB = $derived(
		`The ${measure} of its pattern across the plane of wavevectors, k one and k two from −${K_REACH} to ${K_REACH} per metre: ${
			shape === 'disc'
				? `a bright spot with faint rings, the dashed circle at half height, ${k3(kHalf)} per metre from the centre, and the thin circle at the first zero, ${k3(kZero)} per metre`
				: `a band along k two = 0, at half height ${k3(kHalf)} per metre from the centre and first zero at ${k3(kZero)} per metre`
		}`
	);
	const labelC = $derived(
		`The profile through the centre along k one, from −${K_REACH} to ${K_REACH} per metre: the ${shape}'s ${measure}, with the ${other}'s dashed behind it; the full width at half height is ${k3(2 * kHalf)} per metre and the first zeros lie at plus and minus ${k3(kZero)} per metre`
	);
</script>

<div class="round-pupil" {@attach theme}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => goTo(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Switch from amplitude to intensity: will the central spot look narrower or wider at half its
				height?
			{:else}
				Double the radius: what happens to the spot?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Narrower.</strong> Squaring a number between zero and one makes it smaller, so the
				intensity <Tex math="\bigl(2J_1(x)/x\bigr)^2" /> falls to one half sooner than the amplitude
				<Tex math="2J_1(x)/x" />: at <Tex math="x = 1.616" /> instead of <Tex math="2.215" />. The
				full widths at half height are <Tex math="3.23/R" /> against <Tex math="4.43/R" />, so
				measured on the amplitude the same opening’s spot is 1.37 times as wide. The first dark ring
				stays at
				<Tex math="x = 3.832" />, where both are zero.
				<button type="button" class="next" onclick={() => goTo(2)}>Next prediction</button>
			{:else if revealed && doubled !== undefined}
				<strong>It halves.</strong> The pattern depends on <Tex math="k" /> and <Tex math="R" /> only
				through <Tex math="x = kR" />, so each of its features stays at the same <Tex math="x" /> and
				lies at <Tex math="k = x/R" />. From <Tex math={`R = ${rText(doubled)}\\ \\text{m}`} /> to
				<Tex math={`${rText(2 * doubled)}\\ \\text{m}`} /> the {shape}’s first zero moves in from
				<Tex math={`${k3(zero / doubled)}`} /> to <Tex
					math={`${k3(zero / (2 * doubled))}\\ \\text{m}^{-1}`}
				/>, and the full width at half height of its {measure} shrinks from <Tex
					math={k3((2 * half) / doubled)}
				/> to
				<Tex math={`${k3(half / doubled)}\\ \\text{m}^{-1}`} />. A wider opening has a narrower
				pattern, as chapter 2.6’s uncertainty relation says.
			{:else if step === 1}
				The answer appears once you have switched to the intensity.
			{:else}
				The answer appears once you have doubled the radius, for instance from 1 m to 2 m.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="pair">
			<div class="panel">
				<p class="title">
					<span class="letter">(a)</span> The opening, {shape === 'disc'
						? 'a disc of radius'
						: 'a slit of half-width'}
					<Tex math="R" />, across <Tex math="a_1" /> and <Tex math="a_2" /> in metres
				</p>
				<svg viewBox="0 0 {sq.w} {sq.h}" role="img" aria-label={labelA} {@attach fitText()}>
					<defs>
						<clipPath id="{uid}-a">
							<rect x={sq.L} y={sq.T} width={sq.R - sq.L} height={sq.B - sq.T} />
						</clipPath>
					</defs>
					<!-- the screen, and the opening in it -->
					<rect class="screen" x={sq.L} y={sq.T} width={sq.R - sq.L} height={sq.B - sq.T} />
					<g clip-path="url(#{uid}-a)">
						{#if shape === 'disc'}
							<circle class="hole" cx={ax(0)} cy={ay(0)} r={rDraw} />
						{:else}
							<rect
								class="hole"
								x={ax(-radius)}
								y={sq.T - 2}
								width={2 * rDraw}
								height={sq.B - sq.T + 4}
							/>
						{/if}
					</g>
					<line class="axis" x1={sq.L} y1={sq.B} x2={sq.R} y2={sq.B} />
					<line class="axis" x1={sq.L} y1={sq.T} x2={sq.L} y2={sq.B} />
					{#each aTicks as v (v)}
						<line class="tick" x1={ax(v)} y1={sq.B} x2={ax(v)} y2={sq.B + 4} />
						<text class="num" x={ax(v)} y={sq.B + 16} text-anchor="middle">{minus(v)}</text>
						<line class="tick" x1={sq.L - 4} y1={ay(v)} x2={sq.L} y2={ay(v)} />
						<text class="num" x={sq.L - 7} y={ay(v) + 3.8} text-anchor="end">{minus(v)}</text>
					{/each}
					<!-- the radius, from the centre to the edge -->
					<path
						class="radius"
						d="M{f1(ax(0))},{f1(ay(0))}H{f1(ax(radius) - 1)}M{f1(ax(radius) - 6)},{f1(
							ay(0) - 3.5
						)}L{f1(ax(radius) - 1)},{f1(ay(0))}L{f1(ax(radius) - 6)},{f1(ay(0) + 3.5)}"
					/>
					<path class="centre" d="M{f1(ax(0))},{f1(ay(0))}h0" />
					<text class="var" x={ax(radius / 2)} y={ay(0) - 7} text-anchor="middle">R</text>
				</svg>
				<p class="legend">
					<span><i class="key hole"></i>the opening, which lets everything through</span>
					<span><i class="key screen"></i>the screen, which stops everything</span>
				</p>
			</div>

			<div class="panel">
				<p class="title">
					<span class="letter">(b)</span> Its {measure}, <Tex math={shownTex} />, across
					<Tex math="k_1" /> and <Tex math="k_2" /> in <Tex math={`\\text{m}^{-1}`} />
				</p>
				<div class="map" {@attach measureMap}>
					<canvas
						aria-hidden="true"
						style:left="{(sq.L / sq.w) * 100}%"
						style:top="{(sq.T / sq.h) * 100}%"
						style:width="{((sq.R - sq.L) / sq.w) * 100}%"
						style:height="{((sq.B - sq.T) / sq.h) * 100}%"
						{@attach draw}
					></canvas>
					<svg viewBox="0 0 {sq.w} {sq.h}" role="img" aria-label={labelB} {@attach fitText()}>
						<defs>
							<clipPath id="{uid}-b">
								<rect x={sq.L} y={sq.T} width={sq.R - sq.L} height={sq.B - sq.T} />
							</clipPath>
						</defs>
						<rect class="frame" x={sq.L} y={sq.T} width={sq.R - sq.L} height={sq.B - sq.T} />
						<line class="axis" x1={sq.L} y1={sq.B} x2={sq.R} y2={sq.B} />
						<line class="axis" x1={sq.L} y1={sq.T} x2={sq.L} y2={sq.B} />
						{#each kTicks as v (v)}
							<line class="tick" x1={kx(v)} y1={sq.B} x2={kx(v)} y2={sq.B + 4} />
							<text class="num" x={kx(v)} y={sq.B + 16} text-anchor="middle">{minus(v)}</text>
							<line class="tick" x1={sq.L - 4} y1={ky(v)} x2={sq.L} y2={ky(v)} />
							<text class="num" x={sq.L - 7} y={ky(v) + 3.8} text-anchor="end">{minus(v)}</text>
						{/each}
						<g clip-path="url(#{uid}-b)">
							{#if shape === 'disc'}
								<circle class="mark-half" cx={kx(0)} cy={ky(0)} r={scale(kHalf, K_REACH)} />
								<circle class="mark-zero" cx={kx(0)} cy={ky(0)} r={scale(kZero, K_REACH)} />
							{:else}
								{@const reach = scale(BAND, K_REACH) + 12}
								{#each [-1, 1] as side (side)}
									<line
										class="mark-half"
										x1={kx(side * kHalf)}
										y1={ky(0) - reach}
										x2={kx(side * kHalf)}
										y2={ky(0) + reach}
									/>
									<line
										class="mark-zero"
										x1={kx(side * kZero)}
										y1={ky(0) - reach}
										x2={kx(side * kZero)}
										y2={ky(0) + reach}
									/>
								{/each}
							{/if}
						</g>
					</svg>
				</div>
				<div class="colour-bar" aria-hidden="true">
					<i style:background={bar}></i>
					<div class="bar-ticks">
						{#each barTicks as v (v)}
							<span style:left={barPlace(v)}>{minus(v)}</span>
						{/each}
					</div>
				</div>
				<p class="legend">
					<span><i class="key half"></i>half height</span>
					<span
						><i class="key zero"></i>first zero{shape === 'disc'
							? ', the first dark ring'
							: ''}</span
					>
				</p>
			</div>
		</div>

		<div class="panel">
			<p class="title">
				<span class="letter">(c)</span> The profile through the centre, against <Tex math="k_1" /> in
				<Tex math={`\\text{m}^{-1}`} />, in units of its height at the centre
			</p>
			<svg viewBox="0 0 {sizeC.w} {sizeC.h}" role="img" aria-label={labelC} {@attach fitText()}>
				<defs>
					<clipPath id="{uid}-c">
						<rect x={c.L} y={c.T - 4} width={c.R - c.L} height={c.B - c.T + 4} />
					</clipPath>
				</defs>
				<line class="axis" x1={c.L} y1={c.B} x2={c.R} y2={c.B} />
				<line class="axis" x1={c.L} y1={c.T} x2={c.L} y2={c.B} />
				<line class="zero" x1={c.L} y1={cy(0)} x2={c.R} y2={cy(0)} />
				<line class="guide" x1={c.L} y1={cy(0.5)} x2={c.R} y2={cy(0.5)} />
				{#each heightTicks as v (v)}
					<line class="tick" x1={c.L - 4} y1={cy(v)} x2={c.L} y2={cy(v)} />
					<text class="num" x={c.L - 7} y={cy(v) + 3.8} text-anchor="end">{v}</text>
				{/each}
				{#each kTicks as k (k)}
					<line class="tick" x1={cx(k)} y1={c.B} x2={cx(k)} y2={c.B + 4} />
					<text class="num" x={cx(k)} y={c.B + 16} text-anchor="middle">{minus(k)}</text>
				{/each}
				<g clip-path="url(#{uid}-c)">
					<path class="fill" d={mainFill} />
					<path class="other" d={otherPath} />
					<path class="curve-halo" d={mainPath} />
					<path class="curve" d={mainPath} />
				</g>
				<!-- the full width at half height, and the first zeros -->
				<path
					class="bracket"
					d="M{f1(cx(-kHalf))},{f1(cy(0.5) - 5)}v10M{f1(cx(-kHalf))},{f1(cy(0.5))}H{f1(
						cx(kHalf)
					)}M{f1(cx(kHalf))},{f1(cy(0.5) - 5)}v10"
				/>
				{#each [-1, 1] as side (side)}
					<path class="dot" d="M{f1(cx(side * kZero))},{f1(cy(0))}h0" />
				{/each}
			</svg>
			<p class="legend">
				<span
					><i class="key curve"></i><span>the {shape}’s {measure}, <Tex math={shownTex} /></span
					></span
				>
				<span
					><i class="key other"></i><span>the {other}’s, <Tex math={otherTex} />, beside it</span
					></span
				>
				<span
					><i class="key bracket"></i><span
						>the full width at half height, <Tex math={`${fullWidth}/R`} /></span
					></span
				>
				<span
					><i class="key dot"></i><span
						>the first zeros, at <Tex
							math={shape === 'disc' ? `k = \\pm${x3(zero)}/R` : `k = \\pm\\pi/R`}
						/></span
					></span
				>
			</p>
		</div>
	</div>

	<div class="bar">
		<div class="choices">
			<div class="segmented" role="radiogroup" aria-label="The opening">
				{#each SHAPES as s (s)}
					<button
						type="button"
						role="radio"
						aria-checked={shape === s}
						tabindex={shape === s ? 0 : -1}
						onclick={() => (shape = s)}
						onkeydown={radioKeys(SHAPES, shape, (v) => (shape = v))}
						{@attach hold(s)}
					>
						<HugeiconsIcon icon={SHAPE_NAMES[s].icon} size={16} strokeWidth={1.7} />
						{SHAPE_NAMES[s].label}
					</button>
				{/each}
			</div>
			<div class="segmented" role="radiogroup" aria-label="What is drawn">
				{#each MEASURES as m (m)}
					<button
						type="button"
						role="radio"
						aria-checked={measure === m}
						tabindex={measure === m ? 0 : -1}
						onclick={() => setMeasure(m)}
						onkeydown={radioKeys(MEASURES, measure, setMeasure)}
						{@attach hold(m)}
					>
						<HugeiconsIcon icon={MEASURE_NAMES[m].icon} size={16} strokeWidth={1.7} />
						{MEASURE_NAMES[m].label}
					</button>
				{/each}
			</div>
		</div>
		<Slider
			id="{uid}-radius"
			label={shape === 'disc' ? 'Radius' : 'Half-width'}
			icon={RulerIcon}
			min={RADIUS.least}
			max={RADIUS.most}
			step={RADIUS.step}
			bind:value={() => radius, setRadius}
			readout="R = {rText(radius)} m"
			ends={['0.5 m', '2 m']}
			marks={[0.5, 1, 2].map((r) => ({ at: r, label: `R = ${r} m` }))}
			marksHint="the ticks mark 0.5, 1 and 2 m, each twice the last"
		/>
		<p class="hint">
			Choose the opening and what is drawn, and drag the slider. With the keyboard, reach each
			choice and the slider with Tab and use the arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The opening</dt>
				<dd>
					{#if shape === 'disc'}
						<Tex math={`f = 1 \\text{ for } a < R,\\quad R = ${rText(radius)}\\ \\text{m}`} /><span
							class="also"
							>A disc of radius <Tex math="R" /> lets everything through inside and nothing outside.</span
						>
					{:else}
						<Tex
							math={`f = 1 \\text{ for } |a_1| < R,\\quad R = ${rText(radius)}\\ \\text{m}`}
						/><span class="also"
							>A slit of half-width <Tex math="R" /> is an opening on a line: everything passes across
							its width <Tex math="2R" />, and nothing beyond.</span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Its pattern</dt>
				<dd>
					{#if shape === 'disc'}
						<Tex math={`\\tilde f(k) = \\pi R^2\\,\\frac{2J_1(x)}{x},\\quad x = kR`} />
					{:else}
						<Tex math={`\\tilde f(k) = 2R\\,\\frac{\\sin x}{x},\\quad x = kR`} />
					{/if}
					<span class="also">
						{#if measure === 'amplitude'}
							The drawings show the amplitude <Tex math={shownTex} />, the transform divided by its
							value at the centre, {shape === 'disc' ? 'the area' : 'the width'}
							<Tex
								math={shape === 'disc'
									? `\\pi R^2 = ${(Math.PI * radius * radius).toFixed(2)}\\ \\text{m}^2`
									: `2R = ${rText(2 * radius)}\\ \\text{m}`}
							/>.
						{:else}
							The drawings show the intensity <Tex math={shownTex} />, the square of the amplitude{shape ===
							'disc'
								? ': the Airy pattern, which a lens with this opening draws of a star'
								: ''}.
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Half height</dt>
				<dd>
					<Tex
						math={`x = ${x3(half)},\\quad k = ${x3(half)}/R = ${k3(kHalf)}\\ \\text{m}^{-1}`}
					/><span class="also"
						>The {measure} falls here to one half of its height at the centre. The full width at half
						height is <Tex math={`${fullWidth}/R = ${k3(2 * kHalf)}\\ \\text{m}^{-1}`} />.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>First zero</dt>
				<dd>
					<Tex
						math={`x = ${zeroTex},\\quad k = ${shape === 'disc' ? x3(zero) : '\\pi'}/R = ${k3(kZero)}\\ \\text{m}^{-1}`}
					/><span class="also"
						>{#if shape === 'disc'}The first zero of <Tex math="J_1" />: the first dark ring, where
							the amplitude and the intensity are both zero.{:else}The first zero of <Tex
								math="\sin x"
							/> beyond the centre, where the amplitude and the intensity are both zero.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>First ring</dt>
				<dd>
					{#if measure === 'amplitude'}
						<Tex
							math={`x = ${x3(ring.x)},\\quad ${shownTex} = ${minus(ring.amplitude.toFixed(3))}`}
						/>
						<span class="also"
							>Beyond the first zero the amplitude goes negative, and this is its deepest point.</span
						>
					{:else}
						<Tex
							math={`x = ${x3(ring.x)},\\quad ${shownTex} = ${(ring.amplitude ** 2).toFixed(4)}`}
						/>
						<span class="also"
							>The brightest ring is {(100 * ring.amplitude ** 2).toFixed(2)}% of the peak{shape ===
							'disc'
								? ', too faint to show on the map'
								: ''}.</span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Beside it</dt>
				<dd>
					<span class="also"
						>The {other}
						{other === 'disc' ? 'of radius' : 'of half-width'}
						<Tex math="R" />, dashed in (c), falls to half at <Tex math={`x = ${x3(otherHalf)}`} /> and
						is first zero at <Tex
							math={other === 'disc' ? `x = ${x3(otherZero)}` : `x = \\pi = ${x3(otherZero)}`}
						/>. The disc’s pattern reaches its first zero 22% later than the slit’s, and is the
						wider of the two.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The axes of (b) and (c) stay fixed in <Tex math={`\\text{m}^{-1}`} />, so a wider opening
			draws a smaller pattern. The map’s colours change evenly with the value, orange above zero and
			blue below it, in a colour space made so that equal steps look equal; the amplitude’s first
			ring, at
			<Tex math="-0.132" />, shows faintly, and the rings of the disc’s intensity, under 2% of the
			peak, hardly show at all, which is why (c) is drawn beside it. A slit is an opening on a line:
			its pattern varies only across it, along <Tex math="k_1" />, and a long slit sends all of it
			along the one line <Tex math="k_2 = 0" />, which the map draws as a band so that it can be
			seen. The Bessel function <Tex math="J_1(u)" /> comes from its power series below <Tex
				math="u = 12"
			/> and from the far form, carried to more terms, beyond.
		</p>
	</div>
</div>

<style>
	.round-pupil {
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
		display: grid;
		gap: 1rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
	}

	.panel {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.panel p {
		margin: 0;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.3rem !important;
	}

	/* side by side, the two titles keep the same height, so that the drawings line up */
	.pair .title {
		min-height: 2.6em;
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

	/* the map: the canvas under the drawing, placed on its frame */
	.map {
		position: relative;
	}

	.map canvas {
		position: absolute;
		display: block;
	}

	.map svg {
		position: relative;
	}

	.frame {
		fill: none;
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.var {
		fill: var(--text);
		font: italic 400 calc(13px * var(--u, 1)) / 1 var(--font-serif);
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* (a): the screen and the opening */
	.screen {
		fill: color-mix(in srgb, var(--text) 10%, transparent);
	}

	.hole {
		fill: color-mix(in srgb, var(--accent) 30%, var(--bg-raised));
		stroke: var(--accent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.radius {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.centre {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linecap: round;
	}

	/* (b): the half height and the first zero on the map */
	.mark-half,
	.mark-zero {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mark-half {
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.mark-zero {
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.colour-bar {
		margin: 0.15rem 0 0 calc(100% * 30 / 328);
		width: calc(100% * 290 / 328);
	}

	.colour-bar i {
		display: block;
		height: 0.5rem;
		border-radius: 2px;
		border: 1px solid var(--line);
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

	.bar-ticks span:last-child {
		translate: -100% 0;
	}

	/* (c): the profile */
	.fill {
		fill: color-mix(in srgb, var(--accent) 12%, transparent);
	}

	.curve {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.other {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.bracket {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.dot {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(5px * var(--u, 1));
		stroke-linecap: round;
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

	.key.hole,
	.key.screen {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
	}

	.key.hole {
		background: color-mix(in srgb, var(--accent) 30%, var(--bg-raised));
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.key.screen {
		background: color-mix(in srgb, var(--text) 10%, transparent);
	}

	.key.half {
		border-top: 1px dashed var(--text);
	}

	.key.zero {
		border-top: 1px solid color-mix(in srgb, var(--text) 70%, transparent);
	}

	.key.curve {
		border-color: var(--accent);
	}

	.key.other {
		border-top: 1px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.key.bracket {
		height: 0.5rem;
		border: 1px solid var(--text);
		border-width: 0 1px;
		background: linear-gradient(var(--text), var(--text)) center / 100% 1px no-repeat;
	}

	.key.dot {
		width: 0.4rem;
		height: 0.4rem;
		border: 0;
		border-radius: 50%;
		background: var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.choices {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 0.6rem;
	}

	/* the choices, drawn as the site's segmented control */
	.segmented {
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.segmented button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2rem;
		padding: 0.3rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.76rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.segmented button[aria-checked='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.segmented button[aria-checked='true'] :global(svg) {
		color: var(--accent);
	}

	.segmented button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.segmented button[aria-checked='false']:hover {
			color: var(--text);
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

	/* sentences keep the font's own figures and hyphens */
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

		.pair .title {
			min-height: 0;
		}

		.colour-bar {
			margin-left: calc(100% * 30 / 332);
			width: calc(100% * 294 / 332);
		}

		.choices {
			grid-template-columns: minmax(0, 1fr);
		}

		.segmented button {
			gap: 0.3rem;
			padding: 0.3rem 0.25rem;
			white-space: nowrap;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.segmented button {
			transition: none;
		}
	}
</style>
