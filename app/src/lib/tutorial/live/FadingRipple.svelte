<script lang="ts">
	/**
	 * Chapter 2.7's fading ripple. (a) A slab whose surface density rises and falls across the crests, σ₁ cos(k a₁),
	 * orange where it is above its mean and blue where it is below, as chapter 3.2's maps colour them; above it, on a
	 * vertical plane, the ripple of the chosen reading at the heights h = 0, z/4, …, 3z, each drawn at its true size
	 * relative to the slab, e^{−kh}. (b) That fade against the height on a logarithmic scale: a straight line, so each
	 * step of z divides the ripple by the same e^{kz}. (c) The chosen reading's factor at the height z against kz, with
	 * its powers k⁻¹, 1 or k. The readouts give k, kz, the fade e^{kz}, its square at 2z, and the size of the reading
	 * over the chapter's ripple of a concrete floor. The numbers come from ./fading-ripple.ts. The prediction at the top
	 * is answered once the height has been moved. Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowDataTransferVerticalIcon,
		ArrowDown01Icon,
		ArrowHorizontalIcon,
		ArrowVerticalIcon,
		Clock01Icon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		LADDER,
		OPENING,
		READINGS,
		SIGMA1,
		SIGN,
		UNIT,
		amplitudeLog10,
		bestSpacing,
		decadeAxis,
		fadeDecades,
		kzOfPi,
		length,
		lengthAbout,
		powerOfTen,
		printed,
		shape,
		tex,
		text,
		wavenumber,
		type Reading
	} from './fading-ripple';

	const uid = $props.id();

	// --- the choices: the crest spacing, the height of the sensors, and the reading --------------------------------------
	let spacingRung = $state(LADDER.indexOf(OPENING.spacing));
	let heightRung = $state(LADDER.indexOf(OPENING.height));
	let reading = $state<Reading>(OPENING.reading);
	const spacing = $derived(LADDER[spacingRung]);
	const z = $derived(LADDER[heightRung]);
	const k = $derived(wavenumber(spacing));
	const kz = $derived(k * z);

	const NAMES: Record<
		Reading,
		{ label: string; noun: string; icon: typeof Clock01Icon; symbol: string }
	> = {
		potential: { label: 'Potential', noun: 'potential', icon: Clock01Icon, symbol: '\\Phi' },
		pull: { label: 'Pull', noun: 'vertical pull', icon: ArrowDown01Icon, symbol: 'g_h' },
		tide: { label: 'Tide', noun: 'tide', icon: ArrowDataTransferVerticalIcon, symbol: 'd' }
	};

	// --- the prediction: answered once the height has been moved -----------------------------------------------------
	let moved = $state(false);

	const clampRung = (i: number) => Math.max(0, Math.min(LADDER.length - 1, Math.round(i)));

	function setSpacing(i: number) {
		spacingRung = clampRung(i);
	}

	function setHeight(i: number) {
		const next = clampRung(i);
		if (next !== heightRung) moved = true;
		heightRung = next;
	}

	// the readings are a group of radio buttons: Tab reaches the chosen one, the arrows move the choice
	const readingButtons: Record<Reading, HTMLButtonElement | undefined> = {
		potential: undefined,
		pull: undefined,
		tide: undefined
	};
	const holdReading =
		(r: Reading): Attachment<HTMLButtonElement> =>
		(node) => {
			readingButtons[r] = node;
			return () => (readingButtons[r] = undefined);
		};

	function readingKeys(e: KeyboardEvent) {
		const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
		const on = e.key === 'ArrowRight' || e.key === 'ArrowDown';
		const first = e.key === 'Home';
		const last = e.key === 'End';
		if (!back && !on && !first && !last) return;
		e.preventDefault();
		const i = READINGS.indexOf(reading);
		const next = first
			? 0
			: last
				? READINGS.length - 1
				: (i + (on ? 1 : READINGS.length - 1)) % READINGS.length;
		reading = READINGS[next];
		readingButtons[READINGS[next]]?.focus();
	}

	// --- the drawing's bounds: on a phone the panels are narrower and stacked ---------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const f1 = (x: number) => x.toFixed(1);

	/** The number of crest spacings shown across (a). */
	const crests = $derived(phone.current ? 2 : 3);
	/** The curves of (a) stand z/4 apart, from the slab, h = 0, to 3z. */
	const STEPS = 12;
	const SLAB = 26;
	const a = $derived.by(() => {
		const w = phone.current ? 332 : 672;
		const gap = phone.current ? 14 : 17;
		const amp = 0.8 * gap;
		const top = 6 + amp;
		const base = top + STEPS * gap;
		return {
			w,
			h: base + SLAB + 34,
			L: phone.current ? 24 : 28,
			R: w - (phone.current ? 74 : 80),
			gap,
			amp,
			top,
			base
		};
	});
	/** Across (a): u in crest spacings, 0 at a crest of the density. */
	const ax = (u: number) => a.L + ((u + crests / 2) / crests) * (a.R - a.L);
	/** Up (a): t = h/z. */
	const ay = (t: number) => a.base - (t / 3) * (a.base - a.top);

	/**
	 * One curve of (a), at the height t z: y = ay(t) − s A e^{−kh} cos 2πu, drawn as cubic pieces that match the
	 * cosine's slope at both ends of each sixteenth of a spacing, so that it is smooth at any size.
	 */
	function ripplePath(t: number): string {
		const size = SIGN[reading] * a.amp * Math.exp(-kz * t);
		const y0 = ay(t);
		const left = -crests / 2;
		const right = crests / 2;
		if (Math.abs(size) < 0.02) return `M${f1(ax(left))},${f1(y0)}H${f1(ax(right))}`;
		const per = 16;
		const du = 1 / per;
		const dxdu = (a.R - a.L) / crests;
		const y = (u: number) => y0 - size * Math.cos(2 * Math.PI * u);
		const slope = (u: number) => size * 2 * Math.PI * Math.sin(2 * Math.PI * u);
		let d = `M${f1(ax(left))},${f1(y(left))}`;
		for (let i = 0; i < per * crests; i++) {
			const u0 = left + i * du;
			const u1 = u0 + du;
			d +=
				`C${f1(ax(u0) + (dxdu * du) / 3)},${f1(y(u0) + (slope(u0) * du) / 3)} ` +
				`${f1(ax(u1) - (dxdu * du) / 3)},${f1(y(u1) - (slope(u1) * du) / 3)} ` +
				`${f1(ax(u1))},${f1(y(u1))}`;
		}
		return d;
	}

	const curves = $derived(
		Array.from({ length: STEPS + 1 }, (_, j) => ({
			j,
			t: j / 4,
			d: ripplePath(j / 4)
		}))
	);

	/** The slab's colours: the share of orange above the mean and of blue below it, sampled finely across. */
	const slabStops = $derived(
		Array.from({ length: 24 * crests + 1 }, (_, i) => {
			const u = -crests / 2 + i / 24;
			const c = Math.cos(2 * Math.PI * u);
			return {
				offset: i / (24 * crests),
				above: Math.max(0, c) ** 0.75,
				below: Math.max(0, -c) ** 0.75
			};
		})
	);

	/** How many times weaker the ripple is at the heights z, 2z and 3z than at the slab, as "÷ 535". */
	const fadeAt = (t: number) => `÷ ${text(fadeDecades(k, t * z), true)}`;

	// --- panel (b): the fade against the height, logarithmic ---------------------------------------------------------
	const sizeB = $derived(phone.current ? { w: 332, h: 204 } : { w: 328, h: 214 });
	const b = $derived({ L: 46, R: sizeB.w - 10, T: 10, B: sizeB.h - 24 });
	const depth = $derived(3 * fadeDecades(k, z));
	const decades = $derived(decadeAxis(depth));
	const bx = (t: number) => b.L + (t / 3) * (b.R - b.L);
	const by = (d: number) => b.T + (d / decades.bottom) * (b.B - b.T);
	const decadeLabel = (d: number) => (d === 0 ? '1' : powerOfTen(d));
	/** The dots at z and 2z, each with its label placed in the open side of the line. */
	const marksB = $derived(
		[1, 2].map((t) => {
			const d = -t * fadeDecades(k, z);
			const x = bx(t);
			const y = by(d);
			const high = y < b.T + 0.38 * (b.B - b.T);
			return {
				t,
				x,
				y,
				label: fadeAt(t),
				lx: high ? x - 7 : x + 7,
				ly: high ? y + 15 : y - 8,
				anchor: high ? 'end' : 'start'
			};
		})
	);

	// --- panel (c): the reading's factor at the height z against kz ------------------------------------------------
	const Q_HIGH = 8;
	const S_HIGH = 3;
	const c = $derived(b);
	const cx = (q: number) => c.L + (q / Q_HIGH) * (c.R - c.L);
	const cy = (s: number) => c.B - (s / S_HIGH) * (c.B - c.T);
	const shapePaths = $derived(
		Object.fromEntries(
			READINGS.map((r) => {
				let d = '';
				for (let i = 0; i <= 640; i++) {
					// the potential's grows without limit as q → 0: start it where it is just off the top
					const q = r === 'potential' ? 0.25 + (i / 640) * (Q_HIGH - 0.25) : (i / 640) * Q_HIGH;
					d += `${i === 0 ? 'M' : 'L'}${f1(cx(q))},${f1(cy(shape(r, q)))}`;
				}
				return [r, d];
			})
		) as Record<Reading, string>
	);
	const here = $derived(shape(reading, kz));
	const qTicks = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	const sTicks = [0, 1, 2, 3];

	// --- the numbers ----------------------------------------------------------------------------------------------------
	const kTex = $derived(tex(Math.log10(k)));
	/** A length in TeX, its unit upright: "10\\ \\text{cm}". */
	const lengthTex = (m: number) => length(m).replace(/\s(c?m)$/, '\\ \\text{$1}');
	const kzTex = $derived.by(() => {
		const pi = kzOfPi(spacing, z);
		const value = tex(Math.log10(kz));
		return pi ? `kz = ${pi} = ${value}` : `kz = ${value}`;
	});
	const fadeLog = $derived(fadeDecades(k, z));
	const fadePrinted = $derived(printed(fadeLog));
	const fadeTex = $derived(tex(fadeLog));
	const doubleLog = $derived(2 * fadeLog);
	/** Twice the fade, what halving the strength would have given, printed as the fade is. */
	const twiceTex = $derived(tex(fadeLog + Math.log10(2)));
	/** The share kept, when it is at least 1%. */
	const kept = $derived(Math.exp(-kz));

	const sizeLog = $derived(amplitudeLog10(reading, k, z));
	const atSlabLog = $derived(amplitudeLog10(reading, k, 0));
	const formula: Record<Reading, string> = {
		potential: '\\tilde\\Phi = -(2\\pi G/k)\\,e^{-kz}\\,\\tilde\\sigma',
		pull: '\\tilde g_h = -2\\pi G\\,e^{-kz}\\,\\tilde\\sigma',
		tide: '\\tilde d = 2\\pi G\\,k\\,e^{-kz}\\,\\tilde\\sigma'
	};
	const sizeFormula: Record<Reading, string> = {
		potential: '(2\\pi G\\sigma_1/k)\\,e^{-kz}',
		pull: '2\\pi G\\sigma_1\\,e^{-kz}',
		tide: '2\\pi G k\\sigma_1\\,e^{-kz}'
	};
	const shapeTex: Record<Reading, string> = {
		potential: 'q^{-1}e^{1-q}',
		pull: 'e^{1-q}',
		tide: 'q\\,e^{1-q}'
	};

	const labelA = $derived(
		`A slab whose density rises and falls across crests ${length(spacing)} apart, and above it the ripple of the ${NAMES[reading].noun} at heights from 0 to 3z, with z = ${length(z)}; at the sensors, at z, the ripple is ${text(fadeLog)} times weaker than at the slab${kz > 2 ? ', and the curves there are flat' : ''}`
	);
	const labelB = $derived(
		`The size of the ripple against the height, from 0 to 3z, on a logarithmic scale: a straight line from 1 at the slab, through 1/${text(fadeLog)} at z and 1/${text(doubleLog)} at 2z`
	);
	const labelC = $derived(
		`The factors of the potential, the pull and the tide at the height z against kz, from 0 to 8, each in units of its value at kz = 1; the ${NAMES[reading].noun} is marked at kz = ${text(Math.log10(kz))}, where its factor is ${text(Math.log10(here))} times that value`
	);
