<script lang="ts">
	/**
	 * Chapter 4.5's sum rule: the line of power ω Im χ_h of a body under the tide h = xy, drawn against ω from 0 to
	 * 4ω₀, for a body with up to three lines, each the damped oscillator c_n²Γ_nω²/[(ω_n² − ω²)² + Γ_n²ω²]. Each line
	 * has a handle at its peak, c_n²/Γ_n high at ω_n: across, it sets ω_n (0.3 to 3.5ω₀) and keeps the width Γ_n;
	 * up and down, it sets Γ_n, and so Q_n from 1 to 100. A bar of weights above the plot (below it on a phone) moves
	 * weight between the lines, whose c_n² always add up to A = ∫ρ|∇h|² dV, the uniform steel ball's (2/5)MR² or a thin
	 * shell's (2/3)MR². The readouts give the shaded area times 2/π, integrated from 0 to ∞ and not only over the plot;
	 * the static compliance χ_h(0) = Σc_n²/ω_n²; and −ω² Re χ_h at 40ω₀, from the complex response. The numbers
	 * come from ./sum-rule.ts. Two predictions at the top are answered once the reader has done what they ask. Only
	 * the vertical axis moves by itself, when it rescales; under reduced motion it jumps.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		CircleIcon,
		PlusSignCircleIcon,
		SphereIcon,
		Undo02Icon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		BROAD_Q,
		FAR,
		MASS,
		MIN_SHARE,
		MOST_LINES,
		OMEGA_RANGE,
		OPENING,
		PLOT_MOST,
		SHARE_STEP,
		TOTAL,
		addLine,
		axisFor,
		boundary,
		doublable,
		doubled,
		farAnswer,
		heightTo,
		lineHeight,
		modes,
		moveBoundary,
		moveTo,
		power,
		powerLine,
		quality,
		samples,
		shareShown,
		staticCompliance,
		staticSum,
		stepQuality,
		sumRule,
		type Body,
		type Line,
		type Mode
	} from './sum-rule';

	const uid = $props.id();

	// --- the body and its lines -----------------------------------------------------------------------------------
	let lines = $state.raw<Line[]>(OPENING.lines);
	let body = $state<Body>(OPENING.body);
	const ms = $derived(modes(lines, body));

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** Each line's frequency when the first prediction was asked, by its id. */
	let from = $state.raw<ReadonlyMap<number, number>>(
		new Map(OPENING.lines.map((l) => [l.id, l.omega]))
	);
	type Doubling = { before: number; after: number; total: number };
	type Broadening = {
		index: number;
		Q: number;
		Gamma: number;
		height: number;
		openingHeight: number;
		shown: number;
		total: number;
		compliance: number;
	};
	let doubling = $state.raw<Doubling | undefined>();
	let broadening = $state.raw<Broadening | undefined>();
	const revealed = $derived(step === 1 ? doubling !== undefined : broadening !== undefined);
	const canDouble = $derived(doublable(from));

	function snapshot() {
		from = new Map(lines.map((l) => [l.id, l.omega]));
	}

	function choose(s: 1 | 2) {
		step = s;
		if (s === 1 && !doubling) snapshot();
		note();
	}

	function note() {
		if (step === 1 && !doubling && doubled(lines, from)) {
			const before = staticCompliance(
				ms.map((m, i) => ({ ...m, omega: from.get(lines[i].id) ?? m.omega }))
			);
			doubling = { before, after: staticCompliance(ms), total: sumRule(ms) };
		}
		if (step === 2 && !broadening) {
			const index = lines.findIndex((l) => quality(l) <= BROAD_Q + 1e-9);
			if (index >= 0) {
				const m = ms[index];
				broadening = {
					index,
					Q: quality(m),
					Gamma: m.Gamma,
					height: lineHeight(m),
					openingHeight: lineHeight({ ...m, Gamma: m.omega / 10 }),
					shown: shareShown([m]),
					total: sumRule(ms),
					compliance: staticCompliance(ms)
				};
			}
		}
	}

	// --- the actions ------------------------------------------------------------------------------------------------
	function setLines(next: Line[]) {
		lines = next;
		note();
		refit();
	}

	function setBody(b: Body) {
		body = b;
		note();
		refit();
	}

	function add() {
		const next = addLine(lines);
		const added = next.find((l) => !lines.some((o) => o.id === l.id));
		if (added) from = new Map([...from, [added.id, added.omega]]);
		setLines(next);
	}

	function reset() {
		body = OPENING.body;
		lines = OPENING.lines;
		if (!doubling) snapshot();
		note();
		refit();
	}

	// --- the vertical axis: fitted when nothing is being dragged up or down ------------------------------------------
	const opening = axisFor(OPENING.lines);
	let axis = $state(opening);
	const top = new Tween(opening.top, { duration: 450, easing: cubicOut });

	function refit() {
		if (dragging?.kind === 'line') return;
		const next = axisFor(lines);
		if (next.top === axis.top) return;
		axis = next;
		top.set(next.top, { duration: prefersReducedMotion.current ? 0 : 450 });
	}

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const layout = $derived.by(() => {
		if (phone.current) {
			const W = 360;
			const L = 38;
			const R = 352;
			const T = 26;
			const B = 266;
			const barY = B + 62;
			return { W, L, R, T, B, barY, barTitle: barY - 9, H: barY + 26 };
		}
		const W = 680;
		const L = 44;
		const R = 668;
		const barY = 26;
		const T = 96;
		const B = 386;
		return { W, L, R, T, B, barY, barTitle: barY - 9, H: B + 36 };
	});
	const BAR_H = 22;

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const X = (w: number) => layout.L + (w / PLOT_MOST) * (layout.R - layout.L);
	const Y = (v: number) => layout.B - (v / top.current) * (layout.B - layout.T);
	const fromX = (x: number) => ((x - layout.L) / (layout.R - layout.L)) * PLOT_MOST;
	const fromY = (y: number) => ((layout.B - y) / (layout.B - layout.T)) * top.current;

	// --- the curves ---------------------------------------------------------------------------------------------------
	const grid = $derived(samples(ms));
	const pathOf = (f: (w: number) => number) =>
		grid.map((w, i) => `${i ? 'L' : 'M'}${f2(X(w))},${f2(Math.max(-5000, Y(f(w))))}`).join('');
	const totalPath = $derived(pathOf((w) => power(w, ms)));
	const fillPath = $derived(
		`${totalPath}L${f2(X(PLOT_MOST))},${f2(Y(0))}L${f2(X(0))},${f2(Y(0))}Z`
	);
	const linePaths = $derived(ms.map((m) => pathOf((w) => powerLine(w, m))));

	/** Each handle: where its peak is, and where it is drawn, kept inside the plot when the peak is above it. */
	const handles = $derived(
		ms.map((m, i) => {
			const x = X(m.omega);
			const y = Y(lineHeight(m));
			const above = y < layout.T + 1;
			return { id: lines[i].id, x, y, shownY: above ? layout.T + 1 : y, above, m };
		})
	);

	const yTicks = $derived.by(() => {
		const out: number[] = [];
		for (let v = 0; v <= axis.top + 1e-9; v += axis.step) out.push(Number(v.toFixed(6)));
		return out;
	});
	const xTicks = [0, 1, 2, 3, 4];
	const halfTicks = [0.5, 1.5, 2.5, 3.5];

	/** The bar of weights: a segment for each line, and a boundary between each two. */
	const segments = $derived(
		lines.map((l, i) => {
			const a = i === 0 ? 0 : boundary(lines, i - 1);
			const b = boundary(lines, i);
			return {
				id: l.id,
				x0: X(0) + a * (X(PLOT_MOST) - X(0)),
				x1: X(0) + b * (X(PLOT_MOST) - X(0)),
				weight: ms[i].weight
			};
		})
	);

	/** Where each line's frequency was when the first prediction was asked, doubled: the targets. */
	const targets = $derived(
		step === 1 && !doubling && canDouble
			? lines.flatMap((l, i) => {
					const f = from.get(l.id);
					return f === undefined ? [] : [{ i, x: X(2 * f) }];
				})
			: []
	);

	// --- dragging -------------------------------------------------------------------------------------------------------
	type Drag = { kind: 'line'; id: number; dx: number; dy: number } | { kind: 'bar'; k: number };
	let dragging = $state.raw<Drag | undefined>();
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};

	function pointAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function grabLine(i: number, e: PointerEvent) {
		if (e.button !== 0) return;
		const p = pointAt(e);
		if (!p) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		// the axis stops where it is while a line is held, so that the handle stays under the pointer
		top.set(axis.top, { duration: 0 });
		const h = handles[i];
		dragging = { kind: 'line', id: h.id, dx: p.x - h.x, dy: p.y - h.y };
	}

	function grabBar(k: number, e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		dragging = { kind: 'bar', k };
	}

	function move(e: PointerEvent) {
		const d = dragging;
		if (!d) return;
		const p = pointAt(e);
		if (!p) return;
		if (d.kind === 'line') {
			const w = fromX(p.x - d.dx);
			const y = fromY(p.y - d.dy);
			setLines(lines.map((l) => (l.id === d.id ? heightTo(moveTo(l, w), y, body) : l)));
		} else {
			setLines(moveBoundary(lines, d.k, (p.x - X(0)) / (X(PLOT_MOST) - X(0))));
		}
	}

	function release() {
		if (!dragging) return;
		dragging = undefined;
		refit();
	}

	/** The arrow keys move a line a hundredth of ω₀ across, or a tenth with Shift, and step its Q up and down. */
	function lineKey(i: number, e: KeyboardEvent) {
		const l = lines[i];
		const by = e.shiftKey ? OMEGA_RANGE.big : OMEGA_RANGE.step;
		let next: Line | undefined;
		if (e.key === 'ArrowLeft') next = moveTo(l, l.omega - by);
		else if (e.key === 'ArrowRight') next = moveTo(l, l.omega + by);
		else if (e.key === 'ArrowUp') next = stepQuality(l, 1);
		else if (e.key === 'ArrowDown') next = stepQuality(l, -1);
		else if (e.key === 'PageUp') next = stepQuality(l, 3);
		else if (e.key === 'PageDown') next = stepQuality(l, -3);
		else if (e.key === 'Home') next = moveTo(l, OMEGA_RANGE.low);
		else if (e.key === 'End') next = moveTo(l, OMEGA_RANGE.high);
		if (!next) return;
		e.preventDefault();
		const changed = next;
		setLines(lines.map((o, j) => (j === i ? changed : o)));
	}

	/** On a boundary of the weights the arrow keys move a hundredth of A, or a tenth with Shift. */
	function barKey(k: number, e: KeyboardEvent) {
		const at = boundary(lines, k);
		const by = e.shiftKey ? SHARE_STEP.big : SHARE_STEP.small;
		const to: Record<string, number> = {
			ArrowLeft: at - by,
			ArrowDown: at - by,
			ArrowRight: at + by,
			ArrowUp: at + by,
			Home: 0,
			End: 1
		};
		if (!(e.key in to)) return;
		e.preventDefault();
		setLines(moveBoundary(lines, k, Number(to[e.key].toFixed(6))));
	}

	// --- the numbers ----------------------------------------------------------------------------------------------
	const total = $derived(TOTAL[body]);
	const ruled = $derived(sumRule(ms));
	const shown = $derived(shareShown(ms));
	const compliance = $derived(staticSum(ms));
	const far = $derived(farAnswer(ms));
	const farOff = $derived(100 * (far.re / total - 1));

	/** Three figures, trailing zeros kept: "0.120", "0.0329". */
	const n3 = (x: number) => (x >= 0.01 && x < 1000 ? x.toPrecision(3) : texNumber(x, 3));
	const pct = (x: number) => (x >= 0.9995 ? '100' : (100 * x).toFixed(1));
	const qText = (Q: number) => String(Number(Q.toPrecision(3)));
	const KGM2 = '\\,\\mathrm{kg\\,m^2}';
	const RHO = '\\htmlClass{q-matter}{\\rho}';
	const M_T = '\\htmlClass{q-matter}{M}';
	const R_T = '\\htmlClass{q-matter}{R}';
	const IMCHI = '\\mathrm{Im}\\,\\chi_h';

	const bodyTex = $derived(
		`A = \\int${RHO}|\\nabla h|^2\\,\\mathrm{d}V = ${body === 'ball' ? '\\tfrac25' : '\\tfrac23'}${M_T}${R_T}^2 = ${n3(total)}${KGM2}`
	);
	const lineTex = (m: Mode, i: number) =>
		`\\omega_${i + 1} = ${m.omega.toFixed(2)}\\,\\omega_0,\\ Q_${i + 1} = ${qText(quality(m))},\\ c_${i + 1}^2 = ${n3(m.weight)}${KGM2}`;
	const areaTex = $derived(
		`\\tfrac2\\pi\\int_0^\\infty\\omega\\,${IMCHI}\\,\\mathrm{d}\\omega = ${n3(ruled)}${KGM2}`
	);
	const complianceTex = $derived(
		`\\chi_h(0) = \\tfrac2\\pi\\int_0^\\infty\\frac{${IMCHI}}{\\omega}\\,\\mathrm{d}\\omega = \\sum\\frac{c_n^2}{\\omega_n^2} = ${n3(compliance)}\\,\\mathrm{kg\\,m^2}/\\omega_0^2`
	);
	const farTex = $derived(
		`-\\omega^2\\,\\mathrm{Re}\\,\\chi_h(${FAR}\\,\\omega_0) = ${n3(far.re)}${KGM2}`
	);
	const farWords = $derived(
		Math.abs(farOff) < 0.005
			? 'equal to A to four figures'
			: `${Math.abs(farOff).toFixed(2)}% ${farOff > 0 ? 'above' : 'below'} A`
	);

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`The line of power omega Im chi against omega from 0 to 4 omega zero, for ${body === 'ball' ? 'the uniform ball' : 'the thin shell'}, with ${lines.length === 1 ? 'one line' : `${lines.length} lines`}: ` +
			ms
				.map(
					(m, i) =>
						`line ${i + 1} at ${m.omega.toFixed(2)} omega zero, Q ${qText(quality(m))}, weight ${m.weight.toPrecision(3)} kilogram square metres, ${lineHeight(m).toPrecision(3)} high`
				)
				.join('; ') +
			`. The shaded area times 2 over pi, counted to infinity, is ${ruled.toPrecision(3)}; ${pct(shown)} percent of it lies on the plot.`
	);
	const handleText = (m: Mode, i: number) =>
		`Line ${i + 1}: at ${m.omega.toFixed(2)} omega zero, Q = ${qText(quality(m))}, ${lineHeight(m).toPrecision(3)} kilogram square metres per omega zero high, weight ${m.weight.toPrecision(3)}`;
