<script lang="ts">
	/**
	 * Chapter 1.6's turning pixel: a ring of twelve free balls let go across the axis of a turntable, seen from
	 * outside, where each goes straight on, and from the frame that turns with the table at Ω, where the same balls
	 * drift out from the axis and fall behind: the centrifugal and Coriolis accelerations. A second ring, standing
	 * through the axis, is seen from the side: it widens across the axis and keeps its height along it, the
	 * pseudo-tide −Ω² (δ_ij − Ω̂_i Ω̂_j). The motion is exact (./turning-pixel.ts): each straight line turned back by Ωt.
	 * A toggle sets the person's tide beside the pseudo-tide; a preset sets the Earth's rate.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Clock01Icon,
		EarthIcon,
		PauseIcon,
		PinIcon,
		PlayIcon,
		Rotate360Icon,
		RotateLeft01Icon,
		UserIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { texNumber } from '../../ui/format';
	import {
		EARTH,
		FASTEST,
		PERSON_K,
		UNIT,
		centrifugal,
		coriolis,
		eigenvalues,
		faceOn,
		inertial,
		personTide,
		pseudoTide,
		ring,
		runLength,
		standing,
		turning,
		turningVelocity,
		type Release
	} from './turning-pixel';

	const uid = $props.id();

	/** The rings' radius as drawn, in drawing units. */
	const R = 40;
	/** An acceleration arrow is this many ring radii long per Ω² of acceleration per ring radius. */
	const ARROW = 0.18;
	/** Time units a second of the animation shows, and the pause at the end of a run, s. */
	const SPEED = 1;
	const HOLD = 1.4;

	// --- the settings ---------------------------------------------------------------------------------------------
	/** The rate as a fraction of the fastest, one turn in ten time units: the Earth's. */
	let rate = $state(0.6);
	let release = $state<Release>('turntable');
	let person = $state(false);

	const omega = $derived(rate * FASTEST);
	/** The rate in s⁻¹, a time unit being a tenth of a sidereal day. */
	const omegaSI = $derived(rate * EARTH);
	const end = $derived(runLength(omega));

	function setRate(v: number) {
		rate = Math.round(Math.max(0, Math.min(1, v)) * 20) / 20;
	}

	// --- the time: a fraction of the run, so that a new rate keeps the place in it -------------------------------
	let phase = $state(0);
	let playing = $state(true);
	const t = $derived(phase * end);

	// --- the prediction: answered once a run has reached its end -----------------------------------------------------
	let seenEnd = $state(false);

	function setPhase(v: number) {
		phase = Math.max(0, Math.min(1, v));
		playing = false;
		if (phase >= 0.95 && omega > 0) seenEnd = true;
	}

	function togglePlay() {
		if (!playing && phase >= 1) phase = 0;
		playing = !playing;
	}

	/**
	 * The clock, attached to the picture: it runs while `playing`, a run at a time with a pause between runs. A reader
	 * who asks for less motion is shown, once, the end of a run, still, with its trails.
	 */
	let checked = false;
	const clock: Attachment = () => {
		if (!checked) {
			checked = true;
			if (prefersReducedMotion.current) {
				playing = false;
				phase = 1;
				return;
			}
		}
		if (!playing) return;
		let frame = 0;
		let last: number | undefined;
		let hold = 0;
		const tick = (now: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, (now - last) / 1000);
			last = now;
			if (hold > 0) {
				hold -= dt;
				if (hold <= 0) phase = 0;
			} else {
				phase = Math.min(1, phase + (dt * SPEED) / end);
				if (phase >= 1) {
					hold = HOLD;
					if (omega > 0) seenEnd = true;
				}
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	};

	// --- the picture's layout: three panels in a row; on a phone the side view goes under the other two ------------
	const phone = new MediaQuery('max-width: 560px', false);
	const S = 200;
	const GAP = 12;
	const TITLE = 24;
	type Box = { x: number; y: number; w: number; h: number };
	const boxes = $derived.by(() => {
		const outside: Box = { x: 0, y: TITLE, w: S, h: S };
		const frame: Box = { x: S + GAP, y: TITLE, w: S, h: S };
		const side: Box = phone.current
			? { x: 0, y: TITLE + S + 10 + TITLE, w: 2 * S + GAP, h: 136 }
			: { x: 2 * (S + GAP), y: TITLE, w: S, h: S };
		return { outside, frame, side };
	});
	const width = $derived(phone.current ? 2 * S + GAP : 3 * S + 2 * GAP);
	const height = $derived(boxes.side.y + boxes.side.h + 2);
	const centre = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

	/** Drawing units in one CSS pixel, so that marks keep their size on the screen. */
	let u = $state(1);
	const BALL = $derived(4.4 * u);

	const f2 = (n: number) => n.toFixed(2);
	/** A point of a top view on the screen: x to the right, y up, about the panel's centre. */
	const at = (b: Box, p: { x: number; y: number }) => {
		const c = centre(b);
		return { x: c.x + R * p.x, y: c.y - R * p.y };
	};
	const path = (pts: { x: number; y: number }[], closed = false) =>
		pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)},${f2(p.y)}`).join('') + (closed ? 'Z' : '');

	const flat = ring(12);
	const upright = standing(12);
	const fine = ring(96);
	const fineUpright = standing(96);

	// --- the turntable: its spokes turn from outside, and stand still in its own frame ------------------------------
	const SPOKES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
	const DISC = 2.4;
	function spokes(b: Box, angle: number) {
		return SPOKES.map((a) => {
			const p = at(b, { x: DISC * Math.cos(a + angle), y: DISC * Math.sin(a + angle) });
			return { x1: centre(b).x, y1: centre(b).y, x2: p.x, y2: p.y };
		});
	}
	/** A notch on the table's rim, so that its turning is seen. */
	function notch(b: Box, angle: number) {
		const tip = at(b, { x: (DISC - 0.12) * Math.cos(angle), y: (DISC - 0.12) * Math.sin(angle) });
		const l = at(b, {
			x: DISC * Math.cos(angle + 0.07),
			y: DISC * Math.sin(angle + 0.07)
		});
		const r = at(b, {
			x: DISC * Math.cos(angle - 0.07),
			y: DISC * Math.sin(angle - 0.07)
		});
		return path([tip, l, r], true);
	}

	// --- the balls --------------------------------------------------------------------------------------------------
	const outsideBalls = $derived(flat.map((p) => at(boxes.outside, inertial(p, omega, t, release))));
	const outsideTrails = $derived(
		release === 'turntable'
			? flat.map((p) =>
					path([at(boxes.outside, p), at(boxes.outside, inertial(p, omega, t, release))])
				)
			: []
	);

	const SAMPLES = 48;
	const frameTrails = $derived(
		flat.map((p) =>
			path(
				Array.from({ length: SAMPLES + 1 }, (_, i) =>
					at(boxes.frame, turning(p, omega, (t * i) / SAMPLES, release))
				)
			)
		)
	);

	/** Each ball in the turning frame, with its centrifugal and Coriolis arrows on one scale. */
	const frameBalls = $derived(
		flat.map((p0) => {
			const p = turning(p0, omega, t, release);
			const v = turningVelocity(p0, omega, t, release);
			const s = omega > 0 ? (ARROW * R) / (omega * omega) : 0;
			const out = centrifugal(p, omega);
			const side = coriolis(v, omega);
			const here = at(boxes.frame, p);
			return {
				at: here,
				out: arrow(here, { x: s * out.x, y: -s * out.y }),
				side: arrow(here, { x: s * side.x, y: -s * side.y })
			};
		})
	);

	/** The shaft and head of an arrow from the edge of a ball at `from`, of length and direction `v`: the head at most two fifths of it. */
	function arrow(from: { x: number; y: number }, v: { x: number; y: number }) {
		const len = Math.hypot(v.x, v.y);
		if (len < 2 * u) return undefined;
		const head = Math.min(5 * u, 0.4 * len);
		const ux = v.x / len;
		const uy = v.y / len;
		const start = { x: from.x + ux * (BALL + 1.2 * u), y: from.y + uy * (BALL + 1.2 * u) };
		const tip = { x: start.x + ux * len, y: start.y + uy * len };
		const base = { x: tip.x - ux * head, y: tip.y - uy * head };
		const w = head / 2;
		return {
			shaft: `M${f2(start.x)},${f2(start.y)}L${f2(base.x + ux * 0.5 * u)},${f2(base.y + uy * 0.5 * u)}`,
			head: `M${f2(tip.x)},${f2(tip.y)}L${f2(base.x - uy * w)},${f2(base.y + ux * w)}L${f2(base.x + uy * w)},${f2(base.y - ux * w)}Z`
		};
	}

	// --- the side view: the standing ring face-on, across the axis to the right and along it up -------------------
	const sideAt = (p: { across: number; along: number }) => {
		const c = centre(boxes.side);
		return { x: c.x + R * p.across, y: c.y - R * p.along };
	};
	const sideBalls = $derived(
		upright.map((p0) => ({
			rest: sideAt({ across: p0.x, along: p0.z }),
			now: sideAt(faceOn(p0, omega, t, release))
		}))
	);
	const sideOutline = $derived(
		path(
			fineUpright.map((p) => sideAt(faceOn(p, omega, t, release))),
			true
		)
	);
	const restOutline = path(
		fine.map((p) => ({ x: p.x, y: p.y })).map((p) => ({ x: R * p.x, y: -R * p.y })),
		true
	);
	/** The axis through the side view, upright, and the ring's height marked across it. */
	const sideAxis = $derived.by(() => {
		const c = centre(boxes.side);
		const reach = phone.current ? 1.45 * R : 1.65 * R;
		const wide = phone.current ? 2.6 * R : 2.25 * R;
		return { c, reach, wide };
	});

	// --- the numbers ------------------------------------------------------------------------------------------------
	const OMEGA = '\\htmlClass{q-obs}{\\Omega}';
	const OMEGA_HAT = '\\htmlClass{q-obs}{\\hat\\Omega}';
	const PSEUDO = '\\htmlClass{q-curv}{\\mathcal{E}}^{\\mathrm{pseudo}}';
	const PERSON_E = '\\htmlClass{q-curv}{\\mathcal{E}}';
	const M = '\\htmlClass{q-matter}{M}';

	const pseudo = $derived(pseudoTide(omegaSI));
	const pseudoValues = $derived(eigenvalues(pseudo));
	const mine = personTide();
	const mineValues = eigenvalues(mine);

	/** A tide in units of 10⁻⁹ s⁻², to two decimals, with a minus sign and never −0.00. */
	const nano = (v: number) => {
		const s = (v / 1e-9).toFixed(2);
		return Number(s) === 0 ? '0' : s;
	};
	/** The unit of the eigenvalues as listed. */
	const NANO = '10^{-9}\\,\\mathrm{s^{-2}}';
	const matrix = (d: [number, number, number]) =>
		`\\begin{pmatrix} ${nano(d[0])} & 0 & 0 \\\\ 0 & ${nano(d[1])} & 0 \\\\ 0 & 0 & ${nano(d[2])} \\end{pmatrix}`;

	const pseudoTex = `${PSEUDO} = -${OMEGA}^2\\bigl(\\delta_{ij} - ${OMEGA_HAT}_i${OMEGA_HAT}_j\\bigr)`;
	const pseudoMatrix = $derived(
		`= ${matrix([pseudo[0][0], pseudo[1][1], pseudo[2][2]])}\\times 10^{-9}\\,\\mathrm{s^{-2}}`
	);
	const personTex = `${PERSON_E} = \\dfrac{G${M}}{r^3}\\begin{pmatrix} -2 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}`;
	const personMatrix = `= ${matrix([mine[0][0], mine[1][1], mine[2][2]])}\\times 10^{-9}\\,\\mathrm{s^{-2}}`;
	/** A trace as listed: the sum of the values as they are shown, so that the column adds up. */
	const listedTrace = (v: number[]) => nano(v.reduce((sum, x) => sum + Number(nano(x)) * 1e-9, 0));

	const rateTex = $derived(
		omegaSI === 0 ? `${OMEGA} = 0` : `${OMEGA} = ${texNumber(omegaSI, 3)}\\,\\mathrm{s^{-1}}`
	);
	const turnHours = $derived(rate === 0 ? undefined : (10 * UNIT) / rate / 3600);
	const rateWords = $derived(
		rate === 0
			? 'not turning'
			: `one turn in ${Number((10 / rate).toPrecision(3))} units, ${Number(turnHours!.toPrecision(3))} hours`
	);

	/** The largest value either tide reaches, for the bars: the person's stretch. */
	const BAR = 2 * PERSON_K;
	const bar = (v: number) => {
		const w = Math.min(1, Math.abs(v) / BAR) * 50;
		return {
			left: v < 0 ? 50 - w : 50,
			width: w,
			kind: v < 0 ? 'stretch' : v > 0 ? 'squeeze' : 'still'
		};
	};

	const pseudoRows = $derived([
		{ name: 'Across the axis', value: pseudoValues[0] },
		{ name: 'Across, at right angles', value: pseudoValues[1] },
		{ name: 'Along the axis', value: pseudoValues[2] }
	]);
	const personRows = [
		{ name: 'Toward the person', value: mineValues[0] },
		{ name: 'Across', value: mineValues[1] },
		{ name: 'Across, at right angles', value: mineValues[2] }
	];

	const share = $derived((omegaSI * omegaSI) / (2 * PERSON_K));
	const earthShare = (EARTH * EARTH) / (2 * PERSON_K);

	const timeWords = $derived(
		`t = ${t.toFixed(1)} units, ${(t * UNIT) / 3600 < 10 ? ((t * UNIT) / 3600).toFixed(1) : Math.round((t * UNIT) / 3600)} hours`
	);

	const description = $derived(
		`Three views of twelve free balls ${release === 'turntable' ? 'let go at rest on a turntable' : 'at rest outside a turntable'}, ${rateWords}, at ${timeWords}. ` +
			(release === 'turntable'
				? 'From outside each ball goes straight on; from the turning frame the balls drift out from the axis and fall behind the turning. '
				: 'From outside the balls stay put; from the turning frame the ring wheels round backwards without stretching. ') +
			'From the side, a ring standing through the axis widens across the axis and keeps its height along it.'
	);

	const titles = $derived([
		{ box: boxes.outside, text: 'From outside' },
		{ box: boxes.frame, text: 'From the turning frame' },
		{ box: boxes.side, text: 'From the side' }
	]);
</script>

<div class="turning-pixel">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
		</div>
		<p class="question">From inside the turning frame, does the ring stretch along the axis?</p>
		<p class={['answer', { shown: seenEnd }]} aria-live="polite">
			{#if seenEnd}
				<strong>No.</strong> Across the axis the ring widens, the same in both directions; along the
				axis its height does not change. The pseudo-tide’s eigenvalues are
				<Tex math={`-${OMEGA}^2`} trust />, <Tex math={`-${OMEGA}^2`} trust /> and 0, so its trace is
				<Tex math={`-2${OMEGA}^2`} trust />, while a tide made by mass in empty space adds to zero,
				as the person’s <Tex math="(-2, 1, 1)" /> does. At the Earth’s rate
				<Tex math={`${OMEGA}^2 = ${texNumber(EARTH * EARTH, 2)}\\,\\mathrm{s^{-2}}`} trust />,
				{earthShare.toFixed(2)} of the person’s stretch at a metre.
			{:else}
				The answer appears when a run has played to its end, or when you take the time to its end.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label={description}
			{@attach fitText((value) => (u = value))}
			{@attach clock}
		>
			<defs>
				<radialGradient id="{uid}-ball" cx="0.36" cy="0.32" r="0.75">
					<stop offset="0" class="ball-light" />
					<stop offset="1" class="ball-dark" />
				</radialGradient>
			</defs>

			{#each titles as title (title.text)}
				<text class="title" x={title.box.x + title.box.w / 2} y={title.box.y - 8 * u}
					>{title.text}</text
				>
			{/each}

			<!-- the two top views: the turntable, the ring as let go, the trails and the balls -->
			{#each [{ box: boxes.outside, angle: omega * t }, { box: boxes.frame, angle: 0 }] as view, v (v)}
				{@const c = centre(view.box)}
				<circle class="table" cx={c.x} cy={c.y} r={DISC * R} />
				{#each spokes(view.box, view.angle) as s, i (i)}
					<line class="spoke" x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
				{/each}
				<path class="notch" d={notch(view.box, view.angle + Math.PI / 8)} />
				<path class="rest" d={restOutline} transform="translate({f2(c.x)} {f2(c.y)})" />
			{/each}

			{#each outsideTrails as d, i (i)}
				<path class="trail" {d} />
			{/each}
			{#each frameTrails as d, i (i)}
				<path class="trail" {d} />
			{/each}

			{#each frameBalls as b, i (i)}
				{#if b.side}
					<path class="shaft sideways" d={b.side.shaft} />
					<path class="head sideways" d={b.side.head} />
				{/if}
				{#if b.out}
					<path class="shaft stretch" d={b.out.shaft} />
					<path class="head stretch" d={b.out.head} />
				{/if}
			{/each}

			{#each outsideBalls as b, i (i)}
				<circle class="ball" cx={b.x} cy={b.y} r={BALL} fill="url(#{uid}-ball)" />
			{/each}
			{#each frameBalls as b, i (i)}
				<circle class="ball" cx={b.at.x} cy={b.at.y} r={BALL} fill="url(#{uid}-ball)" />
			{/each}

			<!-- the axis, out of the page, and from outside the way the table turns -->
			{#each [boxes.outside, boxes.frame] as box, v (v)}
				{@const c = centre(box)}
				<circle class="axis-ring" cx={c.x} cy={c.y} r={4.2 * u} />
				<circle class="axis-dot" cx={c.x} cy={c.y} r={1.4 * u} />
				<text class="omega" x={c.x + 6.5 * u} y={c.y + 15 * u}>Ω</text>
				{#if v === 0}
					{@const r = 16 * u}
					<path
						class="sense"
						d="M{f2(c.x + r)},{f2(c.y)}A{f2(r)},{f2(r)} 0 0 0 {f2(c.x)},{f2(c.y - r)}"
					/>
					<path
						class="sense-head"
						d="M{f2(c.x - 3.6 * u)},{f2(c.y - r)}L{f2(c.x + 1 * u)},{f2(c.y - r - 2.8 * u)}L{f2(
							c.x + 1 * u
						)},{f2(c.y - r + 2.8 * u)}Z"
					/>
				{/if}
			{/each}

			<!-- the side view: the axis upright, the ring's height kept, the ring widening across -->
			<rect
				class="side-box"
				x={boxes.side.x + 0.5}
				y={boxes.side.y + 0.5}
				width={boxes.side.w - 1}
				height={boxes.side.h - 1}
				rx="8"
			/>
			{#each [1, -1] as s (s)}
				<line
					class="height"
					x1={sideAxis.c.x - sideAxis.wide}
					x2={sideAxis.c.x + sideAxis.wide}
					y1={sideAxis.c.y - s * R}
					y2={sideAxis.c.y - s * R}
				/>
			{/each}
			<line
				class="axis-line"
				x1={sideAxis.c.x}
				x2={sideAxis.c.x}
				y1={sideAxis.c.y + sideAxis.reach}
				y2={sideAxis.c.y - sideAxis.reach + 4 * u}
			/>
			<path
				class="axis-head"
				d="M{f2(sideAxis.c.x)},{f2(sideAxis.c.y - sideAxis.reach)}L{f2(sideAxis.c.x - 3 * u)},{f2(
					sideAxis.c.y - sideAxis.reach + 6 * u
				)}L{f2(sideAxis.c.x + 3 * u)},{f2(sideAxis.c.y - sideAxis.reach + 6 * u)}Z"
			/>
			<text class="omega" x={sideAxis.c.x + 6 * u} y={sideAxis.c.y - sideAxis.reach + 9 * u}>Ω</text
			>
			<path
				class="rest"
				d={restOutline}
				transform="translate({f2(sideAxis.c.x)} {f2(sideAxis.c.y)})"
			/>
			<path class="bent" d={sideOutline} />
			{#each sideBalls as b, i (i)}
				{#if Math.abs(b.now.x - b.rest.x) > 1.5 * u}
					<line class="trail stretch" x1={b.rest.x} y1={b.rest.y} x2={b.now.x} y2={b.now.y} />
				{/if}
			{/each}
			{#each sideBalls as b, i (i)}
				<circle class="ball" cx={b.now.x} cy={b.now.y} r={BALL} fill="url(#{uid}-ball)" />
			{/each}
		</svg>
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
			<div class="grow">
				<Slider
					id="{uid}-time"
					label="Time"
					icon={Clock01Icon}
					min={0}
					max={1}
					step={0.005}
					bind:value={() => phase, setPhase}
					readout={timeWords}
				/>
			</div>
		</div>
		<div class="rate">
			<div class="grow">
				<Slider
					id="{uid}-rate"
					label="Turning rate"
					icon={Rotate360Icon}
					min={0}
					max={1}
					step={0.05}
					bind:value={() => rate, setRate}
					readout={rate === 0
						? 'not turning'
						: `one turn in ${Number((10 / rate).toPrecision(3))} units`}
					ends={['still', 'the Earth’s']}
				/>
			</div>
		</div>
		<div class="choices">
			<div class="choice">
				<Segmented
					label="How the balls are let go"
					options={[
						{ value: 'turntable', label: 'At rest on the table', icon: RotateLeft01Icon },
						{ value: 'still', label: 'At rest outside', icon: PinIcon }
					]}
					bind:value={release}
				/>
			</div>
			<button type="button" class="preset" aria-pressed={rate === 1} onclick={() => setRate(1)}>
				<HugeiconsIcon icon={EarthIcon} size={16} strokeWidth={1.7} />
				The Earth’s rate
			</button>
			<div class="choice">
				<Toggle icon={UserIcon} label="The person’s tide beside it" bind:checked={person} />
			</div>
		</div>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>Rate</dt>
				<dd><Tex math={rateTex} trust /><span class="also">{rateWords}</span></dd>
			</div>
			<div class="row">
				<dt>Pseudo-tide</dt>
				<dd class="formula"><Tex math={pseudoTex} trust /><Tex math={pseudoMatrix} /></dd>
			</div>
			{#if person}
				<div class="row">
					<dt>The person’s tide</dt>
					<dd class="formula"><Tex math={personTex} trust /><Tex math={personMatrix} /></dd>
				</div>
			{/if}
		</dl>

		<div class={['tides', { both: person }]}>
			<section class="tide" aria-label="The pseudo-tide’s eigenvalues">
				<p class="tide-name">The pseudo-tide<span class="unit"><Tex math={NANO} /></span></p>
				{#each pseudoRows as row, i (i)}
					{@const b = bar(row.value)}
					<div class="value-row">
						<span class="value-name">{row.name}</span>
						<span class="track" aria-hidden="true"
							><span class={['fill', b.kind]} style:left="{b.left}%" style:width="{b.width}%"
							></span></span
						>
						<span class="value"><Tex math={nano(row.value)} /></span>
					</div>
				{/each}
				<div class="value-row sum">
					<span class="value-name">Trace</span>
					<span></span>
					<span class="value"><Tex math={listedTrace(pseudoValues)} /></span>
				</div>
			</section>
			{#if person}
				<section class="tide" aria-label="The person’s tide’s eigenvalues">
					<p class="tide-name">
						The person’s, 70 kg at 1 m<span class="unit"><Tex math={NANO} /></span>
					</p>
					{#each personRows as row, i (i)}
						{@const b = bar(row.value)}
						<div class="value-row">
							<span class="value-name">{row.name}</span>
							<span class="track" aria-hidden="true"
								><span class={['fill', b.kind]} style:left="{b.left}%" style:width="{b.width}%"
								></span></span
							>
							<span class="value"><Tex math={nano(row.value)} /></span>
						</div>
					{/each}
					<div class="value-row sum">
						<span class="value-name">Trace</span>
						<span></span>
						<span class="value"><Tex math="0" /></span>
					</div>
				</section>
			{/if}
		</div>
		{#if person}
			<p class="compare">
				The pseudo-tide’s stretch is <strong>{share.toFixed(2)}</strong> of the person’s:
				<Tex
					math={`${OMEGA}^2 \\big/ (2G${M}/r^3) = ${texNumber(omegaSI * omegaSI, 3)} / ${texNumber(2 * PERSON_K, 3)}`}
					trust
				/>. The person’s three values add to zero; the pseudo-tide’s cannot.
			</p>
		{/if}

		<p class="note">
			{#if release === 'turntable'}
				From outside, each ball goes straight on at the speed the table gave it. The turning frame
				sees the same balls start at rest, drift out from the axis and fall behind the turning.
			{:else}
				From outside the balls stay where they are. The turning frame sees the ring wheel round
				backwards without stretching: the Coriolis acceleration, inward and twice the centrifugal,
				holds each ball on its circle. The pseudo-tide is what balls at rest in the turning frame
				feel.
			{/if}
			<span class="stretch">Orange</span>: the centrifugal acceleration
			<Tex math={`${OMEGA}^2\\mathbf{x}_\\perp`} trust />, straight away from the axis.
			<span class="sideways">Grey</span>: the Coriolis acceleration
			<Tex math={`-2${OMEGA}\\times\\mathbf{v}`} trust />, at right angles to the motion, zero while
			a ball is at rest. The arrows are on one scale, set by <Tex math={`${OMEGA}^2`} trust />.
		</p>
		<p class="note">
			From the side, a second ring stands through the axis and is seen face-on, the view turning
			with it. It widens across the axis and keeps its height along it; its shape is the same from
			either frame. The positions are exact: each ball’s straight line, turned back by
			<Tex math={`${OMEGA}t`} trust />.
		</p>
		<p class="note">
			Time is scaled. One unit is a tenth of a sidereal day, {(UNIT / 3600).toFixed(2)} hours, shown in
			a second; the fastest rate, one turn in ten units, is the Earth’s. A run ends when the balls let
			go on the table have drifted out to twice their distance from the axis. The rings are drawn far
			larger than a pixel.
		</p>
	</div>
</div>

<style>
	.turning-pixel {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the prediction ------------------------------------------------------------------ */

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

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.4rem 0.6rem 0.5rem;
		background: radial-gradient(circle at 50% 50%, var(--bg-raised) 0%, var(--bg-sunken) 78%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
		-webkit-user-select: none;
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		text-anchor: middle;
	}

	.table {
		fill: color-mix(in srgb, var(--text) 4%, transparent);
		stroke: color-mix(in srgb, var(--text) 18%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.spoke {
		stroke: color-mix(in srgb, var(--text) 9%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.notch {
		fill: color-mix(in srgb, var(--q-obs) 75%, transparent);
	}

	.rest {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.trail {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linecap: round;
	}

	.trail.stretch {
		stroke: color-mix(in srgb, var(--accent) 70%, transparent);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.bent {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 62%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.shaft {
		fill: none;
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.shaft.stretch {
		stroke: var(--accent);
	}

	.head.stretch {
		fill: var(--accent);
	}

	.shaft.sideways {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.head.sideways {
		fill: color-mix(in srgb, var(--text) 55%, transparent);
	}

	.ball {
		stroke: color-mix(in srgb, var(--bg-sunken) 80%, transparent);
		stroke-width: calc(0.7px * var(--u, 1));
	}

	.ball-light {
		stop-color: color-mix(in srgb, var(--text) 92%, var(--bg));
	}

	.ball-dark {
		stop-color: color-mix(in srgb, var(--text) 55%, var(--bg));
	}

	.axis-ring {
		fill: var(--bg-raised);
		stroke: var(--q-obs);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.axis-dot,
	.axis-head,
	.sense-head {
		fill: var(--q-obs);
	}

	.sense {
		fill: none;
		stroke: var(--q-obs);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.omega {
		fill: var(--q-obs);
		font: italic 500 calc(14px * var(--u, 1)) / 1 var(--font-serif);
	}

	.side-box {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.height {
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.axis-line {
		stroke: var(--q-obs);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.time,
	.rate {
		display: flex;
		align-items: flex-start;
		gap: 0.7rem;
	}

	.grow {
		flex: 1;
		min-width: 0;
	}

	.choices {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) auto minmax(0, 1fr);
		gap: 0.6rem 1rem;
		align-items: stretch;
	}

	.play,
	.preset {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2rem;
		border: 1px solid var(--line-strong);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		cursor: pointer;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.play {
		flex: none;
		width: 2.2rem;
		height: 2.2rem;
		margin-top: 0.1rem;
		padding: 0;
	}

	.preset {
		min-height: var(--control-height, 2.55rem);
		padding: 0.3rem 0.8rem 0.3rem 0.65rem;
		border-radius: 10px;
		white-space: nowrap;
	}

	.play :global(svg),
	.preset :global(svg) {
		color: var(--accent);
	}

	.preset[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--accent) 55%, transparent);
		background: color-mix(in srgb, var(--accent) 13%, transparent);
	}

	@media (hover: hover) {
		.play:hover,
		.preset:hover {
			border-color: var(--accent);
		}
	}

	.play:focus-visible,
	.preset:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
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
		gap: 0.45rem;
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
		gap: 0.1rem 0.9rem;
		font-variant-numeric: tabular-nums;
	}

	.readouts dd.formula {
		align-items: center;
		gap: 0.2rem 0.4rem;
		padding: 0.1rem 0;
	}

	.also {
		color: var(--text-dim);
	}

	.tides {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 0.6rem 1.4rem;
		margin-top: 0.7rem;
	}

	.tides.both {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.tide {
		padding: 0.55rem 0.7rem 0.6rem;
		border: 1px solid var(--line);
		border-radius: 9px;
		background: var(--well);
	}

	.tide-name {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.1rem 0.8rem;
		margin: 0 0 0.35rem;
		font-weight: 500;
		color: var(--text);
	}

	.unit {
		font-weight: 400;
		color: var(--text-dim);
	}

	.value-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 4.5rem 3rem;
		gap: 0.6rem;
		align-items: center;
		min-height: 1.5rem;
	}

	.tides:not(.both) .value-row {
		grid-template-columns: 11rem minmax(4.5rem, 14rem) 3rem;
	}

	.value-name {
		color: var(--text-dim);
	}

	.value {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.sum {
		margin-top: 0.15rem;
		padding-top: 0.2rem;
		border-top: 1px solid var(--line);
	}

	.sum .value-name {
		font-weight: 500;
		color: var(--text);
	}

	.track {
		position: relative;
		height: 0.42rem;
		border-radius: 3px;
		background: color-mix(in srgb, var(--text) 8%, transparent);
	}

	/* the zero of the bar, at its middle */
	.track::after {
		content: '';
		position: absolute;
		left: 50%;
		top: -0.15rem;
		bottom: -0.15rem;
		width: 1px;
		background: color-mix(in srgb, var(--text) 40%, transparent);
	}

	.fill {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 3px;
	}

	.fill.stretch {
		background: var(--accent);
	}

	.fill.squeeze {
		background: var(--accent-2);
	}

	.compare {
		margin: 0.6rem 0 0;
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.compare strong {
		color: var(--text);
		font-weight: 600;
	}

	.note {
		margin: 0.6rem 0 0;
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	.note .stretch {
		color: var(--accent);
	}

	.note .sideways {
		color: var(--text-dim);
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.bar,
		.choices,
		.tides.both {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.value-row,
		.tides:not(.both) .value-row {
			grid-template-columns: minmax(0, 1fr) 4.5rem 3rem;
			gap: 0.45rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.play,
		.preset {
			transition: none;
		}
	}
</style>
