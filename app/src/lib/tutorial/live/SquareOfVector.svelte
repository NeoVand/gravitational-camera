<script lang="ts">
	/**
	 * Chapter 9.1's square of a vector. Left: the sky, the sphere of directions seen from +ẑ with its far half faint, on
	 * which the reader drags the wave's direction of travel k̂ (a filled dot) and the axis about which the weights are
	 * counted (a hollow ring, ẑ at the centre as the figure opens); a dashed ring marks the direction read back by
	 * −P/|𝓔|², which sits on −k̂, the source. Under it, a small inset of k̂, e₁ and e₂ seen from the side, and the ring of
	 * free balls under the tide Re[(α⁺e^{−iωt} + α⁻e^{iωt}) m mᵀ] seen along k̂ from the camera's side (orange where a
	 * ball is pulled out, a stretch, blue where it is pulled in, a squeeze), turning slowly by the helicity chosen.
	 * Right: the five bars of gravity's weights and light's three, each |c_m|√⟨T_m|T_m⟩/|𝒲|, with a dial for each
	 * phase. Readouts: the rank, tr 𝒲² and tr 𝒲³, the direction read back, the angle. "Two waves" adds a second
	 * direction and the overlaps cos⁸(ϑ/2) and cos⁴(ϑ/2). Two predictions at the top are answered once the reader has
	 * done what each asks. The arithmetic is ./square-of-vector.ts; under reduced motion the ring opens paused.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		AngleIcon,
		PauseIcon,
		PlayIcon,
		RefreshIcon,
		RotateLeft01Icon,
		RotateRight01Icon,
		WaveIcon,
		WavesIcon,
		ArrowDataTransferHorizontalIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { degrees, directionAt, fixed, placeOf, screenOf, type View } from './majorana-stars';
	import {
		KEY_LARGE,
		KEY_STEP,
		OPENING,
		RANK_FLOOR,
		SNAP,
		ZENITH,
		advance,
		crossing,
		angleOf,
		barsWords,
		complexTex,
		frameOf,
		fromSourcesOf,
		gravityBars,
		lightBars,
		lightWave,
		nextHelicity,
		noteFirst,
		noteSecond,
		overlaps,
		placeAbout,
		placeWords,
		readBack,
		rankOf,
		readingOfWaves,
		relativeOf,
		ringBalls,
		ringTide,
		scaledInvariants,
		secondFor,
		singularValues,
		snapped,
		squeezeAxis,
		stepAbout,
		tiltTo,
		vecTex,
		vecWords,
		waveReading,
		type Helicity,
		type Mode,
		type Place,
		type Vec3
	} from './square-of-vector';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let mode = $state<Mode>(OPENING.mode);
	let waves = $state<Place[]>([{ ...OPENING.wave }, secondFor(OPENING.wave)]);
	let axis = $state<Place>({ ...OPENING.axis });
	let helicity = $state<Helicity>(OPENING.helicity);
	/** The wave whose axes and ring are drawn: the one last moved or reached. */
	let shown = $state<0 | 1>(0);
	const count = $derived(mode === 'two' ? 2 : 1);
	const active = $derived(waves.slice(0, count));
	const ring = $derived(mode === 'two' ? waves[shown] : waves[0]);

	/** Whether the second wave has been moved; until then it comes in 60° from the first. */
	let secondMoved = false;

	function setWave(i: 0 | 1, p: Place) {
		waves[i] = p;
		if (i === 1) secondMoved = true;
		shown = i;
		note();
	}
	function setAxis(p: Place) {
		axis = p;
		note();
	}
	function setMode(m: Mode) {
		mode = m;
		if (m === 'one') shown = 0;
		else if (!secondMoved) waves[1] = secondFor(waves[0]);
		note();
	}
	function reset() {
		mode = OPENING.mode;
		waves = [{ ...OPENING.wave }, secondFor(OPENING.wave)];
		axis = { ...OPENING.axis };
		secondMoved = false;
		helicity = OPENING.helicity;
		shown = 0;
		theta = 0;
		note();
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state(false);
	let second = $state(false);
	const revealed = $derived(step === 1 ? first : second);

	function note() {
		const s = { mode, wave: waves[0], axis };
		first = noteFirst(first, s);
		second = noteSecond(second, s);
	}

	/** The chapter's numbers at 60°, from the same arithmetic. */
	const at60 = (() => {
		const w = placeAbout(ZENITH, 60, 0);
		return {
			g: gravityBars(waveReading(w), ZENITH).map((b) => fixed(b.size, 4)),
			l: lightBars(lightWave(w), ZENITH).map((b) => fixed(b.size, 3))
		};
	})();

	// --- the numbers: the reading at t = 0 ---------------------------------------------------------------------------
	const sum = $derived(readingOfWaves(active));
	const W = $derived(sum.W);
	const gBars = $derived(gravityBars(W, axis));
	const lBars = $derived(lightBars(sum.F, axis));
	const sv = $derived(singularValues(W));
	const rank = $derived(rankOf(W));
	const inv = $derived(scaledInvariants(W));
	const back = $derived(readBack(W));
	const tilt = $derived(angleOf(waves[0], axis));
	const apartAngle = $derived(angleOf(waves[0], waves[1]));
	const overlapOf = $derived(overlaps(waves[0], waves[1]));
	/** How far the direction read back is from each source −k̂, degrees. */
	const fromSources = $derived(back ? fromSourcesOf(back.n, active) : []);

	// --- the time -----------------------------------------------------------------------------------------------------
	let playing = $state(true);
	let theta = $state(0);
	let checked = false;
	/** Runs ωt round slowly while playing; under reduced motion it opens paused, at t = 0. */
	const clock: Attachment = () => {
		// read first, so that pressing play or pause always runs this again
		const on = playing;
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				theta = 0;
				return;
			}
		}
		if (!on) return;
		let raf = 0;
		let last: number | undefined;
		const tick = (t: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (t - last) / 1000);
			last = t;
			theta = advance(theta, dt);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	};

	// --- the sky ------------------------------------------------------------------------------------------------------
	/** The sphere seen from +ẑ, x to the right and y up. */
	const SKY: View = { az: -90, el: 90 };
	const SW = 360;
	const SH = 376;
	const C = { x: 180, y: 196 };
	const R = 150;
	let u = $state(1);
	let ui = $state(1);
	let ur = $state(1);
	let ug = $state(1);
	let ul = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	const sky = (n: Vec3) => {
		const s = screenOf(SKY, n, R);
		return { x: C.x + s.x, y: C.y + s.y, z: s.z };
	};
	const skyOf = (p: Place) => sky(frameOf(p).k);
	/** A mark behind the sphere fades with its depth. */
	const fade = (z: number) => Math.max(0.28, Math.min(1, 1 + 2.2 * (z + 0.05))).toFixed(2);

	const waveDots = $derived(active.map((p, i) => ({ i: i as 0 | 1, ...skyOf(p) })));
	const axisDot = $derived(skyOf(axis));
	const backDot = $derived.by(() => {
		if (!back) return undefined;
		const l = Math.hypot(...back.n);
		if (l < 1e-9) return undefined;
		return sky(back.n.map((x) => x / l) as Vec3);
	});

	/** The great-circle arc between two places, front and back, with a point near its middle for its angle. */
	function arc(a: Place, b: Place) {
		const va = frameOf(a).k;
		const vb = frameOf(b).k;
		const ang = Math.acos(Math.max(-1, Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])));
		if (ang < 0.02) return undefined;
		const s = Math.sin(ang);
		let front = '';
		let behind = '';
		let prev: boolean | undefined;
		const N = 48;
		const at = (t: number) => {
			if (s < 1e-6) return va;
			const wa = Math.sin((1 - t) * ang) / s;
			const wb = Math.sin(t * ang) / s;
			return [0, 1, 2].map((i) => wa * va[i] + wb * vb[i]) as Vec3;
		};
		for (let j = 0; j <= N; j++) {
			const p = sky(at(j / N));
			const isFront = p.z >= 0;
			const cmd = prev === isFront ? 'L' : 'M';
			const pt = `${cmd}${f1(p.x)},${f1(p.y)}`;
			if (isFront) front += pt;
			else behind += pt;
			prev = isFront;
		}
		return { front, behind, mid: sky(at(0.5)), angle: (ang * 180) / Math.PI };
	}
	const theArc = $derived(mode === 'two' ? arc(waves[0], waves[1]) : arc(axis, waves[0]));

	/** Circles of latitude at 30° and 60° from ẑ (and their mirrors behind), and meridians every 45°. */
	const latitudes = [30, 60].map((t) => R * Math.sin((t * Math.PI) / 180));
	const meridians = [0, 45, 90, 135].map((a) => ({
		x: R * Math.cos((a * Math.PI) / 180),
		y: R * Math.sin((a * Math.PI) / 180)
	}));

	// --- dragging -------------------------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold: Attachment<SVGSVGElement> = (node) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state(false);
	let drag: { what: 'wave' | 'axis'; index: 0 | 1; side: 1 | -1; out: boolean } | undefined;

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	/** The dot under a point: the nearest in front within reach, else the nearest behind. */
	function pick(p: { x: number; y: number }) {
		const all = [
			...waveDots.map((d) => ({ what: 'wave' as const, index: d.i, x: d.x, y: d.y, z: d.z })),
			{ what: 'axis' as const, index: 0 as const, ...axisDot }
		];
		const nearest = (list: typeof all, reach: number) => {
			let best: (typeof all)[number] | undefined;
			let d0 = reach;
			for (const d of list) {
				const dd = Math.hypot(d.x - p.x, d.y - p.y);
				if (dd < d0) {
					d0 = dd;
					best = d;
				}
			}
			return best;
		};
		return (
			nearest(
				all.filter((d) => d.z >= 0),
				15 * u
			) ??
			nearest(
				all.filter((d) => d.z < 0),
				11 * u
			)
		);
	}

	/** The direction under the pointer on one side of the sphere, and the pointer's distance from the centre in radii. */
	function under(p: { x: number; y: number }, side: 1 | -1): { n: Vec3; r: number } {
		const x = (p.x - C.x) / R;
		const y = (p.y - C.y) / R;
		return { n: directionAt(SKY, x, y, side > 0), r: Math.hypot(x, y) };
	}

	function moveTo(target: NonNullable<typeof drag>, n: Vec3) {
		if (target.what === 'axis') setAxis(snapped(placeOf(n, axis.phi), ZENITH));
		else setWave(target.index, snapped(placeOf(n, waves[target.index].phi), axis));
	}

	function press(e: PointerEvent) {
		if (e.button !== 0) return;
		const p = local(e);
		if (!p) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		const hit = pick(p);
		// a press on the open sky brings the wave last moved there
		drag = hit
			? { what: hit.what, index: hit.index, side: hit.z >= 0 ? 1 : -1, out: false }
			: { what: 'wave', index: mode === 'two' ? shown : 0, side: 1, out: false };
		dragging = true;
		if (!hit) moveTo(drag, under(p, 1).n);
		else if (hit.what === 'wave') shown = hit.index;
	}

	function move(e: PointerEvent) {
		if (!drag) return;
		const p = local(e);
		if (!p) return;
		// carried out past the rim and back in, a dot comes in on the other side
		const r = under(p, drag.side).r;
		Object.assign(drag, crossing(drag.side, drag.out, r));
		moveTo(drag, under(p, drag.side).n);
	}

	function release() {
		drag = undefined;
		dragging = false;
	}

	// --- the keys -------------------------------------------------------------------------------------------------------
	function waveKeys(e: KeyboardEvent, i: 0 | 1) {
		const next = stepAbout(waves[i], axis, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		setWave(i, next);
	}
	function axisKeys(e: KeyboardEvent) {
		const next = stepAbout(axis, ZENITH, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		setAxis(next);
	}
	/** H, anywhere in the figure, cycles the helicity. */
	function figureKeys(e: KeyboardEvent) {
		if (e.key !== 'h' && e.key !== 'H') return;
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		const t = e.target as HTMLElement | null;
		if (
			t &&
			(t.tagName === 'TEXTAREA' ||
				(t.tagName === 'INPUT' && (t as HTMLInputElement).type === 'text'))
		)
			return;
		e.preventDefault();
		helicity = nextHelicity(helicity);
	}

	// --- the slider: the tilt from the axis, or the angle between the two waves ------------------------------------------
	const sliderValue = $derived(mode === 'two' ? apartAngle : relativeOf(waves[0], axis).tilt);
	function setSlider(v: number) {
		if (mode === 'two') setWave(1, tiltTo(waves[1], waves[0], v));
		else setWave(0, tiltTo(waves[0], axis, v));
	}

	// --- the inset: k̂, e₁ and e₂ seen from the side ----------------------------------------------------------------------
	const IW = 172;
	const IH = 140;
	const IC = { x: 86, y: 74 };
	const IR = 50;
	const SIDE: View = { az: -62, el: 20 };
	const inset = (n: Vec3, s = 1) => {
		const q = screenOf(SIDE, [n[0] * s, n[1] * s, n[2] * s], IR);
		return { x: IC.x + q.x, y: IC.y + q.y, z: q.z };
	};
	/** An arrow from the centre to the point p: its shaft's end and its head. */
	function arrowTo(p: { x: number; y: number }, from: { x: number; y: number }, head: number) {
		const dx = p.x - from.x;
		const dy = p.y - from.y;
		const l = Math.hypot(dx, dy);
		if (l < 1e-6) return undefined;
		const t = { x: dx / l, y: dy / l };
		const h = Math.min(head, 0.6 * l);
		const b = { x: p.x - h * t.x, y: p.y - h * t.y };
		const w = 0.42 * h;
		return {
			x2: f1(b.x + 0.4 * t.x),
			y2: f1(b.y + 0.4 * t.y),
			head: `${f1(p.x)},${f1(p.y)} ${f1(b.x - w * t.y)},${f1(b.y + w * t.x)} ${f1(b.x + w * t.y)},${f1(b.y - w * t.x)}`,
			label: { x: p.x + 9 * t.x, y: p.y + 9 * t.y }
		};
	}
	const insetArrows = $derived.by(() => {
		const f = frameOf(ring);
		const o = { x: IC.x, y: IC.y };
		return [
			{ name: 'k', cls: 'k', v: f.k, ...inset(f.k) },
			{ name: 'e1', cls: 'e', v: f.e1, ...inset(f.e1, 0.82) },
			{ name: 'e2', cls: 'e', v: f.e2, ...inset(f.e2, 0.82) }
		].map((a) => ({ ...a, arrow: arrowTo(a, o, 8 * ui) }));
	});
	const insetAxes = (['x', 'y', 'z'] as const).map((name, i) => {
		const n: Vec3 = [i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0];
		return { name, from: inset(n, -1), to: inset(n, 1.12), label: inset(n, 1.26) };
	});
	/** The ring's plane across k̂, as an ellipse in the inset. */
	const insetRing = $derived.by(() => {
		const { e1, e2 } = frameOf(ring);
		let d = '';
		for (let j = 0; j <= 72; j++) {
			const t = (2 * Math.PI * j) / 72;
			const v = [0, 1, 2].map((i) => 0.62 * (Math.cos(t) * e1[i] + Math.sin(t) * e2[i])) as Vec3;
			const p = inset(v);
			d += `${j ? 'L' : 'M'}${f1(p.x)},${f1(p.y)}`;
		}
		return d;
	});

	// --- the ring of free balls ------------------------------------------------------------------------------------------
	const RW = 172;
	const RH = 152;
	const RC = { x: 86, y: 70 };
	const RR = 40;
	/** The drawn change, in ring radii, per unit of acceleration: 0.3 of the radius at the largest. */
	const D = 0.6;
	const tideNow = $derived(ringTide(helicity, theta));
	const balls = $derived(
		ringBalls(tideNow).map((b) => {
			const at = { x: RC.x + RR * (b.x + D * b.ax), y: RC.y - RR * (b.y + D * b.ay) };
			const v = { x: 1.25 * RR * D * b.ax, y: -1.25 * RR * D * b.ay };
			return { ...b, at, arrow: ballArrow(at, v) };
		})
	);
	function ballArrow(from: { x: number; y: number }, v: { x: number; y: number }) {
		const len = Math.hypot(v.x, v.y);
		const head = 4.6 * ur;
		const ball = 3.6 * ur;
		if (len < head + 2 * ur) return undefined;
		const ux = v.x / len;
		const uy = v.y / len;
		const s = { x: from.x + ux * (ball + 1 * ur), y: from.y + uy * (ball + 1 * ur) };
		const tip = { x: s.x + ux * len, y: s.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = 2.3 * ur;
		return {
			shaft: `M${f1(s.x)},${f1(s.y)}L${f1(base.x + ux * 0.5)},${f1(base.y + uy * 0.5)}`,
			head: `M${f1(tip.x)},${f1(tip.y)}L${f1(base.x - uy * w)},${f1(base.y + ux * w)}L${f1(base.x + uy * w)},${f1(base.y - ux * w)}Z`
		};
	}
	const outline = $derived(
		ringBalls(tideNow, 96)
			.map(
				(b, j) =>
					`${j ? 'L' : 'M'}${f1(RC.x + RR * (b.x + D * b.ax))},${f1(RC.y - RR * (b.y + D * b.ay))}`
			)
			.join('') + 'Z'
	);
	const squeeze = $derived(squeezeAxis(tideNow));
	const axisLines = $derived.by(() => {
		if (squeeze === undefined) return [];
		const L = RR * 1.38;
		return [
			{ kind: 'squeeze', a: squeeze },
			{ kind: 'stretch', a: squeeze + Math.PI / 2 }
		].map((l) => ({ kind: l.kind, x: L * Math.cos(l.a), y: -L * Math.sin(l.a) }));
	});
	const turnWords: Record<Helicity, string> = {
		plus: 'helicity +2: turns anticlockwise',
		minus: 'helicity −2: turns clockwise',
		linear: 'linear: does not turn'
	};

	// --- the bars -------------------------------------------------------------------------------------------------------
	const BW = 290;
	const BH = 212;
	const X0 = 44;
	const TOP = 42;
	const BASE = 146;
	const SPAN = BASE - TOP;
	const DIAL_Y = 184;
	const DIAL_R = 12;
	const slot = (m: number) => X0 + 48 * (m + 2) + 24;
	const yTicks = [0, 0.5, 1];

	// --- the words ------------------------------------------------------------------------------------------------------
	const waveName = (i: number) => (mode === 'two' ? `The wave ${i + 1}` : 'The wave');
	const skyWords = $derived(
		`The sky seen from +ẑ, its far half faint. ${active
			.map((p, i) => `${waveName(i)}’s direction of travel at ${placeWords(p)}`)
			.join('; ')}; the axis at ${placeWords(axis)}${
			mode === 'one' ? `, ${degrees(tilt)} from the wave` : ''
		}. ${back ? `The direction read back, −P/|𝓔|² = ${vecWords(back.n)}, is marked by a dashed ring.` : ''}`
	);
	const ringWords = $derived(
		`The ring of twelve free balls seen along k̂${mode === 'two' ? String(shown + 1) : ''} from the camera’s side, e₁ to the right and e₂ up, ${turnWords[helicity]}. ${
			squeeze === undefined
				? 'At this instant the tide is zero.'
				: `At this instant it is squeezed along ${degrees(((((squeeze * 180) / Math.PI) % 180) + 180) % 180)} from e₁ and stretched across.`
		}`
	);
	const insetWords = $derived.by(() => {
		const f = frameOf(ring);
		return `The wave’s axes seen from the side: k̂ = ${vecWords(f.k)}, e₁ = ${vecWords(f.e1)}, e₂ = ${vecWords(f.e2)}.`;
	});
	const summary = $derived(
		`Rank ${rank}. ` +
			(mode === 'one'
				? `The wave is ${degrees(tilt)} from the axis.`
				: `The waves are ${degrees(apartAngle)} apart; overlaps ${fixed(overlapOf.gravity, 3)} for gravity and ${fixed(overlapOf.light, 3)} for light.`)
	);
	const waveLabel = (i: 0 | 1) =>
		`${waveName(i)}’s direction of travel k̂${mode === 'two' ? i + 1 : ''}, at ${placeWords(waves[i])}, ${degrees(angleOf(waves[i], axis))} from the axis. Up and Down move it toward the axis or away by ${KEY_STEP}°, Left and Right turn it about the axis, Shift by ${KEY_LARGE}°; Home puts it on the axis and End opposite. H changes the helicity.`;
	const axisLabel = $derived(
		`The axis about which the weights are counted, at ${placeWords(axis)}. Up and Down move it toward ẑ or away by ${KEY_STEP}°, Left and Right turn it about ẑ, Shift by ${KEY_LARGE}°; Home brings it back to ẑ.`
	);
	/** Whether the direction read back is −k̂ of the one wave, of length one. */
	const onSource = $derived(
		!!back && mode === 'one' && Math.abs(back.length - 1) < 1e-6 && fromSources[0] < 1e-4
	);
	const svWords = $derived(sv.map((x) => (x <= RANK_FLOOR * sv[0] ? '0' : fixed(x))).join(', '));
</script>

{#snippet hat(x: number, y: number, s: number, sub: string, cls: string)}
	<text class="label it {cls}" {x} {y}
		>k{#if sub}<tspan class="sub" dy={3 * s}>{sub}</tspan>{/if}</text
	>
	<text class="label hat {cls}" x={x + 1.4 * s} y={y - 5.6 * s}>ˆ</text>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="square-of-vector" onkeydown={figureKeys}>
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2] as const as n (n)}
					<button type="button" aria-pressed={step === n} onclick={() => (step = n)}>{n}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Point the wave along the axis. Which bars are not zero?
			{:else}
				Tilt the wave by 60° from the axis. How many bars fill, and what is the rank?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong
					>One for gravity, at <Tex math="m = 2" />, and one for light, at <Tex
						math="m = 1"
					/>.</strong
				>
				About its own direction of travel a wave fills only the extreme weight: its reading is
				<Tex math={'\\mathcal W = c_2\\,T_2 = c_2\\,\\boldsymbol m\\boldsymbol m^{\\mathsf T}'} />,
				which a turn by <Tex math="\psi" /> about <Tex math="\hat k" /> multiplies by <Tex
					math={'e^{-2i\\psi}'}
				/>, and light’s field <Tex math="a\,\boldsymbol m" /> is multiplied by <Tex
					math={'e^{-i\\psi}'}
				/>. With the wave opposite the axis the one bar moves to <Tex math="m = -2" />, and light’s
				to
				<Tex math="m = -1" />.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>All five, and all three for light; the rank is still one.</strong> At 60° the bars
				are
				{at60.g.slice(0, 4).join(', ')} and {at60.g[4]} from <Tex math="m = -2" /> to 2, the last
				<Tex math="\cos^4 30^\circ" />, and light’s are {at60.l.join(', ')}. The weights belong to a
				reading and an axis together, but the rank does not depend on the axis: the reading is still
				the square <Tex math={'\\boldsymbol m\\boldsymbol m^{\\mathsf T}'} /> of the wave’s own
				<Tex math="\boldsymbol m" />, every column a multiple of it, and <Tex
					math={'\\mathrm{tr}\\,\\mathcal W^2'}
				/> and
				<Tex math={'\\mathrm{tr}\\,\\mathcal W^3'} /> are still zero.
			{:else if step === 1}
				The answer appears once the one wave points along the axis: drag its dot onto the hollow
				ring, or reach it with Tab and press Home.
			{:else}
				The answer appears once the one wave is 60° from the axis: drag it, use the slider, or step
				it with the arrow keys.
			{/if}
		</p>
	</section>

	<div class="stage">
		<div class="left">
			<svg
				class={['sky', { dragging }]}
				viewBox="0 0 {SW} {SH}"
				role="group"
				aria-label={skyWords}
				{@attach hold}
				{@attach fitText((value) => (u = value))}
			>
				<text class="title" x="4" y="16">The sky, seen from +ẑ</text>

				<!-- behind the sphere, faint -->
				{#if theArc}<path class="arc back" d={theArc.behind} />{/if}
				{#if backDot && backDot.z < 0}
					<circle class="read behind" cx={f1(backDot.x)} cy={f1(backDot.y)} r={f1(11 * u)} />
				{/if}
				{#if axisDot.z < 0}
					<circle
						class="axis-dot"
						cx={f1(axisDot.x)}
						cy={f1(axisDot.y)}
						r={f1(7.5 * u)}
						style:opacity={fade(axisDot.z)}
					/>
				{/if}
				{#each waveDots.filter((d) => d.z < 0) as d (d.i)}
					<circle
						class="wave-dot"
						cx={f1(d.x)}
						cy={f1(d.y)}
						r={f1(5.4 * u)}
						style:opacity={fade(d.z)}
					/>
				{/each}

				<circle class="disc" cx={C.x} cy={C.y} r={R} />
				{#each latitudes as r (r)}
					<circle class="lat" cx={C.x} cy={C.y} {r} />
				{/each}
				{#each meridians as m (m.x)}
					<line class="lat" x1={C.x - m.x} y1={C.y + m.y} x2={C.x + m.x} y2={C.y - m.y} />
				{/each}
				<text class="axis-name it start" x={C.x + R + 6} y={C.y + 4 * u}>x</text>
				<text class="axis-name it mid" x={C.x} y={C.y - R - 6}>y</text>
				<text class="small dim end" x={C.x + R * 0.5 - 3} y={C.y + 12 * u}>30°</text>
				<text class="small dim end" x={C.x + R * 0.866 - 3} y={C.y + 12 * u}>60°</text>

				<!-- the arc of the angle, the direction read back, the axis and the waves in front -->
				{#if theArc}
					<path class="arc" d={theArc.front} />
					<text
						class={['small', 'strong-ish', 'mid', 'halo', { dim: theArc.mid.z < 0 }]}
						x={f1(theArc.mid.x)}
						y={f1(theArc.mid.y - 7 * u)}>{degrees(theArc.angle)}</text
					>
				{/if}
				{#if backDot}
					{#if backDot.z >= 0}
						<circle class="read" cx={f1(backDot.x)} cy={f1(backDot.y)} r={f1(11 * u)} />
					{/if}
					<text
						class={['small', 'end', 'halo', { dim: backDot.z < 0 }]}
						x={f1(backDot.x - 11 * u)}
						y={f1(backDot.y - 11 * u)}>read back</text
					>
				{/if}
				{#if axisDot.z >= 0}
					<circle class="axis-dot" cx={f1(axisDot.x)} cy={f1(axisDot.y)} r={f1(7.5 * u)} />
				{/if}
				<text
					class={['small', 'end', 'halo', { dim: axisDot.z < 0 }]}
					x={f1(axisDot.x - 11 * u)}
					y={f1(axisDot.y + 15 * u)}>axis</text
				>
				{#each waveDots as d (d.i)}
					{#if d.z >= 0}
						<circle class="wave-dot" cx={f1(d.x)} cy={f1(d.y)} r={f1(5.4 * u)} />
					{/if}
					<g class={['halo-group', { dim: d.z < 0 }]}>
						{@render hat(
							d.x + 9 * u,
							d.y - 9 * u,
							u,
							mode === 'two' ? String(d.i + 1) : '',
							d.z < 0 ? 'dim' : ''
						)}
					</g>
				{/each}

				<!-- the handles: the waves, then the axis, in this order for Tab -->
				{#each waveDots as d (d.i)}
					<g
						class="handle"
						role="slider"
						tabindex="0"
						aria-roledescription="movable direction"
						aria-label={waveLabel(d.i)}
						aria-valuemin={0}
						aria-valuemax={180}
						aria-valuenow={angleOf(waves[d.i], axis)}
						aria-valuetext="{degrees(angleOf(waves[d.i], axis))} from the axis, at {placeWords(
							waves[d.i]
						)}"
						onkeydown={(e) => waveKeys(e, d.i)}
						onfocus={() => (shown = d.i)}
					>
						<circle class="focus" cx={f1(d.x)} cy={f1(d.y)} r={f1(11 * u)} />
					</g>
				{/each}
				<g
					class="handle"
					role="slider"
					tabindex="0"
					aria-roledescription="movable axis"
					aria-label={axisLabel}
					aria-valuemin={0}
					aria-valuemax={180}
					aria-valuenow={axis.theta}
					aria-valuetext={placeWords(axis)}
					onkeydown={axisKeys}
				>
					<circle class="focus" cx={f1(axisDot.x)} cy={f1(axisDot.y)} r={f1(13 * u)} />
				</g>
				<circle
					class="surface"
					cx={C.x}
					cy={C.y}
					r={R + 12}
					onpointerdown={press}
					onpointermove={move}
					onpointerup={release}
					onpointercancel={release}
				/>
			</svg>

			<div class="pair">
				<figure class="panel">
					<figcaption>The axes of <Tex math="\boldsymbol m" />, from the side</figcaption>
					<svg
						class="inset"
						viewBox="0 0 {IW} {IH}"
						role="img"
						aria-label={insetWords}
						{@attach fitText((value) => (ui = value))}
					>
						{#each insetAxes as a (a.name)}
							<line
								class="inset-axis"
								x1={f1(a.from.x)}
								y1={f1(a.from.y)}
								x2={f1(a.to.x)}
								y2={f1(a.to.y)}
							/>
							<text class="axis-name it mid" x={f1(a.label.x)} y={f1(a.label.y + 4 * ui)}
								>{a.name}</text
							>
						{/each}
						<path class="plane" d={insetRing} />
						{#each insetArrows as a (a.name)}
							{#if a.arrow}
								<line
									class={['shaft', a.cls]}
									x1={IC.x}
									y1={IC.y}
									x2={a.arrow.x2}
									y2={a.arrow.y2}
								/>
								<polygon class={['tip', a.cls]} points={a.arrow.head} />
								{#if a.name === 'k'}
									{@render hat(
										a.arrow.label.x - 3 * ui,
										a.arrow.label.y + 4 * ui,
										ui,
										mode === 'two' ? String(shown + 1) : '',
										''
									)}
								{:else}
									<text
										class="label bold-v mid halo"
										x={f1(a.arrow.label.x)}
										y={f1(a.arrow.label.y + 4 * ui)}
										>e<tspan class="sub" dy={3 * ui}>{a.name === 'e1' ? '1' : '2'}</tspan></text
									>
								{/if}
							{/if}
						{/each}
						<circle class="hub" cx={IC.x} cy={IC.y} r={1.6 * ui} />
					</svg>
				</figure>

				<figure class="panel">
					<figcaption>
						The ring, seen along <Tex math={mode === 'two' ? `\\hat k_${shown + 1}` : '\\hat k'} />
					</figcaption>
					<svg
						class="ring"
						viewBox="0 0 {RW} {RH}"
						role="img"
						aria-label={ringWords}
						{@attach clock}
						{@attach fitText((value) => (ur = value))}
					>
						<line class="ring-axis" x1={RC.x} y1={RC.y} x2={RC.x + RR * 1.5} y2={RC.y} />
						<line class="ring-axis" x1={RC.x} y1={RC.y} x2={RC.x} y2={RC.y - RR * 1.5} />
						<text class="small dim bold-v start" x={RC.x + RR * 1.5 + 2} y={RC.y + 4 * ur}
							>e<tspan class="sub" dy={3 * ur}>1</tspan></text
						>
						<text class="small dim bold-v end" x={RC.x - 4 * ur} y={RC.y - RR * 1.5 + 6 * ur}
							>e<tspan class="sub" dy={3 * ur}>2</tspan></text
						>
						{#each axisLines as a (a.kind)}
							<line
								class={['principal', a.kind]}
								x1={RC.x - a.x}
								y1={RC.y - a.y}
								x2={RC.x + a.x}
								y2={RC.y + a.y}
							/>
						{/each}
						<circle class="rest" cx={RC.x} cy={RC.y} r={RR} />
						<path class="bent" d={outline} />
						{#each balls as b, i (i)}
							{#if b.arrow}
								<path class={['ball-shaft', b.kind]} d={b.arrow.shaft} />
								<path class={['ball-head', b.kind]} d={b.arrow.head} />
							{/if}
							<circle class="ball" cx={f1(b.at.x)} cy={f1(b.at.y)} r={3.6 * ur} />
						{/each}
						<!-- k̂ toward the viewer -->
						<circle class="toward" cx={RC.x} cy={RC.y} r={3.4 * ur} />
						<circle class="hub" cx={RC.x} cy={RC.y} r={1.1 * ur} />
						<text class="small mid" x={RW / 2} y={RH - 4}>{turnWords[helicity]}</text>
					</svg>
				</figure>
			</div>
		</div>

		<div class="right">
			{#each [{ name: 'gravity', bars: gBars }, { name: 'light', bars: lBars }] as panel (panel.name)}
				{@const gravity = panel.name === 'gravity'}
				{@const ub = gravity ? ug : ul}
				<svg
					class="bars"
					viewBox="0 0 {BW} {BH}"
					role="img"
					aria-label={`${gravity ? 'Gravity’s five weights' : 'Light’s three weights'} about the axis, each bar |c_m| times √⟨T_m|T_m⟩ over the length, with a dial for its phase: ${barsWords(panel.bars)}.`}
					{@attach fitText((value) => (gravity ? (ug = value) : (ul = value)))}
				>
					<text class="title" x="2" y="16"
						>{#if gravity}Gravity: the five weights of 𝒲{:else}Light: the three weights of <tspan
								class="bold-v">F</tspan
							>{/if}</text
					>
					<line class="axis-line" x1={X0} x2={X0} y1={TOP - 6} y2={BASE} />
					<line class="axis-line" x1={X0} x2={BW - 4} y1={BASE} y2={BASE} />
					{#each yTicks as t (t)}
						<line class="grid" x1={X0} x2={BW - 4} y1={BASE - SPAN * t} y2={BASE - SPAN * t} />
						<text class="small dim end" x={X0 - 5} y={BASE - SPAN * t + 4 * ub}
							>{t === 0.5 ? '½' : String(t)}</text
						>
					{/each}
					{#each panel.bars as b (b.m)}
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
							class={['small', 'mid', b.size < 0.0005 ? 'dim' : 'strong-ish']}
							{x}
							y={f1(BASE - SPAN * b.size - 5 * ub)}>{fixed(b.size)}</text
						>
						<text class="small dim mid" {x} y={BASE + 15 * ub}
							>{b.m === 0 ? '0' : b.m > 0 ? `+${b.m}` : `−${-b.m}`}</text
						>
						<circle class="dial" cx={x} cy={DIAL_Y} r={DIAL_R} />
						<line
							class="dial-zero"
							x1={x + DIAL_R - 3}
							x2={x + DIAL_R + 2}
							y1={DIAL_Y}
							y2={DIAL_Y}
						/>
						{#if b.phase !== undefined}
							<line
								class="hand"
								x1={x}
								y1={DIAL_Y}
								x2={f1(x + (DIAL_R - 2.5) * Math.cos(b.phase))}
								y2={f1(DIAL_Y - (DIAL_R - 2.5) * Math.sin(b.phase))}
							/>
							<circle class="hub" cx={x} cy={DIAL_Y} r="1.7" />
						{/if}
					{/each}
					<text class="small dim end" x={X0 - 5} y={BASE + 15 * ub}
						><tspan class="it">m</tspan></text
					>
					<text class="small dim end" x={X0 - 5} y={DIAL_Y + 4 * ub}>phase</text>
				</svg>
			{/each}
			<p class="bars-key">
				Each bar is <Tex math={'|c_m|\\sqrt{\\langle T_m|T_m\\rangle}/|\\mathcal W|'} /> about the axis,
				so the squares add to one; a dial’s hand is the phase of <Tex math="c_m" />,
				counterclockwise from the right.
			</p>
		</div>
	</div>

	<dl class="readouts">
		<div class="row">
			<dt>Rank of <Tex math="\mathcal W" /></dt>
			<dd>
				<span class="eq"><Tex math={`${rank}`} /></span>
				<span class="also">singular values {svWords}</span>
			</dd>
		</div>
		<div class="row">
			<dt>The invariants</dt>
			<dd>
				<span class="eq"
					><Tex
						math={`\\mathrm{tr}\\,\\mathcal W^2/|\\mathcal W|^2 = ${complexTex(inv.I)}`}
					/></span
				>
				<span class="eq"
					><Tex
						math={`\\mathrm{tr}\\,\\mathcal W^3/|\\mathcal W|^3 = ${complexTex(inv.J)}`}
					/></span
				>
			</dd>
		</div>
		<div class="row">
			<dt>The direction read back</dt>
			<dd>
				<span class="eq"
					><Tex
						math={back
							? `-\\mathbf P/|\\mathcal E|^2 = ${vecTex(back.n)}`
							: '-\\mathbf P/|\\mathcal E|^2\\ \\text{undefined}'}
					/></span
				>
				<span class="also">
					{#if !back}
						no tide at <Tex math="t = 0" />
					{:else if onSource}
						length 1, on <Tex math="-\hat k" />, the source
					{:else if mode === 'one'}
						length {fixed(back.length)}
					{:else}
						length {fixed(back.length)}, {degrees(fromSources[0])} from <Tex math="-\hat k_1" /> and
						{degrees(fromSources[1])} from <Tex math="-\hat k_2" />
					{/if}
				</span>
			</dd>
		</div>
		{#if mode === 'one'}
			<div class="row">
				<dt>From the axis to <Tex math="\hat k" /></dt>
				<dd>
					<span class="eq"><Tex math={`${degrees(tilt).replace('°', '^\\circ')}`} /></span>
					<span class="also">the axis at {placeWords(axis)}</span>
				</dd>
			</div>
		{:else}
			<div class="row">
				<dt>The two waves</dt>
				<dd>
					<span class="eq"
						><Tex math={`\\vartheta = ${degrees(apartAngle).replace('°', '^\\circ')}`} /></span
					>
					<span class="also">between <Tex math="\hat k_1" /> and <Tex math="\hat k_2" /></span>
				</dd>
			</div>
			<div class="row full">
				<dt>Their overlaps, gravity’s and light’s</dt>
				<dd>
					<span class="eq"
						><Tex
							math={`|\\langle\\boldsymbol m_1\\boldsymbol m_1^{\\mathsf T}|\\boldsymbol m_2\\boldsymbol m_2^{\\mathsf T}\\rangle|^2 = ${fixed(overlapOf.gravity, 3)}`}
						/></span
					>
					<span class="eq"
						><Tex
							math={`|\\boldsymbol m_1^*\\cdot\\boldsymbol m_2|^2 = ${fixed(overlapOf.light, 3)}`}
						/></span
					>
					<span class="also"
						>which are <Tex math="\cos^8(\vartheta/2)" /> and <Tex
							math="\cos^4(\vartheta/2)"
						/></span
					>
				</dd>
			</div>
		{/if}
	</dl>

	<div class="bar-controls">
		<div class="groups">
			<div class="slot">
				<Segmented
					label="Waves"
					options={[
						{ value: 'one', label: 'One wave', icon: WaveIcon },
						{ value: 'two', label: 'Two waves', icon: WavesIcon }
					]}
					bind:value={() => mode, setMode}
				/>
			</div>
			<div class="slot">
				<Segmented
					label="Helicity of the ring (H)"
					options={[
						{ value: 'plus', label: '+2', icon: RotateLeft01Icon },
						{ value: 'minus', label: '−2', icon: RotateRight01Icon },
						{ value: 'linear', label: 'Linear', icon: ArrowDataTransferHorizontalIcon }
					]}
					bind:value={() => helicity, (h: Helicity) => (helicity = h)}
				/>
			</div>
			<div class="slot wide">
				<Slider
					id="{uid}-tilt"
					label={mode === 'two' ? 'Angle between the waves' : 'Tilt from the axis'}
					icon={AngleIcon}
					min={0}
					max={180}
					step={1}
					bind:value={() => sliderValue, setSlider}
					readout={degrees(sliderValue)}
					marks={[
						{ at: 0, label: mode === 'two' ? 'together' : 'along the axis' },
						{ at: 60, label: '60°' },
						{ at: 90, label: '90°' },
						{ at: 180, label: 'opposite' }
					]}
					marksHint="the ticks mark 0°, 60°, 90° and 180°"
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
					Pause the ring
				{:else}
					<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
					Play the ring
				{/if}
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				Back to the opening
			</button>
			<p class="hint">
				Drag a dot over the sky; carried out past the rim and back in, it comes onto the far side. A
				press on the open sky brings the wave there. With the keys, Tab reaches the wave{mode ===
				'two'
					? 's'
					: ''} and then the axis; the arrows move the one reached by {KEY_STEP}°, Shift by {KEY_LARGE}°,
				and H changes the helicity. A dragged wave comes to rest on the axis or opposite it within {SNAP}°.
			</p>
		</div>
	</div>

	<div class="notes">
		<p class="sr-only" aria-live="polite">{summary}</p>
		<ul class="legend" aria-hidden="true">
			<li><span class="wave-key"></span>the direction of travel <Tex math="\hat k" /></li>
			<li><span class="axis-key"></span>the axis of the weights</li>
			<li>
				<span class="read-key"></span>read back, <Tex math="-\mathbf P/|\mathcal E|^2" />
			</li>
			<li><span class="swatch stretch"></span>stretch</li>
			<li><span class="swatch squeeze"></span>squeeze</li>
		</ul>
		<p class="note">
			The bars, dials and readouts are the reading at <Tex math="t = 0" />, <Tex
				math={'\\mathcal W = \\boldsymbol m\\boldsymbol m^{\\mathsf T}'}
			/> for each wave, with <Tex
				math="\boldsymbol m = (\boldsymbol e_1 + i\boldsymbol e_2)/\sqrt2"
			/>
			and the chapter’s axes <Tex math="\boldsymbol e_1" /> toward larger <Tex math="\vartheta" /> and
			<Tex math="\boldsymbol e_2" /> toward larger <Tex math="\varphi" />, so the phases follow that
			choice; two waves are added with equal strength, in phase at <Tex math="t = 0" />. The ring’s
			tide is <Tex
				math={'\\mathrm{Re}[(\\alpha^+e^{-i\\omega t} + \\alpha^-e^{i\\omega t})\\,\\boldsymbol m\\boldsymbol m^{\\mathsf T}]'}
			/> with <Tex math="\alpha^+ = 1" /> for +2, <Tex math="\alpha^- = 1" /> for −2 and
			<Tex math="\alpha^+ = \alpha^- = \tfrac12" /> for a linear wave, so an instant’s reading is the
			same for all three: only the turning tells them apart. Each arrow is a ball’s acceleration
			<Tex math="-\mathcal E\boldsymbol x" />, and the ring is drawn bent along it, as chapter 1.4’s
			ring is, enlarged; a positive entry of the tide squeezes. In a steady wave the balls’ own
			oscillation, <Tex math="\tfrac12 h\boldsymbol x" />, points the other way at every instant.
		</p>
	</div>
</div>

<style>
	.square-of-vector {
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
		grid-template-columns: minmax(0, 360px) minmax(0, 290px);
		justify-content: center;
		gap: 0.5rem 1.2rem;
		padding: 0.7rem 0.9rem 0.6rem;
		background: radial-gradient(circle at 30% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.left,
	.right {
		display: grid;
		align-content: start;
		gap: 0.4rem;
		min-width: 0;
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.sky {
		max-width: 360px;
	}

	.panel {
		margin: 0;
		min-width: 0;
	}

	.panel figcaption {
		font: 500 0.72rem/1.3 var(--font-sans);
		color: var(--text-dim);
		margin-bottom: 0.15rem;
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

	.label.dim,
	.dim {
		fill: var(--text-faint);
	}

	.hat {
		font-family: KaTeX_Main, var(--font-serif);
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

	.bold-v {
		font-family: KaTeX_Main, var(--font-serif);
		font-weight: 700;
	}

	tspan.sub {
		font-size: 0.75em;
		font-style: normal;
		font-family: var(--font-sans);
		font-weight: 400;
	}

	.halo,
	.halo-group text {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* the sky: an ink rim, faint circles of latitude and meridians */
	.disc {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		pointer-events: none;
	}

	.lat {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 14%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		pointer-events: none;
	}

	.arc {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.arc.back {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
	}

	.wave-dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
		pointer-events: none;
	}

	.axis-dot {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		pointer-events: none;
	}

	.read {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2px * var(--u, 1));
		pointer-events: none;
	}

	.read.behind {
		opacity: 0.45;
	}

	/* the handles: a ring when reached by the keys */
	.handle {
		pointer-events: none;
	}

	.handle:focus {
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

	.sky.dragging .surface {
		cursor: grabbing;
	}

	/* the inset */
	.inset-axis {
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.plane {
		fill: color-mix(in srgb, var(--text) 5%, transparent);
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.shaft {
		stroke-linecap: round;
	}

	.shaft.k {
		stroke: var(--text);
		stroke-width: calc(2px * var(--u, 1));
	}

	.shaft.e {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.tip.k {
		fill: var(--text);
	}

	.tip.e {
		fill: color-mix(in srgb, var(--text) 60%, transparent);
	}

	.hub {
		fill: var(--text);
	}

	/* the ring: its balls in ink, the arrows orange for a stretch and blue for a squeeze */
	.ring-axis {
		stroke: color-mix(in srgb, var(--text) 24%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.principal {
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.5;
	}

	.principal.stretch {
		stroke: var(--accent);
	}

	.principal.squeeze {
		stroke: var(--accent-2);
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 34%, transparent);
		stroke-width: calc(0.9px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ball-shaft {
		fill: none;
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linecap: round;
	}

	.ball-shaft.stretch {
		stroke: var(--accent);
	}

	.ball-shaft.squeeze {
		stroke: var(--accent-2);
	}

	.ball-shaft.still {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.ball-head.stretch {
		fill: var(--accent);
	}

	.ball-head.squeeze {
		fill: var(--accent-2);
	}

	.ball-head.still {
		fill: color-mix(in srgb, var(--text) 45%, transparent);
	}

	.ball {
		fill: color-mix(in srgb, var(--text) 80%, var(--bg));
		stroke: var(--bg-sunken);
		stroke-width: calc(0.6px * var(--u, 1));
	}

	.toward {
		fill: var(--bg);
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the bars: thin ink outlines over ink at 30%, as in the chapter's diagrams */
	.axis-line {
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.bar {
		fill: color-mix(in srgb, var(--text) 30%, transparent);
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
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
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linecap: round;
	}

	.bars-key {
		margin: 0;
		font-size: 0.72rem;
		line-height: 1.4;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	/* --- the readouts ------------------------------------------------------------------------- */

	.readouts {
		margin: 0;
		padding: 0.7rem 0.9rem 0.75rem;
		border-top: 1px solid var(--line);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.2rem;
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.row {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.row.full {
		grid-column: 1 / -1;
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
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.1rem;
		align-items: center;
	}

	.slot {
		min-width: 0;
	}

	.slot.wide {
		grid-column: 1 / -1;
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

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0 0 0.5rem;
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

	.wave-key,
	.axis-key,
	.read-key {
		flex: none;
		border-radius: 50%;
	}

	.wave-key {
		width: 0.6rem;
		height: 0.6rem;
		background: var(--text);
	}

	.axis-key {
		width: 0.8rem;
		height: 0.8rem;
		border: 1.6px solid var(--text);
	}

	.read-key {
		width: 0.95rem;
		height: 0.95rem;
		border: 1.3px dashed var(--text);
	}

	.swatch {
		flex: none;
		width: 0.9rem;
		height: 2px;
		border-radius: 1px;
	}

	.swatch.stretch {
		background: var(--accent);
	}

	.swatch.squeeze {
		background: var(--accent-2);
	}

	.note {
		margin: 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	/* on a phone the bars sit under the sky */
	@container (max-width: 640px) {
		.stage {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.left,
		.right {
			width: 100%;
			max-width: 420px;
		}

		svg.sky {
			margin: 0 auto;
		}

		.readouts,
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
