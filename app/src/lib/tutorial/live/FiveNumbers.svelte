<script lang="ts">
	/**
	 * Five sliders, one for each coefficient c_A of a symmetric trace-free table 𝓔 = c_A b^A in the basis of chapter
	 * 1.5, and three rings of twelve free balls, in the xy, yz and zx planes, under that table. Each ball at ξ is drawn
	 * at (1 − s𝓔)ξ kept to its plane, with an arrow −𝓔ξ (./five-numbers.ts): orange where it points outward, a
	 * stretch, blue where it points inward, a squeeze. The readouts give the table, its three eigenvalues, which
	 * always add to zero, its length and whether it is the tide of a single mass.
	 */
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Undo02Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		LEAST,
		MOST,
		PLANES,
		PRESETS,
		SCALE,
		STEP,
		displaced,
		eigen,
		kind,
		push,
		random,
		ratio,
		ring,
		ringKind,
		singleMass,
		size,
		snap,
		table,
		type Coefficients,
		type Kind,
		type Plane
	} from './five-numbers';

	const uid = $props.id();

	/** The ring's radius as drawn, in drawing units, and half the side of each square drawing. */
	const R = 50;
	const HALF = 100;
	/** An arrow is this many times as long as the move drawn: one scale for every arrow. */
	const ARROW = 1.8;

	// --- the five numbers: the sliders' values, and the numbers drawn, which ease to a preset -------------------
	let c = $state<Coefficients>([...PRESETS.person]);
	const drawn = new Tween<Coefficients>([...PRESETS.person], { duration: 0 });

	/** Which sliders the reader has moved, and how often they have asked for a random table. */
	let touched = $state<boolean[]>([false, false, false, false, false]);
	let randoms = $state(0);
	let asked = $state(false);
	/** The answer to the chapter's prediction shows once the reader has tried three sliders, or asks for it. */
	const tried = $derived(asked || randoms >= 2 || touched.filter(Boolean).length >= 3);

	function set(A: number, v: number) {
		c[A] = snap(v);
		touched[A] = true;
		drawn.set([...c], { duration: 0 });
	}

	function choose(next: Coefficients) {
		c = [...next];
		drawn.set([...next], {
			duration: prefersReducedMotion.current ? 0 : 520,
			easing: cubicOut
		});
	}

	function chooseRandom() {
		randoms += 1;
		choose(random(Math.random));
	}

	const same = (p: Readonly<Coefficients>, q: Readonly<Coefficients>) =>
		p.every((v, k) => Math.abs(v - q[k]) < 1e-9);

	const T = $derived(table(drawn.current));
	const values = $derived(eigen(T));
	const mass = $derived(singleMass(T));
	const length = $derived(size(drawn.current));

	/** Drawing units in one CSS pixel, so that marks keep their size on the screen. */
	let u = $state(1);
	const BALL = $derived(4.4 * u);

	const f2 = (n: number) => n.toFixed(2);
	const rest = ring(12);
	const names = ['x', 'y', 'z'];

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

	/** One ring: its balls with their arrows, its outline as moved, whether every ball moves one way, and words for it. */
	function draw(plane: Plane) {
		const balls = rest.map((p) => {
			const q = displaced(T, plane, p.x, p.y);
			const m = push(T, plane, p.x, p.y);
			const at = { x: R * q.x, y: -R * q.y };
			const k = ARROW * SCALE * R;
			return {
				at,
				kind: kind(T, plane, p.x, p.y),
				arrow: arrow(at, { x: k * m.x, y: -k * m.y })
			};
		});
		const outline =
			ring(96)
				.map((p) => displaced(T, plane, p.x, p.y))
				.map((p, i) => `${i ? 'L' : 'M'}${f2(R * p.x)},${f2(-R * p.y)}`)
				.join('') + 'Z';
		const across = names[plane.across];
		const up = names[plane.up];
		const whole = ringKind(T, plane);
		const description =
			`The ring in the ${across}${up} plane, ${across} across and ${up} up` +
			(whole === 'shrinks'
				? ': every ball moves inward.'
				: whole === 'grows'
					? ': every ball moves outward.'
					: `: ${balls.filter((b) => b.kind === 'stretch').length} of twelve balls move outward, ` +
						`${balls.filter((b) => b.kind === 'squeeze').length} inward.`);
		return { plane, balls, outline, across, up, whole, description };
	}

	const rings = $derived(PLANES.map(draw));

	// --- the numbers -----------------------------------------------------------------------------------------------
	/** A value to two decimals, with a true minus sign, never −0.00. */
	function signed(v: number) {
		const s = f2(v);
		return Number(s) === 0 ? '0.00' : s.replace('-', '−');
	}
	const tex = (v: number) => signed(v).replace('−', '-');

	const matrixTex = $derived(
		`\\mathcal{E} = \\begin{pmatrix} ${T.map((row) => row.map(tex).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`
	);

	const kindOf = (v: number): Kind => (v < -5e-3 ? 'stretch' : v > 5e-3 ? 'squeeze' : 'still');
	const word = { stretch: 'Stretch', squeeze: 'Squeeze', still: 'Neither' } as const;

	const sumTex = $derived(
		`\\lambda_1 + \\lambda_2 + \\lambda_3 = \\operatorname{tr}\\mathcal{E} = ${tex(values.reduce((s, e) => s + e.value, 0))}`
	);
	const sizeTex = $derived(
		`|\\mathcal{E}| = \\sqrt{c_Ac_A} = \\sqrt{\\mathcal{E}_{ij}\\mathcal{E}_{ij}} = ${tex(length)}`
	);

	/** The eigenvalues as a ratio, the largest in size ±2, to two decimals; an exact −2 : 1 : 1 for a single mass. */
	const ratioTex = $derived.by(() => {
		if (mass) return '-2 : 1 : 1';
		const r = ratio([values[0].value, values[1].value, values[2].value]);
		return r ? r.map((v) => tex(v).replace(/\.00$/, '')).join(' : ') : undefined;
	});
	const axisTex = $derived(mass ? `\\hat n = (${mass.axis.map(tex).join(',\\ ')})` : '');
	const strengthTex = $derived(mass ? `GM/r^3 = ${tex(mass.strength)}` : '');

	const zeroSumTex = String.raw`\lambda_1 + \lambda_2 + \lambda_3 = \mathcal{E}_{xx} + \mathcal{E}_{yy} + \mathcal{E}_{zz} = 0`;
	const drawnTex = String.raw`(1 - s\,\mathcal{E})\,\xi`;
	const pushTex = String.raw`-\mathcal{E}\xi`;

	const presets: { id: string; label: string; c: Coefficients }[] = [
		{ id: 'person', label: 'Person along x', c: PRESETS.person },
		{ id: 'plus', label: 'Plus wave along z', c: PRESETS.plus },
		{ id: 'cross', label: 'Cross wave along z', c: PRESETS.cross }
	];

	const sliders = [
		{ label: 'c₁, the xy shear' },
		{ label: 'c₂, the yz shear' },
		{ label: 'c₃, the zx shear' },
		{ label: 'c₄, x against y' },
		{ label: 'c₅, z against x and y' }
	];
