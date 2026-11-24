<script lang="ts">
	/**
	 * Chapter 6.3's moving sky. The whole sky seen from a camera moving at βc through the sources' frame, on one round
	 * panel in Lambert's equal-area projection centred on the direction of motion: the centre is straight ahead, the
	 * rim straight behind, and a direction at α′ from the motion lies at sin(α′/2) of the radius, so that equal areas
	 * of sky get equal areas of disc. A slider sets the speed from 0 to 0.99c in hundredths. Three skies: "Stars", 400
	 * stars spread evenly at rest, moved by eq:source-angle and coloured by their Doppler factor on the paper's
	 * diverging scale, blue above 1 and red below, with the image of the circle α = 90° dashed; "Thermal glow", a black
	 * body coloured by T(α′)/T, with the circle where it keeps its temperature dotted; and "The Sun at the Earth's
	 * speed", a round window of sky about the Sun seen across the motion, its aberrated image beside it, the shift
	 * drawn a thousand times larger. Everything is computed in ./moving-sky.ts. Two predictions at the top are answered
	 * once the reader has done what they ask. Nothing moves by itself, so reduced motion changes nothing but the
	 * buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { DashboardSpeed02Icon, FireIcon, StarsIcon, Sun03Icon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DEG,
		EARTH,
		FIRST_START,
		MAGNIFY,
		OPENING,
		SPEED,
		STAR_COUNT,
		SUN_RADIUS,
		WINDOW,
		betaOf,
		clamp,
		colour,
		degrees,
		earthBeta,
		motion,
		noteFirst,
		noteSecond,
		placeLabels,
		radiusOf,
		scaleEnd,
		seenStar,
		stars,
		sun,
		temperature,
		three,
		threeTex,
		tone,
		unchanged,
		type FirstSeen,
		type Sky
	} from './moving-sky';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let sky = $state<Sky>(OPENING.sky);
	/** The speed in hundredths of c, on the Stars and Thermal glow skies. */
	let hundredths = $state(OPENING.hundredths);

	function setSpeed(v: number) {
		const next = clamp(Math.round(v), SPEED.min, SPEED.max);
		if (next === hundredths) return;
		hundredths = next;
		note(true);
	}

	function setSky(next: Sky) {
		if (next === sky) return;
		sky = next;
		note(false);
	}

	/** The arrow keys step the speed by 0.01c, Page Up and Page Down by 0.1c, Home and End to its ends. */
	function sliderKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		const d = {
			ArrowRight: SPEED.key,
			ArrowUp: SPEED.key,
			ArrowLeft: -SPEED.key,
			ArrowDown: -SPEED.key,
			PageUp: SPEED.page,
			PageDown: -SPEED.page,
			Home: -SPEED.max,
			End: SPEED.max
		}[e.key];
		if (d === undefined) return;
		e.preventDefault();
		setSpeed(hundredths + d);
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state<FirstSeen>(FIRST_START);
	let second = $state(false);
	const revealed = $derived(step === 1 ? first.done : second);

	function note(changed: boolean) {
		first = noteFirst(first, sky, hundredths);
		second = noteSecond(second, step, sky, hundredths, changed);
	}

	/** The numbers of the two answers, fixed: the stars beside the camera at 0.9c. */
	const at09 = motion(0.9);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const ETA = '\\htmlClass{q-obs}{\\eta}';
	const BETA = '\\htmlClass{q-obs}{\\beta}';
	const GAMMA = '\\htmlClass{q-obs}{\\gamma}';

	const beta = $derived(sky === 'sun' ? earthBeta() : betaOf(hundredths));
	const m = $derived(motion(beta));
	const end = $derived(scaleEnd(m.eta));
	const field = stars();
	const shown = $derived(field.map((s) => seenStar(s, beta)));
	const earth = sun();
	const same = $derived(unchanged(beta));

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, R: 136, cx: 146, cy: 156, H: 304, bar: 302 }
			: { W: 560, R: 200, cx: 228, cy: 222, H: 440, bar: 470 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	/** A direction on the disc, on the screen: α′ from the centre, φ round it, counter-clockwise from the right. */
	const at = (alpha: number, phi: number) => {
		const r = box.R * radiusOf(alpha);
		return { x: box.cx + r * Math.cos(phi), y: box.cy - r * Math.sin(phi) };
	};
	const ring = (alpha: number) => box.R * radiusOf(alpha);

	const SIZES = [1.45, 2.05, 2.75];
	const dots = $derived(
		shown.map((s, i) => ({
			...at(s.alpha, s.phi),
			r: SIZES[field[i].size] * u * (phone.current ? 0.85 : 1),
			fill: colour(tone(s.factor, end))
		}))
	);

	/** The candidate angles for a label round its ring, on the screen: from the top, alternately either way. */
	const ANGLES = Array.from({ length: 24 }, (_, k) => {
		const side = k % 2 ? 1 : -1;
		return -Math.PI / 2 + side * Math.ceil(k / 2) * (Math.PI / 12);
	});

	const GRATICULE = [90, 45, 135];
	/** The labels of the dashed cone and of the faint rings, kept off the stars and off each other. */
	const ringLabels = $derived.by(() => {
		const h = 15 * u;
		const w = (text: string) => (text.length * 6.7 + 8) * u;
		const items: { key: string; text: string; r: number; cls: string }[] = [];
		if (sky === 'stars') {
			items.push({ key: 'cone', text: `${degrees(m.cone)}°`, r: ring(m.cone), cls: 'cone-words' });
			for (const g of GRATICULE)
				if (Math.abs(g - m.cone / DEG) > 5)
					items.push({ key: `g${g}`, text: `${g}°`, r: ring(g * DEG), cls: 'faint-words' });
		} else if (sky === 'glow') {
			if (same !== undefined)
				items.push({
					key: 'same',
					text: `T unchanged, ${degrees(same)}°`,
					r: ring(same),
					cls: 'same-words'
				});
		}
		const places = placeLabels(
			sky === 'stars' ? dots : [],
			items.map((it) => ({ r: it.r, w: w(it.text), h })),
			{ x: box.cx, y: box.cy },
			box.R,
			ANGLES
		);
		return items.map((it, i) => ({ ...it, ...places[i], w: w(it.text), h }));
	});

	/** The thermal glow: T(α′)/T along the radius, as stops of a radial gradient. */
	const GLOW_STOPS = 64;
	const glowStops = $derived(
		Array.from({ length: GLOW_STOPS + 1 }, (_, k) => {
			const r = k / GLOW_STOPS;
			const alpha = 2 * Math.asin(r);
			return { offset: r, fill: colour(tone(temperature(alpha, beta), end)) };
		})
	);

	/** The colour bar: e^{−end} at the bottom, e^{end} at the top, on a logarithmic scale, with 1/2 and 2 if inside. */
	const bar = $derived.by(() => {
		const top = box.cy - 0.72 * box.R;
		const bottom = box.cy + 0.72 * box.R;
		const y = (f: number) => (top + bottom) / 2 - ((bottom - top) / 2) * (Math.log(f) / end);
		const ticks = [
			{ f: Math.exp(end), text: three(Math.exp(end)) },
			{ f: 1, text: '1' },
			{ f: Math.exp(-end), text: three(Math.exp(-end)) }
		];
		for (const f of [2, 0.5])
			if (Math.abs(Math.log(f)) < end * 0.88) ticks.push({ f, text: f === 2 ? '2' : '1/2' });
		return { top, bottom, x: box.bar, ticks: ticks.map((t) => ({ ...t, y: y(t.f) })) };
	});

	// the Sun's window: degrees of sky about its centre, which lies halfway between the Sun and its image
	const k = $derived(box.R / WINDOW);
	const sunX = $derived(box.cx + (earth.shown / 2) * k);
	const imageX = $derived(box.cx - (earth.shown / 2) * k);
	const sunR = $derived(SUN_RADIUS * k);
	/** The ruler of the shift, in seconds of arc, each drawn a thousand times larger. */
	const rulerY = $derived(box.cy + 1.9 * k);
	const arcsecX = (s: number) => sunX - ((s * MAGNIFY) / 3600) * k;
	const RULER = [0, 5, 10, 15, 20];

	function arrow(x0: number, x1: number, y: number) {
		const d = Math.sign(x1 - x0);
		const l = 7 * u;
		return {
			shaft: `M${f2(x0)},${f2(y)}L${f2(x1 - d * l * 0.7)},${f2(y)}`,
			head: `M${f2(x1)},${f2(y)}L${f2(x1 - d * l)},${f2(y - 3.2 * u)}L${f2(x1 - d * l)},${f2(y + 3.2 * u)}Z`
		};
	}
	const arrowY = $derived(box.cy - 2.4 * k);
	const half = $derived(Math.sqrt(Math.max(0, WINDOW * WINDOW - 2.7 * 2.7)) * k);
	const toMotion = $derived(arrow(box.cx - 8 * u, box.cx - half + 14 * u, arrowY));
	const alongPath = $derived(arrow(box.cx + 8 * u, box.cx + half - 14 * u, arrowY));

	// --- the words --------------------------------------------------------------------------------------------------
	const percent = (f: number) => {
		const p = 100 * f;
		return p >= 9.95 ? p.toFixed(0) : p >= 0.995 ? p.toFixed(1) : p.toFixed(2);
	};

	const description = $derived(
		sky === 'stars'
			? `The whole sky seen from a camera moving at ${three(beta)} of the speed of light, on a disc whose centre is straight ahead and whose rim is straight behind, with equal areas of sky on equal areas of disc. ` +
					`${STAR_COUNT} stars, spread evenly at rest, ${beta > 0 ? 'crowd toward the centre' : 'lie where they are'}: the forward half of the sky, inside the dashed circle, lies within ${degrees(m.cone)} degrees of straight ahead, ${percent(m.forward)} per cent of the sky. ` +
					`Each star is coloured by its Doppler factor, from ${three(m.behind)} straight behind, red, to ${three(m.ahead)} straight ahead, blue.`
			: sky === 'glow'
				? `A black body seen from a camera moving at ${three(beta)} of the speed of light, on the same disc. ` +
					`Its temperature is ${three(m.ahead)} times the glow's own straight ahead, blue, and ${three(m.behind)} times straight behind, red, a ratio of ${three(m.ratio)}` +
					(same !== undefined
						? `; at ${degrees(same)} degrees from straight ahead, on the dotted circle, it is the glow's own.`
						: '; at rest it is the same in every direction.')
				: `A round window of sky ${2 * WINDOW} degrees across, about the Sun seen at right angles to the Earth's motion at 29.78 kilometres a second. ` +
					`The Sun where it is now, filled, and the Sun its light shows, a ring, ${three(earth.arcsec)} seconds of arc toward the direction of motion, drawn a thousand times larger as ${three(earth.shown)} degrees. The Sun's disc is drawn at its true size.`
	);

	const SKIES: { value: Sky; label: string; icon: typeof StarsIcon; wide?: boolean }[] = [
		{ value: 'stars', label: 'Stars', icon: StarsIcon },
		{ value: 'glow', label: 'Thermal glow', icon: FireIcon },
		{ value: 'sun', label: 'The Sun at the Earth’s speed', icon: Sun03Icon, wide: true }
	];
</script>

{#snippet cross()}
	<!-- straight ahead, a cross with a dark edge and a pale core that reads on any colour of the sky -->
	{@const d = `M${box.cx - 5 * u},${box.cy}h${10 * u}M${box.cx},${box.cy - 5 * u}v${10 * u}`}
	<path class="ahead-edge" {d} />
	<path class="ahead" {d} />
{/snippet}

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="moving-sky">
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
				At 0.9c, where do the stars that were beside you, at right angles to your motion, appear?
			{:else}
				Which speed makes the Doppler factor ahead four times the factor behind?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>At 25.8° from straight ahead, on the dashed circle.</strong> A star at
				<Tex math="\alpha = 90^\circ" /> has <Tex
					math={`\\cos\\alpha' = (\\cos\\alpha + ${BETA})/(1 + ${BETA}\\cos\\alpha) = ${BETA}`}
					trust
				/>, so <Tex math={`\\alpha' = \\arccos 0.9 = ${threeTex(at09.cone / DEG)}^\\circ`} />. All
				of the forward half of the sky, inside the dashed circle at rest, is seen within it, in <Tex
					math={`(1 - ${BETA})/2 = 0.05`}
					trust
				/> of the sky, and the half behind spreads over the other 95 per cent. In the stars’ frame their
				light crosses your motion at right angles, so its Doppler factor is <Tex
					math={`${GAMMA} = ${threeTex(at09.gamma)}`}
					trust
				/>: they are blueshifted.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed}
				<strong>0.6c, where the factors are 2 and 1/2.</strong> Straight ahead the factor is <Tex
					math={`e^{${ETA}}`}
					trust
				/> and straight behind <Tex math={`e^{-${ETA}}`} trust />, so their ratio is <Tex
					math={`e^{2${ETA}} = (1 + ${BETA})/(1 - ${BETA})`}
					trust
				/>, which is <Tex math="1.6/0.4 = 4" /> at <Tex math={`${BETA} = 0.6`} trust />, where <Tex
					math={`${ETA} = \\ln 2`}
					trust
				/>. A wave of 1 kHz met head-on is measured at 2 kHz, and overtaken from behind at 500 Hz.
			{:else if step === 1}
				The answer appears once you have slid the speed to 0, where the stars beside you lie on the
				dashed circle at 90°, and back to 0.9c, on the Stars sky.
			{:else}
				The answer appears once you have moved the slider to that speed with this question open; the
				readings below give the factors ahead and behind.
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
				<radialGradient
					id="{uid}-glow"
					gradientUnits="userSpaceOnUse"
					cx={box.cx}
					cy={box.cy}
					r={box.R}
				>
					{#each glowStops as s (s.offset)}
						<stop offset={s.offset} style:stop-color={s.fill} />
					{/each}
				</radialGradient>
				<linearGradient id="{uid}-bar" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" style:stop-color="var(--sky-blue)" />
					<stop offset="0.5" style:stop-color="var(--sky-mid)" />
					<stop offset="1" style:stop-color="var(--sky-red)" />
				</linearGradient>
			</defs>

			{#if sky === 'glow'}
				<circle class="glow" cx={box.cx} cy={box.cy} r={box.R} fill="url(#{uid}-glow)" />
			{:else}
				<circle class="disc" cx={box.cx} cy={box.cy} r={box.R} />
			{/if}

			{#if sky === 'stars'}
				<!-- faint rings at 45°, 90° and 135° from straight ahead, as the camera sees them -->
				{#each GRATICULE as g (g)}
					<circle class="graticule" cx={box.cx} cy={box.cy} r={ring(g * DEG)} />
				{/each}
				{#each dots as d, i (i)}
					<circle class="star" cx={f2(d.x)} cy={f2(d.y)} r={f2(d.r)} style:fill={d.fill} />
				{/each}
				<!-- the circle α = 90° of the sources' frame, the edge of the forward half, where the camera sees it -->
				<circle class="cone" cx={box.cx} cy={box.cy} r={ring(m.cone)} />
				{@render cross()}
			{:else if sky === 'glow'}
				{#if same !== undefined}
					<circle class="same" cx={box.cx} cy={box.cy} r={ring(same)} />
				{/if}
				{@render cross()}
			{:else}
				<!-- the Sun's window: where it is now, and where its light shows it, the shift drawn 1000 times larger -->
				<g class="ruler">
					<path d="M{f2(arcsecX(0))},{f2(rulerY)}H{f2(arcsecX(earth.arcsec))}" />
					{#each RULER as s (s)}
						<path class="tick" d="M{f2(arcsecX(s))},{f2(rulerY)}v{5 * u}" />
						<text class="small dim mid" x={arcsecX(s)} y={rulerY + 17 * u}>{s}″</text>
					{/each}
					<path
						class="tick strong"
						d="M{f2(arcsecX(earth.arcsec))},{f2(rulerY - 5 * u)}v{10 * u}"
					/>
					<text class="small mid" x={box.cx} y={rulerY + 33 * u}
						>the shift, drawn {MAGNIFY.toLocaleString('en-US')} times larger</text
					>
				</g>
				<path class="guide" d="M{f2(sunX)},{f2(box.cy + sunR + 4 * u)}V{f2(rulerY - 2 * u)}" />
				<path class="guide" d="M{f2(imageX)},{f2(box.cy + sunR + 4 * u)}V{f2(rulerY - 7 * u)}" />
				<circle class="sun-now" cx={sunX} cy={box.cy} r={sunR} />
				<circle class="sun-seen" cx={imageX} cy={box.cy} r={sunR} />
				<text class="label mid halo" x={sunX} y={box.cy - sunR - 12 * u}>where it is now</text>
				<text class="label mid halo light-words" x={imageX} y={box.cy - sunR - 12 * u}
					>where it is seen</text
				>
				<g class="arrows">
					<path class="shaft" d={toMotion.shaft} />
					<path class="head" d={toMotion.head} />
					<path class="shaft" d={alongPath.shaft} />
					<path class="head" d={alongPath.head} />
				</g>
				<text class="small dim end" x={box.cx - 10 * u} y={arrowY - 7 * u}>toward the motion</text>
				<text class="small dim start" x={box.cx + 10 * u} y={arrowY - 7 * u}>Sun’s yearly path</text
				>
				<!-- where the window lies on the whole sky: on the circle at 90°, to the right of straight ahead -->
				<g class="locator" transform="translate({f2(box.W - 24 * u)} {f2(24 * u)})">
					<circle class="mini" r={15 * u} />
					<circle class="mini-ring" r={15 * u * Math.SQRT1_2} />
					<circle class="mini-ahead" r={1.6 * u} />
					<circle class="mini-window" cx={15 * u * Math.SQRT1_2} r={3 * u} />
				</g>
			{/if}

			<!-- the labels of the rings, each off the stars -->
			{#each ringLabels as l (l.key)}
				<rect
					class={['pill', { 'on-glow': sky === 'glow' }]}
					x={f2(l.x - l.w / 2)}
					y={f2(l.y - l.h / 2)}
					width={f2(l.w)}
					height={f2(l.h)}
					rx={4 * u}
				/>
				<text class={['small mid', l.cls]} x={f2(l.x)} y={f2(l.y + 4 * u)}>{l.text}</text>
			{/each}

			{#if sky !== 'sun'}
				<!-- the colour bar, logarithmic: the factor behind at the bottom, ahead at the top -->
				<text class="label mid" x={bar.x + 5 * u} y={bar.top - 12 * u}
					>{#if sky === 'stars'}<tspan class="it">ω</tspan>′/<tspan class="it">ω</tspan
						>{:else}<tspan class="it">T</tspan>(<tspan class="it">α</tspan>′)/<tspan class="it"
							>T</tspan
						>{/if}</text
				>
				<rect
					class="bar"
					x={bar.x}
					y={bar.top}
					width={10 * u}
					height={bar.bottom - bar.top}
					fill="url(#{uid}-bar)"
				/>
				{#each bar.ticks as t (t.text)}
					<path class="bar-tick" d="M{bar.x + 10 * u},{f2(t.y)}h{4 * u}" />
					<text class="small dim start" x={bar.x + 17 * u} y={f2(t.y + 4 * u)}>{t.text}</text>
				{/each}
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			{#if sky === 'sun'}
				<li>
					<span class="swatch sun-now-key"></span><span>the Sun where it is now: its gravity</span>
				</li>
				<li>
					<span class="swatch sun-seen-key"></span><span
						>the Sun its light shows, 20.5″ toward the motion</span
					>
				</li>
				<li>
					<span class="swatch mini-key"></span><span
						>the window, on the whole sky: 90° from straight ahead</span
					>
				</li>
			{:else}
				<li>
					<span class="swatch ahead-key">+</span><span
						>straight ahead at the centre, straight behind on the rim</span
					>
				</li>
				{#if sky === 'stars'}
					<li>
						<span class="swatch cone-key"></span><span
							>the forward half of the sky, <Tex math="\alpha \le 90^\circ" /> at rest</span
						>
					</li>
					<li>
						<span class="swatch graticule-key"></span><span
							><Tex math="\alpha' = 45^\circ" />, <Tex math="90^\circ" /> and <Tex
								math="135^\circ"
							/> for the camera</span
						>
					</li>
					<li>
						<span class="swatch dots-key"><i class="b"></i><i class="m"></i><i class="r"></i></span
						><span>each star’s Doppler factor: blue above 1, red below</span>
					</li>
				{:else}
					<li>
						<span class="swatch same-key"></span><span
							>where the glow keeps its temperature, <Tex math="T(\alpha') = T" /></span
						>
					</li>
				{/if}
			{/if}
		</ul>
	</div>

	<div class="bar-controls">
		<Segmented label="Sky" options={SKIES} bind:value={() => sky, setSky} />
		{#if sky === 'sun'}
			<p class="fixed">
				The speed is fixed at the Earth’s on its orbit, <Tex
					math={`v = ${EARTH.v}\\,\\mathrm{km\\,s^{-1}}`}
				/>.
			</p>
		{:else}
			<div onkeydowncapture={sliderKeys} role="presentation">
				<Slider
					id="{uid}-speed"
					label="Speed"
					icon={DashboardSpeed02Icon}
					min={SPEED.min / 100}
					max={SPEED.max / 100}
					step={0.01}
					bind:value={() => betaOf(hundredths), (v) => setSpeed(v * 100)}
					readout="β = {betaOf(hundredths).toFixed(2)}"
					ends={['0', '0.99c']}
					marks={[
						{ at: 0, label: 'at rest' },
						{ at: 0.6, label: '0.6c, the paper’s pixel, η = ln 2' },
						{ at: 0.9, label: '0.9c, the paper’s Figure of the stars' },
						{ at: 0.99, label: '0.99c, a cone of 8.1°' }
					]}
					marksHint="the ticks mark rest, 0.6c, 0.9c and 0.99c"
				/>
			</div>
		{/if}
		<p class="hint">
			{#if sky === 'sun'}
				Tab reaches the skies; on the other two, the slider sets the speed.
			{:else}
				Tab reaches the skies and the slider. The slider takes the arrow keys, a step of 0.01c, and
				Page Up and Page Down, a step of 0.1c.
			{/if}
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The camera</dt>
				<dd>
					{@render eq([`${BETA} = ${threeTex(m.beta)}`])}
					{@render eq([`${GAMMA} = 1/\\sqrt{1 - ${BETA}^2}`, `= ${threeTex(m.gamma)}`])}
					{@render eq([`${ETA} = \\operatorname{artanh}${BETA}`, `= ${threeTex(m.eta)}`])}
				</dd>
			</div>
			<div class="row">
				<dt>The cone</dt>
				<dd>
					{@render eq([
						`\\alpha'_{\\rm cone} = \\arccos${BETA}`,
						`= ${threeTex(m.cone / DEG)}^\\circ`
					])}<span class="also"
						>holds the forward half of the sky, in <Tex
							math={`(1 - ${BETA})/2 = ${threeTex(m.forward)}`}
							trust
						/> of it</span
					>
				</dd>
			</div>
			{#if sky === 'stars'}
				<div class="row">
					<dt>The Doppler factor</dt>
					<dd aria-live="polite">
						{@render eq([`\\text{ahead } e^{${ETA}}`, `= ${threeTex(m.ahead)}`])}
						{@render eq([`\\text{behind } e^{-${ETA}}`, `= ${threeTex(m.behind)}`])}
						{@render eq([`\\text{ratio } e^{2${ETA}}`, `= ${threeTex(m.ratio)}`])}
					</dd>
				</div>
			{:else if sky === 'glow'}
				<div class="row">
					<dt>The temperature</dt>
					<dd aria-live="polite">
						{@render eq([`T_{\\rm hottest}/T = e^{${ETA}}`, `= ${threeTex(m.ahead)}`])}
						{@render eq([`T_{\\rm coldest}/T = e^{-${ETA}}`, `= ${threeTex(m.behind)}`])}
						{@render eq([`\\text{ratio } e^{2${ETA}}`, `= ${threeTex(m.ratio)}`])}
					</dd>
				</div>
				<div class="row">
					<dt>The dipole</dt>
					<dd>
						{@render eq([`T(\\alpha') \\approx T\\,(1 + ${BETA}\\cos\\alpha')`])}<span class="also"
							>to first order, a dipole of size <Tex
								math={`${BETA} = ${threeTex(m.beta)}`}
								trust
							/>{#if same !== undefined}; the glow keeps its own temperature at <Tex
									math={`\\alpha' = ${threeTex(same / DEG)}^\\circ`}
								/>{/if}</span
						>
					</dd>
				</div>
			{:else}
				<div class="row">
					<dt>The shift</dt>
					<dd>
						{@render eq([
							`\\delta = 90^\\circ - \\alpha'`,
							`= ${threeTex(earth.delta)}\\,\\mathrm{rad}`,
							`= ${threeTex(earth.arcsec)}''`
						])}<span class="also"
							>which is <Tex math={`v_\\perp/c = ${threeTex(earth.first)}`} /> to first order; drawn {MAGNIFY.toLocaleString(
								'en-US'
							)} times larger, as <Tex math={`${threeTex(earth.shown)}^\\circ`} /></span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			{#if sky === 'stars'}
				The camera moves through the stars’ frame at <Tex math={`${BETA}c`} trust />. A star at <Tex
					math="\alpha"
				/> from the direction of motion in that frame is seen at <Tex
					math={`\\cos\\alpha' = (\\cos\\alpha + ${BETA})/(1 + ${BETA}\\cos\\alpha)`}
					trust
				/>, with its light shifted by <Tex math={`1/[${GAMMA}(1 - ${BETA}\\cos\\alpha')]`} trust />.
				A direction at <Tex math="\alpha'" /> lies at <Tex math="\sin(\alpha'/2)" /> of the disc’s radius,
				so the projection keeps areas, and the crowding is the true crowding of the sky. The {STAR_COUNT}
				stars are spread evenly over the sky at rest, each holding an equal share of it. The colour scale
				runs from <Tex math={`e^{-${ETA}}`} trust /> to <Tex math={`e^{${ETA}}`} trust />, but never
				closer to 1 than 0.905 and 1.11, so that a slow camera’s sky stays pale.
			{:else if sky === 'glow'}
				The camera moves at <Tex math={`${BETA}c`} trust /> through the frame in which the glow is the
				same in every direction. In each direction it still sees a black body, at <Tex
					math={`T(\\alpha') = T/[${GAMMA}(1 - ${BETA}\\cos\\alpha')]`}
					trust
				/>: hotter ahead, colder behind, and at its own temperature on the dotted circle. Our motion
				through the microwave background, <Tex math={`${BETA} = 1.23\\times10^{-3}`} trust />, gives
				it a dipole of
				<Tex math={'\\pm3.36\\,\\mathrm{mK}'} />, which on this scale would look uniform.
			{:else}
				The Earth moves at right angles to the line to the Sun, so the Sun is seen across the
				motion, and its light is turned toward the motion by <Tex
					math={`\\delta = ${threeTex(earth.arcsec)}''`}
				/>. Its gravity points at where it is now, so the gravitational Sun is <Tex
					math={`${threeTex(earth.arcsec)}''`}
				/> ahead of the Sun we see along its yearly path across the sky. The Sun’s disc is drawn at its
				true size, half a degree across; only the shift is magnified. At its true size the two discs would
				overlap all but about one per cent.
			{/if}
		</p>
	</div>
</div>

<style>
	.moving-sky {
		/* the paper's diverging scale, blue above 1 and red below a pale middle: its own colours on the light ground,
		   and the site's squeeze and stretch on the dark one */
		--sky-blue: #7fb4ff;
		--sky-mid: #ece6dc;
		--sky-red: #e8a45a;
		--star-edge: color-mix(in srgb, var(--bg-sunken) 70%, transparent);
		/* inks that read on the scale's pale middle, and over its blue */
		--sky-ink: #1c1a16;
		--sky-ink-pale: #f7f3ec;
		--obs: var(--q-obs);
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	:global(:root[data-theme='light']) .moving-sky {
		--sky-blue: #2a67ad;
		--sky-mid: #f7f3ec;
		--sky-red: #b0560a;
		--star-edge: color-mix(in srgb, var(--text) 45%, transparent);
	}

	@media (prefers-color-scheme: light) {
		:global(:root:not([data-theme='dark'])) .moving-sky {
			--sky-blue: #2a67ad;
			--sky-mid: #f7f3ec;
			--sky-red: #b0560a;
			--star-edge: color-mix(in srgb, var(--text) 45%, transparent);
		}
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
	.next:focus-visible {
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
		max-width: 560px;
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

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.disc {
		fill: color-mix(in srgb, var(--text) 3%, var(--bg-sunken));
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.glow {
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.graticule {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.star {
		stroke: var(--star-edge);
		stroke-width: calc(0.6px * var(--u, 1));
	}

	.cone {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3.5px * var(--u, 1));
	}

	.same {
		fill: none;
		stroke: var(--sky-ink);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.ahead,
	.ahead-edge {
		fill: none;
		stroke: var(--sky-ink-pale);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-linecap: round;
	}

	.ahead-edge {
		stroke: var(--sky-ink);
		stroke-width: calc(3.6px * var(--u, 1));
	}

	.pill {
		fill: color-mix(in srgb, var(--bg-sunken) 88%, transparent);
	}

	text.cone-words {
		fill: var(--text);
		font-weight: 600;
	}

	text.faint-words {
		fill: var(--text-faint);
	}

	.pill.on-glow {
		fill: color-mix(in srgb, var(--sky-mid) 88%, transparent);
	}

	text.same-words {
		fill: var(--sky-ink);
		font-weight: 500;
	}

	text.light-words {
		fill: var(--q-light);
	}

	.bar {
		stroke: var(--line-strong);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.bar-tick {
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.sun-now {
		fill: var(--q-matter);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.sun-seen {
		fill: color-mix(in srgb, var(--q-light) 14%, transparent);
		stroke: var(--q-light);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.ruler path {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1px * var(--u, 1));
	}

	.ruler .tick.strong {
		stroke: var(--q-light);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.guide {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.arrows .shaft {
		fill: none;
		stroke: var(--text-dim);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.arrows .head {
		fill: var(--text-dim);
	}

	.mini {
		fill: color-mix(in srgb, var(--text) 3%, var(--bg-sunken));
		stroke: var(--line-strong);
		stroke-width: calc(1px * var(--u, 1));
	}

	.mini-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 40%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-dasharray: calc(1.5px * var(--u, 1)) calc(2px * var(--u, 1));
	}

	.mini-ahead {
		fill: var(--text);
	}

	.mini-window {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
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

	.ahead-key {
		height: auto;
		border: 0;
		text-align: center;
		font-weight: 600;
		color: var(--text);
	}

	.cone-key {
		border-top-style: dashed;
		border-color: var(--text);
	}

	.graticule-key {
		border-top-style: dotted;
		border-color: var(--text-faint);
	}

	.same-key {
		border-top-width: 2px;
		border-top-style: dotted;
		border-color: var(--text);
	}

	.dots-key {
		display: inline-flex;
		gap: 2px;
		width: auto;
		height: auto;
		border: 0;
	}

	.dots-key i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		box-shadow: 0 0 0 0.6px var(--star-edge);
	}

	.dots-key .b {
		background: var(--sky-blue);
	}

	.dots-key .m {
		background: var(--sky-mid);
	}

	.dots-key .r {
		background: var(--sky-red);
	}

	.sun-now-key,
	.sun-seen-key,
	.mini-key {
		width: 0.7rem;
		height: 0.7rem;
		border: 0;
		border-radius: 50%;
	}

	.sun-now-key {
		background: var(--q-matter);
	}

	.sun-seen-key {
		border: 1.6px solid var(--q-light);
	}

	.mini-key {
		border: 1.2px solid var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar-controls {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.fixed,
	.hint {
		margin: 0;
		font: 400 0.78rem/1.35 var(--font-sans);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.fixed {
		color: var(--text);
		font-size: 0.8rem;
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

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}
</style>