</script>

<div class="sum-rule">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => choose(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Move every line to twice its frequency. Does the total change? Does the static compliance?
			{:else}
				Make one line very broad. Where does its weight go?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if step === 1 && doubling}
				<strong>The total does not; the static compliance falls to a quarter.</strong> Each line
				keeps its weight <Tex math="c_n^2" />, and the sum rule counts each weight once, wherever
				its line lies, so the area times <Tex math="2/\pi" /> stays <Tex
					math={`${n3(doubling.total)}${KGM2}`}
				/>. The static compliance <Tex math="\sum c_n^2/\omega_n^2" /> counts each weight over the square
				of its frequency: here it went from <Tex math={n3(doubling.before)} /> to <Tex
					math={`${n3(doubling.after)}\\,\\mathrm{kg\\,m^2}/\\omega_0^2`}
				/>, a factor of {(doubling.after / doubling.before).toFixed(3)}. A stiffer body gives way
				less to a steady tide and answers a fast one just the same.
				<button type="button" class="next" onclick={() => choose(2)}>Next prediction</button>
			{:else if step === 2 && broadening}
				<strong>It spreads over frequency; the area is unchanged.</strong> At
				<Tex math={`Q = ${qText(broadening.Q)}`} /> the line is <Tex
					math={`\\Gamma = ${n3(broadening.Gamma)}\\,\\omega_0`}
				/> wide and <Tex math={`c^2/\\Gamma = ${n3(broadening.height)}`} /> high, against <Tex
					math={n3(broadening.openingHeight)}
				/> at <Tex math="Q = 10" />: lower by as much as it is wider. Its weight spreads both ways,
				down towards
				<Tex math="\omega = 0" /> and up into a tail that falls only as <Tex
					math="c^2\Gamma/\omega^2"
				/>, so that {pct(1 - broadening.shown)}% of its area now lies beyond <Tex
					math="4\omega_0"
				/>, off the plot. The area, counted to infinity, still gives <Tex
					math={`${n3(broadening.total)}${KGM2}`}
				/>. The static compliance does not change either: <Tex math="c_n^2/\omega_n^2" /> holds no <Tex
					math="\Gamma"
				/>.
			{:else if step === 1}
				{#if canDouble}
					The answer appears when every line stands at twice the frequency it had when this was
					asked, marked by the small triangles under the axis.
				{:else}
					A line lies above <Tex math="1.75\,\omega_0" /> and cannot be doubled within the range: press
					reset, and the answer appears when every line stands at twice its frequency.
				{/if}
			{:else}
				The answer appears when a line has <Tex math={`Q \\le ${BROAD_Q}`} />: drag its handle down,
				or press the down arrow on it.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="img"
			aria-label={description}
			class={{ dragging: dragging !== undefined }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect
						x={layout.L}
						y={layout.T}
						width={layout.R - layout.L}
						height={layout.B - layout.T}
					/>
				</clipPath>
			</defs>

			<!-- the weights -->
			<text class="title" x={layout.L} y={layout.barTitle - 4 * u}
				>The weights <tspan class="it">c</tspan><tspan class="sub" dy={2.5 * u}>n</tspan><tspan
					dy={-2.5 * u}>², adding up to&nbsp;</tspan
				><tspan class="it">A</tspan> = {total.toPrecision(3)} kg m²</text
			>
			{#each segments as s, i (s.id)}
				<rect
					class="segment c{i}"
					x={s.x0 + 0.5}
					y={layout.barY + 0.5}
					width={Math.max(0, s.x1 - s.x0 - 1)}
					height={BAR_H - 1}
					rx={4 * u}
				/>
				{#if s.x1 - s.x0 > 74 * u}
					<text class="small segment-words" x={(s.x0 + s.x1) / 2} y={layout.barY + BAR_H / 2}
						><tspan class="it">c</tspan><tspan class="sub" dy={2.5 * u}>{i + 1}</tspan><tspan
							dy={-2.5 * u}>² = {s.weight.toPrecision(3)}</tspan
						></text
					>
				{:else if s.x1 - s.x0 > 14 * u}
					<text class="small segment-words" x={(s.x0 + s.x1) / 2} y={layout.barY + BAR_H / 2}
						>{i + 1}</text
					>
				{/if}
			{/each}
			{#each segments.slice(0, -1) as s, k (s.id)}
				<g
					class="divider"
					transform="translate({f2(s.x1)} {layout.barY})"
					role="slider"
					tabindex="0"
					aria-label="The weight between line {k + 1} and line {k + 2}"
					aria-orientation="horizontal"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(100 * boundary(lines, k))}
					aria-valuetext="lines up to {k + 1} hold {Math.round(
						100 * boundary(lines, k)
					)}% of the weight"
					onpointerdown={(e) => grabBar(k, e)}
					onkeydown={(e) => barKey(k, e)}
				>
					<rect class="hit" x={-10 * u} y={-6 * u} width={20 * u} height={BAR_H + 12 * u} />
					<rect
						class="focus"
						x={-6 * u}
						y={-4 * u}
						width={12 * u}
						height={BAR_H + 8 * u}
						rx={4 * u}
					/>
					<rect
						class="grip"
						x={-2.5 * u}
						y={-3 * u}
						width={5 * u}
						height={BAR_H + 6 * u}
						rx={2.5 * u}
					/>
				</g>
			{/each}

			<!-- the line of power -->
			<text class="title" x={layout.L - (phone.current ? 30 : 36) * u} y={layout.T - 10 * u}
				><tspan class="it">ω</tspan> Im <tspan class="it">χ</tspan><tspan class="sub" dy={2.5 * u}
					>h</tspan
				><tspan dy={-2.5 * u}>, kg m² per&nbsp;</tspan><tspan class="it">ω</tspan><tspan
					class="sub"
					dy={2.5 * u}>0</tspan
				></text
			>
			<text class="title end" x={layout.R} y={layout.T - 10 * u}
				>area × 2/π, 0 to ∞: {ruled.toPrecision(3)} kg m²</text
			>
			<rect
				class="panel"
				x={layout.L}
				y={layout.T}
				width={layout.R - layout.L}
				height={layout.B - layout.T}
			/>
			{#each yTicks as v (v)}
				<line class={['grid', { axis: v === 0 }]} x1={layout.L} x2={layout.R} y1={Y(v)} y2={Y(v)} />
				{#if Y(v) >= layout.T - 0.5}
					<text class="small y-tick" x={layout.L - 5 * u} y={Y(v)}>{v}</text>
				{/if}
			{/each}
			{#each halfTicks as w (w)}
				<line class="grid faint" x1={X(w)} x2={X(w)} y1={layout.T} y2={layout.B} />
			{/each}
			{#each xTicks as w (w)}
				<line class={['grid', { axis: w === 1 }]} x1={X(w)} x2={X(w)} y1={layout.T} y2={layout.B} />
				<text class="small tick" x={X(w)} y={layout.B + 15 * u}
					>{#if w === 1}<tspan class="it">ω</tspan><tspan class="sub" dy={2.5 * u}>0</tspan
						>{:else if w === 0}0{:else}{w}<tspan class="it">ω</tspan><tspan class="sub" dy={2.5 * u}
							>0</tspan
						>{/if}</text
				>
			{/each}

			<g clip-path="url(#{uid}-plot)">
				<path class="area" d={fillPath} />
				{#if lines.length > 1}
					<path class="total" d={totalPath} />
				{/if}
				{#each linePaths as d, i (lines[i].id)}
					<path class="curve c{i}" {d} />
				{/each}
			</g>

			{#each targets as t (t.i)}
				<path
					class="target c{t.i}"
					d="M{f2(t.x)},{f2(layout.B + 1)}l{f2(-4 * u)},{f2(6 * u)}h{f2(8 * u)}Z"
				/>
			{/each}

			{#each handles as h, i (h.id)}
				{#if h.above}
					<text class="small peak-words c{i}" x={h.x + 9 * u} y={layout.T + 13 * u}
						>↑ {lineHeight(h.m).toPrecision(3)}</text
					>
				{/if}
				<text
					class="small handle-words c{i}"
					x={h.above ? h.x - 11 * u : h.x}
					y={h.above ? layout.T + 13 * u : h.shownY - 10 * u}>{i + 1}</text
				>
				<g
					class="handle c{i}"
					transform="translate({f2(h.x)} {f2(h.shownY)})"
					role="slider"
					tabindex="0"
					aria-label="Line {i +
						1}. The left and right arrows move its frequency; up and down make it narrower or broader."
					aria-valuemin={OMEGA_RANGE.low}
					aria-valuemax={OMEGA_RANGE.high}
					aria-valuenow={h.m.omega}
					aria-valuetext={handleText(h.m, i)}
					onpointerdown={(e) => grabLine(i, e)}
					onkeydown={(e) => lineKey(i, e)}
				>
					<circle class="hit" r={15 * u} />
					<circle class="focus" r={10 * u} />
					<circle class="dot" r={5.5 * u} />
				</g>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch area-key"></span>the whole line of power, its area shaded</li>
			<li><span class="swatch line-key"></span>each line, with its handle at its peak</li>
			{#if targets.length}
				<li><span class="tri"></span>twice the frequency each line had</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="row-controls">
			<Segmented
				label="The body: the uniform ball, or a thin shell of the same mass and radius"
				options={[
					{ value: 'ball', label: 'Uniform ball', icon: SphereIcon },
					{
						value: 'shell',
						label: phone.current ? 'Thin shell' : 'Shell, same mass and radius',
						icon: CircleIcon
					}
				]}
				bind:value={() => body, setBody}
			/>
			<div class="actions">
				<button type="button" class="action" onclick={add} disabled={lines.length >= MOST_LINES}>
					<HugeiconsIcon icon={PlusSignCircleIcon} size={16} strokeWidth={1.7} />
					Add a line
				</button>
				<button type="button" class="action" onclick={reset}>
					<HugeiconsIcon icon={Undo02Icon} size={16} strokeWidth={1.7} />
					Reset
				</button>
			</div>
		</div>
		<p class="hint">
			Drag a line’s handle across to move its frequency, keeping its width, and up or down to make
			it narrower or broader; drag a boundary in the bar of weights to move weight between lines.
			With the keyboard, reach each with Tab: on a handle the left and right arrows move it a
			hundredth of
			<Tex math="\omega_0" /> (a tenth with Shift) and up and down step <Tex math="Q" />; on a
			boundary the arrows move a hundredth of the weight. No line keeps less than {Math.round(
				100 * MIN_SHARE
			)}%.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The body</dt>
				<dd>
					<Tex math={bodyTex} trust /><span class="also"
						>for the tide <Tex math="h = xy" />, {body === 'ball'
							? 'the paper’s uniform steel ball'
							: 'a thin shell of the ball’s mass and radius'}, <Tex
							math={`${M_T} = ${MASS}\\,\\mathrm{kg}`}
							trust
						/>, <Tex math={`${R_T} = 10\\,\\mathrm{cm}`} trust />{#if body === 'shell'}: its mass
							lies farther out, so every weight is 5/3 of the ball’s{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The lines</dt>
				<dd class="lines">
					{#each ms as m, i (lines[i].id)}
						<span class="one-line"><span class="key c{i}"></span><Tex math={lineTex(m, i)} /></span>
					{/each}
				</dd>
			</div>
			<div class="row">
				<dt>The area, 0 to ∞</dt>
				<dd>
					<Tex math={areaTex} /><span class="also"
						>the shaded area times <Tex math="2/\pi" />, integrated over every frequency and not
						only the plot’s: the plot, which stops at <Tex math="4\omega_0" />, holds {pct(shown)}%
						of it, and the tail beyond the rest. It equals <Tex math="\sum c_n^2 = A" /> wherever the
						lines lie.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Static compliance</dt>
				<dd>
					<Tex math={complianceTex} /><span class="also"
						>the answer to a steady tide: each weight over the square of its line’s frequency, so it
						changes as the lines move, but not as they broaden.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>−ω²χ far above every line</dt>
				<dd>
					<Tex math={farTex} /><span class="also"
						>from the complex response at <Tex math={`\\omega = ${FAR}\\,\\omega_0`} />, ten plot
						widths beyond its edge and more than ten times the highest line’s frequency: {farWords}.
						So fast, every body answers as dust.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Each line is <Tex
				math="c_n^2\Gamma_n\omega^2/[(\omega_n^2 - \omega^2)^2 + \Gamma_n^2\omega^2]"
			/>, <Tex math="c_n^2/\Gamma_n" /> high at <Tex math="\omega_n" /> and
			<Tex math="\Gamma_n = \omega_n/Q_n" /> wide at half its height, so its area is
			<Tex math="(\pi/2)\,c_n^2" /> at every <Tex math="Q" />. The curves are exact. The area and
			the static compliance are integrals from 0 to <Tex math="\infty" />, found by quadrature;
			<Tex math="-\omega^2\chi_h" /> is its real part, read from the complex sum of the lines. The vertical
			axis rescales when you let go of a handle, and leaves room for the shell’s taller lines.
		</p>
	</div>
</div>

<style>
	.sum-rule {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* the three lines' colours */
	.c0 {
		--hue: var(--accent-2);
	}

	.c1 {
		--hue: var(--q-obs);
	}

	.c2 {
		--hue: var(--q-light);
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
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.dragging {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.75em;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.faint {
		stroke: color-mix(in srgb, var(--text) 4%, transparent);
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	/* the bar of weights */
	.segment {
		fill: color-mix(in srgb, var(--hue) 24%, transparent);
		stroke: var(--hue);
		stroke-width: calc(1px * var(--u, 1));
	}

	.segment-words {
		text-anchor: middle;
		dominant-baseline: central;
		fill: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.divider,
	.handle {
		cursor: grab;
		touch-action: none;
		outline: none;
	}

	.grip {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
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

	.divider:focus-visible .focus,
	.handle:focus-visible .focus {
		opacity: 1;
	}

	/* the curves */
	.area {
		fill: color-mix(in srgb, var(--accent) 14%, transparent);
		stroke: none;
	}

	.total {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve {
		fill: none;
		stroke: var(--hue);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.dot {
		fill: var(--hue);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.handle-words {
		text-anchor: middle;
		fill: var(--hue);
		font-weight: 600;
		pointer-events: none;
	}

	.peak-words {
		fill: var(--hue);
		font-variant-numeric: tabular-nums;
		pointer-events: none;
	}

	.target {
		fill: var(--hue);
		opacity: 0.85;
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
		border-top: 1.5px solid;
	}

	.area-key {
		height: 0.6rem;
		border-top-width: 1.5px;
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 14%, transparent);
	}

	.line-key {
		border-color: var(--accent-2);
	}

	.tri {
		width: 0;
		height: 0;
		border-left: 0.3rem solid transparent;
		border-right: 0.3rem solid transparent;
		border-bottom: 0.45rem solid var(--accent-2);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.row-controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.6rem;
		align-items: center;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
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
		cursor: default;
		color: var(--text-faint);
		border-color: var(--line);
	}

	.action :global(svg) {
		color: var(--accent);
	}

	.action:disabled :global(svg) {
		color: var(--text-faint);
	}

	@media (hover: hover) {
		.action:not(:disabled):hover {
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
		align-items: center;
		gap: 0.15rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.readouts dd.lines {
		gap: 0.2rem 1.1rem;
	}

	.one-line {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.key {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--hue);
	}

	/* words keep their own spacing: the tabular figures would widen a hyphen */
	.also {
		color: var(--text-dim);
		font-variant-numeric: normal;
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
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.row-controls {
			grid-template-columns: minmax(0, 1fr);
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