</script>

<div class="five-numbers">
	<div class="stage">
		{#each rings as r (r.plane.id)}
			<figure class="panel">
				<svg
					viewBox="{-HALF} {-HALF} {2 * HALF} {2 * HALF}"
					role="img"
					aria-label={r.description}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<radialGradient id="{uid}-ball-{r.plane.id}" cx="0.36" cy="0.32" r="0.75">
							<stop offset="0" class="ball-light" />
							<stop offset="1" class="ball-dark" />
						</radialGradient>
					</defs>

					<!-- the plane's two axes, named at their ends -->
					<line class="axis" x1={-HALF + 8 * u} y1="0" x2={HALF - 16 * u} y2="0" />
					<line class="axis" x1="0" y1={HALF - 8 * u} x2="0" y2={-HALF + 16 * u} />
					<text class="axis-name" x={HALF - 7 * u} y="0" dy="0.32em" text-anchor="middle"
						>{r.across}</text
					>
					<text class="axis-name" x="0" y={-HALF + 7 * u} dy="0.32em" text-anchor="middle"
						>{r.up}</text
					>

					<!-- the ring at rest, the ring as the table moves it, and the balls with their arrows -->
					<circle class="rest" r={R} />
					<path class="bent" d={r.outline} />
					{#each r.balls as b, i (i)}
						{#if b.arrow}
							<path class={['shaft', b.kind]} d={b.arrow.shaft} />
							<path class={['head', b.kind]} d={b.arrow.head} />
						{/if}
						<circle
							class="ball"
							cx={b.at.x}
							cy={b.at.y}
							r={BALL}
							fill="url(#{uid}-ball-{r.plane.id})"
						/>
					{/each}
					<circle class="centre" r={1.6 * u} />
				</svg>
				<figcaption>
					<span class="plane"><i>{r.across}{r.up}</i> plane</span>
					{#if r.whole === 'shrinks'}
						<span class="tag squeeze">every ball moves in</span>
					{:else if r.whole === 'grows'}
						<span class="tag stretch">every ball moves out</span>
					{/if}
				</figcaption>
			</figure>
		{/each}
	</div>

	<div class="bar">
		<div class="sliders">
			{#each sliders as s, A (A)}
				<Slider
					id="{uid}-c{A + 1}"
					label={s.label}
					min={LEAST}
					max={MOST}
					step={STEP}
					bind:value={() => c[A], (v) => set(A, v)}
					readout={signed(c[A])}
					ends={['−3', '3']}
				/>
			{/each}
		</div>
		<div class="actions">
			<div class="presets" role="group" aria-label="Tables to load">
				{#each presets as p (p.id)}
					<button type="button" aria-pressed={same(c, p.c)} onclick={() => choose(p.c)}
						>{p.label}</button
					>
				{/each}
				<button type="button" onclick={chooseRandom}>Random</button>
			</div>
			<button type="button" class="reset" onclick={() => choose(PRESETS.zero)}>
				<HugeiconsIcon icon={Undo02Icon} size={15} strokeWidth={1.7} />
				Reset
			</button>
			<p class="hint">
				Drag a slider, or reach it with Tab and use the arrow keys. Each coefficient is in units of
				<Tex math="GM/r^3" />. Reset sets all five to zero.
			</p>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row table">
				<dt>The table</dt>
				<dd><Tex math={matrixTex} /></dd>
			</div>
			{#each values as e, i (i)}
				<div class="row">
					<dt>
						<span class={['swatch', kindOf(e.value)]}></span>{word[kindOf(e.value)]}
					</dt>
					<dd><Tex math={`\\lambda_${i + 1} = ${tex(e.value)}`} /></dd>
				</div>
			{/each}
			<div class="row">
				<dt>Their sum</dt>
				<dd><Tex math={sumTex} /></dd>
			</div>
			<div class="row">
				<dt>Length</dt>
				<dd><Tex math={sizeTex} /></dd>
			</div>
			<div class="row">
				<dt>One mass?</dt>
				<dd>
					{#if mass}
						<span class="yes">Yes:</span>
						<span><Tex math={`\\lambda_1 : \\lambda_2 : \\lambda_3 = ${ratioTex}`} /></span>
						<span class="also"
							>a single mass on the axis <Tex math={axisTex} />, with <Tex
								math={strengthTex}
							/></span
						>
					{:else if ratioTex}
						<span>No:</span>
						<span><Tex math={`\\lambda_1 : \\lambda_2 : \\lambda_3 = ${ratioTex}`} /></span>
						<span class="also">not <Tex math="-2 : 1 : 1" /></span>
					{:else}
						no tide at all
					{/if}
				</dd>
			</div>
		</dl>

		<div class="answer" aria-live="polite">
			{#if tried}
				<p>
					<strong>No table makes all three rings shrink.</strong> The three eigenvalues always add
					to zero, <Tex math={zeroSumTex} />, because every table of the five is trace-free. Unless
					all three are zero, one at least is negative, a <span class="stretch">stretch</span>, and
					some ball moves outward. Not even two rings shrink together: a ring shrinks only if both
					of its diagonal entries are positive, and any two rings together have all three.
				</p>
			{:else}
				<p>
					Can you make all three rings shrink at once? Try a few sliders.
					<button type="button" class="link" onclick={() => (asked = true)}>Show the answer</button>
				</p>
			{/if}
		</div>

		<p class="note">
			Each ball starts on the dashed circle at <Tex math="\xi" /> and is drawn at
			<Tex math={drawnTex} />, kept to its plane, with
			<Tex math={`s = ${SCALE.toFixed(4)}`} />, so that the largest table the sliders allow moves it
			by three tenths of the radius. Each arrow is the part of <Tex math={pushTex} /> in the ring's plane,
			all on one scale. <span class="stretch">Orange</span>: the ball moves outward, a stretch.
			<span class="squeeze">Blue</span>: it moves inward, a squeeze. A negative eigenvalue is a
			stretch along its axis, a positive one a squeeze.
		</p>
	</div>
</div>

<style>
	.five-numbers {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the three rings ------------------------------------------------------------------ */

	.stage {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		background: radial-gradient(ellipse at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.panel {
		margin: 0;
		padding: 0.2rem 0 0.55rem;
		min-width: 0;
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		gap: 0.15rem 0.6rem;
		min-height: 1.2rem;
		font: 500 0.76rem/1.3 var(--font-sans);
		color: var(--text-dim);
	}

	.plane i {
		font-family: var(--font-serif);
		font-size: 0.88rem;
	}

	.tag {
		font-weight: 400;
	}

	.tag.stretch {
		color: var(--accent);
	}

	.tag.squeeze {
		color: var(--accent-2);
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.6;
	}

	.axis-name {
		fill: var(--text-dim);
		font: italic 500 calc(13.5px * var(--u, 1)) / 1 var(--font-serif);
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

	.shaft.stretch {
		stroke: var(--accent);
	}

	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.head.stretch {
		fill: var(--accent);
	}

	.head.squeeze {
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
		gap: 0.75rem;
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
		gap: 0.55rem 0.7rem;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.presets button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: calc(var(--control-height, 2.55rem) - 8px);
		padding: 0.3rem 0.65rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 400 0.78rem/1.2 var(--font-sans);
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	@media (hover: hover) {
		.presets button:hover {
			color: var(--text);
		}

		.reset:hover {
			border-color: var(--accent);
		}
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
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

	.presets button:focus-visible,
	.reset:focus-visible,
	.link:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.hint {
		flex: 1 1 100%;
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
		gap: 0.1rem 0.5rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.also {
		color: var(--text-dim);
	}

	.yes {
		color: var(--accent);
		font-weight: 500;
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

	.answer {
		margin: 0.75rem 0 0;
		padding: 0.55rem 0.7rem;
		border-radius: 8px;
		background: color-mix(in srgb, var(--text) 5%, transparent);
		border: 1px solid var(--line);
	}

	.answer p {
		margin: 0;
		color: var(--text-dim);
		font-size: 0.78rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.answer strong {
		color: var(--text);
		font-weight: 500;
	}

	.link {
		padding: 0;
		border: 0;
		background: none;
		color: var(--accent);
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.stretch {
		color: var(--accent);
	}

	.squeeze {
		color: var(--accent-2);
	}

	@media (max-width: 560px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel {
			padding: 0.4rem 0 0.6rem;
		}

		.panel svg {
			max-width: 13rem;
			margin: 0 auto;
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: 6.6rem 1fr;
			gap: 0.1rem 0.6rem;
		}
	}
</style>
