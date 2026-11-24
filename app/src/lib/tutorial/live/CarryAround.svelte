<script lang="ts">
	/**
	 * Chapter 7.2's arrow carried round a loop. A sphere of radius a in oblique view, turned by dragging it (or with
	 * the arrow keys once it has the focus), with a loop of three or four corners joined by arcs of great circles in
	 * the curvature's colour. "Carry the arrow round" carries an arrow, in the observer's colour, round the loop
	 * without turning it, leaving faint copies every 10°; the starting arrow stays dashed at the first corner. The
	 * readouts give the turn, the area enclosed over a² and their difference, from ./carry-around.ts. A switch puts a
	 * flat sheet with polar labels in the sphere's place, where the sides are straight, the arrow comes home unturned,
	 * and Γ^r_θθ = −r is read at the first corner. The figure opens on the octant with the arrow already carried round,
	 * at 90.0°. Three predictions at the top are answered once the reader has done what each asks. Under reduced
	 * motion the arrow goes round at once and is drawn at its final place, with the copies.
	 */
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		GlobeIcon,
		GridIcon,
		MinusSignIcon,
		PlayIcon,
		PlusSignIcon,
		RefreshIcon
	} from '@hugeicons/core-free-icons';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		DEG,
		OCTANT,
		SHEET_COPIES,
		SHEET_LIMIT,
		SHEET_OPENING,
		SPHERE_COPIES,
		VIEW_OPENING,
		add,
		addSheetCorner,
		addSphereCorner,
		arcPoints,
		carrySheet,
		cornerWords,
		copies,
		cross,
		degrees,
		dot,
		fixed,
		longitude,
		meridian,
		movedSheet,
		movedSphere,
		noteFirst,
		noteSecond,
		noteThird,
		parallel,
		placedSheet,
		placedSphere,
		point,
		polarChristoffel,
		project,
		readSphere,
		removeCorner,
		sameSheet,
		sameSphere,
		sampleAt,
		scale,
		sheetArea,
		sheetKey,
		sheetValid,
		sheetWords,
		sides,
		sphereKey,
		sphereValid,
		tex,
		three,
		turned,
		unit,
		unproject,
		viewKey,
		type SheetCorner,
		type SphereCorner,
		type Surface,
		type Vec,
		type View
	} from './carry-around';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	let surface = $state<Surface>('sphere');
	let sphere = $state<SphereCorner[]>(OCTANT);
	let sheet = $state<SheetCorner[]>(SHEET_OPENING);
	let view = $state<View>(VIEW_OPENING);

	function setSurface(s: Surface) {
		if (s === surface) return;
		stop();
		surface = s;
		head = 1;
		third = noteThird(third, surface, sheet);
	}

	function setSphere(cs: SphereCorner[]) {
		if (sameSphere(cs, sphere)) return;
		stop();
		head = 1;
		sphere = cs;
		second = noteSecond(second, cs);
	}

	function setSheet(cs: SheetCorner[]) {
		if (sameSheet(cs, sheet)) return;
		stop();
		head = 1;
		sheet = cs;
		third = noteThird(third, surface, cs);
	}

	const count = $derived(surface === 'sphere' ? sphere.length : sheet.length);

	function toggleCorner() {
		if (surface === 'sphere')
			setSphere(sphere.length < 4 ? addSphereCorner(sphere) : removeCorner(sphere, sphereValid));
		else setSheet(sheet.length < 4 ? addSheetCorner(sheet) : removeCorner(sheet, sheetValid));
	}

	function reset() {
		if (surface === 'sphere') {
			setSphere(OCTANT);
			view = VIEW_OPENING;
		} else setSheet(SHEET_OPENING);
	}

	// --- carrying the arrow round ---------------------------------------------------------------------------------
	/** How far round the arrow has been carried, as a fraction of the way; the figure opens with it home. */
	let head = $state(1);
	let playing = $state(false);
	let frame = 0;

	function stop() {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		playing = false;
	}

	function carried() {
		if (surface === 'sphere') first = noteFirst(first, sphere, true);
	}

	function play() {
		stop();
		if (prefersReducedMotion.current) {
			head = 1;
			carried();
			return;
		}
		// about 90° of arc, or 3 m of the sheet, a second
		const seconds =
			surface === 'sphere' ? sphereRead.carry.length / (Math.PI / 2) : sheetRead.length / 3;
		const ms = 1000 * Math.max(1.5, Math.min(5, seconds));
		const start = performance.now();
		playing = true;
		head = 0;
		const tick = (now: number) => {
			const k = Math.min(1, (now - start) / ms);
			head = k;
			if (k >= 1) {
				frame = 0;
				playing = false;
				carried();
				return;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
	}

	$effect(() => stop);

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	let first = $state(false);
	let second = $state(false);
	let third = $state(false);
	const revealed = $derived(step === 1 ? first : step === 2 ? second : third);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const sphereRead = $derived(readSphere(sphere));
	const sheetRead = $derived(carrySheet(sheet));
	const sheetTurn = $derived(sheetRead.measured / DEG);
	const area = $derived(sheetArea(sheet));
	const r0 = $derived(Math.hypot(sheet[0].x, sheet[0].y));
	const christoffel = $derived(polarChristoffel(r0));

	const R = '\\htmlClass{q-curv}{R}';
	const V = '\\htmlClass{q-obs}{v}';
	const GAMMA = '\\Gamma^r{}_{\\theta\\theta}';

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(phone.current ? { W: 360, H: 330, R: 128 } : { W: 560, H: 400, R: 158 });
	const cx = $derived(box.W / 2);
	const cy = $derived(box.H / 2);
	/** Pixels of the drawing in a metre of the sheet. */
	const S = $derived(box.R / (SHEET_LIMIT + 0.2));
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	/** A point of the unit sphere on the page, with its depth toward the reader. */
	const onPage = (p: Vec) => {
		const q = project(p, view);
		return { x: cx + box.R * q[0], y: cy - box.R * q[1], z: q[2] };
	};
	const sheetPage = (x: number, y: number) => ({ x: cx + S * x, y: cy - S * y });

	const line = (pts: { x: number; y: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f2(q.x)},${f2(q.y)}`).join('');

	/** A polyline on the sphere, cut into its near and far runs, as paths. */
	function spherePaths(pts: Vec[]) {
		const projected = pts.map((p) => {
			const q = onPage(p);
			return [q.x, q.y, q.z] as Vec;
		});
		const { near, far } = sides(projected);
		const d = (runs: Vec[][]) =>
			runs.map((run) => line(run.map((q) => ({ x: q[0], y: q[1] })))).join('');
		return { near: d(near), far: d(far) };
	}

	/** An arrow on the page from its tail to its tip, with a head that shrinks with a short shaft. */
	function arrowShape(t: { x: number; y: number }, h: { x: number; y: number }) {
		const dx = h.x - t.x;
		const dy = h.y - t.y;
		const l = Math.hypot(dx, dy);
		const len = Math.min(8 * u, 0.6 * l);
		const w = len * 0.48;
		if (l < 1e-6) return { d: '', head: '' };
		const ux = dx / l;
		const uy = dy / l;
		const bx = h.x - ux * len;
		const by = h.y - uy * len;
		return {
			d: `M${f2(t.x)},${f2(t.y)}L${f2(bx + ux * 0.5 * u)},${f2(by + uy * 0.5 * u)}`,
			head: `${f2(h.x)},${f2(h.y)} ${f2(bx - uy * w)},${f2(by + ux * w)} ${f2(bx + uy * w)},${f2(by - ux * w)}`
		};
	}

	/** The arrow's length on the sphere, in radii, and on the sheet, in metres. */
	const L_SPHERE = 0.3;
	const L_SHEET = 0.5;

	function sphereArrow(p: Vec, v: Vec) {
		const t = onPage(p);
		const h = onPage(add(p, v, L_SPHERE));
		return { ...arrowShape(t, h), near: t.z > -0.02 };
	}

	function sheetArrow(p: [number, number], v: [number, number]) {
		const t = sheetPage(p[0], p[1]);
		const h = sheetPage(p[0] + L_SHEET * v[0], p[1] + L_SHEET * v[1]);
		return { ...arrowShape(t, h), near: true };
	}

	// the sphere's lines: a graticule every 30°, with the equator and the meridians of 0° and 90° E stronger
	const graticule = $derived.by(() => {
		const faint: string[] = [];
		for (const th of [30, 60, 120, 150]) faint.push(spherePaths(parallel(th)).near);
		for (let ph = -150; ph <= 180; ph += 30)
			if (ph !== 0 && ph !== 90) faint.push(spherePaths(meridian(ph)).near);
		const strong = [parallel(90), meridian(0), meridian(90)].map((pts) => spherePaths(pts).near);
		return { faint: faint.join(''), strong: strong.join('') };
	});

	const spherePoints = $derived(sphere.map(point));
	const loopPaths = $derived.by(() => {
		const pts: Vec[] = [];
		spherePoints.forEach((a, i) => {
			const arc = arcPoints(a, spherePoints[(i + 1) % spherePoints.length]);
			pts.push(...(i ? arc.slice(1) : arc));
		});
		return spherePaths(pts);
	});

	const sheetLoop = $derived(line([...sheet, sheet[0]].map((c) => sheetPage(c.x, c.y))) + 'Z');

	/** The faint copies up to how far the arrow has gone, the moving arrow and the dashed starting one. */
	const arrows = $derived.by(() => {
		if (surface === 'sphere') {
			const c = sphereRead.carry;
			const at = head * c.length;
			const faint = copies(c.samples, SPHERE_COPIES)
				.filter((i) => c.samples[i].s <= at + 1e-9)
				.map((i) => sphereArrow(c.samples[i].p, c.samples[i].v))
				.filter((a) => a.near);
			const i = sampleAt(c.samples, at);
			const j = Math.min(i + 1, c.samples.length - 1);
			const a = c.samples[i];
			const b = c.samples[j];
			const k = b.s > a.s ? (at - a.s) / (b.s - a.s) : 0;
			const p = unit(add(scale(a.p, 1 - k), b.p, k));
			const w = add(scale(a.v, 1 - k), b.v, k);
			const v = unit(add(w, p, -dot(w, p)));
			return {
				faint,
				moving: sphereArrow(p, v),
				start: sphereArrow(c.samples[0].p, c.start)
			};
		}
		const c = sheetRead;
		const at = head * c.length;
		const faint = copies(c.samples, SHEET_COPIES)
			.filter((i) => c.samples[i].s <= at + 1e-9)
			.map((i) => sheetArrow(c.samples[i].p, c.samples[i].v));
		const s = c.samples[sampleAt(c.samples, at)];
		return { faint, moving: sheetArrow(s.p, s.v), start: sheetArrow(c.samples[0].p, c.start) };
	});

	/** The arc from the starting arrow to the returning one at the first corner, with its label. */
	const turnArc = $derived.by(() => {
		if (head < 1 || playing) return undefined;
		if (surface === 'sphere') {
			const c = sphereRead.carry;
			const p = c.samples[0].p;
			const w = cross(p, c.start);
			const angle = c.measured;
			const n = Math.max(2, Math.ceil(Math.abs(angle) / (3 * DEG)));
			const at = (t: number, rho: number) =>
				onPage(add(p, add(scale(c.start, Math.cos(t)), w, Math.sin(t)), rho));
			const pts = Array.from({ length: n + 1 }, (_, k) => at((k / n) * angle, 0.15));
			// the label beyond the arc, along the middle of the turn as seen on the page, clear of the corner
			const o = onPage(p);
			const m = at(Math.abs(angle) > 1e-3 ? angle / 2 : -Math.PI / 2, 0.3);
			const dx = m.x - o.x;
			const dy = m.y - o.y;
			const l = Math.hypot(dx, dy);
			const reach = Math.max(l, 30 * u);
			const label =
				l > 1e-6
					? { x: o.x + (dx / l) * reach, y: o.y + (dy / l) * reach }
					: { x: o.x, y: o.y + reach };
			return {
				d: Math.abs(angle) > 1e-3 ? line(pts) : '',
				x: label.x,
				y: label.y + 4 * u,
				text: `${degrees(sphereRead.turn)}°`,
				near: onPage(p).z > -0.02
			};
		}
		const c = sheetRead;
		const p = c.samples[0].p;
		// the arrows coincide: the label sits just across from them
		const label = sheetPage(p[0] + 0.5 * c.start[1], p[1] - 0.5 * c.start[0]);
		return { d: '', x: label.x, y: label.y + 4 * u, text: `${degrees(sheetTurn)}°`, near: true };
	});

	const handles = $derived(
		surface === 'sphere'
			? sphere.map((c, k) => ({ k, ...onPage(point(c)) }))
			: sheet.map((c, k) => ({ k, ...sheetPage(c.x, c.y), z: 1 }))
	);

	/** Labels for the sphere: the North Pole and the two meridians, south of the equator, where the loop is not. */
	const sphereLabels = $derived(
		[
			{ text: 'N', p: [0, 0, 1] as Vec, lift: 16 },
			{ text: '0°', p: point({ th: 125, ph: 0 }), lift: 0 },
			{ text: '90° E', p: point({ th: 125, ph: 90 }), lift: 0 }
		]
			.map((l) => {
				const q = onPage(l.p);
				return { ...l, ...q, y: q.y - l.lift * u };
			})
			.filter((l) => l.z > 0.05)
	);

	// --- dragging the corners and the sphere ----------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<number | undefined>();
	let turning = $state(false);
	let last: { x: number; y: number } | undefined;

	function local(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let moveFrame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (moveFrame) return;
		moveFrame = requestAnimationFrame(() => {
			moveFrame = 0;
			const ev = pending;
			pending = undefined;
			if (!ev) return;
			if (dragging !== undefined) {
				const q = local(ev);
				if (!q) return;
				if (surface === 'sphere') {
					const p = unproject((q.x - cx) / box.R, (cy - q.y) / box.R, view);
					setSphere(placedSphere(sphere, dragging, p));
				} else setSheet(placedSheet(sheet, dragging, (q.x - cx) / S, (cy - q.y) / S));
			} else if (turning && last) {
				const dx = (ev.clientX - last.x) * u;
				const dy = (ev.clientY - last.y) * u;
				last = { x: ev.clientX, y: ev.clientY };
				view = turned(view, dx / box.R / DEG, dy / box.R / DEG);
			}
		});
	}

	function grab(e: PointerEvent, k: number) {
		if (e.button !== 0) return;
		// a drag is not a click: the handle does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = k;
		schedule(e);
	}

	function spin(e: PointerEvent) {
		if (e.button !== 0 || surface !== 'sphere') return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		turning = true;
		last = { x: e.clientX, y: e.clientY };
	}

	function move(e: PointerEvent) {
		if (dragging !== undefined || turning) schedule(e);
	}

	function release() {
		dragging = undefined;
		turning = false;
		last = undefined;
	}

	function cornerKey(e: KeyboardEvent, k: number) {
		if (surface === 'sphere') {
			const d = sphereKey(e.key, e.shiftKey);
			if (!d) return;
			e.preventDefault();
			setSphere(movedSphere(sphere, k, d[0], d[1]));
		} else {
			const d = sheetKey(e.key, e.shiftKey);
			if (!d) return;
			e.preventDefault();
			setSheet(movedSheet(sheet, k, d[0], d[1]));
		}
	}

	function globeKey(e: KeyboardEvent) {
		const next = viewKey(view, e.key, e.shiftKey);
		if (!next) return;
		e.preventDefault();
		view = next;
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const ORDINAL = ['first', 'second', 'third', 'fourth'];
	const sense = (turn: number) =>
		Math.abs(turn) < 5e-4 ? '' : turn > 0 ? 'anticlockwise' : 'clockwise';

	const cornerLabel = (k: number) =>
		surface === 'sphere'
			? `The loop’s ${ORDINAL[k]} corner${k === 0 ? ', where the arrow starts' : ''}. Drag it, or move it 1° of latitude or longitude with the arrow keys, 10° with Shift.`
			: `The loop’s ${ORDINAL[k]} corner${k === 0 ? ', where the arrow starts' : ''}. Drag it, or move it 0.1 m with the arrow keys, 0.5 m with Shift.`;
	const cornerText = (k: number) =>
		surface === 'sphere' ? cornerWords(sphere[k]) : sheetWords(sheet[k]);

	const viewText = $derived(
		`seen from above ${longitude(Math.round(view.lon))}, ${Math.abs(Math.round(view.el))}° ${view.el >= 0 ? 'north' : 'south'} of the equator`
	);

	const description = $derived(
		surface === 'sphere'
			? `A sphere of radius a, ${viewText}, with the equator and the meridians of 0° and 90° E drawn. ` +
					`A loop of ${sphere.length} corners joined by arcs of great circles: ${sphere.map(cornerWords).join('; then ')}; and back. ` +
					`An arrow starts at the first corner pointing along the first side and is carried round without turning. ` +
					`It comes home turned by ${degrees(sphereRead.turn)} degrees${sense(sphereRead.turn) ? ` ${sense(sphereRead.turn)}, seen from outside` : ''}; ` +
					`the area enclosed over a² is ${degrees(Math.abs(sphereRead.area))} degrees, ${three(sphereRead.fraction)} of the sphere.` +
					(sphereRead.crossed ? ' The loop crosses itself.' : '')
			: `A flat sheet with polar labels: circles of r = 1, 2 and 3 metres and rays every 30°. ` +
					`A loop of ${sheet.length} corners joined by straight segments: ${sheet.map(sheetWords).join('; then ')}; and back. ` +
					`An arrow carried round it without turning comes home turned by ${degrees(sheetTurn)} degrees, unturned, ` +
					`although its components along r and θ change on the way.`
	);

	const VIEWS: { value: Surface; label: string; icon: typeof GlobeIcon }[] = [
		{ value: 'sphere', label: 'Sphere', icon: GlobeIcon },
		{ value: 'sheet', label: 'Flat sheet, polar labels', icon: GridIcon }
	];
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

{#snippet drawn(a: { d: string; head: string }, cls: string)}
	<g class={cls}>
		<path d={a.d} />
		<polygon points={a.head} />
	</g>
{/snippet}

<div class="carry-around">
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
				Carry the arrow round one octant. By what angle has it turned when it comes home?
			{:else if step === 2}
				Move the corner at 90° E to 45° E, halving the loop’s area. What happens to the angle?
			{:else}
				Switch to the flat sheet and make any loop. What is the angle?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1}
				<strong>By 90°,</strong> the area <Tex math="\pi a^2/2" /> divided by <Tex math="a^2" />.
				The loop encloses one eighth of the sphere, <Tex math="4\pi a^2/8" />, and the arrow, never
				turned on the way, comes home pointing south along the meridian of 90° E instead of
				Greenwich’s.
				<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
			{:else if revealed && step === 2}
				<strong>It halves, to 45°.</strong> The loop now encloses a sixteenth of the sphere,
				<Tex math="\pi a^2/4" />, and the turn is the area over <Tex math="a^2" /> for any loop.
				<button type="button" class="next" onclick={() => (step = 3)}>Next prediction</button>
			{:else if revealed && step === 3}
				<strong>0°.</strong> On the flat sheet the arrow comes home unturned round any loop. Its
				components <Tex math={`${V}^r`} trust /> and <Tex math={`${V}^\\theta`} trust /> change on the
				way, and <Tex math={`${GAMMA} = -r`} /> is not zero, yet the sheet has no curvature: Christoffel
				symbols can be nonzero where there is no curvature.
			{:else if step === 1}
				The answer appears once you have carried the arrow round an octant with “Carry the arrow
				round”.
			{:else if step === 2}
				The answer appears once the corner at 90° E is at 45° E: Tab to the third corner and press
				the left arrow, or drag it along the equator.
			{:else}
				The answer appears once you have switched to the flat sheet and moved one of its corners.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {box.H}"
			role="group"
			aria-label={description}
			class={{ dragging: dragging !== undefined, turning }}
			onpointerdown={spin}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<radialGradient id="{uid}-shade" cx="0.4" cy="0.36" r="0.7">
					<stop offset="0" class="shade-0" />
					<stop offset="1" class="shade-1" />
				</radialGradient>
			</defs>

			{#if surface === 'sphere'}
				<!-- the sphere: drag it, or give it the focus and use the arrow keys, to turn it -->
				<circle
					class="globe"
					{cx}
					{cy}
					r={box.R}
					fill="url(#{uid}-shade)"
					role="slider"
					tabindex="0"
					aria-label="The sphere. Drag it, or turn it with the arrow keys, 15° at a time with Shift."
					aria-valuemin={-180}
					aria-valuemax={180}
					aria-valuenow={Math.round(view.lon)}
					aria-valuetext={viewText}
					onkeydown={globeKey}
				/>
				<path class="grat" d={graticule.faint} />
				<path class="grat strong" d={graticule.strong} />
				<circle class="rim" {cx} {cy} r={box.R} />

				<path class="loop far" d={loopPaths.far} />
				<path class="loop" d={loopPaths.near} />

				{#each sphereLabels as l (l.text)}
					<text class="small mid {l.text === 'N' ? 'name' : 'dim'}" x={l.x} y={l.y + 4 * u}
						>{l.text}</text
					>
				{/each}
			{:else}
				<!-- the flat sheet, with polar labels: circles of constant r and rays of constant θ -->
				<rect
					class="plane"
					x={cx - S * (SHEET_LIMIT + 0.2)}
					y={cy - S * (SHEET_LIMIT + 0.2)}
					width={2 * S * (SHEET_LIMIT + 0.2)}
					height={2 * S * (SHEET_LIMIT + 0.2)}
					rx={6 * u}
				/>
				{#each [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as t (t)}
					<line
						class="grat"
						x1={cx}
						y1={cy}
						x2={cx + S * 3.45 * Math.cos(t * DEG)}
						y2={cy - S * 3.45 * Math.sin(t * DEG)}
					/>
				{/each}
				{#each [1, 2, 3] as r (r)}
					<circle class="grat" {cx} {cy} r={S * r} />
					<text
						class="small dim mid"
						x={cx - S * r * Math.cos(30 * DEG) * 1.0}
						y={cy + S * r * Math.sin(30 * DEG) + 13 * u}>{r} m</text
					>
				{/each}
				<circle class="centre" {cx} {cy} r={2.5 * u} />
				<text class="small dim end" x={cx + S * 3.6} y={cy + 14 * u}>θ = 0</text>
				<text class="small dim start" x={cx + 6 * u} y={cy - S * 3.45}>θ = 90°</text>
				<path class="loop" d={sheetLoop} />
			{/if}

			<!-- the faint copies, the starting arrow, dashed, and the arrow carried round -->
			{#each arrows.faint as a, i (i)}
				{@render drawn(a, 'arrow copy')}
			{/each}
			{#if arrows.start.near}
				{@render drawn(arrows.start, 'arrow start')}
			{/if}
			{#if arrows.moving.near}
				{@render drawn(arrows.moving, 'arrow moving')}
			{/if}
			{#if turnArc?.near}
				{#if turnArc.d}<path class="turn" d={turnArc.d} />{/if}
				<text class="label mid" x={turnArc.x} y={turnArc.y}>{turnArc.text}</text>
			{/if}

			<!-- the corners -->
			{#each handles as q (q.k)}
				<g
					class={['handle', { far: q.z < -0.02 }]}
					transform="translate({f2(q.x)} {f2(q.y)})"
					role="slider"
					tabindex="0"
					aria-label={cornerLabel(q.k)}
					aria-valuemin={0}
					aria-valuemax={surface === 'sphere' ? 180 : 5}
					aria-valuenow={surface === 'sphere'
						? sphere[q.k].th
						: Math.hypot(sheet[q.k].x, sheet[q.k].y)}
					aria-valuetext={cornerText(q.k)}
					onpointerdown={(e) => grab(e, q.k)}
					onkeydown={(e) => cornerKey(e, q.k)}
				>
					<circle class="hit" r={22 * u} />
					<circle class="focus" r={11 * u} />
					<circle class={['knob', { first: q.k === 0 }]} r={(q.k === 0 ? 6.5 : 5.5) * u} />
				</g>
			{/each}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch loop-key"></span><span
					>the loop, {surface === 'sphere' ? 'arcs of great circles' : 'straight segments'}</span
				>
			</li>
			<li><span class="swatch start-key"></span><span>the arrow at the start</span></li>
			<li>
				<span class="swatch arrow-key"></span><span
					>carried round without turning, with copies every {surface === 'sphere'
						? '10°'
						: '0.5 m'}</span
				>
			</li>
			<li>
				<span class="dot-key"></span><span>the first corner, where the arrow starts</span>
			</li>
		</ul>
	</div>

	<div class="bar">
		<Segmented label="Surface" options={VIEWS} bind:value={() => surface, setSurface} />
		<div class="controls">
			<button type="button" class="action" onclick={play}>
				<HugeiconsIcon icon={PlayIcon} size={16} strokeWidth={1.7} />
				Carry the arrow round
			</button>
			<button type="button" class="action" onclick={toggleCorner}>
				{#if count < 4}
					<HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.7} />
					Add a fourth corner
				{:else}
					<HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.7} />
					Remove the fourth corner
				{/if}
			</button>
			<button type="button" class="action" onclick={reset}>
				<HugeiconsIcon icon={RefreshIcon} size={16} strokeWidth={1.7} />
				{surface === 'sphere' ? 'Back to the octant' : 'Back to the first loop'}
			</button>
		</div>
		<p class="hint">
			{#if surface === 'sphere'}
				Drag the sphere to turn it, or reach it with Tab and use the arrow keys. Drag a corner, or
				reach it with Tab and move it 1° of latitude or longitude with the arrow keys (with Shift,
				10°); dragged, it snaps onto the pole and the equator.
			{:else}
				Drag a corner, or reach it with Tab and move it 0.1 m with the arrow keys (with Shift, 0.5
				m). The loop keeps 0.3 m from the centre, where the polar labels fail.
			{/if}
		</p>
	</div>

	<div class="readouts">
		<dl aria-live="polite">
			{#if surface === 'sphere'}
				<div class="row">
					<dt>Turned by</dt>
					<dd>
						{@render eq([
							`${tex(degrees(sphereRead.turn))}^\\circ`
						])}{#if sense(sphereRead.turn)}<span class="also"
								>{sense(sphereRead.turn)}, seen from outside</span
							>{/if}
					</dd>
				</div>
				<div class="row">
					<dt>Area / <Tex math="a^2" /></dt>
					<dd>
						{@render eq([`${tex(degrees(Math.abs(sphereRead.area)))}^\\circ`])}<span class="also"
							>{three(sphereRead.fraction)} of the sphere’s <Tex math="4\pi a^2" />, by Girard’s
							excess{#if sphereRead.crossed}; the loop crosses itself, so its lobes count with their
								senses{/if}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Difference</dt>
					<dd>
						{@render eq([`${tex(degrees(sphereRead.difference))}^\\circ`])}<span class="also"
							>zero, to the integration’s accuracy</span
						>
					</dd>
				</div>
			{:else}
				<div class="row">
					<dt>Turned by</dt>
					<dd>
						{@render eq([`${tex(degrees(sheetTurn))}^\\circ`])}<span class="also"
							>the arrow comes home unturned</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Curvature × area</dt>
					<dd>
						{@render eq([
							`0 \\times ${tex(three(Math.abs(area)))}\\,\\mathrm{m^2}`,
							'= 0^\\circ'
						])}<span class="also">the sheet is flat</span>
					</dd>
				</div>
				<div class="row">
					<dt>At the first corner</dt>
					<dd>
						{@render eq([
							`${GAMMA} = -r`,
							`= ${tex(fixed(christoffel.rThTh, 2))}\\,\\mathrm{m}`
						])}<span class="also"
							>not zero, and <Tex
								math={`\\Gamma^\\theta{}_{r\\theta} = 1/r = ${tex(three(christoffel.thRTh))}\\,\\mathrm{m^{-1}}`}
							/></span
						>
					</dd>
				</div>
				<div class="row">
					<dt>Polar components</dt>
					<dd>
						<span class="also"
							><Tex math={`(${V}^r, ${V}^\\theta)`} trust /> at the corners in turn:
							{#each sheetRead.corners.slice(0, -1) as idx, k (k)}{@const s =
									sheetRead.samples[idx]}{k ? ', ' : ''}<Tex
									math={`(${tex(fixed(s.vr, 2))},\\ ${tex(fixed(s.vth, 2))}\\,\\mathrm{m^{-1}})`}
								/>{/each}</span
						>
					</dd>
				</div>
			{/if}
		</dl>
		<p class="note">
			{#if surface === 'sphere'}
				The arrow is carried by integrating <Tex
					math={`\\mathrm{d}${V}/\\mathrm{d}t = -(${V}\\cdot\\mathrm{d}n/\\mathrm{d}t)\\,n`}
					trust
				/> along each side, with <Tex math="n" /> the outward normal: fourth-order Runge–Kutta in steps
				of at most 0.5°, never renormalized. The area is Girard’s excess, the sum of the loop’s corner
				angles less <Tex math="(N - 2)\pi" /> for <Tex math="N" /> corners, times <Tex
					math="a^2"
				/>. An angle after a loop is known only up to whole turns, so the turn shown is the one
				nearest the area. Seen from outside, a loop run anticlockwise turns the arrow anticlockwise,
				as <Tex
					math={`\\delta ${V}^\\alpha = -${R}^\\alpha{}_{\\beta\\gamma\\delta}\\,${V}^\\beta s^\\gamma q^\\delta`}
					trust
				/> gives for a small loop first south, then east.
			{:else}
				The components are integrated in the polar labels, <Tex
					math={`\\mathrm{d}${V}^r/\\mathrm{d}s = -${GAMMA}\\,${V}^\\theta\\,\\mathrm{d}\\theta/\\mathrm{d}s`}
					trust
				/> and <Tex
					math={`\\mathrm{d}${V}^\\theta/\\mathrm{d}s = -\\Gamma^\\theta{}_{r\\theta}(${V}^r\\,\\mathrm{d}\\theta/\\mathrm{d}s + ${V}^\\theta\\,\\mathrm{d}r/\\mathrm{d}s)`}
					trust
				/>, by fourth-order Runge–Kutta, and the arrow is rebuilt from them in fixed straight axes.
				The components change, the arrow does not: <Tex
					math={`${R}^r{}_{\\theta r\\theta} = 0`}
					trust
				/>.
			{/if}
		</p>
	</div>
</div>

<style>
	.carry-around {
		/* the arrow in the observer's colour, the loop in the curvature's, as the chapter colours them */
		--obs: var(--q-obs);
		--curv: var(--q-curv);
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
		/* the open drawing lets a finger scroll the page; the sphere and the handles take a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .handle,
	svg.turning,
	svg.turning .globe {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
		pointer-events: none;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
	}

	.label {
		font-size: calc(12px * var(--u, 1));
		font-weight: 600;
		fill: var(--text);
		font-variant-numeric: tabular-nums;
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.name {
		fill: var(--text);
		font-weight: 600;
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

	.shade-0 {
		stop-color: color-mix(in srgb, var(--text) 3%, var(--bg-raised));
	}

	.shade-1 {
		stop-color: color-mix(in srgb, var(--text) 11%, var(--bg-sunken));
	}

	.globe {
		cursor: grab;
		touch-action: none;
	}

	.globe:focus {
		outline: none;
	}

	.globe:focus-visible {
		stroke: var(--accent);
		stroke-width: calc(2px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.rim {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
		pointer-events: none;
	}

	.grat {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 12%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		pointer-events: none;
	}

	.grat.strong {
		stroke: color-mix(in srgb, var(--text) 42%, transparent);
	}

	.plane {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.centre {
		fill: var(--text-faint);
	}

	.loop {
		fill: none;
		stroke: var(--curv);
		stroke-width: calc(2.4px * var(--u, 1));
		stroke-linejoin: round;
		stroke-linecap: round;
		pointer-events: none;
	}

	.loop.far {
		stroke: color-mix(in srgb, var(--curv) 45%, transparent);
		stroke-width: calc(1.4px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.arrow {
		pointer-events: none;
	}

	.arrow path {
		fill: none;
		stroke: var(--obs);
		stroke-width: calc(2px * var(--u, 1));
		stroke-linecap: round;
	}

	.arrow polygon {
		fill: var(--obs);
	}

	.arrow.copy {
		opacity: 0.3;
	}

	.arrow.copy path {
		stroke-width: calc(1.3px * var(--u, 1));
	}

	.arrow.start path {
		stroke-dasharray: calc(3.5px * var(--u, 1)) calc(2.5px * var(--u, 1));
		stroke-linecap: butt;
	}

	.arrow.start polygon {
		fill: none;
		stroke: var(--obs);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.arrow.moving path {
		stroke-width: calc(2.6px * var(--u, 1));
	}

	.turn {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
		pointer-events: none;
	}

	.handle {
		cursor: grab;
		touch-action: none;
	}

	.handle.far {
		opacity: 0.35;
		pointer-events: none;
	}

	.handle:focus {
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.knob {
		fill: var(--curv);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.6px * var(--u, 1));
	}

	.knob.first {
		fill: var(--bg-sunken);
		stroke: var(--curv);
		stroke-width: calc(2.4px * var(--u, 1));
	}

	@media (hover: hover) {
		.handle:hover .knob {
			stroke: var(--text);
		}
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
		border-top: 2px solid;
	}

	.loop-key {
		border-color: var(--curv);
	}

	.start-key {
		border-top-style: dashed;
		border-color: var(--obs);
	}

	.arrow-key {
		border-color: var(--obs);
	}

	.dot-key {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		border: 2px solid var(--curv);
		background: var(--bg-sunken);
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

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
