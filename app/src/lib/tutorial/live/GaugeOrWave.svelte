<script lang="ts">
	/**
	 * Chapter 7.4's gauge or wave. A 5 × 5 grid of rings of twelve free balls, in the observer's colour, over thin
	 * grey coordinate lines, each ring's undisturbed circle dashed. One slider sets the chapter's pure-gauge
	 * relabelling x′ = x + ε cos(kx − ωt), which ripples the lines and their labels and leaves every ball where it
	 * was; the other sets a real plus-polarized wave h₊, travelling out of the screen, which moves the balls apart and
	 * together. A switch draws the same scene at the balls' labels instead, where the ripple of labels looks like a
	 * wave and the real wave's balls keep their labels. The readouts, from the metric and the curvature
	 * (./gauge-or-wave.ts), say which is real: the largest change in the proper separation of neighbouring balls, and
	 * the tide 𝓔ₓₓ at the centre. The figure opens with the gauge shift at 0.2 and no wave, playing. Three predictions
	 * at the top are answered once the reader has done what each asks. Under reduced motion it opens paused on one
	 * frame, at the phase of the wave's largest stretch.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		GridIcon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		RulerIcon,
		Tag01Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		GAUGE,
		K,
		MARKED,
		OPENING,
		PERIOD_S,
		RADIUS,
		RINGS,
		SPEED,
		WAVE,
		bothOn,
		centreTide,
		chop,
		clampTo,
		drawnAt,
		event,
		figurePlanes,
		gaugeOnly,
		gaugeSizes,
		label,
		largestChange,
		linesAt,
		noteFirst,
		noteSecond,
		noteThird,
		overLigo,
		pairChange,
		peakChange,
		peakTide,
		setting,
		stepped,
		table,
		texTwo,
		two,
		waveOnly,
		type Range,
		type View
	} from './gauge-or-wave';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let gauge = $state(OPENING.gauge);
	let wave = $state(OPENING.wave);
	/** ωt, radians. */
	let phase = $state(OPENING.phase);
	let view = $state<View>('rulers');

	const knobs = $derived({ gauge, wave });
	const settings = $derived({ gauge, wave, phase });

	function setGauge(v: number) {
		gauge = clampTo(v, GAUGE);
		moved = true;
		note();
	}
	function setWave(v: number) {
		wave = clampTo(v, WAVE);
		note();
	}

	function reset() {
		gauge = OPENING.gauge;
		wave = OPENING.wave;
		phase = OPENING.phase;
		view = 'rulers';
		note();
	}

	/** Arrow keys step a slider, with Shift by a larger step; Page Up and Down, Home and End as usual. */
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
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	/** How much of ωt has run with only the gauge shift on, and whether the reader has set the shift. */
	let watched = 0;
	let moved = false;
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	/** What the reader had set when the second and third were answered, for their numbers. */
	let firstAt = $state(OPENING);
	let secondAt = $state(OPENING);
	let thirdAt = $state(OPENING);

	function note() {
		const s = { gauge, wave };
		if (!first && noteFirst(false, s, watched, moved)) firstAt = { ...s, phase: 0 };
		first = noteFirst(first, s, watched, moved);
		if (!second && noteSecond(false, s)) secondAt = { ...s, phase: 0 };
		second = noteSecond(second, s);
		if (!third && noteThird(false, s)) thirdAt = { ...s, phase: 0 };
		third = noteThird(third, s);
	}

	// the numbers of an answer follow the settings while they still answer its question, else they are those that
	// first did
	const firstGauge = $derived(gaugeOnly(knobs) ? gauge : firstAt.gauge);
	const secondK = $derived(waveOnly(knobs) ? knobs : secondAt);
	const thirdK = $derived(bothOn(knobs) ? knobs : thirdAt);

	// --- the time ---------------------------------------------------------------------------------------------------
	let playing = $state(true);

	function advance(d: number) {
		phase = (phase + d) % (2 * Math.PI);
		if (gaugeOnly({ gauge, wave })) {
			watched += d;
			if (!first) note();
		}
	}

	let checked = false;
	/** Runs ωt through a period every few seconds while playing; under reduced motion it opens paused. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				phase = 0;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			advance((2 * Math.PI * dt) / PERIOD_S);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the numbers ------------------------------------------------------------------------------------------------
	const change = $derived(largestChange(settings));
	const peak = $derived(peakChange(knobs));
	const tideNow = $derived(centreTide(settings));
	const tidePeak = $derived(peakTide(knobs));
	const sizes = $derived(gaugeSizes(gauge));
	const centre = $derived(table(figurePlanes(settings), event([0, 0], phase)));
	const hxx = $derived(chop(centre[1][1], wave + sizes.xx));
	const h0x = $derived(chop(centre[0][1], sizes.tx));

	const marked = $derived.by(() => {
		const [a, b] = MARKED;
		const L0 = Math.hypot(b[0] - a[0], b[1] - a[1]);
		const d = chop(pairChange(settings, MARKED), wave + gauge * K);
		const la = label(a, settings);
		const lb = label(b, settings);
		return { proper: L0 * (1 + d), labels: Math.hypot(lb[0] - la[0], lb[1] - la[1]), d };
	});

	/** A change's kind: a stretch above zero, a squeeze below. */
	const kind = (v: number) => (v > 0 ? 'stretch' : v < 0 ? 'squeeze' : 'still');
	/** A tide's kind along x: a squeeze where it is positive, a stretch where negative. */
	const tideKind = (v: number) => (v < 0 ? 'stretch' : v > 0 ? 'squeeze' : 'still');

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, H: 432, S: 60, cx: 186, cy: 186 }
			: { W: 640, H: 460, S: 74, cx: 244, cy: 232 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const signed = (n: number) => (n < 0 ? `−${-n}` : String(n));

	/** A point in spacings on the page: y up. */
	const page = (p: [number, number]) => ({ x: box.cx + box.S * p[0], y: box.cy - box.S * p[1] });

	/** How far the frame of the lines reaches from the centre, in spacings. */
	const REACH = 2.75;

	/** The frame the lines are cut to, fixed whatever the wave does. */
	const frame = $derived({
		left: box.cx - box.S * REACH,
		right: box.cx + box.S * REACH,
		top: box.cy - box.S * REACH,
		bottom: box.cy - box.S * -REACH
	});
	/** Lines a little beyond the frame, so that a stretch never leaves it bare at the edge. */
	const LINES = Array.from({ length: 15 }, (_, i) => (i - 7) / 2);

	const lines = $derived.by(() => {
		const inside = (v: number, a: number, b: number) => v >= a - 0.5 && v <= b + 0.5;
		const vertical = LINES.map((n) => ({
			n,
			whole: Number.isInteger(n),
			x: box.cx + box.S * linesAt(n, settings, view).x
		})).filter((l) => inside(l.x, frame.left, frame.right));
		const horizontal = LINES.map((n) => ({
			n,
			whole: Number.isInteger(n),
			y: box.cy - box.S * linesAt(n, settings, view).y
		})).filter((l) => inside(l.y, frame.top, frame.bottom));
		return { vertical, horizontal };
	});

	const dots = $derived(RINGS.flatMap((r) => r.balls.map((b) => page(drawnAt(b, settings, view)))));

	const arrowEnds = $derived.by(() => {
		const a = page(drawnAt(MARKED[0], settings, view));
		const b = page(drawnAt(MARKED[1], settings, view));
		const inset = 4.5 * u;
		const dx = b.x - a.x;
		const l = Math.abs(dx);
		if (l < 2 * inset + 4 * u) return undefined;
		const s = Math.sign(dx);
		const x1 = a.x + s * inset;
		const x2 = b.x - s * inset;
		const head = Math.min(5 * u, 0.3 * (l - 2 * inset));
		const w = 2.6 * u;
		const y = a.y;
		return {
			d: `M${f2(x1 + s * head * 0.9)},${f2(y)}L${f2(x2 - s * head * 0.9)},${f2(y)}`,
			heads: [
				`${f2(x1)},${f2(y)} ${f2(x1 + s * head)},${f2(y - w)} ${f2(x1 + s * head)},${f2(y + w)}`,
				`${f2(x2)},${f2(y)} ${f2(x2 - s * head)},${f2(y - w)} ${f2(x2 - s * head)},${f2(y + w)}`
			]
		};
	});

	// --- the words --------------------------------------------------------------------------------------------------
	const viewName = $derived(view === 'rulers' ? 'as rulers measure' : 'at their labels x′, y′');

	/** A few short lines beside the grid on what it shows. */
	const status = $derived.by(() => {
		if (gauge === 0 && wave === 0) return ['flat spacetime,', 'nothing moves'];
		if (view === 'rulers') {
			if (wave === 0) return ['the labels ripple;', 'the balls stay put'];
			if (gauge === 0) return ['the balls move apart', 'and together'];
			return ['the labels ripple;', 'the balls move apart', 'and together'];
		}
		if (wave === 0) return ['the balls’ labels ripple:', 'on paper, a wave'];
		if (gauge === 0) return ['each ball keeps its', 'labels; the metric', 'between them changes'];
		return ['the labels ripple;', 'the metric between', 'the balls changes'];
	});

	const pairLines = $derived([
		'the arrow’s pair:',
		`proper separation ${marked.proper.toFixed(3)}`,
		`labels ${marked.labels.toFixed(3)} apart`
	]);

	const scaleLines = $derived(
		wave > 0
			? ['drawn at true size;', `h₊ = ${setting(wave)} is ${overLigo(wave)}`, 'times LIGO’s waves']
			: ['lengths in ring spacings']
	);

	/** The words beside the grid, on a wide screen to its right, on a phone under it. */
	const words = $derived.by(() => {
		const out: { text: string; cls: string; x: number; y: number }[] = [];
		if (phone.current) {
			const y0 = frame.bottom + 26;
			const col = (lines: string[], x: number, y: number, cls: string) =>
				lines.forEach((text, i) => out.push({ text, cls, x, y: y + 14 * i }));
			col([viewName, ...status], 10, y0, 'small');
			col(
				[...pairLines, wave > 0 ? `true size: ${overLigo(wave)} × LIGO’s` : scaleLines[0]],
				192,
				y0,
				'small dim'
			);
			out[0].cls = 'label';
			return out;
		}
		const x = 476;
		let y = 44;
		out.push({ text: viewName, cls: 'label', x, y });
		y += 22;
		for (const text of status) {
			out.push({ text, cls: 'small', x, y });
			y += 15;
		}
		y += 14;
		for (const text of pairLines) {
			out.push({ text, cls: 'small dim', x, y });
			y += 15;
		}
		y = box.H - 22 - 15 * (scaleLines.length - 1);
		for (const text of scaleLines) {
			out.push({ text, cls: 'small dim', x, y });
			y += 15;
		}
		return out;
	});

	const description = $derived(
		`A grid of 5 by 5 rings of 12 free balls, drawn ${view === 'rulers' ? 'as rulers measure them' : 'at their coordinate labels'}, over thin coordinate lines; each ring's undisturbed circle is dashed. ` +
			(gauge > 0
				? `A gauge shift of ${setting(gauge)} ring spacings relabels the events, x′ = x + ε cos(kx − ωt): ` +
					(view === 'rulers'
						? 'the coordinate lines and their labels ripple along x while every ball stays where it was. '
						: 'the balls’ labels ripple along x, so on paper the rings squeeze and stretch like a wave. ')
				: '') +
			(wave > 0
				? `A plus-polarized wave of strain ${setting(wave)} passes out of the screen: ` +
					(view === 'rulers'
						? 'the rings stretch along x and squeeze along y, then the other way, once a period. '
						: 'each ball keeps its labels, and the metric between them stretches and squeezes. ')
				: '') +
			`The proper separations of neighbouring balls change by at most ${two(peak)} over a period, and the tide at the centre reaches ${two(tidePeak)} ω².`
	);

	const summary = $derived(
		`Largest change in proper separation over a period: ${two(peak)}. Largest tide at the centre: ${two(tidePeak)} ω².`
	);

	// --- the formulas -----------------------------------------------------------------------------------------------
	const E = '\\htmlClass{q-curv}{\\mathcal E}';
	const H = '\\htmlClass{q-field}{h}';
	const Hp = (i: string) => `\\htmlClass{q-field}{h'}_{${i}}`;
	const HPLUS = '\\htmlClass{q-field}{h_+}';
</script>

<div class="gauge-or-wave">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Only the gauge shift is on. The coordinate lines ripple. Do the balls move relative to one
				another?
			{:else if step === 2}
				Turn the gauge shift off and the wave on. What changes now?
			{:else}
				Turn both on. Which readout does the gauge shift affect?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No.</strong> The separations change by 0 and the tide is 0. The table is not small:
				<Tex math={`${Hp('xx')} = 2\\epsilon k\\sin(kx - \\omega t)`} trust /> reaches <Tex
					math={`2\\epsilon k = ${texTwo(gaugeSizes(firstGauge).xx)}`}
				/> for <Tex math={`\\epsilon = ${setting(firstGauge)}`} />, and <Tex
					math={`${Hp('0x')} = -(\\epsilon\\omega/c)\\sin(kx - \\omega t)`}
					trust
				/> ripples with it at the speed <Tex math="\omega/k" />, here a tenth of <Tex math="c" />.
				But it came from flat spacetime, so it is pure gauge and its curvature is zero. Each ball
				keeps its place; only its label <Tex math="x + \epsilon\cos(kx - \omega t)" /> ripples. Switch
				the drawing to the labels to see the ripple as a wave on paper.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>The balls really move.</strong> As rulers measure, the rings become ellipses,
				stretched along <Tex math="x" /> and squeezed along <Tex math="y" />, then the other way,
				once a period. The separations change by up to <Tex
					math={`${HPLUS}/2 = ${texTwo(peakChange(secondK))}`}
					trust
				/>, and the tide <Tex math={`${E}_{xx} = -\\tfrac12\\partial_t^2 ${HPLUS}`} trust /> swings between
				<Tex math={`\\pm${texTwo(peakTide(secondK))}\\,\\omega^2`} />: this table has curvature.
				Drawn at their labels, the balls keep their places, because in the wave's
				transverse-traceless form the labels ride with the balls; only the metric shows the stretch.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>Neither.</strong> The labels ripple on top of the wave, and the table changes, but
				the separations still change by up to <Tex math={texTwo(peakChange(thirdK))} /> and the tide still
				reaches <Tex math={`${texTwo(peakTide(thirdK))}\\,\\omega^2`} />, as with the wave alone. A
				change of coordinates alters the table <Tex math={`${H}_{\\mu\\nu}`} trust />, never the
				curvature, so nothing a pixel reads depends on it.
			{:else if step === 1}
				The answer appears once only the gauge shift is on and you have watched the ripple for half
				a period, or set the shift yourself.
			{:else if step === 2}
				The answer appears once the gauge shift is at 0 and the wave is on.
			{:else}
				The answer appears once both the gauge shift and the wave are on.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-frame">
					<rect
						x={frame.left}
						y={frame.top}
						width={frame.right - frame.left}
						height={frame.bottom - frame.top}
					/>
				</clipPath>
			</defs>

			<!-- the coordinate lines, cut to the frame, with their labels riding on them -->
			<g class="grid" clip-path="url(#{uid}-frame)">
				{#each lines.vertical as l (l.n)}
					<line
						class={{ whole: l.whole }}
						x1={f2(l.x)}
						y1={frame.top}
						x2={f2(l.x)}
						y2={frame.bottom}
					/>
				{/each}
				{#each lines.horizontal as l (l.n)}
					<line
						class={{ whole: l.whole }}
						x1={frame.left}
						y1={f2(l.y)}
						x2={frame.right}
						y2={f2(l.y)}
					/>
				{/each}
			</g>
			{#each lines.vertical.filter((l) => l.whole && Math.abs(l.n) <= 2) as l (l.n)}
				<text class="tick mid" x={f2(l.x)} y={f2(frame.top - 7 * u)}>{signed(l.n)}</text>
			{/each}
			{#each lines.horizontal.filter((l) => l.whole && Math.abs(l.n) <= 2) as l (l.n)}
				<text class="tick end-anchor" x={f2(frame.left - 6 * u)} y={f2(l.y + 3.5 * u)}
					>{signed(l.n)}</text
				>
			{/each}
			<text class="tick axis-name end-anchor" x={frame.right} y={f2(frame.top - 7 * u)}>x′</text>
			<text class="tick axis-name end-anchor" x={f2(frame.left - 6 * u)} y={f2(frame.top - 7 * u)}
				>y′</text
			>

			<!-- each ring as it was -->
			{#each RINGS as r, i (i)}
				{@const c = page(r.centre)}
				<circle class="start" cx={f2(c.x)} cy={f2(c.y)} r={f2(RADIUS * box.S)} />
			{/each}

			<!-- the balls -->
			{#each dots as q, i (i)}
				<circle class="ball" cx={f2(q.x)} cy={f2(q.y)} r={(phone.current ? 2.1 : 2.5) * u} />
			{/each}

			<!-- the marked pair's separation -->
			{#if arrowEnds}
				<g class={['pair', kind(marked.d)]}>
					<path d={arrowEnds.d} />
					{#each arrowEnds.heads as h, i (i)}
						<polygon points={h} />
					{/each}
				</g>
			{/if}

			<!-- the words, beside the geometry -->
			{#each words as w, i (i)}
				<text class="{w.cls} start-anchor" x={w.x} y={w.y}>{w.text}</text>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="dot"></span><span>a free ball</span></li>
			<li><span class="swatch start-key"></span><span>its ring as it was</span></li>
			<li><span class="swatch grid-key"></span><span>the coordinate lines x′, y′</span></li>
			<li>
				<span class="swatch pair-key"></span><span
					>a pair of neighbours: <span class="stretch">longer</span>,
					<span class="squeeze">shorter</span></span
				>
			</li>
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => gauge, setGauge, GAUGE)}
				role="presentation"
			>
				<Slider
					id="{uid}-gauge"
					label="Gauge shift ε"
					icon={Tag01Icon}
					min={GAUGE.min}
					max={GAUGE.max}
					step={GAUGE.step}
					bind:value={() => gauge, setGauge}
					readout="ε = {setting(gauge)} of the ring spacing"
					marks={[
						{ at: 0, label: 'no relabelling' },
						{ at: OPENING.gauge, label: '0.2, as the figure opens' }
					]}
					marksHint="the ticks mark no relabelling and the opening’s 0.2"
				/>
			</div>
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => wave, setWave, WAVE)}
				role="presentation"
			>
				<Slider
					id="{uid}-wave"
					label="Real wave h₊"
					icon={WaveIcon}
					min={WAVE.min}
					max={WAVE.max}
					step={WAVE.step}
					bind:value={() => wave, setWave}
					readout="h₊ = {setting(wave)}"
					marks={[
						{ at: 0, label: 'no wave' },
						{ at: 0.2, label: '0.2, 2 × 10²⁰ times LIGO’s waves' }
					]}
					marksHint="the ticks mark no wave and 0.2"
				/>
			</div>
		</div>

		<div class="controls">
			<button
				type="button"
				class="action"
				aria-pressed={playing}
				onclick={() => (playing = !playing)}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.7} />
					Pause
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
					Play
				{/if}
			</button>
			<div class="view">
				<Segmented
					label="Draw the balls"
					bind:value={() => view, (v: View) => (view = v)}
					options={[
						{ value: 'rulers', label: 'As rulers measure', icon: RulerIcon },
						{ value: 'labels', label: 'At their labels', icon: GridIcon }
					]}
				/>
			</div>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
		</div>
		<p class="hint">
			Reach both sliders, the play button and the switch with Tab; the arrow keys step the sliders,
			Shift by larger steps. Press a tick under a slider to go to its value.
		</p>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>Separations</dt>
				<dd>
					<span class="also"
						>largest change in the proper separation of neighbouring balls, as a fraction: now <span
							class={['value', kind(change)]}>{two(change)}</span
						>; at most <span class="value plain">{two(peak)}</span> over a period</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Tide at the centre</dt>
				<dd>
					<span class="eq"
						><Tex math={`${E}_{xx} = -\\tfrac12\\partial_t^2 ${HPLUS} =`} trust /></span
					><span class="also"
						><span class={['value', tideKind(tideNow)]}>{two(tideNow)}</span> ω² now{#if tidePeak > 0};
							between ±<span class="value plain">{two(tidePeak)}</span> ω² over a period{:else}, and
							at every moment{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The table at the centre</dt>
				<dd>
					<span class="also"
						><Tex math={Hp('xx')} trust /> = <span class="value plain">{two(hxx)}</span>, <Tex
							math={Hp('0x')}
							trust
						/> = <span class="value plain">{two(h0x)}</span> now; the gauge part reaches <Tex
							math="2\epsilon k"
						/> = <span class="value plain">{two(sizes.xx)}</span> and <Tex
							math="\epsilon\omega/c"
						/> =
						<span class="value plain">{two(sizes.tx)}</span>, rippling at <Tex math="\omega/k" /> =
						<Tex math={`c/${Math.round(1 / SPEED)}`} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The relabelling is the chapter’s <Tex math="\zeta_x = \epsilon\cos(kx - \omega t)" />, with <Tex
				math="k = \pi/2"
			/> per ring spacing, a wavelength of four rings. The wave is <Tex
				math={`${Hp('xx')} = -${Hp('yy')} = ${HPLUS}\\cos\\omega t`}
				trust
			/> in the plane of the screen. A separation is read from the metric, to first order: the change
			of the two balls’ labels along the line between them, plus half the table <Tex
				math={`${Hp('ij')}n^in^j`}
				trust
			/> averaged along it; neighbours are next to each other on a ring, or face each other across a gap.
			The tide is <Tex math={`${E}_{ij} = c^2 \\htmlClass{q-curv}{R}_{0i0j}`} trust />, from the
			linearized curvature of the whole table. A positive change is a
			<span class="stretch">stretch</span>, a negative one a <span class="squeeze">squeeze</span>; a
			positive <Tex math={`${E}_{xx}`} trust /> squeezes along <Tex math="x" />.
		</p>
	</div>
</div>

<style>
	.gauge-or-wave {
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 40% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.stage svg {
		display: block;
		width: 100%;
		max-width: 640px;
		height: auto;
		margin: 0 auto;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
	}

	.tick {
		font-size: calc(10px * var(--u, 1));
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		font-style: italic;
		fill: var(--text-dim);
	}

	.mid {
		text-anchor: middle;
	}

	.start-anchor {
		text-anchor: start;
	}

	.end-anchor {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-faint);
	}

	.grid line {
		stroke: color-mix(in srgb, var(--text) 16%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.grid line.whole {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.start {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ball {
		fill: var(--q-obs);
	}

	.pair path {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.pair polygon {
		fill: var(--text);
	}

	.pair.stretch path {
		stroke: var(--accent);
	}

	.pair.stretch polygon {
		fill: var(--accent);
	}

	.pair.squeeze path {
		stroke: var(--accent-2);
	}

	.pair.squeeze polygon {
		fill: var(--accent-2);
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.45rem 0.2rem 0;
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

	.dot {
		flex: none;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--q-obs);
	}

	.swatch {
		display: inline-block;
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 2px solid;
	}

	.start-key {
		border-top-style: dashed;
		border-top-width: 1.5px;
		border-color: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.grid-key {
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.pair-key {
		border-top-width: 1.5px;
		border-color: var(--text);
	}

	.legend .stretch,
	.note .stretch {
		color: var(--accent);
	}

	.legend .squeeze,
	.note .squeeze {
		color: var(--accent-2);
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

	.view {
		flex: 1 1 18rem;
		min-width: 0;
		max-width: 24rem;
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
		grid-template-columns: 9.5rem minmax(0, 1fr);
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
		gap: 0.15rem 0.5rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.value {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.value.stretch {
		color: var(--accent);
	}

	.value.squeeze {
		color: var(--accent-2);
	}

	.value.still {
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
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
