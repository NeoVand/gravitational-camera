<script lang="ts">
	/**
	 * Chapter 12.1's inspiral: two compact bodies on a circular Newtonian orbit, and the time they have left. Panel 1,
	 * in units of the separation d and not to scale otherwise: the pair turning about its centre of mass, each body
	 * at d m_other/M from it, in the matter colour (above three solar masses as chapter 11.1's near-black disc), with
	 * the waves' two crests in the field colour where the retarded phase of the turning pair puts them, and the edge
	 * of the near zone, λ/2π, dashed when it falls inside the drawing. Panel 2: the pair as a dot on chapter 0.1's map
	 * of the regimes, at its wave frequency and its separation, with its track from d_min to 10⁶ km; the frame, ticks
	 * and edge come from ./regime-map.ts, drawn here as a small copy of that figure's axes in neutral tints. Two log
	 * sliders set the masses, 0.3 to 60 solar masses; a third sets d from 3(r_s1 + r_s2) to 10⁶ km, or, with the
	 * switch, the time to merger over the same range. Presets: the paper's pair, neutron stars, white dwarfs. The
	 * arithmetic is in ./inspiral.ts. The chapter's try box asks the predictions, so the figure answers none of them
	 * in words: it shows the live values only. The pair turns at a drawn rate unless motion is reduced; then it
	 * waits for the play button.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		Atom01Icon,
		BlackHole01Icon,
		HourglassIcon,
		PauseIcon,
		PlayIcon,
		RulerIcon,
		StarIcon,
		WeightIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { superscript } from '../../ui/format';
	import { FRAME, TICKS, ZONE_NAMES_AT, edgeInFrame, nearZone, zones } from './regime-map';
	import {
		FARTHEST,
		HOLE_FROM,
		MASS,
		MASS_MARKS,
		PAGE,
		PAPER_SEPARATION,
		PRESETS,
		PRESET_ORDER,
		TEN_SECONDS,
		clamp,
		crestAngle,
		drawnPeriod,
		drawnRadius,
		frequencyTex,
		frequencyText,
		leastSeparation,
		leaving,
		lengthTex,
		lengthText,
		massText,
		mergerTime,
		numTex,
		numText,
		onMap,
		pair,
		presetOf,
		separationFor,
		separationScale,
		snap,
		stepFrom,
		timeScale,
		timeTex,
		timeText,
		track,
		type PresetName,
		type Scale
	} from './inspiral';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let m1 = $state(PRESETS.paper.m1);
	let m2 = $state(PRESETS.paper.m2);
	/** The separation, m: kept exactly as a preset or the time sets it, and on the slider's grid as it is dragged. */
	let d = $state(PRESETS.paper.d);
	/** Whether the third slider sets the time to merger instead of the separation, and the time it last set. */
	let byTime = $state(false);
	let held = $state(mergerTime(PRESETS.paper.m1, PRESETS.paper.m2, PRESETS.paper.d));

	const dMin = $derived(leastSeparation(m1, m2));
	const sScale = $derived(separationScale(m1, m2));
	const tScale = $derived(timeScale(m1, m2));

	/** The separation for the masses now: the same d, or, when the time is being set, the d of that time. */
	function settle() {
		const lo = leastSeparation(m1, m2);
		d = clamp(byTime ? separationFor(m1, m2, held) : d, lo, FARTHEST);
	}

	function setMass(which: 1 | 2, logM: number) {
		const m = 10 ** clamp(logM, MASS.lo, MASS.hi);
		if (which === 1) m1 = m;
		else m2 = m;
		settle();
	}

	function setSeparation(logD: number) {
		d = clamp(10 ** logD, leastSeparation(m1, m2), FARTHEST);
		held = mergerTime(m1, m2, d);
	}

	function setTime(logT: number) {
		const s = timeScale(m1, m2);
		held = 10 ** clamp(logT, s.lo, s.hi);
		d = clamp(separationFor(m1, m2, held), leastSeparation(m1, m2), FARTHEST);
	}

	// a drag lands exactly on a mark it comes within half a step of
	const MASS_AT = MASS_MARKS.map(Math.log10);
	const dragMass = (which: 1 | 2) => (v: number) => setMass(which, snap(v, MASS, MASS_AT));
	const dragThird = (v: number) =>
		byTime
			? setTime(snap(v, tScale, [Math.log10(TEN_SECONDS)]))
			: setSeparation(snap(v, sScale, [Math.log10(PAPER_SEPARATION)]));

	function choose(name: PresetName) {
		m1 = PRESETS[name].m1;
		m2 = PRESETS[name].m2;
		d = PRESETS[name].d;
		held = mergerTime(m1, m2, d);
	}

	function switchTime(on: boolean) {
		byTime = on;
		held = mergerTime(m1, m2, d);
	}

	/**
	 * The keys, the same on every slider: the arrows one of its equal steps, Page Up and Page Down ten, Home and End
	 * its ends, exactly. A step from a preset's value goes to the next point of the grid beyond it.
	 */
	function keys(get: () => number, scale: () => Scale, set: (v: number) => void) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const by: Record<string, number> = {
				ArrowRight: 1,
				ArrowUp: 1,
				ArrowLeft: -1,
				ArrowDown: -1,
				PageUp: PAGE,
				PageDown: -PAGE
			};
			const s = scale();
			let next: number | undefined;
			if (e.key === 'Home') next = s.lo;
			else if (e.key === 'End') next = s.hi;
			else if (e.key in by) next = stepFrom(get(), s, by[e.key]);
			if (next === undefined) return;
			e.preventDefault();
			set(next);
		};
	}

	const thirdValue = () => Math.log10(byTime ? mergerTime(m1, m2, d) : d);
	const thirdScale = () => (byTime ? tScale : sScale);
	const thirdSet = (v: number) => (byTime ? setTime(v) : setSeparation(v));

	// --- the numbers ------------------------------------------------------------------------------------------------
	const p = $derived(pair(m1, m2, d));
	const warn = $derived(leaving(p));
	const preset = $derived(presetOf(m1, m2, d));

	// --- the turning: a drawn rate, faster as the pair closes; waiting for the play button under reduced motion ----
	let phase = $state(0.5);
	let playing = $state(true);
	let checked = false;
	const period = $derived(drawnPeriod(p.omega));

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
			phase = (phase + (dt * 2 * Math.PI) / period) % (2 * Math.PI);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the pair, in units of d ----------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const scene = $derived(phone.current ? { W: 360, H: 262, D: 48 } : { W: 300, H: 300, D: 54 });
	const cx = $derived(scene.W / 2);
	const cy = $derived(scene.H / 2);
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (x: number) => x.toFixed(1);
	const f2 = (x: number) => x.toFixed(2);

	/** A point at r (drawing units) and angle θ, anticlockwise on the page, from the centre of mass. */
	const at = (r: number, th: number): [number, number] => [
		cx + r * Math.cos(th),
		cy - r * Math.sin(th)
	];

	const bodies = $derived([
		{ key: 1, m: m1, r: (scene.D * m2) / p.M, th: phase },
		{ key: 2, m: m2, r: (scene.D * m1) / p.M, th: phase + Math.PI }
	]);

	/** The two crests, from just beyond the bodies to the corners of the drawing. */
	const crests = $derived.by(() => {
		const r0 = Math.max(m1, m2) / p.M + 0.3;
		const r1 = Math.hypot(scene.W, scene.H) / 2 / scene.D;
		const n = 72;
		return [0, 1].map((k) => {
			let path = '';
			for (let i = 0; i <= n; i++) {
				const r = r0 + ((r1 - r0) * i) / n;
				const [x, y] = at(r * scene.D, crestAngle(phase, r, p.depth, k));
				path += `${i ? 'L' : 'M'}${f2(x)},${f2(y)}`;
			}
			return { k, path };
		});
	});

	/** The edge of the near zone, λ/2π, in drawing units, if it falls inside the drawing. */
	const edgeR = $derived(scene.D / p.depth);
	const edgeShown = $derived(edgeR < Math.min(scene.W, scene.H) / 2 - 8);

	// --- the map of the regimes, as chapter 0.1 draws it -----------------------------------------------------------
	const map = $derived(
		phone.current
			? { W: 360, H: 262, L: 40, R: 352, T: 8, B: 226 }
			: { W: 400, H: 300, L: 46, R: 390, T: 10, B: 262 }
	);
	const [LF0, LF1] = FRAME.lf;
	const [LR0, LR1] = FRAME.lr;
	const X = (lf: number) => map.L + ((lf - LF0) / (LF1 - LF0)) * (map.R - map.L);
	const Y = (lr: number) => map.B - ((lr - LR0) / (LR1 - LR0)) * (map.B - map.T);
	type Point = { lf: number; lr: number };
	const polygon = (pts: Point[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f1(X(q.lf))},${f1(Y(q.lr))}`).join('') + 'Z';
	const shade = zones();
	const edge = edgeInFrame();
	const nearPath = $derived(polygon(shade.near));
	const wavePath = $derived(polygon(shade.wave));
	const edgePath = $derived(
		`M${f1(X(edge[0].lf))},${f1(Y(edge[0].lr))}L${f1(X(edge[1].lf))},${f1(Y(edge[1].lr))}`
	);
	const power = (n: number) => (n === 0 ? '1' : `10${superscript(n)}`);

	const dot = $derived(onMap(p));
	const path = $derived(track(m1, m2));
	/** The point of the edge straight above the dot: the separation at which d would equal λ/2π. */
	const tieTop = $derived(Math.log10(nearZone(p.f)));

	// --- the words --------------------------------------------------------------------------------------------------
	const mm = (i: string) => `\\htmlClass{q-matter}{m}_${i}`;
	const MM = '\\htmlClass{q-matter}{M}';
	const sun = '\\,M_\\odot';

	const pairTex = $derived([
		`${mm('1')} = ${numTex(m1)}${sun}`,
		`${mm('2')} = ${numTex(m2)}${sun}`,
		`d = ${lengthTex(d)}`
	]);
	const leastTex = $derived(`3(r_{s1} + r_{s2}) = ${lengthTex(dMin)}`);
	const omegaTex = $derived(`\\Omega = (G${MM}/d^3)^{1/2} = ${numTex(p.omega)}\\,\\mathrm{s^{-1}}`);
	const fTex = $derived(`f_{\\rm GW} = \\Omega/\\pi = ${frequencyTex(p.f)}`);
	const v1Tex = $derived(`v_1/c = \\Omega d\\,${mm('2')}/${MM}c = ${numTex(p.v1)}`);
	const v2Tex = $derived(`v_2/c = ${numTex(p.v2)}`);
	const lambdaTex = $derived(`\\lambda = c/f_{\\rm GW} = ${lengthTex(p.lambda)}`);
	const reducedTex = $derived(`\\lambda/2\\pi = ${lengthTex(p.reduced)}`);
	const depthTex = $derived(`d/(\\lambda/2\\pi) = ${numTex(p.depth)}`);
	const tauTex = $derived([
		`\\tau = (5/256)\\,c^5d^4/G^3${mm('1')}${mm('2')}${MM}`,
		`= ${timeTex(p.tau)}`
	]);

	const PRESET_NAMES: Record<PresetName, { label: string; icon: typeof StarIcon }> = {
		paper: { label: 'The paper’s pair', icon: BlackHole01Icon },
		neutron: { label: 'Neutron stars', icon: Atom01Icon },
		dwarfs: { label: 'White dwarfs', icon: StarIcon }
	};

	const MASS_TICKS = [
		{ at: Math.log10(0.6), label: '0.6 solar masses, the white dwarfs' },
		{ at: Math.log10(1.4), label: '1.4 solar masses, the neutron stars' },
		{ at: Math.log10(30), label: '30 solar masses, the paper’s black holes' }
	];

	const third = $derived(
		byTime
			? {
					label: 'Time to merger',
					icon: HourglassIcon,
					scale: tScale,
					value: Math.log10(p.tau),
					readout: `τ = ${timeText(p.tau)}`,
					ends: [timeText(10 ** tScale.lo), timeText(10 ** tScale.hi)] as [string, string],
					marks: [{ at: Math.log10(TEN_SECONDS), label: '10 s, Section XI’s “ten seconds”' }],
					hint: 'the tick marks Section XI’s ten seconds'
				}
			: {
					label: 'Separation',
					icon: RulerIcon,
					scale: sScale,
					value: Math.log10(d),
					readout: `d = ${lengthText(d)}`,
					ends: [lengthText(dMin), '10⁶ km'] as [string, string],
					marks: [{ at: Math.log10(PAPER_SEPARATION), label: '2200 km, the paper’s pair' }],
					hint: 'the tick marks the paper’s 2200 km'
				}
	);

	const kind = (m: number) => (m > HOLE_FROM ? 'a black hole' : 'a compact star');
	const sceneDescription = $derived(
		`Two bodies turning about their centre of mass, drawn in units of their separation: body 1 of ${massText(m1)} solar masses, ${kind(m1)}, and body 2 of ${massText(m2)}, ${kind(m2)}, the heavier nearer the centre. ` +
			`Two crests of the waves curve out from the pair, bending back by the angle that the waves' travel at the speed of light puts in them. ` +
			(edgeShown
				? `A dashed circle at ${numText(1 / p.depth)} separations marks the edge of the near zone. `
				: `The edge of the near zone, ${numText(1 / p.depth)} separations out, lies beyond the drawing. `) +
			`Not to scale; the pair ${playing ? 'turns far slower than the real one' : 'is drawn still'}.`
	);
	const mapDescription = $derived(
		`Chapter 0.1's map of the regimes: frequency from 10⁻⁹ to 10¹⁹ hertz against distance from 0.1 metre to 10¹² metres, the near field below and left of the line r = c over 2 pi f, the wave zone above it. ` +
			`The pair is a dot at its wave frequency, ${frequencyText(p.f)}, and its separation, ${lengthText(d)}, on a straight line that is its track from ${lengthText(dMin)} to a million kilometres; the dot is ${numText(p.depth)} of the way up to the edge.`
	);
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex math={part} trust />{/each}</span
	>{/snippet}

