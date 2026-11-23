<script lang="ts">
	/**
	 * Chapter 5.6's onion peeling. On the left a round planet in section, up to five shells whose glow shows as the
	 * depth of their colour, a camera at the top and its line of sight, which the reader drags or turns with the
	 * arrow keys from 0° to 90° from straight down; its chord is drawn, and beside the planet a stacked bar gives the
	 * chord's length in each shell, L_i(b), on the planet's own scale. Each boundary can be dragged, reached with Tab
	 * or typed. On the right the brightness N = Σ j_i L_i(R sin θ) against θ, exact, with a dotted vertical at every
	 * kink, arcsin(R_k/R). Below, the onion peeling: the glows read back from the grazing lines, in units of the true
	 * ones, shell 1 at the right since it is read first; with Poisson noise for a chosen number of counts, each
	 * carries its error bar, carried exactly through the peeling. Three presets, and three predictions at the top,
	 * answered once the reader has done what each asks. The numbers come from ./onion-peel.ts. Nothing moves by
	 * itself, so reduced motion changes nothing but the buttons' fades.
	 */
	import { MediaQuery } from 'svelte/reactivity';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ChartLineData01Icon,
		CircleIcon,
		DiceIcon,
		DotIcon,
		EarthIcon,
		FireIcon,
		GoldIcon,
		Layers01Icon,
		Layers02Icon,
		RecordIcon,
		SparklesIcon
	} from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Segmented from '../../ui/controls/Segmented.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import {
		COUNTS,
		DEG,
		DOUBLED,
		EARTH_CORE,
		EARTH_NAMES,
		GLOW,
		GOLD,
		MAX_SHELLS,
		NEAR_KINK,
		OPENING,
		PRESETS,
		PRESET_ORDER,
		THIN,
		bounds,
		brightness,
		chord,
		countText,
		curveAngles,
		deg,
		draw,
		expectedCounts,
		fig,
		figTex,
		grazingAngles,
		impact,
		kinkAngles,
		leastCertain,
		lengths,
		moveEdge,
		niceTop,
		peel,
		peelErrors,
		percent,
		presetOf,
		radius,
		radiusValue,
		readingErrors,
		readings,
		steepest,
		totalText,
		withShells,
		type GoldForm,
		type Planet,
		type PresetName,
		type Units
	} from './onion-peel';

	const uid = $props.id();

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
	const round = (v: number, s: number) => Math.round(Math.round(v / s) * s * 1e9) / 1e9;
	const SUBS = ['₁', '₂', '₃', '₄', '₅'];

	// --- the planet and the line --------------------------------------------------------------------------------------
	let planet = $state.raw<Planet>(PRESETS.earth.planet);
	let units = $state.raw<Units>(PRESETS.earth.units);
	/** The shells' names, from the preset, until the number of shells changes. */
	let names = $state.raw<readonly string[] | undefined>(PRESETS.earth.names);
	/** The line of sight, degrees from straight down. */
	let theta = $state(OPENING.theta);
	/** The preset last chosen, and the form of the gold. */
	let chosen = $state<PresetName>(OPENING.preset);
	let goldForm = $state<GoldForm>('skin');

	// --- the peeling and the noise ------------------------------------------------------------------------------------
	let peeled = $state(false);
	let noisy = $state(false);
	let logT = $state(COUNTS.opening);
	let seed = $state(1);

	const K = $derived(planet.glows.length);
	const R = $derived(bounds(planet));
	const nameOf = (k: number) => names?.[k] ?? `shell ${k + 1}`;
	const isEarth = $derived(names === EARTH_NAMES);
	/** The core: the Earth's outer core, whose top is the edge of the core; otherwise the innermost shell. */
	const core = $derived(isEarth ? EARTH_CORE : K >= 2 ? K - 1 : undefined);
	const coreAngle = $derived(core === undefined ? undefined : kinkAngles(planet)[core - 1]);
	const coreWord = $derived(isEarth ? 'the core' : core === undefined ? '' : `the ${nameOf(core)}`);

	function setTheta(v: number) {
		theta = clamp(v, 0, 90);
		note();
	}

	function setGlow(k: number, v: number) {
		const glows = planet.glows.slice();
		glows[k] = clamp(v, GLOW.low, GLOW.high);
		planet = { edges: planet.edges, glows };
		note();
	}

	function setEdge(k: number, r: number) {
		planet = moveEdge(planet, k, r, units);
		note();
	}

	function setCount(n: number) {
		if (n === K) return;
		planet = withShells(planet, n);
		names = undefined;
		note();
	}

	function choose(p: PresetName) {
		const preset = p === 'gold' ? GOLD[goldForm] : PRESETS[p];
		chosen = p;
		planet = preset.planet;
		units = preset.units;
		names = preset.names;
		base = planet;
		note();
	}

	function setGold(f: GoldForm) {
		goldForm = f;
		choose('gold');
	}

	function setNoisy(on: boolean) {
		noisy = on;
		note();
	}

	function setLogT(v: number) {
		logT = round(clamp(v, COUNTS.low, COUNTS.high), COUNTS.step);
		note();
	}

	function togglePeel() {
		peeled = !peeled;
		note();
	}

	function newDraw() {
		seed += 1;
		note();
	}

	/** The page keys move a slider by its larger step. */
	function pageKeys(get: () => number, set: (v: number) => void, page: number) {
		return (e: KeyboardEvent) => {
			if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
			if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
			e.preventDefault();
			set(get() + (e.key === 'PageUp' ? page : -page));
		};
	}

	// --- the predictions --------------------------------------------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);
	/** The planet when the second prediction was asked, or a preset last chosen. */
	let base = $state.raw<Planet>(PRESETS.earth.planet);
	type Kink = { name: string; edge: string; R: string; angle: number; sin: number };
	type Double = {
		from: number;
		to: number;
		before: number;
		after: number;
		down: [number, number];
		climb: [number, number];
	};
	let kink = $state.raw<Kink | undefined>();
	let doubled = $state.raw<Double | undefined>();
	let uncertain = $state(false);
	const revealed = $derived(
		step === 1 ? kink !== undefined : step === 2 ? doubled !== undefined : uncertain
	);

	function ask(s: 1 | 2 | 3) {
		step = s;
		if (s === 2) base = planet;
	}

	function note() {
		if (step === 1 && !kink && core !== undefined && coreAngle !== undefined) {
			if (Math.abs(theta - coreAngle) <= NEAR_KINK) {
				kink = {
					name: coreWord,
					edge: radiusValue(R[core], units),
					R: radiusValue(1, units),
					angle: coreAngle,
					sin: R[core]
				};
			}
		}
		if (step === 2 && !doubled && core !== undefined && coreAngle !== undefined) {
			const was = base.glows[core];
			const sameShape =
				base.glows.length === K && base.edges.every((r, i) => r === planet.edges[i]);
			if (sameShape && was > 0 && planet.glows[core] >= DOUBLED * was) {
				const inside = Math.max(0, coreAngle - 1);
				doubled = {
					from: was,
					to: planet.glows[core],
					before: steepest(base, Math.max(0, coreAngle - 2), Math.min(90, coreAngle + 2)),
					after: steepest(planet, Math.max(0, coreAngle - 2), Math.min(90, coreAngle + 2)),
					down: [brightness(base, 0), brightness(planet, 0)],
					climb: [
						brightness(base, impact(inside)) - brightness(base, impact(coreAngle)),
						brightness(planet, impact(inside)) - brightness(planet, impact(coreAngle))
					]
				};
			}
		}
		if (step === 3 && !uncertain && noisy && peeled && planet.glows.some((j) => j > 0))
			uncertain = true;
	}

	// --- the numbers ------------------------------------------------------------------------------------------------
	const b = $derived(impact(theta));
	const L = $derived(lengths(planet, b));
	const N = $derived(brightness(planet, b));
	const kinks = $derived(kinkAngles(planet));
	const grazing = $derived(grazingAngles(planet));
	const total = $derived(10 ** logT);
	const trueReadings = $derived(readings(planet));
	const measured = $derived(noisy ? draw(planet, total, seed) : undefined);
	const recovered = $derived(peel(planet, measured ? measured.readings : trueReadings));
	const errors = $derived(noisy ? peelErrors(planet, total) : undefined);
	const readErr = $derived(noisy ? readingErrors(planet, total) : undefined);
	const expected = $derived(expectedCounts(planet, total));
	const worst = $derived(noisy ? leastCertain(planet, total) : undefined);
	const preset = $derived(presetOf(planet));
	const glowMax = $derived(Math.max(...planet.glows));
	/** The length of the line that grazes the bottom of shell 1 inside it. */
	const L0 = $derived(K > 1 ? lengths(planet, planet.edges[0])[0] : 0);

	// --- the layout -------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	type Box = { x: number; y: number; w: number; h: number };

	const layout = $derived.by(() => {
		if (phone.current) {
			const W = 360;
			const left: Box = { x: 0, y: 22, w: W, h: 262 };
			const right: Box = { x: 0, y: left.y + left.h + 30, w: W, h: 200 };
			const below: Box = { x: 0, y: right.y + right.h + 52, w: W, h: 150 };
			return {
				W,
				H: below.y + below.h + 54,
				left,
				right,
				below,
				disc: { cx: 150, cy: left.y + 34 + 104, R: 104 },
				bar: { x: 290, w: 16 }
			};
		}
		const W = 680;
		const left: Box = { x: 0, y: 22, w: 300, h: 270 };
		const right: Box = { x: 316, y: 22, w: 364, h: 270 };
		const below: Box = { x: 0, y: left.y + left.h + 52, w: W, h: 150 };
		return {
			W,
			H: below.y + below.h + 40,
			left,
			right,
			below,
			disc: { cx: 128, cy: left.y + 36 + 110, R: 110 },
			bar: { x: 256, w: 18 }
		};
	});

	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (v: number) => v.toFixed(2);

	// --- the planet ---------------------------------------------------------------------------------------------------
	/** The depth of a shell's colour: its glow over the brightest, as the paper's figure shades its shells. */
	const shade = (j: number) => (glowMax > 0 ? 0.06 + 0.7 * (j / glowMax) : 0);

	function annulus(ro: number, ri: number) {
		const { cx, cy } = layout.disc;
		const ring = (r: number) =>
			`M${f2(cx - r)},${f2(cy)}a${f2(r)},${f2(r)} 0 1 0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1 0 ${f2(-2 * r)},0Z`;
		return ri > 0 ? ring(ro) + ring(ri) : ring(ro);
	}

	const sight = $derived.by(() => {
		const { cx, cy, R: Rp } = layout.disc;
		const C = { x: cx, y: cy - Rp };
		const d = { x: Math.sin(theta * DEG), y: Math.cos(theta * DEG) };
		const along = (s: number) => ({ x: C.x + d.x * s, y: C.y + d.y * s });
		const length = chord(1, b) * Rp;
		const M = along(length / 2);
		const reach = Math.max(length, 28 * u);
		/** Where the chord crosses each boundary, with a short tick across it. */
		const crossings: string[] = [];
		for (const r of planet.edges) {
			if (r <= b) continue;
			const h = (chord(r, b) / 2) * Rp;
			for (const s of [length / 2 - h, length / 2 + h]) {
				const p = along(s);
				crossings.push(
					`M${f2(p.x - d.y * 3.5 * u)},${f2(p.y + d.x * 3.5 * u)}l${f2(d.y * 7 * u)},${f2(-d.x * 7 * u)}`
				);
			}
		}
		/** The perpendicular from O to M, a right-angle mark at M, and the arc of θ at the camera. */
		const toO = { x: cx - M.x, y: cy - M.y };
		const om = Math.hypot(toO.x, toO.y);
		const n = om > 0 ? { x: toO.x / om, y: toO.y / om } : { x: 0, y: 0 };
		const a = 5 * u;
		const corner =
			om > 8 * u
				? `M${f2(M.x - d.x * a)},${f2(M.y - d.y * a)}l${f2(n.x * a)},${f2(n.y * a)}l${f2(d.x * a)},${f2(d.y * a)}`
				: '';
		const rho = 26 * u;
		const arc =
			theta >= 2
				? `M${f2(C.x)},${f2(C.y + rho)}A${f2(rho)},${f2(rho)} 0 0 0 ${f2(C.x + rho * d.x)},${f2(C.y + rho * d.y)}`
				: '';
		const mid = { x: Math.sin((theta / 2) * DEG), y: Math.cos((theta / 2) * DEG) };
		return {
			C,
			E: along(length),
			M,
			handle: along(reach),
			beyond: reach > length,
			crossings: crossings.join(''),
			corner,
			arc,
			thetaAt: { x: C.x + (rho + 9 * u) * mid.x, y: C.y + (rho + 9 * u) * mid.y },
			om,
			bAt: { x: (M.x + cx) / 2 - d.x * 8 * u, y: (M.y + cy) / 2 - d.y * 8 * u },
			mAt: { x: M.x - n.x * 11 * u, y: M.y - n.y * 11 * u }
		};
	});

	/** The stacked bar: the chord laid straight on the planet's scale, one piece for each shell. */
	const pieces = $derived.by(() => {
		const { cy, R: Rp } = layout.disc;
		let y = cy - Rp;
		return L.map((len, k) => {
			const h = len * Rp;
			const piece = { k, y, h };
			y += h;
			return piece;
		}).filter((p) => p.h > 0);
	});

	// --- the curve ----------------------------------------------------------------------------------------------------
	const plot = $derived({
		x: layout.right.x + 40,
		y: layout.right.y + 34,
		w: layout.right.w - 40 - 12,
		h: layout.right.h - 34 - 8
	});
	const angles = $derived(curveAngles(planet));
	const values = $derived(angles.map((t) => brightness(planet, impact(t))));
	const top = $derived(niceTop(Math.max(...values)));
	const X = (t: number) => plot.x + (t / 90) * plot.w;
	const Y = (v: number) => plot.y + plot.h - clamp(v / top, 0, 1.04) * plot.h;
	const curvePath = $derived(
		angles.map((t, i) => `${i ? 'L' : 'M'}${f2(X(t))},${f2(Y(values[i]))}`).join('')
	);
	const angleTicks = [0, 15, 30, 45, 60, 75, 90];
	const valueTicks = $derived([0, top / 2, top]);

	/** The kinks' labels, in two rows where two would meet. */
	const kinkLabels = $derived.by(() => {
		const sorted = kinks.map((t, k) => ({ t, k })).sort((p, q) => p.t - q.t);
		const last = [-Infinity, -Infinity];
		return sorted.map(({ t, k }) => {
			const x = X(t);
			const row = x - last[0] >= 34 * u ? 0 : x - last[1] >= 34 * u ? 1 : 0;
			last[row] = x;
			return { t, k, x, row };
		});
	});

	// --- the peeling's panel ------------------------------------------------------------------------------------------
	const peelPlot = $derived({
		x: layout.below.x + 40,
		y: layout.below.y + 26,
		w: layout.below.w - 40 - 12,
		h: layout.below.h - 26 - 10
	});
	const RATIO_TOP = 2;
	const PY = (v: number) =>
		peelPlot.y + peelPlot.h - (clamp(v, 0, RATIO_TOP) / RATIO_TOP) * peelPlot.h;
	const slotW = $derived(peelPlot.w / K);
	/** On a phone, five names share the width only if each breaks between its words. */
	const stacked = $derived(phone.current && K > 3);
	/** Shell k's slot, from the left: the centre first, the surface last, as along the radius. */
	const slotX = (k: number) => peelPlot.x + (K - 1 - k) * slotW;
	const bars = $derived(
		planet.glows.map((j, k) => {
			const value = recovered[k];
			const err = errors?.[k];
			return {
				k,
				dark: j === 0,
				ratio: j > 0 ? value / j : 0,
				err: j > 0 && err !== undefined ? err / j : undefined,
				value,
				sigma: err
			};
		})
	);

	// --- the handles --------------------------------------------------------------------------------------------------
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};
	type Drag = { kind: 'line' } | { kind: 'edge'; k: number } | { kind: 'curve' };
	let dragging = $state.raw<Drag | undefined>();
	/** A drag of the line lands on a kink within this many CSS pixels. */
	const SNAP = 6;

	function point(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function snapAngle(t: number, perDegree: number) {
		for (const k of kinks) if (Math.abs(t - k) * perDegree < SNAP * u) return k;
		return round(t, 0.1);
	}

	function dragTo(e: PointerEvent) {
		const p = point(e);
		if (!p || !dragging) return;
		const { cx, cy, R: Rp } = layout.disc;
		if (dragging.kind === 'curve') {
			const t = clamp(((p.x - plot.x) / plot.w) * 90, 0, 90);
			setTheta(snapAngle(t, plot.w / 90));
		} else if (dragging.kind === 'line') {
			const dx = p.x - cx;
			const dy = p.y - (cy - Rp);
			const t = clamp(Math.atan2(dx, dy) / DEG, 0, 90);
			setTheta(snapAngle(t, Math.max(Math.hypot(dx, dy), Rp) * DEG));
		} else {
			const r = Math.hypot(p.x - cx, p.y - cy) / Rp;
			setEdge(dragging.k, round(r * units.R, units.fine) / units.R);
		}
	}

	/** Pointer moves, at most one a frame. */
	let pending: PointerEvent | undefined;
	let frame = 0;
	function schedule(e: PointerEvent) {
		pending = e;
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (dragging && pending) dragTo(pending);
			pending = undefined;
		});
	}

	function grab(e: PointerEvent, which: Drag) {
		if (e.button !== 0) return;
		// a drag is not a click: the handle does not take the focus, so no ring is drawn round it
		e.preventDefault();
		e.stopPropagation();
		svg?.setPointerCapture(e.pointerId);
		dragging = which;
	}

	/** A press on the planet aims the line there, and on the curve turns it there; a finger scrolls the page. */
	function press(e: PointerEvent) {
		if (e.pointerType === 'touch' || e.button !== 0) return;
		const p = point(e);
		if (!p) return;
		const inside = (box: Box) =>
			p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
		const which: Drag | undefined = inside(layout.right)
			? { kind: 'curve' }
			: inside(layout.left)
				? { kind: 'line' }
				: undefined;
		if (!which) return;
		e.preventDefault();
		svg?.setPointerCapture(e.pointerId);
		dragging = which;
		dragTo(e);
	}

	function move(e: PointerEvent) {
		if (dragging) schedule(e);
	}

	function release(e: PointerEvent) {
		// a quick drag ends before its last move is drawn: take it now
		if (dragging && pending) dragTo(pending);
		else if (dragging && e.type === 'pointerup') dragTo(e);
		pending = undefined;
		dragging = undefined;
	}

	function lineKey(e: KeyboardEvent) {
		const s = e.shiftKey ? 0.1 : 1;
		const by: Record<string, number> = {
			ArrowLeft: -s,
			ArrowDown: -s,
			ArrowRight: s,
			ArrowUp: s,
			PageDown: -10,
			PageUp: 10
		};
		if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			setTheta(e.key === 'Home' ? 0 : 90);
			return;
		}
		const d = by[e.key];
		if (d === undefined) return;
		e.preventDefault();
		setTheta(round(theta + d, Math.abs(d) < 1 ? 0.1 : 1));
	}

	function edgeKey(e: KeyboardEvent, k: number) {
		const s = e.shiftKey ? units.fine : units.coarse;
		const d = { ArrowLeft: -s, ArrowDown: -s, ArrowRight: s, ArrowUp: s }[e.key];
		if (d === undefined) return;
		e.preventDefault();
		setEdge(k, round(planet.edges[k] * units.R + d, units.fine) / units.R);
	}

	function typed(e: Event, k: number) {
		const input = e.currentTarget as HTMLInputElement;
		const v = input.valueAsNumber;
		if (Number.isFinite(v)) setEdge(k, round(v, units.fine) / units.R);
		input.value = edgeValue(k);
	}

	const places = $derived(Math.max(0, -Math.floor(Math.log10(units.fine) + 1e-9)));
	const edgeValue = (k: number) => Number((planet.edges[k] * units.R).toFixed(places)).toString();

	// --- the words ----------------------------------------------------------------------------------------------------
	const texN = (v: number) => figTex(v);
	const lengthText = (x: number) =>
		units.name === 'R' ? `${fig(x)} R` : `${fig(x)} R (${radius(x, units)})`;
	const span = (k: number) =>
		`${Number((R[k + 1] * units.R).toFixed(places))}–${Number((R[k] * units.R).toFixed(places))}`;
	const thickness = (k: number) => R[k] - R[k + 1];

	const description = $derived(
		`A round planet of ${K} shell${K > 1 ? 's' : ''}: ` +
			planet.glows
				.map(
					(j, k) =>
						`${nameOf(k)} from ${radius(R[k + 1], units)} to ${radius(R[k], units)}, glowing ${fig(j)}`
				)
				.join('; ') +
			`. The line of sight from the camera is at ${deg(theta)} from straight down, missing the centre by b = ${fig(b)} R; its brightness is ${fig(N)} in units of the glow times R. ` +
			`The curve of brightness against the angle has kinks at ${kinks.map(deg).join(', ') || 'no angle'}.` +
			(peeled
				? ` Peeled from the grazing lines, the glows come back as ${recovered.map((v) => fig(v)).join(', ')}${errors ? `, with standard deviations ${errors.map((s) => fig(s, 2)).join(', ')}` : ''}.`
				: '')
	);
	const lineLabel = $derived(
		`The line of sight, at θ = ${deg(theta)} from straight down, b = ${fig(b)} R, N = ${fig(N)}. Drag it, or turn it 1 degree with the arrow keys, a tenth with Shift.`
	);
	const edgeLabel = (k: number) =>
		`The boundary between the ${nameOf(k)} and the ${nameOf(k + 1)}, at ${radius(R[k + 1], units)}, seen at ${deg(kinks[k])}. Drag it, or move it ${units.coarse} ${units.name} with the arrow keys, ${units.fine} with Shift.`;

	const PRESET_NAMES: Record<PresetName, { label: string; icon: typeof EarthIcon }> = {
		earth: { label: 'The paper’s Earth', icon: EarthIcon },
		gold: { label: 'Gold in a steel ball', icon: GoldIcon },
		two: { label: 'Two shells', icon: Layers01Icon }
	};

	/** The third answer's words, for the planet shown. */
	const third = $derived.by(() => {
		if (!errors) return undefined;
		const k = worst;
		if (k === undefined) return { kind: 'none' as const, k: 0, r: 0, rel: [] };
		const rel = planet.glows.map((j, i) => (j > 0 ? errors[i] / j : undefined));
		const r = rel[k] ?? 0;
		const thin = k === 0 && K > 1 && thickness(0) < THIN;
		const kind = K === 1 ? 'one' : k === K - 1 ? 'innermost' : thin ? 'thin' : 'other';
		return { kind, k, r, rel };
	});
