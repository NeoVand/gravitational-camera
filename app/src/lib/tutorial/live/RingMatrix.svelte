<script lang="ts">
	/**
	 * A ring of twelve free balls under a symmetric table T = [[a, b], [b, d]], the tidal table restricted to a plane,
	 * whose three entries the reader sets with sliders. Each ball at ξ on the unit circle is drawn moved to ξ − s T ξ,
	 * with an arrow −T ξ (./ring-matrix.ts): orange where it points outward, a stretch, blue where it points inward, a
	 * squeeze. The principal axes are drawn through the centre, each with its principal value.
	 */
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Undo02Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		LEAST,
		MOST,
		OPENING,
		SCALE,
		STEP,
		degrees,
		displaced,
		kind,
		move,
		principal,
		ring,
		round,
		trace,
		type Kind,
		type Table
	} from './ring-matrix';

	const uid = $props.id();

	/** The ring's radius as drawn, in drawing units. */
	const R = 50;
	/** An arrow is this many times as long as the move drawn: one scale for every arrow. */
	const ARROW = 1.6;

	// --- the table: the sliders' values, and the table drawn, which eases back when the reader resets it -----------
	let table = $state<Table>({ ...OPENING });
	const drawn = new Tween<Table>({ ...OPENING }, { duration: 0 });

	/** A value on the slider's grid and within its ends. */
	const snap = (v: number) =>
		Number((Math.round(Math.max(LEAST, Math.min(MOST, v)) / STEP) * STEP).toFixed(2));

	function set(entry: keyof Table, v: number) {
		table[entry] = snap(v);
		drawn.set({ ...table }, { duration: 0 });
	}

	function reset() {
		table = { ...OPENING };
		drawn.set(
			{ ...OPENING },
			{ duration: prefersReducedMotion.current ? 0 : 520, easing: cubicOut }
		);
	}

	const T = $derived(drawn.current);
	const axes = $derived(principal(T));
	const equal = $derived(round(T));

	// --- the picture's bounds: wider than tall on a wide screen, with each axis's value beyond its end. On a phone
	// the picture is square and close round the ring, so that the ring is drawn large: no ball or arrow reaches
	// farther than 1.45 R across or up (73 units; 1.8 R only along a diagonal), and the axes are named inside the
	// corners of the drawing, their values left to the readout
	const phone = new MediaQuery('max-width: 560px', false);
	const half = $derived(phone.current ? { x: 82, y: 82 } : { x: 172, y: 108 });
	/** On a wide screen the principal axes reach this far from the centre, beyond the longest arrow. */
	const AXIS = 1.9 * R;
	const viewBox = $derived(`${-half.x} ${-half.y} ${2 * half.x} ${2 * half.y}`);

	/** Drawing units in one CSS pixel, so that marks keep their size on the screen. */
	let u = $state(1);
	const BALL = $derived(4.4 * u);

	const f2 = (n: number) => n.toFixed(2);
	const rest = ring(12);

	/** Each ball where the drawing moves it, and an arrow from it along −T ξ. */
	const balls = $derived(
		rest.map((p) => {
			const q = displaced(T, p.x, p.y);
			const m = move(T, p.x, p.y);
			const at = { x: R * q.x, y: -R * q.y };
			const k = ARROW * SCALE * R;
			return { at, kind: kind(T, p.x, p.y), arrow: arrow(at, { x: k * m.x, y: -k * m.y }) };
		})
	);

	/** The shaft and head of an arrow from the edge of a ball at `from`, of length and direction `v`: the head at most two fifths of it. */
	function arrow(from: { x: number; y: number }, v: { x: number; y: number }) {
		const len = Math.hypot(v.x, v.y);
		if (len < 1.5 * u) return undefined;
		const head = Math.min(5.4 * u, 0.4 * len);
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * (BALL + 1.2 * u), y: from.y + uy * (BALL + 1.2 * u) };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	/** The ring as the drawing moves it: an ellipse. */
	const outline = $derived(
		ring(96)
			.map((p) => displaced(T, p.x, p.y))
			.map((p, i) => `${i ? 'L' : 'M'}${f2(R * p.x)},${f2(-R * p.y)}`)
			.join('') + 'Z'
	);

	const kindOf = (v: number): Kind => (v < -1e-9 ? 'stretch' : v > 1e-9 ? 'squeeze' : 'still');

	/**
	 * The principal axes through the centre, each labelled at its right-hand (or upper) end: with its value beyond
	 * the end on a wide screen; on a phone with its name alone, inside the edge of the drawing, the line stopping
	 * short of it.
	 */
	const axisLines = $derived(
		axes.map((a, i) => {
			const name = i === 0 ? '₁' : '₂';
			if (phone.current) {
				const pad = 11 * u;
				const reach = (half.x - pad) / Math.max(Math.abs(a.axis.x), Math.abs(a.axis.y));
				const end = reach - pad;
				return {
					x: end * a.axis.x,
					y: -end * a.axis.y,
					kind: kindOf(a.value),
					label: {
						x: reach * a.axis.x,
						y: -reach * a.axis.y,
						anchor: 'middle',
						dy: '0.35em',
						name,
						value: undefined
					}
				};
			}
			const x = AXIS * a.axis.x;
			const y = -AXIS * a.axis.y;
			const gap = 4 * u;
			// to the right of the end when the axis leans sideways; above or below it when it stands up
			const side = a.axis.x > 0.38;
			const lx = x + gap * a.axis.x + (side ? 2.5 * u : 0);
			const ly = y - gap * a.axis.y;
			return {
				x,
				y,
				kind: kindOf(a.value),
				label: {
					x: lx,
					y: ly,
					anchor: side ? 'start' : 'middle',
					dy: side ? '0.35em' : a.axis.y > 0 ? '0' : '0.8em',
					name,
					value: signed(a.value)
				}
			};
		})
	);

	// --- the numbers -----------------------------------------------------------------------------------------------
	/** A value to two decimals, with a true minus sign, never −0.00. */
	function signed(v: number) {
		const s = f2(v);
		return Number(s) === 0 ? '0.00' : s.replace('-', '−');
	}
	const tex = (v: number) => signed(v).replace('−', '-');

	const matrixTex = $derived(
		`T = \\begin{pmatrix} ${tex(T.a)} & ${tex(T.b)} \\\\ ${tex(T.b)} & ${tex(T.d)} \\end{pmatrix}`
	);
	/** The angle of the first axis, degrees, to one decimal. */
	const angle = $derived(Number(degrees(axes[0].axis).toFixed(1)));
	const angleTex = $derived(`\\varphi_1 = ${angle === 0 ? '0' : String(angle)}^\\circ`);
	const traceTex = $derived(
		`\\operatorname{tr} T = a + d = \\lambda_1 + \\lambda_2 = ${tex(trace(T))}`
	);

	/** The table the figure opens on, as the hint names it. */
	const openingTex = `\\operatorname{diag}(${OPENING.a}, ${OPENING.d})`;

	/** The names of the two principal values: a stretch or a squeeze, and which is stronger where both are one kind. */
	const names = $derived.by(() => {
		const [p, q] = axes;
		const kind = (v: number) => (v < -1e-9 ? 'Stretch' : v > 1e-9 ? 'Squeeze' : 'Neither');
		if (kind(p.value) !== kind(q.value) || kind(p.value) === 'Neither' || equal)
			return [kind(p.value), kind(q.value)];
		const stronger = Math.abs(p.value) >= Math.abs(q.value);
		return [
			`${kind(p.value)}, ${stronger ? 'stronger' : 'weaker'}`,
			`${kind(q.value)}, ${stronger ? 'weaker' : 'stronger'}`
		];
	});

	const description = $derived(
		`A ring of twelve free balls under the table a = ${signed(T.a)}, b = ${signed(T.b)}, d = ${signed(T.d)}. ` +
			`Principal values ${signed(axes[0].value)} and ${signed(axes[1].value)}` +
			(equal
				? ', equal, so every direction is principal.'
				: `, the first axis at ${angle} degrees.`)
	);

	const entries: { key: keyof Table; label: string }[] = [
		{ key: 'a', label: 'a, along x' },
		{ key: 'b', label: 'b, the shear' },
		{ key: 'd', label: 'd, along y' }
	];