<div class="inspiral">
	<section class="panel scene" aria-label="The pair turning">
		<div class="stage">
			<p class="heading">The pair, in units of its separation; not to scale</p>
			<svg
				viewBox="0 0 {scene.W} {scene.H}"
				role="img"
				aria-label={sceneDescription}
				{@attach fitText((value) => (u = value))}
				{@attach clock}
			>
				<defs>
					<radialGradient id="{uid}-stone" cx="0.38" cy="0.34" r="0.75">
						<stop offset="0" class="stone-0" />
						<stop offset="0.65" class="stone-1" />
						<stop offset="1" class="stone-2" />
					</radialGradient>
					<clipPath id="{uid}-scene">
						<rect width={scene.W} height={scene.H} />
					</clipPath>
				</defs>

				<g clip-path="url(#{uid}-scene)">
					{#each crests as c (c.k)}
						<path class="crest" d={c.path} />
					{/each}
					{#if edgeShown}
						<circle class="near-edge" {cx} {cy} r={edgeR} />
						<text
							class="small words"
							x={cx + edgeR * Math.SQRT1_2 + 4 * u}
							y={cy - edgeR * Math.SQRT1_2 - 4 * u}><tspan class="it">λ</tspan>/2π</text
						>
					{/if}
				</g>

				{#each bodies as b (b.key)}
					<circle class="orbit" {cx} {cy} r={b.r} />
				{/each}
				<line class="cross" x1={cx - 4 * u} y1={cy} x2={cx + 4 * u} y2={cy} /><line
					class="cross"
					x1={cx}
					y1={cy - 4 * u}
					x2={cx}
					y2={cy + 4 * u}
				/>

				{#each bodies as b (b.key)}
					{@const [x, y] = at(b.r, b.th)}
					{@const R = drawnRadius(b.m) * scene.D * 1.6}
					{@const [lx, ly] = at(b.r + R + 9 * u, b.th)}
					{#if b.m > HOLE_FROM}
						<circle class="hole" cx={f1(x)} cy={f1(y)} r={R} />
					{:else}
						<circle class="stone" cx={f1(x)} cy={f1(y)} r={R} fill="url(#{uid}-stone)" />
					{/if}
					<text class="small words mid" x={f1(lx)} y={f1(ly + 3.8 * u)}>{b.key}</text>
				{/each}

				<text class="fine dim" x={8 * u} y={scene.H - 8 * u}>not to scale</text>
			</svg>
			<ul class="legend" aria-hidden="true">
				<li><span class="swatch body-key"></span>a compact star</li>
				<li><span class="swatch hole-key"></span>a black hole, above 3 solar masses</li>
				<li><span class="swatch crest-key"></span>the waves’ crests</li>
				<li>
					<span class="swatch edge-key"></span><span
						>the near zone’s edge, <Tex math="\lambda/2\pi" />{edgeShown
							? ''
							: ', beyond the drawing'}</span
					>
				</li>
			</ul>
		</div>
	</section>

	<section class="panel map" aria-label="The pair on the map of the regimes">
		<div class="stage">
			<p class="heading">The pair on chapter 0.1’s map of the regimes</p>
			<svg
				viewBox="0 0 {map.W} {map.H}"
				role="img"
				aria-label={mapDescription}
				{@attach fitText((value) => (v = value))}
			>
				<defs>
					<clipPath id="{uid}-frame">
						<rect x={map.L} y={map.T} width={map.R - map.L} height={map.B - map.T} />
					</clipPath>
				</defs>

				<path class="zone near" d={nearPath} />
				<path class="zone wave" d={wavePath} />
				<path class="edge" d={edgePath} />
				<rect class="frame" x={map.L} y={map.T} width={map.R - map.L} height={map.B - map.T} />
				{#each TICKS.lf as lf (lf)}
					<line class="tick" x1={X(lf)} y1={map.B} x2={X(lf)} y2={map.B + 4 * v} />
					<text class="fine mid" x={X(lf)} y={map.B + 15 * v}>{power(lf)}</text>
				{/each}
				{#each TICKS.lr as lr (lr)}
					<line class="tick" x1={map.L - 4 * v} y1={Y(lr)} x2={map.L} y2={Y(lr)} />
					<text class="fine end" x={map.L - 6 * v} y={Y(lr) + 3.6 * v}>{power(lr)}</text>
				{/each}
				<text class="small mid" x={(map.L + map.R) / 2} y={map.B + 30 * v}
					>frequency, <tspan class="it">f</tspan> (Hz)</text
				>
				<text
					class="small mid"
					transform="translate({f1(map.L - 30 * v)} {f1((map.T + map.B) / 2)}) rotate(-90)"
					>separation, <tspan class="it">d</tspan> (m)</text
				>
				<text class="zone-name" x={map.L + 8 * v} y={Y(ZONE_NAMES_AT) + 4.5 * v}>near field</text>
				<text class="zone-name end" x={map.R - 8 * v} y={Y(ZONE_NAMES_AT) + 4.5 * v}>wave zone</text
				>

				<g clip-path="url(#{uid}-frame)">
					<line
						class="track"
						x1={X(path.a.lf)}
						y1={Y(path.a.lr)}
						x2={X(path.b.lf)}
						y2={Y(path.b.lr)}
					/>
					<line class="tie" x1={X(dot.lf)} y1={Y(dot.lr)} x2={X(dot.lf)} y2={Y(tieTop)} />
					<circle class="edge-point" cx={X(dot.lf)} cy={Y(tieTop)} r={2.6 * v} />
				</g>
				<circle class="dot" cx={X(dot.lf)} cy={Y(dot.lr)} r={4 * v} />
			</svg>
			<ul class="legend" aria-hidden="true">
				<li><span class="swatch dot-key"></span>the pair</li>
				<li>
					<span class="swatch track-key"></span><span
						>its track, from <Tex math={'d_{\\rm min}'} /> to <Tex
							math={'10^6\\,\\mathrm{km}'}
						/></span
					>
				</li>
				<li>
					<span class="swatch map-edge-key"></span><span>the edge, <Tex math="d = c/2\pi f" /></span
					>
				</li>
			</ul>
		</div>
	</section>

	<div class="bar">
		<div class="presets" role="group" aria-label="Pairs to load">
			{#each PRESET_ORDER as name (name)}
				<button type="button" aria-pressed={preset === name} onclick={() => choose(name)}>
					<HugeiconsIcon icon={PRESET_NAMES[name].icon} size={16} strokeWidth={1.7} />
					{PRESET_NAMES[name].label}
				</button>
			{/each}
		</div>
		<div class="masses">
			<div
				class="slot"
				role="presentation"
				onkeydowncapture={keys(
					() => Math.log10(m1),
					() => MASS,
					(x) => setMass(1, x)
				)}
			>
				<Slider
					id="{uid}-m1"
					label="Mass 1"
					icon={WeightIcon}
					min={MASS.lo}
					max={MASS.hi}
					step={MASS.step}
					bind:value={() => Math.log10(m1), dragMass(1)}
					readout="{massText(m1)} solar masses"
					ends={['0.3', '60']}
					marks={MASS_TICKS}
					marksHint="the ticks mark the presets’ bodies"
				/>
			</div>
			<div
				class="slot"
				role="presentation"
				onkeydowncapture={keys(
					() => Math.log10(m2),
					() => MASS,
					(x) => setMass(2, x)
				)}
			>
				<Slider
					id="{uid}-m2"
					label="Mass 2"
					icon={WeightIcon}
					min={MASS.lo}
					max={MASS.hi}
					step={MASS.step}
					bind:value={() => Math.log10(m2), dragMass(2)}
					readout="{massText(m2)} solar masses"
					ends={['0.3', '60']}
					marks={MASS_TICKS}
					marksHint="the ticks mark the presets’ bodies"
				/>
			</div>
		</div>
		<div class="slot" role="presentation" onkeydowncapture={keys(thirdValue, thirdScale, thirdSet)}>
			<!-- drawn afresh when the switch turns: the icon component draws the icon it is first given -->
			{#key byTime}
				<Slider
					id="{uid}-third"
					label={third.label}
					icon={third.icon}
					min={third.scale.lo}
					max={third.scale.hi}
					step={third.scale.step}
					bind:value={() => third.value, dragThird}
					readout={third.readout}
					ends={third.ends}
					marks={third.marks}
					marksHint={third.hint}
				/>
			{/key}
		</div>
		<div class="row-controls">
			<button
				type="button"
				class="play"
				aria-label={playing ? 'Stop the pair' : 'Turn the pair'}
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
			<div class="switch">
				<Toggle
					icon={HourglassIcon}
					label="Set the time instead"
					bind:checked={() => byTime, switchTime}
					hint="The third slider sets the time to merger, and the separation follows from it"
				/>
			</div>
		</div>
		<p class="hint">
			Choose a pair, or drag the masses and the separation. With the keyboard, reach each slider
			with Tab: the arrow keys move one step, Page Up and Page Down ten, and Home and End go to the
			ends. The switch makes the third slider set the time to merger; the play button starts and
			stops the pair.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The pair</dt>
				<dd>
					{#each pairTex as part, i (i)}{@render eq([part])}{/each}<span class="also"
						>its least separation is</span
					>{@render eq([leastTex])}
				</dd>
			</div>
			<div class="row">
				<dt>The orbit</dt>
				<dd>{@render eq([omegaTex])}{@render eq([fTex])}</dd>
			</div>
			<div class="row">
				<dt>The speeds</dt>
				<dd>{@render eq([v1Tex])}{@render eq([v2Tex])}</dd>
			</div>
			<div class="row">
				<dt>The waves</dt>
				<dd>{@render eq([lambdaTex])}{@render eq([reducedTex])}{@render eq([depthTex])}</dd>
			</div>
			<div class="row time">
				<dt>Time to merger</dt>
				<dd>{@render eq(tauTex)}</dd>
			</div>
		</dl>
		<p class={['warning', { on: warn }]} aria-live="polite">
			{#if warn}
				<HugeiconsIcon icon={Alert02Icon} size={15} strokeWidth={1.8} />
				<span>The Newtonian orbit is leaving its range: a body moves faster than 0.2 <i>c</i>.</span
				>
			{/if}
		</p>
	</div>

	<p class="note">
		Look first at the time to merger as you drag the separation. The readouts and the map are exact
		for the chapter’s model: Kepler’s orbit, kept circular and shrinking slowly, losing energy at
		the rate of the Newtonian quadrupole formula, with <Tex math={'G = 6.674\\times10^{-11}'} /> and <Tex
			math={'M_\\odot = 1.989\\times10^{30}\\,\\mathrm{kg}'}
		/>; past <Tex math="v/c = 0.2" /> its corrections, of order <Tex math="(v/c)^2" />, no longer
		stay small, and near <Tex math={'d_{\\rm min}'} /> it has failed. The white dwarfs are chapter 1.8’s
		pair, turning every ten minutes. The drawing is schematic: the separation is drawn the same at every
		<Tex math="d" />, the bodies’ sizes grow with their mass but are not to scale, a body above 3
		solar masses is drawn as a black hole, and the pair turns far slower than the real one. The
		crests are drawn where the retarded phase <Tex math="\Omega(t - r/c)" /> of the turning pair puts
		them, in units of <Tex math="d" />: true far out, while inside <Tex math="\lambda/2\pi" /> the field
		is no wave yet and turns with the pair. The map’s frame and edge are chapter 0.1’s, its zones drawn
		here in neutral tints.
	</p>
</div>

<style>
	.inspiral {
		/* the horizon is black on either ground */
		--hole: #050403;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
		display: grid;
		grid-template-columns: minmax(0, 300fr) minmax(0, 400fr);
		grid-template-areas:
			'scene map'
			'bar bar'
			'readouts readouts'
			'note note';
	}

	.scene {
		grid-area: scene;
	}

	.map {
		grid-area: map;
		border-left: 1px solid var(--line);
	}

	.bar {
		grid-area: bar;
	}

	.readouts {
		grid-area: readouts;
	}

	.note {
		grid-area: note;
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.8rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.35rem;
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

	.dim {
		fill: var(--text-faint);
	}

	.mid {
		text-anchor: middle;
	}

	.end {
		text-anchor: end;
	}

	/* words over the drawing keep a halo of the ground */
	.words {
		fill: var(--text-dim);
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	/* --- the pair ----------------------------------------------------------------------------- */

	.crest {
		fill: none;
		stroke: color-mix(in srgb, var(--q-field) 70%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linecap: round;
	}

	.near-edge {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.orbit {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.cross {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.stone {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.stone-0 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 55%,
			color-mix(in srgb, var(--text) 62%, var(--bg))
		);
	}

	.stone-1 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 38%,
			color-mix(in srgb, var(--text) 42%, var(--bg))
		);
	}

	.stone-2 {
		stop-color: color-mix(
			in srgb,
			var(--q-matter) 22%,
			color-mix(in srgb, var(--text) 24%, var(--bg))
		);
	}

	.hole {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	/* --- the map ------------------------------------------------------------------------------ */

	/* neutral tints: orange and blue are the figures' stretch and squeeze */
	.zone.near {
		fill: color-mix(in srgb, var(--text) 10%, transparent);
	}

	.zone.wave {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
	}

	.edge {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.frame {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.tick {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.zone-name {
		fill: var(--text-dim);
		font: italic 500 calc(13px * var(--u, 1)) / 1 var(--font-serif);
	}

	.track {
		stroke: color-mix(in srgb, var(--q-matter) 60%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.tie {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.edge-point {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.dot {
		fill: var(--q-matter);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	/* --- the legends ------------------------------------------------------------------------ */

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

	.body-key,
	.hole-key,
	.dot-key {
		width: 0.6rem;
		height: 0.6rem;
		border: 0.8px solid color-mix(in srgb, var(--text) 45%, transparent);
		border-radius: 50%;
	}

	.body-key {
		background: color-mix(
			in srgb,
			var(--q-matter) 45%,
			color-mix(in srgb, var(--text) 45%, var(--bg))
		);
	}

	.hole-key {
		background: var(--hole);
		border-color: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.dot-key {
		border: 0;
		background: var(--q-matter);
	}

	.crest-key {
		border-top: 1.6px solid color-mix(in srgb, var(--q-field) 70%, transparent);
	}

	.edge-key {
		border-top: 1.2px dashed color-mix(in srgb, var(--text) 50%, transparent);
	}

	.track-key {
		border-top: 2px solid color-mix(in srgb, var(--q-matter) 60%, transparent);
	}

	.map-edge-key {
		border-top: 1.5px solid var(--text);
	}

	/* --- the controls ------------------------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.75rem;
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

	.presets button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	.masses {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
	}

	.slot {
		min-width: 0;
	}

	.row-controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.switch {
		flex: 1;
		min-width: 0;
		max-width: 20rem;
	}

	.play {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.55rem;
		min-height: 2.55rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		cursor: pointer;
		transition: border-color 0.15s;
	}

	@media (hover: hover) {
		.play:hover {
			border-color: var(--accent);
		}
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

	/* --- the numbers -------------------------------------------------------------------------- */

	.readouts {
		padding: 0.75rem 0.9rem 0.6rem;
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

	.row.time dt {
		color: var(--text);
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

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	/* the warning keeps its line, so that nothing moves when it comes and goes */
	.warning {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 1.4rem;
		margin: 0.45rem 0 0;
		font-size: 0.78rem;
		color: var(--bad);
	}

	.warning :global(svg) {
		flex: none;
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

	/* a phone: the pair, its numbers, the controls, then the map */
	@media (max-width: 560px) {
		.inspiral {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				'scene'
				'readouts'
				'bar'
				'map'
				'note';
		}

		.map {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.readouts {
			border-top: 1px solid var(--line);
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.masses {
			grid-template-columns: minmax(0, 1fr);
		}

		.presets button {
			flex-direction: column;
			gap: 0.2rem;
			font-size: 0.72rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.presets button {
			transition: none;
		}
	}
</style>