</script>

<div class="onion-peel">
	<section class="predict" aria-labelledby="{uid}-predict">
		<div class="steps">
			<span class="tag" id="{uid}-predict">Predict</span>
			<div class="pick" role="group" aria-label="Prediction">
				{#each [1, 2, 3] as const as s (s)}
					<button type="button" aria-pressed={step === s} onclick={() => ask(s)}>{s}</button>
				{/each}
			</div>
		</div>
		<p class="question">
			{#if step === 1}
				Where on the brightness curve does the edge of the core show?
			{:else if step === 2}
				Double the core’s glow. Does the kink move?
			{:else}
				With noise on, which shell comes back least certain?
			{/if}
		</p>
		<p class={['answer', { shown: revealed }]} aria-live="polite">
			{#if revealed && step === 1 && kink}
				<strong
					>As a kink at <Tex math={`\\theta = ${kink.angle.toFixed(1)}^\\circ`} />, whatever its
					glow.</strong
				>
				There the line of sight just grazes the edge of {kink.name}, so that its impact parameter
				<Tex math="b = R\sin\theta" /> is the edge’s radius, and <Tex
					math={`\\sin\\theta = r_0/R = ${kink.edge}/${kink.R} = ${kink.sin.toFixed(3)}`}
				/>. A line a little steeper runs inside the edge for <Tex math={'2\\sqrt{r_0^2 - b^2}'} />,
				which grows from nothing as a square root, so the curve stays continuous while its slope
				jumps. Only the radius sets the angle; the glow sets how high the curve climbs.
				<button type="button" class="next" onclick={() => ask(2)}>Next prediction</button>
			{:else if revealed && step === 2 && doubled}
				<strong
					>No: the kink stays at <Tex math={`${doubled.after.toFixed(1)}^\\circ`} />; only how high
					the curve climbs there changes.</strong
				>
				With the glow raised from {fig(doubled.from)} to {fig(doubled.to)}, the steepest rise, found
				from the curve alone, stands at {deg(doubled.before)} before and {deg(doubled.after)} after. Straight
				down the brightness grows from {fig(doubled.down[0])} R to {fig(doubled.down[1])} R, and the climb
				within a degree inside the kink from {fig(doubled.climb[0])} R to {fig(doubled.climb[1])} R; the
				lines that miss the core do not change at all. In the paper’s words, the places of the kinks are
				geometry.
				<button type="button" class="next" onclick={() => ask(3)}>Next prediction</button>
			{:else if revealed && step === 3 && third}
				{#if third.kind === 'none'}
					<strong>No shell glows, so there is nothing to be uncertain of.</strong>
				{:else if third.kind === 'innermost'}
					<strong>The innermost, the {nameOf(third.k)}, to ±{percent(third.r)} of its glow.</strong>
					Each step of the peeling subtracts the shells already found, with their errors, so the errors
					grow inward, as for the chapter’s five equal shells, from 1.0% to 5.8%.
				{:else if third.kind === 'thin'}
					<strong
						>The innermost, except for a very thin outer shell: here the {nameOf(0)}, to ±{percent(
							third.r
						)}.</strong
					>
					It is only {radius(thickness(0), units)} thick, so its grazing line runs only {lengthText(
						L0
					)} through it and collects about {countText(expected[0])} of the {totalText(logT)} counts. Each
					step inward subtracts the shells above with their errors, so, without such a shell, the errors
					grow inward, as for the chapter’s five equal shells, from 1.0% to 5.8%.
				{:else if third.kind === 'one'}
					<strong
						>There is only one shell, read from the one line straight down, to ±{percent(
							third.r
						)}.</strong
					>
					Add shells to see the errors grow inward.
				{:else}
					<strong>Here the {nameOf(third.k)}, to ±{percent(third.r)}.</strong>
					Usually the innermost comes back least certain, since each step subtracts the shells above with
					their errors; but a shell whose grazing line collects few counts for its glow, a thin one or
					a faint one, starts with a larger error of its own.
				{/if}
				{#if third.rel.length > 1}
					From the outside in: {third.rel
						.map((r) => (r === undefined ? 'dark' : `±${percent(r)}`))
						.join(', ')}. The errors shrink as one over the square root of the counts.
				{/if}
			{:else if step === 1}
				The answer appears once the line of sight just grazes the edge of {coreWord ||
					'a shell inside'}.
			{:else if step === 2}
				The answer appears once you have doubled the glow of {isEarth
					? 'the outer core, the shell under the core’s edge,'
					: coreWord || 'an inner shell'} with its slider, leaving the boundaries where they are.
			{:else}
				The answer appears once, with the noise on, you have peeled the planet or drawn the noise
				anew.
			{/if}
		</p>
	</section>

	<div class="stage">
		<svg
			viewBox="0 0 {layout.W} {layout.H}"
			role="group"
			aria-label={description}
			class={{ dragging }}
			onpointerdown={press}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-plot">
					<rect x={plot.x} y={layout.right.y + 1} width={plot.w} height={layout.right.h - 2} />
				</clipPath>
			</defs>

			{#each [layout.left, layout.right, layout.below] as box (box.y * 1000 + box.x)}
				<rect
					class="panel"
					x={box.x + 0.5}
					y={box.y + 0.5}
					width={box.w - 1}
					height={box.h - 1}
					rx="8"
				/>
			{/each}

			<!-- the planet, its shells shaded by their glow -->
			<text class="title" x="4" y={layout.left.y - 8 * u}>The planet and the line of sight</text>
			<circle class="ground" cx={layout.disc.cx} cy={layout.disc.cy} r={layout.disc.R} />
			{#each planet.glows as j, k (k)}
				<path
					class="shell"
					d={annulus(R[k] * layout.disc.R, R[k + 1] * layout.disc.R)}
					fill-rule="evenodd"
					fill-opacity={shade(j)}
				/>
			{/each}
			{#each planet.edges as r, k (k)}
				<circle class="edge" cx={layout.disc.cx} cy={layout.disc.cy} r={r * layout.disc.R} />
			{/each}
			<circle class="surface" cx={layout.disc.cx} cy={layout.disc.cy} r={layout.disc.R} />

			<!-- straight down, the centre O, and the camera C -->
			<line class="down" x1={sight.C.x} y1={sight.C.y} x2={layout.disc.cx} y2={layout.disc.cy} />
			<circle class="centre" cx={layout.disc.cx} cy={layout.disc.cy} r={1.8 * u} />
			<text class="small letter halo" x={layout.disc.cx - 7 * u} y={layout.disc.cy + 13 * u}
				><tspan class="it">O</tspan></text
			>
			{#if sight.om > 10 * u}
				<line class="perp" x1={layout.disc.cx} y1={layout.disc.cy} x2={sight.M.x} y2={sight.M.y} />
				<path class="corner" d={sight.corner} />
				{#if sight.om > 24 * u}
					<text class="small letter halo" x={sight.bAt.x} y={sight.bAt.y + 4 * u}
						><tspan class="it">b</tspan></text
					>
				{/if}
				<text class="small letter halo" x={sight.mAt.x} y={sight.mAt.y + 4 * u}
					><tspan class="it">M</tspan></text
				>
			{/if}

			<!-- the line of sight: its chord through the planet, the boundaries it crosses, the angle θ -->
			<line class="chord" x1={sight.C.x} y1={sight.C.y} x2={sight.E.x} y2={sight.E.y} />
			{#if sight.beyond}
				<line
					class="outside"
					x1={sight.E.x}
					y1={sight.E.y}
					x2={sight.handle.x}
					y2={sight.handle.y}
				/>
			{/if}
			<path class="cross" d={sight.crossings} />
			<path class="arc" d={sight.arc} />
			{#if theta >= 2}
				<text class="small letter halo" x={sight.thetaAt.x} y={sight.thetaAt.y + 4 * u}
					><tspan class="it">θ</tspan></text
				>
			{/if}
			<path
				class="camera"
				d="M{f2(sight.C.x - 6 * u)},{f2(sight.C.y - 11 * u)}h{f2(12 * u)}L{f2(sight.C.x)},{f2(
					sight.C.y
				)}Z"
			/>
			<text class="small end" x={sight.C.x - 10 * u} y={sight.C.y - 3 * u}
				>camera <tspan class="it">C</tspan></text
			>

			<!-- the boundaries, each a ring to drag -->
			{#each planet.edges as r, k (k)}
				<circle
					class="ring-hit"
					cx={layout.disc.cx}
					cy={layout.disc.cy}
					r={r * layout.disc.R}
					role="slider"
					tabindex="0"
					aria-roledescription="movable boundary"
					aria-label={edgeLabel(k)}
					aria-valuemin={0}
					aria-valuemax={units.R}
					aria-valuenow={Number((r * units.R).toFixed(places))}
					aria-valuetext={radius(r, units)}
					onpointerdown={(e) => grab(e, { kind: 'edge', k })}
					onkeydown={(e) => edgeKey(e, k)}
				/>
			{/each}

			<!-- the handle of the line -->
			<g
				class="handle"
				transform="translate({f2(sight.handle.x)} {f2(sight.handle.y)})"
				role="slider"
				tabindex="0"
				aria-roledescription="movable handle"
				aria-label={lineLabel}
				aria-valuemin={0}
				aria-valuemax={90}
				aria-valuenow={theta}
				aria-valuetext={deg(theta)}
				onpointerdown={(e) => grab(e, { kind: 'line' })}
				onkeydown={lineKey}
			>
				<circle class="hit" r={15 * u} />
				<circle class="focus" r={10 * u} />
				<circle class="knob" r={5.5 * u} />
			</g>

			<!-- the chord laid straight, on the planet's scale, one piece for each shell -->
			<text
				class="small mid"
				x={layout.bar.x + layout.bar.w / 2}
				y={layout.disc.cy - layout.disc.R - 8 * u}
				><tspan class="it">L</tspan><tspan class="sub" dy={2.5 * u}>i</tspan></text
			>
			<rect
				class="track"
				x={layout.bar.x}
				y={layout.disc.cy - layout.disc.R}
				width={layout.bar.w}
				height={2 * layout.disc.R}
			/>
			{#each pieces as p (p.k)}
				<rect
					class="piece"
					x={layout.bar.x}
					y={p.y}
					width={layout.bar.w}
					height={p.h}
					fill-opacity={Math.max(0.12, shade(planet.glows[p.k]))}
				/>
				{#if p.h >= 12 * u}
					<text class="small" x={layout.bar.x + layout.bar.w + 4 * u} y={p.y + p.h / 2 + 4 * u}
						>{p.k + 1}</text
					>
				{/if}
			{/each}

			<!-- the brightness against the angle -->
			<text class="title" x={layout.right.x + 4} y={layout.right.y - 8 * u}
				>The brightness <tspan class="it">N</tspan>(<tspan class="it">θ</tspan>)</text
			>
			<g clip-path="url(#{uid}-plot)">
				{#each valueTicks as v, i (i)}
					<line
						class={['grid', { axis: v === 0 }]}
						x1={plot.x}
						x2={plot.x + plot.w}
						y1={Y(v)}
						y2={Y(v)}
					/>
				{/each}
				{#each angleTicks as t (t)}
					<line class="grid" x1={X(t)} x2={X(t)} y1={plot.y} y2={plot.y + plot.h} />
				{/each}
				{#each kinks as t, k (k)}
					<line class="kink" x1={X(t)} x2={X(t)} y1={plot.y - 4 * u} y2={plot.y + plot.h} />
				{/each}
				<path class="ink" d={curvePath} />
				{#if peeled}
					{#each grazing as t, k (k)}
						{#if measured && readErr}
							<line
								class="err"
								x1={X(t)}
								x2={X(t)}
								y1={Y(trueReadings[k] - readErr[k])}
								y2={Y(trueReadings[k] + readErr[k])}
							/>
							<circle class="measured" cx={X(t)} cy={Y(measured.readings[k])} r={2.6 * u} />
						{/if}
						<circle class="reading" cx={X(t)} cy={Y(trueReadings[k])} r={3.4 * u} />
					{/each}
				{/if}
				<line class="sight-line" x1={X(theta)} x2={X(theta)} y1={plot.y} y2={plot.y + plot.h} />
				<circle class="dot" cx={X(theta)} cy={Y(N)} r={3.2 * u} />
			</g>
			{#each kinkLabels as l (l.k)}
				<text
					class="small mid dim halo"
					x={clamp(l.x, plot.x + 12 * u, plot.x + plot.w - 12 * u)}
					y={layout.right.y + (l.row ? 27 : 15) * u}>{deg(l.t)}</text
				>
			{/each}
			{#each valueTicks as v, i (i)}
				<text class="small y-tick" x={plot.x - 5 * u} y={Y(v)}>{fig(v, 2)}</text>
			{/each}
			{#each angleTicks as t (t)}
				<text
					class={['small tick', { first: t === 0, last: t === 90 }]}
					x={X(t)}
					y={layout.right.y + layout.right.h + 16 * u}>{t}°</text
				>
			{/each}

			<!-- the peeled glows, in units of the true ones -->
			<text class="title" x="4" y={layout.below.y - 8 * u}
				>{phone.current
					? 'The peeled glows ÷ the true ones'
					: 'The glows peeled from the grazing lines, ÷ the true ones'}</text
			>
			<text class="title end" x={layout.W - 4} y={layout.below.y - 8 * u}
				>{noisy ? `${totalText(logT)} counts` : 'no noise'}</text
			>
			{#each [0, 1, 2] as v (v)}
				<line
					class={['grid', { axis: v === 0, truth: v === 1 }]}
					x1={peelPlot.x}
					x2={peelPlot.x + peelPlot.w}
					y1={PY(v)}
					y2={PY(v)}
				/>
				<text class="small y-tick" x={peelPlot.x - 5 * u} y={PY(v)}>{v}</text>
			{/each}
			<!-- the order of the peeling, from the surface inward -->
			<path
				class="order"
				d="M{f2(peelPlot.x + peelPlot.w - 4 * u)},{f2(layout.below.y + 9 * u)}H{f2(
					peelPlot.x + 4 * u
				)}m{f2(5 * u)},{f2(-3 * u)}l{f2(-5 * u)},{f2(3 * u)}l{f2(5 * u)},{f2(3 * u)}"
			/>
			<text
				class="small mid dim halo-plain"
				x={peelPlot.x + peelPlot.w / 2}
				y={layout.below.y + 12.5 * u}>peeling order</text
			>
			{#each bars as bar (bar.k)}
				{@const x0 = slotX(bar.k)}
				{@const mid = x0 + slotW / 2}
				{#if bar.k < K - 1}
					<line class="slot" x1={x0} x2={x0} y1={peelPlot.y} y2={peelPlot.y + peelPlot.h} />
				{/if}
				<text class="small mid" x={mid} y={peelPlot.y + 10 * u}>{bar.k + 1}</text>
				{#if peeled}
					{#if bar.dark}
						<text class="small mid dim" x={mid} y={PY(0) - 16 * u}>dark</text>
						<text class="small mid" x={mid} y={PY(0) - 4 * u}
							>{fig(bar.value, 2)}{bar.sigma !== undefined ? ` ± ${fig(bar.sigma, 1)}` : ''}</text
						>
					{:else}
						{#if bar.err !== undefined}
							<line class="err" x1={mid} x2={mid} y1={PY(1 - bar.err)} y2={PY(1 + bar.err)} />
							<line
								class="cap"
								x1={mid - 4 * u}
								x2={mid + 4 * u}
								y1={PY(1 - bar.err)}
								y2={PY(1 - bar.err)}
							/>
							<line
								class="cap"
								x1={mid - 4 * u}
								x2={mid + 4 * u}
								y1={PY(1 + bar.err)}
								y2={PY(1 + bar.err)}
							/>
						{/if}
						<line
							class="peeled"
							x1={mid - Math.min(0.32 * slotW, 30 * u)}
							x2={mid + Math.min(0.32 * slotW, 30 * u)}
							y1={PY(bar.ratio)}
							y2={PY(bar.ratio)}
						/>
						{#if bar.ratio > RATIO_TOP}
							<path
								class="over"
								d="M{f2(mid)},{f2(PY(RATIO_TOP) + 1)}l{f2(-4 * u)},{f2(6 * u)}h{f2(8 * u)}Z"
							/>
							<text class="small mid" x={mid} y={PY(RATIO_TOP) + 18 * u}>{fig(bar.ratio, 2)}</text>
						{/if}
					{/if}
				{/if}
				{@const words = stacked ? nameOf(bar.k).split(' ') : [nameOf(bar.k)]}
				{#each words as w, i (i)}
					<text class="small mid" x={mid} y={layout.below.y + layout.below.h + (14 + 13 * i) * u}
						>{w}</text
					>
				{/each}
				<text
					class={['small mid dim', { tiny: stacked }]}
					x={mid}
					y={layout.below.y + layout.below.h + (14 + 13 * words.length) * u}>{span(bar.k)}</text
				>
			{/each}
			{#if !peeled}
				<text class="small mid dim" x={peelPlot.x + peelPlot.w / 2} y={PY(0.5)}
					>Press Peel to read the glows back from the curve</text
				>
			{/if}
		</svg>

		<ul class="legend" aria-hidden="true">
			<li><span class="swatch ink-key"></span>the brightness, and the chord</li>
			<li><span class="swatch sight-key"></span>the line of sight now</li>
			<li>
				<span class="swatch kink-key"></span>a boundary’s kink, <Tex math="\sin\theta = R_k/R" />
			</li>
			{#if peeled}
				<li><span class="swatch reading-key"></span>a grazing line, read by the peeling</li>
				<li><span class="swatch truth-key"></span>the true glows, at 1</li>
				{#if noisy}
					<li><span class="swatch measured-key"></span>its count, with one standard deviation</li>
				{/if}
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="presets" role="group" aria-label="Presets">
			{#each PRESET_ORDER as p (p)}
				<button type="button" aria-pressed={preset?.name === p} onclick={() => choose(p)}>
					<HugeiconsIcon icon={PRESET_NAMES[p].icon} size={16} strokeWidth={1.7} />
					{PRESET_NAMES[p].label}
				</button>
			{/each}
		</div>
		{#if chosen === 'gold'}
			<Segmented
				label="The form of the gold"
				options={[
					{ value: 'nugget', label: 'A nugget, 0.2 R', icon: DotIcon },
					{ value: 'flush', label: 'A flush', icon: RecordIcon },
					{ value: 'skin', label: 'A skin, 0.01 R', icon: CircleIcon }
				]}
				bind:value={() => goldForm, setGold}
			/>
		{/if}
		<div class="row-controls">
			<div class="count">
				<span class="count-name" id="{uid}-count">Shells</span>
				<div class="pick" role="group" aria-labelledby="{uid}-count">
					{#each Array.from({ length: MAX_SHELLS }, (_, i) => i + 1) as n (n)}
						<button type="button" aria-pressed={K === n} onclick={() => setCount(n)}>{n}</button>
					{/each}
				</div>
			</div>
			<button type="button" class="action" aria-pressed={peeled} onclick={togglePeel}>
				<HugeiconsIcon icon={Layers02Icon} size={16} strokeWidth={1.7} />
				{peeled ? 'Peeled' : 'Peel'}
			</button>
			<div class="switch-cell">
				<Toggle icon={SparklesIcon} label="Noise" bind:checked={() => noisy, setNoisy} />
			</div>
			<button type="button" class="action" disabled={!noisy} onclick={newDraw}>
				<HugeiconsIcon icon={DiceIcon} size={16} strokeWidth={1.7} />
				New draw
			</button>
		</div>
		{#if noisy}
			<div onkeydowncapture={pageKeys(() => logT, setLogT, COUNTS.page)} role="presentation">
				<Slider
					id="{uid}-counts"
					label="Counts in all"
					icon={ChartLineData01Icon}
					min={COUNTS.low}
					max={COUNTS.high}
					step={COUNTS.step}
					bind:value={() => logT, setLogT}
					readout="{totalText(logT)} counts"
					ends={['10²', '10⁶']}
				/>
			</div>
		{/if}
		<div class="shells">
			{#each planet.glows as j, k (k)}
				<div class="shell">
					<div
						onkeydowncapture={pageKeys(
							() => planet.glows[k],
							(v) => setGlow(k, v),
							GLOW.page
						)}
						role="presentation"
					>
						<Slider
							id="{uid}-glow-{k}"
							label="{k + 1}, {nameOf(k)}"
							icon={FireIcon}
							min={GLOW.low}
							max={GLOW.high}
							step={GLOW.step}
							bind:value={() => j, (v) => setGlow(k, v)}
							readout="j{SUBS[k]} = {fig(j)}"
						/>
					</div>
					<div class="edge-input">
						{#if k < K - 1}
							<label for="{uid}-edge-{k}">its bottom at</label>
							<input
								id="{uid}-edge-{k}"
								type="number"
								inputmode="decimal"
								min={0}
								max={units.R}
								step={units.fine}
								value={edgeValue(k)}
								onchange={(e) => typed(e, k)}
							/>
							<span class="unit">{units.name}</span>
						{:else}
							<span class="unit">down to the centre</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<p class="hint">
			Drag the line’s handle, or press on the planet or the curve; after Tab, the arrow keys turn it
			1° (with Shift, 0.1°). Tab also reaches each boundary, whose ring can be dragged, moved with
			the arrow keys or typed below. The sliders set each shell’s glow; Page Up and Page Down move
			them by one.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The line</dt>
				<dd>
					<Tex math={`\\theta = ${theta.toFixed(1)}^\\circ`} /><Tex
						math={`b = R\\sin\\theta = ${texN(b)}\\,R`}
					/><span class="also"
						>{units.name === 'R' ? '' : `${radius(b, units)} from the centre; `}its chord
						<Tex math={`2R\\cos\\theta = ${texN(chord(1, b))}\\,R`} /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Its brightness</dt>
				<dd>
					<Tex math={`N = \\textstyle\\sum_i j_i L_i(b) = ${texN(N)}\\,R`} /><span class="also"
						>in units of the glow times <Tex math="R" /></span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The kinks</dt>
				<dd>
					{#if kinks.length}
						<span>{kinks.map(deg).join(', ')}</span><span class="also"
							>where <Tex math="\sin\theta = R_k/R" />: a line there grazes a boundary</span
						>
					{:else}
						<span>none</span><span class="also">a uniform ball has no boundary inside</span>
					{/if}
				</dd>
			</div>
		</dl>
		<table>
			<caption class="visually-hidden"
				>Each shell, its glow, the line’s length in it, and the peeling</caption
			>
			<thead>
				<tr>
					<th scope="col">Shell</th>
					<th scope="col" class="r wide"
						>{units.name === 'R' ? 'radii, R' : `radii, ${units.name}`}</th
					>
					<th scope="col" class="r"><Tex math="j_i" /></th>
					<th scope="col" class="r"><Tex math="L_i(b)" /></th>
					{#if peeled}
						<th scope="col" class="r">peeled</th>
					{/if}
					{#if noisy}
						<th scope="col" class="r">counts</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each planet.glows as j, k (k)}
					<tr class={{ worst: noisy && peeled && worst === k }}>
						<th scope="row">{k + 1}, {nameOf(k)}</th>
						<td class="r wide">{span(k)}</td>
						<td class="r">{fig(j)}</td>
						<td class="r">{fig(L[k])} R</td>
						{#if peeled}
							<td class="r"
								>{fig(recovered[k])}{#if errors}<span class="pm"
										>{` ± ${fig(errors[k], 2)}${j > 0 ? ` (${percent(errors[k] / j)})` : ''}`}</span
									>{/if}</td
							>
						{/if}
						{#if noisy}
							<td class="r"
								>{measured ? countText(measured.counts[k]) : ''}<span class="pm"
									>{` of ${fig(expected[k], 3)}`}</span
								></td
							>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<p class="note">
			Shell <Tex math="i" /> lies between the radii <Tex math="R_i" /> and <Tex math={'R_{i-1}'} />,
			with
			<Tex math="R_0 = R" />, and the line of impact parameter <Tex math="b = R\sin\theta" /> runs through
			it for <Tex
				math={'L_i(b) = 2\\bigl[\\sqrt{R_{i-1}^2 - b^2} - \\sqrt{R_i^2 - b^2}\\,\\bigr]'}
			/>, a root of a negative number read as zero; lengths are in units of <Tex math="R" />, the
			glows in arbitrary units. The peeling reads the lines that graze the bottom of each shell, <Tex
				math="b = R_k"
			/>, the last straight down, and finds <Tex
				math={'j_k = \\bigl[N(R_k) - \\sum_{i<k} j_i L_i(R_k)\\bigr]/L_k(R_k)'}
			/>. With noise, the counts are shared among those lines in proportion to their brightness, as
			a camera looking along each for the same time would collect them, and each line’s count is
			drawn by Poisson’s law; the error bars are one standard deviation, from the counts expected,
			carried exactly through the peeling. The paper’s Earth has the chapter’s radii and the glows
			of the paper’s model in their ratios, the inner core’s set to 10; the gold’s three forms hold
			the same mass of gold, each glowing in proportion to its density. The shells’ shades follow
			their glow, as in the paper’s figure. Everything is exact.
		</p>
	</div>
</div>

<style>
	.onion-peel {
		/* the line of sight now, in the accent; the glow of the shells in the same accent, shaded by its size, as the
		   paper's fig:earth-glow shades its shells */
		--sight: var(--accent);
		--glow: var(--accent);
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
	.action:focus-visible,
	.presets button:focus-visible,
	.edge-input input:focus-visible {
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
		padding: 0.6rem 0.7rem 0.6rem;
		background: radial-gradient(circle at 50% 40%, var(--bg-raised) 0%, var(--bg-sunken) 80%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
		/* the open drawing lets a finger scroll the page; only the handles take a drag */
		touch-action: pan-y;
	}

	svg.dragging,
	svg.dragging .handle,
	svg.dragging .ring-hit {
		cursor: grabbing;
	}

	text {
		font-family: var(--font-sans);
		fill: var(--text-dim);
	}

	.title {
		fill: var(--text-dim);
		font: 500 calc(12px * var(--u, 1)) / 1 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.end {
		text-anchor: end;
	}

	.mid {
		text-anchor: middle;
	}

	.small {
		font-size: calc(11px * var(--u, 1));
		font-variant-numeric: tabular-nums;
	}

	.dim {
		fill: var(--text-faint);
	}

	/* five ranges of radii share a phone's width only a little smaller */
	.small.tiny {
		font-size: calc(9.5px * var(--u, 1));
	}

	.letter {
		fill: var(--text);
		text-anchor: middle;
	}

	.tick {
		text-anchor: middle;
	}

	/* a tick at either end of the axis keeps its words inside it */
	.tick.first {
		text-anchor: start;
	}

	.tick.last {
		text-anchor: end;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
	}

	/* letters of the mathematics in KaTeX's own face, as in the readouts */
	.it {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 1.1em;
	}

	.sub {
		font-family: KaTeX_Math, var(--font-serif);
		font-style: italic;
		font-size: 0.8em;
	}

	.halo {
		paint-order: stroke;
		stroke: var(--bg-sunken);
		stroke-width: calc(3px * var(--u, 1));
		stroke-linejoin: round;
	}

	.halo-plain {
		paint-order: stroke;
		stroke: var(--bg-raised);
		stroke-width: calc(4px * var(--u, 1));
		stroke-linejoin: round;
	}

	.panel {
		fill: color-mix(in srgb, var(--text) 3%, transparent);
		stroke: var(--line);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the planet */

	.ground {
		fill: color-mix(in srgb, var(--text) 5%, var(--bg-sunken));
	}

	.shell {
		fill: var(--glow);
	}

	.edge {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 38%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	.surface {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.ring-hit {
		fill: none;
		stroke: transparent;
		stroke-width: calc(9px * var(--u, 1));
		pointer-events: stroke;
		cursor: grab;
		touch-action: none;
	}

	.ring-hit:focus {
		outline: none;
	}

	.ring-hit:focus-visible {
		stroke: color-mix(in srgb, var(--accent) 45%, transparent);
		stroke-width: calc(3px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.down {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.centre {
		fill: var(--text);
	}

	.perp {
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(1.2px * var(--u, 1)) calc(2.5px * var(--u, 1));
		stroke-linecap: round;
	}

	.corner,
	.arc {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 60%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.chord {
		stroke: var(--text);
		stroke-width: calc(1.8px * var(--u, 1));
		stroke-linecap: round;
	}

	.outside {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.cross {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1px * var(--u, 1));
	}

	.camera {
		fill: var(--text);
	}

	.handle {
		cursor: grab;
		touch-action: none;
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
		fill: var(--sight);
		stroke: var(--bg);
		stroke-width: calc(1px * var(--u, 1));
	}

	.track {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 22%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(2px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.piece {
		fill: var(--glow);
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(0.8px * var(--u, 1));
	}

	/* the curves */

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.grid.truth {
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-dasharray: calc(4px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	.kink {
		stroke: color-mix(in srgb, var(--text) 50%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
	}

	.ink {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.6px * var(--u, 1));
		stroke-linejoin: round;
	}

	.sight-line {
		stroke: var(--sight);
		stroke-width: calc(1px * var(--u, 1));
		opacity: 0.8;
		pointer-events: none;
	}

	.dot {
		fill: var(--sight);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
		pointer-events: none;
	}

	.reading {
		fill: none;
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.measured {
		fill: var(--text);
	}

	.err,
	.cap {
		stroke: var(--text);
		stroke-width: calc(1.2px * var(--u, 1));
	}

	.peeled {
		stroke: var(--text);
		stroke-width: calc(2.6px * var(--u, 1));
		stroke-linecap: round;
	}

	.over {
		fill: var(--text);
	}

	.slot {
		stroke: color-mix(in srgb, var(--text) 10%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.order {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 45%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-linejoin: round;
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

	.ink-key {
		border-color: var(--text);
		border-top-width: 2px;
	}

	.sight-key {
		border-color: var(--sight);
	}

	.kink-key {
		border-top: 1.5px dotted color-mix(in srgb, var(--text) 60%, transparent);
	}

	.truth-key {
		border-top: 1.5px dashed color-mix(in srgb, var(--text) 45%, transparent);
	}

	.reading-key,
	.measured-key {
		width: 0.55rem;
		height: 0.55rem;
		border: 1.2px solid var(--text);
		border-radius: 50%;
	}

	.measured-key {
		background: var(--text);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
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

		.action:not(:disabled):hover {
			border-color: var(--accent);
		}
	}

	.row-controls {
		display: grid;
		grid-template-columns: auto auto minmax(0, 1fr) auto;
		gap: 0.6rem;
		align-items: end;
	}

	.count {
		display: grid;
		gap: 0.3rem;
	}

	.count-name {
		font: 500 0.74rem/1.2 var(--font-sans);
		color: var(--text-dim);
	}

	.count .pick {
		min-height: 2.55rem;
		align-items: center;
		padding: 3px;
	}

	.count .pick button {
		min-height: calc(2.55rem - 8px);
	}

	.action {
		flex: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		min-height: 2.55rem;
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
		border-color: var(--accent);
	}

	.action:disabled {
		color: var(--text-faint);
		cursor: default;
	}

	.action:disabled :global(svg) {
		color: var(--text-faint);
	}

	.shells {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1.4rem;
		align-items: start;
	}

	.shell {
		display: grid;
		gap: 0.3rem;
	}

	.edge-input {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
		color: var(--text-dim);
	}

	.edge-input input {
		width: 5.5rem;
		padding: 0.2rem 0.4rem;
		border: 1px solid var(--line-strong);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text);
		font: 500 0.74rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}

	.unit {
		color: var(--text-faint);
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

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	/* the chapter's own tables are styled for the text: this one keeps its own */
	.readouts table {
		width: 100%;
		margin: 0.7rem 0 0;
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}

	.readouts th,
	.readouts td {
		padding: 0.3rem 0.4rem;
		border: 0;
		border-bottom: 1px solid var(--line);
		background: none;
		text-align: left;
		vertical-align: baseline;
	}

	.readouts thead th {
		padding-top: 0;
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts tbody th {
		font-weight: 500;
		color: var(--text-dim);
	}

	.readouts tbody tr:last-child > * {
		border-bottom: 0;
	}

	.readouts td.r,
	.readouts th.r {
		text-align: right;
		white-space: nowrap;
	}

	.readouts tr.worst > * {
		color: var(--accent-ink);
	}

	.pm {
		color: var(--text-faint);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
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
			padding: 0.4rem 0.4rem 0.5rem;
		}

		.presets button {
			flex-direction: column;
			gap: 0.2rem;
			padding: 0.35rem 0.25rem;
			text-align: center;
		}

		.row-controls {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.count,
		.row-controls > .action:last-child {
			grid-column: 1 / -1;
		}

		.shells {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}

		.readouts {
			padding-inline: 0.7rem;
			font-size: 0.74rem;
		}

		.readouts th,
		.readouts td {
			padding: 0.3rem 0.25rem;
		}

		/* the radii are under the peeling's panel; the errors go under the values they belong to */
		.readouts .wide {
			display: none;
		}

		.pm {
			display: block;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.presets button,
		.action {
			transition: none;
		}
	}
</style>
