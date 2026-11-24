<script lang="ts">
	/**
	 * Chapter 5.1's damped wave: a line of medium from x = 0 to 18 (c = 1, units arbitrary) obeying the chapter's
	 * (n²/c²)(∂²u/∂t² + Γ∂u/∂t) = ∂²u/∂x², with a slab of index n, speed c/n, in its middle third. A source at the
	 * left sends a train to the right; the buttons replace it with one hump, or with a hump from the left and an equal
	 * dip from the right. Everything on the line is integrated step by step by ./damped-wave.ts, and a second line
	 * without the slab is drawn faintly behind, so that the slab's lag shows as a shift of the crests. The dashed
	 * envelope is the exact steady train. Two predictions at the top are answered once the reader has done what they
	 * ask; the two opposite pulses are held at the moment they meet. Under reduced motion the line waits for the play
	 * button.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowLeftRightIcon,
		DistributionIcon,
		PauseIcon,
		PlayIcon,
		PrismIcon,
		SineIcon,
		WaterfallDown01Icon,
		WaveIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DAMPING,
		DT,
		FREQUENCY,
		INDEX,
		LENGTH,
		MIDDLE,
		OPENING,
		RAMP,
		SLAB,
		SPEED,
		THICKNESS,
		WIDTH,
		advanceScene,
		amplitudeLength,
		attenuationLength,
		faceEnergyShare,
		faceReflection,
		lagCycles,
		meeting,
		modulus,
		pulseDelay,
		scene,
		sceneTime,
		send,
		setDamping,
		setFrequency,
		setIndex,
		steady,
		steepest,
		total,
		wavelength,
		weakAmplitudeLength,
		type Scene
	} from './damped-wave';

	const uid = $props.id();

	/** Time units of the line in one second on the screen. */
	const RATE = 4;
	/** The arrows of the velocity are drawn this many time units long: u + ARROW · ∂u/∂t. */
	const ARROW = 0.35;
	/** The top of the u axis. */
	const TOP = 1.5;

	// --- the settings ---------------------------------------------------------------------------------------------
	let omega = $state(OPENING.omega);
	let Gamma = $state(OPENING.Gamma);
	let n = $state(OPENING.n);

	const onStep = (v: number, s: number) => Number((Math.round(v / s) * s).toFixed(6));
	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

	// --- the line: four integrated lines, mutated in place; `frame` says when they have moved ------------------------
	const sim: Scene = scene(OPENING.omega, OPENING.Gamma, OPENING.n);
	let frame = $state(0);
	let mode = $state<Scene['mode']>('train');
	let time = $state(0);
	/** When the line was last cleared and sent anew, on its clock; the time shown counts from it. */
	let sentAt = $state(0);
	/** When the train last changed its frequency, its damping or began, on the line's clock. */
	let changedAt = 0;

	// --- the predictions ------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	/** The frequencies at which a train has filled the line, at the damping now. */
	let filledAt: number[] = [];
	let doubled = $state<{ low: number; high: number; Gamma: number } | undefined>();
	type Meeting = { flat: number; fastest: number; Gamma: number; n: number; time: number };
	let met = $state<Meeting | undefined>();
	/** Whether the two opposite pulses now on the line have been held at their meeting. */
	let held = false;
	const revealed = $derived(step === 1 ? doubled !== undefined : met !== undefined);

	/** How long a train needs to fill the line: the crossing at c and c/n, and the source's swell. */
	const fillTime = () => LENGTH + (n - 1) * THICKNESS + RAMP;

	function noteFilled() {
		if (mode !== 'train' || Gamma <= 0 || doubled) return;
		if (time - changedAt < fillTime()) return;
		if (!filledAt.some((w) => Math.abs(w - omega) < 1e-9)) filledAt = [...filledAt, omega];
		for (const low of filledAt)
			for (const high of filledAt)
				if (Math.abs(high - 2 * low) <= FREQUENCY.step + 1e-9) doubled = { low, high, Gamma };
	}

	// --- the actions ------------------------------------------------------------------------------------------------
	function setOmega(v: number) {
		const next = onStep(clamp(v, FREQUENCY.min, FREQUENCY.max), FREQUENCY.step);
		if (next === omega) return;
		omega = next;
		setFrequency(sim, next);
		changedAt = time;
		frame++;
	}

	function setGamma(v: number) {
		const next = onStep(clamp(v, DAMPING.min, DAMPING.max), DAMPING.step);
		if (next === Gamma) return;
		Gamma = next;
		setDamping(sim, next);
		changedAt = time;
		filledAt = [];
		frame++;
	}

	function setN(v: number) {
		const next = onStep(clamp(v, INDEX.min, INDEX.max), INDEX.step);
		if (next === n) return;
		n = next;
		setIndex(sim, next);
		frame++;
	}

	function sendNew(next: Scene['mode']) {
		send(sim, next, omega);
		mode = next;
		sentAt = time;
		held = false;
		changedAt = time;
		if (!reduced) playing = true;
		frame++;
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let reduced = false;

	function togglePlay() {
		playing = !playing;
	}

	/** The facts of the meeting, read off the line when the two pulses are held there. */
	function readMeeting(): Meeting {
		let flat = 0;
		let fastest = 0;
		const i0 = sim.hump.index(0);
		const i1 = sim.hump.index(LENGTH);
		for (let i = i0; i <= i1; i++) {
			const { u, v } = total(sim, i);
			// the flatness where the two pulses overlap, away from the echoes of the slab's faces
			if (Math.abs(sim.hump.u[i]) > 0.01 && Math.abs(sim.dip.u[i]) > 0.01)
				flat = Math.max(flat, Math.abs(u));
			fastest = Math.max(fastest, Math.abs(v));
		}
		return { flat, fastest, Gamma, n, time };
	}

	/** Moves the line on by a number of steps, stopping at the pulses' meeting the first time it comes. */
	function run(steps: number) {
		if (mode === 'pair' && !held) {
			const meet = Math.round((sentAt + meeting(n)) / DT);
			const now = Math.round(sceneTime(sim) / DT);
			if (now + steps >= meet) {
				advanceScene(sim, Math.max(0, meet - now));
				time = sceneTime(sim);
				held = true;
				playing = false;
				met = readMeeting();
				frame++;
				return;
			}
		}
		advanceScene(sim, steps);
		time = sceneTime(sim);
		noteFilled();
		frame++;
	}

	let checked = false;
	let owed = 0;
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				reduced = true;
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
			owed += (dt * RATE) / DT;
			const steps = Math.floor(owed);
			owed -= steps;
			if (steps > 0) run(steps);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };

	const layout = $derived.by(() => {
		const narrow = phone.current;
		const W = narrow ? 360 : 640;
		const panel: Box = { x: 0, y: 22, w: W, h: narrow ? 220 : 236 };
		const inner: Box = {
			x: panel.x + (narrow ? 26 : 30),
			y: panel.y + 10,
			w: panel.w - (narrow ? 26 : 30) - 10,
			h: panel.h - 20
		};
		const H = panel.y + panel.h + 26;
		return { W, H, panel, inner, stride: narrow ? 4 : 2 };
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (v: number) => v.toFixed(2);
	const X = (x: number) => layout.inner.x + (x / LENGTH) * layout.inner.w;
	const Y = (v: number) =>
		layout.inner.y +
		layout.inner.h / 2 -
		(clamp(v, -1.6 * TOP, 1.6 * TOP) / TOP) * (layout.inner.h / 2);

	// --- the line's curves ------------------------------------------------------------------------------------------
	const first = sim.hump.index(0);
	const last = sim.hump.index(LENGTH);

	function curve(get: (i: number) => number) {
		let d = '';
		const s = layout.stride;
		for (let i = first; i <= last; i += s) {
			d += `${i === first ? 'M' : 'L'}${f2(X(sim.hump.position(i)))},${f2(Y(get(i)))}`;
		}
		return d;
	}

	/** The same, only where both pulses are on the line, as the chapter's figure draws them. */
	function overlap(get: (i: number) => number) {
		let d = '';
		let open = false;
		const s = layout.stride;
		for (let i = first; i <= last; i += s) {
			const both = Math.abs(sim.hump.u[i]) > 0.01 && Math.abs(sim.dip.u[i]) > 0.01;
			if (both) {
				d += `${open ? 'L' : 'M'}${f2(X(sim.hump.position(i)))},${f2(Y(get(i)))}`;
				open = true;
			} else open = false;
		}
		return d;
	}

	const curves = $derived.by(() => {
		void frame;
		void layout;
		const pair = mode === 'pair';
		return {
			line: curve((i) => total(sim, i).u),
			reference: n > 1 ? curve((i) => total(sim, i, true).u) : '',
			hump: pair ? overlap((i) => sim.hump.u[i]) : '',
			dip: pair ? overlap((i) => sim.dip.u[i]) : ''
		};
	});

	/** The shaft and head of an arrow from `from` to `to`, if it is long enough to draw. */
	function arrow(from: { x: number; y: number }, to: { x: number; y: number }, head = 5) {
		const len = Math.hypot(to.x - from.x, to.y - from.y);
		if (len < 4 * u) return undefined;
		const ux = (to.x - from.x) / len;
		const uy = (to.y - from.y) / len;
		const h = Math.min(head * u, 0.45 * len);
		const base = { x: to.x - ux * h, y: to.y - uy * h };
		const w = h / 2.2;
		return {
			shaft: `M${f2(from.x)},${f2(from.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(to.x)},${f2(to.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	/** The velocity of the line, as arrows from it, while pulses are on it. */
	const arrows = $derived.by(() => {
		void frame;
		if (mode === 'train') return [];
		const out: { shaft: string; head: string }[] = [];
		const gap = phone.current ? 0.36 : 0.25;
		for (let x = gap / 2; x < LENGTH; x += gap) {
			const i = sim.hump.index(x);
			const { u: here, v } = total(sim, i);
			if (Math.abs(v) < 0.06) continue;
			const a = arrow({ x: X(x), y: Y(here) }, { x: X(x), y: Y(here + ARROW * v) });
			if (a) out.push(a);
		}
		return out;
	});

	// --- the exact steady train -------------------------------------------------------------------------------------
	const exact = $derived(steady(omega, Gamma, n));
	const envelope = $derived.by(() => {
		if (mode !== 'train') return '';
		let up = '';
		let down = '';
		for (let x = 0; x <= LENGTH + 1e-9; x += 0.05) {
			const a = modulus(exact.at(x));
			up += `${up ? 'L' : 'M'}${f2(X(x))},${f2(Y(a))}`;
			down += `${down ? 'L' : 'M'}${f2(X(x))},${f2(Y(-a))}`;
		}
		return up + down;
	});
	const lengthMark = $derived(
		mode === 'train' && Gamma > 0 && attenuationLength(Gamma) <= LENGTH
			? attenuationLength(Gamma)
			: undefined
	);

	const xTicks = [0, 3, 6, 9, 12, 15, 18];
	const yTicks = [-1, 0, 1];

	// --- the numbers ----------------------------------------------------------------------------------------------
	const lambda = $derived(wavelength(omega));
	const lag = $derived(lagCycles(n, omega));
	const r = $derived(faceReflection(n));
	const lengthTex = (v: number) => (Number.isFinite(v) ? v.toPrecision(3) : '\\infty');

	const waveTex = $derived(
		`\\lambda = 2\\pi c/\\omega = ${lambda.toFixed(2)},\\ \\omega = ${omega.toFixed(2)}`
	);
	const dampingTex = $derived(
		Gamma > 0
			? `c/\\Gamma = ${lengthTex(attenuationLength(Gamma))},\\ \\Gamma = ${Gamma.toFixed(2)},\\ \\Gamma/\\omega = ${(Gamma / omega).toFixed(3)}`
			: `\\Gamma = 0,\\ c/\\Gamma = \\infty`
	);
	const amplitudeTex = $derived(`2c/\\Gamma = ${lengthTex(weakAmplitudeLength(Gamma))}`);
	const exactTex = $derived(`1/\\mathrm{Im}\\,k = ${lengthTex(amplitudeLength(omega, Gamma))}`);
	const lagTex = $derived(`(n - 1)\\,\\omega L/2\\pi c = ${lag.toFixed(3)}\\ \\text{cycles}`);
	const slabTex = $derived(
		`n = ${n.toFixed(2)},\\ L = ${THICKNESS},\\ c/n = ${(SPEED / n).toFixed(3)}`
	);
	const echoTex = $derived(`(1 - n)/(1 + n) = ${r === 0 ? '0' : r.toFixed(3)}`);

	const modeWords = $derived(
		mode === 'train'
			? `a train at ω = ${omega.toFixed(2)}`
			: mode === 'pulse'
				? 'one hump'
				: held && met && Math.abs(time - met.time) < 1e-9
					? 'held where the two pulses meet'
					: 'a hump and an equal dip'
	);

	// the answers' numbers, from the same model
	const facts1 = $derived.by(() => {
		if (!doubled) return undefined;
		return {
			low: doubled.low,
			high: doubled.high,
			weak: weakAmplitudeLength(doubled.Gamma),
			atLow: amplitudeLength(doubled.low, doubled.Gamma),
			atHigh: amplitudeLength(doubled.high, doubled.Gamma),
			energy: attenuationLength(doubled.Gamma),
			crestsLow: weakAmplitudeLength(doubled.Gamma) / wavelength(doubled.low),
			Gamma: doubled.Gamma
		};
	});
	const fastestIdeal = 2 * SPEED * steepest();
	/** Why the meeting is not quite flat, with the slab or the damping. */
	const caveat = $derived.by(() => {
		if (!met || (met.Gamma === 0 && met.n === 1)) return '';
		const why = [
			met.n > 1 ? 'each face has sent back a fifth or less of each pulse' : '',
			met.Gamma > 0
				? `the damping has shrunk each pulse to ${Math.exp((-met.Gamma * meeting(met.n)) / 2).toFixed(2)} of its height and left a low wake behind it`
				: ''
		].filter(Boolean);
		const what = [met.Gamma > 0 ? 'damping' : '', met.n > 1 ? 'the slab' : ''].filter(Boolean);
		return ` With ${what.join(' and ')} the cancellation is not complete: ${why.join(', and ')}.`;
	});

	// --- the words for screen readers ------------------------------------------------------------------------------
	const description = $derived(
		`A line of medium from 0 to 18, with ${n > 1 ? `a slab of index ${n.toFixed(2)} in its middle third` : 'no slab'} and the damping rate ${Gamma.toFixed(2)}. ` +
			(mode === 'train'
				? `A source at the left sends a train of angular frequency ${omega.toFixed(2)} and wavelength ${lambda.toFixed(2)}; its amplitude falls by e in ${Gamma > 0 ? amplitudeLength(omega, Gamma).toFixed(1) : 'an endless distance'}.`
				: mode === 'pulse'
					? 'One hump travels to the right.'
					: 'A hump travels right and an equal dip travels left; arrows show the velocity of the line.') +
			(n > 1
				? ` A faint line shows the same without the slab; past the slab the wave lags it by ${lag.toFixed(2)} cycles.`
				: '')
	);
</script>

<div class="damped-wave">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => (step = s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Double the frequency at fixed damping. Does the wave die out over a shorter distance, a
				longer one, or the same?
			{:else}
				Send two opposite pulses. What is on the line at the moment they meet?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && facts1}
				<strong>The same.</strong> The wavenumber is <Tex
					math={'k = (\\omega/c)\\sqrt{1 + i\\Gamma/\\omega} \\approx \\omega/c + i\\Gamma/2c'}
				/>, so the amplitude falls as <Tex math={'e^{-\\Gamma x/2c}'} /> at every frequency, by
				<Tex math="e" /> in <Tex math={`2c/\\Gamma = ${facts1.weak.toPrecision(3)}`} /> at
				<Tex math={`\\Gamma = ${facts1.Gamma.toFixed(2)}`} />. Exactly, <Tex
					math={'1/\\mathrm{Im}\\,k'}
				/>
				is {facts1.atLow.toPrecision(4)} at <Tex math={`\\omega = ${facts1.low.toFixed(2)}`} /> and {facts1.atHigh.toPrecision(
					4
				)} at <Tex math={`${facts1.high.toFixed(2)}`} />. The energy falls by <Tex math="e" /> in the
				attenuation length <Tex math={`c/\\Gamma = ${facts1.energy.toPrecision(3)}`} />, since
				<Tex math="\alpha = \Gamma/c" /> does not depend on the frequency. Doubling the frequency halves
				the wavelength, so the wave dies over twice as many crests, but over the same distance.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2 && met}
				<strong>A flat line that is moving.</strong> Where the hump <Tex
					math={'u_{\\rm R}(x - ct)'}
				/> and the dip <Tex math={'-u_{\\rm R}(x + ct)'} /> overlap exactly, they cancel, but their velocities
				add to
				<Tex math={"\\dot u = -2c\\,u_{\\rm R}'(x)"} />: the half of the line ahead of the hump,
				where
				<Tex math={'u_{\\rm R}'} /> falls, moves up, and the half behind it moves down, at most
				<Tex math={`2c/w\\sqrt e = ${fastestIdeal.toFixed(2)}`} /> for the width <Tex
					math={`w = ${WIDTH}`}
				/>. Held at the meeting, the line is flat where they overlap{met.flat < 5e-4
					? ', to a thousandth of the pulses’ height or better,'
					: `, to ${met.flat.toFixed(3)},`} and moves at up to {met.fastest.toFixed(2)}.{#if caveat}
					{caveat} Set <Tex math="\Gamma = 0" /> and <Tex math="n = 1" /> for the chapter’s case.{/if}
				Press play: both shapes emerge unchanged.
			{:else if step === 1}
				The answer appears when a train has filled the line at one frequency and then at twice it,
				with the same damping, more than zero.
			{:else}
				The answer appears when you have sent two opposite pulses and they meet; the line is held
				there.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<clipPath id="{uid}-panel">
					<rect
						x={layout.panel.x + 1}
						y={layout.panel.y + 1}
						width={layout.panel.w - 2}
						height={layout.panel.h - 2}
						rx="7"
					/>
				</clipPath>
			</defs>

			<text class="title" x="4" y={layout.panel.y - 8 * u}
				>The line, <tspan class="it">t</tspan> = {(time - sentAt).toFixed(1)}</text
			>
			<text class="title end" x={layout.W - 4} y={layout.panel.y - 8 * u}>{modeWords}</text>
			<rect
				class="panel"
				x={layout.panel.x + 0.5}
				y={layout.panel.y + 0.5}
				width={layout.panel.w - 1}
				height={layout.panel.h - 1}
				rx="8"
			/>
			<g clip-path="url(#{uid}-panel)">
				<!-- the slab -->
				<rect
					class={['slab', { empty: n === 1 }]}
					x={X(SLAB.from)}
					y={layout.panel.y}
					width={X(SLAB.to) - X(SLAB.from)}
					height={layout.panel.h}
					style:--depth="{Math.round(5 + 18 * (n - 1))}%"
				/>
				<text
					class="small slab-words"
					x={(X(SLAB.from) + X(SLAB.to)) / 2}
					y={layout.panel.y + 15 * u}
					>{#if n > 1}the slab: <tspan class="it">n</tspan> = {n.toFixed(2)}, speed
						<tspan class="it">c</tspan>/<tspan class="it">n</tspan>{:else}the slab’s place, <tspan
							class="it">n</tspan
						> = 1{/if}</text
				>

				{#each yTicks as v (v)}
					<line
						class={['grid', { axis: v === 0 }]}
						x1={layout.inner.x}
						x2={layout.inner.x + layout.inner.w}
						y1={Y(v)}
						y2={Y(v)}
					/>
				{/each}
				{#each xTicks as x (x)}
					<line
						class="grid"
						x1={X(x)}
						x2={X(x)}
						y1={layout.inner.y}
						y2={layout.inner.y + layout.inner.h}
					/>
				{/each}

				{#if lengthMark !== undefined}
					<line
						class="mark"
						x1={X(lengthMark)}
						x2={X(lengthMark)}
						y1={layout.inner.y}
						y2={layout.inner.y + layout.inner.h}
					/>
					<text
						class="small mark-words halo"
						x={X(lengthMark) + 4 * u}
						y={layout.inner.y + layout.inner.h - 4 * u}
						><tspan class="it">c</tspan>/<tspan class="it">Γ</tspan></text
					>
				{/if}

				{#if envelope}
					<path class="envelope" d={envelope} />
				{/if}
				{#if curves.reference}
					<path class="reference" d={curves.reference} />
				{/if}
				{#if curves.hump}
					<path class="part hump" d={curves.hump} />
				{/if}
				{#if curves.dip}
					<path class="part dip" d={curves.dip} />
				{/if}
				<path class={['wave', { pair: mode === 'pair' }]} d={curves.line} />
				{#each arrows as a, i (i)}
					<path class="shaft" d={a.shaft} />
					<path class="head" d={a.head} />
				{/each}

				{#if mode === 'train'}
					<circle class="source" cx={X(0)} cy={Y(0)} r={4 * u} />
					<text class="small source-words halo" x={X(0) + 7 * u} y={Y(0) + 15 * u}>source</text>
				{/if}
			</g>

			{#each yTicks as v (v)}
				<text class="small y-tick" x={layout.inner.x - 5 * u} y={Y(v)}
					>{v < 0 ? '−' : ''}{Math.abs(v)}</text
				>
			{/each}
			<text class="small dim y-tick" x={layout.inner.x - 5 * u} y={layout.inner.y + 4 * u}
				><tspan class="it">u</tspan></text
			>
			{#each xTicks as x (x)}
				<text
					class={['small', x === LENGTH ? 'end' : 'tick']}
					x={X(x) + (x === LENGTH ? 4 * u : 0)}
					y={layout.panel.y + layout.panel.h + 15 * u}
					>{#if x === LENGTH}<tspan class="it">x</tspan> = {x}{:else}{x}{/if}</text
				>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			{#if mode === 'pair'}
				<li><span class="swatch line-key pair-key"></span>the line, the sum</li>
				<li><span class="swatch hump-key"></span>the hump moving right</li>
				<li><span class="swatch dip-key"></span>the dip moving left</li>
			{:else}
				<li><span class="swatch line-key"></span>the line</li>
			{/if}
			{#if n > 1}
				<li><span class="swatch reference-key"></span>the same without the slab</li>
			{/if}
			{#if mode === 'train'}
				<li><span class="swatch envelope-key"></span>the steady train’s envelope, exact</li>
			{:else}
				<li><span class="swatch arrow-key"></span>the line’s velocity</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="time">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Pause' : 'Play'}
				aria-pressed={playing}
				onclick={togglePlay}
			>
				<!-- one icon each: the icon component draws the icon it is first given -->
				{#if playing}
					<HugeiconsIcon icon={PauseIcon} size={16} strokeWidth={1.8} />
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.8} />
				{/if}
			</button>
			<button
				type="button"
				class="action"
				aria-pressed={mode === 'train'}
				onclick={() => sendNew('train')}
			>
				<HugeiconsIcon icon={SineIcon} size={16} strokeWidth={1.7} />
				Send a train
			</button>
			<button
				type="button"
				class="action"
				aria-pressed={mode === 'pulse'}
				onclick={() => sendNew('pulse')}
			>
				<HugeiconsIcon icon={DistributionIcon} size={16} strokeWidth={1.7} />
				Send a pulse
			</button>
			<button
				type="button"
				class="action"
				aria-pressed={mode === 'pair'}
				onclick={() => sendNew('pair')}
			>
				<HugeiconsIcon icon={ArrowLeftRightIcon} size={16} strokeWidth={1.7} />
				Send two opposite pulses
			</button>
			<p class="hint">
				Each button clears the line and sends anew. The sliders take the arrow keys after Tab.
			</p>
		</div>
		<div class="sliders">
			<Slider
				id="{uid}-frequency"
				label="Frequency"
				icon={WaveIcon}
				min={FREQUENCY.min}
				max={FREQUENCY.max}
				step={FREQUENCY.step}
				bind:value={() => omega, setOmega}
				readout="ω = {omega.toFixed(2)}"
				mark={{ at: OPENING.omega, label: 'where it opens' }}
			/>
			<Slider
				id="{uid}-damping"
				label="Damping"
				icon={WaterfallDown01Icon}
				min={DAMPING.min}
				max={DAMPING.max}
				step={DAMPING.step}
				bind:value={() => Gamma, setGamma}
				readout="Γ = {Gamma.toFixed(2)}"
				ends={['none', '0.2 of the top ω']}
			/>
			<Slider
				id="{uid}-index"
				label="Slab’s index"
				icon={PrismIcon}
				min={INDEX.min}
				max={INDEX.max}
				step={INDEX.step}
				bind:value={() => n, setN}
				readout="n = {n.toFixed(2)}"
				ends={['1, no slab', '1.5']}
			/>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The wave</dt>
				<dd>
					<Tex math={waveTex} /><span class="also"
						>with <Tex math="c = 1" />; inside the slab the crests are <Tex math="n" /> times closer,
						<Tex math={`\\lambda/n = ${(lambda / n).toFixed(2)}`} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The damping</dt>
				<dd>
					<Tex math={dampingTex} /><span class="also"
						>{#if Gamma > 0}the energy falls by <Tex math="e" /> over the attenuation length
							<Tex math="c/\Gamma" />, and the amplitude over <Tex math={amplitudeTex} />; exactly,
							at this frequency, <Tex math={exactTex} />{:else}without damping the wave goes on for
							ever{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The slab</dt>
				<dd>
					<Tex math={slabTex} /><span class="also"
						>{#if n > 1}past the slab the crests lag the faint line by <Tex math={lagTex} />, a
							pulse by
							<Tex math={`(n - 1)L/c = ${pulseDelay(n).toFixed(2)}`} />; the exact train, with the
							echoes between the faces, lags {exact.lag.toFixed(3)} cycles{:else}with <Tex
								math="n = 1"
							/> the middle third is the same medium as the rest{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The faces</dt>
				<dd>
					<Tex math={echoTex} /><span class="also"
						>{#if n > 1}of the amplitude comes back from each face, {(
								100 * faceEnergyShare(n)
							).toFixed(1)}% of the energy; it ripples the train before the slab{:else}nothing comes
							back{/if}</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Units are arbitrary, with <Tex math="c = 1" /> outside the slab: the line is 18 long, the slab 6
			thick and the pulses <Tex math={`w = ${WIDTH}`} /> wide. Everything on the line is integrated step
			by step from the chapter’s damped wave equation, <Tex
				math="(n^2/c^2)(\partial_t^2u + \Gamma\,\partial_tu) = \partial_x^2u"
			/>, by leapfrog on a grid of 0.01, and the faint line is a second line without the slab. The
			ends absorb what reaches them and send back less than 0.1%. The slab’s faces do reflect. A
			damped pulse leaves a low wake behind it, as the damped equation requires. The dashed envelope
			is the exact steady train. The arrows’ scale is chosen for the drawing. The line runs at {RATE}
			units of time a second, and the two opposite pulses meet at <Tex
				math={`t = 8.5 + 3n = ${meeting(n).toFixed(2)}`}
			/>, in the middle,
			<Tex math={`x = ${MIDDLE}`} />.
		</p>
	</div>
</div>

<style>
	.damped-wave {
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
	.play:focus-visible,
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

	.dim {
		fill: var(--text-faint);
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

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
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

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	/* the slab: shaded more deeply the larger its index */
	.slab {
		fill: color-mix(in srgb, var(--accent-2) var(--depth), transparent);
		stroke: color-mix(in srgb, var(--accent-2) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.slab.empty {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.slab-words {
		text-anchor: middle;
		fill: var(--text-dim);
	}

	.mark {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.mark-words {
		fill: var(--text);
	}

	.envelope {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 70%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.reference {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-linejoin: round;
	}

	.wave {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.wave.pair {
		stroke: var(--text);
	}

	.part {
		fill: none;
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.part.hump {
		stroke: var(--accent);
	}

	.part.dip {
		stroke: var(--accent-2);
	}

	.shaft {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.source {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.source-words {
		fill: var(--text);
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
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.line-key {
		border-color: var(--accent);
		border-top-width: 2px;
	}

	.line-key.pair-key {
		border-color: var(--text);
	}

	.hump-key {
		border-top-style: dashed;
		border-color: var(--accent);
	}

	.dip-key {
		border-top-style: dashed;
		border-color: var(--accent-2);
	}

	.reference-key {
		border-color: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.envelope-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: color-mix(in srgb, var(--accent) 80%, transparent);
	}

	.arrow-key {
		width: 0;
		height: 0.8rem;
		border-top: 0;
		border-left: 1.5px solid color-mix(in srgb, var(--text) 70%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
	}

	.play,
	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.2rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.play {
		width: 2.2rem;
		padding: 0;
	}

	.action {
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		white-space: nowrap;
	}

	.action[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--accent) 60%, transparent);
		background: color-mix(in srgb, var(--accent) 10%, var(--bg));
	}

	.play :global(svg),
	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.play:hover,
		.action:hover {
			border-color: var(--accent);
		}
	}

	.hint {
		flex: 1 1 14rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: stretch;
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

	@media (max-width: 760px) {
		.sliders {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.hint {
			flex: 1 1 100%;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.action {
			transition: none;
		}
	}
</style>
