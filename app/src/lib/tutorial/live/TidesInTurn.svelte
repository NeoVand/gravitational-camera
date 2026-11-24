<script lang="ts">
	/**
	 * Chapter 13.4's tides in turn. Left, a uniform ball of 400 particles in the paper's stone, each with a short tick
	 * for its velocity, seen along its axis (from the side for the rolls). A menu picks the flow: at rest, turning
	 * rigidly, the hidden swirl (with the radius of its inner ball on a slider, marked where the angular momentum and
	 * the octupolar bracket vanish), or chapter 2.8's rolls; another picks the pair of tides, (x + iy)ⁿ/n for n = 2,
	 * 3, 4, or the quadrupole with the octupole. Two buttons kick the body with one profile and read the other, and
	 * "Both" runs both: the right panel draws each response δQ/ε against the wait τ, to 0.05 of a period, and below
	 * them their half sum (dashed) and half difference (in the colour of matter). The two orders are told apart by
	 * stroke, in the ink, for orange and blue are the tutorial's stretch and squeeze. Readouts: the bracket {Q̇_h, Q̇_g},
	 * exact (lib/hair/flow.ts for the turning flows, 36∫V_z dV for the rolls), and the measured difference over τ² at
	 * the wait set on a slider. The arithmetic is in ./tides-in-turn.ts. The chapter's try box asks the prediction, so
	 * the figure answers it in no words: it shows live values only. A run draws its curve over 1.4 s, with the body
	 * moving on the left; under reduced motion it is drawn at once.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowLeftRightIcon,
		CircleIcon,
		Hexagon01Icon,
		HourglassIcon,
		Infinity01Icon,
		Layers01Icon,
		OctagonIcon,
		PlayIcon,
		Rotate01Icon,
		RulerIcon,
		SquareIcon,
		Tornado02Icon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		INNER,
		OPENING,
		SAMPLES,
		SCALE,
		WAIT,
		body,
		clamp,
		exactBracket,
		measured,
		placesAt,
		power,
		responses,
		rollsPaths,
		shown,
		velocity,
		type Flow,
		type Order,
		type Pair,
		type Vec
	} from './tides-in-turn';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let flow = $state<Flow>(OPENING.flow);
	let pair = $state<Pair>(OPENING.pair);
	let inner = $state(OPENING.inner);
	let wait = $state(OPENING.wait);
	/** How far each order's curve is drawn, in samples; −1 if it has not been run since the flow or pair changed. */
	let drawn = $state<Record<Order, number>>({ gh: SAMPLES, hg: SAMPLES });

	/** On the step's grid; the slider's two ticks set the marked radii exactly. */
	function setInner(v: number) {
		const marked = [INNER.balanced, INNER.octupolarZero].includes(v);
		inner = marked ? v : clamp(Math.round(v / INNER.step) * INNER.step, INNER.min, INNER.max);
	}
	const setWait = (v: number) =>
		(wait = clamp(Math.round(v / WAIT.step) * WAIT.step, WAIT.min, WAIT.max));

	/** A new flow or pair clears the curves: they are drawn again only by a run. */
	function clear() {
		stop();
		drawn = { gh: -1, hg: -1 };
	}
	const setFlow = (v: Flow) => {
		if (v === flow) return;
		flow = v;
		clear();
	};
	const setPair = (v: Pair) => {
		if (v === pair) return;
		pair = v;
		clear();
	};

	// the inner radius moves the particles only in the swirl; the other flows keep the opening's body
	const particles = $derived(body(flow === 'swirl' ? inner : INNER.balanced));
	const r = $derived(responses(flow, pair, particles));
	const paths = $derived(flow === 'rolls' ? rollsPaths(particles) : undefined);
	const exact = $derived(exactBracket(flow, pair, inner));

	// --- the runs ----------------------------------------------------------------------------------------------------
	const DURATION = 1400;
	let frame = 0;

	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	}

	function run(orders: Order[]) {
		stop();
		if (prefersReducedMotion.current || typeof requestAnimationFrame === 'undefined') {
			for (const o of orders) drawn[o] = SAMPLES;
			return;
		}
		for (const o of orders) drawn[o] = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const f = Math.min(1, (now - start) / DURATION);
			for (const o of orders) drawn[o] = f * SAMPLES;
			frame = f < 1 ? requestAnimationFrame(tick) : 0;
		};
		frame = requestAnimationFrame(tick);
	}

	$effect(() => stop);

	/** The sample of the reading: the wait, or the front of a run that has not reached it. */
	const waitIndex = $derived(Math.round((wait / WAIT.max) * SAMPLES));
	const front = $derived(Math.floor(Math.max(drawn.gh, drawn.hg)));
	const anyDrawn = $derived(front >= 0);
	const reading = $derived(anyDrawn ? Math.min(waitIndex, front) : 0);
	const both = $derived(Math.min(drawn.gh, drawn.hg) >= reading && reading >= 1);
	const difference = $derived(both ? measured(flow, r, reading) : undefined);
	const readingPeriods = $derived((reading / SAMPLES) * WAIT.max);

	// --- the body ----------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const SIDE = 320;
	const C = SIDE / 2;
	const UNIT = 140;
	/** A velocity tick is TICK R long for a speed of Ω R. */
	const TICK = 0.12;
	let u = $state(1);
	const f1 = (x: number) => x.toFixed(1);

	/** Seen along the axis, x across and y up; the rolls from the side, x across and z up. */
	const side = $derived(flow === 'rolls');
	/** From the side the eye is raised by ELEVATION above the equator, so that each ring of particles reads as an ellipse. */
	const ELEVATION = (20 * Math.PI) / 180;
	const [SIN_E, COS_E] = [Math.sin(ELEVATION), Math.cos(ELEVATION)];
	const up = (q: Vec) => (side ? q[1] * SIN_E + q[2] * COS_E : q[1]);
	const project = (q: Vec): [number, number] => [C + UNIT * q[0], C - UNIT * up(q)];

	/** The order of drawing, far to near: by z seen along the axis, by −y from the side (the eye at −y). */
	const order = $derived(
		particles
			.map((p, i) => ({ i, depth: side ? p.z * SIN_E - p.y * COS_E : p.z }))
			.sort((a, b) => a.depth - b.depth)
			.map((e) => e.i)
	);

	const places = $derived(placesAt(flow, particles, reading, paths));

	const dots = $derived(
		order.map((i) => {
			const p = particles[i];
			const [x, y] = project(places[i]);
			const size = clamp(Math.sqrt(p.m * particles.length), 0.55, 1.15);
			return { i, x, y, radius: 3.2 * size };
		})
	);

	/** All the velocity ticks as one path, from each particle along its velocity. */
	const ticks = $derived.by(() => {
		if (flow === 'rest') return '';
		let d = '';
		for (const i of order) {
			const q = places[i];
			const v = velocity(flow, particles[i], q);
			const [x, y] = project(q);
			const [dx, dy] = [v[0], -up(v)];
			d += `M${f1(x)},${f1(y)}l${f1(TICK * UNIT * dx)},${f1(TICK * UNIT * dy)}`;
		}
		return d;
	});

	// --- the plots ---------------------------------------------------------------------------------------------------
	const PW = 360;
	const LEFT = 44;
	const RIGHT = PW - 10;
	const PLOT_H = 112;
	const TOP = [24, 24 + PLOT_H + 40];
	const PH = TOP[1] + PLOT_H + 42;
	let pu = $state(1);

	const X = (k: number) => LEFT + ((RIGHT - LEFT) * k) / SAMPLES;
	const Y = (plot: number, v: number) =>
		TOP[plot] + PLOT_H / 2 - (PLOT_H / 2) * clamp(v / (1.2 * SCALE[pair]), -1.04, 1.04);

	function curve(plot: number, values: (k: number) => number, upTo: number) {
		if (upTo < 0) return '';
		let d = '';
		for (let k = 0; k <= Math.min(SAMPLES, Math.floor(upTo)); k++)
			d += `${k ? 'L' : 'M'}${f1(X(k))},${Y(plot, values(k)).toFixed(2)}`;
		return d;
	}

	const lower = $derived(Math.min(drawn.gh, drawn.hg));
	const curves = $derived({
		gh: curve(0, (k) => r.gh[k], drawn.gh),
		hg: curve(0, (k) => r.hg[k], drawn.hg),
		sum: curve(1, (k) => (r.gh[k] + r.hg[k]) / 2, lower),
		half: curve(1, (k) => (r.gh[k] - r.hg[k]) / 2, lower)
	});

	const TAU_TICKS = [0, 0.01, 0.02, 0.03, 0.04, 0.05];
	const yTicks = $derived([-SCALE[pair], 0, SCALE[pair]]);
	const tickLabel = (v: number) => (v === 0 ? '0' : shown(v).replace(/0+$/, ''));

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const K_TEX = `K = 3${M}\\Omega/32\\pi`;
	const BRACKET = '\\{\\htmlClass{q-matter}{\\dot Q_h}, \\htmlClass{q-matter}{\\dot Q_g}\\}';
	const DIFFERENCE =
		'(\\delta_g\\htmlClass{q-matter}{Q_h} - \\delta_h\\htmlClass{q-matter}{Q_g})/\\epsilon\\tau^2';

	const bracketUnit = $derived(side ? `KR^{${power(pair)}}` : `${M}\\Omega R^{${power(pair)}}`);
	const responseUnit = $derived(`${M}R^{${power(pair)}}/\\Omega`);

	const PROFILE_TEX: Record<Pair, string> = {
		quad: 'h + ig = \\tfrac12(x + iy)^2',
		oct: 'h + ig = \\tfrac13(x + iy)^3',
		four: 'h + ig = \\tfrac14(x + iy)^4',
		mixed: 'h = z^2 - \\tfrac12(x^2 + y^2), \\quad g = z^3 - \\tfrac32z(x^2 + y^2)'
	};

	const FLOWS = $derived([
		{ value: 'rest' as const, label: 'At rest', icon: CircleIcon },
		{
			value: 'rigid' as const,
			label: phone.current ? 'Rigidly' : 'Turning rigidly',
			icon: Rotate01Icon
		},
		{
			value: 'swirl' as const,
			label: phone.current ? 'Hidden swirl' : 'The hidden swirl',
			icon: Tornado02Icon
		},
		{ value: 'rolls' as const, label: 'Rolls', icon: Infinity01Icon }
	]);
	const PAIRS = $derived([
		{ value: 'quad' as const, label: 'Quadrupolar', icon: SquareIcon },
		{ value: 'oct' as const, label: 'Octupolar', icon: Hexagon01Icon },
		{ value: 'four' as const, label: 'Degree four', icon: OctagonIcon },
		{
			value: 'mixed' as const,
			label: 'Quadrupole with octupole',
			icon: Layers01Icon,
			wide: true
		}
	]);

	const FLOW_WORDS: Record<Flow, string> = {
		rest: 'at rest',
		rigid: 'turning rigidly',
		swirl: 'with the hidden swirl',
		rolls: 'with the rolls'
	};

	const bodyLabel = $derived(
		`A uniform ball of 400 particles ${FLOW_WORDS[flow]}, seen ${side ? 'from the side and a little above, its axis up the page' : 'along its axis'}` +
			(flow === 'swirl'
				? `; the inner ball, out to ${inner.toFixed(3)} R, turns anticlockwise and the rest clockwise`
				: '') +
			(flow === 'rest' ? '.' : '; a tick on each particle gives its velocity.') +
			(reading > 0 ? ` Drawn ${readingPeriods.toFixed(3)} of a period after the kick.` : '')
	);

	const plotLabel = $derived.by(() => {
		const parts: string[] = [];
		const k = reading;
		if (drawn.gh >= k && drawn.gh >= 0) parts.push(`kick g, read h: ${shown(r.gh[k])}`);
		if (drawn.hg >= k && drawn.hg >= 0) parts.push(`kick h, read g: ${shown(r.hg[k])}`);
		return (
			`The responses δQ/ε against the wait τ, from 0 to 0.05 of a period, in M R^${power(pair)}/Ω. ` +
			(parts.length
				? `At τ = ${readingPeriods.toFixed(3)} of a period, ${parts.join('; ')}.`
				: 'No order has been run yet.')
		);
	});
