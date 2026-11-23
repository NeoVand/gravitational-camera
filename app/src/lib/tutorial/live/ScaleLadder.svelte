<script lang="ts">
	/**
	 * Chapter 0.6's ladder of scales: one logarithmic axis for the paper's tides, from 10⁻³³ to 10¹⁴ s⁻², and one
	 * for its lengths, from 10⁻¹⁸ to 10²¹ m, chosen by a switch. Each mark is a scene of the paper, with its value and
	 * the section that gives it. A pointer, dragged or moved a power of ten at a time with the arrow keys, reads off
	 * any value and how many powers of ten separate it from the nearest mark; pressing a mark brings the pointer onto
	 * it. The axis stands upright on a wide screen and lies flat on a phone, and the marks' words are moved apart
	 * where they crowd. The numbers come from ./scale-ladder.ts. A prediction at the top is answered once the reader
	 * has put the pointer on the two marks it names.
	 */
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import { GravityIcon, RulerIcon } from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import {
		ANSWER,
		ASKED,
		EOTVOS,
		LADDERS,
		ON,
		TIDES,
		clampTo,
		factor,
		markOf,
		nearest,
		plain,
		power,
		spread,
		texFriendly,
		texPlain,
		type LadderId,
		type Mark
	} from './scale-ladder';

	let which = $state<LadderId>('tides');
	const ladder = $derived(LADDERS[which]);

	/** The pointer on each ladder, as a power of ten: each keeps its own place when the other is shown. */
	let at = $state<Record<LadderId, number>>({
		tides: LADDERS.tides.start,
		lengths: LADDERS.lengths.start
	});
	const p = $derived(at[which]);

	// --- the prediction: the person's tide against the Moon's -------------------------------------------------------
	const person = markOf(TIDES, ASKED.to);
	const moon = markOf(TIDES, ASKED.from);
	let seen = $state({ person: false, moon: false });
	const answered = $derived(seen.person && seen.moon);

	/** Every move of the pointer comes here: it keeps the pointer on the axis and notes the marks it stands on. */
	function set(value: number) {
		const q = clampTo(ladder, Math.round(value * 1e9) / 1e9);
		at[which] = q;
		if (which !== 'tides') return;
		if (Math.abs(q - power(person.value)) < ON) seen.person = true;
		if (Math.abs(q - power(moon.value)) < ON) seen.moon = true;
	}

	const goTo = (m: Mark) => set(power(m.value));

	// --- the drawing's bounds: upright on a wide screen, flat on a phone ---------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);

	const WIDE = { w: 700, h: 470, axis: 236, T: 16, B: 454 };
	/** On a phone the axis lies below the marks' upright words, as low as the longest of them needs. */
	const FLAT = $derived.by(() => {
		// the longest words of either ladder, so that the switch below stays put
		const all = [...LADDERS.tides.marks, ...LADDERS.lengths.marks];
		const longest = Math.max(...all.map((m) => 0.86 * wide(flatText(m), 10)));
		const axis = Math.ceil(longest + 34 * u);
		return { w: 350, h: axis + 54 * u, axis, L: 16, R: 334 };
	});
	const size = $derived(phone.current ? { w: FLAT.w, h: FLAT.h } : { w: WIDE.w, h: WIDE.h });

	const [lo, hi] = $derived(ladder.range);
	/** A place on the axis, along it: down the page on a wide screen, across it on a phone. */
	const along = (q: number) =>
		phone.current
			? FLAT.L + ((q - lo) / (hi - lo)) * (FLAT.R - FLAT.L)
			: WIDE.B - ((q - lo) / (hi - lo)) * (WIDE.B - WIDE.T);
	const f1 = (n: number) => n.toFixed(1);

	/** Roughly how wide a line of words is, in drawing units, at a size in CSS pixels. */
	function wide(text: string, px: number) {
		return text.length * 0.56 * px * u;
	}
	/** The measured length of each mark's words, in drawing units, for the area that takes a press and a focus ring. */
	let measured = $state<Record<string, number>>({});
	const measureKey = (m: Mark) => `${phone.current ? 'flat' : 'wide'}:${m.id}`;
	function measure(m: Mark): Attachment<SVGTextElement> {
		return (node) => {
			const id = measureKey(m);
			// measured again when the words change size with the drawing, and once the site's fonts have loaded
			void u;
			const set = () => (measured[id] = node.getBBox().width);
			set();
			document.fonts?.ready.then(set);
		};
	}
	const lengthOf = (m: Mark, text: string, px: number) => measured[measureKey(m)] ?? wide(text, px);

	/** A mark's value as its label prints it: on a phone without the unit, which the axis names. */
	const flatValue = (m: Mark) => m.text.replace(/\s+s⁻²$/u, '');
	const flatText = (m: Mark) => `${m.short}  ${flatValue(m)}`;

	/** The ticks: one each power of ten, the labelled ones longer. */
	const minor = $derived(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i));
	const major = $derived(phone.current ? ladder.phoneTicks : ladder.ticks);
	const tickLabel = (n: number) => (n === 0 ? '1' : `10${superscript(n)}`);

	/** Each mark's words, on a wide screen in one line, on a phone upright, moved apart where they crowd. */
	const words = $derived.by(() => {
		const marks = ladder.marks;
		const want = marks.map((m) => along(power(m.value)));
		const placed = phone.current
			? spread(want, 13 * u, 8 * u, FLAT.w - 8 * u)
			: spread(want, 15 * u, WIDE.T, WIDE.B);
		return marks.map((m, i) => ({
			mark: m,
			at: want[i],
			label: placed[i],
			text: phone.current ? flatText(m) : m.name
		}));
	});

	/** A mark's leader, from its dot on the axis to its words. */
	function leader(a: number, b: number) {
		if (phone.current) {
			const y = FLAT.axis;
			return `M${f1(a)},${f1(y - 5 * u)}V${f1(y - 10 * u)}L${f1(b)},${f1(y - 18 * u)}V${f1(y - 21 * u)}`;
		}
		const x = WIDE.axis;
		return `M${f1(x + 5 * u)},${f1(a)}H${f1(x + 16 * u)}L${f1(x + 30 * u)},${f1(b)}H${f1(x + 35 * u)}`;
	}

	// --- the pointer -------------------------------------------------------------------------------------------------
	const value = $derived(10 ** p);
	const near = $derived(nearest(ladder, p));
	const gap = $derived(p - power(near.value));
	const on = $derived(Math.abs(gap) < ON);
	const pointerAt = $derived(along(p));
	const badge = $derived(plain(value, 2));
	const badgeWidth = $derived(wide(badge, 10.5) + 12 * u);
	/** On a phone the badge sits under the pointer, kept inside the drawing. */
	const badgeAt = $derived(
		Math.min(FLAT.w - 2 * u - badgeWidth / 2, Math.max(2 * u + badgeWidth / 2, pointerAt))
	);

	// --- moving the pointer: by pointer, by the keys, by a mark -----------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	/** A drag lands on a mark within this many CSS pixels of it, and otherwise on hundredths of a power of ten. */
	const SNAP = 7;

	function placeAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const s = phone.current ? pt.x : pt.y;
		let best: Mark | undefined;
		let closest = SNAP * u;
		for (const mark of ladder.marks) {
			const d = Math.abs(s - along(power(mark.value)));
			if (d < closest) {
				closest = d;
				best = mark;
			}
		}
		if (best) return goTo(best);
		const q = phone.current
			? lo + ((s - FLAT.L) / (FLAT.R - FLAT.L)) * (hi - lo)
			: lo + ((WIDE.B - s) / (WIDE.B - WIDE.T)) * (hi - lo);
		set(Math.round(q * 100) / 100);
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) placeAt(pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		// a drag is not a click: the pointer does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
	}

	/** A press on the open axis, with a mouse or a pen, brings the pointer there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		// a press on a mark is a click on it, which brings the pointer onto the mark
		if ((e.target as Element).closest('.mark')) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
		placeAt(e);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = false;
	}

	/** The next mark above or below the pointer, if there is one. */
	function nextMark(up: boolean) {
		const ps = ladder.marks.map((m) => power(m.value));
		const i = up ? ps.findIndex((q) => q > p + ON) : ps.findLastIndex((q) => q < p - ON);
		return i < 0 ? undefined : ladder.marks[i];
	}

	function key(e: KeyboardEvent) {
		const step = e.shiftKey ? 0.1 : 1;
		if (e.key === 'PageUp' || e.key === 'PageDown') {
			const m = nextMark(e.key === 'PageUp');
			e.preventDefault();
			if (m) goTo(m);
			return;
		}
		const d = {
			ArrowUp: step,
			ArrowRight: step,
			ArrowDown: -step,
			ArrowLeft: -step,
			Home: lo - p,
			End: hi - p
		}[e.key];
		if (d === undefined) return;
		e.preventDefault();
		set(p + d);
	}

	function choose(e: KeyboardEvent, m: Mark) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		goTo(m);
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const unitTex = $derived(ladder.unitTex);
	const exponent = $derived((Math.round(p * 100) / 100).toFixed(2));
	/** The pointer's value in three steps, which a narrow screen may put on separate lines. */
	const pointerTex = $derived([
		`10^{${exponent}}\\,${unitTex}`,
		`= ${texPlain(value, 2)}\\,${unitTex}`
	]);
	const otherUnit = $derived(
		which === 'tides' ? `${texPlain(value / EOTVOS, 2)}\\,\\mathrm{E}` : texFriendly(value)
	);
	const paperHref = (m: Mark) => resolve(`/paper/#${m.label}` as '/');

	/** A number in words for a screen reader, to two figures: "9.3 times ten to the minus 9". */
	function spoken(v: number) {
		if (v >= 0.01 && v < 1e4) return String(Number(v.toPrecision(2)));
		const e = Math.floor(Math.log10(v));
		return `${Number((v / 10 ** e).toPrecision(2))} times ten to the ${e < 0 ? 'minus ' : ''}${Math.abs(e)}`;
	}
	const unitSpoken = $derived(which === 'tides' ? 'per second squared' : 'metres');
	const pointerLabel = $derived(`The pointer, at ${spoken(value)} ${unitSpoken}`);
	const pointerText = $derived(
		`${spoken(value)} ${unitSpoken}; ${on ? `on the mark ${near.name}` : `${Math.abs(gap).toFixed(1)} powers of ten ${gap > 0 ? 'above' : 'below'} ${near.name}`}`
	);
