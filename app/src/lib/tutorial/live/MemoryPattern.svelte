<script lang="ts">
	/**
	 * Chapter 7.8's memory-pattern figure. Left: a burst's emission pattern dE/d²n̂′, the same all round its axis ẑ,
	 * drawn as a polar curve in the matter colour, with the camera's direction N̂ as an arrow dragged round a circle (or
	 * turned with the arrow keys) at the angle θ from ẑ. Right: the memory |Δh| over all camera directions in the same
	 * plane, in units of 4GE/c⁴r as in the paper's fig:memory(b), in the field colour, dashed where Δh₊ < 0, with the
	 * camera's direction marked. Buttons choose the pattern: one narrow jet, two opposite jets sharing E, a uniform
	 * sphere, a dipole 1 + a cos θ′, 1 + qP₂ and a merger's (1 + 6cos²θ′ + cos⁴θ′)/8. The sum of eq:memory-axes is in
	 * ../../engine/memory.ts, the figure's arithmetic in ./memory-pattern.ts. Opens on the merger, edge-on; three
	 * predictions at the top are answered once the reader has done what each asks. Nothing in it moves by itself, so
	 * reduced motion changes nothing.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowUp02Icon,
		ArrowUpDownIcon,
		CircleIcon,
		ContrastIcon,
		EllipseIcon,
		Orbit01Icon,
		RefreshIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		A,
		EVEN,
		JET_NEAR,
		LOPSIDED,
		OPENING,
		Q,
		SPHERE_SPAN,
		THETA,
		angleAt,
		curveOf,
		drawnRadius,
		fixed3,
		landed,
		noteFirst,
		noteSecond,
		noteSphere,
		noteThird,
		patternOf,
		percent,
		reading,
		ringsOf,
		scaleOf,
		signedRuns,
		snapAngle,
		stepped,
		texFixed3,
		two,
		type Kind,
		type Range,
		type Span
	} from './memory-pattern';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let kind = $state<Kind>(OPENING.kind);
	let a = $state(OPENING.a);
	let q = $state(OPENING.q);
	/** The camera's angle from ẑ, degrees, and the side of ẑ it is drawn on (the two are the same). */
	let theta = $state(OPENING.theta);
	let side = $state<1 | -1>(1);

	function setKind(k: Kind) {
		kind = k;
		note();
	}
	function setA(v: number) {
		a = landed(v, A);
		note();
	}
	function setQ(v: number) {
		q = landed(v, Q);
		note();
	}
	function setTheta(v: number, s: 1 | -1 = side) {
		theta = Math.max(0, Math.min(180, v));
		side = s;
		note();
	}

	function reset() {
		kind = OPENING.kind;
		a = OPENING.a;
		q = OPENING.q;
		theta = OPENING.theta;
		side = 1;
	}

	/** Arrow keys step a slider onto its grid, stopping at zero, with Shift by a larger step. */
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
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	/** The directions seen round the sphere. */
	let span: Span | undefined;
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		span = noteSphere(span, kind, theta);
		first = noteFirst(first, span);
		second = noteSecond(second, kind, theta);
		third = noteThird(third, kind, a);
	}

	/** Whether the closed form of the pattern shown may be written out: not before its prediction is answered. */
	const formShown = $derived(
		kind === 'sphere' ? first : kind === 'jet' ? second : kind === 'dipole' ? third : true
	);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const pattern = $derived(patternOf(kind, a, q));
	const now = $derived(reading({ kind, a, q, theta }));
	const curve = $derived(curveOf(pattern));
	const runs = $derived(signedRuns(curve.values));
	const scale = $derived(scaleOf(kind));
	const rings = $derived(ringsOf(scale));
	const merging = $derived(kind === 'merger');
	/** The camera's angle's letter: the merger's inclination ι, else θ. */
	const letter = $derived(merging ? 'ι' : 'θ');

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const layout = $derived.by(() => {
		const narrow = phone.current;
		const R = narrow ? 136 : 142;
		if (narrow)
			return {
				narrow,
				W: 360,
				H: 732,
				left: { x: 180, y: 200 },
				right: { x: 180, y: 578 },
				titles: [26, 404],
				R,
				Rp: 0.85 * R
			};
		return {
			narrow,
			W: 740,
			H: 392,
			left: { x: 184, y: 214 },
			right: { x: 556, y: 214 },
			titles: [26, 26],
			R,
			Rp: 0.85 * R
		};
	});

	type Pt = { x: number; y: number };
	/** A point at the angle t (degrees from ẑ, on the side s) and the distance r from c. */
	const polar = (c: Pt, t: number, r: number, s: 1 | -1 = 1): Pt => ({
		x: c.x + s * r * Math.sin((t * Math.PI) / 180),
		y: c.y - r * Math.cos((t * Math.PI) / 180)
	});
	const pathOf = (pts: Pt[], close = false) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`).join('') + (close ? 'Z' : '');

	/** The smooth pattern as a closed polar curve about ẑ. */
	const patternPath = $derived.by(() => {
		if (!pattern.smooth) return undefined;
		const pts: Pt[] = [];
		for (let d = 0; d < 360; d += 2) {
			const r = drawnRadius(pattern, Math.cos((d * Math.PI) / 180)) * layout.Rp;
			pts.push(polar(layout.left, d, r));
		}
		return pathOf(pts, true);
	});

	/** A narrow jet along ẑ (up) or −ẑ (down), drawn as a thin petal to the edge of the drawn scale. */
	function petal(c: Pt, up: boolean) {
		const L = layout.Rp * 1.02;
		const w = 5;
		const pts: Pt[] = [];
		for (let k = -12; k <= 12; k++) {
			const phi = (k / 12) * w;
			const r = L * (1 - (phi / w) ** 2);
			pts.push(polar(c, up ? phi : 180 + phi, r));
		}
		return pathOf(pts, true);
	}
	const jets = $derived(
		(pattern.jets ?? []).map((j) => ({
			key: j.along,
			d: petal(layout.left, j.along > 0),
			label: polar(layout.left, j.along > 0 ? 0 : 180, 0.62 * layout.Rp),
			words: j.share === 1 ? 'E' : 'E/2'
		}))
	);

	/** The camera's arrow N̂ on the left, from the source to the circle. */
	const tip = $derived(polar(layout.left, theta, layout.R, side));
	const arrowHead = $derived.by(() => {
		const c = layout.left;
		const l = Math.hypot(tip.x - c.x, tip.y - c.y) || 1;
		const t = { x: (tip.x - c.x) / l, y: (tip.y - c.y) / l };
		const hd = 9 * u;
		const wd = 3.6 * u;
		const at = { x: tip.x - t.x * 7 * u, y: tip.y - t.y * 7 * u };
		const base = { x: at.x - t.x * hd, y: at.y - t.y * hd };
		return {
			shaft: `M${f2(c.x)},${f2(c.y)}L${f2(base.x + t.x)},${f2(base.y + t.y)}`,
			head: `${f2(at.x)},${f2(at.y)} ${f2(base.x - t.y * wd)},${f2(base.y + t.x * wd)} ${f2(base.x + t.y * wd)},${f2(base.y - t.x * wd)}`
		};
	});
	/** Where N̂ is written: beyond the tip, and beside it when the arrow runs along ẑ. */
	const nAt = $derived.by(() => {
		const p = polar(layout.left, theta, layout.R + 18 * u, side);
		return theta < 8 || theta > 172 ? { x: p.x + side * 16 * u, y: p.y } : p;
	});

	/** The arc from ẑ to N̂ and its letter. */
	const angleArc = $derived.by(() => {
		const c = layout.left;
		const rho = 38 * u;
		if (theta < 1) return undefined;
		const end = polar(c, theta, rho, side);
		const sweep = side > 0 ? 1 : 0;
		return {
			d: `M${f2(c.x)},${f2(c.y - rho)}A${f2(rho)},${f2(rho)} 0 0 ${sweep} ${f2(end.x)},${f2(end.y)}`,
			label: polar(c, theta / 2, rho - 13 * u, side)
		};
	});

	// the polar plot of |Δh|
	const plotR = $derived(layout.R);
	const toPlot = (v: number) => (Math.abs(v) / scale) * plotR;
	const curvePaths = $derived(
		runs.flatMap((run, i) =>
			([1, -1] as const).map((s) => ({
				key: `${i}${s}`,
				negative: run.negative,
				d: pathOf(run.points.map((p) => polar(layout.right, p.theta, toPlot(p.value), s)))
			}))
		)
	);
	const holes = $derived(
		curve.holes.flatMap((t) => {
			const v = curve.values.find((p) => p.theta === t)?.value ?? 0;
			return ([1, -1] as const).map((s) => ({
				key: `${t}${s}`,
				...polar(layout.right, t, toPlot(v), s)
			}));
		})
	);
	/**
	 * The open circles that mark a jet's line as a limit are part of the second answer: drawn once it is answered, or
	 * while the camera stands on the line.
	 */
	const holesShown = $derived(second || now.inside);
	const ray = $derived(polar(layout.right, theta, plotR, side));
	const dot = $derived(polar(layout.right, theta, toPlot(now.plus), side));
	/** A ring's value as written beside it: "0.125", "0.25", "0.5", "1". */
	const ringWords = (v: number) => String(v);

	// --- dragging and the keys --------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	let pending: PointerEvent | undefined;
	let frame = 0;

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	/** The camera turned toward the pointer, from the centre of the nearer panel. */
	function aim(e: PointerEvent) {
		const p = local(e);
		if (!p) return;
		const { left, right } = layout;
		const c =
			Math.hypot(p.x - left.x, p.y - left.y) <= Math.hypot(p.x - right.x, p.y - right.y)
				? left
				: right;
		const dx = p.x - c.x;
		const dy = c.y - p.y;
		if (Math.hypot(dx, dy) < 4 * u) return;
		setTheta(snapAngle(angleAt(dx, dy)), dx < 0 ? -1 : 1);
	}

	function grab(e: PointerEvent) {
		if (e.button !== 0) return;
		// a drag is not a click: the arrow does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
	}

	/** A press on the open drawing, with a mouse or a pen, turns the camera there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = true;
		aim(e);
	}

	function move(e: PointerEvent) {
		if (!dragging) return;
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) aim(pending);
			pending = undefined;
		});
	}

	function release() {
		dragging = false;
	}

	function cameraKeys(e: KeyboardEvent) {
		const next = stepped(theta, e.key, e.shiftKey, THETA);
		if (next === undefined) return;
		e.preventDefault();
		setTheta(next);
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const H = '\\htmlClass{q-field}{\\Delta h}';
	const EE = '\\htmlClass{q-matter}{E}';
	const UNITS = `4G${EE}/c^4r`;
	const names: Record<Kind, string> = {
		merger: 'a merger’s waves',
		jet: 'one narrow jet',
		jets: 'two opposite jets sharing the energy',
		sphere: 'a uniform sphere',
		dipole: 'a dipole',
		quadrupole: 'a burst stronger along its axis'
	};
	const shapes: Record<Kind, string> = {
		merger: 'the merger’s (1 + 6cos²θ′ + cos⁴θ′)/8 of the power along the orbit’s axis',
		jet: 'all its energy in one narrow jet along ẑ',
		jets: 'its energy shared by two narrow jets along ẑ and against it',
		sphere: 'its energy spread evenly over every direction',
		dipole: 'brighter on one side, 1 + a cos θ′',
		quadrupole: 'stronger along its axis, 1 + qP₂(cos θ′)'
	};
	/** The closed form in units of GE/c⁴r, in TeX. */
	const formTex = $derived.by(() => {
		switch (kind) {
			case 'merger':
				return '\\tfrac1{24}\\sin^2\\iota\\,(17 + \\cos^2\\iota)';
			case 'jet':
				return '2(1 + \\cos\\theta)';
			case 'jets':
				return '2';
			case 'sphere':
				return '0';
			case 'dipole':
				return '0';
			case 'quadrupole':
				return '\\tfrac q2\\sin^2\\theta';
		}
	});
	/** The camera's place in words, beside its angle. */
	const sideWords = $derived(
		theta === 0
			? merging
				? ', face-on'
				: ', along ẑ'
			: theta === 180
				? merging
					? ', face-on from the other side'
					: ', against ẑ'
				: theta === 90
					? merging
						? ', edge-on'
						: ', across ẑ'
					: ''
	);
	const insideWords =
		'The camera is on the jet’s line: there Δh is zero by symmetry, and the camera is inside the jet, where the formula does not apply.';

	const description = $derived(
		`Left: the emission pattern of ${names[kind]}, ${shapes[kind]}, drawn as a polar curve about its axis ẑ, with the camera’s direction N̂ at ${theta}° from ẑ. ` +
			`Right: the memory |Δh| over every camera direction in the same plane, in units of 4GE/c⁴r, drawn out to ${scale}; ` +
			(runs.length === 0
				? 'here it is zero in every direction, so the curve is a point at the centre. '
				: runs.some((r) => r.negative)
					? 'dashed where Δh₊ is negative. '
					: '') +
			(curve.holes.length && holesShown
				? 'On the jets’ line an open circle marks the limit from beside it, which the memory itself does not reach. '
				: '') +
			`At the camera Δh₊ = ${fixed3(now.plus)}.`
	);
	const cameraLabel = $derived(
		`The camera’s direction N̂, ${theta}° from ẑ: Δh₊ = ${fixed3(now.plus)} in units of 4GE/c⁴r${now.inside ? ', zero by symmetry; the camera is inside the jet' : ''}. Drag it round its circle, or turn it 1° a press with the arrow keys, 10° with Shift.`
	);
	const summary = $derived(
		`${names[kind]}, camera at ${theta}°: Δh₊ = ${fixed3(now.plus)} times 4GE/c⁴r${now.inside ? ', the camera inside the jet' : ''}.`
	);
</script>

<div class="memory-pattern">
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
				A sphere of energy leaves how much memory, and from which direction?
			{:else if step === 2}
				Where does a single narrow jet leave the most?
			{:else}
				Make the pattern brighter on one side only. What memory is left?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>None, from every direction.</strong> Seen from any <Tex math="\hat N" />, a burst
				that is the same in every direction is the same all round the line of sight, and the weight
				<Tex math="\cos2\psi" /> averages to zero over a turn round it: <Tex
					math={`${H}_+ = ${H}_\\times = 0`}
					trust
				/> wherever the camera stands. Only the parts of a pattern of degree two and higher leave memory,
				and a sphere has none.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Close to its own line, where <Tex math="1 + \cos\theta" /> is largest.</strong>
				One jet leaves <Tex math={`${H}_+ = 2(1 + \\cos\\theta)\\,G${EE}/c^4r`} trust />, which
				tends to <Tex math={UNITS} trust />, 1 on the plot, as the camera nears the jet’s line, and
				falls to zero from behind, at 180°. Exactly on the line it is none, by symmetry: a turn
				about <Tex math="\hat N" /> leaves the jet unchanged. The camera is then inside the jet, where
				the formula does not apply, so the open circle at the top of the curve is a limit, never reached.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>None: a dipole leaves no memory.</strong> With <Tex
					math="\cos\theta' = \cos\theta\cos\beta + \sin\theta\sin\beta\cos\psi"
				/>, the pattern <Tex math="1 + a\cos\theta'" /> is a constant plus a multiple of <Tex
					math="\cos\psi"
				/> round the line of sight, and neither survives the turn against <Tex math="\cos2\psi" />.
				However lopsided the burst, the strain it leaves is unchanged from every direction, and the
				polar plot shrinks to a point.
			{:else if step === 1}
				The answer appears once you have chosen the uniform sphere and turned the camera through {SPHERE_SPAN}°
				or more round it.
			{:else if step === 2}
				The answer appears once you have chosen one narrow jet and brought the camera within {JET_NEAR}°
				of its line.
			{:else}
				The answer appears once you have chosen the dipole and moved <Tex math="a" /> to ±{LOPSIDED}
				or beyond.
			{/if}
		</p>
	</section>

	<div class="tabs">
		<Segmented
			label="Emission pattern"
			bind:value={() => kind, setKind}
			options={[
				{ value: 'merger', label: 'A merger’s waves', icon: Orbit01Icon },
				{ value: 'jet', label: 'One narrow jet', icon: ArrowUp02Icon },
				{ value: 'jets', label: 'Two opposite jets', icon: ArrowUpDownIcon },
				{ value: 'sphere', label: 'A uniform sphere', icon: CircleIcon },
				{ value: 'dipole', label: 'A dipole', icon: ContrastIcon },
				{ value: 'quadrupole', label: '1 + qP₂', icon: EllipseIcon }
			]}
		/>
	</div>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<!-- the emission pattern -->
			<text class="title" x={layout.left.x - layout.R - 10} y={layout.titles[0]}
				>The emission pattern, <tspan class="it">dE</tspan>/<tspan class="it">d</tspan>²<tspan
					class="it">n̂′</tspan
				></text
			>
			<line
				class="axis"
				x1={layout.left.x}
				x2={layout.left.x}
				y1={layout.left.y + layout.R}
				y2={layout.left.y - layout.R - 4 * u}
			/>
			<text
				class="label it mid"
				x={layout.left.x - side * 16 * u}
				y={layout.left.y - layout.R - 4 * u}>ẑ</text
			>
			<circle class="track" cx={layout.left.x} cy={layout.left.y} r={layout.R} />
			{#if kind !== 'sphere'}
				<circle class="even" cx={layout.left.x} cy={layout.left.y} r={f2(EVEN * layout.Rp)} />
			{/if}
			{#if patternPath}
				<path class="pattern" d={patternPath} />
			{/if}
			{#each jets as j (j.key)}
				<path class="pattern jet" d={j.d} />
				<text
					class="small matter-words halo {side > 0 ? 'end' : 'start'}"
					x={f2(j.label.x - side * 9 * u)}
					y={f2(j.label.y + 4 * u)}><tspan class="it">{j.words[0]}</tspan>{j.words.slice(1)}</text
				>
			{/each}
			<circle class="source" cx={layout.left.x} cy={layout.left.y} r={3.2 * u} />
			{#if angleArc}
				<path class="arc" d={angleArc.d} />
				<text class="label it mid halo" x={f2(angleArc.label.x)} y={f2(angleArc.label.y + 4 * u)}
					>{letter}</text
				>
			{/if}
			<g class="camera-arrow">
				<path d={arrowHead.shaft} />
				<polygon points={arrowHead.head} />
			</g>
			<!-- N̂ as a letter and a hat, since a combining hat is not drawn over the letter in every face -->
			<text class="label it mid halo" x={f2(nAt.x)} y={f2(nAt.y + 4 * u)}>N</text>
			<text class="label mid" x={f2(nAt.x + 1.5 * u)} y={f2(nAt.y - 1 * u)}>ˆ</text>
			{#if now.inside}
				<text
					class="small inside-words halo {side > 0 ? 'start' : 'end'}"
					x={f2(tip.x + side * 18 * u)}
					y={f2(tip.y + 26 * u)}>camera inside the jet</text
				>
			{/if}
			<g
				class="handle"
				role="slider"
				tabindex="0"
				aria-roledescription="movable camera direction"
				aria-label={cameraLabel}
				aria-valuemin={0}
				aria-valuemax={180}
				aria-valuenow={theta}
				aria-valuetext="{theta}° from ẑ, Δh₊ = {fixed3(now.plus)}"
				onpointerdown={grab}
				onkeydown={cameraKeys}
			>
				<circle class="hit" cx={f2(tip.x)} cy={f2(tip.y)} r={18 * u} />
				<circle class="focus" cx={f2(tip.x)} cy={f2(tip.y)} r={11 * u} />
				<circle class="camera" cx={f2(tip.x)} cy={f2(tip.y)} r={5.5 * u} />
			</g>

			<!-- the memory over the camera's directions -->
			<text class="title" x={layout.right.x - layout.R - 10} y={layout.titles[1]}
				>|<tspan class="field-words">Δ<tspan class="it">h</tspan></tspan>| over camera directions,
				in units of 4<tspan class="it">GE</tspan>/<tspan class="it">c</tspan>⁴<tspan class="it"
					>r</tspan
				></text
			>
			{#each rings as v, i (i)}
				<circle
					class={['ring', { outer: i === rings.length - 1 }]}
					cx={layout.right.x}
					cy={layout.right.y}
					r={f2(toPlot(v))}
				/>
			{/each}
			<line
				class="axis"
				x1={layout.right.x}
				x2={layout.right.x}
				y1={layout.right.y + plotR}
				y2={layout.right.y - plotR - 4 * u}
			/>
			<text
				class="label it mid"
				x={layout.right.x - side * 12 * u}
				y={layout.right.y - plotR - 4 * u}>ẑ</text
			>
			{#each rings as v, i (i)}
				{#if i % 2 === 1}
					<text
						class="small dim halo end"
						x={f2(layout.right.x - 4 * u)}
						y={f2(layout.right.y - toPlot(v) + 12 * u)}>{ringWords(v)}</text
					>
				{/if}
			{/each}
			<line class="ray" x1={layout.right.x} y1={layout.right.y} x2={f2(ray.x)} y2={f2(ray.y)} />
			{#each curvePaths as c (c.key)}
				<path class={['memory', { negative: c.negative }]} d={c.d} />
			{/each}
			{#each holesShown ? holes : [] as h (h.key)}
				<circle class="hole" cx={f2(h.x)} cy={f2(h.y)} r={3.6 * u} />
			{/each}
			<circle class="reading" cx={f2(dot.x)} cy={f2(dot.y)} r={4.2 * u} />
			{#if now.inside}
				<text
					class="small inside-words halo {side > 0 ? 'start' : 'end'}"
					x={f2(layout.right.x + side * 10 * u)}
					y={f2(layout.right.y + 18 * u)}>0 by symmetry</text
				>
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch pattern-key"></span>energy per steradian, drawn to one scale</li>
			{#if kind !== 'sphere'}
				<li><span class="line-key even-key"></span>the same energy spread evenly</li>
			{/if}
			<li><span class="line-key memory-key"></span>|Δh|</li>
			{#if runs.some((r) => r.negative)}
				<li><span class="line-key memory-key negative"></span>where Δh₊ &lt; 0</li>
			{/if}
			{#if curve.holes.length && holesShown}
				<li><span class="hole-key"></span>the limit on the jet’s line, not reached</li>
			{/if}
			<li><span class="camera-key"></span>the camera’s direction</li>
		</ul>
	</div>

	<div class="bar">
		{#if kind === 'dipole'}
			<div class="slot" onkeydowncapture={sliderKeys(() => a, setA, A)} role="presentation">
				<Slider
					id="{uid}-a"
					label="Dipole, 1 + a cos θ′"
					icon={ContrastIcon}
					min={A.min}
					max={A.max}
					step={A.step}
					bind:value={() => a, setA}
					readout="a = {two(a)}"
					marks={[
						{ at: -1, label: '−1: dark along ẑ' },
						{ at: 0, label: '0: a sphere' },
						{ at: 1, label: '1: dark against ẑ' }
					]}
					marksHint="the ticks mark −1, 0 and 1"
				/>
			</div>
		{:else if kind === 'quadrupole'}
			<div class="slot" onkeydowncapture={sliderKeys(() => q, setQ, Q)} role="presentation">
				<Slider
					id="{uid}-q"
					label="Asymmetry q of 1 + qP₂"
					icon={EllipseIcon}
					min={Q.min}
					max={Q.max}
					step={Q.step}
					bind:value={() => q, setQ}
					readout="q = {two(q)}"
					marks={[
						{ at: -1, label: '−1: brighter across ẑ' },
						{ at: 0, label: '0: a sphere' },
						{ at: OPENING.q, label: '1, as the pattern opens' },
						{ at: 2, label: '2: dark across ẑ' }
					]}
					marksHint="the ticks mark −1, 0, 1 and 2"
				/>
			</div>
		{/if}
		<div class="controls">
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Drag the camera’s arrow <Tex math="\hat N" /> round its circle, or press anywhere on either drawing;
				or reach it with Tab and turn it 1° a press with the arrow keys, 10° with Shift. It stops at 0°,
				90° and 180°. The sliders take the arrow keys after Tab.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>The camera</dt>
				<dd>
					<span class="also"
						><Tex
							math={`${merging ? '\\theta = \\iota' : '\\theta'} = ${theta}^\\circ`}
						/>{sideWords}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The memory</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`${H}_+ = ${texFixed3(now.plus)}\\times${UNITS},\\quad ${H}_\\times = ${texFixed3(now.cross)}`}
							trust
						/></span
					>
					<span class="also block"
						><Tex math={`${H}_\\times`} trust /> is zero for every pattern here: each is the same all
						round <Tex math="\hat z" />, so the same at <Tex math="\psi" /> and <Tex
							math="-\psi"
						/>, and <Tex math="\sin2\psi" /> averages away.</span
					>
					{#if now.inside}
						<span class="inside block">{insideWords}</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The closed form</dt>
				<dd>
					{#if formShown}
						<span class="eq"
							><Tex
								math={`${H}_+ = ${formTex}\\;G${EE}/c^4r${now.inside ? '\\ \\text{off the line}' : ''}`}
								trust
							/></span
						>
						{#if now.inside}
							<span class="also">here 0, by symmetry: the formula holds only off the line</span>
						{:else}
							<span class="also"
								>= <span class="value">{fixed3(now.closed)}</span> × 4<span class="it">GE</span
								>/<span class="it">c</span>⁴<span class="it">r</span> here; the figure sums the integral
								and agrees</span
							>
						{/if}
					{:else}
						<span class="also">written out once its prediction is answered</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Degree 2 and up</dt>
				<dd>
					<span class="also"
						><span class="value">{percent(now.share)}</span> of the pattern, by its square{pattern.jets
							? ', in the limit of a narrow jet, which holds every degree'
							: ''}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The memory is the chapter’s
			<span class="formula"
				><Tex
					math={`${H}_+ = \\frac{2G}{c^4r}\\int\\frac{\\mathrm d\\htmlClass{q-matter}{E}}{\\mathrm d^2\\hat n'}\\,(1 + \\cos\\beta)\\cos2\\psi\\,\\mathrm d^2\\hat n'`}
					trust
				/></span
			>
			summed over the sky on a grid centred on <Tex math="\hat N" />, with <Tex math="\beta" /> the angle
			of the emission <Tex math="\hat n'" /> from <Tex math="\hat N" /> and <Tex math="\psi" /> its turn
			round <Tex math="\hat N" /> from <Tex math="\vec e_1" />, which lies on the side of <Tex
				math="\hat z"
			/>; a jet is a point of the sum. The pattern is drawn in the plane of <Tex math="\hat z" /> and
			<Tex math="\hat N" />, at each <Tex math="\theta'" /> a distance proportional to the energy per
			steradian, the same scale for every smooth pattern; a jet’s energy per steradian has no finite size,
			so its petal is drawn to the edge and labelled with its share. The memory is plotted in units of
			<Tex math={UNITS} trust />, as in panel (b) of the paper’s figure of the memory, out to {scale}.
			The share in degree two and up writes <Tex
				math={`4\\pi\\,\\mathrm d\\htmlClass{q-matter}{E}/\\htmlClass{q-matter}{E}\\,\\mathrm d^2\\hat n' = \\sum_\\ell c_\\ell P_\\ell(\\cos\\theta')`}
				trust
			/> and counts the part of <Tex math="\sum_\ell c_\ell^2/(2\ell + 1)" /> with <Tex
				math="\ell \ge 2"
			/>.
		</p>
	</div>
</div>

<style>
	.memory-pattern {
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

	.tabs {
		padding: 0.6rem 0.9rem;
		border-bottom: 1px solid var(--line);
		background: var(--bg-raised);
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 740px;
		height: auto;
		margin: 0 auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the arrow takes a drag */
		touch-action: pan-y;
		cursor: crosshair;
	}

	svg.dragging,
	svg.dragging .handle {
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
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.label {
		fill: var(--text);
		font-size: calc(13px * var(--u, 1));
	}

	.mid {
		text-anchor: middle;
	}

	.start {
		text-anchor: start;
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
	}

	tspan.it {
		font-size: 1.1em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.track {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 14%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.even {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.pattern {
		fill: color-mix(in srgb, var(--q-matter) 22%, transparent);
		stroke: var(--q-matter);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.pattern.jet {
		fill: color-mix(in srgb, var(--q-matter) 55%, transparent);
	}

	.matter-words {
		fill: var(--q-matter);
		font-weight: 600;
	}

	.source {
		fill: var(--q-matter);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.arc {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.camera-arrow path {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.camera-arrow polygon {
		fill: var(--text);
	}

	.inside-words {
		fill: var(--text);
		font-weight: 500;
		/* a wider halo, so that no line shows between the words */
		stroke-width: calc(7px * var(--u, 1));
	}

	/* the camera's handle */
	.handle {
		cursor: grab;
		touch-action: none;
	}

	.handle:focus {
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

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.camera {
		fill: var(--bg);
		stroke: var(--q-obs);
		stroke-width: calc(2.2px * var(--u, 1));
	}

	/* the polar plot */
	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ring.outer {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
	}

	.ray {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.memory {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	.memory.negative {
		stroke-dasharray: calc(6px * var(--u, 1)) calc(4px * var(--u, 1));
		stroke-linecap: butt;
	}

	.field-words {
		fill: var(--q-field);
	}

	.hole {
		fill: var(--bg-sunken);
		stroke: var(--q-field);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.reading {
		fill: var(--q-field);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 740px;
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

	.pattern-key {
		background: color-mix(in srgb, var(--q-matter) 22%, transparent);
		box-shadow: inset 0 0 0 1.5px var(--q-matter);
	}

	.line-key {
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid var(--text);
	}

	.even-key {
		border-top: 1.5px dotted var(--q-matter);
	}

	.memory-key {
		border-top: 2px solid var(--q-field);
	}

	.memory-key.negative {
		border-top-style: dashed;
	}

	.hole-key {
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1.5px var(--q-field);
	}

	.camera-key {
		flex: none;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		box-shadow: inset 0 0 0 2px var(--q-obs);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slot {
		min-width: 0;
		max-width: 26rem;
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

	.block {
		flex-basis: 100%;
	}

	.inside {
		color: var(--text);
		font-weight: 500;
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
