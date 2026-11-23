<script lang="ts">
	/**
	 * Chapter 2.3's list of moments made live. Up to six equal point masses lie in a plane inside a circle of radius
	 * R, and the reader drags them (or moves them with the arrow keys). A ring of readout in the same plane, at the
	 * distance r the reader sets, stands for the camera. Below, one bar for each degree ℓ = 0 … 40: the largest size
	 * round the ring of the term of degree ℓ of the exterior expansion, built from the moments Q_ℓm, as a fraction of
	 * the monopole's, on a logarithmic axis, with the limit (R/r)^ℓ and the noise of a camera that reads the monopole
	 * at the chosen signal-to-noise ratio. The degree chosen is drawn on the ring. The gravity is three-dimensional;
	 * the maths is in ./multipoles.ts. Two predictions at the top are answered once the reader has done what they ask.
	 */
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Add01Icon,
		MinusSignIcon,
		RadialIcon,
		SignalIcon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import {
		DEGREE_NAMES,
		MOST_DEGREE,
		MOST_MASSES,
		PRESETS,
		PRESET_NAMES,
		RING_FIRST,
		RING_LEAST,
		RING_MOST,
		SNR_FIRST,
		SNR_LEAST,
		SNR_MOST,
		aboveNoise,
		centreOfMass,
		freePlace,
		patternsUpTo,
		peak,
		quadrupole,
		ringTerms,
		ruleReach,
		ruleTop,
		degreesInWords,
		oddZero,
		sampleTerm,
		settle,
		strengthsOf,
		termAt,
		type Mass,
		type PresetName
	} from './multipoles';

	const uid = $props.id();

	// --- the state -------------------------------------------------------------------------------------------------
	const copy = (list: Mass[]) => list.map((p) => ({ ...p }));
	let masses = $state<Mass[]>(copy(PRESETS.ell));
	let ring = $state(RING_FIRST);
	let snrPower = $state(SNR_FIRST);
	let degree = $state(2);
	const snr = $derived(10 ** snrPower);

	/** A preset glides the masses to their new places, unless the reader asks for less motion. */
	let from = $state<Mass[] | undefined>();
	const glide = new Tween(1, { duration: 0 });
	const lerp = (a: Mass, b: Mass, t: number) => ({
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t
	});
	const shown = $derived(
		from && glide.current < 1
			? masses.map((p, i) => lerp(from?.[i] ?? { x: 0, y: 0 }, p, cubicOut(glide.current)))
			: masses
	);

	// --- the predictions -------------------------------------------------------------------------------------------
	let ask = $state<1 | 2>(1);
	let reachedNear = $state(false);
	let centred = $state(false);
	let showOne = $state(false);
	let showTwo = $state(false);
	const revealed = $derived(ask === 1 ? reachedNear || showOne : centred || showTwo);

	function setRing(v: number) {
		ring = Math.round(Math.max(RING_LEAST, Math.min(RING_MOST, v)) * 100) / 100;
		if (ring <= 1.5 + 1e-9) reachedNear = true;
	}

	const atCentre = (p: Mass) => Math.hypot(p.x, p.y) < 1e-9;

	function choose(name: PresetName) {
		from = copy(shown);
		masses = copy(PRESETS[name]);
		if (masses.some(atCentre)) centred = true;
		glide.set(0, { duration: 0 });
		glide.set(1, { duration: prefersReducedMotion.current ? 0 : 450 });
	}
	const presetNow = $derived(
		PRESET_NAMES.find(
			(n) =>
				PRESETS[n].length === masses.length &&
				PRESETS[n].every((p, i) => Math.hypot(p.x - masses[i].x, p.y - masses[i].y) < 1e-9)
		)
	);
	const PRESET_LABELS: Record<PresetName, string> = {
		ell: 'An L',
		pair: 'A pair',
		rod: 'A rod',
		ball: 'A ball'
	};

	function add() {
		if (masses.length >= MOST_MASSES) return;
		from = undefined;
		masses.push(freePlace(masses));
	}

	function remove() {
		if (masses.length <= 1) return;
		from = undefined;
		masses.pop();
	}

	// --- the physics -----------------------------------------------------------------------------------------------
	const terms = $derived(ringTerms(shown, ring));
	const bars = $derived(strengthsOf(terms, ring));
	const term = $derived(terms[degree]);
	const top = $derived(peak(term));
	const reach = $derived(ruleReach(ring, snr));
	const ruleLast = $derived(ruleTop(ring, snr));
	const above = $derived(aboveNoise(bars, snr));
	const cm = $derived(centreOfMass(shown));
	const Q = $derived(quadrupole(shown));
	const farthest = $derived(Math.max(...shown.map((p) => Math.hypot(p.x, p.y))));

	// --- the picture of the plane: the body stays one size until the ring would leave the frame --------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const plane = $derived(phone.current ? { w: 350, h: 330 } : { w: 700, h: 330 });
	const cx = $derived(plane.w / 2);
	const cy = $derived(plane.h / 2);
	const ringMost = $derived(plane.h / 2 - 18);
	/** Drawing units in one R. */
	const unit = $derived(ringMost / Math.max(ring, 1.8));
	const ringPx = $derived(ring * unit);
	const sx = (p: Mass) => cx + unit * p.x;
	const sy = (p: Mass) => cy - unit * p.y;
	const f1 = (n: number) => n.toFixed(1);

	/** Drawing units in one CSS pixel, in each drawing. */
	let u = $state(1);
	let v = $state(1);

	/**
	 * The degree chosen, drawn as a ripple outside the ring, to its own scale: on the ring where the term is at its
	 * most negative, RIPPLE further out where it is at its most positive, and halfway where it is zero. Outside, so
	 * that it never crosses the masses when the ring is close.
	 */
	const RIPPLE = $derived(12 * u);
	const flat = $derived(degree === 0 || bars[degree].zero);
	const ripple = $derived.by(() => {
		const n = 540;
		const f = sampleTerm(term, n);
		let d = '';
		for (let i = 0; i < n; i++) {
			const phi = (2 * Math.PI * i) / n;
			const rad = flat
				? ringPx + (degree === 0 ? 0 : RIPPLE / 2)
				: ringPx + (RIPPLE * (1 + f[i] / top.value)) / 2;
			d += `${i ? 'L' : 'M'}${f1(cx + rad * Math.cos(phi))},${f1(cy - rad * Math.sin(phi))}`;
		}
		return d + 'Z';
	});
	const rippleName = $derived(
		degree === 0
			? 'the monopole, the same all round'
			: bars[degree].zero
				? `degree ${degree}: zero all round`
				: phone.current
					? `degree ${degree} on the ring`
					: `degree ${degree}, drawn on the ring`
	);
	/** Where the chosen degree is largest in size round the ring: on a crest of the ripple or in a trough. */
	const peakAt = $derived.by(() => {
		const rad = ringPx + (RIPPLE * (1 + Math.sign(termAt(term, top.at)))) / 2;
		return { x: cx + rad * Math.cos(top.at), y: cy - rad * Math.sin(top.at) };
	});

	/** The labels in the corners, each with its leader to the circle it names. */
	const at = (rad: number, deg: number) => ({
		x: cx + rad * Math.cos((deg * Math.PI) / 180),
		y: cy - rad * Math.sin((deg * Math.PI) / 180)
	});
	/**
	 * Where each label stands and the point its leader reaches. On a wide screen the labels stand beside the ring,
	 * level with the point they name; on a phone, where there is no room beside it, in the corners.
	 */
	const labels = $derived.by(() => {
		if (phone.current) {
			const ringTip = at(ringPx, 132);
			const circleTip = at(unit, 228);
			const rippleTip = at(ringPx + RIPPLE + 2 * u, 48);
			return {
				ring: { x: 8 * u, y: 16 * u, anchor: 'start', from: { x: 30 * u, y: 22 * u }, to: ringTip },
				circle: {
					x: 8 * u,
					y: plane.h - 10 * u,
					anchor: 'start',
					from: { x: 30 * u, y: plane.h - 23 * u },
					to: circleTip
				},
				ripple: {
					x: plane.w - 8 * u,
					y: 16 * u,
					anchor: 'end',
					from: { x: plane.w - 30 * u, y: 22 * u },
					to: rippleTip
				}
			};
		}
		const ringTip = at(ringPx, 152);
		const circleTip = at(unit, -52);
		const rippleTip = at(ringPx + RIPPLE + 2 * u, 28);
		const left = cx - ringPx - 18 * u;
		const right = cx + ringPx + RIPPLE + 8 * u;
		const beside = (tip: { x: number; y: number }, x: number, anchor: 'start' | 'end') => ({
			x,
			y: tip.y + 3.5 * u,
			anchor,
			from: { x: anchor === 'end' ? x + 5 * u : x - 5 * u, y: tip.y },
			to: tip
		});
		return {
			ring: beside(ringTip, left, 'end'),
			circle: beside(circleTip, right, 'start'),
			ripple: beside(rippleTip, right, 'start')
		};
	});

	// --- moving a mass: by pointer, or by the arrow keys ------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<number | undefined>();
	/** A drag lands on the centre from within this, in units of R. */
	const SNAP = 0.05;

	function inR(e: PointerEvent): Mass {
		const m = svg?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: (p.x - cx) / unit, y: (cy - p.y) / unit };
	}

	function place(i: number, p: Mass, snap: number) {
		from = undefined;
		const q = Math.hypot(p.x, p.y) < snap ? { x: 0, y: 0 } : p;
		const round = (n: number) => Math.round(n * 1e9) / 1e9;
		const s = settle(masses, i, q);
		masses[i] = { x: round(s.x), y: round(s.y) };
		if (atCentre(masses[i])) centred = true;
	}

	/** Pointer moves, at most one a frame. */
	let pending: Mass | undefined;
	let frame = 0;
	function schedule(p: Mass) {
		pending = p;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging !== undefined && pending) place(dragging, pending, SNAP);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, i: number) {
		if (e.button !== 0) return;
		// a drag is not a click: the mass does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = i;
	}

	function move(e: PointerEvent) {
		if (dragging !== undefined) schedule(inR(e));
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, i: number) {
		const step = e.shiftKey ? 0.2 : 0.05;
		const d = {
			ArrowLeft: { x: -step, y: 0 },
			ArrowRight: { x: step, y: 0 },
			ArrowUp: { x: 0, y: step },
			ArrowDown: { x: 0, y: -step }
		}[e.key];
		if (!d) return;
		e.preventDefault();
		const p = shown[i];
		// a step lands on the centre only from within half a step, so the next step leaves it
		place(i, { x: p.x + d.x, y: p.y + d.y }, step / 2);
	}

	// --- the chart of the degrees -----------------------------------------------------------------------------------
	const chart = $derived(phone.current ? { w: 350, h: 250 } : { w: 700, h: 250 });
	const C = $derived(
		phone.current
			? { L: 36, R: chart.w - 36, T: 10, B: chart.h - 40 }
			: { L: 44, R: chart.w - 44, T: 10, B: chart.h - 40 }
	);
	/** The axis runs from 1 down to 10⁻¹⁸ of the monopole. */
	const FLOOR = 18;
	const slot = $derived((C.R - C.L) / (MOST_DEGREE + 1));
	const bx = (l: number) => C.L + (l + 0.5) * slot;
	const by = (value: number) =>
		C.T + (Math.min(FLOOR, Math.max(0, -Math.log10(value))) / FLOOR) * (C.B - C.T);
	const noiseY = $derived(by(1 / snr));
	const DECADES = [0, 3, 6, 9, 12, 15, 18];
	const DEGREE_TICKS = [0, 5, 10, 15, 20, 25, 30, 35, 40];
	/** The limit (R/r)^ℓ, as far as the floor of the axis, where it ends. */
	const limitPath = $derived.by(() => {
		const end = Math.min(MOST_DEGREE, FLOOR / Math.log10(ring));
		let d = '';
		for (let l = 0; l <= end; l++) d += `${l ? 'L' : 'M'}${f1(bx(l))},${f1(by(ring ** -l))}`;
		if (end < MOST_DEGREE) d += `L${f1(bx(end))},${f1(C.B)}`;
		return d;
	});

	let chartSvg: SVGSVGElement | undefined;
	const holdChart = (node: SVGSVGElement) => {
		chartSvg = node;
		return () => (chartSvg = undefined);
	};
	/** A press on the chart chooses the degree under it. */
	function pick(e: PointerEvent) {
		if (e.button !== 0) return;
		const m = chartSvg?.getScreenCTM();
		if (!m) return;
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		if (p.x < C.L || p.x > C.R || p.y > C.B + 8) return;
		degree = Math.max(0, Math.min(MOST_DEGREE, Math.floor((p.x - C.L) / slot)));
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const M_TEX = '\\htmlClass{q-matter}{M}';
	const m_TEX = '\\htmlClass{q-matter}{m}';
	const Q_LM = '\\htmlClass{q-matter}{Q}_{\\ell m}';
	const Qij = (ij: string) => `\\htmlClass{q-matter}{Q}_{${ij}}`;
	const PHI = '\\htmlClass{q-field}{\\Phi}';
	const SNR = '\\mathrm{SNR}';
	const f2 = (n: number) => n.toFixed(2);
	const sig3 = (n: number) => n.toPrecision(3);
	/** A size as LaTeX: three figures, in powers of ten below a hundredth. */
	function size(x: number): string {
		if (x === 0) return '0';
		if (x >= 0.01) return String(Number(x.toPrecision(3)));
		const e = Math.floor(Math.log10(x));
		return `${(x / 10 ** e).toFixed(2)}\\times10^{${e}}`;
	}
	const signed = (x: number) => (Math.abs(x) < 5e-10 ? '0' : f2(x));

	const ringTex = $derived(`r = ${f2(ring)}\\,R`);
	const ruleTex = $derived([
		`\\ell < \\ln ${SNR}/\\ln(r/R)`,
		`= ${sig3(Math.log(snr))}/${sig3(Math.log(ring))} = ${sig3(reach)}`
	]);
	/** A count in digits, every one kept: 169, 1,225, 7,056. */
	const count = (n: number) => n.toLocaleString('en-US');
	const aboveWords = $derived.by(() => {
		if (above.length === 1) return 'Only the monopole stands above the noise.';
		const words = degreesInWords(above);
		const more = above.at(-1) === MOST_DEGREE ? ', and more beyond 40' : '';
		return `${words[0].toUpperCase()}${words.slice(1)} stand above the noise${more}.`;
	});
	const allZero = $derived(bars.slice(1).every((b) => b.zero));
	const chosen = $derived(bars[degree]);
	const chosenAbove = $derived(chosen.value > 1 / snr);
	const quadrupoleTex = $derived(
		[
			`${Qij('xx')} = ${signed(Q.xx)}`,
			`${Qij('yy')} = ${signed(Q.yy)}`,
			`${Qij('zz')} = ${signed(Q.zz)}`,
			`${Qij('xy')} = ${signed(Q.xy)}`
		].map((t) => `${t}\\,${m_TEX}R^2`)
	);

	const massLabel = (i: number) =>
		`Mass ${i + 1} of ${shown.length}, ${f2(Math.hypot(shown[i].x, shown[i].y))} R from the centre. Drag it, or move it with the arrow keys.`;
	const planeLabel = $derived(
		`${shown.length} equal masses inside a circle of radius R, and a ring of readout at ${f2(ring)} R, with degree ${degree} of the potential drawn on it.`
	);
	const chartLabel = $derived(
		`Bars for the degrees 0 to ${MOST_DEGREE}: the largest size of each on the ring, as a fraction of the monopole, on a logarithmic axis. ${aboveWords}`
	);
</script>

<div class="multipoles">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				<button type="button" aria-pressed={ask === 1} onclick={() => (ask = 1)}>1</button>
				<button type="button" aria-pressed={ask === 2} onclick={() => (ask = 2)}>2</button>
			</div>
		</div>
		<p class="question">
			{#if ask === 1}
				At <Tex math={`${SNR} = 10^6`} />, bring the ring from <Tex math="3R" /> to <Tex
					math="1.5R"
				/>. How many more degrees rise above the noise?
			{:else}
				Move one mass to the centre. Which bar changes least?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && ask === 1}
				<strong>About 22 more: degrees 0 to 34 instead of 0 to 12.</strong> From
				<Tex math="3R" /> a degree stands above the noise while <Tex math="3^\ell < 10^6" />, that
				is while <Tex math="\ell < 13.8/1.10 = 12.6" />: 169 moments. From <Tex math="1.5R" /> each degree
				is at most only <Tex math="1/1.5" /> of the one before, and the rule reaches <Tex
					math="\ell < 13.8/0.405 = 34.1"
				/>: <Tex math="35^2 = 1225" /> moments. The rule is the most a body inside the circle can give;
				these masses lie below the dashed line, so their bars cross the noise a few degrees sooner.
				<button type="button" class="next" onclick={() => (ask = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>The monopole: it does not change at all.</strong> Its term is
				<Tex math={`-G${M_TEX}/r`} trust />, the mass alone, wherever the pieces lie. A mass at the
				centre adds <Tex math={"r'^{\\,\\ell} = 0"} /> to every other degree, so each of them changes,
				and the dipole, zero while the centre of mass sat at the centre, appears.
			{:else if ask === 1}
				The answer appears when the ring is at <Tex math="1.5R" /> or closer, or
				<button type="button" class="next inline" onclick={() => (showOne = true)}
					>show it now</button
				>.
			{:else}
				The answer appears when a mass sits at the centre, or
				<button type="button" class="next inline" onclick={() => (showTwo = true)}
					>show it now</button
				>.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			class={['plane', { dragging: dragging !== undefined }]}
			viewBox="0 0 {plane.w} {plane.h}"
			role="group"
			aria-label={planeLabel}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<radialGradient id="{uid}-mass" cx="0.38" cy="0.34" r="0.7">
					<stop offset="0" class="mass-core" />
					<stop offset="0.7" class="mass-body" />
					<stop offset="1" class="mass-edge" />
				</radialGradient>
			</defs>

			<!-- the circle R that holds the masses, and the ring of readout -->
			<circle class="circle-r" {cx} {cy} r={unit} />
			<circle class="ring" {cx} {cy} r={ringPx} />
			<path class="ripple" d={ripple} />
			{#if !flat}
				<circle class="peak" cx={peakAt.x} cy={peakAt.y} r={2.6 * u} />
			{/if}

			<!-- the labels, each with its leader -->
			<g class="label">
				<line
					class="leader"
					x1={labels.ring.from.x}
					y1={labels.ring.from.y}
					x2={labels.ring.to.x}
					y2={labels.ring.to.y}
				/>
				<text x={labels.ring.x} y={labels.ring.y} text-anchor={labels.ring.anchor}
					>{phone.current ? 'the ring' : 'the ring of readout'}, <tspan class="sym">r</tspan> = {f2(
						ring
					)}&#8201;<tspan class="sym">R</tspan></text
				>
			</g>
			<g class="label">
				<line
					class="leader"
					x1={labels.circle.from.x}
					y1={labels.circle.from.y}
					x2={labels.circle.to.x}
					y2={labels.circle.to.y}
				/>
				<text x={labels.circle.x} y={labels.circle.y} text-anchor={labels.circle.anchor}
					>the circle <tspan class="sym">R</tspan> round the masses</text
				>
			</g>
			<g class="label field">
				<line
					class="leader"
					x1={labels.ripple.from.x}
					y1={labels.ripple.from.y}
					x2={labels.ripple.to.x}
					y2={labels.ripple.to.y}
				/>
				<text x={labels.ripple.x} y={labels.ripple.y} text-anchor={labels.ripple.anchor}
					>{rippleName}</text
				>
			</g>

			<!-- the centre, and the centre of mass -->
			<path
				class="centre"
				d="M{f1(cx - 4 * u)},{f1(cy)}H{f1(cx + 4 * u)}M{f1(cx)},{f1(cy - 4 * u)}V{f1(cy + 4 * u)}"
			/>
			<g class="cm" transform="translate({f1(sx(cm))} {f1(sy(cm))})">
				<circle r={4 * u} />
				<path d="M{-4 * u},0H{4 * u}M0,{-4 * u}V{4 * u}" />
			</g>

			<!-- the masses -->
			{#each shown as p, i (i)}
				<g
					class="mass"
					transform="translate({f1(sx(p))} {f1(sy(p))})"
					role="button"
					tabindex="0"
					aria-roledescription="movable mass"
					aria-label={massLabel(i)}
					onpointerdown={(e) => grab(e, i)}
					onkeydown={(e) => key(e, i)}
				>
					<circle class="hit" r={14 * u} />
					<circle class="focus" r={10 * u} />
					<circle class="disc" r={6.5 * u} fill="url(#{uid}-mass)" />
				</g>
			{/each}
		</svg>

		<svg
			class="chart"
			viewBox="0 0 {chart.w} {chart.h}"
			role="group"
			aria-label={chartLabel}
			onpointerdown={pick}
			{@attach holdChart}
			{@attach fitText((value) => (v = value))}
		>
			<defs>
				<clipPath id="{uid}-frame">
					<rect x={C.L} y={C.T - 1} width={C.R - C.L} height={C.B - C.T + 1} />
				</clipPath>
			</defs>

			<!-- below the noise -->
			<rect class="below" x={C.L} y={noiseY} width={C.R - C.L} height={C.B - noiseY} />

			<!-- the decades -->
			{#each DECADES as k (k)}
				<line class="grid" x1={C.L} y1={by(10 ** -k)} x2={C.R} y2={by(10 ** -k)} />
				<text class="num" x={C.L - 6 * v} y={by(10 ** -k) + 3.5 * v} text-anchor="end"
					>{k === 0 ? '1' : `10${superscript(-k)}`}</text
				>
			{/each}

			<!-- the bars -->
			{#each bars as b (b.l)}
				{#if !b.zero && b.value > 10 ** -FLOOR}
					<rect
						class={['column', { above: b.value > 1 / snr, chosen: b.l === degree }]}
						x={bx(b.l) - 0.32 * slot}
						y={by(b.value)}
						width={0.64 * slot}
						height={Math.max(0, C.B - by(b.value))}
					/>
				{/if}
			{/each}

			<!-- the limit (R/r)^ℓ, and the noise -->
			<path class="limit" d={limitPath} clip-path="url(#{uid}-frame)" />
			<line class="noise" x1={C.L} y1={noiseY} x2={C.R} y2={noiseY} />
			<text class="noise-name" x={C.R + 5 * v} y={noiseY + 3.5 * v}>noise</text>

			<!-- the axis of degrees -->
			<line class="axis" x1={C.L} y1={C.B} x2={C.R} y2={C.B} />
			<line class="axis" x1={C.L} y1={C.T} x2={C.L} y2={C.B} />
			{#each DEGREE_TICKS as l (l)}
				<line class="tick" x1={bx(l)} y1={C.B} x2={bx(l)} y2={C.B + 3 * v} />
				<text class="num" x={bx(l)} y={C.B + 15 * v} text-anchor="middle">{l}</text>
			{/each}
			<path
				class="marker"
				d="M{f1(bx(degree))},{f1(C.B + 1.5 * v)}l{f1(-3.5 * v)},{f1(6 * v)}h{f1(7 * v)}Z"
			/>
			<text class="axis-name" x={(C.L + C.R) / 2} y={C.B + 31 * v} text-anchor="middle"
				>degree <tspan class="sym">ℓ</tspan></text
			>
		</svg>

		<p class="legend">
			<span><i class="key mass-key"></i><span>a mass, <Tex math={m_TEX} trust /></span></span>
			<span><i class="key cm-key"></i>centre of mass</span>
			<span><i class="key bar-key"></i>a degree above the noise, and one below</span>
			<span
				><i class="key limit-key"></i><span
					><Tex math="(R/r)^\ell" />, the most a degree can be</span
				></span
			>
			<span
				><i class="key noise-key"></i><span
					>the noise, <Tex math={`1/${SNR}`} /> of the monopole</span
				></span
			>
		</p>
	</div>

	<div class="bar">
		<div class="row-controls">
			<div class="chips" role="group" aria-label="Bodies to start from">
				{#each PRESET_NAMES as n (n)}
					<button type="button" aria-pressed={presetNow === n} onclick={() => choose(n)}
						>{PRESET_LABELS[n]}</button
					>
				{/each}
			</div>
			<div class="chips count" role="group" aria-label="The number of masses">
				<button
					type="button"
					onclick={remove}
					disabled={masses.length <= 1}
					aria-label="Remove a mass"
				>
					<HugeiconsIcon icon={MinusSignIcon} size={14} strokeWidth={1.8} />
				</button>
				<span class="count-text" aria-live="polite"
					>{masses.length} {masses.length === 1 ? 'mass' : 'masses'}</span
				>
				<button
					type="button"
					onclick={add}
					disabled={masses.length >= MOST_MASSES}
					aria-label="Add a mass"
				>
					<HugeiconsIcon icon={Add01Icon} size={14} strokeWidth={1.8} />
				</button>
			</div>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-ring"
				label="Ring’s distance, r"
				icon={RadialIcon}
				min={RING_LEAST}
				max={RING_MOST}
				step={0.01}
				bind:value={() => ring, setRing}
				readout="{f2(ring)} R"
				ends={['1.1 R', '6 R']}
				marks={[
					{ at: 1.18, label: 'the person as a rod, 1 m away' },
					{ at: 1.5, label: '1.5 R' },
					{ at: 3, label: 'three radii, as in Section XII' },
					{ at: 4, label: 'four radii' }
				]}
				marksHint="the ticks mark the rod at 1 m, 1.5 R, three radii and four"
			/>
			<Slider
				id="{uid}-snr"
				label="Signal-to-noise ratio"
				icon={SignalIcon}
				min={SNR_LEAST}
				max={SNR_MOST}
				step={1}
				bind:value={snrPower}
				readout="10{superscript(snrPower)}"
				ends={['10', `10${superscript(SNR_MOST)}`]}
				marks={[{ at: 6, label: '10⁶, as in Section XII' }]}
				marksHint="the tick marks Section XII’s 10⁶"
			/>
			<Slider
				id="{uid}-degree"
				label="Degree on the ring, ℓ"
				icon={WaveIcon}
				min={0}
				max={MOST_DEGREE}
				step={1}
				bind:value={degree}
				readout="ℓ = {degree}"
				ends={['0', String(MOST_DEGREE)]}
				marks={[{ at: 2, label: 'the quadrupole' }]}
				marksHint="the tick marks the quadrupole"
			/>
		</div>
		<p class="hint">
			Drag a mass, or reach it with Tab and move it with the arrow keys (with Shift, farther). Press
			a bar to draw its degree on the ring.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Ring</dt>
				<dd>
					<Tex math={ringTex} /><span class="also"
						>Each degree is at most <Tex math={`R/r = ${sig3(1 / ring)}`} /> of the one before, so degree
						<Tex math="\ell" /> is at most <Tex math="(R/r)^\ell" /> of the monopole.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Noise</dt>
				<dd>
					<Tex math={`${SNR} = 10^{${snrPower}}`} /><span class="also"
						>A degree stands above the noise while <Tex math={`(r/R)^\\ell < ${SNR}`} />, that is
						while <Tex math={ruleTex[0]} />
						<Tex math={ruleTex[1]} />: degrees 0 to {ruleLast}, {count(patternsUpTo(ruleLast))} moments{ruleLast >
						MOST_DEGREE
							? `; the chart stops at ${MOST_DEGREE}`
							: ''}.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>These masses</dt>
				<dd aria-live="polite">
					<span>{aboveWords}</span>
					<span class="also">
						{#if allZero}
							Every degree after the monopole is zero: outside, the masses pull as one mass at the
							centre, like a round body.
						{:else if oddZero(bars)}
							Every odd degree is zero, the dipole among them, because each mass has a partner
							opposite it through the centre.
						{:else if bars[1].zero}
							The dipole is zero, because the centre of mass is at the centre.
						{:else}
							The centre of mass is <Tex math={`${f2(Math.hypot(cm.x, cm.y))}\\,R`} /> from the centre,
							so the dipole is not zero.
						{/if}
						The farthest mass is <Tex math={`${f2(farthest)}\\,R`} /> from the centre.
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Degree <Tex math="\ell" /> = {degree}</dt>
				<dd>
					<span
						>{degree < DEGREE_NAMES.length ? `The ${DEGREE_NAMES[degree]}, with` : 'It has'}
						<Tex math={`2\\ell + 1 = ${2 * degree + 1}`} />
						{degree === 0 ? 'moment' : 'moments'}
						<Tex math={Q_LM} trust />.</span
					>
					<span class="also">
						{#if degree === 0}
							Its term is <Tex math={`${PHI} = -G${M_TEX}/r`} trust />, the same all round the ring:
							every bar is a fraction of it.
						{:else if chosen.zero}
							It is zero for these masses.
						{:else}
							Round the ring it reaches at most <Tex math={size(chosen.value)} /> of the monopole, against
							the limit <Tex math={`(R/r)^{${degree}} = ${size(chosen.limit)}`} />, and it stands {chosenAbove
								? 'above'
								: 'below'} the noise.
						{/if}
					</span>
				</dd>
			</div>
			<div class="row">
				<dt>Quadrupole</dt>
				<dd>
					{#each quadrupoleTex as t, i (i)}<Tex math={t} trust />{/each}
				</dd>
			</div>
		</dl>
		<p class="note">
			The masses are equal point masses, <Tex math={m_TEX} trust /> each, lying in one plane of ordinary
			space; the ring lies in the same plane, and the gravity is the usual three-dimensional one. Each
			bar is the largest size, round the ring, of the term of degree <Tex math="\ell" /> in the exterior
			expansion, built from the moments <Tex math={Q_LM} trust />, divided by the monopole’s <Tex
				math={`G${M_TEX}/r`}
				trust
			/>. Because the masses lie in a plane, the moments with <Tex math="\ell - m" /> odd are zero, but
			a degree still has <Tex math="2\ell + 1" /> moments, as for a body of any shape, and the counts
			are chapter 2.3’s. The dashed line is <Tex math="(R/r)^\ell" />, reached only by a mass on the
			circle
			<Tex math="R" /> on the line to the camera. The ripple shows the chosen degree round the ring, to
			its own scale; the dot marks where it is largest.
		</p>
	</div>
</div>

<style>
	.multipoles {
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

	.next.inline {
		margin-left: 0;
	}

	/* --- the plane and the chart ---------------------------------------------------------- */

	.stage {
		padding: 0.5rem 0.9rem 0.1rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
		/* the open picture lets a finger scroll the page; only the masses take a drag */
		touch-action: pan-y;
	}

	.plane.dragging,
	.plane.dragging .mass {
		cursor: grabbing;
	}

	.chart {
		margin-top: 0.4rem;
		cursor: pointer;
	}

	.circle-r {
		fill: color-mix(in srgb, var(--q-matter) 5%, transparent);
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ripple {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.peak {
		fill: var(--q-field);
	}

	.leader {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.label text {
		fill: var(--text-dim);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
	}

	.label.field text {
		fill: var(--q-field);
	}

	.sym {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 1.12em;
	}

	.centre {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.cm circle {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(1px * var(--u, 1));
	}

	.cm path {
		stroke: var(--q-matter);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.mass {
		cursor: grab;
		touch-action: none;
	}

	.mass:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.disc {
		stroke: color-mix(in srgb, var(--q-matter) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mass-core {
		stop-color: color-mix(in srgb, var(--q-matter) 75%, var(--bg));
	}

	.mass-body {
		stop-color: color-mix(in srgb, var(--q-matter) 50%, var(--bg));
	}

	.mass-edge {
		stop-color: color-mix(in srgb, var(--q-matter) 30%, var(--bg));
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.mass:focus-visible .focus {
		opacity: 1;
	}

	.below {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 9%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		fill: var(--text-dim);
		font: 400 calc(11px * var(--u, 1)) / 1 var(--font-sans);
	}

	.column {
		fill: color-mix(in srgb, var(--q-matter) 28%, transparent);
	}

	.column.above {
		fill: color-mix(in srgb, var(--q-matter) 78%, transparent);
	}

	.column.chosen {
		stroke: var(--q-field);
		stroke-width: calc(1px * var(--u, 1));
	}

	.limit {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.noise {
		stroke: var(--accent);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.noise-name {
		fill: var(--accent-ink);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.marker {
		fill: var(--q-field);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
		padding: 0.45rem 0 0.55rem;
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
	}

	.mass-key {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--q-matter) 55%, var(--bg));
		border: 1px solid color-mix(in srgb, var(--q-matter) 60%, transparent);
	}

	.cm-key {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		border: 1px solid var(--q-matter);
		background:
			linear-gradient(var(--q-matter), var(--q-matter)) center / 1px 100% no-repeat,
			linear-gradient(var(--q-matter), var(--q-matter)) center / 100% 1px no-repeat;
	}

	.bar-key {
		width: 0.85rem;
		height: 0.6rem;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--q-matter) 78%, transparent) 0 40%,
			transparent 40% 60%,
			color-mix(in srgb, var(--q-matter) 28%, transparent) 60%
		);
	}

	.limit-key {
		border-top: 1.5px dashed var(--text-dim);
	}

	.noise-key {
		border-top: 1.5px solid var(--accent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.row-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.8rem;
		align-items: center;
	}

	.chips {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		flex: 1 1 18rem;
		padding: 3px;
		gap: 3px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.chips.count {
		flex: 0 0 auto;
		grid-template-columns: auto auto auto;
		align-items: center;
	}

	.chips button {
		min-width: 0;
		min-height: 1.9rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0.5rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 400 0.76rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.chips button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	@media (hover: hover) {
		.chips button:not(:disabled):hover {
			color: var(--text);
		}
	}

	.chips button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.count-text {
		padding: 0 0.4rem;
		font-size: 0.76rem;
		color: var(--text-dim);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem 1.2rem;
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
		gap: 0.45rem;
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

	@media (prefers-reduced-motion: reduce) {
		.chips button {
			transition: none;
		}
	}

	@media (max-width: 760px) {
		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.1rem;
		}

		.legend {
			padding-left: 0.4rem;
		}

		.row {
			grid-template-columns: 5.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
