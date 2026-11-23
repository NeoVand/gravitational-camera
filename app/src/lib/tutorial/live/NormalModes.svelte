<script lang="ts">
	/**
	 * Chapter 4.3's disc of masses on springs: nineteen equal masses on a triangular lattice, a hexagon of side two
	 * spacings, joined to their nearest neighbours by 42 equal springs, unstretched at rest, in the plane. Its 38
	 * modes come from ./normal-modes.ts: three zero modes (the two slides and the turn) and 35 that ring. Left, the
	 * disc, ringing in the mode picked from the list, or holding a shape the reader drags (with the pointer, or with
	 * Tab and the arrow keys); "Release" lets the shape swing as the sum of its modes, and "Squash" sets the shape
	 * u = (x, −y). Each spring is tinted by its stretch. Right, the shares a_n²/Σa² of the shape in each mode, in order
	 * of frequency, and where Rayleigh's quotient of the shape, with its zero-mode parts removed, lies among the
	 * notes, against the lowest one. Three predictions at the top are answered once the reader has done what they ask.
	 * The motion stops while the figure is off the screen; under reduced motion it waits for the play button.
	 */
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		PauseIcon,
		PlayIcon,
		ShrinkIcon,
		Undo02Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BALL,
		COORDS,
		COUNT,
		EDGE,
		EDGE_PULL,
		FIRST_RINGING,
		LOWEST,
		MODES,
		NOTES,
		OUTWARD_WITHIN,
		SITES,
		SPRINGS,
		SQUASH,
		amplitudes,
		edgePulledOut,
		largest,
		noteShares,
		outward,
		rayleigh,
		shares,
		squash,
		stretches,
		swing
	} from './normal-modes';

	const uid = $props.id();

	/** The pace of the motion: units of time √(m/k) per second. */
	const PACE = 5;
	/** A mode is drawn with its largest displacement this many spacings, and a dragged mass may go this far. */
	const SHOWN = 0.3;
	const REACH = 0.6;
	/** The squash's size: its largest displacement, at the corners, is 0.24 spacings. */
	const SQUASH_SIZE = 0.12;
	/** The arrow keys move a mass this far, and five times as far with Shift. */
	const NUDGE = 0.02;
	/** The masses the reader must move by hand before the first answer. */
	const HAND_MASSES = 3;

	// --- what the disc does ---------------------------------------------------------------------------------------
	/** Ringing in one mode, holding a shape, or swinging from a shape released. */
	type View = { kind: 'mode'; n: number } | { kind: 'hold' } | { kind: 'swing' };
	let view = $state<View>({ kind: 'mode', n: FIRST_RINGING });
	/** The shape held, or released: the displacements of the masses, in spacings. */
	let held = $state.raw<Float64Array>(new Float64Array(COORDS));
	/** The amplitudes of the shape released, which the swing keeps. */
	let released: Float64Array = new Float64Array(COORDS);
	/** The last mode picked, which the list keeps reachable by Tab when none is picked. */
	let lastMode = $state(FIRST_RINGING);
	const picked = $derived(view.kind === 'mode' ? view.n : undefined);

	/** The time since the mode was picked or the shape released, in units of √(m/k). */
	let time = 0;
	const sizeOf = (n: number) => SHOWN / largest(MODES[n].v);
	function displaced(): Float64Array {
		if (view.kind === 'mode') {
			const m = MODES[view.n];
			const c = sizeOf(view.n) * Math.cos(m.omega * time);
			return Float64Array.from(m.v, (x) => c * x);
		}
		if (view.kind === 'swing') return swing(released, time, new Float64Array(COORDS));
		return held;
	}
	/** The displacements drawn now. */
	let shown = $state.raw<Float64Array>(displaced());

	/** The shape whose shares and quotient are read: the mode's pattern, or the shape held or released. */
	const shape = $derived(view.kind === 'mode' ? MODES[view.n].v : held);
	const share = $derived(shares(amplitudes(shape)));
	const groups = $derived(noteShares(share));
	const quotient = $derived(rayleigh(shape));
	const atRest = $derived(largest(shape) === 0);
	const ringing = $derived(view.kind !== 'mode' || MODES[view.n].kind === 'ring');

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	/** The masses moved by hand, and the lowest quotient of a shape made by hand. */
	let handMoved = $state.raw<ReadonlySet<number>>(new Set());
	let lowestByHand = $state<number | undefined>();
	let squashed = $state(false);
	/** The quotient of the first pull of one edge mass outward, and the angle it made with straight out. */
	let pulled = $state<{ omega: number; zeroShare: number; angle: number } | undefined>();
	const revealed = $derived(
		step === 1 ? handMoved.size >= HAND_MASSES : step === 2 ? squashed : pulled !== undefined
	);

	/** After each move by hand: what the predictions are waiting for. */
	function noteHand(a: number) {
		if (!handMoved.has(a)) handMoved = new Set([...handMoved, a]);
		const r = rayleigh(held);
		if (r.omega !== undefined)
			lowestByHand = lowestByHand === undefined ? r.omega : Math.min(lowestByHand, r.omega);
		const edge = edgePulledOut(held);
		if (edge !== undefined && pulled === undefined && r.omega !== undefined) {
			const [ox, oy] = outward(edge);
			const dx = held[2 * edge];
			const dy = held[2 * edge + 1];
			const angle = Math.acos(Math.min(1, (dx * ox + dy * oy) / Math.hypot(dx, dy)));
			pulled = { omega: r.omega, zeroShare: r.zeroShare, angle };
		}
	}

	// --- the actions --------------------------------------------------------------------------------------------------
	function pick(n: number) {
		view = { kind: 'mode', n };
		lastMode = n;
		time = 0;
		shown = displaced();
		wake();
	}

	/** Holds what is drawn now, so that the reader can change it. */
	function hold() {
		if (view.kind === 'hold') return;
		held = Float64Array.from(shown);
		view = { kind: 'hold' };
	}

	function release() {
		if (atRest) return;
		hold();
		released = amplitudes(held);
		view = { kind: 'swing' };
		time = 0;
		playing = true;
		shown = displaced();
		wake();
	}

	function setSquash() {
		held = squash(SQUASH_SIZE);
		view = { kind: 'hold' };
		shown = held;
		squashed = true;
	}

	function rest() {
		held = new Float64Array(COORDS);
		view = { kind: 'hold' };
		shown = held;
	}

	/** Moves the mass a to the displacement (dx, dy), at most REACH from its place. */
	function place(a: number, dx: number, dy: number) {
		hold();
		const r = Math.hypot(dx, dy);
		const f = r > REACH ? REACH / r : 1;
		const next = Float64Array.from(held);
		next[2 * a] = dx * f;
		next[2 * a + 1] = dy * f;
		held = next;
		shown = held;
		noteHand(a);
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let onScreen = false;
	let frame = 0;
	let last: number | undefined;
	const moving = () => playing && (view.kind === 'swing' || (view.kind === 'mode' && ringing));

	function tick(now: number) {
		frame = 0;
		if (!onScreen || !moving()) {
			last = undefined;
			return;
		}
		const dt = last === undefined ? 0 : Math.min(0.1, (now - last) / 1000);
		last = now;
		time += dt * PACE;
		shown = displaced();
		frame = requestAnimationFrame(tick);
	}

	function wake() {
		if (frame || !onScreen || !moving() || typeof requestAnimationFrame === 'undefined') return;
		frame = requestAnimationFrame(tick);
	}

	function togglePlay() {
		playing = !playing;
		last = undefined;
		wake();
	}

	/** Runs the frames while the figure is on the screen; under reduced motion it opens paused. */
	const life: Attachment<HTMLElement> = (node) =>
		untrack(() => {
			if (prefersReducedMotion.current) playing = false;
			const observer = new IntersectionObserver((entries) => {
				onScreen = entries.some((e) => e.isIntersecting);
				if (onScreen) wake();
			});
			observer.observe(node);
			return () => {
				observer.disconnect();
				onScreen = false;
				if (frame) cancelAnimationFrame(frame);
				frame = 0;
			};
		});

	// --- the disc ---------------------------------------------------------------------------------------------------
	const W = 320;
	const TOP = 24;
	const PANEL = { x: 0, y: TOP, w: W, h: W };
	const H = TOP + W + 2;
	/** Drawing units per spacing, and the centre of the panel. */
	const PER = W / 5.8;
	const CX = PANEL.x + PANEL.w / 2;
	const CY = PANEL.y + PANEL.h / 2;
	const MASS_R = 0.12 * PER;
	/** A spring is tinted fully when it is stretched or squeezed by this many spacings. */
	const FULL_TINT = 0.12;

	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const at = (x: number, y: number) => ({ x: CX + x * PER, y: CY - y * PER });
	const rests = SITES.map(([x, y]) => at(x, y));
	const points = $derived(SITES.map(([x, y], a) => at(x + shown[2 * a], y + shown[2 * a + 1])));
	const springs = $derived.by(() => {
		const s = stretches(shown);
		return SPRINGS.map(([a, b], i) => {
			const p = Math.round(100 * Math.min(1, Math.abs(s[i]) / FULL_TINT));
			const tint = s[i] > 0 ? '--accent' : '--accent-2';
			return {
				key: `${a}-${b}`,
				x1: points[a].x,
				y1: points[a].y,
				x2: points[b].x,
				y2: points[b].y,
				stroke: `color-mix(in srgb, var(${tint}) ${p}%, color-mix(in srgb, var(--text) 32%, transparent))`
			};
		});
	});

	// --- dragging the masses, by pointer and by keys ---------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const keep: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<number | undefined>();
	/** Where the pointer took the mass, from its centre, in spacings. */
	let grip = { x: 0, y: 0 };

	function pointerAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: (p.x - CX) / PER, y: -(p.y - CY) / PER };
	}

	function press(a: number, e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		(e.currentTarget as SVGElement).focus({ preventScroll: true });
		hold();
		const p = pointerAt(e);
		if (!p) return;
		grip = { x: SITES[a][0] + held[2 * a] - p.x, y: SITES[a][1] + held[2 * a + 1] - p.y };
		dragging = a;
	}

	function move(e: PointerEvent) {
		if (dragging === undefined) return;
		const p = pointerAt(e);
		if (!p) return;
		const a = dragging;
		place(a, p.x + grip.x - SITES[a][0], p.y + grip.y - SITES[a][1]);
	}

	function letGo() {
		dragging = undefined;
	}

	/** The arrow keys move a mass by NUDGE, five times as far with Shift; Home puts it back at rest. */
	function massKey(a: number, e: KeyboardEvent) {
		const by = e.shiftKey ? 5 * NUDGE : NUDGE;
		const step: Record<string, [number, number]> = {
			ArrowLeft: [-by, 0],
			ArrowRight: [by, 0],
			ArrowUp: [0, by],
			ArrowDown: [0, -by]
		};
		if (e.key === 'Home') {
			e.preventDefault();
			hold();
			place(a, 0, 0);
			return;
		}
		if (!(e.key in step)) return;
		e.preventDefault();
		hold();
		const [dx, dy] = step[e.key];
		place(a, held[2 * a] + dx, held[2 * a + 1] + dy);
	}

	const where = (a: number) => {
		const dx = shown[2 * a];
		const dy = shown[2 * a + 1];
		if (Math.hypot(dx, dy) < 5e-4) return 'at rest';
		const side = (v: number, plus: string, minus: string) =>
			Math.abs(v) < 5e-4 ? undefined : `${Math.abs(v).toFixed(2)} ${v > 0 ? plus : minus}`;
		const parts = [side(dx, 'right', 'left'), side(dy, 'up', 'down')].filter(Boolean);
		return `moved ${parts.join(' and ')}, in spacings`;
	};
	const placeName = (a: number) =>
		Math.hypot(SITES[a][0], SITES[a][1]) < 1e-9
			? 'the centre'
			: EDGE.includes(a)
				? 'the rim'
				: 'the inner ring';

	// --- the shares and the notes ------------------------------------------------------------------------------------
	const SW = 320;
	const BL = 34;
	const BR = SW - 4;
	const BTOP = 10;
	const BASE = 196;
	const slot = (BR - BL) / COORDS;
	const shareY = (s: number) => BASE - s * (BASE - BTOP);
	const bars = $derived(
		NOTES.map((n, g) => ({
			key: g,
			zero: n.zero,
			x: BL + n.first * slot + 0.6,
			w: n.size * slot - 1.2,
			y: shareY(groups[g]),
			h: groups[g] * (BASE - BTOP)
		}))
	);
	const centreOf = (g: number) => BL + (NOTES[g].first + NOTES[g].size / 2) * slot;
	/** The groups whose frequency is written under the bars: the lowest pair, the three at √1.5 and the highest. */
	const LABELLED = [
		1,
		NOTES.findIndex((n) => Math.abs(n.omega - Math.sqrt(1.5)) < 1e-6),
		NOTES.length - 1
	];

	/** The scale of notes: frequencies from 0 to 2.4. */
	const G_LINE = 286;
	const G_MOST = 2.4;
	const gx = (w: number) => BL + (w / G_MOST) * (BR - BL);
	const SH = 308;
	const ringingNotes = NOTES.filter((n) => !n.zero);
	/** The quotient's label sits to the right of its dot, unless that would run off the panel. */
	const quotientLabel = $derived.by(() => {
		const w = quotient.omega;
		if (w === undefined) return undefined;
		const x = gx(w);
		const right = x + 84 * u < SW;
		return { x: x + (right ? 5 : -5) * u, anchor: right ? 'start' : 'end' };
	});

	// --- the words ----------------------------------------------------------------------------------------------------
	const f3 = (n: number) => n.toFixed(3);
	const pc = (s: number, d = 0) => `${(100 * s).toFixed(d)}%`;
	const UNIT = '\\sqrt{k/\\htmlClass{q-matter}{m}}';
	const QUOTIENT_SQUARED =
		'\\mathbf q^{\\mathsf T}\\mathbf K\\mathbf q / \\mathbf q^{\\mathsf T}\\mathbf M\\mathbf q';
	const QUOTIENT = `\\sqrt{${QUOTIENT_SQUARED}}`;
	const SHARE = 'a_n^2/\\textstyle\\sum_m a_m^2';
	const ORDINAL = ['first', 'second', 'third'];

	/** A mode in words, for the list and for the readouts. */
	function modeWords(n: number): string {
		const m = MODES[n];
		if (m.kind === 'slide-x') return 'the slide along x, a zero mode';
		if (m.kind === 'slide-y') return 'the slide along y, a zero mode';
		if (m.kind === 'turn') return 'the turn, a zero mode';
		const size = NOTES[m.group].size;
		const company =
			size === 1
				? 'alone at its frequency'
				: `the ${ORDINAL[m.member]} of ${size === 2 ? 'a pair' : 'three'} at this frequency`;
		const extra =
			n === FIRST_RINGING
				? ', the squash along the axes'
				: n === FIRST_RINGING + 1
					? ', the squash at 45°'
					: '';
		return `${company}${extra}`;
	}
	const chipText = (n: number) =>
		MODES[n].kind === 'slide-x'
			? 'slide x'
			: MODES[n].kind === 'slide-y'
				? 'slide y'
				: MODES[n].kind === 'turn'
					? 'turn'
					: f3(MODES[n].omega);

	/** The note holding the largest share of the shape. */
	const biggest = $derived.by(() => {
		let g = 0;
		for (let i = 1; i < NOTES.length; i++) if (groups[i] > groups[g]) g = i;
		return g;
	});
	const noteName = (g: number) =>
		NOTES[g].zero
			? 'the zero modes'
			: g === 1
				? `the lowest pair, at ${f3(NOTES[1].omega)}`
				: NOTES[g].size === 1
					? `the mode at ${f3(NOTES[g].omega)}`
					: `the ${NOTES[g].size === 2 ? 'pair' : 'three modes'} at ${f3(NOTES[g].omega)}`;

	const squashRest = Array.from(SQUASH.share)
		.map((s, g) => ({ s, g }))
		.filter(({ s, g }) => g > 1 && s > 0.01);

	// --- the mode list: a group of radio buttons; Tab reaches the chosen one, the arrows move the choice ------------
	const chips: (HTMLButtonElement | undefined)[] = [];
	const keepChip =
		(n: number): Attachment<HTMLButtonElement> =>
		(node) => {
			chips[n] = node;
			return () => (chips[n] = undefined);
		};
	function chipKeys(e: KeyboardEvent) {
		const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
		const on = e.key === 'ArrowRight' || e.key === 'ArrowDown';
		if (!back && !on && e.key !== 'Home' && e.key !== 'End') return;
		e.preventDefault();
		const i = picked ?? lastMode;
		const next =
			e.key === 'Home' ? 0 : e.key === 'End' ? COORDS - 1 : (i + (on ? 1 : COORDS - 1)) % COORDS;
		pick(next);
		chips[next]?.focus();
	}

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`A disc of ${COUNT} masses on a triangular lattice joined by ${SPRINGS.length} springs. ` +
			(view.kind === 'mode'
				? `It shows mode ${view.n + 1} of ${COORDS}, ${modeWords(view.n)}${MODES[view.n].kind === 'ring' ? `, at the frequency ${f3(MODES[view.n].omega)}` : ''}.`
				: view.kind === 'swing'
					? 'It swings from the shape you released.'
					: atRest
						? 'Every mass is at rest.'
						: 'It holds the shape you made.') +
			' Stretched springs are tinted orange, squeezed ones blue. Each mass can be reached with Tab and moved with the arrow keys.'
	);
	const sharesLabel = $derived(
		atRest
			? 'No shape: every mass is at rest.'
			: `The largest share of the shape, ${pc(groups[biggest])}, lies in ${noteName(biggest)}. ` +
					(quotient.omega === undefined
						? 'The shape lies wholly in the zero modes, so it has no quotient.'
						: `Rayleigh's quotient is ${f3(quotient.omega)}, against the lowest note ${f3(LOWEST)}.`)
	);
