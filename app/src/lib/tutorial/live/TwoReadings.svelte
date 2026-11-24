<script lang="ts">
	/**
	 * Chapter 13.2's two readings as one transform, the paper's Figure fig:two-readings made live. Left, the camera's
	 * plane of wavevectors, k_x and k_y from −3 to 3 m⁻¹: two arrows from the origin, k and k′, whose tips the reader
	 * drags or moves from the keyboard, their sum K, and the ellipse |k| + |K − k| = |k| + |k′| with foci 0 and K.
	 * Right, the half-plane (K, κ), each from 0 to 6 m⁻¹: the cone's line κ = K, the first readings of k and k′ on it,
	 * the pair's point (|k + k′|, |k| + |k′|), and under them the size of the chosen scene's second reading,
	 * ½(κ² − K²)|ρ̃(K, κ)|, shaded where it stands above a floor set by the signal-to-noise slider. A menu picks the
	 * scene: a point mass at a depth the reader sets, or a null-space density. The arithmetic is in ./two-readings.ts;
	 * the null scene's map, which no setting changes, is computed there once, when the module loads. The cone's line is
	 * in the ink, not the paper's blue, and the map is in the colour of matter, for the tutorial keeps orange and blue
	 * for stretch and squeeze. The chapter's try box asks where a pair of parallel tides lands, so the figure answers
	 * it in no words: it shows the live values only. Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import {
		ArrowDownDoubleIcon,
		CircleIcon,
		ContrastIcon,
		SignalIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BUMP,
		CELLS,
		HALF,
		KEY_SHIFT,
		KEY_STEP,
		NULL_LARGEST,
		NULL_MAP,
		OPENING,
		PLANE,
		POINT,
		SNR,
		clamp,
		ellipse,
		kept,
		largest,
		map,
		readouts,
		shade,
		snapped,
		sigTex,
		snrText,
		type Scene,
		type Vec
	} from './two-readings';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let k = $state<Vec>(OPENING.k);
	let kp = $state<Vec>(OPENING.kp);
	let scene = $state<Scene>('point');
	let depth = $state(POINT.depth.opening);
	let logSnr = $state(SNR.opening);

	const setDepth = (v: number) =>
		(depth = clamp(Math.round(v * 100) / 100, POINT.depth.min, POINT.depth.max));
	const setLogSnr = (v: number) => (logSnr = clamp(Math.round(v * 100) / 100, SNR.low, SNR.high));

	const snr = $derived(10 ** logSnr);
	const r = $derived(readouts(k, kp, scene, depth, snr));
	const values = $derived(scene === 'point' ? map('point', depth) : NULL_MAP);
	const top = $derived(scene === 'point' ? largest('point', depth) : NULL_LARGEST);

	// --- the drawings: two squares of the same size ---------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const coarse = new MediaQuery('pointer: coarse', false);
	const BOX = { W: 300, H: 312, L: 34, T: 24, S: 250 };
	const PR = BOX.L + BOX.S;
	const PB = BOX.T + BOX.S;
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	/** The plane of wavevectors: −PLANE to PLANE each way. */
	const pScale = BOX.S / (2 * PLANE);
	const PX = (x: number) => BOX.L + (x + PLANE) * pScale;
	const PY = (y: number) => BOX.T + (PLANE - y) * pScale;
	/** The half-plane: 0 to HALF each way, κ upward. */
	const hScale = BOX.S / HALF;
	const HX = (K: number) => BOX.L + K * hScale;
	const HY = (kappa: number) => BOX.T + (HALF - kappa) * hScale;

	const PLANE_TICKS = Array.from({ length: 2 * PLANE + 1 }, (_, i) => i - PLANE);
	const HALF_TICKS = Array.from({ length: HALF + 1 }, (_, i) => i);

	/** An arrow from a to b in drawing units, its head `head` CSS pixels long; none if it is too short to draw. */
	function arrow(ax: number, ay: number, bx: number, by: number, scale: number, head = 8) {
		const length = Math.hypot(bx - ax, by - ay);
		if (length < 1e-6) return { shaft: '', head: '' };
		const [ux, uy] = [(bx - ax) / length, (by - ay) / length];
		const h = Math.min(head * scale, 0.6 * length);
		const half = 0.42 * h;
		const [cx, cy] = [bx - ux * h, by - uy * h];
		return {
			shaft: `M${f1(ax)},${f1(ay)}L${f1(cx + ux * 0.5 * scale)},${f1(cy + uy * 0.5 * scale)}`,
			head: `M${f1(bx)},${f1(by)}L${f1(cx - uy * half)},${f1(cy + ux * half)}L${f1(cx + uy * half)},${f1(cy - ux * half)}Z`
		};
	}

	const O = { x: PX(0), y: PY(0) };
	const tipK = $derived({ x: PX(k.x), y: PY(k.y) });
	const tipKp = $derived({ x: PX(kp.x), y: PY(kp.y) });
	const sumAt = $derived({ x: PX(r.sum.x), y: PY(r.sum.y) });
	const arrowK = $derived(arrow(O.x, O.y, tipK.x, tipK.y, u));
	const arrowKp = $derived(arrow(O.x, O.y, tipKp.x, tipKp.y, u));
	const arrowSum = $derived(arrow(O.x, O.y, sumAt.x, sumAt.y, u, 9));
	const sumInside = $derived(Math.abs(r.sum.x) <= PLANE && Math.abs(r.sum.y) <= PLANE);
	const ellipsePath = $derived(
		ellipse(r)
			.map((p, i) => `${i ? 'L' : 'M'}${f1(PX(p.x))},${f1(PY(p.y))}`)
			.join('') + 'Z'
	);

	/**
	 * A label by the tip of an arrow from the origin: `along` CSS pixels out along it and `side` across it (positive to
	 * the arrow's left on the page), so that the names of two parallel arrows fall on either side of them.
	 */
	function beside(tip: { x: number; y: number }, scale: number, along: number, side: number) {
		const [dx, dy] = [tip.x - O.x, tip.y - O.y];
		const length = Math.hypot(dx, dy);
		const [ux, uy] = length < 1e-6 ? [0.7071, -0.7071] : [dx / length, dy / length];
		return {
			x: tip.x + (ux * along + uy * side) * scale,
			y: tip.y + (uy * along - ux * side) * scale
		};
	}
	const labelK = $derived(beside(tipK, u, 7, -14));
	const labelKp = $derived(beside(tipKp, u, 7, 14));
	const tips = $derived([
		{ which: 'k' as const, a: arrowK, tip: tipK, label: labelK },
		{ which: 'kp' as const, a: arrowKp, tip: tipKp, label: labelKp }
	]);
	const labelSum = $derived(beside(sumAt, u, 12, 0));

	/** The pair's point, kept on the half-plane's frame if it falls beyond it. */
	const dot = $derived({
		x: HX(Math.min(r.K, HALF)),
		y: HY(Math.min(r.kappa, HALF)),
		off: r.K > HALF || r.kappa > HALF
	});
	/** The first readings of k and k′: points of the cone at |k| and |k′|. */
	const firsts = $derived(
		[Math.hypot(k.x, k.y), Math.hypot(kp.x, kp.y)].map((a) => ({ x: HX(a), y: HY(a) }))
	);

	/**
	 * The map as a mask: one pixel a cell, white where the second reading is well above the floor, black below it,
	 * stretched over the half-plane, which smooths it. The colour stays in the stylesheet, for both themes.
	 */
	let canvas: HTMLCanvasElement | undefined;
	const paint: Attachment<SVGImageElement> = (image) => {
		const cells = values;
		const [t, s] = [top, snr];
		canvas ??= document.createElement('canvas');
		canvas.width = CELLS;
		canvas.height = CELLS;
		const context = canvas.getContext('2d');
		if (!context) return;
		const data = context.createImageData(CELLS, CELLS);
		for (let j = 0; j < CELLS; j++) {
			// the cells run from κ = 0 upward; the canvas's rows from the top down
			const row = CELLS - 1 - j;
			for (let i = 0; i < CELLS; i++) {
				const level = Math.round(255 * shade(cells[j * CELLS + i], t, s));
				const at = 4 * (row * CELLS + i);
				data.data[at] = data.data[at + 1] = data.data[at + 2] = level;
				data.data[at + 3] = 255;
			}
		}
		context.putImageData(data, 0, 0);
		image.setAttribute('href', canvas.toDataURL());
	};
	const CELL = BOX.S / CELLS;

	// --- dragging and the keys -------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined = $state();
	let dragging = $state<'k' | 'kp' | undefined>();
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};

	function planeAt(e: PointerEvent): Vec | undefined {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: (q.x - BOX.L) / pScale - PLANE, y: PLANE - (q.y - BOX.T) / pScale };
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) {
				const q = planeAt(pending);
				if (q) {
					if (dragging === 'k') k = onPlane(snapped(kept(q), kp));
					else kp = onPlane(snapped(kept(q), k));
				}
			}
			pending = undefined;
		});
	}

	/** A snapped tip keeps its exact place on the line, unless that place is off the plane. */
	const onPlane = (t: Vec) => (Math.max(Math.abs(t.x), Math.abs(t.y)) <= PLANE ? t : kept(t));

	function grab(e: PointerEvent, which: 'k' | 'kp') {
		if (e.button !== 0) return;
		// a drag is not a click: the tip does not take the focus, so no ring is drawn round it
		e.preventDefault();
		dragging = which;
		// the moves come to the drawing even when the finger leaves it; a pointer already gone cannot be captured
		try {
			svg?.setPointerCapture(e.pointerId);
		} catch {
			// the drag still follows the moves over the drawing
		}
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	/** The arrow keys move the focused tip by 0.05 m⁻¹, with Shift by 0.25. */
	function tipKeys(e: KeyboardEvent, which: 'k' | 'kp') {
		const n = e.shiftKey ? KEY_SHIFT : KEY_STEP;
		const d = {
			ArrowLeft: [-n, 0],
			ArrowRight: [n, 0],
			ArrowUp: [0, n],
			ArrowDown: [0, -n]
		}[e.key];
		if (!d) return;
		e.preventDefault();
		const now = which === 'k' ? k : kp;
		const next = kept({ x: now.x + d[0], y: now.y + d[1] });
		if (which === 'k') k = next;
		else kp = next;
	}

	// --- the words --------------------------------------------------------------------------------------------------
	/** The TeX of the words. */
	const T = {
		k: '\\mathbf k',
		kp: "\\mathbf k'",
		K: '\\mathbf K',
		point: "(|\\mathbf k + \\mathbf k'|,\\ |\\mathbf k| + |\\mathbf k'|)",
		psi: '\\psi',
		density: '\\nabla^2\\psi/4\\pi G',
		sum: "\\mathbf K = \\mathbf k + \\mathbf k'",
		kappa: "\\kappa = |\\mathbf k| + |\\mathbf k'|",
		mass: '\\htmlClass{q-matter}{m} = 100\\,\\mathrm{kg}',
		nullRho: '(\\kappa^2 - K^2)\\tilde\\psi/4\\pi G',
		bump: '\\psi = \\psi_0(1 - r^2/a^2)^3',
		psi0: '\\psi_0 = 10^{-7}\\,\\mathrm{J\\,kg^{-1}}',
		psiTilde: '\\tilde\\psi'
	};
	const RHO = '\\htmlClass{q-matter}{\\tilde\\rho}';
	const READING_TEX = `\\tfrac12(\\kappa^2 - K^2)\\,|${RHO}(K, \\kappa)|`;
	const KTex = $derived(`K = |\\mathbf k + \\mathbf k'| = ${r.text.K}\\,\\mathrm{m^{-1}}`);
	const kappaTex = $derived(
		`\\kappa = |\\mathbf k| + |\\mathbf k'| = ${r.text.kappa}\\,\\mathrm{m^{-1}}`
	);
	const majorTex = $derived(`\\kappa/2 = ${r.text.major}\\,\\mathrm{m^{-1}}`);
	const minorTex = $derived(
		`\\tfrac12\\sqrt{\\kappa^2 - K^2} = ${r.text.minor}\\,\\mathrm{m^{-1}}`
	);
	const factorTex = $derived(
		`\\tfrac12(\\kappa^2 - K^2) = |\\mathbf k||\\mathbf k'| - \\mathbf k\\cdot\\mathbf k' = ${r.text.factor}\\,\\mathrm{m^{-2}}`
	);
	const readingTex = $derived(`${READING_TEX} = ${sigTex(r.reading, 3)}\\,\\mathrm{kg\\,m^{-2}}`);
	const floorText = $derived(r.text.floor);

	const OPTIONS = $derived([
		{ value: 'point' as const, label: 'A point mass', icon: CircleIcon, wide: phone.current },
		{
			value: 'null' as const,
			label: 'A nugget minus its flush',
			icon: ContrastIcon,
			wide: phone.current
		}
	]);

	const SNR_MARKS = Array.from({ length: SNR.high - SNR.low + 1 }, (_, i) => {
		const e = SNR.low + i;
		return { at: e, label: e === SNR.opening ? `${snrText(e)}, the chapter’s` : snrText(e) };
	});

	const fmt = (x: number) => x.toFixed(2).replace('-', '−');
	const tipLabel = (which: 'k' | 'kp') => {
		const t = which === 'k' ? k : kp;
		const name = which === 'k' ? 'k' : 'k′';
		return `The tip of the wavevector ${name}, at (${fmt(t.x)}, ${fmt(t.y)}) per metre. Drag it, or move it 0.05 per metre with the arrow keys (with Shift, 0.25).`;
	};
	const tipText = (t: Vec) => `(${fmt(t.x)}, ${fmt(t.y)}) per metre`;

	const sceneWords = $derived(
		scene === 'point'
			? `a point mass of ${POINT.m} kg ${depth.toFixed(2)} m deep`
			: `a null-space density, the Laplacian of a smooth bump of radius ${BUMP.a} m centred ${BUMP.depth} m deep, over 4πG`
	);
	const planeDescription = $derived(
		`The camera's plane of wavevectors, from −3 to 3 per metre each way. The arrow k ends at ${tipText(k)} and k′ at ${tipText(kp)}; ` +
			`their sum K ends at ${tipText(r.sum)}${sumInside ? '' : ', beyond the drawing'}. ` +
			`The ellipse of all pairs with the same sum of lengths has its foci at the origin and at K, and semi-axes ${r.text.major} and ${r.text.minor} per metre.`
	);
	const halfDescription = $derived(
		`The half-plane of K across and kappa upward, from 0 to 6 per metre each way, with the cone's line kappa = K. ` +
			`The pair's point is at K = ${r.text.K}, kappa = ${r.text.kappa}${dot.off ? ', beyond the drawing' : ''}. ` +
			`The map shades the second reading of ${sceneWords} where it stands above the noise floor, at a signal-to-noise ratio of ${snrText(logSnr)}; ` +
			`at the pair's point it is ${r.text.reading} kilograms per square metre, ${r.above ? 'above' : 'below'} the noise.`
	);
</script>

{#snippet eq(math: string)}<span class="eq"><Tex {math} trust /></span>{/snippet}

<div class="two-readings">
	<div class="panels">
		<section class="panel" aria-label="The plane of wavevectors">
			<div class="stage">
				<p class="heading">The plane of wavevectors across the camera</p>
				<svg
					viewBox="0 0 {BOX.W} {BOX.H}"
					role="group"
					aria-label={planeDescription}
					class={{ dragging: dragging !== undefined }}
					onpointermove={move}
					onpointerup={release}
					onpointercancel={release}
					{@attach hold}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<clipPath id="{uid}-plane">
							<rect x={BOX.L} y={BOX.T} width={BOX.S} height={BOX.S} />
						</clipPath>
					</defs>

					<rect class="frame" x={BOX.L} y={BOX.T} width={BOX.S} height={BOX.S} />
					{#each PLANE_TICKS as t (t)}
						<line class={['grid', { axis: t === 0 }]} x1={PX(t)} x2={PX(t)} y1={BOX.T} y2={PB} />
						<line class={['grid', { axis: t === 0 }]} x1={BOX.L} x2={PR} y1={PY(t)} y2={PY(t)} />
						<text class="fine mid" x={PX(t)} y={PB + 13 * u}>{String(t).replace('-', '−')}</text>
						<text class="fine end" x={BOX.L - 5 * u} y={f1(PY(t) + 3.5 * u)}
							>{String(t).replace('-', '−')}</text
						>
					{/each}
					<text class="small end" x={PR} y={PB + 28 * u}
						><tspan class="it">k</tspan><tspan class="sub" dy={2.5 * u}>x</tspan><tspan
							dy={-2.5 * u}>, in m⁻¹</tspan
						></text
					>
					<text class="small start" x={BOX.L} y={BOX.T - 8 * u}
						><tspan class="it">k</tspan><tspan class="sub" dy={2.5 * u}>y</tspan><tspan
							dy={-2.5 * u}>, in m⁻¹</tspan
						></text
					>

					<g clip-path="url(#{uid}-plane)">
						<path class="ellipse" d={ellipsePath} />
						<line class="side" x1={tipK.x} y1={tipK.y} x2={sumAt.x} y2={sumAt.y} />
						<line class="side" x1={tipKp.x} y1={tipKp.y} x2={sumAt.x} y2={sumAt.y} />
						<path class="sum-shaft" d={arrowSum.shaft} />
						<path class="sum-head" d={arrowSum.head} />
						<circle class="focus-point" cx={O.x} cy={O.y} r={2.6 * u} />
						<circle class="focus-point" cx={sumAt.x} cy={sumAt.y} r={2.6 * u} />
					</g>
					{#if sumInside}
						<text class="vector-name halo mid" x={f1(labelSum.x)} y={f1(labelSum.y + 4 * u)}>K</text
						>
					{/if}

					{#each tips as t (t.which)}
						<path class="shaft" d={t.a.shaft} />
						<path class="head" d={t.a.head} />
						<text class="vector-name halo mid" x={f1(t.label.x)} y={f1(t.label.y + 4 * u)}
							>k{#if t.which === 'kp'}<tspan class="prime">′</tspan>{/if}</text
						>
						<g
							class="tip"
							role="button"
							tabindex="0"
							aria-roledescription="movable arrow tip"
							aria-label={tipLabel(t.which)}
							onpointerdown={(e) => grab(e, t.which)}
							onkeydown={(e) => tipKeys(e, t.which)}
						>
							<circle class="hit" cx={t.tip.x} cy={t.tip.y} r={(coarse.current ? 24 : 15) * u} />
							<circle class="ring" cx={t.tip.x} cy={t.tip.y} r={11 * u} />
							<circle class="knob" cx={t.tip.x} cy={t.tip.y} r={4 * u} />
						</g>
					{/each}
				</svg>
				<ul class="legend" aria-hidden="true">
					<li>
						<span class="swatch ink-key"></span><span
							>the tides’ wavevectors <Tex math={T.k} />, <Tex math={T.kp} /></span
						>
					</li>
					<li>
						<span class="swatch sum-key"></span><span>their sum <Tex math={T.K} /></span>
					</li>
					<li><span class="swatch ellipse-key"></span>the ellipse of pairs with that sum and κ</li>
				</ul>
			</div>
		</section>

		<section class="panel" aria-label="The scene transform">
			<div class="stage">
				<p class="heading">Where the pair reads the scene transform</p>
				<svg
					viewBox="0 0 {BOX.W} {BOX.H}"
					role="img"
					aria-label={halfDescription}
					{@attach fitText((value) => (v = value))}
				>
					<defs>
						<clipPath id="{uid}-half">
							<rect x={BOX.L} y={BOX.T} width={BOX.S} height={BOX.S} />
						</clipPath>
						<mask
							id="{uid}-map"
							maskUnits="userSpaceOnUse"
							x={BOX.L}
							y={BOX.T}
							width={BOX.S}
							height={BOX.S}
						>
							<image
								x={BOX.L - CELL / 2}
								y={BOX.T - CELL / 2}
								width={BOX.S + CELL}
								height={BOX.S + CELL}
								preserveAspectRatio="none"
								{@attach paint}
							/>
						</mask>
					</defs>

					<rect class="frame" x={BOX.L} y={BOX.T} width={BOX.S} height={BOX.S} />
					<g clip-path="url(#{uid}-half)">
						<rect
							class="map"
							x={BOX.L}
							y={BOX.T}
							width={BOX.S}
							height={BOX.S}
							mask="url(#{uid}-map)"
						/>
						<!-- below the cone no pair of tides reaches -->
						<path class="beyond" d="M{BOX.L},{PB}L{PR},{BOX.T}V{PB}Z" />
					</g>
					{#each HALF_TICKS as t (t)}
						<line class="grid" x1={HX(t)} x2={HX(t)} y1={BOX.T} y2={PB} />
						<line class="grid" x1={BOX.L} x2={PR} y1={HY(t)} y2={HY(t)} />
						<text class="fine mid" x={HX(t)} y={PB + 13 * v}>{t}</text>
						<text class="fine end" x={BOX.L - 5 * v} y={f1(HY(t) + 3.5 * v)}>{t}</text>
					{/each}
					<text class="small end" x={PR} y={PB + 28 * v}><tspan class="it">K</tspan>, in m⁻¹</text>
					<text class="small start" x={BOX.L} y={BOX.T - 8 * v}
						><tspan class="it">κ</tspan>, in m⁻¹</text
					>

					<line class="cone" x1={HX(0)} y1={HY(0)} x2={HX(HALF)} y2={HY(HALF)} />
					<text class="small words" x={HX(4.1)} y={HY(3.45)}
						>the cone, <tspan class="it">κ</tspan> = <tspan class="it">K</tspan></text
					>

					{#each firsts as p, i (i)}
						<circle class="first" cx={f1(p.x)} cy={f1(p.y)} r={3 * v} />
					{/each}
					<circle class={['dot', { off: dot.off }]} cx={f1(dot.x)} cy={f1(dot.y)} r={4.8 * v} />
				</svg>
				<ul class="legend" aria-hidden="true">
					<li>
						<span class="swatch dot-key"></span><span>the pair’s point <Tex math={T.point} /></span>
					</li>
					<li>
						<span class="swatch first-key"></span><span
							>the first readings of <Tex math={T.k} /> and <Tex math={T.kp} /></span
						>
					</li>
					<li>
						<span class="swatch map-key"></span><span
							>the second reading, above the noise, brighter the larger</span
						>
					</li>
				</ul>
			</div>
		</section>
	</div>

	<div class="bar">
		<Segmented label="The scene" options={OPTIONS} bind:value={scene} />
		<div class="sliders">
			<Slider
				id="{uid}-snr"
				label="Signal-to-noise"
				icon={SignalIcon}
				min={SNR.low}
				max={SNR.high}
				step={SNR.step}
				bind:value={() => logSnr, setLogSnr}
				readout={snrText(logSnr)}
				marks={SNR_MARKS}
				marksHint="the ticks mark each power of ten"
			/>
			{#if scene === 'point'}
				<Slider
					id="{uid}-depth"
					label="Depth of the mass"
					icon={ArrowDownDoubleIcon}
					min={POINT.depth.min}
					max={POINT.depth.max}
					step={POINT.depth.step}
					bind:value={() => depth, setDepth}
					readout="z₀ = {depth.toFixed(2)} m"
					ends={['0.5 m', '3 m']}
					mark={{ at: POINT.depth.opening, label: '1 m' }}
				/>
			{:else}
				<p class="about">
					The bump <Tex math={T.psi} /> fills a ball of radius {BUMP.a} m, its centre {BUMP.depth} m below
					the camera; the density is <Tex math={T.density} />.
				</p>
			{/if}
		</div>
		<p class="hint">
			Drag the tips of <Tex math={T.k} /> and <Tex math={T.kp} />; a dragged tip close to the line
			of the other arrow lands on it. With the keyboard, Tab to a tip: the arrow keys move it by
			0.05 m⁻¹, with Shift by 0.25.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The point</dt>
				<dd>{@render eq(KTex)}{@render eq(kappaTex)}</dd>
			</div>
			<div class="row">
				<dt>The ellipse’s semi-axes</dt>
				<dd>{@render eq(majorTex)}{@render eq(minorTex)}</dd>
			</div>
			<div class="row">
				<dt>The factor</dt>
				<dd>{@render eq(factorTex)}</dd>
			</div>
			<div class="row">
				<dt>The second reading</dt>
				<dd>
					{@render eq(readingTex)}<span class={['status', { above: r.above }]}
						>{r.above ? 'above the noise' : 'below the noise'}</span
					><span class="also">the floor: {floorText} kg m⁻²</span>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Exact: the arrows, their sum, the ellipse, the pair’s point, the cone’s line and the readouts,
		from <Tex math={T.sum} />, <Tex math={T.kappa} /> and the paper’s two lines; the point mass’s transform
		<Tex math={`${RHO} = \\htmlClass{q-matter}{m}\\,e^{-\\kappa z_0}`} trust />, with <Tex
			math={T.mass}
			trust
		/>; and the null scene’s <Tex math={T.nullRho} />, for <Tex math={T.bump} /> with <Tex
			math={T.psi0}
		/> (a density of −8.6 × 10³ kg m⁻³ at its centre), whose <Tex math={T.psiTilde} /> is a smooth integral
		over the radius, taken by 24-point Gauss–Legendre quadrature to rounding. Both scenes sit under the
		camera’s origin, so <Tex math={RHO} trust /> is real and depends on <Tex math={T.K} /> only through
		<Tex math="K" />. Schematic: the noise. The floor is one number for the whole map, its largest
		value divided by the signal-to-noise ratio, as if every point were read alone with the same
		noise; the chapter’s gap box names what that skips. The map is drawn on 150 × 150 cells, on a
		log scale from the floor to its top, in the colour of matter, since it shows the scene
		transform; the cone is drawn in the ink.
	</p>
</div>

<style>
	.two-readings {
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
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
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 26rem;
		height: auto;
		margin: 0 auto;
		overflow: visible;
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

	.fine {
		font-size: calc(10px * var(--u, 1));
		font-variant-numeric: tabular-nums;
		fill: var(--text-faint);
	}

	.mid {
		text-anchor: middle;
	}

	.end {
		text-anchor: end;
	}

	.start {
		text-anchor: start;
	}

	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.75em;
	}

	.halo,
	.words {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* a vector's name in the chapter's bold */
	.vector-name {
		fill: var(--text);
		font:
			700 calc(13px * var(--u, 1)) / 1 KaTeX_Main,
			var(--font-serif);
	}

	/* the prime in the text's own face, which has the glyph */
	.prime {
		font-family: var(--font-sans);
		font-weight: 500;
	}

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
	}

	/* --- the plane of wavevectors ---------------------------------------------------------------- */

	/* the wavevectors are neither matter nor tides: the ink */
	.shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.9px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--text);
	}

	.sum-shaft {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(2.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.sum-head {
		fill: color-mix(in srgb, var(--text) 62%, transparent);
	}

	.side {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ellipse {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-linejoin: round;
	}

	.focus-point {
		fill: var(--text-dim);
	}

	.tip {
		cursor: grab;
		touch-action: none;
	}

	svg.dragging,
	svg.dragging .tip {
		cursor: grabbing;
	}

	.tip:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.knob {
		fill: var(--bg-raised);
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.ring {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
		opacity: 0;
	}

	.tip:focus-visible .ring {
		opacity: 1;
	}

	@media (hover: hover) {
		.tip:hover .knob {
			fill: color-mix(in srgb, var(--text) 25%, var(--bg-raised));
		}
	}

	/* --- the half-plane ------------------------------------------------------------------------ */

	/* the map is of the scene transform: the colour of matter */
	.map {
		fill: var(--q-matter);
		opacity: 0.62;
	}

	.beyond {
		fill: color-mix(in srgb, var(--text) 5%, var(--bg-sunken));
		opacity: 0.9;
	}

	/* the cone in the ink: the tutorial keeps the paper's blue for squeeze */
	.cone {
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linecap: round;
	}

	.words {
		fill: var(--text-dim);
	}

	.first {
		fill: var(--bg-raised);
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-raised);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.dot.off {
		fill: var(--bg-raised);
		stroke: var(--text);
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	/* --- the legends ------------------------------------------------------------------------ */

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
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 1.8px solid var(--text);
	}

	.sum-key {
		border-top: 2.6px solid color-mix(in srgb, var(--text) 62%, transparent);
	}

	.ellipse-key {
		border-top: 1.2px solid var(--text-dim);
	}

	.dot-key,
	.first-key {
		width: 0.6rem;
		height: 0.6rem;
		border: 0;
		border-radius: 50%;
		background: var(--text);
	}

	.first-key {
		box-sizing: border-box;
		width: 0.5rem;
		height: 0.5rem;
		border: 1.3px solid var(--text);
		background: var(--bg-raised);
	}

	.map-key {
		width: 1.1rem;
		height: 0.6rem;
		border: 0;
		border-radius: 2px;
		background: linear-gradient(
			to right,
			color-mix(in srgb, var(--q-matter) 14%, transparent),
			color-mix(in srgb, var(--q-matter) 85%, transparent)
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

	.sliders {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.2rem;
		align-items: start;
	}

	.about {
		margin: 0;
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
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
		grid-template-columns: 10rem minmax(0, 1fr);
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
		gap: 0.15rem 1rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.eq {
		display: inline-flex;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
	}

	.status {
		font-weight: 500;
		color: var(--text-dim);
	}

	.status.above {
		color: var(--text);
	}

	.also {
		color: var(--text-dim);
		font-variant-numeric: normal;
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
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
