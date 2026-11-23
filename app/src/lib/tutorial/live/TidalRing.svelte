<script lang="ts">
	/**
	 * Chapter 1.4's ring: twelve free balls beside one mass or two, which the reader drags (or moves with the arrow
	 * keys). The balls move by ξ̈ = −E ξ, E the Newtonian tidal tensor at the ring's centre (./tidal-ring.ts): orange
	 * where they move apart, a stretch, blue where they move together, a squeeze. Grey: they slide along the ring. Two predictions at the top are
	 * answered once the reader has done what they ask.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { UserIcon, UserMultipleIcon } from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		EOTVOS,
		PERSON,
		acceleration,
		enlargement,
		principal,
		pull,
		ratio,
		ring,
		strongestOf,
		tide,
		type Body
	} from './tidal-ring';

	/** Drawing units per metre of distance to the masses. */
	const U = 100;
	/** The ring's radius as drawn, in drawing units: larger than to scale. */
	const R = 50;
	/** The largest change of the ring, as a fraction of its radius, once the drawing has settled. */
	const DRAWN = 0.3;
	/** While a mass moves, the change may grow or shrink within these before the enlargement is changed. */
	const MOST = 0.45;
	const LEAST = 0.06;
	/** How near and how far a mass may be, m. */
	const NEAR = 0.8;
	const FAR = 2.1;
	/** An arrow is this many times as long as the change drawn: it shows the acceleration, on the same scale. */
	const ARROW = 1.35;

	type Mode = 'one' | 'two';
	let mode = $state<Mode>('one');
	/** The masses' places in the ring's plane, m, x to the right and y up. */
	let places = $state([
		{ x: -1, y: 0 },
		{ x: 1, y: 0 }
	]);

	// --- the predictions ---------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The farthest the first mass has been, m. */
	let farthest = $state(1);
	let sawTwo = $state(false);
	const revealed = $derived(step === 1 ? farthest >= 1.8 : sawTwo);

	function chooseStep(s: 1 | 2) {
		step = s;
		if (s === 2 && mode === 'two') sawTwo = true;
	}

	function chooseMode(m: Mode) {
		if (m === mode) return;
		mode = m;
		// the second mass comes in opposite the first, so that midway the pulls cancel
		if (m === 'two') {
			places[1] = { x: -places[0].x, y: -places[0].y };
			if (step === 2) sawTwo = true;
		}
		settle();
	}

	// --- the picture's bounds: wider than tall on a wide screen; on a phone taller than wide, so that the ring is
	// drawn larger and a mass goes farthest up or down
	const phone = new MediaQuery('max-width: 560px', false);
	const half = $derived(phone.current ? { x: 172, y: 212 } : { x: 236, y: 128 });
	const viewBox = $derived(`${-half.x} ${-half.y} ${2 * half.x} ${2 * half.y}`);

	/** A place moved into the picture and between the nearest and farthest a mass may be. */
	function bound(p: { x: number; y: number }) {
		const edge = 22 / U;
		let x = Math.max(-half.x / U + edge, Math.min(half.x / U - edge, p.x));
		let y = Math.max(-half.y / U + edge, Math.min(half.y / U - edge, p.y));
		const r = Math.hypot(x, y);
		if (r === 0) return { x: -NEAR, y: 0 };
		const s = Math.max(NEAR, Math.min(FAR, r)) / r;
		x *= s;
		y *= s;
		return { x, y };
	}

	const shown = $derived(places.map(bound));
	const bodies: Body[] = $derived(
		shown.slice(0, mode === 'two' ? 2 : 1).map((p) => ({ ...p, mass: PERSON }))
	);

	// --- the physics -------------------------------------------------------------------------------------------------
	const E = $derived(tide(bodies));
	const axes = $derived(principal(E));
	const largest = $derived(strongestOf(E));
	const g = $derived(pull(bodies));
	const parts = $derived(ratio(E));

	// --- the enlargement: kept while a mass moves, so that the ring is seen to change, then set again -------------
	const target = (big: number) => (big === 0 ? 0 : DRAWN / Math.abs(big));
	/** The change drawn, in ring radii, per s⁻² of tide. */
	const scale = new Tween(target(strongestOf(tide([{ x: -1, y: 0, mass: PERSON }]))), {
		duration: 450,
		easing: cubicOut
	});

	/** The scale for the tide now, if the change would grow too large or too small to read at the scale shown. */
	function keepInView() {
		const drawn = scale.target * Math.abs(largest);
		if (drawn > MOST) scale.set(MOST / Math.abs(largest), { duration: 0 });
		else if (drawn < LEAST) scale.set(LEAST / Math.abs(largest), { duration: 0 });
	}

	function settle() {
		scale.set(target(strongestOf(tide(bodies))), {
			duration: prefersReducedMotion.current ? 0 : 450
		});
	}

	/** The enlargement in words: against the change in the first second of free fall from rest. */
	const factor = $derived(enlargement(largest, scale.current * Math.abs(largest)));

	// --- the drawing ---------------------------------------------------------------------------------------------------
	/** Drawing units in one CSS pixel, so that marks keep their size on the screen. */
	let u = $state(1);
	const BALL = $derived(4.4 * u);
	/** The mass's disc, a little smaller on a phone, where the ring is drawn smaller. */
	const DISC = $derived((phone.current ? 13 : 16) * u);

	/** Screen y runs down. */
	const toScreen = (p: { x: number; y: number }) => ({ x: U * p.x, y: -U * p.y });

	const rest = ring(12);
	/** Each ball where the tide has moved it, and an arrow from it along its acceleration relative to the centre. */
	const balls = $derived.by(() => {
		const k = scale.current;
		const moves = rest.map((p) => {
			const a = acceleration(E, p.x, p.y);
			return { p, d: { x: k * a.x, y: k * a.y } };
		});
		const most = Math.max(...moves.map((m) => Math.hypot(m.d.x, m.d.y)), 1e-12);
		return moves.map(({ p, d }) => {
			const at = { x: R * (p.x + d.x), y: -R * (p.y + d.y) };
			const radial = d.x * p.x + d.y * p.y;
			const kind = radial > 0.05 * most ? 'stretch' : radial < -0.05 * most ? 'squeeze' : 'still';
			return { at, kind, arrow: arrow(at, { x: ARROW * R * d.x, y: -ARROW * R * d.y }) };
		});
	});

	/** The shaft and head of an arrow from the edge of a ball at `from`, of length and direction `v`, if long enough. */
	function arrow(from: { x: number; y: number }, v: { x: number; y: number }) {
		const len = Math.hypot(v.x, v.y);
		const head = 5.4 * u;
		if (len < head + 2.5 * u) return undefined;
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * (BALL + 1.2 * u), y: from.y + uy * (BALL + 1.2 * u) };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = 2.7 * u;
		const f = (n: number) => n.toFixed(2);
		return {
			shaft: `M${f(start.x)},${f(start.y)}L${f(base.x + ux * 0.5 * u)},${f(base.y + uy * 0.5 * u)}`,
			head: `M${f(tip.x)},${f(tip.y)}L${f(base.x - uy * w)},${f(base.y + ux * w)}L${f(base.x + uy * w)},${f(base.y - ux * w)}Z`
		};
	}

	const outline = $derived.by(() => {
		const k = scale.current;
		return (
			ring(96)
				.map((p) => {
					const a = acceleration(E, p.x, p.y);
					return { x: R * (p.x + k * a.x), y: -R * (p.y + k * a.y) };
				})
				.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
				.join('') + 'Z'
		);
	});

	/** The principal axes through the centre, a little beyond the ring. */
	const axisLines = $derived(
		axes.map((a) => {
			const L = R * 1.42;
			return {
				x: L * a.axis.x,
				y: -L * a.axis.y,
				kind: a.value < 0 ? 'stretch' : 'squeeze'
			};
		})
	);

	// --- moving a mass: by pointer, or by the arrow keys ---------------------------------------------------------------
	/** The picture, for turning a pointer's place into metres. */
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<number | undefined>();

	function metres(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: p.x / U, y: -p.y / U };
	}

	function place(i: number, p: { x: number; y: number }) {
		places[i] = bound(p);
		if (i === 0) farthest = Math.max(farthest, Math.hypot(places[0].x, places[0].y));
		keepInView();
	}

	function grab(e: PointerEvent, i: number) {
		// a drag is not a click: the mass does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = i;
	}

	/** A press on the open picture, with a mouse or a pen, brings the nearer mass there. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		e.preventDefault();
		const p = metres(e);
		const count = mode === 'two' ? 2 : 1;
		let i = 0;
		for (let j = 1; j < count; j++)
			if (
				Math.hypot(p.x - shown[j].x, p.y - shown[j].y) <
				Math.hypot(p.x - shown[i].x, p.y - shown[i].y)
			)
				i = j;
		svg?.setPointerCapture(e.pointerId);
		dragging = i;
		place(i, p);
	}

	function move(e: PointerEvent) {
		if (dragging === undefined) return;
		place(dragging, metres(e));
	}

	function release() {
		if (dragging === undefined) return;
		dragging = undefined;
		settle();
	}

	let idle: ReturnType<typeof setTimeout> | undefined;
	function key(e: KeyboardEvent, i: number) {
		const step = e.shiftKey ? 0.25 : 0.05;
		const d = {
			ArrowLeft: { x: -step, y: 0 },
			ArrowRight: { x: step, y: 0 },
			ArrowUp: { x: 0, y: step },
			ArrowDown: { x: 0, y: -step }
		}[e.key];
		if (!d) return;
		e.preventDefault();
		place(i, { x: shown[i].x + d.x, y: shown[i].y + d.y });
		clearTimeout(idle);
		idle = setTimeout(settle, 700);
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	/** A tide in eötvös to three figures, signed: negative stretches, positive squeezes. */
	const eotvos = (v: number) =>
		`${v < 0 ? '-' : '+'}${Math.abs(v / EOTVOS).toPrecision(3)}\\,\\mathrm{E}`;
	const perSecond = (v: number) =>
		`${v < 0 ? '-' : '+'}${texNumber(Math.abs(v), 3)}\\,\\mathrm{s^{-2}}`;
	const metresTex = (p: { x: number; y: number }) =>
		`${Math.hypot(p.x, p.y).toFixed(2)}\\,\\mathrm{m}`;

	const distance = $derived(
		mode === 'one'
			? `r = ${metresTex(shown[0])}`
			: `r_1 = ${metresTex(shown[0])},\\quad r_2 = ${metresTex(shown[1])}`
	);

	/** The names of the two principal values: a stretch or a squeeze, and which is stronger where both are one kind. */
	const names = $derived.by(() => {
		const [a, b] = axes;
		const kind = (v: number) => (v < 0 ? 'Stretch' : 'Squeeze');
		if (Math.sign(a.value) !== Math.sign(b.value)) return [kind(a.value), kind(b.value)];
		const stronger = Math.abs(a.value) >= Math.abs(b.value);
		return [
			`${kind(a.value)}, ${stronger ? 'stronger' : 'weaker'}`,
			`${kind(b.value)}, ${stronger ? 'weaker' : 'stronger'}`
		];
	});

	const pullTex = $derived.by(() => {
		const size = Math.hypot(g.x, g.y);
		const each = bodies.reduce((s, b) => s + Math.hypot(pull([b]).x, pull([b]).y), 0);
		return size < 1e-9 * each ? '0' : `${texNumber(size, 3)}\\,\\mathrm{m\\,s^{-2}}`;
	});

	const ratioTex = $derived(
		parts
			? `${parts[0] < 0 ? '-' : ''}${Math.abs(parts[0]).toFixed(2)} : ${parts[1] < 0 ? '-' : ''}1`
			: undefined
	);

	// the chapter's numbers for the answers, from the same model
	const atOne = principal(tide([{ x: -1, y: 0, mass: PERSON }]))[0].value;
	const atTwo = principal(tide([{ x: -2, y: 0, mass: PERSON }]))[0].value;
	const midway = principal(
		tide([
			{ x: -1, y: 0, mass: PERSON },
			{ x: 1, y: 0, mass: PERSON }
		])
	)[0].value;

	const label = (i: number) =>
		`${mode === 'two' ? (i === 0 ? 'First mass' : 'Second mass') : 'The mass'}, ${Math.hypot(shown[i].x, shown[i].y).toFixed(2)} metres from the ring’s centre`;
