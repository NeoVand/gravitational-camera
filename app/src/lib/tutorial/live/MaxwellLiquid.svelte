<script lang="ts">
	/**
	 * Chapter 4.4's Maxwell liquid: the friction Re η(ω) = η₀/(1 + ω²τ²) of one liquid, τ = η₀/μ∞, on log–log axes
	 * (ω from 10⁴ to 10¹⁶ s⁻¹, Re η from 10⁻¹⁸ to 10⁴ Pa s), with its plateau η₀ and its tail μ∞²/η₀ω² as thin dashed
	 * lines, the paper's placeholder of 10⁻³ Pa s dotted, and the band of the thermal glow at the temperature T shaded
	 * where the Planck radiance x³/(eˣ − 1), x = ħω/k_BT, is above a tenth of its peak, with its peak ticked. Three
	 * sliders on scales of powers of ten set η₀, μ∞ and T; three presets set water's placeholder, honey and copper's
	 * electrons. The readouts give τ, the friction at the glow's peak and the weight (2/π)∫Re η dω, by quadrature. The
	 * numbers come from ./maxwell-liquid.ts. Two predictions at the top are answered once the reader has done what
	 * they ask. Nothing moves by itself, so reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Atom01Icon,
		CubeIcon,
		DropletIcon,
		FireIcon,
		HoneyIcon,
		SpoonIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BAND_X,
		ETA0,
		ETA_AXIS,
		MU,
		NEAR_CEILING,
		OMEGA_AXIS,
		OPENING,
		PEAK_X,
		PLACEHOLDER,
		PRESETS,
		PRESET_ORDER,
		ROOM,
		TEMPERATURE,
		THOUSANDFOLD,
		ceiling,
		curve,
		etaTicks,
		friction,
		glow,
		gpa,
		near,
		numberTex,
		numberText,
		omegaTicks,
		presetOf,
		relaxationTime,
		shareOfCeiling,
		tail,
		terahertz,
		timeWords,
		weight,
		type PresetName
	} from './maxwell-liquid';

	const uid = $props.id();

	// --- the liquid and the temperature ----------------------------------------------------------------------------
	let eta0 = $state(OPENING.eta0);
	let mu = $state(OPENING.mu);
	let T = $state(OPENING.T);

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	/** A slider's value, kept on its steps but for the values a preset or a tick sets exactly. */
	const onStep = (v: number, s: number) => Number((Math.round(v / s) * s).toFixed(6));

	function setEta(log: number) {
		eta0 = 10 ** clamp(log, ETA0.low, ETA0.high);
		note();
	}

	function setMu(log: number) {
		mu = 10 ** clamp(log, MU.low, MU.high);
		note();
	}

	function setT(log: number) {
		T = 10 ** clamp(log, TEMPERATURE.low, TEMPERATURE.high);
		note();
	}

	function choose(p: PresetName) {
		eta0 = PRESETS[p].eta0;
		mu = PRESETS[p].mu;
		note();
	}

	/** The page keys move a slider by its larger step. */
	function pageKeys(get: () => number, set: (v: number) => void, s: number, page: number) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
			e.preventDefault();
			set(onStep(get() + (e.key === 'PageUp' ? page : -page), s));
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let thicker = $state(false);
	let best = $state(false);
	const revealed = $derived(step === 1 ? thicker : best);

	function note() {
		if (step === 1 && near(eta0, THOUSANDFOLD.eta0) && near(mu, THOUSANDFOLD.mu)) thicker = true;
		if (
			step === 2 &&
			near(mu, PRESETS.copper.mu) &&
			shareOfCeiling(glow(T).peak, eta0, mu) >= NEAR_CEILING
		)
			best = true;
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const tau = $derived(relaxationTime(eta0, mu));
	const band = $derived(glow(T));
	const atPeak = $derived(friction(band.peak, eta0, mu));
	const wt = $derived(band.peak * tau);
	const area = $derived(weight(eta0, mu));
	const preset = $derived(presetOf({ eta0, mu }));
	const tRound = $derived(Math.round(T));

	// the answers' numbers, from the same model, at the temperature shown
	const honeyAt = $derived(friction(band.peak, OPENING.eta0, OPENING.mu));
	const thickAt = $derived(friction(band.peak, THOUSANDFOLD.eta0, THOUSANDFOLD.mu));
	const copperTop = $derived(ceiling(band.peak, PRESETS.copper.mu));
	const copperOwn = $derived(shareOfCeiling(band.peak, PRESETS.copper.eta0, PRESETS.copper.mu));
	const copperWt = $derived(band.peak * relaxationTime(PRESETS.copper.eta0, PRESETS.copper.mu));

	// --- the symbols, in the colour of matter -------------------------------------------------------------------------
	const E0 = '\\htmlClass{q-matter}{\\eta_0}';
	const MUI = '\\htmlClass{q-matter}{\\mu_\\infty}';
	const RE = '\\mathrm{Re}\\,\\htmlClass{q-matter}{\\eta}';
	const PAS = '\\,\\mathrm{Pa\\,s}';
	const PER_S = '\\,\\mathrm{s^{-1}}';

	const liquidTex = $derived(
		`${E0} = ${numberTex(eta0)}${PAS},\\quad ${MUI} = ${gpa(mu)}\\,\\mathrm{GPa}`
	);
	const tauTex = $derived(
		`\\tau = ${E0}/${MUI} = ${timeWords(tau).tex},\\quad 1/\\tau = ${numberTex(1 / tau)}${PER_S}`
	);
	const glowTex = $derived(
		`\\omega = ${numberTex(band.low, 3)}\\text{ to }${numberTex(band.high, 3)}${PER_S}`
	);
	const peakTex = $derived(`${RE} = ${numberTex(atPeak)}${PAS}`);
	const areaTex = $derived(
		`\\tfrac{2}{\\pi}\\int_0^\\infty ${RE}\\,\\mathrm{d}\\omega = ${(area / 1e9).toPrecision(3)}\\,\\mathrm{GPa} = ${MUI}`
	);

	/** Where the glow's peak lies on the curve, in words. */
	const regime = $derived.by(() => {
		if (wt < 0.1) return 'plateau';
		if (wt > 10) return 'tail';
		return 'corner';
	});
	/** ωτ as the chapter prints it: "2.7", "108", "1.1 \\times 10^{6}". */
	const wtTex = $derived(wt >= 10 && wt < 1000 ? String(Math.round(wt)) : numberTex(wt));
	const belowPlaceholder = $derived(PLACEHOLDER / atPeak);

	// --- the drawing ---------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, H: 380, L: 42, R: 350, T: 30, B: 338 }
			: { W: 680, H: 388, L: 48, R: 668, T: 30, B: 346 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const X = (lw: number) =>
		box.L + ((lw - OMEGA_AXIS.low) / (OMEGA_AXIS.high - OMEGA_AXIS.low)) * (box.R - box.L);
	const Y = (le: number) =>
		box.B - ((le - ETA_AXIS.low) / (ETA_AXIS.high - ETA_AXIS.low)) * (box.B - box.T);
	const at = (omega: number, eta: number): [number, number] => [
		X(Math.log10(omega)),
		Y(Math.log10(eta))
	];

	const points = $derived(
		curve((w) => friction(w, eta0, mu)).map(([lw, le]) => [X(lw), Y(le)] as [number, number])
	);
	const curvePath = $derived(
		points.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join('')
	);

	/** The plateau, across the whole axis. */
	const plateau = $derived<[number, number][]>([
		[box.L, Y(Math.log10(eta0))],
		[box.R, Y(Math.log10(eta0))]
	]);
	/** The tail, from three quarters of a power of ten before the corner ω = 1/τ to the axis's end. */
	const tailLine = $derived.by<[number, number][]>(() => {
		const from = 10 ** Math.max(OMEGA_AXIS.low, Math.log10(1 / tau) - 0.75);
		const to = 10 ** OMEGA_AXIS.high;
		return [at(from, tail(from, eta0, mu)), at(to, tail(to, eta0, mu))];
	});
	const line = (p: [number, number][]) =>
		p.map(([x, y], i) => `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`).join('');
	const placeholderY = Y(Math.log10(PLACEHOLDER));

	const bandBox = $derived({ x0: X(Math.log10(band.low)), x1: X(Math.log10(band.high)) });
	const peakX = $derived(X(Math.log10(band.peak)));
	const dot = $derived(at(band.peak, atPeak));
	const dotShown = $derived(dot[1] <= box.B + 0.5);

	// --- the words in the drawing, placed where they touch no line, no band and no other words ----------------------------
	type Rect = { x0: number; y0: number; x1: number; y1: number };
	type Placed = { x: number; y: number; anchor: 'start' | 'end' };

	/** Whether a polyline passes through a rectangle, tested every unit along it. */
	function crosses(r: Rect, p: [number, number][]) {
		for (let i = 1; i < p.length; i++) {
			const [ax, ay] = p[i - 1];
			const [bx, by] = p[i];
			const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
			for (let k = 0; k <= n; k++) {
				const x = ax + ((bx - ax) * k) / n;
				const y = ay + ((by - ay) * k) / n;
				if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return true;
			}
		}
		return false;
	}

	const labels = $derived.by(() => {
		const em = 11 * u;
		const pad = 2 * u;
		const taken: Rect[] = [];
		const lines = [
			points,
			plateau,
			tailLine,
			[
				[box.L, placeholderY],
				[box.R, placeholderY]
			]
		] as [number, number][][];
		const rectOf = (c: Placed, width: number): Rect => {
			const w = width * em;
			const x0 = c.anchor === 'start' ? c.x : c.x - w;
			return {
				x0: x0 - pad,
				y0: c.y - 0.78 * em - pad,
				x1: x0 + w + pad,
				y1: c.y + 0.32 * em + pad
			};
		};
		const free = (r: Rect) =>
			r.x0 >= box.L + 2 &&
			r.x1 <= box.R - 2 &&
			r.y0 >= box.T + 0.5 &&
			r.y1 <= box.B - 2 &&
			(r.x1 < bandBox.x0 || r.x0 > bandBox.x1) &&
			!taken.some((t) => r.x0 < t.x1 && r.x1 > t.x0 && r.y0 < t.y1 && r.y1 > t.y0) &&
			!lines.some((l) => crosses(r, l));
		const place = (candidates: Placed[], width: number) => {
			for (const c of candidates) {
				const r = rectOf(c, width);
				if (free(r)) {
					taken.push(r);
					return c;
				}
			}
			return undefined;
		};

		const gap = 5 * u;
		/** The baselines that put a label's box just clear of a horizontal line at y, above it or below it. */
		const above = (y: number) => y - 1.5 * u - pad - 0.32 * em;
		const below = (y: number) => y + 1.5 * u + pad + 0.78 * em;
		const yP = placeholderY;
		const placeholder = place(
			[
				{ x: box.R - gap, y: above(yP), anchor: 'end' },
				{ x: box.R - gap, y: below(yP), anchor: 'end' },
				{ x: box.L + gap, y: above(yP), anchor: 'start' },
				{ x: box.L + gap, y: below(yP), anchor: 'start' },
				...[0.3, 0.45, 0.6].flatMap((f) => [
					{ x: box.L + f * (box.R - box.L), y: above(yP), anchor: 'start' as const },
					{ x: box.L + f * (box.R - box.L), y: below(yP), anchor: 'start' as const }
				])
			],
			5.6
		);

		const yE = Y(Math.log10(eta0));
		const corner = X(-Math.log10(tau));
		const plateauLabel = place(
			[
				...[1.5, 2.5, 1, 3.5, 0.6].map((d) => ({
					x: corner + d * ((box.R - box.L) / 12),
					y: above(yE),
					anchor: 'start' as const
				})),
				{ x: box.L + gap, y: above(yE), anchor: 'start' },
				{ x: box.L + gap, y: below(yE), anchor: 'start' },
				...[0.25, 0.45].map((f) => ({
					x: box.L + f * (box.R - box.L),
					y: above(yE),
					anchor: 'start' as const
				})),
				...[3.5, 2.5, 1.5].map((d) => ({
					x: corner + d * ((box.R - box.L) / 12),
					y: below(yE),
					anchor: 'start' as const
				}))
			],
			4.9
		);

		const tailCandidates: Placed[] = [];
		// first a power of ten past the corner and on, clear of the plateau's label; then nearer the corner
		const c = -Math.log10(tau);
		const along: number[] = [];
		for (let d = 1.2; c + d <= OMEGA_AXIS.high; d += 0.1) along.push(c + d);
		for (let d = 0.3; d < 1.15; d += 0.1) along.push(c + d);
		for (const lw of along) {
			const [x, y] = at(10 ** lw, tail(10 ** lw, eta0, mu));
			tailCandidates.push({ x: x + 4 * u, y: y - 4 * u - 0.32 * em, anchor: 'start' });
		}
		const tailLabel = place(tailCandidates, 6.6);
		return { placeholder, plateauLabel, tailLabel };
	});

	/** The glow's label over its peak, kept inside the drawing. */
	const glowLabel = $derived.by(() => {
		const w = 6.6 * 12 * u;
		return { x: clamp(peakX, box.L + w / 2, box.R - w / 2) };
	});

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const description = $derived(
		`The friction Re eta against the angular frequency omega, both on scales of powers of ten, for a Maxwell liquid with eta zero = ${numberText(eta0)} pascal seconds and mu infinity = ${gpa(mu)} gigapascals: flat at eta zero up to omega = 1 over tau = ${numberText(1 / tau)} per second, then falling as one over omega squared. ` +
			`The glow at ${tRound} kelvin is shaded from ${numberText(band.low)} to ${numberText(band.high)} per second, its peak at ${numberText(band.peak, 3)}, where the friction is ${numberText(atPeak)} pascal seconds. The placeholder, 10 to the minus 3 pascal seconds, is dotted.`
	);

	const PRESET_NAMES: Record<PresetName, { label: string; icon: typeof DropletIcon }> = {
		placeholder: { label: 'Water’s placeholder', icon: DropletIcon },
		honey: { label: 'Honey', icon: HoneyIcon },
		copper: { label: 'Copper’s electrons', icon: Atom01Icon }
	};
</script>

{#snippet power(e: number)}{#if e === 0}1{:else if e === 1}10{:else}10<tspan
			class="exp"
			dy={-4.5 * u}>{e < 0 ? `−${-e}` : e}</tspan
		>{/if}{/snippet}

<div class="maxwell-liquid">
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
				Make the honey a thousand times more viscous, keeping its stiffness. Does its friction at
				the frequencies of heat rise or fall?
			{:else}
				Choose copper’s electrons and change <Tex math={E0} trust /> at fixed <Tex
					math={MUI}
					trust
				/>. Which <Tex math="\tau" /> gives the most friction at the glow’s peak?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>It falls a thousandfold, to <Tex math={`${numberTex(thickAt)}${PAS}`} />.</strong>
				At the glow’s peak at {tRound} K, honey of <Tex math={`10${PAS}`} /> has
				<Tex math={`${RE} = ${numberTex(honeyAt)}${PAS}`} trust />, deep in the tail, where
				<Tex math="\omega\tau \gg 1" /> and the friction is <Tex
					math={`${MUI}^2/${E0}\\omega^2`}
					trust
				/>. A thousand times <Tex math={E0} trust /> raises the plateau a thousandfold and lowers the
				tail as much: the more viscous dashpot moves less under the same stress, and so makes less heat.
				The weight stays <Tex math={`${MUI} = 1\\,\\mathrm{GPa}`} trust />, so the curve grows
				taller and narrower with the same area.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong
					><Tex math={`\\tau = 1/\\omega = ${numberTex(1 / band.peak)}\\,\\mathrm{s}`} />, where
					<Tex math="\omega\tau = 1" />.</strong
				>
				There the friction reaches <Tex
					math={`${MUI}/2\\omega = ${numberTex(copperTop)}${PAS}`}
					trust
				/>, the ceiling of the next section: no relaxation time gives more at this frequency and
				this stiffness. Copper’s own collision time, <Tex
					math={`2.5 \\times 10^{-14}\\,\\mathrm{s}`}
				/>, has
				<Tex math={`\\omega\\tau = ${copperWt.toFixed(1)}`} /> and reaches {Math.round(
					100 * copperOwn
				)}% of it. A longer <Tex math="\tau" /> lowers the friction, because the electrons then answer
				as a solid; a shorter one lowers it too, because the plateau <Tex
					math={`${E0} = ${MUI}\\tau`}
					trust
				/> falls with it.
			{:else if step === 1}
				The answer appears once you have set <Tex math={E0} trust /> to <Tex math={`10^4${PAS}`} />,
				a thousand times honey’s, at honey’s stiffness of 1 GPa.
			{:else}
				The answer appears once you have found it, with copper’s stiffness kept at 38 GPa.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
				</clipPath>
			</defs>

			<text class="title" x={box.L - 30 * u} y={box.T - 12 * u}
				>Re <tspan class="it">η</tspan>, Pa s</text
			>
			<rect class="panel" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />

			<!-- the glow's band and its peak -->
			<rect
				class="band"
				x={bandBox.x0}
				y={box.T}
				width={bandBox.x1 - bandBox.x0}
				height={box.B - box.T}
			/>
			<line class="peak" x1={peakX} x2={peakX} y1={box.T - 5 * u} y2={box.B} />
			<text class="small glow-words" x={glowLabel.x} y={box.T - 9 * u} text-anchor="middle"
				>the glow at {tRound} K</text
			>

			<!-- the grid, every second power of ten -->
			{#each etaTicks as e (e)}
				<line class="grid" x1={box.L} x2={box.R} y1={Y(e)} y2={Y(e)} />
				<text class="small y-tick" x={box.L - 5 * u} y={Y(e) + 3.5 * u}>{@render power(e)}</text>
			{/each}
			{#each omegaTicks as e (e)}
				<line class="grid" x1={X(e)} x2={X(e)} y1={box.T} y2={box.B} />
				<text class="small tick" x={X(e)} y={box.B + 15 * u}>{@render power(e)}</text>
			{/each}
			{#each Array.from({ length: OMEGA_AXIS.high - OMEGA_AXIS.low + 1 }, (_, i) => OMEGA_AXIS.low + i) as e (e)}
				<line class="minor" x1={X(e)} x2={X(e)} y1={box.B} y2={box.B + 3 * u} />
			{/each}
			{#each Array.from({ length: ETA_AXIS.high - ETA_AXIS.low + 1 }, (_, i) => ETA_AXIS.low + i) as e (e)}
				<line class="minor" x1={box.L - 3 * u} x2={box.L} y1={Y(e)} y2={Y(e)} />
			{/each}
			<text class="small dim end" x={box.R} y={box.B + 29 * u}
				><tspan class="it">ω</tspan>, s⁻¹</text
			>

			<g clip-path="url(#{uid}-plot)">
				<line class="placeholder" x1={box.L} x2={box.R} y1={placeholderY} y2={placeholderY} />
				<path class="asymptote" d={line(plateau)} />
				<path class="asymptote" d={line(tailLine)} />
				<path class="curve-halo" d={curvePath} />
				<path class="curve" d={curvePath} />
				{#if dotShown}
					<circle class="dot" cx={dot[0]} cy={dot[1]} r={3.4 * u} />
				{/if}
			</g>

			{#if labels.placeholder}
				<text
					class="small words"
					x={labels.placeholder.x}
					y={labels.placeholder.y}
					text-anchor={labels.placeholder.anchor}>the placeholder</text
				>
			{/if}
			{#if labels.plateauLabel}
				<text
					class="small words"
					x={labels.plateauLabel.x}
					y={labels.plateauLabel.y}
					text-anchor={labels.plateauLabel.anchor}
					>plateau <tspan class="it">η</tspan><tspan class="sub" dy={2.5 * u}>0</tspan></text
				>
			{/if}
			{#if labels.tailLabel}
				<text
					class="small words"
					x={labels.tailLabel.x}
					y={labels.tailLabel.y}
					text-anchor={labels.tailLabel.anchor}
					>tail <tspan class="it">μ</tspan><tspan class="sub" dy={2.5 * u}>∞</tspan><tspan
						dy={-2.5 * u}>²/</tspan
					><tspan class="it">η</tspan><tspan class="sub" dy={2.5 * u}>0</tspan><tspan
						class="it"
						dy={-2.5 * u}>ω</tspan
					>²</text
				>
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch curve-key"></span><span
					>the friction <Tex math={`${RE}(\\omega) = ${E0}/(1 + \\omega^2\\tau^2)`} trust /></span
				>
			</li>
			<li><span class="swatch asymptote-key"></span>its plateau and its tail</li>
			<li>
				<span class="swatch placeholder-key"></span>the placeholder, <Tex math={`10^{-3}${PAS}`} />
			</li>
			<li><span class="swatch band-key"></span>the glow’s band, with its peak</li>
		</ul>
	</div>

	<div class="bar">
		<div class="presets" role="group" aria-label="Liquids">
			{#each PRESET_ORDER as p (p)}
				<button type="button" aria-pressed={preset === p} onclick={() => choose(p)}>
					<HugeiconsIcon icon={PRESET_NAMES[p].icon} size={16} strokeWidth={1.7} />
					{PRESET_NAMES[p].label}
				</button>
			{/each}
		</div>
		<div class="sliders">
			<div
				onkeydowncapture={pageKeys(() => Math.log10(eta0), setEta, ETA0.step, ETA0.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-eta"
					label="Viscosity"
					icon={SpoonIcon}
					min={ETA0.low}
					max={ETA0.high}
					step={ETA0.step}
					bind:value={() => Math.log10(eta0), setEta}
					readout="η₀ = {numberText(eta0)} Pa s"
					ends={['10⁻⁴', '10⁴ Pa s']}
					marks={[
						{ at: -3, label: 'η₀ = 10⁻³ Pa s, water’s placeholder' },
						{ at: 1, label: 'η₀ = 10 Pa s, honey' },
						{ at: 4, label: 'η₀ = 10⁴ Pa s, a thousand times honey' }
					]}
					marksHint="the ticks mark water’s placeholder, honey, and a thousand times honey"
				/>
			</div>
			<div
				onkeydowncapture={pageKeys(() => Math.log10(mu), setMu, MU.step, MU.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-mu"
					label="Rigidity"
					icon={CubeIcon}
					min={MU.low}
					max={MU.high}
					step={MU.step}
					bind:value={() => Math.log10(mu), setMu}
					readout="μ∞ = {gpa(mu)} GPa"
					ends={['0.1', '100 GPa']}
					marks={[
						{ at: 9, label: 'μ∞ = 1 GPa, the chapter’s illustration' },
						{ at: Math.log10(PRESETS.copper.mu), label: 'μ∞ = 38 GPa, copper’s electrons' }
					]}
					marksHint="the ticks mark 1 GPa and copper’s 38 GPa"
				/>
			</div>
			<div
				onkeydowncapture={pageKeys(() => Math.log10(T), setT, TEMPERATURE.step, TEMPERATURE.page)}
				role="presentation"
			>
				<Slider
					id="{uid}-temperature"
					label="Temperature"
					icon={FireIcon}
					min={TEMPERATURE.low}
					max={TEMPERATURE.high}
					step={TEMPERATURE.step}
					bind:value={() => Math.log10(T), setT}
					readout="T = {tRound} K"
					ends={['200 K', '2000 K']}
					marks={[{ at: Math.log10(ROOM), label: 'T = 293 K, the chapter’s room' }]}
					marksHint="the tick marks the chapter’s 293 K"
				/>
			</div>
		</div>
		<p class="hint">
			Choose a liquid, or drag the sliders. With the keyboard, reach each with Tab: the arrow keys
			step a tenth of a power of ten in <Tex math={E0} trust />, a twentieth in <Tex
				math={MUI}
				trust
			/> and a hundredth in <Tex math="T" />, and Page Up and Page Down ten times as far.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The liquid</dt>
				<dd>
					<Tex math={liquidTex} trust /><span class="also"
						>Stirred slowly, the liquid has its everyday viscosity <Tex math={E0} trust />. Against
						a sudden shear it holds like a solid of the unrelaxed rigidity <Tex math={MUI} trust />. {#if preset === 'copper'}For
							copper’s electrons, <Tex math={MUI} trust /> is the paper’s
							<Tex math="\tfrac25 nE_F" /> and <Tex math="\tau" /> its collision time.{:else if preset}The
							rigidity of 1 GPa is the chapter’s illustration, not a measured value.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Relaxation time</dt>
				<dd>
					<Tex math={tauTex} trust /><span class="also"
						>A held shear’s stress dies away as <Tex math={'e^{-t/\\tau}'} />. Below <Tex
							math="\omega = 1/\tau"
						/>, where the dashed lines meet, the liquid flows; above it, the liquid answers as a
						solid.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The glow</dt>
				<dd>
					<Tex math={glowTex} /><span class="also"
						>At <Tex math={`T = ${tRound}\\,\\mathrm{K}`} />, the Planck radiance <Tex
							math="x^3/(e^x - 1)"
						/>, with <Tex math="x = \hbar\omega/k_BT" />, is above a tenth of its peak from
						<Tex math={`x = ${BAND_X.low.toFixed(3)}`} /> to <Tex
							math={`${BAND_X.high.toFixed(2)}`}
						/>: <Tex math="\omega/2\pi" /> from {numberText(terahertz(band.low))} to {numberText(
							terahertz(band.high)
						)} THz. Its peak, <Tex math={`x = ${PEAK_X.toFixed(3)}`} />, is at <Tex
							math={`\\omega = ${numberTex(band.peak, 3)}${PER_S}`}
						/>, or {numberText(terahertz(band.peak))} THz.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>At the glow’s peak</dt>
				<dd>
					<Tex math={peakTex} trust /><span class="also"
						>Here <Tex math={`\\omega\\tau = ${wtTex}`} />{#if regime === 'tail'}, deep in the tail:
							the liquid answers as a solid, and its friction is close to <Tex
								math={`${MUI}^2/${E0}\\omega^2`}
								trust
							/>.{:else if regime === 'plateau'}, on the plateau: the liquid flows, and its friction
							is close to <Tex math={E0} trust />.{:else}, near the corner. At this stiffness no <Tex
								math="\tau"
							/> gives more than <Tex
								math={`${MUI}/2\\omega = ${numberTex(ceiling(band.peak, mu))}${PAS}`}
								trust
							/>, and this liquid has {Math.round(100 * shareOfCeiling(band.peak, eta0, mu))}% of
							it.{/if}
						{#if belowPlaceholder >= 1.5}That is {numberText(belowPlaceholder)} times below the placeholder.{:else if belowPlaceholder <= 1 / 1.5}That
							is {numberText(1 / belowPlaceholder)} times above the placeholder.{:else}That is close
							to the placeholder.{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The weight</dt>
				<dd>
					<Tex math={areaTex} trust /><span class="also"
						>The area under the curve on ordinary axes, found here by adding up the friction over
						every frequency. It is the weight; chapter 4.5 explains why it is fixed. A larger <Tex
							math={E0}
							trust
						/> at fixed <Tex math={MUI} trust /> makes the curve taller and narrower with the same area.</span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			Both axes are on scales of powers of ten, so the tail, which falls as <Tex
				math="1/\omega^2"
			/>, is a straight line two powers of ten down for each power of ten across. The dot marks the
			friction at the glow’s peak. The plateau and the tail are drawn dashed where the curve leaves
			them; they meet at <Tex math="\omega = 1/\tau" />, where the friction is half of <Tex
				math={E0}
				trust
			/>. The curve is exact.
		</p>
	</div>
</div>

<style>
	.maxwell-liquid {
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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
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
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.dim {
		fill: var(--text-faint);
	}

	.end {
		text-anchor: end;
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		font-variant-numeric: tabular-nums;
	}

	.exp {
		font-size: 0.78em;
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

	.words {
		fill: var(--text);
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

	.minor {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.band {
		fill: color-mix(in srgb, var(--accent-2) 13%, transparent);
	}

	.peak {
		stroke: color-mix(in srgb, var(--accent-2) 75%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.glow-words {
		fill: var(--text-dim);
	}

	.placeholder {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: round;
	}

	.asymptote {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.curve {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.dot {
		fill: var(--accent);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
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
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.curve-key {
		border-color: var(--accent);
	}

	.asymptote-key {
		border-top: 1px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.placeholder-key {
		border-top: 1.5px dotted color-mix(in srgb, var(--text) 65%, transparent);
	}

	.band-key {
		height: 0.7rem;
		width: 0.9rem;
		border: 0;
		border-radius: 2px;
		background:
			linear-gradient(
					color-mix(in srgb, var(--accent-2) 75%, transparent),
					color-mix(in srgb, var(--accent-2) 75%, transparent)
				)
				center / 1px 100% no-repeat,
			color-mix(in srgb, var(--accent-2) 16%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.presets {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
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
		min-height: 2rem;
		padding: 0.3rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.76rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.presets button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.presets button[aria-pressed='true'] :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.presets button[aria-pressed='false']:hover {
			color: var(--text);
		}
	}

	.sliders {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
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
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
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
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.presets button {
			flex-direction: column;
			gap: 0.2rem;
			padding: 0.35rem 0.25rem;
			text-align: center;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.presets button {
			transition: none;
		}
	}
</style>
