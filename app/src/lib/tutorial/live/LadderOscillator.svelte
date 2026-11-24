<script lang="ts">
	/**
	 * Chapter 8.3's ladder oscillator, in units of ħω with z = ħω/k_BT. Left: the parabola of diagram
	 * tut-oscillator-levels, E/ħω = (x/x_zp)²/4, with the levels n = 0 to 20 at (n + ½)ħω, each carrying an ink bar
	 * as long as its probability P(n) = (1 − e^{−z})e^{−nz}, and the ground state's bell on the lowest. Right: the
	 * phase plane of diagram tut-phase-rings in the scaled axes x/x_zp and p/(mωx_zp), with the levels' orbits as thin
	 * rings of radius √(2(2n + 1)) and a grey disc of radius √(2n̄ + 1), one standard deviation of the thermal spread.
	 * With the switch on, a coherent state instead: a blob of radius 1 circling clockwise on the circle of radius 2√n̄,
	 * and the bars of its Poisson P(n) = e^{−n̄}n̄ⁿ/n!. The arithmetic is in ./ladder-oscillator.ts. Opens at
	 * k_BT = ħω/2, thermal; three predictions at the top are answered once the reader has done what each asks. The
	 * coherent state circles while playing; under reduced motion it opens paused.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Layers01Icon,
		Orbit01Icon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		ThermometerIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BLOB,
		LEAST,
		LEVELS,
		NBAR,
		OPENING,
		TEMP,
		TURN_S,
		bell,
		centreAt,
		excessWords,
		fixed,
		levelEnergy,
		nbarWords,
		noteFirst,
		noteSecond,
		noteThird,
		orbitRadius,
		parabola,
		percentWords,
		reading,
		snapNbar,
		snapTemp,
		stepped,
		texNbar,
		tWords,
		type Range,
		type Settings
	} from './ladder-oscillator';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	/** log₁₀(k_BT/ħω). */
	let lt = $state(OPENING.lt);
	let coherent = $state(OPENING.coherent);
	/** The coherent state's n̄. */
	let nbar = $state(OPENING.nbar);

	const settings = $derived<Settings>({ lt, coherent, nbar });

	function setTemp(v: number) {
		lt = snapTemp(v);
		note();
	}
	function setCoherent(v: boolean) {
		coherent = v;
		note();
	}
	function setNbar(v: number) {
		nbar = snapNbar(v);
		note();
	}
	function reset() {
		lt = OPENING.lt;
		coherent = OPENING.coherent;
		nbar = OPENING.nbar;
		phase = 0;
		playing = !prefersReducedMotion.current;
		note();
	}

	/** Arrow keys step a slider onto its grid, with Shift by a larger step. */
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
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		const s = { lt, coherent, nbar };
		first = noteFirst(first, s);
		second = noteSecond(second, s);
		third = noteThird(third, s);
	}

	// --- the time -------------------------------------------------------------------------------------------------
	let playing = $state(true);
	/** ωt, the coherent state's turn since the start, radians. */
	let phase = $state(0);
	let checked = false;

	/** Turns the coherent state once every TURN_S seconds while playing; under reduced motion it opens paused. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		const shown = coherent;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				return;
			}
		}
		if (!on || !shown) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			phase = (phase + (2 * Math.PI * dt) / TURN_S) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the numbers ------------------------------------------------------------------------------------------------
	const now = $derived(reading(settings));
	const bars = $derived(coherent ? now.coherent.p : now.thermal.p);
	const above = $derived(coherent ? now.coherent.above : now.thermal.above);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const layout = $derived(
		phone.current
			? { W: 420, H: 758, left: { x: 0, y: 0 }, right: { x: 40, y: 386 } }
			: { W: 780, H: 372, left: { x: 0, y: 0 }, right: { x: 440, y: 0 } }
	);

	// the levels, in the left panel's own units: x/x_zp across, E/ħω up
	const FLOOR = 318;
	const E_TOP = 21.25;
	const EY = (FLOOR - 46) / E_TOP;
	const CX = 150;
	const SX = 11.5;
	const BAR0 = 302;
	const BAR_W = 108;
	const BAR_H = 6;
	const lx = (x: number) => CX + SX * x;
	const ly = (e: number) => FLOOR - EY * e;
	const SPAN = 2 * Math.sqrt(E_TOP);
	const wellPath = parabola(SPAN)
		.map((q, i) => `${i ? 'L' : 'M'}${f2(lx(q.x))},${f2(ly(q.e))}`)
		.join('');
	/** The bell: its width exact, its height schematic, 0.8ħω, sitting on the level n = 0. */
	const BELL_H = 0.8;
	const bellPath = (() => {
		const pts = bell(3.6);
		const base = ly(levelEnergy(0));
		return (
			`M${f2(lx(pts[0].x))},${f2(base)}` +
			pts.map((q) => `L${f2(lx(q.x))},${f2(base - EY * BELL_H * q.h)}`).join('') +
			`L${f2(lx(pts[pts.length - 1].x))},${f2(base)}Z`
		);
	})();
	const levels = Array.from({ length: LEVELS + 1 }, (_, n) => ({
		n,
		y: ly(levelEnergy(n)),
		r: orbitRadius(n),
		named: n % 5 === 0
	}));
	const xTicksLeft = [-8, -4, 0, 4, 8];
	const pTicks = [
		{ at: 0, label: '0' },
		{ at: 0.5, label: '½' },
		{ at: 1, label: '1' }
	];

	// the phase plane, in the right panel's own units
	const PC = { x: 170, y: 196 };
	const HALF = 150;
	const P_SPAN = 10.5;
	const S = HALF / P_SPAN;
	const px = (x: number) => PC.x + S * x;
	const py = (p: number) => PC.y - S * p;
	const planeTicks = [-8, -6, -4, -2, 2, 4, 6, 8];

	/** The disc's radius marker: from the centre up and to the left, its words outside the disc or inside near its edge. */
	const RAY = (-4 * Math.PI) / 5;
	const discRay = $derived.by(() => {
		const r = now.thermal.radius;
		const end = { x: PC.x + S * r * Math.cos(RAY), y: PC.y + S * r * Math.sin(RAY) };
		const outside = r < 6.4;
		const gap = outside ? 6 : -6;
		return {
			end,
			label: {
				x: end.x + gap * Math.cos(RAY) * u,
				y: end.y + gap * Math.sin(RAY) * u + (outside ? 0 : 12 * u),
				anchor: outside ? 'end' : 'start'
			}
		};
	});

	const centre = $derived(centreAt(nbar, phase));
	const blob = $derived({ x: px(centre.x), y: py(centre.p) });
	const ringR = $derived(now.coherent.radius);
	/** The clockwise arrowhead on the circle the blob goes round, up and to the right, clear of the axes' numbers. */
	const turnHead = $derived.by(() => {
		if (ringR < 0.6) return undefined;
		const a = Math.PI / 3;
		const at = { x: PC.x + S * ringR * Math.cos(a), y: PC.y - S * ringR * Math.sin(a) };
		// clockwise with p up is (sin a, −cos a); on the screen, with y down, (sin a, cos a)
		const t = { x: Math.sin(a), y: Math.cos(a) };
		const n = { x: -t.y, y: t.x };
		const h = 6.5 * u;
		const tip = { x: at.x + h * t.x, y: at.y + h * t.y };
		const back = { x: at.x - 0.2 * h * t.x, y: at.y - 0.2 * h * t.y };
		const w = 0.55 * h;
		return `${f2(tip.x)},${f2(tip.y)} ${f2(back.x + w * n.x)},${f2(back.y + w * n.y)} ${f2(back.x - w * n.x)},${f2(back.y - w * n.y)}`;
	});
	/** The circle's words, outside it up and to the left, where the corner has room at every n̄. */
	const ringLabel = $derived.by(() => {
		const a = Math.PI / 4;
		const rr = ringR + 0.35;
		return { x: PC.x - S * rr * Math.cos(a), y: PC.y - S * rr * Math.sin(a), anchor: 'end' };
	});

	// --- the words --------------------------------------------------------------------------------------------------
	const tNow = $derived(tWords(now.t));
	const description = $derived(
		`Left: the parabola of the potential, energy over ħω up and x over x_zp across, with the levels n = 0 to 20 at ` +
			`(n + ½)ħω, each carrying a bar as long as its probability, and the ground state's bell on the lowest. ` +
			(coherent
				? `The bars are a coherent state's, P(n) = e^(−n̄) n̄ⁿ/n! with n̄ = ${fixed(nbar, 1)}: ${percentWords(now.coherent.ground)} in the ground state, peaking near n = ${Math.floor(nbar)}` +
					`, ${percentWords(above)} above n = 20. `
				: `The bars are thermal, at k_BT = ${tNow}ħω: ${percentWords(now.thermal.ground)} in the ground state, falling by e^(−z) a level, ${percentWords(above)} above n = 20. `) +
			`Right: the phase plane in the scaled axes x/x_zp and p/(mω x_zp), with the levels' orbits as thin rings. ` +
			(coherent
				? `A blob of radius 1 circles clockwise on the circle of radius 2√n̄ = ${fixed(ringR, 2)}${playing ? '' : ', paused'}.`
				: `A grey disc centred on the origin, radius √(2n̄ + 1) = ${fixed(now.thermal.radius, 2)}, one standard deviation of the thermal spread; it does not move.`)
	);
	const summary = $derived(
		`k_BT = ${tNow}ħω: thermal n̄ = ${nbarWords(now.thermal.nbar)}, ⟨E⟩/k_BT = ${fixed(now.thermal.energy)}, ` +
			`ground state ${percentWords(now.thermal.ground)}.` +
			(coherent
				? ` Coherent state: n̄ = ${fixed(nbar, 1)}, ground state ${percentWords(now.coherent.ground)}.`
				: '')
	);