</script>

<div class="tidal-ring">
	<section class="predict" aria-labelledby="tidal-ring-predict">
		<div class="steps">
			<span class="tag" id="tidal-ring-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => chooseStep(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Move the mass twice as far away. How much weaker will the stretch be?
			{:else}
				Switch on a second mass on the other side. Midway, the pulls cancel. Is the ring still
				stretched?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Eight times weaker.</strong> The tide falls as the cube of the distance, so twice
				the distance divides it by <Tex math="2^3 = 8" />. The person’s stretch is
				<Tex math={eotvos(atOne)} /> at 1 m and <Tex math={eotvos(atTwo)} /> at 2 m.
				<button type="button" class="next" onclick={() => chooseStep(2)}>Next prediction</button>
			{:else if revealed}
				<strong>Yes, along the line, and twice as strongly.</strong> The two pulls cancel at the
				centre, but the two stretches add. Midway between two people a metre on each side the
				stretch is <Tex math={eotvos(midway)} />, against <Tex math={eotvos(atOne)} /> beside one.
			{:else if step === 1}
				The answer appears when the mass is 1.8 m away or farther.
			{:else}
				The answer appears when you switch on the second mass.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			{viewBox}
			role="group"
			aria-label="A ring of twelve free balls beside {mode === 'two'
				? 'two equal masses'
				: 'a mass'}: the arrows show how each ball moves"
			class={{ dragging: dragging !== undefined }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<radialGradient id="tidal-ring-ball" cx="0.36" cy="0.32" r="0.75">
					<stop offset="0" class="ball-light" />
					<stop offset="1" class="ball-dark" />
				</radialGradient>
				<radialGradient id="tidal-ring-mass" r="0.5">
					<stop offset="0" class="mass-core" />
					<stop offset="0.72" class="mass-body" />
					<stop offset="1" class="mass-edge" />
				</radialGradient>
			</defs>

			<!-- the line from the centre to each mass -->
			{#each bodies as b, i (i)}
				{@const p = toScreen(b)}
				<line class="tether" x1="0" y1="0" x2={p.x} y2={p.y} />
			{/each}

			<!-- the masses, under the ring -->
			{#each bodies as b, i (i)}
				{@const p = toScreen(b)}
				<g
					class="mass"
					transform="translate({p.x.toFixed(2)} {p.y.toFixed(2)})"
					role="button"
					tabindex="0"
					aria-roledescription="movable mass"
					aria-label="{label(i)}. Drag it, or use the arrow keys."
					onpointerdown={(e) => grab(e, i)}
					onkeydown={(e) => key(e, i)}
				>
					<circle class="hit" r={DISC + 9 * u} />
					<circle class="focus" r={DISC + 4 * u} />
					<circle class="disc" r={DISC} />
					<text class="name" y={5.2 * u}>M</text>
				</g>
			{/each}

			<!-- the principal axes, the ring at rest and the ring as the tide moves it -->
			{#each axisLines as a, i (i)}
				<line class={['axis', a.kind]} x1={-a.x} y1={-a.y} x2={a.x} y2={a.y} />
			{/each}
			<circle class="rest" r={R} />
			<path class="bent" d={outline} />
			{#each balls as b, i (i)}
				{#if b.arrow}
					<path class={['shaft', b.kind]} d={b.arrow.shaft} />
					<path class={['head', b.kind]} d={b.arrow.head} />
				{/if}
				<circle class="ball" cx={b.at.x} cy={b.at.y} r={BALL} />
			{/each}
			<circle class="centre" r={1.6 * u} />
		</svg>
	</div>

	<div class="bar">
		<div class="choice">
			<Segmented
				label="Masses"
				options={[
					{ value: 'one', label: 'One mass', icon: UserIcon },
					{ value: 'two', label: 'Two masses', icon: UserMultipleIcon }
				]}
				bind:value={() => mode, chooseMode}
			/>
		</div>
		<p class="hint">
			Drag a mass anywhere around the ring, or reach it with Tab and move it with the arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>{mode === 'one' ? 'Distance' : 'Distances'}</dt>
				<dd><Tex math={distance} /></dd>
			</div>
			{#each axes as a, i (i)}
				<div class="row">
					<dt>
						<span class={['swatch', a.value < 0 ? 'stretch' : 'squeeze']}></span>{names[i]}
					</dt>
					<dd>
						<Tex math={eotvos(a.value)} /><span class="also"><Tex math={perSecond(a.value)} /></span
						>
					</dd>
				</div>
			{/each}
			<div class="row">
				<dt>Stretch to squeeze</dt>
				<dd>
					{#if ratioTex}<Tex math={ratioTex} />{:else}no squeeze in the plane{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Pull at the centre</dt>
				<dd><Tex math={pullTex} /></dd>
			</div>
		</dl>
		<p class="note">
			Each arrow is a ball’s acceleration relative to the centre.
			<span class="stretch">Orange</span>: the balls move apart, a stretch.
			<span class="squeeze">Blue</span>: they move together, a squeeze. The lines through the centre
			are the principal axes. Across the page the ring is squeezed by <Tex math={eotvos(E.zz)} />,
			so the three values add to zero.
		</p>
		<p class="note">
			Not to scale. The ring is drawn larger than its distances, and its tide is taken at its
			centre. The solid ring shows where the balls are after one second of free fall from rest,
			enlarged
			<Tex math={texNumber(factor, 2)} /> times, and the arrows grow and shrink with it. The enlargement
			is reset when you let go of a mass, so that the change stays visible. The numbers give its true
			size.
		</p>
	</div>
</div>

<style>
	.tidal-ring {
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		background: radial-gradient(circle at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 78%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
		/* the open picture lets a finger scroll the page; only the masses take a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .mass {
		cursor: grabbing;
	}

	.tether {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.mass {
		cursor: grab;
		touch-action: none;
	}

	.mass:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.disc {
		fill: url(#tidal-ring-mass);
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mass-core {
		stop-color: color-mix(in srgb, var(--q-matter) 46%, var(--bg));
	}

	.mass-body {
		stop-color: color-mix(in srgb, var(--q-matter) 30%, var(--bg));
	}

	.mass-edge {
		stop-color: color-mix(in srgb, var(--q-matter) 14%, var(--bg));
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

	.name {
		fill: var(--q-matter);
		font: italic 600 calc(15px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: middle;
		pointer-events: none;
	}

	.axis {
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.55;
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft.still {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.head.still {
		fill: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.axis.stretch,
	.shaft.stretch {
		stroke: var(--accent);
	}

	.axis.squeeze,
	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.head.stretch {
		fill: var(--accent);
	}

	.head.squeeze {
		fill: var(--accent-2);
	}

	.ball {
		fill: url(#tidal-ring-ball);
		stroke: color-mix(in srgb, var(--bg-sunken) 80%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
	}

	.ball-light {
		stop-color: color-mix(in srgb, var(--text) 92%, var(--bg));
	}

	.ball-dark {
		stop-color: color-mix(in srgb, var(--text) 55%, var(--bg));
	}

	.centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.choice {
		flex: 0 1 17rem;
	}

	.hint {
		flex: 1 1 14rem;
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
		display: flex;
		align-items: center;
		gap: 0.45rem;
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

	.swatch {
		flex: none;
		width: 0.85rem;
		height: 2px;
		border-radius: 1px;
	}

	.swatch.stretch {
		background: var(--accent);
	}

	.swatch.squeeze {
		background: var(--accent-2);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.note .stretch {
		color: var(--accent);
	}

	.note .squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
