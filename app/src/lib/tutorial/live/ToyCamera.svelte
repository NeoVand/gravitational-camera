<script lang="ts">
	/**
	 * Chapter 3.4's camera of three pixels. Three pixels in a row, 1 m apart, read d = −ℰ_zz above three masses in a
	 * row 1 m below them, a distance δ apart, the middle one under the middle pixel. The singular value decomposition
	 * of the design matrix A (./toy-camera.ts) splits the camera into three patterns. Each is drawn in a column: the
	 * scene pattern v_i as signed bars under the masses, which are drawn to scale, and above the pixels the readings
	 * A v_i = s_i u_i that one kilogram of it gives, with the noise ±σ_n as a band. Beside them, the three gains s_i on
	 * a logarithmic scale, the noise as a line across them. A prediction at the top is answered once the reader has
	 * brought the masses closer than 0.25 m. Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowHorizontalIcon, AudioWaveformIcon, Undo02Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import {
		CLOSEST,
		CROWDED,
		FARTHEST,
		LOUDEST,
		NOISES,
		OPENING,
		PIXELS,
		QUIETEST,
		SPACINGS,
		TABLE,
		UNIT,
		decompose,
		design,
		gainText,
		masses,
		secondLaw,
		snap,
		spacingText,
		stepRung,
		thirdLaw
	} from './toy-camera';

	const uid = $props.id();

	// --- the choices: the spacing of the masses and the noise --------------------------------------------------------
	let delta = $state<number>(OPENING.delta);
	let noise = $state<number>(OPENING.noise);

	// --- the prediction: answered once the masses have been brought closer than 0.25 m --------------------------------
	let revealed = $state(false);

	type Which = 'delta' | 'noise';
	function set(which: Which, v: number) {
		if (which === 'delta') {
			delta = snap(v, CLOSEST, FARTHEST);
			if (delta < CROWDED) revealed = true;
		} else noise = snap(v, QUIETEST, LOUDEST);
	}

	function reset() {
		delta = OPENING.delta;
		noise = OPENING.noise;
	}

	/** The arrow keys step one value of two figures at a time; the page keys ten. */
	function keys(which: Which) {
		const ladder = which === 'delta' ? SPACINGS : NOISES;
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
			const now = which === 'delta' ? delta : noise;
			if (e.key in by) {
				e.preventDefault();
				set(which, stepRung(ladder, now, by[e.key]));
			} else if (e.key === 'Home' || e.key === 'End') {
				e.preventDefault();
				set(which, e.key === 'Home' ? ladder[0] : ladder[ladder.length - 1]);
			}
		};
	}

	// --- the camera ---------------------------------------------------------------------------------------------------
	const patterns = $derived(decompose(delta));
	const matrix = $derived(design(delta));
	const opening = decompose(FARTHEST);
	const places = $derived(masses(delta));
	const above = $derived(patterns.map((p) => p.s > noise));

	// --- the drawing: on a wide screen the gains beside the three columns, with the rows named on the left; on a
	// phone the gains above the columns, the rows named in the legend ------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);

	/** The vertical places of one column, from its top `py`: `k` drawing units per G/z³ in the readings, `V` per unit
	 * of a pattern's entry, and `metre` along the row and down to the masses, so that the camera is drawn to scale. */
	function rows(py: number, k: number, V: number, metre: number) {
		const zero = py + 30 + 3.5 * k;
		const pix = zero + 1.5 * k + 13;
		const mass = pix + metre;
		const fan = mass + 22;
		const vZero = fan + 4 + 0.85 * V;
		return { head: py + 13, zero, pix, mass, fan, vZero, k, V, metre, bottom: vZero + 0.85 * V };
	}

	const L = $derived(
		phone.current
			? {
					W: 340,
					H: 388,
					gutter: false,
					cols: [0, 114, 228].map((x) => x + 56),
					r: rows(194, 9, 22, 36),
					bar: 10,
					g: {
						head: 13,
						left: 0,
						axis: 44,
						top: 30,
						bottom: 146,
						bars: [104, 172, 240],
						w: 18,
						name: 162,
						value: 176
					}
				}
			: {
					W: 680,
					H: 232,
					gutter: true,
					cols: [0, 142, 284].map((x) => x + 54 + 69),
					r: rows(0, 11, 26, 46),
					bar: 12,
					g: {
						head: 13,
						left: 496,
						axis: 526,
						top: 30,
						bottom: 196,
						bars: [545, 584, 623],
						w: 16,
						name: 211,
						value: 225
					}
				}
	);
	const viewBox = $derived(`0 0 ${L.W} ${L.H}`);

	/** The gains' scale: 10⁻⁴ at the bottom to 10 at the top. */
	const LOW = -4;
	const HIGH = 1;
	const gy = (s: number) =>
		L.g.bottom - ((Math.log10(s) - LOW) / (HIGH - LOW)) * (L.g.bottom - L.g.top);
	const decades = Array.from({ length: HIGH - LOW + 1 }, (_, i) => LOW + i);
	const decadeText = (e: number) =>
		e === 0 ? '1' : e === 1 ? '10' : e === -1 ? '0.1' : `10${superscript(e)}`;

	/** A signed bar from the zero line `y0`: its top and height. */
	const signedBar = (y0: number, value: number, scale: number) => {
		const h = Math.abs(value) * scale;
		return { y: value >= 0 ? y0 - h : y0, h };
	};

	/** Each column: the pixels, the masses and the bars, in drawing units. */
	const columns = $derived(
		patterns.map((p, i) => {
			const cx = L.cols[i];
			const m = L.r.metre;
			const px = PIXELS.map((x) => cx + x * m);
			const mx = places.map((x) => cx + x * m);
			return {
				cx,
				px,
				mx,
				readings: p.readings.map((r, j) => ({
					x: px[j],
					sign: r >= 0 ? 'up' : 'down',
					...signedBar(L.r.zero, r, L.r.k)
				})),
				scene: p.v.map((v, j) => ({
					x: px[j],
					sign: v >= 0 ? 'up' : 'down',
					...signedBar(L.r.vZero, v, L.r.V)
				}))
			};
		})
	);

	/** The masses' dots, smaller when they crowd together, so that they never overlap. */
	const dot = $derived(Math.min(3.2, 0.42 * delta * L.r.metre));

	// --- the numbers ---------------------------------------------------------------------------------------------------
	/** An entry to two decimals, with a true minus sign in the text and none on a zero. */
	const entry = (x: number, digits = 2) => {
		const s = x.toFixed(digits);
		return Number(s) === 0 ? '0' : s;
	};
	const list = (v: readonly number[], digits = 2) =>
		`(${v.map((x) => entry(x, digits)).join(',\\ ')})`;
	const matrixTex = $derived(
		`A = \\begin{pmatrix} ${matrix.map((row) => row.map((x) => entry(x, 3)).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`
	);
	const dText = $derived(spacingText(delta));
	/** The noise as the slider stops: "0.050", "0.0012", "1.0". */
	const noiseText = $derived(noise.toPrecision(2));

	/** A positive number to two figures, as LaTeX: "0.022", "2.4", "35", "3.3 \\times 10^{-12}". */
	function texFig(x: number) {
		if (x >= 1e-3 && x < 1e4) return x >= 10 ? String(Math.round(x)) : x.toPrecision(2);
		const e = Math.floor(Math.log10(x));
		const m = (x / 10 ** e).toFixed(1);
		return Number(m) >= 10 ? `1.0 \\times 10^{${e + 1}}` : `${m} \\times 10^{${e}}`;
	}

	const lost = $derived(patterns.map((p, i) => ({ i, p })).filter(({ i }) => !above[i]));
	const kept = $derived(patterns.map((p, i) => ({ i, p })).filter(({ i }) => above[i]));
	const names = (xs: { i: number }[]) =>
		xs.length === 1
			? `Pattern ${xs[0].i + 1}`
			: `Patterns ${xs
					.map((x) => x.i + 1)
					.join(', ')
					.replace(/, (\d)$/, ' and $1')}`;

	/** The noise each lost pattern is found with, σ_n/s_i, as LaTeX. */
	const lostTex = $derived(lost.map(({ i, p }) => `\\sigma_n/s_${i + 1} = ${texFig(noise / p.s)}`));

	/** G/z³ in s⁻² per kilogram, and what one kilogram of a pattern means, as LaTeX. */
	const UNIT_TEX = 'G/z^3 = 6.7\\times10^{-11}\\,\\mathrm{s^{-2}}';
	const ENTRY_TEX = "A_{ab} = g_z(x_a - x'_b)";
	const AMOUNT_TEX = '\\mathbf v_i^{\\mathsf T}\\mathbf m = 1';

	const description = $derived(
		`Three pixels 1 metre apart above three masses 1 metre down and ${dText} metres apart. ` +
			patterns
				.map(
					(p, i) =>
						`Pattern ${i + 1}, masses ${p.v.map((x) => entry(x)).join(', ')}, has the gain ${gainText(p.s)} and gives the readings ${p.readings.map((x) => entry(x)).join(', ')}`
				)
				.join('. ') +
			`. The noise is ${noiseText}; ${kept.length} of the three gains stand above it.`
	);