</script>

<div class="normal-modes" {@attach life}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Can any shape you make give a quotient below the lowest note?
			{:else if step === 2}
				Press <em>Squash</em>. How far above the lowest note is its quotient, and how much of the
				shape lies in that mode?
			{:else}
				Now pull one edge mass outward alone. How far above the lowest note is its quotient?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No.</strong> Once the zero-mode parts are removed, the quotient <Tex
					math={QUOTIENT_SQUARED}
				/> is the average of the <Tex math="\omega_n^2" /> of the modes in the shape, weighted by their
				shares, and an average is never below the smallest thing it averages, <Tex
					math="\omega_1^2"
				/>. It equals <Tex math="\omega_1^2" /> only when the shape is a mode of the lowest pair.
				{#if lowestByHand !== undefined}
					As a frequency, the lowest quotient among the shapes you made was {f3(lowestByHand)}, {pc(
						lowestByHand / LOWEST - 1,
						1
					)} above the lowest note.
				{/if}
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong
					>{f3(SQUASH.omega)}, {pc(SQUASH.above, 1)} above the lowest note, with {pc(SQUASH.lowest)}
					of the shape in the lowest pair.</strong
				>
				The rest lies in {squashRest
					.map(({ s, g }) => `the pair at ${f3(NOTES[g].omega)} (${pc(s, 1)})`)
					.join(' and ')}, with a trace higher up. The squash is a smooth guess at the first mode of
				the lowest pair, so the higher modes it mixes in carry only about a tenth of it. Compare the
				lattice ball of Appendix A, whose trial shape gives a quotient {pc(BALL.above)} above its mode,
				with
				{pc(BALL.share)} of the shape at that frequency.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && pulled}
				<strong>{EDGE_PULL.ratio.toFixed(2)} times the lowest note</strong>, a quotient of {f3(
					EDGE_PULL.omega
				)}, for any of the twelve edge masses pulled straight outward, once the zero-mode parts are
				removed: one part in {COUNT} of the pull, {pc(EDGE_PULL.zeroShare, 1)}, is a slide of the
				whole disc, which does not ring. A jagged shape mixes in high modes: {pc(EDGE_PULL.high)} of the
				ringing part lies in modes above 1.5. Your pull, {pulled.angle < 0.02
					? 'straight outward'
					: `${Math.round((pulled.angle * 180) / Math.PI)}° from straight outward`}, gave {f3(
					pulled.omega
				)}, {(pulled.omega / LOWEST).toFixed(2)} times the lowest note; a pull to the side gives more.
			{:else if step === 1}
				The answer appears when you have dragged {HAND_MASSES} masses or more to make shapes of your own.
			{:else if step === 2}
				The answer appears when you have pressed <em>Squash</em>.
			{:else}
				The answer appears when you have pulled one of the twelve masses on the rim outward, within {Math.round(
					(OUTWARD_WITHIN * 180) / Math.PI
				)}° of straight out from the centre, with every other mass at rest. <em>Rest</em> puts every mass
				back.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="pair">
			<div class="panel">
				<svg
					viewBox="0 0 {W} {H}"
					role="group"
					aria-label={description}
					class={{ dragging: dragging !== undefined }}
					onpointermove={move}
					onpointerup={letGo}
					onpointercancel={letGo}
					{@attach keep}
					{@attach fitText((value) => (u = value))}
				>
					<text class="title" x="4" y={TOP - 9 * u}>The disc of {COUNT} masses</text>
					<rect
						class="frame"
						x={PANEL.x + 0.5}
						y={PANEL.y + 0.5}
						width={PANEL.w - 1}
						height={PANEL.h - 1}
						rx="8"
					/>
					{#each rests as r, a (a)}
						<circle class="rest" cx={r.x} cy={r.y} r={2.2 * u} />
					{/each}
					{#each springs as s (s.key)}
						<line class="spring" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} style:stroke={s.stroke} />
					{/each}
					{#each points as p, a (a)}
						<g
							class="mass"
							transform="translate({f2(p.x)} {f2(p.y)})"
							role="button"
							tabindex="0"
							aria-roledescription="movable mass"
							aria-label="Mass {a + 1} of {COUNT}, on {placeName(a)}, {where(a)}"
							onpointerdown={(e) => press(a, e)}
							onkeydown={(e) => massKey(a, e)}
						>
							<circle class="hit" r={MASS_R + 7} />
							<circle class="focus" r={MASS_R + 4} />
							<circle class="dot" r={MASS_R} />
						</g>
					{/each}
				</svg>
				<ul class="legend" aria-hidden="true">
					<li><span class="dot-key"></span>a mass</li>
					<li><span class="rest-key"></span>its place at rest</li>
					<li><span class="swatch stretched"></span>a spring stretched</li>
					<li><span class="swatch squeezed"></span>a spring squeezed</li>
				</ul>
			</div>

			<div class="panel shares">
				<p class="title">
					The shares <Tex math={SHARE} /> of the shape in each mode
				</p>
				<svg viewBox="0 0 {SW} {SH}" role="img" aria-label={sharesLabel} {@attach fitText()}>
					<!-- the shares -->
					{#each [0.5, 1] as s (s)}
						<line class="grid" x1={BL} x2={BR} y1={shareY(s)} y2={shareY(s)} />
					{/each}
					<text class="num" x={BL - 5} y={shareY(1) + 3.5 * u} text-anchor="end">100%</text>
					<text class="num" x={BL - 5} y={shareY(0.5) + 3.5 * u} text-anchor="end">50%</text>
					<text class="num" x={BL - 5} y={BASE + 3.5 * u} text-anchor="end">0</text>
					{#if atRest}
						<text class="label" x={(BL + BR) / 2} y={(BTOP + BASE) / 2} text-anchor="middle"
							>Every mass is at rest: there is no shape.</text
						>
					{/if}
					{#each bars as b (b.key)}
						{#if b.h > 0.05}
							<rect
								class={['share', { zero: b.zero }]}
								x={b.x}
								y={b.y}
								width={Math.max(0.5, b.w)}
								height={b.h}
							/>
						{/if}
					{/each}
					<line class="axis" x1={BL} x2={BR} y1={BASE} y2={BASE} />
					{#each NOTES as n, g (g)}
						<line
							class="slot"
							x1={BL + n.first * slot}
							x2={BL + n.first * slot}
							y1={BASE}
							y2={BASE + 3}
						/>
					{/each}
					{#if picked !== undefined}
						<rect
							class="marker"
							x={BL + picked * slot + 0.6}
							y={BASE + 1.5 * u}
							width={slot - 1.2}
							height={2.5 * u}
						/>
					{/if}
					<text class="num" x={BL + 1} y={BASE + 22 * u}>0</text>
					{#each LABELLED as g (g)}
						<text
							class="num"
							x={g === NOTES.length - 1 ? BR : centreOf(g)}
							y={BASE + 22 * u}
							text-anchor={g === NOTES.length - 1 ? 'end' : 'middle'}>{f3(NOTES[g].omega)}</text
						>
					{/each}
					<text class="label" x={BR} y={BASE + 37 * u} text-anchor="end"
						>the 38 modes, in order of frequency</text
					>

					<!-- where the quotient lies among the notes -->
					<text class="label strong" x={BL} y={G_LINE - 28 * u}
						>Where the quotient lies among the notes</text
					>
					<line class="axis" x1={BL} x2={BR} y1={G_LINE} y2={G_LINE} />
					{#each ringingNotes as n (n.first)}
						<line
							class={['note-tick', { lowest: n.first === FIRST_RINGING }]}
							x1={gx(n.omega)}
							x2={gx(n.omega)}
							y1={G_LINE - (n.first === FIRST_RINGING ? 7 : 4) * u}
							y2={G_LINE + (n.first === FIRST_RINGING ? 7 : 4) * u}
						/>
					{/each}
					<text class="num" x={gx(LOWEST) - 4} y={G_LINE - 9 * u} text-anchor="end"
						>lowest note {f3(LOWEST)}</text
					>
					{#each [0, 1, 2] as w (w)}
						<text class="num faint" x={gx(w)} y={G_LINE + 17 * u} text-anchor="middle">{w}</text>
					{/each}
					<text class="num faint" x={BR} y={G_LINE + 17 * u} text-anchor="end">ω</text>
					{#if quotient.omega !== undefined && quotientLabel}
						<circle class="quotient" cx={gx(quotient.omega)} cy={G_LINE} r={3.6 * u} />
						<text
							class="num strong"
							x={quotientLabel.x}
							y={G_LINE - 9 * u}
							text-anchor={quotientLabel.anchor}>quotient {f3(quotient.omega)}</text
						>
					{/if}
				</svg>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause the motion' : 'Play the motion'}
				aria-pressed={playing}
				onclick={togglePlay}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<button
				type="button"
				class="action"
				onclick={release}
				disabled={view.kind !== 'hold' || atRest}
			>
				<HugeiconsIcon icon={WaveIcon} size={16} strokeWidth={1.7} />
				Release
			</button>
			<button type="button" class="action" onclick={setSquash}>
				<HugeiconsIcon icon={ShrinkIcon} size={16} strokeWidth={1.7} />
				Squash
			</button>
			<button type="button" class="action" onclick={rest}>
				<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
				Rest
			</button>
			<p class="hint">
				Drag a mass, or reach it with Tab and move it with the arrow keys (Shift for larger steps,
				Home to put it back). The disc then holds your shape until you release it.
			</p>
		</div>
		<div class="modes">
			<p class="modes-title" id="{uid}-modes">
				Pick a mode: the three zero modes, then by frequency
			</p>
			<div class="chips" role="radiogroup" aria-labelledby="{uid}-modes">
				{#each MODES as m (m.index)}
					<button
						type="button"
						role="radio"
						class={{ zero: m.kind !== 'ring' }}
						aria-checked={picked === m.index}
						aria-label="Mode {m.index + 1}: {m.kind === 'ring'
							? `frequency ${f3(m.omega)}, `
							: ''}{modeWords(m.index)}"
						tabindex={(picked ?? lastMode) === m.index ? 0 : -1}
						onclick={() => pick(m.index)}
						onkeydown={chipKeys}
						{@attach keepChip(m.index)}>{chipText(m.index)}</button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The disc</dt>
				<dd>
					<span class="also">
						{#if view.kind === 'mode' && MODES[view.n].kind !== 'ring'}
							Mode {view.n + 1} of {COORDS} is {modeWords(view.n)}. It stretches no spring, so it
							stores no energy and does not ring: set moving, the disc would {MODES[view.n].kind ===
							'turn'
								? 'turn'
								: 'drift'} steadily. It is drawn held still.
						{:else if view.kind === 'mode'}
							The disc rings in mode {view.n + 1} of {COORDS}, at <Tex
								math={`\\omega_{${view.n + 1}} = ${f3(MODES[view.n].omega)}`}
							/>, {modeWords(view.n)}. Every mass swings in step at this one frequency.
						{:else if view.kind === 'swing'}
							The shape you released swings as the sum of its modes, each at its own frequency, so
							it never quite comes back to itself. Its zero-mode parts, released with no speed, stay
							where they were.
						{:else if atRest}
							Every mass is at rest. Drag a mass, or press <em>Squash</em>, to make a shape.
						{:else}
							The disc holds the shape you made. <em>Release</em> lets it swing.
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Rayleigh’s quotient</dt>
				<dd>
					{#if quotient.omega !== undefined}
						<Tex math={`${QUOTIENT} = ${f3(quotient.omega)}`} />
						<span class="also"
							>This is the quotient of {view.kind === 'mode' ? 'the mode' : 'the shape'}, with its
							zero-mode parts removed as the bound assumes, as a frequency.
							{#if quotient.omega / LOWEST - 1 < 5e-4}
								It equals the lowest note, because the shape is a mode of the lowest pair.
							{:else}
								{#if quotient.omega / LOWEST < 1.5}
									It lies {pc(quotient.omega / LOWEST - 1, 1)} above the lowest note.
								{:else}
									It is {(quotient.omega / LOWEST).toFixed(2)} times the lowest note.
								{/if}
							{/if}
						</span>
					{:else}
						<span class="also"
							>{atRest
								? 'There is no shape to measure.'
								: 'The shape lies wholly in the zero modes: once they are removed nothing is left, and the quotient has no value.'}</span
						>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The lowest note</dt>
				<dd>
					<Tex math={`\\omega_1 = ${f3(LOWEST)}`} /><span class="also"
						>This is the lowest frequency of the 35 modes that ring, shared by the two squashes of
						the lowest pair.</span
					>
				</dd>
			</div>
			{#if !atRest}
				<div class="row">
					<dt>The shares</dt>
					<dd>
						<span class="also"
							>The largest share, {pc(groups[biggest], groups[biggest] > 0.995 ? 0 : 1)}, lies in {noteName(
								biggest
							)}.
							{#if NOTES[biggest].zero}
								The quotient leaves this part out.
							{:else if quotient.zeroShare > 1e-6}
								The zero modes hold {pc(quotient.zeroShare, 1)} of the shape, which the quotient leaves
								out.
							{:else}
								The zero modes hold none of the shape.
							{/if}</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			The masses are equal, <Tex math={'\\htmlClass{q-matter}{m}'} trust />, and so are the springs,
			<Tex math="k" />; lengths are in spacings of the lattice and frequencies in units of <Tex
				math={UNIT}
				trust
			/>. A shape <Tex math="\mathbf q" /> has the amplitudes <Tex
				math={'a_n = \\mathbf e_n^{\\mathsf T}\\mathbf M^{1/2}\\mathbf q'}
			/> in the modes, the eigenvectors <Tex math="\mathbf e_n" /> of <Tex
				math={'D = \\mathbf M^{-1/2}\\mathbf K\\mathbf M^{-1/2}'}
			/>, found by Jacobi’s rotations. Modes of the same frequency share one bar, as wide as they
			are many: any mix of them is again a mode of that frequency, so only their total share is
			fixed. A mark under the axis shows the mode picked from the list. The motion follows <Tex
				math={'\\mathbf M\\ddot{\\mathbf q} = -\\mathbf K\\mathbf q'}
			/>, which holds for small displacements; they are drawn at the size you give them, and a mode
			at its largest moves a mass {SHOWN} spacings. The motion is shown at {PACE} units of <Tex
				math={'\\sqrt{\\htmlClass{q-matter}{m}/k}'}
				trust
			/> a second.
		</p>
	</div>
</div>

<style>
	.normal-modes {
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
	.play:focus-visible,
	.action:focus-visible,
	.chips button:focus-visible {
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
		padding: 0.7rem 0.9rem 0.8rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.pair {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1.2rem;
		align-items: start;
	}

	.panel {
		min-width: 0;
	}

	.panel p {
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

	svg.dragging {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.spring {
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.mass {
		cursor: grab;
		touch-action: none;
		outline: none;
	}

	.dot {
		fill: color-mix(in srgb, var(--q-matter) 78%, var(--bg));
		stroke: var(--q-matter);
		stroke-width: calc(1px * var(--u, 1));
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
		opacity: 0;
	}

	.mass:focus-visible .focus {
		opacity: 1;
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
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.stretched {
		border-color: var(--accent);
	}

	.squeezed {
		border-color: var(--accent-2);
	}

	.dot-key {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--q-matter) 78%, var(--bg));
		border: 1px solid var(--q-matter);
	}

	.rest-key {
		display: inline-block;
		width: 0.3rem;
		height: 0.3rem;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the shares ---------------------------------------------------------------------------- */

	.shares .title {
		margin-bottom: 0.5rem;
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.slot {
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.share {
		fill: color-mix(in srgb, var(--accent) 60%, transparent);
		stroke: var(--accent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.share.zero {
		fill: color-mix(in srgb, var(--text) 25%, transparent);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.marker {
		fill: var(--text);
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.num.faint {
		fill: var(--text-faint);
	}

	.label {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.label.strong {
		font-weight: 500;
	}

	.num.strong {
		fill: var(--text);
		font-weight: 500;
	}

	.note-tick {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.note-tick.lowest {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.quotient {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.8rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.play,
	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play {
		width: 2.2rem;
		padding: 0;
	}

	.action {
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.action:disabled {
		cursor: default;
		color: var(--text-faint);
		border-color: var(--line);
	}

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	.action:disabled :global(svg) {
		color: var(--text-faint);
	}

	@media (hover: hover) {
		.play:hover,
		.action:not(:disabled):hover {
			border-color: var(--accent);
		}

		.chips button[aria-checked='false']:hover {
			color: var(--text);
			border-color: var(--line-strong);
		}
	}

	.hint {
		margin: 0 0 0 0.3rem;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.modes-title {
		margin: 0 0 0.4rem;
		font: 500 0.78rem/1.3 var(--font-sans);
		color: var(--text-dim);
	}

	.chips {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(3.3rem, 1fr));
		gap: 4px;
	}

	.chips button {
		min-width: 0;
		min-height: 1.9rem;
		padding: 0.2rem 0.3rem;
		border: 1px solid var(--line);
		border-radius: 7px;
		background: color-mix(in srgb, var(--text) 4%, transparent);
		color: var(--text-dim);
		font: 500 0.74rem/1.1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.chips button.zero {
		font-style: italic;
	}

	.chips button[aria-checked='true'] {
		background: var(--bg);
		color: var(--text);
		border-color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--accent);
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
		align-items: center;
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	/* words keep their own spacing: the tabular figures would widen a hyphen */
	.also {
		color: var(--text-dim);
		font-variant-numeric: normal;
	}

	.readouts .note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.6rem 0.7rem;
		}

		.pair {
			grid-template-columns: minmax(0, 1fr);
			gap: 1rem;
		}

		.time {
			flex-wrap: wrap;
		}

		.hint {
			flex: 1 1 100%;
			margin: 0;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.chips {
			grid-template-columns: repeat(auto-fill, minmax(3.05rem, 1fr));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.action,
		.chips button {
			transition: none;
		}
	}
</style>
