<script lang="ts">
	/**
	 * Chapter 7.3's ball of free dust, Ricci against Weyl: a port, in a flat slice, of the GR course's
	 * curvature-cloud explorer. A slice through a ball of 200 free grains, in the observer's colour, is drawn at
	 * release (dashed) and 1 s later, its deformation exaggerated by a stated power of ten. The tide is the Ricci part
	 * from a medium of density ρ and pressure p and from a beam of light of flux F along a dial's direction, plus the
	 * Weyl part from a mass M at the distance d, drawn as a stone disc at the slice's edge (./ricci-weyl.ts). Orange
	 * axes stretch, blue ones squeeze. The readouts give tr 𝓔, V̈/V = −tr 𝓔 and the trace-free part split into Weyl
	 * and Ricci. The figure opens inside water with a 1000 kg mass 2 m away. Three predictions at the top are answered
	 * once the reader has done what each asks. Under reduced motion the ball is drawn at once at its final shape.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DashboardSpeed01Icon,
		DropletIcon,
		PlayIcon,
		RefreshIcon,
		RulerIcon,
		Sun01Icon,
		WeightScaleIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		AFTER,
		BEAM,
		C,
		DENSITY,
		DISTANCE,
		EARTH,
		FLUX,
		G,
		MASS,
		OPENING,
		PRESSURE,
		PRESSURES,
		SUNLIGHT,
		WATER,
		aspect,
		displayScale,
		drawnTide,
		grains,
		grouped,
		inSlice,
		moved,
		noteFirst,
		noteSecond,
		noteThird,
		pressureAt,
		pressureBoost,
		pressureSlider,
		scaleWords,
		stepped,
		texTwo,
		tides,
		two,
		type Range,
		type Settings
	} from './ricci-weyl';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let rho = $state(OPENING.rho);
	/** The pressure's slider: the decimal logarithm of p/ρc², its left end none. */
	let pLog = $state(pressureSlider(OPENING.pressure));
	let flux = $state(OPENING.flux);
	let beam = $state(OPENING.beam);
	let mass = $state(OPENING.mass);
	let distance = $state(OPENING.distance);

	const pressure = $derived(pressureAt(pLog));
	const settings: Settings = $derived({ rho, pressure, flux, beam, mass, distance });

	const clampTo = (v: number, r: Range) => Math.max(r.min, Math.min(r.max, v));

	function setRho(v: number) {
		rho = clampTo(Math.round(v), DENSITY);
		note();
	}
	function setPressure(v: number) {
		pLog = clampTo(v, PRESSURE);
		note();
	}
	function setFlux(v: number) {
		flux = clampTo(Math.round(v), FLUX);
		note();
	}
	function setBeam(v: number) {
		beam = ((Math.round(v) % 360) + 360) % 360;
		note();
	}
	function setMass(v: number) {
		mass = clampTo(Math.round(v), MASS);
		note();
	}
	function setDistance(v: number) {
		distance = clampTo(Math.round(v * 100) / 100, DISTANCE);
		note();
	}

	function reset() {
		rho = OPENING.rho;
		pLog = pressureSlider(OPENING.pressure);
		flux = OPENING.flux;
		beam = OPENING.beam;
		mass = OPENING.mass;
		distance = OPENING.distance;
		note();
	}

	/** Arrow keys step a slider, with Shift by a larger step; Page Up and Down, Home and End as usual. */
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
	/** What the reader had set when each prediction was answered. */
	let first = $state<Settings>();
	let second = $state<Settings>();
	let third = $state<Settings>();
	const revealed = $derived(step === 1 ? !!first : step === 2 ? !!second : !!third);

	function note() {
		const s = { ...settings };
		if (!first && noteFirst(false, s)) first = s;
		if (!second && noteSecond(false, s)) second = s;
		if (!third && noteThird(false, s)) third = s;
	}

	// the numbers of an answer follow the settings while they still answer its question, else they are those that
	// first did
	const firstAt = $derived(noteFirst(false, settings) ? settings : first);
	const secondAt = $derived(noteSecond(false, settings) ? settings : second);
	const thirdAt = $derived(noteThird(false, settings) ? settings : third);
	const firstRead = $derived(firstAt && tides(firstAt));
	const secondA = $derived(secondAt ? (G * secondAt.mass) / secondAt.distance ** 3 : 0);
	const thirdK = $derived(thirdAt ? (4 * Math.PI * G * thirdAt.flux) / C ** 3 : 0);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const read = $derived(tides(settings));
	const drawn = $derived(drawnTide(settings));
	const N = $derived(displayScale(drawn));
	const boost = $derived(rho > 0 ? pressureBoost(pressure) : 1);
	const axes = $derived(inSlice(read.total));
	const zz = $derived(read.total[2][2]);
	const shape = $derived(aspect(drawn, N ?? 0, read.total));

	/** The three principal values, with their kinds and where they act. */
	const principalList = $derived.by(() => {
		const most = Math.max(...axes.map((b) => Math.abs(b.value)), Math.abs(zz));
		// a principal value that is a rounding error next to the largest is zero
		const one = (value: number, where: string) => {
			const k = kind(value, most);
			return { value: k === 'still' ? 0 : value, k, where };
		};
		const even = Math.abs(axes[0].value - axes[1].value) <= 1e-9 * most;
		return [
			...(even
				? [one(axes[0].value, 'in every direction in the slice')]
				: axes.map((a) => one(a.value, direction(a.angle)))),
			one(zz, 'out of the slice')
		];
	});
	const pascals = $derived(pressure * rho * C * C);

	// --- letting the ball fall --------------------------------------------------------------------------------------
	/** The time since release, as a fraction of AFTER; the figure opens with the ball at its final shape. */
	let fall = $state(1);
	let playing = $state(false);
	let frame = 0;

	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		playing = false;
	}

	function play() {
		stop();
		if (prefersReducedMotion.current) {
			fall = 1;
			return;
		}
		const ms = 2200;
		const start = performance.now();
		playing = true;
		fall = 0;
		const tick = (now: number) => {
			const k = Math.min(1, (now - start) / ms);
			fall = k;
			if (k >= 1) {
				frame = 0;
				playing = false;
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	$effect(() => stop);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current ? { W: 360, H: 380, R: 100, cx: 160 } : { W: 640, H: 460, R: 138, cx: 270 }
	);
	const cy = $derived(box.H / 2);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const t = $derived(fall * AFTER);
	/** A point of the slice, in radii of the ball, on the page: y up. */
	const page = (p: [number, number]) => ({ x: box.cx + box.R * p[0], y: cy - box.R * p[1] });
	const at = (p: [number, number]) => (N ? moved(drawn, N, t, p) : p);

	const GRAINS = grains(200);
	const dots = $derived(GRAINS.map((g) => page(at(g))));

	const circle = (f: (p: [number, number]) => [number, number]) =>
		Array.from({ length: 97 }, (_, i) => {
			const a = (2 * Math.PI * i) / 96;
			const q = page(f([Math.cos(a), Math.sin(a)]));
			return `${i ? 'L' : 'M'}${f2(q.x)},${f2(q.y)}`;
		}).join('') + 'Z';

	const startPath = $derived(circle((p) => p));
	const outline = $derived(circle(at));

	const DEG = Math.PI / 180;
	/** The kind of a principal value: a stretch below zero, a squeeze above, still if it is next to nothing. */
	const kind = (v: number, most: number) =>
		Math.abs(v) <= 1e-6 * most ? 'still' : v < 0 ? 'stretch' : 'squeeze';

	/** Along each principal axis in the slice, both ways: an arrow from the dashed circle to the outline. */
	const arrows = $derived.by(() => {
		const most = Math.max(...axes.map((a) => Math.abs(a.value)), Math.abs(zz));
		const drawnAxes = inSlice(drawn);
		return drawnAxes.flatMap((a, i) => {
			const k = kind(axes[i].value, most);
			return [0, 180].map((turn) => {
				const th = (a.angle + turn) * DEG;
				const d: [number, number] = [Math.cos(th), Math.sin(th)];
				const from = page(d);
				const to = page(at(d));
				const len = Math.hypot(to.x - from.x, to.y - from.y);
				const line = page([1.55 * d[0], 1.55 * d[1]]);
				return { k, from, to, len, line, key: `${i}-${turn}` };
			});
		});
	});

	function arrowShape(a: { x: number; y: number }, b: { x: number; y: number }) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const l = Math.hypot(dx, dy);
		if (l < 1e-6) return { d: '', head: '' };
		const len = Math.min(7 * u, 0.6 * l);
		const w = len * 0.5;
		const ux = dx / l;
		const uy = dy / l;
		const bx = b.x - ux * len;
		const by = b.y - uy * len;
		return {
			d: `M${f2(a.x)},${f2(a.y)}L${f2(bx + ux * 0.5 * u)},${f2(by + uy * 0.5 * u)}`,
			head: `${f2(b.x)},${f2(b.y)} ${f2(bx - uy * w)},${f2(by + ux * w)} ${f2(bx + uy * w)},${f2(by - ux * w)}`
		};
	}

	/** The medium's wash: deeper with the density. */
	const wash = $derived(rho > 0 ? 0.07 + 0.16 * Math.min(1, rho / DENSITY.max) ** 0.5 : 0);

	/** The beam: three parallel lines across the panel along its direction, with an arrowhead and its name. */
	const beamLines = $derived.by(() => {
		if (flux <= 0) return undefined;
		const th = beam * DEG;
		const d = { x: Math.cos(th), y: -Math.sin(th) };
		const n = { x: -d.y, y: d.x };
		const reach = Math.hypot(box.W, box.H);
		const gap = 0.62 * box.R;
		const lines = [-1, 0, 1].map((k) => {
			const ox = box.cx + n.x * gap * k;
			const oy = cy + n.y * gap * k;
			return `M${f2(ox - d.x * reach)},${f2(oy - d.y * reach)}L${f2(ox + d.x * reach)},${f2(oy + d.y * reach)}`;
		});
		// the arrowhead on the middle line, inside the panel, past the ball
		const r = Math.min(
			1.62 * box.R,
			Math.abs(d.x) > 1e-6
				? (box.cx - 18 + (d.x > 0 ? box.W - 2 * box.cx : 0)) / Math.abs(d.x)
				: 1e9,
			Math.abs(d.y) > 1e-6 ? (cy - 18) / Math.abs(d.y) : 1e9
		);
		const tip = { x: box.cx + d.x * r, y: cy + d.y * r };
		const head = arrowShape({ x: tip.x - d.x * 30 * u, y: tip.y - d.y * 30 * u }, tip);
		// between the middle line and the next, clear of both
		const label = {
			x: tip.x - d.x * 18 * u + n.x * 0.31 * box.R,
			y: tip.y - d.y * 18 * u + n.y * 0.31 * box.R + 4 * u
		};
		return {
			lines,
			head: head.head,
			label,
			opacity: 0.45 + 0.55 * Math.min(1, flux / FLUX.max) ** 0.5
		};
	});

	/** The stone at the slice's right edge, its size growing with the cube root of its mass. */
	const stone = $derived.by(() => {
		if (mass <= 0) return undefined;
		const r = (phone.current ? 7 : 9) + (phone.current ? 15 : 22) * (mass / MASS.max) ** (1 / 3);
		const x = box.W - (phone.current ? 26 : 40);
		// on a phone the words keep inside the panel, ending at its edge
		const lx = phone.current ? box.W - 4 * u : x;
		return { x, y: cy, r, lx, anchor: phone.current ? 'end-anchor' : 'mid' };
	});

	// --- the words --------------------------------------------------------------------------------------------------
	const sTwo = (x: number) => `${two(x)} s⁻²`;
	const medium = (r: number) =>
		r === 0
			? 'empty space'
			: r === WATER
				? 'water, 1000 kg m⁻³'
				: r === EARTH
					? 'the Earth’s mean density, 5513 kg m⁻³'
					: `a medium of ${grouped(r)} kg m⁻³`;

	const pressureWords = $derived(
		pressure === 0 ? 'none' : rho === 0 ? 'none without a medium' : `${two(pressure)} ρc²`
	);

	const direction = (deg: number) => {
		const a = Math.round(deg) % 180;
		if (mass > 0 && (a === 0 || a === 180)) return 'along the line to the mass';
		if (mass > 0 && a === 90) return 'across the line to the mass';
		return `at ${a}° to the ${mass > 0 ? 'line to the mass' : 'horizontal'}`;
	};

	const sliceWords = $derived(
		principalList
			.slice(0, -1)
			.map((q) =>
				q.k === 'still'
					? `nothing ${q.where}`
					: `${q.k === 'stretch' ? 'a stretch' : 'a squeeze'} of ${sTwo(Math.abs(q.value))} ${q.where}`
			)
			.join(', ')
	);

	const description = $derived(
		`A slice through the centre of a ball of 200 free grains, in ${medium(rho)}` +
			(pressure > 0 && rho > 0 ? ` at a pressure of ${two(pressure)} ρc²` : '') +
			(flux > 0
				? `, with a beam of light of ${grouped(flux)} W m⁻² crossing it at ${Math.round(beam)}° to the ${mass > 0 ? 'line to the mass' : 'horizontal'}`
				: '') +
			(mass > 0
				? `, and a mass of ${grouped(mass)} kg ${distance.toFixed(2)} m away to the right`
				: '') +
			'. ' +
			(N
				? `The dashed circle is the ball at release; the solid outline and the grains are the ball 1 s later, its deformation drawn ${scaleWords(N)}${boost > 1 ? `, and the pressure’s share of it drawn ${scaleWords(boost)} larger still` : ''}. ` +
					`The tide in the slice is ${sliceWords}; out of the slice ${kind(zz, Math.abs(zz) || 1) === 'still' ? 'nothing' : `${zz < 0 ? 'a stretch' : 'a squeeze'} of ${sTwo(Math.abs(zz))}`}. ` +
					`The trace is ${sTwo(read.trace)}, so the volume changes at ${sTwo(-read.trace)}; the trace-free part is ${sTwo(read.traceFree)}.`
				: 'There is no tide: the ball keeps its size and its shape.')
	);

	// --- the formulas -----------------------------------------------------------------------------------------------
	const E = '\\htmlClass{q-curv}{\\mathcal E}';
	const RHO = '\\htmlClass{q-matter}{\\rho}';
	const P = '\\htmlClass{q-matter}{p}';
	const M = '\\htmlClass{q-matter}{M}';
	const unit = '\\,\\mathrm{s^{-2}}';
	const traceTex = `\\mathrm{tr}\\,${E} = 4\\pi G\\Bigl(${RHO} + \\frac{\\Sigma ${P}}{c^2}\\Bigr) + \\frac{8\\pi G F}{c^3}`;
	const volumeTex = `\\ddot V/V = -\\mathrm{tr}\\,${E}`;

	// --- the dial ---------------------------------------------------------------------------------------------------
	let dialSvg: SVGSVGElement | undefined;
	const holdDial = (node: SVGSVGElement) => {
		dialSvg = node;
		return () => (dialSvg = undefined);
	};
	let turning = $state(false);

	function dialAngle(e: PointerEvent) {
		const m = dialSvg?.getScreenCTM();
		if (!m) return;
		const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		const a = Math.atan2(-(q.y - 32), q.x - 32) / DEG;
		setBeam(Math.round(a));
	}

	function dialDown(e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		dialSvg?.setPointerCapture(e.pointerId);
		(e.currentTarget as SVGElement).focus();
		turning = true;
		dialAngle(e);
	}

	function dialMove(e: PointerEvent) {
		if (turning) dialAngle(e);
	}

	function dialKey(e: KeyboardEvent) {
		const next = stepped(beam, e.key, e.shiftKey, BEAM);
		if (next === undefined) return;
		e.preventDefault();
		setBeam(next);
	}

	const needle = $derived.by(() => {
		const th = beam * DEG;
		const d = { x: Math.cos(th), y: -Math.sin(th) };
		const tail = { x: 32 - d.x * 22, y: 32 - d.y * 22 };
		const tip = { x: 32 + d.x * 24, y: 32 + d.y * 24 };
		const len = 8;
		const bx = tip.x - d.x * len;
		const by = tip.y - d.y * len;
		return {
			d: `M${f2(tail.x)},${f2(tail.y)}L${f2(bx)},${f2(by)}`,
			head: `${f2(tip.x)},${f2(tip.y)} ${f2(bx + d.y * 4)},${f2(by - d.x * 4)} ${f2(bx - d.y * 4)},${f2(by + d.x * 4)}`
		};
	});

	const beamText = $derived(
		`${Math.round(beam)}° anticlockwise from the ${mass > 0 ? 'line to the mass' : 'horizontal'}`
	);
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="ricci-weyl">
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
				Put the ball inside water with nothing else nearby. Does it change its shape, its size, or
				both?
			{:else if step === 2}
				Take it out of the water and bring a mass near. What changes now?
			{:else}
				Turn on a beam of light through it. Along which directions is it squeezed?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && firstRead}
				<strong>Only its size.</strong> The trace is <Tex
					math={`4\\pi G${RHO} = ${texTwo(firstRead.trace)}${unit}`}
					trust
				/>, a third of it in every direction, and the trace-free part is zero: the ball shrinks
				evenly and stays round, at <Tex math={`\\ddot V/V = ${texTwo(-firstRead.trace)}${unit}`} />.
				This is the Ricci part, set by the water at the ball.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2 && second}
				<strong>Only its shape.</strong> The trace is zero, so the volume is kept, and the
				trace-free part is the Weyl part: <Tex math="-2a" /> along the line to the mass and <Tex
					math="a"
				/> twice across it, <Tex math="-2 : 1 : 1" />, with <Tex
					math={`a = G${M}/d^3 = ${texTwo(secondA)}${unit}`}
					trust
				/> for {grouped(secondAt?.mass ?? 0)} kg at {secondAt?.distance.toFixed(2)} m. Nothing at the
				ball sets it: it comes from the mass outside.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3 && third}
				<strong>Across the beam only,</strong> by <Tex
					math={`4\\pi GF/c^3 = ${texTwo(thirdK)}${unit}`}
				/> in each of the two directions across it, in the slice and out of it, and by nothing along it
				(for {grouped(thirdAt?.flux ?? 0)} W m⁻²; sunlight gives <Tex
					math={`${texTwo((4 * Math.PI * G * SUNLIGHT) / C ** 3)}${unit}`}
				/>). The trace is twice that: the light’s energy and its momentum flux along the beam count
				equally. This is the Ricci part again, from stress, and it changes the shape as well as the
				size.
			{:else if step === 1}
				The answer appears once the ball is in water, 1000 kg m⁻³, with no mass outside and no beam:
				take the mass outside to zero.
			{:else if step === 2}
				The answer appears once the density is zero and a mass is near, with no beam.
			{:else}
				The answer appears once a beam is on with nothing else at or near the ball: the density and
				the mass outside at zero. Beside water or the mass, the beam’s squeeze is more than twenty
				orders of magnitude too small to see on the same scale.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<radialGradient id="{uid}-stone" cx="0.38" cy="0.34" r="0.75">
					<stop offset="0" class="stone-0" />
					<stop offset="0.65" class="stone-1" />
					<stop offset="1" class="stone-2" />
				</radialGradient>
				<clipPath id="{uid}-clip">
					<rect x="0" y="0" width={box.W} height={box.H} />
				</clipPath>
			</defs>

			<!-- the medium, a wash over the whole slice -->
			{#if wash > 0}
				<rect class="wash" x="0" y="0" width={box.W} height={box.H} rx={8 * u} opacity={wash} />
			{/if}

			<!-- the beam of light -->
			{#if beamLines}
				<g class="beam" opacity={beamLines.opacity} clip-path="url(#{uid}-clip)">
					{#each beamLines.lines as d, i (i)}
						<path {d} />
					{/each}
					<polygon points={beamLines.head} />
				</g>
			{/if}

			<!-- the mass outside, at the slice's edge, with the line to it -->
			{#if stone}
				<line class="tether" x1={box.cx} y1={cy} x2={stone.x - stone.r} y2={cy} />
				<circle class="stone" cx={stone.x} cy={stone.y} r={stone.r} fill="url(#{uid}-stone)" />
			{/if}

			<!-- the principal axes in the slice -->
			{#each arrows as a (a.key)}
				{#if a.k !== 'still'}
					<line class={['axis', a.k]} x1={box.cx} y1={cy} x2={a.line.x} y2={a.line.y} />
				{/if}
			{/each}

			<!-- the ball at release, and a little later -->
			<path class="start" d={startPath} />
			<path class="outline" d={outline} />

			{#each dots as q, i (i)}
				<circle class="grain" cx={f2(q.x)} cy={f2(q.y)} r={(phone.current ? 1.9 : 2.3) * u} />
			{/each}

			<!-- how each axis's ends move, from the dashed circle to the outline -->
			{#each arrows as a (a.key)}
				{#if a.k !== 'still' && a.len > 2.5 * u}
					{@const s = arrowShape(a.from, a.to)}
					<g class={['move', a.k]}>
						<path d={s.d} />
						<polygon points={s.head} />
					</g>
				{/if}
			{/each}
			<circle class="centre" cx={box.cx} {cy} r={2.4 * u} />

			<!-- the words, beside the geometry -->
			<text class="label start-anchor" x={14 * u} y={22 * u}>
				{#if N}
					{fall < 1 ? `after ${t.toFixed(1)} s` : 'after 1 s'}, drawn {scaleWords(N)}
				{:else}
					no tide: the ball keeps its size and shape
				{/if}
			</text>
			{#if N && boost > 1}
				<text class="small dim start-anchor" x={14 * u} y={40 * u}
					>the pressure’s share drawn {scaleWords(boost)} larger still</text
				>
			{/if}
			<text class="small dim start-anchor" x={14 * u} y={box.H - 14 * u}>{medium(rho)}</text>
			{#if stone}
				<text class="small {stone.anchor}" x={stone.lx} y={cy + stone.r + 16 * u}
					>{grouped(mass)} kg</text
				>
				<text class="small dim {stone.anchor}" x={stone.lx} y={cy + stone.r + 31 * u}
					>{distance.toFixed(2)} m away</text
				>
			{/if}
			{#if beamLines}
				<text class="small light mid" x={beamLines.label.x} y={beamLines.label.y}>beam</text>
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch start-key"></span><span>the ball at release</span></li>
			<li><span class="swatch outline-key"></span><span>after 1 s, with its grains</span></li>
			<li><span class="swatch stretch"></span><span>stretch</span></li>
			<li><span class="swatch squeeze"></span><span>squeeze</span></li>
			<li>
				<span class="stone-key"></span><span>the mass outside, its distance not to scale</span>
			</li>
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<fieldset>
				<legend>The medium</legend>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => rho, setRho, DENSITY)}
					role="presentation"
				>
					<Slider
						id="{uid}-rho"
						label="Density of the medium"
						icon={DropletIcon}
						min={DENSITY.min}
						max={DENSITY.max}
						step={DENSITY.step}
						bind:value={() => rho, setRho}
						readout="ρ = {grouped(rho)} kg m⁻³"
						marks={[
							{ at: 0, label: 'empty space, 0' },
							{ at: WATER, label: 'water, 1000 kg m⁻³' },
							{ at: EARTH, label: 'the Earth’s mean density, 5513 kg m⁻³' }
						]}
						marksHint="the ticks mark empty space, water and the Earth’s mean density"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => pLog, setPressure, PRESSURE)}
					role="presentation"
				>
					<Slider
						id="{uid}-p"
						label="Pressure"
						icon={DashboardSpeed01Icon}
						min={PRESSURE.min}
						max={PRESSURE.max}
						step={PRESSURE.step}
						bind:value={() => pLog, setPressure}
						readout="p = {pressureWords}"
						marks={[
							{ at: PRESSURE.min, label: 'no pressure' },
							{ at: pressureSlider(PRESSURES.water), label: 'p/ρc² of water at one atmosphere' },
							{ at: pressureSlider(PRESSURES.earth), label: 'p/ρc² at the Earth’s centre' },
							{ at: pressureSlider(PRESSURES.sun), label: 'p/ρc² at the Sun’s centre' }
						]}
						marksHint="a scale of powers of ten, to 0.3ρc²; the ticks mark water, the Earth’s centre and the Sun’s"
					/>
				</div>
				<p class="under" aria-live="polite">
					{#if pressure > 0 && rho > 0}
						{two(pascals)} Pa{#if boost > 1}; its effect drawn {scaleWords(boost)}, the readouts
							true{/if}
					{:else if pressure > 0}
						no medium, so no pressure
					{/if}
				</p>
			</fieldset>

			<fieldset>
				<legend>The beam of light</legend>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => flux, setFlux, FLUX)}
					role="presentation"
				>
					<Slider
						id="{uid}-flux"
						label="Beam flux F"
						icon={Sun01Icon}
						min={FLUX.min}
						max={FLUX.max}
						step={FLUX.step}
						bind:value={() => flux, setFlux}
						readout="F = {grouped(flux)} W m⁻²"
						marks={[
							{ at: 0, label: 'no beam' },
							{ at: SUNLIGHT, label: 'sunlight at the Earth, 1361 W m⁻²' }
						]}
						marksHint="the ticks mark no beam and sunlight at the Earth"
					/>
				</div>
				<div class="dial-row">
					<svg
						class={['dial', { turning }]}
						viewBox="0 0 64 64"
						role="slider"
						tabindex="0"
						aria-label="The beam’s direction in the slice. Drag round, or use the arrow keys, 5° at a time, 45° with Shift."
						aria-valuemin={0}
						aria-valuemax={359}
						aria-valuenow={Math.round(beam)}
						aria-valuetext={beamText}
						onpointerdown={dialDown}
						onpointermove={dialMove}
						onpointerup={() => (turning = false)}
						onpointercancel={() => (turning = false)}
						onkeydown={dialKey}
						{@attach holdDial}
					>
						<circle class="dial-face" cx="32" cy="32" r="29" />
						{#each [0, 45, 90, 135, 180, 225, 270, 315] as a (a)}
							<line
								class="dial-tick"
								x1={32 + 25 * Math.cos(a * DEG)}
								y1={32 - 25 * Math.sin(a * DEG)}
								x2={32 + 29 * Math.cos(a * DEG)}
								y2={32 - 29 * Math.sin(a * DEG)}
							/>
						{/each}
						<path class="dial-needle" d={needle.d} />
						<polygon class="dial-head" points={needle.head} />
						<circle class="dial-hub" cx="32" cy="32" r="2.6" />
					</svg>
					<div class="dial-words">
						<span class="dial-name">Beam direction</span>
						<span class="dial-value">{Math.round(beam)}°</span>
						<span class="dial-hint"
							>anticlockwise from the {mass > 0 ? 'line to the mass' : 'horizontal'}</span
						>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend>The mass outside</legend>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => mass, setMass, MASS)}
					role="presentation"
				>
					<Slider
						id="{uid}-mass"
						label="Mass outside"
						icon={WeightScaleIcon}
						min={MASS.min}
						max={MASS.max}
						step={MASS.step}
						bind:value={() => mass, setMass}
						readout="M = {grouped(mass)} kg"
						marks={[
							{ at: 0, label: 'no mass outside' },
							{ at: 1000, label: '1000 kg, as the figure opens' }
						]}
						marksHint="the ticks mark no mass and the opening’s 1000 kg"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => distance, setDistance, DISTANCE)}
					role="presentation"
				>
					<Slider
						id="{uid}-d"
						label="Its distance"
						icon={RulerIcon}
						min={DISTANCE.min}
						max={DISTANCE.max}
						step={DISTANCE.step}
						bind:value={() => distance, setDistance}
						readout="d = {distance.toFixed(2)} m"
						ends={['0.5 m', '5 m']}
					/>
				</div>
			</fieldset>
		</div>

		<div class="controls">
			<button type="button" class="action" onclick={play} disabled={playing}>
				<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
				Let the ball fall again
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to water and the mass
			</button>
		</div>
		<p class="hint">
			Reach each slider and the dial with Tab; the arrow keys step them, Shift by larger steps.
			Press a tick under a slider to go to its value.
		</p>
	</div>

	<div class="readouts">
		<dl aria-live="polite">
			<div class="row">
				<dt>Trace</dt>
				<dd>
					{@render eq([traceTex, `= ${texTwo(read.trace)}${unit}`])}
				</dd>
			</div>
			<div class="row">
				<dt>Volume</dt>
				<dd>
					{@render eq([volumeTex, `= ${texTwo(read.volumeRate)}${unit}`])}<span class="also"
						>{read.trace > 0
							? 'the ball shrinks'
							: read.trace < 0
								? 'the ball swells'
								: 'the volume is kept'}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Trace-free part</dt>
				<dd>
					{@render eq([`${texTwo(read.traceFree)}${unit}`])}<span class="also"
						>Weyl (from the mass outside) {sTwo(read.weylSize)}; Ricci (from the beam’s stress; an
						even pressure adds none) {sTwo(read.ricciTraceFree)}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Shape</dt>
				<dd>
					<span class="also"
						>longest over shortest axis in the slice, as drawn: <span class="value plain"
							>{shape.drawn.toFixed(3)}</span
						>; after 1 s in truth, {shape.excess === 0
							? '1: the ball stays round'
							: `1 + ${two(shape.excess)}`}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Principal values</dt>
				<dd>
					<span class="also values"
						>{#each principalList as q, i (i)}{i ? '; ' : ''}<span class={['value', q.k]}
								>{sTwo(q.value)}</span
							>&#32;{q.where}{/each}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each grain moves by <Tex math={`\\xi(t) = \\xi_0 - \\tfrac12 ${E}\\,\\xi_0 t^2`} trust />,
			with <Tex math={E} trust /> the tide at the ball’s centre in its falling frame, which does not turn:
			the Ricci part
			<Tex
				math={`\\tfrac{4\\pi G}{3}(${RHO} + \\Sigma ${P}/c^2)\\,\\delta_{ij} - \\tfrac{4\\pi G}{c^2}(T_{ij} - \\tfrac13\\delta_{ij}T_{kk})`}
				trust
			/> from the medium and the beam, and the Weyl part <Tex
				math={`(G${M}/d^3)(\\delta_{ij} - 3\\hat m_i\\hat m_j)`}
				trust
			/> from the mass, <Tex math="\hat m" /> toward it. The medium’s, the beam’s and the mass’s tides
			are drawn on one scale, the largest power of ten (times 1, 2 or 5) that keeps every radius within
			40 per cent of its start; only the pressure’s share is drawn larger, as stated. A negative principal
			value is a <span class="stretch">stretch</span>, a positive one a
			<span class="squeeze">squeeze</span>; the size of a trace-free part is its largest principal
			value in size.
		</p>
	</div>
</div>

<style>
	.ricci-weyl {
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
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 45% 45%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.stage svg {
		display: block;
		width: 100%;
		max-width: 640px;
		height: auto;
		margin: 0 auto;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	/* the words keep a halo of the ground, so a line of the beam never runs through them */
	.label,
	.small {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.mid {
		text-anchor: middle;
	}

	.start-anchor {
		text-anchor: start;
	}

	.end-anchor {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-faint);
	}

	.light {
		fill: var(--q-light);
		font-weight: 600;
	}

	.wash {
		fill: var(--accent-2);
	}

	.beam path {
		fill: none;
		stroke: var(--q-light);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.beam polygon {
		fill: var(--q-light);
	}

	.tether {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.stone {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.stone-0 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 22%,
			color-mix(in srgb, var(--text) 62%, var(--bg))
		);
	}

	.stone-1 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 14%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
	}

	.stone-2 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 8%,
			color-mix(in srgb, var(--text) 24%, var(--bg))
		);
	}

	.axis {
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
		opacity: 0.75;
	}

	.axis.stretch,
	.move.stretch path {
		stroke: var(--accent);
	}

	.axis.squeeze,
	.move.squeeze path {
		stroke: var(--accent-2);
	}

	.move path {
		fill: none;
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.move.stretch polygon {
		fill: var(--accent);
	}

	.move.squeeze polygon {
		fill: var(--accent-2);
	}

	.start {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.outline {
		fill: color-mix(in srgb, var(--q-obs) 7%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.grain {
		fill: var(--q-obs);
	}

	.centre {
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
		border-top: 2px solid;
	}

	.start-key {
		border-top-style: dashed;
		border-top-width: 1.5px;
		border-color: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.outline-key {
		border-color: var(--text);
	}

	.swatch.stretch {
		border-color: var(--accent);
	}

	.swatch.squeeze {
		border-color: var(--accent-2);
	}

	.stone-key {
		flex: none;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		background: color-mix(
			in srgb,
			var(--q-matter) 16%,
			color-mix(in srgb, var(--text) 45%, var(--bg))
		);
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

	fieldset {
		display: grid;
		align-content: start;
		gap: 0.55rem;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend {
		padding: 0;
		margin-bottom: 0.35rem;
		font: italic 500 0.86rem/1.3 var(--font-serif);
		color: var(--text-dim);
	}

	.slot {
		min-width: 0;
	}

	.under {
		margin: -0.2rem 0 0;
		font-size: 0.68rem;
		line-height: 1.35;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	.dial-row {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.dial {
		flex: none;
		width: 64px;
		height: 64px;
		cursor: grab;
		touch-action: none;
		border-radius: 50%;
	}

	.dial.turning {
		cursor: grabbing;
	}

	.dial:focus {
		outline: none;
	}

	.dial:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.dial-face {
		fill: var(--bg);
		stroke: var(--line-strong);
		stroke-width: 1;
	}

	.dial-tick {
		stroke: var(--text-faint);
		stroke-width: 1;
	}

	.dial-needle {
		stroke: var(--q-light);
		stroke-width: 2;
		stroke-linecap: round;
	}

	.dial-head {
		fill: var(--q-light);
	}

	.dial-hub {
		fill: var(--text);
	}

	.dial-words {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.dial-name {
		font-size: 0.8rem;
		color: var(--text);
	}

	.dial-value {
		font: 500 0.74rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
		color: var(--accent);
	}

	.dial-hint {
		font-size: 0.68rem;
		color: var(--text-dim);
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

	.action:disabled {
		opacity: 0.55;
		cursor: default;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover:not(:disabled) {
			border-color: var(--accent);
		}
	}

	.hint {
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
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.value {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.value.stretch,
	.note .stretch {
		color: var(--accent);
	}

	.value.squeeze,
	.note .squeeze {
		color: var(--accent-2);
	}

	.value.plain {
		color: var(--text);
	}

	.value.still {
		color: var(--text-dim);
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
			padding: 0.5rem 0.5rem 0.6rem;
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
