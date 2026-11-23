<script lang="ts">
	/**
	 * Same outside, different inside. Two bodies, A and B, chosen by the reader, cut through their centres and drawn
	 * with the field outside them, which is the same for both, and a table of what differs. Two families: round bodies
	 * of one mass (a core of radius aR holding a fraction f of the mass, in a mantle; presets the uniform ball, the
	 * thin shell, fig:hair's 8% shell and cored ball, the two-layer Earth), whose pull g(r) is plotted out to 3R; and
	 * the gold of the paper's fig:same-outside in a steel ball (a nugget at the distance s, its harmonic flush, its
	 * skin), with the equipotentials of the gold's share outside. Everything that differs rests on ∫ρ r² dV: the moment
	 * of inertia, the energy a quadrupolar kick leaves and the thermal tremor of the quadrupole. The numbers come from
	 * ./same-outside.ts. Two predictions at the top, one for each family, are answered once the reader has done what
	 * they ask.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { PinIcon, RadialIcon, WeightIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		EARTH_CORE_KM,
		EARTH_RADIUS_KM,
		EQUIPOTENTIALS,
		GOLD,
		GOLD_NAMES,
		ROUND,
		ROUND_NAMES,
		S_LEAST,
		S_MOST,
		S_PAPER,
		densities,
		flushPaths,
		flushTop,
		goldInertia,
		goldRelative,
		goldSecondMoment,
		inertia,
		isUniform,
		kickRelative,
		pull,
		roundName,
		secondMoment,
		skinPaths,
		skinTop,
		tremorRelative,
		type GoldName,
		type Layered,
		type RoundName
	} from './same-outside';

	const uid = $props.id();

	// --- the two families, and the two bodies of each ------------------------------------------------------------
	type Family = 'round' | 'gold';
	let family = $state<Family>('round');

	let roundA = $state<RoundName>('ball');
	let bodyB = $state<Layered>({ ...ROUND.cored.body });
	const bodyA = $derived(ROUND[roundA].body);
	const nameB = $derived(roundName(bodyB));

	let goldA = $state<GoldName>('nugget');
	let goldB = $state<GoldName>('flush');
	let s = $state(S_PAPER);

	// --- the predictions: one for each family ------------------------------------------------------------------------
	/** The largest ∫ρ r² dV that B has had, in units of MR². */
	let farthest = $state(secondMoment(ROUND.cored.body));
	let sawSkin = $state(false);
	const revealed = $derived(family === 'round' ? farthest >= 0.9 - 1e-9 : sawSkin);

	function setB(b: Layered) {
		bodyB = b;
		farthest = Math.max(farthest, secondMoment(b));
	}

	const round2 = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 100) / 100;
	function setCore(v: number) {
		setB({ a: round2(v), f: bodyB.f });
	}
	function setShare(v: number) {
		setB({ a: bodyB.a, f: round2(v) });
	}
	function setS(v: number) {
		s = Math.round(Math.max(S_LEAST, Math.min(S_MOST, v)) * 100) / 100;
	}

	function chooseGold(slot: 'A' | 'B', k: GoldName) {
		if (slot === 'A') goldA = k;
		else goldB = k;
		if (k === 'skin') sawSkin = true;
	}

	// --- the numbers -------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{M}';
	const m = '\\htmlClass{q-matter}{m}';
	const rho = '\\htmlClass{q-matter}{\\rho}';
	const rhoBar = '\\htmlClass{q-matter}{\\bar\\rho}';
	const moment = `\\int${rho}\\,r^2\\,\\mathrm{d}V`;

	const f3 = (v: number) => v.toFixed(3);
	/** Three figures, without a run of zeros: 46, 6.00 → 6, 895. */
	const sig = (v: number) => String(Number(v.toPrecision(3)));
	const pct = (v: number) => `${Math.round(v * 100)}%`;
	/** B over A, or a dash where A has none. */
	const ratio = (b: number, a: number) => (a > 1e-12 ? (b / a).toFixed(3) : '—');

	/** A few words on how a round body is built. */
	function law(b: Layered): string {
		const n = roundName(b);
		if (n === 'ball') return 'the same density throughout';
		if (n === 'shell') return 'all the mass at the surface';
		if (n === 'hair-shell') return 'all the mass in the outer 8% of the radius';
		if (n === 'earth')
			return `a core of ${EARTH_CORE_KM} km in ${EARTH_RADIUS_KM} km, 12,500 and 4150 kg m⁻³`;
		const { core, mantle } = densities(b);
		const where =
			b.a === 0
				? `a point at the centre holds ${pct(b.f)} of the mass`
				: `a core of ${b.a.toFixed(2)} R holds ${pct(b.f)} of the mass`;
		if (!Number.isFinite(core)) return `${where}; the rest is spread evenly`;
		if (!Number.isFinite(mantle)) return `${where}; the rest lies at the surface`;
		return `${where}; ${sig(core)} and ${sig(mantle)} times the mean density`;
	}

	function goldLaw(k: GoldName): string {
		if (k === 'nugget') return `all at ${s.toFixed(2)} R from the centre`;
		if (k === 'flush')
			return s === 0
				? 'spread evenly, 3 m/4πR³ throughout'
				: `up to ${sig(flushTop(s))} m/4πR³ at the near wall`;
		return s === 0
			? 'spread evenly over the surface'
			: `up to ${sig(skinTop(s))} m/4πR² over the nugget`;
	}

	const nameOfB = $derived(
		nameB ? ROUND[nameB].name : bodyB.a === 0 ? 'A point inside a ball' : 'A core and a mantle'
	);

	// --- the cut through a round body: its two densities as shading -------------------------------------------------
	function levels(b: Layered) {
		const { core, mantle } = densities(b);
		const finite = [core, mantle].filter((d) => Number.isFinite(d) && d > 0);
		const top = finite.length ? Math.max(...finite) : 1;
		const op = (d: number) => (Number.isFinite(d) ? 0.05 + (0.85 * d) / top : 0.05);
		return {
			core: op(core),
			mantle: op(mantle),
			point: !Number.isFinite(core),
			skin: !Number.isFinite(mantle),
			uniform: isUniform(b),
			boundary: b.a > 0 && b.a < 1 && !isUniform(b)
		};
	}

	/** The ring between the radii a and 1, the mantle, as an SVG path (the whole disc for a = 0). */
	function annulus(a: number) {
		const outer = 'M1 0A1 1 0 1 0 -1 0A1 1 0 1 0 1 0Z';
		return a > 0 ? `${outer}M${a} 0A${a} ${a} 0 1 1 ${-a} 0A${a} ${a} 0 1 1 ${a} 0Z` : outer;
	}

	/** The field lines outside a round body: twelve, pointing in, the same for every body. */
	const spokes = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

	// --- the gold: its bands, and the equipotentials outside ------------------------------------------------------
	const flushBands = $derived(flushPaths(s));
	const skinBands = $derived(skinPaths(s));
	const BAND_OPACITY = [0.92, 0.72, 0.56, 0.42, 0.3, 0.2];

	// --- the pull: one plot, the two bodies inside, one curve outside --------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const size = $derived(phone.current ? { w: 332, h: 210 } : { w: 672, h: 250 });
	const ax = $derived({ L: 34, R: size.w - 18, T: 10, B: size.h - 26 });

	const REACH = 3;
	const TOP = 1.6;
	const x = (r: number) => ax.L + ((ax.R - ax.L) * r) / REACH;
	const y = (g: number) => ax.B - ((ax.B - ax.T) * g) / TOP;
	const f1 = (n: number) => n.toFixed(1);
	const line = (pts: { r: number; g: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f1(x(q.r))},${f1(y(Math.min(q.g, 4 * TOP)))}`).join('');

	/** The r of a curve inside, dense near the centre, where a point's pull climbs fastest; its last point is just
	 * inside the surface, so that a skin shows as a step at R. */
	const insideR = Array.from({ length: 241 }, (_, i) => 0.9999 * (i / 240) ** 2);
	const insideOf = (b: Layered) =>
		line([...insideR.map((r) => ({ r, g: pull(r, b) })), { r: 1, g: 1 }]);
	const outsideR = Array.from({ length: 121 }, (_, i) => 1 + ((REACH - 1) * i) / 120);

	/** The greatest pull inside a body: at the core's surface or at R (none for a point at the centre). */
	const peak = (b: Layered) => (b.a > 0 ? Math.max(b.f / (b.a * b.a), 1) : b.f > 0 ? Infinity : 1);
	/** The curves that leave the top of the plot, with where and how high they peak. */
	const beyond = $derived(
		[bodyA, bodyB]
			.map((b) => ({ a: b.a, g: peak(b) }))
			.filter((p, i, all) => p.g > TOP && all.findIndex((q) => q.a === p.a) === i)
	);
	const curveA = $derived(insideOf(bodyA));
	const curveB = $derived(insideOf(bodyB));
	const outside = $derived(line(outsideR.map((r) => ({ r, g: 1 / (r * r) }))));
	const sameAt = $derived(phone.current ? 1.45 : 1.75);

	const ticksY = [0, 0.5, 1, 1.5];
	const ticksR = [
		{ r: 0, label: '0' },
		{ r: 1, label: 'R' },
		{ r: 2, label: '2R' },
		{ r: 3, label: '3R' }
	];

	const plotLabel = $derived(
		`The pull g against the distance r from the centre, out to three radii. Inside, A (${ROUND[
			roundA
		].name.toLowerCase()}) pulls with ${pull(0.5, bodyA).toFixed(2)} and B (${nameOfB.toLowerCase()}) with ${
			Number.isFinite(pull(0.5, bodyB)) ? pull(0.5, bodyB).toFixed(2) : 'more'
		} at half the radius; outside both pull with G M over r squared, a quarter of the surface pull at 2R.`
	);

	// --- the table -------------------------------------------------------------------------------------------------
	interface Row {
		head: string;
		/** a formula after the words of the head, if any */
		tex?: string;
		/** a few words under the head */
		sub?: string;
		a: string;
		b: string;
		/** "the same", or B over A */
		ratio: string;
		same?: boolean;
		/** the bars' lengths, 0 to 1 */
		bars?: [number, number];
	}

	const rows: Row[] = $derived.by(() => {
		if (family === 'round') {
			const [JA, JB] = [secondMoment(bodyA), secondMoment(bodyB)];
			const [IA, IB] = [inertia(bodyA), inertia(bodyB)];
			const [kA, kB] = [kickRelative(bodyA), kickRelative(bodyB)];
			const [tA, tB] = [tremorRelative(bodyA), tremorRelative(bodyB)];
			return [
				{ head: 'Mass', a: M, b: M, ratio: 'the same', same: true },
				{
					head: 'Pull at 2R',
					a: `${f3(pull(2, bodyA))}\\,G${M}/R^2`,
					b: `${f3(pull(2, bodyB))}\\,G${M}/R^2`,
					ratio: 'the same',
					same: true
				},
				{
					head: '',
					tex: moment,
					a: `${f3(JA)}\\,${M}R^2`,
					b: `${f3(JB)}\\,${M}R^2`,
					ratio: ratio(JB, JA),
					bars: [JA, JB]
				},
				{
					head: 'Moment of inertia',
					a: `${f3(IA)}\\,${M}R^2`,
					b: `${f3(IB)}\\,${M}R^2`,
					ratio: ratio(IB, IA),
					bars: [IA / (2 / 3), IB / (2 / 3)]
				},
				{
					head: 'Energy of a quadrupolar kick',
					sub: 'against the uniform ball’s',
					a: f3(kA),
					b: f3(kB),
					ratio: ratio(kB, kA),
					bars: [kA / (5 / 3), kB / (5 / 3)]
				},
				{
					head: 'Thermal tremor of the quadrupole',
					sub: 'against the uniform ball’s',
					a: f3(tA),
					b: f3(tB),
					ratio: ratio(tB, tA),
					bars: [tA / (5 / 3), tB / (5 / 3)]
				}
			];
		}
		const [JA, JB] = [goldSecondMoment(goldA, s), goldSecondMoment(goldB, s)];
		const [IA, IB] = [goldInertia(goldA, s), goldInertia(goldB, s)];
		const [kA, kB] = [goldRelative(goldA, s), goldRelative(goldB, s)];
		const potential = `-G${m}/|\\mathbf{x}-\\mathbf{s}|`;
		return [
			{ head: 'Mass of the gold', a: m, b: m, ratio: 'the same', same: true },
			{ head: 'Its potential outside', a: potential, b: potential, ratio: 'the same', same: true },
			{
				head: 'The gold’s',
				tex: moment,
				a: `${f3(JA)}\\,${m}R^2`,
				b: `${f3(JB)}\\,${m}R^2`,
				ratio: ratio(JB, JA),
				bars: [JA, JB]
			},
			{
				head: 'Its share of the moment of inertia',
				sub: 'about an axis across the line to the nugget',
				a: `${f3(IA)}\\,${m}R^2`,
				b: `${f3(IB)}\\,${m}R^2`,
				ratio: ratio(IB, IA),
				bars: [IA / 0.95, IB / 0.95]
			},
			{
				head: 'Its share of the energy of the five quadrupolar kicks',
				sub: 'against the gold spread evenly',
				a: f3(kA),
				b: f3(kB),
				ratio: ratio(kB, kA),
				bars: [kA / (5 / 3), kB / (5 / 3)]
			},
			{
				head: 'Its share of the tremor of the quadrupole',
				sub: 'against the gold spread evenly',
				a: f3(kA),
				b: f3(kB),
				ratio: ratio(kB, kA),
				bars: [kA / (5 / 3), kB / (5 / 3)]
			}
		];
	});

	const titleA = $derived(family === 'round' ? ROUND[roundA].name : GOLD[goldA].name);
	const titleB = $derived(family === 'round' ? nameOfB : GOLD[goldB].name);

	// the answers' numbers
	const kickB = $derived(kickRelative(bodyB));
	const skinI = $derived(goldInertia('skin', s));
	const nuggetI = $derived(goldInertia('nugget', s));
	const flushI = $derived(goldInertia('flush', s));
</script>

{#snippet roundCut(b: Layered)}
	{@const lv = levels(b)}
	<svg class="cut" viewBox="-1.8 -1.8 3.6 3.6" aria-hidden="true">
		{#each spokes as deg (deg)}
			<g transform="rotate({deg})">
				<path class="spoke" d="M1.72 0H1.14M1.25 -0.065L1.13 0L1.25 0.065" />
			</g>
		{/each}
		<circle class="steel" r="1" />
		{#if !lv.skin}
			<path
				class="matter"
				d={annulus(lv.point || lv.uniform ? 0 : b.a)}
				fill-rule="evenodd"
				fill-opacity={lv.mantle.toFixed(3)}
			/>
		{/if}
		{#if b.a > 0 && !lv.point && !lv.uniform}
			<circle class="core-fill" r={b.a} fill-opacity={lv.core.toFixed(3)} />
		{/if}
		{#if lv.boundary}
			<circle class="boundary" r={b.a} />
		{/if}
		{#if lv.skin && b.f < 1}
			<circle class="skin-rim" r="0.97" />
		{/if}
		{#if lv.point}
			<circle class="point-core" r="0.07" />
		{/if}
		<circle class="surface-ring" r="1" />
		<circle class="centre" r="0.025" />
	</svg>
{/snippet}

{#snippet goldCut(k: GoldName)}
	<svg class="cut" viewBox="-1.8 -1.8 3.6 3.6" aria-hidden="true">
		<defs>
			<clipPath id="{uid}-{k}-in"><circle r="1" /></clipPath>
			<radialGradient id="{uid}-{k}-fade" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1.8">
				<stop offset="0.78" stop-color="white" />
				<stop offset="1" stop-color="black" />
			</radialGradient>
			<mask
				id="{uid}-{k}-out"
				maskUnits="userSpaceOnUse"
				x="-1.8"
				y="-1.8"
				width="3.6"
				height="3.6"
			>
				<rect x="-1.8" y="-1.8" width="3.6" height="3.6" fill="url(#{uid}-{k}-fade)" />
				<circle r="1.03" fill="black" />
			</mask>
		</defs>
		<g mask="url(#{uid}-{k}-out)">
			{#each EQUIPOTENTIALS as d (d)}
				<circle class="equipotential" cx={s} r={d} />
			{/each}
		</g>
		<circle class="steel gold-steel" r="1" />
		{#if k === 'flush'}
			<g clip-path="url(#{uid}-{k}-in)">
				{#each flushBands as p, i (i)}
					{#if p}<path class="gold-band" d={p} fill-opacity={BAND_OPACITY[i]} />{/if}
				{/each}
			</g>
		{:else if k === 'skin'}
			{#each skinBands as p, i (i)}
				{#if p}<path class="gold-band" d={p} fill-opacity={BAND_OPACITY[i]} />{/if}
			{/each}
		{/if}
		<circle class="surface-ring" r="1" />
		<circle class="centre" r="0.025" />
		{#if k === 'nugget'}
			<circle class="nugget" cx={s} r="0.075" />
		{:else}
			<circle class="ghost" cx={s} r="0.075" />
		{/if}
	</svg>
{/snippet}

<div class="same-outside">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				<button type="button" aria-pressed={family === 'round'} onclick={() => (family = 'round')}
					>1</button
				>
				<button type="button" aria-pressed={family === 'gold'} onclick={() => (family = 'gold')}
					>2</button
				>
			</div>
		</div>
		<p class="question">
			{#if family === 'round'}
				Move B’s mass outward. Does the pull at twice the radius change? Does the energy a kick
				leaves?
			{:else}
				Spread the gold over the surface as a skin. Do the equipotentials outside move? Does the
				moment of inertia?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && family === 'round'}
				<strong>The pull, no; the kick, yes.</strong> The pull at <Tex math="2R" /> stays
				<Tex math={`G${M}/(2R)^2`} trust />, since a sphere there holds the whole mass however it
				lies. A tide kicks each piece in proportion to its distance from the centre, and the energy
				adds each piece’s mass times the square of its kick, so B takes {kickB.toFixed(2)} times the uniform
				ball’s energy (a thin shell, <Tex math="5/3" />: the ratio 3 : 5). Its moment of inertia and
				its tremor rise by the same factor: all three are <Tex math={moment} trust />.
				<button type="button" class="next" onclick={() => (family = 'gold')}>Next prediction</button
				>
			{:else if revealed}
				<strong>The equipotentials, no; the moment of inertia, yes.</strong> The skin’s potential
				outside is the nugget’s, <Tex math={`-G${m}/|\\mathbf x-\\mathbf s|`} trust />, so the blue
				circles stay put. The gold’s share of the moment of inertia, about an axis across the line
				to the nugget, is <Tex math={`${f3(nuggetI)}\\,${m}R^2`} trust /> for the nugget,
				<Tex math={`${f3(flushI)}`} /> for the flush and <Tex math={`${f3(skinI)}`} /> for the skin.
			{:else if family === 'round'}
				The answer appears when B is a shell, or when you have moved its mass far enough out with
				the sliders.
			{:else}
				The answer appears when you choose the skin for A or B.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="family" role="group" aria-label="Bodies to compare">
			<button type="button" aria-pressed={family === 'round'} onclick={() => (family = 'round')}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><circle class="mark-ball" cx="8" cy="8" r="6" /></svg
				>
				Round bodies
			</button>
			<button type="button" aria-pressed={family === 'gold'} onclick={() => (family = 'gold')}>
				<svg viewBox="0 0 16 16" aria-hidden="true"
					><circle class="mark-shell" cx="8" cy="8" r="6" /><circle
						class="mark-nugget"
						cx="10.5"
						cy="8"
						r="1.8"
					/></svg
				>
				Gold off centre
			</button>
		</div>

		<div class="pair">
			{#each ['A', 'B'] as const as slot (slot)}
				<section class="slot" aria-labelledby="{uid}-{slot}">
					<p class="slot-title" id="{uid}-{slot}">
						<span class={['letter', slot]}>{slot}</span>
						<span>{slot === 'A' ? titleA : titleB}</span>
					</p>
					{#if family === 'round'}
						{@render roundCut(slot === 'A' ? bodyA : bodyB)}
						<p class="law">{law(slot === 'A' ? bodyA : bodyB)}</p>
						<div
							class="chips"
							role="group"
							aria-label="Body {slot}"
							style:--cols={ROUND_NAMES.length}
							style:--narrow-cols={2}
						>
							{#each ROUND_NAMES as n (n)}
								<button
									type="button"
									aria-pressed={slot === 'A' ? roundA === n : nameB === n}
									onclick={() => (slot === 'A' ? (roundA = n) : setB({ ...ROUND[n].body }))}
									>{ROUND[n].short}</button
								>
							{/each}
						</div>
					{:else}
						{@render goldCut(slot === 'A' ? goldA : goldB)}
						<p class="law">{goldLaw(slot === 'A' ? goldA : goldB)}</p>
						<div
							class="chips"
							role="group"
							aria-label="Body {slot}"
							style:--cols={GOLD_NAMES.length}
							style:--narrow-cols={3}
						>
							{#each GOLD_NAMES as k (k)}
								<button
									type="button"
									aria-pressed={(slot === 'A' ? goldA : goldB) === k}
									onclick={() => chooseGold(slot, k)}>{GOLD[k].short}</button
								>
							{/each}
						</div>
					{/if}
				</section>
			{/each}
		</div>

		{#if family === 'round'}
			<p class="legend under-pair">
				<span><i class="key spoke-key"></i>the field outside, the same for both</span>
				<span><i class="key matter-key"></i>shaded by density</span>
			</p>
			<svg
				viewBox="0 0 {size.w} {size.h}"
				role="img"
				aria-label={plotLabel}
				class="plot"
				{@attach fitText()}
			>
				<defs>
					<clipPath id="{uid}-plot">
						<rect x={ax.L} y={ax.T - 2} width={ax.R - ax.L + 2} height={ax.B - ax.T + 4} />
					</clipPath>
				</defs>
				<line class="axis" x1={ax.L} y1={ax.B} x2={ax.R} y2={ax.B} />
				<line class="axis" x1={ax.L} y1={ax.T} x2={ax.L} y2={ax.B} />
				{#each ticksY as g (g)}
					<line class="tick" x1={ax.L - 4} y1={y(g)} x2={ax.L} y2={y(g)} />
					<text class="num" x={ax.L - 7} y={y(g) + 3.8} text-anchor="end">{g}</text>
				{/each}
				{#each ticksR as t (t.r)}
					<line class="tick" x1={x(t.r)} y1={ax.B} x2={x(t.r)} y2={ax.B + 4} />
					<text class={t.r ? 'sym small' : 'num'} x={x(t.r)} y={ax.B + 16} text-anchor="middle"
						>{t.label}</text
					>
				{/each}
				<text class="sym axis-name" x={ax.R + 7} y={ax.B + 4}>r</text>
				<text class="sym axis-name" x={ax.L + 7} y={ax.T + 9}>g</text>

				<line class="surface" x1={x(1)} y1={ax.T} x2={x(1)} y2={ax.B} />
				<text class="words" x={x(1) + 6} y={ax.T + 9}>the surface</text>

				<g clip-path="url(#{uid}-plot)">
					<path class="fixed-halo" d={outside} />
					<path class="fixed" d={outside} />
					<path class="curve-a" d={curveA} />
					<path class="curve-b" d={curveB} />
				</g>
				{#each beyond as p (p.a)}
					<text class="num" x={x(p.a)} y={ax.T + 9} text-anchor="middle"
						>↑{Number.isFinite(p.g) ? (Math.round(p.g * 1e6) / 1e6).toFixed(2) : '∞'}</text
					>
				{/each}
				<circle class="dot" cx={x(2)} cy={y(0.25)} r="3.4" />
				<text class="num strong" x={x(2) + 5} y={y(0.25) + 16}>¼</text>
				<text class="words" x={x(sameAt) + 4} y={y(1 / sameAt ** 2) - 9}
					>the same for every body</text
				>
			</svg>
			<p class="legend">
				<span><i class="key curve-a-key"></i>the pull inside A</span>
				<span><i class="key curve-b-key"></i>the pull inside B</span>
				<span
					><i class="key fixed"></i><span>outside, <Tex math={`G${M}/r^2`} trust />, for both</span
					></span
				>
			</p>
		{:else}
			<p class="legend under-pair">
				<span><i class="key equi-key"></i>equipotentials of the gold’s share, outside</span>
				<span><i class="key matter-key"></i>the gold, in bands that halve its density</span>
				<span><i class="key ghost-key"></i>where the nugget would be</span>
			</p>
		{/if}
	</div>

	<div class="bar">
		{#if family === 'round'}
			<div class="slide">
				<Slider
					id="{uid}-core"
					label="B’s core radius"
					icon={RadialIcon}
					min={0}
					max={1}
					step={0.01}
					bind:value={() => bodyB.a, setCore}
					readout={bodyB.a === 0
						? 'a point'
						: bodyB.a === 1
							? 'the whole ball'
							: `a = ${bodyB.a.toFixed(2)} R`}
					ends={['a point', 'the whole ball']}
					marks={[
						{ at: 0.4, label: 'a = 0.4 R: the paper’s cored ball' },
						{ at: ROUND.earth.body.a, label: 'a = 0.546 R: the Earth’s core' }
					]}
					marksHint="the ticks mark the cored ball and the Earth"
				/>
			</div>
			<div class="slide">
				<Slider
					id="{uid}-share"
					label="Mass in B’s core"
					icon={WeightIcon}
					min={0}
					max={1}
					step={0.01}
					bind:value={() => bodyB.f, setShare}
					readout={`f = ${pct(bodyB.f)}`}
					ends={['all in the mantle', 'all in the core']}
					marks={[{ at: bodyB.a ** 3, label: `f = a³ = ${pct(bodyB.a ** 3)}: uniform` }]}
					marksHint="the tick marks the uniform ball for this core"
				/>
			</div>
			<p class="hint">
				A is one of the five bodies; B is any core and mantle of the same mass, set by its buttons
				or its sliders (Tab to reach them, then the arrow keys). Less mass in the core moves it
				outward.
			</p>
		{:else}
			<div class="slide">
				<Slider
					id="{uid}-s"
					label="Nugget’s distance from the centre"
					icon={PinIcon}
					min={S_LEAST}
					max={S_MOST}
					step={0.05}
					bind:value={() => s, setS}
					readout={`s = ${s.toFixed(2)} R`}
					ends={['at the centre', 'near the wall']}
					marks={[
						{ at: 0, label: 's = 0: a ball of gold and a shell of gold' },
						{ at: S_PAPER, label: 's = R/2: the paper’s nugget' }
					]}
					marksHint="the ticks mark the centre and the paper’s nugget"
				/>
			</div>
			<p class="hint">
				Choose A and B with their buttons, and move the nugget with the slider (Tab, then the arrow
				keys). The flush and the skin follow it. At the centre the flush is the gold spread evenly
				and the skin a shell: the ball and the shell again.
			</p>
		{/if}
	</div>

	<div class="readouts">
		<table>
			<caption class="visually-hidden">What A and B share and what tells them apart</caption>
			<thead>
				<tr>
					<th scope="col"><span class="visually-hidden">Quantity</span></th>
					<th scope="col"><span class="letter A">A</span></th>
					<th scope="col"><span class="letter B">B</span></th>
					<th scope="col" class="r">B ÷ A</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row, i (i)}
					<tr class={{ same: row.same }}>
						<th scope="row"
							>{row.head}{#if row.tex}{row.head ? ' ' : ''}<Tex
									math={row.tex}
									trust
								/>{/if}{#if row.sub}<span class="sub">{row.sub}</span>{/if}</th
						>
						<td>
							<Tex math={row.a} trust />
							{#if row.bars}<span class="meter"
									><i class="a" style:width="{Math.min(100, row.bars[0] * 100).toFixed(1)}%"
									></i></span
								>{/if}
						</td>
						<td>
							<Tex math={row.b} trust />
							{#if row.bars}<span class="meter"
									><i class="b" style:width="{Math.min(100, row.bars[1] * 100).toFixed(1)}%"
									></i></span
								>{/if}
						</td>
						<td class="r">{row.ratio}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if family === 'round'}
			<p class="note">
				The pull is in units of <Tex math={`G${M}/R^2`} trust />. Outside, every round body of mass
				<Tex math={M} trust /> pulls as a point at its centre, so no steady reading there tells A from
				B. The last four rows move together. The moment of inertia is
				<Tex math={`I = \\tfrac23${moment}`} trust />. A tide whose impulse potential is
				<Tex math="\tfrac12 k(x^2-y^2)" /> gives each piece the velocity <Tex
					math="k(-x,\,y,\,0)"
				/>, and leaves <Tex
					math={`\\tfrac12k^2\\int${rho}(x^2+y^2)\\,\\mathrm dV = \\tfrac13k^2${moment}`}
					trust
				/> in a round body. At a temperature <Tex math="T" /> the quadrupole trembles with
				<Tex
					math={`\\sum_m\\langle|\\dot Q_{2m}|^2\\rangle = \\tfrac{25}{2\\pi}k_BT${moment}`}
					trust
				/>, whatever the body’s stiffness and friction. A camera outside cannot see
				<Tex math={moment} trust />, because <Tex math="r^2" /> is not harmonic.
			</p>
			{#if roundA === 'earth' || nameB === 'earth'}
				<p class="note">
					The two-layer Earth has a mean density of <Tex math={`${rhoBar} = 5511`} trust /> kg m⁻³, the
					real 5513 to 0.05 per cent, and the measured <Tex math={`I = 0.3307\\,${M}R^2`} trust />;
					a uniform Earth would have <Tex math={`0.400\\,${M}R^2`} trust />.
				</p>
			{/if}
		{:else}
			<p class="note">
				A steel ball of radius <Tex math="R" /> holds gold of mass <Tex math={m} trust />; the
				steel’s share, the same in all three, is left out. The flush is the density harmonic in the
				ball with the nugget’s field outside, the least assuming picture a camera outside could
				draw; at the far wall it dips just below zero, and only the steel keeps it a real density.
				The skin is the nugget’s mass swept onto the surface, of surface density
				<Tex math={`${m}(R^2-s^2)/4\\pi R\\,|\\mathbf x-\\mathbf s|^3`} trust />, drawn as a band
				just inside it. In the flush and the skin the equipotentials centre on a nugget that is not
				there. The kicks are summed over the five quadrupolar tides, so the turn of the tide does
				not matter:
				<Tex math={'\\textstyle\\sum_m|\\nabla(r^2Y_{2m})|^2 = \\tfrac{25}{2\\pi}r^2'} />.
			</p>
		{/if}
	</div>
</div>

<style>
	.same-outside {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
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
	.family button:focus-visible,
	.chips button:focus-visible {
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

	/* --- the bodies and the plot ------------------------------------------------------------- */

	.stage {
		display: grid;
		gap: 0.7rem;
		padding: 0.8rem 0.9rem 0.85rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.family,
	.chips {
		display: grid;
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.family {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		max-width: 22rem;
	}

	.chips {
		grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		border-radius: 10px;
	}

	.family button,
	.chips button {
		min-width: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border: 0;
		background: transparent;
		color: var(--text-dim);
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.family button {
		min-height: calc(var(--control-height, 2.55rem) - 8px);
		padding: 0.3rem 0.6rem;
		border-radius: 8px;
		font-size: 0.78rem;
	}

	.chips button {
		min-height: 1.9rem;
		padding: 0.2rem 0.4rem;
		border-radius: 7px;
		font-size: 0.74rem;
	}

	@media (hover: hover) {
		.family button:hover,
		.chips button:hover {
			color: var(--text);
		}
	}

	.family button[aria-pressed='true'],
	.chips button[aria-pressed='true'] {
		background: var(--bg-raised);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.family svg {
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
		stroke-width: 1.6;
	}

	.mark-nugget {
		fill: currentColor;
	}

	.family button[aria-pressed='true'] svg {
		color: var(--accent);
	}

	/* the two bodies' titles, cuts, words and buttons line up across, whatever their lengths */
	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(4, auto);
		column-gap: 0.9rem;
	}

	.slot {
		min-width: 0;
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		row-gap: 0.35rem;
		align-items: start;
		justify-items: center;
	}

	.slot p {
		margin: 0;
	}

	.slot-title {
		justify-self: stretch;
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		font: 500 0.8rem/1.3 var(--font-sans);
		color: var(--text);
	}

	.letter {
		flex: none;
		display: inline-grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		font: italic 600 0.8rem/1 var(--font-serif);
		color: var(--text);
		box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--text) 45%, transparent);
	}

	.letter.B {
		color: var(--q-field);
		box-shadow: inset 0 0 0 1.5px var(--q-field);
	}

	.law {
		justify-self: stretch;
		font-size: 0.74rem;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.chips {
		justify-self: stretch;
	}

	svg.cut {
		display: block;
		width: min(100%, 15rem);
		height: auto;
		aspect-ratio: 1;
	}

	.spoke {
		fill: none;
		stroke: var(--q-field);
		stroke-width: 1.3px;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.steel {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.gold-steel {
		fill: color-mix(in srgb, var(--text) 11%, transparent);
	}

	.matter,
	.core-fill,
	.gold-band {
		fill: var(--q-matter);
	}

	.point-core,
	.nugget {
		fill: var(--q-matter);
		stroke: var(--bg);
		stroke-width: 1px;
		vector-effect: non-scaling-stroke;
	}

	.skin-rim {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: 0.06;
		stroke-opacity: 0.9;
	}

	.boundary {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: 1px;
		stroke-dasharray: 3 3;
		vector-effect: non-scaling-stroke;
	}

	.surface-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--q-matter) 60%, transparent);
		stroke-width: 1.2px;
		vector-effect: non-scaling-stroke;
	}

	.cut .centre {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.equipotential {
		fill: none;
		stroke: var(--q-field);
		stroke-width: 1.3px;
		vector-effect: non-scaling-stroke;
	}

	.ghost {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: 1.2px;
		stroke-dasharray: 2 2;
		vector-effect: non-scaling-stroke;
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

	.surface {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.curve-a {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	.curve-b {
		fill: none;
		stroke: var(--q-field);
		stroke-width: calc(1.9px * var(--u, 1));
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
		fill: var(--text);
		stroke: var(--bg);
		stroke-width: calc(1.2px * var(--u, 1));
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

	.key.spoke-key,
	.key.equi-key {
		border-top: 1.5px solid var(--q-field);
	}

	.key.matter-key {
		height: 0.7rem;
		width: 0.7rem;
		border: 0;
		border-radius: 50%;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--q-matter) 25%, transparent),
			var(--q-matter)
		);
	}

	.key.ghost-key {
		height: 0.6rem;
		width: 0.6rem;
		border: 1.2px dashed var(--text-dim);
		border-radius: 50%;
	}

	.key.curve-a-key {
		border-top: 2px dashed color-mix(in srgb, var(--text) 55%, transparent);
	}

	.key.curve-b-key {
		border-color: var(--q-field);
	}

	.key.fixed {
		border-top-width: 3px;
		border-color: var(--q-field);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--q-field) 20%, transparent);
		border-radius: 2px;
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
		flex: 1 1 16rem;
		min-width: 0;
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

	/* the chapter's own tables are styled for the text: this one keeps its own */
	.readouts table {
		width: 100%;
		margin: 0;
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}

	.readouts th,
	.readouts td {
		padding: 0.35rem 0.4rem;
		border: 0;
		border-bottom: 1px solid var(--line);
		background: none;
		text-align: left;
		vertical-align: top;
	}

	.readouts thead th {
		padding-top: 0;
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts tbody th {
		width: 38%;
		font-weight: 500;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.readouts .sub {
		display: block;
		margin-top: 0.1rem;
		font-weight: 400;
		font-size: 0.68rem;
		color: var(--text-faint);
	}

	.readouts tbody tr:last-child > * {
		border-bottom: 0;
	}

	.readouts td.r,
	.readouts th.r {
		text-align: right;
		white-space: nowrap;
	}

	.readouts tr.same td.r {
		color: var(--text-faint);
		font-style: italic;
	}

	.meter {
		display: block;
		height: 5px;
		margin-top: 0.3rem;
		border-radius: 3px;
		background: color-mix(in srgb, var(--text) 8%, transparent);
		overflow: hidden;
	}

	.meter i {
		display: block;
		height: 100%;
		border-radius: 3px;
	}

	.meter i.a {
		background: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.meter i.b {
		background: var(--q-field);
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 860px) {
		.chips {
			grid-template-columns: repeat(min(var(--cols), 3), minmax(0, 1fr));
		}
	}

	@media (max-width: 560px) {
		.stage {
			padding-inline: 0.7rem;
		}

		.pair {
			column-gap: 0.6rem;
		}

		.chips {
			grid-template-columns: repeat(var(--narrow-cols), minmax(0, 1fr));
		}

		.readouts {
			padding-inline: 0.7rem;
			font-size: 0.74rem;
		}

		.readouts th,
		.readouts td {
			padding: 0.3rem 0.25rem;
		}

		.readouts tbody th {
			width: 34%;
		}
	}
</style>
