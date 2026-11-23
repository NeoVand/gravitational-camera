<script lang="ts">
	/**
	 * Chapter 2.1's mean value property, in two pictures. The square: 40 × 40 cells whose edge values the reader sets
	 * (a pattern, x² − y², x³ − 3xy² or zero, and four sliders that raise each edge most at its middle), while the
	 * inside relaxes by Jacobi's method, 200 sweeps a frame, to the harmonic function with those edges, drawn as a
	 * diverging map in the field's colour with lines of constant h. A probe circle, moved by pointer or arrow keys and
	 * resized by its knob or + and −, reads the value at its centre and the average round it, and a plot beside the
	 * square unrolls h round the circle. The gold: the 324 kg of the locked safe, 3.92 m from the camera, and a sphere
	 * about the camera whose radius the reader sets; a seeded draw of points over the sphere averages the gold's
	 * potential, against −GM/D while the ball holds no gold and −GM/R once it does. The maths is in ./mean-value.ts.
	 * Three predictions at the top, two for the square and one for the gold.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AlignBottomIcon,
		AlignLeftIcon,
		AlignRightIcon,
		AlignTopIcon,
		DiceIcon,
		RadialIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { grouped, texNumber } from '../../ui/format';
	import {
		CELLS,
		CIRCLE_POINTS,
		DRAW,
		EDGES,
		FLAT,
		GOLD_AT_CAMERA,
		GOLD_DISTANCE,
		GOLD_MASS,
		NODES,
		PATTERNS,
		circle,
		circleInside,
		contour,
		edgeScale,
		extremes,
		goldAverage,
		holdsGold,
		lineLevels,
		lineStep,
		plate,
		relax,
		sampledGoldAverage,
		setEdges,
		spherePoints,
		valueAt,
		type Edge,
		type Pattern,
		type Raise
	} from './mean-value';

	const uid = $props.id();

	/** Sweeps of the averaging in one frame. */
	const PER_FRAME = 200;
	/** The averaging has settled when no value changes by more than this, times the edges' largest size, in a sweep. */
	const SETTLED = 1e-9;
	/** The probe's least and largest radius, and its steps by key. */
	const LEAST_R = 0.1;
	const MOST_R = 1.2;
	const R_STEP = 0.05;
	/** The sphere round the camera: its least and largest radius, m. */
	const SPHERE_LEAST = 0.5;
	const SPHERE_MOST = 6;
	/** How many of the draw's points are drawn on a sphere of 4 m or more: fewer on a smaller one, as its area. */
	const SHOWN = 500;

	// --- the predictions: two for the square, one for the gold -------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	/** The last prediction about the square, to go back to from the gold. */
	let squareStep = $state<1 | 2>(1);
	const view = $derived(step === 3 ? 'gold' : 'square');

	function choose(s: 1 | 2 | 3) {
		step = s;
		if (s !== 3) squareStep = s;
	}

	// --- the square: its edges, and the inside as it relaxes ------------------------------------------------------------
	let pattern = $state<Pattern>('saddle');
	let raise = $state<Raise>({ ...FLAT });

	/** The values, outside Svelte's reach: the relaxation writes them in place, and `version` counts its frames. */
	const sheet = plate('saddle');
	let version = $state(0);
	let settled = $state(true);
	/** Sweeps since the edges last changed, and the largest change in the last sweep. */
	let sweeps = $state(0);
	let change = $state(0);
	const snapshot = $derived({ version, values: sheet.values });

	const scale = $derived(edgeScale(snapshot.values));
	const ext = $derived(extremes(snapshot.values));

	let frame = 0;
	function run() {
		if (frame) return;
		const tick = () => {
			frame = 0;
			change = relax(sheet, PER_FRAME);
			sweeps += PER_FRAME;
			version += 1;
			if (change <= SETTLED * Math.max(1, edgeScale(sheet.values))) settled = true;
			else frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	/** The relaxation stops when the figure leaves the page. */
	const stopOnLeave: Attachment = () => () => {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	};

	/** The edges have changed: set them, and let the inside relax (at once, where motion is to be reduced). */
	function edgesChanged() {
		setEdges(sheet, pattern, raise);
		settled = false;
		sweeps = 0;
		if (prefersReducedMotion.current) {
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			let n = 0;
			do {
				change = relax(sheet, 500);
				n += 500;
			} while (change > SETTLED * Math.max(1, edgeScale(sheet.values)) && n < 200000);
			sweeps = n;
			settled = true;
			version += 1;
		} else {
			version += 1;
			run();
		}
	}

	/** The largest raise the reader has set, for the first prediction. */
	let highest = $state(0);

	function setRaise(edge: Edge, v: number) {
		raise[edge] = Math.round(Math.max(-5, Math.min(5, v)) * 10) / 10;
		highest = Math.max(highest, raise[edge]);
		edgesChanged();
	}

	function choosePattern(p: Pattern) {
		pattern = p;
		raise = { ...FLAT };
		edgesChanged();
	}

	// --- the probe circle ----------------------------------------------------------------------------------------------
	let probe = $state({ x: 0.3, y: 0.2 });
	let radius = $state(0.5);
	/** How far the reader has moved the probe and changed its radius, for the second prediction. */
	let travel = $state(0);

	const clampUnit = (v: number) => Math.max(-1, Math.min(1, v));
	const round = (v: number) => Math.round(v * 1e6) / 1e6;

	function placeProbe(p: { x: number; y: number }) {
		const next = { x: round(clampUnit(p.x)), y: round(clampUnit(p.y)) };
		travel += Math.hypot(next.x - probe.x, next.y - probe.y);
		probe = next;
	}

	function setRadius(r: number) {
		const next = round(Math.max(LEAST_R, Math.min(MOST_R, r)));
		travel += Math.abs(next - radius);
		radius = next;
	}

	const ring = $derived(circle(snapshot.values, probe.x, probe.y, radius));
	const centreValue = $derived(valueAt(snapshot.values, probe.x, probe.y));
	const whole = $derived(circleInside(probe.x, probe.y, radius));
	const difference = $derived(ring.average - centreValue);
	/** The two agree within the grid's accuracy: a thousandth of the edges' largest size, or of 1. */
	const tolerance = $derived(1e-3 * Math.max(1, scale));
	const agree = $derived(Math.abs(difference) <= tolerance);

	// --- the gold round the camera -------------------------------------------------------------------------------------
	let sphere = $state(2);
	let seed = $state(1);
	/** The largest radius the reader has set, for the third prediction. */
	let widest = $state(2);
	const points = $derived(spherePoints(seed));
	const sampled = $derived(sampledGoldAverage(points, sphere));
	const exact = $derived(goldAverage(sphere));
	const holds = $derived(holdsGold(sphere));
	/** The sphere passes through the gold, within a step of the slider. */
	const touching = $derived(Math.abs(sphere - GOLD_DISTANCE) < 0.025);

	function setSphere(v: number) {
		sphere = Math.round(Math.max(SPHERE_LEAST, Math.min(SPHERE_MOST, v)) * 100) / 100;
		widest = Math.max(widest, sphere);
	}

	// --- the answers ---------------------------------------------------------------------------------------------------
	const revealed = $derived(
		step === 1 ? highest >= 2 && settled : step === 2 ? travel >= 1 : widest > GOLD_DISTANCE
	);

	// --- the layout: the picture on the left and its plot on the right, or one above the other on a phone -----------
	const phone = new MediaQuery('max-width: 560px', false);
	const layout = $derived(
		phone.current
			? {
					W: 340,
					H: 570,
					sq: { x: 32, y: 22, s: 290 },
					cut: { cx: 170, cy: 158, k: 22.5 },
					plot: { x: 40, y: 400, w: 284, h: 120 },
					title: 370
				}
			: {
					W: 680,
					H: 380,
					sq: { x: 40, y: 22, s: 330 },
					cut: { cx: 196, cy: 186, k: 25 },
					plot: { x: 444, y: 62, w: 216, h: 232 },
					title: 30
				}
	);
	const viewBox = $derived(`0 0 ${layout.W} ${layout.H}`);

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	// --- the square's drawing ------------------------------------------------------------------------------------------
	const X = (x: number) => layout.sq.x + ((x + 1) / 2) * layout.sq.s;
	const Y = (y: number) => layout.sq.y + ((1 - y) / 2) * layout.sq.s;
	const cell = $derived(layout.sq.s / CELLS);

	/** The lines of constant h, a path each, sorted into those above zero, below it, and zero itself. */
	const step_ = $derived(lineStep(scale));
	const lines = $derived(
		lineLevels(scale, step_).map((level) => {
			const segs = contour(snapshot.values, level);
			let d = '';
			for (let n = 0; n < segs.length; n += 4)
				d += `M${f1(X(segs[n]))},${f1(Y(segs[n + 1]))}L${f1(X(segs[n + 2]))},${f1(Y(segs[n + 3]))}`;
			return { level, d, kind: Math.abs(level) < 1e-12 ? 'zero' : level > 0 ? 'above' : 'below' };
		})
	);

	/**
	 * The map's two masks, painted on a canvas of one pixel a node and stretched over the square, which smooths them:
	 * white where h is far above zero (or below), black at zero. The colours stay in the stylesheet, for both themes.
	 */
	let canvas: HTMLCanvasElement | undefined;
	function maskOf(values: Float64Array, size: number, sign: 1 | -1): string {
		canvas ??= document.createElement('canvas');
		canvas.width = NODES;
		canvas.height = NODES;
		const context = canvas.getContext('2d');
		if (!context) return '';
		const image = context.createImageData(NODES, NODES);
		for (let k = 0; k < NODES * NODES; k++) {
			const t = (sign * values[k]) / size;
			const level = t > 0 ? Math.round(255 * Math.min(1, t) ** 0.85) : 0;
			image.data[4 * k] = level;
			image.data[4 * k + 1] = level;
			image.data[4 * k + 2] = level;
			image.data[4 * k + 3] = 255;
		}
		context.putImageData(image, 0, 0);
		return canvas.toDataURL();
	}
	const shade =
		(sign: 1 | -1): Attachment<SVGImageElement> =>
		(image) => {
			image.setAttribute('href', maskOf(snapshot.values, scale, sign));
		};

	/** The probe's knob, on the circle to the right of its centre, where the angle round it starts. */
	/**
	 * The probe's knob, which sets its radius: on the circle at the first of eight directions, from the right going
	 * round, that falls in the square, so that it can always be reached.
	 */
	const knob = $derived.by(() => {
		let th = 0;
		for (let k = 0; k < 8; k++) {
			const a = (k * Math.PI) / 4;
			const x = probe.x + radius * Math.cos(a);
			const y = probe.y + radius * Math.sin(a);
			if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
				th = a;
				break;
			}
		}
		return { x: X(probe.x + radius * Math.cos(th)), y: Y(probe.y + radius * Math.sin(th)) };
	});

	// --- the plot of h round the circle -----------------------------------------------------------------------------
	const P = $derived(layout.plot);
	const angleX = (n: number) => P.x + (P.w * (n + 0.5)) / CIRCLE_POINTS;
	const valueY = (v: number) =>
		P.y + ((scale - Math.max(-1.08 * scale, Math.min(1.08 * scale, v))) / (2 * scale)) * P.h;
	const ringPath = $derived.by(() => {
		let d = '';
		let open = false;
		for (let n = 0; n < CIRCLE_POINTS; n++) {
			const v = ring.samples[n];
			if (Number.isNaN(v)) {
				open = false;
				continue;
			}
			d += `${open ? 'L' : 'M'}${f1(angleX(n))},${f1(valueY(v))}`;
			open = true;
		}
		return d;
	});
	const angleTicks = [0, 90, 180, 270, 360];
	/** A value for an axis: a number of the steps of the lines, written plainly. */
	const plain = (v: number) => {
		const t = Number(v.toPrecision(3));
		return `${t < 0 ? '−' : ''}${Math.abs(t)}`;
	};

	// --- the gold's drawing --------------------------------------------------------------------------------------------
	const C = $derived(layout.cut);
	const cutX = (x: number) => C.cx + C.k * x;
	const cutY = (y: number) => C.cy - C.k * y;
	const shown = $derived(Math.max(12, Math.round(SHOWN * Math.min(1, (sphere / 4) ** 2))));
	/** The dots of the draw, seen from the side: deeper colour where the gold's potential is deeper. */
	const dots = $derived.by(() => {
		const out: { x: number; y: number; o: number }[] = [];
		const nearest = Math.max(Math.abs(GOLD_DISTANCE - sphere), 0.25);
		for (let n = 0; n < shown; n++) {
			const px = sphere * points[3 * n];
			const py = sphere * points[3 * n + 1];
			const pz = sphere * points[3 * n + 2];
			const r = Math.hypot(px - GOLD_DISTANCE, py, pz);
			out.push({ x: cutX(px), y: cutY(py), o: 0.12 + 0.58 * Math.min(1, nearest / r) });
		}
		return out;
	});

	/** The plot of the average against the radius: R to 6 m, the average from 0 down to −6 × 10⁻⁹ J kg⁻¹. */
	const radiusX = (R: number) => P.x + (P.w * R) / SPHERE_MOST;
	const averageY = (phi: number) => P.y + (-phi / 6e-9) * P.h;
	const averagePath = $derived.by(() => {
		let d = '';
		for (let k = 0; k <= 120; k++) {
			const R = (SPHERE_MOST * k) / 120;
			d += `${k ? 'L' : 'M'}${f1(radiusX(R))},${f1(averageY(goldAverage(R)))}`;
		}
		return d;
	});

	// --- moving the probe: by pointer, or by the keys ------------------------------------------------------------------
	type Handle = 'probe' | 'knob';
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<Handle | undefined>();

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return {
			x: ((p.x - layout.sq.x) / layout.sq.s) * 2 - 1,
			y: 1 - ((p.y - layout.sq.y) / layout.sq.s) * 2
		};
	}

	function apply(h: Handle, p: { x: number; y: number }) {
		if (h === 'probe') placeProbe(p);
		else setRadius(Math.round(Math.hypot(p.x - probe.x, p.y - probe.y) / 0.01) * 0.01);
	}

	/** Pointer moves, at most one a frame. */
	let pending: { x: number; y: number } | undefined;
	let moveFrame = 0;
	function schedule(p: { x: number; y: number }) {
		pending = p;
		if (moveFrame) return;
		moveFrame = requestAnimationFrame(() => {
			moveFrame = 0;
			if (dragging && pending) apply(dragging, pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, h: Handle) {
		if (e.button !== 0) return;
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = h;
	}

	/** A press on the open square, with a mouse or a pen, brings the probe there. */
	function press(e: PointerEvent) {
		if (view !== 'square' || e.pointerType === 'touch' || e.button !== 0) return;
		const p = local(e);
		if (Math.abs(p.x) > 1 || Math.abs(p.y) > 1) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = 'probe';
		placeProbe(p);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(local(e));
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent) {
		const s = e.shiftKey ? 0.2 : 0.05;
		const d = {
			ArrowLeft: { x: -s, y: 0 },
			ArrowRight: { x: s, y: 0 },
			ArrowUp: { x: 0, y: s },
			ArrowDown: { x: 0, y: -s }
		}[e.key];
		if (d) {
			e.preventDefault();
			placeProbe({ x: probe.x + d.x, y: probe.y + d.y });
			return;
		}
		if (e.key === '+' || e.key === '=') {
			e.preventDefault();
			setRadius(radius + R_STEP);
		} else if (e.key === '-' || e.key === '_' || e.key === '−') {
			e.preventDefault();
			setRadius(radius - R_STEP);
		}
	}

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const PHI = '\\htmlClass{q-field}{\\Phi}';
	const MASS = '\\htmlClass{q-matter}{M}';
	const PER_KG = '\\,\\mathrm{J\\,kg^{-1}}';
	/** A value of h to three places, with a true minus. */
	const three = (v: number) => (Math.abs(v) < 5e-4 ? '0.000' : v.toFixed(3));
	const threeWords = (v: number) => three(v).replace('-', '−');
	const perKg = (v: number) => `${texNumber(v, 3)}${PER_KG}`;

	const patternTex = $derived(PATTERNS[pattern].tex);
	const raisedWords = $derived(
		EDGES.filter((e) => raise[e] !== 0).map(
			(e) =>
				`the ${e} edge ${raise[e] > 0 ? 'raised' : 'lowered'} by ${Math.abs(raise[e]).toFixed(1)}`
		)
	);
	/** A raise as the slider shows it: "+2.0", "−1.5", "0". */
	const raiseReadout = (v: number) =>
		v === 0 ? '0' : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`;

	const edgeNames: Record<Edge, { label: string; icon: typeof AlignTopIcon }> = {
		top: { label: 'Top edge', icon: AlignTopIcon },
		bottom: { label: 'Bottom edge', icon: AlignBottomIcon },
		left: { label: 'Left edge', icon: AlignLeftIcon },
		right: { label: 'Right edge', icon: AlignRightIcon }
	};
	const sliderOrder: Edge[] = ['top', 'bottom', 'left', 'right'];

	const verdict = $derived(!settled ? 'settling' : !whole ? 'outside' : agree ? 'equal' : 'apart');
	const goldVerdict = $derived(touching ? 'through' : holds ? 'holds' : 'empty');
	/** How much smaller in size the average is than the value at the camera, %. */
	const smaller = $derived(Math.round(100 * (1 - exact / GOLD_AT_CAMERA)));

	/** The draw's standard error in the unit of the readout. */
	const errorTex = $derived(`${texNumber(sampled.error, 2)}${PER_KG}`);

	const description = $derived(
		view === 'square'
			? `A square of 40 by 40 cells. Its edges hold ${PATTERNS[pattern].words}${raisedWords.length ? ', with ' + raisedWords.join(', ') : ''}. The inside is ${settled ? 'settled' : 'settling'}; its values run from ${threeWords(ext.insideMin)} to ${threeWords(ext.insideMax)}, and the edges' from ${threeWords(ext.edgeMin)} to ${threeWords(ext.edgeMax)}. The probe circle, of radius ${radius.toFixed(2)} about (${threeWords(probe.x)}, ${threeWords(probe.y)}), averages ${threeWords(ring.average)}; the value at its centre is ${threeWords(centreValue)}.`
			: `A cut through the camera and the gold, 3.92 metres away, with a sphere of radius ${sphere.toFixed(2)} metres about the camera and points drawn on it. Beside it, the gold's potential averaged over the sphere against its radius: level at minus 5.52 times ten to the minus 9 joules per kilogram until the sphere reaches the gold, then minus G M over R.`
	);
	const probeText = $derived(
		`Probe circle, centre (${threeWords(probe.x)}, ${threeWords(probe.y)}), radius ${radius.toFixed(2)}. Arrow keys move it, plus and minus change its radius. Value at the centre ${threeWords(centreValue)}, average round the circle ${threeWords(ring.average)}.`
	);
</script>

<div class="mean-value" {@attach stopOnLeave}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => choose(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Raise one edge as high as you like. Can any point inside rise above it?
			{:else if step === 2}
				Move the probe circle. Do the average and the centre value ever differ?
			{:else}
				Grow the sphere round the camera until it holds the gold. Is the average over it still the
				gold’s potential at the camera?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No.</strong>
				{#if settled}
					The highest value inside is {threeWords(ext.insideMax)}, below the highest on the edges,
					{threeWords(ext.edgeMax)}.
				{/if}
				Each value inside is the average of the values round it, so it cannot stand above all of them,
				and the largest and the smallest values lie on the edges. This is the maximum principle.
				<button type="button" class="next" onclick={() => choose(2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Only where the property does not apply.</strong> With the circle in the square and
				the averaging settled, the two agree to the grid’s accuracy, a thousandth of the edges’
				largest value. They differ while the averaging is still settling, and when part of the
				circle lies outside the square, where <Tex math="h" /> is not defined.
				<button type="button" class="next" onclick={() => choose(3)}>Next prediction</button>
			{:else if revealed}
				<strong>No.</strong> While the ball holds no gold, the average is
				<Tex math={`-G${MASS}/D = ${perKg(GOLD_AT_CAMERA)}`} trust /> at every radius. Once it holds the
				gold it is <Tex math={`-G${MASS}/R`} trust />: at 5 m, <Tex math={perKg(goldAverage(5))} />,
				a fifth smaller in size. Inside the ball the gold is a source, and there its potential is
				not harmonic.
			{:else if step === 1}
				The answer appears when you have raised an edge by 2 or more and the inside has settled.
			{:else if step === 2}
				The answer appears when you have moved the probe circle about, by dragging it or with the
				arrow keys.
			{:else}
				The answer appears when the sphere is wider than 3.92 m.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="family" role="group" aria-label="What to average">
			<button type="button" aria-pressed={view === 'square'} onclick={() => choose(squareStep)}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><rect class="mark-square" x="2.5" y="2.5" width="11" height="11" rx="1" /><circle
						class="mark-probe"
						cx="8"
						cy="8"
						r="3"
					/></svg
				>
				<span class="long">A square of empty space</span><span class="short">The square</span>
			</button>
			<button type="button" aria-pressed={view === 'gold'} onclick={() => choose(3)}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><circle class="mark-sphere" cx="6.5" cy="8" r="5" /><circle
						class="mark-gold"
						cx="13"
						cy="8"
						r="1.8"
					/></svg
				>
				<span class="long">The gold round the camera</span><span class="short">The gold</span>
			</button>
		</div>

		<svg
			class={['picture', { dragging: dragging !== undefined }]}
			{viewBox}
			role="group"
			aria-label={description}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			{#if view === 'square'}
				{@const sq = layout.sq}
				{@const pr = (radius * sq.s) / 2}
				<defs>
					<clipPath id="{uid}-square">
						<rect x={sq.x} y={sq.y} width={sq.s} height={sq.s} />
					</clipPath>
					<mask
						id="{uid}-above"
						maskUnits="userSpaceOnUse"
						x={sq.x}
						y={sq.y}
						width={sq.s}
						height={sq.s}
					>
						<image
							x={sq.x - cell / 2}
							y={sq.y - cell / 2}
							width={sq.s + cell}
							height={sq.s + cell}
							preserveAspectRatio="none"
							{@attach shade(1)}
						/>
					</mask>
					<mask
						id="{uid}-below"
						maskUnits="userSpaceOnUse"
						x={sq.x}
						y={sq.y}
						width={sq.s}
						height={sq.s}
					>
						<image
							x={sq.x - cell / 2}
							y={sq.y - cell / 2}
							width={sq.s + cell}
							height={sq.s + cell}
							preserveAspectRatio="none"
							{@attach shade(-1)}
						/>
					</mask>
				</defs>

				<!-- the map: the field's colour above zero, grey below, deeper the larger h -->
				<rect class="ground" x={sq.x} y={sq.y} width={sq.s} height={sq.s} />
				<rect
					class="map above"
					x={sq.x}
					y={sq.y}
					width={sq.s}
					height={sq.s}
					mask="url(#{uid}-above)"
				/>
				<rect
					class="map below"
					x={sq.x}
					y={sq.y}
					width={sq.s}
					height={sq.s}
					mask="url(#{uid}-below)"
				/>

				<!-- the lines of constant h -->
				<g clip-path="url(#{uid}-square)">
					{#each lines as line (line.level)}
						<path class={['line', line.kind]} d={line.d} />
					{/each}
				</g>
				<rect class="frame" x={sq.x} y={sq.y} width={sq.s} height={sq.s} />

				<!-- the axes' ends -->
				{#each [-1, 0, 1] as v (v)}
					<text class="num" x={X(v)} y={sq.y + sq.s + 20 * u} text-anchor="middle">{plain(v)}</text>
					<text class="num" x={sq.x - 13 * u} y={Y(v) + 3.5 * u} text-anchor="end">{plain(v)}</text>
				{/each}
				<text class="sym" x={sq.x + sq.s + 8 * u} y={sq.y + sq.s + 20 * u}>x</text>
				<text class="sym" x={sq.x - 13 * u} y={sq.y - 9 * u} text-anchor="end">y</text>

				<!-- the highest values: on the edges, and inside -->
				{#if settled}
					{@const e = ext.edgeMaxAt}
					{@const ex = X(e.x) + (e.x <= -1 ? -1 : e.x >= 1 ? 1 : 0) * 6.5 * u}
					{@const ey = Y(e.y) + (e.y >= 1 ? -1 : e.y <= -1 ? 1 : 0) * 6.5 * u}
					<path
						class="highest-edge"
						d="M{f1(ex)},{f1(ey - 4 * u)}L{f1(ex + 4 * u)},{f1(ey)}L{f1(ex)},{f1(ey + 4 * u)}L{f1(
							ex - 4 * u
						)},{f1(ey)}Z"
					/>
					<circle class="highest-inside" cx={X(ext.maxAt.x)} cy={Y(ext.maxAt.y)} r={3.4 * u} />
				{/if}

				<!-- the probe circle: dashed where it leaves the square -->
				<circle class="probe-out" cx={X(probe.x)} cy={Y(probe.y)} r={pr} />
				<g clip-path="url(#{uid}-square)">
					<circle class="probe-ring" cx={X(probe.x)} cy={Y(probe.y)} r={pr} />
				</g>
				<g
					class="probe"
					transform="translate({f1(X(probe.x))} {f1(Y(probe.y))})"
					role="button"
					tabindex="0"
					aria-roledescription="movable circle"
					aria-label={probeText}
					onpointerdown={(e) => grab(e, 'probe')}
					onkeydown={key}
				>
					<circle class="hit" r={Math.max(14 * u, Math.min(pr, 26 * u))} />
					<circle class="focus" r={8 * u} />
					<circle class="centre" r={2.6 * u} />
				</g>
				<g
					class="knob"
					transform="translate({f1(knob.x)} {f1(knob.y)})"
					role="presentation"
					onpointerdown={(e) => grab(e, 'knob')}
				>
					<circle class="hit" r={13 * u} />
					<circle class="handle" r={4 * u} />
				</g>

				<!-- h round the circle, unrolled -->
				<text class="title" x={P.x} y={layout.title}
					><tspan class="it">h</tspan> round the circle</text
				>
				<rect class="panel" x={P.x} y={P.y} width={P.w} height={P.h} />
				{#each [-1, 0, 1] as k (k)}
					<line
						class={['grid', { zero: k === 0 }]}
						x1={P.x}
						x2={P.x + P.w}
						y1={valueY(k * scale)}
						y2={valueY(k * scale)}
					/>
					<text class="num" x={P.x - 5 * u} y={valueY(k * scale) + 3.5 * u} text-anchor="end"
						>{plain(k * scale)}</text
					>
				{/each}
				{#each angleTicks as a (a)}
					<line
						class="tick"
						x1={P.x + (P.w * a) / 360}
						x2={P.x + (P.w * a) / 360}
						y1={P.y + P.h}
						y2={P.y + P.h + 4 * u}
					/>
					<text class="num" x={P.x + (P.w * a) / 360} y={P.y + P.h + 15 * u} text-anchor="middle"
						>{a}°</text
					>
				{/each}
				<text class="words" x={P.x + P.w} y={P.y + P.h + 30 * u} text-anchor="end"
					>angle round the circle</text
				>
				{#if !Number.isNaN(centreValue)}
					<line
						class="centre-line"
						x1={P.x}
						x2={P.x + P.w}
						y1={valueY(centreValue)}
						y2={valueY(centreValue)}
					/>
				{/if}
				{#if !Number.isNaN(ring.average)}
					<line
						class="average-line"
						x1={P.x}
						x2={P.x + P.w}
						y1={valueY(ring.average)}
						y2={valueY(ring.average)}
					/>
				{/if}
				<path class="ring-curve" d={ringPath} />
			{:else}
				<!-- the cut through the camera and the gold -->
				{@const R = sphere * C.k}
				<defs>
					<radialGradient id="{uid}-gold" cx="0.38" cy="0.34" r="0.7">
						<stop offset="0" class="mass-core" />
						<stop offset="0.7" class="mass-body" />
						<stop offset="1" class="mass-edge" />
					</radialGradient>
				</defs>
				<circle class="ball" cx={C.cx} cy={C.cy} r={R} />
				{#each dots as d, i (i)}
					<circle
						class="dot"
						cx={f1(d.x)}
						cy={f1(d.y)}
						r={1.25 * u}
						fill-opacity={d.o.toFixed(2)}
					/>
				{/each}
				<circle class="sphere" cx={C.cx} cy={C.cy} r={R} />
				<line class="tether" x1={C.cx} y1={C.cy} x2={cutX(GOLD_DISTANCE)} y2={C.cy} />
				<text
					class="words halo"
					x={cutX(sphere < 2.25 ? 2.9 : 1.5)}
					y={C.cy - 7 * u}
					text-anchor="middle">3.92 m</text
				>
				<rect
					class="camera"
					x={C.cx - 4 * u}
					y={C.cy - 4 * u}
					width={8 * u}
					height={8 * u}
					rx={1.5 * u}
				/>
				<text class="words halo" x={C.cx} y={C.cy + 18 * u} text-anchor="middle">camera</text>
				<circle
					class="gold"
					cx={cutX(GOLD_DISTANCE)}
					cy={C.cy}
					r={6.5 * u}
					fill="url(#{uid}-gold)"
				/>
				<text class="name halo" x={cutX(GOLD_DISTANCE)} y={C.cy + 20 * u} text-anchor="middle"
					>gold, 324 kg</text
				>
				<text class="words halo" x={C.cx} y={C.cy - R - 7 * u} text-anchor="middle"
					>R = {sphere.toFixed(2)} m</text
				>
				<g class="scale" transform="translate({f1(cutX(-6.3))} {f1(C.cy + 6.3 * C.k)})">
					<path class="rule" d="M0,{-3 * u}V0H{C.k}V{-3 * u}" />
					<text class="num" x={C.k / 2} y={-6 * u} text-anchor="middle">1 m</text>
				</g>

				<!-- the average against the radius -->
				<text class="title" x={P.x} y={layout.title}>Average over the sphere</text>
				<text class="num" x={P.x} y={layout.title + 14 * u}>in units of 10⁻⁹ J kg⁻¹</text>
				<rect class="panel" x={P.x} y={P.y} width={P.w} height={P.h} />
				{#each [0, -2, -4, -6] as v (v)}
					<line
						class={['grid', { zero: v === 0 }]}
						x1={P.x}
						x2={P.x + P.w}
						y1={averageY(v * 1e-9)}
						y2={averageY(v * 1e-9)}
					/>
					<text class="num" x={P.x - 5 * u} y={averageY(v * 1e-9) + 3.5 * u} text-anchor="end"
						>{plain(v)}</text
					>
				{/each}
				{#each [0, 1, 2, 3, 4, 5, 6] as r (r)}
					<line
						class="tick"
						x1={radiusX(r)}
						x2={radiusX(r)}
						y1={P.y + P.h}
						y2={P.y + P.h + 4 * u}
					/>
					<text class="num" x={radiusX(r)} y={P.y + P.h + 15 * u} text-anchor="middle">{r}</text>
				{/each}
				<text class="words" x={P.x + P.w} y={P.y + P.h + 30 * u} text-anchor="end"
					>radius of the sphere, m</text
				>
				<line
					class="reach"
					x1={radiusX(GOLD_DISTANCE)}
					x2={radiusX(GOLD_DISTANCE)}
					y1={P.y}
					y2={P.y + P.h}
				/>
				<text class="words" x={radiusX(GOLD_DISTANCE) + 4 * u} y={P.y + 13 * u}>D = 3.92 m</text>
				<line
					class="camera-line"
					x1={P.x}
					x2={P.x + P.w}
					y1={averageY(GOLD_AT_CAMERA)}
					y2={averageY(GOLD_AT_CAMERA)}
				/>
				<path class="average-curve" d={averagePath} />
				<circle class="drawn" cx={radiusX(sphere)} cy={averageY(sampled.mean)} r={3.6 * u} />
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			{#if view === 'square'}
				<li><span class="swatch above-key"></span><span><Tex math="h" /> above zero</span></li>
				<li><span class="swatch below-key"></span><span><Tex math="h" /> below zero</span></li>
				<li>
					<span class="swatch line-key"></span><span
						>a line of constant <Tex math="h" />, every {plain(step_)}</span
					>
				</li>
				<li><span class="mark highest-edge-key"></span>highest on the edges</li>
				<li><span class="mark highest-inside-key"></span>highest inside</li>
				<li><span class="swatch average-key"></span>the circle and its average</li>
				<li><span class="swatch centre-key"></span>the value at its centre</li>
			{:else}
				<li>
					<span class="swatch curve-key"></span><span
						>the average, <Tex math={`-G${MASS}/D`} trust />, then <Tex
							math={`-G${MASS}/R`}
							trust
						/></span
					>
				</li>
				<li><span class="swatch camera-key"></span>the value at the camera</li>
				<li><span class="mark drawn-key"></span>this draw’s average</li>
				<li><span class="mark dot-key"></span>{shown} of the draw’s points</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		{#if view === 'square'}
			<div class="patterns">
				<span class="group-name" id="{uid}-pattern">Edges from</span>
				<div class="chips" role="group" aria-labelledby="{uid}-pattern">
					{#each ['saddle', 'cubic', 'zero'] as const as p (p)}
						<button
							type="button"
							aria-pressed={pattern === p}
							aria-label={PATTERNS[p].words}
							onclick={() => choosePattern(p)}><Tex math={PATTERNS[p].tex} /></button
						>
					{/each}
				</div>
			</div>
			<div class="sliders">
				{#each sliderOrder as edge (edge)}
					<Slider
						id="{uid}-{edge}"
						label={edgeNames[edge].label}
						icon={edgeNames[edge].icon}
						min={-5}
						max={5}
						step={0.1}
						bind:value={() => raise[edge], (v) => setRaise(edge, v)}
						readout={raiseReadout(raise[edge])}
					/>
				{/each}
			</div>
			<p class="hint">
				Each slider raises (+) or lowers (−) its edge, most at the middle and not at all at the
				corners. Drag the probe circle or its knob, or reach it with Tab: the arrow keys move it,
				and + and − change its radius.
			</p>
		{:else}
			<div class="gold-controls">
				<div class="grow">
					<Slider
						id="{uid}-sphere"
						label="Radius of the sphere"
						icon={RadialIcon}
						min={SPHERE_LEAST}
						max={SPHERE_MOST}
						step={0.05}
						bind:value={() => sphere, setSphere}
						readout="{sphere.toFixed(2)} m"
						marks={[
							{ at: 2, label: 'the chapter’s 2 m' },
							{ at: GOLD_DISTANCE, label: 'through the gold, 3.92 m' },
							{ at: 5, label: 'the chapter’s 5 m' }
						]}
						marksHint="the ticks mark 2 m, the gold’s distance and 5 m"
					/>
				</div>
				<button type="button" class="redraw" onclick={() => (seed += 1)}>
					<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
					New draw
				</button>
			</div>
			<p class="hint">
				Drag the slider, or reach it with Tab and use the arrow keys; the dice draw the
				{grouped(DRAW)} points again.
			</p>
		{/if}
	</div>

	<div class="readouts">
		{#if view === 'square'}
			<dl>
				<div class="row">
					<dt>Edges</dt>
					<dd>
						<Tex math={`h = ${patternTex}`} /><span class="also"
							>{raisedWords.length ? raisedWords.join(', ') : 'no edge raised'}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Averaging</dt>
					<dd aria-live="polite">
						{#if settled}
							<span
								>Settled{sweeps ? ` after ${grouped(sweeps)} sweeps` : ''}: each value inside is the
								average of its four neighbours.</span
							>
						{:else}
							<span class="faint"
								>Settling: {grouped(sweeps)} sweeps so far, and the largest change of a value in the last
								was
								<Tex math={texNumber(change, 2)} />.</span
							>
						{/if}
					</dd>
				</div>
				<div class="row">
					<dt>Highest, lowest</dt>
					<dd>
						<span>on the edges <Tex math={`${three(ext.edgeMax)},\\ ${three(ext.edgeMin)}`} /></span
						><span>inside <Tex math={`${three(ext.insideMax)},\\ ${three(ext.insideMin)}`} /></span>
					</dd>
				</div>
				<div class="row">
					<dt>Probe circle</dt>
					<dd>
						<Tex
							math={`\\mathbf x_0 = (${three(probe.x)},\\ ${three(probe.y)}),\\ R = ${radius.toFixed(2)}`}
						/>
					</dd>
				</div>
				<div class="row">
					<dt>Centre, average</dt>
					<dd>
						<Tex math={`h(\\mathbf x_0) = ${three(centreValue)}`} /><Tex
							math={`\\bar h(R) = ${three(ring.average)}`}
						/><span class="also">differ by <Tex math={three(Math.abs(difference))} /></span>
					</dd>
				</div>
				<div class="row">
					<dt></dt>
					<dd aria-live="polite" class={{ found: verdict === 'equal' }}>
						<strong>
							{#if verdict === 'settling'}
								The averaging has not settled, so the values inside are not yet harmonic, and the
								two need not agree.
							{:else if verdict === 'outside'}
								Part of the circle lies outside the square, where <Tex math="h" /> is not defined. The
								average is taken over the {Math.round(100 * ring.inside)}% inside, and the property
								does not apply.
							{:else if verdict === 'equal'}
								The circle lies in the square and the averaging has settled, so the average equals
								the value at the centre.
							{:else}
								The two differ by more than the grid’s accuracy.
							{/if}
						</strong>
					</dd>
				</div>
			</dl>
			<p class="note">
				The square is a slice of space in which <Tex math="h" /> does not change along the third direction,
				so it is harmonic where <Tex math="\partial_x^2 h + \partial_y^2 h = 0" />, and its averages
				are taken round circles. On a grid of cells of side <Tex math="b = 0.05" />, harmonic means
				that each value inside is the average of its four neighbours. Each sweep replaces every
				value inside by that average, {PER_FRAME} sweeps a frame, until nothing changes.
			</p>
			<p class="note">
				Between the nodes <Tex math="h" /> is read by a smooth cubic through the sixteen nearest. The
				plot unrolls <Tex math="h" /> round the circle, starting at its point to the right of the centre
				and going anticlockwise; its average, <Tex math="\bar h(R)" />, is the level that leaves as
				much of the curve above as below.
			</p>
		{:else}
			<dl>
				<div class="row">
					<dt>The gold</dt>
					<dd>
						<Tex
							math={`${MASS} = ${GOLD_MASS}\\,\\mathrm{kg},\\ D = ${GOLD_DISTANCE}\\,\\mathrm{m}`}
							trust
						/><span
							>at the camera <Tex
								math={`${PHI} = -G${MASS}/D = ${perKg(GOLD_AT_CAMERA)}`}
								trust
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The sphere</dt>
					<dd>
						<Tex math={`R = ${sphere.toFixed(2)}\\,\\mathrm{m}`} /><span class="also"
							>{touching
								? 'through the gold'
								: holds
									? 'the ball holds the gold'
									: 'the ball holds no gold'}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Average over it</dt>
					<dd>
						<span
							>from {grouped(DRAW)} points, <Tex math={perKg(sampled.mean)} />, give or take
							<Tex math={errorTex} /></span
						><span class="also"
							>exactly <Tex
								math={`${holds ? `-G${MASS}/R` : `-G${MASS}/D`} = ${perKg(exact)}`}
								trust
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt></dt>
					<dd aria-live="polite" class={{ found: goldVerdict !== 'holds' }}>
						<strong>
							{#if goldVerdict === 'through'}
								The sphere passes through the gold. Its average is still <Tex
									math={`-G${MASS}/D`}
									trust
								/>: the two formulas meet here.
							{:else if goldVerdict === 'holds'}
								The ball holds the gold, a source, so the gold’s potential is not harmonic in it.
								The average is <Tex math={`-G${MASS}/R`} trust />, {smaller}% smaller in size than
								the value at the camera.
							{:else}
								The ball holds no gold, so the gold’s potential is harmonic in it, and its average
								over the sphere is its value at the camera.
							{/if}
						</strong>
					</dd>
				</div>
			</dl>
			<p class="note">
				The average of <Tex math="1/|\mathbf x - \mathbf y|" /> over a sphere of radius <Tex
					math="R"
				/> about the camera is <Tex math="1/|\mathbf y|" /> when the point <Tex math="\mathbf y" /> lies
				outside the sphere and <Tex math="1/R" /> when it lies inside, so the gold’s potential averages
				<Tex math={`-G${MASS}/D`} trust /> while <Tex math="R < D" /> and <Tex
					math={`-G${MASS}/R`}
					trust
				/>
				beyond.
			</p>
			<p class="note">
				Each draw spreads {grouped(DRAW)} points evenly over the sphere and averages the gold’s potential
				at them; give or take is the spread of those values over the square root of their number. The
				dots are {shown} of the points, seen from the side, deeper in colour where the gold’s potential
				is deeper. The cut is through the camera and the gold, to scale.
			</p>
		{/if}
	</div>
</div>

<style>
	.mean-value {
		/* how strongly the map shows h above and below zero */
		--map-above: 0.62;
		--map-below: 0.34;
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
	.family button:focus-visible,
	.chips button:focus-visible,
	.redraw:focus-visible {
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
		display: grid;
		gap: 0.55rem;
		padding: 0.75rem 0.9rem 0.6rem;
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.family,
	.chips {
		display: grid;
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.family {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		max-width: 27rem;
	}

	.chips {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border-radius: 10px;
		flex: 1 1 auto;
		max-width: 22rem;
	}

	.family button,
	.chips button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border: 0;
		background: transparent;
		color: var(--text-dim);
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.family button {
		min-height: calc(var(--control-height, 2.55rem) - 8px);
		padding: 0.3rem 0.6rem;
		border-radius: 8px;
		font-size: 0.78rem;
	}

	.chips button {
		min-height: 1.9rem;
		padding: 0.2rem 0.4rem;
		border-radius: 7px;
		font-size: 0.8rem;
	}

	@media (hover: hover) {
		.family button:hover,
		.chips button:hover {
			color: var(--text);
		}

		.redraw:hover {
			border-color: var(--accent);
		}
	}

	.family button[aria-pressed='true'],
	.chips button[aria-pressed='true'] {
		background: var(--bg-raised);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.family svg {
		width: 16px;
		height: 16px;
		flex: none;
	}

	.mark-square {
		fill: color-mix(in srgb, currentColor 14%, transparent);
		stroke: currentColor;
		stroke-width: 1.3;
	}

	.mark-probe,
	.mark-sphere {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
	}

	.mark-gold {
		fill: currentColor;
	}

	.family button[aria-pressed='true'] svg {
		color: var(--accent);
	}

	svg.picture {
		display: block;
		width: 100%;
		height: auto;
		overflow: hidden;
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

	.num,
	.words {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(11.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.title .it {
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sym {
		fill: var(--text-dim);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the square */

	.ground {
		fill: var(--bg);
	}

	.map.above {
		fill: var(--q-field);
		fill-opacity: var(--map-above);
	}

	.map.below {
		fill: var(--text);
		fill-opacity: var(--map-below);
	}

	.frame {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.line {
		fill: none;
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-linecap: round;
	}

	.line.above {
		stroke: color-mix(in srgb, var(--q-field) 80%, var(--text));
	}

	.line.below {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.line.zero {
		stroke: color-mix(in srgb, var(--text) 80%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.highest-edge {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.highest-inside {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.probe-out {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 55%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.probe-ring {
		fill: color-mix(in srgb, var(--accent) 7%, transparent);
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.probe,
	.knob {
		cursor: grab;
		touch-action: none;
	}

	.probe:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.centre {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.probe:focus-visible .focus {
		opacity: 1;
	}

	.handle {
		fill: var(--bg);
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	/* the plots */

	.panel {
		fill: color-mix(in srgb, var(--bg) 55%, transparent);
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.zero {
		stroke: var(--line-strong);
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ring-curve {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.average-line {
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.centre-line {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	/* the gold */

	.ball {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
	}

	.sphere {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.dot {
		fill: var(--q-field);
	}

	.tether {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.camera {
		fill: var(--text);
	}

	.gold {
		stroke: color-mix(in srgb, var(--q-matter) 70%, transparent);
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

	.name {
		fill: var(--q-matter);
		font: italic 500 calc(12px * var(--u, 1)) / 1 var(--font-serif);
	}

	.rule {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.reach {
		stroke: color-mix(in srgb, var(--q-matter) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.camera-line {
		stroke: var(--text);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.average-curve {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.drawn {
		fill: var(--accent);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* the legend */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.72rem;
		line-height: 1.4;
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
		width: 1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.above-key,
	.below-key {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
	}

	.above-key {
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--q-field) 8%, transparent),
			color-mix(in srgb, var(--q-field) 62%, transparent)
		);
	}

	.below-key {
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--text) 5%, transparent),
			color-mix(in srgb, var(--text) 34%, transparent)
		);
	}

	.line-key {
		border-color: color-mix(in srgb, var(--q-field) 80%, var(--text));
		border-top-width: 1px;
	}

	.average-key {
		border-color: var(--accent);
		border-top-width: 2px;
	}

	.centre-key,
	.camera-key {
		border-top: 1.5px dashed var(--text);
	}

	.curve-key {
		border-color: var(--q-field);
		border-top-width: 2px;
	}

	.mark {
		flex: none;
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		margin: 0 0.25rem;
	}

	.highest-edge-key {
		background: var(--text);
		transform: rotate(45deg) scale(0.85);
	}

	.highest-inside-key {
		border: 1.4px solid var(--text);
		border-radius: 50%;
	}

	.drawn-key {
		background: var(--accent);
		border-radius: 50%;
	}

	.dot-key {
		width: 0.3rem;
		height: 0.3rem;
		margin: 0 0.35rem;
		background: var(--q-field);
		border-radius: 50%;
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.patterns {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.group-name {
		flex: none;
		font: 500 0.78rem/1.2 var(--font-sans);
		color: var(--text-dim);
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.2rem;
	}

	.gold-controls {
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
	}

	.grow {
		flex: 1 1 auto;
		min-width: 0;
	}

	.redraw {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		margin-top: 0.1rem;
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

	.redraw :global(svg) {
		color: var(--accent);
	}

	.hint {
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
		grid-template-columns: 8.2rem 1fr;
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

	:global(:root[data-theme='light']) .mean-value {
		--map-above: 0.5;
		--map-below: 0.26;
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .mean-value {
			--map-above: 0.5;
			--map-below: 0.26;
		}
	}

	.short {
		display: none;
	}

	@media (max-width: 560px) {
		.long {
			display: none;
		}

		.short {
			display: inline;
		}

		.row {
			grid-template-columns: 6.4rem 1fr;
			gap: 0.1rem 0.6rem;
		}

		.sliders {
			gap: 0.45rem 0.8rem;
		}

		.patterns {
			flex-wrap: wrap;
			gap: 0.4rem;
		}

		.chips {
			max-width: none;
		}

		.gold-controls {
			flex-wrap: wrap;
		}

		.grow {
			flex-basis: 100%;
		}
	}
</style>
