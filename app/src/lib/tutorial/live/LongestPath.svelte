<script lang="ts">
	/**
	 * Chapter 7.1's tossed clock, made interactive. A plane of height against coordinate time in a uniform field g,
	 * the ground its time axis, with the throw at t = 0 and the catch at t = T on it. The reader shapes a path between
	 * them with three handles, at T/4, T/2 and 3T/4, and the path is the quartic through the two events and the
	 * three handles, kept above the ground; free fall's parabola z = ½gt(T − t) is drawn faintly dashed beside it.
	 * The readouts give each path's gain of proper time over a clock that stays on the ground, and their ratio, from
	 * ./longest-path.ts. Sliders set T and g; at the neutron star a warning says the weak field fails. Three
	 * predictions at the top are answered once the reader has done what each asks. "Fall freely" eases the handles
	 * onto the parabola, at once under reduced motion; nothing else moves by itself.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		FallingStarIcon,
		GravityIcon,
		HourglassIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		AT,
		BODIES,
		EARTH,
		FIRST_START,
		FREE,
		MOON,
		OPENING,
		STAR,
		TENTHS,
		TOP,
		firstAnswer,
		freeGain,
		freePoints,
		gain,
		gainReading,
		keyStep,
		metres,
		noteFirst,
		noteSecond,
		noteThird,
		nudged,
		pathPoints,
		peak,
		placed,
		same,
		sciTex,
		secondAnswer,
		seconds,
		thirdAnswer,
		three,
		threeTex,
		tickLabel,
		ticks,
		top,
		tossed,
		superscript,
		type Body,
		type FirstSeen,
		type Handles
	} from './longest-path';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let handles = $state<Handles>(OPENING.handles);
	let tenths = $state(OPENING.tenths);
	let body = $state<Body>(OPENING.body);

	const T = $derived(seconds(tenths));
	const g = $derived(BODIES[body].g);
	const H = $derived(peak(g, T));

	function setHandles(f: Handles) {
		if (same(f, handles)) return;
		handles = f;
		first = noteFirst(first, f);
	}

	function setT(v: number) {
		const next = Math.max(TENTHS.min, Math.min(TENTHS.max, Math.round(v * 10)));
		if (next === tenths) return;
		tenths = next;
		noteSettings();
	}

	function setBody(v: number) {
		const next = Math.max(0, Math.min(2, Math.round(v))) as Body;
		if (next === body) return;
		body = next;
		noteSettings();
	}

	/** "Fall freely": the handles ease onto the parabola in 0.4 s, or go there at once under reduced motion. */
	let frame = 0;
	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	}

	function fall() {
		stop();
		const from = handles;
		if (prefersReducedMotion.current || same(from, FREE)) {
			setHandles(FREE);
			return;
		}
		const start = performance.now();
		const tick = (now: number) => {
			const k = Math.min(1, (now - start) / 400);
			const e = cubicOut(k);
			if (k >= 1) {
				frame = 0;
				setHandles(FREE);
				return;
			}
			setHandles([0, 1, 2].map((i) => from[i] + (FREE[i] - from[i]) * e) as unknown as Handles);
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	$effect(() => stop);

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state<FirstSeen>(noteFirst(FIRST_START, OPENING.handles));
	let second = $state(false);
	let third = $state(false);

	function noteSettings() {
		second = noteSecond(second, tenths, body);
		third = noteThird(third, tenths, body);
	}

	const revealed = $derived(step === 1 ? first.done !== undefined : step === 2 ? second : third);
	const answer1 = $derived(first.done ? firstAnswer(first.done) : undefined);
	const answer1Top = $derived(first.done ? top(first.done) : 1);
	const answer2 = secondAnswer();
	const answer3 = thirdAnswer();

	// --- the numbers ------------------------------------------------------------------------------------------------
	const TAU = '\\htmlClass{q-obs}{\\tau}';
	const V = '\\htmlClass{q-obs}{v}';
	const PHI = '\\htmlClass{q-field}{\\Phi}';
	const E16 = '\\times 10^{-16}\\,\\mathrm{s}';
	const T2 = 'T = 2\\,\\mathrm{s}';

	const mine = $derived(gain(handles, g, T));
	const free = $derived(freeGain(g, T));
	const ratio = $derived(mine / free);
	const closed = $derived(tossed(g, T));
	const myTop = $derived(top(handles) * H);

	/** A gain in LaTeX, in units of 10⁻¹⁶ s, or of seconds at the neutron star. */
	const gainTex = (v: number) => {
		const r = gainReading(v, body);
		return r.unit === 's' ? `${r.tex}\\,\\mathrm{s}` : `${r.tex}${E16}`;
	};
	const gainWords = (v: number) => {
		const r = gainReading(v, body);
		return r.unit === 's' ? `${r.number} s` : `${r.number} × 10⁻¹⁶ s`;
	};
	const metresTex = (z: number) => (Math.abs(z) >= 1e4 ? sciTex(z) : threeTex(z));
	/** Free fall's speed at the throw, gT/2, as a multiple of light's. */
	const launch = $derived((g * T) / 2 / 299_792_458);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, left: 34, top: 30, right: 38, bottom: 40, PH: 230 }
			: { W: 560, left: 42, top: 32, right: 46, bottom: 42, PH: 300 }
	);
	const PW = $derived(box.W - box.left - box.right);
	const HT = $derived(box.top + box.PH + box.bottom);
	/** The top of the drawing, twice free fall's highest point. */
	const zTop = $derived(TOP * H);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const X = (t: number) => box.left + (t / T) * PW;
	const Y = (z: number) => box.top + box.PH - (z / zTop) * box.PH;
	const line = (pts: { t: number; z: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f2(X(q.t))},${f2(Y(q.z))}`).join('');

	const myPath = $derived(line(pathPoints(handles, g, T)));
	const freePath = $derived(line(freePoints(g, T)));

	const tTicks = $derived(ticks(T));
	const zTicks = $derived(ticks(zTop));
	const zUnit = $derived(zTicks.power ? `10${superscript(zTicks.power)} m` : 'm');

	const knobs = $derived(
		AT.map((s, k) => ({
			k: k as 0 | 1 | 2,
			t: s * T,
			z: handles[k] * H,
			x: X(s * T),
			y: Y(handles[k] * H)
		}))
	);

	// --- dragging the handles -------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<0 | 1 | 2 | undefined>();

	function heightAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return ((box.top + box.PH - q.y) / box.PH) * zTop;
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let moveFrame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (moveFrame) return;
		moveFrame = requestAnimationFrame(() => {
			moveFrame = 0;
			if (dragging !== undefined && pending) {
				const z = heightAt(pending);
				if (z !== undefined) setHandles(placed(handles, dragging, z, g, T));
			}
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, k: 0 | 1 | 2) {
		if (e.button !== 0) return;
		// a drag is not a click: the handle does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		stop();
		svg?.setPointerCapture(e.pointerId);
		dragging = k;
		schedule(e);
	}

	function move(e: PointerEvent) {
		if (dragging !== undefined) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, k: 0 | 1 | 2) {
		const d = { ArrowUp: 1, ArrowDown: -1 }[e.key];
		if (d === undefined) return;
		e.preventDefault();
		stop();
		setHandles(nudged(handles, k, d * keyStep(body, e.shiftKey, g, T), g, T));
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const PLACES = ['T/4', 'T/2', '3T/4'];
	const knobText = (k: 0 | 1 | 2) =>
		`${metres(handles[k] * H)} metres; free fall's is ${metres(FREE[k] * H)} metres`;
	const knobLabel = (k: 0 | 1 | 2) =>
		`Handle at t = ${PLACES[k]} = ${three(AT[k] * T)} seconds. Drag it up or down, or move it with the arrow keys.`;

	const description = $derived(
		`A plane of height against time in a uniform field of ${BODIES[body].name}, g = ${metres(g)} metres per second squared: time t across from 0 to ${three(T)} seconds, height upward to ${metres(zTop)} metres, the ground along the time axis. ` +
			`The throw, at t = 0, and the catch, at t = ${three(T)} seconds, are on the ground. ` +
			`Your path passes through heights of ${knobs.map((q) => metres(q.z)).join(', ')} metres at t = ${knobs.map((q) => three(q.t)).join(', ')} seconds and rises to ${metres(myTop)} metres; ` +
			`free fall's parabola passes through ${knobs.map((q) => metres(FREE[q.k] * H)).join(', ')} metres and rises to ${metres(H)} metres. ` +
			`Your path gains ${gainWords(mine)} over a clock that stays on the ground, free fall ${gainWords(free)}: a ratio of ${three(ratio)}.`
	);

	const STOPS = BODIES.map((b, i) => ({
		at: i,
		label: `${b.name}, ${i === STAR ? '1.3 × 10¹²' : b.g} m s⁻²`
	}));
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="longest-path">
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
				Between the same two events, which path ages most: staying on the ground, rising higher than
				a thrown ball, or the thrown ball’s own path?
			{:else if step === 2}
				Double the flight time to 4 s. How much more does the thrown clock gain?
			{:else}
				On the Moon, with the same <Tex math={T2} />, how large is the gain?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && answer1}
				<strong>The thrown ball’s.</strong> Staying on the ground gains 0, and any other path gains
				less than free fall’s <Tex math={`${threeTex(answer1.free / 1e-16)}${E16}`} /> at
				<Tex math={T2} /> on the Earth. The path <Tex math="a\,z(t)" /> gains <Tex
					math="2a - a^2"
				/> times as much, so half or 1.5 times the height gains <Tex math="\tfrac34" /> of it, <Tex
					math={`${threeTex(answer1.half / 1e-16)}${E16}`}
				/>. Your higher path rose to <Tex math={threeTex(answer1Top)} /> times the ball’s height and gained
				<Tex math={threeTex(answer1.ratio)} /> times free fall’s gain{#if answer1.ratio < 0}: its
					clock fell behind even the one that stayed on the ground{/if}. A higher clock spends its
				time where clocks run faster, but it must move faster to get there and back, and speed slows
				a clock.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Eight times,</strong> since the gain is <Tex math="g^2T^3/24c^2" /> and
				<Tex math="2^3 = 8" />: <Tex math={`${threeTex(answer2.four / 1e-16)}${E16}`} /> =
				<Tex math={`${threeTex(answer2.four / 1e-15)}\\times 10^{-15}\\,\\mathrm{s}`} />. The ball
				rises four times as high, to <Tex
					math={`gT^2/8 = ${threeTex(peak(BODIES[EARTH].g, 4))}\\,\\mathrm{m}`}
				/>, and moves twice as fast. Any path you shape grows by the same factor, since changing
				<Tex math="T" /> stretches it with the parabola.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong
					><Tex math={`(1.62/9.81)^2 = ${threeTex(answer3.squared)}`} /> times the Earth’s,
					<Tex math={`${threeTex(answer3.moon / 1e-16)}${E16}`} />.</strong
				>
				The gain goes as <Tex math="g^2" />: the weaker field lowers both the ball’s height, to
				<Tex math={`gT^2/8 = ${threeTex(peak(BODIES[MOON].g, 2))}\\,\\mathrm{m}`} />, and the rate a
				clock gains for each metre of it, <Tex math="g/c^2" />.
			{:else if step === 1}
				The answer appears once you have tried a path that stays on the ground and one that rises
				higher than the ball.
			{:else if step === 2}
				The answer appears once you have set <Tex math="T" /> to 4 s on the Earth.
			{:else}
				The answer appears once you have set <Tex math="g" /> to the Moon’s, with
				<Tex math={T2} />.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {HT}"
			role="group"
			aria-label={description}
			class={{ dragging: dragging !== undefined }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect x={box.left} y={box.top - 6 * u} width={PW} height={box.PH + 6 * u} />
				</clipPath>
			</defs>

			<rect class="panel" x={box.left} y={box.top} width={PW} height={box.PH} />

			<!-- the grid, at the height ticks -->
			{#each zTicks.values as v (v)}
				{#if v > 0}
					<line
						class="grid"
						x1={box.left}
						x2={box.left + PW}
						y1={Y(v * 10 ** zTicks.power)}
						y2={Y(v * 10 ** zTicks.power)}
					/>
				{/if}
			{/each}

			<!-- the handles' tracks -->
			{#each knobs as q (q.k)}
				<line class="track" x1={q.x} x2={q.x} y1={box.top} y2={box.top + box.PH} />
			{/each}

			<!-- the axes: the ground clock along the time axis -->
			<line class="axis" x1={box.left} x2={box.left + PW} y1={Y(0)} y2={Y(0)} />
			<line class="axis" x1={box.left} x2={box.left} y1={box.top} y2={box.top + box.PH} />

			<g clip-path="url(#{uid}-plot)">
				<path class="free" d={freePath} />
				<path class="mine" d={myPath} />
			</g>

			<!-- the ticks -->
			{#each tTicks.values as v (v)}
				<line class="tick" x1={X(v)} x2={X(v)} y1={Y(0)} y2={Y(0) + 4 * u} />
				<text class="small dim mid" x={X(v)} y={Y(0) + 15 * u}>{tickLabel(v, tTicks.step)}</text>
			{/each}
			{#each zTicks.values as v (v)}
				<line
					class="tick"
					x1={box.left - 4 * u}
					x2={box.left}
					y1={Y(v * 10 ** zTicks.power)}
					y2={Y(v * 10 ** zTicks.power)}
				/>
				<text class="small dim end" x={box.left - 7 * u} y={Y(v * 10 ** zTicks.power) + 4 * u}
					>{tickLabel(v, zTicks.step)}</text
				>
			{/each}

			<!-- the names of the axes -->
			<text class="label start" x={box.left + PW + 11 * u} y={Y(0) + 4 * u}
				><tspan class="it">t</tspan> (s)</text
			>
			<text class="label start" x={box.left - 30 * u} y={box.top - 12 * u}>height ({zUnit})</text>

			<!-- the two events -->
			{#each [{ name: 'throw', t: 0 }, { name: 'catch', t: T }] as ev (ev.name)}
				<circle class="event" cx={X(ev.t)} cy={Y(0)} r={4.5 * u} />
				<text class="name mid" x={X(ev.t)} y={Y(0) + 31 * u}>{ev.name}</text>
			{/each}

			<!-- the three handles -->
			{#each knobs as q (q.k)}
				<g
					class="handle"
					transform="translate({f2(q.x)} {f2(q.y)})"
					role="slider"
					tabindex="0"
					aria-orientation="vertical"
					aria-label={knobLabel(q.k)}
					aria-valuemin={0}
					aria-valuemax={zTop}
					aria-valuenow={q.z}
					aria-valuetext={knobText(q.k)}
					onpointerdown={(e) => grab(e, q.k)}
					onkeydown={(e) => key(e, q.k)}
				>
					<circle class="hit" r={22 * u} />
					<circle class="focus" r={11 * u} />
					<circle class="knob" r={6 * u} />
				</g>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch mine-key"></span><span>your path, through the three handles</span>
			</li>
			<li>
				<span class="swatch free-key"></span><span
					>free fall, <Tex math="z = \tfrac12 gt(T - t)" /></span
				>
			</li>
			<li>
				<span class="swatch ground-key"></span><span>the clock that stays on the ground</span>
			</li>
		</ul>
	</div>

	<div class="bar">
		<div class="controls">
			<button type="button" class="action" onclick={fall}>
				<HugeiconsIcon icon={FallingStarIcon} size={16} strokeWidth={1.7} />
				Fall freely
			</button>
			<Slider
				id="{uid}-T"
				label="Flight time"
				icon={HourglassIcon}
				min={TENTHS.min / 10}
				max={TENTHS.max / 10}
				step={0.1}
				bind:value={() => T, setT}
				readout="T = {T.toFixed(1)} s"
				ends={['0.5 s', '4 s']}
				marks={[
					{ at: 2, label: 'T = 2 s, the chapter’s toss' },
					{ at: 4, label: 'T = 4 s, twice as long' }
				]}
				marksHint="the ticks mark the chapter’s 2 s and twice that"
			/>
			<Slider
				id="{uid}-g"
				label="Field"
				icon={GravityIcon}
				min={0}
				max={2}
				step={1}
				bind:value={() => body, setBody}
				readout={STOPS[body].label}
				ends={['Earth', 'neutron star']}
				marks={STOPS}
				marksHint="the three stops: the Earth, the Moon and a neutron star"
			/>
		</div>
		{#if body === STAR}
			<p class="warn" role="status">
				<HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={1.7} />
				<span
					>weak field fails: <Tex math={`|${PHI}|/c^2 \\approx 0.17`} trust /> at the surface</span
				>
			</p>
		{/if}
		<p class="hint">
			Drag the three handles up and down, or reach each with Tab and move it 0.1 m with the arrow
			keys (with Shift, 1 m); at the neutron star a step is a fiftieth of free fall’s height (with
			Shift, a fifth). The sliders take the arrow keys after Tab.
		</p>
	</div>

	<div class="readouts">
		<dl aria-live="polite">
			<div class="row">
				<dt>Your path gains</dt>
				<dd>
					{@render eq([`\\Delta${TAU} = ${gainTex(mine)}`])}<span class="also"
						>it rises to <Tex math={`${metresTex(myTop)}\\,\\mathrm{m}`} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Free fall gains</dt>
				<dd>
					{@render eq([`\\Delta${TAU} = ${gainTex(free)}`])}<span class="also"
						>the chapter’s <Tex math={`g^2T^3/24c^2 = ${gainTex(closed)}`} />; it rises to <Tex
							math={`gT^2/8 = ${metresTex(H)}\\,\\mathrm{m}`}
						/>{#if body === STAR}, and would leave the ground at <Tex
								math={`gT/2 = ${sciTex(launch)}\\,c`}
							/>, faster than light{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Your path / free fall</dt>
				<dd>
					{@render eq([`${threeTex(ratio)}`])}{#if same(handles, FREE)}<span class="also"
							>you are on the parabola</span
						>{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			Each gain is the proper time a clock carried along the path records, less that of a twin that
			stays on the ground between the same two events: the chapter’s <Tex
				math={`\\Delta${TAU} = \\frac{1}{c^2}\\int_0^T\\bigl(gz - \\tfrac12 ${V}^2\\bigr)\\,\\mathrm{d}t`}
				trust
			/>, with <Tex math={`${PHI}(z) - ${PHI}(0) = gz`} trust />, summed by the trapezoid rule on
			400 steps. Your path is the quartic through the throw, the catch and the three handles, kept
			on the ground where it would dip below it; through handles on the parabola it is the parabola.
			Changing
			<Tex math="T" /> or <Tex math="g" /> stretches your path with the parabola, so its ratio to free
			fall stays the same.
		</p>
	</div>
</div>

<style>
	.longest-path {
		/* the clocks' paths in the observer's colour, as the chapter colours τ and v; the axes, the events and free
		   fall's parabola in the ink */
		--obs: var(--q-obs);
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
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
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 560px;
		height: auto;
		margin: 0 auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the handles take a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .handle {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 500;
		fill: var(--text);
	}

	.name {
		fill: var(--text);
		font: 600 calc(12px * var(--u, 1)) / 1 var(--font-sans);
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

	.dim {
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.track {
		stroke: color-mix(in srgb, var(--obs) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.free {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.mine {
		fill: none;
		stroke: var(--obs);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.event {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.handle {
		cursor: grab;
		touch-action: none;
	}

	.handle:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.knob {
		fill: var(--obs);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	@media (hover: hover) {
		.handle:hover .knob {
			stroke: var(--text);
		}
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

	.swatch {
		display: inline-block;
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.mine-key {
		border-top-width: 2px;
		border-color: var(--obs);
	}

	.free-key {
		border-top-style: dashed;
		border-color: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.ground-key {
		border-color: color-mix(in srgb, var(--text) 70%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.controls {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
		gap: 0.7rem 1.4rem;
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

	.warn {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
		background: color-mix(in srgb, var(--accent) 8%, var(--bg));
		font: 500 0.8rem/1.35 var(--font-sans);
		color: var(--text);
	}

	.warn :global(svg) {
		flex: none;
		color: var(--accent);
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

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
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
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.controls {
			grid-template-columns: minmax(0, 1fr);
		}

		.action {
			justify-self: start;
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
