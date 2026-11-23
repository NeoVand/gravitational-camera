<script lang="ts">
	/**
	 * Chapter 2.4's images and the skin of balayage, in a cut through a ball (or across a plane). The image: a unit
	 * source the reader drags inside the ball, its Kelvin image s* = R²s/s² of weight R/s outside, the level lines of
	 * the Dirichlet Green's function they make, whose zero, traced from its values, falls on the sphere, and the
	 * Poisson kernel round it; or a source above a plane, its mirror image and the half-space kernel, a bell. A point
	 * on the boundary, also movable, shows the two terms cancelling there, and two plots unroll the terms and the
	 * kernel along the boundary. The skin: a nugget of mass m and the skin m P that copies its field outside, shaded in
	 * steps that double, with the nugget's equipotentials (solid) and the skin's own, found by quadrature over the
	 * sphere in three dimensions (dashed), and a point X where the two potentials are compared. The maths is in
	 * ./image-charge.ts. Three predictions at the top: two for the skin, one for the image.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { PinIcon, RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import { grid, isolines } from './potential-map';
	import {
		EQUIPOTENTIALS,
		GREEN_LEVELS,
		PLANE_LEAST,
		PLANE_MOST,
		STEP_LEAST,
		STEP_MOST,
		S_MOST,
		S_OPEN,
		Z_LEAST,
		Z_MOST,
		Z_OPEN,
		axisOf,
		ballBands,
		ballKernel,
		ballTerms,
		compareAt,
		kelvinImage,
		kernelBottom,
		kernelIntegral,
		kernelTop,
		planeBands,
		planeKernel,
		planeKernelIntegral,
		planeWidth,
		ringsMass,
		sampleField,
		skinLine,
		skinRings,
		type Point
	} from './image-charge';

	const uid = $props.id();

	/** The picture shows ±VIEW, in units of R (the ball) or metres (the plane). */
	const VIEW = 2.6;
	/** The skin's lines are drawn from this far out, where the quadrature is good to 10⁻⁷. */
	const CLEAR = 1.03;
	/** How close the probe X may come to the centre, in units of R. */
	const PROBE_LEAST = 1.12;
	/** The plane's source may go this far across, and its point y this far, m. */
	const ACROSS = 2;
	const Y_ACROSS = 2.5;

	// --- the predictions and the modes ---------------------------------------------------------------------------------
	type Mode = 'image' | 'skin';
	type Boundary = 'ball' | 'plane';
	let step = $state<1 | 2 | 3>(1);
	let skinStep = $state<1 | 2>(1);
	let mode = $state<Mode>('skin');
	let boundary = $state<Boundary>('ball');
	const plane = $derived(mode === 'image' && boundary === 'plane');

	function choose(k: 1 | 2 | 3) {
		step = k;
		if (k === 3) {
			mode = 'image';
			boundary = 'ball';
		} else {
			skinStep = k;
			mode = 'skin';
		}
	}

	function chooseMode(m: Mode) {
		if (m === 'skin') choose(skinStep);
		else {
			mode = 'image';
			step = 3;
		}
	}

	// --- the source in the ball, shared by the image and the skin -----------------------------------------------------
	let s = $state<Point>({ x: 0, y: S_OPEN });
	/** The direction of the source, kept while it sits at the centre, for the slider. */
	let dir = $state<Point>({ x: 0, y: 1 });
	const t = $derived(Math.hypot(s.x, s.y));

	/** The farthest the nugget has been, whether it has been at the centre, and whether at 0.8 R in the image. */
	let farthest = $state(S_OPEN);
	let sawCentre = $state(false);
	let sawEight = $state(false);

	const r6 = (v: number) => Math.round(v * 1e6) / 1e6;

	function setDistance(v: number) {
		let r = Math.round(Math.max(0, Math.min(S_MOST, v)) * 100) / 100;
		if (r < 0.02) r = 0;
		s = { x: r6(r * dir.x), y: r6(r * dir.y) };
		farthest = Math.max(farthest, r);
		if (r === 0) sawCentre = true;
		if (mode === 'image' && Math.abs(r - 0.8) < 0.005) sawEight = true;
	}

	/** The source moved to p: its distance in hundredths of R, its direction as it falls. */
	function placeSource(p: Point) {
		const r = Math.hypot(p.x, p.y);
		if (r > 1e-9) dir = { x: p.x / r, y: p.y / r };
		setDistance(r);
	}

	// --- the point x on the sphere, the plane's source and its point y, and the probe X -----------------------------
	let xAngle = $state(Math.PI / 6);
	let src = $state({ a: 0, z: Z_OPEN });
	let yA = $state(0.8);
	let q = $state<Point>({ x: 2, y: 1 });

	const xOnSphere = $derived({ x: Math.cos(xAngle), y: Math.sin(xAngle) });
	/** Where the source is drawn: in the ball, or above the plane. */
	const sourceAt = $derived(plane ? { x: src.a, y: src.z } : s);

	function setHeight(v: number) {
		src = { a: src.a, z: Math.round(Math.max(Z_LEAST, Math.min(Z_MOST, v)) * 100) / 100 };
	}

	function placeProbe(p: Point) {
		let x = Math.max(-2.45, Math.min(2.45, p.x));
		let y = Math.max(-2.45, Math.min(2.45, p.y));
		const r = Math.hypot(x, y);
		if (r < PROBE_LEAST) {
			const k = PROBE_LEAST / (r || 1);
			x = r ? x * k : PROBE_LEAST;
			y = r ? y * k : 0;
		}
		q = { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
	}

	// --- the answers -----------------------------------------------------------------------------------------------------
	const revealed = $derived(step === 1 ? farthest >= 0.895 : step === 2 ? sawCentre : sawEight);

	// --- the image, the kernel and the skin ------------------------------------------------------------------------------
	const img = $derived(kelvinImage(s));
	const axis = $derived(axisOf(s));
	const angleOfSource = $derived(Math.atan2(axis.y, axis.x));
	const rings = $derived(skinRings(t));
	const probe = $derived(compareAt(rings, s, q));
	const mass = $derived(ringsMass(rings));
	const integral = $derived(kernelIntegral(t));
	const planeIntegral = $derived(planeKernelIntegral(src.z));

	/** The angle γ between x and s, signed, in degrees, from −180 to 180. */
	const wrap = (a: number) =>
		((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
	const gammaX = $derived(wrap(xAngle - angleOfSource));
	const atX = $derived(ballTerms(xOnSphere, s));
	const kernelAtX = $derived(ballKernel(Math.cos(gammaX), t));
	const distX = $derived(Math.hypot(xOnSphere.x - s.x, xOnSphere.y - s.y));
	const distXImage = $derived(
		img.at ? Math.hypot(xOnSphere.x - img.at.x, xOnSphere.y - img.at.y) : Infinity
	);
	const distY = $derived(Math.hypot(yA - src.a, src.z));

	// --- the layout: the picture on the left and its plots on the right, or one above the other on a phone -----------
	const phone = new MediaQuery('max-width: 560px', false);
	const two = $derived(mode === 'image');
	const layout = $derived.by(() => {
		if (phone.current) {
			const panels = two
				? [
						{ y: 372, h: 96 },
						{ y: 522, h: 100 }
					]
				: [{ y: 372, h: 200 }];
			return {
				W: 340,
				H: two ? 664 : 614,
				cx: 170,
				cy: 168,
				k: 62,
				plot: { x: 48, w: 276 },
				panels
			};
		}
		const panels = two
			? [
					{ y: 40, h: 122 },
					{ y: 226, h: 124 }
				]
			: [{ y: 40, h: 310 }];
		return { W: 720, H: 400, cx: 200, cy: 200, k: 72, plot: { x: 456, w: 244 }, panels };
	});
	const viewBox = $derived(`0 0 ${layout.W} ${layout.H}`);

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f1 = (n: number) => n.toFixed(1);
	const X = (x: number) => layout.cx + layout.k * x;
	const Y = (y: number) => layout.cy - layout.k * y;
	const frame = $derived({
		x: layout.cx - VIEW * layout.k,
		y: layout.cy - VIEW * layout.k,
		s: 2 * VIEW * layout.k
	});

	// --- the level lines of 𝒢_D, traced on a grid -----------------------------------------------------------------------
	const sheet = grid({ left: -VIEW, top: VIEW, width: 2 * VIEW, height: 2 * VIEW, step: 0.02 });
	const path = (loops: Float64Array[]) => {
		let d = '';
		for (const loop of loops) {
			for (let n = 0; n < loop.length; n += 2)
				d += `${n ? 'L' : 'M'}${f1(X(loop[n]))},${f1(Y(loop[n + 1]))}`;
			d += 'Z';
		}
		return d;
	};
	const levels = $derived.by(() => {
		if (mode !== 'image') return [];
		if (plane) {
			const { a, z } = src;
			sampleField(
				sheet,
				(p) => -1 / Math.hypot(p.x - a, p.y - z) + 1 / Math.hypot(p.x - a, p.y + z),
				60
			);
		} else {
			const image = img.at;
			const w = img.weight;
			const sx = s.x;
			const sy = s.y;
			sampleField(
				sheet,
				(p) =>
					-1 / Math.hypot(p.x - sx, p.y - sy) +
					(image ? w / Math.hypot(p.x - image.x, p.y - image.y) : 1),
				60
			);
		}
		return GREEN_LEVELS.map((level) => ({
			level,
			d: path(isolines(sheet, level)),
			kind: level === 0 ? 'zero' : level < 0 ? 'below' : 'above'
		}));
	});

	// --- the bands of the kernel and the skin ------------------------------------------------------------------------
	const ballSteps = STEP_MOST - STEP_LEAST + 1;
	const planeSteps = PLANE_MOST - PLANE_LEAST + 1;
	/** A step's opacity: deeper for the higher steps, eased so that the lower ones stay apart. */
	const opacity = (k: number, n: number) => (0.06 + 0.88 * (k / (n - 1)) ** 0.7).toFixed(3);
	const bands = $derived(ballBands(t, 0.88));
	const strips = $derived(planeBands(src.z, VIEW + ACROSS + 0.1, 0.16, 384));
	const sourceDegrees = $derived((angleOfSource * 180) / Math.PI);

	// --- the skin's own equipotentials, by quadrature ----------------------------------------------------------------
	const skinLines = $derived.by(() => {
		if (mode !== 'skin') return [];
		return EQUIPOTENTIALS.map((d) => {
			const line = skinLine(rings, s, d, CLEAR);
			let p = '';
			for (const run of line.runs) {
				run.forEach((pt, i) => (p += `${i ? 'L' : 'M'}${f1(X(pt.x))},${f1(Y(pt.y))}`));
				if (line.closed) p += 'Z';
			}
			return { d, p };
		});
	});

	// --- the plots ---------------------------------------------------------------------------------------------------------
	const P = $derived(layout.plot);
	const top = $derived(layout.panels[0]);
	const low = $derived(layout.panels[layout.panels.length - 1]);
	/** The angle γ along the plots, −180° to 180°, and the position a across the plane, −VIEW to VIEW. */
	const gx = (deg: number) => P.x + (P.w * (deg + 180)) / 360;
	const ax = (a: number) => P.x + (P.w * (a + VIEW)) / (2 * VIEW);
	const along = (v: number) => (plane ? ax(v) : gx(v));
	const samples = Array.from({ length: 241 }, (_, i) => -180 + (360 * i) / 240);
	const across = Array.from({ length: 241 }, (_, i) => -VIEW + (2 * VIEW * i) / 240);

	/** The least of 1, 2, 5, 10, … at or above v. */
	function nice(v: number) {
		const e = 10 ** Math.floor(Math.log10(v));
		for (const m of [1, 2, 5, 10]) if (m * e >= v * 0.999) return m * e;
		return 10 * e;
	}

	/** The two terms of 4π𝒢_D on the boundary, and their sum, as paths in the top panel. */
	const terms = $derived.by(() => {
		if (mode !== 'image') return undefined;
		const pts = plane
			? across.map((a) => {
					const r = Math.hypot(a - src.a, src.z);
					return { at: ax(a), source: -1 / r, image: 1 / r };
				})
			: samples.map((deg) => {
					const th = angleOfSource + (deg * Math.PI) / 180;
					const v = ballTerms({ x: Math.cos(th), y: Math.sin(th) }, s);
					return { at: gx(deg), ...v };
				});
		const scale = nice(Math.max(...pts.map((p) => Math.max(-p.source, p.image))));
		const yOf = (v: number) => top.y + top.h / 2 - (v / scale) * (top.h / 2) * 0.9;
		const line = (key: 'source' | 'image' | 'sum') =>
			pts
				.map(
					(p, i) =>
						`${i ? 'L' : 'M'}${f1(p.at)},${f1(yOf(key === 'sum' ? p.source + p.image : p[key]))}`
				)
				.join('');
		return { scale, yOf, source: line('source'), image: line('image'), sum: line('sum') };
	});

	/** The log axis of the kernel and the skin, from 0.01 to 1000. */
	const DECADES = [-2, -1, 0, 1, 2, 3];
	const logY = (v: number) =>
		low.y + (low.h * (3 - Math.log10(Math.max(0.01, Math.min(1000, v))))) / 5;
	const decadeLabel = (e: number) => (e < 0 ? (10 ** e).toFixed(-e) : String(10 ** e));
	const kernelPath = $derived(
		samples
			.map(
				(deg, i) =>
					`${i ? 'L' : 'M'}${f1(gx(deg))},${f1(logY(ballKernel(Math.cos((deg * Math.PI) / 180), t)))}`
			)
			.join('')
	);
	/** The plane's kernel on a linear axis, 0 to 1 m⁻². */
	const linY = (v: number) => low.y + low.h - low.h * Math.min(1.02, v);
	const bellPath = $derived(
		across
			.map((a, i) => `${i ? 'L' : 'M'}${f1(ax(a))},${f1(linY(planeKernel(a - src.a, src.z)))}`)
			.join('')
	);
	const bellPeak = $derived(planeKernel(0, src.z));
	const bellWidth = $derived(planeWidth(src.z));

	// --- moving things: by pointer, or by the keys ---------------------------------------------------------------------
	type Handle = 'source' | 'boundary' | 'probe';
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<Handle | undefined>();

	function local(e: PointerEvent): Point {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: (p.x - layout.cx) / layout.k, y: (layout.cy - p.y) / layout.k };
	}

	function apply(h: Handle, p: Point) {
		if (h === 'probe') placeProbe(p);
		else if (h === 'boundary') {
			if (plane) yA = Math.round(Math.max(-Y_ACROSS, Math.min(Y_ACROSS, p.x)) * 100) / 100;
			else xAngle = Math.atan2(p.y, p.x);
		} else if (plane) {
			src = {
				a: Math.round(Math.max(-ACROSS, Math.min(ACROSS, p.x)) * 100) / 100,
				z: Math.round(Math.max(Z_LEAST, Math.min(Z_MOST, p.y)) * 100) / 100
			};
		} else placeSource(p);
	}

	/** Pointer moves, at most one a frame. */
	let pending: Point | undefined;
	let moveFrame = 0;
	function schedule(p: Point) {
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

	function move(e: PointerEvent) {
		if (dragging) schedule(local(e));
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, h: Handle) {
		const big = e.shiftKey;
		const d = {
			ArrowLeft: { x: -1, y: 0 },
			ArrowRight: { x: 1, y: 0 },
			ArrowUp: { x: 0, y: 1 },
			ArrowDown: { x: 0, y: -1 }
		}[e.key];
		if (!d) return;
		e.preventDefault();
		if (h === 'boundary') {
			const turn = d.x + d.y;
			if (plane) apply('boundary', { x: yA + turn * (big ? 0.25 : 0.05), y: 0 });
			else xAngle = wrap(xAngle + (turn * (big ? 15 : 5) * Math.PI) / 180);
			return;
		}
		const stepSize = big ? 0.25 : 0.05;
		if (h === 'probe') placeProbe({ x: q.x + d.x * stepSize, y: q.y + d.y * stepSize });
		else if (plane) apply('source', { x: src.a + d.x * stepSize, y: src.z + d.y * stepSize });
		else placeSource({ x: s.x + d.x * stepSize, y: s.y + d.y * stepSize });
	}

	// --- the numbers -----------------------------------------------------------------------------------------------------
	const m = '\\htmlClass{q-matter}{m}';
	const sigma = '\\htmlClass{q-matter}{\\sigma}';
	const per = `${m}/4\\pi R^2`;
	const two2 = (v: number) => v.toFixed(2);
	/** A kernel or a density as the chapter writes it: 6, 190, 5.95, and two figures below 1, 0.22. */
	const three = (v: number) =>
		v >= 100 ? String(Math.round(v)) : String(Number(v.toPrecision(v >= 1 ? 3 : 2)));
	const six = (v: number) => v.toFixed(6);
	const sourceTermBall = '\\mathcal G(\\mathbf s, \\mathbf x)';
	const imageTermBall = '-(R/s)\\,\\mathcal G(\\mathbf s^*, \\mathbf x)';
	const sourceTermPlane = '\\mathcal G(\\mathbf x, \\mathbf y)';
	const imageTermPlane = '-\\mathcal G(\\mathbf x^*, \\mathbf y)';
	/** A relative difference, as a power of ten. */
	const apartTex = (v: number) => (v < 1e-16 ? '10^{-16}' : texNumber(v, 1));

	const imageWords = $derived(
		img.at ? `at ${two2(img.distance)} R, weight ${two2(img.weight)}` : 'at infinity'
	);
	const description = $derived(
		mode === 'skin'
			? `A cut through a ball of radius R and a nugget of mass m at ${two2(t)} R from its centre, with the skin of balayage on the sphere, ${three(kernelTop(t))} times the average over the nugget and ${three(kernelBottom(t))} opposite. Outside the ball the nugget's equipotentials, solid circles, and the skin's own, dashed and found by quadrature, lie on each other. At the point X the two potentials differ by ${probe.apart.toExponential(0)} of their size.`
			: plane
				? `A cut across a plane with a unit source ${two2(src.z)} m above it and its mirror image as far below, the level lines of the Dirichlet Green's function, which vanishes on the plane, and the Poisson kernel under it, a bell of height ${bellPeak.toFixed(2)} per square metre and width ${bellWidth.toFixed(2)} m at half height.`
				: `A cut through a ball of radius R with a unit source at ${two2(t)} R from its centre and its Kelvin image ${imageWords}. The level lines of the Dirichlet Green's function are drawn, and its zero, traced from its values, falls on the sphere. The Poisson kernel round the sphere is ${three(kernelTop(t))} over the source.`
	);

	const sourceLabel = $derived(
		plane
			? `The source x, ${two2(src.z)} metres above the plane. Drag it, or use the arrow keys.`
			: `${mode === 'skin' ? 'The nugget' : 'The source s'}, ${two2(t)} R from the centre. Drag it, or use the arrow keys.`
	);
	const boundaryLabel = $derived(
		plane
			? `The point y on the plane, ${yA.toFixed(2)} metres across. Drag it, or use the arrow keys.`
			: `The point x on the sphere, at ${Math.round((Math.abs(gammaX) * 180) / Math.PI)} degrees from the source. Drag it round, or use the arrow keys.`
	);

	/** Where a label goes beside a point: a little off it, across the ray from the centre. */
	function beside(p: Point, by: number) {
		const r = Math.hypot(p.x, p.y);
		const e = r > 1e-9 ? { x: p.x / r, y: p.y / r } : { x: 0, y: 1 };
		// to the right of the ray, as seen looking outward
		return { x: X(p.x) + e.y * by, y: Y(p.y) + e.x * by };
	}

	/** The side of the source's ray away from x, for the labels of s and s*: 1 to the right looking out, −1 left. */
	const away = $derived(xOnSphere.x * axis.y - xOnSphere.y * axis.x > 0 ? -1 : 1);

	/**
	 * Where the image's two lines of words go: beside it, on the side away from x, while it is far from the ball;
	 * beyond it on its ray once it comes close, where the source and the sphere leave no room beside it. The
	 * baselines of the name and of the weight, and the anchor.
	 */
	function imageTag(p: Point) {
		const e = axis;
		if (img.distance > 1.9) {
			const at = beside(p, away * 16 * u);
			return { x: at.x, name: at.y + 4 * u, weight: at.y + 17 * u, anchor: 'middle' as const };
		}
		const cx = X(p.x);
		const cy = Y(p.y);
		if (Math.abs(e.y) >= 0.6) {
			return e.y > 0
				? { x: cx, name: cy - 24 * u, weight: cy - 11 * u, anchor: 'middle' as const }
				: { x: cx, name: cy + 19 * u, weight: cy + 32 * u, anchor: 'middle' as const };
		}
		return {
			x: cx + (e.x > 0 ? 11 : -11) * u,
			name: cy - 3 * u,
			weight: cy + 10 * u,
			anchor: e.x > 0 ? ('start' as const) : ('end' as const)
		};
	}

	/** The image, or the edge of the picture on its ray when it lies beyond. */
	const imageShown = $derived.by(() => {
		if (img.at && img.distance <= VIEW - 0.15) return { at: img.at, inside: true };
		const reach = VIEW - 0.22;
		return { at: { x: axis.x * reach, y: axis.y * reach }, inside: false };
	});
</script>

<div class="image-charge">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as k (k)}
					<button type="button" aria-pressed={step === k} onclick={() => choose(k)}>{k}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Move the nugget halfway to the wall, then to 0.9 of the way. How much thicker does the skin
				grow over it?
			{:else if step === 2}
				Where must the nugget be for the skin to be uniform?
			{:else}
				Move the source to 0.8 of the radius. Where is its Kelvin image, and what is its weight?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>Six times the average, then 190 times.</strong> Over the nugget the skin’s surface
				density is <Tex math="(1+t)/(1-t)^2" /> in units of <Tex math={per} trust />, the nugget’s
				mass spread evenly, with <Tex math="t = s/R" />: 6 at <Tex math="t = 1/2" /> and 190 at
				<Tex math="t = 0.9" />. Opposite the nugget it thins from 0.22 to 0.028. Its mass stays
				<Tex math={m} trust />, and outside the ball the dashed lines stay on the solid ones.
				<button type="button" class="next" onclick={() => choose(2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>At the centre.</strong> There every point of the sphere is <Tex math="R" /> from the nugget,
				so <Tex math={`${sigma} = ${per}`} trust /> everywhere: a uniform shell, which pulls outside as
				its whole mass at the centre does.
				<button type="button" class="next" onclick={() => choose(3)}>Next prediction</button>
			{:else if revealed}
				<strong>At 1.25 R on the same ray, with the weight 1.25.</strong> The image lies at
				<Tex math="R^2/s" /> and has the weight <Tex math="R/s" />, with the opposite sign. Every
				point of the sphere is <Tex math="R/s" /> times as far from it as from the source, so the two
				terms cancel there.
			{:else if step === 1}
				The answer appears when the nugget has reached 0.9 of the way to the wall.
			{:else if step === 2}
				The answer appears when the nugget is at the centre.
			{:else}
				The answer appears when the source in the ball is at 0.8 of the radius.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="choices">
			<div class="family" role="group" aria-label="What to show">
				<button type="button" aria-pressed={mode === 'image'} onclick={() => chooseMode('image')}>
					<svg viewBox="0 0 16 16" aria-hidden="true"
						><circle class="mark-ring" cx="6" cy="9" r="5" /><circle
							class="mark-dot"
							cx="6"
							cy="6.5"
							r="1.5"
						/><circle class="mark-hollow" cx="6" cy="1.9" r="1.3" /></svg
					>
					<span class="long">The image</span><span class="short">Image</span>
				</button>
				<button type="button" aria-pressed={mode === 'skin'} onclick={() => chooseMode('skin')}>
					<svg viewBox="0 0 16 16" aria-hidden="true"
						><circle class="mark-skin" cx="8" cy="8" r="5.5" /><circle
							class="mark-dot"
							cx="8"
							cy="5.6"
							r="1.5"
						/></svg
					>
					<span class="long">The skin of balayage</span><span class="short">Skin</span>
				</button>
			</div>
			{#if mode === 'image'}
				<div class="chips" role="group" aria-label="The boundary">
					<button
						type="button"
						aria-pressed={boundary === 'ball'}
						onclick={() => (boundary = 'ball')}>A ball</button
					>
					<button
						type="button"
						aria-pressed={boundary === 'plane'}
						onclick={() => (boundary = 'plane')}>A plane</button
					>
				</div>
			{/if}
		</div>

		<svg
			class={['picture', { dragging: dragging !== undefined }]}
			{viewBox}
			role="group"
			aria-label={description}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-frame">
					<rect x={frame.x} y={frame.y} width={frame.s} height={frame.s} />
				</clipPath>
				<mask
					id="{uid}-out"
					maskUnits="userSpaceOnUse"
					x={frame.x}
					y={frame.y}
					width={frame.s}
					height={frame.s}
				>
					<rect x={frame.x} y={frame.y} width={frame.s} height={frame.s} fill="white" />
					<circle cx={X(0)} cy={Y(0)} r={CLEAR * layout.k} fill="black" />
				</mask>
				<radialGradient
					id="{uid}-fade-g"
					gradientUnits="userSpaceOnUse"
					cx={X(0)}
					cy={Y(0)}
					r={VIEW * layout.k}
				>
					<stop offset="0.8" stop-color="white" />
					<stop offset="1" stop-color="black" />
				</radialGradient>
				<mask
					id="{uid}-fade"
					maskUnits="userSpaceOnUse"
					x={frame.x}
					y={frame.y}
					width={frame.s}
					height={frame.s}
				>
					<rect
						x={frame.x}
						y={frame.y}
						width={frame.s}
						height={frame.s}
						fill="url(#{uid}-fade-g)"
					/>
				</mask>
			</defs>

			<g clip-path="url(#{uid}-frame)" mask="url(#{uid}-fade)">
				{#if mode === 'image'}
					<!-- the level lines of 𝒢_D: below zero round the source, above zero round its image -->
					{#each levels as line (line.level)}
						{#if line.kind !== 'zero'}
							<path class={['level', line.kind]} d={line.d} />
						{/if}
					{/each}
				{:else}
					<!-- the nugget's equipotentials, and the skin's own on them -->
					<g mask="url(#{uid}-out)">
						{#each EQUIPOTENTIALS as d (d)}
							<circle class="equipotential" cx={X(s.x)} cy={Y(s.y)} r={d * layout.k} />
						{/each}
						{#each skinLines as line (line.d)}
							<path class="skin-line" d={line.p} />
						{/each}
					</g>
				{/if}

				{#if plane}
					<!-- the plane, and the half-space kernel under it -->
					<rect
						class="below"
						x={frame.x}
						y={Y(0)}
						width={frame.s}
						height={frame.y + frame.s - Y(0)}
					/>
					<g transform="translate({f1(X(src.a))} {f1(Y(0))}) scale({layout.k} {-layout.k})">
						{#each strips as d, k (k)}
							{#if d}<path class="kernel-band" {d} fill-opacity={opacity(k, planeSteps)} />{/if}
						{/each}
					</g>
					<line class="plane" x1={frame.x} x2={frame.x + frame.s} y1={Y(0)} y2={Y(0)} />
				{:else}
					<!-- the ball, and the kernel or the skin just inside it -->
					<circle class="ball" cx={X(0)} cy={Y(0)} r={layout.k} />
					<g
						transform="translate({f1(X(0))} {f1(
							Y(0)
						)}) scale({layout.k} {-layout.k}) rotate({sourceDegrees.toFixed(3)})"
					>
						{#each bands as d, k (k)}
							{#if d}<path
									class={mode === 'skin' ? 'skin-band' : 'kernel-band'}
									{d}
									fill-opacity={opacity(k, ballSteps)}
								/>{/if}
						{/each}
					</g>
					<circle class="sphere" cx={X(0)} cy={Y(0)} r={layout.k} />
					<circle class="centre-dot" cx={X(0)} cy={Y(0)} r={1.8 * u} />
				{/if}

				{#if mode === 'image'}
					{#each levels as line (line.level)}
						{#if line.kind === 'zero'}<path class="level zero" d={line.d} />{/if}
					{/each}
				{/if}
			</g>

			{#if mode === 'image' && !plane}
				{@const b = xOnSphere}
				{@const sh = imageShown}
				<!-- x joined to s and to s* -->
				<line class="tie" x1={X(b.x)} y1={Y(b.y)} x2={X(s.x)} y2={Y(s.y)} />
				{#if img.at && sh.inside}
					<line class="tie" x1={X(b.x)} y1={Y(b.y)} x2={X(img.at.x)} y2={Y(img.at.y)} />
				{/if}
				{#if sh.inside}
					{@const tag = imageTag(sh.at)}
					<circle class="image" cx={X(sh.at.x)} cy={Y(sh.at.y)} r={5 * u} />
					<text class="label halo" x={tag.x} y={tag.name} text-anchor={tag.anchor}
						><tspan class="bold">s</tspan>*</text
					>
					<text class="words halo" x={tag.x} y={tag.weight} text-anchor={tag.anchor}
						>weight {two2(img.weight)}</text
					>
				{:else}
					{@const tip = { x: X(sh.at.x), y: Y(sh.at.y) }}
					{@const e = axis}
					{@const at = beside(sh.at, 14 * u)}
					<path
						class="far"
						d="M{f1(tip.x - e.x * 16 * u)},{f1(tip.y + e.y * 16 * u)}L{f1(tip.x)},{f1(tip.y)}M{f1(
							tip.x - e.x * 5 * u - e.y * 3.5 * u
						)},{f1(tip.y + e.y * 5 * u - e.x * 3.5 * u)}L{f1(tip.x)},{f1(tip.y)}L{f1(
							tip.x - e.x * 5 * u + e.y * 3.5 * u
						)},{f1(tip.y + e.y * 5 * u + e.x * 3.5 * u)}"
					/>
					<text
						class="words halo"
						x={at.x}
						y={at.y + 4 * u}
						text-anchor={Math.abs(e.y) > 0.5 ? (e.y > 0 ? 'start' : 'end') : 'middle'}
						>{img.at ? `s* at ${two2(img.distance)} R` : 's* at infinity'}</text
					>
				{/if}
				<g
					class="handle-group"
					transform="translate({f1(X(b.x))} {f1(Y(b.y))})"
					role="button"
					tabindex="0"
					aria-roledescription="movable point"
					aria-label={boundaryLabel}
					onpointerdown={(e) => grab(e, 'boundary')}
					onkeydown={(e) => key(e, 'boundary')}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={8 * u} />
					<circle class="handle" r={4 * u} />
				</g>
				<text class="label halo" x={X(b.x * 1.16)} y={Y(b.y * 1.16) + 4 * u} text-anchor="middle"
					><tspan class="bold">x</tspan></text
				>
			{/if}

			{#if plane}
				<!-- the source, its mirror image, and y on the plane joined to both -->
				<line class="drop" x1={X(src.a)} y1={Y(src.z)} x2={X(src.a)} y2={Y(-src.z)} />
				<line class="tie" x1={X(yA)} y1={Y(0)} x2={X(src.a)} y2={Y(src.z)} />
				<line class="tie" x1={X(yA)} y1={Y(0)} x2={X(src.a)} y2={Y(-src.z)} />
				<circle class="image" cx={X(src.a)} cy={Y(-src.z)} r={5 * u} />
				<text
					class="label halo"
					x={X(src.a) + (yA >= src.a ? -12 : 12) * u}
					y={Y(-src.z) + 4 * u}
					text-anchor={yA >= src.a ? 'end' : 'start'}
					><tspan class="bold">x</tspan>*<tspan class="words" dx={6 * u}>weight 1</tspan></text
				>
				<text
					class="words halo"
					x={X(src.a) + (yA >= src.a ? -6 : 6) * u}
					y={Y(src.z / 2) + 4 * u}
					text-anchor={yA >= src.a ? 'end' : 'start'}>z = {two2(src.z)} m</text
				>
				<g
					class="handle-group"
					transform="translate({f1(X(yA))} {f1(Y(0))})"
					role="button"
					tabindex="0"
					aria-roledescription="movable point"
					aria-label={boundaryLabel}
					onpointerdown={(e) => grab(e, 'boundary')}
					onkeydown={(e) => key(e, 'boundary')}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={8 * u} />
					<circle class="handle" r={4 * u} />
				</g>
				<text
					class="label halo"
					x={X(yA) + (yA >= src.a ? 10 : -10) * u}
					y={Y(0) - 8 * u}
					text-anchor={yA >= src.a ? 'start' : 'end'}><tspan class="bold">y</tspan></text
				>
			{/if}

			<!-- the source, or the nugget -->
			<g
				class="handle-group"
				transform="translate({f1(X(sourceAt.x))} {f1(Y(sourceAt.y))})"
				role="button"
				tabindex="0"
				aria-roledescription={mode === 'skin' ? 'movable nugget' : 'movable source'}
				aria-label={sourceLabel}
				onpointerdown={(e) => grab(e, 'source')}
				onkeydown={(e) => key(e, 'source')}
			>
				<circle class="hit" r={16 * u} />
				<circle class="focus" r={10 * u} />
				<circle class="source" r={5.5 * u} />
			</g>
			{#if plane}
				<text
					class="label halo"
					x={X(src.a) + (yA >= src.a ? -12 : 12) * u}
					y={Y(src.z) + 4 * u}
					text-anchor={yA >= src.a ? 'end' : 'start'}><tspan class="bold">x</tspan></text
				>
			{:else}
				{@const inward = t >= (mode === 'skin' ? 0.25 : 0.6)}
				{@const at = inward
					? { x: X(s.x) - axis.x * 19 * u, y: Y(s.y) + axis.y * 19 * u }
					: beside(t > 0 ? s : { x: 0, y: 0.001 }, (mode === 'skin' ? -1 : away) * 18 * u)}
				<text class="label halo" x={at.x} y={at.y + 4 * u} text-anchor="middle"
					>{#if mode === 'skin'}<tspan class="matter">m</tspan>{:else}<tspan class="bold">s</tspan
						>{/if}</text
				>
			{/if}

			{#if mode === 'skin'}
				<!-- the point where the two potentials are compared -->
				<g
					class="handle-group"
					transform="translate({f1(X(q.x))} {f1(Y(q.y))})"
					role="button"
					tabindex="0"
					aria-roledescription="movable point"
					aria-label="The point X outside the ball, where the skin's potential and the nugget's are compared. Drag it, or use the arrow keys."
					onpointerdown={(e) => grab(e, 'probe')}
					onkeydown={(e) => key(e, 'probe')}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={8 * u} />
					<circle class="probe" r={4 * u} />
				</g>
				<text
					class="label halo"
					x={X(q.x) + (q.x > 1.9 ? -10 : 10) * u}
					y={Y(q.y) - 8 * u}
					text-anchor={q.x > 1.9 ? 'end' : 'start'}><tspan class="bold">X</tspan></text
				>
			{/if}

			<!-- the scale -->
			<g
				class="scale"
				transform="translate({f1(frame.x + 12 * u)} {f1(frame.y + frame.s - 12 * u)})"
			>
				<path class="rule" d="M0,{-3 * u}V0H{layout.k}V{-3 * u}" />
				<text class="num" x={layout.k / 2} y={-7 * u} text-anchor="middle"
					>{plane ? '1 m' : 'R'}</text
				>
			</g>

			<!-- the plots -->
			{#if mode === 'image' && terms}
				{@const T = top}
				<text class="title" x={P.x} y={T.y - 12 * u}
					>On the {plane ? 'plane' : 'sphere'}, in units of 1/4π{#if plane}&nbsp;m{:else}<tspan
							class="it">R</tspan
						>{/if}</text
				>
				<rect class="panel" x={P.x} y={T.y} width={P.w} height={T.h} />
				{#each [-1, 0, 1] as k (k)}
					<line
						class={['grid', { zero: k === 0 }]}
						x1={P.x}
						x2={P.x + P.w}
						y1={terms.yOf(k * terms.scale)}
						y2={terms.yOf(k * terms.scale)}
					/>
					<text
						class="num"
						x={P.x - 5 * u}
						y={terms.yOf(k * terms.scale) + 3.5 * u}
						text-anchor="end">{k < 0 ? '−' : ''}{k === 0 ? 0 : terms.scale}</text
					>
				{/each}
				<path class="term source-term" d={terms.source} />
				<path class="term image-term" d={terms.image} />
				<path class="term sum-term" d={terms.sum} />

				{@const L = low}
				<text class="title" x={P.x} y={L.y - 12 * u}
					>Poisson kernel {#if plane}<tspan class="it">P</tspan><tspan class="sub" dy={3 * u}
							>z</tspan
						><tspan dy={-3 * u}>, in m⁻²</tspan>{:else}<tspan class="it">P</tspan>, in units of 1/4π<tspan
							class="it">R</tspan
						>²{/if}</text
				>
				<rect class="panel" x={P.x} y={L.y} width={P.w} height={L.h} />
				{#if plane}
					{#each [0, 0.5, 1] as v (v)}
						<line
							class={['grid', { zero: v === 0 }]}
							x1={P.x}
							x2={P.x + P.w}
							y1={linY(v)}
							y2={linY(v)}
						/>
						<text class="num" x={P.x - 5 * u} y={linY(v) + 3.5 * u} text-anchor="end">{v}</text>
					{/each}
					<path class="kernel-curve" d={bellPath} />
					{@const half = bellPeak / 2}
					<line
						class="width"
						x1={ax(src.a - bellWidth / 2)}
						x2={ax(src.a + bellWidth / 2)}
						y1={linY(half)}
						y2={linY(half)}
					/>
					{@const side = yA >= src.a ? -1 : 1}
					{@const edge = ax(src.a + (side * bellWidth) / 2)}
					<text
						class="words halo-panel"
						x={edge + side * 7 * u}
						y={linY(half) - 4 * u}
						text-anchor={side < 0 ? 'end' : 'start'}>{two2(bellWidth)} m</text
					>
					<circle class="peak" cx={ax(src.a)} cy={linY(bellPeak)} r={2.6 * u} />
					<text
						class="words halo-panel"
						x={ax(src.a) + side * 7 * u}
						y={linY(bellPeak) + (bellPeak > 0.85 ? 12 : -5) * u}
						text-anchor={side < 0 ? 'end' : 'start'}>{two2(bellPeak)} m⁻²</text
					>
				{:else}
					{#each DECADES as e (e)}
						<line
							class={['grid', { zero: e === 0 }]}
							x1={P.x}
							x2={P.x + P.w}
							y1={logY(10 ** e)}
							y2={logY(10 ** e)}
						/>
						<text class="num" x={P.x - 5 * u} y={logY(10 ** e) + 3.5 * u} text-anchor="end"
							>{decadeLabel(e)}</text
						>
					{/each}
					<path class="kernel-curve" d={kernelPath} />
				{/if}
				<!-- where x or y stands -->
				{@const mark = plane ? ax(yA) : gx((gammaX * 180) / Math.PI)}
				<line class="marker" x1={mark} x2={mark} y1={T.y} y2={T.y + T.h} />
				<line class="marker" x1={mark} x2={mark} y1={L.y} y2={L.y + L.h} />
				<circle
					class="peak"
					cx={mark}
					cy={plane ? linY(planeKernel(yA - src.a, src.z)) : logY(kernelAtX)}
					r={2.6 * u}
				/>
			{:else if mode === 'skin'}
				{@const L = low}
				<text class="title" x={P.x} y={L.y - 12 * u}
					>Surface density <tspan class="it matter">σ</tspan>, in units of
					<tspan class="it matter">m</tspan>/4π<tspan class="it">R</tspan>²</text
				>
				<rect class="panel" x={P.x} y={L.y} width={P.w} height={L.h} />
				{#each DECADES as e (e)}
					<line
						class={['grid', { zero: e === 0 }]}
						x1={P.x}
						x2={P.x + P.w}
						y1={logY(10 ** e)}
						y2={logY(10 ** e)}
					/>
					<text class="num" x={P.x - 5 * u} y={logY(10 ** e) + 3.5 * u} text-anchor="end"
						>{decadeLabel(e)}</text
					>
				{/each}
				<path class="skin-curve" d={kernelPath} />
				{@const peakY = logY(kernelTop(t))}
				{@const roomAbove = peakY - 16 * u > L.y}
				<circle class="skin-dot" cx={gx(0)} cy={peakY} r={2.8 * u} />
				<text
					class="words halo-panel"
					x={gx(0) + (roomAbove ? 5 : 9) * u}
					y={roomAbove ? peakY - 8 * u : peakY + 4 * u}
					>{t === 0 ? '1 everywhere' : `${three(kernelTop(t))} over the nugget`}</text
				>
				{#if t > 0}
					{@const lowY = logY(kernelBottom(t))}
					<text
						class="words halo-panel"
						x={P.x + P.w - 5 * u}
						y={lowY + 15 * u < L.y + L.h - 3 * u ? lowY + 15 * u : lowY - 7 * u}
						text-anchor="end">{three(kernelBottom(t))} opposite</text
					>
				{/if}
			{/if}
			{#each plane ? [-2, -1, 0, 1, 2] : [-180, -90, 0, 90, 180] as v (v)}
				<line
					class="tick"
					x1={along(v)}
					x2={along(v)}
					y1={low.y + low.h}
					y2={low.y + low.h + 4 * u}
				/>
				<text class="num" x={along(v)} y={low.y + low.h + 15 * u} text-anchor="middle"
					>{v < 0 ? '−' : ''}{Math.abs(v)}{plane ? '' : '°'}</text
				>
			{/each}
			<text class="words" x={P.x + P.w} y={low.y + low.h + 30 * u} text-anchor="end"
				>{#if plane}position across the plane, m{:else}angle <tspan class="it">γ</tspan> from the
					direction of {#if mode === 'skin'}the nugget{:else}<tspan class="bold">s</tspan
						>{/if}{/if}</text
			>
		</svg>

		<ul class="legend" aria-hidden="true">
			{#if mode === 'image'}
				<li>
					<span class="swatch below-key"></span><span
						>levels of <Tex math="\mathcal G_D" /> below zero</span
					>
				</li>
				<li><span class="swatch above-key"></span><span>above zero</span></li>
				<li>
					<span class="swatch zero-key"></span><span
						><Tex math="\mathcal G_D = 0" />, traced from its values</span
					>
				</li>
				<li>
					<span class="swatch kernel-key"></span><span
						>the Poisson kernel, in steps that double</span
					>
				</li>
				<li>
					<span class="swatch source-key"></span><span
						>the source’s term, <Tex math={plane ? sourceTermPlane : sourceTermBall} /></span
					>
				</li>
				<li>
					<span class="swatch image-key"></span><span
						>its image’s, <Tex math={plane ? imageTermPlane : imageTermBall} /></span
					>
				</li>
			{:else}
				<li><span class="swatch equi-key"></span><span>the nugget’s equipotentials</span></li>
				<li>
					<span class="swatch skin-line-key"></span><span
						>the skin’s, by quadrature over the sphere</span
					>
				</li>
				<li><span class="swatch skin-key"></span><span>the skin, in steps that double</span></li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		{#if plane}
			<div class="slide">
				<Slider
					id="{uid}-z"
					label="Height of the source above the plane"
					icon={RulerIcon}
					min={Z_LEAST}
					max={Z_MOST}
					step={0.05}
					bind:value={() => src.z, setHeight}
					readout={`z = ${two2(src.z)} m`}
					ends={['0.4 m', '2 m']}
					marks={[
						{ at: 0.5, label: 'z = 0.5 m: a bell 0.77 m wide' },
						{ at: 1, label: 'z = 1 m: a bell 1.53 m wide' }
					]}
					marksHint="the ticks mark the chapter’s two bells"
				/>
			</div>
			<p class="hint">
				Drag the source <b>x</b> or the point <b>y</b> on the plane, or reach them with Tab and move them
				with the arrow keys (Shift for longer steps).
			</p>
		{:else}
			<div class="slide">
				<Slider
					id="{uid}-s"
					label={mode === 'skin'
						? 'Distance of the nugget from the centre'
						: 'Distance of the source from the centre'}
					icon={PinIcon}
					min={0}
					max={S_MOST}
					step={0.01}
					bind:value={() => t, setDistance}
					readout={`s = ${two2(t)} R`}
					ends={['at the centre', 'near the wall']}
					marks={[
						{ at: 0, label: 's = 0: at the centre' },
						{ at: 0.5, label: 's = R/2: halfway to the wall' },
						{ at: 0.8, label: 's = 0.8 R' },
						{ at: 0.9, label: 's = 0.9 R: 0.9 of the way' }
					]}
					marksHint="the ticks mark the centre, halfway, 0.8 and 0.9 of the way"
				/>
			</div>
			<p class="hint">
				{#if mode === 'skin'}
					Drag the nugget or the point <b>X</b>, or reach them with Tab and move them with the arrow
					keys (Shift for longer steps). The slider moves the nugget along its ray.
				{:else}
					Drag the source <b>s</b>, or the point <b>x</b> round the sphere, or reach them with Tab and
					move them with the arrow keys (Shift for longer steps). The slider moves the source along its
					ray.
				{/if}
			</p>
		{/if}
	</div>

	<div class="readouts">
		{#if mode === 'skin'}
			<dl>
				<div class="row">
					<dt>The nugget</dt>
					<dd>
						<span>mass <Tex math={m} trust /> at <Tex math={`s = ${two2(t)}\\,R`} /></span>
					</dd>
				</div>
				<div class="row">
					<dt>The skin</dt>
					<dd>
						<Tex math={`${sigma} = ${m}\\,P(\\mathbf x, \\mathbf s)`} trust />{#if t === 0}<span
								>everywhere <Tex math={per} trust /></span
							>{:else}<span
								>over the nugget <Tex math={`${three(kernelTop(t))}\\,${per}`} trust /></span
							><span>opposite <Tex math={three(kernelBottom(t))} /></span>{/if}<span class="also"
							>mass by quadrature <Tex math={`${six(mass)}\\,${m}`} trust /></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>At <Tex math="\mathbf X" /></dt>
					<dd>
						<span
							>the skin’s potential <Tex
								math={`${six(probe.skin).replace('-', '−')}\\,G${m}/R`}
								trust
							/></span
						><span
							>the nugget’s <Tex
								math={`${six(probe.nugget).replace('-', '−')}\\,G${m}/R`}
								trust
							/></span
						><span class="also">apart by <Tex math={apartTex(probe.apart)} /> of their size</span>
					</dd>
				</div>
				<div class="row">
					<dt></dt>
					<dd class="found" aria-live="polite">
						<strong>
							{#if t === 0}
								At the centre the skin is uniform, a shell of <Tex math={per} trust />, and pulls
								outside as the nugget does.
							{:else}
								The skin pulls at <Tex math="\mathbf X" />, and everywhere outside the ball, as the
								nugget does.
							{/if}
						</strong>
					</dd>
				</div>
			</dl>
			<p class="note">
				A cut through the centre of a ball of radius <Tex math="R" /> and a nugget of mass <Tex
					math={m}
					trust
				/>. The skin is the nugget’s mass swept onto the sphere, of surface density
				<Tex math={`${m}(R^2-s^2)/4\\pi R\\,|\\mathbf x-\\mathbf s|^3`} trust />, drawn as a band
				just inside it in steps that double, from <Tex math="1/16" /> to 128 times <Tex
					math={per}
					trust
				/>, the nugget’s mass spread evenly. The solid circles are the nugget’s equipotentials, on
				which its potential is <Tex math={`-G${m}/d`} trust />, each a quarter wider than the last.
				The dashed lines are the skin’s own, found by summing its potential over the sphere in three
				dimensions, as {rings.mu.length} rings about the nugget’s axis; they are drawn only outside the
				ball, and they fall on the solid ones. Inside the ball the skin’s potential is not the nugget’s
				but its Kelvin image’s, <Tex math={`-G${m}\\,(R/s)/|\\mathbf x-\\mathbf s^*|`} trust />.
			</p>
		{:else if plane}
			<dl>
				<div class="row">
					<dt>The source</dt>
					<dd>
						<span
							><Tex math="\mathbf x" /> at the height <Tex
								math={`z = ${two2(src.z)}\\,\\mathrm m`}
							/>
							above the plane</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Mirror image</dt>
					<dd>
						<span
							><Tex math="\mathbf x^*" /> at the depth <Tex math={`${two2(src.z)}\\,\\mathrm m`} />
							below it, of the weight 1 and the opposite sign</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>At <Tex math="\mathbf y" /> on the plane</dt>
					<dd>
						<Tex
							math={`|\\mathbf y-\\mathbf x| = |\\mathbf y-\\mathbf x^*| = ${two2(distY)}\\,\\mathrm m`}
						/><span class="also">so the two terms cancel: <Tex math="\mathcal G_D = 0" /></span>
					</dd>
				</div>
				<div class="row">
					<dt>Poisson kernel</dt>
					<dd>
						<span
							>height <Tex
								math={`P_z(0) = 1/2\\pi z^2 = ${two2(bellPeak)}\\,\\mathrm{m^{-2}}`}
							/></span
						><span
							>full width at half height <Tex
								math={`1.53z = ${two2(bellWidth)}\\,\\mathrm m`}
							/></span
						><span class="also">area by quadrature <Tex math={six(planeIntegral)} /></span>
					</dd>
				</div>
				<div class="row">
					<dt></dt>
					<dd class="found" aria-live="polite">
						<strong>
							Every point of the plane is as far from <Tex math="\mathbf x^*" /> as from <Tex
								math="\mathbf x"
							/>, so <Tex math="\mathcal G_D" /> vanishes on the whole plane. The higher the source, the
							lower and wider the bell.
						</strong>
					</dd>
				</div>
			</dl>
			<p class="note">
				A cut across a plane, a camera’s array, with no matter above it. A unit source at
				<Tex math="\mathbf x" /> and one of the opposite sign at its mirror image
				<Tex math="\mathbf x^*" /> make <Tex
					math="\mathcal G_D(\mathbf x, \mathbf y) = \mathcal G(\mathbf x, \mathbf y) - \mathcal G(\mathbf x^*, \mathbf y)"
				/>. The lines are its levels, <Tex math="4\pi\mathcal G_D" /> at <Tex
					math={'\\pm\\tfrac14,\\ \\pm\\tfrac12,\\ \\pm1,\\ \\pm2,\\ \\pm4\\ \\mathrm{m^{-1}}'}
				/>, and its zero, traced from its values on a grid, falls on the plane. The band under the
				plane is the half-space kernel <Tex math={'P_z(\\mathbf a) = z/2\\pi(a^2+z^2)^{3/2}'} />,
				shaded in steps that double, from <Tex math="1/256" /> to <Tex
					math={'1\\ \\mathrm{m^{-2}}'}
				/>: the weights with which the values on the plane make the potential at <Tex
					math="\mathbf x"
				/>.
			</p>
		{:else}
			<dl>
				<div class="row">
					<dt>The source</dt>
					<dd>
						<span
							>a unit source at <Tex math="\mathbf s" />, <Tex math={`s = ${two2(t)}\\,R`} /> from the
							centre</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Kelvin image</dt>
					<dd>
						{#if img.at}
							<Tex math="\mathbf s^* = R^2\mathbf s/s^2" /><span
								>at <Tex math={`R^2/s = ${two2(img.distance)}\\,R`} /></span
							><span>weight <Tex math={`R/s = ${two2(img.weight)}`} />, of the opposite sign</span>
						{:else}
							<span>at infinity: its term is the constant <Tex math="1/4\pi R" /></span>
						{/if}
					</dd>
				</div>
				<div class="row">
					<dt>At <Tex math="\mathbf x" /> on the sphere</dt>
					<dd>
						{#if img.at}
							<Tex
								math={`|\\mathbf x-\\mathbf s^*|/|\\mathbf x-\\mathbf s| = ${(distXImage / distX).toFixed(4)}`}
							/>
						{/if}
						<span class="also"
							>the terms <Tex math={`${atX.source.toFixed(4).replace('-', '−')}`} /> and <Tex
								math={`+${atX.image.toFixed(4)}`}
							/> cancel: <Tex math="\mathcal G_D = 0" /></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Poisson kernel</dt>
					<dd>
						<span
							>at <Tex math="\mathbf x" />, <Tex
								math={`P(\\mathbf x, \\mathbf s) = ${three(kernelAtX)}/4\\pi R^2`}
							/></span
						><span>over the source <Tex math={`(1+t)/(1-t)^2 = ${three(kernelTop(t))}`} /></span
						><span class="also">integral by quadrature <Tex math={six(integral)} /></span>
					</dd>
				</div>
				<div class="row">
					<dt></dt>
					<dd class="found" aria-live="polite">
						<strong>
							{#if img.at}
								Every point of the sphere is <Tex math={`R/s = ${two2(img.weight)}`} /> times as far from
								<Tex math="\mathbf s^*" /> as from <Tex math="\mathbf s" />, so the line where
								<Tex math="\mathcal G_D" /> vanishes is the sphere itself.
							{:else}
								At the centre <Tex math="\mathcal G_D = \mathcal G + 1/4\pi R" /> vanishes on the sphere,
								and the kernel is <Tex math="1/4\pi R^2" /> everywhere: the mean value property.
							{/if}
						</strong>
					</dd>
				</div>
			</dl>
			<p class="note">
				A cut through the centre of a ball of radius <Tex math="R" /> and the source. The lines are levels
				of <Tex
					math="4\pi\mathcal G_D(\mathbf s, \mathbf x) = -1/|\mathbf x-\mathbf s| + (R/s)/|\mathbf x-\mathbf s^*|"
				/>, at <Tex math="\pm\tfrac14,\ \pm\tfrac12,\ \pm1,\ \pm2,\ \pm4" /> in units of <Tex
					math="1/R"
				/>: solid below zero, round the source, and dashed above, round the image. Its zero is
				traced from its values on a grid, not drawn as a circle. The band inside the sphere is the
				Poisson kernel <Tex
					math="P(\mathbf x, \mathbf s) = (R^2-s^2)/4\pi R\,|\mathbf x-\mathbf s|^3"
				/>, shaded in steps that double, from <Tex math="1/16" /> to 128 times <Tex
					math="1/4\pi R^2"
				/>. The terms are in units of <Tex math="1/4\pi R" />.
			</p>
		{/if}
	</div>
</div>

<style>
	.image-charge {
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
		display: grid;
		gap: 0.55rem;
		padding: 0.75rem 0.9rem 0.6rem;
		background: radial-gradient(circle at 50% 45%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.8rem;
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
		flex: 1 1 18rem;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		max-width: 25rem;
	}

	.chips {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-radius: 10px;
		flex: 0 1 12rem;
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
		padding: 0.2rem 0.5rem;
		border-radius: 7px;
		font-size: 0.76rem;
	}

	@media (hover: hover) {
		.family button:hover,
		.chips button:hover {
			color: var(--text);
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

	.mark-ring,
	.mark-skin {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
	}

	.mark-skin {
		stroke-width: 2.2;
		stroke-opacity: 0.75;
	}

	.mark-dot {
		fill: currentColor;
	}

	.mark-hollow {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.1;
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

	.it {
		font-family: var(--font-serif);
		font-style: italic;
	}

	.title .it {
		font-size: calc(13px * var(--u, 1));
	}

	.sub {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: calc(9.5px * var(--u, 1));
	}

	.matter {
		fill: var(--q-matter);
	}

	.label {
		fill: var(--text);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.bold {
		font-style: normal;
		font-weight: 700;
	}

	.label .words {
		font-style: normal;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.halo-panel {
		paint-order: stroke;
		stroke: var(--bg);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the ball, the plane and what lies on them */

	.ball {
		fill: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.below {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
	}

	.sphere,
	.plane {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.centre-dot {
		fill: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.kernel-band {
		fill: var(--text);
	}

	.skin-band {
		fill: var(--q-matter);
	}

	.level {
		fill: none;
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-linejoin: round;
	}

	.level.below {
		stroke: color-mix(in srgb, var(--q-field) 75%, transparent);
	}

	.level.above {
		stroke: color-mix(in srgb, var(--q-field) 60%, transparent);
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.level.zero {
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.equipotential {
		fill: none;
		stroke: color-mix(in srgb, var(--q-field) 65%, transparent);
		stroke-width: calc(2px * var(--u, 1));
	}

	.skin-line {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.tie {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.drop {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.far {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 80%, transparent);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.source {
		fill: var(--q-matter);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.image {
		fill: var(--bg);
		stroke: var(--q-matter);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.handle-group {
		cursor: grab;
		touch-action: none;
	}

	.handle-group:focus {
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

	.handle-group:focus-visible .focus {
		opacity: 1;
	}

	.handle,
	.probe {
		fill: var(--bg);
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.rule {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
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

	.term {
		fill: none;
		stroke-linejoin: round;
	}

	.source-term {
		stroke: var(--text-dim);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.image-term {
		stroke: var(--text-dim);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.sum-term {
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.kernel-curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.skin-curve {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.marker {
		stroke: color-mix(in srgb, var(--accent) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.peak {
		fill: var(--accent);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.skin-dot {
		fill: var(--q-matter);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.width {
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
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

	.below-key {
		border-color: color-mix(in srgb, var(--q-field) 75%, transparent);
		border-top-width: 1px;
	}

	.above-key {
		border-top: 1px dashed color-mix(in srgb, var(--q-field) 60%, transparent);
	}

	.zero-key {
		border-color: var(--accent);
	}

	.source-key {
		border-color: var(--text-dim);
	}

	.image-key {
		border-top: 1.5px dashed var(--text-dim);
	}

	.kernel-key,
	.skin-key {
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
	}

	.kernel-key {
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--text) 8%, transparent),
			color-mix(in srgb, var(--text) 85%, transparent)
		);
	}

	.skin-key {
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--q-matter) 8%, transparent),
			color-mix(in srgb, var(--q-matter) 92%, transparent)
		);
	}

	.equi-key {
		border-top: 2px solid color-mix(in srgb, var(--q-field) 65%, transparent);
	}

	.skin-line-key {
		border-top: 1px dashed var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
	}

	.hint b {
		font-weight: 700;
		color: var(--text);
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

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
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

		.stage {
			padding-inline: 0.7rem;
		}

		.row {
			grid-template-columns: 6.4rem 1fr;
			gap: 0.1rem 0.6rem;
		}

		.readouts {
			padding-inline: 0.7rem;
		}
	}
</style>
