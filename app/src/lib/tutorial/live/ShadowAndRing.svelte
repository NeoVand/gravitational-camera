<script lang="ts">
	/**
	 * Chapter 11.1's shadow and ring. Panel 1: the plane of the orbit, to scale, with the horizon, the photon sphere
	 * dashed, and a fan of exact rays traced back from a camera at rest at r, impact parameters 0.5 b_c to 3 b_c, those
	 * inside b_c ending on the horizon; the rays of the Einstein ring, which swing through 180° from the point straight
	 * behind the hole, dashed. Panel 2: the camera's sky as a disc of directions in Lambert's azimuthal equal-area
	 * projection about the hole, the shadow filled, the exact ring dashed and the weak-field ring √(2r_s/d) dotted, and
	 * the sky's warming T_seen/T as a neutral grey, brighter where warmer, on a scale of powers of ten. One slider sets
	 * r from 2.05 to 200 GM/c², logarithmic, opening at 40; one switch puts the camera at rest or falling from far away,
	 * whose sky is moved by chapter 6.3's aberration. The readouts give α_h, the ring exact and weak-field side by side,
	 * 1/√(1 − r_s/r), the hovering acceleration in c⁴/GM and the falling speed. The rays are integrated in
	 * ./shadow-and-ring.ts, which builds on app/src/lib/vistas/lens.ts. The chapter's try box asks the predictions, so
	 * the figure answers none of them in words. Nothing moves by itself, so reduced motion changes nothing.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { GravityIcon, Rocket01Icon, RulerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { numberTex } from './planck-spectrum';
	import {
		DISTANCE,
		HORIZON,
		LOG_DISTANCE,
		OPENING,
		PHOTON_SPHERE,
		TONE,
		TONE_TICKS,
		camera,
		clampDistance,
		degrees,
		distanceFromLog,
		distanceText,
		factorText,
		fan,
		lambert,
		planeWindow,
		rayFrom,
		scaleBar,
		skyColour,
		tone,
		warming,
		type Motion
	} from './shadow-and-ring';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let r = $state(OPENING.r);
	let motion = $state<Motion>(OPENING.motion);

	function setLog(v: number) {
		r = distanceFromLog(v);
	}

	/** The arrow keys step a hundredth of a power of ten in r, Page Up and Page Down a tenth, Home and End to its ends. */
	function sliderKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const d = {
			ArrowRight: DISTANCE.key,
			ArrowUp: DISTANCE.key,
			ArrowLeft: -DISTANCE.key,
			ArrowDown: -DISTANCE.key,
			PageUp: DISTANCE.page,
			PageDown: -DISTANCE.page
		}[e.key];
		if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			r = e.key === 'Home' ? DISTANCE.min : DISTANCE.max;
			return;
		}
		if (d === undefined) return;
		e.preventDefault();
		r = clampDistance(10 ** (Math.log10(r) + d));
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const c = $derived(camera(r, motion));
	const falling = $derived(motion === 'falling');

	const M = '\\htmlClass{q-matter}{M}';
	const V = '\\htmlClass{q-obs}{v}';
	const unit = `\\,G${M}/c^2`;
	const SIN_PSI = '\\sin\\psi = (b/r)\\sqrt{1 - r_s/r}';

	const shadowTex = $derived([`\\alpha_h = ${degrees(c.shadow)}^\\circ`]);
	const shadowFallingTex = $derived([`\\alpha_h' = ${degrees(c.shadowFalling)}^\\circ`]);
	const ringTex = $derived([`\\psi = ${degrees(c.ring)}^\\circ`]);
	const weakTex = $derived([`\\sqrt{2r_s/d} = ${degrees(c.weak)}^\\circ`]);
	const warmTex = $derived([`1/\\sqrt{1 - r_s/r}`, `= ${factorText(c.blueshift)}`]);
	const hoverTex = $derived([
		`a = \\dfrac{G${M}/r^2}{\\sqrt{1 - r_s/r}}`,
		`= ${numberTex(c.hovering, 3)}\\,c^4/G${M}`
	]);
	const fallTex = $derived([`${V} = \\sqrt{2G${M}/r}`, `= ${c.beta.toFixed(3)}\\,c`]);

	// --- the plane --------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const plane = $derived(phone.current ? { W: 360, H: 260 } : { W: 400, H: 300 });
	/** Drawing units in one CSS pixel, in each panel. */
	let u = $state(1);
	let v = $state(1);
	const f1 = (n: number) => n.toFixed(1);

	const win = $derived(planeWindow(r, plane.H / plane.W));
	const s = $derived(plane.W / win.span);
	const X = (x: number) => (x - win.xMin) * s;
	const Y = (y: number) => plane.H / 2 - y * s;
	/** Rays are followed out to a little beyond the farthest corner of the window. */
	const rOut = $derived(
		1.05 * Math.hypot(Math.max(-win.xMin, win.xMax), Math.max(-win.yMin, win.yMax))
	);

	const path = (pts: [number, number][], flip: number) =>
		pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f1(X(x))},${f1(Y(flip * y))}`).join('');

	const rays = $derived(
		fan(r, rOut).map((ray) => ({
			...ray,
			d: [path(ray.points, 1), path(ray.points, -1)]
		}))
	);
	const ringPaths = $derived.by(() => {
		const pts = rayFrom(r, c.ring, { step: 0.01, rOut, keep: true }).points;
		return [path(pts, 1), path(pts, -1)];
	});

	const bar = $derived.by(() => {
		const len = scaleBar(win.span);
		const x0 = 14 * u;
		return { len, x0, x1: x0 + len * s, y: plane.H - 14 * u };
	});
	const cam = $derived({ x: X(r), y: Y(0) });
	/**
	 * Every ray reaches the camera from the side of the hole, so the space to its right is clear: the camera's name
	 * goes there, just above the axis and outside the photon sphere, when there is room; otherwise below the camera,
	 * where the fan is narrow.
	 */
	const room = $derived(plane.W - X(Math.max(r, PHOTON_SPHERE)));
	const camLabel = $derived(
		room > 52 * u
			? { x: X(Math.max(r, PHOTON_SPHERE)) + 8 * u, y: cam.y - 7 * u, anchor: 'start' }
			: { x: cam.x, y: cam.y + 20 * u, anchor: 'middle' }
	);
	/** When falling, the camera's motion toward the hole: an arrow along the axis on its clear side, ending at it. */
	const fallArrow = $derived.by(() => {
		const x1 = cam.x + 6 * u;
		const len = Math.min(22 * u, plane.W - x1 - 3 * u);
		const x0 = x1 + len;
		const y = cam.y;
		return {
			show: len > 10 * u,
			shaft: `M${f1(x0)},${f1(y)}H${f1(x1 + 4 * u)}`,
			head: `M${f1(x1)},${f1(y)}L${f1(x1 + 6 * u)},${f1(y - 3 * u)}L${f1(x1 + 6 * u)},${f1(y + 3 * u)}Z`
		};
	});

	const inCount = $derived(rays.filter((ray) => ray.fate === 'horizon').length);

	// --- the sky ----------------------------------------------------------------------------------------------------
	const sky = $derived(
		phone.current
			? { W: 360, H: 300, R: 136, cx: 150, cy: 150, bar: 316 }
			: { W: 310, H: 300, R: 128, cx: 134, cy: 150, bar: 274 }
	);
	const ring = (psi: number) => sky.R * lambert(psi);

	/** The warming along the radius of the disc, as stops of a radial gradient: uniform at rest. */
	const STOPS = 48;
	const skyStops = $derived(
		Array.from({ length: STOPS + 1 }, (_, k) => {
			const rho = k / STOPS;
			return { offset: rho, fill: skyColour(warming(2 * Math.asin(rho), r, motion)) };
		})
	);
	const restFill = $derived(skyColour(c.blueshift));

	const GRATICULE = [45, 90, 135];

	/** The colour bar, on a scale of powers of ten from 1/2 at the bottom to 100 at the top. */
	const tones = $derived.by(() => {
		const top = sky.cy - 0.78 * sky.R;
		const bottom = sky.cy + 0.78 * sky.R;
		const y = (f: number) => bottom - tone(f) * (bottom - top);
		return {
			top,
			bottom,
			ticks: TONE_TICKS.map((t) => ({ ...t, y: y(t.at) })),
			low: y(c.coolest),
			high: y(c.warmest)
		};
	});
	const BAR_STOPS = Array.from({ length: 17 }, (_, k) => {
		// from the top, 100, down to 1/2: a gradient's stops go in order of their offsets
		const t = k / 16;
		return { offset: t, fill: skyColour(TONE.high * (TONE.low / TONE.high) ** t) };
	});

	/** The direction of the hole, a cross kept inside the shadow, and left out where the shadow is too small for it. */
	const cross = $derived.by(() => {
		const a = Math.min(5 * v, 0.6 * ring(c.shadowSeen));
		if (a < 2.5 * v) return undefined;
		return `M${f1(sky.cx - a)},${sky.cy}h${f1(2 * a)}M${sky.cx},${f1(sky.cy - a)}v${f1(2 * a)}`;
	});

	// --- the words for screen readers ---------------------------------------------------------------------------------
	const planeDescription = $derived(
		`The plane of the orbit, to scale, with the camera ${distanceText(r)} GM/c² from the hole: the horizon, a disc of radius 2 GM/c², and the photon sphere, dashed, at 3 GM/c². ` +
			`${rays.length} rays above the axis and their mirror images below, traced back from the camera, have impact parameters from 0.5 to 3 times b_c; ${inCount} of them end on the horizon and ${rays.length - inCount} pass the hole and leave for far away. ` +
			`The dashed rays come from the point straight behind the hole and swing through 180 degrees.`
	);
	const skyDescription = $derived(
		`The sky of the camera ${falling ? 'falling from far away' : 'at rest'}, on a disc with the direction of the hole at the centre and the direction straight away from it on the rim, equal areas of sky on equal areas of disc. ` +
			`The shadow, filled black, has an angular radius of ${degrees(c.shadowSeen)} degrees; the exact ring, dashed, ${degrees(c.ringSeen)} degrees, and the weak-field ring, dotted, ${degrees(c.weakSeen)} degrees. ` +
			(falling
				? `The sky outside the shadow is grey, brighter where warmer: ${factorText(c.warmest)} times its temperature far away at the shadow's edge and ${factorText(c.coolest)} times straight away from the hole.`
				: `The sky outside the shadow is one even grey, ${factorText(c.blueshift)} times as warm as far away.`)
	);

	const MOTIONS: { value: Motion; label: string; icon: typeof GravityIcon }[] = [
		{ value: 'rest', label: 'At rest', icon: Rocket01Icon },
		{ value: 'falling', label: 'Falling from far away', icon: GravityIcon }
	];
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

