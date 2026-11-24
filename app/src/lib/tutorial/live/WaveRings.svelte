<script lang="ts">
	/**
	 * Chapter 7.6's wave rings, a port of the GR course's wave lab. A ring of twelve free balls, in the observer's
	 * colour, in a plane gravitational wave travelling toward the reader; each ball moves by δξ_i = ½ h_ij ξ_j, drawn
	 * exaggerated, with an arrow along its displacement, orange where it moves out (a stretch) and blue where it
	 * moves in (a squeeze). An L of two arms through the ring's centre can be turned; it reads the chapter's LIGO
	 * strain, the difference of the arms over the length of one, h₊ cos 2ψ + h× sin 2ψ. A switch draws the magnetic
	 * part 𝓑 = ε k̂ 𝓔 in the curvature colour, as a second ring (the tide's pattern turned by 45°) or as six gyroscope
	 * pairs turning relative to one another at 𝓑ξ. Sliders set h₊, h×, the phase of h× behind h₊ and the arm angle
	 * (./wave-rings.ts holds the arithmetic). Opens with a plus wave of 1, playing; three predictions at the top are
	 * answered once the reader has done what each asks. Under reduced motion it opens paused, at the largest stretch.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AngleIcon,
		CircleIcon,
		Clock01Icon,
		MagnetIcon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		Rotate01Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		AMPLITUDE,
		ARMS,
		DRAWN,
		EXAGGERATION,
		GYRO_PAIRS,
		LAG,
		OPENING,
		PERIOD_S,
		RING,
		armAxes,
		armChanges,
		armDifference,
		armPeak,
		circular,
		clampTo,
		degrees,
		displacement,
		gyroTurn,
		magnetic,
		magneticStrain,
		noteFirst,
		noteSecond,
		noteThird,
		plusOnly,
		polarization,
		setting,
		signed2,
		size,
		stepped,
		strainNow,
		stretchAxis,
		tide,
		two,
		watch,
		type Knobs,
		type Mat3,
		type Point,
		type Range
	} from './wave-rings';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let plus = $state(OPENING.plus);
	let cross = $state(OPENING.cross);
	let lag = $state(OPENING.lag);
	let arms = $state(OPENING.arms);
	/** ωt, radians. */
	let phase = $state(OPENING.phase);
	let showB = $state(false);
	type Mode = 'ring' | 'gyros';
	let mode = $state<Mode>('ring');

	const knobs: Knobs = $derived({ plus, cross, lag, arms });
	const settings = $derived({ plus, cross, lag, arms, phase });

	function setPlus(v: number) {
		plus = clampTo(v, AMPLITUDE);
		note();
	}
	function setCross(v: number) {
		cross = clampTo(v, AMPLITUDE);
		note();
	}
	function setLag(v: number) {
		lag = clampTo(v, LAG);
		note();
	}
	function setArms(v: number) {
		arms = clampTo(v, ARMS);
		note();
	}

	function reset() {
		plus = OPENING.plus;
		cross = OPENING.cross;
		lag = OPENING.lag;
		arms = OPENING.arms;
		phase = OPENING.phase;
		showB = false;
		mode = 'ring';
		note();
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

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	/** How much of ωt has run with a plus wave alone, and with the circular wave. */
	let watchedPlus = 0;
	let watchedCircle = 0;
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	/** The settings that first answered each, for its numbers. */
	let firstAt = $state<Knobs>(OPENING);
	let secondAt = $state<Knobs>({ ...OPENING, cross: 1 });

	function note() {
		const k = { plus, cross, lag, arms };
		if (!first && noteFirst(false, k, watchedPlus)) firstAt = k;
		first = noteFirst(first, k, watchedPlus);
		if (!second && noteSecond(false, k, watchedCircle)) secondAt = k;
		second = noteSecond(second, k, watchedCircle);
		third = noteThird(third, k);
	}

	// the numbers of an answer follow the settings while they still answer its question
	const firstK = $derived(plusOnly(knobs) ? knobs : firstAt);
	const secondK = $derived(circular(knobs) ? knobs : secondAt);

	// --- the time ---------------------------------------------------------------------------------------------------
	let playing = $state(true);

	function advance(d: number) {
		phase = (phase + d) % (2 * Math.PI);
		watchedPlus = watch(watchedPlus, plusOnly(knobs), d);
		watchedCircle = watch(watchedCircle, circular(knobs), d);
		if (!first || !second) note();
	}

	let checked = false;
	/** Runs ωt through a period every few seconds while playing; under reduced motion it opens paused. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				phase = 0;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			advance((2 * Math.PI * dt) / PERIOD_S);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the numbers ------------------------------------------------------------------------------------------------
	const h = $derived(strainNow(settings));
	const E = $derived(tide(settings));
	const B = $derived(magnetic(E));
	const hB = $derived(magneticStrain(settings));
	const reading = $derived(armDifference(h, arms));
	const peak = $derived(armPeak(knobs));
	const sizeE = $derived(size(E));
	const sizeB = $derived(size(B));
	const axisE = $derived(stretchAxis(h));
	const axisB = $derived(stretchAxis(hB));
	const kind = $derived(polarization(knobs));

	/** A change's kind: a stretch above zero, a squeeze below. */
	const sense = (v: number, scale = 1) =>
		v > 1e-6 * scale ? 'stretch' : v < -1e-6 * scale ? 'squeeze' : 'still';

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? showB
				? { W: 360, H: 676, R: 88, cx: 180, cy: 176, bx: 180, by: 530, bR: 74 }
				: { W: 360, H: 424, R: 88, cx: 180, cy: 176, bx: 180, by: 530, bR: 74 }
			: { W: 640, H: 440, R: 116, cx: 190, cy: 226, bx: 518, by: 292, bR: 74 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	/** An arm is this many ring radii long. */
	const ARM = 1.22;
	/** An arrow is this many times as long as the displacement drawn. */
	const ARROW = 1;
	/** A gyroscope's arrow for a turning 𝓑ξ of one ω²h per ring radius, in ring radii. */
	const GYRO = 0.8;

	/** A point in ring radii on the page, around a centre, y up. */
	const at = (c: { x: number; y: number }, R: number, p: Point) => ({
		x: c.x + R * p[0],
		y: c.y - R * p[1]
	});

	/** The shaft and head of an arrow from `from` along `v` (page units, y down), if long enough to draw. */
	function arrow(from: { x: number; y: number }, v: { x: number; y: number }, gap = 0) {
		const l = Math.hypot(v.x, v.y);
		if (l < 5 * u + gap) return undefined;
		const ux = v.x / l;
		const uy = v.y / l;
		const x0 = from.x + ux * gap;
		const y0 = from.y + uy * gap;
		const x1 = from.x + v.x;
		const y1 = from.y + v.y;
		const head = Math.min(5.5 * u, 0.45 * (l - gap));
		const w = 2.6 * u;
		const bx = x1 - ux * head;
		const by = y1 - uy * head;
		return {
			shaft: `M${f2(x0)},${f2(y0)}L${f2(bx + ux * 0.5)},${f2(by + uy * 0.5)}`,
			head: `${f2(x1)},${f2(y1)} ${f2(bx - uy * w)},${f2(by + ux * w)} ${f2(bx + uy * w)},${f2(by - ux * w)}`
		};
	}

	/** A ring of balls moved by ½ h ξ, the drawn strain DRAWN per unit of h. */
	function ringOf(table: Mat3, c: { x: number; y: number }, R: number) {
		const ball = (phone.current ? 4 : 4.6) * u;
		const balls = RING.map((xi) => {
			const d = displacement(table, xi);
			const moved: Point = [xi[0] + DRAWN * d[0], xi[1] + DRAWN * d[1]];
			const p = at(c, R, moved);
			const radial = d[0] * xi[0] + d[1] * xi[1];
			const len = Math.hypot(d[0], d[1]);
			const k =
				len < 1e-9
					? 'still'
					: radial > 0.3 * len
						? 'stretch'
						: radial < -0.3 * len
							? 'squeeze'
							: 'still';
			const a = arrow(
				p,
				{ x: ARROW * R * DRAWN * d[0], y: -ARROW * R * DRAWN * d[1] },
				ball + 1.5 * u
			);
			return { p, k, a };
		});
		const outline = Array.from({ length: 73 }, (_, i) => {
			const t = (2 * Math.PI * i) / 72;
			const xi: Point = [Math.cos(t), Math.sin(t)];
			const d = displacement(table, xi);
			const p = at(c, R, [xi[0] + DRAWN * d[0], xi[1] + DRAWN * d[1]]);
			return `${i === 0 ? 'M' : 'L'}${f2(p.x)},${f2(p.y)}`;
		}).join('');
		return { balls, outline, ball };
	}

	/** Two thin lines through a centre: the stretch axis at `a` and the squeeze axis across it. */
	function axesOf(a: number | undefined, c: { x: number; y: number }, R: number) {
		if (a === undefined) return [];
		return [
			{ k: 'stretch', a },
			{ k: 'squeeze', a: a + Math.PI / 2 }
		].map(({ k, a }) => {
			const e = { x: Math.cos(a) * R, y: -Math.sin(a) * R };
			return {
				k,
				d: `M${f2(c.x - e.x)},${f2(c.y - e.y)}L${f2(c.x + e.x)},${f2(c.y + e.y)}`
			};
		});
	}

	const centreE = $derived({ x: box.cx, y: box.cy });
	const centreB = $derived({ x: box.bx, y: box.by });
	const ringE = $derived(ringOf(h, centreE, box.R));
	const ringB = $derived(ringOf(hB, centreB, box.bR));
	const linesE = $derived(axesOf(axisE, centreE, 1.14 * box.R));
	const linesB = $derived(axesOf(axisB, centreB, 1.18 * box.bR));

	/**
	 * The L of arms: each from the centre along its own direction to its new length, with its rest length ticked and
	 * its change coloured.
	 */
	const armsDrawn = $derived.by(() => {
		const axes = armAxes(arms);
		const changes = armChanges(h, arms);
		return axes.map((e, i) => {
			const rest: Point = [ARM * e[0], ARM * e[1]];
			const r = at(centreE, box.R, rest);
			// a tick across the arm at its rest length
			const n = { x: -e[1] * 6 * u, y: -e[0] * 6 * u };
			// the end at the arm's new length, ½ h′_aa L longer; its sideways drift, which changes the length only at
			// second order, is left out
			const along = ARM + DRAWN * ARM * changes[i];
			const end = at(centreE, box.R, [along * e[0], along * e[1]]);
			const c = end;
			// the name beyond whichever is farther, the end or its rest length
			const out = Math.max(ARM, along) + 0.24;
			const label = at(centreE, box.R, [out * e[0], out * e[1]]);
			return {
				i,
				end,
				line: `M${f2(centreE.x)},${f2(centreE.y)}L${f2(end.x)},${f2(end.y)}`,
				tick: `M${f2(r.x - n.x)},${f2(r.y - n.y)}L${f2(r.x + n.x)},${f2(r.y + n.y)}`,
				change: `M${f2(r.x)},${f2(r.y)}L${f2(c.x)},${f2(c.y)}`,
				k: sense(changes[i]),
				label
			};
		});
	});

	/** A small pair of arrows e₁ and e₂, below the ring on a wide screen and at the top right on a phone. */
	const axesGlyph = $derived.by(() => {
		const l = 22 * u;
		const o = phone.current ? { x: box.W - 46, y: 52 } : { x: 26 * u, y: box.cy + 1.4 * box.R };
		const arrows = [arrow(o, { x: l, y: 0 }), arrow(o, { x: 0, y: -l })].filter(
			(a) => a !== undefined
		);
		return { o, l, arrows };
	});

	/** The six gyroscope pairs: each gyroscope at its place, with an arrow along its turning relative to the centre. */
	const gyros = $derived(
		GYRO_PAIRS.flat().map((xi, i) => {
			const p = at(centreB, box.bR, xi);
			const w = gyroTurn(B, xi);
			return {
				i,
				p,
				a: arrow(p, { x: GYRO * box.bR * w[0], y: -GYRO * box.bR * w[1] }, 7.5 * u)
			};
		})
	);
	const pairLines = $derived(
		GYRO_PAIRS.map(([a, b]) => {
			const p = at(centreB, box.bR, a);
			const q = at(centreB, box.bR, b);
			return `M${f2(p.x)},${f2(p.y)}L${f2(q.x)},${f2(q.y)}`;
		})
	);

	/** The arc from 𝓔's stretch axis to 𝓑's, 45° anticlockwise, and its label. */
	const turnArc = $derived.by(() => {
		if (axisE === undefined || mode !== 'ring') return undefined;
		const r = 0.52 * box.bR;
		const p = (a: number, rr = r) => ({
			x: centreB.x + rr * Math.cos(a),
			y: centreB.y - rr * Math.sin(a)
		});
		const a0 = axisE;
		const a1 = axisE + Math.PI / 4;
		const s = p(a0);
		const e = p(a1);
		const ref = p(a0, 1.18 * box.bR);
		const mid = p((a0 + a1) / 2, r + 12 * u);
		return {
			ref: `M${f2(2 * centreB.x - ref.x)},${f2(2 * centreB.y - ref.y)}L${f2(ref.x)},${f2(ref.y)}`,
			d: `M${f2(s.x)},${f2(s.y)}A${f2(r)},${f2(r)} 0 0 0 ${f2(e.x)},${f2(e.y)}`,
			head: arrow(p(a1 - 0.18), { x: e.x - p(a1 - 0.18).x, y: e.y - p(a1 - 0.18).y }, 0),
			label: mid
		};
	});

	// --- the words --------------------------------------------------------------------------------------------------
	const kindLines = $derived.by((): string[] => {
		switch (kind) {
			case 'none':
				return ['no wave: nothing moves'];
			case 'plus':
				return ['a plus wave: stretched along', 'e₁ and e₂ by turns'];
			case 'cross':
				return ['a cross wave: stretched along', 'the diagonals by turns'];
			case 'linear':
				return ['linear: the pattern pulses', 'along fixed axes'];
			case 'circular':
				return ['circular: the pattern turns', 'anticlockwise at ω/2'];
			case 'circular-back':
				return ['circular: the pattern turns', 'clockwise at ω/2'];
			case 'elliptical':
				return ['elliptical: it turns', 'anticlockwise, swelling'];
			case 'elliptical-back':
				return ['elliptical: it turns', 'clockwise, swelling'];
		}
	});

	const phaseDeg = $derived(Math.round((phase * 180) / Math.PI) % 360);

	/** The words beside the ring, on a wide screen to its right, on a phone under it. */
	const words = $derived.by(() => {
		const out: { text: string; cls: string; x: number; y: number }[] = [];
		const lines: { text: string; cls: string }[] = [
			{ text: `ωt = ${phaseDeg}°`, cls: 'label' },
			...kindLines.map((text) => ({ text, cls: 'small' })),
			{
				text: axisE === undefined ? 'no stretch now' : `stretch axis at ${degrees(axisE)} from e₁`,
				cls: 'small dim'
			},
			{ text: `arms read ${signed2(reading)} h`, cls: 'small dim' }
		];
		if (phone.current) {
			const y0 = box.cy + 1.62 * box.R;
			lines.forEach((l, i) => out.push({ ...l, x: 12, y: y0 + 15 * i + (i > 0 ? 4 : 0) }));
			return out;
		}
		let y = 40;
		for (const l of lines) {
			out.push({ ...l, x: 412, y });
			y += l.cls === 'label' ? 21 : 15;
		}
		return out;
	});

	const description = $derived(
		`A ring of 12 free balls in a gravitational wave travelling toward you, its undisturbed circle dashed. ` +
			(kind === 'none'
				? 'There is no wave, and nothing moves. '
				: `Amplitudes h₊ = ${setting(plus)} and h× = ${setting(cross)}, h× ${lag}° behind h₊: ${kindLines.join(' ')}. Each ball moves by half the strain times its distance from the centre, drawn ${two(EXAGGERATION)} times LIGO’s waves. `) +
			`Two arms through the centre at ${arms}° from e₁ read the difference of their changes over their length, up to ${peak.toFixed(2)} h over a period. ` +
			(showB
				? mode === 'ring'
					? 'The magnetic part is drawn as a second ring, the same pattern turned 45° anticlockwise. '
					: 'The magnetic part is drawn as six gyroscope pairs on a ring, each with an arrow along its turning relative to the centre. '
				: '') +
			`The tide and its magnetic part are equal in size at every moment.`
	);

	const summary = $derived(
		`Arm difference up to ${peak.toFixed(2)} h over a period. ${kindLines.join(' ')}.`
	);

	// --- the formulas -----------------------------------------------------------------------------------------------
	const EC = '\\htmlClass{q-curv}{\\mathcal E}';
	const BC = '\\htmlClass{q-curv}{\\mathcal B}';
	const HP = '\\htmlClass{q-field}{h_+}';
	const HX = '\\htmlClass{q-field}{h_\\times}';
	const HH = (i: string) => `\\htmlClass{q-field}{h}_{${i}}`;
	const HA = (i: string) => `\\htmlClass{q-field}{h'}_{${i}}`;
</script>

<div class="wave-rings">
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
				Set <Tex math={`${HX} = 0`} trust />. Along which directions is the ring stretched, and what
				happens half a period later?
			{:else if step === 2}
				Add <Tex math={HX} trust /> of the same size a quarter period behind. What does the pattern do
				now?
			{:else}
				Turn the arms by 45°. What do they read in the plus wave?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>Along <Tex math="\mathbf e_1" />, and squeezed along <Tex math="\mathbf e_2" />.</strong
				>
				At <Tex math="\omega t = 0" /> the balls on <Tex math="\mathbf e_1" /> have moved out by <Tex
					math={`\\tfrac12${HP}`}
					trust
				/> of the radius and those on <Tex math="\mathbf e_2" /> in by the same, and the arms read <Tex
					math={`+${HP} = +${setting(firstK.plus)}\\,h`}
					trust
				/>. Half a period later <Tex math={HP} trust /> has changed sign: the ring is stretched along
				<Tex math="\mathbf e_2" /> and squeezed along <Tex math="\mathbf e_1" />, and the arms read <Tex
					math={`-${setting(firstK.plus)}\\,h`}
				/>. The pattern pulses along fixed axes and never turns.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>It turns without changing its shape.</strong> With <Tex
					math={`${HP} = A\\cos\\omega t`}
					trust
				/> and <Tex math={`${HX} = A\\sin\\omega t`} trust /> the stretch axis stands at <Tex
					math="\omega t/2"
				/>: it turns anticlockwise, as you see it with the wave coming toward you, at <Tex
					math="\omega/2"
				/>, half the wave’s angular frequency. Half a turn each period brings the pattern back to
				itself, and <Tex math={`|${EC}|`} trust /> stays at <Tex
					math={`${two(Math.SQRT1_2 * secondK.plus)}\\,\\omega^2h`}
				/> throughout. This is circular polarization (chapter 5.4); with <Tex math={HX} trust /> three
				quarters of a period behind it turns clockwise.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>Nothing.</strong> In the arms’ axes the plus pattern has <Tex
					math={`${HA('11')} = ${HA('22')} = 0`}
					trust
				/>: each end moves across its arm, not along it, so <Tex
					math={`\\tfrac12(${HA('11')} - ${HA('22')}) = ${HP}\\cos 90^\\circ = 0`}
					trust
				/>. The arms now read <Tex math={HX} trust />: add some and the reading follows it, since <Tex
					math={`${HP}\\cos2\\psi + ${HX}\\sin2\\psi = ${HX}`}
					trust
				/> at <Tex math="\psi = 45^\circ" />.
			{:else if step === 1}
				The answer appears once <Tex math={`${HX} = 0`} trust /> with <Tex math={HP} trust /> on, and
				you have watched half a period.
			{:else if step === 2}
				The answer appears once <Tex math={HX} trust /> equals <Tex math={HP} trust />, 90° behind,
				and you have watched a quarter period.
			{:else}
				The answer appears once the arms are at 45° in a plus wave, with <Tex
					math={`${HX} = 0`}
					trust
				/>.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<!-- the direction of travel -->
			<g class="toward" aria-hidden="true">
				<circle cx={f2(16 * u)} cy={f2(18 * u)} r={f2(6.5 * u)} />
				<circle class="dot-in" cx={f2(16 * u)} cy={f2(18 * u)} r={f2(1.8 * u)} />
			</g>
			<text class="small dim start-anchor" x={f2(28 * u)} y={f2(22 * u)}>wave toward you</text>

			<!-- the principal axes of the strain -->
			{#each linesE as l (l.k)}
				<path class={['axis', l.k]} d={l.d} />
			{/each}

			<!-- the ring as it was, and as it is -->
			<circle class="start" cx={box.cx} cy={box.cy} r={box.R} />
			<path class="outline" d={ringE.outline} />

			<!-- the L of arms -->
			{#each armsDrawn as a (a.i)}
				<path class="arm" d={a.line} />
				<path class="rest" d={a.tick} />
				<path class={['change', a.k]} d={a.change} />
				<rect
					class="mirror"
					x={f2(a.end.x - 3.6 * u)}
					y={f2(a.end.y - 3.6 * u)}
					width={f2(7.2 * u)}
					height={f2(7.2 * u)}
				/>
				<text class="tick mid" x={f2(a.label.x)} y={f2(a.label.y + 3.5 * u)}>arm {a.i + 1}</text>
			{/each}
			<circle class="corner" cx={box.cx} cy={box.cy} r={f2(2.4 * u)} />

			<!-- the balls, with their displacements -->
			{#each ringE.balls as b, i (i)}
				{#if b.a}
					<path class={['shaft', b.k]} d={b.a.shaft} />
					<polygon class={['head', b.k]} points={b.a.head} />
				{/if}
				<circle class="ball" cx={f2(b.p.x)} cy={f2(b.p.y)} r={f2(ringE.ball)} />
			{/each}

			<!-- the axes, in a corner, clear of the arms -->
			<g class="frame-axes" aria-hidden="true">
				{#each axesGlyph.arrows as a, i (i)}
					<path class="shaft" d={a.shaft} />
					<polygon class="head" points={a.head} />
				{/each}
			</g>
			<text
				class="tick axis-name start-anchor"
				x={f2(axesGlyph.o.x + axesGlyph.l + 3 * u)}
				y={f2(axesGlyph.o.y + 3.5 * u)}>e₁</text
			>
			<text
				class="tick axis-name mid"
				x={f2(axesGlyph.o.x)}
				y={f2(axesGlyph.o.y - axesGlyph.l - 4 * u)}>e₂</text
			>

			<!-- the words, beside the ring -->
			{#each words as w, i (i)}
				<text class="{w.cls} start-anchor" x={w.x} y={w.y}>{w.text}</text>
			{/each}

			<!-- the magnetic part -->
			{#if showB}
				<g class="magnetic">
					<text class="label curv mid" x={box.bx} y={f2(box.by - 1.3 * box.bR - 10 * u)}
						>{mode === 'ring' ? '𝓑, drawn as a ring' : '𝓑, read by gyroscopes'}</text
					>
					{#if mode === 'ring'}
						{#if turnArc}
							<path class="ref" d={turnArc.ref} />
						{/if}
						{#each linesB as l (l.k)}
							<path class={['b-axis', l.k]} d={l.d} />
						{/each}
						<circle class="start" cx={box.bx} cy={box.by} r={box.bR} />
						<path class="b-outline" d={ringB.outline} />
						{#each ringB.balls as b, i (i)}
							{#if b.a}
								<!-- orange and blue, as in the chapter's diagram: drawn with 𝓔's convention -->
								<path class={['shaft', b.k]} d={b.a.shaft} />
								<polygon class={['head', b.k]} points={b.a.head} />
							{/if}
							<circle class="b-ball" cx={f2(b.p.x)} cy={f2(b.p.y)} r={f2(ringB.ball * 0.85)} />
						{/each}
						{#if turnArc}
							<path class="arc" d={turnArc.d} />
							{#if turnArc.head}
								<polygon class="arc-head" points={turnArc.head.head} />
							{/if}
							<text
								class="tick curv-text mid"
								x={f2(turnArc.label.x)}
								y={f2(turnArc.label.y + 3.5 * u)}>45°</text
							>
						{/if}
					{:else}
						{#each pairLines as d, i (i)}
							<path class="pair-line" {d} />
						{/each}
						<circle class="gyro" cx={box.bx} cy={box.by} r={f2(5.5 * u)} />
						<circle class="axle" cx={box.bx} cy={box.by} r={f2(1.5 * u)} />
						{#each gyros as g (g.i)}
							{#if g.a}
								<path class="b-shaft" d={g.a.shaft} />
								<polygon class="b-head" points={g.a.head} />
							{/if}
							<circle class="gyro" cx={f2(g.p.x)} cy={f2(g.p.y)} r={f2(5.5 * u)} />
							<circle class="axle" cx={f2(g.p.x)} cy={f2(g.p.y)} r={f2(1.5 * u)} />
						{/each}
					{/if}
					<text class="small dim mid" x={box.bx} y={f2(box.by + 1.3 * box.bR + 14 * u)}
						>{mode === 'ring'
							? '𝓔’s pattern turned 45°; it moves no ball'
							: 'arrows: turning relative to the centre'}</text
					>
				</g>
			{:else if !phone.current}
				<text class="small faint mid" x={box.bx} y={box.by}
					>show 𝓑 to draw the magnetic part here</text
				>
			{/if}

			<text
				class="tick start-anchor"
				x={f2(phone.current ? 12 : 12 * u)}
				y={f2(phone.current ? (showB ? box.H - 8 : box.H - 10) : box.H - 12 * u)}
				>displacements drawn {two(EXAGGERATION)} times LIGO’s waves</text
			>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="dot"></span><span>a free ball</span></li>
			<li><span class="swatch start-key"></span><span>the ring as it was</span></li>
			<li>
				<span class="swatch arrow-key"></span><span
					>its displacement: <span class="stretch">out</span>,
					<span class="squeeze">in</span></span
				>
			</li>
			<li>
				<span class="mirror-key"></span><span>an arm’s end, its rest length ticked</span>
			</li>
			{#if showB}
				<li><span class="dot curv-dot"></span><span>the magnetic part 𝓑</span></li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => plus, setPlus, AMPLITUDE)}
				role="presentation"
			>
				<Slider
					id="{uid}-plus"
					label="Plus strain h₊"
					icon={WaveIcon}
					min={AMPLITUDE.min}
					max={AMPLITUDE.max}
					step={AMPLITUDE.step}
					bind:value={() => plus, setPlus}
					readout="amplitude {setting(plus)} h"
					marks={[
						{ at: 0, label: 'off' },
						{ at: 1, label: '1, as the figure opens' }
					]}
					marksHint="the ticks mark off and 1"
				/>
			</div>
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => cross, setCross, AMPLITUDE)}
				role="presentation"
			>
				<Slider
					id="{uid}-cross"
					label="Cross strain h×"
					icon={WaveIcon}
					min={AMPLITUDE.min}
					max={AMPLITUDE.max}
					step={AMPLITUDE.step}
					bind:value={() => cross, setCross}
					readout="amplitude {setting(cross)} h"
					marks={[
						{ at: 0, label: 'off, as the figure opens' },
						{ at: 1, label: '1' }
					]}
					marksHint="the ticks mark off and 1"
				/>
			</div>
			<div class="slot" onkeydowncapture={sliderKeys(() => lag, setLag, LAG)} role="presentation">
				<Slider
					id="{uid}-lag"
					label="h× behind h₊"
					icon={Clock01Icon}
					min={LAG.min}
					max={LAG.max}
					step={LAG.step}
					bind:value={() => lag, setLag}
					readout="{lag}° of phase"
					marks={[
						{ at: 0, label: 'in step' },
						{ at: 90, label: 'a quarter period' },
						{ at: 180, label: 'half a period' },
						{ at: 270, label: 'three quarters' }
					]}
					marksHint="the ticks mark each quarter period"
				/>
			</div>
			<div
				class="slot"
				onkeydowncapture={sliderKeys(() => arms, setArms, ARMS)}
				role="presentation"
			>
				<Slider
					id="{uid}-arms"
					label="Arm angle ψ"
					icon={AngleIcon}
					min={ARMS.min}
					max={ARMS.max}
					step={ARMS.step}
					bind:value={() => arms, setArms}
					readout="{arms}° from e₁"
					marks={[
						{ at: 0, label: 'along e₁ and e₂' },
						{ at: 45, label: '45°, along the diagonals' },
						{ at: 90, label: 'swapped' }
					]}
					marksHint="the ticks mark 0°, 45° and 90°"
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
			<div class="toggle">
				<Toggle icon={MagnetIcon} label="Show 𝓑" bind:checked={showB} />
			</div>
			{#if showB}
				<div class="view">
					<Segmented
						label="Draw the magnetic part"
						bind:value={() => mode, (v: Mode) => (mode = v)}
						options={[
							{ value: 'ring', label: 'Turned ring', icon: CircleIcon },
							{ value: 'gyros', label: 'Gyroscope pairs', icon: Rotate01Icon }
						]}
					/>
				</div>
			{/if}
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
		</div>
		<p class="hint">
			Reach each slider, the play button and the switch with Tab; the arrow keys step the sliders,
			Shift by larger steps. Press a tick under a slider to go to its value.
		</p>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>Arm difference</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\frac{\\Delta L_1 - \\Delta L_2}{L} = \\tfrac12(${HA('11')} - ${HA('22')}) = ${HP}\\cos2\\psi + ${HX}\\sin2\\psi =`}
							trust
						/></span
					><span class="also"
						><span class={['value', sense(reading)]}>{signed2(reading)}</span> h now; up to
						<span class="value plain">{peak.toFixed(2)}</span> h over a period</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Tide and magnetic part</dt>
				<dd>
					<span class="also"
						><Tex math={`|${EC}|`} trust /> = <span class="value plain">{signed2(sizeE)}</span> ω²h,
						<Tex math={`|${BC}|`} trust /> = <span class="value plain">{signed2(sizeB)}</span> ω²h now,
						equal at every moment</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Stretch axes</dt>
				<dd>
					<span class="also"
						>{#if axisE === undefined}none now{:else}the ring’s at
							<span class="value plain">{degrees(axisE)}</span>
							from <Tex math="\mathbf e_1" />; the <Tex math={BC} trust /> ring’s at
							<span class="value plain">{degrees(axisB ?? 0)}</span>, 45° further anticlockwise{/if}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			The wave travels along <Tex math="\hat k = \mathbf e_3" />, toward you, with <Tex
				math={`${HH('ij')} = ${HP}(\\mathbf e_1\\mathbf e_1 - \\mathbf e_2\\mathbf e_2)_{ij} + ${HX}(\\mathbf e_1\\mathbf e_2 + \\mathbf e_2\\mathbf e_1)_{ij}`}
				trust
			/>, <Tex math={`${HP} = A_+\\cos\\omega t`} trust /> and <Tex
				math={`${HX} = A_\\times\\cos(\\omega t - \\varphi)`}
				trust
			/>, <Tex math="\varphi" /> the phase of <Tex math={HX} trust /> behind <Tex
				math={HP}
				trust
			/>. Each ball moves by <Tex math={`\\delta\\xi_i = \\tfrac12${HH('ij')}\\xi_j`} trust />;
			strains are in units of
			<Tex math="h" />, the sliders’ unit, drawn as a strain of {DRAWN}. The arms read the
			difference of their changes over the length of one, the chapter’s LIGO strain, in their own
			axes <Tex math="\mathbf e_1', \mathbf e_2'" /> turned by <Tex math="\psi" />; each arm’s end
			is drawn at its new length, without the sideways drift that changes the length only at second
			order. The tide is <Tex math={`${EC}_{ij} = -\\tfrac12\\partial_t^2${HH('ij')}`} trust /> and the
			magnetic part <Tex math={`${BC}_{ij} = \\epsilon_{ipq}\\hat k_p${EC}_{qj}`} trust />, sizes
			<Tex math={`|${EC}|^2 = ${EC}_{ij}${EC}_{ij}`} trust />. 𝓑 moves no free ball; its ring is
			drawn with 𝓔’s convention, and a gyroscope at <Tex math="\xi" /> turns relative to one at the centre
			with the angular velocity <Tex math={`\\delta\\Omega_i = ${BC}_{ij}\\xi_j/c`} trust /> (chapter
			7.5).
			<span class="stretch">Orange</span>: a ball or an arm moves out, a stretch.
			<span class="squeeze">Blue</span>: it moves in, a squeeze.
		</p>
	</div>
</div>

<style>
	.wave-rings {
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
		background: radial-gradient(circle at 30% 50%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.stage svg {
		display: block;
		width: 100%;
		max-width: 640px;
		height: auto;
		margin: 0 auto;
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
		font-variant-numeric: tabular-nums;
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.tick {
		font-size: calc(10px * var(--u, 1));
		fill: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.axis-name {
		font-style: italic;
		fill: var(--text-dim);
	}

	.mid {
		text-anchor: middle;
	}

	.start-anchor {
		text-anchor: start;
	}

	.dim {
		fill: var(--text-faint);
	}

	.faint {
		fill: var(--text-faint);
		font-style: italic;
	}

	.label.curv,
	.curv-text {
		fill: var(--q-curv);
	}

	.toward circle {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.toward .dot-in {
		fill: var(--text-dim);
		stroke: none;
	}

	.start {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.outline {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.axis {
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.55;
	}

	.axis.stretch {
		stroke: var(--accent);
	}

	.axis.squeeze {
		stroke: var(--accent-2);
	}

	.ball {
		fill: var(--q-obs);
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.5px * var(--u, 1));
		stroke: var(--text-dim);
	}

	.head {
		fill: var(--text-dim);
	}

	.shaft.stretch {
		stroke: var(--accent);
	}

	.head.stretch {
		fill: var(--accent);
	}

	.shaft.squeeze {
		stroke: var(--accent-2);
	}

	.head.squeeze {
		fill: var(--accent-2);
	}

	.arm {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.rest {
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.change {
		fill: none;
		stroke-width: calc(3.2px * var(--u, 1));
		stroke-linecap: butt;
	}

	.change.stretch {
		stroke: var(--accent);
	}

	.change.squeeze {
		stroke: var(--accent-2);
	}

	.change.still {
		stroke: none;
	}

	.mirror {
		fill: var(--q-obs);
		stroke: var(--bg);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.corner {
		fill: var(--text);
	}

	/* the magnetic part, in the curvature colour */
	.b-outline {
		fill: none;
		stroke: color-mix(in srgb, var(--q-curv) 70%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.b-axis {
		stroke: var(--q-curv);
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.6;
	}

	.b-axis.squeeze {
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ref {
		stroke: color-mix(in srgb, var(--accent) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.arc {
		fill: none;
		stroke: var(--q-curv);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.arc-head {
		fill: var(--q-curv);
	}

	.b-ball {
		fill: var(--q-curv);
	}

	.b-shaft {
		fill: none;
		stroke: var(--q-curv);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.b-head {
		fill: var(--q-curv);
	}

	.pair-line {
		stroke: color-mix(in srgb, var(--q-curv) 30%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.gyro {
		fill: var(--bg-raised);
		stroke: var(--q-curv);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.axle {
		fill: var(--q-curv);
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

	.dot {
		flex: none;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--q-obs);
	}

	.curv-dot {
		background: var(--q-curv);
	}

	.mirror-key {
		flex: none;
		width: 0.42rem;
		height: 0.42rem;
		background: var(--q-obs);
	}

	.swatch {
		display: inline-block;
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 2px solid;
	}

	.start-key {
		border-top-style: dashed;
		border-top-width: 1.5px;
		border-color: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.arrow-key {
		border-top-width: 1.5px;
		border-color: var(--accent);
	}

	.legend .stretch,
	.note .stretch {
		color: var(--accent);
	}

	.legend .squeeze,
	.note .squeeze {
		color: var(--accent-2);
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

	.toggle {
		flex: 0 1 10rem;
		min-width: 9rem;
	}

	.view {
		flex: 1 1 16rem;
		min-width: 0;
		max-width: 22rem;
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
		gap: 0.15rem 0.5rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
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
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.value.stretch {
		color: var(--accent);
	}

	.value.squeeze {
		color: var(--accent-2);
	}

	.value.still {
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
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