</script>

<div class="ladder-oscillator">
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
				At <Tex math="k_BT = \hbar\omega" />, how much of the probability is in the ground state?
			{:else if step === 2}
				Raise the temperature until the mean energy is within 1% of <Tex math="k_BT" />. How many
				quanta is that?
			{:else}
				Switch to a coherent state with the same <Tex math="\bar n" />. What is different?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>63%, <Tex math="1 - 1/e" />.</strong> At <Tex math="k_BT = \hbar\omega" />, <Tex
					math="z = 1"
				/> and <Tex math={'P(0) = 1 - e^{-1} = 0.632'} />. Each level up holds <Tex
					math={'e^{-1}'}
				/> of the one below, 23% in <Tex math="n = 1" /> and 8.6% in <Tex math="n = 2" />, and the
				mean is <Tex math="\bar n = 1/(e - 1) = 0.582" /> quanta.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>About two and a half.</strong> The excess over <Tex math="k_BT" /> is about
				<Tex math="(\hbar\omega)^2/12k_BT" />, which is <Tex math="0.01\,k_BT" /> at
				<Tex math="k_BT = 2.89\,\hbar\omega" />, where <Tex math="\bar n = 2.4" />; the exact excess
				there is <Tex math="0.00998\,k_BT" />, and the exact 1% point is <Tex
					math="k_BT = 2.88\,\hbar\omega"
				/>, where <Tex math="\bar n = 2.41" />. A couple of quanta already bring a mode's mean
				energy to equipartition.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong
					>The blob is small and circles; the thermal disc fills the circle and stays put, with no
					phase.</strong
				>
				The coherent state keeps the zero point's spread, radius 1, and its centre turns as
				<Tex math={'\\alpha e^{-i\\omega t}'} /> on the circle of radius <Tex
					math={'2\\sqrt{\\bar n}'}
				/>. The thermal state of the same <Tex math="\bar n" /> spreads <Tex
					math={'\\sqrt{2\\bar n + 1}'}
				/> each way about the origin, with <Tex math="\langle a\rangle = 0" />. Both have the mean
				squared radius <Tex math="4\bar n + 2" />, the same mean energy, but heat puts it at every
				phase at once. Their <Tex math="P(n)" /> differ too: the thermal one falls from
				<Tex math="n = 0" /> at every temperature, the coherent one peaks near <Tex
					math="\bar n"
				/>.
			{:else if step === 1}
				The answer appears once you have set <Tex math="k_BT/\hbar\omega" /> to 1, with the coherent state
				off.
			{:else if step === 2}
				The answer appears once the mean energy is within 1% of <Tex math="k_BT" />.
			{:else}
				The answer appears once you have switched the coherent state on with the thermal state's <Tex
					math="\bar n"
				/>, to within 5% and at least {LEAST}: the readouts show both.
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
			<!-- the levels -->
			<g transform="translate({layout.left.x} {layout.left.y})">
				<text class="title" x="6" y="14">The levels, each with the chance of being in it</text>

				<path class="bell" d={bellPath} />
				<path class="well" d={wellPath} />
				{#each levels as level (level.n)}
					<line
						class="level"
						x1={f2(lx(-level.r))}
						x2={f2(lx(level.r))}
						y1={f2(level.y)}
						y2={f2(level.y)}
					/>
					<line
						class="leader"
						x1={f2(lx(level.r) + 4)}
						x2={BAR0}
						y1={f2(level.y)}
						y2={f2(level.y)}
					/>
					{#if level.named}
						<text
							class="small dim end"
							x={f2(lx(level.n === 0 ? -3.8 : -level.r) - 6)}
							y={f2(level.y + 4)}><tspan class="it">n</tspan> = {level.n}</text
						>
					{/if}
				{/each}
				{#each bars as p, n (n)}
					{#if p * BAR_W >= 0.05}
						<rect
							class="bar"
							x={BAR0}
							y={f2(levels[n].y - BAR_H / 2)}
							width={f2(p * BAR_W)}
							height={BAR_H}
						/>
					{/if}
				{/each}

				<!-- the axes -->
				<line class="axis" x1={lx(-SPAN)} x2={lx(SPAN)} y1={FLOOR + 8} y2={FLOOR + 8} />
				{#each xTicksLeft as t (t)}
					<line class="tick" x1={lx(t)} x2={lx(t)} y1={FLOOR + 8} y2={FLOOR + 12} />
					<text class="small dim mid" x={lx(t)} y={FLOOR + 24}>{fixed(t, 0)}</text>
				{/each}
				<text class="small dim start" x={lx(SPAN) + 4} y={FLOOR + 24}
					><tspan class="it">x</tspan>/<tspan class="it">x</tspan><tspan class="sub" dy="3"
						>zp</tspan
					></text
				>
				<line class="axis" x1={BAR0} x2={BAR0} y1={ly(E_TOP)} y2={FLOOR + 8} />
				<line class="axis faint" x1={BAR0} x2={BAR0 + BAR_W} y1={FLOOR + 8} y2={FLOOR + 8} />
				{#each pTicks as t (t.at)}
					<line
						class="tick"
						x1={BAR0 + BAR_W * t.at}
						x2={BAR0 + BAR_W * t.at}
						y1={FLOOR + 8}
						y2={FLOOR + 12}
					/>
					<text class="small dim mid" x={BAR0 + BAR_W * t.at} y={FLOOR + 24}>{t.label}</text>
				{/each}
				<text class="small dim mid" x={BAR0} y={ly(E_TOP) - 4}
					><tspan class="it">P</tspan>(<tspan class="it">n</tspan>)</text
				>
				{#if above >= 5e-4}
					<text class="small dim end" x={BAR0 + BAR_W + 4} y={ly(E_TOP) - 4}
						><tspan class="it">n</tspan> &gt; 20: {percentWords(above)}</text
					>
				{/if}
				<text class="small strong start" x="6" y={FLOOR + 46}
					>{#if coherent}Coherent: <tspan class="it">P</tspan>(<tspan class="it">n</tspan>) = e<tspan
							class="sup"
							dy="-4">−n̄</tspan
						><tspan dy="4"> </tspan><tspan class="it">n̄</tspan><tspan class="sup it" dy="-4"
							>n</tspan
						><tspan dy="4">/</tspan><tspan class="it">n</tspan>!, chapter 8.5 derives this{:else}Thermal
						at <tspan class="it">k</tspan><tspan class="sub" dy="3">B</tspan><tspan
							dy="-3"
							class="it">T</tspan
						>
						= {tNow}<tspan class="it">ħω</tspan>: <tspan class="it">P</tspan>(<tspan class="it"
							>n</tspan
						>) = (1 − e<tspan class="sup" dy="-4">−<tspan class="it">z</tspan></tspan><tspan dy="4"
							>)e</tspan
						><tspan class="sup" dy="-4">−<tspan class="it">nz</tspan></tspan>{/if}</text
				>
			</g>

			<!-- the phase plane -->
			<g transform="translate({layout.right.x} {layout.right.y})">
				<text class="title" x="6" y="14">The phase plane</text>

				{#if !coherent}
					<circle class="disc" cx={PC.x} cy={PC.y} r={f2(S * now.thermal.radius)} />
				{/if}
				{#each levels as level (level.n)}
					<circle
						class={['orbit', { first: level.n === 0 }]}
						cx={PC.x}
						cy={PC.y}
						r={f2(S * level.r)}
					/>
				{/each}

				<line class="axis" x1={px(-P_SPAN)} x2={px(P_SPAN)} y1={PC.y} y2={PC.y} />
				<line class="axis" x1={PC.x} x2={PC.x} y1={py(P_SPAN)} y2={py(-P_SPAN)} />
				{#each planeTicks as t (t)}
					<line class="tick" x1={px(t)} x2={px(t)} y1={PC.y} y2={PC.y + 4} />
					<line class="tick" x1={PC.x - 4} x2={PC.x} y1={py(t)} y2={py(t)} />
					{#if t % 4 === 0}
						<text class="small dim mid halo" x={px(t)} y={PC.y + 15}>{fixed(t, 0)}</text>
						<text class="small dim end halo" x={PC.x - 7} y={py(t) + 4}>{fixed(t, 0)}</text>
					{/if}
				{/each}
				<text class="small dim end" x={px(P_SPAN)} y={PC.y + 30}
					><tspan class="it">x</tspan>/<tspan class="it">x</tspan><tspan class="sub" dy="3"
						>zp</tspan
					></text
				>
				<text class="small dim start" x={PC.x + 7} y={py(P_SPAN) + 4}
					><tspan class="it">p</tspan>/(<tspan class="it m">m</tspan><tspan class="it">ω</tspan
					><tspan class="it">x</tspan><tspan class="sub" dy="3">zp</tspan><tspan dy="-3">)</tspan
					></text
				>

				{#if coherent}
					{#if ringR > 0.05}
						<circle class="ring" cx={PC.x} cy={PC.y} r={f2(S * ringR)} />
					{/if}
					{#if turnHead}<polygon class="head" points={turnHead} />{/if}
					<circle class="blob" cx={f2(blob.x)} cy={f2(blob.y)} r={f2(S * BLOB)} />
					<circle class="dot" cx={f2(blob.x)} cy={f2(blob.y)} r={f2(1.8 * u)} />
					{#if ringR > 0.05}
						<text
							class="small strong halo {ringLabel.anchor}"
							x={f2(ringLabel.x)}
							y={f2(ringLabel.y)}>2√<tspan class="it">n̄</tspan> = {fixed(ringR, 2)}</text
						>
					{/if}
				{:else}
					<line class="ray" x1={PC.x} y1={PC.y} x2={f2(discRay.end.x)} y2={f2(discRay.end.y)} />
					<text
						class="small strong halo {discRay.label.anchor}"
						x={f2(discRay.label.x)}
						y={f2(discRay.label.y)}
						>√(2<tspan class="it">n̄</tspan> + 1) = {fixed(now.thermal.radius, 2)}</text
					>
				{/if}
			</g>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="bar-key"></span><span
					>the chance <Tex math="P(n)" /> of the level <Tex math="n" />, at <Tex
						math="(n + \tfrac12)\hbar\omega"
					/></span
				>
			</li>
			<li>
				<span class="bell-key"></span>the ground state’s bell, its width exact, its height schematic
			</li>
			<li><span class="orbit-key"></span>the levels’ classical orbits</li>
			{#if coherent}
				<li>
					<span class="blob-key"></span>the coherent state, one standard deviation of the zero point
				</li>
			{:else}
				<li><span class="disc-key"></span>the thermal spread, one standard deviation</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="groups">
			<div class="slot" onkeydowncapture={sliderKeys(() => lt, setTemp, TEMP)} role="presentation">
				<Slider
					id="{uid}-temp"
					label="Temperature"
					icon={ThermometerIcon}
					min={TEMP.min}
					max={TEMP.max}
					step={TEMP.step}
					bind:value={() => lt, setTemp}
					readout="kʙT/ħω = {tNow}"
					marks={[
						{ at: -1, label: '0.1' },
						{ at: OPENING.lt, label: '0.5, as the figure opens' },
						{ at: 0, label: '1, kʙT = ħω' },
						{ at: 1, label: '10' }
					]}
					marksHint="logarithmic, from 0.05 to 50; the ticks mark 0.1, 0.5, 1 and 10"
				/>
			</div>
			<div class="slot toggle-slot">
				<Toggle
					icon={Orbit01Icon}
					label="Coherent state"
					bind:checked={() => coherent, setCoherent}
				/>
			</div>
			<div
				class={['slot', { off: !coherent }]}
				inert={!coherent}
				onkeydowncapture={sliderKeys(() => nbar, setNbar, NBAR)}
				role="presentation"
			>
				<Slider
					id="{uid}-nbar"
					label="n̄ of the coherent state"
					icon={Layers01Icon}
					min={NBAR.min}
					max={NBAR.max}
					step={NBAR.step}
					bind:value={() => nbar, setNbar}
					readout={coherent ? `n̄ = ${fixed(nbar, 1)}` : `n̄ = ${fixed(nbar, 1)}, once switched on`}
					marks={[
						{ at: 0, label: '0, the ground state' },
						{ at: 4, label: '4, as it opens' },
						{ at: 10, label: '10' },
						{ at: 20, label: '20' }
					]}
					marksHint="the ticks mark 0, 4, 10 and 20"
				/>
			</div>
		</div>

		<div class="controls">
			<button
				type="button"
				class="action"
				aria-pressed={playing}
				disabled={!coherent}
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
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Reach the sliders, the switch and the buttons with Tab. The arrow keys step the temperature
				by a hundredth of a decade and <Tex math="\bar n" /> by 0.1, Shift by a tenth of a decade and
				by 1; Home and End go to the ends. Space turns the coherent state on and off, and plays or pauses
				its circling.
			</p>
		</div>
	</div>

	<div class="readouts">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<dl>
			<div class="row">
				<dt>Thermal state</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\bar n = ${texNbar(now.thermal.nbar)},\\quad \\langle E\\rangle/k_BT = ${fixed(now.thermal.energy)}`}
						/></span
					>
					<span class="also"
						>ground state <span class="value">{percentWords(now.thermal.ground)}</span>; <Tex
							math="\langle E\rangle"
						/>
						{excessWords(now.thermal.excess)} above <Tex math="k_BT" /></span
					>
				</dd>
			</div>
			{#if coherent}
				<div class="row">
					<dt>Coherent state</dt>
					<dd>
						<span class="eq"
							><Tex
								math={`\\bar n = ${fixed(nbar, 1)},\\quad \\langle E\\rangle = ${fixed(now.coherent.energy, 2)}\\,\\hbar\\omega`}
							/></span
						>
						<span class="also"
							>ground state <span class="value">{percentWords(now.coherent.ground)}</span>, which is <Tex
								math={'e^{-\\bar n}'}
							/></span
						>
					</dd>
				</div>
			{/if}
			<div class="row">
				<dt>The closed forms</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`\\bar n = \\frac{1}{e^z - 1},\\quad \\frac{\\langle E\\rangle}{k_BT} = \\frac z2\\coth\\frac z2`}
						/></span
					>
					<span class="also">with <Tex math={`z = \\hbar\\omega/k_BT = ${fixed(now.z, 3)}`} /></span
					>
				</dd>
			</div>
		</dl>
		<p class="note">
			In units of <Tex math="\hbar\omega" />. The left panel draws the potential <Tex
				trust
				math={'\\tfrac12\\htmlClass{q-matter}{m}\\omega^2x^2'}
			/>, which is <Tex math={'\\hbar\\omega\\,(x/x_{\\rm zp})^2/4'} />, and the level <Tex
				math="n"
			/> at <Tex math="(n + \tfrac12)\hbar\omega" />, meeting it at <Tex
				math={'x = \\pm\\sqrt{2(2n + 1)}\\,x_{\\rm zp}'}
			/>; a bar of full length would be a probability of 1, and levels above <Tex math="n = 20" /> are
			not drawn. The phase plane is scaled, <Tex math={'x/x_{\\rm zp}'} /> across and <Tex
				trust
				math={'p/(\\htmlClass{q-matter}{m}\\omega x_{\\rm zp})'}
			/> up, so that the ground state’s bell has the standard deviation 1 each way and the orbit of the
			level <Tex math="n" /> is a circle of radius <Tex math={'\\sqrt{2(2n + 1)}'} />. A coherent
			state’s centre sits at <Tex math={'2|\\alpha| = 2\\sqrt{\\bar n}'} /> and turns clockwise; one turn
			takes {TURN_S} seconds here, and <Tex math="2\pi/\omega" /> in the oscillator.
		</p>
	</div>
</div>

<style>
	.ladder-oscillator {
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
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 30%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 780px;
		height: auto;
		margin: 0 auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
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

	.strong {
		fill: var(--text);
		font-weight: 600;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	tspan.it {
		font-size: 1.1em;
	}

	tspan.sub,
	tspan.sup {
		font-size: 0.78em;
	}

	tspan.m {
		fill: var(--q-matter);
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the levels: the well and the levels in ink, the bars in ink, the bell a pale grey */
	.well {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.level {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.leader {
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.bar {
		fill: var(--text);
	}

	.bell {
		fill: color-mix(in srgb, var(--text) 18%, transparent);
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.axis,
	.tick {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis.faint {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
	}

	/* the phase plane: the orbits as thin grey rings, the spreads as grey discs */
	.orbit {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 17%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.orbit.first {
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
	}

	.disc {
		fill: color-mix(in srgb, var(--text) 15%, transparent);
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.blob {
		fill: color-mix(in srgb, var(--text) 30%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.dot,
	.head {
		fill: var(--text);
	}

	.ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.ray {
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		max-width: 780px;
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

	.bar-key,
	.bell-key,
	.orbit-key,
	.disc-key,
	.blob-key {
		flex: none;
		width: 1.1rem;
		height: 0.6rem;
	}

	.bar-key {
		height: 0.36rem;
		background: var(--text);
	}

	.bell-key {
		border-radius: 0.6rem 0.6rem 0 0;
		border-bottom: 1px solid var(--text);
		background: color-mix(in srgb, var(--text) 18%, transparent);
	}

	.orbit-key {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--text) 32%, transparent);
	}

	.disc-key,
	.blob-key {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 1.2px solid color-mix(in srgb, var(--text) 62%, transparent);
		background: color-mix(in srgb, var(--text) 15%, transparent);
	}

	.blob-key {
		border-color: var(--text);
		background: color-mix(in srgb, var(--text) 30%, transparent);
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
		align-items: start;
	}

	.slot {
		min-width: 0;
		transition: opacity 0.15s;
	}

	.slot.off {
		opacity: 0.45;
	}

	.toggle-slot {
		align-self: center;
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

	.action:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.action :global(svg) {
		color: var(--accent);
	}

	@media (hover: hover) {
		.action:hover:not(:disabled) {
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
		.action,
		.slot {
			transition: none;
		}
	}
</style>
