<script lang="ts">
	/**
	 * Chapter 11.2's spinning hole and the waves it amplifies. Panel 1: the hole cut through its axis, to scale in
	 * GM/c², with Boyer–Lindquist r as the distance from the centre: the horizon a dark disc of radius r₊, the
	 * ergosphere's surface r = 1 + √(1 − χ² cos²ϑ) round it, a few meridians on the horizon turning at a drawn rate in
	 * proportion to Ω_H (far slower than the hole's own), and an incoming and an outgoing arrow beside it, the outgoing
	 * one wider when ω < mΩ_H and narrower when ω > mΩ_H: only the sign of 1 − mΩ_H/ω is computed, never the size of
	 * the gain. Panel 2: the mass as a bar, M_irr/M below and the share held in spin, 1 − M_irr/M, above it. One slider
	 * sets χ from 0 to 0.998, spaced evenly in r₊, with ticks at the paper's spins labelled with its stated gains for
	 * ℓ = m = 2; one sets GMω/c³ from 0 to 1.2; a choice sets m = 1, 2 or 3. The arithmetic is in ./spin-and-gain.ts.
	 * The chapter's try box asks the predictions, so the figure answers none of them in words. The marks turn unless
	 * motion is reduced; then they wait for the play button.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		BlackHole01Icon,
		PauseIcon,
		PlayIcon,
		Rotate01Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DRAWN_RATE,
		FREQUENCY,
		LEAST_IRREDUCIBLE,
		OPENING,
		ORDERS,
		PAPER_GAINS,
		PLACE,
		SPIN,
		arrowWidths,
		clamp,
		ergosphereOutline,
		frequencyText,
		horizon,
		horizonRate,
		irreducible,
		meridians,
		paperGainAt,
		percentText,
		placeOf,
		spinFromPlace,
		spinShare,
		spinText,
		stepSpin,
		tenSunsTurns,
		threshold,
		verdict,
		type Order
	} from './spin-and-gain';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let chi = $state(OPENING.chi);
	let omega = $state(OPENING.omega);
	/** The choice of m, as the switch's words: the switch takes strings. */
	let order = $state<`${Order}`>(`${OPENING.m}`);
	const m = $derived(Number(order) as Order);

	/**
	 * On the spin: the arrow keys step a hundredth (a thousandth above 0.99), Page Up and Page Down to the next tenth
	 * (then 0.99 and 0.998), Home and End to its ends.
	 */
	function spinKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const k = e.key;
		let next: number | undefined;
		if (k === 'ArrowRight' || k === 'ArrowUp') next = stepSpin(chi, 1);
		else if (k === 'ArrowLeft' || k === 'ArrowDown') next = stepSpin(chi, -1);
		else if (k === 'PageUp') next = stepSpin(chi, 1, true);
		else if (k === 'PageDown') next = stepSpin(chi, -1, true);
		else if (k === 'Home') next = SPIN.min;
		else if (k === 'End') next = SPIN.max;
		if (next === undefined) return;
		e.preventDefault();
		chi = next;
	}

	/** On the frequency: Page Up and Page Down step a tenth; the arrows keep the slider's hundredth. */
	function frequencyKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
		e.preventDefault();
		const by = e.key === 'PageUp' ? FREQUENCY.page : -FREQUENCY.page;
		setOmega(omega + by);
	}

	function setOmega(v: number) {
		omega = clamp(Math.round(v * 100) / 100, FREQUENCY.min, FREQUENCY.max);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const rPlus = $derived(horizon(chi));
	const rate = $derived(horizonRate(chi));
	const limit = $derived(threshold(chi, m));
	const outcome = $derived(verdict(chi, omega, m));
	const widths = $derived(arrowWidths(chi, omega, m));
	const irr = $derived(irreducible(chi));
	const share = $derived(spinShare(chi));
	const gain = $derived(paperGainAt(chi));

	// --- the turning: a drawn rate in proportion to Ω_H, waiting for the play button under reduced motion ---------
	let phase = $state(0.35);
	let playing = $state(true);
	let checked = false;

	const clock: Attachment = () => {
		// read first, so that pressing play or pause runs this again
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
			if (dt > 0 && rate > 0) phase = (phase + dt * DRAWN_RATE * rate) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the hole -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const hole = $derived(
		phone.current
			? { W: 360, H: 262, cx: 108, cy: 132, s: 46 }
			: { W: 440, H: 300, cx: 142, cy: 152, s: 52 }
	);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	const X = (x: number) => hole.cx + x * hole.s;
	const Y = (z: number) => hole.cy - z * hole.s;

	const ergoPath = $derived(
		ergosphereOutline(chi)
			.map(([x, z], i) => `${i ? 'L' : 'M'}${f1(X(x))},${f1(Y(z))}`)
			.join('') + 'Z'
	);
	const R = $derived(rPlus * hole.s);

	/** The meridians on the near side, each a half ellipse from pole to pole. */
	const marks = $derived(
		meridians(phase).map((mk) => {
			const rx = Math.abs(mk.across) * R;
			const sweep = mk.across > 0 ? 1 : 0;
			return {
				d: `M${f1(hole.cx)},${f1(hole.cy - R)}A${f1(rx)},${f1(R)} 0 0 ${sweep} ${f1(hole.cx)},${f1(hole.cy + R)}`,
				opacity: (0.18 + 0.5 * mk.facing).toFixed(3)
			};
		})
	);

	/** The sense of the turning: an ellipse round the axis above the hole, its near half carrying the arrow. */
	const turn = $derived.by(() => {
		const cy = hole.cy - 2.34 * hole.s;
		const rx = 0.52 * hole.s;
		const ry = 0.13 * hole.s;
		const at = (th: number) => [hole.cx + rx * Math.cos(th), cy + ry * Math.sin(th)];
		// the near half runs from the left (π) under the axis to the right (0); it ends at 0.3 rad, the head beyond
		const end = 0.3;
		const [ex, ey] = at(end);
		const [sx, sy] = at(Math.PI);
		// the direction of travel there, toward smaller angles
		const tx = rx * Math.sin(end);
		const ty = -ry * Math.cos(end);
		const n = Math.hypot(tx, ty);
		const [dx, dy] = [tx / n, ty / n];
		const len = 6.5 * u;
		const half = 3.4 * u;
		const hx = ex + dx * len;
		const hy = ey + dy * len;
		return {
			back: `M${f1(sx)},${f1(sy)}A${f1(rx)},${f1(ry)} 0 0 1 ${f1(hole.cx + rx)},${f1(cy)}`,
			front: `M${f1(sx)},${f1(sy)}A${f1(rx)},${f1(ry)} 0 0 0 ${f1(ex)},${f1(ey)}`,
			head: `M${f1(hx)},${f1(hy)}L${f1(ex - dy * half)},${f1(ey + dx * half)}L${f1(ex + dy * half)},${f1(ey - dx * half)}Z`,
			label: { x: hole.cx + rx + 8 * u, y: cy + 4 * u },
			top: cy - ry - 8 * u
		};
	});

	/** A block arrow along y from x0 to x1, its shaft `w` wide. */
	function blockArrow(x0: number, x1: number, y: number, w: number) {
		const d = Math.sign(x1 - x0);
		const head = Math.max(9, 1.1 * w + 5) * u;
		const halfHead = w / 2 + 4.5 * u;
		const xb = x1 - d * head;
		const h = w / 2;
		return (
			`M${f1(x0)},${f1(y - h)}L${f1(xb)},${f1(y - h)}L${f1(xb)},${f1(y - halfHead)}` +
			`L${f1(x1)},${f1(y)}L${f1(xb)},${f1(y + halfHead)}L${f1(xb)},${f1(y + h)}L${f1(x0)},${f1(y + h)}Z`
		);
	}

	const arrows = $derived.by(() => {
		const near = X(2.2);
		const far = hole.W - 16 * u;
		const gap = 0.56 * hole.s;
		return {
			inPath: blockArrow(far, near, hole.cy - gap, widths.in * u),
			outPath: blockArrow(near, far, hole.cy + gap, widths.out * u),
			inLabel: { x: far, y: hole.cy - gap - 15 * u },
			outLabel: { x: far, y: hole.cy + gap + 24 * u }
		};
	});

	const scale = $derived({ x0: 14 * u, x1: 14 * u + hole.s, y: hole.H - 14 * u });

	// --- the mass ---------------------------------------------------------------------------------------------------
	const mass = $derived(
		phone.current
			? { W: 360, H: 176, x: 124, w: 30, top: 56, bottom: 160 }
			: { W: 240, H: 300, x: 62, w: 34, top: 74, bottom: 276 }
	);
	const My = (f: number) => mass.bottom - f * (mass.bottom - mass.top);
	/** The irreducible mass is named low in its part, clear of the line at 1/√2 whatever the spin. */
	const IRR_LABEL = 0.32;

	// --- the words --------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const unit = `\\,G${M}/c^2`;
	const rPlusTex = $derived(`r_+ = ${rPlus.toFixed(3)}${unit}`);
	const rateTex = $derived(`G${M}\\Omega_H/c^3 = ${rate.toFixed(3)}`);
	const omegaTex = $derived(`G${M}\\omega/c^3 = ${frequencyText(omega)}`);
	const patternTex = $derived(`G${M}\\omega/mc^3 = ${(omega / m).toFixed(3)}`);
	const limitTex = $derived(`m\\,G${M}\\Omega_H/c^3 = ${limit.toFixed(3)}`);
	const irrTex = $derived(`${M}_{\\rm irr}/${M} = ${irr.toFixed(3)}`);
	const shareTex = $derived(`1 - ${M}_{\\rm irr}/${M} = ${percentText(share)}\\%`);
	const BRACKET = '1 - m\\Omega_H/\\omega';

	const OUTCOME: Record<typeof outcome, { word: string; sign: string }> = {
		amplified: { word: 'Amplified', sign: `${BRACKET} < 0` },
		absorbed: { word: 'Absorbed', sign: `${BRACKET} > 0` },
		threshold: { word: 'Neither', sign: `${BRACKET} = 0` },
		none: { word: 'No wave', sign: '\\omega = 0' }
	};

	const turnsText = $derived(Math.round(tenSunsTurns(chi)).toLocaleString('en-GB'));

	const holeDescription = $derived(
		`The hole cut through its spin axis, to scale, at χ = ${spinText(chi)}: the horizon, a dark disc of radius ${rPlus.toFixed(3)} GM/c², ` +
			(rate > 0
				? `inside the ergosphere, which reaches 2 GM/c² on the equator and meets the horizon at the poles. Marks on the horizon ${playing ? 'turn slowly' : 'are drawn turning'} about the axis in the sense of the arrow above it. `
				: 'with no ergosphere outside it; it does not turn. ') +
			(outcome === 'none'
				? 'At zero frequency there is no wave, so no arrows are drawn.'
				: `A wave with m = ${m} at GMω/c³ = ${frequencyText(omega)} comes in from the right, and leaves by an arrow ${widths.out > widths.in ? 'wider' : widths.out < widths.in ? 'narrower' : 'as wide'} than the one that came in.`)
	);
	const massDescription = $derived(
		`A bar of the hole's mass: the irreducible mass, ${irr.toFixed(3)} of it, below, and the share held in spin, ${percentText(share)} percent, above; a dashed line marks 1/√2, the least the irreducible mass can be, at χ = 1.`
	);

	const SPIN_MARKS = PAPER_GAINS.filter((g) => g.chi <= SPIN.max).map((g) => ({
		at: placeOf(g.chi),
		label: `χ = ${g.chi}: the paper’s greatest gain for ℓ = m = 2, ${g.gain}`
	}));

	const ORDER_OPTIONS: { value: `${Order}`; label: string; icon: typeof Rotate01Icon }[] =
		ORDERS.map((k) => ({ value: `${k}`, label: `m = ${k}`, icon: Rotate01Icon }));
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} trust />{/each}</span
	>{/snippet}

<div class="spin-and-gain">
	<div class="panels">
		<section class="panel" aria-label="The hole through its axis">
			<div class="stage">
				<p class="heading">The hole through its axis, to scale</p>
				<svg
					viewBox="0 0 {hole.W} {hole.H}"
					role="img"
					aria-label={holeDescription}
					{@attach fitText((value) => (u = value))}
					{@attach clock}
				>
					<rect class="frame" width={hole.W} height={hole.H} rx={6 * u} />

					<!-- the far half of the turning, the axis, the ergosphere and the horizon -->
					{#if rate > 0}<path class="turn-back" d={turn.back} />{/if}
					<line class="axis" x1={hole.cx} x2={hole.cx} y1={turn.top} y2={hole.cy + 2.3 * hole.s} />
					<path class="ergo" d={ergoPath} />
					<circle class="hole" cx={hole.cx} cy={hole.cy} r={R} />
					<g clip-path="url(#{uid}-disc)">
						<line class="equator" x1={hole.cx - R} x2={hole.cx + R} y1={hole.cy} y2={hole.cy} />
						{#each marks as mk, i (i)}
							<path class="meridian" d={mk.d} style:opacity={mk.opacity} />
						{/each}
					</g>
					<defs>
						<clipPath id="{uid}-disc">
							<circle cx={hole.cx} cy={hole.cy} r={R} />
						</clipPath>
					</defs>

					<!-- the near half of the turning, with its arrow; a hole without spin does not turn -->
					{#if rate > 0}
						<path class="turn" d={turn.front} />
						<path class="turn-head" d={turn.head} />
						<text class="label" x={turn.label.x} y={turn.label.y}
							><tspan class="it">Ω</tspan><tspan class="sub it" dy={2.5 * u}>H</tspan></text
						>
					{/if}

					<!-- the wave, in and out: only the sign of the change is drawn -->
					{#if outcome !== 'none'}
						<path class="wave" d={arrows.inPath} />
						<path class="wave" d={arrows.outPath} />
						<text class="small end" x={arrows.inLabel.x} y={arrows.inLabel.y}>in</text>
						<text class="small end" x={arrows.outLabel.x} y={arrows.outLabel.y}>out</text>
					{/if}

					<!-- the scale -->
					<path
						class="scale"
						d="M{f1(scale.x0)},{f1(scale.y - 3 * u)}V{f1(scale.y)}H{f1(scale.x1)}V{f1(
							scale.y - 3 * u
						)}"
					/>
					<text class="small" x={scale.x1 + 6 * u} y={scale.y + 1 * u}
						><tspan class="it">GM</tspan>/<tspan class="it">c</tspan>²</text
					>
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch hole-key"></span>the horizon, <Tex math="r_+" /></li>
					<li><span class="swatch ergo-key"></span>the ergosphere</li>
					<li><span class="swatch axis-key"></span>the spin axis</li>
					<li>
						<span class="swatch wave-key"></span>the wave, turning with the hole, <Tex
							math="m > 0"
						/>
					</li>
				</ul>
			</div>
		</section>

		<section class="panel" aria-label="The hole’s mass">
			<div class="stage">
				<p class="heading">Its mass, and the share in spin</p>
				<svg
					viewBox="0 0 {mass.W} {mass.H}"
					role="img"
					aria-label={massDescription}
					{@attach fitText((value) => (v = value))}
				>
					<defs>
						<pattern
							id="{uid}-hatch"
							width={5 * v}
							height={5 * v}
							patternUnits="userSpaceOnUse"
							patternTransform="rotate(45)"
						>
							<rect class="hatch-ground" width={5 * v} height={5 * v} />
							<line class="hatch-line" x1="0" x2="0" y1="0" y2={5 * v} />
						</pattern>
					</defs>

					<!-- the share in spin, above the bar -->
					<text class="small mid" x={mass.x + mass.w / 2} y={mass.top - 30 * v}>held in spin</text>
					<text class="label mid" x={mass.x + mass.w / 2} y={mass.top - 12 * v}
						>{percentText(share)}%</text
					>

					<rect
						class="spin-part"
						x={mass.x}
						y={My(1)}
						width={mass.w}
						height={My(irr) - My(1)}
						fill="url(#{uid}-hatch)"
					/>
					<rect class="irr-part" x={mass.x} y={My(irr)} width={mass.w} height={My(0) - My(irr)} />
					<rect class="outline" x={mass.x} y={My(1)} width={mass.w} height={My(0) - My(1)} />
					<line
						class="least"
						x1={mass.x - 5 * v}
						x2={mass.x + mass.w + 5 * v}
						y1={My(LEAST_IRREDUCIBLE)}
						y2={My(LEAST_IRREDUCIBLE)}
					/>

					<!-- the scale on the left -->
					<text class="fine dim end" x={mass.x - 8 * v} y={My(1) + 3.5 * v}>1</text>
					<text class="fine dim end" x={mass.x - 8 * v} y={My(LEAST_IRREDUCIBLE) + 3.5 * v}
						>1/√2</text
					>
					<text class="fine dim end" x={mass.x - 8 * v} y={My(0) + 3.5 * v}>0</text>

					<!-- the irreducible mass, beside its part; the least it can be, beside its line -->
					<text class="small start" x={mass.x + mass.w + 10 * v} y={My(IRR_LABEL) - 3 * v}
						><tspan class="it">M</tspan><tspan class="sub" dy={2.5 * v}>irr</tspan><tspan
							dy={-2.5 * v}>/</tspan
						><tspan class="it">M</tspan></text
					>
					<text class="label start" x={mass.x + mass.w + 10 * v} y={My(IRR_LABEL) + 13 * v}
						>{irr.toFixed(3)}</text
					>
					<text
						class="fine dim start"
						x={mass.x + mass.w + 10 * v}
						y={My(LEAST_IRREDUCIBLE) + 3.5 * v}>the least, at <tspan class="it">χ</tspan> = 1</text
					>
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch irr-key"></span>irreducible</li>
					<li><span class="swatch spin-key"></span>in spin</li>
				</ul>
			</div>
		</section>
	</div>

	<div class="bar-controls">
		<div class="slot" onkeydowncapture={spinKeys} role="presentation">
			<Slider
				id="{uid}-spin"
				label="The hole’s spin"
				icon={BlackHole01Icon}
				min={PLACE.min}
				max={PLACE.max}
				step={PLACE.step}
				bind:value={() => placeOf(chi), (p) => (chi = spinFromPlace(p))}
				readout="χ = {spinText(chi)}"
				ends={['0', '0.998']}
				marks={SPIN_MARKS}
				marksHint="the ticks mark the paper’s spins, with its stated gains; at χ = 1 it states 138%"
			/>
		</div>
		<div class="slot" onkeydowncapture={frequencyKeys} role="presentation">
			<Slider
				id="{uid}-frequency"
				label="The wave’s frequency"
				icon={WaveIcon}
				min={FREQUENCY.min}
				max={FREQUENCY.max}
				step={FREQUENCY.step}
				bind:value={() => omega, setOmega}
				readout="GMω/c³ = {frequencyText(omega)}"
				ends={['0', '1.2']}
				mark={{ at: limit, label: 'the threshold' }}
			/>
			{#if limit > FREQUENCY.max}
				<!-- in the mark's place, so that the controls below stay where they are -->
				<p class="beyond">the threshold, beyond 1.2 →</p>
			{/if}
		</div>
		<div class="row-controls">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Stop the turning' : 'Turn the hole'}
				aria-pressed={playing}
				onclick={() => (playing = !playing)}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<div class="orders">
				<Segmented label="The wave’s azimuthal number" options={ORDER_OPTIONS} bind:value={order} />
			</div>
		</div>
		<p class="hint">
			Drag the spin and the wave’s frequency, and choose <Tex math="m" />. With the keyboard, reach
			each with Tab: on the spin the arrow keys step a hundredth (a thousandth above 0.99), Page Up
			and Page Down go on to the next tenth, and Home and End to its ends; the play button starts
			and stops the turning.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The horizon</dt>
				<dd>{@render eq([rPlusTex])}</dd>
			</div>
			<div class="row">
				<dt>Its turning</dt>
				<dd>
					{@render eq([rateTex])}<span class="also"
						>for ten solar masses, {turnsText} turns a second; drawn far slower</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The wave</dt>
				<dd>
					{@render eq([omegaTex])}{@render eq([`m = ${m}`])}<span class="also"
						>its pattern turns at</span
					>{@render eq([patternTex])}
				</dd>
			</div>
			<div class="row">
				<dt>The threshold</dt>
				<dd>
					{@render eq([limitTex])}<span class="verdict" aria-live="polite"
						><strong>{OUTCOME[outcome].word}</strong><Tex math={OUTCOME[outcome].sign} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The mass</dt>
				<dd>
					{@render eq([irrTex])}{@render eq([shareTex])}<span class="also">held in spin</span>
				</dd>
			</div>
			<div class="row">
				<dt>The paper’s gain</dt>
				<dd>
					{#if gain}
						{@render eq([`${gain.replace('%', '\\%')}`])}<span class="also"
							>the greatest for <Tex math="\ell = m = 2" /> at this spin, stated by the paper from Teukolsky
							and Press</span
						>
					{:else}
						<span class="also"
							>stated by the paper only at the ticked spins, and 138% at <Tex
								math="\chi = 1"
							/></span
						>
					{/if}
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Look first at the two arrows. Only the sign of <Tex math={BRACKET} /> is computed, from the first
		law and the area theorem: the outgoing arrow is drawn wider when it is negative and narrower when
		it is positive, by fixed amounts, and its width is not the size of the gain, which needs Teukolsky’s
		equation. The gains on the spin’s ticks are the paper’s, stated, for <Tex
			math="\ell = m = 2"
		/>. Lengths are in <Tex math={unit} trust />, with <Tex math={`\\chi = ac^2/G${M}`} trust />;
		the cut through the axis takes Boyer–Lindquist <Tex math="r" /> as the distance from the centre, the
		horizon at <Tex math="r_+" /> and the ergosphere’s surface at <Tex
			math={`r = G${M}/c^2 + \\sqrt{(G${M}/c^2)^2 - a^2\\cos^2\\vartheta}`}
			trust
		/>. The marks on the horizon turn at a rate in proportion to <Tex math="\Omega_H" />, far slower
		than a real hole’s. The spin’s track is spaced evenly in <Tex math="r_+" />, so that the fast
		spins lie apart.
	</p>
</div>

<style>
	.spin-and-gain {
		/* the horizon is black on either ground */
		--hole: #050403;
		--mark: #f7f3ec;
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
		grid-template-columns: minmax(0, 440fr) minmax(0, 240fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.8rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.4rem;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text-dim);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
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
		font-size: calc(10.5px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 500;
		fill: var(--text);
		font-variant-numeric: tabular-nums;
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
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.75em;
	}

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	/* the ergosphere is the metric's: the field colour, faint inside */
	.ergo {
		fill: color-mix(in srgb, var(--q-field) 16%, transparent);
		stroke: var(--q-field);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.hole {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.equator {
		stroke: color-mix(in srgb, var(--mark) 22%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.meridian {
		fill: none;
		stroke: var(--mark);
		stroke-width: calc(1px * var(--u, 1));
	}

	.turn,
	.turn-back {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.turn-back {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.turn-head {
		fill: var(--text);
	}

	/* the wave is neutral: its arrows in the ink */
	.wave {
		fill: color-mix(in srgb, var(--text) 62%, transparent);
		stroke: none;
	}

	.scale {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the mass: the matter colour, hatched where it is held in spin ------------------------ */

	.irr-part {
		fill: color-mix(in srgb, var(--q-matter) 70%, transparent);
	}

	.hatch-ground {
		fill: color-mix(in srgb, var(--q-matter) 14%, transparent);
	}

	.hatch-line {
		stroke: var(--q-matter);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.outline {
		fill: none;
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.least {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	/* --- the legends ------------------------------------------------------------------------ */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.9rem;
		margin: 0.45rem 0.1rem 0;
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
		border-top: 1.5px solid;
	}

	.hole-key {
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
		border-radius: 50%;
		background: var(--hole);
	}

	.ergo-key {
		width: 0.9rem;
		height: 0.6rem;
		border: 1.3px solid var(--q-field);
		border-radius: 50%;
		background: color-mix(in srgb, var(--q-field) 16%, transparent);
	}

	.axis-key {
		border-top: 1.5px dashed color-mix(in srgb, var(--text) 45%, transparent);
	}

	.wave-key {
		height: 0.4rem;
		border: 0;
		background: color-mix(in srgb, var(--text) 62%, transparent);
		clip-path: polygon(0 25%, 65% 25%, 65% 0, 100% 50%, 65% 100%, 65% 75%, 0 75%);
	}

	.irr-key,
	.spin-key {
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid var(--line-strong);
	}

	.irr-key {
		background: color-mix(in srgb, var(--q-matter) 70%, transparent);
	}

	.spin-key {
		background: repeating-linear-gradient(
			-45deg,
			var(--q-matter) 0 1.4px,
			color-mix(in srgb, var(--q-matter) 14%, transparent) 1.4px 3.5px
		);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slot {
		min-width: 0;
	}

	/* set as the slider's own mark is, in the room it takes */
	.beyond {
		margin: 0.2rem 0 0;
		font-size: 0.66rem;
		line-height: 1.3;
		text-align: right;
		color: var(--text-dim);
	}

	.row-controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.orders {
		flex: 1;
		min-width: 0;
	}

	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		min-height: 2.2rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play:hover {
		border-color: var(--accent);
	}

	.play:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
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

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.readouts dl {
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	.row {
		display: grid;
		grid-template-columns: 9.5rem minmax(0, 1fr);
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
		gap: 0.15rem 0.6rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.3em;
		min-width: 0;
		max-width: 100%;
	}

	.verdict {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5em;
	}

	.verdict strong {
		font-weight: 600;
		color: var(--text);
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
		margin-right: 0.5rem;
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

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
