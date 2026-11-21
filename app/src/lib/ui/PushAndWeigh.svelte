<script lang="ts">
	/**
	 * Push and weigh (lib/hair/ladder.ts): two round bodies with the same mass and the same field outside, cut
	 * through their centres; round each the lobes of the tide that pushes it; under each the energy it gains, exact
	 * and summed over the particles, and what the weighings read of it. With them the ladder: what a reading at one
	 * time and a tide of each degree give of the two. The dots are the particles of the simulation that lie near the
	 * plane of the cut, each with the velocity the push gives it; on a push they move along it, and come back.
	 */
	import { cubicInOut, cubicOut, linear } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import type { Vec3 } from '../pixel/complex';
	import {
		DEGREES,
		PARTICLES,
		TIDE_NAMES,
		energyGained,
		exactEnergy,
		placesFor,
		push as impulse,
		radialMoment,
		sameReading,
		sampleBody,
		type Body,
		type Experiment,
		type Particle
	} from '../hair/ladder';

	interface Props {
		/** the two bodies: the same mass, and so the same field outside */
		a: Body;
		b: Body;
		/** the degree of the tide */
		degree: number;
		/** what the weighings after the pushes read, and what they say of the two (pushAndWeigh) */
		weighed: Experiment;
		/** a push is made: the page weighs again, with new noise */
		onpush: () => void;
	}

	let { a, b, degree, weighed, onpush }: Props = $props();

	const U = 92; // drawing units for the outer radius R
	const SLAB = 0.017; // the cut shows the particles this near its plane, as a part of their shell's radius
	const REACH = 0.12; // how far a particle of unit velocity is drawn from its place, in units of R: exaggerated
	const INNER = 1.16 * U; // where the tide's lobes begin
	const DEPTH = 0.3 * U; // and how far out they reach
	const LAST = 1200; // milliseconds a push takes to show

	// --- the bodies, as particles ------------------------------------------------------------------------------------

	interface Dot {
		/** the particle's place in the simulation */
		id: number;
		/** where it is drawn at rest */
		x: number;
		y: number;
		/** how far a push carries it, drawn */
		dx: number;
		dy: number;
		/** its radius as drawn: a point at the centre is drawn larger, by its mass */
		r: number;
		/** which way the push sends it, along the radius */
		way: 'out' | 'in' | 'across' | 'still';
	}

	/** A length of the drawing, to a hundredth of a unit. */
	const drawn = (length: number) => Math.round(100 * length) / 100;

	/** The particles within the cut, as dots, with what a push of these velocities does to each. */
	function cut(particles: Particle[], velocities: Vec3[]): Dot[] {
		return particles.flatMap((p, id): Dot[] => {
			const [x, y, z] = p.position;
			const radius = Math.hypot(x, y, z);
			if (Math.abs(z) > SLAB * radius) return [];
			const [vx, vy] = velocities[id];
			const speed = Math.hypot(vx, vy);
			const outward = speed ? (x * vx + y * vy) / (radius * speed) : 0;
			return [
				{
					id,
					// the drawing's y runs down the page
					x: drawn(U * x),
					y: drawn(-U * y),
					dx: drawn(U * REACH * vx),
					dy: drawn(-U * REACH * vy),
					r: radius ? 2.2 : 4 + 5 * Math.cbrt(p.mass),
					way: !speed ? 'still' : outward > 0.25 ? 'out' : outward < -0.25 ? 'in' : 'across'
				}
			];
		});
	}

	/** One body under the tide: the energy it gains, exact and summed over its particles, and its cut as drawn. */
	function pushed(body: Body, particles: Particle[]) {
		const velocities = impulse(particles, degree, 1);
		return {
			exact: exactEnergy(body, degree),
			simulated: energyGained(particles, velocities),
			shells: body.shells.filter((shell) => shell.radius > 0).map((shell) => U * shell.radius),
			dots: cut(particles, velocities)
		};
	}

	const particlesA = $derived(sampleBody(a, PARTICLES));
	const particlesB = $derived(sampleBody(b, PARTICLES));
	const pushedA = $derived(pushed(a, particlesA));
	const pushedB = $derived(pushed(b, particlesB));
	const sides = $derived([
		{ letter: 'A', body: a, ...pushedA, weighing: weighed.a },
		{ letter: 'B', body: b, ...pushedB, weighing: weighed.b }
	]);

	// --- the tide, round each body -----------------------------------------------------------------------------------

	/** A point of the drawing at radius r and angle phi, with y up the page. */
	const at = (r: number, phi: number) =>
		`${(r * Math.cos(phi)).toFixed(1)},${(-r * Math.sin(phi)).toFixed(1)}`;

	/**
	 * The 2l lobes of the tide of degree l round a body: g_l goes as cos(l phi), and where it is positive the push is
	 * outward, where negative inward. Each lobe is its outline and an arrow along its middle.
	 */
	const lobes = $derived(
		Array.from({ length: 2 * degree }, (_, id) => {
			const middle = (id * Math.PI) / degree;
			const half = Math.PI / (2 * degree);
			const outward = id % 2 === 0;
			const STEPS = 14;
			const outer: string[] = [];
			const inner: string[] = [];
			for (let i = 0; i <= STEPS; i++) {
				const t = (2 * i) / STEPS - 1;
				outer.push(at(INNER + DEPTH * Math.cos((t * Math.PI) / 2), middle + t * half));
				if (i > 0 && i < STEPS) inner.unshift(at(INNER, middle + t * half));
			}
			// the arrow, within the lobe: a shaft along the radius, and a head of two barbs set back from its tip
			const [tail, tip] = outward ? [INNER + 5, INNER + DEPTH - 5] : [INNER + DEPTH - 7, INNER + 3];
			const back = tip + (outward ? -5.5 : 5.5);
			const barb = (side: number) => at(Math.hypot(back, side), middle + Math.atan2(side, back));
			return {
				id,
				outward,
				outline: `M${[...outer, ...inner].join('L')}Z`,
				arrow: `M${at(tail, middle)}L${at(back, middle)}M${at(tip, middle)}L${barb(3)}L${barb(-3)}Z`
			};
		})
	);

	// --- a push, shown ---------------------------------------------------------------------------------------------------

	/** Where a push stands, from 0 as it is given to 1 with the particles back in their places. */
	const clock = new Tween(1, { duration: LAST, easing: linear });

	/** Out to the full reach, a pause there, and back: quick at first, as after an impulse. */
	function outAndBack(u: number): number {
		if (u < 0.4) return cubicOut(u / 0.4);
		if (u < 0.55) return 1;
		return 1 - cubicInOut((u - 0.55) / 0.45);
	}

	/** How far along its velocity each particle is drawn, 0 at rest to 1. */
	const moved = $derived(outAndBack(clock.current));
	/** The tide is lit while it acts, at the start of a push. */
	const lit = $derived(Math.max(0, 1 - clock.current / 0.3));

	/** Push both bodies: the page weighs them again, and the particles are shown moving, unless motion is unwanted. */
	export function push() {
		onpush();
		if (prefersReducedMotion.current) return;
		clock.set(0, { duration: 0 });
		clock.set(1);
	}

	// --- the energy gained, and the weighings -----------------------------------------------------------------------------

	/**
	 * The scale the two tracks share: from below nothing to above the larger gain, with room at each end for four
	 * standard errors of a mean.
	 */
	const span = $derived.by(() => {
		const top = Math.max(pushedA.exact, pushedB.exact);
		const room = Math.max(4 * weighed.a.error, 4 * weighed.b.error, 0.08 * top, 1e-12);
		return { low: -room, high: top + room };
	});
	/** Where an energy falls along a track, in per cent. */
	const along = (energy: number) =>
		(100 * (Math.min(span.high, Math.max(span.low, energy)) - span.low)) / (span.high - span.low);

	/** A number to so many places, with a true minus sign and no negative zero. */
	function fixed(x: number, places: number): string {
		const digits = Math.abs(x).toFixed(places);
		return x < 0 && Number(digits) !== 0 ? `−${digits}` : digits;
	}

	/** What the weighings say, in a sentence. */
	const verdict = $derived.by(() => {
		if (weighed.error === 0)
			return `With no noise the two weighings ${weighed.apart ? 'differ' : 'agree'}.`;
		const pushes = weighed.a.readings.length;
		const what =
			pushes === 1
				? 'After one push of each, the two weighings differ'
				: `After ${pushes} pushes of each, the two means differ`;
		const short = weighed.apart ? '' : ', fewer than three';
		return `${what} by ${weighed.sigmas.toFixed(1)} standard errors of their difference${short}.`;
	});

	// --- the ladder ------------------------------------------------------------------------------------------------------

	const mass = $derived({
		a: radialMoment(a, 0),
		b: radialMoment(b, 0),
		same: sameReading(a, b, 1)
	});
	const rungs = $derived(
		DEGREES.map((l) => ({
			degree: l,
			/** its name, where it has one of its own */
			name: TIDE_NAMES[l].startsWith('degree') ? '' : TIDE_NAMES[l],
			a: exactEnergy(a, l),
			b: exactEnergy(b, l),
			same: sameReading(a, b, l)
		}))
	);
