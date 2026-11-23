<script lang="ts">
	/**
	 * Chapter 1.8's flyby: a tonne passes the steel ball on a straight line at the distance b from its centre and the
	 * speed V. Seen from the side, the tonne moves along its path and each of thirteen parts of the ball gains velocity
	 * as its pulse of pull passes; the five of the row through the centre end with the same kick. Below, the sideways
	 * pull on one marked part against time, its area the part's kick 2Gμ/BV, beside the pull at the centre, which is the
	 * whole ball's. Seen along the path, the kicks after the pass, C(b − s)/|b − s|². Everything is exact in the impulse
	 * approximation (./flyby-kick.ts). The views keep their scale while the reader moves a slider or the part, so that
	 * the change is seen, and then fit again.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowExpand01Icon,
		ArrowUpRight01Icon,
		DashboardSpeed02Icon,
		PauseIcon,
		PlayIcon,
		RulerIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		BALL,
		FARTHEST,
		FASTEST,
		FROZEN,
		NEAREST,
		PAPER_PASS,
		PAPER_SPEED,
		PARTS,
		RADIUS as R,
		RINGING,
		SLOWEST,
		TONNE,
		ballEnergy,
		deflection,
		kick,
		kickAt,
		kickSoFar,
		passDuration,
		peak,
		pull,
		slowing,
		strength,
		tickStep,
		type Point
	} from './flyby-kick';

	const uid = $props.id();
	const MU = TONNE;

	// --- the settings ---------------------------------------------------------------------------------------------
	/** The distance of the pass from the ball's centre, m, and its speed, km s⁻¹ (the slider's unit). */
	let b = $state(PAPER_PASS);
	let speed = $state(PAPER_SPEED / 1e3);
	const V = $derived(speed * 1e3);
	/** The marked part, m about the centre: toward the path, and along it. */
	let part = $state<Point>([0.25, -0.25]);
	let mode = $state<'full' | 'relative'>('full');

	const C = $derived(strength(MU, V));
	const B = $derived(b - part[0]);

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let slowestSeen = $state(PAPER_SPEED / 1e3);
	let fastestSeen = $state(PAPER_SPEED / 1e3);
	let alongFrom = $state(-0.25);
	let alongMoved = $state(0);
	const revealed = $derived(step === 1 ? fastestSeen >= 1.95 * slowestSeen : alongMoved >= 0.24);

	function chooseStep(s: 1 | 2) {
		step = s;
		if (s === 1) slowestSeen = fastestSeen = speed;
		else {
			alongFrom = part[1];
			alongMoved = 0;
		}
	}

	// --- the views' scale: kept while something moves, then fitted again ---------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Room above the path for the tonne's name, and below the ball. */
	const TOP = 34;
	const BOTTOM = 14;
	type Box = { x: number; y: number; w: number; h: number };
	const layout = $derived.by(() => {
		if (phone.current) {
			const side: Box = { x: 0, y: 22, w: 360, h: 220 };
			const plot: Box = { x: 0, y: 284, w: 360, h: 128 };
			const along: Box = { x: 0, y: 520, w: 168, h: 220 };
			const kicks: Box = { x: 184, y: 538, w: 176, h: 190 };
			const legend = { x: 4, y: plot.y + plot.h + 58, anchor: 'start' };
			return { W: 360, H: 744, side, plot, along, kicks, legend };
		}
		const side: Box = { x: 0, y: 22, w: 440, h: 214 };
		const plot: Box = { x: 0, y: 278, w: 440, h: 128 };
		const along: Box = { x: 462, y: 22, w: 178, h: 214 };
		const kicks: Box = { x: 462, y: 278, w: 178, h: 150 };
		const legend = { x: plot.x + plot.w - 6, y: plot.y + 6, anchor: 'end' };
		return { W: 640, H: 446, side, plot, along, kicks, legend };
	});

	const fitTop = (b: number, B: number) => 1.32 * Math.max(peak(MU, b), peak(MU, B));
	const view = new Tween(
		{ b: PAPER_PASS, V: PAPER_SPEED, top: fitTop(PAPER_PASS, PAPER_PASS - 0.25) },
		{ duration: 450, easing: cubicOut }
	);
	/** Drawing units per metre, in both views of the ball. */
	const k = $derived((layout.side.h - TOP - BOTTOM) / (view.current.b + R));
	/** The half-width of the side view, m, and of the time axis, s: the two are aligned while V is as fitted. */
	const Z = $derived(layout.side.w / 2 / k);
	const T = $derived(Z / view.current.V);

	function fitted() {
		return { b, V, top: fitTop(b, B) };
	}

	let idle: ReturnType<typeof setTimeout> | undefined;
	/** After a change: fit at once if the drawing has run out of room, and fit smoothly once things are still. */
	function changed() {
		const now = view.target;
		const roomAbove = (TOP - 6) / k;
		const width = B / V;
		const top = Math.max(peak(MU, b), peak(MU, B));
		if (
			b > now.b + roomAbove ||
			width > 1.1 * (Z / now.V) ||
			width < Z / now.V / 40 ||
			top > 0.98 * now.top ||
			top < now.top / 10
		)
			view.set(fitted(), { duration: 0 });
		clearTimeout(idle);
		idle = setTimeout(
			() => view.set(fitted(), { duration: prefersReducedMotion.current ? 0 : 450 }),
			650
		);
	}

	function setB(v: number) {
		b = Math.round(Math.max(NEAREST, Math.min(FARTHEST, v)) * 100) / 100;
		changed();
	}

	function setSpeed(v: number) {
		speed = Math.max(SLOWEST / 1e3, Math.min(FASTEST / 1e3, v));
		if (step === 1) {
			slowestSeen = Math.min(slowestSeen, speed);
			fastestSeen = Math.max(fastestSeen, speed);
		}
		changed();
	}

	function setPart(p: Point) {
		const r = Math.hypot(p[0], p[1]);
		const s = r > R ? R / r : 1;
		part = [Math.round(p[0] * s * 1000) / 1000, Math.round(p[1] * s * 1000) / 1000];
		if (step === 2) alongMoved = Math.max(alongMoved, Math.abs(part[1] - alongFrom));
		changed();
	}

	// --- the time: a fraction of a run, from the tonne far before the ball to far after it --------------------------
	/** Seconds of the screen per run, and the pause after it. */
	const RUN = 3.6;
	const HOLD = 1.6;
	let phase = $state(0);
	let playing = $state(true);
	/** The run's half-length, s: the tonne from 3b before the centre to 3b after it, and the ball's radius more. */
	const tRun = $derived((3 * b + R) / V);
	const after = $derived(phase >= 1);
	const t = $derived((2 * Math.min(phase, 1) - 1) * tRun);

	function togglePlay() {
		if (!playing && phase >= 1) phase = 0;
		playing = !playing;
	}

	function setPhase(v: number) {
		phase = Math.max(0, Math.min(1, v));
		playing = false;
	}

	let checked = false;
	const clock: Attachment = () => {
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				phase = 1;
				return;
			}
		}
		if (!playing) return;
		let frame = 0;
		let last: number | undefined;
		let hold = 0;
		const tick = (now: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (now - last) / 1000);
			last = now;
			if (hold > 0) {
				hold -= dt;
				if (hold <= 0) phase = 0;
			} else {
				phase = Math.min(1, phase + dt / RUN);
				if (phase >= 1) hold = HOLD;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	};

	// --- the drawing ------------------------------------------------------------------------------------------------
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const DOT = $derived(3.3 * u);
	const f2 = (n: number) => n.toFixed(2);

	const side = $derived.by(() => {
		const s = layout.side;
		const cx = s.x + s.w / 2;
		const cy = s.y + TOP + view.current.b * k;
		return { cx, cy, pathY: cy - b * k };
	});
	const alongC = $derived.by(() => {
		const a = layout.along;
		const cx = a.x + a.w / 2;
		const cy = a.y + TOP + view.current.b * k;
		return { cx, cy, pathY: cy - b * k };
	});

	/** Drawing units per m s⁻¹ of kick: the largest kick, at the near edge, drawn 0.32 m long; with the ball's own kick removed, the largest left. */
	const arrowScale = $derived.by(() => {
		const c = strength(MU, view.current.V);
		const vb = view.current.b;
		const full = (0.32 * k) / (c / (vb - R));
		const relative = (0.32 * k) / ((c * R) / (vb * (vb - R)));
		return { full, relative, enlarged: relative / full };
	});

	/** The shaft and head of an arrow from the edge of a dot at `from`, of length and direction `v`, if long enough. */
	function arrow(from: { x: number; y: number }, v: { x: number; y: number }, radius: number) {
		const len = Math.hypot(v.x, v.y);
		if (len < 2.5 * u) return undefined;
		const head = Math.min(5 * u, 0.45 * len);
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * (radius + 1 * u), y: from.y + uy * (radius + 1 * u) };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	/** The velocity gained by now by a part at (toward the path, along it): across and along. */
	function gained(p: Point) {
		const so = kickSoFar(MU, b - p[0], V, after ? Infinity : t - p[1] / V);
		if (mode === 'full') return so;
		const whole = kickSoFar(MU, b, V, after ? Infinity : t);
		return { across: so.across - whole.across, along: so.along - whole.along };
	}

	/** Outward or inward from the centre, with the ball's own kick removed; a kick in full is just a kick. */
	function kind(p: Point, v: { across: number; along: number }) {
		if (mode === 'full') return 'kick';
		return p[0] * v.across + p[1] * v.along >= 0 ? 'out' : 'in';
	}

	const scaleNow = $derived(mode === 'full' ? arrowScale.full : arrowScale.relative);
	/** The time in which a part's velocity carries it the length of its arrow, in words. */
	const drift = $derived.by(() => {
		const years = scaleNow / k / (365.25 * 86400);
		return `${Number(years.toPrecision(2)).toLocaleString('en-US')} years`;
	});

	const sideParts = $derived(
		PARTS.map((p) => {
			const at = { x: side.cx + p[1] * k, y: side.cy - p[0] * k };
			const v = gained(p);
			return {
				at,
				kind: kind(p, v),
				arrow: arrow(at, { x: scaleNow * v.along, y: -scaleNow * v.across }, DOT)
			};
		})
	);
	const marked = $derived.by(() => {
		const at = { x: side.cx + part[1] * k, y: side.cy - part[0] * k };
		const v = gained(part);
		return {
			at,
			kind: kind(part, v),
			arrow: arrow(at, { x: scaleNow * v.along, y: -scaleNow * v.across }, DOT + 1.5 * u)
		};
	});

	/** Seen along the path: the kicks after the pass, the second number across the page. */
	const alongParts = $derived(
		PARTS.map((p) => {
			const at = { x: alongC.cx + p[1] * k, y: alongC.cy - p[0] * k };
			const [kx, ky] = kickAt(C, [b, 0], p);
			const v = mode === 'full' ? [kx, ky] : [kx - C / b, ky];
			const kindOf =
				mode === 'full'
					? 'kick'
					: p[0] * v[0] + p[1] * v[1] >= 0
						? ('out' as const)
						: ('in' as const);
			return {
				at,
				kind: kindOf,
				arrow: arrow(at, { x: scaleNow * v[1], y: -scaleNow * v[0] }, DOT)
			};
		})
	);

	/** The tonne, on its path: far beyond the view after the pass. */
	const tonne = $derived({ x: side.cx + (after ? 10 * Z : V * t) * k, y: side.pathY });
	const DISC = $derived(9 * u);

	// --- the pull against time --------------------------------------------------------------------------------------
	const plotX = (time: number) => side.cx + time * view.current.V * k;
	const plotBase = $derived(layout.plot.y + layout.plot.h);
	const plotY = (g: number) => plotBase - (g / view.current.top) * (layout.plot.h - 10);
	const SAMPLES = 220;

	function pulse(Bp: number, z: number, upTo = Infinity) {
		const pts: string[] = [];
		const end = Math.min(T, upTo);
		if (end <= -T) return undefined;
		for (let i = 0; i <= SAMPLES; i++) {
			const time = -T + ((end + T) * i) / SAMPLES;
			const g = pull(MU, Bp, V, time - z / V).across;
			pts.push(`${f2(plotX(time))},${f2(plotY(g))}`);
		}
		return pts;
	}

	const markedCurve = $derived(pulse(B, part[1])!);
	const centreCurve = $derived(pulse(b, 0)!);
	const markedLine = $derived(`M${markedCurve.join('L')}`);
	const markedArea = $derived(
		`M${f2(plotX(-T))},${f2(plotBase)}L${markedCurve.join('L')}L${f2(plotX(T))},${f2(plotBase)}Z`
	);
	const markedSoFar = $derived.by(() => {
		if (after) return markedArea;
		const pts = pulse(B, part[1], t);
		if (!pts) return '';
		const end = Math.min(T, t);
		return `M${f2(plotX(-T))},${f2(plotBase)}L${pts.join('L')}L${f2(plotX(end))},${f2(plotBase)}Z`;
	});
	const centreLine = $derived(`M${centreCurve.join('L')}`);
	const peakAt = $derived({ x: plotX(part[1] / V), y: plotY(peak(MU, B)) });

	/** The time axis in μs, or in ms for a slow pass. */
	const timeUnit = $derived(T > 2e-3 ? { s: 1e-3, name: 'ms' } : { s: 1e-6, name: 'μs' });
	const timeTicks = $derived.by(() => {
		const span = (2 * T) / timeUnit.s;
		const stepT = tickStep(span, phone.current ? 4 : 6);
		const out: number[] = [];
		for (let v = Math.ceil(-T / timeUnit.s / stepT) * stepT; v <= T / timeUnit.s; v += stepT)
			out.push(Math.round(v / stepT) * stepT);
		return out;
	});
	const showTime = (time: number) => {
		const v = time / timeUnit.s;
		const digits = Math.abs(v) < 10 ? 1 : 0;
		return `${v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)} ${timeUnit.name}`;
	};

	// --- the kicks after the pass, as bars ------------------------------------------------------------------------
	const exponent = $derived(Math.floor(Math.log10(C / b)));
	const bars = $derived.by(() => {
		const rows = [
			{ name: 'near edge', B: b - R },
			{ name: 'marked part', B },
			{ name: 'centre', B: b },
			{ name: 'far edge', B: b + R }
		];
		const most = C / (b - R);
		return rows.map((r) => ({
			...r,
			value: C / r.B,
			share: C / r.B / most,
			text: (C / r.B / 10 ** exponent).toFixed(2)
		}));
	});

	// --- dragging the part and scrubbing the time ---------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<'part' | 'time' | undefined>();

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: p.x, y: p.y };
	}

	function follow(e: PointerEvent) {
		if (!dragging) return;
		const p = local(e);
		if (dragging === 'part') setPart([(side.cy - p.y) / k, (p.x - side.cx) / k]);
		else {
			const time = (p.x - side.cx) / (view.current.V * k);
			setPhase(Math.min(0.999, (time / tRun + 1) / 2));
		}
	}

	function start(where: 'part' | 'time', e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		dragging = where;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function release() {
		dragging = undefined;
	}

	function partKey(e: KeyboardEvent) {
		const s = e.shiftKey ? 0.125 : 0.05;
		const d = (
			{
				ArrowUp: [s, 0],
				ArrowDown: [-s, 0],
				ArrowLeft: [0, -s],
				ArrowRight: [0, s]
			} as Record<string, Point>
		)[e.key];
		if (!d) return;
		e.preventDefault();
		setPart([part[0] + d[0], part[1] + d[1]]);
	}

	function timeKey(e: KeyboardEvent) {
		const s = e.shiftKey ? 0.1 : 0.02;
		const to =
			e.key === 'ArrowRight' || e.key === 'ArrowUp'
				? phase + s
				: e.key === 'ArrowLeft' || e.key === 'ArrowDown'
					? phase - s
					: e.key === 'Home'
						? 0
						: e.key === 'End'
							? 1
							: undefined;
		if (to === undefined) return;
		e.preventDefault();
		setPhase(to);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const MU_T = '\\htmlClass{q-matter}{\\mu}';
	const M_T = '\\htmlClass{q-matter}{M}';
	const energy = $derived(ballEnergy(C, b));
	const insideShare = $derived(energy.inside / energy.total);
	/** The longest pass, at the ball's far side, b + R from the path, s, and its share of the ringing period. */
	const longest = $derived(passDuration(b + R, V));
	const frozen = $derived(longest / RINGING);
	const sci = (x: number, figures = 2) => texNumber(x, figures);

	const unitTex = '\\,\\mathrm{m\\,s^{-1}}';
	const passTex = $derived(`C = \\dfrac{2G${MU_T}}{V} = ${sci(C, 3)}\\,\\mathrm{m^2\\,s^{-1}}`);
	const partTex = $derived(
		`B = ${B.toFixed(2)}\\,\\mathrm{m},\\ \\Delta v = \\dfrac{2G${MU_T}}{BV} = ${sci(kick(MU, B, V), 3)}${unitTex}`
	);
	const peakTex = $derived(
		`\\dfrac{G${MU_T}}{B^2} = ${sci(peak(MU, B), 3)}\\,\\mathrm{m\\,s^{-2}}`
	);
	const durationTex = $derived(
		`\\dfrac{2B}{V} = ${texNumber(passDuration(B, V) / 1e-6, 3)}\\,\\text{μs}`
	);
	const wholeTex = $derived(`\\dfrac{C}{b} = ${sci(C / b, 3)}${unitTex}`);
	const recoilTex = $derived(
		`\\tfrac12 ${M_T}\\Bigl(\\dfrac{C}{b}\\Bigr)^2 = ${sci(energy.recoil, 3)}\\,\\mathrm{J}`
	);
	const insideTex = $derived(`${sci(energy.inside, 3)}\\,\\mathrm{J}`);
	const totalTex = $derived(`\\Delta E = ${sci(energy.total, 3)}\\,\\mathrm{J}`);
	const slowTex = $derived(
		`\\dfrac{\\Delta E}{${MU_T} V^2} = ${sci(slowing(energy.total, MU, V), 2)}`
	);
	const slowInsideTex = $derived(`${sci(slowing(energy.inside, MU, V), 2)}`);
	const bendTex = $derived(
		`\\dfrac{2G${M_T}}{bV^2} = ${sci(deflection(BALL, b, V), 2)}\\,\\mathrm{rad}`
	);
	const longestTex = $derived(
		`\\dfrac{2(b + R)}{V} = ${texNumber(longest / 1e-6, 3)}\\,\\text{μs}`
	);

	// the chapter's numbers for the first answer, from the same model
	const atPaper = kick(MU, 1, PAPER_SPEED);
	const atDouble = kick(MU, 1, 2 * PAPER_SPEED);

	const description = $derived(
		`A tonne passing a steel ball of radius 0.5 m at ${b.toFixed(2)} m from its centre and ${speed.toFixed(0)} km/s, ` +
			(after ? 'after the pass' : `at ${showTime(t)} from closest approach`) +
			`. Thirteen parts of the ball carry arrows for the velocity each has gained${mode === 'relative' ? ', less the ball’s own' : ''}. ` +
			`Below, the sideways pull on the marked part, ${B.toFixed(2)} m from the path, against time; its area is the part’s kick.`
	);
	const partLabel = $derived(
		`The marked part, ${B.toFixed(2)} metres from the path and ${Math.abs(part[1]).toFixed(2)} metres ${part[1] < 0 ? 'before' : 'after'} the centre along it. Use the arrow keys: up and down toward and away from the path, left and right along it.`
	);
</script>

<div class="flyby-kick">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => chooseStep(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Double the speed of the pass. What happens to the kick?
			{:else}
				Move the marked part along the path, left or right. Does its kick change?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>It halves.</strong> The peak pull <Tex math={`G${MU_T}/B^2`} trust /> does not depend
				on the speed, but the pass lasts half as long, so the area under the pulse,
				<Tex math={`\\Delta v = 2G${MU_T}/BV`} trust />, halves. A metre from the path the tonne
				gives
				<Tex math={`${sci(atPaper, 2)}${unitTex}`} /> at 44 km/s and
				<Tex math={`${sci(atDouble, 2)}${unitTex}`} /> at 88 km/s.
				<button type="button" class="next" onclick={() => chooseStep(2)}>Next prediction</button>
			{:else if revealed}
				<strong>No.</strong> A part farther along the path feels the same pulse of pull, later by
				<Tex math="z/V" />, and moving a pulse in time does not change its area. Only the distance
				<Tex math="B" /> from the path sets the kick: move the part up or down to change it. The five
				parts of the row through the centre all end with the centre’s kick.
			{:else if step === 1}
				The answer appears when you have doubled the speed, or halved it.
			{:else}
				The answer appears when you have moved the part a quarter of a metre along the path.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging: dragging !== undefined }}
			onpointermove={follow}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-side">
					<rect
						x={layout.side.x}
						y={layout.side.y}
						width={layout.side.w}
						height={layout.side.h}
						rx="8"
					/>
				</clipPath>
				<clipPath id="{uid}-plot">
					<rect
						x={layout.plot.x}
						y={layout.plot.y - 4}
						width={layout.plot.w}
						height={layout.plot.h + 4}
					/>
				</clipPath>
				<radialGradient id="{uid}-ball" cx="0.4" cy="0.36" r="0.7">
					<stop offset="0" class="steel-light" />
					<stop offset="1" class="steel-dark" />
				</radialGradient>
				<radialGradient id="{uid}-tonne" r="0.5">
					<stop offset="0" class="mass-core" />
					<stop offset="0.72" class="mass-body" />
					<stop offset="1" class="mass-edge" />
				</radialGradient>
			</defs>

			<!-- the titles -->
			<text class="title" x={layout.side.x + 4} y={layout.side.y - 8 * u}>Seen from the side</text>
			<text class="title" x={layout.along.x + 4} y={layout.along.y - 8 * u}
				>Seen along the path, after it</text
			>
			<text class="title end" x={layout.side.x + layout.side.w - 4} y={layout.side.y - 8 * u}
				>{after ? 'after the pass' : `t = ${showTime(t)}`}</text
			>

			<!-- the side view -->
			<rect
				class="panel"
				x={layout.side.x + 0.5}
				y={layout.side.y + 0.5}
				width={layout.side.w - 1}
				height={layout.side.h - 1}
				rx="8"
			/>
			<g clip-path="url(#{uid}-side)">
				<line
					class="path"
					x1={layout.side.x}
					x2={layout.side.x + layout.side.w}
					y1={side.pathY}
					y2={side.pathY}
				/>
				<path
					class="path-head"
					d="M{f2(layout.side.x + layout.side.w - 6 * u)},{f2(side.pathY)}l{f2(-7 * u)},{f2(
						-3.5 * u
					)}v{f2(7 * u)}Z"
				/>
				<text class="small" x={layout.side.x + 8 * u} y={side.pathY - 8 * u}
					>path of the tonne, speed <tspan class="it">V</tspan></text
				>

				<!-- the distance of the pass from the centre, and of the marked part -->
				<line
					class="measure"
					x1={side.cx - (R + 0.16) * k}
					x2={side.cx - (R + 0.16) * k}
					y1={side.cy}
					y2={side.pathY}
				/>
				{#each [side.cy, side.pathY] as y (y)}
					<line
						class="measure-end"
						x1={side.cx - (R + 0.16) * k - 4 * u}
						x2={side.cx - (R + 0.16) * k + 4 * u}
						y1={y}
						y2={y}
					/>
				{/each}
				<text class="it-label" x={side.cx - (R + 0.16) * k - 5 * u} y={(side.cy + side.pathY) / 2}
					>b</text
				>
				<line
					class="measure part-measure"
					x1={marked.at.x}
					x2={marked.at.x}
					y1={marked.at.y}
					y2={side.pathY}
				/>
				<text
					class="it-label part-label"
					x={marked.at.x + 5 * u}
					y={(marked.at.y + side.pathY) / 2}
					data-anchor="start">B</text
				>

				<!-- the ball, cut through the path -->
				<circle
					class="ball"
					cx={side.cx}
					cy={side.cy}
					r={R * k}
					fill="url(#{uid}-ball)"
					role="presentation"
					onpointerdown={(e) => start('part', e)}
				/>

				{#each sideParts as p, i (i)}
					{#if p.arrow}
						<path class={['shaft', p.kind]} d={p.arrow.shaft} />
						<path class={['head', p.kind]} d={p.arrow.head} />
					{/if}
					<circle class="part" cx={p.at.x} cy={p.at.y} r={DOT} />
				{/each}

				<!-- the marked part, on top: dragged, or moved with the arrow keys -->
				<g
					class="marked"
					transform="translate({f2(marked.at.x)} {f2(marked.at.y)})"
					role="button"
					tabindex="0"
					aria-roledescription="movable part"
					aria-label={partLabel}
					onpointerdown={(e) => start('part', e)}
					onkeydown={partKey}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={9 * u} />
					<circle class="marked-ring" r={DOT + 2.6 * u} />
					<circle class="marked-dot" r={DOT + 0.6 * u} />
				</g>
				{#if marked.arrow}
					<path class={['shaft', 'marked-arrow', marked.kind]} d={marked.arrow.shaft} />
					<path class={['head', 'marked-arrow', marked.kind]} d={marked.arrow.head} />
				{/if}

				<!-- the tonne -->
				<g transform="translate({f2(tonne.x)} {f2(tonne.y)})">
					<circle class="tonne" r={DISC} fill="url(#{uid}-tonne)" />
					<text class="tonne-name" y={4.6 * u}>μ</text>
				</g>
			</g>

			<!-- seen along the path -->
			<rect
				class="panel"
				x={layout.along.x + 0.5}
				y={layout.along.y + 0.5}
				width={layout.along.w - 1}
				height={layout.along.h - 1}
				rx="8"
			/>
			<circle class="ball flat" cx={alongC.cx} cy={alongC.cy} r={R * k} />
			{#if (R + 0.14) * k + 12 * u < layout.along.w / 2}
				<line
					class="measure"
					x1={alongC.cx + (R + 0.14) * k}
					x2={alongC.cx + (R + 0.14) * k}
					y1={alongC.cy}
					y2={alongC.pathY}
				/>
				<text
					class="it-label"
					x={alongC.cx + (R + 0.14) * k + 5 * u}
					y={(alongC.cy + alongC.pathY) / 2}
					data-anchor="start">b</text
				>
			{/if}
			{#each alongParts as p, i (i)}
				{#if p.arrow}
					<path class={['shaft', p.kind]} d={p.arrow.shaft} />
					<path class={['head', p.kind]} d={p.arrow.head} />
				{/if}
				<circle class="part" cx={p.at.x} cy={p.at.y} r={DOT} />
			{/each}
			<circle class="marked-ring" cx={alongC.cx} cy={alongC.cy - part[0] * k} r={DOT + 2.6 * u} />
			<!-- where the path crosses the page: the tonne comes toward the reader -->
			<circle class="tonne" cx={alongC.cx} cy={alongC.pathY} r={DISC} fill="url(#{uid}-tonne)" />
			<circle class="crossing" cx={alongC.cx} cy={alongC.pathY} r={1.8 * u} />

			<!-- the pull against time -->
			<text class="title" x={layout.plot.x + 4} y={layout.plot.y - 8 * u}
				>Sideways pull on the marked part</text
			>
			<g clip-path="url(#{uid}-plot)">
				<path class="area" d={markedArea} />
				{#if markedSoFar}
					<path class="area-so-far" d={markedSoFar} />
				{/if}
				<path class="centre-curve" d={centreLine} />
				<path class="pulse" d={markedLine} />
				{#if !after && Math.abs(t) <= T}
					<line class="now" x1={plotX(t)} x2={plotX(t)} y1={layout.plot.y - 4} y2={plotBase} />
				{/if}
			</g>
			<line
				class="axis"
				x1={layout.plot.x}
				x2={layout.plot.x + layout.plot.w}
				y1={plotBase}
				y2={plotBase}
			/>
			{#each timeTicks as v (v)}
				{@const x = plotX(v * timeUnit.s)}
				<line class="axis" x1={x} x2={x} y1={plotBase} y2={plotBase + 4 * u} />
				<text class="small tick" {x} y={plotBase + 6 * u} dy="0.85em"
					>{v < 0 ? '−' : ''}{Math.abs(v)}</text
				>
			{/each}
			<text class="small dim" x={layout.plot.x + 4} y={plotBase + 6 * u} dy="2.3em"
				>time from closest approach to the centre, {timeUnit.name}</text
			>
			{#if peakAt.x > layout.plot.x + 20 && peakAt.x < layout.plot.x + layout.plot.w - 20}
				<text class="small pulse-label" x={peakAt.x} y={peakAt.y - 7 * u} data-anchor="middle"
					>peak <tspan class="it">Gμ</tspan>/<tspan class="it">B</tspan><tspan
						class="sup"
						dy="-0.45em">2</tspan
					></text
				>
			{/if}
			<text
				class="small area-label"
				x={layout.legend.x}
				y={layout.legend.y}
				data-anchor={layout.legend.anchor}>shaded: the area so far, the kick</text
			>
			<text
				class="small dim"
				x={layout.legend.x}
				y={layout.legend.y}
				dy="1.3em"
				data-anchor={layout.legend.anchor}>dashed: the pull at the centre</text
			>
			<!-- the plot, for scrubbing the time: a drag, or the arrow keys -->
			<rect
				class="scrub"
				x={layout.plot.x}
				y={layout.plot.y - 4}
				width={layout.plot.w}
				height={layout.plot.h + 4}
				role="slider"
				tabindex="0"
				aria-label="Time of the pass"
				aria-valuemin={0}
				aria-valuemax={1}
				aria-valuenow={Number(phase.toFixed(3))}
				aria-valuetext={after ? 'after the pass' : showTime(t)}
				onpointerdown={(e) => start('time', e)}
				onkeydown={timeKey}
			/>

			<!-- the kicks after the pass, to one scale -->
			<text class="title" x={layout.kicks.x + 4} y={layout.kicks.y - 8 * u}
				>Kicks after the pass</text
			>
			<text class="small dim" x={layout.kicks.x + 4} y={layout.kicks.y + 6 * u}
				>in 10<tspan class="sup" dy="-0.45em">−{-exponent}</tspan><tspan dy="0.45em"
					>&nbsp;m/s, to one scale</tspan
				></text
			>
			{#each bars as bar, i (bar.name)}
				{@const y = layout.kicks.y + 28 * u + i * 30 * u}
				{@const w = layout.kicks.w - 8}
				<text class="small" x={layout.kicks.x + 4} {y}>{bar.name}</text>
				<text class="small value" x={layout.kicks.x + layout.kicks.w - 4} {y} data-anchor="end"
					>{bar.text}</text
				>
				<rect
					class="bar-ground"
					x={layout.kicks.x + 4}
					y={y + 5 * u}
					width={w}
					height={7 * u}
					rx={2 * u}
				/>
				<rect
					class={['kick-bar', bar.name === 'marked part' && 'marked-bar']}
					x={layout.kicks.x + 4}
					y={y + 5 * u}
					width={Math.max(1, w * bar.share)}
					height={7 * u}
					rx={2 * u}
				/>
			{/each}
		</svg>
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
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<p class="hint">
				Drag the ringed part, or reach it with Tab and use the arrow keys. Drag along the pull, or
				use its arrow keys, to move through the pass.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-b"
				label="Distance of the pass"
				icon={RulerIcon}
				min={NEAREST}
				max={FARTHEST}
				step={0.01}
				bind:value={() => b, setB}
				readout="b = {b.toFixed(2)} m"
				mark={{ at: PAPER_PASS, label: 'the paper’s' }}
			/>
			<Slider
				id="{uid}-v"
				label="Speed"
				icon={DashboardSpeed02Icon}
				min={SLOWEST / 1e3}
				max={FASTEST / 1e3}
				step={1}
				bind:value={() => speed, setSpeed}
				readout="V = {speed.toFixed(0)} km/s"
				mark={{ at: PAPER_SPEED / 1e3, label: 'the paper’s' }}
			/>
		</div>
		<div class="choice">
			<Segmented
				label="Arrows"
				options={[
					{ value: 'full', label: 'Kicks in full', icon: ArrowUpRight01Icon },
					{ value: 'relative', label: 'Less the ball’s own', icon: ArrowExpand01Icon }
				]}
				bind:value={mode}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The pass</dt>
				<dd>
					<Tex math={passTex} trust /><span class="also"
						>a tonne, <Tex math={`${MU_T} = 1000\\,\\mathrm{kg}`} trust /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The marked part</dt>
				<dd>
					<Tex math={partTex} trust /><span class="also"
						>The pull peaks at <Tex math={peakTex} trust />. The pass here lasts <Tex
							math={durationTex}
						/>: how long the peak pull would have to act to give the same kick.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The whole ball</dt>
				<dd>
					<Tex math={wholeTex} /><span class="also">the centre’s kick, by the shell theorem</span>
				</dd>
			</div>
			<div class="row">
				<dt>Energy gained</dt>
				<dd class="energy">
					<span><Tex math={totalTex} /></span>
					<span class="split" aria-hidden="true"
						><span class="recoil" style:width="{100 * (1 - insideShare)}%"></span><span
							class="inside"
							style:width="{100 * insideShare}%"
						></span></span
					>
					<span class="also"
						><span class="key recoil-key"></span>recoil <Tex math={recoilTex} trust /></span
					>
					<span class="also"
						><span class="key inside-key"></span>inside <Tex math={insideTex} />,
						<strong>{(100 * insideShare).toFixed(insideShare < 0.01 ? 2 : 1)}%</strong></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The tonne slows</dt>
				<dd>
					<Tex math={slowTex} trust /><span class="also"
						>of its speed; the inside’s share <Tex math={slowInsideTex} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The approximation</dt>
				<dd class="checks">
					<span
						>Straight path: the ball bends it by <Tex math={bendTex} trust />, far less than one.</span
					>
					<span class={{ fails: frozen > FROZEN }}
						>Frozen ball: the pass lasts longest at the far side of the ball, {(b + R).toFixed(2)} m from
						the path, <Tex math={longestTex} />. That is {frozen.toFixed(2)} of the ball’s slowest ringing
						period, 330 μs: {frozen > FROZEN
							? 'more than a third, so the parts move during the pass, and the numbers here no longer hold.'
							: 'less than a third, so the parts barely move while the tonne passes.'}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			{#if mode === 'full'}
				Each arrow is the velocity a part has gained so far, all on one scale; the ringed part’s
				pull is plotted below.
			{:else}
				Each arrow is the velocity a part has gained less the ball’s own, the centre’s, drawn
				{arrowScale.enlarged.toFixed(1)} times larger than the kicks in full.
				<span class="out">Orange</span>: outward from the centre;
				<span class="in">blue</span>: inward. The near and far sides move apart, the sides come
				together: what is left inside the ball.
			{/if}
			The side view is a cut through the ball along the path; seen along the path, every part over the
			same point gets the same kick, wherever it lies along the path.
		</p>
		<p class="note">
			Distances are to scale and the parts are drawn larger than they are. An arrow is as long as
			the distance its part would drift at its velocity in {drift}. The views keep their scale while
			you move something, so that the change shows, and then fit again. Time 0 is when the tonne is
			closest to the centre; its run goes from three times b before the ball to three times b after
			it.
		</p>
	</div>
</div>

<style>
	.flyby-kick {
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
		padding: 0.5rem 0.6rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging * {
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

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.end,
	[data-anchor='end'] {
		text-anchor: end;
	}

	[data-anchor='start'] {
		text-anchor: start;
	}

	[data-anchor='middle'] {
		text-anchor: middle;
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	.it {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.12em;
	}

	.sup {
		font-size: 0.75em;
	}

	.it-label {
		fill: var(--text-dim);
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: end;
		dominant-baseline: middle;
	}

	.part-label {
		fill: var(--q-field);
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.path {
		stroke: color-mix(in srgb, var(--q-matter) 70%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.path-head {
		fill: color-mix(in srgb, var(--q-matter) 70%, transparent);
	}

	.measure {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.measure-end {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.part-measure {
		stroke: color-mix(in srgb, var(--q-field) 75%, transparent);
	}

	.ball {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		cursor: pointer;
		touch-action: none;
	}

	.ball.flat {
		fill: color-mix(in srgb, var(--text) 7%, transparent);
		cursor: default;
	}

	.steel-light {
		stop-color: color-mix(in srgb, var(--text) 16%, var(--bg-raised));
	}

	.steel-dark {
		stop-color: color-mix(in srgb, var(--text) 5%, var(--bg-sunken));
	}

	.part {
		fill: color-mix(in srgb, var(--text) 70%, var(--bg));
		stroke: color-mix(in srgb, var(--bg-sunken) 80%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
		pointer-events: none;
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
		pointer-events: none;
	}

	.head {
		pointer-events: none;
	}

	.shaft.kick,
	.shaft.out {
		stroke: var(--accent);
	}

	.head.kick,
	.head.out {
		fill: var(--accent);
	}

	.shaft.in {
		stroke: var(--accent-2);
	}

	.head.in {
		fill: var(--accent-2);
	}

	.shaft.marked-arrow {
		stroke-width: calc(2.2px * var(--u, 1));
	}

	.marked {
		cursor: grab;
		touch-action: none;
	}

	.marked:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.marked:focus-visible .focus {
		opacity: 1;
	}

	.marked-ring {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.6px * var(--u, 1));
		pointer-events: none;
	}

	.marked-dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.tonne {
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

	.tonne-name {
		fill: var(--q-matter);
		font: italic 600 calc(13px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: middle;
		pointer-events: none;
	}

	.crossing {
		fill: var(--q-matter);
	}

	/* --- the pull --------------------------------------------------------------------------- */

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.area {
		fill: color-mix(in srgb, var(--q-field) 12%, transparent);
	}

	.area-so-far {
		fill: color-mix(in srgb, var(--q-field) 34%, transparent);
	}

	.pulse {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.centre-curve {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.now {
		stroke: color-mix(in srgb, var(--q-matter) 80%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.pulse-label,
	.area-label {
		fill: var(--q-field);
	}

	.pulse-label {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.scrub {
		fill: transparent;
		cursor: ew-resize;
		touch-action: none;
	}

	.scrub:focus {
		outline: none;
	}

	.scrub:focus-visible {
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	/* --- the kicks after the pass ----------------------------------------------------------- */

	.value {
		fill: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.bar-ground {
		fill: color-mix(in srgb, var(--text) 8%, transparent);
	}

	.kick-bar {
		fill: color-mix(in srgb, var(--accent) 60%, transparent);
	}

	.kick-bar.marked-bar {
		fill: var(--q-field);
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
		align-items: center;
		gap: 0.7rem;
	}

	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
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
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
	}

	.choice {
		max-width: 22rem;
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

	.also {
		color: var(--text-dim);
	}

	.also strong {
		color: var(--text);
		font-weight: 600;
	}

	.energy .split {
		display: flex;
		flex: 1 1 100%;
		order: 1;
		height: 0.45rem;
		border-radius: 3px;
		overflow: hidden;
		background: color-mix(in srgb, var(--text) 8%, transparent);
	}

	.energy > .also {
		order: 2;
	}

	.split .recoil,
	.recoil-key {
		background: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.split .inside,
	.inside-key {
		background: var(--accent);
	}

	.key {
		display: inline-block;
		width: 0.7rem;
		height: 0.45rem;
		margin-right: 0.35rem;
		border-radius: 2px;
	}

	.checks {
		flex-direction: column;
		align-items: flex-start !important;
		gap: 0.2rem !important;
	}

	.checks .fails {
		color: var(--bad);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.note .out {
		color: var(--accent);
	}

	.note .in {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.sliders {
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
