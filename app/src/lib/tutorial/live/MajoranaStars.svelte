<script lang="ts">
	/**
	 * Chapter 8.4's Majorana stars. Left: a sphere of directions that the reader turns, with the four stars of a
	 * reading 𝒲 (or, by a switch, the two of light's F), each one of its spins one half, which can be dragged; touching
	 * dots are stars that coincide. From the centre an arrow for the Bloch vector b of any one of the spins, b = P/u for
	 * a reading, its length written to two decimals, and a dashed ring at the direction n̂ chosen by a click. Right: the
	 * components c_m as bars of height |c_m| with a dial for each phase, and the readouts |b| and the overlap |⟨n̂|ψ⟩|²
	 * with the coherent state at n̂. The engine is ../../engine/majorana.ts, the figure's arithmetic ./majorana-stars.ts.
	 * Opens on a body with a wave; three predictions at the top are answered once the reader has done what each asks.
	 * Nothing in it moves by itself, so reduced motion changes nothing.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Atom02Icon,
		Orbit01Icon,
		RefreshIcon,
		SparklesIcon,
		Sun03Icon,
		WavesIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		AWAY,
		KEY_LARGE,
		KEY_STEP,
		OPENING,
		SNAP,
		degrees,
		directionAt,
		fixed,
		greatCircle,
		groupsOf,
		mWords,
		noteFirst,
		noteSecond,
		noteThird,
		placeOf,
		placeStep,
		placeWords,
		presetStars,
		readingOf,
		screenOf,
		snapped,
		starsWords,
		turned,
		vecOf,
		vecWords,
		viewStep,
		type Kind,
		type Place,
		type Vec3,
		type View
	} from './majorana-stars';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let light = $state(OPENING.light);
	/** The reading's four stars and light's two, each kept while the other is shown. */
	let gravityStars = $state<Place[]>(presetStars(OPENING.kind, false));
	let lightStars = $state<Place[]>(presetStars(OPENING.kind, true));
	/** The preset shown, until a star is moved. */
	let kind = $state<Kind | undefined>(OPENING.kind);
	let probe = $state<Place>({ ...OPENING.probe });
	let view = $state<View>({ ...OPENING.view });

	const stars = $derived(light ? lightStars : gravityStars);

	function setStars(next: Place[]) {
		if (light) lightStars = next;
		else gravityStars = next;
		note();
	}
	function choose(k: Kind) {
		kind = k;
		setStars(presetStars(k, light));
	}
	function setLight(v: boolean) {
		light = v;
		kind = undefined;
		note();
	}
	/** A star moved to a place, coming to rest on another star or a pole within SNAP. */
	function moveStar(i: number, p: Place) {
		const others = stars.filter((_, j) => j !== i);
		const next = stars.slice();
		next[i] = snapped(p, others);
		kind = undefined;
		setStars(next);
	}
	function reset() {
		light = OPENING.light;
		gravityStars = presetStars(OPENING.kind, false);
		lightStars = presetStars(OPENING.kind, true);
		kind = OPENING.kind;
		probe = { ...OPENING.probe };
		view = { ...OPENING.view };
		note();
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	function note() {
		const s = { light, stars: gravityStars };
		first = noteFirst(first, s);
		second = noteSecond(second, s);
		third = noteThird(third, s);
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const now = $derived(readingOf(stars, probe));
	const count = $derived(stars.length);

	// --- the sphere -------------------------------------------------------------------------------------------------
	const W = 420;
	const H = 420;
	const C = { x: 210, y: 226 };
	const R = 164;
	/** Drawing units in one CSS pixel, for the sphere and for the bars. */
	let u = $state(1);
	let ub = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	const at = (n: Vec3) => {
		const s = screenOf(view, n, R);
		return { x: C.x + s.x, y: C.y + s.y, z: s.z };
	};
	const equator = $derived(greatCircle(view, [0, 0, 1], R, C.x, C.y));
	const meridian = $derived(greatCircle(view, [0, 1, 0], R, C.x, C.y));
	const axes = $derived(
		(
			[
				{ name: 'x', n: [1, 0, 0] },
				{ name: 'y', n: [0, 1, 0] },
				{ name: 'z', n: [0, 0, 1] }
			] as { name: string; n: Vec3 }[]
		).map((a) => ({
			name: a.name,
			from: a.name === 'z' ? at([0, 0, -1.16]) : at([0, 0, 0]),
			to: at(a.n.map((x) => 1.16 * x) as Vec3),
			label: at(a.n.map((x) => 1.27 * x) as Vec3)
		}))
	);

	/** The radius of a star's dot, and where the members of a group of coincident stars sit, touching. */
	const DOT = 5.2;
	function offsets(k: number, r: number): [number, number][] {
		if (k === 4)
			return [
				[-r, -r],
				[r, -r],
				[-r, r],
				[r, r]
			];
		if (k === 3)
			return [
				[-r, r * 0.6],
				[r, r * 0.6],
				[0, -r]
			];
		if (k === 2)
			return [
				[-r, 0],
				[r, 0]
			];
		return [[0, 0]];
	}

	/** Each star on the screen, in the stars' own order, with the size of its group. */
	const dots = $derived.by(() => {
		const out: { i: number; x: number; y: number; z: number; group: number }[] = [];
		for (const g of groupsOf(stars)) {
			const c = at(vecOf(stars[g[0]]));
			const offs = offsets(g.length, DOT * 1.04 * u);
			g.forEach((i, j) =>
				out.push({ i, x: c.x + offs[j][0], y: c.y + offs[j][1], z: c.z, group: g.length })
			);
		}
		return out.sort((a, b) => a.i - b.i);
	});
	const behind = $derived(dots.filter((d) => d.z < 0));
	/** A star behind the sphere fades with its depth, so that one just past the rim still reads clearly. */
	const fade = (z: number) => Math.max(0.3, Math.min(1, 1 + 2.2 * (z + 0.05))).toFixed(2);
	const inFront = $derived(dots.filter((d) => d.z >= 0));

	/** The arrow for b, from the centre, with its head and its words beyond the tip. */
	const arrow = $derived.by(() => {
		const tip = at(now.b);
		const dx = tip.x - C.x;
		const dy = tip.y - C.y;
		const l = Math.hypot(dx, dy);
		if (now.length < 0.005) return { none: true as const };
		const t = l > 1e-6 ? { x: dx / l, y: dy / l } : { x: 0, y: -1 };
		const n = { x: -t.y, y: t.x };
		const h = Math.min(9 * u, Math.max(4 * u, 0.5 * l));
		const back = { x: tip.x - h * t.x, y: tip.y - h * t.y };
		const w = 0.42 * h;
		const head = `${f1(tip.x)},${f1(tip.y)} ${f1(back.x + w * n.x)},${f1(back.y + w * n.y)} ${f1(back.x - w * n.x)},${f1(back.y - w * n.y)}`;
		// the words beyond the tip, or beside the centre for an arrow seen end on
		const gap = 14 * u;
		const label =
			l > 18 * u
				? {
						x: tip.x + gap * t.x,
						y: tip.y + gap * t.y + 4 * u,
						anchor: t.x > 0.3 ? 'start' : t.x < -0.3 ? 'end' : 'mid'
					}
				: { x: C.x + 10 * u, y: C.y - 10 * u, anchor: 'start' };
		return { none: false as const, x2: back.x, y2: back.y, head, label, tip };
	});

	const probeAt = $derived(at(vecOf(probe)));

	// --- dragging and clicking --------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	let drag:
		| { kind: 'star'; index: number; nearRim: boolean }
		| { kind: 'turn'; x: number; y: number; view: View; moved: boolean }
		| undefined;

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	/** The star under a point: the nearest in front within reach, else the nearest behind. */
	function pick(p: { x: number; y: number }): number | undefined {
		const nearest = (list: typeof dots, reach: number) => {
			let best: number | undefined;
			let d0 = reach;
			for (const d of list) {
				const dd = Math.hypot(d.x - p.x, d.y - p.y);
				if (dd < d0) {
					d0 = dd;
					best = d.i;
				}
			}
			return best;
		};
		return nearest(inFront, 13 * u) ?? nearest(behind, 9 * u);
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		const p = local(e);
		if (!p) return;
		// a drag is not a click: nothing takes the focus, and no ring is drawn
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		const i = pick(p);
		drag =
			i === undefined
				? { kind: 'turn', x: p.x, y: p.y, view: { ...view }, moved: false }
				: { kind: 'star', index: i, nearRim: (dots.find((d) => d.i === i)?.z ?? 1) > -0.12 };
		dragging = true;
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		const p = local(e);
		if (!p) return;
		if (drag.kind === 'star') {
			// of the two points under the pointer, in front and behind, the one nearer the star, so that a star can be
			// carried over the rim to the other side
			const x = (p.x - C.x) / R;
			const y = (p.y - C.y) / R;
			const prev = vecOf(stars[drag.index]);
			const front = directionAt(view, x, y, true);
			const back = directionAt(view, x, y, false);
			// a star on the rim, or just behind it, comes forward as it is first moved
			const n =
				drag.nearRim ||
				Math.hypot(...front.map((v, k) => v - prev[k])) <=
					Math.hypot(...back.map((v, k) => v - prev[k]))
					? front
					: back;
			drag.nearRim = false;
			moveStar(drag.index, placeOf(n, stars[drag.index].phi));
			return;
		}
		const dx = p.x - drag.x;
		const dy = p.y - drag.y;
		if (!drag.moved && Math.hypot(dx, dy) < 4 * u) return;
		drag.moved = true;
		view = turned(drag.view, dx, dy, R);
	}

	/** A press that did not move, on the sphere, chooses n̂ there. */
	function release(e: PointerEvent) {
		if (drag?.kind === 'turn' && !drag.moved) {
			const p = local(e);
			if (p) {
				const x = (p.x - C.x) / R;
				const y = (p.y - C.y) / R;
				if (x * x + y * y <= 1) probe = placeOf(directionAt(view, x, y, true), probe.phi);
			}
		}
		drag = undefined;
		dragging = false;
	}

	function cancel() {
		drag = undefined;
		dragging = false;
	}

	// --- the keys ---------------------------------------------------------------------------------------------------
	let selected = $state<number | undefined>(undefined);

	function starKeys(e: KeyboardEvent, i: number) {
		const next = placeStep(stars[i], e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		moveStar(i, next);
	}
	function probeKeys(e: KeyboardEvent) {
		const next = placeStep(probe, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		probe = next;
	}
	function sphereKeys(e: KeyboardEvent) {
		const next = viewStep(view, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		view = next;
	}

	// --- the bars ---------------------------------------------------------------------------------------------------
	const BW = 300;
	const BH = 256;
	const X0 = 40;
	const TOP = 44;
	const BASE = 178;
	const SPAN = BASE - TOP;
	const DIAL_Y = 222;
	const DIAL_R = 13;
	const slot = (m: number) => X0 + 50 * (m + 2) + 25;
	const yTicks = [0, 0.5, 1];

	// --- the words --------------------------------------------------------------------------------------------------
	const spins = $derived(light ? 'two' : 'four');
	const presetNames = $derived<Record<Kind, string>>(
		light
			? {
					wave: 'A wave',
					body: 'A charge at rest',
					'body-wave': 'A charge and a wave',
					'two-bodies': 'Two charges'
				}
			: {
					wave: 'A wave',
					body: 'A body at rest',
					'body-wave': 'A body and a wave',
					'two-bodies': 'Two bodies'
				}
	);
	const viewWords = $derived(
		`seen from the azimuth ${degrees(view.az)} and the elevation ${degrees(view.el)}`
	);
	const description = $derived(
		`A sphere of directions, ${viewWords}, with ẑ marked, and ${light ? 'light’s two stars' : 'the reading’s four stars'}: ${starsWords(stars)}. ` +
			(now.length < 0.005
				? 'At the centre a small open circle: one spin’s Bloch vector b is zero. '
				: `From the centre an arrow for one spin’s Bloch vector b${light ? '' : ' = P/u'} = ${vecWords(now.b)}, of length ${fixed(now.length)}. `) +
			`A dashed ring marks n̂ at ${placeWords(probe)}.`
	);
	const summary = $derived(
		`|b| = ${fixed(now.length)}; overlap with the coherent state at n̂, ${fixed(now.overlap)}.`
	);
	const starLabel = (i: number) =>
		`Star ${i + 1} of ${count}, at ${placeWords(stars[i])}. Up and Down move it toward ẑ or away by ${KEY_STEP}°, Left and Right turn it about ẑ, Shift by ${KEY_LARGE}°; Home and End take it to the poles.`;
	const barsDescription = $derived(
		`Bars for the ${count + 1} components c_m, m = ${mWords(-count / 2)} to ${mWords(count / 2)}, each as high as |c_m| with a dial for its phase: ` +
			now.bars
				.map(
					(b) =>
						`m = ${mWords(b.m)}: ${fixed(b.size)}${b.phase === undefined ? '' : `, phase ${degrees((b.phase * 180) / Math.PI)}`}`
				)
				.join('; ') +
			'.'
	);
</script>

<div class="majorana-stars">
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
				Put all four stars together. How long is the arrow of one spin?
			{:else if step === 2}
				Put two stars at each pole. What is it now?
			{:else}
				Move one of the four stars away from the other three. Does the arrow stay at one?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>One: the spin is pure.</strong> Four stars at <Tex math="\hat n" /> are the coherent state
				<Tex math="|\hat n\rangle|\hat n\rangle|\hat n\rangle|\hat n\rangle" />, a product of four
				spins each up along <Tex math="\hat n" />, so each has <Tex math="\mathbf b = \hat n" />, on
				the sphere, and the four are not entangled. One wave’s reading is this state, with its stars
				on the direction of travel and <Tex math="|\mathbf P| = u" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>Zero: each spin is unpolarized,</strong> as in a single body’s rest frame. The state
				is the same after any turn about <Tex math="z" />, and a half turn about <Tex math="x" /> swaps
				the pairs, so its <Tex math="\mathbf b" />, which turns with it, can only be zero. The four
				together are pure while each is mixed, so they are entangled. A body at rest on the <Tex
					math="z"
				/> axis, <Tex
					trust
					math={'\\htmlClass{q-curv}{\\mathcal W} \\propto \\mathrm{diag}(1, 1, -2)'}
				/>, has these stars.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>No: it shortens, because the four are now entangled, but slowly at first.</strong>
				With the lone star at the angle <Tex math="\alpha" /> from the other three, <Tex
					math={'1 - |\\mathbf b|^2 = \\frac{3\\sin^4(\\alpha/2)}{4\\,(1 + 3\\cos^2(\\alpha/2))^2}'}
				/>, about <Tex math="3\alpha^4/1024" /> for a small move, so the arrow first mostly turns toward
				the lone star. It is 0.98 at 90°, and 0.5 with the lone star opposite. Only stars that all coincide
				make a product state, and with it a pure spin.
			{:else if step === 1}
				The answer appears once all four of the reading’s stars sit together, with light switched
				off.
			{:else if step === 2}
				The answer appears once two of the reading’s stars sit at the north pole and two at the
				south (or at any two opposite points).
			{:else}
				The answer appears once three of the reading’s stars sit together and the fourth is at least
				{AWAY}° from them.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			class={['sphere', { dragging }]}
			viewBox="0 0 {W} {H}"
			role="group"
			aria-label={description}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<text class="title" x="6" y="16"
				>{light ? 'Light’s two stars' : 'The reading’s four stars'} on the sphere of directions</text
			>

			<!-- behind the sphere, faint: the far halves of the circles, the stars and n̂ there -->
			<path class="circle back" d={equator.back} />
			<path class="meridian back" d={meridian.back} />
			{#each behind as d (d.i)}
				<circle
					class="star behind"
					cx={f1(d.x)}
					cy={f1(d.y)}
					r={f1(DOT * (d.z > -0.1 ? 1 : 0.85) * u)}
					style:opacity={fade(d.z)}
				/>
			{/each}
			{#if probeAt.z < 0}
				<circle class="probe behind" cx={f1(probeAt.x)} cy={f1(probeAt.y)} r={f1(7.5 * u)} />
			{/if}

			<circle class="disc" cx={C.x} cy={C.y} r={R} />
			{#each axes as a (a.name)}
				<line
					class={['axis', { z: a.name === 'z' }]}
					x1={f1(a.from.x)}
					y1={f1(a.from.y)}
					x2={f1(a.to.x)}
					y2={f1(a.to.y)}
				/>
				<text class="axis-name it mid" x={f1(a.label.x)} y={f1(a.label.y + 4 * u)}>{a.name}</text>
			{/each}
			<path class="meridian" d={meridian.front} />
			<path class="circle" d={equator.front} />

			<!-- one spin's Bloch vector -->
			{#if arrow.none}
				<circle class="zero" cx={C.x} cy={C.y} r={f1(4 * u)} />
				<text class="small strong start halo" x={f1(C.x + 9 * u)} y={f1(C.y - 8 * u)}
					><tspan class="bold">b</tspan> = 0</text
				>
			{:else}
				<line class="arrow" x1={C.x} y1={C.y} x2={f1(arrow.x2)} y2={f1(arrow.y2)} />
				<polygon class="head" points={arrow.head} />
				<text
					class="small strong halo {arrow.label.anchor}"
					x={f1(arrow.label.x)}
					y={f1(arrow.label.y)}>|<tspan class="bold">b</tspan>| = {fixed(now.length)}</text
				>
			{/if}
			<circle class="centre" cx={C.x} cy={C.y} r={f1(1.6 * u)} />

			<!-- n̂ and the stars in front -->
			{#if probeAt.z >= 0}
				<circle class="probe" cx={f1(probeAt.x)} cy={f1(probeAt.y)} r={f1(7.5 * u)} />
			{/if}
			<text
				class={['label', 'it', 'start', 'halo', { dim: probeAt.z < 0 }]}
				x={f1(probeAt.x + 10 * u)}
				y={f1(probeAt.y - 7 * u)}>n</text
			>
			<text
				class={['label', 'start', { dim: probeAt.z < 0 }]}
				x={f1(probeAt.x + 11.2 * u)}
				y={f1(probeAt.y - 12 * u)}>ˆ</text
			>
			{#each inFront as d (d.i)}
				<circle class="star" cx={f1(d.x)} cy={f1(d.y)} r={f1(DOT * u)} />
			{/each}

			<!-- the handles: each star, then n̂, then the sphere itself, in this order for Tab -->
			{#each dots as d (d.i)}
				<g
					class="handle"
					role="slider"
					tabindex="0"
					aria-roledescription="movable star"
					aria-label={starLabel(d.i)}
					aria-valuemin={0}
					aria-valuemax={180}
					aria-valuenow={stars[d.i].theta}
					aria-valuetext={placeWords(stars[d.i])}
					onkeydown={(e) => starKeys(e, d.i)}
					onfocus={() => (selected = d.i)}
					onblur={() => (selected = undefined)}
				>
					<circle class="focus" cx={f1(d.x)} cy={f1(d.y)} r={f1(10 * u)} />
				</g>
			{/each}
			<g
				class="handle"
				role="slider"
				tabindex="0"
				aria-roledescription="movable direction"
				aria-label="The direction n̂ of the coherent state, at {placeWords(
					probe
				)}: the overlap |⟨n̂|ψ⟩|² is {fixed(
					now.overlap
				)}. The arrow keys move it as they move a star; a click on the sphere puts it there."
				aria-valuemin={0}
				aria-valuemax={180}
				aria-valuenow={probe.theta}
				aria-valuetext="{placeWords(probe)}, overlap {fixed(now.overlap)}"
				onkeydown={probeKeys}
			>
				<circle class="focus" cx={f1(probeAt.x)} cy={f1(probeAt.y)} r={f1(12 * u)} />
			</g>
			<circle
				class="surface"
				cx={C.x}
				cy={C.y}
				r={R + 14}
				role="slider"
				tabindex="0"
				aria-roledescription="turnable sphere"
				aria-label="The sphere, {viewWords}. The arrow keys turn it by 5°, Shift by 15°; drag it to turn it, and click it to move n̂."
				aria-valuemin={-180}
				aria-valuemax={180}
				aria-valuenow={view.az}
				aria-valuetext={viewWords}
				onkeydown={sphereKeys}
				onpointerdown={press}
				onpointermove={move}
				onpointerup={release}
				onpointercancel={cancel}
			/>
			<circle class="surface-focus" cx={C.x} cy={C.y} r={R + 8} />
		</svg>

		<div class="side">
			<svg
				class="bars"
				viewBox="0 0 {BW} {BH}"
				role="img"
				aria-label={barsDescription}
				{@attach fitText((value) => (ub = value))}
			>
				<text class="title" x="4" y="16"
					>The {count === 4 ? 'five' : 'three'} components <tspan class="it">c</tspan><tspan
						class="sub it"
						dy="3">m</tspan
					></text
				>
				<line class="axis-line" x1={X0} x2={X0} y1={TOP - 6} y2={BASE} />
				<line class="axis-line" x1={X0} x2={BW - 4} y1={BASE} y2={BASE} />
				{#each yTicks as t (t)}
					<line class="grid" x1={X0} x2={BW - 4} y1={BASE - SPAN * t} y2={BASE - SPAN * t} />
					<text class="small dim end" x={X0 - 6} y={BASE - SPAN * t + 4 * ub}
						>{t === 0.5 ? '½' : String(t)}</text
					>
				{/each}
				<text class="small dim mid" x={X0} y={TOP - 14}
					>|<tspan class="it">c</tspan><tspan class="sub it" dy="3">m</tspan><tspan dy="-3">|</tspan
					></text
				>
				{#each now.bars as b (b.m)}
					{@const x = slot(b.m)}
					{#if b.size * SPAN >= 0.3}
						<rect
							class="bar"
							x={x - 11}
							y={f1(BASE - SPAN * b.size)}
							width="22"
							height={f1(SPAN * b.size)}
						/>
					{/if}
					<text
						class={['small', 'mid', b.size < 0.005 ? 'dim' : 'strong-ish']}
						{x}
						y={f1(BASE - SPAN * b.size - 5 * ub)}>{fixed(b.size)}</text
					>
					<text class="small dim mid" {x} y={BASE + 16 * ub}>{mWords(b.m)}</text>
					<circle class="dial" cx={x} cy={DIAL_Y} r={DIAL_R} />
					<line class="dial-zero" x1={x + DIAL_R - 3} x2={x + DIAL_R + 2} y1={DIAL_Y} y2={DIAL_Y} />
					{#if b.phase !== undefined}
						<line
							class="hand"
							x1={x}
							y1={DIAL_Y}
							x2={f1(x + (DIAL_R - 2.5) * Math.cos(b.phase))}
							y2={f1(DIAL_Y - (DIAL_R - 2.5) * Math.sin(b.phase))}
						/>
						<circle class="hub" cx={x} cy={DIAL_Y} r="1.8" />
					{/if}
				{/each}
				<text class="small dim end" x={X0 - 6} y={BASE + 16 * ub}><tspan class="it">m</tspan></text>
				<text class="small dim end" x={X0 - 6} y={DIAL_Y + 4 * ub}>phase</text>
				<text class="small dim mid" x={(X0 + BW) / 2} y={BH - 4}
					>the hand turns counterclockwise from the right</text
				>
			</svg>

			<dl class="readouts">
				<div class="row">
					<dt>One spin’s arrow</dt>
					<dd>
						<span class="eq"
							><Tex
								math={light
									? `|\\mathbf b| = ${fixed(now.length)}`
									: `|\\mathbf b| = |\\mathbf P|/u = ${fixed(now.length)}`}
							/></span
						>
						<span class="also">
							<Tex
								math={`\\mathbf b = (${now.b
									.map((x) => fixed(x))
									.join(',\\ ')
									.replaceAll('−', '-')})`}
							/>
						</span>
					</dd>
				</div>
				<div class="row">
					<dt>The coherent state at <Tex math="\hat n" /></dt>
					<dd>
						<span class="eq"
							><Tex math={`|\\langle\\hat n|\\psi\\rangle|^2 = ${fixed(now.overlap)}`} /></span
						>
						<span class="also"
							>with <Tex math="\hat n" /> at {placeWords(probe)}; click the sphere to move it</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>{selected === undefined ? 'The stars' : `Star ${selected + 1} of ${count}`}</dt>
					<dd>
						<span class="also"
							>{selected === undefined ? starsWords(stars) : placeWords(stars[selected])}</span
						>
					</dd>
				</div>
			</dl>
		</div>

		<ul class="legend" aria-hidden="true">
			<li><span class="star-key"></span>a star: one of the {spins} spins one half</li>
			<li>
				<span class="pair-key"></span><span class="star-key"></span>touching dots: stars that
				coincide
			</li>
			<li>
				<span class="arrow-key"></span><span>one spin’s Bloch vector <Tex math="\mathbf b" /></span>
			</li>
			<li>
				<span class="probe-key"></span><span
					><Tex math="\hat n" />, where the coherent state points</span
				>
			</li>
		</ul>
	</div>

	<div class="bar-controls">
		<div class="groups">
			<div class="slot">
				<Segmented
					label="Presets"
					options={[
						{ value: 'wave', label: presetNames.wave, icon: WavesIcon },
						{ value: 'body', label: presetNames.body, icon: Atom02Icon },
						{ value: 'body-wave', label: presetNames['body-wave'], icon: SparklesIcon },
						{ value: 'two-bodies', label: presetNames['two-bodies'], icon: Orbit01Icon }
					]}
					bind:value={() => kind ?? ('none' as Kind), choose}
				/>
			</div>
			<div class="slot toggle-slot">
				<Toggle
					icon={Sun03Icon}
					label="Light: a spin one, two stars"
					bind:checked={() => light, setLight}
				/>
			</div>
		</div>
		<div class="controls">
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Drag a star; drag the sphere to turn it, and click it to move <Tex math="\hat n" />. With
				the keys, Tab reaches each star, then <Tex math="\hat n" /> and the sphere; Up and Down move a
				star toward
				<Tex math="z" /> or away by {KEY_STEP}°, Left and Right turn it about <Tex math="z" />,
				Shift by
				{KEY_LARGE}°, and Home and End take it to the poles; on the sphere the arrows turn it. A
				star comes to rest on another, or on a pole, within {SNAP}°.
			</p>
		</div>
	</div>

	<div class="notes">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<p class="note">
			The state is built from its stars as the symmetric product of the spins one half <Tex
				math={'|\\hat n_j\\rangle = (\\cos\\tfrac{\\vartheta_j}2,\\ e^{i\\varphi_j}\\sin\\tfrac{\\vartheta_j}2)'}
			/>, and its components <Tex math="c_m" /> are in the basis of <Tex math="S_z" /> whose phases are
			fixed by
			<Tex math="S_x - iS_y" /> from the top state; for a reading they are <Tex
				trust
				math={'c_m = \\mathrm{tr}(\\mathcal Y_m^\\dagger\\htmlClass{q-curv}{\\mathcal W})'}
			/>, with <Tex math={'\\mathcal Y_2 = \\boldsymbol m\\boldsymbol m^{\\mathsf T}'} />. The
			presets are readings, with the body’s tide <Tex trust math={'\\htmlClass{q-curv}{w}'} /> on the
			<Tex math="z" /> axis and the wave along <Tex math="+\hat z" /> with <Tex
				trust
				math={'\\htmlClass{q-curv}{E_+} = \\htmlClass{q-curv}{w}'}
			/> (two bodies: the second on the <Tex math="y" /> axis with 0.6 of the tide), and their stars are
			found as the roots of
			<Tex
				trust
				math={'\\boldsymbol m(z)^{\\mathsf T}\\htmlClass{q-curv}{\\mathcal W}\\,\\boldsymbol m(z) = 2p(z)'}
			/>, a missing root being a star at <Tex math="-\hat z" />. The overall phase has no effect, so
			the largest component is drawn real and positive. For light the arrow is the Poynting vector
			over <Tex math="c" /> and the energy density, and the presets are a charge on the <Tex
				math="z"
			/> axis and a wave along <Tex math="+\hat z" /> of the same <Tex math="|\mathbf E|" />.
		</p>
	</div>
</div>

<style>
	.majorana-stars {
		container-type: inline-size;
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
		display: grid;
		grid-template-columns: minmax(0, 420px) minmax(0, 300px);
		justify-content: center;
		gap: 0.4rem 1.4rem;
		padding: 0.7rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 35% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.side {
		display: grid;
		align-content: start;
		gap: 0.6rem;
		min-width: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.sphere {
		max-width: 420px;
	}

	svg.bars {
		max-width: 300px;
		margin-top: 0.4rem;
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

	.label {
		font-size: calc(13px * var(--u, 1));
		fill: var(--text);
	}

	.axis-name {
		font-size: calc(12px * var(--u, 1));
		fill: var(--text-faint);
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

	.strong-ish {
		fill: var(--text);
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
	}

	tspan.it {
		font-size: 1.1em;
	}

	tspan.bold {
		font-family: KaTeX_Main, var(--font-serif);
		font-weight: 700;
		font-size: 1.1em;
	}

	tspan.sub {
		font-size: 0.78em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the sphere: an ink outline, a dashed equator, a faint meridian and axes */
	.disc {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		pointer-events: none;
	}

	.circle {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.meridian {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.circle.back,
	.meridian.back {
		stroke: color-mix(in srgb, var(--text) 16%, transparent);
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.axis.z {
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-dasharray: none;
	}

	/* the stars in the curvature colour, outlined in ink; those behind faint */
	.star {
		fill: var(--q-curv);
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.arrow {
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
	}

	.head,
	.centre {
		fill: var(--text);
	}

	.zero {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.probe {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.probe.behind {
		opacity: 0.4;
	}

	/* the handles: a ring when reached by the keys */
	.handle {
		pointer-events: none;
	}

	.handle:focus,
	.surface:focus {
		outline: none;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(2.5px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.surface {
		fill: transparent;
		cursor: grab;
		touch-action: none;
	}

	.sphere.dragging .surface {
		cursor: grabbing;
	}

	.surface-focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
		pointer-events: none;
	}

	.surface:focus-visible + .surface-focus {
		opacity: 1;
	}

	/* the bars in ink, the dials thin, their hands in ink */
	.axis-line {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.bar {
		fill: color-mix(in srgb, var(--text) 78%, transparent);
	}

	.dial {
		fill: var(--bg);
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.dial-zero {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.hand {
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linecap: round;
	}

	.hub {
		fill: var(--text);
	}

	/* --- the readouts beside the bars ------------------------------------------------------- */

	.readouts {
		margin: 0;
		display: grid;
		gap: 0.5rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.row {
		display: grid;
		gap: 0.1rem;
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
		gap: 0.15rem 0.8rem;
		font-variant-numeric: tabular-nums;
		min-width: 0;
	}

	.eq {
		display: inline-flex;
		min-width: 0;
		max-width: 100%;
		overflow-x: auto;
		font-weight: 600;
	}

	.also {
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the legend ------------------------------------------------------------------------- */

	.legend {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem 1rem;
		margin: 0.2rem 0 0;
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

	.star-key,
	.pair-key {
		flex: none;
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 50%;
		border: 1px solid var(--text);
		background: var(--q-curv);
	}

	.pair-key {
		margin-right: -0.4rem;
	}

	.arrow-key {
		flex: none;
		width: 1.1rem;
		height: 2px;
		background: var(--text);
	}

	.probe-key {
		flex: none;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 1.4px dashed var(--text);
	}

	/* --- the controls and the notes ----------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.groups {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(12rem, 1fr);
		gap: 0.8rem 1.1rem;
		align-items: center;
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
		flex: 1 1 16rem;
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.notes {
		padding: 0.65rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
	}

	.note {
		margin: 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	/* on a phone the panels stack */
	@container (max-width: 640px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.side {
			width: 100%;
			max-width: 420px;
		}

		svg.bars {
			margin: 0 auto;
		}

		.groups {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
