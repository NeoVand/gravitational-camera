<script lang="ts">
	/**
	 * Chapter 1.3's shell theorem. A round body of fixed mass and radius whose density goes as a power p of the
	 * distance from the centre, from mass gathered at the centre to a thin shell, set by the reader. The plot is the
	 * pull g = G M_enc(r)/r² out to three radii: inside it follows the body, outside it is GM/r² for every body and does
	 * not move. The readings set the pull at 2R, which stays a quarter, against the pull at R/2 and the moment of
	 * inertia, which change. A small cut through the body shows its density as shading. The numbers come from
	 * ./shell-theorem.ts. Two predictions at the top are answered once the reader has done what they ask.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { RadialIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { BALL, LEAST, MOST, inertia, pull, shading, type Body } from './shell-theorem';

	// --- the body: a power of the density, or a thin shell --------------------------------------------------------
	let p = $state(BALL);
	let thin = $state(false);
	const body: Body = $derived(thin ? 'shell' : p);

	// --- the predictions ---------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The least power the reader has set. */
	let lowest = $state(BALL);
	let sawShell = $state(false);
	const revealed = $derived(step === 1 ? lowest <= -2 + 1e-9 : sawShell);

	function setPower(v: number) {
		p = Math.round(Math.max(LEAST, Math.min(MOST, v)) * 10) / 10;
		thin = false;
		lowest = Math.min(lowest, p);
	}

	function chooseBall() {
		setPower(BALL);
	}

	function chooseShell() {
		thin = true;
		sawShell = true;
	}

	// --- the plot's bounds: on a phone it is narrower and a little taller for its width ---------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const size = $derived(phone.current ? { w: 332, h: 236 } : { w: 672, h: 280 });
	const a = $derived({ L: 34, R: size.w - 18, T: 10, B: size.h - 26 });

	/** The reach of the plot: three radii, and up to 1.6 GM/R². */
	const REACH = 3;
	const TOP = 1.6;
	const x = (r: number) => a.L + ((a.R - a.L) * r) / REACH;
	const y = (g: number) => a.B - ((a.B - a.T) * g) / TOP;

	const f1 = (n: number) => n.toFixed(1);
	const line = (pts: { r: number; g: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f1(x(q.r))},${f1(y(Math.min(q.g, 4 * TOP)))}`).join('');

	/** The r of the curve inside: dense near the centre, where a pull without bound climbs fastest. */
	const insideR = Array.from({ length: 241 }, (_, i) => (i / 240) ** 2);
	const outsideR = Array.from({ length: 121 }, (_, i) => 1 + ((REACH - 1) * i) / 120);

	const inside = $derived(
		body === 'shell'
			? line([
					{ r: 0, g: 0 },
					{ r: 1, g: 0 },
					{ r: 1, g: 1 }
				])
			: line(insideR.map((r) => ({ r, g: pull(r, body) })))
	);
	/** The pull outside: GM/r², whatever the body. */
	const outside = $derived(line(outsideR.map((r) => ({ r, g: 1 / (r * r) }))));
	/** The uniform ball, for reference: GM r/R³ inside. */
	const ball = $derived(line([0, 1].map((r) => ({ r, g: r }))));
	/** A point of the same mass at the centre: GM/r² continued inward, as far as the plot reaches. */
	const pointR = Array.from({ length: 41 }, (_, i) => {
		const r0 = 1 / Math.sqrt(TOP);
		return r0 + ((1 - r0) * i) / 40;
	});
	const point = $derived(line(pointR.map((r) => ({ r, g: 1 / (r * r) }))));

	const gHalf = $derived(pull(0.5, body));
	const I = $derived(inertia(body));

	/** Where the words on the fixed curve sit, a little nearer the surface on a phone. */
	const sameAt = $derived(phone.current ? 1.45 : 1.75);

	const ticksY = [0, 0.5, 1, 1.5];
	const ticksR = [
		{ r: 0, label: '0' },
		{ r: 0.5, label: '½R' },
		{ r: 1, label: 'R' },
		{ r: 2, label: '2R' },
		{ r: 3, label: '3R' }
	];

	// --- the cut through the body ------------------------------------------------------------------------------------
	const stops = $derived(shading(body));

	// --- the numbers ---------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const rho = '\\htmlClass{q-matter}{\\rho}';
	const Menc = '\\htmlClass{q-matter}{M_{\\mathrm{enc}}}';
	const unit = `\\,G${M}/R^2`;

	/** A number with three figures after the point, exactly zero, or a pull without bound. */
	const fixed3 = (v: number) => (v === 0 ? '0' : Number.isFinite(v) ? v.toFixed(3) : '\\infty');
	/** A power to one decimal, without a trailing zero: "0", "−1.5". */
	const short = (v: number) => String(Number(v.toFixed(1)));
	const pTex = $derived(short(p));
	const pWords = $derived(short(p).replace('-', '−'));

	const name = $derived(
		body === 'shell'
			? 'A thin shell'
			: body === BALL
				? 'A uniform ball'
				: body < 0
					? 'Denser towards the centre'
					: 'Denser towards the surface'
	);

	const label = $derived(
		`The pull g against the distance r from the centre, out to three radii. Inside, for ${name.toLowerCase()}, it is ${
			body === 'shell' ? 'zero' : `${gHalf.toFixed(2)} at half the radius`
		}; outside it is G M over r squared, the same for every body, a quarter of the pull at the surface at 2R.`
	);

	// the answers' numbers
	const iBall = inertia(BALL);
</script>

<div class="shell-theorem">
	<section class="predict" aria-labelledby="shell-theorem-predict">
		<div class="steps">
			<span class="tag" id="shell-theorem-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Gather the mass towards the centre. Does the pull at twice the radius grow?
			{:else}
				Spread the same mass into a thin shell. What is the pull inside it?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>No. It stays a quarter of the pull at the surface.</strong> A sphere of radius
				<Tex math="2R" /> holds the whole mass whatever its arrangement, so the pull there is
				<Tex math={`G${M}/(2R)^2`} trust />. Inside, the pull near the centre grows without bound,
				and the moment of inertia falls from <Tex math={`${iBall.toFixed(3)}\\,${M}R^2`} trust /> towards
				zero: outside, only the spin can tell.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>None at all.</strong> A sphere drawn anywhere in the hollow holds no mass, so
				<Tex math="g = 0" /> inside, while the pull outside has not changed. The moment of inertia rises
				to <Tex math={`\\tfrac23\\,${M}R^2`} trust />, the most a body of this mass and radius can
				have.
			{:else if step === 1}
				The answer appears when you have set <Tex math="p" /> to <Tex math="-2" /> or below.
			{:else}
				The answer appears when you choose the shell.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="head">
			<svg class="cut" viewBox="-52 -52 104 104" aria-hidden="true">
				<defs>
					<radialGradient id="shell-theorem-density" r="0.5">
						{#each stops as s (s.t)}
							<stop offset={s.t} class="tone" stop-opacity={(0.04 + 0.86 * s.level).toFixed(3)} />
						{/each}
					</radialGradient>
				</defs>
				<circle class="body" r="48" />
				<circle class="surface-ring" r="48" />
				<circle class="centre" r="1.4" />
			</svg>
			<div class="about">
				<p class="title">{name}, cut through its centre</p>
				<p class="law">
					{#if body === 'shell'}
						all the mass at <Tex math="r = R" />
					{:else}
						<Tex math={`${rho} \\propto (r/R)^{${pTex}}`} trust />, so
						<Tex math={`${Menc}(r) = ${M}\\,(r/R)^{${short(p + 3)}}`} trust /> inside
					{/if}
				</p>
				<p class="law dim">shaded by its density; its mass is always <Tex math={M} trust /></p>
			</div>
		</div>

		<svg
			viewBox="0 0 {size.w} {size.h}"
			role="img"
			aria-label={label}
			class="plot"
			{@attach fitText()}
		>
			<defs>
				<clipPath id="shell-theorem-plot">
					<rect x={a.L} y={a.T - 2} width={a.R - a.L + 2} height={a.B - a.T + 4} />
				</clipPath>
			</defs>

			<!-- the axes -->
			<line class="axis" x1={a.L} y1={a.B} x2={a.R} y2={a.B} />
			<line class="axis" x1={a.L} y1={a.T} x2={a.L} y2={a.B} />
			{#each ticksY as g (g)}
				<line class="tick" x1={a.L - 4} y1={y(g)} x2={a.L} y2={y(g)} />
				<text class="num" x={a.L - 7} y={y(g) + 3.8} text-anchor="end">{g}</text>
			{/each}
			{#each ticksR as t (t.r)}
				<line class="tick" x1={x(t.r)} y1={a.B} x2={x(t.r)} y2={a.B + 4} />
				<text class={t.r ? 'sym small' : 'num'} x={x(t.r)} y={a.B + 16} text-anchor="middle"
					>{t.label}</text
				>
			{/each}
			<text class="sym axis-name" x={a.R + 7} y={a.B + 4}>r</text>
			<text class="sym axis-name" x={a.L + 7} y={a.T + 9}>g</text>

			<!-- the surface -->
			<line class="surface" x1={x(1)} y1={a.T} x2={x(1)} y2={a.B} />
			<text class="words" x={x(1) + 6} y={a.T + 9}>the surface</text>

			<g clip-path="url(#shell-theorem-plot)">
				<path class="ball" d={ball} />
				<path class="point" d={point} />
				<path class="fixed-halo" d={outside} />
				<path class="fixed" d={outside} />
				<path class="inside" d={inside} />
				{#if gHalf <= TOP}
					<circle class="dot" cx={x(0.5)} cy={y(gHalf)} r="3.2" />
				{/if}
			</g>
			<circle class="dot fixed-dot" cx={x(2)} cy={y(0.25)} r="3.4" />
			<text class="num strong" x={x(2) + 5} y={y(0.25) + 16}>¼</text>
			<text class="words" x={x(sameAt) + 4} y={y(1 / sameAt ** 2) - 9}
				>the same for every <tspan class="it">p</tspan></text
			>
		</svg>
		<p class="legend">
			<span><i class="key inside"></i>the pull inside this body</span>
			<span
				><i class="key fixed"></i><span
					>outside, <Tex math={`G${M}/r^2`} trust />, for every body</span
				></span
			>
			<span><i class="key ball"></i>the uniform ball</span>
			<span><i class="key point"></i><span>a point of mass <Tex math={M} trust /></span></span>
		</p>
	</div>

	<div class="bar">
		<div class="slide">
			<Slider
				id="shell-theorem-power"
				label="Density power"
				icon={RadialIcon}
				min={LEAST}
				max={MOST}
				step={0.1}
				bind:value={() => (thin ? MOST : p), setPower}
				readout={thin ? 'a thin shell' : `p = ${pWords}`}
				ends={['at the centre', 'at the surface']}
				marks={[
					{ at: -1, label: 'p = −1: the same pull at every depth' },
					{ at: BALL, label: 'p = 0: the uniform ball' }
				]}
				marksHint="the ticks mark p = −1 and the uniform ball"
			/>
		</div>
		<div class="presets" role="group" aria-label="Bodies">
			<button type="button" aria-pressed={body === BALL} onclick={chooseBall}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><circle class="mark-ball" cx="8" cy="8" r="6" /></svg
				>
				Ball
			</button>
			<button type="button" aria-pressed={thin} onclick={chooseShell}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><circle class="mark-shell" cx="8" cy="8" r="6" /></svg
				>
				Shell
			</button>
		</div>
		<p class="hint">
			Drag the slider, or reach it with Tab and use the arrow keys. The buttons set a uniform ball
			or a thin shell of the same mass.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Pull at <Tex math="2R" /></dt>
				<dd>
					<Tex math={`g = G${M}/(2R)^2 = ${fixed3(pull(2, body))}${unit}`} trust /><span
						class="also">the same for every body</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Pull at <Tex math="R/2" /></dt>
				<dd>
					<Tex math={gHalf === 0 ? 'g = 0' : `g = ${fixed3(gHalf)}${unit}`} trust /><span
						class="also"
						>{body === 'shell'
							? 'none: the hollow holds no mass'
							: body === BALL
								? 'half the pull at the surface'
								: 'it changes with the body'}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Moment of inertia</dt>
				<dd>
					<Tex math={`I = ${I.toFixed(3)}\\,${M}R^2`} trust /><span class="also"
						>{#if body === 'shell'}the most for this mass and radius{:else}<Tex
								math="\tfrac23\,(p+3)/(p+5)"
							/>{/if}</span
					><span class="also">the real Earth <Tex math={`0.331\\,${M}R^2`} trust /></span>
				</dd>
			</div>
		</dl>
		<p class="note">
			The pull is in units of <Tex math={`G${M}/R^2`} trust />, its value at the surface. By the
			shell theorem it is <Tex math={`G${Menc}(r)/r^2`} trust />, the pull of the mass nearer the
			centre than <Tex math="r" />, so outside the body it is the same for every arrangement of the
			same mass.
		</p>
		<p class="note">
			A thin shell of radius <Tex math="r" /> and mass <Tex math={`d${M}`} trust /> adds
			<Tex math={`\\tfrac23 r^2\\,d${M}`} trust /> to the moment of inertia, so
			<Tex
				math={`I = \\tfrac23\\int r^2\\,d${M} = \\tfrac23\\,\\frac{p+3}{p+5}\\,${M}R^2`}
				trust
			/>: 0.4 for the uniform ball, nearly 0 as the mass gathers at the centre, and
			<Tex math="\tfrac23" /> for the shell. A density <Tex math={`${rho} \\propto r^p`} trust /> holds
			a finite mass only for <Tex math="p > -3" />, where it becomes a point.
		</p>
	</div>
</div>

<style>
	.shell-theorem {
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
	.presets button:focus-visible {
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

	/* --- the body and the plot ------------------------------------------------------------- */

	.stage {
		display: grid;
		gap: 0.6rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.head {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		min-width: 0;
	}

	.head p {
		margin: 0;
	}

	.about {
		min-width: 0;
		display: grid;
		gap: 0.15rem;
	}

	.title {
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text);
	}

	.law {
		font-size: 0.76rem;
		line-height: 1.4;
		color: var(--text-dim);
	}

	.law.dim {
		color: var(--text-faint);
		font-size: 0.72rem;
	}

	svg.cut {
		flex: none;
		width: 4rem;
		height: 4rem;
		display: block;
	}

	.tone {
		stop-color: var(--q-matter);
	}

	.body {
		fill: url(#shell-theorem-density);
	}

	.surface-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 60%, transparent);
		stroke-width: 1.2;
	}

	.cut .centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	svg.plot {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.num {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.num.strong {
		fill: var(--text);
		font-weight: 600;
		font-size: calc(12px * var(--u, 1));
	}

	.sym {
		fill: var(--text);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.sym.small {
		fill: var(--text-dim);
		font-size: calc(12px * var(--u, 1));
	}

	.axis-name {
		fill: var(--text-dim);
	}

	.words {
		fill: var(--text-dim);
		font: 400 calc(10.5px * var(--u, 1)) / 1 var(--font-sans);
	}

	.words .it {
		font: italic 500 calc(12.5px * var(--u, 1)) / 1 var(--font-serif);
	}

	.surface {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.ball {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.point {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.inside {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.fixed {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	/* the curve that does not move, set off by a band of its own colour */
	.fixed-halo {
		fill: none;
		stroke: color-mix(in srgb, var(--q-field) 20%, transparent);
		stroke-width: calc(10px * var(--u, 1));
		stroke-linecap: round;
	}

	.dot {
		fill: var(--q-field);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.fixed-dot {
		fill: var(--text);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 1rem;
		margin: 0;
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
		border-top: 2px solid;
	}

	.key.inside {
		border-color: var(--q-field);
	}

	.key.fixed {
		border-top-width: 3px;
		border-color: var(--q-field);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--q-field) 20%, transparent);
		border-radius: 2px;
	}

	.key.ball {
		border-top: 1.5px solid color-mix(in srgb, var(--text) 32%, transparent);
	}

	.key.point {
		border-top: 2px dotted color-mix(in srgb, var(--text) 45%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.2rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slide {
		flex: 1 1 18rem;
		min-width: 0;
	}

	.presets {
		flex: 0 1 12rem;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
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
		gap: 0.4rem;
		min-height: calc(var(--control-height, 2.55rem) - 8px);
		padding: 0.3rem 0.6rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font-size: 0.78rem;
		line-height: 1.2;
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
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg-raised);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.presets svg {
		width: 16px;
		height: 16px;
		flex: none;
	}

	.mark-ball {
		fill: color-mix(in srgb, currentColor 30%, transparent);
		stroke: currentColor;
		stroke-width: 1.6;
	}

	.mark-shell {
		fill: none;
		stroke: currentColor;
		stroke-width: 2.6;
	}

	.presets button[aria-pressed='true'] svg {
		color: var(--accent);
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

	@media (max-width: 560px) {
		.row {
			grid-template-columns: 7.8rem 1fr;
			gap: 0.1rem 0.6rem;
		}

		.presets {
			flex: 1 1 100%;
		}
	}
</style>