</script>

<div class="tides-in-turn">
	<div class="panels">
		<section class="panel" aria-label="The body">
			<div class="stage">
				<p class="heading">
					{side
						? 'The body seen from the side and a little above, its axis up the page'
						: 'The body seen along its axis'}
				</p>
				<svg
					viewBox="0 0 {SIDE} {SIDE}"
					role="img"
					aria-label={bodyLabel}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<radialGradient id="{uid}-stone" cx="0.38" cy="0.34" r="0.75">
							<stop offset="0" class="stone-0" />
							<stop offset="0.65" class="stone-1" />
							<stop offset="1" class="stone-2" />
						</radialGradient>
					</defs>
					<circle class="ball" cx={C} cy={C} r={UNIT} />
					{#if side}
						<line
							class="axis"
							x1={C}
							x2={C}
							y1={C - (UNIT + 12 * u) * COS_E}
							y2={C + (UNIT + 12 * u) * COS_E}
						/>
					{/if}
					{#each dots as dot (dot.i)}
						<circle
							class="stone"
							cx={f1(dot.x)}
							cy={f1(dot.y)}
							r={dot.radius}
							fill="url(#{uid}-stone)"
						/>
					{/each}
					<path class="tick" d={ticks} />
					{#if flow === 'swirl'}
						<circle class="edge" cx={C} cy={C} r={inner * UNIT} />
					{/if}
					{#if !side}
						<circle class="axis-dot" cx={C} cy={C} r={2.2 * u} />
					{/if}
				</svg>
				<p class="where" aria-hidden="true"><Tex math={PROFILE_TEX[pair]} /></p>
				<ul class="legend" aria-hidden="true">
					<li><span class="swatch stone-key"></span>a particle, its area as its mass</li>
					{#if flow !== 'rest'}
						<li>
							<span class="swatch tick-key"></span><span
								>its velocity, {TICK} <i>R</i> long for <i>ΩR</i></span
							>
						</li>
					{/if}
					{#if flow === 'swirl'}
						<li><span class="swatch edge-key"></span>where the inner ball ends</li>
					{/if}
				</ul>
			</div>
		</section>

		<section class="panel plots" aria-label="The two readings against the wait">
			<svg
				viewBox="0 0 {PW} {PH}"
				role="img"
				aria-label={plotLabel}
				{@attach fitText((value) => (pu = value))}
			>
				<defs>
					{#each TOP as top, plot (plot)}
						<clipPath id="{uid}-plot-{plot}">
							<rect x={LEFT} y={top - 2} width={RIGHT - LEFT} height={PLOT_H + 4} />
						</clipPath>
					{/each}
				</defs>
				{#each TOP as top, plot (plot)}
					<text class="title" x={LEFT} y={top - 9 * pu}
						>{plot === 0
							? 'The two readings, δQ/ε'
							: 'Half their sum and half their difference'}</text
					>
					<rect class="frame" x={LEFT} y={top} width={RIGHT - LEFT} height={PLOT_H} rx="4" />
					{#each yTicks as v (v)}
						<line
							class={['grid', { zero: v === 0 }]}
							x1={LEFT}
							x2={RIGHT}
							y1={Y(plot, v)}
							y2={Y(plot, v)}
						/>
						<text class="y-tick" x={LEFT - 5 * pu} y={Y(plot, v)}>{tickLabel(v)}</text>
					{/each}
					{#each TAU_TICKS as t (t)}
						<line
							class="grid"
							x1={X((t / WAIT.max) * SAMPLES)}
							x2={X((t / WAIT.max) * SAMPLES)}
							y1={top}
							y2={top + PLOT_H}
						/>
					{/each}
				{/each}

				<g clip-path="url(#{uid}-plot-0)">
					<path class="curve gh" d={curves.gh} />
					<path class="curve hg" d={curves.hg} />
				</g>
				<g clip-path="url(#{uid}-plot-1)">
					<path class="curve sum" d={curves.sum} />
					<path class="curve half" d={curves.half} />
				</g>

				{#if anyDrawn && reading > 0}
					{#each TOP as top, plot (plot)}
						<line class="cursor" x1={X(reading)} x2={X(reading)} y1={top} y2={top + PLOT_H} />
					{/each}
					{#if drawn.gh >= reading}
						<circle class="dot" cx={X(reading)} cy={Y(0, r.gh[reading])} r={2.6 * pu} />
					{/if}
					{#if drawn.hg >= reading}
						<circle class="dot hollow" cx={X(reading)} cy={Y(0, r.hg[reading])} r={2.6 * pu} />
					{/if}
					{#if lower >= reading}
						<circle
							class="dot matter"
							cx={X(reading)}
							cy={Y(1, (r.gh[reading] - r.hg[reading]) / 2)}
							r={2.6 * pu}
						/>
					{/if}
				{/if}

				{#each TAU_TICKS as t (t)}
					<text class="x-tick" x={X((t / WAIT.max) * SAMPLES)} y={TOP[1] + PLOT_H + 13 * pu}
						>{t === 0 ? '0' : t.toFixed(2)}</text
					>
				{/each}
				<text class="x-title" x={(LEFT + RIGHT) / 2} y={TOP[1] + PLOT_H + 30 * pu}
					>the wait <tspan class="it">τ</tspan>, in periods 2π/<tspan class="it">Ω</tspan></text
				>
			</svg>
			<p class="units">δQ/ε in <Tex math={responseUnit} trust /></p>
			<ul class="legend" aria-hidden="true">
				<li><span class="swatch gh-key"></span><span>kick <i>g</i>, read <i>h</i></span></li>
				<li><span class="swatch hg-key"></span><span>kick <i>h</i>, read <i>g</i></span></li>
				<li><span class="swatch sum-key"></span>half their sum</li>
				<li><span class="swatch half-key"></span>half their difference</li>
			</ul>

			<dl class="readouts">
				<div>
					<dt>The bracket <Tex math={BRACKET} trust />, exact</dt>
					<dd><span class="number">{shown(exact)}</span> <Tex math={bracketUnit} trust /></dd>
				</div>
				<div>
					<dt>
						<Tex math={DIFFERENCE} trust />, at <Tex math="\tau" /> = {readingPeriods.toFixed(3)} of a
						period
					</dt>
					<dd>
						{#if difference !== undefined}
							<span class="number matter">{shown(difference)}</span>
							<Tex math={bracketUnit} trust />
						{:else}
							<span class="wanting">run both orders</span>
						{/if}
					</dd>
				</div>
			</dl>
		</section>
	</div>

	<div class="bar">
		<div class="choices">
			<Segmented label="The flow" options={FLOWS} bind:value={() => flow, setFlow} />
			<Segmented label="The pair of tides" options={PAIRS} bind:value={() => pair, setPair} />
		</div>
		<div class="sliders">
			{#if flow === 'swirl'}
				<Slider
					id="{uid}-inner"
					label="Radius of the inner ball"
					icon={RulerIcon}
					min={INNER.min}
					max={INNER.max}
					step={INNER.step}
					bind:value={() => inner, setInner}
					readout="{inner.toFixed(3)} R"
					marks={[
						{ at: INNER.balanced, label: 'no angular momentum' },
						{ at: INNER.octupolarZero, label: 'octupolar zero' }
					]}
					marksHint="the ticks mark two radii worth trying"
				/>
			{/if}
			<Slider
				id="{uid}-wait"
				label="The wait, τ"
				icon={HourglassIcon}
				min={WAIT.min}
				max={WAIT.max}
				step={WAIT.step}
				bind:value={() => wait, setWait}
				readout="{wait.toFixed(3)} periods"
			/>
		</div>
		<div class="actions">
			<button type="button" class="action" onclick={() => run(['gh'])}>
				<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
				Kick g, read h
			</button>
			<button type="button" class="action" onclick={() => run(['hg'])}>
				<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
				Kick h, read g
			</button>
			<button type="button" class="action" onclick={() => run(['gh', 'hg'])}>
				<HugeiconsIcon icon={ArrowLeftRightIcon} size={16} strokeWidth={1.7} />
				Both
			</button>
		</div>
		<p class="hint">
			Each button kicks the body at <i>τ</i> = 0 with one profile and draws the other’s reading against
			the wait; a new flow or pair clears the curves. Tab reaches every control; the sliders take the
			arrow keys.
		</p>
	</div>

	<p class="note">
		Exact: the brackets, lib/hair/flow.ts’s for the pairs <Tex math="(x + iy)^n/n" /> on the turning flows
		and <Tex math="36\int V_z\,\mathrm dV = (384\pi/35)KR^3" /> for the rolls; and the responses, to first
		order in <Tex math="\epsilon" /> with no <Tex math="\epsilon" /> chosen, of 400 particles at Gauss–Legendre
		nodes, five in radius in the inner ball and five in the rest, four in the cosine of the angle from
		the axis, so that their sums give the ball’s integrals behind every bracket here. Each particle of
		a turning flow is held on its circle by a pull toward the axis in proportion to its distance, as strong
		as its own turning needs, which makes its response a closed form; the particles of the rolls are held
		on the steady flow by the force <Tex math="m(\boldsymbol v\cdot\nabla)\boldsymbol v" />
		that keeps it steady, and their motion and its first-order change come from velocity Verlet, 400 steps
		to the longest wait. For the rolls <Tex math={K_TEX} trust />, so that
		<Tex math="\Omega" /> is their speed at the centre over <Tex math="R" />. Schematic: the body is
		drawn as it moves without the kick, every particle projected onto the page, its area in
		proportion to its mass (the innermost, lightest ones enlarged), and the ticks at one scale.
	</p>
</div>

<style>
	.tides-in-turn {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panels {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.7rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.45rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
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
		pointer-events: none;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	/* --- the body ---------------------------------------------------------------------------- */

	.ball {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.axis-dot {
		fill: var(--text);
	}

	/* the paper's stone: the colour of matter in the grey of the ink */
	.stone {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(0.5px * var(--u, 1));
	}

	.stone-0 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 55%,
			color-mix(in srgb, var(--text) 62%, var(--bg))
		);
	}

	.stone-1 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 38%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
	}

	.stone-2 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 22%,
			color-mix(in srgb, var(--text) 24%, var(--bg))
		);
	}

	/* a velocity is neither a mass nor a tide: the ink */
	.tick {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 80%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linecap: round;
	}

	.edge {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.where {
		margin: 0.45rem 0 0;
		font-size: 0.8rem;
		color: var(--text-dim);
		text-align: center;
	}

	/* --- the plots --------------------------------------------------------------------------- */

	.plots {
		padding: 0.6rem 0.9rem 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.title {
		font-size: calc(11.5px * var(--u, 1));
		font-weight: 500;
		fill: var(--text-dim);
	}

	.frame {
		fill: color-mix(in srgb, var(--text) 2.5%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.zero {
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
	}

	.y-tick,
	.x-tick,
	.x-title {
		font-size: calc(10.5px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
	}

	.x-tick,
	.x-title {
		text-anchor: middle;
		dominant-baseline: hanging;
	}

	.curve {
		fill: none;
		stroke-linejoin: round;
	}

	/* the two orders, told apart by stroke in the ink: orange and blue are stretch and squeeze */
	.curve.gh {
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.curve.hg {
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
		stroke-dasharray: 0 calc(4px * var(--u, 1));
	}

	.curve.sum {
		stroke: var(--text-dim);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(6px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	/* the half difference weighs the flow: the colour of matter */
	.curve.half {
		stroke: var(--q-matter);
		stroke-width: calc(2.2px * var(--u, 1));
	}

	.cursor {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
	}

	.dot.hollow {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.dot.matter {
		fill: var(--q-matter);
	}

	.units {
		margin: 0;
		font-size: 0.74rem;
		color: var(--text-dim);
	}

	/* --- the legends ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.4rem 0.2rem 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		line-height: 1.3;
		color: var(--text-dim);
	}

	.plots .legend {
		margin: 0;
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		flex: none;
		display: inline-block;
		width: 1.2rem;
		height: 0;
		border-top: 1.4px solid var(--text);
	}

	.stone-key {
		width: 0.55rem;
		height: 0.55rem;
		border: 0.5px solid color-mix(in srgb, var(--text) 40%, transparent);
		border-radius: 50%;
		background: radial-gradient(
			circle at 38% 34%,
			color-mix(in srgb, var(--q-matter) 55%, color-mix(in srgb, var(--text) 62%, var(--bg))),
			color-mix(in srgb, var(--q-matter) 22%, color-mix(in srgb, var(--text) 24%, var(--bg)))
		);
	}

	.tick-key {
		width: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--text) 80%, transparent);
	}

	.edge-key {
		border-top: 1.2px dashed var(--text);
	}

	.hg-key {
		height: 2px;
		border: 0;
		background: radial-gradient(circle, var(--text) 0 1px, transparent 1.2px) 0 50% / 4px 2px
			repeat-x;
	}

	.sum-key {
		border-top: 1.3px dashed var(--text-dim);
	}

	.half-key {
		border-top: 2.2px solid var(--q-matter);
	}

	/* --- the readings -------------------------------------------------------------------------- */

	.readouts {
		display: grid;
		gap: 0.5rem;
		margin: 0.2rem 0 0;
		padding-top: 0.55rem;
		border-top: 1px solid var(--line);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.readouts div {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	dt {
		margin: 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	dd {
		margin: 0;
		text-align: right;
		white-space: nowrap;
	}

	.number {
		font-size: 1.05rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.number.matter {
		color: var(--q-matter);
	}

	.wanting {
		font-size: 0.74rem;
		color: var(--text-faint);
		white-space: normal;
	}

	/* --- the controls and the note ----------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.choices {
		display: grid;
		gap: 0.6rem;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.action {
		flex: 1 1 auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.3rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.76rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		touch-action: manipulation;
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

	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.note {
		margin: 0;
		padding: 0.7rem 0.9rem 0.85rem;
		border-top: 1px solid var(--line);
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}

	@media (max-width: 680px) {
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.stage svg {
			max-width: 24rem;
			margin: 0 auto;
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.plots {
			padding: 0.6rem 0.6rem 0.75rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