</script>

<div class="ring-matrix">
	<div class="stage">
		<svg {viewBox} role="img" aria-label={description} {@attach fitText((value) => (u = value))}>
			<defs>
				<radialGradient id="{uid}-ball" cx="0.36" cy="0.32" r="0.75">
					<stop offset="0" class="ball-light" />
					<stop offset="1" class="ball-dark" />
				</radialGradient>
			</defs>

			<!-- the principal axes -->
			{#each axisLines as a, i (i)}
				<line class={['axis', a.kind, { loose: equal }]} x1={-a.x} y1={-a.y} x2={a.x} y2={a.y} />
			{/each}

			<!-- the ring at rest, the ring as the table moves it, and the balls with their arrows -->
			<circle class="rest" r={R} />
			<path class="bent" d={outline} />
			{#each balls as b, i (i)}
				{#if b.arrow}
					<path class={['shaft', b.kind]} d={b.arrow.shaft} />
					<path class={['head', b.kind]} d={b.arrow.head} />
				{/if}
				<circle class="ball" cx={b.at.x} cy={b.at.y} r={BALL} fill="url(#{uid}-ball)" />
			{/each}
			<circle class="centre" r={1.6 * u} />

			<!-- the axes' names, over everything, each on a halo of the ground -->
			{#each axisLines as a, i (i)}
				<text
					class={['value', a.kind]}
					x={a.label.x}
					y={a.label.y}
					dy={a.label.dy}
					text-anchor={a.label.anchor}
					><tspan class="lambda">λ</tspan><tspan class="sub">{a.label.name}</tspan
					>{#if a.label.value}&nbsp;= {a.label.value}{/if}</text
				>
			{/each}
		</svg>
	</div>

	<div class="bar">
		<div class="sliders">
			{#each entries as e (e.key)}
				<Slider
					id="{uid}-{e.key}"
					label={e.label}
					min={LEAST}
					max={MOST}
					step={STEP}
					bind:value={() => table[e.key], (v) => set(e.key, v)}
					readout={signed(table[e.key])}
					ends={['−2', '2']}
				/>
			{/each}
		</div>
		<div class="actions">
			<button type="button" class="reset" onclick={reset}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Reset
			</button>
			<p class="hint">
				Drag a slider, or reach it with Tab and use the arrow keys. Reset returns to
				<Tex math={openingTex} />.
			</p>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row table">
				<dt>The table</dt>
				<dd><Tex math={matrixTex} /></dd>
			</div>
			{#each axes as a, i (i)}
				<div class="row">
					<dt>
						<span class={['swatch', kindOf(a.value)]}></span>{names[i]}
					</dt>
					<dd><Tex math={`\\lambda_${i + 1} = ${tex(a.value)}`} /></dd>
				</div>
			{/each}
			<div class="row">
				<dt>First axis</dt>
				<dd>
					{#if equal}
						any direction: the two values are equal
					{:else}
						<Tex math={angleTex} /><span class="also">from the x axis</span>
					{/if}
				</dd>
			</div>
			<div class="row">
				<dt>Trace</dt>
				<dd><Tex math={traceTex} /></dd>
			</div>
		</dl>
		<p class="note">
			Each ball starts on the dashed circle at <Tex math="\xi = (\cos\theta, \sin\theta)" /> and is drawn
			at <Tex math="\xi - s\,T\xi" />, with <Tex math={`s = ${SCALE}`} />, so that the largest table
			the sliders allow moves it by three tenths of the radius. Each arrow is
			<Tex math="-T\xi" />, all on one scale.
			<span class="stretch">Orange</span>: the ball moves outward,
			<Tex math="\xi \cdot (-T\xi) > 0" />, a stretch.
			<span class="squeeze">Blue</span>: it moves inward, a squeeze.
		</p>
		<p class="note">
			The lines through the centre are the principal axes. Along each, a ball moves straight out or
			straight in, by <Tex math="-\lambda" /> times its distance; between them it also slides along the
			ring. The trace, the sum of the two values, does not depend on which way the axes point.
		</p>
	</div>
</div>

<style>
	.ring-matrix {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		background: radial-gradient(circle at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 78%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.6;
	}

	.value {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		/* a halo of the ground, so that a name reads over a line, a ball or an arrow */
		stroke: color-mix(in srgb, var(--bg-raised) 50%, var(--bg-sunken));
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
		paint-order: stroke;
	}

	.lambda {
		font: italic 500 calc(13.5px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sub {
		font-size: calc(10.5px * var(--u, 1));
	}

	/* when the two values are equal every direction is principal: the axes drawn are only x and y */
	.axis.loose {
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft.still {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.head.still {
		fill: color-mix(in srgb, var(--text) 50%, transparent);
	}

	.axis.stretch,
	.shaft.stretch {
		stroke: var(--accent);
	}

	.axis.squeeze,
	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.head.stretch,
	.value.stretch {
		fill: var(--accent);
	}

	.head.squeeze,
	.value.squeeze {
		fill: var(--accent-2);
	}

	.ball {
		stroke: color-mix(in srgb, var(--bg-sunken) 80%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
	}

	.ball-light {
		stop-color: color-mix(in srgb, var(--text) 92%, var(--bg));
	}

	.ball-dark {
		stop-color: color-mix(in srgb, var(--text) 55%, var(--bg));
	}

	.centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem 1.4rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
	}

	.reset {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.78rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.reset :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.reset:hover {
			border-color: var(--accent);
		}
	}

	.reset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
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
		grid-template-columns: 9.5rem 1fr;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}

	.row.table {
		align-items: center;
		margin-bottom: 0.15rem;
	}

	.readouts dt {
		font-weight: 500;
		color: var(--text-dim);
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.readouts dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.also {
		color: var(--text-dim);
	}

	.swatch {
		flex: none;
		width: 0.85rem;
		height: 2px;
		border-radius: 1px;
		background: var(--text-faint);
	}

	.swatch.stretch {
		background: var(--accent);
	}

	.swatch.squeeze {
		background: var(--accent-2);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.note .stretch {
		color: var(--accent);
	}

	.note .squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}

		.lambda {
			font-size: calc(16px * var(--u, 1));
		}

		.sub {
			font-size: calc(12px * var(--u, 1));
		}
	}
</style>
