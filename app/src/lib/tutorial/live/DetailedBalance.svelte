<script lang="ts">
	/**
	 * Chapter 10.2's slab of two-level matter at 17 THz. Top left: the slab, in the matter's colour, with its two
	 * levels l and u and a bar on each as long as its population, P_l and P_u; the three ways a quantum is exchanged
	 * drawn between them as arrows (absorption up, stimulated emission down, spontaneous emission down and dashed);
	 * a ray enters from the left with the occupation n_ω and leaves on the right. Top right, the counters: the three
	 * rates per metre at the front face, κP_l n_ω, κP_u n_ω and κP_u, in units of κ; the two coefficients they make,
	 * α = κ(P_l − P_u) and j_ω = κP_u ħω³/4π³c²; and j_ω/α beside B_ω(T). Below: a strip of n_ω along the ray against
	 * the depth κs from 10⁻³ to 10, both on scales of powers of ten, with n̄(T) dashed. Two sliders: the slab's
	 * temperature from 10 K to 10⁵ K and, past a stop where P_u = P_l, an inverted population up to P_u = 0.9; and
	 * the occupation entering, from 0 through n̄(T) to 10³. The arithmetic is in ./detailed-balance.ts. The chapter's
	 * try box asks the predictions, so the figure answers none of them in words. A jump of a slider glides over a
	 * third of a second; under reduced motion the figure shows only the steady state it ends in.
	 */
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { FlashlightIcon, ThermometerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		BLOCK_T,
		D_AXIS,
		D_MAX,
		ENTER,
		OPENING,
		ROOM_T,
		TEMP,
		enteringAt,
		enteringPosition,
		enteringWords,
		numberTex,
		numberText,
		occupationAt,
		ownOccupation,
		pageEntering,
		pageTemp,
		powers,
		profile,
		reading,
		slabAt,
		slabWords,
		snapTemp,
		tempPosition,
		tempTex,
		tempText,
		thermal,
		windowFor
	} from './detailed-balance';

	const uid = $props.id();

	// --- the slab and the radiation entering -----------------------------------------------------------------------
	/** The temperature slider's position (see ./detailed-balance.ts) and log₁₀ of the occupation entering. */
	let p = $state(OPENING.p);
	let v = $state(OPENING.v);

	/** What the drawings show: the same, gliding to a new value after a jump unless motion is reduced. */
	const shownP = new Tween(OPENING.p, { duration: 0 });
	const shownV = new Tween(OPENING.v, { duration: 0 });
	const opening = windowFor(enteringAt(OPENING.v), slabAt(OPENING.p));
	const shownWindow = new Tween({ low: opening.low, high: opening.high }, { duration: 0 });

	/** A jump of the temperature by this many positions, or of the occupation by this many powers of ten, glides. */
	const JUMP = { p: 30, v: 0.3 };

	function move(nextP: number, nextV: number) {
		const far = Math.abs(nextP - p) >= JUMP.p || Math.abs(nextV - v) >= JUMP.v;
		const duration = far && !prefersReducedMotion.current ? 340 : 0;
		const options = { duration, easing: cubicOut };
		p = nextP;
		v = nextV;
		const w = windowFor(enteringAt(nextV), slabAt(nextP));
		shownP.set(nextP, options);
		shownV.set(nextV, options);
		shownWindow.set({ low: w.low, high: w.high }, options);
	}

	const setTemp = (next: number) => move(snapTemp(next, p), v);
	const setEntering = (next: number) => move(p, Math.max(ENTER.low, Math.min(ENTER.high, next)));

	/** The page keys move a slider by its larger step. */
	function pageKeys(page: (up: boolean) => void) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
			e.preventDefault();
			page(e.key === 'PageUp');
		};
	}
	const pageT = pageKeys((up) => move(pageTemp(p, up), v));
	const pageN = pageKeys((up) => move(p, pageEntering(v, up)));

	// --- the numbers ------------------------------------------------------------------------------------------------
	const slab = $derived(slabAt(p));
	const n0 = $derived(enteringAt(v));
	const r = $derived(reading(n0, slab));
	const w = $derived(windowFor(n0, slab));

	/** A multiple of κ: "0.884\,\kappa", or "0". */
	const kappa = (x: number) => (x === 0 ? '0' : `${numberTex(x, 3)}\\,\\kappa`);
	const UNIT = '\\mathrm{W\\,m^{-2}\\,sr^{-1}\\,s}';
	const FREQ_TEX = 'f = \\omega/2\\pi = 17\\,\\mathrm{THz}';

	const slabTex = $derived(
		slab.kind === 'thermal'
			? [`T = ${tempTex(slab.T)},`, `x = \\hbar\\omega/k_BT = ${numberTex(slab.x, 4)}`]
			: slab.kind === 'stop'
				? ['T \\to \\infty']
				: ['\\text{inverted, } P_u > P_l']
	);
	const populationTex = $derived([
		`P_l = ${numberTex(slab.Pl, 3)},`,
		`P_u = ${numberTex(slab.Pu, 3)},`,
		...(slab.kind === 'thermal'
			? [`P_u/P_l = e^{-x} = ${numberTex(slab.Pu / slab.Pl, 3)}`]
			: [`P_u/P_l = ${numberTex(slab.Pu / slab.Pl, 3)}`])
	]);
	const nbarTex = $derived(
		r.nbar === undefined ? [] : [`\\bar n(T) = \\dfrac{1}{e^x - 1}`, `= ${numberTex(r.nbar, 3)}`]
	);

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);

	/** The slab's picture. */
	const SC = {
		W: 384,
		H: 318,
		slab: [112, 272] as const,
		top: 8,
		bot: 308,
		ray: 268,
		u: 104,
		l: 212,
		bar: [138, 256] as const,
		thick: 9,
		arrows: [168, 200, 232] as const,
		/** The arrows run from just under the upper level to just over the lower level's words. */
		reach: [114, 178] as const
	};
	let u = $state(1);

	/** The strip. */
	const box = $derived(
		phone.current
			? { W: 360, H: 244, L: 44, R: 350, T: 34, B: 194 }
			: { W: 680, H: 244, L: 54, R: 664, T: 34, B: 194 }
	);
	let k = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	const shownSlab = $derived(slabAt(shownP.current));
	const shownN0 = $derived(enteringAt(shownV.current));

	const X = (ld: number) =>
		box.L + ((ld - D_AXIS.low) / (D_AXIS.high - D_AXIS.low)) * (box.R - box.L);
	const Y = (ly: number) =>
		box.B -
		((ly - shownWindow.current.low) / (shownWindow.current.high - shownWindow.current.low)) *
			(box.B - box.T);
	const clampY = (ly: number) =>
		Math.max(shownWindow.current.low - 1, Math.min(shownWindow.current.high + 1, ly));

	const curvePath = $derived(
		profile(shownN0, shownSlab)
			.map(([ld, ly], i) => `${i ? 'L' : 'M'}${f2(X(ld))},${f2(Y(clampY(ly)))}`)
			.join('')
	);
	const shownNbar = $derived(ownOccupation(shownSlab));
	const nbarY = $derived(
		shownNbar === undefined || w.nbarOff !== undefined ? undefined : Y(Math.log10(shownNbar))
	);
	const leavingY = $derived.by(() => {
		const n = occupationAt(shownN0, shownSlab, D_MAX);
		return n > 0 ? Y(clampY(Math.log10(n))) : undefined;
	});

	/** The labelled powers of ten up the strip, spaced as the window in view asks. */
	const yTicks = $derived.by(() => {
		const { low, high } = shownWindow.current;
		const span = high - low;
		const every = span <= 6.5 ? 1 : span <= 12.5 ? 2 : 3;
		return powers({ low: Math.ceil(low - 1e-6), high: Math.floor(high + 1e-6), every });
	});
	const D_LABELS = [
		{ at: -3, text: '10⁻³' },
		{ at: -2, text: '0.01' },
		{ at: -1, text: '0.1' },
		{ at: 0, text: '1' },
		{ at: 1, text: '10' }
	];
	const MINOR = (() => {
		const out: number[] = [];
		for (let e = D_AXIS.low; e < D_AXIS.high; e++) {
			for (let m = 2; m <= 9; m++) out.push(e + Math.log10(m));
		}
		return out;
	})();

	/** n̄(T)'s words above its line, or below it where the line runs near the strip's top. */
	const nbarLabelY = $derived(
		nbarY === undefined ? 0 : nbarY - box.T < 14 * k ? nbarY + 13 * k : nbarY - 5 * k
	);

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const slabSaid = $derived(
		slab.kind === 'thermal'
			? `at ${tempText(slab.T)}`
			: slab.kind === 'stop'
				? 'with its two levels equally filled'
				: `with an inverted population, ${numberText(slab.Pu, 3)} of it in the upper level`
	);
	const sceneDescription = $derived(
		`A slab of two-level matter ${slabSaid}: the lower level holds ${numberText(slab.Pl, 3)} of the matter and the upper ${numberText(slab.Pu, 3)}. ` +
			`Arrows between the levels stand for absorption, stimulated emission and spontaneous emission. A ray enters from the left with ${numberText(n0, 3)} quanta in each mode and leaves on the right with ${numberText(r.leaving, 3)}.`
	);
	const stripDescription = $derived(
		`The occupation n_ω along the ray inside the slab, against the depth κs from 0.001 to 10, both on scales of powers of ten. ` +
			`It enters at ${numberText(n0, 3)} and is ${numberText(occupationAt(n0, slab, 1), 3)} at κs = 1 and ${numberText(r.leaving, 3)} at κs = 10. ` +
			(r.nbar === undefined
				? 'The populations have no positive temperature, so no thermal occupation is drawn.'
				: w.nbarOff
					? `The slab's own occupation n̄(T) = ${numberText(r.nbar, 3)} lies ${w.nbarOff} the strip.`
					: `A dashed line marks the slab's own occupation n̄(T) = ${numberText(r.nbar, 3)}.`)
	);

	// --- the sliders' ticks -------------------------------------------------------------------------------------------
	const TEMP_MARKS = [
		{ at: tempPosition(ROOM_T), label: 'T = 293 K, a room' },
		{ at: tempPosition(BLOCK_T), label: 'T = 1500 K, the furnace’s hot block' },
		{ at: TEMP.stop, label: 'the stop: both levels equally filled, T → ∞; past it, inverted' }
	];
	const blockNbar = ownOccupation(thermal(BLOCK_T))!;
	const enterMarks = $derived.by(() => {
		const marks: { at: number; label: string }[] = [];
		if (
			r.nbar !== undefined &&
			Math.log10(r.nbar) > ENTER.low &&
			Math.log10(r.nbar) <= ENTER.high
		) {
			marks.push({
				at: enteringPosition(r.nbar),
				label: `n̄(T) = ${numberText(r.nbar, 3)}, the slab’s own occupation`
			});
		}
		if (marks.every((m) => Math.abs(m.at - Math.log10(blockNbar)) > 0.05)) {
			marks.push({
				at: enteringPosition(blockNbar),
				label: `${numberText(blockNbar, 3)}, the glow of a body at 1500 K`
			});
		}
		return marks;
	});