</script>

<div class="scale-ladder">
	<section class="predict" aria-labelledby="scale-ladder-predict">
		<span class="tag" id="scale-ladder-predict">Predict</span>
		<p class="question">How many powers of ten separate the person’s tide from the Moon’s?</p>
		<p class={['answer', { shown: answered }]} aria-live="polite">
			{#if answered}
				<strong>{ANSWER.toFixed(1)} powers of ten, a factor of about {factor(10 ** ANSWER)}.</strong
				>
				The person a metre away raises <Tex math={person.tex} />, the Moon on the Earth
				<Tex math={moon.tex} />. Their ratio is <Tex math={texPlain(10 ** ANSWER, 2)} />, which is
				<Tex math={`10^{${ANSWER.toFixed(2)}}`} />. The paper says it in words: the person’s tide is
				about fifty thousand times the Moon’s (§IV).
			{:else}
				The answer appears when the pointer has stood on the person’s tide and on the Moon’s, in
				either order.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {size.w} {size.h}"
			role="group"
			aria-label="A ladder of the paper’s {which}: one axis in powers of ten, from 10 to the {lo} to 10 to the {hi} {unitSpoken}, with {ladder
				.marks.length} scenes of the paper marked on it and a pointer"
			class={{ dragging, flat: phone.current }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			{#if phone.current}
				<!-- the axis, flat, its ticks below it -->
				<line class="axis" x1={FLAT.L} y1={FLAT.axis} x2={FLAT.R} y2={FLAT.axis} />
				{#each minor as n (n)}
					{@const long = major.includes(n)}
					<line
						class="tick"
						x1={along(n)}
						y1={FLAT.axis}
						x2={along(n)}
						y2={FLAT.axis + (long ? 5 : 2.5) * u}
					/>
				{/each}
				{#each major as n (n)}
					{#if Math.abs(along(n) - badgeAt) > badgeWidth / 2 + 18 * u}
						<text class="num" x={along(n)} y={FLAT.axis + 16 * u} text-anchor="middle"
							>{tickLabel(n)}</text
						>
					{/if}
				{/each}
				<text
					class="axis-name"
					x={(FLAT.L + FLAT.R) / 2}
					y={FLAT.axis + 46 * u}
					text-anchor="middle">{ladder.quantity}, in {ladder.unit}</text
				>
			{:else}
				<!-- the axis, upright, its ticks to the left -->
				<line class="axis" x1={WIDE.axis} y1={WIDE.T} x2={WIDE.axis} y2={WIDE.B} />
				{#each minor as n (n)}
					{@const long = major.includes(n)}
					<line
						class="tick"
						x1={WIDE.axis - (long ? 6 : 3) * u}
						y1={along(n)}
						x2={WIDE.axis}
						y2={along(n)}
					/>
				{/each}
				{#each major as n (n)}
					{#if Math.abs(along(n) - pointerAt) > 22 * u}
						<text class="num" x={WIDE.axis - 10 * u} y={along(n) + 3.8 * u} text-anchor="end"
							>{tickLabel(n)}</text
						>
					{/if}
				{/each}
				<text
					class="axis-name"
					transform="translate({f1(WIDE.axis - 104 * u)} {f1((WIDE.T + WIDE.B) / 2)}) rotate(-90)"
					text-anchor="middle">{ladder.quantity}, in {ladder.unit}</text
				>
			{/if}

			<!-- the powers of ten between the pointer and the nearest mark, along the axis -->
			{#if !on}
				{@const a = along(power(near.value))}
				{#if phone.current}
					<line class="span" x1={a} y1={FLAT.axis} x2={pointerAt} y2={FLAT.axis} />
				{:else}
					<line class="span" x1={WIDE.axis} y1={a} x2={WIDE.axis} y2={pointerAt} />
				{/if}
			{/if}

			<!-- the paper's scenes: press one to bring the pointer onto it -->
			{#each words as w (w.mark.id)}
				{@const m = w.mark}
				{@const current = m.id === near.id}
				<g
					class={['mark', { current, on: current && on }]}
					role="button"
					tabindex="0"
					aria-label="{m.name}: {m.text}, in section {m.section} of the paper. Move the pointer here."
					onclick={() => goTo(m)}
					onkeydown={(e) => choose(e, m)}
				>
					<path class="leader" d={leader(w.at, w.label)} />
					{#if phone.current}
						{@const x = w.label + 3.6 * u}
						{@const y = FLAT.axis - 24 * u}
						<g transform="translate({f1(x)} {f1(y)}) rotate(-90)">
							<rect
								class="hit"
								x={-3 * u}
								y={-9.5 * u}
								width={lengthOf(m, w.text, 10) + 6 * u}
								height={12.5 * u}
								rx={3 * u}
							/>
							<text class="name" {@attach measure(m)}
								>{m.short}<tspan class="value" dx={6 * u}>{flatValue(m)}</tspan></text
							>
						</g>
						<circle class="dot" cx={w.at} cy={FLAT.axis} r={3.2 * u} />
					{:else}
						{@const x = WIDE.axis + 39 * u}
						<rect
							class="hit"
							x={x - 4 * u}
							y={w.label - 8 * u}
							width={lengthOf(m, `${m.name} ${m.text} §${m.section}`, 11) + 8 * u}
							height={15 * u}
							rx={3 * u}
						/>
						<text class="name" {x} y={w.label + 3.8 * u} {@attach measure(m)}
							>{m.name}<tspan class="value" dx={9 * u}>{m.text}</tspan><tspan
								class="section"
								dx={9 * u}>§{m.section}</tspan
							></text
						>
						<circle class="dot" cx={WIDE.axis} cy={w.at} r={3.2 * u} />
					{/if}
				</g>
			{/each}

			<!-- the pointer: a ring on the axis, and its value beside it over the ticks' numbers -->
			<g
				class="pointer"
				transform={phone.current
					? `translate(${f1(pointerAt)} ${FLAT.axis})`
					: `translate(${WIDE.axis} ${f1(pointerAt)})`}
				role="slider"
				tabindex="0"
				aria-label={pointerLabel}
				aria-orientation={phone.current ? 'horizontal' : 'vertical'}
				aria-valuemin={lo}
				aria-valuemax={hi}
				aria-valuenow={Math.round(p * 100) / 100}
				aria-valuetext={pointerText}
				onpointerdown={grab}
				onkeydown={key}
			>
				{#if phone.current}
					<rect
						class="badge"
						x={badgeAt - pointerAt - badgeWidth / 2}
						y={7 * u}
						width={badgeWidth}
						height={17 * u}
						rx={4 * u}
					/>
					<text class="badge-text" x={badgeAt - pointerAt} y={19.3 * u} text-anchor="middle"
						>{badge}</text
					>
				{:else}
					<rect
						class="badge"
						x={-9 * u - badgeWidth}
						y={-8.5 * u}
						width={badgeWidth}
						height={17 * u}
						rx={4 * u}
					/>
					<text class="badge-text" x={-15 * u} y={3.8 * u} text-anchor="end">{badge}</text>
				{/if}
				<circle class="hit" r={16 * u} />
				<circle class="focus" r={11 * u} />
				<circle class="ring" r={6.5 * u} />
				<circle class="pin" r={1.4 * u} />
			</g>
		</svg>
	</div>

	<div class="bar">
		<div class="choice">
			<Segmented
				label="Ladder"
				options={[
					{ value: 'tides', label: 'Tides', icon: GravityIcon },
					{ value: 'lengths', label: 'Lengths', icon: RulerIcon }
				]}
				bind:value={which}
			/>
		</div>
		<p class="hint">
			Drag the pointer, or reach it with Tab and move it a power of ten with the arrow keys (with
			Shift, a tenth of one); Page Up and Page Down take it to the next mark. Press a mark to bring
			the pointer onto it.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Pointer</dt>
				<dd>
					<span class="chain"
						>{#each otherUnit ? [...pointerTex, `= ${otherUnit}`] : pointerTex as step, i (i)}<Tex
								math={step}
							/>{/each}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Nearest mark</dt>
				<dd>
					<strong>{near.name}</strong><Tex math={near.tex} /><a class="paper" href={paperHref(near)}
						>§{near.section} of the paper</a
					>
				</dd>
			</div>
			<div class="row">
				<dt>Powers of ten</dt>
				<dd aria-live="polite">
					{#if on}
						<span><Tex math="0" />: the pointer is on the mark</span>
					{:else}
						<span
							><Tex math={Math.abs(gap).toFixed(1)} />
							{gap > 0 ? 'above' : 'below'} it</span
						><span class="also"
							>a factor of {factor(10 ** Math.abs(gap))}
							{gap > 0 ? 'larger' : 'smaller'}</span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The scene</dt>
				<dd class="scene">
					<span
						>{near.scene}
						{#if near.paper}<span class="also">{near.paper}</span>{/if}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each step of the axis is a power of ten, a factor of ten: a value written <Tex
				math={'a\\times10^{n}'}
			/> stands near step <Tex math="n" />, and multiplying two values adds their steps. The number
			of powers of ten between two values is the logarithm of their ratio, <Tex
				math={'\\log_{10}(b/a)'}
			/>.
			{#if which === 'tides'}
				A tide is the difference in gravity between two points a metre apart, in metres per second
				squared per metre, <Tex math={'\\mathrm{s^{-2}}'} />; one eötvös is <Tex
					math={'1\\,\\mathrm{E} = 10^{-9}\\,\\mathrm{s^{-2}}'}
				/>.
			{:else}
				An astronomical unit is <Tex math={'1.496\\times10^{11}\\,\\mathrm{m}'} />, the mean
				distance from the Earth to the Sun; a light-year, the distance light travels in a year, is <Tex
					math={'9.46\\times10^{15}\\,\\mathrm{m}'}
				/>; a parsec is 3.26 light-years.
			{/if}
		</p>
	</div>
</div>

<style>
	.scale-ladder {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the prediction ------------------------------------------------------------------- */

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

	/* --- the ladder ------------------------------------------------------------------------- */

	.stage {
		padding: 0.8rem 0.9rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 46rem;
		margin: 0 auto;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the pointer takes a drag */
		touch-action: pan-y;
		cursor: ns-resize;
	}

	svg.flat {
		cursor: ew-resize;
	}

	svg.dragging,
	svg.dragging .pointer {
		cursor: grabbing;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		fill: var(--text-dim);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
	}

	.span {
		stroke: var(--accent);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.mark {
		cursor: pointer;
	}

	.mark:focus,
	.pointer:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.mark .hit {
		stroke: none;
	}

	.mark:focus-visible .hit {
		stroke: var(--accent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.leader {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.dot {
		fill: var(--accent-2);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.name {
		fill: var(--text);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
		transition: fill 0.15s;
	}

	svg.flat .name {
		font-size: calc(10px * var(--u, 1));
	}

	.value {
		fill: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.section {
		fill: var(--text-faint);
	}

	.mark:hover .name,
	.mark.current .name {
		fill: var(--accent-ink);
	}

	.mark.current .leader {
		stroke: var(--accent);
	}

	.mark.on .dot {
		fill: var(--accent);
	}

	.pointer {
		cursor: grab;
		touch-action: none;
	}

	.badge {
		fill: var(--bg);
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.badge-text {
		fill: var(--text);
		font: 500 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.ring {
		fill: color-mix(in srgb, var(--bg) 40%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.pin {
		fill: var(--text);
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.pointer:focus-visible .focus {
		opacity: 1;
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.2rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.choice {
		flex: 0 1 15rem;
	}

	.hint {
		flex: 1 1 18rem;
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
		grid-template-columns: 7.5rem 1fr;
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

	.readouts strong {
		font-weight: 600;
		color: var(--accent-ink);
	}

	.scene {
		text-wrap: pretty;
	}

	.chain {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0 0.3em;
	}

	.also {
		color: var(--text-dim);
	}

	.paper {
		color: var(--accent-ink);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
	}

	.paper:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
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
			padding: 0.7rem 0.5rem 0.4rem;
		}

		.choice {
			flex: 1 1 100%;
		}

		.row {
			grid-template-columns: 6.4rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.name {
			transition: none;
		}
	}
</style>
