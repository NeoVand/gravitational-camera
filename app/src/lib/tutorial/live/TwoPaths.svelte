<script lang="ts">
	/**
	 * Chapter 8.1's two paths. Left: the Mach–Zehnder interferometer of diagram tut-mach-zehnder, a particle sent in
	 * along L, thin ink paths, the half-silvered mirrors as short thick grey lines at 45°, the full mirrors in ink,
	 * the delay on path L as a plate whose thickness follows φ, a bar at each exit for P_L and P_R, and inside the
	 * rectangle the record's two states |e_L⟩ = (1, 0) and |e_R⟩ = (cos θ, sin θ). Right: the complex plane with the
	 * amplitudes that reach exit R drawn head to tail, ie^{iφ}/2 by way of L and i cos θ/2 by way of R with the record
	 * in |0⟩, and their sum; the part by way of R with the record in |1⟩, i sin θ/2, stands apart, since nothing adds
	 * to it. Below: P_R against φ from 0 to 2π for the current overlap. Sliders set φ and the record of the path, a
	 * button blocks path R. The tables are multiplied in ./two-paths.ts. Opens at φ = π/3 with no record, P_R = 0.75;
	 * three predictions at the top are answered once the reader has done what each asks. Nothing in it moves by
	 * itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BlockedIcon,
		FingerprintScanIcon,
		RefreshIcon,
		RotateClockwiseIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		OPENING,
		PHI,
		RECORD,
		abs2,
		degrees,
		fringe,
		noteFirst,
		noteSecond,
		noteThird,
		overlapOf,
		phiOf,
		phiTex,
		phiWords,
		reading,
		recordOf,
		stepped,
		swingOf,
		thetaOf,
		two,
		type Complex,
		type Range,
		type Settings
	} from './two-paths';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	/** The delay in twelfths of π. */
	let k = $state(OPENING.k);
	/** The overlap ⟨e_R|e_L⟩ = cos θ of the record's two states. */
	let overlap = $state(OPENING.overlap);
	let blocked = $state(OPENING.blocked);

	const settings = $derived<Settings>({ k, overlap, blocked });

	function setK(v: number) {
		k = Math.max(PHI.min, Math.min(PHI.max, Math.round(v)));
		note();
	}
	/** The record's slider runs from no record, overlap 1, to a perfect record, overlap 0. */
	function setRecord(v: number) {
		overlap = overlapOf(v);
		note();
	}
	function toggleBlock() {
		blocked = !blocked;
		note();
	}
	function reset() {
		k = OPENING.k;
		overlap = OPENING.overlap;
		blocked = OPENING.blocked;
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
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		const s = { k, overlap, blocked };
		first = noteFirst(first, s);
		second = noteSecond(second, s);
		third = noteThird(third, s);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const now = $derived(reading(settings));
	const theta = $derived(thetaOf(overlap));
	const curve = $derived(fringe(overlap, blocked));
	const bare = fringe(1, false);
	const swing = $derived(swingOf(overlap, blocked));
	/** The fringes without a record, drawn faintly for comparison once they differ from the ones shown. */
	const compare = $derived(blocked || overlap < 1);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const layout = $derived(
		phone.current
			? {
					W: 420,
					H: 786,
					left: { x: 0, y: 0 },
					right: { x: 60, y: 312 },
					plot: { x: 0, y: 626, w: 420 }
				}
			: {
					W: 740,
					H: 470,
					left: { x: 0, y: 0 },
					right: { x: 440, y: 0 },
					plot: { x: 0, y: 312, w: 740 }
				}
	);

	type Pt = { x: number; y: number };

	/** An arrow from a to b: its shaft, stopping short of the tip, and its head; nothing if it is too short. */
	function arrow(a: Pt, b: Pt, head = 8) {
		const l = Math.hypot(b.x - a.x, b.y - a.y);
		if (l < 1.5 * u) return undefined;
		const h = Math.min(head * u, 0.45 * l);
		const w = 0.42 * h;
		const t = { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
		const base = { x: b.x - t.x * h, y: b.y - t.y * h };
		return {
			shaft: `M${f2(a.x)},${f2(a.y)}L${f2(base.x + t.x * 0.5)},${f2(base.y + t.y * 0.5)}`,
			head: `${f2(b.x)},${f2(b.y)} ${f2(base.x - t.y * w)},${f2(base.y + t.x * w)} ${f2(base.x + t.y * w)},${f2(base.y - t.x * w)}`
		};
	}

	// the interferometer, in the left panel's own units
	const X0 = 65;
	const X1 = 225;
	const TOP = 112;
	const BOT = 250;
	const PLATE_X = 150;
	/** The plate's thickness along the beam: a hairline at no delay, 36 units at a whole turn. */
	const plateWidth = $derived(2 + (34 * k) / 24);
	const ABSORBER_Y = 200;
	const BAR = 100;
	const exitL = { x: X1, y: 48 };
	const exitR = { x: 292, y: TOP };
	/** A mirror at 45°, "/", centred on (x, y). */
	const mirror = (x: number, y: number, r = 10) => `M${x - r},${y + r}L${x + r},${y - r}`;

	// the record's two states, drawn inside the rectangle
	const DIAL = { x: 128, y: 194, r: 32 };
	const eR = $derived({
		x: DIAL.x + DIAL.r * Math.cos(theta),
		y: DIAL.y - DIAL.r * Math.sin(theta)
	});
	const eLArrow = $derived(arrow(DIAL, { x: DIAL.x + DIAL.r, y: DIAL.y }, 7));
	const eRArrow = $derived(arrow(DIAL, eR, 7));
	const eRLabel = $derived({
		x: DIAL.x + (DIAL.r + 13) * Math.cos(theta),
		y: DIAL.y - (DIAL.r + 13) * Math.sin(theta)
	});
	const dialArc = $derived.by(() => {
		if (theta < 0.05) return undefined;
		const r = 15;
		const end = { x: DIAL.x + r * Math.cos(theta), y: DIAL.y - r * Math.sin(theta) };
		return {
			d: `M${DIAL.x + r},${DIAL.y}A${r},${r} 0 0 0 ${f2(end.x)},${f2(end.y)}`,
			label: {
				x: DIAL.x + 23 * Math.cos(theta / 2),
				y: DIAL.y - 23 * Math.sin(theta / 2) + 4
			}
		};
	});

	// the complex plane, in the right panel's own units: Im up
	const O = { x: 150, y: 190 };
	const S = 130;
	const toPlane = (z: Complex): Pt => ({ x: O.x + S * z.re, y: O.y - S * z.im });
	const A = $derived(toPlane(now.byL));
	const B = $derived(toPlane(now.sum));
	const lArrow = $derived(arrow(O, A));
	/** Where the arrow by way of R runs back over the one by way of L, it is drawn a little to the side. */
	const aside = $derived(Math.abs(A.x - O.x) < 3 * u && A.y > O.y + 1 ? 5 * u : 0);
	const rArrow = $derived(arrow({ x: A.x + aside, y: A.y }, { x: B.x + aside, y: B.y }));
	const sumArrow = $derived(arrow(O, B, 10));
	const sumSize = $derived(Math.sqrt(abs2(now.sum)));
	/**
	 * The lone arrow, by way of R with the record in |1⟩, stands apart from the others, on the side of the plane
	 * away from the arrow by way of L.
	 */
	const lonePlace = $derived(A.x > O.x + 1 ? 'left' : 'right');
	const LONE = $derived({ x: lonePlace === 'left' ? 24 : 278, y: 140 });
	const loneTip = $derived({ x: LONE.x, y: LONE.y - S * now.other.im });
	const loneArrow = $derived(arrow(LONE, loneTip, 7));
	const loneShown = $derived(!blocked && abs2(now.other) > 1e-6);

	/** Where an arrow's words go: beside its middle, on the side away from `away`, anchored to read clear of it. */
	function beside(a: Pt, b: Pt, away: Pt, gap = 12) {
		const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
		const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
		let n = { x: -(b.y - a.y) / l, y: (b.x - a.x) / l };
		if (n.x * (away.x - m.x) + n.y * (away.y - m.y) > 1e-6) n = { x: -n.x, y: -n.y };
		else if (Math.abs(n.x * (away.x - m.x) + n.y * (away.y - m.y)) <= 1e-6 && n.x > 0)
			n = { x: -n.x, y: -n.y };
		const g = gap * u;
		return {
			x: m.x + n.x * g,
			y: m.y + n.y * g + 4 * u,
			anchor: n.x > 0.3 ? 'start' : n.x < -0.3 ? 'end' : 'middle'
		};
	}
	const lLabel = $derived.by(() => {
		const at = beside(O, A, { x: (O.x + B.x) / 2 + (A.x - O.x) * 0.01, y: B.y });
		// words that would sit on the real axis are moved just above or below it
		if (Math.abs(at.y - 4 * u - O.y) < 10 * u)
			return { ...at, y: at.y - 4 * u < O.y ? O.y - 7 * u : O.y + 16 * u };
		return at;
	});
	const rLabel = $derived({
		x: A.x + aside + (A.x >= O.x - 1e-6 ? 9 : -9) * u,
		y: (A.y + B.y) / 2 + 4 * u,
		anchor: A.x >= O.x - 1e-6 ? 'start' : 'end'
	});
	const sumLabel = $derived.by(() => {
		const l = Math.hypot(B.x - O.x, B.y - O.y) || 1;
		const t = { x: (B.x - O.x) / l, y: (B.y - O.y) / l };
		return {
			x: B.x + t.x * 12 * u,
			y: B.y + t.y * 12 * u + 4 * u,
			anchor: t.x > 0.35 ? 'start' : t.x < -0.35 ? 'end' : 'middle'
		};
	});

	// the fringes, in the lower panel's own units
	const PY1 = 34;
	const PY0 = 122;
	const px0 = 40;
	const px1 = $derived(layout.plot.w - 100);
	const fx = (phi: number) => px0 + ((px1 - px0) * phi) / (2 * Math.PI);
	const fy = (p: number) => PY0 - (PY0 - PY1) * p;
	const pathOf = (pts: { phi: number; p: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f2(fx(q.phi))},${f2(fy(q.p))}`).join('');
	const curvePath = $derived(pathOf(curve));
	const barePath = $derived(pathOf(bare));
	const xTicks = [0, 6, 12, 18, 24];

	// --- the words --------------------------------------------------------------------------------------------------
	const recordWords = $derived(
		overlap === 1
			? 'no record of the path'
			: overlap === 0
				? 'a perfect record of the path'
				: 'a partial record of the path'
	);
	const description = $derived(
		`Left: a Mach–Zehnder interferometer, a particle sent in along L, two half-silvered mirrors and two full mirrors, ` +
			`a delay plate on path L for φ = ${phiWords(k)}${blocked ? ', and an absorber on path R' : ''}. ` +
			`Exit L gets P_L = ${two(now.pL)} and exit R P_R = ${two(now.pR)}${blocked ? `; ${two(now.absorbed)} is absorbed` : ''}. ` +
			`The record of the path: ${recordWords}, overlap ${two(overlap)}, θ = ${degrees(overlap)}°. ` +
			`Right: the complex plane with the amplitudes that reach exit R, by way of L of size 0.50` +
			(blocked
				? ' and none by way of R, which is blocked'
				: `, by way of R ${two(now.byR.im)} with the record in |0⟩, added head to tail into a sum of size ${two(sumSize)}` +
					(loneShown
						? `, and by way of R with the record in |1⟩, ${two(now.other.im)}, standing apart`
						: '')) +
			`. Below: P_R against φ from 0 to 2π, ${blocked ? 'flat at 0.25' : `between ${two(swing.lo)} and ${two(swing.hi)}`}, with the delay now marked.`
	);
	const summary = $derived(
		`φ = ${phiWords(k)}, overlap ${two(overlap)}${blocked ? ', path R blocked' : ''}: P_L = ${two(now.pL)}, P_R = ${two(now.pR)}.`
	);
	const termWords = $derived(
		blocked
			? 'path R blocked: no interference term'
			: `interference term ½ cos φ × overlap = ${two(now.term)}`
	);
</script>

<div class="two-paths">
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
				With a perfect record of the path, what is the probability at exit <Tex math="L" /> when <Tex
					math="\phi = 0"
				/>, where without a record it is zero?
			{:else if step === 2}
				Set the record half-way, overlap 0.5. How deep are the fringes?
			{:else}
				Block path <Tex math="R" />. What is left?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>One half, and one half at every delay.</strong> The records are orthogonal,
				<Tex math="\langle e_R|e_L\rangle = \cos\theta = 0" />, so the interference term is gone and
				<Tex math="P_L = \tfrac12(1 - \cos\theta\cos\phi) = \tfrac12" /> whatever <Tex
					math="\phi"
				/> is. The exit that was dark now gets half of the particles: the particle behaves as if it took
				one path or the other, each half the time, a mixture.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong
					><Tex math="P_R" /> swings between 0.25 and 0.75, a swing of 0.5: the overlap.</strong
				>
				Here <Tex math="P_R = \tfrac12(1 + 0.5\cos\phi)" />, at <Tex math="\theta = 60^\circ" />.
				The record multiplies the interference term <Tex math="\tfrac12\cos\phi" /> by <Tex
					math="\langle e_R|e_L\rangle"
				/>, so the fringes keep their middle at one half and lose depth in proportion to the
				overlap.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong
					>A quarter at each exit, at every delay; the other half of the particles are absorbed.</strong
				>
				Only path <Tex math="L" /> reaches the second mirror, with the amplitude <Tex
					math={'e^{i\\phi}/\\sqrt2'}
				/>, and it leaves along each exit with an amplitude of size one half. With one term left
				nothing interferes: turning <Tex math="\phi" /> only turns the one arrow round its circle.
			{:else if step === 1}
				The answer appears once you have made the record perfect, overlap 0, and set the delay to <Tex
					math="\phi = 0"
				/>, with both paths open.
			{:else if step === 2}
				The answer appears once you have set the record to overlap 0.5, with both paths open.
			{:else}
				The answer appears once you have blocked path <Tex math="R" />.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<!-- the interferometer -->
			<g transform="translate({layout.left.x} {layout.left.y})">
				<text class="title" x="6" y="14">The interferometer</text>

				<!-- the particle comes in along L -->
				<line class="beam" x1="8" y1={BOT} x2={X0} y2={BOT} />
				<polygon class="beam-head" points="{40},{BOT} {32},{BOT - 4} {32},{BOT + 4}" />
				<text class="small start" x="8" y={BOT - 9}>
					<tspan class="it">L</tspan> in
				</text>

				<!-- path L: on, through the delay, and up -->
				<path class="beam" d="M{X0},{BOT}L{X1},{BOT}L{X1},{TOP}" />
				<!-- path R: up, and on; beyond the absorber nothing goes -->
				{#if blocked}
					<path class="beam" d="M{X0},{BOT}L{X0},{ABSORBER_Y + 4}" />
					<path class="beam dead" d="M{X0},{ABSORBER_Y - 4}L{X0},{TOP}L{X1},{TOP}" />
					<rect class="absorber" x={X0 - 9} y={ABSORBER_Y - 4} width="18" height="8" rx="1" />
					<text class="small end" x={X0 - 14} y={ABSORBER_Y + 4}>absorber</text>
				{:else}
					<path class="beam" d="M{X0},{BOT}L{X0},{TOP}L{X1},{TOP}" />
				{/if}
				<text class="small end" x={X0 - 14} y={TOP + 44}>path <tspan class="it">R</tspan></text>
				<text class="small start" x={X1 + 12} y={BOT - 50}>path <tspan class="it">L</tspan></text>

				<!-- the delay plate, as thick along the beam as φ is large -->
				<rect
					class={['plate', { none: k === 0 }]}
					x={f2(PLATE_X - plateWidth / 2)}
					y={BOT - 15}
					width={f2(plateWidth)}
					height="30"
					rx="1"
				/>
				<text class="small mid" x={PLATE_X} y={BOT + 32}
					>delay <tspan class="it">φ</tspan> = {phiWords(k)}</text
				>

				<!-- the exits -->
				<line class="beam" x1={X1} y1={TOP} x2={X1} y2={exitL.y + 5} />
				<line class="beam" x1={X1} y1={TOP} x2={exitR.x - 5} y2={TOP} />
				<path
					class="detector"
					d="M{exitL.x - 8},{exitL.y + 4}A8,8 0 0 1 {exitL.x + 8},{exitL.y + 4}Z"
				/>
				<path
					class="detector"
					d="M{exitR.x - 4},{exitR.y - 8}A8,8 0 0 1 {exitR.x - 4},{exitR.y + 8}Z"
				/>
				<text class="small end" x={exitL.x - 14} y={exitL.y + 4}
					>exit <tspan class="it">L</tspan></text
				>
				<text class="small mid" x={exitR.x} y={exitR.y + 26}>exit <tspan class="it">R</tspan></text>

				<!-- the mirrors: half-silvered in grey, full in ink -->
				<path class="half-mirror" d={mirror(X0, BOT)} />
				<path class="half-mirror" d={mirror(X1, TOP)} />
				<path class="full-mirror" d={mirror(X1, BOT, 9)} />
				<path class="full-mirror" d={mirror(X0, TOP, 9)} />

				<!-- a bar at each exit -->
				{#each [{ p: now.pL, at: { x: exitL.x + 20, y: exitL.y }, name: 'L' }, { p: now.pR, at: { x: exitR.x + 16, y: exitR.y }, name: 'R' }] as b (b.name)}
					<rect class="track" x={b.at.x} y={b.at.y - 4.5} width={BAR} height="9" rx="1.5" />
					<rect
						class="fill"
						x={b.at.x}
						y={b.at.y - 4.5}
						width={f2(Math.max(0, Math.min(1, b.p)) * BAR)}
						height="9"
						rx="1.5"
					/>
					<line
						class="half-tick"
						x1={b.at.x + BAR / 2}
						x2={b.at.x + BAR / 2}
						y1={b.at.y + 6}
						y2={b.at.y + 9}
					/>
					<text class="small start value-words" x={b.at.x} y={b.at.y - 11}
						><tspan class="it">P</tspan><tspan class="it sub" dy="3">{b.name}</tspan><tspan dy="-3"
							>{` = ${two(b.p)}`}</tspan
						></text
					>
				{/each}

				<!-- the record's two states -->
				<text class="small mid dim" x={DIAL.x + 12} y={TOP + 17}>the record’s states</text>
				{#if theta > 0.004}
					<line class="drop" x1={f2(eR.x)} y1={f2(eR.y)} x2={f2(eR.x)} y2={DIAL.y} />
				{/if}
				{#if dialArc}
					<path class="arc" d={dialArc.d} />
					{#if theta > 0.25}
						<text class="small it mid" x={f2(dialArc.label.x)} y={f2(dialArc.label.y)}>θ</text>
					{/if}
				{/if}
				{#if eLArrow}
					<g class="ink-arrow">
						<path d={eLArrow.shaft} />
						<polygon points={eLArrow.head} />
					</g>
				{/if}
				{#if eRArrow}
					<g class="ink-arrow">
						<path d={eRArrow.shaft} />
						<polygon points={eRArrow.head} />
					</g>
				{/if}
				{#if theta < 0.21}
					<text class="small mid" x={DIAL.x + DIAL.r / 2} y={DIAL.y + 20}
						>|<tspan class="it">e</tspan><tspan class="it sub" dy="3">L</tspan><tspan dy="-3"
							>⟩ = |</tspan
						><tspan class="it">e</tspan><tspan class="it sub" dy="3">R</tspan><tspan dy="-3"
							>⟩</tspan
						></text
					>
				{:else}
					<text class="small start" x={DIAL.x + DIAL.r + 6} y={DIAL.y + 4}
						>|<tspan class="it">e</tspan><tspan class="it sub" dy="3">L</tspan><tspan dy="-3"
							>⟩</tspan
						></text
					>
					<text
						class="small {theta > 1.3 ? 'mid' : 'start'}"
						x={f2(eRLabel.x - (theta > 1.3 ? 0 : 4))}
						y={f2(eRLabel.y + (theta > 1.3 ? 0 : 2))}
						>|<tspan class="it">e</tspan><tspan class="it sub" dy="3">R</tspan><tspan dy="-3"
							>⟩</tspan
						></text
					>
				{/if}
			</g>

			<!-- the amplitudes at exit R -->
			<g transform="translate({layout.right.x} {layout.right.y})">
				<text class="title" x="6" y="14">Amplitudes at exit <tspan class="it">R</tspan></text>
				<line class="axis" x1="30" y1={O.y} x2="250" y2={O.y} />
				<line class="axis" x1={O.x} y1={O.y + 0.62 * S} x2={O.x} y2={O.y - 1.08 * S} />
				<text class="small dim start" x="254" y={O.y + 4}>Re</text>
				<text class="small dim mid" x={O.x} y={O.y - 1.08 * S - 6}>Im</text>
				<line class="tick" x1={O.x - 3} x2={O.x + 3} y1={O.y - S / 2} y2={O.y - S / 2} />
				<line class="tick" x1={O.x - 3} x2={O.x + 3} y1={O.y - S} y2={O.y - S} />
				<text class="small dim halo end" x={O.x - 6} y={O.y - S / 2 + 12}
					><tspan class="it">i</tspan>/2</text
				>
				<text class="small dim halo end" x={O.x - 6} y={O.y - S + 4}
					><tspan class="it">i</tspan></text
				>
				<circle class="track-circle" cx={O.x} cy={O.y} r={S / 2} />

				{#if sumArrow}
					<g class="sum-arrow">
						<path d={sumArrow.shaft} />
						<polygon points={sumArrow.head} />
					</g>
				{/if}
				{#if lArrow}
					<g class="ink-arrow">
						<path d={lArrow.shaft} />
						<polygon points={lArrow.head} />
					</g>
				{/if}
				{#if rArrow}
					<g class="ink-arrow">
						<path d={rArrow.shaft} />
						<polygon points={rArrow.head} />
					</g>
				{/if}
				<text class="small halo {lLabel.anchor}" x={f2(lLabel.x)} y={f2(lLabel.y)}
					>by way of <tspan class="it">L</tspan></text
				>
				{#if rArrow && Math.abs(B.y - A.y) > 14 * u}
					<text class="small halo {rLabel.anchor}" x={f2(rLabel.x)} y={f2(rLabel.y)}
						>by way of <tspan class="it">R</tspan></text
					>
				{/if}
				{#if sumSize > 0.02}
					<text class="small halo strong {sumLabel.anchor}" x={f2(sumLabel.x)} y={f2(sumLabel.y)}
						>sum</text
					>
				{:else}
					<circle class="zero" cx={O.x} cy={O.y} r={4.5 * u} />
					<text class="small halo strong start" x={O.x + 9 * u} y={O.y - 8 * u}>sum 0</text>
				{/if}

				{#if loneShown}
					<line class="tick" x1={LONE.x - 6} x2={LONE.x + 6} y1={LONE.y} y2={LONE.y} />
					{#if loneArrow}
						<g class="lone-arrow">
							<path d={loneArrow.shaft} />
							<polygon points={loneArrow.head} />
						</g>
					{/if}
					<text
						class="small {lonePlace === 'left' ? 'start' : 'end'}"
						x={lonePlace === 'left' ? 4 : 298}
						y={f2(loneTip.y - 22)}>by way of <tspan class="it">R</tspan>,</text
					>
					<text
						class="small {lonePlace === 'left' ? 'start' : 'end'}"
						x={lonePlace === 'left' ? 4 : 298}
						y={f2(loneTip.y - 9)}>record in |1⟩</text
					>
				{/if}

				<text class="small mid term" x="150" y="290">{termWords}</text>
			</g>

			<!-- the fringes -->
			<g transform="translate({layout.plot.x} {layout.plot.y})">
				<text class="title" x="6" y="14"
					><tspan class="it">P</tspan><tspan class="it sub" dy="3">R</tspan><tspan dy="-3"
						>&nbsp;against the delay&nbsp;</tspan
					><tspan class="it">φ</tspan></text
				>
				{#each [0, 0.5, 1] as p (p)}
					<line class={['grid', { base: p === 0 }]} x1={px0} x2={px1} y1={fy(p)} y2={fy(p)} />
					<text class="small dim end" x={px0 - 6} y={fy(p) + 4}>{p === 0.5 ? '½' : p}</text>
				{/each}
				{#each xTicks as t (t)}
					<line class="tick" x1={fx(phiOf(t))} x2={fx(phiOf(t))} y1={PY0} y2={PY0 + 4} />
					{#if t % 12 === 0}
						<text class="small dim mid" x={fx(phiOf(t))} y={PY0 + 17}>{phiWords(t)}</text>
					{/if}
				{/each}
				<text class="small it start" x={px1 + 8} y={PY0 + 4}>φ</text>
				{#if compare}
					<path class="bare" d={barePath} />
				{/if}
				<path class="fringe" d={curvePath} />
				<line class="now" x1={fx(now.phi)} x2={fx(now.phi)} y1={PY1 - 4} y2={PY0} />
				<circle class="now-dot" cx={f2(fx(now.phi))} cy={f2(fy(now.pR))} r={4 * u} />
				<!-- the swing of the fringes -->
				<line
					class="swing"
					x1={px1 + 30}
					x2={px1 + 30}
					y1={f2(fy(swing.hi))}
					y2={f2(fy(swing.lo))}
				/>
				<line
					class="swing"
					x1={px1 + 26}
					x2={px1 + 34}
					y1={f2(fy(swing.hi))}
					y2={f2(fy(swing.hi))}
				/>
				<line
					class="swing"
					x1={px1 + 26}
					x2={px1 + 34}
					y1={f2(fy(swing.lo))}
					y2={f2(fy(swing.lo))}
				/>
				<text class="small start" x={px1 + 40} y={f2((fy(swing.hi) + fy(swing.lo)) / 2 - 3)}
					>swing</text
				>
				<text
					class="small start value-words"
					x={px1 + 40}
					y={f2((fy(swing.hi) + fy(swing.lo)) / 2 + 11)}>{two(swing.swing)}</text
				>
			</g>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="line-key"></span>an amplitude by way of one path</li>
			<li>
				<span class="line-key sum-key"></span>their sum; its squared length is its share of
				<Tex math="P_R" />
			</li>
			{#if loneShown}
				<li>
					<span class="line-key lone-key"></span>by way of R with the record in |1⟩, which nothing
					adds to
				</li>
			{/if}
			{#if compare}
				<li>
					<span class="line-key bare-key"></span><Tex math="P_R" /> with no record, both paths open
				</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div class="slot" onkeydowncapture={sliderKeys(() => k, setK, PHI)} role="presentation">
				<Slider
					id="{uid}-phi"
					label="Delay on path L"
					icon={RotateClockwiseIcon}
					min={PHI.min}
					max={PHI.max}
					step={PHI.step}
					bind:value={() => k, setK}
					readout="φ = {phiWords(k)}"
					marks={[
						{ at: 0, label: '0' },
						{ at: OPENING.k, label: 'π/3, as the figure opens' },
						{ at: 6, label: 'π/2' },
						{ at: 12, label: 'π' },
						{ at: 24, label: '2π' }
					]}
					marksHint="the ticks mark 0, π/3, π/2, π and 2π"
				/>
			</div>
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => recordOf(overlap), setRecord, RECORD)}
				role="presentation"
			>
				<Slider
					id="{uid}-record"
					label="Record of the path"
					icon={FingerprintScanIcon}
					min={RECORD.min}
					max={RECORD.max}
					step={RECORD.step}
					bind:value={() => recordOf(overlap), setRecord}
					readout="overlap cos θ = {two(overlap)}"
					marks={[
						{ at: 0, label: 'no record, overlap 1' },
						{ at: 0.5, label: 'half-way, overlap 0.5' },
						{ at: 1, label: 'a perfect record, overlap 0' }
					]}
					marksHint="the ticks mark no record, half-way and a perfect record"
				/>
			</div>
		</div>

		<div class="controls">
			<button type="button" class="action" aria-pressed={blocked} onclick={toggleBlock}>
				<HugeiconsIcon icon={BlockedIcon} size={16} strokeWidth={1.7} />
				Block path R
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Reach the sliders and the button with Tab. The arrow keys step the delay by π/12 and the
				record by 0.05, Shift by π/4 and 0.25; Home and End go to the ends.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>The exits</dt>
				<dd>
					<span class="eq"><Tex math={`P_L = ${two(now.pL)},\\quad P_R = ${two(now.pR)}`} /></span>
					<span class="also"
						>{#if blocked}absorbed on path R: <span class="value">{two(now.absorbed)}</span
							>{:else}they add to one{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The record</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\langle e_R|e_L\\rangle = \\cos\\theta = ${two(overlap)},\\quad \\theta = ${degrees(overlap)}^\\circ`}
						/></span
					>
					<span class="also">{recordWords}</span>
				</dd>
			</div>
			<div class="row">
				<dt>The fringes</dt>
				<dd>
					<span class="also">
						{#if blocked}
							<Tex math="P_R" /> is flat at <span class="value">{two(swing.lo)}</span>: no swing
						{:else}
							<Tex math="P_R" /> swings between <span class="value">{two(swing.lo)}</span> and
							<span class="value">{two(swing.hi)}</span>, a swing of
							<span class="value">{two(swing.swing)}</span>
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>The closed form</dt>
				<dd>
					{#if blocked}
						<span class="eq"><Tex math="P_L = P_R = \tfrac14" /></span>
					{:else}
						<span class="eq"
							><Tex
								math={`P_R = \\tfrac12(1 + \\cos\\theta\\cos\\phi) = ${two(now.closedR)}`}
							/></span
						>
					{/if}
					<span class="also"
						>at <Tex math={`\\phi = ${phiTex(k)}`} />; the figure multiplies the tables and agrees</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The figure multiplies the chapter’s tables for a particle sent in along <Tex math="L" />, the
			record starting in <Tex math="|0\rangle" />: the first mirror <Tex
				math={'U = \\tfrac1{\\sqrt2}\\begin{pmatrix} 1 & i\\\\ i & 1\\end{pmatrix}'}
			/>, the record, which leaves <Tex math="|e_L\rangle = (1, 0)" /> on path <Tex math="L" /> and makes
			<Tex math="|e_R\rangle = (\cos\theta, \sin\theta)" /> on path <Tex math="R" />, the delay <Tex
				math={'D = \\mathrm{diag}(e^{i\\phi}, 1)'}
			/>, the absorber if path <Tex math="R" /> is blocked, and the second mirror, on the four amplitudes
			of
			<Tex math="(L0, L1, R0, R1)" />. The arrows are the amplitudes for leaving along <Tex
				math="R"
			/>, each found with the other path blocked: <Tex math={'ie^{i\\phi}/2'} /> by way of <Tex
				math="L"
			/>, and by way of <Tex math="R" />
			<Tex math={'\\tfrac{i}2\\cos\\theta'} /> with the record in <Tex math="|0\rangle" /> and <Tex
				math={'\\tfrac{i}2\\sin\\theta'}
			/> with it in <Tex math="|1\rangle" />. Path <Tex math="L" /> leaves the record in <Tex
				math="|0\rangle"
			/>, so only the first part of path <Tex math="R" />’s amplitude adds to it; <Tex math="P_R" /> is
			the squared length of the sum plus that of the part that stands apart. The plate’s thickness is
			drawn in proportion to <Tex math="\phi" />.
		</p>
	</div>
</div>

<style>
	.two-paths {
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
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 740px;
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

	.dim {
		fill: var(--text-faint);
	}

	.strong,
	.value-words {
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

	tspan.sub {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the interferometer: thin ink paths, the half-silvered mirrors thick and grey, the full mirrors in ink */
	.beam {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: miter;
	}

	.beam.dead {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.beam-head {
		fill: var(--text);
	}

	.half-mirror {
		stroke: color-mix(in srgb, var(--text) 45%, var(--bg));
		stroke-width: 5;
		stroke-linecap: butt;
	}

	.full-mirror {
		stroke: var(--text);
		stroke-width: 3.2;
		stroke-linecap: butt;
	}

	.plate {
		fill: color-mix(in srgb, var(--text) 16%, transparent);
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.plate.none {
		fill: none;
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.absorber {
		fill: var(--text);
	}

	.detector {
		fill: var(--text);
	}

	.track {
		fill: color-mix(in srgb, var(--text) 10%, transparent);
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.fill {
		fill: var(--text);
	}

	.half-tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.drop {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.arc {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ink-arrow path {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.ink-arrow polygon {
		fill: var(--text);
	}

	/* the sum: thicker and paler, under the two arrows that make it */
	.sum-arrow path {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(5px * var(--u, 1));
	}

	.sum-arrow polygon {
		fill: color-mix(in srgb, var(--text) 42%, transparent);
	}

	.lone-arrow path {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.lone-arrow polygon {
		fill: var(--text);
	}

	.zero {
		fill: var(--bg-sunken);
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.track-circle {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.term {
		fill: var(--text);
	}

	/* the fringes */
	.grid {
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.base {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.fringe {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linejoin: round;
	}

	.bare {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.now {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.now-dot {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.swing {
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 740px;
		margin: 0.45rem auto 0;
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

	.line-key {
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.6px solid var(--text);
	}

	.sum-key {
		border-top: 5px solid color-mix(in srgb, var(--text) 42%, transparent);
	}

	.lone-key {
		border-top-style: dashed;
	}

	.bare-key {
		border-top: 1.4px dashed color-mix(in srgb, var(--text) 45%, transparent);
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

	.action[aria-pressed='true'] {
		border-color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--accent);
		background: color-mix(in srgb, var(--accent) 12%, var(--bg));
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

	.value {
		font-weight: 600;
		color: var(--text);
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
