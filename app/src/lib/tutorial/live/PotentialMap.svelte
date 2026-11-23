<script lang="ts">
	/**
	 * Chapter 1.2's map of the potential: two point masses on a plane seen from above, which the reader drags (or
	 * moves with the arrow keys), and the lines on which Φ = −Σ G m_a / |x − x_a| is constant, at levels evenly
	 * spaced in its logarithm, filled more deeply the lower they lie. A probe, also movable, shows the field g = −∇Φ
	 * where it stands, an arrow across the lines at right angles, and the share of each mass in Φ and in |g|. Brought
	 * near the point between the masses where their pulls cancel, the probe finds it and states the potential
	 * there, which is not zero. The maths is in ./potential-map.ts; the chapter asks the prediction.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { WeightIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript, texNumber } from '../../ui/format';
	import {
		arrowLength,
		field,
		grid,
		isolines,
		levels,
		potential,
		sample,
		shares,
		zeroPull,
		type Body
	} from './potential-map';

	/** Drawing units per metre. */
	const U = 100;
	/** The heavier mass, kg, and the range of the lighter. */
	const HEAVY = 1000;
	const LIGHTEST = 70;
	const FIRST_LIGHT = 250;
	/** The spacing of the grid the lines are traced on, m: about three pixels, so that no line shows its corners. */
	const STEP = 0.025;
	/** The levels: ten to each factor of ten in |Φ|, J kg⁻¹, from the farthest corner to under the spheres. */
	const PER_DECADE = 10;
	const LEVELS = levels(6e-9, 1.2e-6, PER_DECADE);
	/** Within this of a mass the potential is held level, J kg⁻¹: deeper than every line. */
	const CAP = 1e-5;
	/** The levels from this depth down are filled, J kg⁻¹, so that the open plane far from the masses stays clear. */
	const FILL_FROM = 1.9e-8;
	/** The arrow: no length at this field, m s⁻², and this many drawing units longer for each factor of ten. */
	const ARROW_FLOOR = 1e-10;
	const ARROW_DECADE = 26;
	const ARROW_DECADES = 4;
	/** How near the masses may come to each other and the probe to a mass, and how near the edge, m. */
	const APART = 0.6;
	const CLEAR = 0.24;
	const EDGE = 0.2;
	/** The probe finds the point of zero pull within this distance, m, and a drag is drawn onto it within the second. */
	const FOUND = 0.12;
	const SNAP = 0.06;

	let lightMass = $state(FIRST_LIGHT);
	/** The masses' places, m, x to the right and y up: the heavier first. */
	let places = $state([
		{ x: -1, y: 0 },
		{ x: 1, y: 0 }
	]);
	let probe = $state({ x: -0.15, y: 0.85 });

	// --- the picture's bounds: wider than tall on a wide screen, taller than wide on a phone ----------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const half = $derived(phone.current ? { x: 180, y: 175 } : { x: 320, y: 180 });
	const viewBox = $derived(`${-half.x} ${-half.y} ${2 * half.x} ${2 * half.y}`);
	const box = $derived({ x: half.x / U, y: half.y / U });

	const clampTo = (p: { x: number; y: number }, edge: number) => ({
		x: Math.max(-box.x + edge, Math.min(box.x - edge, p.x)),
		y: Math.max(-box.y + edge, Math.min(box.y - edge, p.y))
	});

	/** A point pushed out to `least` from `from`, along the line between them. */
	function pushOut(p: { x: number; y: number }, from: { x: number; y: number }, least: number) {
		const dx = p.x - from.x;
		const dy = p.y - from.y;
		const r = Math.hypot(dx, dy);
		if (r >= least) return p;
		if (r === 0) return { x: from.x + least, y: from.y };
		return { x: from.x + (dx * least) / r, y: from.y + (dy * least) / r };
	}

	/** The lighter mass's place, kept in the picture and apart from the heavier. */
	function boundMass(p: { x: number; y: number }, other: { x: number; y: number }) {
		return clampTo(pushOut(clampTo(p, EDGE), other, APART), EDGE);
	}

	const shown = $derived.by(() => {
		const a = clampTo(places[0], EDGE);
		return [a, boundMass(places[1], a)];
	});
	const bodies: Body[] = $derived([
		{ ...shown[0], mass: HEAVY },
		{ ...shown[1], mass: lightMass }
	]);

	/** The probe, kept in the picture and off the spheres. */
	const at = $derived.by(() => {
		let p = clampTo(probe, 0.08);
		for (const b of bodies) p = pushOut(p, b, CLEAR);
		return p;
	});

	// --- the physics -------------------------------------------------------------------------------------------------
	const zero = $derived(zeroPull(bodies[0], bodies[1]));
	const zeroPhi = $derived(potential(bodies, zero.x, zero.y));
	const away = $derived(Math.hypot(at.x - zero.x, at.y - zero.y));
	const found = $derived(away < FOUND);
	/** On the point itself, where a drag or a key has put the probe. */
	const onIt = $derived(away < 1e-9);
	const phi = $derived(potential(bodies, at.x, at.y));
	const g = $derived(field(bodies, at.x, at.y));
	const size = $derived(Math.hypot(g.x, g.y));
	const share = $derived(shares(bodies, at.x, at.y));

	// --- the lines: the potential sampled once per change of the masses, then traced at every level ------------
	const sheet = $derived(
		grid({ left: -box.x, top: box.y, width: 2 * box.x, height: 2 * box.y, step: STEP })
	);
	const f1 = (n: number) => n.toFixed(1);
	/** Closed loops in metres as one SVG path in drawing units, screen y down. */
	const path = (loops: Float64Array[]) => {
		let d = '';
		for (const loop of loops) {
			for (let k = 0; k < loop.length; k += 2)
				d += `${k ? 'L' : 'M'}${f1(U * loop[k])},${f1(-U * loop[k + 1])}`;
			d += 'Z';
		}
		return d;
	};
	const map = $derived.by(() => {
		sample(sheet, bodies, CAP);
		return {
			lines: LEVELS.map((level, k) => ({
				d: path(isolines(sheet, level)),
				// the powers of ten are drawn a little stronger
				decade: Math.abs(Math.log10(-level) - Math.round(Math.log10(-level))) < 1e-9,
				filled: level <= -FILL_FROM,
				k
			})),
			// the line through the point of zero pull, crossing itself there
			saddle: path(isolines(sheet, zeroPhi))
		};
	});

	// --- the drawing ---------------------------------------------------------------------------------------------------
	/** Drawing units in one CSS pixel, so that marks keep their size on the screen. */
	let u = $state(1);
	/** A sphere's radius: as the cube root of its mass, as for one density. */
	const disc = (mass: number) => Math.max(7, 15 * Math.cbrt(mass / HEAVY)) * u;
	const PROBE = $derived(6 * u);

	const toScreen = (p: { x: number; y: number }) => ({ x: U * p.x, y: -U * p.y });

	const arrow = $derived.by(() => {
		const len = Math.min(arrowLength(size, ARROW_FLOOR, ARROW_DECADE), ARROW_DECADE * 4.6);
		const head = 6 * u;
		if (len < head + 2 * u) return undefined;
		const ux = g.x / size;
		const uy = -g.y / size;
		const from = toScreen(at);
		const start = { x: from.x + ux * (PROBE + 1.5 * u), y: from.y + uy * (PROBE + 1.5 * u) };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = 3 * u;
		const f = (n: number) => n.toFixed(2);
		return {
			shaft: `M${f(start.x)},${f(start.y)}L${f(base.x + ux * 0.5 * u)},${f(base.y + uy * 0.5 * u)}`,
			head: `M${f(tip.x)},${f(tip.y)}L${f(base.x - uy * w)},${f(base.y + ux * w)}L${f(base.x + uy * w)},${f(base.y - ux * w)}Z`
		};
	});

	/** The ruler of the arrow's length, in the lower left corner. */
	const ruler = $derived({ x: -half.x + 30 * u, y: half.y - 24 * u });
	/** The scale bar of one metre, in the lower right. */
	const bar = $derived({ x: half.x - 16 * u - U, y: half.y - 16 * u });

	// --- moving a mass or the probe: by pointer, or by the arrow keys ------------------------------------------------
	type Handle = 0 | 1 | 'probe';
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<Handle | undefined>();

	function metres(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: p.x / U, y: -p.y / U };
	}

	function place(h: Handle, p: { x: number; y: number }, snap: number) {
		if (h === 'probe') {
			probe = Math.hypot(p.x - zero.x, p.y - zero.y) < snap ? { x: zero.x, y: zero.y } : p;
		} else if (h === 0) {
			places[0] = clampTo(p, EDGE);
			places[1] = shown[1];
		} else places[1] = boundMass(p, shown[0]);
	}

	/** Pointer moves, at most one a frame. */
	let pending: { x: number; y: number } | undefined;
	let frame = 0;
	function schedule(p: { x: number; y: number }) {
		pending = p;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging !== undefined && pending) place(dragging, pending, SNAP);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, h: Handle) {
		if (e.button !== 0) return;
		// a drag is not a click: the handle does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = h;
	}

	/** A press on the open picture, with a mouse or a pen, brings the probe there. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = 'probe';
		place('probe', metres(e), SNAP);
	}

	function move(e: PointerEvent) {
		if (dragging !== undefined) schedule(metres(e));
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, h: Handle) {
		const step = e.shiftKey ? 0.25 : 0.05;
		const d = {
			ArrowLeft: { x: -step, y: 0 },
			ArrowRight: { x: step, y: 0 },
			ArrowUp: { x: 0, y: step },
			ArrowDown: { x: 0, y: -step }
		}[e.key];
		if (!d) return;
		e.preventDefault();
		const from = h === 'probe' ? at : shown[h];
		// a step lands on the point of zero pull only from within half a step, so the next step leaves it
		place(h, { x: from.x + d.x, y: from.y + d.y }, step / 2);
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const PHI = '\\htmlClass{q-field}{\\Phi}';
	const GEE = '\\htmlClass{q-field}{g}';
	const BIG = '\\htmlClass{q-matter}{M}';
	const SMALL = '\\htmlClass{q-matter}{m}';
	const perKg = (v: number) => `${texNumber(v, 3)}\\,\\mathrm{J\\,kg^{-1}}`;
	const accel = (v: number) => `${texNumber(v, 3)}\\,\\mathrm{m\\,s^{-2}}`;
	const percent = (f: number) => `${Math.round(100 * f)}%`;

	const massesTex = $derived([
		`${BIG} = ${HEAVY}\\,\\mathrm{kg}`,
		`${SMALL} = ${lightMass}\\,\\mathrm{kg}`,
		`d = ${Math.hypot(shown[0].x - shown[1].x, shown[0].y - shown[1].y).toFixed(2)}\\,\\mathrm{m}`
	]);
	const phiTex = $derived(`${PHI} = ${perKg(phi)}`);
	const sizeTex = $derived(`|${GEE}| = ${onIt ? '0' : accel(size)}`);
	const pulls = $derived(
		bodies.map((b) => {
			const one = field([b], at.x, at.y);
			return Math.hypot(one.x, one.y);
		})
	);
	const fraction = $derived(1 / (1 + Math.sqrt(HEAVY / lightMass)));

	const label = (h: Handle) =>
		h === 'probe'
			? `The probe. Drag it, or use the arrow keys. The potential here is ${phi.toPrecision(3)} joules per kilogram${onIt ? ', at the point of zero pull' : ''}.`
			: `${h === 0 ? 'The heavier mass' : 'The lighter mass'}, ${bodies[h].mass} kilograms. Drag it, or use the arrow keys.`;
</script>

<div class="potential-map">
	<div class="stage">
		<svg
			{viewBox}
			role="group"
			aria-label="A map of the potential of two masses seen from above, with a probe that shows the field"
			class={{ dragging: dragging !== undefined }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<radialGradient id="potential-map-mass" cx="0.38" cy="0.34" r="0.7">
					<stop offset="0" class="mass-core" />
					<stop offset="0.7" class="mass-body" />
					<stop offset="1" class="mass-edge" />
				</radialGradient>
			</defs>

			<!-- the levels, filled more deeply the lower they lie, and their lines -->
			{#each map.lines as line (line.k)}
				<path class={['level', { decade: line.decade, filled: line.filled }]} d={line.d} />
			{/each}
			{#if found}
				<path class="saddle" d={map.saddle} />
			{/if}

			<!-- the line between the masses -->
			<line
				class="tether"
				x1={U * shown[0].x}
				y1={-U * shown[0].y}
				x2={U * shown[1].x}
				y2={-U * shown[1].y}
			/>

			<!-- the masses -->
			{#each bodies as b, i (i)}
				{@const p = toScreen(b)}
				{@const r = disc(b.mass)}
				<g
					class="mass"
					transform="translate({f1(p.x)} {f1(p.y)})"
					role="button"
					tabindex="0"
					aria-roledescription="movable mass"
					aria-label={label(i as 0 | 1)}
					onpointerdown={(e) => grab(e, i as 0 | 1)}
					onkeydown={(e) => key(e, i as 0 | 1)}
				>
					<circle class="hit" r={Math.max(r + 8 * u, 18 * u)} />
					<circle class="focus" r={r + 4 * u} />
					<circle class="disc" {r} />
					<text class="name" y={r + 15 * u}>{i === 0 ? 'M' : 'm'}, {b.mass} kg</text>
				</g>
			{/each}

			<!-- the point of zero pull, once the probe has found it -->
			{#if found}
				{@const z = toScreen(zero)}
				<circle class="zero-halo" cx={z.x} cy={z.y} r={14 * u} />
			{/if}

			<!-- the probe and the field where it stands -->
			{#if arrow}
				<path class="shaft" d={arrow.shaft} />
				<path class="head" d={arrow.head} />
			{/if}
			<g
				class={['probe', { found }]}
				transform="translate({f1(U * at.x)} {f1(-U * at.y)})"
				role="button"
				tabindex="0"
				aria-roledescription="movable probe"
				aria-label={label('probe')}
				onpointerdown={(e) => grab(e, 'probe')}
				onkeydown={(e) => key(e, 'probe')}
			>
				<circle class="hit" r={16 * u} />
				<circle class="focus" r={PROBE + 4 * u} />
				<circle class="ring" r={PROBE} />
				<circle class="dot" r={1.4 * u} />
			</g>

			<!-- the arrow's ruler: one step for each factor of ten -->
			<g class="ruler" transform="translate({f1(ruler.x)} {f1(ruler.y)})">
				<rect
					class="plate"
					x={-20 * u}
					y={-24 * u}
					width={ARROW_DECADE * ARROW_DECADES + 70 * u}
					height={42 * u}
					rx={5 * u}
				/>
				<text class="caption" x="0" y={-10 * u}>length of the arrow</text>
				<line class="rule" x1="0" y1="0" x2={ARROW_DECADE * ARROW_DECADES} y2="0" />
				{#each Array.from({ length: ARROW_DECADES + 1 }, (_, k) => k) as k (k)}
					<line class="rule" x1={ARROW_DECADE * k} y1={-3 * u} x2={ARROW_DECADE * k} y2="0" />
					{#if k % 2 === 0}
						<text class="num" x={ARROW_DECADE * k} y={12 * u} text-anchor="middle"
							>10{superscript(-10 + k)}</text
						>
					{/if}
				{/each}
				<text class="num" x={ARROW_DECADE * ARROW_DECADES + 18 * u} y={12 * u}>m s⁻²</text>
			</g>

			<!-- one metre -->
			<g class="scale" transform="translate({f1(bar.x)} {f1(bar.y)})">
				<path class="rule" d="M0,{-3 * u}V0H{U}V{-3 * u}" />
				<text class="num" x={U / 2} y={-6 * u} text-anchor="middle">1 m</text>
			</g>
		</svg>
		<p class="legend">
			<span
				><i class="key line"></i><span
					>a level of <Tex math={PHI} trust />, ten to each factor of ten</span
				></span
			>
			<span><i class="key fill"></i><span>deeper fill, lower potential</span></span>
			<span
				><i class="key arrow"></i><span
					>the field <Tex math={GEE} trust /> at the probe, its length logarithmic</span
				></span
			>
		</p>
	</div>

	<div class="bar">
		<div class="slide">
			<Slider
				id="potential-map-light"
				label="Lighter mass"
				icon={WeightIcon}
				min={LIGHTEST}
				max={HEAVY}
				step={10}
				bind:value={lightMass}
				readout="{lightMass} kg"
				ends={['70 kg', '1000 kg']}
				marks={[
					{ at: 70, label: 'a person, 70 kg' },
					{ at: 250, label: 'a quarter of the heavier, 250 kg' },
					{ at: 1000, label: 'as heavy as the other, 1000 kg' }
				]}
				marksHint="the ticks mark a person, a quarter and an equal mass"
			/>
		</div>
		<p class="hint">
			Drag the probe or either mass, or reach them with Tab and move them with the arrow keys.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Masses</dt>
				<dd>
					{#each massesTex as tex, i (i)}<Tex math={tex} trust />{/each}
				</dd>
			</div>
			<div class="row">
				<dt>Potential</dt>
				<dd>
					<Tex math={phiTex} trust /><span class="also"
						><Tex math={BIG} trust />
						{percent(share.potential[0])}, <Tex math={SMALL} trust />
						{percent(share.potential[1])}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Field</dt>
				<dd>
					<Tex math={sizeTex} trust /><span class="also"
						><Tex math={BIG} trust /> pulls <Tex math={accel(pulls[0])} />, <Tex
							math={SMALL}
							trust
						/> pulls <Tex math={accel(pulls[1])} /> ({percent(share.pull[0])} : {percent(
							share.pull[1]
						)})</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Zero pull</dt>
				<dd aria-live="polite" class={{ found }}>
					{#if found}
						<strong
							>{onIt ? 'Zero pull here' : `Zero pull ${away.toFixed(2)} m away`}; <Tex
								math={`${PHI} = ${perKg(zeroPhi)}`}
								trust
							/>, not zero.</strong
						>
						<span class="also"
							><Tex math={`${zero.fromLighter.toFixed(2)}\\,\\mathrm{m}`} /> from <Tex
								math={SMALL}
								trust
							/>, <Tex
								math={`r/d = 1/\\bigl(1+\\sqrt{${BIG}/${SMALL}}\\bigr) = ${fraction.toFixed(3)}`}
								trust
							/></span
						>
					{:else}
						<span class="faint">not at the probe</span>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			Seen from above, to scale. Each line joins the places of one potential, <Tex
				math={`${PHI} = -10^{k/10}\\,\\mathrm{J\\,kg^{-1}}`}
				trust
			/>, so that each is <Tex math={'10^{1/10} \\approx 1.26'} /> times deeper than the one outside it,
			and the powers of ten are drawn a little stronger. The arrow of <Tex math={GEE} trust /> points
			downhill across the lines, at right angles to them. Its length grows by one step of the ruler for
			each factor of ten in <Tex math={`|${GEE}|`} trust />, so that a field a thousand times
			stronger is three steps longer, not a thousand times.
		</p>
	</div>
</div>

<style>
	.potential-map {
		/* each filled level darkens the ones inside it by this much */
		--fill-step: 3.5%;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		background: radial-gradient(circle at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
		/* the open picture lets a finger scroll the page; only the masses and the probe take a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .mass,
	svg.dragging .probe {
		cursor: grabbing;
	}

	.level {
		fill: none;
		fill-rule: evenodd;
		stroke: color-mix(in srgb, var(--q-field) 42%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-linejoin: round;
	}

	.level.filled {
		fill: color-mix(in srgb, var(--q-field) var(--fill-step), transparent);
	}

	.level.decade {
		stroke: color-mix(in srgb, var(--q-field) 75%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.saddle {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.tether {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.mass,
	.probe {
		cursor: grab;
		touch-action: none;
	}

	.mass:focus,
	.probe:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.disc {
		fill: url(#potential-map-mass);
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mass-core {
		stop-color: color-mix(in srgb, var(--q-matter) 50%, var(--bg));
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

	.mass:focus-visible .focus,
	.probe:focus-visible .focus {
		opacity: 1;
	}

	.name {
		fill: var(--q-matter);
		font: italic 500 calc(12.5px * var(--u, 1)) / 1 var(--font-serif);
		text-anchor: middle;
		pointer-events: none;
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ring {
		fill: color-mix(in srgb, var(--bg) 55%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
	}

	.probe.found .ring {
		stroke: var(--accent);
		stroke-width: calc(2px * var(--u, 1));
	}

	.probe.found .dot {
		fill: var(--accent);
	}

	.zero-halo {
		fill: color-mix(in srgb, var(--accent) 16%, transparent);
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--q-field);
	}

	.plate {
		fill: color-mix(in srgb, var(--bg-sunken) 82%, transparent);
	}

	.rule {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num,
	.caption {
		fill: var(--text-dim);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.scale .num {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
		padding: 0.45rem 0.9rem 0.55rem;
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
	}

	.legend > span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.key {
		flex: none;
		display: inline-block;
		width: 1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.key.line {
		border-color: color-mix(in srgb, var(--q-field) 75%, transparent);
	}

	.key.fill {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--q-field) 8%, transparent),
			color-mix(in srgb, var(--q-field) 36%, transparent)
		);
	}

	.key.arrow {
		border-top: 2px solid var(--q-field);
		position: relative;
	}

	.key.arrow::after {
		content: '';
		position: absolute;
		right: -2px;
		top: -5px;
		border: 4px solid transparent;
		border-left: 6px solid var(--q-field);
		border-right: 0;
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

	.slide {
		flex: 1 1 18rem;
		min-width: 0;
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
		grid-template-columns: 7rem 1fr;
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
	}

	dd.found strong {
		color: var(--accent);
	}

	.also {
		color: var(--text-dim);
	}

	.faint {
		color: var(--text-faint);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	:global(:root[data-theme='light']) .potential-map {
		--fill-step: 2.5%;
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .potential-map {
			--fill-step: 2.5%;
		}
	}

	@media (max-width: 560px) {
		.row {
			grid-template-columns: 5.6rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