</script>

<div class="toy-camera">
	<section class="predict" aria-labelledby="{uid}-predict">
		<span class="tag" id="{uid}-predict">Predict</span>
		<p class="question">Which gain falls fastest as the masses crowd together?</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed}
				<strong>The third.</strong> As the masses crowd together the second gain falls in proportion
				to <Tex math="\delta" /> and the third in proportion to <Tex math="\delta^2" />. As
				<Tex math="\delta" /> shrinks from 0.25 m to 0.1 m, two and a half times, the second gain falls
				from 0.43 to 0.16, about 2.7 times, and the third from 0.14 to 0.021, about 6.7 times, close to
				<Tex math="2.5^2 = 6.25" />. The second pattern moves mass from one side to the other, and
				the pixels see it through the slope of the kernel <Tex math="g_z" />, which changes the
				readings in proportion to <Tex math="\delta" />. The third sets the middle against the two
				sides, and the pixels see it only through the kernel’s curvature, in proportion to
				<Tex math="\delta^2" />: chapter 3.3’s two masses, which differ from one by a signal that
				grows as the square of their separation. The first gain grows, toward 3.49, three kilograms
				in one place.
			{:else}
				The answer appears once you have moved the masses closer together than 0.25 m.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg {viewBox} role="img" aria-label={description} {@attach fitText()}>
			<!-- the rows, named on the left of a wide drawing -->
			{#if L.gutter}
				<text class="row-name" x="50" y={L.r.zero} dy="0.35em">readings</text>
				<text class="row-name" x="50" y={L.r.pix} dy="0.35em">pixels</text>
				<text class="row-name" x="50" y={L.r.mass - 6} dy="0.35em">masses,</text>
				<text class="row-name" x="50" y={L.r.mass + 7} dy="0.35em">1 m down</text>
				<text class="row-name" x="50" y={L.r.vZero} dy="0.35em">pattern</text>
			{/if}

			{#each columns as c, i (i)}
				<g class={['column', { lost: !above[i] }]}>
					<text class="head" x={c.cx} y={L.r.head} text-anchor="middle">Pattern {i + 1}</text>

					<!-- the readings one kilogram of the pattern gives, with the noise as a band -->
					<rect
						class="noise-band"
						x={c.px[0] - 14}
						y={L.r.zero - noise * L.r.k}
						width={c.px[2] - c.px[0] + 28}
						height={2 * noise * L.r.k}
					/>
					<line class="zero" x1={c.px[0] - 14} y1={L.r.zero} x2={c.px[2] + 14} y2={L.r.zero} />
					{#each c.readings as b, j (j)}
						<rect class={['bar', b.sign]} x={b.x - L.bar / 2} y={b.y} width={L.bar} height={b.h} />
					{/each}

					<!-- the pixels, and the masses below them, to scale -->
					{#each c.px as x, j (j)}
						<rect class="pixel" x={x - 3.5} y={L.r.pix - 3.5} width="7" height="7" rx="1" />
					{/each}
					{#each c.mx as x, j (j)}
						<line class="fan" x1={x} y1={L.r.mass + dot + 1.5} x2={c.px[j]} y2={L.r.fan} />
						<circle class="mass" cx={x} cy={L.r.mass} r={dot} />
					{/each}

					<!-- the scene pattern: the mass at each of the three places -->
					<line class="zero" x1={c.px[0] - 14} y1={L.r.vZero} x2={c.px[2] + 14} y2={L.r.vZero} />
					{#each c.scene as b, j (j)}
						<rect class={['bar', b.sign]} x={b.x - L.bar / 2} y={b.y} width={L.bar} height={b.h} />
					{/each}
				</g>
			{/each}

			<!-- the gains, on a logarithmic scale, with the noise as a line -->
			<g class="gains">
				<text class="head" x={L.g.left} y={L.g.head}>The gains</text>
				<line class="axis" x1={L.g.axis} y1={L.g.top} x2={L.g.axis} y2={L.g.bottom} />
				{#each decades as e (e)}
					<line class="tick" x1={L.g.axis - 4} y1={gy(10 ** e)} x2={L.g.axis} y2={gy(10 ** e)} />
					<line
						class="grid"
						x1={L.g.axis}
						y1={gy(10 ** e)}
						x2={L.g.bars[2] + L.g.w + 6}
						y2={gy(10 ** e)}
					/>
					<text class="num" x={L.g.axis - 7} y={gy(10 ** e)} dy="0.35em" text-anchor="end"
						>{decadeText(e)}</text
					>
				{/each}
				{#each patterns as p, i (i)}
					{@const x = L.g.bars[i]}
					<rect
						class={['gain', { lost: !above[i] }]}
						{x}
						y={gy(p.s)}
						width={L.g.w}
						height={L.g.bottom - gy(p.s)}
					/>
					<line
						class="then"
						x1={x - 4}
						y1={gy(opening[i].s)}
						x2={x + L.g.w + 4}
						y2={gy(opening[i].s)}
					/>
					<text class="name" x={x + L.g.w / 2} y={L.g.name} text-anchor="middle"
						><tspan class="italic">s</tspan><tspan class="sub" dy="0.25em">{i + 1}</tspan></text
					>
					<text
						class={['value', { lost: !above[i] }]}
						x={x + L.g.w / 2}
						y={L.g.value}
						text-anchor="middle">{gainText(p.s)}</text
					>
				{/each}
				<line
					class="noise-line"
					x1={L.g.axis}
					y1={gy(noise)}
					x2={L.g.bars[2] + L.g.w + 6}
					y2={gy(noise)}
				/>
				<text class="noise-name" x={L.g.bars[2] + L.g.w + 10} y={gy(noise)} dy="0.35em">noise</text>
			</g>
		</svg>

		<p class="legend">
			<span><i class="key up"></i>above zero</span>
			<span><i class="key down"></i>below zero</span>
			<span><i class="key band"></i>the noise, <Tex math="\pm\sigma_n" /></span>
			<span><i class="key then"></i>each gain at <Tex math="\delta = 1\,\mathrm m" /></span>
			{#if !L.gutter}
				<span class="rows"
					>Each column, from the top: the readings, the pixels, the masses 1 m below them, and the
					pattern.</span
				>
			{/if}
		</p>

		<p class="verdict">
			{#if lost.length === 0}
				All three gains stand above the noise: a kilogram of any of the three patterns moves the
				readings by more than <Tex math="\sigma_n" />.
			{:else if kept.length === 0}
				All three gains lie below the noise.
			{:else}
				{names(kept)}
				{kept.length === 1 ? 'stands' : 'stand'} above the noise. {names(lost)}
				{lost.length === 1 ? 'lies' : 'lie'} below it: a kilogram of {lost.length === 1
					? 'it'
					: 'either'} moves the readings by less than <Tex math="\sigma_n" />, and its amount in a
				scene is found only to within <Tex math={lostTex[0]} />
				{#if lostTex.length > 1}and <Tex math={lostTex[1]} />{/if} kg.
			{/if}
		</p>
	</div>

	<div class="bar-controls">
		<div class="sliders">
			<div onkeydowncapture={keys('delta')} role="presentation">
				<Slider
					id="{uid}-delta"
					label="Spacing of the masses"
					icon={ArrowHorizontalIcon}
					min={Math.log10(CLOSEST)}
					max={0}
					step={0.001}
					bind:value={() => Math.log10(delta), (v) => set('delta', 10 ** v)}
					readout="δ = {dText} m"
					ends={['0.05 m', '1 m']}
					marks={TABLE.map((d) => ({ at: Math.log10(d), label: `δ = ${d} m` }))}
					marksHint="the ticks mark the rows of the chapter’s table"
				/>
			</div>
			<div onkeydowncapture={keys('noise')} role="presentation">
				<Slider
					id="{uid}-noise"
					label="Noise"
					icon={AudioWaveformIcon}
					min={Math.log10(QUIETEST)}
					max={Math.log10(LOUDEST)}
					step={0.001}
					bind:value={() => Math.log10(noise), (v) => set('noise', 10 ** v)}
					readout="σₙ = {noiseText}"
					ends={['0.001', '1']}
				/>
			</div>
		</div>
		<div class="row-controls">
			<p class="hint">
				Drag a slider, or reach it with Tab and step one value at a time with the arrow keys. Reset
				returns to <Tex math="\delta = 1\,\mathrm m" /> and <Tex math="\sigma_n = 0.05" />.
			</p>
			<button type="button" class="reset" onclick={reset}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Reset
			</button>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The camera</dt>
				<dd>
					<span
						>pixels at <Tex math="x_a = -1,\ 0,\ 1\,\mathrm m" />; masses 1 m below them at <Tex
							math="x'_b = -\delta,\ 0,\ \delta"
						/>, with <Tex math={`\\delta = ${dText}\\,\\mathrm m`} /></span
					>
				</dd>
			</div>
			<div class="row matrix">
				<dt>Design matrix</dt>
				<dd>
					<Tex math={matrixTex} /><span class="also"
						>the entry <Tex math={ENTRY_TEX} /> is the reading that a kilogram at mass
						<Tex math="b" /> gives pixel <Tex math="a" />, in units of <Tex math={UNIT_TEX} /> per kilogram</span
					>
				</dd>
			</div>
			{#each patterns as p, i (i)}
				<div class="row">
					<dt>Pattern {i + 1}</dt>
					<dd>
						<Tex math={`s_${i + 1} = ${gainText(p.s)}`} />
						<Tex math={`\\mathbf v_${i + 1} = ${list(p.v)}`} />
						<Tex math={`\\mathbf u_${i + 1} = ${list(p.u)}`} />
						<span class="also"
							>its amount in a scene is found to within <Tex
								math={`\\sigma_n/s_${i + 1} = ${texFig(noise / p.s)}`}
							/> kg{#if !above[i]}; it lies below the noise{/if}</span
						>
					</dd>
				</div>
			{/each}
			<div class="row">
				<dt>The two laws</dt>
				<dd>
					<Tex math={`s_2\\,z/\\delta = ${(patterns[1].s / delta).toFixed(2)}`} />
					<Tex math={`s_3\\,z^2/\\delta^2 = ${(patterns[2].s / delta ** 2).toFixed(2)}`} />
					<span class="also"
						>in the gains’ units; as the masses crowd together they settle at {secondLaw().toFixed(
							2
						)} and {thirdLaw().toFixed(2)}: the second gain falls as <Tex math="\delta" />, the
						third as <Tex math="\delta^2" /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The noise</dt>
				<dd>
					<Tex math={`\\sigma_n = ${noiseText}`} /><span class="also"
						>in units of <Tex math="G/z^3" /> times a kilogram, or <Tex
							math={`${texFig(noise * UNIT)}\\,\\mathrm{s^{-2}}`}
						/> at each pixel</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each column is one pattern. At the bottom is the scene pattern <Tex math="\mathbf v_i" />, the
			mass at each of the three places, joined by thin lines to the masses, which are drawn to scale
			1 m below the pixels. At the top are the readings <Tex math="A\mathbf v_i = s_i\mathbf u_i" /> that
			one kilogram of the pattern gives the three pixels, on one scale for all three columns, with the
			shaded band the noise <Tex math="\pm\sigma_n" />. Orange is above zero and blue below. The
			squares of a pattern’s three entries add up to one, so one kilogram of it means
			<Tex math={AMOUNT_TEX} /> kg. Each pattern is turned so that its largest entry is positive, and
			its readings with it.
		</p>
		<p class="note">
			The gains <Tex math="s_i" /> are drawn on a logarithmic scale, in units of <Tex
				math="G/z^3"
			/> per kilogram, and the short dashes mark them at <Tex math="\delta = 1\,\mathrm m" />, where
			the figure opens. The noise is the standard deviation <Tex math="\sigma_n" /> of each pixel’s reading,
			the same at every pixel and independent between them, so it is also the noise along each reading
			pattern
			<Tex math="\mathbf u_i" />. A pattern stands above the noise when <Tex
				math="s_i > \sigma_n"
			/>; dividing by its gain recovers its amount with the noise <Tex math="\sigma_n/s_i" />.
		</p>
	</div>
</div>

<style>
	.toy-camera {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		--up: var(--accent);
		--down: var(--accent-2);
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

	/* --- the drawing ------------------------------------------------------------------------ */

	.stage {
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.stage > p {
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	.head {
		fill: var(--text);
		font: 500 calc(11.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.row-name {
		fill: var(--text-faint);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		text-anchor: end;
	}

	.zero {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.noise-band {
		fill: color-mix(in srgb, var(--text) 14%, transparent);
	}

	.bar {
		stroke-width: calc(1px * var(--u, 1));
	}

	.bar.up {
		fill: color-mix(in srgb, var(--up) 50%, transparent);
		stroke: var(--up);
	}

	.bar.down {
		fill: color-mix(in srgb, var(--down) 50%, transparent);
		stroke: var(--down);
	}

	.pixel {
		fill: var(--bg-raised);
		stroke: color-mix(in srgb, var(--text) 65%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mass {
		fill: color-mix(in srgb, var(--text) 80%, transparent);
	}

	.fan {
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	/* a pattern below the noise: its readings and its head grow faint */
	.column.lost .head {
		fill: var(--text-faint);
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 9%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num,
	.value {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.value {
		fill: var(--text);
		font-weight: 500;
	}

	.value.lost {
		fill: var(--text-faint);
	}

	.name {
		fill: var(--text);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.italic {
		font: italic 400 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sub {
		font-size: calc(9.5px * var(--u, 1));
	}

	.gain {
		fill: color-mix(in srgb, var(--text) 30%, transparent);
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.gain.lost {
		fill: color-mix(in srgb, var(--text) 8%, transparent);
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.then {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2px * var(--u, 1));
		opacity: 0.7;
	}

	.noise-line {
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.noise-name {
		fill: var(--text);
		font: 500 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin-top: 0.55rem !important;
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
	}

	.legend > span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.legend > span.rows {
		display: block;
	}

	.key {
		flex: none;
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		border: 1px solid;
		border-radius: 1px;
	}

	.key.up {
		border-color: var(--up);
		background: color-mix(in srgb, var(--up) 50%, transparent);
	}

	.key.down {
		border-color: var(--down);
		background: color-mix(in srgb, var(--down) 50%, transparent);
	}

	.key.band {
		border: 0;
		width: 1rem;
		background: color-mix(in srgb, var(--text) 14%, transparent);
	}

	.key.then {
		width: 1rem;
		height: 1px;
		border: 0;
		border-radius: 0;
		background: repeating-linear-gradient(90deg, var(--text) 0 3px, transparent 3px 5px);
		opacity: 0.7;
	}

	.verdict {
		margin-top: 0.45rem !important;
		font-size: 0.76rem;
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
		gap: 0.6rem 1.4rem;
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

	.reset {
		flex: none;
		display: inline-flex;
		align-items: center;
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

	.reset :global(svg) {
		color: var(--accent);
	}

	.reset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.reset:hover {
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

	.row.matrix {
		align-items: center;
		margin: 0.1rem 0;
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

	.row.matrix dd {
		align-items: center;
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

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.05rem;
		}

		.readouts dl {
			gap: 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reset {
			transition: none;
		}
	}
</style>
