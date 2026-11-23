<script lang="ts">
	/**
	 * Chapter 4.2's warm molecule: six masses at the corners of a regular hexagon of side 1, joined by twelve springs
	 * (neighbours and next neighbours), in a Langevin heat bath, integrated by BAOAB in ./equipartition.ts. Left, the
	 * molecule drawn about its wandering centre of mass, each mass with its velocity as a short arrow, over a faint
	 * lattice fixed in the room, so that the lattice drifts as the centre wanders. Right, four running averages, each
	 * divided by what the chapter predicts for it, with one standard error each way. The reader sets the mass of two
	 * opposite masses (×1 to ×16), the stiffness of every spring (×0.1 to ×10) and the temperature. Two predictions at
	 * the top are answered once the reader has done what they ask and the averages have run long enough.
	 *
	 * Two copies of the molecule run with the same settings: the one drawn, at a pace the eye can follow, and one that
	 * runs in the background as fast as a few milliseconds of each frame allow, from a fixed seed, for the averages.
	 * Both stop while the figure is off the screen, and the averages stop for good after MOST_STEPS steps. Under
	 * reduced motion the drawn molecule waits for the play button; the averages run all the same.
	 */
	import { untrack } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Activity01Icon,
		Dumbbell01Icon,
		PauseIcon,
		PlayIcon,
		ThermometerIcon,
		Undo02Icon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		CORNERS,
		HEAVIER,
		HEAVY,
		MOST_STEPS,
		Molecule,
		OPENING,
		Q,
		SEED,
		SHRINK,
		SPREADS,
		SPRINGS,
		STIFFER,
		STIFFNESS,
		Tally,
		WARMER,
		highest,
		speedRatio,
		totalMass,
		type Estimate,
		type Settings
	} from './equipartition';

	const uid = $props.id();

	/** The drawn molecule's pace: units of time per second. */
	const PACE = 0.5;
	/** An arrow is as long as the distance its mass would go in this time. */
	const ARROW = 0.2;
	/**
	 * The background run's time in each frame: a quarter of the time between frames, and at most 4 ms, so that a
	 * screen at 120 frames a second gives it no more of the main thread than one at 60; and the most steps it takes
	 * in one frame.
	 */
	const BUDGET = 4;
	const SHARE = 0.25;
	const MOST_PER_FRAME = 20000;
	const CHUNK = 500;
	/** The readouts are refreshed every this many frames. */
	const REFRESH = 12;
	/** The steps after which each prediction may be answered. */
	const GATE_SPEED = 3e5;
	const GATE_SHAPE = 1e6;
	/** The centre's path: a point every few frames, for about six seconds. */
	const TRAIL_EVERY = 6;
	const TRAIL_POINTS = 60;

	// --- the settings ---------------------------------------------------------------------------------------------
	let heavyIndex = $state(HEAVIER.indexOf(OPENING.heavy));
	let stiffIndex = $state(STIFFER.indexOf(OPENING.stiffness));
	let warmIndex = $state(WARMER.indexOf(OPENING.temperature));
	const settings = $derived<Settings>({
		heavy: HEAVIER[heavyIndex],
		stiffness: STIFFER[stiffIndex],
		temperature: WARMER[warmIndex]
	});
	const kT = $derived(settings.temperature);
	const M = $derived(totalMass(settings.heavy));

	// --- the two copies and the averages (not reactive: the frames copy out what is drawn and read) -----------------
	let shown = new Molecule(OPENING, SEED + 1);
	let averaged = new Molecule(OPENING, SEED);
	let tally = new Tally();

	type Picture = { x: number[]; v: number[]; X: number; Y: number; trail: number[] };
	let trail: number[] = [];
	function draw(): Picture {
		const m = shown.mass;
		let X = 0;
		let Y = 0;
		let total = 0;
		for (let a = 0; a < CORNERS; a++) {
			X += m[a] * shown.x[2 * a];
			Y += m[a] * shown.x[2 * a + 1];
			total += m[a];
		}
		return { x: Array.from(shown.x), v: Array.from(shown.v), X: X / total, Y: Y / total, trail };
	}
	let picture = $state.raw<Picture>(draw());

	type Results = {
		steps: number;
		ready: boolean;
		light: Estimate;
		heavy: Estimate;
		centre: Estimate;
		shape: Estimate;
		spread: Estimate;
		shapeRatio: Estimate;
		speed: Estimate;
		settings: Settings;
	};
	function read(): Results {
		return {
			steps: tally.steps,
			ready: tally.ready,
			light: tally.estimate(Q.LightEnergy),
			heavy: tally.estimate(Q.HeavyEnergy),
			centre: tally.estimate(Q.CentreRate),
			shape: tally.estimate(Q.ShapeRate),
			spread: tally.estimate(Q.Spread),
			shapeRatio: tally.ratio(Q.ShapeRate, Q.Spread),
			speed: speedRatio(tally, settings.heavy),
			settings
		};
	}
	let results = $state.raw<Results>(read());
	/** The last run before the settings changed, if it had run long enough to give its errors. */
	let previous = $state.raw<Results | undefined>();
	const done = $derived(results.steps >= MOST_STEPS);

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** What the averages said when each prediction was answered. */
	let first = $state.raw<Results | undefined>();
	let second = $state.raw<Results | undefined>();
	/** The run before the second answer, if it differed only in its stiffness. */
	let shapeBefore = $state.raw<Results | undefined>();
	const revealed = $derived(step === 1 ? first !== undefined : second !== undefined);

	function noteResults() {
		if (!first && settings.heavy === 16 && results.steps >= GATE_SPEED) first = results;
		if (!second && settings.stiffness === 10 && results.steps >= GATE_SHAPE) {
			const before = previous;
			second = results;
			shapeBefore =
				before &&
				before.settings.stiffness !== 10 &&
				before.settings.heavy === settings.heavy &&
				before.settings.temperature === settings.temperature
					? before
					: undefined;
		}
	}

	// --- the actions ------------------------------------------------------------------------------------------------
	function apply() {
		const s = settings;
		shown.set(s);
		averaged.set(s);
		if (tally.ready) previous = results;
		tally = new Tally();
		results = read();
		wake();
	}

	const clampIndex = (i: number, n: number) => Math.max(0, Math.min(n - 1, Math.round(i)));
	function setHeavy(i: number) {
		const next = clampIndex(i, HEAVIER.length);
		if (next === heavyIndex) return;
		heavyIndex = next;
		apply();
	}
	function setStiff(i: number) {
		const next = clampIndex(i, STIFFER.length);
		if (next === stiffIndex) return;
		stiffIndex = next;
		apply();
	}
	function setWarm(i: number) {
		const next = clampIndex(i, WARMER.length);
		if (next === warmIndex) return;
		warmIndex = next;
		apply();
	}

	function restart() {
		shown = new Molecule(settings, SEED + 1);
		averaged = new Molecule(settings, SEED);
		tally = new Tally();
		trail = [];
		picture = draw();
		results = read();
		wake();
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let onScreen = false;
	let frame = 0;
	let last: number | undefined;
	let count = 0;

	function tick(now: number) {
		frame = 0;
		if (!onScreen) {
			last = undefined;
			return;
		}
		const gap = last === undefined ? 1000 / 60 : now - last;
		const dt = last === undefined ? 0 : Math.min(0.1, gap / 1000);
		const budget = Math.min(BUDGET, SHARE * gap);
		last = now;
		count++;
		let busy = false;
		if (playing) {
			shown.advance(dt * PACE);
			if (count % TRAIL_EVERY === 0) {
				const p = draw();
				trail = [...trail.slice(-2 * (TRAIL_POINTS - 1)), p.X, p.Y];
			}
			picture = draw();
			busy = true;
		}
		if (tally.steps < MOST_STEPS) {
			const start = performance.now();
			let n = 0;
			while (n < MOST_PER_FRAME && tally.steps < MOST_STEPS && performance.now() - start < budget) {
				const c = Math.min(CHUNK, MOST_STEPS - tally.steps);
				averaged.run(c, tally);
				n += c;
			}
			if (count % REFRESH === 0 || tally.steps >= MOST_STEPS) {
				results = read();
				noteResults();
			}
			busy = true;
		}
		if (busy) frame = requestAnimationFrame(tick);
		else last = undefined;
	}

	function wake() {
		if (frame || !onScreen || typeof requestAnimationFrame === 'undefined') return;
		frame = requestAnimationFrame(tick);
	}

	function togglePlay() {
		playing = !playing;
		last = undefined;
		wake();
	}

	/** Runs the frames while the figure is on the screen; under reduced motion the drawn molecule opens paused. */
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

	// --- the drawing --------------------------------------------------------------------------------------------------
	const W = 320;
	const TOP = 24;
	const PANEL = { x: 0, y: TOP, w: W, h: W };
	const H = TOP + W + 2;
	/** Drawing units per side of the hexagon, and the centre of the panel. */
	const PER = W / 3.6;
	const CX = PANEL.x + PANEL.w / 2;
	const CY = PANEL.y + PANEL.h / 2;
	/** The lattice fixed in the room: a dot every half side. */
	const LATTICE = PER / 2;

	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const radius = (m: number) => 0.085 * PER * Math.sqrt(Math.sqrt(m));
	const place = (x: number, y: number) => ({
		x: CX + (x - picture.X) * PER,
		y: CY - (y - picture.Y) * PER
	});

	const points = $derived(
		Array.from({ length: CORNERS }, (_, a) => place(picture.x[2 * a], picture.x[2 * a + 1]))
	);
	const sizes = $derived(
		Array.from({ length: CORNERS }, (_, a) => radius(HEAVY.includes(a) ? settings.heavy : 1))
	);

	/** The shaft and head of an arrow from `from` to `to`, if it is long enough to draw. */
	function arrow(from: { x: number; y: number }, to: { x: number; y: number }, head = 5.5) {
		const len = Math.hypot(to.x - from.x, to.y - from.y);
		if (len < 2.5 * u) return undefined;
		const ux = (to.x - from.x) / len;
		const uy = (to.y - from.y) / len;
		const h = Math.min(head * u, 0.5 * len);
		const base = { x: to.x - ux * h, y: to.y - uy * h };
		const w = h / 2.3;
		return {
			shaft: `M${f2(from.x)},${f2(from.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(to.x)},${f2(to.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	/** Each mass's velocity, from the edge of its disc, as long as the distance it would go in the time ARROW. */
	const arrows = $derived(
		points.map((p, a) => {
			const vx = picture.v[2 * a];
			const vy = -picture.v[2 * a + 1];
			const speed = Math.hypot(vx, vy);
			if (speed === 0) return undefined;
			const ex = vx / speed;
			const ey = vy / speed;
			const from = { x: p.x + ex * sizes[a], y: p.y + ey * sizes[a] };
			const len = speed * ARROW * PER;
			return arrow(from, { x: from.x + ex * len, y: from.y + ey * len });
		})
	);

	const springs = $derived(
		SPRINGS.map(([a, b, rest]) => ({
			key: `${a}-${b}`,
			side: rest === 1,
			x1: points[a].x,
			y1: points[a].y,
			x2: points[b].x,
			y2: points[b].y
		}))
	);

	/** The lattice's offset: it is fixed in the room, so it moves against the centre of mass. */
	const latticeShift = $derived({
		x: ((((CX - picture.X * PER) % LATTICE) + LATTICE) % LATTICE) - LATTICE,
		y: ((((CY + picture.Y * PER) % LATTICE) + LATTICE) % LATTICE) - LATTICE
	});

	/** The centre's path over the last seconds, drawn about where it is now. */
	const path = $derived.by(() => {
		const t = picture.trail;
		if (t.length < 4) return '';
		let d = '';
		for (let i = 0; i < t.length; i += 2) {
			const p = place(t[i], t[i + 1]);
			d += `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`;
		}
		const now = place(picture.X, picture.Y);
		return `${d}L${f2(now.x)},${f2(now.y)}`;
	});

	// --- the gauges ---------------------------------------------------------------------------------------------------
	/** The gauges' scale: from 1 − SPAN to 1 + SPAN. */
	const SPAN = 0.05;
	const along = (r: number) => 50 + (50 * (r - 1)) / SPAN;
	const ratios = $derived([
		{
			key: 'light',
			words: 'A light mass',
			math: `\\tfrac12\\htmlClass{q-matter}{m}\\langle v^2\\rangle / k_BT`,
			value: results.light
		},
		{
			key: 'heavy',
			words: 'A heavy mass, ringed',
			math: `\\tfrac12\\htmlClass{q-matter}{m}\\langle v^2\\rangle / k_BT`,
			value: results.heavy
		},
		{
			key: 'centre',
			words: 'The centre of mass',
			math: `\\langle \\htmlClass{q-matter}{\\dot Q}_x^2\\rangle / k_BT\\htmlClass{q-matter}{M}`,
			value: results.centre
		},
		{
			key: 'shape',
			words: 'The shape',
			math: `\\langle \\htmlClass{q-matter}{\\dot Q}_{xy}^2\\rangle / k_BT\\langle\\textstyle\\sum \\htmlClass{q-matter}{m}(x^2 + y^2)\\rangle`,
			value: results.shapeRatio
		}
	]);

	// --- the numbers ----------------------------------------------------------------------------------------------
	const M_T = '\\htmlClass{q-matter}{m}';
	const MM_T = '\\htmlClass{q-matter}{M}';
	const QX = '\\htmlClass{q-matter}{\\dot Q}_x';
	const QXY = '\\htmlClass{q-matter}{\\dot Q}_{xy}';
	const SPREAD_T = `k_BT\\langle\\textstyle\\sum ${M_T}(x^2 + y^2)\\rangle`;

	/** A mean and its standard error, as LaTeX: the error to one or two figures, the mean to the same place. */
	function pm(e: Estimate, scale = 1): string {
		const mean = e.mean * scale;
		const error = e.error * scale;
		if (!Number.isFinite(mean)) return '\\text{—}';
		if (!(error > 0)) return mean.toFixed(3);
		const d = Math.min(4, Math.max(0, 1 - Math.floor(Math.log10(error))));
		return `${mean.toFixed(d)} \\pm ${error.toFixed(d)}`;
	}
	/** A mean and its error in words, for the gauges. */
	function pmText(e: Estimate): string {
		return pm(e).replace(' \\pm ', ' ± ');
	}
	const stepsTex = (n: number) => texNumber(n, 2);
	const stepsText = (n: number) =>
		texNumber(n, 2)
			.replace(' \\times ', ' × ')
			.replace(/10\^\{(\d+)\}/, (_, e: string) => `10${superscripts(e)}`);
	const superscripts = (e: string) => [...e].map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join('');
	/** A factor as the controls show it: ×16, ×0.1. */
	const factor = (x: number) => `×${x}`;

	/** The root mean square speed of a mass of the mass m, from its ½m⟨v²⟩ in units of k_BT: √(2 E k_BT / m). */
	const speedOf = (e: Estimate, m: number, t: number): Estimate => {
		const mean = Math.sqrt((2 * e.mean * t) / m);
		return { mean, error: (mean * e.error) / (2 * e.mean) };
	};
	const lightSpeed = $derived(speedOf(results.light, 1, kT));
	const heavySpeed = $derived(speedOf(results.heavy, settings.heavy, kT));
	const fastest = $derived(highest(settings));
	const k = $derived(STIFFNESS * settings.stiffness);
	const stretch = $derived(Math.sqrt(kT / k));

	const spreadAt = (s: number) => SPREADS.find((r) => r.stiffness === s)?.value ?? NaN;

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`Six masses at the corners of a hexagon, joined by twelve springs, trembling in a heat bath and drawn about their centre of mass, each with an arrow for its velocity. ` +
			`The two ringed masses are ${settings.heavy === 1 ? 'as heavy as the others' : `${settings.heavy} times as heavy as the others`}; the springs are ${factor(settings.stiffness)} as stiff as at the opening, and the temperature is ${factor(settings.temperature)}. ` +
			`A faint lattice fixed in the room drifts as the centre of mass wanders.`
	);
</script>

<div class="equipartition" {@attach life}>
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
				Make two masses sixteen times heavier. How much slower do they move?
			{:else}
				Make every spring ten times stiffer. Does <Tex math={`\\langle ${QXY}^2\\rangle`} trust /> grow,
				shrink or stay?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && first}
				<strong>Four times slower.</strong> Each mass holds <Tex math="\tfrac12k_BT" /> of energy of motion
				along each of its two axes, whatever its mass, so <Tex
					math={`\\langle v^2\\rangle = 2k_BT/${M_T}`}
					trust
				/> and the root mean square speed falls as <Tex math={`1/\\sqrt{${M_T}}`} trust />: <Tex
					math={'\\sqrt{16} = 4'}
				/>. After <Tex math={stepsTex(first.steps)} /> steps the heavy masses moved at
				<Tex math={pm(first.speed)} /> of the light ones’ speed, and each held <Tex
					math={`${pm(first.heavy)}\\ k_BT`}
				/> of energy of motion.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && second}
				<strong>It stays.</strong>
				<Tex math={`\\langle ${QXY}^2\\rangle = ${SPREAD_T}`} trust /> depends only on the masses and
				their places. The springs set how fast the shape swings, not how fast the masses move. After
				<Tex math={stepsTex(second.steps)} /> steps at <Tex math="\times 10" />, <Tex
					math={`\\langle ${QXY}^2\\rangle = ${pm(second.shape)}`}
					trust
				/>{#if shapeBefore}, against <Tex math={pm(shapeBefore.shape)} /> at <Tex
						math={`\\times ${shapeBefore.settings.stiffness}`}
					/>{/if}. Stiffer springs do hold the molecule a little closer to its rest shape: with
				equal masses at the opening temperature, <Tex math={SPREAD_T} trust /> is {spreadAt(
					1
				).toFixed(2)} at
				<Tex math="\times 1" /> and {spreadAt(10).toFixed(2)} at <Tex math="\times 10" />, smaller
				by
				{(100 * SHRINK).toFixed(1)}%. To see a change so small, the standard error must fall to
				about 0.1%, which takes about <Tex math={'3 \\times 10^{7}'} /> steps.
			{:else if step === 1}
				The answer appears when you have made the ringed masses sixteen times heavier and the
				averages have run for <Tex math={'3 \\times 10^{5}'} /> steps.
			{:else}
				The answer appears when you have made the springs ten times stiffer and the averages have
				run for <Tex math={'10^{6}'} /> steps.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="pair">
			<div class="panel">
				<svg
					viewBox="0 0 {W} {H}"
					role="img"
					aria-label={description}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<clipPath id="{uid}-panel">
							<rect
								x={PANEL.x + 1}
								y={PANEL.y + 1}
								width={PANEL.w - 2}
								height={PANEL.h - 2}
								rx="7"
							/>
						</clipPath>
						<pattern
							id="{uid}-lattice"
							width={LATTICE}
							height={LATTICE}
							patternUnits="userSpaceOnUse"
							patternTransform="translate({f2(latticeShift.x)} {f2(latticeShift.y)})"
						>
							<circle class="lattice" cx="0" cy="0" r={1.1 * u} />
							<circle class="lattice" cx={LATTICE} cy="0" r={1.1 * u} />
							<circle class="lattice" cx="0" cy={LATTICE} r={1.1 * u} />
							<circle class="lattice" cx={LATTICE} cy={LATTICE} r={1.1 * u} />
						</pattern>
					</defs>

					<text class="title" x="4" y={TOP - 9 * u}>The molecule, about its centre of mass</text>
					<rect
						class="frame"
						x={PANEL.x + 0.5}
						y={PANEL.y + 0.5}
						width={PANEL.w - 1}
						height={PANEL.h - 1}
						rx="8"
					/>
					<g clip-path="url(#{uid}-panel)">
						<rect
							x={PANEL.x}
							y={PANEL.y}
							width={PANEL.w}
							height={PANEL.h}
							fill="url(#{uid}-lattice)"
						/>
						{#if path}
							<path class="trail" d={path} />
						{/if}
						{#each springs as s (s.key)}
							<line class={['spring', { side: s.side }]} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
						{/each}
						{#each points as p, a (a)}
							<circle class="mass" cx={p.x} cy={p.y} r={sizes[a]} />
							{#if HEAVY.includes(a)}
								<circle class="ring" cx={p.x} cy={p.y} r={sizes[a] + 3 * u} />
							{/if}
						{/each}
						{#each arrows as ar, a (a)}
							{#if ar}
								<path class="shaft" d={ar.shaft} />
								<path class="head" d={ar.head} />
							{/if}
						{/each}
						<g class="centre">
							<line x1={CX - 5 * u} x2={CX + 5 * u} y1={CY} y2={CY} />
							<line x1={CX} x2={CX} y1={CY - 5 * u} y2={CY + 5 * u} />
						</g>
					</g>
				</svg>
				<ul class="legend" aria-hidden="true">
					<li><span class="dot-key"></span>a mass; the two ringed ones are made heavier</li>
					<li><span class="swatch arrow-key"></span>its velocity</li>
					<li><span class="swatch trail-key"></span>the path of the centre of mass</li>
					<li><span class="lattice-key"></span>dots fixed in the room</li>
				</ul>
			</div>

			<div class="panel gauges">
				<p class="title">The running averages, each over its prediction</p>
				<ul class="rows">
					{#each ratios as r (r.key)}
						{@const ok = results.ready && Number.isFinite(r.value.mean)}
						{@const at = along(r.value.mean)}
						<li>
							<div class="gauge-head">
								<span class="gauge-words">{r.words}, <Tex math={r.math} trust /></span>
								<span class="gauge-value">{ok ? pmText(r.value) : 'settling'}</span>
							</div>
							<div class="gauge" aria-hidden="true">
								<i class="one"></i>
								<i class="tick" style:left="{along(1 - SPAN / 2)}%"></i>
								<i class="tick" style:left="{along(1 + SPAN / 2)}%"></i>
								{#if ok}
									<b
										class="error-bar"
										style:left="{Math.max(0, along(r.value.mean - r.value.error))}%"
										style:right="{Math.max(0, 100 - along(r.value.mean + r.value.error))}%"
									></b>
									<b
										class={['dot', { out: at < 0 || at > 100 }]}
										style:left="{Math.max(0, Math.min(100, at))}%"
									></b>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
				<div class="scale" aria-hidden="true">
					<span style:left="0%">{1 - SPAN}</span>
					<span style:left="50%">1</span>
					<span style:left="100%">{1 + SPAN}</span>
				</div>
				<p class="run">
					{#if done}
						Averaged over <Tex math={stepsTex(results.steps)} /> steps; the averages have stopped.
					{:else if results.ready}
						Averaged over <Tex math={stepsTex(results.steps)} /> steps so far.
					{:else}
						The averages are settling: the first {stepsText(2000)} steps let the springs come to the bath’s
						temperature, and the errors need {stepsText(2e4)} more.
					{/if}
				</p>
				<p class="legend-words">
					Each dot is a running average divided by what the chapter predicts for it, so it tends to
					1. Its bar spans one standard error each way.
				</p>
			</div>
		</div>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause the molecule' : 'Play the molecule'}
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
			<button type="button" class="action" onclick={restart}>
				<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
				Restart
			</button>
			<p class="hint">
				Restart begins again from the hexagon at rest, with the same random kicks. The averages run
				on while the figure is on the screen, even with the molecule paused. The sliders take the
				arrow keys after Tab.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-heavy"
				label="Mass of the ringed pair"
				icon={Dumbbell01Icon}
				min={0}
				max={HEAVIER.length - 1}
				step={1}
				bind:value={() => heavyIndex, setHeavy}
				readout={factor(settings.heavy)}
				ends={[factor(HEAVIER[0]), factor(HEAVIER[HEAVIER.length - 1])]}
			/>
			<Slider
				id="{uid}-stiff"
				label="Stiffness of every spring"
				icon={Activity01Icon}
				min={0}
				max={STIFFER.length - 1}
				step={1}
				bind:value={() => stiffIndex, setStiff}
				readout={factor(settings.stiffness)}
				ends={[factor(STIFFER[0]), factor(STIFFER[STIFFER.length - 1])]}
			/>
			<Slider
				id="{uid}-warm"
				label="Temperature"
				icon={ThermometerIcon}
				min={0}
				max={WARMER.length - 1}
				step={1}
				bind:value={() => warmIndex, setWarm}
				readout={factor(settings.temperature)}
				ends={[factor(WARMER[0]), factor(WARMER[WARMER.length - 1])]}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The masses</dt>
				<dd>
					<Tex
						math={`${M_T} = ${settings.heavy === 1 ? '1' : `1\\ \\text{and}\\ ${settings.heavy}`},\\ ${MM_T} = \\textstyle\\sum ${M_T} = ${M}`}
						trust
					/><span class="also"
						>The four light masses each have the mass 1. {settings.heavy === 1
							? 'The two ringed masses have the same mass as the others.'
							: `The two ringed masses are ${settings.heavy} times as heavy.`}
						<Tex math={MM_T} trust /> is the mass of the whole molecule.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Their speeds</dt>
				<dd>
					{#if results.ready}
						<Tex
							math={`\\sqrt{\\langle v^2\\rangle} = ${pm(lightSpeed)}\\ \\text{and}\\ ${pm(heavySpeed)}`}
						/>
					{/if}
					<span class="also"
						>These are the root mean square speeds of a light mass and of a ringed one. The
						prediction
						<Tex math={`\\sqrt{2k_BT/${M_T}}`} trust /> gives {Math.sqrt(2 * kT).toFixed(3)} and {Math.sqrt(
							(2 * kT) / settings.heavy
						).toFixed(3)}.
						{#if results.ready}The ringed masses move at <Tex math={pm(results.speed)} /> of the light
							ones’ speed.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The centre of mass</dt>
				<dd>
					{#if results.ready}
						<Tex math={`\\langle ${QX}^2\\rangle = ${pm(results.centre, kT * M)}`} trust />
						<Tex math={`k_BT${MM_T} = ${texNumber(kT * M, 3)}`} trust />
					{/if}
					<span class="also"
						>The moment <Tex math={`\\htmlClass{q-matter}{Q}_x = ${MM_T}X`} trust /> is the mass times
						the position <Tex math="X" /> of the centre of mass, so its rate of change <Tex
							math={QX}
							trust
						/> is the molecule’s momentum along <Tex math="x" />. The centre wanders like one
						particle that carries the whole mass: this is Brownian motion.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The shape</dt>
				<dd>
					{#if results.ready}
						<Tex math={`\\langle ${QXY}^2\\rangle = ${pm(results.shape)}`} trust />
						<Tex math={`${SPREAD_T} = ${pm(results.spread)}`} trust />
					{/if}
					<span class="also"
						>The moment <Tex
							math={`\\htmlClass{q-matter}{Q}_{xy} = \\textstyle\\sum ${M_T}\\,xy`}
							trust
						/> is taken with <Tex math="x" /> and <Tex math="y" /> measured from the centre of mass. The
						chapter’s equation says that the two numbers are equal. A rigid hexagon would have <Tex
							math={`\\textstyle\\sum ${M_T}(x^2 + y^2) = ${MM_T} = ${M}`}
							trust
						/>, since every mass would lie one side from the centre. Heat stretches the springs and
						makes it a little larger.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The springs</dt>
				<dd>
					<Tex math={`k = ${texNumber(k, 3)},\\ \\omega_{\\max} = ${texNumber(fastest, 3)}`} /><span
						class="also"
						>Here <Tex math={'\\omega_{\\max}'} /> is the angular frequency of the fastest way in which
						the hexagon can vibrate. Heat stretches each side by about <Tex
							math={`\\sqrt{k_BT/k} = ${stretch.toFixed(2)}`}
						/> of its length.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The bath</dt>
				<dd>
					<Tex math={`k_BT = ${kT},\\ \\Gamma = ${texNumber(fastest / 5, 3)}`} /><span class="also"
						>Each mass feels the friction <Tex math={`-${M_T}\\Gamma\\mathbf v`} trust /> and a random
						force of matching strength. The damping rate <Tex math="\Gamma" /> is a fifth of <Tex
							math={'\\omega_{\\max}'}
						/>.</span
					>
				</dd>
			</div>
			{#if previous}
				<div class="row">
					<dt>The run before</dt>
					<dd>
						<Tex math={`\\langle ${QXY}^2\\rangle = ${pm(previous.shape)}`} trust />
						<Tex math={`${SPREAD_T} = ${pm(previous.spread)}`} trust /><span class="also"
							>These were the averages over <Tex math={stepsTex(previous.steps)} /> steps before the last
							change, with the ringed masses at {factor(previous.settings.heavy)}, the springs at {factor(
								previous.settings.stiffness
							)} and the temperature at {factor(previous.settings.temperature)}.</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			The units are arbitrary: lengths in sides of the hexagon, masses in the light mass, and
			energies in the <Tex math="k_BT" /> at which the figure opens, so that the springs have <Tex
				math="k = 100"
			/> at <Tex math="\times 1" />. The friction and the random force are the heat bath of chapter
			4.6. The motion is integrated in steps of a fifth of <Tex math={'1/\\omega_{\\max}'} /> by the splitting
			scheme BAOAB, and the drawn molecule is shown at half a unit of time a second. The averages come
			from a second copy of the molecule with the same settings and a fixed seed, run in the background
			many thousands of times faster than the one drawn, and they start again whenever a setting changes.
			Their standard errors come from the scatter of averages over blocks of a thousand steps. They stop
			after <Tex math={'5 \\times 10^{7}'} /> steps.
		</p>
	</div>
</div>

<style>
	.equipartition {
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

	.lattice {
		fill: color-mix(in srgb, var(--text) 22%, transparent);
	}

	.trail {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.spring {
		stroke: color-mix(in srgb, var(--text) 28%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.spring.side {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.mass {
		fill: color-mix(in srgb, var(--q-matter) 78%, var(--bg));
		stroke: var(--q-matter);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ring {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--text);
	}

	.centre line {
		stroke: var(--q-matter);
		stroke-width: calc(1px * var(--u, 1));
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

	.arrow-key {
		border-color: var(--text);
	}

	.trail-key {
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--q-matter) 70%, transparent);
	}

	.dot-key {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--q-matter) 78%, var(--bg));
		border: 1px solid var(--q-matter);
	}

	.lattice-key {
		display: inline-block;
		width: 1.1rem;
		height: 0.3rem;
		background: radial-gradient(
				circle,
				color-mix(in srgb, var(--text) 45%, transparent) 1.2px,
				transparent 1.5px
			)
			0 0 / 0.37rem 0.3rem repeat-x;
	}

	/* --- the gauges --------------------------------------------------------------------------- */

	.gauges {
		display: grid;
		gap: 0.45rem;
	}

	.gauges .title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text-dim);
	}

	.rows {
		display: grid;
		gap: 0.7rem;
		margin: 0.2rem 0 0;
		padding: 0;
		list-style: none;
	}

	.gauge-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
		margin-bottom: 0.3rem;
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.gauge-words {
		color: var(--text-dim);
		min-width: 0;
	}

	.gauge-value {
		flex: none;
		color: var(--text);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.gauge {
		position: relative;
		height: 0.9rem;
		border-radius: 4px;
		background: color-mix(in srgb, var(--text) 5%, transparent);
		box-shadow: inset 0 0 0 1px var(--line);
	}

	.gauge i,
	.gauge b {
		position: absolute;
		display: block;
	}

	.gauge .one {
		left: 50%;
		top: 0;
		bottom: 0;
		width: 1px;
		background: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.gauge .tick {
		top: 25%;
		bottom: 25%;
		width: 1px;
		background: color-mix(in srgb, var(--text) 22%, transparent);
	}

	.gauge .error-bar {
		top: calc(50% - 0.5px);
		height: 1px;
		background: var(--accent);
		min-width: 1px;
	}

	.gauge .dot {
		top: 50%;
		width: 0.5rem;
		height: 0.5rem;
		margin: -0.25rem 0 0 -0.25rem;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 1.5px var(--bg-sunken);
	}

	.gauge .dot.out {
		border-radius: 1px;
		transform: rotate(45deg);
	}

	.scale {
		position: relative;
		height: 1rem;
		margin: -0.15rem 0 0;
		font-size: 0.68rem;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.scale span {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
	}

	.scale span:first-child {
		transform: none;
	}

	.scale span:last-child {
		transform: translateX(-100%);
	}

	.run {
		font-size: 0.76rem;
		line-height: 1.4;
		color: var(--text);
		text-wrap: pretty;
	}

	.legend-words {
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-faint);
		text-wrap: pretty;
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
		gap: 0.6rem;
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

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover,
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

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
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
		.play,
		.action {
			transition: none;
		}
	}
</style>