</script>

<div class="frame" data-testid="push-and-weigh">
	<div class="figure">
		<div class="bodies">
			{#each sides as side (side.letter)}
				{@const w = side.weighing}
				{@const places = placesFor(w.error)}
				<section
					class="body"
					aria-label="Body {side.letter}: {side.body.name}"
					data-body={side.letter}
				>
					<p class="caption"><span class="letter">{side.letter}</span> {side.body.name}</p>
					<svg
						class="cut"
						viewBox="-150 -150 300 300"
						role="img"
						aria-label="Body {side.letter} cut through its centre, with the {2 *
							degree} lobes of the tide of degree {degree} round it"
					>
						<g class="tide" style:--lit={lit}>
							{#each lobes as lobe (lobe.id)}
								<path d={lobe.outline} class={['lobe', lobe.outward ? 'out' : 'in']} />
								<path d={lobe.arrow} class={['arrow', lobe.outward ? 'out' : 'in']} />
							{/each}
						</g>
						<circle r={U} class="rim" />
						{#each side.shells as radius, i (i)}
							<circle r={radius} class="shell" />
						{/each}
						{#each side.dots as dot (dot.id)}
							{#if dot.way !== 'still'}
								<line
									x1={dot.x}
									y1={dot.y}
									x2={dot.x + dot.dx}
									y2={dot.y + dot.dy}
									class={['velocity', dot.way]}
								/>
							{/if}
						{/each}
						{#each side.dots as dot (dot.id)}
							<circle
								cx={dot.x + moved * dot.dx}
								cy={dot.y + moved * dot.dy}
								r={dot.r}
								class="particle"
							/>
						{/each}
					</svg>
					<div class="energy">
						<p class="label">Energy gained</p>
						<div
							class="track"
							role="img"
							aria-label="Body {side.letter} gains {fixed(
								side.exact,
								5
							)}; its weighings read {fixed(w.mean, places)}, give or take {fixed(w.error, places)}"
						>
							<i
								class="gained"
								style:left="{along(0)}%"
								style:width="{along(side.exact) - along(0)}%"
							></i>
							<i class="nothing" style:left="{along(0)}%"></i>
							<i
								class="error"
								style:left="{along(w.mean - w.error)}%"
								style:width="{along(w.mean + w.error) - along(w.mean - w.error)}%"
							></i>
							<i class="mean" style:left="{along(w.mean)}%"></i>
						</div>
					</div>
					<!-- the bar is the exact gain, the mark the mean of the weighings with its standard error -->
					<dl class="numbers">
						<div>
							<dt><i class="key bar"></i>exact</dt>
							<dd data-testid="exact">{fixed(side.exact, 5)}</dd>
						</div>
						<div>
							<dt>simulated</dt>
							<dd data-testid="simulated">{fixed(side.simulated, 5)}</dd>
						</div>
						<div>
							<dt><i class="key mark"></i>weighed</dt>
							<dd data-testid="weighed">{fixed(w.mean, places)} ± {fixed(w.error, places)}</dd>
						</div>
					</dl>
				</section>
			{/each}
			<p class="note">
				The dots are particles of the shells, near the plane of the cut; the lines are the
				velocities a push gives them, <span class="out">outward</span> or
				<span class="in">inward</span>. The motion is drawn exaggerated.
			</p>
		</div>

		<div class="side">
			<div class="act">
				<button type="button" class="push" onclick={push}>Push</button>
				<p class="verdict" aria-live="polite" data-testid="verdict" data-apart={weighed.apart}>
					<strong class={{ apart: weighed.apart }}
						>{weighed.apart ? 'Told apart.' : 'Not told apart.'}</strong
					>
					{verdict}
				</p>
			</div>
			<table class="ladder">
				<caption>The ladder</caption>
				<thead>
					<tr>
						<th scope="col">What is read</th>
						<th scope="col">A</th>
						<th scope="col">B</th>
						<th scope="col"><span class="unseen">The two are</span></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">The field outside<span class="more">, at one time</span>: the mass</th>
						<td>{fixed(mass.a, 4)}</td>
						<td>{fixed(mass.b, 4)}</td>
						<td class={{ different: !mass.same }}>{mass.same ? 'the same' : 'different'}</td>
					</tr>
					{#each rungs as rung (rung.degree)}
						<tr
							class={{ chosen: rung.degree === degree }}
							aria-current={rung.degree === degree ? 'true' : undefined}
							data-degree={rung.degree}
						>
							<th scope="row"
								>Tide of degree {rung.degree}{#if rung.name}<span class="more">, {rung.name}</span
									>{/if}</th
							>
							<td>{fixed(rung.a, 4)}</td>
							<td>{fixed(rung.b, 4)}</td>
							<td class={{ different: !rung.same }}>{rung.same ? 'the same' : 'different'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="note">
				Under a tide: the energy gained from one push of strength <i>ε</i>, in units of
				<i>ε</i><sup>2</sup><i>MR</i><sup>2<i>l</i>−2</sup>. The mass is in units of <i>M</i>.
			</p>
		</div>
	</div>
</div>

<style>
	/* the stage: the theme's ground and ink, so that the figure is right on either theme */
	.frame {
		position: absolute;
		container-type: size;
		inset: 0;
		display: flex;
		overflow: auto;
		padding: var(--stage-pad, 1.5rem 1.2rem 1.6rem);
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 70%);
		color: var(--text);
		font: 400 0.78rem/1.4 var(--font-sans);
		scrollbar-width: thin;
		scrollbar-color: var(--line-strong) transparent;
	}

	/* one column: the bodies, and under them the verdict and the ladder. Where the frame is too short for all of
	   it, the drawings keep a least size and the frame scrolls */
	.figure {
		/* the side of a body's drawing: what the frame's width and height leave it, unless whoever frames the
		   figure sets it, as --figure-width */
		--cut: var(--figure-width, clamp(8rem, min(46cqw, 100cqh - 30rem), 23rem));
		margin: auto;
		display: grid;
		gap: 0.9rem;
		width: min(100%, max(2 * var(--cut) + 1rem, 21rem));
	}

	.bodies {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(4, auto);
		gap: 0.4rem 1rem;
	}

	/* the two bodies share their rows, so that what is under one lines up with what is under the other */
	.body {
		grid-row: span 4;
		display: grid;
		grid-template-rows: subgrid;
		justify-items: center;
		min-width: 0;
	}

	/* the verdict and the ladder: a container of its own, so that the ladder can go by the width it is given */
	.side {
		container-type: inline-size;
		display: grid;
		gap: 0.6rem;
		justify-self: center;
		width: min(100%, 30rem);
	}

	/* a frame with room beside the bodies: the verdict and the ladder go there */
	@container (min-width: 50rem) and ((max-height: 46rem) or (min-aspect-ratio: 3 / 2)) {
		.figure {
			--cut: var(--figure-width, clamp(8rem, min(29cqw, 100cqh - 13.5rem), 24rem));
			grid-template-columns: auto minmax(17rem, 24rem);
			align-items: center;
			column-gap: clamp(1.4rem, 3.5cqw, 3.2rem);
			width: auto;
			max-width: 100%;
		}

		.bodies {
			width: calc(2 * var(--cut) + 1rem);
		}
	}

	p {
		margin: 0;
		text-wrap: pretty;
	}

	/* --- a body ---------------------------------------------------------------------- */

	.caption {
		align-self: end;
		color: var(--text-dim);
		font-size: 0.76rem;
		line-height: 1.3;
		text-align: center;
		text-wrap: balance;
	}

	.letter {
		margin-right: 0.25em;
		color: var(--text);
		font: italic 400 1.3rem/1 var(--font-serif);
	}

	.cut {
		width: var(--cut);
		height: auto;
		overflow: visible;
	}

	.rim {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--line-strong);
		stroke-dasharray: 3 4;
	}

	.shell {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.velocity {
		stroke: var(--text-dim);
		stroke-width: 1.4;
		stroke-linecap: round;
	}

	.particle {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: 0.8;
	}

	/* the tide: orange where it pushes outward, blue where inward, as in the tidal readings of the demos */
	.lobe {
		fill-opacity: calc(0.14 + 0.3 * var(--lit));
		stroke-opacity: calc(0.55 + 0.45 * var(--lit));
	}

	.arrow {
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.lobe.out,
	.arrow.out {
		fill: var(--accent);
		stroke: var(--accent);
	}

	.lobe.in,
	.arrow.in {
		fill: var(--accent-2);
		stroke: var(--accent-2);
	}

	.velocity.out {
		stroke: var(--accent);
	}

	.velocity.in {
		stroke: var(--accent-2);
	}

	.out {
		color: var(--accent);
	}

	.in {
		color: var(--accent-2);
	}

	/* --- the energy gained: a bar for the exact gain, a mark with whiskers for the weighings -------- */

	.energy {
		width: min(100%, var(--cut));
	}

	.label {
		margin-bottom: 0.3rem;
		color: var(--text-faint);
		font-size: 0.7rem;
	}

	.track {
		position: relative;
		height: 0.85rem;
		border-radius: 3px;
		background: color-mix(in srgb, var(--text) 7%, transparent);
	}

	.track i {
		position: absolute;
		transition:
			left 0.25s,
			width 0.25s;
	}

	.gained {
		top: 0;
		bottom: 0;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.nothing {
		top: -3px;
		bottom: -3px;
		width: 1px;
		background: var(--text-dim);
	}

	/* the whiskers: a line with a cap at each end */
	.error {
		top: 1px;
		bottom: 1px;
		border-inline: 2px solid var(--accent);
		background: linear-gradient(var(--accent), var(--accent)) center / 100% 2px no-repeat;
	}

	.mean {
		top: 50%;
		width: 0.56rem;
		height: 0.56rem;
		translate: -50% -50%;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 1.5px var(--bg-sunken);
	}

	.numbers {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.05rem 0.9rem;
		width: min(100%, var(--cut));
		margin: 0;
		align-self: start;
	}

	/* a name and its number stay whole; where both do not fit a line, the number goes under its name */
	.numbers div {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		gap: 0 0.4rem;
	}

	.numbers dt {
		color: var(--text-faint);
		font-size: 0.7rem;
		white-space: nowrap;
	}

	/* which of the numbers the bar is, and which the mark */
	.key {
		display: inline-block;
		margin-right: 0.35em;
	}

	.key.bar {
		width: 0.8em;
		height: 0.6em;
		border-radius: 1px;
		background: color-mix(in srgb, var(--text) 38%, transparent);
	}

	.key.mark {
		width: 0.55em;
		height: 0.55em;
		border-radius: 50%;
		background: var(--accent);
	}

	.numbers dd {
		margin: 0;
		font: 400 0.76rem/1.4 var(--font-mono);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.note {
		grid-column: 1 / -1;
		color: var(--text-faint);
		font-size: 0.7rem;
		line-height: 1.4;
	}

	.bodies .note {
		text-align: center;
	}

	.note sup {
		line-height: 0;
	}

	/* --- the push, and what the weighings say ------------------------------------------- */

	.act {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.push {
		flex: none;
		padding: 0.55rem 1.15rem;
		border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
		border-radius: 9px;
		background: color-mix(in srgb, var(--accent) 16%, transparent);
		color: var(--text);
		font: 600 0.82rem/1 var(--font-sans);
		cursor: pointer;
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.push:hover {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 26%, transparent);
	}

	.push:active {
		background: color-mix(in srgb, var(--accent) 36%, transparent);
	}

	.push:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.verdict {
		color: var(--text-dim);
		line-height: 1.35;
	}

	.verdict strong {
		color: var(--text);
		font-weight: 600;
	}

	.verdict strong.apart {
		color: var(--accent);
	}

	/* --- the ladder --------------------------------------------------------------------- */

	.ladder {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.74rem;
		line-height: 1.3;
		font-variant-numeric: tabular-nums;
	}

	caption {
		margin-bottom: 0.2rem;
		color: var(--text-dim);
		font: italic 400 0.95rem/1.3 var(--font-serif);
		text-align: left;
	}

	th,
	td {
		padding: 0.32rem 0.5rem;
		border-bottom: 1px solid var(--line);
		text-align: right;
		white-space: nowrap;
	}

	th {
		color: var(--text-dim);
		font-weight: 400;
	}

	thead th {
		border-bottom-color: var(--line-strong);
		color: var(--text-faint);
	}

	th:first-child {
		padding-left: 0.6rem;
		text-align: left;
		white-space: normal;
	}

	td:last-child {
		color: var(--text-dim);
		text-align: left;
	}

	td.different {
		color: var(--accent);
		font-weight: 600;
	}

	/* the rung in use */
	.chosen th,
	.chosen td {
		background: color-mix(in srgb, var(--accent) 11%, transparent);
	}

	.chosen th {
		box-shadow: inset 2px 0 0 var(--accent);
		color: var(--text);
	}

	.unseen {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* little width for the ladder, as on a phone: each rung keeps to one line, without the tide's name */
	@container (max-width: 21.5rem) {
		.more {
			display: none;
		}

		th,
		td {
			padding-inline: 0.35rem;
		}
	}
</style>