</script>

{#snippet power10(e: number, dy: number)}{#if e === 0}1{:else if e === 1}10{:else}10<tspan
			class="exp"
			dy={-dy}>{e < 0 ? `−${-e}` : e}</tspan
		>{/if}{/snippet}

{#snippet sub(letter: string, index: string, s: number, rest: string)}<tspan class="it"
		>{letter}</tspan
	><tspan class="sub it" dy={2.5 * s}>{index}</tspan><tspan dy={-2.5 * s}>{rest}</tspan>{/snippet}

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
			/>{/each}</span
	>{/snippet}

<div class="detailed-balance">
	<div class="stage">
		<div class="top">
			<svg
				class="scene"
				viewBox="0 0 {SC.W} {SC.H}"
				role="img"
				aria-label={sceneDescription}
				{@attach fitText((value) => (u = value))}
			>
				<defs>
					<marker
						id="{uid}-head"
						viewBox="0 0 8 8"
						refX="7"
						refY="4"
						markerWidth="7"
						markerHeight="7"
						markerUnits="userSpaceOnUse"
						orient="auto-start-reverse"
					>
						<path class="head" d="M0,0.6L7.4,4L0,7.4Z" />
					</marker>
				</defs>

				<!-- the slab -->
				<rect
					class="slab"
					x={SC.slab[0]}
					y={SC.top}
					width={SC.slab[1] - SC.slab[0]}
					height={SC.bot - SC.top}
					rx="3"
				/>
				<text class="small matter mid" x={(SC.slab[0] + SC.slab[1]) / 2} y={SC.top + 24 * u}
					>{#if shownSlab.kind === 'thermal'}<tspan class="it">T</tspan> = {tempText(
							shownSlab.T
						)}{:else if shownSlab.kind === 'stop'}{@render sub('P', 'u', u, ' = ')}{@render sub(
							'P',
							'l',
							u,
							''
						)}{:else}inverted{/if}</text
				>

				<!-- the two levels, each with a bar as long as its population -->
				{#each [{ name: 'u', y: SC.u, P: shownSlab.Pu }, { name: 'l', y: SC.l, P: shownSlab.Pl }] as level (level.name)}
					<rect
						class="track"
						x={SC.bar[0]}
						y={level.y - SC.thick}
						width={SC.bar[1] - SC.bar[0]}
						height={SC.thick}
					/>
					<rect
						class="fill"
						x={SC.bar[0]}
						y={level.y - SC.thick}
						width={Math.max(0, (SC.bar[1] - SC.bar[0]) * level.P)}
						height={SC.thick}
					/>
					<line class="level" x1={SC.bar[0]} x2={SC.bar[1]} y1={level.y} y2={level.y} />
					<text class="small matter end" x={SC.bar[0] - 7} y={level.y - 1}
						><tspan class="it">{level.name}</tspan></text
					>
					<text class="small matter" x={SC.bar[0]} y={level.y - SC.thick - 7 * u}
						>{@render sub('P', level.name, u, ` = ${numberText(level.P, 3)}`)}</text
					>
				{/each}

				<!-- the three exchanges: absorption up, stimulated emission down, spontaneous emission down, dashed -->
				<line
					class="exchange"
					x1={SC.arrows[0]}
					x2={SC.arrows[0]}
					y1={SC.reach[1]}
					y2={SC.reach[0]}
					marker-end="url(#{uid}-head)"
				/>
				<line
					class="exchange"
					x1={SC.arrows[1]}
					x2={SC.arrows[1]}
					y1={SC.reach[0]}
					y2={SC.reach[1]}
					marker-end="url(#{uid}-head)"
				/>
				<line
					class="exchange dashed"
					x1={SC.arrows[2]}
					x2={SC.arrows[2]}
					y1={SC.reach[0]}
					y2={SC.reach[1]}
					marker-end="url(#{uid}-head)"
				/>

				<!-- the ray, entering and leaving -->
				<line class="ray" x1="4" x2={SC.W - 6} y1={SC.ray} y2={SC.ray} />
				<line class="ray" x1="36" x2="70" y1={SC.ray} y2={SC.ray} marker-end="url(#{uid}-head)" />
				<line
					class="ray"
					x1={SC.W - 70}
					x2={SC.W - 36}
					y1={SC.ray}
					y2={SC.ray}
					marker-end="url(#{uid}-head)"
				/>
				<text class="small label" x="4" y={SC.ray - 12 * u}>entering</text>
				<text class="small value" x="4" y={SC.ray + 20 * u}
					>{@render sub('n', 'ω', u, ` = ${numberText(shownN0, 3)}`)}</text
				>
				<text class="small label end" x={SC.W - 4} y={SC.ray - 12 * u}>leaving</text>
				<text class="small value end" x={SC.W - 4} y={SC.ray + 20 * u}
					>{@render sub(
						'n',
						'ω',
						u,
						` = ${numberText(occupationAt(shownN0, shownSlab, D_MAX), 3)}`
					)}</text
				>
			</svg>

			<div class="counters">
				<p class="c-head">Per metre of ray at the front face</p>
				<dl class="rates">
					<div class="c-row">
						<dt><span class="glyph up" aria-hidden="true"></span>absorption</dt>
						<dd>{@render eq(['\\kappa P_l n_\\omega', `= ${kappa(r.absorption)}`])}</dd>
					</div>
					<div class="c-row">
						<dt><span class="glyph down" aria-hidden="true"></span>stimulated emission</dt>
						<dd>{@render eq(['\\kappa P_u n_\\omega', `= ${kappa(r.stimulated)}`])}</dd>
					</div>
					<div class="c-row">
						<dt><span class="glyph down dashed" aria-hidden="true"></span>spontaneous emission</dt>
						<dd>{@render eq(['\\kappa P_u', `= ${kappa(r.spontaneous)}`])}</dd>
					</div>
				</dl>
				<dl class="rates made">
					<div class="c-row">
						<dt>net absorption</dt>
						<dd>
							{@render eq(['\\alpha = \\kappa(P_l - P_u)', `= ${kappa(r.alpha)}`])}
						</dd>
					</div>
					<div class="c-row">
						<dt>emissivity</dt>
						<dd>
							{@render eq([
								'j_\\omega = \\kappa P_u\\,\\dfrac{\\hbar\\omega^3}{4\\pi^3c^2}',
								`= ${kappa(r.j)}\\;${UNIT}`
							])}
						</dd>
					</div>
				</dl>
				<dl class="rates ratio">
					<div class="c-row">
						<dt>their ratio</dt>
						<dd>
							{#if r.ratio === undefined}
								<span class="item"
									><Tex math="j_\omega/\alpha" /><span class="also">has no value where</span><Tex
										math="\alpha = 0"
									/></span
								>
							{:else}
								{@render eq(['j_\\omega/\\alpha', `= ${numberTex(r.ratio, 3)}\\;${UNIT}`])}
							{/if}
						</dd>
					</div>
					<div class="c-row">
						<dt>Planck’s radiance</dt>
						<dd>
							{#if r.planck !== undefined && slab.kind === 'thermal'}
								{@render eq([
									`B_\\omega(${tempTex(slab.T)})`,
									`= ${numberTex(r.planck, 3)}\\;${UNIT}`
								])}
							{:else if slab.kind === 'stop'}
								{@render eq(['B_\\omega(T) \\to \\infty', '\\text{as } T \\to \\infty'])}
							{:else}
								<span class="also"
									>No positive temperature puts more matter in the upper level.</span
								>
							{/if}
						</dd>
					</div>
				</dl>
			</div>
		</div>

		<div class="strip">
			<p class="heading">
				Inside the slab: the occupation <Tex math="n_\omega" /> along the ray, from the front face to
				the back
			</p>
			<svg
				viewBox="0 0 {box.W} {box.H}"
				role="img"
				aria-label={stripDescription}
				{@attach fitText((value) => (k = value))}
			>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />
					</clipPath>
				</defs>

				<text class="title" x={box.L - (phone.current ? 36 : 46)} y={box.T - 16 * k}
					>{@render sub('n', 'ω', k, ', quanta per mode')}</text
				>

				<rect class="frame" x={box.L} y={box.T} width={box.R - box.L} height={box.B - box.T} />

				<g clip-path="url(#{uid}-plot)">
					{#each yTicks as e (e)}
						<line class="grid" x1={box.L} x2={box.R} y1={Y(e)} y2={Y(e)} />
					{/each}
				</g>
				{#each yTicks as e (e)}
					{#if Y(e) >= box.T - 0.5 && Y(e) <= box.B + 0.5}
						<text class="small y-tick" x={box.L - 5 * k} y={Y(e) + 3.5 * k}
							>{@render power10(e, 4.5 * k)}</text
						>
					{/if}
				{/each}
				{#each D_LABELS as t (t.at)}
					<line class="grid" x1={X(t.at)} x2={X(t.at)} y1={box.T} y2={box.B} />
					<text class="small tick" x={X(t.at)} y={box.B + 15 * k}>{t.text}</text>
				{/each}
				{#each MINOR as at (at)}
					<line class="minor" x1={X(at)} x2={X(at)} y1={box.B} y2={box.B + 3 * k} />
				{/each}
				<text class="small dim end" x={box.R} y={box.B + 31 * k}
					>depth into the slab, <tspan class="it">κs</tspan></text
				>
				<text class="small dim" x={box.L} y={box.B + 31 * k}>front face</text>

				<!-- the slab's own occupation -->
				{#if nbarY !== undefined}
					<line class="nbar" x1={box.L} x2={box.R} y1={nbarY} y2={nbarY} />
					<text class="small words end" x={box.R - 12 * k} y={nbarLabelY}
						><tspan class="it">n̄</tspan>(<tspan class="it">T</tspan>)</text
					>
				{/if}

				<!-- the occupation along the ray -->
				<g clip-path="url(#{uid}-plot)">
					<path class="curve-halo" d={curvePath} />
					<path class="curve" d={curvePath} />
				</g>
				{#if leavingY !== undefined && leavingY >= box.T && leavingY <= box.B}
					<circle class="dot" cx={box.R} cy={leavingY} r={3.2 * k} />
				{/if}
			</svg>

			<ul class="legend" aria-hidden="true">
				<li>
					<span class="swatch curve-key"></span><span
						>the occupation <Tex math="n_\omega" /> along the ray, and its value leaving at <Tex
							math="\kappa s = 10"
						/></span
					>
				</li>
				<li>
					<span class="swatch nbar-key"></span><span
						>the slab’s own occupation <Tex
							math="\bar n(T) = 1/(e^x - 1)"
						/>{#if r.nbar === undefined}, which these populations do not have{:else if w.nbarOff},
							here <Tex math={numberTex(r.nbar, 3)} />, {w.nbarOff} the strip{/if}</span
					>
				</li>
				<li><span class="swatch slab-key"></span><span>the slab’s matter</span></li>
			</ul>
		</div>
	</div>

	<div class="bar">
		<div class="sliders">
			<div onkeydowncapture={pageT} role="presentation">
				<Slider
					id="{uid}-temperature"
					label="Slab"
					icon={ThermometerIcon}
					min={TEMP.low}
					max={TEMP.high}
					step={TEMP.step}
					bind:value={() => p, setTemp}
					readout={slabWords(slab)}
					ends={['10 K', 'inverted']}
					marks={TEMP_MARKS}
					marksHint="the ticks mark a room, the hot block and the stop"
				/>
			</div>
			<div onkeydowncapture={pageN} role="presentation">
				<Slider
					id="{uid}-entering"
					label="Radiation entering"
					icon={FlashlightIcon}
					min={ENTER.low}
					max={ENTER.high}
					step={ENTER.step}
					bind:value={() => v, setEntering}
					readout={enteringWords(n0)}
					ends={['0', '10³']}
					marks={enterMarks}
					marksHint="the ticks mark the slab’s own occupation and a body at 1500 K"
				/>
			</div>
		</div>
		<p class="hint">
			Drag the sliders, or press a tick to go to its value. With the keyboard, reach each with Tab:
			the arrow keys step a hundredth of a power of ten, and Page Up and Page Down a fifth of one in <Tex
				math="T"
			/> and half of one in <Tex math="n_\omega" />; Home and End go to the ends. Past the stop at
			the top of the temperatures, each step of the arrow keys moves 0.4% of the matter to the upper
			level.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The slab</dt>
				<dd>
					{@render eq(slabTex)}{@render eq(populationTex)}
				</dd>
			</div>
			<div class="row">
				<dt>The radiation</dt>
				<dd>
					<span class="item"
						><span class="also">entering</span>
						<Tex math={`n_\\omega = ${numberTex(n0, 3)}`} /></span
					>
					{#if nbarTex.length}<span class="item"
							><span class="also">the slab’s own</span> {@render eq(nbarTex)}</span
						>{/if}
					<span class="item"
						><span class="also">leaving, at <Tex math="\kappa s = 10" /></span>
						<Tex math={`n_\\omega = ${numberTex(r.leaving, 3)}`} /></span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Everything is at the one frequency <Tex math={FREQ_TEX} />, near the peak of a room’s glow, for
		one pair of levels <Tex math="\hbar\omega" /> apart with <Tex math="P_l + P_u = 1" />. The rates
		and the coefficients are per metre of ray and in units of <Tex math="\kappa" />, the chance per
		metre that a quantum is absorbed by matter all in its lower level, so <Tex math="\kappa" /> itself
		is never given a value; the rates are those of the radiation at the front face. The depth
		<Tex math="\kappa s" /> is the optical depth the slab would have with all its matter in the lower
		level; its own is <Tex math="\tau = \alpha s = (P_l - P_u)\,\kappa s" />. The radiances are in <Tex
			math={UNIT}
		/>, W m⁻² sr⁻¹ per s⁻¹. The strip’s axis up the side follows the curve, in whole powers of ten.
		The arrows between the levels are schematic; every bar, curve and number is exact.
	</p>
</div>

<style>
	.detailed-balance {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the picture ----------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.top {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		gap: 0.6rem 1.1rem;
		align-items: center;
	}

	.strip {
		margin-top: 0.7rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--line);
	}

	.heading {
		margin: 0 0 0.35rem;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--text-dim);
		text-wrap: pretty;
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

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.label {
		fill: var(--text);
		font-weight: 500;
	}

	.value {
		fill: var(--text);
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	.mid {
		text-anchor: middle;
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

	.sub.it {
		font-size: 0.86em;
	}

	.words {
		fill: var(--text);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the slab is matter (NOTATION.md): its body, its levels and their populations in the matter's colour; the
	   radiation, its occupation and the exchanges stay in the ink */
	.slab {
		fill: color-mix(in srgb, var(--q-matter) 9%, transparent);
		stroke: color-mix(in srgb, var(--q-matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.matter {
		fill: var(--q-matter);
	}

	.track {
		fill: color-mix(in srgb, var(--q-matter) 14%, transparent);
	}

	.fill {
		fill: color-mix(in srgb, var(--q-matter) 80%, transparent);
	}

	.level {
		stroke: var(--q-matter);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.exchange {
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.exchange.dashed {
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.head {
		fill: var(--text);
	}

	.ray {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.frame {
		fill: color-mix(in srgb, var(--q-matter) 6%, transparent);
		stroke: color-mix(in srgb, var(--q-matter) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 8%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.minor {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.curve {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve-halo {
		fill: none;
		stroke: var(--bg-raised);
		stroke-width: calc(3.6px * var(--u, 1));
		stroke-opacity: 0.6;
		stroke-linejoin: round;
	}

	.nbar {
		stroke: color-mix(in srgb, var(--text) 65%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the counters ----------------------------------------------------------------------- */

	.counters {
		min-width: 0;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.c-head {
		margin: 0 0 0.35rem;
		font-size: 0.76rem;
		color: var(--text-dim);
	}

	/* the chapter's own lists of definitions are styled for the text: these keep their own */
	.rates {
		margin: 0;
		display: grid;
		gap: 0.3rem;
	}

	.rates + .rates {
		margin-top: 0.45rem;
		padding-top: 0.45rem;
		border-top: 1px solid var(--line);
	}

	.c-row {
		display: grid;
		gap: 0.05rem;
	}

	.c-row dt {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--text-dim);
	}

	.c-row dd {
		margin: 0;
		min-width: 0;
		font-variant-numeric: tabular-nums;
	}

	/* each rate's arrow, as drawn between the levels */
	.glyph {
		flex: none;
		position: relative;
		display: inline-block;
		width: 0.55rem;
		height: 0.8rem;
	}

	.glyph::before {
		content: '';
		position: absolute;
		left: calc(50% - 0.65px);
		top: 0.12rem;
		bottom: 0.12rem;
		border-left: 1.3px solid var(--text);
	}

	.glyph.dashed::before {
		border-left-style: dashed;
	}

	.glyph::after {
		content: '';
		position: absolute;
		left: calc(50% - 0.22rem);
		border-left: 0.22rem solid transparent;
		border-right: 0.22rem solid transparent;
	}

	.glyph.up::after {
		top: 0;
		border-bottom: 0.3rem solid var(--text);
	}

	.glyph.down::after {
		bottom: 0;
		border-top: 0.3rem solid var(--text);
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
		border-top: 1.6px solid;
	}

	.curve-key {
		border-color: var(--text);
	}

	.nbar-key {
		border-top: 1.4px dashed color-mix(in srgb, var(--text) 65%, transparent);
	}

	.slab-key {
		width: 0.9rem;
		height: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--q-matter) 55%, transparent);
		border-radius: 2px;
		background: color-mix(in srgb, var(--q-matter) 12%, transparent);
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
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

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.3em;
		min-width: 0;
		max-width: 100%;
	}

	.item {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.4em;
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
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
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.top {
			grid-template-columns: minmax(0, 1fr);
		}

		.sliders {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
