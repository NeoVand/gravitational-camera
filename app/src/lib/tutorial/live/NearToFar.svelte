<script lang="ts">
	/**
	 * Chapter 7.7's near-to-far figure: one solution from Newton's pull near the source to the wave far away. The upper
	 * panel maps the changing tide across the plane of a circular orbit, 𝓔_zz of the paper's eq:multipole, as the
	 * paper draws fig:binary-field: orange where the plane's neighbourhood is stretched across it, blue where squeezed,
	 * scaled at each place by the local strength. Two small balls turn at the centre; a dotted circle marks λ/2π and a
	 * dashed one 0.313λ, where Newton's tide and the wave's are equal. The map is painted on a canvas from a grid of
	 * phases worked out once for each zoom (the radial factor does not change with time; only a phase turns). A probe,
	 * dragged or stepped with the arrow keys, reads the local law and the exact field against the two laws. The lower
	 * panel draws r|𝓔_zz| against r/λ on log–log axes with the two asymptotes. A slider zooms the map from 0.02λ to
	 * 10λ across; another halves or doubles the orbital speed at the same separation, which moves the wavelength in
	 * metres. The physics is in ../../engine/multipole.ts, the figure's arithmetic in ./near-to-far.ts. Opens 2λ
	 * across, playing, the probe at 0.3λ; two predictions at the top are answered once the reader has done what each
	 * asks. Under reduced motion it opens paused.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DashboardSpeed01Icon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		ZoomInAreaIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import { ramp, type Rgb } from './round-pupil';
	import { scaledExact, scaledFar, scaledNear } from '../../engine/multipole';
	import {
		CROSSING,
		EDGE,
		LAW3,
		OPENING,
		PAIR,
		PROBE,
		SPEED,
		TURN_S,
		ZOOM,
		clampTo,
		crossingAt,
		halvedFrom,
		hear,
		inView,
		kmWords,
		lambdaAt,
		lawWords,
		noteFirst,
		pairAt,
		phaseGrid,
		probeMetres,
		probePlace,
		reading,
		scaleBar,
		snapTo,
		speedOverC,
		speedStep,
		stepped,
		texThree,
		three,
		widthFor,
		zoomFor,
		type Range
	} from './near-to-far';

	const uid = $props.id();

	// --- the settings: distances in metres, read in wavelengths of the speed now -----------------------------------
	/** The orbital speed, in octaves from the paper's, at the same separation. */
	let octaves = $state(OPENING.octaves);
	/** The map's width, m. */
	let width = $state(widthFor(OPENING.zoom, OPENING.octaves));
	/** The probe's distance, m, and its angle from the x axis. */
	let probeR = $state(probeMetres(OPENING.probe, OPENING.octaves));
	let probePhi = $state(OPENING.phi);
	/** Ωt, the pair's turn since the start, radians. */
	let turn = $state(0);

	const lambda = $derived(lambdaAt(octaves));
	const zoom = $derived(zoomFor(width, octaves));
	/** The map's width in wavelengths. */
	const across = $derived(10 ** zoom);
	/** The probe's distance in wavelengths. */
	const rl = $derived(10 ** probePlace(probeR, octaves));
	const probe = $derived(reading(rl));

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	/** The speeds held so far, in octaves. */
	let heard: number[] = [OPENING.octaves];
	let halved = $state<{ from: number; to: number } | undefined>();
	const revealed = $derived(step === 1 ? first : halved !== undefined);
	/** The crossing is drawn and named only once the first prediction is answered: until then the reader finds it. */
	const shown = $derived(first);

	function setProbe(r: number, phi = probePhi) {
		probeR = probeMetres(clampTo(Math.log10(r), PROBE), octaves);
		probePhi = phi;
		first = noteFirst(first, 10 ** probePlace(probeR, octaves));
	}

	function setZoom(v: number) {
		width = widthFor(clampTo(v, ZOOM), octaves);
	}

	function setOctaves(v: number) {
		const next = speedStep(v);
		if (next === octaves) return;
		// the same metres, held to what the new wavelength allows
		width = widthFor(zoomFor(width, next), next);
		probeR = probeMetres(probePlace(probeR, next), next);
		octaves = next;
		heard = hear(heard, next);
		const from = halvedFrom(heard, next);
		if (!halved && from !== undefined) halved = { from, to: next };
		first = noteFirst(first, 10 ** probePlace(probeR, next));
	}

	function reset() {
		octaves = OPENING.octaves;
		width = widthFor(OPENING.zoom, OPENING.octaves);
		probeR = probeMetres(OPENING.probe, OPENING.octaves);
		probePhi = OPENING.phi;
		turn = 0;
		heard = hear(heard, OPENING.octaves);
		playing = !prefersReducedMotion.current;
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

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let checked = false;

	/** Turns the pair once every TURN_S seconds while playing; under reduced motion it opens paused. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			turn = (turn + (2 * Math.PI * dt) / TURN_S) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the layout -----------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const layout = $derived.by(() => {
		const narrow = phone.current;
		const W = narrow ? 360 : 640;
		const map = { x: 0, y: 24, w: W, h: narrow ? 300 : 400 };
		const T = map.y + map.h + 46;
		const plot = { L: narrow ? 34 : 44, R: W - 8, T, B: T + (narrow ? 180 : 200) };
		return {
			narrow,
			W,
			H: plot.B + 44,
			map,
			plot,
			cx: map.x + map.w / 2,
			cy: map.y + map.h / 2,
			// the canvas: a modest grid, smoothed by the browser, with square cells
			grid: narrow ? { n: 180, m: 150 } : { n: 240, m: 150 }
		};
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (v: number) => v.toFixed(2);

	/** Pixels per wavelength on the map. */
	const s = $derived(layout.map.w / across);
	/** The disc at the centre that holds the two balls. */
	const MASK = 14;

	// --- the map: the phases for this zoom, painted each frame with one rotation ------------------------------------
	const grid = $derived(
		phaseGrid(layout.grid.n, layout.grid.m, across, (across * layout.map.h) / layout.map.w)
	);

	type Palette = { zero: Rgb; stretch: Rgb; squeeze: Rgb };
	let palette = $state<Palette | undefined>();

	function parse(text: string): Rgb | undefined {
		const t = text.trim();
		const hex = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
		if (hex) {
			const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
			return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
		}
		const n = t.match(/[\d.]+/g);
		return n && n.length >= 3 ? [Number(n[0]), Number(n[1]), Number(n[2])] : undefined;
	}

	/** The site's colours, read from its tokens, and read again when the theme changes. */
	const theme: Attachment<HTMLElement> = (node) => {
		const read = () => {
			const css = getComputedStyle(node);
			const get = (name: string) => parse(css.getPropertyValue(name));
			const zero = get('--bg-sunken');
			const stretch = get('--accent');
			const squeeze = get('--accent-2');
			if (zero && stretch && squeeze) palette = { zero, stretch, squeeze };
		};
		read();
		const watch = new MutationObserver(read);
		watch.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'class']
		});
		const media = matchMedia('(prefers-color-scheme: light)');
		media.addEventListener('change', read);
		return () => {
			watch.disconnect();
			media.removeEventListener('change', read);
		};
	};

	/** 257 colours from a full stretch (−1, orange) through the ground (0) to a full squeeze (+1, blue). */
	const LEVELS = 256;
	const table = $derived.by(() => {
		if (!palette) return undefined;
		const colour = ramp(palette.zero, palette.squeeze, palette.stretch);
		const out = new Uint8ClampedArray(3 * (LEVELS + 1));
		for (let i = 0; i <= LEVELS; i++) {
			const c = colour((2 * i) / LEVELS - 1);
			out[3 * i] = c[0];
			out[3 * i + 1] = c[1];
			out[3 * i + 2] = c[2];
		}
		return out;
	});

	let image: ImageData | undefined;
	/** Paints the map: 𝓔_zz/|𝓔_zz| = cos ψ cos 2Ωt + sin ψ sin 2Ωt at each cell (near-to-far.ts's `shade`). */
	const paint: Attachment<HTMLCanvasElement> = (node) => {
		const lut = table;
		const { cos, sin } = grid;
		const { n, m } = layout.grid;
		const c2 = Math.cos(2 * turn);
		const s2 = Math.sin(2 * turn);
		if (!lut) return;
		if (node.width !== n || node.height !== m) {
			node.width = n;
			node.height = m;
		}
		const context = node.getContext('2d');
		if (!context) return;
		if (!image || image.width !== n || image.height !== m) image = context.createImageData(n, m);
		const data = image.data;
		for (let p = 0; p < n * m; p++) {
			const v = cos[p] * c2 + sin[p] * s2;
			const k = 3 * Math.round((v + 1) * (LEVELS / 2));
			data[4 * p] = lut[k];
			data[4 * p + 1] = lut[k + 1];
			data[4 * p + 2] = lut[k + 2];
			data[4 * p + 3] = 255;
		}
		context.putImageData(image, 0, 0);
	};

	// --- the marks on the map -------------------------------------------------------------------------------------
	const circles = $derived({ edge: EDGE * s, crossing: CROSSING * s });

	/** A circle's label beside it, at 45° up and to one side, if it fits inside the map. */
	function circleLabel(R: number, side: 1 | -1) {
		if (R < 30 * u) return undefined;
		const a = (R + 8 * u) * Math.SQRT1_2;
		const x = layout.cx + side * a;
		const y = layout.cy - a;
		const room = side > 0 ? layout.W - x > 48 * u : x > 34 * u;
		if (!room || y < layout.map.y + 16 * u) return undefined;
		return { x, y };
	}
	const edgeLabel = $derived(circleLabel(circles.edge, -1));
	const crossingLabel = $derived(circleLabel(circles.crossing, 1));

	/** The pair, drawn small at the centre along its line now: Ωt + π/2 from the x axis. */
	const balls = $derived.by(() => {
		const a = turn + Math.PI / 2;
		const d = 7 * u;
		return [1, -1].map((k) => ({
			x: layout.cx + k * d * Math.cos(a),
			y: layout.cy - k * d * Math.sin(a)
		}));
	});

	const bar = $derived.by(() => {
		const v = scaleBar(across);
		return {
			v,
			x: 12 * u,
			y: layout.map.y + layout.map.h - 12 * u,
			w: v * s,
			words: `${three(v)}λ = ${kmWords(v * lambda)}`
		};
	});

	/** The probe on the map, or at its edge, along its ray, when it lies beyond the view. */
	const probeAt = $derived.by(() => {
		const dx = rl * Math.cos(probePhi) * s;
		const dy = -rl * Math.sin(probePhi) * s;
		const p = inView(dx, dy, layout.map.w / 2, layout.map.h / 2, 12 * u);
		const l = Math.hypot(dx, dy) || 1;
		return { x: layout.cx + p.x, y: layout.cy + p.y, inside: p.inside, ux: dx / l, uy: dy / l };
	});

	const edgeArrow = $derived.by(() => {
		if (probeAt.inside) return undefined;
		const { x, y, ux, uy } = probeAt;
		const tip = { x: x + ux * 11 * u, y: y + uy * 11 * u };
		const back = { x: x + ux * 6 * u, y: y + uy * 6 * u };
		const w = 3.5 * u;
		return `${f2(tip.x)},${f2(tip.y)} ${f2(back.x - uy * w)},${f2(back.y + ux * w)} ${f2(back.x + uy * w)},${f2(back.y - ux * w)}`;
	});

	// --- the lower panel: r|𝓔_zz| against r/λ, log–log ----------------------------------------------------------------
	const X_LO = Math.log10(0.02);
	const X_HI = 1;
	const Y_HI = 6;
	const X = (r: number) =>
		layout.plot.L + ((Math.log10(r) - X_LO) / (X_HI - X_LO)) * (layout.plot.R - layout.plot.L);
	const Y = (v: number) => layout.plot.B - (Math.log10(v) / Y_HI) * (layout.plot.B - layout.plot.T);
	const rAtX = (x: number) =>
		10 ** (X_LO + ((x - layout.plot.L) / (layout.plot.R - layout.plot.L)) * (X_HI - X_LO));

	function curve(get: (kr: number) => number) {
		const n = 240;
		let d = '';
		for (let j = 0; j <= n; j++) {
			const r = 10 ** (X_LO + ((X_HI - X_LO) * j) / n);
			d += `${j ? 'L' : 'M'}${f2(X(r))},${f2(Y(get(2 * Math.PI * r)))}`;
		}
		return d;
	}
	const curves = $derived({
		exact: curve(scaledExact),
		near: curve(scaledNear),
		far: curve(scaledFar)
	});

	const xGrid = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
	const xLabels = [0.02, 0.1, 1, 10];
	const yTicks = [0, 1, 2, 3, 4, 5, 6];
	const yLabel = (e: number) => (e === 0 ? '1' : e === 1 ? '10' : `10${superscript(e)}`);

	/** The distance in kilometres under the axis, at the powers of ten in it: they move with the speed. */
	const kmTicks = $derived.by(() => {
		const out: { r: number; label: string }[] = [];
		const lo = Math.ceil(Math.log10((0.02 * lambda) / 1e3) - 1e-9);
		const hi = Math.floor(Math.log10((10 * lambda) / 1e3) + 1e-9);
		for (let e = lo; e <= hi; e++)
			out.push({ r: (10 ** e * 1e3) / lambda, label: `10${superscript(e)}` });
		return out;
	});

	/** Where Newton's law is labelled: beside its line, above and to its right, at r|𝓔_zz| = 10^4.5. */
	const nearWords = $derived.by(() => {
		const v = 10 ** 4.5;
		const r = (60 / v) ** 0.25 / (2 * Math.PI);
		return { x: X(r) + 9 * u, y: Y(v) + 3 * u };
	});

	/** The band of distances the map shows along its x axis, out to its side. */
	const mapBand = $derived(Math.min(10, across / 2));

	// --- dragging and the keys --------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<'map' | 'plot' | undefined>();
	/** A drag lands on a circle or a line within this many CSS pixels of it. */
	const SNAP = 6;

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function placeAt(e: PointerEvent, where: 'map' | 'plot') {
		const p = local(e);
		if (!p) return;
		if (where === 'map') {
			const dx = p.x - layout.cx;
			const dy = layout.cy - p.y;
			const px = Math.max(Math.hypot(dx, dy), (MASK + 4) * u);
			const snapped = snapTo(
				px,
				[
					{ at: circles.crossing, value: CROSSING },
					{ at: circles.edge, value: EDGE }
				],
				SNAP * u
			);
			setProbe(snapped ?? px / s, Math.atan2(dy, dx));
		} else {
			const x = Math.max(layout.plot.L, Math.min(layout.plot.R, p.x));
			const snapped = snapTo(
				x,
				[
					{ at: X(CROSSING), value: CROSSING },
					{ at: X(EDGE), value: EDGE }
				],
				SNAP * u
			);
			setProbe(snapped ?? rAtX(x));
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
			if (dragging && pending) placeAt(pending, dragging);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		// a drag is not a click: the probe does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = 'map';
	}

	/** A press on the open drawing, with a mouse or a pen, brings the probe there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		const p = local(e);
		if (!p) return;
		const { map, plot } = layout;
		const where =
			p.y >= map.y && p.y <= map.y + map.h
				? 'map'
				: p.y >= plot.T - 4 && p.y <= plot.B + 4 && p.x >= plot.L - 8 && p.x <= plot.R + 8
					? 'plot'
					: undefined;
		if (!where) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = where;
		placeAt(e, where);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	function probeKeys(e: KeyboardEvent) {
		const next = stepped(Math.log10(rl), e.key, e.shiftKey, PROBE);
		if (next === undefined) return;
		e.preventDefault();
		setProbe(10 ** next);
	}

	// --- the words ----------------------------------------------------------------------------------------------------
	const EC = '\\htmlClass{q-curv}{\\mathcal E}';
	const DI = '\\htmlClass{q-matter}{\\Delta I}';
	const v = $derived(speedOverC(octaves));
	/** A speed over c as the slider reads it, to three decimals: 0.100, 0.050, 0.200. */
	const vWords = (x: number) => x.toFixed(3);
	const omega = $derived(pairAt(octaves).omega);
	const turnDeg = $derived(Math.round((turn * 180) / Math.PI) % 360);
	const lawTex = (n: number) => `r^{${n < 0 ? '-' : ''}${Math.abs(n).toFixed(2)}}`;

	const facts2 = $derived(
		halved
			? {
					v0: speedOverC(halved.from),
					v1: speedOverC(halved.to),
					l0: lambdaAt(halved.from),
					l1: lambdaAt(halved.to),
					c0: crossingAt(halved.from),
					c1: crossingAt(halved.to)
				}
			: undefined
	);

	const description = $derived(
		`The changing tide across the plane of a circular orbit, for two black holes of 30 solar masses 2200 km apart at ${vWords(v)} of the speed of light, mapped ${three(across)} wavelengths across, orange where it stretches, blue where it squeezes, at each place over its own strength. ` +
			`The pattern turns rigidly with the pair inside the dotted circle at a reduced wavelength, ${kmWords(EDGE * lambda)}, and winds into a two-armed spiral beyond it. ` +
			(shown
				? `The dashed circle at 0.313 wavelengths, ${kmWords(crossingAt(octaves))}, is where Newton’s tide and the wave’s are equal. `
				: '') +
			`Below, r times the tide's strength against distance on logarithmic axes: Newton's law falling as r to the minus 4, the wave's level, and the exact field above both, joining them.`
	);
	const probeLabel = $derived(
		`The probe, at r = ${three(rl)} wavelengths, ${kmWords(rl * lambda)}: local law r to the power ${lawWords(probe.law)}, the exact field ${three(probe.overNear)} times Newton’s tide and ${three(probe.overFar)} times the wave’s. Drag it, or step it a hundredth of a decade with the arrow keys, a tenth with Shift.`
	);
	const summary = $derived(
		`Probe at ${three(rl)} wavelengths, local law r^${lawWords(probe.law)}; exact over near law ${three(probe.overNear)}.`
	);
</script>

<div class="near-to-far" {@attach theme}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				In the plane of the orbit, the near law and the wave law: do they meet at <Tex
					math="\lambda/2\pi"
				/>, or elsewhere?
			{:else}
				Halve the orbital speed at the same separation. Where does the crossing go?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>Elsewhere: at <Tex math="0.313\lambda" />, twice <Tex math="\lambda/2\pi" />.</strong
				>
				In the plane Newton’s tide across the plane, <Tex
					math={`\\tfrac{15}{4}G${DI}/r^5`}
					trust
				/>, carries the factor 15 against the wave’s <Tex math="(kr)^4" />, which reaches 15 at
				<Tex math="kr = 1.97" /> rather than 1: <Tex
					math={'r = (15/16)^{1/4}\\,c/\\Omega = 0.313\\lambda'}
				/>, which for the black holes at <Tex math={`${vWords(v)}\\,c`} /> is <Tex
					math={`${texThree(crossingAt(octaves) / 1e3)}\\,\\mathrm{km}`}
				/>. There the exact field is 3.08 times either law, and its local law passes <Tex
					math={'r^{-3}'}
				/>, halfway between <Tex math={'r^{-5}'} /> and <Tex math={'r^{-1}'} />, at <Tex
					math="0.310\lambda"
				/>.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2 && facts2}
				<strong>Twice as far out in metres, and at the same fraction of a wavelength.</strong> At
				the same separation <Tex math="\Omega = 2v/d" />, so half the speed halves <Tex
					math="\Omega"
				/>
				and doubles the wavelength <Tex math="\pi c/\Omega" />: from <Tex
					math={`${texThree(facts2.l0 / 1e3)}\\,\\mathrm{km}`}
				/> at <Tex math={`${vWords(facts2.v0)}\\,c`} /> to <Tex
					math={`${texThree(facts2.l1 / 1e3)}\\,\\mathrm{km}`}
				/> at <Tex math={`${vWords(facts2.v1)}\\,c`} />.
				{#if shown}
					The crossing, still at <Tex math="0.313\lambda" />, moves from <Tex
						math={`${texThree(facts2.c0 / 1e3)}\\,\\mathrm{km}`}
					/> to <Tex math={`${texThree(facts2.c1 / 1e3)}\\,\\mathrm{km}`} />.
				{:else}
					The crossing moves with it, at the same fraction of a wavelength; the first prediction
					finds which.
				{/if}
				On the map {shown ? 'the circles grow' : 'the dotted circle grows'} over the same kilometres;
				in the lower panel the curve, drawn against <Tex math="r/\lambda" />, stays put, and only
				the kilometres under it change.
			{:else if step === 1}
				The answer appears once the probe stands where the two laws are equal: drag it there, or
				step it with the arrow keys.
			{:else}
				The answer appears once you have halved the orbital speed with its slider.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="figure">
			<canvas
				aria-hidden="true"
				style:top="{(layout.map.y / layout.H) * 100}%"
				style:height="{(layout.map.h / layout.H) * 100}%"
				{@attach paint}
			></canvas>
			<svg
				viewBox="0 0 {layout.W} {layout.H}"
				role="group"
				aria-label={description}
				class={{ dragging: dragging !== undefined }}
				onpointerdown={press}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={release}
				{@attach hold}
				{@attach fitText((value) => (u = value))}
				{@attach clock}
			>
				<defs>
					<clipPath id="{uid}-map">
						<rect
							x={layout.map.x}
							y={layout.map.y}
							width={layout.map.w}
							height={layout.map.h}
							rx="8"
						/>
					</clipPath>
					<clipPath id="{uid}-plot">
						<rect
							x={layout.plot.L}
							y={layout.plot.T}
							width={layout.plot.R - layout.plot.L}
							height={layout.plot.B - layout.plot.T}
						/>
					</clipPath>
				</defs>

				<!-- the map -->
				<text class="title" x="2" y={layout.map.y - 8 * u}
					>The tide across the plane, <tspan class="it">𝓔</tspan><tspan class="sub">zz</tspan
					>{layout.narrow ? '' : ', over its local strength'}</text
				>
				<text class="title end" x={layout.W - 2} y={layout.map.y - 8 * u}
					><tspan class="it">Ωt</tspan> = {turnDeg}°</text
				>
				<g clip-path="url(#{uid}-map)">
					<circle class="edge-circle" cx={layout.cx} cy={layout.cy} r={f2(circles.edge)} />
					{#if shown}
						<circle
							class="crossing-circle"
							cx={layout.cx}
							cy={layout.cy}
							r={f2(circles.crossing)}
						/>
					{/if}
					<circle class="mask" cx={layout.cx} cy={layout.cy} r={f2(MASK * u)} />
					<path
						class="pair-line"
						d="M{f2(balls[0].x)},{f2(balls[0].y)}L{f2(balls[1].x)},{f2(balls[1].y)}"
					/>
					{#each balls as b, i (i)}
						<circle class="ball" cx={f2(b.x)} cy={f2(b.y)} r={f2(3.3 * u)} />
					{/each}
					{#if edgeLabel}
						<text class="small mark-words halo end" x={f2(edgeLabel.x)} y={f2(edgeLabel.y)}
							><tspan class="it">λ</tspan>/2π</text
						>
					{/if}
					{#if shown && crossingLabel}
						<text class="small mark-words halo" x={f2(crossingLabel.x)} y={f2(crossingLabel.y)}
							>0.313<tspan class="it">λ</tspan></text
						>
					{/if}
					<!-- the scale -->
					<path
						class="scale scale-halo"
						d="M{f2(bar.x)},{f2(bar.y)}h{f2(bar.w)}M{f2(bar.x)},{f2(bar.y - 3 * u)}v{f2(6 * u)}M{f2(
							bar.x + bar.w
						)},{f2(bar.y - 3 * u)}v{f2(6 * u)}"
					/>
					<path
						class="scale"
						d="M{f2(bar.x)},{f2(bar.y)}h{f2(bar.w)}M{f2(bar.x)},{f2(bar.y - 3 * u)}v{f2(6 * u)}M{f2(
							bar.x + bar.w
						)},{f2(bar.y - 3 * u)}v{f2(6 * u)}"
					/>
					<text class="small halo scale-words" x={f2(bar.x)} y={f2(bar.y - 7 * u)}>{bar.words}</text
					>
				</g>
				<rect
					class="frame"
					x={layout.map.x + 0.5}
					y={layout.map.y + 0.5}
					width={layout.map.w - 1}
					height={layout.map.h - 1}
					rx="8"
				/>

				<!-- the strength against distance -->
				<text class="title" x="2" y={layout.plot.T - 20 * u}
					><tspan class="it">r</tspan>|<tspan class="it">𝓔</tspan><tspan class="sub">zz</tspan>| in
					the plane, in units of <tspan class="it">G</tspan>Δ<tspan class="it">I</tspan><tspan
						class="it">Ω</tspan
					>⁴/<tspan class="it">c</tspan>⁴</text
				>
				<rect
					class="plot-ground"
					x={layout.plot.L}
					y={layout.plot.T}
					width={layout.plot.R - layout.plot.L}
					height={layout.plot.B - layout.plot.T}
				/>
				<g clip-path="url(#{uid}-plot)">
					<rect
						class="band"
						x={layout.plot.L}
						y={layout.plot.T}
						width={Math.max(0, X(mapBand) - layout.plot.L)}
						height={layout.plot.B - layout.plot.T}
					/>
					{#each xGrid as r (r)}
						<line class="grid" x1={X(r)} x2={X(r)} y1={layout.plot.T} y2={layout.plot.B} />
					{/each}
					{#each yTicks as e (e)}
						<line
							class="grid"
							x1={layout.plot.L}
							x2={layout.plot.R}
							y1={Y(10 ** e)}
							y2={Y(10 ** e)}
						/>
					{/each}
					<line class="edge-line" x1={X(EDGE)} x2={X(EDGE)} y1={layout.plot.T} y2={layout.plot.B} />
					{#if shown}
						<line
							class="crossing-line"
							x1={X(CROSSING)}
							x2={X(CROSSING)}
							y1={layout.plot.T}
							y2={layout.plot.B}
						/>
					{/if}
					<path class="law" d={curves.near} />
					<path class="law" d={curves.far} />
					<path class="exact" d={curves.exact} />
					{#if shown}
						<circle class="meet" cx={X(CROSSING)} cy={Y(4)} r={3.6 * u} />
					{/if}
					<line class="guide" x1={X(rl)} x2={X(rl)} y1={layout.plot.T} y2={layout.plot.B} />
					<circle class="dot" cx={X(rl)} cy={Y(probe.strength)} r={3.4 * u} />
				</g>
				<rect
					class="frame"
					x={layout.plot.L}
					y={layout.plot.T}
					width={layout.plot.R - layout.plot.L}
					height={layout.plot.B - layout.plot.T}
				/>
				<text class="small mark-words end" x={X(EDGE) - 4 * u} y={layout.plot.T + 13 * u}
					><tspan class="it">λ</tspan>/2π</text
				>
				{#if shown}
					<text class="small mark-words" x={X(CROSSING) + 4 * u} y={layout.plot.T + 13 * u}
						>0.313<tspan class="it">λ</tspan></text
					>
				{/if}
				<text class="small law-words" x={nearWords.x} y={nearWords.y}
					>{layout.narrow ? 'Newton, ' : 'Newton’s tide, '}<tspan class="it">r</tspan>⁻⁵</text
				>
				<text class="small law-words end" x={layout.plot.R - 5 * u} y={Y(4) + 14 * u}
					>wave, 1/<tspan class="it">r</tspan></text
				>
				<text class="small exact-words end" x={layout.plot.R - 5 * u} y={Y(4) - 8 * u}>exact</text>
				{#each yTicks as e (e)}
					<text class="small y-tick" x={layout.plot.L - 5 * u} y={Y(10 ** e)}>{yLabel(e)}</text>
				{/each}
				{#each xLabels as r (r)}
					<text
						class={['small tick', { first: r === 0.02, last: r === 10 }]}
						x={X(r)}
						y={layout.plot.B + 15 * u}>{r}</text
					>
				{/each}
				<text class="small axis-name" x="0" y={layout.plot.B + 15 * u}
					><tspan class="it">r</tspan>/<tspan class="it">λ</tspan></text
				>
				{#each kmTicks as t (t.label)}
					<text class="small dim tick" x={X(t.r)} y={layout.plot.B + 31 * u}>{t.label}</text>
				{/each}
				<text class="small dim axis-name" x="0" y={layout.plot.B + 31 * u}>km</text>

				<!-- the probe: on the map, or at its edge when it lies beyond the view -->
				{#if edgeArrow}
					<polygon class="edge-arrow" points={edgeArrow} />
				{/if}
				<g
					class="probe"
					transform="translate({f2(probeAt.x)} {f2(probeAt.y)})"
					role="slider"
					tabindex="0"
					aria-roledescription="movable probe"
					aria-label={probeLabel}
					aria-valuemin={0.02}
					aria-valuemax={10}
					aria-valuenow={Number(rl.toPrecision(3))}
					aria-valuetext="r = {three(rl)} wavelengths, local law r to the {lawWords(probe.law)}"
					onpointerdown={grab}
					onkeydown={probeKeys}
				>
					<circle class="hit" r={15 * u} />
					<circle class="focus" r={10 * u} />
					<circle class="ring" r={6 * u} />
					<circle class="pin" r={1.5 * u} />
				</g>
			</svg>
		</div>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch stretch-key"></span>stretched across the plane</li>
			<li><span class="swatch squeeze-key"></span>squeezed across it</li>
			<li><span class="line-key dotted"></span><span><Tex math="\lambda/2\pi" /></span></li>
			{#if shown}
				<li>
					<span class="line-key dashed"></span><span
						><Tex math="0.313\lambda" />, where the laws cross</span
					>
				</li>
			{/if}
			<li><span class="dot-key"></span>the pair, drawn small</li>
			<li><span class="line-key exact-key"></span>the exact field</li>
			<li><span class="line-key law-key"></span>the two laws</li>
			<li><span class="band-key"></span>the distances on the map</li>
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => zoom, setZoom, ZOOM)}
				role="presentation"
			>
				<Slider
					id="{uid}-zoom"
					label="Width of the map"
					icon={ZoomInAreaIcon}
					min={ZOOM.min}
					max={ZOOM.max}
					step={ZOOM.step}
					bind:value={() => zoom, setZoom}
					readout="{three(across)}λ across, {kmWords(across * lambda)}"
					marks={[
						{ at: ZOOM.min, label: '0.02λ' },
						{ at: -1, label: '0.1λ' },
						{ at: 0, label: '1λ' },
						{ at: OPENING.zoom, label: '2λ, as the figure opens' },
						{ at: 1, label: '10λ' }
					]}
					marksHint="the ticks mark 0.02λ, 0.1λ, 1λ, 2λ and 10λ"
				/>
			</div>
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => octaves, setOctaves, SPEED)}
				role="presentation"
			>
				<Slider
					id="{uid}-speed"
					label="Orbital speed, same separation"
					icon={DashboardSpeed01Icon}
					min={SPEED.min}
					max={SPEED.max}
					step={SPEED.step}
					bind:value={() => octaves, setOctaves}
					readout="v = {vWords(v)}c"
					marks={[
						{ at: -1, label: 'half' },
						{ at: 0, label: '0.100c, the paper’s pair' },
						{ at: 1, label: 'double' }
					]}
					marksHint="the ticks mark half, the paper’s speed and double"
				/>
			</div>
		</div>

		<div class="controls">
			<button
				type="button"
				class="action"
				aria-pressed={playing}
				onclick={() => (playing = !playing)}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.7} />
					Pause
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
					Play
				{/if}
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Drag the probe on the map or along the lower axis, or reach it with Tab and step it a
				hundredth of a decade with the arrow keys, a tenth with Shift. The sliders take the arrow
				keys after Tab, Shift for larger steps.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>The crossing</dt>
				<dd>
					{#if shown}
						<span class="eq"
							><Tex math="(kr)^4 = 15:\ r = 0.313\lambda = 1.97\,\lambda/2\pi" /></span
						><span class="also"
							>crossing in the plane at <span class="value">0.313λ</span>,
							<span class="value">{kmWords(crossingAt(octaves))}</span>, {three(
								crossingAt(octaves) / PAIR.separation
							)} separations out</span
						>
					{:else}
						<span class="also">find it with the probe, where the wave law equals the near law</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The probe</dt>
				<dd>
					<span class="also"
						>probe at <Tex math={`r = ${texThree(rl)}\\lambda`} />, <Tex
							math={`${texThree((rl * lambda) / 1e3)}\\,\\mathrm{km}`}
						/>, <Tex math={`kr = ${texThree(probe.kr)}`} />; local law <Tex
							math={lawTex(probe.law)}
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Against the laws</dt>
				<dd>
					<span class="also"
						>exact / near law = <span class="value">{three(probe.overNear)}</span>, exact / wave law
						= <span class="value">{three(probe.overFar)}</span>, wave / near law <Tex
							math={`(kr)^4/15 = ${texThree(probe.farOverNear)}`}
						/></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The pair</dt>
				<dd>
					<span class="also"
						>two holes of 30 <Tex math="M_\odot" />, 2200 km apart, <Tex
							math={`v = ${vWords(v)}\\,c`}
						/>, <Tex math={`\\Omega = ${texThree(omega)}\\,\\mathrm{s^{-1}}`} />; <Tex
							math={`\\lambda = \\pi c/\\Omega = ${texThree(lambda / 1e3)}\\,\\mathrm{km}`}
						/>, <Tex
							math={`\\lambda/2\\pi = ${texThree((EDGE * lambda) / 1e3)}\\,\\mathrm{km}`}
						/></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The map is
			<span class="formula"
				><Tex
					math={`${EC}_{zz} = \\mathrm{Re}\\bigl[\\tfrac{G${DI}}{4r^5}\\bigl((kr)^4 + 2i(kr)^3 + 3(kr)^2 + 15i\\,kr - 15\\bigr)e^{-2i\\Omega(t - r/c)}e^{2i\\varphi}\\bigr]`}
					trust
				/></span
			>
			at <Tex math="(r\cos\varphi, r\sin\varphi, 0)" />, with <Tex math="k = 2\Omega/c" />, the
			chapter’s solution turned with the masses, divided at each place by its amplitude <Tex
				math={`\\tfrac{G${DI}}{4r^5}\\sqrt{225 + 135(kr)^2 + 39(kr)^4 + 10(kr)^6 + (kr)^8}`}
				trust
			/>, so that the colour gives the phase alone. <span class="stretch">Orange</span>: the
			neighbourhood is stretched across the plane, <Tex math={`${EC}_{zz} < 0`} trust />;
			<span class="squeeze">blue</span>: squeezed. The pair is drawn small, as a mark of its line:
			the field is that of its quadrupole, which for the black holes, {three(
				PAIR.separation / lambda
			)}λ apart, holds only outside their orbit. Its turning is slowed to one turn in {TURN_S} seconds.
			The lower panel draws <Tex math={`r|${EC}_{zz}|`} trust />: Newton’s tide <Tex
				math={`\\tfrac{15}{4}G${DI}/r^5`}
				trust
			/> as a line of slope −4, the wave’s <Tex math={`4G${DI}\\Omega^4/c^4r`} trust /> as a level line,
			and the exact field above both. The local law is the slope of <Tex
				math={`\\ln|${EC}_{zz}|`}
				trust
			/> against <Tex math="\ln r" />, from −5 to −1{#if shown}; it passes −3 at {three(
					LAW3
				)}λ{/if}.
		</p>
	</div>
</div>

<style>
	.near-to-far {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
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
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	/* the map: the canvas under the drawing, placed on its frame */
	.figure {
		position: relative;
		max-width: 640px;
		margin: 0 auto;
	}

	canvas {
		position: absolute;
		left: 0;
		width: 100%;
		display: block;
		border-radius: 8px;
	}

	svg {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the probe takes a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .probe {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.dim {
		fill: var(--text-faint);
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.75em;
		baseline-shift: sub;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.frame {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.edge-circle,
	.crossing-circle {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.edge-circle {
		stroke-dasharray: calc(1.2px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.crossing-circle {
		stroke-dasharray: calc(6px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.mark-words {
		fill: var(--text);
		font-weight: 500;
	}

	.mask {
		fill: var(--bg-sunken);
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.pair-line {
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ball {
		fill: var(--q-matter);
	}

	.scale {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.scale.scale-halo {
		stroke: var(--bg-sunken);
		stroke-width: calc(4px * var(--u, 1));
	}

	.scale-words {
		fill: var(--text);
	}

	/* the lower panel */
	.plot-ground {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
	}

	.band {
		fill: color-mix(in srgb, var(--text) 6%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.edge-line,
	.crossing-line {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.edge-line {
		stroke-dasharray: calc(1.2px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.crossing-line {
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.law {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 75%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
	}

	.exact {
		fill: none;
		stroke: var(--q-curv);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linejoin: round;
	}

	.meet {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.law-words {
		fill: var(--text-dim);
	}

	.exact-words {
		fill: var(--q-curv);
		font-weight: 600;
	}

	.guide {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		text-anchor: middle;
	}

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
	}

	/* the probe */
	.probe {
		cursor: grab;
		touch-action: none;
	}

	.probe:focus {
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

	.probe:focus-visible .focus {
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

	.edge-arrow {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 640px;
		margin: 0.45rem auto 0;
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
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 2px;
	}

	.stretch-key {
		background: var(--accent);
	}

	.squeeze-key {
		background: var(--accent-2);
	}

	.line-key {
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid var(--text);
	}

	.line-key.dotted {
		border-top-style: dotted;
	}

	.line-key.dashed {
		border-top-style: dashed;
	}

	.exact-key {
		border-top: 2px solid var(--q-curv);
	}

	.law-key {
		border-top: 1px solid color-mix(in srgb, var(--text) 75%, transparent);
	}

	.dot-key {
		flex: none;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--q-matter);
	}

	.band-key {
		flex: none;
		width: 1.1rem;
		height: 0.7rem;
		border-radius: 2px;
		background: color-mix(in srgb, var(--text) 10%, transparent);
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

	.slot {
		min-width: 0;
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

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 16rem;
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
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.value {
		font-weight: 600;
		color: var(--text);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	/* the long formula of the note scrolls sideways in its own line on a narrow screen */
	.formula {
		display: block;
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 0.15rem 0;
	}

	.note .stretch {
		color: var(--accent);
	}

	.note .squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.4rem 0.4rem 0.5rem;
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
