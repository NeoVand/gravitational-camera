<script lang="ts">
	/**
	 * Chapter 6.4's mass shell in light-cone form. A square panel with the light-cone axes q = E/c − p_z, up and to
	 * the left, and E/c + p_z, up and to the right, at 45°, from 0 to 3 in units of mc, over the ordinary axes p_z and
	 * E/c, faint. The mass shell q(E/c + p_z) = m²c² + p_⊥² is a hyperbola in the matter colour. In the first view a
	 * slider sets one body's rapidity η along z, which slides it along its hyperbola, and another its p_⊥ across z,
	 * which moves the hyperbola outward; a kick across z, the wave's ½q∇H or a fixed ½mc∇H, keeps q and carries the
	 * body along a line of constant q onto the hyperbola of its new p_⊥, with the energy gained beside Newton's. In the
	 * second, the two lumps of the paper's Appendix C, the rest mass of the pair as a sum and a weighted variance and
	 * by the direct formula, and the wave that stops the lumps and its reverse, with the chapter's bound
	 * 𝓜₊² + 𝓜₋² − 2𝓜₀² = Q²Var(∇H)/2c². Everything is computed in ./mass-shell.ts. A prediction at the top of each
	 * view is answered once the reader has done what it asks. Nothing moves by itself, so reduced motion changes
	 * nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AtomIcon,
		MoleculesIcon,
		DashboardSpeed02Icon,
		ArrowLeftRightIcon,
		ArrowUpDownIcon,
		WaveIcon,
		FlashIcon,
		LockIcon,
		StopCircleIcon,
		ArrowReloadHorizontalIcon,
		UndoIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		APP_C,
		FIRST_START,
		GRADIENT,
		HALF,
		LN2,
		MOMENTUM,
		RAPIDITY,
		SECOND_START,
		SPAN,
		betaPerp,
		betaZ,
		energyGain,
		etaTex,
		etaWords,
		evenMass,
		firstAnswer,
		fromRapidity,
		hundredths,
		keyed,
		kickOf,
		kicked,
		landed,
		lumpBodies,
		newtonGain,
		noteFirst,
		noteSecond,
		pinned,
		sameLumps,
		secondAnswer,
		shellCurve,
		shellProduct,
		stats,
		three,
		threeTex,
		two,
		underWave,
		type Body,
		type FirstSeen,
		type KickMode,
		type Lump,
		type SecondSeen,
		type Wave
	} from './mass-shell';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	type View = 'one' | 'two';
	let view = $state<View>('one');

	// the first view: one body, and the kick
	let eta = $state(0);
	let perp = $state(0);
	let gradient = $state(1);
	let sign = $state<1 | -1>(1);
	let mode = $state<KickMode>('wave');
	let kick = $state(false);

	function setEta(v: number) {
		const next = landed(v);
		if (next === eta) return;
		eta = next;
		noteOne();
	}

	function setPerp(v: number) {
		const next = hundredths(v, MOMENTUM);
		if (next === perp) return;
		perp = next;
		noteOne();
	}

	function setGradient(v: number) {
		const next = hundredths(v, GRADIENT);
		if (next === gradient) return;
		gradient = next;
		noteOne();
	}

	function setSign(s: 1 | -1) {
		sign = s;
		noteOne();
	}

	function toggleKick() {
		kick = !kick;
		noteOne();
	}

	function toggleMode() {
		mode = mode === 'wave' ? 'fixed' : 'wave';
		noteOne();
	}

	// the second view: the pair
	let lumps = $state.raw<Lump[]>(APP_C.map((l) => ({ ...l })));
	let wave = $state<Wave>('none');

	function setLump(i: number, key: 'perp' | 'pz', v: number) {
		const next = hundredths(v, MOMENTUM);
		if (lumps[i][key] === next) return;
		lumps = lumps.map((l, j) => (j === i ? { ...l, [key]: next } : l));
		noteTwo(true);
	}

	function setWave(w: Wave) {
		wave = wave === w ? 'none' : w;
		noteTwo(false);
	}

	function backToAppC() {
		const was = sameLumps(lumps, APP_C);
		lumps = APP_C.map((l) => ({ ...l }));
		if (!was) noteTwo(true);
	}

	/** The arrow keys step a slider by its key's step, and Page Up and Page Down by its page. */
	function sliderKeys(
		get: () => number,
		set: (v: number) => void,
		range: { key: number; page: number }
	) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const d = {
				ArrowRight: range.key,
				ArrowUp: range.key,
				ArrowLeft: -range.key,
				ArrowDown: -range.key,
				PageUp: range.page,
				PageDown: -range.page
			}[e.key];
			if (d === undefined) return;
			e.preventDefault();
			set(keyed(get(), Math.sign(d), Math.abs(d)));
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let first = $state<FirstSeen>(FIRST_START);
	let found = $state<SecondSeen>(SECOND_START);

	function noteOne() {
		first = noteFirst(first, { eta, perp, gradient, mode, kick });
	}

	function noteTwo(moved: boolean) {
		found = noteSecond(found, wave, lumps, moved);
	}

	const answer1 = $derived(first.done ? firstAnswer(first.done) : undefined);
	const answer2 = $derived(found.done ? secondAnswer(found.done) : undefined);
	const revealed = $derived(view === 'one' ? answer1 !== undefined : answer2 !== undefined);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const M = '\\htmlClass{q-matter}{m}';
	const MM = '\\htmlClass{q-matter}{\\mathcal M}';
	const ETA = '\\htmlClass{q-obs}{\\eta}';
	const BETA = '\\htmlClass{q-obs}{\\beta}';
	const V = '\\htmlClass{q-obs}{v}';
	const MC = `\\,${M}c`;
	const MC2 = `\\,${M}c^2`;
	const M2C2 = `\\,${M}^2c^2`;

	const before = $derived(fromRapidity(eta, perp));
	const dp = $derived(kickOf(before, sign * gradient, mode));
	const after = $derived(kicked(before, dp));
	const gain = $derived(energyGain(before, dp));
	const newton = $derived(newtonGain(before, dp));

	/** The rows of the first view's table: a body's numbers in units of mc, mc² and m²c². */
	const rows = (b: Body) => [
		b === before ? eta : 0.5 * Math.log(b.w / b.q),
		betaZ(b),
		b.e,
		b.pz,
		b.perp,
		b.q,
		b.w,
		b.q * b.w,
		shellProduct(b.m, b.perp)
	];
	const ROW_NAMES = [
		ETA,
		`${BETA}_z = \\tanh${ETA}`,
		`E/${M}c^2`,
		`p_z/${M}c`,
		`p_\\perp/${M}c`,
		`q/${M}c`,
		`(E/c + p_z)/${M}c`,
		`q\\,(E/c + p_z)/${M}^2c^2`,
		`(${M}^2c^2 + p_\\perp^2)/${M}^2c^2`
	];
	const beforeRows = $derived(rows(before));
	const afterRows = $derived(rows(after));

	// the second view
	const set = $derived(lumpBodies(lumps));
	const shownLumps = $derived(underWave(set, wave));
	const pair = $derived(stats(shownLumps));
	const even = $derived(evenMass(set));
	const WAVE_WORDS: Record<Wave, string> = {
		none: 'with no wave',
		stop: 'after the wave that stops them',
		reverse: 'after its reverse'
	};

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, left: 22, top: 10, right: 8, bottom: 22 }
			: { W: 520, left: 30, top: 12, right: 10, bottom: 24 }
	);
	const P = $derived(box.W - box.left - box.right);
	/** The second view adds a strip below the panel: the lumps' p_⊥/q on a line. */
	const STRIP = 84;
	const H = $derived(box.top + P + box.bottom + (view === 'two' ? STRIP : 0));
	const scale = $derived(P / SPAN);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const X = (pz: number) => box.left + (pz + HALF) * scale;
	const Y = (e: number) => box.top + (SPAN - e) * scale;
	/** The screen point of light-cone components (q, w). */
	const at = (q: number, w: number) => ({ x: X((w - q) / 2), y: Y((q + w) / 2) });
	const seg = (a: { x: number; y: number }, b: { x: number; y: number }) =>
		`M${f2(a.x)},${f2(a.y)}L${f2(b.x)},${f2(b.y)}`;
	const curve = (s: number) =>
		shellCurve(s)
			.map((p, i) => {
				const q = at(p.q, p.w);
				return `${i ? 'L' : 'M'}${f2(q.x)},${f2(q.y)}`;
			})
			.join('');

	/** Where a body is drawn, pinned to the panel's edge when it lies off it. */
	const spot = (b: Body) => {
		const p = pinned(b.q, b.w);
		return { x: X(p.pz), y: Y(p.e), off: p.off };
	};

	const WHOLE = [1, 2, 3];
	const R2 = Math.SQRT1_2;
	/** Screen directions away from the q axis (down-left) and the w axis (down-right), outward from the cone. */
	const OUT_Q = { x: -R2, y: R2 };
	const OUT_W = { x: R2, y: R2 };
	const plus = (p: { x: number; y: number }, d: { x: number; y: number }, k: number) => ({
		x: p.x + d.x * k,
		y: p.y + d.y * k
	});

	/** The light-cone grid: lines of constant q and of constant w, inside the square 0 ≤ q, w ≤ 3. */
	const cone = $derived(
		WHOLE.flatMap((k) => [seg(at(k, 0), at(k, SPAN)), seg(at(0, k), at(SPAN, k))])
	);

	/**
	 * A small tick across an axis at k, and the place for its number: outward, below the axis, except at the axis's
	 * end, 3, where outward would be beside the numbers of E/c at the panel's edge, and so inward.
	 */
	const tick = (k: number, axis: 'q' | 'w') => {
		const p = axis === 'q' ? at(k, 0) : at(0, k);
		const out = axis === 'q' ? OUT_Q : OUT_W;
		const side = k === SPAN ? -1 : 1;
		return {
			d: seg(plus(p, out, -4 * u), plus(p, out, 4 * u)),
			label: plus(plus(p, out, side * 13 * u), { x: 0, y: 1 }, 4 * u)
		};
	};

	/** An arrow from a to b on the screen, its head at b, stopping short of a dot there. */
	function arrow(a: { x: number; y: number }, b: { x: number; y: number }) {
		const len = Math.hypot(b.x - a.x, b.y - a.y);
		if (len < 14 * u) return undefined;
		const d = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
		const n = { x: -d.y, y: d.x };
		const tip = plus(b, d, -7 * u);
		const start = plus(a, d, 6 * u);
		const l = 8 * u;
		const base = plus(tip, d, -l);
		return {
			shaft: seg(start, plus(tip, d, -l * 0.6)),
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x + n.x * 0.42 * l)},${f2(base.y + n.y * 0.42 * l)}L${f2(base.x - n.x * 0.42 * l)},${f2(base.y - n.y * 0.42 * l)}Z`
		};
	}

	/** Dotted lines from a body to the two axes, parallel to the other: its q and its E/c + p_z. */
	const drops = (b: Body) =>
		[seg(at(b.q, b.w), at(b.q, 0)), seg(at(b.q, b.w), at(0, b.w))].join('');

	const oneShown = $derived(kick ? after : before);
	const oneSpot = $derived(spot(oneShown));
	const beforeSpot = $derived(spot(before));
	const kickArrow = $derived(
		kick && !beforeSpot.off && !oneSpot.off ? arrow(beforeSpot, oneSpot) : undefined
	);

	const twoSpots = $derived(shownLumps.map(spot));
	const setSpots = $derived(set.map(spot));
	const waveArrows = $derived(
		wave === 'none'
			? []
			: set.map((b, i) =>
					!setSpots[i].off && !twoSpots[i].off ? arrow(setSpots[i], twoSpots[i]) : undefined
				)
	);
	/** The two lumps' names: side by side, or one name for both when they lie together. */
	const together = $derived(
		Math.hypot(twoSpots[0].x - twoSpots[1].x, twoSpots[0].y - twoSpots[1].y) < 10 * u
	);

	// the strip of the second view: p_⊥/q from −2 to 2
	const STRIP_SPAN = 2;
	const stripY = $derived(box.top + P + box.bottom + 46);
	const XS = (x: number) =>
		box.left +
		((Math.max(-STRIP_SPAN, Math.min(STRIP_SPAN, x)) + STRIP_SPAN) / (2 * STRIP_SPAN)) * P;
	const sigma = $derived(Math.sqrt(pair.variance));

	// --- the words --------------------------------------------------------------------------------------------------
	const description = $derived(
		view === 'one'
			? `A square panel of the light-cone axes q = E/c − p_z, up and to the left, and E/c + p_z, up and to the right, from 0 to 3 in units of mc, over the ordinary axes p_z across and E/c upward. ` +
					`The body, at the rapidity ${etaWords(eta)} along z and p_⊥ = ${two(perp)} mc, lies at q = ${three(before.q)} mc and E/c + p_z = ${three(before.w)} mc, on the hyperbola q(E/c + p_z) = ${three(shellProduct(1, perp))} m²c²` +
					(beforeSpot.off ? ', off the panel.' : '.') +
					(kick
						? ` The ${mode === 'wave' ? 'wave’s' : 'fixed'} kick Δp_⊥ = ${three(dp)} mc keeps q and carries it along the line of constant q to E/c + p_z = ${three(after.w)} mc, on the hyperbola ${three(shellProduct(1, after.perp))} m²c²${oneSpot.off ? ', off the panel' : ''}; it gains ΔE = ${three(gain)} mc², where Newton's rule gives ${three(newton)} mc².`
						: '')
			: `A square panel of the light-cone axes q and E/c + p_z, in units of mc, with the two lumps of the paper's Appendix C ${WAVE_WORDS[wave]}: ` +
					shownLumps
						.map(
							(b, i) =>
								`lump ${i + 1} at q = ${three(b.q)} mc and E/c + p_z = ${three(b.w)} mc, with p_⊥ = ${three(b.perp)} mc`
						)
						.join('; ') +
					`. Below, their p_⊥/q on a line: ${pair.x.map((x) => three(x)).join(' and ')}, with the weighted variance ${three(pair.variance)}. The pair's rest mass is ${three(pair.massSum)} m.`
	);

	const VIEWS: { value: View; label: string; icon: typeof AtomIcon }[] = [
		{ value: 'one', label: 'One particle', icon: AtomIcon },
		{ value: 'two', label: 'Two particles', icon: MoleculesIcon }
	];
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="mass-shell">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<span class="count">{view === 'one' ? '1' : '2'} of 2</span>
		</div>
		<p class="question">
			{#if view === 'one'}
				A wave of one profile crosses a slow particle and one moving fast along the wave’s
				direction, neither moving sideways. Which gains more energy?
			{:else}
				Can one wave lower the pair’s rest mass? Can a wave and its reverse, averaged, lower it?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if view === 'one' && answer1}
				<strong>The slow one.</strong> With <Tex math="p_\perp = 0" /> the gain is <Tex
					math="\tfrac18(E - cp_z)|\nabla H|^2"
				/>, and <Tex math="E - cp_z = cq" /> is smaller for a body that moves with the wave: at <Tex
					math="0.6c"
				/> along <Tex math="+z" /> it is half the slow body’s, since <Tex
					math={`q = ${M}c/2`}
					trust
				/>
				there. Yours, with <Tex math={`|\\nabla H| = ${threeTex(answer1.gradient)}`} />, gained <Tex
					math={`${threeTex(answer1.slow.gain)}${MC2}`}
					trust
				/> at <Tex math={`${ETA} = ${etaTex(answer1.slow.eta)}`} trust /> and <Tex
					math={`${threeTex(answer1.fast.gain)}${MC2}`}
					trust
				/> at <Tex math={`${ETA} = ${etaTex(answer1.fast.eta)}`} trust />, a ratio of <Tex
					math={threeTex(answer1.ratio)}
				/>, the ratio of their <Tex math="q" />’s. The wave kicks the fast body less, <Tex
					math="\Delta p_\perp = \tfrac12q\nabla H"
				/>; a fixed kick would give it more, because <Tex
					math="\Delta E = (c/2q)|\Delta p_\perp|^2"
				/>.
				<button type="button" class="next" onclick={() => (view = 'two')}>Next prediction</button>
			{:else if view === 'two' && answer2}
				<strong>Yes; no.</strong> “Stop them” takes the pair from <Tex math={`2.5\\,${M}`} trust /> to
				<Tex math={`2\\,${M}`} trust />: one wave can lower the rest mass, because it can shrink the
				spread of <Tex math="p_\perp/q" />. But the readout <Tex
					math={`${MM}_+^2 + ${MM}_-^2 - 2${MM}_0^2 = Q^2\\,\\mathrm{Var}(\\nabla H)/2c^2`}
					trust
				/> is never negative, <Tex math={`4.5\\,${M}^2`} trust /> for this pair, so the reverse, to <Tex
					math={`3.61\\,${M}`}
					trust
				/>, raises it by more than the wave lowered it, and the two averaged can only raise it.
				{#if !answer2.appC}
					For your pair the mass went from <Tex math={`${threeTex(answer2.zero)}\\,${M}`} trust /> to
					<Tex math={`${threeTex(answer2.plus)}\\,${M}`} trust /> and, under the reverse, to <Tex
						math={`${threeTex(answer2.minus)}\\,${M}`}
						trust
					/>, and the bound was <Tex math={`${threeTex(answer2.left)}\\,${M}^2`} trust />.
				{/if}
			{:else if view === 'one'}
				The answer appears once you have kicked, with the wave’s kick and one <Tex
					math="|\nabla H|"
				/>, a body with <Tex math="p_\perp = 0" /> both slow, <Tex
					math={`|${BETA}_z| \\le 0.1`}
					trust
				/>, and moving along <Tex math="+z" /> at <Tex math={`${BETA}_z \\ge 0.6`} trust />.
			{:else}
				The answer appears once you have applied both “Stop them” and “Reverse” to one pair whose
				lumps move differently across <Tex math="z" />.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {f2(H)}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect x={box.left} y={box.top} width={P} height={P} />
				</clipPath>
			</defs>

			<rect class="panel" x={box.left} y={box.top} width={P} height={P} />

			<g clip-path="url(#{uid}-plot)">
				<!-- below the light lines, E/c < |p_z|, where no body lies -->
				<path
					class="beyond"
					d="M{f2(X(-HALF))},{f2(Y(0))}L{f2(X(0))},{f2(Y(0))}L{f2(X(-HALF))},{f2(Y(HALF))}Z M{f2(
						X(HALF)
					)},{f2(Y(0))}L{f2(X(0))},{f2(Y(0))}L{f2(X(HALF))},{f2(Y(HALF))}Z"
				/>

				<!-- the ordinary axes' grid, faint -->
				{#each [-1, 1] as k (k)}
					<line class="grid" x1={X(k)} x2={X(k)} y1={box.top} y2={box.top + P} />
				{/each}
				{#each [1, 2] as k (k)}
					<line class="grid" x1={box.left} x2={box.left + P} y1={Y(k)} y2={Y(k)} />
				{/each}
				<line class="plain-axis" x1={X(0)} x2={X(0)} y1={box.top} y2={box.top + P} />

				<!-- the light-cone grid -->
				{#each cone as d (d)}
					<path class="cone-grid" {d} />
				{/each}

				{#if view === 'one'}
					<!-- the shell of a body at rest across z, for comparison, and the body's own -->
					{#if perp !== 0 || (kick && after.perp !== 0)}
						<path class="shell rest" d={curve(1)} />
					{/if}
					<path class="shell" d={curve(shellProduct(1, perp))} />
					{#if kick && after.perp !== perp}
						<path class="shell after" d={curve(shellProduct(1, after.perp))} />
					{/if}
					{#if !oneSpot.off}
						<path class="drop" d={drops(oneShown)} />
					{/if}
					{#if kick}
						<!-- the line of constant q along which the kick carries the body -->
						<path class="q-line" d={seg(at(before.q, 0), at(before.q, SPAN))} />
					{/if}
				{:else}
					{#each shownLumps as b, i (i)}
						<path class="shell" d={curve(shellProduct(1, b.perp))} />
					{/each}
					{#if wave !== 'none'}
						{#each set as b, i (i)}
							<path class="q-line" d={seg(at(b.q, 0), at(b.q, SPAN))} />
						{/each}
					{/if}
				{/if}
			</g>

			<!-- the light-cone axes, which are also light's lines -->
			<path class="axis" d={seg(at(0, 0), at(SPAN, 0))} />
			<path class="axis" d={seg(at(0, 0), at(0, SPAN))} />
			{#each WHOLE as k (k)}
				{#each ['q', 'w'] as const as axis (axis)}
					{@const t = tick(k, axis)}
					<path class="axis" d={t.d} />
					<text class="small halo mid tick-number" x={t.label.x} y={t.label.y}>{k}</text>
				{/each}
			{/each}
			{#each [{ axis: 'q' as const, k: 1.5 }, { axis: 'w' as const, k: 1.5 }] as l (l.axis)}
				{@const p =
					l.axis === 'q' ? plus(at(l.k, 0), OUT_Q, 30 * u) : plus(at(0, l.k), OUT_W, 30 * u)}
				<text
					class="small light-words mid"
					transform="translate({f2(p.x)} {f2(p.y + 4 * u)}) rotate({l.axis === 'q' ? 45 : -45})"
					>light along {l.axis === 'q' ? '−' : '+'}<tspan class="it">z</tspan></text
				>
			{/each}
			{#each [{ axis: 'q' as const }, { axis: 'w' as const }] as l (l.axis)}
				{@const p =
					l.axis === 'q'
						? plus(at(2.25, 0), { x: R2, y: -R2 }, 10 * u)
						: plus(at(0, 2.25), { x: -R2, y: -R2 }, 10 * u)}
				<text
					class="label mid halo"
					transform="translate({f2(p.x)} {f2(p.y)}) rotate({l.axis === 'q' ? 45 : -45})"
					>{#if l.axis === 'q'}<tspan class="it">q</tspan> = <tspan class="it">E</tspan>/<tspan
							class="it">c</tspan
						>
						− <tspan class="it">p</tspan><tspan class="sub" dy={3 * u}>z</tspan>{:else}<tspan
							class="it">E</tspan
						>/<tspan class="it">c</tspan> + <tspan class="it">p</tspan><tspan class="sub" dy={3 * u}
							>z</tspan
						>{/if}</text
				>
			{/each}

			<!-- the ordinary axes' numbers and names, faint -->
			{#each [-1, 0, 1] as k (k)}
				<text class="small dim mid" x={X(k)} y={box.top + P + 15 * u}
					>{k < 0 ? '−' : ''}{Math.abs(k)}</text
				>
			{/each}
			{#each WHOLE as k (k)}
				<text class="small dim end" x={box.left - 5 * u} y={Y(k) + 4 * u}>{k}</text>
			{/each}
			<text class="small dim end" x={box.left + P - 4 * u} y={box.top + P - 6 * u}
				><tspan class="it">p</tspan><tspan class="sub" dy={3 * u}>z</tspan></text
			>
			<text class="small dim start" x={X(0) + 5 * u} y={box.top + 14 * u}
				><tspan class="it">E</tspan>/<tspan class="it">c</tspan></text
			>

			<!-- the bodies -->
			{#if view === 'one'}
				{#if kickArrow}
					<path class="kick-shaft" d={kickArrow.shaft} />
					<path class="kick-head" d={kickArrow.head} />
				{/if}
				{#if kick}
					<circle class="ring" cx={beforeSpot.x} cy={beforeSpot.y} r={4.5 * u} />
				{/if}
				<circle class={['body', { off: oneSpot.off }]} cx={oneSpot.x} cy={oneSpot.y} r={5.5 * u} />
				{#if oneSpot.off}
					<text class="small halo off-words" x={oneSpot.x} y={oneSpot.y - 10 * u}
						>off the panel</text
					>
				{/if}
			{:else}
				{#each waveArrows as a, i (i)}
					{#if a}
						<path class="kick-shaft" d={a.shaft} />
						<path class="kick-head" d={a.head} />
					{/if}
				{/each}
				{#if wave !== 'none'}
					{#each setSpots as s, i (i)}
						<circle class="ring" cx={s.x} cy={s.y} r={4.5 * u} />
					{/each}
				{/if}
				{#each twoSpots as s, i (i)}
					<circle class={['body', { off: s.off }]} cx={s.x} cy={s.y} r={5.5 * u} />
				{/each}
				<!-- the names off the lines of constant q, along which the kicks run: up and to the left, and
				     for the second lump, when apart, down and to the right -->
				{#if together}
					<text class="name halo end" x={twoSpots[0].x - 8 * u} y={twoSpots[0].y - 8 * u}>1, 2</text
					>
				{:else}
					{#each twoSpots as s, i (i)}
						<text
							class={['name halo', i === 0 ? 'end' : 'start']}
							x={s.x + (i === 0 ? -8 : 8) * u}
							y={s.y + (i === 0 ? -8 : 16) * u}>{i + 1}</text
						>
					{/each}
				{/if}

				<!-- the strip: each lump's p_⊥/q, weighted by q/Q, with the weighted mean and spread -->
				<text class="label start" x={box.left} y={stripY - 30 * u}
					><tspan class="it">p</tspan><tspan class="sub" dy={3 * u}>⊥</tspan><tspan dy={-3 * u}
						>/</tspan
					><tspan class="it">q</tspan> of each lump, weighted by <tspan class="it">q</tspan><tspan
						class="sub"
						dy={3 * u}>a</tspan
					><tspan dy={-3 * u}>/</tspan><tspan class="it">Q</tspan></text
				>
				<line class="strip" x1={XS(-STRIP_SPAN)} x2={XS(STRIP_SPAN)} y1={stripY} y2={stripY} />
				{#if sigma > 1e-9}
					<rect
						class="spread"
						x={XS(pair.mean - sigma)}
						width={Math.max(0, XS(pair.mean + sigma) - XS(pair.mean - sigma))}
						y={stripY - 4 * u}
						height={8 * u}
						rx={4 * u}
					/>
				{/if}
				{#each [-2, -1, 0, 1, 2] as k (k)}
					<line class="strip" x1={XS(k)} x2={XS(k)} y1={stripY - 3 * u} y2={stripY + 3 * u} />
					<text class="small dim mid" x={XS(k)} y={stripY + 17 * u}
						>{k < 0 ? '−' : ''}{Math.abs(k)}</text
					>
				{/each}
				<line
					class="mean"
					x1={XS(pair.mean)}
					x2={XS(pair.mean)}
					y1={stripY - 9 * u}
					y2={stripY + 9 * u}
				/>
				{#each pair.x as x, i (i)}
					<circle
						class="body"
						cx={XS(x)}
						cy={stripY}
						r={5.5 * u * Math.sqrt(2 * pair.weights[i])}
					/>
				{/each}
				{#if Math.abs(pair.x[0] - pair.x[1]) * (P / (2 * STRIP_SPAN)) < 10 * u}
					<text class="name halo mid" x={XS(pair.x[0])} y={stripY - 11 * u}>1, 2</text>
				{:else}
					{#each pair.x as x, i (i)}
						<text class="name halo mid" x={XS(x)} y={stripY - 11 * u}>{i + 1}</text>
					{/each}
				{/if}
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch axis-key"></span><span
					>the light-cone axes, <Tex math="q" /> and <Tex math="E/c + p_z" /></span
				>
			</li>
			<li>
				<span class="swatch shell-key"></span><span
					>the mass shell <Tex math={`q\\,(E/c + p_z) = ${M}^2c^2 + p_\\perp^2`} trust /></span
				>
			</li>
			{#if view === 'one'}
				{#if perp !== 0 || (kick && after.perp !== 0)}
					<li>
						<span class="swatch rest-key"></span><span
							>the shell with <Tex math="p_\perp = 0" /></span
						>
					</li>
				{/if}
				{#if kick}
					<li>
						<span class="swatch q-key"></span><span
							>the kick, along a line of constant <Tex math="q" /></span
						>
					</li>
					<li><span class="dot-key ring-key"></span><span>before the kick</span></li>
				{/if}
			{:else}
				{#if wave !== 'none'}
					<li>
						<span class="swatch q-key"></span><span
							>each lump’s kick, at constant <Tex math="q" /></span
						>
					</li>
					<li><span class="dot-key ring-key"></span><span>before the wave</span></li>
				{/if}
				<li>
					<span class="swatch spread-key"></span><span
						>one standard deviation of <Tex math="p_\perp/q" /> each side of the mean</span
					>
				</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<Segmented label="View" options={VIEWS} bind:value={view} />
		{#if view === 'one'}
			<div class="controls">
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => eta, setEta, RAPIDITY)}
					role="presentation"
				>
					<Slider
						id="{uid}-eta"
						label="Rapidity along z"
						icon={DashboardSpeed02Icon}
						min={RAPIDITY.min}
						max={RAPIDITY.max}
						step={RAPIDITY.step}
						bind:value={() => eta, setEta}
						readout="η = {etaWords(eta)}"
						ends={['−2', '2']}
						marks={[
							{ at: -LN2, label: 'η = −ln 2, 0.6c along −z' },
							{ at: 0, label: 'η = 0, at rest along z' },
							{ at: LN2, label: 'η = ln 2, 0.6c along +z, with the wave' }
						]}
						marksHint="the ticks mark rest and 0.6c either way along z"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => perp, setPerp, MOMENTUM)}
					role="presentation"
				>
					<Slider
						id="{uid}-perp"
						label="Starting p⊥, across z"
						icon={ArrowLeftRightIcon}
						min={MOMENTUM.min}
						max={MOMENTUM.max}
						step={MOMENTUM.step}
						bind:value={() => perp, setPerp}
						readout="p⊥ = {two(perp)} mc"
						ends={['−1.5', '1.5']}
						marks={[
							{ at: -0.75, label: 'p⊥ = −0.75mc' },
							{ at: 0, label: 'p⊥ = 0, head-on across the front' },
							{ at: 0.75, label: 'p⊥ = 0.75mc' }
						]}
						marksHint="the ticks mark no sideways motion and the lumps’ 0.75mc"
					/>
				</div>
				<div
					class="slot"
					onkeydowncapture={sliderKeys(() => gradient, setGradient, GRADIENT)}
					role="presentation"
				>
					<Slider
						id="{uid}-gradient"
						label="The wave’s |∇H|"
						icon={WaveIcon}
						min={GRADIENT.min}
						max={GRADIENT.max}
						step={GRADIENT.step}
						bind:value={() => gradient, setGradient}
						readout="|∇H| = {two(gradient)}"
						ends={['0', '2']}
						marks={[{ at: 1, label: '|∇H| = 1' }]}
						marksHint="the tick marks |∇H| = 1"
					/>
				</div>
				<div class="buttons">
					<div class="pick" role="group" aria-label="Direction of ∇H across z">
						{#each [1, -1] as const as s (s)}
							<button
								type="button"
								aria-pressed={sign === s}
								aria-label="∇H along {s > 0 ? '+' : '−'}x"
								onclick={() => setSign(s)}>{s > 0 ? '+' : '−'}</button
							>
						{/each}
					</div>
					<button type="button" class="action" aria-pressed={kick} onclick={toggleKick}>
						<HugeiconsIcon icon={FlashIcon} size={16} strokeWidth={1.7} />
						Kick
					</button>
					<button type="button" class="action" aria-pressed={mode === 'fixed'} onclick={toggleMode}>
						<HugeiconsIcon icon={LockIcon} size={16} strokeWidth={1.7} />
						Fixed kick
					</button>
				</div>
			</div>
			<p class="mode" aria-live="polite">
				{#if mode === 'wave'}
					The wave’s kick, <Tex math="\Delta p_\perp = \tfrac12q\nabla H" />: a body with a smaller
					<Tex math="q" /> is kicked less.
				{:else}
					A fixed kick, <Tex math={`\\Delta p_\\perp = \\tfrac12${M}c\\nabla H`} trust />, the same
					for every body: not what the wave gives.
				{/if}
				Either keeps <Tex math="q" />.
			</p>
			<p class="hint">
				The sliders set the body before the kick; “Kick” applies it, and pressing it again takes it
				back. Each slider takes the arrow keys after Tab, a step of 0.05, and Page Up and Page Down
				a step of 0.5.
			</p>
		{:else}
			<div class="controls">
				{#each lumps as l, i (i)}
					<div
						class="slot"
						onkeydowncapture={sliderKeys(
							() => lumps[i].perp,
							(v) => setLump(i, 'perp', v),
							MOMENTUM
						)}
						role="presentation"
					>
						<Slider
							id="{uid}-perp-{i}"
							label="Lump {i + 1}, p⊥"
							icon={ArrowLeftRightIcon}
							min={MOMENTUM.min}
							max={MOMENTUM.max}
							step={MOMENTUM.step}
							bind:value={() => lumps[i].perp, (v) => setLump(i, 'perp', v)}
							readout="p⊥ = {two(l.perp)} mc"
							ends={['−1.5', '1.5']}
							marks={[
								{ at: i === 0 ? 0.75 : -0.75, label: `p⊥ = ${i === 0 ? '' : '−'}0.75mc, App. C’s` },
								{ at: 0, label: 'p⊥ = 0' }
							]}
							marksHint="the ticks mark App. C’s value and no sideways motion"
						/>
					</div>
					<div
						class="slot"
						onkeydowncapture={sliderKeys(
							() => lumps[i].pz,
							(v) => setLump(i, 'pz', v),
							MOMENTUM
						)}
						role="presentation"
					>
						<Slider
							id="{uid}-pz-{i}"
							label="Lump {i + 1}, p_z"
							icon={ArrowUpDownIcon}
							min={MOMENTUM.min}
							max={MOMENTUM.max}
							step={MOMENTUM.step}
							bind:value={() => lumps[i].pz, (v) => setLump(i, 'pz', v)}
							readout="p_z = {two(l.pz)} mc"
							ends={['−1.5', '1.5']}
							marks={[{ at: 0, label: 'p_z = 0, App. C’s' }]}
							marksHint="the tick marks App. C’s p_z = 0"
						/>
					</div>
				{/each}
				<div class="buttons wide">
					<button
						type="button"
						class="action"
						aria-pressed={wave === 'stop'}
						onclick={() => setWave('stop')}
					>
						<HugeiconsIcon icon={StopCircleIcon} size={16} strokeWidth={1.7} />
						Stop them
					</button>
					<button
						type="button"
						class="action"
						aria-pressed={wave === 'reverse'}
						onclick={() => setWave('reverse')}
					>
						<HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={16} strokeWidth={1.7} />
						Reverse
					</button>
					<button type="button" class="action" onclick={backToAppC}>
						<HugeiconsIcon icon={UndoIcon} size={16} strokeWidth={1.7} />
						App. C’s pair
					</button>
				</div>
			</div>
			<p class="hint">
				The sliders set the pair before the wave. “Stop them” applies the wave <Tex
					math="\nabla H = -2p_\perp/q"
				/> at each lump, which gives each the kick <Tex math="\tfrac12q\nabla H = -p_\perp" />;
				“Reverse” applies <Tex math="-\nabla H" />. Pressing either again takes it back. Each slider
				takes the arrow keys after Tab, a step of 0.05.
			</p>
		{/if}
	</div>

	<div class="readouts">
		{#if view === 'one'}
			<dl>
				<div class="row">
					<dt>The body</dt>
					<dd>
						<table class="numbers">
							<thead>
								<tr>
									<th scope="col"><span class="sr">quantity</span></th>
									<th scope="col">{kick ? 'before' : 'now'}</th>
									{#if kick}<th scope="col">after the kick</th>{/if}
								</tr>
							</thead>
							<tbody>
								{#each ROW_NAMES as name, i (i)}
									<tr class={{ product: i === 7 }}>
										<th scope="row"><Tex math={name} trust /></th>
										<td>{i === 0 && !kick ? etaWords(eta) : three(beforeRows[i])}</td>
										{#if kick}<td>{three(afterRows[i])}</td>{/if}
									</tr>
								{/each}
							</tbody>
						</table>
						<span class="also"
							>The last two rows agree at every <Tex math={ETA} trust /> and <Tex math="p_\perp" />:
							the body stays on its shell.{#if beforeSpot.off || (kick && oneSpot.off)}
								It lies off the panel, drawn at its edge.{/if}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The kick</dt>
					<dd aria-live="polite">
						{#if kick}
							{@render eq([
								mode === 'wave'
									? '\\Delta p_\\perp = \\tfrac12q\\nabla H'
									: `\\Delta p_\\perp = \\tfrac12${M}c\\nabla H`,
								`= ${threeTex(dp)}${MC}`
							])}
							{@render eq([
								'\\Delta E = \\dfrac{c}{2q}\\,\\Delta(p_\\perp^2)',
								`= ${threeTex(gain)}${MC2}`
							])}<span class="also"
								>beside Newton’s <Tex
									math={`${V}_\\perp\\Delta p_\\perp + \\dfrac{|\\Delta p_\\perp|^2}{2${M}} = ${threeTex(newton)}${MC2}`}
									trust
								/>, with <Tex
									math={`${V}_\\perp = p_\\perp c^2/E = ${threeTex(betaPerp(before))}\\,c`}
									trust
								/>. {#if perp === 0}
									With <Tex math="p_\perp = 0" /> the gain is <Tex
										math={`\\tfrac18cq|\\nabla H|^2${mode === 'wave' ? '' : '\\,(' + M + 'c/q)^2'}`}
										trust
									/>.{/if}
								<Tex math="p_z" /> grows by <Tex math="\Delta E/c" /> too.</span
							>
						{:else}
							<span class="also"
								>Press “Kick” to apply it: <Tex math="q" /> is kept, and the energy gained is <Tex
									math="\Delta E = (c/2q)\,\Delta(p_\perp^2)"
								/>.</span
							>
						{/if}
					</dd>
				</div>
			</dl>
			<p class="note">
				Momenta are in units of <Tex math={`${M}c`} trust /> and energies of <Tex
					math={`${M}c^2`}
					trust
				/>. The body moves along <Tex math="z" /> with the rapidity <Tex math={ETA} trust />, so
				that
				<Tex math={`q = \\sqrt{${M}^2c^2 + p_\\perp^2}\\,e^{-${ETA}}`} trust /> and <Tex
					math={`E/c + p_z = \\sqrt{${M}^2c^2 + p_\\perp^2}\\,e^{${ETA}}`}
					trust
				/>, and across it with <Tex math="p_\perp" />, along <Tex math="x" />. The wave travels
				along
				<Tex math="+z" />. The slider lands exactly on <Tex math="0" /> and <Tex math="\pm\ln 2" /> when
				it passes within 0.0075 of them. Newton’s rule is chapter 1.7’s, with the body’s own sideways
				velocity; the two agree for a slow body.
			</p>
		{:else}
			<dl>
				<div class="row">
					<dt>The lumps</dt>
					<dd>
						<table class="numbers">
							<thead>
								<tr>
									<th scope="col"><span class="sr">quantity</span></th>
									<th scope="col">lump 1</th>
									<th scope="col">lump 2</th>
								</tr>
							</thead>
							<tbody>
								{#each [{ name: `p_\\perp/${M}c`, of: (b: Body) => b.perp }, { name: `p_z/${M}c`, of: (b: Body) => b.pz }, { name: `E/${M}c^2`, of: (b: Body) => b.e }, { name: `q/${M}c`, of: (b: Body) => b.q }] as r (r.name)}
									<tr>
										<th scope="row"><Tex math={r.name} trust /></th>
										{#each shownLumps as b, i (i)}<td>{three(r.of(b))}</td>{/each}
									</tr>
								{/each}
								<tr>
									<th scope="row"><Tex math="p_\perp/q" /></th>
									{#each pair.x as x, i (i)}<td>{three(x)}</td>{/each}
								</tr>
								<tr>
									<th scope="row"><Tex math="q_a/Q" /></th>
									{#each pair.weights as w, i (i)}<td>{three(w)}</td>{/each}
								</tr>
							</tbody>
						</table>
						<span class="also">The pair {WAVE_WORDS[wave]}.</span>
					</dd>
				</div>
				<div class="row">
					<dt>The sum</dt>
					<dd>
						{@render eq([`Q = \\textstyle\\sum_a q_a`, `= ${threeTex(pair.Q)}${MC}`])}
						{@render eq([`Q\\textstyle\\sum_a ${M}^2c^2/q_a`, `= ${threeTex(pair.first)}${M2C2}`])}
						{@render eq(['\\mathrm{Var}(p_\\perp/q)', `= ${threeTex(pair.variance)}`])}
						{@render eq([
							'Q^2\\,\\mathrm{Var}(p_\\perp/q)',
							`= ${threeTex(pair.spread)}${M2C2}`
						])}<span class="also"
							>A wave keeps every <Tex math="q_a" />, so <Tex math="Q" /> and the first term stay as they
							are.</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The rest mass</dt>
					<dd>
						{@render eq([
							`${MM} = \\sqrt{Q\\textstyle\\sum_a ${M}^2c^2/q_a + Q^2\\,\\mathrm{Var}}\\,/c`,
							`= ${threeTex(pair.massSum)}\\,${M}`
						])}
						{@render eq([
							`${MM} = \\sqrt{(\\textstyle\\sum_a E_a/c)^2 - |\\textstyle\\sum_a\\mathbf p_a|^2}\\,/c`,
							`= ${threeTex(pair.massDirect)}\\,${M}`
						])}<span class="also">the sum and the direct formula agree.</span>
					</dd>
				</div>
				<div class="row">
					<dt>A wave and its reverse</dt>
					<dd>
						{@render eq([`${MM}_0 = ${threeTex(Math.sqrt(even.zero))}\\,${M}`])}
						{@render eq([`${MM}_+ = ${threeTex(Math.sqrt(even.plus))}\\,${M}`])}
						{@render eq([`${MM}_- = ${threeTex(Math.sqrt(even.minus))}\\,${M}`])}
						{@render eq([
							`${MM}_+^2 + ${MM}_-^2 - 2${MM}_0^2`,
							`= ${threeTex(even.left)}\\,${M}^2`
						])}{@render eq([
							'Q^2\\,\\mathrm{Var}(\\nabla H)/2c^2',
							`= ${threeTex(even.right)}\\,${M}^2`
						])}<span class="also"
							>with <Tex math={`${MM}_+`} trust /> after the wave that stops the lumps, <Tex
								math={`${MM}_-`}
								trust
							/> after its reverse, and <Tex math={`${MM}_0`} trust /> before either.</span
						>
					</dd>
				</div>
			</dl>
			<p class="note">
				Each lump has the rest mass <Tex math={M} trust />, and momenta are in units of <Tex
					math={`${M}c`}
					trust
				/>. The sideways momenta lie along one direction, <Tex math="x" />, so <Tex
					math="p_\perp"
				/> has a sign. The weights of the variance are <Tex math="q_a/Q" />, and its values <Tex
					math={'p_{\\perp a}/q_a'}
				/>; the wave’s <Tex math="\nabla H" /> is taken at each lump, with the same weights.
			</p>
		{/if}
	</div>
</div>

<style>
	.mass-shell {
		/* the bodies and their shells in the matter colour, light's lines named in light's, as the chapter colours m
		   and light; the axes, the grids and the kicks in the ink */
		--matter: var(--q-matter);
		--light: var(--q-light);
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
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 0.35rem;
	}

	.tag {
		font: italic 500 0.95rem/1.3 var(--font-serif);
		color: var(--accent);
	}

	.count {
		font: 500 0.72rem/1 var(--font-sans);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
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

	.pick button:focus-visible,
	.next:focus-visible,
	.action:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		max-width: 520px;
		height: auto;
		margin: 0 auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 500;
		fill: var(--text);
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
		font-variant-numeric: tabular-nums;
	}

	.tick-number {
		fill: var(--text-dim);
		font-variant-numeric: tabular-nums;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	text.light-words {
		fill: var(--light);
		font-style: italic;
		font-family: var(--font-serif);
	}

	text.off-words {
		fill: var(--matter);
		text-anchor: middle;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.beyond {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.plain-axis {
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.cone-grid {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.axis {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 80%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.shell {
		fill: none;
		stroke: var(--matter);
		stroke-width: calc(1.5px * var(--u, 1));
	}

	.shell.after {
		stroke-dasharray: calc(6px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.shell.rest {
		stroke: color-mix(in srgb, var(--matter) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.drop {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.q-line {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.kick-shaft {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.kick-head {
		fill: var(--text);
	}

	.body {
		fill: var(--matter);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.body.off {
		fill: none;
		stroke: var(--matter);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.ring {
		fill: var(--bg-sunken);
		stroke: var(--matter);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.name {
		fill: var(--text);
		font: 600 calc(12px * var(--u, 1)) / 1 var(--font-sans);
	}

	.strip {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.spread {
		fill: color-mix(in srgb, var(--matter) 22%, transparent);
		stroke: color-mix(in srgb, var(--matter) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mean {
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
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
		flex: none;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.axis-key {
		border-top-width: 2px;
		border-color: color-mix(in srgb, var(--text) 80%, transparent);
	}

	.shell-key {
		border-color: var(--matter);
	}

	.rest-key {
		border-top-style: dotted;
		border-color: color-mix(in srgb, var(--matter) 60%, transparent);
	}

	.q-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: var(--text-dim);
	}

	.spread-key {
		height: 0.45rem;
		border: 1px solid color-mix(in srgb, var(--matter) 55%, transparent);
		border-radius: 4px;
		background: color-mix(in srgb, var(--matter) 22%, transparent);
	}

	.dot-key {
		display: inline-block;
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
	}

	.ring-key {
		border: 1.5px solid var(--matter);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: center;
	}

	.slot {
		min-width: 0;
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.buttons.wide {
		grid-column: 1 / -1;
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
		min-width: 2.1rem;
		min-height: 2rem;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--text-dim);
		font: 600 0.9rem/1 var(--font-sans);
		cursor: pointer;
	}

	.pick button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
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

	.action[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--accent) 60%, transparent);
		background: color-mix(in srgb, var(--accent) 10%, var(--bg));
	}

	@media (hover: hover) {
		.action:hover {
			border-color: var(--accent);
		}
	}

	.mode,
	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.mode {
		color: var(--text);
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
		min-width: 0;
	}

	/* a formula in pieces breaks between them, never inside one */
	.eq {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		min-width: 0;
		max-width: 100%;
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	/* the chapter's own tables are styled for the text: this one keeps its own */
	.numbers {
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
		margin: 0;
		width: auto;
	}

	.numbers th,
	.numbers td {
		padding: 0.1rem 0.9rem 0.1rem 0;
		border: 0;
		background: none;
		text-align: right;
		font-weight: 400;
		white-space: nowrap;
	}

	.numbers thead th {
		color: var(--text-dim);
		border-bottom: 1px solid var(--line);
	}

	.numbers tbody th {
		text-align: left;
		color: var(--text);
	}

	.numbers .product th,
	.numbers .product td {
		border-top: 1px solid var(--line);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
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

		.controls {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.numbers th,
		.numbers td {
			padding-right: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