</script>

<div class="fading-ripple">
	<section class="predict" aria-labelledby="{uid}-predict">
		<span class="tag" id="{uid}-predict">Predict</span>
		<p class="question">Double the height: is the ripple half as strong?</p>
		<p class={['answer', { shown: moved }]} aria-live="polite">
			{#if moved}
				<strong>No: the factor is squared.</strong> With crests 10 cm apart, the ripple is 535 times
				weaker at 10 cm and <Tex math={`2.9 \\times 10^{5}`} /> times weaker at 20 cm, not 1070 times.
				Each further height <Tex math="z" /> divides the ripple by the same <Tex math={`e^{kz}`} />,
				so
				<Tex math={`e^{2kz} = (e^{kz})^2`} />, and in (b) the fade falls along a straight line on
				its logarithmic scale.
			{:else}
				The answer appears once you have moved the height of the sensors.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="panel">
			<p class="title">
				<span class="letter">(a)</span> The slab’s ripple of density, and above it the ripple of the
				{NAMES[reading].noun} at the heights <Tex math="h" /> from 0 to <Tex math="3z" />, each at
				its true size, <Tex math={`e^{-kh}`} /> of its size at the slab
			</p>
			<svg viewBox="0 0 {a.w} {a.h}" role="img" aria-label={labelA} {@attach fitText()}>
				<defs>
					<linearGradient
						id="{uid}-above"
						gradientUnits="userSpaceOnUse"
						x1={a.L}
						y1="0"
						x2={a.R}
						y2="0"
					>
						{#each slabStops as s (s.offset)}
							<stop
								offset={s.offset}
								style:stop-color="var(--accent)"
								stop-opacity={0.85 * s.above}
							/>
						{/each}
					</linearGradient>
					<linearGradient
						id="{uid}-below"
						gradientUnits="userSpaceOnUse"
						x1={a.L}
						y1="0"
						x2={a.R}
						y2="0"
					>
						{#each slabStops as s (s.offset)}
							<stop
								offset={s.offset}
								style:stop-color="var(--accent-2)"
								stop-opacity={0.7 * s.below}
							/>
						{/each}
					</linearGradient>
				</defs>

				<!-- the slab -->
				<rect class="slab" x={a.L} y={a.base} width={a.R - a.L} height={SLAB} />
				<rect x={a.L} y={a.base} width={a.R - a.L} height={SLAB} fill="url(#{uid}-above)" />
				<rect x={a.L} y={a.base} width={a.R - a.L} height={SLAB} fill="url(#{uid}-below)" />

				<!-- the crest spacing, as a bracket under the slab, from one crest to the next -->
				<path
					class="bracket"
					d="M{f1(ax(0))},{a.base + SLAB + 6}v6H{f1(ax(0.5) - 46)}M{f1(ax(0.5) + 46)},{a.base +
						SLAB +
						12}H{f1(ax(1))}v-6"
				/>
				<text class="num strong" x={ax(0.5)} y={a.base + SLAB + 15.5} text-anchor="middle"
					>2π/<tspan class="it">k</tspan> = {length(spacing)}</text
				>

				<!-- the height, on the left -->
				<line class="axis" x1={a.L} y1={a.top} x2={a.L} y2={a.base} />
				{#each curves as cv (cv.j)}
					<line
						class="tick"
						x1={a.L - (cv.j % 4 === 0 ? 4 : 2)}
						y1={ay(cv.t)}
						x2={a.L}
						y2={ay(cv.t)}
					/>
				{/each}
				{#each [0, 1, 2, 3] as t (t)}
					<text class={['var', { sensors: t === 1 }]} x={a.L - 7} y={ay(t) + 4} text-anchor="end"
						>{t === 0 ? '0' : t === 1 ? 'z' : `${t}z`}</text
					>
					{#if t > 0}
						<text class={['num', { sensors: t === 1 }]} x={a.R + 8} y={ay(t) + 3.8}
							>{fadeAt(t)}</text
						>
					{/if}
				{/each}

				<!-- the ripples of the reading -->
				{#each curves as cv (cv.j)}
					{#if cv.j !== 4 && cv.j !== 8 && cv.j !== 0}
						<path class="ripple" d={cv.d} />
					{/if}
				{/each}
				<path class="ripple twice" d={curves[8].d} />
				<path class="ripple-halo" d={curves[0].d} />
				<path class="ripple slab-top" d={curves[0].d} />
				<path class="ripple-halo" d={curves[4].d} />
				<path class="ripple sensors" d={curves[4].d} />
			</svg>
			<p class="legend">
				<span><i class="key denser"></i>denser than the mean</span>
				<span><i class="key lighter"></i>lighter than the mean</span>
				<span><i class="key sensors"></i><span>at the sensors, <Tex math="h = z" /></span></span>
				<span><i class="key twice"></i><span>at <Tex math="2z" /></span></span>
				<span
					><i class="key others"></i><span
						>every <Tex math="z/4" />, from the slab to <Tex math="3z" /></span
					></span
				>
			</p>
		</div>

		<div class="pair">
			<div class="panel">
				<p class="title">
					<span class="letter">(b)</span> The fade <Tex math={`e^{-kh}`} />, against the height
					<Tex math="h" />, on a logarithmic scale
				</p>
				<svg viewBox="0 0 {sizeB.w} {sizeB.h}" role="img" aria-label={labelB} {@attach fitText()}>
					<line class="axis" x1={b.L} y1={b.B} x2={b.R} y2={b.B} />
					<line class="axis" x1={b.L} y1={b.T} x2={b.L} y2={b.B} />
					{#each decades.ticks as d (d)}
						<line class="tick" x1={b.L - 4} y1={by(d)} x2={b.L} y2={by(d)} />
						<text class="num" x={b.L - 7} y={by(d) + 3.8} text-anchor="end">{decadeLabel(d)}</text>
					{/each}
					{#each [0, 1, 2, 3] as t (t)}
						<line class="tick" x1={bx(t)} y1={b.B} x2={bx(t)} y2={b.B + 4} />
						<text class="var" x={bx(t)} y={b.B + 17} text-anchor={t === 3 ? 'end' : 'middle'}
							>{t === 0 ? '0' : t === 1 ? 'z' : `${t}z`}</text
						>
					{/each}
					{#each marksB as m (m.t)}
						<line class="guide" x1={m.x} y1={m.y} x2={m.x} y2={b.B} />
					{/each}
					<path class="exact" d="M{f1(bx(0))},{f1(by(0))}L{f1(bx(3))},{f1(by(-depth))}" />
					{#each marksB as m (m.t)}
						<path class={['dot', { sensors: m.t === 1 }]} d="M{f1(m.x)},{f1(m.y)}h0" />
						<text
							class={['num', 'strong', 'halo', { sensors: m.t === 1 }]}
							x={m.lx}
							y={m.ly}
							text-anchor={m.anchor}>{m.label}</text
						>
					{/each}
				</svg>
				<p class="legend">
					<span class="words"
						>a straight line: each step of <Tex math="z" /> in height divides the ripple by the same
						<Tex math={`e^{kz}`} /></span
					>
				</p>
			</div>

			<div class="panel">
				<p class="title">
					<span class="letter">(c)</span> Each reading’s factor at the height <Tex math="z" />,
					against <Tex math="q = kz" />, in units of its value at <Tex math="q = 1" />
				</p>
				<svg viewBox="0 0 {sizeB.w} {sizeB.h}" role="img" aria-label={labelC} {@attach fitText()}>
					<defs>
						<clipPath id="{uid}-c">
							<rect x={c.L} y={c.T} width={c.R - c.L} height={c.B - c.T} />
						</clipPath>
					</defs>
					<line class="axis" x1={c.L} y1={c.B} x2={c.R} y2={c.B} />
					<line class="axis" x1={c.L} y1={c.T} x2={c.L} y2={c.B} />
					{#each sTicks as s (s)}
						<line class="tick" x1={c.L - 4} y1={cy(s)} x2={c.L} y2={cy(s)} />
						<text class="num" x={c.L - 7} y={cy(s) + 3.8} text-anchor="end">{s}</text>
					{/each}
					{#each qTicks as q (q)}
						<line class="tick" x1={cx(q)} y1={c.B} x2={cx(q)} y2={c.B + 4} />
						<text class="num" x={cx(q)} y={c.B + 16} text-anchor="middle">{q}</text>
					{/each}
					<g clip-path="url(#{uid}-c)">
						{#each READINGS as r (r)}
							{#if r !== reading}
								<path class={['other', r]} d={shapePaths[r]} />
							{/if}
						{/each}
						<path class="chosen" d={shapePaths[reading]} />
					</g>
					{#if kz <= Q_HIGH && here <= S_HIGH}
						<path class="dot sensors" d="M{f1(cx(kz))},{f1(cy(here))}h0" />
					{:else if kz <= Q_HIGH}
						<!-- off the top: an arrow at the top edge, with the value -->
						<path
							class="arrow"
							d="M{f1(cx(kz) - 4)},{f1(c.T - 3)}L{f1(cx(kz))},{f1(c.T - 9)}L{f1(cx(kz) + 4)},{f1(
								c.T - 3
							)}"
						/>
						<text class="num strong halo sensors" x={cx(kz) + 8} y={c.T - 2}
							>{text(Math.log10(here))}</text
						>
					{:else}
						<!-- beyond the right edge: an arrow there, with kz -->
						<path
							class="arrow"
							d="M{f1(c.R - 5)},{f1(c.B - 13)}L{f1(c.R)},{f1(c.B - 9)}L{f1(c.R - 5)},{f1(c.B - 5)}"
						/>
						<text class="num strong halo sensors" x={c.R - 9} y={c.B - 5.5} text-anchor="end"
							><tspan class="it">kz</tspan> = {text(Math.log10(kz))}</text
						>
					{/if}
				</svg>
				<p class="legend">
					{#each READINGS as r (r)}
						<span
							><i class={['key', r === reading ? 'chosen' : ['other', r]]}></i><span
								>{r === 'pull' ? 'pull' : r}, <Tex math={shapeTex[r]} /></span
							></span
						>
					{/each}
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="readings" role="radiogroup" aria-label="The reading">
			{#each READINGS as r (r)}
				<button
					type="button"
					role="radio"
					aria-checked={reading === r}
					tabindex={reading === r ? 0 : -1}
					onclick={() => (reading = r)}
					onkeydown={readingKeys}
					{@attach holdReading(r)}
				>
					<HugeiconsIcon icon={NAMES[r].icon} size={16} strokeWidth={1.7} />
					{NAMES[r].label}
				</button>
			{/each}
		</div>
		<Slider
			id="{uid}-spacing"
			label="Crest spacing"
			icon={ArrowHorizontalIcon}
			min={0}
			max={LADDER.length - 1}
			step={1}
			bind:value={() => spacingRung, setSpacing}
			readout="2π/k = {length(spacing)}"
			ends={[length(LADDER[0]), length(LADDER[LADDER.length - 1])]}
			marks={[0.1, 1].map((s) => ({ at: LADDER.indexOf(s), label: `crests ${length(s)} apart` }))}
			marksHint="the ticks mark the chapter’s crests, 10 cm and 1 m apart"
		/>
		<Slider
			id="{uid}-height"
			label="Height of the sensors"
			icon={ArrowVerticalIcon}
			min={0}
			max={LADDER.length - 1}
			step={1}
			bind:value={() => heightRung, setHeight}
			readout="z = {length(z)}"
			ends={[length(LADDER[0]), length(LADDER[LADDER.length - 1])]}
			marks={[0.1, 0.2].map((h) => ({ at: LADDER.indexOf(h), label: `z = ${length(h)}` }))}
			marksHint="the ticks mark the prediction’s two heights, 10 and 20 cm"
		/>
		<p class="hint">
			Choose a reading and drag the sliders. With the keyboard, reach the readings and the sliders
			with Tab and use the arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The ripple</dt>
				<dd>
					<Tex math={`k = 2\\pi/(${lengthTex(spacing)}) = ${kTex}\\ \\text{m}^{-1}`} /><span
						class="also"
						>Its crests are {length(spacing)} apart, orange where the slab is denser than its mean and
						blue where it is lighter.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The sensors</dt>
				<dd>
					<Tex math={kzTex} /><span class="also"
						>They are {length(z)} above the slab, and the fade depends on the height and the spacing only
						through this product.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The fade</dt>
				<dd>
					<Tex math={`e^{kz} = ${fadeTex}`} /><span class="also"
						>The ripple is {#if 'plain' in fadePrinted}{fadePrinted.plain}{:else}<Tex
								math={fadeTex}
							/>{/if} times weaker at the sensors than at the slab{#if kept >= 0.01}: it keeps {Math.round(
								kept * 100
							)}% of its size{/if}.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Twice as high</dt>
				<dd>
					<Tex math={`e^{2kz} = (e^{kz})^2 = ${tex(doubleLog)}`} /><span class="also"
						>At <Tex math="2z" /> = {length(2 * z)} the ripple is <Tex math={tex(doubleLog)} /> times
						weaker: the square of <Tex math={fadeTex} />, not twice it, which would be <Tex
							math={twiceTex}
						/>.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The reading</dt>
				<dd>
					<Tex math={formula[reading]} /><span class="also">
						{#if reading === 'potential'}
							A clock reads the potential. Its factor carries <Tex math={`k^{-1}`} />, so it favours
							broad ripples, and it grows without limit as <Tex math="k \to 0" />.
						{:else if reading === 'pull'}
							An accelerometer reads the vertical pull, <Tex math="g_h = -\partial_h\Phi" />. Its
							factor has no <Tex math="k" />, so a very broad ripple pulls with <Tex
								math="2\pi G\sigma_1"
							/>, as a uniform sheet does.
						{:else}
							The camera’s pixels read the tide, <Tex math={`d = -\\mathcal{E}_{zz}`} />. Its factor
							carries one more <Tex math="k" /> than the pull, so it is zero for the mean, <Tex
								math="k = 0"
							/>. At this height it is largest for crests <Tex math="2\pi z" /> = {lengthAbout(
								bestSpacing(z)
							)} apart, where <Tex math="kz = 1" />.
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Its size at the sensors</dt>
				<dd>
					<Tex math={`${sizeFormula[reading]} = ${tex(sizeLog)}\\ ${UNIT[reading]}`} /><span
						class="also"
						>This is for the chapter’s ripple of <Tex
							math={`\\sigma_1 = ${SIGMA1}\\ \\text{kg\\,m}^{-2}`}
						/>, a concrete floor whose thickness rises and falls by 1 cm. At the slab it would be <Tex
							math={`${tex(atSlabLog)}\\ ${UNIT[reading]}`}
						/>. Its power of <Tex math="k" /> is the same at both heights, so only the fade lies between
						the two.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The slab is the chapter’s thin sheet at <Tex math="h = 0" />, with the surface density <Tex
				math="\sigma_1\cos(k a_1)"
			/> about its mean, where <Tex math="a_1" /> is the position across the crests. The two axes of (a)
			have their own scales: across, it always shows {crests === 3 ? 'three' : 'two'} crest spacings,
			and up, three heights of the sensors, with a curve every <Tex math="z/4" />. The fade depends
			only on <Tex math="kz" />, so the drawing changes only when <Tex math="kz" /> does. Each curve is
			drawn at its true size relative to the curve at the slab, which keeps one size on the page; over
			a dense band the potential dips, the pull points down, <Tex math="g_h < 0" />, and <Tex
				math="d"
			/> rises. The figures on the right of (a) say how many times weaker the ripple is at each height
			than at the slab.
		</p>
	</div>
</div>

<style>
	.fading-ripple {
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

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
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

	.num.strong {
		fill: var(--text);
		font-weight: 500;
	}

	.var {
		fill: var(--text-dim);
		font: italic 400 calc(12px * var(--u, 1)) / 1 var(--font-serif);
	}

	.num .it {
		font: italic 400 calc(12px * var(--u, 1)) / 1 var(--font-serif);
	}

	.num.sensors,
	.var.sensors {
		fill: var(--accent);
	}

	/* words over lines keep a margin of the ground around them */
	.halo {
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.slab {
		fill: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.bracket {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ripple {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ripple.slab-top {
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.ripple.twice {
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ripple.sensors {
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.ripple-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.exact,
	.other {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.other {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* the readings not chosen keep a pattern each, so that the legend tells them apart */
	.other.pull {
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.other.potential {
		stroke-dasharray: calc(1px * var(--u, 1)) calc(2.5px * var(--u, 1));
		stroke-linecap: round;
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.chosen {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the marked points: round ends of strokes of no length */
	.dot {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(5px * var(--u, 1));
		stroke-linecap: round;
	}

	.dot.sensors {
		stroke: var(--accent);
	}

	.arrow {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linecap: round;
		stroke-linejoin: round;
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

	/* a sentence with a formula in it flows as text */
	.legend > span.words {
		display: inline;
	}

	.key {
		flex: none;
		display: inline-block;
		width: 1rem;
		height: 0;
		border-top: 2px solid;
	}

	.key.denser,
	.key.lighter {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--accent) 70%, transparent);
	}

	.key.lighter {
		background: color-mix(in srgb, var(--accent-2) 70%, transparent);
	}

	.key.sensors,
	.key.chosen {
		border-color: var(--accent);
	}

	.key.twice {
		border-top: 1px dashed color-mix(in srgb, var(--text) 70%, transparent);
	}

	.key.others {
		border-top: 1px solid color-mix(in srgb, var(--text) 40%, transparent);
	}

	.key.other.pull {
		border-top: 1px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.key.other.tide {
		border-top: 1px solid color-mix(in srgb, var(--text) 60%, transparent);
	}

	.key.other.potential {
		border-top: 1.5px dotted color-mix(in srgb, var(--text) 60%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	/* the readings, drawn as the site's segmented choice */
	.readings {
		min-width: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.readings button {
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

	.readings button[aria-checked='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.readings button[aria-checked='true'] :global(svg) {
		color: var(--accent);
	}

	.readings button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.readings button[aria-checked='false']:hover {
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
		grid-template-columns: 10rem 1fr;
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

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
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

		.readings button {
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
		.readings button {
			transition: none;
		}
	}
</style>
