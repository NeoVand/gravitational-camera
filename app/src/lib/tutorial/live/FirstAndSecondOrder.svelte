<script lang="ts">
	/**
	 * Chapter 13.1's push and pass. Left, a projected body seen along the passer's straight path, which crosses the page
	 * at the bead: the paper's pair (each body with its own bead and path), a uniform ball and a thin shell of one mass
	 * and radius, or a lopsided body of two lumps. The reader drags the bead round the body, or moves it from the
	 * keyboard. Right, for each body: the momentum handed to the passer sideways, |ΔP| in M C₀/R, with its parts from
	 * m_00 to m_04; the bending angle |ΔP|/μV in 2GM/RV²; and the energy left inside, in M C₀²/2R². Sliders set the
	 * passing mass, one to four of the paper's tonne, and |b|. The arithmetic is in ./first-and-second-order.ts. The
	 * chapter's try box asks the predictions, so the figure answers none of them in words: it shows live values only.
	 * Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import {
		CircleIcon,
		RulerIcon,
		ShapesIcon,
		Target03Icon,
		WeightIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		CHOICES,
		DISTANCE_STEP,
		FARTHEST,
		LISTED,
		MASS,
		NEAREST,
		OPENING,
		RINGS,
		TURN_STEP,
		clamp,
		crossing,
		drawnDistance,
		fromDrawn,
		percent,
		reading,
		shading,
		shown,
		wrap,
		type Choice,
		type Projected
	} from './first-and-second-order';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let choice = $state<Choice>('pair');
	let tonnes = $state(MASS.opening);
	let distance = $state(OPENING.distance);
	/** φ, the bead's angle round the body, in degrees anticlockwise from the right */
	let turn = $state(OPENING.turn);

	const setDistance = (v: number) =>
		(distance = clamp(Math.round(v * 100) / 100, NEAREST, FARTHEST));
	const setTonnes = (v: number) =>
		(tonnes = clamp(Math.round(v / MASS.step) * MASS.step, MASS.min, MASS.max));

	const b = $derived(crossing(distance, turn));
	const bodies = $derived(CHOICES[choice].bodies);
	const readings = $derived(bodies.map((body) => reading(body, b, tonnes)));

	// --- the views ----------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** One view per body: a square of SIDE drawing units, the body's R a little under a fifth of it. */
	const SIDE = 200;
	const GAP = 14;
	const R = SIDE / 2 / 2.55;
	/** The length of the momentum's arrow for M C₀/R, in R. */
	const ARROW = 0.6;
	const W = $derived(bodies.length * SIDE + (bodies.length - 1) * GAP);
	const H = SIDE;
	const centre = (i: number) => ({ x: i * (SIDE + GAP) + SIDE / 2, y: SIDE / 2 });

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f1 = (x: number) => x.toFixed(1);
	const f2 = (x: number) => x.toFixed(2);

	/** The bead's place in a view, about its centre (y down the page). */
	const bead = $derived.by(() => {
		const rho = drawnDistance(distance) * R;
		const t = (turn * Math.PI) / 180;
		return { x: rho * Math.cos(t), y: -rho * Math.sin(t) };
	});

	/** The bead's radius, in CSS pixels. */
	const BEAD = 6.5;

	/** The passer's sideways momentum, −ΔP, as an arrow from the bead, at ARROW R per M C₀/R. */
	function arrow(i: number) {
		const P = readings[i].momentum;
		const size = Math.hypot(P.re, P.im);
		const length = ARROW * R * size;
		const [ux, uy] = [-P.re / size, P.im / size];
		const head = Math.min(7 * u, 0.6 * length);
		const half = 3.2 * u;
		// from the bead's rim, so that the whole of its length shows
		const [x0, y0] = [bead.x + ux * BEAD * u, bead.y + uy * BEAD * u];
		const [x1, y1] = [x0 + ux * length, y0 + uy * length];
		const [xb, yb] = [x1 - ux * head, y1 - uy * head];
		return {
			shaft: `M${f2(x0)},${f2(y0)}L${f2(xb)},${f2(yb)}`,
			head: `M${f2(x1)},${f2(y1)}L${f2(xb - uy * half)},${f2(yb + ux * half)}L${f2(xb + uy * half)},${f2(yb - ux * half)}Z`
		};
	}
	const arrows = $derived(bodies.map((_, i) => arrow(i)));

	/** A round body's outer radius and whether it has a point at the centre. */
	function outline(body: Projected) {
		if (body.kind !== 'round') return { outer: 0, point: false };
		return {
			outer: Math.max(...body.body.shells.map((s) => s.radius)),
			point: body.body.shells.some((s) => s.radius === 0)
		};
	}

	// --- dragging and the keys -------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined = $state();
	let dragging = $state(false);

	function follow(e: PointerEvent) {
		if (!dragging || !svg) return;
		const m = svg.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		// the view the pointer is over sets the centre
		const i = clamp(Math.floor((p.x + GAP / 2) / (SIDE + GAP)), 0, bodies.length - 1);
		const c = centre(i);
		const [x, y] = [(p.x - c.x) / R, -(p.y - c.y) / R];
		const rho = Math.hypot(x, y);
		setDistance(rho > 1 ? fromDrawn(rho) : NEAREST);
		if (rho > 1e-6) turn = wrap(Math.round((Math.atan2(y, x) * 180) / Math.PI));
	}

	function press(e: PointerEvent) {
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		follow(e);
	}

	function release() {
		dragging = false;
	}

	/** Left and right turn φ by 5°, up and down change |b| by 0.05 R. */
	function beadKeys(e: KeyboardEvent) {
		const by = {
			ArrowLeft: [-TURN_STEP, 0],
			ArrowRight: [TURN_STEP, 0],
			ArrowUp: [0, DISTANCE_STEP],
			ArrowDown: [0, -DISTANCE_STEP]
		}[e.key];
		if (!by) return;
		e.preventDefault();
		turn = wrap(Math.round(turn + by[0]));
		setDistance(distance + by[1]);
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const MU = '\\htmlClass{q-matter}{\\mu}';
	const MOMENTUM_TEX = '|\\Delta P|';
	const MOMENTUM_UNIT = `${M}C_0/R`;
	const ANGLE_TEX = `|\\Delta P|/${MU}V`;
	const ANGLE_UNIT = `2G${M}/RV^2`;
	const ENERGY_TEX = '\\htmlClass{q-matter}{\\Delta E}';
	const ENERGY_UNIT = `${M}C_0^2/2R^2`;
	const PART_TEX = Array.from({ length: LISTED }, (_, q) => `m_{0${q}}`);

	const OPTIONS = $derived([
		{
			value: 'pair' as const,
			label: phone.current ? 'The pair' : 'The paper’s pair',
			icon: Target03Icon
		},
		{
			value: 'ball' as const,
			label: phone.current ? 'Ball, shell' : 'Ball and shell',
			icon: CircleIcon
		},
		{ value: 'lumps' as const, label: 'Two lumps', icon: ShapesIcon }
	]);

	const where = $derived(`|b| = ${distance.toFixed(2)} R, φ = ${Math.round(turn)}°`);
	const beadText = $derived(`${where}`);
	const tonneText = $derived(tonnes === 1 ? 'a tonne' : `${tonnes.toFixed(1)} tonnes`);

	const description = $derived(
		bodies
			.map(
				(body, i) =>
					`${bodies.length > 1 ? `${body.key}, ` : ''}${body.name}, seen along the passer’s path, ` +
					`which crosses the page at the bead, ${where}; an arrow from the bead, the momentum handed to the ` +
					`passer, ${shown(readings[i].size)} M C₀/R`
			)
			.join('. ') +
			'. Dashed circles mark |b| = 1.5, 2, 3 and 4 R, drawn closer together than they are.'
	);
</script>

{#snippet value(text: string, energy = false)}<span class={['number', { energy }]}>{text}</span
	>{/snippet}

<div class="first-and-second-order">
	<div class="panels">
		<section class="panel" aria-label="The body seen along the passer’s path">
			<div class="stage">
				<p class="heading">Seen along the passer’s path, which crosses the page at the bead</p>
				<svg
					class={{ single: bodies.length === 1 }}
					viewBox="0 0 {W} {H}"
					role="group"
					aria-label={description}
					{@attach (node: SVGSVGElement) => {
						void W;
						svg = node;
						return fitText((value) => (u = value))(node);
					}}
				>
					<defs>
						{#each bodies as body (body.key)}
							{#if body.kind === 'round'}
								<radialGradient id="{uid}-sigma-{choice}-{body.key}" r="0.5">
									{#each shading(body.body, body.sigma) as stop (stop.offset)}
										<stop
											offset={stop.offset}
											class="sigma"
											stop-opacity={(0.08 + 0.62 * stop.opacity).toFixed(3)}
										/>
									{/each}
								</radialGradient>
							{/if}
						{/each}
						<radialGradient id="{uid}-tonne" r="0.5">
							<stop offset="0" class="mass-core" />
							<stop offset="0.6" class="mass-body" />
							<stop offset="1" class="mass-edge" />
						</radialGradient>
					</defs>

					{#each bodies as body, i (body.key)}
						{@const c = centre(i)}
						{@const shape = outline(body)}
						<g transform="translate({c.x} {c.y})">
							<rect
								class="view"
								x={-SIDE / 2}
								y={-SIDE / 2}
								width={SIDE}
								height={SIDE}
								rx={6 * u}
							/>
							{#if bodies.length > 1}
								<text class="letter" x={-SIDE / 2 + 9 * u} y={-SIDE / 2 + 9 * u} dy="0.8em"
									>{body.key}</text
								>
							{/if}

							<!-- where the bead may be: |b| of 1.5, 2, 3 and 4 R, drawn closer -->
							{#each RINGS as ring, k (ring)}
								{@const r = drawnDistance(ring) * R}
								<circle class="ring" {r} />
								<!-- under the circle, by turns to the right and to the left of the vertical, to keep apart -->
								<text
									class={['ring-label', { left: k % 2 === 1 }]}
									x={f1((k % 2 ? -2.5 : 2.5) * u)}
									y={f1(r + 1.5 * u)}
									dy="0.8em">{ring}<tspan class="it">R</tspan></text
								>
							{/each}

							<!-- the radius R, and the body projected along the path -->
							<circle class="unit" r={R} />
							{#if body.kind === 'round'}
								<circle
									class="projected"
									r={shape.outer * R}
									fill="url(#{uid}-sigma-{choice}-{body.key})"
								/>
								{#if shape.point}
									<circle class="lump" r={3.6 * u} />
								{/if}
							{:else}
								{#each body.lumps as lump, k (k)}
									<circle
										class="lump"
										cx={f1(lump.at.re * R)}
										cy={f1(-lump.at.im * R)}
										r={f1(0.24 * R * Math.sqrt(lump.mass))}
									/>
								{/each}
							{/if}
							<path class="origin" d="M{-4 * u},0H{4 * u}M0,{-4 * u}V{4 * u}" />

							<!-- toward the centre, and the momentum handed to the passer -->
							<line class="toward" x1={f1(bead.x)} y1={f1(bead.y)} x2="0" y2="0" />
							<path class="shaft-halo" d={arrows[i].shaft} />
							<path class="shaft" d={arrows[i].shaft} />
							<path class="head" d={arrows[i].head} />

							<g transform="translate({f1(bead.x)} {f1(bead.y)})">
								<circle class="tonne" r={BEAD * u} fill="url(#{uid}-tonne)" />
								<circle class="crossing" r={1.6 * u} />
							</g>
						</g>
					{/each}

					<!-- presses anywhere on a view move the bead there -->
					{#each bodies as body, i (body.key)}
						{@const c = centre(i)}
						<rect
							class={['hit', { dragging }]}
							role="presentation"
							x={c.x - SIDE / 2}
							y={c.y - SIDE / 2}
							width={SIDE}
							height={SIDE}
							onpointerdown={press}
							onpointermove={follow}
							onpointerup={release}
							onpointercancel={release}
						/>
					{/each}

					<!-- the bead for the keyboard: the first view's; the others follow it -->
					<g
						class="handle"
						role="slider"
						tabindex="0"
						aria-roledescription="movable bead"
						aria-label="Where the passer’s path crosses the page. Left and right turn it round the body by 5°, up and down move it out and in by 0.05 R."
						aria-valuemin={NEAREST}
						aria-valuemax={FARTHEST}
						aria-valuenow={distance}
						aria-valuetext={beadText}
						onkeydown={beadKeys}
					>
						<circle
							class="focus"
							cx={f1(centre(0).x + bead.x)}
							cy={f1(centre(0).y + bead.y)}
							r={12 * u}
						/>
					</g>
				</svg>
				<p class="where" aria-hidden="true">
					<Tex
						math={`|b| = ${distance.toFixed(2)}\\,R, \\quad \\varphi = ${Math.round(turn)}^\\circ`}
					/>
				</p>
				<ul class="legend" aria-hidden="true">
					<li><span class="swatch bead-key"></span>the passer and its path</li>
					<li><span class="swatch arrow-key"></span>the momentum handed to it, sideways</li>
					<li><span class="swatch toward-key"></span>the line to the centre of mass</li>
				</ul>
			</div>
		</section>

		<section
			class="panel readouts"
			aria-label="What the pass gives each body"
			style:--n={bodies.length}
		>
			<div class="reading names">
				<span class="what"></span>
				{#each bodies as body (body.key)}
					<p class="name">
						{#if bodies.length > 1}<span class="key">{body.key}</span>{/if}{body.name}
					</p>
				{/each}
			</div>

			<div class="reading">
				<p class="what">
					The momentum handed to the passer, sideways, <Tex math={MOMENTUM_TEX} />, in <Tex
						math={MOMENTUM_UNIT}
						trust
					/>, and its parts from each moment
				</p>
				{#each readings as r, i (bodies[i].key)}
					<div class="cell">
						{@render value(shown(r.size))}
						<ul class="parts" aria-label="its parts, by size">
							{#each r.parts as part, q (q)}
								<li><Tex math={PART_TEX[q]} /><span class="part">{shown(part)}</span></li>
							{/each}
							<li>
								<span class="rest-label">the rest</span><span class="part">{shown(r.rest)}</span>
							</li>
						</ul>
					</div>
				{/each}
			</div>

			<div class="reading">
				<p class="what">
					The angle of bending, <Tex math={ANGLE_TEX} trust />, in <Tex math={ANGLE_UNIT} trust />
				</p>
				{#each readings as r, i (bodies[i].key)}
					<div class="cell">
						{@render value(shown(r.angle))}
						{#if bodies[i].kind === 'lumps'}
							<span class="also"
								>a point of its mass: {shown(r.pointAngle)}; this body, {percent(
									r.angle / r.pointAngle - 1
								)}</span
							>
						{/if}
					</div>
				{/each}
			</div>

			<div class="reading">
				<p class="what">
					The energy left inside, <Tex math={ENERGY_TEX} trust />, in <Tex
						math={ENERGY_UNIT}
						trust
					/>
				</p>
				{#each readings as r, i (bodies[i].key)}
					<div class="cell">{@render value(shown(r.energy), true)}</div>
				{/each}
			</div>
		</section>
	</div>

	<div class="bar">
		<Segmented label="The body" options={OPTIONS} bind:value={choice} />
		<div class="sliders">
			<Slider
				id="{uid}-mass"
				label="The passing mass"
				icon={WeightIcon}
				min={MASS.min}
				max={MASS.max}
				step={MASS.step}
				bind:value={() => tonnes, setTonnes}
				readout="×{tonnes.toFixed(1)}, {tonneText}"
				ends={['the paper’s tonne', 'four tonnes']}
			/>
			<Slider
				id="{uid}-distance"
				label="Distance of the pass"
				icon={RulerIcon}
				min={NEAREST}
				max={FARTHEST}
				step={0.01}
				bind:value={() => distance, setDistance}
				readout="|b| = {distance.toFixed(2)} R"
				mark={{ at: OPENING.distance, label: 'the paper’s' }}
			/>
		</div>
		<p class="hint">
			Drag the bead round the body, or press anywhere in a view to move it there. With the keyboard,
			Tab to the bead: left and right turn it by 5°, up and down move it by 0.05 <i>R</i>.
		</p>
	</div>

	<p class="note">
		The readings are exact in the impulse approximation. The momentum is the chapter’s series in the
		<Tex math={'m_{0q}'} />, summed to forty terms, and the parts listed are the sizes of its first
		five terms and of the rest: they are complex numbers, which add as arrows. The energies of the
		round bodies are those of lib/hair/passing.ts, less the recoil, the uniform ball taken as 48
		thin shells; those of the lumps are the planar series in the <Tex math={'m_{pq}'} />, to forty
		terms in each of <Tex math="p" /> and <Tex math="q" />, less the whole body’s recoil <Tex
			math={`|\\Delta P|^2/2${M}`}
			trust
		/>. Drawn for clarity: the bodies and the bead’s direction are to scale, but its distance is
		not, and the circles mark where 1.5 <i>R</i> to 4
		<i>R</i> fall; the shading follows the projected mass, capped near a thin shell’s rim; the lumps are
		points, drawn as discs of area in proportion to their masses; and the arrow is drawn at one fixed
		scale, far longer than any true bending.
	</p>
</div>

<style>
	.first-and-second-order {
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
		grid-template-columns: minmax(0, 1fr);
	}

	.panel + .panel {
		border-top: 1px solid var(--line);
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
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.single {
		max-width: 21rem;
		margin: 0 auto;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	.view {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.letter {
		fill: var(--text);
		font: italic 500 calc(15px * var(--u, 1)) / 1 var(--font-serif);
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 20%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.ring-label.left {
		text-anchor: end;
	}

	.ring-label {
		font-size: calc(9.5px * var(--u, 1));
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(2.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.unit {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	/* the projected mass, in the colour of matter */
	.sigma {
		stop-color: var(--q-matter);
	}

	.projected {
		stroke: color-mix(in srgb, var(--q-matter) 65%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.lump {
		fill: color-mix(in srgb, var(--q-matter) 70%, var(--bg));
		stroke: var(--q-matter);
		stroke-width: calc(1px * var(--u, 1));
	}

	.origin {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.toward {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	/* the momentum is neither a mass nor a tide: the ink, with a halo of the ground over the body */
	.shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft-halo {
		fill: none;
		stroke: var(--bg-sunken);
		stroke-opacity: 0.8;
		stroke-width: calc(5px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-opacity: 0.8;
		stroke-width: calc(1px * var(--u, 1));
		paint-order: stroke;
	}

	.tonne {
		stroke: color-mix(in srgb, var(--q-matter) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mass-core {
		stop-color: color-mix(in srgb, var(--q-matter) 50%, var(--bg));
	}

	.mass-body {
		stop-color: color-mix(in srgb, var(--q-matter) 32%, var(--bg));
	}

	.mass-edge {
		stop-color: color-mix(in srgb, var(--q-matter) 16%, var(--bg));
	}

	.crossing {
		fill: var(--q-matter);
	}

	.hit {
		fill: transparent;
		cursor: grab;
	}

	.hit.dragging {
		cursor: grabbing;
	}

	.handle {
		pointer-events: none;
	}

	.handle:focus {
		outline: none;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.where {
		margin: 0.4rem 0 0;
		font-size: 0.8rem;
		color: var(--text-dim);
		text-align: center;
	}

	/* --- the legend -------------------------------------------------------------------------- */

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

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 2px solid var(--text);
	}

	.bead-key {
		width: 0.65rem;
		height: 0.65rem;
		border: 1px solid color-mix(in srgb, var(--q-matter) 60%, transparent);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			var(--q-matter) 0 18%,
			color-mix(in srgb, var(--q-matter) 32%, var(--bg)) 22%
		);
	}

	.toward-key {
		border-top: 1.2px dashed color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the readings ------------------------------------------------------------------------- */

	.readouts {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.85rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	/* a row of the table: what is read, then one cell for each body */
	.reading {
		display: grid;
		grid-template-columns: minmax(0, 14rem) repeat(var(--n), minmax(0, 1fr));
		gap: 0.2rem 1rem;
		align-items: start;
	}

	.name {
		margin: 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.key {
		margin-right: 0.4em;
		color: var(--text);
		font: italic 500 1.15em / 1 var(--font-serif);
	}

	.reading + .reading {
		padding-top: 0.6rem;
		border-top: 1px solid var(--line);
	}

	.what {
		margin: 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.cell {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.number {
		font-size: 1.05rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.number.energy {
		color: var(--q-matter);
	}

	.parts {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.05rem;
		font-size: 0.74rem;
		color: var(--text-dim);
	}

	.parts li {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		max-width: 9rem;
	}

	.part {
		font-variant-numeric: tabular-nums;
	}

	.rest-label {
		font-size: 0.95em;
	}

	.also {
		font-size: 0.74rem;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the controls and the note ----------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
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

	@media (max-width: 560px) {
		.reading {
			grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		}

		.what {
			grid-column: 1 / -1;
		}

		.names .what {
			display: none;
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
