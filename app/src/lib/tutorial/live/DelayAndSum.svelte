<script lang="ts">
	/**
	 * Chapter 5.3's delay and sum: a row of N pixels b apart, with the straight crests of a plane wave arriving from
	 * the angle θ, dragged on a semicircle above the row. Beside the row, the pixels' records, the same records
	 * delayed for a steered angle θ′ (the second handle, in the accent), and their sum. Below, the image I(θ′)/max
	 * against θ′, the chapter's eq:das: |𝒜|² = sin²(Nψ/2)/sin²(ψ/2), ψ = kb(sin θ − sin θ′), with its main lobe and
	 * any grating lobes. A second equal source can be added, in step or out of step; out of step its phase is redrawn
	 * every frame and the image is the running average over the last 50. Everything is exact, from ./delay-and-sum.ts.
	 * Two predictions at the top are answered once the reader has done what they ask. Under reduced motion the wave
	 * waits for the play button.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AddCircleIcon,
		ArrowLeftRightIcon,
		GridIcon,
		Link01Icon,
		PauseIcon,
		PlayIcon,
		ShuffleIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		COUNT,
		DIP_RULE,
		FRAMES,
		OPENING,
		PAIR,
		SPACING,
		SPREAD,
		amplitude,
		aperture,
		delayed,
		dip,
		generator,
		gratingLobes,
		mainLobe,
		meanCos,
		pairAnswer,
		pairImage,
		placeAt,
		positions,
		record,
		safeSpacing,
		separation,
		spreadAnswer,
		summed,
		type Wave
	} from './delay-and-sum';

	const uid = $props.id();

	const DEG = Math.PI / 180;
	/** Cycles of the wave in one second on the screen. */
	const RATE = 0.5;
	/** Each record shows this many cycles, the newest at the right. */
	const CYCLES = 3;
	/** Points along each record. */
	const TRACE = 44;
	/** The second prediction counts a pair as 1.2 λ/D apart within this much. */
	const NEAR_PAIR = 0.03;

	const round = (v: number, s: number) => Math.round(Math.round(v / s) * s * 1e9) / 1e9;
	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	const angle = (v: number) => clamp(v, -90, 90);

	// --- the settings ----------------------------------------------------------------------------------------------
	let N = $state(OPENING.N);
	let b = $state(OPENING.b);
	/** The source's angle θ and the steered angle θ′, degrees from the normal to the row; positive to the right. */
	let theta = $state(OPENING.theta);
	let steer = $state(OPENING.steer);
	/** The second source. */
	let two = $state(false);
	let theta2 = $state(secondAt(OPENING.N, OPENING.b, OPENING.theta));
	let mode = $state<'in' | 'out'>('in');
	/** The wave's phase ωt, radians. */
	let wt = $state(0);
	/** The second source's last phases out of step, the newest last. */
	let phases = $state.raw<number[]>([]);
	const rand = generator(5303);
	const draw = () => 2 * Math.PI * rand();

	/** Where a second source first stands: 2.5 λ/D from the first, on whichever side has room. */
	function secondAt(n: number, bb: number, t: number) {
		const at = placeAt(n, bb, t, 2.5) ?? placeAt(n, bb, t, -2.5) ?? t - 10;
		return round(angle(at), 0.1);
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let spread = $state<ReturnType<typeof spreadAnswer> | undefined>();
	let pair = $state<ReturnType<typeof pairAnswer> | undefined>();
	/** The ways the pair has been seen since it last stood 1.2 λ/D apart. */
	let seen: ('in' | 'out')[] = [];
	const revealed = $derived(step === 1 ? spread !== undefined : pair !== undefined);

	function note() {
		if (!spread && N === OPENING.N && Math.abs(b - SPREAD) < 1e-9) spread = spreadAnswer(N, theta);
		const atPair = two && Math.abs(separation(N, b, theta, theta2) - PAIR) <= NEAR_PAIR;
		if (!atPair) {
			seen = [];
			return;
		}
		if (!seen.includes(mode)) seen = [...seen, mode];
		if (!pair && seen.length === 2) pair = pairAnswer(N, b, theta, theta2);
	}

	function setN(v: number) {
		N = round(clamp(v, COUNT.min, COUNT.max), COUNT.step);
		note();
	}

	function setB(v: number) {
		b = round(clamp(v, SPACING.min, SPACING.max), SPACING.step);
		note();
	}

	function setTwo(on: boolean) {
		if (on && !two) theta2 = secondAt(N, b, theta);
		two = on;
		if (on && mode === 'out' && phases.length < FRAMES)
			phases = Array.from({ length: FRAMES }, draw);
		note();
	}

	function setMode(m: 'in' | 'out') {
		mode = m;
		if (m === 'out' && phases.length < FRAMES) phases = Array.from({ length: FRAMES }, draw);
		note();
	}

	type Handle = 'source' | 'steer' | 'second';

	function setAngle(which: Handle, v: number) {
		const next = angle(v);
		if (which === 'source') theta = next;
		else if (which === 'steer') steer = next;
		else theta2 = next;
		note();
	}

	// --- the time ---------------------------------------------------------------------------------------------------
	let playing = $state(true);

	function togglePlay() {
		playing = !playing;
	}

	let checked = false;
	const clock: Attachment = () => {
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!playing) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			wt = (wt + 2 * Math.PI * RATE * dt) % (2 * Math.PI);
			// out of step, a new random phase every frame, and the oldest of the fifty dropped
			if (two && mode === 'out') phases = [...phases.slice(1 - FRAMES), draw()];
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the waves --------------------------------------------------------------------------------------------------
	const s1 = $derived(Math.sin(theta * DEG));
	const s2 = $derived(Math.sin(theta2 * DEG));
	const sSteer = $derived(Math.sin(steer * DEG));
	/** The second source's phase now: 0 in step, the newest random phase out of step. */
	const phi = $derived(mode === 'in' ? 0 : (phases[phases.length - 1] ?? 0));
	/** The mean of cos φ over the frames the image averages: 1 in step. */
	const c = $derived(mode === 'in' ? 1 : meanCos(phases));
	const waves = $derived<Wave[]>(
		two
			? [
					{ sin: s1, phase: 0 },
					{ sin: s2, phase: phi }
				]
			: [{ sin: s1, phase: 0 }]
	);
	const D = $derived(aperture(N, b));
	const xs = $derived(positions(N, b));

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };

	const layout = $derived.by(() => {
		const narrow = phone.current;
		const W = narrow ? 360 : 640;
		if (narrow) {
			const scene: Box = { x: 0, y: 22, w: W, h: 206 };
			const traces: Box = { x: 0, y: scene.y + scene.h + 28, w: W, h: 196 };
			const image: Box = { x: 0, y: traces.y + traces.h + 28, w: W, h: 160 };
			return {
				W,
				H: image.y + image.h + 34,
				panels: [scene, traces, image],
				circle: { cx: W / 2, cy: scene.y + scene.h - 40, R: 138 },
				sceneBox: scene,
				colA: { x: 12, w: 156 },
				colB: { x: 192, w: 156 },
				stack: { y: traces.y + 28, h: traces.h - 90 },
				sum: { y: traces.y + traces.h - 52, h: 42 },
				tracesTop: traces.y,
				image,
				inner: { x: 34, w: W - 34 - 12 }
			};
		}
		const upper: Box = { x: 0, y: 22, w: W, h: 214 };
		const image: Box = { x: 0, y: upper.y + upper.h + 30, w: W, h: 184 };
		return {
			W,
			H: image.y + image.h + 34,
			panels: [upper, image],
			circle: { cx: 152, cy: upper.y + upper.h - 40, R: 138 },
			sceneBox: { x: 0, y: upper.y, w: 304, h: upper.h },
			colA: { x: 328, w: 134 },
			colB: { x: 488, w: 140 },
			stack: { y: upper.y + 28, h: upper.h - 90 },
			sum: { y: upper.y + upper.h - 52, h: 42 },
			tracesTop: upper.y,
			image,
			inner: { x: 34, w: W - 34 - 12 }
		};
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (v: number) => v.toFixed(2);

	// --- the scene: the semicircle, the row and the crests -----------------------------------------------------------
	const rowHalf = $derived(0.8 * layout.circle.R);
	/** Drawing units per wavelength: the row's width D fills 0.8 of the semicircle's diameter. */
	const scale = $derived((2 * rowHalf) / D);
	const onArc = (t: number) => ({
		x: layout.circle.cx + layout.circle.R * Math.sin(t * DEG),
		y: layout.circle.cy - layout.circle.R * Math.cos(t * DEG)
	});
	const outward = (t: number, r: number) => ({
		x: layout.circle.cx + r * Math.sin(t * DEG),
		y: layout.circle.cy - r * Math.cos(t * DEG)
	});

	/** At most one crest every this many drawing units: denser crests are thinned to every k-th. */
	const CREST_ROOM = 6;
	const ORDINALS: Record<number, string> = { 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth' };
	const crestEvery = $derived(Math.max(1, Math.ceil(CREST_ROOM / scale)));

	/** The crests of a wave from t (degrees) with the phase φ: the lines n̂·x = j − (ωt + φ)/2π, in wavelengths. */
	function crests(t: number, phase: number) {
		const { cx, cy, R } = layout.circle;
		const rho = R / scale;
		const off = (wt + phase) / (2 * Math.PI);
		const sn = Math.sin(t * DEG);
		const cs = Math.cos(t * DEG);
		const k = crestEvery;
		let d = '';
		const first = Math.ceil((-rho + off) / k) * k;
		for (let j = first; j - off <= rho; j += k) {
			const at = j - off;
			const px = cx + at * sn * scale;
			const py = cy - at * cs * scale;
			d += `M${f2(px - R * cs)},${f2(py - R * sn)}L${f2(px + R * cs)},${f2(py + R * sn)}`;
		}
		return d;
	}

	const crestPaths = $derived({
		one: crests(theta, 0),
		two: two ? crests(theta2, phi) : ''
	});

	const halfDisc = $derived.by(() => {
		const { cx, cy, R } = layout.circle;
		return `M${cx - R},${cy}A${R},${R} 0 0 1 ${cx + R},${cy}Z`;
	});

	/** Where the handles' names stand: the sources' outside the semicircle, the steering's inside it. */
	const names = $derived({
		source: outward(theta, layout.circle.R + 14 * u),
		second: outward(theta2, layout.circle.R + 14 * u),
		steer: outward(steer, layout.circle.R - 17 * u)
	});

	const pixelSize = $derived(clamp(0.6 * b * scale, 2.5, 7));
	const lambdaBar = $derived(scale <= 0.6 * layout.circle.R ? scale : undefined);
	const arcTicks = [-90, -60, -30, 0, 30, 60, 90];

	// --- the records --------------------------------------------------------------------------------------------------
	function traces(col: { x: number; w: number }, get: (x: number, tau: number) => number) {
		const { y, h } = layout.stack;
		const row = h / N;
		const amp = (0.42 * row) / waves.length;
		let d = '';
		for (let p = 0; p < N; p++) {
			const mid = y + (p + 0.5) * row;
			for (let j = 0; j <= TRACE; j++) {
				const tau = -CYCLES + (CYCLES * j) / TRACE;
				d += `${j ? 'L' : 'M'}${f2(col.x + (col.w * j) / TRACE)},${f2(mid - amp * get(xs[p], tau))}`;
			}
		}
		return d;
	}

	const tracePaths = $derived.by(() => {
		const { y, h } = layout.sum;
		const amp = 0.45 * h;
		const col = layout.colB;
		let sum = '';
		for (let j = 0; j <= TRACE * 2; j++) {
			const tau = -CYCLES + (CYCLES * j) / (TRACE * 2);
			const v = summed(N, b, waves, sSteer, wt, tau) / (N * waves.length);
			sum += `${j ? 'L' : 'M'}${f2(col.x + (col.w * j) / (TRACE * 2))},${f2(y + h / 2 - amp * v)}`;
		}
		return {
			recorded: traces(layout.colA, (x, tau) => record(x, waves, wt, tau)),
			delayed: traces(layout.colB, (x, tau) => delayed(x, waves, sSteer, wt, tau)),
			sum
		};
	});

	/** The sum's amplitude over N: |Σ a_j e^{iφ_j}|. */
	const sumSize = $derived.by(() => {
		let re = 0;
		let im = 0;
		for (const w of waves) {
			const a = amplitude(N, b, Math.asin(w.sin) / DEG, steer);
			re += a * Math.cos(w.phase);
			im += a * Math.sin(w.phase);
		}
		return Math.hypot(re, im);
	});

	// --- the image ----------------------------------------------------------------------------------------------------
	const X = (t: number) => layout.inner.x + ((t + 90) / 180) * layout.inner.w;
	const Y = (v: number) =>
		layout.image.y + layout.image.h - 6 - clamp(v, 0, 1.02) * (layout.image.h - 26);

	const lobe = $derived(mainLobe(N, b, theta));
	const lobes = $derived(gratingLobes(b, theta));
	const dipNow = $derived(two ? dip(N, b, theta, theta2, c) : undefined);
	const dipExact = $derived(two && mode === 'out' ? dip(N, b, theta, theta2, 0) : undefined);
	const sep = $derived(separation(N, b, theta, theta2));
	const midAngle = $derived(Math.asin(clamp((s1 + s2) / 2, -1, 1)) / DEG);

	/** The angles sampled: finely enough for twelve points between zeros, and every peak exactly. */
	const samples = $derived.by(() => {
		const n = clamp(Math.ceil(40 * D), 720, 4000);
		const out: number[] = [];
		for (let j = 0; j <= n; j++) out.push(-90 + (180 * j) / n);
		out.push(theta, ...lobes.map((l) => l.angle));
		if (two) out.push(theta2, midAngle, ...gratingLobes(b, theta2).map((l) => l.angle));
		return out.filter((t) => t >= -90 && t <= 90).sort((a, z) => a - z);
	});

	const image = $derived.by(() => {
		const f = (t: number) =>
			two ? pairImage(N, b, theta, theta2, t, c) : amplitude(N, b, theta, t) ** 2;
		const values = samples.map(f);
		const top = Math.max(...values);
		const line = (vs: number[]) =>
			vs.map((v, j) => `${j ? 'L' : 'M'}${f2(X(samples[j]))},${f2(Y(v / top))}`).join('');
		return {
			top,
			main: line(values),
			singles: two
				? [
						line(samples.map((t) => amplitude(N, b, theta, t) ** 2)),
						line(samples.map((t) => amplitude(N, b, theta2, t) ** 2))
					]
				: [],
			average:
				two && mode === 'out' ? line(samples.map((t) => pairImage(N, b, theta, theta2, t, 0))) : '',
			at: f(steer) / top,
			mid: two ? f(midAngle) / top : 0
		};
	});

	const angleTicks = [-90, -60, -30, 0, 30, 60, 90];
	const valueTicks = $derived(two ? [0, 0.5, DIP_RULE, 1] : [0, 0.5, 1]);

	// --- the handles ------------------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<Handle | 'image' | undefined>();
	/** A drag of the steering lands on the source, the second source or a copy within this many CSS pixels. */
	const SNAP = 6;

	function point(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function snapSteer(t: number, perDegree: number) {
		const targets = [theta, ...lobes.map((l) => l.angle), ...(two ? [theta2] : [])];
		for (const target of targets) if (Math.abs(t - target) * perDegree < SNAP * u) return target;
		return round(t, 1);
	}

	function dragTo(e: PointerEvent) {
		const p = point(e);
		if (!p || !dragging) return;
		if (dragging === 'image') {
			const t = angle(((p.x - layout.inner.x) / layout.inner.w) * 180 - 90);
			setAngle('steer', snapSteer(t, layout.inner.w / 180));
			return;
		}
		const { cx, cy, R } = layout.circle;
		const t = angle(Math.atan2(p.x - cx, Math.max(0, cy - p.y)) / DEG);
		if (dragging === 'steer') setAngle('steer', snapSteer(t, R * DEG));
		else if (dragging === 'source') setAngle('source', round(t, 1));
		else {
			// the second source moves in steps of 0.05 λ/D of separation, so that 1.2 λ/D can be reached by hand
			const q = round(separation(N, b, theta, t), 0.05);
			setAngle('second', placeAt(N, b, theta, q) ?? round(t, 1));
		}
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) dragTo(pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, which: Handle) {
		if (e.button !== 0) return;
		// a drag is not a click: the handle does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = which;
	}

	/** A press on the image, with a mouse or a pen, steers the array there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		const p = point(e);
		const box = layout.image;
		if (!p || p.y < box.y || p.y > box.y + box.h) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = 'image';
		dragTo(e);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, which: Handle) {
		const s = e.shiftKey ? 0.1 : 1;
		const d = { ArrowLeft: -s, ArrowDown: -s, ArrowRight: s, ArrowUp: s }[e.key];
		if (d === undefined) return;
		e.preventDefault();
		const now = which === 'source' ? theta : which === 'steer' ? steer : theta2;
		setAngle(which, round(now + d, s));
	}

	// --- the numbers ----------------------------------------------------------------------------------------------
	const deg = (v: number) => `${v < -0.05 ? '−' : ''}${Math.abs(v).toFixed(1)}°`;
	const texDeg = (v: number) => `${v < -0.05 ? '-' : ''}${Math.abs(v).toFixed(1)}^\\circ`;
	const two2 = (v: number) => v.toFixed(2);
	const words = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
	const list = (items: string[]) =>
		items.length < 2
			? (items[0] ?? '')
			: `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

	const lobesTex = $derived(
		lobes.map((l) => `m = ${l.m < 0 ? '-' : ''}${Math.abs(l.m)}:\\ ${texDeg(l.angle)}`)
	);
	const dipWords = $derived.by(() => {
		if (!dipNow) return '';
		if (Math.abs(sep) < 0.05) return 'the two sources stand together';
		if (dipNow.onePeak) return 'no dip: the image has one peak, at the midpoint';
		const verdict = dipNow.ratio < DIP_RULE ? 'separated' : 'not separated';
		return `the midpoint falls to ${two2(dipNow.ratio)} of the peaks: ${verdict}, by the chapter’s dip of a fifth`;
	});

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`A row of ${N} pixels ${two2(b)} wavelengths apart, ${two2(D)} wavelengths wide, with a plane wave from ${deg(theta)}` +
			(two
				? ` and a second ${mode === 'in' ? 'in step' : 'out of step'} from ${deg(theta2)}`
				: '') +
			`. Beside it the records, the records delayed for the steered angle ${deg(steer)}, and their sum. ` +
			`Below, the image against the steered angle: a main lobe ${deg(lobe.width)} wide at half height` +
			(lobes.length
				? `, and copies at ${list(lobes.map((l) => deg(l.angle)))}.`
				: ', and no grating lobes.')
	);
	const handleLabel = (which: Handle) =>
		which === 'source'
			? `The source, at θ = ${deg(theta)}. Drag it along the semicircle, or move it 1 degree with the arrow keys, a tenth with Shift.`
			: which === 'steer'
				? `The steering, θ′ = ${deg(steer)}; the image there is ${two2(image.at)} of its largest. Drag it, or move it 1 degree with the arrow keys, a tenth with Shift.`
				: `The second source, at ${deg(theta2)}, ${two2(sep)} λ/D from the first. Drag it, or move it 1 degree with the arrow keys, a tenth with Shift.`;
</script>

{#snippet handle(which: Handle, t: number)}
	{@const at = onArc(t)}
	<g
		class={['handle', which]}
		transform="translate({f2(at.x)} {f2(at.y)})"
		role="slider"
		tabindex="0"
		aria-roledescription="movable handle"
		aria-label={handleLabel(which)}
		aria-valuemin={-90}
		aria-valuemax={90}
		aria-valuenow={t}
		aria-valuetext={deg(t)}
		onpointerdown={(e) => grab(e, which)}
		onkeydown={(e) => key(e, which)}
	>
		<circle class="hit" r={15 * u} />
		<!-- the steering is the smaller, so that on the source both show, one inside the other -->
		<circle class="focus" r={(which === 'steer' ? 8 : 11) * u} />
		<circle class="ring" r={(which === 'steer' ? 4.2 : 7.5) * u} />
		{#if which !== 'steer'}
			<circle class="pin" r={2 * u} />
		{/if}
	</g>
{/snippet}

<div class="delay-and-sum">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Spread the pixels to two wavelengths apart, keeping their number. What appears in the
				pattern?
			{:else}
				Put two sources <Tex math="1.2\lambda/D" /> apart. Are they separate when they are in step? When
				they are not?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && spread}
				<strong
					>{words[spread.lobes.length] ?? spread.lobes.length} copies of the source, of full height: grating
					lobes.</strong
				>
				They lie wherever <Tex math="\sin\theta'" /> differs from
				<Tex math={`\\sin ${texDeg(spread.theta)} = ${spread.sin.toFixed(3)}`} />
				by a multiple of <Tex math={`\\lambda/b = ${spread.step}`} />: at {list(
					spread.lobes.map((l) => deg(l.angle))
				)}. At one frequency those directions give the same records at every pixel, so no sum can
				tell them from the source. The main lobe narrows from {deg(spread.before)} to {deg(
					spread.after
				)}, because the row is {(
					words[spread.widths[1] / spread.widths[0]] ?? String(spread.widths[1] / spread.widths[0])
				).toLowerCase()} times as wide,
				<Tex math={`D = ${spread.widths[1]}\\lambda`} /> against <Tex
					math={`${spread.widths[0]}\\lambda`}
				/>.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2 && pair}
				<strong
					>Out of step, {pair.out.ratio < DIP_RULE ? 'yes' : 'no'}; in step, {pair.inStep.onePeak ||
					pair.inStep.ratio >= DIP_RULE
						? 'no'
						: 'yes'}.</strong
				>
				Out of step the two images add as intensities, <Tex math="a_1^2 + a_2^2" />, and the average
				over every phase dips at the midpoint to {two2(pair.out.ratio)} of the peaks, below the chapter’s
				0.8; the running average of {FRAMES} frames wanders about it. In step the amplitudes add before
				they are squared, <Tex math="(a_1 + a_2)^2" />, and the cross term <Tex math="2a_1a_2" /> fills
				the gap:
				{#if pair.inStep.onePeak}
					the image has one peak, at the midpoint, {two2(pair.inStep.peak)} times the peak of either source
					alone.
				{:else}
					the midpoint falls only to {two2(pair.inStep.ratio)} of the peaks.
				{/if}
			{:else if step === 1}
				The answer appears when the sixteen pixels are two wavelengths apart.
			{:else}
				The answer appears when a second source stands <Tex math="1.2\lambda/D" /> from the first and
				you have seen the pair both in step and out of step.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-disc">
					<path d={halfDisc} />
				</clipPath>
				<clipPath id="{uid}-image">
					<rect
						x={layout.image.x + 1}
						y={layout.image.y + 1}
						width={layout.image.w - 2}
						height={layout.image.h - 2}
						rx="7"
					/>
				</clipPath>
			</defs>

			{#each layout.panels as box (box.y)}
				<rect
					class="panel"
					x={box.x + 0.5}
					y={box.y + 0.5}
					width={box.w - 1}
					height={box.h - 1}
					rx="8"
				/>
			{/each}

			<!-- the wave and the row -->
			<text class="title" x="4" y={layout.sceneBox.y - 8 * u}
				>The wave and the row{phone.current ? '' : ', and the records'}</text
			>
			<text class="title end" x={layout.W - 4} y={layout.sceneBox.y - 8 * u}
				><tspan class="it">N</tspan> = {N}, <tspan class="it">b</tspan> = {two2(b)}<tspan class="it"
					>λ</tspan
				></text
			>
			<path class="arc" d={halfDisc} />
			{#each arcTicks as t (t)}
				{@const a = outward(t, layout.circle.R)}
				{@const z = outward(t, layout.circle.R - 5 * u)}
				<line class="arc-tick" x1={a.x} y1={a.y} x2={z.x} y2={z.y} />
			{/each}
			<g clip-path="url(#{uid}-disc)">
				<path class="crest" d={crestPaths.one} />
				{#if two}
					<path class="crest second" d={crestPaths.two} />
				{/if}
			</g>
			{#if crestEvery > 1}
				<text
					class="small dim"
					x={layout.circle.cx - layout.circle.R}
					y={layout.sceneBox.y + 14 * u}
					>every {ORDINALS[crestEvery] ?? `${crestEvery}th`} crest drawn</text
				>
			{/if}
			<!-- the rays to the source and to the steering -->
			<line
				class="ray"
				x1={layout.circle.cx}
				y1={layout.circle.cy}
				x2={onArc(theta).x}
				y2={onArc(theta).y}
			/>
			{#if two}
				<line
					class="ray"
					x1={layout.circle.cx}
					y1={layout.circle.cy}
					x2={onArc(theta2).x}
					y2={onArc(theta2).y}
				/>
			{/if}
			<line
				class="ray steer"
				x1={layout.circle.cx}
				y1={layout.circle.cy}
				x2={onArc(steer).x}
				y2={onArc(steer).y}
			/>
			<line
				class="normal"
				x1={layout.circle.cx}
				y1={layout.circle.cy}
				x2={layout.circle.cx}
				y2={layout.circle.cy - layout.circle.R}
			/>
			<!-- the pixels -->
			{#each xs as x, p (p)}
				<rect
					class="pixel"
					x={layout.circle.cx + x * scale - pixelSize / 2}
					y={layout.circle.cy - pixelSize / 2}
					width={pixelSize}
					height={pixelSize}
				/>
			{/each}
			<path
				class="bracket"
				d="M{f2(layout.circle.cx - rowHalf)},{f2(layout.circle.cy + 9 * u)}v{f2(4 * u)}H{f2(
					layout.circle.cx + rowHalf
				)}v{f2(-4 * u)}"
			/>
			<text class="small mid" x={layout.circle.cx} y={layout.circle.cy + 26 * u}
				><tspan class="it">D</tspan> = <tspan class="it">Nb</tspan> = {two2(D)}<tspan class="it"
					>λ</tspan
				></text
			>
			{#if lambdaBar !== undefined}
				<path
					class="bracket"
					d="M{f2(layout.circle.cx - layout.circle.R)},{f2(layout.circle.cy + 18 * u)}v{f2(
						4 * u
					)}h{f2(lambdaBar)}v{f2(-4 * u)}"
				/>
				<text
					class="small"
					x={layout.circle.cx - layout.circle.R + lambdaBar + 4 * u}
					y={layout.circle.cy + 26 * u}><tspan class="it">λ</tspan></text
				>
			{/if}
			<!-- the handles' names: the source's outside the semicircle, the steering's inside it -->
			<text class="name halo-raised" x={names.source.x} y={names.source.y}
				><tspan class="it">θ</tspan></text
			>
			{#if two}
				<text class="name halo-raised" x={names.second.x} y={names.second.y}>2</text>
			{/if}
			<text class="name steer-name halo-raised" x={names.steer.x} y={names.steer.y}
				><tspan class="it">θ′</tspan></text
			>
			{@render handle('source', theta)}
			{#if two}
				{@render handle('second', theta2)}
			{/if}
			{@render handle('steer', steer)}

			<!-- the records, delayed and summed -->
			{#if phone.current}
				<text class="title" x="4" y={layout.tracesTop - 8 * u}>The records, delayed and summed</text
				>
			{/if}
			<text class="small" x={layout.colA.x} y={layout.tracesTop + 17 * u}
				>records <tspan class="it">u</tspan><tspan class="sub">p</tspan>(<tspan class="it">t</tspan
				>)</text
			>
			<text class="small" x={layout.colB.x} y={layout.tracesTop + 17 * u}
				>delayed for <tspan class="it">θ′</tspan></text
			>
			<path class="trace" d={tracePaths.recorded} />
			<path class="trace" d={tracePaths.delayed} />
			<line
				class="now"
				x1={layout.colB.x}
				x2={layout.colB.x + layout.colB.w}
				y1={layout.sum.y + layout.sum.h / 2}
				y2={layout.sum.y + layout.sum.h / 2}
			/>
			<path class="ink sum" d={tracePaths.sum} />
			<text
				class="small end"
				x={layout.colA.x + layout.colA.w}
				y={layout.sum.y + layout.sum.h / 2 - 3 * u}
				>their sum, ÷ {two ? '2' : ''}<tspan class="it">N</tspan></text
			>
			<text
				class="small dim end"
				x={layout.colA.x + layout.colA.w}
				y={layout.sum.y + layout.sum.h / 2 + 11 * u}
				>amplitude {two2(sumSize)}<tspan class="it">N</tspan></text
			>

			<!-- the image -->
			<text class="title" x="4" y={layout.image.y - 8 * u}
				>The image <tspan class="it">I</tspan>(<tspan class="it">θ′</tspan>)/max</text
			>
			<text class="title end" x={layout.W - 4} y={layout.image.y - 8 * u}
				>{two && mode === 'out'
					? phone.current
						? `averaged over ${FRAMES} frames`
						: `the average of the last ${FRAMES} frames`
					: two
						? 'two sources in step'
						: 'one source'}</text
			>
			<g clip-path="url(#{uid}-image)">
				{#each valueTicks as v (v)}
					<line
						class={['grid', { axis: v === 0, rule: v === DIP_RULE }]}
						x1={layout.inner.x}
						x2={layout.inner.x + layout.inner.w}
						y1={Y(v)}
						y2={Y(v)}
					/>
				{/each}
				{#each angleTicks as t (t)}
					<line
						class="grid"
						x1={X(t)}
						x2={X(t)}
						y1={layout.image.y}
						y2={layout.image.y + layout.image.h}
					/>
				{/each}
				{#each image.singles as d, j (j)}
					<path class="single" {d} />
				{/each}
				{#if image.average}
					<path class="average" d={image.average} />
				{/if}
				<path class="ink" d={image.main} />
				{#if two && dipNow && !dipNow.onePeak && Math.abs(sep) >= 0.05}
					<line
						class="dip"
						x1={X(midAngle) - 9 * u}
						x2={X(midAngle) + 9 * u}
						y1={Y(image.mid)}
						y2={Y(image.mid)}
					/>
				{/if}
				<line
					class="steer-line"
					x1={X(steer)}
					x2={X(steer)}
					y1={layout.image.y}
					y2={layout.image.y + layout.image.h}
				/>
				<circle class="dot" cx={X(steer)} cy={Y(image.at)} r={3 * u} />
				{#each lobes as l (l.m)}
					<text class="small mid lobe halo" x={X(l.angle)} y={layout.image.y + 13 * u}
						><tspan class="it">m</tspan> = {l.m < 0 ? '−' : ''}{Math.abs(l.m)}</text
					>
				{/each}
			</g>
			{#each valueTicks as v (v)}
				<text class={['small y-tick', { dim: v === DIP_RULE }]} x={layout.inner.x - 5 * u} y={Y(v)}
					>{v}</text
				>
			{/each}
			<!-- the sources, as triangles on the axis -->
			{#each two ? [theta, theta2] : [theta] as t, j (j)}
				<path class="mark" d="M{f2(X(t))},{f2(Y(0) - 1)}l{f2(-4 * u)},{f2(7 * u)}h{f2(8 * u)}Z" />
			{/each}
			{#each angleTicks as t (t)}
				<text
					class={['small tick', { first: t === -90, last: t === 90 }]}
					x={X(t)}
					y={layout.image.y + layout.image.h + 18 * u}>{t < 0 ? '−' : ''}{Math.abs(t)}°</text
				>
			{/each}
			<text class="small axis-name" x="0" y={layout.image.y + layout.image.h + 18 * u}
				><tspan class="it">θ′</tspan></text
			>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch ink-key"></span>the image, and the sum of the records</li>
			<li><span class="swatch steer-key"></span>the steering <Tex math="\theta'" /></li>
			<li><span class="swatch crest-key"></span>the crests of the wave</li>
			{#if two}
				<li><span class="swatch single-key"></span>each source alone</li>
				{#if mode === 'out'}
					<li><span class="swatch average-key"></span>the average over every phase</li>
				{/if}
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause' : 'Play'}
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
			<p class="hint">
				Drag the handles on the semicircle: the ink one is the source <Tex math="\theta" />, the
				coloured one the steering <Tex math="\theta'" />. A press on the image steers there. After
				Tab, the arrow keys move a handle 1° (with Shift, 0.1°).
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-count"
				label="Number of pixels"
				icon={GridIcon}
				min={COUNT.min}
				max={COUNT.max}
				step={COUNT.step}
				bind:value={() => N, setN}
				readout="N = {N}"
				ends={['2', '32']}
				mark={{ at: OPENING.N, label: '16, where it opens' }}
			/>
			<Slider
				id="{uid}-spacing"
				label="Spacing"
				icon={ArrowLeftRightIcon}
				min={SPACING.min}
				max={SPACING.max}
				step={SPACING.step}
				bind:value={() => b, setB}
				readout="b = {two2(b)}λ"
				ends={['λ/4', '3λ']}
				mark={{ at: OPENING.b, label: 'λ/2' }}
			/>
		</div>
		<div class="choices">
			<div class="choice">
				<Toggle
					icon={AddCircleIcon}
					label="A second equal source"
					bind:checked={() => two, setTwo}
				/>
			</div>
			{#if two}
				<div class="choice">
					<Segmented
						label="The second source’s phase"
						options={[
							{ value: 'in', label: 'In step', icon: Link01Icon },
							{ value: 'out', label: 'Out of step', icon: ShuffleIcon }
						]}
						bind:value={() => mode, setMode}
					/>
				</div>
			{/if}
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The array</dt>
				<dd>
					<Tex math={`N = ${N}`} /><Tex math={`b = ${two2(b)}\\lambda`} /><Tex
						math={`D = Nb = ${two2(D)}\\lambda`}
					/><span class="also"
						>{safeSpacing(b)
							? 'b ≤ λ/2: no copy at any steering'
							: 'b > λ/2: copies can appear'}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Source and steering</dt>
				<dd>
					<Tex math={`\\theta = ${texDeg(theta)}`} /><Tex
						math={`\\theta' = ${texDeg(steer)}`}
					/><span class="also">the image there is {two2(image.at)} of its largest</span>
				</dd>
			</div>
			<div class="row">
				<dt>Main lobe</dt>
				<dd>
					<span>{deg(lobe.width)} wide at half height</span><span class="also"
						>{lobe.cut ? 'cut by the horizon' : `from ${deg(lobe.from)} to ${deg(lobe.to)}`}; its
						first zeros at
						<Tex math="\sin\theta - \sin\theta' = \pm\lambda/D" /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Grating lobes</dt>
				<dd aria-live="polite">
					{#if lobes.length}
						{#each lobesTex as t (t)}<Tex math={t} />{/each}<span class="also"
							>from <Tex math="\sin\theta - \sin\theta' = m\lambda/b" /></span
						>
					{:else}
						<span>none</span><span class="also"
							>only <Tex math="m = 0" /> fits <Tex
								math="\sin\theta - \sin\theta' = m\lambda/b"
							/></span
						>
					{/if}
				</dd>
			</div>
			{#if two && dipNow}
				<div class="row">
					<dt>Two sources</dt>
					<dd aria-live="polite">
						<Tex math={`\\Delta\\sin\\theta = ${two2(Math.abs(sep))}\\,\\lambda/D`} /><span
							class="also"
							>the second at {deg(theta2)}, {deg(Math.abs(theta2 - theta))} from the first</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The dip</dt>
					<dd aria-live="polite">
						<span>{dipWords}</span>
						{#if dipExact && Math.abs(sep) >= 0.05}
							<span class="also"
								>{dipExact.onePeak
									? 'the average over every phase has one peak'
									: `the average over every phase: ${two2(dipExact.ratio)}`}</span
							>
						{/if}
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			The pixels stand at <Tex math="x_p" /> along the row, and each record is <Tex
				math="u_p(t) = F(t + \hat n\cdot\mathbf x_p/c)"
			/> with <Tex math="F = \cos\omega t" />: the pixel nearer the source hears each crest earlier.
			Delaying it by <Tex math="\hat n'\cdot\mathbf x_p/c" /> and adding gives the chapter’s image
			<Tex math="I(\hat n')" />, in proportion to
			<Tex math="|\mathcal A|^2 = \sin^2(N\psi/2)/\sin^2(\psi/2)" /> with <Tex
				math="\psi = kb(\sin\theta - \sin\theta')"
			/>, drawn exactly. The phases are referred to the middle of the row, so that two sources in
			step have equal phases there; out of step, the second’s phase is redrawn every frame. Their
			separation is measured in <Tex math="\sin\theta" />, in which the pattern keeps its shape at
			every angle. The wave runs at {RATE} cycles a second; under reduced motion the figure opens paused.
		</p>
	</div>
</div>

<style>
	.delay-and-sum {
		/* the steering in the accent, as the chapter asks; the source, its crests and the image in the ink */
		--steer: var(--accent);
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
	.play:focus-visible {
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
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
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

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.mid {
		text-anchor: middle;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	/* a tick at either end of the axis keeps its words inside it */
	.tick.first {
		text-anchor: start;
	}

	.tick.last {
		text-anchor: end;
	}

	.axis-name {
		text-anchor: start;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 0.8em;
		baseline-shift: sub;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.halo-raised {
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the scene */

	.arc {
		fill: color-mix(in srgb, var(--text) 2%, transparent);
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.arc-tick {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.crest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 24%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.crest.second {
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.normal {
		stroke: color-mix(in srgb, var(--text) 20%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ray {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ray.steer {
		stroke: var(--steer);
		stroke-dasharray: none;
		opacity: 0.75;
	}

	.pixel {
		fill: var(--text);
	}

	.bracket {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.name {
		fill: var(--text);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		text-anchor: middle;
		dominant-baseline: middle;
	}

	.steer-name {
		fill: var(--steer);
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

	.ring {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
	}

	.pin {
		fill: var(--text);
	}

	.handle.steer .ring {
		fill: var(--steer);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.handle.second .ring {
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(1.5px * var(--u, 1));
	}

	/* the records */

	.trace {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.now {
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the image */

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.grid.rule {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ink {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ink.sum {
		stroke-width: calc(1.9px * var(--u, 1));
	}

	.single {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.average {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.dip {
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.steer-line {
		stroke: var(--steer);
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.8;
		pointer-events: none;
	}

	.dot {
		fill: var(--steer);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
		pointer-events: none;
	}

	.lobe {
		fill: var(--text-dim);
	}

	.mark {
		fill: var(--text);
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

	.ink-key {
		border-color: var(--text);
		border-top-width: 2px;
	}

	.steer-key {
		border-color: var(--steer);
	}

	.crest-key {
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--text) 35%, transparent);
	}

	.single-key {
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.average-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: var(--text-dim);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}

	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		min-height: 2.2rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders,
	.choices {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: stretch;
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

		.hint {
			flex: 1 1 100%;
		}

		.sliders,
		.choices {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play {
			transition: none;
		}
	}
</style>
