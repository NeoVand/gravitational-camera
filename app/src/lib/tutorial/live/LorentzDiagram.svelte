<script lang="ts">
	/**
	 * Chapter 6.1's diagram of space and time. The room's axes x across and ct up, in light-seconds, with the light
	 * lines x = ±ct dashed in the light role's colour; the pixel's axes ct′ and x′, tilted toward them, in the
	 * observer's colour, with their ticks 1 at (sinh η, cosh η) and (cosh η, sinh η). A slider sets the pixel's
	 * rapidity η, from −2 to 2. Two events, A and B, are dragged on a grid of twentieths of a light-second or moved
	 * with the arrow keys; through each are drawn faintly its hyperbola of constant interval from the origin and the
	 * pixel's "now", and a table gives each event's t, x, t′ and x′, the interval between them and which comes first
	 * for the pixel. A second view stacks two boosts, the second by η₂ in the pixel's frame, and shows the axes of
	 * the result at η = ln 2 + η₂, with the speeds added both ways. A third, for chapter 6.2, draws one four-vector a
	 * from the origin, its tip dragged on a grid of hundredths and landing on the light cone within 0.02 of it,
	 * coloured by its kind, with its hyperbola a·a = constant, a table of a^μ and a_μ for the room and for the pixel,
	 * and on request the pixel's four-velocity u and its "now". Everything is exact, from ./lorentz-diagram.ts.
	 * Two predictions at the top are answered once the reader has done what they ask. Nothing moves by itself, so
	 * reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DashboardSpeed02Icon,
		FlashIcon,
		Layers01Icon,
		DashboardSpeed01Icon,
		ArrowUpRight01Icon,
		EyeIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		FLASH_A,
		FLASH_B,
		LN2,
		OPENING,
		RAPIDITY,
		SECOND_START,
		SPAN,
		addSpeeds,
		atFlashes,
		betaFraction,
		etaTex,
		fractionTex,
		gammaFraction,
		gap,
		grid,
		hyper,
		hyperbola,
		interval,
		keyed,
		kind,
		landed,
		moved,
		noteFirst,
		noteSecond,
		order,
		pixel,
		pixelInterval,
		place,
		roomOrder,
		same,
		secondAnswer,
		seen,
		snapped,
		spread,
		three,
		threeTex,
		unitHyperbola,
		KIND_NAMES,
		NULL_START,
		TIP_KEY,
		VECTOR_OPENING,
		boost,
		fourVelocity,
		hyperbolaThrough,
		lowered,
		noteNull,
		noteSimultaneous,
		nullAnswer,
		pixelSquare,
		sameTip,
		simultaneousAnswer,
		square,
		tipAt,
		tipMoved,
		uDot,
		vec,
		vectorKind,
		type Event,
		type FirstSeen,
		type NullSeen,
		type SecondSeen,
		type SimultaneousSeen,
		type Tip
	} from './lorentz-diagram';

	const uid = $props.id();

	// --- the settings ---------------------------------------------------------------------------------------------
	type View = 'one' | 'two' | 'vectors';
	let view = $state<View>('one');
	/** The pixel's rapidity, and in the second view the second boost's, in the pixel's frame. */
	let eta = $state(OPENING.eta);
	let second = $state(OPENING.second);
	let a = $state<Event>(OPENING.a);
	let b = $state<Event>(OPENING.b);

	function setEta(v: number) {
		const next = landed(v);
		if (next === eta) return;
		eta = next;
		note(false);
	}

	function setSecond(v: number) {
		second = landed(v);
	}

	/** The third view keeps its own rapidity, its vector and whether the pixel's four-velocity is drawn. */
	let veta = $state(VECTOR_OPENING.eta);
	let tip = $state<Tip>(VECTOR_OPENING.a);
	let observer = $state(false);

	function setVeta(v: number) {
		const next = landed(v);
		if (next === veta) return;
		veta = next;
		noteVectors(true);
	}

	function setTip(t: Tip) {
		if (sameTip(tip, t)) return;
		tip = t;
		noteVectors(false);
	}

	function setEvent(which: 'A' | 'B', e: Event) {
		const before = which === 'A' ? a : b;
		if (same(before, e)) return;
		if (which === 'A') a = e;
		else b = e;
		note(true);
	}

	function flashes() {
		const was = atFlashes(a, b);
		a = FLASH_A;
		b = FLASH_B;
		if (!was) note(true);
	}

	/** The arrow keys step a slider by 0.05 of rapidity, and Page Up and Page Down by 0.5. */
	function sliderKeys(get: () => number, set: (v: number) => void) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			const d = {
				ArrowRight: 1,
				ArrowUp: 1,
				ArrowLeft: -1,
				ArrowDown: -1,
				PageUp: RAPIDITY.page / RAPIDITY.key,
				PageDown: -RAPIDITY.page / RAPIDITY.key
			}[e.key];
			if (d === undefined) return;
			e.preventDefault();
			set(keyed(get(), Math.sign(d), Math.abs(d) * RAPIDITY.key));
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2>(1);
	let first = $state<FirstSeen>({ rest: false, done: false });
	let found = $state<SecondSeen>({
		...SECOND_START,
		orders: [order(OPENING.eta, OPENING.a, OPENING.b)]
	});
	const revealed = $derived(step === 1 ? first.done : found.done !== undefined);

	function note(movedEvents: boolean) {
		first = noteFirst(first, eta, a, b);
		found = noteSecond(found, eta, a, b, movedEvents);
	}

	const answer2 = $derived(found.done ? secondAnswer(found.done.a, found.done.b) : undefined);

	// the third view's two
	let vstep = $state<1 | 2>(1);
	let nullSeen = $state<NullSeen>(noteNull(NULL_START, VECTOR_OPENING.eta, VECTOR_OPENING.a));
	let simSeen = $state<SimultaneousSeen>(undefined);
	const vrevealed = $derived(vstep === 1 ? nullSeen.done !== undefined : simSeen !== undefined);

	function noteVectors(boosted: boolean) {
		nullSeen = noteNull(nullSeen, veta, tip);
		simSeen = noteSimultaneous(simSeen, veta, tip, boosted);
	}

	const vanswer1 = $derived(nullSeen.done ? nullAnswer(nullSeen.done) : undefined);
	const vanswer2 = $derived(simSeen ? simultaneousAnswer(simSeen) : undefined);

	// --- the numbers ------------------------------------------------------------------------------------------------
	const ETA = '\\htmlClass{q-obs}{\\eta}';
	const BETA = '\\htmlClass{q-obs}{\\beta}';
	const GAMMA = '\\htmlClass{q-obs}{\\gamma}';
	const UNIT_S = '\\,\\mathrm{s}';
	const UNIT_LS = '\\,\\mathrm{ls}';
	const UNIT_LS2 = '\\,\\mathrm{ls^2}';

	const p = $derived(pixel(eta));
	const h = $derived(hyper(eta));
	const pa = $derived(seen(eta, a));
	const pb = $derived(seen(eta, b));
	const ra = $derived(place(a));
	const rb = $derived(place(b));
	const dtPrime = $derived(gap(eta, a, b));
	const ord = $derived(order(eta, a, b));
	const roomOrd = $derived(roomOrder(a, b));
	const s = $derived(interval(a, b));
	const sPrime = $derived(pixelInterval(eta, a, b));
	const k = $derived(kind(a, b));

	const kindWords = $derived(
		k === 'space'
			? 'It is positive: light cannot go from one to the other.'
			: k === 'light'
				? 'It is zero: a flash of light can go from one to the other.'
				: k === 'time'
					? 'It is negative: a clock moving slower than light can go from one to the other.'
					: 'It is zero: A and B are one event.'
	);

	// the second view
	const total = $derived(LN2 + second);
	const p1 = pixel(LN2);
	const p2 = $derived(pixel(second));
	const pt = $derived(pixel(total));
	const sum = $derived(addSpeeds(p1.beta, p2.beta));
	const newton = $derived(p1.beta + p2.beta);

	// the third view
	const vp = $derived(pixel(veta));
	const vh = $derived(hyper(veta));
	const av = $derived(vec(tip));
	const al = $derived(lowered(av));
	const ap = $derived(boost(veta, av));
	const apl = $derived(lowered(ap));
	const aa = $derived(square(tip));
	const aaPrime = $derived(pixelSquare(veta, tip));
	const vk = $derived(vectorKind(tip));
	const ua = $derived(uDot(veta, tip));
	const uv = $derived(fourVelocity(veta));
	/** A pair of components, (time, x), to three figures. */
	const pair = (q: { ct: number; x: number }) => `(${three(q.ct)}, ${three(q.x)})`;
	const VEC_U = '\\htmlClass{q-obs}{u}';

	// --- the drawing ------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const box = $derived(
		phone.current
			? { W: 360, left: 8, top: 24, right: 30, bottom: 8 }
			: { W: 560, left: 10, top: 26, right: 34, bottom: 10 }
	);
	const P = $derived(box.W - box.left - box.right);
	const H = $derived(box.top + P + box.bottom);
	const scale = $derived(P / (2 * SPAN));
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);
	const X = (x: number) => box.left + (x + SPAN) * scale;
	const Y = (ct: number) => box.top + (SPAN - ct) * scale;
	const path = (pts: { ct: number; x: number }[]) =>
		pts.map((q, i) => `${i ? 'L' : 'M'}${f2(X(q.x))},${f2(Y(q.ct))}`).join('');
	/** A line through the drawing, from one end of its span to the other. */
	const line = (q: { ct: number; x: number }[]) => path(q);

	/** The axes of a frame at rapidity e: its time axis x′ = 0 and its space axis t′ = 0, edge to edge. */
	function axes(e: number) {
		const t = hyper(e).tanh;
		return {
			time: line([
				{ ct: -SPAN, x: -SPAN * t },
				{ ct: SPAN, x: SPAN * t }
			]),
			space: line([
				{ ct: -SPAN * t, x: -SPAN },
				{ ct: SPAN * t, x: SPAN }
			]),
			tanh: t
		};
	}

	/** The rapidity of the pixel's axes in each view: its own slider's, and ln 2 under the second boost. */
	const frameEta = $derived(view === 'one' ? eta : view === 'vectors' ? veta : LN2);
	const mine = $derived(axes(frameEta));
	const theirs = $derived(axes(total));

	/** A tick 1 on a frame's axes: on the time axis at (sinh, cosh), along the space axis, and the other way round. */
	function ticks(e: number) {
		const { cosh, sinh } = hyper(e);
		const n = Math.hypot(cosh, sinh);
		// screen directions of the frame's space and time axes
		const sx = { x: cosh / n, y: -sinh / n };
		const tx = { x: sinh / n, y: -cosh / n };
		const len = 5 * u;
		const tT = { x: X(sinh), y: Y(cosh) };
		const tS = { x: X(cosh), y: Y(sinh) };
		const inside = (q: { x: number; y: number }) =>
			q.x >= box.left - 0.5 &&
			q.x <= box.left + P + 0.5 &&
			q.y >= box.top - 0.5 &&
			q.y <= box.top + P + 0.5;
		return {
			time: inside(tT)
				? {
						d: `M${f2(tT.x - sx.x * len)},${f2(tT.y - sx.y * len)}L${f2(tT.x + sx.x * len)},${f2(tT.y + sx.y * len)}`,
						at: tT,
						label: { x: tT.x + sx.x * 13 * u, y: tT.y + sx.y * 13 * u + 4 * u }
					}
				: undefined,
			space: inside(tS)
				? {
						d: `M${f2(tS.x - tx.x * len)},${f2(tS.y - tx.y * len)}L${f2(tS.x + tx.x * len)},${f2(tS.y + tx.y * len)}`,
						at: tS,
						label: { x: tS.x + tx.x * 13 * u, y: tS.y + tx.y * 13 * u + 4 * u }
					}
				: undefined
		};
	}

	const myTicks = $derived(ticks(frameEta));
	const theirTicks = $derived(ticks(total));

	/** The room's grid and its ticks, at whole light-seconds. */
	const WHOLE = [-2, -1, 1, 2];

	/** The light lines. */
	const light = $derived([
		line([
			{ ct: -SPAN, x: -SPAN },
			{ ct: SPAN, x: SPAN }
		]),
		line([
			{ ct: -SPAN, x: SPAN },
			{ ct: SPAN, x: -SPAN }
		])
	]);

	/** The pixel's "now" through an event: the line of its t′, parallel to the x′ axis. */
	const now = (e: Event) => {
		const { ct, x } = place(e);
		const t = p.beta;
		const reach = SPAN + 2;
		return line([
			{ ct: ct + t * (-reach - x), x: -reach },
			{ ct: ct + t * (reach - x), x: reach }
		]);
	};

	/** An arrow from the origin to a point of the room: its shaft, and its head as a triangle at the point. */
	function arrow(q: { ct: number; x: number }, head = 10) {
		const o = { x: X(0), y: Y(0) };
		const t = { x: X(q.x), y: Y(q.ct) };
		const len = Math.hypot(t.x - o.x, t.y - o.y);
		if (len < 1e-9) return { shaft: '', head: '', at: t, normal: { x: 0, y: -1 } };
		const d = { x: (t.x - o.x) / len, y: (t.y - o.y) / len };
		const n = { x: -d.y, y: d.x };
		const l = Math.min(head * u, len);
		const w = 0.42 * l;
		const base = { x: t.x - d.x * l, y: t.y - d.y * l };
		const end = { x: t.x - d.x * l * 0.7, y: t.y - d.y * l * 0.7 };
		return {
			shaft: `M${f2(o.x)},${f2(o.y)}L${f2(end.x)},${f2(end.y)}`,
			head: `M${f2(t.x)},${f2(t.y)}L${f2(base.x + n.x * w)},${f2(base.y + n.y * w)}L${f2(base.x - n.x * w)},${f2(base.y - n.y * w)}Z`,
			at: t,
			normal: n
		};
	}

	const aArrow = $derived(arrow(av));
	/**
	 * A name beside an arrow, a little back from its point q, on the side `side` picks of the two: so that it sits on
	 * neither the arrow, nor the axis it starts along, nor a tick at its point.
	 */
	function beside(
		a: { normal: { x: number; y: number } },
		q: { x: number; y: number },
		side: (n: { x: number; y: number }) => boolean
	) {
		const n = side(a.normal) ? a.normal : { x: -a.normal.x, y: -a.normal.y };
		// the arrow's own direction on the screen, from its normal
		const d = { x: a.normal.y, y: -a.normal.x };
		return {
			x: q.x - d.x * 16 * u + n.x * 10 * u,
			y: q.y - d.y * 16 * u + n.y * 10 * u + 4 * u
		};
	}

	/** The name a beside the tip, above the arrow (left of it when it is upright). */
	const aLabel = $derived(
		beside(aArrow, aArrow.at, (n) => n.y < -1e-9 || (Math.abs(n.y) <= 1e-9 && n.x < 0))
	);
	const uArrow = $derived(arrow(uv));
	/**
	 * The name u along the four-velocity, inside the drawing however long it is, on its left: the tick 1 of the axis
	 * ct′ at its point has its label on the right.
	 */
	const uLabel = $derived.by(() => {
		const k = Math.min(1, (SPAN - 0.3) / Math.max(Math.abs(uv.x), Math.abs(uv.ct)));
		return beside(uArrow, { x: X(uv.x * k), y: Y(uv.ct * k) }, (n) => n.x < 0);
	});
	/** The name of the pixel's "now", below its line near the right edge. */
	const nowLabel = $derived.by(() => {
		const k = (SPAN - 0.55) / Math.max(Math.abs(vh.cosh), Math.abs(vh.sinh));
		return { x: X(vh.cosh * k), y: Y(vh.sinh * k) + 15 * u };
	});
	const vecHyperbola = $derived(path(hyperbolaThrough(av, aa)));

	const curves = $derived({
		a: path(hyperbola(a)),
		b: path(hyperbola(b)),
		nowA: now(a),
		nowB: now(b),
		time: path(unitHyperbola('time')),
		space: path(unitHyperbola('space'))
	});

	// the labels in the margins: the time axes and "light" along the top, the space axes down the right
	const charW = $derived(6.6 * u);
	const topLabels = $derived.by(() => {
		const items = [
			{ key: 'ct', text: '', at: X(0), size: 2 * charW + 4 * u, cls: 'room' },
			{ key: 'light', text: 'light', at: X(SPAN), size: 5 * charW, cls: 'light-words' },
			{ key: 'ct1', text: '′', at: X(SPAN * mine.tanh), size: 3 * charW, cls: 'obs-words' }
		];
		if (view === 'two')
			items.push({
				key: 'ct2',
				text: '″',
				at: X(SPAN * theirs.tanh),
				size: 3 * charW,
				cls: 'obs-words'
			});
		const at = spread(items, 2, box.W - 2, 5 * u);
		return items.map((item, i) => ({ ...item, x: at[i] }));
	});
	const rightLabels = $derived.by(() => {
		const items = [
			{ key: 'x', text: '', at: Y(0), size: 12 * u, cls: 'room' },
			{ key: 'x1', text: '′', at: Y(SPAN * mine.tanh), size: 12 * u, cls: 'obs-words' }
		];
		if (view === 'two')
			items.push({
				key: 'x2',
				text: '″',
				at: Y(SPAN * theirs.tanh),
				size: 12 * u,
				cls: 'obs-words'
			});
		const at = spread(items, box.top - 4 * u, box.top + P + box.bottom, 3 * u);
		return items.map((item, i) => ({ ...item, y: at[i] }));
	});

	// --- dragging the events --------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	let dragging = $state<'A' | 'B' | 'a' | undefined>();

	function roomAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { ct: SPAN - (q.y - box.top) / scale, x: (q.x - box.left) / scale - SPAN };
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) {
				const q = roomAt(pending);
				if (q) {
					if (dragging === 'a') setTip(tipAt(q));
					else setEvent(dragging, snapped(q));
				}
			}
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, which: 'A' | 'B' | 'a') {
		if (e.button !== 0) return;
		// a drag is not a click: the event does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = which;
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release() {
		dragging = undefined;
	}

	function key(e: KeyboardEvent, which: 'A' | 'B') {
		const n = e.shiftKey ? 5 : 1;
		const d = {
			ArrowLeft: [0, -n],
			ArrowRight: [0, n],
			ArrowUp: [n, 0],
			ArrowDown: [-n, 0]
		}[e.key];
		if (!d) return;
		e.preventDefault();
		setEvent(which, moved(which === 'A' ? a : b, d[0], d[1]));
	}

	function tipKey(e: KeyboardEvent) {
		const n = e.shiftKey ? TIP_KEY.shift : TIP_KEY.step;
		const d = {
			ArrowLeft: [0, -n],
			ArrowRight: [0, n],
			ArrowUp: [n, 0],
			ArrowDown: [-n, 0]
		}[e.key];
		if (!d) return;
		e.preventDefault();
		setTip(tipMoved(tip, d[0], d[1]));
	}

	// --- the words --------------------------------------------------------------------------------------------------
	const etaWords = (v: number) => {
		const t = etaTex(v);
		return t.replace('\\ln ', 'ln ').replace(/-/g, '−');
	};

	const eventLabel = (which: 'A' | 'B') => {
		const e = which === 'A' ? a : b;
		const r = place(e);
		const q = seen(eta, e);
		return `Event ${which}, at t = ${grid(r.ct)} seconds and x = ${grid(r.x)} light-seconds in the room; for the pixel, t′ = ${three(q.ct)} seconds and x′ = ${three(q.x)} light-seconds. Drag it, or move it a twentieth of a light-second with the arrow keys (with Shift, a quarter).`;
	};

	const kindName = $derived(KIND_NAMES[vk]);

	const tipLabel = $derived(
		`The tip of the arrow a, at x = ${three(av.x)} and ct = ${three(av.ct)} light-seconds in the room: ${kindName}, a·a = ${three(aa)} light-seconds squared. For the pixel, a′⁰ = ${three(ap.ct)} and a′¹ = ${three(ap.x)}. Drag it, or move it a twentieth of a light-second with the arrow keys (with Shift, a quarter); within 0.02 light-seconds of a light line it lands on it.`
	);

	const description = $derived(
		view === 'vectors'
			? `A diagram of space and time: the room's x across and ct upward, in light-seconds, with the light lines at 45 degrees, and the pixel's axes ct′ and x′ at the rapidity ${etaWords(veta)}, beta ${three(vp.beta)}. ` +
					`An arrow a from the origin to x = ${three(av.x)}, ct = ${three(av.ct)}: ${kindName}, with a·a = ${three(aa)} light-seconds squared for the room and for the pixel alike. ` +
					`For the pixel its components are a′⁰ = ${three(ap.ct)} and a′¹ = ${three(ap.x)}.` +
					(observer
						? ` The pixel's four-velocity u points to x = ${three(uv.x)}, ct = ${three(uv.ct)} in units of c, and its "now" is the line of the x′ axis; u·a = ${three(ua)} c light-seconds.`
						: '')
			: view === 'one'
				? `A diagram of space and time: the room's x across and ct upward, in light-seconds, with the light lines at 45 degrees. The pixel moves at the rapidity ${etaWords(eta)}, beta ${three(p.beta)}; its axes ct′ and x′ are tilted toward the light lines. ` +
					`A is at t = ${grid(ra.ct)} s, x = ${grid(ra.x)}; B at t = ${grid(rb.ct)} s, x = ${grid(rb.x)}. For the pixel, t′ is ${three(pa.ct)} s for A and ${three(pb.ct)} s for B: ${ord}. The interval between them is ${three(s)} light-seconds squared.`
				: `A diagram of space and time with two boosts: the pixel's axes at the rapidity ln 2, 0.6 of the speed of light, and a second frame's axes after a further boost of ${etaWords(second)} in the pixel's frame, at the rapidity ${etaWords(total)} in the room, beta ${three(pt.beta)}. Each frame's tick 1 lies on the hyperbolas minus c squared t squared plus x squared equal to plus or minus one light-second squared.`
	);

	const VIEWS: { value: View; label: string; icon: typeof Layers01Icon }[] = [
		{ value: 'one', label: 'One boost', icon: DashboardSpeed01Icon },
		{ value: 'two', label: 'Two boosts', icon: Layers01Icon },
		{ value: 'vectors', label: 'Vectors', icon: ArrowUpRight01Icon }
	];
</script>

{#snippet eq(parts: string[])}<span class="eq"
		>{#each parts as part, i (i)}<Tex
				math={i && part.startsWith('=') ? `{}${part}` : part}
				trust
			/>{/each}</span
	>{/snippet}

<div class="lorentz-diagram">
	<section class="predict" aria-labelledby="{uid}-predict">
		{#if view === 'vectors'}
			<div class="steps">
				<span class="tag" id="{uid}-predict">Predict</span>
				<div class="pick" role="group" aria-label="Prediction">
					{#each [1, 2] as const as n (n)}
						<button type="button" aria-pressed={vstep === n} onclick={() => (vstep = n)}>{n}</button
						>
					{/each}
				</div>
			</div>
			<p class="question">
				{#if vstep === 1}
					Boost a null vector. Can its time component become zero?
				{:else}
					Boost a space-like vector until its time component vanishes. In which frame are its two
					ends simultaneous?
				{/if}
			</p>
			<p class={['answer', { shown: vrevealed }]} aria-live="polite">
				{#if vrevealed && vstep === 1 && vanswer1}
					<strong>No.</strong> A null vector stays on the light cone, and a boost along its
					direction only stretches or shrinks it, by <Tex math={`e^{\\mp${ETA}}`} trust />. With <Tex
						math="a^1 = \pm a^0"
					/>, the pixel’s <Tex
						math={`a'^0 = ${GAMMA}(a^0 - ${BETA}a^1) = ${GAMMA}(1 \\mp ${BETA})\\,a^0 = e^{\\mp${ETA}}a^0`}
						trust
					/>, and the same factor multiplies <Tex math="a^1" />: it is never zero, so the time
					component vanishes only for the zero vector. Yours, <Tex
						math={`(a^0, a^1) = (${threeTex(vanswer1.ct)}, ${threeTex(vanswer1.x)})${UNIT_LS}`}
					/>, {vanswer1.along ? 'along' : 'against'} the pixel’s motion, had <Tex
						math={`a'^0 = ${threeTex(vanswer1.lo.ct)}${UNIT_LS}`}
					/> at <Tex math={`${ETA} = ${threeTex(vanswer1.lo.eta)}`} trust /> and <Tex
						math={`${threeTex(vanswer1.hi.ct)}${UNIT_LS}`}
					/> at <Tex math={`${ETA} = ${threeTex(vanswer1.hi.eta)}`} trust />, with <Tex
						math="a\cdot a = 0"
					/> throughout.
					<button type="button" class="next" onclick={() => (vstep = 2)}>Next prediction</button>
				{:else if vrevealed && vanswer2}
					<strong>In the frame with <Tex math={`${BETA} = c\\Delta t/\\Delta x`} trust />,</strong>
					for which the vector lies on the pixel’s “now”. The pixel’s <Tex
						math={`a'^0 = ${GAMMA}(c\\Delta t - ${BETA}\\Delta x)`}
						trust
					/> is zero there, a speed below light’s because <Tex math="c|\Delta t| \lt |\Delta x|" /> for
					a space-like vector; for <Tex math="(x, ct) = (1, 0.5)" /> that is <Tex
						math={`${BETA} = 0.5`}
						trust
					/>. Yours, <Tex
						math={`(x, ct) = (${threeTex(vanswer2.x)}, ${threeTex(vanswer2.ct)})${UNIT_LS}`}
					/>, has <Tex math={`c\\Delta t/\\Delta x = ${threeTex(vanswer2.want)}`} />, and you found <Tex
						math={`${BETA} = \\tanh${ETA} = ${threeTex(vanswer2.found)}`}
						trust
					/>, where <Tex math={`a'^0 = ${threeTex(vanswer2.prime)}${UNIT_LS}`} />.
				{:else if vstep === 1}
					The answer appears once you have made a null vector, its tip on a light line, and moved
					the slider across a range of at least 1 in <Tex math={ETA} trust /> while holding it.
				{:else}
					The answer appears once you have moved the slider until a space-like <Tex math="a" />,
					with a time component in the room, has a time component for the pixel within 0.01
					light-seconds of zero.
				{/if}
			</p>
		{:else}
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
					The pixel moves toward the far flash B. Which flash does it call earlier?
				{:else}
					Find a speed at which the order of A and B is reversed. Can you do it for two events that
					light can connect?
				{/if}
			</p>
			<p class={['answer', { shown: revealed }]} aria-live="polite">
				{#if revealed && step === 1}
					<strong>B, by 0.75 s.</strong> The pixel’s clocks beside the two flashes read
					<Tex math="t'_A = 0" /> and <Tex
						math={`t'_B = -${GAMMA}${BETA}\\,\\Delta x/c = -0.75${UNIT_S}`}
						trust
					/>, because at <Tex math={`${ETA} = \\ln 2`} trust /> the product <Tex
						math={`${GAMMA}${BETA} = \\sinh(\\ln 2)`}
						trust
					/> is exactly <Tex math="3/4" /> and <Tex math="\Delta x" /> is one light-second. B lies below
					the pixel’s “now” through A, the tilted dashed line, on the parallel one of
					<Tex math={`t' = -0.75${UNIT_S}`} />. At <Tex math={`${ETA} = 0`} trust /> the two were together,
					as Newton assumed, and for a pixel moving the other way A comes first. These are the readings
					of the pixel’s own clocks beside each flash, so the time light takes to reach the pixel plays
					no part.
					<button type="button" class="next" onclick={() => (step = 2)}>Next prediction</button>
				{:else if revealed && answer2}
					<strong
						>Only when <Tex math="|\Delta x| > c|\Delta t|" />, so never for events light can
						connect.</strong
					>
					<Tex math={`\\Delta t' = ${GAMMA}(\\Delta t - ${BETA}\\Delta x/c)`} trust /> is zero at
					<Tex math={`${BETA} = c\\Delta t/\\Delta x`} trust />, a speed below light’s only when
					<Tex math="|\Delta x| > c|\Delta t|" />: for events on the line of motion, a positive
					interval. For your pair, <Tex math={`\\Delta t = ${threeTex(answer2.dt)}${UNIT_S}`} /> and <Tex
						math={`\\Delta x = ${threeTex(answer2.dx)}${UNIT_LS}`}
					/>, so <Tex
						math={`-c^2\\Delta t^2 + \\Delta x^2 = ${threeTex(answer2.interval)}${UNIT_LS2}`}
					/>, and {answer2.order === 'A first' ? 'A' : 'B'} came first at every
					<Tex math={ETA} trust /> from <Tex math="-2" /> to <Tex math="2" />.
					{#if answer2.kind === 'light'}
						On light’s path <Tex math={`\\Delta t' = \\Delta t\\,e^{\\mp${ETA}}`} trust /> shrinks for
						a faster pixel but is never zero: its least size, at an end of the range, was <Tex
							math={`${threeTex(answer2.least)}${UNIT_S}`}
						/>.
					{:else if answer2.proper}
						<Tex math="|\Delta t'|" /> was never less than <Tex
							math={`${threeTex(answer2.least)}${UNIT_S}`}
						/>, the proper time <Tex math={'\\sqrt{c^2\\Delta t^2 - \\Delta x^2}/c'} /> of a clock that
						goes from one event to the other, which every observer computes alike.
					{:else}
						<Tex math="|\Delta t'|" /> was never less than <Tex
							math={`${threeTex(answer2.least)}${UNIT_S}`}
						/>.
					{/if}
				{:else if step === 1}
					The answer appears once you have set the rapidity to 0, where the pixel is at rest in the
					room, and back to ln 2, with A and B at the two flashes.
				{:else}
					The answer appears once you have reversed the order of two events with the rapidity alone,
					and then, with two events that light can connect, slid the rapidity to both ends of its
					range.
				{/if}
			</p>
		{/if}
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {box.W} {f2(H)}"
			role="group"
			aria-label={description}
			class={{ dragging: dragging !== undefined }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect x={box.left} y={box.top} width={P} height={P} />
				</clipPath>
			</defs>

			<rect class="panel" x={box.left} y={box.top} width={P} height={P} />

			<g clip-path="url(#{uid}-plot)">
				<!-- the room's grid, at whole light-seconds -->
				{#each WHOLE as w (w)}
					<line class="grid" x1={X(w)} x2={X(w)} y1={box.top} y2={box.top + P} />
					<line class="grid" x1={box.left} x2={box.left + P} y1={Y(w)} y2={Y(w)} />
				{/each}

				{#if view === 'one'}
					<!-- each event's hyperbola of constant interval from the origin -->
					<path class="hyperbola" d={curves.a} />
					<path class="hyperbola" d={curves.b} />
				{:else if view === 'vectors'}
					<!-- the hyperbola a·a = constant through the tip; for a null vector, the light lines -->
					<path class="hyperbola" d={vecHyperbola} />
				{:else}
					<!-- the events one light-second from the origin, for every observer -->
					<path class="hyperbola" d={curves.time} />
					<path class="hyperbola" d={curves.space} />
				{/if}

				<!-- the room's axes -->
				<line class="axis" x1={box.left} x2={box.left + P} y1={Y(0)} y2={Y(0)} />
				<line class="axis" x1={X(0)} x2={X(0)} y1={box.top} y2={box.top + P} />

				<!-- the light lines -->
				{#each light as d (d)}
					<path class="light" {d} />
				{/each}

				{#if view === 'one'}
					<!-- the pixel's "now" through each event -->
					<path class="now" d={curves.nowA} />
					<path class="now" d={curves.nowB} />
				{/if}

				<!-- the pixel's axes, and in the second view the axes of the second boost -->
				<g class={['frame', { faint: view === 'two' }]}>
					<path class="obs-line" d={mine.time} />
					<path class="obs-line" d={mine.space} />
					{#if myTicks.time}<path class="obs-tick" d={myTicks.time.d} />{/if}
					{#if myTicks.space}<path class="obs-tick" d={myTicks.space.d} />{/if}
				</g>
				{#if view === 'two'}
					<g class="frame">
						<path class="obs-line" d={theirs.time} />
						<path class="obs-line" d={theirs.space} />
						{#if theirTicks.time}<path class="obs-tick" d={theirTicks.time.d} />{/if}
						{#if theirTicks.space}<path class="obs-tick" d={theirTicks.space.d} />{/if}
					</g>
				{/if}

				{#if view === 'vectors' && observer}
					<!-- the pixel's "now" through the origin, and its four-velocity -->
					<path class="now strong" d={mine.space} />
					<g class="vector observer">
						<path class="shaft" d={uArrow.shaft} />
						<path class="head" d={uArrow.head} />
					</g>
				{/if}
			</g>

			<!-- the room's ticks -->
			{#each WHOLE as w (w)}
				<text class="small dim halo tick-x" x={X(w)} y={Y(0) + 14 * u}
					>{w < 0 ? '−' : ''}{Math.abs(w)}</text
				>
				<text class="small dim halo tick-ct" x={X(0) - 5 * u} y={Y(w) + 4 * u}
					>{w < 0 ? '−' : ''}{Math.abs(w)}</text
				>
			{/each}

			<!-- the ticks 1 of the pixel's axes -->
			{#if view !== 'two'}
				{#if myTicks.time}
					<text class="small obs-words halo mid" x={myTicks.time.label.x} y={myTicks.time.label.y}
						>1</text
					>
				{/if}
				{#if myTicks.space}
					<text class="small obs-words halo mid" x={myTicks.space.label.x} y={myTicks.space.label.y}
						>1</text
					>
				{/if}
			{:else}
				<!-- the three frames' ticks 1, each on the hyperbolas -->
				{#each [{ x: 0, ct: 1 }, { x: 1, ct: 0 }] as q (q.x)}
					<circle class="room-dot" cx={X(q.x)} cy={Y(q.ct)} r={3 * u} />
				{/each}
				{#each [myTicks, theirTicks] as t, i (i)}
					{#each [t.time, t.space] as q, j (j)}
						{#if q}
							<circle class={['obs-dot', { faint: i === 0 }]} cx={q.at.x} cy={q.at.y} r={3 * u} />
						{/if}
					{/each}
				{/each}
			{/if}

			<!-- the names of the axes and of the light lines, in the margins -->
			{#each topLabels as l (l.key)}
				<text
					class={['label mid', l.cls, { faint: view === 'two' && l.key === 'ct1' }]}
					x={l.x}
					y={box.top - 8 * u}
					>{#if l.key === 'light'}light{:else}<tspan class="it">ct</tspan>{l.text}{/if}</text
				>
			{/each}
			{#each rightLabels as l (l.key)}
				<text
					class={['label', l.cls, { faint: view === 'two' && l.key === 'x1' }]}
					x={box.left + P + 6 * u}
					y={l.y + 4 * u}><tspan class="it">x</tspan>{l.text}</text
				>
			{/each}

			<!-- the two events -->
			{#if view === 'one'}
				{#each [{ which: 'A' as const, r: ra }, { which: 'B' as const, r: rb }] as ev (ev.which)}
					<g
						class="event"
						transform="translate({f2(X(ev.r.x))} {f2(Y(ev.r.ct))})"
						role="button"
						tabindex="0"
						aria-roledescription="movable event"
						aria-label={eventLabel(ev.which)}
						onpointerdown={(e) => grab(e, ev.which)}
						onkeydown={(e) => key(e, ev.which)}
					>
						<circle class="hit" r={16 * u} />
						<circle class="focus" r={10 * u} />
						<circle class="dot" r={4.5 * u} />
						<text
							class={['name halo', ev.which === 'A' ? 'end' : 'start']}
							x={(ev.which === 'A' ? -8 : 8) * u}
							y={-7 * u}>{ev.which}</text
						>
					</g>
				{/each}
			{/if}

			<!-- the four-vector a, its tip a handle -->
			{#if view === 'vectors'}
				{#if observer}
					<text class="label obs-words halo mid" x={nowLabel.x} y={nowLabel.y}>now</text>
					<text class="label obs-words halo mid" x={uLabel.x} y={uLabel.y}
						><tspan class="it">u</tspan></text
					>
				{/if}
				<g class={['vector', `kind-${vk}`]}>
					<path class="shaft" d={aArrow.shaft} />
				</g>
				<g
					class={['event', 'tip', `kind-${vk}`]}
					role="button"
					tabindex="0"
					aria-roledescription="movable arrow tip"
					aria-label={tipLabel}
					onpointerdown={(e) => grab(e, 'a')}
					onkeydown={tipKey}
				>
					<circle class="hit" cx={aArrow.at.x} cy={aArrow.at.y} r={16 * u} />
					<circle class="focus" cx={aArrow.at.x} cy={aArrow.at.y} r={12 * u} />
					{#if aArrow.head}
						<path class="head" d={aArrow.head} />
					{:else}
						<circle class="head" cx={aArrow.at.x} cy={aArrow.at.y} r={3.5 * u} />
					{/if}
				</g>
				<text class="label halo mid vector-name" x={aLabel.x} y={aLabel.y}
					><tspan class="it">a</tspan></text
				>
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch room-key"></span><span
					>the room’s axes, <Tex math="x" /> and <Tex math="ct" /></span
				>
			</li>
			<li><span class="swatch light-key"></span><span>light, <Tex math="x = \pm ct" /></span></li>
			{#if view === 'one'}
				<li>
					<span class="swatch obs-key"></span><span
						>the pixel’s axes, <Tex math="x' = 0" /> and <Tex math="t' = 0" /></span
					>
				</li>
				<li>
					<span class="swatch now-key"></span><span>the pixel’s “now” through each event</span>
				</li>
				<li>
					<span class="swatch hyperbola-key"></span><span
						>each event’s <Tex math="-c^2t^2 + x^2" />, held fixed</span
					>
				</li>
			{:else if view === 'vectors'}
				<li>
					<span class="swatch obs-key"></span><span
						>the pixel’s axes, <Tex math="x' = 0" /> and <Tex math="t' = 0" /></span
					>
				</li>
				<li>
					<span class="swatch arrow-key"></span><span
						><Tex math="a" />: <span class="kind-time-words">time-like</span>,
						<span class="kind-null-words">null</span> or space-like</span
					>
				</li>
				<li>
					<span class="swatch hyperbola-key"></span><span
						><Tex math="a\cdot a" /> held fixed (on the light lines when it is zero)</span
					>
				</li>
				{#if observer}
					<li>
						<span class="swatch obs-key"></span><span
							>its four-velocity <Tex math={VEC_U} trust />, along <Tex math="ct'" />, and its
							“now”, along <Tex math="x'" /></span
						>
					</li>
				{/if}
			{:else}
				<li>
					<span class="swatch obs-faint-key"></span><span
						>the pixel’s axes, at <Tex math="\ln 2" /></span
					>
				</li>
				<li>
					<span class="swatch obs-key"></span><span
						>the second boost’s, at <Tex math={`\\ln 2 + ${ETA}_2`} trust /></span
					>
				</li>
				<li>
					<span class="swatch hyperbola-key"></span><span
						><Tex math={'-c^2t^2 + x^2 = \\mp(1\\,\\mathrm{ls})^2'} />, where each frame’s tick 1
						lies</span
					>
				</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<Segmented label="View" options={VIEWS} bind:value={view} />
		<div class="controls">
			{#if view === 'one'}
				<div onkeydowncapture={sliderKeys(() => eta, setEta)} role="presentation">
					<Slider
						id="{uid}-eta"
						label="Rapidity"
						icon={DashboardSpeed02Icon}
						min={RAPIDITY.min}
						max={RAPIDITY.max}
						step={RAPIDITY.step}
						bind:value={() => eta, setEta}
						readout="η = {etaWords(eta)}"
						ends={['−2', '2']}
						marks={[
							{ at: -LN2, label: 'η = −ln 2, 0.6c the other way' },
							{ at: 0, label: 'η = 0, at rest in the room' },
							{ at: LN2, label: 'η = ln 2, the paper’s pixel at 0.6c' },
							{ at: 2 * LN2, label: 'η = ln 4, two boosts of 0.6c' }
						]}
						marksHint="the ticks mark rest, 0.6c either way, and two boosts of 0.6c"
					/>
				</div>
				<button type="button" class="action" onclick={flashes}>
					<HugeiconsIcon icon={FlashIcon} size={16} strokeWidth={1.7} />
					Back to the two flashes
				</button>
			{:else if view === 'vectors'}
				<div onkeydowncapture={sliderKeys(() => veta, setVeta)} role="presentation">
					<Slider
						id="{uid}-veta"
						label="Rapidity"
						icon={DashboardSpeed02Icon}
						min={RAPIDITY.min}
						max={RAPIDITY.max}
						step={RAPIDITY.step}
						bind:value={() => veta, setVeta}
						readout="η = {etaWords(veta)}"
						ends={['−2', '2']}
						marks={[
							{ at: -LN2, label: 'η = −ln 2, 0.6c the other way' },
							{ at: 0, label: 'η = 0, at rest in the room' },
							{ at: LN2, label: 'η = ln 2, the paper’s pixel at 0.6c' },
							{ at: 2 * LN2, label: 'η = ln 4, two boosts of 0.6c' }
						]}
						marksHint="the ticks mark rest, 0.6c either way, and two boosts of 0.6c"
					/>
				</div>
				<button
					type="button"
					class="action"
					aria-pressed={observer}
					onclick={() => (observer = !observer)}
				>
					<HugeiconsIcon icon={EyeIcon} size={16} strokeWidth={1.7} />
					Show observer
				</button>
			{:else}
				<div onkeydowncapture={sliderKeys(() => second, setSecond)} role="presentation">
					<Slider
						id="{uid}-second"
						label="Second boost"
						icon={Layers01Icon}
						min={RAPIDITY.min}
						max={RAPIDITY.max}
						step={RAPIDITY.step}
						bind:value={() => second, setSecond}
						readout="η₂ = {etaWords(second)}"
						ends={['−2', '2']}
						marks={[
							{ at: 0, label: 'η₂ = 0, no second boost' },
							{ at: LN2, label: 'η₂ = ln 2, a second boost of 0.6c' }
						]}
						marksHint="the ticks mark no second boost and a second boost of 0.6c"
					/>
				</div>
			{/if}
		</div>
		<p class="hint">
			{#if view === 'one'}
				Drag A and B, or reach each with Tab and move it a twentieth of a light-second with the
				arrow keys (with Shift, a quarter). The slider takes the arrow keys after Tab, a step of
				0.05 in
				<Tex math={ETA} trust />, and Page Up and Page Down a step of 0.5.
			{:else if view === 'vectors'}
				Drag the tip of <Tex math="a" />, or reach it with Tab and move it a twentieth of a
				light-second with the arrow keys (with Shift, a quarter); within 0.02 light-seconds of a
				light line it lands on it. The slider takes the arrow keys after Tab, a step of 0.05 in <Tex
					math={ETA}
					trust
				/>.
			{:else}
				The first boost is the pixel’s, at <Tex math={`${ETA}_1 = \\ln 2`} trust />. The slider sets
				the second, by <Tex math={`${ETA}_2`} trust /> in the pixel’s frame; the arrow keys step it by
				0.05 after Tab.
			{/if}
		</p>
	</div>

	<div class="readouts">
		{#if view === 'one'}
			<dl>
				<div class="row">
					<dt>The pixel</dt>
					<dd>
						{@render eq([`${ETA} = ${etaTex(eta)}`])}
						{@render eq([`${BETA} = \\tanh${ETA}`, `= ${fractionTex(p.beta, betaFraction(eta))}`])}
						{@render eq([
							`${GAMMA} = \\cosh${ETA}`,
							`= ${fractionTex(h.cosh, gammaFraction(eta))}`
						])}
						{@render eq([`${GAMMA}${BETA} = \\sinh${ETA}`, `= ${threeTex(h.sinh)}`])}
					</dd>
				</div>
				<div class="row">
					<dt>The events</dt>
					<dd>
						<table class="events">
							<thead>
								<tr>
									<th scope="col"></th>
									<th scope="col"><Tex math={`t\\ (\\mathrm{s})`} /></th>
									<th scope="col"><Tex math={`x\\ (\\mathrm{ls})`} /></th>
									<th scope="col"><Tex math={`t'\\ (\\mathrm{s})`} /></th>
									<th scope="col"><Tex math={`x'\\ (\\mathrm{ls})`} /></th>
								</tr>
							</thead>
							<tbody>
								{#each [{ name: 'A', r: ra, q: pa }, { name: 'B', r: rb, q: pb }] as row (row.name)}
									<tr>
										<th scope="row">{row.name}</th>
										<td>{grid(row.r.ct)}</td>
										<td>{grid(row.r.x)}</td>
										<td>{three(row.q.ct)}</td>
										<td>{three(row.q.x)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</dd>
				</div>
				<div class="row">
					<dt>The interval</dt>
					<dd>
						{@render eq([
							"-c^2\\Delta t'^2 + \\Delta x'^2",
							`= ${threeTex(sPrime)}${UNIT_LS2}`
						])}<span class="also"
							>the same as the room’s <Tex
								math={`-c^2\\Delta t^2 + \\Delta x^2 = ${threeTex(s)}${UNIT_LS2}`}
							/> at every <Tex math={ETA} trust />. {kindWords}</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The order</dt>
					<dd aria-live="polite">
						{@render eq([`\\Delta t' = t'_B - t'_A`, `= ${threeTex(dtPrime)}${UNIT_S}`])}<strong
							class="order">{ord === 'together' ? 'together' : ord}</strong
						><span class="also"
							>{#if roomOrd === 'together'}The room finds them together, <Tex
									math="\Delta t = 0"
								/>.{:else}The room finds {roomOrd === 'A first' ? 'A' : 'B'} first, by <Tex
									math={`${threeTex(Math.abs(rb.ct - ra.ct))}${UNIT_S}`}
								/>.{/if}</span
						>
					</dd>
				</div>
			</dl>
			<p class="note">
				Distances are in light-seconds, <Tex
					math={'1\\,\\mathrm{ls} = 2.998\\times10^8\\,\\mathrm{m}'}
				/>, so that <Tex math="c" /> is one light-second a second and <Tex math="ct" />, in
				light-seconds, is the time in seconds. The pixel moves along the room’s <Tex math="x" /> axis,
				and its origin passes the room’s at <Tex math="t = t' = 0" />. Its coordinates are the
				chapter’s Lorentz transformation, <Tex math={`ct' = ${GAMMA}(ct - ${BETA}x)`} trust /> and <Tex
					math={`x' = ${GAMMA}(x - ${BETA}ct)`}
					trust
				/>. The events stand on a grid of twentieths of a light-second, within two light-seconds of
				the origin. The slider lands exactly on <Tex math="0" />, <Tex math="\pm\ln 2" /> and <Tex
					math="\ln 4"
				/> when it passes within 0.0075 of them, and there <Tex math={`${GAMMA}`} trust /> and
				<Tex math={`${BETA}`} trust /> are fractions, from powers of two. Beyond <Tex
					math={`|${ETA}| = 1.45`}
					trust
				/> the pixel’s ticks 1 lie off the drawing. Everything is exact.
			</p>
		{:else if view === 'vectors'}
			<dl>
				<div class="row">
					<dt>The pixel</dt>
					<dd>
						{@render eq([`${ETA} = ${etaTex(veta)}`])}
						{@render eq([
							`${BETA} = \\tanh${ETA}`,
							`= ${fractionTex(vp.beta, betaFraction(veta))}`
						])}
						{@render eq([
							`${GAMMA} = \\cosh${ETA}`,
							`= ${fractionTex(vh.cosh, gammaFraction(veta))}`
						])}
					</dd>
				</div>
				<div class="row">
					<dt>The vector</dt>
					<dd>
						<table class="events vectors">
							<thead>
								<tr>
									<th scope="col"><span class="sr">components</span></th>
									<th scope="col">room</th>
									<th scope="col">pixel</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row"><Tex math={`a^\\mu\\ (\\mathrm{ls})`} /></th>
									<td>{pair(av)}</td>
									<td>{pair(ap)}</td>
								</tr>
								<tr>
									<th scope="row"><Tex math={`a_\\mu\\ (\\mathrm{ls})`} /></th>
									<td>{pair(al)}</td>
									<td>{pair(apl)}</td>
								</tr>
								<tr class="square">
									<th scope="row"><Tex math={`a\\cdot a\\ (\\mathrm{ls^2})`} /></th>
									<td>{three(aa)}</td>
									<td>{three(aaPrime)}</td>
								</tr>
							</tbody>
						</table>
						<span class="also" aria-live="polite"
							><strong class={['kind', `kind-${vk}`]}>{kindName}</strong>{#if vk === 'time'}, <Tex
									math="a\cdot a \lt 0"
								/>: a clock moving slower than light can go along it.{:else if vk === 'null'}, <Tex
									math="a\cdot a = 0"
								/>: a flash of light can go along it.{:else if vk === 'space'}, <Tex
									math="a\cdot a \gt 0"
								/>: no clock can be present at both its ends.{:else}, of no kind.{/if} Every observer
							computes the same <Tex math="a\cdot a" />.</span
						>
					</dd>
				</div>
				{#if observer}
					<div class="row">
						<dt>The observer</dt>
						<dd>
							{@render eq([
								`${VEC_U}^\\mu = (\\cosh${ETA}, \\sinh${ETA})\\,c`,
								`= (${threeTex(uv.ct)}, ${threeTex(uv.x)})\\,c`
							])}
							{@render eq([
								`${VEC_U}\\cdot a = c\\,(-${threeTex(uv.ct)}\\,a^0 + ${threeTex(uv.x)}\\,a^1)`,
								`= ${threeTex(ua)}\\,c\\,\\mathrm{ls}`
							])}<span class="also"
								>which is <Tex math="-c\,a'^0" />, zero exactly when <Tex math="a" /> lies on the pixel’s
								“now”.</span
							>
						</dd>
					</div>
				{/if}
			</dl>
			<p class="note">
				The arrow <Tex math="a" /> is the step from the origin to its tip, with <Tex
					math="a^\mu = (a^0, a^1) = (ct, x)"
				/> in light-seconds, listed as (time, <Tex math="x" />). The pixel’s column holds its <Tex
					math="a'^\mu"
				/>, by the chapter’s boost, and lowering an index changes only the sign of time, <Tex
					math="a_\mu = (-a^0, a^1)"
				/>. The pixel’s <Tex math="a'\cdot a'" /> is formed from its own components and agrees with the
				room’s. The tip stands on a grid of hundredths of a light-second, within two light-seconds of
				the origin, and its kind is decided on that grid. The four-velocity <Tex
					math={VEC_U}
					trust
				/>, in units of
				<Tex math="c" />, ends on the hyperbola <Tex
					math={`${VEC_U}\\cdot ${VEC_U} = -c^2`}
					trust
				/>; its “now” is the pixel’s axis <Tex math="x'" />.
			</p>
		{:else}
			<dl>
				<div class="row">
					<dt>The first boost</dt>
					<dd>
						{@render eq([`${ETA}_1 = ${etaTex(LN2)}`])}
						{@render eq([`${BETA}_1 = ${fractionTex(p1.beta, betaFraction(LN2))}`])}<span
							class="also">the pixel, through the room</span
						>
					</dd>
				</div>
				<div class="row">
					<dt>The second boost</dt>
					<dd>
						{@render eq([`${ETA}_2 = ${etaTex(second)}`])}
						{@render eq([
							`${BETA}_2 = \\tanh${ETA}_2`,
							`= ${fractionTex(p2.beta, betaFraction(second))}`
						])}<span class="also">a body, through the pixel’s frame</span>
					</dd>
				</div>
				<div class="row">
					<dt>Rapidities add</dt>
					<dd>
						{@render eq([`${ETA} = ${ETA}_1 + ${ETA}_2`, `= ${etaTex(total)}`])}
						{@render eq([
							`${BETA} = \\tanh${ETA}`,
							`= ${fractionTex(pt.beta, betaFraction(total))}`
						])}
						{@render eq([
							`${GAMMA} = \\cosh${ETA}`,
							`= ${fractionTex(pt.gamma, gammaFraction(total))}`
						])}<span class="also">the body, through the room</span>
					</dd>
				</div>
				<div class="row">
					<dt>Speeds do not</dt>
					<dd>
						{@render eq([
							`\\dfrac{${BETA}_1 + ${BETA}_2}{1 + ${BETA}_1${BETA}_2}`,
							`= \\dfrac{${threeTex(newton)}}{${threeTex(1 + p1.beta * p2.beta)}}`,
							`= ${threeTex(sum)}`
						])}<span class="also"
							>the chapter’s rule for adding speeds, the same as <Tex
								math={`\\tanh${ETA}`}
								trust
							/>; Newton’s sum would be <Tex
								math={`${BETA}_1 + ${BETA}_2 = ${threeTex(newton)}`}
								trust
							/>{#if newton > 1}, faster than light{/if}.</span
						>
					</dd>
				</div>
			</dl>
			<p class="note">
				A body moves at <Tex math={`${BETA}_2c`} trust /> through the pixel’s frame, and the pixel at
				<Tex math={`${BETA}_1c = 0.6c`} trust /> through the room. The faint axes are the pixel’s,
				<Tex math="ct'" /> and <Tex math="x'" />; the full ones the body’s, <Tex math="ct''" /> and
				<Tex math="x''" />, which the room finds at the rapidity <Tex
					math={`${ETA}_1 + ${ETA}_2`}
					trust
				/>: the two boosts, one after the other, are one boost of the summed rapidity. Each frame’s
				tick 1 lies on the same hyperbolas, so the steps between the ticks are equal in rapidity
				though they look unequal on the page. No number of boosts reaches the speed of light, since
				each adds a finite rapidity. Everything is exact.
			</p>
		{/if}
	</div>
</div>

<style>
	.lorentz-diagram {
		/* the pixel's axes in the observer's colour and the light lines in light's, as the chapter colours β, γ, η and
		   light; the room's axes, the events and the hyperbolas in the ink */
		--obs: var(--q-obs);
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
		/* the open drawing lets a finger scroll the page; only the events take a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .event {
		cursor: grabbing;
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

	.tick-x {
		text-anchor: middle;
	}

	.tick-ct {
		text-anchor: end;
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

	text.obs-words {
		fill: var(--obs);
	}

	text.light-words {
		fill: var(--light);
		font-style: italic;
		font-family: var(--font-serif);
	}

	text.faint {
		opacity: 0.6;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.axis {
		stroke: color-mix(in srgb, var(--text) 70%, transparent);
		stroke-width: calc(1.1px * var(--u, 1));
	}

	.light {
		fill: none;
		stroke: var(--light);
		stroke-width: calc(1.3px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(4px * var(--u, 1));
	}

	.hyperbola {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.now {
		fill: none;
		stroke: color-mix(in srgb, var(--obs) 75%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.obs-line {
		fill: none;
		stroke: var(--obs);
		stroke-width: calc(1.7px * var(--u, 1));
	}

	.obs-tick {
		fill: none;
		stroke: var(--obs);
		stroke-width: calc(1.7px * var(--u, 1));
		stroke-linecap: round;
	}

	.frame.faint {
		opacity: 0.45;
	}

	.room-dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.obs-dot {
		fill: var(--obs);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.obs-dot.faint {
		opacity: 0.55;
	}

	.event {
		cursor: grab;
		touch-action: none;
	}

	.event:focus {
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

	.event:focus-visible .focus {
		opacity: 1;
	}

	.dot {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	/* the four-vector a, coloured by its kind: the observer's colour if time-like, light's if null, ink if space-like */
	.kind-time {
		--kind: var(--obs);
	}

	.kind-null {
		--kind: var(--light);
	}

	.kind-space,
	.kind-zero {
		--kind: var(--text);
	}

	.vector.observer {
		--kind: var(--obs);
	}

	.shaft {
		fill: none;
		stroke: var(--kind);
		stroke-width: calc(2.2px * var(--u, 1));
		stroke-linecap: round;
	}

	.head {
		fill: var(--kind);
		stroke: var(--bg-sunken);
		stroke-width: calc(0.8px * var(--u, 1));
		stroke-linejoin: round;
	}

	.now.strong {
		stroke: var(--obs);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	text.vector-name {
		fill: var(--text);
	}

	.name {
		fill: var(--text);
		font: 600 calc(12px * var(--u, 1)) / 1 var(--font-sans);
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

	.room-key {
		border-color: color-mix(in srgb, var(--text) 70%, transparent);
	}

	.light-key {
		border-top-style: dashed;
		border-color: var(--light);
	}

	.obs-key {
		border-top-width: 2px;
		border-color: var(--obs);
	}

	.obs-faint-key {
		border-top-width: 2px;
		border-color: color-mix(in srgb, var(--obs) 45%, transparent);
	}

	.now-key {
		border-top-style: dashed;
		border-top-width: 1px;
		border-color: var(--obs);
	}

	.arrow-key {
		border-top-width: 2px;
		border-color: var(--text);
	}

	.kind-time-words {
		color: var(--obs);
	}

	.kind-null-words {
		color: var(--light);
	}

	.hyperbola-key {
		border-top-style: dotted;
		border-color: var(--text-dim);
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
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.7rem 1.4rem;
		align-items: center;
	}

	.controls:has(> :only-child) {
		grid-template-columns: minmax(0, 1fr);
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

	.order {
		font-weight: 600;
		color: var(--text);
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	/* the chapter's own tables are styled for the text: this one keeps its own */
	.events {
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
		margin: 0;
		width: auto;
	}

	.events th,
	.events td {
		padding: 0.1rem 0.9rem 0.1rem 0;
		border: 0;
		background: none;
		text-align: right;
		font-weight: 400;
	}

	.events thead th {
		color: var(--text-dim);
		border-bottom: 1px solid var(--line);
	}

	.events tbody th {
		text-align: left;
		font-weight: 600;
		color: var(--text);
	}

	.vectors td {
		white-space: nowrap;
	}

	.vectors .square th,
	.vectors .square td {
		border-top: 1px solid var(--line);
	}

	strong.kind {
		font-weight: 600;
		color: var(--text);
	}

	strong.kind-time {
		color: var(--obs);
	}

	strong.kind-null {
		color: var(--light);
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

		.action {
			justify-self: start;
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.events th,
		.events td {
			padding-right: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.action {
			transition: none;
		}
	}
</style>