{#snippet gm()}<tspan class="it">GM</tspan>/<tspan class="it">c</tspan>²{/snippet}

<div class="shadow-and-ring">
	<div class="panels">
		<section class="panel" aria-label="The plane of the orbit">
			<div class="stage">
				<p class="heading">The plane of the orbit, to scale</p>
				<svg
					viewBox="0 0 {plane.W} {plane.H}"
					role="img"
					aria-label={planeDescription}
					{@attach fitText((value) => (u = value))}
				>
					<defs>
						<clipPath id="{uid}-plane">
							<rect width={plane.W} height={plane.H} />
						</clipPath>
					</defs>
					<rect class="frame" width={plane.W} height={plane.H} rx={6 * u} />

					<g clip-path="url(#{uid}-plane)">
						<line class="axis" x1="0" x2={plane.W} y1={Y(0)} y2={Y(0)} />
						{#each rays as ray (ray.k)}
							{#each ray.d as d, i (i)}
								<path class={ray.fate === 'horizon' ? 'ray-in' : 'ray'} {d} />
							{/each}
						{/each}
						{#each ringPaths as d, i (i)}
							<path class="ring-ray" {d} />
						{/each}
						<circle class="sphere" cx={X(0)} cy={Y(0)} r={PHOTON_SPHERE * s} />
						<circle class="hole" cx={X(0)} cy={Y(0)} r={HORIZON * s} />
					</g>

					<!-- the camera, and when it falls, its motion toward the hole -->
					{#if falling && fallArrow.show}
						<path class="fall-shaft" d={fallArrow.shaft} />
						<path class="fall-head" d={fallArrow.head} />
					{/if}
					<circle class="camera" cx={cam.x} cy={cam.y} r={3.6 * u} />
					<text
						class="small words"
						x={camLabel.x}
						y={camLabel.y}
						style:text-anchor={camLabel.anchor}>camera</text
					>

					<!-- the scale -->
					<path
						class="scale"
						d="M{f1(bar.x0)},{f1(bar.y - 3 * u)}V{f1(bar.y)}H{f1(bar.x1)}V{f1(bar.y - 3 * u)}"
					/>
					<text class="small words" x={bar.x1 + 6 * u} y={bar.y + 1 * u}
						>{bar.len}&#8202;{@render gm()}</text
					>
				</svg>

				<ul class="legend" aria-hidden="true">
					<li><span class="swatch hole-key"></span>the horizon, <Tex math="r_s" /></li>
					<li>
						<span class="swatch sphere-key"></span>the photon sphere, <Tex math="\tfrac32 r_s" />
					</li>
					<li><span class="swatch ray-key"></span>rays from far away</li>
					<li><span class="swatch ray-in-key"></span>from the horizon: no light</li>
					<li><span class="swatch ring-key"></span>the ring’s rays</li>
				</ul>
			</div>
		</section>

		<section class="panel" aria-label="The camera’s sky">
			<div class="stage">
				<p class="heading">The camera’s sky, {falling ? 'falling' : 'at rest'}</p>
				<svg
					viewBox="0 0 {sky.W} {sky.H}"
					role="img"
					aria-label={skyDescription}
					{@attach fitText((value) => (v = value))}
				>
					<defs>
						<radialGradient
							id="{uid}-sky"
							gradientUnits="userSpaceOnUse"
							cx={sky.cx}
							cy={sky.cy}
							r={sky.R}
						>
							{#each skyStops as stop (stop.offset)}
								<stop offset={stop.offset} style:stop-color={stop.fill} />
							{/each}
						</radialGradient>
						<linearGradient id="{uid}-bar" x1="0" x2="0" y1="0" y2="1">
							{#each BAR_STOPS as stop (stop.offset)}
								<stop offset={stop.offset} style:stop-color={stop.fill} />
							{/each}
						</linearGradient>
					</defs>

					<circle
						class="disc"
						cx={sky.cx}
						cy={sky.cy}
						r={sky.R}
						fill={falling ? `url(#${uid}-sky)` : restFill}
					/>
					{#each GRATICULE as g (g)}
						<circle class="graticule" cx={sky.cx} cy={sky.cy} r={ring((g * Math.PI) / 180)} />
					{/each}
					<circle class="shadow" cx={sky.cx} cy={sky.cy} r={ring(c.shadowSeen)} />
					{#if Number.isFinite(c.weakSeen)}
						<circle class="weak-edge" cx={sky.cx} cy={sky.cy} r={ring(c.weakSeen)} />
						<circle class="weak" cx={sky.cx} cy={sky.cy} r={ring(c.weakSeen)} />
					{/if}
					<circle class="ring-edge" cx={sky.cx} cy={sky.cy} r={ring(c.ringSeen)} />
					<circle class="ring" cx={sky.cx} cy={sky.cy} r={ring(c.ringSeen)} />
					{#if cross}<path class="cross" d={cross} />{/if}

					<!-- the colour bar, with the warmings this sky holds bracketed beside it -->
					<text class="label mid" x={sky.bar + 4.5 * v} y={tones.top - 12 * v}
						><tspan class="it">T</tspan><tspan class="sub" dy={2.5 * v}>seen</tspan><tspan
							dy={-2.5 * v}>/</tspan
						><tspan class="it">T</tspan></text
					>
					<rect
						class="bar"
						x={sky.bar}
						y={tones.top}
						width={9 * v}
						height={tones.bottom - tones.top}
						fill="url(#{uid}-bar)"
					/>
					{#each tones.ticks as t (t.text)}
						<path class="bar-tick" d="M{sky.bar + 9 * v},{f1(t.y)}h{3.5 * v}" />
						<text class="fine dim start" x={sky.bar + 15 * v} y={f1(t.y + 3.5 * v)}>{t.text}</text>
					{/each}
					{#if falling}
						<path
							class="bracket"
							d="M{f1(sky.bar - 3 * v)},{f1(tones.high)}h{-3 * v}V{f1(tones.low)}h{3 * v}"
						/>
					{:else}
						<path
							class="pointer"
							d="M{f1(sky.bar - 1.5 * v)},{f1(tones.high)}l{-5 * v},{-3.5 * v}v{7 * v}Z"
						/>
					{/if}
				</svg>

				<ul class="legend" aria-hidden="true">
					<li>
						<span class="swatch cross-key">+</span>the hole at the centre, straight away on the rim
					</li>
					<li><span class="swatch shadow-key"></span>the shadow</li>
					<li><span class="swatch ring-key"></span>the ring, exact</li>
					<li><span class="swatch weak-key"></span>weak field</li>
					<li><span class="swatch graticule-key"></span>45°, 90°, 135° from the hole</li>
				</ul>
			</div>
		</section>
	</div>

	<div class="bar-controls">
		<div class="slot" onkeydowncapture={sliderKeys} role="presentation">
			<Slider
				id="{uid}-distance"
				label="The camera’s distance"
				icon={RulerIcon}
				min={LOG_DISTANCE.low}
				max={LOG_DISTANCE.high}
				step={DISTANCE.step}
				bind:value={() => Math.log10(r), setLog}
				readout="r = {distanceText(r)} GM/c²"
				ends={['2.05 GM/c²', '200 GM/c²']}
				marks={[{ at: Math.log10(40), label: '40 GM/c², the camera of the paper’s black hole' }]}
				marksHint="the tick marks the paper’s camera, 40 GM/c²"
			/>
		</div>
		<Segmented label="The camera" options={MOTIONS} bind:value={motion} />
		<p class="hint">
			Drag the camera’s distance, and put the camera at rest or falling. With the keyboard, reach
			each with Tab: on the slider the arrow keys step a hundredth of a power of ten in <Tex
				math="r"
			/>, Page Up and Page Down a tenth, and Home and End go to its ends.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The shadow</dt>
				<dd>
					{@render eq(shadowTex)}<span class="also">at rest</span>
					{@render eq(shadowFallingTex)}<span class="also"
						>falling, by chapter 6.3’s aberration</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The ring</dt>
				<dd>
					{@render eq(ringTex)}<span class="also">exact</span>
					{@render eq(weakTex)}<span class="also"
						>weak field{#if falling}; falling, the exact ring is seen at <Tex
								math={`\\psi' = ${degrees(c.ringFalling)}^\\circ`}
							/>{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The sky at rest</dt>
				<dd>
					{@render eq(warmTex)}<span class="also"
						>{#if falling}falling, from <Tex math={factorText(c.coolest)} /> straight away from the hole
							to <Tex math={factorText(c.warmest)} /> at the shadow’s edge{:else}the whole sky
							outside the shadow, as warm as that{/if}</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Hovering</dt>
				<dd>{@render eq(hoverTex)}</dd>
			</div>
			<div class="row">
				<dt>Falling from far away</dt>
				<dd>
					{@render eq(fallTex)}<span class="also"
						>as a camera at rest at <Tex math="r" /> measures it</span
					>
				</dd>
			</div>
		</dl>
	</div>

	<p class="note">
		Lengths are in <Tex math={unit} trust />, so that <Tex math={`r_s = 2${unit}`} trust /> and <Tex
			math={`b_c = \\sqrt{27}${unit}`}
			trust
		/>; <Tex math="r" /> is the circumference radius. Every ray is exact: the orbit equation
		<Tex math={`d^2u/d\\varphi^2 + u = 3G${M}u^2/c^2`} trust />, with <Tex math="u = 1/r" />, is
		followed from the camera back to the horizon or to far away, and a ray of impact parameter
		<Tex math="b" /> reaches the camera at rest at <Tex math={SIN_PSI} /> from the hole. The fan leaves
		out the rays whose <Tex math="b" /> is too large to reach the camera at all. The exact ring is where
		the sky straight behind the hole is seen, its rays swinging through
		<Tex math="180^\circ" />; the weak-field ring takes <Tex math="d = r" />. The falling camera
		passes <Tex math="r" /> at <Tex math={V} trust /> toward the hole, and sees each direction moved by
		chapter 6.3’s aberration, the weak-field ring with the rest, and each frequency multiplied by <Tex
			math={`1/(1 - ${V}\\cos\\psi'/c)`}
			trust
		/> as well. The sky’s grey runs on a scale of powers of ten; the mark beside its bar shows this sky’s
		warming.
	</p>
</div>

<style>
	.shadow-and-ring {
		/* the sky is drawn as the camera would show it, the same on either ground: inks for its grey */
		--sky-ink: #12100d;
		--sky-pale: #f7f3ec;
		--hole: #050403;
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the panels ----------------------------------------------------------------------- */

	.panels {
		display: grid;
		grid-template-columns: minmax(0, 400fr) minmax(0, 310fr);
	}

	.panel + .panel {
		border-left: 1px solid var(--line);
	}

	.stage {
		height: 100%;
		box-sizing: border-box;
		padding: 0.6rem 0.8rem 0.7rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	.heading {
		margin: 0 0 0.4rem;
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

	.label {
		font-size: calc(11.5px * var(--u, 1));
		font-weight: 500;
		fill: var(--text);
	}

	.mid {
		text-anchor: middle;
	}

	.start {
		text-anchor: start;
	}

	.dim {
		fill: var(--text-faint);
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

	.frame {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* light is neutral: the rays in the ink, faint where they come from the horizon */
	.ray {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 72%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ray-in {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 26%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
	}

	.ring-ray {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.sphere {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2.5px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.hole {
		fill: var(--hole);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	/* the camera is the observer */
	.camera {
		fill: var(--q-obs);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.fall-shaft {
		fill: none;
		stroke: var(--q-obs);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.fall-head {
		fill: var(--q-obs);
	}

	.scale {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* --- the sky ---------------------------------------------------------------------------- */

	.disc {
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.graticule {
		fill: none;
		stroke: color-mix(in srgb, var(--sky-pale) 32%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.shadow {
		fill: var(--hole);
	}

	.ring,
	.ring-edge,
	.weak,
	.weak-edge {
		fill: none;
		stroke-linecap: round;
	}

	.ring {
		stroke: var(--sky-pale);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: butt;
	}

	.ring-edge {
		stroke: color-mix(in srgb, var(--sky-ink) 70%, transparent);
		stroke-width: calc(3.4px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
		stroke-linecap: butt;
	}

	.weak {
		stroke: var(--sky-pale);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.2px * var(--u, 1));
	}

	.weak-edge {
		stroke: color-mix(in srgb, var(--sky-ink) 70%, transparent);
		stroke-width: calc(3.2px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3.2px * var(--u, 1));
	}

	.cross {
		fill: none;
		stroke: var(--sky-pale);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linecap: round;
	}

	.bar {
		stroke: var(--line-strong);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.bar-tick,
	.bracket {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.bracket {
		stroke: var(--text);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.pointer {
		fill: var(--text);
	}

	/* --- the legends ------------------------------------------------------------------------ */

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.9rem;
		margin: 0.45rem 0.1rem 0;
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

	.hole-key,
	.shadow-key {
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--text) 55%, transparent);
		border-radius: 50%;
		background: var(--hole);
	}

	.sphere-key {
		border-top: 1.5px dashed color-mix(in srgb, var(--text) 60%, transparent);
	}

	.ray-key {
		border-color: color-mix(in srgb, var(--text) 72%, transparent);
	}

	.ray-in-key {
		border-color: color-mix(in srgb, var(--text) 26%, transparent);
	}

	.ring-key {
		border-top: 2px dashed var(--text);
	}

	.weak-key {
		border-top: 2px dotted var(--text);
	}

	.graticule-key {
		border-top: 1.5px dotted var(--text-faint);
	}

	.cross-key {
		width: auto;
		height: auto;
		border: 0;
		font-weight: 600;
		color: var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.slot {
		min-width: 0;
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
		grid-template-columns: 9.5rem minmax(0, 1fr);
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
		gap: 0.15rem 0.6rem;
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

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
		margin-right: 0.5rem;
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
		.panels {
			grid-template-columns: minmax(0, 1fr);
		}

		.panel + .panel {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
