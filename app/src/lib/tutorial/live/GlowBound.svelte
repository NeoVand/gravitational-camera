<script lang="ts">
	/**
	 * Chapter 10.3's bound on every glow, in two stacked panels on one frequency axis f = ω/2π in THz, with x = ħω/k_BT
	 * along the top. Top: a material's friction against a uniform shear, Re η(ω), on ordinary (linear) axes, so that
	 * the area under it, against ω, is (π/2)Δμ; behind it, faintly and to its own scale, x³/(e^x − 1) at the chosen
	 * temperature. Bottom: the glow it sends per unit of angular frequency, 4παB_ω, shaded. The materials are the paper's
	 * tab:materials (copper's electrons, iron's ceiling, silicon's and diamond's Raman lines, silica's flat band, water,
	 * the placeholder), each crystal with its pairs of phonons unless they are switched off, and a line of the reader's
	 * whose centre, weight and width are dragged in the top panel. A slider sets T from 100 K to 6000 K on a scale of
	 * powers of ten; for copper a switch makes the collision rate grow in proportion to T. The readouts give the weight
	 * Δμ, P/V, Ṅ/V, η_eff, Ē/k_BT and the shares of eq:glow-bound for power and count. The arithmetic is in
	 * ./glow-bound.ts. The chapter's try box asks the predictions, so the figure answers none of them in words. The axes
	 * glide when they rescale; under reduced motion they jump to their end states.
	 */
	import { cubicOut } from 'svelte/easing';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	import { Atom02Icon, FireIcon, ThermometerIcon } from '@hugeicons/core-free-icons';
	import Slider from '../../ui/controls/Slider.svelte';
	import Toggle from '../../ui/controls/Toggle.svelte';
	import Tex from '../../ui/Tex.svelte';
	import { fitText } from '../../ui/figure-text';
	import { H, KB, sup } from './planck-spectrum';
	import {
		CHOICES,
		COUNT_CONSTANT,
		CUSTOM_RANGE,
		GPA,
		OPENING,
		OPENING_CUSTOM,
		PEAK_POWER,
		PLACEHOLDER,
		POWER_CONSTANT,
		TEMPERATURE,
		THZ,
		T_PRESETS,
		axisFor,
		build,
		canFollow,
		channelWeight,
		countBound,
		fAxisFor,
		fTicks,
		frictionOf,
		glow,
		glowDensity,
		hasPairs,
		lineHeight,
		moveCentre,
		numberTex,
		numberText,
		percent,
		planckShape,
		powerBound,
		qualityOf,
		samples,
		setWeight,
		setWidth,
		shownShare,
		stepWeight,
		stepWidth,
		temperatureText,
		weightForHeight,
		xStep,
		type Channel,
		type Choice,
		type Custom
	} from './glow-bound';

	const uid = $props.id();

	// --- the state ---------------------------------------------------------------------------------------------------
	let choice = $state<Choice>(OPENING.choice);
	let T = $state(OPENING.T);
	let pairs = $state(OPENING.pairs);
	let follow = $state(OPENING.follow);
	let custom = $state.raw<Custom>(OPENING_CUSTOM);

	const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

	/** The slider's value, kept exactly on a preset it lands within a step of. */
	function setLog(v: number) {
		const t = 10 ** clamp(v, TEMPERATURE.low, TEMPERATURE.high);
		const near = T_PRESETS.find((p) => Math.abs(Math.log10(p.T / t)) < TEMPERATURE.step / 2);
		T = near ? near.T : t;
	}

	/** The page keys move the slider by its larger step. */
	function pageKeys(e: KeyboardEvent) {
		if (!(e.target instanceof HTMLInputElement) || e.target.type !== 'range') return;
		if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
		e.preventDefault();
		const by = e.key === 'PageUp' ? TEMPERATURE.page : -TEMPERATURE.page;
		setLog(Math.round((Math.log10(T) + by) / TEMPERATURE.step) * TEMPERATURE.step);
	}

	// --- the material and its numbers ----------------------------------------------------------------------------------
	const options = $derived({
		pairs: pairs && hasPairs(choice),
		follow: follow && canFollow(choice)
	});
	const built = $derived(build(choice, custom, T, options));
	const g = $derived(glow(built.all, T));
	const finite = $derived(Number.isFinite(g.weight));

	// --- the layout --------------------------------------------------------------------------------------------------
	const phone = new MediaQuery('max-width: 560px', false);
	const lay = $derived(
		phone.current
			? { W: 360, L: 34, R: 352, T1: 46, B1: 206, title2: 230, T2: 240, B2: 370, H: 406 }
			: { W: 680, L: 46, R: 668, T1: 46, B1: 236, title2: 262, T2: 272, B2: 422, H: 458 }
	);
	/** Drawing units in one CSS pixel. */
	let u = $state(1);
	const f2 = (n: number) => n.toFixed(2);

	// --- the axes: fitted to the curves, held while the line is dragged, gliding unless motion is reduced -----------------
	type Axis = { top: number; step: number; unit: number };
	const glide = {
		duration: () => (prefersReducedMotion.current ? 0 : 420),
		easing: cubicOut
	};

	const fTopTarget = $derived(fAxisFor(T));
	const fTop = Tween.of(() => fTopTarget, glide);
	/** The angular frequency the samples reach: the wider of the axis drawn and the axis it is gliding to. */
	const wTop = $derived(2 * Math.PI * Math.max(fTop.current, fTopTarget) * THZ);

	const grid = $derived(samples(built.all, wTop));
	const etaAt = $derived(grid.map((w) => frictionOf(built.all, w, T)));
	const pairsAt = $derived(built.pairs ? grid.map((w) => frictionOf([built.pairs!], w, T)) : []);
	const glowAt = $derived(grid.map((w, i) => glowDensity(etaAt[i], w, T)));

	/** The top of Re η that the axis holds: the curve's largest value, the ceiling's only from a tenth of the axis. */
	const etaFit = $derived.by(() => {
		const ceiling = built.all.some((ch) => ch.kind === 'ceiling');
		const from = ceiling ? 0.1 * 2 * Math.PI * fTopTarget * THZ : 0;
		const top = 2 * Math.PI * fTopTarget * THZ;
		let m = 0;
		grid.forEach((w, i) => {
			if (w >= from && w <= top) m = Math.max(m, etaAt[i]);
		});
		return m;
	});
	const glowFit = $derived.by(() => {
		const top = 2 * Math.PI * fTopTarget * THZ;
		let m = 0;
		grid.forEach((w, i) => {
			if (w <= top) m = Math.max(m, glowAt[i]);
		});
		return m;
	});

	let held = $state.raw<{ eta: Axis; glow: Axis } | undefined>();
	const etaAxis = $derived(held?.eta ?? axisFor(etaFit));
	const glowAxis = $derived(held?.glow ?? axisFor(glowFit));
	const etaTop = Tween.of(() => etaAxis.top, glide);
	const glowTop = Tween.of(() => glowAxis.top, glide);

	const X = (f: number) => lay.L + (f / (fTop.current * THZ)) * (lay.R - lay.L);
	const Xw = (w: number) => X(w / (2 * Math.PI));
	const Y1 = (v: number) => lay.B1 - (v / etaTop.current) * (lay.B1 - lay.T1);
	const Y2 = (v: number) => lay.B2 - (v / glowTop.current) * (lay.B2 - lay.T2);
	const fromX = (x: number) => ((x - lay.L) / (lay.R - lay.L)) * fTop.current * THZ;
	const fromY1 = (y: number) => ((lay.B1 - y) / (lay.B1 - lay.T1)) * etaTop.current;

	/** k_BT/h, Hz: x = f/(k_BT/h). */
	const thermalF = $derived((KB * T) / H);

	// --- the curves -------------------------------------------------------------------------------------------------------
	const pathOf = (values: number[], Y: (v: number) => number, floor: number) =>
		grid
			.map((w, i) => `${i ? 'L' : 'M'}${f2(Xw(w))},${f2(Math.max(floor, Y(values[i])))}`)
			.join('');
	const close = (d: string, base: number) =>
		`${d}L${f2(Xw(grid[grid.length - 1]))},${f2(base)}L${f2(Xw(grid[0]))},${f2(base)}Z`;

	const etaPath = $derived(pathOf(etaAt, Y1, lay.T1 - 40));
	const etaFill = $derived(close(etaPath, lay.B1));
	const pairsPath = $derived(built.pairs ? pathOf(pairsAt, Y1, lay.T1 - 40) : '');
	const glowPath = $derived(pathOf(glowAt, Y2, lay.T2 - 40));
	const glowFill = $derived(close(glowPath, lay.B2));

	/** x³/(e^x − 1), its peak at four fifths of the panel. */
	const planckPath = $derived.by(() => {
		const n = 200;
		const top = fTop.current * THZ;
		const scale = (0.8 * (lay.B1 - lay.T1)) / PEAK_POWER;
		let d = '';
		for (let i = 0; i <= n; i++) {
			const f = (top * i) / n;
			d += `${i ? 'L' : 'M'}${f2(X(f))},${f2(lay.B1 - scale * planckShape(f / thermalF))}`;
		}
		return d;
	});

	const placeholderY = $derived(Y1(PLACEHOLDER));
	const showPlaceholder = $derived(
		choice !== 'placeholder' && PLACEHOLDER <= etaTop.current * 0.97
	);
	/**
	 * The placeholder's words go at the end of its line where the material's curve, and your line's handles, are lowest
	 * under them.
	 */
	const placeholderLeft = $derived.by(() => {
		const span = ((140 * u) / (lay.R - lay.L)) * fTopTarget * THZ;
		const top = fTopTarget * THZ;
		const under = (a: number, b: number) => {
			let m = 0;
			grid.forEach((w, i) => {
				const f = w / (2 * Math.PI);
				if (f >= a && f <= b) m = Math.max(m, etaAt[i]);
			});
			if (choice === 'custom' && custom.f0 + custom.width >= a && custom.f0 - custom.width <= b)
				m = Infinity;
			return m;
		};
		return under(0, span) < under(top - span, top);
	});
	const isCeiling = $derived(built.main.some((ch) => ch.kind === 'ceiling'));

	/** Lines beyond the axis's right end, named at its edge. */
	const offAxis = $derived(
		built.main.flatMap((ch) =>
			ch.kind === 'line' && ch.omega0 / (2 * Math.PI) > fTopTarget * THZ
				? [ch.omega0 / (2 * Math.PI)]
				: []
		)
	);

	// --- the ticks --------------------------------------------------------------------------------------------------------
	const fTickList = $derived(fTicks(fTopTarget, phone.current ? 5 : 6));
	const xTop = $derived((fTop.current * THZ) / thermalF);
	const xTickList = $derived.by(() => {
		const s = xStep(xTop, phone.current ? 7 : 12);
		const out: number[] = [];
		for (let x = 0; x <= xTop + 1e-9; x += s) out.push(x);
		return out;
	});
	const yTicks = (a: Axis) => {
		const out: number[] = [];
		for (let v = 0; v <= a.top * (1 + 1e-9); v += a.step) out.push(v);
		return out;
	};
	const tickText = (v: number, unit: number) => String(Number((v / unit).toFixed(2)));
	const unitText = (unit: number) => (unit === 1 ? '' : `10${sup(Math.round(Math.log10(unit)))} `);

	// --- the custom line: its handle at its peak, its grip at half height on the right ----------------------------------------
	const handle = $derived.by(() => {
		if (choice !== 'custom') return undefined;
		const x = X(custom.f0);
		const h = lineHeight(custom);
		const y = Y1(h);
		const above = y < lay.T1 + 1;
		const gx = X(custom.f0 + custom.width / 2);
		const gy = clamp(Y1(h / 2), lay.T1 + 4 * u, lay.B1 - 4 * u);
		return {
			x,
			y,
			shownY: above ? lay.T1 + 1 : y,
			above,
			height: h,
			gx: Math.min(gx, lay.R),
			gy,
			inside: x >= lay.L && x <= lay.R
		};
	});

	type Drag = { kind: 'peak'; dx: number; dy: number } | { kind: 'width' };
	let dragging = $state.raw<Drag | undefined>();
	let svg: SVGSVGElement | undefined;
	const hold = (node: SVGSVGElement) => {
		svg = node;
		return () => (svg = undefined);
	};

	function pointAt(e: PointerEvent) {
		const m = svg?.getScreenCTM();
		if (!m) return undefined;
		return new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
	}

	function grab(kind: Drag['kind'], e: PointerEvent) {
		if (e.button !== 0 || !handle) return;
		const p = pointAt(e);
		if (!p) return;
		e.preventDefault();
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		held = { eta: etaAxis, glow: glowAxis };
		dragging =
			kind === 'peak' ? { kind, dx: p.x - handle.x, dy: p.y - handle.shownY } : { kind: 'width' };
	}

	function move(e: PointerEvent) {
		const d = dragging;
		if (!d) return;
		const p = pointAt(e);
		if (!p) return;
		const hi = fTopTarget * THZ;
		if (d.kind === 'peak') {
			const moved = moveCentre(custom, fromX(p.x - d.dx), hi);
			const height = Math.max(1e-9, fromY1(p.y - d.dy));
			custom = setWeight(moved, Math.round(weightForHeight(moved, height) / GPA) * GPA);
		} else {
			custom = setWidth(custom, 2 * Math.max(1, fromX(p.x) - custom.f0));
		}
	}

	function release() {
		if (!dragging) return;
		dragging = undefined;
		held = undefined;
	}

	/**
	 * On the handle: ← and → move the centre a hundredth of the axis, and with Shift narrow and widen the line; + and −
	 * (or ↑ and ↓) add and take a gigapascal of weight, Page Up and Page Down ten; Home and End go to the axis's ends.
	 */
	function lineKey(e: KeyboardEvent) {
		const hi = fTopTarget * THZ;
		const by = hi / 100;
		let next: Custom | undefined;
		const k = e.key;
		// + and − by the key's place too, where a layout or a tool leaves the key's name empty
		const plus = k === '+' || k === '=' || e.code === 'Equal' || e.code === 'NumpadAdd';
		const minus = k === '-' || k === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract';
		if (e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowDown')) next = stepWidth(custom, -1);
		else if (e.shiftKey && (k === 'ArrowRight' || k === 'ArrowUp')) next = stepWidth(custom, 1);
		else if (k === 'ArrowLeft') next = moveCentre(custom, custom.f0 - by, hi);
		else if (k === 'ArrowRight') next = moveCentre(custom, custom.f0 + by, hi);
		else if (plus || k === 'ArrowUp') next = stepWeight(custom, 1);
		else if (minus || k === 'ArrowDown') next = stepWeight(custom, -1);
		else if (k === 'PageUp') next = stepWeight(custom, 10);
		else if (k === 'PageDown') next = stepWeight(custom, -10);
		else if (k === 'Home') next = moveCentre(custom, CUSTOM_RANGE.f0.low, hi);
		else if (k === 'End') next = moveCentre(custom, hi, hi);
		if (!next) return;
		e.preventDefault();
		custom = next;
	}

	// --- words and numbers --------------------------------------------------------------------------------------------------
	const MU = '\\Delta\\htmlClass{q-matter}{\\mu}';
	const ETA = '\\htmlClass{q-matter}{\\eta}';
	const n3 = (x: number) => numberTex(x, 3);
	const gpa = (w: number) => numberText(w / GPA, 3);
	const thz = (f: number) => numberText(f / THZ, 3);
	const xOf = (f: number) => (f / thermalF).toFixed(2);

	const NAMES: Record<Choice, { label: string; sub: string; words: string }> = {
		copper: { label: 'Copper', sub: 'electrons', words: 'copper' },
		iron: { label: 'Iron', sub: 'ceiling', words: 'iron' },
		silicon: { label: 'Silicon', sub: 'Raman line', words: 'silicon' },
		diamond: { label: 'Diamond', sub: 'Raman line', words: 'diamond' },
		silica: { label: 'Silica', sub: 'glass band', words: 'silica glass' },
		water: { label: 'Water', sub: 'H bonds', words: 'water' },
		placeholder: { label: 'Placeholder', sub: '10⁻³ Pa s', words: 'the placeholder' },
		custom: { label: 'Your line', sub: 'drag it', words: 'your line' }
	};

	const lineWords = (ch: Extract<Channel, { kind: 'line' }>) => {
		const f = ch.omega0 / (2 * Math.PI);
		const w = ch.width / (2 * Math.PI);
		return `a line at ${thz(f)} THz (x = ${xOf(f)}), ${numberText(w / THZ, 3)} THz wide (Q = ${numberText(f / w, 3)})`;
	};

	/** What the material's friction is, in a sentence. */
	const materialWords = $derived.by(() => {
		const main = built.main[0];
		switch (choice) {
			case 'copper': {
				const tau = main.kind === 'drude' ? main.tau : 0;
				return `Free electrons, relaxing in Drude’s form with the collision time τ = ${numberText(tau, 3)} s${options.follow ? ', its rate grown in proportion to T from its value at 293 K' : ', its value at 293 K'}; their weight, two fifths of their number per volume times the Fermi energy, is ${gpa(channelWeight(main, T))} GPa.`;
			}
			case 'iron':
				return `Free electrons at their ceiling, Δμ/2ω with the electrons’ ${gpa(channelWeight(main, T))} GPa: the most they can give at each frequency, whatever their collision time, so its area has no end at low frequency and the weight counted is the electrons’.`;
			case 'silicon':
			case 'diamond':
				return main.kind === 'line'
					? `Its Raman line: ${lineWords(main)}, with ${gpa(main.weight)} GPa, three fifths of Kleinman’s weight, averaged over directions.`
					: '';
			case 'silica':
				return `Every vibration of the glass: ${gpa(channelWeight(main, T))} GPa spread evenly below 27 THz.`;
			case 'water':
				return `The simulated network of hydrogen bonds, two Maxwell elements and two lines, with ${gpa(built.main.reduce((s, ch) => s + channelWeight(ch, T), 0))} GPa in all.`;
			case 'placeholder':
				return 'A constant friction of 10⁻³ Pa s at every frequency, the paper’s placeholder: its area has no end, so it has no finite weight.';
			case 'custom':
				return main.kind === 'line'
					? `Your line: ${lineWords(main)}, with ${gpa(main.weight)} GPa.`
					: '';
		}
		return '';
	});
	const pairsWords = $derived.by(() => {
		const p = built.pairs;
		if (!p || p.kind !== 'pairs') return '';
		return `With pairs of phonons, up to twice the Debye frequency, ${thz((2 * p.omegaD) / (2 * Math.PI))} THz: ${gpa(channelWeight(p, T))} GPa at ${temperatureText(T)}.`;
	});

	const plotShare = $derived(
		finite ? shownShare(built.all, 2 * Math.PI * fTopTarget * THZ, T) : NaN
	);

	const weightTex = $derived(
		finite
			? `${MU} = ${numberTex(g.weight / GPA, 3)}\\,\\mathrm{GPa}` +
					(g.pairsWeight > 0 ? `\\ (\\text{pairs } ${numberTex(g.pairsWeight / GPA, 3)})` : '')
			: isCeiling
				? `${MU} = ${numberTex(g.weight / GPA, 3)}\\,\\mathrm{GPa}\\ (\\text{the electrons'})`
				: `${MU} = \\infty`
	);
	const powerTex = $derived(`P/V = ${n3(g.power)}\\,\\mathrm{W\\,m^{-3}}`);
	const countTex = $derived(`\\dot N/V = ${n3(g.count)}\\,\\mathrm{s^{-1}\\,m^{-3}}`);
	const etaEffTex = $derived(`${ETA}_{\\rm eff} = ${n3(g.etaEff)}\\,\\mathrm{Pa\\,s}`);
	const meanTex = $derived(`\\bar E = ${g.meanKT.toFixed(3)}\\,k_BT`);
	const pBoundTex = $derived(
		`${POWER_CONSTANT.toFixed(2)}\\,\\dfrac{G\\,${MU}\\,(k_BT)^3}{\\hbar^2c^5} = ${n3(powerBound(g.weight, T))}\\,\\mathrm{W\\,m^{-3}}`
	);
	const nBoundTex = $derived(
		`${COUNT_CONSTANT.toFixed(2)}\\,\\dfrac{G\\,${MU}\\,(k_BT)^2}{\\hbar^2c^5} = ${n3(countBound(g.weight, T))}\\,\\mathrm{s^{-1}\\,m^{-3}}`
	);
	const tReadout = $derived(`T = ${temperatureText(T)}; x = 1 at ${thz(thermalF)} THz`);

	// --- the words for screen readers ---------------------------------------------------------------------------------------
	const description = $derived(
		`Two panels on one frequency axis from 0 to ${fTopTarget} terahertz, x = ħω/k_BT from 0 to ${xTop.toFixed(1)} along the top, at ${temperatureText(T)}. ` +
			`Top: the friction Re eta of ${NAMES[choice].words} on linear axes up to ${numberText(etaAxis.top, 2)} pascal seconds, shaded, over a faint curve of x cubed over (e to the x minus 1). ${materialWords} ${pairsWords} ` +
			`Bottom: the glow it sends per unit of angular frequency, up to ${numberText(glowAxis.top, 2)} watts per cubic metre per inverse second, shaded. ` +
			`P/V is ${numberText(g.power, 3)} watts per cubic metre; the mean energy is ${g.meanKT.toFixed(2)} k_BT.` +
			(finite
				? ` It reaches ${percent(g.powerShare)} percent of the bound on power and ${percent(g.countShare)} percent of the bound on the count.`
				: '')
	);
	const handleText = $derived(
		`Your line at ${thz(custom.f0)} terahertz, x = ${xOf(custom.f0)}, ${numberText(custom.width / THZ, 3)} terahertz wide, Q ${numberText(qualityOf(custom), 3)}, weight ${gpa(custom.weight)} gigapascals`
	);

	const MARKS = T_PRESETS.map((p) => ({ at: Math.log10(p.T), label: `${p.T} K, ${p.words}` }));
</script>

<div class="glow-bound">
	<div class="stage">
		<svg
			viewBox="0 0 {lay.W} {lay.H}"
			role="img"
			aria-label={description}
			class={{ dragging: dragging !== undefined }}
			onpointermove={move}
			onpointerup={release}
			onpointercancel={release}
			{@attach hold}
			{@attach fitText((value) => (u = value))}
		>
			<defs>
				<clipPath id="{uid}-top">
					<rect x={lay.L} y={lay.T1} width={lay.R - lay.L} height={lay.B1 - lay.T1} />
				</clipPath>
				<clipPath id="{uid}-bottom">
					<rect x={lay.L} y={lay.T2} width={lay.R - lay.L} height={lay.B2 - lay.T2} />
				</clipPath>
			</defs>

			<!-- the top panel: the friction -->
			<text class="title" x={lay.L - (phone.current ? 30 : 40)} y={lay.T1 - 26 * u}
				>Re <tspan class="it">η</tspan>(<tspan class="it">ω</tspan>), {unitText(etaAxis.unit)}Pa s</text
			>
			<text class="small dim end" x={lay.R} y={lay.T1 - 26 * u}
				><tspan class="it">x</tspan> = ħ<tspan class="it">ω</tspan>/<tspan class="it">k</tspan
				><tspan class="sub" dy={2 * u}>B</tspan><tspan class="it" dy={-2 * u}>T</tspan></text
			>
			<rect class="frame" x={lay.L} y={lay.T1} width={lay.R - lay.L} height={lay.B1 - lay.T1} />
			{#each yTicks(etaAxis) as v (v)}
				{#if Y1(v) >= lay.T1 - 0.5}
					<line class={['grid', { axis: v === 0 }]} x1={lay.L} x2={lay.R} y1={Y1(v)} y2={Y1(v)} />
					<text class="small y-tick" x={lay.L - 5 * u} y={Y1(v)}>{tickText(v, etaAxis.unit)}</text>
				{/if}
			{/each}
			{#each xTickList as x (x)}
				{@const px = X(x * thermalF)}
				{#if px <= lay.R + 0.5}
					<line class="minor" x1={px} x2={px} y1={lay.T1 - 3 * u} y2={lay.T1} />
					{#if x > 0}<text class="small tick" x={px} y={lay.T1 - 7 * u}>{x}</text>{/if}
				{/if}
			{/each}

			<g clip-path="url(#{uid}-top)">
				{#each fTickList as f (f)}
					<line class="grid" x1={X(f * THZ)} x2={X(f * THZ)} y1={lay.T1} y2={lay.B1} />
				{/each}
				<path class="planck" d={planckPath} />
				{#if showPlaceholder}
					<line class="placeholder" x1={lay.L} x2={lay.R} y1={placeholderY} y2={placeholderY} />
				{/if}
				<path class="matter-fill" d={etaFill} />
				<path class={['matter-line', { ceiling: isCeiling }]} d={etaPath} />
				{#if built.pairs}
					<path class="pairs-line" d={pairsPath} />
				{/if}
			</g>
			{#if showPlaceholder}
				<text
					class={['small words', { end: !placeholderLeft }]}
					x={placeholderLeft ? lay.L + 5 * u : lay.R - 5 * u}
					y={placeholderY - 5 * u}>placeholder, 10⁻³ Pa s</text
				>
			{/if}
			{#each offAxis as f (f)}
				<text class="small words end" x={lay.R - 5 * u} y={lay.T1 + 14 * u}
					>its line, at {thz(f)} THz, is beyond the axis →</text
				>
			{/each}

			{#if handle}
				{#if handle.above}
					<text class="small peak-words" x={handle.x + 10 * u} y={lay.T1 + 13 * u}
						>↑ {numberText(handle.height, 2)} Pa s</text
					>
				{/if}
				{#if handle.inside}
					<g
						class="grip"
						transform="translate({f2(handle.gx)} {f2(handle.gy)})"
						aria-hidden="true"
						onpointerdown={(e) => grab('width', e)}
					>
						<rect class="hit" x={-10 * u} y={-14 * u} width={20 * u} height={28 * u} />
						<rect
							class="grip-bar"
							x={-2.5 * u}
							y={-8 * u}
							width={5 * u}
							height={16 * u}
							rx={2.5 * u}
						/>
					</g>
				{/if}
				<g
					class="handle"
					transform="translate({f2(clamp(handle.x, lay.L, lay.R))} {f2(handle.shownY)})"
					role="slider"
					tabindex="0"
					aria-label="Your line. Left and right move its centre; with Shift they narrow and widen it; plus and minus, or up and down, change its weight."
					aria-valuemin={CUSTOM_RANGE.f0.low / THZ}
					aria-valuemax={fTopTarget}
					aria-valuenow={Number((custom.f0 / THZ).toFixed(3))}
					aria-valuetext={handleText}
					onpointerdown={(e) => grab('peak', e)}
					onkeydown={lineKey}
				>
					<circle class="hit" r={15 * u} />
					<circle class="focus" r={10 * u} />
					<circle class="dot" r={5.5 * u} />
				</g>
			{/if}

			<!-- the bottom panel: the glow -->
			<text class="title" x={lay.L - (phone.current ? 30 : 40)} y={lay.title2}
				>4π<tspan class="it">α</tspan><tspan class="it">B</tspan><tspan class="sub it" dy={2.5 * u}
					>ω</tspan
				><tspan dy={-2.5 * u}>, {unitText(glowAxis.unit)}W m⁻³ s</tspan></text
			>
			{#if !phone.current}
				<text class="small dim end" x={lay.R} y={lay.title2}
					>the glow per unit of angular frequency</text
				>
			{/if}
			<rect class="frame" x={lay.L} y={lay.T2} width={lay.R - lay.L} height={lay.B2 - lay.T2} />
			{#each yTicks(glowAxis) as v (v)}
				{#if Y2(v) >= lay.T2 - 0.5}
					<line class={['grid', { axis: v === 0 }]} x1={lay.L} x2={lay.R} y1={Y2(v)} y2={Y2(v)} />
					<text class="small y-tick" x={lay.L - 5 * u} y={Y2(v)}>{tickText(v, glowAxis.unit)}</text>
				{/if}
			{/each}
			<g clip-path="url(#{uid}-bottom)">
				{#each fTickList as f (f)}
					<line class="grid" x1={X(f * THZ)} x2={X(f * THZ)} y1={lay.T2} y2={lay.B2} />
				{/each}
				<path class="matter-fill strong" d={glowFill} />
				<path class="matter-line" d={glowPath} />
			</g>
			{#each fTickList as f (f)}
				{#if X(f * THZ) <= lay.R + 0.5}
					<line class="minor" x1={X(f * THZ)} x2={X(f * THZ)} y1={lay.B2} y2={lay.B2 + 3 * u} />
					<text class="small tick" x={X(f * THZ)} y={lay.B2 + 15 * u}>{f}</text>
				{/if}
			{/each}
			<text class="small dim end" x={lay.R} y={lay.B2 + 30 * u}
				>frequency <tspan class="it">f</tspan> = <tspan class="it">ω</tspan>/2π, THz</text
			>
		</svg>

		<ul class="legend" aria-hidden="true">
			<li>
				<span class="swatch area-key"></span>Re <Tex math={ETA} trust /> of {NAMES[choice]
					.words}{#if built.pairs}, with its pairs{/if}
			</li>
			{#if built.pairs}
				<li><span class="swatch pairs-key"></span>the pairs of phonons alone</li>
			{/if}
			<li>
				<span class="swatch planck-key"></span><Tex math="x^3/(e^x - 1)" />, to its own scale
			</li>
			{#if showPlaceholder}
				<li><span class="swatch placeholder-key"></span>the placeholder</li>
			{/if}
		</ul>
	</div>

	<div class="bar">
		<div class="materials" role="group" aria-label="Materials">
			{#each CHOICES as c (c)}
				<button
					type="button"
					aria-pressed={choice === c}
					aria-label="{NAMES[c].label}, {NAMES[c].sub}"
					onclick={() => (choice = c)}
				>
					<span class="m-name">{NAMES[c].label}</span><span class="m-sub">{NAMES[c].sub}</span>
				</button>
			{/each}
		</div>
		<div class="slot" onkeydowncapture={pageKeys} role="presentation">
			<Slider
				id="{uid}-temperature"
				label="Temperature"
				icon={ThermometerIcon}
				min={TEMPERATURE.low}
				max={TEMPERATURE.high}
				step={TEMPERATURE.step}
				bind:value={() => Math.log10(T), setLog}
				readout={tReadout}
				ends={['100 K', '6000 K']}
				marks={MARKS}
				marksHint="the ticks mark 293 K, 1500 K and 5500 K"
			/>
		</div>
		{#if hasPairs(choice) || canFollow(choice)}
			<div class="switches">
				{#if hasPairs(choice)}
					<Toggle
						icon={Atom02Icon}
						label="Pairs of phonons"
						hint="Count the crystal’s pairs of phonons, as the paper’s table does"
						bind:checked={pairs}
					/>
				{/if}
				{#if canFollow(choice)}
					<Toggle
						icon={FireIcon}
						label="Collision rate ∝ T"
						hint="Make the electrons’ collision rate grow in proportion to the temperature from 293 K"
						bind:checked={follow}
					/>
				{/if}
			</div>
		{/if}
		<p class="hint">
			Choose a material and a temperature. For your own line, drag its dot to move it and change its
			weight, and the grip at its side to change its width. With the keyboard, on the dot: the
			arrows move it, Shift with the arrows narrows or widens it, and + and − change its weight.
		</p>
	</div>

	<div class="readouts">
		<dl>
			<div class="row">
				<dt>The friction</dt>
				<dd><span class="also">{materialWords} {pairsWords}</span></dd>
			</div>
			<div class="row">
				<dt>The weight</dt>
				<dd>
					<Tex math={weightTex} trust />
					{#if finite}<span class="also"
							>The area under Re <Tex math={ETA} trust /> against <Tex math="\omega" /> is <Tex
								math={`(\\pi/2)\\,${MU}`}
								trust
							/>; the plot holds {percent(plotShare)}% of it.</span
						>{/if}
				</dd>
			</div>
			<div class="row">
				<dt>The glow</dt>
				<dd>
					<Tex math={powerTex} /><Tex math={countTex} /><span class="also"
						>The power and the gravitons sent each second by a cubic metre, in all directions.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Effective friction</dt>
				<dd>
					<Tex math={etaEffTex} trust /><span class="also"
						>The constant friction that would send the same power.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>The mean energy</dt>
				<dd>
					<Tex math={meanTex} /><span class="also"
						>The power divided by the count, per graviton.</span
					>
				</dd>
			</div>
			<div class="row">
				<dt>Of the bound</dt>
				<dd class="bound">
					{#if Number.isFinite(g.weight)}
						<span class="share"
							><strong>{percent(g.powerShare)}%</strong> of the power bound, <Tex
								math={pBoundTex}
								trust
							/></span
						>
						<span class="share"
							><strong>{percent(g.countShare)}%</strong> of the count bound, <Tex
								math={nBoundTex}
								trust
							/></span
						>
						{#if isCeiling}<span class="also"
								>Set by the electrons’ weight, of which the ceiling is the most at each frequency.</span
							>{/if}
					{:else}
						<span class="also"
							>None: a friction that never falls has no finite weight to bound it.</span
						>
					{/if}
				</dd>
			</div>
		</dl>
		<p class="note">
			The spectra are the reference models of the paper’s Table of materials at 293 K; only the
			pairs of phonons, and with its switch copper’s collision time, change with the temperature. A
			Raman line’s weight is three fifths of Kleinman’s, averaged over the directions of a wave. The
			glow is <Tex
				math={`4\\pi\\alpha B_\\omega = (16G\\hbar/\\pi c^5)\\,\\mathrm{Re}\\,${ETA}\\,\\omega^3\\bar n`}
				trust
			/>, and the bounds are eq:glow-bound’s. The frequency axis widens when the temperature needs
			it; both vertical axes fit their curves, and hold still while your line is dragged. Every
			curve and number is computed by quadrature.
		</p>
	</div>
</div>

<style>
	.glow-bound {
		font-family: var(--font-sans);
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		text-align: left;
		color: var(--text);
	}

	/* --- the picture ---------------------------------------------------------------------- */

	.stage {
		padding: 0.6rem 0.9rem 0.7rem;
		background: radial-gradient(circle at 50% 35%, var(--bg-raised) 0%, var(--bg-sunken) 85%);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
		-webkit-user-select: none;
	}

	svg.dragging {
		cursor: grabbing;
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
	}

	.dim {
		fill: var(--text-faint);
	}

	.end {
		text-anchor: end;
	}

	.tick {
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}

	.y-tick {
		text-anchor: end;
		dominant-baseline: middle;
		font-variant-numeric: tabular-nums;
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

	.sub.it {
		font-size: 0.86em;
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

	.grid {
		stroke: color-mix(in srgb, var(--text) 7%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	.grid.axis {
		stroke: color-mix(in srgb, var(--text) 30%, transparent);
	}

	.minor {
		stroke: color-mix(in srgb, var(--text) 35%, transparent);
		stroke-width: calc(1px * var(--u, 1));
	}

	/* the temperature's weighting is neutral (NOTATION.md, Part 10): faint ink */
	.planck {
		fill: none;
		stroke: color-mix(in srgb, var(--text) 32%, transparent);
		stroke-width: calc(1.2px * var(--u, 1));
		stroke-linejoin: round;
	}

	.placeholder {
		stroke: color-mix(in srgb, var(--text) 55%, transparent);
		stroke-width: calc(1px * var(--u, 1));
		stroke-dasharray: calc(5px * var(--u, 1)) calc(3px * var(--u, 1));
	}

	/* the friction and its glow are matter's */
	.matter-fill {
		fill: color-mix(in srgb, var(--q-matter) 22%, transparent);
		stroke: none;
	}

	.matter-fill.strong {
		fill: color-mix(in srgb, var(--q-matter) 34%, transparent);
	}

	.matter-line {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-linejoin: round;
	}

	/* a ceiling is not a spectrum: dotted, as in the paper's figure */
	.matter-line.ceiling {
		stroke-dasharray: calc(0.1px * var(--u, 1)) calc(3px * var(--u, 1));
		stroke-linecap: round;
		stroke-width: calc(2px * var(--u, 1));
	}

	.pairs-line {
		fill: none;
		stroke: var(--q-matter);
		stroke-width: calc(1.1px * var(--u, 1));
		stroke-dasharray: calc(4px * var(--u, 1)) calc(2.5px * var(--u, 1));
	}

	.handle,
	.grip {
		cursor: grab;
		touch-action: none;
		outline: none;
	}

	.hit {
		fill: transparent;
	}

	.focus {
		fill: none;
		stroke: var(--accent);
		stroke-width: calc(1.5px * var(--u, 1));
		stroke-dasharray: calc(3px * var(--u, 1)) calc(3px * var(--u, 1));
		opacity: 0;
	}

	.handle:focus-visible .focus {
		opacity: 1;
	}

	.dot {
		fill: var(--q-matter);
		stroke: var(--bg-sunken);
		stroke-width: calc(1.4px * var(--u, 1));
	}

	.grip-bar {
		fill: var(--text);
		stroke: var(--bg-sunken);
		stroke-width: calc(1px * var(--u, 1));
	}

	.peak-words {
		fill: var(--text);
		font-variant-numeric: tabular-nums;
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
		flex: none;
		display: inline-block;
		width: 1.1rem;
		height: 0;
		border-top: 1.5px solid;
	}

	.area-key {
		height: 0.6rem;
		border-color: var(--q-matter);
		background: color-mix(in srgb, var(--q-matter) 22%, transparent);
	}

	.pairs-key {
		border-top-style: dashed;
		border-color: var(--q-matter);
	}

	.planck-key {
		border-color: color-mix(in srgb, var(--text) 32%, transparent);
	}

	.placeholder-key {
		border-top-style: dashed;
		border-color: color-mix(in srgb, var(--text) 55%, transparent);
	}

	/* --- the controls and the numbers ------------------------------------------------------- */

	.bar {
		display: grid;
		gap: 0.7rem;
		padding: 0.7rem 0.9rem 0.8rem;
		border-top: 1px solid var(--line);
		background: var(--bg-raised);
	}

	.materials {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		padding: 3px;
		gap: 3px;
		border-radius: 11px;
		background: color-mix(in srgb, var(--text) 6%, transparent);
		border: 1px solid var(--line);
	}

	.materials button {
		min-width: 0;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.1rem;
		min-height: 2.6rem;
		padding: 0.3rem 0.2rem;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text-dim);
		font: 500 0.74rem/1.15 var(--font-sans);
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.15s,
			color 0.15s;
	}

	.m-sub {
		font-size: 0.66rem;
		font-weight: 400;
		color: var(--text-faint);
		white-space: nowrap;
	}

	.materials button[aria-pressed='true'] {
		background: var(--bg);
		color: var(--text);
		box-shadow: inset 0 0 0 1px var(--line-strong);
	}

	.materials button[aria-pressed='true'] .m-name {
		color: var(--q-matter);
	}

	.materials button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	@media (hover: hover) {
		.materials button[aria-pressed='false']:hover {
			color: var(--text);
		}
	}

	.slot {
		min-width: 0;
	}

	.switches {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem;
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

	.readouts dd.bound {
		flex-direction: column;
		gap: 0.25rem;
	}

	.share {
		min-width: 0;
	}

	.share strong {
		font-weight: 600;
		color: var(--text);
	}

	/* sentences keep the font's own figures */
	.also {
		color: var(--text-dim);
		text-wrap: pretty;
		font-variant-numeric: normal;
	}

	.note {
		margin: 0.7rem 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid var(--line);
		color: var(--text-faint);
		font-size: 0.72rem;
		line-height: 1.45;
		text-wrap: pretty;
	}

	@media (max-width: 560px) {
		.stage {
			padding: 0.5rem 0.5rem 0.6rem;
		}

		.materials {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.switches {
			grid-template-columns: minmax(0, 1fr);
		}

		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.materials button {
			transition: none;
		}
	}
</style>
